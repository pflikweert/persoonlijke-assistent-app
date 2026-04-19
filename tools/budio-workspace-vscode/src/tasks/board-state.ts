import { PRIORITY_LABELS, STATUS_LABELS } from './constants';
import type {
  BoardColumn,
  BoardSnapshot,
  ParsedTaskFile,
  TaskCardViewModel,
  TaskPriority,
  TaskSort,
  TaskStatus,
  WorkspaceSettings,
} from './types';

export function buildBoardSnapshot(input: {
  tasks: ParsedTaskFile[];
  settings: WorkspaceSettings;
  workspaceName: string;
  workspacePath: string;
}): BoardSnapshot {
  const visibleStatuses = input.settings.showDoneColumn
    ? input.settings.columns
    : input.settings.columns.filter((status) => status !== 'done');

  const allCards = input.tasks.map(toTaskCardViewModel);
  const columns = visibleStatuses.map((status) =>
    buildColumn(status, allCards.filter((card) => card.status === status), input.settings.defaultSort),
  );

  return {
    workspaceName: input.workspaceName,
    workspacePath: input.workspacePath,
    tasksRoot: input.settings.tasksRoot,
    generatedAt: new Date().toISOString(),
    sort: input.settings.defaultSort,
    columns,
    allCards: sortCards(allCards, input.settings.defaultSort),
    totalTasks: allCards.length,
    openTaskCount: allCards.filter((card) => card.status !== 'done').length,
    doneTaskCount: allCards.filter((card) => card.status === 'done').length,
    settings: input.settings,
  };
}

export function toTaskCardViewModel(task: ParsedTaskFile): TaskCardViewModel {
  const completed = task.checklist.filter((item) => item.checked).length;
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    phase: task.phase,
    priority: task.priority,
    tags: task.tags,
    dueDate: task.dueDate,
    checklistProgress: {
      completed,
      total: task.checklist.length,
      open: task.checklist.length - completed,
    },
    summary: task.summary,
    excerpt: task.excerpt,
    sortOrder: task.sortOrder,
    checklist: task.checklist,
    sourcePath: task.sourcePath,
    relativePath: task.relativePath,
    folder: task.folder,
    bucket: task.bucket,
    updatedAt: task.updatedAt,
    lastModified: task.lastModified,
    hasBody: task.hasBody,
    bodyPreview: task.body.trim().slice(0, 600),
    source: task.source,
    version: task.version,
  };
}

function buildColumn(status: TaskStatus, cards: TaskCardViewModel[], sort: TaskSort): BoardColumn {
  return {
    key: status,
    label: STATUS_LABELS[status],
    count: cards.length,
    cards: sortCards(cards, sort),
  };
}

export function sortCards(cards: TaskCardViewModel[], sort: TaskSort): TaskCardViewModel[] {
  return [...cards].sort((left, right) => compareCards(left, right, sort));
}

function compareCards(left: TaskCardViewModel, right: TaskCardViewModel, sort: TaskSort): number {
  if (sort === 'due_date') {
    return compareDueDate(left.dueDate, right.dueDate) || comparePriority(left.priority, right.priority);
  }

  if (sort === 'priority') {
    return comparePriority(left.priority, right.priority) || compareDueDate(left.dueDate, right.dueDate);
  }

  if (sort === 'updated_at') {
    return right.updatedAt.localeCompare(left.updatedAt);
  }

  if (sort === 'alphabetical') {
    return left.title.localeCompare(right.title);
  }

  return compareManual(left, right);
}

function compareManual(left: TaskCardViewModel, right: TaskCardViewModel): number {
  const leftOrder = left.sortOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.sortOrder ?? Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return right.updatedAt.localeCompare(left.updatedAt);
}

function comparePriority(left: TaskPriority, right: TaskPriority): number {
  return priorityValue(left) - priorityValue(right);
}

function compareDueDate(left: string | null, right: string | null): number {
  if (left && right) {
    return left.localeCompare(right);
  }

  if (left) {
    return -1;
  }

  if (right) {
    return 1;
  }

  return 0;
}

function priorityValue(priority: TaskPriority): number {
  return priority === 'p1' ? 1 : priority === 'p2' ? 2 : 3;
}

export function describePriority(priority: TaskPriority): string {
  return PRIORITY_LABELS[priority];
}
