import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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

  const reflectionPreview = summary ? summary.split('. ')[0]?.trim() ?? summary : null;
  const formattedDate = formatLongDate(todayDate);
  const statusLine = loading
    ? 'Wordt bijgewerkt'
    : error
      ? 'Update tijdelijk niet beschikbaar'
      : summary || recentEntries.length > 0
        ? 'Vandaag bijgewerkt'
        : 'Klaar voor je eerste entry';

  return (
    <ScreenContainer
      scrollable
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.topBar}>
        <ThemedView style={styles.topBarCopy}>
          <ThemedText type="sectionTitle">Vandaag</ThemedText>
          <MetaText>{formattedDate}</MetaText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.hero}>
        <MetaText>START</MetaText>
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
        <StateBlock
          tone="empty"
          message="Er is nog geen dagjournal voor vandaag."
          detail="Leg je eerste notitie vast om je dag op te bouwen."
        />
      ) : null}

      {!loading && !error && reflectionPreview ? (
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surfaceLow}
          style={[styles.compactBlock, styles.reflectionBlock]}>
          <MetaText>Reflectie</MetaText>
          <ThemedText type="bodySecondary" style={[styles.compactText, { color: palette.muted }]} numberOfLines={2}>
            {reflectionPreview}
          </ThemedText>
        </ThemedView>
      ) : null}

      {!loading && !error && recentEntries.length > 0 ? (
        <ThemedView style={styles.recentBlock}>
          <MetaText>Recent</MetaText>
          <ThemedView style={styles.recentList}>
            {recentEntries.map((entry) => (
              <Pressable
                key={entry.id}
                onPress={() =>
                  router.push({
                    pathname: '/day/[date]',
                    params: { date: entry.journal_date, entryId: entry.id },
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
                    {formatRecentMeta(entry.journal_date, entry.captured_at)}
                  </ThemedText>
                  <ThemedText
                    type="bodySecondary"
                    numberOfLines={1}
                    style={[styles.recentText, { color: palette.muted }]}>
                    {summarizeSnippet(entry.body)}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>
          <Pressable onPress={() => router.push(`/day/${todayDate}`)} style={styles.secondaryLink}>
            <ThemedText type="caption" style={[styles.secondaryLinkText, { color: palette.primary }]}>
              Bekijk vandaag
            </ThemedText>
          </Pressable>
        </ThemedView>
      ) : null}

      {!loading && !error && !reflectionPreview && recentEntries.length === 0 ? (
        <ThemedView style={styles.compactBlock}>
          <ThemedText type="bodySecondary" style={[styles.compactText, { color: palette.muted }]}>
            Zodra je iets vastlegt, verschijnt hier een rustig overzicht van vandaag.
          </ThemedText>
        </ThemedView>
      ) : null}
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

function formatRecentMeta(journalDate: string, capturedAt: string): string {
  const [year, month, day] = journalDate.split('-');
  if (!year || !month || !day) {
    return formatTime(capturedAt);
  }
  return `${day}.${month} · ${formatTime(capturedAt)}`;
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    marginBottom: spacing.xs,
  },
  topBarCopy: {
    gap: spacing.xxs,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
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
    marginTop: spacing.xs,
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
  recentBlock: {
    gap: spacing.sm,
  },
  recentList: {
    gap: spacing.md,
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
