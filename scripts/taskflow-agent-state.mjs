#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ACTIVE_AGENT_FIELDS = [
  'active_agent',
  'active_agent_model',
  'active_agent_runtime',
  'active_agent_since',
  'active_agent_status',
  'active_agent_settings',
];

function usage(exitCode = 1) {
  const output = exitCode === 0 ? console.log : console.error;
  output(`Usage:
  node scripts/taskflow-agent-state.mjs claim <taskfile>
  node scripts/taskflow-agent-state.mjs clear <taskfile>`);
  process.exit(exitCode);
}

const [, , action, taskfileArg] = process.argv;
if (action === '--help' || action === '-h') {
  usage(0);
}

if (!['claim', 'clear'].includes(action) || !taskfileArg) {
  usage(1);
}

const taskfilePath = path.resolve(process.cwd(), taskfileArg);
let content;
try {
  content = await fs.readFile(taskfilePath, 'utf8');
} catch {
  console.error(`Taskfile niet gevonden: ${taskfileArg}`);
  process.exit(1);
}

const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
if (!match) {
  console.error(`Taskfile mist frontmatter: ${taskfileArg}`);
  process.exit(1);
}

const now = new Date();
const patch =
  action === 'claim'
    ? {
        active_agent: cleanEnv('BUDIO_WORKSPACE_AGENT_NAME', 'Codex'),
        active_agent_model: cleanEnv('BUDIO_WORKSPACE_AGENT_MODEL', process.env.CODEX_MODEL ?? 'unknown'),
        active_agent_runtime: cleanEnv('BUDIO_WORKSPACE_AGENT_RUNTIME', 'codex'),
        active_agent_since: quoteYamlString(now.toISOString()),
        active_agent_status: 'running',
        active_agent_settings: cleanEnv('BUDIO_WORKSPACE_AGENT_SETTINGS', 'default'),
        updated_at: now.toISOString().slice(0, 10),
      }
    : {
        active_agent: 'null',
        active_agent_model: 'null',
        active_agent_runtime: 'null',
        active_agent_since: 'null',
        active_agent_status: 'null',
        active_agent_settings: 'null',
        updated_at: now.toISOString().slice(0, 10),
      };

const frontmatterLines = match[1].split('\n');
const nextFrontmatter = upsertFrontmatter(frontmatterLines, patch);
const nextContent = `---\n${nextFrontmatter.join('\n')}\n---\n${content.slice(match[0].length)}`;

await fs.writeFile(taskfilePath, nextContent, 'utf8');
console.log(`${action === 'claim' ? 'Geclaimd' : 'Gewist'}: ${path.relative(process.cwd(), taskfilePath)}`);

function upsertFrontmatter(lines, patch) {
  const next = [...lines];
  const existingIndexes = new Map();
  next.forEach((line, index) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex >= 0) {
      existingIndexes.set(line.slice(0, separatorIndex).trim(), index);
    }
  });

  for (const [key, value] of Object.entries(patch)) {
    const line = `${key}: ${value}`;
    const index = existingIndexes.get(key);
    if (index !== undefined) {
      next[index] = line;
      continue;
    }

    const insertAfter = findInsertIndex(next);
    next.splice(insertAfter, 0, line);
    for (const [existingKey, existingIndex] of existingIndexes.entries()) {
      if (existingIndex >= insertAfter) {
        existingIndexes.set(existingKey, existingIndex + 1);
      }
    }
    existingIndexes.set(key, insertAfter);
  }

  return next;
}

function findInsertIndex(lines) {
  const lastActiveIndex = Math.max(
    ...ACTIVE_AGENT_FIELDS.map((field) => lines.findIndex((line) => line.startsWith(`${field}:`))),
  );
  if (lastActiveIndex >= 0) {
    return lastActiveIndex + 1;
  }

  const sortOrderIndex = lines.findIndex((line) => line.startsWith('sort_order:'));
  return sortOrderIndex >= 0 ? sortOrderIndex + 1 : lines.length;
}

function cleanEnv(name, fallback) {
  const value = process.env[name]?.trim();
  return value ? yamlScalar(value) : yamlScalar(fallback);
}

function yamlScalar(value) {
  const normalized = String(value ?? '').trim();
  if (!normalized) {
    return 'unknown';
  }
  return /^[A-Za-z0-9_.-]+$/.test(normalized) ? normalized : quoteYamlString(normalized);
}

function quoteYamlString(value) {
  return JSON.stringify(String(value));
}
