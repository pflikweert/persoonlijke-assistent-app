import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ContentSection, StateNotice } from '@/components/ui/screen-primitives';
import { fetchTodayJournal, getUtcTodayDate, parseJournalSections } from '@/services';
import { spacing } from '@/theme';

export default function TodayScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const todayDate = getUtcTodayDate();

  const loadToday = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const journal = await fetchTodayJournal(todayDate);
      setSummary(journal?.summary?.trim() ? journal.summary : null);
      setSections(journal ? parseJournalSections(journal.sections) : []);
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'Kon vandaag niet laden.';
      setError(message);
      setSummary(null);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [todayDate]);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Vandaag</ThemedText>
        <ThemedText>Overzicht van je dag in rustige, korte punten.</ThemedText>
        <ThemedText style={styles.metaText}>Datum (UTC): {todayDate}</ThemedText>
      </ThemedView>

      {loading ? (
        <StateNotice tone="loading" message="Vandaag laden..." detail="Even geduld, we halen je dagjournal op." />
      ) : null}
      {!loading && error ? (
        <StateNotice
          tone="error"
          message="Vandaag kon niet geladen worden."
          detail={error}
        />
      ) : null}
      {!loading && !error && !summary ? (
        <StateNotice
          tone="empty"
          message="Er is nog geen dagjournal voor vandaag."
          detail="Leg je eerste notitie vast om je dag op te bouwen."
        />
      ) : null}

      {!loading && !error && summary ? (
        <ContentSection title="Dagsamenvatting">
          <ThemedText>{summary}</ThemedText>
        </ContentSection>
      ) : null}

      {!loading && !error && sections.length > 0 ? (
        <ContentSection title="Kernpunten">
          <ThemedView style={styles.sectionsContainer}>
            {sections.map((section, index) => (
              <ThemedText key={`${section}-${index}`}>• {section}</ThemedText>
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
  titleContainer: {
    gap: spacing.sm,
  },
  metaText: {
    opacity: 0.7,
  },
  sectionsContainer: {
    gap: spacing.sm,
  },
  captureButton: {
    marginTop: spacing.md,
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
