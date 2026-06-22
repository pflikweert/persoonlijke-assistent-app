import type { BoardSnapshot, TaskCardViewModel } from '../tasks/types';
import type { JarvisConversationState, JarvisMessageSourceScope, JarvisWorkspaceState } from './types';
import { getJarvisEnvAvailability, type JarvisResolvedEnvAvailability } from './env';
import { summarizeJarvisAssetAvailability } from './assets';

const MAX_TEXT_ASSET_PREVIEW = 700;
const MAX_TASK_PREVIEW = 6;
const DEFAULT_CHAT_TIMEOUT_MS = 45000;

export interface JarvisReplyResult {
  text: string;
  sourceScope: JarvisMessageSourceScope;
  model: string;
  providerSource: string;
}

export function buildJarvisGroundingContext(args: {
  snapshot: BoardSnapshot | null;
  selectedTaskId: string | null;
  workspaceState: JarvisWorkspaceState | null;
  conversationState: JarvisConversationState | null;
}): string {
  const parts: string[] = [];

  if (args.snapshot) {
    parts.push(
      [
        `Workspace: ${args.snapshot.workspaceName}`,
        `Totaal taken: ${args.snapshot.totalTasks}`,
        `Open taken: ${args.snapshot.openTaskCount}`,
        `Done taken: ${args.snapshot.doneTaskCount}`,
        `Actieve sortering: ${args.snapshot.sort}`,
      ].join('\n'),
    );

    const selectedTask = args.snapshot.allCards.find((card) => card.id === args.selectedTaskId) ?? null;
    if (selectedTask) {
      parts.push(renderSelectedTaskContext(selectedTask));
    }

    const focusTasks = args.snapshot.allCards.slice(0, MAX_TASK_PREVIEW).map((task) => renderTaskSummary(task));
    if (focusTasks.length > 0) {
      parts.push(`Huidige taskcontext:\n- ${focusTasks.join('\n- ')}`);
    }
  }

  if (args.workspaceState) {
    const assetAvailability = summarizeJarvisAssetAvailability(args.workspaceState);
    parts.push(
      [
        `Jarvis assetstatus: ${args.workspaceState.status}`,
        `Jarvis assets beschikbaar: ${assetAvailability.available}/${assetAvailability.total}`,
        `Jarvis media ready: ${assetAvailability.ready}/${assetAvailability.total}`,
        `Jarvis seeded text-assets: ${assetAvailability.seededText}`,
        `Jarvis assets handmatige mapping nodig: ${assetAvailability.manualRequired}`,
        `Jarvis asset errors: ${assetAvailability.error}`,
        `Jarvis issues: ${assetAvailability.issues.length > 0 ? assetAvailability.issues.join(' | ') : 'geen'}`,
        `Sprint focus: ${args.workspaceState.commandRoom.leftRail.eyebrow || 'n.v.t.'}`,
        `Speaking surface seed: ${args.workspaceState.commandRoom.speakingSurface || 'n.v.t.'}`,
        `Command context chip: ${args.workspaceState.commandRoom.commandBar.contextChip || 'n.v.t.'}`,
      ].join('\n'),
    );

    const previews = args.workspaceState.assets
      .filter((asset) => asset.kind === 'text' && asset.previewText)
      .slice(0, 3)
      .map((asset) => `${asset.logicalId}: ${trimPreview(asset.previewText ?? '', MAX_TEXT_ASSET_PREVIEW)}`);

    if (previews.length > 0) {
      parts.push(`Lokale Jarvis docs:\n- ${previews.join('\n- ')}`);
    }
  }

  if (args.conversationState && args.conversationState.messages.length > 0) {
    const recentMessages = args.conversationState.messages.slice(-4).map((message) => {
      const role = message.role === 'assistant' ? 'Jarvis' : 'User';
      return `${role}: ${trimPreview(message.content, 240)}`;
    });
    parts.push(`Recente conversatie:\n- ${recentMessages.join('\n- ')}`);
  }

  return parts.filter(Boolean).join('\n\n');
}

export async function requestJarvisReply(args: {
  workspaceRoot: string;
  prompt: string;
  snapshot: BoardSnapshot | null;
  selectedTaskId: string | null;
  workspaceState: JarvisWorkspaceState | null;
  conversationState: JarvisConversationState | null;
  fetchImpl?: typeof fetch;
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
}): Promise<JarvisReplyResult> {
  const availability = getJarvisEnvAvailability(args.workspaceRoot, args.env);
  if (!availability.available) {
    throw new Error(availability.reason ?? 'Jarvis chat is niet beschikbaar.');
  }

  const systemPrompt = buildJarvisSystemPrompt();
  const grounding = buildJarvisGroundingContext({
    snapshot: args.snapshot,
    selectedTaskId: args.selectedTaskId,
    workspaceState: args.workspaceState,
    conversationState: args.conversationState,
  });

  const timeout = createTimeoutSignal(args.timeoutMs ?? DEFAULT_CHAT_TIMEOUT_MS);
  let response: Response;
  try {
    response = await (args.fetchImpl ?? fetch)('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: timeout.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${availability.env.chatApiKey}`,
      },
      body: JSON.stringify({
        model: availability.env.chatModel,
        temperature: 0.55,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Lokale workspacecontext:\n${grounding || 'Geen extra lokale context beschikbaar.'}\n\nVraag van de gebruiker:\n${args.prompt.trim()}`,
          },
        ],
      }),
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw new Error(`Jarvis provider timeout na ${Math.round((args.timeoutMs ?? DEFAULT_CHAT_TIMEOUT_MS) / 1000)}s.`);
    }
    throw error;
  } finally {
    timeout.dispose();
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Jarvis providerfout (${response.status}, key ${availability.env.chatApiKeySource ?? 'onbekend'}, model ${availability.env.chatModel}): ${trimPreview(errorText, 240)}`,
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | null;
      };
    }>;
  };

  const rawText = payload.choices?.[0]?.message?.content?.trim() ?? '';
  if (!rawText) {
    throw new Error('Jarvis gaf geen bruikbare response terug.');
  }

  const parsed = parseJarvisReply(rawText);
  return {
    text: parsed.text,
    sourceScope: parsed.sourceScope,
    model: availability.env.chatModel,
    providerSource: availability.env.chatApiKeySource ?? 'unknown',
  };
}

export function getJarvisChatAvailability(
  workspaceRoot: string,
  env: NodeJS.ProcessEnv = process.env,
): JarvisResolvedEnvAvailability {
  return getJarvisEnvAvailability(workspaceRoot, env);
}

function buildJarvisSystemPrompt() {
  return [
    'Je bent Budio Jarvis in een interne VS Code workspace-plugin.',
    'Antwoord standaard in het Nederlands, compact, bruikbaar en founder-oriented.',
    'Gebruik de lokale workspacecontext als primaire bron wanneer die relevant is.',
    'Als de vraag buiten de workspacecontext valt, benoem dat kort en geef daarna een algemene assistentreactie.',
    'Overdrijf niet wat je weet uit lokale context.',
    'Begin je antwoord altijd met precies één regel in dit formaat: SCOPE: workspace of SCOPE: general of SCOPE: hybrid',
    'Laat daarna een lege regel en dan pas je echte antwoord.',
  ].join(' ');
}

function parseJarvisReply(rawText: string): { sourceScope: JarvisMessageSourceScope; text: string } {
  const match = rawText.match(/^SCOPE:\s*(workspace|general|hybrid)\s*$/im);
  const scope = (match?.[1] as JarvisMessageSourceScope | undefined) ?? 'hybrid';
  const text = rawText.replace(/^SCOPE:\s*(workspace|general|hybrid)\s*$/im, '').trim();
  return {
    sourceScope: scope,
    text: text || rawText,
  };
}

function renderSelectedTaskContext(task: TaskCardViewModel) {
  return [
    `Geselecteerde task: ${task.title}`,
    `Status: ${task.status}`,
    `Prioriteit: ${task.priority}`,
    `Samenvatting: ${task.summary || task.excerpt || 'n.v.t.'}`,
  ].join('\n');
}

function renderTaskSummary(task: TaskCardViewModel) {
  return `${task.title} (${task.status}, ${task.priority})${task.summary ? ` — ${trimPreview(task.summary, 120)}` : ''}`;
}

function trimPreview(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    dispose: () => clearTimeout(timeout),
  };
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError';
}
