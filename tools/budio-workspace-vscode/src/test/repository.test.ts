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
