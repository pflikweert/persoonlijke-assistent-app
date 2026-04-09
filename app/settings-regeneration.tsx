import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  StateBlock,
  SurfaceSection,
} from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  fetchAdminRegenerationJobStatus,
  fetchLatestAdminRegenerationJob,
  hasAdminRegenerationAccess,
  startAdminRegenerationJob,
} from '@/services';
import type {
  AdminRegenerationJobView,
  AdminRegenerationStepType,
  AdminRegenerationStepView,
} from '@/services/admin-regeneration';
import { colorTokens, radius, spacing } from '@/theme';

type StepOption = {
  type: AdminRegenerationStepType;
  label: string;
  description: string;
};

const STEP_OPTIONS: StepOption[] = [
  {
    type: 'entries_normalized',
    label: 'Entries',
    description: 'Alleen verouderde of legacy entries opnieuw normaliseren.',
  },
  {
    type: 'day_journals',
    label: 'Dagjournals',
    description: 'Dagoverzichten opnieuw opbouwen op basis van entries.',
  },
  {
    type: 'week_reflections',
    label: 'Weekreflecties',
    description: 'Weekreflecties opnieuw genereren.',
  },
  {
    type: 'month_reflections',
    label: 'Maandreflecties',
    description: 'Maandreflecties opnieuw genereren.',
  },
];

function statusLabel(status: AdminRegenerationJobView['status']): string {
  if (status === 'queued') {
    return 'In wachtrij';
  }
  if (status === 'running') {
    return 'Bezig';
  }
  if (status === 'completed') {
    return 'Afgerond';
  }
  if (status === 'failed') {
    return 'Mislukt';
  }

  return 'Geannuleerd';
}

function stepLabel(type: AdminRegenerationStepType): string {
  return STEP_OPTIONS.find((option) => option.type === type)?.label ?? type;
}

function summarizeJob(job: AdminRegenerationJobView): {
  total: number;
  queued: number;
  openaiCompleted: number;
  applied: number;
  failed: number;
  remaining: number;
} {
  return job.steps.reduce(
    (acc, step) => {
      acc.total += Number(step.total ?? 0);
      acc.queued += Number(step.queued ?? 0);
      acc.openaiCompleted += Number(step.openai_completed ?? 0);
      acc.applied += Number(step.applied ?? 0);
      acc.failed += Number(step.failed ?? 0);
      acc.remaining += Number(step.remaining ?? 0);
      return acc;
    },
    {
      total: 0,
      queued: 0,
      openaiCompleted: 0,
      applied: 0,
      failed: 0,
      remaining: 0,
    }
  );
}

export default function SettingsRegenerationScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [job, setJob] = useState<AdminRegenerationJobView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);

  const [selection, setSelection] = useState<Record<AdminRegenerationStepType, boolean>>({
    entries_normalized: true,
    day_journals: true,
    week_reflections: true,
    month_reflections: true,
  });

  const selectedTypes = useMemo(
    () => STEP_OPTIONS.filter((option) => selection[option.type]).map((option) => option.type),
    [selection]
  );

  const isRunning = job?.status === 'queued' || job?.status === 'running';

  const loadLatestJob = useCallback(async () => {
    if (adminAccess !== true) {
      return;
    }

    try {
      const latest = await fetchLatestAdminRegenerationJob();
      setJob(latest);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    }
  }, [adminAccess]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const allowed = await hasAdminRegenerationAccess();
        if (!cancelled) {
          setAdminAccess(allowed);
        }
      } catch {
        if (!cancelled) {
          setAdminAccess(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void loadLatestJob();
  }, [loadLatestJob]);

  useFocusEffect(
    useCallback(() => {
      void loadLatestJob();
    }, [loadLatestJob])
  );

  const stepByType = useMemo(() => {
    const map = new Map<AdminRegenerationStepType, AdminRegenerationStepView>();
    for (const step of job?.steps ?? []) {
      map.set(step.step_type, step as AdminRegenerationStepView);
    }
    return map;
  }, [job]);

  useEffect(() => {
    if (!job || !isRunning) {
      return;
    }

    let cancelled = false;
    let ticking = false;

    const run = async () => {
      if (cancelled || ticking) {
        return;
      }

      ticking = true;
      try {
        const nextJob = await fetchAdminRegenerationJobStatus({
          jobId: job.id,
          driveWorker: true,
        });
        if (!cancelled) {
          setJob(nextJob);
          setError(null);
        }
      } catch (nextError) {
        if (!cancelled) {
          const parsed = classifyUnknownError(nextError);
          setError(parsed.message);
        }
      } finally {
        ticking = false;
      }
    };

    void run();
    const interval = setInterval(() => {
      void run();
    }, 7000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [job, isRunning]);

  async function handleStart() {
    if (adminAccess !== true || selectedTypes.length === 0 || busy || isRunning) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const createdJob = await startAdminRegenerationJob({ selectedTypes });
      setJob(createdJob);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRefresh() {
    if (adminAccess !== true || !job || busy) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const nextJob = await fetchAdminRegenerationJobStatus({
        jobId: job.id,
        driveWorker: true,
      });
      setJob(nextJob);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setBusy(false);
    }
  }

  const totals = job ? summarizeJob(job) : null;

  return (
    <>
      <ScreenContainer
        scrollable
        fixedHeader={
          <ScreenHeader
            title="Data opnieuw verwerken"
            titleType="screenTitle"
            subtitle="Admin-only bulk regeneratie via OpenAI Batch API."
            leftAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ga terug"
                onPress={() => router.back()}
                style={[styles.iconButton, { backgroundColor: palette.surfaceLow }]}>
                <MaterialIcons name="arrow-back" size={20} color={palette.primary} />
              </Pressable>
            }
            rightAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                onPress={() => setMenuVisible(true)}
                style={[styles.iconButton, { backgroundColor: palette.surfaceLow }]}>
                <MaterialIcons name="menu" size={20} color={palette.primary} />
              </Pressable>
            }
          />
        }
        contentContainerStyle={styles.scrollContent}>
        {adminAccess === false ? (
          <StateBlock
            tone="info"
            message="Geen toegang"
            detail="Deze pagina is alleen zichtbaar voor allowlisted admins."
          />
        ) : null}

        {adminAccess !== false ? (
          <SurfaceSection
            title="Selecteer datatypes"
            subtitle="Kies één of meer onderdelen die voor alle gebruikers opnieuw verwerkt worden.">
            <ThemedView style={styles.selectionList}>
              {STEP_OPTIONS.map((option) => {
                const selected = selection[option.type];
                return (
                  <Pressable
                    key={option.type}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    onPress={() => {
                      setSelection((current) => ({
                        ...current,
                        [option.type]: !current[option.type],
                      }));
                    }}
                    style={[
                      styles.selectionRow,
                      selected
                        ? {
                            backgroundColor: palette.surfaceLow,
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: palette.primary,
                          }
                        : null,
                    ]}>
                    <ThemedView style={styles.selectionLeft}>
                      <ThemedText type="defaultSemiBold">{option.label}</ThemedText>
                      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                        {option.description}
                      </ThemedText>
                    </ThemedView>
                    <MaterialIcons
                      name={selected ? 'check-circle' : 'radio-button-unchecked'}
                      size={20}
                      color={selected ? palette.primary : palette.mutedSoft}
                    />
                  </Pressable>
                );
              })}
            </ThemedView>

            <ThemedView style={styles.actions}>
              <PrimaryButton
                label={busy ? 'Starten...' : 'Start opnieuw verwerken'}
                onPress={() => void handleStart()}
                disabled={adminAccess !== true || busy || isRunning || selectedTypes.length === 0}
              />
              {job ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Ververs status"
                  onPress={() => void handleRefresh()}
                  style={styles.refreshButton}>
                  <MaterialIcons name="refresh" size={18} color={palette.primary} />
                  <ThemedText type="bodySecondary" style={{ color: palette.primary }}>
                    Ververs status
                  </ThemedText>
                </Pressable>
              ) : null}
            </ThemedView>

            <MetaText>Minimaal één datatype selecteren. Alleen allowlisted admins hebben toegang.</MetaText>
          </SurfaceSection>
        ) : null}

        {error ? <StateBlock tone="error" message="Actie mislukt" detail={error} /> : null}

        {job && adminAccess === true ? (
          <SurfaceSection
            title="Jobstatus"
            subtitle={`Job ${job.id.slice(0, 8)} · ${statusLabel(job.status)}`}>
            {totals ? (
              <ThemedView style={styles.totalsCard}>
                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  Totaal: {totals.total} · Queued: {totals.queued} · OpenAI klaar: {totals.openaiCompleted}
                </ThemedText>
                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  Applied: {totals.applied} · Failed: {totals.failed} · Remaining: {totals.remaining}
                </ThemedText>
              </ThemedView>
            ) : null}

            <ThemedView style={styles.stepList}>
              {STEP_OPTIONS.map((option) => {
                const step = stepByType.get(option.type);
                const total = step ? Number(step.total ?? 0) : 0;
                const queued = step ? Number(step.queued ?? 0) : 0;
                const openAiCompleted = step ? Number(step.openai_completed ?? 0) : 0;
                const applied = step ? Number(step.applied ?? 0) : 0;
                const failed = step ? Number(step.failed ?? 0) : 0;
                const remaining = step ? Number(step.remaining ?? 0) : 0;
                const phase = step?.phase ?? 'niet geselecteerd';

                return (
                  <ThemedView key={option.type} style={styles.stepCard}>
                    <ThemedView style={styles.stepHeader}>
                      <ThemedText type="defaultSemiBold">{stepLabel(option.type)}</ThemedText>
                      <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                        {step?.status ?? 'n/a'}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                      fase: {phase}
                    </ThemedText>
                    <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                      total {total} · queued {queued} · openai {openAiCompleted}
                    </ThemedText>
                    <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                      applied {applied} · failed {failed} · remaining {remaining}
                    </ThemedText>
                  </ThemedView>
                );
              })}
            </ThemedView>

            {job.status === 'completed' ? (
              <StateBlock
                tone={totals && totals.failed > 0 ? 'info' : 'success'}
                message={totals && totals.failed > 0 ? 'Job afgerond met failures' : 'Job afgerond'}
                detail={
                  totals
                    ? `Verwerkt: ${totals.applied}/${totals.total}. Failures: ${totals.failed}.`
                    : undefined
                }
              />
            ) : null}
          </SurfaceSection>
        ) : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionList: {
    gap: spacing.sm,
  },
  selectionRow: {
    borderRadius: radius.lg,
    minHeight: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  selectionLeft: {
    flex: 1,
    gap: spacing.xxs,
  },
  actions: {
    gap: spacing.sm,
  },
  refreshButton: {
    minHeight: 42,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  totalsCard: {
    gap: spacing.xs,
  },
  stepList: {
    gap: spacing.sm,
  },
  stepCard: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
