import type { FlowName } from './error-contract.ts';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEventInput {
  flow: FlowName;
  requestId: string;
  flowId: string;
  step: string;
  event: string;
  details?: Record<string, unknown>;
}

export function logFlow(level: LogLevel, input: LogEventInput) {
  const payload = {
    flow: input.flow,
    requestId: input.requestId,
    flowId: input.flowId,
    step: input.step,
    event: input.event,
    ...(input.details ? { details: input.details } : {}),
  };

  if (level === 'error') {
    console.error(`[${input.flow}] ${input.event}`, payload);
    return;
  }

  if (level === 'warn') {
    console.warn(`[${input.flow}] ${input.event}`, payload);
    return;
  }

  console.info(`[${input.flow}] ${input.event}`, payload);
}
