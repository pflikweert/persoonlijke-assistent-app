export type MomentSwipeDirection = "previous" | "next";
export type MomentSwipeDecision = MomentSwipeDirection | "none" | "cancel";
export type PageSwipeDirection = MomentSwipeDirection;
export type PageSwipeDecision = MomentSwipeDecision;

export function clampMomentSwipeTranslation(input: {
  translationX: number;
  hasPrevious: boolean;
  hasNext: boolean;
  maxDistance?: number;
}): number {
  "worklet";

  const maxDistance = Math.max(0, input.maxDistance ?? 96);

  if (input.translationX < 0) {
    return input.hasNext ? Math.max(-maxDistance, input.translationX) : 0;
  }

  if (input.translationX > 0) {
    return input.hasPrevious ? Math.min(maxDistance, input.translationX) : 0;
  }

  return 0;
}

export function getMomentSwipeDecision(input: {
  translationX: number;
  translationY: number;
  velocityX?: number;
  hasPrevious: boolean;
  hasNext: boolean;
  horizontalThreshold?: number;
  velocityThreshold?: number;
  verticalCancelThreshold?: number;
  horizontalDominanceOffset?: number;
}): MomentSwipeDecision {
  "worklet";

  const horizontalThreshold = input.horizontalThreshold ?? 72;
  const velocityThreshold = input.velocityThreshold ?? 650;
  const verticalCancelThreshold = input.verticalCancelThreshold ?? 48;
  const horizontalDominanceOffset = input.horizontalDominanceOffset ?? 16;
  const absX = Math.abs(input.translationX);
  const absY = Math.abs(input.translationY);
  const absVelocityX = Math.abs(input.velocityX ?? 0);

  if (absY >= verticalCancelThreshold && absY > absX) {
    return "cancel";
  }

  if (absX <= absY + horizontalDominanceOffset) {
    return "none";
  }

  const hasStrongDistance = absX >= horizontalThreshold;
  const hasStrongVelocity = absVelocityX >= velocityThreshold && absX >= horizontalThreshold * 0.45;
  if (!hasStrongDistance && !hasStrongVelocity) {
    return "none";
  }

  if (input.translationX < 0) {
    return input.hasNext ? "next" : "none";
  }

  return input.hasPrevious ? "previous" : "none";
}

export const clampPageSwipeTranslation = clampMomentSwipeTranslation;
export const getPageSwipeDecision = getMomentSwipeDecision;
