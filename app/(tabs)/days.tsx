import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ContentSection, StateNotice } from '@/components/ui/screen-primitives';
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

      {loading ? (
        <StateNotice tone="loading" message="Dagen laden..." detail="We halen je recente dagen op." />
      ) : null}
      {!loading && error ? (
        <StateNotice
          tone="error"
          message="Recente dagen konden niet geladen worden."
          detail={error}
        />
      ) : null}
      {!loading && !error && journals.length === 0 ? (
        <StateNotice
          tone="empty"
          message="Nog geen dagen beschikbaar."
          detail="Leg eerst een notitie vast, dan verschijnt je eerste dag hier."
        />
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
                <ContentSection title={journal.journal_date}>
                  <ThemedText>
                    {journal.summary?.trim()
                      ? journal.summary
                      : 'Nog geen samenvatting voor deze dag.'}
                  </ThemedText>
                  {sectionPreview ? <ThemedText style={styles.previewText}>{sectionPreview}</ThemedText> : null}
                </ContentSection>
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
    gap: spacing.xs,
  },
  previewText: {
    opacity: 0.75,
  },
});
