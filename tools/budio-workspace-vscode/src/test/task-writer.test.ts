import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTaskFile } from '../tasks/parser';
import { applyChecklistToggle, applyTaskFieldPatch } from '../tasks/writer';

const source = `---
id: task-example
title: Oude titel
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
---

# Oude titel

## Concrete checklist
- [ ] Eerste stap
- [x] Tweede stap
`;

test('applyTaskFieldPatch updates title in frontmatter and H1', () => {
  const parsed = parseTaskFile({
    absolutePath: '/workspace/docs/project/25-tasks/open/example.md',
    relativePath: 'docs/project/25-tasks/open/example.md',
    content: source,
    version: {
      mtimeMs: 1,
      hash: 'hash-1',
    },
  });

  const next = applyTaskFieldPatch(parsed, {
    title: 'Nieuwe titel',
    priority: 'p1',
    summary: 'Kort',
  });

  assert.match(next, /title: Nieuwe titel/);
  assert.match(next, /priority: p1/);
  assert.match(next, /summary: Kort/);
  assert.match(next, /# Nieuwe titel/);
});

test('applyChecklistToggle only flips the targeted checklist line', () => {
  const parsed = parseTaskFile({
    absolutePath: '/workspace/docs/project/25-tasks/open/example.md',
    relativePath: 'docs/project/25-tasks/open/example.md',
    content: source,
    version: {
      mtimeMs: 1,
      hash: 'hash-1',
    },
  });

  const next = applyChecklistToggle(parsed, 0, true);
  assert.match(next, /- \[x\] Eerste stap/);
  assert.match(next, /- \[x\] Tweede stap/);
});
