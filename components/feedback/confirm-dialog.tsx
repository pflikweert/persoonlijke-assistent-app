import { Modal, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, shadows, spacing } from '@/theme';

export type ConfirmDialogAction = {
  key: string;
  label: string;
  onPress: () => void;
  tone?: 'default' | 'destructive';
  disabled?: boolean;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  detail,
  cancelLabel = 'Annuleren',
  confirmLabel = 'Bevestigen',
  processing = false,
  actions,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  message: string;
  detail?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  processing?: boolean;
  actions?: ConfirmDialogAction[];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const resolvedActions =
    actions && actions.length > 0
      ? actions
      : [
          {
            key: 'cancel',
            label: cancelLabel,
            onPress: onCancel,
          },
          {
            key: 'confirm',
            label: confirmLabel,
            onPress: onConfirm,
            tone: 'destructive' as const,
          },
        ];

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
          {detail ? (
            <ThemedText type="bodySecondary" style={[styles.detail, { color: palette.mutedSoft }]}>
              {detail}
            </ThemedText>
          ) : null}

          <ThemedView
            style={[
              styles.actions,
              resolvedActions.length > 2 ? styles.actionsStacked : null,
            ]}
          >
            {resolvedActions.map((action) => {
              const destructive = action.tone === 'destructive';
              return (
                <Pressable
                  key={action.key}
                  accessibilityRole="button"
                  disabled={processing || action.disabled}
                  onPress={action.onPress}
                  style={[
                    styles.actionBase,
                    resolvedActions.length > 2 ? styles.stackedAction : styles.inlineAction,
                    {
                      backgroundColor: palette.surfaceLowest,
                    },
                    destructive ? styles.destructiveAction : null,
                    (processing || action.disabled) ? styles.actionDisabled : null,
                  ]}
                >
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: destructive ? palette.destructiveSoftText : palette.mutedSoft }}
                  >
                    {processing && action.key === 'confirm' ? 'Verwerken...' : action.label}
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
  detail: {
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
    backgroundColor: 'transparent',
  },
  actionsStacked: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  actionBase: {
    minHeight: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  inlineAction: {
    minWidth: 124,
  },
  stackedAction: {
    width: '100%',
  },
  destructiveAction: {
    borderWidth: 0,
  },
  actionDisabled: {
    opacity: 0.7,
  },
});
