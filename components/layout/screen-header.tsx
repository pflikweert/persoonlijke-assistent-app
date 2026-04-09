import type { ReactNode } from "react";
import { Platform, StyleSheet, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing } from "@/theme";

type HeaderTitleType = "sectionTitle" | "screenTitle";
type HeaderTitleAlign = "left" | "center";

const HEADER_SURFACE = {
  light: "rgba(250, 249, 244, 0.94)",
  dark: "rgba(18, 17, 15, 0.96)",
} as const;

export function ScreenHeader({
  title,
  subtitle,
  titleType = "sectionTitle",
  titleAlign = "left",
  leftAction,
  rightAction,
  style,
  className,
}: {
  title?: string;
  subtitle?: string;
  titleType?: HeaderTitleType;
  titleAlign?: HeaderTitleAlign;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  style?: ViewStyle;
  className?: string;
}) {
  const scheme = useColorScheme() ?? "light";
  const hasLeftAction = Boolean(leftAction);
  const webBlurStyle: ViewStyle =
    Platform.OS === "web"
      ? ({
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        } as unknown as ViewStyle)
      : {};

  return (
    <ThemedView className={className} style={[styles.header, style]}>
      <ThemedView
        style={[
          styles.blurLayer,
          { backgroundColor: HEADER_SURFACE[scheme] },
          webBlurStyle,
        ]}
      />
      <ThemedView style={styles.topRow}>
        <ThemedView
          style={[styles.side, !hasLeftAction ? styles.sideEmpty : null]}
        >
          {leftAction}
        </ThemedView>

        {title || subtitle ? (
          <ThemedView
            style={[
              styles.titleBlock,
              titleAlign === "center"
                ? styles.titleBlockCenter
                : styles.titleBlockLeft,
            ]}
          >
            {title ? (
              <ThemedText
                type={titleType}
                style={[
                  styles.title,
                  titleAlign === "center" ? styles.titleCenter : null,
                ]}
              >
                {title}
              </ThemedText>
            ) : null}
            {subtitle ? (
              <ThemedText
                type="bodySecondary"
                style={[
                  styles.subtitle,
                  { color: colorTokens[scheme].muted },
                  titleAlign === "center"
                    ? styles.subtitleCenter
                    : styles.subtitleLeft,
                ]}
              >
                {subtitle}
              </ThemedText>
            ) : null}
          </ThemedView>
        ) : (
          <ThemedView style={styles.titleBlock} />
        )}

        <ThemedView style={[styles.side, styles.sideRight]}>
          {rightAction}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 8,
    zIndex: 2,
    position: "relative",
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    minHeight: 40,
  },
  side: {
    minWidth: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  sideEmpty: {
    minWidth: 0,
    width: 0,
  },
  sideRight: {
    alignItems: "flex-end",
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xxs,
    justifyContent: "center",
  },
  titleBlockLeft: {
    alignItems: "flex-start",
    paddingHorizontal: 0,
  },
  titleBlockCenter: {
    alignItems: "center",
    paddingHorizontal: 0,
  },
  title: {
    textAlign: "left",
  },
  titleCenter: {
    textAlign: "center",
  },
  subtitle: {},
  subtitleLeft: {
    textAlign: "left",
  },
  subtitleCenter: {
    textAlign: "center",
  },
});
