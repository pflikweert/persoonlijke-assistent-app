// @ts-ignore -- Deno runtime requires local import extensions.
import { buildEntryNormalizationPromptSpec, buildEntryNormalizationRepairPromptSpec, buildEntryRenormalizationPromptSpec, buildReflectionPromptSpec } from './prompt-specs.ts';
// @ts-ignore -- Deno runtime supports .mjs imports from functions.
import { buildDayJournalPromptSpec, buildDayJournalRepairPromptSpec } from './day-journal-contract.mjs';

export type RuntimeBaselineTaskKey =
  | 'entry_cleanup'
  | 'entry_cleanup_repair'
  | 'entry_renormalization'
  | 'day_summary'
  | 'day_narrative'
  | 'day_journal_repair'
  | 'week_summary'
  | 'week_narrative'
  | 'week_highlights'
  | 'week_reflection_points'
  | 'month_summary'
  | 'month_narrative'
  | 'month_highlights'
  | 'month_reflection_points';

export type RuntimeBaselineDefinition = {
  taskKey: RuntimeBaselineTaskKey;
  label: string;
  inputType: 'entry' | 'day' | 'week' | 'month';
  outputType: 'text' | 'json' | 'text_list';
  description: string;
  isActive: boolean;
  runtimeBindingKey: string | null;
  runtimeFamily:
    | 'entry_normalization'
    | 'entry_renormalization'
    | 'day_journal'
    | 'week_reflection'
    | 'month_reflection';
  compositionRole: 'single' | 'compound_member' | 'runtime_variant';
  managedOutputField: string | null;
  isRuntimeDriver: boolean;
  variantRole: 'primary' | 'repair' | 'renormalization' | null;
  model: string;
  systemInstructions: string;
  promptTemplate: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
  changelog: string;
};

export type EntryCleanupTechnicalContract = {
  inputFields: string[];
  outputKeys: string[];
  outputType: 'json_object';
  noTextOutsideJson: true;
  sourceOnly: true;
  allowEmptySummaryShort: true;
  responseFormat: 'json_object';
};

export function buildEntryCleanupTechnicalContract(): EntryCleanupTechnicalContract {
  return {
    inputFields: ['rawText'],
    outputKeys: ['title', 'body', 'summary_short'],
    outputType: 'json_object',
    noTextOutsideJson: true,
    sourceOnly: true,
    allowEmptySummaryShort: true,
    responseFormat: 'json_object',
  };
}

function buildDayJournalRuntimeOutputSchema(description: string): Record<string, unknown> {
  return {
    type: 'object',
    description,
    required: ['summary', 'narrativeText', 'sections'],
    properties: {
      summary: { type: 'string' },
      narrativeText: { type: 'string' },
      sections: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  };
}

function buildReflectionRuntimeOutputSchema(description: string): Record<string, unknown> {
  return {
    type: 'object',
    description,
    required: ['summaryText', 'narrativeText', 'highlights', 'reflectionPoints'],
    properties: {
      summaryText: { type: 'string' },
      narrativeText: { type: 'string' },
      highlights: {
        type: 'array',
        items: { type: 'string' },
      },
      reflectionPoints: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  };
}

function buildEntryCleanupBaselinePromptTemplate(userPrompt: string): string {
  try {
    const parsed = JSON.parse(userPrompt) as Record<string, unknown>;
    const sourceInstruction = typeof parsed.instruction === 'string' ? parsed.instruction : '';
    const rawText = typeof parsed.rawText === 'string' ? parsed.rawText : '{{raw_text}}';
    const currentBody =
      typeof parsed.currentBody === 'string' ? parsed.currentBody : '{{current_body}}';

    return JSON.stringify(
      {
        instruction: {
          systemRulesInstruction: '',
          generalInstruction: sourceInstruction,
          titleInstruction: '',
          bodyInstruction: '',
          summaryShortInstruction: '',
        },
        rawText,
        ...(sourceInstruction.includes('currentBody') || currentBody !== '{{current_body}}'
          ? { currentBody }
          : {}),
      },
      null,
      2,
    );
  } catch {
    return JSON.stringify(
      {
        instruction: {
          systemRulesInstruction: '',
          generalInstruction: '',
          titleInstruction: '',
          bodyInstruction: '',
          summaryShortInstruction: '',
        },
        rawText: '{{raw_text}}',
      },
      null,
      2,
    );
  }
}

function withBaselineMetadata(input: {
  configJson: Record<string, unknown>;
  runtimeBindingKey: string | null;
  runtimeFamily: string;
  managedOutputField: string | null;
  variantRole: 'primary' | 'repair' | 'renormalization' | null;
  promptVersion: string;
}): Record<string, unknown> {
  return {
    ...input.configJson,
    baseline_import: {
      baseline_source: 'runtime_code',
      runtime_binding_key: input.runtimeBindingKey,
      runtime_family: input.runtimeFamily,
      managed_output_field: input.managedOutputField,
      variant_role: input.variantRole,
      prompt_version: input.promptVersion,
    },
  };
}

export function buildRuntimeBaselineDefinitions(input: {
  model: string;
}): RuntimeBaselineDefinition[] {
  const entryPrimary = buildEntryNormalizationPromptSpec({ rawText: '{{raw_text}}' });
  const entryRepair = buildEntryNormalizationRepairPromptSpec({
    rawText: '{{raw_text}}',
    currentBody: '{{current_body}}',
  });
  const entryRenormalization = buildEntryRenormalizationPromptSpec({
    rawText: '{{raw_text}}',
  });
  const entryContract = buildEntryCleanupTechnicalContract();
  const dayPrimary = buildDayJournalPromptSpec({
    journalDate: '{{journal_date}}',
    entries: [{ title: '{{entry_title}}', body: '{{entry_body}}' }],
  });
  const dayRepair = buildDayJournalRepairPromptSpec({
    journalDate: '{{journal_date}}',
    entries: [{ title: '{{entry_title}}', body: '{{entry_body}}' }],
  });
  const weekPrimary = buildReflectionPromptSpec({
    periodType: 'week',
    periodStart: '{{period_start}}',
    periodEnd: '{{period_end}}',
    dayJournals: [
      {
        journal_date: '{{journal_date}}',
        summary: '{{summary}}',
        narrative_text: '{{narrative_text}}',
        sections: [],
      },
    ],
  });
  const monthPrimary = buildReflectionPromptSpec({
    periodType: 'month',
    periodStart: '{{period_start}}',
    periodEnd: '{{period_end}}',
    dayJournals: [
      {
        journal_date: '{{journal_date}}',
        summary: '{{summary}}',
        narrative_text: '{{narrative_text}}',
        sections: [],
      },
    ],
  });

  const changelog = 'Runtime baseline import uit code; runtime leest live AIQS bindings uit DB.';

  return [
    {
      taskKey: 'entry_cleanup',
      label: 'Moment opschonen',
      inputType: 'entry',
      outputType: 'json',
      description: 'Primaire runtime-driver voor entry normalisatie.',
      isActive: true,
      runtimeBindingKey: 'entry_normalization.primary',
      runtimeFamily: 'entry_normalization',
      compositionRole: 'single',
      managedOutputField: 'body',
      isRuntimeDriver: true,
      variantRole: 'primary',
      model: input.model,
      systemInstructions: entryPrimary.systemPrompt,
      promptTemplate: buildEntryCleanupBaselinePromptTemplate(entryPrimary.userPrompt),
      outputSchemaJson: {
        type: 'object',
        description: 'entries_normalized contract (title, body, summary_short)',
        required: ['title', 'body', 'summary_short'],
        properties: {
          title: { type: 'string' },
          body: { type: 'string' },
          summary_short: { type: 'string' },
        },
      },
      configJson: withBaselineMetadata({
        configJson: {
          temperature: 0.2,
          response_format: 'json_object',
          technical_contract: entryContract,
        },
        runtimeBindingKey: 'entry_normalization.primary',
        runtimeFamily: 'entry_normalization',
        managedOutputField: 'body',
        variantRole: 'primary',
        promptVersion: entryPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'entry_cleanup_repair',
      label: 'Moment opschonen repair',
      inputType: 'entry',
      outputType: 'json',
      description: 'Technische repair-variant voor entry normalisatie.',
      isActive: true,
      runtimeBindingKey: 'entry_normalization.repair',
      runtimeFamily: 'entry_normalization',
      compositionRole: 'runtime_variant',
      managedOutputField: 'body',
      isRuntimeDriver: false,
      variantRole: 'repair',
      model: input.model,
      systemInstructions: entryRepair.systemPrompt,
      promptTemplate: buildEntryCleanupBaselinePromptTemplate(entryRepair.userPrompt),
      outputSchemaJson: {
        type: 'object',
        description: 'entries_normalized repair contract (title, body, summary_short)',
        required: ['title', 'body', 'summary_short'],
        properties: {
          title: { type: 'string' },
          body: { type: 'string' },
          summary_short: { type: 'string' },
        },
      },
      configJson: withBaselineMetadata({
        configJson: {
          temperature: 0.2,
          response_format: 'json_object',
          technical_contract: entryContract,
        },
        runtimeBindingKey: 'entry_normalization.repair',
        runtimeFamily: 'entry_normalization',
        managedOutputField: 'body',
        variantRole: 'repair',
        promptVersion: entryRepair.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'entry_renormalization',
      label: 'Moment renormalisatie',
      inputType: 'entry',
      outputType: 'json',
      description: 'Primaire runtime-driver voor renormalisatie na handmatige edits.',
      isActive: true,
      runtimeBindingKey: 'entry_renormalization.primary',
      runtimeFamily: 'entry_renormalization',
      compositionRole: 'runtime_variant',
      managedOutputField: 'body',
      isRuntimeDriver: true,
      variantRole: 'renormalization',
      model: input.model,
      systemInstructions: entryRenormalization.systemPrompt,
      promptTemplate: buildEntryCleanupBaselinePromptTemplate(
        entryRenormalization.userPrompt,
      ),
      outputSchemaJson: {
        type: 'object',
        description: 'entries_normalized renormalization contract (title, body, summary_short)',
        required: ['title', 'body', 'summary_short'],
        properties: {
          title: { type: 'string' },
          body: { type: 'string' },
          summary_short: { type: 'string' },
        },
      },
      configJson: withBaselineMetadata({
        configJson: {
          temperature: 0.2,
          response_format: 'json_object',
          technical_contract: entryContract,
        },
        runtimeBindingKey: 'entry_renormalization.primary',
        runtimeFamily: 'entry_renormalization',
        managedOutputField: 'body',
        variantRole: 'renormalization',
        promptVersion: entryRenormalization.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'day_summary',
      label: 'Dag samenvatting',
      inputType: 'day',
      outputType: 'text',
      description: 'Compound member voor day_journals.summary.',
      isActive: true,
      runtimeBindingKey: null,
      runtimeFamily: 'day_journal',
      compositionRole: 'compound_member',
      managedOutputField: 'summary',
      isRuntimeDriver: false,
      variantRole: null,
      model: input.model,
      systemInstructions: dayPrimary.systemPrompt,
      promptTemplate: dayPrimary.userPrompt,
      outputSchemaJson: {
        type: 'string',
        description: 'day_journals.summary (compacte dagsamenvatting)',
      },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: null,
        runtimeFamily: 'day_journal',
        managedOutputField: 'summary',
        variantRole: null,
        promptVersion: dayPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'day_narrative',
      label: 'Dagverhaal',
      inputType: 'day',
      outputType: 'text',
      description: 'Primaire runtime-driver voor day_journals compose.',
      isActive: true,
      runtimeBindingKey: 'day_journal.primary',
      runtimeFamily: 'day_journal',
      compositionRole: 'compound_member',
      managedOutputField: 'narrative_text',
      isRuntimeDriver: true,
      variantRole: 'primary',
      model: input.model,
      systemInstructions: dayPrimary.systemPrompt,
      promptTemplate: dayPrimary.userPrompt,
      outputSchemaJson: buildDayJournalRuntimeOutputSchema(
        'day_journals compound runtime contract (summary, narrativeText, sections)',
      ),
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: 'day_journal.primary',
        runtimeFamily: 'day_journal',
        managedOutputField: 'narrative_text',
        variantRole: 'primary',
        promptVersion: dayPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'day_journal_repair',
      label: 'Dagverhaal repair',
      inputType: 'day',
      outputType: 'text',
      description: 'Technische repair-variant voor day_journals compose.',
      isActive: true,
      runtimeBindingKey: 'day_journal.repair',
      runtimeFamily: 'day_journal',
      compositionRole: 'runtime_variant',
      managedOutputField: 'narrative_text',
      isRuntimeDriver: false,
      variantRole: 'repair',
      model: input.model,
      systemInstructions: dayRepair.systemPrompt,
      promptTemplate: dayRepair.userPrompt,
      outputSchemaJson: buildDayJournalRuntimeOutputSchema(
        'day_journals repair compound runtime contract (summary, narrativeText, sections)',
      ),
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: 'day_journal.repair',
        runtimeFamily: 'day_journal',
        managedOutputField: 'narrative_text',
        variantRole: 'repair',
        promptVersion: dayRepair.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'week_summary',
      label: 'Week samenvatting',
      inputType: 'week',
      outputType: 'text',
      description: 'Compound member voor period_reflections.summary_text (week).',
      isActive: true,
      runtimeBindingKey: null,
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'summary_text',
      isRuntimeDriver: false,
      variantRole: null,
      model: input.model,
      systemInstructions: weekPrimary.systemPrompt,
      promptTemplate: weekPrimary.userPrompt,
      outputSchemaJson: {
        type: 'string',
        description: 'period_reflections.summary_text (week)',
      },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: null,
        runtimeFamily: 'week_reflection',
        managedOutputField: 'summary_text',
        variantRole: null,
        promptVersion: weekPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'week_narrative',
      label: 'Weekverhaal',
      inputType: 'week',
      outputType: 'text',
      description: 'Primaire runtime-driver voor weekreflecties.',
      isActive: true,
      runtimeBindingKey: 'week_reflection.primary',
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'narrative_text',
      isRuntimeDriver: true,
      variantRole: 'primary',
      model: input.model,
      systemInstructions: weekPrimary.systemPrompt,
      promptTemplate: weekPrimary.userPrompt,
      outputSchemaJson: buildReflectionRuntimeOutputSchema(
        'week_reflection compound runtime contract (summaryText, narrativeText, highlights, reflectionPoints)',
      ),
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: 'week_reflection.primary',
        runtimeFamily: 'week_reflection',
        managedOutputField: 'narrative_text',
        variantRole: 'primary',
        promptVersion: weekPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'week_highlights',
      label: 'Week highlights',
      inputType: 'week',
      outputType: 'text_list',
      description: 'Compound member voor period_reflections.highlights_json (week).',
      isActive: true,
      runtimeBindingKey: null,
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'highlights_json',
      isRuntimeDriver: false,
      variantRole: null,
      model: input.model,
      systemInstructions: weekPrimary.systemPrompt,
      promptTemplate: weekPrimary.userPrompt,
      outputSchemaJson: {
        type: 'array',
        items: { type: 'string' },
        description: 'period_reflections.highlights_json (week)',
      },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: null,
        runtimeFamily: 'week_reflection',
        managedOutputField: 'highlights_json',
        variantRole: null,
        promptVersion: weekPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'week_reflection_points',
      label: 'Week reflectiepunten',
      inputType: 'week',
      outputType: 'text_list',
      description: 'Compound member voor period_reflections.reflection_points_json (week).',
      isActive: true,
      runtimeBindingKey: null,
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'reflection_points_json',
      isRuntimeDriver: false,
      variantRole: null,
      model: input.model,
      systemInstructions: weekPrimary.systemPrompt,
      promptTemplate: weekPrimary.userPrompt,
      outputSchemaJson: {
        type: 'array',
        items: { type: 'string' },
        description: 'period_reflections.reflection_points_json (week)',
      },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: null,
        runtimeFamily: 'week_reflection',
        managedOutputField: 'reflection_points_json',
        variantRole: null,
        promptVersion: weekPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'month_summary',
      label: 'Maand samenvatting',
      inputType: 'month',
      outputType: 'text',
      description: 'Compound member voor period_reflections.summary_text (maand).',
      isActive: true,
      runtimeBindingKey: null,
      runtimeFamily: 'month_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'summary_text',
      isRuntimeDriver: false,
      variantRole: null,
      model: input.model,
      systemInstructions: monthPrimary.systemPrompt,
      promptTemplate: monthPrimary.userPrompt,
      outputSchemaJson: {
        type: 'string',
        description: 'period_reflections.summary_text (maand)',
      },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: null,
        runtimeFamily: 'month_reflection',
        managedOutputField: 'summary_text',
        variantRole: null,
        promptVersion: monthPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'month_narrative',
      label: 'Maandverhaal',
      inputType: 'month',
      outputType: 'text',
      description: 'Primaire runtime-driver voor maandreflecties.',
      isActive: true,
      runtimeBindingKey: 'month_reflection.primary',
      runtimeFamily: 'month_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'narrative_text',
      isRuntimeDriver: true,
      variantRole: 'primary',
      model: input.model,
      systemInstructions: monthPrimary.systemPrompt,
      promptTemplate: monthPrimary.userPrompt,
      outputSchemaJson: buildReflectionRuntimeOutputSchema(
        'month_reflection compound runtime contract (summaryText, narrativeText, highlights, reflectionPoints)',
      ),
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: 'month_reflection.primary',
        runtimeFamily: 'month_reflection',
        managedOutputField: 'narrative_text',
        variantRole: 'primary',
        promptVersion: monthPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'month_highlights',
      label: 'Maand highlights',
      inputType: 'month',
      outputType: 'text_list',
      description: 'Compound member voor period_reflections.highlights_json (maand).',
      isActive: true,
      runtimeBindingKey: null,
      runtimeFamily: 'month_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'highlights_json',
      isRuntimeDriver: false,
      variantRole: null,
      model: input.model,
      systemInstructions: monthPrimary.systemPrompt,
      promptTemplate: monthPrimary.userPrompt,
      outputSchemaJson: {
        type: 'array',
        items: { type: 'string' },
        description: 'period_reflections.highlights_json (maand)',
      },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: null,
        runtimeFamily: 'month_reflection',
        managedOutputField: 'highlights_json',
        variantRole: null,
        promptVersion: monthPrimary.promptVersion,
      }),
      changelog,
    },
    {
      taskKey: 'month_reflection_points',
      label: 'Maand reflectiepunten',
      inputType: 'month',
      outputType: 'text_list',
      description: 'Compound member voor period_reflections.reflection_points_json (maand).',
      isActive: true,
      runtimeBindingKey: null,
      runtimeFamily: 'month_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'reflection_points_json',
      isRuntimeDriver: false,
      variantRole: null,
      model: input.model,
      systemInstructions: monthPrimary.systemPrompt,
      promptTemplate: monthPrimary.userPrompt,
      outputSchemaJson: {
        type: 'array',
        items: { type: 'string' },
        description: 'period_reflections.reflection_points_json (maand)',
      },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeBindingKey: null,
        runtimeFamily: 'month_reflection',
        managedOutputField: 'reflection_points_json',
        variantRole: null,
        promptVersion: monthPrimary.promptVersion,
      }),
      changelog,
    },
  ];
}
