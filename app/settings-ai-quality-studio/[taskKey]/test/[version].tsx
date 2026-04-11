import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SettingsScreenHeader } from '@/components/ui/settings-screen-primitives';
import {
  InputField,
  MetaText,
  PrimaryButton,
  ScreenContainer,
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
  getTaskConsistencyInfo,
} from '../../_shared';

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

  const supportsInlineTesting = detail?.inputType === 'entry' || detail?.inputType === 'day';
  const canRunTest =
    Boolean(supportsInlineTesting) && Boolean(selectedVersion) && Boolean(selectedSource) && !runningTest;

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
      setDetail(nextDetail);

      if (nextDetail.inputType === 'entry' || nextDetail.inputType === 'day') {
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
    if (selectedSource.sourceType !== 'entry' && selectedSource.sourceType !== 'day') {
      setError('Alleen entry/day test-bronnen worden nu ondersteund.');
      return;
    }

    setRunningTest(true);
    setError(null);

    try {
      const created = await runAdminAiQualityStudioTest({
        taskKey: detail.key,
        taskVersionId: selectedVersion.id,
        sourceType: selectedSource.sourceType,
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
    <ScreenContainer scrollable backgroundTone="flat" contentContainerStyle={styles.scrollContent}>
      <SettingsScreenHeader
        title="Testen"
        subtitle={detail?.label ?? 'AI Quality Studio'}
        onBack={() => router.back()}
        onMenu={() => setMenuVisible(true)}
      />

      {loading ? <StateBlock tone="loading" message="Testomgeving laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon testscherm niet laden." detail={error} /> : null}

      {!loading && detail && selectedVersion ? (
        <>
          <SurfaceSection title="Versiecontext">
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
          </SurfaceSection>

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
            ) : (
              <PrimaryButton
                label={runningTest ? 'Test uitvoeren…' : 'Test uitvoeren'}
                onPress={() => void handleRunTest()}
                disabled={!canRunTest || loadingSources}
              />
            )}
          </SurfaceSection>

          {latestTestRun ? (
            <SurfaceSection title="Testresultaat">
              <ThemedView style={styles.resultGroup}>
                <MetaText>Status: {latestTestRun.status}</MetaText>
                <MetaText>Versie: v{latestTestRun.taskVersionNumber}</MetaText>
                <MetaText>Bron: {latestTestRun.sourceLabel || selectedSource?.label || 'Onbekende bron'}</MetaText>

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

                <PrimaryButton
                  label={loadingCompare ? 'Verschil laden…' : 'Verschil met live'}
                  onPress={() => void handleLoadCompare()}
                  disabled={loadingCompare}
                />
              </ThemedView>

              {compareView ? (
                <ThemedView style={styles.resultGroup}>
                  <ThemedText type="defaultSemiBold">Verschil met live</ThemedText>
                  <MetaText>
                    Runtime-basis status: {compareView.baselineStatus}
                    {compareView.baselineReason ? ` · ${compareView.baselineReason}` : ''}
                  </MetaText>

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
    </ScreenContainer>
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
});
