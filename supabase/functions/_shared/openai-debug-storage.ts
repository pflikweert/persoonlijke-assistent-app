export type OpenAiDebugFlowKey =
  | 'process-entry.generation'
  | 'generate-reflection.generation'
  | 'regenerate-day-journal.generation'
  | 'admin-ai-quality-studio.prompt_assist_preview'
  | 'admin-ai-quality-studio.run_test';

export type OpenAiDebugCapabilityReason =
  | 'zero_data_retention'
  | 'non_us_region_chat_completions'
  | 'endpoint_out_of_scope'
  | 'expired'
  | null;

export type OpenAiDebugDisplayState =
  | 'supported'
  | 'off'
  | 'on'
  | 'requested_but_effectively_unsupported';

type EndpointFamily = 'chat_completions' | 'responses';

type FlowOverride = {
  enabled: boolean;
  expires_at: string | null;
};

type FlowOverridesJson = Partial<Record<OpenAiDebugFlowKey, FlowOverride>>;

export type OpenAiDebugStorageSettings = {
  masterEnabled: boolean;
  masterExpiresAt: string | null;
  flowOverrides: FlowOverridesJson;
  updatedAt: string | null;
};

export type OpenAiDebugFlowResolution = {
  flowKey: OpenAiDebugFlowKey;
  state: OpenAiDebugDisplayState;
  reason: OpenAiDebugCapabilityReason;
  supported: boolean;
  desiredOn: boolean;
  effectiveOn: boolean;
  expiresAt: string | null;
};

export type OpenAiDebugStorageResolved = {
  settings: OpenAiDebugStorageSettings;
  flow: OpenAiDebugFlowResolution;
};

export type OpenAiDebugStorageUpdateInput = {
  updatedBy: string | null;
  masterEnabled: boolean;
  masterTtlHours: number | null;
  flowUpdates: Array<{
    flowKey: OpenAiDebugFlowKey;
    enabled: boolean;
    ttlHours: number | null;
  }>;
};

export const OPENAI_DEBUG_SUPPORTED_FLOWS: ReadonlyArray<OpenAiDebugFlowKey> = [
  'process-entry.generation',
  'generate-reflection.generation',
  'regenerate-day-journal.generation',
  'admin-ai-quality-studio.prompt_assist_preview',
  'admin-ai-quality-studio.run_test',
];

const SUPPORTED_FLOWS: ReadonlySet<OpenAiDebugFlowKey> = new Set(OPENAI_DEBUG_SUPPORTED_FLOWS);

function parseBooleanEnv(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase() ?? '';
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

function normalizeRegion(value: string | undefined): string | null {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (!normalized) return null;
  if (normalized.startsWith('us')) return 'us';
  return normalized;
}

function safeIso(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function futureIsoFromHours(hours: number | null): string | null {
  if (hours === null || !Number.isFinite(hours) || hours <= 0) return null;
  const ms = Math.round(hours * 60 * 60 * 1000);
  return new Date(Date.now() + ms).toISOString();
}

function isExpired(iso: string | null): boolean {
  if (!iso) return false;
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return true;
  return parsed.getTime() <= Date.now();
}

function readFlowOverrides(value: unknown): FlowOverridesJson {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const source = value as Record<string, unknown>;
  const output: FlowOverridesJson = {};
  for (const flowKey of SUPPORTED_FLOWS) {
    const raw = source[flowKey];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const row = raw as Record<string, unknown>;
    output[flowKey] = {
      enabled: row.enabled === true,
      expires_at: safeIso(row.expires_at),
    };
  }
  return output;
}

function getUnsupportedReason(endpointFamily: EndpointFamily): OpenAiDebugCapabilityReason {
  if (parseBooleanEnv(Deno.env.get('OPENAI_ZERO_DATA_RETENTION'))) {
    return 'zero_data_retention';
  }

  if (endpointFamily === 'chat_completions') {
    const region = normalizeRegion(Deno.env.get('OPENAI_DATA_REGION') ?? Deno.env.get('OPENAI_REGION'));
    if (region && region !== 'us') {
      return 'non_us_region_chat_completions';
    }
  }

  return null;
}

function normalizeSettingsRow(row: any): OpenAiDebugStorageSettings {
  const masterEnabled = row?.master_enabled === true;
  const masterExpiresAt = safeIso(row?.master_expires_at);
  const flowOverrides = readFlowOverrides(row?.flow_overrides_json);

  return {
    masterEnabled,
    masterExpiresAt,
    flowOverrides,
    updatedAt: safeIso(row?.updated_at),
  };
}

async function ensureSettingsRow(adminClient: any): Promise<void> {
  await adminClient
    .schema('private')
    .from('openai_debug_storage_settings')
    .upsert({ id: 1 }, { onConflict: 'id' });
}

export async function loadOpenAiDebugStorageSettings(adminClient: any): Promise<OpenAiDebugStorageSettings> {
  await ensureSettingsRow(adminClient);

  const { data, error } = await adminClient
    .schema('private')
    .from('openai_debug_storage_settings')
    .select('id, master_enabled, master_expires_at, flow_overrides_json, updated_at')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    throw new Error('Failed to load private OpenAI debug storage settings.');
  }

  return normalizeSettingsRow(data ?? null);
}

export async function updateOpenAiDebugStorageSettings(
  adminClient: any,
  input: OpenAiDebugStorageUpdateInput,
): Promise<OpenAiDebugStorageSettings> {
  const current = await loadOpenAiDebugStorageSettings(adminClient);
  const nextOverrides: FlowOverridesJson = { ...current.flowOverrides };
  const nextMasterExpiresAt = input.masterEnabled
    ? input.masterTtlHours === null
      ? current.masterExpiresAt
      : futureIsoFromHours(input.masterTtlHours)
    : null;

  for (const update of input.flowUpdates) {
    if (!SUPPORTED_FLOWS.has(update.flowKey)) continue;
    const existing = current.flowOverrides[update.flowKey] ?? null;
    const nextExpiresAt = update.enabled
      ? update.ttlHours === null
        ? existing?.expires_at ?? null
        : futureIsoFromHours(update.ttlHours)
      : null;
    nextOverrides[update.flowKey] = {
      enabled: update.enabled === true,
      expires_at: nextExpiresAt,
    };
  }

  const { data, error } = await adminClient
    .schema('private')
    .from('openai_debug_storage_settings')
    .update({
      master_enabled: input.masterEnabled === true,
      master_expires_at: nextMasterExpiresAt,
      flow_overrides_json: nextOverrides,
      updated_by: input.updatedBy,
    })
    .eq('id', 1)
    .select('id, master_enabled, master_expires_at, flow_overrides_json, updated_at')
    .single();

  if (error || !data) {
    throw new Error('Failed to update private OpenAI debug storage settings.');
  }

  return normalizeSettingsRow(data);
}

export function resolveOpenAiDebugStorageForFlow(input: {
  settings: OpenAiDebugStorageSettings;
  flowKey: OpenAiDebugFlowKey;
  endpointFamily: EndpointFamily;
}): OpenAiDebugFlowResolution {
  const flowSupported = SUPPORTED_FLOWS.has(input.flowKey);
  const override = input.settings.flowOverrides[input.flowKey] ?? null;
  const masterActive = input.settings.masterEnabled && !isExpired(input.settings.masterExpiresAt);
  const overrideActive = override?.enabled === true && !isExpired(override.expires_at);
  const desiredOn = overrideActive || masterActive;

  let reason: OpenAiDebugCapabilityReason = null;
  if (!flowSupported) {
    reason = 'endpoint_out_of_scope';
  } else {
    reason = getUnsupportedReason(input.endpointFamily);
  }

  const effectiveOn = desiredOn && reason === null;
  const hasAnyConfig = input.settings.masterEnabled || Boolean(override);
  const hasExpiredRequest =
    (input.settings.masterEnabled && isExpired(input.settings.masterExpiresAt)) ||
    (override?.enabled === true && isExpired(override.expires_at));

  let state: OpenAiDebugDisplayState = 'supported';
  if (desiredOn && reason !== null) {
    state = 'requested_but_effectively_unsupported';
  } else if (effectiveOn) {
    state = 'on';
  } else if (hasAnyConfig) {
    state = 'off';
  } else {
    state = 'supported';
  }

  if (reason === null && hasExpiredRequest) {
    reason = 'expired';
  }

  return {
    flowKey: input.flowKey,
    state,
    reason,
    supported: flowSupported,
    desiredOn,
    effectiveOn,
    expiresAt: override?.expires_at ?? null,
  };
}

export function buildOpenAiDebugMetadata(input: {
  app: string;
  env: string;
  flow: string;
  functionName: string;
  taskKey: string;
  runtimeFamily: string;
  requestId: string;
  flowId: string;
  mode: string;
  version: string;
  actor: string;
}): Record<string, string> {
  return {
    app: input.app,
    env: input.env,
    flow: input.flow,
    function: input.functionName,
    task_key: input.taskKey,
    runtime_family: input.runtimeFamily,
    request_id: input.requestId,
    flow_id: input.flowId,
    mode: input.mode,
    version: input.version,
    actor: input.actor,
  };
}

export function buildChatCompletionsDebugRequest(input: {
  resolution: OpenAiDebugFlowResolution;
  metadata: Record<string, string>;
}): { store: boolean; metadata?: Record<string, string> } {
  if (input.resolution.effectiveOn) {
    return {
      store: true,
      metadata: input.metadata,
    };
  }

  return {
    store: false,
  };
}
