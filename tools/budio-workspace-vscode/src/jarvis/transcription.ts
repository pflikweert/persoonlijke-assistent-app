import { resolveJarvisEnv } from './env';
import type { JarvisAudioPayload } from './types';

const DEFAULT_TRANSCRIPTION_TIMEOUT_MS = 60000;
const MIN_AUDIO_DURATION_MS = 250;
const MIN_AUDIO_BYTES = 32;

export interface JarvisTranscriptionResult {
  text: string;
  model: string;
  providerSource: string;
}

export async function transcribeJarvisAudio(args: {
  workspaceRoot: string;
  audio: JarvisAudioPayload;
  fetchImpl?: typeof fetch;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
}): Promise<JarvisTranscriptionResult> {
  const resolvedEnv = resolveJarvisEnv(args.workspaceRoot, args.env);
  if (!resolvedEnv.chatApiKey) {
    throw new Error(
      'Geen Jarvis chat key gevonden. Voeg `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, `OPENAI_API_BUDIO_WORKSPACE_KEY` of `OPENAI_API_KEY` toe aan `.env.local`.',
    );
  }

  const extension = fileExtensionForMimeType(args.audio.mimeType);
  const buffer = Buffer.from(args.audio.audioBase64, 'base64');
  if (args.audio.durationMs < MIN_AUDIO_DURATION_MS || buffer.byteLength < MIN_AUDIO_BYTES) {
    throw new Error('Audio-opname is te kort of leeg. Houd de mic iets langer ingedrukt en probeer opnieuw.');
  }

  const file = new File([buffer], `jarvis-input.${extension}`, {
    type: args.audio.mimeType,
  });
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', resolvedEnv.transcriptionModel);
  formData.append('response_format', 'json');

  const timeout = createTimeoutSignal(args.timeoutMs ?? DEFAULT_TRANSCRIPTION_TIMEOUT_MS);
  let response: Response;
  try {
    response = await (args.fetchImpl ?? fetch)('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      signal: timeout.signal,
      headers: {
        Authorization: `Bearer ${resolvedEnv.chatApiKey}`,
      },
      body: formData,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(
        `Jarvis transcriptie timeout na ${Math.round((args.timeoutMs ?? DEFAULT_TRANSCRIPTION_TIMEOUT_MS) / 1000)}s.`,
      );
    }
    throw error;
  } finally {
    timeout.dispose();
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Jarvis transcriptiefout (${response.status}, key ${resolvedEnv.chatApiKeySource ?? 'onbekend'}, model ${resolvedEnv.transcriptionModel}): ${truncate(errorText, 240)}`,
    );
  }

  const payload = (await response.json()) as { text?: string | null };
  const text = payload.text?.trim() ?? '';
  if (!text) {
    throw new Error('Jarvis transcriptie gaf geen tekst terug.');
  }

  return {
    text,
    model: resolvedEnv.transcriptionModel,
    providerSource: resolvedEnv.chatApiKeySource ?? 'unknown',
  };
}

function fileExtensionForMimeType(mimeType: string) {
  if (mimeType.includes('webm')) {
    return 'webm';
  }
  if (mimeType.includes('ogg')) {
    return 'ogg';
  }
  if (mimeType.includes('mp4')) {
    return 'mp4';
  }
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) {
    return 'mp3';
  }
  if (mimeType.includes('wav')) {
    return 'wav';
  }
  return 'm4a';
}

function truncate(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    dispose: () => clearTimeout(timeout),
  };
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}
