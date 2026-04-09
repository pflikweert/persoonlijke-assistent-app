import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { ProcessingScreen } from "@/components/feedback/processing-screen";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ThemedText } from "@/components/themed-text";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import {
  PrimaryButton,
  ScreenContainer,
  StateBlock,
} from "@/components/ui/screen-primitives";
import {
  classifyUnknownError,
  refreshDerivedAfterCaptureInBackground,
  submitTextEntry,
} from "@/services";
import { colorTokens, spacing, typography } from "@/theme";

import {
  buildCaptureParams,
  createCaptureContext,
  resolveCaptureJournalDate,
  type CaptureRouteParams,
} from "./_shared";

export default function CaptureTypeScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();
  const { date } = useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date);
  const returnParams = buildCaptureParams(journalDate);
  const [rawText, setRawText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [discardVisible, setDiscardVisible] = useState(false);
  const [error, setError] = useState<{
    message: string;
    retryable: boolean;
    requestId: string | null;
  } | null>(null);

  const hasTextDraft = rawText.trim().length > 0;

  function goBackToStart() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({ pathname: "/capture", params: returnParams });
  }

  function handleBack() {
    if (submitting) {
      return;
    }

    if (hasTextDraft) {
      setDiscardVisible(true);
      return;
    }

    goBackToStart();
  }

  async function handleSubmit() {
    if (!hasTextDraft || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const captureContext = createCaptureContext(
        new Date(),
        journalDate ?? undefined,
      );
      const result = await submitTextEntry({
        rawText,
        capturedAt: captureContext.capturedAt,
        journalDate: captureContext.journalDate,
        timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
        deferDerived: true,
      });

      setRawText("");
      router.replace({
        pathname: "/entry/[id]",
        params: {
          id: result.normalizedEntryId,
          source: "capture",
          date: result.journalDate,
        },
      });
      void refreshDerivedAfterCaptureInBackground(result.journalDate);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError({
        message: parsed.message,
        retryable: parsed.retryable,
        requestId: parsed.requestId,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer
      fixedHeader={
        <ScreenHeader
          style={{
            paddingHorizontal: 0,
            paddingTop: insets.top,
            paddingBottom: 0,
          }}
          leftAction={
            <HeaderIconButton
              accessibilityRole="button"
              accessibilityLabel="Terug"
              onPress={handleBack}
            >
              <MaterialIcons
                name="arrow-back"
                size={18}
                color={palette.primary}
              />
            </HeaderIconButton>
          }
        />
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
          <View style={styles.copyBlock}>
            <ThemedText
              type="screenTitle"
              lightColor={palette.text}
              darkColor={palette.text}
            >
              Wat houdt je bezig?
            </ThemedText>
            <ThemedText
              type="bodySecondary"
              lightColor={palette.muted}
              darkColor={palette.muted}
              style={styles.subtitle}
            >
              Schrijf op wat je wilt vastleggen
            </ThemedText>
          </View>

          {error ? (
            <View style={styles.errorBlock}>
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
            </View>
          ) : null}

          <TextInput
            multiline
            autoFocus
            editable={!submitting}
            value={rawText}
            onChangeText={setRawText}
            placeholder="Wat wil je vastleggen?"
            placeholderTextColor={palette.mutedSoft}
            textAlignVertical="top"
            style={[styles.input, { color: palette.text }]}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Leg vast"
            onPress={() => void handleSubmit()}
            disabled={submitting || !hasTextDraft}
          />
        </View>

        <ConfirmDialog
          visible={discardVisible}
          title="Tekst niet opslaan?"
          message="Deze tekst is nog niet vastgelegd."
          cancelLabel="Blijf hier"
          confirmLabel="Niet opslaan"
          onCancel={() => setDiscardVisible(false)}
          onConfirm={() => {
            setDiscardVisible(false);
            setRawText("");
            setError(null);
            goBackToStart();
          }}
        />
        <ProcessingScreen visible={submitting} variant="text-entry" />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardHost: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: spacing.xxxl - spacing.xs,
  },
  copyBlock: {
    gap: spacing.sm,
  },
  subtitle: {
    maxWidth: 280,
  },
  errorBlock: {
    marginTop: spacing.lg,
  },
  input: {
    flex: 1,
    marginTop: spacing.xl,
    fontSize: typography.roles.sectionTitle.size,
    lineHeight: typography.roles.sectionTitle.lineHeight,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
});
