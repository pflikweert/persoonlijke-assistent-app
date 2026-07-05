import { useCallback, useEffect, useMemo } from "react";
import {
  PanResponder,
  Platform,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type ViewStyle,
} from "react-native";
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

  const shouldClaimSwipe = useCallback(
    (_event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (!enabled) {
        return false;
      }
      const absX = Math.abs(gestureState.dx);
      const absY = Math.abs(gestureState.dy);
      return absX >= 24 && absX > absY + 16;
    },
    [enabled],
  );

  const finishSwipe = useCallback(
    (gestureState: PanResponderGestureState) => {
      const decision = getPageSwipeDecision({
        translationX: gestureState.dx,
        translationY: gestureState.dy,
        velocityX: gestureState.vx * 1000,
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
    },
    [
      hasNext,
      hasPrevious,
      onNavigate,
      swipeTranslateX,
      viewportWidth,
    ],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: shouldClaimSwipe,
        onMoveShouldSetPanResponderCapture: shouldClaimSwipe,
        onPanResponderMove: (_event, gestureState) => {
          swipeTranslateX.value = clampPageSwipeTranslation({
            translationX: gestureState.dx,
            hasPrevious,
            hasNext,
          });
        },
        onPanResponderRelease: (_event, gestureState) => {
          finishSwipe(gestureState);
        },
        onPanResponderTerminate: () => {
          swipeTranslateX.value = withTiming(0, { duration: 140 });
        },
        onPanResponderTerminationRequest: () => true,
        onShouldBlockNativeResponder: () => false,
      }),
    [
      finishSwipe,
      enabled,
      hasNext,
      hasPrevious,
      shouldClaimSwipe,
      swipeTranslateX,
    ],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeTranslateX.value }],
  }));

  return useMemo(
    () => ({
      animatedStyle,
      panHandlers: panResponder.panHandlers,
    }),
    [animatedStyle, panResponder.panHandlers],
  );
}
