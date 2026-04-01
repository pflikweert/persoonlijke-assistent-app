import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Alert, Modal, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  MetaText,
  ScreenContainer,
  StateBlock,
} from '@/components/ui/screen-primitives';
import {
  deleteNormalizedEntryById,
  fetchDayJournalByDate,
  fetchNormalizedEntriesByDate,
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
  const { date, processed } = useLocalSearchParams<RouteParams>();
  const journalDate = useMemo(() => resolveRouteDate(date), [date]);
  const showProcessedBanner = useMemo(() => {
    const value = resolveRouteDate(processed);
    return value === '1' || value.toLowerCase() === 'true';
  }, [processed]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [sections, setSections] = useState<string[]>([]);
  const [entries, setEntries] = useState<Awaited<ReturnType<typeof fetchNormalizedEntriesByDate>>>([]);
  const [editingEntry, setEditingEntry] = useState<Awaited<ReturnType<typeof fetchNormalizedEntriesByDate>>[number] | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editBusy, setEditBusy] = useState(false);

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

  function openEditModal(entry: Awaited<ReturnType<typeof fetchNormalizedEntriesByDate>>[number]) {
    setEditingEntry(entry);
    setEditBody(entry.body ?? '');
  }

  function closeEditModal() {
    if (editBusy) {
      return;
    }
    setEditingEntry(null);
    setEditBody('');
  }

  async function regenerateDayAfterMutation() {
    if (!isValidJournalDate(journalDate)) {
      return;
    }

    await regenerateDayJournalByDate(journalDate);
  }

  async function handleSaveEdit() {
    if (!editingEntry) {
      return;
    }

    setEditBusy(true);
    try {
      await updateNormalizedEntryById({
        id: editingEntry.id,
        title: editingEntry.title ?? '',
        body: editBody,
      });
      await regenerateDayAfterMutation();
      closeEditModal();
      await loadDay();
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon entry niet bijwerken.';
      Alert.alert('Bewerken mislukt', message);
    } finally {
      setEditBusy(false);
    }
  }

  function handleDeleteEntry(id: string) {
    Alert.alert('Moment verwijderen?', 'Weet je zeker dat je dit individuele moment wilt verwijderen?', [
      { text: 'Annuleer', style: 'cancel' },
      {
        text: 'Verwijderen',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            try {
              await deleteNormalizedEntryById(id);
              await regenerateDayAfterMutation();
              await loadDay();
            } catch (nextError) {
              const message =
                nextError instanceof Error ? nextError.message : 'Kon entry niet verwijderen.';
              Alert.alert('Verwijderen mislukt', message);
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
        <Pressable onPress={() => router.back()} style={styles.topBarIconButton}>
          <MaterialIcons name="arrow-back" size={18} color={colorTokens.light.mutedSoft} />
        </Pressable>

        <ThemedView style={styles.topBarContext}>
          <ThemedText type="sectionTitle" style={styles.topBarTitle}>
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
          <ThemedText type="caption" style={styles.topBarEditLabel}>
            Bewerken
          </ThemedText>
        </Pressable>
      </ThemedView>

      {showProcessedBanner ? (
        <ThemedView style={styles.processedRow}>
          <ThemedView style={styles.processedDot} />
          <ThemedText type="caption" style={styles.processedText}>
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
        <ThemedView lightColor={colorTokens.light.surfaceLow} darkColor={colorTokens.dark.surfaceLow} style={styles.heroVisual}>
          <MaterialIcons name="auto-awesome" size={20} color={colorTokens.light.primary} />
        </ThemedView>
      ) : null}

      {!loading && !error && summary ? (
        <ThemedText type="body" style={styles.editorialBody}>
          {summary}
        </ThemedText>
      ) : null}

      {!loading && !error && insightText ? (
        <ThemedView
          lightColor="transparent"
          darkColor="transparent"
          style={styles.insightBlock}>
          <ThemedView style={styles.insightHeader}>
            <MaterialIcons name="auto-awesome" size={14} color={colorTokens.light.primary} />
            <ThemedText type="caption" style={styles.insightLabel}>
              INZICHT
            </ThemedText>
          </ThemedView>
          <ThemedText type="bodySecondary" style={styles.insightText}>
            {insightText}
          </ThemedText>
        </ThemedView>
      ) : null}

      {!loading && !error && previewSections.length > 0 ? (
        <ThemedView
          lightColor="transparent"
          darkColor="transparent"
          style={styles.keyPointsBlock}>
          <ThemedText type="meta" style={styles.blockLabel}>
            Kernpunten
          </ThemedText>
          <ThemedView style={styles.keyPointsList}>
            {previewSections.map((section, index) => (
              <ThemedView key={`${section}-${index}`} style={styles.keyPointRow}>
                <ThemedView style={styles.dot} />
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
          <ThemedText type="meta" style={styles.blockLabelMuted}>
            Individuele momenten
          </ThemedText>
          <ThemedView style={styles.entriesList}>
            {visibleEntries.map((entry) => (
              <ThemedView
                key={entry.id}
                lightColor="transparent"
                darkColor="transparent"
                style={styles.entryItem}>
                <ThemedView style={styles.entryHead}>
                  <ThemedView style={styles.entryTitleWrap}>
                    <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.entryTitle}>
                      {entry.title?.trim() || 'Moment zonder titel'}
                    </ThemedText>
                    <ThemedView style={styles.entryMeta}>
                      <MaterialIcons
                        name={entry.source_type === 'audio' ? 'mic' : 'edit-note'}
                        size={14}
                        color={colorTokens.light.primary}
                      />
                      <ThemedText type="caption" style={styles.entryType}>
                        {entry.source_type === 'audio' ? 'Audio' : 'Tekst'}
                      </ThemedText>
                      <ThemedText type="caption" style={styles.entryTime}>
                        • {formatTime(entry.captured_at)}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={styles.entryActions}>
                    <Pressable onPress={() => openEditModal(entry)} style={styles.iconAction}>
                      <MaterialIcons name="edit" size={15} color={colorTokens.light.mutedSoft} />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteEntry(entry.id)} style={styles.iconAction}>
                      <MaterialIcons name="delete-outline" size={15} color={colorTokens.light.mutedSoft} />
                    </Pressable>
                  </ThemedView>
                </ThemedView>

                <ThemedText type="bodySecondary" numberOfLines={3} style={styles.entryPreview}>
                  {entry.body}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      ) : null}

      <Modal visible={Boolean(editingEntry)} animationType="slide" onRequestClose={closeEditModal}>
        <ThemedView lightColor={colorTokens.light.background} darkColor={colorTokens.dark.background} style={styles.modalScreen}>
          <ThemedView style={styles.modalTopBar}>
            <Pressable onPress={closeEditModal} disabled={editBusy} style={styles.modalTopAction}>
              <ThemedText type="bodySecondary">Annuleer</ThemedText>
            </Pressable>
            <ThemedText type="sectionTitle">Moment bewerken</ThemedText>
            <Pressable
              onPress={() => void handleSaveEdit()}
              disabled={editBusy}
              style={[styles.modalTopAction, styles.modalTopActionPrimary]}>
              <ThemedText type="defaultSemiBold" lightColor={colorTokens.light.primaryOn} darkColor={colorTokens.dark.primaryOn}>
                {editBusy ? 'Opslaan...' : 'Opslaan'}
              </ThemedText>
            </Pressable>
          </ThemedView>

          <TextInput
            multiline
            autoFocus
            value={editBody}
            onChangeText={setEditBody}
            textAlignVertical="top"
            style={styles.modalInputFull}
            placeholder="Typ de inhoud van dit moment..."
            placeholderTextColor={colorTokens.light.mutedSoft}
          />
        </ThemedView>
      </Modal>

      <ThemedView style={styles.bottomActionWrap}>
        <Pressable onPress={() => router.push('/capture')} style={styles.bottomAction}>
          <ThemedText type="caption" style={styles.bottomActionText}>
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
    backgroundColor: colorTokens.light.surfaceLow,
  },
  topBarContext: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.xs,
  },
  topBarTitle: {
    color: colorTokens.light.text,
  },
  topBarEditButton: {
    minWidth: 58,
    alignItems: 'flex-end',
  },
  topBarEditLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colorTokens.light.primary,
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
    backgroundColor: colorTokens.light.success,
  },
  processedText: {
    color: colorTokens.light.mutedSoft,
  },
  heroVisual: {
    borderRadius: 32,
    minHeight: 152,
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colorTokens.light.separator,
  },
  editorialBody: {
    fontSize: 20,
    lineHeight: 34,
    color: colorTokens.light.text,
    marginBottom: spacing.xl,
    letterSpacing: -0.2,
  },
  insightBlock: {
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
    borderLeftWidth: 2,
    borderLeftColor: colorTokens.light.primary,
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
    color: colorTokens.light.primary,
  },
  insightText: {
    fontStyle: 'italic',
    color: colorTokens.light.muted,
  },
  keyPointsBlock: {
    borderRadius: 24,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  blockLabel: {
    color: colorTokens.light.primary,
  },
  blockLabelMuted: {
    color: colorTokens.light.mutedSoft,
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
    backgroundColor: colorTokens.light.primaryStrong,
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
    borderBottomColor: colorTokens.light.separator,
  },
  entryHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  entryTitleWrap: {
    flex: 1,
    gap: spacing.xxs,
  },
  entryTitle: {
    color: colorTokens.light.text,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  entryType: {
    color: colorTokens.light.mutedSoft,
  },
  entryTime: {
    color: colorTokens.light.mutedSoft,
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
    color: colorTokens.light.muted,
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
    backgroundColor: colorTokens.light.primaryStrong,
    alignItems: 'center',
  },
  modalInputFull: {
    flex: 1,
    minHeight: 340,
    fontSize: 24,
    lineHeight: 34,
    color: colorTokens.light.text,
    backgroundColor: `${colorTokens.light.surfaceLowest}D6`,
    borderWidth: 1,
    borderColor: `${colorTokens.light.separator}CC`,
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
    color: colorTokens.light.mutedSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
