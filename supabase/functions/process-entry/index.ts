import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';

type ProcessEntryRequest = {
  rawText?: unknown;
  audioBase64?: unknown;
  audioMimeType?: unknown;
  capturedAt?: unknown;
};

type ProcessEntryResponse = {
  status: 'ok';
  flow: 'process-entry';
  requestId: string;
  flowId: string;
  rawEntryId: string;
  normalizedEntryId: string;
  journalDate: string;
  dayJournalId: string;
  sourceType: 'text' | 'audio';
};

type NormalizedEntry = {
  title: string;
  body: string;
};

type DayJournalDraft = {
  summary: string;
  sections: string[];
};

type OpenAiJson = Record<string, unknown>;

type ParsedSourceInput =
  | {
      sourceType: 'text';
      rawText: string;
    }
  | {
      sourceType: 'audio';
      audioBase64: string;
      audioMimeType: string;
    };

const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const FLOW = 'process-entry' as const;
const NORMALIZATION_PROMPT_VERSION = 'entry-normalization.v1.phase1';
const DAY_COMPOSITION_PROMPT_VERSION = 'day-composition.v1.phase1';
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;
const NO_SPEECH_TRANSCRIPT = 'Geen spraak herkend in audio-opname.';
const LOW_CONTENT_TITLE = 'Audio-opname zonder spraak';
const LOW_CONTENT_BODY = 'Geen bruikbare spraakinhoud gevonden in de opname.';
const GENERIC_TITLES = new Set(['notitie', 'update', 'gedachte', 'dagboek', 'memo']);
const GENERIC_DAY_PHRASES = [
  'belangrijkste momenten',
  'samengevoegd',
  'de dag',
  'notitie(s) vastgelegd',
  'algemene samenvatting',
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

function parseCapturedAt(capturedAt?: string): string {
  if (!capturedAt) {
    return new Date().toISOString();
  }

  const parsed = new Date(capturedAt);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid capturedAt. Use ISO-8601 datetime.');
  }

  return parsed.toISOString();
}

function toJournalDate(capturedAtIso: string): string {
  return capturedAtIso.slice(0, 10);
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

function fallbackNormalization(rawText: string): NormalizedEntry {
  const clean = rawText.trim().replace(/\s+/g, ' ');
  const titleBase = clean.split(/[.!?\n]/)[0]?.trim() || clean;
  const title = titleBase.slice(0, 80) || 'Notitie';

  return {
    title,
    body: clean,
  };
}

function fallbackDayJournal(entries: NormalizedEntry[]): DayJournalDraft {
  if (entries.length === 0) {
    return {
      summary: 'Nog geen bruikbare notities voor deze dag.',
      sections: [],
    };
  }

  const sections = entries
    .map((entry) => sanitizeShortLine(entry.title, 80))
    .filter((entry) => entry.length > 0)
    .slice(0, 4);

  return {
    summary: entries.length === 1 ? '1 concrete notitie vastgelegd.' : `${entries.length} concrete notities vastgelegd.`,
    sections,
  };
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

function looksGenericTitle(value: string): boolean {
  const normalized = normalizeForCompare(value);
  return normalized.length < 4 || GENERIC_TITLES.has(normalized);
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

function cleanNormalizedTitle(value: string, fallback: string): string {
  const candidate = sanitizeShortLine(value, 80);
  if (!candidate || looksGenericTitle(candidate)) {
    return sanitizeShortLine(fallback, 80) || 'Notitie';
  }

  return candidate;
}

function cleanNormalizedBody(value: string, fallback: string): string {
  const candidate = sanitizeShortLine(value, 600);
  if (!candidate || candidate.length < 12) {
    return sanitizeShortLine(fallback, 600);
  }

  return candidate;
}

function cleanDaySummary(value: string, fallback: string): string {
  const summary = sanitizeShortLine(value, 220);
  if (!summary || looksGenericDayText(summary)) {
    return sanitizeShortLine(fallback, 220);
  }

  return summary;
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

function parseSourceInput(body: ProcessEntryRequest): { value?: ParsedSourceInput; error?: string } {
  const rawText = parseString(body.rawText);
  const audioBase64 = parseString(body.audioBase64);
  const audioMimeType = parseString(body.audioMimeType);

  const hasText = Boolean(rawText);
  const hasAudio = Boolean(audioBase64);

  if (hasText === hasAudio) {
    return {
      error: 'Provide exactly one input path: rawText or audioBase64.',
    };
  }

  if (hasText && rawText) {
    return {
      value: {
        sourceType: 'text',
        rawText,
      },
    };
  }

  if (!audioMimeType) {
    return {
      error: 'audioMimeType is required when audioBase64 is provided.',
    };
  }

  return {
    value: {
      sourceType: 'audio',
      audioBase64: audioBase64 as string,
      audioMimeType,
    },
  };
}

function sanitizeBase64(input: string): string {
  const trimmed = input.trim();

  if (trimmed.startsWith('data:')) {
    const commaIndex = trimmed.indexOf(',');
    if (commaIndex > -1) {
      return trimmed.slice(commaIndex + 1).replace(/\s+/g, '');
    }
  }

  return trimmed.replace(/\s+/g, '');
}

function decodeBase64ToBytes(input: string): Uint8Array | null {
  const sanitized = sanitizeBase64(input);

  try {
    const binary = atob(sanitized);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch (_error) {
    return null;
  }
}

function normalizeAudioMimeType(value: string): string {
  return value.split(';')[0]?.trim().toLowerCase() || 'application/octet-stream';
}

function audioFileExtensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case 'audio/webm':
      return 'webm';
    case 'audio/wav':
    case 'audio/x-wav':
      return 'wav';
    case 'audio/m4a':
      return 'm4a';
    case 'audio/mp4':
      return 'mp4';
    case 'audio/mpeg':
    case 'audio/mp3':
      return 'mp3';
    case 'audio/ogg':
      return 'ogg';
    default:
      return 'bin';
  }
}

async function transcribeAudio(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  audioBytes: Uint8Array;
  audioMimeType: string;
}): Promise<string | null> {
  try {
    const normalizedMimeType = normalizeAudioMimeType(args.audioMimeType);
    const extension = audioFileExtensionFromMimeType(normalizedMimeType);
    const blobBytes = Uint8Array.from(args.audioBytes);

    const formData = new FormData();
    formData.append(
      'file',
      new Blob([blobBytes], { type: normalizedMimeType }),
      `capture.${extension}`
    );
    formData.append('model', args.model);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logFlow('error', {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: 'transcribed',
        event: 'openai_transcription_failed',
        details: {
          status: response.status,
          body: errorBody,
        },
      });
      return null;
    }

    const data = (await response.json()) as { text?: unknown };
    const transcript = typeof data.text === 'string' ? data.text.trim() : '';

    if (transcript.length === 0) {
      logFlow('warn', {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: 'transcribed',
        event: 'openai_transcription_empty',
      });
    }

    return transcript;
  } catch (error) {
    logFlow('error', {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: 'transcribed',
      event: 'openai_transcription_exception',
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return null;
  }
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
            content: `${args.systemPrompt}\nPromptVersion: ${args.promptVersion}\nRequestId: ${args.requestId}`,
          },
          { role: 'user', content: args.userPrompt },
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

    const parsed = JSON.parse(content) as OpenAiJson;
    return parsed;
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

async function normalizeEntry(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  rawText: string;
}): Promise<NormalizedEntry> {
  if (containsNoSpeechMarker(args.rawText)) {
    return {
      title: LOW_CONTENT_TITLE,
      body: LOW_CONTENT_BODY,
    };
  }

  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: 'normalized_persisted',
    promptVersion: NORMALIZATION_PROMPT_VERSION,
    systemPrompt:
      'Normaliseer een persoonlijke notitie. Blijf strikt brongetrouw, feitelijk en compact. Geen therapietaal, geen diagnoses, geen interpretaties. Geef alleen JSON terug met title en body.',
    userPrompt: JSON.stringify({
      instruction:
        'Maak 1 concrete titel en 1 opgeschoonde body op basis van de bron. Gebruik rustige, praktische taal. Vermijd clichés en herhaling.',
      rawText: args.rawText,
    }),
  });

  const fallback = fallbackNormalization(args.rawText);

  if (!aiResult) {
    return fallback;
  }

  const nextTitle = cleanNormalizedTitle(parseString(aiResult.title) ?? fallback.title, fallback.title);
  const nextBody = cleanNormalizedBody(parseString(aiResult.body) ?? fallback.body, fallback.body);

  return {
    title: nextTitle,
    body: nextBody,
  };
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
    systemPrompt:
      'Maak een rustige, feitelijke dagsamenvatting op basis van notities. Blijf dicht bij de bron, compact en praktisch. Geen therapietaal of interpretatie. Geef alleen JSON terug met summary en sections.',
    userPrompt: JSON.stringify({
      instruction:
        'Vat de dag samen in 1-2 concrete zinnen. Geef 2-5 unieke sections met korte, specifieke bullets. Vermijd herhaling en opvulzinnen.',
      journalDate: args.journalDate,
      entries: contentEntries,
    }),
  });

  if (!aiResult) {
    return fallback;
  }

  const summary = cleanDaySummary(parseString(aiResult.summary) ?? fallback.summary, fallback.summary);
  const parsedSections = parseSections(aiResult.sections);
  const sections = cleanDaySections({
    candidateSections: parsedSections,
    summary,
    fallbackSections: fallback.sections,
  });

  return {
    summary,
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
  let rawEntryId: string | null = null;

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

    let body: ProcessEntryRequest;

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

      body = parsedBody as ProcessEntryRequest;
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
    const parsedSource = parseSourceInput(body);

    if (!parsedSource.value) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: parsedSource.error ?? 'Invalid input payload',
      });
    }

    let capturedAt: string;
    try {
      capturedAt = parseCapturedAt(parseString(body.capturedAt) ?? undefined);
    } catch (error) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: error instanceof Error ? error.message : 'Invalid capturedAt.',
      });
    }

    const journalDate = toJournalDate(capturedAt);

    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'validated',
      details: {
        userId: authData.user.id,
        journalDate,
        sourceType: parsedSource.value.sourceType,
      },
    });

    let sourceTextForNormalization = '';
    let rawTextForPersist: string | null = null;
    let transcriptTextForPersist: string | null = null;

    if (parsedSource.value.sourceType === 'text') {
      sourceTextForNormalization = parsedSource.value.rawText;
      rawTextForPersist = parsedSource.value.rawText;
    } else {
      const audioBytes = decodeBase64ToBytes(parsedSource.value.audioBase64);

      if (!audioBytes) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'Invalid audioBase64 payload',
        });
      }

      if (audioBytes.byteLength > MAX_AUDIO_BYTES) {
        return errorResponse({
          request,
          httpStatus: 413,
          requestId,
          flowId,
          step,
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Audio payload too large. Keep raw audio below 5MB.',
        });
      }

      step = 'transcribed';
      logFlow('info', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'transcription_start',
        details: {
          audioBytes: audioBytes.byteLength,
          audioMimeType: normalizeAudioMimeType(parsedSource.value.audioMimeType),
        },
      });

      const transcript = await transcribeAudio({
        apiKey: runtimeEnv.openAiApiKey,
        model: runtimeEnv.openAiTranscriptionModel,
        requestId,
        flowId,
        audioBytes,
        audioMimeType: parsedSource.value.audioMimeType,
      });

      if (transcript === null) {
        return errorResponse({
          request,
          httpStatus: 502,
          requestId,
          flowId,
          step,
          code: 'UPSTREAM_UNAVAILABLE',
          message: 'Failed to transcribe audio',
        });
      }

      const transcriptText =
        transcript.length > 0 ? transcript : NO_SPEECH_TRANSCRIPT;

      logFlow('info', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'transcription_success',
        details: {
          transcriptLength: transcriptText.length,
        },
      });

      sourceTextForNormalization = transcriptText;
      transcriptTextForPersist = transcriptText;
    }

    step = 'raw_persisted';
    const { data: rawEntry, error: rawError } = await supabase
      .from('entries_raw')
      .insert({
        user_id: authData.user.id,
        source_type: parsedSource.value.sourceType,
        raw_text: rawTextForPersist,
        transcript_text: transcriptTextForPersist,
        captured_at: capturedAt,
      })
      .select('id')
      .single();

    if (rawError || !rawEntry) {
      logFlow('error', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'insert_entries_raw_failed',
        details: {
          error: rawError ? String(rawError.message ?? rawError) : 'missing row',
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_WRITE_FAILED',
        message: 'Failed to persist raw entry',
      });
    }
    rawEntryId = rawEntry.id;

    const normalized = await normalizeEntry({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      rawText: sourceTextForNormalization,
    });

    step = 'normalized_persisted';
    const { data: normalizedEntry, error: normalizedError } = await supabase
      .from('entries_normalized')
      .insert({
        raw_entry_id: rawEntry.id,
        user_id: authData.user.id,
        title: normalized.title,
        body: normalized.body,
      })
      .select('id')
      .single();

    if (normalizedError || !normalizedEntry) {
      logFlow('error', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'insert_entries_normalized_failed',
        details: {
          error: normalizedError ? String(normalizedError.message ?? normalizedError) : 'missing row',
          rawEntryId,
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_WRITE_FAILED',
        message: 'Failed to persist normalized entry',
        details: rawEntryId ? { rawEntryId } : undefined,
      });
    }

    step = 'day_journal_upserted';
    const bounds = dateBoundsUtc(journalDate);
    const { data: rawEntriesForDay, error: dayRawError } = await supabase
      .from('entries_raw')
      .select('id')
      .eq('user_id', authData.user.id)
      .gte('captured_at', bounds.start)
      .lt('captured_at', bounds.end);

    if (dayRawError) {
      logFlow('error', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'select_entries_raw_for_day_failed',
        details: {
          error: String(dayRawError.message ?? dayRawError),
          rawEntryId,
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_READ_FAILED',
        message: 'Failed to load entries for day journal',
        details: rawEntryId ? { rawEntryId } : undefined,
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
        logFlow('error', {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: 'select_entries_normalized_for_day_failed',
          details: {
            error: String(dayNormalizedError.message ?? dayNormalizedError),
            rawEntryId,
          },
        });
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: 'DB_READ_FAILED',
          message: 'Failed to compose day journal',
          details: rawEntryId ? { rawEntryId } : undefined,
        });
      }

      for (const row of dayNormalizedRows ?? []) {
        normalizedEntriesForDay.push({
          title: row.title,
          body: row.body,
        });
      }
    }

    const dayDraft = await composeDayJournal({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      journalDate,
      normalizedEntries: normalizedEntriesForDay,
    });

    const { data: dayJournal, error: dayJournalError } = await supabase
      .from('day_journals')
      .upsert(
        {
          user_id: authData.user.id,
          journal_date: journalDate,
          summary: dayDraft.summary,
          sections: dayDraft.sections,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,journal_date' }
      )
      .select('id')
      .single();

    if (dayJournalError || !dayJournal) {
      logFlow('error', {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: 'upsert_day_journal_failed',
        details: {
          error: dayJournalError ? String(dayJournalError.message ?? dayJournalError) : 'missing row',
          rawEntryId,
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: 'DB_WRITE_FAILED',
        message: 'Failed to upsert day journal',
        details: rawEntryId ? { rawEntryId } : undefined,
      });
    }

    const response: ProcessEntryResponse = {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      rawEntryId: rawEntry.id,
      normalizedEntryId: normalizedEntry.id,
      journalDate,
      dayJournalId: dayJournal.id,
      sourceType: parsedSource.value.sourceType,
    };

    step = 'completed';
    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'success',
      details: {
        rawEntryId: response.rawEntryId,
        normalizedEntryId: response.normalizedEntryId,
        dayJournalId: response.dayJournalId,
        journalDate: response.journalDate,
        sourceType: response.sourceType,
      },
    });

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
        ...(rawEntryId ? { rawEntryId } : {}),
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
      details: rawEntryId ? { rawEntryId } : undefined,
    });
  }
});
