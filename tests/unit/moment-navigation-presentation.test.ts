import { describe, expect, it } from "vitest";

import {
  clampPageSwipeTranslation,
  clampMomentSwipeTranslation,
  getPageSwipeDecision,
  getMomentSwipeDecision,
} from "@/src/lib/moment-navigation/presentation";

describe("clampMomentSwipeTranslation", () => {
  it("allows a bounded left drag when a next moment exists", () => {
    expect(
      clampMomentSwipeTranslation({
        translationX: -140,
        hasPrevious: false,
        hasNext: true,
        maxDistance: 96,
      }),
    ).toBe(-96);
  });

  it("allows a bounded right drag when a previous moment exists", () => {
    expect(
      clampMomentSwipeTranslation({
        translationX: 128,
        hasPrevious: true,
        hasNext: false,
        maxDistance: 96,
      }),
    ).toBe(96);
  });

  it("keeps the page fixed when there is no target in the drag direction", () => {
    expect(
      clampMomentSwipeTranslation({
        translationX: -120,
        hasPrevious: true,
        hasNext: false,
      }),
    ).toBe(0);
    expect(
      clampMomentSwipeTranslation({
        translationX: 120,
        hasPrevious: false,
        hasNext: true,
      }),
    ).toBe(0);
  });
});

describe("getMomentSwipeDecision", () => {
  it("navigates to the next moment on a strong left swipe", () => {
    expect(
      getMomentSwipeDecision({
        translationX: -92,
        translationY: 8,
        hasPrevious: false,
        hasNext: true,
      }),
    ).toBe("next");
  });

  it("navigates to the previous moment on a strong right swipe", () => {
    expect(
      getMomentSwipeDecision({
        translationX: 88,
        translationY: 6,
        hasPrevious: true,
        hasNext: false,
      }),
    ).toBe("previous");
  });

  it("does not navigate when the target direction is unavailable", () => {
    expect(
      getMomentSwipeDecision({
        translationX: -110,
        translationY: 4,
        hasPrevious: true,
        hasNext: false,
      }),
    ).toBe("none");
    expect(
      getMomentSwipeDecision({
        translationX: 110,
        translationY: 4,
        hasPrevious: false,
        hasNext: true,
      }),
    ).toBe("none");
  });

  it("cancels vertical scroll gestures", () => {
    expect(
      getMomentSwipeDecision({
        translationX: 34,
        translationY: 96,
        hasPrevious: true,
        hasNext: true,
      }),
    ).toBe("cancel");
  });

  it("accepts a fast short horizontal swipe", () => {
    expect(
      getMomentSwipeDecision({
        translationX: -36,
        translationY: 2,
        velocityX: -900,
        hasPrevious: false,
        hasNext: true,
      }),
    ).toBe("next");
  });
});

describe("page swipe presentation aliases", () => {
  it("keeps the page fixed when no adjacent page exists", () => {
    expect(
      clampPageSwipeTranslation({
        translationX: -120,
        hasPrevious: true,
        hasNext: false,
      }),
    ).toBe(0);
    expect(
      clampPageSwipeTranslation({
        translationX: 120,
        hasPrevious: false,
        hasNext: true,
      }),
    ).toBe(0);
  });

  it("uses the same navigation decision semantics for page swipes", () => {
    expect(
      getPageSwipeDecision({
        translationX: -90,
        translationY: 4,
        hasPrevious: false,
        hasNext: true,
      }),
    ).toBe("next");
    expect(
      getPageSwipeDecision({
        translationX: 90,
        translationY: 4,
        hasPrevious: true,
        hasNext: false,
      }),
    ).toBe("previous");
  });

  it("cancels vertical page scroll gestures", () => {
    expect(
      getPageSwipeDecision({
        translationX: 24,
        translationY: 88,
        hasPrevious: true,
        hasNext: true,
      }),
    ).toBe("cancel");
  });

  it("accepts a fast short horizontal page swipe", () => {
    expect(
      getPageSwipeDecision({
        translationX: -36,
        translationY: 2,
        velocityX: -900,
        hasPrevious: false,
        hasNext: true,
      }),
    ).toBe("next");
  });
});
