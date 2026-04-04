import { Tabs, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InlineLoadingOverlay } from '@/components/feedback/inline-loading-overlay';
import { ProcessingScreen } from '@/components/feedback/processing-screen';
import { ArchiveGroupedList, type ArchiveGroupedListSection } from '@/components/journal/archive-grouped-list';
import { DayEditorialPanel } from '@/components/journal/day-editorial-panel';
import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { EditorialNarrativeBlock } from '@/components/journal/editorial-narrative-block';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  MetaText,
  SecondaryButton,
  ScreenContainer,
  StateBlock,
} from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  fetchRecentReflectionsByType,
  generateReflection,
  getUtcTodayDate,
  parseJsonStringArray,
} from '@/services';
import type { PeriodType } from '@/services/reflections';
import { colorTokens, radius, spacing } from '@/theme';

type RouteParams = {
  period?: string | string[];
};

const FORBIDDEN_REFLECTION_PHRASES = ['dit thema kwam meerdere keren terug'];
const FORBIDDEN_REFLECTION_PREFIX =
  /^(inzicht|ochtend|middag|avond|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\s*:?\b/i;

function parseRoutePeriod(value: string | string[] | undefined): PeriodType | null {
  const parsed = Array.isArray(value) ? value[0] ?? '' : value ?? '';
  return parsed === 'week' || parsed === 'month' ? parsed : null;
}

function periodTypeLabel(periodType: PeriodType): string {
  return periodType === 'week' ? 'Week' : 'Maand';
}

function monthHeading(periodStart: string): string {
  const date = new Date(`${periodStart}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return periodStart;
  }

  const month = date.toLocaleDateString('nl-NL', {
    month: 'long',
    timeZone: 'UTC',
  });
  const year = date.getUTCFullYear();
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`;
}

function weekHeading(periodStart: string): string {
  const startDate = new Date(`${periodStart}T12:00:00.000Z`);
  if (Number.isNaN(startDate.getTime())) {
    return `Week ${periodStart}`;
  }
  const weekNumber = getIsoWeekNumber(startDate);
  const year = startDate.getUTCFullYear();
  return `Week ${weekNumber} · ${year}`;
}

function formatDateLabel(dateValue: string): string {
  const date = new Date(`${dateValue}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const day = String(date.getUTCDate());
  const month = date.toLocaleDateString('nl-NL', {
    month: 'long',
    timeZone: 'UTC',
  });
  return `${day} ${month}`;
}

function formatNarrativeTitle(periodStart: string, periodEnd: string): string {
  return `${formatDateLabel(periodStart)} – ${formatDateLabel(periodEnd)}`;
}

function shortSummary(value: string): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function splitHighlightText(value: string): { title: string; detail: string | null } {
  const cleaned = value.replace(/\s+/g, ' ').trim();
  if (cleaned.length === 0) {
    return { title: '', detail: null };
  }

  const sentenceMatch = cleaned.match(/^(.+?[.!?])\s+(.+)$/);
  if (sentenceMatch) {
    return {
      title: sentenceMatch[1].trim(),
      detail: sentenceMatch[2].trim(),
    };
  }

  const colonIndex = cleaned.indexOf(':');
  if (colonIndex > 8 && colonIndex < cleaned.length - 8) {
    return {
      title: cleaned.slice(0, colonIndex).trim(),
      detail: cleaned.slice(colonIndex + 1).trim(),
    };
  }

  return { title: cleaned, detail: null };
}

function normalizeForReflection(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function looksTruncatedReflectionLine(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (/[.!?]$/.test(trimmed)) {
    return false;
  }
  if (/[,;:]$/.test(trimmed)) {
    return true;
  }
  const tail = normalizeForReflection(trimmed.slice(-36));
  return [' en', ' maar', ' omdat', ' terwijl', ' toen', ' dat', ' die', ' dus', ' waardoor', ' waarna', ' zodat']
    .some((suffix) => tail.endsWith(suffix));
}

function hasForbiddenReflectionPhrase(value: string): boolean {
  const normalized = normalizeForReflection(value);
  return FORBIDDEN_REFLECTION_PHRASES.some((phrase) => normalized.includes(phrase));
}

function hasForbiddenReflectionPrefix(value: string): boolean {
  return FORBIDDEN_REFLECTION_PREFIX.test(value.trim());
}

function isDegradedReflectionRow(input: {
  summary: string;
  narrative: string;
  highlights: string[];
  reflectionPoints: string[];
}): boolean {
  if (!input.summary.trim() || !input.narrative.trim()) {
    return true;
  }
  if (input.highlights.length === 0 || input.reflectionPoints.length === 0) {
    return true;
  }

  const lines = [...input.highlights, ...input.reflectionPoints];
  return lines.some(
    (line) =>
      hasForbiddenReflectionPhrase(line) ||
      hasForbiddenReflectionPrefix(line) ||
      looksTruncatedReflectionLine(line)
  );
}

function getIsoWeekNumber(date: Date): number {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function localDayStringNow(): string {
  return getUtcTodayDate();
}

function selectorYearLabel(periodStart: string): string {
  const date = new Date(`${periodStart}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return periodStart.slice(0, 4);
  }
  return String(date.getUTCFullYear());
}

function monthLeftLabel(periodStart: string): { top: string; bottom: string } {
  const date = new Date(`${periodStart}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return { top: '--', bottom: '--' };
  }
  const top = date.toLocaleDateString('nl-NL', {
    month: 'short',
    timeZone: 'UTC',
  });
  const bottom = String(date.getUTCMonth() + 1).padStart(2, '0');
  return { top, bottom };
}

function selectCurrentPeriodId(
  rows: Awaited<ReturnType<typeof fetchRecentReflectionsByType>>,
  day: string = localDayStringNow()
): string | null {
  const current = rows.find((row) => row.period_start <= day && row.period_end >= day);
  return current?.id ?? rows[0]?.id ?? null;
}

export default function ReflectionsScreen() {
  const PAGE_SIZE = 20;
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { period } = useLocalSearchParams<RouteParams>();
  const requestedPeriod = useMemo(() => parseRoutePeriod(period), [period]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    retryable: boolean;
    requestId: string | null;
  } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [generating, setGenerating] = useState<PeriodType | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('week');
  const [weekReflections, setWeekReflections] = useState<Awaited<ReturnType<typeof fetchRecentReflectionsByType>>>([]);
  const [monthReflections, setMonthReflections] = useState<Awaited<ReturnType<typeof fetchRecentReflectionsByType>>>([]);
  const [weekHasMore, setWeekHasMore] = useState(false);
  const [monthHasMore, setMonthHasMore] = useState(false);
  const [loadingMorePeriod, setLoadingMorePeriod] = useState<PeriodType | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [selectedMonthId, setSelectedMonthId] = useState<string | null>(null);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectorPeriod, setSelectorPeriod] = useState<PeriodType>('week');
  const isProcessing = generating !== null;

  useEffect(() => {
    if (!requestedPeriod) {
      return;
    }
    setActivePeriod(requestedPeriod);
  }, [requestedPeriod]);

  const loadReflections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [weekRows, monthRows] = await Promise.all([
        fetchRecentReflectionsByType({ periodType: 'week', limit: PAGE_SIZE, offset: 0 }),
        fetchRecentReflectionsByType({ periodType: 'month', limit: PAGE_SIZE, offset: 0 }),
      ]);

      setWeekReflections(weekRows);
      setMonthReflections(monthRows);
      setWeekHasMore(weekRows.length === PAGE_SIZE);
      setMonthHasMore(monthRows.length === PAGE_SIZE);
      setSelectedWeekId((current) =>
        current && weekRows.some((row) => row.id === current)
          ? current
          : selectCurrentPeriodId(weekRows)
      );
      setSelectedMonthId((current) =>
        current && monthRows.some((row) => row.id === current)
          ? current
          : selectCurrentPeriodId(monthRows)
      );
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
      setWeekReflections([]);
      setMonthReflections([]);
      setWeekHasMore(false);
      setMonthHasMore(false);
      setSelectedWeekId(null);
      setSelectedMonthId(null);
    } finally {
      setLoading(false);
    }
  }, [PAGE_SIZE]);

  useFocusEffect(
    useCallback(() => {
      loadReflections();
    }, [loadReflections])
  );

  async function handleGenerate(periodType: PeriodType) {
    if (isProcessing) {
      return;
    }

    setMenuVisible(false);
    setError(null);
    setStatus(null);
    setGenerating(periodType);

    try {
      const anchorDate = activeReflection?.period_end ?? getUtcTodayDate();
      await generateReflection({
        periodType,
        anchorDate,
        forceRegenerate: true,
      });
      setStatus(`${periodTypeLabel(periodType)}reflectie gegenereerd.`);
      await loadReflections();
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setGenerating(null);
    }
  }

  const activeRows = activePeriod === 'week' ? weekReflections : monthReflections;
  const selectedId = activePeriod === 'week' ? selectedWeekId : selectedMonthId;
  const activeReflection = useMemo(
    () => activeRows.find((row) => row.id === selectedId) ?? activeRows[0] ?? null,
    [activeRows, selectedId]
  );
  const selectorRows = selectorPeriod === 'week' ? weekReflections : monthReflections;
  const selectorSelectedId = selectorPeriod === 'week' ? selectedWeekId : selectedMonthId;
  const selectorHasMore = selectorPeriod === 'week' ? weekHasMore : monthHasMore;
  const highlights = activeReflection ? parseJsonStringArray(activeReflection.highlights_json) : [];
  const reflectionPoints = activeReflection
    ? parseJsonStringArray(activeReflection.reflection_points_json)
    : [];
  const cleanHighlights = highlights.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 3);
  const cleanReflectionPoints = reflectionPoints
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 3);
  const degradedReflection = activeReflection
    ? isDegradedReflectionRow({
        summary: activeReflection.summary_text ?? '',
        narrative: activeReflection.narrative_text ?? '',
        highlights: cleanHighlights,
        reflectionPoints: cleanReflectionPoints,
      })
    : false;
  const headerTitle = useMemo(() => {
    if (!activeReflection) {
      return activePeriod === 'week' ? 'Week' : 'Maand';
    }
    return activePeriod === 'week'
      ? weekHeading(activeReflection.period_start)
      : monthHeading(activeReflection.period_start);
  }, [activePeriod, activeReflection]);

  const headerActionLabel = activePeriod === 'week' ? 'Kies week' : 'Kies maand';
  const bottomGenerateLabel =
    activeReflection !== null
      ? activePeriod === 'week'
        ? 'Hergenereer weekreflectie'
        : 'Hergenereer maandreflectie'
      : activePeriod === 'week'
        ? 'Genereer weekreflectie'
        : 'Genereer maandreflectie';
  const narrativeTitle = activeReflection
    ? formatNarrativeTitle(activeReflection.period_start, activeReflection.period_end)
    : null;

  const selectorSections = useMemo<ArchiveGroupedListSection[]>(() => {
    const grouped = new Map<string, ArchiveGroupedListSection>();
    for (const row of selectorRows) {
      const yearKey = selectorYearLabel(row.period_start);
      const existing = grouped.get(yearKey);
      const summary = shortSummary(row.summary_text ?? '');
      const monthLabels = monthLeftLabel(row.period_start);
      const weekDate = new Date(`${row.period_start}T12:00:00.000Z`);
      const weekNumber = Number.isNaN(weekDate.getTime()) ? '--' : String(getIsoWeekNumber(weekDate));
      const item = {
        key: row.id,
        leftTop: selectorPeriod === 'week' ? 'week' : monthLabels.top,
        leftBottom: selectorPeriod === 'week' ? weekNumber : monthLabels.bottom,
        snippet: summary.length > 0 ? summary : 'Nog geen samenvatting beschikbaar.',
        selected: row.id === selectorSelectedId,
        onPress: () => {
          if (selectorPeriod === 'week') {
            setSelectedWeekId(row.id);
            setActivePeriod('week');
          } else {
            setSelectedMonthId(row.id);
            setActivePeriod('month');
          }
          closeSelector();
        },
      };
      if (existing) {
        existing.items.push(item);
      } else {
        grouped.set(yearKey, {
          key: yearKey,
          title: yearKey,
          items: [item],
        });
      }
    }
    return Array.from(grouped.values());
  }, [selectorRows, selectorPeriod, selectorSelectedId]);

  const loadMoreSelector = useCallback(async () => {
    if (loading || loadingMorePeriod || !selectorHasMore) {
      return;
    }
    setLoadingMorePeriod(selectorPeriod);
    setError(null);
    try {
      const currentRows = selectorPeriod === 'week' ? weekReflections : monthReflections;
      const nextRows = await fetchRecentReflectionsByType({
        periodType: selectorPeriod,
        limit: PAGE_SIZE,
        offset: currentRows.length,
      });
      const existing = new Set(currentRows.map((row) => row.id));
      const merged = [...currentRows, ...nextRows.filter((row) => !existing.has(row.id))];
      if (selectorPeriod === 'week') {
        setWeekReflections(merged);
        setWeekHasMore(nextRows.length === PAGE_SIZE);
      } else {
        setMonthReflections(merged);
        setMonthHasMore(nextRows.length === PAGE_SIZE);
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setLoadingMorePeriod(null);
    }
  }, [
    PAGE_SIZE,
    loading,
    loadingMorePeriod,
    selectorHasMore,
    selectorPeriod,
    weekReflections,
    monthReflections,
  ]);

  function openSelector(periodType: PeriodType) {
    setSelectorPeriod(periodType);
    setSelectorVisible(true);
  }

  function closeSelector() {
    setSelectorVisible(false);
  }

  return (
    <>
      <Tabs.Screen
        options={{
          tabBarStyle: isProcessing ? { display: 'none' } : undefined,
        }}
      />
      <ScreenContainer
        scrollable
        fixedHeader={
          isProcessing ? null : (
            <ScreenHeader
              title={headerTitle}
              titleType="screenTitle"
              titleAlign="center"
              leftAction={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={headerActionLabel}
                  onPress={() => openSelector(activePeriod)}
                  style={[styles.headerIconButton, { backgroundColor: palette.surfaceLow }]}>
                  <MaterialIcons name="calendar-month" size={20} color={palette.primary} />
                </Pressable>
              }
              rightAction={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open menu"
                  onPress={() => setMenuVisible(true)}
                  style={[styles.menuButton, { backgroundColor: palette.surfaceLow }]}>
                  <MaterialIcons name="menu" size={20} color={palette.primary} />
                </Pressable>
              }
            />
          )
        }
        contentContainerStyle={styles.scrollContent}>
      {!isProcessing ? (
        <>
      <ThemedView lightColor={colorTokens.light.surfaceLow} darkColor={colorTokens.dark.surfaceLow} style={styles.periodSwitch}>
        <Pressable
          onPress={() => {
            setActivePeriod('week');
            if (!selectedWeekId) {
              setSelectedWeekId(selectCurrentPeriodId(weekReflections));
            }
          }}
          style={[
            styles.periodButton,
            activePeriod === 'week' && [styles.periodButtonActive, { backgroundColor: palette.surfaceLowest }],
          ]}>
          <ThemedText
            type="caption"
            style={[
              styles.periodButtonLabel,
              { color: palette.mutedSoft },
              activePeriod === 'week' && [styles.periodButtonLabelActive, { color: palette.primary }],
            ]}>
            Week
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => {
            setActivePeriod('month');
            if (!selectedMonthId) {
              setSelectedMonthId(selectCurrentPeriodId(monthReflections));
            }
          }}
          style={[
            styles.periodButton,
            activePeriod === 'month' && [styles.periodButtonActive, { backgroundColor: palette.surfaceLowest }],
          ]}>
          <ThemedText
            type="caption"
            style={[
              styles.periodButtonLabel,
              { color: palette.mutedSoft },
              activePeriod === 'month' && [styles.periodButtonLabelActive, { color: palette.primary }],
            ]}>
            Maand
          </ThemedText>
        </Pressable>
      </ThemedView>

      {loading ? (
        <InlineLoadingOverlay
          message="Reflecties laden..."
          detail="We halen je laatste week- en maandreflecties op."
        />
      ) : null}
      {!loading && error ? (
        <StateBlock
          tone="error"
          message={error.message}
          detail={
            error.retryable
              ? 'Tijdelijke fout. Probeer het zo opnieuw.'
              : 'Controleer je invoer of login en probeer daarna opnieuw.'
          }
          meta={error.requestId ? `Referentie: ${error.requestId}` : null}
        />
      ) : null}
      {status ? <StateBlock tone="success" message={status} /> : null}

      {!loading ? (
        <ThemedView style={styles.readingCanvas}>
          {activeReflection ? (
            degradedReflection ? (
              <StateBlock
                tone="error"
                message="Deze reflectie is niet betrouwbaar opgebouwd."
                detail="Genereer opnieuw om een volledige week- of maandreflectie te tonen."
              />
            ) : (
            <>
              <DayEditorialPanel text={activeReflection.summary_text} />

              {activeReflection.narrative_text?.trim() ? (
                <EditorialNarrativeBlock
                  title={narrativeTitle ?? undefined}
                  text={activeReflection.narrative_text}
                />
              ) : null}

              {cleanHighlights.length > 0 ? (
                <ThemedView style={styles.highlightList}>
                  <ThemedView style={styles.sectionTitleRow}>
                    <MaterialIcons name="auto-awesome" size={16} color={palette.primary} />
                    <ThemedText type="meta" style={{ color: palette.primary }}>
                      Belangrijkste gebeurtenissen
                    </ThemedText>
                  </ThemedView>
                  {cleanHighlights.map((item, index) => {
                    const split = splitHighlightText(item);
                    return (
                    <ThemedView key={`${item}-${index}`} style={styles.highlightEditorialRow}>
                      <ThemedView style={styles.highlightIndexCol}>
                        <ThemedText type="screenTitle" style={[styles.highlightIndex, { color: `${palette.primary}CC` }]}>
                          {String(index + 1).padStart(2, '0')}
                        </ThemedText>
                      </ThemedView>
                      <ThemedView style={styles.highlightTrackCol}>
                        <ThemedView
                          style={[
                            styles.highlightTrackDot,
                            { borderColor: `${palette.primary}CC`, backgroundColor: `${palette.primary}1F` },
                          ]}
                        />
                        {index < cleanHighlights.length - 1 ? (
                          <ThemedView style={[styles.highlightTrackLine, { backgroundColor: `${palette.separator}88` }]} />
                        ) : null}
                      </ThemedView>
                      <ThemedView style={styles.highlightEditorialContent}>
                        <ThemedText
                          type="bodySecondary"
                          style={[styles.highlightTitle, { color: palette.text }]}>
                          {split.title}
                        </ThemedText>
                        {split.detail ? (
                          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                            {split.detail}
                          </ThemedText>
                        ) : null}
                      </ThemedView>
                    </ThemedView>
                    );
                  })}
                </ThemedView>
              ) : null}

              {cleanReflectionPoints.length > 0 ? (
                <ThemedView style={styles.highlightList}>
                  <ThemedView style={styles.sectionTitleRow}>
                    <MaterialIcons name="auto-awesome" size={16} color={palette.primary} />
                    <ThemedText type="meta" style={{ color: palette.primary }}>
                      Reflectiepunten
                    </ThemedText>
                  </ThemedView>
                  <ThemedView
                    style={styles.reflectionPointsCard}>
                    {cleanReflectionPoints.map((item, index) => (
                      <ThemedView key={`${item}-${index}`} style={styles.reflectionPointItem}>
                        <ThemedText
                          type="body"
                          style={[styles.reflectionPointText, { color: palette.text }]}>
                          {item}
                        </ThemedText>
                        <ThemedView
                          style={[
                            styles.reflectionPointAccent,
                            { backgroundColor: `${palette.primary}99` },
                          ]}
                        />
                        {index < cleanReflectionPoints.length - 1 ? <ThemedView style={styles.reflectionPointGap} /> : null}
                      </ThemedView>
                    ))}
                  </ThemedView>
                </ThemedView>
              ) : null}
            </>
            )
          ) : (
            <StateBlock
              tone="empty"
              message={`Nog geen ${periodTypeLabel(activePeriod).toLowerCase()}reflectie beschikbaar.`}
              detail="Genereer een reflectie om hier je inzichten terug te lezen."
            />
          )}

          <ThemedView style={styles.bottomActionWrap}>
            <SecondaryButton
              label={isProcessing ? 'Hergenereert...' : bottomGenerateLabel}
              onPress={() => void handleGenerate(activePeriod)}
              disabled={isProcessing}
            />
          </ThemedView>
        </ThemedView>
      ) : null}
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible && !isProcessing}
        currentRouteKey="reflections"
        onRequestClose={() => setMenuVisible(false)}
      />
      <Modal visible={selectorVisible && !isProcessing} animationType="slide" onRequestClose={closeSelector}>
        <ThemedView style={styles.selectorScreen}>
          <ThemedView style={styles.selectorHeader}>
            <Pressable onPress={closeSelector} accessibilityRole="button" style={styles.selectorTopAction}>
              <ThemedText type="bodySecondary">Sluiten</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => {
                setActivePeriod(selectorPeriod);
                closeSelector();
              }}
              accessibilityRole="button"
              style={styles.selectorTopAction}>
              <ThemedText type="bodySecondary">
                {selectorPeriod === 'week' ? 'Toon week' : 'Toon maand'}
              </ThemedText>
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.selectorBody}>
            <ThemedText type="screenTitle" style={styles.selectorTitle}>
              {selectorPeriod === 'week' ? 'Kies een week' : 'Kies een maand'}
            </ThemedText>
            <MetaText>
              {selectorPeriod === 'week'
                ? 'Overzicht van je recente weekreflecties.'
                : 'Overzicht van je recente maandreflecties.'}
            </MetaText>

            {selectorRows.length === 0 ? (
              <StateBlock
                tone="empty"
                message={`Nog geen ${periodTypeLabel(selectorPeriod).toLowerCase()}reflecties.`}
                detail="Genereer eerst een reflectie om hier te kunnen kiezen."
              />
            ) : (
              <ScrollView contentContainerStyle={styles.selectorList} showsVerticalScrollIndicator={false}>
                <ArchiveGroupedList
                  sections={selectorSections}
                  styleVariant="compact"
                  hasMore={selectorHasMore}
                  loadingMore={loadingMorePeriod === selectorPeriod}
                  loadMoreLabel={selectorPeriod === 'week' ? 'Meer weken laden' : 'Meer maanden laden'}
                  onLoadMore={() => void loadMoreSelector()}
                />
              </ScrollView>
            )}
          </ThemedView>
        </ThemedView>
      </Modal>
      </ScreenContainer>
      <ProcessingScreen visible={isProcessing} variant="reflection-generate" />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  periodSwitch: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    padding: 3,
    gap: spacing.xxs,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  periodButton: {
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  periodButtonActive: {},
  periodButtonLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  periodButtonLabelActive: {},
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingCanvas: {
    gap: spacing.xl,
  },
  highlightList: {
    gap: spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  highlightEditorialRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md,
  },
  highlightIndexCol: {
    width: 52,
    alignItems: 'flex-start',
  },
  highlightIndex: {
    fontSize: 42,
    lineHeight: 42,
    fontWeight: '300',
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  highlightTrackCol: {
    width: 12,
    alignItems: 'center',
    paddingTop: 7,
  },
  highlightTrackDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  highlightTrackLine: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: spacing.xs,
  },
  highlightEditorialContent: {
    flex: 1,
    gap: spacing.xxs,
    paddingBottom: spacing.md,
  },
  highlightTitle: {
    fontWeight: '400',
    lineHeight: 24,
  },
  reflectionPointsCard: {
    backgroundColor: 'transparent',
    gap: spacing.lg,
  },
  reflectionPointItem: {
    gap: spacing.md,
    backgroundColor: 'transparent',
  },
  reflectionPointAccent: {
    width: 36,
    height: 2,
    borderRadius: radius.pill,
  },
  reflectionPointGap: {
    height: spacing.sm,
  },
  reflectionPointText: {
    fontStyle: 'italic',
    fontSize: 20,
    lineHeight: 34,
    letterSpacing: -0.2,
    fontWeight: '400',
  },
  selectorScreen: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorTopAction: {
    paddingVertical: spacing.xs,
  },
  selectorBody: {
    flex: 1,
    gap: spacing.md,
  },
  selectorTitle: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  selectorList: {
    paddingBottom: spacing.xl,
  },
  bottomActionWrap: {
    marginTop: spacing.xs,
  },
});
