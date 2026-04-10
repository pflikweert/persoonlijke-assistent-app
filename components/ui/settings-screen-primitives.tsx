import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export function SettingsHeaderIconButton({
  icon,
  accessibilityLabel,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.iconButton, { backgroundColor: palette.surface }]}
    >
      <MaterialIcons name={icon} size={20} color={palette.primary} />
    </Pressable>
  );
}

export function SettingsScreenHeader({
  title,
  subtitle,
  onBack,
  onMenu,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  onMenu: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <>
      <ThemedView style={styles.topBar}>
        <SettingsHeaderIconButton
          icon="arrow-back"
          accessibilityLabel="Ga terug"
          onPress={onBack}
        />
        <SettingsHeaderIconButton
          icon="menu"
          accessibilityLabel="Open menu"
          onPress={onMenu}
        />
      </ThemedView>

      <ThemedView style={styles.hero}>
        <ThemedText type="screenTitle">{title}</ThemedText>
        <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
          {subtitle}
        </ThemedText>
      </ThemedView>
    </>
  );
}

export function SettingsStateBody({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <ThemedView style={[styles.stateBody, style]}>{children}</ThemedView>;
}

export function SettingsStateIcon({
  icon,
  iconColor,
  backgroundColor,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}) {
  return (
    <ThemedView style={[styles.iconWrap, { backgroundColor }]}>
      <MaterialIcons name={icon} size={30} color={iconColor} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hero: {
    gap: spacing.sm,
  },
  stateBody: {
    alignItems: "center",
    gap: spacing.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
