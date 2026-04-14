import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildReflectionPromptSpec, REFLECTION_PROMPT_VERSION } from '../_shared/prompt-specs.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildChatCompletionsDebugRequest, buildOpenAiDebugMetadata, loadOpenAiDebugStorageSettings, resolveOpenAiDebugStorageForFlow } from '../_shared/openai-debug-storage.ts';

type GenerateReflectionRequest = {
  periodType?: unknown;
  anchorDate?: unknown;
  forceRegenerate?: unknown;
};

type GenerateReflectionResponse = {
  status: 'ok';
  flow: 'generate-reflection';
  requestId: string;
  flowId: string;
  reflectionId: string;
  periodType: 'week' | 'month';
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  modelVersion: string;
};

type DayJournalRow = {
  journal_date: string;
  summary: string;
  narrative_text: string;
  sections: unknown;
};

type ReflectionDraft = {
  summaryText: string;
  narrativeText: string;
  highlights: string[];
  reflectionPoints: string[];
};

type ReflectionComposeFailureReason =
  | 'no_ai_result'
  | 'parse_incomplete'
  | 'empty_field_after_cleanup'
  | 'invalid_shape';

type ReflectionComposeResult =
  | {
      ok: true;
      draft: ReflectionDraft;
    }
  | {
      ok: false;
      reason: ReflectionComposeFailureReason;
      details?: Record<string, unknown>;
    };

type OpenAiJson = Record<string, unknown>;

const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const FLOW = 'generate-reflection' as const;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NO_SPEECH_MARKER = 'geen spraak herkend in audio-opname';
const FORBIDDEN_REFLECTION_PHRASES = ['dit thema kwam meerdere keren terug'];
const FORBIDDEN_REFLECTION_PREFIX =
  /^(inzicht|ochtend|middag|avond|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\s*:?\b/i;

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

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function sanitizeLine(value: string): string {
  return normalizeWhitespace(value);
}

function sanitizeSummaryLine(value: string): string {
  return normalizeWhitespace(value);
}

function normalizeForCompare(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
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

function containsNoSpeechMarker(value: string): boolean {
  return normalizeForCompare(value).includes(NO_SPEECH_MARKER);
}

function cleanReflectionSummary(summary: string): string {
  return sanitizeSummaryLine(summary);
}

function cleanReflectionNarrative(value: string): string {
  const normalized = value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return normalized;
}

function countWords(value: string): number {
  return normalizeWhitespace(value)
    .split(' ')
    .filter((token) => token.length > 0).length;
}

function startsForbiddenReflectionPrefix(value: string): boolean {
  return FORBIDDEN_REFLECTION_PREFIX.test(value.trim());
}

function containsForbiddenReflectionPhrase(value: string): boolean {
  const normalized = normalizeForCompare(value);
  return FORBIDDEN_REFLECTION_PHRASES.some((phrase) => normalized.includes(phrase));
}

function looksTruncatedReflectionLine(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (/[.!?]$/.test(trimmed)) {
    return false;
  }
  if (/[,;:]$/.test(trimmed)) {
    return true;
  }
  const tail = normalizeForCompare(trimmed.slice(-36));
  return [' en', ' maar', ' omdat', ' terwijl', ' toen', ' dat', ' die', ' dus', ' waardoor', ' waarna', ' zodat']
    .some((suffix) => tail.endsWith(suffix));
}

function cleanReflectionList(
  values: string[],
  options: {
    minItems: number;
    maxItems: number;
    maxWords: number;
  }
): string[] {
  const cleaned = values
    .map((value) => sanitizeLine(value))
    .filter((value) => value.length > 0)
    .filter((value) => !containsNoSpeechMarker(value))
    .filter((value) => !startsForbiddenReflectionPrefix(value))
    .filter((value) => !containsForbiddenReflectionPhrase(value))
    .filter((value) => !looksTruncatedReflectionLine(value))
    .filter((value) => countWords(value) <= options.maxWords);

  const deduped = dedupeLines(cleaned).slice(0, options.maxItems);
  if (deduped.length < options.minItems) {
    return [];
  }
  return deduped;
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

function parsePeriodType(value: unknown): 'week' | 'month' | null {
  const parsed = parseString(value)?.toLowerCase();
  if (parsed === 'week' || parsed === 'month') {
    return parsed;
  }

  return null;
}

function parseForceRegenerate(value: unknown): boolean {
  return value === true;
}

function parseAnchorDate(value: unknown): string | null {
  const parsed = parseString(value);
  if (!parsed) {
    return null;
  }

  if (!DATE_PATTERN.test(parsed)) {
    throw new Error('Invalid anchorDate. Use YYYY-MM-DD.');
  }

  const parsedDate = new Date(`${parsed}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== parsed) {
    throw new Error('Invalid anchorDate. Use YYYY-MM-DD.');
  }

  return parsed;
}

function getUtcTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
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

async function callOpenAiJson(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  step: string;
  operation: string;
  promptVersion: string;
  systemPrompt: string;
  userPrompt: string;
  debugStore?: { store: boolean; metadata?: Record<string, string> };
}): Promise<OpenAiJson | null> {
  try {
    const startedAt = Date.now();
    logFlow('info', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: 'api_call_start',
      details: {
        operation: args.operation,
        provider: 'openai',
        model: args.model,
        debugStoreEnabled: args.debugStore?.store === true,
      },
    });
    const requestBody: Record<string, unknown> = {
      model: args.model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: args.systemPrompt,
        },
        {
          role: 'user',
          content: `${args.userPrompt}\nPromptVersion: ${args.promptVersion}\nRequestId: ${args.requestId}`,
        },
      ],
    };
    if (args.debugStore !== undefined) {
      requestBody.store = args.debugStore.store;
      if (args.debugStore.store) {
        requestBody.metadata = args.debugStore.metadata;
      }
    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const durationMs = Date.now() - startedAt;
      logFlow('error', {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: args.step,
        event: 'api_call_error',
        details: {
          operation: args.operation,
          provider: 'openai',
          model: args.model,
          status: response.status,
          durationMs,
        },
      });
      logFlow('error', {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: args.step,
        event: 'openai_call_failed',
        details: {
          status: response.status,
          body: errorBody,
        },
      });
      return null;
    }
    const durationMs = Date.now() - startedAt;
    logFlow('info', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: 'api_call_success',
      details: {
        operation: args.operation,
        provider: 'openai',
        model: args.model,
        durationMs,
      },
    });

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    return JSON.parse(content) as OpenAiJson;
  } catch (error) {
    logFlow('error', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: 'api_call_error',
      details: {
        operation: args.operation,
        provider: 'openai',
        model: args.model,
        error: error instanceof Error ? error.message : String(error),
      },
    });
    logFlow('error', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: 'openai_response_parse_failed',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return null;
  }
}

function sanitizeDayJournalRows(rows: DayJournalRow[]): DayJournalRow[] {
  return rows.map((row) => ({
    journal_date: row.journal_date,
    summary: containsNoSpeechMarker(parseString(row.summary) ?? '') ? '' : parseString(row.summary) ?? '',
    narrative_text: containsNoSpeechMarker(parseString(row.narrative_text) ?? '')
      ? ''
      : parseString(row.narrative_text) ?? '',
    sections: Array.isArray(row.sections) ? row.sections : [],
  }));
}

async function composeReflection(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  periodType: 'week' | 'month';
  periodStart: string;
  periodEnd: string;
  dayJournals: DayJournalRow[];
  debugStore?: { store: boolean; metadata?: Record<string, string> };
}): Promise<ReflectionComposeResult> {
  if (args.dayJournals.length === 0) {
    return {
      ok: false,
      reason: 'invalid_shape',
      details: { dayJournalCount: 0 },
    };
  }

  const reflectionPrompt = buildReflectionPromptSpec({
    periodType: args.periodType,
    periodStart: args.periodStart,
    periodEnd: args.periodEnd,
    dayJournals: args.dayJournals,
  });
  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: 'reflection_upserted',
    operation: 'openai_generate_reflection',
    promptVersion: reflectionPrompt.promptVersion,
    systemPrompt: reflectionPrompt.systemPrompt,
    userPrompt: reflectionPrompt.userPrompt,
    debugStore: args.debugStore,
  });

  if (!aiResult) {
    return { ok: false, reason: 'no_ai_result' };
  }

  const summaryRaw = parseString(aiResult.summaryText);
  const narrativeRaw = parseString(aiResult.narrativeText);
  const highlightsRaw = parseStringArray(aiResult.highlights);
  const reflectionPointsRaw = parseStringArray(aiResult.reflectionPoints);

  if (!summaryRaw || !narrativeRaw || highlightsRaw.length === 0 || reflectionPointsRaw.length === 0) {
    return {
      ok: false,
      reason: 'parse_incomplete',
      details: {
        hasSummary: Boolean(summaryRaw),
        hasNarrative: Boolean(narrativeRaw),
        highlightCount: highlightsRaw.length,
        reflectionPointCount: reflectionPointsRaw.length,
      },
    };
  }

  const summaryText = cleanReflectionSummary(summaryRaw);
  const narrativeText =
    !containsNoSpeechMarker(narrativeRaw) ? cleanReflectionNarrative(narrativeRaw) : '';
  const highlights = cleanReflectionList(highlightsRaw, {
    minItems: 2,
    maxItems: 6,
    maxWords: 25,
  });
  const reflectionPoints = cleanReflectionList(reflectionPointsRaw, {
    minItems: 2,
    maxItems: 5,
    maxWords: 30,
  });

  if (!summaryText || !narrativeText) {
    return {
      ok: false,
      reason: 'empty_field_after_cleanup',
      details: {
        hasSummary: Boolean(summaryText),
        hasNarrative: Boolean(narrativeText),
      },
    };
  }

  if (highlights.length < 2 || reflectionPoints.length < 2) {
    return {
      ok: false,
      reason: 'invalid_shape',
      details: {
        highlightCount: highlights.length,
        reflectionPointCount: reflectionPoints.length,
      },
    };
  }

  return {
    ok: true,
    draft: {
      summaryText,
      narrativeText,
      highlights,
      reflectionPoints,
    },
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

  if (request.method !== 'POST') {
    return errorResponse({
      request,
      httpStatus: 405,
      requestId,
      flowId,
      step: 'received',
      code: 'INPUT_INVALID',
      message: 'Method not allowed',
      details: { method: request.method },
    });
  }

  let step = 'received';

  try {
    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'start',
    });

    const runtimeEnv = getFunctionRuntimeEnv();

    // Load debug storage policy for this flow (best-effort; no-op on error)
    let debugStore: { store: boolean; metadata?: Record<string, string> } | undefined;
    try {
      const serviceRoleKey =
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
        Deno.env.get('APP_SUPABASE_SERVICE_ROLE_KEY')?.trim() ??
        '';
      if (serviceRoleKey) {
        const adminClient = createClient(runtimeEnv.supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const debugSettings = await loadOpenAiDebugStorageSettings(adminClient);
        const resolution = resolveOpenAiDebugStorageForFlow({
          settings: debugSettings,
          flowKey: 'generate-reflection.generation',
          endpointFamily: 'chat_completions',
        });
        const metadata = buildOpenAiDebugMetadata({
          app: 'persoonlijke-assistent',
          env: Deno.env.get('APP_ENV') ?? 'production',
          flow: 'generate-reflection',
          functionName: 'generate-reflection',
          taskKey: 'reflection_generation',
          runtimeFamily: 'reflection',
          requestId,
          flowId,
          mode: 'generation',
          version: '1',
          actor: 'user',
        });
        debugStore = buildChatCompletionsDebugRequest({ resolution, metadata });
      }
    } catch {
      // debug storage policy load is non-fatal; continue without
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return errorResponse({
        request,
        httpStatus: 401,
        requestId,
        flowId,
        step: 'authenticated',
        code: 'AUTH_MISSING',
        message: 'Missing Authorization header',
      });
    }

    step = 'authenticated';
    const supabase = createClient(runtimeEnv.supabaseUrl, runtimeEnv.supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      logFlow('warn', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'auth_failed',
        details: {
          error: authError ? String(authError.message ?? authError) : 'missing user',
        },
      });
      return errorResponse({
        request,
        httpStatus: 401,
        requestId,
        flowId,
        step,
        code: 'AUTH_UNAUTHORIZED',
        message: 'Unauthorized',
      });
    }

    let body: GenerateReflectionRequest;

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

      body = parsedBody as GenerateReflectionRequest;
    } catch (_error) {
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

    step = 'validated';
    const periodType = parsePeriodType(body.periodType);
    if (!periodType) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: 'periodType must be week or month',
      });
    }

    let anchorDate: string;
    try {
      anchorDate = parseAnchorDate(body.anchorDate) ?? getUtcTodayDate();
    } catch (error) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: error instanceof Error ? error.message : 'Invalid anchorDate. Use YYYY-MM-DD.',
      });
    }
    const forceRegenerate = parseForceRegenerate(body.forceRegenerate);
    const bounds = computePeriodBounds(periodType, anchorDate);

    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'validated',
      details: {
        userId: authData.user.id,
        periodType,
        periodStart: bounds.periodStart,
        periodEnd: bounds.periodEnd,
        forceRegenerate,
      },
    });

    step = 'existing_checked';
    const { data: existingReflection, error: existingError } = await supabase
      .from('period_reflections')
      .select('id, generated_at, model_version')
      .eq('user_id', authData.user.id)
      .eq('period_type', periodType)
      .eq('period_start', bounds.periodStart)
      .eq('period_end', bounds.periodEnd)
      .maybeSingle();

    if (existingError) {
      logFlow('error', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'select_existing_failed',
        details: {
          error: String(existingError.message ?? existingError),
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_READ_FAILED',
        message: 'Failed to read existing reflection',
      });
    }

    if (existingReflection && !forceRegenerate) {
      logFlow('info', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'existing_reflection_reused',
        details: {
          reflectionId: existingReflection.id,
        },
      });

      const response: GenerateReflectionResponse = {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        reflectionId: existingReflection.id,
        periodType,
        periodStart: bounds.periodStart,
        periodEnd: bounds.periodEnd,
        generatedAt: existingReflection.generated_at,
        modelVersion: existingReflection.model_version,
      };

      return jsonResponse(request, 200, response);
    }

    step = 'day_journals_loaded';
    const { data: dayJournals, error: dayJournalsError } = await supabase
      .from('day_journals')
      .select('journal_date, summary, narrative_text, sections')
      .eq('user_id', authData.user.id)
      .gte('journal_date', bounds.periodStart)
      .lte('journal_date', bounds.periodEnd)
      .order('journal_date', { ascending: true });

    if (dayJournalsError) {
      logFlow('error', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'select_day_journals_failed',
        details: {
          error: String(dayJournalsError.message ?? dayJournalsError),
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_READ_FAILED',
        message: 'Failed to load day journals',
      });
    }

    const safeDayJournals = sanitizeDayJournalRows((dayJournals ?? []) as DayJournalRow[]);

    step = 'reflection_upserted';
    const reflectionResult = await composeReflection({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      periodType,
      periodStart: bounds.periodStart,
      periodEnd: bounds.periodEnd,
      dayJournals: safeDayJournals,
      debugStore,
    });

    if (!reflectionResult.ok) {
      logFlow('warn', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'reflection_fallback_used',
        details: {
          reason: reflectionResult.reason,
          ...(reflectionResult.details ?? {}),
        },
      });

      return errorResponse({
        request,
        httpStatus: 502,
        requestId,
        flowId,
        step,
        code: 'UPSTREAM_UNAVAILABLE',
        message: 'Reflection generation failed quality gate',
        details: {
          reason: reflectionResult.reason,
          ...(reflectionResult.details ?? {}),
        },
      });
    }

    const generatedAt = new Date().toISOString();
    const modelVersion = `${runtimeEnv.openAiModel}:${REFLECTION_PROMPT_VERSION}`;

    const { data: upsertedReflection, error: upsertError } = await supabase
      .from('period_reflections')
      .upsert(
        {
          user_id: authData.user.id,
          period_type: periodType,
          period_start: bounds.periodStart,
          period_end: bounds.periodEnd,
          summary_text: reflectionResult.draft.summaryText,
          narrative_text: reflectionResult.draft.narrativeText,
          highlights_json: reflectionResult.draft.highlights,
          reflection_points_json: reflectionResult.draft.reflectionPoints,
          generated_at: generatedAt,
          model_version: modelVersion,
        },
        { onConflict: 'user_id,period_type,period_start,period_end' }
      )
      .select('id, generated_at, model_version')
      .single();

    if (upsertError || !upsertedReflection) {
      logFlow('error', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'upsert_failed',
        details: {
          error: upsertError ? String(upsertError.message ?? upsertError) : 'missing row',
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_WRITE_FAILED',
        message: 'Failed to store reflection',
      });
    }

    step = 'completed';
    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'success',
      details: {
        periodType,
        periodStart: bounds.periodStart,
        periodEnd: bounds.periodEnd,
        dayJournalCount: safeDayJournals.length,
        reflectionId: upsertedReflection.id,
      },
    });

    const response: GenerateReflectionResponse = {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      reflectionId: upsertedReflection.id,
      periodType,
      periodStart: bounds.periodStart,
      periodEnd: bounds.periodEnd,
      generatedAt: upsertedReflection.generated_at,
      modelVersion: upsertedReflection.model_version,
    };

    return jsonResponse(request, 200, response);
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
      message: 'Internal error',
    });
  }
});
