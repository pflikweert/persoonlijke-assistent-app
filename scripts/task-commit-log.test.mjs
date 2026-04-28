import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  TASK_COMMIT_LOG_GUARD_ENV,
  buildCommitLogEntry,
  collectTaskfilePaths,
  runTaskCommitLog,
} from './task-commit-log.mjs';

const REAL_REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

test('buildCommitLogEntry uses author date plus subject', () => {
  assert.equal(
    buildCommitLogEntry({
      authorDate: '2026-04-28T09:41:12+02:00',
      subject: 'docs: sync local workspace state',
    }),
    '- 2026-04-28T09:41:12+02:00 — docs: sync local workspace state',
  );
});

test('collectTaskfilePaths filters HEAD changes to taskfiles only', () => {
  const output = [
    'docs/project/25-tasks/open/example.md',
    'app/today.tsx',
    'docs/project/25-tasks/done/finished.md',
    '',
  ].join('\n');

  assert.deepEqual(collectTaskfilePaths(output), [
    'docs/project/25-tasks/open/example.md',
    'docs/project/25-tasks/done/finished.md',
  ]);
});

test('runTaskCommitLog exits early when guard env is set', async () => {
  const result = await runTaskCommitLog({
    env: {
      [TASK_COMMIT_LOG_GUARD_ENV]: '1',
    },
  });

  assert.equal(result.status, 'guarded');
  assert.deepEqual(result.taskfilePaths, []);
});

test('runTaskCommitLog no-ops when HEAD has no taskfiles', async () => {
  const result = await runTaskCommitLog({
    execGit(args) {
      if (args.join(' ') === 'diff-tree --no-commit-id --name-only -r HEAD') {
        return 'app/today.tsx\nservices/foo.ts\n';
      }
      throw new Error(`Unexpected git args: ${args.join(' ')}`);
    },
    parseTaskFile() {
      throw new Error('parseTaskFile should not be called');
    },
    appendSectionListEntry() {
      throw new Error('appendSectionListEntry should not be called');
    },
  });

  assert.equal(result.status, 'noop');
  assert.equal(result.reason, 'no-taskfiles');
});

test('runTaskCommitLog no-ops when entry already exists', async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-task-log-noop-'));
  const taskfilePath = path.join(tempRoot, 'docs/project/25-tasks/open/example.md');
  await fs.mkdir(path.dirname(taskfilePath), { recursive: true });

  const entry = '- 2026-04-28T09:41:12+02:00 — docs: example';
  const content = `---
id: task-example
title: Example
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-28
---

# Example

## Commits

${entry}
`;
  await fs.writeFile(taskfilePath, content, 'utf8');

  const gitCalls = [];
  const result = await runTaskCommitLog({
    repoRootPath: tempRoot,
    execGit(args) {
      gitCalls.push(args.join(' '));
      const command = args.join(' ');
      if (command === 'diff-tree --no-commit-id --name-only -r HEAD') {
        return 'docs/project/25-tasks/open/example.md';
      }
      if (command === 'show -s --format=%aI HEAD') {
        return '2026-04-28T09:41:12+02:00';
      }
      if (command === 'show -s --format=%s HEAD') {
        return 'docs: example';
      }
      throw new Error(`Unexpected git args: ${command}`);
    },
    parseTaskFile({ content }) {
      return {
        sections: new Map([
          [
            'commits',
            {
              lines: content.split('\n').filter((line) => line.startsWith('- ')),
            },
          ],
        ]),
      };
    },
    appendSectionListEntry() {
      throw new Error('appendSectionListEntry should not be called when entry already exists');
    },
  });

  assert.equal(result.status, 'noop');
  assert.equal(result.reason, 'entries-exist');
  assert.deepEqual(
    gitCalls,
    [
      'diff-tree --no-commit-id --name-only -r HEAD',
      'show -s --format=%aI HEAD',
      'show -s --format=%s HEAD',
    ],
  );
  assert.equal(await fs.readFile(taskfilePath, 'utf8'), content);
});

test('runTaskCommitLog appends entry, amends once, and leaves repo clean', async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'budio-task-log-repo-'));
  await fs.mkdir(path.join(tempRoot, 'scripts'), { recursive: true });
  await fs.mkdir(path.join(tempRoot, 'tools/budio-workspace-vscode/src/tasks'), { recursive: true });
  await copyFixtureFiles(tempRoot, [
    'scripts/task-commit-log.mjs',
    'tools/budio-workspace-vscode/src/tasks/parser.ts',
    'tools/budio-workspace-vscode/src/tasks/writer.ts',
    'tools/budio-workspace-vscode/src/tasks/constants.ts',
    'tools/budio-workspace-vscode/src/tasks/types.ts',
  ]);

  runGit(tempRoot, ['init']);
  runGit(tempRoot, ['config', 'user.name', 'Budio Test']);
  runGit(tempRoot, ['config', 'user.email', 'budio@example.com']);

  const taskfilePath = path.join(tempRoot, 'docs/project/25-tasks/open/example.md');
  await fs.mkdir(path.dirname(taskfilePath), { recursive: true });
  await fs.writeFile(
    taskfilePath,
    `---
id: task-example
title: Example
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-28
---

# Example

## Commits

- Nog geen commit-registraties.
`,
    'utf8',
  );

  runGit(tempRoot, ['add', '.']);
  runGit(tempRoot, ['commit', '-m', 'docs: initial task']);

  await fs.writeFile(
    taskfilePath,
    `---
id: task-example
title: Example
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-28
---

# Example

## Probleem / context

Context.

## Commits

- Nog geen commit-registraties.
`,
    'utf8',
  );

  runGit(tempRoot, ['add', '.']);
  runGit(tempRoot, ['commit', '-m', 'docs: update task body']);

  const scriptPath = path.join(tempRoot, 'scripts/task-commit-log.mjs');
  execFileSync(process.execPath, ['--import', 'tsx', scriptPath], {
    cwd: REAL_REPO_ROOT,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const finalContent = await fs.readFile(taskfilePath, 'utf8');
  const authorDate = runGit(tempRoot, ['show', '-s', '--format=%aI', 'HEAD']);
  assert.match(finalContent, new RegExp(`- ${escapeRegExp(authorDate)} — docs: update task body`));
  assert.equal(runGit(tempRoot, ['status', '--short']), '');
  assert.equal(runGit(tempRoot, ['show', '-s', '--format=%s', 'HEAD']), 'docs: update task body');
});

async function copyFixtureFiles(tempRoot, relativePaths) {
  await Promise.all(
    relativePaths.map(async (relativePath) => {
      const sourcePath = path.join(REAL_REPO_ROOT, relativePath);
      const targetPath = path.join(tempRoot, relativePath);
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.copyFile(sourcePath, targetPath);
    }),
  );
}

function runGit(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function escapeRegExp(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
