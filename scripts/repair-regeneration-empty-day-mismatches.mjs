#!/usr/bin/env node

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
const argSet = new Set(args);
const apply = argSet.has('--apply');
const confirm = argSet.has('--confirm-production-repair');
const jsonOnly = argSet.has('--json');
const caseDate = readArg('--case-date') ?? '2026-03-21';
const caseEntryId = readArg('--case-entry-id') ?? '8a735a46-6014-4382-8fc9-0a5a541f8de8';

loadDotEnvLocal();

function readArg(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? null : null;
}

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    return;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
    if (!match) continue;
    const key = match[1];
    if (process.env[key]) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function readEnv(name) {
  const value = process.env[name]?.trim() ?? '';
  return value.length > 0 ? value : null;
}

function resolveSupabaseUrl() {
  return (
    readEnv('SUPABASE_URL') ??
    readEnv('EXPO_PUBLIC_SUPABASE_CLOUD_URL') ??
    readEnv('EXPO_PUBLIC_SUPABASE_URL')
  );
}

function resolveServiceRoleKey() {
  return readEnv('SUPABASE_SERVICE_ROLE_KEY') ?? readEnv('APP_SUPABASE_SERVICE_ROLE_KEY');
}

function requireValue(name, value) {
  if (!value) {
    throw new Error(`Missing required ${name}. Set it in env or .env.local.`);
  }
  return value;
}

const supabaseUrl = requireValue('Supabase URL', resolveSupabaseUrl());
const serviceRoleKey = requireValue('service role key', resolveServiceRoleKey());
const adminJwt = readEnv('SUPABASE_ADMIN_JWT');

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function sha12(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

function normalizeWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeForCompare(value) {
  return normalizeWhitespace(value).toLowerCase();
}

function tokenize(value) {
  return new Set(
    normalizeForCompare(value)
      .split(/[^a-z0-9À-ž]+/iu)
      .map((token) => token.trim())
      .filter((token) => token.length >= 4),
  );
}

function tokenOverlapRatio(sourceText, normalizedBody) {
  const sourceTokens = tokenize(sourceText);
  const normalizedTokens = tokenize(normalizedBody);
  if (sourceTokens.size === 0 || normalizedTokens.size === 0) return null;
  let hits = 0;
  for (const token of normalizedTokens) {
    if (sourceTokens.has(token)) hits += 1;
  }
  return hits / normalizedTokens.size;
}

function sourceTextForRaw(row) {
  return normalizeWhitespace(row.raw_text ?? row.transcript_text ?? '');
}

function toIsoDateFromAmsterdam(capturedAt) {
  const parsed = new Date(capturedAt);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(parsed);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  return year && month && day ? `${year}-${month}-${day}` : parsed.toISOString().slice(0, 10);
}

function dayKey(userId, journalDate) {
  return `${userId}:${journalDate}`;
}

function periodBounds(periodType, anchorDate) {
  const anchor = new Date(`${anchorDate}T00:00:00.000Z`);
  if (periodType === 'week') {
    const day = anchor.getUTCDay();
    const offsetToMonday = (day + 6) % 7;
    const start = new Date(anchor.getTime() - offsetToMonday * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
  }
  const start = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));
  const next = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 1));
  const end = new Date(next.getTime() - 24 * 60 * 60 * 1000);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

function readMetaNumber(meta, key) {
  if (!Object.prototype.hasOwnProperty.call(meta ?? {}, key)) {
    return null;
  }
  const value = Number(meta?.[key]);
  return Number.isFinite(value) ? value : null;
}

async function selectAll(table, select, configure = (query) => query) {
  const pageSize = 1000;
  let from = 0;
  const output = [];
  while (true) {
    const query = configure(adminClient.from(table).select(select).range(from, from + pageSize - 1));
    const { data, error } = await query;
    if (error) throw error;
    output.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
    from += pageSize;
  }
  return output;
}

function buildNormalizedIssues(raw, normalized, expectedEntryBinding) {
  const sourceText = sourceTextForRaw(raw);
  const body = normalizeWhitespace(normalized?.body ?? '');
  const title = normalizeWhitespace(normalized?.title ?? '');
  const reasons = [];
  if (!normalized) return ['missing_normalized'];
  if (!title) reasons.push('empty_title');
  if (!body) reasons.push('empty_body');
  if (!sourceText) reasons.push('empty_raw_source');
  if (sourceText.length >= 120 && body && body.length / sourceText.length < 0.18) {
    reasons.push('normalized_body_too_short_for_raw');
  }
  if (sourceText.length >= 80 && body.length >= 30) {
    const overlap = tokenOverlapRatio(sourceText, body);
    if (overlap !== null && overlap < 0.12) reasons.push('normalized_body_low_source_overlap');
  }
  const meta = normalized?.generation_meta ?? {};
  if (expectedEntryBinding?.promptVersion && meta.prompt_version !== expectedEntryBinding.promptVersion) {
    reasons.push('outdated_prompt_version');
  }
  if (expectedEntryBinding?.model && meta.model !== expectedEntryBinding.model) {
    reasons.push('outdated_model');
  }
  return [...new Set(reasons)];
}

async function loadAiqsBindings() {
  const bindingKeys = [
    'entry_normalization.primary',
    'day_journal.primary',
    'day_journal.repair',
    'week_reflection.primary',
    'month_reflection.primary',
  ];
  const tasks = await selectAll(
    'ai_tasks',
    'id, key, runtime_binding_key, runtime_family, is_active',
    (query) => query.in('runtime_binding_key', bindingKeys),
  );
  const versions = tasks.length > 0
    ? await selectAll(
        'ai_task_versions',
        'id, task_id, version_number, status, model, config_json',
        (query) => query.in('task_id', tasks.map((task) => task.id)).eq('status', 'live'),
      )
    : [];
  const versionByTask = new Map(versions.map((version) => [version.task_id, version]));
  return bindingKeys.map((bindingKey) => {
    const task = tasks.find((item) => item.runtime_binding_key === bindingKey);
    const version = task ? versionByTask.get(task.id) : null;
    return {
      bindingKey,
      present: Boolean(task),
      liveVersionPresent: Boolean(version),
      taskKey: task?.key ?? null,
      runtimeFamily: task?.runtime_family ?? null,
      versionId: version?.id ?? null,
      versionNumber: version?.version_number ?? null,
      model: version?.model ?? null,
      promptVersion: version?.config_json?.prompt_version ?? (version ? `${task?.key}:v${version.version_number}` : null),
    };
  });
}

function inspectDay({ userId, journalDate, rawRows, normalizedRows, dayJournals, reflections, bindings }) {
  const rawForDay = rawRows
    .filter((row) => row.user_id === userId)
    .filter((row) => (row.journal_date ?? toIsoDateFromAmsterdam(row.captured_at)) === journalDate)
    .sort((a, b) => new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime());
  const normalizedByRaw = new Map(normalizedRows.map((row) => [row.raw_entry_id, row]));
  const entryBinding = bindings.find((binding) => binding.bindingKey === 'entry_normalization.primary');
  const entries = rawForDay.map((row) => {
    const normalized = normalizedByRaw.get(row.id) ?? null;
    const sourceText = sourceTextForRaw(row);
    const body = normalizeWhitespace(normalized?.body ?? '');
    return {
      rawEntryId: row.id,
      normalizedEntryId: normalized?.id ?? null,
      capturedAt: row.captured_at,
      storedJournalDate: row.journal_date,
      derivedJournalDate: row.journal_date ?? toIsoDateFromAmsterdam(row.captured_at),
      sourceType: row.source_type,
      rawBodyLength: sourceText.length,
      rawSourceHash: sha12(sourceText),
      normalizedTitleLength: normalizeWhitespace(normalized?.title ?? '').length,
      normalizedBodyLength: body.length,
      normalizedBodyHash: sha12(body),
      promptVersion: normalized?.generation_meta?.prompt_version ?? null,
      model: normalized?.generation_meta?.model ?? null,
      issueReasons: buildNormalizedIssues(row, normalized, entryBinding),
    };
  });
  const dayJournal = dayJournals.find((row) => row.user_id === userId && row.journal_date === journalDate) ?? null;
  const week = periodBounds('week', journalDate);
  const month = periodBounds('month', journalDate);
  const relatedReflections = reflections.filter((row) =>
    row.user_id === userId &&
    ((row.period_type === 'week' && row.period_start === week.start && row.period_end === week.end) ||
      (row.period_type === 'month' && row.period_start === month.start && row.period_end === month.end))
  );
  return {
    userId,
    journalDate,
    counts: {
      uiEquivalentRawCount: entries.length,
      normalizedCount: entries.filter((entry) => entry.normalizedEntryId).length,
      promptInputEntryCount: entries.filter((entry) => entry.normalizedBodyLength > 0).length,
    },
    issueReasons: [...new Set(entries.flatMap((entry) => entry.issueReasons))],
    entries,
    dayJournal: dayJournal
      ? {
	          id: dayJournal.id,
	          summaryLength: normalizeWhitespace(dayJournal.summary ?? '').length,
	          narrativeLength: normalizeWhitespace(dayJournal.narrative_text ?? '').length,
	          promptEntryCount: readMetaNumber(dayJournal.generation_meta, 'prompt_entry_count'),
	          sourceEntryCount: readMetaNumber(dayJournal.generation_meta, 'source_entry_count'),
	          updatedAt: dayJournal.updated_at,
          claimsEmpty: claimsEmptyDay(dayJournal),
          generationMetaKeys: Object.keys(dayJournal.generation_meta ?? {}).sort(),
        }
      : null,
    reflections: relatedReflections.map((row) => ({
      id: row.id,
      periodType: row.period_type,
      periodStart: row.period_start,
      periodEnd: row.period_end,
      generatedAt: row.generated_at,
      summaryLength: normalizeWhitespace(row.summary_text ?? '').length,
      narrativeLength: normalizeWhitespace(row.narrative_text ?? '').length,
    })),
  };
}

function claimsEmptyDay(journal) {
  const text = `${journal.summary ?? ''}\n${journal.narrative_text ?? ''}`.toLowerCase();
  return (
    text.includes('geen losse entries') ||
    text.includes('geen entries') ||
    text.includes('geen momenten') ||
    text.includes('geen notities')
  );
}

async function runAudit() {
  const [rawRows, normalizedRows, dayJournals, reflections, bindings] = await Promise.all([
    selectAll('entries_raw', 'id, user_id, source_type, raw_text, transcript_text, captured_at, journal_date', (query) =>
      query.order('captured_at', { ascending: true }),
    ),
    selectAll('entries_normalized', 'id, raw_entry_id, user_id, title, body, summary_short, generation_meta, created_at, updated_at'),
    selectAll('day_journals', 'id, user_id, journal_date, summary, narrative_text, sections, updated_at, generation_meta'),
    selectAll('period_reflections', 'id, user_id, period_type, period_start, period_end, summary_text, narrative_text, generated_at, generation_meta'),
    loadAiqsBindings(),
  ]);

  const rawCounts = new Map();
  for (const row of rawRows) {
    const journalDate = row.journal_date ?? toIsoDateFromAmsterdam(row.captured_at);
    if (!journalDate) continue;
    const key = dayKey(row.user_id, journalDate);
    const current = rawCounts.get(key) ?? {
      user_id: row.user_id,
      journal_date: journalDate,
      raw_count: 0,
      raw_ids: [],
    };
    current.raw_count += 1;
    current.raw_ids.push(row.id);
    rawCounts.set(key, current);
  }

  const normalizedByRaw = new Map(normalizedRows.map((row) => [row.raw_entry_id, row]));
  const entryBinding = bindings.find((binding) => binding.bindingKey === 'entry_normalization.primary');
  const entryRepairCandidates = rawRows
    .map((row) => {
      const normalized = normalizedByRaw.get(row.id) ?? null;
      const reasons = buildNormalizedIssues(row, normalized, entryBinding).filter((reason) => reason !== 'empty_raw_source');
      if (reasons.length === 0) return null;
      return {
        rawEntryId: row.id,
        normalizedEntryId: normalized?.id ?? null,
        userId: row.user_id,
        journalDate: row.journal_date ?? toIsoDateFromAmsterdam(row.captured_at),
        capturedAt: row.captured_at,
        reasonCodes: reasons,
      };
    })
    .filter(Boolean);

  const dayRepairCandidates = [];
  for (const journal of dayJournals) {
    const raw = rawCounts.get(dayKey(journal.user_id, journal.journal_date));
    const hasPromptCountMeta = Object.prototype.hasOwnProperty.call(journal.generation_meta ?? {}, 'prompt_entry_count');
    const promptCount = hasPromptCountMeta ? Number(journal.generation_meta?.prompt_entry_count ?? 0) : null;
    const emptyClaim = claimsEmptyDay(journal);
    if (raw?.raw_count > 0 && (emptyClaim || promptCount === 0)) {
      dayRepairCandidates.push({
        reason: emptyClaim ? 'empty_day_claim_with_raw_entries' : 'prompt_count_zero_with_raw_entries',
        dayJournalId: journal.id,
        userId: journal.user_id,
        journalDate: journal.journal_date,
        rawCount: raw.raw_count,
        rawIds: raw.raw_ids,
        promptEntryCount: promptCount,
        updatedAt: journal.updated_at,
      });
    }
  }

  const staleReflections = [];
  for (const reflection of reflections) {
    const dependentDays = dayJournals.filter((journal) =>
      journal.user_id === reflection.user_id &&
      journal.journal_date >= reflection.period_start &&
      journal.journal_date <= reflection.period_end
    );
    const newestDay = dependentDays
      .map((journal) => journal.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1);
    if (newestDay && reflection.generated_at && newestDay > reflection.generated_at) {
      staleReflections.push({
        reflectionId: reflection.id,
        userId: reflection.user_id,
        periodType: reflection.period_type,
        periodStart: reflection.period_start,
        periodEnd: reflection.period_end,
        generatedAt: reflection.generated_at,
        newestDayUpdatedAt: newestDay,
      });
    }
  }

  const caseUsers = new Set(rawRows
    .filter((row) => (row.journal_date ?? toIsoDateFromAmsterdam(row.captured_at)) === caseDate)
    .map((row) => row.user_id));
  const targetNormalized = normalizedRows.find((row) => row.id === caseEntryId);
  if (targetNormalized) {
    caseUsers.add(targetNormalized.user_id);
  }
  const caseInspections = [...caseUsers].map((userId) =>
    inspectDay({ userId, journalDate: caseDate, rawRows, normalizedRows, dayJournals, reflections, bindings })
  );

  return {
    mode: apply ? 'apply' : 'dry-run',
    dryRun: !apply,
    target: {
      urlHost: new URL(supabaseUrl).host,
      productionLike: !supabaseUrl.includes('127.0.0.1') && !supabaseUrl.includes('localhost'),
    },
    totals: {
      rawEntries: rawRows.length,
      normalizedEntries: normalizedRows.length,
      dayJournals: dayJournals.length,
      reflections: reflections.length,
    },
    aiqsBindings: bindings,
    candidateCounts: {
      entryRepair: entryRepairCandidates.length,
      dayRepair: dayRepairCandidates.length,
      staleReflections: staleReflections.length,
      dayJournalsMissingPromptMeta: dayJournals.filter((journal) =>
        rawCounts.has(dayKey(journal.user_id, journal.journal_date)) &&
        !Object.prototype.hasOwnProperty.call(journal.generation_meta ?? {}, 'prompt_entry_count')
      ).length,
    },
    case: {
      date: caseDate,
      entryId: caseEntryId,
      targetEntryFound: Boolean(targetNormalized),
      inspectedUserCount: caseInspections.length,
      inspections: caseInspections,
    },
    entryRepairCandidates: entryRepairCandidates.slice(0, 200),
    dayRepairCandidates,
    staleReflections: staleReflections.slice(0, 200),
  };
}

async function startRegenerationApply() {
  if (!adminJwt) {
    throw new Error('SUPABASE_ADMIN_JWT is required for --apply so the normal admin auth/capability path is used.');
  }
  if (!confirm) {
    throw new Error('--apply requires --confirm-production-repair.');
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/admin-regeneration-job`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminJwt}`,
      apikey: serviceRoleKey,
      'Content-Type': 'application/json',
      'x-flow-id': `repair-regeneration-${Date.now()}`,
    },
    body: JSON.stringify({
      action: 'start',
      selectedTypes: ['entries_normalized', 'day_journals', 'week_reflections', 'month_reflections'],
    }),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Failed to start regeneration job: HTTP ${response.status}`);
  }
  return body;
}

const audit = await runAudit();
if (!jsonOnly) {
  console.error(`Regeneration production audit (${audit.mode}) on ${audit.target.urlHost}`);
  console.error(`Candidates: entries=${audit.candidateCounts.entryRepair}, days=${audit.candidateCounts.dayRepair}, staleReflections=${audit.candidateCounts.staleReflections}`);
}
console.log(JSON.stringify(audit, null, 2));

if (apply) {
  const result = await startRegenerationApply();
  console.log(JSON.stringify({
    mode: 'apply',
    startedJobId: result?.job?.id ?? null,
    selectedTypes: result?.job?.selected_types ?? null,
  }, null, 2));
}
