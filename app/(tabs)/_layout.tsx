import { Tabs } from 'expo-router';
import React from 'react';

import { QuickMenuTabBar } from '@/components/navigation/quick-menu-tabbar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens } from '@/theme';

export default function TabLayout() {
  const theme = useColorScheme() ?? 'light';
  const palette = colorTokens[theme];

  return (
    <Tabs
      tabBar={(props) => <QuickMenuTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: palette.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vandaag',
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Leg vast',
        }}
      />
      <Tabs.Screen
        name="days"
        options={{
          title: 'Dagen',
          href: null,
        }}
      />
      <Tabs.Screen
        name="reflections"
        options={{
          title: 'Terugblik',
        }}
      />
    </Tabs>
  );
}
