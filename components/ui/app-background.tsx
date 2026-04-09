import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export type AppBackgroundTone = "ambient" | "subtle" | "flat";

const APP_BACKGROUND_PRESETS = {
  ambient: {
    gradientColors: ["#11110F", "#171612", "#231D1A"] as const,
    goldStrong: "rgba(224,180,58,0.09)",
    goldSoft: "rgba(224,180,58,0.04)",
    plumStrong: "rgba(76,46,56,0.08)",
    plumSoft: "rgba(76,46,56,0.04)",
  },
  subtle: {
    gradientColors: ["#11110F", "#12110F", "#14120F"] as const,
    goldStrong: "rgba(224,180,58,0.04)",
    goldSoft: "rgba(224,180,58,0.02)",
    plumStrong: "rgba(76,46,56,0.03)",
    plumSoft: "rgba(76,46,56,0.015)",
  },
  flat: {
    baseColor: "#11110F",
  },
} as const;

export function AppBackground({
  tone = "subtle",
}: {
  tone?: AppBackgroundTone;
}) {
  if (tone === "flat") {
    return (
      <View
        pointerEvents="none"
        style={[
          styles.background,
          { backgroundColor: APP_BACKGROUND_PRESETS.flat.baseColor },
        ]}
      />
    );
  }

  const preset = APP_BACKGROUND_PRESETS[tone];

  if (Platform.OS === "web") {
    const webGradientStyle: ViewStyle = {
      backgroundImage: [
        `radial-gradient(circle at 82% 16%, ${preset.goldStrong} 0%, ${preset.goldSoft} 24%, rgba(224,180,58,0) 52%)`,
        `radial-gradient(circle at 12% 88%, ${preset.plumStrong} 0%, ${preset.plumSoft} 26%, rgba(76,46,56,0) 56%)`,
        `linear-gradient(135deg, ${preset.gradientColors[0]} 0%, ${preset.gradientColors[1]} 52%, ${preset.gradientColors[2]} 100%)`,
      ].join(", "),
    } as unknown as ViewStyle;

    return (
      <View pointerEvents="none" style={[styles.background, webGradientStyle]} />
    );
  }

  return (
    <Svg pointerEvents="none" style={styles.background}>
      <Defs>
        <LinearGradient id="appGradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={preset.gradientColors[0]} />
          <Stop offset="52%" stopColor={preset.gradientColors[1]} />
          <Stop offset="100%" stopColor={preset.gradientColors[2]} />
        </LinearGradient>
        <LinearGradient id="appGoldGlow" x1="100%" y1="0%" x2="24%" y2="52%">
          <Stop offset="0%" stopColor={preset.goldStrong} />
          <Stop offset="100%" stopColor="rgba(224,180,58,0)" />
        </LinearGradient>
        <LinearGradient id="appPlumHaze" x1="0%" y1="100%" x2="58%" y2="42%">
          <Stop offset="0%" stopColor={preset.plumStrong} />
          <Stop offset="100%" stopColor="rgba(76,46,56,0)" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#appGradient)" />
      <Rect width="100%" height="100%" fill="url(#appGoldGlow)" />
      <Rect width="100%" height="100%" fill="url(#appPlumHaze)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
