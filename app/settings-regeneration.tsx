import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminActionBar,
  AdminConsoleButton,
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
  inspectAdminRegenerationDay,
  previewAdminRegenerationJob,
  startAdminRegenerationJob,
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
  description: string;
};

type ScopeMode = 'today' | 'day' | 'range' | 'all';

const STEP_OPTIONS: StepOption[] = [
  {
    type: 'entries_normalized',
    label: 'Momenten',
    description: 'Normaliseert ruwe momenten opnieuw.',
  },
  {
    type: 'day_journals',
    label: 'Dagverhalen',
    description: 'Bouwt dagoverzichten opnieuw op vanuit momenten.',
  },
  {
    type: 'week_reflections',
    label: 'Weekreflecties',
    description: 'Bouwt weekreflecties opnieuw op vanuit dagen.',
  },
  {
    type: 'month_reflections',
    label: 'Maandreflecties',
    description: 'Bouwt maandreflecties opnieuw op vanuit weken en dagen.',
  },
];

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function isDateLike(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
}

function buildScopeSelections(input: {
  scopeMode: ScopeMode;
  dayDate: string;
  rangeStart: string;
  rangeEnd: string;
}): AdminRegenerationScopeSelection[] {
  if (input.scopeMode === 'all') {
    return [{ kind: 'all' }];
  }
  if (input.scopeMode === 'today') {
    return [{ kind: 'day', date: getTodayDate() }];
  }
  if (input.scopeMode === 'day') {
    return [{ kind: 'day', date: input.dayDate.trim() }];
  }
  return [{
    kind: 'range',
    startDate: input.rangeStart.trim(),
    endDate: input.rangeEnd.trim(),
  }];
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
  return 'Geannuleerd';
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

function previewCount(preview: AdminRegenerationPreview | null, type: AdminRegenerationStepType): number {
  return Number(preview?.steps.find((step) => step.step_type === type)?.total ?? 0);
}

function previewTotal(preview: AdminRegenerationPreview | null): number {
  return preview?.steps.reduce((total, step) => total + Number(step.total ?? 0), 0) ?? 0;
}

function scopeLabel(input: { scopeMode: ScopeMode; dayDate: string; rangeStart: string; rangeEnd: string }): string {
  if (input.scopeMode === 'today') return `Vandaag (${getTodayDate()})`;
  if (input.scopeMode === 'day') return input.dayDate.trim() || 'Specifieke dag';
  if (input.scopeMode === 'range') return `${input.rangeStart.trim() || 'Van'} t/m ${input.rangeEnd.trim() || 'Tot'}`;
  return 'Alles';
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

export default function SettingsRegenerationScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [job, setJob] = useState<AdminRegenerationJobView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [inspectUserId, setInspectUserId] = useState('');
  const [inspectDate, setInspectDate] = useState('2026-03-21');
  const [inspection, setInspection] = useState<AdminRegenerationDayInspection | null>(null);
  const [inspectionBusy, setInspectionBusy] = useState(false);
  const [runMode, setRunMode] = useState<AdminRegenerationRunMode>('repair');
  const [scopeMode, setScopeMode] = useState<ScopeMode>('today');
  const [dayDate, setDayDate] = useState(getTodayDate());
  const [rangeStart, setRangeStart] = useState(getTodayDate());
  const [rangeEnd, setRangeEnd] = useState(getTodayDate());
  const [targetUserIdsInput, setTargetUserIdsInput] = useState('');
  const [preview, setPreview] = useState<AdminRegenerationPreview | null>(null);
  const [previewBusy, setPreviewBusy] = useState(false);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [technicalOpen, setTechnicalOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);

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
    () => buildScopeSelections({ scopeMode, dayDate, rangeStart, rangeEnd }),
    [dayDate, rangeEnd, rangeStart, scopeMode]
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

  const isRunning = job?.status === 'queued' || job?.status === 'running';
  const previewIsCurrent = Boolean(preview && previewKey === selectionKey);
  const scopeIsValid =
    scopeMode === 'all' ||
    scopeMode === 'today' ||
    (scopeMode === 'day' && isDateLike(dayDate)) ||
    (scopeMode === 'range' && isDateLike(rangeStart) && isDateLike(rangeEnd));
  const canStart =
    adminAccess === true &&
    !busy &&
    !isRunning &&
    selectedTypes.length > 0 &&
    previewIsCurrent &&
    (runMode !== 'all' || replaceConfirmed);

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

  function invalidatePreview() {
    setPreview(null);
    setPreviewKey(null);
    setReplaceConfirmed(false);
  }

  async function handleStart() {
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

  async function handlePreview() {
    if (adminAccess !== true || selectedTypes.length === 0 || previewBusy || isRunning || !scopeIsValid) {
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

  const totals = job ? summarizeJob(job) : null;
  const currentStep = activeStep(job);
  const processed = totals ? totals.applied + totals.failed : 0;
  const progress = totals && totals.total > 0 ? Math.min(100, Math.round((processed / totals.total) * 100)) : 0;
  const currentScopeLabel = scopeLabel({ scopeMode, dayDate, rangeStart, rangeEnd });
  const previewTouches = previewTotal(preview);
  const largeSelection = previewTouches >= 500 || scopeMode === 'all';

  return (
    <AdminConsoleShell
      title="Data opnieuw opbouwen"
      onBack={() => router.replace("/settings")}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.scrollContent}
      inspector={
        <AdminInspectorPanel title="Veiligheid" subtitle="Controle eerst, daarna pas starten.">
          <ThemedView style={styles.inspectorStack}>
            <AdminConsoleKeyValue label="Toegang" value={adminAccess === true ? "Toegestaan" : adminAccess === false ? "Geen toegang" : "Controleren"} />
            <AdminConsoleKeyValue label="Bereik" value={currentScopeLabel} />
            <AdminConsoleKeyValue label="Controle" value={previewIsCurrent ? "Gedaan" : "Nog nodig"} />
          </ThemedView>
        </AdminInspectorPanel>
      }
    >
        <AdminPageHeader
          eyebrow="Beheer"
          title="Data opnieuw opbouwen"
          subtitle="Herstel ontbrekende of verouderde dagboekdata, of bouw gekozen onderdelen opnieuw op."
          chips={
            <>
              {job ? <AdminStatusBadge label={readableStatusLabel(job.status)} tone={job.status === 'failed' ? 'danger' : job.status === 'completed' ? 'success' : 'warning'} /> : null}
              {previewIsCurrent ? <AdminStatusBadge label="Selectie gecontroleerd" tone="success" /> : null}
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
            title="Stap 1 · Kies actie"
            subtitle="Begin met herstellen. Volledig opnieuw opbouwen gebruik je alleen bewust.">
            <AdminList>
              {[
                {
                  mode: 'repair' as const,
                  label: 'Problemen herstellen',
                  description: 'Herstelt alleen ontbrekende, oude of verdachte output. Veilig voor normaal gebruik.',
                },
                {
                  mode: 'all' as const,
                  label: 'Volledig opnieuw opbouwen',
                  description: 'Bouwt alle gekozen onderdelen opnieuw op binnen het gekozen bereik.',
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
                    style={styles.selectionPressable}>
                    <AdminDenseRow
                      title={option.label}
                      subtitle={option.description}
                      chips={option.mode === 'repair' ? <AdminStatusBadge label="Aanbevolen" tone="success" /> : selected ? <AdminStatusBadge label="Vervangt output" tone="warning" /> : undefined}
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

            {runMode === 'all' ? (
              <StateBlock
                tone="warning"
                message="Dit kan bestaande gegenereerde tekst vervangen"
                detail="Controleer altijd eerst het bereik en de aantallen voordat je start."
              />
            ) : null}
          </AdminPanel>
        ) : null}

        {adminAccess !== false ? (
          <AdminPanel
            title="Stap 2 · Kies bereik"
            subtitle="Kies waar je opnieuw wilt opbouwen. Je hoeft geen technische ids in te vullen.">
            <AdminList>
              {[
                { mode: 'today' as const, title: 'Vandaag', subtitle: getTodayDate() },
                { mode: 'day' as const, title: 'Specifieke dag', subtitle: 'Kies één datum' },
                { mode: 'range' as const, title: 'Periode', subtitle: 'Kies een begin- en einddatum' },
                { mode: 'all' as const, title: 'Alles', subtitle: 'Controleer zorgvuldig; dit kan veel records raken' },
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
                    style={styles.selectionPressable}>
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

            {scopeMode === 'day' ? (
              <TextInput
                accessibilityLabel="Datum"
                value={dayDate}
                onChangeText={(value) => {
                  setDayDate(value);
                  invalidatePreview();
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={palette.mutedSoft}
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.inspectInput,
                  {
                    color: palette.text,
                    backgroundColor: palette.surfaceLow,
                  },
                ]}
              />
            ) : null}

            {scopeMode === 'range' ? (
              <ThemedView style={styles.dateGrid}>
                <TextInput
                  accessibilityLabel="Van datum"
                  value={rangeStart}
                  onChangeText={(value) => {
                    setRangeStart(value);
                    invalidatePreview();
                  }}
                  placeholder="Van · YYYY-MM-DD"
                  placeholderTextColor={palette.mutedSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[
                    styles.inspectInput,
                    styles.dateInput,
                    {
                      color: palette.text,
                      backgroundColor: palette.surfaceLow,
                    },
                  ]}
                />
                <TextInput
                  accessibilityLabel="Tot datum"
                  value={rangeEnd}
                  onChangeText={(value) => {
                    setRangeEnd(value);
                    invalidatePreview();
                  }}
                  placeholder="Tot · YYYY-MM-DD"
                  placeholderTextColor={palette.mutedSoft}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[
                    styles.inspectInput,
                    styles.dateInput,
                    {
                      color: palette.text,
                      backgroundColor: palette.surfaceLow,
                    },
                  ]}
                />
              </ThemedView>
            ) : null}

            {scopeMode === 'all' ? (
              <StateBlock
                tone="warning"
                message="Dit kan veel records raken"
                detail="Controleer de selectie voordat je start. Grote acties kunnen langer duren."
              />
            ) : null}

            {!scopeIsValid ? (
              <StateBlock tone="error" message="Controleer de datum" detail="Gebruik het formaat YYYY-MM-DD." />
            ) : null}
          </AdminPanel>
        ) : null}

        {adminAccess !== false ? (
          <AdminPanel
            title="Stap 3 · Kies onderdelen"
            subtitle="Kies wat opnieuw opgebouwd moet worden. Afhankelijke onderdelen worden in de juiste volgorde verwerkt.">
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
                      invalidatePreview();
                    }}
                    style={styles.selectionPressable}>
                    <AdminDenseRow
                      title={option.label}
                      subtitle={option.description}
                      chips={<AdminStatusBadge label={selected ? "Gekozen" : "Uit"} tone={selected ? "success" : "neutral"} />}
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
        ) : null}

        {adminAccess !== false ? (
          <AdminPanel
            title="Stap 4 · Controle"
            subtitle="Je ziet eerst wat geraakt wordt. Starten kan pas daarna.">
            <AdminActionBar
              primary={{
                label: previewBusy ? 'Controleren...' : 'Controleer selectie',
                onPress: () => void handlePreview(),
                disabled: adminAccess !== true || previewBusy || isRunning || selectedTypes.length === 0 || !scopeIsValid,
                icon: 'visibility',
              }}
            />

            {previewIsCurrent ? (
              <>
                <AdminMetricGrid>
                  <AdminMetricCard label="Momenten" value={previewCount(preview, 'entries_normalized')} tone="info" />
                  <AdminMetricCard label="Dagverhalen" value={previewCount(preview, 'day_journals')} tone="info" />
                  <AdminMetricCard label="Weekreflecties" value={previewCount(preview, 'week_reflections')} tone="info" />
                  <AdminMetricCard label="Maandreflecties" value={previewCount(preview, 'month_reflections')} tone="info" />
                </AdminMetricGrid>
                {largeSelection ? (
                  <StateBlock
                    tone="warning"
                    message="Grote selectie"
                    detail="Deze actie kan veel records raken en langer duren."
                  />
                ) : null}
                {runMode === 'all' ? (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: replaceConfirmed }}
                    onPress={() => setReplaceConfirmed((value) => !value)}
                    style={styles.confirmRow}>
                    <MaterialIcons
                      name={replaceConfirmed ? 'check-circle' : 'radio-button-unchecked'}
                      size={20}
                      color={replaceConfirmed ? palette.primary : palette.mutedSoft}
                    />
                    <ThemedText type="caption" style={{ color: palette.text }}>
                      Ik begrijp dat bestaande gegenereerde tekst kan worden vervangen.
                    </ThemedText>
                  </Pressable>
                ) : null}
              </>
            ) : (
              <StateBlock
                tone="info"
                message="Nog niet gecontroleerd"
                detail="Controleer de selectie voordat je opnieuw opbouwen start."
              />
            )}

            <AdminActionBar
              primary={{
                label: busy ? 'Starten...' : 'Start opnieuw opbouwen',
                onPress: () => void handleStart(),
                disabled: !canStart,
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
          </AdminPanel>
        ) : null}

        {adminAccess === true ? (
          <AdminPanel title="Geavanceerd" subtitle="Technische opties voor uitzonderingen.">
            <AdminConsoleButton
              label={advancedOpen ? 'Verberg geavanceerde opties' : 'Toon geavanceerde opties'}
              onPress={() => setAdvancedOpen((value) => !value)}
              icon={advancedOpen ? 'expand-less' : 'expand-more'}
              fullWidth
            />
            {advancedOpen ? (
              <ThemedView style={styles.inspectForm}>
              <TextInput
                accessibilityLabel="Geavanceerde gebruiker ids"
                value={targetUserIdsInput}
                onChangeText={(value) => {
                  setTargetUserIdsInput(value);
                  invalidatePreview();
                }}
                placeholder="Optioneel: technische user id(s), komma of nieuwe regel"
                placeholderTextColor={palette.mutedSoft}
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.inspectInput,
                  {
                    color: palette.text,
                    backgroundColor: palette.surfaceLow,
                  },
                ]}
              />
              </ThemedView>
            ) : null}
          </AdminPanel>
        ) : null}

        {error ? <StateBlock tone="error" message="Actie mislukt" detail={error} /> : null}

        {adminAccess === true ? (
          <AdminPanel
            title="Geavanceerd: dag inspecteren"
            subtitle="Controleer de ruwe input en promptdata van één dag.">
            <AdminConsoleButton
              label={inspectOpen ? 'Verberg daginspectie' : 'Toon daginspectie'}
              onPress={() => setInspectOpen((value) => !value)}
              icon={inspectOpen ? 'expand-less' : 'expand-more'}
              fullWidth
            />
            {inspectOpen ? (
              <ThemedView style={styles.inspectForm}>
              <TextInput
                accessibilityLabel="Gebruiker"
                value={inspectUserId}
                onChangeText={setInspectUserId}
                placeholder="Gebruiker-id"
                placeholderTextColor={palette.mutedSoft}
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.inspectInput,
                  {
                    color: palette.text,
                    backgroundColor: palette.surfaceLow,
                  },
                ]}
              />
              <TextInput
                accessibilityLabel="Datum"
                value={inspectDate}
                onChangeText={setInspectDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={palette.mutedSoft}
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.inspectInput,
                  {
                    color: palette.text,
                    backgroundColor: palette.surfaceLow,
                  },
                ]}
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
                    <AdminMetricCard label="Ruwe momenten" value={inspection.counts.uiEquivalentRawCount} />
                    <AdminMetricCard label="Opgebouwde momenten" value={inspection.counts.normalizedCount} />
                    <AdminMetricCard label="Promptdata" value={inspection.counts.promptInputEntryCount} tone={inspection.counts.promptInputEntryCount > 0 ? "success" : "warning"} />
                    <AdminMetricCard label="Meldingen" value={inspection.issueReasons.length} tone={inspection.issueReasons.length > 0 ? "warning" : "success"} />
                  </AdminMetricGrid>
                  {inspection.issueReasons.length > 0 ? (
                    <StateBlock tone="info" message="Inspectie meldingen" detail={inspection.issueReasons.join(', ')} />
                  ) : null}
                  <AdminList>
                    {inspection.entries.map((entry) => (
                      <AdminDenseRow
                        key={entry.rawEntryId}
                        title={entry.normalizedTitle ?? entry.rawEntryId.slice(0, 8)}
                        subtitle={`ruw ${entry.rawBodyLength} tekens · opgebouwd ${entry.normalizedBodyLength} tekens`}
                        meta={entry.issueReasons.length > 0 ? entry.issueReasons.join(', ') : entry.normalizedBody ?? undefined}
                        chips={<AdminStatusBadge label={entry.issueReasons.length > 0 ? "Melding" : "Oké"} tone={entry.issueReasons.length > 0 ? "warning" : "success"} />}
                      />
                    ))}
                  </AdminList>
                </>
              ) : null}
              </ThemedView>
            ) : null}
          </AdminPanel>
        ) : null}

        {job && adminAccess === true ? (
          <AdminPanel
            title={isRunning ? "Opnieuw opbouwen bezig" : "Laatste opdracht"}
            subtitle={currentStep ? `${readableStepStatusLabel(currentStep.status)} met ${stepLabel(currentStep.step_type).toLowerCase()}` : readableStatusLabel(job.status)}>
            {totals ? (
              <>
                <ThemedView style={styles.progressTrack}>
                  <ThemedView style={[styles.progressFill, { width: `${progress}%`, backgroundColor: palette.primary }]} />
                </ThemedView>
                <AdminMetricGrid>
                  <AdminMetricCard label="Totaal" value={totals.total} />
                  <AdminMetricCard label="Verwerkt" value={processed} tone="success" />
                  <AdminMetricCard label="Mislukt" value={totals.failed} tone={totals.failed > 0 ? "danger" : "neutral"} />
                  <AdminMetricCard label="Huidige stap" value={currentStep ? stepLabel(currentStep.step_type) : readableStatusLabel(job.status)} tone="info" />
                </AdminMetricGrid>
                <MetaText>{processed} van {totals.total} verwerkt.</MetaText>
              </>
            ) : null}

            <AdminConsoleButton
              label={technicalOpen ? 'Verberg technische details' : 'Technische details tonen'}
              onPress={() => setTechnicalOpen((value) => !value)}
              icon={technicalOpen ? 'expand-less' : 'expand-more'}
              fullWidth
            />

            {technicalOpen ? (
              <>
                <AdminConsoleKeyValue label="Job id" value={job.id} />
                <AdminTimeline
                  items={STEP_OPTIONS.map((option) => {
                    const step = stepByType.get(option.type);
                    const phase = step?.phase ?? 'niet geselecteerd';
                    return {
                      label: stepLabel(option.type),
                      meta: `${readableStepStatusLabel(step?.status)} · ${phase}`,
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
                        meta={`totaal ${total} · wacht ${queued} · openai ${openAiCompleted} · verwerkt ${applied} · mislukt ${failed} · resterend ${remaining}`}
                        chips={<AdminStatusBadge label={readableStepStatusLabel(step?.status)} tone={failed > 0 ? "danger" : applied > 0 ? "success" : step ? "info" : "neutral"} />}
                      />
                    );
                  })}
                </AdminList>
              </>
            ) : null}

            {job.status === 'completed' ? (
              <StateBlock
                tone={totals && totals.failed > 0 ? 'info' : 'success'}
                message={totals && totals.failed > 0 ? 'Opdracht afgerond met meldingen' : 'Opdracht afgerond'}
                detail={
                  totals
                    ? `Verwerkt: ${totals.applied}/${totals.total}. Mislukt: ${totals.failed}.`
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
  inspectForm: {
    gap: spacing.sm,
  },
  inspectInput: {
    minHeight: 44,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dateInput: {
    flex: 1,
    minWidth: 180,
  },
  confirmRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
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
