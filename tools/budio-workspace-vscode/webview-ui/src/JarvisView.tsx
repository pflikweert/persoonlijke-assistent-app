import React from 'react';
import { buildJarvisWorkspaceAwareness, type JarvisWorkspaceAwareness } from '../../src/jarvis/awareness';
import { lastAssistantMessage } from '../../src/jarvis/conversation-state';
import type {
  JarvisAssetEntry,
  JarvisAudioPayload,
  JarvisConversationState,
  JarvisRuntimeStage,
  JarvisVoiceState,
  JarvisWorkspaceState,
} from '../../src/jarvis/types';
import type { BoardSnapshot } from '../../src/tasks/types';
import { useJarvisVoiceInput } from './useJarvisVoiceInput';

interface JarvisViewProps {
  state: JarvisWorkspaceState | null;
  snapshot: BoardSnapshot | null;
  conversationState: JarvisConversationState | null;
  draft: string;
  onDraftChange(nextValue: string): void;
  onSendPrompt(): void;
  onResetConversation(): void;
  onReloadJarvis(): void;
  onSyncAssets(): void;
  onOpenMicrophoneSettings(): void;
  onSubmitAudio(audio: JarvisAudioPayload): void;
  onVoiceStateChange(args: {
    voiceState: JarvisVoiceState;
    reason?: string | null;
    available?: boolean;
  }): void;
}

interface PromptAction {
  label: string;
  prompt: string;
}

export function JarvisView({
  state,
  snapshot,
  conversationState,
  draft,
  onDraftChange,
  onSendPrompt,
  onResetConversation,
  onReloadJarvis,
  onSyncAssets,
  onOpenMicrophoneSettings,
  onSubmitAudio,
  onVoiceStateChange,
}: JarvisViewProps): React.JSX.Element {
  const voice = useJarvisVoiceInput({
    onAudioReady: onSubmitAudio,
    onVoiceStateChange,
  });

  if (!state) {
    return <div className="state-shell">Jarvis laden...</div>;
  }

  const awareness = buildJarvisWorkspaceAwareness(snapshot);
  const core = findAsset(state.assets, 'center-core');
  const waveform = findAsset(state.assets, 'waveform-icon');
  const wordmark = findAsset(state.assets, 'wordmark');
  const ambientLoop = findAsset(state.assets, 'ambient-loop');
  const hudSprites = findAsset(state.assets, 'hud-sprite-sheet');
  const chatState = conversationState?.chatState ?? 'idle';
  const voiceState = conversationState?.voiceState ?? 'idle';
  const messages = conversationState?.messages ?? [];
  const visibleMessages = messages.slice(-8);
  const assistantMessage = lastAssistantMessage(messages);
  const promptActions = buildPromptActions(awareness, state, conversationState);
  const primaryNotice = buildPrimaryNotice(conversationState);
  const stageNotice = conversationState?.lastRuntimeStage ? runtimeStageCopy(conversationState.lastRuntimeStage) : null;
  const voiceAvailability = describeVoiceAvailability(voiceState, voice.supported, voice.supportReason);
  const liveStatus = describeLiveStatus(chatState, voiceState, conversationState);
  const assetReadyCount = state.summary.ready + state.summary.downloaded + state.summary.seeded_text;
  const canSend = draft.trim().length > 0 && chatState !== 'thinking' && chatState !== 'answering' && voiceState !== 'transcribing';
  const hasActiveSignal = chatState === 'thinking' || chatState === 'answering' || voiceState === 'recording' || voiceState === 'transcribing';
  const micLabel = buildMicButtonLabel(voice.recording, voiceState);

  return (
    <section
      className={`jarvis-shell jarvis-chat-shell jarvis-status-${state.status} jarvis-chat-${chatState} jarvis-voice-${voiceState} ${
        hasActiveSignal ? 'jarvis-has-active-signal' : ''
      }`}
    >
      <div className="jarvis-chat-atmosphere" aria-hidden="true" />
      {ambientLoop?.webviewUri ? (
        <video className="jarvis-chat-video" src={ambientLoop.webviewUri} autoPlay muted loop playsInline />
      ) : null}
      {hudSprites?.webviewUri ? <img className="jarvis-chat-hud" src={hudSprites.webviewUri} alt="" aria-hidden="true" /> : null}

      <div className="jarvis-chat-frame">
        <header className="jarvis-chat-header">
          <div className="jarvis-chat-brand">
            {wordmark?.webviewUri ? <img className="jarvis-chat-wordmark" src={wordmark.webviewUri} alt="Budio" /> : null}
            <span className="jarvis-chat-lettermark">J.A.R.V.I.S</span>
            <span className={`jarvis-chat-live ${conversationState?.capabilities.chatAvailable ? 'is-live' : 'is-muted'}`}>
              {conversationState?.capabilities.chatAvailable ? 'online' : 'diagnose'}
            </span>
          </div>
          <div className="jarvis-chat-actions" aria-label="Jarvis acties">
            <button type="button" className="ghost-button jarvis-chat-action" onClick={onResetConversation}>
              Reset
            </button>
            <button type="button" className="ghost-button jarvis-chat-action" onClick={onReloadJarvis}>
              Reload
            </button>
            <button type="button" className="ghost-button jarvis-chat-action" onClick={onSyncAssets}>
              Sync
            </button>
          </div>
        </header>

        <main className="jarvis-chat-main" aria-label="Jarvis gesprek">
          <div className="jarvis-chat-core-scene" aria-hidden="true">
            <div className="jarvis-chat-core-glow" />
            <div className="jarvis-chat-core-ring jarvis-chat-core-ring-outer" />
            <div className="jarvis-chat-core-ring jarvis-chat-core-ring-inner" />
            {core?.webviewUri ? (
              <img className="jarvis-chat-core-image" src={core.webviewUri} alt="" />
            ) : (
              <div className="jarvis-chat-core-fallback">Jarvis</div>
            )}
          </div>

          <section className="jarvis-chat-hero">
            <div className="jarvis-chat-utterance">
              <div className="jarvis-chat-wave">
                {waveform?.webviewUri ? <img src={waveform.webviewUri} alt="" /> : <span>~</span>}
              </div>
              <p>{assistantMessage?.content || realConversationEmptyCopy(conversationState)}</p>
            </div>

            <div className="jarvis-chat-log">
              {visibleMessages.length > 0 ? (
                visibleMessages.map((message) => (
                  <article key={message.id} className={`jarvis-chat-message jarvis-chat-message-${message.role}`}>
                    <p>{message.content}</p>
                  </article>
                ))
              ) : (
                <article className="jarvis-chat-message jarvis-chat-message-assistant">
                  <p>{realConversationEmptyCopy(conversationState)}</p>
                </article>
              )}
            </div>
          </section>

          <section className="jarvis-chat-command" aria-label="Command deck">
            <form
              className="jarvis-chat-form"
              onSubmit={(event) => {
                event.preventDefault();
                onSendPrompt();
              }}
            >
              <input
                className="jarvis-chat-input"
                value={draft}
                onChange={(event) => onDraftChange(event.target.value)}
                placeholder={state.commandRoom.commandBar.placeholder || 'Vraag Jarvis iets...'}
              />
              <button
                type="button"
                className={`ghost-button jarvis-chat-mic ${voice.recording ? 'active' : ''}`}
                onClick={() => {
                  if (voice.recording) {
                    voice.stopRecording();
                  } else {
                    void voice.startRecording();
                  }
                }}
                disabled={voiceState === 'transcribing'}
                title={voice.supported ? micLabel : (voice.supportReason ?? 'Mic niet beschikbaar')}
              >
                {micLabel}
              </button>
              <button type="submit" className="primary-button jarvis-chat-send" disabled={!canSend}>
                Verstuur
              </button>
            </form>

            <div className="jarvis-chat-status-strip" aria-label="Jarvis status">
              <span className="jarvis-chat-chip">{describeChatAvailabilityShort(conversationState)}</span>
              <span className={`jarvis-chat-chip ${voiceState === 'permission_needed' || voiceState === 'unavailable' ? 'needs-attention' : ''}`}>
                {voiceAvailability}
              </span>
              <span className="jarvis-chat-chip">Assets {assetReadyCount}/{state.summary.total}</span>
              {awareness.activeAgents.length > 0 ? <span className="jarvis-chat-chip">{awareness.activeAgents.length} agents actief</span> : null}
              {stageNotice ? <span className="jarvis-chat-chip">{stageNotice}</span> : null}
            </div>

            {primaryNotice ? (
              <div className="jarvis-chat-notice">
                <span>{primaryNotice}</span>
                {voiceState === 'permission_needed' ? (
                  <button type="button" className="ghost-button jarvis-chat-notice-action" onClick={onOpenMicrophoneSettings}>
                    Microfooninstellingen
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="jarvis-chat-prompts" aria-label="Snelle prompts">
              {promptActions.map((action) => (
                <button key={action.label} type="button" className="jarvis-chat-prompt" onClick={() => onDraftChange(action.prompt)}>
                  {action.label}
                </button>
              ))}
            </div>
          </section>
        </main>

        <details className="jarvis-chat-details">
          <summary>Context</summary>
          <div className="jarvis-chat-detail-grid">
            <span>{awareness.loaded ? `${awareness.openTaskCount} open · ${awareness.doneTaskCount}/${awareness.totalTasks} done` : 'Workspace laden'}</span>
            <span>{state.issues.length > 0 ? state.issues[0] : 'Assets klaar'}</span>
            <span>{liveStatus}</span>
            {awareness.generatedAt ? <span>Snapshot {formatSnapshotTime(awareness.generatedAt)}</span> : null}
          </div>
        </details>
      </div>
    </section>
  );
}

function findAsset(assets: JarvisAssetEntry[], role: string) {
  return assets.find((asset) => asset.role === role) ?? null;
}

function describeLiveStatus(
  chatState: JarvisConversationState['chatState'],
  voiceState: JarvisConversationState['voiceState'],
  conversationState: JarvisConversationState | null,
) {
  if (voiceState === 'recording') {
    return 'Opnemen';
  }
  if (voiceState === 'transcribing') {
    return 'Transcriberen';
  }
  if (chatState === 'thinking' || chatState === 'answering') {
    return conversationState?.lastRuntimeStage === 'provider_call_started' ? 'Provider' : 'Antwoorden';
  }
  if (chatState === 'error') {
    return 'Fout';
  }
  if (conversationState && !conversationState.capabilities.chatAvailable) {
    return 'Diagnose';
  }
  return 'Klaar';
}

function runtimeStageCopy(stage: JarvisRuntimeStage) {
  const copy: Record<JarvisRuntimeStage, string> = {
    queued: 'Ontvangen',
    host_received: 'Host actief',
    env_resolved: 'Keyroute klaar',
    transcribing: 'Transcriptie loopt',
    transcribed: 'Transcript klaar',
    grounding_ready: 'Context klaar',
    provider_call_started: 'Provider denkt',
    provider_response_received: 'Antwoord ontvangen',
    completed: 'Antwoord klaar',
    failed: 'Mislukt',
  };
  return copy[stage];
}

function buildPrimaryNotice(conversationState: JarvisConversationState | null) {
  if (!conversationState) {
    return null;
  }
  if (!conversationState.capabilities.chatAvailable) {
    return conversationState.capabilities.chatAvailabilityReason;
  }
  if (conversationState.voiceState === 'permission_needed') {
    return conversationState.capabilities.voiceAvailabilityReason ?? conversationState.capabilities.lastError;
  }
  if (conversationState.voiceState === 'unavailable') {
    return conversationState.capabilities.voiceAvailabilityReason;
  }
  return conversationState.capabilities.lastError;
}

function describeChatAvailabilityShort(conversationState: JarvisConversationState | null) {
  if (!conversationState) {
    return 'Chat laden';
  }
  return conversationState.capabilities.chatAvailable ? 'Chat live' : 'Chat offline';
}

function describeVoiceAvailability(
  voiceState: JarvisConversationState['voiceState'],
  supported: boolean,
  supportReason: string | null,
) {
  if (voiceState === 'recording') {
    return 'Mic neemt op';
  }
  if (voiceState === 'transcribing') {
    return 'Mic transcribeert';
  }
  if (voiceState === 'permission_needed') {
    return 'Mic rechten nodig';
  }
  if (!supported || voiceState === 'unavailable') {
    return supportReason ? 'Mic niet beschikbaar' : 'Mic offline';
  }
  return 'Mic klaar';
}

function buildMicButtonLabel(recording: boolean, voiceState: JarvisVoiceState) {
  if (recording) {
    return 'Stop';
  }
  if (voiceState === 'transcribing') {
    return 'Luistert...';
  }
  return 'Mic';
}

function realConversationEmptyCopy(conversationState: JarvisConversationState | null) {
  if (!conversationState) {
    return 'Jarvis laadt de lokale workspace.';
  }
  if (!conversationState.capabilities.chatAvailable) {
    return 'Jarvis wacht op een geldige lokale chat key.';
  }
  if (conversationState.voiceState === 'transcribing') {
    return 'Audio wordt getranscribeerd.';
  }
  if (conversationState.chatState === 'thinking' || conversationState.chatState === 'answering') {
    return 'Jarvis verwerkt je vraag.';
  }
  return 'Vraag Jarvis iets over deze workspace.';
}

function buildPromptActions(
  awareness: JarvisWorkspaceAwareness,
  state: JarvisWorkspaceState,
  conversationState: JarvisConversationState | null,
): PromptAction[] {
  const focus = awareness.focusItems[0];
  const actions: PromptAction[] = [];
  if (focus) {
    actions.push({
      label: 'Volgende stap',
      prompt: `Bekijk deze workspace en geef de eerstvolgende praktische stap voor "${focus.title}".`,
    });
  }
  actions.push({
    label: 'Workspace scan',
    prompt: 'Geef een korte workspace-scan: wat is belangrijk, wat is geblokkeerd en wat moet ik nu doen?',
  });
  if (awareness.activeAgents.length > 0) {
    actions.push({
      label: 'Agentstatus',
      prompt: 'Welke agents zijn nu actief en wat betekent dat voor mijn volgende beslissing?',
    });
  }
  if (state.issues.length > 0) {
    actions.push({
      label: 'Asset check',
      prompt: 'Leg de huidige Jarvis assetstatus kort uit en noem alleen echte issues.',
    });
  }
  if (conversationState?.messages.length) {
    actions.push({
      label: 'Samenvatten',
      prompt: 'Vat ons gesprek samen en maak er een compacte actielijst van.',
    });
  }
  return actions.slice(0, 4);
}

function formatSnapshotTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}
