import {
  RecordingPresets,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { router } from 'expo-router';
import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
  SurfaceSection,
  TextAreaField,
} from '@/components/ui/screen-primitives';
import { classifyUnknownError, submitAudioEntry, submitTextEntry } from '@/services';
import { spacing } from '@/theme';

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

  const autoStopTriggeredRef = useRef(false);

  const isRecording = recorderState.isRecording;
  const recordingSeconds = Math.floor(recorderState.durationMillis / 1000);

  const handleStopRecording = useCallback(
    async (source: 'manual' | 'auto') => {
      setRecordingActionBusy(true);

      try {
        await recorder.stop();
        const uri = recorder.uri ?? recorderState.url;

        if (!uri) {
          throw new Error('Opname is gestopt, maar bestand ontbreekt.');
        }

        setAudioUri(uri);
        setStatus(
          source === 'auto'
            ? 'Opname is automatisch gestopt na 90 seconden.'
            : 'Opname is klaar om te verwerken.'
        );
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
      setStatus('Opname gestart. Stop wanneer je klaar bent.');
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
      setStatus('Notitie verwerkt.');
      router.replace('/');
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
      setStatus('Audio-opname verwerkt.');
      router.replace('/');
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

  return (
    <ScreenContainer scrollable>
      <ThemedView style={styles.header}>
        <ThemedText type="screenTitle">Vastleggen</ThemedText>
        <ThemedText type="bodySecondary">
          Kies tekst of audio. Verwerking gebeurt automatisch op de achtergrond.
        </ThemedText>
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
      {status ? <StateBlock tone="success" message={status} /> : null}

      <SurfaceSection title="Tekstnotitie" subtitle="Schrijf kort wat je wilt vastleggen.">
        <TextAreaField
          onChangeText={setRawText}
          placeholder="Wat wil je vastleggen?"
          value={rawText}
        />
        <PrimaryButton
          disabled={submitting || isRecording}
          onPress={() => void handleSubmitText()}
          label={submitting ? 'Notitie verwerken...' : 'Notitie opslaan'}
        />
      </SurfaceSection>

      <SurfaceSection title="Audio-opname" subtitle="Neem kort op en verwerk wanneer je klaar bent.">
        {isRecording ? <MetaText>Opname loopt: {recordingSeconds}s / 90s</MetaText> : null}
        {!isRecording && audioUri ? <MetaText>Opname staat klaar voor verwerking.</MetaText> : null}

        <ThemedView style={styles.audioButtons}>
          <SecondaryButton
            disabled={submitting || recordingActionBusy || isRecording}
            onPress={() => void handleStartRecording()}
            label="Start opname"
          />

          <SecondaryButton
            disabled={submitting || recordingActionBusy || !isRecording}
            onPress={() => void handleStopRecording('manual')}
            label="Stop opname"
          />
        </ThemedView>

        <PrimaryButton
          disabled={submitting || recordingActionBusy || isRecording || !audioUri}
          onPress={() => void handleSubmitAudio()}
          label={submitting ? 'Opname verwerken...' : 'Opname opslaan'}
        />
      </SurfaceSection>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.inline,
  },
  audioButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});
