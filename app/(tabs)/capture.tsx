import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { EncodingType, readAsStringAsync } from "expo-file-system/legacy";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";

import {
  ProcessingScreen,
  type ProcessingVariant,
} from "@/components/feedback/processing-screen";
import { CaptureIconButton } from "@/components/capture/capture-icon-button";
import { ScreenHeader } from "@/components/layout/screen-header";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
  TextAreaField,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  classifyUnknownError,
  refreshDerivedAfterCaptureInBackground,
  isValidJournalDate,
  submitAudioEntry,
  submitTextEntry,
} from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

const MAX_RECORDING_MS = 180_000;
const MAX_RECORDING_SECONDS = Math.floor(MAX_RECORDING_MS / 1000);
const MAX_AUDIO_BYTES = 7 * 1024 * 1024;
const MAX_AUDIO_BASE64_CHARS = Math.ceil((MAX_AUDIO_BYTES * 4) / 3);
const NEAR_END_TONE = "#D4A41D";
const WEB_AUDIO_MOTION = {
  baseNoiseFloorRms: 0.02,
  noiseTrackingMarginRms: 0.018,
  noiseTrackingRate: 0.035,
  maxRmsRange: 0.12,
  speechGate: 0.08,
  sensitivity: 1.85,
  attackSmoothing: 0.24,
  releaseSmoothing: 0.055,
  idleCutoff: 0.022,
} as const;

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function toLocalJournalDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function combineLocalDateWithCurrentTime(journalDate: string, now = new Date()): Date | null {
  if (!isValidJournalDate(journalDate)) {
    return null;
  }

  const [yearRaw, monthRaw, dayRaw] = journalDate.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
}

function createCaptureContext(now = new Date(), journalDateOverride?: string): {
  capturedAt: string;
  journalDate: string;
  timezoneOffsetMinutes: number;
} {
  const captureDate = journalDateOverride ? combineLocalDateWithCurrentTime(journalDateOverride, now) : now;

  return {
    capturedAt: (captureDate ?? now).toISOString(),
    journalDate: journalDateOverride && isValidJournalDate(journalDateOverride) ? journalDateOverride : toLocalJournalDate(now),
    timezoneOffsetMinutes: (captureDate ?? now).getTimezoneOffset(),
  };
}

function mimeTypeFromUri(uri: string): string {
  const normalized = uri.toLowerCase();

  if (normalized.endsWith(".webm")) {
    return "audio/webm";
  }
  if (normalized.endsWith(".wav")) {
    return "audio/wav";
  }
  if (normalized.endsWith(".mp3")) {
    return "audio/mpeg";
  }
  if (normalized.endsWith(".ogg")) {
    return "audio/ogg";
  }
  if (normalized.endsWith(".mp4")) {
    return "audio/mp4";
  }
  if (normalized.endsWith(".m4a")) {
    return "audio/m4a";
  }

  return Platform.OS === "web" ? "audio/webm" : "audio/m4a";
}

function readWebBlobAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Kon web-opname niet lezen."));
    };

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Web-opname leverde geen geldige data op."));
        return;
      }

      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };

    reader.readAsDataURL(blob);
  });
}

async function audioUriToBase64(uri: string): Promise<string> {
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Kon web-opname niet ophalen.");
    }

    const blob = await response.blob();
    return readWebBlobAsBase64(blob);
  }

  return readAsStringAsync(uri, { encoding: EncodingType.Base64 });
}

function normalizeMetering(metering?: number): number {
  if (typeof metering !== "number" || Number.isNaN(metering)) {
    return 0;
  }

  const floorDb = -60;
  const clamped = Math.max(floorDb, Math.min(0, metering));
  return (clamped - floorDb) / Math.abs(floorDb);
}

function calculateTimeDomainRms(samples: Uint8Array): number {
  let sumSquares = 0;

  for (let i = 0; i < samples.length; i += 1) {
    const centered = (samples[i] - 128) / 128;
    sumSquares += centered * centered;
  }

  return Math.sqrt(sumSquares / samples.length);
}

function getWaveformHeights(durationMillis: number, level: number): number[] {
  const seed = Math.floor(durationMillis / 250);
  const base = [14, 22, 32, 46, 62, 76, 84, 76, 62, 46, 32, 22, 14];
  const lift = Math.round(level * 20);

  return base.map((height, index) => {
    const pulse = ((seed + index * 2) % 7) - 3;
    return Math.max(12, height + pulse * 3 + lift);
  });
}

function getFallbackWaveformHeights(durationMillis: number): number[] {
  const seed = Math.floor(durationMillis / 320);
  const base = [14, 22, 32, 46, 62, 76, 84, 76, 62, 46, 32, 22, 14];
  return base.map((height, index) => {
    const pulse = ((seed + index * 3) % 7) - 3;
    return Math.max(12, height + pulse * 2);
  });
}

export default function CaptureScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const { date } = useLocalSearchParams<{ date?: string | string[] }>();
  const routeJournalDate = Array.isArray(date) ? date[0] ?? "" : date ?? "";
  const captureJournalDate = isValidJournalDate(routeJournalDate) ? routeJournalDate : null;
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(recorder, 250);

  const [rawText, setRawText] = useState("");
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recordingActionBusy, setRecordingActionBusy] = useState(false);
  const [error, setError] = useState<{
    message: string;
    retryable: boolean;
    requestId: string | null;
  } | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [isTypingFocused, setIsTypingFocused] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [processingVariant, setProcessingVariant] =
    useState<ProcessingVariant | null>(null);
  const [webLiveLevel, setWebLiveLevel] = useState(0);
  const [webAnalyserReady, setWebAnalyserReady] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false);
  const [pausedVisualLevel, setPausedVisualLevel] = useState(0);

  const autoStopTriggeredRef = useRef(false);

  const isRecording = recorderState.isRecording;
  const hasActiveRecordingSession = isRecording || isPaused || isVoiceSessionActive;
  const recordingSeconds = Math.floor(recorderState.durationMillis / 1000);
  const remainingRecordingSeconds = Math.max(
    0,
    MAX_RECORDING_SECONDS - recordingSeconds,
  );
  const isNearRecordingEnd =
    hasActiveRecordingSession && !isPaused && remainingRecordingSeconds <= 15;
  const liveAudioLevel = isRecording
    ? Platform.OS === "web"
      ? webAnalyserReady
        ? webLiveLevel
        : 0
      : normalizeMetering(recorderState.metering)
    : 0;
  const isWebLiveMotion =
    Platform.OS === "web" && isRecording && webAnalyserReady;
  const isWebFallbackMotion =
    Platform.OS === "web" && isRecording && !webAnalyserReady;
  const voiceMotionScale = 1 + liveAudioLevel * 0.07;
  const voiceMotionOpacity = isRecording ? 0.76 + liveAudioLevel * 0.24 : 0.45;
  const hasTextDraft = rawText.trim().length > 0;
  const hasAudioDraft = Boolean(audioUri);
  const isBusy = submitting || recordingActionBusy;

  const uiMode: "idle" | "voice" | "typing" =
    hasActiveRecordingSession || hasAudioDraft
      ? "voice"
      : isTypingFocused || hasTextDraft
        ? "typing"
        : "idle";

  const handleStopRecording = useCallback(
    async (source: "manual" | "auto"): Promise<string | null> => {
      setRecordingActionBusy(true);

      try {
        await recorder.stop();
        const uri = recorder.uri ?? recorderState.url;

        if (!uri) {
          throw new Error("Opname is gestopt, maar bestand ontbreekt.");
        }

        setAudioUri(uri);
        setIsPaused(false);
        setIsVoiceSessionActive(false);
        return uri;
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        setError({
          message: parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
        return null;
      } finally {
        setRecordingActionBusy(false);
      }
    },
    [recorder, recorderState.url],
  );

  useEffect(() => {
    if (isRecording) {
      setIsPaused(false);
      setIsVoiceSessionActive(true);
    }
  }, [isRecording]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      setWebLiveLevel(0);
      return;
    }

    if (!isRecording) {
      setWebLiveLevel(0);
      setWebAnalyserReady(true);
      return;
    }

    let cancelled = false;
    let rafId: number | null = null;
    let mediaStream: MediaStream | null = null;
    let audioContext: {
      close?: () => Promise<void>;
      context?: {
        state?: string;
        resume?: () => Promise<void>;
        createAnalyser?: () => {
          fftSize: number;
          getByteTimeDomainData: (array: Uint8Array) => void;
        };
        createMediaStreamSource?: (stream: MediaStream) => {
          connect: (node: unknown) => void;
          disconnect?: () => void;
        };
      };
    } | null = null;
    let sourceNode: {
      connect: (node: unknown) => void;
      disconnect?: () => void;
    } | null = null;
    let smoothedLevel = 0;
    let ambientRms = WEB_AUDIO_MOTION.baseNoiseFloorRms;

    const teardown = async () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (sourceNode && typeof sourceNode.disconnect === "function") {
        sourceNode.disconnect();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext && typeof audioContext.close === "function") {
        try {
          await audioContext.close();
        } catch {
          // Ignore close failures during teardown.
        }
      }
      setWebLiveLevel(0);
    };

    const startAnalyser = async () => {
      try {
        if (!globalThis.navigator?.mediaDevices?.getUserMedia) {
          throw new Error("Web mediaDevices API niet beschikbaar");
        }

        const audioApi = await import("react-native-audio-api");
        const AudioContextCtor = audioApi.AudioContext as unknown as {
          new (): NonNullable<typeof audioContext>;
        };
        if (typeof AudioContextCtor !== "function") {
          throw new Error("AudioContext ontbreekt");
        }

        mediaStream = await globalThis.navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContextCtor();
        if (
          !audioContext.context ||
          typeof audioContext.context.createAnalyser !== "function" ||
          typeof audioContext.context.createMediaStreamSource !== "function"
        ) {
          throw new Error("Analyser API ontbreekt");
        }

        if (
          audioContext.context.state === "suspended" &&
          typeof audioContext.context.resume === "function"
        ) {
          await audioContext.context.resume();
        }

        const createdAnalyser = audioContext.context.createAnalyser() as {
          fftSize: number;
          smoothingTimeConstant: number;
          getByteTimeDomainData: (array: Uint8Array) => void;
        };
        createdAnalyser.fftSize = 256;
        createdAnalyser.smoothingTimeConstant = 0.78;
        sourceNode = audioContext.context.createMediaStreamSource(mediaStream);
        sourceNode.connect(createdAnalyser);
        setWebAnalyserReady(true);

        const buffer = new Uint8Array(createdAnalyser.fftSize);

        const frame = () => {
          if (cancelled) {
            return;
          }

          createdAnalyser.getByteTimeDomainData(buffer);
          const rms = calculateTimeDomainRms(buffer);
          if (rms < ambientRms + WEB_AUDIO_MOTION.noiseTrackingMarginRms) {
            ambientRms +=
              (rms - ambientRms) * WEB_AUDIO_MOTION.noiseTrackingRate;
          }

          const normalized = Math.max(
            0,
            Math.min(1, (rms - ambientRms) / WEB_AUDIO_MOTION.maxRmsRange),
          );
          const gated =
            normalized < WEB_AUDIO_MOTION.speechGate
              ? 0
              : (normalized - WEB_AUDIO_MOTION.speechGate) /
                (1 - WEB_AUDIO_MOTION.speechGate);
          const boosted = Math.min(1, gated * WEB_AUDIO_MOTION.sensitivity);
          const smoothing =
            boosted > smoothedLevel
              ? WEB_AUDIO_MOTION.attackSmoothing
              : WEB_AUDIO_MOTION.releaseSmoothing;
          smoothedLevel += (boosted - smoothedLevel) * smoothing;
          setWebLiveLevel(
            smoothedLevel < WEB_AUDIO_MOTION.idleCutoff ? 0 : smoothedLevel,
          );
          rafId = requestAnimationFrame(frame);
        };

        frame();
      } catch {
        if (!cancelled) {
          setWebAnalyserReady(false);
          setWebLiveLevel(0);
        }
      }
    };

    void startAnalyser();

    return () => {
      cancelled = true;
      void teardown();
    };
  }, [isRecording]);

  async function handleStartRecording() {
    setError(null);
    setMicPermissionDenied(false);
    setRecordingActionBusy(true);

    try {
      const permission = await getRecordingPermissionsAsync();
      let granted = permission.granted;

      if (!granted) {
        const requested = await requestRecordingPermissionsAsync();
        granted = requested.granted;
      }

      if (!granted) {
        setIsVoiceSessionActive(false);
        setMicPermissionDenied(true);
        setError({
          message: "Microfoontoegang is nodig om audio op te nemen.",
          retryable: true,
          requestId: null,
        });
        return;
      }

      await recorder.prepareToRecordAsync();
      autoStopTriggeredRef.current = false;
      setAudioUri(null);
      setIsPaused(false);
      recorder.record();
      setIsVoiceSessionActive(true);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setIsVoiceSessionActive(false);
      setMicPermissionDenied(false);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setRecordingActionBusy(false);
    }
  }

  async function handleCancelCurrentMode() {
    setError(null);

    if (hasActiveRecordingSession) {
      setRecordingActionBusy(true);
      try {
        await recorder.stop();
      } catch {
        // Cancel should stay silent if stop fails.
      } finally {
        setRecordingActionBusy(false);
      }
    }

    setAudioUri(null);
    setIsPaused(false);
    setIsVoiceSessionActive(false);
    setIsTypingFocused(false);
    setMicPermissionDenied(false);

    if (uiMode === "typing") {
      setRawText("");
    }
  }

  function handleBackFromCapture() {
    if (uiMode === "idle") {
      router.replace(captureJournalDate ? `/day/${captureJournalDate}` : "/");
      return;
    }
    void handleCancelCurrentMode().then(() => {
      router.replace(captureJournalDate ? `/day/${captureJournalDate}` : "/");
    });
  }

  async function handleSubmitText() {
    setSubmitting(true);
    setError(null);
    setMicPermissionDenied(false);
    setProcessingVariant("text-entry");

    try {
      const captureContext = createCaptureContext(new Date(), captureJournalDate ?? undefined);
      const result = await submitTextEntry({
        rawText,
        capturedAt: captureContext.capturedAt,
        journalDate: captureContext.journalDate,
        timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
        deferDerived: true,
      });

      setRawText("");
      setIsTypingFocused(false);
      router.replace({
        pathname: "/entry/[id]",
        params: {
          id: result.normalizedEntryId,
          source: "capture",
          date: result.journalDate,
        },
      });
      void refreshDerivedAfterCaptureInBackground(result.journalDate);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setSubmitting(false);
      setProcessingVariant(null);
    }
  }

  async function handleSubmitAudio() {
    if (!audioUri) {
      setError({
        message: "Neem eerst een opname op.",
        retryable: false,
        requestId: null,
      });
      return;
    }

    setSubmitting(true);
    setError(null);
    setMicPermissionDenied(false);
    setProcessingVariant("audio-entry");

    try {
      const captureContext = createCaptureContext(new Date(), captureJournalDate ?? undefined);
      const audioBase64 = await audioUriToBase64(audioUri);

      if (audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
        throw new Error("Opname is te groot. Neem een kortere opname op.");
      }

      const result = await submitAudioEntry({
        audioBase64,
        audioMimeType: mimeTypeFromUri(audioUri),
        capturedAt: captureContext.capturedAt,
        journalDate: captureContext.journalDate,
        timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
        deferDerived: true,
      });

      setAudioUri(null);
      router.replace({
        pathname: "/entry/[id]",
        params: {
          id: result.normalizedEntryId,
          source: "capture",
          date: result.journalDate,
        },
      });
      void refreshDerivedAfterCaptureInBackground(result.journalDate);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setSubmitting(false);
      setProcessingVariant(null);
    }
  }

  const handleAutoFinishAtLimit = useCallback(async () => {
    if (!isRecording) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setMicPermissionDenied(false);
    setProcessingVariant("audio-entry");

    const uri = await handleStopRecording("auto");
    if (!uri) {
      setSubmitting(false);
      setProcessingVariant(null);
      return;
    }

    try {
      const captureContext = createCaptureContext(
        new Date(),
        captureJournalDate ?? undefined,
      );
      const audioBase64 = await audioUriToBase64(uri);

      if (audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
        throw new Error("Opname is te groot. Neem een kortere opname op.");
      }

      const result = await submitAudioEntry({
        audioBase64,
        audioMimeType: mimeTypeFromUri(uri),
        capturedAt: captureContext.capturedAt,
        journalDate: captureContext.journalDate,
        timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
        deferDerived: true,
      });

      setAudioUri(null);
      router.replace({
        pathname: "/entry/[id]",
        params: {
          id: result.normalizedEntryId,
          source: "capture",
          date: result.journalDate,
        },
      });
      void refreshDerivedAfterCaptureInBackground(result.journalDate);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setSubmitting(false);
      setProcessingVariant(null);
    }
  }, [captureJournalDate, handleStopRecording, isRecording]);

  useEffect(() => {
    if (!isRecording || recordingActionBusy) {
      return;
    }

    if (recorderState.durationMillis < MAX_RECORDING_MS) {
      return;
    }

    if (autoStopTriggeredRef.current) {
      return;
    }

    autoStopTriggeredRef.current = true;
    void handleAutoFinishAtLimit();
  }, [
    handleAutoFinishAtLimit,
    isRecording,
    recorderState.durationMillis,
    recordingActionBusy,
  ]);

  async function handleFinishVoice() {
    if (isRecording) {
      setSubmitting(true);
      setError(null);
      setMicPermissionDenied(false);
      setProcessingVariant("audio-entry");
      const uri = await handleStopRecording("manual");

      if (!uri) {
        setSubmitting(false);
        setProcessingVariant(null);
        return;
      }

      try {
        const captureContext = createCaptureContext(new Date(), captureJournalDate ?? undefined);
        const audioBase64 = await audioUriToBase64(uri);

        if (audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
          throw new Error("Opname is te groot. Neem een kortere opname op.");
        }

        const result = await submitAudioEntry({
          audioBase64,
          audioMimeType: mimeTypeFromUri(uri),
          capturedAt: captureContext.capturedAt,
          journalDate: captureContext.journalDate,
          timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
          deferDerived: true,
        });

        setAudioUri(null);
        router.replace({
          pathname: "/entry/[id]",
          params: {
            id: result.normalizedEntryId,
            source: "capture",
            date: result.journalDate,
          },
        });
        void refreshDerivedAfterCaptureInBackground(result.journalDate);
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        setError({
          message: parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
      } finally {
        setSubmitting(false);
        setProcessingVariant(null);
      }

      return;
    }

    await handleSubmitAudio();
  }

  async function handleTogglePauseResume() {
    if (!hasActiveRecordingSession || isBusy) {
      return;
    }

    setError(null);

    try {
      if (isPaused) {
        recorder.record();
        setIsPaused(false);
        setIsVoiceSessionActive(true);
        return;
      }

      setPausedVisualLevel(liveAudioLevel);
      recorder.pause();
      setIsPaused(true);
      setIsVoiceSessionActive(true);
    } catch {
      // Keep the control silent on failure so the capture view does not jump.
    }
  }

  async function handleRetryMicrophoneAccess() {
    await handleStartRecording();
  }

  return (
    <ScreenContainer style={styles.screen}>
      <ScreenHeader
        leftAction={
          <Pressable
            onPress={handleBackFromCapture}
            disabled={recordingActionBusy}
            style={[
              styles.topIconButton,
              { backgroundColor: palette.surfaceLow },
              recordingActionBusy && styles.topActionDisabled,
            ]}
          >
            <MaterialIcons
              name="arrow-back"
              size={18}
              color={palette.primary}
            />
          </Pressable>
        }
        rightAction={
          uiMode === "idle" ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              onPress={() => setMenuVisible(true)}
              style={[
                styles.menuButton,
                { backgroundColor: palette.surfaceLow },
              ]}
            >
              <MaterialIcons name="menu" size={20} color={palette.primary} />
            </Pressable>
          ) : (
            <ThemedView style={styles.topBarSpacer} />
          )
        }
      />

      {error ? (
        <ThemedView style={styles.errorStack}>
          <StateBlock
            tone="error"
            message={error.message}
            detail={
              micPermissionDenied
                ? "Geef microfoontoegang in je browser of apparaatinstellingen en probeer opnieuw."
                : error.retryable
                  ? "Tijdelijke fout. Probeer het zo opnieuw."
                  : "Controleer je invoer of login en probeer daarna opnieuw."
            }
            meta={error.requestId ? `Referentie: ${error.requestId}` : null}
          />
          {micPermissionDenied ? (
            <SecondaryButton
              label={recordingActionBusy ? "Toegang controleren..." : "Vraag microfoontoegang opnieuw"}
              onPress={() => void handleRetryMicrophoneAccess()}
              disabled={recordingActionBusy || submitting}
            />
          ) : null}
        </ThemedView>
      ) : null}

      {uiMode === "voice" ? (
        <ThemedView style={styles.voiceCanvas}>
          <ThemedView
            style={[
              styles.waveClusterLive,
              isNearRecordingEnd ? styles.waveClusterNearEnd : null,
              {
                transform: [{ scale: isWebLiveMotion && !isPaused ? voiceMotionScale : 1 }],
                opacity: isWebLiveMotion
                  ? voiceMotionOpacity
                  : isRecording
                    ? 0.86
                    : 0.45,
              },
            ]}
          >
            {(isPaused
              ? getWaveformHeights(
                  recorderState.durationMillis,
                  Math.max(0.12, pausedVisualLevel),
                )
              : isWebFallbackMotion
              ? getFallbackWaveformHeights(recorderState.durationMillis)
              : getWaveformHeights(recorderState.durationMillis, liveAudioLevel)
            ).map((height, index) => (
              <ThemedView
                key={`wave-${index}`}
                style={[
                  isWebFallbackMotion
                    ? styles.waveBarFallback
                    : styles.waveBarLive,
                  {
                    height,
                    opacity: isWebFallbackMotion
                      ? 0.88
                      : isRecording
                        ? 1
                        : 0.45 + liveAudioLevel * 0.2,
                  },
                ]}
              />
            ))}
          </ThemedView>

          <ThemedView style={styles.voiceTextCluster}>
            <ThemedText type="bodySecondary" style={styles.voiceLead}>
              Leg je moment vast.
            </ThemedText>
            <ThemedText
              type="bodySecondary"
              style={[styles.voiceHint, isNearRecordingEnd ? styles.voiceHintNearEnd : null]}>
              {formatDuration(recordingSeconds)} / {formatDuration(MAX_RECORDING_SECONDS)}
            </ThemedText>
          </ThemedView>
          {isNearRecordingEnd ? (
            <ThemedText type="caption" style={styles.voiceNearEndHint}>
              Bijna einde opname
            </ThemedText>
          ) : null}

          <ThemedView style={styles.voicePrimaryZone}>
            <ThemedView style={styles.voiceActionsRow}>
              {hasActiveRecordingSession ? (
                <CaptureIconButton
                  icon={isPaused ? "play-arrow" : "pause"}
                  onPress={() => void handleTogglePauseResume()}
                  disabled={isBusy}
                  size="md"
                  tone={isNearRecordingEnd ? "warning" : isPaused ? "paused" : "surface"}
                />
              ) : null}
              <ThemedView style={styles.voicePrimaryButtonWrap}>
                <PrimaryButton
                  disabled={isBusy || (!hasActiveRecordingSession && !hasAudioDraft)}
                  onPress={() => void handleFinishVoice()}
                  label={
                    hasActiveRecordingSession
                      ? "Klaar"
                      : submitting
                        ? "Opname verwerken..."
                        : "Opname opslaan"
                  }
                />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.idleTypingCanvas}>
          {uiMode === "idle" ? (
            <Pressable
              style={styles.idleTapCanvas}
              disabled={isBusy}
              onPress={() => {
                setIsTypingFocused(true);
                setError(null);
              }}
            >
              <ThemedView style={styles.idleCopy}>
                <ThemedText type="screenTitle" style={styles.idleTitle}>
                  Wat houdt je bezig?
                </ThemedText>
                <ThemedText type="bodySecondary" style={styles.guidanceText}>
                  Klik hier en begin met typen
                </ThemedText>
              </ThemedView>
            </Pressable>
          ) : (
            <ThemedView style={styles.typingCanvas}>
              <TextAreaField
                onChangeText={setRawText}
                placeholder="Wat houdt je bezig?"
                value={rawText}
                autoFocus
                editable={!isBusy}
                style={[
                  styles.captureInput,
                  styles.captureInputTyping,
                  {
                    color: palette.text,
                    borderColor:
                      scheme === "dark"
                        ? `${palette.primaryStrong}66`
                        : `${palette.primaryStrong}7A`,
                    backgroundColor:
                      scheme === "dark"
                        ? "transparent"
                        : "rgba(255,255,255,0.14)",
                  },
                ]}
              />
              <ThemedView style={styles.typingActions}>
                <PrimaryButton
                  onPress={() => void handleSubmitText()}
                  disabled={isBusy || !hasTextDraft}
                  label={submitting ? "Moment bewaren..." : "Moment bewaren"}
                />
              </ThemedView>
            </ThemedView>
          )}

          <ThemedView style={styles.micZone}>
            {uiMode === "idle" ? (
              <CaptureIconButton
                icon="mic"
                onPress={() => void handleStartRecording()}
                disabled={isBusy}
                size="lg"
                tone="primary"
              />
            ) : (
              <Pressable
                onPress={() => void handleCancelCurrentMode()}
                disabled={isBusy}
                style={styles.previousStepAction}
              >
                <MaterialIcons name="mic" size={17} color={palette.mutedSoft} />
                <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                  Vorige stap
                </ThemedText>
              </Pressable>
            )}
          </ThemedView>
        </ThemedView>
      )}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="capture"
        onRequestClose={() => setMenuVisible(false)}
      />
      <ProcessingScreen
        visible={Boolean(processingVariant)}
        variant={processingVariant ?? "text-entry"}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing.page,
  },
  errorStack: {
    gap: spacing.sm,
  },
  topIconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  topActionDisabled: {
    opacity: 0.45,
  },
  topBarSpacer: {
    width: 76,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  idleTypingCanvas: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacing.md,
  },
  idleTapCanvas: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  captureInput: {
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
    minHeight: 240,
    fontSize: 32,
    lineHeight: 42,
    letterSpacing: -0.5,
    textAlign: "center",
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  captureInputTyping: {
    textAlign: "left",
    flex: 1,
    minHeight: 0,
    fontSize: 28,
    lineHeight: 38,
    borderRadius: radius.lg,
    borderColor: `${colorTokens.light.primaryStrong}7A`,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  typingCanvas: {
    flex: 1,
    gap: spacing.md,
  },
  typingActions: {
    width: "100%",
  },
  idleCopy: {
    alignItems: "center",
    gap: spacing.xs,
  },
  idleTitle: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: "center",
  },
  guidanceText: {
    textAlign: "center",
    opacity: 0.7,
  },
  micZone: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 64,
    marginTop: spacing.md,
  },
  previousStepAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  voiceCanvas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  waveClusterLive: {
    height: 156,
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.xl,
    backgroundColor: `${colorTokens.light.primary}08`,
  },
  waveClusterFallback: {
    height: 116,
    width: "100%",
    maxWidth: 224,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: `${colorTokens.light.primary}05`,
  },
  waveClusterNearEnd: {
    backgroundColor: `${NEAR_END_TONE}1A`,
  },
  waveBarLive: {
    width: 6,
    borderRadius: radius.pill,
    backgroundColor: colorTokens.light.primaryStrong,
  },
  waveBarFallback: {
    width: 6,
    borderRadius: radius.pill,
    backgroundColor: `${colorTokens.light.primaryStrong}B3`,
  },
  voiceTextCluster: {
    alignItems: "center",
    gap: 4,
  },
  voiceLead: {
    textAlign: "center",
    opacity: 0.9,
  },
  voiceHint: {
    textAlign: "center",
    opacity: 0.72,
  },
  voiceHintNearEnd: {
    color: NEAR_END_TONE,
    opacity: 0.88,
  },
  voiceNearEndHint: {
    textAlign: "center",
    color: NEAR_END_TONE,
    opacity: 0.82,
  },
  voicePrimaryZone: {
    width: "100%",
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  voiceActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  voicePrimaryButtonWrap: {
    flex: 1,
  },
});
