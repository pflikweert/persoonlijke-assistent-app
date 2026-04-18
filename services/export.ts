import { File, Paths } from "expo-file-system";
import { Platform } from "react-native";

import { ensureAuthenticatedUserSession } from "@/services/auth";
import { createClientFlowId } from "@/services/function-error";
import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import type { Json, Tables } from "@/src/lib/supabase/database.types";

type RawEntryRow = Pick<
  Tables<"entries_raw">,
  "id" | "captured_at" | "journal_date" | "source_type"
>;
type NormalizedEntryRow = Pick<Tables<"entries_normalized">, "raw_entry_id" | "body">;
type DayRow = Pick<Tables<"day_journals">, "journal_date" | "summary" | "narrative_text">;
type ReflectionRow = Pick<
  Tables<"period_reflections">,
  | "period_type"
  | "period_start"
  | "period_end"
  | "summary_text"
  | "narrative_text"
  | "highlights_json"
  | "reflection_points_json"
>;

type ExportEntry = {
  capturedAt: string;
  journalDate: string | null;
  sourceType: "text" | "audio";
  body: string;
};

type ExportReflection = {
  periodType: "week" | "month";
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

export type DateScope =
  | { kind: "all" }
  | { kind: "day"; date: string }
  | { kind: "week"; startDate: string; endDate: string; label: string }
  | { kind: "month"; startDate: string; endDate: string; label: string }
  | { kind: "range"; startDate: string; endDate: string };

export const ALL_DATE_SCOPE: DateScope = { kind: "all" };

export type SelectableDay = {
  date: string;
  label: string;
  snippet: string;
};

export type SelectablePeriod = {
  id: string;
  label: string;
  subtitle: string;
  startDate: string;
  endDate: string;
};

export type ArchiveExportPreview = {
  scope: DateScope;
  hasContent: boolean;
  isSparse: boolean;
  days: number;
  entries: number;
  weekReflections: number;
  monthReflections: number;
};

export type ArchiveExportResult =
  | { status: "empty" }
  | {
      status: "saved";
      fileName: string;
      fileUri?: string;
      days: number;
      entries: number;
      weekReflections: number;
      monthReflections: number;
    };

const PAGE_SIZE = 500;

function toDateLabel(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateTimeLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const date = toDateLabel(parsed);
  const hour = String(parsed.getHours()).padStart(2, "0");
  const minute = String(parsed.getMinutes()).padStart(2, "0");
  return `${date} ${hour}:${minute}`;
}

function normalizeStringList(value: Json): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

function sourceLabel(sourceType: "text" | "audio"): string {
  return sourceType === "audio" ? "spraak" : "tekst";
}

function parseUtcDate(value: string): Date | null {
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function describeDay(date: string): string {
  const parsed = parseUtcDate(date);
  if (!parsed) {
    return date;
  }
  return parsed.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function shortMonthLabel(date: string): string {
  const parsed = parseUtcDate(date);
  if (!parsed) {
    return date.slice(0, 7);
  }
  const month = parsed.toLocaleDateString("nl-NL", {
    month: "long",
    timeZone: "UTC",
  });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${parsed.getUTCFullYear()}`;
}

function getIsoWeekStart(date: string): string {
  const parsed = parseUtcDate(date);
  if (!parsed) {
    return date;
  }
  const day = parsed.getUTCDay() || 7;
  parsed.setUTCDate(parsed.getUTCDate() - (day - 1));
  return toDateLabel(parsed);
}

function getIsoWeekEnd(weekStart: string): string {
  const parsed = parseUtcDate(weekStart);
  if (!parsed) {
    return weekStart;
  }
  parsed.setUTCDate(parsed.getUTCDate() + 6);
  return toDateLabel(parsed);
}

function getMonthBounds(date: string): { startDate: string; endDate: string } {
  const parsed = parseUtcDate(date);
  if (!parsed) {
    return { startDate: date.slice(0, 7) + "-01", endDate: date.slice(0, 7) + "-31" };
  }
  const year = parsed.getUTCFullYear();
  const monthIndex = parsed.getUTCMonth();
  const startDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  const monthEnd = new Date(Date.UTC(year, monthIndex + 1, 0, 12, 0, 0));
  const endDate = toDateLabel(monthEnd);
  return { startDate, endDate };
}

function normalizeBounds(startDate: string, endDate: string): { startDate: string; endDate: string } {
  return startDate <= endDate ? { startDate, endDate } : { startDate: endDate, endDate: startDate };
}

function scopeBounds(scope: DateScope): { startDate: string | null; endDate: string | null } {
  if (scope.kind === "all") {
    return { startDate: null, endDate: null };
  }
  if (scope.kind === "day") {
    return { startDate: scope.date, endDate: scope.date };
  }
  if (scope.kind === "week" || scope.kind === "month" || scope.kind === "range") {
    return normalizeBounds(scope.startDate, scope.endDate);
  }
  return { startDate: null, endDate: null };
}

function inBounds(date: string | null | undefined, bounds: { startDate: string | null; endDate: string | null }): boolean {
  if (!date) {
    return false;
  }
  if (!bounds.startDate || !bounds.endDate) {
    return true;
  }
  return date >= bounds.startDate && date <= bounds.endDate;
}

function overlapsBounds(start: string, end: string, bounds: { startDate: string | null; endDate: string | null }): boolean {
  if (!bounds.startDate || !bounds.endDate) {
    return true;
  }
  return start <= bounds.endDate && end >= bounds.startDate;
}

export function describeDateScope(scope: DateScope): { title: string; subtitle: string } {
  if (scope.kind === "all") {
    return {
      title: "Alles bewaren",
      subtitle: "Je bewaart alles wat je tot nu toe hebt vastgelegd.",
    };
  }
  if (scope.kind === "day") {
    return {
      title: "Een dag",
      subtitle: describeDay(scope.date),
    };
  }
  if (scope.kind === "week" || scope.kind === "month") {
    return {
      title: scope.kind === "week" ? "Een week" : "Een maand",
      subtitle: scope.label,
    };
  }

  return {
    title: "Een periode",
    subtitle: `${describeDay(scope.startDate)} t/m ${describeDay(scope.endDate)}`,
  };
}

async function fetchAllRawEntries(): Promise<RawEntryRow[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const rows: RawEntryRow[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("entries_raw")
      .select("id, captured_at, journal_date, source_type")
      .order("captured_at", { ascending: true })
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
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const rows: NormalizedEntryRow[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("entries_normalized")
      .select("raw_entry_id, body")
      .order("created_at", { ascending: true })
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
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const rows: DayRow[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("day_journals")
      .select("journal_date, summary, narrative_text")
      .order("journal_date", { ascending: true })
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
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const rows: ExportReflection[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("period_reflections")
      .select(
        "period_type, period_start, period_end, summary_text, narrative_text, highlights_json, reflection_points_json",
      )
      .order("period_start", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) {
      throw error;
    }

    const next = (data ?? []) as ReflectionRow[];
    rows.push(
      ...next
        .filter(
          (row): row is ReflectionRow & { period_type: "week" | "month" } =>
            row.period_type === "week" || row.period_type === "month",
        )
        .map((row) => ({
          periodType: row.period_type,
          periodStart: row.period_start,
          periodEnd: row.period_end,
          summaryText: row.summary_text,
          narrativeText: row.narrative_text,
          highlights: normalizeStringList(row.highlights_json),
          reflectionPoints: normalizeStringList(row.reflection_points_json),
        })),
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
  scope: DateScope;
}): ExportSnapshot {
  const bounds = scopeBounds(input.scope);
  const normalizedByRawEntry = new Map<string, string>(
    input.normalizedEntries.map((row) => [row.raw_entry_id, row.body]),
  );

  const entries: ExportEntry[] = input.rawEntries
    .map((raw) => {
      const body = normalizedByRawEntry.get(raw.id);
      if (!body || body.trim().length === 0) {
        return null;
      }

      const capturedDate = raw.captured_at.slice(0, 10);
      const include = raw.journal_date
        ? inBounds(raw.journal_date, bounds)
        : inBounds(capturedDate, bounds);

      if (!include) {
        return null;
      }

      return {
        capturedAt: raw.captured_at,
        journalDate: raw.journal_date,
        sourceType: raw.source_type === "audio" ? "audio" : "text",
        body,
      } satisfies ExportEntry;
    })
    .filter((entry): entry is ExportEntry => entry !== null);

  const days = input.days.filter((day) => inBounds(day.journal_date, bounds));
  const daysByDate = new Set(days.map((day) => day.journal_date));
  const looseEntries = entries.filter((entry) => !entry.journalDate || !daysByDate.has(entry.journalDate));

  const reflections = input.reflections.filter((reflection) =>
    overlapsBounds(reflection.periodStart, reflection.periodEnd, bounds),
  );

  return {
    days,
    entries,
    looseEntries,
    weekReflections: reflections.filter((item) => item.periodType === "week"),
    monthReflections: reflections.filter((item) => item.periodType === "month"),
  };
}

function pushReflectionSection(lines: string[], title: string, items: ExportReflection[]): void {
  lines.push(`## ${title}`);
  lines.push("");

  if (items.length === 0) {
    lines.push("Nog niet beschikbaar.");
    lines.push("");
    return;
  }

  for (const item of items) {
    lines.push(`### ${item.periodStart} t/m ${item.periodEnd}`);
    lines.push("");
    lines.push("Korte samenvatting");
    lines.push(item.summaryText || "-");
    lines.push("");
    lines.push("Reflectietekst");
    lines.push(item.narrativeText || "-");
    lines.push("");

    if (item.highlights.length > 0) {
      lines.push("Belangrijke punten");
      for (const highlight of item.highlights) {
        lines.push(`- ${highlight}`);
      }
      lines.push("");
    }

    if (item.reflectionPoints.length > 0) {
      lines.push("Vervolgpunten");
      for (const point of item.reflectionPoints) {
        lines.push(`- ${point}`);
      }
      lines.push("");
    }
  }
}

function buildArchiveMarkdown(snapshot: ExportSnapshot, scope: DateScope): string {
  const exportDate = toDateLabel(new Date());
  const lines: string[] = [];
  const description = describeDateScope(scope);

  lines.push("# Mijn archief");
  lines.push("");
  lines.push(`Exportdatum: ${exportDate}`);
  lines.push(`Selectie: ${description.title}`);
  lines.push(`Periode: ${description.subtitle}`);
  lines.push(`Dagen: ${snapshot.days.length}`);
  lines.push(`Entries: ${snapshot.entries.length}`);
  lines.push(`Weekreflecties: ${snapshot.weekReflections.length}`);
  lines.push(`Maandreflecties: ${snapshot.monthReflections.length}`);
  lines.push("");
  lines.push("## Dagen");
  lines.push("");

  if (snapshot.days.length === 0) {
    lines.push("Nog niet beschikbaar.");
    lines.push("");
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
      lines.push("");
      lines.push("Korte samenvatting");
      lines.push(day.summary || "-");
      lines.push("");
      lines.push("Dagtekst");
      lines.push(day.narrative_text || "-");
      lines.push("");
      lines.push("Entries");
      lines.push("");

      const dayEntries = entriesByDate.get(day.journal_date) ?? [];
      if (dayEntries.length === 0) {
        lines.push("Nog geen entries voor deze dag.");
        lines.push("");
      } else {
        for (const [index, entry] of dayEntries.entries()) {
          lines.push(
            `#### Entry ${index + 1} · ${toDateTimeLabel(entry.capturedAt)} · ${sourceLabel(entry.sourceType)}`,
          );
          lines.push("");
          lines.push(entry.body.trim());
          lines.push("");
        }
      }
    }
  }

  lines.push("## Losse entries");
  lines.push("");
  if (snapshot.looseEntries.length === 0) {
    lines.push("Geen losse entries.");
    lines.push("");
  } else {
    for (const [index, entry] of snapshot.looseEntries.entries()) {
      const dateHeader = entry.journalDate ? `${entry.journalDate} (zonder dagblok)` : "zonder dagdatum";
      lines.push(`### Losse entry ${index + 1} · ${dateHeader}`);
      lines.push("");
      lines.push(`Vastgelegd: ${toDateTimeLabel(entry.capturedAt)} · ${sourceLabel(entry.sourceType)}`);
      lines.push("");
      lines.push(entry.body.trim());
      lines.push("");
    }
  }

  pushReflectionSection(lines, "Weekreflecties", snapshot.weekReflections);
  pushReflectionSection(lines, "Maandreflecties", snapshot.monthReflections);

  return lines.join("\n").trimEnd() + "\n";
}

function buildExportFileName(scope: DateScope): string {
  const today = toDateLabel(new Date());
  if (scope.kind === "all") {
    return `dagboek-archief-alles-${today}.md`;
  }
  if (scope.kind === "day") {
    return `dagboek-archief-dag-${scope.date}.md`;
  }
  if (scope.kind === "week") {
    return `dagboek-archief-week-${scope.startDate}-tm-${scope.endDate}.md`;
  }
  if (scope.kind === "month") {
    return `dagboek-archief-maand-${scope.startDate.slice(0, 7)}.md`;
  }
  return `dagboek-archief-periode-${scope.startDate}-tm-${scope.endDate}.md`;
}

function triggerWebDownload(fileName: string, contents: string): void {
  if (typeof document === "undefined") {
    throw new Error("Downloaden is op dit platform niet beschikbaar.");
  }

  const blob = new Blob([contents], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function saveToLocalDocument(fileName: string, contents: string): string {
  const file = new File(Paths.document, fileName);
  if (file.exists) {
    file.delete();
  }

  file.create({ intermediates: true, overwrite: true });
  file.write(contents, { encoding: "utf8" });

  return file.uri;
}

async function loadSnapshotForScope(scope: DateScope): Promise<ExportSnapshot> {
  const [rawEntries, normalizedEntries, days, reflections] = await Promise.all([
    fetchAllRawEntries(),
    fetchAllNormalizedEntries(),
    fetchAllDayJournals(),
    fetchAllReflections(),
  ]);

  return buildSnapshot({
    rawEntries,
    normalizedEntries,
    days,
    reflections,
    scope,
  });
}

export async function previewArchiveScope(scope: DateScope): Promise<ArchiveExportPreview> {
  const flowId = createClientFlowId("export-archive");
  await ensureAuthenticatedUserSession({ flowId, source: "export-archive" });

  const snapshot = await loadSnapshotForScope(scope);
  const hasContent =
    snapshot.days.length > 0 ||
    snapshot.entries.length > 0 ||
    snapshot.weekReflections.length > 0 ||
    snapshot.monthReflections.length > 0;

  return {
    scope,
    hasContent,
    isSparse: snapshot.days.length === 0 && snapshot.entries.length <= 2,
    days: snapshot.days.length,
    entries: snapshot.entries.length,
    weekReflections: snapshot.weekReflections.length,
    monthReflections: snapshot.monthReflections.length,
  };
}

export async function listSelectableDays(): Promise<SelectableDay[]> {
  const flowId = createClientFlowId("export-archive");
  await ensureAuthenticatedUserSession({ flowId, source: "export-archive" });

  const days = await fetchAllDayJournals();
  return days
    .slice()
    .reverse()
    .map((day) => ({
      date: day.journal_date,
      label: describeDay(day.journal_date),
      snippet:
        day.summary?.trim() || day.narrative_text?.trim().slice(0, 120) || "Nog geen samenvatting voor deze dag.",
    }));
}

export async function listSelectableWeeks(): Promise<SelectablePeriod[]> {
  const days = await listSelectableDays();
  const grouped = new Map<string, SelectablePeriod>();

  for (const day of days) {
    const weekStart = getIsoWeekStart(day.date);
    const weekEnd = getIsoWeekEnd(weekStart);
    if (grouped.has(weekStart)) {
      continue;
    }
    grouped.set(weekStart, {
      id: weekStart,
      label: `${describeDay(weekStart)} t/m ${describeDay(weekEnd)}`,
      subtitle: `${weekStart} t/m ${weekEnd}`,
      startDate: weekStart,
      endDate: weekEnd,
    });
  }

  return Array.from(grouped.values()).sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export async function listSelectableMonths(): Promise<SelectablePeriod[]> {
  const days = await listSelectableDays();
  const grouped = new Map<string, SelectablePeriod>();

  for (const day of days) {
    const monthKey = day.date.slice(0, 7);
    if (grouped.has(monthKey)) {
      continue;
    }
    const bounds = getMonthBounds(day.date);
    grouped.set(monthKey, {
      id: monthKey,
      label: shortMonthLabel(day.date),
      subtitle: `${bounds.startDate} t/m ${bounds.endDate}`,
      startDate: bounds.startDate,
      endDate: bounds.endDate,
    });
  }

  return Array.from(grouped.values()).sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export async function downloadUserArchive(scope: DateScope = ALL_DATE_SCOPE): Promise<ArchiveExportResult> {
  const flowId = createClientFlowId("export-archive");
  await ensureAuthenticatedUserSession({ flowId, source: "export-archive" });

  const snapshot = await loadSnapshotForScope(scope);
  const hasContent =
    snapshot.days.length > 0 ||
    snapshot.entries.length > 0 ||
    snapshot.weekReflections.length > 0 ||
    snapshot.monthReflections.length > 0;

  if (!hasContent) {
    return { status: "empty" };
  }

  const fileName = buildExportFileName(scope);
  const contents = buildArchiveMarkdown(snapshot, scope);
  let fileUri: string | undefined;

  if (Platform.OS === "web") {
    triggerWebDownload(fileName, contents);
  } else {
    fileUri = saveToLocalDocument(fileName, contents);
  }

  return {
    status: "saved",
    fileName,
    fileUri,
    days: snapshot.days.length,
    entries: snapshot.entries.length,
    weekReflections: snapshot.weekReflections.length,
    monthReflections: snapshot.monthReflections.length,
  };
}
