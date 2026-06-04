import { describe, expect, it } from 'vitest';

import {
  renderEntryCleanupPromptTemplate,
  renderJsonPromptTemplate,
  resolveAiRuntimePromptVersion,
  resolveAiRuntimeResponseFormat,
} from '@/src/shared/ai-quality-runtime';

describe('ai-quality runtime helpers', () => {
  it('renders entry cleanup structured template to runtime payload', () => {
    const rendered = renderEntryCleanupPromptTemplate({
      promptTemplate: JSON.stringify({
        instruction: {
          systemRulesInstruction: 'Gebruik alleen de bron.',
          generalInstruction: 'Maak title, body en summary_short.',
          bodyInstruction: 'Behoud alinea’s.',
        },
        rawText: '{{raw_text}}',
      }),
      rawText: 'Ruwe invoer',
    });

    expect(JSON.parse(rendered)).toEqual({
      instruction:
        'Gebruik alleen de bron.\n\nMaak title, body en summary_short.\n\nBehoud alinea’s.',
      rawText: 'Ruwe invoer',
    });
  });

  it('renders json prompt templates with array expansion', () => {
    const rendered = renderJsonPromptTemplate({
      promptTemplate: JSON.stringify({
        journalDate: '{{journal_date}}',
        entries: [{ title: '{{entry_title}}', body: '{{entry_body}}' }],
      }),
      context: {
        journal_date: '2026-06-02',
        entries: [
          { entry_title: 'Titel 1', entry_body: 'Body 1' },
          { entry_title: 'Titel 2', entry_body: 'Body 2' },
        ],
      },
    });

    expect(JSON.parse(rendered)).toEqual({
      journalDate: '2026-06-02',
      entries: [
        { title: 'Titel 1', body: 'Body 1' },
        { title: 'Titel 2', body: 'Body 2' },
      ],
    });
  });

  it('falls back to aiqs-live prompt versions when baseline metadata is missing', () => {
    expect(resolveAiRuntimePromptVersion({}, 'week_narrative', 3)).toBe(
      'aiqs-live:week_narrative:v3'
    );
  });

  it('uses DB output schema as strict OpenAI structured output format', () => {
    expect(
      resolveAiRuntimeResponseFormat(
        { response_format: 'json_object' },
        {
          type: 'object',
          required: ['title', 'body', 'summary_short'],
          properties: {
            title: { type: 'string' },
            body: { type: 'string' },
            summary_short: { type: 'string' },
          },
        },
        'entry cleanup live'
      )
    ).toEqual({
      type: 'json_schema',
      json_schema: {
        name: 'entry_cleanup_live',
        strict: true,
        schema: {
          type: 'object',
          required: ['title', 'body', 'summary_short'],
          properties: {
            title: { type: 'string' },
            body: { type: 'string' },
            summary_short: { type: 'string' },
          },
          additionalProperties: false,
        },
      },
    });
  });

  it('keeps legacy non-object schemas on json_object transport', () => {
    expect(
      resolveAiRuntimeResponseFormat(
        { response_format: 'json_object' },
        { type: 'string', description: 'legacy member field schema' },
        'day_narrative'
      )
    ).toEqual({ type: 'json_object' });
  });
});
