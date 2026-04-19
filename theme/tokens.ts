import { Platform, StyleSheet } from "react-native";

export const colorTokens = {
  light: {
    text: "#1B1C1A",
    background: "#FAF9F4",
    surface: "#EFEEEB",
    surfaceLow: "#F4F3F0",
    surfaceLowest: "#FFFFFF",
    surfaceHigh: "#E9E8E5",
    primary: "#E6B800",
    primaryStrong: "#E6B800",
    primaryOn: "#241A00",
    ctaGradientStart: "#F0C115",
    ctaGradientEnd: "#E6B800",
    muted: "#4E4633",
    mutedSoft: "#736A56",
    border: "#D1C5AC",
    separator: "#DED6C4",
    tabBarBackground: "#FAF9F6EE",
    tabActive: "#745B00",
    tabInactive: "#736A56",
    info: "#395F94",
    success: "#1B6D24",
    error: "#BA1A1A",
    destructiveSoftBackground: "#F6E8E5",
    destructiveSoftText: "#C62929",
    destructiveSoftBorder: "#ECC1BF",
  },
  dark: {
    text: "#F4F1E8",
    background: "#171714",
    surface: "#201F1C",
    surfaceLow: "#2B2925",
    surfaceLowest: "#34322D",
    surfaceHigh: "#262521",
    primary: "#F3C53A",
    primaryStrong: "#E9B91F",
    primaryOn: "#241A00",
    ctaGradientStart: "#F3C53A",
    ctaGradientEnd: "#D7A91B",
    muted: "#D4CCBB",
    mutedSoft: "#B5AD9B",
    border: "#4F493E",
    separator: "#5C5548",
    tabBarBackground: "#171714EE",
    tabActive: "#F3C53A",
    tabInactive: "#B5AD9B",
    info: "#A7C8FF",
    success: "#A3F69C",
    error: "#FFB4AB",
    destructiveSoftBackground: "#4B2D2B",
    destructiveSoftText: "#FFB4AB",
    destructiveSoftBorder: "#7E5A56",
  },
} as const;

export const pageBackgrounds = {
  ambient: {
    light: {
      baseColor: "#FAF9F4",
      radialInner: "#FFFFFF",
      radialMid: "#FBF8F1",
      radialOuter: "#F1EEE6",
      veilTop: "rgba(230, 184, 0, 0.10)",
      veilMid: "rgba(230, 184, 0, 0.035)",
      veilBottom: "rgba(214, 194, 152, 0.14)",
    },
    dark: {
      baseColor: "#171714",
      radialInner: "#2A2823",
      radialMid: "#1D1C18",
      radialOuter: "#171714",
      veilTop: "rgba(243, 197, 58, 0.14)",
      veilMid: "rgba(243, 197, 58, 0.04)",
      veilBottom: "rgba(92, 85, 72, 0.20)",
    },
  },
  subtle: {
    light: {
      baseColor: "#FAF9F4",
      softBlendColor: "#F4F3F0",
      topTone: "rgba(230, 184, 0, 0.05)",
      midTone: "rgba(230, 184, 0, 0.015)",
      bottomTone: "rgba(214, 194, 152, 0.05)",
    },
    dark: {
      baseColor: "#171714",
      softBlendColor: "#1D1B18",
      topTone: "rgba(243, 197, 58, 0.055)",
      midTone: "rgba(243, 197, 58, 0.018)",
      bottomTone: "rgba(92, 85, 72, 0.07)",
    },
  },
  flat: {
    light: {
      baseColor: "#FAF9F4",
      softBlendColor: "#F7F5EE",
      topTone: "rgba(255, 255, 255, 0.18)",
    },
    dark: {
      baseColor: "#171714",
      softBlendColor: "#1A1916",
      topTone: "rgba(255, 255, 255, 0.025)",
    },
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
  xxxl: 40,
  page: 24,
  content: 32,
  section: 32,
  cluster: 12,
  inline: 8,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const borders = {
  hairline: StyleSheet.hairlineWidth,
  subtle: 1,
} as const;

export const shadows = {
  surface: Platform.select({
    ios: {
      shadowColor: "#1B1C1A",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
    },
    android: {
      elevation: 2,
    },
    default: {},
    web: {
      boxShadow: "0px 6px 16px rgba(27, 28, 26, 0.06)",
    },
  }),
  cta: Platform.select({
    ios: {
      shadowColor: "#E6B800",
      shadowOpacity: 0.28,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 20,
    },
    android: {
      elevation: 4,
    },
    default: {},
    web: {
      boxShadow: "0px 8px 20px rgba(230, 184, 0, 0.28)",
    },
  }),
} as const;

export const sizing = {
  ctaHeight: 56,
  ctaCompactHeight: 44,
  inputMinHeight: 48,
  textAreaMinHeight: 140,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  touchTarget: 44,
} as const;

export const typography = {
  families: Platform.select({
    ios: {
      sans: "System",
      serif: "ui-serif",
      rounded: "System",
      mono: "ui-monospace",
    },
    default: {
      sans: "normal",
      serif: "serif",
      rounded: "normal",
      mono: "monospace",
    },
    web: {
      sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),
  roles: {
    displayTitle: {
      size: 38,
      lineHeight: 44,
      weight: "700",
      letterSpacing: -0.9,
    },
    screenTitle: {
      size: 34,
      lineHeight: 40,
      weight: "700",
      letterSpacing: -0.55,
    },
    sectionTitle: {
      size: 20,
      lineHeight: 26,
      weight: "600",
      letterSpacing: -0.25,
    },
    body: {
      size: 16,
      lineHeight: 27,
      weight: "400",
      letterSpacing: -0.12,
    },
    bodySecondary: {
      size: 15,
      lineHeight: 24,
      weight: "400",
      letterSpacing: -0.08,
    },
    caption: {
      size: 12,
      lineHeight: 18,
      weight: "500",
      letterSpacing: 0.15,
    },
    meta: {
      size: 11,
      lineHeight: 16,
      weight: "600",
      letterSpacing: 0.9,
    },
    ctaLabel: {
      size: 16,
      lineHeight: 20,
      weight: "700",
      letterSpacing: 0.12,
    },
  },
  size: {
    caption: 12,
    body: 16,
    subtitle: 20,
    title: 34,
  },
  lineHeight: {
    body: 26,
    title: 40,
  },
  weight: {
    regular: "400",
    semibold: "600",
    bold: "700",
  },
} as const;

export const motion = {
  duration: {
    fast: 140,
    normal: 220,
    slow: 320,
  },
  easing: {
    standard: [0.2, 0, 0, 1],
    entrance: [0.16, 1, 0.3, 1],
    exit: [0.4, 0, 1, 1],
  },
} as const;
