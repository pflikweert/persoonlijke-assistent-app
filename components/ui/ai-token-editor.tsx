import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { colorTokens, spacing } from '@/theme';

import type { AiTokenDefinition } from './ai-token-chip-picker';
import { PromptEditor, type PromptEditorState } from './prompt-editor';

export type { PromptEditorState };

type AiTokenEditorProps = {
  value: string;
  minHeight?: number;
  tokens: AiTokenDefinition[];
  onChangeText: (value: string) => void;
  requestInsertTokenId?: string | null;
  onInsertTokenHandled?: () => void;
  onEditorStateChange?: (state: PromptEditorState) => void;
};

export function AiTokenEditor({
  value,
  minHeight = 140,
  tokens,
  onChangeText,
  requestInsertTokenId,
  onInsertTokenHandled,
  onEditorStateChange,
}: AiTokenEditorProps) {
  const lightPalette = colorTokens.light;

  return (
    <ThemedView style={[styles.root, { borderColor: lightPalette.separator, backgroundColor: lightPalette.surfaceLowest }]}> 
      <PromptEditor
        value={value}
        placeholder="Typ instructie…"
        tokens={tokens}
        minHeight={minHeight}
        onChangeText={onChangeText}
        onStateChange={onEditorStateChange}
        requestInsertTokenId={requestInsertTokenId}
        onInsertTokenHandled={onInsertTokenHandled}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: spacing.xs,
  },
});
