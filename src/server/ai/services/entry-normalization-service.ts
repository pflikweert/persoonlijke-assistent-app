import type {
  EntryNormalizationInput,
  EntryNormalizationOutput,
} from '@/server-contracts/ai';

import { invokeOpenAiStub } from '../proxy/openai-proxy';

export async function runEntryNormalizationFlow(
  input: EntryNormalizationInput
): Promise<EntryNormalizationOutput> {
  const proxy = await invokeOpenAiStub('entry-normalization');

  return {
    meta: proxy.meta,
    normalizedEntry: {
      title: 'STUB Normalized Entry',
      body: input.rawEntry.trim(),
      tags: [],
    },
  };
}
