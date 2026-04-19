import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
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
  const accentColor = scheme === 'dark' ? '#B8A47A' : '#8A6A1F';
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      lightColor="transparent"
      darkColor="transparent"
      style={[styles.summaryInset, { borderLeftColor: accentColor }, style]}>
      <ThemedText
        type="defaultSemiBold"
        style={[styles.summaryInsetText, { color: palette.text }, textStyle]}>
        {text}
      </ThemedText>
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
