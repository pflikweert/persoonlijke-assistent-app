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

type PanelView = 'board' | 'list' | 'settings';

export class BoardPanelController implements vscode.Disposable {
  private panel: vscode.WebviewPanel | null = null;
  private watcher: vscode.Disposable | null = null;
  private readonly disposables: vscode.Disposable[] = [];
  private lastTasks = new Map<string, ParsedTaskFile>();

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

    await this.publishSnapshot({ view });
  }

  async refresh(): Promise<void> {
    await this.publishSnapshot();
  }

  async createTask(defaultStatus: 'backlog' | 'ready' | 'in_progress' | 'blocked' = 'ready'): Promise<void> {
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

  private async handleMessage(message: WebviewToHostMessage): Promise<void> {
    if (message.type === 'ready') {
      await this.publishSnapshot();
      return;
    }

    if (message.type === 'refreshBoard') {
      await this.publishSnapshot();
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
    }
  }

  private async runMutation(
    taskId: string,
    action: (repository: TaskRepository) => Promise<void>,
  ): Promise<void> {
    this.postMessage({ type: 'saveStarted', taskId });

    try {
      await this.withRepository(async (repository) => {
        await action(repository);
      });
      await this.publishSnapshot({ focusTaskId: taskId });
      this.postMessage({ type: 'saveCompleted', message: 'Wijziging opgeslagen in markdown.' });
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

  private async publishSnapshot(options?: { focusTaskId?: string; view?: PanelView }): Promise<void> {
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder || !this.panel) {
      return;
    }

    try {
      const settings = readWorkspaceSettings(workspaceFolder);
      const repository = new TaskRepository(workspaceFolder.uri.fsPath, settings.tasksRoot);
      const tasks = await repository.scan();
      this.lastTasks = new Map(tasks.map((task) => [task.id, task]));
      const snapshot = buildBoardSnapshot({
        tasks,
        settings,
        workspaceName: workspaceFolder.name,
        workspacePath: workspaceFolder.uri.fsPath,
      });
      this.postMessage({
        type: 'hydrateBoard',
        snapshot,
        focusTaskId: options?.focusTaskId,
        view: options?.view,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kon board niet laden.';
      void vscode.window.showErrorMessage(message);
      this.postMessage({ type: 'saveFailed', message });
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
    const repository = new TaskRepository(workspaceFolder.uri.fsPath, settings.tasksRoot);
    await action(repository);
  }

  private resetWatcher(): void {
    this.watcher?.dispose();
    const workspaceFolder = getPrimaryWorkspaceFolder();
    if (!workspaceFolder) {
      this.watcher = null;
      return;
    }

    const settings = readWorkspaceSettings(workspaceFolder);
    this.watcher = createTaskWatcher(workspaceFolder, settings.tasksRoot, () => {
      void this.publishSnapshot();
    });
  }
}
