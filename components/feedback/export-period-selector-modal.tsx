import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PeriodSegmentedControl } from "@/components/ui/period-segmented-control";
import { StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { SelectableDay, SelectablePeriod } from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

import { SelectorModalShell } from "./selector-modal-shell";

export type ExportPeriodSelectorTab = "day" | "week" | "month";

type ExportPeriodSelectorModalProps = {
  visible: boolean;
  activeTab: ExportPeriodSelectorTab;
  onClose: () => void;
  onChangeTab: (tab: ExportPeriodSelectorTab) => void;
  dayLoading: boolean;
  dayError: string | null;
  days: SelectableDay[];
  weekLoading: boolean;
  weekError: string | null;
  weeks: SelectablePeriod[];
  monthLoading: boolean;
  monthError: string | null;
  months: SelectablePeriod[];
  onSelectDay: (day: SelectableDay) => void;
  onSelectWeek: (period: SelectablePeriod) => void;
  onSelectMonth: (period: SelectablePeriod) => void;
};

export function ExportPeriodSelectorModal({
  visible,
  activeTab,
  onClose,
  onChangeTab,
  dayLoading,
  dayError,
  days,
  weekLoading,
  weekError,
  weeks,
  monthLoading,
  monthError,
  months,
  onSelectDay,
  onSelectWeek,
  onSelectMonth,
}: ExportPeriodSelectorModalProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const segmentedOptions = [
    {
      key: "day",
      label: "Dag",
      active: activeTab === "day",
      onPress: () => onChangeTab("day"),
    },
    {
      key: "week",
      label: "Week",
      active: activeTab === "week",
      onPress: () => onChangeTab("week"),
    },
    {
      key: "month",
      label: "Maand",
      active: activeTab === "month",
      onPress: () => onChangeTab("month"),
    },
  ];

  const loading =
    activeTab === "day"
      ? dayLoading
      : activeTab === "week"
        ? weekLoading
        : monthLoading;
  const errorMessage =
    activeTab === "day"
      ? dayError
      : activeTab === "week"
        ? weekError
        : monthError;
  const hasRows =
    activeTab === "day"
      ? days.length > 0
      : activeTab === "week"
        ? weeks.length > 0
        : months.length > 0;
  const headerTitle =
    activeTab === "day"
      ? "een dag"
      : activeTab === "week"
        ? "een week"
        : "een maand";

  return (
    <SelectorModalShell
      visible={visible}
      title={headerTitle}
      subtitle="Selecteer dag, week of maand om te bewaren."
      onClose={onClose}
      scrollableBody={!loading && !errorMessage && hasRows}
      bodyContentContainerStyle={styles.bodyContent}
    >
      <PeriodSegmentedControl options={segmentedOptions} />

      {loading ? (
        <StateBlock tone="loading" message="Opties laden..." detail="Een moment geduld." />
      ) : null}

      {!loading && errorMessage ? (
        <StateBlock
          tone="error"
          message="Opties laden lukt nu niet."
          detail={errorMessage}
        />
      ) : null}

      {!loading && !errorMessage && !hasRows ? (
        <StateBlock
          tone="empty"
          message="Nog geen selectie beschikbaar."
          detail="Leg eerst iets vast, dan verschijnen je opties hier."
        />
      ) : null}

      {!loading && !errorMessage && activeTab === "day"
        ? days.map((day) => (
            <Pressable
              key={day.date}
              onPress={() => onSelectDay(day)}
              style={[styles.row, { backgroundColor: palette.surfaceLowest }]}
            >
              <ThemedText type="defaultSemiBold">{day.label}</ThemedText>
              <ThemedText type="bodySecondary" numberOfLines={2} style={{ color: palette.muted }}>
                {day.snippet}
              </ThemedText>
            </Pressable>
          ))
        : null}

      {!loading && !errorMessage && activeTab === "week"
        ? weeks.map((period) => (
            <Pressable
              key={period.id}
              onPress={() => onSelectWeek(period)}
              style={[styles.row, { backgroundColor: palette.surfaceLowest }]}
            >
              <ThemedText type="defaultSemiBold">{period.label}</ThemedText>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {period.subtitle}
              </ThemedText>
            </Pressable>
          ))
        : null}

      {!loading && !errorMessage && activeTab === "month"
        ? months.map((period) => (
            <Pressable
              key={period.id}
              onPress={() => onSelectMonth(period)}
              style={[styles.row, { backgroundColor: palette.surfaceLowest }]}
            >
              <ThemedText type="defaultSemiBold">{period.label}</ThemedText>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {period.subtitle}
              </ThemedText>
            </Pressable>
          ))
        : null}
    </SelectorModalShell>
  );
}

const styles = StyleSheet.create({
  bodyContent: {
    paddingBottom: spacing.xxs,
  },
  row: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
});
