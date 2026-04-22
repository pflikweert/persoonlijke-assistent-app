import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Modal, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ModalBackdrop } from "@/components/ui/modal-backdrop";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export type AsyncStatusSheetState = "closed" | "loading" | "success" | "error";

export type AsyncStatusSheetProps = {
  state: AsyncStatusSheetState;
  loadingTitle: string;
  loadingMessage: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  errorDetail?: string | null;
  closeLabel?: string;
  retryLabel?: string;
  onClose: () => void;
  onRetry?: () => void;
};

export function AsyncStatusSheet({
  state,
  loadingTitle,
  loadingMessage,
  successTitle,
  successMessage,
  errorTitle,
  errorMessage,
  errorDetail,
  closeLabel = "Sluiten",
  retryLabel = "Probeer opnieuw",
  onClose,
  onRetry,
}: AsyncStatusSheetProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const visible = state !== "closed";
  const canClose = state === "success" || state === "error";

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <ModalBackdrop
        layout="bottom"
        onPressOutside={onClose}
        outsidePressDisabled={!canClose}
      >
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surface}
          style={styles.sheetCard}
        >
          <ThemedView
            style={[styles.sheetHandle, { backgroundColor: palette.separator }]}
          />

          {state === "loading" ? (
            <>
              <ThemedView style={styles.loadingWrap}>
                <ActivityIndicator color={palette.primaryStrong} />
              </ThemedView>
              <ThemedText type="sectionTitle">{loadingTitle}</ThemedText>
              <ThemedText
                type="bodySecondary"
                style={[styles.stateTextCenter, { color: palette.muted }]}
              >
                {loadingMessage}
              </ThemedText>
            </>
          ) : null}

          {state === "success" ? (
            <>
              <ThemedView
                style={[
                  styles.statusIconWrap,
                  { backgroundColor: palette.surfaceLow },
                ]}
              >
                <MaterialIcons
                  name="check-circle-outline"
                  size={28}
                  color={palette.primaryStrong}
                />
              </ThemedView>
              <ThemedText type="sectionTitle">{successTitle}</ThemedText>
              <ThemedText
                type="bodySecondary"
                style={[styles.stateTextCenter, { color: palette.muted }]}
              >
                {successMessage}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={closeLabel}
                onPress={onClose}
                style={[
                  styles.sheetPrimaryButton,
                  { backgroundColor: palette.primaryStrong },
                ]}
              >
                <ThemedText
                  type="ctaLabel"
                  lightColor={palette.primaryOn}
                  darkColor={palette.primaryOn}
                >
                  {closeLabel}
                </ThemedText>
              </Pressable>
            </>
          ) : null}

          {state === "error" ? (
            <>
              <ThemedView
                style={[
                  styles.statusIconWrap,
                  { backgroundColor: palette.destructiveSoftBackground },
                ]}
              >
                <MaterialIcons
                  name="warning-amber"
                  size={28}
                  color={palette.destructiveSoftText}
                />
              </ThemedView>
              <ThemedText type="sectionTitle">{errorTitle}</ThemedText>
              <ThemedText
                type="bodySecondary"
                style={[styles.stateTextCenter, { color: palette.muted }]}
              >
                {errorMessage}
              </ThemedText>
              {errorDetail ? (
                <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                  {errorDetail}
                </ThemedText>
              ) : null}
              <ThemedView style={styles.sheetActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={closeLabel}
                  onPress={onClose}
                  style={styles.sheetSecondaryButton}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: palette.mutedSoft }}
                  >
                    {closeLabel}
                  </ThemedText>
                </Pressable>

                {onRetry ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={retryLabel}
                    onPress={onRetry}
                    style={[
                      styles.sheetPrimaryButton,
                      { backgroundColor: palette.primaryStrong },
                    ]}
                  >
                    <ThemedText
                      type="ctaLabel"
                      lightColor={palette.primaryOn}
                      darkColor={palette.primaryOn}
                    >
                      {retryLabel}
                    </ThemedText>
                  </Pressable>
                ) : null}
              </ThemedView>
            </>
          ) : null}
        </ThemedView>
      </ModalBackdrop>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  sheetActions: {
    gap: spacing.sm,
  },
  sheetSecondaryButton: {
    minHeight: 46,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  sheetPrimaryButton: {
    minHeight: 46,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  loadingWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  statusIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  stateTextCenter: {
    textAlign: "center",
  },
});
