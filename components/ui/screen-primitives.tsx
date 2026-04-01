import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  type ScrollViewProps,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { borders, colorTokens, radius, shadows, sizing, spacing, typography } from '@/theme';

type Tone = 'loading' | 'empty' | 'error' | 'success' | 'info';

export function ScreenContainer({
  children,
  style,
  scrollable = false,
  contentContainerStyle,
}: {
  children: ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}) {
  if (scrollable) {
    return (
      <ThemedView style={[styles.screenContainer, style]}>
        <ScrollView contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
          {children}
        </ScrollView>
      </ThemedView>
    );
  }

  return <ThemedView style={[styles.screenContainer, style]}>{children}</ThemedView>;
}

function toneLabel(tone: Tone): string {
  if (tone === 'loading') {
    return 'Laden';
  }
  if (tone === 'empty') {
    return 'Nog leeg';
  }
  if (tone === 'error') {
    return 'Er ging iets mis';
  }
  if (tone === 'success') {
    return 'Gelukt';
  }

  return 'Context';
}

export function SurfaceSection({
  title,
  subtitle,
  children,
  footer,
  style,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <ThemedView lightColor={colorTokens.light.surface} darkColor={colorTokens.dark.surface} style={[styles.section, style]}>
      {title ? <ThemedText type="sectionTitle">{title}</ThemedText> : null}
      {subtitle ? <MetaText>{subtitle}</MetaText> : null}
      <ThemedView style={styles.sectionBody}>{children}</ThemedView>
      {footer ? <ThemedView style={styles.sectionFooter}>{footer}</ThemedView> : null}
    </ThemedView>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.primaryButton, disabled && styles.buttonDisabled]}>
      <ThemedText type="ctaLabel" lightColor={colorTokens.light.primaryOn} darkColor={colorTokens.dark.primaryOn}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.secondaryButton, disabled && styles.buttonDisabled]}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
    </Pressable>
  );
}

type BaseInputProps = TextInputProps & { style?: TextInputProps['style'] };

export function InputField({ style, ...props }: BaseInputProps) {
  return (
    <TextInput
      placeholderTextColor={colorTokens.light.mutedSoft}
      style={[styles.inputBase, styles.input, style]}
      {...props}
    />
  );
}

export function TextAreaField({ style, ...props }: BaseInputProps) {
  return (
    <TextInput
      multiline
      placeholderTextColor={colorTokens.light.mutedSoft}
      textAlignVertical="top"
      style={[styles.inputBase, styles.textArea, style]}
      {...props}
    />
  );
}

export function MetaText({ children }: { children: ReactNode }) {
  return (
    <ThemedText type="meta" lightColor={colorTokens.light.mutedSoft} darkColor={colorTokens.dark.mutedSoft}>
      {children}
    </ThemedText>
  );
}

export function StateBlock({
  tone = 'info',
  message,
  detail,
  meta,
}: {
  tone?: Tone;
  message: string;
  detail?: string | null;
  meta?: string | null;
}) {
  return (
    <ThemedView lightColor={colorTokens.light.surfaceLow} darkColor={colorTokens.dark.surfaceLow} style={styles.stateBlock}>
      <MetaText>{toneLabel(tone)}</MetaText>
      <ThemedText type="defaultSemiBold">{message}</ThemedText>
      {detail ? <ThemedText type="bodySecondary">{detail}</ThemedText> : null}
      {meta ? <ThemedText type="caption">{meta}</ThemedText> : null}
    </ThemedView>
  );
}

export function ContentSection({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <SurfaceSection title={title} style={style}>
      {children}
    </SurfaceSection>
  );
}

export function StateNotice({
  tone = 'info',
  message,
  detail,
  meta,
}: {
  tone?: Tone | 'neutral';
  message: string;
  detail?: string | null;
  meta?: string | null;
}) {
  const nextTone = tone === 'neutral' ? 'info' : tone;
  return <StateBlock tone={nextTone} message={message} detail={detail} meta={meta} />;
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.page,
    gap: spacing.section,
  },
  scrollContent: {
    gap: spacing.section,
    paddingBottom: spacing.xxl,
  },
  section: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.cluster,
    ...shadows.surface,
  },
  sectionBody: {
    gap: spacing.cluster,
  },
  sectionFooter: {
    marginTop: spacing.xs,
  },
  primaryButton: {
    minHeight: sizing.ctaHeight,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorTokens.light.primaryStrong,
    paddingHorizontal: spacing.xl,
    ...shadows.cta,
  },
  secondaryButton: {
    minHeight: sizing.ctaCompactHeight,
    borderRadius: radius.pill,
    borderWidth: borders.subtle,
    borderColor: colorTokens.light.separator,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorTokens.light.surfaceLowest,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  inputBase: {
    fontFamily: typography.families.sans,
    fontSize: typography.roles.body.size,
    lineHeight: typography.roles.body.lineHeight,
    color: colorTokens.light.text,
    backgroundColor: colorTokens.light.surfaceLowest,
    borderWidth: borders.subtle,
    borderColor: colorTokens.light.separator,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  input: {
    minHeight: sizing.inputMinHeight,
  },
  textArea: {
    minHeight: sizing.textAreaMinHeight,
  },
  stateBlock: {
    borderRadius: radius.md,
    borderWidth: borders.subtle,
    borderColor: colorTokens.light.separator,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.inline,
  },
});
