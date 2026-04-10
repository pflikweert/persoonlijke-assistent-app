import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import { isValidJournalDate } from '@/services';

export type CaptureRouteParams = {
  date?: string | string[];
};

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function combineLocalDateWithCurrentTime(journalDate: string, now = new Date()): Date | null {
  if (!isValidJournalDate(journalDate)) {
    return null;
  }

  const [yearRaw, monthRaw, dayRaw] = journalDate.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
}

function toLocalJournalDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function resolveCaptureJournalDate(value: string | string[] | undefined): string | null {
  const candidate = Array.isArray(value) ? value[0] ?? '' : value ?? '';
  return isValidJournalDate(candidate) ? candidate : null;
}

export function buildCaptureParams(journalDate: string | null): { date: string } | undefined {
  return journalDate ? { date: journalDate } : undefined;
}

export function createCaptureContext(now = new Date(), journalDateOverride?: string): {
  capturedAt: string;
  journalDate: string;
  timezoneOffsetMinutes: number;
} {
  const captureDate = journalDateOverride ? combineLocalDateWithCurrentTime(journalDateOverride, now) : now;

  return {
    capturedAt: (captureDate ?? now).toISOString(),
    journalDate:
      journalDateOverride && isValidJournalDate(journalDateOverride) ? journalDateOverride : toLocalJournalDate(now),
    timezoneOffsetMinutes: (captureDate ?? now).getTimezoneOffset(),
  };
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
