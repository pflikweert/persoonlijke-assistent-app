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
import {
  EntryPhotoGallery,
} from "@/components/journal/entry-photo-gallery";
import { ScreenHeader } from "@/components/layout/screen-header";
import { BottomTabBarStandalone } from "@/components/navigation/BottomTabBar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  DetailSectionHeader,
  DetailScreenHero,
} from "@/components/ui/detail-screen-primitives";
import { CopyIconButton } from "@/components/ui/copy-icon-button";
import {
  HeaderIconButton,
} from "@/components/ui/header-icon-button";
import {
  ScreenContainer,
  StateBlock,
} from "@/components/ui/screen-primitives";
import { BrandHeaderLockup } from "@/components/ui/screen-scaffolds";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  createEntryAudioSignedUrl,
  deleteNormalizedEntryById,
  type EntryPhotoAsset,
  fetchNormalizedEntryById,
  generateReflection,
  hasReflectionForAnchorDate,
  regenerateDayJournalByDate,
  updateNormalizedEntryById,
} from "@/services";
import { buildEntryCopyPayload } from "@/src/lib/copy-payloads";
import { colorTokens, radius, spacing } from "@/theme";

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

function formatAddedAtAuditLabel(value: string): string | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const label = parsed.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const time = parsed.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `Toegevoegd ${label} om ${time}`;
}

function formatLaterAddedHeroLabel(value: string): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const label = parsed.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return `${label} · later toegevoegd`;
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

function formatEditedAuditLabel(value: string): string | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const time = parsed.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `Bijgewerkt om ${time}`;
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
  const [photoRefreshTick, setPhotoRefreshTick] = useState(0);
  const [photoSnapshot, setPhotoSnapshot] = useState<EntryPhotoAsset[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] =
    useState<Awaited<ReturnType<typeof fetchNormalizedEntryById>>>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [audioPlaybackUrl, setAudioPlaybackUrl] = useState<string | null>(null);
  const [audioDownloadUrl, setAudioDownloadUrl] = useState<string | null>(null);
  const [audioUrlStatus, setAudioUrlStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [audioUrlError, setAudioUrlError] = useState<string | null>(null);
  const [audioReloadTick, setAudioReloadTick] = useState(0);
  const [audioRetrying, setAudioRetrying] = useState(false);

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
        setAudioUrlStatus("idle");
        setAudioUrlError(null);
        return;
      }

      setAudioUrlStatus("loading");
      setAudioUrlError(null);

      try {
        const extensionFromMime =
          entry?.audio_mime_type?.split("/")[1]?.split(";")[0]?.toLowerCase() ||
          "m4a";
        const downloadFileName = formatAudioDownloadFileName({
          title: entry?.title ?? "moment",
          capturedAtIso: entry?.captured_at ?? new Date().toISOString(),
          extension: extensionFromMime,
        });

        const playback = await createEntryAudioSignedUrl({ storagePath: path });
        let download: string | null = null;
        try {
          download = await createEntryAudioSignedUrl({
            storagePath: path,
            downloadFileName,
          });
        } catch {
          download = null;
        }

        if (!cancelled) {
          setAudioPlaybackUrl(playback);
          setAudioDownloadUrl(download);
          setAudioUrlStatus("ready");
          setAudioUrlError(null);
        }
      } catch (nextError) {
        if (!cancelled) {
          setAudioPlaybackUrl(null);
          setAudioDownloadUrl(null);
          setAudioUrlStatus("error");
          setAudioUrlError(
            nextError instanceof Error
              ? nextError.message
              : "Opname kon niet worden geladen."
          );
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
    entry?.source_type,
    audioReloadTick,
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
  const isLaterAddedMoment = useMemo(() => {
    if (!entry?.captured_at || !entry?.journal_date) {
      return false;
    }

    return entry.captured_at.slice(0, 10) !== entry.journal_date;
  }, [entry?.captured_at, entry?.journal_date]);
  const detailSubtitle = useMemo(() => {
    if (isLaterAddedMoment) {
      return formatLaterAddedHeroLabel(entry?.journal_date ?? "") ?? capturedAtLabel;
    }

    return capturedAtLabel;
  }, [capturedAtLabel, entry?.journal_date, isLaterAddedMoment]);
  const addedAtAuditLabel = useMemo(() => {
    if (!isLaterAddedMoment) {
      return null;
    }

    return formatAddedAtAuditLabel(entry?.captured_at ?? "");
  }, [entry?.captured_at, isLaterAddedMoment]);
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
  const editedAuditLabel = useMemo(
    () => formatEditedAuditLabel(entry?.updated_at ?? ""),
    [entry?.updated_at],
  );
  const hasResolvedPhotoState = photoSnapshot !== null;
  const hasPhotos = (photoSnapshot?.length ?? 0) > 0;
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
  const audioPathMissing =
    entry?.source_type === "audio" && !(entry?.audio_storage_path?.trim());

  const handlePhotosChanged = useCallback(() => {
    setPhotoRefreshTick((current) => current + 1);
  }, []);

  useEffect(() => {
    setPhotoSnapshot(null);
  }, [entry?.raw_entry_id]);

  const handleRetryAudio = useCallback(async () => {
    if (audioRetrying) {
      return;
    }

    setAudioRetrying(true);
    setAudioUrlStatus("loading");
    setAudioUrlError(null);
    try {
      await loadEntry();
      setAudioReloadTick((current) => current + 1);
    } catch (nextError) {
      setAudioUrlStatus("error");
      setAudioUrlError(
        nextError instanceof Error
          ? nextError.message
          : "Opname kon niet opnieuw worden geladen.",
      );
    } finally {
      setAudioRetrying(false);
    }
  }, [audioRetrying, loadEntry]);

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
                <BrandHeaderLockup secondary="Moment" />
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
              subtitle={detailSubtitle}
              subtitleType="meta"
              style={styles.titleBlock}
              titleStyle={{ color: palette.text }}
              subtitleStyle={styles.heroMeta}
            />

            {showAssistantCopy ? (
              <ThemedView style={styles.summarySectionBlock}>
                <DayJournalSummaryInset text={summaryShortText} />
              </ThemedView>
            ) : null}

            {entry.source_type === "audio" && !audioPathMissing ? (
              <ThemedView style={[styles.sectionBlock, styles.primarySectionSpacing]}>
                <DetailSectionHeader
                  icon="mic"
                  title="Opname"
                  tone="muted"
                />
                {audioPlaybackUrl ? (
                  <EntryAudioPlayer
                    sourceUrl={audioPlaybackUrl}
                    durationMs={entry.audio_duration_ms}
                    onRequestDownload={audioDownloadUrl ? handleDownloadAudio : undefined}
                  />
                ) : audioUrlStatus === "loading" ? (
                  <StateBlock
                    tone="loading"
                    message="Opname laden..."
                    detail="We halen je audio op."
                  />
                ) : (
                  <StateBlock
                    tone="error"
                    message="Opname is nu niet beschikbaar"
                    detail={audioUrlError ?? "Probeer opnieuw."}
                  />
                )}

                {!audioPlaybackUrl && audioUrlStatus === "error" ? (
                  audioPathMissing ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Ga naar audio-instellingen"
                      onPress={() => router.push("../../settings-audio")}
                      style={styles.inlineEditAction}
                    >
                      <MaterialIcons name="settings" size={14} color={palette.mutedSoft} />
                      <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                        Audio-instellingen
                      </ThemedText>
                    </Pressable>
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Opname opnieuw laden"
                      accessibilityState={{ disabled: audioRetrying }}
                      disabled={audioRetrying}
                      onPress={() => {
                        void handleRetryAudio();
                      }}
                      style={[
                        styles.inlineEditAction,
                        audioRetrying ? { opacity: 0.6 } : null,
                      ]}
                    >
                      <MaterialIcons name="refresh" size={14} color={palette.mutedSoft} />
                      <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                        {audioRetrying ? "Opname opnieuw laden..." : "Opnieuw laden"}
                      </ThemedText>
                    </Pressable>
                  )
                ) : null}
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
                tone="accent"
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
            </ThemedView>

            <EntryPhotoGallery
              rawEntryId={entry.raw_entry_id}
              refreshToken={photoRefreshTick}
              onPhotosChanged={handlePhotosChanged}
              onPhotosSnapshotChange={setPhotoSnapshot}
            />

            <ThemedView
              style={[
                styles.momentDetailsSection,
                {
                  backgroundColor: palette.surface,
                },
              ]}
            >
              <DetailSectionHeader
                icon="info-outline"
                title="Momentdetails"
                tone="muted"
              />

              {addedAtAuditLabel || (hasEditedTimestamp && editedAuditLabel) ? (
                <ThemedView
                  style={[
                    styles.detailMetaStack,
                    { borderBottomColor: palette.separator },
                  ]}
                >
                  {addedAtAuditLabel ? (
                    <ThemedText type="caption" style={[styles.detailMetaText, { color: palette.mutedSoft }]}>
                      {addedAtAuditLabel}
                    </ThemedText>
                  ) : null}
                  {hasEditedTimestamp && editedAuditLabel ? (
                    <ThemedText type="caption" style={[styles.detailMetaText, { color: palette.mutedSoft }]}>
                      {editedAuditLabel}
                    </ThemedText>
                  ) : null}
                </ThemedView>
              ) : null}

              <ThemedView style={styles.detailActionsStack}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Moment bewerken"
                  onPress={() => setEditVisible(true)}
                  style={styles.detailActionRow}
                >
                  <ThemedView style={styles.detailActionLeading}>
                    <MaterialIcons name="edit" size={16} color={palette.mutedSoft} />
                    <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                      Bewerken
                    </ThemedText>
                  </ThemedView>
                  <MaterialIcons name="chevron-right" size={14} color={palette.mutedSoft} />
                </Pressable>

                {hasResolvedPhotoState && !hasPhotos ? (
                  <EntryPhotoGallery
                    rawEntryId={entry.raw_entry_id}
                    refreshToken={photoRefreshTick}
                    onPhotosChanged={handlePhotosChanged}
                    onPhotosSnapshotChange={setPhotoSnapshot}
                    variant="trigger"
                  />
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={dayActionLabel}
                  onPress={() => goToDayDetail({ includeEntryFocus: true })}
                  style={styles.detailActionRow}
                >
                  <ThemedView style={styles.detailActionLeading}>
                    <MaterialIcons name="calendar-today" size={16} color={palette.mutedSoft} />
                    <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                      {dayActionLabel}
                    </ThemedText>
                  </ThemedView>
                  <MaterialIcons name="chevron-right" size={14} color={palette.mutedSoft} />
                </Pressable>
              </ThemedView>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={deleting ? "Moment verwijderen..." : "Moment verwijderen"}
                accessibilityState={{ disabled: isProcessing }}
                disabled={isProcessing}
                onPress={handleDelete}
                style={[
                  styles.deleteActionRow,
                  { borderTopColor: palette.separator },
                ]}
              >
                <ThemedView style={styles.detailActionLeading}>
                  <MaterialIcons
                    name="delete-outline"
                    size={16}
                    color={palette.destructiveSoftText}
                  />
                  <ThemedText
                    type="bodySecondary"
                    style={{ color: palette.destructiveSoftText }}
                  >
                    {deleting ? "Verwijderen..." : "Verwijderen"}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            </ThemedView>
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
  heroMeta: {
    letterSpacing: 0.9,
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
  momentDetailsSection: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    gap: spacing.md,
  },
  detailMetaStack: {
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.xxs,
  },
  detailMetaText: {
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.05,
  },
  detailActionsStack: {
    gap: spacing.xxs,
  },
  detailActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    minHeight: 38,
    paddingVertical: 6,
  },
  detailActionLeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 1,
  },
  deleteActionRow: {
    minHeight: 38,
    justifyContent: "center",
    marginTop: spacing.xxs,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
