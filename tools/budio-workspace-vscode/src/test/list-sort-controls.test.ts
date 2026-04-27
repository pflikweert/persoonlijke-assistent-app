import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applySortDirection,
  describeSortState,
  directionArrow,
  isColumnActive,
  mapColumnToSort,
  nextSortStateFromHeader,
} from '../tasks/list-sort-controls';
import type { TaskCardViewModel } from '../tasks/types';

function card(id: string): TaskCardViewModel {
  return {
    id,
    title: id,
    status: 'ready',
    phase: 'phase',
    priority: 'p2',
    tags: [],
    workstream: null,
    epicId: null,
    parentTaskId: null,
    dependsOn: [],
    followsAfter: [],
    taskKind: 'task',
    subtaskIds: [],
    blockedByIds: [],
    blockingIds: [],
    isBlocked: false,
    isReadyToStart: true,
    dueDate: null,
    checklistProgress: { completed: 0, total: 0, open: 0 },
    summary: 'Summary',
    excerpt: 'Summary',
    sortOrder: null,
    checklist: [],
    sourcePath: `/workspace/${id}.md`,
    relativePath: `docs/project/25-tasks/open/${id}.md`,
    folder: 'docs/project/25-tasks/open',
    bucket: 'open',
    updatedAt: '2026-04-20',
    lastModified: '2026-04-20T00:00:00.000Z',
    hasBody: true,
    bodyPreview: 'Preview',
    source: 'docs/project/open-points.md',
    version: { mtimeMs: 1, hash: id },
    activeAgent: null,
    activeAgentModel: null,
    activeAgentRuntime: null,
    activeAgentSince: null,
    activeAgentStatus: null,
    activeAgentSettings: null,
  };
}

test('mapColumnToSort maps list headers to TaskSort values', () => {
  assert.equal(mapColumnToSort('title'), 'alphabetical');
  assert.equal(mapColumnToSort('status'), 'status');
  assert.equal(mapColumnToSort('priority'), 'priority');
  assert.equal(mapColumnToSort('due'), 'updated_at');
  assert.equal(mapColumnToSort('checklist'), 'progress');
});

test('nextSortStateFromHeader toggles direction on same column and resets on new column', () => {
  const first = nextSortStateFromHeader({ sort: 'manual', direction: 'asc' }, 'title');
  assert.deepEqual(first, { sort: 'alphabetical', direction: 'asc' });

  const toggled = nextSortStateFromHeader(first, 'title');
  assert.deepEqual(toggled, { sort: 'alphabetical', direction: 'desc' });

  const switched = nextSortStateFromHeader(toggled, 'due');
  assert.deepEqual(switched, { sort: 'updated_at', direction: 'asc' });
});

test('applySortDirection keeps asc order and reverses for desc', () => {
  const cards = [card('a'), card('b'), card('c')];
  assert.deepEqual(applySortDirection(cards, 'asc').map((item) => item.id), ['a', 'b', 'c']);
  assert.deepEqual(applySortDirection(cards, 'desc').map((item) => item.id), ['c', 'b', 'a']);
});

test('sort control helpers expose active column state and readable labels', () => {
  assert.equal(isColumnActive('priority', 'priority'), true);
  assert.equal(isColumnActive('priority', 'title'), false);
  assert.equal(directionArrow('asc'), '↑');
  assert.equal(directionArrow('desc'), '↓');
  assert.equal(describeSortState({ sort: 'priority', direction: 'desc' }), 'Priority (aflopend)');
});
