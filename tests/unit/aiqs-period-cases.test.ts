import { describe, expect, it } from "vitest";

import {
  buildAiqsPeriodCaseId,
  buildAiqsPeriodCases,
  buildAiqsPeriodInputSnapshot,
  buildAiqsPeriodPromptContext,
  computeAiqsPeriodBounds,
  type AiqsPeriodDayJournal,
} from "../../supabase/functions/_shared/aiqs-period-cases";

const day = (
  journalDate: string,
  overrides: Partial<AiqsPeriodDayJournal> = {}
): AiqsPeriodDayJournal => ({
  id: `day-${journalDate}`,
  user_id: "user-a",
  journal_date: journalDate,
  summary: `Samenvatting ${journalDate}`,
  narrative_text: `Dagverhaal ${journalDate}`,
  sections: [`Sectie ${journalDate}`],
  updated_at: `${journalDate}T12:00:00.000Z`,
  ...overrides,
});

describe("aiqs period cases", () => {
  it("uses production week bounds from Monday to Sunday", () => {
    expect(computeAiqsPeriodBounds("week", "2026-06-02")).toEqual({
      periodStart: "2026-06-01",
      periodEnd: "2026-06-07",
    });
    expect(computeAiqsPeriodBounds("week", "2026-06-07")).toEqual({
      periodStart: "2026-06-01",
      periodEnd: "2026-06-07",
    });
  });

  it("uses calendar month bounds", () => {
    expect(computeAiqsPeriodBounds("month", "2026-06-22")).toEqual({
      periodStart: "2026-06-01",
      periodEnd: "2026-06-30",
    });
  });

  it("groups day journals by user and period with entry-count metadata", () => {
    const cases = buildAiqsPeriodCases({
      periodType: "week",
      today: "2026-06-30",
      dayJournals: [
        day("2026-06-02"),
        day("2026-06-03"),
        day("2026-06-09"),
        day("2026-06-03", { user_id: "user-b" }),
      ],
      entryRows: [
        { user_id: "user-a", journal_date: "2026-06-02", captured_at: "2026-06-02T09:00:00.000Z" },
        { user_id: "user-a", journal_date: "2026-06-02", captured_at: "2026-06-02T10:00:00.000Z" },
        { user_id: "user-a", journal_date: "2026-06-03", captured_at: "2026-06-03T10:00:00.000Z" },
        { user_id: "user-b", journal_date: "2026-06-03", captured_at: "2026-06-03T10:00:00.000Z" },
      ],
    });

    const userAFirstWeek = cases.find(
      (item) => item.userId === "user-a" && item.periodStart === "2026-06-01"
    );

    expect(userAFirstWeek).toMatchObject({
      sourceType: "week",
      periodStart: "2026-06-01",
      periodEnd: "2026-06-07",
      label: "Week 2026-06-01 t/m 2026-06-07",
      subtitle: "2 dagen · 3 entries",
      dayCount: 2,
      entryCount: 3,
    });
    expect(userAFirstWeek?.dayJournals.map((item) => item.journal_date)).toEqual([
      "2026-06-02",
      "2026-06-03",
    ]);
  });

  it("builds stable synthetic UUIDs for period cases", () => {
    const first = buildAiqsPeriodCaseId({
      sourceType: "month",
      userId: "user-a",
      periodStart: "2026-06-01",
      periodEnd: "2026-06-30",
    });
    const second = buildAiqsPeriodCaseId({
      sourceType: "month",
      userId: "user-a",
      periodStart: "2026-06-01",
      periodEnd: "2026-06-30",
    });
    const other = buildAiqsPeriodCaseId({
      sourceType: "month",
      userId: "user-b",
      periodStart: "2026-06-01",
      periodEnd: "2026-06-30",
    });

    expect(first).toBe(second);
    expect(first).not.toBe(other);
    expect(first).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("builds the production reflection prompt context from the input snapshot", () => {
    const [periodCase] = buildAiqsPeriodCases({
      periodType: "month",
      today: "2026-06-30",
      dayJournals: [day("2026-06-02"), day("2026-06-03")],
    });

    const snapshot = buildAiqsPeriodInputSnapshot({
      taskKey: "month_narrative",
      periodCase,
    });

    expect(snapshot).toMatchObject({
      sourceType: "month",
      taskKey: "month_narrative",
      period_type: "month",
      period_start: "2026-06-01",
      period_end: "2026-06-30",
    });
    expect(snapshot.dayJournals).toHaveLength(2);
    expect(buildAiqsPeriodPromptContext(snapshot)).toEqual({
      period_type: "month",
      period_start: "2026-06-01",
      period_end: "2026-06-30",
      dayJournals: snapshot.dayJournals,
    });
  });
});
