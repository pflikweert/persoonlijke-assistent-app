import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBoardSnapshot } from '../tasks/board-state';
import type { ParsedTaskFile } from '../tasks/types';

function buildTask(overrides: Partial<ParsedTaskFile>): ParsedTaskFile {
  const { workstream = null, epicId = null, parentTaskId = null, dependsOn = [], followsAfter = [], taskKind = 'task', ...restOverrides } = overrides;
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
    workstream,
    epicId,
    parentTaskId,
    dependsOn,
    followsAfter,
    taskKind,
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
    activeAgent: null,
    activeAgentModel: null,
    activeAgentRuntime: null,
    activeAgentSince: null,
    activeAgentStatus: null,
    activeAgentSettings: null,
    ...restOverrides,
  };
}

test('buildBoardSnapshot groups by column and respects manual ordering', () => {
  const snapshot = buildBoardSnapshot({
    tasks: [
      buildTask({ id: 'b', title: 'B', status: 'ready', sortOrder: 2 }),
      buildTask({ id: 'a', title: 'A', status: 'ready', sortOrder: 1 }),
      buildTask({ id: 'c', title: 'C', status: 'done', bucket: 'done', relativePath: 'docs/project/25-tasks/done/c.md' }),
    ],
    epics: [],
    settings: {
      tasksRoot: 'docs/project/25-tasks',
      epicsRoot: 'docs/project/24-epics',
      jarvisAssetsRoot: 'assets/jarvis/final-frame',
      jarvisSeedManifest: 'tools/jarvis-luma/final-frame.seed.json',
      agentName: 'Codex',
      agentModel: 'unknown',
      agentRuntime: 'codex',
      agentSettings: 'default',
      columns: ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'],
      showDoneColumn: true,
      defaultSort: 'manual',
    },
    workspaceName: 'workspace',
    workspacePath: '/workspace',
  });

  assert.equal(snapshot.columns.find((column) => column.key === 'ready')?.cards[0]?.id, 'a');
  assert.equal(snapshot.doneTaskCount, 1);
});

test('buildBoardSnapshot derives subtasks, blockers and epic rollups', () => {
  const snapshot = buildBoardSnapshot({
    tasks: [
      buildTask({ id: 'task-parent', title: 'Parent', epicId: 'epic-1', status: 'ready', sortOrder: 1 }),
      buildTask({ id: 'task-child', title: 'Child', epicId: 'epic-1', parentTaskId: 'task-parent', taskKind: 'subtask', status: 'backlog', sortOrder: 2 }),
      buildTask({ id: 'task-blocked', title: 'Blocked', epicId: 'epic-1', dependsOn: ['task-parent'], status: 'ready', sortOrder: 3 }),
    ],
    epics: [
      {
        id: 'epic-1',
        title: 'Epic',
        status: 'in_progress',
        priority: 'p1',
        owner: 'Pieter',
        phase: 'phase',
        updatedAt: '2026-04-27',
        summary: 'Summary',
        sortOrder: 1,
        sourcePath: '/workspace/docs/project/24-epics/epic.md',
        relativePath: 'docs/project/24-epics/epic.md',
        body: '# Epic',
        raw: '',
        version: { mtimeMs: 1, hash: 'epic-hash' },
        frontmatterValues: {},
        frontmatterOrder: [],
      },
    ],
    settings: {
      tasksRoot: 'docs/project/25-tasks',
      epicsRoot: 'docs/project/24-epics',
      jarvisAssetsRoot: 'assets/jarvis/final-frame',
      jarvisSeedManifest: 'tools/jarvis-luma/final-frame.seed.json',
      agentName: 'Codex',
      agentModel: 'unknown',
      agentRuntime: 'codex',
      agentSettings: 'default',
      columns: ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'],
      showDoneColumn: true,
      defaultSort: 'manual',
    },
    workspaceName: 'workspace',
    workspacePath: '/workspace',
  });

  const parent = snapshot.allCards.find((card) => card.id === 'task-parent');
  const blocked = snapshot.allCards.find((card) => card.id === 'task-blocked');
  const epic = snapshot.epics[0];

  assert.deepEqual(parent?.subtaskIds, ['task-child']);
  assert.equal(parent?.blockingIds.includes('task-blocked'), true);
  assert.equal(blocked?.isBlocked, true);
  assert.equal(epic?.linkedTaskIds.length, 3);
  assert.equal(epic?.subtaskIds.includes('task-child'), true);
});

test('buildBoardSnapshot exposes focused detail preview sections from markdown body', () => {
  const snapshot = buildBoardSnapshot({
    tasks: [
      buildTask({
        id: 'detail-task',
        body: [
          '## Probleem / context',
          '',
          'De detail view toont nu te veel ruwe markdown.',
          '',
          '## Gewenste uitkomst',
          '',
          'Een rustige leesweergave met de belangrijkste taakcontext.',
        ].join('\n'),
        sections: new Map([
          [
            'probleem / context',
            {
              heading: 'Probleem / context',
              startLine: 0,
              contentStartLine: 2,
              endLineExclusive: 3,
              lines: ['De detail view toont nu te veel ruwe markdown.'],
            },
          ],
          [
            'gewenste uitkomst',
            {
              heading: 'Gewenste uitkomst',
              startLine: 4,
              contentStartLine: 6,
              endLineExclusive: 7,
              lines: ['Een rustige leesweergave met de belangrijkste taakcontext.'],
            },
          ],
        ]),
      }),
    ],
    epics: [],
    settings: {
      tasksRoot: 'docs/project/25-tasks',
      epicsRoot: 'docs/project/24-epics',
      jarvisAssetsRoot: 'assets/jarvis/final-frame',
      jarvisSeedManifest: 'tools/jarvis-luma/final-frame.seed.json',
      agentName: 'Codex',
      agentModel: 'unknown',
      agentRuntime: 'codex',
      agentSettings: 'default',
      columns: ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'],
      showDoneColumn: true,
      defaultSort: 'manual',
    },
    workspaceName: 'workspace',
    workspacePath: '/workspace',
  });

  assert.deepEqual(snapshot.allCards[0]?.detailPreviewSections, [
    {
      heading: 'Probleem / context',
      body: 'De detail view toont nu te veel ruwe markdown.',
    },
    {
      heading: 'Gewenste uitkomst',
      body: 'Een rustige leesweergave met de belangrijkste taakcontext.',
    },
  ]);
});

test('buildBoardSnapshot leaves detail preview sections empty for fallback rendering', () => {
  const snapshot = buildBoardSnapshot({
    tasks: [buildTask({ id: 'fallback-task', body: 'Losse body zonder gewenste detailsecties.' })],
    epics: [],
    settings: {
      tasksRoot: 'docs/project/25-tasks',
      epicsRoot: 'docs/project/24-epics',
      jarvisAssetsRoot: 'assets/jarvis/final-frame',
      jarvisSeedManifest: 'tools/jarvis-luma/final-frame.seed.json',
      agentName: 'Codex',
      agentModel: 'unknown',
      agentRuntime: 'codex',
      agentSettings: 'default',
      columns: ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'],
      showDoneColumn: true,
      defaultSort: 'manual',
    },
    workspaceName: 'workspace',
    workspacePath: '/workspace',
  });

  assert.deepEqual(snapshot.allCards[0]?.detailPreviewSections, []);
  assert.equal(snapshot.allCards[0]?.bodyPreview, 'Losse body zonder gewenste detailsecties.');
});
