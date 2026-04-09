import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
  visible: boolean;
  route?: string;
  action?: "logout";
};

const MENU_ENTRIES: MenuEntry[] = [
  {
    key: "today",
    label: "Vandaag",
    icon: "auto-awesome",
    visible: true,
    route: "/(tabs)",
  },
  {
    key: "capture",
    label: "Vastleggen",
    icon: "add-circle",
    visible: true,
    route: "/capture",
  },
  {
    key: "days",
    label: "Dagen",
    icon: "calendar-today",
    visible: true,
    route: "/days",
  },
  {
    key: "reflections",
    label: "Reflecties",
    icon: "menu-book",
    visible: true,
    route: "/reflections",
  },
  {
    key: "settings",
    label: "Instellingen",
    icon: "settings",
    visible: true,
    route: "/settings",
  },
  { key: "libium", label: "Bibliotheek", icon: "book", visible: false },
  {
    key: "logout",
    label: "Uitloggen",
    icon: "logout",
    visible: true,
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

  const routeEntries = useMemo(
    () =>
      MENU_ENTRIES.filter(
        (entry): entry is MenuEntry & { route: string } =>
          entry.visible && Boolean(entry.route),
      ),
    [],
  );
  const logoutEntry = useMemo(
    () => MENU_ENTRIES.find((entry) => entry.key === "logout" && entry.visible),
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
      <ThemedView
        style={[styles.overlay, { backgroundColor: palette.background }]}
      >
        <ThemedView style={styles.topBar}>
          <ThemedText type="sectionTitle">Persoonlijke Assistent</ThemedText>
          <HeaderIconButton
            accessibilityRole="button"
            accessibilityLabel="Sluit menu"
            onPress={onRequestClose}
          >
            <MaterialIcons name="close" size={20} color={palette.text} />
          </HeaderIconButton>
        </ThemedView>

        <ThemedView style={styles.listWrap}>
          {routeEntries.map((entry) => {
            const active = entry.key === currentRouteKey;
            return (
              <Pressable
                key={entry.key}
                onPress={() => void handleSelect(entry)}
                style={styles.menuRow}
              >
                <ThemedText
                  style={[
                    styles.menuLabel,
                    { color: active ? palette.primary : palette.mutedSoft },
                  ]}
                >
                  {entry.label}
                </ThemedText>
                <ThemedView style={styles.menuRowRight}>
                  {active ? (
                    <ThemedView
                      style={[
                        styles.activeDot,
                        { backgroundColor: palette.primary },
                      ]}
                    />
                  ) : null}
                  <MaterialIcons
                    name={entry.icon}
                    size={20}
                    color={active ? palette.primary : palette.mutedSoft}
                  />
                </ThemedView>
              </Pressable>
            );
          })}
        </ThemedView>

        {logoutEntry ? (
          <ThemedView
            style={[styles.footer, { borderTopColor: palette.separator }]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={logoutEntry.label}
              onPress={() => void handleSelect(logoutEntry)}
              style={styles.logoutButton}
            >
              <ThemedText
                style={[styles.logoutLabel, { color: palette.muted }]}
              >
                {logoutEntry.label}
              </ThemedText>
              <MaterialIcons
                name={logoutEntry.icon}
                size={18}
                color={palette.muted}
              />
            </Pressable>
          </ThemedView>
        ) : null}
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.xl + spacing.xs,
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xxxl,
  },
  listWrap: {
    gap: spacing.xl,
  },
  menuRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuLabel: {
    fontFamily: typography.families.sans,
    fontSize: 35,
    lineHeight: 40,
    letterSpacing: -0.5,
    fontWeight: "500",
  },
  menuRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: "transparent",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.lg,
  },
  logoutButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutLabel: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
    fontWeight: "500",
  },
});
