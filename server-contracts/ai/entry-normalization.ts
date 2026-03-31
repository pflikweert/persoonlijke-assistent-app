import type { AiFlowMeta } from './shared';

export interface EntryNormalizationInput {
  rawEntry: string;
  locale?: string;
  timezone?: string;
}

export interface EntryNormalizationOutput {
  meta: AiFlowMeta;
  normalizedEntry: {
    title: string;
    body: string;
    tags: string[];
  };
}
