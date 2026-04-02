import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import {
  buildDayJournalRepairPromptSpec,
  buildDayJournalPromptSpec,
  createFallbackDayJournal,
  finalizeDayJournalDraft,
  isLowContentDayEntry,
  orderDayJournalEntries,
} from '../_shared/day-journal-contract.mjs';

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
  rawEntryId?: string;
  capturedAt?: string;
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
const NO_SPEECH_TRANSCRIPT = 'Geen spraak herkend in audio-opname.';
const LOW_CONTENT_TITLE = 'Audio-opname zonder spraak';
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
  systemPrompt: string;
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
            content: args.systemPrompt,
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
  strictValidation: boolean;
  softQualityGuards: boolean;
  normalizedEntries: NormalizedEntry[];
}): Promise<DayJournalDraft> {
  const orderedEntries = orderDayJournalEntries(args.normalizedEntries);
  const contentEntries = orderedEntries.filter((entry) =>
    !isLowContentDayEntry(entry, {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
    })
  );

  if (contentEntries.length === 0) {
    return finalizeDayJournalDraft({
      aiResult: null,
      entries: contentEntries,
      options: {
        noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
        lowContentTitle: LOW_CONTENT_TITLE,
        strictValidation: args.strictValidation,
        softQualityGuards: args.softQualityGuards,
      },
    });
  }

  const promptSpec = buildDayJournalPromptSpec({
    journalDate: args.journalDate,
    entries: contentEntries,
  });

  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: 'day_journal_upserted',
    promptVersion: promptSpec.promptVersion,
    systemPrompt: promptSpec.systemPrompt,
    userPrompt: promptSpec.userPrompt,
  });

  const finalized = finalizeDayJournalDraft({
    aiResult,
    entries: contentEntries,
    options: {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
      strictValidation: args.strictValidation,
      softQualityGuards: args.softQualityGuards,
    },
  });

  if (!args.softQualityGuards && finalized.softQualitySignals.length > 0) {
    logFlow('info', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'day_journal_upserted',
      event: 'soft_quality_not_enforced',
      details: {
        reasons: finalized.softQualitySignals,
        softGuardsEnabled: false,
      },
    });
  }

  const narrativeRepairReasons = finalized.narrativeQualityReasons.filter((reason) =>
    ['compressed_narrative', 'stitched_narrative', 'truncated_narrative'].includes(reason)
  );
  const narrativeNeedsRepair =
    args.softQualityGuards && !finalized.usedFallback && narrativeRepairReasons.length > 0;
  if (narrativeNeedsRepair) {
    logFlow('info', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'day_journal_upserted',
      event: narrativeRepairReasons.includes('compressed_narrative') ? 'compressed_detected' : 'narrative_quality_detected',
      details: {
        reasons: narrativeRepairReasons,
      },
    });

    const repairPrompt = buildDayJournalRepairPromptSpec({
      journalDate: args.journalDate,
      entries: contentEntries,
    });

    logFlow('info', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'day_journal_upserted',
      event: 'retry_attempted',
      details: {
        reason: narrativeRepairReasons[0] ?? 'narrative_quality',
      },
    });

    const repairedAiResult = await callOpenAiJson({
      apiKey: args.apiKey,
      model: args.model,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'day_journal_upserted',
      promptVersion: repairPrompt.promptVersion,
      systemPrompt: repairPrompt.systemPrompt,
      userPrompt: repairPrompt.userPrompt,
    });

    const repairedFinalized = finalizeDayJournalDraft({
      aiResult: repairedAiResult,
      entries: contentEntries,
      options: {
        noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
        lowContentTitle: LOW_CONTENT_TITLE,
        strictValidation: args.strictValidation,
        softQualityGuards: args.softQualityGuards,
      },
    });

    const remainingNarrativeRepairReasons = repairedFinalized.narrativeQualityReasons.filter((reason) =>
      ['compressed_narrative', 'stitched_narrative', 'truncated_narrative'].includes(reason)
    );
    const retrySucceeded = !repairedFinalized.usedFallback && remainingNarrativeRepairReasons.length === 0;

    if (retrySucceeded) {
      logFlow('info', {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: 'day_journal_upserted',
        event: 'retry_succeeded',
      });

      return {
        summary: repairedFinalized.summary,
        narrativeText: repairedFinalized.narrativeText,
        sections: repairedFinalized.sections,
      };
    }

    const fallback = createFallbackDayJournal(contentEntries);
    const retryFailureReasons = repairedFinalized.usedFallback
      ? repairedFinalized.rejectionReasons
      : remainingNarrativeRepairReasons;

    logFlow('warn', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'day_journal_upserted',
      event: 'retry_failed',
      details: {
        reasons: retryFailureReasons,
      },
    });
    logFlow('warn', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'day_journal_upserted',
      event: 'day_journal_fallback_used',
      details: {
        dominantReason: retryFailureReasons[0] ?? 'narrative_quality',
        reasons: retryFailureReasons,
      },
    });

    return fallback;
  }

  if (finalized.usedFallback) {
    logFlow('warn', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'day_journal_upserted',
      event: 'day_journal_fallback_used',
      details: {
        dominantReason: finalized.rejectionReasons[0] ?? 'unknown',
        reasons: finalized.rejectionReasons,
      },
    });
  } else {
    if (finalized.usedFallbackSummary) {
      logFlow('info', {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: 'day_journal_upserted',
        event: 'day_journal_summary_fallback_used',
        details: {
          dominantReason: finalized.summaryFallbackReasons[0] ?? 'unknown',
          reasons: finalized.summaryFallbackReasons,
        },
      });
    }

    if (finalized.usedFallbackSections) {
      logFlow('info', {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: 'day_journal_upserted',
        event: 'day_journal_sections_fallback_used',
        details: {
          dominantReason: finalized.sectionFallbackReasons[0] ?? 'unknown',
          reasons: finalized.sectionFallbackReasons,
        },
      });
    }
  }

  return {
    summary: finalized.summary,
    narrativeText: finalized.narrativeText,
    sections: finalized.sections,
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
      .select('id, captured_at')
      .eq('user_id', authData.user.id)
      .gte('captured_at', bounds.start)
      .lt('captured_at', bounds.end)
      .order('captured_at', { ascending: true });

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
        .select('raw_entry_id, title, body')
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

      const normalizedByRawId = new Map<string, NormalizedEntry>();
      for (const row of dayNormalizedRows ?? []) {
        normalizedByRawId.set(String(row.raw_entry_id), {
          rawEntryId: String(row.raw_entry_id),
          title: row.title,
          body: row.body,
        });
      }

      for (const rawEntry of rawEntriesForDay ?? []) {
        const normalized = normalizedByRawId.get(String(rawEntry.id));
        if (!normalized) {
          continue;
        }

        normalizedEntriesForDay.push({
          ...normalized,
          capturedAt: rawEntry.captured_at,
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
      strictValidation: runtimeEnv.dayJournalStrictValidation,
      softQualityGuards: runtimeEnv.dayJournalSoftQualityGuards,
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
