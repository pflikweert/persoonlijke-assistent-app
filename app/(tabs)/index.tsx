import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  StateBlock,
} from '@/components/ui/screen-primitives';
import { fetchTodayJournal, getUtcTodayDate, parseJournalSections } from '@/services';
import { colorTokens, radius, shadows, spacing, typography } from '@/theme';

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

  const recentPreview = sections.slice(0, 3);
  const reflectionPreview = summary ? summary.split('. ')[0]?.trim() ?? summary : null;
  const dayLabel = formatDayLabel(todayDate);
  const statusLine = loading
    ? 'Wordt bijgewerkt'
    : error
      ? 'Update tijdelijk niet beschikbaar'
      : summary || sections.length > 0
        ? 'Vandaag bijgewerkt'
        : 'Klaar voor je eerste entry';

  return (
    <ScreenContainer
      scrollable
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.topBar}>
        <ThemedView lightColor={colorTokens.light.surfaceLow} darkColor={colorTokens.dark.surfaceLow} style={styles.avatar}>
          <ThemedText type="caption" style={styles.avatarText}>
            IK
          </ThemedText>
        </ThemedView>
        <ThemedText type="sectionTitle">Vandaag</ThemedText>
        <ThemedView lightColor={colorTokens.light.surfaceLow} darkColor={colorTokens.dark.surfaceLow} style={styles.topAction}>
          <IconSymbol size={18} name="bell" color={colorTokens.light.mutedSoft} />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.hero}>
        <MetaText>PERSOONLIJKE RUIMTE</MetaText>
        <ThemedText type="screenTitle" style={styles.heroTitle}>
          Vandaag
        </ThemedText>
        <PrimaryButton label="Nieuwe entry" onPress={() => router.push('/capture')} />
        <ThemedView style={styles.statusRow}>
          <ThemedView
            style={[
              styles.statusDot,
              loading
                ? styles.statusDotLoading
                : error
                  ? styles.statusDotError
                  : styles.statusDotReady,
            ]}
          />
          <ThemedText type="caption" style={styles.statusText}>
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
          style={styles.insightBlock}>
          <ThemedText type="bodySecondary" style={styles.italicText}>
            {`"${reflectionPreview}"`}
          </ThemedText>
          <MetaText>PERSOONLIJK INZICHT</MetaText>
        </ThemedView>
      ) : null}

      {!loading && !error && recentPreview.length > 0 ? (
        <ThemedView style={styles.recentBlock}>
          <MetaText>RECENT</MetaText>
          <ThemedView style={styles.recentList}>
            {recentPreview.map((point, index) => (
              <ThemedView key={`${point}-${index}`} style={styles.recentRow}>
                <ThemedText type="meta" style={styles.recentDateLabel}>
                  {dayLabel}
                </ThemedText>
                <ThemedText type="bodySecondary" numberOfLines={1} style={styles.recentText}>
                  {point}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      ) : null}

      {!loading && !error && !reflectionPreview && recentPreview.length === 0 ? (
        <ThemedView lightColor={colorTokens.light.surfaceLow} darkColor={colorTokens.dark.surfaceLow} style={styles.fallbackBlock}>
          <ThemedText type="bodySecondary">
            Zodra je iets vastlegt, verschijnt hier een rustig overzicht van vandaag.
          </ThemedText>
        </ThemedView>
      ) : null}
    </ScreenContainer>
  );
}

function formatDayLabel(utcDate: string): string {
  const [year, month, day] = utcDate.split('-');
  if (!year || !month || !day) {
    return 'VANDAAG';
  }
  return `${day}.${month}`;
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    letterSpacing: 0.6,
  },
  topAction: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1.1,
    textAlign: 'center',
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
  statusDotReady: {
    backgroundColor: colorTokens.light.success,
  },
  statusDotLoading: {
    backgroundColor: colorTokens.light.mutedSoft,
  },
  statusDotError: {
    backgroundColor: colorTokens.light.error,
  },
  statusText: {
    color: colorTokens.light.mutedSoft,
    textTransform: 'none',
    letterSpacing: 0.2,
  },
  insightBlock: {
    borderLeftWidth: 2,
    borderLeftColor: `${colorTokens.light.primary}33`,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  italicText: {
    fontStyle: 'italic',
    lineHeight: typography.roles.body.lineHeight + 2,
  },
  recentBlock: {
    gap: spacing.md,
  },
  recentList: {
    gap: spacing.sm,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${colorTokens.light.separator}AA`,
  },
  recentDateLabel: {
    width: 56,
    color: colorTokens.light.primary,
  },
  recentText: {
    flex: 1,
  },
  fallbackBlock: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    ...shadows.surface,
  },
});
