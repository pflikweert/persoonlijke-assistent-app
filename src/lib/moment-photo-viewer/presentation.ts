export function getMomentPhotoViewerSwipeState(input: {
  photoCount: number;
  viewerIndex: number | null;
}) {
  const photoCount = Math.max(0, Math.floor(input.photoCount));
  const safeIndex =
    input.viewerIndex === null
      ? 0
      : Math.max(0, Math.min(photoCount > 0 ? photoCount - 1 : 0, Math.floor(input.viewerIndex)));
  const hasSwipe = photoCount > 1;

  return {
    hasSwipe,
    safeIndex,
    canGoLeft: hasSwipe && safeIndex > 0,
    canGoRight: hasSwipe && safeIndex < photoCount - 1,
  };
}

export type DesktopPhotoDragDecision = "none" | "previous" | "next" | "cancel";

export type DesktopPhotoDragState = {
  pointerId: number | null;
  startX: number | null;
  startY: number | null;
  isDragging: boolean;
  hasTriggeredNavigation: boolean;
};

export function createIdleDesktopPhotoDragState(): DesktopPhotoDragState {
  return {
    pointerId: null,
    startX: null,
    startY: null,
    isDragging: false,
    hasTriggeredNavigation: false,
  };
}

export function getDesktopPhotoDragDecision(input: {
  isZoomed: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  horizontalThreshold?: number;
  verticalCancelThreshold?: number;
  horizontalDominanceOffset?: number;
}): DesktopPhotoDragDecision {
  if (input.isZoomed) {
    return "cancel";
  }

  const horizontalThreshold = input.horizontalThreshold ?? 56;
  const verticalCancelThreshold = input.verticalCancelThreshold ?? 24;
  const horizontalDominanceOffset = input.horizontalDominanceOffset ?? 12;
  const deltaX = input.currentX - input.startX;
  const deltaY = input.currentY - input.startY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX < horizontalThreshold && absY < verticalCancelThreshold) {
    return "none";
  }

  if (absY >= verticalCancelThreshold && absY > absX) {
    return "cancel";
  }

  if (absX < horizontalThreshold) {
    return "none";
  }

  if (absX <= absY + horizontalDominanceOffset) {
    return "cancel";
  }

  return deltaX < 0 ? "next" : "previous";
}

export function getZoomablePhotoTouchAction(input: {
  isWeb: boolean;
  isZoomed: boolean;
}): "none" | "pan-y" | undefined {
  if (!input.isWeb) {
    return undefined;
  }

  return input.isZoomed ? "none" : "pan-y";
}
