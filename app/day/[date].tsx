import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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
    <ScreenContainer scrollable>
      <Stack.Screen options={{ title: journalDate || 'Dagdetail' }} />

      <ThemedText type="screenTitle">Dagdetail</ThemedText>
      <MetaText>Datum (UTC): {journalDate || '-'}</MetaText>

      {loading ? (
        <StateBlock tone="loading" message="Dagdetail laden..." detail="Even geduld, we halen de dag op." />
      ) : null}
      {!loading && error ? (
        <StateBlock tone="error" message="Dagdetail kon niet geladen worden." detail={error} />
      ) : null}

      {!loading && !error && !summary && entries.length === 0 ? (
        <StateBlock
          tone="empty"
          message="Geen inhoud gevonden voor deze dag."
          detail="Leg een notitie vast om deze dag te vullen."
        />
      ) : null}

      {!loading && !error && summary ? (
        <SurfaceSection title="Samenvatting">
          <ThemedText>{summary}</ThemedText>
        </SurfaceSection>
      ) : null}

      {!loading && !error && sections.length > 0 ? (
        <SurfaceSection title="Kernpunten">
          {sections.map((section, index) => (
            <ThemedText key={`${section}-${index}`} type="bodySecondary">
              • {section}
            </ThemedText>
          ))}
        </SurfaceSection>
      ) : null}

      {!loading && !error && entries.length > 0 ? (
        <SurfaceSection title="Notities">
          <ThemedView style={styles.entriesList}>
            {entries.map((entry) => (
              <ThemedView key={entry.id} lightColor="#F4F3F0" darkColor="#302F2B" style={styles.entryItem}>
                <ThemedText type="defaultSemiBold">{entry.title}</ThemedText>
                <ThemedText type="bodySecondary">{entry.body}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </SurfaceSection>
      ) : null}

      <PrimaryButton label="Nieuwe entry" onPress={() => router.push('/capture')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  entriesList: {
    gap: spacing.inline,
  },
  entryItem: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.inline,
  },
});
