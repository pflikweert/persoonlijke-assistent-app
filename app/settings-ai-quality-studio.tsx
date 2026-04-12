import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AdminMetaStrip, AdminPageHero, AdminShell, SettingsTopNav } from '@/components/ui/settings-screen-primitives';
import { MetaText, PrimaryButton, StateBlock, SurfaceSection } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
  importAdminAiQualityRuntimeBaseline,
} from '@/services';
import type { AiTaskSummary } from '@/types';
import { colorTokens, radius, spacing } from '@/theme';
import {
  AI_QUALITY_FAMILIES,
  getAiQualityFamilyStatusSummary,
  getAiQualityFamilyTasks,
} from './settings-ai-quality-studio/_shared';

export default function SettingsAiQualityStudioScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [importingBaseline, setImportingBaseline] = useState(false);
  const [tasks, setTasks] = useState<AiTaskSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

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
      if (parsed.code === 'AUTH_UNAUTHORIZED' || parsed.code === 'AUTH_MISSING') {
        setAdminAccess(false);
      } else {
        setAdminAccess(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImportBaseline = useCallback(async () => {
    if (importingBaseline) {
      return;
    }

    setImportingBaseline(true);
    setImportMessage(null);
    setError(null);

    try {
      const result = await importAdminAiQualityRuntimeBaseline();
      setImportMessage(
        `Geïmporteerd: ${result.inserted.length} · gelijk overgeslagen: ${result.skipped_equal.length} · conflict: ${result.skipped_conflict.length}`
      );
      await load();
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setImportingBaseline(false);
    }
  }, [importingBaseline, load]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const totals = useMemo(() => {
    let liveCount = 0;
    let draftOnlyCount = 0;
    for (const task of tasks) {
      if (task.liveVersion) {
        liveCount += 1;
      } else if (task.hasDraft) {
        draftOnlyCount += 1;
      }
    }

    return {
      total: tasks.length,
      live: liveCount,
      draftOnly: draftOnlyCount,
      noLive: Math.max(0, tasks.length - liveCount),
    };
  }, [tasks]);

  const familyRows = useMemo(
    () =>
      AI_QUALITY_FAMILIES.map((family) => {
        const familyTasks = getAiQualityFamilyTasks(family.key, tasks);
        return {
          ...family,
          status: getAiQualityFamilyStatusSummary(familyTasks),
          taskCount: familyTasks.length,
        };
      }),
    [tasks]
  );

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero
        title="Kwaliteit verbeteren"
        subtitle="Kies wat je wilt verfijnen: Momenten, Vandaag, Week of Maand."
      />

      <AdminMetaStrip
        items={
          totals.live === 0
            ? ['Nog geen runtime-baselines aanwezig']
            : [`${totals.live} onderdelen runtime actief`, `${totals.draftOnly} draft actief`]
        }
      />

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor allowlisted admins."
        />
      ) : null}

      {adminAccess !== false ? (
        <>
          <SurfaceSection>
            <MetaText>
              {totals.live === 0
                ? 'Nog geen runtime-baselines aanwezig.'
                : `${totals.live} onderdelen hebben runtime actief.`}
            </MetaText>

            {totals.live === 0 ? (
              <PrimaryButton
                label={importingBaseline ? 'Runtime-basis importeren…' : 'Importeer runtime-basis'}
                onPress={() => void handleImportBaseline()}
                disabled={importingBaseline || loading}
              />
            ) : null}

            {importMessage ? <MetaText>{importMessage}</MetaText> : null}

            {loading ? <MetaText>Laden…</MetaText> : null}

            {error ? (
              <StateBlock tone="error" message="Kon het overzicht niet laden." detail={error} />
            ) : null}

            {!loading && !error && tasks.length === 0 ? (
              <StateBlock
                tone="info"
                message="Nog geen onderdelen gevonden"
                detail="Importeer eerst de runtime-basis om families te openen."
              />
            ) : null}
          </SurfaceSection>

          {!loading && !error ? (
            <SurfaceSection title="Families">
              <ThemedView style={styles.taskList}>
                {familyRows.map((family) => (
                  <Pressable
                    key={family.key}
                    accessibilityRole="button"
                    accessibilityLabel={`${family.title} bekijken en aanpassen`}
                    onPress={() => router.push(`/settings-ai-quality-studio/family/${family.key}` as never)}
                    style={[styles.taskRow, { backgroundColor: palette.surfaceLow }]}
                  >
                    <ThemedView style={styles.taskRowTop}>
                      <ThemedText type="defaultSemiBold">{family.title}</ThemedText>
                      <MetaText>{family.description}</MetaText>
                    </ThemedView>

                    <MetaText>
                      {family.metaLabel} · {family.status}
                    </MetaText>
                    <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                      Bekijken en aanpassen
                    </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            </SurfaceSection>
          ) : null}
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