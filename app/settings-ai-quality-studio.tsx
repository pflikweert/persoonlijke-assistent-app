import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SettingsHeaderIconButton } from '@/components/ui/settings-screen-primitives';
import { MetaText, PrimaryButton, ScreenContainer, StateBlock, SurfaceSection } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
  importAdminAiQualityRuntimeBaseline,
} from '@/services';
import type { AiTaskSummary } from '@/types';
import { colorTokens, radius, spacing } from '@/theme';

type TaskGroupKey = 'moments' | 'today' | 'week' | 'month';

type TaskPresentation = {
  group: TaskGroupKey;
  label: string;
  description: string;
};

const TASK_ORDER: TaskGroupKey[] = ['moments', 'today', 'week', 'month'];

const GROUP_LABELS: Record<TaskGroupKey, string> = {
  moments: 'Momenten',
  today: 'Vandaag',
  week: 'Week',
  month: 'Maand',
};

const TASK_PRESENTATION_BY_KEY: Record<string, TaskPresentation> = {
  entry_cleanup: {
    group: 'moments',
    label: 'Moment opschonen',
    description: 'Maakt van ruwe invoer een leesbaar moment.',
  },
  entry_summary: {
    group: 'moments',
    label: 'Moment samenvatting',
    description: 'Korte samenvatting van één moment.',
  },
  day_summary: {
    group: 'today',
    label: 'Dag samenvatting',
    description: 'Korte samenvatting van je dag.',
  },
  day_narrative: {
    group: 'today',
    label: 'Dagverhaal',
    description: 'Verhalende terugblik op je dag.',
  },
  week_summary: {
    group: 'week',
    label: 'Week samenvatting',
    description: 'Korte samenvatting van je week.',
  },
  week_narrative: {
    group: 'week',
    label: 'Weekverhaal',
    description: 'Verhalende terugblik op je week.',
  },
  week_highlights: {
    group: 'week',
    label: 'Week highlights',
    description: 'Belangrijkste momenten van de week.',
  },
  week_reflection_points: {
    group: 'week',
    label: 'Week reflectiepunten',
    description: 'Kernpunten om op terug te kijken.',
  },
  month_summary: {
    group: 'month',
    label: 'Maand samenvatting',
    description: 'Korte samenvatting van je maand.',
  },
  month_narrative: {
    group: 'month',
    label: 'Maandverhaal',
    description: 'Verhalende terugblik op je maand.',
  },
  month_highlights: {
    group: 'month',
    label: 'Maand highlights',
    description: 'Belangrijkste momenten van de maand.',
  },
  month_reflection_points: {
    group: 'month',
    label: 'Maand reflectiepunten',
    description: 'Kernpunten om op terug te kijken.',
  },
};

function getTaskStatus(task: AiTaskSummary): 'Nog niet ingesteld' | 'Draft aanwezig' | 'Actief' {
  if (task.liveVersion) {
    return 'Actief';
  }
  if (task.hasDraft) {
    return 'Draft aanwezig';
  }
  return 'Nog niet ingesteld';
}

function getTaskPrimaryAction(task: AiTaskSummary): string {
  if (task.liveVersion) {
    return 'Bekijken en aanpassen';
  }
  if (task.hasDraft) {
    return 'Verder bewerken';
  }
  return 'Begin instellen';
}

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
      setAdminAccess(false);
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

  const groupedTasks = useMemo(() => {
    const byGroup = new Map<TaskGroupKey, AiTaskSummary[]>();
    for (const group of TASK_ORDER) {
      byGroup.set(group, []);
    }

    for (const task of tasks) {
      const configured = TASK_PRESENTATION_BY_KEY[task.key];
      const group = configured?.group ?? 'month';
      byGroup.get(group)?.push(task);
    }

    for (const [group, groupTasks] of byGroup.entries()) {
      groupTasks.sort((a, b) => {
        const aIndex = Object.keys(TASK_PRESENTATION_BY_KEY).indexOf(a.key);
        const bIndex = Object.keys(TASK_PRESENTATION_BY_KEY).indexOf(b.key);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        return a.label.localeCompare(b.label);
      });
      byGroup.set(group, groupTasks);
    }

    return byGroup;
  }, [tasks]);

  return (
    <ScreenContainer
      scrollable
      backgroundTone="flat"
      contentContainerStyle={styles.scrollContent}
      stickyHeaderIndices={[0]}
    >
      <ThemedView
        lightColor={colorTokens.light.surfaceLowest}
        darkColor={colorTokens.dark.surface}
        style={[styles.stickyTopBar, { borderBottomColor: palette.separator }]}
      >
        <SettingsHeaderIconButton
          icon="arrow-back"
          accessibilityLabel="Ga terug"
          onPress={() => router.back()}
        />
        <SettingsHeaderIconButton
          icon="menu"
          accessibilityLabel="Open menu"
          onPress={() => setMenuVisible(true)}
        />
      </ThemedView>

      <ThemedView style={styles.hero}>
        <ThemedText type="screenTitle">Kwaliteit verbeteren</ThemedText>
        <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
          Kies welk onderdeel je wilt bekijken of aanpassen.
        </ThemedText>
      </ThemedView>

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
                : 'Sommige onderdelen hebben al een runtime-baseline.'}
            </MetaText>
            <MetaText>
              {totals.live === 0
                ? 'Importeer eerst de huidige runtime-basis en werk daarna vanuit drafts.'
                : 'Je kunt hier nieuwe drafts maken, testen en verfijnen.'}
            </MetaText>

            <MetaText>
              {totals.live === 0
                ? 'Nog geen runtime-basis'
                : `${totals.live} onderdelen met runtime-basis`}
              {` · ${totals.draftOnly} drafts klaar om verder te testen · ${Math.max(0, totals.total - totals.live - totals.draftOnly)} onderdelen nog niet ingesteld`}
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
                detail="Dit is een normale startsituatie. Voeg eerst een onderdeel toe in de basisconfiguratie."
              />
            ) : null}
          </SurfaceSection>

          {!loading && !error
            ? TASK_ORDER.map((group) => {
                const items = groupedTasks.get(group) ?? [];
                if (items.length === 0) {
                  return null;
                }

                return (
                  <SurfaceSection
                    key={group}
                    title={GROUP_LABELS[group]}
                    subtitle={
                      group === 'moments'
                        ? 'Begin met Moment opschonen of Dag samenvatting.'
                        : group === 'today'
                          ? 'Hier bouw je de basis voor dagkwaliteit.'
                          : undefined
                    }
                    style={group === 'week' || group === 'month' ? styles.laterGroupSection : undefined}
                  >
                    <ThemedView style={styles.taskList}>
                      {items.map((task) => {
                        const meta = TASK_PRESENTATION_BY_KEY[task.key];
                        const status = getTaskStatus(task);
                        const action = getTaskPrimaryAction(task);

                        return (
                          <Pressable
                            key={task.id}
                            accessibilityRole="button"
                            accessibilityLabel={`${meta?.label ?? task.label} openen`}
                            onPress={() => router.push(`/settings-ai-quality-studio/${task.key}` as never)}
                            style={[styles.taskRow, { backgroundColor: palette.surfaceLow }]}
                          >
                            <ThemedView style={styles.taskRowTop}>
                              <ThemedText type="defaultSemiBold">{meta?.label ?? task.label}</ThemedText>
                              <MetaText>{meta?.description ?? task.description ?? 'Onderdeel bekijken'}</MetaText>
                            </ThemedView>

                            <MetaText>Status: {status}</MetaText>
                            <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                              {action}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </ThemedView>
                  </SurfaceSection>
                );
              })
            : null}
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  stickyTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    marginBottom: spacing.sm,
  },
  hero: {
    gap: spacing.sm,
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
  laterGroupSection: {
    marginTop: spacing.xs,
  },
});