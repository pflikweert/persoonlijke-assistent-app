import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';

type DayEditorialPanelProps = {
  text: string;
  onPress?: () => void;
  numberOfLines?: number;
};

export function DayEditorialPanel({ text, onPress, numberOfLines }: DayEditorialPanelProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const normalizedText = stripOuterQuotes(text);
  const [isTruncated, setIsTruncated] = useState(false);

  const content = (
    <ThemedView style={styles.block}>
      <MaterialIcons name="auto-awesome" size={18} color={palette.primaryStrong} style={styles.icon} />
      <ThemedText
        type="bodySecondary"
        numberOfLines={numberOfLines}
        onTextLayout={(event) => {
          if (typeof numberOfLines !== 'number') {
            setIsTruncated(false);
            return;
          }
          setIsTruncated(event.nativeEvent.lines.length > numberOfLines);
        }}
        style={[styles.text, { color: palette.muted }]}>
        <ThemedText type="bodySecondary" style={[styles.quoteText, { color: palette.mutedSoft }]}>
          {"'"}
        </ThemedText>
        {normalizedText}
        <ThemedText type="bodySecondary" style={[styles.quoteText, { color: palette.mutedSoft }]}>
          {"'"}
        </ThemedText>
      </ThemedText>
      {isTruncated && typeof numberOfLines === 'number' ? (
        <ThemedText type="bodySecondary" style={[styles.quoteText, styles.trailingQuote, { color: palette.mutedSoft }]}>
          {"'"}
        </ThemedText>
      ) : null}
    </ThemedView>
  );

  if (!onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
}

function stripOuterQuotes(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed
    .replace(/^["“”']+/, '')
    .replace(/["“”']+$/, '')
    .trim();
}

const styles = StyleSheet.create({
  block: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: spacing.xs,
    top: spacing.xs,
  },
  text: {
    fontSize: 31,
    lineHeight: 40,
    letterSpacing: -0.35,
    fontStyle: 'italic',
    fontWeight: '300',
    paddingRight: spacing.xl,
  },
  quoteText: {
    fontSize: 37,
    lineHeight: 42,
    letterSpacing: -0.4,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  trailingQuote: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.md,
  },
});
