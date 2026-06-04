import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ConfirmSheet } from '@/components/feedback/destructive-confirm-sheet';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminActionBar,
  AdminConsoleButton,
  AdminConsoleHeader,
  AdminConsoleKeyValue,
  AdminConsolePanel,
  AdminConsoleShell,
  AdminDenseRow,
  AdminInspectorPanel,
  AdminStatusChip,
} from '@/components/ui/admin-console-primitives';
import { MetaText, StateBlock } from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  createAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
  promoteAdminAiQualityStudioVersionLive,
} from '@/services';
import type { AiTaskDetail, AiTaskVersionDetail } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';
import { formatDateTimeLabel, versionStatusLabel } from './_shared';
import {
  getAiQualityTaskCapabilities,
  getAiQualityFamilyPrimaryTaskKey,
  getAiQualityTaskMetadata,
  shouldBypassAiQualityTaskOverview,
} from '@/services/ai-quality-studio/readmodel';
import {
  getAiQualityVersionLifecycleState,
  type AiQualityVersionLifecycleState,
} from '@/src/lib/ai-quality-lifecycle';

function isDraftVersion(version: AiTaskVersionDetail): boolean {
  return version.status === 'draft';
}

function variantRoleLabel(value: string): string {
  if (value === 'primary') return 'Primary';
  if (value === 'repair') return 'Repair';
  if (value === 'renormalization') return 'Renormalization';
  return value;
}

export default function AiQualityStudioTaskOverviewScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { taskKey } = useLocalSearchParams<{ taskKey?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [promotingVersion, setPromotingVersion] = useState(false);
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    version: AiTaskVersionDetail;
    state: AiQualityVersionLifecycleState;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<AiTaskDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const draftVersion = useMemo(
    () => detail?.versions.find((version) => version.status === 'draft') ?? null,
    [detail]
  );
  const taskCapabilities = useMemo(
    () => (detail ? getAiQualityTaskCapabilities(detail.key) : null),
    [detail]
  );
  const taskMetadata = useMemo(() => (detail ? getAiQualityTaskMetadata(detail.key, detail.label, detail) : null), [detail]);
  const hasLive = Boolean(detail?.liveVersion);
  const draftLifecycle = useMemo(() => {
    if (!detail || !draftVersion) return null;
    return getAiQualityVersionLifecycleState(detail, draftVersion);
  }, [detail, draftVersion]);

  const primaryLabel =
    taskMetadata?.editorScope === 'read_only_part'
      ? 'Open gedeelde prompt'
      : taskMetadata?.editorScope === 'family'
        ? draftVersion
          ? 'Gedeelde prompt openen'
          : hasLive
            ? 'Nieuwe gedeelde draft op basis van live'
            : 'Eerste gedeelde draft maken'
        : draftVersion
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
    setSuccessMessage(null);

    try {
      const nextDetail = await fetchAdminAiQualityStudioTaskDetail(normalizedTaskKey);
      const metadata = getAiQualityTaskMetadata(nextDetail.key, nextDetail.label);
      if (shouldBypassAiQualityTaskOverview(nextDetail.key, nextDetail.label) && metadata.familyKey) {
        if (metadata.editorTargetTaskKey) {
          router.replace(`/settings-ai-quality-studio/${metadata.editorTargetTaskKey}` as never);
          return;
        }

        const fallbackPrimaryTask = getAiQualityFamilyPrimaryTaskKey([nextDetail], metadata.familyKey);
        if (fallbackPrimaryTask) {
          router.replace(`/settings-ai-quality-studio/${fallbackPrimaryTask}` as never);
          return;
        }

        router.replace('/settings-ai-quality-studio' as never);
        return;
      }
      if (metadata.editorScope === 'read_only_part' && metadata.editorTargetTaskKey) {
        router.replace(`/settings-ai-quality-studio/${metadata.editorTargetTaskKey}` as never);
        return;
      }
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

    if (taskMetadata?.editorScope === 'read_only_part' && taskMetadata.editorTargetTaskKey) {
      router.replace(`/settings-ai-quality-studio/${taskMetadata.editorTargetTaskKey}` as never);
      return;
    }

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

  async function handlePromoteTarget() {
    if (!detail || !lifecycleTarget || promotingVersion) return;

    setPromotingVersion(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await promoteAdminAiQualityStudioVersionLive({
        taskKey: detail.key,
        versionId: lifecycleTarget.version.id,
      });
      setLifecycleTarget(null);
      await load();
      setSuccessMessage(
        result.mode === 'rollback_archived'
          ? `v${result.promotedVersion.versionNumber} is opnieuw live.`
          : `v${result.promotedVersion.versionNumber} is live gezet.`
      );
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setPromotingVersion(false);
    }
  }

  function openLifecycleConfirm(version: AiTaskVersionDetail, state: AiQualityVersionLifecycleState) {
    if (!state.canRunAction) return;
    setLifecycleTarget({ version, state });
  }

  return (
    <AdminConsoleShell
      onBack={() => router.back()}
      onMenu={() => setMenuVisible(true)}
      fixedFooter={
        !loading && detail ? (
          <AdminActionBar
            floating
            primary={{
              label: creatingDraft ? 'Versie maken…' : primaryLabel,
              onPress: () => void handlePrimaryAction(),
              disabled: creatingDraft,
              icon: draftVersion ? 'edit' : 'add-circle-outline',
            }}
            secondary={
              draftVersion && taskCapabilities?.canReview
                ? {
                    label: 'Valideren',
                    onPress: () =>
                      router.push(`/settings-ai-quality-studio/${detail.key}/validate/${draftVersion.id}` as never),
                    icon: 'science',
                  }
                : undefined
            }
          />
        ) : null
      }
      contentContainerStyle={styles.scrollContent}
      inspector={
        detail ? (
          <AdminInspectorPanel title="Runtime metadata" subtitle={taskMetadata?.runtimeBindingKey ?? "Geen binding"}>
            <ThemedView style={styles.inspectorStack}>
              <AdminConsoleKeyValue label="Task key" value={detail.key} />
              <AdminConsoleKeyValue label="Input" value={detail.inputType} />
              <AdminConsoleKeyValue label="Output" value={detail.outputType} />
              <AdminConsoleKeyValue label="Live versie" value={detail.liveVersion ? `v${detail.liveVersion.versionNumber}` : "Geen live"} />
            </ThemedView>
          </AdminInspectorPanel>
        ) : null
      }
    >
      <AdminConsoleHeader
        eyebrow={taskMetadata?.familyTitle ?? 'Prompt task'}
        title={detail?.label ?? (typeof taskKey === 'string' ? taskKey : 'Onderdeel')}
        subtitle={detail?.description ?? 'AI Quality Studio'}
        chips={
          detail ? (
            <>
              <AdminStatusChip label={`Input ${detail.inputType}`} />
              <AdminStatusChip label={`Output ${detail.outputType}`} />
              <AdminStatusChip
                label={detail.liveVersion ? `Live v${detail.liveVersion.versionNumber}` : 'Baseline ontbreekt'}
                tone={detail.liveVersion ? 'success' : 'warning'}
              />
              {draftVersion ? <AdminStatusChip label="Draft aanwezig" tone="info" /> : null}
              {taskMetadata?.isRuntimeDriver ? <AdminStatusChip label="Driver" tone="success" /> : null}
              {taskMetadata?.variantRole ? <AdminStatusChip label={variantRoleLabel(taskMetadata.variantRole)} tone="info" /> : null}
            </>
          ) : null
        }
      />

      {loading ? <StateBlock tone="loading" message="Onderdeel laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon onderdeel niet laden." detail={error} /> : null}
      {!loading && successMessage ? <StateBlock tone="success" message={successMessage} /> : null}

      {!loading && detail ? (
        <>
          {taskMetadata?.editorScope === 'family' ? (
            <StateBlock
              tone="info"
              message="Gedeelde prompt"
              detail="Dit onderdeel wordt samen met andere outputvelden via één runtime-call bewerkt."
            />
          ) : null}

          <AdminConsolePanel title="Contract">
            <ThemedText type="defaultSemiBold">{detail.label}</ThemedText>
            {detail.description ? <ThemedText type="bodySecondary">{detail.description}</ThemedText> : null}
            <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
              key: {detail.key} · input: {detail.inputType} · output: {detail.outputType}
            </ThemedText>
          </AdminConsolePanel>

          <AdminConsolePanel title="Live versie">
            {detail.liveVersion ? (
              <ThemedView style={styles.fieldGroup}>
                <ThemedView style={styles.chipInline}>
                  <AdminStatusChip label="Live" tone="success" />
                  {taskMetadata?.runtimeBindingKey ? <AdminStatusChip label="Runtime actief" tone="info" /> : null}
                </ThemedView>
                <MetaText>
                  v{detail.liveVersion.versionNumber} · {detail.liveVersion.model}
                </MetaText>
                <MetaText>Aangemaakt: {formatDateTimeLabel(detail.liveVersion.createdAt)}</MetaText>
                <MetaText>Bijgewerkt: {formatDateTimeLabel(detail.liveVersion.updatedAt)}</MetaText>
                <MetaText>
                  {taskMetadata?.runtimeBindingKey
                    ? 'Deze live versie wordt direct door de runtime gebruikt.'
                    : 'Deze live versie is de actuele AIQS-basis voor dit onderdeel.'}
                </MetaText>
              </ThemedView>
            ) : (
              <StateBlock
                tone="info"
                message="Nog geen runtime-basis"
                detail="Importeer eerst de huidige runtime-baseline voor deze task."
              />
            )}
          </AdminConsolePanel>

          <AdminConsolePanel title="Lifecycle" subtitle="Van draftbewijs naar runtime-live.">
            {draftVersion && draftLifecycle ? (
              <ThemedView style={styles.fieldGroup}>
                <ThemedView style={styles.chipInline}>
                  <AdminStatusChip
                    label={draftLifecycle.label}
                    tone={draftLifecycle.canRunAction ? 'success' : 'warning'}
                  />
                  <AdminStatusChip label={`${draftVersion.completedTestRunCount} test(s)`} />
                  <AdminStatusChip label={`${draftVersion.positiveReviewCount} positief`} />
                </ThemedView>
                <ThemedText type="defaultSemiBold">Draft v{draftVersion.versionNumber}</ThemedText>
                <MetaText>{draftLifecycle.detail}</MetaText>
                {draftLifecycle.actionLabel ? (
                  <ThemedView style={styles.lifecycleActionRow}>
                    <AdminConsoleButton
                      label={draftLifecycle.actionLabel}
                      icon="rocket-launch"
                      tone="primary"
                      disabled={promotingVersion || !draftLifecycle.canRunAction}
                      onPress={() => openLifecycleConfirm(draftVersion, draftLifecycle)}
                    />
                  </ThemedView>
                ) : (
                  <MetaText>
                    {draftLifecycle.id === 'draft_needs_test'
                      ? 'Open validate om een test te draaien.'
                      : 'Sla in validate eerst een oordeel beter of gelijk op.'}
                  </MetaText>
                )}
              </ThemedView>
            ) : (
              <StateBlock
                tone="info"
                message="Geen actieve draft"
                detail="Maak een draft om een nieuwe live-kandidaat te testen."
              />
            )}
          </AdminConsolePanel>

          <AdminConsolePanel title="Versies" subtitle="Drafts zijn bewerkbaar; live versies blijven de runtime-basis.">
            <ThemedView style={styles.versionList}>
              {detail.versions.map((version) => {
                const isDraft = isDraftVersion(version);
                const lifecycle = getAiQualityVersionLifecycleState(detail, version);
                const hasRowActions = isDraft || Boolean(lifecycle.actionLabel);
                return (
                  <AdminDenseRow
                    key={version.id}
                    title={`v${version.versionNumber} · ${versionStatusLabel(version.status)}`}
                    subtitle={version.model}
                    meta={`${lifecycle.detail} · bijgewerkt ${formatDateTimeLabel(version.updatedAt)}`}
                    chips={
                      <ThemedView style={styles.chipInline}>
                        <AdminStatusChip label={lifecycle.label} tone={lifecycle.canRunAction ? 'success' : version.status === 'live' ? 'success' : isDraft ? 'info' : 'neutral'} />
                        {version.latestReviewLabel ? <AdminStatusChip label={`Review ${version.latestReviewLabel}`} tone={version.positiveReviewCount > 0 ? 'success' : 'warning'} /> : null}
                      </ThemedView>
                    }
                    trailing={
                      hasRowActions ? (
                        <ThemedView style={styles.versionActions}>
                          {isDraft ? (
                            <AdminConsoleButton
                              label="Open draft"
                              icon="edit"
                              onPress={() =>
                                router.push(`/settings-ai-quality-studio/${detail.key}/draft/${version.id}` as never)
                              }
                            />
                          ) : null}
                          {isDraft && taskCapabilities?.canReview ? (
                            <AdminConsoleButton
                              label="Valideren"
                              icon="science"
                              onPress={() =>
                                router.push(`/settings-ai-quality-studio/${detail.key}/validate/${version.id}` as never)
                              }
                            />
                          ) : null}
                          {lifecycle.actionLabel ? (
                            <AdminConsoleButton
                              label={lifecycle.actionLabel}
                              icon={lifecycle.action === 'rollback' ? 'restore' : 'rocket-launch'}
                              disabled={promotingVersion || !lifecycle.canRunAction}
                              onPress={() => openLifecycleConfirm(version, lifecycle)}
                            />
                          ) : null}
                        </ThemedView>
                      ) : null
                    }
                  />
                );
              })}
            </ThemedView>
          </AdminConsolePanel>
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
      <ConfirmSheet
        visible={Boolean(lifecycleTarget)}
        title={lifecycleTarget?.state.action === 'rollback' ? 'Rollback bevestigen' : 'Live zetten bevestigen'}
        message={
          lifecycleTarget?.state.action === 'rollback'
            ? `Huidige live versie wordt gearchiveerd en v${lifecycleTarget.version.versionNumber} wordt opnieuw live.`
            : 'Deze versie wordt direct runtime-live.'
        }
        detail={
          lifecycleTarget
            ? `${detail?.label ?? 'AIQS'} · v${lifecycleTarget.version.versionNumber}`
            : undefined
        }
        processing={promotingVersion}
        actions={[
          {
            key: 'cancel',
            label: 'Annuleren',
            onPress: () => {
              if (!promotingVersion) setLifecycleTarget(null);
            },
          },
          {
            key: 'confirm',
            label: promotingVersion ? 'Bezig…' : lifecycleTarget?.state.action === 'rollback' ? 'Rollback' : 'Zet live',
            onPress: () => void handlePromoteTarget(),
            disabled: promotingVersion,
            icon: lifecycleTarget?.state.action === 'rollback' ? 'restore' : 'rocket-launch',
          },
        ]}
        onCancel={() => {
          if (!promotingVersion) setLifecycleTarget(null);
        }}
        onConfirm={() => void handlePromoteTarget()}
      />
    </AdminConsoleShell>
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
    gap: 0,
  },
  chipInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  lifecycleActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  versionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  inspectorStack: {
    gap: spacing.sm,
  },
});
