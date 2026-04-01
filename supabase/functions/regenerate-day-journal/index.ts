import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';

type RegenerateDayJournalRequest = {
  journalDate?: unknown;
};

type RegenerateDayJournalResponse = {
  status: 'ok';
  flow: 'regenerate-day-journal';
  requestId: string;
  flowId: string;
  journalDate: string;
  dayJournalId: string;
  updatedAt: string;
};

type NormalizedEntry = {
  title: string;
  body: string;
};

type DayJournalDraft = {
  summary: string;
  narrativeText: string;
  sections: string[];
};

type OpenAiJson = Record<string, unknown>;

const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const FLOW = 'regenerate-day-journal' as const;
const DAY_COMPOSITION_PROMPT_VERSION = 'day-composition.v1.phase1';
const NO_SPEECH_TRANSCRIPT = 'Geen spraak herkend in audio-opname.';
const LOW_CONTENT_TITLE = 'Audio-opname zonder spraak';
const GENERIC_DAY_PHRASES = [
  'belangrijkste momenten',
  'samengevoegd',
  'notities vastgelegd',
  'algemene samenvatting',
];
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

function sanitizeShortLine(value: string, maxLength: number): string {
  return normalizeWhitespace(value).slice(0, maxLength);
}

function sanitizeSummaryLine(value: string, maxLength: number): string {
  const normalized = normalizeWhitespace(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, maxLength);
  const boundary = Math.max(
    sliced.lastIndexOf('. '),
    sliced.lastIndexOf('; '),
    sliced.lastIndexOf(', '),
    sliced.lastIndexOf(' ')
  );
  let candidate = boundary > maxLength * 0.55 ? sliced.slice(0, boundary).trim() : sliced.trim();

  while (/\b(en|of|maar|met|voor|daarna|waarna|ook|omdat|een|de|het)$/i.test(candidate)) {
    candidate = candidate.replace(/\s+\S+$/u, '').trim();
  }

  if (candidate && !/[.!?]$/.test(candidate)) {
    candidate = `${candidate}.`;
  }

  return candidate;
}

function normalizeForCompare(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function dedupeByNormalizedValue(items: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const item of items) {
    const key = normalizeForCompare(item);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    output.push(item);
  }

  return output;
}

function looksGenericDayText(value: string): boolean {
  const normalized = normalizeForCompare(value);
  if (normalized.length < 12) {
    return true;
  }

  return GENERIC_DAY_PHRASES.some((phrase) => normalized.includes(phrase));
}

function containsNoSpeechMarker(value: string): boolean {
  return normalizeForCompare(value).includes(normalizeForCompare(NO_SPEECH_TRANSCRIPT));
}

function isLowContentEntry(entry: NormalizedEntry): boolean {
  return (
    containsNoSpeechMarker(entry.title) ||
    containsNoSpeechMarker(entry.body) ||
    normalizeForCompare(entry.title) === normalizeForCompare(LOW_CONTENT_TITLE)
  );
}

function fallbackDayJournal(entries: NormalizedEntry[]): DayJournalDraft {
  if (entries.length === 0) {
    return {
      summary: 'Nog geen bruikbare notities voor deze dag.',
      narrativeText: '',
      sections: [],
    };
  }

  const narrativeText = entries
    .map((entry) => sanitizeShortLine(entry.body, 320))
    .filter((entry) => entry.length > 0)
    .slice(0, 4)
    .map((entry) => (/[.!?]$/.test(entry) ? entry : `${entry}.`))
    .join(' ');

  const sections = entries
    .map((entry) => sanitizeShortLine(entry.title, 80))
    .filter((entry) => entry.length > 0)
    .slice(0, 4);

  const firstSentence = narrativeText.split(/[.!?]/)[0]?.trim() ?? '';
  const fallbackSummary =
    firstSentence.length >= 24
      ? sanitizeShortLine(/[.!?]$/.test(firstSentence) ? firstSentence : `${firstSentence}.`, 220)
      : entries.length === 1
        ? 'Kern van vandaag: 1 concrete notitie.'
        : `Kern van vandaag: ${entries.length} concrete notities.`;

  return {
    summary: fallbackSummary,
    narrativeText,
    sections,
  };
}

function cleanDaySummary(value: string, fallback: string): string {
  const summary = sanitizeSummaryLine(value, 220);
  if (!summary || looksGenericDayText(summary) || containsNoSpeechMarker(summary)) {
    return sanitizeSummaryLine(fallback, 220);
  }

  return summary;
}

function cleanDayNarrativeText(value: string, fallback: string): string {
  const narrative = sanitizeShortLine(value, 2400);
  const fallbackNarrative = sanitizeShortLine(fallback, 2400);

  if (!narrative || containsNoSpeechMarker(narrative) || looksGenericDayText(narrative)) {
    return fallbackNarrative;
  }

  return narrative;
}

function cleanDaySections(input: {
  candidateSections: string[];
  summary: string;
  fallbackSections: string[];
}): string[] {
  const summaryKey = normalizeForCompare(input.summary);
  const preferred = input.candidateSections.length > 0 ? input.candidateSections : input.fallbackSections;
  const cleaned = preferred
    .map((item) => sanitizeShortLine(item, 90))
    .filter((item) => item.length > 0)
    .filter((item) => !containsNoSpeechMarker(item))
    .filter((item) => !looksGenericDayText(item))
    .filter((item) => {
      const key = normalizeForCompare(item);
      return !summaryKey || key !== summaryKey;
    });

  return dedupeByNormalizedValue(cleaned).slice(0, 5);
}

function parseSections(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const parsed = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .map((item) => sanitizeShortLine(item, 90))
    .filter((item) => item.length > 0);

  return dedupeByNormalizedValue(parsed).slice(0, 5);
}

function dateBoundsUtc(journalDate: string): { start: string; end: string } {
  const start = `${journalDate}T00:00:00.000Z`;
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

  return {
    start,
    end: endDate.toISOString(),
  };
}

function parseJournalDate(value: unknown): string | null {
  const parsed = parseString(value);
  if (!parsed || !DATE_PATTERN.test(parsed)) {
    return null;
  }

  const date = new Date(`${parsed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== parsed) {
    return null;
  }

  return parsed;
}

async function callOpenAiJson(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  step: string;
  promptVersion: string;
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
              'Maak een rustige, brongetrouwe dagboekdag op basis van notities. Geen therapietaal, geen diagnoses, geen coachtoon en geen interpretaties. Geef alleen JSON terug met summary, narrativeText en sections.',
          },
          {
            role: 'user',
            content: `${args.userPrompt}\nPromptVersion: ${args.promptVersion}\nRequestId: ${args.requestId}`,
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

async function composeDayJournal(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  journalDate: string;
  normalizedEntries: NormalizedEntry[];
}): Promise<DayJournalDraft> {
  const contentEntries = args.normalizedEntries.filter((entry) => !isLowContentEntry(entry));
  const fallback = fallbackDayJournal(contentEntries);

  if (contentEntries.length === 0) {
    return fallback;
  }

  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: 'day_journal_upserted',
    promptVersion: DAY_COMPOSITION_PROMPT_VERSION,
    userPrompt: JSON.stringify({
      instruction:
        'Vat de dag samen in 1-2 concrete zinnen (summary), schrijf daarna een natuurlijk verhalende dagtekst dicht bij de bron (narrativeText), en geef 2-5 unieke sections met korte kernpunten. Geen herhaling, geen nieuwe informatie, geen fallbackmarkers en geen meta-zinnen over aantallen notities.',
      journalDate: args.journalDate,
      entries: contentEntries,
    }),
  });

  if (!aiResult) {
    return fallback;
  }

  const summary = cleanDaySummary(parseString(aiResult.summary) ?? fallback.summary, fallback.summary);
  const narrativeText = cleanDayNarrativeText(
    parseString(aiResult.narrativeText) ?? fallback.narrativeText,
    fallback.narrativeText
  );
  const parsedSections = parseSections(aiResult.sections);
  const sections = cleanDaySections({
    candidateSections: parsedSections,
    summary,
    fallbackSections: fallback.sections,
  });

  return {
    summary,
    narrativeText,
    sections,
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

    let body: RegenerateDayJournalRequest;
    try {
      const parsed = await request.json();
      if (!parsed || typeof parsed !== 'object') {
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
      body = parsed as RegenerateDayJournalRequest;
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

    const journalDate = parseJournalDate(body.journalDate);
    if (!journalDate) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step: 'validated',
        code: 'INPUT_INVALID',
        message: 'Invalid journalDate. Use YYYY-MM-DD.',
      });
    }

    const bounds = dateBoundsUtc(journalDate);

    step = 'entries_loaded';
    const { data: rawEntriesForDay, error: dayRawError } = await supabase
      .from('entries_raw')
      .select('id')
      .eq('user_id', authData.user.id)
      .gte('captured_at', bounds.start)
      .lt('captured_at', bounds.end);

    if (dayRawError) {
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_READ_FAILED',
        message: 'Failed to load entries for day journal',
      });
    }

    const rawIds = (rawEntriesForDay ?? []).map((entry: { id: string }) => entry.id);
    const normalizedEntriesForDay: NormalizedEntry[] = [];

    if (rawIds.length > 0) {
      const { data: dayNormalizedRows, error: dayNormalizedError } = await supabase
        .from('entries_normalized')
        .select('title, body')
        .eq('user_id', authData.user.id)
        .in('raw_entry_id', rawIds);

      if (dayNormalizedError) {
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: 'DB_READ_FAILED',
          message: 'Failed to compose day journal',
        });
      }

      for (const row of dayNormalizedRows ?? []) {
        normalizedEntriesForDay.push({
          title: row.title,
          body: row.body,
        });
      }
    }

    step = 'day_journal_upserted';
    const dayDraft = await composeDayJournal({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      journalDate,
      normalizedEntries: normalizedEntriesForDay,
    });

    const updatedAt = new Date().toISOString();
    const { data: dayJournal, error: dayJournalError } = await supabase
      .from('day_journals')
      .upsert(
        {
          user_id: authData.user.id,
          journal_date: journalDate,
          summary: dayDraft.summary,
          narrative_text: dayDraft.narrativeText,
          sections: dayDraft.sections,
          updated_at: updatedAt,
        },
        { onConflict: 'user_id,journal_date' }
      )
      .select('id')
      .single();

    if (dayJournalError || !dayJournal) {
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_WRITE_FAILED',
        message: 'Failed to upsert day journal',
      });
    }

    const response: RegenerateDayJournalResponse = {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      journalDate,
      dayJournalId: dayJournal.id,
      updatedAt,
    };

    return jsonResponse(request, 200, response);
  } catch (error) {
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
