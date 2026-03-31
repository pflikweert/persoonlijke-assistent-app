import { Link, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  fetchDayJournalByDate,
  fetchNormalizedEntriesByDate,
  isValidJournalDate,
  parseJournalSections,
} from '@/services';
import { spacing } from '@/theme';

type RouteParams = {
  date?: string | string[];
};

function resolveRouteDate(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<RouteParams>();
  const journalDate = useMemo(() => resolveRouteDate(date), [date]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const [entries, setEntries] = useState<Awaited<ReturnType<typeof fetchNormalizedEntriesByDate>>>([]);

  const loadDay = useCallback(async () => {
    if (!isValidJournalDate(journalDate)) {
      setLoading(false);
      setError('Ongeldige datum in route.');
      setSummary(null);
      setSections([]);
      setEntries([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [journal, normalizedEntries] = await Promise.all([
        fetchDayJournalByDate(journalDate),
        fetchNormalizedEntriesByDate(journalDate),
      ]);

      setSummary(journal?.summary?.trim() ? journal.summary : null);
      setSections(journal ? parseJournalSections(journal.sections) : []);
      setEntries(normalizedEntries);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon dagdetail niet laden.';
      setError(message);
      setSummary(null);
      setSections([]);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [journalDate]);

  useFocusEffect(
    useCallback(() => {
      loadDay();
    }, [loadDay])
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: journalDate || 'Dagdetail' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Dagdetail</ThemedText>
        <ThemedText type="defaultSemiBold">Datum (UTC): {journalDate || '-'}</ThemedText>

        {loading ? <ThemedText>Laden...</ThemedText> : null}
        {!loading && error ? <ThemedText>{error}</ThemedText> : null}

        {!loading && !error && !summary && entries.length === 0 ? (
          <ThemedText>Geen data voor deze dag gevonden.</ThemedText>
        ) : null}

        {!loading && !error && summary ? (
          <ThemedView style={styles.block}>
            <ThemedText type="defaultSemiBold">Samenvatting</ThemedText>
            <ThemedText>{summary}</ThemedText>
          </ThemedView>
        ) : null}

        {!loading && !error && sections.length > 0 ? (
          <ThemedView style={styles.block}>
            <ThemedText type="defaultSemiBold">Secties</ThemedText>
            {sections.map((section, index) => (
              <ThemedText key={`${section}-${index}`}>• {section}</ThemedText>
            ))}
          </ThemedView>
        ) : null}

        {!loading && !error && entries.length > 0 ? (
          <ThemedView style={styles.block}>
            <ThemedText type="defaultSemiBold">Entries</ThemedText>
            <ThemedView style={styles.entriesList}>
              {entries.map((entry) => (
                <ThemedView key={entry.id} style={styles.entryItem}>
                  <ThemedText type="defaultSemiBold">{entry.title}</ThemedText>
                  <ThemedText>{entry.body}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        ) : null}

        <Link href="/capture" asChild>
          <Pressable style={styles.captureButton}>
            <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
              Naar vastleggen
            </ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  block: {
    gap: spacing.sm,
  },
  entriesList: {
    gap: spacing.md,
  },
  entryItem: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  captureButton: {
    marginTop: spacing.sm,
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
