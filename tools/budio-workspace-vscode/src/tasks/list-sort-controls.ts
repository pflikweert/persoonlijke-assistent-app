import type { TaskCardViewModel, TaskSort } from './types';

export type SortDirection = 'asc' | 'desc';
export type ListSortColumn = 'title' | 'status' | 'priority' | 'due' | 'checklist';

export interface SortState {
  sort: TaskSort;
  direction: SortDirection;
}

const COLUMN_TO_SORT: Record<ListSortColumn, TaskSort> = {
  title: 'alphabetical',
  status: 'status',
  priority: 'priority',
  due: 'due_date',
  checklist: 'progress',
};

const SORT_LABELS: Record<TaskSort, string> = {
  manual: 'Manual',
  lane_order: 'Lane-volgorde',
  status: 'Status',
  due_date: 'Due date',
  priority: 'Priority',
  progress: 'Checklist',
  updated_at: 'Recent gewijzigd',
  alphabetical: 'Alfabetisch',
};

export function mapColumnToSort(column: ListSortColumn): TaskSort {
  return COLUMN_TO_SORT[column];
}

export function nextSortStateFromHeader(current: SortState, column: ListSortColumn): SortState {
  const nextSort = mapColumnToSort(column);
  if (current.sort === nextSort) {
    return {
      sort: nextSort,
      direction: current.direction === 'asc' ? 'desc' : 'asc',
    };
  }

  return {
    sort: nextSort,
    direction: 'asc',
  };
}

export function describeSortState(state: SortState): string {
  return `${SORT_LABELS[state.sort]} (${state.direction === 'asc' ? 'oplopend' : 'aflopend'})`;
}

export function applySortDirection(cards: readonly TaskCardViewModel[], direction: SortDirection): TaskCardViewModel[] {
  if (direction === 'asc') {
    return [...cards];
  }

  return [...cards].reverse();
}

export function directionArrow(direction: SortDirection): string {
  return direction === 'asc' ? '↑' : '↓';
}

export function isColumnActive(sort: TaskSort, column: ListSortColumn): boolean {
  return mapColumnToSort(column) === sort;
}
