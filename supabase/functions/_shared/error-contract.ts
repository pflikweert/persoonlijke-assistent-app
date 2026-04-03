export type FlowName =
  | 'process-entry'
  | 'generate-reflection'
  | 'regenerate-day-journal'
  | 'renormalize-entry'
  | 'import-chatgpt-markdown';

export type FlowErrorCode =
  | 'AUTH_MISSING'
  | 'AUTH_UNAUTHORIZED'
  | 'INPUT_INVALID'
  | 'PAYLOAD_TOO_LARGE'
  | 'UPSTREAM_UNAVAILABLE'
  | 'DB_READ_FAILED'
  | 'DB_WRITE_FAILED'
  | 'INTERNAL_UNEXPECTED';

export interface FlowErrorPayload {
  status: 'error';
  flow: FlowName;
  requestId: string;
  flowId: string;
  step: string;
  code: FlowErrorCode;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export function createFlowError(input: {
  flow: FlowName;
  requestId: string;
  flowId: string;
  step: string;
  code: FlowErrorCode;
  message: string;
  details?: Record<string, unknown>;
}): FlowErrorPayload {
  return {
    status: 'error',
    flow: input.flow,
    requestId: input.requestId,
    flowId: input.flowId,
    step: input.step,
    code: input.code,
    message: input.message,
    retryable: isRetryableCode(input.code),
    ...(input.details ? { details: input.details } : {}),
  };
}

export function isRetryableCode(code: FlowErrorCode): boolean {
  return code === 'UPSTREAM_UNAVAILABLE' || code === 'DB_READ_FAILED' || code === 'DB_WRITE_FAILED';
}
