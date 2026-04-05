import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedView } from '@/components/themed-view';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  StateBlock,
  SurfaceSection,
} from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { classifyUnknownError, downloadUserArchive } from '@/services';
import { colorTokens, radius, spacing } from '@/theme';

type StatusState =
  | null
  | {
      tone: 'success' | 'error' | 'info';
      message: string;
      detail?: string;
    };

export default function SettingsExportScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const [menuVisible, setMenuVisible] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<StatusState>(null);

  async function handleDownload() {
    if (exporting) {
      return;
    }

    setExporting(true);
    setStatus({
      tone: 'info',
      message: 'Je archief wordt klaargezet.',
    });

    try {
      const result = await downloadUserArchive();
      if (result.status === 'empty') {
        setStatus({
          tone: 'info',
          message: 'Je hebt nog niets om te downloaden.',
        });
        return;
      }

      const successMessage = Platform.OS === 'web' ? 'Je archief is gedownload.' : 'Je archief is opgeslagen.';
      setStatus({
        tone: 'success',
        message: successMessage,
        detail: `${result.days} dagen · ${result.entries} entries · ${result.weekReflections} weekreflecties · ${result.monthReflections} maandreflecties`,
      });
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setStatus({
        tone: 'error',
        message: 'Downloaden lukte niet. Probeer het opnieuw.',
        detail: parsed.message,
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <ScreenContainer
        scrollable
        fixedHeader={
          <ScreenHeader
            title="Archief downloaden"
            titleType="screenTitle"
            subtitle="Download een leesbaar bestand van je archief."
            leftAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ga terug"
                onPress={() => router.back()}
                style={[styles.iconButton, { backgroundColor: palette.surfaceLow }]}>
                <MaterialIcons name="arrow-back" size={20} color={palette.primary} />
              </Pressable>
            }
            rightAction={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                onPress={() => setMenuVisible(true)}
                style={[styles.iconButton, { backgroundColor: palette.surfaceLow }]}>
                <MaterialIcons name="menu" size={20} color={palette.primary} />
              </Pressable>
            }
          />
        }
        contentContainerStyle={styles.scrollContent}>
        <SurfaceSection
          title="Export"
          subtitle="Het exportbestand bevat dagen, entries en reflecties in leesbare vorm.">
          <ThemedView style={styles.actions}>
            <PrimaryButton
              label={exporting ? 'Je archief wordt klaargezet.' : 'Download mijn archief'}
              onPress={() => void handleDownload()}
              disabled={exporting}
            />
          </ThemedView>

          <MetaText>Interne technische velden worden niet meegenomen in het exportbestand.</MetaText>
        </SurfaceSection>

        {status ? <StateBlock tone={status.tone} message={status.message} detail={status.detail} /> : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: spacing.sm,
  },
});
