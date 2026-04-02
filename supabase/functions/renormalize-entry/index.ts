import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from '../_shared/env.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';

type RenormalizeEntryRequest = {
  rawText?: unknown;
};

type RenormalizeEntryResponse = {
  status: 'ok';
  flow: 'renormalize-entry';
  requestId: string;
  flowId: string;
  title: string;
  body: string;
  summaryShort: string;
};

type OpenAiJson = Record<string, unknown>;

type NormalizedEntry = {
  title: string;
  body: string;
  summaryShort: string;
};

const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const FLOW = 'renormalize-entry' as const;
const NORMALIZATION_PROMPT_VERSION = 'entry-renormalization.v1.phase1';
const NO_SPEECH_TRANSCRIPT = 'Geen spraak herkend in audio-opname.';
const LOW_CONTENT_TITLE = 'Audio-opname zonder spraak';
const LOW_CONTENT_BODY = 'Geen bruikbare spraakinhoud gevonden in de opname.';
const LOW_CONTENT_SUMMARY_SHORT = 'Geen bruikbare spraakinhoud in deze opname.';
const GENERIC_TITLES = new Set(['notitie', 'update', 'gedachte', 'dagboek', 'memo']);
const GENERIC_PREVIEW_PHRASES = [
  'algemene samenvatting',
  'korte samenvatting',
  'samenvatting',
  'overzicht van de notitie',
];
const META_PREVIEW_STARTS = ['de gebruiker', 'er wordt beschreven', 'de notitie gaat over', 'in deze notitie'];

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

function normalizeForCompare(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function containsNoSpeechMarker(value: string): boolean {
  return normalizeForCompare(value).includes(normalizeForCompare(NO_SPEECH_TRANSCRIPT));
}

function looksGenericTitle(value: string): boolean {
  const normalized = normalizeForCompare(value);
  return normalized.length < 4 || GENERIC_TITLES.has(normalized);
}

function cleanNormalizedTitle(value: string, fallback: string): string {
  const candidate = sanitizeShortLine(value, 80);
  if (!candidate || looksGenericTitle(candidate)) {
    return sanitizeShortLine(fallback, 80) || 'Notitie';
  }

  return candidate;
}

function cleanNormalizedBody(value: string, fallback: string): string {
  const candidate = normalizeWhitespace(value);
  if (!candidate || candidate.length < 12) {
    return normalizeWhitespace(fallback);
  }

  return candidate;
}

function isSuspiciouslyCompressedNormalization(source: string, normalizedBody: string): boolean {
  const sourceClean = normalizeWhitespace(source);
  const normalizedClean = normalizeWhitespace(normalizedBody);

  if (sourceClean.length < 500) {
    return false;
  }

  return normalizedClean.length < Math.floor(sourceClean.length * 0.72);
}

function trimPreviewForMobile(value: string, maxLength = 156): string {
  const normalized = normalizeWhitespace(value);
  if (!normalized) {
    return '';
  }

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
  const base = boundary > maxLength * 0.6 ? sliced.slice(0, boundary).trim() : sliced.trim();
  const safeBase = base || sliced.trim();
  return `${safeBase}...`;
}

function finalizePreviewTone(value: string): string {
  const clean = value.trim();
  if (!clean) {
    return '';
  }
  if (clean.endsWith('?')) {
    return `${clean.slice(0, -1).trimEnd()}.`;
  }
  return clean;
}

function looksMetaPreview(value: string): boolean {
  const normalized = normalizeForCompare(value);
  return META_PREVIEW_STARTS.some((prefix) => normalized.startsWith(prefix));
}

function looksGenericPreview(value: string): boolean {
  const normalized = normalizeForCompare(value);
  if (normalized.length < 12) {
    return true;
  }
  return GENERIC_PREVIEW_PHRASES.some((phrase) => normalized.includes(phrase));
}

function createSummaryShortFromBody(body: string): string {
  const normalizedBody = normalizeWhitespace(body);
  if (!normalizedBody) {
    return 'Korte preview niet beschikbaar.';
  }

  const firstSentence = normalizedBody.split(/[.!?]/)[0]?.trim() ?? '';
  const source = firstSentence.length >= 24 ? firstSentence : normalizedBody;
  const preview = trimPreviewForMobile(source);
  return finalizePreviewTone(preview || trimPreviewForMobile(normalizedBody));
}

function cleanNormalizedSummaryShort(value: string | null, fallbackBody: string): string {
  const candidate = trimPreviewForMobile(value ?? '');
  if (!candidate) {
    return createSummaryShortFromBody(fallbackBody);
  }
  if (candidate.endsWith('?')) {
    return createSummaryShortFromBody(fallbackBody);
  }
  if (looksMetaPreview(candidate) || looksGenericPreview(candidate)) {
    return createSummaryShortFromBody(fallbackBody);
  }

  return finalizePreviewTone(candidate);
}

function fallbackNormalization(rawText: string): NormalizedEntry {
  const clean = rawText.trim().replace(/\s+/g, ' ');
  const titleBase = clean.split(/[.!?\n]/)[0]?.trim() || clean;
  const title = titleBase.slice(0, 80) || 'Notitie';

  return {
    title,
    body: clean,
    summaryShort: createSummaryShortFromBody(clean),
  };
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
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: args.systemPrompt,
          },
          {
            role: 'user',
            content: args.userPrompt,
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
          promptVersion: args.promptVersion,
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
      summaryShort: LOW_CONTENT_SUMMARY_SHORT,
    };
  }

  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: 'normalized_generated',
    promptVersion: NORMALIZATION_PROMPT_VERSION,
    systemPrompt:
      'Normaliseer een persoonlijke notitie. Blijf strikt brongetrouw en feitelijk. Behoud alle betekenisvolle inhoud uit de bron. Laat geen details weg, vat niet samen en herschrijf niet naar een kortere hervertelling. Maak alleen licht leesbaarder (spraakruis/kleine grammaticale oneffenheden), zonder nieuwe informatie of interpretaties. Geen therapietaal of diagnoses. Geef alleen JSON terug met title, body en summary_short.',
    userPrompt: JSON.stringify({
      instruction:
        'Maak 1 concrete titel, 1 volledige opgeschoonde body en 1 compacte summary_short op basis van de bron. Body: volledige inhoud behouden, bronnabij, niet samenvatten. summary_short: compacte preview voor mobiele lijsten (ongeveer 2 regels), natuurlijk Nederlands, niet-meta, niet-analytisch, geen vraagvorm.',
      rawText: args.rawText,
    }),
  });

  const fallback = fallbackNormalization(args.rawText);

  if (!aiResult) {
    return fallback;
  }

  const nextTitle = cleanNormalizedTitle(parseString(aiResult.title) ?? fallback.title, fallback.title);
  const nextBody = cleanNormalizedBody(parseString(aiResult.body) ?? fallback.body, fallback.body);
  const body = isSuspiciouslyCompressedNormalization(args.rawText, nextBody) ? fallback.body : nextBody;
  const summaryShort = cleanNormalizedSummaryShort(parseString(aiResult.summary_short), body);

  return {
    title: nextTitle,
    body,
    summaryShort,
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
        message: 'Invalid or expired auth token',
      });
    }

    step = 'validated';
    const body = (await request.json()) as RenormalizeEntryRequest;
    const rawText = parseString(body.rawText);
    if (!rawText) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: 'rawText is required',
      });
    }

    step = 'normalized_generated';
    const normalized = await normalizeEntry({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      rawText,
    });

    const response: RenormalizeEntryResponse = {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      title: normalized.title,
      body: normalized.body,
      summaryShort: normalized.summaryShort,
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
