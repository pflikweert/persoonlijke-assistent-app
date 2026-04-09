import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ImageBackground, Platform, StyleSheet, View } from 'react-native';

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
  'reflection-generate': {
    title: 'We verwerken je reflectie',
    subtitle: 'Je reflectie wordt rustig opgebouwd en toegevoegd aan je overzicht.',
    statuses: ['Voorbereiden', 'Inzichten opbouwen', 'Reflectie afronden', 'Bijna klaar'],
  },
  'chatgpt-import': {
    title: 'We importeren je dagboekdata',
    subtitle: 'Je importbestand wordt verwerkt en toegevoegd aan je dagboek.',
    statuses: [
      'Markdownbestand analyseren',
      'Importbestand voorbereiden',
      'Entries importeren',
      'Dagboekdagen opbouwen',
      'Week- en maandreflecties verversen',
    ],
  },
} as const;

export type ProcessingVariant = keyof typeof COPY_BY_VARIANT;

export function ProcessingScreen({
  visible,
  variant,
  statusOverride,
  progressCurrent,
  progressTotal,
  detailProgressCurrent,
  detailProgressTotal,
  detailProgressLabel,
}: {
  visible: boolean;
  variant: ProcessingVariant;
  statusOverride?: string | null;
  progressCurrent?: number | null;
  progressTotal?: number | null;
  detailProgressCurrent?: number | null;
  detailProgressTotal?: number | null;
  detailProgressLabel?: string | null;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const [mounted, setMounted] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const shouldUseNativeDriver = Platform.OS !== 'web';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const visibleStartedAtRef = useRef<number>(0);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const copy = COPY_BY_VARIANT[variant];
  const status = statusOverride?.trim() || copy.statuses[statusIndex] || copy.statuses[0];
  const normalizedProgressTotal =
    typeof progressTotal === 'number' && Number.isFinite(progressTotal) && progressTotal > 0
      ? Math.max(1, Math.round(progressTotal))
      : null;
  const normalizedProgressCurrent =
    normalizedProgressTotal && typeof progressCurrent === 'number' && Number.isFinite(progressCurrent)
      ? Math.min(normalizedProgressTotal, Math.max(1, Math.round(progressCurrent)))
      : null;
  const progressRatio =
    normalizedProgressTotal && normalizedProgressCurrent
      ? normalizedProgressCurrent / normalizedProgressTotal
      : null;
  const progressLabel =
    normalizedProgressTotal && normalizedProgressCurrent
      ? `Stap ${normalizedProgressCurrent} van ${normalizedProgressTotal}`
      : null;
  const normalizedDetailTotal =
    typeof detailProgressTotal === 'number' &&
    Number.isFinite(detailProgressTotal) &&
    detailProgressTotal > 0
      ? Math.max(1, Math.round(detailProgressTotal))
      : null;
  const normalizedDetailCurrent =
    normalizedDetailTotal &&
    typeof detailProgressCurrent === 'number' &&
    Number.isFinite(detailProgressCurrent)
      ? Math.min(normalizedDetailTotal, Math.max(0, Math.round(detailProgressCurrent)))
      : null;
  const detailProgressRatio =
    normalizedDetailTotal && normalizedDetailCurrent !== null
      ? Math.max(0, normalizedDetailCurrent) / normalizedDetailTotal
      : null;
  const nextDetailLabel = detailProgressLabel?.trim() || null;
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
          useNativeDriver: shouldUseNativeDriver,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: shouldUseNativeDriver,
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
  }, [mounted, pulseAnim, shouldUseNativeDriver]);

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
          useNativeDriver: shouldUseNativeDriver,
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
        useNativeDriver: shouldUseNativeDriver,
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
  }, [visible, mounted, fadeAnim, shouldUseNativeDriver]);

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <ImageBackground source={backgroundSource} resizeMode="cover" style={styles.background} />
      <View style={[styles.overlay, { backgroundColor: overlayColor }]} />

      <View style={styles.contentWrap}>
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
          {progressLabel ? (
            <View style={styles.progressWrap}>
              <View
                style={[
                  styles.progressTrack,
                  {
                    backgroundColor:
                      scheme === 'dark' ? 'rgba(244, 241, 232, 0.12)' : 'rgba(116, 91, 0, 0.10)',
                  },
                ]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: palette.primaryStrong,
                      width: `${Math.max(8, Math.round((progressRatio ?? 0) * 100))}%`,
                    },
                  ]}
                />
              </View>
              <ThemedText type="caption" style={[styles.progressLabel, { color: palette.mutedSoft }]}>
                {progressLabel}
              </ThemedText>
              {nextDetailLabel && normalizedDetailTotal ? (
                <View style={styles.detailProgressWrap}>
                  <View
                    style={[
                      styles.detailProgressTrack,
                      {
                        backgroundColor:
                          scheme === 'dark' ? 'rgba(244, 241, 232, 0.10)' : 'rgba(116, 91, 0, 0.08)',
                      },
                    ]}>
                    <View
                      style={[
                        styles.detailProgressFill,
                        {
                          backgroundColor: `${palette.primaryStrong}B3`,
                          width: `${Math.max(4, Math.round((detailProgressRatio ?? 0) * 100))}%`,
                        },
                      ]}
                    />
                  </View>
                  <ThemedText type="caption" style={[styles.detailProgressLabel, { color: palette.mutedSoft }]}>
                    {nextDetailLabel}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
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
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 440 + spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
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
  progressWrap: {
    width: '100%',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  progressLabel: {
    textAlign: 'center',
  },
  detailProgressWrap: {
    width: '100%',
    gap: spacing.xs,
  },
  detailProgressTrack: {
    width: '100%',
    height: 5,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  detailProgressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  detailProgressLabel: {
    textAlign: 'center',
  },
});
