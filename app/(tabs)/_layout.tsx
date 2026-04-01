import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, shadows, sizing, spacing, typography } from '@/theme';

export default function TabLayout() {
  const theme = useColorScheme() ?? 'light';
  const palette = colorTokens[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tabActive,
        tabBarInactiveTintColor: Colors[theme].tabInactive,
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor: palette.background },
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: Colors[theme].tabBarBackground,
            borderTopColor: Colors[theme].separator,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vandaag',
          tabBarIcon: ({ color }) => <IconSymbol size={sizing.iconMd} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Vastleggen',
          // Capture is a utility screen: keep focus on task and hide tabbar.
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color }) => (
            <IconSymbol size={sizing.iconMd} name="square.and.pencil" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="days"
        options={{
          title: 'Dagen',
          tabBarIcon: ({ color }) => <IconSymbol size={sizing.iconMd} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reflections"
        options={{
          title: 'Reflecties',
          tabBarIcon: ({ color }) => <IconSymbol size={sizing.iconMd} name="sparkles" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 88,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    ...shadows.surface,
    position: 'absolute',
  },
  tabLabel: {
    fontFamily: typography.families.sans,
    fontSize: typography.roles.caption.size,
    lineHeight: typography.roles.caption.lineHeight,
    fontWeight: typography.roles.caption.weight,
    letterSpacing: typography.roles.caption.letterSpacing,
    marginTop: spacing.xxs,
  },
  tabItem: {
    minHeight: sizing.touchTarget,
    borderRadius: radius.lg,
  },
});
