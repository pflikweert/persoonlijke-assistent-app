// Service layer for API/data orchestration lives here.
export { getCurrentSession, onAuthStateChange, sendMagicLink } from './auth';
export { fetchTodayJournal, getUtcTodayDate, parseJournalSections } from './day-journals';
export { submitTextEntry } from './entries';
