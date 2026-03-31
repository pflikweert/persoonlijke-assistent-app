export type AiFlowId =
  | 'transcription'
  | 'entry-normalization'
  | 'day-composition'
  | 'period-reflection';

export type AiContractVersion = 'v1';

export interface AiFlowMeta {
  contractVersion: AiContractVersion;
  flow: AiFlowId;
  requestId: string;
  promptVersion: string;
  stub: true;
}
