import { reorderGalleryItems } from "./sorting";

export type EntryPhotoPhase =
  | "upload_prepare"
  | "upload_display"
  | "upload_thumb"
  | "upload_insert"
  | "upload_post_refresh"
  | "delete_post_refresh"
  | "reorder_persist"
  | "reorder_retry_refetch"
  | "reorder_retry_persist"
  | "reorder_post_refresh";

export type EntryPhotoPreviewSlot<T> = {
  item: T;
  isPlaceholder: boolean;
};

export type EntryPhotoErrorDiagnostics = {
  flowId?: string;
  rawEntryId?: string;
  orderedPhotoIds?: string[];
  previousOrder?: string[];
  nextOrder?: string[];
  originIndex?: number | null;
  targetIndex?: number | null;
  pickerUri?: string | null;
  pickerUriScheme?: string | null;
  pickerMimeType?: string | null;
  pickerFileName?: string | null;
  pickerFileSize?: number | null;
  pickerHasFile?: boolean | null;
  pickerFileExtension?: string | null;
  pickerFileSizeBucket?: string | null;
  pickerSourceKind?: string | null;
  prepareStep?: string | null;
  runtimePlatform?: string | null;
  runtimeOs?: string | null;
  runtimeBrowser?: string | null;
  runtimeBrowserMajor?: string | null;
  hasServiceWorkerController?: boolean | null;
  supabaseCode?: string | null;
  supabaseMessage?: string | null;
  supabaseDetails?: string | null;
  supabaseHint?: string | null;
};

export type EntryPhotoRuntimeDiagnostics = Pick<
  EntryPhotoErrorDiagnostics,
  | "runtimePlatform"
  | "runtimeOs"
  | "runtimeBrowser"
  | "runtimeBrowserMajor"
  | "hasServiceWorkerController"
>;

export type EntryPhotoPickerDiagnostics = Pick<
  EntryPhotoErrorDiagnostics,
  | "pickerUriScheme"
  | "pickerFileExtension"
  | "pickerFileSizeBucket"
  | "pickerSourceKind"
>;

export class EntryPhotoDiagnosticError extends Error {
  readonly phase: EntryPhotoPhase;
  readonly diagnostics: EntryPhotoErrorDiagnostics;

  constructor(
    phase: EntryPhotoPhase,
    message: string,
    diagnostics: EntryPhotoErrorDiagnostics = {}
  ) {
    super(message);
    this.name = "EntryPhotoDiagnosticError";
    this.phase = phase;
    this.diagnostics = diagnostics;
  }
}

const PHASE_PREFIX = /^\[entry-photo:([a-z_]+)\]\s*/i;

const PHASE_LABELS: Record<EntryPhotoPhase, string> = {
  upload_prepare: "Foto voorbereiden mislukte.",
  upload_display: "Displayversie uploaden mislukte.",
  upload_thumb: "Thumbnail uploaden mislukte.",
  upload_insert: "Foto opslaan in database mislukte.",
  upload_post_refresh: "Nieuwe foto's ophalen na upload mislukte.",
  delete_post_refresh: "Nieuwe fotolijst ophalen na verwijderen mislukte.",
  reorder_persist: "Nieuwe volgorde opslaan mislukte.",
  reorder_retry_refetch: "Huidige fotolijst ophalen voor herstel mislukte.",
  reorder_retry_persist: "Volgorde opnieuw opslaan na herstel mislukte.",
  reorder_post_refresh: "Nieuwe fotovolgorde ophalen na opslaan mislukte.",
};

const RETRYABLE_REORDER_PATTERNS = [
  "fotovolgorde komt niet overeen",
  "fotovolgorde bevat onbekende",
];

const KNOWN_PREPARE_STEPS = new Set([
  "picker_missing_source",
  "picker_missing_uri",
  "picker_unsupported_type",
  "picker_zero_size",
  "picker_file_read",
  "display_manipulate",
  "thumb_manipulate",
  "display_bytes_missing",
  "thumb_bytes_missing",
  "display_bytes",
  "thumb_bytes",
]);

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message.trim();
  }
  if (typeof error === "string") {
    return error.trim();
  }
  return "";
}

function extractSupabaseDiagnostics(error: unknown): EntryPhotoErrorDiagnostics {
  if (!error || typeof error !== "object") {
    return {};
  }

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    details?: unknown;
    hint?: unknown;
  };

  return {
    supabaseCode: typeof candidate.code === "string" ? candidate.code : null,
    supabaseMessage: typeof candidate.message === "string" ? candidate.message : null,
    supabaseDetails: typeof candidate.details === "string" ? candidate.details : null,
    supabaseHint: typeof candidate.hint === "string" ? candidate.hint : null,
  };
}

export function getEntryPhotoErrorDiagnostics(error: unknown): EntryPhotoErrorDiagnostics {
  if (error instanceof EntryPhotoDiagnosticError) {
    return error.diagnostics;
  }

  return extractSupabaseDiagnostics(error);
}

export function getEntryPhotoUriScheme(uri: string | null | undefined): string | null {
  const normalized = (uri ?? "").trim();
  if (!normalized) {
    return null;
  }

  const match = normalized.match(/^([a-z0-9.+-]+):/i);
  return match?.[1]?.toLowerCase() ?? null;
}

export function getEntryPhotoFileExtension(fileName: string | null | undefined): string | null {
  const normalized = (fileName ?? "").trim();
  if (!normalized.includes(".")) {
    return null;
  }

  const extension = normalized.split(".").pop()?.trim().toLowerCase() ?? "";
  return extension || null;
}

export function getEntryPhotoFileSizeBucket(fileSize: number | null | undefined): string | null {
  if (typeof fileSize !== "number" || !Number.isFinite(fileSize) || fileSize < 0) {
    return null;
  }
  if (fileSize === 0) {
    return "0b";
  }
  if (fileSize <= 64 * 1024) {
    return "1b-64kb";
  }
  if (fileSize <= 512 * 1024) {
    return "65kb-512kb";
  }
  if (fileSize <= 2 * 1024 * 1024) {
    return "513kb-2mb";
  }
  if (fileSize <= 5 * 1024 * 1024) {
    return "2mb-5mb";
  }
  return "5mb+";
}

export function classifyEntryPhotoPickerSource(input: {
  file: unknown;
  uri?: string | null;
}): string {
  const candidate = input.file;
  if (candidate && typeof candidate === "object") {
    const record = candidate as {
      arrayBuffer?: unknown;
      slice?: unknown;
      size?: unknown;
      type?: unknown;
      name?: unknown;
    };

    const hasBinaryInterface =
      typeof record.arrayBuffer === "function" || typeof record.slice === "function";
    if (hasBinaryInterface && typeof record.name === "string") {
      return "file_like";
    }
    if (hasBinaryInterface || typeof record.size === "number" || typeof record.type === "string") {
      return "blob_like";
    }
  }

  return (input.uri ?? "").trim() ? "uri_only" : "missing";
}

export function classifyEntryPhotoPrepareStep(error: unknown): string | null {
  const message = errorMessage(error);
  if (!message) {
    return null;
  }

  const candidate = message.split(":")[0]?.trim().toLowerCase() ?? "";
  return KNOWN_PREPARE_STEPS.has(candidate) ? candidate : null;
}

export function getEntryPhotoRuntimeDiagnostics(): EntryPhotoRuntimeDiagnostics {
  const nav =
    typeof navigator !== "undefined" && navigator && typeof navigator === "object"
      ? navigator
      : null;
  const userAgent = nav?.userAgent ?? "";
  const ua = userAgent.toLowerCase();

  let runtimeOs: string | null = null;
  if (ua.includes("android")) {
    runtimeOs = "android";
  } else if (/(iphone|ipad|ipod)/.test(ua)) {
    runtimeOs = "ios";
  } else if (ua.includes("mac os x") || ua.includes("macintosh")) {
    runtimeOs = "macos";
  } else if (ua.includes("windows")) {
    runtimeOs = "windows";
  } else if (ua.includes("cros")) {
    runtimeOs = "chromeos";
  } else if (ua.includes("linux")) {
    runtimeOs = "linux";
  }

  let runtimeBrowser: string | null = null;
  let runtimeBrowserMajor: string | null = null;
  const browserMatchers: [string, RegExp][] = [
    ["edge", /edg\/(\d+)/i],
    ["chrome", /chrome\/(\d+)/i],
    ["firefox", /firefox\/(\d+)/i],
    ["safari", /version\/(\d+).+safari/i],
  ];
  for (const [name, pattern] of browserMatchers) {
    const match = userAgent.match(pattern);
    if (match) {
      runtimeBrowser = name;
      runtimeBrowserMajor = match[1] ?? null;
      break;
    }
  }

  const hasServiceWorkerController =
    typeof navigator !== "undefined" &&
    !!navigator.serviceWorker &&
    !!navigator.serviceWorker.controller;

  return {
    runtimePlatform:
      typeof document !== "undefined" || typeof window !== "undefined" ? "web" : null,
    runtimeOs,
    runtimeBrowser,
    runtimeBrowserMajor,
    hasServiceWorkerController,
  };
}

export function buildEntryPhotoPickerDiagnostics(input: {
  file: unknown;
  uri?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
}): EntryPhotoPickerDiagnostics {
  return {
    pickerUriScheme: getEntryPhotoUriScheme(input.uri),
    pickerFileExtension: getEntryPhotoFileExtension(input.fileName),
    pickerFileSizeBucket: getEntryPhotoFileSizeBucket(input.fileSize),
    pickerSourceKind: classifyEntryPhotoPickerSource(input),
  };
}

export function createEntryPhotoPhaseError(
  phase: EntryPhotoPhase,
  error: unknown,
  fallbackDetail: string,
  diagnostics: EntryPhotoErrorDiagnostics = {}
): Error {
  const detail = errorMessage(error) || fallbackDetail;
  return new EntryPhotoDiagnosticError(phase, `[entry-photo:${phase}] ${detail}`, {
    ...extractSupabaseDiagnostics(error),
    ...getEntryPhotoErrorDiagnostics(error),
    ...diagnostics,
  });
}

export function describeEntryPhotoError(
  error: unknown,
  fallbackMessage: string
): {
  phase: EntryPhotoPhase | null;
  detail: string;
  retryableReorderMismatch: boolean;
  diagnostics: EntryPhotoErrorDiagnostics;
} {
  const rawMessage = errorMessage(error);
  const match = rawMessage.match(PHASE_PREFIX);
  const phase = (match?.[1] ?? null) as EntryPhotoPhase | null;
  const stripped = match ? rawMessage.replace(PHASE_PREFIX, "").trim() : rawMessage;
  const label = phase ? PHASE_LABELS[phase] : fallbackMessage;
  const suffix = stripped && stripped !== label ? ` ${stripped}` : "";

  return {
    phase,
    detail: `${label}${suffix}`.trim(),
    retryableReorderMismatch:
      phase === "reorder_persist" &&
      RETRYABLE_REORDER_PATTERNS.some((pattern) =>
        stripped.toLowerCase().includes(pattern)
      ),
    diagnostics: getEntryPhotoErrorDiagnostics(error),
  };
}

export function buildEntryPhotoPreviewSlots<T extends { id: string }>(
  items: T[],
  draggingPhotoId: string | null,
  targetIndex: number | null
): EntryPhotoPreviewSlot<T>[] {
  if (!draggingPhotoId || targetIndex === null) {
    return items.map((item) => ({ item, isPlaceholder: false }));
  }

  const dragIndex = items.findIndex((item) => item.id === draggingPhotoId);
  if (dragIndex < 0) {
    return items.map((item) => ({ item, isPlaceholder: false }));
  }

  const reordered = reorderGalleryItems(items, dragIndex, targetIndex);
  return reordered.map((item) => ({
    item,
    isPlaceholder: item.id === draggingPhotoId,
  }));
}
