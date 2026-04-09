import { Modal, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, shadows, spacing } from '@/theme';

export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel = 'Annuleren',
  confirmLabel = 'Bevestigen',
  processing = false,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  processing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => !processing && onCancel()}>
      <ModalBackdrop onPressOutside={onCancel} outsidePressDisabled={processing} contentStyle={styles.dialogWrap}>
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surface}
          style={styles.card}>
          <ThemedText type="sectionTitle">{title}</ThemedText>
          <ThemedText type="bodySecondary" style={[styles.message, { color: palette.muted }]}>
            {message}
          </ThemedText>

          <ThemedView style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={processing}
              onPress={onCancel}
              style={[
                styles.actionBase,
                styles.cancelAction,
                {
                  backgroundColor: colorTokens.light.surfaceLowest,
                },
              ]}>
              <ThemedText type="defaultSemiBold" style={{ color: palette.mutedSoft }}>
                {cancelLabel}
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={processing}
              onPress={onConfirm}
              style={[
                styles.actionBase,
                styles.confirmAction,
                {
                  backgroundColor: colorTokens.light.surfaceLowest,
                },
                processing && styles.actionDisabled,
              ]}>
              <ThemedText type="defaultSemiBold" style={{ color: palette.destructiveSoftText }}>
                {processing ? 'Verwerken...' : confirmLabel}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ModalBackdrop>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dialogWrap: {
    width: '100%',
    maxWidth: 420,
  },
  card: {
    width: '100%',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    ...shadows.surface,
  },
  message: {
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
    backgroundColor: 'transparent',
  },
  actionBase: {
    minHeight: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  cancelAction: {
    backgroundColor: 'transparent',
  },
  confirmAction: {
    minWidth: 124,
    backgroundColor: 'transparent',
  },
  actionDisabled: {
    opacity: 0.7,
  },
});
