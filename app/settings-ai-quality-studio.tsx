import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminConsoleButton,
  AdminConsoleHeader,
  AdminConsoleKeyValue,
  AdminConsolePanel,
  AdminConsoleShell,
  AdminDenseRow,
  AdminInspectorPanel,
  AdminMetricCard,
  AdminMetricGrid,
  AdminStatusChip,
} from '@/components/ui/admin-console-primitives';
import { MetaText, StateBlock } from '@/components/ui/screen-primitives';
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

const DEBUG_FLOW_LABELS: Record<AiOpenAiDebugFlowKey, string> = {
  'admin-ai-quality-studio.prompt_assist_preview': 'Prompt assist preview',
  'admin-ai-quality-studio.run_test': 'Test run',
  'generate-reflection.generation': 'Reflectie generatie',
  'process-entry.generation': 'Entry generatie',
  'regenerate-day-journal.generation': 'Dagjournal regeneratie',
};

function formatDebugExpiry(value: string | null): string {
  if (!value) {
    return 'geen vervaltijd';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('nl-NL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

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
  const [debugUtilityOpen, setDebugUtilityOpen] = useState(false);

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
      const { created, updated, live_created, already_ok, error } = result.summary;
      setImportMessage(
        `Taken aangemaakt: ${created} · live gemaakt: ${live_created} · bijgewerkt: ${updated} · al goed: ${already_ok} · errors: ${error}`
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
    <AdminConsoleShell
      onBack={() => router.back()}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.scrollContent}
      inspector={
        <AdminInspectorPanel title="AIQS context" subtitle="Runtime governance">
          <ThemedView style={styles.inspectorStack}>
            <AdminConsoleKeyValue label="Live taken" value={String(totals.live)} />
            <AdminConsoleKeyValue label="Drafts" value={String(totals.draftOnly)} />
            <AdminConsoleKeyValue label="Debug logging" value={debugStorage?.masterEnabled ? "Aan" : "Uit"} />
          </ThemedView>
        </AdminInspectorPanel>
      }
    >
      <AdminConsoleHeader
        eyebrow="AI governance"
        title="AI Quality Studio"
        subtitle="Beheer live prompts, varianten en runtimekwaliteit vanuit één compacte admin-console."
        chips={
          <>
            <AdminStatusChip
              label={totals.live === 0 ? 'Baseline ontbreekt' : `${totals.live} live`}
              tone={totals.live === 0 ? 'warning' : 'success'}
            />
            <AdminStatusChip label={`${totals.draftOnly} drafts`} tone={totals.draftOnly > 0 ? 'info' : 'neutral'} />
            <AdminStatusChip label={`${totals.total} taken`} />
          </>
        }
        actions={
          totals.live === 0 ? (
            <AdminConsoleButton
              label={importingBaseline ? 'Importeren…' : 'Importeer baseline'}
              onPress={() => void handleImportBaseline()}
              disabled={importingBaseline || loading}
              icon="download"
              tone="primary"
            />
          ) : null
        }
      />

      <AdminMetricGrid>
        <AdminMetricCard label="Live" value={totals.live} meta="runtime-versies" tone={totals.live > 0 ? "success" : "warning"} />
        <AdminMetricCard label="Drafts" value={totals.draftOnly} meta="nog niet live" tone={totals.draftOnly > 0 ? "info" : "neutral"} />
        <AdminMetricCard label="Totaal" value={totals.total} meta="AIQS taken" />
        <AdminMetricCard label="Geen live" value={totals.noLive} meta="fail-closed risico" tone={totals.noLive > 0 ? "warning" : "success"} />
      </AdminMetricGrid>

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor admins met AIQS-rechten."
        />
      ) : null}

      {adminAccess !== false ? (
        <>
          <AdminConsolePanel title="Runtime status">
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
          </AdminConsolePanel>

          {loadingDebugStorage || debugStorage || debugStorageError ? (
            <AdminConsolePanel>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDebugUtilityOpen((value) => !value)}
                style={styles.utilityHeader}
              >
                <ThemedView style={styles.utilityHeaderText}>
                  <ThemedText type="defaultSemiBold">Debug logging</ThemedText>
                  <MetaText>
                    {debugStorage?.masterEnabled
                      ? `Runtime actief · vervalt ${formatDebugExpiry(debugStorage.masterExpiresAt)}`
                      : 'Utility · standaard uit'}
                  </MetaText>
                </ThemedView>
                <AdminStatusChip label={debugStorage?.masterEnabled ? 'Logging aan' : 'Logging uit'} tone={debugStorage?.masterEnabled ? 'info' : 'neutral'} />
              </Pressable>

              {debugUtilityOpen ? (
                <ThemedView style={styles.utilityBody}>
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
                      message="Tijdelijke fallback"
                      detail={
                        debugStorage.backend.message ??
                        'Persistente private-opslag is niet beschikbaar; wijzigingen kunnen tijdelijk zijn.'
                      }
                    />
                  ) : null}

                  {debugStorage ? (
                    <>
                      <MetaText>Alleen ondersteunde generatiecalls. Audio-transcriptie valt buiten scope.</MetaText>
                      <ThemedView style={styles.debugActionsRow}>
                        <AdminConsoleButton
                          label={updatingDebugStorage ? 'Bijwerken…' : '4 uur aan'}
                          onPress={() => void handleSetMasterDebugStorage(true)}
                          disabled={updatingDebugStorage}
                          icon="schedule"
                          tone="secondary"
                        />
                        <AdminConsoleButton
                          label="Uit"
                          onPress={() => void handleSetMasterDebugStorage(false)}
                          disabled={updatingDebugStorage}
                        />
                      </ThemedView>

                      {debugStorage.flows.map((flow) => (
                        <AdminDenseRow
                          key={flow.flowKey}
                          title={DEBUG_FLOW_LABELS[flow.flowKey] ?? flow.flowKey}
                          subtitle={`Gewenst: ${flow.desiredOn ? 'aan' : 'uit'} · effectief: ${flow.effectiveOn ? 'aan' : 'uit'}`}
                          meta={`${flow.reason ? `Reden: ${flow.reason} · ` : ''}${flow.expiresAt ? `Vervalt ${formatDebugExpiry(flow.expiresAt)}` : 'Geen vervaltijd'}`}
                          chips={
                            <AdminStatusChip
                              label={flow.effectiveOn ? 'Actief' : flow.desiredOn ? 'Aangevraagd' : 'Uit'}
                              tone={flow.effectiveOn ? 'info' : flow.desiredOn ? 'warning' : 'neutral'}
                            />
                          }
                          trailing={
                            <ThemedView style={styles.debugActionsRow}>
                              <AdminConsoleButton
                                label="4 uur aan"
                                onPress={() => void handleSetFlowDebugStorage(flow.flowKey, true)}
                                disabled={updatingDebugStorage}
                              />
                              <AdminConsoleButton
                                label="Uit"
                                onPress={() => void handleSetFlowDebugStorage(flow.flowKey, false)}
                                disabled={updatingDebugStorage}
                              />
                            </ThemedView>
                          }
                        />
                      ))}
                    </>
                  ) : null}
                </ThemedView>
              ) : null}
            </AdminConsolePanel>
          ) : null}

          {!loading && !overviewError ? (
            <AdminConsolePanel title="Prompt families" subtitle="Open een familie of direct de centrale prompt.">
              <ThemedView style={styles.taskList}>
                {groupRows.map((group) => {
                  const showGroupScreen = shouldShowAiQualityGroupScreen(tasks, group.key);
                  const primaryTaskKey = getAiQualityFamilyPrimaryTaskKey(tasks, group.key);
                  const openLabel = showGroupScreen ? 'Open onderdelen' : 'Open prompt';
                  const groupIsLive = group.statusSummary.includes('live') && !group.statusSummary.startsWith('0/');

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
                      style={styles.taskRowPressable}
                    >
                      <AdminDenseRow
                        title={group.title}
                        subtitle={group.description}
                        meta={`${group.componentCountLabel} · ${group.statusSummary}`}
                        chips={
                          <>
                            {group.sharedRuntimeCall ? <AdminStatusChip label="Gedeelde call" tone="info" /> : null}
                            <AdminStatusChip label={groupIsLive ? 'Runtime actief' : 'Baseline ontbreekt'} tone={groupIsLive ? 'success' : 'warning'} />
                          </>
                        }
                        trailing={<ThemedText type="caption" style={{ color: palette.mutedSoft }}>{openLabel}</ThemedText>}
                      />
                    </Pressable>
                  );
                })}
              </ThemedView>
            </AdminConsolePanel>
          ) : null}
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminConsoleShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  taskList: {
    gap: 0,
  },
  taskRowPressable: {
    borderRadius: radius.md,
  },
  utilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  utilityHeaderText: {
    flex: 1,
    gap: spacing.xxs,
  },
  utilityBody: {
    gap: spacing.sm,
  },
  inspectorStack: {
    gap: spacing.sm,
  },
  debugActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
