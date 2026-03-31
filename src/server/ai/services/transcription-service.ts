import type { TranscriptionInput, TranscriptionOutput } from '@/server-contracts/ai';

import { invokeOpenAiStub } from '../proxy/openai-proxy';

export async function runTranscriptionFlow(
  input: TranscriptionInput
): Promise<TranscriptionOutput> {
  const proxy = await invokeOpenAiStub('transcription');

  return {
    meta: proxy.meta,
    transcriptText: proxy.available
      ? `STUB transcript for source: ${input.audioSource.uri}`
      : 'STUB transcript unavailable: missing server env',
  };
}
