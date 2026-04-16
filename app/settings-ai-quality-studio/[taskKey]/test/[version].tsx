import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminMetaStrip,
  AdminPageHero,
  AdminReadOnlyBlock,
  AdminSection,
  AdminShell,
  AdminStickyFooterActions,
  SettingsTopNav,
} from '@/components/ui/settings-screen-primitives';
import {
  InputField,
  MetaText,
  StateBlock,
  SurfaceSection,
  TextAreaField,
} from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  fetchAdminAiQualityStudioCompareView,
  fetchAdminAiQualityStudioTaskDetail,
  fetchAdminAiQualityStudioTestRun,
  listAdminAiQualityStudioTestSources,
  runAdminAiQualityStudioTest,
} from '@/services';
import type {
  AiTaskDetail,
  AiTaskTestCompareView,
  AiTaskTestRun,
  AiTaskTestSource,
} from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';
import {
  buildLineDiffText,
  deriveDraftOriginLabel,
  formatDateTimeLabel,
  getEntryCleanupTechnicalContractFromConfig,
  getEntryCleanupTechnicalContractLines,
  getTaskInputContractLines,
  getTaskResponseContractFields,
  getTaskConsistencyInfo,
  parseEntryCleanupInstructionStateFromPromptTemplate,
} from '../../_shared';
import { getAiQualityTaskCapabilities, getAiQualityTaskMetadata } from '@/services/ai-quality-studio/readmodel';

type EntryCleanupOutput = {
  title: string;
  body: string;
  summary_short: string;
};

function parseEntryCleanupOutput(value: unknown): {
  output: EntryCleanupOutput | null;
  parseOk: boolean;
  unknownKeys: string[];
} {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { output: null, parseOk: false, unknownKeys: [] };
  }

  const record = value as Record<string, unknown>;
  const known = new Set(['title', 'body', 'summary_short']);
  const unknownKeys = Object.keys(record).filter((key) => !known.has(key));
  const title = typeof record.title === 'string' ? record.title : '';
  const body = typeof record.body === 'string' ? record.body : '';
  const summaryShort = typeof record.summary_short === 'string' ? record.summary_short : '';

  return {
    output: {
      title,
      body,
      summary_short: summaryShort,
    },
    parseOk: true,
    unknownKeys,
  };
}

function parseEntryCleanupOutputFromText(value: string | null | undefined) {
  if (!value) {
    return { output: null, parseOk: false, unknownKeys: [] as string[] };
  }
  try {
    const parsed = JSON.parse(value);
    return parseEntryCleanupOutput(parsed);
  } catch {
    return { output: null, parseOk: false, unknownKeys: [] as string[] };
  }
}

function sentenceCount(value: string): number {
  const normalized = value.trim();
  if (!normalized) return 0;
  return normalized
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}

export default function AiQualityStudioTestScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { taskKey, version } = useLocalSearchParams<{ taskKey?: string; version?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runningTest, setRunningTest] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [detail, setDetail] = useState<AiTaskDetail | null>(null);
  const [testSources, setTestSources] = useState<AiTaskTestSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [sourceQuery, setSourceQuery] = useState('');
  const [latestTestRun, setLatestTestRun] = useState<AiTaskTestRun | null>(null);
  const [compareView, setCompareView] = useState<AiTaskTestCompareView | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const filteredSources = useMemo(() => {
    const query = sourceQuery.trim().toLowerCase();
    if (!query) return testSources.slice(0, 6);
    return testSources
      .filter((source) => `${source.label} ${source.subtitle} ${source.preview}`.toLowerCase().includes(query))
      .slice(0, 6);
  }, [sourceQuery, testSources]);

  const taskConsistency = useMemo(() => {
    if (!detail) return null;
    return getTaskConsistencyInfo(detail.key);
  }, [detail]);
  const taskCapabilities = useMemo(
    () => (detail ? getAiQualityTaskCapabilities(detail.key) : null),
    [detail]
  );

  const isEntryCleanup = detail?.key === 'entry_cleanup';
  const responseContractFields = useMemo(
    () => (detail ? getTaskResponseContractFields(detail.key) : []),
    [detail]
  );
  const inputContractLines = useMemo(
    () => (detail ? getTaskInputContractLines(detail.key) : []),
    [detail]
  );
  const entryCleanupTechnicalContractLines = useMemo(() => {
    if (!isEntryCleanup || !selectedVersion) return [];
    const contract = getEntryCleanupTechnicalContractFromConfig(selectedVersion.configJson ?? {});
    return getEntryCleanupTechnicalContractLines(contract);
  }, [isEntryCleanup, selectedVersion]);

  const supportsInlineTesting = Boolean(taskCapabilities?.canTest);
  const canRunTest =
    Boolean(supportsInlineTesting) &&
    Boolean(selectedVersion) &&
    Boolean(selectedSource) &&
    Boolean(
      selectedSource && taskCapabilities?.allowedSourceTypes.includes(selectedSource.sourceType as 'entry' | 'day')
    ) &&
    !runningTest;
  const showFooterActions = !loading && detail && selectedVersion && supportsInlineTesting;

  const entryCleanupInstruction = useMemo(() => {
    if (!isEntryCleanup || !selectedVersion) return null;
    return parseEntryCleanupInstructionStateFromPromptTemplate(selectedVersion.promptTemplate);
  }, [isEntryCleanup, selectedVersion]);

  const entryCleanupTestOutput = useMemo(() => {
    if (!isEntryCleanup || !latestTestRun) {
      return { output: null, parseOk: false, unknownKeys: [] as string[] };
    }
    if (latestTestRun.outputJson) {
      return parseEntryCleanupOutput(latestTestRun.outputJson);
    }
    return parseEntryCleanupOutputFromText(latestTestRun.outputText);
  }, [isEntryCleanup, latestTestRun]);

  const entryCleanupLiveOutput = useMemo(() => {
    if (!isEntryCleanup || !compareView) {
      return { output: null, parseOk: false, unknownKeys: [] as string[] };
    }
    return parseEntryCleanupOutputFromText(compareView.liveOutputText);
  }, [compareView, isEntryCleanup]);

  const entryCleanupCompareTestOutput = useMemo(() => {
    if (!isEntryCleanup || !compareView) {
      return { output: null, parseOk: false, unknownKeys: [] as string[] };
    }
    return parseEntryCleanupOutputFromText(compareView.testOutputText);
  }, [compareView, isEntryCleanup]);

  const entryCleanupQualityHints = useMemo(() => {
    if (!isEntryCleanup) return [] as { label: string; ok: boolean; detail?: string }[];

    const output = entryCleanupTestOutput.output;
    const rawTextSource = latestTestRun?.inputSnapshotJson?.rawText;
    const rawText = typeof rawTextSource === 'string' ? rawTextSource : '';
    const body = output?.body ?? '';
    const summaryShort = output?.summary_short ?? '';
    const summarySentences = sentenceCount(summaryShort);
    const bodyRatio = rawText.trim().length > 0 ? body.trim().length / rawText.trim().length : 1;

    return [
      {
        label: 'JSON parse OK',
        ok: entryCleanupTestOutput.parseOk,
      },
      {
        label: 'Alleen bekende outputvelden aanwezig',
        ok: entryCleanupTestOutput.unknownKeys.length === 0,
        detail:
          entryCleanupTestOutput.unknownKeys.length > 0
            ? `Onbekend: ${entryCleanupTestOutput.unknownKeys.join(', ')}`
            : undefined,
      },
      {
        label: 'Body lijkt niet samengevat',
        ok: body.trim().length > 0 && body.trim().length >= 280,
      },
      {
        label: 'Body lijkt niet merkbaar ingekort',
        ok: body.trim().length > 0 && bodyRatio >= 0.65,
        detail: rawText ? `Indicatie ratio body/brontekst: ${bodyRatio.toFixed(2)}` : 'Geen brontekst beschikbaar',
      },
      {
        label: 'Summary_short is 0–3 korte zinnen',
        ok: summarySentences <= 3,
        detail: `Geteld: ${summarySentences} zin(nen)`,
      },
    ];
  }, [entryCleanupTestOutput, isEntryCleanup, latestTestRun]);

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
          setSelectedSourceId(sources[0]?.sourceRecordId ?? null);
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

    try {
      const created = await runAdminAiQualityStudioTest({
        taskKey: detail.key,
        taskVersionId: selectedVersion.id,
        sourceType,
        sourceRecordId: selectedSource.sourceRecordId,
      });

      const reloaded = await fetchAdminAiQualityStudioTestRun(created.id);
      setLatestTestRun(reloaded);

      setLoadingCompare(true);
      try {
        const compare = await fetchAdminAiQualityStudioCompareView(reloaded.id);
        setCompareView(compare);
      } finally {
        setLoadingCompare(false);
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setRunningTest(false);
    }
  }

  async function handleLoadCompare() {
    if (!latestTestRun || loadingCompare) return;
    setLoadingCompare(true);
    setError(null);
    try {
      const compare = await fetchAdminAiQualityStudioCompareView(latestTestRun.id);
      setCompareView(compare);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setLoadingCompare(false);
    }
  }

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      fixedFooter={
        showFooterActions ? (
          <AdminStickyFooterActions
            primaryAction={{
              label: runningTest ? 'Testen…' : 'Test',
              onPress: () => void handleRunTest(),
              disabled: !canRunTest || loadingSources,
              icon: 'play-arrow',
            }}
            secondaryAction={
              latestTestRun && taskCapabilities?.canCompare
                ? {
                    label: loadingCompare ? 'Vergelijken…' : 'Vergelijk live',
                    onPress: () => void handleLoadCompare(),
                    disabled: loadingCompare,
                    icon: 'difference',
                  }
                : undefined
            }
            tertiaryAction={{
              label: 'Terug',
              onPress: () => router.push(`/settings-ai-quality-studio/${detail.key}/draft/${selectedVersion.id}` as never),
              icon: 'arrow-back',
              tone: 'quiet',
            }}
          />
        ) : null
      }
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero title="Testen" subtitle={detail?.label ?? 'AI Quality Studio'} />

      {detail && selectedVersion ? (
        <AdminMetaStrip
          items={[
            `Draft: v${selectedVersion.versionNumber}`,
            detail.liveVersion ? `Runtime: v${detail.liveVersion.versionNumber}` : 'Runtime nog niet ingesteld',
          ]}
        />
      ) : null}

      {loading ? <StateBlock tone="loading" message="Testomgeving laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon testscherm niet laden." detail={error} /> : null}

      {!loading && detail && selectedVersion ? (
        <>
          <AdminSection title={isEntryCleanup ? 'Runtime-basis' : 'Versiecontext'}>
            <MetaText>Onderdeel: {detail.label}</MetaText>
            <MetaText>Draft versie: v{selectedVersion.versionNumber}</MetaText>
            <MetaText>Model: {selectedVersion.model}</MetaText>
            <MetaText>
              Runtime-basis:{' '}
              {detail.liveVersion
                ? `v${detail.liveVersion.versionNumber} · ${detail.liveVersion.model}`
                : 'nog niet ingesteld'}
            </MetaText>
            <MetaText>{deriveDraftOriginLabel(detail, selectedVersion)}</MetaText>
            {selectedVersion.updatedAt ? <MetaText>Bijgewerkt: {formatDateTimeLabel(selectedVersion.updatedAt)}</MetaText> : null}
            {taskConsistency ? <MetaText>Beïnvloedt: {taskConsistency.affectsLabel}</MetaText> : null}
            {isEntryCleanup ? (
              <>
                <MetaText>Runtime-groep: {taskConsistency?.familyLabel ?? 'entry normalisatie'}</MetaText>
                <MetaText>Outputlaag: entries_normalized</MetaText>
              </>
            ) : null}
          </AdminSection>

          {isEntryCleanup ? (
            <AdminSection title="Technisch contract (read-only)">
              <ThemedView style={styles.resultGroup}>
                <AdminReadOnlyBlock title="Input contract" lines={inputContractLines} />
                <AdminReadOnlyBlock title="Technisch contract" lines={entryCleanupTechnicalContractLines} />
                <AdminReadOnlyBlock
                  title="Response contract"
                  lines={responseContractFields.map((field) => `${field.name}: ${field.type}`)}
                />
              </ThemedView>
            </AdminSection>
          ) : null}

            {isEntryCleanup && entryCleanupInstruction ? (
              <SurfaceSection title="Instructies">
                <ThemedView style={styles.resultGroup}>
                  <ThemedText type="defaultSemiBold">Algemene instructie</ThemedText>
                  <TextAreaField value={entryCleanupInstruction.generalInstruction} editable={false} style={styles.textAreaSmall} />

                  <ThemedText type="defaultSemiBold">Titel</ThemedText>
                  <TextAreaField value={entryCleanupInstruction.titleInstruction} editable={false} style={styles.textAreaSmall} />

                  <ThemedText type="defaultSemiBold">Body</ThemedText>
                  <TextAreaField value={entryCleanupInstruction.bodyInstruction} editable={false} style={styles.textAreaMedium} />

                  <ThemedText type="defaultSemiBold">Summary_short</ThemedText>
                  <TextAreaField value={entryCleanupInstruction.summaryShortInstruction} editable={false} style={styles.textAreaSmall} />
                </ThemedView>
              </SurfaceSection>
            ) : null}

          <SurfaceSection title="Bron kiezen">
            {loadingSources ? <MetaText>Bronnen laden…</MetaText> : null}
            {!loadingSources && testSources.length > 0 ? (
              <InputField value={sourceQuery} onChangeText={setSourceQuery} placeholder="Zoek bron" />
            ) : null}

            {!loadingSources && testSources.length === 0 ? (
              <StateBlock
                tone="info"
                message="Geen bron gevonden"
                detail="Probeer het later opnieuw met nieuwe invoer."
              />
            ) : null}

            {!loadingSources && filteredSources.length > 0 ? (
              <ThemedView style={styles.sourceList}>
                {filteredSources.map((source) => (
                  <Pressable
                    key={`${source.sourceType}:${source.sourceRecordId}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Kies bron ${source.label}`}
                    onPress={() => setSelectedSourceId(source.sourceRecordId)}
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
                      <ThemedText type="caption" style={styles.sourcePreview} numberOfLines={2}>
                        {source.preview}
                      </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            ) : null}

            {!loadingSources && sourceQuery.trim().length > 0 && filteredSources.length === 0 ? (
              <MetaText>Geen resultaten voor je zoekterm.</MetaText>
            ) : null}

            {!supportsInlineTesting ? (
              <StateBlock
                tone="info"
                message="Testen volgt later"
                detail="Voor dit onderdeel is testen nog niet beschikbaar."
              />
            ) : null}
          </SurfaceSection>

          {latestTestRun ? (
            <SurfaceSection title={isEntryCleanup ? 'Testresultaat' : 'Testresultaat'}>
              <ThemedView style={styles.resultGroup}>
                <MetaText>Status: {latestTestRun.status}</MetaText>
                <MetaText>Versie: v{latestTestRun.taskVersionNumber}</MetaText>
                <MetaText>Bron: {latestTestRun.sourceLabel || selectedSource?.label || 'Onbekende bron'}</MetaText>

                {isEntryCleanup && entryCleanupTestOutput.output ? (
                  <>
                    <ThemedText type="defaultSemiBold">Titel</ThemedText>
                    <TextAreaField value={entryCleanupTestOutput.output.title} editable={false} style={styles.textAreaSmall} />

                    <ThemedText type="defaultSemiBold">Body</ThemedText>
                    <TextAreaField value={entryCleanupTestOutput.output.body} editable={false} style={styles.textAreaLarge} />

                    <ThemedText type="defaultSemiBold">Summary_short</ThemedText>
                    <TextAreaField
                      value={entryCleanupTestOutput.output.summary_short}
                      editable={false}
                      style={styles.textAreaSmall}
                    />

                    <ThemedText type="defaultSemiBold">Contractchecks</ThemedText>
                    {entryCleanupQualityHints.map((hint) => (
                      <MetaText key={hint.label}>
                        {hint.ok ? '✓' : '•'} {hint.label}
                        {hint.detail ? ` · ${hint.detail}` : ''}
                      </MetaText>
                    ))}
                  </>
                ) : (
                  <>
                    <ThemedText type="defaultSemiBold">Testresultaat</ThemedText>
                    <TextAreaField
                      value={
                        latestTestRun.outputText ??
                        (latestTestRun.outputJson
                          ? JSON.stringify(latestTestRun.outputJson, null, 2)
                          : 'Geen output')
                      }
                      editable={false}
                      style={styles.textAreaLarge}
                    />
                  </>
                )}

              </ThemedView>

              {compareView ? (
                <ThemedView style={styles.resultGroup}>
                  <ThemedText type="defaultSemiBold">Verschil met live</ThemedText>
                  <MetaText>
                    Runtime-basis status: {compareView.baselineStatus}
                    {compareView.baselineReason ? ` · ${compareView.baselineReason}` : ''}
                  </MetaText>

                  {isEntryCleanup && entryCleanupLiveOutput.output && entryCleanupCompareTestOutput.output ? (
                    <>
                      <MetaText>Titel · runtime-basis vs testresultaat</MetaText>
                      <TextAreaField
                        value={`Runtime-basis:\n${entryCleanupLiveOutput.output.title}\n\nTestresultaat:\n${entryCleanupCompareTestOutput.output.title}`}
                        editable={false}
                        style={styles.textAreaSmall}
                      />
                      <TextAreaField
                        value={buildLineDiffText(entryCleanupLiveOutput.output.title, entryCleanupCompareTestOutput.output.title)}
                        editable={false}
                        style={styles.textAreaSmall}
                      />

                      <MetaText>Body · runtime-basis vs testresultaat</MetaText>
                      <TextAreaField
                        value={`Runtime-basis:\n${entryCleanupLiveOutput.output.body}\n\nTestresultaat:\n${entryCleanupCompareTestOutput.output.body}`}
                        editable={false}
                        style={styles.textAreaLarge}
                      />
                      <TextAreaField
                        value={buildLineDiffText(entryCleanupLiveOutput.output.body, entryCleanupCompareTestOutput.output.body)}
                        editable={false}
                        style={styles.textAreaMedium}
                      />

                      <MetaText>Summary_short · runtime-basis vs testresultaat</MetaText>
                      <TextAreaField
                        value={`Runtime-basis:\n${entryCleanupLiveOutput.output.summary_short}\n\nTestresultaat:\n${entryCleanupCompareTestOutput.output.summary_short}`}
                        editable={false}
                        style={styles.textAreaSmall}
                      />
                      <TextAreaField
                        value={buildLineDiffText(
                          entryCleanupLiveOutput.output.summary_short,
                          entryCleanupCompareTestOutput.output.summary_short
                        )}
                        editable={false}
                        style={styles.textAreaSmall}
                      />
                    </>
                  ) : (
                    <>
                      <MetaText>Runtime-basis output</MetaText>
                      <TextAreaField
                        value={compareView.liveOutputText ?? 'Nog geen live output beschikbaar.'}
                        editable={false}
                        style={styles.textAreaMedium}
                      />

                      <MetaText>Test output</MetaText>
                      <TextAreaField
                        value={compareView.testOutputText ?? 'Geen test output beschikbaar.'}
                        editable={false}
                        style={styles.textAreaMedium}
                      />

                      <MetaText>Verschil met live</MetaText>
                      <TextAreaField
                        value={
                          compareView.liveOutputText && compareView.testOutputText
                            ? buildLineDiffText(compareView.liveOutputText, compareView.testOutputText)
                            : 'Geen vergelijkbare output beschikbaar.'
                        }
                        editable={false}
                        style={styles.textAreaLarge}
                      />
                    </>
                  )}
                </ThemedView>
              ) : null}
            </SurfaceSection>
          ) : (
            <SurfaceSection title="Testresultaat">
              <StateBlock
                tone="info"
                message="Nog geen testresultaat"
                detail="Voer eerst een test uit om output en verschil met live te bekijken."
              />
            </SurfaceSection>
          )}
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
  sourceRow: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
  sourcePreview: {
    color: colorTokens.dark.mutedSoft,
  },
  resultGroup: {
    gap: spacing.xs,
  },
  textAreaLarge: {
    minHeight: 180,
  },
  textAreaMedium: {
    minHeight: 140,
  },
  textAreaSmall: {
    minHeight: 90,
  },
});
