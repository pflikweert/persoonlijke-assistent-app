export type AiTaskInputType = 'entry' | 'day' | 'week' | 'month';

export type AiTaskOutputType = 'text' | 'json' | 'text_list';

export type AiTaskVersionStatus = 'draft' | 'testing' | 'live' | 'archived';
export type AiTestRunStatus = 'queued' | 'completed' | 'failed';
export type AiTestSourceType = 'entry' | 'day' | 'week' | 'month';
export type AiDraftDerivationSource = 'live' | 'latest_draft' | 'latest_version' | 'empty';
export type AiReviewLabel = 'beter' | 'gelijk' | 'slechter' | 'fout';

export type AiTaskLiveVersionSummary = {
  id: string;
  versionNumber: number;
  status: AiTaskVersionStatus;
  model: string;
  createdAt: string;
  updatedAt: string;
  becameLiveAt: string | null;
  lockedAt: string | null;
};

export type AiTaskVersionDetail = {
  id: string;
  versionNumber: number;
  status: AiTaskVersionStatus;
  model: string;
  promptTemplate: string;
  systemInstructions: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
  minItems: number | null;
  maxItems: number | null;
  changelog: string | null;
  createdAt: string;
  updatedAt: string;
  becameLiveAt: string | null;
  lockedAt: string | null;
};

export type AiTaskDraftPayload = {
  model: string;
  promptTemplate: string;
  systemInstructions: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
  minItems: number | null;
  maxItems: number | null;
  changelog: string | null;
};

export type AiTaskSummary = {
  id: string;
  key: string;
  label: string;
  inputType: AiTaskInputType;
  outputType: AiTaskOutputType;
  description: string | null;
  isActive: boolean;
  hasDraft: boolean;
  createdAt: string;
  updatedAt: string;
  liveVersion: AiTaskLiveVersionSummary | null;
};

export type AiTaskDetail = AiTaskSummary & {
  versions: AiTaskVersionDetail[];
};

export type AiTaskTestSource = {
  sourceType: AiTestSourceType;
  sourceRecordId: string;
  label: string;
  subtitle: string;
  preview: string;
};

export type AiTaskTestRun = {
  id: string;
  taskId: string;
  taskVersionId: string;
  taskVersionNumber: number;
  testCaseId: string;
  status: AiTestRunStatus;
  sourceType: AiTestSourceType;
  sourceRecordId: string;
  sourceLabel: string;
  inputSnapshotJson: Record<string, unknown>;
  promptSnapshot: string;
  systemInstructionsSnapshot: string;
  outputSchemaSnapshotJson: Record<string, unknown>;
  configSnapshotJson: Record<string, unknown>;
  modelSnapshot: string;
  outputText: string | null;
  outputJson: Record<string, unknown> | null;
  latencyMs: number | null;
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
  reviewerLabel: AiReviewLabel | null;
  reviewerNotes: string | null;
  createdAt: string;
};

export type RunAiTaskTestPayload = {
  taskKey: string;
  taskVersionId: string;
  sourceType: Extract<AiTestSourceType, 'entry' | 'day'>;
  sourceRecordId: string;
};

export type AiTaskDraftCreationMeta = {
  source: AiDraftDerivationSource;
  versionNumber: number | null;
};

export type AiRuntimeBaselineImportResult = {
  inserted: string[];
  skipped_equal: string[];
  skipped_conflict: string[];
  unsupported: string[];
  conflicts: string[];
};

export type AiCompareBaselineStatus = 'available' | 'missing' | 'unsupported';

export type AiTaskTestCompareView = {
  testRunId: string;
  taskKey: string;
  taskLabel: string;
  taskVersionNumber: number;
  sourceType: AiTestSourceType;
  sourceRecordId: string;
  sourceLabel: string;
  baselineStatus: AiCompareBaselineStatus;
  baselineReason: string | null;
  liveOutputText: string | null;
  testOutputText: string | null;
  reviewerLabel: AiReviewLabel | null;
  reviewerNotes: string | null;
};

export type SaveAiTaskTestReviewPayload = {
  testRunId: string;
  label: AiReviewLabel;
  notes: string | null;
};