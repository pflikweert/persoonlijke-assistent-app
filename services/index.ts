// Service layer for API/data orchestration lives here.
export { getCurrentSession, onAuthStateChange, sendMagicLink } from './auth';
export {
  deleteNormalizedEntryById,
  fetchDayJournalByDate,
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
