export type PreparedImageAsset = {
  displayBytes: ArrayBuffer;
  thumbBytes: ArrayBuffer;
  displayWidth: number;
  displayHeight: number;
  thumbWidth: number;
  thumbHeight: number;
  displaySizeBytes: number;
  thumbSizeBytes: number;
};

export type PickerUploadAsset = {
  uri?: string | null;
  width: number;
  height: number;
  mimeType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  file?: unknown | null;
};

export type EntryPhotoPrepareStep =
  | "picker_selected"
  | "source_materialize"
  | "source_validate"
  | "display_prepare"
  | "thumb_prepare"
  | "upload_ready";

export type EntryPhotoPrepareCode =
  | "picker_missing_source"
  | "picker_missing_uri"
  | "picker_unsupported_type"
  | "picker_zero_size"
  | "picker_file_read"
  | "display_manipulate"
  | "thumb_manipulate"
  | "display_bytes_missing"
  | "thumb_bytes_missing"
  | "display_bytes"
  | "thumb_bytes";

type BinaryPickerSource = {
  arrayBuffer: () => Promise<ArrayBuffer>;
  size?: number;
  type?: string;
  name?: string;
};

type MaterializedPickerSource = {
  manipulateUri: string;
  cleanup?: (() => void) | null;
};

type ManipulateImageResult = {
  uri: string;
  width: number;
  height: number;
  base64?: string | null;
};

type ManipulateAsync = (
  uri: string,
  actions: { resize: { width: number; height: number } }[],
  saveOptions: { compress: number; format: "jpeg"; base64?: boolean }
) => Promise<ManipulateImageResult>;

type PrepareDependencies = {
  BlobCtor?: typeof Blob;
  createObjectUrl?: (blob: Blob) => string;
  revokeObjectUrl?: (url: string) => void;
  fetchFn?: typeof fetch;
  atobFn?: (value: string) => string;
  btoaFn?: (value: string) => string;
  manipulateAsync?: ManipulateAsync;
  platformOs?: string;
};

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
  "gif",
  "bmp",
]);

export class EntryPhotoPrepareError extends Error {
  readonly step: EntryPhotoPrepareStep;
  readonly code: EntryPhotoPrepareCode;

  constructor(step: EntryPhotoPrepareStep, code: EntryPhotoPrepareCode) {
    super(`${step}:${code}`);
    this.name = "EntryPhotoPrepareError";
    this.step = step;
    this.code = code;
  }
}

export function isBinaryPickerSource(value: unknown): value is BinaryPickerSource {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function";
}

export function getLongEdgeResize(width: number, height: number, maxLongEdge: number) {
  if (width <= 0 || height <= 0) {
    return { width: maxLongEdge, height: maxLongEdge };
  }

  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  const ratio = maxLongEdge / longEdge;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function getPlatformOs(deps?: PrepareDependencies) {
  if (deps?.platformOs) {
    return deps.platformOs;
  }

  return typeof document !== "undefined" || typeof window !== "undefined" ? "web" : "native";
}

function normalizeMimeType(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() ?? "";
  return normalized || null;
}

function mimeFromExtension(value: string) {
  switch (value) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    default:
      return null;
  }
}

function getFileExtension(fileName: string | null | undefined) {
  const normalized = fileName?.trim() ?? "";
  return normalized.split(".").pop()?.toLowerCase() ?? "";
}

function decodeBase64ToArrayBuffer(value: string, deps?: PrepareDependencies) {
  const atobFn = deps?.atobFn ?? globalThis.atob;
  const base64 = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  const normalized = base64.trim();
  if (!normalized) {
    return null;
  }

  const binary = atobFn(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return bytes.buffer;
}

export async function materializeEntryPhotoSource(
  asset: PickerUploadAsset,
  deps?: PrepareDependencies
): Promise<MaterializedPickerSource> {
  const normalizedUri = asset.uri?.trim() ?? "";
  const normalizedMimeType = normalizeMimeType(asset.mimeType);
  const extension = getFileExtension(asset.fileName);
  const hasSupportedExtension = SUPPORTED_IMAGE_EXTENSIONS.has(extension);
  const binarySource = isBinaryPickerSource(asset.file) ? asset.file : null;
  const binarySize =
    typeof asset.fileSize === "number"
      ? asset.fileSize
      : typeof binarySource?.size === "number"
        ? binarySource.size
        : null;

  if (normalizedMimeType && !normalizedMimeType.startsWith("image/") && !hasSupportedExtension) {
    throw new EntryPhotoPrepareError("source_validate", "picker_unsupported_type");
  }

  if (!normalizedMimeType && !hasSupportedExtension && !binarySource && !normalizedUri.startsWith("data:")) {
    throw new EntryPhotoPrepareError("source_validate", "picker_unsupported_type");
  }

  if (typeof binarySize === "number" && binarySize === 0) {
    throw new EntryPhotoPrepareError("source_validate", "picker_zero_size");
  }

  if (getPlatformOs(deps) === "web") {
    if (binarySource) {
      let bytes: ArrayBuffer;
      try {
        bytes = await binarySource.arrayBuffer();
      } catch {
        throw new EntryPhotoPrepareError("source_materialize", "picker_file_read");
      }

      if (bytes.byteLength === 0) {
        throw new EntryPhotoPrepareError("source_validate", "picker_zero_size");
      }

      const sourceMimeType =
        normalizedMimeType ||
        normalizeMimeType(binarySource.type) ||
        mimeFromExtension(extension) ||
        "image/jpeg";

      if (!sourceMimeType.startsWith("image/")) {
        throw new EntryPhotoPrepareError("source_validate", "picker_unsupported_type");
      }

      const BlobCtor = deps?.BlobCtor ?? globalThis.Blob;
      const createObjectUrl = deps?.createObjectUrl ?? globalThis.URL.createObjectURL;
      const revokeObjectUrl = deps?.revokeObjectUrl ?? globalThis.URL.revokeObjectURL;
      const objectUrl = createObjectUrl(new BlobCtor([bytes], { type: sourceMimeType }));

      return {
        manipulateUri: objectUrl,
        cleanup: () => revokeObjectUrl(objectUrl),
      };
    }

    if (normalizedUri.startsWith("data:")) {
      return { manipulateUri: normalizedUri, cleanup: null };
    }

    if (!normalizedUri) {
      throw new EntryPhotoPrepareError("source_materialize", "picker_missing_source");
    }

    throw new EntryPhotoPrepareError("source_materialize", "picker_file_read");
  }

  if (!normalizedUri) {
    throw new EntryPhotoPrepareError("source_materialize", "picker_missing_uri");
  }

  return { manipulateUri: normalizedUri, cleanup: null };
}

async function readManipulatedBytes(
  result: ManipulateImageResult,
  input: {
    step: EntryPhotoPrepareStep;
    missingCode: EntryPhotoPrepareCode;
    readCode: EntryPhotoPrepareCode;
  },
  deps?: PrepareDependencies
) {
  if (getPlatformOs(deps) === "web" && typeof result.base64 === "string" && result.base64.trim()) {
    const bytes = decodeBase64ToArrayBuffer(result.base64, deps);
    if (bytes) {
      return bytes;
    }
  }

  if (getPlatformOs(deps) === "web" && typeof result.uri === "string" && result.uri.startsWith("data:")) {
    const bytes = decodeBase64ToArrayBuffer(result.uri, deps);
    if (bytes) {
      return bytes;
    }
  }

  if (!result.uri?.trim()) {
    throw new EntryPhotoPrepareError(input.step, input.missingCode);
  }

  try {
    const fetchFn = deps?.fetchFn ?? fetch;
    const response = await fetchFn(result.uri);
    if (!response.ok) {
      throw new Error("fetch_failed");
    }
    return response.arrayBuffer();
  } catch {
    throw new EntryPhotoPrepareError(input.step, input.readCode);
  }
}

export async function buildPreparedImageAsset(
  asset: PickerUploadAsset,
  deps?: PrepareDependencies
): Promise<PreparedImageAsset> {
  const displayResize = getLongEdgeResize(asset.width, asset.height, 1600);
  const thumbResize = getLongEdgeResize(asset.width, asset.height, 560);
  const useWebBase64 = getPlatformOs(deps) === "web";
  const manipulateAsync: ManipulateAsync =
    deps?.manipulateAsync ??
    ((await import("expo-image-manipulator")).manipulateAsync as unknown as ManipulateAsync);
  const source = await materializeEntryPhotoSource(asset, deps);

  try {
    const saveOptions = {
      compress: 0.8,
      format: "jpeg" as const,
      ...(useWebBase64 ? { base64: true } : {}),
    };
    const thumbSaveOptions = {
      compress: 0.75,
      format: "jpeg" as const,
      ...(useWebBase64 ? { base64: true } : {}),
    };

    let display: ManipulateImageResult;
    try {
      display = await manipulateAsync(source.manipulateUri, [{ resize: displayResize }], saveOptions);
    } catch {
      throw new EntryPhotoPrepareError("display_prepare", "display_manipulate");
    }

    let thumb: ManipulateImageResult;
    try {
      thumb = await manipulateAsync(source.manipulateUri, [{ resize: thumbResize }], thumbSaveOptions);
    } catch {
      throw new EntryPhotoPrepareError("thumb_prepare", "thumb_manipulate");
    }

    const displayBytes = await readManipulatedBytes(
      display,
      {
        step: "display_prepare",
        missingCode: "display_bytes_missing",
        readCode: "display_bytes",
      },
      deps
    );
    const thumbBytes = await readManipulatedBytes(
      thumb,
      {
        step: "thumb_prepare",
        missingCode: "thumb_bytes_missing",
        readCode: "thumb_bytes",
      },
      deps
    );

    return {
      displayBytes,
      thumbBytes,
      displayWidth: display.width,
      displayHeight: display.height,
      thumbWidth: thumb.width,
      thumbHeight: thumb.height,
      displaySizeBytes: displayBytes.byteLength,
      thumbSizeBytes: thumbBytes.byteLength,
    };
  } finally {
    source.cleanup?.();
  }
}
