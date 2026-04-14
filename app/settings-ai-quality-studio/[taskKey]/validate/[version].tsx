import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminMetaStrip,
  AdminPageHero,
  AdminSection,
  AdminShell,
  AdminStickyFooterActions,
  SettingsTopNav,
} from '@/components/ui/settings-screen-primitives';
import { InlineWordDiffText } from '@/components/ui/inline-word-diff';
import { InputField, MetaText, StateBlock, SurfaceSection, TextAreaField } from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  fetchAdminAiQualityStudioCompareView,
  fetchAdminAiQualityStudioTaskDetail,
  fetchAdminAiQualityStudioTestRun,
  listAdminAiQualityStudioTestSources,
  runAdminAiQualityStudioTest,
  saveAdminAiQualityStudioTestReview,
} from '@/services';
import type {
  AiReviewLabel,
  AiTaskDetail,
  AiTaskTestCompareView,
  AiTaskTestRun,
  AiTaskTestSource,
} from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';
import { getAiQualityTaskCapabilities, getAiQualityTaskMetadata } from '../../readmodel';

type SignalTone = 'ok' | 'warn' | 'fail';

type ContractSignal = {
  label: string;
  tone: SignalTone;
  detail?: string;
};

type OutputRenderKind = 'text' | 'object' | 'list';

type NormalizedOutput =
  | { kind: 'text'; text: string; parseFallback: boolean }
  | { kind: 'object'; fields: { key: string; value: unknown }[] }
  | { kind: 'list'; items: unknown[] };

const validateCaseMemoryStore = new Map<string, string>();

function getLocalStorageSafe(): Storage | null {
  try {
    if (typeof globalThis === 'undefined') return null;
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

async function loadPersistedValidateCaseId(storageKey: string): Promise<string | null> {
  if (!storageKey) return null;
  const localStorage = getLocalStorageSafe();
  if (localStorage) {
    try {
      const next = localStorage.getItem(storageKey);
      if (next && next.trim().length > 0) return next;
    } catch {
      // noop
    }
  }
  return validateCaseMemoryStore.get(storageKey) ?? null;
}

async function persistValidateCaseId(storageKey: string, caseId: string): Promise<void> {
  if (!storageKey || !caseId) return;
  validateCaseMemoryStore.set(storageKey, caseId);
  const localStorage = getLocalStorageSafe();
  if (!localStorage) return;
  try {
    localStorage.setItem(storageKey, caseId);
  } catch {
    // noop
  }
}

function parseJsonSafe(value: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch {
    return { ok: false };
  }
}

function unwrapJsonCodeFence(value: string): string {
  const trimmed = value.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (!fenced) return trimmed;
  return fenced[1].trim();
}

function parseObjectLikeText(value: string): Record<string, unknown> | null {
  const cleaned = unwrapJsonCodeFence(value);
  const parsed = parseJsonSafe(cleaned);
  if (parsed.ok && parsed.value && typeof parsed.value === 'object' && !Array.isArray(parsed.value)) {
    return parsed.value as Record<string, unknown>;
  }
  return null;
}

function normalizeOutput(input: {
  rawText: string | null;
  rawJson?: unknown;
  preferredType: OutputRenderKind;
  forceObjectParse?: boolean;
}): NormalizedOutput {
  if (Array.isArray(input.rawJson)) {
    return { kind: 'list', items: input.rawJson };
  }

  if (input.rawJson && typeof input.rawJson === 'object') {
    const objectValue = input.rawJson as Record<string, unknown>;
    const fields = Object.keys(objectValue)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({ key, value: objectValue[key] }));
    return { kind: 'object', fields };
  }

  const text = (input.rawText ?? '').trim();
  if (!text) {
    return { kind: 'text', text: '', parseFallback: false };
  }

  // Always try object parse first — even for text/list tasks — so JSON output is never shown as raw string
  if (input.preferredType === 'text' && !input.forceObjectParse) {
    const tryObj = parseObjectLikeText(text);
    if (tryObj) {
      const fields = Object.keys(tryObj)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => ({ key, value: tryObj[key] }));
      return { kind: 'object', fields };
    }
    return { kind: 'text', text, parseFallback: false };
  }

  if (input.preferredType === 'object' || input.forceObjectParse) {
    const objectValue = parseObjectLikeText(text);
    if (objectValue) {
      const fields = Object.keys(objectValue)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => ({ key, value: objectValue[key] }));
      return { kind: 'object', fields };
    }
    return { kind: 'text', text, parseFallback: true };
  }

  const parsed = parseJsonSafe(unwrapJsonCodeFence(text));
  if (parsed.ok && Array.isArray(parsed.value)) {
    return { kind: 'list', items: parsed.value };
  }

  const lineItems = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^[-•*]\s+/, ''));
  if (lineItems.length > 1) {
    return { kind: 'list', items: lineItems };
  }

  return { kind: 'text', text, parseFallback: true };
}

function renderUnknownValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item, i) => `${i + 1}. ${typeof item === 'string' ? item : JSON.stringify(item)}`)
      .join('\n');
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

const FIELD_LABELS: Record<string, Record<string, string>> = {
  entry_cleanup: {
    title: 'Titel',
    body: 'Volledige tekst',
    summary_short: 'Korte samenvatting',
  },
  day_journal: {
    summary: 'Samenvatting',
    narrativeText: 'Verhaaltekst',
    sections: 'Kernblokken',
  },
  day_summary: {
    summary: 'Samenvatting',
    narrativeText: 'Verhaaltekst',
    narrative_text: 'Verhaaltekst',
    sections: 'Kernblokken',
  },
  day_narrative: {
    summary: 'Samenvatting',
    narrativeText: 'Verhaaltekst',
    narrative_text: 'Verhaaltekst',
    sections: 'Kernblokken',
  },
  week_summary: {
    summaryText: 'Samenvatting',
    summary_text: 'Samenvatting',
    narrativeText: 'Verhaaltekst',
    narrative_text: 'Verhaaltekst',
    highlights: 'Highlights',
    highlights_json: 'Highlights',
    reflectionPoints: 'Reflectiepunten',
    reflection_points_json: 'Reflectiepunten',
  },
  month_summary: {
    summaryText: 'Samenvatting',
    summary_text: 'Samenvatting',
    narrativeText: 'Verhaaltekst',
    narrative_text: 'Verhaaltekst',
    highlights: 'Highlights',
    highlights_json: 'Highlights',
    reflectionPoints: 'Reflectiepunten',
    reflection_points_json: 'Reflectiepunten',
  },
};

function formatObjectFieldLabel(taskKey: string | undefined, fieldKey: string): string {
  if (taskKey) {
    const map = FIELD_LABELS[taskKey];
    if (map?.[fieldKey]) return map[fieldKey];
  }
  return fieldKey;
}

function tonePrefix(tone: SignalTone): string {
  if (tone === 'ok') return '✅';
  if (tone === 'warn') return '⚠️';
  return '❌';
}

function sentenceCount(value: string): number {
  const normalized = value.trim();
  if (!normalized) return 0;
  return normalized
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}

function parseStringFieldLengths(value: string): Record<string, number> | null {
  const parsed = parseObjectLikeText(value);
  if (!parsed) return null;

  const lengths = Object.fromEntries(
    Object.entries(parsed)
      .filter(([, fieldValue]) => typeof fieldValue === 'string')
      .map(([fieldKey, fieldValue]) => [fieldKey, (fieldValue as string).trim().length])
  );

  return Object.keys(lengths).length > 0 ? lengths : null;
}

function buildContractSignals(args: {
  taskKey: string;
  compareView: AiTaskTestCompareView;
  testRun: AiTaskTestRun | null;
}): ContractSignal[] {
  const testText = args.compareView.testOutputText ?? args.testRun?.outputText ?? '';
  const liveText = args.compareView.liveOutputText ?? '';
  const normalizedTestText = testText.trim();

  if (!normalizedTestText) {
    return [{ label: 'Output aanwezig', tone: 'fail', detail: 'Geen bruikbare testoutput gevonden.' }];
  }

  if (args.taskKey === 'entry_cleanup') {
    let parsed: Record<string, unknown> | null = null;
    try {
      const candidate = JSON.parse(normalizedTestText);
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
        parsed = candidate as Record<string, unknown>;
      }
    } catch {
      parsed = null;
    }

    const parseOk = Boolean(parsed);
    const requiredKeys = ['title', 'body', 'summary_short'];
    const missingKeys = parseOk
      ? requiredKeys.filter((key) => typeof parsed?.[key] !== 'string')
      : requiredKeys;
    const body = parseOk && typeof parsed?.body === 'string' ? parsed.body : '';
    const summaryShort = parseOk && typeof parsed?.summary_short === 'string' ? parsed.summary_short : '';
    const bodyLooksShort = body.trim().length > 0 && body.trim().length < 280;
    const summarySentences = sentenceCount(summaryShort);

    const compactnessWarn =
      liveText.trim().length > 0 && body.trim().length > 0
        ? body.trim().length / Math.max(1, liveText.trim().length) > 1.6
        : false;

    return [
      {
        label: 'Output leesbaar als JSON',
        tone: parseOk ? 'ok' : 'fail',
        detail: parseOk ? undefined : 'De output kon niet worden gelezen als geldige JSON. Controleer of de instructie een correct object teruggeeft.',
      },
      {
        label: 'Alle verplichte velden aanwezig (titel, tekst, samenvatting)',
        tone: missingKeys.length === 0 ? 'ok' : 'fail',
        detail: missingKeys.length === 0 ? undefined : `Ontbrekend: ${missingKeys.join(', ')}`,
      },
      {
        label: 'Volledige tekst is geen samenvatting',
        tone: !parseOk ? 'fail' : bodyLooksShort ? 'warn' : 'ok',
        detail: !parseOk ? 'Niet te beoordelen.' : bodyLooksShort ? 'De volledige tekst lijkt erg kort. Controleer of er geen content verloren gaat.' : undefined,
      },
      {
        label: 'Lengte volledige tekst past bij de huidige versie',
        tone: compactnessWarn ? 'warn' : 'ok',
        detail: compactnessWarn ? 'De volledige tekst is duidelijk langer dan de huidige versie. Controleer of er extra tekst is bijgekomen die er niet in hoort.' : undefined,
      },
      {
        label: 'Geen structuurfouten of onbruikbare output',
        tone: parseOk && missingKeys.length === 0 ? 'ok' : 'fail',
        detail: parseOk && missingKeys.length === 0 ? undefined : 'Structuurfout of onvolledig resultaat. Deze versie kan niet worden geactiveerd.',
      },
      {
        label: 'Korte samenvatting is bondig (max. 3 zinnen)',
        tone: summarySentences <= 3 ? 'ok' : 'warn',
        detail: summarySentences > 3 ? `De korte samenvatting telt ${summarySentences} zinnen. Houd dit bij voorkeur op 1–3 zinnen.` : undefined,
      },
    ];
  }

  const textListShape = normalizedTestText.startsWith('[') && normalizedTestText.endsWith(']');
  const summaryLooksLong = args.taskKey === 'day_summary' && sentenceCount(normalizedTestText) > 6;
  const reflectionAdviceWarn =
    args.taskKey.includes('reflection_points') &&
    /(moet je|je zou|raad ik|adviseer|stap\s+\d|actiepunt)/i.test(normalizedTestText);

  const liveStringFieldLengths = parseStringFieldLengths(liveText.trim());
  const testStringFieldLengths = parseStringFieldLengths(normalizedTestText);
  const fieldLengthWarnings =
    liveStringFieldLengths && testStringFieldLengths
      ? Object.keys(testStringFieldLengths)
          .filter((fieldKey) => (liveStringFieldLengths[fieldKey] ?? 0) > 0)
          .filter((fieldKey) => testStringFieldLengths[fieldKey] > (liveStringFieldLengths[fieldKey] ?? 0) * 1.8)
      : [];

  const lengthWarn =
    fieldLengthWarnings.length > 0 ||
    (liveText.trim().length > 0 && normalizedTestText.length > liveText.trim().length * 1.8);

  const lengthWarnDetail =
    fieldLengthWarnings.length > 0
      ? `Duidelijk langere velden: ${fieldLengthWarnings
          .map((fieldKey) => formatObjectFieldLabel(args.taskKey, fieldKey))
          .join(', ')}.`
      : 'De output is duidelijk langer dan de huidige versie. Controleer of er extra tekst in staat die er niet in hoort.';

  return [
    {
      label: 'Output aanwezig en leesbaar',
      tone: textListShape || args.taskKey.endsWith('summary') || args.taskKey.endsWith('narrative') ? 'ok' : 'warn',
      detail: !textListShape && !args.taskKey.endsWith('summary') && !args.taskKey.endsWith('narrative')
        ? 'De output heeft geen herkend formaat. Controleer of de instructie het juiste type teruggeeft.'
        : undefined,
    },
    {
      label: 'Output is niet leeg',
      tone: normalizedTestText.length > 0 ? 'ok' : 'fail',
      detail: normalizedTestText.length > 0 ? undefined : 'Geen bruikbare output ontvangen.',
    },
    {
      label: summaryLooksLong
        ? 'Samenvatting is te lang'
        : reflectionAdviceWarn
          ? 'Reflectiepunten lijken op adviezen'
          : 'Inhoud past bij de taak',
      tone: summaryLooksLong || reflectionAdviceWarn ? 'warn' : 'ok',
      detail: summaryLooksLong
        ? 'De samenvatting is langer dan verwacht. Controleer of de instructie niet te uitgebreid is.'
        : reflectionAdviceWarn
          ? 'De reflectiepunten lijken richting advies of actiepunten te gaan. Houd het observerend.'
          : undefined,
    },
    {
      label: 'Lengte output past bij de huidige versie',
      tone: lengthWarn ? 'warn' : 'ok',
      detail: lengthWarn ? lengthWarnDetail : undefined,
    },
    {
      label: 'Geen kritieke fouten',
      tone: normalizedTestText.length > 0 ? 'ok' : 'fail',
      detail: normalizedTestText.length > 0 ? undefined : 'Lege output. Kan niet worden beoordeeld.',
    },
  ];
}

export default function AiQualityStudioValidateScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;
  const { taskKey, version } = useLocalSearchParams<{ taskKey?: string; version?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runningTest, setRunningTest] = useState(false);
  const [savingDecision, setSavingDecision] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const [detail, setDetail] = useState<AiTaskDetail | null>(null);
  const [testSources, setTestSources] = useState<AiTaskTestSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [caseSelectorExpanded, setCaseSelectorExpanded] = useState(false);
  const [sourceQuery, setSourceQuery] = useState('');
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualInputText, setManualInputText] = useState('');
  const [latestTestRun, setLatestTestRun] = useState<AiTaskTestRun | null>(null);
  const [compareView, setCompareView] = useState<AiTaskTestCompareView | null>(null);
  const [decisionLabel, setDecisionLabel] = useState<AiReviewLabel | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [candidateDiffTogglesByKey, setCandidateDiffTogglesByKey] = useState<Record<string, boolean>>({});

  const selectedVersion = useMemo(() => {
    if (!detail) return null;
    const requestedId = typeof version === 'string' ? version.trim() : '';
    if (!requestedId) return null;
    return detail.versions.find((item) => item.id === requestedId) ?? null;
  }, [detail, version]);

  const selectedSource = useMemo(
    () => testSources.find((source) => source.sourceRecordId === selectedSourceId) ?? null,
    [testSources, selectedSourceId]
  );

  const isEntryCleanup = detail?.key === 'entry_cleanup';
  const taskCapabilities = useMemo(
    () => (detail ? getAiQualityTaskCapabilities(detail.key) : null),
    [detail]
  );

  const filteredSources = useMemo(() => {
    const query = sourceQuery.trim().toLowerCase();
    if (!query) return testSources.slice(0, 6);
    return testSources
      .filter((source) => `${source.label} ${source.subtitle} ${source.preview}`.toLowerCase().includes(query))
      .slice(0, 6);
  }, [sourceQuery, testSources]);

  const baselineAvailable = compareView?.baselineStatus === 'available';
  const supportsInlineTesting = Boolean(taskCapabilities?.canTest && taskCapabilities?.canReview);
  const caseStorageKey = useMemo(() => {
    if (!detail?.key || !selectedVersion?.id) return null;
    return `aiqs_validate_case_${detail.key}_${selectedVersion.id}`;
  }, [detail?.key, selectedVersion?.id]);

  const canRunTest =
    Boolean(supportsInlineTesting) &&
    Boolean(selectedVersion) &&
    Boolean(selectedSource) &&
    (!manualInputMode || manualInputText.trim().length > 0) &&
    !runningTest &&
    !savingDecision;
  const noteRequired = decisionLabel === 'slechter' || decisionLabel === 'fout';

  const decisionDisabled =
    !latestTestRun ||
    !compareView ||
    !baselineAvailable ||
    !decisionLabel ||
    savingDecision ||
    (noteRequired && decisionNotes.trim().length === 0);

  const hasSavedReviewState = Boolean(compareView?.reviewerLabel || saveMessage);
  const savedReviewLabel = compareView?.reviewerLabel ?? null;
  const savedReviewNotes = compareView?.reviewerNotes ?? null;
  const draftRoute = detail && selectedVersion ? (`/settings-ai-quality-studio/${detail.key}/draft/${selectedVersion.id}` as never) : null;

  const contractSignals = useMemo(() => {
    if (!detail || !compareView) return [] as ContractSignal[];
    return buildContractSignals({
      taskKey: detail.key,
      compareView,
      testRun: latestTestRun,
    });
  }, [compareView, detail, latestTestRun]);

  const preferredOutputType: OutputRenderKind =
    detail?.key === 'entry_cleanup'
      ? 'object'
      : detail?.outputType === 'json'
        ? 'object'
        : detail?.outputType === 'text_list'
          ? 'list'
          : 'text';

  const normalizedBaselineOutput = useMemo(
    () =>
      normalizeOutput({
        rawText: compareView?.liveOutputText ?? null,
        rawJson: compareView?.liveOutputJson ?? null,
        preferredType: preferredOutputType,
        forceObjectParse: detail?.key === 'entry_cleanup',
      }),
    [compareView, preferredOutputType, detail?.key]
  );

  const normalizedCandidateOutput = useMemo(
    () =>
      normalizeOutput({
        rawText: compareView?.testOutputText ?? null,
        rawJson: compareView?.testOutputJson ?? null,
        preferredType: preferredOutputType,
        forceObjectParse: detail?.key === 'entry_cleanup',
      }),
    [compareView, preferredOutputType, detail?.key]
  );

  const baselineObjectFieldMap = useMemo(() => {
    if (normalizedBaselineOutput.kind !== 'object') return {} as Record<string, unknown>;
    return Object.fromEntries(normalizedBaselineOutput.fields.map((field) => [field.key, field.value]));
  }, [normalizedBaselineOutput]);

  const compareShapeMismatchNotice = useMemo(() => {
    if (!compareView || compareView.baselineStatus !== 'available') return null;
    if (normalizedBaselineOutput.kind === normalizedCandidateOutput.kind) return null;
    return 'Baseline en kandidaat hebben een verschillende output-structuur. Vergelijking wordt als best-effort getoond.';
  }, [compareView, normalizedBaselineOutput.kind, normalizedCandidateOutput.kind]);

  useEffect(() => {
    setCandidateDiffTogglesByKey({});
  }, [compareView?.testRunId]);

  const load = useCallback(async () => {
    const normalizedTaskKey = typeof taskKey === 'string' ? taskKey.trim() : '';
    if (!normalizedTaskKey) {
      setDetail(null);
      setLoading(false);
      setError('Geen geldige taskKey gevonden.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextDetail = await fetchAdminAiQualityStudioTaskDetail(normalizedTaskKey);
      const metadata = getAiQualityTaskMetadata(nextDetail.key, nextDetail.label);
      if (metadata.editorScope === 'read_only_part') {
        if (metadata.familyKey) {
          router.replace(`/settings-ai-quality-studio/group/${metadata.familyKey}` as never);
        } else if (metadata.editorTargetTaskKey) {
          router.replace(`/settings-ai-quality-studio/${metadata.editorTargetTaskKey}` as never);
        }
        return;
      }
      setDetail(nextDetail);

      const nextCapabilities = getAiQualityTaskCapabilities(nextDetail.key);
      if (nextCapabilities.canTest) {
        setLoadingSources(true);
        try {
          const sources = await listAdminAiQualityStudioTestSources(nextDetail.key);
          setTestSources(sources);
        } finally {
          setLoadingSources(false);
        }
      } else {
        setTestSources([]);
        setSelectedSourceId(null);
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
      setDetail(null);
      setTestSources([]);
      setSelectedSourceId(null);
    } finally {
      setLoading(false);
    }
  }, [taskKey]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  useEffect(() => {
    if (!caseStorageKey) {
      setSelectedSourceId(null);
      return;
    }
    if (testSources.length === 0) {
      setSelectedSourceId(null);
      return;
    }

    let active = true;
    (async () => {
      const storedId = await loadPersistedValidateCaseId(caseStorageKey);
      if (!active) return;
      if (storedId) {
        const exists = testSources.some((item) => item.sourceRecordId === storedId);
        setSelectedSourceId(exists ? storedId : null);
        return;
      }
      setSelectedSourceId(null);
    })();

    return () => {
      active = false;
    };
  }, [caseStorageKey, testSources]);

  const handleSelectSource = useCallback(
    (sourceRecordId: string) => {
      setSelectedSourceId(sourceRecordId);
      setCaseSelectorExpanded(false);
      if (caseStorageKey) {
        void persistValidateCaseId(caseStorageKey, sourceRecordId);
      }
    },
    [caseStorageKey]
  );

  function resetDecisionStateForRetry() {
    setDecisionLabel(null);
    setDecisionNotes('');
    setSaveMessage(null);
    if (compareView) {
      setCompareView({
        ...compareView,
        reviewerLabel: null,
        reviewerNotes: null,
      });
    }
  }

  function handleChooseOtherCase() {
    setManualInputMode(false);
    setCaseSelectorExpanded(true);
    resetDecisionStateForRetry();
  }

  async function handleRunTest() {
    if (!detail || !selectedVersion || !selectedSource || runningTest) return;
    const sourceType = selectedSource.sourceType;
    if (sourceType !== 'entry' && sourceType !== 'day') {
      setError('Alleen entry/day test-bronnen worden nu ondersteund.');
      return;
    }
    if (!taskCapabilities?.allowedSourceTypes.includes(sourceType)) {
      setError('Alleen entry/day test-bronnen worden nu ondersteund.');
      return;
    }

    setRunningTest(true);
    setError(null);
    setSaveMessage(null);

    // Run again reset
    resetDecisionStateForRetry();
    setCompareView(null);

    try {
      const created = await runAdminAiQualityStudioTest({
        taskKey: detail.key,
        taskVersionId: selectedVersion.id,
        sourceType,
        sourceRecordId: selectedSource.sourceRecordId,
      });

      const reloaded = await fetchAdminAiQualityStudioTestRun(created.id);
      setLatestTestRun(reloaded);

      const compare = await fetchAdminAiQualityStudioCompareView(reloaded.id);
      setCompareView(compare);
      setDecisionLabel(compare.reviewerLabel ?? null);
      setDecisionNotes(compare.reviewerNotes ?? '');
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setRunningTest(false);
    }
  }

  async function handleSaveDecision() {
    if (!latestTestRun || !decisionLabel || savingDecision || !baselineAvailable) return;

    setSavingDecision(true);
    setError(null);
    setSaveMessage(null);
    try {
      const updated = await saveAdminAiQualityStudioTestReview({
        testRunId: latestTestRun.id,
        label: decisionLabel,
        notes: decisionNotes.trim() || null,
      });
      setLatestTestRun(updated);
      setSaveMessage('Oordeel opgeslagen voor deze run.');
      if (compareView) {
        setCompareView({
          ...compareView,
          reviewerLabel: updated.reviewerLabel,
          reviewerNotes: updated.reviewerNotes,
        });
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setSavingDecision(false);
    }
  }

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      fixedFooter={
        !loading && detail && selectedVersion && supportsInlineTesting ? (
          <AdminStickyFooterActions
            primaryAction={
              hasSavedReviewState
                ? {
                    label: runningTest ? 'Runnen…' : 'Opnieuw testen',
                    onPress: () => void handleRunTest(),
                    disabled: !canRunTest,
                    icon: 'refresh',
                  }
                : latestTestRun
                ? {
                    label: savingDecision ? 'Opslaan…' : 'Opslaan oordeel',
                    onPress: () => void handleSaveDecision(),
                    disabled: decisionDisabled,
                    icon: 'check-circle-outline',
                  }
                : {
                    label: runningTest ? 'Runnen…' : 'Run test',
                    onPress: () => void handleRunTest(),
                    disabled: !canRunTest,
                    icon: 'play-arrow',
                  }
            }
            secondaryAction={
              hasSavedReviewState
                ? {
                    label: 'Terug naar draft',
                    onPress: () => {
                      if (draftRoute) router.push(draftRoute);
                    },
                    icon: 'arrow-back',
                    disabled: !draftRoute,
                  }
                : latestTestRun
                ? {
                    label: runningTest ? 'Runnen…' : 'Run again',
                    onPress: () => void handleRunTest(),
                    disabled: !canRunTest,
                    icon: 'refresh',
                  }
                : undefined
            }
            tertiaryAction={{
              label: hasSavedReviewState ? 'Andere case kiezen' : 'Terug',
              onPress: () => {
                if (hasSavedReviewState) {
                  handleChooseOtherCase();
                  return;
                }
                if (draftRoute) router.push(draftRoute);
              },
              icon: hasSavedReviewState ? 'filter-list' : 'arrow-back',
              tone: 'quiet',
            }}
          />
        ) : null
      }
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero title="Valideren" subtitle={detail?.label ?? 'AI Quality Studio'} />

      {detail && selectedVersion ? (
        <AdminMetaStrip
          items={[
            `Draft: v${selectedVersion.versionNumber}`,
            detail.liveVersion ? `Runtime-basis: v${detail.liveVersion.versionNumber}` : 'Runtime-basis ontbreekt',
            latestTestRun ? `Laatste run: ${latestTestRun.id.slice(0, 8)}` : 'Nog geen run',
          ]}
        />
      ) : null}

      {loading ? <StateBlock tone="loading" message="Validate mode laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon validate mode niet laden." detail={error} /> : null}

      {!loading && detail && selectedVersion ? (
        <>
          <SurfaceSection title="Case kiezen" subtitle="Kies één bron en run de draft tegen de baseline.">
            {isEntryCleanup ? (
              <ThemedView style={styles.modeSwitchRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setManualInputMode(false)}
                  style={[
                    styles.modeSwitchChip,
                    {
                      backgroundColor: !manualInputMode ? palette.surface : palette.surfaceLow,
                      borderColor: !manualInputMode ? palette.primary : palette.separator,
                    },
                  ]}
                >
                  <ThemedText type="caption">Gebruik case</ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setManualInputMode(true)}
                  style={[
                    styles.modeSwitchChip,
                    {
                      backgroundColor: manualInputMode ? palette.surface : palette.surfaceLow,
                      borderColor: manualInputMode ? palette.primary : palette.separator,
                    },
                  ]}
                >
                  <ThemedText type="caption">Gebruik eigen tekst</ThemedText>
                </Pressable>
              </ThemedView>
            ) : null}

            {manualInputMode && isEntryCleanup ? (
              <ThemedView style={styles.manualInputBlock}>
                <MetaText>Tijdelijke handmatige testinput (alleen voor deze sessie)</MetaText>
                <TextAreaField
                  value={manualInputText}
                  onChangeText={setManualInputText}
                  placeholder="Plak of typ je eigen ruwe entrytekst"
                  style={styles.textAreaSmall}
                />
                <MetaText>
                  Handmatige input overschrijft case-context in de UX; schakel terug naar “Gebruik case” om je opgeslagen case weer te gebruiken.
                </MetaText>
              </ThemedView>
            ) : (
              <>
                {loadingSources ? <MetaText>Bronnen laden…</MetaText> : null}

                {!loadingSources && selectedSource ? (
                  <ThemedView style={[styles.selectedCaseCard, { backgroundColor: palette.surfaceLow }]}>
                    <ThemedText type="defaultSemiBold">{selectedSource.label}</ThemedText>
                    <MetaText>{selectedSource.subtitle}</MetaText>
                    <ThemedText type="caption" numberOfLines={1} style={styles.sourcePreview}>
                      {selectedSource.preview}
                    </ThemedText>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setCaseSelectorExpanded((prev) => !prev)}
                      style={styles.inlineActionButton}
                    >
                      <ThemedText type="caption" style={{ color: palette.primary }}>
                        {caseSelectorExpanded ? 'Sluit case selector' : 'Change case'}
                      </ThemedText>
                    </Pressable>
                  </ThemedView>
                ) : null}

                {!loadingSources && !selectedSource ? (
                  <ThemedView style={styles.emptyCaseBlock}>
                    <MetaText>Nog geen case geselecteerd.</MetaText>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setCaseSelectorExpanded(true)}
                      style={styles.inlineActionButton}
                    >
                      <ThemedText type="caption" style={{ color: palette.primary }}>
                        Kies case
                      </ThemedText>
                    </Pressable>
                  </ThemedView>
                ) : null}

                {!loadingSources && caseSelectorExpanded ? (
                  <ThemedView style={styles.caseSelectorExpandedBlock}>
                    <InputField value={sourceQuery} onChangeText={setSourceQuery} placeholder="Zoek case" />
                    {filteredSources.length > 0 ? (
                      <ThemedView style={styles.sourceList}>
                        {filteredSources.map((source) => (
                          <Pressable
                            key={`${source.sourceType}:${source.sourceRecordId}`}
                            accessibilityRole="button"
                            onPress={() => handleSelectSource(source.sourceRecordId)}
                            style={[
                              styles.sourceRow,
                              {
                                backgroundColor:
                                  source.sourceRecordId === selectedSourceId ? palette.surface : palette.surfaceLow,
                              },
                            ]}
                          >
                            <ThemedText type="defaultSemiBold">{source.label}</ThemedText>
                            <MetaText>{source.subtitle}</MetaText>
                            <ThemedText type="caption" numberOfLines={2} style={styles.sourcePreview}>
                              {source.preview}
                            </ThemedText>
                          </Pressable>
                        ))}
                      </ThemedView>
                    ) : (
                      <MetaText>Geen cases gevonden.</MetaText>
                    )}
                  </ThemedView>
                ) : null}
              </>
            )}
          </SurfaceSection>

          <ThemedView style={[styles.compareLayout, isDesktop && styles.compareLayoutDesktop]}>
            <AdminSection title="Huidige versie" subtitle="Wat nu live staat (basis voor vergelijking)">
              {!compareView ? (
                <StateBlock tone="info" message="Nog geen run" detail="Run eerst een test om baseline te laden." />
              ) : compareView.baselineStatus !== 'available' ? (
                <StateBlock
                  tone="error"
                  message="Geen baseline beschikbaar"
                  detail={compareView.baselineReason ?? 'Zonder baseline is valideren geblokkeerd.'}
                />
              ) : (
                <ThemedView style={styles.outputBlock}>
                  {compareShapeMismatchNotice ? <MetaText>{compareShapeMismatchNotice}</MetaText> : null}
                  {normalizedBaselineOutput.kind === 'object' ? (
                    <ThemedView style={styles.outputStack}>
                      {normalizedBaselineOutput.fields.map((field) => (
                        <ThemedView
                          key={`baseline-${field.key}`}
                          style={[styles.outputFieldCard, { backgroundColor: palette.surfaceLow }]}
                        >
                          <ThemedText type="defaultSemiBold">{formatObjectFieldLabel(detail?.key, field.key)}</ThemedText>
                          <ThemedText type="bodySecondary">{renderUnknownValue(field.value)}</ThemedText>
                        </ThemedView>
                      ))}
                    </ThemedView>
                  ) : null}

                  {normalizedBaselineOutput.kind === 'list' ? (
                    normalizedBaselineOutput.items.length > 0 ? (
                      <ThemedView style={styles.outputStack}>
                        {normalizedBaselineOutput.items.map((item, index) => (
                          <ThemedView
                            key={`baseline-item-${index}`}
                            style={[styles.outputFieldCard, { backgroundColor: palette.surfaceLow }]}
                          >
                            <ThemedText type="defaultSemiBold">Item {index + 1}</ThemedText>
                            <ThemedText type="bodySecondary">{renderUnknownValue(item)}</ThemedText>
                          </ThemedView>
                        ))}
                      </ThemedView>
                    ) : (
                      <MetaText>Lege lijst.</MetaText>
                    )
                  ) : null}

                  {normalizedBaselineOutput.kind === 'text' ? (
                    <>
                      {normalizedBaselineOutput.parseFallback ? (
                        <MetaText>Kon baseline niet veilig als gestructureerde output parsen; toont leesbare tekstfallback.</MetaText>
                      ) : null}
                      <ThemedView style={[styles.outputFieldCard, { backgroundColor: palette.surfaceLow }]}> 
                        <ThemedText type="bodySecondary">{normalizedBaselineOutput.text || 'Geen output.'}</ThemedText>
                      </ThemedView>
                    </>
                  ) : null}
                </ThemedView>
              )}
            </AdminSection>

            <AdminSection title="Nieuwe versie" subtitle="Wat de draft teruggeeft op deze case">
              {!compareView ? (
                <StateBlock tone="info" message="Nog geen run" detail="Run een test om kandidaat-output te zien." />
              ) : (
                <ThemedView style={styles.outputBlock}>
                  {normalizedCandidateOutput.kind === 'object' ? (
                    <ThemedView style={styles.outputStack}>
                      {normalizedCandidateOutput.fields.map((field) => (
                        (() => {
                          const diffKey = `field:${field.key}`;
                          const candidateText = typeof field.value === 'string' ? field.value : null;
                          const baselineValue = baselineObjectFieldMap[field.key];
                          const baselineText = typeof baselineValue === 'string' ? baselineValue : null;
                          const canShowDiff = Boolean(candidateText !== null && baselineText !== null);
                          const diffOpen = Boolean(candidateDiffTogglesByKey[diffKey]);

                          return (
                            <ThemedView
                              key={`candidate-${field.key}`}
                              style={[styles.outputFieldCard, { backgroundColor: palette.surfaceLow }]}
                            >
                              <ThemedText type="defaultSemiBold">{formatObjectFieldLabel(detail?.key, field.key)}</ThemedText>
                              {diffOpen && canShowDiff ? (
                                <ThemedView style={[styles.inlineDiffWrap, { backgroundColor: palette.surfaceLowest }]}> 
                                  <InlineWordDiffText beforeText={baselineText ?? ''} afterText={candidateText ?? ''} />
                                </ThemedView>
                              ) : (
                                <ThemedText type="bodySecondary">{renderUnknownValue(field.value)}</ThemedText>
                              )}

                              {canShowDiff ? (
                                <>
                                  <Pressable
                                    accessibilityRole="button"
                                    onPress={() =>
                                      setCandidateDiffTogglesByKey((prev) => ({
                                        ...prev,
                                        [diffKey]: !prev[diffKey],
                                      }))
                                    }
                                    style={styles.diffToggleButton}
                                  >
                                    <ThemedText type="caption" style={{ color: palette.primary }}>
                                      {diffOpen ? 'Verberg diff' : 'Toon diff'}
                                    </ThemedText>
                                  </Pressable>
                                </>
                              ) : null}
                            </ThemedView>
                          );
                        })()
                      ))}
                    </ThemedView>
                  ) : null}

                  {normalizedCandidateOutput.kind === 'list' ? (
                    normalizedCandidateOutput.items.length > 0 ? (
                      <ThemedView style={styles.outputStack}>
                        {normalizedCandidateOutput.items.map((item, index) => (
                          <ThemedView
                            key={`candidate-item-${index}`}
                            style={[styles.outputFieldCard, { backgroundColor: palette.surfaceLow }]}
                          >
                            <ThemedText type="defaultSemiBold">Item {index + 1}</ThemedText>
                            <ThemedText type="bodySecondary">{renderUnknownValue(item)}</ThemedText>
                          </ThemedView>
                        ))}
                      </ThemedView>
                    ) : (
                      <MetaText>Lege lijst.</MetaText>
                    )
                  ) : null}

                  {normalizedCandidateOutput.kind === 'text' ? (
                    (() => {
                      const diffKey = 'text:root';
                      const baselineText = normalizedBaselineOutput.kind === 'text' ? normalizedBaselineOutput.text : null;
                      const candidateText = normalizedCandidateOutput.text;
                      const canShowDiff = Boolean(baselineText !== null && candidateText.length > 0);
                      const diffOpen = Boolean(candidateDiffTogglesByKey[diffKey]);

                      return (
                    <>
                      {normalizedCandidateOutput.parseFallback ? (
                        <MetaText>Kon kandidaat-output niet veilig als gestructureerde output parsen; toont leesbare tekstfallback.</MetaText>
                      ) : null}
                      <ThemedView style={[styles.outputFieldCard, { backgroundColor: palette.surfaceLow }]}> 
                        {diffOpen && canShowDiff ? (
                          <ThemedView style={[styles.inlineDiffWrap, { backgroundColor: palette.surfaceLowest }]}> 
                            <InlineWordDiffText beforeText={baselineText ?? ''} afterText={candidateText} />
                          </ThemedView>
                        ) : (
                          <ThemedText type="bodySecondary">{normalizedCandidateOutput.text || 'Geen output.'}</ThemedText>
                        )}

                        {canShowDiff ? (
                          <>
                            <Pressable
                              accessibilityRole="button"
                              onPress={() =>
                                setCandidateDiffTogglesByKey((prev) => ({
                                  ...prev,
                                  [diffKey]: !prev[diffKey],
                                }))
                              }
                              style={styles.diffToggleButton}
                            >
                              <ThemedText type="caption" style={{ color: palette.primary }}>
                                {diffOpen ? 'Verberg diff' : 'Toon diff'}
                              </ThemedText>
                            </Pressable>
                          </>
                        ) : null}
                      </ThemedView>
                    </>
                      );
                    })()
                  ) : null}
                </ThemedView>
              )}
            </AdminSection>
          </ThemedView>

          <SurfaceSection title="Snelle controle" subtitle="Objectieve signalen over de kwaliteit van deze versie.">
            {contractSignals.length === 0 ? (
              <MetaText>Run eerst een test om signals te tonen.</MetaText>
            ) : (
              <ThemedView style={styles.signalList}>
                {contractSignals.map((signal) => (
                  <ThemedView key={signal.label} style={styles.signalRow}>
                    <ThemedText type="defaultSemiBold">
                      {tonePrefix(signal.tone)} {signal.label}
                    </ThemedText>
                    {signal.detail ? <MetaText>{signal.detail}</MetaText> : null}
                  </ThemedView>
                ))}
              </ThemedView>
            )}
          </SurfaceSection>

          <SurfaceSection title="Beslissing" subtitle="Kies één oordeel en sla deze run op als bewijs.">
            {!compareView ? (
              <MetaText>Run eerst een test.</MetaText>
            ) : compareView.baselineStatus !== 'available' ? (
              <StateBlock
                tone="error"
                message="Beslissing geblokkeerd"
                detail="Zonder baseline is geen valide vergelijkbeslissing mogelijk."
              />
            ) : (
              <>
                <ThemedView style={[styles.labelGrid, isDesktop && styles.labelGridDesktop]}>
                  {(['beter', 'gelijk', 'slechter', 'fout'] as AiReviewLabel[]).map((label) => {
                    const active = decisionLabel === label;
                    return (
                      <Pressable
                        key={label}
                        accessibilityRole="button"
                        onPress={() => setDecisionLabel(label)}
                        style={[
                          styles.labelOption,
                          {
                            backgroundColor: active ? palette.surface : palette.surfaceLow,
                            borderColor: active ? palette.primary : palette.separator,
                          },
                        ]}
                      >
                        <ThemedText type="defaultSemiBold">{label}</ThemedText>
                      </Pressable>
                    );
                  })}
                </ThemedView>

                {noteRequired ? (
                  <ThemedView style={styles.noteBlock}>
                    <MetaText>Notitie (verplicht bij slechter/fout)</MetaText>
                    <TextAreaField
                      value={decisionNotes}
                      onChangeText={setDecisionNotes}
                      placeholder="Beschrijf kort waarom deze run slechter/fout is."
                      style={styles.textAreaSmall}
                    />
                  </ThemedView>
                ) : null}

                {hasSavedReviewState ? (
                  <ThemedView style={[styles.savedReviewCard, { backgroundColor: palette.surfaceLow }]}>
                    <ThemedText type="defaultSemiBold">Oordeel opgeslagen: {savedReviewLabel ?? 'onbekend'}</ThemedText>
                    {savedReviewNotes ? <MetaText>{savedReviewNotes}</MetaText> : null}
                    <MetaText>Bewijs vastgelegd op deze run en klaar voor vervolgstap.</MetaText>

                    <ThemedView style={styles.savedActionRow}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => void handleRunTest()}
                        style={styles.inlineActionButton}
                        disabled={!canRunTest}
                      >
                        <ThemedText type="caption" style={{ color: palette.primary }}>
                          Opnieuw testen
                        </ThemedText>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => {
                          if (draftRoute) router.push(draftRoute);
                        }}
                        style={styles.inlineActionButton}
                      >
                        <ThemedText type="caption" style={{ color: palette.primary }}>
                          Terug naar draft
                        </ThemedText>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={handleChooseOtherCase}
                        style={styles.inlineActionButton}
                      >
                        <ThemedText type="caption" style={{ color: palette.primary }}>
                          Andere case kiezen
                        </ThemedText>
                      </Pressable>
                    </ThemedView>
                  </ThemedView>
                ) : null}
                {compareView.reviewerLabel ? (
                  <MetaText>
                    Opgeslagen oordeel: {compareView.reviewerLabel}
                    {compareView.reviewerNotes ? ` · ${compareView.reviewerNotes}` : ''}
                  </MetaText>
                ) : null}
              </>
            )}
          </SurfaceSection>
        </>
      ) : null}

      {!loading && detail && !selectedVersion ? (
        <StateBlock
          tone="info"
          message="Geen geldige versie gekozen"
          detail="Ga terug naar overzicht of draft om een versie te kiezen."
        />
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
  sourceList: {
    gap: spacing.sm,
  },
  caseSelectorExpandedBlock: {
    gap: spacing.sm,
  },
  selectedCaseCard: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
  emptyCaseBlock: {
    gap: spacing.xs,
  },
  inlineActionButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xxs,
  },
  modeSwitchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  modeSwitchChip: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  manualInputBlock: {
    gap: spacing.xs,
  },
  sourceRow: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
  sourcePreview: {
    color: colorTokens.dark.mutedSoft,
  },
  compareLayout: {
    gap: spacing.content,
  },
  compareLayoutDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  outputBlock: {
    gap: spacing.sm,
  },
  outputStack: {
    gap: spacing.sm,
  },
  outputFieldCard: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
  diffToggleButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xxs,
  },
  inlineDiffWrap: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  textAreaLarge: {
    minHeight: 220,
  },
  textAreaSmall: {
    minHeight: 120,
  },
  signalList: {
    gap: spacing.sm,
  },
  signalRow: {
    gap: spacing.xxs,
  },
  labelGrid: {
    gap: spacing.sm,
  },
  labelGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labelOption: {
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  noteBlock: {
    gap: spacing.xs,
  },
  savedReviewCard: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  savedActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});