import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CaptureIntro, CaptureBackHeader } from "@/components/ui/capture-screen-primitives";
import { ThemedText } from "@/components/themed-text";
import { ScreenContainer } from "@/components/ui/screen-primitives";
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
  const { date } = useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date);
  const params = buildCaptureParams(journalDate);

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

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Of typ je moment"
            onPress={() => router.push({ pathname: "/capture/type", params })}
            style={styles.secondaryLink}
          >
            <ThemedText
              type="bodySecondary"
              lightColor={palette.muted}
              darkColor={palette.muted}
              style={styles.secondaryLinkText}
            >
              Of typ je moment
            </ThemedText>
          </Pressable>
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
    paddingTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.xxxl,
    alignItems: "center",
    gap: spacing.md,
  },
  primaryMicButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryLink: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  secondaryLinkText: {
    textAlign: "center",
  },
});
