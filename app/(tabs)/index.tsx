import { InlineLoadingOverlay } from "@/components/feedback/inline-loading-overlay";
import { DayEditorialPanel } from "@/components/journal/day-editorial-panel";
import { MomentsTimelineSection } from "@/components/journal/moments-timeline-section";
import { ReflectionTeaserCard } from "@/components/journal/reflection-teaser-card";
import { ScreenHeader } from "@/components/layout/screen-header";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  StateBlock,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  fetchLatestReflection,
  fetchRecentDayJournals,
  fetchRecentNormalizedEntries,
  fetchTodayJournal,
  getUtcTodayDate,
} from "@/services";
import { colorTokens, radius, spacing, typography } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function TodayScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [recentEntries, setRecentEntries] = useState<
    Awaited<ReturnType<typeof fetchRecentNormalizedEntries>>
  >([]);
  const [recentJournals, setRecentJournals] = useState<
    Awaited<ReturnType<typeof fetchRecentDayJournals>>
  >([]);
  const [latestWeekReflection, setLatestWeekReflection] =
    useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);
  const [latestMonthReflection, setLatestMonthReflection] =
    useState<Awaited<ReturnType<typeof fetchLatestReflection>>>(null);
  const todayDate = getUtcTodayDate();

  const loadToday = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [journal, recent, recentDayRows, weekReflection, monthReflection] =
        await Promise.all([
          fetchTodayJournal(todayDate),
          fetchRecentNormalizedEntries(5),
          fetchRecentDayJournals({ limit: 14 }),
          fetchLatestReflection("week"),
          fetchLatestReflection("month"),
        ]);
      setSummary(journal?.summary?.trim() ? journal.summary : null);
      setRecentEntries(recent);
      setRecentJournals(recentDayRows);
      setLatestWeekReflection(weekReflection);
      setLatestMonthReflection(monthReflection);
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon vandaag niet laden.";
      setError(message);
      setSummary(null);
      setRecentEntries([]);
      setRecentJournals([]);
      setLatestWeekReflection(null);
      setLatestMonthReflection(null);
    } finally {
      setLoading(false);
    }
  }, [todayDate]);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday]),
  );

  const todayEntries = useMemo(
    () => recentEntries.filter((entry) => entry.journal_date === todayDate),
    [recentEntries, todayDate],
  );
  const latestPreviousJournal = useMemo(
    () =>
      recentJournals.find(
        (journal) =>
          journal.journal_date !== todayDate &&
          Boolean(journal.summary?.trim()),
      ) ?? null,
    [recentJournals, todayDate],
  );

  const hasUsableTodaySummary = useMemo(
    () => isUsableTodaySummary(summary),
    [summary],
  );
  const statusLine = loading
    ? "Wordt bijgewerkt"
    : error
      ? "Update tijdelijk niet beschikbaar"
      : hasUsableTodaySummary || todayEntries.length > 0
        ? "Vandaag bijgewerkt"
        : "Klaar voor je eerste entry";
  return (
    <ScreenContainer
      scrollable
      backgroundTone="subtle"
      fixedHeader={
        <ScreenHeader
          leftAction={
            <HeaderIconButton
              accessibilityRole="button"
              accessibilityLabel="Kies dag"
              onPress={() => router.push("/days")}
            >
              <MaterialIcons
                name="calendar-today"
                size={18}
                color={palette.primary}
              />
            </HeaderIconButton>
          }
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
      <ThemedView style={styles.hero}>
        <ThemedText type="screenTitle" style={styles.heroTitle}>
          Vandaag
        </ThemedText>
        <ThemedText
          type="bodySecondary"
          style={[styles.heroCopy, { color: palette.muted }]}
        >
          Spreek iets in of schrijf iets op voor je dagboek.
        </ThemedText>
        <ThemedView style={styles.heroCtaWrap}>
          <PrimaryButton
            label="Spreek of schrijf iets"
            onPress={() => router.push("/capture")}
          />
        </ThemedView>
        <ThemedView style={styles.statusRow}>
          <ThemedView
            style={[
              styles.statusDot,
              { backgroundColor: palette.success },
              loading
                ? { backgroundColor: palette.mutedSoft }
                : error
                  ? { backgroundColor: palette.error }
                  : { backgroundColor: palette.success },
            ]}
          />
          <ThemedText
            type="caption"
            style={[styles.statusText, { color: palette.mutedSoft }]}
            numberOfLines={1}
          >
            {statusLine}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {loading ? (
        <InlineLoadingOverlay
          message="Vandaag laden..."
          detail="Even geduld, we halen je dagjournal op."
        />
      ) : null}
      {!loading && error ? (
        <StateBlock
          tone="error"
          message="Vandaag kon niet geladen worden."
          detail={error}
        />
      ) : null}
      {!loading && !error && !hasUsableTodaySummary ? (
        <DayEditorialPanel
          text={
            '"Je dag is nog een leeg canvas. Er is ruimte voor de kleine dingen die later betekenis krijgen."'
          }
        />
      ) : null}

      {!loading && !error && hasUsableTodaySummary ? (
        <DayEditorialPanel
          text={summary?.trim() ?? ""}
          numberOfLines={4}
          onPress={() => router.push(`/day/${todayDate}`)}
        />
      ) : null}

      {!loading && !error && todayEntries.length > 0 ? (
        <MomentsTimelineSection
          title="Recente momenten"
          rightLabel="Vandaag"
          entries={todayEntries}
          style={styles.recentBlock}
          onEntryPress={(entry) =>
            router.push({
              pathname: "/entry/[id]",
              params: { id: entry.id, source: "today", date: todayDate },
            })
          }
          previewText={(entry) =>
            entry.summary_short?.trim() || summarizeSnippet(entry.body)
          }
        />
      ) : null}

      {!loading &&
      !error &&
      todayEntries.length === 0 &&
      latestPreviousJournal ? (
        <Pressable
          onPress={() =>
            router.push(`/day/${latestPreviousJournal.journal_date}`)
          }
        >
          <ThemedView style={styles.previousSummaryBlock}>
            <MetaText>
              Laatste dag ·{" "}
              {formatShortDate(latestPreviousJournal.journal_date)}
            </MetaText>
            <ThemedText
              type="bodySecondary"
              style={[styles.compactText, { color: palette.muted }]}
              numberOfLines={3}
            >
              {latestPreviousJournal.summary}
            </ThemedText>
          </ThemedView>
        </Pressable>
      ) : null}

      {!loading && !error ? (
        <ThemedView style={styles.reflectTeaserBlock}>
          <ThemedView
            style={[
              styles.reflectTeaserFrame,
              { borderTopColor: palette.border },
            ]}
          >
            <ReflectionTeaserCard
              periodType="week"
              reflection={latestWeekReflection}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/reflections",
                  params: { period: "week" },
                })
              }
              style={styles.reflectTeaserItem}
            />
            <ReflectionTeaserCard
              periodType="month"
              reflection={latestMonthReflection}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/reflections",
                  params: { period: "month" },
                })
              }
              style={styles.reflectTeaserItem}
            />
          </ThemedView>
        </ThemedView>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="today"
        onRequestClose={() => setMenuVisible(false)}
      />
    </ScreenContainer>
  );
}

function summarizeSnippet(value: string): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) {
    return "Geen korte samenvatting beschikbaar.";
  }

  return clean.length > 96 ? `${clean.slice(0, 95).trimEnd()}...` : clean;
}

function formatShortDate(utcDate: string): string {
  const parsed = new Date(`${utcDate}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return utcDate;
  }

  return parsed.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function isUsableTodaySummary(value: string | null): boolean {
  const clean = value?.trim() ?? "";
  if (!clean) {
    return false;
  }

  const normalized = clean.toLowerCase();
  if (
    normalized === "nog geen bruikbare notitie voor deze dag." ||
    normalized === "nog geen bruikbare notities voor deze dag."
  ) {
    return false;
  }

  return true;
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  hero: {
    alignItems: "center",
    gap: spacing.xxs,
    paddingTop: spacing.xs,
  },
  heroTitle: { textAlign: "center" },
  heroCopy: {
    textAlign: "center",
  },
  heroCtaWrap: {
    width: "100%",
    paddingTop: 32,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.inline,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
  },
  statusText: {
    textTransform: "none",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  compactText: {
    lineHeight: typography.roles.bodySecondary.lineHeight + 1,
  },
  recentBlock: {
    marginTop: spacing.lg,
  },
  previousSummaryBlock: {
    marginTop: spacing.sm,
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  reflectTeaserBlock: {
    marginTop: spacing.lg,
  },
  reflectTeaserFrame: {
    borderTopWidth: 1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  reflectTeaserItem: {
    paddingBottom: spacing.sm,
  },
});
