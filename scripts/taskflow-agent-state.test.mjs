import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scriptPath = path.join(repoRoot, 'scripts/taskflow-agent-state.mjs');

test('taskflow-agent-state claim writes active-agent metadata', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'taskflow-agent-'));
  const taskfile = path.join(workspaceRoot, 'task.md');
  await fs.writeFile(taskfile, baseTaskfile(), 'utf8');

  await execFileAsync(process.execPath, [scriptPath, 'claim', taskfile], {
    cwd: repoRoot,
    env: {
      ...process.env,
      BUDIO_WORKSPACE_AGENT_NAME: 'Codex',
      BUDIO_WORKSPACE_AGENT_MODEL: 'gpt-5',
      BUDIO_WORKSPACE_AGENT_RUNTIME: 'codex',
      BUDIO_WORKSPACE_AGENT_SETTINGS: 'default',
    },
  });

  const content = await fs.readFile(taskfile, 'utf8');
  assert.match(content, /active_agent: Codex/);
  assert.match(content, /active_agent_model: gpt-5/);
  assert.match(content, /active_agent_runtime: codex/);
  assert.match(content, /active_agent_since: "[^"]+"/);
  assert.match(content, /active_agent_status: running/);
  assert.match(content, /active_agent_settings: default/);
});

test('taskflow-agent-state clear removes active-agent metadata', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'taskflow-agent-'));
  const taskfile = path.join(workspaceRoot, 'task.md');
  await fs.writeFile(
    taskfile,
    baseTaskfile().replace(
      'sort_order: 1',
      `sort_order: 1
active_agent: Codex
active_agent_model: gpt-5
active_agent_runtime: codex
active_agent_since: "2026-06-22T15:00:00.000Z"
active_agent_status: running
active_agent_settings: default`,
    ),
    'utf8',
  );

  await execFileAsync(process.execPath, [scriptPath, 'clear', taskfile], { cwd: repoRoot });

  const content = await fs.readFile(taskfile, 'utf8');
  assert.match(content, /active_agent: null/);
  assert.match(content, /active_agent_model: null/);
  assert.match(content, /active_agent_runtime: null/);
  assert.match(content, /active_agent_since: null/);
  assert.match(content, /active_agent_status: null/);
  assert.match(content, /active_agent_settings: null/);
});

test('taskflow-agent-state clear-stale dry-run reports stale claims without writing', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'taskflow-agent-'));
  const taskfile = path.join(workspaceRoot, 'docs/project/25-tasks/open/stale.md');
  await fs.mkdir(path.dirname(taskfile), { recursive: true });
  await fs.writeFile(taskfile, taskfileWithActiveAgent('2026-06-20T15:00:00.000Z'), 'utf8');

  const { stdout } = await execFileAsync(
    process.execPath,
    [scriptPath, 'clear-stale', '--dry-run', '--max-hours', '24'],
    { cwd: workspaceRoot },
  );

  const content = await fs.readFile(taskfile, 'utf8');
  assert.match(stdout, /Verlopen active-agent claims/);
  assert.match(stdout, /docs\/project\/25-tasks\/open\/stale\.md/);
  assert.match(content, /active_agent: Codex/);
});

test('taskflow-agent-state clear-stale clears stale claims and preserves recent claims', async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'taskflow-agent-'));
  const staleTaskfile = path.join(workspaceRoot, 'docs/project/25-tasks/open/stale.md');
  const recentTaskfile = path.join(workspaceRoot, 'docs/project/25-tasks/open/recent.md');
  await fs.mkdir(path.dirname(staleTaskfile), { recursive: true });
  await fs.writeFile(staleTaskfile, taskfileWithActiveAgent('2026-06-20T15:00:00.000Z'), 'utf8');
  await fs.writeFile(recentTaskfile, taskfileWithActiveAgent(new Date().toISOString()), 'utf8');

  const { stdout } = await execFileAsync(
    process.execPath,
    [scriptPath, 'clear-stale', '--max-hours', '24'],
    { cwd: workspaceRoot },
  );

  const staleContent = await fs.readFile(staleTaskfile, 'utf8');
  const recentContent = await fs.readFile(recentTaskfile, 'utf8');
  assert.match(stdout, /Gewist: docs\/project\/25-tasks\/open\/stale\.md/);
  assert.match(staleContent, /active_agent: null/);
  assert.match(staleContent, /active_agent_since: null/);
  assert.match(recentContent, /active_agent: Codex/);
});

test('taskflow-agent-state fails clearly for missing files', async () => {
  await assert.rejects(
    () => execFileAsync(process.execPath, [scriptPath, 'claim', '/tmp/does-not-exist-task.md'], { cwd: repoRoot }),
    /Taskfile niet gevonden/,
  );
});

function baseTaskfile() {
  return `---
id: task-example
title: Example
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-06-22
summary: ""
tags: []
workstream: plugin
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---

## Probleem / context

Context.
`;
}

function taskfileWithActiveAgent(since) {
  return baseTaskfile().replace(
    'sort_order: 1',
    `sort_order: 1
active_agent: Codex
active_agent_model: gpt-5
active_agent_runtime: codex
active_agent_since: "${since}"
active_agent_status: running
active_agent_settings: default`,
  );
}
