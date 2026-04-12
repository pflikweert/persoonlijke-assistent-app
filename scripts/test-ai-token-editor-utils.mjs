function normalizeToken(value) {
  return value.replace(/\s+/g, '').toLowerCase();
}

function splitAiTokenSegments(value, tokens) {
  const result = [];
  const tokenByText = new Map(tokens.map((token) => [normalizeToken(token.token), token]));
  const matcher = /(\{\{\s*[A-Za-z_][A-Za-z0-9_.]*\s*\}\})/g;
  let lastIndex = 0;

  for (const match of value.matchAll(matcher)) {
    const raw = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      result.push({ kind: 'text', value: value.slice(lastIndex, index), start: lastIndex, end: index });
    }
    const token = tokenByText.get(normalizeToken(raw)) ?? null;
    result.push({ kind: 'token', value: raw, token, start: index, end: index + raw.length });
    lastIndex = index + raw.length;
  }

  if (lastIndex < value.length) {
    result.push({ kind: 'text', value: value.slice(lastIndex), start: lastIndex, end: value.length });
  }

  return result;
}

function removeTokenAtRange({ value, tokenStart, tokenEnd }) {
  const before = value.slice(0, tokenStart);
  const after = value.slice(tokenEnd);
  const afterTrimmed = after.startsWith(' ') ? after.slice(1) : after;
  const nextValue = `${before}${afterTrimmed}`;
  return { nextValue, nextCursor: tokenStart };
}

function deleteTokenWithBackspace({ value, cursor, tokens }) {
  const safeCursor = Math.max(0, Math.min(cursor, value.length));
  const segments = splitAiTokenSegments(value, tokens);

  const tokenEndingAtCursor = segments.find(
    (segment) => segment.kind === 'token' && segment.end === safeCursor
  );
  if (tokenEndingAtCursor && tokenEndingAtCursor.kind === 'token') {
    const removed = removeTokenAtRange({
      value,
      tokenStart: tokenEndingAtCursor.start,
      tokenEnd: tokenEndingAtCursor.end,
    });
    return { handled: true, ...removed };
  }

  if (safeCursor > 0 && value[safeCursor - 1] === ' ') {
    const tokenEndingBeforeSpace = segments.find(
      (segment) => segment.kind === 'token' && segment.end === safeCursor - 1
    );
    if (tokenEndingBeforeSpace && tokenEndingBeforeSpace.kind === 'token') {
      const removed = removeTokenAtRange({
        value,
        tokenStart: tokenEndingBeforeSpace.start,
        tokenEnd: safeCursor,
      });
      return { handled: true, ...removed };
    }
  }

  return { handled: false, nextValue: value, nextCursor: safeCursor };
}

function insertTokenAtSelection({ value, tokenText, selectionStart, selectionEnd }) {
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const beforeNeedsSpace = before.length > 0 && !/\s$/.test(before);
  const afterNeedsSpace = after.length > 0 && !/^\s/.test(after);
  const inserted = `${beforeNeedsSpace ? ' ' : ''}${tokenText}${afterNeedsSpace ? ' ' : ''}`;
  const nextValue = `${before}${inserted}${after}`;
  const nextCursor = before.length + inserted.length;
  return { nextValue, nextCursor };
}

function assert(name, condition) {
  if (!condition) {
    throw new Error(`FAILED: ${name}`);
  }
}

const TOKENS = [
  { id: 'rawText', kind: 'input', label: 'Ruwe tekst', token: '{{input.rawText}}' },
  { id: 'title', kind: 'output', label: 'Titel', token: '{{output.title}}' },
  { id: 'body', kind: 'output', label: 'Body', token: '{{output.body}}' },
  { id: 'summary_short', kind: 'output', label: 'Summary short', token: '{{output.summary_short}}' },
];

// Case 1: insert in empty field
{
  const out = insertTokenAtSelection({
    value: '',
    tokenText: '{{output.body}}',
    selectionStart: 0,
    selectionEnd: 0,
  });
  assert('insert empty keeps exact token', out.nextValue === '{{output.body}}');
  assert('cursor after token', out.nextCursor === '{{output.body}}'.length);
}

// Case 2: insert mid-sentence, no duplicate spaces
{
  const source = 'Maak precies drie outputs.';
  const out = insertTokenAtSelection({
    value: source,
    tokenText: '{{output.title}}',
    selectionStart: 4,
    selectionEnd: 4,
  });
  assert('no triple spaces near insert', !/\s{3,}/.test(out.nextValue));
}

// Case 3: replace selection
{
  const source = 'Gebruik X en Y';
  const out = insertTokenAtSelection({
    value: source,
    tokenText: '{{input.rawText}}',
    selectionStart: 8,
    selectionEnd: 9,
  });
  assert('selection replaced', out.nextValue.includes('{{input.rawText}}'));
  assert('old marker removed', !out.nextValue.includes('X en'));
}

// Case 4: segment ranges are stable for token remove
{
  const source = 'A {{output.title}} B';
  const segments = splitAiTokenSegments(source, TOKENS);
  const tokenSegment = segments.find((item) => item.kind === 'token');
  assert('token segment found', Boolean(tokenSegment));
  const removed = removeTokenAtRange({
    value: source,
    tokenStart: tokenSegment.start,
    tokenEnd: tokenSegment.end,
  });
  assert('token removed cleanly', removed.nextValue === 'A B');
}

// Case 5: segment split mixed text/token/text
{
  const source = 'A {{output.title}} B';
  const segments = splitAiTokenSegments(source, TOKENS);
  assert('has 3 segments', segments.length === 3);
  assert('middle is token', segments[1].kind === 'token');
  assert('token recognized', segments[1].token?.id === 'title');
}

// Case 6: unknown token preserved as unknown token segment
{
  const source = 'A {{output.unknown}} B';
  const segments = splitAiTokenSegments(source, TOKENS);
  assert('unknown token still parsed as token segment', segments[1].kind === 'token');
  assert('unknown token remains unbound', segments[1].token === null);
}

// Case 7: backspace at token boundary removes whole token
{
  const source = 'voor {{output.body}} na';
  const cursor = 'voor {{output.body}}'.length;
  const out = deleteTokenWithBackspace({ value: source, cursor, tokens: TOKENS });
  assert('backspace token removal handled', out.handled === true);
  assert('token removed in one action', out.nextValue === 'voor na');
}

// Case 8: backspace in plain text does nothing special
{
  const source = 'gewone tekst';
  const out = deleteTokenWithBackspace({ value: source, cursor: source.length, tokens: TOKENS });
  assert('plain text backspace not hijacked', out.handled === false);
}

console.log('OK: ai-token-editor utils validation passed (8 scenarios).');
