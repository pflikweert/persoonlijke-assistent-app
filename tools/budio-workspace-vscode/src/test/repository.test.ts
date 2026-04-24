import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { TaskRepository } from '../tasks/repository';

test('repository blocks stale writes after external file change', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-workspace-'));
  const tasksRoot = path.join(workspaceRoot, 'docs/project/25-tasks/open');
  await fs.mkdir(tasksRoot, { recursive: true });
  const filePath = path.join(tasksRoot, 'example.md');
  await fs.writeFile(
    filePath,
    `---
id: task-example
title: Voorbeeldtaak
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
---

# Voorbeeldtaak

## Concrete checklist
- [ ] Eerste stap
`,
    'utf8',
  );

  const repository = new TaskRepository(workspaceRoot, 'docs/project/25-tasks');
  const [task] = await repository.scan();
  assert.ok(task);

  await fs.writeFile(filePath, (await fs.readFile(filePath, 'utf8')).replace('Voorbeeldtaak', 'Extern aangepast'), 'utf8');

  await assert.rejects(
    () =>
      repository.updateTaskFields(task.id, task.version, {
        summary: 'Nieuwe summary',
      }),
    /gewijzigd op disk/,
  );
});

test('repository deleteTask removes file and cleans task-map references', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-workspace-'));
  const openRoot = path.join(workspaceRoot, 'docs/project/25-tasks/open');
  const secondTaskPath = path.join(openRoot, 'other.md');
  await fs.mkdir(openRoot, { recursive: true });

  const filePath = path.join(openRoot, 'example.md');
  await fs.writeFile(
    filePath,
    `---
id: task-example
title: Voorbeeldtaak
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
---

# Voorbeeldtaak
`,
    'utf8',
  );

  const referencesPath = secondTaskPath;
  await fs.writeFile(
    referencesPath,
    `---
id: task-other
title: Tweede taak
status: backlog
phase: transitiemaand-consumer-beta
priority: p3
source: docs/project/open-points.md
updated_at: 2026-04-20
---

# Tweede taak

## Concrete checklist
- [ ] [Voorbeeldtaak](25-tasks/open/example.md)
- [ ] task-example
`,
    'utf8',
  );

  const repository = new TaskRepository(workspaceRoot, 'docs/project/25-tasks');
  const [task] = await repository.scan();
  assert.ok(task);

  await repository.deleteTask(task.id, task.version);

  await assert.rejects(() => fs.access(filePath), /ENOENT/);
  const references = await fs.readFile(referencesPath, 'utf8');
  assert.equal(references.includes('task-example'), false);
  assert.equal(references.includes('25-tasks/open/example.md'), false);
});

test('repository moveTask rewrites sort_order for in-lane reordering', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-workspace-'));
  const openRoot = path.join(workspaceRoot, 'docs/project/25-tasks/open');
  await fs.mkdir(openRoot, { recursive: true });

  await fs.writeFile(
    path.join(openRoot, 'a.md'),
    `---
id: task-a
title: A
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 1
---

# A
`,
    'utf8',
  );
  await fs.writeFile(
    path.join(openRoot, 'b.md'),
    `---
id: task-b
title: B
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 2
---

# B
`,
    'utf8',
  );
  await fs.writeFile(
    path.join(openRoot, 'c.md'),
    `---
id: task-c
title: C
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 3
---

# C
`,
    'utf8',
  );

  const repository = new TaskRepository(workspaceRoot, 'docs/project/25-tasks');
  const tasks = await repository.scan();
  const taskB = tasks.find((task) => task.id === 'task-b');
  assert.ok(taskB);

  await repository.moveTask({
    taskId: taskB.id,
    expectedVersion: taskB.version,
    targetStatus: 'ready',
    destinationIds: ['task-a', 'task-c', 'task-b'],
    sourceIds: [],
  });

  const contentA = await fs.readFile(path.join(openRoot, 'a.md'), 'utf8');
  const contentB = await fs.readFile(path.join(openRoot, 'b.md'), 'utf8');
  const contentC = await fs.readFile(path.join(openRoot, 'c.md'), 'utf8');

  assert.match(contentA, /sort_order: 1/);
  assert.match(contentC, /sort_order: 2/);
  assert.match(contentB, /sort_order: 3/);
});

test('repository moveTask updates both lanes and markdown status on cross-lane move', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-workspace-'));
  const openRoot = path.join(workspaceRoot, 'docs/project/25-tasks/open');
  await fs.mkdir(openRoot, { recursive: true });

  await fs.writeFile(
    path.join(openRoot, 'ready-a.md'),
    `---
id: task-ready-a
title: Ready A
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 1
---

# Ready A
`,
    'utf8',
  );
  await fs.writeFile(
    path.join(openRoot, 'ready-b.md'),
    `---
id: task-ready-b
title: Ready B
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 2
---

# Ready B
`,
    'utf8',
  );
  await fs.writeFile(
    path.join(openRoot, 'blocked-x.md'),
    `---
id: task-blocked-x
title: Blocked X
status: blocked
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 1
---

# Blocked X
`,
    'utf8',
  );

  const repository = new TaskRepository(workspaceRoot, 'docs/project/25-tasks');
  const tasks = await repository.scan();
  const moving = tasks.find((task) => task.id === 'task-ready-b');
  assert.ok(moving);

  await repository.moveTask({
    taskId: moving.id,
    expectedVersion: moving.version,
    targetStatus: 'blocked',
    destinationIds: ['task-ready-b', 'task-blocked-x'],
    sourceIds: ['task-ready-a'],
  });

  const readyA = await fs.readFile(path.join(openRoot, 'ready-a.md'), 'utf8');
  const readyB = await fs.readFile(path.join(openRoot, 'ready-b.md'), 'utf8');
  const blockedX = await fs.readFile(path.join(openRoot, 'blocked-x.md'), 'utf8');

  assert.match(readyA, /sort_order: 1/);
  assert.match(readyB, /status: blocked/);
  assert.match(readyB, /sort_order: 1/);
  assert.match(blockedX, /sort_order: 2/);
});

test('repository createTask inserts new task at top of selected status lane', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-workspace-'));
  const openRoot = path.join(workspaceRoot, 'docs/project/25-tasks/open');
  await fs.mkdir(openRoot, { recursive: true });

  await fs.writeFile(
    path.join(openRoot, 'ready-a.md'),
    `---
id: task-ready-a
title: Ready A
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 1
---

# Ready A
`,
    'utf8',
  );
  await fs.writeFile(
    path.join(openRoot, 'ready-b.md'),
    `---
id: task-ready-b
title: Ready B
status: ready
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 2
---

# Ready B
`,
    'utf8',
  );

  const repository = new TaskRepository(workspaceRoot, 'docs/project/25-tasks');
  const result = await repository.createTask({
    title: 'Nieuwe ready taak',
    status: 'ready',
  });

  const created = await fs.readFile(path.resolve(workspaceRoot, result.path), 'utf8');
  const readyA = await fs.readFile(path.join(openRoot, 'ready-a.md'), 'utf8');
  const readyB = await fs.readFile(path.join(openRoot, 'ready-b.md'), 'utf8');

  assert.match(created, /status: ready/);
  assert.match(created, /sort_order: 1/);
  assert.match(readyA, /sort_order: 2/);
  assert.match(readyB, /sort_order: 3/);
});

test('repository updateTaskFields places moved task on top of destination lane', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-workspace-'));
  const openRoot = path.join(workspaceRoot, 'docs/project/25-tasks/open');
  await fs.mkdir(openRoot, { recursive: true });

  await fs.writeFile(
    path.join(openRoot, 'in-progress-a.md'),
    `---
id: task-in-progress-a
title: In Progress A
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 1
---

# In Progress A
`,
    'utf8',
  );
  await fs.writeFile(
    path.join(openRoot, 'review-a.md'),
    `---
id: task-review-a
title: Review A
status: review
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 1
---

# Review A
`,
    'utf8',
  );
  await fs.writeFile(
    path.join(openRoot, 'review-b.md'),
    `---
id: task-review-b
title: Review B
status: review
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
sort_order: 2
---

# Review B
`,
    'utf8',
  );

  const repository = new TaskRepository(workspaceRoot, 'docs/project/25-tasks');
  const tasks = await repository.scan();
  const moving = tasks.find((task) => task.id === 'task-in-progress-a');
  assert.ok(moving);

  await repository.updateTaskFields(moving.id, moving.version, {
    status: 'review',
    updatedAt: '2026-04-24',
  });

  const moved = await fs.readFile(path.join(openRoot, 'in-progress-a.md'), 'utf8');
  const reviewA = await fs.readFile(path.join(openRoot, 'review-a.md'), 'utf8');
  const reviewB = await fs.readFile(path.join(openRoot, 'review-b.md'), 'utf8');

  assert.match(moved, /status: review/);
  assert.match(moved, /sort_order: 1/);
  assert.match(reviewA, /sort_order: 2/);
  assert.match(reviewB, /sort_order: 3/);
});
