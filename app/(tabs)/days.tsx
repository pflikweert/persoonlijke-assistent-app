import { router, useFocusEffect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  ScreenContainer,
  StateBlock,
} from '@/components/ui/screen-primitives';
import { fetchRecentDayJournals, parseJournalSections } from '@/services';
import { colorTokens, spacing } from '@/theme';

type MonthGroup = {
  key: string;
  label: string;
  journals: Awaited<ReturnType<typeof fetchRecentDayJournals>>;
};

function parseJournalDate(dateValue: string): Date | null {
  const parsed = new Date(`${dateValue}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatMonthLabel(dateValue: string): string {
  const parsed = parseJournalDate(dateValue);
  if (!parsed) {
    return 'Onbekende maand';
  }
  return parsed.toLocaleDateString('nl-NL', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatWeekdayShort(dateValue: string): string {
  const parsed = parseJournalDate(dateValue);
  if (!parsed) {
    return '--';
  }
  return parsed
    .toLocaleDateString('nl-NL', {
      weekday: 'short',
      timeZone: 'UTC',
    })
    .replace('.', '');
}

function formatDayNumber(dateValue: string): string {
  const parsed = parseJournalDate(dateValue);
  if (!parsed) {
    return '--';
  }
  return String(parsed.getUTCDate()).padStart(2, '0');
}

function buildSnippet(summary: string | null, sections: string[]): string {
  const fromSummary = summary?.trim();
  if (fromSummary) {
    return fromSummary;
  }
  const fromSection = sections.find((section) => section.trim().length > 0);
  if (fromSection) {
    return fromSection.trim();
  }
  return 'Nog geen samenvatting voor deze dag.';
}

export default function DaysScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
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

  const groups = useMemo<MonthGroup[]>(() => {
    const monthMap = new Map<string, MonthGroup>();

    for (const journal of journals) {
      const key = journal.journal_date.slice(0, 7);
      const existing = monthMap.get(key);
      if (existing) {
        existing.journals.push(journal);
      } else {
        monthMap.set(key, {
          key,
          label: formatMonthLabel(journal.journal_date),
          journals: [journal],
        });
      }
    }

    return Array.from(monthMap.values());
  }, [journals]);

  return (
    <ScreenContainer
      scrollable
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.header}>
        <ThemedText type="screenTitle">Dagen</ThemedText>
        <ThemedText type="bodySecondary" style={[styles.headerContext, { color: palette.muted }]}>
          Persoonlijk archief om rustig terug te lezen.
        </ThemedText>
      </ThemedView>

      {loading ? (
        <StateBlock tone="loading" message="Archief laden..." detail="We halen je recente dagen op." />
      ) : null}
      {!loading && error ? (
        <StateBlock
          tone="error"
          message="Archief kon niet geladen worden."
          detail={error}
        />
      ) : null}
      {!loading && !error && journals.length === 0 ? (
        <StateBlock
          tone="empty"
          message="Nog geen dagen in je archief."
          detail="Leg eerst een notitie vast, dan verschijnt je eerste dag hier."
        />
      ) : null}

      {!loading && !error && journals.length > 0 ? (
        <ThemedView style={styles.list}>
          {groups.map((group) => (
            <ThemedView key={group.key} style={styles.monthGroup}>
              <ThemedText type="meta" style={[styles.monthHeading, { color: palette.primary }]}>
                {group.label}
              </ThemedText>

              <ThemedView style={styles.rows}>
                {group.journals.map((journal) => {
                  const sections = parseJournalSections(journal.sections);
                  const snippet = buildSnippet(journal.summary, sections);

                  return (
                    <Pressable
                      key={journal.id}
                      onPress={() =>
                        router.push({
                          pathname: '/day/[date]',
                          params: { date: journal.journal_date },
                        })
                      }
                      style={[styles.row, { borderBottomColor: `${palette.separator}88` }]}>
                      <ThemedView style={styles.dateColumn}>
                        <ThemedText type="caption" style={[styles.weekday, { color: palette.mutedSoft }]}>
                          {formatWeekdayShort(journal.journal_date)}
                        </ThemedText>
                        <ThemedText type="sectionTitle" style={[styles.dayNumber, { color: palette.text }]}>
                          {formatDayNumber(journal.journal_date)}
                        </ThemedText>
                      </ThemedView>

                      <ThemedView style={[styles.snippetColumn, { borderLeftColor: palette.separator }]}>
                        <ThemedText
                          numberOfLines={2}
                          type="bodySecondary"
                          style={[styles.snippet, { color: palette.muted }]}>
                          {snippet}
                        </ThemedText>
                      </ThemedView>

                      <MaterialIcons
                        name="chevron-right"
                        size={18}
                        color={palette.mutedSoft}
                        style={styles.chevron}
                      />
                    </Pressable>
                  );
                })}
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  headerContext: {
  },
  list: {
    gap: spacing.xl,
  },
  monthGroup: {
    gap: spacing.sm,
  },
  monthHeading: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  rows: {
    gap: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dateColumn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  weekday: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dayNumber: {
  },
  snippetColumn: {
    flex: 1,
    borderLeftWidth: 1,
    paddingLeft: spacing.md,
    justifyContent: 'center',
  },
  snippet: {
  },
  chevron: {
    opacity: 0.65,
  },
});
