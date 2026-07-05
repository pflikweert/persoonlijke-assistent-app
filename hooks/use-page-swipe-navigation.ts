import { useCallback, useEffect, useMemo } from "react";
import { Platform, type ViewStyle } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  clampPageSwipeTranslation,
  getPageSwipeDecision,
  type PageSwipeDirection,
} from "@/src/lib/moment-navigation/presentation";

type UsePageSwipeNavigationInput = {
  enabled: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  viewportWidth: number;
  resetKey: string;
  onNavigate: (direction: PageSwipeDirection) => void;
};

export const pageSwipePanYStyle =
  Platform.OS === "web" ? ({ touchAction: "pan-y" } as ViewStyle) : null;

export function usePageSwipeNavigation({
  enabled,
  hasPrevious,
  hasNext,
  viewportWidth,
  resetKey,
  onNavigate,
}: UsePageSwipeNavigationInput) {
  const swipeTranslateX = useSharedValue(0);

  useEffect(() => {
    swipeTranslateX.value = 0;
  }, [resetKey, swipeTranslateX]);

  const createSwipeGesture = useCallback(() => {
    return Gesture.Pan()
      .enabled(enabled)
      .activeOffsetX([-24, 24])
      .failOffsetY([-12, 12])
      .onUpdate((event) => {
        swipeTranslateX.value = clampPageSwipeTranslation({
          translationX: event.translationX,
          hasPrevious,
          hasNext,
        });
      })
      .onEnd((event) => {
        const decision = getPageSwipeDecision({
          translationX: event.translationX,
          translationY: event.translationY,
          velocityX: event.velocityX,
          hasPrevious,
          hasNext,
        });

        if (decision === "previous" || decision === "next") {
          const exitDistance = Math.max(viewportWidth, 1);
          swipeTranslateX.value = withTiming(
            decision === "next" ? -exitDistance : exitDistance,
            { duration: 150 },
            (finished) => {
              if (finished) {
                runOnJS(onNavigate)(decision);
                swipeTranslateX.value = 0;
              }
            },
          );
          return;
        }

        swipeTranslateX.value = withTiming(0, { duration: 140 });
      })
      .onFinalize(() => {
        if (Math.abs(swipeTranslateX.value) < 1) {
          swipeTranslateX.value = 0;
        }
      });
  }, [
    enabled,
    hasNext,
    hasPrevious,
    onNavigate,
    swipeTranslateX,
    viewportWidth,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeTranslateX.value }],
  }));

  return useMemo(
    () => ({
      animatedStyle,
      createSwipeGesture,
    }),
    [animatedStyle, createSwipeGesture],
  );
}
