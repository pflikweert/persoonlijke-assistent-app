import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, type NativeSyntheticEvent, type TextInputSelectionChangeEventData } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
import { AiTokenEditor } from '@/components/ui/ai-token-editor';
import { insertTokenAtSelection } from '@/components/ui/ai-token-editor-utils';
import {
  InputField,
  MetaText,
  StateBlock,
  SurfaceSection,
  TextAreaField,
} from '@/components/ui/screen-primitives';
import {
  classifyUnknownError,
  deleteAdminAiQualityStudioDraftVersion,
  fetchAdminAiQualityStudioTaskDetail,
  updateAdminAiQualityStudioDraftVersion,
} from '@/services';
import type { AiTaskDetail } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';
import {
  AI_QUALITY_ALLOWED_MODELS,
  buildEntryCleanupPromptTemplate,
  DraftFormState,
  ENTRY_CLEANUP_TOKEN_DEFINITIONS,
  type EntryCleanupInstructionState,
  formatEntryCleanupInstructionStateForEditor,
  getEntryCleanupTokenById,
  getEntryCleanupInstructionWarnings,
  getDraftFormJsonFieldErrors,
  getEntryCleanupTechnicalContractFromConfig,
  getEntryCleanupTechnicalContractLines,
  getTaskInputContractLines,
  getTaskResponseContractFields,
  getTaskConsistencyInfo,
  getTaskContractNotice,
  isDraftFormDirty,
  parseEntryCleanupInstructionStateFromText,
  parseDraftFormState,
  toDraftFormState,
} from '../../_shared';

type EntryCleanupEditorKey = keyof EntryCleanupInstructionState;

export default function AiQualityStudioDraftScreen() {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
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
  const [entryCleanupSelections, setEntryCleanupSelections] = useState<Record<EntryCleanupEditorKey, { start: number; end: number }>>({
    systemRulesInstruction: { start: 0, end: 0 },
    generalInstruction: { start: 0, end: 0 },
    titleInstruction: { start: 0, end: 0 },
    bodyInstruction: { start: 0, end: 0 },
    summaryShortInstruction: { start: 0, end: 0 },
  });

  const selectedDraft = useMemo(() => {
    if (!detail) return null;
    const requestedId = typeof version === 'string' ? version.trim() : '';
    if (requestedId) {
      return detail.versions.find((item) => item.id === requestedId && item.status === 'draft') ?? null;
    }
    return detail.versions.find((item) => item.status === 'draft') ?? null;
  }, [detail, version]);

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
      const requestedId = typeof version === 'string' ? version.trim() : '';
      const draft = requestedId
        ? nextDetail.versions.find((item) => item.id === requestedId && item.status === 'draft') ?? null
        : nextDetail.versions.find((item) => item.status === 'draft') ?? null;

      setDetail(nextDetail);
      setForm(draft ? toDraftFormState(draft) : null);
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
      if (options?.testAfterSave) {
        router.push(`/settings-ai-quality-studio/${taskKey}/test/${selectedDraft.id}` as never);
      }
    } catch (nextError) {
      const parsedError = classifyUnknownError(nextError);
      setError(parsedError.message);
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
      router.replace(`/settings-ai-quality-studio/${taskKey}` as never);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
    } finally {
      setDeletingDraft(false);
    }
  }

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
    if (!form) {
      return { outputSchemaError: null, configError: null };
    }
    return getDraftFormJsonFieldErrors(form);
  }, [form]);

  const taskContract = useMemo(() => {
    if (!detail) return null;
    return getTaskContractNotice(detail.key);
  }, [detail]);

  const taskConsistency = useMemo(() => {
    if (!detail) return null;
    return getTaskConsistencyInfo(detail.key);
  }, [detail]);

  const isEntryCleanup = detail?.key === 'entry_cleanup';

  const entryCleanupModelSettings = useMemo(() => {
    if (!isEntryCleanup || !form) return null;
    try {
      const config = JSON.parse(form.configJsonText) as Record<string, unknown>;
      const temperature =
        typeof config.temperature === 'number' && Number.isFinite(config.temperature) ? config.temperature : 0.2;
      const responseFormat =
        typeof config.response_format === 'string' && config.response_format.trim().length > 0
          ? config.response_format
          : 'json_object';
      return {
        model: form.model,
        temperature,
        responseFormat,
      };
    } catch {
      return {
        model: form.model,
        temperature: 0.2,
        responseFormat: 'json_object',
      };
    }
  }, [form, isEntryCleanup]);

  const taskInputContractLines = useMemo(
    () => (detail ? getTaskInputContractLines(detail.key) : []),
    [detail]
  );
  const entryCleanupTechnicalContractLines = useMemo(() => {
    if (!isEntryCleanup || !selectedDraft) return [];
    const contract = getEntryCleanupTechnicalContractFromConfig(selectedDraft.configJson ?? {});
    return getEntryCleanupTechnicalContractLines(contract);
  }, [isEntryCleanup, selectedDraft]);
  const taskResponseContractFields = useMemo(
    () => (detail ? getTaskResponseContractFields(detail.key) : []),
    [detail]
  );

  const canSave = formDirty && formValid && !savingDraft && !deletingDraft;
  const canTest = !savingDraft && !deletingDraft;
  const primaryActionLabel = formDirty && formValid ? 'Opslaan en testen' : 'Test deze versie';
  const entryCleanupSubtitle = taskContract?.lines[0] ?? 'Bron opschonen tot rustig, natuurlijk Nederlands.';

  function updateEntryCleanupInstructionSection(section: EntryCleanupEditorKey, value: string) {
    setForm((prev) => {
      if (!prev) return prev;
      const parsedSections = parseEntryCleanupInstructionStateFromText(prev.taskInstruction);
      const nextSections: EntryCleanupInstructionState = {
        ...parsedSections,
        [section]: value,
      };
      return {
        ...prev,
        taskInstruction: formatEntryCleanupInstructionStateForEditor(nextSections),
        promptTemplateRaw: buildEntryCleanupPromptTemplate({
          promptTemplateRaw: prev.promptTemplateRaw,
          instructions: nextSections,
        }),
      };
    });
  }

  const entryCleanupInstructionSections = useMemo(() => {
    if (!isEntryCleanup || !form) {
      return null;
    }
    return parseEntryCleanupInstructionStateFromText(form.taskInstruction);
  }, [form, isEntryCleanup]);

  const entryCleanupInstructionWarnings = useMemo(() => {
    if (!entryCleanupInstructionSections) {
      return {
        systemRulesInstruction: [] as string[],
        generalInstruction: [] as string[],
        titleInstruction: [] as string[],
        bodyInstruction: [] as string[],
        summaryShortInstruction: [] as string[],
      };
    }

    return {
      systemRulesInstruction: getEntryCleanupInstructionWarnings(entryCleanupInstructionSections.systemRulesInstruction),
      generalInstruction: getEntryCleanupInstructionWarnings(entryCleanupInstructionSections.generalInstruction),
      titleInstruction: getEntryCleanupInstructionWarnings(entryCleanupInstructionSections.titleInstruction),
      bodyInstruction: getEntryCleanupInstructionWarnings(entryCleanupInstructionSections.bodyInstruction),
      summaryShortInstruction: getEntryCleanupInstructionWarnings(entryCleanupInstructionSections.summaryShortInstruction),
    };
  }, [entryCleanupInstructionSections]);

  function handleEntryCleanupSelectionChange(
    section: EntryCleanupEditorKey,
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) {
    const selection = event.nativeEvent.selection;
    setEntryCleanupSelections((prev) => ({
      ...prev,
      [section]: {
        start: selection.start,
        end: selection.end,
      },
    }));
  }

  function insertFieldReferenceIntoEditor(
    targetEditor: EntryCleanupEditorKey,
    tokenId: 'rawText' | 'title' | 'body' | 'summary_short'
  ) {
    if (!isEntryCleanup) return;
    const currentValue = entryCleanupInstructionSections?.[targetEditor] ?? '';
    const selection = entryCleanupSelections[targetEditor] ?? { start: currentValue.length, end: currentValue.length };
    const token = getEntryCleanupTokenById(tokenId).token;
    const { nextValue, nextCursor } = insertTokenAtSelection({
      value: currentValue,
      tokenText: token,
      selectionStart: selection.start,
      selectionEnd: selection.end,
    });

    updateEntryCleanupInstructionSection(targetEditor, nextValue);
    setEntryCleanupSelections((prev) => ({
      ...prev,
      [targetEditor]: { start: nextCursor, end: nextCursor },
    }));
  }

  function renderTokenEditorField(args: {
    title: string;
    subtitle: string;
    section: EntryCleanupEditorKey;
    value: string;
    minHeight: number;
    warnings: string[];
  }) {
    return (
      <AdminEditorSection
        title={args.title}
        helper={args.subtitle}
        tokenRail={
          <AdminTokenRail>
            <AiTokenChipPicker
              tokens={ENTRY_CLEANUP_TOKEN_DEFINITIONS}
              onInsertToken={(tokenId) =>
                insertFieldReferenceIntoEditor(args.section, tokenId as 'rawText' | 'title' | 'body' | 'summary_short')
              }
            />
          </AdminTokenRail>
        }
        editor={
          <AiTokenEditor
            value={args.value}
            tokens={ENTRY_CLEANUP_TOKEN_DEFINITIONS}
            minHeight={args.minHeight}
            onSelectionChange={(event) => handleEntryCleanupSelectionChange(args.section, event)}
            onChangeText={(value) => updateEntryCleanupInstructionSection(args.section, value)}
          />
        }
        warnings={args.warnings}
      />
    );
  }

  const primaryAction = () => {
    if (formDirty && formValid) {
      void handleSaveDraft({ testAfterSave: true });
      return;
    }
    if (selectedDraft && detail) {
      router.push(`/settings-ai-quality-studio/${detail.key}/test/${selectedDraft.id}` as never);
    }
  };

  return (
    <AdminShell
      fixedHeader={<SettingsTopNav onBack={() => router.back()} onMenu={() => setMenuVisible(true)} />}
      fixedFooter={
        !loading && detail && selectedDraft && form ? (
          <AdminStickyFooterActions
            primaryAction={{
              label: savingDraft ? 'Bezig…' : primaryActionLabel,
              onPress: primaryAction,
              disabled: formDirty && !formValid ? true : !canTest,
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
            {isEntryCleanup ? (
              <ThemedView style={styles.heroBlock}>
                <ThemedText type="sectionTitle">Entry cleanup</ThemedText>
                <ThemedText type="bodySecondary">{entryCleanupSubtitle}</ThemedText>
                <MetaText>
                  Draft v{selectedDraft.versionNumber} · runtime-basis{' '}
                  {detail.liveVersion ? `v${detail.liveVersion.versionNumber}` : 'niet ingesteld'} · {selectedDraft.model}
                </MetaText>
                <ThemedView style={styles.inlineMetaWrap}>
                  <ThemedView style={[styles.metaChip, { backgroundColor: palette.surfaceLow }]}>
                    <MetaText>Beïnvloedt: {taskConsistency?.affectsLabel ?? 'title, body, summary_short'}</MetaText>
                  </ThemedView>
                  <ThemedView style={[styles.metaChip, { backgroundColor: palette.surfaceLow }]}>
                    <MetaText>Runtime-family: entry normalisatie</MetaText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            ) : (
              <SurfaceSection title="Samenvatting">
                <ThemedView style={styles.summaryGrid}>
                  <ThemedView style={styles.fieldGroup}>
                    <MetaText>Onderdeel</MetaText>
                    <ThemedText type="defaultSemiBold">{detail.label}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.fieldGroup}>
                    <MetaText>Draft versie</MetaText>
                    <ThemedText type="defaultSemiBold">v{selectedDraft.versionNumber}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.fieldGroup}>
                    <MetaText>Model</MetaText>
                    <ThemedText type="bodySecondary">{selectedDraft.model}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.fieldGroup}>
                    <MetaText>Huidige runtime-basis</MetaText>
                    <ThemedText type="bodySecondary">
                      {detail.liveVersion
                        ? `v${detail.liveVersion.versionNumber} · ${detail.liveVersion.model}`
                        : 'Nog niet ingesteld'}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </SurfaceSection>
            )}

            {isEntryCleanup ? (
              <ThemedView style={styles.entryCleanupMainLayout}>
                <ThemedView style={styles.entryCleanupMainColumn}>
                  {saveMessage ? <StateBlock tone="success" message={saveMessage} /> : null}

                  <ThemedView style={styles.editorBlock}>
                    <ThemedText type="defaultSemiBold">Bewerkbare instructies</ThemedText>
                    <MetaText>Pas gedrag aan per outputveld. Houd regels kort en brongebonden.</MetaText>
                  </ThemedView>

                  {renderTokenEditorField({
                    title: 'Systeemregels',
                    subtitle: 'Geldt altijd voor alle outputs. Houd dit inhoudelijk en brongebonden.',
                    section: 'systemRulesInstruction',
                    value: entryCleanupInstructionSections?.systemRulesInstruction ?? '',
                    minHeight: 150,
                    warnings: entryCleanupInstructionWarnings.systemRulesInstruction,
                  })}

                  {renderTokenEditorField({
                    title: 'Algemene instructie',
                    subtitle: 'Wat deze taak als geheel moet opleveren.',
                    section: 'generalInstruction',
                    value: entryCleanupInstructionSections?.generalInstruction ?? '',
                    minHeight: 150,
                    warnings: entryCleanupInstructionWarnings.generalInstruction,
                  })}

                  {renderTokenEditorField({
                    title: 'Titel',
                    subtitle: 'Alleen regels voor het veld `title`.',
                    section: 'titleInstruction',
                    value: entryCleanupInstructionSections?.titleInstruction ?? '',
                    minHeight: 120,
                    warnings: entryCleanupInstructionWarnings.titleInstruction,
                  })}

                  {renderTokenEditorField({
                    title: 'Body',
                    subtitle: 'Alleen regels voor het veld `body`.',
                    section: 'bodyInstruction',
                    value: entryCleanupInstructionSections?.bodyInstruction ?? '',
                    minHeight: 150,
                    warnings: entryCleanupInstructionWarnings.bodyInstruction,
                  })}

                  {renderTokenEditorField({
                    title: 'Summary_short',
                    subtitle: 'Alleen regels voor het veld `summary_short`.',
                    section: 'summaryShortInstruction',
                    value: entryCleanupInstructionSections?.summaryShortInstruction ?? '',
                    minHeight: 120,
                    warnings: entryCleanupInstructionWarnings.summaryShortInstruction,
                  })}
                </ThemedView>
              </ThemedView>
            ) : (
              <SurfaceSection title="Draft bewerken">
                {saveMessage ? <StateBlock tone="success" message={saveMessage} /> : null}
                <ThemedView style={styles.fieldGroup}>
                  <MetaText>Taakinstructie</MetaText>
                  <ThemedText type="caption">Dit is de instructie die je voor deze versie wilt testen.</ThemedText>
                  <TextAreaField
                    value={form.taskInstruction}
                    onChangeText={(value) => setForm((prev) => (prev ? { ...prev, taskInstruction: value } : prev))}
                    style={styles.textAreaLarge}
                  />
                </ThemedView>

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
                          style={[
                            styles.modelOption,
                            {
                              backgroundColor: active ? palette.surfaceLowest : palette.surfaceLow,
                            },
                          ]}
                        >
                          <ThemedText type="caption" style={{ color: active ? palette.primary : palette.mutedSoft }}>
                            {option.label}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </ThemedView>
                </ThemedView>

                {taskContract ? (
                  <StateBlock
                    tone="info"
                    message={taskContract.title}
                    detail={taskContract.lines.join(' · ')}
                  />
                ) : null}
              </SurfaceSection>
            )}

            <AdminSection title="Geavanceerd">
              <AdminAccordion
                title={advancedOpen ? 'Verberg geavanceerd' : 'Toon geavanceerd'}
                summary={advancedOpen ? 'Minder technische details' : 'Technisch contract, model en herkomst'}
                defaultOpen={advancedOpen}
                onToggle={setAdvancedOpen}
              >
                <ThemedView style={styles.advancedBody}>
                  {isEntryCleanup ? (
                    <>
                      <AdminReadOnlyBlock title="Input contract" lines={taskInputContractLines} />

                      <AdminReadOnlyBlock title="Technisch contract" lines={entryCleanupTechnicalContractLines} />

                      <AdminReadOnlyBlock
                        title="Response contract"
                        lines={taskResponseContractFields.map((field) => `${field.name}: ${field.type}`)}
                      />

                      <AdminReadOnlyBlock
                        title="Modelinstellingen"
                        lines={[
                          `Model: ${entryCleanupModelSettings?.model ?? form.model}`,
                          `Temperature: ${String(entryCleanupModelSettings?.temperature ?? 0.2)}`,
                          'Lagere temperature = stabieler resultaat met minder variatie.',
                          `response_format: ${entryCleanupModelSettings?.responseFormat ?? 'json_object'}`,
                          'response_format hoort bij het API/parse-contract.',
                        ]}
                      />

                      <AdminReadOnlyBlock title="Technische herkomst / runtime-basis">
                        {form.baselineMetadataJsonText ? (
                          <TextAreaField value={form.baselineMetadataJsonText} editable={false} style={styles.textAreaSmall} />
                        ) : (
                          <MetaText>Geen baseline metadata beschikbaar.</MetaText>
                        )}
                      </AdminReadOnlyBlock>
                    </>
                  ) : (
                    <>
                      <ThemedView style={styles.advancedGroup}>
                        <ThemedText type="defaultSemiBold">Vaste regels</ThemedText>
                        {form.promptTemplateInputContext ? (
                          <ThemedView style={styles.fieldGroup}>
                            <MetaText>Technische herkomst / inputmapping</MetaText>
                            <TextAreaField value={form.promptTemplateInputContext} editable={false} style={styles.textAreaMedium} />
                          </ThemedView>
                        ) : null}

                        <ThemedView style={styles.fieldGroup}>
                          <MetaText>System instructions</MetaText>
                          <TextAreaField
                            value={form.systemInstructions}
                            onChangeText={(value) =>
                              setForm((prev) => (prev ? { ...prev, systemInstructions: value } : prev))
                            }
                            style={styles.textAreaMedium}
                          />
                        </ThemedView>
                      </ThemedView>

                      <ThemedView style={styles.advancedGroup}>
                        <ThemedText type="defaultSemiBold">Outputvorm</ThemedText>
                        {taskConsistency?.representation === 'shared_runtime_family' ? (
                          <MetaText>
                            Deze taak zit in een gedeelde runtime-family. Dit schema hoort bij de studio-taakweergave,
                            terwijl runtime meerdere outputs samen opbouwt.
                          </MetaText>
                        ) : null}
                        <ThemedView style={styles.fieldGroup}>
                          <MetaText>Output schema JSON</MetaText>
                          <TextAreaField
                            value={form.outputSchemaJsonText}
                            onChangeText={(value) =>
                              setForm((prev) => (prev ? { ...prev, outputSchemaJsonText: value } : prev))
                            }
                            style={styles.textAreaMedium}
                          />
                          {jsonFieldErrors.outputSchemaError ? (
                            <MetaText>Output schema: {jsonFieldErrors.outputSchemaError}</MetaText>
                          ) : null}
                        </ThemedView>
                      </ThemedView>

                      <ThemedView style={styles.advancedGroup}>
                        <ThemedText type="defaultSemiBold">Modelinstellingen</ThemedText>
                        <ThemedView style={styles.fieldGroup}>
                          <MetaText>Config JSON</MetaText>
                          <TextAreaField
                            value={form.configJsonText}
                            onChangeText={(value) =>
                              setForm((prev) => (prev ? { ...prev, configJsonText: value } : prev))
                            }
                            style={styles.textAreaMedium}
                          />
                          {jsonFieldErrors.configError ? <MetaText>Config: {jsonFieldErrors.configError}</MetaText> : null}
                        </ThemedView>

                        <ThemedView style={styles.inlineFields}>
                          <ThemedView style={styles.inlineFieldItem}>
                            <MetaText>Min items</MetaText>
                            <InputField
                              keyboardType="numeric"
                              value={form.minItemsText}
                              onChangeText={(value) => setForm((prev) => (prev ? { ...prev, minItemsText: value } : prev))}
                            />
                          </ThemedView>
                          <ThemedView style={styles.inlineFieldItem}>
                            <MetaText>Max items</MetaText>
                            <InputField
                              keyboardType="numeric"
                              value={form.maxItemsText}
                              onChangeText={(value) => setForm((prev) => (prev ? { ...prev, maxItemsText: value } : prev))}
                            />
                          </ThemedView>
                        </ThemedView>
                      </ThemedView>

                      <ThemedView style={styles.advancedGroup}>
                        <ThemedText type="defaultSemiBold">Technische herkomst</ThemedText>
                        {form.baselineMetadataJsonText ? (
                          <ThemedView style={styles.fieldGroup}>
                            <MetaText>Baseline metadata (read-only)</MetaText>
                            <TextAreaField value={form.baselineMetadataJsonText} editable={false} style={styles.textAreaSmall} />
                          </ThemedView>
                        ) : (
                          <MetaText>Geen baseline metadata beschikbaar.</MetaText>
                        )}
                      </ThemedView>

                      <ThemedView style={styles.fieldGroup}>
                        <MetaText>Wijzigingsnotitie</MetaText>
                        <TextAreaField
                          value={form.changelog}
                          onChangeText={(value) => setForm((prev) => (prev ? { ...prev, changelog: value } : prev))}
                          style={styles.textAreaSmall}
                        />
                      </ThemedView>
                    </>
                  )}
                </ThemedView>
              </AdminAccordion>
            </AdminSection>
          </>
        ) : null}

        {!loading && detail && !selectedDraft ? (
          <StateBlock
            tone="info"
            message="Nog geen draft"
            detail="Ga terug naar overzicht om eerst een draft te maken."
          />
        ) : null}
      <ConfirmDialog
        visible={showDeleteDialog}
        title="Draft verwijderen?"
        message="Deze versie is nog niet actief en wordt verwijderd."
        cancelLabel="Annuleren"
        confirmLabel="Verwijderen"
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
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.content,
    gap: spacing.content,
  },
  heroBlock: {
    gap: spacing.sm,
  },
  inlineMetaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metaChip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  entryCleanupMainLayout: {
    gap: spacing.section,
  },
  entryCleanupMainColumn: {
    gap: spacing.section,
  },
  editorBlock: {
    gap: spacing.xs,
  },
  fieldChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chipGroup: {
    gap: spacing.xs,
  },
  fieldChip: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  inputFieldChip: {
    minHeight: 28,
  },
  outputFieldChip: {
    minHeight: 28,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  summaryGrid: {
    gap: spacing.sm,
  },
  advancedToggle: {
    gap: spacing.xxs,
  },
  advancedBody: {
    gap: spacing.sm,
  },
  advancedGroup: {
    gap: spacing.xs,
  },
  modelOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  modelOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  inlineFields: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inlineFieldItem: {
    flex: 1,
    gap: spacing.xs,
  },
  textAreaLarge: {
    minHeight: 180,
  },
  textAreaMedium: {
    minHeight: 140,
  },
  textAreaSmall: {
    minHeight: 90,
  },
  textAreaInstruction: {
    minHeight: 150,
  },
  textAreaSection: {
    minHeight: 120,
  },
});
