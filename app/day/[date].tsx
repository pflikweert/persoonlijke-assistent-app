import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  MetaText,
  ScreenContainer,
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

function buildInsight(summary: string | null, sections: string[]): string | null {
  const firstSection = sections.find((section) => section.trim().length > 0)?.trim() ?? '';
  const firstSentence = (summary ?? '').split(/[.!?]/)[0]?.trim() ?? '';

  if (firstSection.length >= 10) {
    return `Opvallend vandaag: ${firstSection}.`;
  }

  if (firstSentence.length >= 36) {
    return firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`;
  }

  return null;
}

export default function DayDetailScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { date, processed } = useLocalSearchParams<RouteParams>();
  const journalDate = useMemo(() => resolveRouteDate(date), [date]);
  const showProcessedBanner = useMemo(() => {
    const value = resolveRouteDate(processed);
    return value === '1' || value.toLowerCase() === 'true';
  }, [processed]);

  type DayEntry = Awaited<ReturnType<typeof fetchNormalizedEntriesByDate>>[number];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [readingEntry, setReadingEntry] = useState<DayEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<DayEntry | null>(null);
  const [editBody, setEditBody] = useState('');
  const [mutationBusy, setMutationBusy] = useState(false);

  const loadDay = useCallback(async () => {
    if (!isValidJournalDate(journalDate)) {
      setLoading(false);
      setError('Ongeldige datum in route.');
      setSummary(null);
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
      setSections(journal ? parseJournalSections(journal.sections) : []);
      setEntries(normalizedEntries);
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon dagdetail niet laden.';
      setError(message);
      setSummary(null);
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

  const previewSections = sections.slice(0, 4);
  const readableDate = useMemo(() => formatLongDate(journalDate), [journalDate]);
  const dayHeading = useMemo(() => getDayHeadingLabel(journalDate), [journalDate]);
  const insightText = useMemo(() => buildInsight(summary, sections), [sections, summary]);
  const visibleEntries = useMemo(
    () =>
      entries
        .map((entry) => ({ ...entry, body: cleanMomentPreview(entry.body ?? '') }))
        .sort((left, right) => {
          const leftTime = new Date(left.captured_at).getTime();
          const rightTime = new Date(right.captured_at).getTime();
          return rightTime - leftTime;
        }),
    [entries]
  );

  function formatTime(isoValue: string): string {
    const date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) {
      return '--:--';
    }
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  }

  function openReadModal(entry: DayEntry) {
    if (mutationBusy) {
      return;
    }
    setEditingEntry(null);
    setEditBody('');
    setReadingEntry(entry);
  }

  function closeReadModal() {
    if (mutationBusy) {
      return;
    }
    setReadingEntry(null);
  }

  function openEditModal(entry: DayEntry) {
    if (mutationBusy) {
      return;
    }
    setReadingEntry(null);
    setEditingEntry(entry);
    setEditBody(entry.body ?? '');
  }

  function closeEditModal() {
    if (mutationBusy) {
      return;
    }
    setEditingEntry(null);
    setEditBody('');
  }

  function forceCloseEditModal() {
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
    try {
      await updateNormalizedEntryById({
        id: editingEntry.id,
        title: editingEntry.title ?? '',
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
            setReadingEntry((current) => (current?.id === id ? null : current));
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

  return (
    <ScreenContainer scrollable>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedView style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={[styles.topBarIconButton, { backgroundColor: palette.surfaceLow }]}>
          <MaterialIcons name="arrow-back" size={18} color={palette.mutedSoft} />
        </Pressable>

        <ThemedView style={styles.topBarContext}>
          <ThemedText type="sectionTitle" style={[styles.topBarTitle, { color: palette.text }]}>
            {dayHeading}
          </ThemedText>
          <MetaText>{readableDate}</MetaText>
        </ThemedView>

        <Pressable
          onPress={() => {
            if (visibleEntries.length > 0) {
              openEditModal(visibleEntries[0]);
            }
          }}
          disabled={visibleEntries.length === 0}
          style={styles.topBarEditButton}>
          <ThemedText type="caption" style={[styles.topBarEditLabel, { color: palette.primary }]}>
            Bewerken
          </ThemedText>
        </Pressable>
      </ThemedView>

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
        <ThemedView
          lightColor={colorTokens.light.surfaceLow}
          darkColor={colorTokens.dark.surfaceLow}
          style={[styles.heroVisual, { borderColor: palette.separator }]}>
          <MaterialIcons name="auto-awesome" size={20} color={palette.primary} />
        </ThemedView>
      ) : null}

      {!loading && !error && summary ? (
        <ThemedText type="body" style={[styles.editorialBody, { color: palette.text }]}>
          {summary}
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
                lightColor="transparent"
                darkColor="transparent"
                style={[styles.entryItem, { borderBottomColor: palette.separator }]}>
                <ThemedView style={styles.entryHead}>
                  <Pressable
                    onPress={() => openReadModal(entry)}
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
                      {entry.body}
                    </ThemedText>
                  </Pressable>

                  <ThemedView style={styles.entryActions}>
                    <Pressable onPress={() => openEditModal(entry)} disabled={mutationBusy} style={styles.iconAction}>
                      <MaterialIcons name="edit" size={15} color={palette.mutedSoft} />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteEntry(entry.id)} disabled={mutationBusy} style={styles.iconAction}>
                      <MaterialIcons name="delete-outline" size={15} color={palette.mutedSoft} />
                    </Pressable>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      ) : null}

      <Modal visible={Boolean(readingEntry)} animationType="slide" onRequestClose={closeReadModal}>
        <ThemedView lightColor={colorTokens.light.background} darkColor={colorTokens.dark.background} style={styles.modalScreen}>
          <ThemedView style={styles.modalTopBar}>
            <Pressable onPress={closeReadModal} disabled={mutationBusy} style={styles.modalTopAction}>
              <ThemedText type="bodySecondary">Sluiten</ThemedText>
            </Pressable>
            <ThemedText type="sectionTitle">Moment</ThemedText>
            <Pressable
              onPress={() => {
                if (readingEntry) {
                  openEditModal(readingEntry);
                }
              }}
              disabled={!readingEntry || mutationBusy}
              style={[styles.modalTopAction, styles.modalTopActionPrimary, { backgroundColor: palette.surfaceLow }]}>
              <ThemedText type="defaultSemiBold">Bewerken</ThemedText>
            </Pressable>
          </ThemedView>

          <ScrollView contentContainerStyle={styles.readModalContent}>
            <ThemedText type="sectionTitle" style={[styles.readEntryTitle, { color: palette.text }]}>
              {readingEntry?.title?.trim() || 'Moment zonder titel'}
            </ThemedText>
            <ThemedView style={styles.readEntryMeta}>
              <MaterialIcons
                name={readingEntry?.source_type === 'audio' ? 'mic' : 'edit-note'}
                size={14}
                color={palette.primary}
              />
              <ThemedText type="caption" style={[styles.readEntryMetaText, { color: palette.mutedSoft }]}>
                {readingEntry?.source_type === 'audio' ? 'Audio' : 'Tekst'}
              </ThemedText>
              <ThemedText type="caption" style={[styles.readEntryMetaText, { color: palette.mutedSoft }]}>
                • {readingEntry ? formatTime(readingEntry.captured_at) : '--:--'}
              </ThemedText>
            </ThemedView>
            <ThemedText type="body" style={[styles.readEntryBody, { color: palette.text }]}>
              {readingEntry?.body?.trim() || 'Geen inhoud beschikbaar.'}
            </ThemedText>
          </ScrollView>
        </ThemedView>
      </Modal>

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
        </ThemedView>
      </Modal>

      <ThemedView style={styles.bottomActionWrap}>
        <Pressable onPress={() => router.push('/capture')} style={styles.bottomAction}>
          <ThemedText type="caption" style={[styles.bottomActionText, { color: palette.mutedSoft }]}>
            Nieuwe entry vastleggen
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  topBarIconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarContext: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.xs,
  },
  topBarTitle: {
  },
  topBarEditButton: {
    minWidth: 58,
    alignItems: 'flex-end',
  },
  topBarEditLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
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
  readModalContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  readEntryTitle: {
    marginTop: spacing.xs,
  },
  readEntryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  readEntryMetaText: {
  },
  readEntryBody: {
    lineHeight: 30,
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
    marginBottom: spacing.md,
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
