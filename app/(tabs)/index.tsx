import { InlineLoadingOverlay } from "@/components/feedback/inline-loading-overlay";
import { DayJournalSummaryInset } from "@/components/journal/day-journal-summary-inset";
import { MomentsTimelineSection } from "@/components/journal/moments-timeline-section";
import { ReflectionTeaserCard } from "@/components/journal/reflection-teaser-card";
import { ScreenHeader } from "@/components/layout/screen-header";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import {
  HomeHeroIntro,
  HomeReflectionPreviewFrame,
  HomeStatusLine,
} from "@/components/ui/home-screen-primitives";
import {
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
import { colorTokens, spacing, typography } from "@/theme";
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
  const statusTone = loading ? "idle" : error ? "error" : "success";
  return (
    <ScreenContainer
      scrollable
      backgroundTone="ambient"
      fixedHeader={
        <ScreenHeader
          leftAction={
            <ThemedView style={styles.brandLockup}>
              <ThemedText type="sectionTitle" style={styles.brandPrimary}>
                Budio
              </ThemedText>
              <ThemedText
                type="sectionTitle"
                style={[styles.brandSecondary, { color: palette.mutedSoft }]}
              >
                Vandaag
              </ThemedText>
            </ThemedView>
          }
          rightAction={
            <ThemedView style={styles.headerActions}>
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
              <HeaderIconButton
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                onPress={() => setMenuVisible(true)}
              >
                <MaterialIcons name="menu" size={20} color={palette.primary} />
              </HeaderIconButton>
            </ThemedView>
          }
          surface="transparent"
        />
      }
      contentContainerStyle={styles.scrollContent}
    >
      <HomeHeroIntro
        title="Vandaag"
        subtitle="Spreek iets in of schrijf iets op voor je dagboek."
        cta={
          <PrimaryButton
            label="Spreek of schrijf iets"
            onPress={() => router.push("/capture")}
          />
        }
        status={<HomeStatusLine text={statusLine} tone={statusTone} />}
      />

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
      {!loading && !error ? (
        <ThemedView style={styles.summarySection}>
          {hasUsableTodaySummary ? (
            <Pressable onPress={() => router.push(`/day/${todayDate}`)}>
              <DayJournalSummaryInset text={summary?.trim() ?? ""} />
            </Pressable>
          ) : (
            <DayJournalSummaryInset
              text={
                "Je dag is nog een leeg canvas. Er is ruimte voor de kleine dingen die later betekenis krijgen."
              }
            />
          )}
        </ThemedView>
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
          <ThemedView
            style={[
              styles.previousSummaryBlock,
              { borderLeftColor: scheme === "dark" ? "#B8A47A" : "#8A6A1F" },
            ]}
          >
            <ThemedText
              type="meta"
              style={[styles.previousSummaryMeta, { color: palette.primary }]}
            >
              Laatste dag ·{" "}
              {formatShortDate(latestPreviousJournal.journal_date)}
            </ThemedText>
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
          <HomeReflectionPreviewFrame>
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
          </HomeReflectionPreviewFrame>
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  compactText: {
    lineHeight: typography.roles.bodySecondary.lineHeight + 1,
  },
  recentBlock: {
    marginTop: spacing.lg,
  },
  summarySection: {
    marginTop: spacing.xs,
  },
  previousSummaryBlock: {
    marginTop: spacing.xs,
    gap: spacing.xs,
    paddingLeft: spacing.md,
    borderLeftWidth: 2,
  },
  previousSummaryMeta: {
    letterSpacing: 0.3,
  },
  reflectTeaserBlock: {
    marginTop: spacing.md,
  },
  reflectTeaserItem: {
    paddingBottom: spacing.xs,
  },
});
