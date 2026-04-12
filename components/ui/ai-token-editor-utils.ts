import type { AiTokenDefinition } from './ai-token-chip-picker';

export type AiTokenEditorSegment =
  | { kind: 'text'; value: string; start: number; end: number }
  | { kind: 'token'; value: string; token: AiTokenDefinition | null; start: number; end: number };

export function splitAiTokenSegments(value: string, tokens: AiTokenDefinition[]): AiTokenEditorSegment[] {
  const result: AiTokenEditorSegment[] = [];
  const tokenByText = new Map(tokens.map((token) => [normalizeTokenToken(token.token), token]));
  const matcher = /(\{\{\s*[A-Za-z_][A-Za-z0-9_.]*\s*\}\})/g;
  let lastIndex = 0;

  for (const match of value.matchAll(matcher)) {
    const raw = match[0];
    const index = match.index ?? 0;
    result.push({ kind: 'text', value: value.slice(lastIndex, index), start: lastIndex, end: index });
    const token = tokenByText.get(normalizeTokenToken(raw)) ?? null;
    result.push({ kind: 'token', value: raw, token, start: index, end: index + raw.length });
    lastIndex = index + raw.length;
  }

  result.push({ kind: 'text', value: value.slice(lastIndex), start: lastIndex, end: value.length });

  return result;
}

export function insertTokenAtSelection(args: {
  value: string;
  tokenText: string;
  selectionStart: number;
  selectionEnd: number;
}): { nextValue: string; nextCursor: number } {
  const before = args.value.slice(0, args.selectionStart);
  const after = args.value.slice(args.selectionEnd);
  const beforeNeedsSpace = before.length > 0 && !/\s$/.test(before);
  const afterNeedsSpace = after.length > 0 && !/^\s/.test(after);
  const inserted = `${beforeNeedsSpace ? ' ' : ''}${args.tokenText}${afterNeedsSpace ? ' ' : ''}`;
  const nextValue = `${before}${inserted}${after}`;
  const nextCursor = before.length + inserted.length;

  return { nextValue, nextCursor };
}

export function removeTokenAtRange(args: {
  value: string;
  tokenStart: number;
  tokenEnd: number;
}): { nextValue: string; nextCursor: number } {
  const before = args.value.slice(0, args.tokenStart);
  const after = args.value.slice(args.tokenEnd);
  const afterTrimmed = after.startsWith(' ') ? after.slice(1) : after;
  const nextValue = `${before}${afterTrimmed}`;
  return { nextValue, nextCursor: args.tokenStart };
}

export function deleteTokenWithBackspace(args: {
  value: string;
  cursor: number;
  tokens: AiTokenDefinition[];
}): { handled: boolean; nextValue: string; nextCursor: number } {
  const cursor = Math.max(0, Math.min(args.cursor, args.value.length));
  const segments = splitAiTokenSegments(args.value, args.tokens);

  const tokenEndingAtCursor = segments.find(
    (segment) => segment.kind === 'token' && segment.end === cursor
  );
  if (tokenEndingAtCursor && tokenEndingAtCursor.kind === 'token') {
    const removed = removeTokenAtRange({
      value: args.value,
      tokenStart: tokenEndingAtCursor.start,
      tokenEnd: tokenEndingAtCursor.end,
    });
    return { handled: true, ...removed };
  }

  if (cursor > 0 && args.value[cursor - 1] === ' ') {
    const tokenEndingBeforeSpace = segments.find(
      (segment) => segment.kind === 'token' && segment.end === cursor - 1
    );
    if (tokenEndingBeforeSpace && tokenEndingBeforeSpace.kind === 'token') {
      const removed = removeTokenAtRange({
        value: args.value,
        tokenStart: tokenEndingBeforeSpace.start,
        tokenEnd: cursor,
      });
      return { handled: true, ...removed };
    }
  }

  return { handled: false, nextValue: args.value, nextCursor: cursor };
}

function normalizeTokenToken(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase();
}
