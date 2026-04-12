import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';

export type AiTokenDefinition = {
  id: string;
  kind: 'input' | 'output';
  label: string;
  token: string;
};

type AiTokenChipPickerProps = {
  tokens: AiTokenDefinition[];
  onInsertToken: (tokenId: string) => void;
};

export function AiTokenChipPicker({ tokens, onInsertToken }: AiTokenChipPickerProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const inputTokens = tokens.filter((item) => item.kind === 'input');
  const outputTokens = tokens.filter((item) => item.kind === 'output');

  return (
    <ThemedView style={styles.root}>
      <ThemedView style={styles.group}>
        <ThemedText type="meta">Input</ThemedText>
        <ThemedView style={styles.row}>
          {inputTokens.map((token) => (
            <Pressable
              key={token.id}
              accessibilityRole="button"
              onPress={() => onInsertToken(token.id)}
              style={[styles.chip, { backgroundColor: palette.surfaceLow }]}
            >
              <ThemedText type="caption" style={{ color: palette.info }}>
                {token.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.group}>
        <ThemedText type="meta">Output</ThemedText>
        <ThemedView style={styles.row}>
          {outputTokens.map((token) => (
            <Pressable
              key={token.id}
              accessibilityRole="button"
              onPress={() => onInsertToken(token.id)}
              style={[styles.chip, { backgroundColor: palette.surface }]}
            >
              <ThemedText type="caption" style={{ color: palette.primary }}>
                {token.label}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.xs,
  },
  group: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
