import { router } from "expo-router";
import { useState } from "react";
import { Platform, Share, StyleSheet } from "react-native";

import {
  ExportPeriodSelectorModal,
  type ExportPeriodSelectorTab,
} from "@/components/feedback/export-period-selector-modal";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { NoticeCard } from "@/components/ui/notice-card";
import { RadioChoiceGroup } from "@/components/ui/radio-choice-group";
import {
  PrimaryButton,
  ScreenContainer,
  SecondaryButton,
  StateBlock,
  SurfaceSection,
} from "@/components/ui/screen-primitives";
import {
  SettingsScreenHeader,
  SettingsStateBody,
  SettingsStateIcon,
} from "@/components/ui/settings-screen-primitives";
import {
  ALL_DATE_SCOPE,
  classifyUnknownError,
  describeDateScope,
  downloadUserArchive,
  listSelectableDays,
  listSelectableMonths,
  listSelectableWeeks,
  previewArchiveScope,
  type ArchiveExportPreview,
  type DateScope,
  type SelectableDay,
  type SelectablePeriod,
} from "@/services";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

type ExportState = "choose" | "review" | "loading" | "success" | "error";
type ExportMode = "all" | "period";

type ExportResultMeta = {
  fileUri?: string;
};

export default function SettingsExportScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [state, setState] = useState<ExportState>("choose");
  const [mode, setMode] = useState<ExportMode>("all");
  const [periodSelectorVisible, setPeriodSelectorVisible] = useState(false);
  const [periodSelectorTab, setPeriodSelectorTab] =
    useState<ExportPeriodSelectorTab>("day");
  const [scope, setScope] = useState<DateScope>(ALL_DATE_SCOPE);
  const [preview, setPreview] = useState<ArchiveExportPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMeta, setResultMeta] = useState<ExportResultMeta | null>(null);

  const [days, setDays] = useState<SelectableDay[]>([]);
  const [dayLoading, setDayLoading] = useState(false);
  const [dayError, setDayError] = useState<string | null>(null);

  const [weeks, setWeeks] = useState<SelectablePeriod[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);
  const [weekError, setWeekError] = useState<string | null>(null);

  const [months, setMonths] = useState<SelectablePeriod[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthError, setMonthError] = useState<string | null>(null);

  async function openNativeShare(fileUri?: string): Promise<void> {
    if (!fileUri) {
      return;
    }

    await Share.share({
      title: "Mijn archief",
      message: "Je archief staat klaar om te delen of openen.",
      url: fileUri,
    });
  }

  function applyScope(nextScope: DateScope) {
    setScope(nextScope);
    setPreview(null);
    setErrorMessage(null);
    setState("choose");
  }

  async function ensureDaysLoaded() {
    if (dayLoading || days.length > 0) {
      return;
    }
    setDayLoading(true);
    setDayError(null);
    try {
      const result = await listSelectableDays();
      setDays(result);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setDayError(parsed.message);
    } finally {
      setDayLoading(false);
    }
  }

  async function ensureWeeksLoaded() {
    if (weekLoading || weeks.length > 0) {
      return;
    }
    setWeekLoading(true);
    setWeekError(null);
    try {
      const result = await listSelectableWeeks();
      setWeeks(result);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setWeekError(parsed.message);
    } finally {
      setWeekLoading(false);
    }
  }

  async function ensureMonthsLoaded() {
    if (monthLoading || months.length > 0) {
      return;
    }
    setMonthLoading(true);
    setMonthError(null);
    try {
      const result = await listSelectableMonths();
      setMonths(result);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setMonthError(parsed.message);
    } finally {
      setMonthLoading(false);
    }
  }

  async function openPeriodSelector(initialTab: ExportPeriodSelectorTab = "day") {
    setPeriodSelectorTab(initialTab);
    if (initialTab === "day") {
      await ensureDaysLoaded();
    } else if (initialTab === "week") {
      await ensureWeeksLoaded();
    } else {
      await ensureMonthsLoaded();
    }
    setPeriodSelectorVisible(true);
  }

  function handlePeriodTabChange(nextTab: ExportPeriodSelectorTab) {
    setPeriodSelectorTab(nextTab);
    if (nextTab === "day") {
      void ensureDaysLoaded();
      return;
    }
    if (nextTab === "week") {
      void ensureWeeksLoaded();
      return;
    }
    void ensureMonthsLoaded();
  }

  async function handleSelectMode(nextMode: ExportMode) {
    setMode(nextMode);
    if (nextMode === "all") {
      applyScope(ALL_DATE_SCOPE);
      setPeriodSelectorVisible(false);
      return;
    }
    await ensureDaysLoaded();
    setPeriodSelectorTab("day");
    setPeriodSelectorVisible(true);
  }

  async function handlePrepareReview() {
    setPreviewLoading(true);
    setErrorMessage(null);
    setState("review");
    try {
      const nextPreview = await previewArchiveScope(scope);
      setPreview(nextPreview);
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setErrorMessage(parsed.message);
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleDownload() {
    if (state === "loading") {
      return;
    }

    setState("loading");
    setErrorMessage(null);
    setResultMeta(null);

    try {
      const result = await downloadUserArchive(scope);
      if (result.status === "empty") {
        setState("review");
        setPreview({
          scope,
          hasContent: false,
          isSparse: false,
          days: 0,
          entries: 0,
          weekReflections: 0,
          monthReflections: 0,
        });
        setErrorMessage("In deze selectie is nog niets om te bewaren.");
        return;
      }

      if (Platform.OS !== "web") {
        await openNativeShare(result.fileUri);
      }

      setResultMeta({ fileUri: result.fileUri });
      setState("success");
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setErrorMessage(parsed.message);
      setState("error");
    }
  }

  const scopeDescription = describeDateScope(scope);

  return (
    <>
      <ScreenContainer
        scrollable
        backgroundTone="flat"
        contentContainerStyle={styles.scrollContent}
      >
        <SettingsScreenHeader
          title="Archief downloaden"
          subtitle="Kies wat je wilt bewaren."
          onBack={() => router.back()}
          onMenu={() => setMenuVisible(true)}
        />

        {state === "choose" ? (
          <ThemedView style={styles.stack}>
            <SurfaceSection title="Wat wil je bewaren?">
              <SettingsStateBody>
                <SettingsStateIcon
                  icon="download"
                  iconColor={palette.primary}
                  backgroundColor={palette.surfaceLow}
                />

                <ThemedView style={styles.selectorWrap}>
                  <RadioChoiceGroup
                    options={[
                      {
                        key: "all",
                        label: "Alles bewaren",
                        description: "Bewaar alles wat je tot nu toe hebt vastgelegd.",
                        active: mode === "all",
                        onPress: () => void handleSelectMode("all"),
                      },
                      {
                        key: "period",
                        label: "Een periode kiezen",
                        description: "Kies een dag, week of maand om te bewaren.",
                        active: mode === "period",
                        onPress: () => void handleSelectMode("period"),
                      },
                    ]}
                  />

                  {mode === "period" ? (
                    <SecondaryButton
                      label="Periode aanpassen"
                      onPress={() => void openPeriodSelector(periodSelectorTab)}
                    />
                  ) : null}

                </ThemedView>
              </SettingsStateBody>
            </SurfaceSection>

            <SurfaceSection title="Gekozen selectie" subtitle={scopeDescription.title}>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {scopeDescription.subtitle}
              </ThemedText>
              <PrimaryButton label="Verder" onPress={() => void handlePrepareReview()} />
            </SurfaceSection>

            <NoticeCard body="Je bewaart je selectie als een leesbaar bestand." />
          </ThemedView>
        ) : null}

        {state === "review" ? (
          <SurfaceSection title="Controleer je selectie" subtitle={scopeDescription.title}>
            <SettingsStateBody>
              <SettingsStateIcon
                icon="fact-check"
                iconColor={palette.primary}
                backgroundColor={palette.surfaceLow}
              />

              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {scopeDescription.subtitle}
              </ThemedText>

              {previewLoading ? (
                <StateBlock tone="loading" message="Selectie laden..." detail="Een moment geduld." />
              ) : null}

              {!previewLoading && errorMessage ? (
                <StateBlock
                  tone="error"
                  message="Selectie laden lukt nu niet."
                  detail={errorMessage}
                />
              ) : null}

              {!previewLoading && !errorMessage && preview && !preview.hasContent ? (
                <StateBlock
                  tone="empty"
                  message="In deze selectie is nog niets om te bewaren."
                  detail="Kies een andere selectie of ga terug."
                />
              ) : null}

              {!previewLoading && !errorMessage && preview?.hasContent ? (
                <ThemedView style={styles.countsWrap}>
                  <ThemedText type="meta">Inhoud</ThemedText>
                  <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                    Dagen: {preview.days}
                  </ThemedText>
                  <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                    Entries: {preview.entries}
                  </ThemedText>
                  <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                    Weekreflecties: {preview.weekReflections}
                  </ThemedText>
                  <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                    Maandreflecties: {preview.monthReflections}
                  </ThemedText>
                </ThemedView>
              ) : null}

              {!previewLoading && !errorMessage && preview?.hasContent && preview.isSparse ? (
                <StateBlock
                  tone="info"
                  message="In deze selectie zit weinig inhoud."
                  detail="Je kunt doorgaan of iets anders kiezen."
                />
              ) : null}

              <ThemedView style={styles.actionsWrap}>
                <PrimaryButton
                  label="Download selectie"
                  onPress={() => void handleDownload()}
                  disabled={!preview?.hasContent || previewLoading}
                />
                <SecondaryButton
                  label="Selectie aanpassen"
                  icon="arrow-back"
                  size="cta"
                  onPress={() => {
                    setErrorMessage(null);
                    setState("choose");
                  }}
                />
              </ThemedView>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {state === "loading" ? (
          <SurfaceSection title="Downloaden" subtitle="Bestand wordt voorbereid.">
            <SettingsStateBody>
              <SettingsStateIcon
                icon="hourglass-empty"
                iconColor={palette.primary}
                backgroundColor={palette.surfaceLow}
              />
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                Een moment geduld.
              </ThemedText>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {state === "success" ? (
          <SurfaceSection title="Download klaar" subtitle="Je selectie staat voor je klaar.">
            <SettingsStateBody>
              <SettingsStateIcon
                icon="check-circle-outline"
                iconColor={palette.primary}
                backgroundColor={palette.surfaceLow}
              />
              <ThemedView style={styles.actionsWrap}>
                <PrimaryButton
                  label="Download selectie"
                  onPress={() => void handleDownload()}
                />
                {Platform.OS !== "web" && resultMeta?.fileUri ? (
                  <SecondaryButton
                    label="Open delen"
                    size="cta"
                    onPress={() => void openNativeShare(resultMeta.fileUri)}
                  />
                ) : null}
                <SecondaryButton
                  label="Andere selectie"
                  icon="arrow-back"
                  size="cta"
                  onPress={() => {
                    setState("choose");
                    setErrorMessage(null);
                  }}
                />
              </ThemedView>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        {state === "error" ? (
          <SurfaceSection title="Downloaden" subtitle="Downloaden lukt nu niet.">
            <SettingsStateBody>
              <SettingsStateIcon
                icon="warning-amber"
                iconColor={palette.destructiveSoftText}
                backgroundColor={palette.destructiveSoftBackground}
              />
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {errorMessage ?? "Probeer het zo opnieuw."}
              </ThemedText>
              <ThemedView style={styles.actionsWrap}>
                <PrimaryButton label="Probeer opnieuw" onPress={() => void handleDownload()} />
                <SecondaryButton
                  label="Selectie aanpassen"
                  icon="arrow-back"
                  size="cta"
                  onPress={() => {
                    setState("choose");
                    setErrorMessage(null);
                  }}
                />
              </ThemedView>
            </SettingsStateBody>
          </SurfaceSection>
        ) : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </ScreenContainer>

      <ExportPeriodSelectorModal
        visible={periodSelectorVisible}
        activeTab={periodSelectorTab}
        onClose={() => setPeriodSelectorVisible(false)}
        onChangeTab={handlePeriodTabChange}
        dayLoading={dayLoading}
        dayError={dayError}
        days={days}
        weekLoading={weekLoading}
        weekError={weekError}
        weeks={weeks}
        monthLoading={monthLoading}
        monthError={monthError}
        months={months}
        onSelectDay={(day) => {
          applyScope({ kind: "day", date: day.date });
          setMode("period");
          setPeriodSelectorVisible(false);
        }}
        onSelectWeek={(period) => {
          applyScope({
            kind: "week",
            startDate: period.startDate,
            endDate: period.endDate,
            label: period.label,
          });
          setMode("period");
          setPeriodSelectorVisible(false);
        }}
        onSelectMonth={(period) => {
          applyScope({
            kind: "month",
            startDate: period.startDate,
            endDate: period.endDate,
            label: period.label,
          });
          setMode("period");
          setPeriodSelectorVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  stack: {
    gap: spacing.xl,
  },
  selectorWrap: {
    gap: spacing.md,
    width: "100%",
  },
  countsWrap: {
    width: "100%",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
  actionsWrap: {
    width: "100%",
    gap: spacing.sm,
  },
});
