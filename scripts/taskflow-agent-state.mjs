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
const ACTIVE_AGENT_STATUS_VALUES = new Set(['active', 'running', 'busy', 'editing', 'working', 'in_progress']);
const DEFAULT_STALE_MAX_HOURS = 24;
const TASKFLOW_DIRS = ['docs/project/25-tasks/open', 'docs/project/25-tasks/done'];
const CLEAR_REASONS = new Set(['done', 'blocked', 'handoff', 'stopped', 'stale']);

function usage(exitCode = 1) {
  const output = exitCode === 0 ? console.log : console.error;
  output(`Usage:
  node scripts/taskflow-agent-state.mjs claim <taskfile>
  node scripts/taskflow-agent-state.mjs clear <taskfile> [--reason <done|blocked|handoff|stopped>]
  node scripts/taskflow-agent-state.mjs clear-stale [--dry-run] [--max-hours <hours>]`);
  process.exit(exitCode);
}

const [, , action, taskfileArg, ...restArgs] = process.argv;
if (action === '--help' || action === '-h') {
  usage(0);
}

if (action === 'clear-stale') {
  const options = parseClearStaleOptions([taskfileArg, ...restArgs].filter(Boolean));
  await clearStaleActiveAgentClaims(options);
  process.exit(0);
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
const frontmatterLines = match[1].split('\n');
const frontmatterValues = parseFrontmatterValues(match[1]);
const livePatch = action === 'claim' ? claimPatch(now) : clearPatch(now);
const activityEntry =
  action === 'claim'
    ? buildStartEntry(livePatch)
    : buildStopEntry(frontmatterValues, now, parseClearOptions(restArgs).reason);

const nextFrontmatter = upsertFrontmatter(frontmatterLines, livePatch);
const nextBody = appendAgentActivityEntry(content.slice(match[0].length), activityEntry);
const nextContent = `---\n${nextFrontmatter.join('\n')}\n---\n${nextBody}`;

await fs.writeFile(taskfilePath, nextContent, 'utf8');
console.log(`${action === 'claim' ? 'Geclaimd' : 'Gewist'}: ${path.relative(process.cwd(), taskfilePath)}`);

function parseClearStaleOptions(args) {
  const options = {
    dryRun: false,
    maxHours: DEFAULT_STALE_MAX_HOURS,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--max-hours') {
      const value = Number(args[index + 1]);
      if (!Number.isFinite(value) || value <= 0) {
        console.error(`Ongeldige --max-hours waarde: ${String(args[index + 1] ?? '')}`);
        process.exit(1);
      }
      options.maxHours = value;
      index += 1;
      continue;
    }

    console.error(`Onbekende optie voor clear-stale: ${arg}`);
    usage(1);
  }

  return options;
}

function parseClearOptions(args) {
  const options = {
    reason: 'stopped',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--reason') {
      const reason = String(args[index + 1] ?? '').trim();
      if (!CLEAR_REASONS.has(reason) || reason === 'stale') {
        console.error(`Ongeldige --reason waarde: ${reason}`);
        usage(1);
      }
      options.reason = reason;
      index += 1;
      continue;
    }

    console.error(`Onbekende optie voor clear: ${arg}`);
    usage(1);
  }

  return options;
}

async function clearStaleActiveAgentClaims({ dryRun, maxHours }) {
  const now = new Date();
  const staleTaskfiles = [];
  const taskfiles = await collectTaskfiles(process.cwd());

  for (const taskfilePath of taskfiles) {
    const content = await fs.readFile(taskfilePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!frontmatterMatch) {
      continue;
    }

    const values = parseFrontmatterValues(frontmatterMatch[1]);
    if (!isStaleActiveAgentClaim(values, now, maxHours)) {
      continue;
    }

    staleTaskfiles.push({ taskfilePath, content, frontmatterMatch, values });
  }

  if (staleTaskfiles.length === 0) {
    console.log('Geen verlopen active-agent claims gevonden.');
    return;
  }

  if (dryRun) {
    console.log('Verlopen active-agent claims:');
    for (const { taskfilePath } of staleTaskfiles) {
      console.log(`- ${path.relative(process.cwd(), taskfilePath)}`);
    }
    return;
  }

  for (const { taskfilePath, content, frontmatterMatch, values } of staleTaskfiles) {
    const patch = clearPatch(now);
    const nextFrontmatter = upsertFrontmatter(frontmatterMatch[1].split('\n'), patch);
    const nextBody = appendAgentActivityEntry(content.slice(frontmatterMatch[0].length), buildStopEntry(values, now, 'stale'));
    const nextContent = `---\n${nextFrontmatter.join('\n')}\n---\n${nextBody}`;
    await fs.writeFile(taskfilePath, nextContent, 'utf8');
    console.log(`Gewist: ${path.relative(process.cwd(), taskfilePath)}`);
  }
}

async function collectTaskfiles(rootDir) {
  const results = [];
  for (const taskflowDir of TASKFLOW_DIRS) {
    const fullDir = path.join(rootDir, taskflowDir);
    await collectMarkdownFiles(fullDir, results);
  }
  return results;
}

async function collectMarkdownFiles(directory, results) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectMarkdownFiles(fullPath, results);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
}

function parseFrontmatterValues(frontmatter) {
  const values = {};
  for (const line of frontmatter.split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex < 0) {
      continue;
    }
    values[line.slice(0, separatorIndex).trim()] = normalizeYamlScalar(line.slice(separatorIndex + 1));
  }
  return values;
}

function normalizeYamlScalar(value) {
  const normalized = String(value ?? '').trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    return normalized.slice(1, -1);
  }
  return normalized;
}

function isStaleActiveAgentClaim(values, now, maxHours) {
  const activeStatus = String(values.active_agent_status ?? '').trim().toLowerCase();
  if (!ACTIVE_AGENT_STATUS_VALUES.has(activeStatus)) {
    return false;
  }

  const since = values.active_agent_since;
  const sinceMs = new Date(since).getTime();
  if (!since || String(since).toLowerCase() === 'null' || Number.isNaN(sinceMs)) {
    return true;
  }

  return now.getTime() - sinceMs > maxHours * 60 * 60 * 1000;
}

function clearPatch(now) {
  return {
    active_agent: 'null',
    active_agent_model: 'null',
    active_agent_runtime: 'null',
    active_agent_since: 'null',
    active_agent_status: 'null',
    active_agent_settings: 'null',
    updated_at: now.toISOString().slice(0, 10),
  };
}

function claimPatch(now) {
  return {
    active_agent: cleanEnv('BUDIO_WORKSPACE_AGENT_NAME', 'Codex'),
    active_agent_model: cleanEnv('BUDIO_WORKSPACE_AGENT_MODEL', process.env.CODEX_MODEL ?? 'gpt-5'),
    active_agent_runtime: cleanEnv('BUDIO_WORKSPACE_AGENT_RUNTIME', 'codex'),
    active_agent_since: quoteYamlString(now.toISOString()),
    active_agent_status: 'running',
    active_agent_settings: cleanEnv('BUDIO_WORKSPACE_AGENT_SETTINGS', 'default'),
    updated_at: now.toISOString().slice(0, 10),
  };
}

function buildStartEntry(patch) {
  return `- start ${normalizeYamlScalar(patch.active_agent_since)} - ${normalizeYamlScalar(patch.active_agent)} / ${normalizeYamlScalar(
    patch.active_agent_model,
  )} / ${normalizeYamlScalar(patch.active_agent_runtime)} / ${normalizeYamlScalar(patch.active_agent_settings)}`;
}

function buildStopEntry(values, now, reason) {
  const startedAt = nonNullValue(values.active_agent_since) ?? 'unknown';
  const stoppedAt = now.toISOString();
  const agent = nonNullValue(values.active_agent) ?? 'unknown';
  const model = nonNullValue(values.active_agent_model) ?? 'unknown';
  const runtime = nonNullValue(values.active_agent_runtime) ?? 'unknown';
  const settings = nonNullValue(values.active_agent_settings) ?? 'unknown';
  return `- stop ${startedAt} -> ${stoppedAt} - ${agent} / ${model} / ${runtime} / ${settings} - reason: ${reason}`;
}

function nonNullValue(value) {
  const normalized = normalizeYamlScalar(value);
  if (!normalized || normalized.toLowerCase() === 'null') {
    return null;
  }
  return normalized;
}

function appendAgentActivityEntry(body, entry) {
  const lines = body.split('\n');
  const headingIndex = lines.findIndex((line) => line.trim().toLowerCase() === '## agent activity');
  if (headingIndex < 0) {
    const prefix = lines.length > 0 && lines[lines.length - 1].trim() !== '' ? ['', ''] : [''];
    return [...lines, ...prefix, '## Agent activity', '', entry].join('\n');
  }

  let endIndex = lines.length;
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    if (lines[index].startsWith('## ')) {
      endIndex = index;
      break;
    }
  }

  const placeholderIndex = lines.findIndex(
    (line, index) => index > headingIndex && index < endIndex && line.trim() === '- Geen actieve agent.',
  );
  if (placeholderIndex >= 0) {
    lines.splice(placeholderIndex, 1, entry);
    return lines.join('\n');
  }

  const needsLeadingBlank = endIndex > 0 && lines[endIndex - 1]?.trim() !== '';
  lines.splice(endIndex, 0, ...(needsLeadingBlank ? ['', entry] : [entry]));
  return lines.join('\n');
}

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
