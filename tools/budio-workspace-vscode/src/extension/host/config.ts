import * as vscode from 'vscode';
import { DEFAULT_COLUMNS, TASK_SORTS, TASK_STATUSES } from '../../tasks/constants';
import type { TaskSort, TaskStatus, WorkspaceSettings } from '../../tasks/types';

export function getPrimaryWorkspaceFolder(): vscode.WorkspaceFolder | null {
  return vscode.workspace.workspaceFolders?.[0] ?? null;
}

export function readWorkspaceSettings(workspaceFolder: vscode.WorkspaceFolder): WorkspaceSettings {
  const configuration = vscode.workspace.getConfiguration('budioWorkspace', workspaceFolder.uri);
  const rawColumns = configuration.get<string[]>('columns', [...DEFAULT_COLUMNS]);
  const configuredColumns = rawColumns.filter((status): status is TaskStatus =>
    TASK_STATUSES.includes(status as TaskStatus),
  );
  const columns = ensureRequiredColumns(configuredColumns);
  const rawSort = configuration.get<string>('defaultSort', 'manual');
  const defaultSort = TASK_SORTS.includes(rawSort as TaskSort) ? (rawSort as TaskSort) : 'manual';

  return {
    tasksRoot: sanitizeRelativePath(configuration.get<string>('tasksRoot', 'docs/project/25-tasks')),
    epicsRoot: sanitizeRelativePath(configuration.get<string>('epicsRoot', 'docs/project/24-epics')),
    columns: columns.length > 0 ? columns : [...DEFAULT_COLUMNS],
    showDoneColumn: configuration.get<boolean>('showDoneColumn', true),
    defaultSort,
  };
}

function ensureRequiredColumns(columns: TaskStatus[]): TaskStatus[] {
  const laneOrder: TaskStatus[] = ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'];
  const existing = new Set(columns);

  for (const lane of laneOrder) {
    if (!existing.has(lane)) {
      columns.push(lane);
      existing.add(lane);
    }
  }

  return laneOrder.filter((lane) => existing.has(lane));
}

function sanitizeRelativePath(input: string): string {
  return input.replace(/^[./]+/, '').replace(/\/+$/, '');
}
