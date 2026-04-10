import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps, ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing } from "@/theme";

type HeroProps = {
  title: string;
  subtitle: string;
  subtitleType?: "bodySecondary" | "meta";
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
};

type SectionLabelRowProps = {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  color?: string;
  iconSize?: number;
  textType?: "meta" | "caption";
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export function DetailScreenHero({
  title,
  subtitle,
  subtitleType = "bodySecondary",
  style,
  titleStyle,
  subtitleStyle,
}: HeroProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView style={[styles.hero, style]}>
      <ThemedText type="screenTitle" style={titleStyle}>
        {title}
      </ThemedText>
      <ThemedText
        type={subtitleType}
        style={[
          { color: subtitleType === "meta" ? palette.mutedSoft : palette.muted },
          subtitleStyle,
        ]}
      >
        {subtitle}
      </ThemedText>
    </ThemedView>
  );
}

export function SectionLabelRow({
  icon,
  label,
  color,
  iconSize = 16,
  textType = "meta",
  style,
  labelStyle,
}: SectionLabelRowProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const tint = color ?? palette.primary;

  return (
    <ThemedView style={[styles.sectionLabelRow, style]}>
      <MaterialIcons name={icon} size={iconSize} color={tint} />
      <ThemedText type={textType} style={[{ color: tint }, labelStyle]}>
        {label}
      </ThemedText>
    </ThemedView>
  );
}

export function DetailActionStack({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <ThemedView style={[styles.actionStack, style]}>{children}</ThemedView>;
}

export function DetailTertiaryAction({
  label,
  onPress,
  disabled = false,
  style,
  labelStyle,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.tertiaryAction, style]}>
      <ThemedText
        type="caption"
        style={[
          styles.tertiaryActionLabel,
          { color: palette.mutedSoft },
          labelStyle,
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function DetailReadingBlock({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <ThemedView style={[styles.readingBlock, style]}>{children}</ThemedView>;
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.xs,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionStack: {
    alignItems: "center",
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  tertiaryAction: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tertiaryActionLabel: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  readingBlock: {
    marginBottom: spacing.xxxl,
  },
});
