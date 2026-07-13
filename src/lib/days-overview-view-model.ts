export type DaysOverviewJournal = {
  id: string;
  journal_date: string;
};

export type DaysOverviewRow<TJournal extends DaysOverviewJournal = DaysOverviewJournal> = {
  date: string;
  hasContent: boolean;
  journal: TJournal | null;
};

const JOURNAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateString(value: string): boolean {
  if (!JOURNAL_DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString().slice(0, 10) === value;
}

function addDays(dateValue: string, days: number): string {
  const parsed = new Date(`${dateValue}T12:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

export function buildDaysOverviewRows<TJournal extends DaysOverviewJournal>(
  journals: TJournal[],
  todayDate: string,
): DaysOverviewRow<TJournal>[] {
  if (!isValidDateString(todayDate)) {
    return [];
  }

  const journalByDate = new Map<string, TJournal>();

  for (const journal of journals) {
    const date = journal.journal_date;
    if (!isValidDateString(date) || date > todayDate || journalByDate.has(date)) {
      continue;
    }
    journalByDate.set(date, journal);
  }

  const dates = Array.from(journalByDate.keys()).sort((left, right) =>
    right.localeCompare(left),
  );

  if (dates.length === 0) {
    return [];
  }

  const rows: DaysOverviewRow<TJournal>[] = [];
  const oldestDate = dates[dates.length - 1];
  let cursor = dates[0];

  while (cursor >= oldestDate) {
    const journal = journalByDate.get(cursor) ?? null;
    rows.push({
      date: cursor,
      hasContent: Boolean(journal),
      journal,
    });
    cursor = addDays(cursor, -1);
  }

  return rows;
}
