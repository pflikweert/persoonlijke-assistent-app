import { createHash } from 'node:crypto';
import path from 'node:path';
import { TASK_PRIORITIES, TASK_STATUSES } from './constants';
import type {
  FileVersion,
  FrontmatterValue,
  ParsedEpicFile,
  TaskPriority,
  TaskStatus,
} from './types';

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;
const H1_PATTERN = /^# (.+)$/m;

export function parseEpicFile(input: {
  absolutePath: string;
  relativePath: string;
  content: string;
  version: FileVersion;
}): ParsedEpicFile {
  const content = normalizeLineEndings(input.content);
  const { frontmatterOrder, frontmatterValues, body } = parseFrontmatter(content);
  const headingTitle = body.match(H1_PATTERN)?.[1]?.trim() ?? '';
  const title = readRequiredString(frontmatterValues.title, 'title', input.relativePath) || headingTitle;

  return {
    id: readRequiredString(frontmatterValues.id, 'id', input.relativePath),
    title,
    status: readTaskStatus(frontmatterValues.status, input.relativePath),
    priority: readTaskPriority(frontmatterValues.priority, input.relativePath),
    owner: readOptionalString(frontmatterValues.owner),
    phase: readRequiredString(frontmatterValues.phase, 'phase', input.relativePath),
    updatedAt: readRequiredString(frontmatterValues.updated_at, 'updated_at', input.relativePath),
    summary: readOptionalString(frontmatterValues.summary) ?? '',
    sortOrder: readOptionalNumber(frontmatterValues.sort_order),
    sourcePath: input.absolutePath,
    relativePath: input.relativePath,
    body,
    raw: content,
    version: input.version,
    frontmatterValues,
    frontmatterOrder,
  };
}

function normalizeLineEndings(input: string): string {
  return input.replace(/\r\n?/g, '\n');
}

function parseFrontmatter(content: string): {
  frontmatterOrder: string[];
  frontmatterValues: Record<string, FrontmatterValue>;
  body: string;
} {
  const match = content.match(FRONTMATTER_PATTERN);
  if (!match) {
    throw new Error('Epic file is missing frontmatter.');
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

function stripQuotes(input: string): string {
  if (input.startsWith('"') && input.endsWith('"')) {
    try {
      return JSON.parse(input) as string;
    } catch {
      return input.slice(1, -1);
    }
  }
  if (input.startsWith("'") && input.endsWith("'")) {
    return input.slice(1, -1);
  }
  return input;
}

function readRequiredString(value: FrontmatterValue, field: string, relativePath: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Epic ${relativePath} is missing required field "${field}".`);
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

function readTaskStatus(value: FrontmatterValue, relativePath: string): TaskStatus {
  if (typeof value !== 'string' || !TASK_STATUSES.includes(value as TaskStatus)) {
    throw new Error(`Epic ${relativePath} has invalid status.`);
  }

  return value as TaskStatus;
}

function readTaskPriority(value: FrontmatterValue, relativePath: string): TaskPriority {
  if (typeof value !== 'string' || !TASK_PRIORITIES.includes(value as TaskPriority)) {
    throw new Error(`Epic ${relativePath} has invalid priority.`);
  }

  return value as TaskPriority;
}
