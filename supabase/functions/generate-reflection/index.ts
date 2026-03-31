import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';

type GenerateReflectionRequest = {
  periodType?: unknown;
  anchorDate?: unknown;
  forceRegenerate?: unknown;
};

type GenerateReflectionResponse = {
  status: 'ok';
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
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const REFLECTION_PROMPT_VERSION = 'period-reflection.v1.phase1';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

function parseString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
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
          ? 'Geen dagjournals gevonden voor deze week.'
          : 'Geen dagjournals gevonden voor deze maand.',
      highlights: [],
      reflectionPoints: [],
    };
  }

  return {
    summaryText: `${journalCount} dag(en) samengevat voor deze ${periodType === 'week' ? 'week' : 'maand'}.`,
    highlights: ['Belangrijkste momenten zijn samengevoegd uit je dagjournals.'],
    reflectionPoints: ['Kies 1 klein concreet verbeterpunt voor de volgende periode.'],
  };
}

async function callOpenAiJson(args: {
  apiKey: string;
  model: string;
  requestId: string;
  userPrompt: string;
}): Promise<OpenAiJson | null> {
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
            'Maak een nuchtere periodereflectie op basis van dagjournals. Blijf feitelijk, compact en brongetrouw. Geen therapietaal. Geef alleen JSON terug met summaryText, highlights, reflectionPoints.',
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
    console.error('[generate-reflection] openai_call_failed', {
      requestId: args.requestId,
      status: response.status,
      body: errorBody,
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

  try {
    return JSON.parse(content) as OpenAiJson;
  } catch (_error) {
    console.error('[generate-reflection] openai_json_parse_failed', { requestId: args.requestId });
    return null;
  }
}

async function composeReflection(args: {
  apiKey: string;
  model: string;
  requestId: string;
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
    userPrompt: JSON.stringify({
      instruction:
        'Vat de periode samen, noem korte highlights en praktische reflectiepunten. Geen diagnoses, geen aannames buiten de input.',
      periodType: args.periodType,
      periodStart: args.periodStart,
      periodEnd: args.periodEnd,
      dayJournals: args.dayJournals,
    }),
  });

  if (!aiResult) {
    return fallback;
  }

  const summaryText = parseString(aiResult.summaryText) ?? fallback.summaryText;
  const highlights = parseStringArray(aiResult.highlights);
  const reflectionPoints = parseStringArray(aiResult.reflectionPoints);

  return {
    summaryText,
    highlights: highlights.length > 0 ? highlights : fallback.highlights,
    reflectionPoints: reflectionPoints.length > 0 ? reflectionPoints : fallback.reflectionPoints,
  };
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: buildCorsHeaders(request),
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse(request, 405, { error: 'Method not allowed' });
  }

  const requestId = crypto.randomUUID();

  try {
    const runtimeEnv = getFunctionRuntimeEnv();
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return jsonResponse(request, 401, { error: 'Missing Authorization header' });
    }

    const supabase = createClient(runtimeEnv.supabaseUrl, runtimeEnv.supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return jsonResponse(request, 401, { error: 'Unauthorized' });
    }

    let body: GenerateReflectionRequest;

    try {
      const parsedBody = await request.json();
      if (!parsedBody || typeof parsedBody !== 'object') {
        return jsonResponse(request, 400, { error: 'Invalid JSON body' });
      }

      body = parsedBody as GenerateReflectionRequest;
    } catch (_error) {
      return jsonResponse(request, 400, { error: 'Invalid JSON body' });
    }

    const periodType = parsePeriodType(body.periodType);
    if (!periodType) {
      return jsonResponse(request, 400, { error: 'periodType must be week or month' });
    }

    let anchorDate: string;
    try {
      anchorDate = parseAnchorDate(body.anchorDate) ?? getUtcTodayDate();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Invalid anchorDate. Use YYYY-MM-DD.';
      return jsonResponse(request, 400, { error: message });
    }
    const forceRegenerate = parseForceRegenerate(body.forceRegenerate);
    const bounds = computePeriodBounds(periodType, anchorDate);

    console.info('[generate-reflection] start', {
      requestId,
      userId: authData.user.id,
      periodType,
      periodStart: bounds.periodStart,
      periodEnd: bounds.periodEnd,
      forceRegenerate,
    });

    const { data: existingReflection, error: existingError } = await supabase
      .from('period_reflections')
      .select('id, generated_at, model_version')
      .eq('user_id', authData.user.id)
      .eq('period_type', periodType)
      .eq('period_start', bounds.periodStart)
      .eq('period_end', bounds.periodEnd)
      .maybeSingle();

    if (existingError) {
      console.error('[generate-reflection] select_existing_failed', {
        requestId,
        error: existingError,
      });
      return jsonResponse(request, 500, { error: 'Failed to read existing reflection' });
    }

    if (existingReflection && !forceRegenerate) {
      const response: GenerateReflectionResponse = {
        status: 'ok',
        reflectionId: existingReflection.id,
        periodType,
        periodStart: bounds.periodStart,
        periodEnd: bounds.periodEnd,
        generatedAt: existingReflection.generated_at,
        modelVersion: existingReflection.model_version,
      };

      return jsonResponse(request, 200, response);
    }

    const { data: dayJournals, error: dayJournalsError } = await supabase
      .from('day_journals')
      .select('journal_date, summary, sections')
      .eq('user_id', authData.user.id)
      .gte('journal_date', bounds.periodStart)
      .lte('journal_date', bounds.periodEnd)
      .order('journal_date', { ascending: true });

    if (dayJournalsError) {
      console.error('[generate-reflection] select_day_journals_failed', {
        requestId,
        error: dayJournalsError,
      });
      return jsonResponse(request, 500, { error: 'Failed to load day journals' });
    }

    const reflection = await composeReflection({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      periodType,
      periodStart: bounds.periodStart,
      periodEnd: bounds.periodEnd,
      dayJournals: (dayJournals ?? []) as DayJournalRow[],
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
      console.error('[generate-reflection] upsert_failed', {
        requestId,
        error: upsertError,
      });
      return jsonResponse(request, 500, { error: 'Failed to store reflection' });
    }

    console.info('[generate-reflection] success', {
      requestId,
      periodType,
      periodStart: bounds.periodStart,
      periodEnd: bounds.periodEnd,
      dayJournalCount: (dayJournals ?? []).length,
      reflectionId: upsertedReflection.id,
    });

    const response: GenerateReflectionResponse = {
      status: 'ok',
      reflectionId: upsertedReflection.id,
      periodType,
      periodStart: bounds.periodStart,
      periodEnd: bounds.periodEnd,
      generatedAt: upsertedReflection.generated_at,
      modelVersion: upsertedReflection.model_version,
    };

    return jsonResponse(request, 200, response);
  } catch (error) {
    console.error('[generate-reflection] fatal', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
    return jsonResponse(request, 500, { error: 'Internal error' });
  }
});
