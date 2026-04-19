import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
    PrimaryButton,
    ScreenContainer,
    SecondaryButton,
    StateBlock,
    SurfaceSection,
} from "@/components/ui/screen-primitives";
import {
    SettingsScreenHeader,
    SettingsStateBody,
    SettingsStateIcon,
} from "@/components/ui/settings-screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    classifyUnknownError,
    fetchUserObsidianPreferences,
    updateUserObsidianPreferences,
} from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

export default function SettingsObsidianScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obsidianVaultPath, setObsidianVaultPath] = useState("");
  const [obsidianDefaultNote, setObsidianDefaultNote] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const prefs = await fetchUserObsidianPreferences();
        if (!cancelled) {
          setObsidianVaultPath(prefs.obsidian_vault_path || "");
          setObsidianDefaultNote(prefs.obsidian_default_note || "");
        }
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        if (!cancelled) {
          setError(parsed.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  async function persistPreferences() {
    setSaving(true);
    setError(null);

    try {
      await updateUserObsidianPreferences({
        obsidianVaultPath: obsidianVaultPath.trim() || null,
        obsidianDefaultNote: obsidianDefaultNote.trim() || null,
      });
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setSaving(false);
    }
  }

  const isBusy = loading || saving;

  return (
    <ScreenContainer
      scrollable
      backgroundTone="flat"
      contentContainerStyle={styles.scrollContent}
    >
      <SettingsScreenHeader
        title="Obsidian integratie"
        subtitle="Stel standaard vault en notitie in voor Obsidian."
        onBack={() => router.back()}
        onMenu={() => setMenuVisible(true)}
      />

      <SurfaceSection title="Vault pad">
        <SettingsStateBody>
          <SettingsStateIcon
            icon="folder"
            iconColor={palette.primary}
            backgroundColor={palette.surfaceLow}
          />

          {loading ? (
            <StateBlock
              tone="loading"
              message="Voorkeur laden..."
              detail="Een moment geduld."
            />
          ) : (
            <ThemedView style={styles.inputWrap}>
              <TextInput
                style={[
                  styles.textInput,
                  { color: palette.text, borderColor: palette.border },
                ]}
                placeholder="Bijv. /Users/gebruiker/Documents/Obsidian Vault"
                placeholderTextColor={palette.muted}
                value={obsidianVaultPath}
                onChangeText={setObsidianVaultPath}
                editable={!isBusy}
              />
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Het volledige pad naar je Obsidian vault map.
              </ThemedText>
            </ThemedView>
          )}
        </SettingsStateBody>
      </SurfaceSection>

      <SurfaceSection title="Standaard notitie">
        <SettingsStateBody>
          <SettingsStateIcon
            icon="note"
            iconColor={palette.primary}
            backgroundColor={palette.surfaceLow}
          />

          {loading ? (
            <StateBlock
              tone="loading"
              message="Voorkeur laden..."
              detail="Een moment geduld."
            />
          ) : (
            <ThemedView style={styles.inputWrap}>
              <TextInput
                style={[
                  styles.textInput,
                  { color: palette.text, borderColor: palette.border },
                ]}
                placeholder="Bijv. Dagboek.md"
                placeholderTextColor={palette.muted}
                value={obsidianDefaultNote}
                onChangeText={setObsidianDefaultNote}
                editable={!isBusy}
              />
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                De naam van de standaard notitie voor export.
              </ThemedText>
            </ThemedView>
          )}
        </SettingsStateBody>
      </SurfaceSection>

      {error ? (
        <StateBlock
          tone="error"
          message="Instelling opslaan lukt nu niet."
          detail={error}
        />
      ) : null}

      <ThemedView style={styles.actionsWrap}>
        <PrimaryButton
          label={saving ? "Bezig..." : "Opslaan"}
          disabled={saving}
          onPress={persistPreferences}
        />
        <SecondaryButton
          label="Terug naar instellingen"
          onPress={() => router.back()}
        />
      </ThemedView>

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  inputWrap: {
    width: "100%",
    gap: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  actionsWrap: {
    gap: spacing.sm,
  },
});
