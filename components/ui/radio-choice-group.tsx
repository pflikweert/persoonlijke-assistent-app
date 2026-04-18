import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

export type RadioChoiceOption = {
  key: string;
  label: string;
  description?: string;
  active: boolean;
  onPress: () => void;
};

export function RadioChoiceGroup({
  options,
}: {
  options: RadioChoiceOption[];
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <View style={styles.group}>
      {options.map((option) => (
        <Pressable
          key={option.key}
          accessibilityRole="radio"
          accessibilityState={{ checked: option.active }}
          onPress={option.onPress}
          style={[
            styles.row,
            {
              backgroundColor: palette.surfaceLowest,
            },
            option.active
              ? {
                  borderColor: palette.primary,
                }
              : {
                  borderColor: palette.separator,
                },
          ]}
        >
          <View
            style={[
              styles.radioOuter,
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

          <View style={styles.copyWrap}>
            <ThemedText type="defaultSemiBold">{option.label}</ThemedText>
            {option.description ? (
              <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                {option.description}
              </ThemedText>
            ) : null}
          </View>
        </Pressable>
      ))}
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
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  copyWrap: {
    flex: 1,
    gap: spacing.xxs,
  },
});
