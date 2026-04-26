import type { TaskCardViewModel } from './types';

export type ChecklistProgressTone = 'none' | 'band-0' | 'band-1' | 'band-2' | 'band-3' | 'band-4';

export function checklistProgressTone(completed: number, total: number): ChecklistProgressTone {
  if (total <= 0) {
    return 'none';
  }

  const percent = Math.round((completed / total) * 100);
  if (percent <= 20) {
    return 'band-0';
  }
  if (percent <= 40) {
    return 'band-1';
  }
  if (percent <= 60) {
    return 'band-2';
  }
  if (percent <= 80) {
    return 'band-3';
  }
  return 'band-4';
}

export function compactChecklistProgressLabel(completed: number, total: number): string {
  if (total <= 0) {
    return 'Geen checklist';
  }

  return `${completed}/${total}`;
}

export function formatLastChangeDate(updatedAt: string): string {
  const parsed = new Date(`${updatedAt}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return updatedAt;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

export function isTaskAgentActive(task: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus'>): boolean {
  if (!task.activeAgent) {
    return false;
  }

  const normalizedStatus = task.activeAgentStatus?.trim().toLowerCase();
  if (!normalizedStatus) {
    return true;
  }

  return ['active', 'running', 'busy', 'editing', 'working', 'in_progress'].includes(normalizedStatus);
}

export function activeAgentLabel(task: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus'>): string | null {
  if (!isTaskAgentActive(task)) {
    return null;
  }

  return task.activeAgent;
}

export function compareActiveAgentsFirst(
  left: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus'>,
  right: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus'>,
): number {
  const leftActive = isTaskAgentActive(left);
  const rightActive = isTaskAgentActive(right);

  if (leftActive === rightActive) {
    return 0;
  }

  return leftActive ? -1 : 1;
}