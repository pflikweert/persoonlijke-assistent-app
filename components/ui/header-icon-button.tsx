import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

type HeaderIconButtonProps = Omit<PressableProps, "style" | "children"> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  size?: 40 | 44;
};

export function HeaderIconButton({
  children,
  style,
  className,
  size = 40,
  disabled,
  ...pressableProps
}: HeaderIconButtonProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Pressable
      disabled={disabled}
      className={className}
      style={[
        styles.base,
        size === 44 ? styles.size44 : styles.size40,
        { backgroundColor: palette.surfaceLow },
        disabled ? styles.disabled : null,
        style,
      ]}
      {...pressableProps}
    >
      {children}
    </Pressable>
  );
}

type HeaderTextActionProps = Omit<PressableProps, "style" | "children"> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

export function HeaderTextAction({
  label,
  style,
  className,
  disabled,
  ...pressableProps
}: HeaderTextActionProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Pressable
      disabled={disabled}
      className={className}
      style={[styles.textAction, disabled ? styles.disabled : null, style]}
      {...pressableProps}
    >
      <ThemedText type="bodySecondary" style={{ color: palette.mutedSoft }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  size40: {
    width: 40,
    height: 40,
  },
  size44: {
    width: 44,
    height: 44,
  },
  disabled: {
    opacity: 0.55,
  },
  textAction: {
    minHeight: 34,
    borderRadius: radius.pill,
    justifyContent: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
});
