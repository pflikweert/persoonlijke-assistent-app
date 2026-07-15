import { describe, expect, it, vi } from 'vitest';

import { runAiqsRepairFlow } from '@/supabase/functions/_shared/aiqs-repair-flow';
import type { LiveAiRuntimeBinding } from '@/supabase/functions/_shared/aiqs-runtime';

function repairBinding(
  runtimeBindingKey: 'entry_normalization.repair' | 'day_journal.repair',
): LiveAiRuntimeBinding {
  return {
    taskId: `task-${runtimeBindingKey}`,
    taskKey: runtimeBindingKey === 'entry_normalization.repair' ? 'entry_cleanup_repair' : 'day_journal_repair',
    versionId: `version-${runtimeBindingKey}`,
    versionNumber: 1,
    runtimeBindingKey,
    runtimeFamily: runtimeBindingKey.startsWith('entry_') ? 'entry_normalization' : 'day_journal',
    compositionRole: 'runtime_variant',
    managedOutputField: runtimeBindingKey.startsWith('entry_') ? 'body' : 'narrative_text',
    isRuntimeDriver: false,
    variantRole: 'repair',
    model: 'gpt-test',
    systemInstructions: 'Repair system',
    promptTemplate: '{}',
    outputSchemaJson: { type: 'object' },
    configJson: { response_format: 'json_object' },
    promptVersion: 'repair-v1',
    temperature: 0.2,
    responseFormat: { type: 'json_object' },
  };
}

describe('AIQS deterministic repair branching', () => {
  it('uses entry repair exactly once when primary normalization has drift', async () => {
    const binding = repairBinding('entry_normalization.repair');
    const callRepair = vi.fn(async (usedBinding: LiveAiRuntimeBinding) => ({
      body: usedBinding.versionId === binding.versionId ? 'complete repaired entry' : 'wrong binding',
    }));

    const result = await runAiqsRepairFlow({
      primaryValue: { body: 'compressed' },
      primaryFailureReasons: ['compressed_normalized_body'],
      expectedRepairBindingKey: 'entry_normalization.repair',
      repairBinding: binding,
      callRepair,
      getRepairFailureReasons: (value) => value.body === 'complete repaired entry' ? [] : ['entry_drift'],
      missingRepairResultReason: 'repair_model_output_missing',
    });

    expect(callRepair).toHaveBeenCalledOnce();
    expect(callRepair).toHaveBeenCalledWith(binding);
    expect(result).toEqual({ status: 'repaired', value: { body: 'complete repaired entry' } });
  });

  it('uses day-journal repair exactly once when primary narrative needs repair', async () => {
    const binding = repairBinding('day_journal.repair');
    const callRepair = vi.fn(async () => ({ narrativeText: 'Een volledig, doorlopend dagverhaal.' }));

    const result = await runAiqsRepairFlow({
      primaryValue: { narrativeText: 'Kort.' },
      primaryFailureReasons: ['compressed_narrative'],
      expectedRepairBindingKey: 'day_journal.repair',
      repairBinding: binding,
      callRepair,
      getRepairFailureReasons: (value) => value.narrativeText.length > 20 ? [] : ['compressed_narrative'],
      missingRepairResultReason: 'repair_model_output_missing',
    });

    expect(callRepair).toHaveBeenCalledOnce();
    expect(callRepair).toHaveBeenCalledWith(binding);
    expect(result.status).toBe('repaired');
  });

  it('keeps a valid primary result without calling repair', async () => {
    const callRepair = vi.fn(async () => ({ body: 'unused' }));
    const primaryValue = { body: 'valid primary body' };

    const result = await runAiqsRepairFlow({
      primaryValue,
      primaryFailureReasons: [],
      expectedRepairBindingKey: 'entry_normalization.repair',
      repairBinding: null,
      callRepair,
      getRepairFailureReasons: () => [],
      missingRepairResultReason: 'repair_model_output_missing',
    });

    expect(callRepair).not.toHaveBeenCalled();
    expect(result).toEqual({ status: 'primary', value: primaryValue });
  });

  it.each([null, { ...repairBinding('entry_normalization.repair'), variantRole: 'primary' }])(
    'rejects a missing or invalid repair binding before the OpenAI call',
    async (binding) => {
      const callRepair = vi.fn(async () => ({ body: 'unused' }));
      await expect(runAiqsRepairFlow({
        primaryValue: { body: 'compressed' },
        primaryFailureReasons: ['compressed_normalized_body'],
        expectedRepairBindingKey: 'entry_normalization.repair',
        repairBinding: binding as LiveAiRuntimeBinding | null,
        callRepair,
        getRepairFailureReasons: () => [],
        missingRepairResultReason: 'repair_model_output_missing',
      })).rejects.toMatchObject({ reasonCode: 'task_metadata_invalid' });
      expect(callRepair).not.toHaveBeenCalled();
    },
  );

  it('returns the fail-closed repair_failed contract when repair remains invalid', async () => {
    const result = await runAiqsRepairFlow({
      primaryValue: { narrativeText: 'Kort.' },
      primaryFailureReasons: ['compressed_narrative'],
      expectedRepairBindingKey: 'day_journal.repair',
      repairBinding: repairBinding('day_journal.repair'),
      callRepair: async () => ({ narrativeText: 'Nog kort.' }),
      getRepairFailureReasons: () => ['compressed_narrative'],
      missingRepairResultReason: 'repair_model_output_missing',
    });

    expect(result).toEqual({
      status: 'failed',
      reason: 'repair_failed',
      failureReasons: ['compressed_narrative'],
    });
  });
});
