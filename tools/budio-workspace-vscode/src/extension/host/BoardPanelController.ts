import { spawn } from 'node:child_process';
import path from 'node:path';
import * as vscode from 'vscode';
import type { BoardSnapshot, ParsedTaskFile, TaskSort } from '../../tasks/types';
import type {
  JarvisAudioPayload,
  JarvisConversationState,
  JarvisErrorCode,
  JarvisInputMode,
  JarvisMessageSourceScope,
  JarvisRuntimeStage,
  JarvisSyncStatus,
  JarvisWorkspaceState,
} from '../../jarvis/types';
import { buildBoardSnapshot } from '../../tasks/board-state';
import { buildClaimTaskAgentPatch, buildClearTaskAgentPatch } from '../../tasks/agent-metadata';
import { TaskRepository } from '../../tasks/repository';
import { createTaskWatcher } from '../../tasks/watch';
import type {
  HostToWebviewMessage,
  WebviewToHostMessage,
} from '../../webview-bridge/messages';
import { getBoardWebviewHtml } from '../../webview-bridge/getWebviewHtml';
import { WORKSPACE_VIEW_TITLES, type WorkspaceView } from '../../navigation';
import { getBudioWorkspaceContext } from './config';
import { getActivityMenuHtml } from './getActivityMenuHtml';
import { loadJarvisWorkspaceState } from './jarvis';
import { getMicrophoneSettingsTarget, openMicrophoneSettingsWithSystemOpen } from './microphone-settings';
import {
  appendJarvisAssistantMessage,
  appendJarvisUserMessage,
  createJarvisConversationState,
  failJarvisConversation,
  resetJarvisConversation,
  recoverJarvisAvailability,
  setJarvisRuntimeStage,
  setJarvisVoiceState,
  syncJarvisConversationCapabilities,
} from '../../jarvis/conversation-state';
import { getJarvisChatAvailability, requestJarvisReply } from '../../jarvis/chat';
import { transcribeJarvisAudio } from '../../jarvis/transcription';

type PanelView = WorkspaceView;
type ActivityMenuMessage =
  | { type: 'openView'; view: WorkspaceView }
  | { type: 'refresh' };

export class BoardPanelController implements vscode.Disposable, vscode.WebviewViewProvider {
  private static readonly BACKGROUND_REFRESH_MS = 5000;
  private static readonly WATCHER_REFRESH_DEBOUNCE_MS = 350;
  private static readonly ACTIVITY_REFRESH_RESET_MS = 1200;

  private panel: vscode.WebviewPanel | null = null;
  private activityView: vscode.WebviewView | null = null;
  private watcher: vscode.Disposable | null = null;
  private backgroundRefreshTimer: NodeJS.Timeout | null = null;
  private watcherRefreshTimer: NodeJS.Timeout | null = null;
  private activityRefreshResetTimer: NodeJS.Timeout | null = null;
  private readonly disposables: vscode.Disposable[] = [];
  private lastTasks = new Map<string, ParsedTaskFile>();
  private lastBoardSnapshot: BoardSnapshot | null = null;
  private lastJarvisWorkspaceState: JarvisWorkspaceState | null = null;
  private lastFocusedTaskId: string | null = null;
  private currentView: PanelView = 'list';
  private activityRefreshState: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  private jarvisStatusOverride: JarvisSyncStatus | null = null;
  private jarvisSyncPromise: Promise<void> | null = null;
  private jarvisConversationState: JarvisConversationState = createJarvisConversationState({
    chatAvailable: false,
    voiceAvailable: false,
  });
  private jarvisConversationPromise: Promise<void> | null = null;
  private readonly jarvisOutputChannel = vscode.window.createOutputChannel('Budio Jarvis');

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
    this.stopActivityRefreshReset();
    this.panel?.dispose();
    this.watcher?.dispose();
    this.jarvisOutputChannel.dispose();
    vscode.Disposable.from(...this.disposables).dispose();
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.activityView = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.onDidReceiveMessage(
      (message: ActivityMenuMessage) => {
        void this.handleActivityMessage(message);
      },
      null,
      this.disposables,
    );
    this.renderActivityView();
    void this.open('list');
  }

  async open(view: PanelView): Promise<void> {
    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      await vscode.window.showErrorMessage('Open eerst een workspace om Budio Workspace te gebruiken.');
      return;
    }
    const { workspaceFolder, repoRoot } = workspaceContext;

    this.currentView = view;

    if (!this.panel) {
      this.panel = vscode.window.createWebviewPanel(
        'budioWorkspace.board',
        this.getPanelTitle(),
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.joinPath(this.extensionUri, 'dist'),
            vscode.Uri.joinPath(this.extensionUri, 'media'),
            workspaceFolder.uri,
            vscode.Uri.file(repoRoot),
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
      this.panel.title = this.getPanelTitle();
      this.panel.reveal(vscode.ViewColumn.One);
    }

    this.startBackgroundRefresh();
    this.renderActivityView();

    await this.publishSnapshot({ view });
  }

  async refresh(): Promise<void> {
    await this.runRefresh();
  }

  async syncJarvisAssets(): Promise<void> {
    if (this.jarvisSyncPromise) {
      return;
    }

    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      await vscode.window.showErrorMessage('Open eerst een workspace om Jarvis assets te synchroniseren.');
      return;
    }

    const { repoRoot, settings } = workspaceContext;
    const scriptPath = path.resolve(repoRoot, 'tools/jarvis-luma/download-final-frame.mjs');
    const args = [scriptPath, '--dest', settings.jarvisAssetsRoot];

    this.jarvisStatusOverride = 'syncing';
    await this.publishSnapshot({ view: 'jarvis' });

    this.jarvisSyncPromise = new Promise((resolve, reject) => {
      const child = spawn(process.execPath, args, {
        cwd: repoRoot,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stderr = '';
      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('error', reject);
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
          return;
        }
        reject(new Error(stderr.trim() || `Jarvis sync faalde met exit code ${code ?? 'unknown'}.`));
      });
    });

    try {
      await this.jarvisSyncPromise;
      this.jarvisStatusOverride = null;
      await this.publishSnapshot({ view: 'jarvis' });
      await vscode.window.showInformationMessage('Jarvis assets gesynchroniseerd.');
    } catch (error) {
      this.jarvisStatusOverride = 'error';
      await this.publishSnapshot({ view: 'jarvis' });
      await vscode.window.showErrorMessage(error instanceof Error ? error.message : 'Jarvis sync mislukt.');
    } finally {
      this.jarvisSyncPromise = null;
    }
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
      this.currentView = message.view;
      if (this.panel) {
        this.panel.title = this.getPanelTitle();
      }
      this.renderActivityView();
      this.postMessage({ type: 'switchView', view: message.view });
      return;
    }

    if (message.type === 'syncJarvisAssets') {
      await this.syncJarvisAssets();
      return;
    }

    if (message.type === 'jarvisSendMessage') {
      await this.sendJarvisMessage(message.prompt, 'typed', message.clientRequestId);
      return;
    }

    if (message.type === 'jarvisSubmitAudio') {
      await this.handleJarvisAudioSubmission(message.audio, message.clientRequestId);
      return;
    }

    if (message.type === 'jarvisReload') {
      await this.reloadJarvis();
      return;
    }

    if (message.type === 'jarvisOpenMicrophoneSettings') {
      await this.openMicrophoneSettings();
      return;
    }

    if (message.type === 'jarvisVoiceStateChanged') {
      this.jarvisConversationState = syncJarvisConversationCapabilities(
        setJarvisVoiceState(this.jarvisConversationState, message.voiceState, message.reason ?? null),
        {
          voiceAvailable:
            message.available === undefined
              ? this.jarvisConversationState.capabilities.voiceAvailable
              : message.available,
          voiceAvailabilityReason:
            message.reason === undefined
              ? this.jarvisConversationState.capabilities.voiceAvailabilityReason
              : message.reason,
        },
      );
      this.postMessage({
        type: 'jarvisVoicePermissionState',
        voiceState: message.voiceState,
        reason: message.reason ?? null,
      });
      this.publishJarvisConversationState();
      return;
    }

    if (message.type === 'jarvisResetConversation') {
      this.jarvisConversationState = resetJarvisConversation(this.jarvisConversationState);
      this.publishJarvisConversationState();
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

    if (message.type === 'claimTaskAgent') {
      const workspaceContext = getBudioWorkspaceContext();
      if (!workspaceContext) {
        this.postMessage({ type: 'saveFailed', message: 'Open eerst een workspace om een agent te claimen.' });
        return;
      }

      await this.runMutation(
        message.taskId,
        async (repository) => {
          await repository.updateTaskFields(
            message.taskId,
            message.expectedVersion,
            buildClaimTaskAgentPatch(workspaceContext.settings),
          );
        },
        {
          successMessage: 'Agent actief gekoppeld aan taak.',
        },
      );
      return;
    }

    if (message.type === 'clearTaskAgent') {
      await this.runMutation(
        message.taskId,
        async (repository) => {
          await repository.updateTaskFields(
            message.taskId,
            message.expectedVersion,
            buildClearTaskAgentPatch(),
          );
        },
        {
          successMessage: 'Agentstatus gestopt voor taak.',
        },
      );
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

  private async handleActivityMessage(message: ActivityMenuMessage): Promise<void> {
    if (message.type === 'openView') {
      await this.open(message.view);
      return;
    }

    if (!this.panel) {
      await this.open(this.currentView);
    }
    await this.runRefresh();
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
    this.setActivityRefreshState('loading');
    this.postMessage({ type: 'refreshStarted' });
    try {
      await this.publishSnapshot(undefined, true);
      this.postMessage({ type: 'refreshCompleted' });
      this.setActivityRefreshState('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Kon board niet verversen.';
      this.postMessage({ type: 'refreshFailed', message });
      this.setActivityRefreshState('error');
    }
  }

  private async publishSnapshot(
    options?: { focusTaskId?: string; view?: PanelView },
    throwOnError = false,
  ): Promise<void> {
    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext || !this.panel) {
      return;
    }

    try {
      const { repoRoot, repoName, settings } = workspaceContext;
      const repository = new TaskRepository(
        repoRoot,
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
        workspaceName: repoName,
        workspacePath: repoRoot,
      });
      this.lastBoardSnapshot = snapshot;
      this.postMessage({
        type: 'hydrateBoard',
        snapshot,
        focusTaskId: resolvedFocusTaskId,
        view: options?.view,
      });
      const jarvisState = await loadJarvisWorkspaceState({
        workspaceRoot: repoRoot,
        settings,
        webview: this.panel.webview,
        overrideStatus: this.jarvisStatusOverride,
      });
      this.lastJarvisWorkspaceState = jarvisState;
      this.postMessage({ type: 'hydrateJarvisState', state: jarvisState });
      this.syncJarvisConversationAvailability();
      this.publishJarvisConversationState();
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

  private publishJarvisConversationState(): void {
    this.postMessage({ type: 'hydrateJarvisConversationState', state: this.jarvisConversationState });
  }

  async reloadJarvis(): Promise<void> {
    this.logJarvisRuntime('reload_requested');
    const existingPanel = this.panel;
    this.currentView = 'jarvis';
    if (existingPanel) {
      existingPanel.dispose();
      this.panel = null;
    }
    await this.open('jarvis');
  }

  private syncJarvisConversationAvailability(): void {
    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      return;
    }
    const availability = getJarvisChatAvailability(workspaceContext.repoRoot);
    this.jarvisConversationState = recoverJarvisAvailability(this.jarvisConversationState, {
      chatAvailable: availability.available,
      chatAvailabilityReason: availability.reason,
      chatKeySource: availability.env.chatApiKeySource,
      chatModel: availability.env.chatModel,
      chatEnvFilePath: availability.env.envFilePath,
      lastError: this.jarvisConversationState.capabilities.lastError,
    });
    this.logJarvisRuntime('env_resolved', {
      repoRoot: workspaceContext.repoRoot,
      envFilePath: availability.env.envFilePath,
      providerSource: availability.env.chatApiKeySource,
      model: availability.env.chatModel,
      available: availability.available ? 'true' : 'false',
    });
  }

  private async sendJarvisMessage(
    prompt: string,
    inputMode: JarvisInputMode,
    clientRequestId: string = `host-${Date.now()}`,
  ): Promise<void> {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      return;
    }

    if (this.jarvisConversationPromise) {
      const message = 'Jarvis verwerkt nog een eerdere opdracht.';
      this.postMessage({ type: 'jarvisConversationFailed', clientRequestId, message, errorCode: 'busy', stage: 'failed' });
      this.postJarvisRuntimeStage(clientRequestId, 'failed', message, 'busy');
      return;
    }

    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      const message = 'Open eerst een workspace om Jarvis te gebruiken.';
      this.postMessage({ type: 'jarvisConversationFailed', clientRequestId, message, errorCode: 'missing_workspace', stage: 'failed' });
      this.postJarvisRuntimeStage(clientRequestId, 'failed', message, 'missing_workspace');
      return;
    }
    const { repoRoot } = workspaceContext;

    this.postMessage({ type: 'jarvisRequestAccepted', clientRequestId, inputMode });
    this.postJarvisRuntimeStage(clientRequestId, 'host_received', null);
    this.logJarvisRuntime('message_received', { clientRequestId, inputMode });
    this.syncJarvisConversationAvailability();
    const availability = getJarvisChatAvailability(repoRoot);
    this.postJarvisRuntimeStage(
      clientRequestId,
      'env_resolved',
      availability.available ? null : availability.reason,
      availability.available ? null : 'missing_key',
      availability.env.chatApiKeySource,
    );
    this.jarvisConversationState = appendJarvisUserMessage(this.jarvisConversationState, {
      content: trimmedPrompt,
      inputMode,
      clientRequestId,
    });
    this.publishJarvisConversationState();

    if (!availability.available) {
      this.jarvisConversationState = failJarvisConversation(
        syncJarvisConversationCapabilities(this.jarvisConversationState, {
          chatAvailable: false,
        }),
        availability.reason ?? 'Jarvis chat is niet beschikbaar.',
        'chat',
        { clientRequestId, errorCode: 'missing_key', stage: 'failed' },
      );
      this.publishJarvisConversationState();
      this.postMessage({
        type: 'jarvisConversationFailed',
        clientRequestId,
        message: availability.reason ?? 'Jarvis chat is niet beschikbaar.',
        errorCode: 'missing_key',
        stage: 'failed',
      });
      return;
    }

    const messageId = `assistant-${clientRequestId}`;

    this.jarvisConversationPromise = (async () => {
      try {
        this.postJarvisRuntimeStage(clientRequestId, 'grounding_ready', null, null, availability.env.chatApiKeySource);
        this.postJarvisRuntimeStage(clientRequestId, 'provider_call_started', null, null, availability.env.chatApiKeySource);
        this.logJarvisRuntime('chat_started', {
          clientRequestId,
          model: availability.env.chatModel,
          providerSource: availability.env.chatApiKeySource,
        });
        const reply = await requestJarvisReply({
          workspaceRoot: repoRoot,
          prompt: trimmedPrompt,
          snapshot: this.lastBoardSnapshot,
          selectedTaskId: this.lastFocusedTaskId,
          workspaceState: this.lastJarvisWorkspaceState,
          conversationState: this.jarvisConversationState,
        });
        this.jarvisConversationState = appendJarvisAssistantMessage(this.jarvisConversationState, {
          messageId,
          content: reply.text,
          sourceScope: reply.sourceScope,
          clientRequestId,
          providerSource: reply.providerSource,
        });
        this.postJarvisRuntimeStage(clientRequestId, 'provider_response_received', null, null, reply.providerSource);
        this.postMessage({
          type: 'jarvisConversationCompleted',
          clientRequestId,
          messageId,
          content: reply.text,
          sourceScope: reply.sourceScope,
          providerSource: reply.providerSource,
        });
        this.postJarvisRuntimeStage(clientRequestId, 'completed', null, null, reply.providerSource);
        this.logJarvisRuntime('chat_completed', {
          clientRequestId,
          model: reply.model,
          providerSource: reply.providerSource,
        });
        this.publishJarvisConversationState();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Jarvis kon geen antwoord genereren.';
        const errorCode = classifyJarvisError(message, 'chat');
        this.jarvisConversationState = failJarvisConversation(this.jarvisConversationState, message, 'chat', {
          clientRequestId,
          errorCode,
          stage: 'failed',
        });
        this.postMessage({ type: 'jarvisConversationFailed', clientRequestId, message, errorCode, stage: 'failed' });
        this.postJarvisRuntimeStage(clientRequestId, 'failed', message, errorCode, availability.env.chatApiKeySource);
        this.logJarvisRuntime('chat_failed', {
          clientRequestId,
          errorCode,
          providerSource: availability.env.chatApiKeySource,
        });
        this.publishJarvisConversationState();
      } finally {
        this.jarvisConversationPromise = null;
      }
    })();

    await this.jarvisConversationPromise;
  }

  private async handleJarvisAudioSubmission(
    audio: JarvisAudioPayload,
    clientRequestId: string = `audio-${Date.now()}`,
  ): Promise<void> {
    if (this.jarvisConversationPromise) {
      const message = 'Jarvis verwerkt nog een eerdere opdracht.';
      this.postMessage({ type: 'jarvisConversationFailed', clientRequestId, message, errorCode: 'busy', stage: 'failed' });
      this.postJarvisRuntimeStage(clientRequestId, 'failed', message, 'busy');
      return;
    }

    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      const message = 'Open eerst een workspace om Jarvis te gebruiken.';
      this.postMessage({ type: 'jarvisConversationFailed', clientRequestId, message, errorCode: 'missing_workspace', stage: 'failed' });
      this.postJarvisRuntimeStage(clientRequestId, 'failed', message, 'missing_workspace');
      return;
    }
    const { repoRoot } = workspaceContext;

    this.postMessage({ type: 'jarvisRequestAccepted', clientRequestId, inputMode: 'voice' });
    this.jarvisConversationState = setJarvisVoiceState(this.jarvisConversationState, 'transcribing', null);
    this.jarvisConversationState = setJarvisRuntimeStage(this.jarvisConversationState, {
      clientRequestId,
      stage: 'transcribing',
    });
    this.publishJarvisConversationState();
    this.postJarvisRuntimeStage(clientRequestId, 'transcribing', null);
    this.logJarvisRuntime('transcription_started', {
      clientRequestId,
      mimeType: audio.mimeType,
      durationMs: audio.durationMs,
    });

    try {
      const transcript = await transcribeJarvisAudio({
        workspaceRoot: repoRoot,
        audio,
      });
      this.jarvisConversationState = setJarvisVoiceState(this.jarvisConversationState, 'idle', null);
      this.jarvisConversationState = setJarvisRuntimeStage(this.jarvisConversationState, {
        clientRequestId,
        stage: 'transcribed',
        providerSource: transcript.providerSource,
      });
      this.publishJarvisConversationState();
      this.postJarvisRuntimeStage(clientRequestId, 'transcribed', null, null, transcript.providerSource);
      this.logJarvisRuntime('transcription_completed', {
        clientRequestId,
        model: transcript.model,
        providerSource: transcript.providerSource,
      });
      await this.sendJarvisMessage(transcript.text, 'voice', clientRequestId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Jarvis kon audio niet verwerken.';
      const errorCode = classifyJarvisError(message, 'voice');
      this.jarvisConversationState = failJarvisConversation(
        setJarvisVoiceState(this.jarvisConversationState, 'permission_needed', message),
        message,
        'voice',
        { clientRequestId, errorCode, stage: 'failed' },
      );
      this.postMessage({ type: 'jarvisConversationFailed', clientRequestId, message, errorCode, stage: 'failed' });
      this.postMessage({ type: 'jarvisVoicePermissionState', voiceState: 'permission_needed', reason: message });
      this.postJarvisRuntimeStage(clientRequestId, 'failed', message, errorCode);
      this.logJarvisRuntime('transcription_failed', { clientRequestId, errorCode });
      this.publishJarvisConversationState();
    }
  }

  private postJarvisRuntimeStage(
    clientRequestId: string,
    stage: JarvisRuntimeStage,
    message?: string | null,
    errorCode?: JarvisErrorCode | null,
    providerSource?: string | null,
  ): void {
    this.jarvisConversationState = setJarvisRuntimeStage(this.jarvisConversationState, {
      clientRequestId,
      stage,
      message,
      errorCode,
      providerSource,
    });
    this.postMessage({
      type: 'jarvisRuntimeStage',
      clientRequestId,
      stage,
      message: message ?? undefined,
      errorCode: errorCode ?? undefined,
      providerSource: providerSource ?? undefined,
    });
  }

  private logJarvisRuntime(event: string, details: Record<string, string | number | null | undefined> = {}): void {
    const safeDetails = Object.fromEntries(
      Object.entries(details).filter(([, value]) => value !== undefined),
    );
    this.jarvisOutputChannel.appendLine(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        event,
        ...safeDetails,
      }),
    );
  }

  private async openMicrophoneSettings(): Promise<void> {
    const target = getMicrophoneSettingsTarget();
    if (!target.uri) {
      this.postMessage({ type: 'jarvisMicrophoneSettingsResult', opened: false, message: target.fallbackMessage });
      await vscode.window.showInformationMessage(target.fallbackMessage);
      return;
    }

    const openedViaVscode = await vscode.env.openExternal(vscode.Uri.parse(target.uri));
    try {
      await openMicrophoneSettingsWithSystemOpen(target.uri);
      this.postMessage({
        type: 'jarvisMicrophoneSettingsResult',
        opened: true,
        message: 'Microfooninstellingen geopend. Controleer Visual Studio Code en probeer daarna de mic opnieuw.',
      });
      this.logJarvisRuntime('microphone_settings_opened', {
        viaVscode: openedViaVscode ? 'true' : 'false',
        platform: process.platform,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : target.fallbackMessage;
      this.postMessage({
        type: 'jarvisMicrophoneSettingsResult',
        opened: openedViaVscode,
        message: openedViaVscode ? 'Microfooninstellingen geopend via VS Code.' : `${target.fallbackMessage} (${message})`,
      });
      if (!openedViaVscode) {
        await vscode.window.showInformationMessage(target.fallbackMessage);
      }
    }
  }

  private renderActivityView(): void {
    if (!this.activityView) {
      return;
    }

    this.activityView.webview.html = getActivityMenuHtml(this.activityView.webview, {
      activeView: this.currentView,
      refreshState: this.activityRefreshState,
    });
  }

  private getPanelTitle(): string {
    return `Budio Workspace: ${WORKSPACE_VIEW_TITLES[this.currentView]}`;
  }

  private setActivityRefreshState(state: 'idle' | 'loading' | 'success' | 'error'): void {
    this.activityRefreshState = state;
    this.renderActivityView();

    if (state === 'loading' || state === 'idle') {
      this.stopActivityRefreshReset();
      return;
    }

    this.stopActivityRefreshReset();
    this.activityRefreshResetTimer = setTimeout(() => {
      this.activityRefreshResetTimer = null;
      this.activityRefreshState = 'idle';
      this.renderActivityView();
    }, BoardPanelController.ACTIVITY_REFRESH_RESET_MS);
  }

  private stopActivityRefreshReset(): void {
    if (!this.activityRefreshResetTimer) {
      return;
    }

    clearTimeout(this.activityRefreshResetTimer);
    this.activityRefreshResetTimer = null;
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
    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      return;
    }
    const configuration = vscode.workspace.getConfiguration('budioWorkspace', workspaceContext.workspaceFolder.uri);
    await configuration.update(key, value, vscode.ConfigurationTarget.Workspace);
    await this.publishSnapshot();
  }

  private async withRepository(action: (repository: TaskRepository) => Promise<void>): Promise<void> {
    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      throw new Error('Geen workspace geopend.');
    }
    const { repoRoot, settings } = workspaceContext;
    const repository = new TaskRepository(repoRoot, settings.tasksRoot, settings.epicsRoot);
    await action(repository);
  }

  private resetWatcher(): void {
    this.watcher?.dispose();
    this.stopWatcherRefresh();
    const workspaceContext = getBudioWorkspaceContext();
    if (!workspaceContext) {
      this.watcher = null;
      return;
    }

    const { repoRoot, settings } = workspaceContext;
    this.watcher = createTaskWatcher(vscode.Uri.file(repoRoot), [settings.tasksRoot, settings.epicsRoot], () => {
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

function classifyJarvisError(message: string, target: 'chat' | 'voice'): JarvisErrorCode {
  const normalized = message.toLowerCase();
  if (normalized.includes('timeout')) {
    return target === 'voice' ? 'transcription_timeout' : 'provider_timeout';
  }
  if (normalized.includes('geen jarvis chat key')) {
    return 'missing_key';
  }
  if (normalized.includes('te kort') || normalized.includes('leeg')) {
    return 'invalid_audio';
  }
  if (target === 'voice') {
    return 'transcription_error';
  }
  if (normalized.includes('providerfout')) {
    return 'provider_error';
  }
  return 'unknown';
}
