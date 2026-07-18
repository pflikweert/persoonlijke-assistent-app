import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedView } from '@/components/themed-view';
import {
  AdminConsoleButton,
  AdminConsoleHeader,
  AdminConsoleShell,
  AdminDenseRow,
  AdminListTableHeader,
  AdminListTableRow,
  AdminSectionList,
  AdminStatusChip,
  AdminStatusNotice,
  AdminToggleRow,
} from '@/components/ui/admin-console-primitives';
import { MetaText, StateBlock } from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  fetchAdminOpenAiDebugStorageSettings,
  fetchAdminAiQualityStudioTasks,
  hasAdminAiQualityStudioAccess,
  importAdminAiQualityRuntimeBaseline,
  updateAdminOpenAiDebugStorageSettings,
} from '@/services';
import type { AiOpenAiDebugFlowKey, AiOpenAiDebugStorageSettings, AiTaskSummary } from '@/types';
import { spacing } from '@/theme';
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
      const { created, live_created, preserved, already_ok, error } = result.summary;
      setImportMessage(
        `Taken aangemaakt: ${created} · live gemaakt: ${live_created} · bestaand behouden: ${preserved} · al goed: ${already_ok} · errors: ${error}`
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
    };
  }, [tasks]);

  const groupRows = useMemo(() => buildAiQualityStudioReadModel(tasks).families, [tasks]);
  const familiesWithoutLive = useMemo(
    () => groupRows.filter((group) => !group.statusSummary.includes('live') || group.statusSummary.startsWith('0/')).length,
    [groupRows]
  );
  const hasRuntimeBaseline = totals.live > 0;
  const hasHealthyRuntime = hasRuntimeBaseline && familiesWithoutLive === 0;
  const statusTitle = !loading && tasks.length === 0
    ? 'Nog geen runtime-basis'
    : hasHealthyRuntime
      ? 'Alle runtimes actief'
      : familiesWithoutLive === 1
        ? '1 promptfamilie mist live baseline'
        : `${familiesWithoutLive} promptfamilies missen live baseline`;
  const statusDetail = importMessage
    ? importMessage
    : !loading && tasks.length === 0
      ? 'Importeer eerst de runtime-basis om promptfamilies te beheren.'
      : hasHealthyRuntime
        ? null
        : 'Werk ontbrekende live baselines bij voordat je runtime-prompts als gezond beschouwt.';
  const statusTone = !loading && tasks.length === 0 ? 'warning' : hasHealthyRuntime ? 'success' : 'warning';
  const hasDebugDetails = Boolean(
    debugStorageError ||
    debugStorage?.backend.persistence === 'ephemeral_fallback' ||
    (debugStorage?.flows.length ?? 0) > 0
  );

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
      onBack={() => router.replace("/settings")}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.scrollContent}
    >
      <AdminConsoleHeader
        title="AI Quality Studio"
        subtitle="Beheer promptfamilies, drafts en runtimekwaliteit."
        actions={
          !hasRuntimeBaseline ? (
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

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor admins met AIQS-rechten."
        />
      ) : null}

      {adminAccess !== false ? (
        <>
          {loading ? <StateBlock tone="loading" message="Overzicht laden" /> : null}

          {overviewError ? (
            <StateBlock tone="error" message="Kon het overzicht niet laden." detail={overviewError} />
          ) : null}

          {!loading && !overviewError ? (
            <AdminStatusNotice
              tone={statusTone}
              title={statusTitle}
              detail={statusDetail ?? undefined}
              variant={hasHealthyRuntime ? 'inline' : 'default'}
              action={
                !hasRuntimeBaseline ? (
                  <AdminConsoleButton
                    label={importingBaseline ? 'Importeren…' : 'Importeer baseline'}
                    onPress={() => void handleImportBaseline()}
                    disabled={importingBaseline}
                    icon="download"
                    tone="primary"
                  />
                ) : null
              }
            />
          ) : null}

          {!loading && !overviewError ? (
            <AdminSectionList title="Promptfamilies" variant="plain">
              <ThemedView style={styles.taskList}>
                <AdminListTableHeader />
                {groupRows.map((group) => {
                  const showGroupScreen = shouldShowAiQualityGroupScreen(tasks, group.key);
                  const primaryTaskKey = getAiQualityFamilyPrimaryTaskKey(tasks, group.key);
                  const groupIsLive = group.statusSummary.includes('live') && !group.statusSummary.startsWith('0/');
                  const groupHasDraft = group.tasks.some((item) => item.task.hasDraft);
                  const promptMeta = [
                    group.componentCountLabel.replace('runtime-varianten', 'varianten'),
                    group.sharedRuntimeCall ? 'Gedeelde call' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ');

                  return (
                    <AdminListTableRow
                      key={group.key}
                      title={group.title}
                      description={group.description}
                      metadata={promptMeta}
                      draftLabel={groupHasDraft ? 'Draft' : null}
                      onPress={() => {
                        if (showGroupScreen) {
                          router.push(`/settings-ai-quality-studio/group/${group.key}` as never);
                          return;
                        }
                        if (primaryTaskKey) {
                          router.push(`/settings-ai-quality-studio/${primaryTaskKey}` as never);
                        }
                      }}
                      chips={
                        !groupIsLive ? (
                          <AdminStatusChip label="Baseline ontbreekt" tone="warning" />
                        ) : null
                      }
                    />
                  );
                })}
              </ThemedView>
            </AdminSectionList>
          ) : null}

          {loadingDebugStorage || debugStorage || debugStorageError ? (
            <AdminSectionList title="Systeem" variant="plain">
              <AdminToggleRow
                title="Debug logging"
                description="Tijdelijke logging voor generatiecalls."
                value={Boolean(debugStorage?.masterEnabled)}
                onChange={(next) => void handleSetMasterDebugStorage(next)}
                disabled={loadingDebugStorage || updatingDebugStorage || !debugStorage}
                meta={
                  debugStorage?.masterEnabled
                    ? `Actief tot ${formatDebugExpiry(debugStorage.masterExpiresAt)}`
                    : 'Status: Uit'
                }
                mode="singleAction"
                expanded={debugUtilityOpen}
                onToggleExpanded={hasDebugDetails ? () => setDebugUtilityOpen((value) => !value) : undefined}
                expandedContent={hasDebugDetails ? (
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
                        {debugStorage.flows.map((flow) => (
                          <AdminDenseRow
                            key={flow.flowKey}
                            title={DEBUG_FLOW_LABELS[flow.flowKey] ?? flow.flowKey}
                            subtitle={`Gewenst: ${flow.desiredOn ? 'aan' : 'uit'} · effectief: ${flow.effectiveOn ? 'aan' : 'uit'}`}
                            meta={`${flow.reason ? `Reden: ${flow.reason} · ` : ''}${flow.expiresAt ? `Vervalt ${formatDebugExpiry(flow.expiresAt)}` : 'Geen vervaltijd'}`}
                            metaTone="soft"
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
                ) : undefined}
              />
            </AdminSectionList>
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
    maxWidth: 920,
    alignSelf: 'center',
    paddingBottom: spacing.xxxl,
    gap: spacing.xxxl,
  },
  taskList: {
    gap: 0,
  },
  utilityBody: {
    gap: spacing.sm,
  },
  debugActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
