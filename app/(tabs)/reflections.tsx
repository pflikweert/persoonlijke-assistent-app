import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    retryable: boolean;
    requestId: string | null;
  } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [generating, setGenerating] = useState<PeriodType | null>(null);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('week');
  const [latestWeek, setLatestWeek] = useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);
  const [latestMonth, setLatestMonth] = useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);

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
  const mergedHighlights = [...highlights, ...reflectionPoints]
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 3);

  return (
    <ScreenContainer
      scrollable
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.header}>
        <ThemedText type="screenTitle">Reflecties</ThemedText>
        <ThemedText type="bodySecondary" style={styles.headerCopy}>
          Rustige inzichten op basis van je dagjournals.
        </ThemedText>
      </ThemedView>

      <ThemedView lightColor={colorTokens.light.surfaceLow} darkColor={colorTokens.dark.surfaceLow} style={styles.periodSwitch}>
        <Pressable
          onPress={() => setActivePeriod('week')}
          style={[styles.periodButton, activePeriod === 'week' && styles.periodButtonActive]}>
          <ThemedText type="caption" style={[styles.periodButtonLabel, activePeriod === 'week' && styles.periodButtonLabelActive]}>
            Week
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setActivePeriod('month')}
          style={[styles.periodButton, activePeriod === 'month' && styles.periodButtonActive]}>
          <ThemedText
            type="caption"
            style={[styles.periodButtonLabel, activePeriod === 'month' && styles.periodButtonLabelActive]}>
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
                style={styles.summaryInset}>
                <ThemedText type="bodySecondary" style={styles.summaryInsetText}>
                  {activeReflection.summary_text}
                </ThemedText>
              </ThemedView>

              <ThemedText type="body" style={styles.narrativeText}>
                {activeReflection.summary_text}
              </ThemedText>

              {mergedHighlights.length > 0 ? (
                <ThemedView style={styles.highlightList}>
                  {mergedHighlights.map((item, index) => (
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
            disabled={generating !== null}
            label={
              generating === activePeriod
                ? 'Genereren...'
                : `Genereer ${periodTypeLabel(activePeriod).toLowerCase()}reflectie`
            }
          />
        </ThemedView>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  headerCopy: {
    color: colorTokens.light.muted,
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
    backgroundColor: colorTokens.light.surfaceLowest,
  },
  periodButtonLabel: {
    color: colorTokens.light.mutedSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  periodButtonLabelActive: {
    color: colorTokens.light.primary,
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
    borderLeftColor: `${colorTokens.light.primary}55`,
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
    color: colorTokens.light.text,
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
