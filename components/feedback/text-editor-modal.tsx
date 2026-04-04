import { Modal, Pressable, StyleSheet, TextInput } from 'react-native';

import { PrimaryButton } from '@/components/ui/screen-primitives';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colorTokens, radius, spacing, typography } from '@/theme';

type TextEditorModalProps = {
  visible: boolean;
  title: string;
  value: string;
  placeholder: string;
  submitLabel: string;
  processingLabel: string;
  processing?: boolean;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function TextEditorModal({
  visible,
  title,
  value,
  placeholder,
  submitLabel,
  processingLabel,
  processing = false,
  onChange,
  onCancel,
  onSubmit,
}: TextEditorModalProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={() => !processing && onCancel()}>
      <ThemedView lightColor={colorTokens.light.background} darkColor={colorTokens.dark.background} style={styles.screen}>
        <ThemedView style={styles.topBar}>
          <Pressable onPress={onCancel} disabled={processing} style={styles.topAction}>
            <ThemedText type="bodySecondary" style={{ color: palette.mutedSoft }}>
              Annuleer
            </ThemedText>
          </Pressable>
          <ThemedText type="sectionTitle">{title}</ThemedText>
          <ThemedView style={styles.topSpacer} />
        </ThemedView>

        <TextInput
          multiline
          autoFocus
          value={value}
          onChangeText={onChange}
          editable={!processing}
          placeholder={placeholder}
          placeholderTextColor={palette.mutedSoft}
          textAlignVertical="top"
          style={[
            styles.input,
            {
              color: palette.text,
              borderColor: scheme === 'dark' ? `${palette.primaryStrong}66` : `${palette.primaryStrong}7A`,
              backgroundColor: scheme === 'dark' ? 'transparent' : 'rgba(255,255,255,0.14)',
            },
          ]}
        />

        <ThemedView style={styles.bottomZone}>
          <PrimaryButton
            label={processing ? processingLabel : submitLabel}
            onPress={onSubmit}
            disabled={processing || !value.trim()}
          />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.page,
    paddingBottom: spacing.page,
    gap: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    minHeight: 40,
  },
  topAction: {
    minWidth: 84,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  topSpacer: {
    minWidth: 84,
  },
  input: {
    flex: 1,
    minHeight: 320,
    fontFamily: typography.families.sans,
    fontSize: 28,
    lineHeight: 38,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    textAlign: 'left',
  },
  bottomZone: {
    width: '100%',
    paddingBottom: spacing.sm,
  },
});
