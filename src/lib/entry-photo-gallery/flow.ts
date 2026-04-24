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
  supabaseCode?: string | null;
  supabaseMessage?: string | null;
  supabaseDetails?: string | null;
  supabaseHint?: string | null;
};

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
