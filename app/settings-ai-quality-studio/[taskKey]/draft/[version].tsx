import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { DestructiveConfirmSheet } from '@/components/feedback/destructive-confirm-sheet';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HeaderIconButton } from '@/components/ui/header-icon-button';
import { InlineWordDiffText } from '@/components/ui/inline-word-diff';
import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import {
  AdminAccordion,
  AdminEditorSection,
  AdminPageHero,
  AdminReadOnlyBlock,
  AdminSection,
  AdminShell,
  AdminStickyFooterActions,
  AdminTokenRail,
  SettingsTopNav,
} from '@/components/ui/settings-screen-primitives';
import { AiTokenChipPicker } from '@/components/ui/ai-token-chip-picker';
import { AiTokenEditor, type PromptEditorState } from '@/components/ui/ai-token-editor';
import { MetaText, StateBlock, TextAreaField } from '@/components/ui/screen-primitives';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  classifyUnknownError,
  deleteAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
  runAdminAiQualityStudioPromptAssistPreview,
  updateAdminAiQualityStudioDraftVersion,
} from '@/services';
import { colorTokens, spacing } from '@/theme';
import type {
  AiPromptAssistActionDefinition,
  AiPromptAssistActionId,
  AiPromptAssistPreviewResult,
  AiPromptAssistTargetLayerKey,
  AiPromptAssistTargetLayerType,
  AiTaskDetail,
} from '@/types';
import {
  AI_QUALITY_ALLOWED_MODELS,
  buildAllowedChangeKinds,
  buildInvariants,
  buildLayerSemantics,
  buildReadOnlyContext,
  buildStructuredPromptTemplate,
  DraftFormState,
  formatStructuredPromptInstructionSections,
  getDraftFormJsonFieldErrors,
  getEntryCleanupInstructionWarnings,
  getEntryCleanupTechnicalContractFromConfig,
  getEntryCleanupTechnicalContractLines,
  getLayerNoticeInfo,
  getPromptAssistActionsForTarget,
  getStructuredPromptEditorDefinition,
  getTaskConsistencyInfo,
  getTaskInputContractLines,
  getTaskResponseContractFields,
  isDraftFormDirty,
  parseDraftFormState,
  parseStructuredPromptInstructionSections,
  toDraftFormState,
} from '../../_shared';
import { getAiQualityTaskCapabilities, getAiQualityTaskMetadata } from '../../readmodel';

type PromptAssistTarget = {
  key: AiPromptAssistTargetLayerKey;
  layerType: AiPromptAssistTargetLayerType;
};

export default function AiQualityStudioDraftScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const { width, height } = useWindowDimensions();
  const isWideAssistLayout = width >= 1100;
  const assistOverlayMaxHeight = useMemo(() => Math.max(340, height - spacing.page * 2), [height]);
  const { taskKey, version } = useLocalSearchParams<{ taskKey?: string; version?: string }>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [deletingDraft, setDeletingDraft] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [detail, setDetail] = useState<AiTaskDetail | null>(null);
  const [form, setForm] = useState<DraftFormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [pendingTokenInsertBySection, setPendingTokenInsertBySection] = useState<Record<string, string | null>>({});
  const [editorStatesBySection, setEditorStatesBySection] = useState<Record<string, PromptEditorState | null>>({});

  const [activeAssistTarget, setActiveAssistTarget] = useState<PromptAssistTarget | null>(null);
  const [selectedAssistActionId, setSelectedAssistActionId] = useState<AiPromptAssistActionId | null>(null);
  const [assistIntent, setAssistIntent] = useState('');
  const [assistLoading, setAssistLoading] = useState(false);
  const [assistError, setAssistError] = useState<string | null>(null);
  const [assistPreview, setAssistPreview] = useState<AiPromptAssistPreviewResult | null>(null);
  const [assistPreviewSignature, setAssistPreviewSignature] = useState<string | null>(null);

  const selectedDraft = useMemo(() => {
    if (!detail) return null;
    const requestedId = typeof version === 'string' ? version.trim() : '';
    if (requestedId) {
      return detail.versions.find((item) => item.id === requestedId && item.status === 'draft') ?? null;
    }
    return detail.versions.find((item) => item.status === 'draft') ?? null;
  }, [detail, version]);

  const structuredEditor = useMemo(
    () => getStructuredPromptEditorDefinition(detail?.key ?? ''),
    [detail?.key]
  );

  const sectionValues = useMemo(() => {
    if (!detail || !form) return {} as Record<string, string>;
    return parseStructuredPromptInstructionSections(detail.key, form.taskInstruction);
  }, [detail, form]);

  const load = useCallback(async () => {
    const normalizedTaskKey = typeof taskKey === 'string' ? taskKey.trim() : '';
    if (!normalizedTaskKey) {
      setDetail(null);
      setForm(null);
      setLoading(false);
      setError('Geen geldige taskKey gevonden.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextDetail = await fetchAdminAiQualityStudioTaskDetail(normalizedTaskKey);
      const metadata = getAiQualityTaskMetadata(nextDetail.key, nextDetail.label);
      if (metadata.editorScope === 'read_only_part') {
        if (metadata.editorTargetTaskKey) {
          router.replace(`/settings-ai-quality-studio/${metadata.editorTargetTaskKey}` as never);
        } else {
          router.replace('/settings-ai-quality-studio' as never);
        }
        return;
      }

      const requestedId = typeof version === 'string' ? version.trim() : '';
      const draft = requestedId
        ? nextDetail.versions.find((item) => item.id === requestedId && item.status === 'draft') ?? null
        : nextDetail.versions.find((item) => item.status === 'draft') ?? null;

      setDetail(nextDetail);
      setForm(draft ? toDraftFormState(draft) : null);
      setPendingTokenInsertBySection({});
      setEditorStatesBySection({});
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
      setDetail(null);
      setForm(null);
    } finally {
      setLoading(false);
    }
  }, [taskKey, version]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const parsedForm = useMemo(() => {
    if (!form) return { payload: null, error: 'Geen formulier.' };
    return parseDraftFormState(form);
  }, [form]);

  const formValid = Boolean(parsedForm.payload);
  const formDirty = useMemo(() => {
    if (!form || !selectedDraft) return false;
    return isDraftFormDirty(form, selectedDraft);
  }, [form, selectedDraft]);

  const jsonFieldErrors = useMemo(() => {
    if (!form) return { outputSchemaError: null, configError: null };
    return getDraftFormJsonFieldErrors(form);
  }, [form]);

  const taskConsistency = useMemo(() => (detail ? getTaskConsistencyInfo(detail.key) : null), [detail]);
  const taskCapabilities = useMemo(() => (detail ? getAiQualityTaskCapabilities(detail.key) : null), [detail]);
  const taskInputContractLines = useMemo(() => (detail ? getTaskInputContractLines(detail.key) : []), [detail]);
  const taskResponseContractFields = useMemo(() => (detail ? getTaskResponseContractFields(detail.key) : []), [detail]);
  const technicalContractLines = useMemo(() => {
    if (!detail || !selectedDraft || detail.key !== 'entry_cleanup') return [];
    const contract = getEntryCleanupTechnicalContractFromConfig(selectedDraft.configJson ?? {});
    return getEntryCleanupTechnicalContractLines(contract);
  }, [detail, selectedDraft]);

  const canSave = formDirty && formValid && !savingDraft && !deletingDraft;
  const canValidate = Boolean(taskCapabilities?.canReview) && !savingDraft && !deletingDraft;

  async function handleSaveDraft(options?: { testAfterSave?: boolean }) {
    if (!selectedDraft || !form || savingDraft) return;
    const parsed = parseDraftFormState(form);
    if (!parsed.payload) {
      setError(parsed.error ?? 'Draft payload ongeldig.');
      return;
    }

    setSavingDraft(true);
    setError(null);
    setSaveMessage(null);
    try {
      const updated = await updateAdminAiQualityStudioDraftVersion(selectedDraft.id, parsed.payload);
      setSaveMessage(`Draft v${updated.versionNumber} opgeslagen.`);
      setForm(toDraftFormState(updated));
      await load();
      if (options?.testAfterSave && detail) {
        router.push(`/settings-ai-quality-studio/${detail.key}/validate/${selectedDraft.id}` as never);
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleDeleteDraft() {
    if (!selectedDraft || deletingDraft) return;
    setDeletingDraft(true);
    setError(null);
    try {
      await deleteAdminAiQualityStudioDraftVersion(selectedDraft.id);
      setShowDeleteDialog(false);
      if (detail) {
        router.replace(`/settings-ai-quality-studio/${detail.key}` as never);
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setDeletingDraft(false);
    }
  }

  function updateInstructionSection(sectionKey: string, value: string) {
    setForm((prev) => {
      if (!prev || !detail) return prev;
      const currentSections = parseStructuredPromptInstructionSections(detail.key, prev.taskInstruction);
      const nextSections = { ...currentSections, [sectionKey]: value };
      return {
        ...prev,
        taskInstruction: formatStructuredPromptInstructionSections(detail.key, nextSections),
        promptTemplateRaw: buildStructuredPromptTemplate({
          taskKey: detail.key,
          promptTemplateRaw: prev.promptTemplateRaw,
          sectionValues: nextSections,
        }),
      };
    });
  }

  function applyInstructionSections(nextSections: Record<string, string>) {
    setForm((prev) => {
      if (!prev || !detail) return prev;
      return {
        ...prev,
        taskInstruction: formatStructuredPromptInstructionSections(detail.key, nextSections),
        promptTemplateRaw: buildStructuredPromptTemplate({
          taskKey: detail.key,
          promptTemplateRaw: prev.promptTemplateRaw,
          sectionValues: nextSections,
        }),
      };
    });
  }

  function insertTokenForSection(sectionKey: string, tokenId: string) {
    setPendingTokenInsertBySection((prev) => ({ ...prev, [sectionKey]: tokenId }));
  }

  function sectionWarnings(sectionKey: string): string[] {
    if (!detail) return [];
    if (detail.key !== 'entry_cleanup') return [];
    return getEntryCleanupInstructionWarnings(sectionValues[sectionKey] ?? '');
  }

  function unknownTokenWarnings(sectionKey: string): string[] {
    const known = new Set(structuredEditor.tokens.map((item) => item.id));
    const tokenIds = editorStatesBySection[sectionKey]?.tokenIds ?? [];
    return Array.from(new Set(tokenIds.filter((id) => !known.has(id)).map((id) => `Onbekende token-id: ${id}`)));
  }

  function openAssistForSection(sectionKey: string, layerType: AiPromptAssistTargetLayerType) {
    setActiveAssistTarget({ key: sectionKey, layerType });
    setSelectedAssistActionId(null);
    setAssistIntent('');
    setAssistError(null);
    setAssistPreview(null);
    setAssistPreviewSignature(null);
  }

  function closeAssistPanel() {
    setActiveAssistTarget(null);
    setSelectedAssistActionId(null);
    setAssistLoading(false);
    setAssistError(null);
    setAssistPreview(null);
    setAssistPreviewSignature(null);
    setAssistIntent('');
  }

  const assistHasTypedIntent = assistIntent.trim().length > 0;
  const effectiveAssistActionId: AiPromptAssistActionId = selectedAssistActionId ?? (assistHasTypedIntent ? 'verhelderen' : 'compacter');
  const assistSignature = `${activeAssistTarget?.key ?? ''}::${effectiveAssistActionId}::${assistIntent.trim()}`;
  const assistPreviewStale = Boolean(assistPreview && assistPreviewSignature !== assistSignature);
  const assistActions = useMemo<AiPromptAssistActionDefinition[]>(() => {
    if (!activeAssistTarget || !detail) return [];
    return getPromptAssistActionsForTarget({ targetLayerType: activeAssistTarget.layerType, taskKey: detail.key });
  }, [activeAssistTarget, detail]);

  async function runAssistPreview() {
    if (!detail || !selectedDraft || !activeAssistTarget) return;
    setAssistLoading(true);
    setAssistError(null);
    setAssistPreview(null);
    try {
      const fieldRules: Record<string, string> = {};
      for (const section of structuredEditor.sections) {
        if (section.layerType === 'field') {
          fieldRules[section.key] = sectionValues[section.key] ?? '';
        }
      }

      const layerSemantics = buildLayerSemantics(structuredEditor.sections);
      const readOnlyContext = buildReadOnlyContext({
        sections: structuredEditor.sections,
        targetKey: activeAssistTarget.key,
        sectionValues,
      });
      const invariants = buildInvariants(detail.key);
      const allowedChangeKinds = buildAllowedChangeKinds(effectiveAssistActionId, activeAssistTarget.layerType);

      const preview = await runAdminAiQualityStudioPromptAssistPreview({
        taskKey: detail.key,
        versionId: selectedDraft.id,
        targetLayerType: activeAssistTarget.layerType,
        targetLayerKey: activeAssistTarget.key,
        assistActionId: effectiveAssistActionId,
        assistIntent,
        editorContext: {
          systemRulesInstruction: sectionValues.systemRulesInstruction ?? '',
          generalInstruction: sectionValues.generalInstruction ?? '',
          fieldRules,
          editableSections: structuredEditor.sections.map((section) => ({
            key: section.key,
            label: section.label,
            layerType: section.layerType,
          })),
          tokenCatalog: structuredEditor.tokens.map((token) => ({
            id: token.id,
            kind: token.kind,
            label: token.label,
            token: token.token,
          })),
          outputContract: { fields: taskResponseContractFields },
          taskMetadata: {
            taskKey: detail.key,
            taskLabel: detail.label,
            versionId: selectedDraft.id,
            versionNumber: selectedDraft.versionNumber,
          },
          layerSemantics,
          readOnlyContext,
          invariants,
          allowedChangeKinds,
        },
      });

      setAssistPreview(preview);
      setAssistPreviewSignature(assistSignature);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setAssistError(parsed.message);
    } finally {
      setAssistLoading(false);
    }
  }

  function applyAssistSuggestion() {
    if (!activeAssistTarget || !assistPreview) return;
    if (effectiveAssistActionId === 'verdeel_over_velden' && assistPreview.proposedSections) {
      applyInstructionSections({
        ...sectionValues,
        ...assistPreview.proposedSections,
      });
      closeAssistPanel();
      return;
    }
    updateInstructionSection(activeAssistTarget.key, assistPreview.proposedText);
    closeAssistPanel();
  }

  const assistSectionDiffs = useMemo(() => {
    if (!assistPreview?.proposedSections) return [] as { key: string; label: string; before: string; after: string }[];
    return structuredEditor.sections
      .map((section) => {
        const before = sectionValues[section.key] ?? '';
        const after = assistPreview.proposedSections?.[section.key] ?? before;
        return {
          key: section.key,
          label: section.label,
          before,
          after,
        };
      })
      .filter((item) => item.before !== item.after);
  }, [assistPreview?.proposedSections, sectionValues, structuredEditor.sections]);

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      fixedFooter={
        !loading && detail && selectedDraft && form ? (
          <AdminStickyFooterActions
            primaryAction={{
              label: savingDraft ? 'Bezig…' : formDirty && formValid ? 'Opslaan en valideren' : 'Valideren',
              onPress: () => {
                if (formDirty && formValid) {
                  void handleSaveDraft({ testAfterSave: true });
                } else if (taskCapabilities?.canReview) {
                  router.push(`/settings-ai-quality-studio/${detail.key}/validate/${selectedDraft.id}` as never);
                }
              },
              disabled: formDirty ? !formValid : !canValidate,
              icon: 'play-arrow',
            }}
            secondaryAction={{
              label: savingDraft ? 'Opslaan…' : 'Opslaan',
              onPress: () => void handleSaveDraft(),
              disabled: !canSave,
              icon: 'save',
            }}
            tertiaryAction={{
              label: deletingDraft ? 'Verwijderen…' : 'Verwijderen',
              onPress: () => setShowDeleteDialog(true),
              disabled: savingDraft || deletingDraft,
              icon: 'delete-outline',
              tone: 'destructive',
            }}
          />
        ) : null
      }
      contentContainerStyle={styles.scrollContent}
    >
      <AdminPageHero title="Draft bewerken" subtitle={detail?.label ?? 'AI Quality Studio'} />

      {loading ? <StateBlock tone="loading" message="Draft laden" /> : null}
      {!loading && error ? <StateBlock tone="error" message="Kon draft niet laden." detail={error} /> : null}

      {!loading && detail && selectedDraft && form ? (
        <>
          <ThemedView style={styles.heroBlock}>
            <ThemedText type="sectionTitle">{structuredEditor.title}</ThemedText>
            <ThemedText type="bodySecondary">{structuredEditor.subtitle}</ThemedText>
            <MetaText>
              Draft v{selectedDraft.versionNumber} · runtime-basis{' '}
              {detail.liveVersion ? `v${detail.liveVersion.versionNumber}` : 'niet ingesteld'} · {selectedDraft.model}
            </MetaText>
            <MetaText>Runtime-groep: {structuredEditor.runtimeFamilyLabel}</MetaText>
            {taskConsistency ? <MetaText>Beïnvloedt: {taskConsistency.affectsLabel}</MetaText> : null}
          </ThemedView>

          {saveMessage ? <StateBlock tone="success" message={saveMessage} /> : null}

          <AdminSection title="Bewerkbare instructies">
            <ThemedView style={styles.editorColumn}>
              {structuredEditor.sections.map((section) => {
                const assistOpen = activeAssistTarget?.key === section.key;
                return (
                  <AdminEditorSection
                    key={section.key}
                    title={section.label}
                    helper={`${getLayerNoticeInfo(section.layerType, section.label).badgeLabel} · ${section.helper}`}
                    action={
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => openAssistForSection(section.key, section.layerType)}
                        style={[
                          styles.assistTrigger,
                          {
                            backgroundColor: assistOpen ? palette.surfaceLowest : palette.surfaceLow,
                            borderColor: assistOpen ? palette.primary : palette.separator,
                          },
                        ]}
                      >
                        <ThemedText type="caption" style={{ color: palette.primary }}>
                          Assist
                        </ThemedText>
                      </Pressable>
                    }
                    tokenRail={
                      <AdminTokenRail>
                        <AiTokenChipPicker
                          tokens={structuredEditor.tokens}
                          onInsertToken={(tokenId) => insertTokenForSection(section.key, tokenId)}
                        />
                      </AdminTokenRail>
                    }
                    editor={
                      <AiTokenEditor
                        value={sectionValues[section.key] ?? ''}
                        tokens={structuredEditor.tokens}
                        minHeight={section.minHeight}
                        onChangeText={(value) => updateInstructionSection(section.key, value)}
                        requestInsertTokenId={pendingTokenInsertBySection[section.key] ?? null}
                        onInsertTokenHandled={() =>
                          setPendingTokenInsertBySection((prev) => ({ ...prev, [section.key]: null }))
                        }
                        onEditorStateChange={(state) =>
                          setEditorStatesBySection((prev) => ({ ...prev, [section.key]: state }))
                        }
                      />
                    }
                    warnings={[...sectionWarnings(section.key), ...unknownTokenWarnings(section.key)]}
                  />
                );
              })}
            </ThemedView>
          </AdminSection>

          <AdminSection title="Geavanceerd">
            <AdminAccordion
              title={advancedOpen ? 'Verberg geavanceerd' : 'Toon geavanceerd'}
              summary={advancedOpen ? 'Minder technische details' : 'Technisch contract, model en herkomst'}
              defaultOpen={advancedOpen}
              onToggle={setAdvancedOpen}
            >
              <ThemedView style={styles.advancedBody}>
                {taskInputContractLines.length > 0 ? (
                  <AdminReadOnlyBlock title="Input contract" lines={taskInputContractLines} />
                ) : null}
                {technicalContractLines.length > 0 ? (
                  <AdminReadOnlyBlock title="Technisch contract" lines={technicalContractLines} />
                ) : null}
                {taskResponseContractFields.length > 0 ? (
                  <AdminReadOnlyBlock
                    title="Response contract"
                    lines={taskResponseContractFields.map((field) => `${field.name}: ${field.type}`)}
                  />
                ) : null}

                <ThemedView style={styles.fieldGroup}>
                  <MetaText>Model</MetaText>
                  <ThemedView style={styles.modelOptionsRow}>
                    {AI_QUALITY_ALLOWED_MODELS.map((option) => {
                      const active = form.model === option.value;
                      return (
                        <Pressable
                          key={option.value}
                          accessibilityRole="button"
                          onPress={() => setForm((prev) => (prev ? { ...prev, model: option.value } : prev))}
                          style={[styles.modelOption, { backgroundColor: active ? palette.surfaceLowest : palette.surfaceLow }]}
                        >
                          <ThemedText type="caption" style={{ color: active ? palette.primary : palette.mutedSoft }}>
                            {option.label}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.fieldGroup}>
                  <MetaText>Output schema JSON</MetaText>
                  <TextAreaField
                    value={form.outputSchemaJsonText}
                    onChangeText={(value) => setForm((prev) => (prev ? { ...prev, outputSchemaJsonText: value } : prev))}
                    style={styles.textAreaMedium}
                  />
                  {jsonFieldErrors.outputSchemaError ? <MetaText>{jsonFieldErrors.outputSchemaError}</MetaText> : null}
                </ThemedView>

                <ThemedView style={styles.fieldGroup}>
                  <MetaText>Config JSON</MetaText>
                  <TextAreaField
                    value={form.configJsonText}
                    onChangeText={(value) => setForm((prev) => (prev ? { ...prev, configJsonText: value } : prev))}
                    style={styles.textAreaMedium}
                  />
                  {jsonFieldErrors.configError ? <MetaText>{jsonFieldErrors.configError}</MetaText> : null}
                </ThemedView>

                <ThemedView style={styles.fieldGroup}>
                  <MetaText>Wijzigingsnotitie</MetaText>
                  <TextAreaField
                    value={form.changelog}
                    onChangeText={(value) => setForm((prev) => (prev ? { ...prev, changelog: value } : prev))}
                    style={styles.textAreaSmall}
                  />
                </ThemedView>
              </ThemedView>
            </AdminAccordion>
          </AdminSection>
        </>
      ) : null}

      {!loading && detail && !selectedDraft ? (
        <StateBlock tone="info" message="Nog geen draft" detail="Ga terug naar overzicht om eerst een draft te maken." />
      ) : null}

      <DestructiveConfirmSheet
        visible={showDeleteDialog}
        title="Draft verwijderen?"
        message="Deze versie is nog niet actief en wordt verwijderd."
        secondaryLabel="Annuleren"
        confirmLabel={deletingDraft ? 'Verwijderen…' : 'Verwijderen'}
        processing={deletingDraft}
        onCancel={() => {
          if (!deletingDraft) setShowDeleteDialog(false);
        }}
        onConfirm={() => void handleDeleteDraft()}
      />

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />

      <Modal visible={Boolean(activeAssistTarget)} transparent animationType="fade" onRequestClose={closeAssistPanel}>
        <ModalBackdrop
          onPressOutside={closeAssistPanel}
          contentStyle={[styles.assistOverlayWrap, isWideAssistLayout ? styles.assistOverlayWrapWide : null]}
        >
          <ThemedView
            lightColor={colorTokens.light.surfaceLowest}
            darkColor={colorTokens.dark.surface}
            style={[styles.assistOverlayCard, { borderColor: palette.separator, maxHeight: assistOverlayMaxHeight }]}
          >
            <ThemedView style={styles.assistHeaderRow}>
              <ThemedText type="defaultSemiBold">Assist — {activeAssistTarget?.key ?? 'laag'}</ThemedText>
              <HeaderIconButton accessibilityRole="button" onPress={closeAssistPanel} size={40}>
                <MaterialIcons name="close" size={18} color={palette.text} />
              </HeaderIconButton>
            </ThemedView>
            {activeAssistTarget ? (
              <MetaText>{getLayerNoticeInfo(activeAssistTarget.layerType, activeAssistTarget.key).assistContextMessage}</MetaText>
            ) : null}

            <ScrollView style={styles.assistScrollBody} contentContainerStyle={styles.assistScrollBodyContent}>
              <ThemedView style={styles.assistQuickIntentRow}>
                {assistActions.map((action) => (
                  <Pressable
                    key={action.id}
                    accessibilityRole="button"
                    onPress={() => {
                      setSelectedAssistActionId(action.id);
                      setAssistIntent(action.helper);
                    }}
                    style={[
                      styles.assistQuickIntentChip,
                      {
                        backgroundColor:
                          selectedAssistActionId === action.id ? palette.surfaceLowest : palette.surfaceLow,
                      },
                    ]}
                  >
                    <ThemedText
                      type="caption"
                      style={{
                        color:
                          selectedAssistActionId === action.id ? palette.primary : palette.mutedSoft,
                        fontWeight: selectedAssistActionId === action.id ? '600' : '400',
                      }}
                    >
                      {action.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>

              <TextAreaField
                value={assistIntent}
                onChangeText={(value) => setAssistIntent(value)}
                style={styles.textAreaSmall}
                placeholder="Extra nuance (optioneel)"
                placeholderTextColor={scheme === 'dark' ? 'rgba(181, 173, 155, 0.56)' : 'rgba(115, 106, 86, 0.42)'}
              />

              {!selectedAssistActionId ? (
                assistHasTypedIntent ? (
                  <MetaText>Geen chip gekozen: je eigen instructie wordt gebruikt met neutrale actie Verhelderen.</MetaText>
                ) : (
                  <MetaText>Geen chip gekozen: standaardactie Compacter wordt gebruikt.</MetaText>
                )
              ) : null}
              {assistLoading ? <StateBlock tone="loading" message="Voorstel maken" /> : null}
              {assistError ? <StateBlock tone="error" message="Assist kon niet laden." detail={assistError} /> : null}

              {assistPreview ? (
                <>
                  {assistPreviewStale ? <MetaText>Voorstel is verouderd. Vernieuw eerst.</MetaText> : null}
                  <ThemedView style={styles.fieldGroup}>
                    <MetaText>Analyse</MetaText>
                    <ThemedText type="bodySecondary">{assistPreview.analysisSummary}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.fieldGroup}>
                    <MetaText>Wijzigingssamenvatting</MetaText>
                    <ThemedText type="bodySecondary">{assistPreview.changeSummary}</ThemedText>
                  </ThemedView>
                  {assistPreview.rationale ? (
                    <ThemedView style={styles.fieldGroup}>
                      <MetaText>Rationale</MetaText>
                      <ThemedText type="bodySecondary">{assistPreview.rationale}</ThemedText>
                    </ThemedView>
                  ) : null}
                  {effectiveAssistActionId === 'verdeel_over_velden' && assistSectionDiffs.length > 0 ? (
                    <ThemedView style={styles.fieldGroup}>
                      <MetaText>Voorstel per veld</MetaText>
                      {assistSectionDiffs.map((item) => (
                        <ThemedView key={item.key} style={styles.fieldGroup}>
                          <MetaText>{item.label}</MetaText>
                          <TextAreaField value={item.after} editable={false} style={styles.textAreaSmall} />
                        </ThemedView>
                      ))}
                    </ThemedView>
                  ) : (
                    <>
                      <TextAreaField value={assistPreview.proposedText} editable={false} style={styles.textAreaMedium} />
                      <ThemedView style={styles.inlineDiffWrap}>
                        <InlineWordDiffText beforeText={assistPreview.diff.before} afterText={assistPreview.diff.after} />
                      </ThemedView>
                    </>
                  )}
                </>
              ) : null}
            </ScrollView>

            <ThemedView style={styles.assistActionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => void runAssistPreview()}
                  disabled={assistLoading || !activeAssistTarget}
                style={[styles.assistActionButton, { backgroundColor: palette.surfaceLow }]}
              >
                <ThemedText type="caption" style={{ color: palette.primary }}>
                  {assistPreview ? 'Voorstel vernieuwen' : 'Maak voorstel'}
                </ThemedText>
              </Pressable>
              {assistPreview ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={applyAssistSuggestion}
                  disabled={assistPreviewStale}
                  style={[styles.assistActionButton, { backgroundColor: palette.surfaceLow }]}
                >
                  <ThemedText type="caption" style={{ color: palette.primary }}>
                    Toepassen
                  </ThemedText>
                </Pressable>
              ) : null}
            </ThemedView>
          </ThemedView>
        </ModalBackdrop>
      </Modal>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.content,
    gap: spacing.content,
  },
  heroBlock: {
    gap: spacing.xs,
  },
  editorColumn: {
    gap: spacing.section,
  },
  assistTrigger: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
  },
  advancedBody: {
    gap: spacing.sm,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  modelOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  modelOption: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  textAreaMedium: {
    minHeight: 140,
  },
  textAreaSmall: {
    minHeight: 90,
  },
  assistOverlayWrap: {
    width: '100%',
    maxWidth: 560,
  },
  assistOverlayWrapWide: {
    width: 520,
    alignSelf: 'flex-end',
  },
  assistOverlayCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  assistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assistScrollBody: {
    flex: 1,
  },
  assistScrollBodyContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  assistQuickIntentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  assistQuickIntentChip: {
    borderRadius: 999,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  inlineDiffWrap: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  assistActionRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  assistActionButton: {
    flex: 1,
    borderRadius: 999,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});