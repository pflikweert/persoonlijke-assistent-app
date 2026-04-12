import { StyleSheet, TextInput, type NativeSyntheticEvent, type TextInputSelectionChangeEventData } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';

import type { AiTokenDefinition } from './ai-token-chip-picker';
import { splitAiTokenSegments } from './ai-token-editor-utils';

type AiTokenEditorProps = {
  value: string;
  minHeight?: number;
  tokens: AiTokenDefinition[];
  onChangeText: (value: string) => void;
  onSelectionChange: (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
};

export function AiTokenEditor({ value, minHeight = 140, tokens, onChangeText, onSelectionChange }: AiTokenEditorProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const tokenSegments = splitAiTokenSegments(value, tokens).filter((segment) => segment.kind === 'token');
  const uniqueTokenLabels = Array.from(
    new Map(
      tokenSegments.map((segment) => {
        const label = segment.token?.label ?? segment.value;
        const kind = segment.token?.kind ?? 'output';
        return [label, { label, kind }] as const;
      })
    ).values()
  );

  return (
    <ThemedView style={[styles.root, { borderColor: palette.separator, backgroundColor: palette.surfaceLowest }]}> 
      <TextInput
        multiline
        textAlignVertical="top"
        value={value}
        onChangeText={onChangeText}
        onSelectionChange={onSelectionChange}
        cursorColor={palette.primary}
        selectionColor={palette.primary}
        style={[styles.input, { color: palette.text, minHeight }]}
      />

      {uniqueTokenLabels.length > 0 ? (
        <ThemedView style={styles.usedTokensWrap}>
          <ThemedText type="meta">Gebruikte tokens</ThemedText>
          <ThemedView style={styles.tokenRow}>
            {uniqueTokenLabels.map((item, index) => {
              const isInput = item.kind === 'input';
              return (
                <ThemedView
                  key={`used-token-${item.label}-${index}`}
                  style={[styles.chip, { backgroundColor: isInput ? palette.surfaceLow : palette.surface }]}
                >
                  <ThemedText type="caption" style={{ color: isInput ? palette.info : palette.primary }}>
                    {item.label}
                  </ThemedText>
                </ThemedView>
              );
            })}
          </ThemedView>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: spacing.xs,
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    lineHeight: 24,
  },
  usedTokensWrap: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  tokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
