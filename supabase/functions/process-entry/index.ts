import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore -- Deno runtime requires local import extensions.
import { getFunctionRuntimeEnv } from "../_shared/env.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from "../_shared/error-contract.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from "../_shared/flow-logger.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildEntryNormalizationPromptSpec, buildEntryNormalizationRepairPromptSpec } from "../_shared/prompt-specs.ts";
// @ts-ignore -- Deno runtime requires local import extensions.
import {
  buildDayJournalPromptSpec,
  buildDayJournalRepairPromptSpec,
  createFallbackDayJournal,
  finalizeDayJournalDraft,
  isLowContentDayEntry,
  orderDayJournalEntries,
} from "../_shared/day-journal-contract.mjs";

type ProcessEntryRequest = {
  rawText?: unknown;
  audioBase64?: unknown;
  audioMimeType?: unknown;
  capturedAt?: unknown;
  journalDate?: unknown;
  timezoneOffsetMinutes?: unknown;
};

type ProcessEntryResponse = {
  status: "ok";
  flow: "process-entry";
  requestId: string;
  flowId: string;
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
};

type OpenAiJson = Record<string, unknown>;

type ParsedSourceInput =
  | {
      sourceType: "text";
      rawText: string;
    }
  | {
      sourceType: "audio";
      audioBase64: string;
      audioMimeType: string;
    };

const CORS_BASE_HEADERS = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-flow-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const FLOW = "process-entry" as const;
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const NO_SPEECH_TRANSCRIPT = "Geen spraak herkend in audio-opname.";
const LOW_CONTENT_TITLE = "Audio-opname zonder spraak";
const LOW_CONTENT_BODY = "Geen bruikbare spraakinhoud gevonden in de opname.";
const LOW_CONTENT_SUMMARY_SHORT = "Geen bruikbare spraakinhoud in deze opname.";
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

function toJournalDate(capturedAtIso: string): string {
  return capturedAtIso.slice(0, 10);
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

function fallbackNormalization(rawText: string): NormalizedEntry {
  const clean = normalizeBodyParagraphs(rawText);
  const titleBase = clean.split(/[.!?\n]/)[0]?.trim() || clean;
  const title = titleBase.slice(0, 80) || "Notitie";

  return {
    title,
    body: clean,
    summaryShort: createSummaryShortFromBody(clean),
  };
}

function parseString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
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
    return sanitizeShortLine(fallback, 80) || "Notitie";
  }

  return candidate;
}

function cleanNormalizedBody(value: string, fallback: string): string {
  const candidate = normalizeBodyParagraphs(value);
  if (!candidate || candidate.length < 12) {
    return normalizeBodyParagraphs(fallback);
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

function createSummaryShortFromBody(body: string): string {
  const normalizedBody = normalizeWhitespace(body);
  if (!normalizedBody) {
    return "Korte preview niet beschikbaar.";
  }

  const firstSentence = normalizedBody.split(/[.!?]/)[0]?.trim() ?? "";
  const source = firstSentence.length >= 24 ? firstSentence : normalizedBody;
  const preview = trimPreviewForMobile(source);
  return finalizePreviewTone(preview || trimPreviewForMobile(normalizedBody));
}

function cleanNormalizedSummaryShort(
  value: string | null,
  fallbackBody: string,
): string {
  const candidate = trimPreviewForMobile(value ?? "");
  if (!candidate) {
    return createSummaryShortFromBody(fallbackBody);
  }
  if (candidate.endsWith("?")) {
    return createSummaryShortFromBody(fallbackBody);
  }
  if (looksMetaPreview(candidate) || looksGenericPreview(candidate)) {
    return createSummaryShortFromBody(fallbackBody);
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

  const hasText = Boolean(rawText);
  const hasAudio = Boolean(audioBase64);

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

async function callOpenAiJson(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  step: string;
  operation: string;
  promptVersion: string;
  systemPrompt: string;
  userPrompt: string;
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
      },
    });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: args.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `${args.systemPrompt}\nPromptVersion: ${args.promptVersion}\nRequestId: ${args.requestId}`,
          },
          { role: "user", content: args.userPrompt },
        ],
      }),
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

async function normalizeEntry(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  softQualityGuards: boolean;
  rawText: string;
}): Promise<NormalizedEntry> {
  if (containsNoSpeechMarker(args.rawText)) {
    return {
      title: LOW_CONTENT_TITLE,
      body: LOW_CONTENT_BODY,
      summaryShort: LOW_CONTENT_SUMMARY_SHORT,
    };
  }

  const normalizationPrompt = buildEntryNormalizationPromptSpec({
    rawText: args.rawText,
  });
  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: "normalized_persisted",
    operation: "openai_normalize_entry",
    promptVersion: normalizationPrompt.promptVersion,
    systemPrompt: normalizationPrompt.systemPrompt,
    userPrompt: normalizationPrompt.userPrompt,
  });

  const fallback = fallbackNormalization(args.rawText);

  if (!aiResult) {
    return fallback;
  }

  const nextTitle = cleanNormalizedTitle(
    parseString(aiResult.title) ?? fallback.title,
    fallback.title,
  );
  const nextBody = cleanNormalizedBody(
    parseString(aiResult.body) ?? fallback.body,
    fallback.body,
  );
  const compressionGuardTriggered = isSuspiciouslyCompressedNormalization(
    args.rawText,
    nextBody,
  );
  const body =
    compressionGuardTriggered && args.softQualityGuards
      ? fallback.body
      : nextBody;
  const summaryShort = cleanNormalizedSummaryShort(
    parseString(aiResult.summary_short),
    body,
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

    const repairPrompt = buildEntryNormalizationRepairPromptSpec({
      rawText: args.rawText,
      currentBody: body,
    });
    const repairedAiResult = await callOpenAiJson({
      apiKey: args.apiKey,
      model: args.model,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      operation: "openai_normalize_entry_repair",
      promptVersion: repairPrompt.promptVersion,
      systemPrompt: repairPrompt.systemPrompt,
      userPrompt: repairPrompt.userPrompt,
    });

    if (repairedAiResult) {
      const repairedTitle = cleanNormalizedTitle(
        parseString(repairedAiResult.title) ?? nextTitle,
        fallback.title,
      );
      const repairedBodyRaw = cleanNormalizedBody(
        parseString(repairedAiResult.body) ?? body,
        fallback.body,
      );
      const repairedBody = isSuspiciouslyCompressedNormalization(
        args.rawText,
        repairedBodyRaw,
      )
        ? fallback.body
        : repairedBodyRaw;
      const repairedDrift = detectNormalizationDrift(
        args.rawText,
        repairedBody,
      );
      if (repairedDrift.length === 0) {
        return {
          title: repairedTitle,
          body: repairedBody,
          summaryShort: cleanNormalizedSummaryShort(
            parseString(repairedAiResult.summary_short),
            repairedBody,
          ),
        };
      }

      logFlow("warn", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "normalized_persisted",
        event: "normalized_repair_failed",
        details: {
          reasons: repairedDrift,
        },
      });
    } else {
      logFlow("warn", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "normalized_persisted",
        event: "normalized_repair_failed",
        details: {
          reasons: ["repair_model_output_missing"],
        },
      });
    }

    const conservative = fallbackNormalization(args.rawText);
    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "normalized_persisted",
      event: "normalized_fallback_used",
      details: {
        reasons: driftReasons,
      },
    });

    return {
      title: conservative.title,
      body: conservative.body,
      summaryShort: createSummaryShortFromBody(conservative.body),
    };
  }

  return {
    title: nextTitle,
    body,
    summaryShort,
  };
}

async function composeDayJournal(args: {
  apiKey: string;
  model: string;
  requestId: string;
  flowId: string;
  journalDate: string;
  strictValidation: boolean;
  softQualityGuards: boolean;
  normalizedEntries: NormalizedEntry[];
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
    return finalizeDayJournalDraft({
      aiResult: null,
      entries: contentEntries,
      options: {
        noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
        lowContentTitle: LOW_CONTENT_TITLE,
        strictValidation: args.strictValidation,
        softQualityGuards: args.softQualityGuards,
      },
    });
  }

  const promptSpec = buildDayJournalPromptSpec({
    journalDate: args.journalDate,
    entries: contentEntries,
  });

  const aiResult = await callOpenAiJson({
    apiKey: args.apiKey,
    model: args.model,
    requestId: args.requestId,
    flowId: args.flowId,
    step: "day_journal_upserted",
    operation: "openai_compose_day_journal",
    promptVersion: promptSpec.promptVersion,
    systemPrompt: promptSpec.systemPrompt,
    userPrompt: promptSpec.userPrompt,
  });

  const finalized = finalizeDayJournalDraft({
    aiResult,
    entries: contentEntries,
    options: {
      noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
      lowContentTitle: LOW_CONTENT_TITLE,
      strictValidation: args.strictValidation,
      softQualityGuards: args.softQualityGuards,
    },
  });

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
    !finalized.usedFallback &&
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

    const repairPrompt = buildDayJournalRepairPromptSpec({
      journalDate: args.journalDate,
      entries: contentEntries,
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

    const repairedAiResult = await callOpenAiJson({
      apiKey: args.apiKey,
      model: args.model,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      operation: "openai_compose_day_journal_repair",
      promptVersion: repairPrompt.promptVersion,
      systemPrompt: repairPrompt.systemPrompt,
      userPrompt: repairPrompt.userPrompt,
    });

    const repairedFinalized = finalizeDayJournalDraft({
      aiResult: repairedAiResult,
      entries: contentEntries,
      options: {
        noSpeechTranscript: NO_SPEECH_TRANSCRIPT,
        lowContentTitle: LOW_CONTENT_TITLE,
        strictValidation: args.strictValidation,
        softQualityGuards: args.softQualityGuards,
      },
    });

    const remainingNarrativeRepairReasons =
      repairedFinalized.narrativeQualityReasons.filter((reason) =>
        [
          "compressed_narrative",
          "stitched_narrative",
          "truncated_narrative",
        ].includes(reason),
      );
    const retrySucceeded =
      !repairedFinalized.usedFallback &&
      remainingNarrativeRepairReasons.length === 0;

    if (retrySucceeded) {
      logFlow("info", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "day_journal_upserted",
        event: "retry_succeeded",
      });

      return {
        summary: repairedFinalized.summary,
        narrativeText: repairedFinalized.narrativeText,
        sections: repairedFinalized.sections,
      };
    }

    const fallback = createFallbackDayJournal(contentEntries);
    const retryFailureReasons = repairedFinalized.usedFallback
      ? repairedFinalized.rejectionReasons
      : remainingNarrativeRepairReasons;

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
      event: "day_journal_fallback_used",
      details: {
        dominantReason: retryFailureReasons[0] ?? "narrative_quality",
        reasons: retryFailureReasons,
      },
    });

    return fallback;
  }

  if (finalized.usedFallback) {
    logFlow("warn", {
      flow: FLOW,
      requestId: args.requestId,
      flowId: args.flowId,
      step: "day_journal_upserted",
      event: "day_journal_fallback_used",
      details: {
        dominantReason: finalized.rejectionReasons[0] ?? "unknown",
        reasons: finalized.rejectionReasons,
      },
    });
  } else {
    if (finalized.usedFallbackSummary) {
      logFlow("info", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "day_journal_upserted",
        event: "day_journal_summary_fallback_used",
        details: {
          dominantReason: finalized.summaryFallbackReasons[0] ?? "unknown",
          reasons: finalized.summaryFallbackReasons,
        },
      });
    }

    if (finalized.usedFallbackSections) {
      logFlow("info", {
        flow: FLOW,
        requestId: args.requestId,
        flowId: args.flowId,
        step: "day_journal_upserted",
        event: "day_journal_sections_fallback_used",
        details: {
          dominantReason: finalized.sectionFallbackReasons[0] ?? "unknown",
          reasons: finalized.sectionFallbackReasons,
        },
      });
    }
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

  try {
    logFlow("info", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "start",
    });

    const runtimeEnv = getFunctionRuntimeEnv();
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
    try {
      requestJournalDate = parseJournalDateInput(body.journalDate);
      timezoneOffsetMinutes = parseTimezoneOffsetMinutes(body.timezoneOffsetMinutes);
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

    const journalDate = requestJournalDate ?? toJournalDate(capturedAt);

    logFlow("info", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "validated",
      details: {
        userId: authData.user.id,
        journalDate,
        journalDateSource: requestJournalDate ? "request_local_day" : "capturedAt_utc_day",
        timezoneOffsetMinutes,
        sourceType: parsedSource.value.sourceType,
      },
    });

    let sourceTextForNormalization = "";
    let rawTextForPersist: string | null = null;
    let transcriptTextForPersist: string | null = null;

    if (parsedSource.value.sourceType === "text") {
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

      const transcript = await transcribeAudio({
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
    }

    step = "raw_persisted";
    const { data: rawEntry, error: rawError } = await supabase
      .from("entries_raw")
      .insert({
        user_id: authData.user.id,
        source_type: parsedSource.value.sourceType,
        raw_text: rawTextForPersist,
        transcript_text: transcriptTextForPersist,
        captured_at: capturedAt,
      })
      .select("id")
      .single();

    if (rawError || !rawEntry) {
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
    rawEntryId = rawEntry.id;

    const normalized = await normalizeEntry({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      softQualityGuards: runtimeEnv.dayJournalSoftQualityGuards,
      rawText: sourceTextForNormalization,
    });

    step = "normalized_persisted";
    const { data: normalizedEntry, error: normalizedError } = await supabase
      .from("entries_normalized")
      .insert({
        raw_entry_id: rawEntry.id,
        user_id: authData.user.id,
        title: normalized.title,
        body: normalized.body,
        summary_short: normalized.summaryShort,
      })
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

    step = "day_journal_upserted";
    const bounds = requestJournalDate !== null && timezoneOffsetMinutes !== null
      ? dateBoundsFromLocalDay(journalDate, timezoneOffsetMinutes)
      : dateBoundsUtc(journalDate);
    const { data: rawEntriesForDay, error: dayRawError } = await supabase
      .from("entries_raw")
      .select("id, captured_at")
      .eq("user_id", authData.user.id)
      .gte("captured_at", bounds.start)
      .lt("captured_at", bounds.end)
      .order("captured_at", { ascending: true });

    if (dayRawError) {
      logFlow("error", {
        flow: FLOW,
        requestId,
        flowId,
        step,
        event: "select_entries_raw_for_day_failed",
        details: {
          error: String(dayRawError.message ?? dayRawError),
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

    const rawIds = (rawEntriesForDay ?? []).map(
      (entry: { id: string }) => entry.id,
    );
    const normalizedEntriesForDay: NormalizedEntry[] = [];

    if (rawIds.length > 0) {
      const { data: dayNormalizedRows, error: dayNormalizedError } =
        await supabase
          .from("entries_normalized")
          .select("raw_entry_id, title, body, summary_short")
          .eq("user_id", authData.user.id)
          .in("raw_entry_id", rawIds);

      if (dayNormalizedError) {
        logFlow("error", {
          flow: FLOW,
          requestId,
          flowId,
          step,
          event: "select_entries_normalized_for_day_failed",
          details: {
            error: String(dayNormalizedError.message ?? dayNormalizedError),
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
          message: "Failed to compose day journal",
          details: rawEntryId ? { rawEntryId } : undefined,
        });
      }

      const normalizedByRawId = new Map<string, NormalizedEntry>();
      for (const row of dayNormalizedRows ?? []) {
        normalizedByRawId.set(String(row.raw_entry_id), {
          rawEntryId: String(row.raw_entry_id),
          title: row.title,
          body: row.body,
          summaryShort: cleanNormalizedSummaryShort(
            parseString(row.summary_short),
            row.body,
          ),
        });
      }

      for (const rawEntry of rawEntriesForDay ?? []) {
        const normalized = normalizedByRawId.get(String(rawEntry.id));
        if (!normalized) {
          continue;
        }

        normalizedEntriesForDay.push({
          ...normalized,
          capturedAt: rawEntry.captured_at,
        });
      }
    }

    const dayDraft = await composeDayJournal({
      apiKey: runtimeEnv.openAiApiKey,
      model: runtimeEnv.openAiModel,
      requestId,
      flowId,
      journalDate,
      strictValidation: runtimeEnv.dayJournalStrictValidation,
      softQualityGuards: runtimeEnv.dayJournalSoftQualityGuards,
      normalizedEntries: normalizedEntriesForDay,
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
      rawEntryId: rawEntry.id,
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
      },
    });

    return jsonResponse(request, 200, response);
  } catch (error) {
    logFlow("error", {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: "fatal",
      details: {
        error: error instanceof Error ? error.message : String(error),
        ...(rawEntryId ? { rawEntryId } : {}),
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
