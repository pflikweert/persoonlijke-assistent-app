import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { ProcessingScreen } from '@/components/feedback/processing-screen';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton, StateBlock } from '@/components/ui/screen-primitives';
import { classifyUnknownError, refreshDerivedAfterCaptureInBackground, submitTextEntry } from '@/services';
import { colorTokens, radius, sizing, spacing, typography } from '@/theme';

import {
  buildCaptureParams,
  createCaptureContext,
  resolveCaptureJournalDate,
  type CaptureRouteParams,
} from './_shared';

const palette = colorTokens.dark;

export default function CaptureTypeScreen() {
  const insets = useSafeAreaInsets();
  const { date } = useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date);
  const returnParams = buildCaptureParams(journalDate);
  const [rawText, setRawText] = useState('');
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

    router.replace({ pathname: '/capture', params: returnParams });
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
      const captureContext = createCaptureContext(new Date(), journalDate ?? undefined);
      const result = await submitTextEntry({
        rawText,
        capturedAt: captureContext.capturedAt,
        journalDate: captureContext.journalDate,
        timezoneOffsetMinutes: captureContext.timezoneOffsetMinutes,
        deferDerived: true,
      });

      setRawText('');
      router.replace({
        pathname: '/entry/[id]',
        params: {
          id: result.normalizedEntryId,
          source: 'capture',
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
      <StatusBar style="light" />

      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Terug" onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={18} color={palette.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.copyBlock}>
          <ThemedText type="screenTitle" lightColor={palette.text} darkColor={palette.text} style={styles.title}>
            Wat houdt je bezig?
          </ThemedText>
          <ThemedText
            type="bodySecondary"
            lightColor={palette.muted}
            darkColor={palette.muted}
            style={styles.subtitle}>
            Schrijf op wat je wilt vastleggen
          </ThemedText>
        </View>

        {error ? (
          <View style={styles.errorBlock}>
            <StateBlock
              tone="error"
              message={error.message}
              detail={error.retryable ? 'Probeer het zo opnieuw.' : 'Controleer je tekst en probeer het daarna opnieuw.'}
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
          style={styles.input}
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Leg vast" onPress={() => void handleSubmit()} disabled={submitting || !hasTextDraft} />
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
          setRawText('');
          setError(null);
          goBackToStart();
        }}
      />
      <ProcessingScreen visible={submitting} variant="text-entry" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: spacing.page,
  },
  headerRow: {
    alignItems: 'flex-start',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceHigh,
  },
  content: {
    flex: 1,
    paddingTop: 36,
  },
  copyBlock: {
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.roles.screenTitle.size,
    lineHeight: typography.roles.screenTitle.lineHeight,
    letterSpacing: typography.roles.screenTitle.letterSpacing,
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
    color: palette.text,
    fontSize: 18,
    lineHeight: 30,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  footerButton: {
    height: sizing.ctaHeight,
  },
});
