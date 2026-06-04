export type AiQualityRuntimeBindingKey =
  | 'entry_normalization.primary'
  | 'entry_normalization.repair'
  | 'entry_renormalization.primary'
  | 'day_journal.primary'
  | 'day_journal.repair'
  | 'week_reflection.primary'
  | 'month_reflection.primary';

type TemplateContext = Record<string, unknown>;

function normalizePlaceholderKey(token: string): string {
  return token.trim().replace(/^input\./, '').replace(/^output\./, '');
}

function getPathValue(context: TemplateContext, rawPath: string): unknown {
  const normalizedPath = normalizePlaceholderKey(rawPath);
  if (normalizedPath in context) {
    return context[normalizedPath];
  }

  const segments = normalizedPath.split('.');
  let current: unknown = context;
  for (const segment of segments) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function renderTemplateString(template: string, context: TemplateContext): unknown {
  const exactToken = template.match(/^\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}$/);
  if (exactToken) {
    const value = getPathValue(context, exactToken[1]);
    return value === undefined ? template : value;
  }

  return template.replace(/\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g, (match, token) => {
    const value = getPathValue(context, token);
    if (value === undefined || value === null) {
      return match;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    return JSON.stringify(value);
  });
}

function mergeScopedContext(context: TemplateContext, value: unknown): TemplateContext {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return context;
  }

  return {
    ...context,
    ...(value as Record<string, unknown>),
  };
}

function renderTemplateValue(value: unknown, context: TemplateContext, currentKey?: string): unknown {
  if (typeof value === 'string') {
    return renderTemplateString(value, context);
  }

  if (Array.isArray(value)) {
    if (value.length === 1 && currentKey) {
      const scopedItems = context[currentKey];
      if (Array.isArray(scopedItems)) {
        return scopedItems.map((item) =>
          renderTemplateValue(value[0], mergeScopedContext(context, item))
        );
      }
    }

    return value.map((item) => renderTemplateValue(item, context));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const output: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    output[key] = renderTemplateValue(nested, context, key);
  }
  return output;
}

export function parsePromptTemplateAsObject(promptTemplate: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(promptTemplate);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function stringifyNonEmptyLines(lines: (string | null | undefined)[]): string {
  return lines
    .map((line) => (typeof line === 'string' ? line.trim() : ''))
    .filter((line) => line.length > 0)
    .join('\n\n');
}

export function renderEntryCleanupPromptTemplate(args: {
  promptTemplate: string;
  rawText: string;
  currentBody?: string | null;
}): string {
  const parsed = parsePromptTemplateAsObject(args.promptTemplate);
  const instruction = parsed?.instruction;

  if (instruction && typeof instruction === 'object' && !Array.isArray(instruction)) {
    const parts = instruction as Record<string, unknown>;
    return JSON.stringify(
      {
        instruction: stringifyNonEmptyLines([
          typeof parts.systemRulesInstruction === 'string' ? parts.systemRulesInstruction : null,
          typeof parts.generalInstruction === 'string' ? parts.generalInstruction : null,
          typeof parts.titleInstruction === 'string' ? parts.titleInstruction : null,
          typeof parts.bodyInstruction === 'string' ? parts.bodyInstruction : null,
          typeof parts.summaryShortInstruction === 'string'
            ? parts.summaryShortInstruction
            : null,
        ]),
        rawText: args.rawText,
        ...(args.currentBody ? { currentBody: args.currentBody } : {}),
      },
      null,
      2
    );
  }

  return JSON.stringify(
    renderTemplateValue(
      parsed ?? { instruction: args.promptTemplate, rawText: '{{raw_text}}' },
      {
        raw_text: args.rawText,
        rawText: args.rawText,
        current_body: args.currentBody ?? '',
        currentBody: args.currentBody ?? '',
      }
    ),
    null,
    2
  );
}

export function renderJsonPromptTemplate(args: {
  promptTemplate: string;
  context: TemplateContext;
}): string {
  const parsed = parsePromptTemplateAsObject(args.promptTemplate);
  if (!parsed) {
    return String(renderTemplateValue(args.promptTemplate, args.context));
  }

  return JSON.stringify(renderTemplateValue(parsed, args.context), null, 2);
}

export function resolveAiRuntimePromptVersion(
  configJson: Record<string, unknown> | null | undefined,
  taskKey: string,
  versionNumber: number
): string {
  const baselineImport =
    configJson &&
    typeof configJson === 'object' &&
    !Array.isArray(configJson) &&
    configJson.baseline_import &&
    typeof configJson.baseline_import === 'object' &&
    !Array.isArray(configJson.baseline_import)
      ? (configJson.baseline_import as Record<string, unknown>)
      : null;

  const explicit =
    typeof baselineImport?.prompt_version === 'string' ? baselineImport.prompt_version.trim() : '';
  if (explicit) {
    return explicit;
  }

  return `aiqs-live:${taskKey}:v${versionNumber}`;
}

export function resolveAiRuntimeTemperature(
  configJson: Record<string, unknown> | null | undefined
): number {
  const value = configJson?.temperature;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return 0.2;
}

export function resolveAiRuntimeResponseFormat(
  configJson: Record<string, unknown> | null | undefined,
  outputSchemaJson?: Record<string, unknown> | null,
  name?: string,
):
  | { type: 'json_schema'; json_schema: { name: string; strict: true; schema: Record<string, unknown> } }
  | { type: 'json_object' }
  | null {
  const schema = normalizeStrictJsonSchema(outputSchemaJson);
  if (schema) {
    return {
      type: 'json_schema',
      json_schema: {
        name: sanitizeResponseFormatName(name ?? 'aiqs_runtime_output'),
        strict: true,
        schema,
      },
    };
  }

  const value = configJson?.response_format;
  if (value === 'json_object') {
    return { type: 'json_object' };
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const type = (value as Record<string, unknown>).type;
    if (type === 'json_object') {
      return { type: 'json_object' };
    }
  }

  return null;
}

function normalizeStrictJsonSchema(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const normalized = normalizeStrictJsonSchemaValue(value);
  if (!normalized || typeof normalized !== 'object' || Array.isArray(normalized)) {
    return null;
  }

  const schema = normalized as Record<string, unknown>;
  return schema.type === 'object' ? schema : null;
}

function normalizeStrictJsonSchemaValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeStrictJsonSchemaValue(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const source = value as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(source)) {
    next[key] = normalizeStrictJsonSchemaValue(child);
  }

  if (source.type === 'object') {
    const properties =
      source.properties && typeof source.properties === 'object' && !Array.isArray(source.properties)
        ? (source.properties as Record<string, unknown>)
        : null;
    if (properties) {
      next.properties = normalizeStrictJsonSchemaValue(properties);
      const required = Array.isArray(source.required)
        ? source.required.filter((item): item is string => typeof item === 'string')
        : Object.keys(properties);
      next.required = required.length > 0 ? required : Object.keys(properties);
    }
    next.additionalProperties = false;
  }

  return next;
}

function sanitizeResponseFormatName(value: string): string {
  const normalized = value.trim().replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
  return (normalized || 'aiqs_runtime_output').slice(0, 64);
}
