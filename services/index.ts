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
export { submitAudioEntry, submitTextEntry } from './entries';
export { classifyUnknownError, FunctionFlowError } from './function-error';
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
  hasReflectionForAnchorDate,
  fetchRecentReflections,
  fetchRecentReflectionsByType,
  generateReflection,
  parseJsonStringArray,
} from './reflections';
