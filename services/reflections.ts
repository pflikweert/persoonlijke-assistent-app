import type { Json, Tables } from '@/src/lib/supabase/database.types';
import { getSupabaseBrowserClient } from '@/src/lib/supabase';

import { getCurrentSession } from './auth';

export type PeriodType = 'week' | 'month';

export type ReflectionRow = Omit<
  Pick<
    Tables<'period_reflections'>,
    | 'id'
    | 'period_type'
    | 'period_start'
    | 'period_end'
    | 'summary_text'
    | 'highlights_json'
    | 'reflection_points_json'
    | 'generated_at'
    | 'model_version'
  >,
  'period_type'
> & {
  period_type: PeriodType;
};

export interface GenerateReflectionResult {
  status: 'ok';
  reflectionId: string;
  periodType: PeriodType;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  modelVersion: string;
}

function parseString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

export function parseJsonStringArray(value: Json): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => parseString(item))
    .filter((item): item is string => Boolean(item));
}

function ensurePeriodType(periodType: string): PeriodType {
  if (periodType === 'week' || periodType === 'month') {
    return periodType;
  }

  throw new Error('Onbekend periodType. Gebruik week of month.');
}

async function formatFunctionInvokeError(error: unknown): Promise<string> {
  const fallback = error instanceof Error ? error.message : 'Genereren van reflectie mislukt.';

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

export async function generateReflection(input: {
  periodType: PeriodType;
  anchorDate?: string;
  forceRegenerate?: boolean;
}): Promise<GenerateReflectionResult> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const session = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error('Je bent niet ingelogd. Vraag opnieuw een magic link aan.');
  }

  const { data, error } = await supabase.functions.invoke<GenerateReflectionResult>(
    'generate-reflection',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        periodType: input.periodType,
        anchorDate: input.anchorDate,
        forceRegenerate: input.forceRegenerate ?? false,
      },
    }
  );

  if (error) {
    const detailed = await formatFunctionInvokeError(error);
    throw new Error(detailed);
  }

  if (!data) {
    throw new Error('Lege response van generate-reflection.');
  }

  return data;
}

export async function fetchLatestReflection(periodType: PeriodType): Promise<ReflectionRow | null> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { data, error } = await supabase
    .from('period_reflections')
    .select(
      'id, period_type, period_start, period_end, summary_text, highlights_json, reflection_points_json, generated_at, model_version'
    )
    .eq('period_type', periodType)
    .order('period_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    period_type: ensurePeriodType(data.period_type),
  };
}

export async function fetchRecentReflections(limit = 20): Promise<ReflectionRow[]> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const safeLimit = Math.max(1, Math.min(limit, 100));

  const { data, error } = await supabase
    .from('period_reflections')
    .select(
      'id, period_type, period_start, period_end, summary_text, highlights_json, reflection_points_json, generated_at, model_version'
    )
    .order('generated_at', { ascending: false })
    .limit(safeLimit);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    ...row,
    period_type: ensurePeriodType(row.period_type),
  }));
}
