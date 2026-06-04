import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const RUNTIME_FILES = [
  'supabase/functions/process-entry/index.ts',
  'supabase/functions/renormalize-entry/index.ts',
  'supabase/functions/regenerate-day-journal/index.ts',
  'supabase/functions/generate-reflection/index.ts',
  'supabase/functions/admin-regeneration-job/index.ts',
];

const FORBIDDEN_RUNTIME_OUTPUT_FALLBACKS = [
  'fallbackNormalization',
  'createFallbackDayJournal',
  'buildFallbackSummary',
  'normalized_fallback_used',
  'day_journal_fallback_used',
  'reflection_fallback_used',
  'fallback_title',
  'fallback_body',
  'fallback_summary_short',
  "?? 'Notitie'",
  '?? "Notitie"',
  "?? 'Je entry'",
  '?? "Je entry"',
  'Korte preview niet beschikbaar.',
];

describe('AIQS runtime output fallback guard', () => {
  it('keeps AIQS-managed runtime flows fail-closed instead of generating hardcoded content fallbacks', () => {
    const repoRoot = process.cwd();
    const violations: string[] = [];

    for (const relativePath of RUNTIME_FILES) {
      const source = readFileSync(path.join(repoRoot, relativePath), 'utf8');
      for (const forbidden of FORBIDDEN_RUNTIME_OUTPUT_FALLBACKS) {
        if (source.includes(forbidden)) {
          violations.push(`${relativePath}: ${forbidden}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
