import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import {
  createIdleDesktopPhotoDragState,
  getDesktopPhotoDragDecision,
  getZoomablePhotoTouchAction,
} from '@/src/lib/moment-photo-viewer/presentation';

const AnimatedView = Animated.createAnimatedComponent(View);

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_THRESHOLD = 1.02;

function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(max, Math.max(min, value));
}

type ZoomablePhotoSlideProps = {
  source: {
    uri: string;
    headers?: Record<string, string>;
  };
  frameWidth: number;
  frameHeight: number;
  imageWidth: number;
  imageHeight: number;
  onZoomStateChange?: (zoomed: boolean) => void;
  onRequestPrevious?: (() => void) | null;
  onRequestNext?: (() => void) | null;
  style?: ViewStyle;
};

export function ZoomablePhotoSlide({
  source,
  frameWidth,
  frameHeight,
  imageWidth,
  imageHeight,
  onZoomStateChange,
  onRequestPrevious,
  onRequestNext,
  style,
}: ZoomablePhotoSlideProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDesktopDragging, setIsDesktopDragging] = useState(false);
  const webSurfaceRef = useRef<any>(null);
  const webDragStateRef = useRef(createIdleDesktopPhotoDragState());
  const scale = useSharedValue(1);
  const scaleStart = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateXStart = useSharedValue(0);
  const translateYStart = useSharedValue(0);
  const lastZoomedRef = useRef(false);

  const fittedSize = useMemo(() => {
    if (frameWidth <= 0 || frameHeight <= 0 || imageWidth <= 0 || imageHeight <= 0) {
      return { width: frameWidth, height: frameHeight };
    }

    const ratio = Math.min(frameWidth / imageWidth, frameHeight / imageHeight);
    return {
      width: Math.max(1, imageWidth * ratio),
      height: Math.max(1, imageHeight * ratio),
    };
  }, [frameHeight, frameWidth, imageHeight, imageWidth]);

  const notifyZoomStateChange = useCallback(
    (zoomed: boolean) => {
      if (lastZoomedRef.current === zoomed) {
        return;
      }
      lastZoomedRef.current = zoomed;
      setIsZoomed(zoomed);
      onZoomStateChange?.(zoomed);
    },
    [onZoomStateChange]
  );

  const resetTransforms = useCallback(() => {
    scale.value = withTiming(1, { duration: 180 });
    scaleStart.value = 1;
    translateX.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(0, { duration: 180 });
    translateXStart.value = 0;
    translateYStart.value = 0;
    notifyZoomStateChange(false);
  }, [notifyZoomStateChange, scale, scaleStart, translateX, translateXStart, translateY, translateYStart]);

  useEffect(() => {
    resetTransforms();
  }, [resetTransforms, source.uri, frameHeight, frameWidth]);

  const clampOffsets = useCallback(
    (nextScale: number, nextTranslateX: number, nextTranslateY: number) => {
      'worklet';
      const overflowX = Math.max(0, (fittedSize.width * nextScale - frameWidth) / 2);
      const overflowY = Math.max(0, (fittedSize.height * nextScale - frameHeight) / 2);
      return {
        x: clamp(nextTranslateX, -overflowX, overflowX),
        y: clamp(nextTranslateY, -overflowY, overflowY),
      };
    },
    [fittedSize.height, fittedSize.width, frameHeight, frameWidth]
  );

  const panGesture = Gesture.Pan()
    .enabled(isZoomed)
    .onBegin(() => {
      translateXStart.value = translateX.value;
      translateYStart.value = translateY.value;
    })
    .onUpdate((event) => {
      if (scale.value <= ZOOM_THRESHOLD) {
        return;
      }
      const clamped = clampOffsets(
        scale.value,
        translateXStart.value + event.translationX,
        translateYStart.value + event.translationY
      );
      translateX.value = clamped.x;
      translateY.value = clamped.y;
    })
    .onEnd(() => {
      if (scale.value <= ZOOM_THRESHOLD) {
        translateX.value = withTiming(0, { duration: 160 });
        translateY.value = withTiming(0, { duration: 160 });
        runOnJS(notifyZoomStateChange)(false);
        return;
      }
      const clamped = clampOffsets(scale.value, translateX.value, translateY.value);
      translateX.value = withTiming(clamped.x, { duration: 160 });
      translateY.value = withTiming(clamped.y, { duration: 160 });
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      scaleStart.value = scale.value;
      translateXStart.value = translateX.value;
      translateYStart.value = translateY.value;
    })
    .onUpdate((event) => {
      const nextScale = clamp(scaleStart.value * event.scale, MIN_SCALE, MAX_SCALE);
      scale.value = nextScale;
      const clamped = clampOffsets(nextScale, translateX.value, translateY.value);
      translateX.value = clamped.x;
      translateY.value = clamped.y;
      runOnJS(notifyZoomStateChange)(nextScale > ZOOM_THRESHOLD);
    })
    .onEnd(() => {
      if (scale.value <= ZOOM_THRESHOLD) {
        scale.value = withTiming(1, { duration: 180 });
        scaleStart.value = 1;
        translateX.value = withTiming(0, { duration: 180 });
        translateY.value = withTiming(0, { duration: 180 });
        runOnJS(notifyZoomStateChange)(false);
        return;
      }
      scaleStart.value = scale.value;
      const clamped = clampOffsets(scale.value, translateX.value, translateY.value);
      translateX.value = withTiming(clamped.x, { duration: 160 });
      translateY.value = withTiming(clamped.y, { duration: 160 });
      runOnJS(notifyZoomStateChange)(true);
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const applyWebZoomScale = useCallback(
    (requestedScale: number) => {
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, requestedScale));
      scale.value = nextScale;
      scaleStart.value = nextScale;

      if (nextScale <= ZOOM_THRESHOLD) {
        translateX.value = withTiming(0, { duration: 140 });
        translateY.value = withTiming(0, { duration: 140 });
        translateXStart.value = 0;
        translateYStart.value = 0;
        notifyZoomStateChange(false);
        return;
      }

      const clamped = clampOffsets(nextScale, translateX.value, translateY.value);
      translateX.value = clamped.x;
      translateY.value = clamped.y;
      translateXStart.value = clamped.x;
      translateYStart.value = clamped.y;
      notifyZoomStateChange(true);
    },
    [clampOffsets, notifyZoomStateChange, scale, scaleStart, translateX, translateXStart, translateY, translateYStart]
  );

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const surface = webSurfaceRef.current as HTMLElement | null;
    if (!surface) {
      return;
    }

    function resetDesktopDragState() {
      webDragStateRef.current = createIdleDesktopPhotoDragState();
      setIsDesktopDragging(false);
    }

    function handleWheel(event: WheelEvent) {
      if (!event.ctrlKey) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const intensity = Math.min(0.24, Math.max(-0.24, -event.deltaY * 0.004));
      const nextScale = scale.value * (1 + intensity);
      applyWebZoomScale(nextScale);
    }

    function handlePointerDown(event: PointerEvent) {
      if (isZoomed || event.pointerType !== "mouse" || event.button !== 0) {
        return;
      }

      webDragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        isDragging: false,
        hasTriggeredNavigation: false,
      };
      surface?.setPointerCapture?.(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      const dragState = webDragStateRef.current;
      if (
        dragState.pointerId !== event.pointerId ||
        dragState.startX === null ||
        dragState.startY === null ||
        dragState.hasTriggeredNavigation
      ) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const hasHorizontalIntent = absX >= 10 && absX > absY + 4;

      if (hasHorizontalIntent) {
        if (!dragState.isDragging) {
          webDragStateRef.current = {
            ...dragState,
            isDragging: true,
          };
        }
        setIsDesktopDragging(true);
        event.preventDefault();
      }

      const decision = getDesktopPhotoDragDecision({
        isZoomed,
        startX: dragState.startX,
        startY: dragState.startY,
        currentX: event.clientX,
        currentY: event.clientY,
      });

      if (decision === "none") {
        return;
      }

      if (decision === "cancel") {
        resetDesktopDragState();
        return;
      }

      event.preventDefault();
      webDragStateRef.current = {
        ...webDragStateRef.current,
        hasTriggeredNavigation: true,
      };

      if (decision === "next") {
        onRequestNext?.();
      } else {
        onRequestPrevious?.();
      }

      resetDesktopDragState();
    }

    function handlePointerUp(event: PointerEvent) {
      const dragState = webDragStateRef.current;
      if (dragState.pointerId !== event.pointerId) {
        return;
      }

      if (dragState.isDragging) {
        event.preventDefault();
      }

      surface?.releasePointerCapture?.(event.pointerId);
      resetDesktopDragState();
    }

    function handlePointerCancel(event: PointerEvent) {
      if (webDragStateRef.current.pointerId !== event.pointerId) {
        return;
      }
      surface?.releasePointerCapture?.(event.pointerId);
      resetDesktopDragState();
    }

    function handleLostPointerCapture(event: PointerEvent) {
      if (webDragStateRef.current.pointerId !== event.pointerId) {
        return;
      }
      resetDesktopDragState();
    }

    function handlePointerLeave(event: PointerEvent) {
      const dragState = webDragStateRef.current;
      if (dragState.pointerId !== event.pointerId || !dragState.isDragging) {
        return;
      }
      surface?.releasePointerCapture?.(event.pointerId);
      resetDesktopDragState();
    }

    function preventGestureZoom(event: Event) {
      event.preventDefault();
    }

    surface.addEventListener("wheel", handleWheel, { passive: false });
    surface.addEventListener("pointerdown", handlePointerDown);
    surface.addEventListener("pointermove", handlePointerMove);
    surface.addEventListener("pointerup", handlePointerUp);
    surface.addEventListener("pointercancel", handlePointerCancel);
    surface.addEventListener("lostpointercapture", handleLostPointerCapture);
    surface.addEventListener("pointerleave", handlePointerLeave);
    surface.addEventListener("gesturestart", preventGestureZoom, { passive: false } as AddEventListenerOptions);
    surface.addEventListener("gesturechange", preventGestureZoom, { passive: false } as AddEventListenerOptions);
    surface.addEventListener("gestureend", preventGestureZoom, { passive: false } as AddEventListenerOptions);

    return () => {
      resetDesktopDragState();
      surface.removeEventListener("wheel", handleWheel);
      surface.removeEventListener("pointerdown", handlePointerDown);
      surface.removeEventListener("pointermove", handlePointerMove);
      surface.removeEventListener("pointerup", handlePointerUp);
      surface.removeEventListener("pointercancel", handlePointerCancel);
      surface.removeEventListener("lostpointercapture", handleLostPointerCapture);
      surface.removeEventListener("pointerleave", handlePointerLeave);
      surface.removeEventListener("gesturestart", preventGestureZoom);
      surface.removeEventListener("gesturechange", preventGestureZoom);
      surface.removeEventListener("gestureend", preventGestureZoom);
    };
  }, [applyWebZoomScale, isZoomed, onRequestNext, onRequestPrevious, scale]);

  return (
    <ThemedView lightColor="transparent" darkColor="transparent" style={[styles.frame, style]}>
      <GestureDetector gesture={composedGesture}>
        <AnimatedView
          style={[
            styles.imageWrap,
            { width: frameWidth, height: frameHeight },
            Platform.OS === 'web'
              ? ({
                  touchAction: getZoomablePhotoTouchAction({
                    isWeb: true,
                    isZoomed,
                  }),
                } as ViewStyle)
              : null,
            animatedStyle,
          ]}
        >
          <Image source={source} contentFit="contain" style={styles.image} />
        </AnimatedView>
      </GestureDetector>
      {Platform.OS === "web" ? (
        <View
          ref={webSurfaceRef}
          collapsable={false}
          style={[
            styles.webInteractionLayer,
            isDesktopDragging ? styles.webInteractionLayerDragging : null,
            {
              touchAction: getZoomablePhotoTouchAction({
                isWeb: true,
                isZoomed,
              }),
              userSelect: isDesktopDragging ? "none" : "auto",
            } as ViewStyle,
          ]}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webInteractionLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    cursor: 'grab' as ViewStyle['cursor'],
  },
  webInteractionLayerDragging: {
    cursor: 'grabbing' as ViewStyle['cursor'],
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
