import { router, useFocusEffect, useLocalSearchParams, usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { ConfirmSheet, type ConfirmSheetAction } from '@/components/feedback/destructive-confirm-sheet';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  AdminActionBar,
  AdminConsoleButton,
  AdminConsoleHeader,
  AdminConsolePanel,
  AdminConsoleShell,
  AdminSectionList,
  AdminStatusChip,
  AdminStatusNotice,
} from '@/components/ui/admin-console-primitives';
import { MetaText, StateBlock } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  cleanupAdminAiQualityStudioArchivedVersions,
  classifyUnknownError,
  createAdminAiQualityStudioDraftVersion,
  deleteAdminAiQualityStudioArchivedVersion,
  deleteAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
  promoteAdminAiQualityStudioVersionLive,
} from '@/services';
import {
  getAiQualityTaskCapabilities,
  getAiQualityFamilyPrimaryTaskKey,
  getAiQualityTaskMetadata,
  shouldBypassAiQualityTaskOverview,
} from '@/services/ai-quality-studio/readmodel';
import {
  getAiQualityArchivedCleanupPlan,
  getAiQualityVersionLifecycleState,
  getAiQualityVersionManagementState,
  type AiQualityVersionLifecycleState,
} from '@/src/lib/ai-quality-lifecycle';
import { getSettingsBackTarget } from '@/src/lib/navigation/settings-navigation';
import { colorTokens, spacing } from '@/theme';
import type { AiTaskDetail, AiTaskVersionDetail } from '@/types';
import {
  formatDateTimeLabel,
  getStructuredPromptEditorDefinition,
  parseStructuredPromptInstructionSections,
  toDraftFormState,
  versionStatusLabel,
} from './_shared';

const ARCHIVE_CLEANUP_KEEP_LATEST = 3;

type DestructiveTarget =
  | { kind: 'draft'; version: AiTaskVersionDetail }
  | { kind: 'archived'; version: AiTaskVersionDetail }
  | { kind: 'cleanup' };

function getVersionStatusTone(version: AiTaskVersionDetail): 'success' | 'info' | 'neutral' | 'warning' {
  if (version.status === 'live') return 'success';
  if (version.status === 'draft') return 'info';
  if (version.status === 'testing') return 'warning';
  return 'neutral';
}

function formatEvidence(version: AiTaskVersionDetail): string {
  if (version.completedTestRunCount <= 0) return 'Geen tests';
  if (version.positiveReviewCount > 0) return `${version.positiveReviewCount}/${version.completedTestRunCount} tests positief`;
  return `${version.completedTestRunCount} test(s)`;
}

function formatJson(value: Record<string, unknown>): string {
  return JSON.stringify(value ?? {}, null, 2);
}

function formatRuntimeFamily(value: AiTaskDetail['runtimeFamily']): string | null {
  if (!value || value === 'unknown') return null;
  return value.replace(/_/g, ' ');
}

function buildVersionViewerSections(detail: AiTaskDetail, version: AiTaskVersionDetail) {
  const form = toDraftFormState(version);
  const definition = getStructuredPromptEditorDefinition(detail.key);
  const structuredSections = parseStructuredPromptInstructionSections(detail.key, form.taskInstruction);
  const resolvedSections = definition.sections
    .map((section) => ({
      key: section.key,
      label: section.label,
      value: structuredSections[section.key]?.trim() ?? '',
    }))
    .filter((section) => section.value.length > 0);

  return {
    systemInstructions: version.systemInstructions.trim(),
    structuredSections,
    resolvedSections,
    rawPrompt: form.promptTemplateRaw,
    outputSchemaJson: formatJson(version.outputSchemaJson),
    configJson: formatJson(version.configJson),
  };
}

function VersionTableHeader() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { width } = useWindowDimensions();
  if (width < 760) return null;

  return (
    <ThemedView style={[styles.versionHeader, { borderTopColor: palette.separator }]}>
      <ThemedText type="caption" style={[styles.versionColumnVersion, styles.headerLabel, { color: palette.mutedSoft }]}>
        Versie
      </ThemedText>
      <ThemedText type="caption" style={[styles.versionColumnStatus, styles.headerLabel, { color: palette.mutedSoft }]}>
        Status
      </ThemedText>
      <ThemedText type="caption" style={[styles.versionColumnModel, styles.headerLabel, { color: palette.mutedSoft }]}>
        Model
      </ThemedText>
      <ThemedText type="caption" style={[styles.versionColumnUpdated, styles.headerLabel, { color: palette.mutedSoft }]}>
        Bijgewerkt
      </ThemedText>
      <ThemedText type="caption" style={[styles.versionColumnActions, styles.headerLabel, { color: palette.mutedSoft }]}>
        Acties
      </ThemedText>
    </ThemedView>
  );
}

function VersionTableRow({
  version,
  active,
  actionMenu,
  inlineActions,
  onView,
}: {
  version: AiTaskVersionDetail;
  active: boolean;
  actionMenu: ReactNode;
  inlineActions: ReactNode;
  onView: () => void;
}) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 760;

  if (!isDesktop) {
    return (
      <ThemedView style={[styles.versionRowMobile, { borderTopColor: palette.separator }]}>
        <Pressable accessibilityRole="button" onPress={onView} style={styles.versionMobileMain}>
          <ThemedView style={styles.versionMobileTitleLine}>
            <ThemedText type="defaultSemiBold">v{version.versionNumber}</ThemedText>
            <AdminStatusChip label={versionStatusLabel(version.status)} tone={getVersionStatusTone(version)} />
            {active ? <AdminStatusChip label="Bekijkt" tone="info" /> : null}
          </ThemedView>
          <MetaText>
            {version.model} · {formatDateTimeLabel(version.updatedAt)} · {formatEvidence(version)}
          </MetaText>
        </Pressable>
        {actionMenu}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.versionRowDesktop, { borderTopColor: palette.separator }]}>
      <Pressable accessibilityRole="button" onPress={onView} style={styles.versionColumnVersion}>
        <ThemedView style={styles.versionCellLine}>
          <ThemedText type="defaultSemiBold">v{version.versionNumber}</ThemedText>
          {active ? <AdminStatusChip label="Bekijkt" tone="info" /> : null}
        </ThemedView>
      </Pressable>
      <ThemedView style={styles.versionColumnStatus}>
        <AdminStatusChip label={versionStatusLabel(version.status)} tone={getVersionStatusTone(version)} />
      </ThemedView>
      <ThemedText type="caption" style={[styles.versionColumnModel, { color: palette.muted }]}>
        {version.model}
      </ThemedText>
      <ThemedText type="caption" style={[styles.versionColumnUpdated, { color: palette.mutedSoft }]}>
        {formatDateTimeLabel(version.updatedAt)}
      </ThemedText>
      <ThemedView style={styles.versionColumnActions}>{inlineActions}</ThemedView>
    </ThemedView>
  );
}

function VersionViewer({
  detail,
  version,
  onClose,
}: {
  detail: AiTaskDetail;
  version: AiTaskVersionDetail;
  onClose: () => void;
}) {
  const viewer = buildVersionViewerSections(detail, version);
  const metadata = getAiQualityTaskMetadata(detail.key, detail.label, detail);
  const title = version.status === 'live' ? 'Live versie bekijken' : 'Versie bekijken';

  return (
    <AdminConsolePanel
      title={title}
      variant="plain"
      action={<AdminConsoleButton label="Sluiten" tone="ghost" onPress={onClose} />}
    >
      <ThemedView style={styles.viewerStack}>
        <ThemedView style={styles.chipInline}>
          <AdminStatusChip label={`v${version.versionNumber}`} />
          <AdminStatusChip label={versionStatusLabel(version.status)} tone={getVersionStatusTone(version)} />
          <AdminStatusChip label={version.model} tone="neutral" />
        </ThemedView>
        <MetaText>
          Aangemaakt {formatDateTimeLabel(version.createdAt)} · bijgewerkt {formatDateTimeLabel(version.updatedAt)}
        </MetaText>
        <MetaText>
          {[metadata.familyTitle, formatRuntimeFamily(detail.runtimeFamily), detail.runtimeBindingKey].filter(Boolean).join(' · ')}
        </MetaText>
        <MetaText>{formatEvidence(version)}</MetaText>

        {viewer.systemInstructions ? (
          <ThemedView style={styles.viewerBlock}>
            <ThemedText type="defaultSemiBold">Runtime system instructions</ThemedText>
            <ThemedText type="bodySecondary">{viewer.systemInstructions}</ThemedText>
          </ThemedView>
        ) : null}

        {viewer.resolvedSections.length > 0 ? (
          <ThemedView style={styles.viewerStack}>
            {viewer.resolvedSections.map((section) => (
              <ThemedView key={section.key} style={styles.viewerBlock}>
                <ThemedText type="defaultSemiBold">{section.label}</ThemedText>
                <ThemedText type="bodySecondary">{section.value}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        ) : (
          <ThemedView style={styles.viewerBlock}>
            <ThemedText type="defaultSemiBold">Prompt</ThemedText>
            <ThemedText type="bodySecondary">{viewer.rawPrompt}</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.viewerBlock}>
          <ThemedText type="defaultSemiBold">Output schema JSON</ThemedText>
          <ThemedText type="caption">{viewer.outputSchemaJson}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.viewerBlock}>
          <ThemedText type="defaultSemiBold">Config JSON</ThemedText>
          <ThemedText type="caption">{viewer.configJson}</ThemedText>
        </ThemedView>
      </ThemedView>
    </AdminConsolePanel>
  );
}

export default function AiQualityStudioTaskOverviewScreen() {
  const pathname = usePathname();
  const { taskKey } = useLocalSearchParams<{ taskKey?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [processingDestructive, setProcessingDestructive] = useState(false);
  const [promotingVersion, setPromotingVersion] = useState(false);
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    version: AiTaskVersionDetail;
    state: AiQualityVersionLifecycleState;
  } | null>(null);
  const [destructiveTarget, setDestructiveTarget] = useState<DestructiveTarget | null>(null);
  const [actionMenuVersion, setActionMenuVersion] = useState<AiTaskVersionDetail | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<AiTaskDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const draftVersion = useMemo(
    () => detail?.versions.find((version) => version.status === 'draft') ?? null,
    [detail]
  );
  const archivedVersions = useMemo(
    () => detail?.versions.filter((version) => version.status === 'archived') ?? [],
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
  const cleanupPlan = useMemo(
    () => (detail ? getAiQualityArchivedCleanupPlan(detail, { keepLatest: ARCHIVE_CLEANUP_KEEP_LATEST }) : null),
    [detail]
  );
  const selectedVersion = useMemo(
    () => detail?.versions.find((version) => version.id === selectedVersionId) ?? null,
    [detail, selectedVersionId]
  );

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
      setSelectedVersionId(result.promotedVersion.id);
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

  async function handleDestructiveConfirm() {
    if (!detail || !destructiveTarget || processingDestructive) return;

    setProcessingDestructive(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let nextSuccessMessage = '';
      if (destructiveTarget.kind === 'draft') {
        await deleteAdminAiQualityStudioDraftVersion(destructiveTarget.version.id);
        if (selectedVersionId === destructiveTarget.version.id) setSelectedVersionId(null);
        nextSuccessMessage = 'Draft verwijderd.';
      } else if (destructiveTarget.kind === 'archived') {
        const result = await deleteAdminAiQualityStudioArchivedVersion({
          taskKey: detail.key,
          versionId: destructiveTarget.version.id,
        });
        if (selectedVersionId === destructiveTarget.version.id) setSelectedVersionId(null);
        nextSuccessMessage = `${result.deletedVersionIds.length} versie verwijderd.`;
      } else {
        const result = await cleanupAdminAiQualityStudioArchivedVersions({
          taskKey: detail.key,
          keepLatest: ARCHIVE_CLEANUP_KEEP_LATEST,
        });
        if (selectedVersionId && result.deletedVersionIds.includes(selectedVersionId)) setSelectedVersionId(null);
        nextSuccessMessage =
          result.skippedVersionIds.length > 0
            ? `${result.deletedVersionIds.length} versie(s) verwijderd, ${result.skippedVersionIds.length} bewaard met runtime logs.`
            : `${result.deletedVersionIds.length} versie(s) verwijderd.`;
      }

      setDestructiveTarget(null);
      await load();
      setSuccessMessage(nextSuccessMessage);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setProcessingDestructive(false);
    }
  }

  function openLifecycleConfirm(version: AiTaskVersionDetail, state: AiQualityVersionLifecycleState) {
    if (!state.canRunAction) return;
    setActionMenuVersion(null);
    setLifecycleTarget({ version, state });
  }

  function openVersion(version: AiTaskVersionDetail) {
    setActionMenuVersion(null);
    setSelectedVersionId((current) => (current === version.id ? null : version.id));
  }

  function buildVersionActions(version: AiTaskVersionDetail): ConfirmSheetAction[] {
    const lifecycle = detail ? getAiQualityVersionLifecycleState(detail, version) : null;
    const management = detail ? getAiQualityVersionManagementState(detail, version) : null;
    const actions: ConfirmSheetAction[] = [
      {
        key: 'view',
        label: version.status === 'live' ? 'Bekijk live versie' : 'Bekijk',
        onPress: () => openVersion(version),
      },
    ];

    if (version.status === 'draft') {
      actions.push({
        key: 'open-draft',
        label: 'Open draft',
        onPress: () => {
          setActionMenuVersion(null);
          router.push(`/settings-ai-quality-studio/${detail?.key}/draft/${version.id}` as never);
        },
      });
      if (taskCapabilities?.canReview) {
        actions.push({
          key: 'validate',
          label: 'Valideren',
          onPress: () => {
            setActionMenuVersion(null);
            router.push(`/settings-ai-quality-studio/${detail?.key}/validate/${version.id}` as never);
          },
        });
      }
      if (management?.canDeleteDraft) {
        actions.push({
          key: 'delete-draft',
          label: 'Draft verwijderen',
          tone: 'destructive',
          onPress: () => {
            setActionMenuVersion(null);
            setDestructiveTarget({ kind: 'draft', version });
          },
        });
      }
    }

    if (version.status === 'archived') {
      if (lifecycle?.action === 'rollback') {
        actions.push({
          key: 'rollback',
          label: 'Rollback',
          onPress: () => openLifecycleConfirm(version, lifecycle),
        });
      }
      if (management?.canDeleteArchived) {
        actions.push({
          key: 'delete-archived',
          label: 'Versie verwijderen',
          tone: 'destructive',
          onPress: () => {
            setActionMenuVersion(null);
            setDestructiveTarget({ kind: 'archived', version });
          },
        });
      }
    }

    return actions;
  }

  function renderInlineActions(version: AiTaskVersionDetail) {
    const lifecycle = detail ? getAiQualityVersionLifecycleState(detail, version) : null;
    const management = detail ? getAiQualityVersionManagementState(detail, version) : null;

    return (
      <ThemedView style={styles.versionActions}>
        <AdminConsoleButton
          label={version.status === 'live' ? 'Bekijk live versie' : 'Bekijk'}
          tone="ghost"
          onPress={() => openVersion(version)}
        />
        {version.status === 'draft' ? (
          <>
            <AdminConsoleButton
              label="Open draft"
              tone="secondary"
              onPress={() => router.push(`/settings-ai-quality-studio/${detail?.key}/draft/${version.id}` as never)}
            />
            {taskCapabilities?.canReview ? (
              <AdminConsoleButton
                label="Valideren"
                tone="secondary"
                onPress={() => router.push(`/settings-ai-quality-studio/${detail?.key}/validate/${version.id}` as never)}
              />
            ) : null}
            {management?.canDeleteDraft ? (
              <AdminConsoleButton
                label="Draft verwijderen"
                tone="danger"
                onPress={() => setDestructiveTarget({ kind: 'draft', version })}
              />
            ) : null}
          </>
        ) : null}
        {version.status === 'archived' ? (
          <>
            {lifecycle?.action === 'rollback' ? (
              <AdminConsoleButton
                label="Rollback"
                tone="secondary"
                disabled={promotingVersion || !lifecycle.canRunAction}
                onPress={() => openLifecycleConfirm(version, lifecycle)}
              />
            ) : null}
            {management?.canDeleteArchived ? (
              <AdminConsoleButton
                label="Versie verwijderen"
                tone="danger"
                onPress={() => setDestructiveTarget({ kind: 'archived', version })}
              />
            ) : null}
          </>
        ) : null}
      </ThemedView>
    );
  }

  const destructiveCopy = destructiveTarget?.kind === 'draft'
    ? {
        title: 'Draft verwijderen?',
        message: 'Deze draft wordt verwijderd. De live versie blijft actief.',
        confirm: 'Draft verwijderen',
        detail: `v${destructiveTarget.version.versionNumber}`,
      }
    : destructiveTarget?.kind === 'archived'
      ? {
          title: 'Versie verwijderen?',
          message: 'Deze gearchiveerde versie wordt definitief verwijderd. De live versie blijft actief.',
          confirm: 'Versie verwijderen',
          detail: `v${destructiveTarget.version.versionNumber}`,
        }
      : {
          title: 'Oude versies opschonen?',
          message: 'We bewaren de live versie, drafts en de nieuwste archiefversies. Oudere archiefversies worden verwijderd.',
          confirm: 'Opschonen',
          detail: `Nieuwste ${ARCHIVE_CLEANUP_KEEP_LATEST} archiefversies blijven bewaard.`,
        };

  return (
    <AdminConsoleShell
      onBack={() => router.replace(getSettingsBackTarget(pathname) as never)}
      onMenu={() => setMenuVisible(true)}
      fixedFooter={
        !loading && detail ? (
          <AdminActionBar
            floating
            primary={{
              label: creatingDraft ? 'Versie maken...' : primaryLabel,
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
    >
      <AdminConsoleHeader
        title={detail?.label ?? (typeof taskKey === 'string' ? taskKey : 'Onderdeel')}
        subtitle={detail?.description ?? 'AI Quality Studio'}
      />

      {loading ? <StateBlock tone="loading" message="Onderdeel laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon onderdeel niet laden." detail={error} /> : null}
      {!loading && successMessage ? <StateBlock tone="success" message={successMessage} /> : null}

      {!loading && detail ? (
        <>
          <AdminStatusNotice
            variant="inline"
            tone={detail.liveVersion ? 'success' : 'warning'}
            title={detail.liveVersion ? `Live v${detail.liveVersion.versionNumber}` : 'Baseline ontbreekt'}
            detail={[taskMetadata?.familyTitle, detail ? formatRuntimeFamily(detail.runtimeFamily) : null, draftVersion ? `Draft v${draftVersion.versionNumber}` : null]
              .filter(Boolean)
              .join(' · ')}
          />

          <AdminConsolePanel title="Prompt" variant="plain">
            <ThemedView style={styles.fieldGroup}>
              <ThemedText type="defaultSemiBold">{detail.label}</ThemedText>
              {detail.description ? <ThemedText type="bodySecondary">{detail.description}</ThemedText> : null}
              <MetaText>
                key: {detail.key} · input: {detail.inputType} · output: {detail.outputType}
              </MetaText>
              <MetaText>
                {[taskMetadata?.familyTitle, formatRuntimeFamily(detail.runtimeFamily), detail.runtimeBindingKey]
                  .filter(Boolean)
                  .join(' · ')}
              </MetaText>
            </ThemedView>
          </AdminConsolePanel>

          <AdminConsolePanel title="Live versie" variant="plain">
            {detail.liveVersion ? (
              <ThemedView style={styles.sectionRow}>
                <ThemedView style={styles.fieldGroup}>
                  <MetaText>
                    v{detail.liveVersion.versionNumber} · {detail.liveVersion.model}
                  </MetaText>
                  <MetaText>Bijgewerkt: {formatDateTimeLabel(detail.liveVersion.updatedAt)}</MetaText>
                  <MetaText>Deze versie wordt nu door de runtime gebruikt.</MetaText>
                </ThemedView>
                {detail.versions.find((version) => version.id === detail.liveVersion?.id) ? (
                  <AdminConsoleButton
                    label="Bekijk live versie"
                    tone="secondary"
                    onPress={() => {
                      const live = detail.versions.find((version) => version.id === detail.liveVersion?.id);
                      if (live) openVersion(live);
                    }}
                  />
                ) : null}
              </ThemedView>
            ) : (
              <StateBlock
                tone="info"
                message="Nog geen runtime-basis"
                detail="Importeer eerst de huidige runtime-baseline voor deze task."
              />
            )}
          </AdminConsolePanel>

          <AdminConsolePanel title="Draft" variant="plain">
            {draftVersion && draftLifecycle ? (
              <ThemedView style={styles.sectionRow}>
                <ThemedView style={styles.fieldGroup}>
                  <ThemedView style={styles.chipInline}>
                    <AdminStatusChip
                      label={draftLifecycle.label}
                      tone={draftLifecycle.canRunAction ? 'success' : 'warning'}
                    />
                    <AdminStatusChip label={formatEvidence(draftVersion)} />
                  </ThemedView>
                  <ThemedText type="defaultSemiBold">Draft v{draftVersion.versionNumber}</ThemedText>
                  <MetaText>{draftLifecycle.canRunAction ? 'Klaar voor live' : draftLifecycle.detail}</MetaText>
                </ThemedView>
                <ThemedView style={styles.sectionActions}>
                  <AdminConsoleButton
                    label="Open draft"
                    tone="secondary"
                    onPress={() => router.push(`/settings-ai-quality-studio/${detail.key}/draft/${draftVersion.id}` as never)}
                  />
                  {taskCapabilities?.canReview ? (
                    <AdminConsoleButton
                      label="Valideren"
                      tone="secondary"
                      onPress={() => router.push(`/settings-ai-quality-studio/${detail.key}/validate/${draftVersion.id}` as never)}
                    />
                  ) : null}
                  {draftLifecycle.actionLabel ? (
                    <AdminConsoleButton
                      label="Zet live"
                      icon="rocket-launch"
                      tone="primary"
                      disabled={promotingVersion || !draftLifecycle.canRunAction}
                      onPress={() => openLifecycleConfirm(draftVersion, draftLifecycle)}
                    />
                  ) : null}
                  <AdminConsoleButton
                    label="Draft verwijderen"
                    tone="danger"
                    onPress={() => setDestructiveTarget({ kind: 'draft', version: draftVersion })}
                  />
                </ThemedView>
              </ThemedView>
            ) : (
              <MetaText>Geen draft aanwezig</MetaText>
            )}
          </AdminConsolePanel>

          {selectedVersion ? (
            <VersionViewer detail={detail} version={selectedVersion} onClose={() => setSelectedVersionId(null)} />
          ) : null}

          <AdminSectionList
            title="Versies"
            variant="plain"
            action={
              archivedVersions.length > ARCHIVE_CLEANUP_KEEP_LATEST ? (
                <AdminConsoleButton
                  label="Versies opschonen"
                  tone="secondary"
                  onPress={() => setDestructiveTarget({ kind: 'cleanup' })}
                />
              ) : null
            }
          >
            <ThemedView style={styles.versionList}>
              <VersionTableHeader />
              {detail.versions.map((version) => (
                <VersionTableRow
                  key={version.id}
                  version={version}
                  active={selectedVersionId === version.id}
                  onView={() => openVersion(version)}
                  actionMenu={
                    <AdminConsoleButton
                      label="Acties"
                      tone="ghost"
                      icon="more-horiz"
                      onPress={() => setActionMenuVersion(version)}
                    />
                  }
                  inlineActions={renderInlineActions(version)}
                />
              ))}
              {cleanupPlan && cleanupPlan.archivedCount > ARCHIVE_CLEANUP_KEEP_LATEST ? (
                <MetaText>
                  Cleanup bewaart live, drafts en de nieuwste {cleanupPlan.keepLatest} archiefversies.
                </MetaText>
              ) : null}
            </ThemedView>
          </AdminSectionList>
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />

      <ConfirmSheet
        visible={Boolean(actionMenuVersion)}
        title={actionMenuVersion ? `Acties voor v${actionMenuVersion.versionNumber}` : 'Acties'}
        message={actionMenuVersion ? `${versionStatusLabel(actionMenuVersion.status)} · ${actionMenuVersion.model}` : ''}
        processing={false}
        actions={[
          {
            key: 'cancel',
            label: 'Annuleren',
            onPress: () => setActionMenuVersion(null),
          },
          ...(actionMenuVersion ? buildVersionActions(actionMenuVersion) : []),
        ]}
        onCancel={() => setActionMenuVersion(null)}
        onConfirm={() => setActionMenuVersion(null)}
      />

      <ConfirmSheet
        visible={Boolean(destructiveTarget)}
        title={destructiveCopy.title}
        message={destructiveCopy.message}
        detail={destructiveCopy.detail}
        processing={processingDestructive}
        actions={[
          {
            key: 'cancel',
            label: 'Annuleren',
            onPress: () => {
              if (!processingDestructive) setDestructiveTarget(null);
            },
          },
          {
            key: 'confirm',
            label: destructiveCopy.confirm,
            tone: 'destructive',
            onPress: () => void handleDestructiveConfirm(),
            disabled: processingDestructive,
            icon: destructiveTarget?.kind === 'cleanup' ? 'cleaning-services' : 'delete-forever',
          },
        ]}
        onCancel={() => {
          if (!processingDestructive) setDestructiveTarget(null);
        }}
        onConfirm={() => void handleDestructiveConfirm()}
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
            label: promotingVersion ? 'Bezig...' : lifecycleTarget?.state.action === 'rollback' ? 'Rollback' : 'Zet live',
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
  sectionRow: {
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  sectionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  versionList: {
    gap: 0,
  },
  versionHeader: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  versionRowDesktop: {
    minHeight: 52,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  versionRowMobile: {
    minHeight: 68,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.lg,
  },
  versionMobileMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  versionMobileTitleLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  versionCellLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  versionColumnVersion: {
    flex: 0.85,
    minWidth: 0,
  },
  versionColumnStatus: {
    width: 92,
  },
  versionColumnModel: {
    flex: 1,
    minWidth: 0,
  },
  versionColumnUpdated: {
    flex: 1.15,
    minWidth: 0,
  },
  versionColumnActions: {
    flex: 1.8,
    minWidth: 0,
    alignItems: 'flex-end',
  },
  versionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  chipInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  viewerStack: {
    gap: spacing.md,
  },
  viewerBlock: {
    gap: spacing.xs,
  },
});
