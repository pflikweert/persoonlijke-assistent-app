import { describe, expect, it } from 'vitest';

import {
  classifyAiqsBaselineEnsureDisposition,
  removeAiqsRuntimeBaselineOwnership,
} from '../../supabase/functions/_shared/aiqs-baseline-policy';

describe('AIQS baseline ensure policy', () => {
  it('creates only when the target record is missing', () => {
    expect(
      classifyAiqsBaselineEnsureDisposition({ exists: false, matchesBaseline: false }),
    ).toBe('create');
  });

  it('preserves an existing record that differs from the code baseline', () => {
    expect(
      classifyAiqsBaselineEnsureDisposition({ exists: true, matchesBaseline: false }),
    ).toBe('preserved');
  });

  it('reports an equal existing record without changing it', () => {
    expect(
      classifyAiqsBaselineEnsureDisposition({ exists: true, matchesBaseline: true }),
    ).toBe('already_ok');
  });
});

describe('AIQS draft baseline ownership', () => {
  it('removes inherited runtime-code ownership without mutating the source config', () => {
    const source = {
      temperature: 0.2,
      baseline_import: {
        baseline_source: 'runtime_code',
        prompt_version: 'entry-normalization-v1',
      },
    };

    expect(removeAiqsRuntimeBaselineOwnership(source)).toEqual({ temperature: 0.2 });
    expect(source).toHaveProperty('baseline_import');
  });

  it('removes legacy baseline ownership regardless of its nested shape', () => {
    expect(
      removeAiqsRuntimeBaselineOwnership({
        response_format: 'json_object',
        baseline_import: 'legacy-runtime-code-marker',
      }),
    ).toEqual({ response_format: 'json_object' });
  });

  it('returns an empty config for missing input', () => {
    expect(removeAiqsRuntimeBaselineOwnership(null)).toEqual({});
  });
});
