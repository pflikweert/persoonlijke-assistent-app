const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;
const USER_HEADER_PREFIX = '>[!nexus_user] **User** - ';
const ASSISTANT_HEADER_PREFIX = '>[!nexus_agent] **Assistant** - ';
const UID_PATTERN = /^<!--\s*UID:\s*(.*?)\s*-->$/i;

export type ChatGptMarkdownMessage = {
  capturedAt: string;
  rawText: string;
  externalMessageId: string | null;
  sourceHeader: string;
};

export type ChatGptMarkdownPreview = {
  fileName: string;
  conversationTitle: string | null;
  conversationAlias: string | null;
  sourceRef: string;
  sourceConversationId: string | null;
  userEntryCount: number;
  firstDate: string | null;
  lastDate: string | null;
  uniqueDayCount: number;
  exampleEntries: string[];
  messages: ChatGptMarkdownMessage[];
};

function parseFrontmatter(input: string): { metadata: Record<string, string>; rest: string } {
  const match = input.match(FRONTMATTER_PATTERN);
  if (!match) {
    return { metadata: {}, rest: input };
  }

  const metadata: Record<string, string> = {};

  for (const line of match[1].split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');

    if (key) {
      metadata[key] = value;
    }
  }

  return { metadata, rest: input.slice(match[0].length) };
}

function parseHeaderTimestamp(headerLine: string): string {
  const raw = headerLine.slice(USER_HEADER_PREFIX.length).trim();
  const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) at (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i);

  if (!match) {
    throw new Error(`Onbekende datum in importblok: ${raw}`);
  }

  let hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const meridiem = match[7].toUpperCase();

  if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  } else if (meridiem === 'PM' && hour < 12) {
    hour += 12;
  }

  const month = Number(match[1]) - 1;
  const day = Number(match[2]);
  const year = Number(match[3]);

  // Header timestamps in markdown are wall-clock values without explicit timezone.
  // Interpret them in the current local timezone to keep imported day grouping consistent.
  return new Date(year, month, day, hour, minute, second).toISOString();
}

function normalizeQuotedContent(lines: string[]): string {
  const stripped = lines.map((line) => {
    if (line === '>') {
      return '';
    }

    if (line.startsWith('> ')) {
      return line.slice(2);
    }

    if (line.startsWith('>')) {
      return line.slice(1);
    }

    return line;
  });

  while (stripped.length > 0 && stripped[0].trim() === '') {
    stripped.shift();
  }

  while (stripped.length > 0 && stripped[stripped.length - 1].trim() === '') {
    stripped.pop();
  }

  const collapsed: string[] = [];
  let previousBlank = false;

  for (const line of stripped) {
    const clean = line.replace(/\r/g, '');
    if (clean.trim() === '') {
      if (!previousBlank && collapsed.length > 0) {
        collapsed.push('');
      }
      previousBlank = true;
      continue;
    }

    collapsed.push(clean);
    previousBlank = false;
  }

  return collapsed.join('\n').trim();
}

function previewSnippet(value: string): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= 140) {
    return clean;
  }

  return `${clean.slice(0, 137).trimEnd()}...`;
}

function hashString(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `fallback-${(hash >>> 0).toString(16)}`;
}

function buildSourceRef(metadata: Record<string, string>, messages: ChatGptMarkdownMessage[]): string {
  const conversationId = metadata.conversation_id?.trim();
  if (conversationId) {
    return conversationId;
  }

  const fingerprint = [
    metadata.title ?? '',
    metadata.aliases ?? '',
    metadata.create_time ?? '',
    metadata.update_time ?? '',
    ...messages.map((message) => `${message.capturedAt}|${message.rawText}`),
  ].join('||');

  return hashString(fingerprint);
}

function toLocalJournalDate(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return isoValue.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseChatGptMarkdownFile(input: {
  fileName: string;
  markdown: string;
}): ChatGptMarkdownPreview {
  const markdown = String(input.markdown ?? '').replace(/\r\n?/g, '\n');
  const { metadata, rest } = parseFrontmatter(markdown);
  const lines = rest.split('\n');
  const messages: ChatGptMarkdownMessage[] = [];

  let index = 0;
  while (index < lines.length) {
    const line = lines[index]?.trimEnd() ?? '';

    if (!line.startsWith('>[!nexus_')) {
      index += 1;
      continue;
    }

    const isUser = line.startsWith(USER_HEADER_PREFIX);
    const isAssistant = line.startsWith(ASSISTANT_HEADER_PREFIX);
    if (!isUser && !isAssistant) {
      index += 1;
      continue;
    }

    const blockLines: string[] = [];
    let externalMessageId: string | null = null;
    const sourceHeader = line;
    index += 1;

    while (index < lines.length) {
      const current = lines[index] ?? '';
      const trimmed = current.trim();

      if (trimmed.startsWith('>[!nexus_')) {
        break;
      }

      const uidMatch = trimmed.match(UID_PATTERN);
      if (uidMatch) {
        externalMessageId = uidMatch[1]?.trim() || null;
        index += 1;
        continue;
      }

      if (trimmed === '---' && blockLines.length === 0) {
        index += 1;
        continue;
      }

      if (current.startsWith('>')) {
        blockLines.push(current);
      }

      index += 1;
    }

    if (!isUser) {
      continue;
    }

    const rawText = normalizeQuotedContent(blockLines);
    if (!rawText) {
      continue;
    }

    messages.push({
      capturedAt: parseHeaderTimestamp(sourceHeader),
      rawText,
      externalMessageId,
      sourceHeader,
    });
  }

  const sorted = [...messages].sort((left, right) => left.capturedAt.localeCompare(right.capturedAt));
  const uniqueDays = new Set(sorted.map((message) => toLocalJournalDate(message.capturedAt)));

  return {
    fileName: input.fileName,
    conversationTitle: metadata.title?.trim() || null,
    conversationAlias: metadata.aliases?.trim() || null,
    sourceRef: buildSourceRef(metadata, sorted),
    sourceConversationId: metadata.conversation_id?.trim() || null,
    userEntryCount: sorted.length,
    firstDate: sorted[0]?.capturedAt ?? null,
    lastDate: sorted[sorted.length - 1]?.capturedAt ?? null,
    uniqueDayCount: uniqueDays.size,
    exampleEntries: sorted.slice(0, 3).map((message) => previewSnippet(message.rawText)),
    messages: sorted,
  };
}

export function summarizePreviewDate(isoValue: string | null): string {
  if (!isoValue) {
    return '-';
  }

  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return isoValue;
  }

  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function listPreviewDays(preview: ChatGptMarkdownPreview): string[] {
  return [...new Set(preview.messages.map((message) => toLocalJournalDate(message.capturedAt)))].sort();
}
