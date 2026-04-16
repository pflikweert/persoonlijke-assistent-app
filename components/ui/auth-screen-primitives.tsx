import type { ReactNode } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Image } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { AppBackground } from "@/components/ui/app-background";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing, typography } from "@/theme";

const BUDIO_VANDAAG_LOGO = require("../../assets/images/brand/budio-vandaag-logo.svg");

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
  subtitleStyle,
}: {
  title: string;
  subtitle: string;
  compactViewport: boolean;
  style?: ViewStyle;
  subtitleStyle?: StyleProp<TextStyle>;
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
          subtitleStyle,
        ]}
      >
        {subtitle}
      </ThemedText>
    </View>
  );
}

export function AuthBrandMark({
  compactViewport,
  style,
}: {
  compactViewport: boolean;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.brandWrap, compactViewport && styles.brandWrapCompact, style]}>
      <Image
        source={BUDIO_VANDAAG_LOGO}
        accessibilityLabel="Budio Vandaag"
        contentFit="contain"
        style={[styles.brandLogo, compactViewport && styles.brandLogoCompact]}
      />
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
  brandWrap: {
    width: "100%",
    alignItems: "center",
  },
  brandWrapCompact: {
    transform: [{ scale: 0.92 }],
  },
  brandLogo: {
    width: 112,
    height: 112,
  },
  brandLogoCompact: {
    width: 96,
    height: 96,
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
