import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from "../_shared/env.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from "../_shared/error-contract.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from "../_shared/flow-logger.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { AiRuntimeBindingError, buildAiqsEntryCleanupUserPrompt, buildAiqsJsonUserPrompt, loadLiveAiRuntimeBinding, type LiveAiRuntimeBinding } from "../_shared/aiqs-runtime.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { runAiqsRepairFlow } from "../_shared/aiqs-repair-flow.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildChatCompletionsDebugRequest, buildOpenAiDebugMetadata, loadOpenAiDebugStorageSettings, resolveOpenAiDebugStorageForFlow } from "../_shared/openai-debug-storage.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import {
  finalizeDayJournalDraftStrict,
  isLowContentDayEntry,
  orderDayJournalEntries,
} from "../_shared/day-journal-contract.mjs";
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildControlledEmptyDayJournal, loadDayEntrySource } from "../_shared/day-entry-source.ts";

type ProcessEntryRequest = {
  rawText?: unknown;
  audioBase64?: unknown;
  audioMimeType?: unknown;
  rawEntryId?: unknown;
  sourceType?: unknown;
  capturedAt?: unknown;
  journalDate?: unknown;
  timezoneOffsetMinutes?: unknown;
  deferDerived?: unknown;
  clientProcessingId?: unknown;
};

type ProcessEntryResponse = {
  status: "ok";
  flow: "process-entry";
  requestId: string;
  flowId: string;
  processingOutcome: "success" | "recovered";
  rawEntryId: string;
  normalizedEntryId: string;
  journalDate: string;
  dayJournalId: string;
  sourceType: "text" | "audio";
};

type NormalizedEntry = {
  rawEntryId?: string;
  capturedAt?: string;
  title: string;
  body: string;
  summaryShort: string;
};

type DayJournalDraft = {
  summary: string;
  narrativeText: string;
  sections: string[];
  generationMeta?: Record<string, unknown>;
};

type OpenAiJson = Record<string, unknown>;

type ParsedSourceInput =
  | {
      sourceType: "text";
      rawText: string;
      recoveryOnly?: false;
    }
  | {
      sourceType: "audio";
      audioBase64: string;
      audioMimeType: string;
      recoveryOnly?: false;
    }
  | {
      sourceType: "text" | "audio";
      recoveryOnly: true;
    };

const CORS_BASE_HEADERS = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-flow-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const FLOW = "process-entry" as const;
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;
const AUDIO_STORAGE_BUCKET = "entry-audio";
const CLIENT_PROCESSING_ID_PATTERN = /^[A-Za-z0-9_-]{12,160}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NO_SPEECH_TRANSCRIPT = "Geen spraak herkend in audio-opname.";
const LOW_CONTENT_TITLE = "Audio-opname zonder spraak";
const SHORT_ENTRY_DRIFT_MAX_SOURCE_LENGTH = 280;
const GENERIC_TITLES = new Set([
  "notitie",
  "update",
  "gedachte",
  "dagboek",
  "memo",
]);
const GENERIC_PREVIEW_PHRASES = [
  "algemene samenvatting",
  "korte samenvatting",
  "samenvatting",
  "overzicht van de notitie",
];
const META_PREVIEW_STARTS = [
  "de gebruiker",
  "er wordt beschreven",
  "de notitie gaat over",
  "in deze notitie",
];
const CLAIM_INJECTION_PHRASES = [
  "dus ",
  "daarom ",
  "conclusie",
  "het liet zien dat",
  "dat maakte duidelijk dat",
  "uiteindelijk bleek",
  "ik realiseerde me",
];
const UNCERTAINTY_CUES = [
  "uh",
  "eh",
  "denk",
  "volgens mij",
  "of zo",
  "misschien",
];
const ASSERTIVE_CUES = [
  "het is",
  "dit is",
  "blijkt",
  "duidelijk",
  "zeker",
  "vast",
];

class AiRuntimeOutputError extends Error {
  reason: string;
  details: Record<string, unknown>;

  constructor(message: string, reason: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "AiRuntimeOutputError";
    this.reason = reason;
    this.details = details;
  }
}

function isAiRuntimeOutputError(error: unknown): error is AiRuntimeOutputError {
  return error instanceof AiRuntimeOutputError;
}

function failAiRuntimeOutput(message: string, reason: string, details: Record<string, unknown> = {}): never {
  throw new AiRuntimeOutputError(message, reason, details);
}

function requireAiOutputString(
  value: unknown,
  field: string,
  details: Record<string, unknown>,
): string {
  const parsed = parseString(value);
  if (!parsed) {
    failAiRuntimeOutput("OpenAI output mist een verplicht veld.", "required_field_missing", {
      ...details,
      field,
    });
  }
  return parsed;
}

function requireAiOutputObjectString(
  aiResult: OpenAiJson,
  fieldNames: string[],
  field: string,
  details: Record<string, unknown>,
  options: { allowEmpty?: boolean } = {},
): string {
  for (const fieldName of fieldNames) {
    if (!Object.prototype.hasOwnProperty.call(aiResult, fieldName)) {
      continue;
    }
    const value = aiResult[fieldName];
    if (typeof value === "string") {
      const parsed = value.trim();
      if (parsed || options.allowEmpty === true) {
        return parsed;
      }
      continue;
    }
    const parsed = parseString(value);
    if (parsed) {
      return parsed;
    }
  }
  return requireAiOutputString(null, field, {
    ...details,
    availableFields: Object.keys(aiResult).sort(),
  });
}

function allowsEmptySummaryShort(binding: LiveAiRuntimeBinding): boolean {
  const technicalContract = binding.configJson.technical_contract;
  return (
    technicalContract !== null &&
    typeof technicalContract === "object" &&
    !Array.isArray(technicalContract) &&
    (technicalContract as Record<string, unknown>).allowEmptySummaryShort === true
  );
}

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") ?? "*";

  return {
    ...CORS_BASE_HEADERS,
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
  };
}

function jsonResponse(request: Request, status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...buildCorsHeaders(request),
      "Content-Type": "application/json",
    },
  });
}

function errorResponse(input: {
  request: Request;
  httpStatus: number;
  requestId: string;
  flowId: string;
  step: string;
  code: FlowErrorCode;
  message: string;
  details?: Record<string, unknown>;
}) {
  return jsonResponse(
    input.request,
    input.httpStatus,
    createFlowError({
      flow: FLOW,
      requestId: input.requestId,
      flowId: input.flowId,
      step: input.step,
      code: input.code,
      message: input.message,
      ...(input.details ? { details: input.details } : {}),
    }),
  );
}

function parseFlowId(request: Request, requestId: string): string {
  const flowId = request.headers.get("x-flow-id")?.trim() ?? "";
  return flowId.length > 0 ? flowId : requestId;
}

function parseClientProcessingId(value: unknown): string | null {
  const parsed = parseString(value);
  if (!parsed) {
    return null;
  }
  if (!CLIENT_PROCESSING_ID_PATTERN.test(parsed)) {
    throw new Error("Invalid clientProcessingId.");
  }
  return parsed;
}

function parseRawEntryId(value: unknown): string | null {
  const parsed = parseString(value);
  if (!parsed) {
    return null;
  }
  if (!UUID_PATTERN.test(parsed)) {
    throw new Error("Invalid rawEntryId.");
  }
  return parsed;
}

function parseCapturedAt(capturedAt?: string): string {
  if (!capturedAt) {
    return new Date().toISOString();
  }

  const parsed = new Date(capturedAt);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid capturedAt. Use ISO-8601 datetime.");
  }

  return parsed.toISOString();
}

function parseJournalDateInput(value: unknown): string | null {
  const parsed = parseString(value);
  if (!parsed) {
    return null;
  }
  if (!DATE_PATTERN.test(parsed)) {
    throw new Error("Invalid journalDate. Use YYYY-MM-DD.");
  }

  const date = new Date(`${parsed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== parsed) {
    throw new Error("Invalid journalDate. Use YYYY-MM-DD.");
  }

  return parsed;
}

function parseTimezoneOffsetMinutes(value: unknown): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error("Invalid timezoneOffsetMinutes. Use integer minutes.");
  }
  if (value < -840 || value > 840) {
    throw new Error("Invalid timezoneOffsetMinutes range.");
  }
  return value;
}

function toJournalDate(
  capturedAtIso: string,
  timezoneOffsetMinutes: number | null,
): string {
  if (timezoneOffsetMinutes === null) {
    return capturedAtIso.slice(0, 10);
  }

  const capturedAtDate = new Date(capturedAtIso);
  if (Number.isNaN(capturedAtDate.getTime())) {
    return capturedAtIso.slice(0, 10);
  }

  const localMs = capturedAtDate.getTime() - timezoneOffsetMinutes * 60 * 1000;
  const localDate = new Date(localMs);
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateBoundsUtc(journalDate: string): { start: string; end: string } {
  const start = `${journalDate}T00:00:00.000Z`;
  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

  return {
    start,
    end: endDate.toISOString(),
  };
}

function dateBoundsFromLocalDay(
  journalDate: string,
  timezoneOffsetMinutes: number,
): { start: string; end: string } {
  const [yearRaw, monthRaw, dayRaw] = journalDate.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const localMidnightUtcMs = Date.UTC(year, month - 1, day, 0, 0, 0, 0) +
    timezoneOffsetMinutes * 60 * 1000;
  const start = new Date(localMidnightUtcMs);
  const end = new Date(localMidnightUtcMs + 24 * 60 * 60 * 1000);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function normalizeBodyParagraphs(value: string): string {
  const normalizedLines = String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim());

  const collapsed: string[] = [];
  let previousWasBlank = false;

  for (const line of normalizedLines) {
    if (!line) {
      if (!previousWasBlank && collapsed.length > 0) {
        collapsed.push("");
      }
      previousWasBlank = true;
      continue;
    }

    collapsed.push(line);
    previousWasBlank = false;
  }

  while (collapsed[0] === "") {
    collapsed.shift();
  }

  while (collapsed.length > 0 && collapsed[collapsed.length - 1] === "") {
    collapsed.pop();
  }

  return collapsed.join("\n");
}

function parseString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function parseBoolean(value: unknown): boolean | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return null;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeShortLine(value: string, maxLength: number): string {
  return normalizeWhitespace(value).slice(0, maxLength);
}

function normalizeForCompare(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      normalizeForCompare(value)
        .split(/[^a-z0-9à-ÿ_-]+/i)
        .filter((token) => token.length >= 3),
    ),
  );
}

function overlapRatio(source: string, target: string): number {
  const sourceTokens = tokenize(source).filter((token) => token.length >= 4);
  if (sourceTokens.length === 0) {
    return 1;
  }
  const targetSet = new Set(tokenize(target));
  const hits = sourceTokens.filter((token) => targetSet.has(token)).length;
  return hits / sourceTokens.length;
}

function extractSpecificTerms(value: string): string[] {
  const matches = String(value ?? "").match(/[A-Za-zÀ-ÿ0-9_-]{3,}/g) ?? [];
  const terms: string[] = [];
  for (const token of matches) {
    const clean = token.trim();
    if (!clean) {
      continue;
    }
    const hasInternalUppercase = /[A-Z]/.test(clean.slice(1));
    const hasAllCaps =
      clean.length >= 4 && clean === clean.toUpperCase() && /[A-Z]/.test(clean);
    const isSpecific =
      /[0-9]/.test(clean) ||
      hasInternalUppercase ||
      hasAllCaps ||
      /[-_]/.test(clean) ||
      clean.length >= 10;
    if (!isSpecific) {
      continue;
    }
    const key = clean.toLowerCase();
    if (!terms.includes(key)) {
      terms.push(key);
    }
  }
  return terms;
}

function containsAny(text: string, cues: string[]): boolean {
  const normalized = normalizeForCompare(text);
  return cues.some((cue) => normalized.includes(cue));
}

function detectNormalizationDrift(
  source: string,
  normalizedBody: string,
): string[] {
  const sourceClean = normalizeWhitespace(source);
  const bodyClean = normalizeWhitespace(normalizedBody);
  const reasons: string[] = [];

  if (
    !sourceClean ||
    !bodyClean ||
    sourceClean.length > SHORT_ENTRY_DRIFT_MAX_SOURCE_LENGTH
  ) {
    return reasons;
  }

  const sourceLower = normalizeForCompare(sourceClean);
  const bodyLower = normalizeForCompare(bodyClean);

  const addedClaim = CLAIM_INJECTION_PHRASES.some(
    (phrase) => bodyLower.includes(phrase) && !sourceLower.includes(phrase),
  );
  if (addedClaim) {
    reasons.push("added_claim_short_entry");
  }

  const specificTerms = extractSpecificTerms(sourceClean);
  if (specificTerms.length > 0) {
    const lostTerms = specificTerms.filter((term) => !bodyLower.includes(term));
    if (lostTerms.length > 0) {
      reasons.push("specific_term_loss");
    }
  }

  if (overlapRatio(sourceClean, bodyClean) < 0.45) {
    reasons.push("over_rewrite");
  }

  const hadUncertainty = containsAny(sourceClean, UNCERTAINTY_CUES);
  const removedUncertainty =
    hadUncertainty && !containsAny(bodyClean, UNCERTAINTY_CUES);
  const introducedAssertive =
    containsAny(bodyClean, ASSERTIVE_CUES) &&
    !containsAny(sourceClean, ASSERTIVE_CUES);
  if (removedUncertainty && introducedAssertive) {
    reasons.push("speculative_correction");
  }

  return Array.from(new Set(reasons));
}

function looksGenericTitle(value: string): boolean {
  const normalized = normalizeForCompare(value);
  return normalized.length < 4 || GENERIC_TITLES.has(normalized);
}

function containsNoSpeechMarker(value: string): boolean {
  return normalizeForCompare(value).includes(
    normalizeForCompare(NO_SPEECH_TRANSCRIPT),
  );
}

function cleanNormalizedTitle(value: string, fallback: string): string {
  const candidate = sanitizeShortLine(value, 80);
  if (!candidate || looksGenericTitle(candidate)) {
    failAiRuntimeOutput("OpenAI output heeft geen bruikbare titel.", "quality_gate_failed", {
      field: "title",
      reason: "generic_or_empty_title",
    });
  }

  return candidate;
}

function cleanNormalizedBody(value: string, fallback: string): string {
  const candidate = normalizeBodyParagraphs(value);
  if (!candidate || candidate.length < 12) {
    failAiRuntimeOutput("OpenAI output heeft geen bruikbare body.", "quality_gate_failed", {
      field: "body",
      reason: "empty_or_too_short_body",
    });
  }

  return candidate;
}

function isSuspiciouslyCompressedNormalization(
  source: string,
  normalizedBody: string,
): boolean {
  const sourceClean = normalizeWhitespace(source);
  const normalizedClean = normalizeWhitespace(normalizedBody);

  if (sourceClean.length < 500) {
    return false;
  }

  return normalizedClean.length < Math.floor(sourceClean.length * 0.8);
}

function trimPreviewForMobile(value: string, maxLength = 156): string {
  const normalized = normalizeWhitespace(value);
  if (!normalized) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, maxLength);
  const boundary = Math.max(
    sliced.lastIndexOf(". "),
    sliced.lastIndexOf("; "),
    sliced.lastIndexOf(", "),
    sliced.lastIndexOf(" "),
  );
  const base =
    boundary > maxLength * 0.6
      ? sliced.slice(0, boundary).trim()
      : sliced.trim();
  const safeBase = base || sliced.trim();
  return `${safeBase}...`;
}

function finalizePreviewTone(value: string): string {
  const clean = value.trim();
  if (!clean) {
    return "";
  }
  if (clean.endsWith("?")) {
    return `${clean.slice(0, -1).trimEnd()}.`;
  }
  return clean;
}

function looksMetaPreview(value: string): boolean {
  const normalized = normalizeForCompare(value);
  return META_PREVIEW_STARTS.some((prefix) => normalized.startsWith(prefix));
}

function looksGenericPreview(value: string): boolean {
  const normalized = normalizeForCompare(value);
  if (normalized.length < 12) {
    return true;
  }
  return GENERIC_PREVIEW_PHRASES.some((phrase) => normalized.includes(phrase));
}

function cleanNormalizedSummaryShort(
  value: string | null,
  fallbackBody: string,
  options: { allowEmpty?: boolean; details?: Record<string, unknown> } = {},
): string {
  const candidate = trimPreviewForMobile(value ?? "");
  if (!candidate) {
    if (options.allowEmpty === true) {
      return "";
    }
    failAiRuntimeOutput("OpenAI output mist summary_short.", "required_field_missing", {
      ...(options.details ?? {}),
      field: "summary_short",
    });
  }
  if (candidate.endsWith("?")) {
    failAiRuntimeOutput("OpenAI output summary_short is geen statement.", "quality_gate_failed", {
      field: "summary_short",
      reason: "question_summary",
    });
  }
  if (looksMetaPreview(candidate) || looksGenericPreview(candidate)) {
    failAiRuntimeOutput("OpenAI output summary_short is te generiek.", "quality_gate_failed", {
      field: "summary_short",
      reason: "generic_summary",
    });
  }

  return finalizePreviewTone(candidate);
}

function parseSourceInput(body: ProcessEntryRequest): {
  value?: ParsedSourceInput;
  error?: string;
} {
  const rawText = parseString(body.rawText);
  const audioBase64 = parseString(body.audioBase64);
  const audioMimeType = parseString(body.audioMimeType);
  const sourceType = parseString(body.sourceType);
  const hasClientProcessingId = Boolean(parseString(body.clientProcessingId));
  const hasRawEntryId = Boolean(parseString(body.rawEntryId));

  const hasText = Boolean(rawText);
  const hasAudio = Boolean(audioBase64);

  if (!hasText && !hasAudio && (hasClientProcessingId || hasRawEntryId)) {
    if (sourceType === "text" || sourceType === "audio") {
      return {
        value: {
          sourceType,
          recoveryOnly: true,
        },
      };
    }
  }

  if (hasText === hasAudio) {
    return {
      error: "Provide exactly one input path: rawText or audioBase64.",
    };
  }

  if (hasText && rawText) {
    return {
      value: {
        sourceType: "text",
        rawText,
      },
    };
  }

  if (!audioMimeType) {
    return {
      error: "audioMimeType is required when audioBase64 is provided.",
    };
  }

  return {
    value: {
      sourceType: "audio",
      audioBase64: audioBase64 as string,
      audioMimeType,
    },
  };
}

function sanitizeBase64(input: string): string {
  const trimmed = input.trim();

  if (trimmed.startsWith("data:")) {
    const commaIndex = trimmed.indexOf(",");
    if (commaIndex > -1) {
      return trimmed.slice(commaIndex + 1).replace(/\s+/g, "");
    }
  }

  return trimmed.replace(/\s+/g, "");
}

function decodeBase64ToBytes(input: string): Uint8Array | null {
  const sanitized = sanitizeBase64(input);

  try {
    const binary = atob(sanitized);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch (_error) {
    return null;
  }
}

function normalizeAudioMimeType(value: string): string {
  return (
    value.split(";")[0]?.trim().toLowerCase() || "application/octet-stream"
  );
}

function audioFileExtensionFromMimeType(mimeType: string): string {
  switch (mimeType) {
    case "audio/webm":
      return "webm";
    case "audio/wav":
    case "audio/x-wav":
      return "wav";
    case "audio/m4a":
      return "m4a";
    case "audio/mp4":
      return "mp4";
    case "audio/mpeg":
    case "audio/mp3":
      return "mp3";
    case "audio/ogg":
      return "ogg";
    default:
      return "bin";
  }
}

async function shouldSaveAudioRecordings(args: {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  requestId: string;
  flowId: string;
}): Promise<boolean> {
  const { data, error } = await args.supabase
    .from("user_preferences")
    .select("save_audio_recordings")
    .eq("user_id", args.userId)
    .maybeSingle();

  if (error) {
    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "validated",
      event: "user_preferences_read_failed",
      details: {
        error: String(error.message ?? error),
      },
    });
    return false;
  }

  if (!data) {
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "validated",
      event: "user_preferences_missing_default_enabled",
      details: {
        saveAudioRecordings: true,
      },
    });
    return true;
  }

  return data.save_audio_recordings === true;
}

async function uploadEntryAudio(args: {
  supabase: ReturnType<typeof createClient>;
  userId: string;
  rawEntryId: string;
  audioBytes: Uint8Array;
  audioMimeType: string;
}): Promise<{ path: string; mimeType: string; sizeBytes: number }> {
  const mimeType = normalizeAudioMimeType(args.audioMimeType);
  const extension = audioFileExtensionFromMimeType(mimeType);
  const path = `${args.userId}/${args.rawEntryId}/original.${extension}`;

  const { error } = await args.supabase.storage
    .from(AUDIO_STORAGE_BUCKET)
    .upload(path, args.audioBytes, {
      contentType: mimeType,
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(error.message || "Audio upload failed.");
  }

  return {
    path,
    mimeType,
    sizeBytes: args.audioBytes.byteLength,
  };
}

async function transcribeAudio(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  audioBytes: Uint8Array;
  audioMimeType: string;
}): Promise<string | null> {
  try {
    const startedAt = Date.now();
    const normalizedMimeType = normalizeAudioMimeType(args.audioMimeType);
    const extension = audioFileExtensionFromMimeType(normalizedMimeType);
    const blobBytes = Uint8Array.from(args.audioBytes);

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([blobBytes], { type: normalizedMimeType }),
      `capture.${extension}`,
    );
    formData.append("model", args.model);
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "transcribed",
      event: "api_call_start",
      details: {
        operation: "openai_audio_transcription",
        provider: "openai",
        model: args.model,
      },
    });

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${args.apiKey}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      const durationMs = Date.now() - startedAt;
      logFlow("error", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "transcribed",
        event: "api_call_error",
        details: {
          operation: "openai_audio_transcription",
          provider: "openai",
          model: args.model,
          status: response.status,
          durationMs,
        },
      });
      logFlow("error", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "transcribed",
        event: "openai_transcription_failed",
        details: {
          status: response.status,
          body: errorBody,
        },
      });
      return null;
    }
    const durationMs = Date.now() - startedAt;
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "transcribed",
      event: "api_call_success",
      details: {
        operation: "openai_audio_transcription",
        provider: "openai",
        model: args.model,
        durationMs,
      },
    });

    const data = (await response.json()) as { text?: unknown };
    const transcript = typeof data.text === "string" ? data.text.trim() : "";

    if (transcript.length === 0) {
      logFlow("warn", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "transcribed",
        event: "openai_transcription_empty",
      });
    }

    return transcript;
  } catch (error) {
    logFlow("error", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "transcribed",
      event: "api_call_error",
      details: {
        operation: "openai_audio_transcription",
        provider: "openai",
        model: args.model,
        error: error instanceof Error ? error.message : String(error),
      },
    });
    logFlow("error", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "transcribed",
      event: "openai_transcription_exception",
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return null;
  }
}

async function transcribeAudioWithSingleRetry(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  audioBytes: Uint8Array;
  audioMimeType: string;
}): Promise<string | null> {
  const firstAttempt = await transcribeAudio(args);
  if (firstAttempt !== null) {
    return firstAttempt;
  }

  logFlow("warn", {
    flow: FLOW,
    requestId: args.requestId,
    flowId: args.flowId,
    step: "transcribed",
    event: "openai_transcription_retry_attempted",
    details: {
      retryAttempt: 1,
    },
  });

  const secondAttempt = await transcribeAudio(args);
  if (secondAttempt !== null) {
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "transcribed",
      event: "openai_transcription_retry_succeeded",
      details: {
        retryAttempt: 1,
      },
    });
  }

  return secondAttempt;
}

async function callOpenAiJson(args: {
  apiKey: string;
  model: string;
  temperature: number;
  responseFormat:
    | { type: "json_schema"; json_schema: { name: string; strict: true; schema: Record<string, unknown> } }
    | { type: "json_object" }
    | null;
  requestId: string;
  flowId: string;
  step: string;
  operation: string;
  promptVersion: string;
  systemPrompt: string;
  userPrompt: string;
  debugStore?: { store: boolean; metadata?: Record<string, string> };
}): Promise<OpenAiJson | null> {
  try {
    const startedAt = Date.now();
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: "api_call_start",
      details: {
        operation: args.operation,
        provider: "openai",
        model: args.model,
        debugStoreEnabled: args.debugStore?.store === true,
      },
    });
    const requestBody: Record<string, unknown> = {
      model: args.model,
      temperature: args.temperature,
      messages: [
        {
          role: "system",
          content: `${args.systemPrompt}\nPromptVersion: ${args.promptVersion}\nRequestId: ${args.requestId}`,
        },
        { role: "user", content: args.userPrompt },
      ],
    };
    if (args.responseFormat) {
      requestBody.response_format = args.responseFormat;
    }
    if (args.debugStore !== undefined) {
      requestBody.store = args.debugStore.store;
      if (args.debugStore.store) {
        requestBody.metadata = args.debugStore.metadata;
      }
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const durationMs = Date.now() - startedAt;
      logFlow("error", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: args.step,
        event: "api_call_error",
        details: {
          operation: args.operation,
          provider: "openai",
          model: args.model,
          status: response.status,
          durationMs,
        },
      });
      logFlow("error", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: args.step,
        event: "openai_call_failed",
        details: {
          status: response.status,
          body: errorBody,
        },
      });
      return null;
    }
    const durationMs = Date.now() - startedAt;
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: "api_call_success",
      details: {
        operation: args.operation,
        provider: "openai",
        model: args.model,
        durationMs,
      },
    });

    const data = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return null;
    }

    const parsed = JSON.parse(content) as OpenAiJson;
    return parsed;
  } catch (error) {
    logFlow("error", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: "api_call_error",
      details: {
        operation: args.operation,
        provider: "openai",
        model: args.model,
        error: error instanceof Error ? error.message : String(error),
      },
    });
    logFlow("error", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: "openai_response_parse_failed",
      details: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return null;
  }
}

async function callOpenAiJsonWithSingleRetry(args: {
  apiKey: string;
  model: string;
  temperature: number;
  responseFormat:
    | { type: "json_schema"; json_schema: { name: string; strict: true; schema: Record<string, unknown> } }
    | { type: "json_object" }
    | null;
  requestId: string;
  flowId: string;
  step: string;
  operation: string;
  promptVersion: string;
  systemPrompt: string;
  userPrompt: string;
  debugStore?: { store: boolean; metadata?: Record<string, string> };
}): Promise<OpenAiJson | null> {
  const firstAttempt = await callOpenAiJson(args);
  if (firstAttempt !== null) {
    return firstAttempt;
  }

  logFlow("warn", {
    flow: FLOW,
    requestId: args.requestId,
    flowId: args.flowId,
    step: args.step,
    event: "openai_call_retry_attempted",
    details: {
      operation: args.operation,
      retryAttempt: 1,
    },
  });

  const secondAttempt = await callOpenAiJson(args);
  if (secondAttempt !== null) {
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: args.step,
      event: "openai_call_retry_succeeded",
      details: {
        operation: args.operation,
        retryAttempt: 1,
      },
    });
  }

  return secondAttempt;
}

async function normalizeEntry(args: {
  apiKey: string;
  requestId: string;
  flowId: string;
  softQualityGuards: boolean;
  rawText: string;
  primaryBinding: LiveAiRuntimeBinding;
  repairBinding: LiveAiRuntimeBinding;
  debugStore?: { store: boolean; metadata?: Record<string, string> };
}): Promise<NormalizedEntry> {
  if (containsNoSpeechMarker(args.rawText)) {
    failAiRuntimeOutput("Audio bevat geen bruikbare transcriptie.", "no_speech", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
    });
  }

  const aiResult = await callOpenAiJsonWithSingleRetry({
    apiKey: args.apiKey,
    model: args.primaryBinding.model,
    temperature: args.primaryBinding.temperature,
    responseFormat: args.primaryBinding.responseFormat,
    requestId: args.requestId,
    flowId: args.flowId,
    step: "normalized_persisted",
    operation: "openai_normalize_entry",
    promptVersion: args.primaryBinding.promptVersion,
    systemPrompt: args.primaryBinding.systemInstructions,
    userPrompt: buildAiqsEntryCleanupUserPrompt({
      binding: args.primaryBinding,
      rawText: args.rawText,
    }),
    debugStore: args.debugStore,
  });

  if (!aiResult) {
    failAiRuntimeOutput("OpenAI gaf geen bruikbare entry-normalisatie terug.", "openai_result_missing", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
    });
  }

  const nextTitle = cleanNormalizedTitle(
    requireAiOutputString(aiResult.title, "title", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
    }),
    "",
  );
  const nextBody = cleanNormalizedBody(
    requireAiOutputString(aiResult.body, "body", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
    }),
    "",
  );
  const compressionGuardTriggered = isSuspiciouslyCompressedNormalization(
    args.rawText,
    nextBody,
  );
  const body =
    compressionGuardTriggered && args.softQualityGuards
      ? failAiRuntimeOutput("OpenAI entry body faalde de compressie-guard.", "quality_gate_failed", {
          runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
          taskKey: args.primaryBinding.taskKey,
          versionId: args.primaryBinding.versionId,
          reason: "compressed_normalized_body",
        })
      : nextBody;
  const summaryShort = cleanNormalizedSummaryShort(
    requireAiOutputObjectString(aiResult, ["summary_short", "summaryShort"], "summary_short", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
    }, { allowEmpty: allowsEmptySummaryShort(args.primaryBinding) }),
    body,
    {
      allowEmpty: allowsEmptySummaryShort(args.primaryBinding),
      details: {
        runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
        taskKey: args.primaryBinding.taskKey,
        versionId: args.primaryBinding.versionId,
      },
    },
  );
  const driftReasons = detectNormalizationDrift(args.rawText, body);

  if (compressionGuardTriggered && args.softQualityGuards) {
    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      event: "normalized_body_compression_guardrail_triggered",
      details: {
        sourceLength: normalizeWhitespace(args.rawText).length,
        normalizedLength: normalizeWhitespace(nextBody).length,
      },
    });
  }

  if (compressionGuardTriggered && !args.softQualityGuards) {
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      event: "normalized_soft_quality_not_enforced",
      details: {
        reasons: ["compressed_normalized_body"],
        softGuardsEnabled: false,
      },
    });
  }

  if (driftReasons.length > 0) {
    if (!args.softQualityGuards) {
      logFlow("info", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "normalized_persisted",
        event: "normalized_soft_quality_not_enforced",
        details: {
          reasons: driftReasons,
          softGuardsEnabled: false,
        },
      });

      return {
        title: nextTitle,
        body,
        summaryShort,
      };
    }

    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      event: "normalized_drift_detected",
      details: {
        reasons: driftReasons,
      },
    });

    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      event: "normalized_repair_attempted",
      details: {
        reasons: driftReasons,
      },
    });

    const repairFlow = await runAiqsRepairFlow<NormalizedEntry>({
      primaryValue: { title: nextTitle, body, summaryShort },
      primaryFailureReasons: driftReasons,
      expectedRepairBindingKey: "entry_normalization.repair",
      repairBinding: args.repairBinding,
      callRepair: async (repairBinding) => {
        const repairedAiResult = await callOpenAiJsonWithSingleRetry({
          apiKey: args.apiKey,
          model: repairBinding.model,
          temperature: repairBinding.temperature,
          responseFormat: repairBinding.responseFormat,
          requestId: args.requestId,
          flowId: args.flowId,
          step: "normalized_persisted",
          operation: "openai_normalize_entry_repair",
          promptVersion: repairBinding.promptVersion,
          systemPrompt: repairBinding.systemInstructions,
          userPrompt: buildAiqsEntryCleanupUserPrompt({ binding: repairBinding, rawText: args.rawText, currentBody: body }),
        });
        if (!repairedAiResult) return null;

        const repairedTitle = cleanNormalizedTitle(requireAiOutputString(repairedAiResult.title, "title", {
          runtimeBindingKey: repairBinding.runtimeBindingKey,
          taskKey: repairBinding.taskKey,
          versionId: repairBinding.versionId,
        }), "");
        const repairedBodyRaw = cleanNormalizedBody(requireAiOutputString(repairedAiResult.body, "body", {
          runtimeBindingKey: repairBinding.runtimeBindingKey,
          taskKey: repairBinding.taskKey,
          versionId: repairBinding.versionId,
        }), "");
        const repairedBody = isSuspiciouslyCompressedNormalization(args.rawText, repairedBodyRaw)
          ? failAiRuntimeOutput("OpenAI repair body faalde de compressie-guard.", "quality_gate_failed", {
              runtimeBindingKey: repairBinding.runtimeBindingKey,
              taskKey: repairBinding.taskKey,
              versionId: repairBinding.versionId,
              reason: "compressed_repair_body",
            })
          : repairedBodyRaw;
        return {
          title: repairedTitle,
          body: repairedBody,
          summaryShort: cleanNormalizedSummaryShort(
            requireAiOutputObjectString(repairedAiResult, ["summary_short", "summaryShort"], "summary_short", {
              runtimeBindingKey: repairBinding.runtimeBindingKey,
              taskKey: repairBinding.taskKey,
              versionId: repairBinding.versionId,
            }, { allowEmpty: allowsEmptySummaryShort(repairBinding) }),
            repairedBody,
            {
              allowEmpty: allowsEmptySummaryShort(repairBinding),
              details: {
                runtimeBindingKey: repairBinding.runtimeBindingKey,
                taskKey: repairBinding.taskKey,
                versionId: repairBinding.versionId,
              },
            },
          ),
        };
      },
      getRepairFailureReasons: (value) => detectNormalizationDrift(args.rawText, value.body),
      missingRepairResultReason: "repair_model_output_missing",
    });

    if (repairFlow.status === "repaired") {
      return repairFlow.value;
    }

    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      event: "normalized_repair_failed",
      details: { reasons: repairFlow.status === "failed" ? repairFlow.failureReasons : driftReasons },
    });

    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      event: "normalized_quality_gate_failed",
      details: {
        reasons: driftReasons,
      },
    });

    failAiRuntimeOutput("OpenAI entry-normalisatie faalde de quality gate.", "quality_gate_failed", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
      reasons: driftReasons,
    });
  }

  return {
    title: nextTitle,
    body,
    summaryShort,
  };
}

async function composeDayJournal(args: {
  apiKey: string;
  requestId: string;
  flowId: string;
  journalDate: string;
  strictValidation: boolean;
  softQualityGuards: boolean;
  normalizedEntries: NormalizedEntry[];
  primaryBinding: LiveAiRuntimeBinding;
  repairBinding: LiveAiRuntimeBinding;
  debugStore?: { store: boolean; metadata?: Record<string, string> };
}): Promise<DayJournalDraft> {
  const orderedEntries = orderDayJournalEntries(args.normalizedEntries);
  const contentEntries = orderedEntries.filter(
    (entry) =>
      !isLowContentDayEntry(entry, {
        noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
        lowContentTitle: LOW_CONTENT_TITLE,
      }),
  );

  if (contentEntries.length === 0) {
    failAiRuntimeOutput("Geen bruikbare content voor dagjournaal.", "no_speech", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
      journalDate: args.journalDate,
    });
  }

  const aiResult = await callOpenAiJsonWithSingleRetry({
    apiKey: args.apiKey,
    model: args.primaryBinding.model,
    temperature: args.primaryBinding.temperature,
    responseFormat: args.primaryBinding.responseFormat,
    requestId: args.requestId,
    flowId: args.flowId,
    step: "day_journal_upserted",
    operation: "openai_compose_day_journal",
    promptVersion: args.primaryBinding.promptVersion,
    systemPrompt: args.primaryBinding.systemInstructions,
    userPrompt: buildAiqsJsonUserPrompt({
      binding: args.primaryBinding,
      context: {
        journal_date: args.journalDate,
        entries: contentEntries.map((entry) => ({
          entry_title: entry.title,
          entry_body: entry.body,
        })),
      },
    }),
    debugStore: args.debugStore,
  });

  const finalizedResult = finalizeDayJournalDraftStrict({
    aiResult,
    entries: contentEntries,
    options: {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
      strictValidation: args.strictValidation,
      softQualityGuards: args.softQualityGuards,
    },
  });
  const finalized = finalizedResult.finalized;

  if (!finalizedResult.ok) {
    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      event: "day_journal_quality_gate_failed",
      details: {
        reasons: finalizedResult.reasons,
      },
    });
    failAiRuntimeOutput("OpenAI dagjournaal faalde de quality gate.", "quality_gate_failed", {
      runtimeBindingKey: args.primaryBinding.runtimeBindingKey,
      taskKey: args.primaryBinding.taskKey,
      versionId: args.primaryBinding.versionId,
      journalDate: args.journalDate,
      reasons: finalizedResult.reasons,
    });
  }

  if (!args.softQualityGuards && finalized.softQualitySignals.length > 0) {
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      event: "soft_quality_not_enforced",
      details: {
        reasons: finalized.softQualitySignals,
        softGuardsEnabled: false,
      },
    });
  }

  const narrativeRepairReasons = finalized.narrativeQualityReasons.filter(
    (reason) =>
      [
        "compressed_narrative",
        "stitched_narrative",
        "truncated_narrative",
      ].includes(reason),
  );
  const narrativeNeedsRepair =
    args.softQualityGuards &&
    narrativeRepairReasons.length > 0;
  if (narrativeNeedsRepair) {
    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      event: narrativeRepairReasons.includes("compressed_narrative")
        ? "compressed_detected"
        : "narrative_quality_detected",
      details: {
        reasons: narrativeRepairReasons,
      },
    });

    logFlow("info", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      event: "retry_attempted",
      details: {
        reason: narrativeRepairReasons[0] ?? "narrative_quality",
      },
    });

    const repairFlow = await runAiqsRepairFlow({
      primaryValue: { finalized, strictFailureReasons: [] as string[] },
      primaryFailureReasons: narrativeRepairReasons,
      expectedRepairBindingKey: "day_journal.repair",
      repairBinding: args.repairBinding,
      callRepair: async (repairBinding) => {
        const repairedAiResult = await callOpenAiJsonWithSingleRetry({
          apiKey: args.apiKey,
          model: repairBinding.model,
          temperature: repairBinding.temperature,
          responseFormat: repairBinding.responseFormat,
          requestId: args.requestId,
          flowId: args.flowId,
          step: "day_journal_upserted",
          operation: "openai_compose_day_journal_repair",
          promptVersion: repairBinding.promptVersion,
          systemPrompt: repairBinding.systemInstructions,
          userPrompt: buildAiqsJsonUserPrompt({
            binding: repairBinding,
            context: {
              journal_date: args.journalDate,
              entries: contentEntries.map((entry) => ({ entry_title: entry.title, entry_body: entry.body })),
            },
          }),
        });
        if (!repairedAiResult) return null;
        const repairedResult = finalizeDayJournalDraftStrict({
          aiResult: repairedAiResult,
          entries: contentEntries,
          options: {
            noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
            lowContentTitle: LOW_CONTENT_TITLE,
            strictValidation: args.strictValidation,
            softQualityGuards: args.softQualityGuards,
          },
        });
        return {
          finalized: repairedResult.finalized,
          strictFailureReasons: repairedResult.ok ? [] : repairedResult.reasons,
        };
      },
      getRepairFailureReasons: (value) => value.strictFailureReasons.length > 0
        ? value.strictFailureReasons
        : value.finalized.narrativeQualityReasons.filter((reason) =>
          ["compressed_narrative", "stitched_narrative", "truncated_narrative"].includes(reason)
        ),
      missingRepairResultReason: "repair_model_output_missing",
    });

    if (repairFlow.status === "repaired") {
      logFlow("info", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "day_journal_upserted",
        event: "retry_succeeded",
      });

      return {
        summary: repairFlow.value.finalized.summary,
        narrativeText: repairFlow.value.finalized.narrativeText,
        sections: repairFlow.value.finalized.sections,
      };
    }

    const retryFailureReasons = repairFlow.status === "failed"
      ? repairFlow.failureReasons
      : narrativeRepairReasons;

    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      event: "retry_failed",
      details: {
        reasons: retryFailureReasons,
      },
    });
    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      event: "day_journal_repair_failed",
      details: {
        dominantReason: retryFailureReasons[0] ?? "narrative_quality",
        reasons: retryFailureReasons,
      },
    });

    failAiRuntimeOutput("OpenAI dagjournaal-repair faalde de quality gate.", "repair_failed", {
      runtimeBindingKey: args.repairBinding.runtimeBindingKey,
      taskKey: args.repairBinding.taskKey,
      versionId: args.repairBinding.versionId,
      journalDate: args.journalDate,
      reasons: retryFailureReasons,
    });
  }

  return {
    summary: finalized.summary,
    narrativeText: finalized.narrativeText,
    sections: finalized.sections,
  };
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: buildCorsHeaders(request),
    });
  }

  const requestId = crypto.randomUUID();
  const flowId = parseFlowId(request, requestId);

  if (request.method !== "POST") {
    return errorResponse({
      request,
      httpStatus: 405,
      requestId,
      flowId,
      step: "received",
      code: "INPUT_INVALID",
      message: "Method not allowed",
      details: { method: request.method },
    });
  }

  let step = "received";
  let rawEntryId: string | null = null;
  let clientProcessingId: string | null = null;
  let requestedRawEntryId: string | null = null;
  let usedRecoveryPath = false;
  let createdRawEntryThisRequest = false;

  try {
    logFlow("info", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "start",
    });

    const runtimeEnv = getFunctionRuntimeEnv();
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim() ??
      Deno.env.get("APP_SUPABASE_SERVICE_ROLE_KEY")?.trim() ??
      "";
    if (!serviceRoleKey) {
      throw new Error("Missing service role key for AIQS runtime binding resolution.");
    }
    const adminClient = createClient(runtimeEnv.supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const entryPrimaryBinding = await loadLiveAiRuntimeBinding({
      adminClient,
      bindingKey: "entry_normalization.primary",
    });
    const entryRepairBinding = await loadLiveAiRuntimeBinding({
      adminClient,
      bindingKey: "entry_normalization.repair",
    });
    const dayPrimaryBinding = await loadLiveAiRuntimeBinding({
      adminClient,
      bindingKey: "day_journal.primary",
    });
    const dayRepairBinding = await loadLiveAiRuntimeBinding({
      adminClient,
      bindingKey: "day_journal.repair",
    });

    // Load debug storage policy for this flow (best-effort; no-op on error)
    let debugStore: { store: boolean; metadata?: Record<string, string> } | undefined;
    try {
      const debugSettings = await loadOpenAiDebugStorageSettings(adminClient);
      const resolution = resolveOpenAiDebugStorageForFlow({
        settings: debugSettings,
        flowKey: "process-entry.generation",
        endpointFamily: "chat_completions",
      });
      const metadata = buildOpenAiDebugMetadata({
        app: "persoonlijke-assistent",
        env: Deno.env.get("APP_ENV") ?? "production",
        flow: "process-entry",
        functionName: "process-entry",
        taskKey: `${entryPrimaryBinding.taskKey}+${dayPrimaryBinding.taskKey}`,
        runtimeFamily: "aiqs_runtime",
        requestId,
        flowId,
        mode: "generation",
        version: `${entryPrimaryBinding.versionNumber}.${dayPrimaryBinding.versionNumber}`,
        actor: "user",
      });
      debugStore = buildChatCompletionsDebugRequest({ resolution, metadata });
    } catch {
      // debug storage policy load is non-fatal; continue without
    }

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return errorResponse({
        request,
        httpStatus: 401,
        requestId,
        flowId,
        step: "authenticated",
        code: "AUTH_MISSING",
        message: "Missing Authorization header",
      });
    }

    step = "authenticated";
    const supabase = createClient(
      runtimeEnv.supabaseUrl,
      runtimeEnv.supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      },
    );

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      logFlow("warn", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "auth_failed",
        details: {
          error: authError
            ? String(authError.message ?? authError)
            : "missing user",
        },
      });
      return errorResponse({
        request,
        httpStatus: 401,
        requestId,
        flowId,
        step,
        code: "AUTH_UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    let body: ProcessEntryRequest;

    try {
      const parsedBody = await request.json();
      if (!parsedBody || typeof parsedBody !== "object") {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step: "validated",
          code: "INPUT_INVALID",
          message: "Invalid JSON body",
        });
      }

      body = parsedBody as ProcessEntryRequest;
    } catch (_error) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step: "validated",
        code: "INPUT_INVALID",
        message: "Invalid JSON body",
      });
    }

    step = "validated";
    const parsedSource = parseSourceInput(body);

    if (!parsedSource.value) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: "INPUT_INVALID",
        message: parsedSource.error ?? "Invalid input payload",
      });
    }

    let capturedAt: string;
    try {
      capturedAt = parseCapturedAt(parseString(body.capturedAt) ?? undefined);
    } catch (error) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: "INPUT_INVALID",
        message: error instanceof Error ? error.message : "Invalid capturedAt.",
      });
    }

    let requestJournalDate: string | null = null;
    let timezoneOffsetMinutes: number | null = null;
    const deferDerived = parseBoolean(body.deferDerived) ?? false;
    try {
      requestJournalDate = parseJournalDateInput(body.journalDate);
      timezoneOffsetMinutes = parseTimezoneOffsetMinutes(body.timezoneOffsetMinutes);
      clientProcessingId = parseClientProcessingId(body.clientProcessingId);
      requestedRawEntryId = parseRawEntryId(body.rawEntryId);
    } catch (error) {
      return errorResponse({
        request,
        httpStatus: 400,
        requestId,
        flowId,
        step,
        code: "INPUT_INVALID",
        message: error instanceof Error ? error.message : "Invalid journalDate context.",
      });
    }

    let journalDate = requestJournalDate ??
      toJournalDate(capturedAt, timezoneOffsetMinutes);

    logFlow("info", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "validated",
      details: {
        userId: authData.user.id,
        journalDate,
        deferDerived,
        journalDateSource: requestJournalDate
          ? "request_local_day"
          : timezoneOffsetMinutes !== null
          ? "capturedAt_with_client_offset"
          : "capturedAt_utc_day",
        timezoneOffsetMinutes,
        hasClientProcessingId: Boolean(clientProcessingId),
        hasRawEntryId: Boolean(requestedRawEntryId),
        sourceType: parsedSource.value.sourceType,
      },
    });

    let sourceTextForNormalization = "";
    let rawTextForPersist: string | null = null;
    let transcriptTextForPersist: string | null = null;
    let rawEntry: { id: string } | null = null;
    let audioUploadPayload: { bytes: Uint8Array; mimeType: string } | null = null;

    const saveAudioRecordings = await shouldSaveAudioRecordings({
      supabase,
      userId: authData.user.id,
      requestId,
      flowId,
    });

    if (parsedSource.value.sourceType === "audio" && !saveAudioRecordings) {
      logFlow("info", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "audio_recording_not_saved_by_preference",
        details: {
          reason: "user_preference_save_audio_recordings_false",
        },
      });
    }

    if (clientProcessingId) {
      const { data: existingRawEntry, error: existingRawError } = await supabase
        .from("entries_raw")
        .select("id, source_type, raw_text, transcript_text, journal_date, captured_at")
        .eq("user_id", authData.user.id)
        .eq("client_processing_id", clientProcessingId)
        .maybeSingle();

      if (existingRawError) {
        logFlow("error", {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: "recovery_check_failed",
          details: {
            error: String(existingRawError.message ?? existingRawError),
            clientProcessingId,
          },
        });
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: "DB_READ_FAILED",
          message: "Failed to check existing capture",
        });
      }

      if (existingRawEntry) {
        if (existingRawEntry.source_type !== parsedSource.value.sourceType) {
          return errorResponse({
            request,
            httpStatus: 409,
            requestId,
            flowId,
            step,
            code: "INPUT_INVALID",
            message: "clientProcessingId already belongs to another capture type.",
          });
        }

        rawEntry = { id: existingRawEntry.id };
        rawEntryId = existingRawEntry.id;
        const existingJournalDate = existingRawEntry.journal_date ?? journalDate;
        journalDate = existingJournalDate;
        const { data: existingNormalizedEntry, error: existingNormalizedError } = await supabase
          .from("entries_normalized")
          .select("id")
          .eq("user_id", authData.user.id)
          .eq("raw_entry_id", existingRawEntry.id)
          .maybeSingle();

        if (existingNormalizedError) {
          logFlow("error", {
            flow: FLOW,
            requestId,
            flowId,
            step,
            event: "recovery_check_failed",
            details: {
              error: String(existingNormalizedError.message ?? existingNormalizedError),
              rawEntryId,
              clientProcessingId,
            },
          });
          return errorResponse({
            request,
            httpStatus: 500,
            requestId,
            flowId,
            step,
            code: "DB_READ_FAILED",
            message: "Failed to check existing capture",
            details: { rawEntryId },
          });
        }

        if (existingNormalizedEntry) {
          const response: ProcessEntryResponse = {
            status: "ok",
            flow: FLOW,
            requestId,
            flowId,
            processingOutcome: "recovered",
            rawEntryId: existingRawEntry.id,
            normalizedEntryId: existingNormalizedEntry.id,
            journalDate: existingJournalDate,
            dayJournalId: "",
            sourceType: parsedSource.value.sourceType,
          };

          step = "completed";
          logFlow("info", {
            flow: FLOW,
            requestId,
            flowId,
            step,
            event: "idempotency_hit_completed",
            details: {
              rawEntryId: response.rawEntryId,
              normalizedEntryId: response.normalizedEntryId,
              journalDate: response.journalDate,
              sourceType: response.sourceType,
              clientProcessingId,
            },
          });

          return jsonResponse(request, 200, response);
        }

        sourceTextForNormalization =
          existingRawEntry.source_type === "audio"
            ? parseString(existingRawEntry.transcript_text) ?? ""
            : parseString(existingRawEntry.raw_text) ?? "";

        if (!sourceTextForNormalization) {
          logFlow("warn", {
            flow: FLOW,
            requestId,
            flowId,
            step,
            event: "recovery_resume_blocked",
            details: {
              rawEntryId,
              sourceType: existingRawEntry.source_type,
              clientProcessingId,
            },
          });
          return errorResponse({
            request,
            httpStatus: 409,
            requestId,
            flowId,
            step,
            code: "INPUT_INVALID",
            message: "Capture could not be resumed safely.",
            details: { rawEntryId },
          });
        }

        logFlow("info", {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: "recovery_resume",
          details: {
            rawEntryId,
            journalDate: existingJournalDate,
            sourceType: existingRawEntry.source_type,
            clientProcessingId,
          },
        });
        usedRecoveryPath = true;
      }
    }

    if (!rawEntry && requestedRawEntryId) {
      const { data: existingRawEntry, error: existingRawError } = await supabase
        .from("entries_raw")
        .select("id, source_type, raw_text, transcript_text, journal_date, captured_at")
        .eq("user_id", authData.user.id)
        .eq("id", requestedRawEntryId)
        .maybeSingle();

      if (existingRawError) {
        logFlow("error", {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: "recovery_check_failed",
          details: {
            error: String(existingRawError.message ?? existingRawError),
            rawEntryId: requestedRawEntryId,
          },
        });
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: "DB_READ_FAILED",
          message: "Failed to check existing capture",
          details: {
            rawEntryId: requestedRawEntryId,
          },
        });
      }

      if (!existingRawEntry) {
        return errorResponse({
          request,
          httpStatus: 409,
          requestId,
          flowId,
          step,
          code: "INPUT_INVALID",
          message: "Capture could not be found for recovery.",
          details: {
            rawEntryId: requestedRawEntryId,
            recoveryState: "non_recoverable",
            nonRecoverable: true,
            reason: "raw_entry_not_found",
          },
        });
      }

      if (existingRawEntry.source_type !== parsedSource.value.sourceType) {
        return errorResponse({
          request,
          httpStatus: 409,
          requestId,
          flowId,
          step,
          code: "INPUT_INVALID",
          message: "rawEntryId belongs to another capture type.",
          details: {
            rawEntryId: requestedRawEntryId,
          },
        });
      }

      rawEntry = { id: existingRawEntry.id };
      rawEntryId = existingRawEntry.id;
      journalDate = existingRawEntry.journal_date ?? journalDate;
      sourceTextForNormalization =
        existingRawEntry.source_type === "audio"
          ? parseString(existingRawEntry.transcript_text) ?? ""
          : parseString(existingRawEntry.raw_text) ?? "";

      if (!sourceTextForNormalization) {
        logFlow("warn", {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: "recovery_resume_blocked",
          details: {
            rawEntryId,
            sourceType: existingRawEntry.source_type,
            requestedRawEntryId,
          },
        });
        return errorResponse({
          request,
          httpStatus: 409,
          requestId,
          flowId,
          step,
          code: "INPUT_INVALID",
          message: "Capture could not be resumed safely.",
          details: {
            rawEntryId,
            recoveryState: "non_recoverable",
            nonRecoverable: true,
            reason: "source_text_missing",
          },
        });
      }

      logFlow("info", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "recovery_resume",
        details: {
          rawEntryId,
          journalDate,
          sourceType: existingRawEntry.source_type,
          requestedRawEntryId,
        },
      });
      usedRecoveryPath = true;
    }

    if (rawEntry) {
      // Existing raw entry found for this idempotency key; continue normalization only.
    } else if (parsedSource.value.recoveryOnly) {
      return errorResponse({
        request,
        httpStatus: 409,
        requestId,
        flowId,
        step,
        code: "INPUT_INVALID",
        message: "Capture could not be found for recovery.",
        details: {
          recoveryState: "non_recoverable",
          nonRecoverable: true,
          reason: "recovery_reference_not_found",
        },
      });
    } else if (parsedSource.value.sourceType === "text") {
      sourceTextForNormalization = parsedSource.value.rawText;
      rawTextForPersist = parsedSource.value.rawText;
    } else {
      const audioBytes = decodeBase64ToBytes(parsedSource.value.audioBase64);

      if (!audioBytes) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: "INPUT_INVALID",
          message: "Invalid audioBase64 payload",
        });
      }

      if (audioBytes.byteLength > MAX_AUDIO_BYTES) {
        return errorResponse({
          request,
          httpStatus: 413,
          requestId,
          flowId,
          step,
          code: "PAYLOAD_TOO_LARGE",
          message: "Audio payload too large. Keep raw audio below 5MB.",
        });
      }

      step = "transcribed";
      logFlow("info", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "transcription_start",
        details: {
          audioBytes: audioBytes.byteLength,
          audioMimeType: normalizeAudioMimeType(
            parsedSource.value.audioMimeType,
          ),
        },
      });

      const transcript = await transcribeAudioWithSingleRetry({
        apiKey: runtimeEnv.openAiApiKey,
        model: runtimeEnv.openAiTranscriptionModel,
        requestId,
        flowId,
        audioBytes,
        audioMimeType: parsedSource.value.audioMimeType,
      });

      if (transcript === null) {
        return errorResponse({
          request,
          httpStatus: 502,
          requestId,
          flowId,
          step,
          code: "UPSTREAM_UNAVAILABLE",
          message: "Failed to transcribe audio",
        });
      }

      const transcriptText =
        transcript.length > 0 ? transcript : NO_SPEECH_TRANSCRIPT;

      logFlow("info", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "transcription_success",
        details: {
          transcriptLength: transcriptText.length,
        },
      });

      sourceTextForNormalization = transcriptText;
      transcriptTextForPersist = transcriptText;
      audioUploadPayload = {
        bytes: audioBytes,
        mimeType: parsedSource.value.audioMimeType,
      };
    }

    if (!rawEntry) {
      step = "raw_persisted";
      const { data: insertedRawEntry, error: rawError } = await supabase
        .from("entries_raw")
        .insert({
          user_id: authData.user.id,
          source_type: parsedSource.value.sourceType,
          raw_text: rawTextForPersist,
          transcript_text: transcriptTextForPersist,
          journal_date: journalDate,
          captured_at: capturedAt,
          client_processing_id: clientProcessingId,
        })
        .select("id")
        .single();

      if (rawError || !insertedRawEntry) {
        logFlow("error", {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: "insert_entries_raw_failed",
          details: {
            error: rawError
              ? String(rawError.message ?? rawError)
              : "missing row",
            hasClientProcessingId: Boolean(clientProcessingId),
          },
        });
        return errorResponse({
          request,
          httpStatus: 500,
          requestId,
          flowId,
          step,
          code: "DB_WRITE_FAILED",
          message: "Failed to persist raw entry",
        });
      }

      rawEntry = insertedRawEntry;
      rawEntryId = insertedRawEntry.id;
      createdRawEntryThisRequest = true;
      logFlow("info", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "server_ack",
        details: {
          rawEntryId,
          journalDate,
          sourceType: parsedSource.value.sourceType,
          hasClientProcessingId: Boolean(clientProcessingId),
        },
      });
    }

    if (!rawEntry) {
      throw new Error("Raw entry missing after capture persistence.");
    }
    const persistedRawEntry = rawEntry;

    if (
      parsedSource.value.sourceType === "audio" &&
      saveAudioRecordings &&
      audioUploadPayload
    ) {
      step = "audio_saved";
      try {
        const uploaded = await uploadEntryAudio({
          supabase,
          userId: authData.user.id,
          rawEntryId: persistedRawEntry.id,
          audioBytes: audioUploadPayload.bytes,
          audioMimeType: audioUploadPayload.mimeType,
        });

        const { error: audioMetaError } = await supabase
          .from("entries_raw")
          .update({
            audio_storage_path: uploaded.path,
            audio_mime_type: uploaded.mimeType,
            audio_size_bytes: uploaded.sizeBytes,
            audio_saved_at: new Date().toISOString(),
          })
          .eq("id", persistedRawEntry.id)
          .eq("user_id", authData.user.id);

        if (audioMetaError) {
          logFlow("error", {
            flow: FLOW,
            requestId,
            flowId,
            step,
            event: "audio_metadata_update_failed",
            details: {
              rawEntryId: persistedRawEntry.id,
              error: String(audioMetaError.message ?? audioMetaError),
            },
          });

          try {
            await supabase.storage
              .from(AUDIO_STORAGE_BUCKET)
              .remove([uploaded.path]);
          } catch {
            // best effort cleanup
          }

          if (createdRawEntryThisRequest) {
            const { error: rollbackRawError } = await supabase
              .from("entries_raw")
              .delete()
              .eq("id", persistedRawEntry.id)
              .eq("user_id", authData.user.id);

            if (rollbackRawError) {
              logFlow("error", {
                flow: FLOW,
                requestId,
                flowId,
                step,
                event: "audio_capture_rollback_failed",
                details: {
                  rawEntryId: persistedRawEntry.id,
                  error: String(rollbackRawError.message ?? rollbackRawError),
                },
              });
            }
          }

          return errorResponse({
            request,
            httpStatus: 500,
            requestId,
            flowId,
            step,
            code: "DB_WRITE_FAILED",
            message: "Failed to persist audio recording metadata",
            details: {
              rawEntryId: persistedRawEntry.id,
              reason: "audio_metadata_update_failed",
            },
          });
        }
      } catch (error) {
        logFlow("error", {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: "audio_upload_failed",
          details: {
            rawEntryId: persistedRawEntry.id,
            error: error instanceof Error ? error.message : String(error),
          },
        });

        if (createdRawEntryThisRequest) {
          const { error: rollbackRawError } = await supabase
            .from("entries_raw")
            .delete()
            .eq("id", persistedRawEntry.id)
            .eq("user_id", authData.user.id);

          if (rollbackRawError) {
            logFlow("error", {
              flow: FLOW,
              requestId,
              flowId,
              step,
              event: "audio_capture_rollback_failed",
              details: {
                rawEntryId: persistedRawEntry.id,
                error: String(rollbackRawError.message ?? rollbackRawError),
              },
            });
          }
        }

        return errorResponse({
          request,
          httpStatus: 502,
          requestId,
          flowId,
          step,
          code: "UPSTREAM_UNAVAILABLE",
          message: "Failed to persist audio recording",
          details: {
            rawEntryId: persistedRawEntry.id,
            reason: "audio_upload_failed",
          },
        });
      }
    }

    const normalized = await normalizeEntry({
      apiKey: runtimeEnv.openAiApiKey,
      requestId,
      flowId,
      softQualityGuards: runtimeEnv.dayJournalSoftQualityGuards,
      rawText: sourceTextForNormalization,
      primaryBinding: entryPrimaryBinding,
      repairBinding: entryRepairBinding,
      debugStore,
    });

    step = "normalized_persisted";
    const { data: normalizedEntry, error: normalizedError } = await supabase
      .from("entries_normalized")
      .upsert(
        {
          raw_entry_id: persistedRawEntry.id,
          user_id: authData.user.id,
          title: normalized.title,
          body: normalized.body,
          summary_short: normalized.summaryShort,
        },
        { onConflict: "raw_entry_id" },
      )
      .select("id")
      .single();

    if (normalizedError || !normalizedEntry) {
      logFlow("error", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "insert_entries_normalized_failed",
        details: {
          error: normalizedError
            ? String(normalizedError.message ?? normalizedError)
            : "missing row",
          rawEntryId,
          hasClientProcessingId: Boolean(clientProcessingId),
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: "DB_WRITE_FAILED",
        message: "Failed to persist normalized entry",
        details: rawEntryId ? { rawEntryId } : undefined,
      });
    }

    const { data: persistedRawRow, error: persistedRawRowError } = await supabase
      .from("entries_raw")
      .select("source_type, raw_text, transcript_text, audio_storage_path, audio_mime_type, audio_size_bytes")
      .eq("id", persistedRawEntry.id)
      .eq("user_id", authData.user.id)
      .single();

    if (persistedRawRowError || !persistedRawRow) {
      logFlow("error", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "integrity_check_failed",
        details: {
          rawEntryId: persistedRawEntry.id,
          reason: "entries_raw_read_failed",
          error: persistedRawRowError
            ? String(persistedRawRowError.message ?? persistedRawRowError)
            : "missing row",
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: "DB_READ_FAILED",
        message: "Failed to verify capture integrity",
        details: {
          rawEntryId: persistedRawEntry.id,
          reason: "entries_raw_read_failed",
        },
      });
    }

    const integrityIssues: string[] = [];
    if (!parseString(normalized.title)) {
      integrityIssues.push("normalized_title_missing");
    }
    if (!parseString(normalized.body)) {
      integrityIssues.push("normalized_body_missing");
    }
    if (!allowsEmptySummaryShort(entryPrimaryBinding) && !parseString(normalized.summaryShort)) {
      integrityIssues.push("normalized_summary_missing");
    }
    if (persistedRawRow.source_type === "text" && !parseString(persistedRawRow.raw_text)) {
      integrityIssues.push("raw_text_missing");
    }
    if (
      persistedRawRow.source_type === "audio" &&
      !parseString(persistedRawRow.transcript_text)
    ) {
      integrityIssues.push("transcript_text_missing");
    }
    if (persistedRawRow.source_type === "audio" && saveAudioRecordings) {
      if (!parseString(persistedRawRow.audio_storage_path)) {
        integrityIssues.push("audio_storage_path_missing");
      }
      if (!parseString(persistedRawRow.audio_mime_type)) {
        integrityIssues.push("audio_mime_type_missing");
      }
      if (
        typeof persistedRawRow.audio_size_bytes !== "number" ||
        !Number.isFinite(persistedRawRow.audio_size_bytes) ||
        persistedRawRow.audio_size_bytes <= 0
      ) {
        integrityIssues.push("audio_size_invalid");
      }
    }

    if (integrityIssues.length > 0) {
      logFlow("error", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "integrity_check_failed",
        details: {
          rawEntryId: persistedRawEntry.id,
          issues: integrityIssues,
          saveAudioRecordings,
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: "DB_WRITE_FAILED",
        message: "Capture integrity check failed",
        details: {
          rawEntryId: persistedRawEntry.id,
          issues: integrityIssues,
        },
      });
    }

    if (deferDerived) {
      const response: ProcessEntryResponse = {
        status: "ok",
        flow: FLOW,
        requestId,
        flowId,
        processingOutcome: usedRecoveryPath ? "recovered" : "success",
        rawEntryId: persistedRawEntry.id,
        normalizedEntryId: normalizedEntry.id,
        journalDate,
        dayJournalId: "",
        sourceType: parsedSource.value.sourceType,
      };

      step = "completed";
      logFlow("info", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "success",
        details: {
          rawEntryId: response.rawEntryId,
          normalizedEntryId: response.normalizedEntryId,
          dayJournalDeferred: true,
          journalDate: response.journalDate,
          sourceType: response.sourceType,
          hasClientProcessingId: Boolean(clientProcessingId),
        },
      });

      return jsonResponse(request, 200, response);
    }

    step = "day_journal_upserted";
    let dayEntrySource: Awaited<ReturnType<typeof loadDayEntrySource>>;
    try {
      dayEntrySource = await loadDayEntrySource({
        client: supabase,
        userId: authData.user.id,
        journalDate,
        timezoneOffsetMinutes,
        expectedPromptVersion: dayPrimaryBinding.promptVersion,
        expectedModel: dayPrimaryBinding.model,
      });
    } catch (sourceError) {
      logFlow("error", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "select_entries_raw_for_day_failed",
        details: {
          error: sourceError instanceof Error ? sourceError.message : String(sourceError),
          rawEntryId,
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: "DB_READ_FAILED",
        message: "Failed to load entries for day journal",
        details: rawEntryId ? { rawEntryId } : undefined,
      });
    }

    logFlow("info", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "day_entry_source_loaded",
      details: {
        userId: authData.user.id,
        journalDate,
        entry_count_ui_equivalent: dayEntrySource.debug.uiEquivalentRawCount,
        entry_count_runtime: dayEntrySource.debug.normalizedCount,
        prompt_input_entry_count: dayEntrySource.debug.promptInputEntryCount,
        entry_ids: dayEntrySource.debug.entryIds,
        prompt_input_body_lengths: dayEntrySource.debug.promptInputBodyLengths,
        issue_reasons: dayEntrySource.issueReasons,
      },
    });

    if (dayEntrySource.debug.uiEquivalentRawCount > 0 && dayEntrySource.debug.promptInputEntryCount === 0) {
      return errorResponse({
        request,
        httpStatus: 409,
        requestId,
        flowId,
        step,
        code: "INTERNAL_UNEXPECTED",
        message: "Day journal source has raw entries but no normalized prompt entries.",
        details: {
          journalDate,
          entry_count_ui_equivalent: dayEntrySource.debug.uiEquivalentRawCount,
          entry_count_runtime: dayEntrySource.debug.normalizedCount,
          entry_ids: dayEntrySource.debug.entryIds,
          missing_normalized_raw_ids: dayEntrySource.missingNormalizedRawIds,
          issue_reasons: dayEntrySource.issueReasons,
        },
      });
    }

    const normalizedEntriesForDay: NormalizedEntry[] = dayEntrySource.promptEntries.map((entry) => ({
      rawEntryId: entry.rawEntryId,
      capturedAt: entry.capturedAt,
      title: entry.title,
      body: entry.body,
      summaryShort: entry.summaryShort ?? "",
    }));

    const dayDraft = dayEntrySource.debug.uiEquivalentRawCount === 0
      ? buildControlledEmptyDayJournal(journalDate)
      : await composeDayJournal({
          apiKey: runtimeEnv.openAiApiKey,
          requestId,
          flowId,
          journalDate,
          strictValidation: runtimeEnv.dayJournalStrictValidation,
          softQualityGuards: runtimeEnv.dayJournalSoftQualityGuards,
          normalizedEntries: normalizedEntriesForDay,
          primaryBinding: dayPrimaryBinding,
          repairBinding: dayRepairBinding,
          debugStore,
        });

    const { data: dayJournal, error: dayJournalError } = await supabase
      .from("day_journals")
      .upsert(
        {
          user_id: authData.user.id,
          journal_date: journalDate,
          summary: dayDraft.summary,
          narrative_text: dayDraft.narrativeText,
          sections: dayDraft.sections,
          updated_at: new Date().toISOString(),
          generation_meta: {
            ...(dayDraft.generationMeta ?? {}),
            flow: "process-entry",
            runtime_version: "day_entry_source_v1",
            prompt_version: dayPrimaryBinding.promptVersion,
            model: dayPrimaryBinding.model,
            source_entry_count: dayEntrySource.debug.uiEquivalentRawCount,
            runtime_entry_count: dayEntrySource.debug.normalizedCount,
            prompt_entry_count: dayEntrySource.debug.promptInputEntryCount,
            source_entry_ids: dayEntrySource.debug.entryIds,
            prompt_input_body_lengths: dayEntrySource.debug.promptInputBodyLengths,
            issue_reasons: dayEntrySource.issueReasons,
          },
        },
        { onConflict: "user_id,journal_date" },
      )
      .select("id")
      .single();

    if (dayJournalError || !dayJournal) {
      logFlow("error", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "upsert_day_journal_failed",
        details: {
          error: dayJournalError
            ? String(dayJournalError.message ?? dayJournalError)
            : "missing row",
          rawEntryId,
        },
      });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: "DB_WRITE_FAILED",
        message: "Failed to upsert day journal",
        details: rawEntryId ? { rawEntryId } : undefined,
      });
    }

    const response: ProcessEntryResponse = {
      status: "ok",
      flow: FLOW,
      requestId,
      flowId,
      processingOutcome: usedRecoveryPath ? "recovered" : "success",
      rawEntryId: persistedRawEntry.id,
      normalizedEntryId: normalizedEntry.id,
      journalDate,
      dayJournalId: dayJournal.id,
      sourceType: parsedSource.value.sourceType,
    };

    step = "completed";
    logFlow("info", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "success",
      details: {
        rawEntryId: response.rawEntryId,
        normalizedEntryId: response.normalizedEntryId,
        dayJournalId: response.dayJournalId,
        journalDate: response.journalDate,
        sourceType: response.sourceType,
        hasClientProcessingId: Boolean(clientProcessingId),
      },
    });

    return jsonResponse(request, 200, response);
  } catch (error) {
    if (error instanceof AiRuntimeBindingError) {
      const details = error.toSafeDetails();
      logFlow("error", { flow: FLOW, requestId, flowId, step, event: "aiqs_runtime_binding_rejected", details });
      return errorResponse({
        request,
        httpStatus: 500,
        requestId,
        flowId,
        step,
        code: "INTERNAL_UNEXPECTED",
        message: error.message,
        details,
      });
    }

    if (isAiRuntimeOutputError(error)) {
      logFlow("warn", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "ai_runtime_output_rejected",
        details: {
          reason: error.reason,
          ...error.details,
          ...(rawEntryId ? { rawEntryId } : {}),
          hasClientProcessingId: Boolean(clientProcessingId),
        },
      });
      return errorResponse({
        request,
        httpStatus: 502,
        requestId,
        flowId,
        step,
        code: "UPSTREAM_UNAVAILABLE",
        message: error.message,
        details: {
          reason: error.reason,
          ...error.details,
          ...(rawEntryId ? { rawEntryId } : {}),
        },
      });
    }

    logFlow("error", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "fatal",
      details: {
        error: error instanceof Error ? error.message : String(error),
        ...(rawEntryId ? { rawEntryId } : {}),
        hasClientProcessingId: Boolean(clientProcessingId),
      },
    });
    return errorResponse({
      request,
      httpStatus: 500,
      requestId,
      flowId,
      step,
      code: "INTERNAL_UNEXPECTED",
      message: "Internal error",
      details: rawEntryId ? { rawEntryId } : undefined,
    });
  }
});
