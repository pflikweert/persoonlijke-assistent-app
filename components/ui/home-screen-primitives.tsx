import type { ReactNode } from "react";
import { StyleSheet, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

type HomeStatusTone = "idle" | "success" | "error";

export function HomeHeroIntro({
  title,
  subtitle,
  cta,
  status,
  style,
}: {
  title: string;
  subtitle: string;
  cta?: ReactNode;
  status?: ReactNode;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView style={[styles.hero, style]}>
      <ThemedText type="displayTitle" style={styles.heroTitle}>
        {title}
      </ThemedText>
      <ThemedText type="bodySecondary" style={[styles.heroCopy, { color: palette.muted }]}>
        {subtitle}
      </ThemedText>
      {cta ? <ThemedView style={styles.heroCtaWrap}>{cta}</ThemedView> : null}
      {status}
    </ThemedView>
  );
}

export function HomeStatusLine({
  text,
  tone,
}: {
  text: string;
  tone: HomeStatusTone;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const dotColor =
    tone === "error"
      ? palette.error
      : tone === "success"
        ? palette.success
        : palette.mutedSoft;

  return (
    <ThemedView style={styles.statusRow}>
      <ThemedView style={[styles.statusDot, { backgroundColor: dotColor }]} />
      <ThemedText
        type="caption"
        style={[styles.statusText, { color: palette.mutedSoft }]}
        numberOfLines={1}
      >
        {text}
      </ThemedText>
    </ThemedView>
  );
}

export function HomeReflectionPreviewFrame({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      style={[
        styles.reflectTeaserFrame,
        { borderTopColor: `${palette.separator}B8` },
        style,
      ]}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  heroTitle: {
    textAlign: "center",
  },
  heroCopy: {
    textAlign: "center",
  },
  heroCtaWrap: {
    width: "100%",
    paddingTop: spacing.xl,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.inline,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
  },
  statusText: {
    textTransform: "none",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  reflectTeaserFrame: {
    borderTopWidth: 1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
});
