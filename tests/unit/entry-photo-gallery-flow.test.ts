import { describe, expect, it } from "vitest";

import {
  buildEntryPhotoPreviewSlots,
  createEntryPhotoPhaseError,
  describeEntryPhotoError,
  getEntryPhotoErrorDiagnostics,
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
        prepareStep: "display_bytes",
      }
    );

    const diagnostics = getEntryPhotoErrorDiagnostics(error);
    expect(diagnostics.rawEntryId).toBe("raw-prepare");
    expect(diagnostics.pickerUriScheme).toBe("blob");
    expect(diagnostics.pickerMimeType).toBe("image/jpeg");
    expect(diagnostics.pickerFileName).toBe("picked.jpg");
    expect(diagnostics.pickerFileSize).toBe(12345);
    expect(diagnostics.pickerHasFile).toBe(true);
    expect(diagnostics.prepareStep).toBe("display_bytes");
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
