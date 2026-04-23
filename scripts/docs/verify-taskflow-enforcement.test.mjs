import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTaskflow } from './verify-taskflow-enforcement.mjs';

function taskfile(status = 'in_progress', updatedAt = '2026-04-23') {
  return `---\nid: task-test\ntitle: Test\nstatus: ${status}\nphase: transitiemaand-consumer-beta\npriority: p2\nsource: docs/project/open-points.md\nupdated_at: ${updatedAt}\nsummary: \"\"\ntags: []\ndue_date: null\nsort_order: null\n---\n`;
}

test('fails when relevant changes exist without taskfile mutation', () => {
  const result = evaluateTaskflow({
    changedPaths: ['app/settings.tsx'],
    taskfileContents: {},
    hasDoneTransition: false,
  });

  assert.equal(result.ok, false);
  assert.match(result.issues.join('\n'), /Geen taskfile-mutatie/);
});

test('passes with valid in_progress taskflow mutation', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/25-tasks/open/test.md', 'app/settings.tsx'],
    taskfileContents: {
      'docs/project/25-tasks/open/test.md': taskfile('in_progress', '2026-04-23'),
    },
    hasDoneTransition: false,
  });

  assert.equal(result.ok, true);
});

test('fails on invalid status or missing updated_at', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/25-tasks/open/test.md', 'docs/dev/task-lifecycle-workflow.md'],
    taskfileContents: {
      'docs/project/25-tasks/open/test.md': taskfile('invalid_status', '2026/04/23'),
    },
    hasDoneTransition: false,
  });

  assert.equal(result.ok, false);
  assert.match(result.issues.join('\n'), /ongeldige status/);
  assert.match(result.issues.join('\n'), /geldige updated_at/);
});

test('fails on done transition without bundle evidence paths', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/25-tasks/done/test.md'],
    taskfileContents: {
      'docs/project/25-tasks/done/test.md': taskfile('done', '2026-04-23'),
    },
    hasDoneTransition: true,
  });

  assert.equal(result.ok, false);
  assert.match(result.issues.join('\n'), /bundelspoor ontbreekt/);
});
