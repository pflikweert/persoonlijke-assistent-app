import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';

type BackgroundTaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export function BackgroundTaskNotice({
  title,
  body,
  status,
  onDismiss,
  actionLabel,
  onPressAction,
}: {
  title: string;
  body: string;
  status: BackgroundTaskStatus;
  onDismiss: () => void;
  actionLabel?: string;
  onPressAction?: () => void;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const isFailure = status === 'failed';
  const accent = isFailure ? palette.destructiveSoftText : palette.primary;

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLow}
      darkColor={colorTokens.dark.surfaceLow}
      style={styles.notice}
    >
      <ThemedView style={styles.headerRow}>
        <ThemedView style={styles.titleRow}>
          <MaterialIcons
            name={isFailure ? 'warning-amber' : 'check-circle-outline'}
            size={18}
            color={accent}
          />
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </ThemedView>

        <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Melding sluiten">
          <MaterialIcons name="close" size={18} color={palette.mutedSoft} />
        </Pressable>
      </ThemedView>

      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
        {body}
      </ThemedText>

      {actionLabel && onPressAction ? (
        <Pressable style={styles.action} onPress={onPressAction} accessibilityRole="button">
          <ThemedText type="bodySecondary" style={{ color: palette.primary }}>
            {actionLabel}
          </ThemedText>
          <MaterialIcons name="arrow-forward" size={16} color={palette.primary} />
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  notice: {
    width: '100%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  action: {
    marginTop: spacing.xxs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});