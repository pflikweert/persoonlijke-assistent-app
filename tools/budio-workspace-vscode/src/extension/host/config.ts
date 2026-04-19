import * as vscode from 'vscode';
import { DEFAULT_COLUMNS, TASK_SORTS, TASK_STATUSES } from '../../tasks/constants';
import type { TaskSort, TaskStatus, WorkspaceSettings } from '../../tasks/types';

export function getPrimaryWorkspaceFolder(): vscode.WorkspaceFolder | null {
  return vscode.workspace.workspaceFolders?.[0] ?? null;
}

export function readWorkspaceSettings(workspaceFolder: vscode.WorkspaceFolder): WorkspaceSettings {
  const configuration = vscode.workspace.getConfiguration('budioWorkspace', workspaceFolder.uri);
  const rawColumns = configuration.get<string[]>('columns', [...DEFAULT_COLUMNS]);
  const columns = rawColumns.filter((status): status is TaskStatus =>
    TASK_STATUSES.includes(status as TaskStatus),
  );
  const rawSort = configuration.get<string>('defaultSort', 'manual');
  const defaultSort = TASK_SORTS.includes(rawSort as TaskSort) ? (rawSort as TaskSort) : 'manual';

  return {
    tasksRoot: sanitizeRelativePath(configuration.get<string>('tasksRoot', 'docs/project/25-tasks')),
    columns: columns.length > 0 ? columns : [...DEFAULT_COLUMNS],
    showDoneColumn: configuration.get<boolean>('showDoneColumn', true),
    defaultSort,
  };
}

function sanitizeRelativePath(input: string): string {
  return input.replace(/^[./]+/, '').replace(/\/+$/, '');
}
