import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AdminMetaStrip, AdminPageHero, AdminShell, SettingsTopNav } from '@/components/ui/settings-screen-primitives';
import { MetaText, PrimaryButton, StateBlock, SurfaceSection } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  createAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
} from '@/services';
import type { AiTaskSummary } from '@/types';
import { colorTokens, radius, spacing } from '@/theme';
import {
  getAiQualityEditableTasksForFamily,
  getAiQualityFamilyPrimaryTaskKey,
  getAiQualityFamilyReadModel,
  getAiQualityTaskLabel,
  getAiQualityTaskStatus,
} from '../readmodel';

function taskRowStatus(task: AiTaskSummary): string {
  const status = getAiQualityTaskStatus(task);
  if (status === 'runtime') return 'Runtime actief';
  if (status === 'draft') return 'Draft actief';
  return 'Niet ingesteld';
}

export default function AiQualityStudioGroupScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
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
  const editableTasks = useMemo(
    () => getAiQualityEditableTasksForFamily(tasks, typeof groupKey === 'string' ? groupKey : ''),
    [groupKey, tasks]
  );

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
      if (editableTasks.length <= 1) {
        const taskKey = getAiQualityFamilyPrimaryTaskKey(tasks, group.key);
        if (taskKey) {
          router.replace(`/settings-ai-quality-studio/${taskKey}` as never);
        }
      }
    }, [editableTasks.length, group, loading, tasks])
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
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero title={group?.title ?? 'Groep'} subtitle={group?.description ?? 'AI Quality Studio'} />

      {group ? <AdminMetaStrip items={[group.componentCountLabel, group.statusSummary]} /> : null}

      {!group ? (
        <StateBlock tone="error" message="Onbekende groep" detail="Ga terug en kies een geldige groep." />
      ) : null}

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor allowlisted admins."
        />
      ) : null}

      {loading ? <StateBlock tone="loading" message="Onderdelen laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon onderdelen niet laden." detail={error} /> : null}

      {!loading && !error && group ? (
        <>
          {group.editorScope === 'family' && group.editorEntryTaskKey ? (
            <SurfaceSection title="Gedeelde prompt">
              <MetaText>
                Deze runtime-groep draait als één gedeelde call. Bewerk en test via één centrale prompt.
              </MetaText>
              <PrimaryButton
                label={openingPrompt ? 'Prompt openen…' : 'Open gedeelde prompt'}
                onPress={() => void handleOpenSharedPrompt()}
                disabled={openingPrompt}
              />
            </SurfaceSection>
          ) : null}

          <SurfaceSection title="Onderdelen">
            <ThemedView style={styles.taskList}>
              {editableTasks.map((item) => {
                const actionLabel =
                  item.metadata.editorScope === 'family'
                    ? 'Onderdeel van de gedeelde prompt'
                    : item.metadata.editorScope === 'task'
                      ? 'Zelfstandig onderdeel'
                      : 'Onderdeel van gedeelde call · niet los bewerkbaar';

                return (
                  <Pressable
                    key={item.task.id}
                    accessibilityRole="button"
                    onPress={() => router.push(`/settings-ai-quality-studio/${item.task.key}` as never)}
                    style={[styles.taskRow, { backgroundColor: palette.surfaceLow }]}
                  >
                    <ThemedView style={styles.taskRowTop}>
                      <ThemedText type="defaultSemiBold">{getAiQualityTaskLabel(item.task.key, item.task.label)}</ThemedText>
                      <MetaText>{item.task.description ?? 'Onderdeel in outputstructuur.'}</MetaText>
                    </ThemedView>
                    <MetaText>Status: {taskRowStatus(item.task)}</MetaText>
                    {item.metadata.managedOutputField ? (
                      <MetaText>Outputveld: {item.metadata.managedOutputField}</MetaText>
                    ) : null}
                    <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                      {actionLabel}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>
          </SurfaceSection>
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  taskList: {
    gap: spacing.sm,
  },
  taskRow: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  taskRowTop: {
    gap: spacing.xxs,
  },
});
