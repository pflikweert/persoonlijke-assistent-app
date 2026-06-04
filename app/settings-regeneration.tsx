import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedView } from '@/components/themed-view';
import {
  AdminActionBar,
  AdminConsoleKeyValue,
  AdminConsoleShell,
  AdminDenseRow,
  AdminInspectorPanel,
  AdminList,
  AdminMetricCard,
  AdminMetricGrid,
  AdminPageHeader,
  AdminPanel,
  AdminStatusBadge,
  AdminTimeline,
} from '@/components/ui/admin-console-primitives';
import {
  MetaText,
  StateBlock,
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
    <AdminConsoleShell
      title="Regeneration"
      onBack={() => router.back()}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.scrollContent}
      inspector={
        <AdminInspectorPanel title="Job context" subtitle="Bestaande Batch API flow">
          <ThemedView style={styles.inspectorStack}>
            <AdminConsoleKeyValue label="Access" value={adminAccess === true ? "Toegestaan" : adminAccess === false ? "Geen toegang" : "Controleren"} />
            <AdminConsoleKeyValue label="Selectie" value={`${selectedTypes.length} datatype(s)`} />
            <AdminConsoleKeyValue label="Laatste job" value={job ? job.id.slice(0, 8) : "Geen job"} />
          </ThemedView>
        </AdminInspectorPanel>
      }
    >
        <AdminPageHeader
          eyebrow="Admin job"
          title="Data opnieuw verwerken"
          subtitle="Admin-only bulk regeneratie via OpenAI Batch API."
          chips={
            <>
              <AdminStatusBadge label="Admin-only" tone="info" />
              {job ? <AdminStatusBadge label={statusLabel(job.status)} tone={job.status === 'failed' ? 'danger' : job.status === 'completed' ? 'success' : 'warning'} /> : null}
              {isRunning ? <AdminStatusBadge label="Polling actief" tone="info" /> : null}
            </>
          }
        />

        {adminAccess === false ? (
          <StateBlock
            tone="info"
            message="Geen toegang"
            detail="Deze pagina is alleen zichtbaar voor admins met rechten voor herverwerking."
          />
        ) : null}

        {adminAccess !== false ? (
          <AdminPanel
            title="Selecteer datatypes"
            subtitle="Kies één of meer onderdelen die voor alle gebruikers opnieuw verwerkt worden.">
            <AdminList>
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
                    style={styles.selectionPressable}>
                    <AdminDenseRow
                      title={option.label}
                      subtitle={option.description}
                      chips={<AdminStatusBadge label={selected ? "Geselecteerd" : "Uit"} tone={selected ? "success" : "neutral"} />}
                      trailing={
                        <MaterialIcons
                          name={selected ? 'check-circle' : 'radio-button-unchecked'}
                          size={20}
                          color={selected ? palette.primary : palette.mutedSoft}
                        />
                      }
                    />
                  </Pressable>
                );
              })}
            </AdminList>

            <AdminActionBar
              primary={{
                label: busy ? 'Starten...' : 'Start opnieuw verwerken',
                onPress: () => void handleStart(),
                disabled: adminAccess !== true || busy || isRunning || selectedTypes.length === 0,
                icon: 'play-arrow',
              }}
              secondary={
                job
                  ? {
                      label: busy ? 'Verversen...' : 'Ververs status',
                      onPress: () => void handleRefresh(),
                      disabled: busy,
                      icon: 'refresh',
                    }
                  : undefined
              }
            />

            <MetaText>Minimaal één datatype selecteren. Alleen admins met herverwerkingsrechten hebben toegang.</MetaText>
          </AdminPanel>
        ) : null}

        {error ? <StateBlock tone="error" message="Actie mislukt" detail={error} /> : null}

        {job && adminAccess === true ? (
          <AdminPanel
            title="Jobstatus"
            subtitle={`Job ${job.id.slice(0, 8)} · ${statusLabel(job.status)}`}>
            {totals ? (
              <AdminMetricGrid>
                <AdminMetricCard label="Totaal" value={totals.total} meta="records" />
                <AdminMetricCard label="Queued" value={totals.queued} tone={totals.queued > 0 ? "warning" : "neutral"} />
                <AdminMetricCard label="OpenAI klaar" value={totals.openaiCompleted} tone="info" />
                <AdminMetricCard label="Applied" value={totals.applied} tone="success" />
                <AdminMetricCard label="Failed" value={totals.failed} tone={totals.failed > 0 ? "danger" : "neutral"} />
                <AdminMetricCard label="Remaining" value={totals.remaining} tone={totals.remaining > 0 ? "warning" : "neutral"} />
              </AdminMetricGrid>
            ) : null}

            <AdminTimeline
              items={STEP_OPTIONS.map((option) => {
                const step = stepByType.get(option.type);
                const phase = step?.phase ?? 'niet geselecteerd';
                return {
                  label: stepLabel(option.type),
                  meta: `${step?.status ?? 'n/a'} · fase ${phase}`,
                  tone: step?.status === 'failed' ? 'danger' : step?.status === 'completed' ? 'success' : step ? 'info' : 'neutral',
                };
              })}
            />

            <AdminList>
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
                  <AdminDenseRow
                    key={option.type}
                    title={stepLabel(option.type)}
                    subtitle={`fase: ${phase}`}
                    meta={`total ${total} · queued ${queued} · openai ${openAiCompleted} · applied ${applied} · failed ${failed} · remaining ${remaining}`}
                    chips={<AdminStatusBadge label={step?.status ?? 'n/a'} tone={failed > 0 ? "danger" : applied > 0 ? "success" : step ? "info" : "neutral"} />}
                  />
                );
              })}
            </AdminList>

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
          </AdminPanel>
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
  },
  inspectorStack: {
    gap: spacing.sm,
  },
  selectionPressable: {
    borderRadius: radius.md,
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
