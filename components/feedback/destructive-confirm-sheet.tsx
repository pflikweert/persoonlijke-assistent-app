import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ModalBackdrop } from "@/components/ui/modal-backdrop";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export type ConfirmSheetAction = {
  key: string;
  label: string;
  onPress: () => void;
  tone?: "default" | "destructive";
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

type DestructiveConfirmSheetContentProps = {
  title: string;
  message: string;
  secondaryLabel: string;
  confirmLabel: string;
  confirmAccessibilityLabel?: string;
  secondaryAccessibilityLabel?: string;
  processing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DestructiveConfirmSheetContent({
  title,
  message,
  secondaryLabel,
  confirmLabel,
  confirmAccessibilityLabel,
  secondaryAccessibilityLabel,
  processing = false,
  onCancel,
  onConfirm,
}: DestructiveConfirmSheetContentProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <>
      <ThemedText type="sectionTitle">{title}</ThemedText>
      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
        {message}
      </ThemedText>

      <ThemedView style={styles.sheetActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={secondaryAccessibilityLabel ?? secondaryLabel}
          disabled={processing}
          onPress={onCancel}
          style={styles.sheetSecondaryButton}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{ color: palette.mutedSoft }}
          >
            {secondaryLabel}
          </ThemedText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={confirmAccessibilityLabel ?? confirmLabel}
          disabled={processing}
          onPress={onConfirm}
          style={[
            styles.sheetDangerButton,
            { backgroundColor: palette.surfaceLow },
            processing ? styles.actionDisabled : null,
          ]}
        >
          <MaterialIcons
            name="delete-forever"
            size={18}
            color={palette.destructiveSoftText}
          />
          <ThemedText
            type="defaultSemiBold"
            style={{ color: palette.destructiveSoftText }}
          >
            {confirmLabel}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </>
  );
}

export function DestructiveConfirmSheet({
  visible,
  title,
  message,
  secondaryLabel,
  confirmLabel,
  processing = false,
  onCancel,
  onConfirm,
}: DestructiveConfirmSheetContentProps & {
  visible: boolean;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        if (!processing) {
          onCancel();
        }
      }}
    >
      <ModalBackdrop
        layout="bottom"
        onPressOutside={onCancel}
        outsidePressDisabled={processing}
      >
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surface}
          style={styles.sheetCard}
        >
          <ThemedView
            style={[styles.sheetHandle, { backgroundColor: palette.separator }]}
          />
          <DestructiveConfirmSheetContent
            title={title}
            message={message}
            secondaryLabel={secondaryLabel}
            confirmLabel={confirmLabel}
            processing={processing}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        </ThemedView>
      </ModalBackdrop>
    </Modal>
  );
}

export function ConfirmSheet({
  visible,
  title,
  message,
  detail,
  processing = false,
  actions,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  detail?: string;
  processing?: boolean;
  actions?: ConfirmSheetAction[];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const resolvedActions: ConfirmSheetAction[] =
    actions && actions.length > 0
      ? actions
      : [
          {
            key: "cancel",
            label: "Annuleren",
            onPress: onCancel,
          },
          {
            key: "confirm",
            label: "Bevestigen",
            onPress: onConfirm,
            tone: "destructive",
          },
        ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        if (!processing) {
          onCancel();
        }
      }}
    >
      <ModalBackdrop
        layout="bottom"
        onPressOutside={onCancel}
        outsidePressDisabled={processing}
      >
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surface}
          style={styles.sheetCard}
        >
          <ThemedView
            style={[styles.sheetHandle, { backgroundColor: palette.separator }]}
          />

          <ThemedText type="sectionTitle">{title}</ThemedText>
          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
            {message}
          </ThemedText>
          {detail ? (
            <ThemedText type="bodySecondary" style={{ color: palette.mutedSoft }}>
              {detail}
            </ThemedText>
          ) : null}

          <ThemedView style={styles.sheetActions}>
            {resolvedActions.map((action) => {
              const destructive = action.tone === "destructive";
              return (
                <Pressable
                  key={action.key}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  disabled={processing || action.disabled}
                  onPress={action.onPress}
                  style={[
                    destructive ? styles.sheetDangerButton : styles.sheetSecondaryButton,
                    destructive ? { backgroundColor: palette.surfaceLow } : null,
                    processing || action.disabled ? styles.actionDisabled : null,
                  ]}
                >
                  {destructive ? (
                    <MaterialIcons
                      name={action.icon ?? "delete-forever"}
                      size={18}
                      color={palette.destructiveSoftText}
                    />
                  ) : null}
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: destructive ? palette.destructiveSoftText : palette.mutedSoft }}
                  >
                    {processing && action.key === "confirm"
                      ? "Verwerken..."
                      : action.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>
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
  sheetDangerButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  actionDisabled: {
    opacity: 0.7,
  },
});
