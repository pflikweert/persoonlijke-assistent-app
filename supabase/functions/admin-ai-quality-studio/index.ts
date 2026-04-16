import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore -- Deno runtime requires local import extensions.
import { createFlowError, type FlowErrorCode } from '../_shared/error-contract.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { logFlow } from '../_shared/flow-logger.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { authenticateAllowlistedAdmin, getAdminAllowlistFromEnv, getInternalTokenFromEnv } from '../_shared/admin-access.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildEntryCleanupTechnicalContract, buildRuntimeBaselineDefinitions } from '../_shared/ai-quality-runtime-baselines.ts';
// @ts-ignore -- Deno runtime requires local import extensions.
import { buildChatCompletionsDebugRequest, buildOpenAiDebugMetadata, loadOpenAiDebugStorageSettingsWithBackend, resolveOpenAiDebugStorageForFlow, updateOpenAiDebugStorageSettingsWithBackend, type OpenAiDebugFlowKey } from '../_shared/openai-debug-storage.ts';

const FLOW = 'admin-ai-quality-studio' as const;

const CORS_BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-flow-id, x-admin-internal-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

type RequestBody = {
  action?: unknown;
  taskKey?: unknown;
  versionId?: unknown;
  targetLayerType?: unknown;
  targetLayerKey?: unknown;
  assistActionId?: unknown;
  assistIntent?: unknown;
  editorContext?: unknown;
  taskVersionId?: unknown;
  sourceType?: unknown;
  sourceRecordId?: unknown;
  testRunId?: unknown;
  label?: unknown;
  notes?: unknown;
  payload?: unknown;
  masterEnabled?: unknown;
  masterTtlHours?: unknown;
  flowUpdates?: unknown;
};

type PromptAssistTargetLayerType = 'system' | 'general' | 'field';
type PromptAssistTargetLayerKey = string;

type PromptAssistActionId =
  | 'compacter'
  | 'ontdubbelen'
  | 'verhelderen'
  | 'check_contract'
  | 'check_overlap'
  | 'verplaats_naar_juiste_laag'
  | 'maak_strikter'
  | 'check_outputvorm'
  | 'verdeel_over_velden';

type PromptAssistIssueSeverity = 'info' | 'warning' | 'risk';
type PromptAssistIssueType = 'duplicate' | 'misplaced' | 'conflict';

type PromptAssistIssue = {
  severity: PromptAssistIssueSeverity;
  type: PromptAssistIssueType;
  message: string;
};

type PromptAssistLayerRole = 'high_precedence_instruction' | 'task_goal' | 'field_rule';
type PromptAssistLayerPrecedence = 'high' | 'normal';
type PromptAssistAllowedChangeKind =
  | 'rewrite_within_layer'
  | 'dedupe_within_layer'
  | 'tighten_wording'
  | 'clarify_execution'
  | 'redistribute_with_explicit_justification';

type PromptAssistLayerSemantics = {
  key: string;
  label: string;
  layerType: PromptAssistTargetLayerType;
  runtimeRole: PromptAssistLayerRole;
  precedence: PromptAssistLayerPrecedence;
  purpose: string;
  preserveRules: string[];
  forbiddenMoves: string[];
};

type PromptAssistInvariant = {
  id: string;
  description: string;
  sourceLayerKey: string;
  mustRemainHighPrecedence: boolean;
};

type PromptAssistReadOnlyContext = {
  key: string;
  label: string;
  layerType: PromptAssistTargetLayerType;
  runtimeRole: PromptAssistLayerRole;
  text: string;
};

type PromptAssistEditorContext = {
  systemRulesInstruction: string;
  generalInstruction: string;
  fieldRules: Record<string, string>;
  editableSections: Array<{
    key: string;
    label: string;
    layerType: PromptAssistTargetLayerType;
  }>;
  tokenCatalog: Array<{
    id: string;
    kind: 'input' | 'output';
    label: string;
    token: string;
  }>;
  outputContract: Record<string, unknown>;
  taskMetadata: Record<string, unknown>;
  /** Semantiek per laag: rolomschrijving, precedentie, guardrails */
  layerSemantics: PromptAssistLayerSemantics[];
  /** Sibling-lagen als read-only context */
  readOnlyContext: PromptAssistReadOnlyContext[];
  /** Harde constraints die nooit verloren mogen gaan */
  invariants: PromptAssistInvariant[];
  /** Toegestane wijzigingstypes voor de huidige actie + laag */
  allowedChangeKinds: PromptAssistAllowedChangeKind[];
};

type TaskRow = {
  id: string;
  key: string;
  label: string;
  input_type: 'entry' | 'day' | 'week' | 'month';
  output_type: 'text' | 'json' | 'text_list';
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type VersionRow = {
  id: string;
  task_id: string;
  version_number: number;
  status: 'draft' | 'testing' | 'live' | 'archived';
  model: string;
  prompt_template: string;
  system_instructions: string;
  output_schema_json: Record<string, unknown> | null;
  config_json: Record<string, unknown> | null;
  min_items: number | null;
  max_items: number | null;
  changelog: string | null;
  created_at: string;
  updated_at: string;
  became_live_at: string | null;
  locked_at: string | null;
};

type DraftPayload = {
  model: string;
  promptTemplate: string;
  systemInstructions?: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
  minItems?: number | null;
  maxItems?: number | null;
  changelog: string | null;
};

function buildEntryCleanupOutputSchemaJson(): Record<string, unknown> {
  return {
    type: 'object',
    description: 'entries_normalized contract (title, body, summary_short)',
    required: ['title', 'body', 'summary_short'],
    properties: {
      title: { type: 'string' },
      body: { type: 'string' },
      summary_short: { type: 'string' },
    },
  };
}

function withEntryCleanupTechnicalContract(configJson: Record<string, unknown>): Record<string, unknown> {
  return {
    ...configJson,
    response_format: 'json_object',
    technical_contract: buildEntryCleanupTechnicalContract(),
  };
}

type DaySourceRow = {
  id: string;
  journal_date: string;
  summary: string | null;
  narrative_text: string | null;
  sections: unknown;
  updated_at: string | null;
};

type TestRunRow = {
  id: string;
  task_id: string;
  task_version_id: string;
  test_case_id: string;
  status: 'queued' | 'completed' | 'failed';
  input_snapshot_json: Record<string, unknown> | null;
  prompt_snapshot: string;
  system_instructions_snapshot: string;
  output_schema_snapshot_json: Record<string, unknown> | null;
  config_snapshot_json: Record<string, unknown> | null;
  model_snapshot: string;
  output_text: string | null;
  output_json: Record<string, unknown> | null;
  latency_ms: number | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  reviewer_label: 'better' | 'equal' | 'worse' | 'fail' | null;
  reviewer_notes: string | null;
  created_at: string;
  task_version?: { version_number: number } | null;
  test_case?: { source_type: 'entry' | 'day' | 'week' | 'month'; source_record_id: string; label: string } | null;
  task?: { key: string; label: string } | null;
};

type SupportedTestSourceType = 'entry' | 'day';

type DebugFlowUpdateInput = {
  flowKey: OpenAiDebugFlowKey;
  enabled: boolean;
  ttlHours: number | null;
};

const TEST_CAPABILITIES_BY_TASK_KEY: Record<string, { sourceTypes: SupportedTestSourceType[] }> = {
  entry_cleanup: { sourceTypes: ['entry'] },
  day_summary: { sourceTypes: ['day'] },
  day_narrative: { sourceTypes: ['day'] },
};

function getTaskTestCapabilities(taskKey: string): { sourceTypes: SupportedTestSourceType[] } | null {
  return TEST_CAPABILITIES_BY_TASK_KEY[taskKey] ?? null;
}

function buildCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') ?? '*';
  return {
    ...CORS_BASE_HEADERS,
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
  };
}

function jsonResponse(request: Request, status: number, payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...buildCorsHeaders(request),
      'Content-Type': 'application/json',
    },
  });
}

function errorResponse(input: {
  request: Request;
  httpStatus: number;
  requestId: string;
  flowId: string;
  step: string;
  code: FlowErrorCode;
  message: string;
}) {
  return jsonResponse(
    input.request,
    input.httpStatus,
    createFlowError({
      flow: FLOW,
      requestId: input.requestId,
      flowId: input.flowId,
      step: input.step,
      code: input.code,
      message: input.message,
    })
  );
}

function parseFlowId(request: Request, requestId: string): string {
  const flowId = request.headers.get('x-flow-id')?.trim() ?? '';
  return flowId.length > 0 ? flowId : requestId;
}

function parseNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function parseUuid(value: unknown): string | null {
  const raw = parseNonEmptyString(value);
  if (!raw) {
    return null;
  }

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(raw) ? raw : null;
}

function ensureJsonObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function truncate(value: string, max = 160): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trim()}…`;
}

function formatLocalDateKey(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidJournalDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isPlaceholderDayText(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return (
    normalized.includes('stille dag zonder gebeurtenissen') ||
    normalized.includes('geen gebeurtenissen') ||
    normalized.includes('geen noemenswaardige gebeurtenissen')
  );
}

function isMeaningfulDayText(value: string | null | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim();
  if (normalized.length < 16) return false;
  return !isPlaceholderDayText(normalized);
}

function dayRowScore(row: DaySourceRow): number {
  const hasNarrative = isMeaningfulDayText(row.narrative_text);
  const hasSummary = isMeaningfulDayText(row.summary);
  const sectionCount = Array.isArray(row.sections)
    ? row.sections.filter((item) => typeof item === 'string' && item.trim().length > 0).length
    : 0;
  const hasSectionContent = sectionCount > 0;
  const hasAnyText = (row.narrative_text ?? '').trim().length > 0 || (row.summary ?? '').trim().length > 0;

  if (!hasAnyText && !hasSectionContent) {
    return -100;
  }

  let score = 0;
  if (hasNarrative) score += 50;
  if (hasSummary) score += 30;
  if (hasSectionContent) score += 10;

  if (!hasNarrative && isPlaceholderDayText(row.narrative_text ?? '')) score -= 25;
  if (!hasSummary && isPlaceholderDayText(row.summary ?? '')) score -= 20;

  return score;
}

function buildDayPreview(row: DaySourceRow): string {
  const narrative = row.narrative_text?.trim() ?? '';
  const summary = row.summary?.trim() ?? '';
  if (isMeaningfulDayText(narrative)) {
    return truncate(narrative);
  }
  if (isMeaningfulDayText(summary)) {
    return truncate(summary);
  }
  if (narrative) {
    return truncate(narrative);
  }
  if (summary) {
    return truncate(summary);
  }
  return 'Nog geen bruikbare daginhoud beschikbaar.';
}

function pickBestDayRows(rows: DaySourceRow[]): DaySourceRow[] {
  const today = formatLocalDateKey(new Date());
  const byDate = new Map<string, DaySourceRow>();

  for (const row of rows) {
    const dateKey = typeof row.journal_date === 'string' ? row.journal_date : '';
    if (!isValidJournalDate(dateKey)) {
      continue;
    }
    if (dateKey > today) {
      continue;
    }

    const current = byDate.get(dateKey);
    if (!current) {
      byDate.set(dateKey, row);
      continue;
    }

    const nextScore = dayRowScore(row);
    const currentScore = dayRowScore(current);
    if (nextScore > currentScore) {
      byDate.set(dateKey, row);
      continue;
    }

    if (nextScore === currentScore) {
      const currentUpdated = current.updated_at ?? '';
      const nextUpdated = row.updated_at ?? '';
      if (nextUpdated > currentUpdated) {
        byDate.set(dateKey, row);
      }
    }
  }

  return Array.from(byDate.values()).sort((a, b) => {
    const scoreDiff = dayRowScore(b) - dayRowScore(a);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    const dateDiff = b.journal_date.localeCompare(a.journal_date);
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return (b.updated_at ?? '').localeCompare(a.updated_at ?? '');
  });
}

function normalizeDraftPayload(value: unknown): { payload: DraftPayload | null; error: string | null } {
  const input = ensureJsonObject(value);
  if (!input) {
    return { payload: null, error: 'payload ontbreekt of is ongeldig.' };
  }

  const model = parseNonEmptyString(input.model);
  const promptTemplate = typeof input.promptTemplate === 'string' ? input.promptTemplate : null;
  const outputSchemaJson = ensureJsonObject(input.outputSchemaJson);
  const configJson = ensureJsonObject(input.configJson);
  const changelog = input.changelog === null || input.changelog === undefined ? null : String(input.changelog).trim() || null;

  if (!model) return { payload: null, error: 'model ontbreekt.' };
  if (promptTemplate === null) return { payload: null, error: 'promptTemplate ontbreekt.' };
  if (!outputSchemaJson) return { payload: null, error: 'outputSchemaJson moet een JSON object zijn.' };
  if (!configJson) return { payload: null, error: 'configJson moet een JSON object zijn.' };

  return {
    payload: { model, promptTemplate, outputSchemaJson, configJson, changelog },
    error: null,
  };
}

function mapVersionRow(row: VersionRow) {
  return {
    id: row.id,
    versionNumber: row.version_number,
    status: row.status,
    model: row.model,
    promptTemplate: row.prompt_template,
    outputSchemaJson: row.output_schema_json ?? {},
    configJson: row.config_json ?? {},
    changelog: row.changelog,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    becameLiveAt: row.became_live_at,
    lockedAt: row.locked_at,
  };
}

function mapTaskSummary(row: TaskRow, liveVersion: VersionRow | null, hasDraft: boolean) {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    inputType: row.input_type,
    outputType: row.output_type,
    description: row.description,
    isActive: row.is_active,
    hasDraft,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    liveVersion: liveVersion ? mapVersionRow(liveVersion) : null,
  };
}

function mapTestRunRow(row: TestRunRow) {
  const reviewerLabelMap: Record<'better' | 'equal' | 'worse' | 'fail', 'beter' | 'gelijk' | 'slechter' | 'fout'> = {
    better: 'beter',
    equal: 'gelijk',
    worse: 'slechter',
    fail: 'fout',
  };

  return {
    id: row.id,
    taskId: row.task_id,
    taskVersionId: row.task_version_id,
    taskVersionNumber: row.task_version?.version_number ?? 0,
    testCaseId: row.test_case_id,
    status: row.status,
    sourceType: row.test_case?.source_type ?? 'entry',
    sourceRecordId: row.test_case?.source_record_id ?? '',
    sourceLabel: row.test_case?.label ?? '',
    inputSnapshotJson: row.input_snapshot_json ?? {},
    promptSnapshot: row.prompt_snapshot,
    systemInstructionsSnapshot: row.system_instructions_snapshot,
    outputSchemaSnapshotJson: row.output_schema_snapshot_json ?? {},
    configSnapshotJson: row.config_snapshot_json ?? {},
    modelSnapshot: row.model_snapshot,
    outputText: row.output_text,
    outputJson: row.output_json ?? null,
    latencyMs: row.latency_ms,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    totalTokens: row.total_tokens,
    reviewerLabel: row.reviewer_label ? reviewerLabelMap[row.reviewer_label] : null,
    reviewerNotes: row.reviewer_notes,
    createdAt: row.created_at,
  };
}

function toCompareView(args: {
  row: TestRunRow;
  baselineStatus: 'available' | 'missing' | 'unsupported';
  baselineReason: string | null;
  liveOutputText: string | null;
  liveOutputJson: Record<string, unknown> | unknown[] | null;
}) {
  const reviewerLabelMap: Record<'better' | 'equal' | 'worse' | 'fail', 'beter' | 'gelijk' | 'slechter' | 'fout'> = {
    better: 'beter',
    equal: 'gelijk',
    worse: 'slechter',
    fail: 'fout',
  };

  return {
    testRunId: args.row.id,
    taskKey: args.row.task?.key ?? '',
    taskLabel: args.row.task?.label ?? '',
    taskVersionNumber: args.row.task_version?.version_number ?? 0,
    sourceType: args.row.test_case?.source_type ?? 'entry',
    sourceRecordId: args.row.test_case?.source_record_id ?? '',
    sourceLabel: args.row.test_case?.label ?? '',
    baselineStatus: args.baselineStatus,
    baselineReason: args.baselineReason,
    liveOutputText: args.liveOutputText,
    liveOutputJson: args.liveOutputJson,
    testOutputText: args.row.output_text,
    testOutputJson: args.row.output_json ?? null,
    reviewerLabel: args.row.reviewer_label ? reviewerLabelMap[args.row.reviewer_label] : null,
    reviewerNotes: args.row.reviewer_notes,
  };
}

function parseReviewLabel(value: unknown): 'beter' | 'gelijk' | 'slechter' | 'fout' | null {
  if (typeof value !== 'string') return null;
  if (value === 'beter' || value === 'gelijk' || value === 'slechter' || value === 'fout') {
    return value;
  }
  return null;
}

function toDbReviewLabel(label: 'beter' | 'gelijk' | 'slechter' | 'fout'): 'better' | 'equal' | 'worse' | 'fail' {
  if (label === 'beter') return 'better';
  if (label === 'gelijk') return 'equal';
  if (label === 'slechter') return 'worse';
  return 'fail';
}

function getSupabaseRuntimeEnv(): { supabaseUrl: string; supabaseAnonKey: string } {
  const supabaseUrl =
    Deno.env.get('SUPABASE_URL')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_LOCAL_URL')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_CLOUD_URL')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_URL')?.trim() ??
    '';
  const supabaseAnonKey =
    Deno.env.get('SUPABASE_ANON_KEY')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY')?.trim() ??
    Deno.env.get('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY')?.trim() ??
    '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase runtime env for admin-ai-quality-studio.');
  }

  return { supabaseUrl, supabaseAnonKey };
}

function getServiceRoleKey(): string {
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? Deno.env.get('APP_SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? '';
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY / APP_SUPABASE_SERVICE_ROLE_KEY.');
  }
  return serviceRoleKey;
}

function getOpenAiApiKey(): string {
  const apiKey = Deno.env.get('OPENAI_API_KEY')?.trim() ?? '';
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY.');
  }
  return apiKey;
}

async function loadTaskByKey(args: { adminClient: any; taskKey: string }): Promise<TaskRow | null> {
  const { data, error } = await args.adminClient
    .from('ai_tasks')
    .select('id, key, label, input_type, output_type, description, is_active, created_at, updated_at')
    .eq('key', args.taskKey)
    .maybeSingle();
  if (error) throw new Error(String(error.message ?? error));
  return (data ?? null) as TaskRow | null;
}

async function loadVersionsByTaskId(args: { adminClient: any; taskId: string }): Promise<VersionRow[]> {
  const { data, error } = await args.adminClient
    .from('ai_task_versions')
    .select('id, task_id, version_number, status, model, prompt_template, output_schema_json, config_json, changelog, created_at, updated_at, became_live_at, locked_at')
    .eq('task_id', args.taskId)
    .order('version_number', { ascending: false });
  if (error) throw new Error(String(error.message ?? error));
  return (data ?? []) as VersionRow[];
}

async function buildTaskDetail(args: { adminClient: any; taskKey: string }) {
  const task = await loadTaskByKey(args);
  if (!task) return null;
  const versions = await loadVersionsByTaskId({ adminClient: args.adminClient, taskId: task.id });
  const liveVersion = versions.find((version) => version.status === 'live') ?? null;
  const hasDraft = versions.some((version) => version.status === 'draft');
  return {
    ...mapTaskSummary(task, liveVersion, hasDraft),
    versions: versions.map(mapVersionRow),
  };
}

function parseAction(value: unknown):
  | 'access'
  | 'get_openai_debug_storage_settings'
  | 'update_openai_debug_storage_settings'
  | 'list_tasks'
  | 'get_task_detail'
  | 'import_runtime_baseline'
  | 'create_draft_version'
  | 'update_draft_version'
  | 'delete_draft_version'
  | 'prompt_assist_preview'
  | 'list_test_sources'
  | 'run_test'
  | 'get_test_run'
  | 'get_compare_view'
  | 'save_test_review'
  | null {
  if (typeof value !== 'string') return null;
  if (
    value === 'access' ||
    value === 'get_openai_debug_storage_settings' ||
    value === 'update_openai_debug_storage_settings' ||
    value === 'list_tasks' ||
    value === 'get_task_detail' ||
    value === 'import_runtime_baseline' ||
    value === 'create_draft_version' ||
    value === 'update_draft_version' ||
    value === 'delete_draft_version' ||
    value === 'prompt_assist_preview' ||
    value === 'list_test_sources' ||
    value === 'run_test' ||
    value === 'get_test_run' ||
    value === 'get_compare_view' ||
    value === 'save_test_review'
  ) {
    return value;
  }
  return null;
}

function parseBoolean(value: unknown): boolean | null {
  if (value === true) return true;
  if (value === false) return false;
  return null;
}

function parseTtlHours(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  if (value <= 0 || value > 24 * 30) {
    return null;
  }
  return Math.round(value * 100) / 100;
}

function parseDebugFlowKey(value: unknown): OpenAiDebugFlowKey | null {
  if (value === 'admin-ai-quality-studio.prompt_assist_preview') return value;
  if (value === 'admin-ai-quality-studio.run_test') return value;
  return null;
}

function parseDebugFlowUpdates(value: unknown): DebugFlowUpdateInput[] | null {
  if (!Array.isArray(value)) return null;
  const output: DebugFlowUpdateInput[] = [];
  for (const item of value) {
    const row = ensureJsonObject(item);
    if (!row) return null;
    const flowKey = parseDebugFlowKey(row.flowKey);
    const enabled = parseBoolean(row.enabled);
    const ttlHours = parseTtlHours(row.ttlHours);
    if (!flowKey || enabled === null) {
      return null;
    }
    output.push({ flowKey, enabled, ttlHours });
  }
  return output;
}

function buildOpenAiDebugStorageResponse(result: Awaited<ReturnType<typeof loadOpenAiDebugStorageSettingsWithBackend>>) {
  const settings = result.settings;
  const promptAssist = resolveOpenAiDebugStorageForFlow({
    settings,
    flowKey: 'admin-ai-quality-studio.prompt_assist_preview',
    endpointFamily: 'chat_completions',
  });
  const runTest = resolveOpenAiDebugStorageForFlow({
    settings,
    flowKey: 'admin-ai-quality-studio.run_test',
    endpointFamily: 'chat_completions',
  });

  return {
    masterEnabled: settings.masterEnabled,
    masterExpiresAt: settings.masterExpiresAt,
    updatedAt: settings.updatedAt,
    backend: result.backend,
    flows: [promptAssist, runTest].map((flow) => ({
      flowKey: flow.flowKey,
      state: flow.state,
      reason: flow.reason,
      desiredOn: flow.desiredOn,
      effectiveOn: flow.effectiveOn,
      expiresAt: flow.expiresAt,
    })),
  };
}

function parsePromptAssistTargetLayerType(value: unknown): PromptAssistTargetLayerType | null {
  if (value === 'system' || value === 'general' || value === 'field') {
    return value;
  }
  return null;
}

function parsePromptAssistTargetLayerKey(value: unknown): PromptAssistTargetLayerKey | null {
  const key = parseNonEmptyString(value);
  return key ?? null;
}

function parsePromptAssistActionId(value: unknown): PromptAssistActionId | null {
  if (
    value === 'compacter' ||
    value === 'ontdubbelen' ||
    value === 'verhelderen' ||
    value === 'check_contract' ||
    value === 'check_overlap' ||
    value === 'verplaats_naar_juiste_laag' ||
    value === 'maak_strikter' ||
    value === 'check_outputvorm' ||
    value === 'verdeel_over_velden'
  ) {
    return value;
  }
  return null;
}

function parseEditableSections(
  value: unknown
): Array<{ key: string; label: string; layerType: PromptAssistTargetLayerType }> {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const source = ensureJsonObject(item);
      if (!source) return null;
      const key = parseNonEmptyString(source.key);
      const label = parseNonEmptyString(source.label);
      const layerType = parsePromptAssistTargetLayerType(source.layerType);
      if (!key || !label || !layerType) return null;
      return { key, label, layerType };
    })
    .filter((item): item is { key: string; label: string; layerType: PromptAssistTargetLayerType } => Boolean(item));
}

function parseTokenCatalog(
  value: unknown
): Array<{ id: string; kind: 'input' | 'output'; label: string; token: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const source = ensureJsonObject(item);
      if (!source) return null;
      const id = parseNonEmptyString(source.id);
      const label = parseNonEmptyString(source.label);
      const token = parseNonEmptyString(source.token);
      const kind = source.kind === 'input' || source.kind === 'output' ? source.kind : null;
      if (!id || !label || !token || !kind) return null;
      return { id, kind, label, token };
    })
    .filter((item): item is { id: string; kind: 'input' | 'output'; label: string; token: string } => Boolean(item));
}

function inferPromptAssistTargetLayerTypeFromKey(key: PromptAssistTargetLayerKey): PromptAssistTargetLayerType {
  if (key === 'systemRulesInstruction') return 'system';
  if (key === 'generalInstruction') return 'general';
  return 'field';
}

function parseLayerSemantics(value: unknown): PromptAssistLayerSemantics[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const source = ensureJsonObject(item);
      if (!source) return null;
      const key = parseNonEmptyString(source.key);
      const label = parseNonEmptyString(source.label);
      const layerType = parsePromptAssistTargetLayerType(source.layerType);
      const runtimeRole = source.runtimeRole === 'high_precedence_instruction' || source.runtimeRole === 'task_goal' || source.runtimeRole === 'field_rule'
        ? (source.runtimeRole as PromptAssistLayerRole) : null;
      const precedence = source.precedence === 'high' || source.precedence === 'normal'
        ? (source.precedence as PromptAssistLayerPrecedence) : null;
      if (!key || !label || !layerType || !runtimeRole || !precedence) return null;
      const purpose = typeof source.purpose === 'string' ? source.purpose : '';
      const preserveRules = Array.isArray(source.preserveRules)
        ? source.preserveRules.filter((r): r is string => typeof r === 'string') : [];
      const forbiddenMoves = Array.isArray(source.forbiddenMoves)
        ? source.forbiddenMoves.filter((r): r is string => typeof r === 'string') : [];
      return { key, label, layerType, runtimeRole, precedence, purpose, preserveRules, forbiddenMoves };
    })
    .filter((item): item is PromptAssistLayerSemantics => Boolean(item));
}

function parseReadOnlyContext(value: unknown): PromptAssistReadOnlyContext[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const source = ensureJsonObject(item);
      if (!source) return null;
      const key = parseNonEmptyString(source.key);
      const label = parseNonEmptyString(source.label);
      const layerType = parsePromptAssistTargetLayerType(source.layerType);
      const runtimeRole = source.runtimeRole === 'high_precedence_instruction' || source.runtimeRole === 'task_goal' || source.runtimeRole === 'field_rule'
        ? (source.runtimeRole as PromptAssistLayerRole) : null;
      const text = typeof source.text === 'string' ? source.text : '';
      if (!key || !label || !layerType || !runtimeRole) return null;
      return { key, label, layerType, runtimeRole, text };
    })
    .filter((item): item is PromptAssistReadOnlyContext => Boolean(item));
}

function parseInvariants(value: unknown): PromptAssistInvariant[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const source = ensureJsonObject(item);
      if (!source) return null;
      const id = parseNonEmptyString(source.id);
      const description = typeof source.description === 'string' ? source.description : '';
      const sourceLayerKey = typeof source.sourceLayerKey === 'string' ? source.sourceLayerKey : '';
      const mustRemainHighPrecedence = source.mustRemainHighPrecedence === true;
      if (!id) return null;
      return { id, description, sourceLayerKey, mustRemainHighPrecedence };
    })
    .filter((item): item is PromptAssistInvariant => Boolean(item));
}

function parseAllowedChangeKinds(value: unknown): PromptAssistAllowedChangeKind[] {
  const valid: PromptAssistAllowedChangeKind[] = [
    'rewrite_within_layer',
    'dedupe_within_layer',
    'tighten_wording',
    'clarify_execution',
    'redistribute_with_explicit_justification',
  ];
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is PromptAssistAllowedChangeKind => valid.includes(item as PromptAssistAllowedChangeKind));
}

function parsePromptAssistEditorContext(value: unknown): PromptAssistEditorContext | null {
  const source = ensureJsonObject(value);
  if (!source) return null;

  const fieldRules = ensureJsonObject(source.fieldRules);
  if (!fieldRules) return null;

  const systemRulesInstruction = typeof source.systemRulesInstruction === 'string' ? source.systemRulesInstruction : '';
  const generalInstruction = typeof source.generalInstruction === 'string' ? source.generalInstruction : '';
  const parsedFieldRules = Object.fromEntries(
    Object.entries(fieldRules).map(([key, val]) => [key, typeof val === 'string' ? val : ''])
  );

  const outputContract = ensureJsonObject(source.outputContract) ?? {};
  const taskMetadata = ensureJsonObject(source.taskMetadata) ?? {};
  const editableSections = parseEditableSections(source.editableSections);
  const tokenCatalog = parseTokenCatalog(source.tokenCatalog);
  const layerSemantics = parseLayerSemantics(source.layerSemantics);
  const readOnlyContext = parseReadOnlyContext(source.readOnlyContext);
  const invariants = parseInvariants(source.invariants);
  const allowedChangeKinds = parseAllowedChangeKinds(source.allowedChangeKinds);

  return {
    systemRulesInstruction,
    generalInstruction,
    fieldRules: parsedFieldRules,
    editableSections,
    tokenCatalog,
    outputContract,
    taskMetadata,
    layerSemantics,
    readOnlyContext,
    invariants,
    allowedChangeKinds,
  };
}

function normalizePromptTokens(text: string, tokenCatalog: PromptAssistEditorContext['tokenCatalog']): string {
  if (!tokenCatalog.length) return text;
  const byInnerToken = new Map<string, string>();
  for (const item of tokenCatalog) {
    const inner = item.token.replace(/^\{\{\s*/, '').replace(/\s*\}\}$/, '').replace(/\s+/g, '').toLowerCase();
    byInnerToken.set(inner, item.token);
  }

  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (full, inner: string) => {
    const normalized = inner.replace(/\s+/g, '').toLowerCase();
    return byInnerToken.get(normalized) ?? full;
  });
}

function normalizeProposedSections(args: {
  proposedSections: Record<string, string>;
  context: PromptAssistEditorContext;
}): Record<string, string> {
  const normalized: Record<string, string> = {};
  const allowedKeys = new Set<string>([
    'systemRulesInstruction',
    'generalInstruction',
    ...Object.keys(args.context.fieldRules),
    ...args.context.editableSections.map((item) => item.key),
  ]);

  for (const key of allowedKeys) {
    const value = typeof args.proposedSections[key] === 'string'
      ? args.proposedSections[key]
      : key === 'systemRulesInstruction'
        ? args.context.systemRulesInstruction
        : key === 'generalInstruction'
          ? args.context.generalInstruction
          : args.context.fieldRules[key] ?? '';
    normalized[key] = normalizePromptTokens(value, args.context.tokenCatalog).trim();
  }

  return normalized;
}

function getPromptAssistTargetText(context: PromptAssistEditorContext, targetLayerKey: PromptAssistTargetLayerKey): string {
  if (targetLayerKey === 'systemRulesInstruction') return context.systemRulesInstruction;
  if (targetLayerKey === 'generalInstruction') return context.generalInstruction;
  return context.fieldRules[targetLayerKey] ?? '';
}

function buildPromptAssistIssues(args: {
  context: PromptAssistEditorContext;
  targetLayerType: PromptAssistTargetLayerType;
  targetLayerKey: PromptAssistTargetLayerKey;
  proposedText: string;
}): PromptAssistIssue[] {
  const source = args.context;
  const current = getPromptAssistTargetText(source, args.targetLayerKey);
  const issues: PromptAssistIssue[] = [];

  const referencesSystem = /system|json|contract|schema|response_format|geen tekst buiten json/i;
  if (args.targetLayerType === 'field' && referencesSystem.test(current)) {
    issues.push({
      severity: 'warning',
      type: 'misplaced',
      message: 'Bevat system-achtige regels; overweeg verplaatsen naar Systeemregels.',
    });
  }

  if (args.targetLayerType === 'field' && current.trim().length > 0 && source.generalInstruction.trim().length > 0 && current.trim().toLowerCase() === source.generalInstruction.trim().toLowerCase()) {
    issues.push({
      severity: 'info',
      type: 'duplicate',
      message: 'Lijkt duplicaat van Algemene instructie.',
    });
  }

  if (/samenvat|samenvatten/i.test(args.proposedText) && args.targetLayerKey === 'bodyInstruction') {
    issues.push({
      severity: 'risk',
      type: 'conflict',
      message: 'Voorstel suggereert samenvatten; dit botst met body-contract.',
    });
  }

  if (
    /geen tekst buiten json|alleen json|response_format|output moet precies/i.test(args.proposedText) &&
    args.targetLayerType === 'field'
  ) {
    issues.push({
      severity: 'warning',
      type: 'misplaced',
      message: 'Voorstel bevat system-regels; houd deze laag veldspecifiek.',
    });
  }

  return issues.slice(0, 4);
}

async function runPromptAssistPreview(args: {
  apiKey: string;
  model: string;
  taskKey: string;
  targetLayerType: PromptAssistTargetLayerType;
  targetLayerKey: PromptAssistTargetLayerKey;
  assistActionId: PromptAssistActionId;
  assistIntent: string;
  context: PromptAssistEditorContext;
  debugRequest?: ReturnType<typeof buildChatCompletionsDebugRequest>;
}): Promise<{
  analysisSummary: string;
  proposedText: string;
  proposedSections?: Record<string, string>;
  sectionReasons?: Record<string, string>;
  sectionRisks?: Record<string, string[]>;
  preservedInvariants?: string[];
  detectedRisks?: string[];
  changeSummary: string;
  rationale: string | null;
  issues: PromptAssistIssue[];
  openAiObjectId: string | null;
}> {
  const targetText = getPromptAssistTargetText(args.context, args.targetLayerKey);

  const actionHints: Record<PromptAssistActionId, string> = {
    compacter: 'Maak de tekst compacter zonder betekenisverlies.',
    ontdubbelen: 'Verwijder duplicaten en herhaling.',
    verhelderen: 'Maak de instructie duidelijker en direct uitvoerbaar.',
    check_contract: 'Check contract-match; herschrijf waar nodig om contractschending te voorkomen.',
    check_overlap: 'Check overlap met andere lagen en voorkom doublures.',
    verplaats_naar_juiste_laag: 'Verplaats verkeerd geplaatste regels naar juiste laag (alleen binnen target herschrijven).',
    maak_strikter: 'Maak regels concreter en strikter.',
    check_outputvorm: 'Verduidelijk outputvorm/format-verwachting binnen scope van de gekozen laag.',
    verdeel_over_velden:
      'Verdeel en herstructureer instructies over alle bewerkbare velden. Verminder overlap en zet chips op de juiste plek.',
  };

  // ── verdeel_over_velden: guarded redistribute ──────────────────────────────
  if (args.assistActionId === 'verdeel_over_velden') {
    const sectionOrder =
      args.context.editableSections.length > 0
        ? args.context.editableSections
        : [
            { key: 'systemRulesInstruction', label: 'Systeemregels', layerType: 'system' as const },
            { key: 'generalInstruction', label: 'Algemene instructie', layerType: 'general' as const },
            ...Object.keys(args.context.fieldRules).map((key) => ({ key, label: key, layerType: 'field' as const })),
          ];

    const currentSections = Object.fromEntries(
      sectionOrder.map((section) => [section.key, getPromptAssistTargetText(args.context, section.key)])
    );

    // Build per-section semantics for the prompt (from context if available, else infer)
    const sectionSemantics = sectionOrder.map((section) => {
      const sem = args.context.layerSemantics.find((s) => s.key === section.key);
      if (sem) return sem;
      // Fallback inferred semantics
      const role: PromptAssistLayerRole = section.layerType === 'system'
        ? 'high_precedence_instruction'
        : section.layerType === 'general'
          ? 'task_goal'
          : 'field_rule';
      return {
        key: section.key,
        label: section.label,
        layerType: section.layerType,
        runtimeRole: role,
        precedence: section.layerType === 'system' ? 'high' as const : 'normal' as const,
        purpose: section.layerType === 'system'
          ? 'Harde grenzen die boven alle andere instructies gaan.'
          : section.layerType === 'general'
            ? 'Overkoepelend taakdoel voor alle velden tezamen.'
            : `Veldspecifieke regels voor ${section.label}.`,
        preserveRules: [],
        forbiddenMoves: section.layerType === 'system'
          ? ['Verplaats nooit systeemregels of JSON/contract-constraints naar lagere lagen.']
          : [],
      };
    });

    const highPrecedenceInvariants = args.context.invariants.filter((inv) => inv.mustRemainHighPrecedence);

    const systemPrompt = [
      'Je bent een rolbewuste Prompt Assist voor een admin-only AI Quality Studio.',
      '',
      'TAAK: Herverdeel instructies over ALLE bewerkbare velden in één voorstel.',
      '',
      'HARDE REGELS (niet onderhandelbaar):',
      '1. Houd laagdiscipline: system=harde grenzen/contractregels, general=taakdoel, field=veldspecifiek.',
      '2. Verplaats NOOIT high-precedence constraints (JSON-formaat, response_format, contractvelden, schema) naar field-lagen.',
      '3. Verplaats NOOIT systeemregels naar de general-laag als ze technisch van aard zijn.',
      '4. Per veld: geef proposedText EN placementReason (waarom staat dit hier?).',
      '5. Signaleer detectedRisks per veld als verplaatsing risico geeft op invariant-verlies.',
      '6. De volgende invariants MOETEN behouden blijven en blijven in een high-precedence laag:',
      ...highPrecedenceInvariants.map((inv) => `   - ${inv.id}: ${inv.description}`),
      '7. Normaliseer tokengebruik naar de meegegeven tokencatalogus.',
      '',
      'OUTPUT (JSON):',
      '{ analysisSummary, proposedSections, sectionReasons, sectionRisks, changeSummary, rationale, preservedInvariants }',
      'proposedSections: object met key per bewerkbaar veld.',
      'sectionReasons: object met placementReason per key.',
      'sectionRisks: object met array van risicomeldingen per key (leeg als geen risico).',
      'preservedInvariants: array van invariant-ids die behouden zijn.',
    ].join('\n');

    const userPayload = {
      taskKey: args.taskKey,
      assistActionId: args.assistActionId,
      assistIntent: args.assistIntent,
      sectionSemantics,
      tokenCatalog: args.context.tokenCatalog,
      currentSections,
      outputContract: args.context.outputContract,
      taskMetadata: args.context.taskMetadata,
      invariants: args.context.invariants,
      allowedChangeKinds: args.context.allowedChangeKinds,
    };

    const aiResult = await callOpenAi({
      apiKey: args.apiKey,
      model: args.model,
      systemInstructions: systemPrompt,
      promptSnapshot: JSON.stringify(userPayload, null, 2),
      config: { temperature: 0.2, response_format: 'json_object' },
      debugRequest: args.debugRequest,
    });

    let parsed: Record<string, unknown> = {};
    if (aiResult.outputJson && !Array.isArray(aiResult.outputJson)) {
      parsed = aiResult.outputJson;
    } else {
      try {
        const fallbackParsed = JSON.parse(aiResult.outputText);
        if (fallbackParsed && typeof fallbackParsed === 'object' && !Array.isArray(fallbackParsed)) {
          parsed = fallbackParsed as Record<string, unknown>;
        }
      } catch {
        parsed = {};
      }
    }

    const proposedSectionsRaw = ensureJsonObject(parsed.proposedSections) ?? {};
    const normalizedSections = normalizeProposedSections({
      proposedSections: Object.fromEntries(
        Object.entries(proposedSectionsRaw).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
      ),
      context: args.context,
    });

    // Server-side layer leakage guard: detect if system-like patterns appear in field layers
    const layerLeakageIssues: PromptAssistIssue[] = [];
    const systemLikePattern = /response_format|geen tekst buiten json|json_object|output schema|technical_contract/i;
    for (const section of sectionOrder) {
      if (section.layerType === 'field') {
        const proposedFieldText = normalizedSections[section.key] ?? '';
        if (systemLikePattern.test(proposedFieldText)) {
          layerLeakageIssues.push({
            severity: 'risk',
            type: 'misplaced',
            message: `Veld "${section.label}" bevat system-contractregels in het voorstel. Controleer voor toepassing.`,
          });
        }
      }
    }

    const proposedText = normalizedSections[args.targetLayerKey] ?? targetText;
    const analysisSummaryRaw = typeof parsed.analysisSummary === 'string' ? parsed.analysisSummary.trim() : '';
    const changeSummaryRaw = typeof parsed.changeSummary === 'string' ? parsed.changeSummary.trim() : '';
    const rationaleRaw = typeof parsed.rationale === 'string' ? parsed.rationale.trim() : '';

    const sectionReasonsRaw = ensureJsonObject(parsed.sectionReasons) ?? {};
    const sectionRisksRaw = ensureJsonObject(parsed.sectionRisks) ?? {};
    const sectionReasons = Object.fromEntries(
      Object.entries(sectionReasonsRaw).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
    );
    const sectionRisks = Object.fromEntries(
      Object.entries(sectionRisksRaw).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [],
      ])
    );

    const preservedInvariantsRaw = Array.isArray(parsed.preservedInvariants)
      ? parsed.preservedInvariants.filter((item): item is string => typeof item === 'string')
      : [];

    const baseIssues = buildPromptAssistIssues({
      context: args.context,
      targetLayerType: args.targetLayerType,
      targetLayerKey: args.targetLayerKey,
      proposedText,
    });

    return {
      analysisSummary:
        analysisSummaryRaw.length > 0
          ? analysisSummaryRaw
          : 'Instructies zijn opnieuw verdeeld over alle bewerkbare velden.',
      proposedText,
      proposedSections: normalizedSections,
      sectionReasons,
      sectionRisks,
      preservedInvariants: preservedInvariantsRaw,
      changeSummary:
        changeSummaryRaw.length > 0
          ? changeSummaryRaw
          : 'Regels zijn herschikt per laag en overlap is verminderd.',
      rationale: rationaleRaw.length > 0 ? rationaleRaw : null,
      issues: [...baseIssues, ...layerLeakageIssues].slice(0, 6),
      openAiObjectId: aiResult.openAiObjectId,
    };
  }

  // ── Single-layer role-aware rewrite ────────────────────────────────────────
  // Resolve semantics for the target layer
  const targetSemantics = args.context.layerSemantics.find((s) => s.key === args.targetLayerKey);
  const isHighPrecedence = targetSemantics?.precedence === 'high' || args.targetLayerType === 'system';
  const runtimeRoleLabel = targetSemantics?.runtimeRole ?? (isHighPrecedence ? 'high_precedence_instruction' : 'task_goal');
  const preserveRules = targetSemantics?.preserveRules ?? [];
  const forbiddenMoves = targetSemantics?.forbiddenMoves ?? [];
  const allowedKinds = args.context.allowedChangeKinds.length > 0
    ? args.context.allowedChangeKinds
    : ['rewrite_within_layer'];

  const highPrecedenceInvariantsForSingle = args.context.invariants.filter((inv) => inv.mustRemainHighPrecedence);

  const systemPrompt = [
    'Je bent een rolbewuste Prompt Assist voor een admin-only AI Quality Studio.',
    '',
    `TARGETLAAG: ${targetSemantics?.label ?? args.targetLayerKey}`,
    `RUNTIMEROL: ${runtimeRoleLabel}`,
    `PRIORITEIT: ${isHighPrecedence ? 'HIGH (boven general en field)' : 'NORMAL'}`,
    targetSemantics?.purpose ? `DOEL: ${targetSemantics.purpose}` : '',
    '',
    'HARDE REGELS (niet onderhandelbaar):',
    '1. Analyseer alle sibling-lagen als read-only context; bewerk ALLEEN de targetlaag.',
    '2. Bewaar harde contractregels die aanwezig zijn in de targetlaag.',
    isHighPrecedence
      ? '3. Dit is een HIGH PRIORITY laag: verplaats NOOIT contractregels, JSON-formaat of schema-verplichtingen buiten deze laag.'
      : '3. Zet GEEN systeemregels of JSON/contract-verplichtingen in deze laag.',
    preserveRules.length > 0
      ? `4. Regels die ALTIJD bewaard moeten blijven:\n${preserveRules.map((r) => `   - ${r}`).join('\n')}`
      : '4. Geen extra preserve-regels.',
    forbiddenMoves.length > 0
      ? `5. Verboden verplaatsingen:\n${forbiddenMoves.map((r) => `   - ${r}`).join('\n')}`
      : '5. Geen extra verplaatsingsverboden.',
    highPrecedenceInvariantsForSingle.length > 0
      ? `6. Invariants die BEHOUDEN moeten blijven:\n${highPrecedenceInvariantsForSingle.map((inv) => `   - ${inv.id}: ${inv.description}`).join('\n')}`
      : '6. Geen extra invariants.',
    `7. Toegestane wijzigingstypes: ${allowedKinds.join(', ')}.`,
    '8. Als een veilige wijziging niet mogelijk is: geef een conservatief voorstel en signaleer het risico.',
    '9. Geen chatstijl, geen extra velden, geen verborgen mutaties.',
    '',
    'OUTPUT (JSON):',
    '{ analysisSummary, proposedText, changeSummary, rationale, preservedInvariants, detectedRisks }',
    'proposedText: alleen de tekst voor de gekozen targetlaag.',
    'preservedInvariants: array van invariant-ids die behouden zijn.',
    'detectedRisks: array van risicobeschrijvingen (leeg als geen risico).',
  ].filter(Boolean).join('\n');

  const userPayload = {
    taskKey: args.taskKey,
    targetLayer: {
      key: args.targetLayerKey,
      type: args.targetLayerType,
      runtimeRole: runtimeRoleLabel,
      precedence: isHighPrecedence ? 'high' : 'normal',
      purpose: targetSemantics?.purpose ?? '',
      currentText: targetText,
    },
    action: {
      id: args.assistActionId,
      hint: actionHints[args.assistActionId],
      allowedChangeKinds: allowedKinds,
      customIntent: args.assistIntent,
    },
    readOnlyContext: args.context.readOnlyContext.length > 0
      ? args.context.readOnlyContext
      : [
          { key: 'systemRulesInstruction', label: 'Systeemregels', layerType: 'system', runtimeRole: 'high_precedence_instruction', text: args.context.systemRulesInstruction },
          { key: 'generalInstruction', label: 'Algemene instructie', layerType: 'general', runtimeRole: 'task_goal', text: args.context.generalInstruction },
          ...Object.entries(args.context.fieldRules).map(([key, text]) => ({
            key, label: key, layerType: 'field', runtimeRole: 'field_rule', text,
          })),
        ].filter((item) => item.key !== args.targetLayerKey),
    invariants: args.context.invariants,
    tokenCatalog: args.context.tokenCatalog,
    outputContract: args.context.outputContract,
    taskMetadata: args.context.taskMetadata,
  };

  const aiResult = await callOpenAi({
    apiKey: args.apiKey,
    model: args.model,
    systemInstructions: systemPrompt,
    promptSnapshot: JSON.stringify(userPayload, null, 2),
    config: { temperature: 0.2, response_format: 'json_object' },
    debugRequest: args.debugRequest,
  });

  let parsed: Record<string, unknown> = {};
  if (aiResult.outputJson && !Array.isArray(aiResult.outputJson)) {
    parsed = aiResult.outputJson;
  } else {
    try {
      const fallbackParsed = JSON.parse(aiResult.outputText);
      if (fallbackParsed && typeof fallbackParsed === 'object' && !Array.isArray(fallbackParsed)) {
        parsed = fallbackParsed as Record<string, unknown>;
      }
    } catch {
      parsed = {};
    }
  }

  const proposedTextRaw = typeof parsed.proposedText === 'string' ? parsed.proposedText.trim() : '';
  const proposedText = normalizePromptTokens(
    proposedTextRaw.length > 0 ? proposedTextRaw : targetText,
    args.context.tokenCatalog
  );
  const analysisSummaryRaw = typeof parsed.analysisSummary === 'string' ? parsed.analysisSummary.trim() : '';
  const changeSummaryRaw = typeof parsed.changeSummary === 'string' ? parsed.changeSummary.trim() : '';
  const rationaleRaw = typeof parsed.rationale === 'string' ? parsed.rationale.trim() : '';
  const preservedInvariantsRaw = Array.isArray(parsed.preservedInvariants)
    ? parsed.preservedInvariants.filter((item): item is string => typeof item === 'string')
    : [];
  const detectedRisksRaw = Array.isArray(parsed.detectedRisks)
    ? parsed.detectedRisks.filter((item): item is string => typeof item === 'string')
    : [];

  return {
    analysisSummary:
      analysisSummaryRaw.length > 0
        ? analysisSummaryRaw
        : 'Analyse op volledige context gedaan; voorstel beperkt tot de gekozen laag.',
    proposedText,
    preservedInvariants: preservedInvariantsRaw,
    detectedRisks: detectedRisksRaw,
    changeSummary:
      changeSummaryRaw.length > 0
        ? changeSummaryRaw
        : proposedText === targetText
          ? 'Geen inhoudelijke wijziging voorgesteld.'
          : 'Tekst compacter en scherper gemaakt voor deze laag.',
    rationale: rationaleRaw.length > 0 ? rationaleRaw : null,
    issues: buildPromptAssistIssues({
      context: args.context,
      targetLayerType: args.targetLayerType,
      targetLayerKey: args.targetLayerKey,
      proposedText,
    }),
    openAiObjectId: aiResult.openAiObjectId,
  };
}

function getRuntimeOpenAiModel(): string {
  return Deno.env.get('OPENAI_MODEL')?.trim() || 'gpt-5.4-mini';
}

function normalizeJsonForCompare(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeJsonForCompare(item));
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    const normalized: Record<string, unknown> = {};
    for (const [key, nested] of entries) {
      normalized[key] = normalizeJsonForCompare(nested);
    }
    return normalized;
  }
  return value;
}

function buildVersionBaselineFingerprint(input: {
  model: string;
  promptTemplate: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
}): string {
  return JSON.stringify({
    model: input.model,
    promptTemplate: input.promptTemplate,
    outputSchemaJson: normalizeJsonForCompare(input.outputSchemaJson),
    configJson: normalizeJsonForCompare(input.configJson),
  });
}

async function importRuntimeBaselines(args: {
  adminClient: any;
  userId: string | null;
}): Promise<{
  inserted: string[];
  skipped_equal: string[];
  skipped_conflict: string[];
  unsupported: string[];
  conflicts: string[];
}> {
  const definitions = buildRuntimeBaselineDefinitions({ model: getRuntimeOpenAiModel() });
  const taskKeys = definitions.map((definition) => definition.taskKey);

  const { data: taskData, error: taskError } = await args.adminClient
    .from('ai_tasks')
    .select('id, key, label, input_type, output_type, description, is_active, created_at, updated_at')
    .in('key', taskKeys);

  if (taskError) {
    throw new Error('Failed to load AI tasks for baseline import.');
  }

  const tasksByKey = new Map<string, TaskRow>();
  for (const row of (taskData ?? []) as TaskRow[]) {
    tasksByKey.set(row.key, row);
  }

  const inserted: string[] = [];
  const skippedEqual: string[] = [];
  const skippedConflict: string[] = [];
  const unsupported: string[] = [];
  const conflicts: string[] = [];

  for (const definition of definitions) {
    const task = tasksByKey.get(definition.taskKey);
    if (!task) {
      unsupported.push(definition.taskKey);
      continue;
    }

    const versions = await loadVersionsByTaskId({ adminClient: args.adminClient, taskId: task.id });
    const liveVersion = versions.find((version) => version.status === 'live') ?? null;

    const incomingFingerprint = buildVersionBaselineFingerprint({
      model: definition.model,
      promptTemplate: definition.promptTemplate,
      outputSchemaJson: definition.outputSchemaJson,
      configJson: definition.configJson,
    });

    if (!liveVersion) {
      const { data: insertedRow, error: insertError } = await args.adminClient
        .from('ai_task_versions')
        .insert({
          task_id: task.id,
          status: 'live',
          model: definition.model,
          prompt_template: definition.promptTemplate,
          output_schema_json: definition.outputSchemaJson,
          config_json: definition.configJson,
          changelog: definition.changelog,
          created_by: args.userId,
          became_live_at: new Date().toISOString(),
          locked_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertError || !insertedRow) {
        throw new Error(`Failed to insert runtime baseline for task ${definition.taskKey}.`);
      }

      inserted.push(definition.taskKey);
      continue;
    }

    const existingFingerprint = buildVersionBaselineFingerprint({
      model: liveVersion.model,
      promptTemplate: liveVersion.prompt_template,
      outputSchemaJson: liveVersion.output_schema_json ?? {},
      configJson: liveVersion.config_json ?? {},
    });

    if (existingFingerprint === incomingFingerprint) {
      skippedEqual.push(definition.taskKey);
      continue;
    }

    skippedConflict.push(definition.taskKey);
    conflicts.push(definition.taskKey);
  }

  return {
    inserted,
    skipped_equal: skippedEqual,
    skipped_conflict: skippedConflict,
    unsupported,
    conflicts,
  };
}

async function callOpenAi(args: {
  apiKey: string;
  model: string;
  systemInstructions: string;
  promptSnapshot: string;
  config: Record<string, unknown>;
  debugRequest?: ReturnType<typeof buildChatCompletionsDebugRequest>;
}): Promise<{ outputText: string; outputJson: Record<string, unknown> | null; openAiObjectId: string | null; usage: { promptTokens: number | null; completionTokens: number | null; totalTokens: number | null } }> {
  const temperature = typeof args.config.temperature === 'number' && Number.isFinite(args.config.temperature) ? args.config.temperature : 0.2;
  const responseFormat =
    typeof args.config.response_format === 'string' && args.config.response_format === 'json_object'
      ? { type: 'json_object' as const }
      : undefined;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: args.model,
      temperature,
      ...(args.debugRequest ? args.debugRequest : {}),
      ...(responseFormat ? { response_format: responseFormat } : {}),
      messages: [
        { role: 'system', content: args.systemInstructions },
        { role: 'user', content: args.promptSnapshot },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${body}`);
  }

  const json = (await response.json()) as Record<string, unknown>;
  const choices = Array.isArray(json.choices) ? json.choices : [];
  const first = choices[0] as Record<string, unknown> | undefined;
  const message = first?.message as Record<string, unknown> | undefined;
  const content = typeof message?.content === 'string' ? message.content : '';
  const outputText = content.trim();

  let outputJson: Record<string, unknown> | null = null;
  try {
    const parsed = JSON.parse(outputText) as unknown;
    if (parsed && typeof parsed === 'object') {
      outputJson = Array.isArray(parsed) ? { items: parsed } : (parsed as Record<string, unknown>);
    }
  } catch {
    outputJson = null;
  }

  const usage = (json.usage ?? {}) as Record<string, unknown>;
  return {
    outputText,
    outputJson,
    openAiObjectId: typeof json.id === 'string' ? json.id : null,
    usage: {
      promptTokens: typeof usage.prompt_tokens === 'number' ? usage.prompt_tokens : null,
      completionTokens: typeof usage.completion_tokens === 'number' ? usage.completion_tokens : null,
      totalTokens: typeof usage.total_tokens === 'number' ? usage.total_tokens : null,
    },
  };
}

Deno.serve(async (request) => {
  const requestId = crypto.randomUUID();
  const flowId = parseFlowId(request, requestId);
  let step = 'received';

  if (request.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: buildCorsHeaders(request) });
  }
  if (request.method !== 'POST') {
    return errorResponse({ request, httpStatus: 405, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Method not allowed.' });
  }

  try {
    const body = (await request.json()) as RequestBody;
    const action = parseAction(body.action);
    if (!action) {
      return errorResponse({ request, httpStatus: 400, requestId, flowId, step: 'validated', code: 'INPUT_INVALID', message: 'Unsupported action.' });
    }

    const internalToken = getInternalTokenFromEnv({ primaryEnvKey: 'ADMIN_AI_QUALITY_INTERNAL_TOKEN', fallbackEnvKey: 'ADMIN_REGEN_INTERNAL_TOKEN' });
    const adminAllowlist = getAdminAllowlistFromEnv({ primaryEnvKey: 'ADMIN_AI_QUALITY_ALLOWLIST_USER_IDS', fallbackEnvKey: 'ADMIN_REGEN_ALLOWLIST_USER_IDS' });
    const internalHeaderToken = request.headers.get('x-admin-internal-token')?.trim() ?? '';
    const isInternal = internalToken.length > 0 && internalHeaderToken === internalToken;

    const supabaseRuntimeEnv = getSupabaseRuntimeEnv();
    let userId: string | null = null;
    if (!isInternal) {
      try {
        const auth = await authenticateAllowlistedAdmin({
          request,
          supabaseUrl: supabaseRuntimeEnv.supabaseUrl,
          supabaseAnonKey: supabaseRuntimeEnv.supabaseAnonKey,
          allowlist: adminAllowlist,
        });
        userId = auth.userId;
      } catch (authError) {
        const message = authError instanceof Error ? authError.message : 'Unauthorized';
        const code = message === 'Missing Authorization header' ? 'AUTH_MISSING' : 'AUTH_UNAUTHORIZED';
        return errorResponse({
          request,
          httpStatus: code === 'AUTH_MISSING' ? 401 : 403,
          requestId,
          flowId,
          step: 'authenticated',
          code,
          message: message === 'Forbidden' ? 'You are not allowlisted for this action.' : message,
        });
      }
    }

    if (action === 'access') {
      return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, canAccess: true, userId });
    }

    const adminClient = createClient(supabaseRuntimeEnv.supabaseUrl, getServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (action === 'get_openai_debug_storage_settings') {
      step = 'get_openai_debug_storage_settings';
      const settingsResult = await loadOpenAiDebugStorageSettingsWithBackend(adminClient);
      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        debugStorage: buildOpenAiDebugStorageResponse(settingsResult),
      });
    }

    if (action === 'update_openai_debug_storage_settings') {
      step = 'update_openai_debug_storage_settings';
      const masterEnabled = parseBoolean(body.masterEnabled);
      const masterTtlHours = parseTtlHours(body.masterTtlHours);
      const flowUpdates = parseDebugFlowUpdates(body.flowUpdates);

      if (masterEnabled === null || !flowUpdates) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'masterEnabled of flowUpdates is ongeldig.',
        });
      }

      const settingsResult = await updateOpenAiDebugStorageSettingsWithBackend(adminClient, {
        updatedBy: userId,
        masterEnabled,
        masterTtlHours,
        flowUpdates,
      });

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        debugStorage: buildOpenAiDebugStorageResponse(settingsResult),
      });
    }

    if (action === 'list_tasks') {
      step = 'list_tasks';
      const { data: taskData, error: taskError } = await adminClient
        .from('ai_tasks')
        .select('id, key, label, input_type, output_type, description, is_active, created_at, updated_at')
        .eq('is_active', true)
        .order('key', { ascending: true });
      if (taskError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load AI Quality Studio tasks.' });

      const { data: liveVersionData, error: liveVersionError } = await adminClient
        .from('ai_task_versions')
        .select('id, task_id, version_number, status, model, prompt_template, system_instructions, output_schema_json, config_json, min_items, max_items, changelog, created_at, updated_at, became_live_at, locked_at')
        .eq('status', 'live');
      if (liveVersionError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load AI Quality Studio live versions.' });

      const liveByTaskId = new Map<string, VersionRow>();
      for (const live of (liveVersionData ?? []) as VersionRow[]) {
        if (!liveByTaskId.has(live.task_id)) liveByTaskId.set(live.task_id, live);
      }

      const { data: draftVersionData, error: draftVersionError } = await adminClient
        .from('ai_task_versions')
        .select('task_id')
        .eq('status', 'draft');
      if (draftVersionError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load AI Quality Studio draft versions.' });

      const draftTaskIds = new Set<string>((draftVersionData ?? []).map((row: { task_id: string }) => row.task_id));

      const tasks = ((taskData ?? []) as TaskRow[]).map((row) =>
        mapTaskSummary(row, liveByTaskId.get(row.id) ?? null, draftTaskIds.has(row.id))
      );
      return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, tasks });
    }

    if (action === 'get_task_detail') {
      step = 'get_task_detail';
      const taskKey = parseNonEmptyString(body.taskKey);
      if (!taskKey) return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'taskKey ontbreekt.' });
      const detail = await buildTaskDetail({ adminClient, taskKey });
      if (!detail || !detail.isActive) {
        return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task not found.' });
      }
      return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, task: detail });
    }

    if (action === 'import_runtime_baseline') {
      step = 'import_runtime_baseline';
      const result = await importRuntimeBaselines({ adminClient, userId });
      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        importResult: result,
      });
    }

    if (action === 'create_draft_version') {
      step = 'create_draft_version';
      const taskKey = parseNonEmptyString(body.taskKey);
      if (!taskKey) return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'taskKey ontbreekt.' });
      const task = await loadTaskByKey({ adminClient, taskKey });
      if (!task) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task not found.' });

      const versions = await loadVersionsByTaskId({ adminClient, taskId: task.id });
      const liveBase = versions.find((version) => version.status === 'live') ?? null;
      const latestDraftBase = versions.find((version) => version.status === 'draft') ?? null;
      const latestVersionBase = versions[0] ?? null;
      const baseVersion = liveBase ?? latestDraftBase ?? latestVersionBase;
      const derivation = liveBase
        ? { source: 'live', versionNumber: liveBase.version_number }
        : latestDraftBase
          ? { source: 'latest_draft', versionNumber: latestDraftBase.version_number }
          : latestVersionBase
            ? { source: 'latest_version', versionNumber: latestVersionBase.version_number }
            : { source: 'empty', versionNumber: null };

      const { data: inserted, error: insertError } = await adminClient
        .from('ai_task_versions')
        .insert({
          task_id: task.id,
          status: 'draft',
          model: baseVersion?.model ?? 'gpt-5.4-mini',
          prompt_template: baseVersion?.prompt_template ?? '',
          system_instructions: baseVersion?.system_instructions ?? '',
          output_schema_json: baseVersion?.output_schema_json ?? {},
          config_json: baseVersion?.config_json ?? {},
          min_items: baseVersion?.min_items ?? null,
          max_items: baseVersion?.max_items ?? null,
          changelog: 'Nieuwe draft versie',
          created_by: userId,
        })
        .select('id, task_id, version_number, status, model, prompt_template, system_instructions, output_schema_json, config_json, min_items, max_items, changelog, created_at, updated_at, became_live_at, locked_at')
        .single();

      if (insertError || !inserted) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_WRITE_FAILED', message: 'Failed to create draft version.' });
      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        version: mapVersionRow(inserted as VersionRow),
        derivation,
      });
    }

    if (action === 'update_draft_version') {
      step = 'update_draft_version';
      const versionId = parseUuid(body.versionId);
      if (!versionId) return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'versionId ontbreekt of is ongeldig.' });

      const normalized = normalizeDraftPayload(body.payload);
      if (!normalized.payload) return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: normalized.error ?? 'payload ongeldig.' });

      const { data: existing, error: existingError } = await adminClient
        .from('ai_task_versions')
        .select('id, task_id, version_number, status, model, prompt_template, system_instructions, output_schema_json, config_json, min_items, max_items, changelog, created_at, updated_at, became_live_at, locked_at')
        .eq('id', versionId)
        .maybeSingle();
      if (existingError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load version.' });
      if (!existing) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Version not found.' });
      if ((existing as VersionRow).status !== 'draft') {
        return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Alleen draft versies zijn bewerkbaar.' });
      }

      const { data: existingTaskData, error: existingTaskError } = await adminClient
        .from('ai_tasks')
        .select('id, key, label, input_type, output_type, description, is_active, created_at, updated_at')
        .eq('id', (existing as VersionRow).task_id)
        .maybeSingle();
      if (existingTaskError) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load task for draft update.' });
      }
      if (!existingTaskData) {
        return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task not found for draft update.' });
      }
      const existingTask = existingTaskData as TaskRow;

      const payload = normalized.payload;
      const { data: updated, error: updateError } = await adminClient
        .from('ai_task_versions')
        .update({
          model: payload.model,
          prompt_template: payload.promptTemplate,
          system_instructions: payload.systemInstructions,
          output_schema_json: payload.outputSchemaJson,
          config_json: payload.configJson,
          min_items: payload.minItems,
          max_items: payload.maxItems,
          changelog: payload.changelog,
        })
        .eq('id', versionId)
        .select('id, task_id, version_number, status, model, prompt_template, system_instructions, output_schema_json, config_json, min_items, max_items, changelog, created_at, updated_at, became_live_at, locked_at')
        .single();
      if (updateError || !updated) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_WRITE_FAILED', message: 'Failed to update draft version.' });

      return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, version: mapVersionRow(updated as VersionRow) });
    }

    if (action === 'delete_draft_version') {
      step = 'delete_draft_version';
      const versionId = parseUuid(body.versionId);
      if (!versionId) return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'versionId ontbreekt of is ongeldig.' });

      const { data: existing, error: existingError } = await adminClient
        .from('ai_task_versions')
        .select('id, status')
        .eq('id', versionId)
        .maybeSingle();
      if (existingError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load version.' });
      if (!existing) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Version not found.' });
      if ((existing as { status: string }).status !== 'draft') {
        return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Alleen draft versies kunnen worden verwijderd.' });
      }

      const { count: liveLogCount, error: liveLogCountError } = await adminClient
        .from('ai_live_generation_log')
        .select('id', { count: 'exact', head: true })
        .eq('task_version_id', versionId);
      if (liveLogCountError) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to inspect live generation links.' });
      }
      if ((liveLogCount ?? 0) > 0) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'Deze draft is gekoppeld aan live-generation logs en kan niet worden verwijderd.',
        });
      }

      const { error: deleteRunsError } = await adminClient
        .from('ai_test_runs')
        .delete()
        .eq('task_version_id', versionId);
      if (deleteRunsError) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_WRITE_FAILED', message: 'Failed to delete draft test runs.' });
      }

      const { error: deleteError } = await adminClient
        .from('ai_task_versions')
        .delete()
        .eq('id', versionId);

      if (deleteError) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_WRITE_FAILED', message: 'Failed to delete draft version.' });
      }

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        deletedVersionId: versionId,
      });
    }

    if (action === 'prompt_assist_preview') {
      step = 'prompt_assist_preview';
      const taskKey = parseNonEmptyString(body.taskKey);
      const versionId = parseUuid(body.versionId);
      const targetLayerKey = parsePromptAssistTargetLayerKey(body.targetLayerKey);
      const parsedTargetLayerType = parsePromptAssistTargetLayerType(body.targetLayerType);
      const parsedAssistActionId = parsePromptAssistActionId(body.assistActionId);
      const assistIntent = typeof body.assistIntent === 'string' ? body.assistIntent.trim() : '';
      const editorContext = parsePromptAssistEditorContext(body.editorContext);

      if (!taskKey) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'taskKey ontbreekt.',
        });
      }
      if (!versionId) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'versionId ontbreekt of is ongeldig.',
        });
      }
      if (!targetLayerKey) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'targetLayerKey is ongeldig.',
        });
      }

      const targetLayerType = parsedTargetLayerType ?? inferPromptAssistTargetLayerTypeFromKey(targetLayerKey);
      const assistActionId = parsedAssistActionId ?? 'compacter';

      if (!editorContext) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'editorContext ontbreekt of is ongeldig.',
        });
      }

      const task = await loadTaskByKey({ adminClient, taskKey });
      if (!task) {
        return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task not found.' });
      }

      const { data: versionData, error: versionError } = await adminClient
        .from('ai_task_versions')
        .select('id, task_id, status, model')
        .eq('id', versionId)
        .maybeSingle();

      if (versionError) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load version.' });
      }
      if (!versionData || versionData.task_id !== task.id) {
        return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Version not found for task.' });
      }
      if (versionData.status !== 'draft') {
        return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Alleen draft versies zijn toegestaan.' });
      }

      const result = await runPromptAssistPreview({
        apiKey: getOpenAiApiKey(),
        model: typeof versionData.model === 'string' && versionData.model.trim().length > 0 ? versionData.model : 'gpt-5.4-mini',
        taskKey,
        targetLayerType,
        targetLayerKey,
        assistActionId,
        assistIntent,
        context: editorContext,
        debugRequest: buildChatCompletionsDebugRequest({
          resolution: resolveOpenAiDebugStorageForFlow({
            settings: (await loadOpenAiDebugStorageSettingsWithBackend(adminClient)).settings,
            flowKey: 'admin-ai-quality-studio.prompt_assist_preview',
            endpointFamily: 'chat_completions',
          }),
          metadata: buildOpenAiDebugMetadata({
            app: 'persoonlijke-assistent-app',
            env: Deno.env.get('APP_ENV')?.trim() || 'local',
            flow: FLOW,
            functionName: 'admin-ai-quality-studio',
            taskKey,
            runtimeFamily: 'ai_quality_studio',
            requestId,
            flowId,
            mode: 'admin_debug',
            version: 'mvp-1.2.1',
            actor: userId ?? (isInternal ? 'internal' : 'admin'),
          }),
        }),
      });

      const beforeText = getPromptAssistTargetText(editorContext, targetLayerKey);

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        preview: {
          targetLayerType,
          targetLayerKey,
          assistActionId,
          analysisSummary: result.analysisSummary,
          issues: result.issues,
          proposedText: result.proposedText,
          proposedSections: result.proposedSections,
          sectionReasons: result.sectionReasons,
          sectionRisks: result.sectionRisks,
          preservedInvariants: result.preservedInvariants,
          detectedRisks: result.detectedRisks,
          changeSummary: result.changeSummary,
          rationale: result.rationale,
          openAiObjectId: result.openAiObjectId,
          diff: {
            before: beforeText,
            after: result.proposedText,
          },
        },
      });
    }

    if (action === 'list_test_sources') {
      step = 'list_test_sources';
      const taskKey = parseNonEmptyString(body.taskKey);
      if (!taskKey) return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'taskKey ontbreekt.' });

      const task = await loadTaskByKey({ adminClient, taskKey });
      if (!task) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task not found.' });
      const testCapabilities = getTaskTestCapabilities(task.key);
      if (!testCapabilities) {
        return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, sources: [] });
      }

      if (testCapabilities.sourceTypes.includes('entry')) {
        const { data, error } = await adminClient
          .from('entries_normalized')
          .select('id, title, body, summary_short, created_at')
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load entry test sources.' });

        const sources = (data ?? []).map((row: any) => ({
          sourceType: 'entry',
          sourceRecordId: row.id,
          label: row.title || 'Entry',
          subtitle: row.created_at,
          preview: truncate(row.summary_short || row.body || ''),
        }));

        return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, sources });
      }

      if (testCapabilities.sourceTypes.includes('day')) {
        const { data, error } = await adminClient
          .from('day_journals')
          .select('id, journal_date, summary, narrative_text, sections, updated_at')
          .order('journal_date', { ascending: false })
          .limit(120);
        if (error) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load day test sources.' });

        const bestRows = pickBestDayRows((data ?? []) as DaySourceRow[]).slice(0, 30);
        const sources = bestRows.map((row) => ({
          sourceType: 'day',
          sourceRecordId: row.id,
          label: `Dag ${row.journal_date}`,
          subtitle: `Datum ${row.journal_date}`,
          preview: buildDayPreview(row),
        }));

        return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, sources });
      }

      return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, sources: [] });
    }

    if (action === 'get_test_run') {
      step = 'get_test_run';
      const testRunId = parseUuid(body.testRunId);
      if (!testRunId) return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'testRunId ontbreekt of is ongeldig.' });

      const { data, error } = await adminClient
        .from('ai_test_runs')
        .select(
          'id, task_id, task_version_id, test_case_id, status, input_snapshot_json, prompt_snapshot, system_instructions_snapshot, output_schema_snapshot_json, config_snapshot_json, model_snapshot, output_text, output_json, latency_ms, prompt_tokens, completion_tokens, total_tokens, reviewer_label, reviewer_notes, created_at, task_version:ai_task_versions!inner(version_number), test_case:ai_test_cases!inner(source_type, source_record_id, label)'
        )
        .eq('id', testRunId)
        .maybeSingle();

      if (error) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load test run.' });
      if (!data) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Test run not found.' });

      return jsonResponse(request, 200, { status: 'ok', flow: FLOW, requestId, flowId, testRun: mapTestRunRow(data as TestRunRow) });
    }

    if (action === 'get_compare_view') {
      step = 'get_compare_view';
      const testRunId = parseUuid(body.testRunId);
      if (!testRunId) {
        return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'testRunId ontbreekt of is ongeldig.' });
      }

      const { data: runData, error: runError } = await adminClient
        .from('ai_test_runs')
        .select(
          'id, task_id, task_version_id, test_case_id, status, input_snapshot_json, prompt_snapshot, system_instructions_snapshot, output_schema_snapshot_json, config_snapshot_json, model_snapshot, output_text, output_json, latency_ms, prompt_tokens, completion_tokens, total_tokens, reviewer_label, reviewer_notes, created_at, task_version:ai_task_versions!inner(version_number), test_case:ai_test_cases!inner(source_type, source_record_id, label), task:ai_tasks!inner(key, label)'
        )
        .eq('id', testRunId)
        .maybeSingle();

      if (runError) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load compare source test run.' });
      }
      if (!runData) {
        return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Test run not found.' });
      }

      const row = runData as TestRunRow;
      const taskKey = row.task?.key ?? '';
      const sourceType = row.test_case?.source_type;
      const sourceRecordId = row.test_case?.source_record_id;

      if (!sourceType || !sourceRecordId) {
        return jsonResponse(request, 200, {
          status: 'ok',
          flow: FLOW,
          requestId,
          flowId,
          compare: toCompareView({
            row,
            baselineStatus: 'missing',
            baselineReason: 'Bronrecord context ontbreekt op test run.',
            liveOutputText: null,
            liveOutputJson: null,
          }),
        });
      }

      let baselineStatus: 'available' | 'missing' | 'unsupported' = 'missing';
      let baselineReason: string | null = 'Geen live baseline beschikbaar.';
      let liveOutputText: string | null = null;
      let liveOutputJson: Record<string, unknown> | unknown[] | null = null;

      if (taskKey === 'entry_cleanup') {
        const { data: entryData, error: entryError } = await adminClient
          .from('entries_normalized')
          .select('title, body, summary_short')
          .eq('id', sourceRecordId)
          .maybeSingle();
        if (entryError) {
          return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load entry live baseline.' });
        }
        liveOutputText = entryData
          ? JSON.stringify(
              {
                title: entryData.title ?? '',
                body: entryData.body ?? '',
                summary_short: entryData.summary_short ?? '',
              },
              null,
              2
            )
          : null;
        liveOutputJson = entryData
          ? {
              title: entryData.title ?? '',
              body: entryData.body ?? '',
              summary_short: entryData.summary_short ?? '',
            }
          : null;
        baselineStatus = liveOutputText ? 'available' : 'missing';
        baselineReason = liveOutputText ? null : 'Entry baseline ontbreekt.';
      } else if (taskKey === 'day_summary') {
        const { data: dayData, error: dayError } = await adminClient
          .from('day_journals')
          .select('summary, narrative_text, sections')
          .eq('id', sourceRecordId)
          .maybeSingle();
        if (dayError) {
          return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load day summary baseline.' });
        }
        const dayBaseline = dayData
          ? {
              summary: dayData.summary ?? '',
              narrativeText: dayData.narrative_text ?? '',
              sections: Array.isArray(dayData.sections) ? dayData.sections : [],
            }
          : null;
        liveOutputJson = dayBaseline;
        liveOutputText = dayBaseline ? JSON.stringify(dayBaseline, null, 2) : null;
        baselineStatus = dayBaseline ? 'available' : 'missing';
        baselineReason = dayBaseline ? null : 'Dag baseline ontbreekt.';
      } else if (taskKey === 'day_narrative') {
        const { data: dayData, error: dayError } = await adminClient
          .from('day_journals')
          .select('summary, narrative_text, sections')
          .eq('id', sourceRecordId)
          .maybeSingle();
        if (dayError) {
          return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load day narrative baseline.' });
        }
        const dayBaseline = dayData
          ? {
              summary: dayData.summary ?? '',
              narrativeText: dayData.narrative_text ?? '',
              sections: Array.isArray(dayData.sections) ? dayData.sections : [],
            }
          : null;
        liveOutputJson = dayBaseline;
        liveOutputText = dayBaseline ? JSON.stringify(dayBaseline, null, 2) : null;
        baselineStatus = dayBaseline ? 'available' : 'missing';
        baselineReason = dayBaseline ? null : 'Dag baseline ontbreekt.';
      } else {
        baselineStatus = 'unsupported';
        baselineReason = 'Compare baseline voor deze task is nog niet ondersteund in stap 4.';
      }

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        compare: toCompareView({ row, baselineStatus, baselineReason, liveOutputText, liveOutputJson }),
      });
    }

    if (action === 'save_test_review') {
      step = 'save_test_review';
      const testRunId = parseUuid(body.testRunId);
      const label = parseReviewLabel(body.label);
      const notesRaw = typeof body.notes === 'string' ? body.notes.trim() : '';
      const notes = notesRaw.length > 0 ? notesRaw : null;

      if (!testRunId || !label) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'testRunId en label zijn verplicht.',
        });
      }

      if ((label === 'slechter' || label === 'fout') && !notes) {
        return errorResponse({
          request,
          httpStatus: 400,
          requestId,
          flowId,
          step,
          code: 'INPUT_INVALID',
          message: 'Notitie is verplicht bij slechter of fout.',
        });
      }

      const { data: updated, error: updateError } = await adminClient
        .from('ai_test_runs')
        .update({
          reviewer_label: toDbReviewLabel(label),
          reviewer_notes: notes,
        })
        .eq('id', testRunId)
        .select(
          'id, task_id, task_version_id, test_case_id, status, input_snapshot_json, prompt_snapshot, system_instructions_snapshot, output_schema_snapshot_json, config_snapshot_json, model_snapshot, output_text, output_json, latency_ms, prompt_tokens, completion_tokens, total_tokens, reviewer_label, reviewer_notes, created_at, task_version:ai_task_versions!inner(version_number), test_case:ai_test_cases!inner(source_type, source_record_id, label)'
        )
        .maybeSingle();

      if (updateError) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_WRITE_FAILED', message: 'Failed to save test review.' });
      }
      if (!updated) {
        return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Test run not found.' });
      }

      return jsonResponse(request, 200, {
        status: 'ok',
        flow: FLOW,
        requestId,
        flowId,
        testRun: mapTestRunRow(updated as TestRunRow),
      });
    }

    step = 'run_test';
    const taskKey = parseNonEmptyString(body.taskKey);
    const taskVersionId = parseUuid(body.taskVersionId);
    const sourceType = parseNonEmptyString(body.sourceType) as SupportedTestSourceType | null;
    const sourceRecordId = parseUuid(body.sourceRecordId);

    if (!taskKey || !taskVersionId || !sourceType || !sourceRecordId) {
      return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'taskKey/taskVersionId/sourceType/sourceRecordId zijn verplicht.' });
    }

    const task = await loadTaskByKey({ adminClient, taskKey });
    if (!task) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task not found.' });
    const testCapabilities = getTaskTestCapabilities(task.key);
    if (!testCapabilities) {
      return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task key wordt nog niet ondersteund in stap 3.' });
    }
    if (!testCapabilities.sourceTypes.includes(sourceType)) {
      return errorResponse({ request, httpStatus: 400, requestId, flowId, step, code: 'INPUT_INVALID', message: 'sourceType past niet bij task input_type.' });
    }

    const { data: versionData, error: versionError } = await adminClient
      .from('ai_task_versions')
      .select('id, task_id, version_number, status, model, prompt_template, system_instructions, output_schema_json, config_json, min_items, max_items, changelog, created_at, updated_at, became_live_at, locked_at')
      .eq('id', taskVersionId)
      .maybeSingle();
    if (versionError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load task version.' });
    if (!versionData || (versionData as VersionRow).task_id !== task.id) {
      return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Task version not found for task.' });
    }
    const version = versionData as VersionRow;

    const systemInstructionSnippet = truncate(version.system_instructions ?? '', 200);

    let inputSnapshotJson: Record<string, unknown>;
    let sourceLabel = '';
    if (sourceType === 'entry') {
      const { data: sourceRow, error: sourceError } = await adminClient
        .from('entries_normalized')
        .select('id, raw_entry_id, title, body, summary_short, created_at')
        .eq('id', sourceRecordId)
        .maybeSingle();
      if (sourceError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load entry source.' });
      if (!sourceRow) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Entry source not found.' });
      sourceLabel = (sourceRow.title as string) || 'Entry';
      inputSnapshotJson = {
        sourceType,
        taskKey: task.key,
        entry: {
          id: sourceRow.id,
          rawEntryId: sourceRow.raw_entry_id,
          title: sourceRow.title,
          body: sourceRow.body,
          summaryShort: sourceRow.summary_short,
          createdAt: sourceRow.created_at,
        },
      };
    } else {
      const { data: sourceRow, error: sourceError } = await adminClient
        .from('day_journals')
        .select('id, journal_date, summary, narrative_text, sections, updated_at')
        .eq('id', sourceRecordId)
        .maybeSingle();
      if (sourceError) return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load day source.' });
      if (!sourceRow) return errorResponse({ request, httpStatus: 404, requestId, flowId, step, code: 'INPUT_INVALID', message: 'Day source not found.' });
      sourceLabel = `Dag ${String(sourceRow.journal_date)}`;
      inputSnapshotJson = {
        sourceType,
        taskKey: task.key,
        day: {
          id: sourceRow.id,
          journalDate: sourceRow.journal_date,
          summary: sourceRow.summary,
          narrativeText: sourceRow.narrative_text,
          sections: sourceRow.sections,
          updatedAt: sourceRow.updated_at,
        },
      };
    }

    const promptSnapshot = `${version.prompt_template}\n\n[INPUT_SNAPSHOT_JSON]\n${JSON.stringify(inputSnapshotJson, null, 2)}`;
    const promptSnapshotSnippet = truncate(promptSnapshot, 200);

    const testExecutionDebug = {
      requestedTaskVersionId: taskVersionId,
      resolvedTaskVersionId: version.id,
      resolvedTaskVersionNumber: version.version_number,
      systemInstructionSnippet,
      promptSnapshotSnippet,
      openAiObjectId: null as string | null,
    };

    logFlow('info', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'run_test_config_resolved',
      details: {
        taskKey: task.key,
        ...testExecutionDebug,
      },
    });

    const { data: existingTestCase } = await adminClient
      .from('ai_test_cases')
      .select('id')
      .eq('task_id', task.id)
      .eq('source_type', sourceType)
      .eq('source_record_id', sourceRecordId)
      .limit(1)
      .maybeSingle();

    let testCaseId = (existingTestCase as { id: string } | null)?.id ?? null;
    if (!testCaseId) {
      const { data: insertedCase, error: caseError } = await adminClient
        .from('ai_test_cases')
        .insert({
          task_id: task.id,
          source_type: sourceType,
          source_record_id: sourceRecordId,
          label: sourceLabel,
          is_golden: false,
        })
        .select('id')
        .single();
      if (caseError || !insertedCase) {
        return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_WRITE_FAILED', message: 'Failed to create test case.' });
      }
      testCaseId = (insertedCase as { id: string }).id;
    }

    const { data: insertedRun, error: insertedRunError } = await adminClient
      .from('ai_test_runs')
      .insert({
        task_id: task.id,
        task_version_id: version.id,
        test_case_id: testCaseId,
        status: 'queued',
        input_snapshot_json: inputSnapshotJson,
        prompt_snapshot: promptSnapshot,
        system_instructions_snapshot: version.system_instructions,
        output_schema_snapshot_json: version.output_schema_json ?? {},
        config_snapshot_json: version.config_json ?? {},
        model_snapshot: version.model,
        created_by: userId,
      })
      .select('id')
      .single();

    if (insertedRunError || !insertedRun) {
      return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_WRITE_FAILED', message: 'Failed to create test run.' });
    }

    const runId = (insertedRun as { id: string }).id;
    const startTime = Date.now();

    try {
      const runTestDebugResolution = resolveOpenAiDebugStorageForFlow({
        settings: (await loadOpenAiDebugStorageSettingsWithBackend(adminClient)).settings,
        flowKey: 'admin-ai-quality-studio.run_test',
        endpointFamily: 'chat_completions',
      });
      const aiResponse = await callOpenAi({
        apiKey: getOpenAiApiKey(),
        model: version.model,
        systemInstructions: version.system_instructions,
        promptSnapshot,
        config: version.config_json ?? {},
        debugRequest: buildChatCompletionsDebugRequest({
          resolution: runTestDebugResolution,
          metadata: buildOpenAiDebugMetadata({
            app: 'persoonlijke-assistent-app',
            env: Deno.env.get('APP_ENV')?.trim() || 'local',
            flow: FLOW,
            functionName: 'admin-ai-quality-studio',
            taskKey,
            runtimeFamily: 'ai_quality_studio',
            requestId,
            flowId,
            mode: 'admin_test',
            version: 'mvp-1.2.1',
            actor: userId ?? (isInternal ? 'internal' : 'admin'),
          }),
        }),
      });

      const latencyMs = Date.now() - startTime;
      await adminClient
        .from('ai_test_runs')
        .update({
          status: 'completed',
          output_text: aiResponse.outputText,
          output_json: aiResponse.outputJson,
          latency_ms: latencyMs,
          prompt_tokens: aiResponse.usage.promptTokens,
          completion_tokens: aiResponse.usage.completionTokens,
          total_tokens: aiResponse.usage.totalTokens,
        })
        .eq('id', runId);

      testExecutionDebug.openAiObjectId = aiResponse.openAiObjectId;
    } catch (upstreamError) {
      const latencyMs = Date.now() - startTime;
      await adminClient
        .from('ai_test_runs')
        .update({
          status: 'failed',
          output_text: upstreamError instanceof Error ? upstreamError.message : String(upstreamError),
          latency_ms: latencyMs,
        })
        .eq('id', runId);
    }

    const { data: runData, error: runReadError } = await adminClient
      .from('ai_test_runs')
      .select(
        'id, task_id, task_version_id, test_case_id, status, input_snapshot_json, prompt_snapshot, system_instructions_snapshot, output_schema_snapshot_json, config_snapshot_json, model_snapshot, output_text, output_json, latency_ms, prompt_tokens, completion_tokens, total_tokens, reviewer_label, reviewer_notes, created_at, task_version:ai_task_versions!inner(version_number), test_case:ai_test_cases!inner(source_type, source_record_id, label)'
      )
      .eq('id', runId)
      .single();

    if (runReadError || !runData) {
      return errorResponse({ request, httpStatus: 500, requestId, flowId, step, code: 'DB_READ_FAILED', message: 'Failed to load test run result.' });
    }

    return jsonResponse(request, 200, {
      status: 'ok',
      flow: FLOW,
      requestId,
      flowId,
      testRun: mapTestRunRow(runData as TestRunRow),
      debug: testExecutionDebug,
    });
  } catch (error) {
    logFlow('error', {
      flow: FLOW,
      requestId,
      flowId,
      step,
      event: 'fatal',
      details: { error: error instanceof Error ? error.message : String(error) },
    });
    return errorResponse({
      request,
      httpStatus: 500,
      requestId,
      flowId,
      step,
      code: 'INTERNAL_UNEXPECTED',
      message: error instanceof Error ? error.message : 'Unexpected error',
    });
  }
});
