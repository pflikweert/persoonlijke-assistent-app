import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ReactNode } from "react";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";

import { ScreenHeader } from "@/components/layout/screen-header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing } from "@/theme";

export function CaptureBackHeader({
  topInset,
  onBack,
}: {
  topInset: number;
  onBack: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ScreenHeader
      surface="transparent"
      style={{
        paddingHorizontal: 0,
        paddingTop: topInset,
        paddingBottom: 0,
      }}
      leftAction={
        <HeaderIconButton
          accessibilityRole="button"
          accessibilityLabel="Terug"
          onPress={onBack}
        >
          <MaterialIcons name="arrow-back" size={18} color={palette.primary} />
        </HeaderIconButton>
      }
    />
  );
}

export function CaptureIntro({
  title,
  subtitle,
  style,
  subtitleStyle,
}: {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  subtitleStyle?: TextStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView style={[styles.copyBlock, style]}>
      <ThemedText type="screenTitle" lightColor={palette.text} darkColor={palette.text}>
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText
          type="bodySecondary"
          lightColor={palette.muted}
          darkColor={palette.muted}
          style={subtitleStyle}
        >
          {subtitle}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

export function CaptureErrorStack({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <ThemedView style={[styles.errorBlock, style]}>{children}</ThemedView>;
}

const styles = StyleSheet.create({
  copyBlock: {
    gap: spacing.sm,
  },
  errorBlock: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
