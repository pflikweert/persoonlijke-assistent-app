import { Modal, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
      <ThemedView style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} disabled={processing} onPress={onCancel} />
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surface}
          style={[styles.card, { borderColor: `${palette.separator}CC` }]}>
          <ThemedText type="sectionTitle">{title}</ThemedText>
          <ThemedText type="bodySecondary" style={[styles.message, { color: palette.muted }]}>
            {message}
          </ThemedText>

          <ThemedView style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={processing}
              onPress={onCancel}
              style={[styles.actionBase, styles.cancelAction, { borderColor: `${palette.separator}CC` }]}>
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
                  backgroundColor: palette.destructiveSoftBackground,
                  borderColor: palette.destructiveSoftBorder,
                },
                processing && styles.actionDisabled,
              ]}>
              <ThemedText type="defaultSemiBold" style={{ color: palette.destructiveSoftText }}>
                {processing ? 'Verwerken...' : confirmLabel}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.page,
    backgroundColor: 'rgba(14, 13, 11, 0.38)',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
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
  },
  actionBase: {
    minHeight: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  cancelAction: {
    borderWidth: 1,
  },
  confirmAction: {
    minWidth: 124,
    borderWidth: 1,
  },
  actionDisabled: {
    opacity: 0.7,
  },
});
