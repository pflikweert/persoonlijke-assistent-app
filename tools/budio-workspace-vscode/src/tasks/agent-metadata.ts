import type { TaskFieldPatch, WorkspaceSettings } from './types';

export type AgentSettingsInput = Pick<
  WorkspaceSettings,
  'agentName' | 'agentModel' | 'agentRuntime' | 'agentSettings'
>;

export const DEFAULT_AGENT_SETTINGS: AgentSettingsInput = {
  agentName: 'Codex',
  agentModel: 'unknown',
  agentRuntime: 'codex',
  agentSettings: 'default',
};

export function buildClaimTaskAgentPatch(
  settings: AgentSettingsInput,
  now = new Date(),
): TaskFieldPatch {
  const timestamp = now.toISOString();

  return {
    activeAgent: cleanSetting(settings.agentName, 'Codex'),
    activeAgentModel: cleanSetting(settings.agentModel, 'unknown'),
    activeAgentRuntime: cleanSetting(settings.agentRuntime, 'codex'),
    activeAgentSince: timestamp,
    activeAgentStatus: 'running',
    activeAgentSettings: cleanSetting(settings.agentSettings, 'default'),
    updatedAt: timestamp.slice(0, 10),
  };
}

export function buildClearTaskAgentPatch(now = new Date()): TaskFieldPatch {
  return {
    activeAgent: null,
    activeAgentModel: null,
    activeAgentRuntime: null,
    activeAgentSince: null,
    activeAgentStatus: null,
    activeAgentSettings: null,
    updatedAt: now.toISOString().slice(0, 10),
  };
}

function cleanSetting(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
