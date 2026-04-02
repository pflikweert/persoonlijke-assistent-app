import { Stack, router, useFocusEffect, useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ScreenHeader } from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProcessingScreen } from '@/components/feedback/processing-screen';
import { FullscreenMenuOverlay, type MainMenuRouteKey } from '@/components/navigation/fullscreen-menu-overlay';
import { QuickMenuBar, quickMenuPathFromKey } from '@/components/navigation/quick-menu-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  MetaText,
  StateBlock,
} from '@/components/ui/screen-primitives';
import {
  deleteNormalizedEntryById,
  fetchDayJournalByDate,
  fetchNormalizedEntriesByDate,
  generateReflection,
  getUtcTodayDate,
  isValidJournalDate,
  parseJournalSections,
  regenerateDayJournalByDate,
  updateNormalizedEntryById,
} from '@/services';
import { colorTokens, radius, spacing } from '@/theme';

type RouteParams = {
  date?: string | string[];
  processed?: string | string[];
  entryId?: string | string[];
};

function resolveRouteDate(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function formatLongDate(value: string): string {
  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value || '-';
  }

  return parsed.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function cleanMomentPreview(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
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
    return 'Dag';
  }

  const diffDays = Math.round((today - target) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return 'Vandaag';
  }
  if (diffDays === 1) {
    return 'Gisteren';
  }

  const weekday = new Date(target).toLocaleDateString('nl-NL', {
    weekday: 'long',
    timeZone: 'UTC',
  });
  return capitalizeFirst(weekday);
}

function buildInsight(summary: string | null, narrativeText: string | null, sections: string[]): string | null {
  const firstSection = sections.find((section) => section.trim().length > 0)?.trim() ?? '';
  const firstSentence =
    (narrativeText ?? '').split(/[.!?]/)[0]?.trim() ?? (summary ?? '').split(/[.!?]/)[0]?.trim() ?? '';

  if (firstSection.length >= 10) {
    return `Opvallend vandaag: ${firstSection}.`;
  }

  if (firstSentence.length >= 36) {
    return firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`;
  }

  return null;
}

function blurActiveElementOnWeb() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  const active = document.activeElement as HTMLElement | null;
  active?.blur?.();
}

export default function DayDetailScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const navigationState = useRootNavigationState();
  const { date, processed, entryId } = useLocalSearchParams<RouteParams>();
  const journalDate = useMemo(() => resolveRouteDate(date), [date]);
  const targetEntryId = useMemo(() => resolveRouteDate(entryId), [entryId]);
  const showProcessedBanner = useMemo(() => {
    const value = resolveRouteDate(processed);
    return value === '1' || value.toLowerCase() === 'true';
  }, [processed]);

  type DayEntry = Awaited<ReturnType<typeof fetchNormalizedEntriesByDate>>[number];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [narrativeText, setNarrativeText] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [entryOffsets, setEntryOffsets] = useState<Record<string, number>>({});
  const [focusedEntryId, setFocusedEntryId] = useState<string | null>(null);
  const [pendingFocusEntryId, setPendingFocusEntryId] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<DayEntry | null>(null);
  const [editBody, setEditBody] = useState('');
  const [mutationBusy, setMutationBusy] = useState(false);
  const [showEditProcessing, setShowEditProcessing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDay = useCallback(async () => {
    if (!isValidJournalDate(journalDate)) {
      setLoading(false);
      setError('Ongeldige datum in route.');
      setSummary(null);
      setNarrativeText(null);
      setSections([]);
      setEntries([]);
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
      setNarrativeText(journal?.narrative_text?.trim() ? journal.narrative_text : journal?.summary?.trim() || null);
      setSections(journal ? parseJournalSections(journal.sections) : []);
      setEntryOffsets({});
      setEntries(normalizedEntries);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon dagdetail niet laden.';
      setError(message);
      setSummary(null);
      setNarrativeText(null);
      setSections([]);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [journalDate]);

  useFocusEffect(
    useCallback(() => {
      loadDay();
    }, [loadDay])
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

  const previewSections = sections.slice(0, 4);
  const readableDate = useMemo(() => formatLongDate(journalDate), [journalDate]);
  const dayHeading = useMemo(() => getDayHeadingLabel(journalDate), [journalDate]);
  const insightText = useMemo(
    () => buildInsight(summary, narrativeText, sections),
    [sections, summary, narrativeText]
  );
  const visibleEntries = useMemo(
    () =>
      entries
        .map((entry) => ({
          ...entry,
          body: cleanMomentPreview(entry.body ?? ''),
          summary_short: cleanMomentPreview(entry.summary_short ?? ''),
        }))
        .sort((left, right) => {
          const leftTime = new Date(left.captured_at).getTime();
          const rightTime = new Date(right.captured_at).getTime();
          return rightTime - leftTime;
        }),
    [entries]
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

    if (previousRoute?.name !== '(tabs)') {
      return null;
    }

    const tabState = previousRoute.state;
    if (!tabState || typeof tabState.index !== 'number' || !Array.isArray(tabState.routes)) {
      return null;
    }

    return tabState.routes[tabState.index]?.name ?? null;
  }, [navigationState]);
  const menuRouteKey = useMemo<MainMenuRouteKey>(() => {
    if (previousTabName === 'days') {
      return 'days';
    }
    if (previousTabName === 'reflections') {
      return 'reflections';
    }
    if (previousTabName === 'capture') {
      return 'capture';
    }

    return 'today';
  }, [previousTabName]);
  const showInlineEntryActions = false;

  useEffect(() => {
    if (!pendingFocusEntryId || loading || Boolean(error)) {
      return;
    }

    const targetExists = visibleEntries.some((entry) => entry.id === pendingFocusEntryId);
    if (!targetExists) {
      setPendingFocusEntryId(null);
      return;
    }

    const targetOffset = entryOffsets[pendingFocusEntryId];
    if (typeof targetOffset !== 'number') {
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
      setFocusedEntryId((current) => (current === pendingFocusEntryId ? null : current));
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

  function formatTime(isoValue: string): string {
    const date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) {
      return '--:--';
    }
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  }

  function openEditModal(entry: DayEntry) {
    if (mutationBusy) {
      return;
    }
    setEditingEntry(entry);
    setEditBody(entry.body ?? '');
  }

  function closeEditModal() {
    if (mutationBusy) {
      return;
    }
    blurActiveElementOnWeb();
    setEditingEntry(null);
    setEditBody('');
  }

  function forceCloseEditModal() {
    blurActiveElementOnWeb();
    setEditingEntry(null);
    setEditBody('');
  }

  async function refreshDerivedContentAfterEntryMutation(): Promise<string | null> {
    if (!isValidJournalDate(journalDate)) {
      return null;
    }

    await regenerateDayJournalByDate(journalDate);
    let reflectionRefreshError: string | null = null;

    // Keep daydetail consistent even when reflection refresh fails.
    try {
      await generateReflection({
        periodType: 'week',
        anchorDate: journalDate,
        forceRegenerate: true,
      });
      await generateReflection({
        periodType: 'month',
        anchorDate: journalDate,
        forceRegenerate: true,
      });
    } catch (nextError) {
      reflectionRefreshError =
        nextError instanceof Error ? nextError.message : 'Reflecties konden niet direct worden bijgewerkt.';
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
      const reflectionRefreshError = await refreshDerivedContentAfterEntryMutation();
      forceCloseEditModal();
      if (reflectionRefreshError) {
        Alert.alert(
          'Wijziging opgeslagen',
          `Dagdetail is bijgewerkt, maar reflecties konden niet direct worden vernieuwd.\n\n${reflectionRefreshError}`
        );
      }
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon entry niet bijwerken.';
      Alert.alert('Bewerken mislukt', message);
    } finally {
      setMutationBusy(false);
      setShowEditProcessing(false);
    }
  }

  function handleDeleteEntry(id: string) {
    if (mutationBusy) {
      return;
    }

    Alert.alert('Moment verwijderen?', 'Weet je zeker dat je dit individuele moment wilt verwijderen?', [
      { text: 'Annuleer', style: 'cancel' },
      {
        text: 'Verwijderen',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setMutationBusy(true);
            try {
              await deleteNormalizedEntryById(id);
              const reflectionRefreshError = await refreshDerivedContentAfterEntryMutation();
              if (reflectionRefreshError) {
                Alert.alert(
                  'Moment verwijderd',
                  `Dagdetail is bijgewerkt, maar reflecties konden niet direct worden vernieuwd.\n\n${reflectionRefreshError}`
                );
              }
            } catch (nextError) {
              const message =
                nextError instanceof Error ? nextError.message : 'Kon entry niet verwijderen.';
              Alert.alert('Verwijderen mislukt', message);
            } finally {
              setMutationBusy(false);
            }
          })();
        },
      },
    ]);
  }

  function handleBackPress() {
    const fromCapture = showProcessedBanner || previousTabName === 'capture';
    if (fromCapture) {
      router.replace('/(tabs)');
      return;
    }

    const cameFromValidMain = previousTabName === 'index' || previousTabName === 'days' || previousTabName === 'reflections';
    if (cameFromValidMain && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)');
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: palette.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader
        title={dayHeading}
        subtitle={readableDate}
        leftAction={
          <Pressable onPress={handleBackPress} style={[styles.topBarIconButton, { backgroundColor: palette.surfaceLow }]}>
            <MaterialIcons name="arrow-back" size={18} color={palette.mutedSoft} />
          </Pressable>
        }
        rightAction={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => setMenuVisible(true)}
            style={[styles.topBarIconButton, { backgroundColor: palette.surfaceLow }]}>
            <MaterialIcons name="menu" size={20} color={palette.primary} />
          </Pressable>
        }
      />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>

      {showProcessedBanner ? (
        <ThemedView style={styles.processedRow}>
          <ThemedView style={[styles.processedDot, { backgroundColor: palette.success }]} />
          <ThemedText type="caption" style={[styles.processedText, { color: palette.mutedSoft }]}>
            Entry verwerkt
          </ThemedText>
        </ThemedView>
      ) : null}

      {loading ? (
        <StateBlock tone="loading" message="Dagdetail laden..." detail="Even geduld, we halen de dag op." />
      ) : null}
      {!loading && error ? (
        <StateBlock tone="error" message="Dagdetail kon niet geladen worden." detail={error} />
      ) : null}

      {!loading && !error && !summary && visibleEntries.length === 0 ? (
        <StateBlock
          tone="empty"
          message="Geen inhoud gevonden voor deze dag."
          detail="Leg een notitie vast om deze dag te vullen."
        />
      ) : null}

      {!loading && !error && summary ? (
        <ThemedView style={styles.summaryBlock}>
          <MetaText>Samenvatting</MetaText>
          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
            {summary}
          </ThemedText>
        </ThemedView>
      ) : null}

      {!loading && !error && narrativeText ? (
        <ThemedView
          lightColor={colorTokens.light.surfaceLow}
          darkColor={colorTokens.dark.surfaceLow}
          style={[styles.heroVisual, { borderColor: palette.separator }]}>
          <MaterialIcons name="auto-awesome" size={20} color={palette.primary} />
        </ThemedView>
      ) : null}

      {!loading && !error && narrativeText ? (
        <ThemedText type="body" style={[styles.editorialBody, { color: palette.text }]}>
          {narrativeText}
        </ThemedText>
      ) : null}

      {!loading && !error && insightText ? (
        <ThemedView
          lightColor="transparent"
          darkColor="transparent"
          style={[styles.insightBlock, { borderLeftColor: palette.primary }]}>
          <ThemedView style={styles.insightHeader}>
            <MaterialIcons name="auto-awesome" size={14} color={palette.primary} />
            <ThemedText type="caption" style={[styles.insightLabel, { color: palette.primary }]}>
              INZICHT
            </ThemedText>
          </ThemedView>
          <ThemedText type="bodySecondary" style={[styles.insightText, { color: palette.muted }]}>
            {insightText}
          </ThemedText>
        </ThemedView>
      ) : null}

      {!loading && !error && previewSections.length > 0 ? (
        <ThemedView
          lightColor="transparent"
          darkColor="transparent"
          style={styles.keyPointsBlock}>
          <ThemedText type="meta" style={[styles.blockLabel, { color: palette.primary }]}>
            Kernpunten
          </ThemedText>
          <ThemedView style={styles.keyPointsList}>
            {previewSections.map((section, index) => (
              <ThemedView key={`${section}-${index}`} style={styles.keyPointRow}>
                <ThemedView style={[styles.dot, { backgroundColor: palette.primaryStrong }]} />
                <ThemedText type="bodySecondary" style={styles.keyPointText}>
                  {section}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      ) : null}

      {!loading && !error && visibleEntries.length > 0 ? (
        <ThemedView style={styles.momentsBlock}>
          <ThemedText type="meta" style={[styles.blockLabelMuted, { color: palette.mutedSoft }]}>
            Individuele momenten
          </ThemedText>
          <ThemedView style={styles.entriesList}>
            {visibleEntries.map((entry) => (
              <ThemedView
                key={entry.id}
                onLayout={(event) => handleEntryLayout(entry.id, event.nativeEvent.layout.y)}
                lightColor="transparent"
                darkColor="transparent"
                style={[
                  styles.entryItem,
                  { borderBottomColor: palette.separator },
                  focusedEntryId === entry.id ? styles.entryFocused : null,
                  focusedEntryId === entry.id ? { backgroundColor: palette.surfaceLow, borderColor: palette.primary } : null,
                ]}>
                <ThemedView style={styles.entryHead}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/entry/[id]',
                        params: { id: entry.id, source: 'day', date: journalDate },
                      })
                    }
                    disabled={mutationBusy}
                    style={styles.entryContentTap}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1} style={[styles.entryTitle, { color: palette.text }]}>
                      {entry.title?.trim() || 'Moment zonder titel'}
                    </ThemedText>
                    <ThemedView style={styles.entryMeta}>
                      <MaterialIcons
                        name={entry.source_type === 'audio' ? 'mic' : 'edit-note'}
                        size={14}
                        color={palette.primary}
                      />
                      <ThemedText type="caption" style={[styles.entryType, { color: palette.mutedSoft }]}>
                        {entry.source_type === 'audio' ? 'Audio' : 'Tekst'}
                      </ThemedText>
                      <ThemedText type="caption" style={[styles.entryTime, { color: palette.mutedSoft }]}>
                        • {formatTime(entry.captured_at)}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText type="bodySecondary" numberOfLines={3} style={[styles.entryPreview, { color: palette.muted }]}>
                      {entry.summary_short || entry.body}
                    </ThemedText>
                  </Pressable>

                  {showInlineEntryActions ? (
                    <ThemedView style={styles.entryActions}>
                      <Pressable onPress={() => openEditModal(entry)} disabled={mutationBusy} style={styles.iconAction}>
                        <MaterialIcons name="edit" size={15} color={palette.mutedSoft} />
                      </Pressable>
                      <Pressable onPress={() => handleDeleteEntry(entry.id)} disabled={mutationBusy} style={styles.iconAction}>
                        <MaterialIcons name="delete-outline" size={15} color={palette.mutedSoft} />
                      </Pressable>
                    </ThemedView>
                  ) : null}
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      ) : null}

      <Modal visible={Boolean(editingEntry)} animationType="slide" onRequestClose={closeEditModal}>
        <ThemedView lightColor={colorTokens.light.background} darkColor={colorTokens.dark.background} style={styles.modalScreen}>
          <ThemedView style={styles.modalTopBar}>
            <Pressable onPress={closeEditModal} disabled={mutationBusy} style={styles.modalTopAction}>
              <ThemedText type="bodySecondary">Annuleer</ThemedText>
            </Pressable>
            <ThemedText type="sectionTitle">Moment bewerken</ThemedText>
            <Pressable
              onPress={() => void handleSaveEdit()}
              disabled={mutationBusy}
              style={[styles.modalTopAction, styles.modalTopActionPrimary, { backgroundColor: palette.primaryStrong }]}>
              <ThemedText type="defaultSemiBold" lightColor={colorTokens.light.primaryOn} darkColor={colorTokens.dark.primaryOn}>
                {mutationBusy ? 'Opslaan...' : 'Opslaan'}
              </ThemedText>
            </Pressable>
          </ThemedView>

          <TextInput
            multiline
            autoFocus
            value={editBody}
            onChangeText={setEditBody}
            textAlignVertical="top"
            style={[
              styles.modalInputFull,
              {
                color: palette.text,
                backgroundColor: `${palette.surfaceLowest}D6`,
                borderColor: `${palette.separator}CC`,
              },
            ]}
            placeholder="Typ de inhoud van dit moment..."
            placeholderTextColor={palette.mutedSoft}
          />
          <ProcessingScreen visible={showEditProcessing} variant="entry-edit" />
        </ThemedView>
      </Modal>

      <ThemedView style={styles.bottomActionWrap}>
        <Pressable onPress={() => router.push('/capture')} style={styles.bottomAction}>
          <ThemedText type="caption" style={[styles.bottomActionText, { color: palette.mutedSoft }]}>
            Nieuwe entry vastleggen
          </ThemedText>
        </Pressable>
      </ThemedView>

      </ScrollView>

      <QuickMenuBar
        activeKey={menuRouteKey}
        onSelect={(key) => {
          const targetPath = quickMenuPathFromKey(key);
          if (targetPath === '/capture') {
            router.push('/capture');
            return;
          }
          router.replace(targetPath);
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
    gap: spacing.section,
    paddingBottom: spacing.xxxl + spacing.xxl + spacing.xxl,
  },
  topBarIconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  processedDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
  },
  processedText: {
  },
  summaryBlock: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  heroVisual: {
    borderRadius: 32,
    minHeight: 152,
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editorialBody: {
    fontSize: 20,
    lineHeight: 34,
    marginBottom: spacing.xl,
    letterSpacing: -0.2,
  },
  insightBlock: {
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
    borderLeftWidth: 2,
    gap: spacing.xs,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  insightLabel: {
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  insightText: {
    fontStyle: 'italic',
  },
  keyPointsBlock: {
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  blockLabel: {
  },
  blockLabelMuted: {
    marginLeft: spacing.xs,
  },
  keyPointsList: {
    gap: spacing.md,
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  entriesList: {
    gap: spacing.xs,
  },
  entryItem: {
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    gap: spacing.inline,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  entryFocused: {
    borderWidth: 1,
  },
  entryHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  entryContentTap: {
    flex: 1,
    gap: spacing.xs,
  },
  entryTitle: {
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  entryType: {
  },
  entryTime: {
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 1,
  },
  iconAction: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  entryPreview: {
    lineHeight: 23,
  },
  modalScreen: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.page,
    paddingBottom: spacing.page,
    gap: spacing.md,
  },
  modalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    minHeight: 40,
  },
  modalTopAction: {
    minWidth: 84,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  modalTopActionPrimary: {
    alignItems: 'center',
  },
  modalInputFull: {
    flex: 1,
    minHeight: 340,
    fontSize: 24,
    lineHeight: 34,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    textAlign: 'left',
  },
  bottomActionWrap: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  bottomAction: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  bottomActionText: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
