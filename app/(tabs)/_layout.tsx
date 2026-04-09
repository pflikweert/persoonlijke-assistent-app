import { Tabs } from 'expo-router';
import React from 'react';

import { BottomTabBar } from '@/components/navigation/BottomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
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
