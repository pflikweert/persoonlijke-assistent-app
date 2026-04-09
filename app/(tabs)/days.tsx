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
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { ScreenContainer, StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { fetchRecentDayJournals, parseJournalSections } from "@/services";
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [journals, setJournals] = useState<
    Awaited<ReturnType<typeof fetchRecentDayJournals>>
  >([]);

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
      loadDays();
    }, [loadDays]),
  );

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
          onPress: () =>
            router.push({
              pathname: "/day/[date]",
              params: { date: journal.journal_date },
            }),
        };
      }),
    }));
  }, [journals]);

  return (
    <ScreenContainer
      scrollable
      backgroundTone="flat"
      fixedHeader={
        <ScreenHeader
          title="Dagen"
          titleType="screenTitle"
          subtitle="Persoonlijk archief om rustig terug te lezen."
          rightAction={
            <HeaderIconButton
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              onPress={() => setMenuVisible(true)}
            >
              <MaterialIcons name="menu" size={20} color={palette.primary} />
            </HeaderIconButton>
          }
        />
      }
      contentContainerStyle={styles.scrollContent}
    >
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
          hasMore={hasMore}
          loadingMore={loadingMore}
          loadMoreLabel="Meer dagen laden"
          onLoadMore={() => void loadMoreDays()}
        />
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="days"
        onRequestClose={() => setMenuVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
});
