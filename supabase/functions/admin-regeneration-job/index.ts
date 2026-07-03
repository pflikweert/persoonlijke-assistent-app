import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { hasCapabilityAccess, loadAdminAccessContext } from '../_shared/admin-capabilities.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildAiqsEntryCleanupUserPrompt, buildAiqsJsonUserPrompt, loadLiveAiRuntimeBinding, type LiveAiRuntimeBinding } from '../_shared/aiqs-runtime.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import {
  finalizeDayJournalDraftStrict,
  isLowContentDayEntry,
  orderDayJournalEntries,
} from '../_shared/day-journal-contract.mjs';
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildDayCandidatesFromSources, buildEntryRepairCandidates, buildRegenerationScopePlan, computeMonthBoundsForDate, computeWeekBoundsForDate, deriveJournalDateForLegacyRaw, loadDayEntrySource, type DayCandidate, type EntryRepairCandidate, type NormalizedEntrySourceRow, type PeriodCandidate, type RawEntrySourceRow, type RegenerationScopeSelection } from '../_shared/day-entry-source.ts';

type StepType = 'entries_normalized' | 'day_journals' | 'week_reflections' | 'month_reflections';
type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
type RegenerationRunMode = 'repair' | 'all';

type Action = 'start' | 'preview' | 'status' | 'worker_tick' | 'access' | 'latest' | 'inspect_day';

type StartBody = {
  action: 'start';
  selectedTypes?: unknown;
  mode?: unknown;
  scope?: unknown;
  targetUserIds?: unknown;
};

type PreviewBody = {
  action: 'preview';
  selectedTypes?: unknown;
  mode?: unknown;
  scope?: unknown;
  targetUserIds?: unknown;
};

type StatusBody = {
  action: 'status';
  jobId?: unknown;
};

type WorkerBody = {
  action: 'worker_tick';
  jobId?: unknown;
};

type AccessBody = {
  action: 'access';
};

type LatestBody = {
  action: 'latest';
};

type InspectDayBody = {
  action: 'inspect_day';
  userId?: unknown;
  journalDate?: unknown;
};

type RequestBody = StartBody | PreviewBody | StatusBody | WorkerBody | AccessBody | LatestBody | InspectDayBody;

type OpenAiBatchStatus =
  | 'validating'
  | 'failed'
  | 'in_progress'
  | 'finalizing'
  | 'completed'
  | 'expired'
  | 'cancelling'
  | 'cancelled';

type OpenAiBatchObject = {
  id: string;
  status: OpenAiBatchStatus;
  input_file_id?: string | null;
  output_file_id?: string | null;
  error_file_id?: string | null;
  request_counts?: {
    total?: number;
    completed?: number;
    failed?: number;
  };
};

type BatchRequestEnvelope = {
  custom_id: string;
  method: 'POST';
  url: '/v1/chat/completions';
  body: Record<string, unknown>;
};

type StoredBatchRequest = {
  custom_id: string;
  step_type: StepType;
  target: Record<string, unknown>;
  estimated_prompt_tokens: number;
  prompt_version: string;
  model: string;
  body: Record<string, unknown>;
  context?: Record<string, unknown>;
};

type WorkerOutcome = {
  progressed: boolean;
  needsFollowup: boolean;
  done: boolean;
};

type ReflectionDraft = {
  summaryText: string;
  narrativeText: string;
  highlights: string[];
  reflectionPoints: string[];
};

const FLOW = 'admin-regeneration-job' as const;
const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id, x-admin-internal-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const STEP_ORDER: StepType[] = ['entries_normalized', 'day_journals', 'week_reflections', 'month_reflections'];
const STEP_CAPS: Record<StepType, number> = {
  entries_normalized: 100,
  day_journals: 40,
  week_reflections: 60,
  month_reflections: 60,
};

const MAX_ESTIMATED_PROMPT_TOKENS_PER_SUB_BATCH = 80_000;
const SUBMIT_BASE_WAIT_MS = 2000;
const SUBMIT_JITTER_MAX_MS = 1000;
const MAX_RETRIES = 6;
const BACKOFF_MAX_MS = 60_000;
const POLL_IN_PROGRESS_MS = 10_000;
const POLL_FINALIZING_MS = 5_000;
const NO_SPEECH_TRANSCRIPT = 'Geen spraak herkend in audio-opname.';
const LOW_CONTENT_TITLE = 'Audio-opname zonder spraak';

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') ?? '*';
  return {
    ...CORS_BASE_HEADERS,
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
  };
}

function jsonResponse(request: Request, status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...buildCorsHeaders(request),
      'Content-Type': 'application/json',
    },
  });
}

function errorResponse(input: {
  request: Request;
  httpStatus: number;
  requestId: string;
  flowId: string;
  step: string;
  code: FlowErrorCode;
  message: string;
  details?: Record<string, unknown>;
}) {
  return jsonResponse(
    input.request,
    input.httpStatus,
    createFlowError({
      flow: FLOW,
      requestId: input.requestId,
      flowId: input.flowId,
      step: input.step,
      code: input.code,
      message: input.message,
      ...(input.details ? { details: input.details } : {}),
    })
  );
}

function parseFlowId(request: Request, requestId: string): string {
  const flowId = request.headers.get('x-flow-id')?.trim() ?? '';
  return flowId.length > 0 ? flowId : requestId;
}

function parseString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function parseFirstString(values: unknown[]): string | null {
  for (const value of values) {
    const parsed = parseString(value);
    if (parsed) {
      return parsed;
    }
  }
  return null;
}

function parseFirstPresentString(values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string') {
      return value.trim();
    }
  }
  return null;
}

function parseDurationSeconds(raw: string | null): number | null {
  const value = raw?.trim() ?? '';
  if (!value) {
    return null;
  }

  let total = 0;
  const regex = /(\d+)(ms|h|m|s)/g;
  let match: RegExpExecArray | null = null;
  while ((match = regex.exec(value)) !== null) {
    const amount = Number(match[1]);
    if (!Number.isFinite(amount)) {
      continue;
    }
    const unit = match[2];
    if (unit === 'h') {
      total += amount * 3600;
    } else if (unit === 'm') {
      total += amount * 60;
    } else if (unit === 's') {
      total += amount;
    } else if (unit === 'ms') {
      total += Math.ceil(amount / 1000);
    }
  }

  return total > 0 ? total : null;
}

function estimatePromptTokens(value: string): number {
  return Math.max(1, Math.ceil(value.length / 4));
}

function randomJitter(max = SUBMIT_JITTER_MAX_MS): number {
  return Math.floor(Math.random() * (max + 1));
}

async function sleep(ms: number): Promise<void> {
  if (ms <= 0) {
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeForCompare(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0)
    .slice(0, 8);
}

function dedupeLines(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const value of values) {
    const key = normalizeForCompare(value);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(value);
  }
  return output;
}

function cleanReflectionNarrative(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanReflectionList(values: string[], maxItems: number, maxWords: number): string[] {
  const cleaned = values
    .map((value) => normalizeWhitespace(value))
    .filter((value) => value.length > 0)
    .filter((value) => value.split(' ').filter((token) => token.length > 0).length <= maxWords);
  return dedupeLines(cleaned).slice(0, maxItems);
}

function parseReflectionDraft(aiJson: Record<string, unknown>): ReflectionDraft | null {
  const summary = parseString(aiJson.summaryText);
  const narrativeRaw = parseString(aiJson.narrativeText);
  const highlightsRaw = parseStringArray(aiJson.highlights);
  const pointsRaw = parseStringArray(aiJson.reflectionPoints);

  if (!summary || !narrativeRaw || highlightsRaw.length < 2 || pointsRaw.length < 2) {
    return null;
  }

  const narrativeText = cleanReflectionNarrative(narrativeRaw);
  const highlights = cleanReflectionList(highlightsRaw, 6, 25);
  const reflectionPoints = cleanReflectionList(pointsRaw, 5, 30);

  if (!narrativeText || highlights.length < 2 || reflectionPoints.length < 2) {
    return null;
  }

  return {
    summaryText: normalizeWhitespace(summary),
    narrativeText,
    highlights,
    reflectionPoints,
  };
}

function parseSelectedTypes(value: unknown): StepType[] {
  if (Array.isArray(value)) {
    const parsed = value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item): item is StepType => STEP_ORDER.includes(item as StepType));
    return [...new Set(parsed)];
  }

  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    const selected = STEP_ORDER.filter((key) => candidate[key] === true);
    return selected;
  }

  return [];
}

function parseRunMode(value: unknown): RegenerationRunMode {
  return value === 'all' ? 'all' : 'repair';
}

function parseTargetUserIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return [...new Set(value.map((item) => ensureUuid(item)).filter((item): item is string => Boolean(item)))];
}

function parseScopeSelection(value: unknown): RegenerationScopeSelection {
  if (!value || typeof value !== 'object') {
    return { kind: 'all' };
  }

  const candidate = value as Record<string, unknown>;
  const kind = parseString(candidate.kind);
  if (kind === 'day') {
    const date = parseString(candidate.date);
    return date ? { kind: 'day', date } : { kind: 'all' };
  }
  if (kind === 'week' || kind === 'month') {
    const startDate = parseString(candidate.startDate);
    const endDate = parseString(candidate.endDate);
    return startDate ? { kind, startDate, endDate } : { kind: 'all' };
  }
  if (kind === 'range') {
    const startDate = parseString(candidate.startDate);
    const endDate = parseString(candidate.endDate);
    return startDate && endDate ? { kind: 'range', startDate, endDate } : { kind: 'all' };
  }

  return { kind: 'all' };
}

function parseScopeSelections(value: unknown): RegenerationScopeSelection[] {
  if (Array.isArray(value)) {
    const parsed = value.map(parseScopeSelection).filter((selection) => selection.kind !== 'all');
    return parsed.length > 0 ? parsed : [{ kind: 'all' }];
  }

  return [parseScopeSelection(value)];
}

function ensureUuid(value: unknown): string | null {
  const parsed = parseString(value);
  if (!parsed) {
    return null;
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(parsed) ? parsed : null;
}

function getServiceRoleKey(): string {
  const serviceRoleKey =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
    Deno.env.get('APP_SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
    '';

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY / APP_SUPABASE_SERVICE_ROLE_KEY.');
  }

  return serviceRoleKey;
}

function getInternalToken(): string {
  return Deno.env.get('ADMIN_REGEN_INTERNAL_TOKEN')?.trim() ?? '';
}

function getSupabaseRuntimeEnv(): { supabaseUrl: string; supabaseAnonKey: string } {
  const supabaseUrl =
    Deno.env.get('SUPABASE_URL')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_LOCAL_URL')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_CLOUD_URL')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_URL')?.trim() ??
    '';
  const supabaseAnonKey =
    Deno.env.get('SUPABASE_ANON_KEY')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY')?.trim() ??
    '';

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL / EXPO_PUBLIC_SUPABASE_*_URL for admin-regeneration-job.');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing SUPABASE_ANON_KEY / EXPO_PUBLIC_SUPABASE_*_PUBLISHABLE_KEY for admin-regeneration-job.');
  }

  return { supabaseUrl, supabaseAnonKey };
}

function getFunctionInvokeUrl(supabaseUrl: string): string {
  return `${supabaseUrl.replace(/\/$/, '')}/functions/v1/admin-regeneration-job`;
}

function buildGenerationMeta(input: {
  flow: string;
  model: string;
  promptVersion: string;
  jobId: string;
  batchId: string;
}) {
  return {
    flow: input.flow,
    model: input.model,
    prompt_version: input.promptVersion,
    generated_at: new Date().toISOString(),
    job_id: input.jobId,
    batch_id: input.batchId,
  };
}

function mapOpenAiBatchStatus(value: string): OpenAiBatchStatus {
  if (
    value === 'validating' ||
    value === 'failed' ||
    value === 'in_progress' ||
    value === 'finalizing' ||
    value === 'completed' ||
    value === 'expired' ||
    value === 'cancelling' ||
    value === 'cancelled'
  ) {
    return value;
  }

  return 'failed';
}

function mapBatchRowStatus(status: OpenAiBatchStatus):
  | 'submitted'
  | 'validating'
  | 'in_progress'
  | 'finalizing'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'cancelled' {
  if (status === 'validating') {
    return 'validating';
  }
  if (status === 'in_progress') {
    return 'in_progress';
  }
  if (status === 'finalizing') {
    return 'finalizing';
  }
  if (status === 'completed') {
    return 'completed';
  }
  if (status === 'expired') {
    return 'expired';
  }
  if (status === 'cancelled' || status === 'cancelling') {
    return 'cancelled';
  }
  return 'failed';
}

async function fetchWithRetry(args: {
  apiKey: string;
  method: 'GET' | 'POST';
  path: string;
  body?: string;
  formData?: FormData;
}): Promise<Response> {
  let retries = 0;
  let backoffMs = 2000;

  while (true) {
    const response = await fetch(`https://api.openai.com${args.path}`, {
      method: args.method,
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        ...(args.formData ? {} : { 'Content-Type': 'application/json' }),
      },
      body: args.formData ? args.formData : args.body,
    });

    if (response.ok) {
      return response;
    }

    const shouldRetry = response.status === 429 || response.status === 500 || response.status === 503;
    if (!shouldRetry || retries >= MAX_RETRIES) {
      return response;
    }

    const retryAfterHeader = parseDurationSeconds(response.headers.get('x-ratelimit-reset-requests'));
    const retryAfterTokenHeader = parseDurationSeconds(response.headers.get('x-ratelimit-reset-tokens'));
    const retryAfter = Math.max(retryAfterHeader ?? 0, retryAfterTokenHeader ?? 0);

    const waitMs = retryAfter > 0
      ? retryAfter * 1000 + randomJitter(500)
      : Math.min(BACKOFF_MAX_MS, backoffMs + randomJitter(500));

    await sleep(waitMs);

    backoffMs = Math.min(BACKOFF_MAX_MS, backoffMs * 2);
    retries += 1;
  }
}

async function uploadBatchFile(args: {
  apiKey: string;
  fileName: string;
  jsonl: string;
}): Promise<string> {
  const formData = new FormData();
  formData.append('purpose', 'batch');
  formData.append('file', new Blob([args.jsonl], { type: 'application/jsonl' }), args.fileName);

  const response = await fetchWithRetry({
    apiKey: args.apiKey,
    method: 'POST',
    path: '/v1/files',
    formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Batch file upload failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { id?: unknown };
  const fileId = parseString(data.id);
  if (!fileId) {
    throw new Error('Batch file upload returned no file id.');
  }

  return fileId;
}

async function createOpenAiBatch(args: {
  apiKey: string;
  inputFileId: string;
  metadata: Record<string, string>;
}): Promise<OpenAiBatchObject> {
  const response = await fetchWithRetry({
    apiKey: args.apiKey,
    method: 'POST',
    path: '/v1/batches',
    body: JSON.stringify({
      input_file_id: args.inputFileId,
      endpoint: '/v1/chat/completions',
      completion_window: '24h',
      metadata: args.metadata,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Batch create failed (${response.status}): ${body}`);
  }

  return (await response.json()) as OpenAiBatchObject;
}

async function retrieveOpenAiBatch(args: {
  apiKey: string;
  batchId: string;
}): Promise<OpenAiBatchObject> {
  const response = await fetchWithRetry({
    apiKey: args.apiKey,
    method: 'GET',
    path: `/v1/batches/${args.batchId}`,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Batch retrieve failed (${response.status}): ${body}`);
  }

  return (await response.json()) as OpenAiBatchObject;
}

async function downloadOpenAiFile(args: {
  apiKey: string;
  fileId: string;
}): Promise<string> {
  const response = await fetchWithRetry({
    apiKey: args.apiKey,
    method: 'GET',
    path: `/v1/files/${args.fileId}/content`,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Batch file download failed (${response.status}): ${body}`);
  }

  return response.text();
}

function parseJsonlLines<T = Record<string, unknown>>(content: string): T[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as T);
}

async function triggerWorkerTick(args: {
  supabaseUrl: string;
  anonKey: string;
  internalToken: string;
  jobId: string;
}) {
  if (!args.internalToken) {
    return;
  }

  const url = getFunctionInvokeUrl(args.supabaseUrl);
  void fetch(url, {
    method: 'POST',
    headers: {
      apikey: args.anonKey,
      'Content-Type': 'application/json',
      'x-admin-internal-token': args.internalToken,
    },
    body: JSON.stringify({
      action: 'worker_tick',
      jobId: args.jobId,
    }),
  }).catch((_error) => {
    // Fire-and-forget worker trigger.
  });
}

type DayJournalCandidateRow = DayCandidate & {
  id?: string | null;
  summary?: string | null;
  narrative_text?: string | null;
  generation_meta?: Record<string, unknown> | null;
  updated_at?: string | null;
};

type ReflectionCandidateRow = PeriodCandidate & {
  id?: string | null;
  period_type: 'week' | 'month';
  generation_meta?: Record<string, unknown> | null;
  generated_at?: string | null;
};

type CandidateMapBuildResult = {
  selectedTypes: StepType[];
  candidateMap: Map<StepType, unknown[]>;
  options: Record<string, unknown>;
  summary: Record<string, unknown>;
};

const CANDIDATE_DISCOVERY_PAGE_SIZE = 500;

async function selectPagedRows<T>(args: {
  client: any;
  table: string;
  select: string;
  order?: { column: string; ascending: boolean };
  configure?: (query: any) => any;
}): Promise<T[]> {
  const rows: T[] = [];
  let offset = 0;

  while (true) {
    let query = args.client
      .from(args.table)
      .select(args.select)
      .range(offset, offset + CANDIDATE_DISCOVERY_PAGE_SIZE - 1);

    if (args.order) {
      query = query.order(args.order.column, { ascending: args.order.ascending });
    }
    if (args.configure) {
      query = args.configure(query);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to load ${args.table} page: ${String(error.message ?? error)}`);
    }

    const page = (data ?? []) as T[];
    rows.push(...page);
    if (page.length < CANDIDATE_DISCOVERY_PAGE_SIZE) {
      break;
    }
    offset += CANDIDATE_DISCOVERY_PAGE_SIZE;
  }

  return rows;
}

function rawJournalDate(row: Pick<RawEntrySourceRow, 'captured_at' | 'journal_date'>): string | null {
  return row.journal_date ?? deriveJournalDateForLegacyRaw(row.captured_at);
}

function dayCandidateKey(candidate: DayCandidate): string {
  return `${candidate.user_id}:${candidate.journal_date}`;
}

function periodCandidateKey(candidate: PeriodCandidate): string {
  return `${candidate.user_id}:${candidate.period_start}:${candidate.period_end}`;
}

function metadataMatches(meta: Record<string, unknown> | null | undefined, binding: LiveAiRuntimeBinding): boolean {
  return parseString(meta?.prompt_version) === binding.promptVersion && parseString(meta?.model) === binding.model;
}

function journalClaimsEmpty(row: Pick<DayJournalCandidateRow, 'summary' | 'narrative_text'>): boolean {
  const text = `${row.summary ?? ''}\n${row.narrative_text ?? ''}`.toLowerCase();
  return (
    text.includes('geen losse entries') ||
    text.includes('geen entries') ||
    text.includes('geen momenten') ||
    text.includes('geen notities')
  );
}

function sortEntryCandidates(candidates: EntryRepairCandidate[]): EntryRepairCandidate[] {
  return [...candidates].sort((left, right) => new Date(left.capturedAt).getTime() - new Date(right.capturedAt).getTime());
}

function buildAllEntryCandidates(input: {
  rawRows: RawEntrySourceRow[];
  normalizedRows: NormalizedEntrySourceRow[];
}): EntryRepairCandidate[] {
  const normalizedByRawId = new Map(input.normalizedRows.map((row) => [row.raw_entry_id, row]));
  return sortEntryCandidates(input.rawRows.map((raw) => {
    const normalized = normalizedByRawId.get(raw.id) ?? null;
    return {
      rawEntryId: raw.id,
      normalizedEntryId: normalized?.id ?? null,
      userId: raw.user_id,
      capturedAt: raw.captured_at,
      journalDate: raw.journal_date,
      reasonCodes: ['force_regenerate'],
    };
  }));
}

function filterRawRowsForScope(input: {
  rawRows: RawEntrySourceRow[];
  selectedDaySet: Set<string> | null;
  targetUserSet: Set<string> | null;
}): RawEntrySourceRow[] {
  return input.rawRows.filter((row) => {
    if (input.targetUserSet && !input.targetUserSet.has(row.user_id)) {
      return false;
    }
    if (!input.selectedDaySet) {
      return true;
    }
    const journalDate = rawJournalDate(row);
    return Boolean(journalDate && input.selectedDaySet.has(journalDate));
  });
}

function filterDayCandidatesForScope(input: {
  candidates: DayCandidate[];
  selectedDaySet: Set<string> | null;
  targetUserSet: Set<string> | null;
}): DayCandidate[] {
  return input.candidates.filter((candidate) => {
    if (input.targetUserSet && !input.targetUserSet.has(candidate.user_id)) {
      return false;
    }
    return !input.selectedDaySet || input.selectedDaySet.has(candidate.journal_date);
  });
}

function filterPeriodCandidatesForScope(input: {
  candidates: PeriodCandidate[];
  selectedPeriodMap: Map<string, { startDate: string; endDate: string }> | null;
  targetUserSet: Set<string> | null;
  affectedUserSet?: Set<string> | null;
}): PeriodCandidate[] {
  return input.candidates.filter((candidate) => {
    if (input.targetUserSet && !input.targetUserSet.has(candidate.user_id)) {
      return false;
    }
    if (input.affectedUserSet && !input.affectedUserSet.has(candidate.user_id)) {
      return false;
    }
    return !input.selectedPeriodMap || input.selectedPeriodMap.has(`${candidate.period_start}:${candidate.period_end}`);
  });
}

function buildPeriodCandidatesFromDays(input: {
  dayCandidates: DayCandidate[];
  periodType: 'week' | 'month';
  existingReflections: ReflectionCandidateRow[];
}): PeriodCandidate[] {
  const byKey = new Map<string, PeriodCandidate>();

  for (const reflection of input.existingReflections) {
    if (reflection.period_type !== input.periodType) {
      continue;
    }
    byKey.set(periodCandidateKey(reflection), {
      user_id: reflection.user_id,
      period_start: reflection.period_start,
      period_end: reflection.period_end,
    });
  }

  for (const day of input.dayCandidates) {
    const bounds = input.periodType === 'week'
      ? computeWeekBoundsForDate(day.journal_date)
      : computeMonthBoundsForDate(day.journal_date);
    if (!bounds) {
      continue;
    }
    const candidate = {
      user_id: day.user_id,
      period_start: bounds.startDate,
      period_end: bounds.endDate,
    };
    byKey.set(periodCandidateKey(candidate), candidate);
  }

  return [...byKey.values()].sort((left, right) =>
    left.user_id === right.user_id
      ? left.period_start.localeCompare(right.period_start)
      : left.user_id.localeCompare(right.user_id)
  );
}

function filterDayCandidatesByMode(input: {
  mode: RegenerationRunMode;
  candidates: DayCandidate[];
  dayRows: DayJournalCandidateRow[];
  rawRows: RawEntrySourceRow[];
  binding: LiveAiRuntimeBinding;
  touchedByEntryRepair: Set<string>;
}): DayCandidate[] {
  if (input.mode === 'all') {
    return input.candidates;
  }

  const journalByKey = new Map(input.dayRows.map((row) => [dayCandidateKey(row), row]));
  const rawCountByKey = new Map<string, number>();
  for (const raw of input.rawRows) {
    const journalDate = rawJournalDate(raw);
    if (!journalDate) {
      continue;
    }
    const key = `${raw.user_id}:${journalDate}`;
    rawCountByKey.set(key, (rawCountByKey.get(key) ?? 0) + 1);
  }

  return input.candidates.filter((candidate) => {
    const key = dayCandidateKey(candidate);
    const journal = journalByKey.get(key);
    if (!journal) {
      return true;
    }
    if (input.touchedByEntryRepair.has(key)) {
      return true;
    }
    if (!metadataMatches(journal.generation_meta, input.binding)) {
      return true;
    }
    return (rawCountByKey.get(key) ?? 0) > 0 && journalClaimsEmpty(journal);
  });
}

function filterPeriodCandidatesByMode(input: {
  mode: RegenerationRunMode;
  periodType: 'week' | 'month';
  candidates: PeriodCandidate[];
  reflectionRows: ReflectionCandidateRow[];
  dayRows: DayJournalCandidateRow[];
  binding: LiveAiRuntimeBinding;
  touchedDayKeys: Set<string>;
}): PeriodCandidate[] {
  if (input.mode === 'all') {
    return input.candidates;
  }

  const reflectionByKey = new Map(
    input.reflectionRows
      .filter((row) => row.period_type === input.periodType)
      .map((row) => [periodCandidateKey(row), row])
  );

  return input.candidates.filter((candidate) => {
    const reflection = reflectionByKey.get(periodCandidateKey(candidate));
    if (!reflection) {
      return true;
    }
    if (!metadataMatches(reflection.generation_meta, input.binding)) {
      return true;
    }

    const dependentDays = input.dayRows.filter((day) =>
      day.user_id === candidate.user_id &&
      day.journal_date >= candidate.period_start &&
      day.journal_date <= candidate.period_end
    );
    if (dependentDays.some((day) => input.touchedDayKeys.has(dayCandidateKey(day)))) {
      return true;
    }

    const newestDayUpdatedAt = dependentDays
      .map((day) => parseString(day.updated_at))
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1);
    return Boolean(newestDayUpdatedAt && reflection.generated_at && newestDayUpdatedAt > reflection.generated_at);
  });
}

function expandSelectedTypesForScope(input: {
  selectedTypes: StepType[];
  scopeAll: boolean;
}): StepType[] {
  if (input.scopeAll) {
    return input.selectedTypes;
  }
  return STEP_ORDER.filter((stepType) => input.selectedTypes.length === 0 || STEP_ORDER.includes(stepType));
}

async function buildCandidateMapForStart(args: {
  adminClient: any;
  selectedTypes: StepType[];
  mode: RegenerationRunMode;
  scopeSelections: RegenerationScopeSelection[];
  targetUserIds: string[];
  entryBinding: LiveAiRuntimeBinding | null;
  dayBinding: LiveAiRuntimeBinding | null;
  weekBinding: LiveAiRuntimeBinding | null;
  monthBinding: LiveAiRuntimeBinding | null;
}): Promise<CandidateMapBuildResult> {
  const scopePlan = buildRegenerationScopePlan(args.scopeSelections);
  const selectedDaySet = scopePlan.all ? null : new Set(scopePlan.selectedDays);
  const selectedWeekMap = scopePlan.all ? null : new Map(scopePlan.selectedWeeks.map((range) => [rangeKeyFromBounds(range.startDate, range.endDate), range]));
  const selectedMonthMap = scopePlan.all ? null : new Map(scopePlan.selectedMonths.map((range) => [rangeKeyFromBounds(range.startDate, range.endDate), range]));
  const targetUserSet = args.targetUserIds.length > 0 ? new Set(args.targetUserIds) : null;
  const selectedTypes = expandSelectedTypesForScope({
    selectedTypes: args.selectedTypes,
    scopeAll: scopePlan.all,
  });

  const [rawRowsAll, normalizedRows, dayRows, reflectionRows] = await Promise.all([
    selectPagedRows<RawEntrySourceRow>({
      client: args.adminClient,
      table: 'entries_raw',
      select: 'id, user_id, source_type, raw_text, transcript_text, captured_at, journal_date',
      order: { column: 'captured_at', ascending: true },
    }),
    selectPagedRows<NormalizedEntrySourceRow>({
      client: args.adminClient,
      table: 'entries_normalized',
      select: 'id, raw_entry_id, user_id, title, body, summary_short, generation_meta, created_at, updated_at',
      order: { column: 'created_at', ascending: true },
    }),
    selectPagedRows<DayJournalCandidateRow>({
      client: args.adminClient,
      table: 'day_journals',
      select: 'id, user_id, journal_date, summary, narrative_text, generation_meta, updated_at',
      order: { column: 'journal_date', ascending: true },
    }),
    selectPagedRows<ReflectionCandidateRow>({
      client: args.adminClient,
      table: 'period_reflections',
      select: 'id, user_id, period_type, period_start, period_end, generation_meta, generated_at',
      order: { column: 'period_start', ascending: true },
      configure: (query) => query.in('period_type', ['week', 'month']),
    }),
  ]);

  const rawRows = filterRawRowsForScope({
    rawRows: rawRowsAll,
    selectedDaySet,
    targetUserSet,
  });

  const allDayCandidates = filterDayCandidatesForScope({
    candidates: buildDayCandidatesFromSources({
      rawEntries: rawRows.map((row) => ({ user_id: row.user_id, captured_at: row.captured_at, journal_date: row.journal_date })),
      dayJournals: dayRows,
    }),
    selectedDaySet,
    targetUserSet,
  });
  const affectedUserSet = scopePlan.all ? null : new Set(allDayCandidates.map((candidate) => candidate.user_id));

  const rawForCandidateScope = rawRows;
  const entryCandidates = args.mode === 'all'
    ? buildAllEntryCandidates({ rawRows: rawForCandidateScope, normalizedRows })
    : sortEntryCandidates(buildEntryRepairCandidates({
        rawEntries: rawForCandidateScope,
        normalizedEntries: normalizedRows,
        expectedPromptVersion: args.entryBinding?.promptVersion,
        expectedModel: args.entryBinding?.model,
      }));
  const touchedByEntryRepair = new Set(entryCandidates.map((candidate) => `${candidate.userId}:${candidate.journalDate ?? deriveJournalDateForLegacyRaw(candidate.capturedAt)}`));

  const dayCandidates = filterDayCandidatesByMode({
    mode: args.mode,
    candidates: allDayCandidates,
    dayRows,
    rawRows: rawForCandidateScope,
    binding: args.dayBinding!,
    touchedByEntryRepair,
  });
  const touchedDayKeys = new Set(dayCandidates.map(dayCandidateKey));

  const weekCandidates = filterPeriodCandidatesByMode({
    mode: args.mode,
    periodType: 'week',
    candidates: filterPeriodCandidatesForScope({
      candidates: buildPeriodCandidatesFromDays({
        dayCandidates: allDayCandidates,
        periodType: 'week',
        existingReflections: reflectionRows,
      }),
      selectedPeriodMap: selectedWeekMap,
      targetUserSet,
      affectedUserSet,
    }),
    reflectionRows,
    dayRows,
    binding: args.weekBinding!,
    touchedDayKeys,
  });
  const monthCandidates = filterPeriodCandidatesByMode({
    mode: args.mode,
    periodType: 'month',
    candidates: filterPeriodCandidatesForScope({
      candidates: buildPeriodCandidatesFromDays({
        dayCandidates: allDayCandidates,
        periodType: 'month',
        existingReflections: reflectionRows,
      }),
      selectedPeriodMap: selectedMonthMap,
      targetUserSet,
      affectedUserSet,
    }),
    reflectionRows,
    dayRows,
    binding: args.monthBinding!,
    touchedDayKeys,
  });

  const candidateMap = new Map<StepType, unknown[]>();
  candidateMap.set('entries_normalized', entryCandidates);
  candidateMap.set('day_journals', dayCandidates);
  candidateMap.set('week_reflections', weekCandidates);
  candidateMap.set('month_reflections', monthCandidates);

  const filteredSelectedTypes = selectedTypes.filter((stepType) => {
    const candidates = candidateMap.get(stepType) ?? [];
    return candidates.length > 0 || args.selectedTypes.includes(stepType);
  });

  return {
    selectedTypes: filteredSelectedTypes,
    candidateMap,
    options: {
      mode: args.mode,
      scope: scopePlan.all ? { kind: 'all' } : {
        kind: 'selected',
        days: scopePlan.selectedDays,
        weeks: scopePlan.selectedWeeks,
        months: scopePlan.selectedMonths,
      },
      target_user_ids: args.targetUserIds,
    },
    summary: {
      preview: true,
      mode: args.mode,
      scope_all: scopePlan.all,
      candidate_counts: Object.fromEntries(STEP_ORDER.map((stepType) => [stepType, candidateMap.get(stepType)?.length ?? 0])),
    },
  };
}

function rangeKeyFromBounds(startDate: string, endDate: string): string {
  return `${startDate}:${endDate}`;
}

function stepLabelToPeriodType(stepType: StepType): 'week' | 'month' | null {
  if (stepType === 'week_reflections') {
    return 'week';
  }
  if (stepType === 'month_reflections') {
    return 'month';
  }
  return null;
}

function dateFromDayString(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function toDayStringUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDaysUtc(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function computePeriodBounds(periodType: 'week' | 'month', anchorDate: string): {
  periodStart: string;
  periodEnd: string;
} {
  const anchor = dateFromDayString(anchorDate);

  if (periodType === 'week') {
    const day = anchor.getUTCDay();
    const offsetToMonday = (day + 6) % 7;
    const weekStart = addDaysUtc(anchor, -offsetToMonday);
    const weekEnd = addDaysUtc(weekStart, 6);

    return {
      periodStart: toDayStringUtc(weekStart),
      periodEnd: toDayStringUtc(weekEnd),
    };
  }

  const monthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 1));
  const monthEnd = addDaysUtc(nextMonthStart, -1);

  return {
    periodStart: toDayStringUtc(monthStart),
    periodEnd: toDayStringUtc(monthEnd),
  };
}

function buildEntriesBatchRequest(args: {
  normalizedRow: {
    id: string | null;
    user_id: string;
    title: string;
    body: string;
    summary_short: string | null;
    raw_entry_id: string;
  };
  sourceText: string;
  binding: LiveAiRuntimeBinding;
  stepType: StepType;
}): StoredBatchRequest {
  const requestTargetId = args.normalizedRow.id ?? args.normalizedRow.raw_entry_id;
  const systemPrompt = `${args.binding.systemInstructions}\nPromptVersion: ${args.binding.promptVersion}\nRequestId: ${requestTargetId}`;
  const userPrompt = buildAiqsEntryCleanupUserPrompt({
    binding: args.binding,
    rawText: args.sourceText,
  });

  const body: Record<string, unknown> = {
    model: args.binding.model,
    temperature: args.binding.temperature,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  };
  if (args.binding.responseFormat) {
    body.response_format = args.binding.responseFormat;
  }

  const estimate = estimatePromptTokens(systemPrompt) + estimatePromptTokens(userPrompt);
  const customId = `entry|${requestTargetId}`;

  return {
    custom_id: customId,
    step_type: args.stepType,
    target: {
      normalized_id: args.normalizedRow.id,
      raw_entry_id: args.normalizedRow.raw_entry_id,
      user_id: args.normalizedRow.user_id,
    },
    estimated_prompt_tokens: estimate,
    prompt_version: args.binding.promptVersion,
    model: args.binding.model,
    body,
    context: {
      source_text: args.sourceText,
    },
  };
}

function buildDayBatchRequest(args: {
  userId: string;
  journalDate: string;
  entries: Array<{ rawEntryId?: string; capturedAt?: string; title: string; body: string; summaryShort?: string }>;
  binding: LiveAiRuntimeBinding;
  stepType: StepType;
}): StoredBatchRequest {
  const systemPrompt = args.binding.systemInstructions;
  const userPrompt = `${buildAiqsJsonUserPrompt({
    binding: args.binding,
    context: {
      journal_date: args.journalDate,
      entries: args.entries.map((entry) => ({
        entry_title: entry.title,
        entry_body: entry.body,
      })),
    },
  })}\nPromptVersion: ${args.binding.promptVersion}\nRequestId: ${args.userId}:${args.journalDate}`;

  const body: Record<string, unknown> = {
    model: args.binding.model,
    temperature: args.binding.temperature,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  };
  if (args.binding.responseFormat) {
    body.response_format = args.binding.responseFormat;
  }

  const estimate = estimatePromptTokens(systemPrompt) + estimatePromptTokens(userPrompt);
  const customId = `day|${args.userId}|${args.journalDate}`;

  return {
    custom_id: customId,
    step_type: args.stepType,
    target: {
      user_id: args.userId,
      journal_date: args.journalDate,
    },
    estimated_prompt_tokens: estimate,
    prompt_version: args.binding.promptVersion,
    model: args.binding.model,
    body,
    context: {
      entries: args.entries,
    },
  };
}

function buildReflectionBatchRequest(args: {
  userId: string;
  periodType: 'week' | 'month';
  periodStart: string;
  periodEnd: string;
  dayJournals: Array<{ journal_date: string; summary: string; narrative_text: string; sections: unknown }>;
  binding: LiveAiRuntimeBinding;
  stepType: StepType;
}): StoredBatchRequest {
  const userPrompt = `${buildAiqsJsonUserPrompt({
    binding: args.binding,
    context: {
      period_type: args.periodType,
      period_start: args.periodStart,
      period_end: args.periodEnd,
      dayJournals: args.dayJournals.map((journal) => ({
        journal_date: journal.journal_date,
        summary: journal.summary,
        narrative_text: journal.narrative_text,
        sections: journal.sections,
      })),
    },
  })}\nPromptVersion: ${args.binding.promptVersion}\nRequestId: ${args.userId}:${args.periodType}:${args.periodStart}`;

  const body: Record<string, unknown> = {
    model: args.binding.model,
    temperature: args.binding.temperature,
    messages: [
      {
        role: 'system',
        content: args.binding.systemInstructions,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  };
  if (args.binding.responseFormat) {
    body.response_format = args.binding.responseFormat;
  }

  const estimate = estimatePromptTokens(args.binding.systemInstructions) + estimatePromptTokens(userPrompt);
  const customId = `reflection|${args.periodType}|${args.userId}|${args.periodStart}|${args.periodEnd}`;

  return {
    custom_id: customId,
    step_type: args.stepType,
    target: {
      user_id: args.userId,
      period_type: args.periodType,
      period_start: args.periodStart,
      period_end: args.periodEnd,
    },
    estimated_prompt_tokens: estimate,
    prompt_version: args.binding.promptVersion,
    model: args.binding.model,
    body,
  };
}

type EntryBatchCandidate = {
  rawEntryId: string | null;
  normalizedEntryId: string | null;
  reasonCodes: unknown[];
};

type EntryBatchNormalizedRow = {
  id: string;
  user_id: string;
  raw_entry_id: string;
  title: string;
  body: string;
  summary_short: string | null;
};

type EntryBatchRawRow = {
  id: string;
  user_id: string;
  raw_text: string | null;
  transcript_text: string | null;
};

async function loadNormalizedEntryForBatch(args: {
  adminClient: any;
  normalizedId: string;
  cache: Map<string, EntryBatchNormalizedRow | null>;
}): Promise<EntryBatchNormalizedRow | null> {
  if (args.cache.has(args.normalizedId)) {
    return args.cache.get(args.normalizedId) ?? null;
  }

  const { data, error } = await args.adminClient
    .from('entries_normalized')
    .select('id, user_id, raw_entry_id, title, body, summary_short')
    .eq('id', args.normalizedId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load entry row for candidate ${args.normalizedId}: ${String(error.message ?? error)}`);
  }

  const row = (data ?? null) as EntryBatchNormalizedRow | null;
  args.cache.set(args.normalizedId, row);
  return row;
}

async function loadRawEntryForBatch(args: {
  adminClient: any;
  rawEntryId: string;
  cache: Map<string, EntryBatchRawRow | null>;
}): Promise<EntryBatchRawRow | null> {
  if (args.cache.has(args.rawEntryId)) {
    return args.cache.get(args.rawEntryId) ?? null;
  }

  const { data, error } = await args.adminClient
    .from('entries_raw')
    .select('id, user_id, raw_text, transcript_text')
    .eq('id', args.rawEntryId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load raw entry row for candidate ${args.rawEntryId}: ${String(error.message ?? error)}`);
  }

  const row = (data ?? null) as EntryBatchRawRow | null;
  args.cache.set(args.rawEntryId, row);
  return row;
}

async function loadDayRequest(args: {
  adminClient: any;
  userId: string;
  journalDate: string;
  binding: LiveAiRuntimeBinding;
}): Promise<StoredBatchRequest | null> {
  const source = await loadDayEntrySource({
    client: args.adminClient,
    userId: args.userId,
    journalDate: args.journalDate,
    timezoneOffsetMinutes: null,
    expectedPromptVersion: args.binding.promptVersion,
    expectedModel: args.binding.model,
  });

  if (source.debug.uiEquivalentRawCount > 0 && source.debug.promptInputEntryCount === 0) {
    throw new Error(`Day source has raw entries but no prompt entries: ${args.userId}:${args.journalDate}`);
  }

  const entries = orderDayJournalEntries(
    source.promptEntries
  ).filter((entry) =>
    !isLowContentDayEntry(entry, {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
    })
  );

  if (source.debug.uiEquivalentRawCount > 0 && entries.length === 0) {
    throw new Error(`Day source has only low-content prompt entries: ${args.userId}:${args.journalDate}`);
  }

  if (source.debug.uiEquivalentRawCount === 0) {
    return null;
  }

  const request = buildDayBatchRequest({
    userId: args.userId,
    journalDate: args.journalDate,
    entries,
    binding: args.binding,
    stepType: 'day_journals',
  });
  request.context = {
    ...(request.context ?? {}),
    source_entry_count: source.debug.uiEquivalentRawCount,
    runtime_entry_count: source.debug.normalizedCount,
    prompt_entry_count: source.debug.promptInputEntryCount,
    source_entry_ids: source.debug.entryIds,
    prompt_input_body_lengths: source.debug.promptInputBodyLengths,
    issue_reasons: source.issueReasons,
  };
  return request;
}

async function loadReflectionRequest(args: {
  adminClient: any;
  userId: string;
  periodType: 'week' | 'month';
  periodStart: string;
  periodEnd: string;
  stepType: StepType;
  binding: LiveAiRuntimeBinding;
}): Promise<StoredBatchRequest> {
  const { data, error } = await args.adminClient
    .from('day_journals')
    .select('journal_date, summary, narrative_text, sections')
    .eq('user_id', args.userId)
    .gte('journal_date', args.periodStart)
    .lte('journal_date', args.periodEnd)
    .order('journal_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to load day_journals for reflection: ${String(error.message ?? error)}`);
  }

  return buildReflectionBatchRequest({
    userId: args.userId,
    periodType: args.periodType,
    periodStart: args.periodStart,
    periodEnd: args.periodEnd,
    dayJournals: (data ?? []) as Array<{ journal_date: string; summary: string; narrative_text: string; sections: unknown }>,
    binding: args.binding,
    stepType: args.stepType,
  });
}

function safeJsonParse(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function parseChatCompletionContent(outputLine: Record<string, unknown>): Record<string, unknown> | null {
  const response = outputLine.response as { body?: { choices?: Array<{ message?: { content?: string | null } }> } } | undefined;
  const content = response?.body?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || content.trim().length === 0) {
    return null;
  }

  return safeJsonParse(content);
}

async function applyEntriesResult(args: {
  adminClient: any;
  jobId: string;
  batchId: string;
  request: StoredBatchRequest;
  aiJson: Record<string, unknown> | null;
}): Promise<boolean> {
  if (!args.aiJson) {
    return false;
  }

  const title = parseString(args.aiJson.title);
  const body = parseString(args.aiJson.body);
  const summaryShort = parseFirstPresentString([args.aiJson.summary_short, args.aiJson.summaryShort]);

  if (!title || !body || summaryShort === null) {
    return false;
  }

  const normalizedId = parseString(args.request.target.normalized_id);
  const rawEntryId = parseString(args.request.target.raw_entry_id);
  const userId = parseString(args.request.target.user_id);
  if (!normalizedId && (!rawEntryId || !userId)) {
    return false;
  }

  const generationMeta = buildGenerationMeta({
        flow: 'admin-regeneration-job',
        model: args.request.model,
        promptVersion: args.request.prompt_version,
        jobId: args.jobId,
        batchId: args.batchId,
      });

  if (normalizedId) {
    const { error } = await args.adminClient
      .from('entries_normalized')
      .update({
        title,
        body,
        summary_short: summaryShort,
        generation_meta: generationMeta,
      })
      .eq('id', normalizedId);

    return !error;
  }

  const { error } = await args.adminClient
    .from('entries_normalized')
    .insert({
      raw_entry_id: rawEntryId,
      user_id: userId,
      title,
      body,
      summary_short: summaryShort,
      generation_meta: {
        ...generationMeta,
        repair_reason: 'missing_normalized',
      },
    });

  return !error;
}

async function applyDayResult(args: {
  adminClient: any;
  jobId: string;
  batchId: string;
  request: StoredBatchRequest;
  aiJson: Record<string, unknown> | null;
  strictValidation: boolean;
  softQualityGuards: boolean;
}): Promise<boolean> {
  const userId = parseString(args.request.target.user_id);
  const journalDate = parseString(args.request.target.journal_date);
  if (!userId || !journalDate) {
    return false;
  }

  const entries = Array.isArray(args.request.context?.entries)
    ? (args.request.context?.entries as Array<{ rawEntryId?: string; capturedAt?: string; title: string; body: string; summaryShort?: string }>)
    : [];

  const finalizedResult = finalizeDayJournalDraftStrict({
    aiResult: args.aiJson,
    entries,
    options: {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
      strictValidation: args.strictValidation,
      softQualityGuards: args.softQualityGuards,
    },
  });
  const finalized = finalizedResult.finalized;

  if (!finalizedResult.ok) {
    return false;
  }

  const { error } = await args.adminClient
    .from('day_journals')
    .upsert(
      {
        user_id: userId,
        journal_date: journalDate,
        summary: finalized.summary,
        narrative_text: finalized.narrativeText,
        sections: finalized.sections,
        updated_at: new Date().toISOString(),
        generation_meta: {
          ...buildGenerationMeta({
            flow: 'admin-regeneration-job',
            model: args.request.model,
            promptVersion: args.request.prompt_version,
            jobId: args.jobId,
            batchId: args.batchId,
          }),
          runtime_version: 'day_entry_source_v1',
          source_entry_count: args.request.context?.source_entry_count ?? entries.length,
          runtime_entry_count: args.request.context?.runtime_entry_count ?? entries.length,
          prompt_entry_count: args.request.context?.prompt_entry_count ?? entries.length,
          source_entry_ids: args.request.context?.source_entry_ids ?? entries.map((entry) => entry.rawEntryId).filter(Boolean),
          prompt_input_body_lengths: args.request.context?.prompt_input_body_lengths ?? entries.map((entry) => entry.body.length),
          issue_reasons: args.request.context?.issue_reasons ?? [],
        },
      },
      { onConflict: 'user_id,journal_date' }
    );

  return !error;
}

async function applyReflectionResult(args: {
  adminClient: any;
  jobId: string;
  batchId: string;
  request: StoredBatchRequest;
  aiJson: Record<string, unknown> | null;
}): Promise<boolean> {
  if (!args.aiJson) {
    return false;
  }

  const userId = parseString(args.request.target.user_id);
  const periodType = parseString(args.request.target.period_type) as 'week' | 'month' | null;
  const periodStart = parseString(args.request.target.period_start);
  const periodEnd = parseString(args.request.target.period_end);
  if (!userId || !periodType || !periodStart || !periodEnd) {
    return false;
  }

  const draft = parseReflectionDraft(args.aiJson);
  if (!draft) {
    return false;
  }

  const generatedAt = new Date().toISOString();
  const modelVersion = `${args.request.model}:${args.request.prompt_version}`;

  const { error } = await args.adminClient
    .from('period_reflections')
    .upsert(
      {
        user_id: userId,
        period_type: periodType,
        period_start: periodStart,
        period_end: periodEnd,
        summary_text: draft.summaryText,
        narrative_text: draft.narrativeText,
        highlights_json: draft.highlights,
        reflection_points_json: draft.reflectionPoints,
        generated_at: generatedAt,
        model_version: modelVersion,
        generation_meta: buildGenerationMeta({
          flow: 'admin-regeneration-job',
          model: args.request.model,
          promptVersion: args.request.prompt_version,
          jobId: args.jobId,
          batchId: args.batchId,
        }),
      },
      { onConflict: 'user_id,period_type,period_start,period_end' }
    );

  return !error;
}

async function applyCompletedBatch(args: {
  adminClient: any;
  jobId: string;
  step: any;
  batchRow: any;
  openAiBatch: OpenAiBatchObject;
  apiKey: string;
  strictValidation: boolean;
  softQualityGuards: boolean;
}): Promise<{ applied: number; failed: number; processed: number; failedCustomIds: string[] }> {
  const requests = Array.isArray(args.batchRow.requests_json)
    ? (args.batchRow.requests_json as StoredBatchRequest[])
    : [];
  const requestMap = new Map<string, StoredBatchRequest>(requests.map((request) => [request.custom_id, request]));

  const failedCustomIds: string[] = [];
  let applied = 0;
  let failed = 0;
  let processed = 0;

  if (parseString(args.openAiBatch.output_file_id)) {
    const outputContent = await downloadOpenAiFile({
      apiKey: args.apiKey,
      fileId: String(args.openAiBatch.output_file_id),
    });

    const lines = parseJsonlLines<Record<string, unknown>>(outputContent);
    for (const line of lines) {
      const customId = parseString(line.custom_id);
      if (!customId) {
        failed += 1;
        continue;
      }

      const request = requestMap.get(customId);
      if (!request) {
        failed += 1;
        continue;
      }

      processed += 1;

      const aiJson = parseChatCompletionContent(line);
      let success = false;

      if (request.step_type === 'entries_normalized') {
        success = await applyEntriesResult({
          adminClient: args.adminClient,
          jobId: args.jobId,
          batchId: args.batchRow.id,
          request,
          aiJson,
        });
      } else if (request.step_type === 'day_journals') {
        success = await applyDayResult({
          adminClient: args.adminClient,
          jobId: args.jobId,
          batchId: args.batchRow.id,
          request,
          aiJson,
          strictValidation: args.strictValidation,
          softQualityGuards: args.softQualityGuards,
        });
      } else {
        success = await applyReflectionResult({
          adminClient: args.adminClient,
          jobId: args.jobId,
          batchId: args.batchRow.id,
          request,
          aiJson,
        });
      }

      if (success) {
        applied += 1;
      } else {
        failed += 1;
        failedCustomIds.push(customId);
      }
    }
  }

  if (parseString(args.openAiBatch.error_file_id)) {
    const errorContent = await downloadOpenAiFile({
      apiKey: args.apiKey,
      fileId: String(args.openAiBatch.error_file_id),
    });

    const errorLines = parseJsonlLines<Record<string, unknown>>(errorContent);
    for (const line of errorLines) {
      const customId = parseString(line.custom_id);
      if (customId) {
        failedCustomIds.push(customId);
        processed += 1;
      }
      failed += 1;
    }
  }

  return {
    applied,
    failed,
    processed,
    failedCustomIds: [...new Set(failedCustomIds)],
  };
}

function toJsonl(requests: StoredBatchRequest[]): string {
  const envelopes: BatchRequestEnvelope[] = requests.map((request) => ({
    custom_id: request.custom_id,
    method: 'POST',
    url: '/v1/chat/completions',
    body: request.body,
  }));

  return envelopes.map((line) => JSON.stringify(line)).join('\n');
}

async function createBatchFromRequests(args: {
  adminClient: any;
  apiKey: string;
  jobId: string;
  stepId: string;
  stepType: StepType;
  requests: StoredBatchRequest[];
  attempt: number;
  retryOf: string | null;
}): Promise<{ batchId: string; openAiBatchId: string; outputFileId: string | null; errorFileId: string | null }> {
  const jsonl = toJsonl(args.requests);
  const fileId = await uploadBatchFile({
    apiKey: args.apiKey,
    fileName: `job-${args.jobId}-${args.stepType}-${Date.now()}.jsonl`,
    jsonl,
  });

  const openAiBatch = await createOpenAiBatch({
    apiKey: args.apiKey,
    inputFileId: fileId,
    metadata: {
      job_id: args.jobId,
      step_type: args.stepType,
      attempt: String(args.attempt),
    },
  });

  const promptTokensEstimate = args.requests.reduce((sum, request) => sum + request.estimated_prompt_tokens, 0);

  const { data, error } = await args.adminClient
    .from('admin_regeneration_step_batches')
    .insert({
      job_id: args.jobId,
      step_id: args.stepId,
      status: mapBatchRowStatus(mapOpenAiBatchStatus(openAiBatch.status)),
      openai_batch_id: openAiBatch.id,
      input_file_id: fileId,
      output_file_id: openAiBatch.output_file_id ?? null,
      error_file_id: openAiBatch.error_file_id ?? null,
      request_count: args.requests.length,
      prompt_tokens_est: promptTokensEstimate,
      attempt: args.attempt,
      retry_of: args.retryOf,
      requests_json: args.requests,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to persist step batch: ${String(error?.message ?? error)}`);
  }

  return {
    batchId: data.id,
    openAiBatchId: openAiBatch.id,
    outputFileId: openAiBatch.output_file_id ?? null,
    errorFileId: openAiBatch.error_file_id ?? null,
  };
}

async function maybeMarkStepCompleted(args: {
  adminClient: any;
  step: any;
}) {
  const cursor = Number(args.step.cursor ?? 0);
  const total = Number(args.step.total ?? 0);

  const { data: openBatches, error: openBatchesError } = await args.adminClient
    .from('admin_regeneration_step_batches')
    .select('id')
    .eq('step_id', args.step.id)
    .in('status', ['submitted', 'validating', 'in_progress', 'finalizing'])
    .limit(1);

  if (openBatchesError) {
    return;
  }

  const hasOpenBatch = Array.isArray(openBatches) && openBatches.length > 0;
  if (!hasOpenBatch && cursor >= total) {
    await args.adminClient
      .from('admin_regeneration_job_steps')
      .update({
        status: 'completed',
        phase: 'completed',
        last_update_at: new Date().toISOString(),
      })
      .eq('id', args.step.id);
  }
}

async function processOpenBatch(args: {
  adminClient: any;
  apiKey: string;
  jobId: string;
  step: any;
  strictValidation: boolean;
  softQualityGuards: boolean;
}): Promise<boolean> {
  const { data, error } = await args.adminClient
    .from('admin_regeneration_step_batches')
    .select('*')
    .eq('step_id', args.step.id)
    .in('status', ['submitted', 'validating', 'in_progress', 'finalizing'])
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  const openAiBatch = await retrieveOpenAiBatch({
    apiKey: args.apiKey,
    batchId: data.openai_batch_id,
  });

  const mappedStatus = mapBatchRowStatus(mapOpenAiBatchStatus(openAiBatch.status));

  await args.adminClient
    .from('admin_regeneration_step_batches')
    .update({
      status: mappedStatus,
      output_file_id: openAiBatch.output_file_id ?? null,
      error_file_id: openAiBatch.error_file_id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.id);

  if (mappedStatus === 'in_progress' || mappedStatus === 'validating' || mappedStatus === 'finalizing') {
    const nextPoll = mappedStatus === 'finalizing' ? POLL_FINALIZING_MS : POLL_IN_PROGRESS_MS;
    await args.adminClient
      .from('admin_regeneration_job_steps')
      .update({
        status: 'running',
        phase: mappedStatus,
        last_update_at: new Date(Date.now() + nextPoll).toISOString(),
      })
      .eq('id', args.step.id);

    return true;
  }

  if (mappedStatus !== 'completed') {
    const currentFailed = Number(args.step.failed ?? 0);
    const currentOpenAiCompleted = Number(args.step.openai_completed ?? 0);
    const requests = Array.isArray(data.requests_json) ? (data.requests_json as StoredBatchRequest[]) : [];
    const canRetry = Number(data.attempt ?? 0) < 1 && requests.length > 0;

    if (canRetry) {
      await createBatchFromRequests({
        adminClient: args.adminClient,
        apiKey: args.apiKey,
        jobId: args.jobId,
        stepId: args.step.id,
        stepType: args.step.step_type,
        requests,
        attempt: Number(data.attempt ?? 0) + 1,
        retryOf: data.id,
      });

      await args.adminClient
        .from('admin_regeneration_job_steps')
        .update({
          status: 'running',
          phase: 'retrying_failed_batch',
          last_update_at: new Date().toISOString(),
        })
        .eq('id', args.step.id);
    } else {
      await args.adminClient
        .from('admin_regeneration_job_steps')
        .update({
          status: 'running',
          phase: mappedStatus,
          failed: currentFailed + Number(data.request_count ?? 0),
          openai_completed: currentOpenAiCompleted + Number(data.request_count ?? 0),
          last_update_at: new Date().toISOString(),
        })
        .eq('id', args.step.id);
    }

    await maybeMarkStepCompleted({ adminClient: args.adminClient, step: args.step });
    return true;
  }

  const appliedResult = await applyCompletedBatch({
    adminClient: args.adminClient,
    jobId: args.jobId,
    step: args.step,
    batchRow: data,
    openAiBatch,
    apiKey: args.apiKey,
    strictValidation: args.strictValidation,
    softQualityGuards: args.softQualityGuards,
  });

  const currentOpenAiCompleted = Number(args.step.openai_completed ?? 0);
  const currentApplied = Number(args.step.applied ?? 0);
  const currentFailed = Number(args.step.failed ?? 0);

  let retriedFailedItems = false;
  if (appliedResult.failedCustomIds.length > 0 && Number(data.attempt ?? 0) < 1) {
    const requests = Array.isArray(data.requests_json) ? (data.requests_json as StoredBatchRequest[]) : [];
    const filtered = requests.filter((request) => appliedResult.failedCustomIds.includes(request.custom_id));
    if (filtered.length > 0) {
      await createBatchFromRequests({
        adminClient: args.adminClient,
        apiKey: args.apiKey,
        jobId: args.jobId,
        stepId: args.step.id,
        stepType: args.step.step_type,
        requests: filtered,
        attempt: Number(data.attempt ?? 0) + 1,
        retryOf: data.id,
      });
      retriedFailedItems = true;
    }
  }

  await args.adminClient
    .from('admin_regeneration_job_steps')
    .update({
      status: 'running',
      phase: retriedFailedItems ? 'retrying_failed_items' : 'applying_output',
      openai_completed: currentOpenAiCompleted + (retriedFailedItems ? appliedResult.applied : appliedResult.processed),
      applied: currentApplied + appliedResult.applied,
      failed: currentFailed + (retriedFailedItems ? 0 : appliedResult.failed),
      last_update_at: new Date().toISOString(),
    })
    .eq('id', args.step.id);

  await maybeMarkStepCompleted({ adminClient: args.adminClient, step: args.step });

  return true;
}

async function buildStepRequests(args: {
  adminClient: any;
  step: any;
  model: string;
  maxRequests: number;
  maxEstimatedTokens: number;
}): Promise<{ requests: StoredBatchRequest[]; consumed: number; immediateFailed: number }> {
  const cursor = Number(args.step.cursor ?? 0);
  const candidates = Array.isArray(args.step.candidate_keys) ? args.step.candidate_keys : [];
  const entryBinding =
    args.step.step_type === 'entries_normalized'
      ? await loadLiveAiRuntimeBinding({
          adminClient: args.adminClient,
          bindingKey: 'entry_normalization.primary',
        })
      : null;
  const dayBinding =
    args.step.step_type === 'day_journals'
      ? await loadLiveAiRuntimeBinding({
          adminClient: args.adminClient,
          bindingKey: 'day_journal.primary',
        })
      : null;
  const reflectionBinding =
    args.step.step_type === 'week_reflections'
      ? await loadLiveAiRuntimeBinding({
          adminClient: args.adminClient,
          bindingKey: 'week_reflection.primary',
        })
      : args.step.step_type === 'month_reflections'
        ? await loadLiveAiRuntimeBinding({
            adminClient: args.adminClient,
            bindingKey: 'month_reflection.primary',
          })
        : null;

  let consumed = 0;
  let immediateFailed = 0;
  let estimatedTotal = 0;
  const requests: StoredBatchRequest[] = [];

  if (args.step.step_type === 'entries_normalized') {
    const candidateSlice = candidates.slice(cursor, cursor + args.maxRequests * 3) as unknown[];
    const validCandidates: EntryBatchCandidate[] = candidateSlice
      .map((candidate) => {
        if (typeof candidate === 'string') {
          return { rawEntryId: null, normalizedEntryId: candidate, reasonCodes: ['outdated_prompt_version'] };
        }
        if (candidate && typeof candidate === 'object') {
          const row = candidate as Record<string, unknown>;
          return {
            rawEntryId: parseString(row.rawEntryId) ?? parseString(row.raw_entry_id),
            normalizedEntryId: parseString(row.normalizedEntryId) ?? parseString(row.normalized_id),
            reasonCodes: Array.isArray(row.reasonCodes) ? row.reasonCodes : [],
          };
        }
        return { rawEntryId: null, normalizedEntryId: null, reasonCodes: [] };
      })
      .filter((candidate) => candidate.rawEntryId || candidate.normalizedEntryId);

    if (validCandidates.length === 0) {
      return {
        requests: [],
        consumed: Math.min(args.maxRequests, Math.max(0, candidates.length - cursor)),
        immediateFailed,
      };
    }

    const normalizedCache = new Map<string, EntryBatchNormalizedRow | null>();
    const rawCache = new Map<string, EntryBatchRawRow | null>();

    for (const candidate of validCandidates) {
      if (requests.length >= args.maxRequests) {
        break;
      }

      consumed += 1;
      const row = candidate.normalizedEntryId
        ? await loadNormalizedEntryForBatch({
            adminClient: args.adminClient,
            normalizedId: candidate.normalizedEntryId,
            cache: normalizedCache,
          })
        : null;
      const rawId = row?.raw_entry_id ?? candidate.rawEntryId;
      const raw = rawId
        ? await loadRawEntryForBatch({
            adminClient: args.adminClient,
            rawEntryId: rawId,
            cache: rawCache,
          })
        : null;
      if (!rawId || !raw) {
        immediateFailed += 1;
        continue;
      }

      const sourceText = parseString(raw.raw_text) ?? parseString(raw.transcript_text) ?? row?.body ?? '';
      if (!parseString(sourceText)) {
        immediateFailed += 1;
        continue;
      }
      const request = buildEntriesBatchRequest({
        normalizedRow: row ?? {
          id: null,
          user_id: raw.user_id,
          raw_entry_id: rawId,
          title: '',
          body: '',
          summary_short: null,
        },
        sourceText,
        binding: entryBinding!,
        stepType: 'entries_normalized',
      });

      if (requests.length > 0 && estimatedTotal + request.estimated_prompt_tokens > args.maxEstimatedTokens) {
        consumed -= 1;
        break;
      }

      requests.push(request);
      estimatedTotal += request.estimated_prompt_tokens;
    }

    return { requests, consumed, immediateFailed };
  }

  for (let index = cursor; index < candidates.length; index += 1) {
    if (requests.length >= args.maxRequests) {
      break;
    }

    const candidate = candidates[index] as Record<string, unknown>;
    consumed += 1;

    try {
      let request: StoredBatchRequest | null = null;

      if (args.step.step_type === 'day_journals') {
        const userId = parseString(candidate.user_id);
        const journalDate = parseString(candidate.journal_date);
        if (!userId || !journalDate) {
          immediateFailed += 1;
          continue;
        }

        request = await loadDayRequest({
          adminClient: args.adminClient,
          userId,
          journalDate,
          binding: dayBinding!,
        });
      } else {
        const periodType = stepLabelToPeriodType(args.step.step_type as StepType);
        const userId = parseString(candidate.user_id);
        const periodStart = parseString(candidate.period_start);
        const periodEnd = parseString(candidate.period_end);

        if (!periodType || !userId || !periodStart || !periodEnd) {
          immediateFailed += 1;
          continue;
        }

        request = await loadReflectionRequest({
          adminClient: args.adminClient,
          userId,
          periodType,
          periodStart,
          periodEnd,
          stepType: args.step.step_type,
          binding: reflectionBinding!,
        });
      }

      if (!request) {
        immediateFailed += 1;
        continue;
      }

      if (requests.length > 0 && estimatedTotal + request.estimated_prompt_tokens > args.maxEstimatedTokens) {
        consumed -= 1;
        break;
      }

      requests.push(request);
      estimatedTotal += request.estimated_prompt_tokens;
    } catch {
      immediateFailed += 1;
    }
  }

  return { requests, consumed, immediateFailed };
}

async function processStep(args: {
  adminClient: any;
  apiKey: string;
  jobId: string;
  step: any;
  model: string;
  strictValidation: boolean;
  softQualityGuards: boolean;
}): Promise<WorkerOutcome> {
  await args.adminClient
    .from('admin_regeneration_job_steps')
    .update({
      status: 'running',
      phase: 'running',
      last_update_at: new Date().toISOString(),
    })
    .eq('id', args.step.id);

  const hadOpenBatch = await processOpenBatch({
    adminClient: args.adminClient,
    apiKey: args.apiKey,
    jobId: args.jobId,
    step: args.step,
    strictValidation: args.strictValidation,
    softQualityGuards: args.softQualityGuards,
  });

  if (hadOpenBatch) {
    return {
      progressed: true,
      needsFollowup: true,
      done: false,
    };
  }

  const maxRequests = STEP_CAPS[args.step.step_type as StepType] ?? 40;
  const buildResult = await buildStepRequests({
    adminClient: args.adminClient,
    step: args.step,
    model: args.model,
    maxRequests,
    maxEstimatedTokens: MAX_ESTIMATED_PROMPT_TOKENS_PER_SUB_BATCH,
  });

  const currentCursor = Number(args.step.cursor ?? 0);
  const currentFailed = Number(args.step.failed ?? 0);

  const nextCursor = currentCursor + buildResult.consumed;
  await args.adminClient
    .from('admin_regeneration_job_steps')
    .update({
      cursor: nextCursor,
      failed: currentFailed + buildResult.immediateFailed,
      phase: buildResult.requests.length > 0 ? 'submitting_batch' : 'running',
      last_update_at: new Date().toISOString(),
    })
    .eq('id', args.step.id);

  if (buildResult.requests.length === 0) {
    const total = Number(args.step.total ?? 0);
    if (nextCursor >= total) {
      await args.adminClient
        .from('admin_regeneration_job_steps')
        .update({
          status: 'completed',
          phase: 'completed',
          last_update_at: new Date().toISOString(),
        })
        .eq('id', args.step.id);

      return {
        progressed: true,
        needsFollowup: true,
        done: false,
      };
    }

    return {
      progressed: false,
      needsFollowup: true,
      done: false,
    };
  }

  await createBatchFromRequests({
    adminClient: args.adminClient,
    apiKey: args.apiKey,
    jobId: args.jobId,
    stepId: args.step.id,
    stepType: args.step.step_type,
    requests: buildResult.requests,
    attempt: 0,
    retryOf: null,
  });

  const currentQueued = Number(args.step.queued ?? 0);
  await args.adminClient
    .from('admin_regeneration_job_steps')
    .update({
      queued: currentQueued + buildResult.requests.length,
      status: 'running',
      phase: 'submitted',
      last_update_at: new Date().toISOString(),
    })
    .eq('id', args.step.id);

  await sleep(SUBMIT_BASE_WAIT_MS + randomJitter(SUBMIT_JITTER_MAX_MS));

  return {
    progressed: true,
    needsFollowup: true,
    done: false,
  };
}

async function processJobTick(args: {
  adminClient: any;
  apiKey: string;
  jobId: string;
  model: string;
  strictValidation: boolean;
  softQualityGuards: boolean;
}): Promise<WorkerOutcome> {
  const { data: job, error: jobError } = await args.adminClient
    .from('admin_regeneration_jobs')
    .select('*')
    .eq('id', args.jobId)
    .maybeSingle();

  if (jobError || !job) {
    throw new Error('Regeneration job not found.');
  }

  if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
    return { progressed: false, needsFollowup: false, done: true };
  }

  if (job.status === 'queued') {
    await args.adminClient
      .from('admin_regeneration_jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', args.jobId);
  }

  const { data: steps, error: stepsError } = await args.adminClient
    .from('admin_regeneration_job_steps')
    .select('*')
    .eq('job_id', args.jobId);

  if (stepsError) {
    throw new Error(`Failed to load job steps: ${String(stepsError.message ?? stepsError)}`);
  }

  const ordered = ((steps ?? []) as any[]).sort(
    (left, right) => STEP_ORDER.indexOf(left.step_type) - STEP_ORDER.indexOf(right.step_type)
  );

  const nextStep = ordered.find((step) => step.status !== 'completed');

  if (!nextStep) {
    const summary = ordered.reduce(
      (acc, step) => {
        acc.total += Number(step.total ?? 0);
        acc.queued += Number(step.queued ?? 0);
        acc.openai_completed += Number(step.openai_completed ?? 0);
        acc.applied += Number(step.applied ?? 0);
        acc.failed += Number(step.failed ?? 0);
        return acc;
      },
      {
        total: 0,
        queued: 0,
        openai_completed: 0,
        applied: 0,
        failed: 0,
      }
    );

    await args.adminClient
      .from('admin_regeneration_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        summary,
      })
      .eq('id', args.jobId);

    return {
      progressed: true,
      needsFollowup: false,
      done: true,
    };
  }

  const stepOutcome = await processStep({
    adminClient: args.adminClient,
    apiKey: args.apiKey,
    jobId: args.jobId,
    step: nextStep,
    model: args.model,
    strictValidation: args.strictValidation,
    softQualityGuards: args.softQualityGuards,
  });

  return stepOutcome;
}

async function loadJobView(args: { adminClient: any; jobId: string }) {
  const { data: job, error: jobError } = await args.adminClient
    .from('admin_regeneration_jobs')
    .select('id, status, created_by, selected_types, options, summary, created_at, updated_at, started_at, completed_at')
    .eq('id', args.jobId)
    .maybeSingle();

  if (jobError || !job) {
    throw new Error('Job not found.');
  }

  const { data: steps, error: stepsError } = await args.adminClient
    .from('admin_regeneration_job_steps')
    .select('step_type, status, phase, total, queued, openai_completed, applied, failed, cursor, last_update_at')
    .eq('job_id', args.jobId);

  if (stepsError) {
    throw new Error('Failed to load steps.');
  }

  const mappedSteps = ((steps ?? []) as Array<Record<string, unknown>>)
    .sort((left, right) => STEP_ORDER.indexOf(String(left.step_type) as StepType) - STEP_ORDER.indexOf(String(right.step_type) as StepType))
    .map((step) => {
      const total = Number(step.total ?? 0);
      const applied = Number(step.applied ?? 0);
      const failed = Number(step.failed ?? 0);
      const remaining = Math.max(0, total - (applied + failed));
      return {
        ...step,
        remaining,
      };
    });

  return {
    ...job,
    steps: mappedSteps,
  };
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: buildCorsHeaders(request),
    });
  }

  const requestId = crypto.randomUUID();
  const flowId = parseFlowId(request, requestId);
  let step = 'received';

  if (request.method !== 'POST') {
    return errorResponse({
      request,
      httpStatus: 405,
      requestId,
      flowId,
      step,
      code: 'INPUT_INVALID',
      message: 'Method not allowed',
      details: { method: request.method },
    });
  }

  try {
    const supabaseRuntimeEnv = getSupabaseRuntimeEnv();
    const internalToken = getInternalToken();

    let body: RequestBody;
    try {
      const parsedBody = await request.json();
      if (!parsedBody || typeof parsedBody !== 'object') {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step: 'validated',
          code: 'INPUT_INVALID',
          message: 'Invalid JSON body',
        });
      }

      body = parsedBody as RequestBody;
    } catch {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step: 'validated',
        code: 'INPUT_INVALID',
        message: 'Invalid JSON body',
      });
    }

    const action = parseString((body as { action?: unknown }).action) as Action | null;
    if (!action || (action !== 'start' && action !== 'preview' && action !== 'status' && action !== 'worker_tick' && action !== 'access' && action !== 'latest' && action !== 'inspect_day')) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step: 'validated',
        code: 'INPUT_INVALID',
        message: 'Invalid action. Use start, preview, status, worker_tick, access, latest, inspect_day.',
      });
    }

    const internalHeaderToken = request.headers.get('x-admin-internal-token')?.trim() ?? '';
    const isInternal = internalToken.length > 0 && internalHeaderToken === internalToken;

    let userId: string | null = null;
    if (!isInternal || action === 'start' || action === 'preview' || action === 'status' || action === 'access' || action === 'latest' || action === 'inspect_day') {
      try {
        const access = await loadAdminAccessContext({
          request,
          supabaseUrl: supabaseRuntimeEnv.supabaseUrl,
          supabaseAnonKey: supabaseRuntimeEnv.supabaseAnonKey,
        });
        if (!hasCapabilityAccess(access, 'regeneration')) {
          throw new Error('Forbidden');
        }
        userId = access.userId;
      } catch (authError) {
        const message = authError instanceof Error ? authError.message : 'Unauthorized';
        const code = message === 'Missing Authorization header' ? 'AUTH_MISSING' : 'AUTH_UNAUTHORIZED';
        return errorResponse({
          request,
          httpStatus: code === 'AUTH_MISSING' ? 401 : 403,
          requestId,
          flowId,
          step: 'authenticated',
          code,
          message: message === 'Forbidden' ? 'Je hebt geen rechten om data opnieuw te verwerken.' : message,
        });
      }
    }

    if (action === 'access') {
      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        canAccess: true,
        userId,
      });
    }

    const serviceRoleKey = getServiceRoleKey();
    const adminClient = createClient(supabaseRuntimeEnv.supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    if (action === 'inspect_day') {
      step = 'inspect_day';
      const inspectedUserId = ensureUuid((body as InspectDayBody).userId);
      const journalDate = parseString((body as InspectDayBody).journalDate);
      if (!inspectedUserId || !journalDate) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'inspect_day requires userId and journalDate.',
        });
      }

      const dayBinding = await loadLiveAiRuntimeBinding({
        adminClient,
        bindingKey: 'day_journal.primary',
      });
      const source = await loadDayEntrySource({
        client: adminClient,
        userId: inspectedUserId,
        journalDate,
        timezoneOffsetMinutes: null,
        expectedPromptVersion: dayBinding.promptVersion,
        expectedModel: dayBinding.model,
      });

      const { data: dayJournal } = await adminClient
        .from('day_journals')
        .select('id, journal_date, summary, narrative_text, sections, updated_at, generation_meta')
        .eq('user_id', inspectedUserId)
        .eq('journal_date', journalDate)
        .maybeSingle();

      const bounds = computePeriodBounds('week', journalDate);
      const monthBounds = computePeriodBounds('month', journalDate);
      const { data: reflections } = await adminClient
        .from('period_reflections')
        .select('id, period_type, period_start, period_end, summary_text, narrative_text, generated_at, generation_meta')
        .eq('user_id', inspectedUserId)
        .in('period_type', ['week', 'month'])
        .in('period_start', [bounds.periodStart, monthBounds.periodStart]);

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        inspection: {
          userId: inspectedUserId,
          journalDate,
          binding: {
            bindingKey: dayBinding.runtimeBindingKey,
            taskKey: dayBinding.taskKey,
            versionId: dayBinding.versionId,
            promptVersion: dayBinding.promptVersion,
            model: dayBinding.model,
          },
          counts: source.debug,
          issueReasons: source.issueReasons,
          entries: source.items.map((item) => ({
            rawEntryId: item.raw.id,
            normalizedEntryId: item.normalized?.id ?? null,
            capturedAt: item.raw.captured_at,
            journalDate: item.raw.journal_date,
            sourceType: item.raw.source_type,
            rawBodyLength: item.sourceBodyLength,
            normalizedTitle: item.normalized?.title ?? null,
            normalizedBody: item.normalized?.body ?? null,
            normalizedSummaryShort: item.normalized?.summary_short ?? null,
            normalizedBodyLength: item.normalizedBodyLength,
            issueReasons: item.issueReasons,
          })),
          promptEntries: source.promptEntries,
          dayJournal: dayJournal ?? null,
          reflections: reflections ?? [],
        },
      });
    }

    if (action === 'latest') {
      step = 'latest';

      const { data: latestJob, error: latestJobError } = await adminClient
        .from('admin_regeneration_jobs')
        .select('id')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestJobError) {
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: 'DB_READ_FAILED',
          message: 'Failed to load latest job.',
        });
      }

      if (!latestJob?.id) {
        return jsonResponse(request, 200, {
          status: 'ok',
          flow: FLOW,
          requestId,
          flowId,
          job: null,
        });
      }

      const view = await loadJobView({ adminClient, jobId: latestJob.id });
      if (view.created_by !== userId) {
        return errorResponse({
          request,
          httpStatus: 403,
          requestId,
          flowId,
          step,
          code: 'AUTH_UNAUTHORIZED',
          message: 'Not allowed to view this job.',
        });
      }

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        job: view,
      });
    }

    if (action === 'preview' || action === 'start') {
      step = action === 'preview' ? 'preview' : 'starting';
      const startBody = body as StartBody | PreviewBody;
      const selectedTypes = parseSelectedTypes(startBody.selectedTypes);
      if (selectedTypes.length === 0) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'Select at least one step type.',
        });
      }

      const mode = parseRunMode(startBody.mode);
      const scopeSelections = parseScopeSelections(startBody.scope);
      const targetUserIds = parseTargetUserIds(startBody.targetUserIds);
      const [entryBinding, dayBinding, weekBinding, monthBinding] = await Promise.all([
        loadLiveAiRuntimeBinding({ adminClient, bindingKey: 'entry_normalization.primary' }),
        loadLiveAiRuntimeBinding({ adminClient, bindingKey: 'day_journal.primary' }),
        loadLiveAiRuntimeBinding({ adminClient, bindingKey: 'week_reflection.primary' }),
        loadLiveAiRuntimeBinding({ adminClient, bindingKey: 'month_reflection.primary' }),
      ]);
      const candidateBuild = await buildCandidateMapForStart({
        adminClient,
        selectedTypes,
        mode,
        scopeSelections,
        targetUserIds,
        entryBinding,
        dayBinding,
        weekBinding,
        monthBinding,
      });

      if (action === 'preview') {
        return jsonResponse(request, 200, {
          status: 'ok',
          flow: FLOW,
          requestId,
          flowId,
          preview: {
            selectedTypes: candidateBuild.selectedTypes,
            options: candidateBuild.options,
            summary: candidateBuild.summary,
            steps: STEP_ORDER
              .filter((stepType) => candidateBuild.selectedTypes.includes(stepType))
              .map((stepType) => ({
                step_type: stepType,
                total: candidateBuild.candidateMap.get(stepType)?.length ?? 0,
              })),
          },
        });
      }

      const runtimeEnv = getFunctionRuntimeEnv();

      const now = new Date().toISOString();
      const { data: jobRow, error: jobInsertError } = await adminClient
        .from('admin_regeneration_jobs')
        .insert({
          created_by: userId,
          status: 'queued',
          selected_types: candidateBuild.selectedTypes,
          options: {
            ...candidateBuild.options,
            submit_base_wait_ms: SUBMIT_BASE_WAIT_MS,
            submit_jitter_max_ms: SUBMIT_JITTER_MAX_MS,
            max_estimated_prompt_tokens_per_sub_batch: MAX_ESTIMATED_PROMPT_TOKENS_PER_SUB_BATCH,
          },
          summary: candidateBuild.summary,
          created_at: now,
          updated_at: now,
        })
        .select('id')
        .single();

      if (jobInsertError || !jobRow) {
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: 'DB_WRITE_FAILED',
          message: 'Failed to create job.',
        });
      }

      const stepInserts = candidateBuild.selectedTypes.map((stepType) => {
        const candidates = candidateBuild.candidateMap.get(stepType) ?? [];
        return {
          job_id: jobRow.id,
          step_type: stepType,
          status: 'pending',
          phase: 'pending',
          total: candidates.length,
          queued: 0,
          openai_completed: 0,
          applied: 0,
          failed: 0,
          cursor: 0,
          candidate_keys: candidates,
          last_update_at: now,
        };
      });

      const { error: stepInsertError } = await adminClient
        .from('admin_regeneration_job_steps')
        .insert(stepInserts);

      if (stepInsertError) {
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: 'DB_WRITE_FAILED',
          message: 'Failed to create job steps.',
        });
      }

      const workerOutcome = await processJobTick({
        adminClient,
        apiKey: runtimeEnv.openAiApiKey,
        jobId: jobRow.id,
        model: runtimeEnv.openAiModel,
        strictValidation: runtimeEnv.dayJournalStrictValidation,
        softQualityGuards: runtimeEnv.dayJournalSoftQualityGuards,
      });

      if (workerOutcome.needsFollowup) {
        await triggerWorkerTick({
          supabaseUrl: supabaseRuntimeEnv.supabaseUrl,
          anonKey: supabaseRuntimeEnv.supabaseAnonKey,
          internalToken,
          jobId: jobRow.id,
        });
      }

      const view = await loadJobView({ adminClient, jobId: jobRow.id });

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        job: view,
      });
    }

    if (action === 'status') {
      step = 'status';

      const jobId = ensureUuid((body as StatusBody).jobId);
      if (!jobId) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'jobId ontbreekt of is ongeldig.',
        });
      }

      const view = await loadJobView({ adminClient, jobId });
      if (view.created_by !== userId) {
        return errorResponse({
          request,
          httpStatus: 403,
          requestId,
          flowId,
          step,
          code: 'AUTH_UNAUTHORIZED',
          message: 'Not allowed to view this job.',
        });
      }

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        job: view,
      });
    }

    step = 'worker_tick';

    if (!isInternal && !userId) {
      return errorResponse({
        request,
        httpStatus: 403,
        requestId,
        flowId,
        step,
        code: 'AUTH_UNAUTHORIZED',
        message: 'worker_tick requires internal token or allowlisted admin.',
      });
    }

    const jobId = ensureUuid((body as WorkerBody).jobId);
    if (!jobId) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: 'jobId ontbreekt of is ongeldig.',
      });
    }

    const runtimeEnv = getFunctionRuntimeEnv();
    const outcome = await processJobTick({
      adminClient,
      apiKey: runtimeEnv.openAiApiKey,
      jobId,
      model: runtimeEnv.openAiModel,
      strictValidation: runtimeEnv.dayJournalStrictValidation,
      softQualityGuards: runtimeEnv.dayJournalSoftQualityGuards,
    });

    if (outcome.needsFollowup && !outcome.done) {
      await triggerWorkerTick({
        supabaseUrl: supabaseRuntimeEnv.supabaseUrl,
        anonKey: supabaseRuntimeEnv.supabaseAnonKey,
        internalToken,
        jobId,
      });
    }

    const view = await loadJobView({ adminClient, jobId });

    return jsonResponse(request, 200, {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      outcome,
      job: view,
    });
  } catch (error) {
    logFlow('error', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'fatal',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return errorResponse({
      request,
      httpStatus: 500,
      requestId,
      flowId,
      step,
      code: 'INTERNAL_UNEXPECTED',
      message: error instanceof Error ? error.message : 'Unexpected error',
    });
  }
});
