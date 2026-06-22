export type JarvisSyncStatus =
  | 'idle'
  | 'syncing'
  | 'partial'
  | 'ready'
  | 'error'
  | 'missing_key'
  | 'missing_manifest';

export type JarvisAssetKind = 'image' | 'video' | 'text';
export type JarvisInputMode = 'typed' | 'voice';
export type JarvisChatState = 'idle' | 'thinking' | 'answering' | 'error';
export type JarvisVoiceState = 'idle' | 'recording' | 'transcribing' | 'permission_needed' | 'unavailable';
export type JarvisMessageRole = 'user' | 'assistant';
export type JarvisMessageSourceScope = 'workspace' | 'general' | 'hybrid';
export type JarvisMessageStatus = 'complete' | 'error';
export type JarvisRuntimeStage =
  | 'queued'
  | 'host_received'
  | 'env_resolved'
  | 'transcribing'
  | 'transcribed'
  | 'grounding_ready'
  | 'provider_call_started'
  | 'provider_response_received'
  | 'completed'
  | 'failed';
export type JarvisErrorCode =
  | 'busy'
  | 'missing_workspace'
  | 'missing_key'
  | 'provider_error'
  | 'provider_timeout'
  | 'transcription_error'
  | 'transcription_timeout'
  | 'invalid_audio'
  | 'unknown';

export interface JarvisCommandRoomContent {
  leftRail: {
    eyebrow: string;
    progressLabel: string;
    items: Array<{
      title: string;
      status: string;
      priority: string;
    }>;
  };
  rightRail: {
    eyebrow: string;
    items: string[];
  };
  speakingSurface: string;
  commandBar: {
    placeholder: string;
    contextChip: string;
  };
}

export interface JarvisAssetEntry {
  seedAssetId: string;
  logicalId: string;
  role: string;
  kind: JarvisAssetKind;
  expectedFilename: string;
  preferredMime: string | null;
  status: 'ready' | 'downloaded' | 'manual_source_required' | 'seeded_text' | 'error';
  resolvedApi: string | null;
  resolvedUrl: string | null;
  localPath: string | null;
  checksum: string | null;
  downloadedAt: string | null;
  failureReason: string | null;
  previewText: string | null;
  notes: string | null;
  webviewUri?: string | null;
}

export interface JarvisWorkspaceState {
  status: JarvisSyncStatus;
  title: string;
  generatedAt: string | null;
  assetsRoot: string;
  seedManifestPath: string;
  manifestPath: string | null;
  reportPath: string | null;
  keyFamily: string | null;
  apiMode: string | null;
  summary: {
    total: number;
    ready: number;
    downloaded: number;
    manual_source_required: number;
    seeded_text: number;
    error: number;
    cached?: number;
  };
  designTokens: Record<string, string>;
  commandRoom: JarvisCommandRoomContent;
  assets: JarvisAssetEntry[];
  issues: string[];
}

export interface JarvisConversationMessage {
  id: string;
  role: JarvisMessageRole;
  content: string;
  timestamp: string;
  sourceScope: JarvisMessageSourceScope;
  status: JarvisMessageStatus;
}

export interface JarvisConversationCapabilities {
  chatAvailable: boolean;
  voiceAvailable: boolean;
  inputMode: JarvisInputMode;
  lastError: string | null;
  chatAvailabilityReason: string | null;
  voiceAvailabilityReason: string | null;
  chatKeySource?: string | null;
  chatModel?: string | null;
  chatEnvFilePath?: string | null;
}

export interface JarvisConversationState {
  messages: JarvisConversationMessage[];
  chatState: JarvisChatState;
  voiceState: JarvisVoiceState;
  capabilities: JarvisConversationCapabilities;
  pendingRequestId?: string | null;
  lastRuntimeStage?: JarvisRuntimeStage | null;
  lastProviderSource?: string | null;
  lastErrorCode?: JarvisErrorCode | null;
}

export interface JarvisAudioPayload {
  audioBase64: string;
  mimeType: string;
  durationMs: number;
}
