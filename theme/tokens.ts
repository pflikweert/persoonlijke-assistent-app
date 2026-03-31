import { Platform } from 'react-native';

export const colorTokens = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    surface: '#F5F7FA',
    primary: '#0A7EA4',
    muted: '#687076',
    border: '#DDE3EA',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    surface: '#1D2125',
    primary: '#FFFFFF',
    muted: '#9BA1A6',
    border: '#2E353C',
  },
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  families: Platform.select({
    ios: {
      sans: 'system-ui',
      serif: 'ui-serif',
      rounded: 'ui-rounded',
      mono: 'ui-monospace',
    },
    default: {
      sans: 'normal',
      serif: 'serif',
      rounded: 'normal',
      mono: 'monospace',
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),
  size: {
    caption: 12,
    body: 16,
    subtitle: 20,
    title: 32,
  },
  lineHeight: {
    body: 24,
    title: 32,
  },
  weight: {
    regular: '400',
    semibold: '600',
    bold: '700',
  },
} as const;
