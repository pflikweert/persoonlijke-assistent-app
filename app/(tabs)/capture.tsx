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
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { submitAudioEntry, submitTextEntry } from '@/services';
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
  const [error, setError] = useState<string | null>(null);
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
            ? 'Opname automatisch gestopt na 90 seconden. Verwerk opname om op te slaan.'
            : 'Opname klaar. Verwerk opname om op te slaan.'
        );
      } catch (nextError) {
        const message = nextError instanceof Error ? nextError.message : 'Stoppen van opname mislukt.';
        setError(message);
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
      const message =
        nextError instanceof Error ? nextError.message : 'Starten van opname is mislukt.';
      setError(message);
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
      setStatus('Notitie verwerkt. Terug naar Vandaag...');
      router.replace('/');
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Verwerken van notitie mislukt.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitAudio() {
    if (!audioUri) {
      setError('Neem eerst een opname op.');
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
      setStatus('Audio verwerkt. Terug naar Vandaag...');
      router.replace('/');
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Verwerken van audio mislukt.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Vastleggen</ThemedText>
      <ThemedText>Typ een notitie of neem kort audio op. Verwerking gebeurt server-side.</ThemedText>

      <ThemedView style={styles.block}>
        <ThemedText type="defaultSemiBold">Tekst</ThemedText>
        <TextInput
          multiline
          onChangeText={setRawText}
          placeholder="Wat wil je vastleggen?"
          style={styles.input}
          textAlignVertical="top"
          value={rawText}
        />
        <Pressable
          disabled={submitting || isRecording}
          onPress={handleSubmitText}
          style={[styles.button, (submitting || isRecording) && styles.buttonDisabled]}>
          <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
            {submitting ? 'Verwerken...' : 'Verwerk notitie'}
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.block}>
        <ThemedText type="defaultSemiBold">Audio</ThemedText>
        {isRecording ? <ThemedText>Opname loopt: {recordingSeconds}s / 90s</ThemedText> : null}
        {!isRecording && audioUri ? <ThemedText>Opname klaar. Verwerk opname om op te slaan.</ThemedText> : null}

        <ThemedView style={styles.audioButtons}>
          <Pressable
            disabled={submitting || recordingActionBusy || isRecording}
            onPress={handleStartRecording}
            style={[
              styles.button,
              styles.secondaryButton,
              (submitting || recordingActionBusy || isRecording) && styles.buttonDisabled,
            ]}>
            <ThemedText type="defaultSemiBold">Start opname</ThemedText>
          </Pressable>

          <Pressable
            disabled={submitting || recordingActionBusy || !isRecording}
            onPress={() => void handleStopRecording('manual')}
            style={[
              styles.button,
              styles.secondaryButton,
              (submitting || recordingActionBusy || !isRecording) && styles.buttonDisabled,
            ]}>
            <ThemedText type="defaultSemiBold">Stop opname</ThemedText>
          </Pressable>
        </ThemedView>

        <Pressable
          disabled={submitting || recordingActionBusy || isRecording || !audioUri}
          onPress={handleSubmitAudio}
          style={[
            styles.button,
            (submitting || recordingActionBusy || isRecording || !audioUri) && styles.buttonDisabled,
          ]}>
          <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
            {submitting ? 'Verwerken...' : 'Verwerk opname'}
          </ThemedText>
        </Pressable>
      </ThemedView>

      {error ? <ThemedText>{error}</ThemedText> : null}
      {status ? <ThemedText>{status}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  block: {
    gap: spacing.md,
  },
  input: {
    minHeight: 140,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
  },
  audioButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
