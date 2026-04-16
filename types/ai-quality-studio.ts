export type AiTaskInputType = 'entry' | 'day' | 'week' | 'month';

export type AiTaskOutputType = 'text' | 'json' | 'text_list';

export type AiTaskVersionStatus = 'draft' | 'testing' | 'live' | 'archived';
export type AiTestRunStatus = 'queued' | 'completed' | 'failed';
export type AiTestSourceType = 'entry' | 'day' | 'week' | 'month';
export type AiDraftDerivationSource = 'live' | 'latest_draft' | 'latest_version' | 'empty';
export type AiReviewLabel = 'beter' | 'gelijk' | 'slechter' | 'fout';

export type AiPromptAssistTargetLayerType = 'system' | 'general' | 'field';

export type AiPromptAssistTargetLayerKey = string;

export type AiPromptAssistActionId =
  | 'compacter'
  | 'ontdubbelen'
  | 'verhelderen'
  | 'check_contract'
  | 'check_overlap'
  | 'verplaats_naar_juiste_laag'
  | 'maak_strikter'
  | 'check_outputvorm'
  | 'verdeel_over_velden';

export type AiPromptAssistActionPlacement = 'primary' | 'secondary';

export type AiPromptAssistActionOutputType = 'text' | 'object' | 'list' | 'compound';

export type AiPromptAssistActionDefinition = {
  id: AiPromptAssistActionId;
  label: string;
  helper: string;
  order: number;
  placement: AiPromptAssistActionPlacement;
  allowedTargetLayerTypes: AiPromptAssistTargetLayerType[];
  relevantOutputTypes?: AiPromptAssistActionOutputType[];
};

export type AiPromptAssistIssueSeverity = 'info' | 'warning' | 'risk';
export type AiPromptAssistIssueType = 'duplicate' | 'misplaced' | 'conflict';

export type AiPromptAssistIssue = {
  severity: AiPromptAssistIssueSeverity;
  type: AiPromptAssistIssueType;
  message: string;
};

/**
 * De functionele OpenAI-runtimerol die deze laag representeert.
 * - high_precedence_instruction: system/developer instructies met hoge prioriteit (boven user)
 * - task_goal: taakbrede gebruikersinstructies
 * - field_rule: veldspecifieke outputregels
 */
export type AiPromptAssistLayerRole =
  | 'high_precedence_instruction'
  | 'task_goal'
  | 'field_rule';

/** Laagprioriteit in runtime-context */
export type AiPromptAssistLayerPrecedence = 'high' | 'normal';

/** Soorten toegestane wijzigingen per actie/laag */
export type AiPromptAssistAllowedChangeKind =
  | 'rewrite_within_layer'
  | 'dedupe_within_layer'
  | 'tighten_wording'
  | 'clarify_execution'
  | 'redistribute_with_explicit_justification';

/** Semantische context van één laag voor de assist */
export type AiPromptAssistLayerSemantics = {
  key: string;
  label: string;
  layerType: AiPromptAssistTargetLayerType;
  runtimeRole: AiPromptAssistLayerRole;
  precedence: AiPromptAssistLayerPrecedence;
  purpose: string;
  /** Regels/instructies die absoluut behouden moeten blijven */
  preserveRules: string[];
  /** Wat mag niet naar andere lagen verschuiven */
  forbiddenMoves: string[];
};

/** Een harde constraint die nooit verloren mag gaan of naar een lagere laag mag zakken */
export type AiPromptAssistInvariant = {
  id: string;
  description: string;
  sourceLayerKey: string;
  /** Als true mag deze constraint nooit naar een lagere-precedence laag verplaatsen */
  mustRemainHighPrecedence: boolean;
};

/** Sibling-context als read-only voor de assist; nooit direct bewerkbaar */
export type AiPromptAssistReadOnlyContext = {
  key: string;
  label: string;
  layerType: AiPromptAssistTargetLayerType;
  runtimeRole: AiPromptAssistLayerRole;
  text: string;
};

export type AiPromptAssistEditorContext = {
  systemRulesInstruction: string;
  generalInstruction: string;
  fieldRules: Record<string, string>;
  editableSections?: Array<{
    key: string;
    label: string;
    layerType: AiPromptAssistTargetLayerType;
  }>;
  tokenCatalog?: Array<{
    id: string;
    kind: 'input' | 'output';
    label: string;
    token: string;
  }>;
  outputContract?: Record<string, unknown>;
  taskMetadata?: Record<string, unknown>;
  /** Semantiek per laag — geeft de assist expliciete rolomschrijving en guardrails */
  layerSemantics?: AiPromptAssistLayerSemantics[];
  /** Sibling-lagen als read-only context voor de assist */
  readOnlyContext?: AiPromptAssistReadOnlyContext[];
  /** Harde constraints die nooit verloren mogen gaan */
  invariants?: AiPromptAssistInvariant[];
  /** Welke soort wijzigingen zijn toegestaan voor de huidige target + actie */
  allowedChangeKinds?: AiPromptAssistAllowedChangeKind[];
};

export type RunPromptAssistPreviewPayload = {
  taskKey: string;
  versionId: string;
  targetLayerType: AiPromptAssistTargetLayerType;
  targetLayerKey: AiPromptAssistTargetLayerKey;
  assistActionId: AiPromptAssistActionId;
  assistIntent?: string;
  editorContext: AiPromptAssistEditorContext;
};

/** Per veld in verdeel_over_velden: de voorgestelde tekst + expliciete reden voor plaatsing in die laag */
export type AiPromptAssistSectionProposal = {
  proposedText: string;
  placementReason: string;
  detectedRisks: string[];
};

export type AiPromptAssistPreviewResult = {
  targetLayerType: AiPromptAssistTargetLayerType;
  targetLayerKey: AiPromptAssistTargetLayerKey;
  assistActionId: AiPromptAssistActionId;
  analysisSummary: string;
  issues: AiPromptAssistIssue[];
  proposedText: string;
  proposedSections?: Record<string, string>;
  /** Placement reasons per veld bij verdeel_over_velden */
  sectionReasons?: Record<string, string>;
  /** Gedetecteerde risico's per veld bij verdeel_over_velden */
  sectionRisks?: Record<string, string[]>;
  changeSummary: string;
  rationale: string | null;
  /** Invariants die behouden zijn in het voorstel */
  preservedInvariants?: string[];
  /** Gedetecteerde risico's bij single-layer rewrite */
  detectedRisks?: string[];
  diff: {
    before: string;
    after: string;
  };
  openAiObjectId?: string | null;
};

export type AiOpenAiDebugFlowKey =
  | 'process-entry.generation'
  | 'generate-reflection.generation'
  | 'regenerate-day-journal.generation'
  | 'admin-ai-quality-studio.prompt_assist_preview'
  | 'admin-ai-quality-studio.run_test';

export type AiOpenAiDebugCapabilityState =
  | 'supported'
  | 'off'
  | 'on'
  | 'requested_but_effectively_unsupported';

export type AiOpenAiDebugCapabilityReason =
  | 'zero_data_retention'
  | 'non_us_region_chat_completions'
  | 'endpoint_out_of_scope'
  | 'expired'
  | null;

export type AiOpenAiDebugFlowStatus = {
  flowKey: AiOpenAiDebugFlowKey;
  state: AiOpenAiDebugCapabilityState;
  reason: AiOpenAiDebugCapabilityReason;
  desiredOn: boolean;
  effectiveOn: boolean;
  expiresAt: string | null;
};

export type AiOpenAiDebugStorageBackendStatus = {
  persistence: 'persistent' | 'ephemeral_fallback';
  reason: 'ok' | 'missing_relation' | 'storage_error';
  message: string | null;
};

export type AiOpenAiDebugStorageSettings = {
  masterEnabled: boolean;
  masterExpiresAt: string | null;
  updatedAt: string | null;
  backend: AiOpenAiDebugStorageBackendStatus;
  flows: AiOpenAiDebugFlowStatus[];
};

export type UpdateAiOpenAiDebugStorageSettingsPayload = {
  masterEnabled: boolean;
  masterTtlHours: number | null;
  flowUpdates: Array<{
    flowKey: AiOpenAiDebugFlowKey;
    enabled: boolean;
    ttlHours: number | null;
  }>;
};

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
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
  changelog: string | null;
  createdAt: string;
  updatedAt: string;
  becameLiveAt: string | null;
  lockedAt: string | null;
};

export type AiTaskDraftPayload = {
  model: string;
  promptTemplate: string;
  outputSchemaJson: Record<string, unknown>;
  configJson: Record<string, unknown>;
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
  liveOutputJson: Record<string, unknown> | unknown[] | null;
  testOutputText: string | null;
  testOutputJson: Record<string, unknown> | unknown[] | null;
  reviewerLabel: AiReviewLabel | null;
  reviewerNotes: string | null;
};

export type SaveAiTaskTestReviewPayload = {
  testRunId: string;
  label: AiReviewLabel;
  notes: string | null;
};

export type AiQualityFamilyKey = 'moments' | 'today' | 'week' | 'month';

export type AiQualityTaskCapabilities = {
  canDraft: boolean;
  canTest: boolean;
  canCompare: boolean;
  canReview: boolean;
  canPromptAssist: boolean;
  allowedSourceTypes: Extract<AiTestSourceType, 'entry' | 'day'>[];
};

export type AiQualityTaskMetadata = {
  taskKey: string;
  taskLabel: string;
  familyKey: AiQualityFamilyKey | null;
  familyTitle: string | null;
  familyDescription: string | null;
  runtimeFamily: 'entry_normalization' | 'day_journal' | 'reflection' | 'unknown';
  compositionRole: 'single' | 'compound_part' | 'legacy_hidden';
  managedOutputField: string | null;
  affectedOutputFields: string[];
  sortOrder: number;
  visibleInFamily: boolean;
  sharedRuntimeCall: boolean;
  editorScope: 'task' | 'family' | 'read_only_part';
  editorTargetTaskKey: string | null;
  capabilities: AiQualityTaskCapabilities;
};

export type AiQualityFamilyTaskReadModel = {
  task: AiTaskSummary;
  metadata: AiQualityTaskMetadata;
  status: 'runtime' | 'draft' | 'missing';
};

export type AiQualityFamilyReadModel = {
  key: AiQualityFamilyKey;
  title: string;
  description: string;
  componentCountLabel: string;
  statusSummary: string;
  sharedRuntimeCall: boolean;
  editorScope: 'task' | 'family' | 'read_only';
  editorEntryTaskKey: string | null;
  tasks: AiQualityFamilyTaskReadModel[];
};

export type AiQualityStudioReadModel = {
  families: AiQualityFamilyReadModel[];
  visibleTasks: AiTaskSummary[];
};