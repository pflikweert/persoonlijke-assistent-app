import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildEntryNormalizationPromptSpec, ENTRY_NORMALIZATION_PROMPT_VERSION, buildReflectionPromptSpec, REFLECTION_PROMPT_VERSION } from '../_shared/prompt-specs.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import {
  buildDayJournalPromptSpec,
  finalizeDayJournalDraft,
  isLowContentDayEntry,
  orderDayJournalEntries,
} from '../_shared/day-journal-contract.mjs';

type StepType = 'entries_normalized' | 'day_journals' | 'week_reflections' | 'month_reflections';
type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

type Action = 'start' | 'status' | 'worker_tick' | 'access';

type StartBody = {
  action: 'start';
  selectedTypes?: unknown;
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

type RequestBody = StartBody | StatusBody | WorkerBody | AccessBody;

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
const MODEL_TEMPERATURE = 0.2;

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

function ensureUuid(value: unknown): string | null {
  const parsed = parseString(value);
  if (!parsed) {
    return null;
  }

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(parsed) ? parsed : null;
}

function parseAdminAllowlist(rawValue: string | undefined): Set<string> {
  const source = rawValue?.trim() ?? '';
  if (!source) {
    return new Set();
  }

  const items = source
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return new Set(items);
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

function getAdminAllowlist(): Set<string> {
  return parseAdminAllowlist(Deno.env.get('ADMIN_REGEN_ALLOWLIST_USER_IDS'));
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

async function authenticateAdmin(args: {
  request: Request;
  supabaseUrl: string;
  supabaseAnonKey: string;
  allowlist: Set<string>;
}): Promise<{ userId: string }> {
  const authHeader = args.request.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const supabase = createClient(args.supabaseUrl, args.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Unauthorized');
  }

  if (args.allowlist.size === 0 || !args.allowlist.has(data.user.id)) {
    throw new Error('Forbidden');
  }

  return { userId: data.user.id };
}

async function loadEntriesOutdatedCandidateIds(args: {
  adminClient: any;
  model: string;
}): Promise<string[]> {
  const { data, error } = await args.adminClient
    .from('entries_normalized')
    .select('id, generation_meta')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`Failed to load entries candidates: ${String(error.message ?? error)}`);
  }

  const rows = (data ?? []) as Array<{ id: string; generation_meta: Record<string, unknown> | null }>;
  return rows
    .filter((row) => {
      const meta = row.generation_meta ?? {};
      const promptVersion = parseString(meta.prompt_version);
      const modelVersion = parseString(meta.model);
      return promptVersion !== ENTRY_NORMALIZATION_PROMPT_VERSION || modelVersion !== args.model;
    })
    .map((row) => row.id);
}

async function loadDayCandidates(args: { adminClient: any }): Promise<Array<{ user_id: string; journal_date: string }>> {
  const { data, error } = await args.adminClient
    .from('day_journals')
    .select('user_id, journal_date')
    .order('user_id', { ascending: true })
    .order('journal_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to load day candidates: ${String(error.message ?? error)}`);
  }

  return (data ?? []) as Array<{ user_id: string; journal_date: string }>;
}

async function loadReflectionCandidates(args: {
  adminClient: any;
  periodType: 'week' | 'month';
}): Promise<Array<{ user_id: string; period_start: string; period_end: string }>> {
  const { data, error } = await args.adminClient
    .from('period_reflections')
    .select('user_id, period_start, period_end')
    .eq('period_type', args.periodType)
    .order('user_id', { ascending: true })
    .order('period_start', { ascending: true });

  if (error) {
    throw new Error(`Failed to load reflection candidates: ${String(error.message ?? error)}`);
  }

  return (data ?? []) as Array<{ user_id: string; period_start: string; period_end: string }>;
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

function buildEntriesBatchRequest(args: {
  normalizedRow: {
    id: string;
    user_id: string;
    title: string;
    body: string;
    summary_short: string | null;
    raw_entry_id: string;
  };
  sourceText: string;
  model: string;
  stepType: StepType;
}): StoredBatchRequest {
  const prompt = buildEntryNormalizationPromptSpec({ rawText: args.sourceText });
  const systemPrompt = `${prompt.systemPrompt}\nPromptVersion: ${prompt.promptVersion}\nRequestId: ${args.normalizedRow.id}`;
  const userPrompt = prompt.userPrompt;

  const body: Record<string, unknown> = {
    model: args.model,
    temperature: MODEL_TEMPERATURE,
    response_format: { type: 'json_object' },
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

  const estimate = estimatePromptTokens(systemPrompt) + estimatePromptTokens(userPrompt);
  const customId = `entry|${args.normalizedRow.id}`;

  return {
    custom_id: customId,
    step_type: args.stepType,
    target: {
      normalized_id: args.normalizedRow.id,
      user_id: args.normalizedRow.user_id,
    },
    estimated_prompt_tokens: estimate,
    prompt_version: prompt.promptVersion,
    model: args.model,
    body,
    context: {
      fallback_title: args.normalizedRow.title,
      fallback_body: args.normalizedRow.body,
      fallback_summary_short: args.normalizedRow.summary_short,
      source_text: args.sourceText,
    },
  };
}

function buildDayBatchRequest(args: {
  userId: string;
  journalDate: string;
  entries: Array<{ rawEntryId?: string; capturedAt?: string; title: string; body: string; summaryShort?: string }>;
  model: string;
  stepType: StepType;
}): StoredBatchRequest {
  const prompt = buildDayJournalPromptSpec({
    journalDate: args.journalDate,
    entries: args.entries,
  });

  const systemPrompt = prompt.systemPrompt;
  const userPrompt = `${prompt.userPrompt}\nPromptVersion: ${prompt.promptVersion}\nRequestId: ${args.userId}:${args.journalDate}`;

  const body: Record<string, unknown> = {
    model: args.model,
    temperature: MODEL_TEMPERATURE,
    response_format: { type: 'json_object' },
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
    prompt_version: prompt.promptVersion,
    model: args.model,
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
  model: string;
  stepType: StepType;
}): StoredBatchRequest {
  const prompt = buildReflectionPromptSpec({
    periodType: args.periodType,
    periodStart: args.periodStart,
    periodEnd: args.periodEnd,
    dayJournals: args.dayJournals,
  });

  const userPrompt = `${prompt.userPrompt}\nPromptVersion: ${prompt.promptVersion}\nRequestId: ${args.userId}:${args.periodType}:${args.periodStart}`;

  const body: Record<string, unknown> = {
    model: args.model,
    temperature: MODEL_TEMPERATURE,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: prompt.systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  };

  const estimate = estimatePromptTokens(prompt.systemPrompt) + estimatePromptTokens(userPrompt);
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
    prompt_version: prompt.promptVersion,
    model: args.model,
    body,
  };
}

async function loadDayRequest(args: {
  adminClient: any;
  userId: string;
  journalDate: string;
  model: string;
}): Promise<StoredBatchRequest | null> {
  const { data: rawRows, error: rawError } = await args.adminClient
    .from('entries_raw')
    .select('id, captured_at')
    .eq('user_id', args.userId)
    .eq('journal_date', args.journalDate)
    .order('captured_at', { ascending: true });

  if (rawError) {
    throw new Error(`Failed to load raw entries for day: ${String(rawError.message ?? rawError)}`);
  }

  const rawIds = ((rawRows ?? []) as Array<{ id: string; captured_at: string }>).map((row) => row.id);
  const rawCapturedMap = new Map<string, string>(
    ((rawRows ?? []) as Array<{ id: string; captured_at: string }>).map((row) => [row.id, row.captured_at])
  );

  if (rawIds.length === 0) {
    return buildDayBatchRequest({
      userId: args.userId,
      journalDate: args.journalDate,
      entries: [],
      model: args.model,
      stepType: 'day_journals',
    });
  }

  const { data: normalizedRows, error: normalizedError } = await args.adminClient
    .from('entries_normalized')
    .select('raw_entry_id, title, body, summary_short')
    .eq('user_id', args.userId)
    .in('raw_entry_id', rawIds);

  if (normalizedError) {
    throw new Error(`Failed to load normalized entries for day: ${String(normalizedError.message ?? normalizedError)}`);
  }

  const normalizedMap = new Map<string, { title: string; body: string; summary_short: string | null }>(
    ((normalizedRows ?? []) as Array<{ raw_entry_id: string; title: string; body: string; summary_short: string | null }>).map((row) => [
      row.raw_entry_id,
      {
        title: row.title,
        body: row.body,
        summary_short: row.summary_short,
      },
    ])
  );

  const dayEntries = rawIds.map((rawId) => {
    const normalized = normalizedMap.get(rawId);
    if (!normalized) {
      return null;
    }

    return {
      rawEntryId: rawId,
      capturedAt: rawCapturedMap.get(rawId),
      title: normalized.title,
      body: normalized.body,
      summaryShort: parseString(normalized.summary_short) ?? undefined,
    };
  });

  const entries = orderDayJournalEntries(
    dayEntries.filter((item): item is NonNullable<(typeof dayEntries)[number]> => Boolean(item))
  ).filter((entry) =>
    !isLowContentDayEntry(entry, {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
    })
  );

  return buildDayBatchRequest({
    userId: args.userId,
    journalDate: args.journalDate,
    entries,
    model: args.model,
    stepType: 'day_journals',
  });
}

async function loadReflectionRequest(args: {
  adminClient: any;
  userId: string;
  periodType: 'week' | 'month';
  periodStart: string;
  periodEnd: string;
  stepType: StepType;
  model: string;
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
    model: args.model,
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

  const title = parseString(args.aiJson.title) ?? parseString(args.request.context?.fallback_title) ?? 'Je entry';
  const body = parseString(args.aiJson.body) ?? parseString(args.request.context?.fallback_body) ?? '';
  const summaryShort = parseString(args.aiJson.summary_short) ?? parseString(args.request.context?.fallback_summary_short) ?? null;

  if (!title || !body) {
    return false;
  }

  const normalizedId = parseString(args.request.target.normalized_id);
  if (!normalizedId) {
    return false;
  }

  const { error } = await args.adminClient
    .from('entries_normalized')
    .update({
      title,
      body,
      summary_short: summaryShort,
      generation_meta: buildGenerationMeta({
        flow: 'admin-regeneration-job',
        model: args.request.model,
        promptVersion: args.request.prompt_version,
        jobId: args.jobId,
        batchId: args.batchId,
      }),
    })
    .eq('id', normalizedId);

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

  const finalized = finalizeDayJournalDraft({
    aiResult: args.aiJson,
    entries,
    options: {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
      strictValidation: args.strictValidation,
      softQualityGuards: args.softQualityGuards,
    },
  });

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
        generation_meta: buildGenerationMeta({
          flow: 'admin-regeneration-job',
          model: args.request.model,
          promptVersion: args.request.prompt_version,
          jobId: args.jobId,
          batchId: args.batchId,
        }),
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
  const modelVersion = `${args.request.model}:${REFLECTION_PROMPT_VERSION}`;

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

  let consumed = 0;
  let immediateFailed = 0;
  let estimatedTotal = 0;
  const requests: StoredBatchRequest[] = [];

  if (args.step.step_type === 'entries_normalized') {
    const ids = candidates.slice(cursor, cursor + args.maxRequests * 3) as string[];
    const validIds = ids.filter((id) => typeof id === 'string' && id.trim().length > 0);

    if (validIds.length === 0) {
      return {
        requests: [],
        consumed: Math.min(args.maxRequests, Math.max(0, candidates.length - cursor)),
        immediateFailed,
      };
    }

    const { data: normalizedRows, error: normalizedError } = await args.adminClient
      .from('entries_normalized')
      .select('id, user_id, raw_entry_id, title, body, summary_short')
      .in('id', validIds);

    if (normalizedError) {
      throw new Error(`Failed to load entry rows: ${String(normalizedError.message ?? normalizedError)}`);
    }

    const rows = (normalizedRows ?? []) as Array<{
      id: string;
      user_id: string;
      raw_entry_id: string;
      title: string;
      body: string;
      summary_short: string | null;
    }>;

    const rawIds = rows.map((row) => row.raw_entry_id);
    const { data: rawRows, error: rawError } = await args.adminClient
      .from('entries_raw')
      .select('id, raw_text, transcript_text')
      .in('id', rawIds);

    if (rawError) {
      throw new Error(`Failed to load entry raw rows: ${String(rawError.message ?? rawError)}`);
    }

    const rawMap = new Map<string, { raw_text: string | null; transcript_text: string | null }>(
      ((rawRows ?? []) as Array<{ id: string; raw_text: string | null; transcript_text: string | null }>).map((row) => [
        row.id,
        {
          raw_text: row.raw_text,
          transcript_text: row.transcript_text,
        },
      ])
    );

    const rowMap = new Map<string, (typeof rows)[number]>(rows.map((row) => [row.id, row]));

    for (const candidateId of validIds) {
      if (requests.length >= args.maxRequests) {
        break;
      }

      consumed += 1;
      const row = rowMap.get(candidateId);
      if (!row) {
        immediateFailed += 1;
        continue;
      }

      const raw = rawMap.get(row.raw_entry_id);
      const sourceText = parseString(raw?.raw_text) ?? parseString(raw?.transcript_text) ?? row.body;
      const request = buildEntriesBatchRequest({
        normalizedRow: row,
        sourceText,
        model: args.model,
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
          model: args.model,
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
          model: args.model,
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
    const serviceRoleKey = getServiceRoleKey();
    const internalToken = getInternalToken();
    const adminAllowlist = getAdminAllowlist();

    const adminClient = createClient(supabaseRuntimeEnv.supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

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
    if (!action || (action !== 'start' && action !== 'status' && action !== 'worker_tick' && action !== 'access')) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step: 'validated',
        code: 'INPUT_INVALID',
        message: 'Invalid action. Use start, status, worker_tick, access.',
      });
    }

    const internalHeaderToken = request.headers.get('x-admin-internal-token')?.trim() ?? '';
    const isInternal = internalToken.length > 0 && internalHeaderToken === internalToken;

    let userId: string | null = null;
    if (!isInternal || action === 'start' || action === 'status' || action === 'access') {
      try {
        const authResult = await authenticateAdmin({
          request,
          supabaseUrl: supabaseRuntimeEnv.supabaseUrl,
          supabaseAnonKey: supabaseRuntimeEnv.supabaseAnonKey,
          allowlist: adminAllowlist,
        });
        userId = authResult.userId;
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
          message: message === 'Forbidden' ? 'You are not allowlisted for this action.' : message,
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

    if (action === 'start') {
      step = 'starting';
      const runtimeEnv = getFunctionRuntimeEnv();

      const selectedTypes = parseSelectedTypes((body as StartBody).selectedTypes);
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

      const candidateMap = new Map<StepType, unknown[]>();
      for (const selectedType of selectedTypes) {
        if (selectedType === 'entries_normalized') {
          const candidateIds = await loadEntriesOutdatedCandidateIds({
            adminClient,
            model: runtimeEnv.openAiModel,
          });
          candidateMap.set(selectedType, candidateIds);
        } else if (selectedType === 'day_journals') {
          const candidates = await loadDayCandidates({ adminClient });
          candidateMap.set(selectedType, candidates);
        } else if (selectedType === 'week_reflections') {
          const candidates = await loadReflectionCandidates({ adminClient, periodType: 'week' });
          candidateMap.set(selectedType, candidates);
        } else if (selectedType === 'month_reflections') {
          const candidates = await loadReflectionCandidates({ adminClient, periodType: 'month' });
          candidateMap.set(selectedType, candidates);
        }
      }

      const now = new Date().toISOString();
      const { data: jobRow, error: jobInsertError } = await adminClient
        .from('admin_regeneration_jobs')
        .insert({
          created_by: userId,
          status: 'queued',
          selected_types: selectedTypes,
          options: {
            submit_base_wait_ms: SUBMIT_BASE_WAIT_MS,
            submit_jitter_max_ms: SUBMIT_JITTER_MAX_MS,
            max_estimated_prompt_tokens_per_sub_batch: MAX_ESTIMATED_PROMPT_TOKENS_PER_SUB_BATCH,
          },
          summary: {},
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

      const stepInserts = selectedTypes.map((stepType) => {
        const candidates = candidateMap.get(stepType) ?? [];
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
