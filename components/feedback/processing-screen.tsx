import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, shadows, spacing, typography } from '@/theme';

const LOGIN_BG_LIGHT = require('../../assets/images/login/login-bg-light-mode.png');
const LOGIN_BG_DARK = require('../../assets/images/login/login-bg-dark-mode.png');

const SHOW_DELAY_MS = 220;
const MIN_VISIBLE_MS = 520;
const STATUS_ROTATION_MS = 1400;

const COPY_BY_VARIANT = {
  'text-entry': {
    title: 'We verwerken je entry',
    subtitle: 'Je woorden worden rustig uitgewerkt en toegevoegd aan je dag.',
    statuses: ['Voorbereiden', 'Tekst uitwerken', 'Toevoegen aan je dag', 'Bijna klaar'],
  },
  'audio-entry': {
    title: 'We verwerken je opname',
    subtitle: 'Je woorden worden rustig omgezet en toegevoegd aan je dag.',
    statuses: ['Opname voorbereiden', 'Woorden uitwerken', 'Toevoegen aan je dag', 'Bijna klaar'],
  },
  'entry-edit': {
    title: 'We werken je wijziging bij',
    subtitle: 'Je aanpassing wordt verwerkt en je dag wordt bijgewerkt.',
    statuses: ['Wijziging verwerken', 'Dag bijwerken', 'Bijna klaar'],
  },
} as const;

export type ProcessingVariant = keyof typeof COPY_BY_VARIANT;

export function ProcessingScreen({
  visible,
  variant,
}: {
  visible: boolean;
  variant: ProcessingVariant;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const [mounted, setMounted] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const visibleStartedAtRef = useRef<number>(0);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const copy = COPY_BY_VARIANT[variant];
  const status = copy.statuses[statusIndex] ?? copy.statuses[0];
  const backgroundSource = scheme === 'dark' ? LOGIN_BG_DARK : LOGIN_BG_LIGHT;
  const overlayColor = scheme === 'dark' ? 'rgba(8, 7, 6, 0.72)' : 'rgba(250, 244, 230, 0.76)';
  const cardColor = scheme === 'dark' ? 'rgba(43, 41, 37, 0.82)' : 'rgba(255, 255, 255, 0.8)';
  const cardBorderColor = scheme === 'dark' ? 'rgba(244, 241, 232, 0.18)' : 'rgba(116, 91, 0, 0.12)';

  const pulseScale = useMemo(
    () =>
      pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.96, 1.03],
      }),
    [pulseAnim]
  );
  const pulseOpacity = useMemo(
    () =>
      pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
      }),
    [pulseAnim]
  );

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    if (mounted) {
      pulseLoop.start();
    }

    return () => {
      pulseLoop.stop();
      pulseAnim.setValue(0);
    };
  }, [mounted, pulseAnim]);

  useEffect(() => {
    if (statusTimerRef.current) {
      clearInterval(statusTimerRef.current);
      statusTimerRef.current = null;
    }

    if (!mounted) {
      return;
    }

    setStatusIndex(0);
    statusTimerRef.current = setInterval(() => {
      setStatusIndex((current) => (current + 1) % copy.statuses.length);
    }, STATUS_ROTATION_MS);

    return () => {
      if (statusTimerRef.current) {
        clearInterval(statusTimerRef.current);
        statusTimerRef.current = null;
      }
    };
  }, [mounted, copy.statuses.length]);

  useEffect(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (visible) {
      showTimerRef.current = setTimeout(() => {
        visibleStartedAtRef.current = Date.now();
        setMounted(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      }, SHOW_DELAY_MS);
      return;
    }

    if (!mounted) {
      return;
    }

    const elapsed = Date.now() - visibleStartedAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    hideTimerRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          setStatusIndex(0);
        }
      });
    }, remaining);

    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [visible, mounted, fadeAnim]);

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <ImageBackground source={backgroundSource} resizeMode="cover" style={styles.background} />
      <View style={[styles.overlay, { backgroundColor: overlayColor }]} />

      <View
        style={[
          styles.card,
          {
            backgroundColor: cardColor,
            borderColor: cardBorderColor,
          },
        ]}>
        <Animated.View
          style={[
            styles.pulseHalo,
            {
              backgroundColor: `${palette.primaryStrong}33`,
              opacity: pulseOpacity,
              transform: [{ scale: pulseScale }],
            },
          ]}
        />
        <View style={[styles.pulseCore, { backgroundColor: palette.primaryStrong }]}>
          <View style={[styles.pulseCoreInner, { backgroundColor: palette.primary }]} />
        </View>

        <ThemedText type="sectionTitle" style={styles.title}>
          {copy.title}
        </ThemedText>
        <ThemedText type="bodySecondary" style={[styles.subtitle, { color: palette.muted }]}>
          {copy.subtitle}
        </ThemedText>
        <ThemedText type="caption" style={[styles.status, { color: palette.mutedSoft }]}>
          {status}
        </ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 80,
    elevation: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.surface,
    overflow: 'hidden',
  },
  pulseHalo: {
    width: 82,
    height: 82,
    borderRadius: radius.pill,
    position: 'absolute',
    top: spacing.lg,
  },
  pulseCore: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  pulseCoreInner: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: typography.roles.bodySecondary.lineHeight,
  },
  status: {
    marginTop: spacing.xs,
    letterSpacing: 0.3,
    textTransform: 'none',
  },
});
