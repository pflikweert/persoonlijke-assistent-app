import { describe, expect, it } from "vitest";

import {
  buildEntryPhotoPickerDiagnostics,
  buildEntryPhotoPreviewSlots,
  classifyEntryPhotoPickerSource,
  classifyEntryPhotoPrepareStep,
  createEntryPhotoPhaseError,
  describeEntryPhotoError,
  getEntryPhotoErrorDiagnostics,
  getEntryPhotoFileExtension,
  getEntryPhotoFileSizeBucket,
  getEntryPhotoUriScheme,
} from "@/src/lib/entry-photo-gallery/flow";

describe("entry photo gallery flow helpers", () => {
  it("builds preview slots with a moving placeholder at the target position", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];

    const preview = buildEntryPhotoPreviewSlots(items, "c", 0);

    expect(preview.map((slot) => slot.item.id)).toEqual(["c", "a", "b", "d"]);
    expect(preview.map((slot) => slot.isPlaceholder)).toEqual([true, false, false, false]);
  });

  it("falls back to normal slots when no valid drag is active", () => {
    const items = [{ id: "a" }, { id: "b" }];

    expect(buildEntryPhotoPreviewSlots(items, null, null).map((slot) => slot.isPlaceholder)).toEqual([
      false,
      false,
    ]);
    expect(buildEntryPhotoPreviewSlots(items, "missing", 1).map((slot) => slot.item.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("wraps phase errors with a machine-readable prefix", () => {
    const error = createEntryPhotoPhaseError(
      "upload_prepare",
      new Error("canvas decode failed"),
      "Foto voorbereiden mislukte.",
      { flowId: "entry-photo-test-flow" }
    );

    expect(error.message).toBe("[entry-photo:upload_prepare] canvas decode failed");
    expect(getEntryPhotoErrorDiagnostics(error).flowId).toBe("entry-photo-test-flow");
  });

  it("classifies retryable reorder mismatch errors", () => {
    const detail = describeEntryPhotoError(
      new Error("[entry-photo:reorder_persist] fotovolgorde komt niet overeen met bestaande fotos"),
      "Nieuwe volgorde opslaan mislukte."
    );

    expect(detail.retryableReorderMismatch).toBe(true);
    expect(detail.detail).toContain("Nieuwe volgorde opslaan mislukte.");
  });

  it("preserves classified detail for non-retryable errors", () => {
    const detail = describeEntryPhotoError(
      new Error("[entry-photo:upload_display] storage timeout"),
      "Foto uploaden mislukte."
    );

    expect(detail.retryableReorderMismatch).toBe(false);
    expect(detail.detail).toBe("Displayversie uploaden mislukte. storage timeout");
  });

  it("preserves prepare diagnostics for picker-backed upload errors", () => {
    const error = createEntryPhotoPhaseError(
      "upload_prepare",
      new Error("display_bytes:Failed to fetch"),
      "Foto voorbereiden mislukte.",
      {
        rawEntryId: "raw-prepare",
        pickerUri: "blob:https://assistant.budio.nl/example",
        pickerUriScheme: "blob",
        pickerMimeType: "image/jpeg",
        pickerFileName: "picked.jpg",
        pickerFileSize: 12345,
        pickerHasFile: true,
        pickerFileExtension: "jpg",
        pickerFileSizeBucket: "1b-64kb",
        pickerSourceKind: "file_like",
        prepareStep: "display_bytes",
        runtimePlatform: "web",
        runtimeOs: "android",
        runtimeBrowser: "chrome",
        runtimeBrowserMajor: "135",
        hasServiceWorkerController: true,
      }
    );

    const diagnostics = getEntryPhotoErrorDiagnostics(error);
    expect(diagnostics.rawEntryId).toBe("raw-prepare");
    expect(diagnostics.pickerUriScheme).toBe("blob");
    expect(diagnostics.pickerMimeType).toBe("image/jpeg");
    expect(diagnostics.pickerFileName).toBe("picked.jpg");
    expect(diagnostics.pickerFileSize).toBe(12345);
    expect(diagnostics.pickerHasFile).toBe(true);
    expect(diagnostics.pickerFileExtension).toBe("jpg");
    expect(diagnostics.pickerFileSizeBucket).toBe("1b-64kb");
    expect(diagnostics.pickerSourceKind).toBe("file_like");
    expect(diagnostics.prepareStep).toBe("display_bytes");
    expect(diagnostics.runtimePlatform).toBe("web");
    expect(diagnostics.runtimeOs).toBe("android");
    expect(diagnostics.runtimeBrowser).toBe("chrome");
    expect(diagnostics.runtimeBrowserMajor).toBe("135");
    expect(diagnostics.hasServiceWorkerController).toBe(true);
  });

  it("extracts picker diagnostics for blob-backed Android web assets", () => {
    const fileLike = {
      name: "picked.webp",
      size: 640000,
      type: "image/webp",
      arrayBuffer: async () => new ArrayBuffer(8),
    };

    expect(classifyEntryPhotoPickerSource({ file: fileLike, uri: "blob:https://assistent.budio.nl/example" })).toBe(
      "file_like"
    );
    expect(getEntryPhotoUriScheme("blob:https://assistent.budio.nl/example")).toBe("blob");
    expect(getEntryPhotoFileExtension("picked.webp")).toBe("webp");
    expect(getEntryPhotoFileSizeBucket(640000)).toBe("513kb-2mb");
    expect(
      buildEntryPhotoPickerDiagnostics({
        file: fileLike,
        uri: "blob:https://assistent.budio.nl/example",
        fileName: "picked.webp",
        fileSize: 640000,
      })
    ).toEqual({
      pickerUriScheme: "blob",
      pickerFileExtension: "webp",
      pickerFileSizeBucket: "513kb-2mb",
      pickerSourceKind: "file_like",
    });
  });

  it("classifies uri-only and missing picker sources", () => {
    expect(classifyEntryPhotoPickerSource({ file: null, uri: "content://picked-image" })).toBe(
      "uri_only"
    );
    expect(classifyEntryPhotoPickerSource({ file: null, uri: "" })).toBe("missing");
  });

  it("classifies explicit prepare validation and bytes steps", () => {
    expect(classifyEntryPhotoPrepareStep(new Error("picker_zero_size:Gekozen fotobestand is leeg."))).toBe(
      "picker_zero_size"
    );
    expect(classifyEntryPhotoPrepareStep(new Error("picker_unsupported_type:Afbeeldingstype ontbreekt."))).toBe(
      "picker_unsupported_type"
    );
    expect(classifyEntryPhotoPrepareStep(new Error("display_bytes:Failed to fetch"))).toBe(
      "display_bytes"
    );
    expect(classifyEntryPhotoPrepareStep(new Error("iets anders"))).toBeNull();
  });

  it("buckets zero-size and missing file metadata safely", () => {
    expect(getEntryPhotoFileSizeBucket(0)).toBe("0b");
    expect(getEntryPhotoFileSizeBucket(null)).toBeNull();
    expect(getEntryPhotoFileExtension("no-extension")).toBeNull();
    expect(getEntryPhotoUriScheme("")).toBeNull();
  });

  it("preserves diagnostic metadata for reorder errors", () => {
    const error = createEntryPhotoPhaseError(
      "reorder_persist",
      {
        code: "23505",
        message: "duplicate key value violates unique constraint",
        details: "Key (raw_entry_id, sort_order) already exists.",
        hint: null,
      },
      "Nieuwe volgorde opslaan mislukte.",
      {
        flowId: "entry-photo-123",
        rawEntryId: "raw-1",
        orderedPhotoIds: ["b", "a", "c"],
      }
    );

    const diagnostics = getEntryPhotoErrorDiagnostics(error);
    expect(diagnostics.flowId).toBe("entry-photo-123");
    expect(diagnostics.rawEntryId).toBe("raw-1");
    expect(diagnostics.orderedPhotoIds).toEqual(["b", "a", "c"]);
    expect(diagnostics.supabaseCode).toBe("23505");
    expect(diagnostics.supabaseDetails).toContain("sort_order");
  });
});
