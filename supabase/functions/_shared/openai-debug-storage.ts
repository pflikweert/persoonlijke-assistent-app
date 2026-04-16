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

export type OpenAiDebugStorageBackendStatus = {
  persistence: 'persistent' | 'ephemeral_fallback';
  reason: 'ok' | 'missing_relation' | 'storage_error';
  message: string | null;
};

export type OpenAiDebugStorageSettingsWithBackend = {
  settings: OpenAiDebugStorageSettings;
  backend: OpenAiDebugStorageBackendStatus;
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

const DEFAULT_OPENAI_DEBUG_STORAGE_SETTINGS: OpenAiDebugStorageSettings = {
  masterEnabled: false,
  masterExpiresAt: null,
  flowOverrides: {},
  updatedAt: null,
};

export const OPENAI_DEBUG_SUPPORTED_FLOWS: ReadonlyArray<OpenAiDebugFlowKey> = [
  'process-entry.generation',
  'generate-reflection.generation',
  'regenerate-day-journal.generation',
  'admin-ai-quality-studio.prompt_assist_preview',
  'admin-ai-quality-studio.run_test',
];

const SUPPORTED_FLOWS: ReadonlySet<OpenAiDebugFlowKey> = new Set(OPENAI_DEBUG_SUPPORTED_FLOWS);

const PERSISTENT_BACKEND_STATUS: OpenAiDebugStorageBackendStatus = {
  persistence: 'persistent',
  reason: 'ok',
  message: null,
};

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

function mergeSettingsUpdate(input: {
  current: OpenAiDebugStorageSettings;
  update: OpenAiDebugStorageUpdateInput;
}): OpenAiDebugStorageSettings {
  const current = input.current;
  const nextOverrides: FlowOverridesJson = { ...current.flowOverrides };
  const nextMasterExpiresAt = input.update.masterEnabled
    ? input.update.masterTtlHours === null
      ? current.masterExpiresAt
      : futureIsoFromHours(input.update.masterTtlHours)
    : null;

  for (const flowUpdate of input.update.flowUpdates) {
    if (!SUPPORTED_FLOWS.has(flowUpdate.flowKey)) continue;
    const existing = current.flowOverrides[flowUpdate.flowKey] ?? null;
    const nextExpiresAt = flowUpdate.enabled
      ? flowUpdate.ttlHours === null
        ? existing?.expires_at ?? null
        : futureIsoFromHours(flowUpdate.ttlHours)
      : null;
    nextOverrides[flowUpdate.flowKey] = {
      enabled: flowUpdate.enabled === true,
      expires_at: nextExpiresAt,
    };
  }

  return {
    masterEnabled: input.update.masterEnabled === true,
    masterExpiresAt: nextMasterExpiresAt,
    flowOverrides: nextOverrides,
    updatedAt: current.updatedAt,
  };
}

function fallbackBackendStatus(reason: OpenAiDebugStorageBackendStatus['reason'], message: string | null): OpenAiDebugStorageBackendStatus {
  return {
    persistence: 'ephemeral_fallback',
    reason,
    message,
  };
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

function isMissingOpenAiDebugStorageSettingsError(error: unknown): boolean {
  const code = typeof (error as { code?: unknown })?.code === 'string'
    ? String((error as { code?: string }).code).toUpperCase()
    : '';
  const details = typeof (error as { details?: unknown })?.details === 'string'
    ? String((error as { details?: string }).details).toLowerCase()
    : '';
  const hint = typeof (error as { hint?: unknown })?.hint === 'string'
    ? String((error as { hint?: string }).hint).toLowerCase()
    : '';
  const message = typeof (error as { message?: unknown })?.message === 'string'
    ? String((error as { message?: string }).message).toLowerCase()
    : '';

  if (code === '42P01' || code === 'PGRST106') {
    return true;
  }

  const combined = [message, details, hint].filter((value) => value.length > 0).join(' ');

  if (!combined) {
    return false;
  }

  const mentionsTarget =
    combined.includes('openai_debug_storage_settings') ||
    combined.includes('private.openai_debug_storage_settings') ||
    combined.includes('private') ||
    combined.includes('admin_get_openai_debug_storage_settings') ||
    combined.includes('admin_upsert_openai_debug_storage_settings');

  return mentionsTarget && (
    combined.includes('does not exist') ||
    combined.includes('relation') ||
    combined.includes('schema cache') ||
    combined.includes('not in this schema cache') ||
    combined.includes('not one of the exposed schemas') ||
    combined.includes('could not find the function')
  );
}

async function ensureSettingsRow(adminClient: any): Promise<void> {
  const { error } = await adminClient.rpc('admin_get_openai_debug_storage_settings');

  if (error && !isMissingOpenAiDebugStorageSettingsError(error)) {
    throw new Error('Failed to initialize private OpenAI debug storage settings.');
  }
}

export async function loadOpenAiDebugStorageSettings(adminClient: any): Promise<OpenAiDebugStorageSettings> {
  await ensureSettingsRow(adminClient);

  const { data, error } = await adminClient.rpc('admin_get_openai_debug_storage_settings');

  if (error) {
    if (isMissingOpenAiDebugStorageSettingsError(error)) {
      return { ...DEFAULT_OPENAI_DEBUG_STORAGE_SETTINGS };
    }
    throw new Error('Failed to load private OpenAI debug storage settings.');
  }

  const row = Array.isArray(data) ? data[0] ?? null : data ?? null;
  return normalizeSettingsRow(row);
}

export async function loadOpenAiDebugStorageSettingsWithBackend(
  adminClient: any,
): Promise<OpenAiDebugStorageSettingsWithBackend> {
  try {
    const settings = await loadOpenAiDebugStorageSettings(adminClient);
    return {
      settings,
      backend: PERSISTENT_BACKEND_STATUS,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown OpenAI debug storage load error.';
    return {
      settings: { ...DEFAULT_OPENAI_DEBUG_STORAGE_SETTINGS },
      backend: fallbackBackendStatus('storage_error', message),
    };
  }
}

export async function updateOpenAiDebugStorageSettings(
  adminClient: any,
  input: OpenAiDebugStorageUpdateInput,
): Promise<OpenAiDebugStorageSettings> {
  const current = await loadOpenAiDebugStorageSettings(adminClient);
  const mergedSettings = mergeSettingsUpdate({ current, update: input });

  const { data, error } = await adminClient.rpc('admin_upsert_openai_debug_storage_settings', {
    p_master_enabled: mergedSettings.masterEnabled,
    p_master_expires_at: mergedSettings.masterExpiresAt,
    p_flow_overrides_json: mergedSettings.flowOverrides,
    p_updated_by: input.updatedBy,
  });

  if (error || !data) {
    if (isMissingOpenAiDebugStorageSettingsError(error)) {
      return mergedSettings;
    }
    throw new Error('Failed to update private OpenAI debug storage settings.');
  }

  const row = Array.isArray(data) ? data[0] ?? null : data ?? null;
  return normalizeSettingsRow(row);
}

export async function updateOpenAiDebugStorageSettingsWithBackend(
  adminClient: any,
  input: OpenAiDebugStorageUpdateInput,
): Promise<OpenAiDebugStorageSettingsWithBackend> {
  const currentResult = await loadOpenAiDebugStorageSettingsWithBackend(adminClient);
  const mergedSettings = mergeSettingsUpdate({ current: currentResult.settings, update: input });

  if (currentResult.backend.reason === 'storage_error') {
    return {
      settings: mergedSettings,
      backend: currentResult.backend,
    };
  }

  const { data, error } = await adminClient.rpc('admin_upsert_openai_debug_storage_settings', {
    p_master_enabled: mergedSettings.masterEnabled,
    p_master_expires_at: mergedSettings.masterExpiresAt,
    p_flow_overrides_json: mergedSettings.flowOverrides,
    p_updated_by: input.updatedBy,
  });

  if (error || !data) {
    if (isMissingOpenAiDebugStorageSettingsError(error)) {
      return {
        settings: mergedSettings,
        backend: fallbackBackendStatus('missing_relation', 'OpenAI debug storage relation ontbreekt lokaal.'),
      };
    }

    return {
      settings: mergedSettings,
      backend: fallbackBackendStatus(
        'storage_error',
        error && typeof (error as { message?: unknown }).message === 'string'
          ? String((error as { message?: string }).message)
          : 'OpenAI debug storage update failed.'
      ),
    };
  }

  return {
    settings: normalizeSettingsRow(Array.isArray(data) ? data[0] ?? null : data ?? null),
    backend: PERSISTENT_BACKEND_STATUS,
  };
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
