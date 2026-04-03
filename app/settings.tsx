import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { ProcessingScreen } from '@/components/feedback/processing-screen';
import { ScreenHeader } from '@/components/layout/screen-header';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  MetaText,
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
  SurfaceSection,
} from '@/components/ui/screen-primitives';
import {
  invokeChatGptMarkdownImport,
  parseChatGptMarkdownFile,
  refreshImportedChatGptDerivedContent,
  summarizePreviewDate,
} from '@/services';
import type { ChatGptImportRefreshProgress, ChatGptMarkdownPreview } from '@/services/import';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';

type FlowStep = 'pick' | 'preview' | 'result';

type FlowStatus = {
  tone: 'success' | 'error' | 'info';
  message: string;
  detail?: string;
};

type ImportProgressState = {
  status: ChatGptImportRefreshProgress;
  current: number;
  total: number;
};

async function readImportedMarkdown(uri: string): Promise<string> {
  if (uri.startsWith('data:') || uri.startsWith('blob:') || uri.startsWith('http')) {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('Kon het gekozen bestand niet lezen.');
    }

    return response.text();
  }

  return readAsStringAsync(uri);
}

function formatRange(preview: ChatGptMarkdownPreview | null): string {
  if (!preview?.firstDate || !preview.lastDate) {
    return '-';
  }

  return `${summarizePreviewDate(preview.firstDate)} t/m ${summarizePreviewDate(preview.lastDate)}`;
}

function formatImportStatus(progress: ImportProgressState | null): string {
  if (!progress) {
    return 'Markdownbestand analyseren';
  }

  const label = progress.status.charAt(0).toUpperCase() + progress.status.slice(1);
  if (progress.total <= 1) {
    return label;
  }

  return `${label} (${progress.current}/${progress.total})`;
}

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const [menuVisible, setMenuVisible] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>('pick');
  const [preview, setPreview] = useState<ChatGptMarkdownPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [importing, setImporting] = useState(false);
  const [replaceConfirmVisible, setReplaceConfirmVisible] = useState(false);
  const [status, setStatus] = useState<FlowStatus | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgressState | null>(null);

  const previewTitle = useMemo(() => {
    if (!preview) {
      return null;
    }

    return preview.conversationTitle || preview.conversationAlias || 'Onbekende conversatie';
  }, [preview]);

  function resetToPickStep() {
    setFlowStep('pick');
    setPreview(null);
    setStatus(null);
    setReplaceConfirmVisible(false);
  }

  async function handlePickFile() {
    setLoadingPreview(true);
    setStatus(null);
    setReplaceConfirmVisible(false);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/markdown', 'text/plain'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      if (!asset?.uri || !asset.name) {
        throw new Error('Het gekozen bestand bevat geen leesbare data.');
      }

      const markdown = await readImportedMarkdown(asset.uri);
      const nextPreview = parseChatGptMarkdownFile({
        fileName: asset.name,
        markdown,
      });

      if (nextPreview.messages.length === 0) {
        throw new Error('Geen user-berichten gevonden in dit markdownbestand.');
      }

      setPreview(nextPreview);
      setFlowStep('preview');
    } catch (error) {
      setPreview(null);
      setFlowStep('pick');
      setStatus({
        tone: 'error',
        message: 'Preview kon niet worden geladen.',
        detail: error instanceof Error ? error.message : 'Onbekende fout.',
      });
    } finally {
      setLoadingPreview(false);
    }
  }

  async function runImport(replaceExisting = false) {
    if (!preview) {
      return;
    }

    setImporting(true);
    setStatus(null);
    setReplaceConfirmVisible(false);
    setImportProgress({
      status: 'markdownbestand analyseren',
      current: 1,
      total: 5,
    });

    try {
      setImportProgress({
        status: 'user-berichten voorbereiden',
        current: 2,
        total: 5,
      });

      setImportProgress({
        status: 'entries importeren',
        current: 3,
        total: 5,
      });

      const result = await invokeChatGptMarkdownImport({
        preview,
        replaceExisting,
      });

      if (result.requiresReplaceConfirmation) {
        setReplaceConfirmVisible(true);
        setImportProgress(null);
        return;
      }

      const refreshWarnings = await refreshImportedChatGptDerivedContent({
        impactedDates: result.impactedDates,
        onProgress: (nextStatus, current, total) => {
          const mappedCurrent =
            nextStatus === 'dagboekdagen opbouwen'
              ? 4
              : 5;
          setImportProgress({
            status: nextStatus,
            current: Math.max(mappedCurrent, current),
            total: Math.max(5, total),
          });
        },
      });

      setStatus({
        tone: refreshWarnings.length > 0 ? 'info' : 'success',
        message:
          result.removedCount > 0
            ? `Import vervangen. ${result.importedCount} berichten opnieuw toegevoegd.`
            : `Import voltooid. ${result.importedCount} berichten toegevoegd.`,
        detail:
          refreshWarnings.length > 0
            ? refreshWarnings.join('\n')
            : 'Wil je nog een bestand importeren?',
      });
      setFlowStep('result');
    } catch (error) {
      setStatus({
        tone: 'error',
        message: 'Import mislukt.',
        detail: error instanceof Error ? error.message : 'Onbekende fout.',
      });
      setFlowStep('result');
    } finally {
      setImporting(false);
      setImportProgress(null);
    }
  }

  return (
    <>
      <ScreenContainer
        scrollable
        fixedHeader={
          <ScreenHeader
            title="Instellingen"
            titleType="screenTitle"
            subtitle="Kleine beheeracties voor je dagboek."
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
        {flowStep === 'pick' ? (
          <SurfaceSection
            title="Importeer ChatGPT markdown"
            subtitle="Laad één Nexus/ChatGPT markdown-export in als dagboekentries.">
            <ThemedView style={styles.copyBlock}>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Alleen jouw eigen berichten worden geïmporteerd.
              </ThemedText>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Reacties van ChatGPT worden niet opgeslagen in je dagboek.
              </ThemedText>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Bestaande data kan bij opnieuw importeren worden vervangen.
              </ThemedText>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Je kunt dezelfde export opnieuw importeren en de eerdere import overschrijven.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.actions}>
              <PrimaryButton
                label={loadingPreview ? 'Bestand laden...' : 'Kies markdownbestand'}
                onPress={() => void handlePickFile()}
                disabled={loadingPreview || importing}
              />
            </ThemedView>

            {status ? <StateBlock tone={status.tone} message={status.message} detail={status.detail} /> : null}
          </SurfaceSection>
        ) : null}

        {flowStep === 'preview' && preview ? (
          <SurfaceSection
            title="Preview"
            subtitle="Controleer eerst wat er wordt toegevoegd aan je dagboek.">
            <ThemedView style={[styles.previewCard, { borderColor: palette.separator }]}>
              <ThemedView style={styles.previewGroup}>
                <MetaText>Bestand</MetaText>
                <ThemedText type="defaultSemiBold">{preview.fileName}</ThemedText>
                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  {previewTitle}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.metaGrid}>
                <ThemedView style={styles.metaItem}>
                  <MetaText>User-entries</MetaText>
                  <ThemedText type="defaultSemiBold">{String(preview.userEntryCount)}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.metaItem}>
                  <MetaText>Unieke dagen</MetaText>
                  <ThemedText type="defaultSemiBold">{String(preview.uniqueDayCount)}</ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.previewGroup}>
                <MetaText>Datumrange</MetaText>
                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  {formatRange(preview)}
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.previewGroup}>
                <MetaText>Eerste 3 voorbeeldentries</MetaText>
                <ThemedView style={styles.examples}>
                  {preview.exampleEntries.map((entry, index) => (
                    <ThemedView
                      key={`${index}-${entry}`}
                      lightColor={colorTokens.light.surfaceLow}
                      darkColor={colorTokens.dark.surfaceLow}
                      style={styles.exampleCard}>
                      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                        {entry}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.actions}>
              <PrimaryButton label="Start import" onPress={() => void runImport(false)} disabled={importing} />
              <SecondaryButton label="Terug naar bestand kiezen" onPress={resetToPickStep} disabled={importing} />
            </ThemedView>
          </SurfaceSection>
        ) : null}

        {flowStep === 'result' && status ? (
          <SurfaceSection
            title={status.tone === 'error' ? 'Import mislukt' : 'Gelukt'}
            subtitle={
              status.tone === 'error'
                ? 'Er ging iets mis tijdens het importeren.'
                : 'De import is afgerond.'
            }>
            <StateBlock tone={status.tone} message={status.message} detail={status.detail} />

            <ThemedView style={styles.actions}>
              <PrimaryButton label="Nog een bestand importeren" onPress={resetToPickStep} />
              <SecondaryButton label="Klaar" onPress={() => router.back()} />
            </ThemedView>
          </SurfaceSection>
        ) : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />

        <ConfirmDialog
          visible={replaceConfirmVisible}
          title="Vervang eerdere import?"
          message="Voor dit bestand zijn al entries geïmporteerd. Wil je de eerdere import vervangen?"
          cancelLabel="Nee"
          confirmLabel="Vervangen"
          processing={importing}
          onCancel={() => setReplaceConfirmVisible(false)}
          onConfirm={() => void runImport(true)}
        />
      </ScreenContainer>

      <ProcessingScreen
        visible={importing}
        variant="chatgpt-import"
        statusOverride={formatImportStatus(importProgress)}
      />
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
  copyBlock: {
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  previewCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  previewGroup: {
    gap: spacing.xs,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaItem: {
    flex: 1,
    gap: spacing.xxs,
  },
  examples: {
    gap: spacing.sm,
  },
  exampleCard: {
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
