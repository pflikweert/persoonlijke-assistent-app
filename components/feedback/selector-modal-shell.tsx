import type { ReactNode } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppBackground } from "@/components/ui/app-background";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing } from "@/theme";

type SelectorModalShellProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  scrollableBody?: boolean;
  bodyContentContainerStyle?: StyleProp<ViewStyle>;
  titlePrefix?: string;
};

export function SelectorModalShell({
  visible,
  title,
  subtitle,
  onClose,
  children,
  scrollableBody = false,
  bodyContentContainerStyle,
  titlePrefix = "Kies",
}: SelectorModalShellProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ThemedView style={styles.screen}>
        <AppBackground tone="flat" />

        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerRow}>
            <ThemedView style={styles.titleLockup}>
              <ThemedText type="sectionTitle" style={styles.titlePrimary}>
                {titlePrefix}
              </ThemedText>
              <ThemedText
                type="sectionTitle"
                style={[styles.titleSecondary, { color: palette.mutedSoft }]}
              >
                {title}
              </ThemedText>
            </ThemedView>
            <HeaderIconButton
              accessibilityRole="button"
              accessibilityLabel="Sluiten"
              onPress={onClose}
            >
              <MaterialIcons name="close" size={20} color={palette.primary} />
            </HeaderIconButton>
          </ThemedView>
          {subtitle ? (
            <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
              {subtitle}
            </ThemedText>
          ) : null}
        </ThemedView>

        <ThemedView style={styles.body}>
          {scrollableBody ? (
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={[
                styles.scrollBodyContent,
                bodyContentContainerStyle,
              ]}
            >
              {children}
            </ScrollView>
          ) : (
            children
          )}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    overflow: "hidden",
  },
  header: {
    gap: spacing.xs,
    marginTop: -spacing.xl,
    marginHorizontal: -spacing.lg,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleLockup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  titlePrimary: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  titleSecondary: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "400",
    letterSpacing: -0.4,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  scrollBody: {
    flex: 1,
    minHeight: 0,
  },
  scrollBodyContent: {
    gap: spacing.sm,
  },
});
