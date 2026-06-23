import type { AiReviewLabel } from "@/types";

export type OutputRenderKind = "text" | "object" | "list";

export type NormalizedOutput =
  | { kind: "text"; text: string; parseFallback: boolean }
  | { kind: "object"; fields: { key: string; value: unknown }[] }
  | { kind: "list"; items: unknown[] };

export type ValidateCompareSection = {
  key: string;
  label: string;
  currentText: string;
  newText: string;
  changed: boolean;
};

export type ValidateObservation = {
  label: string;
  detail?: string;
};

const FIELD_LABELS: Record<string, Record<string, string>> = {
  entry_cleanup: {
    title: "Titel",
    body: "Volledige tekst",
    summary_short: "Korte samenvatting",
  },
  day_journal: {
    summary: "Samenvatting",
    narrativeText: "Verhaaltekst",
    sections: "Kernblokken",
  },
  day_summary: {
    summary: "Samenvatting",
    narrativeText: "Verhaaltekst",
    narrative_text: "Verhaaltekst",
    sections: "Kernblokken",
  },
  day_narrative: {
    summary: "Samenvatting",
    narrativeText: "Verhaaltekst",
    narrative_text: "Verhaaltekst",
    sections: "Kernblokken",
  },
  week_summary: {
    summaryText: "Samenvatting",
    summary_text: "Samenvatting",
    narrativeText: "Verhaaltekst",
    narrative_text: "Verhaaltekst",
    highlights: "Highlights",
    highlights_json: "Highlights",
    reflectionPoints: "Reflectiepunten",
    reflection_points_json: "Reflectiepunten",
  },
  week_narrative: {
    summaryText: "Samenvatting",
    summary_text: "Samenvatting",
    narrativeText: "Verhaaltekst",
    narrative_text: "Verhaaltekst",
    highlights: "Highlights",
    highlights_json: "Highlights",
    reflectionPoints: "Reflectiepunten",
    reflection_points_json: "Reflectiepunten",
  },
  month_summary: {
    summaryText: "Samenvatting",
    summary_text: "Samenvatting",
    narrativeText: "Verhaaltekst",
    narrative_text: "Verhaaltekst",
    highlights: "Highlights",
    highlights_json: "Highlights",
    reflectionPoints: "Reflectiepunten",
    reflection_points_json: "Reflectiepunten",
  },
  month_narrative: {
    summaryText: "Samenvatting",
    summary_text: "Samenvatting",
    narrativeText: "Verhaaltekst",
    narrative_text: "Verhaaltekst",
    highlights: "Highlights",
    highlights_json: "Highlights",
    reflectionPoints: "Reflectiepunten",
    reflection_points_json: "Reflectiepunten",
  },
};

const SECTION_PRIORITY = [
  /^(body|narrativeText|narrative_text|narrative)$/i,
  /^(sections|highlights|highlights_json|reflectionPoints|reflection_points_json)$/i,
  /^(summary|summaryText|summary_text|summary_short)$/i,
];

function parseJsonSafe(value: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch {
    return { ok: false };
  }
}

function unwrapJsonCodeFence(value: string): string {
  const trimmed = value.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (!fenced) return trimmed;
  return fenced[1].trim();
}

export function parseObjectLikeText(value: string): Record<string, unknown> | null {
  const cleaned = unwrapJsonCodeFence(value);
  const parsed = parseJsonSafe(cleaned);
  if (parsed.ok && parsed.value && typeof parsed.value === "object" && !Array.isArray(parsed.value)) {
    return parsed.value as Record<string, unknown>;
  }
  return null;
}

export function normalizeOutput(input: {
  rawText: string | null;
  rawJson?: unknown;
  preferredType: OutputRenderKind;
  forceObjectParse?: boolean;
}): NormalizedOutput {
  if (Array.isArray(input.rawJson)) {
    return { kind: "list", items: input.rawJson };
  }

  if (input.rawJson && typeof input.rawJson === "object") {
    const objectValue = input.rawJson as Record<string, unknown>;
    const fields = Object.keys(objectValue)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({ key, value: objectValue[key] }));
    return { kind: "object", fields };
  }

  const text = (input.rawText ?? "").trim();
  if (!text) {
    return { kind: "text", text: "", parseFallback: false };
  }

  if (input.preferredType === "text" && !input.forceObjectParse) {
    const tryObj = parseObjectLikeText(text);
    if (tryObj) {
      const fields = Object.keys(tryObj)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => ({ key, value: tryObj[key] }));
      return { kind: "object", fields };
    }
    return { kind: "text", text, parseFallback: false };
  }

  if (input.preferredType === "object" || input.forceObjectParse) {
    const objectValue = parseObjectLikeText(text);
    if (objectValue) {
      const fields = Object.keys(objectValue)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => ({ key, value: objectValue[key] }));
      return { kind: "object", fields };
    }
    return { kind: "text", text, parseFallback: true };
  }

  const parsed = parseJsonSafe(unwrapJsonCodeFence(text));
  if (parsed.ok && Array.isArray(parsed.value)) {
    return { kind: "list", items: parsed.value };
  }

  const lineItems = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^[-•*]\s+/, ""));
  if (lineItems.length > 1) {
    return { kind: "list", items: lineItems };
  }

  return { kind: "text", text, parseFallback: true };
}

export function renderUnknownValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item, i) => `${i + 1}. ${typeof item === "string" ? item : JSON.stringify(item)}`)
      .join("\n");
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function formatObjectFieldLabel(taskKey: string | undefined, fieldKey: string): string {
  if (taskKey) {
    const map = FIELD_LABELS[taskKey];
    if (map?.[fieldKey]) return map[fieldKey];
  }
  return fieldKey;
}

export function sentenceCount(value: string): number {
  const normalized = value.trim();
  if (!normalized) return 0;
  return normalized
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
}

function getRootSectionLabel(taskKey: string | undefined): string {
  if (!taskKey) return "Output";
  if (taskKey.includes("narrative")) return "Verhaaltekst";
  if (taskKey.includes("summary")) return "Samenvatting";
  if (taskKey === "entry_cleanup") return "Volledige tekst";
  return "Output";
}

function sectionPriority(key: string): number {
  const index = SECTION_PRIORITY.findIndex((pattern) => pattern.test(key));
  return index === -1 ? 99 : index;
}

function normalizedOutputToMap(taskKey: string | undefined, output: NormalizedOutput): Map<string, string> {
  if (output.kind === "object") {
    return new Map(output.fields.map((field) => [field.key, renderUnknownValue(field.value)]));
  }

  if (output.kind === "list") {
    return new Map([["__root", output.items.length > 0 ? renderUnknownValue(output.items) : "Lege lijst."]]);
  }

  return new Map([["__root", output.text || "Geen output."]]);
}

export function buildValidateCompareSections(args: {
  taskKey?: string;
  baseline: NormalizedOutput;
  candidate: NormalizedOutput;
}): ValidateCompareSection[] {
  const baselineMap = normalizedOutputToMap(args.taskKey, args.baseline);
  const candidateMap = normalizedOutputToMap(args.taskKey, args.candidate);
  const keys = Array.from(new Set([...baselineMap.keys(), ...candidateMap.keys()])).sort((a, b) => {
    const priorityDiff = sectionPriority(a) - sectionPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return formatObjectFieldLabel(args.taskKey, a).localeCompare(formatObjectFieldLabel(args.taskKey, b));
  });

  return keys.map((key) => {
    const currentText = baselineMap.get(key) ?? "—";
    const newText = candidateMap.get(key) ?? "—";
    return {
      key,
      label: key === "__root" ? getRootSectionLabel(args.taskKey) : formatObjectFieldLabel(args.taskKey, key),
      currentText,
      newText,
      changed: currentText.trim() !== newText.trim(),
    };
  });
}

function wordCount(value: string): number {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function detailMarkerCount(value: string): number {
  const dates = value.match(/\b\d{1,2}[-/]\d{1,2}(?:[-/]\d{2,4})?\b/g)?.length ?? 0;
  const numbers = value.match(/\b\d+(?:[,.]\d+)?\b/g)?.length ?? 0;
  const names = value.match(/\b[A-ZÀ-Ý][a-zà-ÿ]{3,}\b/g)?.length ?? 0;
  return dates + numbers + names;
}

function flattenUnknownText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(flattenUnknownText).join(" ");
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).map(flattenUnknownText).join(" ");
  return "";
}

function sourceTokenCoverage(outputText: string, inputSnapshotJson: Record<string, unknown> | null | undefined): number | null {
  if (!inputSnapshotJson) return null;
  const sourceText = flattenUnknownText(inputSnapshotJson).toLowerCase();
  const tokens = Array.from(new Set(sourceText.match(/[a-zà-ÿ0-9]{5,}/gi) ?? []))
    .filter((token) => !["vandaag", "morgen", "heeft", "wordt", "waren", "zoals", "omdat", "daarom"].includes(token))
    .slice(0, 120);
  if (tokens.length < 8) return null;

  const haystack = outputText.toLowerCase();
  const matched = tokens.filter((token) => haystack.includes(token)).length;
  return matched / tokens.length;
}

export function buildValidateObservations(args: {
  sections: ValidateCompareSection[];
  inputSnapshotJson?: Record<string, unknown> | null;
}): ValidateObservation[] {
  const currentText = args.sections.map((section) => section.currentText).join("\n\n").trim();
  const newText = args.sections.map((section) => section.newText).join("\n\n").trim();
  const observations: ValidateObservation[] = [];
  const currentWords = wordCount(currentText);
  const newWords = wordCount(newText);

  if (currentWords > 0 && newWords > 0) {
    const ratio = newWords / currentWords;
    if (ratio >= 1.15) {
      observations.push({ label: "uitgebreider", detail: `${newWords} woorden tegenover ${currentWords}` });
    } else if (ratio <= 0.85) {
      observations.push({ label: "compacter", detail: `${newWords} woorden tegenover ${currentWords}` });
    }
  }

  const currentDetails = detailMarkerCount(currentText);
  const newDetails = detailMarkerCount(newText);
  if (newDetails >= currentDetails + 2) {
    observations.push({ label: "concreter", detail: "meer namen, datums of getallen" });
  } else if (currentDetails >= newDetails + 2) {
    observations.push({ label: "minder concreet", detail: "minder namen, datums of getallen" });
  }

  const currentCoverage = sourceTokenCoverage(currentText, args.inputSnapshotJson);
  const newCoverage = sourceTokenCoverage(newText, args.inputSnapshotJson);
  if (currentCoverage !== null && newCoverage !== null) {
    const coverageDelta = newCoverage - currentCoverage;
    if (coverageDelta >= 0.05) {
      observations.push({ label: "meer brondekking" });
    } else if (coverageDelta <= -0.05) {
      observations.push({ label: "minder brondekking" });
    }
  }

  const changedSections = args.sections.filter((section) => section.changed).length;
  if (changedSections > 0) {
    observations.push({ label: `${changedSections} gewijzigde ${changedSections === 1 ? "sectie" : "secties"}` });
  }

  return observations;
}

export function mapValidateShortcutToReviewLabel(key: string): AiReviewLabel | null {
  if (key === "1") return "beter";
  if (key === "2") return "gelijk";
  if (key === "3") return "slechter";
  if (key === "4") return "fout";
  return null;
}
