import { describe, expect, it } from "vitest";

import { buildDaysOverviewRows } from "@/src/lib/days-overview-view-model";

const journal = (date: string, id = date) => ({
  id,
  journal_date: date,
});

describe("buildDaysOverviewRows", () => {
  it("fills missing calendar days between loaded journals", () => {
    const rows = buildDaysOverviewRows(
      [journal("2026-06-02"), journal("2026-05-30")],
      "2026-06-10",
    );

    expect(rows).toEqual([
      { date: "2026-06-02", hasContent: true, journal: journal("2026-06-02") },
      { date: "2026-06-01", hasContent: false, journal: null },
      { date: "2026-05-31", hasContent: false, journal: null },
      { date: "2026-05-30", hasContent: true, journal: journal("2026-05-30") },
    ]);
  });

  it("deduplicates journals by date", () => {
    const rows = buildDaysOverviewRows(
      [
        journal("2026-06-02", "first"),
        journal("2026-06-02", "duplicate"),
        journal("2026-06-01"),
      ],
      "2026-06-10",
    );

    expect(rows.map((row) => row.date)).toEqual(["2026-06-02", "2026-06-01"]);
    expect(rows[0]?.journal?.id).toBe("first");
  });

  it("does not include future days", () => {
    const rows = buildDaysOverviewRows(
      [journal("2026-06-12"), journal("2026-06-10"), journal("2026-06-08")],
      "2026-06-10",
    );

    expect(rows.map((row) => row.date)).toEqual([
      "2026-06-10",
      "2026-06-09",
      "2026-06-08",
    ]);
    expect(rows.some((row) => row.date > "2026-06-10")).toBe(false);
  });

  it("keeps an empty input empty", () => {
    expect(buildDaysOverviewRows([], "2026-06-10")).toEqual([]);
  });
});
