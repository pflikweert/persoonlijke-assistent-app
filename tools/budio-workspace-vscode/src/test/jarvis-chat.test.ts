import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  appendJarvisAssistantMessage,
  appendJarvisUserMessage,
  createJarvisConversationState,
  failJarvisConversation,
  mergeHydratedJarvisConversationState,
  recoverJarvisAvailability,
  setJarvisRuntimeStage,
  setJarvisVoiceState,
} from '../jarvis/conversation-state';
import { buildJarvisWorkspaceAwareness } from '../jarvis/awareness';
import { buildJarvisGroundingContext, getJarvisChatAvailability, requestJarvisReply } from '../jarvis/chat';
import { parseDotEnvFile, resolveJarvisEnv } from '../jarvis/env';
import { transcribeJarvisAudio } from '../jarvis/transcription';
import { resolveBudioWorkspaceRoot } from '../extension/host/workspace-root';
import { summarizeJarvisAssetAvailability } from '../jarvis/assets';
import type { BoardSnapshot } from '../tasks/types';
import type { JarvisWorkspaceState } from '../jarvis/types';

test('jarvis chat availability resolves workspace-specific keys before OPENAI_API_KEY', () => {
  const unavailable = getJarvisChatAvailability('/tmp/workspace', {});
  assert.equal(unavailable.available, false);
  assert.match(unavailable.reason ?? '', /Geen Jarvis chat key gevonden/);

  const available = getJarvisChatAvailability('/tmp/workspace', {
    OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY: 'sk-workspace',
    OPENAI_API_KEY: 'sk-fallback',
    BUDIO_WORKSPACE_JARVIS_MODEL: 'gpt-test',
  });
  assert.equal(available.available, true);
  assert.equal(available.env.chatApiKey, 'sk-workspace');
  assert.equal(available.env.chatModel, 'gpt-test');
});

test('jarvis env parser accepts export syntax and quoted values', () => {
  const parsed = parseDotEnvFile('/tmp/file-that-does-not-exist');
  assert.deepEqual(parsed, {});

  const resolved = resolveJarvisEnv('/tmp/workspace', {
    OPENAI_API_BUDIO_WORKSPACE_KEY: '"sk-local"',
    OPENAI_TRANSCRIPTION_MODEL: "'gpt-transcribe'",
  });
  assert.equal(resolved.chatApiKey, 'sk-local');
  assert.equal(resolved.transcriptionModel, 'gpt-transcribe');
});

test('jarvis env resolution keeps .env.local values when process env contains empty overrides', () => {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'jarvis-env-'));
  fs.writeFileSync(
    path.join(workspaceRoot, '.env.local'),
    [
      'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY=sk-file-workspace',
      'OPENAI_API_KEY=sk-file-fallback',
      'OPENAI_TRANSCRIPTION_MODEL=gpt-file-transcribe',
    ].join('\n'),
  );

  const resolved = resolveJarvisEnv(workspaceRoot, {
    OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY: '',
    OPENAI_API_KEY: '',
  });

  assert.equal(resolved.chatApiKey, 'sk-file-workspace');
  assert.equal(resolved.chatApiKeySource, 'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY');
  assert.equal(resolved.transcriptionModel, 'gpt-file-transcribe');
  assert.equal(resolved.envFilePath, path.join(workspaceRoot, '.env.local'));
});

test('jarvis workspace root resolver finds Budio repo inside parent workspace', () => {
  const parentRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'budio-parent-'));
  const unrelatedRoot = path.join(parentRoot, 'space-idle-game');
  const repoRoot = path.join(parentRoot, 'persoonlijke-assistent-app');
  fs.mkdirSync(path.join(unrelatedRoot, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, 'docs/project/25-tasks'), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, 'tools/budio-workspace-vscode'), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, 'assets/jarvis'), { recursive: true });
  fs.writeFileSync(path.join(unrelatedRoot, '.env.local'), 'OPENAI_API_KEY=sk-wrong');
  fs.writeFileSync(path.join(repoRoot, '.env.local'), 'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY=sk-right');

  const resolvedRoot = resolveBudioWorkspaceRoot([parentRoot]);
  assert.equal(resolvedRoot, repoRoot);

  const availability = getJarvisChatAvailability(resolvedRoot, {
    OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY: '',
  });
  assert.equal(availability.available, true);
  assert.equal(availability.env.chatApiKey, 'sk-right');
  assert.equal(availability.env.envFilePath, path.join(repoRoot, '.env.local'));
});

test('jarvis grounding context includes selected task and local docs', () => {
  const snapshot = createBoardSnapshot();
  const workspaceState = createJarvisWorkspaceState();
  const conversationState = createJarvisConversationState({ chatAvailable: true });
  const context = buildJarvisGroundingContext({
    snapshot,
    selectedTaskId: 'task-2',
    workspaceState,
    conversationState,
  });

  assert.match(context, /Geselecteerde task: Werkende Jarvis command room/);
  assert.match(context, /Jarvis assetstatus: ready/);
  assert.match(context, /Jarvis assets beschikbaar: 20\/20/);
  assert.match(context, /Jarvis assets handmatige mapping nodig: 0/);
  assert.match(context, /Lokale Jarvis docs/);
  assert.doesNotMatch(context, /Jarvis assets ready: 17\/20/);
  assert.doesNotMatch(context, /Sprint 4/);
});

test('jarvis asset availability counts seeded text as locally available', () => {
  const workspaceState = createJarvisWorkspaceState();
  const availability = summarizeJarvisAssetAvailability(workspaceState);

  assert.equal(availability.total, 20);
  assert.equal(availability.ready, 17);
  assert.equal(availability.seededText, 3);
  assert.equal(availability.available, 20);
  assert.equal(availability.manualRequired, 0);
  assert.deepEqual(availability.issues, []);
});

test('jarvis asset availability reports only real manual or error issues', () => {
  const workspaceState = createJarvisWorkspaceState();
  workspaceState.assets[1] = {
    ...workspaceState.assets[1],
    status: 'manual_source_required',
    failureReason: 'Asset seed-1 vereist nog een handmatige mapping of Luma export.',
  };
  workspaceState.summary = {
    ...workspaceState.summary,
    ready: 16,
    manual_source_required: 1,
  };

  const availability = summarizeJarvisAssetAvailability(workspaceState);

  assert.equal(availability.available, 19);
  assert.equal(availability.manualRequired, 1);
  assert.deepEqual(availability.issues, [
    'jarvis-core: Asset seed-1 vereist nog een handmatige mapping of Luma export.',
  ]);
});

test('jarvis workspace awareness exposes real active agents and focus tasks', () => {
  const snapshot = createBoardSnapshot();
  snapshot.allCards[1] = {
    ...snapshot.allCards[1],
    activeAgent: 'Codex',
    activeAgentModel: 'gpt-5',
    activeAgentRuntime: 'codex',
    activeAgentSince: new Date().toISOString(),
    activeAgentStatus: 'running',
    activeAgentSettings: 'default',
  };

  const awareness = buildJarvisWorkspaceAwareness(snapshot);

  assert.equal(awareness.loaded, true);
  assert.equal(awareness.activeAgents.length, 1);
  assert.equal(awareness.activeAgents[0].agent, 'Codex');
  assert.equal(awareness.activeAgents[0].taskTitle, 'Werkende Jarvis command room');
  assert.equal(awareness.focusItems[0].agent, 'Codex');
});

test('jarvis conversation helpers support typed, assistant and voice states', () => {
  let state = createJarvisConversationState({ chatAvailable: true, voiceAvailable: true });
  state = appendJarvisUserMessage(state, {
    content: 'Welke task heeft nu prioriteit?',
    inputMode: 'typed',
    clientRequestId: 'req-1',
  });
  assert.equal(state.chatState, 'thinking');
  assert.equal(state.pendingRequestId, 'req-1');
  assert.equal(state.capabilities.inputMode, 'typed');
  assert.equal(state.messages.at(-1)?.id, 'user-req-1');

  state = appendJarvisAssistantMessage(state, {
    messageId: 'assistant-req-1',
    content: 'De actieve Jarvis-task heeft nu prioriteit.',
    sourceScope: 'workspace',
    clientRequestId: 'req-1',
    providerSource: 'OPENAI_API_KEY',
  });
  assert.equal(state.chatState, 'idle');
  assert.equal(state.pendingRequestId, null);
  assert.equal(state.lastRuntimeStage, 'completed');
  assert.equal(state.lastProviderSource, 'OPENAI_API_KEY');
  assert.equal(state.messages.at(-1)?.status, 'complete');

  state = setJarvisVoiceState(state, 'recording', null);
  assert.equal(state.voiceState, 'recording');
  assert.equal(state.capabilities.inputMode, 'voice');
});

test('jarvis conversation helpers keep optimistic messages during hydration race', () => {
  const optimistic = appendJarvisUserMessage(createJarvisConversationState({ chatAvailable: true }), {
    content: 'Ping Jarvis',
    inputMode: 'typed',
    clientRequestId: 'race-1',
  });
  const staleHydration = createJarvisConversationState({ chatAvailable: true });

  const merged = mergeHydratedJarvisConversationState(optimistic, staleHydration);

  assert.equal(merged.messages.length, 1);
  assert.equal(merged.messages[0].id, 'user-race-1');
  assert.equal(merged.pendingRequestId, 'race-1');
});

test('jarvis runtime stages and failures carry request diagnostics without secrets', () => {
  let state = createJarvisConversationState({ chatAvailable: true });
  state = setJarvisRuntimeStage(state, {
    clientRequestId: 'req-diagnostics',
    stage: 'provider_call_started',
    providerSource: 'OPENAI_API_BUDIO_WORKSPACE_KEY',
  });
  assert.equal(state.chatState, 'thinking');
  assert.equal(state.lastProviderSource, 'OPENAI_API_BUDIO_WORKSPACE_KEY');

  state = failJarvisConversation(state, 'Providerfout zonder secret', 'chat', {
    clientRequestId: 'req-diagnostics',
    errorCode: 'provider_error',
    stage: 'failed',
  });
  assert.equal(state.chatState, 'error');
  assert.equal(state.pendingRequestId, null);
  assert.equal(state.lastErrorCode, 'provider_error');
  assert.equal(state.capabilities.lastError, 'Providerfout zonder secret');
});

test('jarvis availability recovery clears stale chat error when a real key route is available', () => {
  const failed = failJarvisConversation(
    createJarvisConversationState({ chatAvailable: false }),
    'Geen Jarvis chat key gevonden.',
    'chat',
    {
      clientRequestId: 'stale-1',
      errorCode: 'missing_key',
      stage: 'failed',
    },
  );

  const recovered = recoverJarvisAvailability(failed, {
    chatAvailable: true,
    chatAvailabilityReason: null,
    chatKeySource: 'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY',
    chatModel: 'gpt-test',
    chatEnvFilePath: '/repo/.env.local',
    lastError: failed.capabilities.lastError,
  });

  assert.equal(recovered.chatState, 'idle');
  assert.equal(recovered.lastRuntimeStage, null);
  assert.equal(recovered.lastErrorCode, null);
  assert.equal(recovered.capabilities.lastError, null);
  assert.equal(recovered.capabilities.chatKeySource, 'OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY');
});

test('jarvis reply maps provider success, provider errors and timeouts', async () => {
  const success = await requestJarvisReply({
    workspaceRoot: '/tmp/workspace',
    prompt: 'antwoord kort',
    snapshot: null,
    selectedTaskId: null,
    workspaceState: null,
    conversationState: null,
    env: {
      OPENAI_API_KEY: 'sk-test',
      BUDIO_WORKSPACE_JARVIS_MODEL: 'gpt-test',
    },
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: 'SCOPE: workspace\n\nJarvis is live.',
              },
            },
          ],
        }),
        { status: 200 },
      ),
  });
  assert.equal(success.text, 'Jarvis is live.');
  assert.equal(success.sourceScope, 'workspace');
  assert.equal(success.providerSource, 'OPENAI_API_KEY');

  await assert.rejects(
    () =>
      requestJarvisReply({
        workspaceRoot: '/tmp/workspace',
        prompt: 'faal',
        snapshot: null,
        selectedTaskId: null,
        workspaceState: null,
        conversationState: null,
        env: {
          OPENAI_API_BUDIO_WORKSPACE_KEY: 'sk-test',
        },
        fetchImpl: async () => new Response('bad key', { status: 401 }),
      }),
    /Jarvis providerfout \(401, key OPENAI_API_BUDIO_WORKSPACE_KEY, model/,
  );

  await assert.rejects(
    () =>
      requestJarvisReply({
        workspaceRoot: '/tmp/workspace',
        prompt: 'timeout',
        snapshot: null,
        selectedTaskId: null,
        workspaceState: null,
        conversationState: null,
        env: {
          OPENAI_API_KEY: 'sk-test',
        },
        timeoutMs: 1,
        fetchImpl: ((_url, init) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          })) as typeof fetch,
      }),
    /Jarvis provider timeout/,
  );
});

test('jarvis transcription rejects empty or too-short audio before provider call', async () => {
  await assert.rejects(
    () =>
      transcribeJarvisAudio({
        workspaceRoot: '/tmp/workspace',
        audio: {
          audioBase64: '',
          mimeType: 'audio/webm',
          durationMs: 20,
        },
        env: {
          OPENAI_API_KEY: 'sk-test',
        },
        fetchImpl: async () => {
          throw new Error('fetch should not be called');
        },
      }),
    /Audio-opname is te kort of leeg/,
  );
});

function createBoardSnapshot(): BoardSnapshot {
  return {
    workspaceName: 'persoonlijke-assistent-app',
    workspacePath: '/tmp/workspace',
    tasksRoot: 'docs/project/25-tasks',
    epicsRoot: 'docs/project/24-epics',
    generatedAt: '2026-06-08T12:00:00.000Z',
    sort: 'manual',
    columns: [],
    epics: [],
    totalTasks: 2,
    openTaskCount: 2,
    doneTaskCount: 0,
    settings: {
      tasksRoot: 'docs/project/25-tasks',
      epicsRoot: 'docs/project/24-epics',
      jarvisAssetsRoot: 'assets/jarvis/final-frame',
      jarvisSeedManifest: 'tools/jarvis-luma/final-frame.seed.json',
      agentName: 'Codex',
      agentModel: 'unknown',
      agentRuntime: 'codex',
      agentSettings: 'default',
      columns: ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'],
      showDoneColumn: true,
      defaultSort: 'manual',
    },
    allCards: [
      {
        id: 'task-1',
        title: 'Polish board shell',
        status: 'ready',
        phase: 'transitiemaand-consumer-beta',
        priority: 'p2',
        tags: ['plugin'],
        workstream: 'plugin',
        epicId: null,
        parentTaskId: null,
        dependsOn: [],
        followsAfter: [],
        taskKind: 'task',
        subtaskIds: [],
        blockedByIds: [],
        blockingIds: [],
        isBlocked: false,
        isReadyToStart: true,
        dueDate: null,
        checklistProgress: { completed: 0, total: 0, open: 0 },
        summary: 'Werk de plugin-shell rustig bij.',
        excerpt: '',
        sortOrder: 1,
        checklist: [],
        sourcePath: '/tmp/workspace/task-1.md',
        relativePath: 'docs/project/25-tasks/open/task-1.md',
        folder: 'open',
        bucket: 'open',
        updatedAt: '2026-06-08',
        lastModified: '2026-06-08',
        hasBody: true,
        bodyPreview: '',
        detailPreviewSections: [],
        source: 'user-request',
        version: { mtimeMs: 1, hash: 'a' },
        activeAgent: null,
        activeAgentModel: null,
        activeAgentRuntime: null,
        activeAgentSince: null,
        activeAgentStatus: null,
        activeAgentSettings: null,
      },
      {
        id: 'task-2',
        title: 'Werkende Jarvis command room',
        status: 'in_progress',
        phase: 'transitiemaand-consumer-beta',
        priority: 'p2',
        tags: ['plugin', 'jarvis'],
        workstream: 'plugin',
        epicId: null,
        parentTaskId: null,
        dependsOn: [],
        followsAfter: [],
        taskKind: 'task',
        subtaskIds: [],
        blockedByIds: [],
        blockingIds: [],
        isBlocked: false,
        isReadyToStart: true,
        dueDate: null,
        checklistProgress: { completed: 1, total: 3, open: 2 },
        summary: 'Maak de Jarvis-view praatbaar.',
        excerpt: '',
        sortOrder: 2,
        checklist: [],
        sourcePath: '/tmp/workspace/task-2.md',
        relativePath: 'docs/project/25-tasks/open/task-2.md',
        folder: 'open',
        bucket: 'open',
        updatedAt: '2026-06-08',
        lastModified: '2026-06-08',
        hasBody: true,
        bodyPreview: '',
        detailPreviewSections: [],
        source: 'user-request',
        version: { mtimeMs: 1, hash: 'b' },
        activeAgent: null,
        activeAgentModel: null,
        activeAgentRuntime: null,
        activeAgentSince: null,
        activeAgentStatus: null,
        activeAgentSettings: null,
      },
    ],
  };
}

function createJarvisWorkspaceState(): JarvisWorkspaceState {
  return {
    status: 'ready',
    title: 'Jarvis Final Frame',
    generatedAt: '2026-06-08T12:00:00.000Z',
    assetsRoot: 'assets/jarvis/final-frame',
    seedManifestPath: 'tools/jarvis-luma/final-frame.seed.json',
    manifestPath: 'assets/jarvis/final-frame/jarvis-assets-manifest.json',
    reportPath: 'assets/jarvis/final-frame/download-report.json',
    keyFamily: 'luma-api',
    apiMode: 'agents',
    summary: {
      total: 20,
      ready: 17,
      downloaded: 0,
      manual_source_required: 0,
      seeded_text: 3,
      error: 0,
      cached: 0,
    },
    designTokens: {},
    commandRoom: {
      leftRail: {
        eyebrow: '',
        progressLabel: '',
        items: [],
      },
      rightRail: {
        eyebrow: '',
        items: [],
      },
      speakingSurface: '',
      commandBar: {
        placeholder: 'Vraag Jarvis wat nu aandacht nodig heeft...',
        contextChip: '',
      },
    },
    assets: [
      {
        seedAssetId: 'doc-1',
        logicalId: 'design-brief',
        role: 'design-brief',
        kind: 'text',
        expectedFilename: 'brief.txt',
        preferredMime: 'text/plain',
        status: 'ready',
        resolvedApi: 'manual',
        resolvedUrl: null,
        localPath: null,
        checksum: null,
        downloadedAt: null,
        failureReason: null,
        previewText: 'Deze command room moet een levendige intelligence-space zijn.',
        notes: null,
        webviewUri: null,
      },
      {
        seedAssetId: 'asset-1',
        logicalId: 'jarvis-core',
        role: 'center-core',
        kind: 'image',
        expectedFilename: 'jarvis-core.png',
        preferredMime: 'image/png',
        status: 'ready',
        resolvedApi: 'local',
        resolvedUrl: null,
        localPath: 'assets/jarvis/final-frame/jarvis-core.png',
        checksum: null,
        downloadedAt: null,
        failureReason: null,
        previewText: null,
        notes: null,
        webviewUri: null,
      },
    ],
    issues: [],
  };
}
