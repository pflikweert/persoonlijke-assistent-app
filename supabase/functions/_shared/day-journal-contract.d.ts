export type DayJournalEntryInput = {
  rawEntryId?: string;
  capturedAt?: string;
  title: string;
  body: string;
  summaryShort?: string;
};

export type DayJournalDraft = {
  summary: string;
  narrativeText: string;
  sections: string[];
};

export type FinalizedDayJournalDraft = DayJournalDraft & {
  usedFallback: boolean;
  usedFallbackSummary: boolean;
  usedFallbackSections: boolean;
  rejectionReasons: string[];
  hardRejectReasons: string[];
  narrativeHardRejectReasons: string[];
  softQualitySignals: string[];
  narrativeQualityReasons: string[];
  summaryFallbackReasons: string[];
  sectionFallbackReasons: string[];
};

export const DAY_JOURNAL_PROMPT_VERSION: string;

export function orderDayJournalEntries(entries: DayJournalEntryInput[]): DayJournalEntryInput[];
export function isLowContentDayEntry(
  entry: DayJournalEntryInput,
  options?: { noSpeechTranscript?: string; lowContentTitle?: string }
): boolean;
export function buildDayJournalPromptSpec(input: {
  journalDate: string;
  entries: DayJournalEntryInput[];
}): { promptVersion: string; systemPrompt: string; userPrompt: string };
export function buildDayJournalRepairPromptSpec(input: {
  journalDate: string;
  entries: DayJournalEntryInput[];
}): { promptVersion: string; systemPrompt: string; userPrompt: string };
export function createFallbackDayJournal(entries: DayJournalEntryInput[]): DayJournalDraft;
export function buildFallbackSummary(entries: DayJournalEntryInput[]): string;
export function finalizeDayJournalDraft(input: {
  aiResult: Record<string, unknown> | null;
  entries: DayJournalEntryInput[];
  options?: {
    noSpeechTranscript?: string;
    lowContentTitle?: string;
    strictValidation?: boolean;
    softQualityGuards?: boolean;
  };
}): FinalizedDayJournalDraft;
