import type {
  AiPromptAssistActionDefinition,
  AiPromptAssistActionId,
  AiPromptAssistActionOutputType,
  AiPromptAssistAllowedChangeKind,
  AiPromptAssistInvariant,
  AiPromptAssistLayerPrecedence,
  AiPromptAssistLayerRole,
  AiPromptAssistLayerSemantics,
  AiPromptAssistReadOnlyContext,
  AiPromptAssistTargetLayerKey,
  AiPromptAssistTargetLayerType,
  AiDraftDerivationSource,
  AiTaskDetail,
  AiTaskDraftCreationMeta,
  AiTaskDraftPayload,
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
  outputSchemaJsonText: string;
  configJsonText: string;
  baselineMetadataJsonText: string | null;
  changelog: string;
};

export type EntryCleanupInstructionState = {
  systemRulesInstruction: string;
  generalInstruction: string;
  titleInstruction: string;
  bodyInstruction: string;
  summaryShortInstruction: string;
};

export const ENTRY_CLEANUP_PROMPT_ASSIST_TARGETS: {
  key: AiPromptAssistTargetLayerKey;
  layerType: AiPromptAssistTargetLayerType;
  label: string;
}[] = [
  { key: 'systemRulesInstruction', layerType: 'system', label: 'Systeemregels' },
  { key: 'generalInstruction', layerType: 'general', label: 'Algemene instructie' },
  { key: 'titleInstruction', layerType: 'field', label: 'Titel' },
  { key: 'bodyInstruction', layerType: 'field', label: 'Body' },
  { key: 'summaryShortInstruction', layerType: 'field', label: 'Summary short' },
];

export function getEntryCleanupPromptAssistTargetLabel(target: AiPromptAssistTargetLayerKey): string {
  return ENTRY_CLEANUP_PROMPT_ASSIST_TARGETS.find((item) => item.key === target)?.label ?? target;
}

export function getEntryCleanupPromptAssistTargetLayerType(
  target: AiPromptAssistTargetLayerKey
): AiPromptAssistTargetLayerType {
  return ENTRY_CLEANUP_PROMPT_ASSIST_TARGETS.find((item) => item.key === target)?.layerType ?? 'field';
}

export const AI_PROMPT_ASSIST_ACTIONS: AiPromptAssistActionDefinition[] = [
  {
    id: 'verdeel_over_velden',
    label: 'Verdelen over velden',
    helper: 'Verdeel instructies over alle bewerkbare velden',
    order: 1,
    placement: 'primary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'compacter',
    label: 'Compacter',
    helper: 'Korter zonder betekenisverlies',
    order: 2,
    placement: 'primary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'ontdubbelen',
    label: 'Ontdubbelen',
    helper: 'Overlap verwijderen',
    order: 3,
    placement: 'primary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'verhelderen',
    label: 'Verhelderen',
    helper: 'Minder ambigu en specifieker',
    order: 4,
    placement: 'primary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'check_contract',
    label: 'Check contract',
    helper: 'Check met taakdoel en contract',
    order: 5,
    placement: 'primary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'check_overlap',
    label: 'Check overlap',
    helper: 'Zoek overlap tussen lagen',
    order: 6,
    placement: 'secondary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'verplaats_naar_juiste_laag',
    label: 'Juiste laag',
    helper: 'Signaleer betere laagplaatsing',
    order: 7,
    placement: 'secondary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'maak_strikter',
    label: 'Strikter',
    helper: 'Maak minder vrijblijvend',
    order: 8,
    placement: 'secondary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
  },
  {
    id: 'check_outputvorm',
    label: 'Outputvorm',
    helper: 'Check prompt vs outputschema',
    order: 9,
    placement: 'secondary',
    allowedTargetLayerTypes: ['system', 'general', 'field'],
    relevantOutputTypes: ['object', 'compound'],
  },
];

export function mapTaskOutputTypeToAssistOutputType(taskKey: string): AiPromptAssistActionOutputType {
  if (taskKey === 'entry_cleanup') return 'compound';
  if (taskKey.includes('highlights') || taskKey.includes('reflection_points')) return 'list';
  if (taskKey.includes('summary') || taskKey.includes('narrative')) return 'text';
  return 'text';
}

export function getPromptAssistActionsForTarget(args: {
  targetLayerType: AiPromptAssistTargetLayerType;
  taskKey: string;
}): AiPromptAssistActionDefinition[] {
  const outputType = mapTaskOutputTypeToAssistOutputType(args.taskKey);
  return AI_PROMPT_ASSIST_ACTIONS.filter((item) => {
    if (!item.allowedTargetLayerTypes.includes(args.targetLayerType)) return false;
    if (item.relevantOutputTypes && !item.relevantOutputTypes.includes(outputType)) return false;
    return true;
  }).sort((a, b) => a.order - b.order);
}

export function getPromptAssistActionById(id: AiPromptAssistActionId): AiPromptAssistActionDefinition {
  return AI_PROMPT_ASSIST_ACTIONS.find((item) => item.id === id) ?? AI_PROMPT_ASSIST_ACTIONS[0];
}

export type EntryCleanupTokenId = 'rawText' | 'title' | 'body' | 'summary_short';

export type EntryCleanupTokenDefinition = {
  id: EntryCleanupTokenId;
  kind: 'input' | 'output';
  label: string;
  token: string;
};

export type StructuredPromptTokenDefinition = {
  id: string;
  kind: 'input' | 'output';
  label: string;
  token: string;
};

export type StructuredPromptSectionDefinition = {
  key: string;
  label: string;
  helper: string;
  layerType: AiPromptAssistTargetLayerType;
  minHeight: number;
};

export type StructuredPromptEditorDefinition = {
  taskKey: string;
  title: string;
  subtitle: string;
  runtimeFamilyLabel: string;
  sections: StructuredPromptSectionDefinition[];
  tokens: StructuredPromptTokenDefinition[];
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

const DAY_SHARED_TOKEN_DEFINITIONS: StructuredPromptTokenDefinition[] = [
  { id: 'journalDate', kind: 'input', label: 'Datum', token: '{{journal_date}}' },
  { id: 'entryTitle', kind: 'input', label: 'Entry titel', token: '{{entry_title}}' },
  { id: 'entryBody', kind: 'input', label: 'Entry body', token: '{{entry_body}}' },
  { id: 'summary', kind: 'output', label: 'Samenvatting', token: '{{output.summary}}' },
  { id: 'narrativeText', kind: 'output', label: 'Dagverhaal', token: '{{output.narrativeText}}' },
  { id: 'sections', kind: 'output', label: 'Secties', token: '{{output.sections}}' },
];

const REFLECTION_SHARED_TOKEN_DEFINITIONS: StructuredPromptTokenDefinition[] = [
  { id: 'periodStart', kind: 'input', label: 'Periode start', token: '{{period_start}}' },
  { id: 'periodEnd', kind: 'input', label: 'Periode einde', token: '{{period_end}}' },
  { id: 'journalDate', kind: 'input', label: 'Dagdatum', token: '{{journal_date}}' },
  { id: 'summaryInput', kind: 'input', label: 'Dag samenvatting', token: '{{summary}}' },
  { id: 'narrativeInput', kind: 'input', label: 'Dag verhaal', token: '{{narrative_text}}' },
  { id: 'summaryText', kind: 'output', label: 'Samenvatting', token: '{{output.summaryText}}' },
  { id: 'narrativeText', kind: 'output', label: 'Periodeverhaal', token: '{{output.narrativeText}}' },
  { id: 'highlights', kind: 'output', label: 'Highlights', token: '{{output.highlights}}' },
  { id: 'reflectionPoints', kind: 'output', label: 'Reflectiepunten', token: '{{output.reflectionPoints}}' },
];

const STRUCTURED_PROMPT_DEFINITIONS: Record<string, StructuredPromptEditorDefinition> = {
  entry_cleanup: {
    taskKey: 'entry_cleanup',
    title: 'Moments prompt',
    subtitle: 'Structured editor voor entry-normalisatie.',
    runtimeFamilyLabel: 'entry normalisatie',
    sections: [
      {
        key: 'systemRulesInstruction',
        label: 'Systeemregels',
        helper: 'Geldt voor alle outputs. Houd dit inhoudelijk en brongebonden.',
        layerType: 'system',
        minHeight: 150,
      },
      {
        key: 'generalInstruction',
        label: 'Algemene instructie',
        helper: 'Wat deze taak als geheel moet opleveren.',
        layerType: 'general',
        minHeight: 150,
      },
      {
        key: 'titleInstruction',
        label: 'Titel',
        helper: 'Alleen regels voor het veld title.',
        layerType: 'field',
        minHeight: 120,
      },
      {
        key: 'bodyInstruction',
        label: 'Body',
        helper: 'Alleen regels voor het veld body.',
        layerType: 'field',
        minHeight: 150,
      },
      {
        key: 'summaryShortInstruction',
        label: 'Summary_short',
        helper: 'Alleen regels voor het veld summary_short.',
        layerType: 'field',
        minHeight: 120,
      },
    ],
    tokens: ENTRY_CLEANUP_TOKEN_DEFINITIONS,
  },
  day_summary: {
    taskKey: 'day_summary',
    title: 'Vandaag prompt',
    subtitle: 'Gedeelde prompt voor samenvatting, dagverhaal en secties.',
    runtimeFamilyLabel: 'dag-opbouw',
    sections: [
      {
        key: 'systemRulesInstruction',
        label: 'Systeemregels',
        helper: 'Globale grenzen voor de complete dag-opbouw output.',
        layerType: 'system',
        minHeight: 150,
      },
      {
        key: 'generalInstruction',
        label: 'Algemene instructie',
        helper: 'Hoofddoel van de gedeelde prompt.',
        layerType: 'general',
        minHeight: 160,
      },
      {
        key: 'summaryInstruction',
        label: 'Samenvatting',
        helper: 'Regels voor het samenvattingsveld.',
        layerType: 'field',
        minHeight: 120,
      },
      {
        key: 'narrativeInstruction',
        label: 'Dagverhaal',
        helper: 'Regels voor narrativeText.',
        layerType: 'field',
        minHeight: 160,
      },
      {
        key: 'sectionsInstruction',
        label: 'Secties',
        helper: 'Regels voor sections output.',
        layerType: 'field',
        minHeight: 120,
      },
    ],
    tokens: DAY_SHARED_TOKEN_DEFINITIONS,
  },
  week_summary: {
    taskKey: 'week_summary',
    title: 'Week prompt',
    subtitle: 'Gedeelde prompt voor weekoutput.',
    runtimeFamilyLabel: 'reflectie',
    sections: [
      {
        key: 'systemRulesInstruction',
        label: 'Systeemregels',
        helper: 'Globale grenzen voor de complete weekoutput.',
        layerType: 'system',
        minHeight: 150,
      },
      {
        key: 'generalInstruction',
        label: 'Algemene instructie',
        helper: 'Hoofddoel van de gedeelde weekprompt.',
        layerType: 'general',
        minHeight: 170,
      },
      {
        key: 'summaryInstruction',
        label: 'Weeksamenvatting',
        helper: 'Regels voor summaryText.',
        layerType: 'field',
        minHeight: 120,
      },
      {
        key: 'narrativeInstruction',
        label: 'Weekverhaal',
        helper: 'Regels voor narrativeText.',
        layerType: 'field',
        minHeight: 150,
      },
      {
        key: 'highlightsInstruction',
        label: 'Highlights',
        helper: 'Regels voor highlights.',
        layerType: 'field',
        minHeight: 120,
      },
      {
        key: 'reflectionPointsInstruction',
        label: 'Reflectiepunten',
        helper: 'Regels voor reflectionPoints.',
        layerType: 'field',
        minHeight: 120,
      },
    ],
    tokens: REFLECTION_SHARED_TOKEN_DEFINITIONS,
  },
  month_summary: {
    taskKey: 'month_summary',
    title: 'Maand prompt',
    subtitle: 'Gedeelde prompt voor maandoutput.',
    runtimeFamilyLabel: 'reflectie',
    sections: [
      {
        key: 'systemRulesInstruction',
        label: 'Systeemregels',
        helper: 'Globale grenzen voor de complete maandoutput.',
        layerType: 'system',
        minHeight: 150,
      },
      {
        key: 'generalInstruction',
        label: 'Algemene instructie',
        helper: 'Hoofddoel van de gedeelde maandprompt.',
        layerType: 'general',
        minHeight: 170,
      },
      {
        key: 'summaryInstruction',
        label: 'Maandsamenvatting',
        helper: 'Regels voor summaryText.',
        layerType: 'field',
        minHeight: 120,
      },
      {
        key: 'narrativeInstruction',
        label: 'Maandverhaal',
        helper: 'Regels voor narrativeText.',
        layerType: 'field',
        minHeight: 150,
      },
      {
        key: 'highlightsInstruction',
        label: 'Highlights',
        helper: 'Regels voor highlights.',
        layerType: 'field',
        minHeight: 120,
      },
      {
        key: 'reflectionPointsInstruction',
        label: 'Reflectiepunten',
        helper: 'Regels voor reflectionPoints.',
        layerType: 'field',
        minHeight: 120,
      },
    ],
    tokens: REFLECTION_SHARED_TOKEN_DEFINITIONS,
  },
};

const DEFAULT_STRUCTURED_PROMPT_DEFINITION: StructuredPromptEditorDefinition = {
  taskKey: 'generic',
  title: 'Prompt',
  subtitle: 'Structured editor.',
  runtimeFamilyLabel: 'aiqs',
  sections: [
    {
      key: 'systemRulesInstruction',
      label: 'Systeemregels',
      helper: 'Algemene regels die altijd gelden.',
      layerType: 'system',
      minHeight: 140,
    },
    {
      key: 'generalInstruction',
      label: 'Algemene instructie',
      helper: 'Hoofdinstructie voor deze prompt.',
      layerType: 'general',
      minHeight: 160,
    },
  ],
  tokens: [],
};

function parseLabeledStructuredText(
  value: string,
  sections: StructuredPromptSectionDefinition[]
): Record<string, string> {
  const byLabel = new Map<string, string>(sections.map((item) => [item.label.toLowerCase(), item.key]));
  const result: Record<string, string> = Object.fromEntries(sections.map((item) => [item.key, '']));

  const lines = value.split('\n');
  let currentKey = sections[0]?.key ?? 'generalInstruction';
  for (const line of lines) {
    const header = line.match(/^\s*([^:]+):\s*$/);
    if (header) {
      const nextKey = byLabel.get(header[1].trim().toLowerCase());
      if (nextKey) {
        currentKey = nextKey;
        continue;
      }
    }

    result[currentKey] = result[currentKey] ? `${result[currentKey]}\n${line}` : line;
  }

  return result;
}

function formatLabeledStructuredText(
  sections: StructuredPromptSectionDefinition[],
  values: Record<string, string>
): string {
  const rows = sections
    .map((section) => `${section.label}:\n${values[section.key] ?? ''}`)
    .join('\n\n')
    .trim();
  return rows;
}

export function getStructuredPromptEditorDefinition(taskKey: string): StructuredPromptEditorDefinition {
  return STRUCTURED_PROMPT_DEFINITIONS[taskKey] ?? {
    ...DEFAULT_STRUCTURED_PROMPT_DEFINITION,
    taskKey,
  };
}

export function parseStructuredPromptInstructionSections(taskKey: string, taskInstruction: string): Record<string, string> {
  const definition = getStructuredPromptEditorDefinition(taskKey);

  if (taskKey === 'entry_cleanup') {
    const parsed = parseEntryCleanupInstructionStateFromText(taskInstruction);
    return {
      systemRulesInstruction: parsed.systemRulesInstruction,
      generalInstruction: parsed.generalInstruction,
      titleInstruction: parsed.titleInstruction,
      bodyInstruction: parsed.bodyInstruction,
      summaryShortInstruction: parsed.summaryShortInstruction,
    };
  }

  return parseLabeledStructuredText(taskInstruction, definition.sections);
}

export function formatStructuredPromptInstructionSections(taskKey: string, values: Record<string, string>): string {
  if (taskKey === 'entry_cleanup') {
    return formatEntryCleanupInstructionStateForEditor({
      systemRulesInstruction: values.systemRulesInstruction ?? '',
      generalInstruction: values.generalInstruction ?? '',
      titleInstruction: values.titleInstruction ?? '',
      bodyInstruction: values.bodyInstruction ?? '',
      summaryShortInstruction: values.summaryShortInstruction ?? '',
    });
  }

  const definition = getStructuredPromptEditorDefinition(taskKey);
  return formatLabeledStructuredText(definition.sections, values);
}

export function buildStructuredPromptTemplate(args: {
  taskKey: string;
  promptTemplateRaw: string;
  sectionValues: Record<string, string>;
}): string {
  if (args.taskKey === 'entry_cleanup') {
    return buildEntryCleanupPromptTemplate({
      promptTemplateRaw: args.promptTemplateRaw,
      instructions: {
        systemRulesInstruction: args.sectionValues.systemRulesInstruction ?? '',
        generalInstruction: args.sectionValues.generalInstruction ?? '',
        titleInstruction: args.sectionValues.titleInstruction ?? '',
        bodyInstruction: args.sectionValues.bodyInstruction ?? '',
        summaryShortInstruction: args.sectionValues.summaryShortInstruction ?? '',
      },
    });
  }

  const nextInstruction = formatStructuredPromptInstructionSections(args.taskKey, args.sectionValues);
  return mergeTaskInstructionIntoPromptTemplate({
    promptTemplateRaw: args.promptTemplateRaw,
    taskInstruction: nextInstruction,
  });
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
    outputSchemaJsonText: JSON.stringify(version.outputSchemaJson ?? {}, null, 2),
    configJsonText: JSON.stringify(editableConfig, null, 2),
    baselineMetadataJsonText:
      Object.keys(baselineMetadata).length > 0 ? JSON.stringify(baselineMetadata, null, 2) : null,
    changelog: version.changelog ?? '',
  };
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
      outputSchemaJson,
      configJson: {
        ...configJson,
        ...baselineMetadata,
      },
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
    outputSchemaJson: normalizeJsonForCompare(payload.outputSchemaJson),
    configJson: normalizeJsonForCompare(payload.configJson),
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
    outputSchemaJson: version.outputSchemaJson,
    configJson: version.configJson,
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
      familyLabel: 'Entry normalisatie runtime-groep',
      explanation:
        'Deze taak is onderdeel van de gedeelde entry-normalisatieflow en beïnvloedt de canonieke entry-outputvelden.',
    },
    day_summary: {
      representation: 'shared_runtime_family',
      affectsLabel: 'samenvatting, dagverhaal en secties',
      taskOutputLabel: 'samenvatting',
      familyLabel: 'Dag-opbouw runtime-groep',
      explanation:
        'Deze draft hoort bij een gedeelde dag-opbouw. Je bewerkt hier de taakfocus voor samenvatting, binnen dezelfde runtime-familie.',
    },
    day_narrative: {
      representation: 'shared_runtime_family',
      affectsLabel: 'samenvatting, dagverhaal en secties',
      taskOutputLabel: 'dagverhaal',
      familyLabel: 'Dag-opbouw runtime-groep',
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

// ─── Prompt Assist semantics helpers ───────────────────────────────────────

/** Mapt de editorlaagtype naar de functionele OpenAI-runtimerol */
export function getLayerRoleForLayerType(layerType: AiPromptAssistTargetLayerType): AiPromptAssistLayerRole {
  if (layerType === 'system') return 'high_precedence_instruction';
  if (layerType === 'general') return 'task_goal';
  return 'field_rule';
}

/** Mapt de editorlaagtype naar de runtime-precedentie */
export function getLayerPrecedence(layerType: AiPromptAssistTargetLayerType): AiPromptAssistLayerPrecedence {
  if (layerType === 'system') return 'high';
  return 'normal';
}

/** Korte beschrijving van de laag-purpose per layerType */
function getLayerPurpose(layerType: AiPromptAssistTargetLayerType, label: string): string {
  if (layerType === 'system') {
    return `Systeemlaag (${label}): geldt als harde grens voor alle outputs van deze prompt. Hogere prioriteit dan taak- en veldregels.`;
  }
  if (layerType === 'general') {
    return `Taaklaag (${label}): het overkoepelende taakdoel. Geldt voor alle outputvelden tezamen.`;
  }
  return `Veldlaag (${label}): regels die alleen gelden voor dit specifieke outputveld.`;
}

/** Regels die bij een laagtype absoluut behouden moeten blijven */
function getPreserveRulesForLayerType(layerType: AiPromptAssistTargetLayerType): string[] {
  if (layerType === 'system') {
    return [
      'Behou JSON/response_format-constraints als ze aanwezig zijn.',
      'Behou alle "geen tekst buiten JSON"-type regels.',
      'Behou brongebondenheidsregels die voor alle velden gelden.',
      'Behou contractgrenzen die runtime altijd van toepassing zijn.',
    ];
  }
  if (layerType === 'general') {
    return [
      'Behou de kernomschrijving van het taakdoel.',
      'Behou brongebondenheidsregels die taakbreed gelden.',
    ];
  }
  return [
    'Behou veldspecifieke contractgrenzen (bijv. "niet samenvatten" bij body).',
    'Behou eventuele lengte- of formaateisen die aan dit veld zijn gesteld.',
  ];
}

/** Moves die verboden zijn vanuit een laagtype */
function getForbiddenMovesForLayerType(layerType: AiPromptAssistTargetLayerType): string[] {
  if (layerType === 'system') {
    return [
      'Verplaats nooit systeemregels naar general- of field-lagen.',
      'Verplaats nooit JSON/response_format-constraints buiten deze laag.',
      'Verschuif nooit technische contractvereisten naar lagere lagen.',
    ];
  }
  if (layerType === 'general') {
    return [
      'Verplaats geen taakbrede regels naar veldlagen.',
      'Zet geen veldspecifieke regels in de taaklaag die alleen voor één veld gelden.',
    ];
  }
  return [
    'Zet geen systeemregels of JSON-contractvereisten in een veldlaag.',
    'Zet geen taakbrede regels in een veldlaag; die horen in de general- of systemlaag.',
  ];
}

/**
 * Bouwt layerSemantics-objecten voor alle secties van de editor.
 * Dit geeft de assist expliciete rolomschrijving, precedentie en guardrails per laag.
 */
export function buildLayerSemantics(
  sections: StructuredPromptSectionDefinition[]
): AiPromptAssistLayerSemantics[] {
  return sections.map((section) => ({
    key: section.key,
    label: section.label,
    layerType: section.layerType,
    runtimeRole: getLayerRoleForLayerType(section.layerType),
    precedence: getLayerPrecedence(section.layerType),
    purpose: getLayerPurpose(section.layerType, section.label),
    preserveRules: getPreserveRulesForLayerType(section.layerType),
    forbiddenMoves: getForbiddenMovesForLayerType(section.layerType),
  }));
}

/**
 * Bouwt de read-only sibling context voor de assist.
 * Alle lagen behalve de targetlaag worden als read-only context meegegeven.
 */
export function buildReadOnlyContext(args: {
  sections: StructuredPromptSectionDefinition[];
  targetKey: string;
  sectionValues: Record<string, string>;
}): AiPromptAssistReadOnlyContext[] {
  return args.sections
    .filter((section) => section.key !== args.targetKey)
    .map((section) => ({
      key: section.key,
      label: section.label,
      layerType: section.layerType,
      runtimeRole: getLayerRoleForLayerType(section.layerType),
      text: args.sectionValues[section.key] ?? '',
    }));
}

/**
 * Bouwt de harde invariants voor een task.
 * Deze constraints mogen nooit verloren gaan of naar lagere lagen verschuiven.
 */
export function buildInvariants(taskKey: string): AiPromptAssistInvariant[] {
  const base: AiPromptAssistInvariant[] = [
    {
      id: 'no_external_sources',
      description: 'Gebruik alleen opgegeven bronvelden; geen externe context, kennis of verzinsels toevoegen.',
      sourceLayerKey: 'systemRulesInstruction',
      mustRemainHighPrecedence: true,
    },
  ];

  if (taskKey === 'entry_cleanup') {
    return [
      ...base,
      {
        id: 'json_only_output',
        description: 'Output moet altijd een geldig JSON object zijn; geen tekst buiten JSON.',
        sourceLayerKey: 'systemRulesInstruction',
        mustRemainHighPrecedence: true,
      },
      {
        id: 'no_summarization_of_body',
        description: 'body mag niet samenvatten; de volledige opgeschoonde broninhoud moet behouden blijven.',
        sourceLayerKey: 'bodyInstruction',
        mustRemainHighPrecedence: false,
      },
      {
        id: 'no_new_claims',
        description: 'Geen nieuwe claims, interpretaties of oorzaken toevoegen buiten de bron.',
        sourceLayerKey: 'systemRulesInstruction',
        mustRemainHighPrecedence: true,
      },
      {
        id: 'output_contract_fields',
        description: 'Output moet altijd de velden title, body en summary_short bevatten.',
        sourceLayerKey: 'systemRulesInstruction',
        mustRemainHighPrecedence: true,
      },
    ];
  }

  if (taskKey === 'day_summary' || taskKey === 'day_narrative') {
    return [
      ...base,
      {
        id: 'no_summarization_as_narrative',
        description: 'narrativeText mag niet als samenvatting functioneren; alle relevante momenten moeten aanwezig zijn.',
        sourceLayerKey: 'narrativeInstruction',
        mustRemainHighPrecedence: false,
      },
      {
        id: 'no_therapy_language',
        description: 'Geen therapeutische, diagnostische of coachtaal gebruiken.',
        sourceLayerKey: 'systemRulesInstruction',
        mustRemainHighPrecedence: true,
      },
    ];
  }

  if (taskKey === 'week_summary' || taskKey === 'month_summary') {
    return [
      ...base,
      {
        id: 'source_bound_synthesis',
        description: 'Synthese blijft brongebonden op day_journals; geen verzinsels buiten de bron.',
        sourceLayerKey: 'systemRulesInstruction',
        mustRemainHighPrecedence: true,
      },
      {
        id: 'no_therapy_language',
        description: 'Geen therapeutische, diagnostische of coachtaal gebruiken.',
        sourceLayerKey: 'systemRulesInstruction',
        mustRemainHighPrecedence: true,
      },
      {
        id: 'no_action_items',
        description: 'Reflectiepunten worden geen actiepuntenlijst of checklisttaal.',
        sourceLayerKey: 'reflectionPointsInstruction',
        mustRemainHighPrecedence: false,
      },
    ];
  }

  return base;
}

/**
 * Geeft de toegestane soorten wijzigingen voor een actie + laag.
 * Beperkt automatisch wat de assist mag doen op high-precedence lagen.
 */
export function buildAllowedChangeKinds(
  actionId: string,
  layerType: AiPromptAssistTargetLayerType
): AiPromptAssistAllowedChangeKind[] {
  if (actionId === 'verdeel_over_velden') {
    return ['redistribute_with_explicit_justification'];
  }

  const base: AiPromptAssistAllowedChangeKind[] = ['rewrite_within_layer'];

  if (actionId === 'compacter') {
    return [...base, 'tighten_wording'];
  }
  if (actionId === 'ontdubbelen') {
    return [...base, 'dedupe_within_layer'];
  }
  if (actionId === 'verhelderen' || actionId === 'maak_strikter') {
    return [...base, 'clarify_execution', 'tighten_wording'];
  }
  if (actionId === 'check_contract' || actionId === 'check_overlap' || actionId === 'check_outputvorm') {
    // Analyse-acties: geen directe rewrite op system-laag, alleen tighten
    if (layerType === 'system') {
      return ['tighten_wording'];
    }
    return [...base, 'clarify_execution'];
  }
  if (actionId === 'verplaats_naar_juiste_laag') {
    // Verplaats alleen target herschrijven (geen verplaatsen van high-precedence content)
    return [...base, 'clarify_execution'];
  }

  return base;
}

// ─── UI layer notice helpers ────────────────────────────────────────────────

export type LayerNoticeInfo = {
  /** Korte badge-label voor naast de sectiehoofdlabel */
  badgeLabel: string;
  /** Korte uitleg wat deze laag doet — voor hint onder de editor */
  hintText: string;
  /** Contextregel voor in de assist-modal */
  assistContextMessage: string;
  /** True als dit een high-precedence laag is */
  isHighPrecedence: boolean;
};

/**
 * Geeft UI-noticeinformatie per laag zonder redesign.
 * Gebruik dit om labels en hints in de editor en assist-modal te tonen.
 */
export function getLayerNoticeInfo(
  layerType: AiPromptAssistTargetLayerType,
  label: string
): LayerNoticeInfo {
  if (layerType === 'system') {
    return {
      badgeLabel: 'Systeemlaag',
      hintText: 'Geldt boven alle andere instructies. Gebruik dit voor harde grenzen: contract, JSON-vorm en regels die altijd gelden.',
      assistContextMessage: `Je bewerkt de systeemlaag (${label}). Harde regels blijven hier en verschuiven niet naar lagere lagen.`,
      isHighPrecedence: true,
    };
  }
  if (layerType === 'general') {
    return {
      badgeLabel: 'Algemene instructie',
      hintText: 'Het overkoepelende taakdoel. Geldt voor alle outputvelden tezamen.',
      assistContextMessage: `Je bewerkt de algemene instructie (${label}). Dit is het taakbrede doel; veldspecifieke regels horen in de veldlagen.`,
      isHighPrecedence: false,
    };
  }
  return {
    badgeLabel: 'Veldlaag',
    hintText: 'Alleen regels voor dit specifieke outputveld. Houd dit veldgericht en kort.',
    assistContextMessage: `Je bewerkt de veldlaag (${label}). Regels hier gelden alleen voor dit veld; systeemregels en taakbrede regels horen in hogere lagen.`,
    isHighPrecedence: false,
  };
}
