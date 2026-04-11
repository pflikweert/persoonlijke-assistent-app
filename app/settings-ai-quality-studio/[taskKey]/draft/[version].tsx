import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/confirm-dialog';
import { FullscreenMenuOverlay } from '@/components/navigation/fullscreen-menu-overlay';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SettingsScreenHeader } from '@/components/ui/settings-screen-primitives';
import {
  InputField,
  MetaText,
  PrimaryButton,
  SecondaryButton,
  ScreenContainer,
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
  deriveDraftOriginLabel,
  DraftFormState,
  formatDateTimeLabel,
  getDraftFormJsonFieldErrors,
  getTaskConsistencyInfo,
  getTaskContractNotice,
  isDraftFormDirty,
  parseDraftFormState,
  toDraftFormState,
} from '../../_shared';

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

  const canSave = formDirty && formValid && !savingDraft && !deletingDraft;
  const canTest = !savingDraft && !deletingDraft;
  const primaryActionLabel = formDirty && formValid ? 'Opslaan en testen' : 'Test deze versie';
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
    <ScreenContainer backgroundTone="flat" style={styles.screenContainer}>
      <SettingsScreenHeader
        title="Draft bewerken"
        subtitle={detail?.label ?? 'AI Quality Studio'}
        onBack={() => router.back()}
        onMenu={() => setMenuVisible(true)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? <StateBlock tone="loading" message="Draft laden" /> : null}
        {!loading && error ? <StateBlock tone="error" message="Kon draft niet laden." detail={error} /> : null}

        {!loading && detail && selectedDraft && form ? (
          <>
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

                <ThemedView style={styles.fieldGroup}>
                  <MetaText>{deriveDraftOriginLabel(detail, selectedDraft)}</MetaText>
                  {selectedDraft.updatedAt ? (
                    <ThemedText type="caption">Bijgewerkt: {formatDateTimeLabel(selectedDraft.updatedAt)}</ThemedText>
                  ) : null}
                </ThemedView>

                <ThemedView style={styles.fieldGroup}>
                  <MetaText>Technische key: {detail.key}</MetaText>
                  {selectedDraft.changelog ? <MetaText>Laatste notitie: {selectedDraft.changelog}</MetaText> : null}
                </ThemedView>

                {taskConsistency ? (
                  <ThemedView style={styles.fieldGroup}>
                    <MetaText>Beïnvloedt: {taskConsistency.affectsLabel}</MetaText>
                    {taskConsistency.familyLabel ? <MetaText>{taskConsistency.familyLabel}</MetaText> : null}
                  </ThemedView>
                ) : null}
              </ThemedView>
            </SurfaceSection>

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

              {taskConsistency?.representation === 'shared_runtime_family' && taskConsistency.explanation ? (
                <StateBlock tone="info" message="Gedeelde runtime-flow" detail={taskConsistency.explanation} />
              ) : null}
            </SurfaceSection>

            <SurfaceSection title="Geavanceerde instellingen">
              <Pressable
                accessibilityRole="button"
                onPress={() => setAdvancedOpen((prev) => !prev)}
                style={styles.advancedToggle}
              >
                <ThemedText type="defaultSemiBold">{advancedOpen ? 'Verberg geavanceerd' : 'Toon geavanceerd'}</ThemedText>
                <MetaText>{advancedOpen ? 'Minder technische details' : 'System, schema, config en limieten'}</MetaText>
              </Pressable>

              {advancedOpen ? (
                <ThemedView style={styles.advancedBody}>
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
                </ThemedView>
              ) : null}
            </SurfaceSection>
          </>
        ) : null}

        {!loading && detail && !selectedDraft ? (
          <StateBlock
            tone="info"
            message="Nog geen draft"
            detail="Ga terug naar overzicht om eerst een draft te maken."
          />
        ) : null}
      </ScrollView>

      {!loading && detail && selectedDraft && form ? (
        <ThemedView
          lightColor={colorTokens.light.surfaceLowest}
          darkColor={colorTokens.dark.surface}
          style={[styles.actionBar, { borderTopColor: palette.separator }]}
        >
          <PrimaryButton
            label={savingDraft ? 'Bezig…' : primaryActionLabel}
            onPress={primaryAction}
            disabled={formDirty && !formValid ? true : !canTest}
          />

          <SecondaryButton
            label={savingDraft ? 'Opslaan…' : 'Opslaan'}
            onPress={() => void handleSaveDraft()}
            disabled={!canSave}
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => setShowDeleteDialog(true)}
            disabled={savingDraft || deletingDraft}
          >
            <ThemedText type="caption" style={{ color: palette.destructiveSoftText }}>
              {deletingDraft ? 'Verwijderen…' : 'Draft verwijderen'}
            </ThemedText>
          </Pressable>
        </ThemedView>
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    paddingBottom: 0,
  },
  scrollContent: {
    paddingBottom: spacing.content,
    gap: spacing.content,
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
  actionBar: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
});
