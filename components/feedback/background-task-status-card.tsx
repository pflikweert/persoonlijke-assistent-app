import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';

type BackgroundTaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export function BackgroundTaskStatusCard({
  title,
  body,
  status,
  progressCurrent,
  progressTotal,
  detailLabel,
  actionLabel,
  onPressAction,
}: {
  title: string;
  body: string;
  status: BackgroundTaskStatus;
  progressCurrent: number;
  progressTotal: number;
  detailLabel?: string | null;
  actionLabel?: string;
  onPressAction?: () => void;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const safeTotal = Math.max(1, Math.round(progressTotal || 0));
  const safeCurrent = Math.max(0, Math.min(safeTotal, Math.round(progressCurrent || 0)));
  const percentage = Math.round((safeCurrent / safeTotal) * 100);
  const statusTone =
    status === 'failed' ? palette.destructiveSoftText : status === 'completed' ? palette.primaryStrong : palette.primary;

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLow}
      darkColor={colorTokens.dark.surfaceLow}
      style={styles.card}
    >
      <ThemedView style={styles.headRow}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText type="caption" style={{ color: statusTone }}>
          {percentage}%
        </ThemedText>
      </ThemedView>

      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
        {body}
      </ThemedText>

      <ThemedView style={styles.progressTrack}>
        <ThemedView
          style={[
            styles.progressFill,
            {
              width: `${Math.max(6, percentage)}%`,
              backgroundColor: statusTone,
            },
          ]}
        />
      </ThemedView>

      <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
        {detailLabel?.trim() || `Stap ${safeCurrent} van ${safeTotal}`}
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
  card: {
    width: "100%",
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(125,125,125,0.24)',
    overflow: 'hidden',
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
  },
  action: {
    marginTop: spacing.xxs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});