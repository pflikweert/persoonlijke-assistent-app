import { Modal, StyleSheet } from "react-native";

import { TextEntryEditor } from "@/components/feedback/text-entry-editor";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppBackground } from "@/components/ui/app-background";
import { HeaderTextAction } from "@/components/ui/header-icon-button";
import { PrimaryButton } from "@/components/ui/screen-primitives";
import { spacing } from "@/theme";

type TextEditorModalProps = {
  visible: boolean;
  title: string;
  value: string;
  placeholder: string;
  submitLabel: string;
  processingLabel: string;
  processing?: boolean;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function TextEditorModal({
  visible,
  title,
  value,
  placeholder,
  submitLabel,
  processingLabel,
  processing = false,
  onChange,
  onCancel,
  onSubmit,
}: TextEditorModalProps) {
  const canSubmit = value.trim().length > 0;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => !processing && onCancel()}
    >
      <ThemedView style={styles.screen}>
        <ThemedView style={styles.backgroundLayer} pointerEvents="none">
          <AppBackground tone="flat" />
        </ThemedView>

        <ThemedView style={styles.contentLayer}>
          <ThemedView style={styles.topBar}>
            <HeaderTextAction
              label="Annuleren"
              onPress={onCancel}
              disabled={processing}
            />
            <ThemedText type="sectionTitle">{title}</ThemedText>
            <ThemedView style={styles.topSpacer} />
          </ThemedView>

          <TextEntryEditor
            autoFocus
            value={value}
            onChangeText={onChange}
            editable={!processing}
            placeholder={placeholder}
            variant="edit"
            style={styles.input}
          />

          <ThemedView style={styles.bottomZone}>
            <PrimaryButton
              label={processing ? processingLabel : submitLabel}
              onPress={onSubmit}
              disabled={processing || !canSubmit}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  contentLayer: {
    flex: 1,
    position: "relative",
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.page,
    paddingBottom: spacing.page,
    gap: spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
    minHeight: 40,
  },
  topSpacer: {
    minWidth: 84,
  },
  input: {
    flex: 1,
  },
  bottomZone: {
    width: "100%",
    paddingBottom: spacing.sm,
  },
});
