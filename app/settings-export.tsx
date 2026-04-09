import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, Share, StyleSheet } from "react-native";

import { ScreenHeader } from "@/components/layout/screen-header";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  PrimaryButton,
  ScreenContainer,
  SurfaceSection,
} from "@/components/ui/screen-primitives";
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
        fixedHeader={
          <ScreenHeader
            title="Archief downloaden"
            titleType="screenTitle"
            subtitle="Bewaar een leesbaar bestand van je archief."
            leftAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ga terug"
                onPress={() => router.back()}
                style={[
                  styles.iconButton,
                  { backgroundColor: palette.surfaceLow },
                ]}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={20}
                  color={palette.primary}
                />
              </Pressable>
            }
            rightAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                onPress={() => setMenuVisible(true)}
                style={[
                  styles.iconButton,
                  { backgroundColor: palette.surfaceLow },
                ]}
              >
                <MaterialIcons name="menu" size={20} color={palette.primary} />
              </Pressable>
            }
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {state === "idle" ? (
          <SurfaceSection
            title="Archief downloaden"
            subtitle="Bewaar een leesbaar bestand van je archief."
          >
            <ThemedView style={styles.stateBody}>
              <ThemedView
                style={[
                  styles.iconWrap,
                  { backgroundColor: palette.surfaceLow },
                ]}
              >
                <MaterialIcons
                  name="download"
                  size={30}
                  color={palette.primary}
                />
              </ThemedView>

              <PrimaryButton
                label="Download archief"
                onPress={() => void handleDownload()}
              />
            </ThemedView>
          </SurfaceSection>
        ) : null}

        {state === "loading" ? (
          <SurfaceSection
            title="Archief downloaden"
            subtitle="Bestand wordt voorbereid"
          >
            <ThemedView style={styles.stateBody}>
              <ThemedView
                style={[
                  styles.iconWrap,
                  { backgroundColor: palette.surfaceLow },
                ]}
              >
                <MaterialIcons
                  name="hourglass-empty"
                  size={30}
                  color={palette.primary}
                />
              </ThemedView>

              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Een moment geduld.
              </ThemedText>
            </ThemedView>
          </SurfaceSection>
        ) : null}

        {state === "success" ? (
          <SurfaceSection
            title="Download klaar"
            subtitle="Je archief staat voor je klaar."
          >
            <ThemedView style={styles.stateBody}>
              <ThemedView
                style={[
                  styles.iconWrap,
                  { backgroundColor: palette.surfaceLow },
                ]}
              >
                <MaterialIcons
                  name="check-circle-outline"
                  size={30}
                  color={palette.primary}
                />
              </ThemedView>

              <PrimaryButton
                label="Download opnieuw"
                onPress={() => void handleDownload()}
              />

              {Platform.OS !== "web" && resultMeta?.fileUri ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open delen"
                  onPress={() => void openNativeShare(resultMeta.fileUri)}
                  style={[
                    styles.secondaryButton,
                    { borderColor: palette.separator },
                  ]}
                >
                  <ThemedText type="defaultSemiBold">Open delen</ThemedText>
                </Pressable>
              ) : null}
            </ThemedView>
          </SurfaceSection>
        ) : null}

        {state === "error" ? (
          <SurfaceSection
            title="Archief downloaden"
            subtitle="Er ging iets mis. Probeer het opnieuw."
          >
            <ThemedView style={styles.stateBody}>
              <ThemedView
                style={[
                  styles.iconWrap,
                  { backgroundColor: palette.destructiveSoftBackground },
                ]}
              >
                <MaterialIcons
                  name="warning-amber"
                  size={30}
                  color={palette.destructiveSoftText}
                />
              </ThemedView>

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
            </ThemedView>
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    gap: spacing.sm,
  },
  stateBody: {
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
});
