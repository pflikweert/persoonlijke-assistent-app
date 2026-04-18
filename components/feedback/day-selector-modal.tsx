import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { SelectableDay } from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

import { SelectorModalShell } from "./selector-modal-shell";

type DaySelectorModalProps = {
  visible: boolean;
  title: string;
  titlePrefix?: string;
  subtitle: string;
  loading?: boolean;
  errorMessage?: string | null;
  days: SelectableDay[];
  selectedDate?: string | null;
  onClose: () => void;
  onSelect: (day: SelectableDay) => void;
};

export function DaySelectorModal({
  visible,
  title,
  titlePrefix,
  subtitle,
  loading = false,
  errorMessage,
  days,
  selectedDate,
  onClose,
  onSelect,
}: DaySelectorModalProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <SelectorModalShell
      visible={visible}
      title={title}
      titlePrefix={titlePrefix}
      subtitle={subtitle}
      onClose={onClose}
      scrollableBody={!loading && !errorMessage && days.length > 0}
    >
      {loading ? (
        <StateBlock
          tone="loading"
          message="Dagen laden..."
          detail="Een moment geduld."
        />
      ) : null}

      {!loading && errorMessage ? (
        <StateBlock
          tone="error"
          message="Dagen laden lukt nu niet."
          detail={errorMessage}
        />
      ) : null}

      {!loading && !errorMessage && days.length === 0 ? (
        <StateBlock
          tone="empty"
          message="Je hebt nog geen dagen om te kiezen."
          detail="Leg eerst iets vast, dan verschijnt het hier."
        />
      ) : null}

      {!loading && !errorMessage && days.length > 0 ? (
        <>
          {days.map((day) => (
            <Pressable
              key={day.date}
              onPress={() => onSelect(day)}
              style={[
                styles.row,
                {
                  backgroundColor: palette.surfaceLowest,
                  borderColor:
                    selectedDate && day.date === selectedDate
                      ? `${palette.primary}99`
                      : "transparent",
                  borderWidth:
                    selectedDate && day.date === selectedDate
                      ? StyleSheet.hairlineWidth
                      : 0,
                },
              ]}
            >
              <ThemedText type="defaultSemiBold">{day.label}</ThemedText>
              <ThemedText
                type="bodySecondary"
                numberOfLines={2}
                style={{ color: palette.muted }}
              >
                {day.snippet}
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
