import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmSheet } from "@/components/feedback/destructive-confirm-sheet";
import { ProcessingScreen } from "@/components/feedback/processing-screen";
import { TextEntryEditor } from "@/components/feedback/text-entry-editor";
import { ThemedText } from "@/components/themed-text";
import { NoticeCard } from "@/components/ui/notice-card";
import {
  CaptureBackHeader,
  CaptureErrorStack,
} from "@/components/ui/capture-screen-primitives";
import {
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import {
  classifyUnknownError,
  checkCaptureProcessingSession,
  clearCaptureProcessingSession,
  createCaptureProcessingSession,
  createClientProcessingId,
  getUtcTodayDate,
  loadCaptureProcessingSession,
  logCaptureProcessing,
  refreshDerivedAfterCaptureInBackground,
  resumeCaptureEntryProcessing,
  saveCaptureProcessingSession,
  submitTextEntry,
  updateCaptureProcessingSession,
} from "@/services";
import type {
  DerivedRefreshResult,
  ProcessEntryResult,
} from "@/services/entries";
import { spacing } from "@/theme";

import {
  buildCaptureParams,
  createCaptureContext,
  extractJournalDateFromDayReturnTo,
  formatCaptureTargetDateLabel,
  resolveCaptureJournalDate,
  resolveCaptureReturnTo,
  type CaptureRouteParams,
} from "@/src/lib/capture-shared";

const RECOVERY_PENDING_GRACE_MS = 30_000;
const RECOVERY_RECHECK_MS = 3_000;

export default function CaptureTypeScreen() {
  const scheme = useColorScheme() ?? "light";
  const insets = useSafeAreaInsets();
  const { date, targetDate, returnTo } =
    useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date, targetDate);
  const resolvedReturnTo = journalDate ? resolveCaptureReturnTo(returnTo) : null;
  const returnParams = buildCaptureParams(journalDate, resolvedReturnTo);
  const targetDateLabel = formatCaptureTargetDateLabel(journalDate);
  const showTargetDateNotice = Boolean(
    journalDate && journalDate !== getUtcTodayDate() && targetDateLabel,
  );
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [retryingDerived, setRetryingDerived] = useState(false);
  const [discardVisible, setDiscardVisible] = useState(false);
  const [savedEntry, setSavedEntry] = useState<ProcessEntryResult | null>(null);
  const [derivedResult, setDerivedResult] = useState<DerivedRefreshResult | null>(
    null,
  );
  const [error, setError] = useState<{
    message: string;
    retryable: boolean;
    requestId: string | null;
  } | null>(null);
  const [recoveryStatus, setRecoveryStatus] = useState<string | null>(null);
  const recoveryInFlightRef = useRef(false);
  const recoveryRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const hasTextDraft = rawText.trim().length > 0;
  const characterCount = rawText.length;
  const derivedNeedsAttention = Boolean(
    savedEntry && derivedResult && derivedResult.status !== "success",
  );

  function goBackToStart() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({ pathname: "/capture", params: returnParams });
  }

  const goToEntry = useCallback(
    (entryId: string, nextJournalDate: string) => {
      const returnToDate = extractJournalDateFromDayReturnTo(resolvedReturnTo);
      if (returnToDate) {
        router.replace({
          pathname: "/day/[date]",
          params: {
            date: returnToDate,
            processed: "1",
            entryId,
          },
        });
        return;
      }

      router.replace({
        pathname: "/entry/[id]",
        params: {
          id: entryId,
          source: "capture",
          date: nextJournalDate,
        },
      });
    },
    [resolvedReturnTo],
  );

  const refreshDerivedQuietly = useCallback((nextJournalDate: string, clientProcessingId: string) => {
    void refreshDerivedAfterCaptureInBackground(nextJournalDate)
      .then((result) => {
        logCaptureProcessing("completion", {
          clientProcessingId,
          journalDate: nextJournalDate,
          derivedStatus: result.status,
        });
      })
      .catch((nextError) => {
        logCaptureProcessing("terminal_failure", {
          clientProcessingId,
          journalDate: nextJournalDate,
          reason:
            nextError instanceof Error
              ? nextError.message
              : "Derived refresh failed.",
        });
      });
  }, []);

  const recoverCaptureProcessing = useCallback(
    async (reason: string) => {
      if (submitting || retryingDerived || recoveryInFlightRef.current) {
        return;
      }

      const session = loadCaptureProcessingSession();
      if (!session || session.sourceType !== "text") {
        return;
      }

      recoveryInFlightRef.current = true;
      setError(null);
      setRecoveryStatus("We halen je moment terug.");

      try {
        const check = await checkCaptureProcessingSession(session);

        if (check.status === "recovery-unavailable") {
          clearCaptureProcessingSession(session.clientProcessingId);
          setRecoveryStatus(null);
          return;
        }

        if (check.status === "completed") {
          updateCaptureProcessingSession({
            phase: "server_acknowledged",
            rawEntryId: check.rawEntryId,
            normalizedEntryId: check.normalizedEntryId,
          });
          logCaptureProcessing("recovery_completed", {
            reason,
            clientProcessingId: session.clientProcessingId,
            rawEntryId: check.rawEntryId,
            normalizedEntryId: check.normalizedEntryId,
          });
          setRecoveryStatus("Je moment is opgeslagen.");
          clearCaptureProcessingSession(session.clientProcessingId);
          goToEntry(check.normalizedEntryId, check.journalDate);
          refreshDerivedQuietly(check.journalDate, session.clientProcessingId);
          return;
        }

        if (check.status === "raw-only") {
          const nextSession = updateCaptureProcessingSession({
            phase: "submitting",
            rawEntryId: check.rawEntryId,
            retryCount: session.retryCount + 1,
          }) ?? session;
          logCaptureProcessing("retry", {
            reason,
            clientProcessingId: session.clientProcessingId,
            rawEntryId: check.rawEntryId,
          });
          const result = await resumeCaptureEntryProcessing({
            clientProcessingId: nextSession.clientProcessingId,
            sourceType: nextSession.sourceType,
            capturedAt: nextSession.capturedAt,
            journalDate: nextSession.journalDate,
            timezoneOffsetMinutes: nextSession.timezoneOffsetMinutes,
            deferDerived: true,
          });
          updateCaptureProcessingSession({
            phase: "server_acknowledged",
            rawEntryId: result.rawEntryId,
            normalizedEntryId: result.normalizedEntryId,
          });
          setRecoveryStatus("Je moment is opgeslagen.");
          clearCaptureProcessingSession(session.clientProcessingId);
          goToEntry(result.normalizedEntryId, result.journalDate);
          refreshDerivedQuietly(result.journalDate, session.clientProcessingId);
          return;
        }

        const updatedAtMs = new Date(session.updatedAt).getTime();
        if (
          Number.isFinite(updatedAtMs) &&
          Date.now() - updatedAtMs < RECOVERY_PENDING_GRACE_MS
        ) {
          if (recoveryRetryTimeoutRef.current) {
            clearTimeout(recoveryRetryTimeoutRef.current);
          }
          recoveryRetryTimeoutRef.current = setTimeout(() => {
            void recoverCaptureProcessing("pending");
          }, RECOVERY_RECHECK_MS);
          return;
        }

        updateCaptureProcessingSession({
          phase: "failed",
          failureReason: "not_found",
        });
        clearCaptureProcessingSession(session.clientProcessingId);
        setRecoveryStatus(null);
        setError({
          message: "Je moment is niet veilig verstuurd. Leg het opnieuw vast.",
          retryable: true,
          requestId: null,
        });
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        const failureReason = parsed.code ?? parsed.message;
        setRecoveryStatus(null);
        updateCaptureProcessingSession({
          phase: "failed",
          failureReason: parsed.nonRecoverable
            ? `non_recoverable:${failureReason}`
            : failureReason,
        });
        setError({
          message: parsed.nonRecoverable
            ? "Dit moment kan niet automatisch worden hersteld. Leg het opnieuw vast."
            : parsed.message,
          retryable: parsed.retryable,
          requestId: parsed.requestId,
        });
      } finally {
        recoveryInFlightRef.current = false;
      }
    },
    [goToEntry, refreshDerivedQuietly, retryingDerived, submitting],
  );

  useEffect(() => {
    void recoverCaptureProcessing("mount");

    return () => {
      if (recoveryRetryTimeoutRef.current) {
        clearTimeout(recoveryRetryTimeoutRef.current);
      }
    };
  }, [recoverCaptureProcessing]);

  useFocusEffect(
    useCallback(() => {
      void recoverCaptureProcessing("focus");
    }, [recoverCaptureProcessing]),
  );

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void recoverCaptureProcessing("appstate");
      }
    });

    if (Platform.OS !== "web") {
      return () => appStateSubscription.remove();
    }

    const handleFocus = () => {
      void recoverCaptureProcessing("window_focus");
    };
    const handleVisibilityChange = () => {
      if (globalThis.document?.visibilityState === "visible") {
        void recoverCaptureProcessing("visibilitychange");
      }
    };

    globalThis.window?.addEventListener("focus", handleFocus);
    globalThis.document?.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      appStateSubscription.remove();
      globalThis.window?.removeEventListener("focus", handleFocus);
      globalThis.document?.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [recoverCaptureProcessing]);

  function handleBack() {
    if (submitting || recoveryStatus) {
      return;
    }

    if (hasTextDraft) {
      setDiscardVisible(true);
      return;
    }

    goBackToStart();
  }

  async function handleSubmit() {
    if (!hasTextDraft || submitting || retryingDerived || derivedNeedsAttention) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setRecoveryStatus(null);

    try {
      const captureContext = createCaptureContext(
        new Date(),
        journalDate ?? undefined,
      );
      const clientProcessingId = createClientProcessingId("text");
      const session = saveCaptureProcessingSession({
        ...createCaptureProcessingSession({
          clientProcessingId,
          sourceType: "text",
          capturedAt: captureContext.capturedAt,
          journalDate: captureContext.journalDate,
          timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
        }),
        phase: "submitting",
      });

      logCaptureProcessing("submit_start", {
        clientProcessingId: session.clientProcessingId,
        sourceType: session.sourceType,
        journalDate: session.journalDate,
      });

      const result = await submitTextEntry({
        rawText,
        capturedAt: captureContext.capturedAt,
        journalDate: captureContext.journalDate,
        timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
        deferDerived: true,
        clientProcessingId,
      });

      updateCaptureProcessingSession({
        phase: "server_acknowledged",
        rawEntryId: result.rawEntryId,
        normalizedEntryId: result.normalizedEntryId,
      });
      logCaptureProcessing("server_ack", {
        clientProcessingId,
        rawEntryId: result.rawEntryId,
        normalizedEntryId: result.normalizedEntryId,
      });
      setRawText("");
      setSavedEntry(result);
      clearCaptureProcessingSession(clientProcessingId);
      goToEntry(result.normalizedEntryId, result.journalDate);
      refreshDerivedQuietly(result.journalDate, clientProcessingId);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      updateCaptureProcessingSession({
        phase: "failed",
        failureReason: parsed.nonRecoverable
          ? `non_recoverable:${parsed.code ?? parsed.message}`
          : parsed.code ?? parsed.message,
      });
      setError({
        message: parsed.nonRecoverable
          ? "Dit moment kan niet automatisch worden hersteld. Leg het opnieuw vast."
          : "Opslaan mislukt. Probeer opnieuw.",
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function goToSavedEntry() {
    if (!savedEntry) {
      return;
    }

    goToEntry(savedEntry.normalizedEntryId, savedEntry.journalDate);
  }

  async function handleRetryDerived() {
    if (!savedEntry || retryingDerived || submitting) {
      return;
    }

    setRetryingDerived(true);
    const nextResult = await refreshDerivedAfterCaptureInBackground(
      savedEntry.journalDate,
    );
    setDerivedResult(nextResult);
    setRetryingDerived(false);

    if (nextResult.status === "success") {
      goToSavedEntry();
    }
  }

  return (
    <ScreenContainer
      backgroundTone="flat"
      fixedHeader={
        <CaptureBackHeader topInset={insets.top} onBack={handleBack} />
      }
    >
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[
          styles.keyboardHost,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={styles.content}>
          {showTargetDateNotice && targetDateLabel ? (
            <NoticeCard
              compact
              compactCentered
              body={`Je voegt dit toe aan ${targetDateLabel}.`}
              style={styles.notice}
            />
          ) : null}

          {error ? (
            <CaptureErrorStack>
              <StateBlock
                tone="error"
                message={error.message}
                detail={
                  error.retryable
                    ? "Probeer het zo opnieuw."
                    : "Controleer je tekst en probeer het daarna opnieuw."
                }
                meta={error.requestId ? `Referentie: ${error.requestId}` : null}
              />
            </CaptureErrorStack>
          ) : null}
          {derivedNeedsAttention && derivedResult ? (
            <CaptureErrorStack>
              <StateBlock
                tone={derivedResult.status === "failed" ? "error" : "info"}
                message={buildDerivedStatusMessage(derivedResult)}
                detail="Je moment is wel opgeslagen."
              />
              <View style={styles.derivedActions}>
                <PrimaryButton
                  label={
                    retryingDerived ? "Opnieuw proberen..." : "Opnieuw proberen"
                  }
                  onPress={() => void handleRetryDerived()}
                  disabled={submitting || retryingDerived}
                />
                <SecondaryButton
                  label="Ga naar je moment"
                  onPress={goToSavedEntry}
                  disabled={submitting || retryingDerived}
                />
              </View>
            </CaptureErrorStack>
          ) : null}

          <View style={styles.editorBlock}>
            <TextEntryEditor
              autoFocus
              editable={
                !submitting &&
                !retryingDerived &&
                !recoveryStatus &&
                !derivedNeedsAttention
              }
              value={rawText}
              onChangeText={setRawText}
              placeholder="Begin met schrijven…"
              variant="capture"
              style={styles.input}
            />
            <ThemedText type="caption" style={styles.counter}>
              {characterCount} / 20000
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Leg vast"
            accessibilityLabel="Tekstmoment vastleggen"
            testID="capture-type-submit-button"
            onPress={() => void handleSubmit()}
            disabled={
              submitting ||
              retryingDerived ||
              Boolean(recoveryStatus) ||
              derivedNeedsAttention ||
              !hasTextDraft
            }
          />
        </View>

        <ConfirmSheet
          visible={discardVisible}
          title="Tekst niet opslaan?"
          message="Deze tekst is nog niet vastgelegd."
          actions={[
            {
              key: "cancel",
              label: "Blijf hier",
              onPress: () => setDiscardVisible(false),
            },
            {
              key: "confirm",
              label: "Niet opslaan",
              tone: "destructive",
              icon: "delete-forever",
              onPress: () => {
                setDiscardVisible(false);
                setRawText("");
                setError(null);
                goBackToStart();
              },
            },
          ]}
          onCancel={() => setDiscardVisible(false)}
          onConfirm={() => {
            setDiscardVisible(false);
            setRawText("");
            setError(null);
            goBackToStart();
          }}
        />
        <ProcessingScreen
          visible={submitting || retryingDerived || Boolean(recoveryStatus)}
          variant="text-entry"
          backgroundTone="ambient"
          statusOverride={
            recoveryStatus ??
            (retryingDerived ? "Je dag wordt opnieuw bijgewerkt." : undefined)
          }
        />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function buildDerivedStatusMessage(result: DerivedRefreshResult): string {
  if (result.dayJournal.status === "failed") {
    return "Je tekst is opgeslagen, maar je dag is nog niet bijgewerkt.";
  }

  if (
    result.weekReflection.status === "failed" ||
    result.monthReflection.status === "failed"
  ) {
    return "Je tekst is opgeslagen, maar het bijwerken van je reflecties is niet gelukt.";
  }

  return "Je tekst is opgeslagen, maar het bijwerken is nog niet afgerond.";
}

const styles = StyleSheet.create({
  keyboardHost: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 0,
  },
  notice: {
    marginTop: 0,
    marginBottom: 0,
  },
  derivedActions: {
    gap: spacing.sm,
  },
  editorBlock: {
    flex: 1,
    minHeight: 0,
    marginTop: spacing.md,
  },
  input: {
    flex: 1,
  },
  counter: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
  },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
});
