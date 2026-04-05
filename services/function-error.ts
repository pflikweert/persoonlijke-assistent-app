export type FunctionErrorCode =
  | 'AUTH_MISSING'
  | 'AUTH_UNAUTHORIZED'
  | 'INPUT_INVALID'
  | 'PAYLOAD_TOO_LARGE'
  | 'UPSTREAM_UNAVAILABLE'
  | 'DB_READ_FAILED'
  | 'DB_WRITE_FAILED'
  | 'INTERNAL_UNEXPECTED';

export interface FunctionErrorPayload {
  status: 'error';
  flow:
    | 'process-entry'
    | 'generate-reflection'
    | 'regenerate-day-journal'
    | 'renormalize-entry'
    | 'import-chatgpt-markdown'
    | 'admin-regeneration-job';
  requestId: string;
  flowId: string;
  step: string;
  code: FunctionErrorCode;
  message: string;
  retryable: boolean;
}

export class FunctionFlowError extends Error {
  readonly payload: FunctionErrorPayload;

  constructor(payload: FunctionErrorPayload) {
    super(payload.message);
    this.name = 'FunctionFlowError';
    this.payload = payload;
  }
}

export function createClientFlowId(
  prefix:
    | 'capture-text'
    | 'capture-audio'
    | 'reflection'
    | 'day-regenerate'
    | 'entry-renormalize'
    | 'import-chatgpt'
    | 'admin-regeneration'
    | 'export-archive'
): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now()}-${random}`;
}

export function isFunctionErrorPayload(value: unknown): value is FunctionErrorPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<FunctionErrorPayload>;

  return (
    candidate.status === 'error' &&
    typeof candidate.flow === 'string' &&
    typeof candidate.requestId === 'string' &&
    typeof candidate.flowId === 'string' &&
    typeof candidate.step === 'string' &&
    typeof candidate.code === 'string' &&
    typeof candidate.message === 'string' &&
    typeof candidate.retryable === 'boolean'
  );
}

export function classifyUnknownError(error: unknown): {
  message: string;
  retryable: boolean;
  requestId: string | null;
  code: string | null;
} {
  if (error instanceof FunctionFlowError) {
    return {
      message: error.payload.message,
      retryable: error.payload.retryable,
      requestId: error.payload.requestId,
      code: error.payload.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      retryable: true,
      requestId: null,
      code: null,
    };
  }

  return {
    message: 'Onbekende fout opgetreden.',
    retryable: true,
    requestId: null,
    code: null,
  };
}
