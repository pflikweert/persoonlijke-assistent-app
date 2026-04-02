import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import type { Session } from '@supabase/supabase-js';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentSession, onAuthStateChange } from '@/services';
import { colorTokens } from '@/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const WEB_APP_SHELL_MAX_WIDTH = 460;

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const segments = useSegments();
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const palette = colorTokens[colorScheme];

  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const appTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: palette.background,
      card: palette.surface,
      text: palette.text,
      primary: palette.primary,
      border: palette.separator,
      notification: palette.primaryStrong,
    },
  };

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
      <View style={[styles.rootShell, styles.webBackdrop, { backgroundColor: palette.surfaceLow }]}>
        <View style={[styles.rootShell, styles.webAppShell, { backgroundColor: palette.background }]}>
          <View style={[styles.loadingContainer, { backgroundColor: palette.background }]}>
            <ActivityIndicator color={palette.primary} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ThemeProvider value={appTheme}>
      <View style={[styles.rootShell, styles.webBackdrop, { backgroundColor: palette.surfaceLow }]}>
        <View style={[styles.rootShell, styles.webAppShell, { backgroundColor: palette.background }]}>
          <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="entry/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </View>
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor={palette.background} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  rootShell: {
    flex: 1,
  },
  webBackdrop: {
    width: '100%',
    ...(Platform.OS === 'web'
      ? {
          alignItems: 'center',
        }
      : {}),
  },
  webAppShell: {
    width: '100%',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: WEB_APP_SHELL_MAX_WIDTH,
        }
      : {}),
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
