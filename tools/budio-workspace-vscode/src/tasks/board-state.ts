import { PRIORITY_LABELS, STATUS_LABELS } from './constants';
import { sortTaskCards } from './sort-policy';
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

  const allCards = input.tasks
    .filter((task) => task.bucket !== 'archived')
    .map(toTaskCardViewModel);
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
    workstream: task.workstream,
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
  return sortTaskCards(cards, sort);
}

export function describePriority(priority: TaskPriority): string {
  return PRIORITY_LABELS[priority];
}
