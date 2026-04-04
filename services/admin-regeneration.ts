import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import { ensureAuthenticatedUserSession } from '@/services/auth';
import {
  createClientFlowId,
  FunctionFlowError,
  isFunctionErrorPayload,
} from '@/services/function-error';

export type AdminRegenerationStepType =
  | 'entries_normalized'
  | 'day_journals'
  | 'week_reflections'
  | 'month_reflections';

export type AdminRegenerationJobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export type AdminRegenerationStepStatus = 'pending' | 'running' | 'completed' | 'failed';

export type AdminRegenerationStepView = {
  step_type: AdminRegenerationStepType;
  status: AdminRegenerationStepStatus;
  phase: string;
  total: number;
  queued: number;
  openai_completed: number;
  applied: number;
  failed: number;
  cursor: number;
  remaining: number;
  last_update_at: string;
};

export type AdminRegenerationJobView = {
  id: string;
  status: AdminRegenerationJobStatus;
  created_by: string;
  selected_types: AdminRegenerationStepType[];
  options: Record<string, unknown>;
  summary: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  steps: AdminRegenerationStepView[];
};

type StartResponse = {
  status: 'ok';
  flow: 'admin-regeneration-job';
  requestId: string;
  flowId: string;
  job: AdminRegenerationJobView;
};

type StatusResponse = {
  status: 'ok';
  flow: 'admin-regeneration-job';
  requestId: string;
  flowId: string;
  job: AdminRegenerationJobView;
};

function parseFunctionMessage(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  const message = (parsed as { error?: unknown; message?: unknown }).error;
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }

  const alt = (parsed as { message?: unknown }).message;
  return typeof alt === 'string' && alt.length > 0 ? alt : null;
}

async function parseFunctionInvokeError(error: unknown): Promise<never> {
  const fallback =
    error instanceof Error ? error.message : 'Data opnieuw verwerken kon niet gestart worden.';

  if (!error || typeof error !== 'object') {
    throw new Error(fallback);
  }

  const maybeContext = (error as { context?: unknown }).context;
  if (!(maybeContext instanceof Response)) {
    throw new Error(fallback);
  }

  const text = await maybeContext.text();
  if (!text) {
    throw new Error(fallback);
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    if (isFunctionErrorPayload(parsed)) {
      throw new FunctionFlowError(parsed);
    }

    throw new Error(parseFunctionMessage(parsed) ?? text);
  } catch (nextError) {
    if (nextError instanceof FunctionFlowError || nextError instanceof Error) {
      throw nextError;
    }

    throw new Error(text);
  }
}

async function invokeAction<T>(input: {
  flowId: string;
  body: Record<string, unknown>;
}): Promise<T> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error('Supabase client niet beschikbaar. Controleer je env variabelen.');
  }

  const { data, error } = await supabase.functions.invoke<T>('admin-regeneration-job', {
    headers: {
      'x-flow-id': input.flowId,
    },
    body: input.body,
  });

  if (error) {
    await parseFunctionInvokeError(error);
  }

  if (!data) {
    throw new Error('Lege response van admin-regeneration-job.');
  }

  return data;
}

export async function startAdminRegenerationJob(input: {
  selectedTypes: AdminRegenerationStepType[];
}): Promise<AdminRegenerationJobView> {
  const normalizedTypes = [...new Set(input.selectedTypes)].filter(
    (value): value is AdminRegenerationStepType =>
      value === 'entries_normalized' ||
      value === 'day_journals' ||
      value === 'week_reflections' ||
      value === 'month_reflections'
  );

  if (normalizedTypes.length === 0) {
    throw new Error('Kies minimaal één datatype om opnieuw te verwerken.');
  }

  const flowId = createClientFlowId('admin-regeneration');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-regeneration-job' });

  const data = await invokeAction<StartResponse>({
    flowId,
    body: {
      action: 'start',
      selectedTypes: normalizedTypes,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-regeneration-job' || !data.requestId || !data.job) {
    throw new Error('Ongeldige response van admin-regeneration-job start.');
  }

  return data.job;
}

export async function fetchAdminRegenerationJobStatus(input: {
  jobId: string;
  driveWorker?: boolean;
}): Promise<AdminRegenerationJobView> {
  const jobId = input.jobId.trim();
  if (!jobId) {
    throw new Error('jobId ontbreekt.');
  }

  const flowId = createClientFlowId('admin-regeneration');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-regeneration-job' });

  if (input.driveWorker ?? true) {
    try {
      await invokeAction<unknown>({
        flowId,
        body: {
          action: 'worker_tick',
          jobId,
        },
      });
    } catch {
      // Status ophalen blijft leidend; worker_tick mag stil falen tijdens polling.
    }
  }

  const data = await invokeAction<StatusResponse>({
    flowId,
    body: {
      action: 'status',
      jobId,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-regeneration-job' || !data.requestId || !data.job) {
    throw new Error('Ongeldige response van admin-regeneration-job status.');
  }

  return data.job;
}
