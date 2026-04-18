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

type DetailSectionHeaderProps = {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  trailingAction?: ReactNode;
  style?: ViewStyle;
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

export function DetailSectionHeader({
  icon,
  title,
  trailingAction,
  style,
}: DetailSectionHeaderProps) {
  const scheme = useColorScheme() ?? "light";
  const warmAccent = scheme === "dark" ? "#D1B574" : "#8A6A1F";

  return (
    <ThemedView style={[styles.detailSectionHeaderRow, style]}>
      <ThemedView style={styles.detailSectionHeaderLeading}>
        <MaterialIcons name={icon} size={18} color={warmAccent} />
        <ThemedText type="defaultSemiBold" style={[styles.detailSectionHeaderTitle, { color: warmAccent }]}>
          {title}
        </ThemedText>
      </ThemedView>
      {trailingAction ? (
        <ThemedView style={styles.detailSectionHeaderTrailing}>{trailingAction}</ThemedView>
      ) : null}
    </ThemedView>
  );
}

export function DetailTertiaryAction({
  label,
  onPress,
  disabled = false,
  style,
  labelStyle,
  tone = "muted",
  uppercase = true,
  textType = "caption",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  tone?: "muted" | "destructive";
  uppercase?: boolean;
  textType?: "caption" | "bodySecondary" | "defaultSemiBold";
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const labelColor = tone === "destructive" ? palette.destructiveSoftText : palette.mutedSoft;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.tertiaryAction, style]}>
      <ThemedText
        type={textType}
        style={[
          uppercase ? styles.tertiaryActionLabelUppercase : null,
          { color: labelColor },
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
    paddingVertical: spacing.sm,
  },
  tertiaryActionLabelUppercase: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  readingBlock: {
    marginBottom: spacing.xxxl,
  },
  detailSectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  detailSectionHeaderLeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexShrink: 1,
  },
  detailSectionHeaderTrailing: {
    alignItems: "center",
    justifyContent: "center",
  },
  detailSectionHeaderTitle: {
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.2,
  },
});
