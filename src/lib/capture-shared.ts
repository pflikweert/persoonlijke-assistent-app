import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import { isValidJournalDate } from '@/services';

export type CaptureRouteParams = {
  date?: string | string[];
  targetDate?: string | string[];
  returnTo?: string | string[];
  validation?: 'short' | 'no_speech' | string | string[];
};

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function toLocalJournalDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readSingleRouteParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function resolveCaptureJournalDate(
  value: string | string[] | undefined,
  targetValue?: string | string[] | undefined
): string | null {
  const preferred = readSingleRouteParam(targetValue);
  if (isValidJournalDate(preferred)) {
    return preferred;
  }

  const candidate = readSingleRouteParam(value);
  return isValidJournalDate(candidate) ? candidate : null;
}

export function buildDayReturnToPath(journalDate: string | null): string | null {
  return journalDate ? `/day/${journalDate}` : null;
}

export function resolveCaptureReturnTo(value: string | string[] | undefined): string | null {
  const candidate = readSingleRouteParam(value).trim();
  if (!candidate) {
    return null;
  }

  const match = /^\/day\/(\d{4}-\d{2}-\d{2})$/.exec(candidate);
  if (!match) {
    return null;
  }

  return isValidJournalDate(match[1]) ? candidate : null;
}

export function buildCaptureParams(
  journalDate: string | null,
  returnTo?: string | null
): { targetDate: string; returnTo?: string } | undefined {
  if (!journalDate) {
    return undefined;
  }

  const params: { targetDate: string; returnTo?: string } = {
    targetDate: journalDate,
  };

  if (returnTo) {
    params.returnTo = returnTo;
  }

  return params;
}

export function createCaptureContext(now = new Date(), journalDateOverride?: string): {
  capturedAt: string;
  journalDate: string;
  timezoneOffsetMinutes: number;
} {
  return {
    capturedAt: now.toISOString(),
    journalDate:
      journalDateOverride && isValidJournalDate(journalDateOverride) ? journalDateOverride : toLocalJournalDate(now),
    timezoneOffsetMinutes: now.getTimezoneOffset(),
  };
}

export function formatCaptureTargetDateLabel(journalDate: string | null): string | null {
  if (!journalDate || !isValidJournalDate(journalDate)) {
    return null;
  }

  const parsed = new Date(`${journalDate}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function extractJournalDateFromDayReturnTo(returnTo: string | null): string | null {
  if (!returnTo) {
    return null;
  }

  const match = /^\/day\/(\d{4}-\d{2}-\d{2})$/.exec(returnTo);
  if (!match) {
    return null;
  }

  return isValidJournalDate(match[1]) ? match[1] : null;
}

export function mimeTypeFromUri(uri: string): string {
  const normalized = uri.toLowerCase();

  if (normalized.endsWith('.webm')) {
    return 'audio/webm';
  }
  if (normalized.endsWith('.wav')) {
    return 'audio/wav';
  }
  if (normalized.endsWith('.mp3')) {
    return 'audio/mpeg';
  }
  if (normalized.endsWith('.ogg')) {
    return 'audio/ogg';
  }
  if (normalized.endsWith('.mp4')) {
    return 'audio/mp4';
  }
  if (normalized.endsWith('.m4a')) {
    return 'audio/m4a';
  }

  return Platform.OS === 'web' ? 'audio/webm' : 'audio/m4a';
}

function readWebBlobAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Kon web-opname niet lezen.'));
    };

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Web-opname leverde geen geldige data op.'));
        return;
      }

      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };

    reader.readAsDataURL(blob);
  });
}

export async function audioUriToBase64(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('Kon web-opname niet ophalen.');
    }

    const blob = await response.blob();
    return readWebBlobAsBase64(blob);
  }

  return readAsStringAsync(uri, { encoding: EncodingType.Base64 });
}
