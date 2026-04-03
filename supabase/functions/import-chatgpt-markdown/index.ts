import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';

type ImportRequestItem = {
  capturedAt?: unknown;
  rawText?: unknown;
  externalMessageId?: unknown;
};

type ImportRequest = {
  fileName?: unknown;
  sourceRef?: unknown;
  sourceConversationId?: unknown;
  conversationTitle?: unknown;
  conversationAlias?: unknown;
  replaceExisting?: unknown;
  items?: unknown;
};

type PersistedImportItem = {
  capturedAt: string;
  rawText: string;
  externalMessageId: string | null;
};

type ImportResponse =
  | {
      status: 'ok';
      flow: 'import-chatgpt-markdown';
      requestId: string;
      flowId: string;
      sourceRef: string;
      importedCount: number;
      removedCount: number;
      impactedDates: string[];
      requiresReplaceConfirmation: false;
    }
  | {
      status: 'ok';
      flow: 'import-chatgpt-markdown';
      requestId: string;
      flowId: string;
      sourceRef: string;
      importedCount: 0;
      removedCount: 0;
      impactedDates: string[];
      requiresReplaceConfirmation: true;
      existingCount: number;
    };

const FLOW = 'import-chatgpt-markdown' as const;
const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

function readEnv(name: string): string {
  return Deno.env.get(name)?.trim() ?? '';
}

function getRuntimeSupabaseEnv(): { supabaseUrl: string; supabaseAnonKey: string } {
  const target = (readEnv('EXPO_PUBLIC_SUPABASE_TARGET') || 'cloud').toLowerCase();
  const selectedUrl =
    target === 'local'
      ? readEnv('EXPO_PUBLIC_SUPABASE_LOCAL_URL') || readEnv('EXPO_PUBLIC_SUPABASE_URL')
      : readEnv('EXPO_PUBLIC_SUPABASE_CLOUD_URL') || readEnv('EXPO_PUBLIC_SUPABASE_URL');
  const selectedKey =
    target === 'local'
      ? readEnv('EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY') ||
        readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
      : readEnv('EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY') ||
        readEnv('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

  const supabaseUrl = readEnv('SUPABASE_URL') || selectedUrl;
  const supabaseAnonKey = readEnv('SUPABASE_ANON_KEY') || selectedKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase runtime env.');
  }

  return { supabaseUrl, supabaseAnonKey };
}

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

function parseBoolean(value: unknown): boolean {
  return value === true;
}

function parseCapturedAt(value: unknown): string {
  const raw = parseString(value);
  if (!raw) {
    throw new Error('capturedAt ontbreekt.');
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Ongeldige capturedAt: ${raw}`);
  }

  return parsed.toISOString();
}

function normalizeBodyParagraphs(value: string): string {
  const normalizedLines = String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim());

  const collapsed: string[] = [];
  let previousWasBlank = false;

  for (const line of normalizedLines) {
    if (!line) {
      if (!previousWasBlank && collapsed.length > 0) {
        collapsed.push('');
      }
      previousWasBlank = true;
      continue;
    }

    collapsed.push(line);
    previousWasBlank = false;
  }

  while (collapsed[0] === '') {
    collapsed.shift();
  }

  while (collapsed.length > 0 && collapsed[collapsed.length - 1] === '') {
    collapsed.pop();
  }

  return collapsed.join('\n');
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
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
  return `${(base || sliced).trim()}...`;
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

function fallbackNormalization(rawText: string): {
  title: string;
  body: string;
  summaryShort: string;
} {
  const body = normalizeBodyParagraphs(rawText);
  const titleBase = body.split(/[.!?\n]/)[0]?.trim() || body;
  const title = titleBase.slice(0, 80) || 'Notitie';

  return {
    title,
    body,
    summaryShort: createSummaryShortFromBody(body),
  };
}

function parseItems(value: unknown): PersistedImportItem[] {
  if (!Array.isArray(value)) {
    throw new Error('items moet een array zijn.');
  }

  return value.map((item, index) => {
    const candidate = item as ImportRequestItem;
    const rawText = parseString(candidate.rawText);
    if (!rawText) {
      throw new Error(`Item ${index + 1} mist rawText.`);
    }

    return {
      capturedAt: parseCapturedAt(candidate.capturedAt),
      rawText,
      externalMessageId: parseString(candidate.externalMessageId),
    };
  });
}

function toJournalDate(isoValue: string): string {
  return isoValue.slice(0, 10);
}

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
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

    const runtimeEnv = getRuntimeSupabaseEnv();
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

    const supabase = createClient(runtimeEnv.supabaseUrl, runtimeEnv.supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    step = 'authenticated';
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

    let body: ImportRequest;

    try {
      const parsedBody = await request.json();
      if (!parsedBody || typeof parsedBody !== 'object') {
        throw new Error('Invalid JSON body');
      }

      body = parsedBody as ImportRequest;
    } catch (error) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step: 'validated',
        code: 'INPUT_INVALID',
        message: error instanceof Error ? error.message : 'Invalid JSON body',
      });
    }

    step = 'validated';
    const sourceRef = parseString(body.sourceRef);
    const fileName = parseString(body.fileName);
    const replaceExisting = parseBoolean(body.replaceExisting);

    if (!sourceRef) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: 'sourceRef ontbreekt.',
      });
    }

    if (!fileName) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: 'fileName ontbreekt.',
      });
    }

    let items: PersistedImportItem[];
    try {
      items = parseItems(body.items);
    } catch (error) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: error instanceof Error ? error.message : 'items zijn ongeldig.',
      });
    }

    if (items.length === 0) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: 'INPUT_INVALID',
        message: 'Er zijn geen items om te importeren.',
      });
    }
    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'validated',
      details: {
        userId: authData.user.id,
        sourceRef,
        itemCount: items.length,
        replaceExisting,
      },
    });

    const { data: existingRows, error: existingError } = await supabase
      .from('entries_raw')
      .select('id, captured_at')
      .eq('user_id', authData.user.id)
      .eq('import_source_type', 'chatgpt_markdown_import')
      .eq('import_source_ref', sourceRef);

    if (existingError) {
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step: 'existing_checked',
        code: 'DB_READ_FAILED',
        message: 'Kon bestaande import niet controleren.',
      });
    }

    const existingCount = existingRows?.length ?? 0;
    if (existingCount > 0 && !replaceExisting) {
      const response: ImportResponse = {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        sourceRef,
        importedCount: 0,
        removedCount: 0,
        impactedDates: [],
        requiresReplaceConfirmation: true,
        existingCount,
      };

      return jsonResponse(request, 200, response);
    }

    const impactedDates = new Set<string>();

    if (existingCount > 0) {
      for (const row of existingRows ?? []) {
        if (typeof row.captured_at === 'string' && row.captured_at.length >= 10) {
          impactedDates.add(toJournalDate(row.captured_at));
        }
      }

      const { error: deleteError } = await supabase
        .from('entries_raw')
        .delete()
        .eq('user_id', authData.user.id)
        .eq('import_source_type', 'chatgpt_markdown_import')
        .eq('import_source_ref', sourceRef);

      if (deleteError) {
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step: 'existing_deleted',
          code: 'DB_WRITE_FAILED',
          message: 'Kon eerdere import niet verwijderen.',
        });
      }
    }

    const rawPayload = items.map((item) => ({
      user_id: authData.user.id,
      source_type: 'text',
      raw_text: item.rawText,
      transcript_text: null,
      captured_at: item.capturedAt,
      import_source_type: 'chatgpt_markdown_import',
      import_source_ref: sourceRef,
      import_file_name: fileName,
      import_external_message_id: item.externalMessageId,
    }));

    const { data: rawRows, error: rawError } = await supabase
      .from('entries_raw')
      .insert(rawPayload)
      .select('id, captured_at, raw_text');

    if (rawError || !rawRows) {
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step: 'raw_persisted',
        code: 'DB_WRITE_FAILED',
        message: 'Kon raw importentries niet opslaan.',
      });
    }

    const normalizedPayload = rawRows.map((row: { id: string; captured_at: string; raw_text: string | null }) => {
      const normalized = fallbackNormalization(row.raw_text ?? '');
      impactedDates.add(toJournalDate(row.captured_at));

      return {
        raw_entry_id: row.id,
        user_id: authData.user.id,
        title: normalized.title,
        body: normalized.body,
        summary_short: normalized.summaryShort,
      };
    });

    const { error: normalizedError } = await supabase.from('entries_normalized').insert(normalizedPayload);
    if (normalizedError) {
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step: 'normalized_persisted',
        code: 'DB_WRITE_FAILED',
        message: 'Kon genormaliseerde importentries niet opslaan.',
      });
    }

    const response: ImportResponse = {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      sourceRef,
      importedCount: items.length,
      removedCount: existingCount,
      impactedDates: [...impactedDates].sort(),
      requiresReplaceConfirmation: false,
    };

    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step: 'completed',
      event: 'success',
      details: {
        userId: authData.user.id,
        importedCount: items.length,
        removedCount: existingCount,
        impactedDates: response.impactedDates,
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
