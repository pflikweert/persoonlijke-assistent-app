import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, Share, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";

import {
  ExportPeriodSelectorModal,
  type ExportPeriodSelectorTab,
} from "@/components/feedback/export-period-selector-modal";
import { BackgroundTaskStatusCard } from "@/components/feedback/background-task-status-card";
import { ConfirmSheet } from "@/components/feedback/destructive-confirm-sheet";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ChoiceInputGroup } from "@/components/ui/radio-choice-group";
import {
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
  SurfaceSection,
} from "@/components/ui/screen-primitives";
import {
  SettingsPageHero,
  SettingsStateBody,
  SettingsStateIcon,
  SettingsTopNav,
} from "@/components/ui/settings-screen-primitives";
import {
  ALL_DATE_SCOPE,
  classifyUnknownError,
  describeDateScope,
  downloadUserArchive,
  dismissArchiveExportTaskNotice,
  fetchArchiveExportTaskById,
  fetchLatestArchiveExportTask,
  getArchiveExportDownloadUrl,
  listSelectableDays,
  listSelectableMonths,
  listSelectableWeeks,
  previewArchiveScope,
  startStructuredArchiveExport,
  type ArchiveExportTask,
  type ArchiveExportPreview,
  type DateScope,
  type SelectableDay,
  type SelectablePeriod,
} from "@/services";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

type ExportState = "choose" | "review" | "loading" | "success" | "error";
type ExportMode = "all" | "period";
type ExportFormat = "single" | "structured";

const BACKGROUND_POLL_MS = 3500;

type ExportResultMeta = {
  fileUri?: string;
};

export default function SettingsExportScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [state, setState] = useState<ExportState>("choose");
  const [mode, setMode] = useState<ExportMode>("all");
  const [format, setFormat] = useState<ExportFormat>("single");
  const [includeMoments, setIncludeMoments] = useState(true);
  const [includeDays, setIncludeDays] = useState(true);
  const [includeWeeks, setIncludeWeeks] = useState(true);
  const [includeMonths, setIncludeMonths] = useState(true);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [periodSelectorVisible, setPeriodSelectorVisible] = useState(false);
  const [periodSelectorTab, setPeriodSelectorTab] =
    useState<ExportPeriodSelectorTab>("day");
  const [scope, setScope] = useState<DateScope>(ALL_DATE_SCOPE);
  const [preview, setPreview] = useState<ArchiveExportPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMeta, setResultMeta] = useState<ExportResultMeta | null>(null);
  const [archiveTask, setArchiveTask] = useState<ArchiveExportTask | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [replaceStructuredExportVisible, setReplaceStructuredExportVisible] = useState(false);
  const [replaceStructuredExportBusy, setReplaceStructuredExportBusy] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [days, setDays] = useState<SelectableDay[]>([]);
  const [dayLoading, setDayLoading] = useState(false);
  const [dayError, setDayError] = useState<string | null>(null);

  const [weeks, setWeeks] = useState<SelectablePeriod[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);
  const [weekError, setWeekError] = useState<string | null>(null);

  const [months, setMonths] = useState<SelectablePeriod[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthError, setMonthError] = useState<string | null>(null);

  async function openNativeShare(fileUri?: string): Promise<void> {
    if (!fileUri) {
      return;
    }

    await Share.share({
      title: "Mijn archief",
      message: "Je archief staat klaar om te delen of openen.",
      url: fileUri,
    });
  }

  const hasStructuredSelection = includeMoments || includeDays || includeWeeks || includeMonths;
  const canToggleAudio = preview?.entries ? preview.entries > 0 : true;
  const activeArchiveTask =
    archiveTask && !archiveTask.noticeDismissedAt ? archiveTask : null;
  const hasStructuredTaskLoading =
    activeArchiveTask?.status === "queued" || activeArchiveTask?.status === "running";
  const hasStructuredTaskCompleted = activeArchiveTask?.status === "completed";
  const showIdleState = state === "choose" && !hasStructuredTaskLoading && !hasStructuredTaskCompleted;
  const showPreparingState = state === "loading" || hasStructuredTaskLoading;
  const showReadyState = hasStructuredTaskCompleted;
  const readyFileName = activeArchiveTask?.resultFileName ?? "Exportbestand";
  const readyFileTypeLabel =
    activeArchiveTask?.resultMimeType === "application/zip"
      ? "ZIP archief (.zip)"
      : "Markdownbestand (.md)";
  const structuredWarningsCount =
    activeArchiveTask && activeArchiveTask.status === "completed"
      ? Array.isArray((activeArchiveTask.resultPayload as { warnings?: unknown })?.warnings)
        ? ((activeArchiveTask.resultPayload as { warnings?: unknown }).warnings as unknown[]).length
        : activeArchiveTask.warningCount
      : 0;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const latest = await fetchLatestArchiveExportTask();
        if (cancelled || !latest) {
          return;
        }
        setArchiveTask(latest);
        if (latest.status === "queued" || latest.status === "running") {
          setCurrentTaskId(latest.id);
        }
      } catch {
        // Stil falen; exportflow blijft bruikbaar.
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }

    if (!currentTaskId) {
      return;
    }

    let cancelled = false;
    const poll = async () => {
      try {
        const nextTask = await fetchArchiveExportTaskById(currentTaskId);
        if (cancelled || !nextTask) {
          return;
        }
        setArchiveTask(nextTask);
        if (nextTask.status !== "queued" && nextTask.status !== "running") {
          setCurrentTaskId(null);
        }
      } catch {
        // Stil falen; volgende poll pakt het op.
      }
    };

    void poll();
    pollTimerRef.current = setInterval(() => {
      void poll();
    }, BACKGROUND_POLL_MS);

    return () => {
      cancelled = true;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [currentTaskId]);

  function applyScope(nextScope: DateScope) {
    setScope(nextScope);
    setPreview(null);
    setErrorMessage(null);
    setState("choose");
  }

  async function ensureDaysLoaded() {
    if (dayLoading || days.length > 0) {
      return;
    }
    setDayLoading(true);
    setDayError(null);
    try {
      const result = await listSelectableDays();
      setDays(result);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setDayError(parsed.message);
    } finally {
      setDayLoading(false);
    }
  }

  async function ensureWeeksLoaded() {
    if (weekLoading || weeks.length > 0) {
      return;
    }
    setWeekLoading(true);
    setWeekError(null);
    try {
      const result = await listSelectableWeeks();
      setWeeks(result);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setWeekError(parsed.message);
    } finally {
      setWeekLoading(false);
    }
  }

  async function ensureMonthsLoaded() {
    if (monthLoading || months.length > 0) {
      return;
    }
    setMonthLoading(true);
    setMonthError(null);
    try {
      const result = await listSelectableMonths();
      setMonths(result);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setMonthError(parsed.message);
    } finally {
      setMonthLoading(false);
    }
  }

  async function openPeriodSelector(initialTab: ExportPeriodSelectorTab = "day") {
    setPeriodSelectorTab(initialTab);
    if (initialTab === "day") {
      await ensureDaysLoaded();
    } else if (initialTab === "week") {
      await ensureWeeksLoaded();
    } else {
      await ensureMonthsLoaded();
    }
    setPeriodSelectorVisible(true);
  }

  function handlePeriodTabChange(nextTab: ExportPeriodSelectorTab) {
    setPeriodSelectorTab(nextTab);
    if (nextTab === "day") {
      void ensureDaysLoaded();
      return;
    }
    if (nextTab === "week") {
      void ensureWeeksLoaded();
      return;
    }
    void ensureMonthsLoaded();
  }

  async function handleSelectMode(nextMode: ExportMode) {
    setMode(nextMode);
    if (nextMode === "all") {
      applyScope(ALL_DATE_SCOPE);
      setPeriodSelectorVisible(false);
      return;
    }
    await ensureDaysLoaded();
    setPeriodSelectorTab("day");
    setPeriodSelectorVisible(true);
  }

  async function handlePrepareReview() {
    if (format === "structured" && !hasStructuredSelection) {
      setErrorMessage("Kies minimaal één onderdeel voor gestructureerde export.");
      return;
    }

    setPreviewLoading(true);
    setErrorMessage(null);
    setState("review");
    try {
      const nextPreview = await previewArchiveScope(scope);
      setPreview(nextPreview);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setErrorMessage(parsed.message);
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleDownload() {
    if (format !== "single") {
      return;
    }

    if (state === "loading") {
      return;
    }

    setState("loading");
    setErrorMessage(null);
    setResultMeta(null);

    try {
      const result = await downloadUserArchive(scope);
      if (result.status === "empty") {
        setState("review");
        setPreview({
          scope,
          hasContent: false,
          isSparse: false,
          days: 0,
          entries: 0,
          audioEntries: 0,
          weekReflections: 0,
          monthReflections: 0,
        });
        setErrorMessage("In deze selectie is nog niets om te bewaren.");
        return;
      }

      if (Platform.OS !== "web") {
        await openNativeShare(result.fileUri);
      }

      setResultMeta({ fileUri: result.fileUri });
      setState("success");
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setErrorMessage(parsed.message);
      setState("error");
    }
  }

  const scopeDescription = describeDateScope(scope);

  async function handleStartStructuredExport() {
    if (!hasStructuredSelection) {
      setErrorMessage("Kies minimaal één onderdeel voor gestructureerde export.");
      return;
    }

    setState("loading");
    setErrorMessage(null);

    try {
      const task = await startStructuredArchiveExport({
        scope,
        includeMoments,
        includeDays,
        includeWeeks,
        includeMonths,
        includeAudio,
      });
      setArchiveTask(task);
      setCurrentTaskId(task.id);
      setState("success");
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setErrorMessage(parsed.message);
      setState("error");
    }
  }

  async function handleDownloadStructuredArtifact() {
    if (!activeArchiveTask) {
      return;
    }
    const url = await getArchiveExportDownloadUrl(activeArchiveTask);
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    await Linking.openURL(url);
  }

  async function handleConfirmReplaceStructuredExport() {
    if (!activeArchiveTask) {
      setReplaceStructuredExportVisible(false);
      setState("choose");
      return;
    }

    setReplaceStructuredExportBusy(true);
    setErrorMessage(null);
    try {
      await dismissArchiveExportTaskNotice(activeArchiveTask.id);
      setArchiveTask((previous) =>
        previous
          ? {
              ...previous,
              noticeDismissedAt: new Date().toISOString(),
            }
          : previous,
      );
      setCurrentTaskId(null);
      setState("choose");
      setReplaceStructuredExportVisible(false);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setErrorMessage(parsed.message);
      setReplaceStructuredExportVisible(false);
    } finally {
      setReplaceStructuredExportBusy(false);
    }
  }

  function renderStateHero({
    icon,
    eyebrow,
    title,
    subtitle,
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    eyebrow?: string;
    title: string;
    subtitle: string;
  }) {
    return (
      <ThemedView style={styles.stateHeroWrap}>
        <ThemedView style={[styles.stateHeroIconCircle, { backgroundColor: palette.surfaceLow }]}>
          <MaterialIcons name={icon} size={42} color={palette.primary} />
        </ThemedView>
        {eyebrow ? (
          <ThemedText type="meta" style={{ color: palette.primary }}>
            {eyebrow}
          </ThemedText>
        ) : null}
        <ThemedText type="screenTitle" style={styles.stateHeroTitle}>
          {title}
        </ThemedText>
        <ThemedText type="bodySecondary" style={[styles.stateHeroSubtitle, { color: palette.muted }]}> 
          {subtitle}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <ScreenContainer
        scrollable
        backgroundTone="flat"
        contentContainerStyle={styles.scrollContent}
        fixedHeader={
          <SettingsTopNav
            onBack={() => router.back()}
            onMenu={() => setMenuVisible(true)}
            title="Instellingen"
          />
        }
      >
        <SettingsPageHero
          title="Archief downloaden"
          subtitle="Kies wat je wilt meenemen naar je eigen archief."
        />

        {showIdleState ? (
          <ThemedView style={styles.stack}>
            <SurfaceSection title="Wat wil je bewaren?">
              <SettingsStateBody>
                <SettingsStateIcon
                  icon="download"
                  iconColor={palette.primary}
                  backgroundColor={palette.surfaceLow}
                />

                <ThemedView style={styles.selectorWrap}>
                  <ChoiceInputGroup
                    options={[
                      {
                        key: "all",
                        label: "Alles bewaren",
                        description: "Bewaar alles wat je tot nu toe hebt vastgelegd.",
                        active: mode === "all",
                        onPress: () => void handleSelectMode("all"),
                      },
                      {
                        key: "period",
                        label: "Een periode kiezen",
                        description: "Kies een dag, week of maand om te bewaren.",
                        active: mode === "period",
                        onPress: () => void handleSelectMode("period"),
                      },
                    ]}
                  />

                  {mode === "period" ? (
                    <SecondaryButton
                      label="Periode aanpassen"
                      onPress={() => void openPeriodSelector(periodSelectorTab)}
                    />
                  ) : null}

                </ThemedView>
              </SettingsStateBody>
            </SurfaceSection>

            <SurfaceSection title="Exportvorm">
              <ChoiceInputGroup
                options={[
                  {
                    key: "single",
                    label: "Eén bestand",
                    description: "Direct downloaden als één markdownbestand.",
                    active: format === "single",
                    onPress: () => setFormat("single"),
                  },
                  {
                    key: "structured",
                    label: "Gestructureerde export",
                    description: "Server-side export als markdownstructuur (zip bij meerdere files).",
                    active: format === "structured",
                    onPress: () => setFormat("structured"),
                  },
                ]}
              />

              {format === "structured" ? (
                <ThemedView style={styles.structuredOptionsWrap}>
                  <ChoiceInputGroup
                    inputType="checkbox"
                    options={[
                      {
                        key: "moments",
                        label: "Momenten",
                        active: includeMoments,
                        onPress: () => setIncludeMoments((value) => !value),
                      },
                      {
                        key: "days",
                        label: "Dagen",
                        active: includeDays,
                        onPress: () => setIncludeDays((value) => !value),
                      },
                      {
                        key: "weeks",
                        label: "Weken",
                        active: includeWeeks,
                        onPress: () => setIncludeWeeks((value) => !value),
                      },
                      {
                        key: "months",
                        label: "Maanden",
                        active: includeMonths,
                        onPress: () => setIncludeMonths((value) => !value),
                      },
                      {
                        key: "audio",
                        label: "Audio meenemen",
                        active: includeAudio,
                        disabled: !canToggleAudio,
                        onPress: () => {
                          if (!canToggleAudio) {
                            return;
                          }
                          setIncludeAudio((value) => !value);
                        },
                      },
                    ]}
                  />
                </ThemedView>
              ) : null}
            </SurfaceSection>

            <SurfaceSection title="Gekozen selectie" subtitle={scopeDescription.title}>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {scopeDescription.subtitle}
              </ThemedText>
              <PrimaryButton label="Controleer selectie" onPress={() => void handlePrepareReview()} />
            </SurfaceSection>
          </ThemedView>
        ) : null}

        {state === "review" ? (
          <SurfaceSection title="Controleer je export" subtitle={scopeDescription.title}>
            <SettingsStateBody>
              {renderStateHero({
                icon: "fact-check",
                eyebrow: "Controle",
                title: "Klaar om te starten",
                subtitle: "Check je selectie en start daarna je export.",
              })}

              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {scopeDescription.subtitle}
              </ThemedText>

              {previewLoading ? (
                <StateBlock tone="loading" message="Selectie laden..." detail="Een moment geduld." />
              ) : null}

              {!previewLoading && errorMessage ? (
                <StateBlock
                  tone="error"
                  message="Selectie laden lukt nu niet."
                  detail={errorMessage}
                />
              ) : null}

              {!previewLoading && !errorMessage && preview && !preview.hasContent ? (
                <StateBlock
                  tone="empty"
                  message="In deze selectie is nog niets om te bewaren."
                  detail="Kies een andere selectie of ga terug."
                />
              ) : null}

              {!previewLoading && !errorMessage && preview?.hasContent ? (
                <ThemedView style={styles.metaGrid}>
                  <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                    <ThemedText type="meta">Dagen</ThemedText>
                    <ThemedText type="defaultSemiBold">{preview.days}</ThemedText>
                  </ThemedView>
                  <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                    <ThemedText type="meta">Momenten</ThemedText>
                    <ThemedText type="defaultSemiBold">{preview.entries}</ThemedText>
                  </ThemedView>
                  {includeAudio ? (
                    <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                      <ThemedText type="meta">Audiofragmenten</ThemedText>
                      <ThemedText type="defaultSemiBold">{preview.audioEntries}</ThemedText>
                    </ThemedView>
                  ) : null}
                  <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                    <ThemedText type="meta">Weekreflecties</ThemedText>
                    <ThemedText type="defaultSemiBold">{preview.weekReflections}</ThemedText>
                  </ThemedView>
                  <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                    <ThemedText type="meta">Maandreflecties</ThemedText>
                    <ThemedText type="defaultSemiBold">{preview.monthReflections}</ThemedText>
                  </ThemedView>
                </ThemedView>
              ) : null}

              {!previewLoading && !errorMessage && preview?.hasContent && preview.isSparse ? (
                <StateBlock
                  tone="info"
                  message="In deze selectie zit weinig inhoud."
                  detail="Je kunt doorgaan of iets anders kiezen."
                />
              ) : null}

              <ThemedView style={styles.actionsWrap}>
                <PrimaryButton
                  label={format === "single" ? "Download nu" : "Start export op achtergrond"}
                  onPress={() =>
                    format === "single"
                      ? void handleDownload()
                      : void handleStartStructuredExport()
                  }
                  disabled={
                    !preview?.hasContent ||
                    previewLoading ||
                    (format === "structured" && !hasStructuredSelection)
                  }
                />
                <SecondaryButton
                  label="Selectie aanpassen"
                  icon="arrow-back"
                  size="cta"
                  onPress={() => {
                    setErrorMessage(null);
                    setState("choose");
                  }}
                />
              </ThemedView>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {showPreparingState ? (
          <SurfaceSection>
            <SettingsStateBody>
              {renderStateHero({
                icon: "hourglass-empty",
                title: "Archief downloaden",
                subtitle: "Bestand wordt voorbereid. Een moment geduld.",
              })}

              <ThemedView style={styles.metaGrid}>
                <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                  <ThemedText type="meta">Type</ThemedText>
                  <ThemedText type="defaultSemiBold">{format === "single" ? "Markdown (.md)" : "ZIP archief (.zip)"}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                  <ThemedText type="meta">Inhoud</ThemedText>
                  <ThemedText type="defaultSemiBold">
                    {preview ? `${preview.entries} momenten, ${preview.days} dagen` : "Je selectie wordt verwerkt"}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              {hasStructuredTaskLoading ? (
                <BackgroundTaskStatusCard
                  title="Export wordt voorbereid"
                  body="Je kunt dit scherm verlaten. We blijven de voortgang bijhouden."
                  status={activeArchiveTask?.status === "queued" ? "queued" : "running"}
                  progressCurrent={activeArchiveTask?.progressCurrent ?? 0}
                  progressTotal={activeArchiveTask?.progressTotal ?? 1}
                  detailLabel={activeArchiveTask?.detailLabel}
                />
              ) : null}
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {state === "success" && format === "single" ? (
          <SurfaceSection
            title="Download klaar"
            subtitle="Je selectie staat voor je klaar."
          >
            <SettingsStateBody>
              <SettingsStateIcon
                icon="check-circle-outline"
                iconColor={palette.primary}
                backgroundColor={palette.surfaceLow}
              />
              <ThemedView style={styles.actionsWrap}>
                <PrimaryButton
                  label="Download selectie"
                  onPress={() => void handleDownload()}
                />
                {Platform.OS !== "web" && resultMeta?.fileUri ? (
                  <SecondaryButton
                    label="Open delen"
                    size="cta"
                    onPress={() => void openNativeShare(resultMeta.fileUri)}
                  />
                ) : null}
                <SecondaryButton
                  label="Nieuwe export maken"
                  icon="arrow-back"
                  size="cta"
                  onPress={() => {
                    setState("choose");
                    setErrorMessage(null);
                  }}
                />
              </ThemedView>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {showReadyState ? (
          <SurfaceSection>
            <SettingsStateBody>
              {renderStateHero({
                icon: "check-circle-outline",
                eyebrow: "Download klaar",
                title: "Archief downloaden",
                subtitle: "Je bestand staat voor je klaar.",
              })}

              <ThemedView style={styles.metaGrid}>
                <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                  <ThemedText type="meta">Bestandstype</ThemedText>
                  <ThemedText type="defaultSemiBold">{readyFileTypeLabel}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.metaCard, { backgroundColor: palette.surfaceLow }]}> 
                  <ThemedText type="meta">Bestandsnaam</ThemedText>
                  <ThemedText type="defaultSemiBold" numberOfLines={2}>{readyFileName}</ThemedText>
                </ThemedView>
              </ThemedView>

              {structuredWarningsCount > 0 ? (
                <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                  Waarschuwingen: {structuredWarningsCount}
                </ThemedText>
              ) : null}
              <ThemedView style={styles.actionsWrap}>
                <PrimaryButton
                  label="Download export"
                  icon="download"
                  onPress={() => void handleDownloadStructuredArtifact()}
                />
                <SecondaryButton
                  label="Nieuwe export maken"
                  icon="arrow-back"
                  size="cta"
                  onPress={() => setReplaceStructuredExportVisible(true)}
                />
              </ThemedView>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {state === "error" ? (
          <SurfaceSection title="Downloaden" subtitle="Downloaden lukt nu niet.">
            <SettingsStateBody>
              <SettingsStateIcon
                icon="warning-amber"
                iconColor={palette.destructiveSoftText}
                backgroundColor={palette.destructiveSoftBackground}
              />
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {errorMessage ?? "Probeer het zo opnieuw."}
              </ThemedText>
              <ThemedView style={styles.actionsWrap}>
                <PrimaryButton
                  label="Probeer opnieuw"
                  onPress={() =>
                    format === "single"
                      ? void handleDownload()
                      : void handleStartStructuredExport()
                  }
                />
                <SecondaryButton
                  label="Selectie aanpassen"
                  icon="arrow-back"
                  size="cta"
                  onPress={() => {
                    setState("choose");
                    setErrorMessage(null);
                  }}
                />
              </ThemedView>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </ScreenContainer>

      <ExportPeriodSelectorModal
        visible={periodSelectorVisible}
        activeTab={periodSelectorTab}
        onClose={() => setPeriodSelectorVisible(false)}
        onChangeTab={handlePeriodTabChange}
        dayLoading={dayLoading}
        dayError={dayError}
        days={days}
        weekLoading={weekLoading}
        weekError={weekError}
        weeks={weeks}
        monthLoading={monthLoading}
        monthError={monthError}
        months={months}
        onSelectDay={(day) => {
          applyScope({ kind: "day", date: day.date });
          setMode("period");
          setPeriodSelectorVisible(false);
        }}
        onSelectWeek={(period) => {
          applyScope({
            kind: "week",
            startDate: period.startDate,
            endDate: period.endDate,
            label: period.label,
          });
          setMode("period");
          setPeriodSelectorVisible(false);
        }}
        onSelectMonth={(period) => {
          applyScope({
            kind: "month",
            startDate: period.startDate,
            endDate: period.endDate,
            label: period.label,
          });
          setMode("period");
          setPeriodSelectorVisible(false);
        }}
      />

      <ConfirmSheet
        visible={replaceStructuredExportVisible}
        title="Nieuwe export starten?"
        message="Je huidige export wordt gesloten als je een nieuwe selectie wilt maken."
        detail="Je kunt het huidige bestand nog steeds bewaren als je het eerst downloadt."
        processing={replaceStructuredExportBusy}
        actions={[
          {
            key: "cancel",
            label: "Doorgaan met huidige export",
            onPress: () => setReplaceStructuredExportVisible(false),
          },
          {
            key: "confirm",
            label: "Nieuwe export maken",
            tone: "destructive",
            icon: "autorenew",
            onPress: () => void handleConfirmReplaceStructuredExport(),
          },
        ]}
        onCancel={() => setReplaceStructuredExportVisible(false)}
        onConfirm={() => void handleConfirmReplaceStructuredExport()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  stack: {
    gap: spacing.xl,
  },
  selectorWrap: {
    gap: spacing.md,
    width: "100%",
  },
  actionsWrap: {
    width: "100%",
    gap: spacing.sm,
  },
  structuredOptionsWrap: {
    width: "100%",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  stateHeroWrap: {
    width: "100%",
    alignItems: "center",
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  stateHeroIconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  stateHeroTitle: {
    textAlign: "center",
  },
  stateHeroSubtitle: {
    textAlign: "center",
    maxWidth: 420,
  },
  metaGrid: {
    width: "100%",
    gap: spacing.sm,
  },
  metaCard: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
});
