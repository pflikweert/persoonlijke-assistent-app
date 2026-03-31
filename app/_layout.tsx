import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import type { Session } from '@supabase/supabase-js';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentSession, onAuthStateChange } from '@/services';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentSession()
      .then((nextSession) => {
        if (!mounted) {
          return;
        }

        setSession(nextSession);
        setAuthReady(true);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setSession(null);
        setAuthReady(true);
      });

    const unsubscribe = onAuthStateChange((nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const inAuthRoute = segments[0] === 'sign-in';

    if (!session && !inAuthRoute) {
      router.replace('/sign-in');
      return;
    }

    if (session && inAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [authReady, session, segments]);

  if (!authReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
