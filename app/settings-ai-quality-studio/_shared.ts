import type {
  AiDraftDerivationSource,
  AiTaskDetail,
  AiTaskDraftCreationMeta,
  AiTaskDraftPayload,
  AiTaskSummary,
  AiTaskVersionDetail,
} from '@/types';

export default function SettingsAiQualityStudioSharedModule() {
  return null;
}

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

export type EntryCleanupInstructionState = {
  systemRulesInstruction: string;
  generalInstruction: string;
  titleInstruction: string;
  bodyInstruction: string;
  summaryShortInstruction: string;
};

export type EntryCleanupTokenId = 'rawText' | 'title' | 'body' | 'summary_short';

export type EntryCleanupTokenDefinition = {
  id: EntryCleanupTokenId;
  kind: 'input' | 'output';
  label: string;
  token: string;
};

export const ENTRY_CLEANUP_TOKEN_DEFINITIONS: EntryCleanupTokenDefinition[] = [
  { id: 'rawText', kind: 'input', label: 'Ruwe tekst', token: '{{input.rawText}}' },
  { id: 'title', kind: 'output', label: 'Titel', token: '{{output.title}}' },
  { id: 'body', kind: 'output', label: 'Body', token: '{{output.body}}' },
  { id: 'summary_short', kind: 'output', label: 'Summary short', token: '{{output.summary_short}}' },
];

export function getEntryCleanupTokenById(id: EntryCleanupTokenId): EntryCleanupTokenDefinition {
  return ENTRY_CLEANUP_TOKEN_DEFINITIONS.find((item) => item.id === id) ?? ENTRY_CLEANUP_TOKEN_DEFINITIONS[0];
}

export function getEntryCleanupTokenByRawText(rawToken: string): EntryCleanupTokenDefinition | null {
  const normalized = rawToken.replace(/\s+/g, '').toLowerCase();
  return (
    ENTRY_CLEANUP_TOKEN_DEFINITIONS.find(
      (item) => item.token.replace(/\s+/g, '').toLowerCase() === normalized
    ) ?? null
  );
}

export type EntryCleanupTechnicalContract = {
  inputFields: string[];
  outputKeys: string[];
  outputType: 'json_object';
  noTextOutsideJson: boolean;
  sourceOnly: boolean;
  allowEmptySummaryShort: boolean;
  responseFormat: 'json_object';
};

const DEFAULT_ENTRY_CLEANUP_TECHNICAL_CONTRACT: EntryCleanupTechnicalContract = {
  inputFields: ['rawText'],
  outputKeys: ['title', 'body', 'summary_short'],
  outputType: 'json_object',
  noTextOutsideJson: true,
  sourceOnly: true,
  allowEmptySummaryShort: true,
  responseFormat: 'json_object',
};

const ENTRY_CLEANUP_ALLOWED_FIELD_NAMES = [
  'rawText',
  'title',
  'body',
  'summary_short',
  'input.rawText',
  'output.title',
  'output.body',
  'output.summary_short',
] as const;

const ENTRY_CLEANUP_INSTRUCTION_LABELS: Record<keyof EntryCleanupInstructionState, string> = {
  systemRulesInstruction: 'Systeemregels',
  generalInstruction: 'Algemene instructie',
  titleInstruction: 'Titel',
  bodyInstruction: 'Body',
  summaryShortInstruction: 'Summary_short',
};

function emptyEntryCleanupInstructionState(): EntryCleanupInstructionState {
  return {
    systemRulesInstruction: '',
    generalInstruction: '',
    titleInstruction: '',
    bodyInstruction: '',
    summaryShortInstruction: '',
  };
}

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

  let instruction = '';
  if (typeof parsed.instruction === 'string') {
    instruction = parsed.instruction;
  }

  if (typeof parsed.instruction === 'object' && parsed.instruction !== null && !Array.isArray(parsed.instruction)) {
    const entryInstructions = parseEntryCleanupInstructionStateFromUnknown(parsed.instruction);
    instruction = formatEntryCleanupInstructionStateForEditor(entryInstructions);
  }

  const inputContext = { ...parsed };
  delete inputContext.instruction;

  return {
    taskInstruction: instruction,
    promptTemplateInputContext:
      Object.keys(inputContext).length > 0 ? JSON.stringify(inputContext, null, 2) : null,
  };
}

function parseEntryCleanupInstructionStateFromUnknown(value: unknown): EntryCleanupInstructionState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return emptyEntryCleanupInstructionState();
  }

  const source = value as Record<string, unknown>;
  return {
    systemRulesInstruction:
      typeof source.systemRulesInstruction === 'string'
        ? source.systemRulesInstruction
        : typeof source.system_rules === 'string'
          ? source.system_rules
          : '',
    generalInstruction:
      typeof source.generalInstruction === 'string'
        ? source.generalInstruction
        : typeof source.general === 'string'
          ? source.general
          : '',
    titleInstruction: typeof source.titleInstruction === 'string' ? source.titleInstruction : '',
    bodyInstruction: typeof source.bodyInstruction === 'string' ? source.bodyInstruction : '',
    summaryShortInstruction:
      typeof source.summaryShortInstruction === 'string'
        ? source.summaryShortInstruction
        : typeof source.summary_short === 'string'
          ? source.summary_short
          : '',
  };
}

function parseLegacyEntryCleanupInstructionText(value: string): EntryCleanupInstructionState {
  const trimmed = value.trim();
  if (!trimmed) {
    return emptyEntryCleanupInstructionState();
  }

  const lines = trimmed.split('\n');
  const next = emptyEntryCleanupInstructionState();
  let current: keyof EntryCleanupInstructionState = 'generalInstruction';
  let pendingEmptyLines = 0;
  const keyMap: Record<string, keyof EntryCleanupInstructionState> = {
    systeemregels: 'systemRulesInstruction',
    'systeem regels': 'systemRulesInstruction',
    systemrules: 'systemRulesInstruction',
    'system rules': 'systemRulesInstruction',
    'algemene instructie': 'generalInstruction',
    title: 'titleInstruction',
    titel: 'titleInstruction',
    body: 'bodyInstruction',
    summary_short: 'summaryShortInstruction',
    'summary short': 'summaryShortInstruction',
    summaryshort: 'summaryShortInstruction',
  };

  for (const line of lines) {
    const match = line.match(/^\s*([^:]+):\s*$/);
    if (match) {
      const maybe = keyMap[match[1].trim().toLowerCase()];
      if (maybe) {
        current = maybe;
        pendingEmptyLines = 0;
        continue;
      }
    }

    if (line.trim().length === 0) {
      pendingEmptyLines += 1;
      continue;
    }

    if (pendingEmptyLines > 0 && next[current]) {
      next[current] = `${next[current]}${'\n'.repeat(pendingEmptyLines)}`;
    }
    pendingEmptyLines = 0;

    next[current] = next[current] ? `${next[current]}\n${line}` : line;
  }

  return {
    systemRulesInstruction: next.systemRulesInstruction,
    generalInstruction: next.generalInstruction,
    titleInstruction: next.titleInstruction,
    bodyInstruction: next.bodyInstruction,
    summaryShortInstruction: next.summaryShortInstruction,
  };
}

export function parseEntryCleanupInstructionStateFromText(value: string): EntryCleanupInstructionState {
  return parseLegacyEntryCleanupInstructionText(value);
}

export function parseEntryCleanupInstructionStateFromPromptTemplate(promptTemplate: string): EntryCleanupInstructionState {
  const parsed = parsePromptTemplateAsJsonObject(promptTemplate);
  if (!parsed) {
    return parseLegacyEntryCleanupInstructionText(promptTemplate);
  }

  if (typeof parsed.instruction === 'object' && parsed.instruction !== null && !Array.isArray(parsed.instruction)) {
    return parseEntryCleanupInstructionStateFromUnknown(parsed.instruction);
  }

  if (typeof parsed.instruction === 'string') {
    return parseLegacyEntryCleanupInstructionText(parsed.instruction);
  }

  return emptyEntryCleanupInstructionState();
}

export function formatEntryCleanupInstructionStateForEditor(
  instructions: EntryCleanupInstructionState
): string {
  const rows: [keyof EntryCleanupInstructionState, string][] = [
    ['systemRulesInstruction', instructions.systemRulesInstruction],
    ['generalInstruction', instructions.generalInstruction],
    ['titleInstruction', instructions.titleInstruction],
    ['bodyInstruction', instructions.bodyInstruction],
    ['summaryShortInstruction', instructions.summaryShortInstruction],
  ];

  return rows
    .map(([key, value]) => `${ENTRY_CLEANUP_INSTRUCTION_LABELS[key]}:\n${value}`)
    .join('\n\n');
}

export function buildEntryCleanupPromptTemplate(args: {
  promptTemplateRaw: string;
  instructions: EntryCleanupInstructionState;
}): string {
  const parsed = parsePromptTemplateAsJsonObject(args.promptTemplateRaw);
  const current: Record<string, unknown> = parsed ? { ...parsed } : { rawText: '{{raw_text}}' };

  current.instruction = {
    systemRulesInstruction: args.instructions.systemRulesInstruction,
    generalInstruction: args.instructions.generalInstruction,
    titleInstruction: args.instructions.titleInstruction,
    bodyInstruction: args.instructions.bodyInstruction,
    summaryShortInstruction: args.instructions.summaryShortInstruction,
  };

  return JSON.stringify(current, null, 2);
}

export function getEntryCleanupInstructionWarnings(input: string): string[] {
  const warnings = new Set<string>();

  if (/\bsummaryShort\b/.test(input)) {
    warnings.add('Gebruik `summary_short` in plaats van `summaryShort`.');
  }

  const explicitRefs = [
    ...Array.from(input.matchAll(/`([A-Za-z_][A-Za-z0-9_.]*)`/g)).map((match) => match[1]),
    ...Array.from(input.matchAll(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g)).map((match) => match[1]),
  ];

  for (const ref of explicitRefs) {
    if (!ENTRY_CLEANUP_ALLOWED_FIELD_NAMES.includes(ref as (typeof ENTRY_CLEANUP_ALLOWED_FIELD_NAMES)[number])) {
      warnings.add(`Onbekend veld: \`${ref}\`. Gebruik alleen rawText, title, body of summary_short.`);
    }
  }

  return Array.from(warnings);
}

function mergeTaskInstructionIntoPromptTemplate(args: {
  promptTemplateRaw: string;
  taskInstruction: string;
}): string {
  const parsed = parsePromptTemplateAsJsonObject(args.promptTemplateRaw);
  if (!parsed) {
    return args.taskInstruction;
  }

  if (typeof parsed.instruction === 'object' && parsed.instruction !== null && !Array.isArray(parsed.instruction)) {
    return args.promptTemplateRaw;
  }

  if (typeof parsed.instruction !== 'string') {
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

export type TaskResponseContractField = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
  required?: boolean;
};

export function getTaskResponseContractFields(taskKey: string): TaskResponseContractField[] {
  if (taskKey === 'entry_cleanup') {
    return [
      { name: 'title', type: 'string', required: true },
      { name: 'body', type: 'string', required: true },
      { name: 'summary_short', type: 'string', required: true },
    ];
  }
  return [];
}

export function getTaskInputContractLines(taskKey: string): string[] {
  if (taskKey === 'entry_cleanup') {
    return ['rawText: string (broninvoer van 1 entry)'];
  }
  return [];
}

export function getTaskSystemContractLines(taskKey: string): string[] {
  if (taskKey === 'entry_cleanup') {
    return [
      'Gebruik alleen opgegeven bronvelden (geen externe context).',
      'Geef alleen JSON terug volgens het afgesproken contract.',
      'Respecteer vaste veldgrenzen: title, body, summary_short.',
    ];
  }
  return [];
}

export function getEntryCleanupTechnicalContractFromConfig(config: Record<string, unknown> | null | undefined): EntryCleanupTechnicalContract {
  const technical = config && typeof config.technical_contract === 'object' && config.technical_contract !== null
    ? (config.technical_contract as Record<string, unknown>)
    : null;

  if (!technical) {
    return DEFAULT_ENTRY_CLEANUP_TECHNICAL_CONTRACT;
  }

  const inputFields = Array.isArray(technical.inputFields)
    ? technical.inputFields.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : DEFAULT_ENTRY_CLEANUP_TECHNICAL_CONTRACT.inputFields;
  const outputKeys = Array.isArray(technical.outputKeys)
    ? technical.outputKeys.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : DEFAULT_ENTRY_CLEANUP_TECHNICAL_CONTRACT.outputKeys;

  return {
    inputFields: inputFields.length > 0 ? inputFields : DEFAULT_ENTRY_CLEANUP_TECHNICAL_CONTRACT.inputFields,
    outputKeys: outputKeys.length > 0 ? outputKeys : DEFAULT_ENTRY_CLEANUP_TECHNICAL_CONTRACT.outputKeys,
    outputType: 'json_object',
    noTextOutsideJson: technical.noTextOutsideJson !== false,
    sourceOnly: technical.sourceOnly !== false,
    allowEmptySummaryShort: technical.allowEmptySummaryShort !== false,
    responseFormat: 'json_object',
  };
}

export function getEntryCleanupTechnicalContractLines(contract: EntryCleanupTechnicalContract): string[] {
  return [
    `Input: ${contract.inputFields.join(', ')}`,
    `Output: ${contract.outputKeys.join(', ')}`,
    'Formaat: JSON object',
    contract.sourceOnly ? 'Alleen bronvelden' : 'Bronveldrestrictie uitgeschakeld',
    contract.noTextOutsideJson ? 'Geen tekst buiten JSON' : 'Tekst buiten JSON toegestaan',
    contract.allowEmptySummaryShort ? 'summary_short mag leeg zijn' : 'summary_short moet gevuld zijn',
    `response_format: ${contract.responseFormat}`,
  ];
}

export function getTaskConsistencyInfo(taskKey: string): TaskConsistencyInfo {
  const shared: Record<string, TaskConsistencyInfo> = {
    entry_cleanup: {
      representation: 'shared_runtime_family',
      affectsLabel: 'title, body en summary_short',
      taskOutputLabel: 'entry normalisatie-output',
      familyLabel: 'Entry normalisatie runtime family',
      explanation:
        'Deze taak is onderdeel van de gedeelde entry-normalisatieflow en beïnvloedt de canonieke entry-outputvelden.',
    },
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

export type AiQualityFamilyKey = 'moments' | 'today' | 'week' | 'month';

export type AiQualityFamilyDefinition = {
  key: AiQualityFamilyKey;
  title: string;
  description: string;
  metaLabel: string;
  taskKeys: string[];
};

export const AI_QUALITY_FAMILIES: AiQualityFamilyDefinition[] = [
  {
    key: 'moments',
    title: 'Momenten',
    description: 'Opschonen en samenvatting van één moment.',
    metaLabel: '2 onderdelen',
    taskKeys: ['entry_cleanup', 'entry_summary'],
  },
  {
    key: 'today',
    title: 'Vandaag',
    description: 'Samenvatting en dagverhaal.',
    metaLabel: '2 onderdelen',
    taskKeys: ['day_summary', 'day_narrative'],
  },
  {
    key: 'week',
    title: 'Week',
    description: 'Samenvatting, verhaal, highlights en reflectiepunten.',
    metaLabel: '4 onderdelen',
    taskKeys: ['week_summary', 'week_narrative', 'week_highlights', 'week_reflection_points'],
  },
  {
    key: 'month',
    title: 'Maand',
    description: 'Samenvatting, verhaal, highlights en reflectiepunten.',
    metaLabel: '4 onderdelen',
    taskKeys: ['month_summary', 'month_narrative', 'month_highlights', 'month_reflection_points'],
  },
];

export const AI_QUALITY_TASK_LABELS: Record<string, string> = {
  entry_cleanup: 'Moment opschonen',
  entry_summary: 'Moment samenvatting',
  day_summary: 'Dag samenvatting',
  day_narrative: 'Dagverhaal',
  week_summary: 'Week samenvatting',
  week_narrative: 'Weekverhaal',
  week_highlights: 'Week highlights',
  week_reflection_points: 'Week reflectiepunten',
  month_summary: 'Maand samenvatting',
  month_narrative: 'Maandverhaal',
  month_highlights: 'Maand highlights',
  month_reflection_points: 'Maand reflectiepunten',
};

export function getAiQualityFamilyByKey(key: string): AiQualityFamilyDefinition | null {
  return AI_QUALITY_FAMILIES.find((family) => family.key === key) ?? null;
}

export function getAiQualityFamilyTasks(familyKey: AiQualityFamilyKey, tasks: AiTaskSummary[]): AiTaskSummary[] {
  const family = getAiQualityFamilyByKey(familyKey);
  if (!family) return [];

  const byKey = new Map(tasks.map((task) => [task.key, task]));
  return family.taskKeys.map((taskKey) => byKey.get(taskKey)).filter((task): task is AiTaskSummary => Boolean(task));
}

export function getAiQualityFamilyStatusSummary(tasks: AiTaskSummary[]): string {
  if (tasks.length === 0) return 'Niet ingesteld';

  const live = tasks.filter((task) => Boolean(task.liveVersion)).length;
  const draft = tasks.filter((task) => !task.liveVersion && task.hasDraft).length;

  if (live === tasks.length) return 'Runtime actief';
  if (live === 0 && draft === 0) return 'Niet ingesteld';
  if (live === 0 && draft > 0) return 'Draft actief';
  if (live > 0 && draft > 0) return 'Runtime + draft';
  return 'Deels actief';
}
