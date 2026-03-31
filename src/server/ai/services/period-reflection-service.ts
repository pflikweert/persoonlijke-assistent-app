import type {
  PeriodReflectionInput,
  PeriodReflectionOutput,
} from '@/server-contracts/ai';

import { invokeOpenAiStub } from '../proxy/openai-proxy';

export async function runPeriodReflectionFlow(
  input: PeriodReflectionInput
): Promise<PeriodReflectionOutput> {
  const proxy = await invokeOpenAiStub('period-reflection');

  return {
    meta: proxy.meta,
    reflection: {
      summary: `STUB reflection for ${input.periodLabel}`,
      highlights: ['No highlights yet'],
      nextFocus: ['Define reflection prompts'],
    },
  };
}
