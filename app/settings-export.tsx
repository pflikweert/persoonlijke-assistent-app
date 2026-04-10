import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Share, StyleSheet } from "react-native";

import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { NoticeCard } from "@/components/ui/notice-card";
import {
  PrimaryButton,
  ScreenContainer,
  SurfaceSection,
} from "@/components/ui/screen-primitives";
import {
  SettingsScreenHeader,
  SettingsStateBody,
  SettingsStateIcon,
} from "@/components/ui/settings-screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { classifyUnknownError, downloadUserArchive } from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

type ExportState = "idle" | "loading" | "success" | "error";

type ExportResultMeta = {
  fileUri?: string;
};

export default function SettingsExportScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const [menuVisible, setMenuVisible] = useState(false);
  const [state, setState] = useState<ExportState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMeta, setResultMeta] = useState<ExportResultMeta | null>(null);

  async function openNativeShare(fileUri?: string): Promise<void> {
    if (!fileUri) {
      return;
    }

    await Share.share({
      title: "Mijn archief",
      message: "Je archief is klaar om te delen of openen.",
      url: fileUri,
    });
  }

  async function handleDownload() {
    if (state === "loading") {
      return;
    }

    setState("loading");
    setErrorMessage(null);
    setResultMeta(null);

    try {
      const result = await downloadUserArchive();
      if (result.status === "empty") {
        setState("error");
        setErrorMessage("Er is nog niets om te downloaden.");
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

  return (
    <>
      <ScreenContainer
        scrollable
        backgroundTone="flat"
        contentContainerStyle={styles.scrollContent}
      >
        <SettingsScreenHeader
          title="Archief downloaden"
          subtitle="Bewaar een leesbaar bestand van je archief."
          onBack={() => router.back()}
          onMenu={() => setMenuVisible(true)}
        />

        {state === "idle" ? (
          <ThemedView style={styles.idleStack}>
            <SurfaceSection>
              <SettingsStateBody>
                <SettingsStateIcon
                  icon="download"
                  iconColor={palette.primary}
                  backgroundColor={palette.surfaceLow}
                />

                <PrimaryButton
                  label="Download archief"
                  onPress={() => void handleDownload()}
                />
              </SettingsStateBody>
            </SurfaceSection>

            <NoticeCard
              body="Je download bevat je dagen en reflecties in leesbare vorm. Alles wordt gebundeld in een bestand dat je later makkelijk kunt bewaren of openen."
            />
          </ThemedView>
        ) : null}

        {state === "loading" ? (
          <SurfaceSection
            title="Archief downloaden"
            subtitle="Bestand wordt voorbereid"
          >
            <SettingsStateBody>
              <SettingsStateIcon
                icon="hourglass-empty"
                iconColor={palette.primary}
                backgroundColor={palette.surfaceLow}
              />

              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Een moment geduld.
              </ThemedText>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {state === "success" ? (
          <SurfaceSection
            title="Download klaar"
            subtitle="Je archief staat voor je klaar."
          >
            <SettingsStateBody>
              <SettingsStateIcon
                icon="check-circle-outline"
                iconColor={palette.primary}
                backgroundColor={palette.surfaceLow}
              />

              <PrimaryButton
                label="Download opnieuw"
                onPress={() => void handleDownload()}
              />

              {Platform.OS !== "web" && resultMeta?.fileUri ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open delen"
                  onPress={() => void openNativeShare(resultMeta.fileUri)}
                  style={styles.secondaryButton}
                >
                  <ThemedText type="defaultSemiBold">Open delen</ThemedText>
                </Pressable>
              ) : null}
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {state === "error" ? (
          <SurfaceSection
            title="Archief downloaden"
            subtitle="Er ging iets mis. Probeer het opnieuw."
          >
            <SettingsStateBody>
              <SettingsStateIcon
                icon="warning-amber"
                iconColor={palette.destructiveSoftText}
                backgroundColor={palette.destructiveSoftBackground}
              />

              {errorMessage ? (
                <ThemedText
                  type="bodySecondary"
                  style={{ color: palette.muted }}
                >
                  {errorMessage}
                </ThemedText>
              ) : null}

              <PrimaryButton
                label="Download archief"
                onPress={() => void handleDownload()}
              />
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  actions: {
    gap: spacing.content,
  },
  idleStack: {
    gap: spacing.xl,
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
