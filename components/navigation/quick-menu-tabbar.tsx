import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Platform, StyleSheet, View } from 'react-native';

import {
  QuickMenuBar,
  quickMenuKeyFromRouteName,
  quickMenuRouteNameFromKey,
} from '@/components/navigation/quick-menu-bar';

export function QuickMenuTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];
  const activeRouteName = activeRoute?.name;

  if (activeRouteName === 'capture') {
    return null;
  }

  const activeKey = quickMenuKeyFromRouteName(activeRouteName);

  function handleSelect(nextKey: Parameters<typeof quickMenuRouteNameFromKey>[0]) {
    const nextRouteName = quickMenuRouteNameFromKey(nextKey);

    if (Platform.OS === 'ios') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const targetRoute = state.routes.find((route) => route.name === nextRouteName);
    if (!targetRoute) {
      return;
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: targetRoute.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(nextRouteName);
    }
  }

  const tabBarBackground = descriptors[activeRoute.key]?.options.tabBarBackground;

  return (
    <View pointerEvents="box-none" style={styles.host}>
      {tabBarBackground ? tabBarBackground() : null}
      <QuickMenuBar activeKey={activeKey} onSelect={handleSelect} floating />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
