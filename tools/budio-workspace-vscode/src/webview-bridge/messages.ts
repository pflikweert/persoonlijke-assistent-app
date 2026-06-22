import type {
  BoardSnapshot,
  FileVersion,
  TaskFieldPatch,
  TaskSort,
  TaskStatus,
} from '../tasks/types';
import type {
  JarvisAudioPayload,
  JarvisConversationState,
  JarvisErrorCode,
  JarvisInputMode,
  JarvisMessageSourceScope,
  JarvisRuntimeStage,
  JarvisVoiceState,
  JarvisWorkspaceState,
} from '../jarvis/types';

export type HostToWebviewMessage =
  | { type: 'hydrateBoard'; snapshot: BoardSnapshot; focusTaskId?: string; view?: 'board' | 'list' | 'epics' | 'settings' | 'jarvis' }
  | { type: 'hydrateJarvisState'; state: JarvisWorkspaceState }
  | { type: 'hydrateJarvisConversationState'; state: JarvisConversationState }
  | { type: 'jarvisRequestAccepted'; clientRequestId: string; inputMode: JarvisInputMode }
  | { type: 'jarvisRuntimeStage'; clientRequestId: string; stage: JarvisRuntimeStage; message?: string; providerSource?: string | null; errorCode?: JarvisErrorCode | null }
  | { type: 'jarvisConversationCompleted'; clientRequestId?: string; messageId: string; content: string; sourceScope: JarvisMessageSourceScope; providerSource?: string | null }
  | { type: 'jarvisConversationFailed'; clientRequestId?: string; message: string; errorCode?: JarvisErrorCode; stage?: JarvisRuntimeStage }
  | { type: 'jarvisVoicePermissionState'; voiceState: JarvisVoiceState; reason: string | null }
  | { type: 'jarvisMicrophoneSettingsResult'; opened: boolean; message: string }
  | { type: 'refreshStarted' }
  | { type: 'refreshCompleted' }
  | { type: 'refreshFailed'; message: string }
  | { type: 'saveStarted'; taskId?: string }
  | { type: 'saveCompleted'; message: string }
  | { type: 'saveFailed'; message: string }
  | { type: 'conflictDetected'; message: string }
  | { type: 'switchView'; view: 'board' | 'list' | 'epics' | 'settings' | 'jarvis' };

export type WebviewToHostMessage =
  | { type: 'ready' }
  | { type: 'refreshBoard' }
  | {
      type: 'moveTask';
      taskId: string;
      expectedVersion: FileVersion;
      targetStatus: TaskStatus;
      destinationIds: string[];
      sourceIds: string[];
    }
  | {
      type: 'updateTaskFields';
      taskId: string;
      expectedVersion: FileVersion;
      patch: TaskFieldPatch;
    }
  | {
      type: 'toggleChecklistItem';
      taskId: string;
      expectedVersion: FileVersion;
      checklistIndex: number;
      checked: boolean;
    }
  | {
      type: 'claimTaskAgent';
      taskId: string;
      expectedVersion: FileVersion;
    }
  | {
      type: 'clearTaskAgent';
      taskId: string;
      expectedVersion: FileVersion;
    }
  | {
      type: 'createTask';
      status: Exclude<TaskStatus, 'done'>;
      title?: string;
    }
  | {
      type: 'createSubtask';
      parentTaskId: string;
    }
  | {
      type: 'setEpicLink';
      taskId: string;
      expectedVersion: FileVersion;
    }
  | {
      type: 'addDependency';
      taskId: string;
      expectedVersion: FileVersion;
    }
  | {
      type: 'openSourceFile';
      taskId: string;
    }
  | {
      type: 'revealInExplorer';
      taskId: string;
    }
  | {
      type: 'copyRelativePath';
      taskId: string;
    }
  | {
      type: 'deleteTask';
      taskId: string;
      expectedVersion: FileVersion;
    }
  | {
      type: 'archiveTask';
      taskId: string;
      expectedVersion: FileVersion;
    }
  | {
      type: 'switchView';
      view: 'board' | 'list' | 'epics' | 'settings' | 'jarvis';
    }
  | {
      type: 'syncJarvisAssets';
    }
  | {
      type: 'jarvisSendMessage';
      clientRequestId: string;
      prompt: string;
    }
  | {
      type: 'jarvisSubmitAudio';
      clientRequestId: string;
      audio: JarvisAudioPayload;
    }
  | {
      type: 'jarvisReload';
    }
  | {
      type: 'jarvisOpenMicrophoneSettings';
    }
  | {
      type: 'jarvisVoiceStateChanged';
      voiceState: JarvisVoiceState;
      reason?: string | null;
      available?: boolean;
    }
  | {
      type: 'jarvisResetConversation';
    }
  | {
      type: 'updateSetting';
      key: 'showDoneColumn' | 'defaultSort';
      value: boolean | TaskSort;
    };
