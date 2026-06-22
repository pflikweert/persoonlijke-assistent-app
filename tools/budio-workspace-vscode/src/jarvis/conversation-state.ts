import type {
  JarvisConversationMessage,
  JarvisConversationState,
  JarvisErrorCode,
  JarvisInputMode,
  JarvisMessageSourceScope,
  JarvisRuntimeStage,
  JarvisVoiceState,
} from './types';

export function createJarvisConversationState(args?: {
  chatAvailable?: boolean;
  voiceAvailable?: boolean;
  inputMode?: JarvisInputMode;
  lastError?: string | null;
  chatAvailabilityReason?: string | null;
  voiceAvailabilityReason?: string | null;
}): JarvisConversationState {
  return {
    messages: [],
    chatState: 'idle',
    voiceState: 'idle',
    pendingRequestId: null,
    lastRuntimeStage: null,
    lastProviderSource: null,
    lastErrorCode: null,
    capabilities: {
      chatAvailable: args?.chatAvailable ?? false,
      voiceAvailable: args?.voiceAvailable ?? false,
      inputMode: args?.inputMode ?? 'typed',
      lastError: args?.lastError ?? null,
      chatAvailabilityReason: args?.chatAvailabilityReason ?? null,
      voiceAvailabilityReason: args?.voiceAvailabilityReason ?? null,
      chatKeySource: null,
      chatModel: null,
      chatEnvFilePath: null,
    },
  };
}

export function syncJarvisConversationCapabilities(
  state: JarvisConversationState,
  patch: Partial<JarvisConversationState['capabilities']>,
): JarvisConversationState {
  return {
    ...state,
    capabilities: {
      ...state.capabilities,
      ...patch,
    },
  };
}

export function recoverJarvisAvailability(
  state: JarvisConversationState,
  patch: Partial<JarvisConversationState['capabilities']>,
): JarvisConversationState {
  const next = syncJarvisConversationCapabilities(state, {
    ...patch,
    lastError: patch.chatAvailable ? null : patch.lastError,
  });

  if (!patch.chatAvailable || next.chatState !== 'error' || next.pendingRequestId) {
    return next;
  }

  return {
    ...next,
    chatState: 'idle',
    lastRuntimeStage: null,
    lastErrorCode: null,
  };
}

export function setJarvisVoiceState(
  state: JarvisConversationState,
  voiceState: JarvisVoiceState,
  reason?: string | null,
): JarvisConversationState {
  return {
    ...state,
    lastRuntimeStage: voiceState === 'transcribing' ? 'transcribing' : state.lastRuntimeStage,
    voiceState,
    capabilities: {
      ...state.capabilities,
      inputMode: voiceState === 'recording' || voiceState === 'transcribing' ? 'voice' : state.capabilities.inputMode,
      voiceAvailabilityReason: reason === undefined ? state.capabilities.voiceAvailabilityReason : reason,
      lastError:
        reason !== undefined && reason !== null
          ? reason
          : voiceState === 'permission_needed' || voiceState === 'unavailable'
            ? reason ?? state.capabilities.lastError
            : state.capabilities.lastError,
    },
  };
}

export function appendJarvisUserMessage(
  state: JarvisConversationState,
  args: {
    content: string;
    inputMode?: JarvisInputMode;
    clientRequestId?: string;
    timestamp?: string;
  },
): JarvisConversationState {
  const timestamp = args.timestamp ?? new Date().toISOString();
  const messageId = args.clientRequestId ? `user-${args.clientRequestId}` : `user-${timestamp}`;
  const nextMessages = upsertMessage(state.messages, {
    id: messageId,
    role: 'user',
    content: args.content,
    timestamp,
    sourceScope: 'workspace',
    status: 'complete',
  });

  return {
    ...state,
    chatState: 'thinking',
    pendingRequestId: args.clientRequestId ?? state.pendingRequestId ?? null,
    lastRuntimeStage: args.clientRequestId ? 'queued' : state.lastRuntimeStage,
    lastErrorCode: null,
    voiceState: args.inputMode === 'voice' ? 'idle' : state.voiceState,
    capabilities: {
      ...state.capabilities,
      inputMode: args.inputMode ?? 'typed',
      lastError: null,
    },
    messages: nextMessages,
  };
}

export function appendJarvisAssistantMessage(
  state: JarvisConversationState,
  args: {
    messageId: string;
    content: string;
    timestamp?: string;
    sourceScope?: JarvisMessageSourceScope;
    clientRequestId?: string;
    providerSource?: string | null;
  },
): JarvisConversationState {
  const nextMessages = [...state.messages];
  const existingIndex = nextMessages.findIndex((message) => message.id === args.messageId);
  const timestamp = args.timestamp ?? new Date().toISOString();
  const nextMessage: JarvisConversationMessage = {
    id: args.messageId,
    role: 'assistant',
    content: args.content,
    timestamp,
    sourceScope: args.sourceScope ?? 'hybrid',
    status: 'complete',
  };

  if (existingIndex >= 0) {
    nextMessages[existingIndex] = nextMessage;
  } else {
    nextMessages.push(nextMessage);
  }

  return {
    ...state,
    chatState: 'idle',
    pendingRequestId:
      args.clientRequestId && state.pendingRequestId === args.clientRequestId
        ? null
        : state.pendingRequestId,
    lastRuntimeStage: 'completed',
    lastProviderSource: args.providerSource ?? state.lastProviderSource ?? null,
    lastErrorCode: null,
    capabilities: {
      ...state.capabilities,
      lastError: null,
    },
    messages: nextMessages,
  };
}

export function completeJarvisAssistantMessage(
  state: JarvisConversationState,
  messageId: string,
  sourceScope?: JarvisMessageSourceScope,
): JarvisConversationState {
  return {
    ...state,
    chatState: 'idle',
    lastRuntimeStage: 'completed',
    messages: state.messages.map((message) =>
      message.id === messageId
        ? {
            ...message,
            sourceScope: sourceScope ?? message.sourceScope,
            status: 'complete',
          }
        : message,
    ),
  };
}

export function setJarvisChatState(
  state: JarvisConversationState,
  chatState: JarvisConversationState['chatState'],
): JarvisConversationState {
  return {
    ...state,
    chatState,
  };
}

export function setJarvisRuntimeStage(
  state: JarvisConversationState,
  args: {
    clientRequestId?: string | null;
    stage: JarvisRuntimeStage;
    message?: string | null;
    providerSource?: string | null;
    errorCode?: JarvisErrorCode | null;
  },
): JarvisConversationState {
  return {
    ...state,
    chatState:
      args.stage === 'provider_call_started' || args.stage === 'grounding_ready'
        ? 'thinking'
        : args.stage === 'provider_response_received'
          ? 'answering'
          : args.stage === 'completed'
            ? 'idle'
          : args.stage === 'failed'
            ? 'error'
            : state.chatState,
    voiceState:
      args.stage === 'transcribing'
        ? 'transcribing'
        : args.stage === 'transcribed'
          ? 'idle'
          : state.voiceState,
    pendingRequestId: args.clientRequestId ?? state.pendingRequestId ?? null,
    lastRuntimeStage: args.stage,
    lastProviderSource: args.providerSource ?? state.lastProviderSource ?? null,
    lastErrorCode: args.errorCode ?? state.lastErrorCode ?? null,
    capabilities: {
      ...state.capabilities,
      lastError: args.message ?? state.capabilities.lastError,
    },
  };
}

export function failJarvisConversation(
  state: JarvisConversationState,
  message: string,
  target: 'chat' | 'voice' = 'chat',
  args?: {
    clientRequestId?: string | null;
    errorCode?: JarvisErrorCode;
    stage?: JarvisRuntimeStage;
  },
): JarvisConversationState {
  return {
    ...state,
    chatState: target === 'chat' ? 'error' : state.chatState,
    voiceState: target === 'voice' ? 'permission_needed' : state.voiceState,
    pendingRequestId:
      args?.clientRequestId && state.pendingRequestId === args.clientRequestId
        ? null
        : state.pendingRequestId,
    lastRuntimeStage: args?.stage ?? 'failed',
    lastErrorCode: args?.errorCode ?? 'unknown',
    capabilities: {
      ...state.capabilities,
      lastError: message,
    },
  };
}

export function resetJarvisConversation(state: JarvisConversationState): JarvisConversationState {
  return {
    ...state,
    messages: [],
    chatState: 'idle',
    voiceState: state.capabilities.voiceAvailable ? 'idle' : 'unavailable',
    pendingRequestId: null,
    lastRuntimeStage: null,
    lastProviderSource: null,
    lastErrorCode: null,
    capabilities: {
      ...state.capabilities,
      inputMode: 'typed',
      lastError: null,
    },
  };
}

export function mergeHydratedJarvisConversationState(
  previous: JarvisConversationState | null,
  incoming: JarvisConversationState,
): JarvisConversationState {
  if (!previous) {
    return incoming;
  }

  return {
    ...incoming,
    messages: mergeConversationMessages(previous, incoming),
    pendingRequestId: incoming.pendingRequestId ?? previous.pendingRequestId ?? null,
    lastRuntimeStage: incoming.lastRuntimeStage ?? previous.lastRuntimeStage ?? null,
    lastProviderSource: incoming.lastProviderSource ?? previous.lastProviderSource ?? null,
    lastErrorCode: incoming.lastErrorCode ?? previous.lastErrorCode ?? null,
    capabilities: {
      ...incoming.capabilities,
      voiceAvailable: incoming.capabilities.voiceAvailable || previous.capabilities.voiceAvailable,
      voiceAvailabilityReason: incoming.capabilities.voiceAvailabilityReason ?? previous.capabilities.voiceAvailabilityReason,
      lastError: incoming.capabilities.lastError ?? previous.capabilities.lastError,
    },
  };
}

export function lastAssistantMessage(messages: JarvisConversationMessage[]) {
  return [...messages].reverse().find((message) => message.role === 'assistant') ?? null;
}

function upsertMessage(
  messages: JarvisConversationMessage[],
  message: JarvisConversationMessage,
): JarvisConversationMessage[] {
  const index = messages.findIndex((candidate) => candidate.id === message.id);
  if (index < 0) {
    return [...messages, message];
  }

  const nextMessages = [...messages];
  nextMessages[index] = message;
  return nextMessages;
}

function mergeConversationMessages(
  previous: JarvisConversationState,
  incoming: JarvisConversationState,
): JarvisConversationMessage[] {
  const incomingIds = new Set(incoming.messages.map((message) => message.id));
  const pendingRequestId = previous.pendingRequestId ?? incoming.pendingRequestId ?? null;
  const preservedPendingMessages = pendingRequestId
    ? previous.messages.filter(
        (message) =>
          !incomingIds.has(message.id) &&
          (message.id === `user-${pendingRequestId}` || message.id === `assistant-${pendingRequestId}`),
      )
    : [];

  return [...incoming.messages, ...preservedPendingMessages];
}
