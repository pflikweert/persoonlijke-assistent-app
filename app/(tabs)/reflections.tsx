import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
    <ThemedView style={styles.container}>
      <ThemedText type="title">Reflecties</ThemedText>
      <ThemedText>Genereer en bekijk je week- en maandreflecties op basis van dagjournals.</ThemedText>

      {loading ? <ThemedText>Laden...</ThemedText> : null}
      {!loading && error ? (
        <ThemedView style={styles.feedbackBlock}>
          <ThemedText>{error.message}</ThemedText>
          <ThemedText>
            {error.retryable
              ? 'Tijdelijke fout. Probeer opnieuw.'
              : 'Niet-retryable fout. Controleer input of login en probeer daarna opnieuw.'}
          </ThemedText>
          {error.requestId ? <ThemedText>Request-ID: {error.requestId}</ThemedText> : null}
        </ThemedView>
      ) : null}
      {status ? <ThemedText>{status}</ThemedText> : null}

      {!loading ? (
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Laatste weekreflectie</ThemedText>
          {latestWeek ? (
            <ThemedView style={styles.card}>
              <ThemedText>
                Periode: {latestWeek.period_start} t/m {latestWeek.period_end}
              </ThemedText>
              <ThemedText>{latestWeek.summary_text}</ThemedText>
            </ThemedView>
          ) : (
            <ThemedText>Nog geen weekreflectie beschikbaar.</ThemedText>
          )}
          <Pressable
            onPress={() => void handleGenerate('week')}
            disabled={generating !== null}
            style={[styles.button, generating !== null && styles.buttonDisabled]}>
            <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
              {generating === 'week' ? 'Genereren...' : 'Genereer weekreflectie'}
            </ThemedText>
          </Pressable>
        </ThemedView>
      ) : null}

      {!loading ? (
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Laatste maandreflectie</ThemedText>
          {latestMonth ? (
            <ThemedView style={styles.card}>
              <ThemedText>
                Periode: {latestMonth.period_start} t/m {latestMonth.period_end}
              </ThemedText>
              <ThemedText>{latestMonth.summary_text}</ThemedText>
            </ThemedView>
          ) : (
            <ThemedText>Nog geen maandreflectie beschikbaar.</ThemedText>
          )}
          <Pressable
            onPress={() => void handleGenerate('month')}
            disabled={generating !== null}
            style={[styles.button, generating !== null && styles.buttonDisabled]}>
            <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
              {generating === 'month' ? 'Genereren...' : 'Genereer maandreflectie'}
            </ThemedText>
          </Pressable>
        </ThemedView>
      ) : null}

      {!loading ? (
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold">Eerdere reflecties</ThemedText>
          {earlierReflections.length === 0 ? (
            <ThemedText>Geen eerdere reflecties beschikbaar.</ThemedText>
          ) : (
            <ThemedView style={styles.list}>
              {earlierReflections.map((row) => {
                const highlights = parseJsonStringArray(row.highlights_json);
                const points = parseJsonStringArray(row.reflection_points_json);
                return (
                  <ThemedView key={row.id} style={styles.card}>
                    <ThemedText type="defaultSemiBold">
                      {periodTypeLabel(row.period_type)}: {row.period_start} t/m {row.period_end}
                    </ThemedText>
                    <ThemedText>{row.summary_text}</ThemedText>
                    {highlights.length > 0 ? (
                      <ThemedText>Highlights: {highlights.slice(0, 2).join(' | ')}</ThemedText>
                    ) : null}
                    {points.length > 0 ? (
                      <ThemedText>Reflectiepunten: {points.slice(0, 2).join(' | ')}</ThemedText>
                    ) : null}
                  </ThemedView>
                );
              })}
            </ThemedView>
          )}
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  button: {
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  feedbackBlock: {
    gap: spacing.xs,
  },
});
