import type { AiFlowMeta } from './shared';

export interface DayCompositionInput {
  date: string;
  timezone: string;
  normalizedEntries: Array<{
    title: string;
    body: string;
    tags: string[];
  }>;
}

export interface DayCompositionOutput {
  meta: AiFlowMeta;
  dayPlan: {
    summary: string;
    sections: string[];
  };
}
