import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CaptureIconButton } from "@/components/capture/capture-icon-button";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import {
  ProcessingScreen,
  type ProcessingVariant,
} from "@/components/feedback/processing-screen";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ThemedText } from "@/components/themed-text";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import {
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import {
  classifyUnknownError,
  refreshDerivedAfterCaptureInBackground,
  submitAudioEntry,
} from "@/services";
import type {
  DerivedRefreshResult,
  ProcessEntryResult,
} from "@/services/entries";
import { colorTokens, radius, spacing, typography } from "@/theme";

import {
  audioUriToBase64,
  buildCaptureParams,
  createCaptureContext,
  formatDuration,
  mimeTypeFromUri,
  resolveCaptureJournalDate,
  type CaptureRouteParams,
} from "./_shared";

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

export default function CaptureRecordScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();
  const { date } = useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date);
  const returnParams = buildCaptureParams(journalDate);
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(recorder, 250);

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [retryingDerived, setRetryingDerived] = useState(false);
  const [recordingActionBusy, setRecordingActionBusy] = useState(false);
  const [savedEntry, setSavedEntry] = useState<ProcessEntryResult | null>(null);
  const [derivedResult, setDerivedResult] = useState<DerivedRefreshResult | null>(
    null,
  );
  const [discardVisible, setDiscardVisible] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [error, setError] = useState<{
    message: string;
    retryable: boolean;
    requestId: string | null;
  } | null>(null);
  const [processingVariant, setProcessingVariant] =
    useState<ProcessingVariant | null>(null);
  const [webLiveLevel, setWebLiveLevel] = useState(0);
  const [webAnalyserReady, setWebAnalyserReady] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false);
  const [pausedVisualLevel, setPausedVisualLevel] = useState(0);

  const hasStartedRef = useRef(false);
  const autoStopTriggeredRef = useRef(false);

  const isRecording = recorderState.isRecording;
  const hasActiveRecordingSession =
    isRecording || isPaused || isVoiceSessionActive;
  const hasAudioDraft = Boolean(audioUri);
  const isBusy = submitting || recordingActionBusy || retryingDerived;
  const derivedNeedsAttention = Boolean(
    savedEntry && derivedResult && derivedResult.status !== "success",
  );
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

  const stopRecorderAndStoreUri = useCallback(async (): Promise<
    string | null
  > => {
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
  }, [recorder, recorderState.url]);

  const startRecording = useCallback(async () => {
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
  }, [recorder]);

  const submitCapturedAudio = useCallback(
    async (uri: string) => {
      setSubmitting(true);
      setError(null);
      setMicPermissionDenied(false);
      setProcessingVariant("audio-entry");

      try {
        const captureContext = createCaptureContext(
          new Date(),
          journalDate ?? undefined,
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
        setSavedEntry(result);
        const refreshResult = await refreshDerivedAfterCaptureInBackground(
          result.journalDate,
        );

        if (refreshResult.status === "success") {
          router.replace({
            pathname: "/entry/[id]",
            params: {
              id: result.normalizedEntryId,
              source: "capture",
              date: result.journalDate,
            },
          });
          return;
        }

        setDerivedResult(refreshResult);
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
    },
    [journalDate],
  );

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    void startRecording();
  }, [startRecording]);

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
          smoothingTimeConstant: number;
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
          // Ignore teardown failures.
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

        const createdAnalyser = audioContext.context.createAnalyser();
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

  useEffect(() => {
    return () => {
      if (recorderState.isRecording) {
        void recorder.stop().catch(() => {
          // Ignore teardown race conditions when recorder is not fully initialized.
        });
      }
    };
  }, [recorder, recorderState.isRecording]);

  const handleAutoFinishAtLimit = useCallback(async () => {
    if (!isRecording) {
      return;
    }

    const uri = await stopRecorderAndStoreUri();
    if (!uri) {
      return;
    }

    void submitCapturedAudio(uri);
  }, [isRecording, stopRecorderAndStoreUri, submitCapturedAudio]);

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

  async function handleStop() {
    if (isBusy) {
      return;
    }

    if (isRecording) {
      const uri = await stopRecorderAndStoreUri();
      if (!uri) {
        return;
      }
      await submitCapturedAudio(uri);
      return;
    }

    if (audioUri) {
      await submitCapturedAudio(audioUri);
    }
  }

  function goToSavedEntry() {
    if (!savedEntry) {
      return;
    }

    router.replace({
      pathname: "/entry/[id]",
      params: {
        id: savedEntry.normalizedEntryId,
        source: "capture",
        date: savedEntry.journalDate,
      },
    });
  }

  async function handleRetryDerived() {
    if (!savedEntry || retryingDerived || submitting || recordingActionBusy) {
      return;
    }

    setRetryingDerived(true);
    setProcessingVariant("audio-entry");
    const nextResult = await refreshDerivedAfterCaptureInBackground(
      savedEntry.journalDate,
    );
    setDerivedResult(nextResult);
    setRetryingDerived(false);
    setProcessingVariant(null);

    if (nextResult.status === "success") {
      goToSavedEntry();
    }
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
      // Keep this silent so the recording view stays calm.
    }
  }

  function goBackToStart() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({ pathname: "/capture", params: returnParams });
  }

  function handleBack() {
    if (isBusy) {
      return;
    }

    if (hasActiveRecordingSession || hasAudioDraft) {
      setDiscardVisible(true);
      return;
    }

    goBackToStart();
  }

  async function handleConfirmDiscard() {
    setDiscardVisible(false);
    setRecordingActionBusy(true);

    try {
      if (hasActiveRecordingSession) {
        await recorder.stop();
      }
    } catch {
      // Best effort on exit.
    } finally {
      setRecordingActionBusy(false);
      setAudioUri(null);
      setIsPaused(false);
      setIsVoiceSessionActive(false);
      setError(null);
      goBackToStart();
    }
  }

  const waveformHeights = isPaused
    ? getWaveformHeights(
        recorderState.durationMillis,
        Math.max(0.12, pausedVisualLevel),
      )
    : isWebFallbackMotion
      ? getFallbackWaveformHeights(recorderState.durationMillis)
      : getWaveformHeights(recorderState.durationMillis, liveAudioLevel);

  return (
    <ScreenContainer
      backgroundTone="flat"
      fixedHeader={
        <ScreenHeader
          style={{
            paddingHorizontal: 0,
            paddingTop: insets.top,
            paddingBottom: 0,
          }}
          leftAction={
            <HeaderIconButton
              accessibilityRole="button"
              accessibilityLabel="Terug"
              onPress={handleBack}
            >
              <MaterialIcons
                name="arrow-back"
                size={18}
                color={palette.primary}
              />
            </HeaderIconButton>
          }
        />
      }
    >
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      {error ? (
        <View style={styles.errorBlock}>
          <StateBlock
            tone="error"
            message={error.message}
            detail={
              micPermissionDenied
                ? "Geef microfoontoegang en probeer het opnieuw."
                : error.retryable
                  ? "Probeer het zo opnieuw."
                  : "Controleer de opname en probeer het daarna opnieuw."
            }
            meta={error.requestId ? `Referentie: ${error.requestId}` : null}
          />
          {micPermissionDenied ? (
            <SecondaryButton
              label={
                recordingActionBusy
                  ? "Toegang controleren..."
                  : "Vraag microfoontoegang opnieuw"
              }
              onPress={() => void startRecording()}
              disabled={isBusy}
            />
          ) : null}
        </View>
      ) : null}
      {derivedNeedsAttention && derivedResult ? (
        <View style={styles.errorBlock}>
          <StateBlock
            tone={derivedResult.status === "failed" ? "error" : "info"}
            message={buildDerivedStatusMessage(derivedResult)}
            detail="Je opname is wel opgeslagen."
          />
          <PrimaryButton
            label={retryingDerived ? "Opnieuw proberen..." : "Opnieuw proberen"}
            onPress={() => void handleRetryDerived()}
            disabled={isBusy}
          />
          <SecondaryButton
            label="Ga naar je moment"
            onPress={goToSavedEntry}
            disabled={isBusy}
          />
        </View>
      ) : null}

      <View
        style={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      >
        <View
          style={[
            styles.waveCard,
            isNearRecordingEnd ? styles.waveCardNearEnd : null,
            {
              backgroundColor: palette.surface,
              transform: [
                { scale: isWebLiveMotion && !isPaused ? voiceMotionScale : 1 },
              ],
              opacity: isWebLiveMotion
                ? voiceMotionOpacity
                : isRecording
                  ? 0.92
                  : 0.78,
            },
          ]}
        >
          {waveformHeights.map((height, index) => (
            <View
              key={`wave-${index}`}
              style={[
                styles.waveBar,
                isWebFallbackMotion ? styles.waveBarFallback : null,
                {
                  backgroundColor: isWebFallbackMotion
                    ? `${palette.primary}B8`
                    : palette.primary,
                  height,
                  opacity: isWebFallbackMotion
                    ? 0.88
                    : isRecording
                      ? 1
                      : 0.58 + liveAudioLevel * 0.2,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.timerBlock}>
          <ThemedText
            type="bodySecondary"
            lightColor={palette.muted}
            darkColor={palette.muted}
            style={styles.voiceLead}
          >
            Leg je moment vast.
          </ThemedText>
          <ThemedText
            type="sectionTitle"
            lightColor={palette.muted}
            darkColor={palette.muted}
            style={styles.timerText}
          >
            {formatDuration(recordingSeconds)} /{" "}
            {formatDuration(MAX_RECORDING_SECONDS)}
          </ThemedText>
        </View>

        <View style={styles.controlsRow}>
          <CaptureIconButton
            icon={isPaused ? "play-arrow" : "pause"}
            size="control"
            tone="surface"
            accessibilityRole="button"
            accessibilityLabel={isPaused ? "Hervat opname" : "Pauzeer opname"}
            onPress={() => void handleTogglePauseResume()}
            disabled={isBusy || !hasActiveRecordingSession}
            style={{ backgroundColor: palette.surfaceHigh }}
          />

          <View style={styles.stopButtonWrap}>
            <PrimaryButton
              label="Stop"
              onPress={() => void handleStop()}
              disabled={
                isBusy ||
                derivedNeedsAttention ||
                (!hasActiveRecordingSession && !hasAudioDraft)
              }
            />
          </View>
        </View>
      </View>

      <ConfirmDialog
        visible={discardVisible}
        title="Opname niet opslaan?"
        message="Deze opname is nog niet vastgelegd."
        cancelLabel="Blijf hier"
        confirmLabel="Niet opslaan"
        processing={recordingActionBusy}
        onCancel={() => setDiscardVisible(false)}
        onConfirm={() => void handleConfirmDiscard()}
      />
      <ProcessingScreen
        visible={Boolean(processingVariant) || retryingDerived}
        variant={processingVariant ?? "audio-entry"}
        backgroundTone="ambient"
        statusOverride={
          retryingDerived ? "Je dag wordt opnieuw bijgewerkt." : undefined
        }
      />
    </ScreenContainer>
  );
}

function buildDerivedStatusMessage(result: DerivedRefreshResult): string {
  if (result.dayJournal.status === "failed") {
    return "Je opname is opgeslagen, maar je dag is nog niet bijgewerkt.";
  }

  if (
    result.weekReflection.status === "failed" ||
    result.monthReflection.status === "failed"
  ) {
    return "Je opname is opgeslagen, maar het bijwerken van je reflecties is niet gelukt.";
  }

  return "Je opname is opgeslagen, maar het bijwerken is nog niet afgerond.";
}

const styles = StyleSheet.create({
  errorBlock: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  content: {
    flex: 1,
    paddingTop: 88,
    alignItems: "center",
  },
  waveCard: {
    width: "100%",
    maxWidth: 360,
    minHeight: 156,
    borderRadius: radius.xl,
    paddingHorizontal: 32,
    paddingVertical: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  waveCardNearEnd: {
    backgroundColor: `${NEAR_END_TONE}1A`,
  },
  waveBar: {
    width: 6,
    borderRadius: radius.pill,
  },
  waveBarFallback: {},
  timerBlock: {
    marginTop: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  voiceLead: {
    textAlign: "center",
  },
  timerText: {
    fontSize: typography.roles.sectionTitle.size,
    lineHeight: typography.roles.sectionTitle.lineHeight,
    textAlign: "center",
  },
  controlsRow: {
    width: "100%",
    marginTop: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stopButtonWrap: {
    flex: 1,
  },
});
