import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, shadows } from "@/theme";

type CaptureIconButtonTone = "primary" | "surface" | "warning" | "paused";
const WARNING_TONE = "#D4A41D";

type CaptureIconButtonProps = {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  onPress: () => void;
  disabled?: boolean;
  size?: "md" | "lg";
  tone?: CaptureIconButtonTone;
  style?: StyleProp<ViewStyle>;
};

export function CaptureIconButton({
  icon,
  onPress,
  disabled = false,
  size = "lg",
  tone = "primary",
  style,
}: CaptureIconButtonProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const dimensions = size === "lg" ? 88 : 52;
  const iconSize = size === "lg" ? 34 : 22;

  const toneStyle = (() => {
    if (tone === "surface") {
      return {
        backgroundColor: palette.surfaceLow,
        iconColor: palette.primary,
        withShadow: false,
      };
    }
    if (tone === "warning") {
      return {
        backgroundColor: WARNING_TONE,
        iconColor: palette.background,
        withShadow: true,
      };
    }
    if (tone === "paused") {
      return {
        backgroundColor: `${palette.mutedSoft}55`,
        iconColor: palette.text,
        withShadow: false,
      };
    }

    return {
      backgroundColor: palette.primaryStrong,
      iconColor: "#FFFFFF",
      withShadow: true,
    };
  })();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          width: dimensions,
          height: dimensions,
          borderRadius: radius.pill,
          backgroundColor: toneStyle.backgroundColor,
        },
        toneStyle.withShadow ? shadows.cta : null,
        disabled ? styles.disabled : null,
        style,
      ]}>
      <MaterialIcons name={icon} size={iconSize} color={toneStyle.iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
