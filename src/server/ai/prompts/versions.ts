import type { AiFlowId } from '@/server-contracts/ai';

export const PROMPT_VERSIONS: Record<AiFlowId, string> = {
  transcription: 'transcription.v1.stub',
  'entry-normalization': 'entry-normalization.v1.stub',
  'day-composition': 'day-composition.v1.stub',
  'period-reflection': 'period-reflection.v1.stub',
};

export function getPromptVersion(flow: AiFlowId): string {
  return PROMPT_VERSIONS[flow];
}

export function getPromptStub(flow: AiFlowId): string {
  return `TODO: add prompt for ${flow}`;
}
