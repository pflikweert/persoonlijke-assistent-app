import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { colorTokens, radius, spacing, typography } from '@/theme';

import { buildCaptureParams, resolveCaptureJournalDate, type CaptureRouteParams } from './_shared';

const palette = colorTokens.dark;

export default function CaptureStartScreen() {
  const insets = useSafeAreaInsets();
  const { date } = useLocalSearchParams<CaptureRouteParams>();
  const journalDate = resolveCaptureJournalDate(date);
  const params = buildCaptureParams(journalDate);

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)');
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl }]}>
      <StatusBar style="light" />

      <View style={styles.headerRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Terug" onPress={handleClose} style={styles.backButton}>
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
            Spreek of schrijf wat je vandaag bezighoudt
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Opnemen"
            onPress={() => router.push({ pathname: '/capture/record', params })}
            style={styles.primaryMicButton}>
            <MaterialIcons name="mic" size={40} color={palette.primaryOn} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Of typ je moment"
            onPress={() => router.push({ pathname: '/capture/type', params })}
            style={styles.secondaryLink}>
            <ThemedText type="bodySecondary" lightColor={palette.muted} darkColor={palette.muted} style={styles.secondaryLinkText}>
              Of typ je moment
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
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
    paddingTop: spacing.xxxl + spacing.sm,
  },
  copyBlock: {
    maxWidth: 320,
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
  actions: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  primaryMicButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.primary,
  },
  secondaryLink: {
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  secondaryLinkText: {
    textAlign: 'center',
  },
});
