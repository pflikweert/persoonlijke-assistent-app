import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  StateBlock,
  SurfaceSection,
} from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  fetchLatestReflection,
  fetchRecentReflections,
  generateReflection,
  parseJsonStringArray,
} from '@/services';
import type { PeriodType } from '@/services/reflections';
import { spacing } from '@/theme';

function periodTypeLabel(periodType: PeriodType): string {
  return periodType === 'week' ? 'Week' : 'Maand';
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
  const [latestWeek, setLatestWeek] = useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);
  const [latestMonth, setLatestMonth] = useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);
  const [recent, setRecent] = useState<Awaited<ReturnType<typeof fetchRecentReflections>>>([]);

  const loadReflections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [weekRow, monthRow, recentRows] = await Promise.all([
        fetchLatestReflection('week'),
        fetchLatestReflection('month'),
        fetchRecentReflections(20),
      ]);

      setLatestWeek(weekRow);
      setLatestMonth(monthRow);
      setRecent(recentRows);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
      setLatestWeek(null);
      setLatestMonth(null);
      setRecent([]);
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

  const latestIds = new Set([latestWeek?.id, latestMonth?.id].filter(Boolean));
  const earlierReflections = recent.filter((row) => !latestIds.has(row.id));

  return (
    <ScreenContainer
      scrollable
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.header}>
        <ThemedText type="screenTitle">Reflecties</ThemedText>
        <ThemedText type="bodySecondary">Week- en maandreflecties op basis van je dagjournals.</ThemedText>
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
        <SurfaceSection title="Laatste weekreflectie">
          {latestWeek ? (
            <ThemedView style={styles.cardBody}>
              <MetaText>
                Periode: {latestWeek.period_start} t/m {latestWeek.period_end}
              </MetaText>
              <ThemedText>{latestWeek.summary_text}</ThemedText>
            </ThemedView>
          ) : (
            <ThemedText type="bodySecondary">Nog geen weekreflectie beschikbaar.</ThemedText>
          )}
          <PrimaryButton
            onPress={() => void handleGenerate('week')}
            disabled={generating !== null}
            label={generating === 'week' ? 'Genereren...' : 'Genereer weekreflectie'}
          />
        </SurfaceSection>
      ) : null}

      {!loading ? (
        <SurfaceSection title="Laatste maandreflectie">
          {latestMonth ? (
            <ThemedView style={styles.cardBody}>
              <MetaText>
                Periode: {latestMonth.period_start} t/m {latestMonth.period_end}
              </MetaText>
              <ThemedText>{latestMonth.summary_text}</ThemedText>
            </ThemedView>
          ) : (
            <ThemedText type="bodySecondary">Nog geen maandreflectie beschikbaar.</ThemedText>
          )}
          <PrimaryButton
            onPress={() => void handleGenerate('month')}
            disabled={generating !== null}
            label={generating === 'month' ? 'Genereren...' : 'Genereer maandreflectie'}
          />
        </SurfaceSection>
      ) : null}

      {!loading ? (
        <SurfaceSection title="Eerdere reflecties">
          {earlierReflections.length === 0 ? (
            <ThemedText type="bodySecondary">Geen eerdere reflecties beschikbaar.</ThemedText>
          ) : (
            <ThemedView style={styles.list}>
              {earlierReflections.map((row) => {
                const highlights = parseJsonStringArray(row.highlights_json);
                const points = parseJsonStringArray(row.reflection_points_json);
                return (
                  <ThemedView key={row.id} lightColor="#F4F3F0" darkColor="#302F2B" style={styles.card}>
                    <ThemedText type="defaultSemiBold">
                      {periodTypeLabel(row.period_type)}: {row.period_start} t/m {row.period_end}
                    </ThemedText>
                    <ThemedText type="bodySecondary">{row.summary_text}</ThemedText>
                    {highlights.length > 0 ? (
                      <MetaText>Highlights: {highlights.slice(0, 2).join(' | ')}</MetaText>
                    ) : null}
                    {points.length > 0 ? (
                      <MetaText>Reflectiepunten: {points.slice(0, 2).join(' | ')}</MetaText>
                    ) : null}
                  </ThemedView>
                );
              })}
            </ThemedView>
          )}
        </SurfaceSection>
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
  },
  list: {
    gap: spacing.inline,
  },
  cardBody: {
    gap: spacing.inline,
  },
  card: {
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.inline,
  },
});
