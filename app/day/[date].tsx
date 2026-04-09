import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Stack,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRootNavigationState,
} from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet
} from "react-native";

import { InlineLoadingOverlay } from "@/components/feedback/inline-loading-overlay";
import { ProcessingScreen } from "@/components/feedback/processing-screen";
import { TextEditorModal } from "@/components/feedback/text-editor-modal";
import { DayEditorialPanel } from "@/components/journal/day-editorial-panel";
import { EditorialNarrativeBlock } from "@/components/journal/editorial-narrative-block";
import { MomentsTimelineSection } from "@/components/journal/moments-timeline-section";
import { ReflectionTeaserCard } from "@/components/journal/reflection-teaser-card";
import { ScreenHeader } from "@/components/layout/screen-header";
import { BottomTabBarStandalone } from "@/components/navigation/BottomTabBar";
import {
  FullscreenMenuOverlay,
  type MainMenuRouteKey,
} from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppBackground } from "@/components/ui/app-background";
import { CopyIconButton } from "@/components/ui/copy-icon-button";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { SecondaryButton, StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  fetchDayJournalByDate,
  fetchNormalizedEntriesByDate,
  fetchReflectionForAnchorDate,
  generateReflection,
  getUtcTodayDate,
  isValidJournalDate,
  parseJournalSections,
  regenerateDayJournalByDate,
  updateNormalizedEntryById,
} from "@/services";
import { buildDayJournalCopyPayload } from "@/src/lib/copy-payloads";
import { colorTokens, radius, spacing } from "@/theme";

type RouteParams = {
  date?: string | string[];
  processed?: string | string[];
  entryId?: string | string[];
};

function resolveRouteDate(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function formatLongDate(value: string): string {
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value || "-";
  }

  return parsed.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDayCopyTitle(value: string): string {
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value || "-";
  }

  const label = parsed.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return capitalizeFirst(label);
}

function cleanMomentPreview(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function capitalizeFirst(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toUtcMiddayMillis(journalDate: string): number | null {
  const parsed = new Date(`${journalDate}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.getTime();
}

function getDayHeadingLabel(journalDate: string): string {
  const target = toUtcMiddayMillis(journalDate);
  const today = toUtcMiddayMillis(getUtcTodayDate());

  if (!target || !today) {
    return "Dag";
  }

  const diffDays = Math.round((today - target) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return "Vandaag";
  }
  if (diffDays === 1) {
    return "Gisteren";
  }

  const weekday = new Date(target).toLocaleDateString("nl-NL", {
    weekday: "long",
    timeZone: "UTC",
  });
  return capitalizeFirst(weekday);
}

function buildInsight(
  summary: string | null,
  narrativeText: string | null,
  sections: string[],
): string | null {
  const firstSection =
    sections.find((section) => section.trim().length > 0)?.trim() ?? "";
  const firstSentence =
    (narrativeText ?? "").split(/[.!?]/)[0]?.trim() ??
    (summary ?? "").split(/[.!?]/)[0]?.trim() ??
    "";

  if (firstSection.length >= 10) {
    return `Opvallend vandaag: ${firstSection}.`;
  }

  if (firstSentence.length >= 36) {
    return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }

  return null;
}

function extractAiInsight(sections: string[]): {
  insight: string | null;
  remainingSections: string[];
} {
  const remaining: string[] = [];
  let insight: string | null = null;

  for (const section of sections) {
    const clean = section.trim();
    if (!clean) {
      continue;
    }

    if (!insight && /^inzicht\s*:/i.test(clean)) {
      insight = clean.replace(/^inzicht\s*:/i, "").trim();
      continue;
    }

    remaining.push(clean);
  }

  return {
    insight: insight && insight.length > 0 ? insight : null,
    remainingSections: remaining,
  };
}

function blurActiveElementOnWeb() {
  if (Platform.OS !== "web" || typeof document === "undefined") {
    return;
  }

  const active = document.activeElement as HTMLElement | null;
  active?.blur?.();
}

export default function DayDetailScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const navigationState = useRootNavigationState();
  const { date, processed, entryId } = useLocalSearchParams<RouteParams>();
  const journalDate = useMemo(() => resolveRouteDate(date), [date]);
  const targetEntryId = useMemo(() => resolveRouteDate(entryId), [entryId]);
  const showProcessedBanner = useMemo(() => {
    const value = resolveRouteDate(processed);
    return value === "1" || value.toLowerCase() === "true";
  }, [processed]);

  type DayEntry = Awaited<
    ReturnType<typeof fetchNormalizedEntriesByDate>
  >[number];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [narrativeText, setNarrativeText] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [weekReflection, setWeekReflection] =
    useState<Awaited<ReturnType<typeof fetchReflectionForAnchorDate>>>(null);
  const [monthReflection, setMonthReflection] =
    useState<Awaited<ReturnType<typeof fetchReflectionForAnchorDate>>>(null);
  const [entryOffsets, setEntryOffsets] = useState<Record<string, number>>({});
  const [focusedEntryId, setFocusedEntryId] = useState<string | null>(null);
  const [pendingFocusEntryId, setPendingFocusEntryId] = useState<string | null>(
    null,
  );
  const [editingEntry, setEditingEntry] = useState<DayEntry | null>(null);
  const [editBody, setEditBody] = useState("");
  const [mutationBusy, setMutationBusy] = useState(false);
  const [showEditProcessing, setShowEditProcessing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDay = useCallback(async () => {
    if (!isValidJournalDate(journalDate)) {
      setLoading(false);
      setError("Ongeldige datum in route.");
      setSummary(null);
      setNarrativeText(null);
      setSections([]);
      setEntries([]);
      setWeekReflection(null);
      setMonthReflection(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [journal, normalizedEntries] = await Promise.all([
        fetchDayJournalByDate(journalDate),
        fetchNormalizedEntriesByDate(journalDate),
      ]);

      setSummary(journal?.summary?.trim() ? journal.summary : null);
      setNarrativeText(
        journal?.narrative_text?.trim()
          ? journal.narrative_text
          : journal?.summary?.trim() || null,
      );
      setSections(journal ? parseJournalSections(journal.sections) : []);
      setEntryOffsets({});
      setEntries(normalizedEntries);

      const [weekResult, monthResult] = await Promise.allSettled([
        fetchReflectionForAnchorDate({
          periodType: "week",
          anchorDate: journalDate,
        }),
        fetchReflectionForAnchorDate({
          periodType: "month",
          anchorDate: journalDate,
        }),
      ]);

      setWeekReflection(
        weekResult.status === "fulfilled" ? weekResult.value : null,
      );
      setMonthReflection(
        monthResult.status === "fulfilled" ? monthResult.value : null,
      );
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon dagdetail niet laden.";
      setError(message);
      setSummary(null);
      setNarrativeText(null);
      setSections([]);
      setEntries([]);
      setWeekReflection(null);
      setMonthReflection(null);
    } finally {
      setLoading(false);
    }
  }, [journalDate]);

  useFocusEffect(
    useCallback(() => {
      loadDay();
    }, [loadDay]),
  );

  useEffect(() => {
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }

    setFocusedEntryId(null);
    setPendingFocusEntryId(targetEntryId || null);
  }, [targetEntryId, journalDate]);

  useEffect(() => {
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    };
  }, []);

  const aiInsight = useMemo(() => extractAiInsight(sections), [sections]);
  const previewSections = aiInsight.remainingSections.slice(0, 4);
  const readableDate = useMemo(
    () => formatLongDate(journalDate),
    [journalDate],
  );
  const copyDateTitle = useMemo(
    () => formatDayCopyTitle(journalDate),
    [journalDate],
  );
  const dayHeading = useMemo(
    () => getDayHeadingLabel(journalDate),
    [journalDate],
  );
  const insightText = useMemo(
    () =>
      aiInsight.insight ??
      buildInsight(summary, narrativeText, aiInsight.remainingSections),
    [aiInsight.insight, aiInsight.remainingSections, summary, narrativeText],
  );
  const visibleEntries = useMemo(
    () =>
      entries
        .map((entry) => ({
          ...entry,
          body: cleanMomentPreview(entry.body ?? ""),
          summary_short: cleanMomentPreview(entry.summary_short ?? ""),
        }))
        .sort((left, right) => {
          const leftTime = new Date(left.captured_at).getTime();
          const rightTime = new Date(right.captured_at).getTime();
          return leftTime - rightTime;
        }),
    [entries],
  );
  const previousTabName = useMemo(() => {
    const root = navigationState;
    if (!root || root.index < 1) {
      return null;
    }

    const previousRoute = root.routes[root.index - 1] as {
      name?: string;
      state?: { index?: number; routes?: { name?: string }[] };
    };

    if (previousRoute?.name !== "(tabs)") {
      return null;
    }

    const tabState = previousRoute.state;
    if (
      !tabState ||
      typeof tabState.index !== "number" ||
      !Array.isArray(tabState.routes)
    ) {
      return null;
    }

    return tabState.routes[tabState.index]?.name ?? null;
  }, [navigationState]);
  const menuRouteKey = useMemo<MainMenuRouteKey>(() => {
    if (previousTabName === "days") {
      return "days";
    }
    if (previousTabName === "reflections") {
      return "reflections";
    }
    if (previousTabName === "capture") {
      return "capture";
    }

    return "today";
  }, [previousTabName]);
  const dayJournalCopyPayload = useMemo(
    () =>
      buildDayJournalCopyPayload({
        dateLabel: copyDateTitle,
        summary,
        narrativeText,
        insight: insightText,
        keyPoints: previewSections,
      }),
    [copyDateTitle, insightText, narrativeText, previewSections, summary],
  );

  useEffect(() => {
    if (!pendingFocusEntryId || loading || Boolean(error)) {
      return;
    }

    const targetExists = visibleEntries.some(
      (entry) => entry.id === pendingFocusEntryId,
    );
    if (!targetExists) {
      setPendingFocusEntryId(null);
      return;
    }

    const targetOffset = entryOffsets[pendingFocusEntryId];
    if (typeof targetOffset !== "number") {
      return;
    }

    const y = Math.max(targetOffset - 12, 0);
    scrollRef.current?.scrollTo({ y, animated: true });
    setFocusedEntryId(pendingFocusEntryId);
    setPendingFocusEntryId(null);

    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = setTimeout(() => {
      setFocusedEntryId((current) =>
        current === pendingFocusEntryId ? null : current,
      );
    }, 2200);
  }, [entryOffsets, error, loading, pendingFocusEntryId, visibleEntries]);

  const handleEntryLayout = useCallback((id: string, y: number) => {
    setEntryOffsets((current) => {
      if (current[id] === y) {
        return current;
      }
      return { ...current, [id]: y };
    });
  }, []);

  function closeEditModal() {
    if (mutationBusy) {
      return;
    }
    blurActiveElementOnWeb();
    setEditingEntry(null);
    setEditBody("");
  }

  function forceCloseEditModal() {
    blurActiveElementOnWeb();
    setEditingEntry(null);
    setEditBody("");
  }

  async function refreshDerivedContentAfterEntryMutation(): Promise<
    string | null
  > {
    if (!isValidJournalDate(journalDate)) {
      return null;
    }

    await regenerateDayJournalByDate(journalDate);
    let reflectionRefreshError: string | null = null;

    // Keep daydetail consistent even when reflection refresh fails.
    try {
      await generateReflection({
        periodType: "week",
        anchorDate: journalDate,
        forceRegenerate: true,
      });
      await generateReflection({
        periodType: "month",
        anchorDate: journalDate,
        forceRegenerate: true,
      });
    } catch (nextError) {
      reflectionRefreshError =
        nextError instanceof Error
          ? nextError.message
          : "Reflecties konden niet direct worden bijgewerkt.";
    }

    await loadDay();
    return reflectionRefreshError;
  }

  async function handleSaveEdit() {
    if (!editingEntry) {
      return;
    }

    setMutationBusy(true);
    setShowEditProcessing(true);
    try {
      await updateNormalizedEntryById({
        id: editingEntry.id,
        body: editBody,
      });
      const reflectionRefreshError =
        await refreshDerivedContentAfterEntryMutation();
      forceCloseEditModal();
      if (reflectionRefreshError) {
        Alert.alert(
          "Wijziging opgeslagen",
          `Dagdetail is bijgewerkt, maar reflecties konden niet direct worden vernieuwd.\n\n${reflectionRefreshError}`,
        );
      }
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon entry niet bijwerken.";
      Alert.alert("Bewerken mislukt", message);
    } finally {
      setMutationBusy(false);
      setShowEditProcessing(false);
    }
  }

  function handleBackPress() {
    const fromCapture = showProcessedBanner || previousTabName === "capture";
    if (fromCapture) {
      router.replace("/(tabs)");
      return;
    }

    const cameFromValidMain =
      previousTabName === "index" ||
      previousTabName === "days" ||
      previousTabName === "reflections";
    if (cameFromValidMain && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <ThemedView style={styles.screen}>
      <AppBackground />
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader
        leftAction={
          <HeaderIconButton onPress={handleBackPress}>
            <MaterialIcons
              name="arrow-back"
              size={18}
              color={palette.mutedSoft}
            />
          </HeaderIconButton>
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
      />
      <ThemedView style={styles.detailHero}>
        <ThemedText type="screenTitle">{dayHeading}</ThemedText>
        <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
          {readableDate}
        </ThemedText>
      </ThemedView>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
        {showProcessedBanner ? (
          <ThemedView style={styles.processedRow}>
            <ThemedView
              style={[
                styles.processedDot,
                { backgroundColor: palette.success },
              ]}
            />
            <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
              Entry verwerkt
            </ThemedText>
          </ThemedView>
        ) : null}

        {loading ? (
          <InlineLoadingOverlay
            message="Dagdetail laden..."
            detail="Even geduld, we halen de dag op."
          />
        ) : null}
        {!loading && error ? (
          <StateBlock
            tone="error"
            message="Dagdetail kon niet geladen worden."
            detail={error}
          />
        ) : null}

        {!loading && !error && !summary && visibleEntries.length === 0 ? (
          <StateBlock
            tone="empty"
            message="Geen inhoud gevonden voor deze dag."
            detail="Leg een notitie vast om deze dag te vullen."
          />
        ) : null}

        {!loading && !error && summary ? (
          <DayEditorialPanel text={summary} />
        ) : null}

        {!loading && !error && narrativeText ? (
          <EditorialNarrativeBlock
            title="Dagverhaal"
            text={narrativeText}
            action={
              <CopyIconButton
                payload={dayJournalCopyPayload}
                copyLabel="Kopieer dagjournaal"
                copiedLabel="Dagjournaal gekopieerd"
              />
            }
          />
        ) : null}

        {!loading && !error && insightText ? (
          <ThemedView
            lightColor="transparent"
            darkColor="transparent"
            style={[styles.insightBlock, { borderLeftColor: palette.primary }]}
          >
            <ThemedView style={styles.insightHeader}>
              <MaterialIcons
                name="auto-awesome"
                size={14}
                color={palette.primary}
              />
              <ThemedText
                type="caption"
                style={[styles.insightLabel, { color: palette.primary }]}
              >
                INZICHT
              </ThemedText>
            </ThemedView>
            <ThemedText
              type="bodySecondary"
              style={[styles.insightText, { color: palette.muted }]}
            >
              {insightText}
            </ThemedText>
          </ThemedView>
        ) : null}

        {!loading && !error && previewSections.length > 0 ? (
          <ThemedView
            lightColor="transparent"
            darkColor="transparent"
            style={styles.keyPointsBlock}
          >
            <ThemedText type="meta" style={{ color: palette.primary }}>
              Kernpunten
            </ThemedText>
            <ThemedView style={styles.keyPointsList}>
              {previewSections.map((section, index) => (
                <ThemedView
                  key={`${section}-${index}`}
                  style={styles.keyPointRow}
                >
                  <ThemedView
                    style={[
                      styles.dot,
                      { backgroundColor: palette.primaryStrong },
                    ]}
                  />
                  <ThemedText type="bodySecondary" style={styles.keyPointText}>
                    {section}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        ) : null}

        {!loading && !error && visibleEntries.length > 0 ? (
          <MomentsTimelineSection
            title="Individuele momenten"
            entries={visibleEntries}
            style={styles.momentsBlock}
            focusedEntryId={focusedEntryId}
            onEntryLayout={handleEntryLayout}
            onEntryPress={(entry) =>
              router.push({
                pathname: "/entry/[id]",
                params: { id: entry.id, source: "day", date: journalDate },
              })
            }
            previewText={(entry) => entry.summary_short || entry.body}
          />
        ) : null}

        <TextEditorModal
          visible={Boolean(editingEntry)}
          title="Moment bewerken"
          value={editBody}
          placeholder="Wat houdt je bezig?"
          submitLabel="Moment bewaren"
          processingLabel="Moment bewaren..."
          processing={mutationBusy}
          onCancel={closeEditModal}
          onChange={setEditBody}
          onSubmit={() => void handleSaveEdit()}
        />
        <ProcessingScreen visible={showEditProcessing} variant="entry-edit" />

        <ThemedView style={styles.bottomActionWrap}>
          <SecondaryButton
            label="Nieuw moment vastleggen"
            onPress={() =>
              router.push({
                pathname: "/capture",
                params: { date: journalDate },
              })
            }
          />
        </ThemedView>

        {!loading && !error && (weekReflection || monthReflection) ? (
          <ThemedView style={styles.reflectionCardsBlock}>
            {weekReflection ? (
              <ReflectionTeaserCard
                periodType="week"
                reflection={weekReflection}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/reflections",
                    params: { period: "week" },
                  })
                }
              />
            ) : null}
            {monthReflection ? (
              <ReflectionTeaserCard
                periodType="month"
                reflection={monthReflection}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/reflections",
                    params: { period: "month" },
                  })
                }
              />
            ) : null}
          </ThemedView>
        ) : null}
      </ScrollView>

      <BottomTabBarStandalone
        activeKey={
          menuRouteKey === "capture"
            ? "capture"
            : menuRouteKey === "reflections"
              ? "reflections"
              : "today"
        }
        onSelect={(key) => {
          if (key === "capture") {
            router.push("/capture");
            return;
          }
          if (key === "reflections") {
            router.replace("/reflections");
            return;
          }
          router.replace("/(tabs)");
        }}
      />

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey={menuRouteKey}
        onRequestClose={() => setMenuVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.page,
    paddingTop: spacing.page,
    gap: spacing.section,
    paddingBottom: spacing.xxxl + spacing.xxl + spacing.xxl,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  detailHero: {
    paddingHorizontal: spacing.page,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  processedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  processedDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
  },
  insightBlock: {
    borderRadius: radius.xl,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 2,
    gap: spacing.xs,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  insightLabel: {
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  insightText: {
    fontStyle: "italic",
  },
  keyPointsBlock: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  keyPointsList: {
    gap: spacing.md,
  },
  keyPointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    marginTop: 9,
  },
  keyPointText: {
    flex: 1,
  },
  momentsBlock: {
    marginBottom: spacing.md,
  },
  bottomActionWrap: {
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  reflectionCardsBlock: {
    gap: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
