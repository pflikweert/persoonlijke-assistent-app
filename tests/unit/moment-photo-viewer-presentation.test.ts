import { describe, expect, it } from "vitest";

import {
  createIdleDesktopPhotoDragState,
  getDesktopPhotoDragDecision,
  getMomentPhotoViewerSwipeState,
  getZoomablePhotoTouchAction,
} from "@/src/lib/moment-photo-viewer/presentation";

describe("getMomentPhotoViewerSwipeState", () => {
  it("disables swipe affordance for a single photo", () => {
    expect(getMomentPhotoViewerSwipeState({ photoCount: 1, viewerIndex: 0 })).toEqual({
      hasSwipe: false,
      safeIndex: 0,
      canGoLeft: false,
      canGoRight: false,
    });
  });

  it("enables only the right direction on the first photo", () => {
    expect(getMomentPhotoViewerSwipeState({ photoCount: 3, viewerIndex: 0 })).toEqual({
      hasSwipe: true,
      safeIndex: 0,
      canGoLeft: false,
      canGoRight: true,
    });
  });

  it("clamps a null or out-of-range viewer index", () => {
    expect(getMomentPhotoViewerSwipeState({ photoCount: 3, viewerIndex: null })).toEqual({
      hasSwipe: true,
      safeIndex: 0,
      canGoLeft: false,
      canGoRight: true,
    });
    expect(getMomentPhotoViewerSwipeState({ photoCount: 3, viewerIndex: 99 })).toEqual({
      hasSwipe: true,
      safeIndex: 2,
      canGoLeft: true,
      canGoRight: false,
    });
  });
});

describe("getZoomablePhotoTouchAction", () => {
  it("keeps web swiping available until zoom is active", () => {
    expect(getZoomablePhotoTouchAction({ isWeb: true, isZoomed: false })).toBe("pan-y");
    expect(getZoomablePhotoTouchAction({ isWeb: true, isZoomed: true })).toBe("none");
  });

  it("does not set touch action on native platforms", () => {
    expect(getZoomablePhotoTouchAction({ isWeb: false, isZoomed: false })).toBeUndefined();
  });
});

describe("getDesktopPhotoDragDecision", () => {
  it("does not navigate when horizontal movement stays under the threshold", () => {
    expect(
      getDesktopPhotoDragDecision({
        isZoomed: false,
        startX: 100,
        startY: 100,
        currentX: 145,
        currentY: 108,
      })
    ).toBe("none");
  });

  it("navigates to the next photo on a strong left drag", () => {
    expect(
      getDesktopPhotoDragDecision({
        isZoomed: false,
        startX: 300,
        startY: 120,
        currentX: 220,
        currentY: 126,
      })
    ).toBe("next");
  });

  it("navigates to the previous photo on a strong right drag", () => {
    expect(
      getDesktopPhotoDragDecision({
        isZoomed: false,
        startX: 200,
        startY: 120,
        currentX: 276,
        currentY: 124,
      })
    ).toBe("previous");
  });

  it("cancels nearly vertical drags instead of navigating", () => {
    expect(
      getDesktopPhotoDragDecision({
        isZoomed: false,
        startX: 100,
        startY: 100,
        currentX: 142,
        currentY: 168,
      })
    ).toBe("cancel");
  });

  it("cancels desktop swipe when the slide is zoomed", () => {
    expect(
      getDesktopPhotoDragDecision({
        isZoomed: true,
        startX: 100,
        startY: 100,
        currentX: 20,
        currentY: 100,
      })
    ).toBe("cancel");
  });
});

describe("createIdleDesktopPhotoDragState", () => {
  it("returns the reset state used after cancel or lost capture", () => {
    expect(createIdleDesktopPhotoDragState()).toEqual({
      pointerId: null,
      startX: null,
      startY: null,
      isDragging: false,
      hasTriggeredNavigation: false,
    });
  });
});
