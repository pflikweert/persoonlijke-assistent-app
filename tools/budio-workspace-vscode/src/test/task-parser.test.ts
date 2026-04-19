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
