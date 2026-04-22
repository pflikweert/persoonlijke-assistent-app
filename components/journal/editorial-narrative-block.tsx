import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { MarkdownDisplay } from '@/components/ui/markdown-display';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';

type EditorialNarrativeBlockProps = {
  text: string;
  title?: string;
  action?: ReactNode;
  style?: ViewStyle;
};

export function EditorialNarrativeBlock({
  text,
  title,
  action,
  style,
}: EditorialNarrativeBlockProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <ThemedView lightColor="transparent" darkColor="transparent" style={[styles.block, style]}>
      {title || action ? (
        <ThemedView style={styles.headerRow}>
          {title ? (
            <ThemedText type="meta" style={[styles.title, { color: palette.primary }]}>
              {title}
            </ThemedText>
          ) : (
            <ThemedView />
          )}
          {action ?? null}
        </ThemedView>
      ) : null}
      <MarkdownDisplay
        markdown={text}
        variant="narrative"
        textStyle={[styles.text, { color: palette.text }]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    letterSpacing: 0.4,
  },
  text: {
    fontSize: 20,
    lineHeight: 34,
    letterSpacing: -0.2,
  },
});
