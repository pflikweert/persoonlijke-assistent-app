import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

function formatDurationLabel(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export function EntryAudioPlayer({
  sourceUrl,
  durationMs,
  onRequestDownload,
}: {
  sourceUrl: string;
  durationMs?: number | null;
  onRequestDownload?: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const audioRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(
    typeof durationMs === "number" ? Math.max(0, durationMs / 1000) : 0
  );
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const effectiveDuration = durationSeconds > 0 ? durationSeconds : currentSeconds;
  const progress = effectiveDuration > 0 ? Math.min(1, currentSeconds / effectiveDuration) : 0;

  useEffect(() => {
    if (
      typeof globalThis === "undefined" ||
      typeof (globalThis as { Audio?: unknown }).Audio !== "function"
    ) {
      return;
    }

    const AudioCtor = (globalThis as { Audio: new (src?: string) => any }).Audio;
    const audio = new AudioCtor(sourceUrl);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentSeconds(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDurationSeconds(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSeconds(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [sourceUrl]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  const durationLabel = useMemo(() => formatDurationLabel(effectiveDuration), [effectiveDuration]);

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: palette.surfaceLow,
        },
      ]}
    >
      <ThemedView style={styles.playbackRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? "Pauzeer audio" : "Speel audio af"}
          onPress={() => void togglePlayback()}
          style={[
            styles.playButton,
            {
              backgroundColor: palette.primaryStrong,
            },
          ]}
        >
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={18}
            color={palette.primaryOn}
          />
        </Pressable>

        <ThemedView
          style={[
            styles.progressTrack,
            {
              backgroundColor: palette.surfaceHigh,
            },
          ]}
        >
          <ThemedView
            style={[
              styles.progressFill,
              {
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: palette.mutedSoft,
              },
            ]}
          />
        </ThemedView>

        <ThemedText type="meta" style={{ color: palette.mutedSoft }}>
          {durationLabel}
        </ThemedText>

        {onRequestDownload ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Download audio"
            onPress={onRequestDownload}
            style={styles.downloadButton}
          >
            <MaterialIcons name="download" size={18} color={palette.mutedSoft} />
          </Pressable>
        ) : null}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  playbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
  },
});
