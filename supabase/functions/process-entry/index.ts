import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';

type ProcessEntryRequest = {
  rawText?: unknown;
  audioBase64?: unknown;
  audioMimeType?: unknown;
  capturedAt?: unknown;
};

type ProcessEntryResponse = {
  status: 'ok';
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
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const NORMALIZATION_PROMPT_VERSION = 'entry-normalization.v1.phase1';
const DAY_COMPOSITION_PROMPT_VERSION = 'day-composition.v1.phase1';
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;

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
      summary: 'Nog geen notities voor deze dag.',
      sections: [],
    };
  }

  const sections = entries.slice(0, 5).map((entry) => entry.title);

  return {
    summary: `${entries.length} notitie(s) vastgelegd.`,
    sections,
  };
}

function parseString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function parseSections(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0)
    .slice(0, 8);
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
  audioBytes: Uint8Array;
  audioMimeType: string;
}): Promise<string | null> {
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
    console.error('[process-entry] openai_transcription_failed', {
      requestId: args.requestId,
      status: response.status,
      body: errorBody,
    });
    return null;
  }

  try {
    const data = (await response.json()) as { text?: unknown };
    const transcript = typeof data.text === 'string' ? data.text.trim() : '';

    if (transcript.length === 0) {
      console.warn('[process-entry] openai_transcription_empty', {
        requestId: args.requestId,
      });
    }

    return transcript;
  } catch (_error) {
    console.error('[process-entry] openai_transcription_parse_failed', {
      requestId: args.requestId,
    });
    return null;
  }
}

async function callOpenAiJson(args: {
  apiKey: string;
  model: string;
  requestId: string;
  promptVersion: string;
  systemPrompt: string;
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
          content: `${args.systemPrompt}\nPromptVersion: ${args.promptVersion}\nRequestId: ${args.requestId}`,
        },
        { role: 'user', content: args.userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('[process-entry] openai_call_failed', {
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
    const parsed = JSON.parse(content) as OpenAiJson;
    return parsed;
  } catch (_error) {
    console.error('[process-entry] openai_json_parse_failed', { requestId: args.requestId });
    return null;
  }
}

async function normalizeEntry(args: {
  apiKey: string;
  model: string;
  requestId: string;
  rawText: string;
}): Promise<NormalizedEntry> {
  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    promptVersion: NORMALIZATION_PROMPT_VERSION,
    systemPrompt:
      'Normaliseer een persoonlijke notitie. Blijf brongetrouw, nuchter en compact. Geef alleen title en body terug als JSON.',
    userPrompt: JSON.stringify({
      instruction:
        'Maak een korte titel en een opgeschoonde body. Voeg geen interpretaties, advies, tags of personen toe.',
      rawText: args.rawText,
    }),
  });

  const fallback = fallbackNormalization(args.rawText);

  if (!aiResult) {
    return fallback;
  }

  return {
    title: parseString(aiResult.title) ?? fallback.title,
    body: parseString(aiResult.body) ?? fallback.body,
  };
}

async function composeDayJournal(args: {
  apiKey: string;
  model: string;
  requestId: string;
  journalDate: string;
  normalizedEntries: NormalizedEntry[];
}): Promise<DayJournalDraft> {
  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    promptVersion: DAY_COMPOSITION_PROMPT_VERSION,
    systemPrompt:
      'Maak een eenvoudige dagjournal-samenvatting op basis van notities. Wees feitelijk en kort. Geef alleen summary en sections terug als JSON.',
    userPrompt: JSON.stringify({
      instruction:
        'Vat de dag compact samen in 1-2 zinnen. Gebruik sections als korte bullets. Geen psychologische analyse.',
      journalDate: args.journalDate,
      entries: args.normalizedEntries,
    }),
  });

  const fallback = fallbackDayJournal(args.normalizedEntries);

  if (!aiResult) {
    return fallback;
  }

  const parsedSections = parseSections(aiResult.sections);

  return {
    summary: parseString(aiResult.summary) ?? fallback.summary,
    sections: parsedSections.length > 0 ? parsedSections : fallback.sections,
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

    let body: ProcessEntryRequest;

    try {
      const parsedBody = await request.json();
      if (!parsedBody || typeof parsedBody !== 'object') {
        return jsonResponse(request, 400, { error: 'Invalid JSON body' });
      }

      body = parsedBody as ProcessEntryRequest;
    } catch (_error) {
      return jsonResponse(request, 400, { error: 'Invalid JSON body' });
    }

    const parsedSource = parseSourceInput(body);

    if (!parsedSource.value) {
      return jsonResponse(request, 400, {
        error: parsedSource.error ?? 'Invalid input payload',
      });
    }

    const capturedAt = parseCapturedAt(parseString(body.capturedAt) ?? undefined);
    const journalDate = toJournalDate(capturedAt);

    console.info('[process-entry] start', {
      requestId,
      userId: authData.user.id,
      journalDate,
      sourceType: parsedSource.value.sourceType,
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
        return jsonResponse(request, 400, { error: 'Invalid audioBase64 payload' });
      }

      if (audioBytes.byteLength > MAX_AUDIO_BYTES) {
        return jsonResponse(request, 413, {
          error: 'Audio payload too large. Keep raw audio below 5MB.',
        });
      }

      console.info('[process-entry] transcription_start', {
        requestId,
        sourceType: parsedSource.value.sourceType,
        audioBytes: audioBytes.byteLength,
        audioMimeType: normalizeAudioMimeType(parsedSource.value.audioMimeType),
      });

      const transcript = await transcribeAudio({
        apiKey: runtimeEnv.openAiApiKey,
        model: runtimeEnv.openAiTranscriptionModel,
        requestId,
        audioBytes,
        audioMimeType: parsedSource.value.audioMimeType,
      });

      if (transcript === null) {
        return jsonResponse(request, 502, { error: 'Failed to transcribe audio' });
      }

      const transcriptText =
        transcript.length > 0 ? transcript : 'Geen spraak herkend in audio-opname.';

      console.info('[process-entry] transcription_success', {
        requestId,
        sourceType: parsedSource.value.sourceType,
        transcriptLength: transcriptText.length,
      });

      sourceTextForNormalization = transcriptText;
      transcriptTextForPersist = transcriptText;
    }

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
      console.error('[process-entry] insert_entries_raw_failed', { requestId, error: rawError });
      return jsonResponse(request, 500, { error: 'Failed to persist raw entry' });
    }

    const normalized = await normalizeEntry({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      rawText: sourceTextForNormalization,
    });

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
      console.error('[process-entry] insert_entries_normalized_failed', {
        requestId,
        error: normalizedError,
      });
      return jsonResponse(request, 500, { error: 'Failed to persist normalized entry' });
    }

    const bounds = dateBoundsUtc(journalDate);
    const { data: rawEntriesForDay, error: dayRawError } = await supabase
      .from('entries_raw')
      .select('id')
      .eq('user_id', authData.user.id)
      .gte('captured_at', bounds.start)
      .lt('captured_at', bounds.end);

    if (dayRawError) {
      console.error('[process-entry] select_entries_raw_for_day_failed', {
        requestId,
        error: dayRawError,
      });
      return jsonResponse(request, 500, { error: 'Failed to load entries for day journal' });
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
        console.error('[process-entry] select_entries_normalized_for_day_failed', {
          requestId,
          error: dayNormalizedError,
        });
        return jsonResponse(request, 500, { error: 'Failed to compose day journal' });
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
      console.error('[process-entry] upsert_day_journal_failed', {
        requestId,
        error: dayJournalError,
      });
      return jsonResponse(request, 500, { error: 'Failed to upsert day journal' });
    }

    const response: ProcessEntryResponse = {
      status: 'ok',
      rawEntryId: rawEntry.id,
      normalizedEntryId: normalizedEntry.id,
      journalDate,
      dayJournalId: dayJournal.id,
      sourceType: parsedSource.value.sourceType,
    };

    console.info('[process-entry] success', {
      requestId,
      rawEntryId: response.rawEntryId,
      normalizedEntryId: response.normalizedEntryId,
      dayJournalId: response.dayJournalId,
      journalDate: response.journalDate,
      sourceType: response.sourceType,
    });

    return jsonResponse(request, 200, response);
  } catch (error) {
    console.error('[process-entry] fatal', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
    return jsonResponse(request, 500, { error: 'Internal error' });
  }
});
