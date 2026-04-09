import { Pressable, StyleSheet, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export type SegmentedOption = {
  key: string;
  label: string;
  active: boolean;
  onPress: () => void;
};

export function PeriodSegmentedControl({
  options,
  style,
}: {
  options: SegmentedOption[];
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLow}
      darkColor={colorTokens.dark.surfaceLow}
      style={[styles.wrap, style]}
    >
      {options.map((option) => (
        <Pressable
          key={option.key}
          onPress={option.onPress}
          style={[
            styles.button,
            option.active ? { backgroundColor: palette.surfaceLowest } : null,
          ]}
        >
          <ThemedText
            type="caption"
            style={[
              styles.label,
              { color: option.active ? palette.primary : palette.mutedSoft },
            ]}
          >
            {option.label}
          </ThemedText>
        </Pressable>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    padding: 3,
    gap: spacing.xxs,
  },
  button: {
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
});
