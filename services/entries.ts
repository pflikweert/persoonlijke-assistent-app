import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import { getCurrentSession } from './auth';

export interface ProcessEntryResult {
  status: 'ok';
  rawEntryId: string;
  normalizedEntryId: string;
  journalDate: string;
  dayJournalId: string;
  sourceType?: 'text' | 'audio';
}

async function formatFunctionInvokeError(error: unknown): Promise<string> {
  const fallback =
    error instanceof Error ? error.message : 'Verwerken van notitie mislukt door onbekende fout.';

  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const maybeContext = (error as { context?: unknown }).context;
  if (!(maybeContext instanceof Response)) {
    return fallback;
  }

  try {
    const text = await maybeContext.text();
    if (!text) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(text) as { error?: string; message?: string };
      return parsed.error ?? parsed.message ?? text;
    } catch {
      return text;
    }
  } catch {
    return fallback;
  }
}

export async function submitTextEntry(input: {
  rawText: string;
  capturedAt?: string;
}): Promise<ProcessEntryResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const rawText = input.rawText.trim();

  if (!rawText) {
    throw new Error('Vul eerst een notitie in.');
  }

  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error('Je bent niet ingelogd. Vraag opnieuw een magic link aan.');
  }

  const { data, error } = await supabase.functions.invoke<ProcessEntryResult>('process-entry', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      rawText,
      capturedAt: input.capturedAt,
    },
  });

  if (error) {
    const detailedError = await formatFunctionInvokeError(error);
    throw new Error(detailedError);
  }

  if (!data) {
    throw new Error('Lege response van process-entry.');
  }

  return data;
}

const MAX_AUDIO_BASE64_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BASE64_CHARS = Math.ceil((MAX_AUDIO_BASE64_BYTES * 4) / 3);

export async function submitAudioEntry(input: {
  audioBase64: string;
  audioMimeType: string;
  capturedAt?: string;
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

  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error('Je bent niet ingelogd. Vraag opnieuw een magic link aan.');
  }

  const { data, error } = await supabase.functions.invoke<ProcessEntryResult>('process-entry', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      audioBase64,
      audioMimeType,
      capturedAt: input.capturedAt,
    },
  });

  if (error) {
    const detailedError = await formatFunctionInvokeError(error);
    throw new Error(detailedError);
  }

  if (!data) {
    throw new Error('Lege response van process-entry.');
  }

  return data;
}
