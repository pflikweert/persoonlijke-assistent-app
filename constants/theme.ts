import { colorTokens, typography } from '@/theme';

export const Colors = {
  light: {
    text: colorTokens.light.text,
    background: colorTokens.light.background,
    tint: colorTokens.light.primary,
    icon: colorTokens.light.muted,
    tabIconDefault: colorTokens.light.muted,
    tabIconSelected: colorTokens.light.primary,
  },
  dark: {
    text: colorTokens.dark.text,
    background: colorTokens.dark.background,
    tint: colorTokens.dark.primary,
    icon: colorTokens.dark.muted,
    tabIconDefault: colorTokens.dark.muted,
    tabIconSelected: colorTokens.dark.primary,
  },
};

export const Fonts = typography.families;
