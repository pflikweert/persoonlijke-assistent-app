export type RawEntrySourceRow = {
  id: string;
  user_id: string;
  source_type: string;
  raw_text: string | null;
  transcript_text: string | null;
  captured_at: string;
  journal_date: string | null;
};

export type NormalizedEntrySourceRow = {
  id: string;
  raw_entry_id: string;
  user_id: string;
  title: string | null;
  body: string | null;
  summary_short: string | null;
  generation_meta?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type DayEntrySourcePromptEntry = {
  rawEntryId: string;
  normalizedEntryId: string;
  capturedAt: string;
  title: string;
  body: string;
  summaryShort?: string;
};

export type DayEntrySourceItem = {
  raw: RawEntrySourceRow;
  normalized: NormalizedEntrySourceRow | null;
  sourceText: string;
  sourceBodyLength: number;
  normalizedBodyLength: number;
  normalizedTitleLength: number;
  normalizedSummaryShortLength: number;
  issueReasons: string[];
};

export type DayEntrySourceResult = {
  userId: string;
  journalDate: string;
  rawEntries: RawEntrySourceRow[];
  items: DayEntrySourceItem[];
  promptEntries: DayEntrySourcePromptEntry[];
  missingNormalizedRawIds: string[];
  issueReasons: string[];
  debug: {
    uiEquivalentRawCount: number;
    normalizedCount: number;
    promptInputEntryCount: number;
    entryIds: string[];
    promptInputBodyLengths: number[];
  };
};

export type EntryRepairCandidate = {
  rawEntryId: string;
  normalizedEntryId: string | null;
  userId: string;
  capturedAt: string;
  journalDate: string | null;
  reasonCodes: string[];
};

export type DayCandidate = {
  user_id: string;
  journal_date: string;
};

export type PeriodCandidate = {
  user_id: string;
  period_start: string;
  period_end: string;
};

export type RegenerationScopeSelection =
  | { kind: 'all' }
  | { kind: 'day'; date: string }
  | { kind: 'week'; startDate: string; endDate?: string | null }
  | { kind: 'month'; startDate: string; endDate?: string | null }
  | { kind: 'range'; startDate: string; endDate: string };

export type RegenerationScopePlan = {
  all: boolean;
  selectedDays: string[];
  selectedWeeks: Array<{ startDate: string; endDate: string }>;
  selectedMonths: Array<{ startDate: string; endDate: string }>;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_LEGACY_TIME_ZONE = 'Europe/Amsterdam';

function parseString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeForCompare(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function tokenize(value: string): Set<string> {
  return new Set(
    normalizeForCompare(value)
      .split(/[^a-z0-9À-ž]+/iu)
      .map((token) => token.trim())
      .filter((token) => token.length >= 4)
  );
}

function tokenOverlapRatio(sourceText: string, normalizedBody: string): number | null {
  const sourceTokens = tokenize(sourceText);
  const normalizedTokens = tokenize(normalizedBody);
  if (sourceTokens.size === 0 || normalizedTokens.size === 0) {
    return null;
  }

  let hits = 0;
  for (const token of normalizedTokens) {
    if (sourceTokens.has(token)) {
      hits += 1;
    }
  }
  return hits / normalizedTokens.size;
}

export function isValidJournalDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function dateFromJournalDate(value: string): Date | null {
  if (!isValidJournalDate(value)) {
    return null;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function addDays(journalDate: string, days: number): string | null {
  const parsed = dateFromJournalDate(journalDate);
  if (!parsed) {
    return null;
  }
  return new Date(parsed.getTime() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function normalizeDateRange(startDate: string, endDate: string): { startDate: string; endDate: string } | null {
  if (!isValidJournalDate(startDate) || !isValidJournalDate(endDate)) {
    return null;
  }
  return startDate <= endDate ? { startDate, endDate } : { startDate: endDate, endDate: startDate };
}

export function enumerateDateRange(startDate: string, endDate: string): string[] {
  const bounds = normalizeDateRange(startDate, endDate);
  if (!bounds) {
    return [];
  }

  const dates: string[] = [];
  let cursor: string | null = bounds.startDate;
  while (cursor && cursor <= bounds.endDate) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

export function computeWeekBoundsForDate(journalDate: string): { startDate: string; endDate: string } | null {
  const parsed = dateFromJournalDate(journalDate);
  if (!parsed) {
    return null;
  }
  const day = parsed.getUTCDay();
  const offsetToMonday = (day + 6) % 7;
  const start = new Date(parsed.getTime() - offsetToMonday * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export function computeMonthBoundsForDate(journalDate: string): { startDate: string; endDate: string } | null {
  const parsed = dateFromJournalDate(journalDate);
  if (!parsed) {
    return null;
  }
  const start = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), 1));
  const next = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth() + 1, 1));
  const end = new Date(next.getTime() - 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function rangeKey(range: { startDate: string; endDate: string }): string {
  return `${range.startDate}:${range.endDate}`;
}

export function buildRegenerationScopePlan(selections: RegenerationScopeSelection[]): RegenerationScopePlan {
  const normalizedSelections = selections.length > 0 ? selections : [{ kind: 'all' as const }];
  if (normalizedSelections.some((selection) => selection.kind === 'all')) {
    return { all: true, selectedDays: [], selectedWeeks: [], selectedMonths: [] };
  }

  const daySet = new Set<string>();
  const weekMap = new Map<string, { startDate: string; endDate: string }>();
  const monthMap = new Map<string, { startDate: string; endDate: string }>();

  const addDayAndDependencies = (date: string) => {
    if (!isValidJournalDate(date)) {
      return;
    }
    daySet.add(date);
    const week = computeWeekBoundsForDate(date);
    if (week) {
      weekMap.set(rangeKey(week), week);
    }
    const month = computeMonthBoundsForDate(date);
    if (month) {
      monthMap.set(rangeKey(month), month);
    }
  };

  for (const selection of normalizedSelections) {
    if (selection.kind === 'day') {
      addDayAndDependencies(selection.date);
      continue;
    }

    if (selection.kind === 'week') {
      const fallback = computeWeekBoundsForDate(selection.startDate);
      const bounds = normalizeDateRange(selection.startDate, selection.endDate ?? fallback?.endDate ?? selection.startDate);
      if (!bounds) {
        continue;
      }
      weekMap.set(rangeKey(bounds), bounds);
      for (const date of enumerateDateRange(bounds.startDate, bounds.endDate)) {
        daySet.add(date);
        const month = computeMonthBoundsForDate(date);
        if (month) {
          monthMap.set(rangeKey(month), month);
        }
      }
      continue;
    }

    if (selection.kind === 'month') {
      const fallback = computeMonthBoundsForDate(selection.startDate);
      const bounds = normalizeDateRange(selection.startDate, selection.endDate ?? fallback?.endDate ?? selection.startDate);
      if (!bounds) {
        continue;
      }
      monthMap.set(rangeKey(bounds), bounds);
      for (const date of enumerateDateRange(bounds.startDate, bounds.endDate)) {
        daySet.add(date);
        const week = computeWeekBoundsForDate(date);
        if (week) {
          weekMap.set(rangeKey(week), week);
        }
      }
      continue;
    }

    if (selection.kind === 'range') {
      const bounds = normalizeDateRange(selection.startDate, selection.endDate);
      if (!bounds) {
        continue;
      }
      for (const date of enumerateDateRange(bounds.startDate, bounds.endDate)) {
        addDayAndDependencies(date);
      }
    }
  }

  return {
    all: false,
    selectedDays: [...daySet].sort(),
    selectedWeeks: [...weekMap.values()].sort((left, right) => left.startDate.localeCompare(right.startDate)),
    selectedMonths: [...monthMap.values()].sort((left, right) => left.startDate.localeCompare(right.startDate)),
  };
}

export function dateBoundsUtc(journalDate: string): { start: string; end: string } {
  const start = `${journalDate}T00:00:00.000Z`;
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
  return {
    start,
    end: endDate.toISOString(),
  };
}

export function dateBoundsFromLocalDay(
  journalDate: string,
  timezoneOffsetMinutes: number | null | undefined
): { start: string; end: string } {
  if (typeof timezoneOffsetMinutes !== 'number' || !Number.isFinite(timezoneOffsetMinutes)) {
    return dateBoundsUtc(journalDate);
  }

  const [yearRaw, monthRaw, dayRaw] = journalDate.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const localMidnightUtcMs =
    Date.UTC(year, month - 1, day, 0, 0, 0, 0) + timezoneOffsetMinutes * 60 * 1000;
  const start = new Date(localMidnightUtcMs);
  const end = new Date(localMidnightUtcMs + 24 * 60 * 60 * 1000);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export function deriveJournalDateForLegacyRaw(
  capturedAt: string,
  timeZone = DEFAULT_LEGACY_TIME_ZONE
): string | null {
  const parsed = new Date(capturedAt);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(parsed);
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;
    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fall back to UTC below.
  }

  return parsed.toISOString().slice(0, 10);
}

export function getRawSourceText(raw: Pick<RawEntrySourceRow, 'raw_text' | 'transcript_text'>): string {
  return parseString(raw.raw_text) ?? parseString(raw.transcript_text) ?? '';
}

export function detectNormalizedEntryIssues(input: {
  raw: RawEntrySourceRow;
  normalized: NormalizedEntrySourceRow | null;
  expectedPromptVersion?: string | null;
  expectedModel?: string | null;
}): string[] {
  const sourceText = getRawSourceText(input.raw);
  const sourceLength = sourceText.length;
  const normalized = input.normalized;
  const reasons: string[] = [];

  if (!normalized) {
    return ['missing_normalized'];
  }

  const title = parseString(normalized.title);
  const body = parseString(normalized.body);
  if (!title) {
    reasons.push('empty_title');
  }
  if (!body) {
    reasons.push('empty_body');
  }
  if (sourceLength === 0) {
    reasons.push('empty_raw_source');
  }

  if (body && sourceLength > 0) {
    const bodyLength = body.length;
    const lengthRatio = bodyLength / sourceLength;
    if (sourceLength >= 120 && lengthRatio < 0.18) {
      reasons.push('normalized_body_too_short_for_raw');
    }
    if (sourceLength >= 80 && bodyLength >= 30) {
      const overlap = tokenOverlapRatio(sourceText, body);
      if (overlap !== null && overlap < 0.12) {
        reasons.push('normalized_body_low_source_overlap');
      }
    }
  }

  const meta = normalized.generation_meta ?? {};
  const promptVersion = parseString(meta.prompt_version);
  const model = parseString(meta.model);
  if (input.expectedPromptVersion && promptVersion !== input.expectedPromptVersion) {
    reasons.push('outdated_prompt_version');
  }
  if (input.expectedModel && model !== input.expectedModel) {
    reasons.push('outdated_model');
  }

  return [...new Set(reasons)];
}

export function buildDayEntrySourceResult(input: {
  userId: string;
  journalDate: string;
  rawEntries: RawEntrySourceRow[];
  normalizedEntries: NormalizedEntrySourceRow[];
  expectedPromptVersion?: string | null;
  expectedModel?: string | null;
}): DayEntrySourceResult {
  const normalizedByRawId = new Map<string, NormalizedEntrySourceRow>();
  for (const row of input.normalizedEntries) {
    normalizedByRawId.set(row.raw_entry_id, row);
  }

  const dedupedRawEntries = input.rawEntries
    .filter((entry, index, all) => all.findIndex((candidate) => candidate.id === entry.id) === index)
    .sort((left, right) => new Date(left.captured_at).getTime() - new Date(right.captured_at).getTime());

  const items = dedupedRawEntries.map((raw) => {
    const normalized = normalizedByRawId.get(raw.id) ?? null;
    const sourceText = getRawSourceText(raw);
    const issueReasons = detectNormalizedEntryIssues({
      raw,
      normalized,
      expectedPromptVersion: input.expectedPromptVersion,
      expectedModel: input.expectedModel,
    });

    return {
      raw,
      normalized,
      sourceText,
      sourceBodyLength: sourceText.length,
      normalizedBodyLength: parseString(normalized?.body)?.length ?? 0,
      normalizedTitleLength: parseString(normalized?.title)?.length ?? 0,
      normalizedSummaryShortLength: parseString(normalized?.summary_short)?.length ?? 0,
      issueReasons,
    };
  });

  const promptEntries = items
    .filter((item) => item.normalized && parseString(item.normalized.body))
    .map((item) => ({
      rawEntryId: item.raw.id,
      normalizedEntryId: item.normalized!.id,
      capturedAt: item.raw.captured_at,
      title: parseString(item.normalized!.title) ?? 'Moment',
      body: parseString(item.normalized!.body) ?? '',
      summaryShort: parseString(item.normalized!.summary_short) ?? undefined,
    }));

  const issueReasons = [...new Set(items.flatMap((item) => item.issueReasons))];

  return {
    userId: input.userId,
    journalDate: input.journalDate,
    rawEntries: dedupedRawEntries,
    items,
    promptEntries,
    missingNormalizedRawIds: items
      .filter((item) => item.issueReasons.includes('missing_normalized'))
      .map((item) => item.raw.id),
    issueReasons,
    debug: {
      uiEquivalentRawCount: dedupedRawEntries.length,
      normalizedCount: items.filter((item) => item.normalized).length,
      promptInputEntryCount: promptEntries.length,
      entryIds: dedupedRawEntries.map((entry) => entry.id),
      promptInputBodyLengths: promptEntries.map((entry) => entry.body.length),
    },
  };
}

export function buildEntryRepairCandidates(input: {
  rawEntries: RawEntrySourceRow[];
  normalizedEntries: NormalizedEntrySourceRow[];
  expectedPromptVersion?: string | null;
  expectedModel?: string | null;
}): EntryRepairCandidate[] {
  const normalizedByRawId = new Map<string, NormalizedEntrySourceRow>();
  for (const row of input.normalizedEntries) {
    normalizedByRawId.set(row.raw_entry_id, row);
  }

  const candidates: EntryRepairCandidate[] = [];
  for (const raw of input.rawEntries) {
    const normalized = normalizedByRawId.get(raw.id) ?? null;
    const reasonCodes = detectNormalizedEntryIssues({
      raw,
      normalized,
      expectedPromptVersion: input.expectedPromptVersion,
      expectedModel: input.expectedModel,
    }).filter((reason) => reason !== 'empty_raw_source');

    if (reasonCodes.length === 0) {
      continue;
    }

    candidates.push({
      rawEntryId: raw.id,
      normalizedEntryId: normalized?.id ?? null,
      userId: raw.user_id,
      capturedAt: raw.captured_at,
      journalDate: raw.journal_date,
      reasonCodes,
    });
  }

  return candidates.sort((left, right) => new Date(left.capturedAt).getTime() - new Date(right.capturedAt).getTime());
}

export function buildDayCandidatesFromSources(input: {
  rawEntries: Array<Pick<RawEntrySourceRow, 'user_id' | 'captured_at' | 'journal_date'>>;
  dayJournals: DayCandidate[];
}): DayCandidate[] {
  const byKey = new Map<string, DayCandidate>();
  for (const journal of input.dayJournals) {
    if (!isValidJournalDate(journal.journal_date)) {
      continue;
    }
    byKey.set(`${journal.user_id}:${journal.journal_date}`, journal);
  }

  for (const raw of input.rawEntries) {
    const journalDate = raw.journal_date ?? deriveJournalDateForLegacyRaw(raw.captured_at);
    if (!journalDate || !isValidJournalDate(journalDate)) {
      continue;
    }
    byKey.set(`${raw.user_id}:${journalDate}`, {
      user_id: raw.user_id,
      journal_date: journalDate,
    });
  }

  return [...byKey.values()].sort((left, right) =>
    left.user_id === right.user_id
      ? left.journal_date.localeCompare(right.journal_date)
      : left.user_id.localeCompare(right.user_id)
  );
}

export function buildControlledEmptyDayJournal(journalDate: string) {
  return {
    summary: 'Voor deze dag zijn geen momenten vastgelegd.',
    narrativeText: 'Voor deze dag zijn geen momenten vastgelegd.',
    sections: [],
    generationMeta: {
      empty_day: true,
      empty_day_reason: 'no_ui_equivalent_entries',
      journal_date: journalDate,
    },
  };
}

export async function loadDayEntrySource(args: {
  client: any;
  userId: string;
  journalDate: string;
  timezoneOffsetMinutes?: number | null;
  expectedPromptVersion?: string | null;
  expectedModel?: string | null;
}): Promise<DayEntrySourceResult> {
  const { data: rawRowsForJournalDate, error: rawRowsForJournalDateError } = await args.client
    .from('entries_raw')
    .select('id, user_id, source_type, raw_text, transcript_text, captured_at, journal_date')
    .eq('user_id', args.userId)
    .eq('journal_date', args.journalDate)
    .order('captured_at', { ascending: true });

  if (rawRowsForJournalDateError) {
    throw new Error(`Failed to load raw entries for journal_date: ${String(rawRowsForJournalDateError.message ?? rawRowsForJournalDateError)}`);
  }

  const bounds = dateBoundsFromLocalDay(args.journalDate, args.timezoneOffsetMinutes);
  const { data: legacyRawRowsForDay, error: legacyRawRowsForDayError } = await args.client
    .from('entries_raw')
    .select('id, user_id, source_type, raw_text, transcript_text, captured_at, journal_date')
    .eq('user_id', args.userId)
    .is('journal_date', null)
    .gte('captured_at', bounds.start)
    .lt('captured_at', bounds.end)
    .order('captured_at', { ascending: true });

  if (legacyRawRowsForDayError) {
    throw new Error(`Failed to load legacy raw entries for day: ${String(legacyRawRowsForDayError.message ?? legacyRawRowsForDayError)}`);
  }

  const rawEntries = [
    ...((rawRowsForJournalDate ?? []) as RawEntrySourceRow[]),
    ...((legacyRawRowsForDay ?? []) as RawEntrySourceRow[]),
  ];
  const rawIds = rawEntries.map((row) => row.id);
  let normalizedEntries: NormalizedEntrySourceRow[] = [];

  if (rawIds.length > 0) {
    const { data: normalizedRows, error: normalizedError } = await args.client
      .from('entries_normalized')
      .select('id, raw_entry_id, user_id, title, body, summary_short, generation_meta, created_at, updated_at')
      .eq('user_id', args.userId)
      .in('raw_entry_id', rawIds);

    if (normalizedError) {
      throw new Error(`Failed to load normalized entries for day: ${String(normalizedError.message ?? normalizedError)}`);
    }
    normalizedEntries = (normalizedRows ?? []) as NormalizedEntrySourceRow[];
  }

  return buildDayEntrySourceResult({
    userId: args.userId,
    journalDate: args.journalDate,
    rawEntries,
    normalizedEntries,
    expectedPromptVersion: args.expectedPromptVersion,
    expectedModel: args.expectedModel,
  });
}
