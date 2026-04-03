import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  StateBlock,
} from '@/components/ui/screen-primitives';
import {
  fetchLatestReflection,
  fetchRecentDayJournals,
  fetchRecentNormalizedEntries,
  fetchTodayJournal,
  getUtcTodayDate,
  parseJsonStringArray,
} from '@/services';
import { colorTokens, radius, spacing, typography } from '@/theme';

export default function TodayScreen() {
  const scheme = useColorScheme() ?? 'light';
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
  const [latestWeekReflection, setLatestWeekReflection] = useState<
    Awaited<ReturnType<typeof fetchLatestReflection>>
  >(null);
  const [latestMonthReflection, setLatestMonthReflection] = useState<
    Awaited<ReturnType<typeof fetchLatestReflection>>
  >(null);
  const todayDate = getUtcTodayDate();

  const loadToday = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [journal, recent, recentDayRows, weekReflection, monthReflection] = await Promise.all([
        fetchTodayJournal(todayDate),
        fetchRecentNormalizedEntries(5),
        fetchRecentDayJournals({ limit: 14 }),
        fetchLatestReflection('week'),
        fetchLatestReflection('month'),
      ]);
      setSummary(journal?.summary?.trim() ? journal.summary : null);
      setRecentEntries(recent);
      setRecentJournals(recentDayRows);
      setLatestWeekReflection(weekReflection);
      setLatestMonthReflection(monthReflection);
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'Kon vandaag niet laden.';
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
    }, [loadToday])
  );

  const todayEntries = useMemo(
    () => recentEntries.filter((entry) => entry.journal_date === todayDate),
    [recentEntries, todayDate]
  );
  const latestPreviousJournal = useMemo(
    () =>
      recentJournals.find(
        (journal) => journal.journal_date !== todayDate && Boolean(journal.summary?.trim())
      ) ?? null,
    [recentJournals, todayDate]
  );

  const formattedDate = formatLongDate(todayDate);
  const hasUsableTodaySummary = useMemo(() => isUsableTodaySummary(summary), [summary]);
  const statusLine = loading
    ? 'Wordt bijgewerkt'
    : error
      ? 'Update tijdelijk niet beschikbaar'
      : hasUsableTodaySummary || todayEntries.length > 0
        ? 'Vandaag bijgewerkt'
        : 'Klaar voor je eerste entry';
  const weekTeaser = useMemo(
    () => buildReflectionTeaser(latestWeekReflection),
    [latestWeekReflection]
  );
  const monthTeaser = useMemo(
    () => buildReflectionTeaser(latestMonthReflection),
    [latestMonthReflection]
  );

  return (
    <ScreenContainer
      scrollable
      style={styles.screen}
      fixedHeader={
        <ScreenHeader
          title="Vandaag"
          subtitle={formattedDate}
          rightAction={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              onPress={() => setMenuVisible(true)}
              style={[styles.menuButton, { backgroundColor: palette.surfaceLow }]}>
              <MaterialIcons name="menu" size={20} color={palette.primary} />
            </Pressable>
          }
        />
      }
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.hero}>
        <ThemedText type="screenTitle" style={styles.heroTitle}>
          Leg iets vast
        </ThemedText>
        <ThemedText type="bodySecondary" style={[styles.heroCopy, { color: palette.muted }]}>
          Spreek iets in of schrijf iets op voor je dagboek.
        </ThemedText>
        <ThemedView style={styles.heroCtaWrap}>
          <PrimaryButton label="Spreek of schrijf iets" onPress={() => router.push('/capture')} />
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
          <ThemedText type="caption" style={[styles.statusText, { color: palette.mutedSoft }]} numberOfLines={1}>
            {statusLine}
          </ThemedText>
        </ThemedView>
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
      {!loading && !error && !hasUsableTodaySummary ? (
        <ThemedView style={styles.dayEditorialBlock}>
          <ThemedText type="bodySecondary" style={[styles.dayOpeningText, { color: palette.muted }]}>
            {'"Je dag is nog een leeg canvas. Er is ruimte voor de kleine dingen die later betekenis krijgen."'}
          </ThemedText>
        </ThemedView>
      ) : null}

      {!loading && !error && hasUsableTodaySummary ? (
        <Pressable onPress={() => router.push(`/day/${todayDate}`)}>
          <ThemedView style={styles.dayEditorialBlock}>
            <ThemedText
              type="bodySecondary"
              style={[styles.dayOpeningText, { color: palette.muted }]}
              numberOfLines={4}>
              {summary?.trim()}
            </ThemedText>
          </ThemedView>
        </Pressable>
      ) : null}

      {!loading && !error && todayEntries.length > 0 ? (
        <ThemedView style={styles.recentBlock}>
          <ThemedView style={styles.recentHeader}>
            <MetaText>Recent moments</MetaText>
            <MetaText>Vandaag</MetaText>
          </ThemedView>
          <ThemedView style={styles.timelineList}>
            {todayEntries.map((entry, index) => (
              <Pressable
                key={entry.id}
                onPress={() =>
                  router.push({
                    pathname: '/entry/[id]',
                    params: { id: entry.id, source: 'today', date: entry.journal_date },
                  })
                }
                style={styles.timelineRow}>
                <ThemedView style={styles.timelineTimeCol}>
                  <ThemedText type="caption" style={[styles.timelineTimeText, { color: palette.mutedSoft }]}>
                    {formatTime(entry.captured_at)}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.timelineTrackCol}>
                  <ThemedView style={[styles.timelineDot, { backgroundColor: palette.primary }]} />
                  {index < todayEntries.length - 1 ? (
                    <ThemedView style={[styles.timelineLine, { backgroundColor: `${palette.separator}88` }]} />
                  ) : null}
                </ThemedView>
                <ThemedView style={styles.timelineContentCol}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ color: palette.text }}>
                    {entry.title?.trim() || 'Moment zonder titel'}
                  </ThemedText>
                  <ThemedText type="bodySecondary" numberOfLines={2} style={{ color: palette.muted }}>
                    {entry.summary_short?.trim() || summarizeSnippet(entry.body)}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>
      ) : null}

      {!loading && !error && todayEntries.length === 0 && latestPreviousJournal ? (
        <Pressable onPress={() => router.push(`/day/${latestPreviousJournal.journal_date}`)}>
          <ThemedView style={styles.previousSummaryBlock}>
            <MetaText>Laatste dag · {formatShortDate(latestPreviousJournal.journal_date)}</MetaText>
            <ThemedText type="bodySecondary" style={[styles.compactText, { color: palette.muted }]} numberOfLines={3}>
              {latestPreviousJournal.summary}
            </ThemedText>
          </ThemedView>
        </Pressable>
      ) : null}

      {!loading && !error ? (
        <ThemedView style={styles.reflectTeaserBlock}>
          <MetaText>Reflecties</MetaText>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(tabs)/reflections',
                params: { period: 'week' },
              })
            }
            style={[styles.reflectTeaserItem, { borderTopColor: `${palette.separator}88` }]}>
            <ThemedText type="defaultSemiBold">Wekelijkse reflectie</ThemedText>
            <ThemedText type="bodySecondary" numberOfLines={2} style={{ color: palette.muted }}>
              {weekTeaser}
            </ThemedText>
            <ThemedText type="caption" style={[styles.reflectTeaserCta, { color: palette.primary }]}>
              Lees volledig inzicht
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/(tabs)/reflections',
                params: { period: 'month' },
              })
            }
            style={[styles.reflectTeaserItem, { borderTopColor: `${palette.separator}88` }]}>
            <ThemedText type="defaultSemiBold">Maandelijkse reflectie</ThemedText>
            <ThemedText type="bodySecondary" numberOfLines={2} style={{ color: palette.muted }}>
              {monthTeaser}
            </ThemedText>
            <ThemedText type="caption" style={[styles.reflectTeaserCta, { color: palette.primary }]}>
              Lees volledig inzicht
            </ThemedText>
          </Pressable>
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

function formatLongDate(utcDate: string): string {
  const parsed = new Date(`${utcDate}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return utcDate;
  }

  return parsed.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function summarizeSnippet(value: string): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) {
    return 'Geen korte samenvatting beschikbaar.';
  }

  return clean.length > 96 ? `${clean.slice(0, 95).trimEnd()}...` : clean;
}

function formatShortDate(utcDate: string): string {
  const parsed = new Date(`${utcDate}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return utcDate;
  }

  return parsed.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function buildReflectionTeaser(
  reflection: Awaited<ReturnType<typeof fetchLatestReflection>>
): string {
  if (!reflection) {
    return 'Nog geen reflectie beschikbaar.';
  }

  const summary = reflection.summary_text?.trim() ?? '';
  if (summary.length > 0) {
    return summarizeSnippet(summary);
  }

  const firstHighlight = parseJsonStringArray(reflection.highlights_json)[0]?.trim() ?? '';
  if (firstHighlight) {
    return summarizeSnippet(firstHighlight);
  }

  const firstPoint = parseJsonStringArray(reflection.reflection_points_json)[0]?.trim() ?? '';
  if (firstPoint) {
    return summarizeSnippet(firstPoint);
  }

  return 'Nog geen reflectie beschikbaar.';
}

function isUsableTodaySummary(value: string | null): boolean {
  const clean = value?.trim() ?? '';
  if (!clean) {
    return false;
  }

  const normalized = clean.toLowerCase();
  if (
    normalized === 'nog geen bruikbare notitie voor deze dag.' ||
    normalized === 'nog geen bruikbare notities voor deze dag.'
  ) {
    return false;
  }

  return true;
}

function formatTime(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.xl,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingTop: spacing.xs,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.45,
    textAlign: 'center',
  },
  heroCopy: {
    textAlign: 'center',
  },
  heroCtaWrap: {
    width: '100%',
    paddingTop: 32,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.inline,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
  },
  statusText: {
    textTransform: 'none',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  compactBlock: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  reflectionBlock: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  compactText: {
    lineHeight: typography.roles.bodySecondary.lineHeight + 1,
  },
  dayEditorialBlock: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  dayOpeningText: {
    fontSize: 31,
    lineHeight: 40,
    letterSpacing: -0.35,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  recentBlock: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineList: {
    gap: spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    minHeight: 72,
  },
  timelineTimeCol: {
    width: 52,
    alignItems: 'flex-end',
    paddingTop: 2,
  },
  timelineTimeText: {
    letterSpacing: 0.2,
  },
  timelineTrackCol: {
    width: 14,
    alignItems: 'center',
    paddingTop: 3,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  timelineLine: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: spacing.xs,
  },
  timelineContentCol: {
    flex: 1,
    gap: spacing.xxs,
    paddingBottom: spacing.md,
  },
  previousSummaryBlock: {
    marginTop: spacing.sm,
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  reflectTeaserBlock: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  reflectTeaserItem: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  reflectTeaserCta: {
    letterSpacing: 0.1,
    textTransform: 'none',
  },
});
