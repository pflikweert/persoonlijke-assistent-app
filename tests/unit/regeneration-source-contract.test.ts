import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildDayCandidatesFromSources,
  buildDayEntrySourceResult,
  buildEntryRepairCandidates,
  buildRegenerationScopePlan,
  deriveJournalDateForLegacyRaw,
  type NormalizedEntrySourceRow,
  type RawEntrySourceRow,
} from '../../supabase/functions/_shared/day-entry-source';
import { finalizeDayJournalDraftStrict } from '../../supabase/functions/_shared/day-journal-contract.mjs';

const raw = (overrides: Partial<RawEntrySourceRow> = {}): RawEntrySourceRow => ({
  id: 'raw-1',
  user_id: 'user-a',
  source_type: 'text',
  raw_text: 'Ik sprak met Nadia over ons contact en stuurde daarna een duidelijke e-mail met vervolg.',
  transcript_text: null,
  captured_at: '2026-03-21T08:15:00.000Z',
  journal_date: '2026-03-21',
  ...overrides,
});

const normalized = (overrides: Partial<NormalizedEntrySourceRow> = {}): NormalizedEntrySourceRow => ({
  id: 'normalized-1',
  raw_entry_id: 'raw-1',
  user_id: 'user-a',
  title: 'Contact met Nadia',
  body: 'Ik sprak met Nadia over ons contact en stuurde daarna een duidelijke e-mail met vervolg.',
  summary_short: 'Contact met Nadia en vervolg per e-mail.',
  generation_meta: {
    prompt_version: 'entry-v1',
    model: 'model-a',
  },
  created_at: '2026-03-21T08:16:00.000Z',
  updated_at: '2026-03-21T08:16:00.000Z',
  ...overrides,
});

describe('regeneration day entry source contract', () => {
  it('builds the same UI-equivalent prompt set from raw plus normalized rows', () => {
    const result = buildDayEntrySourceResult({
      userId: 'user-a',
      journalDate: '2026-03-21',
      rawEntries: [raw()],
      normalizedEntries: [normalized()],
      expectedPromptVersion: 'entry-v1',
      expectedModel: 'model-a',
    });

    expect(result.debug.uiEquivalentRawCount).toBe(1);
    expect(result.debug.normalizedCount).toBe(1);
    expect(result.debug.promptInputEntryCount).toBe(1);
    expect(result.promptEntries[0]).toMatchObject({
      rawEntryId: 'raw-1',
      normalizedEntryId: 'normalized-1',
      title: 'Contact met Nadia',
    });
  });

  it('marks legacy raw-only entries as normalization candidates without mutating raw', () => {
    const legacy = raw({
      id: 'raw-legacy',
      journal_date: null,
      captured_at: '2026-03-21T12:00:00.000Z',
    });

    const candidates = buildEntryRepairCandidates({
      rawEntries: [legacy],
      normalizedEntries: [],
      expectedPromptVersion: 'entry-v1',
      expectedModel: 'model-a',
    });

    expect(deriveJournalDateForLegacyRaw(legacy.captured_at)).toBe('2026-03-21');
    expect(candidates).toEqual([
      expect.objectContaining({
        rawEntryId: 'raw-legacy',
        normalizedEntryId: null,
        reasonCodes: ['missing_normalized'],
      }),
    ]);
  });

  it('detects normalized content that is filled but does not match raw source', () => {
    const candidates = buildEntryRepairCandidates({
      rawEntries: [raw()],
      normalizedEntries: [
        normalized({
          body: 'Boodschappenlijst brood melk kaas ontbijt lunch avondeten.',
        }),
      ],
      expectedPromptVersion: 'entry-v1',
      expectedModel: 'model-a',
    });

    expect(candidates[0]?.reasonCodes).toContain('normalized_body_low_source_overlap');
  });

  it('keeps the 2026-03-21 case shape promptable when the five visible moments exist', () => {
    const titles = [
      'Zaterdag Ochtend Reflecties',
      'Vragen over het contact met Nadia',
      'Bericht over ons contact',
      'Zo wie typical e-mail verstuurd',
      'Verstuurde berichten',
    ];
    const rawEntries = titles.map((title, index) =>
      raw({
        id: `raw-${index}`,
        raw_text: `${title}: ik legde dit moment vast met concrete context.`,
        captured_at: `2026-03-21T0${index + 8}:00:00.000Z`,
      })
    );
    const normalizedEntries = titles.map((title, index) =>
      normalized({
        id: `normalized-${index}`,
        raw_entry_id: `raw-${index}`,
        title,
        body: `${title}: ik legde dit moment vast met concrete context.`,
      })
    );

    const result = buildDayEntrySourceResult({
      userId: 'user-a',
      journalDate: '2026-03-21',
      rawEntries,
      normalizedEntries,
    });

    expect(result.debug.uiEquivalentRawCount).toBe(5);
    expect(result.debug.promptInputEntryCount).toBe(5);
    expect(result.issueReasons).toEqual([]);
  });

  it('derives day candidates from raw days as well as existing day journals', () => {
    const candidates = buildDayCandidatesFromSources({
      rawEntries: [
        { user_id: 'user-a', journal_date: '2026-03-21', captured_at: '2026-03-21T08:00:00.000Z' },
        { user_id: 'user-a', journal_date: null, captured_at: '2026-03-22T08:00:00.000Z' },
      ],
      dayJournals: [{ user_id: 'user-a', journal_date: '2026-03-20' }],
    });

    expect(candidates.map((item) => item.journal_date)).toEqual([
      '2026-03-20',
      '2026-03-21',
      '2026-03-22',
    ]);
  });

  it('expands selected days into unique dependent week and month periods', () => {
    const plan = buildRegenerationScopePlan([
      { kind: 'day', date: '2026-03-21' },
      { kind: 'week', startDate: '2026-03-16', endDate: '2026-03-22' },
      { kind: 'month', startDate: '2026-03-01', endDate: '2026-03-31' },
    ]);

    expect(plan.all).toBe(false);
    expect(plan.selectedDays).toContain('2026-03-21');
    expect(plan.selectedDays.filter((date) => date === '2026-03-21')).toHaveLength(1);
    expect(plan.selectedWeeks).toContainEqual({ startDate: '2026-03-16', endDate: '2026-03-22' });
    expect(plan.selectedMonths).toEqual([{ startDate: '2026-03-01', endDate: '2026-03-31' }]);
  });

  it('adds touched months for a week that crosses a month boundary', () => {
    const plan = buildRegenerationScopePlan([
      { kind: 'week', startDate: '2026-03-30', endDate: '2026-04-05' },
    ]);

    expect(plan.selectedWeeks).toEqual([{ startDate: '2026-03-30', endDate: '2026-04-05' }]);
    expect(plan.selectedMonths).toEqual([
      { startDate: '2026-03-01', endDate: '2026-03-31' },
      { startDate: '2026-04-01', endDate: '2026-04-30' },
    ]);
  });

  it('rejects empty-day output when entries were supplied', () => {
    const result = finalizeDayJournalDraftStrict({
      aiResult: {
        summary: 'Vandaag zijn er geen losse entries aangeleverd.',
        narrativeText: 'Vandaag zijn er geen losse entries aangeleverd.',
        sections: [],
      },
      entries: [
        {
          rawEntryId: 'raw-1',
          capturedAt: '2026-03-21T08:00:00.000Z',
          title: 'Contact met Nadia',
          body: 'Ik sprak met Nadia over ons contact.',
        },
      ],
      options: { strictValidation: true, softQualityGuards: true },
    });

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain('empty_day_claim_with_entries');
  });

  it('does not add writes to entries_raw in regeneration runtime files', () => {
    const repoRoot = process.cwd();
    const files = [
      'supabase/functions/admin-regeneration-job/index.ts',
      'supabase/functions/regenerate-day-journal/index.ts',
    ];
    const violations = files.filter((file) => {
      const source = readFileSync(path.join(repoRoot, file), 'utf8');
      return /\.from\(["']entries_raw["']\)\s*\n\s*\.(update|upsert|delete)\(/m.test(source);
    });

    expect(violations).toEqual([]);
  });

  it('does not build entry regeneration batches with bulk id IN query URLs', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'supabase/functions/admin-regeneration-job/index.ts'),
      'utf8'
    );

    expect(source).not.toMatch(/\.in\(["']id["'],\s*normalizedIds\)/);
    expect(source).not.toMatch(/\.in\(["']id["'],\s*rawIds\)/);
    expect(source).toContain('loadNormalizedEntryForBatch');
    expect(source).toContain('loadRawEntryForBatch');
  });

  it('exposes a stop action and blocks starting while another regeneration job is active', () => {
    const functionSource = readFileSync(
      path.join(process.cwd(), 'supabase/functions/admin-regeneration-job/index.ts'),
      'utf8'
    );
    const serviceSource = readFileSync(
      path.join(process.cwd(), 'services/admin-regeneration.ts'),
      'utf8'
    );

    expect(functionSource).toContain("'stop'");
    expect(functionSource).toContain('loadActiveRegenerationJob');
    expect(functionSource).toContain(".in('status', ['queued', 'running'])");
    expect(functionSource).toContain('Er loopt al een Data opnieuw opbouwen-opdracht');
    expect(serviceSource).toContain('stopAdminRegenerationJob');
    expect(serviceSource).toContain("action: 'stop'");
  });

  it('keeps graceful stop from starting retries or new work after stop is requested', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'supabase/functions/admin-regeneration-job/index.ts'),
      'utf8'
    );

    expect(source).toContain('stop_requested_at');
    expect(source).toContain('phase: args.stopRequested ?');
    expect(source).toContain('!args.stopRequested && Number(data.attempt ?? 0) < 1');
    expect(source).toContain('!args.stopRequested && appliedResult.failedCustomIds.length > 0');
    expect(source).toMatch(/applyCompletedBatch\([\s\S]+cancelJobAfterStopRequest/);
  });

  it('separates active regeneration status from the new-job wizard in the admin UI', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'app/settings-regeneration.tsx'),
      'utf8'
    );

    expect(source).toContain('Nieuwe opdracht starten kan zodra deze klaar of gestopt is.');
    expect(source).toContain('Stop na huidig werk');
    expect(source).toContain('Stop aangevraagd');
    expect(source).toContain('Controleer selectie');
    expect(source).toContain('Alles opnieuw opbouwen?');
    expect(source).toContain('!isRunning');
    expect(source).toContain('stopAdminRegenerationJob');
    expect(source).not.toContain('De selectie wordt automatisch opgehaald');
    expect(source).not.toContain('Geavanceerd: dag inspecteren');
  });
});
