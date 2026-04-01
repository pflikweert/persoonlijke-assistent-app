import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';

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
  sections: unknown;
};

type ReflectionDraft = {
  summaryText: string;
  highlights: string[];
  reflectionPoints: string[];
};

type OpenAiJson = Record<string, unknown>;

const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const FLOW = 'generate-reflection' as const;
const REFLECTION_PROMPT_VERSION = 'period-reflection.v1.phase1';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_SUMMARY_LENGTH = 280;
const MAX_LIST_ITEM_LENGTH = 140;
const HEAVY_LANGUAGE_PATTERNS = [
  /\btrauma\b/i,
  /\bdepress/i,
  /\bstoornis\b/i,
  /\bdiagnose\b/i,
  /\bheling\b/i,
  /\btherapie\b/i,
  /\bdiepgeworteld\b/i,
];
const GENERIC_REFLECTION_PATTERNS = [
  /belangrijkste momenten/i,
  /samengevoegd/i,
  /algemene/i,
  /inzicht/i,
  /reflectie/i,
];

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

function sanitizeLine(value: string, maxLength: number): string {
  return normalizeWhitespace(value).slice(0, maxLength);
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

function containsHeavyLanguage(value: string): boolean {
  return HEAVY_LANGUAGE_PATTERNS.some((pattern) => pattern.test(value));
}

function looksGenericReflectionText(value: string): boolean {
  const normalized = normalizeWhitespace(value);
  if (normalized.length < 16) {
    return true;
  }

  return GENERIC_REFLECTION_PATTERNS.some((pattern) => pattern.test(normalized));
}

function cleanReflectionSummary(summary: string, fallback: string): string {
  const cleaned = sanitizeLine(summary, MAX_SUMMARY_LENGTH);
  if (!cleaned || looksGenericReflectionText(cleaned) || containsHeavyLanguage(cleaned)) {
    return sanitizeLine(fallback, MAX_SUMMARY_LENGTH);
  }

  return cleaned;
}

function cleanReflectionList(values: string[], fallback: string[], maxItems: number): string[] {
  const preferred = values.length > 0 ? values : fallback;
  const cleaned = preferred
    .map((value) => sanitizeLine(value, MAX_LIST_ITEM_LENGTH))
    .filter((value) => value.length > 0)
    .filter((value) => !containsHeavyLanguage(value))
    .filter((value) => !looksGenericReflectionText(value));

  return dedupeLines(cleaned).slice(0, maxItems);
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

function fallbackReflection(periodType: 'week' | 'month', journalCount: number): ReflectionDraft {
  if (journalCount === 0) {
    return {
      summaryText:
        periodType === 'week'
          ? 'Geen dagjournals gevonden voor deze week. Leg eerst een notitie vast.'
          : 'Geen dagjournals gevonden voor deze maand. Leg eerst een notitie vast.',
      highlights: [],
      reflectionPoints: [],
    };
  }

  return {
    summaryText: `${journalCount} dag(en) met concrete notities samengevat voor deze ${periodType === 'week' ? 'week' : 'maand'}.`,
    highlights: ['Belangrijke concrete punten uit je dagjournals op een rij.'],
    reflectionPoints: ['Kies 1 klein, praktisch aandachtspunt voor de volgende periode.'],
  };
}

async function callOpenAiJson(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  step: string;
  userPrompt: string;
}): Promise<OpenAiJson | null> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: args.model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Maak een rustige periodereflectie op basis van dagjournals. Blijf feitelijk, compact, praktisch en brongetrouw. Geen therapietaal, diagnose-taal of zware psychologische interpretaties. Geef alleen JSON terug met summaryText, highlights, reflectionPoints.',
          },
          {
            role: 'user',
            content: `${args.userPrompt}\nPromptVersion: ${REFLECTION_PROMPT_VERSION}\nRequestId: ${args.requestId}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
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
    summary: parseString(row.summary) ?? '',
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
}): Promise<ReflectionDraft> {
  const fallback = fallbackReflection(args.periodType, args.dayJournals.length);
  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: 'reflection_upserted',
    userPrompt: JSON.stringify({
      instruction:
        'Vat de periode samen in concrete taal, noem korte unieke highlights en praktische reflectiepunten. Geen aannames buiten de input, geen therapie/diepte-duiding.',
      periodType: args.periodType,
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      dayJournals: args.dayJournals,
    }),
  });

  if (!aiResult) {
    return fallback;
  }

  const summaryText = cleanReflectionSummary(
    parseString(aiResult.summaryText) ?? fallback.summaryText,
    fallback.summaryText
  );
  const highlights = cleanReflectionList(parseStringArray(aiResult.highlights), fallback.highlights, 3);
  const reflectionPoints = cleanReflectionList(
    parseStringArray(aiResult.reflectionPoints),
    fallback.reflectionPoints,
    3
  );

  return {
    summaryText,
    highlights,
    reflectionPoints,
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
      .select('journal_date, summary, sections')
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
    const reflection = await composeReflection({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      periodType,
      periodStart: bounds.periodStart,
      periodEnd: bounds.periodEnd,
      dayJournals: safeDayJournals,
    });

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
          summary_text: reflection.summaryText,
          highlights_json: reflection.highlights,
          reflection_points_json: reflection.reflectionPoints,
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
