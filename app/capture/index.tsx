import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CaptureIntro, CaptureBackHeader } from "@/components/ui/capture-screen-primitives";
import {
  ScreenContainer,
  SecondaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import { colorTokens, spacing } from "@/theme";

import {
  buildCaptureParams,
  resolveCaptureJournalDate,
  type CaptureRouteParams,
} from "@/src/lib/capture-shared";

export default function CaptureStartScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();
  const { date, validation } = useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date);
  const params = buildCaptureParams(journalDate);
  const validationCode = Array.isArray(validation)
    ? (validation[0] ?? "")
    : (validation ?? "");

  const validationMessage =
    validationCode === "short"
      ? "Opname is te kort. Neem minimaal 5 seconden op."
      : validationCode === "no_speech"
        ? "We hoorden nog geen duidelijke tekst. Neem opnieuw op of kies typen."
        : null;
  const showAudioSettingsSuggestion =
    validationCode === "no_speech" && Platform.OS === "web";

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)");
  }

  return (
    <ScreenContainer
      backgroundTone="flat"
      fixedHeader={
        <CaptureBackHeader topInset={insets.top} onBack={handleClose} />
      }
    >
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <View
        style={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      >
        {validationMessage ? (
          <View style={styles.validationBlock}>
            <StateBlock
              tone="error"
              message={validationMessage}
              detail={
                showAudioSettingsSuggestion
                  ? "Kies opnieuw opnemen of typ je moment. Je kunt ook je microfoon en opnamevolume aanpassen in Audio Instellingen."
                  : "Kies opnieuw opnemen of typ je moment."
              }
            />
            {showAudioSettingsSuggestion ? (
              <View style={styles.validationActions}>
                <SecondaryButton
                  label="Open Audio Instellingen"
                  onPress={() => router.push("../settings-audio")}
                  className="w-full"
                />
              </View>
            ) : null}
          </View>
        ) : null}

        <CaptureIntro title="Leg iets vast" style={styles.copyBlock} />

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Opnemen"
            onPress={() => router.push({ pathname: "/capture/record", params })}
            style={[
              styles.primaryMicButton,
              { backgroundColor: palette.primary },
            ]}
          >
            <MaterialIcons name="mic" size={40} color={palette.primaryOn} />
          </Pressable>

          <SecondaryButton
            label="Of typ je moment"
            size="cta"
            onPress={() => router.push({ pathname: "/capture/type", params })}
            className="w-full"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: spacing.xxxl + spacing.sm,
  },
  copyBlock: {
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  validationBlock: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  validationActions: {
    gap: spacing.sm,
  },
  actions: {
    marginTop: spacing.xxxl,
    alignItems: "center",
    gap: spacing.xl,
  },
  primaryMicButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
