import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminMetaStrip,
  AdminPageHero,
  AdminSection,
  AdminShell,
  AdminStickyFooterActions,
  SettingsTopNav,
} from '@/components/ui/settings-screen-primitives';
import { MetaText, StateBlock } from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  createAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
} from '@/services';
import type { AiTaskDetail, AiTaskVersionDetail } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing } from '@/theme';
import { formatDateTimeLabel, versionStatusLabel } from './_shared';

function isDraftVersion(version: AiTaskVersionDetail): boolean {
  return version.status === 'draft';
}

export default function AiQualityStudioTaskOverviewScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { taskKey } = useLocalSearchParams<{ taskKey?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [detail, setDetail] = useState<AiTaskDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const draftVersion = useMemo(
    () => detail?.versions.find((version) => version.status === 'draft') ?? null,
    [detail]
  );
  const hasLive = Boolean(detail?.liveVersion);

  const primaryLabel = draftVersion
    ? 'Verder bewerken'
    : hasLive
      ? 'Nieuwe draft op basis van live'
      : 'Eerste versie maken';

  const load = useCallback(async () => {
    const normalizedTaskKey = typeof taskKey === 'string' ? taskKey.trim() : '';
    if (!normalizedTaskKey) {
      setDetail(null);
      setLoading(false);
      setError('Geen geldige taskKey gevonden.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextDetail = await fetchAdminAiQualityStudioTaskDetail(normalizedTaskKey);
      setDetail(nextDetail);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [taskKey]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  async function handlePrimaryAction() {
    if (!detail || creatingDraft) return;

    if (draftVersion) {
      router.push(`/settings-ai-quality-studio/${detail.key}/draft/${draftVersion.id}` as never);
      return;
    }

    setCreatingDraft(true);
    setError(null);
    try {
      const created = await createAdminAiQualityStudioDraftVersion(detail.key);
      router.push(`/settings-ai-quality-studio/${detail.key}/draft/${created.version.id}` as never);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setCreatingDraft(false);
    }
  }

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      fixedFooter={
        !loading && detail ? (
          <AdminStickyFooterActions
            primaryAction={{
              label: creatingDraft ? 'Versie maken…' : primaryLabel,
              onPress: () => void handlePrimaryAction(),
              disabled: creatingDraft,
              icon: draftVersion ? 'edit' : 'add-circle-outline',
            }}
            secondaryAction={
              draftVersion
                ? {
                    label: 'Testen',
                    onPress: () =>
                      router.push(`/settings-ai-quality-studio/${detail.key}/test/${draftVersion.id}` as never),
                    icon: 'science',
                  }
                : undefined
            }
          />
        ) : null
      }
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero
        title="Overzicht"
        subtitle={detail?.label ?? (typeof taskKey === 'string' ? taskKey : 'AI Quality Studio')}
      />

      {detail ? (
        <AdminMetaStrip
          items={[
            `Input: ${detail.inputType}`,
            detail.liveVersion ? `Runtime actief: v${detail.liveVersion.versionNumber}` : 'Runtime nog niet ingesteld',
          ]}
        />
      ) : null}

      {loading ? <StateBlock tone="loading" message="Onderdeel laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon onderdeel niet laden." detail={error} /> : null}

      {!loading && detail ? (
        <>
          <AdminSection title="Onderdeel">
            <ThemedText type="defaultSemiBold">{detail.label}</ThemedText>
            {detail.description ? <ThemedText type="bodySecondary">{detail.description}</ThemedText> : null}
            <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
              key: {detail.key} · input: {detail.inputType} · output: {detail.outputType}
            </ThemedText>
          </AdminSection>

          <AdminSection title="Live versie">
            {detail.liveVersion ? (
              <ThemedView style={styles.fieldGroup}>
                <MetaText>Status: Live (runtime-basis)</MetaText>
                <MetaText>
                  v{detail.liveVersion.versionNumber} · {detail.liveVersion.model}
                </MetaText>
                <MetaText>Aangemaakt: {formatDateTimeLabel(detail.liveVersion.createdAt)}</MetaText>
                <MetaText>Bijgewerkt: {formatDateTimeLabel(detail.liveVersion.updatedAt)}</MetaText>
                <MetaText>Deze live versie is de huidige studio-baseline uit runtime-code.</MetaText>
              </ThemedView>
            ) : (
              <StateBlock
                tone="info"
                message="Nog geen runtime-basis"
                detail="Importeer eerst de huidige runtime-baseline voor deze task."
              />
            )}
          </AdminSection>

          <AdminSection title="Versies">
            <ThemedView style={styles.versionList}>
              {detail.versions.map((version) => {
                const isDraft = isDraftVersion(version);
                return (
                  <Pressable
                    key={version.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Versie ${version.versionNumber} (${version.status})`}
                    onPress={() => {
                      if (!isDraft) return;
                      router.push(`/settings-ai-quality-studio/${detail.key}/draft/${version.id}` as never);
                    }}
                    style={[styles.versionRow, { backgroundColor: palette.surfaceLow }]}
                  >
                    <ThemedText type="defaultSemiBold">
                      v{version.versionNumber} · {versionStatusLabel(version.status)}
                    </ThemedText>
                    <MetaText>{version.model}</MetaText>
                    <MetaText>{isDraft ? 'Verder bewerken' : 'Alleen bekijken'}</MetaText>
                  </Pressable>
                );
              })}
            </ThemedView>
          </AdminSection>
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  versionList: {
    gap: spacing.sm,
  },
  versionRow: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
});
