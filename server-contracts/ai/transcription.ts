import type { AiFlowMeta } from './shared';

export interface TranscriptionInput {
  audioSource: {
    mimeType: string;
    uri: string;
  };
  languageHint?: string;
}

export interface TranscriptionOutput {
  meta: AiFlowMeta;
  transcriptText: string;
}
