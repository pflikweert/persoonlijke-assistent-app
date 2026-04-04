import { StyleSheet, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing, typography } from '@/theme';

type DayJournalSummaryInsetProps = {
  text: string;
  style?: ViewStyle;
};

export function DayJournalSummaryInset({ text, style }: DayJournalSummaryInsetProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLowest}
      darkColor={colorTokens.dark.surfaceLow}
      style={[styles.summaryInset, { borderLeftColor: `${palette.primary}55` }, style]}>
      <ThemedText type="bodySecondary" style={styles.summaryInsetText}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  summaryInset: {
    borderLeftWidth: 2,
    borderTopRightRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryInsetText: {
    fontStyle: 'italic',
    lineHeight: typography.roles.bodySecondary.lineHeight + 3,
  },
});

