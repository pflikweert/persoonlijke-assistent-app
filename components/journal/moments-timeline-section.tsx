import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, type LayoutChangeEvent, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';

export type TimelineMomentEntry = {
  id: string;
  title: string | null;
  summary_short: string | null;
  body: string;
  source_type: string | null;
  captured_at: string;
};

type MomentsTimelineSectionProps = {
  title?: string;
  entries: TimelineMomentEntry[];
  rightLabel?: string;
  focusedEntryId?: string | null;
  onEntryPress: (entry: TimelineMomentEntry) => void;
  previewText: (entry: TimelineMomentEntry) => string;
  onEntryLayout?: (entryId: string, y: number) => void;
  style?: ViewStyle;
};

export function MomentsTimelineSection({
  title,
  entries,
  rightLabel,
  focusedEntryId,
  onEntryPress,
  previewText,
  onEntryLayout,
  style,
}: MomentsTimelineSectionProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  if (entries.length === 0) {
    return null;
  }

  return (
    <ThemedView style={[styles.section, style]}>
      {title || rightLabel ? (
        <ThemedView style={styles.headerRow}>
          {title ? (
            <ThemedText type="meta" style={[styles.title, { color: palette.primary }]}>
              {title}
            </ThemedText>
          ) : (
            <ThemedView />
          )}
          {rightLabel ? (
            <ThemedText type="caption" style={[styles.rightLabel, { color: palette.mutedSoft }]}>
              {rightLabel}
            </ThemedText>
          ) : null}
        </ThemedView>
      ) : null}

      <ThemedView style={styles.list}>
        {entries.map((entry, index) => (
          <Pressable
            key={entry.id}
            onPress={() => onEntryPress(entry)}
            onLayout={
              onEntryLayout
                ? (event: LayoutChangeEvent) => onEntryLayout(entry.id, event.nativeEvent.layout.y)
                : undefined
            }
            style={[
              styles.row,
              focusedEntryId === entry.id
                ? {
                    backgroundColor: palette.surfaceLow,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: palette.primary,
                  }
                : null,
            ]}>
            <ThemedView style={styles.timeCol}>
              <ThemedView style={styles.timeMetaRow}>
                <ThemedText type="caption" style={[styles.timeText, { color: palette.mutedSoft }]}>
                  {formatTime(entry.captured_at)}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.trackCol}>
              <MaterialIcons
                name={entry.source_type === 'audio' ? 'mic' : 'edit-note'}
                size={13}
                color={palette.primary}
              />
              {index < entries.length - 1 ? (
                <ThemedView style={[styles.line, { backgroundColor: `${palette.separator}88` }]} />
              ) : null}
            </ThemedView>

            <ThemedView style={styles.contentCol}>
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ color: palette.text }}>
                {entry.title?.trim() || 'Moment zonder titel'}
              </ThemedText>
              <ThemedText type="bodySecondary" numberOfLines={3} style={{ color: palette.muted }}>
                {previewText(entry)}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

function formatTime(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    letterSpacing: 0.35,
  },
  rightLabel: {
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  list: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    minHeight: 72,
    borderRadius: radius.md,
  },
  timeCol: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 1,
  },
  timeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  timeText: {
    letterSpacing: 0.2,
  },
  trackCol: {
    width: 12,
    alignItems: 'center',
    paddingTop: 3,
  },
  line: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: spacing.xs,
  },
  contentCol: {
    flex: 1,
    gap: spacing.xxs,
    paddingBottom: spacing.md,
  },
});
