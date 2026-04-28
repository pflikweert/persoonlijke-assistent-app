import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import { MarkdownDisplay } from '@/components/ui/markdown-display';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';

type DayJournalSummaryInsetProps = {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function DayJournalSummaryInset({
  text,
  style,
  textStyle,
}: DayJournalSummaryInsetProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const accentColor = palette.accentWarm;

  return (
    <ThemedView
      lightColor="transparent"
      darkColor="transparent"
      style={[styles.summaryInset, { borderLeftColor: accentColor }, style]}>
      <MarkdownDisplay
        markdown={text}
        variant="summary"
        textStyle={[styles.summaryInsetText, { color: palette.text }, textStyle]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  summaryInset: {
    borderLeftWidth: 2,
    paddingLeft: spacing.md,
  },
  summaryInsetText: {
    fontStyle: 'italic',
    fontSize: 21,
    lineHeight: 33,
  },
});
