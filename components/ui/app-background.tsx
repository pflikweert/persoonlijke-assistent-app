import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

const APP_GRADIENT_COLORS = ["#11110F", "#171612", "#231D1A"] as const;
const APP_GOLD_GLOW = "rgba(224,180,58,0.09)";
const APP_PLUM_HAZE = "rgba(76,46,56,0.08)";

export function AppBackground() {
  if (Platform.OS === "web") {
    const webGradientStyle: ViewStyle = {
      backgroundImage: [
        `radial-gradient(circle at 82% 16%, ${APP_GOLD_GLOW} 0%, rgba(224,180,58,0.04) 24%, rgba(224,180,58,0) 52%)`,
        `radial-gradient(circle at 12% 88%, ${APP_PLUM_HAZE} 0%, rgba(76,46,56,0.04) 26%, rgba(76,46,56,0) 56%)`,
        `linear-gradient(135deg, ${APP_GRADIENT_COLORS[0]} 0%, ${APP_GRADIENT_COLORS[1]} 52%, ${APP_GRADIENT_COLORS[2]} 100%)`,
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
          <Stop offset="0%" stopColor={APP_GRADIENT_COLORS[0]} />
          <Stop offset="52%" stopColor={APP_GRADIENT_COLORS[1]} />
          <Stop offset="100%" stopColor={APP_GRADIENT_COLORS[2]} />
        </LinearGradient>
        <LinearGradient id="appGoldGlow" x1="100%" y1="0%" x2="24%" y2="52%">
          <Stop offset="0%" stopColor={APP_GOLD_GLOW} />
          <Stop offset="100%" stopColor="rgba(224,180,58,0)" />
        </LinearGradient>
        <LinearGradient id="appPlumHaze" x1="0%" y1="100%" x2="58%" y2="42%">
          <Stop offset="0%" stopColor={APP_PLUM_HAZE} />
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
