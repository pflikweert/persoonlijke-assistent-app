import {
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { PrimaryButton, ScreenContainer, StateBlock, TextAreaField } from '@/components/ui/screen-primitives';
import { classifyUnknownError, getUtcTodayDate, submitAudioEntry, submitTextEntry } from '@/services';
import { colorTokens, radius, shadows, spacing } from '@/theme';

const MAX_RECORDING_MS = 90_000;
const MAX_AUDIO_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BASE64_CHARS = Math.ceil((MAX_AUDIO_BYTES * 4) / 3);

function mimeTypeFromUri(uri: string): string {
  const normalized = uri.toLowerCase();

  if (normalized.endsWith('.webm')) {
    return 'audio/webm';
  }
  if (normalized.endsWith('.wav')) {
    return 'audio/wav';
  }
  if (normalized.endsWith('.mp3')) {
    return 'audio/mpeg';
  }
  if (normalized.endsWith('.ogg')) {
    return 'audio/ogg';
  }
  if (normalized.endsWith('.mp4')) {
    return 'audio/mp4';
  }
  if (normalized.endsWith('.m4a')) {
    return 'audio/m4a';
  }

  return Platform.OS === 'web' ? 'audio/webm' : 'audio/m4a';
}

function readWebBlobAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Kon web-opname niet lezen.'));
    };

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Web-opname leverde geen geldige data op.'));
        return;
      }

      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };

    reader.readAsDataURL(blob);
  });
}

async function audioUriToBase64(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('Kon web-opname niet ophalen.');
    }

    const blob = await response.blob();
    return readWebBlobAsBase64(blob);
  }

  return readAsStringAsync(uri, { encoding: EncodingType.Base64 });
}

function getWaveformHeights(durationMillis: number): number[] {
  const seed = Math.floor(durationMillis / 250);
  const base = [18, 30, 44, 56, 40, 28, 16];
  return base.map((height, index) => {
    const pulse = ((seed + index * 3) % 6) - 3;
    return Math.max(12, height + pulse * 3);
  });
}

export default function CaptureScreen() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);

  const [rawText, setRawText] = useState('');
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recordingActionBusy, setRecordingActionBusy] = useState(false);
  const [error, setError] = useState<{
    message: string;
    retryable: boolean;
    requestId: string | null;
  } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isTypingFocused, setIsTypingFocused] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const autoStopTriggeredRef = useRef(false);

  const isRecording = recorderState.isRecording;
  const recordingSeconds = Math.floor(recorderState.durationMillis / 1000);
  const hasTextDraft = rawText.trim().length > 0;
  const hasAudioDraft = Boolean(audioUri);
  const isBusy = submitting || recordingActionBusy;

  const uiMode: 'idle' | 'voice' | 'typing' =
    isRecording || hasAudioDraft ? 'voice' : isTypingFocused || hasTextDraft ? 'typing' : 'idle';

  const handleStopRecording = useCallback(
    async (source: 'manual' | 'auto'): Promise<string | null> => {
      setRecordingActionBusy(true);

      try {
        await recorder.stop();
        const uri = recorder.uri ?? recorderState.url;

        if (!uri) {
          throw new Error('Opname is gestopt, maar bestand ontbreekt.');
        }

        setAudioUri(uri);
        if (source === 'auto') {
          setStatus('Opname is automatisch gestopt na 90 seconden.');
        }
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
    [recorder, recorderState.url]
  );

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
    void handleStopRecording('auto');
  }, [handleStopRecording, isRecording, recorderState.durationMillis, recordingActionBusy]);

  async function handleStartRecording() {
    setError(null);
    setStatus(null);
    setRecordingActionBusy(true);

    try {
      const permission = await getRecordingPermissionsAsync();
      let granted = permission.granted;

      if (!granted) {
        const requested = await requestRecordingPermissionsAsync();
        granted = requested.granted;
      }

      if (!granted) {
        throw new Error('Microfoontoegang is nodig om audio op te nemen.');
      }

      await recorder.prepareToRecordAsync();
      autoStopTriggeredRef.current = false;
      setAudioUri(null);
      recorder.record();
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
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
    setStatus(null);

    if (isRecording) {
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
    setIsTypingFocused(false);

    if (uiMode === 'typing') {
      setRawText('');
    }
  }

  function handleBackFromCapture() {
    if (uiMode === 'idle') {
      router.replace('/');
      return;
    }
    void handleCancelCurrentMode();
  }

  async function handleSubmitText() {
    setSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      await submitTextEntry({
        rawText,
        capturedAt: new Date().toISOString(),
      });

      setRawText('');
      setIsTypingFocused(false);
      router.replace({
        pathname: '/day/[date]',
        params: { date: getUtcTodayDate(), processed: '1' },
      });
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitAudio() {
    if (!audioUri) {
      setError({
        message: 'Neem eerst een opname op.',
        retryable: false,
        requestId: null,
      });
      return;
    }

    setSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      const audioBase64 = await audioUriToBase64(audioUri);

      if (audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
        throw new Error('Opname is te groot. Neem een kortere opname op.');
      }

      await submitAudioEntry({
        audioBase64,
        audioMimeType: mimeTypeFromUri(audioUri),
        capturedAt: new Date().toISOString(),
      });

      setAudioUri(null);
      router.replace({
        pathname: '/day/[date]',
        params: { date: getUtcTodayDate(), processed: '1' },
      });
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFinishVoice() {
    if (isRecording) {
      setSubmitting(true);
      setError(null);
      setStatus('Opname verwerken...');
      const uri = await handleStopRecording('manual');

      if (!uri) {
        setSubmitting(false);
        return;
      }

      try {
        const audioBase64 = await audioUriToBase64(uri);

        if (audioBase64.length > MAX_AUDIO_BASE64_CHARS) {
          throw new Error('Opname is te groot. Neem een kortere opname op.');
        }

        await submitAudioEntry({
          audioBase64,
          audioMimeType: mimeTypeFromUri(uri),
          capturedAt: new Date().toISOString(),
        });

        setAudioUri(null);
        router.replace({
          pathname: '/day/[date]',
          params: { date: getUtcTodayDate(), processed: '1' },
        });
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        setError({
          message: parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
      } finally {
        setSubmitting(false);
      }

      return;
    }

    await handleSubmitAudio();
  }

  return (
    <ScreenContainer style={styles.screen}>
      <ThemedView style={styles.topBar}>
        <Pressable
          onPress={handleBackFromCapture}
          disabled={recordingActionBusy}
          style={[styles.topAction, recordingActionBusy && styles.topActionDisabled]}>
          <MaterialIcons name="arrow-back" size={18} color={colorTokens.light.primary} />
          <ThemedText type="bodySecondary">{uiMode === 'idle' ? 'Terug' : 'Annuleer'}</ThemedText>
        </Pressable>

        {uiMode === 'typing' ? (
          <Pressable
            onPress={() => void handleSubmitText()}
            disabled={isBusy || !hasTextDraft}
            style={[styles.topAction, styles.topPrimaryAction, (isBusy || !hasTextDraft) && styles.topActionDisabled]}>
            <ThemedText type="defaultSemiBold">{submitting ? 'Opslaan...' : 'Klaar'}</ThemedText>
          </Pressable>
        ) : uiMode === 'idle' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => setMenuVisible(true)}
            style={[styles.menuButton, { backgroundColor: colorTokens.light.surfaceLow }]}>
            <MaterialIcons name="menu" size={20} color={colorTokens.light.primary} />
          </Pressable>
        ) : (
          <ThemedView style={styles.topBarSpacer} />
        )}
      </ThemedView>

      {error ? (
        <StateBlock
          tone="error"
          message={error.message}
          detail={
            error.retryable
              ? 'Tijdelijke fout. Probeer het zo opnieuw.'
              : 'Controleer je invoer of login en probeer daarna opnieuw.'
          }
          meta={error.requestId ? `Referentie: ${error.requestId}` : null}
        />
      ) : null}

      {status && !error && uiMode === 'voice' && (isRecording || submitting) ? (
        <ThemedText type="caption" style={styles.statusText}>
          {status}
        </ThemedText>
      ) : null}

      {uiMode === 'voice' ? (
        <ThemedView style={styles.voiceCanvas}>
          <ThemedView style={styles.waveCluster}>
            {getWaveformHeights(recorderState.durationMillis).map((height, index) => (
              <ThemedView
                key={`wave-${index}`}
                style={[
                  styles.waveBar,
                  { height, opacity: isRecording ? 1 : 0.45 },
                ]}
              />
            ))}
          </ThemedView>

          <ThemedText type="bodySecondary" style={styles.voiceLead}>
            Aan het luisteren...
          </ThemedText>

          <ThemedText type="bodySecondary" style={styles.voiceHint}>
            Opname loopt: {recordingSeconds}s / 90s
          </ThemedText>

          <ThemedView style={styles.voicePrimaryZone}>
            <PrimaryButton
              disabled={isBusy || (!isRecording && !hasAudioDraft)}
              onPress={() => void handleFinishVoice()}
              label={isRecording ? 'Klaar' : submitting ? 'Opname verwerken...' : 'Opname opslaan'}
            />
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.idleTypingCanvas}>
          {uiMode === 'idle' ? (
            <Pressable
              style={styles.idleTapCanvas}
              disabled={isBusy}
              onPress={() => {
                setIsTypingFocused(true);
                setError(null);
                setStatus(null);
              }}>
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
            <TextAreaField
              onChangeText={setRawText}
              placeholder="Wat houdt je bezig?"
              value={rawText}
              autoFocus
              editable={!isBusy}
              style={[styles.captureInput, styles.captureInputTyping]}
            />
          )}

          <ThemedView style={styles.micZone}>
            <Pressable
              onPress={() => void handleStartRecording()}
              disabled={isBusy}
              style={[
                uiMode === 'idle' ? styles.micPrimary : styles.micSecondary,
                isBusy && styles.micDisabled,
              ]}>
              <MaterialIcons
                name="mic"
                size={uiMode === 'idle' ? 34 : 21}
                color={uiMode === 'idle' ? '#FFFFFF' : colorTokens.light.primary}
              />
            </Pressable>
          </ThemedView>
        </ThemedView>
      )}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="capture"
        onRequestClose={() => setMenuVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 36,
  },
  topAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  topPrimaryAction: {
    backgroundColor: `${colorTokens.light.primary}12`,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    opacity: 0.8,
    textAlign: 'center',
  },
  idleTypingCanvas: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  idleTapCanvas: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInput: {
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    minHeight: 240,
    fontSize: 32,
    lineHeight: 42,
    letterSpacing: -0.5,
    textAlign: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  captureInputTyping: {
    textAlign: 'left',
    minHeight: 340,
    fontSize: 24,
    lineHeight: 34,
    borderColor: `${colorTokens.light.separator}CC`,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: `${colorTokens.light.surfaceLowest}D6`,
  },
  idleCopy: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  idleTitle: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
  },
  guidanceText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  micZone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.md,
    marginTop: spacing.md,
  },
  micPrimary: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorTokens.light.primaryStrong,
    ...shadows.cta,
  },
  micSecondary: {
    width: 50,
    height: 50,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colorTokens.light.primary}10`,
  },
  micDisabled: {
    opacity: 0.5,
  },
  voiceCanvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  waveCluster: {
    height: 156,
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.xl,
    backgroundColor: `${colorTokens.light.primary}08`,
  },
  waveBar: {
    width: 6,
    borderRadius: radius.pill,
    backgroundColor: colorTokens.light.primaryStrong,
  },
  voiceLead: {
    textAlign: 'center',
    opacity: 0.9,
  },
  voiceHint: {
    textAlign: 'center',
    opacity: 0.72,
  },
  voicePrimaryZone: {
    width: '100%',
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
  },
});
