import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { HeaderIconButton } from '@/components/ui/header-icon-button';
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
  runAdminAiQualityStudioPromptAssistPreview,
  updateAdminAiQualityStudioDraftVersion,
} from '@/services';
import type {
  AiPromptAssistPreviewResult,
  AiTaskDetail,
  EntryCleanupPromptAssistTargetLayer,
} from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, spacing } from '@/theme';
import {
  AI_QUALITY_ALLOWED_MODELS,
  buildEntryCleanupPromptTemplate,
  DraftFormState,
  ENTRY_CLEANUP_TOKEN_DEFINITIONS,
  type EntryCleanupInstructionState,
  formatEntryCleanupInstructionStateForEditor,
  getEntryCleanupPromptAssistTargetLabel,
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

const ENTRY_CLEANUP_ASSIST_TARGET_BY_SECTION: Partial<
  Record<EntryCleanupEditorKey, EntryCleanupPromptAssistTargetLayer>
> = {
  systemRulesInstruction: 'systemRulesInstruction',
  generalInstruction: 'generalInstruction',
  titleInstruction: 'titleInstruction',
  bodyInstruction: 'bodyInstruction',
  summaryShortInstruction: 'summaryShortInstruction',
};

const ASSIST_QUICK_INTENTS = ['Compacter', 'Ontdubbelen', 'Verhelderen', 'Check overlap'] as const;

type InlineDiffSegment = {
  kind: 'unchanged' | 'removed' | 'added';
  text: string;
};

const INLINE_DIFF_MINOR_BRIDGE_PATTERN = /^[\s.,;:!?()[\]{}"“”'’`…\-–—/\\]+$/;

function tokenizeWithFallback(input: string): string[] {
  const tokens = input.match(/(\s+|[.,!?;:()[\]{}"“”'’`…\-–—/\\]+|[^\s.,!?;:()[\]{}"“”'’`…\-–—/\\]+)/g);
  return tokens ?? [];
}

function tokenizeWithSegmenter(input: string): string[] {
  const SegmenterCtor = Intl?.Segmenter;
  if (!SegmenterCtor) {
    return tokenizeWithFallback(input);
  }

  try {
    const segmenter = new SegmenterCtor('nl', { granularity: 'word' });
    return Array.from(segmenter.segment(input), (item) => item.segment);
  } catch {
    return tokenizeWithFallback(input);
  }
}

function tokenizeForInlineDiff(input: string): string[] {
  if (!input) return [];

  const placeholderPattern = /(\{\{[^{}]+\}\})/g;
  const chunks = input.split(placeholderPattern).filter((chunk) => chunk.length > 0);
  const tokens: string[] = [];

  for (const chunk of chunks) {
    if (/^\{\{[^{}]+\}\}$/.test(chunk)) {
      tokens.push(chunk);
      continue;
    }
    tokens.push(...tokenizeWithSegmenter(chunk));
  }

  return tokens;
}

function mergeAdjacentInlineDiffSegments(segments: InlineDiffSegment[]): InlineDiffSegment[] {
  const merged: InlineDiffSegment[] = [];
  for (const segment of segments) {
    if (!segment.text) continue;
    const previous = merged[merged.length - 1];
    if (previous && previous.kind === segment.kind) {
      previous.text += segment.text;
      continue;
    }
    merged.push({ ...segment });
  }
  return merged;
}

function isMinorBridgeSegment(text: string): boolean {
  if (!text || text.includes('\n')) return false;
  return text.length <= 8 && INLINE_DIFF_MINOR_BRIDGE_PATTERN.test(text);
}

function absorbMinorUnchangedBridges(segments: InlineDiffSegment[]): InlineDiffSegment[] {
  const next: InlineDiffSegment[] = [];

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const previous = next[next.length - 1];
    const following = segments[index + 1];

    if (
      segment.kind === 'unchanged' &&
      isMinorBridgeSegment(segment.text) &&
      previous &&
      previous.kind !== 'unchanged' &&
      following &&
      following.kind !== 'unchanged'
    ) {
      previous.text += segment.text;
      continue;
    }

    next.push({ ...segment });
  }

  return mergeAdjacentInlineDiffSegments(next);
}

function rebalanceChangedSegmentWhitespace(segments: InlineDiffSegment[]): InlineDiffSegment[] {
  const next = segments.map((segment) => ({ ...segment }));

  for (let index = 0; index < next.length; index += 1) {
    const segment = next[index];
    if (segment.kind === 'unchanged') continue;

    const previous = next[index - 1];
    const following = next[index + 1];

    const leadingWhitespace = segment.text.match(/^[ \t]+/)?.[0] ?? '';
    if (leadingWhitespace && previous) {
      previous.text += leadingWhitespace;
      segment.text = segment.text.slice(leadingWhitespace.length);
    }

    const trailingWhitespace = segment.text.match(/[ \t]+$/)?.[0] ?? '';
    if (trailingWhitespace && following) {
      following.text = `${trailingWhitespace}${following.text}`;
      segment.text = segment.text.slice(0, segment.text.length - trailingWhitespace.length);
    }
  }

  return mergeAdjacentInlineDiffSegments(next).filter((segment) => segment.text.length > 0);
}

function buildInlineDiffSegments(beforeText: string, afterText: string): InlineDiffSegment[] {
  const before = tokenizeForInlineDiff(beforeText);
  const after = tokenizeForInlineDiff(afterText);

  const dp: number[][] = Array.from({ length: before.length + 1 }, () => Array(after.length + 1).fill(0));
  for (let i = before.length - 1; i >= 0; i -= 1) {
    for (let j = after.length - 1; j >= 0; j -= 1) {
      if (before[i] === after[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const rawSegments: InlineDiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) {
      rawSegments.push({ kind: 'unchanged', text: before[i] });
      i += 1;
      j += 1;
      continue;
    }

    const removeScore = dp[i + 1][j];
    const addScore = dp[i][j + 1];

    let takeRemove = false;
    if (removeScore > addScore) {
      takeRemove = true;
    } else if (removeScore < addScore) {
      takeRemove = false;
    } else if (before[i + 1] === after[j]) {
      takeRemove = true;
    } else if (before[i] === after[j + 1]) {
      takeRemove = false;
    }

    if (takeRemove) {
      rawSegments.push({ kind: 'removed', text: before[i] });
      i += 1;
    } else {
      rawSegments.push({ kind: 'added', text: after[j] });
      j += 1;
    }
  }

  while (i < before.length) {
    rawSegments.push({ kind: 'removed', text: before[i] });
    i += 1;
  }
  while (j < after.length) {
    rawSegments.push({ kind: 'added', text: after[j] });
    j += 1;
  }

  const merged = mergeAdjacentInlineDiffSegments(rawSegments);
  const grouped = absorbMinorUnchangedBridges(merged);
  return rebalanceChangedSegmentWhitespace(grouped);
}

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
  const [entryCleanupPendingTokenInsert, setEntryCleanupPendingTokenInsert] = useState<Record<EntryCleanupEditorKey, string | null>>({
    systemRulesInstruction: null,
    generalInstruction: null,
    titleInstruction: null,
    bodyInstruction: null,
    summaryShortInstruction: null,
  });
  const [entryCleanupEditorStates, setEntryCleanupEditorStates] = useState<Record<EntryCleanupEditorKey, PromptEditorState | null>>({
    systemRulesInstruction: null,
    generalInstruction: null,
    titleInstruction: null,
    bodyInstruction: null,
    summaryShortInstruction: null,
  });
  const [activeAssistTarget, setActiveAssistTarget] = useState<EntryCleanupPromptAssistTargetLayer | null>(null);
  const [assistIntent, setAssistIntent] = useState('');
  const [assistLoading, setAssistLoading] = useState(false);
  const [assistError, setAssistError] = useState<string | null>(null);
  const [assistPreview, setAssistPreview] = useState<AiPromptAssistPreviewResult | null>(null);

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
        router.push(`/settings-ai-quality-studio/${taskKey}/validate/${selectedDraft.id}` as never);
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
  const primaryActionLabel = formDirty && formValid ? 'Opslaan en valideren' : 'Valideer deze versie';
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

  function insertFieldReferenceIntoEditor(
    targetEditor: EntryCleanupEditorKey,
    tokenId: 'rawText' | 'title' | 'body' | 'summary_short'
  ) {
    if (!isEntryCleanup) return;
    const token = getEntryCleanupTokenById(tokenId);
    setEntryCleanupPendingTokenInsert((prev) => ({
      ...prev,
      [targetEditor]: token.id,
    }));
  }

  function getUnknownTokenWarnings(section: EntryCleanupEditorKey): string[] {
    const tokenIds: string[] = entryCleanupEditorStates[section]?.tokenIds ?? [];
    return Array.from(
      new Set(
        tokenIds
          .filter((tokenId: string) => !ENTRY_CLEANUP_TOKEN_DEFINITIONS.some((item) => item.id === tokenId))
          .map((tokenId: string) => `Onbekende token-id in editor-state: ${tokenId}`)
      )
    );
  }

  function openAssistForSection(section: EntryCleanupEditorKey) {
    const target = ENTRY_CLEANUP_ASSIST_TARGET_BY_SECTION[section] ?? null;
    if (!target) return;
    if (activeAssistTarget === target) {
      closeAssistPanel();
      return;
    }
    setActiveAssistTarget(target);
    setAssistIntent('');
    setAssistError(null);
    setAssistPreview(null);
  }

  function closeAssistPanel() {
    setActiveAssistTarget(null);
    setAssistLoading(false);
    setAssistError(null);
    setAssistPreview(null);
    setAssistIntent('');
  }

  async function runAssistPreview(targetLayerKey: EntryCleanupPromptAssistTargetLayer) {
    if (!detail || !selectedDraft || !entryCleanupInstructionSections) return;

    setAssistLoading(true);
    setAssistError(null);
    setAssistPreview(null);

    try {
      const preview = await runAdminAiQualityStudioPromptAssistPreview({
        taskKey: detail.key,
        versionId: selectedDraft.id,
        targetLayerKey,
        assistIntent,
        editorContext: {
          systemRulesInstruction: entryCleanupInstructionSections.systemRulesInstruction,
          generalInstruction: entryCleanupInstructionSections.generalInstruction,
          fieldRules: {
            titleInstruction: entryCleanupInstructionSections.titleInstruction,
            bodyInstruction: entryCleanupInstructionSections.bodyInstruction,
            summaryShortInstruction: entryCleanupInstructionSections.summaryShortInstruction,
          },
          outputContract: {
            fields: taskResponseContractFields,
          },
          taskMetadata: {
            taskKey: detail.key,
            taskLabel: detail.label,
            versionId: selectedDraft.id,
            versionNumber: selectedDraft.versionNumber,
          },
        },
      });

      setAssistPreview(preview);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setAssistError(parsed.message);
    } finally {
      setAssistLoading(false);
    }
  }

  function applyAssistToTarget() {
    if (!activeAssistTarget || !assistPreview) return;
    const section = activeAssistTarget as EntryCleanupEditorKey;
    updateEntryCleanupInstructionSection(section, assistPreview.proposedText);
    setSaveMessage(`Voorstel toegepast op ${getEntryCleanupPromptAssistTargetLabel(activeAssistTarget)}.`);
    closeAssistPanel();
  }

  function renderTokenEditorField(args: {
    title: string;
    subtitle: string;
    section: EntryCleanupEditorKey;
    value: string;
    minHeight: number;
    warnings: string[];
  }) {
    const assistTarget = ENTRY_CLEANUP_ASSIST_TARGET_BY_SECTION[args.section] ?? null;
    const assistOpen = activeAssistTarget === assistTarget;

    return (
      <ThemedView style={styles.assistSectionWrap}>
        <AdminEditorSection
          title={args.title}
          action={
            assistTarget ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => openAssistForSection(args.section)}
                style={[
                  styles.assistTrigger,
                  {
                    backgroundColor: assistOpen ? palette.surfaceLowest : palette.surfaceLow,
                    borderColor: assistOpen ? palette.primary : palette.separator,
                  },
                ]}
              >
                <ThemedText type="caption" style={{ color: palette.primary }}>
                  {assistOpen ? 'Assist sluiten' : 'Assist'}
                </ThemedText>
              </Pressable>
            ) : undefined
          }
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
              onChangeText={(value) => updateEntryCleanupInstructionSection(args.section, value)}
              requestInsertTokenId={entryCleanupPendingTokenInsert[args.section]}
              onInsertTokenHandled={() =>
                setEntryCleanupPendingTokenInsert((prev) => ({
                  ...prev,
                  [args.section]: null,
                }))
              }
              onEditorStateChange={(state) =>
                setEntryCleanupEditorStates((prev) => ({
                  ...prev,
                  [args.section]: state,
                }))
              }
            />
          }
          warnings={[...args.warnings, ...getUnknownTokenWarnings(args.section)]}
        />
      </ThemedView>
    );
  }

  const assistInlineDiffSegments = useMemo(() => {
    if (!assistPreview) return [] as InlineDiffSegment[];
    return buildInlineDiffSegments(assistPreview.diff.before, assistPreview.diff.after);
  }, [assistPreview]);

  const activeAssistTargetLabel = activeAssistTarget
    ? getEntryCleanupPromptAssistTargetLabel(activeAssistTarget)
    : '';

  const assistChangeSummary = assistPreview?.changeSummary?.trim() || 'Voorstel gemaakt op basis van jouw intent.';
  const assistAdviceSummary =
    assistPreview?.rationale?.trim() || assistPreview?.analysisSummary?.trim() || 'Advies: compacter geformuleerd met behoud van taakbetekenis en contract.';
  const assistIssueLines = useMemo(() => {
    if (!assistPreview) return [] as string[];
    const issues = assistPreview.issues;
    const overlapCount = issues.filter((item) => item.type === 'duplicate' || item.type === 'misplaced').length;
    const riskCount = issues.filter((item) => item.type === 'conflict' || item.severity === 'risk').length;
    const lines: string[] = [];
    if (riskCount > 0) {
      lines.push(`${riskCount} risico${riskCount > 1 ? "'s" : ''} gevonden.`);
    }
    if (overlapCount > 0) {
      lines.push(`${overlapCount} overlap/plaatsingspunt gevonden.`);
    }
    for (const issue of issues.slice(0, 3)) {
      lines.push(issue.message);
    }
    if (lines.length === 0) {
      lines.push('Geen risico’s of conflicten gevonden.');
    }
    return lines;
  }, [assistPreview]);

  const primaryAction = () => {
    if (formDirty && formValid) {
      void handleSaveDraft({ testAfterSave: true });
      return;
    }
    if (selectedDraft && detail) {
      router.push(`/settings-ai-quality-studio/${detail.key}/validate/${selectedDraft.id}` as never);
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

      <Modal
        visible={Boolean(activeAssistTarget)}
        transparent
        animationType="fade"
        onRequestClose={closeAssistPanel}
      >
        <ModalBackdrop
          onPressOutside={closeAssistPanel}
          contentStyle={[
            styles.assistOverlayWrap,
            isWideAssistLayout ? styles.assistOverlayWrapWide : null,
          ]}
        >
          <ThemedView
            lightColor={colorTokens.light.surfaceLowest}
            darkColor={colorTokens.dark.surface}
            style={[styles.assistOverlayCard, { borderColor: palette.separator, maxHeight: assistOverlayMaxHeight }]}
          >
            <ThemedView style={styles.assistFixedHeader}>
              <ThemedView style={styles.assistHeaderRow}>
                <ThemedText type="defaultSemiBold">Assist — {activeAssistTargetLabel}</ThemedText>
                <HeaderIconButton accessibilityRole="button" onPress={closeAssistPanel} size={40}>
                  <MaterialIcons name="close" size={18} color={palette.text} />
                </HeaderIconButton>
              </ThemedView>
              <MetaText>
                {activeAssistTarget === 'systemRulesInstruction'
                  ? 'Geldt voor alle outputs • Alleen deze laag wordt gewijzigd'
                  : 'Volledige context • Alleen deze laag wordt gewijzigd'}
              </MetaText>
            </ThemedView>

            <ScrollView style={styles.assistScrollBody} contentContainerStyle={styles.assistScrollBodyContent}>
              <ThemedView style={styles.fieldGroup}>
                <MetaText>Wat wil je aanpassen?</MetaText>
                <ThemedView style={styles.assistQuickIntentRow}>
                  {ASSIST_QUICK_INTENTS.map((chip) => (
                    <Pressable
                      key={chip}
                      accessibilityRole="button"
                      onPress={() => setAssistIntent(chip)}
                      style={[styles.assistQuickIntentChip, { backgroundColor: palette.surfaceLow }]}
                    >
                      <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                        {chip}
                      </ThemedText>
                    </Pressable>
                  ))}
                </ThemedView>
                <TextAreaField
                  value={assistIntent}
                  onChangeText={setAssistIntent}
                  style={styles.assistIntentInput}
                  placeholder="bijv. maak compacter"
                />
              </ThemedView>

              {assistLoading ? <StateBlock tone="loading" message="Voorstel maken" /> : null}
              {assistError ? <StateBlock tone="error" message="Assist kon niet laden." detail={assistError} /> : null}

              {assistPreview ? (
                <>
                <ThemedView style={styles.assistResultGroup}>
                  <ThemedText type="defaultSemiBold">Wat is aangepast</ThemedText>
                  <MetaText>{assistChangeSummary}</MetaText>
                </ThemedView>

                <ThemedView style={styles.assistResultGroup}>
                  <ThemedText type="defaultSemiBold">Advies</ThemedText>
                  <MetaText>{assistAdviceSummary}</MetaText>
                </ThemedView>

                <ThemedView style={styles.assistResultGroup}>
                  <ThemedText type="defaultSemiBold">Voorstel</ThemedText>
                  <TextAreaField value={assistPreview.proposedText} editable={false} style={styles.assistReadOnlyText} />
                </ThemedView>

                <ThemedView style={styles.assistResultGroup}>
                  <ThemedText type="defaultSemiBold">Verschil</ThemedText>
                  <ThemedView style={styles.inlineDiffWrap}>
                    {assistInlineDiffSegments.length === 0 ? (
                      <MetaText>Geen zichtbaar verschil.</MetaText>
                    ) : (
                      <ThemedText type="bodySecondary" style={{ color: palette.text }}>
                        {assistInlineDiffSegments.map((segment, index) => (
                          <Text
                            key={`${segment.kind}-${index}`}
                            style={[
                              styles.diffTokenBase,
                              segment.kind === 'removed'
                                ? styles.diffRemoveText
                                : segment.kind === 'added'
                                  ? styles.diffAddText
                                  : undefined,
                            ]}
                          >
                            {segment.text}
                          </Text>
                        ))}
                      </ThemedText>
                    )}
                  </ThemedView>
                </ThemedView>

                {assistPreview.issues.length > 0 ? (
                  <ThemedView style={styles.assistResultGroup}>
                    <ThemedText type="defaultSemiBold">Aandachtspunten</ThemedText>
                    {assistIssueLines.map((line, index) => (
                      <MetaText key={`${line}-${index}`}>• {line}</MetaText>
                    ))}
                  </ThemedView>
                ) : (
                  <MetaText>Geen risico’s of conflicten gevonden.</MetaText>
                )}

                </>
              ) : (
                <MetaText>Voorstel verschijnt hier zodra je op Maak voorstel klikt.</MetaText>
              )}
            </ScrollView>

            <ThemedView style={styles.assistFixedFooter}>
              <ThemedView style={styles.assistActionRow}>
              {assistPreview ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={applyAssistToTarget}
                  style={[styles.assistActionButton, { backgroundColor: palette.surfaceLow }]}
                >
                  <ThemedText type="caption" style={{ color: palette.primary }}>
                    Toepassen op deze laag
                  </ThemedText>
                </Pressable>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => activeAssistTarget && void runAssistPreview(activeAssistTarget)}
                  disabled={assistLoading || !activeAssistTarget}
                  style={[
                    styles.assistActionButton,
                    {
                      backgroundColor: palette.surfaceLow,
                      opacity: assistLoading ? 0.6 : 1,
                    },
                  ]}
                >
                  <ThemedText type="caption" style={{ color: palette.primary }}>
                    Maak voorstel
                  </ThemedText>
                </Pressable>
              )}

              <Pressable
                accessibilityRole="button"
                onPress={closeAssistPanel}
                style={[styles.assistActionButton, { backgroundColor: palette.surfaceLow }]}
              >
                <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                  Sluiten
                </ThemedText>
              </Pressable>
              </ThemedView>
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
  assistSectionWrap: {
    gap: spacing.sm,
  },
  assistTrigger: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
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
    gap: spacing.xs,
  },
  assistFixedHeader: {
    gap: spacing.xxs,
  },
  assistScrollBody: {
    flex: 1,
  },
  assistScrollBodyContent: {
    gap: spacing.sm,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.xxs,
  },
  assistFixedFooter: {
    paddingTop: spacing.xxs,
  },
  assistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  assistIntentInput: {
    minHeight: 44,
  },
  assistResultGroup: {
    gap: spacing.xxs,
  },
  assistReadOnlyText: {
    minHeight: 150,
  },
  inlineDiffWrap: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  diffTokenBase: {
    borderRadius: 4,
    paddingHorizontal: 1,
  },
  diffRemoveText: {
    textDecorationLine: 'line-through',
    backgroundColor: 'rgba(186, 64, 67, 0.12)',
  },
  diffAddText: {
    backgroundColor: 'rgba(52, 138, 83, 0.14)',
  },
  assistActionRow: {
    flexDirection: 'row',
    gap: spacing.xs,
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
  assistActionButton: {
    flex: 1,
    borderRadius: 999,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
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
