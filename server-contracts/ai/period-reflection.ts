import type { AiFlowMeta } from './shared';

export interface PeriodReflectionInput {
  periodLabel: string;
  entries: Array<{
    title: string;
    body: string;
    tags: string[];
  }>;
}

export interface PeriodReflectionOutput {
  meta: AiFlowMeta;
  reflection: {
    summary: string;
    highlights: string[];
    nextFocus: string[];
  };
}
