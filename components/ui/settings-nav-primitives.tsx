import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export type SettingsNavRowProps = {
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
};

export function SettingsNavRow({
  label,
  description,
  icon,
  onPress,
  destructive = false,
}: SettingsNavRowProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const accentColor = destructive ? palette.destructiveSoftText : palette.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.menuRow, { backgroundColor: palette.surfaceLow }]}
    >
      <ThemedView style={styles.menuRowLeft}>
        <MaterialIcons
          name={icon}
          size={18}
          style={styles.menuRowIcon}
          color={accentColor}
        />
        <ThemedView style={styles.menuTextWrap}>
          <ThemedText
            type="defaultSemiBold"
            style={destructive ? { color: accentColor } : undefined}
          >
            {label}
          </ThemedText>
          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
            {description}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <MaterialIcons
        name="chevron-right"
        size={18}
        style={styles.menuRowChevron}
        color={destructive ? accentColor : palette.mutedSoft}
      />
    </Pressable>
  );
}

export function SettingsSectionLabel({ label }: { label: string }) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedText type="meta" style={{ color: palette.mutedSoft }}>
      {label}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  menuRow: {
    borderRadius: radius.lg,
    minHeight: 62,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    flex: 1,
  },
  menuRowIcon: {
    marginTop: 2,
  },
  menuTextWrap: {
    gap: spacing.xxs,
    flex: 1,
  },
  menuRowChevron: {
    marginTop: 2,
  },
});
