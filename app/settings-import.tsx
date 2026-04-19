import * as DocumentPicker from "expo-document-picker";
import { readAsStringAsync } from "expo-file-system/legacy";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";

import { BackgroundTaskStatusCard } from "@/components/feedback/background-task-status-card";
import { ConfirmSheet } from "@/components/feedback/destructive-confirm-sheet";
import { ProcessingScreen } from "@/components/feedback/processing-screen";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
    MetaText,
    PrimaryButton,
    ScreenContainer,
    SecondaryButton,
    SurfaceSection,
} from "@/components/ui/screen-primitives";
import {
  SettingsPageHero,
  SettingsStateBody,
  SettingsStateIcon,
  SettingsTopNav,
} from "@/components/ui/settings-screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    fetchImportBackgroundTaskById,
    fetchLatestImportBackgroundTask,
    invokeMarkdownImport,
    isChatGptMarkdownImportEnabled,
    parseImportMarkdownFile,
    summarizePreviewDate,
} from "@/services";
import type {
    ImportedMarkdownPreview,
    ImportBackgroundTask,
  MarkdownImportMode,
} from "@/services/import";
import { colorTokens, radius, spacing } from "@/theme";

type FlowState = "idle" | "selected" | "loading" | "success" | "error";

type ResultStatus = {
  tone: "success" | "info" | "error";
  message: string;
  detail?: string;
};

const BACKGROUND_POLL_MS = 3500;

async function readImportedMarkdown(uri: string): Promise<string> {
  if (
    uri.startsWith("data:") ||
    uri.startsWith("blob:") ||
    uri.startsWith("http")
  ) {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Kon het gekozen bestand niet lezen.");
    }

    return response.text();
  }

  return readAsStringAsync(uri);
}

function formatRange(preview: ImportedMarkdownPreview | null): string {
  if (!preview?.firstDate || !preview.lastDate) {
    return "-";
  }

  return `${summarizePreviewDate(preview.firstDate)} t/m ${summarizePreviewDate(preview.lastDate)}`;
}

function formatTypeLabel(preview: ImportedMarkdownPreview | null): string {
  if (!preview) {
    return "-";
  }

  return preview.format === "journal_archive" ? "App-archief" : "Nexus ChatGPT";
}

function formatEntryLabel(preview: ImportedMarkdownPreview | null): string {
  if (!preview) {
    return "Entries";
  }

  return preview.format === "journal_archive" ? "Entries" : "Berichten";
}

export default function SettingsImportScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const [menuVisible, setMenuVisible] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [preview, setPreview] = useState<ImportedMarkdownPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [replaceConfirmVisible, setReplaceConfirmVisible] = useState(false);
  const [resultStatus, setResultStatus] = useState<ResultStatus | null>(null);
  const [backgroundTask, setBackgroundTask] = useState<ImportBackgroundTask | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const importEnabled = isChatGptMarkdownImportEnabled();

  const previewTitle = useMemo(() => {
    if (!preview) {
      return null;
    }

    return (
      preview.conversationTitle ||
      preview.conversationAlias ||
      "Onbekende conversatie"
    );
  }, [preview]);

  function resetToIdle() {
    setFlowState("idle");
    setPreview(null);
    setResultStatus(null);
    setReplaceConfirmVisible(false);
  }

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!importEnabled) {
        return;
      }

      try {
        const latest = await fetchLatestImportBackgroundTask();
        if (!cancelled) {
          setBackgroundTask(latest);
          if (latest?.status === "queued" || latest?.status === "running") {
            setCurrentTaskId(latest.id);
          }
        }
      } catch {
        // Stil falen; importflow blijft bruikbaar.
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [importEnabled]);

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
        const nextTask = await fetchImportBackgroundTaskById(currentTaskId);
        if (cancelled || !nextTask) {
          return;
        }

        setBackgroundTask(nextTask);
        if (nextTask.status !== "queued" && nextTask.status !== "running") {
          setCurrentTaskId(null);
          setFlowState(nextTask.status === "failed" ? "error" : "success");
          setResultStatus({
            tone: nextTask.status === "failed" ? "error" : nextTask.warningCount > 0 ? "info" : "success",
            message:
              nextTask.status === "failed"
                ? "Import afgerond met aandachtspunten."
                : "Import en naverwerking zijn afgerond.",
            detail:
              nextTask.errorMessage ??
              (nextTask.warningCount > 0
                ? `${nextTask.warningCount} stap(pen) vroegen aandacht.`
                : undefined),
          });
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

  async function handlePickFile() {
    if (!importEnabled) {
      setFlowState("error");
      setResultStatus({
        tone: "error",
        message: "Importeren is hier niet beschikbaar.",
      });
      return;
    }

    setLoadingPreview(true);
    setResultStatus(null);
    setReplaceConfirmVisible(false);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/markdown", "text/plain"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      if (!asset?.uri || !asset.name) {
        throw new Error("Het gekozen bestand bevat geen leesbare data.");
      }

      const markdown = await readImportedMarkdown(asset.uri);
      const nextPreview = parseImportMarkdownFile({
        fileName: asset.name,
        markdown,
      });

      if (nextPreview.messages.length === 0) {
        throw new Error("Geen importeerbare entries gevonden in dit markdownbestand.");
      }

      setPreview(nextPreview);
      setFlowState("selected");
    } catch (error) {
      setPreview(null);
      setFlowState("error");
      setResultStatus({
        tone: "error",
        message: "Er ging iets mis. Probeer het opnieuw.",
        detail: error instanceof Error ? error.message : "Onbekende fout.",
      });
    } finally {
      setLoadingPreview(false);
    }
  }

  async function runImport(importMode?: MarkdownImportMode) {
    if (!preview || !importEnabled) {
      return;
    }

    setFlowState("loading");
    setResultStatus(null);
    setReplaceConfirmVisible(false);

    try {
      const result = await invokeMarkdownImport({
        preview,
        importMode,
      });

      if (result.requiresReplaceConfirmation) {
        setReplaceConfirmVisible(true);
        setFlowState("selected");
        return;
      }

      setBackgroundTask(result.backgroundTask);
      setCurrentTaskId(result.backgroundTask.id);
      setFlowState("selected");
      setResultStatus({
        tone: "info",
        message: "Import gestart. We werken je dagboek op de achtergrond bij.",
        detail: "Je kunt dit scherm sluiten. De voortgang blijft zichtbaar op Vandaag.",
      });
    } catch (error) {
      setResultStatus({
        tone: "error",
        message: "Er ging iets mis. Probeer het opnieuw.",
        detail: error instanceof Error ? error.message : "Onbekende fout.",
      });
      setFlowState("error");
    }
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
          title="Importeren"
          subtitle="Importeer eerder geschreven bestanden."
        />

        {!importEnabled ? (
          <SurfaceSection title="Importeren is in deze omgeving uitgeschakeld.">
            <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
              Deze flow blijft lokaal beschikbaar voor testen.
            </ThemedText>
          </SurfaceSection>
        ) : null}

        {importEnabled && flowState === "idle" ? (
          <SurfaceSection
            title="Kies een bestand"
            subtitle="Kies een Nexus ChatGPT-export of een app-archief."
          >
            <SettingsStateBody>
              <SettingsStateIcon
                icon="upload-file"
                iconColor={palette.primary}
                backgroundColor={palette.surfaceLow}
              />

              <PrimaryButton
                label={loadingPreview ? "Bestand laden..." : "Kies bestand"}
                onPress={() => void handlePickFile()}
                disabled={loadingPreview}
              />

              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                We detecteren automatisch het juiste importformaat.
              </ThemedText>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {importEnabled && flowState === "selected" && preview ? (
          <SurfaceSection
            title="Klaar voor import"
            subtitle="Controleer kort wat er wordt toegevoegd."
          >
            <ThemedView
              style={styles.previewCard}
            >
              <ThemedView style={styles.previewGroup}>
                <MetaText>Type</MetaText>
                <ThemedText type="defaultSemiBold">
                  {formatTypeLabel(preview)}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.previewGroup}>
                <MetaText>Bestand</MetaText>
                <ThemedText type="defaultSemiBold">
                  {preview.fileName}
                </ThemedText>
                {previewTitle ? (
                  <ThemedText
                    type="bodySecondary"
                    style={{ color: palette.muted }}
                  >
                    {previewTitle}
                  </ThemedText>
                ) : null}
              </ThemedView>

              <ThemedView style={styles.metaGrid}>
                <ThemedView style={styles.metaItem}>
                  <MetaText>{formatEntryLabel(preview)}</MetaText>
                  <ThemedText type="defaultSemiBold">
                    {String(preview.userEntryCount)}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.metaItem}>
                  <MetaText>Dagen</MetaText>
                  <ThemedText type="defaultSemiBold">
                    {String(preview.uniqueDayCount)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.previewGroup}>
                <MetaText>Datumrange</MetaText>
                <ThemedText
                  type="bodySecondary"
                  style={{ color: palette.muted }}
                >
                  {formatRange(preview)}
                </ThemedText>
              </ThemedView>

              {preview.exampleEntries.length > 0 ? (
                <ThemedView style={styles.previewGroup}>
                  <MetaText>Voorbeeld</MetaText>
                  <ThemedView style={styles.examples}>
                    {preview.exampleEntries.slice(0, 2).map((entry, index) => (
                      <ThemedView
                        key={`${index}-${entry}`}
                        lightColor={colorTokens.light.surfaceLow}
                        darkColor={colorTokens.dark.surfaceLow}
                        style={styles.exampleCard}
                      >
                        <ThemedText
                          type="bodySecondary"
                          style={{ color: palette.muted }}
                        >
                          {entry}
                        </ThemedText>
                      </ThemedView>
                    ))}
                  </ThemedView>
                </ThemedView>
              ) : null}
            </ThemedView>

            <ThemedView style={styles.actions}>
              <PrimaryButton
                label="Importeer bestanden"
                onPress={() => void runImport()}
              />
              <SecondaryButton
                label="Andere bestanden kiezen"
                onPress={resetToIdle}
              />
            </ThemedView>
          </SurfaceSection>
        ) : null}

        {importEnabled &&
        backgroundTask &&
        (backgroundTask.status === "queued" ||
          backgroundTask.status === "running") ? (
          <SurfaceSection
            title="Import voortgang"
            subtitle="Deze verwerking draait door op de achtergrond."
          >
            <BackgroundTaskStatusCard
              title="Import loopt door"
              body="Je dagboek wordt bijgewerkt. Je kunt naar Vandaag gaan terwijl dit doorgaat."
              status={backgroundTask.status}
              progressCurrent={backgroundTask.progressCurrent}
              progressTotal={backgroundTask.progressTotal}
              detailLabel={backgroundTask.detailLabel}
              actionLabel="Ga naar Vandaag"
              onPressAction={() => router.replace("/(tabs)")}
            />
          </SurfaceSection>
        ) : null}

        {importEnabled &&
        (flowState === "success" || flowState === "error") &&
        resultStatus ? (
          <SurfaceSection
            title="Importeren"
            subtitle={
              resultStatus.tone === "success"
                ? "Je bestand is verwerkt."
                : resultStatus.tone === "info"
                  ? "Niet alles is zonder aandachtspunt verwerkt."
                  : "Niet alles kon worden geïmporteerd."
            }
          >
            <SettingsStateBody>
              <SettingsStateIcon
                icon={
                  resultStatus.tone === "success"
                    ? "check-circle-outline"
                    : resultStatus.tone === "info"
                      ? "info-outline"
                      : "warning-amber"
                }
                iconColor={
                  resultStatus.tone === "success" || resultStatus.tone === "info"
                    ? palette.primary
                    : palette.destructiveSoftText
                }
                backgroundColor={
                  resultStatus.tone === "error"
                    ? palette.destructiveSoftBackground
                    : palette.surfaceLow
                }
              />

              <ThemedText type="defaultSemiBold">
                {resultStatus.tone === "error"
                  ? "Importeren niet gelukt"
                  : "Importeren gelukt"}
              </ThemedText>

              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {resultStatus.message}
              </ThemedText>

              {resultStatus.detail ? (
                <ThemedText
                  type="bodySecondary"
                  style={{ color: palette.muted }}
                >
                  {resultStatus.detail}
                </ThemedText>
              ) : null}

              <ThemedView style={styles.actions}>
                <PrimaryButton
                  label="Nog een bestand importeren"
                  onPress={resetToIdle}
                />
                <SecondaryButton
                  label="Terug naar Instellingen"
                  onPress={() => router.back()}
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

        <ConfirmSheet
          visible={importEnabled && replaceConfirmVisible}
          title="Import aanpassen"
          message="Voor deze importbron is al een import gedaan. Kies hoe je wilt doorgaan."
          detail="Vervangen en toevoegen verwerkt alleen nieuwe of aangepaste momenten. Alleen de modus Alles vervangen zal ontbrekende oude items verwijderen."
          actions={[
            {
              key: "cancel",
              label: "Annuleren",
              onPress: () => setReplaceConfirmVisible(false),
            },
            {
              key: "merge_changed",
              label: "Vervangen en toevoegen",
              onPress: () => void runImport("merge_changed"),
            },
            {
              key: "replace_all",
              label: "Alles vervangen",
              tone: "destructive",
              icon: "autorenew",
              onPress: () => void runImport("replace_all"),
            },
          ]}
          processing={flowState === "loading"}
          onCancel={() => setReplaceConfirmVisible(false)}
          onConfirm={() => void runImport("replace_all")}
        />
      </ScreenContainer>

      <ProcessingScreen visible={importEnabled && flowState === "loading"} variant="chatgpt-import" />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  actions: {
    width: "100%",
    gap: spacing.md,
  },
  previewCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  previewGroup: {
    gap: spacing.xs,
  },
  metaGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  metaItem: {
    flex: 1,
    gap: spacing.xxs,
  },
  examples: {
    gap: spacing.sm,
  },
  exampleCard: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
