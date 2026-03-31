import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchRecentDayJournals, parseJournalSections } from '@/services';
import { spacing } from '@/theme';

export default function DaysScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journals, setJournals] = useState<Awaited<ReturnType<typeof fetchRecentDayJournals>>>([]);

  const loadDays = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rows = await fetchRecentDayJournals(21);
      setJournals(rows);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon recente dagen niet laden.';
      setError(message);
      setJournals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDays();
    }, [loadDays])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Dagen</ThemedText>
      <ThemedText>Recente dagjournals, meest recente eerst.</ThemedText>

      {loading ? <ThemedText>Laden...</ThemedText> : null}
      {!loading && error ? <ThemedText>{error}</ThemedText> : null}
      {!loading && !error && journals.length === 0 ? (
        <ThemedText>Nog geen dagen beschikbaar. Leg eerst een notitie vast.</ThemedText>
      ) : null}

      {!loading && !error && journals.length > 0 ? (
        <ThemedView style={styles.list}>
          {journals.map((journal) => {
            const sections = parseJournalSections(journal.sections);
            const sectionPreview = sections.slice(0, 2).join(' • ');

            return (
              <Pressable
                key={journal.id}
                onPress={() =>
                  router.push({
                    pathname: '/day/[date]',
                    params: { date: journal.journal_date },
                  })
                }
                style={styles.item}>
                <ThemedText type="defaultSemiBold">{journal.journal_date}</ThemedText>
                <ThemedText>
                  {journal.summary?.trim() ? journal.summary : 'Nog geen samenvatting voor deze dag.'}
                </ThemedText>
                {sectionPreview ? <ThemedText>{sectionPreview}</ThemedText> : null}
              </Pressable>
            );
          })}
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
  list: {
    gap: spacing.md,
  },
  item: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
});
