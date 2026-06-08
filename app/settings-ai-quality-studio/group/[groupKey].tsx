import { router, useFocusEffect, useLocalSearchParams, usePathname } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminConsoleButton,
  AdminConsoleHeader,
  AdminConsolePanel,
  AdminConsoleShell,
  AdminDenseRow,
  AdminStatusChip,
} from '@/components/ui/admin-console-primitives';
import { StateBlock } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  createAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
} from '@/services';
import type { AiQualityFamilyTaskReadModel, AiTaskSummary } from '@/types';
import { colorTokens, radius, spacing } from '@/theme';
import {
  getAiQualityFamilyPrimaryTaskKey,
  getAiQualityFamilyReadModel,
  getAiQualityTaskLabel,
  getAiQualityTaskStatus,
} from '@/services/ai-quality-studio/readmodel';
import { getSettingsBackTarget } from '@/src/lib/navigation/settings-navigation';

function taskRowStatus(task: AiTaskSummary): string {
  const status = getAiQualityTaskStatus(task);
  if (status === 'runtime') return 'Runtime actief';
  if (status === 'draft') return 'Draft actief';
  return 'Niet ingesteld';
}

function runtimeBadgeLabel(item: AiQualityFamilyTaskReadModel): string {
  if (item.metadata.isRuntimeDriver) return 'Driver';
  if (item.metadata.variantRole === 'repair') return 'Repair';
  if (item.metadata.variantRole === 'renormalization') return 'Renormalization';
  if (item.metadata.variantRole) return 'Variant';
  if (item.metadata.editorScope === 'read_only_part') return 'Read-only';
  return 'Prompt';
}

export default function AiQualityStudioGroupScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const pathname = usePathname();
  const { groupKey } = useLocalSearchParams<{ groupKey?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openingPrompt, setOpeningPrompt] = useState(false);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [tasks, setTasks] = useState<AiTaskSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const group = useMemo(
    () => getAiQualityFamilyReadModel(tasks, typeof groupKey === 'string' ? groupKey : ''),
    [groupKey, tasks]
  );
  const groupTasks = group?.tasks ?? [];
  const groupIsLive = Boolean(group?.statusSummary.includes('live') && !group.statusSummary.startsWith('0/'));

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allowed = await hasAdminAiQualityStudioAccess();
      setAdminAccess(allowed);
      if (!allowed) {
        setTasks([]);
        return;
      }

      const nextTasks = await fetchAdminAiQualityStudioTasks();
      setTasks(nextTasks);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useFocusEffect(
    useCallback(() => {
      if (!group || loading) return;
      if (groupTasks.length <= 1) {
        const taskKey = getAiQualityFamilyPrimaryTaskKey(tasks, group.key);
        if (taskKey) {
          router.replace(`/settings-ai-quality-studio/${taskKey}` as never);
        }
      }
    }, [group, groupTasks.length, loading, tasks])
  );

  async function handleOpenSharedPrompt() {
    if (!group?.editorEntryTaskKey || openingPrompt) return;
    setOpeningPrompt(true);
    setError(null);
    try {
      const detail = await fetchAdminAiQualityStudioTaskDetail(group.editorEntryTaskKey);
      const draft = detail.versions.find((item) => item.status === 'draft') ?? null;
      if (draft) {
        router.push(`/settings-ai-quality-studio/${group.editorEntryTaskKey}/draft/${draft.id}` as never);
        return;
      }

      const created = await createAdminAiQualityStudioDraftVersion(group.editorEntryTaskKey);
      router.push(`/settings-ai-quality-studio/${group.editorEntryTaskKey}/draft/${created.version.id}` as never);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setOpeningPrompt(false);
    }
  }

  return (
    <AdminConsoleShell
      onBack={() => router.replace(getSettingsBackTarget(pathname) as never)}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.scrollContent}
    >
      <AdminConsoleHeader
        eyebrow={group?.key ?? 'AIQS family'}
        title={group?.title ?? 'Groep'}
        subtitle={group?.description ?? 'AI Quality Studio'}
        chips={
          group ? (
            <>
              <AdminStatusChip label={group.componentCountLabel} />
              <AdminStatusChip label={group.statusSummary} tone={groupIsLive ? 'success' : 'warning'} />
              {group.sharedRuntimeCall ? <AdminStatusChip label="Gedeelde runtime-call" tone="info" /> : null}
            </>
          ) : null
        }
      />

      {!group ? (
        <StateBlock tone="error" message="Onbekende groep" detail="Ga terug en kies een geldige groep." />
      ) : null}

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor admins met AIQS-rechten."
        />
      ) : null}

      {loading ? <StateBlock tone="loading" message="Onderdelen laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon onderdelen niet laden." detail={error} /> : null}

      {!loading && !error && group ? (
        <>
          {group.editorScope === 'family' && group.editorEntryTaskKey ? (
            <AdminConsolePanel
              title="Gedeelde prompt"
              subtitle="Deze familie draait via één centrale runtimeprompt."
              action={
                <AdminConsoleButton
                label={openingPrompt ? 'Prompt openen…' : 'Open gedeelde prompt'}
                onPress={() => void handleOpenSharedPrompt()}
                disabled={openingPrompt}
                  icon="edit"
                  tone="primary"
                />
              }
            >
              <ThemedView />
            </AdminConsolePanel>
          ) : null}

          <AdminConsolePanel title="Onderdelen" subtitle="Drivers, technische varianten en compound members blijven zichtbaar.">
            <ThemedView style={styles.taskList}>
              {groupTasks.map((item) => {
                const destinationTaskKey =
                  item.metadata.editorScope === 'read_only_part'
                    ? item.metadata.editorTargetTaskKey
                    : item.task.key;
                const actionLabel =
                  item.metadata.isRuntimeDriver
                    ? 'Runtime-driver voor deze groep'
                    : item.metadata.variantRole
                      ? `Technische ${item.metadata.variantRole}-variant`
                      : item.metadata.editorScope === 'family'
                        ? 'Onderdeel van de gedeelde prompt'
                        : item.metadata.editorScope === 'task'
                          ? 'Zelfstandig onderdeel'
                          : 'Read-only onderdeel van gedeelde call';

                return (
                  <Pressable
                    key={item.task.id}
                    accessibilityRole="button"
                    onPress={() => {
                      if (!destinationTaskKey) return;
                      router.push(`/settings-ai-quality-studio/${destinationTaskKey}` as never);
                    }}
                    style={styles.taskRowPressable}
                  >
                    <AdminDenseRow
                      title={getAiQualityTaskLabel(item.task.key, item.task.label)}
                      subtitle={item.task.description ?? 'Onderdeel in outputstructuur.'}
                      meta={[
                        taskRowStatus(item.task),
                        item.metadata.managedOutputField ? `Output: ${item.metadata.managedOutputField}` : null,
                        item.metadata.runtimeBindingKey ? item.metadata.runtimeBindingKey : null,
                        item.metadata.editorScope === 'read_only_part'
                          ? `Beheer via ${item.metadata.editorTargetTaskKey ?? 'gedeelde prompt'}`
                          : null,
                      ].filter(Boolean).join(' · ')}
                      chips={
                        <>
                          <AdminStatusChip
                            label={runtimeBadgeLabel(item)}
                            tone={item.metadata.isRuntimeDriver ? 'success' : item.metadata.variantRole ? 'info' : item.metadata.editorScope === 'read_only_part' ? 'neutral' : 'warning'}
                          />
                          {item.task.hasDraft ? <AdminStatusChip label="Draft aanwezig" tone="warning" /> : null}
                          {item.task.liveVersion ? <AdminStatusChip label="Live" tone="success" /> : null}
                        </>
                      }
                      trailing={<ThemedText type="caption" style={{ color: palette.mutedSoft }}>{actionLabel}</ThemedText>}
                    />
                  </Pressable>
                );
              })}
            </ThemedView>
          </AdminConsolePanel>
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminConsoleShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  taskList: {
    gap: 0,
  },
  taskRowPressable: {
    borderRadius: radius.md,
  },
});
