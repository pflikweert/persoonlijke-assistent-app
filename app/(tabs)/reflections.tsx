import { Tabs, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InlineLoadingOverlay } from '@/components/feedback/inline-loading-overlay';
import { ProcessingScreen } from '@/components/feedback/processing-screen';
import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { CopyIconButton } from '@/components/ui/copy-icon-button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  MetaText,
  PrimaryButton,
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
import { buildReflectionCopyPayload } from '@/src/lib/copy-payloads';
import type { PeriodType } from '@/services/reflections';
import { colorTokens, radius, spacing, typography } from '@/theme';

type RouteParams = {
  period?: string | string[];
};

function parseRoutePeriod(value: string | string[] | undefined): PeriodType | null {
  const parsed = Array.isArray(value) ? value[0] ?? '' : value ?? '';
  return parsed === 'week' || parsed === 'month' ? parsed : null;
}

function periodTypeLabel(periodType: PeriodType): string {
  return periodType === 'week' ? 'Week' : 'Maand';
}

function periodHeading(periodType: PeriodType): string {
  return periodType === 'week' ? 'Deze week' : 'Deze maand';
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

function weekHeading(periodStart: string, periodEnd: string): string {
  const startDate = new Date(`${periodStart}T12:00:00.000Z`);
  const endDate = new Date(`${periodEnd}T12:00:00.000Z`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `Week ${periodStart} – ${periodEnd}`;
  }

  const dayStart = String(startDate.getUTCDate()).padStart(2, '0');
  const monthStart = startDate.toLocaleDateString('nl-NL', {
    month: 'short',
    timeZone: 'UTC',
  });
  const dayEnd = String(endDate.getUTCDate()).padStart(2, '0');
  const monthEnd = endDate.toLocaleDateString('nl-NL', {
    month: 'short',
    timeZone: 'UTC',
  });
  const year = endDate.getUTCFullYear();

  return `Week ${dayStart} ${monthStart} – ${dayEnd} ${monthEnd} ${year}`;
}

function shortSummary(value: string): string {
  const clean = (value ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= 110) {
    return clean;
  }
  return `${clean.slice(0, 107).trimEnd()}...`;
}

function formatPeriodRange(start: string, end: string): string {
  const startDate = new Date(`${start}T12:00:00.000Z`);
  const endDate = new Date(`${end}T12:00:00.000Z`);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `${start} – ${end}`;
  }

  const sameMonth =
    startDate.getUTCMonth() === endDate.getUTCMonth() &&
    startDate.getUTCFullYear() === endDate.getUTCFullYear();

  const startDay = String(startDate.getUTCDate()).padStart(2, '0');
  const endDay = String(endDate.getUTCDate()).padStart(2, '0');
  const startMonth = startDate
    .toLocaleDateString('nl-NL', { month: 'long', timeZone: 'UTC' })
    .toUpperCase();
  const endMonth = endDate
    .toLocaleDateString('nl-NL', { month: 'long', timeZone: 'UTC' })
    .toUpperCase();
  const endYear = endDate.getUTCFullYear();

  if (sameMonth) {
    return `${startDay} – ${endDay} ${endMonth} ${endYear}`;
  }

  return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
}

function capitalizeFirst(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getIsoWeekNumber(date: Date): number {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatWeekCopyTitle(periodStart: string, periodEnd: string): string {
  const startDate = new Date(`${periodStart}T12:00:00.000Z`);
  const endDate = new Date(`${periodEnd}T12:00:00.000Z`);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `Week · ${periodStart} – ${periodEnd}`;
  }

  const weekNumber = getIsoWeekNumber(startDate);
  const startDay = String(startDate.getUTCDate()).padStart(2, '0');
  const startMonth = startDate.toLocaleDateString('nl-NL', { month: 'long', timeZone: 'UTC' });
  const endDay = String(endDate.getUTCDate()).padStart(2, '0');
  const endMonth = endDate.toLocaleDateString('nl-NL', { month: 'long', timeZone: 'UTC' });
  const year = endDate.getUTCFullYear();

  return `Week ${weekNumber} · ${startDay} ${startMonth} – ${endDay} ${endMonth} ${year}`;
}

function formatMonthCopyTitle(periodStart: string): string {
  const date = new Date(`${periodStart}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return periodStart;
  }

  const month = date.toLocaleDateString('nl-NL', { month: 'long', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  return `${capitalizeFirst(month)} ${year}`;
}

function localDayStringNow(): string {
  return getUtcTodayDate();
}

function selectCurrentPeriodId(
  rows: Awaited<ReturnType<typeof fetchRecentReflectionsByType>>,
  day: string = localDayStringNow()
): string | null {
  const current = rows.find((row) => row.period_start <= day && row.period_end >= day);
  return current?.id ?? rows[0]?.id ?? null;
}

export default function ReflectionsScreen() {
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
        fetchRecentReflectionsByType({ periodType: 'week', limit: 20 }),
        fetchRecentReflectionsByType({ periodType: 'month', limit: 20 }),
      ]);

      setWeekReflections(weekRows);
      setMonthReflections(monthRows);
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
      setSelectedWeekId(null);
      setSelectedMonthId(null);
    } finally {
      setLoading(false);
    }
  }, []);

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
      await generateReflection({
        periodType,
        anchorDate: getUtcTodayDate(),
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
  const highlights = activeReflection ? parseJsonStringArray(activeReflection.highlights_json) : [];
  const reflectionPoints = activeReflection
    ? parseJsonStringArray(activeReflection.reflection_points_json)
    : [];
  const cleanHighlights = highlights.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 3);
  const cleanReflectionPoints = reflectionPoints
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 3);
  const reflectionCopyPayload = useMemo(() => {
    if (!activeReflection) {
      return null;
    }

    const title =
      activePeriod === 'week'
        ? formatWeekCopyTitle(activeReflection.period_start, activeReflection.period_end)
        : formatMonthCopyTitle(activeReflection.period_start);

    return buildReflectionCopyPayload({
      periodRange: title,
      summaryText: activeReflection.summary_text,
      highlights: cleanHighlights,
      reflectionPoints: cleanReflectionPoints,
    });
  }, [activePeriod, activeReflection, cleanHighlights, cleanReflectionPoints]);

  function openSelector(periodType: PeriodType) {
    setSelectorPeriod(periodType);
    setSelectorVisible(true);
  }

  function closeSelector() {
    setSelectorVisible(false);
  }

  function selectReflection(id: string) {
    if (selectorPeriod === 'week') {
      setSelectedWeekId(id);
      setActivePeriod('week');
    } else {
      setSelectedMonthId(id);
      setActivePeriod('month');
    }
    closeSelector();
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
              title="Reflecties"
              titleType="screenTitle"
              subtitle="Rustige inzichten op basis van je dagjournals."
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
          {activeRows.length > 0 ? (
            <Pressable
              onPress={() => openSelector(activePeriod)}
              accessibilityRole="button"
              style={[styles.choosePeriodButton, { backgroundColor: palette.surfaceLow }]}>
              <ThemedText type="caption" style={{ color: palette.primary }}>
                {activePeriod === 'week' ? 'Kies andere week' : 'Kies andere maand'}
              </ThemedText>
            </Pressable>
          ) : null}

          {activeReflection ? (
            <>
              <ThemedView style={styles.reflectHeaderWrap}>
                <ThemedView style={styles.reflectHeader}>
                  <ThemedText type="screenTitle" style={styles.reflectTitle}>
                    {periodHeading(activePeriod)}
                  </ThemedText>
                  <MetaText>{formatPeriodRange(activeReflection.period_start, activeReflection.period_end)}</MetaText>
                </ThemedView>
                <CopyIconButton
                  payload={reflectionCopyPayload}
                  copyLabel="Kopieer reflectie"
                  copiedLabel="Reflectie gekopieerd"
                />
              </ThemedView>

              <ThemedView
                lightColor={colorTokens.light.surfaceLowest}
                darkColor={colorTokens.dark.surfaceLow}
                style={[styles.summaryInset, { borderLeftColor: `${palette.primary}55` }]}>
                <ThemedText type="bodySecondary" style={styles.summaryInsetText}>
                  {activeReflection.summary_text}
                </ThemedText>
              </ThemedView>

              {cleanHighlights.length > 0 ? (
                <ThemedView style={styles.highlightList}>
                  <MetaText>Belangrijkste gebeurtenissen</MetaText>
                  {cleanHighlights.map((item, index) => (
                    <ThemedView
                      key={`${item}-${index}`}
                      lightColor={colorTokens.light.surfaceLow}
                      darkColor={colorTokens.dark.surfaceLow}
                      style={styles.highlightItem}>
                      <ThemedText type="bodySecondary">{item}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              ) : null}

              {cleanReflectionPoints.length > 0 ? (
                <ThemedView style={styles.highlightList}>
                  <MetaText>Reflectiepunten</MetaText>
                  {cleanReflectionPoints.map((item, index) => (
                    <ThemedView
                      key={`${item}-${index}`}
                      lightColor={colorTokens.light.surfaceLow}
                      darkColor={colorTokens.dark.surfaceLow}
                      style={styles.highlightItem}>
                      <ThemedText type="bodySecondary">{item}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              ) : null}
            </>
          ) : (
            <StateBlock
              tone="empty"
              message={`Nog geen ${periodTypeLabel(activePeriod).toLowerCase()}reflectie beschikbaar.`}
              detail="Genereer een reflectie om hier je inzichten terug te lezen."
            />
          )}
          <PrimaryButton
            onPress={() => void handleGenerate(activePeriod)}
            disabled={isProcessing}
            label={
              generating === activePeriod
                ? 'Genereren...'
                : `Genereer ${periodTypeLabel(activePeriod).toLowerCase()}reflectie`
            }
          />
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
                {selectorRows.map((row) => {
                  const isSelected = row.id === selectorSelectedId;
                  const heading =
                    selectorPeriod === 'week'
                      ? weekHeading(row.period_start, row.period_end)
                      : monthHeading(row.period_start);

                  return (
                    <Pressable
                      key={row.id}
                      onPress={() => selectReflection(row.id)}
                      style={[
                        styles.periodListItem,
                        {
                          borderColor: isSelected ? `${palette.primary}66` : `${palette.separator}88`,
                          backgroundColor: isSelected ? palette.surfaceLow : palette.surfaceLowest,
                        },
                      ]}>
                      <ThemedText type="defaultSemiBold" style={{ color: palette.text }}>
                        {heading}
                      </ThemedText>
                      <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                        {formatPeriodRange(row.period_start, row.period_end)}
                      </ThemedText>
                      <ThemedText type="bodySecondary" numberOfLines={2} style={{ color: palette.muted }}>
                        {shortSummary(row.summary_text)}
                      </ThemedText>
                    </Pressable>
                  );
                })}
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodSwitch: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    padding: 3,
    marginBottom: spacing.lg,
    gap: spacing.xxs,
  },
  periodButton: {
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  periodButtonActive: {
  },
  periodButtonLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  periodButtonLabelActive: {
  },
  readingCanvas: {
    gap: spacing.xl,
  },
  choosePeriodButton: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  periodListItem: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
  reflectHeader: {
    gap: spacing.xs,
  },
  reflectHeaderWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  reflectTitle: {
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: -1,
  },
  summaryInset: {
    borderLeftWidth: 2,
    borderTopRightRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryInsetText: {
    fontStyle: 'italic',
    lineHeight: typography.roles.bodySecondary.lineHeight + 3,
  },
  narrativeText: {
    lineHeight: 34,
    fontSize: 21,
    letterSpacing: -0.1,
  },
  highlightList: {
    gap: spacing.sm,
  },
  highlightItem: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
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
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
