import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { RadioChoiceGroup } from "@/components/ui/radio-choice-group";
import {
  PrimaryButton,
  ScreenContainer,
  StateBlock,
  SurfaceSection,
} from "@/components/ui/screen-primitives";
import {
  SettingsScreenHeader,
  SettingsStateBody,
  SettingsStateIcon,
} from "@/components/ui/settings-screen-primitives";
import {
  classifyUnknownError,
  fetchUserAudioPreferences,
  updateUserAudioPreferences,
} from "@/services";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing } from "@/theme";

export default function SettingsAudioScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAudioRecordings, setSaveAudioRecordings] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const prefs = await fetchUserAudioPreferences();
        if (!cancelled) {
          setSaveAudioRecordings(prefs.save_audio_recordings);
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

  async function persistPreference(nextValue: boolean) {
    setSaving(true);
    setError(null);
    setSaveAudioRecordings(nextValue);

    try {
      const updated = await updateUserAudioPreferences({
        saveAudioRecordings: nextValue,
      });
      setSaveAudioRecordings(updated.save_audio_recordings);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
      setSaveAudioRecordings((value) => !value);
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
        title="Audio-opnames bewaren"
        subtitle="Beheer opslag van originele audiobestanden."
        onBack={() => router.back()}
        onMenu={() => setMenuVisible(true)}
      />

      <SurfaceSection title="Opslag voorkeur">
        <SettingsStateBody>
          <SettingsStateIcon
            icon="mic"
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
            <ThemedView style={styles.radioWrap}>
              <RadioChoiceGroup
                options={[
                  {
                    key: "off",
                    label: "Niet bewaren",
                    description:
                      "Audio wordt alleen gebruikt voor transcriptie en daarna niet opgeslagen.",
                    active: !saveAudioRecordings,
                    onPress: () => {
                      if (!isBusy && saveAudioRecordings) {
                        void persistPreference(false);
                      }
                    },
                  },
                  {
                    key: "on",
                    label: "Wel bewaren",
                    description:
                      "Audio wordt veilig opgeslagen zodat je opname later kunt afspelen en downloaden.",
                    active: saveAudioRecordings,
                    onPress: () => {
                      if (!isBusy && !saveAudioRecordings) {
                        void persistPreference(true);
                      }
                    },
                  },
                ]}
              />
            </ThemedView>
          )}

          {error ? (
            <StateBlock
              tone="error"
              message="Instelling opslaan lukt nu niet."
              detail={error}
            />
          ) : null}

          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
            Deze keuze geldt voor nieuwe opnames. Eerder opgeslagen audio blijft ongewijzigd.
          </ThemedText>
        </SettingsStateBody>
      </SurfaceSection>

      <ThemedView style={styles.actionsWrap}>
        <PrimaryButton
          label={saving ? "Bezig..." : "Terug naar instellingen"}
          disabled={saving}
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
  radioWrap: {
    width: "100%",
  },
  actionsWrap: {
    gap: spacing.sm,
  },
});
