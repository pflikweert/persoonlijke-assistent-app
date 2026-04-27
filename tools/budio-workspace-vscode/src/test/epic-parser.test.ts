import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEpicFile } from '../tasks/epic-parser';

test('parseEpicFile reads epic frontmatter and summary', () => {
  const parsed = parseEpicFile({
    absolutePath: '/workspace/docs/project/24-epics/example.md',
    relativePath: 'docs/project/24-epics/example.md',
    content: `---
id: epic-example
title: Epic example
status: in_progress
priority: p1
owner: Pieter
phase: transitiemaand-consumer-beta
updated_at: 2026-04-27
summary: "Korte epic summary"
sort_order: 1
---

# Epic example
`,
    version: {
      mtimeMs: 1234,
      hash: 'epic-hash',
    },
  });

  assert.equal(parsed.id, 'epic-example');
  assert.equal(parsed.status, 'in_progress');
  assert.equal(parsed.priority, 'p1');
  assert.equal(parsed.owner, 'Pieter');
  assert.equal(parsed.summary, 'Korte epic summary');
  assert.equal(parsed.sortOrder, 1);
});
