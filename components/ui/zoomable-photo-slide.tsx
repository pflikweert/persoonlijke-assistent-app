import { useCallback, useEffect, useMemo, useRef } from 'react';
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
  style?: ViewStyle;
};

export function ZoomablePhotoSlide({
  source,
  frameWidth,
  frameHeight,
  imageWidth,
  imageHeight,
  onZoomStateChange,
  style,
}: ZoomablePhotoSlideProps) {
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

  return (
    <ThemedView lightColor="transparent" darkColor="transparent" style={[styles.frame, style]}>
      <GestureDetector gesture={composedGesture}>
        <AnimatedView
          style={[
            styles.imageWrap,
            { width: frameWidth, height: frameHeight },
            Platform.OS === 'web' ? styles.webGestureSurface : null,
            animatedStyle,
          ]}
        >
          <Image source={source} contentFit="contain" style={styles.image} />
        </AnimatedView>
      </GestureDetector>
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
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  webGestureSurface: {
    touchAction: 'none',
  },
});
