export type AiqsPeriodType = 'week' | 'month';

export type AiqsPeriodDayJournal = {
  id?: string;
  user_id: string;
  journal_date: string;
  summary: string | null;
  narrative_text: string | null;
  sections: unknown;
  updated_at?: string | null;
};

export type AiqsPeriodEntryCountRow = {
  user_id: string;
  journal_date: string | null;
  captured_at: string | null;
};

export type AiqsPeriodCase = {
  sourceType: AiqsPeriodType;
  sourceRecordId: string;
  userId: string;
  periodType: AiqsPeriodType;
  periodStart: string;
  periodEnd: string;
  label: string;
  subtitle: string;
  preview: string;
  dayCount: number;
  entryCount: number;
  dayJournals: Array<{
    journal_date: string;
    summary: string;
    narrative_text: string;
    sections: unknown;
  }>;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_LABELS_NL = [
  'Januari',
  'Februari',
  'Maart',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Augustus',
  'September',
  'Oktober',
  'November',
  'December',
];

export function computeAiqsPeriodBounds(
  periodType: AiqsPeriodType,
  anchorDate: string
): { periodStart: string; periodEnd: string } {
  const anchor = dateFromDayString(anchorDate);

  if (periodType === 'week') {
    const day = anchor.getUTCDay();
    const offsetToMonday = (day + 6) % 7;
    const weekStart = addDaysUtc(anchor, -offsetToMonday);
    const weekEnd = addDaysUtc(weekStart, 6);
    return {
      periodStart: toDayStringUtc(weekStart),
      periodEnd: toDayStringUtc(weekEnd),
    };
  }

  const monthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));
  const nextMonthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 1));
  return {
    periodStart: toDayStringUtc(monthStart),
    periodEnd: toDayStringUtc(addDaysUtc(nextMonthStart, -1)),
  };
}

export function buildAiqsPeriodCaseId(args: {
  sourceType: AiqsPeriodType;
  userId: string;
  periodStart: string;
  periodEnd: string;
}): string {
  const hash = cyrb128(`${args.sourceType}:${args.userId}:${args.periodStart}:${args.periodEnd}`);
  const bytes = hash.flatMap((value) => [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ]);

  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map((value) => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function buildAiqsPeriodCases(args: {
  periodType: AiqsPeriodType;
  dayJournals: AiqsPeriodDayJournal[];
  entryRows?: AiqsPeriodEntryCountRow[];
  today?: string;
  limit?: number;
}): AiqsPeriodCase[] {
  const today = args.today && DATE_PATTERN.test(args.today) ? args.today : toDayStringUtc(new Date());
  const entryCountByUserDate = buildEntryCountByUserDate(args.entryRows ?? []);
  const groups = new Map<string, AiqsPeriodDayJournal[]>();

  for (const row of args.dayJournals) {
    if (!row.user_id || !DATE_PATTERN.test(row.journal_date) || row.journal_date > today) continue;
    const bounds = computeAiqsPeriodBounds(args.periodType, row.journal_date);
    const key = `${row.user_id}:${bounds.periodStart}:${bounds.periodEnd}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  const cases = Array.from(groups.entries()).map(([key, rows]) => {
    const [userId, periodStart, periodEnd] = key.split(':');
    const sortedRows = rows
      .slice()
      .sort((left, right) => left.journal_date.localeCompare(right.journal_date));
    const dayJournals = sortedRows.map((row) => ({
      journal_date: row.journal_date,
      summary: row.summary ?? '',
      narrative_text: row.narrative_text ?? '',
      sections: Array.isArray(row.sections) ? row.sections : [],
    }));
    const entryCount = dayJournals.reduce(
      (total, row) => total + (entryCountByUserDate.get(`${userId}:${row.journal_date}`) ?? 0),
      0
    );

    return {
      sourceType: args.periodType,
      sourceRecordId: buildAiqsPeriodCaseId({
        sourceType: args.periodType,
        userId,
        periodStart,
        periodEnd,
      }),
      userId,
      periodType: args.periodType,
      periodStart,
      periodEnd,
      label: buildPeriodLabel(args.periodType, periodStart, periodEnd),
      subtitle: `${dayJournals.length} dagen · ${entryCount} entries`,
      preview: buildPeriodPreview(dayJournals),
      dayCount: dayJournals.length,
      entryCount,
      dayJournals,
    } satisfies AiqsPeriodCase;
  });

  return cases
    .filter((item) => item.dayCount > 0)
    .sort((left, right) => right.periodStart.localeCompare(left.periodStart))
    .slice(0, args.limit ?? 30);
}

export function buildAiqsPeriodInputSnapshot(args: {
  taskKey: string;
  periodCase: AiqsPeriodCase;
}): Record<string, unknown> {
  return {
    sourceType: args.periodCase.sourceType,
    taskKey: args.taskKey,
    period_type: args.periodCase.periodType,
    period_start: args.periodCase.periodStart,
    period_end: args.periodCase.periodEnd,
    dayJournals: args.periodCase.dayJournals,
    period: {
      userId: args.periodCase.userId,
      dayCount: args.periodCase.dayCount,
      entryCount: args.periodCase.entryCount,
    },
  };
}

export function buildAiqsPeriodPromptContext(snapshot: Record<string, unknown>): Record<string, unknown> {
  return {
    period_type: snapshot.period_type,
    period_start: snapshot.period_start,
    period_end: snapshot.period_end,
    dayJournals: snapshot.dayJournals,
  };
}

function dateFromDayString(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function toDayStringUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDaysUtc(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function buildEntryCountByUserDate(rows: AiqsPeriodEntryCountRow[]): Map<string, number> {
  const result = new Map<string, number>();
  for (const row of rows) {
    if (!row.user_id) continue;
    const date = row.journal_date && DATE_PATTERN.test(row.journal_date)
      ? row.journal_date
      : typeof row.captured_at === 'string' && row.captured_at.length >= 10
        ? row.captured_at.slice(0, 10)
        : null;
    if (!date || !DATE_PATTERN.test(date)) continue;
    const key = `${row.user_id}:${date}`;
    result.set(key, (result.get(key) ?? 0) + 1);
  }
  return result;
}

function buildPeriodLabel(periodType: AiqsPeriodType, periodStart: string, periodEnd: string): string {
  if (periodType === 'week') {
    return `Week ${periodStart} t/m ${periodEnd}`;
  }
  const date = dateFromDayString(periodStart);
  return `${MONTH_LABELS_NL[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function buildPeriodPreview(dayJournals: AiqsPeriodCase['dayJournals']): string {
  const candidates = dayJournals
    .flatMap((row) => [row.summary, row.narrative_text])
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  return truncate(candidates[0] ?? 'Bronperiode op basis van day journals.');
}

function truncate(value: string, max = 160): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function cyrb128(value: string): [number, number, number, number] {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let index = 0; index < value.length; index += 1) {
    const k = value.charCodeAt(index);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}
