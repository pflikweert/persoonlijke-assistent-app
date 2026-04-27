import path from 'node:path';
import {
  CONCRETE_CHECKLIST_HEADING,
  PLUGIN_OWNED_FRONTMATTER_FIELDS,
  TASK_OPTIONAL_FIELDS,
  TASK_REQUIRED_FIELDS,
} from './constants';
import type {
  CreateTaskInput,
  FrontmatterValue,
  ParsedTaskFile,
  TaskFieldPatch,
  TaskStatus,
} from './types';

const H1_PATTERN = /^# /;
const CHECKLIST_PATTERN = /^- \[( |x|X)\] /;

const SECTION_PLACEHOLDER_BY_HEADING: Record<string, string> = {
  'Agent activity': '- Geen actieve agent.',
  Commits: '- Nog geen commit-registraties.',
};

export function applyTaskFieldPatch(task: ParsedTaskFile, patch: TaskFieldPatch): string {
  const nextFrontmatter = {
    ...task.frontmatterValues,
  };

  if (patch.title !== undefined) {
    nextFrontmatter.title = patch.title.trim();
  }
  if (patch.status !== undefined) {
    nextFrontmatter.status = patch.status;
  }
  if (patch.priority !== undefined) {
    nextFrontmatter.priority = patch.priority;
  }
  if (patch.summary !== undefined) {
    nextFrontmatter.summary = patch.summary.trim();
  }
  if (patch.tags !== undefined) {
    nextFrontmatter.tags = patch.tags;
  }
  if (patch.workstream !== undefined) {
    nextFrontmatter.workstream = patch.workstream;
  }
  if (patch.epicId !== undefined) {
    nextFrontmatter.epic_id = patch.epicId;
  }
  if (patch.parentTaskId !== undefined) {
    nextFrontmatter.parent_task_id = patch.parentTaskId;
  }
  if (patch.dependsOn !== undefined) {
    nextFrontmatter.depends_on = patch.dependsOn;
  }
  if (patch.followsAfter !== undefined) {
    nextFrontmatter.follows_after = patch.followsAfter;
  }
  if (patch.taskKind !== undefined) {
    nextFrontmatter.task_kind = patch.taskKind;
  }
  if (patch.dueDate !== undefined) {
    nextFrontmatter.due_date = patch.dueDate;
  }
  if (patch.sortOrder !== undefined) {
    nextFrontmatter.sort_order = patch.sortOrder;
  }
  if (patch.updatedAt !== undefined) {
    nextFrontmatter.updated_at = patch.updatedAt;
  }
  if (patch.activeAgent !== undefined) {
    nextFrontmatter.active_agent = patch.activeAgent;
  }
  if (patch.activeAgentModel !== undefined) {
    nextFrontmatter.active_agent_model = patch.activeAgentModel;
  }
  if (patch.activeAgentRuntime !== undefined) {
    nextFrontmatter.active_agent_runtime = patch.activeAgentRuntime;
  }
  if (patch.activeAgentSince !== undefined) {
    nextFrontmatter.active_agent_since = patch.activeAgentSince;
  }
  if (patch.activeAgentStatus !== undefined) {
    nextFrontmatter.active_agent_status = patch.activeAgentStatus;
  }
  if (patch.activeAgentSettings !== undefined) {
    nextFrontmatter.active_agent_settings = patch.activeAgentSettings;
  }

  const nextBodyLines = [...task.bodyLines];
  if (patch.title !== undefined) {
    if (task.firstHeadingLineIndex !== null) {
      nextBodyLines[task.firstHeadingLineIndex] = `# ${patch.title.trim()}`;
    } else {
      const withoutLeadingBlanks = stripLeadingBlankLines(nextBodyLines);
      nextBodyLines.splice(0, nextBodyLines.length, `# ${patch.title.trim()}`, '', ...withoutLeadingBlanks);
    }
  }

  return `${serializeFrontmatter(nextFrontmatter, task.frontmatterOrder)}${nextBodyLines.join('\n')}`;
}

export function applyChecklistToggle(
  task: ParsedTaskFile,
  checklistIndex: number,
  checked: boolean,
): string {
  const nextBodyLines = [...task.bodyLines];
  const absoluteLineIndex = task.checklistLineIndexes[checklistIndex];
  if (absoluteLineIndex === undefined) {
    throw new Error(`Checklist item ${checklistIndex} does not exist in task ${task.id}.`);
  }

  const line = nextBodyLines[absoluteLineIndex];
  if (!CHECKLIST_PATTERN.test(line)) {
    throw new Error(`Checklist line ${checklistIndex} is no longer a checkbox in task ${task.id}.`);
  }

  nextBodyLines[absoluteLineIndex] = line.replace(
    CHECKLIST_PATTERN,
    checked ? '- [x] ' : '- [ ] ',
  );

  return `${serializeFrontmatter(task.frontmatterValues, task.frontmatterOrder)}${nextBodyLines.join('\n')}`;
}

export function buildNewTaskContent(input: CreateTaskInput & { id: string; updatedAt: string }): string {
  const frontmatterOrder = [...TASK_REQUIRED_FIELDS, ...TASK_OPTIONAL_FIELDS];
  const frontmatter = {
    id: input.id,
    title: input.title.trim(),
    status: input.status,
    phase: input.phase ?? 'transitiemaand-consumer-beta',
    priority: input.priority ?? 'p2',
    source: input.source ?? 'docs/project/open-points.md',
    updated_at: input.updatedAt,
    summary: input.summary?.trim() ?? '',
    tags: input.tags ?? [],
    workstream: input.workstream ?? 'app',
    epic_id: input.epicId ?? null,
    parent_task_id: input.parentTaskId ?? null,
    depends_on: input.dependsOn ?? [],
    follows_after: input.followsAfter ?? [],
    task_kind: input.taskKind ?? 'task',
    due_date: input.dueDate ?? null,
    sort_order: input.sortOrder ?? null,
    active_agent: null,
    active_agent_model: null,
    active_agent_runtime: null,
    active_agent_since: null,
    active_agent_status: null,
    active_agent_settings: null,
  };

  return `${serializeFrontmatter(frontmatter, frontmatterOrder)}# ${input.title.trim()}

## Probleem / context

Beschrijf kort welk concreet gat, risico of uitvoeringsprobleem deze taak oplost.

## Gewenste uitkomst

Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is.

## Waarom nu

- Waarom deze taak nu relevant is voor de actieve fase.

## In scope

- Concreet werk dat binnen deze taak valt.

## Buiten scope

- Werk dat bewust niet in deze taak zit.

## ${CONCRETE_CHECKLIST_HEADING}

- [ ] Eerste concrete stap
- [ ] Tweede concrete stap

## Blockers / afhankelijkheden

- Geen of nog te bepalen.

## Verify / bewijs

- Noem hier de relevante verify-, runtime- of doc-bewijzen.

## Relevante links

- \`docs/project/open-points.md\`

## Agent activity

- Geen actieve agent.

## Commits

- Nog geen commit-registraties.
`;
}

export function buildTargetPathForStatus(
  currentPath: string,
  workspaceRoot: string,
  tasksRootRelative: string,
  targetStatus: TaskStatus,
): string {
  const relativePath = path.relative(workspaceRoot, currentPath);
  const fileName = path.basename(currentPath);
  const targetFolder = targetStatus === 'done' ? 'done' : 'open';
  return path.resolve(workspaceRoot, tasksRootRelative, targetFolder, fileName);
}

export function appendSectionListEntry(task: ParsedTaskFile, heading: string, entry: string): string {
  const nextBodyLines = [...task.bodyLines];
  const normalizedHeading = heading.toLowerCase();
  const section = task.sections.get(normalizedHeading);
  const placeholder = SECTION_PLACEHOLDER_BY_HEADING[heading];

  if (section) {
    const insertIndex = section.endLineExclusive;
    const sectionLines = section.lines;
    const hasPlaceholder = placeholder ? sectionLines.some((line) => line.trim() === placeholder) : false;

    if (hasPlaceholder) {
      const placeholderLineIndex = nextBodyLines.findIndex(
        (line, index) => index >= section.contentStartLine && index < section.endLineExclusive && line.trim() === placeholder,
      );
      if (placeholderLineIndex >= 0) {
        nextBodyLines.splice(placeholderLineIndex, 1, entry);
      }
    } else {
      const needsLeadingBlank = insertIndex > 0 && nextBodyLines[insertIndex - 1]?.trim() !== '';
      const linesToInsert = needsLeadingBlank ? ['', entry] : [entry];
      nextBodyLines.splice(insertIndex, 0, ...linesToInsert);
    }

    return `${serializeFrontmatter(task.frontmatterValues, task.frontmatterOrder)}${nextBodyLines.join('\n')}`;
  }

  const suffix = nextBodyLines.length > 0 && nextBodyLines[nextBodyLines.length - 1]?.trim() !== '' ? ['', ''] : [''];
  nextBodyLines.push(...suffix, `## ${heading}`, '', entry);
  return `${serializeFrontmatter(task.frontmatterValues, task.frontmatterOrder)}${nextBodyLines.join('\n')}`;
}

function serializeFrontmatter(
  frontmatterValues: Record<string, FrontmatterValue>,
  frontmatterOrder: string[],
): string {
  const orderedKeys = [
    ...frontmatterOrder,
    ...TASK_REQUIRED_FIELDS,
    ...TASK_OPTIONAL_FIELDS,
    ...PLUGIN_OWNED_FRONTMATTER_FIELDS,
  ].filter((key, index, array) => array.indexOf(key) === index);

  const lines = orderedKeys
    .filter((key) => Object.prototype.hasOwnProperty.call(frontmatterValues, key))
    .filter((key) => shouldEmitFrontmatterValue(frontmatterValues[key]))
    .map((key) => `${key}: ${serializeFrontmatterValue(frontmatterValues[key])}`);

  return `---\n${lines.join('\n')}\n---\n\n`;
}

function shouldEmitFrontmatterValue(value: FrontmatterValue | undefined): boolean {
  if (value === undefined) {
    return false;
  }

  if (value === null) {
    return true;
  }

  if (Array.isArray(value)) {
    return true;
  }

  return true;
}

function serializeFrontmatterValue(value: FrontmatterValue): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => quoteIfNeeded(item)).join(', ')}]`;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return quoteIfNeeded(value);
}

function quoteIfNeeded(input: string): string {
  if (input === '') {
    return '""';
  }

  if (/[:#[\],'"\\]/.test(input) || /^\s|\s$/.test(input)) {
    return JSON.stringify(input);
  }

  return input;
}

function stripLeadingBlankLines(lines: string[]): string[] {
  const next = [...lines];
  while (next.length > 0 && next[0].trim() === '') {
    next.shift();
  }
  return next;
}
