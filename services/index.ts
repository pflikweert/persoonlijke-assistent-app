// Service layer for API/data orchestration lives here.
export { getCurrentSession, onAuthStateChange, sendMagicLink, signOutUser } from './auth';
export {
  createEntryAudioSignedUrl,
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
export {
  refreshDerivedAfterCaptureInBackground,
  resumeCaptureEntryProcessing,
  submitAudioEntry,
  submitTextEntry,
} from './entries';
export {
  checkCaptureProcessingSession,
  clearCaptureProcessingSession,
  createCaptureProcessingSession,
  createClientProcessingId,
  loadCaptureProcessingSession,
  logCaptureProcessing,
  saveCaptureProcessingSession,
  updateCaptureProcessingSession,
  type CaptureProcessingRecoveryCheck,
  type CaptureProcessingSession,
} from './processing-recovery';
export { isChatGptMarkdownImportEnabled } from './feature-flags';
export { classifyUnknownError, FunctionFlowError } from './function-error';
export {
  ALL_DATE_SCOPE,
  describeDateScope,
  downloadUserArchive,
  listSelectableDays,
  listSelectableMonths,
  listSelectableWeeks,
  previewArchiveScope,
  type ArchiveExportPreview,
  type DateScope,
  type SelectableDay,
  type SelectablePeriod,
} from './export';
export { resetAllUserData } from './reset';
export {
  fetchAdminRegenerationJobStatus,
  fetchLatestAdminRegenerationJob,
  hasAdminRegenerationAccess,
  startAdminRegenerationJob,
} from './admin-regeneration';
export {
  createAdminAiQualityStudioDraftVersion,
  deleteAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioCompareView,
  fetchAdminOpenAiDebugStorageSettings,
  fetchAdminAiQualityStudioTestRun,
  fetchAdminAiQualityStudioTaskDetail,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
  importAdminAiQualityRuntimeBaseline,
  listAdminAiQualityStudioTestSources,
  runAdminAiQualityStudioPromptAssistPreview,
  runAdminAiQualityStudioTest,
  saveAdminAiQualityStudioTestReview,
  updateAdminOpenAiDebugStorageSettings,
  updateAdminAiQualityStudioDraftVersion,
} from './ai-quality-studio';
export {
  dismissImportBackgroundTaskNotice,
  fetchImportBackgroundTaskById,
  fetchLatestImportBackgroundTask,
  importChatGptMarkdownPreview,
  invokeMarkdownImport,
  invokeChatGptMarkdownImport,
  listPreviewDays,
  parseChatGptMarkdownFile,
  parseImportMarkdownFile,
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
export {
  getSessionSelectedDayDate,
  setSessionSelectedDayDate,
} from './day-selection-session';
export {
  fetchUserAudioPreferences,
  updateUserAudioPreferences,
  type UserAudioPreferences,
} from './user-preferences';
