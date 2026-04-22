import {
  getRecordingPermissionsAsync,
  type RecordingOptions,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DestructiveConfirmSheet } from "@/components/feedback/destructive-confirm-sheet";
import {
  ProcessingScreen,
  type ProcessingVariant,
} from "@/components/feedback/processing-screen";
import {
  CaptureBackHeader,
  CaptureErrorStack,
} from "@/components/ui/capture-screen-primitives";
import { ThemedText } from "@/components/themed-text";
import {
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import {
  classifyUnknownError,
  checkCaptureProcessingSession,
  clearCaptureProcessingSession,
  createCaptureProcessingSession,
  createClientProcessingId,
  fetchUserAudioPreferences,
  loadCaptureProcessingSession,
  logCaptureProcessing,
  refreshDerivedAfterCaptureInBackground,
  resumeCaptureEntryProcessing,
  saveCaptureProcessingSession,
  submitAudioEntry,
  updateCaptureProcessingSession,
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
} from "@/src/lib/capture-shared";

const CAPTURE_AUDIO_BIT_RATE = 64_000;
const MAX_RECORDING_MS = 300_000;
const MAX_RECORDING_SECONDS = Math.floor(MAX_RECORDING_MS / 1000);
const MIN_VALID_RECORDING_MS = 5_000;
const MIN_SPEECH_LEVEL = 0.12;
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BASE64_CHARS = Math.ceil((MAX_AUDIO_BYTES * 4) / 3);
const RECOVERY_PENDING_GRACE_MS = 30_000;
const RECOVERY_RECHECK_MS = 3_000;
const NEAR_END_TONE = "#D4A41D";
const WAVEFORM_MAX_BAR_HEIGHT = 88;
const WAVEFORM_BAR_COUNT = 19;
const WAVEFORM_QUIET_MIN_HEIGHT = 2;
const WAVEFORM_QUIET_MAX_HEIGHT = 8;
const WAVEFORM_CLIP_CAP_MAX_HEIGHT = 4;
const WAVEFORM_CLIP_LEVEL_THRESHOLD = 0.94;
const AUDIO_CAPTURE_RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY,
  numberOfChannels: 1,
  bitRate: CAPTURE_AUDIO_BIT_RATE,
  isMeteringEnabled: true,
  web: {
    ...RecordingPresets.HIGH_QUALITY.web,
    bitsPerSecond: CAPTURE_AUDIO_BIT_RATE,
  },
} satisfies RecordingOptions;
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

type PreRecordPhase =
  | "permission_check"
  | "permission_needed"
  | "warming_up"
  | "countdown"
  | null;

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

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function downsampleFrequencyBins(
  source: Uint8Array,
  targetCount: number,
): number[] {
  if (source.length === 0 || targetCount <= 0) {
    return [];
  }

  const chunkSize = source.length / targetCount;
  return Array.from({ length: targetCount }, (_, index) => {
    const start = Math.floor(index * chunkSize);
    const end = Math.max(start + 1, Math.floor((index + 1) * chunkSize));
    let total = 0;
    let count = 0;

    for (let i = start; i < end && i < source.length; i += 1) {
      total += source[i];
      count += 1;
    }

    if (count === 0) {
      return 0;
    }

    return clamp01(total / count / 255);
  });
}

function getWaveformBars({
  durationMillis,
  level,
  isActive,
  frequencyBins,
}: {
  durationMillis: number;
  level: number;
  isActive: boolean;
  frequencyBins: number[];
}): { height: number; clipCapHeight: number }[] {
  const seed = Math.floor(durationMillis / 210);
  const hasAudibleSignal = isActive && level >= MIN_SPEECH_LEVEL;

  return Array.from({ length: WAVEFORM_BAR_COUNT }, (_, index) => {
    const progress = index / (WAVEFORM_BAR_COUNT - 1);
    const pulse = (((seed + index * 2) % 7) - 3) / 3;

    if (!hasAudibleSignal) {
      const quietBase = 0.28 + (1 - Math.abs(progress - 0.5) * 1.4) * 0.16;
      const quietPulse = pulse * 0.12;
      const quietLevel = clamp01(quietBase + quietPulse);
      const quietHeight = Math.round(
        WAVEFORM_QUIET_MIN_HEIGHT +
          quietLevel * (WAVEFORM_QUIET_MAX_HEIGHT - WAVEFORM_QUIET_MIN_HEIGHT),
      );

      return {
        height: quietHeight,
        clipCapHeight: 0,
      };
    }

    const frequencyLevel =
      frequencyBins[index] ??
      clamp01(
        level *
          (0.58 +
            0.22 * (1 - progress) +
            0.2 * (1 - Math.abs(progress - 0.5) * 1.4)),
      );
    const motion = pulse * 0.1;
    const mixedLevel = clamp01(frequencyLevel * 0.82 + level * 0.18 + motion);
    const height = Math.round(
      WAVEFORM_QUIET_MIN_HEIGHT +
        mixedLevel * (WAVEFORM_MAX_BAR_HEIGHT - WAVEFORM_QUIET_MIN_HEIGHT),
    );

    const clipCapHeight =
      mixedLevel >= WAVEFORM_CLIP_LEVEL_THRESHOLD
        ? Math.min(WAVEFORM_CLIP_CAP_MAX_HEIGHT, Math.max(0, height - 2))
        : 0;

    return {
      height,
      clipCapHeight,
    };
  });
}

function revokeAudioObjectUrl(uri: string | null | undefined) {
  if (Platform.OS === "web" && uri?.startsWith("blob:")) {
    URL.revokeObjectURL(uri);
  }
}

export default function CaptureRecordScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();
  const { date } = useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date);
  const returnParams = buildCaptureParams(journalDate);
  const recorder = useAudioRecorder(AUDIO_CAPTURE_RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 250);

  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [retryingDerived, setRetryingDerived] = useState(false);
  const [recordingActionBusy, setRecordingActionBusy] = useState(false);
  const [isPreparingRecording, setIsPreparingRecording] = useState(false);
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
  const [recoveryStatus, setRecoveryStatus] = useState<string | null>(null);
  const [webLiveLevel, setWebLiveLevel] = useState(0);
  const [webFrequencyBins, setWebFrequencyBins] = useState<number[]>([]);
  const [webAnalyserReady, setWebAnalyserReady] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false);
  const [pausedVisualLevel, setPausedVisualLevel] = useState(0);
  const [pausedDurationMillis, setPausedDurationMillis] = useState(0);
  const [preRecordPhase, setPreRecordPhase] = useState<PreRecordPhase>(null);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [draftDurationMillis, setDraftDurationMillis] = useState(0);
  const [draftHasSpeech, setDraftHasSpeech] = useState(false);
  const [saveAudioRecordingsEnabled, setSaveAudioRecordingsEnabled] = useState<
    boolean | null
  >(null);

  const hasStartedRef = useRef(false);
  const startAttemptIdRef = useRef(0);
  const discardOriginRef = useRef<
    "recording" | "paused" | "preparing" | "draft" | null
  >(null);
  const autoStopTriggeredRef = useRef(false);
  const recoveryInFlightRef = useRef(false);
  const recoveryRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const speechDetectedRef = useRef(false);

  const isRecording = recorderState.isRecording;
  const hasActiveRecordingSession =
    isRecording || isPaused || isVoiceSessionActive;
  const hasAudioDraft = Boolean(audioUri);
  const isProcessingBusy =
    submitting || retryingDerived || Boolean(recoveryStatus);
  const isBusy =
    isProcessingBusy || (recordingActionBusy && !isPreparingRecording);
  const derivedNeedsAttention = Boolean(
    savedEntry && derivedResult && derivedResult.status !== "success",
  );
  const recordingSeconds = Math.floor(recorderState.durationMillis / 1000);
  const displayRecordingSeconds = isPaused
    ? Math.floor(pausedDurationMillis / 1000)
    : recordingSeconds;
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
  const maxRecordingMinutesLabel = Math.max(
    1,
    Math.ceil(MAX_RECORDING_SECONDS / 60),
  );
  const isLiveRecordingVisualState =
    (isRecording || isVoiceSessionActive) &&
    !isPaused &&
    !isPreparingRecording &&
    preRecordPhase === null;
  const shouldShowRecordingTimer =
    isPaused || isRecording || isLiveRecordingVisualState;
  const isPermissionHelpVisible =
    micPermissionDenied && !hasActiveRecordingSession && !hasAudioDraft;
  const voiceTitleText = isPreparingRecording
    ? preRecordPhase === "countdown"
      ? "Opname start zo"
      : preRecordPhase === "permission_check"
        ? "Geef toegang tot je microfoon"
        : "Microfoon klaarmaken"
    : isPermissionHelpVisible
      ? "Geef toegang tot je microfoon"
      : isPaused
        ? "Opname gepauzeerd"
        : isLiveRecordingVisualState
          ? "Je opname loopt"
          : "";
  const voiceSubtitleText = isPreparingRecording
    ? preRecordPhase === "countdown"
      ? "Spreek zodra de teller klaar is."
      : preRecordPhase === "permission_check"
        ? "Daarna start de opname vanzelf."
        : "Een moment geduld."
    : isPermissionHelpVisible
      ? "Daarna start de opname vanzelf."
      : isPaused
        ? "Opname gepauzeerd. Hervat wanneer je verder wilt."
        : isLiveRecordingVisualState
          ? `Spreek rustig. Je hebt maximaal ${maxRecordingMinutesLabel} minuten.`
          : "";
  const voiceMotionScale = 1 + liveAudioLevel * 0.07;
  const voiceMotionOpacity = isRecording ? 0.76 + liveAudioLevel * 0.24 : 0.45;
  const canTogglePauseResume = isPaused || isRecording;
  const showAudioStorageNotice = saveAudioRecordingsEnabled === false;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const prefs = await fetchUserAudioPreferences();
        if (!cancelled) {
          setSaveAudioRecordingsEnabled(prefs.save_audio_recordings);
        }
      } catch {
        if (!cancelled) {
          setSaveAudioRecordingsEnabled(null);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const goBackToStart = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({ pathname: "/capture", params: returnParams });
  }, [returnParams]);

  const cancelPreparingRecording = useCallback(() => {
    startAttemptIdRef.current += 1;
    setIsPreparingRecording(false);
    setRecordingActionBusy(false);
    setIsVoiceSessionActive(false);
    setPreRecordPhase(null);
    setCountdownValue(null);
    void recorder.stop().catch(() => {
      // Best effort: preparing may not have initialized the recorder yet.
    });
  }, [recorder]);

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
      const capturedDurationMillis = isPaused
        ? pausedDurationMillis
        : recorderState.durationMillis;
      setDraftDurationMillis(capturedDurationMillis);
      setDraftHasSpeech(speechDetectedRef.current);
      setIsPreparingRecording(false);
      setIsPaused(false);
      setIsVoiceSessionActive(false);
      setPausedVisualLevel(0);
      setPausedDurationMillis(0);
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
  }, [isPaused, pausedDurationMillis, recorder, recorderState.durationMillis, recorderState.url]);

  const startRecording = useCallback(async () => {
    const attemptId = startAttemptIdRef.current + 1;
    startAttemptIdRef.current = attemptId;
    setError(null);
    setMicPermissionDenied(false);
    setIsPreparingRecording(true);
    setRecordingActionBusy(true);
    setPreRecordPhase("permission_check");
    setCountdownValue(null);

    try {
      const permission = await getRecordingPermissionsAsync();
      let granted = permission.granted;

      if (!granted) {
        const requested = await requestRecordingPermissionsAsync();
        granted = requested.granted;
      }

      if (!granted) {
        setPreRecordPhase("permission_needed");
        setIsPreparingRecording(false);
        setIsVoiceSessionActive(false);
        setMicPermissionDenied(true);
        return;
      }

      if (startAttemptIdRef.current !== attemptId) {
        return;
      }

      setPreRecordPhase("warming_up");
      await recorder.prepareToRecordAsync();

      if (startAttemptIdRef.current !== attemptId) {
        await recorder.stop().catch(() => {
          // Best effort: cancel can race with recorder preparation.
        });
        return;
      }

      setPreRecordPhase("countdown");
      const countdownSequence = [3, 2, 1];
      for (const value of countdownSequence) {
        if (startAttemptIdRef.current !== attemptId) {
          return;
        }
        setCountdownValue(value);
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000);
        });
      }

      if (startAttemptIdRef.current !== attemptId) {
        return;
      }

      autoStopTriggeredRef.current = false;
      setAudioUri(null);
      setDraftDurationMillis(0);
      setDraftHasSpeech(false);
      setIsPaused(false);
      setPausedVisualLevel(0);
      setPausedDurationMillis(0);
      speechDetectedRef.current = false;
      setCountdownValue(null);
      setPreRecordPhase(null);
      setIsPreparingRecording(false);
      recorder.record();
      setIsVoiceSessionActive(true);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setIsPreparingRecording(false);
      setIsVoiceSessionActive(false);
      setPreRecordPhase(null);
      setCountdownValue(null);
      setMicPermissionDenied(false);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      if (startAttemptIdRef.current !== attemptId || !recorderState.isRecording) {
        setRecordingActionBusy(false);
      }
    }
  }, [recorder, recorderState.isRecording]);

  const resetCaptureAudioState = useCallback(async () => {
    const existingAudioUri = audioUri;
    let stoppedAudioUri: string | null = null;

    try {
      if (hasActiveRecordingSession) {
        await recorder.stop();
        stoppedAudioUri = recorder.uri ?? recorderState.url;
      }
    } catch {
      // Best effort: cancel should leave the UI clean even if the recorder is already stopped.
    }

    revokeAudioObjectUrl(existingAudioUri);
    revokeAudioObjectUrl(stoppedAudioUri);

    setAudioUri(null);
    setDraftDurationMillis(0);
    setDraftHasSpeech(false);
    setSavedEntry(null);
    setDerivedResult(null);
    startAttemptIdRef.current += 1;
    discardOriginRef.current = null;
    setIsPreparingRecording(false);
    setIsPaused(false);
    setIsVoiceSessionActive(false);
    setPausedVisualLevel(0);
    setPausedDurationMillis(0);
    setWebLiveLevel(0);
    setWebFrequencyBins([]);
    setWebAnalyserReady(true);
    setPreRecordPhase(null);
    setCountdownValue(null);
    setMicPermissionDenied(false);
    setError(null);
    setProcessingVariant(null);
    setRecoveryStatus(null);
    autoStopTriggeredRef.current = false;
    speechDetectedRef.current = false;
  }, [audioUri, hasActiveRecordingSession, recorder, recorderState.url]);

  const returnToCaptureWithValidation = useCallback(
    async (validation: "short" | "no_speech") => {
      await resetCaptureAudioState();
      router.replace({
        pathname: "/capture",
        params: {
          ...(returnParams ?? {}),
          validation,
        },
      });
    },
    [resetCaptureAudioState, returnParams],
  );

  const isRecordingValidForSubmit = useCallback(
    (durationMillis: number, hasSpeech: boolean): boolean => {
      if (durationMillis < MIN_VALID_RECORDING_MS) {
        return false;
      }
      if (!hasSpeech) {
        return false;
      }
      return true;
    },
    [],
  );

  const goToEntry = useCallback((entryId: string, nextJournalDate: string) => {
    router.replace({
      pathname: "/entry/[id]",
      params: {
        id: entryId,
        source: "capture",
        date: nextJournalDate,
      },
    });
  }, []);

  const refreshDerivedQuietly = useCallback(
    (nextJournalDate: string, clientProcessingId: string) => {
      void refreshDerivedAfterCaptureInBackground(nextJournalDate)
        .then((result) => {
          logCaptureProcessing("completion", {
            clientProcessingId,
            journalDate: nextJournalDate,
            derivedStatus: result.status,
          });
        })
        .catch((nextError) => {
          logCaptureProcessing("terminal_failure", {
            clientProcessingId,
            journalDate: nextJournalDate,
            reason:
              nextError instanceof Error
                ? nextError.message
                : "Derived refresh failed.",
          });
        });
    },
    [],
  );

  const recoverCaptureProcessing = useCallback(
    async (reason: string) => {
      if (
        submitting ||
        retryingDerived ||
        recordingActionBusy ||
        recoveryInFlightRef.current
      ) {
        return;
      }

      const session = loadCaptureProcessingSession();
      if (!session || session.sourceType !== "audio") {
        return;
      }

      recoveryInFlightRef.current = true;
      setError(null);
      setRecoveryStatus("We halen je moment terug.");
      setProcessingVariant("audio-entry");

      try {
        const check = await checkCaptureProcessingSession(session);

        if (check.status === "recovery-unavailable") {
          clearCaptureProcessingSession(session.clientProcessingId);
          setRecoveryStatus(null);
          setProcessingVariant(null);
          return;
        }

        if (check.status === "completed") {
          updateCaptureProcessingSession({
            phase: "server_acknowledged",
            rawEntryId: check.rawEntryId,
            normalizedEntryId: check.normalizedEntryId,
          });
          logCaptureProcessing("recovery_completed", {
            reason,
            clientProcessingId: session.clientProcessingId,
            rawEntryId: check.rawEntryId,
            normalizedEntryId: check.normalizedEntryId,
          });
          setRecoveryStatus("Je moment is opgeslagen.");
          clearCaptureProcessingSession(session.clientProcessingId);
          goToEntry(check.normalizedEntryId, check.journalDate);
          refreshDerivedQuietly(check.journalDate, session.clientProcessingId);
          return;
        }

        if (check.status === "raw-only") {
          const nextSession =
            updateCaptureProcessingSession({
              phase: "submitting",
              rawEntryId: check.rawEntryId,
              retryCount: session.retryCount + 1,
            }) ?? session;
          logCaptureProcessing("retry", {
            reason,
            clientProcessingId: session.clientProcessingId,
            rawEntryId: check.rawEntryId,
          });
          const result = await resumeCaptureEntryProcessing({
            clientProcessingId: nextSession.clientProcessingId,
            sourceType: nextSession.sourceType,
            capturedAt: nextSession.capturedAt,
            journalDate: nextSession.journalDate,
            timezoneOffsetMinutes: nextSession.timezoneOffsetMinutes,
            deferDerived: true,
          });
          updateCaptureProcessingSession({
            phase: "server_acknowledged",
            rawEntryId: result.rawEntryId,
            normalizedEntryId: result.normalizedEntryId,
          });
          setRecoveryStatus("Je moment is opgeslagen.");
          clearCaptureProcessingSession(session.clientProcessingId);
          goToEntry(result.normalizedEntryId, result.journalDate);
          refreshDerivedQuietly(result.journalDate, session.clientProcessingId);
          return;
        }

        const updatedAtMs = new Date(session.updatedAt).getTime();
        if (
          Number.isFinite(updatedAtMs) &&
          Date.now() - updatedAtMs < RECOVERY_PENDING_GRACE_MS
        ) {
          if (recoveryRetryTimeoutRef.current) {
            clearTimeout(recoveryRetryTimeoutRef.current);
          }
          recoveryRetryTimeoutRef.current = setTimeout(() => {
            void recoverCaptureProcessing("pending");
          }, RECOVERY_RECHECK_MS);
          return;
        }

        updateCaptureProcessingSession({
          phase: "failed",
          failureReason: "not_found",
        });
        clearCaptureProcessingSession(session.clientProcessingId);
        setRecoveryStatus(null);
        setProcessingVariant(null);
        setError({
          message: "Deze opname is niet veilig verstuurd. Neem opnieuw op.",
          retryable: true,
          requestId: null,
        });
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        const failureReason = parsed.code ?? parsed.message;
        setRecoveryStatus(null);
        setProcessingVariant(null);
        updateCaptureProcessingSession({
          phase: "failed",
          failureReason: parsed.nonRecoverable
            ? `non_recoverable:${failureReason}`
            : failureReason,
        });
        setError({
          message: parsed.nonRecoverable
            ? "Deze opname kan niet automatisch worden hersteld. Neem opnieuw op."
            : parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
      } finally {
        recoveryInFlightRef.current = false;
      }
    },
    [
      goToEntry,
      recordingActionBusy,
      refreshDerivedQuietly,
      retryingDerived,
      submitting,
    ],
  );

  const submitCapturedAudio = useCallback(
    async (uri: string) => {
      setSubmitting(true);
      setError(null);
      setMicPermissionDenied(false);
      setRecoveryStatus(null);
      setProcessingVariant("audio-entry");

      try {
        const captureContext = createCaptureContext(
          new Date(),
          journalDate ?? undefined,
        );
        const clientProcessingId = createClientProcessingId("audio");
        const session = saveCaptureProcessingSession({
          ...createCaptureProcessingSession({
            clientProcessingId,
            sourceType: "audio",
            capturedAt: captureContext.capturedAt,
            journalDate: captureContext.journalDate,
            timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
          }),
          phase: "submitting",
        });
        logCaptureProcessing("submit_start", {
          clientProcessingId: session.clientProcessingId,
          sourceType: session.sourceType,
          journalDate: session.journalDate,
        });

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
          clientProcessingId,
        });

        updateCaptureProcessingSession({
          phase: "server_acknowledged",
          rawEntryId: result.rawEntryId,
          normalizedEntryId: result.normalizedEntryId,
        });
        logCaptureProcessing("server_ack", {
          clientProcessingId,
          rawEntryId: result.rawEntryId,
          normalizedEntryId: result.normalizedEntryId,
        });
        setAudioUri(null);
        setSavedEntry(result);
        clearCaptureProcessingSession(clientProcessingId);
        goToEntry(result.normalizedEntryId, result.journalDate);
        refreshDerivedQuietly(result.journalDate, clientProcessingId);
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        updateCaptureProcessingSession({
          phase: "failed",
          failureReason: parsed.nonRecoverable
            ? `non_recoverable:${parsed.code ?? parsed.message}`
            : parsed.code ?? parsed.message,
        });
        setError({
          message: parsed.nonRecoverable
            ? "Deze opname kan niet automatisch worden hersteld. Neem opnieuw op."
            : parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
      } finally {
        setSubmitting(false);
        setProcessingVariant(null);
      }
    },
    [goToEntry, journalDate, refreshDerivedQuietly],
  );

  useEffect(() => {
    void recoverCaptureProcessing("mount");

    return () => {
      if (recoveryRetryTimeoutRef.current) {
        clearTimeout(recoveryRetryTimeoutRef.current);
      }
    };
  }, [recoverCaptureProcessing]);

  useFocusEffect(
    useCallback(() => {
      void recoverCaptureProcessing("focus");
    }, [recoverCaptureProcessing]),
  );

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void recoverCaptureProcessing("appstate");
      }
    });

    if (Platform.OS !== "web") {
      return () => appStateSubscription.remove();
    }

    const handleFocus = () => {
      void recoverCaptureProcessing("window_focus");
    };
    const handleVisibilityChange = () => {
      if (globalThis.document?.visibilityState === "visible") {
        void recoverCaptureProcessing("visibilitychange");
      }
    };

    globalThis.window?.addEventListener("focus", handleFocus);
    globalThis.document?.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      appStateSubscription.remove();
      globalThis.window?.removeEventListener("focus", handleFocus);
      globalThis.document?.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [recoverCaptureProcessing]);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    if (loadCaptureProcessingSession()?.sourceType === "audio") {
      return;
    }

    hasStartedRef.current = true;
    void startRecording();
  }, [startRecording]);

  useEffect(() => {
    if (isRecording) {
      setIsPreparingRecording(false);
      setRecordingActionBusy(false);
      setIsPaused(false);
      setIsVoiceSessionActive(true);
      setPreRecordPhase(null);
      setCountdownValue(null);
    }
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && liveAudioLevel >= MIN_SPEECH_LEVEL) {
      speechDetectedRef.current = true;
    }
  }, [isRecording, liveAudioLevel]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      setWebLiveLevel(0);
      setWebFrequencyBins([]);
      return;
    }

    if (!isRecording) {
      setWebLiveLevel(0);
      setWebFrequencyBins([]);
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
          frequencyBinCount: number;
          smoothingTimeConstant: number;
          getByteTimeDomainData: (array: Uint8Array) => void;
          getByteFrequencyData: (array: Uint8Array) => void;
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
        const frequencyBuffer = new Uint8Array(createdAnalyser.frequencyBinCount);

        const frame = () => {
          if (cancelled) {
            return;
          }

          createdAnalyser.getByteTimeDomainData(buffer);
          createdAnalyser.getByteFrequencyData(frequencyBuffer);
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
          setWebFrequencyBins(
            downsampleFrequencyBins(frequencyBuffer, WAVEFORM_BAR_COUNT),
          );
          rafId = requestAnimationFrame(frame);
        };

        frame();
      } catch {
        if (!cancelled) {
          setWebAnalyserReady(false);
          setWebLiveLevel(0);
          setWebFrequencyBins([]);
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
      void recorder.stop().catch(() => {
        // Ignore teardown race conditions when recorder is not fully initialized.
      });
    };
  }, [recorder]);

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

    if (hasActiveRecordingSession) {
      const capturedDurationMillis = isPaused
        ? pausedDurationMillis
        : recorderState.durationMillis;
      const capturedHasSpeech = speechDetectedRef.current;
      const uri = await stopRecorderAndStoreUri();
      if (!uri) {
        return;
      }

      if (!isRecordingValidForSubmit(capturedDurationMillis, capturedHasSpeech)) {
        if (capturedDurationMillis < MIN_VALID_RECORDING_MS) {
          await returnToCaptureWithValidation("short");
          return;
        }

        await returnToCaptureWithValidation("no_speech");
        return;
      }

      await submitCapturedAudio(uri);
      return;
    }

    if (audioUri) {
      if (!isRecordingValidForSubmit(draftDurationMillis, draftHasSpeech)) {
        if (draftDurationMillis < MIN_VALID_RECORDING_MS) {
          await returnToCaptureWithValidation("short");
          return;
        }

        await returnToCaptureWithValidation("no_speech");
        return;
      }

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
    if (isBusy || !canTogglePauseResume) {
      return;
    }

    setError(null);

    try {
      if (isPaused) {
        recorder.record();
        setIsPaused(false);
        setIsVoiceSessionActive(true);
        setPausedVisualLevel(0);
        return;
      }

      setPausedVisualLevel(liveAudioLevel);
      setPausedDurationMillis(recorderState.durationMillis);
      recorder.pause();
      setIsPaused(true);
      setIsVoiceSessionActive(true);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    }
  }

  async function openDiscardSheet() {
    if (isProcessingBusy || (recordingActionBusy && !isPreparingRecording)) {
      return;
    }

    setError(null);

    if (isRecording) {
      discardOriginRef.current = "recording";
      setPausedVisualLevel(liveAudioLevel);
      setPausedDurationMillis(recorderState.durationMillis);

      try {
        recorder.pause();
        setIsPaused(true);
        setIsVoiceSessionActive(true);
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        setError({
          message: parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
        discardOriginRef.current = null;
        return;
      }
    } else if (isPaused) {
      discardOriginRef.current = "paused";
    } else if (isPreparingRecording) {
      discardOriginRef.current = "preparing";
      cancelPreparingRecording();
    } else {
      discardOriginRef.current = "draft";
    }

    setDiscardVisible(true);
  }

  async function restoreAfterDiscardCancel() {
    if (recordingActionBusy) {
      return;
    }

    const origin = discardOriginRef.current;
    discardOriginRef.current = null;
    setDiscardVisible(false);

    if (origin === "recording") {
      try {
        recorder.record();
        setIsPaused(false);
        setIsVoiceSessionActive(true);
        setPausedVisualLevel(0);
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        setError({
          message: parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
      }
      return;
    }

    if (origin === "preparing" && !hasAudioDraft && !hasActiveRecordingSession) {
      void startRecording();
    }
  }

  function handleBack() {
    if (isProcessingBusy || (recordingActionBusy && !isPreparingRecording)) {
      return;
    }

    if (hasActiveRecordingSession || hasAudioDraft || isPreparingRecording) {
      void openDiscardSheet();
      return;
    }

    goBackToStart();
  }

  async function handleConfirmDiscard() {
    setDiscardVisible(false);
    setRecordingActionBusy(true);

    try {
      await resetCaptureAudioState();
    } finally {
      setRecordingActionBusy(false);
      goBackToStart();
    }
  }

  const displayDurationMillis = isPaused
    ? pausedDurationMillis
    : recorderState.durationMillis;

  const waveformBars = getWaveformBars({
    durationMillis: displayDurationMillis,
    level: isPaused ? pausedVisualLevel : liveAudioLevel,
    isActive: isRecording,
    frequencyBins: isRecording && Platform.OS === "web" ? webFrequencyBins : [],
  });

  return (
    <ScreenContainer
      backgroundTone="flat"
      fixedHeader={
        <CaptureBackHeader
          topInset={insets.top}
          onBack={handleBack}
          iconName="close"
          accessibilityLabel="Opname annuleren"
        />
      }
    >
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      {error ? (
        <CaptureErrorStack>
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
          ) : error.retryable && !hasActiveRecordingSession && !hasAudioDraft ? (
            <SecondaryButton
              label="Opnieuw opnemen"
              onPress={() => void startRecording()}
              disabled={isBusy}
            />
          ) : null}
        </CaptureErrorStack>
      ) : null}
      {derivedNeedsAttention && derivedResult ? (
        <CaptureErrorStack>
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
        </CaptureErrorStack>
      ) : null}

      <View
        style={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      >
        <View
          style={[
            styles.waveCard,
            isNearRecordingEnd ? styles.waveCardNearEnd : null,
          ]}
        >
          <View
            style={[
              styles.waveMotionLayer,
              {
                transform: [
                  {
                    scale:
                      isWebLiveMotion && !isPaused ? voiceMotionScale : 1,
                  },
                ],
                opacity: isWebLiveMotion
                  ? voiceMotionOpacity
                  : isRecording
                    ? 0.92
                    : 0.78,
              },
            ]}
          >
            {waveformBars.map((bar, index) => (
              <View
                key={`wave-${index}`}
                style={[
                  styles.waveBar,
                  isWebFallbackMotion ? styles.waveBarFallback : null,
                  {
                    opacity: isWebFallbackMotion
                      ? 0.88
                      : isRecording
                        ? 1
                        : 0.58 + liveAudioLevel * 0.2,
                  },
                ]}
              >
                <View
                  style={[
                    styles.waveBarBody,
                    {
                      backgroundColor: isWebFallbackMotion
                        ? `${palette.primary}B8`
                        : palette.primary,
                      height: Math.max(2, bar.height - bar.clipCapHeight),
                    },
                  ]}
                />
                {bar.clipCapHeight > 0 ? (
                  <View
                    style={[
                      styles.waveBarClip,
                      {
                        backgroundColor: palette.destructiveSoftText,
                        height: bar.clipCapHeight,
                      },
                    ]}
                  />
                ) : null}
              </View>
            ))}
          </View>
          <View style={styles.timerBlock}>
            <View style={styles.statusBlock}>
              <ThemedText
                type="sectionTitle"
                lightColor={palette.muted}
                darkColor={palette.muted}
                style={styles.voiceTitle}
              >
                {voiceTitleText || " "}
              </ThemedText>
              <ThemedText
                type="meta"
                lightColor={palette.muted}
                darkColor={palette.muted}
                style={styles.voiceSubtitle}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {voiceSubtitleText || " "}
              </ThemedText>
              <View style={styles.countdownSlot}>
                {isPreparingRecording && preRecordPhase === "countdown" ? (
                  <View style={styles.countdownRow}>
                    {[3, 2, 1].map((value) => {
                      const isActive = countdownValue === value;

                      return (
                        <ThemedText
                          key={`countdown-${value}`}
                          type={isActive ? "screenTitle" : "sectionTitle"}
                          lightColor={isActive ? palette.primary : palette.mutedSoft}
                          darkColor={isActive ? palette.primary : palette.mutedSoft}
                          style={styles.countdownDigit}
                        >
                          {value}
                        </ThemedText>
                      );
                    })}
                  </View>
                ) : shouldShowRecordingTimer ? (
                  <ThemedText
                    type="screenTitle"
                    lightColor={palette.primary}
                    darkColor={palette.primary}
                    style={styles.timerText}
                  >
                    {formatDuration(displayRecordingSeconds)}
                  </ThemedText>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.controlsStack}>
          {showAudioStorageNotice ? (
            <ThemedText
              type="caption"
              lightColor={palette.mutedSoft}
              darkColor={palette.mutedSoft}
              style={styles.storageNotice}
            >
              Audio wordt niet bewaard. Alleen de uitgeschreven opname slaan we op.
            </ThemedText>
          ) : null}

          <PrimaryButton
            label={isPermissionHelpVisible ? "Microfoon opnieuw proberen" : "Opname afronden"}
            icon={isPermissionHelpVisible ? undefined : "stop"}
            className="w-full"
            onPress={() => {
              if (isPermissionHelpVisible) {
                void startRecording();
                return;
              }

              void handleStop();
            }}
            disabled={
              isBusy ||
              isPreparingRecording ||
              derivedNeedsAttention ||
              (!isPermissionHelpVisible &&
                !hasActiveRecordingSession &&
                !hasAudioDraft)
            }
          />

          <SecondaryButton
            label={isPermissionHelpVisible ? "Ga terug" : isPaused ? "Opname hervatten" : "Pauze"}
            icon={
              isPermissionHelpVisible
                ? undefined
                : isPaused
                  ? "fiber-manual-record"
                  : "pause"
            }
            className="w-full"
            onPress={() => {
              if (isPermissionHelpVisible) {
                handleBack();
                return;
              }

              void handleTogglePauseResume();
            }}
            disabled={
              isPermissionHelpVisible
                ? isBusy
                : isBusy || isPreparingRecording || !canTogglePauseResume
            }
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Annuleer opname"
            onPress={handleBack}
            disabled={
              isProcessingBusy || (recordingActionBusy && !isPreparingRecording)
            }
            style={[
              styles.cancelAction,
              isProcessingBusy || (recordingActionBusy && !isPreparingRecording)
                ? styles.cancelDisabled
                : null,
            ]}
          >
            <ThemedText
              type="caption"
              lightColor={palette.destructiveSoftText}
              darkColor={palette.destructiveSoftText}
              style={styles.cancelActionLabel}
            >
              Annuleer
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <DestructiveConfirmSheet
        visible={discardVisible}
        title="Opname verwijderen?"
        message="Deze opname is nog niet vastgelegd. Als je nu stopt, wordt ze verwijderd."
        secondaryLabel="Doorgaan met opnemen"
        confirmLabel="Opname verwijderen"
        processing={recordingActionBusy}
        onCancel={() => void restoreAfterDiscardCancel()}
        onConfirm={() => void handleConfirmDiscard()}
      />
      <ProcessingScreen
        visible={Boolean(processingVariant) || retryingDerived || Boolean(recoveryStatus)}
        variant={processingVariant ?? "audio-entry"}
        backgroundTone="ambient"
        statusOverride={
          recoveryStatus ??
          (retryingDerived ? "Je dag wordt opnieuw bijgewerkt." : undefined)
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
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  waveMotionLayer: {
    height: WAVEFORM_MAX_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: spacing.xs,
  },
  waveCardNearEnd: {
    backgroundColor: `${NEAR_END_TONE}1A`,
  },
  waveBar: {
    width: 6,
    minHeight: WAVEFORM_QUIET_MIN_HEIGHT,
    justifyContent: "flex-end",
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  waveBarBody: {
    width: "100%",
    borderRadius: radius.pill,
  },
  waveBarClip: {
    width: "100%",
  },
  waveBarFallback: {},
  timerBlock: {
    marginTop: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 176,
    width: "100%",
    justifyContent: "flex-start",
  },
  statusBlock: {
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 126,
    width: "100%",
  },
  voiceTitle: {
    textAlign: "center",
    minHeight: typography.roles.sectionTitle.lineHeight,
  },
  voiceSubtitle: {
    textAlign: "center",
    minHeight: typography.roles.meta.lineHeight * 2,
    maxWidth: 320,
  },
  timerText: {
    fontSize: typography.roles.screenTitle.size,
    lineHeight: typography.roles.screenTitle.lineHeight,
    textAlign: "center",
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
  },
  countdownSlot: {
    minHeight: 44,
    marginTop: spacing.md,
    justifyContent: "center",
  },
  countdownDigit: {
    minWidth: 22,
    textAlign: "center",
  },
  controlsStack: {
    width: "100%",
    marginTop: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
  },
  storageNotice: {
    textAlign: "center",
    maxWidth: 320,
    marginBottom: spacing.xs,
  },
  cancelAction: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  cancelDisabled: {
    opacity: 0.5,
  },
  cancelActionLabel: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
