import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, TextInput } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { ProcessingScreen } from '@/components/feedback/processing-screen';
import { ScreenHeader } from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MetaText, PrimaryButton, ScreenContainer, StateBlock } from '@/components/ui/screen-primitives';
import {
  deleteNormalizedEntryById,
  fetchNormalizedEntryById,
  generateReflection,
  hasReflectionForAnchorDate,
  regenerateDayJournalByDate,
  updateNormalizedEntryById,
} from '@/services';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';

type RouteParams = {
  id?: string | string[];
  source?: string | string[];
  date?: string | string[];
};

type EntrySource = 'capture' | 'day' | 'today' | 'direct';

function resolveRouteValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function formatCapturedAtLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Moment onbekend';
  }

  return date.toLocaleString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function cleanEntryText(value: string): string {
  const lines = String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim());

  const collapsed: string[] = [];
  let previousWasBlank = false;

  for (const line of lines) {
    if (!line) {
      if (!previousWasBlank && collapsed.length > 0) {
        collapsed.push('');
      }
      previousWasBlank = true;
      continue;
    }

    collapsed.push(line);
    previousWasBlank = false;
  }

  while (collapsed[0] === '') {
    collapsed.shift();
  }

  while (collapsed.length > 0 && collapsed[collapsed.length - 1] === '') {
    collapsed.pop();
  }

  return collapsed.join('\n');
}

function buildSummary(value: string): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (!clean) {
    return 'Je entry is toegevoegd aan je dag.';
  }

  const sentence = clean.split(/[.!?]/)[0]?.trim() ?? '';
  if (sentence.length >= 18) {
    return sentence.endsWith('.') ? sentence : `${sentence}.`;
  }

  return clean.length > 120 ? `${clean.slice(0, 119).trimEnd()}...` : clean;
}

export default function EntryCompletionScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { id, source, date } = useLocalSearchParams<RouteParams>();
  const entryId = useMemo(() => resolveRouteValue(id), [id]);
  const sourceContext = useMemo<EntrySource>(() => {
    const value = resolveRouteValue(source);
    if (value === 'capture' || value === 'day' || value === 'today' || value === 'direct') {
      return value;
    }
    return 'direct';
  }, [source]);
  const routeDate = useMemo(() => resolveRouteValue(date), [date]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] = useState<Awaited<ReturnType<typeof fetchNormalizedEntryById>>>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [editBody, setEditBody] = useState('');

  const loadEntry = useCallback(async () => {
    if (!entryId) {
      setLoading(false);
      setError('Entry id ontbreekt.');
      setEntry(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextEntry = await fetchNormalizedEntryById(entryId);
      if (!nextEntry) {
        setEntry(null);
        setError('De entry kon niet gevonden worden.');
        return;
      }

      setEntry(nextEntry);
      setEditBody(nextEntry.body ?? '');
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon entry niet laden.';
      setError(message);
      setEntry(null);
    } finally {
      setLoading(false);
    }
  }, [entryId]);

  useFocusEffect(
    useCallback(() => {
      void loadEntry();
    }, [loadEntry])
  );

  const sourceText = entry?.body ?? '';
  const cleanedBody = useMemo(() => cleanEntryText(sourceText), [sourceText]);
  const summaryShortText = useMemo(
    () => entry?.summary_short?.trim() || buildSummary(sourceText),
    [entry?.summary_short, sourceText]
  );
  const isProcessing = saving || deleting;
  const capturedAtLabel = useMemo(() => formatCapturedAtLabel(entry?.captured_at ?? ''), [entry?.captured_at]);
  const title = entry?.title?.trim() || 'Je entry';
  const dayDate = entry?.journal_date ?? routeDate;

  function goToToday() {
    router.replace('/(tabs)');
  }

  function goToDayDetail(options?: { includeEntryFocus?: boolean }) {
    if (!dayDate) {
      goToToday();
      return;
    }

    router.replace({
      pathname: '/day/[date]',
      params: {
        date: dayDate,
        ...(options?.includeEntryFocus && entryId ? { entryId } : {}),
      },
    });
  }

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    if (sourceContext === 'day') {
      goToDayDetail({ includeEntryFocus: true });
      return;
    }

    goToToday();
  }

  async function refreshDerivedAfterMutation(
    journalDate: string,
    options?: { refreshExistingReflectionsOnly?: boolean }
  ): Promise<string | null> {
    await regenerateDayJournalByDate(journalDate);
    let reflectionRefreshError: string | null = null;

    try {
      for (const periodType of ['week', 'month'] as const) {
        if (options?.refreshExistingReflectionsOnly) {
          const exists = await hasReflectionForAnchorDate({
            periodType,
            anchorDate: journalDate,
          });
          if (!exists) {
            continue;
          }
        }

        await generateReflection({
          periodType,
          anchorDate: journalDate,
          forceRegenerate: true,
        });
      }
    } catch (nextError) {
      reflectionRefreshError =
        nextError instanceof Error ? nextError.message : 'Reflecties konden niet direct worden bijgewerkt.';
    }

    return reflectionRefreshError;
  }

  async function handleSaveEdit() {
    if (!entry) {
      return;
    }

    setEditVisible(false);
    setSaving(true);
    try {
      await updateNormalizedEntryById({
        id: entry.id,
        body: editBody,
      });
      const reflectionRefreshError = await refreshDerivedAfterMutation(entry.journal_date);
      await loadEntry();
      if (reflectionRefreshError) {
        Alert.alert(
          'Wijziging opgeslagen',
          `Entry is bijgewerkt, maar reflecties konden niet direct worden vernieuwd.\n\n${reflectionRefreshError}`
        );
      }
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon wijziging niet opslaan.';
      Alert.alert('Opslaan mislukt', message);
    } finally {
      setSaving(false);
    }
  }

  async function runDeleteFlow() {
    if (!entry || isProcessing) {
      return;
    }

    setDeleteConfirmVisible(false);
    setDeleting(true);
    try {
      await deleteNormalizedEntryById(entry.id);
      const reflectionRefreshError = await refreshDerivedAfterMutation(entry.journal_date, {
        refreshExistingReflectionsOnly: true,
      });
      if (reflectionRefreshError) {
        Alert.alert(
          'Entry verwijderd',
          `Dagdetail is bijgewerkt, maar reflecties konden niet direct worden vernieuwd.\n\n${reflectionRefreshError}`
        );
      }
      goToDayDetail();
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Kon entry niet verwijderen.';
      Alert.alert('Verwijderen mislukt', message);
    } finally {
      setDeleting(false);
    }
  }

  function handleDelete() {
    if (!entry || isProcessing) {
      return;
    }
    setDeleteConfirmVisible(true);
  }

  return (
    <>
      <ScreenContainer
        scrollable
        fixedHeader={
          isProcessing ? null : (
            <ScreenHeader
              leftAction={
                <Pressable
                accessibilityRole="button"
                accessibilityLabel="Terug"
                onPress={handleBack}
                style={[styles.topIconButton, { backgroundColor: palette.surfaceLow }]}>
                <MaterialIcons name="arrow-back" size={18} color={palette.primary} />
              </Pressable>
            }
              rightAction={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Bewerk entry"
                  onPress={() => setEditVisible(true)}
                  disabled={!entry || loading || isProcessing}
                  style={styles.editTextAction}>
                  <ThemedText type="bodySecondary" style={[styles.editTextLabel, { color: palette.mutedSoft }]}>
                    Bewerken
                  </ThemedText>
                </Pressable>
              }
            />
          )
        }
        contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ headerShown: false }} />

      {loading ? <StateBlock tone="loading" message="Entry laden..." detail="Even geduld, we halen je moment op." /> : null}
      {!loading && error ? <StateBlock tone="error" message="Entry kon niet geladen worden." detail={error} /> : null}

      {!isProcessing && !loading && !error && entry ? (
        <>
          <ThemedView style={styles.titleBlock}>
            <ThemedText type="screenTitle" style={[styles.entryTitle, { color: palette.text }]}>
              {title}
            </ThemedText>
            <MetaText>{capturedAtLabel}</MetaText>
          </ThemedView>

          <ThemedView
            lightColor={colorTokens.light.surfaceLow}
            darkColor={colorTokens.dark.surfaceLow}
            style={styles.summaryBlock}>
            <MetaText>Samenvatting</MetaText>
            <ThemedText type="bodySecondary" style={[styles.summaryText, { color: palette.muted }]}>
              {summaryShortText}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.bodyBlock}>
            <ThemedText type="body" style={[styles.bodyText, { color: palette.text }]}>
              {cleanedBody || 'Deze entry bevat nog geen tekst.'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.actionsBlock}>
            {sourceContext === 'capture' ? (
              <>
                <PrimaryButton label="Nog iets vastleggen" onPress={() => router.replace('/capture')} />
                <Pressable onPress={goToToday} style={styles.secondaryAction}>
                  <ThemedText type="bodySecondary" style={[styles.secondaryActionLabel, { color: palette.mutedSoft }]}>
                    Ga naar vandaag
                  </ThemedText>
                </Pressable>
              </>
            ) : null}

            {sourceContext === 'day' || sourceContext === 'today' ? (
              <PrimaryButton label="Terug naar deze dag" onPress={() => goToDayDetail({ includeEntryFocus: true })} />
            ) : null}

            {sourceContext === 'direct' ? <PrimaryButton label="Ga naar vandaag" onPress={goToToday} /> : null}

            <Pressable onPress={handleDelete} disabled={isProcessing} style={styles.deleteAction}>
              <ThemedText type="caption" style={[styles.deleteActionLabel, { color: palette.mutedSoft }]}>
                {deleting ? 'VERWIJDEREN...' : 'VERWIJDEREN'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </>
      ) : null}

        <Modal visible={editVisible} animationType="slide" onRequestClose={() => !isProcessing && setEditVisible(false)}>
        <ThemedView lightColor={colorTokens.light.background} darkColor={colorTokens.dark.background} style={styles.modalScreen}>
          <ThemedView style={styles.modalTopBar}>
            <Pressable onPress={() => setEditVisible(false)} disabled={isProcessing} style={styles.modalTopAction}>
              <ThemedText type="bodySecondary">Annuleer</ThemedText>
            </Pressable>
            <ThemedText type="sectionTitle">Entry bewerken</ThemedText>
            <Pressable
              onPress={() => void handleSaveEdit()}
              disabled={isProcessing}
              style={[styles.modalTopAction, styles.modalTopActionPrimary, { backgroundColor: palette.primaryStrong }]}>
              <ThemedText type="defaultSemiBold" lightColor={colorTokens.light.primaryOn} darkColor={colorTokens.dark.primaryOn}>
                {saving ? 'Opslaan...' : 'Opslaan'}
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
            placeholder="Typ de inhoud van je entry..."
            placeholderTextColor={palette.mutedSoft}
          />
        </ThemedView>
        </Modal>
      </ScreenContainer>
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Moment verwijderen?"
        message="Weet je zeker dat je dit moment wilt verwijderen? Dit kun je niet ongedaan maken."
        cancelLabel="Annuleren"
        confirmLabel="Verwijderen"
        processing={deleting}
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={() => void runDeleteFlow()}
      />
      <ProcessingScreen visible={isProcessing} variant="entry-edit" />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  topIconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editTextAction: {
    minHeight: 34,
    justifyContent: 'center',
  },
  editTextLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  titleBlock: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  entryTitle: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  summaryBlock: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  summaryText: {
    fontStyle: 'italic',
    lineHeight: 24,
  },
  bodyBlock: {
    marginBottom: spacing.xxxl,
  },
  bodyText: {
    fontSize: 19,
    lineHeight: 31,
  },
  actionsBlock: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  secondaryAction: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  secondaryActionLabel: {
    fontSize: 16,
    lineHeight: 22,
  },
  deleteAction: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  deleteActionLabel: {
    letterSpacing: 2,
    textTransform: 'uppercase',
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
});
