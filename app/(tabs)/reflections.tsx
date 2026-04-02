import { Tabs, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProcessingScreen } from '@/components/feedback/processing-screen';
import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  StateBlock,
} from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  fetchLatestReflection,
  generateReflection,
  parseJsonStringArray,
} from '@/services';
import type { PeriodType } from '@/services/reflections';
import { colorTokens, radius, spacing, typography } from '@/theme';

function periodTypeLabel(periodType: PeriodType): string {
  return periodType === 'week' ? 'Week' : 'Maand';
}

function periodHeading(periodType: PeriodType): string {
  return periodType === 'week' ? 'Deze week' : 'Deze maand';
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

export default function ReflectionsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
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
  const [latestWeek, setLatestWeek] = useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);
  const [latestMonth, setLatestMonth] = useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);
  const isProcessing = generating !== null;

  const loadReflections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [weekRow, monthRow] = await Promise.all([
        fetchLatestReflection('week'),
        fetchLatestReflection('month'),
      ]);

      setLatestWeek(weekRow);
      setLatestMonth(monthRow);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
      setLatestWeek(null);
      setLatestMonth(null);
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

  const activeReflection = activePeriod === 'week' ? latestWeek : latestMonth;
  const highlights = activeReflection ? parseJsonStringArray(activeReflection.highlights_json) : [];
  const reflectionPoints = activeReflection
    ? parseJsonStringArray(activeReflection.reflection_points_json)
    : [];
  const cleanHighlights = highlights.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 3);
  const cleanReflectionPoints = reflectionPoints
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 3);

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
          onPress={() => setActivePeriod('week')}
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
          onPress={() => setActivePeriod('month')}
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
        <StateBlock
          tone="loading"
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
            <>
              <ThemedView style={styles.reflectHeader}>
                <ThemedText type="screenTitle" style={styles.reflectTitle}>
                  {periodHeading(activePeriod)}
                </ThemedText>
                <MetaText>{formatPeriodRange(activeReflection.period_start, activeReflection.period_end)}</MetaText>
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
  reflectHeader: {
    gap: spacing.xs,
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
});
