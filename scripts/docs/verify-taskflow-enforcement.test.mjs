import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTaskflow } from './verify-taskflow-enforcement.mjs';

function taskfile(status = 'in_progress', updatedAt = '2026-04-23') {
  return `---\nid: task-test\ntitle: Test\nstatus: ${status}\nphase: transitiemaand-consumer-beta\npriority: p2\nsource: docs/project/open-points.md\nupdated_at: ${updatedAt}\nsummary: \"\"\ntags: []\ndue_date: null\nsort_order: null\n---\n`;
}

function completeTaskfile({ taskKind = 'task', specReady = true } = {}) {
  return `---\nid: task-test\ntitle: Test\nstatus: in_progress\nphase: transitiemaand-consumer-beta\npriority: p1\nsource: docs/project/open-points.md\nupdated_at: 2026-04-23\nsummary: \"\"\ntags: []\ntask_kind: ${taskKind}\nspec_ready: ${specReady}\ndue_date: null\nsort_order: null\n---\n\n## Probleem / context\n\nContext.\n\n## Gewenste uitkomst\n\nOutcome.\n\n## User outcome\n\nUser can do the thing.\n\n## Functional slice\n\nOne working slice.\n\n## Entry / exit\n\n- Entry: start.\n- Exit: end.\n\n## Happy flow\n\n1. Start.\n2. Complete.\n\n## Non-happy flows\n\n- Failure: show retry.\n\n## UX / copy\n\n- Label: Do thing.\n\n## Data / IO\n\n- Input: A.\n- Output: B.\n\n## Acceptance criteria\n\n- [ ] Scenario passes.\n\n## Verify / bewijs\n\n- npm run test\n`;
}

function completeResearchTaskfile() {
  return `---\nid: task-research\ntitle: Research\nstatus: in_progress\nphase: transitiemaand-consumer-beta\npriority: p1\nsource: docs/project/open-points.md\nupdated_at: 2026-04-23\nsummary: \"\"\ntags: []\ntask_kind: research\nspec_ready: true\ndue_date: null\nsort_order: null\n---\n\n## Probleem / context\n\nContext.\n\n## Gewenste uitkomst\n\nOutcome.\n\n## User outcome\n\nResearch decision.\n\n## Functional slice\n\nOne research output.\n\n## Acceptance criteria\n\n- [ ] Decision is clear.\n\n## Verify / bewijs\n\n- npm run docs:bundle\n`;
}

function completeEpic() {
  return `---\nid: epic-test\ntitle: Test epic\nstatus: backlog\npriority: p1\nowner: Pieter\nphase: transitiemaand-consumer-beta\nupdated_at: 2026-04-27\nsummary: \"\"\nspec_ready: true\nsort_order: 1\n---\n\n# Test epic\n\n## Doel\n\nGoal.\n\n## Gewenste uitkomst\n\nOutcome.\n\n## Scope en grenzen\n\n- In.\n- Out.\n\n## P1 / P2 scheiding\n\n- P1: first.\n- P2: later.\n\n## UX / copy contract\n\n- Use existing copy.\n\n## Flow contract\n\n- Happy flow.\n- Non-happy flow.\n\n## Linked tasks\n\n- docs/project/25-tasks/open/test.md\n\n## Volgorde van uitvoeren\n\n1. First.\n\n## Dependencies\n\n- None.\n\n## Acceptatie\n\n- Works.\n`;
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

test('fails for newly added build task without spec-readiness sections', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/25-tasks/open/test.md'],
    addedPaths: ['docs/project/25-tasks/open/test.md'],
    taskfileContents: {
      'docs/project/25-tasks/open/test.md': taskfile('in_progress', '2026-04-23'),
    },
    hasDoneTransition: false,
  });

  assert.equal(result.ok, false);
  assert.match(result.issues.join('\n'), /Task mist verplichte spec-readiness sectie: ## User outcome/);
  assert.match(result.issues.join('\n'), /Task mist verplichte spec-readiness sectie: ## Happy flow/);
});

test('passes for complete spec-ready build task', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/25-tasks/open/test.md'],
    addedPaths: ['docs/project/25-tasks/open/test.md'],
    taskfileContents: {
      'docs/project/25-tasks/open/test.md': completeTaskfile(),
    },
    hasDoneTransition: false,
  });

  assert.equal(result.ok, true);
});

test('passes for complete spec-ready research task with lighter section set', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/25-tasks/open/research.md'],
    addedPaths: ['docs/project/25-tasks/open/research.md'],
    taskfileContents: {
      'docs/project/25-tasks/open/research.md': completeResearchTaskfile(),
    },
    hasDoneTransition: false,
  });

  assert.equal(result.ok, true);
});

test('fails for newly added epic without spec-readiness sections', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/24-epics/test.md', 'docs/project/25-tasks/open/test.md'],
    addedPaths: ['docs/project/24-epics/test.md'],
    taskfileContents: {
      'docs/project/25-tasks/open/test.md': taskfile('in_progress', '2026-04-23'),
    },
    epicContents: {
      'docs/project/24-epics/test.md': `---\nid: epic-test\ntitle: Test\nstatus: backlog\npriority: p1\nupdated_at: 2026-04-27\n---\n\n# Test\n`,
    },
    hasDoneTransition: false,
  });

  assert.equal(result.ok, false);
  assert.match(result.issues.join('\n'), /Epic mist verplichte spec-readiness sectie/);
});

test('passes for complete spec-ready epic', () => {
  const result = evaluateTaskflow({
    changedPaths: ['docs/project/24-epics/test.md', 'docs/project/25-tasks/open/test.md'],
    addedPaths: ['docs/project/24-epics/test.md'],
    taskfileContents: {
      'docs/project/25-tasks/open/test.md': taskfile('in_progress', '2026-04-23'),
    },
    epicContents: {
      'docs/project/24-epics/test.md': completeEpic(),
    },
    hasDoneTransition: false,
  });

  assert.equal(result.ok, true);
});
