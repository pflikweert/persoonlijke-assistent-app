import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import type { Json, Tables } from '@/src/lib/supabase/database.types';
import { ensureAuthenticatedUserSession } from '@/services/auth';
import { createClientFlowId } from '@/services/function-error';

type RawEntryRow = Pick<Tables<'entries_raw'>, 'id' | 'captured_at' | 'journal_date' | 'source_type'>;
type NormalizedEntryRow = Pick<Tables<'entries_normalized'>, 'raw_entry_id' | 'body'>;
type DayRow = Pick<Tables<'day_journals'>, 'journal_date' | 'summary' | 'narrative_text'>;
type ReflectionRow = Pick<
  Tables<'period_reflections'>,
  'period_type' | 'period_start' | 'period_end' | 'summary_text' | 'narrative_text' | 'highlights_json' | 'reflection_points_json'
>;

type ExportEntry = {
  capturedAt: string;
  journalDate: string | null;
  sourceType: 'text' | 'audio';
  body: string;
};

type ExportReflection = {
  periodType: 'week' | 'month';
  periodStart: string;
  periodEnd: string;
  summaryText: string;
  narrativeText: string;
  highlights: string[];
  reflectionPoints: string[];
};

type ExportSnapshot = {
  days: DayRow[];
  entries: ExportEntry[];
  looseEntries: ExportEntry[];
  weekReflections: ExportReflection[];
  monthReflections: ExportReflection[];
};

export type ArchiveExportResult =
  | {
      status: 'empty';
    }
  | {
      status: 'saved';
      fileName: string;
      days: number;
      entries: number;
      weekReflections: number;
      monthReflections: number;
    };

const PAGE_SIZE = 500;

function toDateLabel(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDateTimeLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const date = toDateLabel(parsed);
  const hour = String(parsed.getHours()).padStart(2, '0');
  const minute = String(parsed.getMinutes()).padStart(2, '0');
  return `${date} ${hour}:${minute}`;
}

function normalizeStringList(value: Json): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

function sourceLabel(sourceType: 'text' | 'audio'): string {
  return sourceType === 'audio' ? 'spraak' : 'tekst';
}

function escapeHeader(value: string): string {
  return value.replace(/\n+/g, ' ').trim();
}

async function fetchAllRawEntries(): Promise<RawEntryRow[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const rows: RawEntryRow[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('entries_raw')
      .select('id, captured_at, journal_date, source_type')
      .order('captured_at', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    const next = (data ?? []) as RawEntryRow[];
    rows.push(...next);
    if (next.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  return rows;
}

async function fetchAllNormalizedEntries(): Promise<NormalizedEntryRow[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const rows: NormalizedEntryRow[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('entries_normalized')
      .select('raw_entry_id, body')
      .order('created_at', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    const next = (data ?? []) as NormalizedEntryRow[];
    rows.push(...next);
    if (next.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  return rows;
}

async function fetchAllDayJournals(): Promise<DayRow[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const rows: DayRow[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('day_journals')
      .select('journal_date, summary, narrative_text')
      .order('journal_date', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    const next = (data ?? []) as DayRow[];
    rows.push(...next);
    if (next.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  return rows;
}

async function fetchAllReflections(): Promise<ExportReflection[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const rows: ExportReflection[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('period_reflections')
      .select('period_type, period_start, period_end, summary_text, narrative_text, highlights_json, reflection_points_json')
      .order('period_start', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    const next = (data ?? []) as ReflectionRow[];
    rows.push(
      ...next
        .filter(
          (row): row is ReflectionRow & { period_type: 'week' | 'month' } =>
            row.period_type === 'week' || row.period_type === 'month'
        )
        .map((row) => ({
          periodType: row.period_type,
          periodStart: row.period_start,
          periodEnd: row.period_end,
          summaryText: row.summary_text,
          narrativeText: row.narrative_text,
          highlights: normalizeStringList(row.highlights_json),
          reflectionPoints: normalizeStringList(row.reflection_points_json),
        }))
    );

    if (next.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  return rows;
}

function buildSnapshot(input: {
  rawEntries: RawEntryRow[];
  normalizedEntries: NormalizedEntryRow[];
  days: DayRow[];
  reflections: ExportReflection[];
}): ExportSnapshot {
  const normalizedByRawEntry = new Map<string, string>(
    input.normalizedEntries.map((row) => [row.raw_entry_id, row.body])
  );

  const entries: ExportEntry[] = input.rawEntries
    .map((raw) => {
      const body = normalizedByRawEntry.get(raw.id);
      if (!body || body.trim().length === 0) {
        return null;
      }

      return {
        capturedAt: raw.captured_at,
        journalDate: raw.journal_date,
        sourceType: raw.source_type === 'audio' ? 'audio' : 'text',
        body,
      } satisfies ExportEntry;
    })
    .filter((entry): entry is ExportEntry => entry !== null);

  const daysByDate = new Set(input.days.map((day) => day.journal_date));
  const looseEntries = entries.filter((entry) => !entry.journalDate || !daysByDate.has(entry.journalDate));

  return {
    days: input.days,
    entries,
    looseEntries,
    weekReflections: input.reflections.filter((item) => item.periodType === 'week'),
    monthReflections: input.reflections.filter((item) => item.periodType === 'month'),
  };
}

function pushReflectionSection(lines: string[], title: string, items: ExportReflection[]): void {
  lines.push(`## ${title}`);
  lines.push('');

  if (items.length === 0) {
    lines.push('Nog niet beschikbaar.');
    lines.push('');
    return;
  }

  for (const item of items) {
    lines.push(`### ${item.periodStart} t/m ${item.periodEnd}`);
    lines.push('');
    lines.push('Korte samenvatting');
    lines.push(item.summaryText || '-');
    lines.push('');
    lines.push('Reflectietekst');
    lines.push(item.narrativeText || '-');
    lines.push('');

    if (item.highlights.length > 0) {
      lines.push('Belangrijke punten');
      for (const highlight of item.highlights) {
        lines.push(`- ${highlight}`);
      }
      lines.push('');
    }

    if (item.reflectionPoints.length > 0) {
      lines.push('Vervolgpunten');
      for (const point of item.reflectionPoints) {
        lines.push(`- ${point}`);
      }
      lines.push('');
    }
  }
}

function buildArchiveMarkdown(snapshot: ExportSnapshot): string {
  const exportDate = toDateLabel(new Date());
  const lines: string[] = [];

  lines.push('# Mijn archief');
  lines.push('');
  lines.push(`Exportdatum: ${exportDate}`);
  lines.push(`Dagen: ${snapshot.days.length}`);
  lines.push(`Entries: ${snapshot.entries.length}`);
  lines.push(`Weekreflecties: ${snapshot.weekReflections.length}`);
  lines.push(`Maandreflecties: ${snapshot.monthReflections.length}`);
  lines.push('');
  lines.push('## Dagen');
  lines.push('');

  if (snapshot.days.length === 0) {
    lines.push('Nog niet beschikbaar.');
    lines.push('');
  } else {
    const entriesByDate = new Map<string, ExportEntry[]>();
    for (const entry of snapshot.entries) {
      if (!entry.journalDate) {
        continue;
      }

      const bucket = entriesByDate.get(entry.journalDate) ?? [];
      bucket.push(entry);
      entriesByDate.set(entry.journalDate, bucket);
    }

    for (const day of snapshot.days) {
      lines.push(`### ${day.journal_date}`);
      lines.push('');
      lines.push('Korte samenvatting');
      lines.push(day.summary || '-');
      lines.push('');
      lines.push('Dagtekst');
      lines.push(day.narrative_text || '-');
      lines.push('');
      lines.push('Entries');
      lines.push('');

      const dayEntries = entriesByDate.get(day.journal_date) ?? [];
      if (dayEntries.length === 0) {
        lines.push('Nog geen entries voor deze dag.');
        lines.push('');
      } else {
        for (const [index, entry] of dayEntries.entries()) {
          lines.push(`#### Entry ${index + 1} · ${toDateTimeLabel(entry.capturedAt)} · ${sourceLabel(entry.sourceType)}`);
          lines.push('');
          lines.push(entry.body.trim());
          lines.push('');
        }
      }
    }
  }

  lines.push('## Losse entries');
  lines.push('');
  if (snapshot.looseEntries.length === 0) {
    lines.push('Geen losse entries.');
    lines.push('');
  } else {
    for (const [index, entry] of snapshot.looseEntries.entries()) {
      const dateHeader = entry.journalDate ? `${entry.journalDate} (zonder dagblok)` : 'zonder dagdatum';
      lines.push(`### Losse entry ${index + 1} · ${dateHeader}`);
      lines.push('');
      lines.push(`Vastgelegd: ${toDateTimeLabel(entry.capturedAt)} · ${sourceLabel(entry.sourceType)}`);
      lines.push('');
      lines.push(entry.body.trim());
      lines.push('');
    }
  }

  pushReflectionSection(lines, 'Weekreflecties', snapshot.weekReflections);
  pushReflectionSection(lines, 'Maandreflecties', snapshot.monthReflections);

  return lines.join('\n').trimEnd() + '\n';
}

function buildExportFileName(): string {
  return `dagboek-archief-${toDateLabel(new Date())}.md`;
}

function triggerWebDownload(fileName: string, contents: string): void {
  if (typeof document === 'undefined') {
    throw new Error('Downloaden is op dit platform niet beschikbaar.');
  }

  const blob = new Blob([contents], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function saveToLocalDocument(fileName: string, contents: string): void {
  const file = new File(Paths.document, fileName);
  if (file.exists) {
    file.delete();
  }

  file.create({ intermediates: true, overwrite: true });
  file.write(contents, { encoding: 'utf8' });
}

export async function downloadUserArchive(): Promise<ArchiveExportResult> {
  const flowId = createClientFlowId('export-archive');
  await ensureAuthenticatedUserSession({ flowId, source: 'export-archive' });

  const [rawEntries, normalizedEntries, days, reflections] = await Promise.all([
    fetchAllRawEntries(),
    fetchAllNormalizedEntries(),
    fetchAllDayJournals(),
    fetchAllReflections(),
  ]);

  const snapshot = buildSnapshot({
    rawEntries,
    normalizedEntries,
    days,
    reflections,
  });

  const hasContent =
    snapshot.days.length > 0 ||
    snapshot.entries.length > 0 ||
    snapshot.weekReflections.length > 0 ||
    snapshot.monthReflections.length > 0;

  if (!hasContent) {
    return {
      status: 'empty',
    };
  }

  const fileName = buildExportFileName();
  const contents = buildArchiveMarkdown(snapshot);

  if (Platform.OS === 'web') {
    triggerWebDownload(fileName, contents);
  } else {
    saveToLocalDocument(fileName, contents);
  }

  return {
    status: 'saved',
    fileName,
    days: snapshot.days.length,
    entries: snapshot.entries.length,
    weekReflections: snapshot.weekReflections.length,
    monthReflections: snapshot.monthReflections.length,
  };
}
