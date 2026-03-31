import type { DayCompositionInput, DayCompositionOutput } from '@/server-contracts/ai';

import { invokeOpenAiStub } from '../proxy/openai-proxy';

export async function runDayCompositionFlow(
  input: DayCompositionInput
): Promise<DayCompositionOutput> {
  const proxy = await invokeOpenAiStub('day-composition');

  return {
    meta: proxy.meta,
    dayPlan: {
      summary: `STUB day composition for ${input.date}`,
      sections: ['Morning focus', 'Midday review', 'Evening wrap-up'],
    },
  };
}
