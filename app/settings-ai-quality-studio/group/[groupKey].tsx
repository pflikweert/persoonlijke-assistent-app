import { router, useFocusEffect, useLocalSearchParams, usePathname } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedView } from '@/components/themed-view';
import {
  AdminConsoleButton,
  AdminConsoleHeader,
  AdminConsoleShell,
  AdminListTableHeader,
  AdminListTableRow,
  AdminSectionList,
  AdminStatusChip,
  AdminStatusNotice,
} from '@/components/ui/admin-console-primitives';
import { StateBlock } from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  createAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
} from '@/services';
import type { AiQualityFamilyTaskReadModel, AiTaskSummary } from '@/types';
import { spacing } from '@/theme';
import {
  getAiQualityFamilyPrimaryTaskKey,
  getAiQualityFamilyReadModel,
  getAiQualityTaskLabel,
} from '@/services/ai-quality-studio/readmodel';
import { getSettingsBackTarget } from '@/src/lib/navigation/settings-navigation';

function runtimeBadgeLabel(item: AiQualityFamilyTaskReadModel): string {
  if (item.metadata.isRuntimeDriver) return 'Driver';
  if (item.metadata.variantRole === 'repair') return 'Repair';
  if (item.metadata.variantRole === 'renormalization') return 'Renormalization';
  if (item.metadata.variantRole) return 'Variant';
  if (item.metadata.editorScope === 'read_only_part') return 'Read-only';
  return 'Prompt';
}

export default function AiQualityStudioGroupScreen() {
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
        title={group?.title ?? 'Groep'}
        subtitle={group?.description ?? 'AI Quality Studio'}
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
          <AdminStatusNotice
            variant="inline"
            tone={groupIsLive ? 'success' : 'warning'}
            title={groupIsLive ? 'Runtime actief' : group.statusSummary}
            detail={[group.componentCountLabel, group.sharedRuntimeCall ? 'gedeelde call' : null].filter(Boolean).join(' · ')}
          />

          {group.editorScope === 'family' && group.editorEntryTaskKey ? (
            <AdminSectionList
              title="Prompt"
              variant="plain"
              action={
                <AdminConsoleButton
                  label={openingPrompt ? 'Openen…' : 'Open'}
                  onPress={() => void handleOpenSharedPrompt()}
                  disabled={openingPrompt}
                  icon="edit"
                />
              }
            >
              <AdminListTableRow
                title="Gedeelde prompt"
                description="Centrale prompt voor deze promptfamilie."
                metadata={group.sharedRuntimeCall ? 'Gedeelde runtime-call' : group.componentCountLabel}
                draftLabel={groupTasks.some((item) => item.task.hasDraft) ? 'Draft' : null}
                actionLabel="Open"
                onPress={() => void handleOpenSharedPrompt()}
                disabled={openingPrompt}
              />
            </AdminSectionList>
          ) : null}

          <AdminSectionList title="Onderdelen" variant="plain">
            <AdminListTableHeader />
            <ThemedView style={styles.taskList}>
              {groupTasks.map((item) => {
                const destinationTaskKey =
                  item.metadata.editorScope === 'read_only_part'
                    ? item.metadata.editorTargetTaskKey
                    : item.task.key;
                const rowRole = runtimeBadgeLabel(item);
                const isMissingBaseline = !item.task.liveVersion;

                return (
                  <AdminListTableRow
                    key={item.task.id}
                    title={getAiQualityTaskLabel(item.task.key, item.task.label)}
                    description={item.task.description ?? 'Onderdeel in outputstructuur.'}
                    metadata={[
                      item.metadata.managedOutputField ? `Output: ${item.metadata.managedOutputField}` : null,
                      rowRole !== 'Prompt' ? rowRole : null,
                      item.metadata.editorScope === 'read_only_part'
                        ? `Beheer via ${item.metadata.editorTargetTaskKey ?? 'gedeelde prompt'}`
                        : null,
                    ].filter(Boolean).join(' · ')}
                    draftLabel={item.task.hasDraft ? 'Draft' : null}
                    actionLabel={item.metadata.editorScope === 'read_only_part' ? 'Bekijk' : 'Open'}
                    chips={
                      isMissingBaseline ? (
                        <AdminStatusChip label="Baseline ontbreekt" tone="warning" />
                      ) : null
                    }
                    onPress={() => {
                      if (!destinationTaskKey) return;
                      router.push(`/settings-ai-quality-studio/${destinationTaskKey}` as never);
                    }}
                  />
                );
              })}
            </ThemedView>
          </AdminSectionList>
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
});
