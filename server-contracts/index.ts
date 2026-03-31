// Shared contracts between app and backend services.
export type ServerContractVersion = 'v1';

export interface HealthCheckResponse {
  ok: boolean;
  version: ServerContractVersion;
}

export type {
  AiContractVersion,
  AiFlowId,
  AiFlowMeta,
  DayCompositionInput,
  DayCompositionOutput,
  EntryNormalizationInput,
  EntryNormalizationOutput,
  PeriodReflectionInput,
  PeriodReflectionOutput,
  TranscriptionInput,
  TranscriptionOutput,
} from './ai';
