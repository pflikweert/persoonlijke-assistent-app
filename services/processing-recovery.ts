import { Platform } from 'react-native';

import { getSupabaseBrowserClient } from '@/src/lib/supabase';

const CAPTURE_PROCESSING_STORAGE_KEY = 'pa.capture.processing-session.v1';
const MAX_RECOVERY_AGE_MS = 24 * 60 * 60 * 1000;

export type CaptureProcessingSourceType = 'text' | 'audio';

export type CaptureProcessingPhase =
  | 'prepared'
  | 'submitting'
  | 'server_acknowledged'
  | 'completed'
  | 'failed';

export type CaptureProcessingSession = {
  kind: 'capture-submit';
  clientProcessingId: string;
  sourceType: CaptureProcessingSourceType;
  capturedAt: string;
  journalDate: string;
  timezoneOffsetMinutes: number;
  phase: CaptureProcessingPhase;
  createdAt: string;
  updatedAt: string;
  retryCount: number;
  rawEntryId?: string | null;
  normalizedEntryId?: string | null;
  failureReason?: string | null;
};

export type CaptureProcessingRecoveryCheck =
  | {
      status: 'completed';
      session: CaptureProcessingSession;
      rawEntryId: string;
      normalizedEntryId: string;
      journalDate: string;
      sourceType: CaptureProcessingSourceType;
    }
  | {
      status: 'raw-only';
      session: CaptureProcessingSession;
      rawEntryId: string;
      journalDate: string;
      sourceType: CaptureProcessingSourceType;
    }
  | {
      status: 'not-found';
      session: CaptureProcessingSession;
    }
  | {
      status: 'recovery-unavailable';
      session: CaptureProcessingSession;
    };

function getWebStorage(): Storage | null {
  if (Platform.OS !== 'web') {
    return null;
  }

  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isCaptureProcessingSourceType(value: unknown): value is CaptureProcessingSourceType {
  return value === 'text' || value === 'audio';
}

function isCaptureProcessingPhase(value: unknown): value is CaptureProcessingPhase {
  return (
    value === 'prepared' ||
    value === 'submitting' ||
    value === 'server_acknowledged' ||
    value === 'completed' ||
    value === 'failed'
  );
}

function normalizeString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function isRecoverySchemaUnavailableError(error: {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}): boolean {
  const combined = `${error.message ?? ''} ${error.details ?? ''} ${error.hint ?? ''}`.toLowerCase();
  if (!combined.includes('client_processing_id')) {
    return false;
  }

  return error.code === '42703' || error.code === 'PGRST204' || combined.includes('column');
}

function parseStoredCaptureProcessingSession(value: unknown): CaptureProcessingSession | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<CaptureProcessingSession>;
  if (candidate.kind !== 'capture-submit') {
    return null;
  }

  const clientProcessingId = normalizeString(candidate.clientProcessingId);
  const capturedAt = normalizeString(candidate.capturedAt);
  const journalDate = normalizeString(candidate.journalDate);
  const createdAt = normalizeString(candidate.createdAt);
  const updatedAt = normalizeString(candidate.updatedAt);

  if (
    !clientProcessingId ||
    !capturedAt ||
    !journalDate ||
    !createdAt ||
    !updatedAt ||
    !isCaptureProcessingSourceType(candidate.sourceType) ||
    !isCaptureProcessingPhase(candidate.phase) ||
    typeof candidate.timezoneOffsetMinutes !== 'number' ||
    !Number.isFinite(candidate.timezoneOffsetMinutes)
  ) {
    return null;
  }

  return {
    kind: 'capture-submit',
    clientProcessingId,
    sourceType: candidate.sourceType,
    capturedAt,
    journalDate,
    timezoneOffsetMinutes: candidate.timezoneOffsetMinutes,
    phase: candidate.phase,
    createdAt,
    updatedAt,
    retryCount:
      typeof candidate.retryCount === 'number' && Number.isFinite(candidate.retryCount)
        ? Math.max(0, Math.round(candidate.retryCount))
        : 0,
    rawEntryId: normalizeString(candidate.rawEntryId) ?? null,
    normalizedEntryId: normalizeString(candidate.normalizedEntryId) ?? null,
    failureReason: normalizeString(candidate.failureReason) ?? null,
  };
}

function isExpired(session: CaptureProcessingSession): boolean {
  const createdAtMs = new Date(session.createdAt).getTime();
  return Number.isFinite(createdAtMs) && Date.now() - createdAtMs > MAX_RECOVERY_AGE_MS;
}

function logCaptureProcessing(event: string, details?: Record<string, unknown>) {
  console.info('[capture-processing]', event, details ?? {});
}

export function createClientProcessingId(sourceType: CaptureProcessingSourceType): string {
  const random =
    globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  return `capture-${sourceType}-${random}`;
}

export function createCaptureProcessingSession(input: {
  clientProcessingId: string;
  sourceType: CaptureProcessingSourceType;
  capturedAt: string;
  journalDate: string;
  timezoneOffsetMinutes: number;
}): CaptureProcessingSession {
  const now = new Date().toISOString();

  return {
    kind: 'capture-submit',
    clientProcessingId: input.clientProcessingId,
    sourceType: input.sourceType,
    capturedAt: input.capturedAt,
    journalDate: input.journalDate,
    timezoneOffsetMinutes: input.timezoneOffsetMinutes,
    phase: 'prepared',
    createdAt: now,
    updatedAt: now,
    retryCount: 0,
    rawEntryId: null,
    normalizedEntryId: null,
    failureReason: null,
  };
}

export function loadCaptureProcessingSession(): CaptureProcessingSession | null {
  const storage = getWebStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(CAPTURE_PROCESSING_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = parseStoredCaptureProcessingSession(JSON.parse(raw));
    if (!parsed || isExpired(parsed)) {
      storage.removeItem(CAPTURE_PROCESSING_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    storage.removeItem(CAPTURE_PROCESSING_STORAGE_KEY);
    return null;
  }
}

export function saveCaptureProcessingSession(session: CaptureProcessingSession): CaptureProcessingSession {
  const nextSession = {
    ...session,
    updatedAt: new Date().toISOString(),
  };
  const storage = getWebStorage();

  if (storage) {
    storage.setItem(CAPTURE_PROCESSING_STORAGE_KEY, JSON.stringify(nextSession));
  }

  return nextSession;
}

export function updateCaptureProcessingSession(
  patch: Partial<CaptureProcessingSession>
): CaptureProcessingSession | null {
  const current = loadCaptureProcessingSession();
  if (!current) {
    return null;
  }

  return saveCaptureProcessingSession({
    ...current,
    ...patch,
  });
}

export function clearCaptureProcessingSession(clientProcessingId?: string | null) {
  const storage = getWebStorage();
  if (!storage) {
    return;
  }

  if (clientProcessingId) {
    const current = loadCaptureProcessingSession();
    if (current && current.clientProcessingId !== clientProcessingId) {
      return;
    }
  }

  storage.removeItem(CAPTURE_PROCESSING_STORAGE_KEY);
}

export async function checkCaptureProcessingSession(
  session: CaptureProcessingSession
): Promise<CaptureProcessingRecoveryCheck> {
  logCaptureProcessing('recovery_check', {
    clientProcessingId: session.clientProcessingId,
    sourceType: session.sourceType,
    phase: session.phase,
  });

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { data: rawEntry, error: rawError } = await supabase
    .from('entries_raw')
    .select('id, source_type, journal_date, captured_at')
    .eq('client_processing_id', session.clientProcessingId)
    .maybeSingle();

  if (rawError) {
    if (isRecoverySchemaUnavailableError(rawError)) {
      logCaptureProcessing('recovery_unavailable', {
        clientProcessingId: session.clientProcessingId,
        reason: rawError.message ?? rawError.code ?? 'unknown',
      });
      return {
        status: 'recovery-unavailable',
        session,
      };
    }
    throw rawError;
  }

  if (!rawEntry) {
    return {
      status: 'not-found',
      session,
    };
  }

  const { data: normalizedEntry, error: normalizedError } = await supabase
    .from('entries_normalized')
    .select('id')
    .eq('raw_entry_id', rawEntry.id)
    .maybeSingle();

  if (normalizedError) {
    throw normalizedError;
  }

  const sourceType = isCaptureProcessingSourceType(rawEntry.source_type)
    ? rawEntry.source_type
    : session.sourceType;
  const journalDate = rawEntry.journal_date ?? session.journalDate;

  if (normalizedEntry) {
    return {
      status: 'completed',
      session,
      rawEntryId: rawEntry.id,
      normalizedEntryId: normalizedEntry.id,
      journalDate,
      sourceType,
    };
  }

  return {
    status: 'raw-only',
    session,
    rawEntryId: rawEntry.id,
    journalDate,
    sourceType,
  };
}

export { logCaptureProcessing };
