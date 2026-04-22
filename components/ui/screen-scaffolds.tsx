import type { ReactNode } from "react";
import { StyleSheet, type ViewStyle } from "react-native";

import { ScreenHeader } from "@/components/layout/screen-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { AppBackgroundTone } from "@/components/ui/app-background";
import {
  AdminShell,
  SettingsPageHero,
  SettingsTopNav,
} from "@/components/ui/settings-screen-primitives";
import {
  ScreenContainer,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing } from "@/theme";

export type BrandHeaderLockupProps = {
  primary?: string;
  secondary: string;
  subtitle?: string;
  style?: ViewStyle;
};

export function BrandHeaderLockup({
  primary = "Budio",
  secondary,
  subtitle,
  style,
}: BrandHeaderLockupProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView style={[styles.brandStack, style]}>
      <ThemedView style={styles.brandLockup}>
        <ThemedText type="sectionTitle" style={styles.brandPrimary}>
          {primary}
        </ThemedText>
        <ThemedText
          type="sectionTitle"
          style={[styles.brandSecondary, { color: palette.mutedSoft }]}
        >
          {secondary}
        </ThemedText>
      </ThemedView>
      {subtitle ? (
        <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
          {subtitle}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

export function HeaderActionGroup({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <ThemedView style={[styles.headerActions, style]}>{children}</ThemedView>;
}

export type MainTabScaffoldProps = {
  brandSecondary: string;
  brandSubtitle?: string;
  rightAction?: ReactNode;
  children: ReactNode;
  fixedFooter?: ReactNode;
  contentContainerStyle?: ViewStyle;
  backgroundTone?: AppBackgroundTone;
};

export function MainTabScaffold({
  brandSecondary,
  brandSubtitle,
  rightAction,
  children,
  fixedFooter,
  contentContainerStyle,
  backgroundTone = "subtle",
}: MainTabScaffoldProps) {
  return (
    <ScreenContainer
      scrollable
      backgroundTone={backgroundTone}
      fixedFooter={fixedFooter}
      fixedHeader={
        <ScreenHeader
          leftAction={
            <BrandHeaderLockup secondary={brandSecondary} subtitle={brandSubtitle} />
          }
          rightAction={rightAction}
          surface="transparent"
        />
      }
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </ScreenContainer>
  );
}

export type DetailScaffoldProps = {
  brandSecondary: string;
  brandSubtitle?: string;
  rightAction?: ReactNode;
  children: ReactNode;
  fixedFooter?: ReactNode;
  contentContainerStyle?: ViewStyle;
  backgroundTone?: AppBackgroundTone;
};

export function DetailScaffold({
  brandSecondary,
  brandSubtitle,
  rightAction,
  children,
  fixedFooter,
  contentContainerStyle,
  backgroundTone = "flat",
}: DetailScaffoldProps) {
  return (
    <ScreenContainer
      scrollable
      backgroundTone={backgroundTone}
      fixedFooter={fixedFooter}
      fixedHeader={
        <ScreenHeader
          leftAction={
            <BrandHeaderLockup secondary={brandSecondary} subtitle={brandSubtitle} />
          }
          rightAction={rightAction}
          surface="transparent"
        />
      }
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </ScreenContainer>
  );
}

export type SettingsScaffoldProps = {
  title: string;
  subtitle: string;
  onBack: () => void;
  onMenu: () => void;
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
  backgroundTone?: AppBackgroundTone;
};

export function SettingsScaffold({
  title,
  subtitle,
  onBack,
  onMenu,
  children,
  contentContainerStyle,
  backgroundTone = "flat",
}: SettingsScaffoldProps) {
  return (
    <ScreenContainer
      scrollable
      backgroundTone={backgroundTone}
      contentContainerStyle={[styles.settingsContent, contentContainerStyle]}
      fixedHeader={<SettingsTopNav onBack={onBack} onMenu={onMenu} title="Instellingen" />}
    >
      <SettingsPageHero title={title} subtitle={subtitle} />
      {children}
    </ScreenContainer>
  );
}

export type AdminScaffoldProps = {
  onBack: () => void;
  onMenu: () => void;
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
};

export function AdminScaffold({
  onBack,
  onMenu,
  children,
  contentContainerStyle,
}: AdminScaffoldProps) {
  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={onBack} onMenu={onMenu} />}
      contentContainerStyle={contentContainerStyle}
    >
      {children}
    </AdminShell>
  );
}

export type CaptureScaffoldProps = {
  fixedHeader: ReactNode;
  children: ReactNode;
  contentStyle?: ViewStyle;
  backgroundTone?: AppBackgroundTone;
};

export function CaptureScaffold({
  fixedHeader,
  children,
  contentStyle,
  backgroundTone = "flat",
}: CaptureScaffoldProps) {
  return (
    <ScreenContainer backgroundTone={backgroundTone} fixedHeader={fixedHeader} style={contentStyle}>
      {children}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandStack: {
    gap: spacing.xs,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  brandPrimary: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  brandSecondary: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "400",
    letterSpacing: -0.4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  settingsContent: {
    gap: spacing.content,
    paddingBottom: spacing.xxxl,
  },
});
