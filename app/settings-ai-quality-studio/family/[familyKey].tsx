import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AdminMetaStrip, AdminPageHero, AdminShell, SettingsTopNav } from '@/components/ui/settings-screen-primitives';
import { MetaText, StateBlock, SurfaceSection } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
} from '@/services';
import type { AiTaskSummary } from '@/types';
import { colorTokens, radius, spacing } from '@/theme';
import {
  AI_QUALITY_TASK_LABELS,
  getAiQualityFamilyByKey,
  getAiQualityFamilyStatusSummary,
  getAiQualityFamilyTasks,
  type AiQualityFamilyKey,
} from '../_shared';

function taskRowStatus(task: AiTaskSummary): string {
  if (task.liveVersion) return 'Runtime actief';
  if (task.hasDraft) return 'Draft actief';
  return 'Niet ingesteld';
}

export default function AiQualityStudioFamilyScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { familyKey } = useLocalSearchParams<{ familyKey?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [tasks, setTasks] = useState<AiTaskSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const family = useMemo(
    () => getAiQualityFamilyByKey(typeof familyKey === 'string' ? familyKey : ''),
    [familyKey]
  );

  const familyTasks = useMemo(() => {
    if (!family) return [];
    return getAiQualityFamilyTasks(family.key as AiQualityFamilyKey, tasks);
  }, [family, tasks]);

  const statusSummary = useMemo(() => getAiQualityFamilyStatusSummary(familyTasks), [familyTasks]);

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

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero title={family?.title ?? 'Family'} subtitle={family?.description ?? 'AI Quality Studio'} />

      {family ? <AdminMetaStrip items={[family.metaLabel, statusSummary]} /> : null}

      {!family ? (
        <StateBlock tone="error" message="Onbekende family" detail="Ga terug en kies een geldige family." />
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

      {!loading && !error && family ? (
        <SurfaceSection title="Onderdelen">
          <ThemedView style={styles.taskList}>
            {familyTasks.map((task) => (
              <Pressable
                key={task.id}
                accessibilityRole="button"
                accessibilityLabel={`${AI_QUALITY_TASK_LABELS[task.key] ?? task.label} bekijken en aanpassen`}
                onPress={() => router.push(`/settings-ai-quality-studio/${task.key}` as never)}
                style={[styles.taskRow, { backgroundColor: palette.surfaceLow }]}
              >
                <ThemedView style={styles.taskRowTop}>
                  <ThemedText type="defaultSemiBold">{AI_QUALITY_TASK_LABELS[task.key] ?? task.label}</ThemedText>
                  <MetaText>{task.description ?? 'Onderdeel aanpassen en testen.'}</MetaText>
                </ThemedView>
                <MetaText>Status: {taskRowStatus(task)}</MetaText>
                <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                  Bekijken en aanpassen
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </SurfaceSection>
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
