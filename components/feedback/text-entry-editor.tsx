import { TextInput, StyleSheet, type StyleProp, type TextStyle } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing, typography } from "@/theme";

type TextEntryEditorVariant = "capture" | "edit";

type TextEntryEditorProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  editable: boolean;
  autoFocus?: boolean;
  variant?: TextEntryEditorVariant;
  style?: StyleProp<TextStyle>;
};

export function TextEntryEditor({
  value,
  onChangeText,
  placeholder,
  editable,
  autoFocus = false,
  variant = "edit",
  style,
}: TextEntryEditorProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <TextInput
      testID="pa-text-entry-editor"
      multiline
      autoFocus={autoFocus}
      editable={editable}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.mutedSoft}
      selectionColor={palette.primaryStrong}
      cursorColor={palette.primaryStrong}
      keyboardAppearance={scheme === "dark" ? "dark" : "light"}
      textAlignVertical="top"
      style={[
        styles.base,
        variant === "capture" ? styles.capture : styles.edit,
        {
          color: palette.text,
          backgroundColor: "transparent",
          borderColor: variant === "capture" ? "transparent" : palette.separator,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    width: "100%",
    fontFamily: typography.families.sans,
    textAlign: "left",
  },
  capture: {
    flex: 1,
    marginTop: spacing.xl,
    fontSize: typography.roles.sectionTitle.size,
    lineHeight: typography.roles.sectionTitle.lineHeight,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 0,
    borderWidth: 0,
    borderRadius: 0,
  },
  edit: {
    flex: 1,
    minHeight: 320,
    fontSize: 28,
    lineHeight: 38,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
});
