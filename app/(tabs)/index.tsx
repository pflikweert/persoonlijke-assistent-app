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
  fetchRecentNormalizedEntries,
  fetchTodayJournal,
  getUtcTodayDate,
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
  const todayDate = getUtcTodayDate();

  const loadToday = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [journal, recent] = await Promise.all([
        fetchTodayJournal(todayDate),
        fetchRecentNormalizedEntries(5),
      ]);
      setSummary(journal?.summary?.trim() ? journal.summary : null);
      setRecentEntries(recent);
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'Kon vandaag niet laden.';
      setError(message);
      setSummary(null);
      setRecentEntries([]);
    } finally {
      setLoading(false);
    }
  }, [todayDate]);

  useFocusEffect(
    useCallback(() => {
      loadToday();
    }, [loadToday])
  );

  const formattedDate = formatLongDate(todayDate);
  const statusLine = loading
    ? 'Wordt bijgewerkt'
    : error
      ? 'Update tijdelijk niet beschikbaar'
      : summary || recentEntries.length > 0
        ? 'Vandaag bijgewerkt'
        : 'Klaar voor je eerste entry';

  const recentGroups = useMemo(() => {
    const grouped = new Map<string, typeof recentEntries>();
    for (const entry of recentEntries) {
      const bucket = grouped.get(entry.journal_date) ?? [];
      bucket.push(entry);
      grouped.set(entry.journal_date, bucket);
    }

    return Array.from(grouped.entries()).map(([journalDate, entries]) => ({
      journalDate,
      entries,
    }));
  }, [recentEntries]);

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
      {!loading && !error && !summary ? (
        <ThemedView style={styles.dayOpeningBlock}>
          <ThemedText type="bodySecondary" style={[styles.dayOpeningText, { color: palette.muted }]}>
            Je dag is nog open. Er is ruimte voor de kleine momenten die later betekenis krijgen.
          </ThemedText>
        </ThemedView>
      ) : null}

      {!loading && !error && summary ? (
        <Pressable onPress={() => router.push(`/day/${todayDate}`)}>
          <ThemedView
            lightColor={colorTokens.light.surfaceLowest}
            darkColor={colorTokens.dark.surfaceLow}
            style={[styles.compactBlock, styles.reflectionBlock]}>
            <MetaText>Vandaag</MetaText>
            <ThemedText
              type="bodySecondary"
              style={[styles.compactText, { color: palette.muted }]}
              numberOfLines={3}>
              {summary}
            </ThemedText>
          </ThemedView>
        </Pressable>
      ) : null}

      {!loading && !error && recentEntries.length > 0 ? (
        <ThemedView style={styles.recentBlock}>
          <MetaText>Recente momenten</MetaText>
          <ThemedView style={styles.recentList}>
            {recentGroups.map((group, index) => (
              <ThemedView
                key={group.journalDate}
                style={[
                  styles.recentGroup,
                  index > 0 ? [styles.recentGroupSpaced, { borderTopColor: `${palette.separator}88` }] : null,
                ]}>
                <MetaText>{formatRecentGroupLabel(group.journalDate, todayDate)}</MetaText>
                {group.entries.map((entry) => (
                  <Pressable
                    key={entry.id}
                    onPress={() =>
                      router.push({
                        pathname: '/entry/[id]',
                        params: { id: entry.id, source: 'today', date: entry.journal_date },
                      })
                    }
                    style={[styles.recentRow, { borderBottomColor: `${palette.separator}66` }]}>
                    <ThemedView style={styles.recentMain}>
                      <ThemedText
                        type="defaultSemiBold"
                        numberOfLines={1}
                        style={[styles.recentTitle, { color: palette.text }]}>
                        {entry.title?.trim() || 'Moment zonder titel'}
                      </ThemedText>
                      <ThemedText type="caption" style={[styles.recentMeta, { color: palette.mutedSoft }]}>
                        {formatTime(entry.captured_at)}
                      </ThemedText>
                      <ThemedText
                        type="bodySecondary"
                        numberOfLines={1}
                        style={[styles.recentText, { color: palette.muted }]}>
                        {entry.summary_short?.trim() || summarizeSnippet(entry.body)}
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                ))}
              </ThemedView>
            ))}
          </ThemedView>
          <Pressable onPress={() => router.push(`/day/${todayDate}`)} style={styles.secondaryLink}>
            <ThemedText type="caption" style={[styles.secondaryLinkText, { color: palette.primary }]}>
              Bekijk vandaag
            </ThemedText>
          </Pressable>
        </ThemedView>
      ) : null}

      {!loading && !error && !summary && recentEntries.length === 0 ? (
        <ThemedView style={styles.compactBlock}>
          <ThemedText type="bodySecondary" style={[styles.compactText, { color: palette.muted }]}>
            Zodra je iets vastlegt, verschijnt hier een rustig overzicht van vandaag.
          </ThemedText>
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

function formatTime(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function formatRecentGroupLabel(journalDate: string, todayDate: string): string {
  if (journalDate === todayDate) {
    return 'Vandaag';
  }

  const parsed = new Date(`${journalDate}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return journalDate;
  }

  return parsed.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
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
    paddingBottom: 64,
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
  dayOpeningBlock: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  dayOpeningText: {
    fontSize: 23,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  recentBlock: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  recentList: {
    gap: spacing.lg,
  },
  recentGroup: {
    gap: spacing.sm,
  },
  recentGroupSpaced: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.lg,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  recentMain: {
    flex: 1,
    gap: spacing.xxs,
  },
  recentTitle: {
  },
  recentMeta: {
    letterSpacing: 0.1,
  },
  recentText: {
  },
  secondaryLink: {
    alignSelf: 'flex-start',
    paddingTop: spacing.xs,
  },
  secondaryLinkText: {
    letterSpacing: 0.2,
  },
});
