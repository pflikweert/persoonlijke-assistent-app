import { useEffect, useRef, useState } from 'react';
import type { JarvisAudioPayload, JarvisVoiceState } from '../../src/jarvis/types';
import { getJarvisVoiceSupport, mapJarvisMediaError } from './jarvisVoiceDiagnostics';

interface UseJarvisVoiceInputArgs {
  onVoiceStateChange(args: {
    voiceState: JarvisVoiceState;
    reason?: string | null;
    available?: boolean;
  }): void;
  onAudioReady(audio: JarvisAudioPayload): void;
}

const MIN_RECORDING_DURATION_MS = 250;

declare global {
  interface Window {
    MediaRecorder?: typeof MediaRecorder;
  }
}

export function useJarvisVoiceInput({ onVoiceStateChange, onAudioReady }: UseJarvisVoiceInputArgs) {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef<number | null>(null);
  const onVoiceStateChangeRef = useRef(onVoiceStateChange);
  const onAudioReadyRef = useRef(onAudioReady);
  const [supported, setSupported] = useState(false);
  const [supportReason, setSupportReason] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    onVoiceStateChangeRef.current = onVoiceStateChange;
  }, [onVoiceStateChange]);

  useEffect(() => {
    onAudioReadyRef.current = onAudioReady;
  }, [onAudioReady]);

  useEffect(() => {
    const support = getJarvisVoiceSupport();
    setSupported(support.supported);
    setSupportReason(support.reason);
    onVoiceStateChangeRef.current({
      voiceState: support.supported ? 'idle' : 'unavailable',
      reason: support.reason,
      available: support.supported,
    });

    let disposed = false;
    void readMicrophonePermissionState().then((permissionState) => {
      if (disposed || permissionState !== 'denied') {
        return;
      }
      onVoiceStateChangeRef.current({
        voiceState: 'permission_needed',
        reason: 'Microfoonrechten geweigerd. Geef Visual Studio Code toegang tot de microfoon en probeer opnieuw.',
        available: support.supported,
      });
    });

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(
    () => () => {
      cleanupMedia();
    },
    [],
  );

  async function startRecording() {
    if (!supported) {
      onVoiceStateChangeRef.current({
        voiceState: 'unavailable',
        reason: supportReason ?? 'Voice input is hier niet beschikbaar.',
        available: false,
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      recordingStartedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setRecording(true);
        onVoiceStateChangeRef.current({ voiceState: 'recording', reason: null, available: true });
      };

      recorder.onerror = () => {
        setRecording(false);
        onVoiceStateChangeRef.current({
          voiceState: 'permission_needed',
          reason: 'Audio-opname kon niet starten. Controleer VS Code- en macOS-microfoonrechten.',
          available: true,
        });
        cleanupMedia();
      };

      recorder.onstop = async () => {
        setRecording(false);
        const startedAt = recordingStartedAtRef.current ?? Date.now();
        const durationMs = Date.now() - startedAt;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        cleanupMedia();

        if (blob.size <= 0 || durationMs < MIN_RECORDING_DURATION_MS) {
          onVoiceStateChangeRef.current({
            voiceState: 'idle',
            reason: 'Audio-opname is te kort of leeg. Houd de mic iets langer ingedrukt.',
            available: true,
          });
          return;
        }

        onVoiceStateChangeRef.current({ voiceState: 'transcribing', reason: null, available: true });
        onAudioReadyRef.current({
          audioBase64: await blobToBase64(blob),
          mimeType: blob.type || 'audio/webm',
          durationMs,
        });
      };

      recorder.start();
    } catch (error) {
      setRecording(false);
      onVoiceStateChangeRef.current({
        voiceState: 'permission_needed',
        reason: mapJarvisMediaError(error),
        available: true,
      });
      cleanupMedia();
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  return {
    supported,
    supportReason,
    recording,
    startRecording,
    stopRecording,
  };

  function cleanupMedia() {
    recorderRef.current = null;
    recordingStartedAtRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }
}

function pickRecorderMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? '';
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Kon audio niet coderen.'));
        return;
      }
      const [, base64 = ''] = result.split(',');
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Kon audio niet lezen.'));
    reader.readAsDataURL(blob);
  });
}

async function readMicrophonePermissionState() {
  const permissions = navigator.permissions;
  if (!permissions?.query) {
    return null;
  }

  try {
    const status = await permissions.query({ name: 'microphone' as PermissionName });
    return status.state;
  } catch {
    return null;
  }
}
