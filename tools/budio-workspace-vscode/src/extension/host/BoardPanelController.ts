import path from 'node:path';
import * as vscode from 'vscode';
import { buildBoardSnapshot } from '../../tasks/board-state';
import { TaskRepository } from '../../tasks/repository';
import { createTaskWatcher } from '../../tasks/watch';
import type { ParsedTaskFile, TaskSort } from '../../tasks/types';
import type {
  HostToWebviewMessage,
  WebviewToHostMessage,
} from '../../webview-bridge/messages';
import { getBoardWebviewHtml } from '../../webview-bridge/getWebviewHtml';
import { getPrimaryWorkspaceFolder, readWorkspaceSettings } from './config';

type PanelView = 'board' | 'list' | 'epics' | 'settings';

export class BoardPanelController implements vscode.Disposable {
  private static readonly BACKGROUND_REFRESH_MS = 30000;
  private static readonly WATCHER_REFRESH_DEBOUNCE_MS = 350;

  private panel: vscode.WebviewPanel | null = null;
  private watcher: vscode.Disposable | null = null;
  private backgroundRefreshTimer: NodeJS.Timeout | null = null;
  private watcherRefreshTimer: NodeJS.Timeout | null = null;
  private readonly disposables: vscode.Disposable[] = [];
  private lastTasks = new Map<string, ParsedTaskFile>();
  private lastFocusedTaskId: string | null = null;

  constructor(private readonly extensionUri: vscode.Uri) {
    this.resetWatcher();

    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration('budioWorkspace')) {
          return;
        }
        this.resetWatcher();
        void this.publishSnapshot();
      }),
    );
  }

  dispose(): void {
    this.stopBackgroundRefresh();
    this.stopWatcherRefresh();
    this.panel?.dispose();
    this.watcher?.dispose();
    vscode.Disposable.from(...this.disposables).dispose();
  }

  async open(view: PanelView): Promise<void> {
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder) {
      await vscode.window.showErrorMessage('Open eerst een workspace om Budio Workspace te gebruiken.');
      return;
    }

    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'budioWorkspace.board',
        'Budio Workspace',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.joinPath(this.extensionUri, 'dist'),
            vscode.Uri.joinPath(this.extensionUri, 'media'),
          ],
        },
      );

      this.panel.webview.html = getBoardWebviewHtml(this.panel.webview, this.extensionUri);
      this.panel.onDidDispose(() => {
        this.panel = null;
        this.stopBackgroundRefresh();
      }, null, this.disposables);

      this.panel.webview.onDidReceiveMessage(
        (message: WebviewToHostMessage) => {
          void this.handleMessage(message);
        },
        null,
        this.disposables,
      );
    } else {
      this.panel.reveal(vscode.ViewColumn.One);
    }

    this.startBackgroundRefresh();

    await this.publishSnapshot({ view });
  }

  async refresh(): Promise<void> {
    await this.runRefresh();
  }

  async createTask(defaultStatus: 'backlog' | 'ready' | 'in_progress' | 'review' | 'blocked' = 'ready'): Promise<void> {
    const title = await vscode.window.showInputBox({
      title: 'Nieuwe taak',
      prompt: 'Titel voor de nieuwe taak',
      placeHolder: 'Bijvoorbeeld: Brugpilot review-copy definiëren',
      ignoreFocusOut: true,
      validateInput: (value) => (value.trim().length < 3 ? 'Geef een titel van minimaal 3 tekens.' : null),
    });

    if (!title) {
      return;
    }

    await this.withRepository(async (repository) => {
      const result = await repository.createTask({
        title,
        status: defaultStatus,
      });
      await this.publishSnapshot({
        focusTaskId: result.taskId,
      });
      await vscode.window.showInformationMessage(`Taak aangemaakt: ${path.basename(result.path)}`);
    });
  }

  async createSubtask(parentTaskId: string): Promise<void> {
    const parentTask = this.lastTasks.get(parentTaskId);
    if (!parentTask) {
      return;
    }

    const title = await vscode.window.showInputBox({
      title: 'Nieuwe subtask',
      prompt: `Subtask voor ${parentTask.title}`,
      placeHolder: 'Bijvoorbeeld: Parser-test voor epic metadata toevoegen',
      ignoreFocusOut: true,
      validateInput: (value) => (value.trim().length < 3 ? 'Geef een titel van minimaal 3 tekens.' : null),
    });

    if (!title) {
      return;
    }

    await this.withRepository(async (repository) => {
      const result = await repository.createTask({
        title,
        status: 'ready',
        priority: parentTask.priority,
        phase: parentTask.phase,
        source: parentTask.relativePath,
        workstream: parentTask.workstream ?? 'plugin',
        epicId: parentTask.epicId,
        parentTaskId: parentTask.id,
        taskKind: 'subtask',
      });
      await this.publishSnapshot({ focusTaskId: result.taskId });
      await vscode.window.showInformationMessage(`Subtask aangemaakt: ${path.basename(result.path)}`);
    });
  }

  async setEpicLink(taskId: string, expectedVersion: { mtimeMs: number; hash: string }): Promise<void> {
    const task = this.lastTasks.get(taskId);
    if (!task) {
      return;
    }

    await this.withRepository(async (repository) => {
      const epics = await repository.scanEpics();
      const picked = await vscode.window.showQuickPick(
        [
          { label: 'Geen epic', description: 'Verwijder huidige epic-link', id: '' },
          ...epics.map((epic) => ({
            label: epic.title,
            description: epic.id,
            id: epic.id,
          })),
        ],
        {
          title: 'Koppel taak aan epic',
          placeHolder: 'Kies een epic voor deze taak',
          ignoreFocusOut: true,
        },
      );

      if (!picked) {
        return;
      }

      await repository.updateTaskFields(taskId, expectedVersion, {
        epicId: picked.id || null,
      });
      await this.publishSnapshot({ focusTaskId: taskId });
      await vscode.window.showInformationMessage(
        picked.id ? `Epic gekoppeld: ${picked.description}` : 'Epic-link verwijderd.',
      );
    });
  }

  async addDependency(taskId: string, expectedVersion: { mtimeMs: number; hash: string }): Promise<void> {
    const task = this.lastTasks.get(taskId);
    if (!task) {
      return;
    }

    await this.withRepository(async (repository) => {
      const tasks = await repository.scan();
      const candidates = tasks
        .filter((candidate) => candidate.id !== taskId)
        .sort((left, right) => left.title.localeCompare(right.title));

      const picked = await vscode.window.showQuickPick(
        candidates.map((candidate) => ({
          label: candidate.title,
          description: candidate.id,
          detail: candidate.relativePath,
          id: candidate.id,
        })),
        {
          title: 'Voeg dependency toe',
          placeHolder: 'Kies een task die eerst klaar moet zijn',
          ignoreFocusOut: true,
        },
      );

      if (!picked) {
        return;
      }

      const nextDependsOn = [...new Set([...(task.dependsOn ?? []), picked.id])];
      await repository.updateTaskFields(taskId, expectedVersion, {
        dependsOn: nextDependsOn,
      });
      await this.publishSnapshot({ focusTaskId: taskId });
      await vscode.window.showInformationMessage(`Dependency toegevoegd: ${picked.description}`);
    });
  }

  private async handleMessage(message: WebviewToHostMessage): Promise<void> {
    if (message.type === 'ready') {
      await this.publishSnapshot();
      return;
    }

    if (message.type === 'refreshBoard') {
      await this.runRefresh();
      return;
    }

    if (message.type === 'switchView') {
      this.postMessage({ type: 'switchView', view: message.view });
      return;
    }

    if (message.type === 'createTask') {
      await this.createTask(message.status);
      return;
    }

    if (message.type === 'createSubtask') {
      await this.createSubtask(message.parentTaskId);
      return;
    }

    if (message.type === 'setEpicLink') {
      await this.setEpicLink(message.taskId, message.expectedVersion);
      return;
    }

    if (message.type === 'addDependency') {
      await this.addDependency(message.taskId, message.expectedVersion);
      return;
    }

    if (message.type === 'openSourceFile') {
      await this.openSourceFile(message.taskId);
      return;
    }

    if (message.type === 'revealInExplorer') {
      await this.revealInExplorer(message.taskId);
      return;
    }

    if (message.type === 'copyRelativePath') {
      await this.copyRelativePath(message.taskId);
      return;
    }

    if (message.type === 'updateSetting') {
      await this.updateSetting(message.key, message.value);
      return;
    }

    if (message.type === 'updateTaskFields') {
      await this.runMutation(message.taskId, async (repository) => {
        await repository.updateTaskFields(message.taskId, message.expectedVersion, message.patch);
      });
      return;
    }

    if (message.type === 'toggleChecklistItem') {
      await this.runMutation(message.taskId, async (repository) => {
        await repository.toggleChecklistItem(
          message.taskId,
          message.expectedVersion,
          message.checklistIndex,
          message.checked,
        );
      });
      return;
    }

    if (message.type === 'moveTask') {
      await this.runMutation(message.taskId, async (repository) => {
        await repository.moveTask({
          taskId: message.taskId,
          expectedVersion: message.expectedVersion,
          targetStatus: message.targetStatus,
          destinationIds: message.destinationIds,
          sourceIds: message.sourceIds,
        });
      });
      return;
    }

    if (message.type === 'deleteTask') {
      await this.runMutation(
        message.taskId,
        async (repository) => {
          await repository.deleteTask(message.taskId, message.expectedVersion);
        },
        {
          successMessage: 'Taak verwijderd en verwijzingen opgeschoond.',
          focusTaskId: null,
        },
      );
      return;
    }

    if (message.type === 'archiveTask') {
      await this.runMutation(
        message.taskId,
        async (repository) => {
          await repository.archiveTask(message.taskId, message.expectedVersion);
        },
        {
          successMessage: 'Taak gearchiveerd.',
          focusTaskId: null,
        },
      );
    }
  }

  private async runMutation(
    taskId: string,
    action: (repository: TaskRepository) => Promise<void>,
    options?: {
      successMessage?: string;
      focusTaskId?: string | null;
    },
  ): Promise<void> {
    this.postMessage({ type: 'saveStarted', taskId });

    try {
      await this.withRepository(async (repository) => {
        await action(repository);
      });
      const focusTaskId =
        options?.focusTaskId === undefined
          ? taskId
          : options.focusTaskId === null
            ? undefined
            : options.focusTaskId;
      this.lastFocusedTaskId = focusTaskId ?? null;
      await this.publishSnapshot({ focusTaskId });
      this.postMessage({
        type: 'saveCompleted',
        message: options?.successMessage ?? 'Wijziging opgeslagen in markdown.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende fout tijdens opslaan.';
      if (message.includes('gewijzigd op disk')) {
        this.postMessage({ type: 'conflictDetected', message });
      } else {
        this.postMessage({ type: 'saveFailed', message });
      }
      await this.publishSnapshot({ focusTaskId: taskId });
      void vscode.window.showErrorMessage(message);
    }
  }

  private async runRefresh(): Promise<void> {
    this.postMessage({ type: 'refreshStarted' });
    try {
      await this.publishSnapshot(undefined, true);
      this.postMessage({ type: 'refreshCompleted' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kon board niet verversen.';
      this.postMessage({ type: 'refreshFailed', message });
    }
  }

  private async publishSnapshot(
    options?: { focusTaskId?: string; view?: PanelView },
    throwOnError = false,
  ): Promise<void> {
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder || !this.panel) {
      return;
    }

    try {
      const settings = readWorkspaceSettings(workspaceFolder);
      const repository = new TaskRepository(
        workspaceFolder.uri.fsPath,
        settings.tasksRoot,
        settings.epicsRoot,
      );
      const [tasks, epics] = await Promise.all([repository.scan(), repository.scanEpics()]);
      this.lastTasks = new Map(tasks.map((task) => [task.id, task]));
      const resolvedFocusTaskId = options?.focusTaskId ?? this.resolveFocusedTaskId(tasks);
      this.lastFocusedTaskId = resolvedFocusTaskId ?? null;
      const snapshot = buildBoardSnapshot({
        tasks,
        epics,
        settings,
        workspaceName: workspaceFolder.name,
        workspacePath: workspaceFolder.uri.fsPath,
      });
      this.postMessage({
        type: 'hydrateBoard',
        snapshot,
        focusTaskId: resolvedFocusTaskId,
        view: options?.view,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kon board niet laden.';
      void vscode.window.showErrorMessage(message);
      this.postMessage({ type: 'saveFailed', message });
      if (throwOnError) {
        throw error;
      }
    }
  }

  private postMessage(message: HostToWebviewMessage): void {
    void this.panel?.webview.postMessage(message);
  }

  private async openSourceFile(taskId: string): Promise<void> {
    const task = this.lastTasks.get(taskId);
    if (!task) {
      return;
    }
    const document = await vscode.workspace.openTextDocument(task.sourcePath);
    await vscode.window.showTextDocument(document, { preview: false });
  }

  private async revealInExplorer(taskId: string): Promise<void> {
    const task = this.lastTasks.get(taskId);
    if (!task) {
      return;
    }
    await vscode.commands.executeCommand('revealInExplorer', vscode.Uri.file(task.sourcePath));
  }

  private async copyRelativePath(taskId: string): Promise<void> {
    const task = this.lastTasks.get(taskId);
    if (!task) {
      return;
    }
    await vscode.env.clipboard.writeText(task.relativePath);
    await vscode.window.showInformationMessage(`Pad gekopieerd: ${task.relativePath}`);
  }

  private async updateSetting(key: 'showDoneColumn' | 'defaultSort', value: boolean | TaskSort): Promise<void> {
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder) {
      return;
    }
    const configuration = vscode.workspace.getConfiguration('budioWorkspace', workspaceFolder.uri);
    await configuration.update(key, value, vscode.ConfigurationTarget.Workspace);
    await this.publishSnapshot();
  }

  private async withRepository(action: (repository: TaskRepository) => Promise<void>): Promise<void> {
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error('Geen workspace geopend.');
    }
    const settings = readWorkspaceSettings(workspaceFolder);
    const repository = new TaskRepository(workspaceFolder.uri.fsPath, settings.tasksRoot, settings.epicsRoot);
    await action(repository);
  }

  private resetWatcher(): void {
    this.watcher?.dispose();
    this.stopWatcherRefresh();
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder) {
      this.watcher = null;
      return;
    }

    const settings = readWorkspaceSettings(workspaceFolder);
    this.watcher = createTaskWatcher(workspaceFolder, [settings.tasksRoot, settings.epicsRoot], () => {
      this.scheduleWatcherRefresh();
    });
  }

  private scheduleWatcherRefresh(): void {
    if (!this.panel) {
      return;
    }

    this.stopWatcherRefresh();
    this.watcherRefreshTimer = setTimeout(() => {
      this.watcherRefreshTimer = null;
      void this.publishSnapshot();
    }, BoardPanelController.WATCHER_REFRESH_DEBOUNCE_MS);
  }

  private stopWatcherRefresh(): void {
    if (!this.watcherRefreshTimer) {
      return;
    }

    clearTimeout(this.watcherRefreshTimer);
    this.watcherRefreshTimer = null;
  }

  private resolveFocusedTaskId(tasks: ParsedTaskFile[]): string | undefined {
    if (!this.lastFocusedTaskId) {
      return undefined;
    }

    return tasks.some((task) => task.id === this.lastFocusedTaskId)
      ? this.lastFocusedTaskId
      : undefined;
  }

  private startBackgroundRefresh(): void {
    if (this.backgroundRefreshTimer || !this.panel) {
      return;
    }

    this.backgroundRefreshTimer = setInterval(() => {
      if (!this.panel) {
        return;
      }
      void this.publishSnapshot();
    }, BoardPanelController.BACKGROUND_REFRESH_MS);
  }

  private stopBackgroundRefresh(): void {
    if (!this.backgroundRefreshTimer) {
      return;
    }
    clearInterval(this.backgroundRefreshTimer);
    this.backgroundRefreshTimer = null;
  }
}
