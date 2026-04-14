export type PromptEditorToken = {
  id: string;
  label: string;
  token: string;
};

export type PromptEditorJsonNode = {
  type: string;
  attrs?: Record<string, unknown>;
  text?: string;
  content?: PromptEditorJsonNode[];
};

export type PromptEditorDocument = {
  type: 'doc';
  content: PromptEditorJsonNode[];
};

export type PromptEditorState = {
  json: PromptEditorDocument;
  text: string;
  tokenIds: string[];
};

export type PromptEditorProps = {
  value: string;
  placeholder?: string;
  minHeight?: number;
  tokens: PromptEditorToken[];
  requestInsertTokenId?: string | null;
  onInsertTokenHandled?: () => void;
  onChangeText: (value: string) => void;
  onStateChange?: (state: PromptEditorState) => void;
};

export function normalizeTokenLiteral(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase();
}

const tokenRegex = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

function trimTrailingBlankLines(value: string): string {
  return value.replace(/(?:\n[ \t]*)+$/g, '');
}

export function textToDoc(text: string, tokens: PromptEditorToken[]): PromptEditorDocument {
  const tokenByLiteral = new Map(tokens.map((item) => [normalizeTokenLiteral(item.token), item]));
  const normalizedText = trimTrailingBlankLines(String(text || '').replace(/\r\n?/g, '\n'));
  const lines = normalizedText.length > 0 ? normalizedText.split(/\n\n/) : [''];
  const content = lines.map((line) => {
    const nodes: PromptEditorJsonNode[] = [];
    let lastIndex = 0;
    for (const match of line.matchAll(tokenRegex)) {
      const matchText = match[0];
      const matchIndex = match.index ?? 0;
      if (matchIndex > lastIndex) {
        nodes.push({ type: 'text', text: line.slice(lastIndex, matchIndex) });
      }
      const entry = tokenByLiteral.get(normalizeTokenLiteral(matchText));
      if (entry) {
        nodes.push({
          type: 'variable',
          attrs: {
            id: entry.id,
            label: entry.label,
            token: entry.token,
          },
        });
      } else {
        nodes.push({ type: 'text', text: matchText });
      }
      lastIndex = matchIndex + matchText.length;
    }
    if (lastIndex < line.length) {
      nodes.push({ type: 'text', text: line.slice(lastIndex) });
    }
    if (nodes.length === 0) {
      return {
        type: 'paragraph',
      } as PromptEditorJsonNode;
    }
    return {
      type: 'paragraph',
      content: nodes,
    } as PromptEditorJsonNode;
  });

  return {
    type: 'doc',
    content: content.length > 0 ? content : [{ type: 'paragraph' }],
  };
}

export function docToText(node: PromptEditorJsonNode | PromptEditorDocument, tokens: PromptEditorToken[]): string {
  const tokenById = new Map(tokens.map((item) => [item.id, item]));

  const trimTrailingEmptyParagraphs = (paragraphs: string[]): string[] => {
    const output = [...paragraphs];
    while (output.length > 0 && output[output.length - 1] === '') {
      output.pop();
    }
    return output;
  };

  const walk = (value: PromptEditorJsonNode): string => {
    if (value.type === 'text') return value.text ?? '';
    if (value.type === 'variable') {
      const token = typeof value.attrs?.token === 'string' ? value.attrs.token : '';
      if (token) return token;
      const id = typeof value.attrs?.id === 'string' ? value.attrs.id : '';
      return tokenById.get(id)?.token ?? '';
    }
    const nested = Array.isArray(value.content) ? value.content : [];
    if (value.type === 'doc') {
      const paragraphs = nested.map(walk);
      return trimTrailingEmptyParagraphs(paragraphs).join('\n\n');
    }
    return nested.map(walk).join('');
  };

  return walk(node as PromptEditorJsonNode);
}

export function collectTokenIds(node: PromptEditorJsonNode | PromptEditorDocument): string[] {
  const output: string[] = [];
  const walk = (value: PromptEditorJsonNode) => {
    if (value.type === 'variable' && typeof value.attrs?.id === 'string') {
      output.push(value.attrs.id);
    }
    const nested = Array.isArray(value.content) ? value.content : [];
    for (const item of nested) walk(item);
  };
  walk(node as PromptEditorJsonNode);
  return output;
}
