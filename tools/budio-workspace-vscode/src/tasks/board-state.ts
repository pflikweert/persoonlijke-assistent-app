import { PRIORITY_LABELS, STATUS_LABELS } from './constants';
import { sortTaskCards } from './sort-policy';
import type {
  BoardColumn,
  BoardSnapshot,
  EpicViewModel,
  ParsedEpicFile,
  ParsedTaskFile,
  TaskCardViewModel,
  TaskPriority,
  TaskSort,
  TaskStatus,
  WorkspaceSettings,
} from './types';

export function buildBoardSnapshot(input: {
  tasks: ParsedTaskFile[];
  epics: ParsedEpicFile[];
  settings: WorkspaceSettings;
  workspaceName: string;
  workspacePath: string;
}): BoardSnapshot {
  const visibleStatuses = input.settings.showDoneColumn
    ? input.settings.columns
    : input.settings.columns.filter((status) => status !== 'done');

  const relationState = buildRelationState(input.tasks);
  const allCards = relationState.cards;
  const columns = visibleStatuses.map((status) =>
    buildColumn(status, allCards.filter((card) => card.status === status), input.settings.defaultSort),
  );
  const epics = buildEpicViewModels(input.epics, allCards);

  return {
    workspaceName: input.workspaceName,
    workspacePath: input.workspacePath,
    tasksRoot: input.settings.tasksRoot,
    epicsRoot: input.settings.epicsRoot,
    generatedAt: new Date().toISOString(),
    sort: input.settings.defaultSort,
    columns,
    allCards: sortCards(allCards, input.settings.defaultSort),
    epics,
    totalTasks: allCards.length,
    openTaskCount: allCards.filter((card) => card.status !== 'done').length,
    doneTaskCount: allCards.filter((card) => card.status === 'done').length,
    settings: input.settings,
  };
}

function buildRelationState(tasks: ParsedTaskFile[]): { cards: TaskCardViewModel[] } {
  const baseCards = tasks
    .filter((task) => task.bucket !== 'archived')
    .map(toTaskCardViewModelBase);
  const baseMap = new Map(baseCards.map((card) => [card.id, card]));
  const subtaskIdsByParent = new Map<string, string[]>();
  const blockingIdsByTask = new Map<string, string[]>();

  for (const card of baseCards) {
    if (card.parentTaskId && baseMap.has(card.parentTaskId)) {
      const list = subtaskIdsByParent.get(card.parentTaskId) ?? [];
      list.push(card.id);
      subtaskIdsByParent.set(card.parentTaskId, list);
    }

    for (const dependencyId of card.dependsOn) {
      if (!baseMap.has(dependencyId)) {
        continue;
      }
      const list = blockingIdsByTask.get(dependencyId) ?? [];
      list.push(card.id);
      blockingIdsByTask.set(dependencyId, list);
    }
  }

  const cards = baseCards.map((card) => {
    const blockedByIds = card.dependsOn.filter((dependencyId) => baseMap.has(dependencyId));
    const unresolvedBlockedByIds = blockedByIds.filter((dependencyId) => baseMap.get(dependencyId)?.status !== 'done');
    return {
      ...card,
      subtaskIds: sortIdsByLaneOrder(subtaskIdsByParent.get(card.id) ?? [], baseMap),
      blockedByIds,
      blockingIds: sortIdsByLaneOrder(blockingIdsByTask.get(card.id) ?? [], baseMap),
      isBlocked: unresolvedBlockedByIds.length > 0,
      isReadyToStart:
        card.status === 'ready' &&
        unresolvedBlockedByIds.length === 0 &&
        (card.parentTaskId ? baseMap.has(card.parentTaskId) : true),
    };
  });

  return { cards };
}

function buildEpicViewModels(epics: ParsedEpicFile[], allCards: TaskCardViewModel[]): EpicViewModel[] {
  const cardsByEpic = new Map<string, TaskCardViewModel[]>();

  for (const card of allCards) {
    if (!card.epicId) {
      continue;
    }
    const list = cardsByEpic.get(card.epicId) ?? [];
    list.push(card);
    cardsByEpic.set(card.epicId, list);
  }

  return epics
    .map((epic) => {
      const linkedCards = sortTaskCards(cardsByEpic.get(epic.id) ?? [], 'manual');
      const directCards = linkedCards.filter((card) => !card.parentTaskId);
      const subtaskCards = linkedCards.filter((card) => card.parentTaskId);
      const blockedCards = linkedCards.filter((card) => card.isBlocked);
      const readyCards = linkedCards.filter((card) => card.isReadyToStart);

      return {
        id: epic.id,
        title: epic.title,
        status: epic.status,
        priority: epic.priority,
        owner: epic.owner,
        phase: epic.phase,
        updatedAt: epic.updatedAt,
        summary: epic.summary,
        sortOrder: epic.sortOrder,
        relativePath: epic.relativePath,
        linkedTaskIds: linkedCards.map((card) => card.id),
        directTaskIds: directCards.map((card) => card.id),
        subtaskIds: subtaskCards.map((card) => card.id),
        blockedTaskIds: blockedCards.map((card) => card.id),
        readyTaskIds: readyCards.map((card) => card.id),
        doneTaskCount: linkedCards.filter((card) => card.status === 'done').length,
        openTaskCount: linkedCards.filter((card) => card.status !== 'done').length,
      };
    })
    .sort((left, right) => compareManualOrder(left.sortOrder, right.sortOrder) || left.title.localeCompare(right.title));
}

function toTaskCardViewModelBase(task: ParsedTaskFile): TaskCardViewModel {
  const completed = task.checklist.filter((item) => item.checked).length;
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    phase: task.phase,
    priority: task.priority,
    tags: task.tags,
    workstream: task.workstream,
    epicId: task.epicId,
    parentTaskId: task.parentTaskId,
    dependsOn: task.dependsOn,
    followsAfter: task.followsAfter,
    taskKind: task.taskKind,
    subtaskIds: [],
    blockedByIds: [],
    blockingIds: [],
    isBlocked: false,
    isReadyToStart: false,
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
    activeAgent: task.activeAgent,
    activeAgentModel: task.activeAgentModel,
    activeAgentRuntime: task.activeAgentRuntime,
    activeAgentSince: task.activeAgentSince,
    activeAgentStatus: task.activeAgentStatus,
    activeAgentSettings: task.activeAgentSettings,
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

function sortIdsByLaneOrder(ids: string[], cardsById: Map<string, TaskCardViewModel>): string[] {
  return [...ids].sort((leftId, rightId) => {
    const left = cardsById.get(leftId);
    const right = cardsById.get(rightId);
    if (!left || !right) {
      return leftId.localeCompare(rightId);
    }
    return compareManualOrder(left.sortOrder, right.sortOrder) || left.title.localeCompare(right.title);
  });
}

function compareManualOrder(left: number | null, right: number | null): number {
  return (left ?? Number.MAX_SAFE_INTEGER) - (right ?? Number.MAX_SAFE_INTEGER);
}

export function sortCards(cards: TaskCardViewModel[], sort: TaskSort): TaskCardViewModel[] {
  return sortTaskCards(cards, sort);
}

export function describePriority(priority: TaskPriority): string {
  return PRIORITY_LABELS[priority];
}
