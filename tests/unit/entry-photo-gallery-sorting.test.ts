import { describe, expect, it } from "vitest";

import {
  clampGalleryIndex,
  getGalleryDragLeft,
  getGalleryDragTargetIndex,
  reorderGalleryItems,
} from "@/src/lib/entry-photo-gallery/sorting";

describe("entry photo gallery sorting helpers", () => {
  it("clamps target indexes into the gallery range", () => {
    expect(clampGalleryIndex(-3, 5)).toBe(0);
    expect(clampGalleryIndex(0, 5)).toBe(0);
    expect(clampGalleryIndex(3, 5)).toBe(3);
    expect(clampGalleryIndex(8, 5)).toBe(4);
    expect(clampGalleryIndex(8, 0)).toBe(0);
  });

  it("keeps the same array reference for no-op or invalid reorders", () => {
    const items = ["a", "b", "c"];

    expect(reorderGalleryItems(items, 1, 1)).toBe(items);
    expect(reorderGalleryItems(items, -1, 1)).toBe(items);
    expect(reorderGalleryItems(items, 3, 1)).toBe(items);
  });

  it("moves an item to the left", () => {
    expect(reorderGalleryItems(["a", "b", "c", "d"], 2, 0)).toEqual([
      "c",
      "a",
      "b",
      "d",
    ]);
  });

  it("moves an item to the right", () => {
    expect(reorderGalleryItems(["a", "b", "c", "d"], 0, 3)).toEqual([
      "b",
      "c",
      "d",
      "a",
    ]);
  });

  it("clamps out-of-range reorder targets", () => {
    expect(reorderGalleryItems(["a", "b", "c"], 0, 99)).toEqual([
      "b",
      "c",
      "a",
    ]);
    expect(reorderGalleryItems(["a", "b", "c"], 2, -99)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("calculates a bounded drag left position", () => {
    const input = {
      originLeft: 100,
      pointerStartPageX: 300,
      itemCount: 5,
      slotWidth: 92,
    };

    expect(getGalleryDragLeft({ ...input, pointerPageX: 250 })).toBe(50);
    expect(getGalleryDragLeft({ ...input, pointerPageX: -1000 })).toBe(0);
    expect(getGalleryDragLeft({ ...input, pointerPageX: 1000 })).toBe(368);
  });

  it("switches target after crossing the halfway point of a slot", () => {
    const slotWidth = 92;

    expect(
      getGalleryDragTargetIndex({ dragLeft: 45, itemCount: 5, slotWidth })
    ).toBe(0);
    expect(
      getGalleryDragTargetIndex({ dragLeft: 47, itemCount: 5, slotWidth })
    ).toBe(1);
    expect(
      getGalleryDragTargetIndex({ dragLeft: 92 * 2 + 45, itemCount: 5, slotWidth })
    ).toBe(2);
    expect(
      getGalleryDragTargetIndex({ dragLeft: 92 * 2 + 47, itemCount: 5, slotWidth })
    ).toBe(3);
  });

  it("clamps drag targets beyond gallery bounds", () => {
    expect(
      getGalleryDragTargetIndex({ dragLeft: -50, itemCount: 3, slotWidth: 92 })
    ).toBe(0);
    expect(
      getGalleryDragTargetIndex({ dragLeft: 999, itemCount: 3, slotWidth: 92 })
    ).toBe(2);
  });
});
