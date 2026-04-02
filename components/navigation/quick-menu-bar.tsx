import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { radius, shadows, sizing, spacing, typography } from '@/theme';

export type QuickMenuKey = 'today' | 'capture' | 'days' | 'reflections';

export const QUICK_MENU_ITEMS: {
  key: QuickMenuKey;
  label: string;
  icon: 'house.fill' | 'square.and.pencil' | 'calendar' | 'sparkles';
  routeName: 'index' | 'capture' | 'days' | 'reflections';
  routePath: '/(tabs)' | '/capture' | '/days' | '/reflections';
}[] = [
  { key: 'today', label: 'Vandaag', icon: 'house.fill', routeName: 'index', routePath: '/(tabs)' },
  { key: 'capture', label: 'Vastleggen', icon: 'square.and.pencil', routeName: 'capture', routePath: '/capture' },
  { key: 'days', label: 'Dagen', icon: 'calendar', routeName: 'days', routePath: '/days' },
  { key: 'reflections', label: 'Reflecties', icon: 'sparkles', routeName: 'reflections', routePath: '/reflections' },
];

export function quickMenuKeyFromRouteName(routeName: string | undefined): QuickMenuKey {
  if (routeName === 'capture') {
    return 'capture';
  }
  if (routeName === 'days') {
    return 'days';
  }
  if (routeName === 'reflections') {
    return 'reflections';
  }

  return 'today';
}

export function quickMenuPathFromKey(key: QuickMenuKey): '/(tabs)' | '/capture' | '/days' | '/reflections' {
  const match = QUICK_MENU_ITEMS.find((item) => item.key === key);
  return match?.routePath ?? '/(tabs)';
}

export function quickMenuRouteNameFromKey(key: QuickMenuKey): 'index' | 'capture' | 'days' | 'reflections' {
  const match = QUICK_MENU_ITEMS.find((item) => item.key === key);
  return match?.routeName ?? 'index';
}

export function QuickMenuBar({
  activeKey,
  onSelect,
  floating = true,
  style,
}: {
  activeKey: QuickMenuKey;
  onSelect: (key: QuickMenuKey) => void;
  floating?: boolean;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];

  return (
    <ThemedView
      lightColor={palette.tabBarBackground}
      darkColor={palette.tabBarBackground}
      style={[
        styles.bar,
        { borderTopColor: palette.separator },
        floating ? styles.floating : styles.inline,
        style,
      ]}>
      {QUICK_MENU_ITEMS.map((item) => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={() => onSelect(item.key)}
            style={[
              styles.item,
              active
                ? { backgroundColor: scheme === 'light' ? 'rgba(221, 156, 30, 0.14)' : 'rgba(233, 188, 95, 0.18)' }
                : null,
            ]}>
            <IconSymbol
              size={sizing.iconMd}
              name={item.icon}
              color={active ? palette.tabActive : palette.tabInactive}
            />
            <ThemedText
              type="caption"
              style={[styles.label, { color: active ? palette.tabActive : palette.tabInactive }]}>
              {item.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    height: 88,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  floating: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.surface,
  },
  inline: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 0,
  },
  item: {
    minHeight: sizing.touchTarget,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    gap: spacing.xxs,
    flex: 1,
  },
  label: {
    fontFamily: typography.families.sans,
    fontSize: typography.roles.caption.size,
    lineHeight: typography.roles.caption.lineHeight,
    fontWeight: typography.roles.caption.weight,
    letterSpacing: typography.roles.caption.letterSpacing,
  },
});
