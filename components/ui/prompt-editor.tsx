import { Platform } from 'react-native';
import type { ReactElement } from 'react';

import type { PromptEditorProps, PromptEditorState } from './prompt-editor-types';

export type { PromptEditorState };

function resolvePromptEditor() {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./prompt-editor.web').PromptEditor as (props: PromptEditorProps) => ReactElement;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('./prompt-editor.native').PromptEditor as (props: PromptEditorProps) => ReactElement;
}

export function PromptEditor(props: PromptEditorProps) {
  const Component = resolvePromptEditor();
  return <Component {...props} />;
}
