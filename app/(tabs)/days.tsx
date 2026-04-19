import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { InlineLoadingOverlay } from "@/components/feedback/inline-loading-overlay";
import {
  ArchiveGroupedList,
  type ArchiveGroupedListSection,
} from "@/components/journal/archive-grouped-list";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DetailScreenHero } from "@/components/ui/detail-screen-primitives";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { ScreenContainer, StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  fetchRecentDayJournals,
  getSessionSelectedDayDate,
  getUtcTodayDate,
  parseJournalSections,
  setSessionSelectedDayDate,
} from "@/services";
import { colorTokens, spacing } from "@/theme";

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
    return "Onbekende maand";
  }
  return parsed.toLocaleDateString("nl-NL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatWeekdayShort(dateValue: string): string {
  const parsed = parseJournalDate(dateValue);
  if (!parsed) {
    return "--";
  }
  return parsed
    .toLocaleDateString("nl-NL", {
      weekday: "short",
      timeZone: "UTC",
    })
    .replace(".", "");
}

function formatDayNumber(dateValue: string): string {
  const parsed = parseJournalDate(dateValue);
  if (!parsed) {
    return "--";
  }
  return String(parsed.getUTCDate()).padStart(2, "0");
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
  return "Nog geen samenvatting voor deze dag.";
}

export default function DaysScreen() {
  const PAGE_SIZE = 21;
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionSelectedDayDate, setSessionSelectedDayDateState] =
    useState<string | null>(getSessionSelectedDayDate());
  const [journals, setJournals] = useState<
    Awaited<ReturnType<typeof fetchRecentDayJournals>>
  >([]);

  const handleClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)");
  }, []);

  const loadDays = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadingMore(false);
    setHasMore(false);

    try {
      const rows = await fetchRecentDayJournals({
        limit: PAGE_SIZE,
        offset: 0,
      });
      setJournals(rows);
      setHasMore(rows.length === PAGE_SIZE);
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon recente dagen niet laden.";
      setError(message);
      setJournals([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [PAGE_SIZE]);

  const loadMoreDays = useCallback(async () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    setError(null);

    try {
      const rows = await fetchRecentDayJournals({
        limit: PAGE_SIZE,
        offset: journals.length,
      });

      const existing = new Set(journals.map((item) => item.id));
      const merged = [
        ...journals,
        ...rows.filter((row) => !existing.has(row.id)),
      ];
      setJournals(merged);
      setHasMore(rows.length === PAGE_SIZE);
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon extra dagen niet laden.";
      setError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [PAGE_SIZE, hasMore, journals, loading, loadingMore]);

  useFocusEffect(
    useCallback(() => {
      setSessionSelectedDayDateState(getSessionSelectedDayDate());
      loadDays();
    }, [loadDays]),
  );

  const selectedDayDate = sessionSelectedDayDate ?? getUtcTodayDate();

  const sections = useMemo<ArchiveGroupedListSection[]>(() => {
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

    return Array.from(monthMap.values()).map((group) => ({
      key: group.key,
      title: group.label,
      items: group.journals.map((journal) => {
        const sections = parseJournalSections(journal.sections);
        const snippet = buildSnippet(journal.summary, sections);
        return {
          key: journal.id,
          leftTop: formatWeekdayShort(journal.journal_date),
          leftBottom: formatDayNumber(journal.journal_date),
          snippet,
          selected: journal.journal_date === selectedDayDate,
          onPress: () => {
            setSessionSelectedDayDate(journal.journal_date);
            setSessionSelectedDayDateState(journal.journal_date);
            router.push({
              pathname: "/day/[date]",
              params: { date: journal.journal_date },
            });
          },
        };
      }),
    }));
  }, [journals, selectedDayDate]);

  return (
    <ScreenContainer
      scrollable
      backgroundTone="flat"
      fixedHeader={
        <ScreenHeader
          surface="transparent"
          leftAction={
            <ThemedView style={styles.brandLockup}>
              <ThemedText type="sectionTitle" style={styles.brandPrimary}>
                Budio
              </ThemedText>
              <ThemedText
                type="sectionTitle"
                style={[styles.brandSecondary, { color: palette.mutedSoft }]}
              >
                Dagen
              </ThemedText>
            </ThemedView>
          }
          rightAction={
            <HeaderIconButton
              accessibilityRole="button"
              accessibilityLabel="Sluiten"
              onPress={handleClose}
            >
              <MaterialIcons name="close" size={20} color={palette.primary} />
            </HeaderIconButton>
          }
        />
      }
      contentContainerStyle={styles.scrollContent}
    >
      <DetailScreenHero
        title="Kies een dag"
        subtitle="Kies een dag om terug te lezen."
        style={styles.hero}
      />

      {loading ? (
        <InlineLoadingOverlay
          message="Archief laden..."
          detail="We halen je recente dagen op."
        />
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
        <ArchiveGroupedList
          sections={sections}
          snippetLines={3}
          hasMore={hasMore}
          loadingMore={loadingMore}
          loadMoreLabel="Meer dagen laden"
          onLoadMore={() => void loadMoreDays()}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  brandPrimary: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  brandSecondary: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "400",
    letterSpacing: -0.4,
  },
  hero: {
    marginBottom: spacing.sm,
  },
});
