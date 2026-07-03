import type { TaskFieldPatch, WorkspaceSettings } from './types';

export type AgentSettingsInput = Pick<
  WorkspaceSettings,
  'agentName' | 'agentModel' | 'agentRuntime' | 'agentSettings'
>;

export const DEFAULT_AGENT_SETTINGS: AgentSettingsInput = {
  agentName: 'Codex',
  agentModel: 'gpt-5',
  agentRuntime: 'codex',
  agentSettings: 'default',
};

export type AgentClearReason = 'done' | 'blocked' | 'handoff' | 'stopped';

export interface AgentActivitySnapshot {
  activeAgent: string | null;
  activeAgentModel: string | null;
  activeAgentRuntime: string | null;
  activeAgentSince: string | null;
  activeAgentSettings: string | null;
}

export function buildClaimTaskAgentPatch(
  settings: AgentSettingsInput,
  now = new Date(),
): TaskFieldPatch {
  const timestamp = now.toISOString();

  return {
    activeAgent: cleanSetting(settings.agentName, 'Codex'),
    activeAgentModel: cleanSetting(settings.agentModel, 'gpt-5'),
    activeAgentRuntime: cleanSetting(settings.agentRuntime, 'codex'),
    activeAgentSince: timestamp,
    activeAgentStatus: 'running',
    activeAgentSettings: cleanSetting(settings.agentSettings, 'default'),
    updatedAt: timestamp.slice(0, 10),
    agentActivityEntry: buildStartEntry({
      activeAgent: cleanSetting(settings.agentName, 'Codex'),
      activeAgentModel: cleanSetting(settings.agentModel, 'gpt-5'),
      activeAgentRuntime: cleanSetting(settings.agentRuntime, 'codex'),
      activeAgentSince: timestamp,
      activeAgentSettings: cleanSetting(settings.agentSettings, 'default'),
    }),
  };
}

export function buildClearTaskAgentPatch(
  now = new Date(),
  snapshot?: AgentActivitySnapshot,
  reason: AgentClearReason = 'stopped',
): TaskFieldPatch {
  return {
    activeAgent: null,
    activeAgentModel: null,
    activeAgentRuntime: null,
    activeAgentSince: null,
    activeAgentStatus: null,
    activeAgentSettings: null,
    updatedAt: now.toISOString().slice(0, 10),
    agentActivityEntry: snapshot ? buildStopEntry(snapshot, now, reason) : null,
  };
}

function cleanSetting(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function buildStartEntry(snapshot: Required<AgentActivitySnapshot>): string {
  return `- start ${snapshot.activeAgentSince} - ${snapshot.activeAgent} / ${snapshot.activeAgentModel} / ${snapshot.activeAgentRuntime} / ${snapshot.activeAgentSettings}`;
}

function buildStopEntry(snapshot: AgentActivitySnapshot, now: Date, reason: AgentClearReason): string {
  return `- stop ${snapshot.activeAgentSince ?? 'unknown'} -> ${now.toISOString()} - ${snapshot.activeAgent ?? 'unknown'} / ${
    snapshot.activeAgentModel ?? 'unknown'
  } / ${snapshot.activeAgentRuntime ?? 'unknown'} / ${snapshot.activeAgentSettings ?? 'unknown'} - reason: ${reason}`;
}
