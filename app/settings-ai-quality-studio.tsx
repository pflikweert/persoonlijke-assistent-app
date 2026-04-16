import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AdminMetaStrip, AdminPageHero, AdminShell, SettingsTopNav } from '@/components/ui/settings-screen-primitives';
import { MetaText, PrimaryButton, SecondaryButton, StateBlock, SurfaceSection } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  fetchAdminOpenAiDebugStorageSettings,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
  importAdminAiQualityRuntimeBaseline,
  updateAdminOpenAiDebugStorageSettings,
} from '@/services';
import type { AiOpenAiDebugFlowKey, AiOpenAiDebugStorageSettings, AiTaskSummary } from '@/types';
import { colorTokens, radius, spacing } from '@/theme';
import {
  buildAiQualityStudioReadModel,
  getAiQualityFamilyPrimaryTaskKey,
  shouldShowAiQualityGroupScreen,
} from '@/services/ai-quality-studio/readmodel';

export default function SettingsAiQualityStudioScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDebugStorage, setLoadingDebugStorage] = useState(false);
  const [importingBaseline, setImportingBaseline] = useState(false);
  const [tasks, setTasks] = useState<AiTaskSummary[]>([]);
  const [debugStorage, setDebugStorage] = useState<AiOpenAiDebugStorageSettings | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [debugStorageError, setDebugStorageError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [updatingDebugStorage, setUpdatingDebugStorage] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadingDebugStorage(true);
    setOverviewError(null);
    setDebugStorageError(null);

    try {
      const allowed = await hasAdminAiQualityStudioAccess();
      setAdminAccess(allowed);

      if (!allowed) {
        setTasks([]);
        setDebugStorage(null);
        return;
      }

      const [tasksResult, debugStorageResult] = await Promise.allSettled([
        fetchAdminAiQualityStudioTasks(),
        fetchAdminOpenAiDebugStorageSettings(),
      ]);

      if (tasksResult.status === 'fulfilled') {
        setTasks(tasksResult.value);
      } else {
        const parsed = classifyUnknownError(tasksResult.reason);
        setOverviewError(parsed.message);
        setTasks([]);
        if (parsed.code === 'AUTH_UNAUTHORIZED' || parsed.code === 'AUTH_MISSING') {
          setAdminAccess(false);
        }
      }

      if (debugStorageResult.status === 'fulfilled') {
        setDebugStorage(debugStorageResult.value);
      } else {
        const parsed = classifyUnknownError(debugStorageResult.reason);
        setDebugStorageError(parsed.message);
        setDebugStorage(null);
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setOverviewError(parsed.message);
      setTasks([]);
      setDebugStorage(null);
      if (parsed.code === 'AUTH_UNAUTHORIZED' || parsed.code === 'AUTH_MISSING') {
        setAdminAccess(false);
      } else {
        setAdminAccess(null);
      }
    } finally {
      setLoading(false);
      setLoadingDebugStorage(false);
    }
  }, []);

  const handleImportBaseline = useCallback(async () => {
    if (importingBaseline) {
      return;
    }

    setImportingBaseline(true);
    setImportMessage(null);
    setOverviewError(null);

    try {
      const result = await importAdminAiQualityRuntimeBaseline();
      setImportMessage(
        `Geïmporteerd: ${result.inserted.length} · gelijk overgeslagen: ${result.skipped_equal.length} · conflict: ${result.skipped_conflict.length}`
      );
      await load();
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setOverviewError(parsed.message);
    } finally {
      setImportingBaseline(false);
    }
  }, [importingBaseline, load]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const totals = useMemo(() => {
    let liveCount = 0;
    let draftOnlyCount = 0;
    for (const task of tasks) {
      if (task.liveVersion) {
        liveCount += 1;
      } else if (task.hasDraft) {
        draftOnlyCount += 1;
      }
    }

    return {
      total: tasks.length,
      live: liveCount,
      draftOnly: draftOnlyCount,
      noLive: Math.max(0, tasks.length - liveCount),
    };
  }, [tasks]);

  const groupRows = useMemo(() => buildAiQualityStudioReadModel(tasks).families, [tasks]);

  const handleSetMasterDebugStorage = useCallback(
    async (enabled: boolean) => {
      if (updatingDebugStorage) return;
      setUpdatingDebugStorage(true);
      setDebugStorageError(null);
      try {
        const next = await updateAdminOpenAiDebugStorageSettings({
          masterEnabled: enabled,
          masterTtlHours: enabled ? 4 : null,
          flowUpdates: [
            {
              flowKey: 'admin-ai-quality-studio.prompt_assist_preview',
              enabled: debugStorage?.flows.find((item) => item.flowKey === 'admin-ai-quality-studio.prompt_assist_preview')?.desiredOn ?? false,
              ttlHours: 4,
            },
            {
              flowKey: 'admin-ai-quality-studio.run_test',
              enabled: debugStorage?.flows.find((item) => item.flowKey === 'admin-ai-quality-studio.run_test')?.desiredOn ?? false,
              ttlHours: 4,
            },
          ],
        });
        setDebugStorage(next);
      } catch (nextError) {
        setDebugStorageError(classifyUnknownError(nextError).message);
      } finally {
        setUpdatingDebugStorage(false);
      }
    },
    [debugStorage, updatingDebugStorage]
  );

  const handleSetFlowDebugStorage = useCallback(
    async (flowKey: AiOpenAiDebugFlowKey, enabled: boolean) => {
      if (updatingDebugStorage || !debugStorage) return;
      setUpdatingDebugStorage(true);
      setDebugStorageError(null);
      try {
        const next = await updateAdminOpenAiDebugStorageSettings({
          masterEnabled: debugStorage.masterEnabled,
          masterTtlHours: null,
          flowUpdates: [
            {
              flowKey,
              enabled,
              ttlHours: enabled ? 4 : null,
            },
          ],
        });
        setDebugStorage(next);
      } catch (nextError) {
        setDebugStorageError(classifyUnknownError(nextError).message);
      } finally {
        setUpdatingDebugStorage(false);
      }
    },
    [debugStorage, updatingDebugStorage]
  );

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero
        title="Kwaliteit verbeteren"
        subtitle="Kies wat je wilt verfijnen: Momenten, Vandaag, Week of Maand."
      />

      <AdminMetaStrip
        items={
          totals.live === 0
            ? ['Nog geen runtime-baselines aanwezig']
            : [`${totals.live} onderdelen runtime actief`, `${totals.draftOnly} draft actief`]
        }
      />

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor allowlisted admins."
        />
      ) : null}

      {adminAccess !== false ? (
        <>
          <SurfaceSection>
            <MetaText>
              {totals.live === 0
                ? 'Nog geen runtime-baselines aanwezig.'
                : `${totals.live} onderdelen hebben runtime actief.`}
            </MetaText>

            {totals.live === 0 ? (
              <PrimaryButton
                label={importingBaseline ? 'Runtime-basis importeren…' : 'Importeer runtime-basis'}
                onPress={() => void handleImportBaseline()}
                disabled={importingBaseline || loading}
              />
            ) : null}

            {importMessage ? <MetaText>{importMessage}</MetaText> : null}

            {loading ? <MetaText>Laden…</MetaText> : null}

            {overviewError ? (
              <StateBlock tone="error" message="Kon het overzicht niet laden." detail={overviewError} />
            ) : null}

            {!loading && !overviewError && tasks.length === 0 ? (
              <StateBlock
                tone="info"
                message="Nog geen onderdelen gevonden"
                detail="Importeer eerst de runtime-basis om groepen te openen."
              />
            ) : null}
          </SurfaceSection>

          {loadingDebugStorage || debugStorage || debugStorageError ? (
            <SurfaceSection title="OpenAI debug-opslag (admin)">
              {loadingDebugStorage ? <MetaText>Debug-opslag laden…</MetaText> : null}

              {debugStorageError ? (
                <StateBlock
                  tone="error"
                  message="Debug-opslag niet beschikbaar"
                  detail={debugStorageError}
                />
              ) : null}

              {debugStorage?.backend.persistence === 'ephemeral_fallback' ? (
                <StateBlock
                  tone="info"
                  message="Debug-opslag draait in tijdelijke fallback-modus"
                  detail={
                    debugStorage.backend.message ??
                    'Persistente private-opslag is niet beschikbaar; wijzigingen kunnen tijdelijk zijn.'
                  }
                />
              ) : null}

              {debugStorage ? (
                <>
              <MetaText>
                Alleen ondersteunde generatiecalls. Audio-transcriptie valt buiten scope.
              </MetaText>
              <MetaText>
                Master: {debugStorage.masterEnabled ? 'aan' : 'uit'}
                {debugStorage.masterExpiresAt ? ` · verloopt ${debugStorage.masterExpiresAt}` : ''}
              </MetaText>
              <ThemedView style={styles.debugActionsRow}>
                <PrimaryButton
                  label={updatingDebugStorage ? 'Bijwerken…' : 'Master aan (4u)'}
                  onPress={() => void handleSetMasterDebugStorage(true)}
                  disabled={updatingDebugStorage}
                />
                <SecondaryButton
                  label="Master uit"
                  onPress={() => void handleSetMasterDebugStorage(false)}
                  disabled={updatingDebugStorage}
                />
              </ThemedView>

              {debugStorage.flows.map((flow) => (
                <ThemedView key={flow.flowKey} style={[styles.taskRow, { backgroundColor: palette.surfaceLow }]}>
                  <ThemedText type="defaultSemiBold">{flow.flowKey}</ThemedText>
                  <MetaText>
                    Status: {flow.state}
                    {flow.reason ? ` · reden: ${flow.reason}` : ''}
                  </MetaText>
                  <MetaText>
                    Gewenst: {flow.desiredOn ? 'aan' : 'uit'} · effectief: {flow.effectiveOn ? 'aan' : 'uit'}
                  </MetaText>
                  <ThemedView style={styles.debugActionsRow}>
                    <PrimaryButton
                      label="Flow aan (4u)"
                      onPress={() => void handleSetFlowDebugStorage(flow.flowKey, true)}
                      disabled={updatingDebugStorage}
                    />
                    <SecondaryButton
                      label="Flow uit"
                      onPress={() => void handleSetFlowDebugStorage(flow.flowKey, false)}
                      disabled={updatingDebugStorage}
                    />
                  </ThemedView>
                </ThemedView>
              ))}
                </>
              ) : null}
            </SurfaceSection>
          ) : null}

          {!loading && !overviewError ? (
            <SurfaceSection title="Groepen">
              <ThemedView style={styles.taskList}>
                {groupRows.map((group) => {
                  const showGroupScreen = shouldShowAiQualityGroupScreen(tasks, group.key);
                  const primaryTaskKey = getAiQualityFamilyPrimaryTaskKey(tasks, group.key);
                  const openLabel = showGroupScreen ? 'Open onderdelen' : 'Open prompt';

                  return (
                    <Pressable
                      key={group.key}
                      accessibilityRole="button"
                      accessibilityLabel={`${group.title} openen`}
                      onPress={() => {
                        if (showGroupScreen) {
                          router.push(`/settings-ai-quality-studio/group/${group.key}` as never);
                          return;
                        }
                        if (primaryTaskKey) {
                          router.push(`/settings-ai-quality-studio/${primaryTaskKey}` as never);
                        }
                      }}
                      style={[styles.taskRow, { backgroundColor: palette.surfaceLow }]}
                    >
                    <ThemedView style={styles.taskRowTop}>
                      <ThemedText type="defaultSemiBold">{group.title}</ThemedText>
                      <MetaText>{group.description}</MetaText>
                    </ThemedView>

                    <MetaText>
                      {group.componentCountLabel} · {group.statusSummary}
                    </MetaText>
                    {group.sharedRuntimeCall ? (
                      <MetaText>Gedeelde runtime-call · 1 centrale prompt</MetaText>
                    ) : null}
                    <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                      {openLabel}
                    </ThemedText>
                  </Pressable>
                  );
                })}
              </ThemedView>
            </SurfaceSection>
          ) : null}
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
  taskList: {
    gap: spacing.sm,
  },
  taskRow: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  taskRowTop: {
    gap: spacing.xxs,
  },
  debugActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
