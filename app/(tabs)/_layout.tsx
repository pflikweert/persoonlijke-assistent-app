import { Tabs } from 'expo-router';
import React from 'react';

import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens } from '@/theme';

export default function TabLayout() {
  const theme = useColorScheme() ?? 'light';
  const palette = colorTokens[theme];

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
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
