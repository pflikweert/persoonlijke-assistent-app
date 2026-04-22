import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

import { SelectorModalShell } from "./selector-modal-shell";

export type SelectableListModalItem = {
  key: string;
  title: string;
  subtitle?: string;
  selected?: boolean;
};

export type SelectableListModalProps = {
  visible: boolean;
  title: string;
  titlePrefix?: string;
  subtitle?: string;
  loading?: boolean;
  loadingMessage?: string;
  loadingDetail?: string;
  errorMessage?: string | null;
  errorDetail?: string;
  emptyMessage: string;
  emptyDetail: string;
  items: SelectableListModalItem[];
  onClose: () => void;
  onSelect: (itemKey: string) => void;
};

export function SelectableListModal({
  visible,
  title,
  titlePrefix,
  subtitle,
  loading = false,
  loadingMessage = "Opties laden...",
  loadingDetail = "Een moment geduld.",
  errorMessage,
  errorDetail,
  emptyMessage,
  emptyDetail,
  items,
  onClose,
  onSelect,
}: SelectableListModalProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <SelectorModalShell
      visible={visible}
      title={title}
      titlePrefix={titlePrefix}
      subtitle={subtitle}
      onClose={onClose}
      scrollableBody={!loading && !errorMessage && items.length > 0}
    >
      {loading ? (
        <StateBlock tone="loading" message={loadingMessage} detail={loadingDetail} />
      ) : null}

      {!loading && errorMessage ? (
        <StateBlock
          tone="error"
          message={errorMessage}
          detail={errorDetail}
        />
      ) : null}

      {!loading && !errorMessage && items.length === 0 ? (
        <StateBlock tone="empty" message={emptyMessage} detail={emptyDetail} />
      ) : null}

      {!loading && !errorMessage && items.length > 0 ? (
        <>
          {items.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => onSelect(item.key)}
              style={[
                styles.row,
                {
                  backgroundColor: palette.surfaceLowest,
                  borderColor: item.selected ? `${palette.primary}99` : "transparent",
                  borderWidth: item.selected ? StyleSheet.hairlineWidth : 0,
                },
              ]}
            >
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              {item.subtitle ? (
                <ThemedText
                  type="bodySecondary"
                  numberOfLines={2}
                  style={{ color: palette.muted }}
                >
                  {item.subtitle}
                </ThemedText>
              ) : null}
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
