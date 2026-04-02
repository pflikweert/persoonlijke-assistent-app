// Service layer for API/data orchestration lives here.
export { getCurrentSession, onAuthStateChange, sendMagicLink, signOutUser } from './auth';
export {
  deleteNormalizedEntryById,
  fetchDayJournalByDate,
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
  fetchLatestReflection,
  fetchRecentReflections,
  generateReflection,
  parseJsonStringArray,
} from './reflections';
