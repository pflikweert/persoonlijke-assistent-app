import { describe, expect, it } from 'vitest';

import { finalizeDayJournalDraftStrict } from '../../supabase/functions/_shared/day-journal-contract.mjs';

const entries = [
  {
    rawEntryId: 'entry-1',
    capturedAt: '2026-06-03T10:00:00.000Z',
    title: 'Koffie met Lisa',
    body: 'Ik dronk koffie met Lisa en besprak de planning voor de rest van de week.',
  },
];

describe('day journal strict finalizer', () => {
  it('rejects missing model output instead of returning fallback day content as ok', () => {
    const result = finalizeDayJournalDraftStrict({
      aiResult: null,
      entries,
      options: { strictValidation: true, softQualityGuards: true },
    });

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain('model_output_missing');
  });

  it('accepts complete AI output without fallback replacement', () => {
    const result = finalizeDayJournalDraftStrict({
      aiResult: {
        summary: 'Koffie met Lisa gaf richting aan de weekplanning.',
        narrativeText: 'Ik dronk koffie met Lisa en besprak de planning voor de rest van de week.',
        sections: ['Koffie met Lisa en planning voor de week.'],
      },
      entries,
      options: { strictValidation: true, softQualityGuards: true },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.finalized.usedFallback).toBe(false);
      expect(result.finalized.usedFallbackSummary).toBe(false);
      expect(result.finalized.usedFallbackSections).toBe(false);
    }
  });
});
