import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTaskFile } from '../tasks/parser';

test('parseTaskFile reads frontmatter, summary fallback and checklist', () => {
  const parsed = parseTaskFile({
    absolutePath: '/workspace/docs/project/25-tasks/open/example.md',
    relativePath: 'docs/project/25-tasks/open/example.md',
    content: `---
id: task-example
title: Voorbeeldtaak
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-20
tags: [beta, board]
due_date: 2026-04-25
sort_order: 2
---

# Voorbeeldtaak

## Probleem / context
Dit is de context.

## Gewenste uitkomst
Een compacte samenvatting voor de kaart.

## Concrete checklist
- [ ] Eerste stap
- [x] Tweede stap
`,
    version: {
      mtimeMs: 1234,
      hash: 'hash-1',
    },
  });

  assert.equal(parsed.id, 'task-example');
  assert.equal(parsed.summary, 'Een compacte samenvatting voor de kaart.');
  assert.deepEqual(parsed.tags, ['beta', 'board']);
  assert.equal(parsed.dueDate, '2026-04-25');
  assert.equal(parsed.sortOrder, 2);
  assert.equal(parsed.checklist.length, 2);
  assert.equal(parsed.checklist[1]?.checked, true);
});

test('parseTaskFile decodes escaped newline and backslashes in quoted summary', () => {
  const parsed = parseTaskFile({
    absolutePath: '/workspace/docs/project/25-tasks/open/example-escape.md',
    relativePath: 'docs/project/25-tasks/open/example-escape.md',
    content: `---
id: task-example-escape
title: Escapetest
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-21
summary: "regel 1\\nregel 2 met pad C:\\\\temp\\\\file"
tags: []
due_date: null
sort_order: null
---

# Escapetest
`,
    version: {
      mtimeMs: 1234,
      hash: 'hash-2',
    },
  });

  assert.equal(parsed.summary, 'regel 1\nregel 2 met pad C:\\temp\\file');
});

test('parseTaskFile normalizes repeated escaped newlines and keeps paragraph breaks compact', () => {
  const parsed = parseTaskFile({
    absolutePath: '/workspace/docs/project/25-tasks/open/example-newlines.md',
    relativePath: 'docs/project/25-tasks/open/example-newlines.md',
    content: `---
id: task-example-newlines
title: Newline test
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-21
summary: "eerste regel\\\\n\\\\n\\\\n tweede regel"
tags: []
due_date: null
sort_order: null
---

# Newline test
`,
    version: {
      mtimeMs: 1234,
      hash: 'hash-3',
    },
  });

  assert.equal(parsed.summary, 'eerste regel\n\n tweede regel');
  assert.equal(parsed.excerpt, 'eerste regel tweede regel');
});

test('parseTaskFile reads optional hierarchy metadata when present', () => {
  const parsed = parseTaskFile({
    absolutePath: '/workspace/docs/project/25-tasks/open/example-hierarchy.md',
    relativePath: 'docs/project/25-tasks/open/example-hierarchy.md',
    content: `---
id: task-example-hierarchy
title: Hierarchy test
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-27
epic_id: epic-example
parent_task_id: task-parent
depends_on: [task-a, task-b]
follows_after: [task-c]
task_kind: subtask
---

# Hierarchy test
`,
    version: {
      mtimeMs: 1234,
      hash: 'hash-4',
    },
  });

  assert.equal(parsed.epicId, 'epic-example');
  assert.equal(parsed.parentTaskId, 'task-parent');
  assert.deepEqual(parsed.dependsOn, ['task-a', 'task-b']);
  assert.deepEqual(parsed.followsAfter, ['task-c']);
  assert.equal(parsed.taskKind, 'subtask');
});
