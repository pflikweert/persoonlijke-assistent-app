import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScreenContainer, StateBlock, SurfaceSection } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { hasAdminRegenerationAccess } from '@/services';
import { colorTokens, radius, spacing } from '@/theme';

type SettingsRoute = {
  key: 'import' | 'regeneration';
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: '/settings-import' | '/settings-regeneration';
};

const SETTINGS_ROUTES: SettingsRoute[] = [
  {
    key: 'import',
    label: 'Import',
    description: 'Importeer ChatGPT markdownbestanden.',
    icon: 'file-upload',
    route: '/settings-import',
  },
  {
    key: 'regeneration',
    label: 'Data opnieuw verwerken',
    description: 'Herbouw entries, dagjournals en reflecties voor alle gebruikers.',
    icon: 'autorenew',
    route: '/settings-regeneration',
  },
];

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const allowed = await hasAdminRegenerationAccess();
        if (!cancelled) {
          setAdminAccess(allowed);
          setAccessError(null);
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Kon admin-rechten niet controleren.';
          setAdminAccess(false);
          setAccessError(message);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleRoutes = useMemo(
    () =>
      SETTINGS_ROUTES.filter((item) =>
        item.key === 'regeneration' ? adminAccess === true : true
      ),
    [adminAccess]
  );

  return (
    <>
      <ScreenContainer
        scrollable
        fixedHeader={
          <ScreenHeader
            title="Instellingen"
            titleType="screenTitle"
            subtitle="Beheeracties voor import en herverwerking."
            leftAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ga terug"
                onPress={() => router.back()}
                style={[styles.iconButton, { backgroundColor: palette.surfaceLow }]}>
                <MaterialIcons name="arrow-back" size={20} color={palette.primary} />
              </Pressable>
            }
            rightAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                onPress={() => setMenuVisible(true)}
                style={[styles.iconButton, { backgroundColor: palette.surfaceLow }]}>
                <MaterialIcons name="menu" size={20} color={palette.primary} />
              </Pressable>
            }
          />
        }
        contentContainerStyle={styles.scrollContent}>
        <SurfaceSection title="Submenu" subtitle="Kies een beheeronderdeel.">
          <ThemedView style={styles.menuList}>
            {visibleRoutes.map((item) => (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => router.push(item.route)}
                style={[styles.menuRow, { borderColor: palette.separator }]}
              >
                <ThemedView style={styles.menuRowLeft}>
                  <ThemedView style={[styles.menuIconWrap, { backgroundColor: palette.surfaceLow }]}>
                    <MaterialIcons name={item.icon} size={18} color={palette.primary} />
                  </ThemedView>
                  <ThemedView style={styles.menuTextWrap}>
                    <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
                    <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                      {item.description}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <MaterialIcons name="chevron-right" size={20} color={palette.mutedSoft} />
              </Pressable>
            ))}
          </ThemedView>

          {accessError ? (
            <StateBlock
              tone="info"
              message="Admin-check tijdelijk niet beschikbaar"
              detail={accessError}
            />
          ) : null}
        </SurfaceSection>

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    gap: spacing.sm,
  },
  menuRow: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    minHeight: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    gap: spacing.xxs,
    flex: 1,
  },
});
