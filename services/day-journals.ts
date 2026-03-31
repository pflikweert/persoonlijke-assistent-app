import type { Json, Tables } from '@/src/lib/supabase/database.types';
import { getSupabaseBrowserClient } from '@/src/lib/supabase';

export type TodayJournal = Pick<
  Tables<'day_journals'>,
  'id' | 'journal_date' | 'summary' | 'sections' | 'updated_at'
>;

export function getUtcTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function parseJournalSections(value: Json): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0);
}

export async function fetchTodayJournal(todayDate = getUtcTodayDate()): Promise<TodayJournal | null> {
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
