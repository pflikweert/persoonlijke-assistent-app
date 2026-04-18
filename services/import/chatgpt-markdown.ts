import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import { ensureAuthenticatedUserSession } from '@/services/auth';
import {
  createClientFlowId,
  FunctionFlowError,
  isFunctionErrorPayload,
} from '@/services/function-error';
import {
  listPreviewDays,
  parseChatGptMarkdownFile,
  parseImportMarkdownFile,
  summarizePreviewDate,
} from './chatgpt-markdown-parser';
export type {
  ChatGptMarkdownMessage,
  ChatGptMarkdownPreview,
  ImportedMarkdownMessage,
  ImportedMarkdownPreview,
  MarkdownImportFormat,
} from './chatgpt-markdown-parser';
import type { ImportedMarkdownPreview } from './chatgpt-markdown-parser';

type ImportResponse =
  | {
      status: 'ok';
      flow: 'import-chatgpt-markdown';
      requestId: string;
      flowId: string;
      sourceRef: string;
      importMode: 'merge_changed' | 'replace_all';
      importedCount: number;
      removedCount: number;
      unchangedCount: number;
      impactedDates: string[];
      backgroundTask: ImportBackgroundTask;
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

export type MarkdownImportMode = 'merge_changed' | 'replace_all';

export type BackgroundTaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export type ImportBackgroundTask = {
  id: string;
  taskType: 'import_refresh';
  status: BackgroundTaskStatus;
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

type ImportBackgroundTaskRow = {
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

export type ChatGptImportRefreshProgress =
  | 'markdownbestand analyseren'
  | 'importbestand voorbereiden'
  | 'entries importeren'
  | 'dagboekdagen opbouwen'
  | 'weekreflecties verversen'
  | 'maandreflecties verversen';

function parseFunctionMessage(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const message = (parsed as { error?: unknown; message?: unknown }).error;
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  const alt = (parsed as { message?: unknown }).message;
  return typeof alt === 'string' && alt.length > 0 ? alt : null;
}

async function parseFunctionInvokeError(error: unknown): Promise<never> {
  const fallback = error instanceof Error ? error.message : 'Importeren van markdown mislukt.';

  if (!error || typeof error !== 'object') {
    throw new Error(fallback);
  }

  const maybeContext = (error as { context?: unknown }).context;
  if (!(maybeContext instanceof Response)) {
    throw new Error(fallback);
  }

  const text = await maybeContext.text();
  if (!text) {
    throw new Error(fallback);
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    if (isFunctionErrorPayload(parsed)) {
      throw new FunctionFlowError(parsed);
    }

    throw new Error(parseFunctionMessage(parsed) ?? text);
  } catch (nextError) {
    if (nextError instanceof FunctionFlowError || nextError instanceof Error) {
      throw nextError;
    }

    throw new Error(text);
  }
}

function importSourceTypeFromPreview(preview: ImportedMarkdownPreview): string {
  return preview.format === 'journal_archive'
    ? 'journal_archive_import'
    : 'chatgpt_markdown_import';
}

function mapImportBackgroundTask(row: ImportBackgroundTaskRow): ImportBackgroundTask {
  const status: BackgroundTaskStatus =
    row.status === 'running' ||
    row.status === 'completed' ||
    row.status === 'failed' ||
    row.status === 'cancelled'
      ? row.status
      : 'queued';

  return {
    id: row.id,
    taskType: 'import_refresh',
    status,
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

export async function fetchLatestImportBackgroundTask(): Promise<ImportBackgroundTask | null> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { data, error } = await supabase
    .from('user_background_tasks' as any)
    .select(
      'id, task_type, status, phase, progress_current, progress_total, detail_current, detail_total, detail_label, warning_count, error_message, notice_dismissed_at, started_at, completed_at, created_at, updated_at'
    )
    .eq('task_type', 'import_refresh')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapImportBackgroundTask(data as unknown as ImportBackgroundTaskRow);
}

export async function fetchImportBackgroundTaskById(taskId: string): Promise<ImportBackgroundTask | null> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const id = taskId.trim();
  if (!id) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_background_tasks' as any)
    .select(
      'id, task_type, status, phase, progress_current, progress_total, detail_current, detail_total, detail_label, warning_count, error_message, notice_dismissed_at, started_at, completed_at, created_at, updated_at'
    )
    .eq('id', id)
    .eq('task_type', 'import_refresh')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapImportBackgroundTask(data as unknown as ImportBackgroundTaskRow);
}

export async function dismissImportBackgroundTaskNotice(taskId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const id = taskId.trim();
  if (!id) {
    return;
  }

  const timestamp = new Date().toISOString();
  const { error } = await supabase
    .from('user_background_tasks' as any)
    .update({
      notice_dismissed_at: timestamp,
      updated_at: timestamp,
      last_update_at: timestamp,
    })
    .eq('id', id)
    .eq('task_type', 'import_refresh');

  if (error) {
    throw error;
  }
}

export async function invokeMarkdownImport(input: {
  preview: ImportedMarkdownPreview;
  importMode?: MarkdownImportMode;
  replaceExisting?: boolean;
}): Promise<ImportResponse> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  if (input.preview.messages.length === 0) {
    throw new Error('Er zijn geen importeerbare entries gevonden in dit markdownbestand.');
  }

  const flowId = createClientFlowId('import-chatgpt');
  await ensureAuthenticatedUserSession({ flowId, source: 'import-chatgpt-markdown' });

  const { data, error } = await supabase.functions.invoke<ImportResponse>('import-chatgpt-markdown', {
    headers: {
      'x-flow-id': flowId,
    },
    body: {
      fileName: input.preview.fileName,
      sourceRef: input.preview.sourceRef,
      sourceConversationId: input.preview.sourceConversationId,
      conversationTitle: input.preview.conversationTitle,
      conversationAlias: input.preview.conversationAlias,
      importSourceType: importSourceTypeFromPreview(input.preview),
      importMode: input.importMode,
      replaceExisting: input.importMode ? input.importMode === 'replace_all' : (input.replaceExisting ?? false),
      items: input.preview.messages.map((message) => ({
        capturedAt: message.capturedAt,
        rawText: message.rawText,
        externalMessageId: message.externalMessageId,
        sourceType: message.sourceType,
      })),
    },
  });

  if (error) {
    await parseFunctionInvokeError(error);
  }

  if (!data || data.status !== 'ok' || data.flow !== 'import-chatgpt-markdown' || !data.requestId) {
    throw new Error('Ongeldige response van import-chatgpt-markdown.');
  }

  return data;
}

export async function invokeChatGptMarkdownImport(input: {
  preview: ImportedMarkdownPreview;
  importMode?: MarkdownImportMode;
  replaceExisting?: boolean;
}): Promise<ImportResponse> {
  return invokeMarkdownImport(input);
}

export async function importChatGptMarkdownPreview(input: {
  preview: ImportedMarkdownPreview;
  importMode?: MarkdownImportMode;
  replaceExisting?: boolean;
  onProgress?: (status: ChatGptImportRefreshProgress, current: number, total: number) => void;
}): Promise<ImportResponse & { refreshWarnings: string[] }> {
  input.onProgress?.('markdownbestand analyseren', 1, 5);
  input.onProgress?.('importbestand voorbereiden', 2, 5);
  input.onProgress?.('entries importeren', 3, 5);

  const data = await invokeMarkdownImport(input);

  if (data.requiresReplaceConfirmation) {
    return {
      ...data,
      refreshWarnings: [],
    };
  }

  return {
    ...data,
    refreshWarnings: [],
  };
}

export {
  listPreviewDays,
  parseChatGptMarkdownFile,
  parseImportMarkdownFile,
  summarizePreviewDate,
};
