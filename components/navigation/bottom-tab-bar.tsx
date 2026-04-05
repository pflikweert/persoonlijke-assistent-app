import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';

type VisibleTab = {
  key: 'today' | 'capture' | 'reflections';
  routeName: 'index' | 'capture' | 'reflections';
  label: 'Vandaag' | 'Leg vast' | 'Terugblik';
  icon: keyof typeof MaterialIcons.glyphMap;
};

const VISIBLE_TABS: VisibleTab[] = [
  { key: 'today', routeName: 'index', label: 'Vandaag', icon: 'home' },
  { key: 'capture', routeName: 'capture', label: 'Leg vast', icon: 'mic' },
  { key: 'reflections', routeName: 'reflections', label: 'Terugblik', icon: 'history' },
];

function resolveActiveTab(routeName: string | undefined): VisibleTab['key'] {
  if (routeName === 'capture') {
    return 'capture';
  }
  if (routeName === 'reflections') {
    return 'reflections';
  }
  return 'today';
}

export function BottomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index];
  const activeRouteName = activeRoute?.name;
  const activeOptions = descriptors[activeRoute.key]?.options;
  const flattenedTabBarStyle = StyleSheet.flatten(activeOptions?.tabBarStyle);
  const tabBarDisplay = (flattenedTabBarStyle as ViewStyle | undefined)?.display;

  if (tabBarDisplay === 'none') {
    return null;
  }

  const activeTab = resolveActiveTab(activeRouteName);
  const bottomPadding = Math.max(insets.bottom, spacing.sm);

  function navigateTo(routeName: VisibleTab['routeName']) {
    const targetRoute = state.routes.find((route) => route.name === routeName);
    if (!targetRoute) {
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: targetRoute.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          borderTopColor: palette.separator,
          backgroundColor: palette.tabBarBackground,
          paddingBottom: bottomPadding,
        },
      ]}>
      <View style={styles.row}>
        {VISIBLE_TABS.map((item) => {
          const isActive = activeTab === item.key;
          const isPrimary = item.key === 'capture';

          if (isPrimary) {
            return (
              <View key={item.key} style={styles.slot}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  onPress={() => navigateTo(item.routeName)}
                  style={styles.primaryActionWrap}>
                  <View style={[styles.primaryAction, { backgroundColor: palette.primaryStrong }]}>
                    <MaterialIcons name={item.icon} size={24} color={palette.primaryOn} />
                  </View>
                  <ThemedText
                    type="caption"
                    style={[
                      styles.label,
                      styles.primaryLabel,
                      { color: isActive ? palette.text : palette.muted },
                    ]}>
                    {item.label}
                  </ThemedText>
                </Pressable>
              </View>
            );
          }

          return (
            <View key={item.key} style={styles.slot}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => navigateTo(item.routeName)}
                style={styles.tabItem}>
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={isActive ? palette.text : palette.mutedSoft}
                />
                <ThemedText
                  type="caption"
                  style={[styles.label, { color: isActive ? palette.text : palette.mutedSoft }]}>
                  {item.label}
                </ThemedText>
              </Pressable>
            </View>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabItem: {
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xxs,
  },
  label: {
    fontSize: 12,
    lineHeight: 14,
  },
  primaryActionWrap: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xxs,
  },
  primaryAction: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontWeight: '600',
  },
});
