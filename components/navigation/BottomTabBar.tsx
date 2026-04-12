import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing, typography } from "@/theme";

type BottomTabKey = "today" | "capture" | "reflections";

type VisibleTab = {
  key: BottomTabKey;
  routeName?: "index" | "reflections";
  label: "Vandaag" | "Leg vast" | "Terugblik";
  icon: keyof typeof MaterialIcons.glyphMap;
};

const TABS: VisibleTab[] = [
  { key: "today", routeName: "index", label: "Vandaag", icon: "home" },
  { key: "capture", label: "Leg vast", icon: "mic" },
  {
    key: "reflections",
    routeName: "reflections",
    label: "Terugblik",
    icon: "history",
  },
];

const TAB_BAR_TOP_TONE = {
  light: "rgba(116, 91, 0, 0.06)",
  dark: "rgba(224, 180, 58, 0.10)",
} as const;

function resolveActiveTab(routeName: string | undefined): BottomTabKey {
  if (routeName === "reflections") {
    return "reflections";
  }
  return "today";
}

function TabBarContent({
  activeKey,
  onSelect,
  onCapturePress,
  safeInsetBottom,
}: {
  activeKey: BottomTabKey;
  onSelect: (key: BottomTabKey) => void;
  onCapturePress: () => void;
  safeInsetBottom: number;
}) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = colorTokens[colorScheme];
  const totalHeight = 72 + safeInsetBottom;

  return (
    <ThemedView
      style={[
        styles.container,
        {
          height: totalHeight,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md + safeInsetBottom,
          backgroundColor: palette.tabBarBackground,
        },
      ]}
    >
      <View
        style={[
          styles.topTone,
          { backgroundColor: TAB_BAR_TOP_TONE[colorScheme], pointerEvents: "none" },
        ]}
      />
      <View style={styles.row}>
        {TABS.map((tab) => {
          const isActive = activeKey === tab.key;
          const isCenter = tab.key === "capture";

          if (isCenter) {
            return (
              <View key={tab.key} style={styles.tabSlot}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={tab.label}
                  onPress={onCapturePress}
                  style={styles.centerPressable}
                >
                  <View
                    style={[
                      styles.centerButton,
                      { backgroundColor: palette.primary },
                    ]}
                  >
                    <MaterialIcons
                      name={tab.icon}
                      size={26}
                      color={palette.primaryOn}
                    />
                  </View>
                </Pressable>
              </View>
            );
          }

          return (
            <View key={tab.key} style={styles.tabSlot}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                onPress={() => onSelect(tab.key)}
                style={styles.sidePressable}
              >
                <MaterialIcons
                  name={tab.icon}
                  size={22}
                  color={isActive ? palette.tabActive : palette.tabInactive}
                />
                <ThemedText
                  type="meta"
                  style={[
                    styles.metaLabel,
                    {
                      color: isActive ? palette.tabActive : palette.tabInactive,
                    },
                  ]}
                >
                  {tab.label}
                </ThemedText>
              </Pressable>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

export function BottomTabBarStandalone({
  activeKey,
  onSelect,
}: {
  activeKey: BottomTabKey;
  onSelect: (key: BottomTabKey) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <TabBarContent
      activeKey={activeKey}
      onSelect={onSelect}
      onCapturePress={() => onSelect("capture")}
      safeInsetBottom={Math.max(0, insets.bottom)}
    />
  );
}

export function BottomTabBar({
  state,
  navigation,
  descriptors,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index];
  const activeRouteName = activeRoute?.name;
  const activeOptions = descriptors[activeRoute.key]?.options;
  const flattenedTabBarStyle = StyleSheet.flatten(activeOptions?.tabBarStyle);
  const tabBarDisplay = (flattenedTabBarStyle as ViewStyle | undefined)
    ?.display;

  if (tabBarDisplay === "none") {
    return null;
  }

  function handleSelect(key: BottomTabKey) {
    const routeName = TABS.find((tab) => tab.key === key)?.routeName ?? "index";
    if (key === "capture") {
      router.push("/capture");
      return;
    }
    const targetRoute = state.routes.find((route) => route.name === routeName);
    if (!targetRoute) {
      return;
    }

    const event = navigation.emit({
      type: "tabPress",
      target: targetRoute.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  }

  return (
    <TabBarContent
      activeKey={resolveActiveTab(activeRouteName)}
      onSelect={handleSelect}
      onCapturePress={() => router.push("/capture")}
      safeInsetBottom={Math.max(0, insets.bottom)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  topTone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sidePressable: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    minHeight: 44,
  },
  centerPressable: {
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    minHeight: 64,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  metaLabel: {
    fontSize: 11,
    lineHeight: typography.roles.meta.lineHeight,
    letterSpacing: typography.roles.meta.letterSpacing,
    fontWeight: "500",
  },
});
