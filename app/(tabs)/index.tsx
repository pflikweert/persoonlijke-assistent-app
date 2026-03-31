import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
      </ThemedView>

      <ThemedText type="defaultSemiBold">Datum (UTC): {todayDate}</ThemedText>

      {loading ? <ThemedText>Laden...</ThemedText> : null}
      {!loading && error ? <ThemedText>{error}</ThemedText> : null}
      {!loading && !error && !summary ? (
        <ThemedText>Nog geen dagjournal voor vandaag. Leg een eerste notitie vast.</ThemedText>
      ) : null}

      {!loading && !error && summary ? <ThemedText>{summary}</ThemedText> : null}

      {!loading && !error && sections.length > 0 ? (
        <ThemedView style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <ThemedText key={`${section}-${index}`}>• {section}</ThemedText>
          ))}
        </ThemedView>
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
    gap: spacing.xs,
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
