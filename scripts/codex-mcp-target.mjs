#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, '.codex', 'config.toml');

const args = process.argv.slice(2);
const target = args[0];

function readFlag(name) {
  const idx = args.indexOf(name);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}

function printHelp() {
  console.log(`Usage:
  node scripts/codex-mcp-target.mjs local
  node scripts/codex-mcp-target.mjs remote-ro --project-ref <project_ref>

Notes:
  - local      -> enables [mcp_servers.supabase_local], disables remote
  - remote-ro  -> enables [mcp_servers.supabase_remote_ro], disables local
  - --project-ref is required when switching to remote-ro if placeholder is still present
`);
}

if (!target || target === '--help' || target === '-h') {
  printHelp();
  process.exit(target ? 0 : 1);
}

if (!['local', 'remote-ro'].includes(target)) {
  console.error(`Unknown target: ${target}`);
  printHelp();
  process.exit(1);
}

if (!fs.existsSync(CONFIG_PATH)) {
  console.error(`Missing config: ${CONFIG_PATH}`);
  process.exit(1);
}

let content = fs.readFileSync(CONFIG_PATH, 'utf8');

const projectRefArg = readFlag('--project-ref') || process.env.SUPABASE_PROJECT_REF || null;
if (target === 'remote-ro') {
  if (projectRefArg) {
    content = content.replace(/project_ref=([^&"]+)/, `project_ref=${projectRefArg}`);
  } else if (content.includes('__SET_SUPABASE_PROJECT_REF__')) {
    console.error('Remote read-only target requires a Supabase project ref.');
    console.error('Provide --project-ref <project_ref> (or SUPABASE_PROJECT_REF env var).');
    process.exit(1);
  }
}

function setServerEnabled(toml, serverName, enabled) {
  const pattern = new RegExp(
    String.raw`(\[mcp_servers\.${serverName}\][\s\S]*?)(?:\n\[mcp_servers\.|\n\[projects\.|\n$)`,
    'm'
  );
  const match = toml.match(pattern);
  if (!match) {
    throw new Error(`Server block not found: ${serverName}`);
  }

  const block = match[1];
  let updatedBlock;
  if (/^enabled\s*=\s*(true|false)\s*$/m.test(block)) {
    updatedBlock = block.replace(/^enabled\s*=\s*(true|false)\s*$/m, `enabled = ${enabled}`);
  } else {
    updatedBlock = `${block.trimEnd()}\nenabled = ${enabled}\n`;
  }

  return toml.replace(block, updatedBlock);
}

try {
  if (target === 'local') {
    content = setServerEnabled(content, 'supabase_local', 'true');
    content = setServerEnabled(content, 'supabase_remote_ro', 'false');
  } else {
    content = setServerEnabled(content, 'supabase_local', 'false');
    content = setServerEnabled(content, 'supabase_remote_ro', 'true');
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

fs.writeFileSync(CONFIG_PATH, content);
console.log(`Codex MCP target switched to: ${target}`);
