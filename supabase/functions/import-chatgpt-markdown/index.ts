import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';

type ImportRequestItem = {
  capturedAt?: unknown;
  rawText?: unknown;
  externalMessageId?: unknown;
  sourceType?: unknown;
};

type ImportRequest = {
  fileName?: unknown;
  sourceRef?: unknown;
  sourceConversationId?: unknown;
  conversationTitle?: unknown;
  conversationAlias?: unknown;
  importSourceType?: unknown;
  importMode?: unknown;
  replaceExisting?: unknown;
  items?: unknown;
};

type PersistedImportItem = {
  capturedAt: string;
  rawText: string;
  externalMessageId: string | null;
  sourceType: 'text' | 'audio';
};

type ExistingImportRow = {
  id: string;
  captured_at: string;
  raw_text: string | null;
  source_type: 'text' | 'audio';
  import_external_message_id: string | null;
};

type ImportMode = 'merge_changed' | 'replace_all';

type ImportResponse =
  | {
      status: 'ok';
      flow: 'import-chatgpt-markdown';
      requestId: string;
      flowId: string;
      sourceRef: string;
      importMode: ImportMode;
      importedCount: number;
      removedCount: number;
      unchangedCount: number;
      impactedDates: string[];
      backgroundTask: BackgroundTaskView;
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
      unchangedCount: 0;
      impactedDates: string[];
      requiresReplaceConfirmation: true;
      existingCount: number;
    };

type BackgroundTaskView = {
  id: string;
  taskType: 'import_refresh';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  phase: string;
  progressCurrent: number;
  progressTotal: number;
  detailCurrent: number | null;
  detailTotal: number | null;
  detailLabel: string | null;
  warningCount: number;
  errorMessage: string | null;
  noticeDismissedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type BackgroundTaskInsertResult = {
  id: string;
  task_type: string;
  status: string;
  phase: string;
  progress_current: number;
  progress_total: number;
  detail_current: number | null;
  detail_total: number | null;
  detail_label: string | null;
  warning_count: number;
  error_message: string | null;
  notice_dismissed_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

type RuntimeSupabaseEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
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

function getRuntimeSupabaseEnv(): RuntimeSupabaseEnv {
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

function parseImportSourceType(value: unknown): 'chatgpt_markdown_import' | 'journal_archive_import' {
  if (value === 'journal_archive_import') {
    return 'journal_archive_import';
  }

  return 'chatgpt_markdown_import';
}

function parseImportMode(value: unknown): ImportMode | null {
  if (value === 'replace_all') {
    return 'replace_all';
  }

  if (value === 'merge_changed') {
    return 'merge_changed';
  }

  return null;
}

function parseSourceType(value: unknown): 'text' | 'audio' {
  return value === 'audio' ? 'audio' : 'text';
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
      sourceType: parseSourceType(candidate.sourceType),
    };
  });
}

function toJournalDate(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return isoValue.slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function computeWeekStart(anchorDate: string): string {
  const anchor = new Date(`${anchorDate}T00:00:00.000Z`);
  const day = anchor.getUTCDay();
  const offsetToMonday = (day + 6) % 7;
  const weekStart = new Date(anchor.getTime() - offsetToMonday * 24 * 60 * 60 * 1000);
  return weekStart.toISOString().slice(0, 10);
}

function computeMonthStart(anchorDate: string): string {
  return `${anchorDate.slice(0, 7)}-01`;
}

function mapBackgroundTaskRow(row: BackgroundTaskInsertResult): BackgroundTaskView {
  return {
    id: row.id,
    taskType: 'import_refresh',
    status:
      row.status === 'running' ||
      row.status === 'completed' ||
      row.status === 'failed' ||
      row.status === 'cancelled'
        ? row.status
        : 'queued',
    phase: row.phase || 'queued',
    progressCurrent: Math.max(0, Number(row.progress_current ?? 0)),
    progressTotal: Math.max(0, Number(row.progress_total ?? 0)),
    detailCurrent:
      typeof row.detail_current === 'number' && Number.isFinite(row.detail_current)
        ? Math.max(0, Math.round(row.detail_current))
        : null,
    detailTotal:
      typeof row.detail_total === 'number' && Number.isFinite(row.detail_total)
        ? Math.max(0, Math.round(row.detail_total))
        : null,
    detailLabel: row.detail_label ?? null,
    warningCount: Math.max(0, Number(row.warning_count ?? 0)),
    errorMessage: row.error_message ?? null,
    noticeDismissedAt: row.notice_dismissed_at ?? null,
    startedAt: row.started_at ?? null,
    completedAt: row.completed_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function invokeInternalFunction(input: {
  runtimeEnv: RuntimeSupabaseEnv;
  authHeader: string;
  flowId: string;
  functionName: 'regenerate-day-journal' | 'generate-reflection';
  body: Record<string, unknown>;
}): Promise<void> {
  const baseUrl = input.runtimeEnv.supabaseUrl.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/functions/v1/${input.functionName}`, {
    method: 'POST',
    headers: {
      Authorization: input.authHeader,
      apikey: input.runtimeEnv.supabaseAnonKey,
      'Content-Type': 'application/json',
      'x-flow-id': input.flowId,
    },
    body: JSON.stringify(input.body),
  });

  if (response.ok) {
    return;
  }

  const payloadText = await response.text();
  const safeMessage = payloadText.trim() || `HTTP ${response.status}`;
  throw new Error(safeMessage);
}

async function updateBackgroundTask(input: {
  supabase: ReturnType<typeof createClient>;
  taskId: string;
  userId: string;
  patch: Record<string, unknown>;
}): Promise<void> {
  const timestamp = new Date().toISOString();
  const { error } = await input.supabase
    .from('user_background_tasks')
    .update({
      ...input.patch,
      updated_at: timestamp,
      last_update_at: timestamp,
    })
    .eq('id', input.taskId)
    .eq('user_id', input.userId);

  if (error) {
    throw new Error('Kon background taakstatus niet bijwerken.');
  }
}

async function processImportRefreshTask(input: {
  supabase: ReturnType<typeof createClient>;
  runtimeEnv: RuntimeSupabaseEnv;
  authHeader: string;
  userId: string;
  taskId: string;
  impactedDates: string[];
  flowId: string;
}): Promise<void> {
  const impactedDates = [...new Set(input.impactedDates)].sort();
  const weekStarts = [...new Set(impactedDates.map(computeWeekStart))].sort();
  const monthStarts = [...new Set(impactedDates.map(computeMonthStart))].sort();
  const total = impactedDates.length + weekStarts.length + monthStarts.length;

  await updateBackgroundTask({
    supabase: input.supabase,
    taskId: input.taskId,
    userId: input.userId,
    patch: {
      status: 'running',
      phase: impactedDates.length > 0 ? 'day_journals' : weekStarts.length > 0 ? 'week_reflections' : 'month_reflections',
      progress_current: 0,
      progress_total: total,
      detail_current: impactedDates.length > 0 ? 0 : null,
      detail_total: impactedDates.length > 0 ? impactedDates.length : null,
      detail_label: impactedDates.length > 0 ? 'Dag 0 van ' + impactedDates.length : null,
      warning_count: 0,
      error_message: null,
      started_at: new Date().toISOString(),
      completed_at: null,
    },
  });

  let warningCount = 0;
  let progressCurrent = 0;

  for (const [index, journalDate] of impactedDates.entries()) {
    try {
      await invokeInternalFunction({
        runtimeEnv: input.runtimeEnv,
        authHeader: input.authHeader,
        flowId: `${input.flowId}-day-${index + 1}`,
        functionName: 'regenerate-day-journal',
        body: { journalDate },
      });
    } catch {
      warningCount += 1;
    }

    progressCurrent += 1;
    await updateBackgroundTask({
      supabase: input.supabase,
      taskId: input.taskId,
      userId: input.userId,
      patch: {
        status: 'running',
        phase: 'day_journals',
        progress_current: progressCurrent,
        progress_total: total,
        detail_current: index + 1,
        detail_total: impactedDates.length,
        detail_label: `Dag ${index + 1} van ${Math.max(impactedDates.length, 1)}`,
        warning_count: warningCount,
      },
    });
  }

  for (const [index, anchorDate] of weekStarts.entries()) {
    try {
      await invokeInternalFunction({
        runtimeEnv: input.runtimeEnv,
        authHeader: input.authHeader,
        flowId: `${input.flowId}-week-${index + 1}`,
        functionName: 'generate-reflection',
        body: { periodType: 'week', anchorDate, forceRegenerate: true },
      });
    } catch {
      warningCount += 1;
    }

    progressCurrent += 1;
    await updateBackgroundTask({
      supabase: input.supabase,
      taskId: input.taskId,
      userId: input.userId,
      patch: {
        status: 'running',
        phase: 'week_reflections',
        progress_current: progressCurrent,
        progress_total: total,
        detail_current: index + 1,
        detail_total: weekStarts.length,
        detail_label: `Weekreflectie ${index + 1} van ${Math.max(weekStarts.length, 1)}`,
        warning_count: warningCount,
      },
    });
  }

  for (const [index, anchorDate] of monthStarts.entries()) {
    try {
      await invokeInternalFunction({
        runtimeEnv: input.runtimeEnv,
        authHeader: input.authHeader,
        flowId: `${input.flowId}-month-${index + 1}`,
        functionName: 'generate-reflection',
        body: { periodType: 'month', anchorDate, forceRegenerate: true },
      });
    } catch {
      warningCount += 1;
    }

    progressCurrent += 1;
    await updateBackgroundTask({
      supabase: input.supabase,
      taskId: input.taskId,
      userId: input.userId,
      patch: {
        status: 'running',
        phase: 'month_reflections',
        progress_current: progressCurrent,
        progress_total: total,
        detail_current: index + 1,
        detail_total: monthStarts.length,
        detail_label: `Maandreflectie ${index + 1} van ${Math.max(monthStarts.length, 1)}`,
        warning_count: warningCount,
      },
    });
  }

  await updateBackgroundTask({
    supabase: input.supabase,
    taskId: input.taskId,
    userId: input.userId,
    patch: {
      status: warningCount > 0 ? 'failed' : 'completed',
      phase: warningCount > 0 ? 'failed' : 'completed',
      progress_current: total,
      progress_total: total,
      detail_current: null,
      detail_total: null,
      detail_label: warningCount > 0 ? 'Niet alles kon worden bijgewerkt.' : 'Import naverwerking afgerond.',
      warning_count: warningCount,
      error_message: warningCount > 0 ? 'Niet alle stappen konden worden afgerond.' : null,
      completed_at: new Date().toISOString(),
      notice_seen_at: null,
      notice_dismissed_at: null,
    },
  });
}

function toCapturedAtMillis(value: string): number | null {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function buildFallbackMatchKey(input: {
  capturedAt: string;
  sourceType: 'text' | 'audio';
  rawText: string;
}): string {
  return [
    input.capturedAt,
    input.sourceType,
    normalizeWhitespace(input.rawText),
  ].join('|');
}

function isUnchangedImportItem(input: {
  existing: ExistingImportRow;
  incoming: PersistedImportItem;
}): boolean {
  const existingMillis = toCapturedAtMillis(input.existing.captured_at);
  const incomingMillis = toCapturedAtMillis(input.incoming.capturedAt);

  return (
    existingMillis !== null &&
    incomingMillis !== null &&
    existingMillis === incomingMillis &&
    input.existing.source_type === input.incoming.sourceType &&
    normalizeWhitespace(input.existing.raw_text ?? '') ===
      normalizeWhitespace(input.incoming.rawText)
  );
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
    const importSourceType = parseImportSourceType(body.importSourceType);
    const requestedImportMode = parseImportMode(body.importMode);
    const replaceExisting = parseBoolean(body.replaceExisting);
    const importMode =
      requestedImportMode ?? (replaceExisting ? 'replace_all' : null);

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
        importSourceType,
        itemCount: items.length,
        importMode,
        replaceExisting,
      },
    });

    const { data: existingRows, error: existingError } = await supabase
      .from('entries_raw')
      .select('id, captured_at, raw_text, source_type, import_external_message_id')
      .eq('user_id', authData.user.id)
      .eq('import_source_type', importSourceType)
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
    if (existingCount > 0 && !importMode) {
      const response: ImportResponse = {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        sourceRef,
        importedCount: 0,
        removedCount: 0,
        unchangedCount: 0,
        impactedDates: [],
        requiresReplaceConfirmation: true,
        existingCount,
      };

      return jsonResponse(request, 200, response);
    }

    const appliedImportMode: ImportMode = importMode ?? 'merge_changed';
    const impactedDates = new Set<string>();
    let unchangedCount = 0;
    let removedCount = 0;
    let itemsToInsert: PersistedImportItem[] = [];

    if (appliedImportMode === 'replace_all') {
      itemsToInsert = items;
      if (existingCount > 0) {
        for (const row of (existingRows as ExistingImportRow[]) ?? []) {
          if (typeof row.captured_at === 'string' && row.captured_at.length >= 10) {
            impactedDates.add(toJournalDate(row.captured_at));
          }
        }

        const { error: deleteError } = await supabase
          .from('entries_raw')
          .delete()
          .eq('user_id', authData.user.id)
          .eq('import_source_type', importSourceType)
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

      removedCount = existingCount;
    } else {
      const existingList = ((existingRows ?? []) as ExistingImportRow[]).filter(
        (row) => typeof row.id === 'string' && row.id.length > 0,
      );
      const existingByExternalId = new Map<string, ExistingImportRow[]>();
      const existingByFallbackKey = new Map<string, ExistingImportRow[]>();
      const consumedExistingIds = new Set<string>();
      const rowsToDelete = new Set<string>();

      for (const row of existingList) {
        const externalId = parseString(row.import_external_message_id);
        if (externalId) {
          const current = existingByExternalId.get(externalId) ?? [];
          current.push(row);
          existingByExternalId.set(externalId, current);
        }

        const fallbackKey = buildFallbackMatchKey({
          capturedAt: row.captured_at,
          sourceType: row.source_type,
          rawText: row.raw_text ?? '',
        });
        const currentFallback = existingByFallbackKey.get(fallbackKey) ?? [];
        currentFallback.push(row);
        existingByFallbackKey.set(fallbackKey, currentFallback);
      }

      function pickAvailableRow(
        candidates: ExistingImportRow[] | undefined,
      ): ExistingImportRow | null {
        if (!candidates || candidates.length === 0) {
          return null;
        }

        for (const candidate of candidates) {
          if (!consumedExistingIds.has(candidate.id)) {
            return candidate;
          }
        }

        return null;
      }

      for (const item of items) {
        const externalId = parseString(item.externalMessageId);
        const directMatch = externalId
          ? pickAvailableRow(existingByExternalId.get(externalId))
          : null;
        const fallbackKey = buildFallbackMatchKey({
          capturedAt: item.capturedAt,
          sourceType: item.sourceType,
          rawText: item.rawText,
        });
        const fallbackMatch = pickAvailableRow(existingByFallbackKey.get(fallbackKey));
        const matched = directMatch ?? fallbackMatch;

        if (!matched) {
          itemsToInsert.push(item);
          impactedDates.add(toJournalDate(item.capturedAt));
          continue;
        }

        consumedExistingIds.add(matched.id);
        if (isUnchangedImportItem({ existing: matched, incoming: item })) {
          unchangedCount += 1;
          continue;
        }

        rowsToDelete.add(matched.id);
        itemsToInsert.push(item);
        impactedDates.add(toJournalDate(item.capturedAt));
        impactedDates.add(toJournalDate(matched.captured_at));
      }

      if (rowsToDelete.size > 0) {
        const idsToDelete = [...rowsToDelete];
        const { error: deleteChangedError } = await supabase
          .from('entries_raw')
          .delete()
          .in('id', idsToDelete)
          .eq('user_id', authData.user.id);

        if (deleteChangedError) {
          return errorResponse({
            request,
            httpStatus: 500,
            requestId,
            flowId,
            step: 'existing_changed_deleted',
            code: 'DB_WRITE_FAILED',
            message: 'Kon gewijzigde importitems niet vervangen.',
          });
        }
      }

      removedCount = rowsToDelete.size;
    }

    const rawPayload = itemsToInsert.map((item) => ({
      user_id: authData.user.id,
      source_type: item.sourceType,
      raw_text: item.rawText,
      transcript_text: null,
      captured_at: item.capturedAt,
      import_source_type: importSourceType,
      import_source_ref: sourceRef,
      import_file_name: fileName,
      import_external_message_id: item.externalMessageId,
    }));

    if (rawPayload.length > 0) {
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

      const { error: normalizedError } = await supabase
        .from('entries_normalized')
        .insert(normalizedPayload);
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
    }

    const response: ImportResponse = {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      sourceRef,
      importMode: appliedImportMode,
      importedCount: itemsToInsert.length,
      removedCount,
      unchangedCount,
      impactedDates: [...impactedDates].sort(),
      backgroundTask: undefined as never,
      requiresReplaceConfirmation: false,
    };

    const weekStarts = [...new Set(response.impactedDates.map(computeWeekStart))].sort();
    const monthStarts = [...new Set(response.impactedDates.map(computeMonthStart))].sort();
    const progressTotal = response.impactedDates.length + weekStarts.length + monthStarts.length;

    const { data: taskRow, error: taskError } = await supabase
      .from('user_background_tasks')
      .insert({
        user_id: authData.user.id,
        task_type: 'import_refresh',
        source_ref: sourceRef,
        status: 'queued',
        phase: 'queued',
        progress_current: 0,
        progress_total: progressTotal,
        payload: {
          impactedDates: response.impactedDates,
          weekStarts,
          monthStarts,
          dayCursor: 0,
          weekCursor: 0,
          monthCursor: 0,
          importedCount: response.importedCount,
          removedCount: response.removedCount,
          unchangedCount: response.unchangedCount,
          importMode: response.importMode,
          sourceRef,
        },
        warning_count: 0,
        started_at: new Date().toISOString(),
        completed_at: null,
        notice_seen_at: null,
        notice_dismissed_at: null,
        last_update_at: new Date().toISOString(),
      })
      .select(
        'id, task_type, status, phase, progress_current, progress_total, detail_current, detail_total, detail_label, warning_count, error_message, notice_dismissed_at, started_at, completed_at, created_at, updated_at'
      )
      .single();

    if (taskError || !taskRow) {
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step: 'background_task_created',
        code: 'DB_WRITE_FAILED',
        message: 'Kon import naverwerking niet plannen.',
      });
    }

    response.backgroundTask = mapBackgroundTaskRow(taskRow as BackgroundTaskInsertResult);

    const backgroundRun = processImportRefreshTask({
      supabase,
      runtimeEnv,
      authHeader,
      userId: authData.user.id,
      taskId: response.backgroundTask.id,
      impactedDates: response.impactedDates,
      flowId,
    }).catch(async (taskError) => {
      try {
        await updateBackgroundTask({
          supabase,
          taskId: response.backgroundTask.id,
          userId: authData.user.id,
          patch: {
            status: 'failed',
            phase: 'failed',
            error_message:
              taskError instanceof Error
                ? taskError.message
                : 'Import naverwerking is onverwacht gestopt.',
            completed_at: new Date().toISOString(),
          },
        });
      } catch {
        // Laat originele foutafhandeling leidend.
      }
    });

    // @ts-ignore -- EdgeRuntime is available in Supabase Edge Functions.
    if (typeof EdgeRuntime !== 'undefined' && typeof EdgeRuntime.waitUntil === 'function') {
      // @ts-ignore -- EdgeRuntime is available in Supabase Edge Functions.
      EdgeRuntime.waitUntil(backgroundRun);
    } else {
      await backgroundRun;
    }

    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step: 'completed',
      event: 'success',
      details: {
        userId: authData.user.id,
        importMode: appliedImportMode,
        importedCount: itemsToInsert.length,
        removedCount,
        unchangedCount,
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
