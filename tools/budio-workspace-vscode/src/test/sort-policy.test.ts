import test from 'node:test';
import assert from 'node:assert/strict';
import { sortTaskCards } from '../tasks/sort-policy';
import type { TaskCardViewModel } from '../tasks/types';

function card(overrides: Partial<TaskCardViewModel>): TaskCardViewModel {
  const {
    workstream = null,
    epicId = null,
    parentTaskId = null,
    dependsOn = [],
    followsAfter = [],
    taskKind = 'task',
    subtaskIds = [],
    blockedByIds = [],
    blockingIds = [],
    isBlocked = false,
    isReadyToStart = true,
    ...restOverrides
  } = overrides;
  return {
    id: 'task-default',
    title: 'Default',
    status: 'ready',
    phase: 'phase',
    priority: 'p2',
    tags: [],
    workstream,
    epicId,
    parentTaskId,
    dependsOn,
    followsAfter,
    taskKind,
    subtaskIds,
    blockedByIds,
    blockingIds,
    isBlocked,
    isReadyToStart,
    dueDate: null,
    checklistProgress: {
      completed: 0,
      total: 0,
      open: 0,
    },
    summary: 'Summary',
    excerpt: 'Summary',
    sortOrder: null,
    checklist: [],
    sourcePath: '/workspace/docs/project/25-tasks/open/default.md',
    relativePath: 'docs/project/25-tasks/open/default.md',
    folder: 'docs/project/25-tasks/open',
    bucket: 'open',
    updatedAt: '2026-04-20',
    lastModified: '2026-04-20T00:00:00.000Z',
    hasBody: true,
    bodyPreview: 'Preview',
    source: 'docs/project/open-points.md',
    version: { mtimeMs: 1, hash: 'hash' },
    activeAgent: null,
    activeAgentModel: null,
    activeAgentRuntime: null,
    activeAgentSince: null,
    activeAgentStatus: null,
    activeAgentSettings: null,
    ...restOverrides,
  };
}

test('sortTaskCards applies lane/status ordering before manual ordering', () => {
  const cards = [
    card({ id: 'done-1', status: 'done', sortOrder: 1 }),
    card({ id: 'review-1', status: 'review', sortOrder: 1 }),
    card({ id: 'ready-2', status: 'ready', sortOrder: 2 }),
    card({ id: 'ready-1', status: 'ready', sortOrder: 1 }),
    card({ id: 'backlog-1', status: 'backlog', sortOrder: 1 }),
  ];

  const laneSorted = sortTaskCards(cards, 'lane_order').map((item) => item.id);
  const statusSorted = sortTaskCards(cards, 'status').map((item) => item.id);

  assert.deepEqual(laneSorted, ['backlog-1', 'ready-1', 'ready-2', 'review-1', 'done-1']);
  assert.deepEqual(statusSorted, laneSorted);
});

test('sortTaskCards supports due, priority, progress, updated and alphabetical modes', () => {
  const cards = [
    card({ id: 'a', title: 'Zeta', dueDate: null, priority: 'p3', updatedAt: '2026-04-21', checklistProgress: { completed: 0, total: 0, open: 0 } }),
    card({ id: 'b', title: 'Alpha', dueDate: '2026-04-24', priority: 'p2', updatedAt: '2026-04-20', checklistProgress: { completed: 1, total: 2, open: 1 } }),
    card({ id: 'c', title: 'Beta', dueDate: '2026-04-23', priority: 'p1', updatedAt: '2026-04-22', checklistProgress: { completed: 3, total: 3, open: 0 } }),
  ];

  assert.deepEqual(sortTaskCards(cards, 'due_date').map((item) => item.id), ['c', 'b', 'a']);
  assert.deepEqual(sortTaskCards(cards, 'priority').map((item) => item.id), ['c', 'b', 'a']);
  assert.deepEqual(sortTaskCards(cards, 'progress').map((item) => item.id), ['c', 'b', 'a']);
  assert.deepEqual(sortTaskCards(cards, 'updated_at').map((item) => item.id), ['c', 'a', 'b']);
  assert.deepEqual(sortTaskCards(cards, 'alphabetical').map((item) => item.id), ['b', 'c', 'a']);
});

test('sortTaskCards promotes active-agent tasks to the top while preserving other sort behavior', () => {
  const cards = [
    card({ id: 'inactive-1', title: 'A', status: 'ready', sortOrder: 1 }),
    card({ id: 'active-1', title: 'Z', status: 'ready', sortOrder: 3, activeAgent: 'Cline', activeAgentStatus: 'running' }),
    card({ id: 'inactive-2', title: 'B', status: 'backlog', sortOrder: 1 }),
  ];

  assert.deepEqual(sortTaskCards(cards, 'manual').map((item) => item.id), ['active-1', 'inactive-1', 'inactive-2']);
  assert.deepEqual(sortTaskCards(cards, 'lane_order').map((item) => item.id), ['active-1', 'inactive-2', 'inactive-1']);
});
