import { Modal, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ModalBackdrop } from "@/components/ui/modal-backdrop";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui/screen-primitives";
import { colorTokens, radius, spacing } from "@/theme";

export type PwaInstallModalMode = "closed" | "install" | "guidance";

export function PwaInstallModal({
  mode,
  installing,
  onInstall,
  onLater,
  onCloseGuidance,
}: {
  mode: PwaInstallModalMode;
  installing: boolean;
  onInstall: () => void;
  onLater: () => void;
  onCloseGuidance: () => void;
}) {
  const isInstall = mode === "install";
  const close = isInstall ? onLater : onCloseGuidance;

  return (
    <Modal
      transparent
      visible={mode !== "closed"}
      animationType="fade"
      onRequestClose={close}
    >
      <ModalBackdrop
        layout="bottom"
        onPressOutside={close}
        outsidePressDisabled={installing}
      >
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surface}
          style={styles.card}
        >
          <ThemedView
            lightColor={colorTokens.light.separator}
            darkColor={colorTokens.dark.separator}
            style={styles.handle}
          />

          <ThemedView style={styles.copyGroup}>
            <ThemedText type="sectionTitle">Budio installeren</ThemedText>
            <ThemedText type="bodySecondary">
              {isInstall
                ? "Open Budio Vandaag als app, zonder eerst je browser te openen."
                : "Gebruik de installatieoptie in het menu van je browser. Zie je die niet, dan ondersteunt deze browser installatie niet."}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.actions}>
            {isInstall ? (
              <>
                <PrimaryButton
                  label={installing ? "Installeren..." : "Installeren"}
                  icon="install-desktop"
                  disabled={installing}
                  onPress={onInstall}
                />
                <SecondaryButton
                  label="Later"
                  size="cta"
                  disabled={installing}
                  onPress={onLater}
                />
              </>
            ) : (
              <PrimaryButton label="Begrepen" onPress={onCloseGuidance} />
            )}
          </ThemedView>
        </ThemedView>
      </ModalBackdrop>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.content,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    alignSelf: "center",
  },
  copyGroup: {
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
});
