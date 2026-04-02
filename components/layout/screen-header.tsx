import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';

type HeaderTitleType = 'sectionTitle' | 'screenTitle';

export function ScreenHeader({
  title,
  subtitle,
  titleType = 'sectionTitle',
  leftAction,
  rightAction,
  style,
}: {
  title?: string;
  subtitle?: string;
  titleType?: HeaderTitleType;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const hasLeftAction = Boolean(leftAction);

  return (
    <ThemedView style={[styles.header, { backgroundColor: palette.background }, style]}>
      <ThemedView style={styles.topRow}>
        <ThemedView style={[styles.side, !hasLeftAction ? styles.sideEmpty : null]}>{leftAction}</ThemedView>

        {title || subtitle ? (
          <ThemedView style={[styles.titleBlock, styles.titleBlockLeft]}>
            {title ? (
              <ThemedText type={titleType} style={styles.title}>
                {title}
              </ThemedText>
            ) : null}
            {subtitle ? (
              <ThemedText
                type="bodySecondary"
                style={[
                  styles.subtitle,
                  { color: palette.muted },
                  styles.subtitleLeft,
                ]}>
                {subtitle}
              </ThemedText>
            ) : null}
          </ThemedView>
        ) : (
          <ThemedView style={styles.titleBlock} />
        )}

        <ThemedView style={[styles.side, styles.sideRight]}>{rightAction}</ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 0,
    paddingBottom: spacing.xs,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    minHeight: 40,
  },
  side: {
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sideEmpty: {
    minWidth: 0,
    width: 0,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xxs,
    justifyContent: 'center',
  },
  titleBlockLeft: {
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'left',
  },
  subtitle: {
  },
  subtitleLeft: {
    textAlign: 'left',
  },
});
