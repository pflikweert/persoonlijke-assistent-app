// @ts-ignore -- Deno runtime requires local import extensions.
import { buildEntryNormalizationPromptSpec, buildReflectionPromptSpec } from './prompt-specs.ts';

// @ts-ignore -- Deno runtime supports .mjs imports from functions.
import { buildDayJournalPromptSpec } from './day-journal-contract.mjs';

type RuntimeFlow = 'entry_normalization' | 'day_journal' | 'reflection';

type RuntimeOutputField = 'body' | 'summary' | 'narrative' | 'highlights' | 'reflection_points';

export type RuntimeBaselineTaskKey =
  | 'entry_cleanup'
  | 'day_summary'
  | 'day_narrative'
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
  model: string;
  promptTemplate: string;
  systemInstructions: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
  minItems: number | null;
  maxItems: number | null;
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

function buildEntryCleanupSystemContractText(contract: EntryCleanupTechnicalContract): string {
  return [
    'Gebruik alleen opgegeven bronvelden.',
    `Toegestane inputvelden: ${contract.inputFields.join(', ')}.`,
    `Output moet precies 1 JSON object zijn met keys: ${contract.outputKeys.join(', ')}.`,
    'Geen tekst buiten JSON.',
    'summary_short mag een lege string zijn.',
  ].join(' ');
}

function buildEntryCleanupBaselinePromptTemplate(userPrompt: string): string {
  try {
    const parsed = JSON.parse(userPrompt) as Record<string, unknown>;
    const sourceInstruction = typeof parsed.instruction === 'string' ? parsed.instruction : '';
    const rawText = typeof parsed.rawText === 'string' ? parsed.rawText : '{{raw_text}}';

    return JSON.stringify(
      {
        instruction: {
          generalInstruction: sourceInstruction,
          titleInstruction: '',
          bodyInstruction: '',
          summaryShortInstruction: '',
        },
        rawText,
      },
      null,
      2
    );
  } catch {
    return JSON.stringify(
      {
        instruction: {
          generalInstruction: '',
          titleInstruction: '',
          bodyInstruction: '',
          summaryShortInstruction: '',
        },
        rawText: '{{raw_text}}',
      },
      null,
      2
    );
  }
}

function withBaselineMetadata(input: {
  configJson: Record<string, unknown>;
  runtimeFlow: RuntimeFlow;
  outputField: RuntimeOutputField;
  promptVersion: string;
}): Record<string, unknown> {
  return {
    ...input.configJson,
    baseline_import: {
      baseline_source: 'runtime_code',
      runtime_flow: input.runtimeFlow,
      derived_from_shared_flow: true,
      output_field: input.outputField,
      prompt_version: input.promptVersion,
    },
  };
}

export function buildRuntimeBaselineDefinitions(input: { model: string }): RuntimeBaselineDefinition[] {
  const entrySpec = buildEntryNormalizationPromptSpec({ rawText: '{{raw_text}}' });
  const entryContract = buildEntryCleanupTechnicalContract();
  const daySpec = buildDayJournalPromptSpec({
    journalDate: '{{journal_date}}',
    entries: [{ title: '{{entry_title}}', body: '{{entry_body}}' }],
  });
  const weekSpec = buildReflectionPromptSpec({
    periodType: 'week',
    periodStart: '{{period_start}}',
    periodEnd: '{{period_end}}',
    dayJournals: [{ journal_date: '{{journal_date}}', summary: '{{summary}}', narrative_text: '{{narrative_text}}', sections: [] }],
  });
  const monthSpec = buildReflectionPromptSpec({
    periodType: 'month',
    periodStart: '{{period_start}}',
    periodEnd: '{{period_end}}',
    dayJournals: [{ journal_date: '{{journal_date}}', summary: '{{summary}}', narrative_text: '{{narrative_text}}', sections: [] }],
  });

  const changelog = 'Runtime baseline import uit huidige code (runtime leest nog niet uit DB).';

  return [
    {
      taskKey: 'entry_cleanup',
      model: input.model,
      promptTemplate: buildEntryCleanupBaselinePromptTemplate(entrySpec.userPrompt),
      systemInstructions: buildEntryCleanupSystemContractText(entryContract),
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
        runtimeFlow: 'entry_normalization',
        outputField: 'body',
        promptVersion: entrySpec.promptVersion,
      }),
      minItems: null,
      maxItems: null,
      changelog,
    },
    {
      taskKey: 'day_summary',
      model: input.model,
      promptTemplate: daySpec.userPrompt,
      systemInstructions: daySpec.systemPrompt,
      outputSchemaJson: { type: 'string', description: 'day_journals.summary (compacte dagsamenvatting)' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'day_journal',
        outputField: 'summary',
        promptVersion: daySpec.promptVersion,
      }),
      minItems: null,
      maxItems: null,
      changelog,
    },
    {
      taskKey: 'day_narrative',
      model: input.model,
      promptTemplate: daySpec.userPrompt,
      systemInstructions: daySpec.systemPrompt,
      outputSchemaJson: { type: 'string', description: 'day_journals.narrative_text (volledig dagverhaal)' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'day_journal',
        outputField: 'narrative',
        promptVersion: daySpec.promptVersion,
      }),
      minItems: null,
      maxItems: null,
      changelog,
    },
    {
      taskKey: 'week_summary',
      model: input.model,
      promptTemplate: weekSpec.userPrompt,
      systemInstructions: weekSpec.systemPrompt,
      outputSchemaJson: { type: 'string', description: 'period_reflections.summary_text (weeksamenvatting)' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'summary',
        promptVersion: weekSpec.promptVersion,
      }),
      minItems: null,
      maxItems: null,
      changelog,
    },
    {
      taskKey: 'week_narrative',
      model: input.model,
      promptTemplate: weekSpec.userPrompt,
      systemInstructions: weekSpec.systemPrompt,
      outputSchemaJson: { type: 'string', description: 'period_reflections.narrative_text (weekverhaal)' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'narrative',
        promptVersion: weekSpec.promptVersion,
      }),
      minItems: null,
      maxItems: null,
      changelog,
    },
    {
      taskKey: 'week_highlights',
      model: input.model,
      promptTemplate: weekSpec.userPrompt,
      systemInstructions: weekSpec.systemPrompt,
      outputSchemaJson: { type: 'array', items: { type: 'string' }, description: 'period_reflections.highlights_json' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'highlights',
        promptVersion: weekSpec.promptVersion,
      }),
      minItems: 2,
      maxItems: 6,
      changelog,
    },
    {
      taskKey: 'week_reflection_points',
      model: input.model,
      promptTemplate: weekSpec.userPrompt,
      systemInstructions: weekSpec.systemPrompt,
      outputSchemaJson: { type: 'array', items: { type: 'string' }, description: 'period_reflections.reflection_points_json' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'reflection_points',
        promptVersion: weekSpec.promptVersion,
      }),
      minItems: 2,
      maxItems: 5,
      changelog,
    },
    {
      taskKey: 'month_summary',
      model: input.model,
      promptTemplate: monthSpec.userPrompt,
      systemInstructions: monthSpec.systemPrompt,
      outputSchemaJson: { type: 'string', description: 'period_reflections.summary_text (maandsamenvatting)' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'summary',
        promptVersion: monthSpec.promptVersion,
      }),
      minItems: null,
      maxItems: null,
      changelog,
    },
    {
      taskKey: 'month_narrative',
      model: input.model,
      promptTemplate: monthSpec.userPrompt,
      systemInstructions: monthSpec.systemPrompt,
      outputSchemaJson: { type: 'string', description: 'period_reflections.narrative_text (maandverhaal)' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'narrative',
        promptVersion: monthSpec.promptVersion,
      }),
      minItems: null,
      maxItems: null,
      changelog,
    },
    {
      taskKey: 'month_highlights',
      model: input.model,
      promptTemplate: monthSpec.userPrompt,
      systemInstructions: monthSpec.systemPrompt,
      outputSchemaJson: { type: 'array', items: { type: 'string' }, description: 'period_reflections.highlights_json' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'highlights',
        promptVersion: monthSpec.promptVersion,
      }),
      minItems: 2,
      maxItems: 6,
      changelog,
    },
    {
      taskKey: 'month_reflection_points',
      model: input.model,
      promptTemplate: monthSpec.userPrompt,
      systemInstructions: monthSpec.systemPrompt,
      outputSchemaJson: { type: 'array', items: { type: 'string' }, description: 'period_reflections.reflection_points_json' },
      configJson: withBaselineMetadata({
        configJson: { temperature: 0.2, response_format: 'json_object' },
        runtimeFlow: 'reflection',
        outputField: 'reflection_points',
        promptVersion: monthSpec.promptVersion,
      }),
      minItems: 2,
      maxItems: 5,
      changelog,
    },
  ];
}
