// @ts-ignore -- Deno runtime requires local import extensions.
import { renderEntryCleanupPromptTemplate, renderJsonPromptTemplate, resolveAiRuntimePromptVersion, resolveAiRuntimeResponseFormat, resolveAiRuntimeTemperature, type AiQualityRuntimeBindingKey } from './aiqs-runtime-helpers.ts';

export type LiveAiRuntimeBinding = {
  taskId: string;
  taskKey: string;
  versionId: string;
  versionNumber: number;
  runtimeBindingKey: string;
  runtimeFamily: string;
  compositionRole: string;
  managedOutputField: string | null;
  isRuntimeDriver: boolean;
  variantRole: string | null;
  model: string;
  systemInstructions: string;
  promptTemplate: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
  promptVersion: string;
  temperature: number;
  responseFormat:
    | { type: 'json_schema'; json_schema: { name: string; strict: true; schema: Record<string, unknown> } }
    | { type: 'json_object' }
    | null;
};

type RuntimeTaskRow = {
  id: string;
  key: string;
  runtime_binding_key: string | null;
  runtime_family: string | null;
  composition_role: string | null;
  managed_output_field: string | null;
  is_runtime_driver: boolean | null;
  variant_role: string | null;
};

type RuntimeVersionRow = {
  id: string;
  version_number: number;
  status: 'draft' | 'testing' | 'live' | 'archived';
  model: string;
  prompt_template: string;
  system_instructions: string;
  output_schema_json: Record<string, unknown> | null;
  config_json: Record<string, unknown> | null;
};

export async function loadLiveAiRuntimeBinding(args: {
  adminClient: any;
  bindingKey: AiQualityRuntimeBindingKey;
}): Promise<LiveAiRuntimeBinding> {
  const { data: taskData, error: taskError } = await args.adminClient
    .from('ai_tasks')
    .select(
      'id, key, runtime_binding_key, runtime_family, composition_role, managed_output_field, is_runtime_driver, variant_role',
    )
    .eq('runtime_binding_key', args.bindingKey)
    .eq('is_active', true)
    .maybeSingle();

  if (taskError) {
    throw new Error(`Failed to load AIQS runtime task for ${args.bindingKey}: ${String(taskError.message ?? taskError)}`);
  }
  if (!taskData) {
    throw new Error(`AIQS runtime binding missing: ${args.bindingKey}`);
  }

  const task = taskData as RuntimeTaskRow;

  const { data: versionData, error: versionError } = await args.adminClient
    .from('ai_task_versions')
    .select(
      'id, version_number, status, model, prompt_template, system_instructions, output_schema_json, config_json',
    )
    .eq('task_id', task.id)
    .eq('status', 'live')
    .maybeSingle();

  if (versionError) {
    throw new Error(
      `Failed to load live AIQS runtime version for ${args.bindingKey}: ${String(versionError.message ?? versionError)}`,
    );
  }
  if (!versionData) {
    throw new Error(`AIQS live version missing for runtime binding: ${args.bindingKey}`);
  }

  const version = versionData as RuntimeVersionRow;
  const configJson = (version.config_json ?? {}) as Record<string, unknown>;

  return {
    taskId: task.id,
    taskKey: task.key,
    versionId: version.id,
    versionNumber: version.version_number,
    runtimeBindingKey: task.runtime_binding_key ?? args.bindingKey,
    runtimeFamily: task.runtime_family ?? 'unknown',
    compositionRole: task.composition_role ?? 'legacy_hidden',
    managedOutputField: task.managed_output_field ?? null,
    isRuntimeDriver: task.is_runtime_driver === true,
    variantRole: task.variant_role ?? null,
    model: version.model,
    systemInstructions: version.system_instructions,
    promptTemplate: version.prompt_template,
    outputSchemaJson: (version.output_schema_json ?? {}) as Record<string, unknown>,
    configJson,
    promptVersion: resolveAiRuntimePromptVersion(
      configJson,
      task.key,
      version.version_number,
    ),
    temperature: resolveAiRuntimeTemperature(configJson),
    responseFormat: resolveAiRuntimeResponseFormat(configJson, version.output_schema_json, task.key),
  };
}

export function buildAiqsEntryCleanupUserPrompt(args: {
  binding: LiveAiRuntimeBinding;
  rawText: string;
  currentBody?: string | null;
}): string {
  return renderEntryCleanupPromptTemplate({
    promptTemplate: args.binding.promptTemplate,
    rawText: args.rawText,
    currentBody: args.currentBody,
  });
}

export function buildAiqsJsonUserPrompt(args: {
  binding: LiveAiRuntimeBinding;
  context: Record<string, unknown>;
}): string {
  return renderJsonPromptTemplate({
    promptTemplate: args.binding.promptTemplate,
    context: args.context,
  });
}
