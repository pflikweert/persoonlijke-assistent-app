import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ReactNode } from "react";
import { StyleSheet, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export function NoticeCard({
  title,
  body,
  icon,
  compact = false,
  tone = "info",
  style,
}: {
  title?: string;
  body: string;
  icon?: ReactNode;
  compact?: boolean;
  tone?: "info";
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const accentColor = tone === "info" ? palette.primary : palette.primary;
  const noticeIcon = icon ?? (
    <MaterialIcons name="info-outline" size={16} color={accentColor} />
  );

  if (compact) {
    return (
      <ThemedView
        lightColor={colorTokens.light.surfaceLow}
        darkColor={colorTokens.dark.surfaceLow}
        style={[styles.card, styles.compactCard, style]}
      >
        <ThemedView style={styles.iconWrap}>{noticeIcon}</ThemedView>
        <ThemedText type="caption" style={{ color: palette.muted }}>
          {body}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLow}
      darkColor={colorTokens.dark.surfaceLow}
      style={[styles.card, style]}
    >
      <ThemedView
        style={[styles.accent, { backgroundColor: `${accentColor}B3` }]}
      />

      <ThemedView style={styles.content}>
        <ThemedView style={styles.headerRow}>
          <ThemedView style={styles.iconWrap}>
            {noticeIcon}
          </ThemedView>
          {title ? <ThemedText type="defaultSemiBold">{title}</ThemedText> : null}
        </ThemedView>

        <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
          {body}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.sm,
  },
  accent: {
    width: 3,
    borderRadius: radius.pill,
  },
  compactCard: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  iconWrap: {
    width: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
