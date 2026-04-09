import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { borders, colorTokens, spacing } from "@/theme";

export function ScreenSectionDivider({
  style,
  inset = false,
  className,
}: {
  style?: StyleProp<ViewStyle>;
  inset?: boolean;
  className?: string;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      className={className}
      style={[
        styles.base,
        { backgroundColor: palette.separator },
        inset ? styles.inset : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    height: borders.hairline,
    width: "100%",
  },
  inset: {
    marginHorizontal: spacing.lg,
  },
});
