import { router, useFocusEffect } from 'expo-router';
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
    <ScreenContainer>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="screenTitle">Vandaag</ThemedText>
        <ThemedText type="bodySecondary">Overzicht van je dag in rustige, korte punten.</ThemedText>
        <MetaText>Datum (UTC): {todayDate}</MetaText>
      </ThemedView>

      {loading ? (
        <StateBlock tone="loading" message="Vandaag laden..." detail="Even geduld, we halen je dagjournal op." />
      ) : null}
      {!loading && error ? (
        <StateBlock
          tone="error"
          message="Vandaag kon niet geladen worden."
          detail={error}
        />
      ) : null}
      {!loading && !error && !summary ? (
        <StateBlock
          tone="empty"
          message="Er is nog geen dagjournal voor vandaag."
          detail="Leg je eerste notitie vast om je dag op te bouwen."
        />
      ) : null}

      {!loading && !error && summary ? (
        <SurfaceSection title="Dagsamenvatting">
          <ThemedText>{summary}</ThemedText>
        </SurfaceSection>
      ) : null}

      {!loading && !error && sections.length > 0 ? (
        <SurfaceSection title="Kernpunten">
          <ThemedView style={styles.sectionsContainer}>
            {sections.map((section, index) => (
              <ThemedText key={`${section}-${index}`} type="bodySecondary">
                • {section}
              </ThemedText>
            ))}
          </ThemedView>
        </SurfaceSection>
      ) : null}

      <PrimaryButton label="Nieuwe entry" onPress={() => router.push('/capture')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: spacing.inline,
  },
  sectionsContainer: {
    gap: spacing.inline,
  },
});
