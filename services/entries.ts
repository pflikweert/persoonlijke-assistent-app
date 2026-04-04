import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import { ensureAuthenticatedUserSession } from './auth';
import { regenerateDayJournalByDate } from './day-journals';
import {
  createClientFlowId,
  FunctionFlowError,
  isFunctionErrorPayload,
} from './function-error';
import { generateReflection } from './reflections';

export interface ProcessEntryResult {
  status: 'ok';
  flow: 'process-entry';
  requestId: string;
  flowId: string;
  rawEntryId: string;
  normalizedEntryId: string;
  journalDate: string;
  dayJournalId: string;
  sourceType?: 'text' | 'audio';
}

async function parseFunctionInvokeError(error: unknown): Promise<never> {
  const fallback =
    error instanceof Error ? error.message : 'Verwerken van notitie mislukt door onbekende fout.';

  if (!error || typeof error !== 'object') {
    throw new Error(fallback);
  }

  const maybeContext = (error as { context?: unknown }).context;
  if (!(maybeContext instanceof Response)) {
    throw new Error(fallback);
  }

  try {
    const text = await maybeContext.text();
    if (!text) {
      throw new Error(fallback);
    }

    try {
      const parsed = JSON.parse(text) as unknown;
      if (isFunctionErrorPayload(parsed)) {
        throw new FunctionFlowError(parsed);
      }

      if (parsed && typeof parsed === 'object') {
        const message = (parsed as { error?: unknown; message?: unknown }).error;
        if (typeof message === 'string' && message.length > 0) {
          throw new Error(message);
        }
      }

      throw new Error(text);
    } catch (jsonError) {
      if (jsonError instanceof FunctionFlowError || jsonError instanceof Error) {
        throw jsonError;
      }
      throw new Error(text);
    }
  } catch (nextError) {
    if (nextError instanceof FunctionFlowError || nextError instanceof Error) {
      throw nextError;
    }

    throw new Error(fallback);
  }
}

export async function submitTextEntry(input: {
  rawText: string;
  capturedAt?: string;
  journalDate?: string;
  timezoneOffsetMinutes?: number;
  deferDerived?: boolean;
}): Promise<ProcessEntryResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const rawText = input.rawText.trim();

  if (!rawText) {
    throw new Error('Vul eerst een notitie in.');
  }

  const flowId = createClientFlowId('capture-text');
  await ensureAuthenticatedUserSession({ flowId, source: 'process-entry' });

  const { data, error } = await supabase.functions.invoke<ProcessEntryResult>('process-entry', {
    headers: {
      'x-flow-id': flowId,
    },
    body: {
      rawText,
      capturedAt: input.capturedAt,
      journalDate: input.journalDate,
      timezoneOffsetMinutes: input.timezoneOffsetMinutes,
      deferDerived: input.deferDerived ?? false,
    },
  });

  if (error) {
    await parseFunctionInvokeError(error);
  }

  if (!data) {
    throw new Error('Lege response van process-entry.');
  }

  if (data.status !== 'ok' || data.flow !== 'process-entry' || !data.requestId) {
    throw new Error('Ongeldige response van process-entry.');
  }

  return data;
}

const MAX_AUDIO_BASE64_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BASE64_CHARS = Math.ceil((MAX_AUDIO_BASE64_BYTES * 4) / 3);

export async function submitAudioEntry(input: {
  audioBase64: string;
  audioMimeType: string;
  capturedAt?: string;
  journalDate?: string;
  timezoneOffsetMinutes?: number;
  deferDerived?: boolean;
}): Promise<ProcessEntryResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const audioBase64 = input.audioBase64.trim();
  const audioMimeType = input.audioMimeType.trim();

  if (!audioBase64) {
    throw new Error('Er is geen audio-opname om te verwerken.');
  }

  if (!audioMimeType) {
    throw new Error('Audio MIME type ontbreekt.');
  }

  if (audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
    throw new Error('Audio-opname is te groot. Neem een kortere opname op.');
  }

  const flowId = createClientFlowId('capture-audio');
  await ensureAuthenticatedUserSession({ flowId, source: 'process-entry' });

  const { data, error } = await supabase.functions.invoke<ProcessEntryResult>('process-entry', {
    headers: {
      'x-flow-id': flowId,
    },
    body: {
      audioBase64,
      audioMimeType,
      capturedAt: input.capturedAt,
      journalDate: input.journalDate,
      timezoneOffsetMinutes: input.timezoneOffsetMinutes,
      deferDerived: input.deferDerived ?? false,
    },
  });

  if (error) {
    await parseFunctionInvokeError(error);
  }

  if (!data) {
    throw new Error('Lege response van process-entry.');
  }

  if (data.status !== 'ok' || data.flow !== 'process-entry' || !data.requestId) {
    throw new Error('Ongeldige response van process-entry.');
  }

  return data;
}

export async function refreshDerivedAfterCaptureInBackground(
  journalDate: string
): Promise<void> {
  try {
    await regenerateDayJournalByDate(journalDate);
  } catch (error) {
    console.warn('[capture-background] day journal refresh failed', error);
    return;
  }

  try {
    await generateReflection({ periodType: 'week', anchorDate: journalDate });
  } catch (error) {
    console.warn('[capture-background] week reflection refresh failed', error);
  }

  try {
    await generateReflection({ periodType: 'month', anchorDate: journalDate });
  } catch (error) {
    console.warn('[capture-background] month reflection refresh failed', error);
  }
}
