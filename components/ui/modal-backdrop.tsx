import type { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, type ViewStyle } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { AppBackground } from "@/components/ui/app-background";
import { spacing } from "@/theme";

type ModalBackdropLayout = "center" | "bottom";

export function ModalBackdrop({
  children,
  layout = "center",
  onPressOutside,
  outsidePressDisabled = false,
  contentStyle,
}: {
  children: ReactNode;
  layout?: ModalBackdropLayout;
  onPressOutside?: () => void;
  outsidePressDisabled?: boolean;
  contentStyle?: ViewStyle;
}) {
  const webBlurStyle: ViewStyle =
    Platform.OS === "web"
      ? ({
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        } as unknown as ViewStyle)
      : {};

  return (
    <ThemedView
      style={[
        styles.root,
        layout === "bottom" ? styles.rootBottom : styles.rootCenter,
      ]}
    >
      <AppBackground tone="subtle" />
      <ThemedView style={[styles.scrim, webBlurStyle]} />
      {onPressOutside ? (
        <Pressable
          style={styles.backdropTouch}
          disabled={outsidePressDisabled}
          onPress={onPressOutside}
        />
      ) : null}
      <ThemedView style={contentStyle}>{children}</ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootCenter: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.page,
  },
  rootBottom: {
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14, 13, 11, 0.38)",
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
});
