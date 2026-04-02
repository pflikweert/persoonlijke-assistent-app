#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function unquote(value) {
  const trimmed = String(value ?? "").trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function getSupabaseEnv() {
  const raw = execSync("npx supabase status -o env", { encoding: "utf8" });
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    env[match[1]] = unquote(match[2]);
  }
  return env;
}

async function query(apiUrl, serviceRoleKey, table, params = {}) {
  const url = new URL(`${apiUrl}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`${table} ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

function esc(value) {
  if (value == null) return "";
  return String(value).replace(/\r\n/g, "\n");
}

function textFence(value) {
  return `\n\n\`\`\`text\n${esc(value)}\n\`\`\`\n`;
}

function parseArg(name) {
  const prefix = `--${name}=`;
  const exact = process.argv.find((arg) => arg.startsWith(prefix));
  return exact ? exact.slice(prefix.length) : "";
}

const day = parseArg("day");
const userId = parseArg("user");
const outputArg = parseArg("out");

if (!day) {
  console.error("Gebruik: node scripts/export-day-quality-dump.mjs --day=YYYY-MM-DD [--user=<uuid>] [--out=<path>]");
  process.exit(1);
}

const dayStart = `${day}T00:00:00.000Z`;
const dayEnd = new Date(`${dayStart}`);
dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
const dayEndIso = dayEnd.toISOString();

const env = getSupabaseEnv();
const apiUrl = env.API_URL;
const serviceRoleKey = env.SERVICE_ROLE_KEY;
if (!apiUrl || !serviceRoleKey) {
  throw new Error("Kon API_URL/SERVICE_ROLE_KEY niet lezen uit `npx supabase status -o env`");
}

const rawFilters = {
  select: "id,user_id,source_type,raw_text,transcript_text,captured_at,created_at",
  captured_at: `gte.${dayStart}`,
  and: `(captured_at.lt.${dayEndIso})`,
  order: "user_id.asc,captured_at.asc,created_at.asc",
};
if (userId) rawFilters.user_id = `eq.${userId}`;

const rawRows = await query(apiUrl, serviceRoleKey, "entries_raw", rawFilters);

const rawIds = rawRows.map((row) => row.id);
let normalizedRows = [];
for (let index = 0; index < rawIds.length; index += 50) {
  const chunk = rawIds.slice(index, index + 50);
  if (!chunk.length) continue;
  const inValues = chunk.map((id) => `"${id}"`).join(",");
  const rows = await query(apiUrl, serviceRoleKey, "entries_normalized", {
    select: "id,raw_entry_id,user_id,title,summary_short,body,created_at",
    raw_entry_id: `in.(${inValues})`,
    order: "created_at.asc",
  });
  normalizedRows.push(...rows);
}

const users = userId ? [userId] : [...new Set(rawRows.map((row) => row.user_id))];
let dayJournalRows = [];
for (let index = 0; index < users.length; index += 50) {
  const chunk = users.slice(index, index + 50);
  if (!chunk.length) continue;
  const inValues = chunk.map((id) => `"${id}"`).join(",");
  const params = {
    select: "id,user_id,journal_date,summary,narrative_text,sections,updated_at",
    journal_date: `eq.${day}`,
    order: "updated_at.desc",
  };
  if (userId) {
    params.user_id = `eq.${userId}`;
  } else {
    params.user_id = `in.(${inValues})`;
  }
  const rows = await query(apiUrl, serviceRoleKey, "day_journals", params);
  dayJournalRows.push(...rows);
}

const normalizedByRawId = new Map(normalizedRows.map((row) => [row.raw_entry_id, row]));
const rawByUser = new Map();
for (const row of rawRows) {
  const current = rawByUser.get(row.user_id) ?? [];
  current.push(row);
  rawByUser.set(row.user_id, current);
}
const journalsByUser = new Map();
for (const row of dayJournalRows) {
  const current = journalsByUser.get(row.user_id) ?? [];
  current.push(row);
  journalsByUser.set(row.user_id, current);
}

const renderUsers = userId
  ? [userId]
  : [...new Set([...rawByUser.keys(), ...journalsByUser.keys()])].sort();

let md = "";
md += `# Day Data Dump - ${day}${userId ? " (User Focus)" : ""}\n\n`;
if (userId) md += `- user_id: \`${userId}\`\n`;
md += `- gegenereerd op: \`${new Date().toISOString()}\`\n\n`;
md += `Totaal entries_raw: ${rawRows.length}\n`;
md += `Totaal entries_normalized: ${normalizedRows.length}\n`;
md += `Totaal day_journals: ${dayJournalRows.length}\n\n`;

for (const currentUserId of renderUsers) {
  const userRaw = (rawByUser.get(currentUserId) ?? []).sort(
    (a, b) => new Date(a.captured_at) - new Date(b.captured_at),
  );
  const userJournals = journalsByUser.get(currentUserId) ?? [];

  md += `## User ${currentUserId}\n\n`;
  md += `### Losse entries (${userRaw.length})\n\n`;

  for (const [index, raw] of userRaw.entries()) {
    const normalized = normalizedByRawId.get(raw.id);
    const sourceText = raw.transcript_text || raw.raw_text || "";

    md += `#### Entry ${index + 1}\n`;
    md += `- raw_entry_id: \`${raw.id}\`\n`;
    md += `- captured_at: \`${raw.captured_at}\`\n`;
    md += `- source_type: \`${raw.source_type}\`\n`;
    md += `- raw_created_at: \`${raw.created_at}\`\n`;
    md += `- raw_text:${textFence(raw.raw_text)}`;
    md += `- transcript_text:${textFence(raw.transcript_text)}`;
    md += `- source_text_used:${textFence(sourceText)}`;
    if (normalized) {
      md += `- normalized.id: \`${normalized.id}\`\n`;
      md += `- normalized.created_at: \`${normalized.created_at}\`\n`;
      md += `- normalized.title: ${normalized.title ? `\`${esc(normalized.title)}\`` : "_leeg_"}\n`;
      md += `- normalized.summary_short: ${normalized.summary_short ? `\`${esc(normalized.summary_short)}\`` : "_leeg_"}\n`;
      md += `- normalized.body:${textFence(normalized.body)}`;
    } else {
      md += "- normalized: _niet gevonden_\n\n";
    }
    md += "\n";
  }

  md += `### Day journal (${userJournals.length})\n\n`;
  if (!userJournals.length) {
    md += "_Geen day_journal gevonden._\n\n";
    continue;
  }

  for (const [index, journal] of userJournals.entries()) {
    md += `#### Day journal ${index + 1}\n`;
    md += `- id: \`${journal.id}\`\n`;
    md += `- journal_date: \`${journal.journal_date}\`\n`;
    md += `- updated_at: \`${journal.updated_at}\`\n`;
    md += `- summary:${textFence(journal.summary)}`;
    md += `- narrative_text:${textFence(journal.narrative_text)}`;
    md += `- sections (JSON):\n\n\`\`\`json\n${JSON.stringify(journal.sections ?? null, null, 2)}\n\`\`\`\n\n`;
  }
}

const defaultName = userId
  ? `day-${day}-quality-dump-user-${userId.slice(0, 8)}.md`
  : `day-${day}-quality-dump.md`;
const outPath = path.resolve(outputArg || `docs/dev/${defaultName}`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md, "utf8");
console.log(`Wrote ${outPath}`);
