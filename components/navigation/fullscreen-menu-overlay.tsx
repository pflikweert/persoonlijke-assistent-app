import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppBackground } from "@/components/ui/app-background";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { signOutUser } from "@/services";
import { colorTokens, radius, spacing, typography } from "@/theme";

export type MainMenuRouteKey =
  | "today"
  | "capture"
  | "days"
  | "reflections"
  | "settings";

type MenuEntry = {
  key: MainMenuRouteKey | "settings" | "libium" | "logout";
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  section: "primary" | "utility";
  route?: string;
  action?: "logout";
};

const MENU_ENTRIES: MenuEntry[] = [
  {
    key: "today",
    label: "Vandaag",
    icon: "today",
    section: "primary",
    route: "/(tabs)",
  },
  {
    key: "capture",
    label: "Vastleggen",
    icon: "mic-none",
    section: "primary",
    route: "/capture",
  },
  {
    key: "days",
    label: "Dagen",
    icon: "calendar-today",
    section: "primary",
    route: "/days",
  },
  {
    key: "reflections",
    label: "Reflecties",
    icon: "auto-awesome",
    section: "primary",
    route: "/reflections",
  },
  {
    key: "settings",
    label: "Instellingen",
    icon: "settings",
    section: "utility",
    route: "/settings",
  },
  {
    key: "logout",
    label: "Uitloggen",
    icon: "logout",
    section: "utility",
    action: "logout",
  },
];

export function FullscreenMenuOverlay({
  visible,
  currentRouteKey,
  onRequestClose,
}: {
  visible: boolean;
  currentRouteKey: MainMenuRouteKey;
  onRequestClose: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const [busy, setBusy] = useState(false);

  const primaryRouteEntries = useMemo(
    () =>
      MENU_ENTRIES.filter(
        (entry): entry is MenuEntry & { route: string } =>
          entry.section === "primary" && Boolean(entry.route),
      ),
    [],
  );
  const settingsEntry = useMemo(
    () => MENU_ENTRIES.find((entry) => entry.key === "settings" && Boolean(entry.route)),
    [],
  );
  const logoutEntry = useMemo(
    () => MENU_ENTRIES.find((entry) => entry.key === "logout"),
    [],
  );

  async function handleSelect(entry: MenuEntry) {
    if (busy) {
      return;
    }

    if (entry.action === "logout") {
      onRequestClose();
      setBusy(true);
      try {
        await signOutUser();
        router.replace("/sign-in");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!entry.route) {
      return;
    }

    onRequestClose();

    if (entry.key === currentRouteKey) {
      return;
    }

    router.push(entry.route as never);
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <ThemedView style={styles.overlay}>
        <AppBackground tone="ambient" />
        <ThemedView style={styles.topBar}>
          <ThemedView style={styles.brandLockup}>
            <ThemedText type="sectionTitle" style={styles.brandPrimary}>
              Budio
            </ThemedText>
            <ThemedText
              type="sectionTitle"
              style={[styles.brandSecondary, { color: palette.mutedSoft }]}
            >
              Vandaag
            </ThemedText>
          </ThemedView>
          <HeaderIconButton
            accessibilityRole="button"
            accessibilityLabel="Sluit menu"
            onPress={onRequestClose}
          >
            <MaterialIcons name="close" size={20} color={palette.text} />
          </HeaderIconButton>
        </ThemedView>

        <ThemedView style={styles.listWrap}>
          {primaryRouteEntries.map((entry) => {
            const active = entry.key === currentRouteKey;
            return (
              <Pressable
                key={entry.key}
                onPress={() => void handleSelect(entry)}
                style={styles.menuRow}
              >
                <ThemedView style={styles.menuRowLeft}>
                  <MaterialIcons
                    name={entry.icon}
                    size={30}
                    color={active ? palette.primary : palette.mutedSoft}
                  />
                  <ThemedText
                    style={[
                      styles.menuLabel,
                      { color: active ? palette.primary : palette.mutedSoft },
                    ]}
                  >
                    {entry.label}
                  </ThemedText>
                </ThemedView>
                {active ? (
                  <ThemedView
                    style={[
                      styles.activeDot,
                      { backgroundColor: palette.primary },
                    ]}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedView style={[styles.utilityDivider, { backgroundColor: `${palette.border}66` }]} />
          {settingsEntry ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={settingsEntry.label}
              onPress={() => void handleSelect(settingsEntry)}
              style={styles.utilityButton}
            >
              <MaterialIcons
                name={settingsEntry.icon}
                size={22}
                color={currentRouteKey === "settings" ? palette.text : palette.mutedSoft}
              />
              <ThemedText
                style={[
                  styles.utilityLabel,
                  { color: currentRouteKey === "settings" ? palette.text : palette.mutedSoft },
                ]}
              >
                {settingsEntry.label}
              </ThemedText>
            </Pressable>
          ) : null}
          {logoutEntry ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={logoutEntry.label}
              onPress={() => void handleSelect(logoutEntry)}
              style={styles.utilityButton}
            >
              <MaterialIcons
                name={logoutEntry.icon}
                size={22}
                color={palette.mutedSoft}
              />
              <ThemedText
                style={[styles.utilityLabel, { color: palette.mutedSoft }]}
              >
                {logoutEntry.label}
              </ThemedText>
            </Pressable>
          ) : null}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
    marginBottom: spacing.xl,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  brandPrimary: {
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  brandSecondary: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "400",
    letterSpacing: -0.4,
  },
  listWrap: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  menuRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  menuLabel: {
    fontFamily: typography.families.sans,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.5,
    fontWeight: "600",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  utilityDivider: {
    width: 44,
    height: 1,
  },
  utilityButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  utilityLabel: {
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    fontWeight: "500",
  },
});
