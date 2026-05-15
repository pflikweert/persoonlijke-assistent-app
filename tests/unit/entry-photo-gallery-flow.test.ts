import { describe, expect, it } from "vitest";

import {
  buildEntryPhotoPickerDiagnostics,
  buildEntryPhotoPreviewSlots,
  classifyEntryPhotoPickerSource,
  classifyEntryPhotoPrepareCode,
  classifyEntryPhotoPrepareStep,
  createEntryPhotoPhaseError,
  describeEntryPhotoError,
  getEntryPhotoErrorDiagnostics,
  getEntryPhotoFileExtension,
  getEntryPhotoFileSizeBucket,
  getEntryPhotoUriScheme,
} from "@/src/lib/entry-photo-gallery/flow";
import {
  EntryPhotoPrepareError,
  buildPreparedImageAsset,
  materializeEntryPhotoSource,
} from "@/src/lib/entry-photo-gallery/prepare";

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
        prepareStep: "display_prepare",
        prepareCode: "display_bytes",
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
    expect(diagnostics.prepareStep).toBe("display_prepare");
    expect(diagnostics.prepareCode).toBe("display_bytes");
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
    expect(classifyEntryPhotoPrepareStep(new EntryPhotoPrepareError("source_validate", "picker_zero_size"))).toBe(
      "source_validate"
    );
    expect(classifyEntryPhotoPrepareCode(new EntryPhotoPrepareError("source_validate", "picker_zero_size"))).toBe(
      "picker_zero_size"
    );
    expect(classifyEntryPhotoPrepareStep(new EntryPhotoPrepareError("display_prepare", "display_bytes"))).toBe(
      "display_prepare"
    );
    expect(classifyEntryPhotoPrepareCode(new EntryPhotoPrepareError("display_prepare", "display_bytes"))).toBe(
      "display_bytes"
    );
    expect(classifyEntryPhotoPrepareStep(new Error("iets anders"))).toBeNull();
    expect(classifyEntryPhotoPrepareCode(new Error("iets anders"))).toBeNull();
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

  it("materializes file-like web sources before prepare continues", async () => {
    const bytes = Uint8Array.from([1, 2, 3, 4]).buffer;
    let arrayBufferCalls = 0;
    let revokedUrl = "";
    const prepared = await buildPreparedImageAsset(
      {
        uri: null,
        width: 1200,
        height: 800,
        mimeType: "image/jpeg",
        fileName: "picked.jpg",
        fileSize: 4,
        file: {
          name: "picked.jpg",
          size: 4,
          type: "image/jpeg",
          arrayBuffer: async () => {
            arrayBufferCalls += 1;
            return bytes;
          },
        },
      },
      {
        platformOs: "web",
        createObjectUrl: () => "blob:stable-source",
        revokeObjectUrl: (url) => {
          revokedUrl = url;
        },
        manipulateAsync: async (uri) => {
          expect(uri).toBe("blob:stable-source");
          return {
            uri: "data:image/jpeg;base64,QUJD",
            width: 320,
            height: 240,
            base64: "QUJD",
          } as any;
        },
      }
    );

    expect(arrayBufferCalls).toBe(1);
    expect(revokedUrl).toBe("blob:stable-source");
    expect(prepared.displaySizeBytes).toBe(3);
    expect(prepared.thumbSizeBytes).toBe(3);
  });

  it("materializes blob-like web sources with arrayBuffer", async () => {
    const source = await materializeEntryPhotoSource(
      {
        uri: null,
        width: 1,
        height: 1,
        mimeType: "image/webp",
        fileName: "picked.webp",
        fileSize: 8,
        file: {
          size: 8,
          type: "image/webp",
          arrayBuffer: async () => Uint8Array.from([5, 6, 7, 8]).buffer,
        },
      },
      {
        platformOs: "web",
        createObjectUrl: () => "blob:from-bytes",
        revokeObjectUrl: () => {},
      }
    );

    expect(source.manipulateUri).toBe("blob:from-bytes");
  });

  it("fails uri-only web assets with picker_file_read", async () => {
    await expect(
      materializeEntryPhotoSource(
        {
          uri: "content://picked-image",
          width: 1,
          height: 1,
          mimeType: "image/jpeg",
          fileName: "picked.jpg",
          fileSize: 32,
          file: null,
        },
        { platformOs: "web" }
      )
    ).rejects.toMatchObject({
      step: "source_materialize",
      code: "picker_file_read",
    });
  });

  it("fails zero-size assets before manipulation starts", async () => {
    await expect(
      materializeEntryPhotoSource(
        {
          uri: null,
          width: 1,
          height: 1,
          mimeType: "image/jpeg",
          fileName: "picked.jpg",
          fileSize: 0,
          file: {
            name: "picked.jpg",
            size: 0,
            type: "image/jpeg",
            arrayBuffer: async () => new ArrayBuffer(0),
          },
        },
        { platformOs: "web" }
      )
    ).rejects.toMatchObject({
      step: "source_validate",
      code: "picker_zero_size",
    });
  });

  it("fails unsupported mime types before manipulation starts", async () => {
    await expect(
      materializeEntryPhotoSource(
        {
          uri: null,
          width: 1,
          height: 1,
          mimeType: "application/pdf",
          fileName: "picked.pdf",
          fileSize: 128,
          file: {
            name: "picked.pdf",
            size: 128,
            type: "application/pdf",
            arrayBuffer: async () => Uint8Array.from([1]).buffer,
          },
        },
        { platformOs: "web" }
      )
    ).rejects.toMatchObject({
      step: "source_validate",
      code: "picker_unsupported_type",
    });
  });

  it("maps picker read failures to quiet user-facing copy", () => {
    const detail = describeEntryPhotoError(
      createEntryPhotoPhaseError(
        "upload_prepare",
        new EntryPhotoPrepareError("source_materialize", "picker_file_read"),
        "Foto voorbereiden mislukte.",
        {
          prepareStep: "source_materialize",
          prepareCode: "picker_file_read",
        }
      ),
      "Foto voorbereiden mislukte."
    );

    expect(detail.detail).toBe(
      "Foto voorbereiden mislukte. Kies de foto opnieuw of download hem eerst naar je toestel."
    );
  });
});
