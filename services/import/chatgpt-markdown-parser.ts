const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;
const USER_HEADER_PREFIX = '>[!nexus_user] **User** - ';
const ASSISTANT_HEADER_PREFIX = '>[!nexus_agent] **Assistant** - ';
const UID_PATTERN = /^<!--\s*UID:\s*(.*?)\s*-->$/i;
const JOURNAL_ARCHIVE_SOURCE_REF = 'journal-archive';
const JOURNAL_ARCHIVE_HEADER = '# Mijn archief';
const JOURNAL_ARCHIVE_DAYS_HEADER = '## Dagen';
const JOURNAL_DATE_HEADER_PATTERN = /^###\s+(\d{4}-\d{2}-\d{2})$/;
const ENTRY_HEADER_PATTERN = /^####\s+Entry\s+\d+\s+·\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\s+·\s+(tekst|spraak)$/i;
const LOOSE_ENTRY_HEADER_PATTERN = /^###\s+Losse entry\s+\d+\s+·\s+/i;
const LOOSE_ENTRY_META_PATTERN = /^Vastgelegd:\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\s+·\s+(tekst|spraak)$/i;
const EXPORT_DATE_PATTERN = /^Exportdatum:\s*(\d{4}-\d{2}-\d{2})$/i;

export type MarkdownImportFormat = 'chatgpt_markdown' | 'journal_archive';
export type ImportedMessageSourceType = 'text' | 'audio';

export type ImportedMarkdownMessage = {
  capturedAt: string;
  rawText: string;
  externalMessageId: string | null;
  sourceHeader: string | null;
  sourceType: ImportedMessageSourceType;
};

export type ImportedMarkdownPreview = {
  fileName: string;
  format: MarkdownImportFormat;
  conversationTitle: string | null;
  conversationAlias: string | null;
  sourceRef: string;
  sourceConversationId: string | null;
  userEntryCount: number;
  firstDate: string | null;
  lastDate: string | null;
  uniqueDayCount: number;
  exampleEntries: string[];
  messages: ImportedMarkdownMessage[];
};

export type ChatGptMarkdownMessage = ImportedMarkdownMessage;
export type ChatGptMarkdownPreview = ImportedMarkdownPreview;

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
  const amPmMatch = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}) at (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/i
  );
  const twentyFourHourMatch = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}) at (\d{1,2}):(\d{2}):(\d{2})$/i
  );

  let year = 0;
  let month = 0;
  let day = 0;
  let hour = 0;
  let minute = 0;
  let second = 0;

  if (amPmMatch) {
    year = Number(amPmMatch[3]);
    month = Number(amPmMatch[1]) - 1;
    day = Number(amPmMatch[2]);
    hour = Number(amPmMatch[4]);
    minute = Number(amPmMatch[5]);
    second = Number(amPmMatch[6]);

    const meridiem = amPmMatch[7].toUpperCase();
    if (meridiem === 'AM' && hour === 12) {
      hour = 0;
    } else if (meridiem === 'PM' && hour < 12) {
      hour += 12;
    }
  } else if (twentyFourHourMatch) {
    year = Number(twentyFourHourMatch[3]);
    day = Number(twentyFourHourMatch[1]);
    month = Number(twentyFourHourMatch[2]) - 1;
    hour = Number(twentyFourHourMatch[4]);
    minute = Number(twentyFourHourMatch[5]);
    second = Number(twentyFourHourMatch[6]);
  } else {
    throw new Error(`Onbekende datum in importblok: ${raw}`);
  }

  return new Date(year, month, day, hour, minute, second).toISOString();
}

function parseArchiveTimestamp(raw: string): string {
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Onbekende datum in archiefentry: ${raw}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  return new Date(year, month, day, hour, minute, 0).toISOString();
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

function normalizeBlockContent(lines: string[]): string {
  const stripped = lines.map((line) => line.replace(/\r/g, '').trimEnd());

  while (stripped.length > 0 && stripped[0].trim() === '') {
    stripped.shift();
  }

  while (stripped.length > 0 && stripped[stripped.length - 1].trim() === '') {
    stripped.pop();
  }

  const collapsed: string[] = [];
  let previousBlank = false;

  for (const line of stripped) {
    if (line.trim() === '') {
      if (!previousBlank && collapsed.length > 0) {
        collapsed.push('');
      }
      previousBlank = true;
      continue;
    }

    collapsed.push(line);
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

function buildSourceRef(metadata: Record<string, string>, messages: ImportedMarkdownMessage[]): string {
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

function finalizePreview(input: {
  fileName: string;
  format: MarkdownImportFormat;
  conversationTitle: string | null;
  conversationAlias: string | null;
  sourceRef: string;
  sourceConversationId: string | null;
  messages: ImportedMarkdownMessage[];
}): ImportedMarkdownPreview {
  const sorted = [...input.messages].sort((left, right) => left.capturedAt.localeCompare(right.capturedAt));
  const uniqueDays = new Set(sorted.map((message) => toLocalJournalDate(message.capturedAt)));

  return {
    fileName: input.fileName,
    format: input.format,
    conversationTitle: input.conversationTitle,
    conversationAlias: input.conversationAlias,
    sourceRef: input.sourceRef,
    sourceConversationId: input.sourceConversationId,
    userEntryCount: sorted.length,
    firstDate: sorted[0]?.capturedAt ?? null,
    lastDate: sorted[sorted.length - 1]?.capturedAt ?? null,
    uniqueDayCount: uniqueDays.size,
    exampleEntries: sorted.slice(0, 3).map((message) => previewSnippet(message.rawText)),
    messages: sorted,
  };
}

function parseChatGptBlocks(input: { fileName: string; markdown: string }): ImportedMarkdownPreview {
  const markdown = String(input.markdown ?? '').replace(/\r\n?/g, '\n');
  const { metadata, rest } = parseFrontmatter(markdown);
  const lines = rest.split('\n');
  const messages: ImportedMarkdownMessage[] = [];

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
      sourceType: 'text',
    });
  }

  return finalizePreview({
    fileName: input.fileName,
    format: 'chatgpt_markdown',
    conversationTitle: metadata.title?.trim() || null,
    conversationAlias: metadata.aliases?.trim() || null,
    sourceRef: buildSourceRef(metadata, messages),
    sourceConversationId: metadata.conversation_id?.trim() || null,
    messages,
  });
}

function isJournalArchiveMarkdown(markdown: string): boolean {
  const normalized = String(markdown ?? '').replace(/\r\n?/g, '\n');
  return (
    normalized.includes(JOURNAL_ARCHIVE_HEADER) &&
    normalized.includes(JOURNAL_ARCHIVE_DAYS_HEADER) &&
    normalized.includes('Exportdatum:')
  );
}

function isDaySectionHeader(line: string): boolean {
  return JOURNAL_DATE_HEADER_PATTERN.test(line);
}

function isLooseEntrySectionHeader(line: string): boolean {
  return LOOSE_ENTRY_HEADER_PATTERN.test(line);
}

function isEntryHeader(line: string): boolean {
  return ENTRY_HEADER_PATTERN.test(line);
}

function isTopLevelSectionHeader(line: string): boolean {
  return line.startsWith('## ');
}

function startsNewArchiveSection(line: string): boolean {
  return (
    isEntryHeader(line) ||
    isDaySectionHeader(line) ||
    isLooseEntrySectionHeader(line) ||
    isTopLevelSectionHeader(line)
  );
}

function parseArchiveEntryHeader(line: string): { capturedAt: string; sourceType: ImportedMessageSourceType } | null {
  const match = line.match(ENTRY_HEADER_PATTERN);
  if (!match) {
    return null;
  }

  return {
    capturedAt: parseArchiveTimestamp(match[1]),
    sourceType: match[2].toLowerCase() === 'spraak' ? 'audio' : 'text',
  };
}

function parseLooseEntryMeta(line: string): { capturedAt: string; sourceType: ImportedMessageSourceType } | null {
  const match = line.match(LOOSE_ENTRY_META_PATTERN);
  if (!match) {
    return null;
  }

  return {
    capturedAt: parseArchiveTimestamp(match[1]),
    sourceType: match[2].toLowerCase() === 'spraak' ? 'audio' : 'text',
  };
}

function collectEntryBody(lines: string[], startIndex: number): { body: string; nextIndex: number } {
  const bodyLines: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const current = lines[index] ?? '';
    const trimmed = current.trim();
    if (startsNewArchiveSection(trimmed)) {
      break;
    }

    bodyLines.push(current);
    index += 1;
  }

  return {
    body: normalizeBlockContent(bodyLines),
    nextIndex: index,
  };
}

function parseJournalArchiveFile(input: { fileName: string; markdown: string }): ImportedMarkdownPreview {
  const markdown = String(input.markdown ?? '').replace(/\r\n?/g, '\n');
  const lines = markdown.split('\n');
  const messages: ImportedMarkdownMessage[] = [];

  const exportDateLine = lines.find((line) => EXPORT_DATE_PATTERN.test(line.trim()));
  const exportDate = exportDateLine?.trim().match(EXPORT_DATE_PATTERN)?.[1] ?? null;

  let index = 0;
  while (index < lines.length) {
    const line = lines[index]?.trim() ?? '';

    if (isDaySectionHeader(line)) {
      index += 1;
      while (index < lines.length) {
        const current = lines[index]?.trim() ?? '';
        if (isEntryHeader(current) || isDaySectionHeader(current) || isLooseEntrySectionHeader(current) || isTopLevelSectionHeader(current)) {
          break;
        }
        index += 1;
      }

      while (index < lines.length) {
        const current = lines[index]?.trim() ?? '';
        const parsedHeader = parseArchiveEntryHeader(current);
        if (!parsedHeader) {
          if (isDaySectionHeader(current) || isLooseEntrySectionHeader(current) || isTopLevelSectionHeader(current)) {
            break;
          }
          index += 1;
          continue;
        }

        const { body, nextIndex } = collectEntryBody(lines, index + 1);
        if (body) {
          messages.push({
            capturedAt: parsedHeader.capturedAt,
            rawText: body,
            externalMessageId: null,
            sourceHeader: current,
            sourceType: parsedHeader.sourceType,
          });
        }
        index = nextIndex;
      }
      continue;
    }

    if (isLooseEntrySectionHeader(line)) {
      let metaIndex = index + 1;
      let meta: { capturedAt: string; sourceType: ImportedMessageSourceType } | null = null;

      while (metaIndex < lines.length) {
        const current = lines[metaIndex]?.trim() ?? '';
        if (isDaySectionHeader(current) || isLooseEntrySectionHeader(current) || isTopLevelSectionHeader(current)) {
          break;
        }
        meta = parseLooseEntryMeta(current);
        if (meta) {
          metaIndex += 1;
          break;
        }
        metaIndex += 1;
      }

      if (!meta) {
        index += 1;
        continue;
      }

      const { body, nextIndex } = collectEntryBody(lines, metaIndex);
      if (body) {
        messages.push({
          capturedAt: meta.capturedAt,
          rawText: body,
          externalMessageId: null,
          sourceHeader: line,
          sourceType: meta.sourceType,
        });
      }
      index = nextIndex;
      continue;
    }

    index += 1;
  }

  return finalizePreview({
    fileName: input.fileName,
    format: 'journal_archive',
    conversationTitle: 'Mijn archief',
    conversationAlias: exportDate ? `Export ${exportDate}` : 'App-export',
    sourceRef: JOURNAL_ARCHIVE_SOURCE_REF,
    sourceConversationId: null,
    messages,
  });
}

export function parseImportMarkdownFile(input: {
  fileName: string;
  markdown: string;
}): ImportedMarkdownPreview {
  if (isJournalArchiveMarkdown(input.markdown)) {
    return parseJournalArchiveFile(input);
  }

  return parseChatGptBlocks(input);
}

export function parseChatGptMarkdownFile(input: {
  fileName: string;
  markdown: string;
}): ChatGptMarkdownPreview {
  return parseChatGptBlocks(input);
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

export function listPreviewDays(preview: ImportedMarkdownPreview): string[] {
  return [...new Set(preview.messages.map((message) => toLocalJournalDate(message.capturedAt)))].sort();
}
