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

  if (tone === "ambient") {
    const preset = pageBackgrounds.ambient[scheme];

    if (Platform.OS === "web") {
      const webGradientStyle: ViewStyle = {
        backgroundImage: [
          `linear-gradient(180deg, ${preset.veilTop} 0%, ${preset.veilMid} 42%, ${preset.veilBottom} 100%)`,
          `radial-gradient(125% 92% at 20% 2%, ${preset.radialInner} 0%, ${preset.radialMid} 54%, ${preset.radialOuter} 100%)`,
          `linear-gradient(180deg, ${preset.baseColor} 0%, ${preset.baseColor} 100%)`,
        ].join(", "),
      } as unknown as ViewStyle;

      return (
        <View style={[styles.background, webGradientStyle, { pointerEvents: "none" }]} />
      );
    }

    return (
      <Svg pointerEvents="none" style={styles.background}>
        <Defs>
          <LinearGradient id="appBaseAmbient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={preset.baseColor} />
            <Stop offset="100%" stopColor={preset.baseColor} />
          </LinearGradient>
          <RadialGradient id="appLightPoolAmbient" cx="22%" cy="4%" rx="76%" ry="62%">
            <Stop offset="0%" stopColor={preset.radialInner} />
            <Stop offset="58%" stopColor={preset.radialMid} />
            <Stop offset="100%" stopColor={preset.radialOuter} />
          </RadialGradient>
          <LinearGradient id="appVeilAmbient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={preset.veilTop} />
            <Stop offset="42%" stopColor={preset.veilMid} />
            <Stop offset="100%" stopColor={preset.veilBottom} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#appBaseAmbient)" />
        <Rect width="100%" height="100%" fill="url(#appLightPoolAmbient)" />
        <Rect width="100%" height="100%" fill="url(#appVeilAmbient)" />
      </Svg>
    );
  }

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

  const preset = pageBackgrounds.subtle[scheme];

  if (Platform.OS === "web") {
    const webGradientStyle: ViewStyle = {
      backgroundImage: [
        `linear-gradient(180deg, ${preset.topTone} 0%, ${preset.midTone} 28%, ${preset.bottomTone} 100%)`,
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
        <LinearGradient id="appBaseSubtle" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={preset.baseColor} />
          <Stop offset="100%" stopColor={preset.softBlendColor} />
        </LinearGradient>
        <LinearGradient id="appWarmSupportSubtle" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={preset.topTone} />
          <Stop offset="28%" stopColor={preset.midTone} />
          <Stop offset="100%" stopColor={preset.bottomTone} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#appBaseSubtle)" />
      <Rect width="100%" height="100%" fill="url(#appWarmSupportSubtle)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
