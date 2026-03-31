import type { AiFlowId } from '@/server-contracts/ai';

interface LogStartInput {
  flow: AiFlowId;
  requestId: string;
  promptVersion: string;
}

interface LogEndInput extends LogStartInput {
  success: boolean;
  reason?: string;
}

export function logAiFlowStart(input: LogStartInput) {
  console.info('[ai:flow:start]', input);
}

export function logAiFlowEnd(input: LogEndInput) {
  console.info('[ai:flow:end]', input);
}
