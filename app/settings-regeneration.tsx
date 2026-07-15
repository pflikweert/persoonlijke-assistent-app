import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ConfirmSheet } from '@/components/feedback/destructive-confirm-sheet';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminActionBar,
  AdminConsoleButton,
  AdminConsoleHeader,
  AdminConsoleKeyValue,
  AdminConsoleShell,
  AdminDenseRow,
  AdminList,
  AdminMetricCard,
  AdminMetricGrid,
  AdminPanel,
  AdminStatusBadge,
  AdminTimeline,
} from '@/components/ui/admin-console-primitives';
import { MetaText, StateBlock } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  fetchAdminRegenerationJobStatus,
  fetchLatestAdminRegenerationJob,
  hasAdminRegenerationAccess,
  inspectAdminRegenerationDay,
  previewAdminRegenerationJob,
  startAdminRegenerationJob,
  stopAdminRegenerationJob,
} from '@/services';
import type {
  AdminRegenerationDayInspection,
  AdminRegenerationJobView,
  AdminRegenerationPreview,
  AdminRegenerationRunMode,
  AdminRegenerationScopeSelection,
  AdminRegenerationStepType,
  AdminRegenerationStepView,
} from '@/services/admin-regeneration';
import { colorTokens, radius, spacing } from '@/theme';

type StepOption = {
  type: AdminRegenerationStepType;
  label: string;
};

type ScopeMode = 'today' | 'period' | 'all';

const STEP_OPTIONS: StepOption[] = [
  { type: 'entries_normalized', label: 'Momenten' },
  { type: 'day_journals', label: 'Dagverhalen' },
  { type: 'week_reflections', label: 'Weekreflecties' },
  { type: 'month_reflections', label: 'Maandreflecties' },
];

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function isDateLike(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
}

function buildScopeSelections(input: {
  scopeMode: ScopeMode;
  periodStart: string;
  periodEnd: string;
}): AdminRegenerationScopeSelection[] {
  if (input.scopeMode === 'all') {
    return [{ kind: 'all' }];
  }
  if (input.scopeMode === 'today') {
    return [{ kind: 'day', date: getTodayDate() }];
  }
  const startDate = input.periodStart.trim();
  const endDate = input.periodEnd.trim();
  if (startDate === endDate) {
    return [{ kind: 'day', date: startDate }];
  }
  return [{ kind: 'range', startDate, endDate }];
}

function parseTargetUserIdsInput(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function stepLabel(type: AdminRegenerationStepType): string {
  return STEP_OPTIONS.find((option) => option.type === type)?.label ?? type;
}

function readableStatusLabel(status: AdminRegenerationJobView['status']): string {
  if (status === 'queued') return 'Wacht';
  if (status === 'running') return 'Bezig';
  if (status === 'completed') return 'Afgerond';
  if (status === 'failed') return 'Mislukt';
  return 'Gestopt';
}

function readableStepStatusLabel(status: AdminRegenerationStepView['status'] | undefined): string {
  if (status === 'pending') return 'Wacht';
  if (status === 'running') return 'Bezig';
  if (status === 'completed') return 'Afgerond';
  if (status === 'failed') return 'Mislukt';
  return 'Niet gekozen';
}

function summarizeJob(job: AdminRegenerationJobView): {
  total: number;
  applied: number;
  failed: number;
  remaining: number;
} {
  return job.steps.reduce(
    (acc, step) => {
      acc.total += Number(step.total ?? 0);
      acc.applied += Number(step.applied ?? 0);
      acc.failed += Number(step.failed ?? 0);
      acc.remaining += Number(step.remaining ?? 0);
      return acc;
    },
    { total: 0, applied: 0, failed: 0, remaining: 0 }
  );
}

function previewCount(preview: AdminRegenerationPreview | null, type: AdminRegenerationStepType): number {
  return Number(preview?.steps.find((step) => step.step_type === type)?.total ?? 0);
}

function previewTotal(preview: AdminRegenerationPreview | null): number {
  return preview?.steps.reduce((total, step) => total + Number(step.total ?? 0), 0) ?? 0;
}

function activeStep(job: AdminRegenerationJobView | null): AdminRegenerationStepView | null {
  if (!job) return null;
  return (
    job.steps.find((step) => step.status === 'running') ??
    job.steps.find((step) => step.status === 'pending') ??
    job.steps.at(-1) ??
    null
  );
}

function isActiveJob(job: AdminRegenerationJobView | null): boolean {
  return job?.status === 'queued' || job?.status === 'running';
}

function isRegenerationStopRequested(job: AdminRegenerationJobView | null): boolean {
  return typeof job?.options?.stop_requested_at === 'string';
}

export default function SettingsRegenerationScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const today = useMemo(() => getTodayDate(), []);

  const [menuVisible, setMenuVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stopBusy, setStopBusy] = useState(false);
  const [job, setJob] = useState<AdminRegenerationJobView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [runMode, setRunMode] = useState<AdminRegenerationRunMode>('repair');
  const [scopeMode, setScopeMode] = useState<ScopeMode>('today');
  const [periodStart, setPeriodStart] = useState(today);
  const [periodEnd, setPeriodEnd] = useState(today);
  const [targetUserIdsInput, setTargetUserIdsInput] = useState('');
  const [preview, setPreview] = useState<AdminRegenerationPreview | null>(null);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [technicalOpen, setTechnicalOpen] = useState(false);
  const [confirmAllVisible, setConfirmAllVisible] = useState(false);
  const [inspectUserId, setInspectUserId] = useState('');
  const [inspectDate, setInspectDate] = useState('2026-03-21');
  const [inspection, setInspection] = useState<AdminRegenerationDayInspection | null>(null);
  const [inspectionBusy, setInspectionBusy] = useState(false);

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
  const scopeSelections = useMemo(
    () => buildScopeSelections({ scopeMode, periodStart, periodEnd }),
    [periodEnd, periodStart, scopeMode]
  );
  const targetUserIds = useMemo(() => parseTargetUserIdsInput(targetUserIdsInput), [targetUserIdsInput]);
  const selectionKey = useMemo(
    () => JSON.stringify({
      mode: runMode,
      scope: scopeSelections,
      targetUserIds,
      selectedTypes,
    }),
    [runMode, scopeSelections, selectedTypes, targetUserIds]
  );

  const isRunning = isActiveJob(job);
  const stopRequested = isRegenerationStopRequested(job);
  const terminalJob = job && !isRunning ? job : null;
  const previewIsCurrent = Boolean(preview && previewKey === selectionKey);
  const scopeIsValid =
    scopeMode === 'all' ||
    scopeMode === 'today' ||
    (isDateLike(periodStart) && isDateLike(periodEnd) && periodStart <= periodEnd);
  const canPreview =
    adminAccess === true &&
    !busy &&
    !previewBusy &&
    !isRunning &&
    selectedTypes.length > 0 &&
    scopeIsValid;
  const canStart =
    adminAccess === true &&
    !busy &&
    !previewBusy &&
    !isRunning &&
    selectedTypes.length > 0 &&
    previewIsCurrent;

  const loadLatestJob = useCallback(async () => {
    if (adminAccess !== true) {
      return;
    }

    try {
      const latest = await fetchLatestAdminRegenerationJob();
      setJob(isActiveJob(latest) ? latest : null);
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

  function invalidatePreview() {
    setPreview(null);
    setPreviewKey(null);
    setPreviewBusy(false);
  }

  async function handlePreview() {
    if (!canPreview) {
      return;
    }

    setPreviewBusy(true);
    setError(null);

    try {
      const nextPreview = await previewAdminRegenerationJob({
        selectedTypes,
        mode: runMode,
        scope: scopeSelections,
        targetUserIds,
      });
      setPreview(nextPreview);
      setPreviewKey(selectionKey);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setPreviewBusy(false);
    }
  }

  async function executeStart() {
    if (!canStart) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const createdJob = await startAdminRegenerationJob({
        selectedTypes,
        mode: runMode,
        scope: scopeSelections,
        targetUserIds,
      });
      setJob(createdJob);
      invalidatePreview();
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setBusy(false);
    }
  }

  function handleStart() {
    if (!canStart) {
      return;
    }
    if (runMode === 'all') {
      setConfirmAllVisible(true);
      return;
    }
    void executeStart();
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

  async function handleStopJob() {
    if (adminAccess !== true || !job || !isRunning || stopBusy) {
      return;
    }

    setStopBusy(true);
    setError(null);

    try {
      const nextJob = await stopAdminRegenerationJob({ jobId: job.id });
      setJob(nextJob);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setStopBusy(false);
    }
  }

  async function handleInspectDay() {
    if (adminAccess !== true || inspectionBusy) {
      return;
    }

    setInspectionBusy(true);
    setError(null);

    try {
      const nextInspection = await inspectAdminRegenerationDay({
        userId: inspectUserId,
        journalDate: inspectDate,
      });
      setInspection(nextInspection);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setInspectionBusy(false);
    }
  }

  const stepByType = useMemo(() => {
    const map = new Map<AdminRegenerationStepType, AdminRegenerationStepView>();
    for (const step of job?.steps ?? []) {
      map.set(step.step_type, step as AdminRegenerationStepView);
    }
    return map;
  }, [job]);

  const totals = job ? summarizeJob(job) : null;
  const currentStep = activeStep(job);
  const processed = totals ? totals.applied + totals.failed : 0;
  const progress = totals && totals.total > 0 ? Math.min(100, Math.round((processed / totals.total) * 100)) : 0;
  const previewTouches = previewTotal(preview);

  return (
    <AdminConsoleShell
      title="Data opnieuw opbouwen"
      onBack={() => router.replace('/settings')}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.scrollContent}
    >
      <AdminConsoleHeader
        eyebrow="Beheer"
        title="Data opnieuw opbouwen"
        subtitle={isRunning ? 'Nieuwe opdracht starten kan zodra deze klaar of gestopt is.' : 'Herstel of bouw dagboekdata opnieuw op.'}
      />

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor admins met rechten voor herverwerking."
        />
      ) : null}

      {error ? <StateBlock tone="error" message="Actie mislukt" detail={error} /> : null}

      {adminAccess === true && job && isRunning ? (
        <ActiveJobCard
          job={job}
          totals={totals}
          currentStep={currentStep}
          processed={processed}
          progress={progress}
          stopRequested={stopRequested}
          busy={busy}
          stopBusy={stopBusy}
          technicalOpen={technicalOpen}
          stepByType={stepByType}
          palettePrimary={palette.primary}
          onRefresh={() => void handleRefresh()}
          onStop={() => void handleStopJob()}
          onToggleTechnical={() => setTechnicalOpen((value) => !value)}
        />
      ) : null}

      {adminAccess === true && terminalJob ? (
        <AdminPanel
          variant="plain"
          title={terminalJob.status === 'failed' ? 'Opdracht mislukt' : terminalJob.status === 'cancelled' ? 'Opdracht gestopt' : 'Opdracht afgerond'}
          subtitle="Je kunt nu een nieuwe opdracht starten."
        >
          {totals ? (
            <AdminMetricGrid>
              <AdminMetricCard label="Verwerkt" value={`${totals.applied} / ${totals.total}`} tone="success" />
              <AdminMetricCard label="Mislukt" value={totals.failed} tone={totals.failed > 0 ? 'danger' : 'neutral'} />
            </AdminMetricGrid>
          ) : null}
          <AdminConsoleButton
            label="Nieuwe opdracht starten"
            onPress={() => {
              setJob(null);
              invalidatePreview();
            }}
            icon="add-circle-outline"
            fullWidth
          />
        </AdminPanel>
      ) : null}

      {adminAccess !== false && !isRunning && !terminalJob ? (
        <>
          <AdminPanel variant="plain" title="Stap 1 · Wat wil je doen?">
            <AdminList>
              {[
                {
                  mode: 'repair' as const,
                  label: 'Problemen herstellen',
                  description: 'Alleen ontbrekende, oude of verdachte output.',
                },
                {
                  mode: 'all' as const,
                  label: 'Alles opnieuw opbouwen',
                  description: 'Vervangt de gekozen gegenereerde output.',
                },
              ].map((option) => {
                const selected = runMode === option.mode;
                return (
                  <Pressable
                    key={option.mode}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    onPress={() => {
                      setRunMode(option.mode);
                      invalidatePreview();
                    }}
                    style={styles.selectionPressable}
                  >
                    <AdminDenseRow
                      title={option.label}
                      subtitle={option.description}
                      chips={selected ? <AdminStatusBadge label="Gekozen" tone="success" /> : undefined}
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
          </AdminPanel>

          <AdminPanel variant="plain" title="Stap 2 · Bereik">
            <AdminList>
              {[
                { mode: 'today' as const, title: 'Vandaag', subtitle: today },
                { mode: 'period' as const, title: 'Periode', subtitle: `${periodStart} t/m ${periodEnd}` },
                { mode: 'all' as const, title: 'Alles', subtitle: 'Alle beschikbare data' },
              ].map((option) => {
                const selected = scopeMode === option.mode;
                return (
                  <Pressable
                    key={option.mode}
                    accessibilityRole="button"
                    accessibilityLabel={option.title}
                    onPress={() => {
                      setScopeMode(option.mode);
                      invalidatePreview();
                    }}
                    style={styles.selectionPressable}
                  >
                    <AdminDenseRow
                      title={option.title}
                      subtitle={option.subtitle}
                      chips={selected ? <AdminStatusBadge label="Gekozen" tone="success" /> : undefined}
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

            {scopeMode === 'period' ? (
              <ThemedView style={styles.dateGrid}>
                <TextInput
                  accessibilityLabel="Begindatum"
                  value={periodStart}
                  onChangeText={(value) => {
                    setPeriodStart(value);
                    invalidatePreview();
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={palette.mutedSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: palette.text, backgroundColor: palette.surfaceLow }]}
                />
                <TextInput
                  accessibilityLabel="Einddatum"
                  value={periodEnd}
                  onChangeText={(value) => {
                    setPeriodEnd(value);
                    invalidatePreview();
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={palette.mutedSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: palette.text, backgroundColor: palette.surfaceLow }]}
                />
              </ThemedView>
            ) : null}
          </AdminPanel>

          <AdminPanel variant="plain" title="Stap 3 · Onderdelen">
            <ThemedView style={styles.checkboxList}>
              {STEP_OPTIONS.map((option) => {
                const selected = selection[option.type];
                return (
                  <Pressable
                    key={option.type}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    onPress={() => {
                      setSelection((current) => ({
                        ...current,
                        [option.type]: !current[option.type],
                      }));
                      invalidatePreview();
                    }}
                    style={styles.checkboxRow}
                  >
                    <MaterialIcons
                      name={selected ? 'check-box' : 'check-box-outline-blank'}
                      size={22}
                      color={selected ? palette.primary : palette.mutedSoft}
                    />
                    <ThemedText type="defaultSemiBold" style={{ color: palette.text }}>
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>
            <MetaText>Kies alleen wat je opnieuw wilt laten maken.</MetaText>
          </AdminPanel>

          <AdminPanel variant="plain" title="Stap 4 · Controle">
            {!scopeIsValid ? (
              <StateBlock tone="info" message="Controleer de datums" detail="Gebruik YYYY-MM-DD en zorg dat de einddatum niet vóór de begindatum ligt." />
            ) : previewIsCurrent ? (
              <>
                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  Deze opdracht raakt:
                </ThemedText>
                <AdminList>
                  {STEP_OPTIONS.filter((option) => selection[option.type]).map((option) => (
                    <AdminDenseRow
                      key={option.type}
                      title={option.label}
                      subtitle={`${previewCount(preview, option.type)} records`}
                    />
                  ))}
                </AdminList>
                {previewTouches >= 500 || scopeMode === 'all' ? (
                  <MetaText>Grote selectie. Controleer dit voor je start.</MetaText>
                ) : null}
              </>
            ) : (
              <MetaText>Controleer de selectie voordat je start.</MetaText>
            )}

            <AdminActionBar
              primary={{
                label: busy ? 'Starten...' : 'Start opnieuw opbouwen',
                onPress: handleStart,
                disabled: !canStart,
                icon: 'play-arrow',
              }}
              secondary={{
                label: previewBusy ? 'Controleren...' : 'Controleer selectie',
                onPress: () => void handlePreview(),
                disabled: !canPreview,
                icon: 'fact-check',
              }}
            />
          </AdminPanel>

          <AdminPanel variant="plain" title="Geavanceerd">
            <AdminConsoleButton
              label={advancedOpen ? 'Verberg geavanceerd' : 'Toon geavanceerd'}
              onPress={() => setAdvancedOpen((value) => !value)}
              icon={advancedOpen ? 'expand-less' : 'expand-more'}
              fullWidth
            />
            {advancedOpen ? (
              <ThemedView style={styles.advancedContent}>
                <TextInput
                  accessibilityLabel="Geavanceerde gebruiker ids"
                  value={targetUserIdsInput}
                  onChangeText={(value) => {
                    setTargetUserIdsInput(value);
                    invalidatePreview();
                  }}
                  placeholder="Optioneel: user id(s)"
                  placeholderTextColor={palette.mutedSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: palette.text, backgroundColor: palette.surfaceLow }]}
                />

                <ThemedText type="defaultSemiBold">Dag inspecteren</ThemedText>
                <TextInput
                  accessibilityLabel="Inspectie gebruiker"
                  value={inspectUserId}
                  onChangeText={setInspectUserId}
                  placeholder="Gebruiker-id"
                  placeholderTextColor={palette.mutedSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: palette.text, backgroundColor: palette.surfaceLow }]}
                />
                <TextInput
                  accessibilityLabel="Inspectie datum"
                  value={inspectDate}
                  onChangeText={setInspectDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={palette.mutedSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: palette.text, backgroundColor: palette.surfaceLow }]}
                />
                <AdminActionBar
                  primary={{
                    label: inspectionBusy ? 'Inspecteren...' : 'Inspecteer dag',
                    onPress: () => void handleInspectDay(),
                    disabled: inspectionBusy || !inspectUserId.trim() || !inspectDate.trim(),
                    icon: 'search',
                  }}
                />

                {inspection ? (
                  <>
                    <AdminMetricGrid>
                      <AdminMetricCard label="Ruw" value={inspection.counts.uiEquivalentRawCount} />
                      <AdminMetricCard label="Opgebouwd" value={inspection.counts.normalizedCount} />
                      <AdminMetricCard label="Promptdata" value={inspection.counts.promptInputEntryCount} tone={inspection.counts.promptInputEntryCount > 0 ? 'success' : 'warning'} />
                      <AdminMetricCard label="Meldingen" value={inspection.issueReasons.length} tone={inspection.issueReasons.length > 0 ? 'warning' : 'success'} />
                    </AdminMetricGrid>
                    <AdminList>
                      {inspection.entries.map((entry) => (
                        <AdminDenseRow
                          key={entry.rawEntryId}
                          title={entry.normalizedTitle ?? entry.rawEntryId.slice(0, 8)}
                          subtitle={`ruw ${entry.rawBodyLength} tekens · opgebouwd ${entry.normalizedBodyLength} tekens`}
                          meta={entry.issueReasons.length > 0 ? entry.issueReasons.join(', ') : undefined}
                          chips={<AdminStatusBadge label={entry.issueReasons.length > 0 ? 'Melding' : 'Oké'} tone={entry.issueReasons.length > 0 ? 'warning' : 'success'} />}
                        />
                      ))}
                    </AdminList>
                  </>
                ) : null}
              </ThemedView>
            ) : null}
          </AdminPanel>
        </>
      ) : null}

      <ConfirmSheet
        visible={confirmAllVisible}
        title="Alles opnieuw opbouwen?"
        message="Bestaande gegenereerde tekst binnen dit bereik wordt vervangen."
        actions={[
          {
            key: 'cancel',
            label: 'Annuleren',
            onPress: () => setConfirmAllVisible(false),
          },
          {
            key: 'confirm',
            label: busy ? 'Starten...' : 'Start opnieuw opbouwen',
            onPress: () => {
              setConfirmAllVisible(false);
              void executeStart();
            },
            tone: 'destructive',
            icon: 'play-arrow',
            disabled: busy,
          },
        ]}
        onCancel={() => setConfirmAllVisible(false)}
        onConfirm={() => {
          setConfirmAllVisible(false);
          void executeStart();
        }}
      />

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminConsoleShell>
  );
}

function ActiveJobCard({
  job,
  totals,
  currentStep,
  processed,
  progress,
  stopRequested,
  busy,
  stopBusy,
  technicalOpen,
  stepByType,
  palettePrimary,
  onRefresh,
  onStop,
  onToggleTechnical,
}: {
  job: AdminRegenerationJobView;
  totals: ReturnType<typeof summarizeJob> | null;
  currentStep: AdminRegenerationStepView | null;
  processed: number;
  progress: number;
  stopRequested: boolean;
  busy: boolean;
  stopBusy: boolean;
  technicalOpen: boolean;
  stepByType: Map<AdminRegenerationStepType, AdminRegenerationStepView>;
  palettePrimary: string;
  onRefresh: () => void;
  onStop: () => void;
  onToggleTechnical: () => void;
}) {
  const statusLabel = stopRequested ? 'Stop aangevraagd' : readableStatusLabel(job.status);
  const subtitle = stopRequested
    ? 'De huidige batch wordt afgerond. Daarna stopt deze opdracht.'
    : 'Nieuwe opdracht starten kan zodra deze klaar of gestopt is.';

  return (
    <AdminPanel variant="plain" title={statusLabel} subtitle={subtitle}>
      {totals ? (
        <>
          <ThemedView style={styles.progressTrack}>
            <ThemedView style={[styles.progressFill, { width: `${progress}%`, backgroundColor: palettePrimary }]} />
          </ThemedView>
          <AdminMetricGrid>
            <AdminMetricCard label="Huidige stap" value={currentStep ? stepLabel(currentStep.step_type) : readableStatusLabel(job.status)} tone="info" />
            <AdminMetricCard label="Verwerkt" value={`${processed} / ${totals.total}`} tone="success" />
            <AdminMetricCard label="Mislukt" value={totals.failed} tone={totals.failed > 0 ? 'danger' : 'neutral'} />
          </AdminMetricGrid>
        </>
      ) : null}

      <ThemedView style={styles.actionRow}>
        <AdminConsoleButton
          label={busy ? 'Verversen...' : 'Ververs'}
          onPress={onRefresh}
          disabled={busy}
          icon="refresh"
          fullWidth
        />
        <AdminConsoleButton
          label={stopRequested ? 'Stop is aangevraagd' : stopBusy ? 'Stoppen...' : 'Stop na huidig werk'}
          onPress={onStop}
          disabled={stopBusy || stopRequested}
          icon="stop-circle"
          tone="danger"
          fullWidth
        />
      </ThemedView>

      <AdminConsoleButton
        label={technicalOpen ? 'Verberg technische details' : 'Technische details'}
        onPress={onToggleTechnical}
        icon={technicalOpen ? 'expand-less' : 'expand-more'}
        fullWidth
      />

      {technicalOpen ? (
        <>
          <AdminConsoleKeyValue label="Job id" value={job.id} />
          <AdminTimeline
            items={STEP_OPTIONS.map((option) => {
              const step = stepByType.get(option.type);
              return {
                label: stepLabel(option.type),
                meta: step ? `${readableStepStatusLabel(step.status)} · fase: ${step.phase}` : 'Niet gekozen',
                tone: step?.status === 'failed' ? 'danger' : step?.status === 'completed' ? 'success' : step ? 'info' : 'neutral',
              };
            })}
          />
          <AdminList>
            {STEP_OPTIONS.map((option) => {
              const step = stepByType.get(option.type);
              const total = step ? Number(step.total ?? 0) : 0;
              const applied = step ? Number(step.applied ?? 0) : 0;
              const failed = step ? Number(step.failed ?? 0) : 0;
              const remaining = step ? Number(step.remaining ?? 0) : 0;
              const processedCount = applied + failed;

              return (
                <AdminDenseRow
                  key={option.type}
                  title={stepLabel(option.type)}
                  subtitle={step ? `status: ${readableStepStatusLabel(step.status)} · fase: ${step.phase}` : 'Niet gekozen'}
                  meta={`totaal ${total} · verwerkt ${processedCount} · mislukt ${failed} · resterend ${remaining}`}
                  chips={<AdminStatusBadge label={step ? readableStepStatusLabel(step.status) : 'Niet gekozen'} tone={failed > 0 ? 'danger' : processedCount > 0 ? 'success' : step ? 'info' : 'neutral'} />}
                />
              );
            })}
          </AdminList>
        </>
      ) : null}
    </AdminPanel>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    maxWidth: 920,
    alignSelf: 'center',
    paddingBottom: spacing.xxxl,
    gap: spacing.xxxl,
  },
  selectionPressable: {
    borderRadius: radius.md,
  },
  dateGrid: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },
  checkboxList: {
    gap: spacing.xs,
  },
  checkboxRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionRow: {
    gap: spacing.sm,
  },
  advancedContent: {
    gap: spacing.sm,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(127,127,127,0.16)',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
