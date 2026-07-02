import type { TaskCardViewModel } from './types';

export type ChecklistProgressTone = 'none' | 'band-0' | 'band-1' | 'band-2' | 'band-3' | 'band-4';
export type ActiveAgentTone = 'active' | 'inactive';

const ACTIVE_AGENT_STALE_MS = 24 * 60 * 60 * 1000;
const ACTIVE_AGENT_STATUS_VALUES = ['active', 'running', 'busy', 'editing', 'working', 'in_progress'];

type ActiveAgentTask = Pick<
  TaskCardViewModel,
  'activeAgent' | 'activeAgentModel' | 'activeAgentRuntime' | 'activeAgentSince' | 'activeAgentStatus'
>;

export interface ActiveAgentUiState {
  isActive: boolean;
  label: string | null;
  chipLabel: string | null;
  runtimeLabel: string | null;
  sinceLabel: string | null;
  statusTone: ActiveAgentTone;
}

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

export function formatActiveAgentSince(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return `sinds ${new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsed)}`;
}

function isActiveAgentClaimFresh(value: string | null, now = new Date()): boolean {
  if (!value) {
    return false;
  }

  const parsed = new Date(value).getTime();
  if (Number.isNaN(parsed)) {
    return false;
  }

  return now.getTime() - parsed <= ACTIVE_AGENT_STALE_MS;
}

export function isTaskAgentActive(
  task: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus' | 'activeAgentSince'>,
  now = new Date(),
): boolean {
  if (!task.activeAgent) {
    return false;
  }

  const normalizedStatus = task.activeAgentStatus?.trim().toLowerCase();
  if (!normalizedStatus) {
    return false;
  }

  return ACTIVE_AGENT_STATUS_VALUES.includes(normalizedStatus) && isActiveAgentClaimFresh(task.activeAgentSince, now);
}

export function activeAgentLabel(
  task: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus' | 'activeAgentSince'>,
  now = new Date(),
): string | null {
  if (!isTaskAgentActive(task, now)) {
    return null;
  }

  return task.activeAgent;
}

export function activeAgentUiState(task: ActiveAgentTask, now = new Date()): ActiveAgentUiState {
  const label = activeAgentLabel(task, now);
  if (!label) {
    return {
      isActive: false,
      label: null,
      chipLabel: null,
      runtimeLabel: null,
      sinceLabel: null,
      statusTone: 'inactive',
    };
  }

  const runtimeParts = [task.activeAgentRuntime, task.activeAgentModel]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return {
    isActive: true,
    label,
    chipLabel: `${label} actief`,
    runtimeLabel: runtimeParts.length > 0 ? runtimeParts.join(' · ') : null,
    sinceLabel: formatActiveAgentSince(task.activeAgentSince),
    statusTone: 'active',
  };
}

export function compareActiveAgentsFirst(
  left: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus' | 'activeAgentSince'>,
  right: Pick<TaskCardViewModel, 'activeAgent' | 'activeAgentStatus' | 'activeAgentSince'>,
  now = new Date(),
): number {
  const leftActive = isTaskAgentActive(left, now);
  const rightActive = isTaskAgentActive(right, now);

  if (leftActive === rightActive) {
    return 0;
  }

  return leftActive ? -1 : 1;
}
