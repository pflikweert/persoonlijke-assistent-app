import { Link, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ContentSection, StateNotice } from '@/components/ui/screen-primitives';
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
        <ThemedText style={styles.metaText}>Datum (UTC): {journalDate || '-'}</ThemedText>

        {loading ? (
          <StateNotice tone="loading" message="Dagdetail laden..." detail="Even geduld, we halen de dag op." />
        ) : null}
        {!loading && error ? (
          <StateNotice tone="error" message="Dagdetail kon niet geladen worden." detail={error} />
        ) : null}

        {!loading && !error && !summary && entries.length === 0 ? (
          <StateNotice
            tone="empty"
            message="Geen inhoud gevonden voor deze dag."
            detail="Leg een notitie vast om deze dag te vullen."
          />
        ) : null}

        {!loading && !error && summary ? (
          <ContentSection title="Samenvatting">
            <ThemedText>{summary}</ThemedText>
          </ContentSection>
        ) : null}

        {!loading && !error && sections.length > 0 ? (
          <ContentSection title="Kernpunten">
            {sections.map((section, index) => (
              <ThemedText key={`${section}-${index}`}>• {section}</ThemedText>
            ))}
          </ContentSection>
        ) : null}

        {!loading && !error && entries.length > 0 ? (
          <ContentSection title="Notities">
            <ThemedView style={styles.entriesList}>
              {entries.map((entry) => (
                <ThemedView key={entry.id} style={styles.entryItem}>
                  <ThemedText type="defaultSemiBold">{entry.title}</ThemedText>
                  <ThemedText>{entry.body}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ContentSection>
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
  metaText: {
    opacity: 0.7,
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
