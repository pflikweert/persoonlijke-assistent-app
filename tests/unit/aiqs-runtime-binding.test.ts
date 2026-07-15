import { describe, expect, it } from 'vitest';

import {
  AiRuntimeBindingError,
  buildAiqsJsonUserPrompt,
  loadLiveAiRuntimeBinding,
  validateLiveAiRuntimeBinding,
  type LiveAiRuntimeBinding,
  type RuntimeTaskRow,
  type RuntimeVersionRow,
} from '@/supabase/functions/_shared/aiqs-runtime';

const task: RuntimeTaskRow = {
  id: 'task-entry-primary',
  key: 'entry_cleanup',
  runtime_binding_key: 'entry_normalization.primary',
  runtime_family: 'entry_normalization',
  composition_role: 'single',
  managed_output_field: 'body',
  is_runtime_driver: true,
  variant_role: 'primary',
};

const version: RuntimeVersionRow = {
  id: 'version-entry-primary',
  version_number: 3,
  status: 'live',
  model: 'gpt-test',
  prompt_template: JSON.stringify({ rawText: '{{raw_text}}' }),
  system_instructions: 'Gebruik alleen de bron.',
  output_schema_json: {
    type: 'object',
    required: ['title', 'body', 'summary_short'],
    properties: {
      title: { type: 'string' },
      body: { type: 'string' },
      summary_short: { type: 'string' },
    },
  },
  config_json: { temperature: 0.2, response_format: 'json_object' },
};

function fakeAdminClient(input: {
  taskData?: RuntimeTaskRow | null;
  taskError?: unknown;
  versionData?: RuntimeVersionRow | null;
  versionError?: unknown;
}) {
  return {
    from(table: string) {
      const result = table === 'ai_tasks'
        ? { data: input.taskData ?? null, error: input.taskError ?? null }
        : { data: input.versionData ?? null, error: input.versionError ?? null };
      const query = {
        select: () => query,
        eq: () => query,
        maybeSingle: async () => result,
      };
      return query;
    },
  };
}

async function expectBindingError(
  promise: Promise<unknown>,
  reasonCode: AiRuntimeBindingError['reasonCode'],
) {
  await expect(promise).rejects.toMatchObject({
    name: 'AiRuntimeBindingError',
    reasonCode,
  });
}

describe('AIQS live runtime binding resolver', () => {
  it.each([
    ['entry_normalization.primary', 'entry_cleanup', 'entry_normalization', 'single', 'body', true, 'primary'],
    ['entry_normalization.repair', 'entry_cleanup_repair', 'entry_normalization', 'runtime_variant', 'body', false, 'repair'],
    ['entry_renormalization.primary', 'entry_renormalization', 'entry_renormalization', 'runtime_variant', 'body', true, 'renormalization'],
    ['day_journal.primary', 'day_narrative', 'day_journal', 'compound_member', 'narrative_text', true, 'primary'],
    ['day_journal.repair', 'day_journal_repair', 'day_journal', 'runtime_variant', 'narrative_text', false, 'repair'],
    ['week_reflection.primary', 'week_narrative', 'week_reflection', 'compound_member', 'narrative_text', true, 'primary'],
    ['month_reflection.primary', 'month_narrative', 'month_reflection', 'compound_member', 'narrative_text', true, 'primary'],
  ] as const)(
    'accepts the canonical metadata contract for %s',
    (bindingKey, taskKey, runtimeFamily, compositionRole, managedOutputField, isRuntimeDriver, variantRole) => {
      expect(() => validateLiveAiRuntimeBinding({
        bindingKey,
        task: {
          ...task,
          key: taskKey,
          runtime_binding_key: bindingKey,
          runtime_family: runtimeFamily,
          composition_role: compositionRole,
          managed_output_field: managedOutputField,
          is_runtime_driver: isRuntimeDriver,
          variant_role: variantRole,
        },
        version,
      })).not.toThrow();
    },
  );

  it('loads and validates a complete live binding', async () => {
    const binding = await loadLiveAiRuntimeBinding({
      adminClient: fakeAdminClient({ taskData: task, versionData: version }),
      bindingKey: 'entry_normalization.primary',
    });

    expect(binding).toMatchObject({
      taskKey: 'entry_cleanup',
      versionId: 'version-entry-primary',
      runtimeBindingKey: 'entry_normalization.primary',
      model: 'gpt-test',
      temperature: 0.2,
    });
  });

  it('returns stable reason codes for missing and failed task queries', async () => {
    await expectBindingError(
      loadLiveAiRuntimeBinding({
        adminClient: fakeAdminClient({ taskData: null }),
        bindingKey: 'entry_normalization.primary',
      }),
      'binding_missing',
    );
    await expectBindingError(
      loadLiveAiRuntimeBinding({
        adminClient: fakeAdminClient({ taskError: { code: 'PGRST116' } }),
        bindingKey: 'entry_normalization.primary',
      }),
      'binding_query_failed',
    );
  });

  it('returns stable reason codes for missing, failed and duplicate live-version queries', async () => {
    await expectBindingError(
      loadLiveAiRuntimeBinding({
        adminClient: fakeAdminClient({ taskData: task, versionData: null }),
        bindingKey: 'entry_normalization.primary',
      }),
      'live_version_missing',
    );
    for (const versionError of [{ code: 'DB_DOWN' }, { code: 'PGRST116', message: 'multiple rows' }]) {
      await expectBindingError(
        loadLiveAiRuntimeBinding({
          adminClient: fakeAdminClient({ taskData: task, versionError }),
          bindingKey: 'entry_normalization.primary',
        }),
        'version_query_failed',
      );
    }
  });

  it.each([
    ['task_metadata_invalid', { task: { ...task, runtime_family: 'day_journal' } }],
    ['model_missing', { version: { ...version, model: ' ' } }],
    ['system_instructions_missing', { version: { ...version, system_instructions: '' } }],
    ['prompt_template_missing', { version: { ...version, prompt_template: '' } }],
    ['config_invalid', { version: { ...version, config_json: [] as unknown as Record<string, unknown> } }],
    ['config_invalid', { version: { ...version, config_json: { temperature: 3 } } }],
    ['config_invalid', { version: { ...version, config_json: { response_format: 'text' } } }],
    ['output_schema_invalid', { version: { ...version, output_schema_json: { type: 'string' } } }],
  ] as const)('rejects invalid bindings with %s', (reasonCode, override) => {
    expect(() => validateLiveAiRuntimeBinding({
      bindingKey: 'entry_normalization.primary',
      task: 'task' in override ? override.task : task,
      version: 'version' in override ? override.version : version,
    })).toThrowError(expect.objectContaining({ reasonCode }));
  });

  it('rejects unresolved rendered placeholders without exposing prompt content', () => {
    const binding = {
      taskKey: task.key,
      versionId: version.id,
      runtimeBindingKey: task.runtime_binding_key,
      promptTemplate: JSON.stringify({ missing: '{{unknown_value}}' }),
    } as LiveAiRuntimeBinding;

    try {
      buildAiqsJsonUserPrompt({ binding, context: {} });
      throw new Error('Expected unresolved placeholder rejection.');
    } catch (error) {
      expect(error).toBeInstanceOf(AiRuntimeBindingError);
      expect(error).toMatchObject({ reasonCode: 'prompt_placeholder_unresolved' });
      expect((error as AiRuntimeBindingError).toSafeDetails()).toEqual({
        reasonCode: 'prompt_placeholder_unresolved',
        bindingKey: 'entry_normalization.primary',
        taskKey: 'entry_cleanup',
        versionId: 'version-entry-primary',
        field: 'prompt_template',
      });
      expect(JSON.stringify((error as AiRuntimeBindingError).toSafeDetails())).not.toContain('unknown_value');
    }
  });
});
