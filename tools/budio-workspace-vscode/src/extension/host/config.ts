import * as vscode from 'vscode';
import path from 'node:path';
import { DEFAULT_COLUMNS, TASK_SORTS, TASK_STATUSES } from '../../tasks/constants';
import type { TaskSort, TaskStatus, WorkspaceSettings } from '../../tasks/types';
import { resolveBudioWorkspaceRoot } from './workspace-root';

export function getPrimaryWorkspaceFolder(): vscode.WorkspaceFolder | null {
  return vscode.workspace.workspaceFolders?.[0] ?? null;
}

export interface BudioWorkspaceContext {
  workspaceFolder: vscode.WorkspaceFolder;
  repoRoot: string;
  repoName: string;
  settings: WorkspaceSettings;
}

export function getBudioWorkspaceContext(): BudioWorkspaceContext | null {
  const workspaceFolder = getPrimaryWorkspaceFolder();
  if (!workspaceFolder) {
    return null;
  }

  const workspaceRoots = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [
    workspaceFolder.uri.fsPath,
  ];
  const repoRoot = resolveBudioWorkspaceRoot(workspaceRoots) ?? workspaceFolder.uri.fsPath;

  return {
    workspaceFolder,
    repoRoot,
    repoName: path.basename(repoRoot),
    settings: readWorkspaceSettings(workspaceFolder),
  };
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
    jarvisAssetsRoot: sanitizeRelativePath(configuration.get<string>('jarvisAssetsRoot', 'assets/jarvis/final-frame')),
    jarvisSeedManifest: sanitizeRelativePath(configuration.get<string>('jarvisSeedManifest', 'tools/jarvis-luma/final-frame.seed.json')),
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
