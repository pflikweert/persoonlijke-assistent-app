import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  SecondaryButton,
} from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';

export type ArchiveGroupedListItem = {
  key: string;
  leftTop: string;
  leftBottom: string;
  snippet: string;
  onPress: () => void;
  selected?: boolean;
};

export type ArchiveGroupedListSection = {
  key: string;
  title: string;
  items: ArchiveGroupedListItem[];
};

type ArchiveGroupedListProps = {
  sections: ArchiveGroupedListSection[];
  hasMore?: boolean;
  loadingMore?: boolean;
  loadMoreLabel?: string;
  onLoadMore?: () => void;
  styleVariant?: 'default' | 'compact';
};

export function ArchiveGroupedList({
  sections,
  hasMore = false,
  loadingMore = false,
  loadMoreLabel = 'Meer laden',
  onLoadMore,
  styleVariant = 'default',
}: ArchiveGroupedListProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const isCompact = styleVariant === 'compact';

  return (
    <ThemedView style={styles.list}>
      {sections.map((section) => (
        <ThemedView key={section.key} style={styles.group}>
          <ThemedText type="meta" style={[styles.groupTitle, { color: palette.primary }]}>
            {section.title}
          </ThemedText>
          <ThemedView style={styles.rows}>
            {section.items.map((item) => (
              <Pressable
                key={item.key}
                onPress={item.onPress}
                style={[
                  styles.row,
                  {
                    borderBottomColor: `${palette.separator}88`,
                    borderColor: item.selected ? `${palette.primary}66` : 'transparent',
                    borderWidth: item.selected ? StyleSheet.hairlineWidth : 0,
                  },
                ]}>
                <View style={[styles.dateColumn, isCompact ? styles.dateColumnCompact : null]}>
                  <ThemedText type="caption" style={[styles.weekday, { color: palette.mutedSoft }]}>
                    {item.leftTop}
                  </ThemedText>
                  <ThemedText type="sectionTitle" style={[styles.dayNumber, { color: palette.text }]}>
                    {item.leftBottom}
                  </ThemedText>
                </View>

                <ThemedView style={[styles.snippetColumn, { borderLeftColor: palette.separator }]}>
                  <ThemedText numberOfLines={2} type="bodySecondary" style={[styles.snippet, { color: palette.muted }]}>
                    {item.snippet}
                  </ThemedText>
                </ThemedView>

                <MaterialIcons name="chevron-right" size={18} color={palette.mutedSoft} style={styles.chevron} />
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>
      ))}

      {hasMore && onLoadMore ? (
        <ThemedView style={styles.loadMoreWrap}>
          <SecondaryButton
            label={loadingMore ? `${loadMoreLabel}...` : loadMoreLabel}
            onPress={onLoadMore}
            disabled={loadingMore}
          />
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xl,
  },
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  rows: {
    gap: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dateColumn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateColumnCompact: {
    width: 54,
  },
  weekday: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dayNumber: {},
  snippetColumn: {
    flex: 1,
    borderLeftWidth: 1,
    paddingLeft: spacing.md,
    justifyContent: 'center',
  },
  snippet: {},
  chevron: {
    opacity: 0.65,
  },
  loadMoreWrap: {
    paddingTop: spacing.sm,
  },
});

