import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardSnapshot } from '../tasks/board-state';
import type { ParsedTaskFile } from '../tasks/types';

function buildTask(overrides: Partial<ParsedTaskFile>): ParsedTaskFile {
  return {
    id: 'task',
    title: 'Task',
    status: 'ready',
    phase: 'phase',
    priority: 'p2',
    source: 'docs/project/open-points.md',
    updatedAt: '2026-04-20',
    summary: 'Summary',
    tags: [],
    dueDate: null,
    sortOrder: null,
    checklist: [],
    bucket: 'open',
    sourcePath: '/workspace/example.md',
    relativePath: 'docs/project/25-tasks/open/example.md',
    folder: 'docs/project/25-tasks/open',
    body: '# Task',
    raw: '',
    excerpt: 'Summary',
    hasBody: true,
    lastModified: '2026-04-20T00:00:00.000Z',
    version: { mtimeMs: 1, hash: 'hash' },
    frontmatterValues: {},
    frontmatterOrder: [],
    bodyLines: ['# Task'],
    sections: new Map(),
    firstHeadingLineIndex: 0,
    checklistLineIndexes: [],
    ...overrides,
  };
}

test('buildBoardSnapshot groups by column and respects manual ordering', () => {
  const snapshot = buildBoardSnapshot({
    tasks: [
      buildTask({ id: 'b', title: 'B', status: 'ready', sortOrder: 2 }),
      buildTask({ id: 'a', title: 'A', status: 'ready', sortOrder: 1 }),
      buildTask({ id: 'c', title: 'C', status: 'done', bucket: 'done', relativePath: 'docs/project/25-tasks/done/c.md' }),
    ],
    settings: {
      tasksRoot: 'docs/project/25-tasks',
      columns: ['backlog', 'ready', 'in_progress', 'blocked', 'done'],
      showDoneColumn: true,
      defaultSort: 'manual',
    },
    workspaceName: 'workspace',
    workspacePath: '/workspace',
  });

  assert.equal(snapshot.columns.find((column) => column.key === 'ready')?.cards[0]?.id, 'a');
  assert.equal(snapshot.doneTaskCount, 1);
});
