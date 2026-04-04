// Service layer for API/data orchestration lives here.
export { getCurrentSession, onAuthStateChange, sendMagicLink, signOutUser } from './auth';
export {
  deleteNormalizedEntryById,
  fetchDayJournalByDate,
  fetchNormalizedEntryById,
  fetchRecentNormalizedEntries,
  fetchNormalizedEntriesByDate,
  fetchRecentDayJournals,
  fetchTodayJournal,
  getUtcTodayDate,
  isValidJournalDate,
  parseJournalSections,
  regenerateDayJournalByDate,
  updateNormalizedEntryById,
} from './day-journals';
export { refreshDerivedAfterCaptureInBackground, submitAudioEntry, submitTextEntry } from './entries';
export { isChatGptMarkdownImportEnabled } from './feature-flags';
export { classifyUnknownError, FunctionFlowError } from './function-error';
export {
  fetchAdminRegenerationJobStatus,
  startAdminRegenerationJob,
} from './admin-regeneration';
export {
  importChatGptMarkdownPreview,
  invokeChatGptMarkdownImport,
  listPreviewDays,
  parseChatGptMarkdownFile,
  refreshImportedChatGptDerivedContent,
  summarizePreviewDate,
} from './import';
export {
  fetchLatestReflection,
  fetchReflectionForAnchorDate,
  hasReflectionForAnchorDate,
  fetchRecentReflections,
  fetchRecentReflectionsByType,
  generateReflection,
  parseJsonStringArray,
} from './reflections';
