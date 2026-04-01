import type { Json, Tables } from '@/src/lib/supabase/database.types';
import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import { getCurrentSession } from './auth';

export type DayJournalSummary = Pick<
  Tables<'day_journals'>,
  'id' | 'journal_date' | 'summary' | 'sections' | 'updated_at'
>;

export type NormalizedDayEntry = Pick<
  Tables<'entries_normalized'>,
  'id' | 'raw_entry_id' | 'title' | 'body' | 'created_at'
> & {
  source_type: 'text' | 'audio';
  captured_at: string;
};

const JOURNAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function normalizeLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function dedupeLines(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const clean = normalizeLine(value);
    if (!clean) {
      continue;
    }

    const key = clean.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(clean);
  }

  return output;
}

function composeDayJournalDraft(entries: NormalizedDayEntry[]): { summary: string; sections: string[] } {
  const normalized = entries
    .map((entry) => ({
      title: normalizeLine(entry.title || ''),
      body: normalizeLine(entry.body || ''),
    }))
    .filter((entry) => entry.title.length > 0 || entry.body.length > 0);

  if (normalized.length === 0) {
    return {
      summary: 'Nog geen bruikbare notities voor deze dag.',
      sections: [],
    };
  }

  const narrativeParts = normalized
    .map((entry) => entry.body)
    .filter((body) => body.length > 0)
    .slice(0, 3)
    .map((body) => (/[.!?]$/.test(body) ? body : `${body}.`));

  const summary =
    narrativeParts.length > 0
      ? narrativeParts.join(' ')
      : normalized.length === 1
        ? `${normalized[0]?.title || 'Moment'} vastgelegd.`
        : `${normalized.length} momenten vastgelegd in je dag.`;

  const sections = dedupeLines(
    normalized
      .map((entry) => entry.title)
      .filter((title) => title.length > 0)
  ).slice(0, 4);

  return {
    summary,
    sections,
  };
}

export function getUtcTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isValidJournalDate(value: string): boolean {
  return JOURNAL_DATE_PATTERN.test(value);
}

export function parseJournalSections(value: Json): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

function getUtcDateBounds(journalDate: string): { start: string; end: string } {
  if (!isValidJournalDate(journalDate)) {
    throw new Error('Ongeldige datum. Gebruik formaat YYYY-MM-DD.');
  }

  const start = `${journalDate}T00:00:00.000Z`;
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

  return {
    start,
    end: endDate.toISOString(),
  };
}

export async function fetchTodayJournal(todayDate = getUtcTodayDate()): Promise<DayJournalSummary | null> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { data, error } = await supabase
    .from('day_journals')
    .select('id, journal_date, summary, sections, updated_at')
    .eq('journal_date', todayDate)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchRecentDayJournals(limit = 14): Promise<DayJournalSummary[]> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const safeLimit = Math.max(1, Math.min(limit, 60));

  const { data, error } = await supabase
    .from('day_journals')
    .select('id, journal_date, summary, sections, updated_at')
    .order('journal_date', { ascending: false })
    .limit(safeLimit);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchDayJournalByDate(journalDate: string): Promise<DayJournalSummary | null> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  if (!isValidJournalDate(journalDate)) {
    throw new Error('Ongeldige datum. Gebruik formaat YYYY-MM-DD.');
  }

  const { data, error } = await supabase
    .from('day_journals')
    .select('id, journal_date, summary, sections, updated_at')
    .eq('journal_date', journalDate)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchNormalizedEntriesByDate(journalDate: string): Promise<NormalizedDayEntry[]> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const bounds = getUtcDateBounds(journalDate);

  const { data: rawRows, error: rawError } = await supabase
    .from('entries_raw')
    .select('id, source_type, captured_at')
    .gte('captured_at', bounds.start)
    .lt('captured_at', bounds.end)
    .order('captured_at', { ascending: true });

  if (rawError) {
    throw rawError;
  }

  const rawIds = (rawRows ?? []).map((row) => row.id);

  if (rawIds.length === 0) {
    return [];
  }

  const { data: normalizedRows, error: normalizedError } = await supabase
    .from('entries_normalized')
    .select('id, raw_entry_id, title, body, created_at')
    .in('raw_entry_id', rawIds)
    .order('created_at', { ascending: true });

  if (normalizedError) {
    throw normalizedError;
  }

  const rawOrder = new Map<string, number>(rawIds.map((id, index) => [id, index]));
  const rawMeta = new Map<
    string,
    {
      source_type: 'text' | 'audio';
      captured_at: string;
    }
  >(
    (rawRows ?? []).map((row) => [
      row.id,
      {
        source_type: row.source_type as 'text' | 'audio',
        captured_at: row.captured_at,
      },
    ])
  );

  return (normalizedRows ?? [])
    .sort((left, right) => {
      const leftIndex = rawOrder.get(left.raw_entry_id) ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = rawOrder.get(right.raw_entry_id) ?? Number.MAX_SAFE_INTEGER;
      return leftIndex - rightIndex;
    })
    .map((row) => {
      const meta = rawMeta.get(row.raw_entry_id);
      return {
        ...row,
        source_type: meta?.source_type ?? 'text',
        captured_at: meta?.captured_at ?? row.created_at,
      };
    });
}

export async function updateNormalizedEntryById(input: {
  id: string;
  title?: string;
  body: string;
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const body = input.body.trim();

  if (!body) {
    throw new Error('Inhoud mag niet leeg zijn.');
  }

  const updates: { title?: string; body: string } = {
    body,
  };

  if (typeof input.title === 'string') {
    updates.title = input.title.trim();
  }

  const { error } = await supabase.from('entries_normalized').update(updates).eq('id', input.id);

  if (error) {
    throw error;
  }
}

export async function deleteNormalizedEntryById(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { data, error: selectError } = await supabase
    .from('entries_normalized')
    .select('raw_entry_id')
    .eq('id', id)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  const rawEntryId = data?.raw_entry_id ?? null;

  if (!rawEntryId) {
    const { error: fallbackDeleteError } = await supabase.from('entries_normalized').delete().eq('id', id);
    if (fallbackDeleteError) {
      throw fallbackDeleteError;
    }
    return;
  }

  const { error: rawDeleteError } = await supabase.from('entries_raw').delete().eq('id', rawEntryId);

  if (rawDeleteError) {
    throw rawDeleteError;
  }
}

export async function regenerateDayJournalByDate(journalDate: string): Promise<DayJournalSummary> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  if (!isValidJournalDate(journalDate)) {
    throw new Error('Ongeldige datum. Gebruik formaat YYYY-MM-DD.');
  }

  const session = await getCurrentSession();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('Je bent niet ingelogd. Vraag opnieuw een magic link aan.');
  }

  const entries = await fetchNormalizedEntriesByDate(journalDate);
  const draft = composeDayJournalDraft(entries);

  const { data, error } = await supabase
    .from('day_journals')
    .upsert(
      {
        user_id: userId,
        journal_date: journalDate,
        summary: draft.summary,
        sections: draft.sections,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,journal_date' }
    )
    .select('id, journal_date, summary, sections, updated_at')
    .single();

  if (error || !data) {
    throw error ?? new Error('Kon dagjournal niet opnieuw opbouwen.');
  }

  return data;
}
