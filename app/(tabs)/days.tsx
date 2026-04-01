import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  MetaText,
  ScreenContainer,
  StateBlock,
  SurfaceSection,
} from '@/components/ui/screen-primitives';
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
    <ScreenContainer>
      <ThemedView style={styles.header}>
        <ThemedText type="screenTitle">Dagen</ThemedText>
        <ThemedText type="bodySecondary">Recente dagjournals, meest recente eerst.</ThemedText>
      </ThemedView>

      {loading ? (
        <StateBlock tone="loading" message="Dagen laden..." detail="We halen je recente dagen op." />
      ) : null}
      {!loading && error ? (
        <StateBlock
          tone="error"
          message="Recente dagen konden niet geladen worden."
          detail={error}
        />
      ) : null}
      {!loading && !error && journals.length === 0 ? (
        <StateBlock
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
                <SurfaceSection title={journal.journal_date}>
                  <ThemedText type="bodySecondary">
                    {journal.summary?.trim()
                      ? journal.summary
                      : 'Nog geen samenvatting voor deze dag.'}
                  </ThemedText>
                  {sectionPreview ? <MetaText>{sectionPreview}</MetaText> : null}
                </SurfaceSection>
              </Pressable>
            );
          })}
        </ThemedView>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.inline,
  },
  list: {
    gap: spacing.inline,
  },
  item: {
    gap: spacing.xs,
  },
});
