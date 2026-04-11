import type {
  AiDraftDerivationSource,
  AiTaskDetail,
  AiTaskDraftCreationMeta,
  AiTaskDraftPayload,
  AiTaskVersionDetail,
} from '@/types';

export const AI_QUALITY_ALLOWED_MODELS = [
  { value: 'gpt-5.4-mini', label: 'GPT-5.4 mini' },
  { value: 'gpt-5.4', label: 'GPT-5.4' },
] as const;

const BASELINE_METADATA_KEYS = [
  'baseline_import',
  'runtime_flow',
  'output_field',
  'baseline_source',
] as const;

function isAllowedModel(value: string): boolean {
  return AI_QUALITY_ALLOWED_MODELS.some((model) => model.value === value);
}

export type DraftFormState = {
  model: string;
  taskInstruction: string;
  promptTemplateRaw: string;
  promptTemplateInputContext: string | null;
  systemInstructions: string;
  outputSchemaJsonText: string;
  configJsonText: string;
  baselineMetadataJsonText: string | null;
  minItemsText: string;
  maxItemsText: string;
  changelog: string;
};

function splitConfigForEditor(config: Record<string, unknown>): {
  editableConfig: Record<string, unknown>;
  baselineMetadata: Record<string, unknown>;
} {
  const editableConfig: Record<string, unknown> = {};
  const baselineMetadata: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(config)) {
    if (BASELINE_METADATA_KEYS.includes(key as (typeof BASELINE_METADATA_KEYS)[number])) {
      baselineMetadata[key] = value;
      continue;
    }
    editableConfig[key] = value;
  }

  return { editableConfig, baselineMetadata };
}

function parsePromptTemplateAsJsonObject(
  value: string
): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function extractTaskInstructionFromPromptTemplate(promptTemplate: string): {
  taskInstruction: string;
  promptTemplateInputContext: string | null;
} {
  const parsed = parsePromptTemplateAsJsonObject(promptTemplate);
  if (!parsed) {
    return {
      taskInstruction: promptTemplate,
      promptTemplateInputContext: null,
    };
  }

  const instruction = typeof parsed.instruction === 'string' ? parsed.instruction : '';
  const inputContext = { ...parsed };
  delete inputContext.instruction;

  return {
    taskInstruction: instruction,
    promptTemplateInputContext:
      Object.keys(inputContext).length > 0 ? JSON.stringify(inputContext, null, 2) : null,
  };
}

function mergeTaskInstructionIntoPromptTemplate(args: {
  promptTemplateRaw: string;
  taskInstruction: string;
}): string {
  const parsed = parsePromptTemplateAsJsonObject(args.promptTemplateRaw);
  if (!parsed || typeof parsed.instruction !== 'string') {
    return args.taskInstruction;
  }

  return JSON.stringify(
    {
      ...parsed,
      instruction: args.taskInstruction,
    },
    null,
    2
  );
}

export function toDraftFormState(version: AiTaskVersionDetail): DraftFormState {
  const promptView = extractTaskInstructionFromPromptTemplate(version.promptTemplate);
  const config = version.configJson ?? {};
  const { editableConfig, baselineMetadata } = splitConfigForEditor(config);
  return {
    model: version.model,
    taskInstruction: promptView.taskInstruction,
    promptTemplateRaw: version.promptTemplate,
    promptTemplateInputContext: promptView.promptTemplateInputContext,
    systemInstructions: version.systemInstructions,
    outputSchemaJsonText: JSON.stringify(version.outputSchemaJson ?? {}, null, 2),
    configJsonText: JSON.stringify(editableConfig, null, 2),
    baselineMetadataJsonText:
      Object.keys(baselineMetadata).length > 0 ? JSON.stringify(baselineMetadata, null, 2) : null,
    minItemsText: version.minItems === null ? '' : String(version.minItems),
    maxItemsText: version.maxItems === null ? '' : String(version.maxItems),
    changelog: version.changelog ?? '',
  };
}

function parseIntegerInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const next = Number.parseInt(trimmed, 10);
  return Number.isInteger(next) ? next : Number.NaN;
}

export function parseDraftFormState(form: DraftFormState): {
  payload: AiTaskDraftPayload | null;
  error: string | null;
} {
  let outputSchemaJson: Record<string, unknown>;
  let configJson: Record<string, unknown>;

  try {
    const parsed = JSON.parse(form.outputSchemaJsonText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { payload: null, error: 'Output schema moet een JSON object zijn.' };
    }
    outputSchemaJson = parsed as Record<string, unknown>;
  } catch {
    return { payload: null, error: 'Output schema JSON is ongeldig.' };
  }

  try {
    const parsed = JSON.parse(form.configJsonText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { payload: null, error: 'Config moet een JSON object zijn.' };
    }
    configJson = parsed as Record<string, unknown>;
  } catch {
    return { payload: null, error: 'Config JSON is ongeldig.' };
  }

  const minItems = parseIntegerInput(form.minItemsText);
  const maxItems = parseIntegerInput(form.maxItemsText);
  if (Number.isNaN(minItems) || Number.isNaN(maxItems)) {
    return { payload: null, error: 'Min/max items moeten gehele getallen of leeg zijn.' };
  }
  if (minItems !== null && minItems < 0) {
    return { payload: null, error: 'Min items kan niet negatief zijn.' };
  }
  if (maxItems !== null && maxItems < 0) {
    return { payload: null, error: 'Max items kan niet negatief zijn.' };
  }
  if (minItems !== null && maxItems !== null && maxItems < minItems) {
    return { payload: null, error: 'Max items moet groter of gelijk zijn aan min items.' };
  }

  const model = form.model.trim();
  if (!model) {
    return { payload: null, error: 'Model is verplicht.' };
  }
  if (!isAllowedModel(model)) {
    return { payload: null, error: 'Kies een model uit de toegestane lijst.' };
  }

  let baselineMetadata: Record<string, unknown> = {};
  if (form.baselineMetadataJsonText) {
    try {
      const parsed = JSON.parse(form.baselineMetadataJsonText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { payload: null, error: 'Baseline metadata is ongeldig.' };
      }
      baselineMetadata = parsed as Record<string, unknown>;
    } catch {
      return { payload: null, error: 'Baseline metadata is ongeldig.' };
    }
  }

  return {
    payload: {
      model,
      promptTemplate: mergeTaskInstructionIntoPromptTemplate({
        promptTemplateRaw: form.promptTemplateRaw,
        taskInstruction: form.taskInstruction,
      }),
      systemInstructions: form.systemInstructions,
      outputSchemaJson,
      configJson: {
        ...configJson,
        ...baselineMetadata,
      },
      minItems,
      maxItems,
      changelog: form.changelog.trim() || null,
    },
    error: null,
  };
}

function normalizeJsonForCompare(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeJsonForCompare(item));
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    const normalized: Record<string, unknown> = {};
    for (const [key, nested] of entries) {
      normalized[key] = normalizeJsonForCompare(nested);
    }
    return normalized;
  }
  return value;
}

function buildPayloadFingerprint(payload: AiTaskDraftPayload): string {
  return JSON.stringify({
    model: payload.model.trim(),
    promptTemplate: payload.promptTemplate,
    systemInstructions: payload.systemInstructions,
    outputSchemaJson: normalizeJsonForCompare(payload.outputSchemaJson),
    configJson: normalizeJsonForCompare(payload.configJson),
    minItems: payload.minItems,
    maxItems: payload.maxItems,
    changelog: payload.changelog ?? null,
  });
}

export function isDraftFormDirty(form: DraftFormState, version: AiTaskVersionDetail): boolean {
  const parsed = parseDraftFormState(form);
  if (!parsed.payload) {
    return true;
  }

  const currentFingerprint = buildPayloadFingerprint(parsed.payload);
  const originalFingerprint = buildPayloadFingerprint({
    model: version.model,
    promptTemplate: version.promptTemplate,
    systemInstructions: version.systemInstructions,
    outputSchemaJson: version.outputSchemaJson,
    configJson: version.configJson,
    minItems: version.minItems,
    maxItems: version.maxItems,
    changelog: version.changelog ?? null,
  });

  return currentFingerprint !== originalFingerprint;
}

export function getDraftFormJsonFieldErrors(form: DraftFormState): {
  outputSchemaError: string | null;
  configError: string | null;
} {
  let outputSchemaError: string | null = null;
  let configError: string | null = null;

  try {
    const parsed = JSON.parse(form.outputSchemaJsonText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      outputSchemaError = 'Gebruik een JSON object.';
    }
  } catch {
    outputSchemaError = 'JSON is ongeldig.';
  }

  try {
    const parsed = JSON.parse(form.configJsonText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      configError = 'Gebruik een JSON object.';
    }
  } catch {
    configError = 'JSON is ongeldig.';
  }

  return { outputSchemaError, configError };
}

export function buildLineDiffText(liveOutputText: string, testOutputText: string): string {
  const liveLines = liveOutputText.split('\n');
  const testLines = testOutputText.split('\n');
  const maxLength = Math.max(liveLines.length, testLines.length);
  const rows: string[] = [];
  for (let index = 0; index < maxLength; index += 1) {
    const liveLine = liveLines[index] ?? '';
    const testLine = testLines[index] ?? '';
    if (liveLine === testLine) {
      rows.push(`= ${liveLine}`);
      continue;
    }
    if (liveLine) rows.push(`- ${liveLine}`);
    if (testLine) rows.push(`+ ${testLine}`);
  }
  return rows.join('\n');
}

export function formatDateTimeLabel(value: string | null): string {
  if (!value) return 'Onbekend';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function derivationLabel(derivation: AiTaskDraftCreationMeta | null): string | null {
  if (!derivation) return null;
  const version = derivation.versionNumber === null ? '' : ` v${derivation.versionNumber}`;
  const labels: Record<AiDraftDerivationSource, string> = {
    live: `Gebaseerd op live${version}`,
    latest_draft: `Gebaseerd op laatste draft${version}`,
    latest_version: `Gebaseerd op laatste versie${version}`,
    empty: 'Nieuwe lege draft',
  };
  return labels[derivation.source];
}

export function deriveDraftOriginLabel(detail: AiTaskDetail, draft: AiTaskVersionDetail): string {
  const previous = detail.versions.find((item) => item.versionNumber === draft.versionNumber - 1) ?? null;
  if (!previous) {
    return 'Afgeleid van: lege start';
  }
  if (previous.status === 'live') {
    return `Afgeleid van: runtime-basis v${previous.versionNumber}`;
  }
  if (previous.status === 'draft') {
    return `Afgeleid van: draft v${previous.versionNumber}`;
  }
  return `Afgeleid van: versie v${previous.versionNumber}`;
}

export function getTaskContractNotice(taskKey: string): { title: string; lines: string[] } | null {
  const notices: Record<string, { title: string; lines: string[] }> = {
    entry_cleanup: {
      title: 'Doel van dit onderdeel',
      lines: [
        'Bron opschonen tot rustig, natuurlijk Nederlands.',
        'Niet samenvatten.',
        'Geen nieuwe claims of interpretaties toevoegen.',
      ],
    },
    day_narrative: {
      title: 'Doel van dit onderdeel',
      lines: [
        'Maak een volledige, rustige dagtekst op basis van de bron.',
        'Niet reduceren tot samenvatting.',
        'Geen nieuwe oorzaken, inzichten of claims toevoegen.',
      ],
    },
  };

  return notices[taskKey] ?? null;
}

export type TaskConsistencyInfo = {
  representation: 'single_output' | 'shared_runtime_family';
  affectsLabel: string;
  taskOutputLabel: string;
  familyLabel?: string;
  explanation?: string;
};

export function getTaskConsistencyInfo(taskKey: string): TaskConsistencyInfo {
  const shared: Record<string, TaskConsistencyInfo> = {
    day_summary: {
      representation: 'shared_runtime_family',
      affectsLabel: 'samenvatting, dagverhaal en secties',
      taskOutputLabel: 'samenvatting',
      familyLabel: 'Dag-opbouw runtime family',
      explanation:
        'Deze draft hoort bij een gedeelde dag-opbouw. Je bewerkt hier de taakfocus voor samenvatting, binnen dezelfde runtime-familie.',
    },
    day_narrative: {
      representation: 'shared_runtime_family',
      affectsLabel: 'samenvatting, dagverhaal en secties',
      taskOutputLabel: 'dagverhaal',
      familyLabel: 'Dag-opbouw runtime family',
      explanation:
        'Deze draft hoort bij een gedeelde dag-opbouw. Je bewerkt hier de taakfocus voor het dagverhaal, binnen dezelfde runtime-familie.',
    },
  };

  return (
    shared[taskKey] ?? {
      representation: 'single_output',
      affectsLabel: 'alleen deze taakoutput',
      taskOutputLabel: 'taakoutput',
    }
  );
}

export function versionStatusLabel(status: AiTaskVersionDetail['status']): string {
  const labels: Record<AiTaskVersionDetail['status'], string> = {
    live: 'Live',
    draft: 'Draft',
    testing: 'Testing',
    archived: 'Archief',
  };
  return labels[status];
}
