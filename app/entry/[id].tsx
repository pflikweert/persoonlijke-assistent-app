import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { InlineLoadingOverlay } from "@/components/feedback/inline-loading-overlay";
import { ProcessingScreen } from "@/components/feedback/processing-screen";
import { TextEditorModal } from "@/components/feedback/text-editor-modal";
import { DayEditorialPanel } from "@/components/journal/day-editorial-panel";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  HeaderIconButton,
  HeaderTextAction,
} from "@/components/ui/header-icon-button";
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  deleteNormalizedEntryById,
  fetchNormalizedEntryById,
  generateReflection,
  hasReflectionForAnchorDate,
  regenerateDayJournalByDate,
  updateNormalizedEntryById,
} from "@/services";
import { colorTokens, spacing } from "@/theme";

type RouteParams = {
  id?: string | string[];
  date?: string | string[];
};

function resolveRouteValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function formatCapturedAtLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Moment onbekend";
  }

  return date.toLocaleString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cleanEntryText(value: string): string {
  const lines = String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim());

  const collapsed: string[] = [];
  let previousWasBlank = false;

  for (const line of lines) {
    if (!line) {
      if (!previousWasBlank && collapsed.length > 0) {
        collapsed.push("");
      }
      previousWasBlank = true;
      continue;
    }

    collapsed.push(line);
    previousWasBlank = false;
  }

  while (collapsed[0] === "") {
    collapsed.shift();
  }

  while (collapsed.length > 0 && collapsed[collapsed.length - 1] === "") {
    collapsed.pop();
  }

  return collapsed.join("\n");
}

function sanitizeAssistantCopy(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function shouldRenderAssistantCopy(value: string): boolean {
  const clean = sanitizeAssistantCopy(value);
  if (!clean) {
    return false;
  }

  if (clean.length < 24) {
    return false;
  }

  const genericPatterns = [
    /^je entry is toegevoegd/i,
    /^entry toegevoegd/i,
    /^moment opgeslagen/i,
    /^notitie opgeslagen/i,
    /^vandaag bijgewerkt/i,
  ];

  return !genericPatterns.some((pattern) => pattern.test(clean));
}

function formatDayActionLabel(value: string): string {
  if (!value) {
    return "Ga naar deze dag";
  }

  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return "Ga naar deze dag";
  }

  const label = parsed.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

  return `Ga naar ${label}`;
}

export default function EntryCompletionScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const { id, date } = useLocalSearchParams<RouteParams>();
  const entryId = useMemo(() => resolveRouteValue(id), [id]);
  const routeDate = useMemo(() => resolveRouteValue(date), [date]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] =
    useState<Awaited<ReturnType<typeof fetchNormalizedEntryById>>>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [editBody, setEditBody] = useState("");

  const loadEntry = useCallback(async () => {
    if (!entryId) {
      setLoading(false);
      setError("Entry id ontbreekt.");
      setEntry(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextEntry = await fetchNormalizedEntryById(entryId);
      if (!nextEntry) {
        setEntry(null);
        setError("De entry kon niet gevonden worden.");
        return;
      }

      setEntry(nextEntry);
      setEditBody(nextEntry.body ?? "");
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon entry niet laden.";
      setError(message);
      setEntry(null);
    } finally {
      setLoading(false);
    }
  }, [entryId]);

  useFocusEffect(
    useCallback(() => {
      void loadEntry();
    }, [loadEntry]),
  );

  const sourceText = entry?.body ?? "";
  const cleanedBody = useMemo(() => cleanEntryText(sourceText), [sourceText]);
  const summaryShortText = useMemo(
    () => sanitizeAssistantCopy(entry?.summary_short ?? ""),
    [entry?.summary_short],
  );
  const showAssistantCopy = useMemo(
    () => shouldRenderAssistantCopy(summaryShortText),
    [summaryShortText],
  );
  const isProcessing = saving || deleting;
  const capturedAtLabel = useMemo(
    () => formatCapturedAtLabel(entry?.captured_at ?? ""),
    [entry?.captured_at],
  );
  const title = entry?.title?.trim() || "Je entry";
  const dayDate = entry?.journal_date ?? routeDate;
  const dayActionLabel = useMemo(
    () => formatDayActionLabel(dayDate),
    [dayDate],
  );

  function goToDayDetail(options?: { includeEntryFocus?: boolean }) {
    if (!dayDate) {
      router.replace("/(tabs)");
      return;
    }

    router.replace({
      pathname: "/day/[date]",
      params: {
        date: dayDate,
        ...(options?.includeEntryFocus && entryId ? { entryId } : {}),
      },
    });
  }

  function handleBack() {
    goToDayDetail({ includeEntryFocus: true });
  }

  async function refreshDerivedAfterMutation(
    journalDate: string,
    options?: { refreshExistingReflectionsOnly?: boolean },
  ): Promise<string | null> {
    await regenerateDayJournalByDate(journalDate);
    let reflectionRefreshError: string | null = null;

    try {
      for (const periodType of ["week", "month"] as const) {
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
        nextError instanceof Error
          ? nextError.message
          : "Reflecties konden niet direct worden bijgewerkt.";
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
      const reflectionRefreshError = await refreshDerivedAfterMutation(
        entry.journal_date,
      );
      await loadEntry();
      if (reflectionRefreshError) {
        Alert.alert(
          "Wijziging opgeslagen",
          `Entry is bijgewerkt, maar reflecties konden niet direct worden vernieuwd.\n\n${reflectionRefreshError}`,
        );
      }
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon wijziging niet opslaan.";
      Alert.alert("Opslaan mislukt", message);
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
      const reflectionRefreshError = await refreshDerivedAfterMutation(
        entry.journal_date,
        {
          refreshExistingReflectionsOnly: true,
        },
      );
      if (reflectionRefreshError) {
        Alert.alert(
          "Entry verwijderd",
          `Dagdetail is bijgewerkt, maar reflecties konden niet direct worden vernieuwd.\n\n${reflectionRefreshError}`,
        );
      }
      goToDayDetail();
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Kon entry niet verwijderen.";
      Alert.alert("Verwijderen mislukt", message);
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
                <HeaderIconButton
                  accessibilityRole="button"
                  accessibilityLabel="Terug naar deze dag"
                  onPress={handleBack}
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={18}
                    color={palette.primary}
                  />
                </HeaderIconButton>
              }
              rightAction={
                <HeaderTextAction
                  accessibilityRole="button"
                  accessibilityLabel="Bewerk entry"
                  label="Bewerken"
                  onPress={() => setEditVisible(true)}
                  disabled={!entry || loading || isProcessing}
                />
              }
            />
          )
        }
        contentContainerStyle={styles.scrollContent}
      >
        <Stack.Screen options={{ headerShown: false }} />

        {loading ? (
          <InlineLoadingOverlay
            message="Entry laden..."
            detail="Even geduld, we halen je moment op."
          />
        ) : null}
        {!loading && error ? (
          <StateBlock
            tone="error"
            message="Entry kon niet geladen worden."
            detail={error}
          />
        ) : null}

        {!isProcessing && !loading && !error && entry ? (
          <>
            <ThemedView style={styles.titleBlock}>
              <ThemedText type="screenTitle" style={{ color: palette.text }}>
                {title}
              </ThemedText>
              <MetaText>{capturedAtLabel}</MetaText>
            </ThemedView>

            {showAssistantCopy ? (
              <DayEditorialPanel text={summaryShortText} />
            ) : null}

            <ThemedView style={styles.bodyBlock}>
              <ThemedText type="body" style={{ color: palette.text }}>
                {cleanedBody || "Deze entry bevat nog geen tekst."}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.actionsBlock}>
              <PrimaryButton
                label={dayActionLabel}
                onPress={() => goToDayDetail({ includeEntryFocus: true })}
              />
              <SecondaryButton
                label="Nog een moment opnemen"
                onPress={() =>
                  router.push({
                    pathname: "/capture",
                    params: { date: dayDate },
                  })
                }
              />

              <Pressable
                onPress={handleDelete}
                disabled={isProcessing}
                style={styles.deleteAction}
              >
                <ThemedText
                  type="caption"
                  style={[
                    styles.deleteActionLabel,
                    { color: palette.mutedSoft },
                  ]}
                >
                  {deleting ? "VERWIJDEREN..." : "VERWIJDEREN"}
                </ThemedText>
              </Pressable>
            </ThemedView>
          </>
        ) : null}

        <TextEditorModal
          visible={editVisible}
          title="Entry bewerken"
          value={editBody}
          placeholder="Wat houdt je bezig?"
          submitLabel="Moment bewaren"
          processingLabel="Moment bewaren..."
          processing={isProcessing}
          onCancel={() => setEditVisible(false)}
          onChange={setEditBody}
          onSubmit={() => void handleSaveEdit()}
        />
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
  titleBlock: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  bodyBlock: {
    marginBottom: spacing.xxxl,
  },
  actionsBlock: {
    alignItems: "center",
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  deleteAction: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  deleteActionLabel: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
