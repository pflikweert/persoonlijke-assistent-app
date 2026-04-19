import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export type ChoiceInputOption = {
  key: string;
  label: string;
  description?: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export type ChoiceInputType = "radio" | "checkbox";

export function ChoiceInputGroup({
  options,
  inputType = "radio",
}: {
  options: ChoiceInputOption[];
  inputType?: ChoiceInputType;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <View style={styles.group}>
      {options.map((option) => {
        const compact = !option.description;
        const isCheckbox = inputType === "checkbox";
        const hasDescription = Boolean(option.description);

        return (
          <Pressable
            key={option.key}
            accessibilityRole={inputType}
            accessibilityState={{ checked: option.active, disabled: option.disabled }}
            onPress={option.onPress}
            disabled={option.disabled}
            style={[
              styles.row,
              compact ? styles.rowCompact : null,
              isCheckbox || hasDescription
                ? {
                    backgroundColor: option.active ? palette.surfaceLowest : palette.surfaceLow,
                  }
                : {
                    backgroundColor: palette.surfaceLowest,
                  },
              isCheckbox || hasDescription
                ? styles.checkboxRow
                : option.active
                  ? { borderColor: palette.primary }
                  : { borderColor: palette.separator },
              option.disabled ? styles.rowDisabled : null,
            ]}
          >
            {isCheckbox ? (
              <View
                style={[
                  styles.checkboxOuter,
                  compact ? styles.indicatorCompact : null,
                  {
                    borderColor: option.active ? palette.primary : palette.mutedSoft,
                    backgroundColor: option.active ? palette.surfaceLow : "transparent",
                  },
                ]}
              >
                {option.active ? (
                  <MaterialIcons name="check" size={14} color={palette.primary} />
                ) : null}
              </View>
            ) : (
              <View
                style={[
                  styles.radioOuter,
                  compact ? styles.indicatorCompact : null,
                  {
                    borderColor: option.active ? palette.primary : palette.mutedSoft,
                  },
                ]}
              >
                {option.active ? (
                  <View
                    style={[
                      styles.radioInner,
                      {
                        backgroundColor: palette.primary,
                      },
                    ]}
                  />
                ) : null}
              </View>
            )}

            <View style={styles.copyWrap}>
              <ThemedText type="defaultSemiBold">{option.label}</ThemedText>
              {option.description ? (
                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  {option.description}
                </ThemedText>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: "100%",
    gap: spacing.sm,
  },
  row: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: 62,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxRow: {
    borderWidth: 0,
  },
  rowCompact: {
    minHeight: 48,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  rowDisabled: {
    opacity: 0.56,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  indicatorCompact: {
    marginTop: 0,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
  },
  checkboxOuter: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  copyWrap: {
    flex: 1,
    gap: spacing.xxs,
  },
});
