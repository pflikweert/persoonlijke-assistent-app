import type { TaskCardViewModel, TaskPriority, TaskSort, TaskStatus } from './types';

export const WORK_ORDER_SORTS = ['manual', 'lane_order'] as const;

export function isWorkOrderSort(sort: TaskSort): boolean {
  return sort === 'manual' || sort === 'lane_order';
}

export function sortTaskCards(cards: readonly TaskCardViewModel[], sort: TaskSort): TaskCardViewModel[] {
  return [...cards].sort((left, right) => compareCards(left, right, sort));
}

function compareCards(left: TaskCardViewModel, right: TaskCardViewModel, sort: TaskSort): number {
  if (sort === 'lane_order' || sort === 'status') {
    return compareStatus(left.status, right.status) || compareManual(left, right);
  }

  if (sort === 'due_date') {
    return compareDueDate(left.dueDate, right.dueDate) || comparePriority(left.priority, right.priority);
  }

  if (sort === 'priority') {
    return comparePriority(left.priority, right.priority) || compareDueDate(left.dueDate, right.dueDate);
  }

  if (sort === 'progress') {
    return compareProgress(left, right) || comparePriority(left.priority, right.priority);
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

function compareProgress(left: TaskCardViewModel, right: TaskCardViewModel): number {
  const leftPercent = checklistPercent(left);
  const rightPercent = checklistPercent(right);
  if (leftPercent !== rightPercent) {
    return rightPercent - leftPercent;
  }

  return right.checklistProgress.total - left.checklistProgress.total;
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

function checklistPercent(card: TaskCardViewModel): number {
  if (card.checklistProgress.total <= 0) {
    return -1;
  }

  return Math.round((card.checklistProgress.completed / card.checklistProgress.total) * 100);
}

function compareStatus(left: TaskStatus, right: TaskStatus): number {
  return statusRank(left) - statusRank(right);
}

function statusRank(status: TaskStatus): number {
  return status === 'backlog'
    ? 1
    : status === 'ready'
      ? 2
      : status === 'in_progress'
        ? 3
        : status === 'review'
          ? 4
          : status === 'blocked'
            ? 5
            : 6;
}
