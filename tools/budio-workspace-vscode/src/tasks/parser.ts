import path from 'node:path';
import {
  CONCRETE_CHECKLIST_HEADING,
  TASK_KINDS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_WORKSTREAMS,
} from './constants';
import type {
  ChecklistItem,
  FileVersion,
  FrontmatterValue,
  ParsedTaskFile,
  TaskBucket,
  TaskKind,
  TaskPriority,
  TaskSectionRange,
  TaskStatus,
  TaskWorkstream,
} from './types';

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;
const HEADING_PATTERN = /^## (.+)$/;
const CHECKLIST_PATTERN = /^- \[( |x|X)\] (.+)$/;
const H1_PATTERN = /^# (.+)$/;

export function normalizeLineEndings(input: string): string {
  return input.replace(/\r\n?/g, '\n');
}

export function parseTaskFile(input: {
  absolutePath: string;
  relativePath: string;
  content: string;
  version: FileVersion;
}): ParsedTaskFile {
  const content = normalizeLineEndings(input.content);
  const { frontmatterOrder, frontmatterValues, body } = parseFrontmatter(content);
  const bodyLines = body.split('\n');
  const sections = parseSections(bodyLines);
  const firstHeadingLineIndex = bodyLines.findIndex((line) => H1_PATTERN.test(line));
  const checklistSection = sections.get(CONCRETE_CHECKLIST_HEADING.toLowerCase());
  const { checklist, checklistLineIndexes } = parseChecklist(checklistSection?.lines ?? []);

  const bucket = inferBucket(input.relativePath);
  const id = readRequiredString(frontmatterValues.id, 'id', input.relativePath);
  const titleFromFrontmatter = readRequiredString(frontmatterValues.title, 'title', input.relativePath);
  const titleFromHeading =
    firstHeadingLineIndex >= 0 ? bodyLines[firstHeadingLineIndex].replace(/^# /, '').trim() : '';
  const title = titleFromFrontmatter || titleFromHeading;
  const status = readTaskStatus(frontmatterValues.status, input.relativePath);
  const priority = readTaskPriority(frontmatterValues.priority, input.relativePath);
  const phase = readRequiredString(frontmatterValues.phase, 'phase', input.relativePath);
  const source = readRequiredString(frontmatterValues.source, 'source', input.relativePath);
  const updatedAt = readRequiredString(frontmatterValues.updated_at, 'updated_at', input.relativePath);
  const summary = normalizeSummaryText(readOptionalString(frontmatterValues.summary) ?? deriveSummary(sections));
  const tags = readStringArray(frontmatterValues.tags);
  const workstream = readTaskWorkstream(frontmatterValues.workstream);
  const epicId = readOptionalString(frontmatterValues.epic_id);
  const parentTaskId = readOptionalString(frontmatterValues.parent_task_id);
  const dependsOn = readStringArray(frontmatterValues.depends_on);
  const followsAfter = readStringArray(frontmatterValues.follows_after);
  const taskKind = readTaskKind(frontmatterValues.task_kind);
  const dueDate = readOptionalString(frontmatterValues.due_date);
  const sortOrder = readOptionalNumber(frontmatterValues.sort_order);
  const activeAgent = readOptionalString(frontmatterValues.active_agent);
  const activeAgentModel = readOptionalString(frontmatterValues.active_agent_model);
  const activeAgentRuntime = readOptionalString(frontmatterValues.active_agent_runtime);
  const activeAgentSince = readOptionalString(frontmatterValues.active_agent_since);
  const activeAgentStatus = readOptionalString(frontmatterValues.active_agent_status);
  const activeAgentSettings = readOptionalString(frontmatterValues.active_agent_settings);
  const excerpt = buildExcerpt(summary);
  const hasBody = body.trim().length > 0;

  return {
    id,
    title,
    status,
    phase,
    priority,
    source,
    updatedAt,
    summary,
    tags,
    workstream,
    epicId,
    parentTaskId,
    dependsOn,
    followsAfter,
    taskKind,
    dueDate,
    sortOrder,
    activeAgent,
    activeAgentModel,
    activeAgentRuntime,
    activeAgentSince,
    activeAgentStatus,
    activeAgentSettings,
    checklist,
    bucket,
    sourcePath: input.absolutePath,
    relativePath: input.relativePath,
    folder: path.dirname(input.relativePath),
    body,
    raw: content,
    excerpt,
    hasBody,
    lastModified: new Date(input.version.mtimeMs).toISOString(),
    version: input.version,
    frontmatterValues,
    frontmatterOrder,
    bodyLines,
    sections,
    firstHeadingLineIndex: firstHeadingLineIndex >= 0 ? firstHeadingLineIndex : null,
    checklistLineIndexes: checklistSection
      ? checklistLineIndexes.map((index) => checklistSection.contentStartLine + index)
      : [],
  };
}

function parseFrontmatter(content: string): {
  frontmatterOrder: string[];
  frontmatterValues: Record<string, FrontmatterValue>;
  body: string;
} {
  const match = content.match(FRONTMATTER_PATTERN);
  if (!match) {
    throw new Error('Task file is missing frontmatter.');
  }

  const frontmatterLines = match[1].split('\n');
  const frontmatterValues: Record<string, FrontmatterValue> = {};
  const frontmatterOrder: string[] = [];

  for (const rawLine of frontmatterLines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    frontmatterOrder.push(key);
    frontmatterValues[key] = parseFrontmatterValue(value);
  }

  return {
    frontmatterOrder,
    frontmatterValues,
    body: content.slice(match[0].length),
  };
}

function parseFrontmatterValue(rawValue: string): FrontmatterValue {
  if (!rawValue) {
    return '';
  }

  if (rawValue === 'null') {
    return null;
  }

  if (/^\[.*\]$/.test(rawValue)) {
    const inner = rawValue.slice(1, -1).trim();
    if (!inner) {
      return [];
    }

    return inner
      .split(',')
      .map((part) => stripQuotes(part.trim()))
      .filter(Boolean);
  }

  if (rawValue === 'true') {
    return true;
  }

  if (rawValue === 'false') {
    return false;
  }

  if (/^-?\d+$/.test(rawValue)) {
    return Number(rawValue);
  }

  return stripQuotes(rawValue);
}

function parseSections(bodyLines: string[]): Map<string, TaskSectionRange> {
  const sections = new Map<string, TaskSectionRange>();
  let currentHeading: string | null = null;
  let currentStartLine = -1;
  let currentContentStartLine = -1;

  for (let index = 0; index < bodyLines.length; index += 1) {
    const line = bodyLines[index];
    const headingMatch = line.match(HEADING_PATTERN);
    if (!headingMatch) {
      continue;
    }

    if (currentHeading) {
      sections.set(currentHeading.toLowerCase(), {
        heading: currentHeading,
        startLine: currentStartLine,
        contentStartLine: currentContentStartLine,
        endLineExclusive: index,
        lines: bodyLines.slice(currentContentStartLine, index),
      });
    }

    currentHeading = headingMatch[1].trim();
    currentStartLine = index;
    currentContentStartLine = index + 1;
  }

  if (currentHeading) {
    sections.set(currentHeading.toLowerCase(), {
      heading: currentHeading,
      startLine: currentStartLine,
      contentStartLine: currentContentStartLine,
      endLineExclusive: bodyLines.length,
      lines: bodyLines.slice(currentContentStartLine),
    });
  }

  return sections;
}

function parseChecklist(lines: string[]): {
  checklist: ChecklistItem[];
  checklistLineIndexes: number[];
} {
  const checklist: ChecklistItem[] = [];
  const checklistLineIndexes: number[] = [];

  lines.forEach((line, index) => {
    const match = line.match(CHECKLIST_PATTERN);
    if (!match) {
      return;
    }

    checklist.push({
      index: checklist.length,
      checked: match[1].toLowerCase() === 'x',
      text: match[2].trim(),
    });
    checklistLineIndexes.push(index);
  });

  return { checklist, checklistLineIndexes };
}

function readRequiredString(value: FrontmatterValue, field: string, relativePath: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Task ${relativePath} is missing required field "${field}".`);
  }

  return value.trim();
}

function readOptionalString(value: FrontmatterValue | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function readOptionalNumber(value: FrontmatterValue | undefined): number | null {
  return typeof value === 'number' ? value : null;
}

function readStringArray(value: FrontmatterValue | undefined): string[] {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
}

function readTaskStatus(value: FrontmatterValue, relativePath: string): TaskStatus {
  if (typeof value !== 'string' || !TASK_STATUSES.includes(value as TaskStatus)) {
    throw new Error(`Task ${relativePath} has invalid status.`);
  }

  return value as TaskStatus;
}

function readTaskPriority(value: FrontmatterValue, relativePath: string): TaskPriority {
  if (typeof value !== 'string' || !TASK_PRIORITIES.includes(value as TaskPriority)) {
    throw new Error(`Task ${relativePath} has invalid priority.`);
  }

  return value as TaskPriority;
}

function readTaskWorkstream(value: FrontmatterValue | undefined): TaskWorkstream | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (typeof value !== 'string') {
    return null;
  }
  return TASK_WORKSTREAMS.includes(value as TaskWorkstream) ? (value as TaskWorkstream) : null;
}

function readTaskKind(value: FrontmatterValue | undefined): TaskKind {
  if (typeof value !== 'string' || !value.trim()) {
    return 'task';
  }
  return TASK_KINDS.includes(value as TaskKind) ? (value as TaskKind) : 'task';
}

function stripQuotes(input: string): string {
  if (input.startsWith('"') && input.endsWith('"')) {
    try {
      return JSON.parse(input) as string;
    } catch {
      return input.slice(1, -1);
    }
  }

  if (input.startsWith("'") && input.endsWith("'")) {
    const singleQuoted = input.slice(1, -1);
    return singleQuoted
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
  }

  return input;
}

function inferBucket(relativePath: string): TaskBucket {
  if (
    relativePath.includes(`${path.sep}archive${path.sep}`) ||
    relativePath.startsWith(`archive${path.sep}`) ||
    relativePath.includes('/archive/')
  ) {
    return 'archived';
  }

  return relativePath.includes(`${path.sep}done${path.sep}`) || relativePath.startsWith(`done${path.sep}`)
    ? 'done'
    : relativePath.includes('/done/')
      ? 'done'
      : 'open';
}

function deriveSummary(sections: Map<string, TaskSectionRange>): string {
  const desired = extractFirstParagraph(
    sections.get('gewenste uitkomst')?.lines ?? sections.get('probleem / context')?.lines ?? [],
  );
  return normalizeSummaryText(desired || 'Nog geen korte samenvatting.');
}

function extractFirstParagraph(lines: string[]): string {
  const collected: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (collected.length > 0) {
        break;
      }
      continue;
    }
    collected.push(trimmed);
  }

  return collected.join(' ').trim();
}

function buildExcerpt(summary: string): string {
  const compact = summary.replace(/\s+/g, ' ').trim();
  if (compact.length <= 180) {
    return compact;
  }

  return `${compact.slice(0, 177).trimEnd()}...`;
}

function normalizeSummaryText(input: string): string {
  const withDecodedEscapes = input
    .replace(/\r\n?/g, '\n')
    .replace(/\\{2,}n/g, '\n')
    .replace(/\\n/g, '\n');

  const normalizedLines = withDecodedEscapes
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return normalizedLines || 'Nog geen korte samenvatting.';
}
