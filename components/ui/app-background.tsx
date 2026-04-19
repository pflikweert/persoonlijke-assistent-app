import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { pageBackgrounds } from "@/theme";

export type AppBackgroundTone = "ambient" | "subtle" | "flat";

export function AppBackground({
  tone = "subtle",
}: {
  tone?: AppBackgroundTone;
}) {
  const scheme = useColorScheme() ?? "light";

  if (tone === "flat") {
    const preset = pageBackgrounds.flat[scheme];

    if (Platform.OS === "web") {
      const webGradientStyle: ViewStyle = {
        backgroundImage: [
          `linear-gradient(180deg, ${preset.topTone} 0%, rgba(255,255,255,0) 18%)`,
          `linear-gradient(180deg, ${preset.baseColor} 0%, ${preset.softBlendColor} 100%)`,
        ].join(", "),
      } as unknown as ViewStyle;

      return (
        <View style={[styles.background, webGradientStyle, { pointerEvents: "none" }]} />
      );
    }

    return (
      <Svg pointerEvents="none" style={styles.background}>
        <Defs>
          <LinearGradient id="appBaseFlat" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={preset.baseColor} />
            <Stop offset="100%" stopColor={preset.softBlendColor} />
          </LinearGradient>
          <LinearGradient id="appTopToneFlat" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={preset.topTone} />
            <Stop offset="18%" stopColor="rgba(255,255,255,0)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#appBaseFlat)" />
        <Rect width="100%" height="100%" fill="url(#appTopToneFlat)" />
      </Svg>
    );
  }

  const preset = tone === "ambient" ? pageBackgrounds.ambient[scheme] : pageBackgrounds.subtle[scheme];

  if (Platform.OS === "web") {
    const webGradientStyle: ViewStyle = {
      backgroundImage: [
        `radial-gradient(circle at 82% 16%, ${preset.goldStrong} 0%, ${preset.goldSoft} 24%, rgba(224,180,58,0) 52%)`,
        `radial-gradient(circle at 12% 88%, ${preset.plumStrong} 0%, ${preset.plumSoft} 26%, rgba(76,46,56,0) 56%)`,
        `linear-gradient(135deg, ${preset.gradientColors[0]} 0%, ${preset.gradientColors[1]} 52%, ${preset.gradientColors[2]} 100%)`,
      ].join(", "),
    } as unknown as ViewStyle;

    return (
      <View style={[styles.background, webGradientStyle, { pointerEvents: "none" }]} />
    );
  }

  if (Platform.OS === "android") {
    const topLift = scheme === "light" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.018)";
    const goldEndTransparent = "rgba(224,180,58,0)";

    return (
      <Svg pointerEvents="none" style={styles.background}>
        <Defs>
          <LinearGradient id="appGradientAndroid" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={preset.gradientColors[0]} />
            <Stop offset="52%" stopColor={preset.gradientColors[1]} />
            <Stop offset="100%" stopColor={preset.gradientColors[2]} />
          </LinearGradient>
          <LinearGradient id="appGoldGlowAndroid" x1="100%" y1="0%" x2="18%" y2="50%">
            <Stop offset="0%" stopColor={preset.goldStrong} />
            <Stop offset="30%" stopColor={preset.goldSoft} />
            <Stop offset="100%" stopColor={goldEndTransparent} />
          </LinearGradient>
          <LinearGradient id="appTopLiftAndroid" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={topLift} />
            <Stop offset="20%" stopColor="rgba(255,255,255,0)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#appGradientAndroid)" />
        <Rect width="100%" height="100%" fill="url(#appGoldGlowAndroid)" />
        <Rect width="100%" height="100%" fill="url(#appTopLiftAndroid)" />
      </Svg>
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
        <RadialGradient id="appGoldGlow" cx="82%" cy="16%" rx="46%" ry="40%">
          <Stop offset="0%" stopColor={preset.goldStrong} />
          <Stop offset="24%" stopColor={preset.goldSoft} />
          <Stop offset="100%" stopColor="rgba(224,180,58,0)" />
        </RadialGradient>
        <RadialGradient id="appPlumHaze" cx="12%" cy="88%" rx="48%" ry="42%">
          <Stop offset="0%" stopColor={preset.plumStrong} />
          <Stop offset="26%" stopColor={preset.plumSoft} />
          <Stop offset="100%" stopColor="rgba(76,46,56,0)" />
        </RadialGradient>
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
