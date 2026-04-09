import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';

export function InlineLoadingOverlay({
  message = 'Laden...',
  detail,
}: {
  message?: string;
  detail?: string;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const shouldUseNativeDriver = Platform.OS !== 'web';
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const rotate = useMemo(
    () =>
      rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [rotateAnim]
  );

  const pulseScale = useMemo(
    () =>
      pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.94, 1.05],
      }),
    [pulseAnim]
  );

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 920,
        easing: Easing.linear,
        useNativeDriver: shouldUseNativeDriver,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: shouldUseNativeDriver,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: shouldUseNativeDriver,
        }),
      ])
    );

    spinLoop.start();
    pulseLoop.start();

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
      rotateAnim.setValue(0);
      pulseAnim.setValue(0);
    };
  }, [pulseAnim, rotateAnim, shouldUseNativeDriver]);

  return (
    <ThemedView style={styles.wrap}>
      <ThemedView style={[styles.orb, { backgroundColor: `${palette.primaryStrong}1F`, borderColor: `${palette.primaryStrong}66` }]}>
        <Animated.View style={[styles.spinnerRing, { borderColor: `${palette.primaryStrong}66`, borderTopColor: palette.primaryStrong, transform: [{ rotate }] }]} />
        <Animated.View style={[styles.spinnerCore, { backgroundColor: palette.primaryStrong, transform: [{ scale: pulseScale }] }]} />
      </ThemedView>
      <ThemedText type="defaultSemiBold" style={{ color: palette.text }}>
        {message}
      </ThemedText>
      {detail ? (
        <ThemedText type="bodySecondary" style={[styles.detail, { color: palette.muted }]}>
          {detail}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  orb: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  spinnerRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
  spinnerCore: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
  },
  detail: {
    textAlign: 'center',
  },
});
