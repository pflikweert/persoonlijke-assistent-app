import type {
  BoardSnapshot,
  FileVersion,
  TaskFieldPatch,
  TaskSort,
  TaskStatus,
} from '../tasks/types';

export type HostToWebviewMessage =
  | { type: 'hydrateBoard'; snapshot: BoardSnapshot; focusTaskId?: string; view?: 'board' | 'list' | 'settings' }
  | { type: 'saveStarted'; taskId?: string }
  | { type: 'saveCompleted'; message: string }
  | { type: 'saveFailed'; message: string }
  | { type: 'conflictDetected'; message: string }
  | { type: 'switchView'; view: 'board' | 'list' | 'settings' };

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
      type: 'createTask';
      status: Exclude<TaskStatus, 'done'>;
      title?: string;
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
      type: 'switchView';
      view: 'board' | 'list' | 'settings';
    }
  | {
      type: 'updateSetting';
      key: 'showDoneColumn' | 'defaultSort';
      value: boolean | TaskSort;
    };
