import type { AiFlowId, AiFlowMeta } from '@/server-contracts/ai';

import { getOpenAiServerEnv } from '@server/ai/config/env';
import { logAiFlowEnd, logAiFlowStart } from '@server/ai/logging/ai-logger';
import { getPromptStub, getPromptVersion } from '@server/ai/prompts/versions';

interface OpenAiProxyResult {
  meta: AiFlowMeta;
  available: boolean;
  reason?: string;
}

function createRequestId(flow: AiFlowId): string {
  return `${flow}-${Date.now()}`;
}

export async function invokeOpenAiStub(flow: AiFlowId): Promise<OpenAiProxyResult> {
  const requestId = createRequestId(flow);
  const promptVersion = getPromptVersion(flow);

  logAiFlowStart({ flow, requestId, promptVersion });

  const env = getOpenAiServerEnv();
  getPromptStub(flow);

  if (!env) {
    logAiFlowEnd({
      flow,
      requestId,
      promptVersion,
      success: false,
      reason: 'OPENAI_API_KEY missing',
    });

    return {
      meta: {
        contractVersion: 'v1',
        flow,
        requestId,
        promptVersion,
        stub: true,
      },
      available: false,
      reason: 'OPENAI_API_KEY missing',
    };
  }

  logAiFlowEnd({ flow, requestId, promptVersion, success: true });

  return {
    meta: {
      contractVersion: 'v1',
      flow,
      requestId,
      promptVersion,
      stub: true,
    },
    available: true,
  };
}
