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

export type AiRuntimeBindingReasonCode =
  | 'binding_missing'
  | 'live_version_missing'
  | 'task_metadata_invalid'
  | 'model_missing'
  | 'system_instructions_missing'
  | 'prompt_template_missing'
  | 'config_invalid'
  | 'output_schema_invalid'
  | 'prompt_placeholder_unresolved'
  | 'binding_query_failed'
  | 'version_query_failed';

type AiRuntimeBindingErrorDetails = {
  bindingKey: string;
  taskKey?: string;
  versionId?: string;
  field?: string;
};

export class AiRuntimeBindingError extends Error {
  readonly reasonCode: AiRuntimeBindingReasonCode;
  readonly details: AiRuntimeBindingErrorDetails;

  constructor(
    reasonCode: AiRuntimeBindingReasonCode,
    message: string,
    details: AiRuntimeBindingErrorDetails,
  ) {
    super(message);
    this.name = 'AiRuntimeBindingError';
    this.reasonCode = reasonCode;
    this.details = details;
  }

  toSafeDetails(): Record<string, unknown> {
    return {
      reasonCode: this.reasonCode,
      ...this.details,
    };
  }
}

export type RuntimeTaskRow = {
  id: string;
  key: string;
  runtime_binding_key: string | null;
  runtime_family: string | null;
  composition_role: string | null;
  managed_output_field: string | null;
  is_runtime_driver: boolean | null;
  variant_role: string | null;
};

export type RuntimeVersionRow = {
  id: string;
  version_number: number;
  status: 'draft' | 'testing' | 'live' | 'archived';
  model: string;
  prompt_template: string;
  system_instructions: string;
  output_schema_json: Record<string, unknown> | null;
  config_json: Record<string, unknown> | null;
};

type RuntimeBindingContract = {
  taskKey: string;
  runtimeFamily: string;
  compositionRole: string;
  managedOutputField: string;
  isRuntimeDriver: boolean;
  variantRole: string;
};

const RUNTIME_BINDING_CONTRACTS: Record<AiQualityRuntimeBindingKey, RuntimeBindingContract> = {
  'entry_normalization.primary': {
    taskKey: 'entry_cleanup',
    runtimeFamily: 'entry_normalization',
    compositionRole: 'single',
    managedOutputField: 'body',
    isRuntimeDriver: true,
    variantRole: 'primary',
  },
  'entry_normalization.repair': {
    taskKey: 'entry_cleanup_repair',
    runtimeFamily: 'entry_normalization',
    compositionRole: 'runtime_variant',
    managedOutputField: 'body',
    isRuntimeDriver: false,
    variantRole: 'repair',
  },
  'entry_renormalization.primary': {
    taskKey: 'entry_renormalization',
    runtimeFamily: 'entry_renormalization',
    compositionRole: 'runtime_variant',
    managedOutputField: 'body',
    isRuntimeDriver: true,
    variantRole: 'renormalization',
  },
  'day_journal.primary': {
    taskKey: 'day_narrative',
    runtimeFamily: 'day_journal',
    compositionRole: 'compound_member',
    managedOutputField: 'narrative_text',
    isRuntimeDriver: true,
    variantRole: 'primary',
  },
  'day_journal.repair': {
    taskKey: 'day_journal_repair',
    runtimeFamily: 'day_journal',
    compositionRole: 'runtime_variant',
    managedOutputField: 'narrative_text',
    isRuntimeDriver: false,
    variantRole: 'repair',
  },
  'week_reflection.primary': {
    taskKey: 'week_narrative',
    runtimeFamily: 'week_reflection',
    compositionRole: 'compound_member',
    managedOutputField: 'narrative_text',
    isRuntimeDriver: true,
    variantRole: 'primary',
  },
  'month_reflection.primary': {
    taskKey: 'month_narrative',
    runtimeFamily: 'month_reflection',
    compositionRole: 'compound_member',
    managedOutputField: 'narrative_text',
    isRuntimeDriver: true,
    variantRole: 'primary',
  },
};

export function isAiQualityRuntimeBindingKey(value: unknown): value is AiQualityRuntimeBindingKey {
  return typeof value === 'string' && value in RUNTIME_BINDING_CONTRACTS;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function throwInvalidBinding(
  reasonCode: AiRuntimeBindingReasonCode,
  bindingKey: AiQualityRuntimeBindingKey,
  task: RuntimeTaskRow,
  version: RuntimeVersionRow,
  field: string,
): never {
  throw new AiRuntimeBindingError(
    reasonCode,
    `AIQS runtime binding ${bindingKey} is invalid (${field}).`,
    { bindingKey, taskKey: task.key, versionId: version.id, field },
  );
}

export function validateLiveAiRuntimeBinding(args: {
  bindingKey: AiQualityRuntimeBindingKey;
  task: RuntimeTaskRow;
  version: RuntimeVersionRow;
}): void {
  const { bindingKey, task, version } = args;
  const contract = RUNTIME_BINDING_CONTRACTS[bindingKey];
  const metadataMatches =
    task.runtime_binding_key === bindingKey &&
    task.key === contract.taskKey &&
    task.runtime_family === contract.runtimeFamily &&
    task.composition_role === contract.compositionRole &&
    task.managed_output_field === contract.managedOutputField &&
    task.is_runtime_driver === contract.isRuntimeDriver &&
    task.variant_role === contract.variantRole;

  if (!metadataMatches) {
    throwInvalidBinding('task_metadata_invalid', bindingKey, task, version, 'task_metadata');
  }
  if (typeof version.model !== 'string' || version.model.trim().length === 0) {
    throwInvalidBinding('model_missing', bindingKey, task, version, 'model');
  }
  if (typeof version.system_instructions !== 'string' || version.system_instructions.trim().length === 0) {
    throwInvalidBinding('system_instructions_missing', bindingKey, task, version, 'system_instructions');
  }
  if (typeof version.prompt_template !== 'string' || version.prompt_template.trim().length === 0) {
    throwInvalidBinding('prompt_template_missing', bindingKey, task, version, 'prompt_template');
  }
  if (!isPlainObject(version.config_json)) {
    throwInvalidBinding('config_invalid', bindingKey, task, version, 'config_json');
  }

  const temperature = version.config_json.temperature;
  if (
    temperature !== undefined &&
    (typeof temperature !== 'number' || !Number.isFinite(temperature) || temperature < 0 || temperature > 2)
  ) {
    throwInvalidBinding('config_invalid', bindingKey, task, version, 'config_json.temperature');
  }

  const responseFormat = version.config_json.response_format;
  const validResponseFormat =
    responseFormat === undefined ||
    responseFormat === 'json_object' ||
    (isPlainObject(responseFormat) && responseFormat.type === 'json_object');
  if (!validResponseFormat) {
    throwInvalidBinding('config_invalid', bindingKey, task, version, 'config_json.response_format');
  }

  if (!isPlainObject(version.output_schema_json) || version.output_schema_json.type !== 'object') {
    throwInvalidBinding('output_schema_invalid', bindingKey, task, version, 'output_schema_json');
  }
}

function assertResolvedPrompt(args: { binding: LiveAiRuntimeBinding; renderedPrompt: string }): string {
  if (/\{\{\s*[A-Za-z0-9_.-]+\s*\}\}/.test(args.renderedPrompt)) {
    throw new AiRuntimeBindingError(
      'prompt_placeholder_unresolved',
      `AIQS runtime prompt for ${args.binding.runtimeBindingKey} contains an unresolved placeholder.`,
      {
        bindingKey: args.binding.runtimeBindingKey,
        taskKey: args.binding.taskKey,
        versionId: args.binding.versionId,
        field: 'prompt_template',
      },
    );
  }
  return args.renderedPrompt;
}

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
    throw new AiRuntimeBindingError(
      'binding_query_failed',
      `Failed to load AIQS runtime task for ${args.bindingKey}.`,
      { bindingKey: args.bindingKey },
    );
  }
  if (!taskData) {
    throw new AiRuntimeBindingError(
      'binding_missing',
      `AIQS runtime binding missing: ${args.bindingKey}.`,
      { bindingKey: args.bindingKey },
    );
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
    throw new AiRuntimeBindingError(
      'version_query_failed',
      `Failed to load live AIQS runtime version for ${args.bindingKey}.`,
      { bindingKey: args.bindingKey, taskKey: task.key },
    );
  }
  if (!versionData) {
    throw new AiRuntimeBindingError(
      'live_version_missing',
      `AIQS live version missing for runtime binding: ${args.bindingKey}.`,
      { bindingKey: args.bindingKey, taskKey: task.key },
    );
  }

  const version = versionData as RuntimeVersionRow;
  validateLiveAiRuntimeBinding({ bindingKey: args.bindingKey, task, version });
  const configJson = version.config_json as Record<string, unknown>;

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
  return assertResolvedPrompt({
    binding: args.binding,
    renderedPrompt: renderEntryCleanupPromptTemplate({
      promptTemplate: args.binding.promptTemplate,
      rawText: args.rawText,
      currentBody: args.currentBody,
    }),
  });
}

export function buildAiqsJsonUserPrompt(args: {
  binding: LiveAiRuntimeBinding;
  context: Record<string, unknown>;
}): string {
  return assertResolvedPrompt({
    binding: args.binding,
    renderedPrompt: renderJsonPromptTemplate({
      promptTemplate: args.binding.promptTemplate,
      context: args.context,
    }),
  });
}
