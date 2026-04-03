import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import { ensureAuthenticatedUserSession } from '@/services/auth';
import {
  createClientFlowId,
  FunctionFlowError,
  isFunctionErrorPayload,
} from '@/services/function-error';
import { regenerateDayJournalByDate } from '@/services/day-journals';
import { generateReflection } from '@/services/reflections';
import {
  listPreviewDays,
  parseChatGptMarkdownFile,
  summarizePreviewDate,
} from './chatgpt-markdown-parser';
export type { ChatGptMarkdownMessage, ChatGptMarkdownPreview } from './chatgpt-markdown-parser';
import type { ChatGptMarkdownPreview } from './chatgpt-markdown-parser';

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

export type ChatGptImportRefreshProgress =
  | 'markdownbestand analyseren'
  | 'user-berichten voorbereiden'
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

function computeMonthStart(anchorDate: string): string {
  return `${anchorDate.slice(0, 7)}-01`;
}

function computeWeekStart(anchorDate: string): string {
  const anchor = new Date(`${anchorDate}T00:00:00.000Z`);
  const day = anchor.getUTCDay();
  const offsetToMonday = (day + 6) % 7;
  const weekStart = new Date(anchor.getTime() - offsetToMonday * 24 * 60 * 60 * 1000);
  return weekStart.toISOString().slice(0, 10);
}

export async function invokeChatGptMarkdownImport(input: {
  preview: ChatGptMarkdownPreview;
  replaceExisting?: boolean;
}): Promise<ImportResponse> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  if (input.preview.messages.length === 0) {
    throw new Error('Er zijn geen user-berichten gevonden om te importeren.');
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
      replaceExisting: input.replaceExisting ?? false,
      items: input.preview.messages.map((message) => ({
        capturedAt: message.capturedAt,
        rawText: message.rawText,
        externalMessageId: message.externalMessageId,
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

export async function refreshImportedChatGptDerivedContent(input: {
  impactedDates: string[];
  onProgress?: (status: ChatGptImportRefreshProgress, current: number, total: number) => void;
}): Promise<string[]> {
  const refreshWarnings: string[] = [];
  const uniqueDates = [...new Set(input.impactedDates)].sort();

  input.onProgress?.('dagboekdagen opbouwen', 0, Math.max(uniqueDates.length, 1));

  for (const [index, journalDate] of uniqueDates.entries()) {
    input.onProgress?.('dagboekdagen opbouwen', index + 1, uniqueDates.length);
    try {
      await regenerateDayJournalByDate(journalDate);
    } catch (nextError) {
      refreshWarnings.push(
        nextError instanceof Error
          ? `Dagjournal ${journalDate}: ${nextError.message}`
          : `Dagjournal ${journalDate} kon niet worden vernieuwd.`
      );
    }
  }

  const weekStarts = [...new Set(uniqueDates.map(computeWeekStart))].sort();
  input.onProgress?.('weekreflecties verversen', 0, Math.max(weekStarts.length, 1));
  for (const [index, anchorDate] of weekStarts.entries()) {
    input.onProgress?.('weekreflecties verversen', index + 1, weekStarts.length);
    try {
      await generateReflection({ periodType: 'week', anchorDate, forceRegenerate: true });
    } catch (nextError) {
      refreshWarnings.push(
        nextError instanceof Error
          ? `Weekreflectie ${anchorDate}: ${nextError.message}`
          : `Weekreflectie ${anchorDate} kon niet worden vernieuwd.`
      );
    }
  }

  const monthStarts = [...new Set(uniqueDates.map(computeMonthStart))].sort();
  input.onProgress?.('maandreflecties verversen', 0, Math.max(monthStarts.length, 1));
  for (const [index, anchorDate] of monthStarts.entries()) {
    input.onProgress?.('maandreflecties verversen', index + 1, monthStarts.length);
    try {
      await generateReflection({ periodType: 'month', anchorDate, forceRegenerate: true });
    } catch (nextError) {
      refreshWarnings.push(
        nextError instanceof Error
          ? `Maandreflectie ${anchorDate}: ${nextError.message}`
          : `Maandreflectie ${anchorDate} kon niet worden vernieuwd.`
      );
    }
  }

  return refreshWarnings;
}

export async function importChatGptMarkdownPreview(input: {
  preview: ChatGptMarkdownPreview;
  replaceExisting?: boolean;
  onProgress?: (status: ChatGptImportRefreshProgress, current: number, total: number) => void;
}): Promise<ImportResponse & { refreshWarnings: string[] }> {
  input.onProgress?.('markdownbestand analyseren', 1, 5);
  input.onProgress?.('user-berichten voorbereiden', 2, 5);
  input.onProgress?.('entries importeren', 3, 5);

  const data = await invokeChatGptMarkdownImport(input);

  if (data.requiresReplaceConfirmation) {
    return {
      ...data,
      refreshWarnings: [],
    };
  }

  const refreshWarnings = await refreshImportedChatGptDerivedContent({
    impactedDates: data.impactedDates,
    onProgress: input.onProgress,
  });

  return {
    ...data,
    refreshWarnings,
  };
}

export { listPreviewDays, parseChatGptMarkdownFile, summarizePreviewDate };
