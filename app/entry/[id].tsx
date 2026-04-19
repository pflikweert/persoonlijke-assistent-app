import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

import { ConfirmSheet } from "@/components/feedback/destructive-confirm-sheet";
import { InlineLoadingOverlay } from "@/components/feedback/inline-loading-overlay";
import { ProcessingScreen } from "@/components/feedback/processing-screen";
import { TextEditorModal } from "@/components/feedback/text-editor-modal";
import { DayJournalSummaryInset } from "@/components/journal/day-journal-summary-inset";
import { EditorialNarrativeBlock } from "@/components/journal/editorial-narrative-block";
import { EntryAudioPlayer } from "@/components/journal/entry-audio-player";
import { ScreenHeader } from "@/components/layout/screen-header";
import { BottomTabBarStandalone } from "@/components/navigation/BottomTabBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  DetailActionStack,
  DetailSectionHeader,
  DetailScreenHero,
  DetailTertiaryAction,
} from "@/components/ui/detail-screen-primitives";
import { CopyIconButton } from "@/components/ui/copy-icon-button";
import {
  HeaderIconButton,
} from "@/components/ui/header-icon-button";
import {
  ScreenContainer,
  SecondaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  createEntryAudioSignedUrl,
  deleteNormalizedEntryById,
  fetchNormalizedEntryById,
  generateReflection,
  hasReflectionForAnchorDate,
  regenerateDayJournalByDate,
  updateNormalizedEntryById,
} from "@/services";
import { buildEntryCopyPayload } from "@/src/lib/copy-payloads";
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

function formatLastEditedLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Laatst gewijzigd";
  }

  const dayMonth = parsed.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
  });
  const time = parsed.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dayMonth} om ${time}`;
}

function sanitizeDownloadSegment(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "moment";
}

function formatAudioDownloadFileName(input: {
  title: string;
  capturedAtIso: string;
  extension?: string;
}): string {
  const extension = input.extension ?? "m4a";
  const parsed = new Date(input.capturedAtIso);

  if (Number.isNaN(parsed.getTime())) {
    return `${sanitizeDownloadSegment(input.title)}.${extension}`;
  }

  const year = String(parsed.getFullYear());
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hour = String(parsed.getHours()).padStart(2, "0");
  const minute = String(parsed.getMinutes()).padStart(2, "0");
  const safeTitle = sanitizeDownloadSegment(input.title).slice(0, 64);

  return `${year}-${month}-${day}_${hour}-${minute}_${safeTitle}.${extension}`;
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
  const [audioPlaybackUrl, setAudioPlaybackUrl] = useState<string | null>(null);
  const [audioDownloadUrl, setAudioDownloadUrl] = useState<string | null>(null);

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
        setAudioPlaybackUrl(null);
        setAudioDownloadUrl(null);
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
      setAudioPlaybackUrl(null);
      setAudioDownloadUrl(null);
    } finally {
      setLoading(false);
    }
  }, [entryId]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const path = entry?.audio_storage_path?.trim();
      if (!path) {
        setAudioPlaybackUrl(null);
        setAudioDownloadUrl(null);
        return;
      }

      try {
        const extensionFromMime =
          entry?.audio_mime_type?.split("/")[1]?.split(";")[0]?.toLowerCase() ||
          "m4a";
        const downloadFileName = formatAudioDownloadFileName({
          title: entry?.title ?? "moment",
          capturedAtIso: entry?.captured_at ?? new Date().toISOString(),
          extension: extensionFromMime,
        });
        const playback = await createEntryAudioSignedUrl({
          storagePath: path,
        });
        const download = await createEntryAudioSignedUrl({
          storagePath: path,
          downloadFileName,
        });

        if (!cancelled) {
          setAudioPlaybackUrl(playback);
          setAudioDownloadUrl(download);
        }
      } catch {
        if (!cancelled) {
          setAudioPlaybackUrl(null);
          setAudioDownloadUrl(null);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    entry?.audio_storage_path,
    entry?.id,
    entry?.audio_mime_type,
    entry?.captured_at,
    entry?.title,
  ]);

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
  const hasEditedTimestamp = useMemo(() => {
    if (!entry?.updated_at || !entry?.created_at) {
      return false;
    }

    return new Date(entry.updated_at).getTime() > new Date(entry.created_at).getTime();
  }, [entry?.created_at, entry?.updated_at]);
  const lastEditedLabel = useMemo(
    () => formatLastEditedLabel(entry?.updated_at ?? ""),
    [entry?.updated_at],
  );
  const entryCopyPayload = useMemo(
    () =>
      buildEntryCopyPayload({
        title,
        capturedAtLabel,
        summaryText: showAssistantCopy ? summaryShortText : null,
        bodyText: cleanedBody,
      }),
    [title, capturedAtLabel, showAssistantCopy, summaryShortText, cleanedBody],
  );
  const cleanedBodyLineCount = useMemo(() => {
    const lines = cleanedBody
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return lines.length;
  }, [cleanedBody]);
  const isShortContentLayout = useMemo(() => {
    const hasShortBody = cleanedBodyLineCount <= 2;
    const hasShortSummary = !showAssistantCopy || summaryShortText.length <= 90;
    return hasShortBody && hasShortSummary;
  }, [cleanedBodyLineCount, showAssistantCopy, summaryShortText]);

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

  function handleDownloadAudio() {
    if (!audioDownloadUrl) {
      return;
    }

    void Linking.openURL(audioDownloadUrl);
  }

  return (
    <>
      <ScreenContainer
        scrollable
        fixedFooter={
          <BottomTabBarStandalone
            activeKey="today"
            onSelect={(key) => {
              if (key === "capture") {
                router.push("/capture");
                return;
              }
              if (key === "reflections") {
                router.push("/(tabs)/reflections");
                return;
              }
              router.push("/(tabs)");
            }}
          />
        }
        backgroundTone="subtle"
        fixedHeader={
          isProcessing ? null : (
            <ScreenHeader
              leftAction={
                <ThemedView style={styles.brandLockup}>
                  <ThemedText type="sectionTitle" style={styles.brandPrimary}>
                    Budio
                  </ThemedText>
                  <ThemedText
                    type="sectionTitle"
                    style={[styles.brandSecondary, { color: palette.mutedSoft }]}
                  >
                    Moment
                  </ThemedText>
                </ThemedView>
              }
              rightAction={
                <HeaderIconButton
                  accessibilityRole="button"
                  accessibilityLabel="Terug naar deze dag"
                  size={44}
                  onPress={handleBack}
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={18}
                    color={palette.primary}
                  />
                </HeaderIconButton>
              }
              surface="transparent"
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
            <DetailScreenHero
              title={title}
              subtitle={capturedAtLabel}
              subtitleType="meta"
              style={styles.titleBlock}
              titleStyle={{ color: palette.text }}
            />

            {showAssistantCopy ? (
              <ThemedView style={styles.summarySectionBlock}>
                <DayJournalSummaryInset text={summaryShortText} />
              </ThemedView>
            ) : null}

            {entry.source_type === "audio" && audioPlaybackUrl ? (
              <ThemedView style={[styles.sectionBlock, styles.primarySectionSpacing]}>
                <DetailSectionHeader
                  icon="mic"
                  title="Opname"
                />
                <EntryAudioPlayer
                  sourceUrl={audioPlaybackUrl}
                  durationMs={entry.audio_duration_ms}
                  onRequestDownload={handleDownloadAudio}
                />
              </ThemedView>
            ) : null}

            <ThemedView style={[styles.sectionBlock, styles.primarySectionSpacing]}>
              <DetailSectionHeader
                icon="subject"
                title={
                  entry.source_type === "audio"
                    ? "Uitgeschreven opname"
                    : "Geschreven moment"
                }
                trailingAction={
                  <CopyIconButton
                    payload={entryCopyPayload}
                    copyLabel="Kopieer moment"
                    copiedLabel="Moment gekopieerd"
                  />
                }
              />
              <EditorialNarrativeBlock
                text={cleanedBody || "Deze entry bevat nog geen tekst."}
                style={styles.narrativeBlock}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Moment bewerken"
                onPress={() => setEditVisible(true)}
                style={styles.inlineEditAction}
              >
                <MaterialIcons name="edit" size={14} color={palette.mutedSoft} />
                <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                  Bewerken
                </ThemedText>
              </Pressable>

              {hasEditedTimestamp ? (
                <ThemedView style={styles.editedMetaWrap}>
                  <ThemedText
                    type="caption"
                    style={[styles.editedMetaText, { color: palette.mutedSoft }]}
                  >
                    Laatst gewijzigd: {lastEditedLabel}
                  </ThemedText>
                </ThemedView>
              ) : null}
            </ThemedView>

            <DetailActionStack
              style={
                isShortContentLayout
                  ? styles.actionStackShortContent
                  : styles.actionStackDefault
              }
            >
              <SecondaryButton
                label={dayActionLabel}
                onPress={() => goToDayDetail({ includeEntryFocus: true })}
              />
              <DetailTertiaryAction
                onPress={handleDelete}
                disabled={isProcessing}
                label={deleting ? "Verwijderen..." : "Verwijderen"}
                tone="destructive"
                uppercase={false}
              />
            </DetailActionStack>
          </>
        ) : null}

        <TextEditorModal
          visible={editVisible}
          title="Moment aanpassen"
          value={editBody}
          placeholder="Wat houdt je bezig?"
          submitLabel="Wijziging bewaren"
          processingLabel="Wijziging bewaren..."
          processing={isProcessing}
          onCancel={() => setEditVisible(false)}
          onChange={setEditBody}
          onSubmit={() => void handleSaveEdit()}
        />
      </ScreenContainer>
      <ConfirmSheet
        visible={deleteConfirmVisible}
        title="Moment verwijderen?"
        message="Weet je zeker dat je dit moment wilt verwijderen? Dit kun je niet ongedaan maken."
        actions={[
          {
            key: "cancel",
            label: "Annuleren",
            onPress: () => setDeleteConfirmVisible(false),
          },
          {
            key: "confirm",
            label: "Verwijderen",
            tone: "destructive",
            icon: "delete-forever",
            onPress: () => void runDeleteFlow(),
          },
        ]}
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
    marginBottom: spacing.lg,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  brandPrimary: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  brandSecondary: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "400",
    letterSpacing: -0.4,
  },
  sectionBlock: {
    gap: spacing.xs,
  },
  summarySectionBlock: {
    marginBottom: spacing.xl,
  },
  primarySectionSpacing: {
    marginBottom: spacing.xl,
  },
  narrativeBlock: {
    marginBottom: spacing.xs,
  },
  inlineEditAction: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  editedMetaWrap: {
    marginTop: spacing.xxs,
  },
  editedMetaText: {
    fontStyle: "italic",
    fontSize: 12,
    lineHeight: 16,
  },
  actionStackDefault: {
    marginTop: spacing.md,
  },
  actionStackShortContent: {
    marginTop: spacing.xs,
  },
});
