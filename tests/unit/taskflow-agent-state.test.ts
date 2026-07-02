import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(__dirname, "../..");
const scriptPath = path.join(repoRoot, "scripts/taskflow-agent-state.mjs");

describe("taskflow-agent-state script", () => {
  it("clears stale active-agent claims while preserving recent claims", () => {
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "taskflow-agent-vitest-"));
    const taskDir = path.join(workspaceRoot, "docs/project/25-tasks/open");
    fs.mkdirSync(taskDir, { recursive: true });

    const stalePath = path.join(taskDir, "stale.md");
    const recentPath = path.join(taskDir, "recent.md");
    fs.writeFileSync(stalePath, taskfileWithActiveAgent("2026-06-20T15:00:00.000Z"), "utf8");
    fs.writeFileSync(recentPath, taskfileWithActiveAgent(new Date().toISOString()), "utf8");

    const stdout = execFileSync(process.execPath, [scriptPath, "clear-stale", "--max-hours", "24"], {
      cwd: workspaceRoot,
      encoding: "utf8",
    });

    expect(stdout).toContain("Gewist: docs/project/25-tasks/open/stale.md");
    expect(fs.readFileSync(stalePath, "utf8")).toContain("active_agent: null");
    expect(fs.readFileSync(recentPath, "utf8")).toContain("active_agent: Codex");
  });
});

function taskfileWithActiveAgent(since: string): string {
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
active_agent: Codex
active_agent_model: gpt-5
active_agent_runtime: codex
active_agent_since: "${since}"
active_agent_status: running
active_agent_settings: default
---

## Probleem / context

Context.
`;
}
