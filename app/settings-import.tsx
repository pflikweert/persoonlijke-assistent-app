import * as DocumentPicker from "expo-document-picker";
import { readAsStringAsync } from "expo-file-system/legacy";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
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
  SettingsScreenHeader,
  SettingsStateBody,
  SettingsStateIcon,
} from "@/components/ui/settings-screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    invokeMarkdownImport,
    isChatGptMarkdownImportEnabled,
    parseImportMarkdownFile,
    refreshImportedChatGptDerivedContent,
    summarizePreviewDate,
} from "@/services";
import type {
    ChatGptImportRefreshProgress,
    ImportedMarkdownPreview,
} from "@/services/import";
import { colorTokens, radius, spacing } from "@/theme";

type FlowState = "idle" | "selected" | "loading" | "success" | "error";

type ResultStatus = {
  tone: "success" | "info" | "error";
  message: string;
  detail?: string;
};

type ImportProgressState = {
  status: ChatGptImportRefreshProgress;
  current: number;
  total: number;
  detailCurrent?: number | null;
  detailTotal?: number | null;
  detailLabel?: string | null;
};

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

function formatProgressLabel(
  progress: ImportProgressState | null,
): string | null {
  if (!progress) {
    return null;
  }

  const first = progress.status.charAt(0).toUpperCase();
  return `${first}${progress.status.slice(1)}`;
}

function toDisplayProgress(
  status: ChatGptImportRefreshProgress,
  current?: number,
  total?: number,
): ImportProgressState {
  const safeTotal =
    typeof total === "number" && Number.isFinite(total) && total > 0
      ? Math.max(1, Math.round(total))
      : null;
  const safeCurrent =
    safeTotal && typeof current === "number" && Number.isFinite(current)
      ? Math.min(safeTotal, Math.max(0, Math.round(current)))
      : null;

  if (status === "markdownbestand analyseren") {
    return { status, current: 1, total: 5 };
  }

  if (status === "importbestand voorbereiden") {
    return { status, current: 2, total: 5 };
  }

  if (status === "entries importeren") {
    return { status, current: 3, total: 5 };
  }

  if (status === "dagboekdagen opbouwen") {
    return {
      status,
      current: 4,
      total: 5,
      detailCurrent: safeCurrent,
      detailTotal: safeTotal,
      detailLabel:
        safeCurrent !== null && safeTotal !== null
          ? `Dag ${safeCurrent} van ${safeTotal}`
          : null,
    };
  }

  if (status === "weekreflecties verversen") {
    return {
      status,
      current: 5,
      total: 5,
      detailCurrent: safeCurrent,
      detailTotal: safeTotal,
      detailLabel:
        safeCurrent !== null && safeTotal !== null
          ? `Weekreflectie ${safeCurrent} van ${safeTotal}`
          : null,
    };
  }

  return {
    status,
    current: 5,
    total: 5,
    detailCurrent: safeCurrent,
    detailTotal: safeTotal,
    detailLabel:
      safeCurrent !== null && safeTotal !== null
        ? `Maandreflectie ${safeCurrent} van ${safeTotal}`
        : null,
  };
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
  const [progressState, setProgressState] = useState<ImportProgressState | null>(null);

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
    setProgressState(null);
  }

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

  async function runImport(replaceExisting = false) {
    if (!preview || !importEnabled) {
      return;
    }

    setFlowState("loading");
    setResultStatus(null);
    setReplaceConfirmVisible(false);
    setProgressState(toDisplayProgress("markdownbestand analyseren"));

    try {
      setProgressState(toDisplayProgress("importbestand voorbereiden"));
      setProgressState(toDisplayProgress("entries importeren"));

      const result = await invokeMarkdownImport({
        preview,
        replaceExisting,
      });

      if (result.requiresReplaceConfirmation) {
        setReplaceConfirmVisible(true);
        setFlowState("selected");
        setProgressState(null);
        return;
      }

      const refreshWarnings = await refreshImportedChatGptDerivedContent({
        impactedDates: result.impactedDates,
        onProgress: (nextStatus, current, total) => {
          setProgressState(toDisplayProgress(nextStatus, current, total));
        },
      });

      const tone = refreshWarnings.length > 0 ? "info" : "success";
      setResultStatus({
        tone,
        message:
          result.removedCount > 0
            ? `Import vervangen. ${result.importedCount} entries toegevoegd.`
            : `Importeren gelukt. ${result.importedCount} entries toegevoegd.`,
        detail:
          refreshWarnings.length > 0
            ? `${refreshWarnings.length} aandachtspunt(en) bij naverwerking.`
            : undefined,
      });
      setFlowState("success");
    } catch (error) {
      setResultStatus({
        tone: "error",
        message: "Er ging iets mis. Probeer het opnieuw.",
        detail: error instanceof Error ? error.message : "Onbekende fout.",
      });
      setFlowState("error");
    } finally {
      setProgressState(null);
    }
  }

  return (
    <>
      <ScreenContainer
        scrollable
        backgroundTone="flat"
        contentContainerStyle={styles.scrollContent}
      >
        <SettingsScreenHeader
          title="Importeren"
          subtitle="Importeer eerder geschreven bestanden."
          onBack={() => router.back()}
          onMenu={() => setMenuVisible(true)}
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
                onPress={() => void runImport(false)}
              />
              <SecondaryButton
                label="Andere bestanden kiezen"
                onPress={resetToIdle}
              />
            </ThemedView>
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

        <ConfirmDialog
          visible={importEnabled && replaceConfirmVisible}
          title="Eerdere import vervangen?"
          message="Voor deze importbron is al een import gedaan. Wil je die vervangen?"
          cancelLabel="Annuleren"
          confirmLabel="Vervangen"
          processing={flowState === "loading"}
          onCancel={() => setReplaceConfirmVisible(false)}
          onConfirm={() => void runImport(true)}
        />
      </ScreenContainer>

      <ProcessingScreen
        visible={importEnabled && flowState === "loading"}
        variant="chatgpt-import"
        statusOverride={formatProgressLabel(progressState)}
        progressCurrent={progressState?.current ?? null}
        progressTotal={progressState?.total ?? null}
        detailProgressCurrent={progressState?.detailCurrent ?? null}
        detailProgressTotal={progressState?.detailTotal ?? null}
        detailProgressLabel={progressState?.detailLabel ?? null}
      />
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
