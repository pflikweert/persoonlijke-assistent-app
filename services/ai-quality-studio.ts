import type {
  AiOpenAiDebugStorageSettings,
  AiPromptAssistPreviewResult,
  AiReviewLabel,
  AiTaskDraftCreationMeta,
  AiTaskDetail,
  AiTaskDraftPayload,
  RunPromptAssistPreviewPayload,
  AiRuntimeBaselineImportResult,
  SaveAiTaskTestReviewPayload,
  AiTaskSummary,
  AiTaskTestCompareView,
  AiTaskTestRun,
  AiTaskTestSource,
  AiTaskVersionDetail,
  RunAiTaskTestPayload,
  UpdateAiOpenAiDebugStorageSettingsPayload,
} from '@/types';

import { getSupabaseBrowserClient } from '@/src/lib/supabase';
import { ensureAuthenticatedUserSession } from '@/services/auth';
import {
  createClientFlowId,
  FunctionFlowError,
  isFunctionErrorPayload,
} from '@/services/function-error';

type AccessResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  canAccess: boolean;
  userId: string | null;
};

type ListTasksResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  tasks: AiTaskSummary[];
};

type TaskDetailResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  task: AiTaskDetail;
};

type CreateDraftVersionResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  version: AiTaskVersionDetail;
  derivation: AiTaskDraftCreationMeta;
};

type DraftVersionResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  version: AiTaskVersionDetail;
};

type DeleteDraftVersionResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  deletedVersionId: string;
};

type TestSourcesResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  sources: AiTaskTestSource[];
};

type TestRunResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  testRun: AiTaskTestRun;
};

type CompareViewResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  compare: AiTaskTestCompareView;
};

type ImportRuntimeBaselineResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  importResult: AiRuntimeBaselineImportResult;
};

type PromptAssistPreviewResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  preview: AiPromptAssistPreviewResult;
};

type OpenAiDebugStorageResponse = {
  status: 'ok';
  flow: 'admin-ai-quality-studio';
  requestId: string;
  flowId: string;
  debugStorage: AiOpenAiDebugStorageSettings;
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
    error instanceof Error ? error.message : 'AI Quality Studio kon niet geladen worden.';

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

  const { data, error } = await supabase.functions.invoke<T>('admin-ai-quality-studio', {
    headers: {
      'x-flow-id': input.flowId,
    },
    body: input.body,
  });

  if (error) {
    await parseFunctionInvokeError(error);
  }

  if (!data) {
    throw new Error('Lege response van admin-ai-quality-studio.');
  }

  return data;
}

export async function hasAdminAiQualityStudioAccess(): Promise<boolean> {
  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  try {
    const data = await invokeAction<AccessResponse>({
      flowId,
      body: {
        action: 'access',
      },
    });

    return (
      data.status === 'ok' &&
      data.flow === 'admin-ai-quality-studio' &&
      Boolean(data.requestId) &&
      data.canAccess === true
    );
  } catch (error) {
    if (error instanceof FunctionFlowError) {
      if (error.payload.code === 'AUTH_UNAUTHORIZED' || error.payload.code === 'AUTH_MISSING') {
        return false;
      }
    }

    throw error;
  }
}

export async function fetchAdminAiQualityStudioTasks(): Promise<AiTaskSummary[]> {
  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<ListTasksResponse>({
    flowId,
    body: {
      action: 'list_tasks',
    },
  });

  if (
    data.status !== 'ok' ||
    data.flow !== 'admin-ai-quality-studio' ||
    !data.requestId ||
    !Array.isArray(data.tasks)
  ) {
    throw new Error('Ongeldige response van admin-ai-quality-studio list_tasks.');
  }

  return data.tasks;
}

export async function fetchAdminAiQualityStudioTaskDetail(taskKey: string): Promise<AiTaskDetail> {
  const normalizedTaskKey = taskKey.trim();
  if (!normalizedTaskKey) {
    throw new Error('taskKey ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<TaskDetailResponse>({
    flowId,
    body: {
      action: 'get_task_detail',
      taskKey: normalizedTaskKey,
    },
  });

  if (
    data.status !== 'ok' ||
    data.flow !== 'admin-ai-quality-studio' ||
    !data.requestId ||
    !data.task
  ) {
    throw new Error('Ongeldige response van admin-ai-quality-studio get_task_detail.');
  }

  return data.task;
}

export async function createAdminAiQualityStudioDraftVersion(taskKey: string): Promise<{
  version: AiTaskVersionDetail;
  derivation: AiTaskDraftCreationMeta;
}> {
  const normalizedTaskKey = taskKey.trim();
  if (!normalizedTaskKey) {
    throw new Error('taskKey ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<CreateDraftVersionResponse>({
    flowId,
    body: {
      action: 'create_draft_version',
      taskKey: normalizedTaskKey,
    },
  });

  if (
    data.status !== 'ok' ||
    data.flow !== 'admin-ai-quality-studio' ||
    !data.requestId ||
    !data.version ||
    !data.derivation
  ) {
    throw new Error('Ongeldige response van admin-ai-quality-studio create_draft_version.');
  }

  return {
    version: data.version,
    derivation: data.derivation,
  };
}

export async function updateAdminAiQualityStudioDraftVersion(
  versionId: string,
  payload: AiTaskDraftPayload
): Promise<AiTaskVersionDetail> {
  const normalizedVersionId = versionId.trim();
  if (!normalizedVersionId) {
    throw new Error('versionId ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<DraftVersionResponse>({
    flowId,
    body: {
      action: 'update_draft_version',
      versionId: normalizedVersionId,
      payload,
    },
  });

  if (
    data.status !== 'ok' ||
    data.flow !== 'admin-ai-quality-studio' ||
    !data.requestId ||
    !data.version
  ) {
    throw new Error('Ongeldige response van admin-ai-quality-studio update_draft_version.');
  }

  return data.version;
}

export async function deleteAdminAiQualityStudioDraftVersion(
  versionId: string
): Promise<{ deletedVersionId: string }> {
  const normalizedVersionId = versionId.trim();
  if (!normalizedVersionId) {
    throw new Error('versionId ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<DeleteDraftVersionResponse>({
    flowId,
    body: {
      action: 'delete_draft_version',
      versionId: normalizedVersionId,
    },
  });

  if (
    data.status !== 'ok' ||
    data.flow !== 'admin-ai-quality-studio' ||
    !data.requestId ||
    !data.deletedVersionId
  ) {
    throw new Error('Ongeldige response van admin-ai-quality-studio delete_draft_version.');
  }

  return {
    deletedVersionId: data.deletedVersionId,
  };
}

export async function listAdminAiQualityStudioTestSources(taskKey: string): Promise<AiTaskTestSource[]> {
  const normalizedTaskKey = taskKey.trim();
  if (!normalizedTaskKey) {
    throw new Error('taskKey ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<TestSourcesResponse>({
    flowId,
    body: {
      action: 'list_test_sources',
      taskKey: normalizedTaskKey,
    },
  });

  if (
    data.status !== 'ok' ||
    data.flow !== 'admin-ai-quality-studio' ||
    !data.requestId ||
    !Array.isArray(data.sources)
  ) {
    throw new Error('Ongeldige response van admin-ai-quality-studio list_test_sources.');
  }

  return data.sources;
}

export async function runAdminAiQualityStudioTest(payload: RunAiTaskTestPayload): Promise<AiTaskTestRun> {
  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<TestRunResponse>({
    flowId,
    body: {
      action: 'run_test',
      taskKey: payload.taskKey,
      taskVersionId: payload.taskVersionId,
      sourceType: payload.sourceType,
      sourceRecordId: payload.sourceRecordId,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-ai-quality-studio' || !data.requestId || !data.testRun) {
    throw new Error('Ongeldige response van admin-ai-quality-studio run_test.');
  }

  return data.testRun;
}

export async function fetchAdminAiQualityStudioTestRun(testRunId: string): Promise<AiTaskTestRun> {
  const normalizedTestRunId = testRunId.trim();
  if (!normalizedTestRunId) {
    throw new Error('testRunId ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<TestRunResponse>({
    flowId,
    body: {
      action: 'get_test_run',
      testRunId: normalizedTestRunId,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-ai-quality-studio' || !data.requestId || !data.testRun) {
    throw new Error('Ongeldige response van admin-ai-quality-studio get_test_run.');
  }

  return data.testRun;
}

export async function fetchAdminAiQualityStudioCompareView(
  testRunId: string
): Promise<AiTaskTestCompareView> {
  const normalizedTestRunId = testRunId.trim();
  if (!normalizedTestRunId) {
    throw new Error('testRunId ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<CompareViewResponse>({
    flowId,
    body: {
      action: 'get_compare_view',
      testRunId: normalizedTestRunId,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-ai-quality-studio' || !data.requestId || !data.compare) {
    throw new Error('Ongeldige response van admin-ai-quality-studio get_compare_view.');
  }

  return data.compare;
}

export async function saveAdminAiQualityStudioTestReview(
  payload: SaveAiTaskTestReviewPayload
): Promise<AiTaskTestRun> {
  const normalizedTestRunId = payload.testRunId.trim();
  if (!normalizedTestRunId) {
    throw new Error('testRunId ontbreekt.');
  }

  const allowedLabels: AiReviewLabel[] = ['beter', 'gelijk', 'slechter', 'fout'];
  if (!allowedLabels.includes(payload.label)) {
    throw new Error('label is ongeldig.');
  }

  const notes = payload.notes?.trim() || null;
  if ((payload.label === 'slechter' || payload.label === 'fout') && !notes) {
    throw new Error('Notitie is verplicht bij slechter of fout.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<TestRunResponse>({
    flowId,
    body: {
      action: 'save_test_review',
      testRunId: normalizedTestRunId,
      label: payload.label,
      notes,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-ai-quality-studio' || !data.requestId || !data.testRun) {
    throw new Error('Ongeldige response van admin-ai-quality-studio save_test_review.');
  }

  return data.testRun;
}

export async function importAdminAiQualityRuntimeBaseline(): Promise<AiRuntimeBaselineImportResult> {
  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<ImportRuntimeBaselineResponse>({
    flowId,
    body: {
      action: 'import_runtime_baseline',
    },
  });

  if (
    data.status !== 'ok' ||
    data.flow !== 'admin-ai-quality-studio' ||
    !data.requestId ||
    !data.importResult
  ) {
    throw new Error('Ongeldige response van admin-ai-quality-studio import_runtime_baseline.');
  }

  return data.importResult;
}

export async function fetchAdminOpenAiDebugStorageSettings(): Promise<AiOpenAiDebugStorageSettings> {
  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<OpenAiDebugStorageResponse>({
    flowId,
    body: {
      action: 'get_openai_debug_storage_settings',
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-ai-quality-studio' || !data.requestId || !data.debugStorage) {
    throw new Error('Ongeldige response van admin-ai-quality-studio get_openai_debug_storage_settings.');
  }

  return data.debugStorage;
}

export async function updateAdminOpenAiDebugStorageSettings(
  payload: UpdateAiOpenAiDebugStorageSettingsPayload
): Promise<AiOpenAiDebugStorageSettings> {
  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<OpenAiDebugStorageResponse>({
    flowId,
    body: {
      action: 'update_openai_debug_storage_settings',
      masterEnabled: payload.masterEnabled,
      masterTtlHours: payload.masterTtlHours,
      flowUpdates: payload.flowUpdates,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-ai-quality-studio' || !data.requestId || !data.debugStorage) {
    throw new Error('Ongeldige response van admin-ai-quality-studio update_openai_debug_storage_settings.');
  }

  return data.debugStorage;
}

export async function runAdminAiQualityStudioPromptAssistPreview(
  payload: RunPromptAssistPreviewPayload
): Promise<AiPromptAssistPreviewResult> {
  const normalizedTaskKey = payload.taskKey.trim();
  const normalizedVersionId = payload.versionId.trim();
  if (!normalizedTaskKey) {
    throw new Error('taskKey ontbreekt.');
  }
  if (!normalizedVersionId) {
    throw new Error('versionId ontbreekt.');
  }

  const flowId = createClientFlowId('admin-ai-quality');
  await ensureAuthenticatedUserSession({ flowId, source: 'admin-ai-quality-studio' });

  const data = await invokeAction<PromptAssistPreviewResponse>({
    flowId,
    body: {
      action: 'prompt_assist_preview',
      taskKey: normalizedTaskKey,
      versionId: normalizedVersionId,
      targetLayerType: payload.targetLayerType,
      targetLayerKey: payload.targetLayerKey,
      assistActionId: payload.assistActionId,
      assistIntent: payload.assistIntent?.trim() ?? '',
      editorContext: payload.editorContext,
    },
  });

  if (data.status !== 'ok' || data.flow !== 'admin-ai-quality-studio' || !data.requestId || !data.preview) {
    throw new Error('Ongeldige response van admin-ai-quality-studio prompt_assist_preview.');
  }

  return data.preview;
}