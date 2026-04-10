import type { ReactNode } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppBackground } from "@/components/ui/app-background";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing, typography } from "@/theme";

export function AuthAmbientShell({
  children,
  compactViewport,
  maxHeight,
}: {
  children: ReactNode;
  compactViewport: boolean;
  maxHeight: number;
}) {
  return (
    <View style={styles.background}>
      <AppBackground tone="ambient" />
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View
            style={[
              styles.contentShell,
              compactViewport && styles.contentShellCompact,
              { maxHeight },
            ]}
          >
            {children}
          </View>
        </View>
      </View>
    </View>
  );
}

export function AuthHero({
  title,
  subtitle,
  compactViewport,
  style,
}: {
  title: string;
  subtitle: string;
  compactViewport: boolean;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <View style={[styles.hero, style]}>
      <ThemedText
        type="screenTitle"
        style={[styles.headline, compactViewport && styles.headlineCompact]}
      >
        {title}
      </ThemedText>
      <ThemedText
        type="bodySecondary"
        style={[
          styles.subtitle,
          compactViewport && styles.subtitleCompact,
          { color: palette.muted },
        ]}
      >
        {subtitle}
      </ThemedText>
    </View>
  );
}

export function AuthFormStack({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.formControls, style]}>{children}</View>;
}

export function AuthTextSubtitle({
  children,
  compactViewport,
  style,
}: {
  children: ReactNode;
  compactViewport: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <ThemedText
      type="bodySecondary"
      style={[
        styles.subtitle,
        compactViewport && styles.subtitleCompact,
        style,
      ]}
    >
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  contentShell: {
    width: "100%",
    maxWidth: 430,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: "center",
  },
  contentShellCompact: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  hero: {
    width: "100%",
    alignItems: "center",
    gap: spacing.sm,
  },
  formControls: {
    width: "100%",
    gap: spacing.lg,
  },
  headline: {
    textAlign: "center",
    fontSize: 40,
    lineHeight: 44,
    maxWidth: "100%",
  },
  headlineCompact: {
    fontSize: 34,
    lineHeight: 38,
  },
  subtitle: {
    textAlign: "center",
    maxWidth: "100%",
    fontSize: typography.roles.body.size + 1,
    lineHeight: typography.roles.body.lineHeight + 3,
  },
  subtitleCompact: {
    lineHeight: typography.roles.body.lineHeight + 1,
  },
});
