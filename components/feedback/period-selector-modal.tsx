import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { SelectablePeriod } from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

import { SelectorModalShell } from "./selector-modal-shell";

type PeriodSelectorModalProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  loading?: boolean;
  errorMessage?: string | null;
  periods: SelectablePeriod[];
  emptyMessage: string;
  emptyDetail: string;
  onClose: () => void;
  onSelect: (period: SelectablePeriod) => void;
};

export function PeriodSelectorModal({
  visible,
  title,
  subtitle,
  loading = false,
  errorMessage,
  periods,
  emptyMessage,
  emptyDetail,
  onClose,
  onSelect,
}: PeriodSelectorModalProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <SelectorModalShell
      visible={visible}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      scrollableBody={!loading && !errorMessage && periods.length > 0}
    >
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

      {!loading && !errorMessage && periods.length === 0 ? (
        <StateBlock tone="empty" message={emptyMessage} detail={emptyDetail} />
      ) : null}

      {!loading && !errorMessage && periods.length > 0 ? (
        <>
          {periods.map((period) => (
            <Pressable
              key={period.id}
              onPress={() => onSelect(period)}
              style={[
                styles.row,
                {
                  backgroundColor: palette.surfaceLowest,
                },
              ]}
            >
              <ThemedText type="defaultSemiBold">{period.label}</ThemedText>
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {period.subtitle}
              </ThemedText>
            </Pressable>
          ))}
        </>
      ) : null}
    </SelectorModalShell>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
});
