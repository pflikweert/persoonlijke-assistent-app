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
import { useColorScheme } from '@/hooks/use-color-scheme';
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
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  if (scrollable) {
    const flattenedContentStyle = StyleSheet.flatten([styles.scrollContent, contentContainerStyle]);
    const nextPaddingBottom =
      (typeof flattenedContentStyle?.paddingBottom === 'number' ? flattenedContentStyle.paddingBottom : 0) +
      styles.scrollContent.paddingBottom;

    return (
      <ThemedView style={[styles.screenContainer, style, { backgroundColor: palette.background }]}>
        <ScrollView
          contentContainerStyle={[
            flattenedContentStyle,
            {
              paddingBottom: nextPaddingBottom,
            },
          ]}>
          {children}
        </ScrollView>
      </ThemedView>
    );
  }

  return <ThemedView style={[styles.screenContainer, style, { backgroundColor: palette.background }]}>{children}</ThemedView>;
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
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      lightColor={colorTokens.light.surface}
      darkColor={colorTokens.dark.surface}
      style={[styles.section, { borderColor: palette.separator }, style]}>
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
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryButton, { backgroundColor: palette.primaryStrong }, disabled && styles.buttonDisabled]}>
      <ThemedText type="ctaLabel" lightColor={palette.primaryOn} darkColor={palette.primaryOn}>
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
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.secondaryButton,
        { borderColor: palette.separator, backgroundColor: palette.surfaceLowest },
        disabled && styles.buttonDisabled,
      ]}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
    </Pressable>
  );
}

type BaseInputProps = TextInputProps & { style?: TextInputProps['style'] };

export function InputField({ style, ...props }: BaseInputProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <TextInput
      placeholderTextColor={palette.mutedSoft}
      style={[
        styles.inputBase,
        styles.input,
        { color: palette.text, backgroundColor: palette.surfaceLowest, borderColor: palette.separator },
        style,
      ]}
      {...props}
    />
  );
}

export function TextAreaField({ style, ...props }: BaseInputProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <TextInput
      multiline
      placeholderTextColor={palette.mutedSoft}
      textAlignVertical="top"
      style={[
        styles.inputBase,
        styles.textArea,
        { color: palette.text, backgroundColor: palette.surfaceLowest, borderColor: palette.separator },
        style,
      ]}
      {...props}
    />
  );
}

export function MetaText({ children }: { children: ReactNode }) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <ThemedText type="meta" lightColor={palette.mutedSoft} darkColor={palette.mutedSoft}>
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
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLow}
      darkColor={colorTokens.dark.surfaceLow}
      style={[styles.stateBlock, { borderColor: palette.separator }]}>
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
    paddingBottom: spacing.xxxl + spacing.xxl + spacing.xxl,
  },
  section: {
    borderRadius: radius.lg,
    borderWidth: borders.subtle,
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
    paddingHorizontal: spacing.xl,
    ...shadows.cta,
  },
  secondaryButton: {
    minHeight: sizing.ctaCompactHeight,
    borderRadius: radius.pill,
    borderWidth: borders.subtle,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  inputBase: {
    fontFamily: typography.families.sans,
    fontSize: typography.roles.body.size,
    lineHeight: typography.roles.body.lineHeight,
    borderWidth: borders.subtle,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.inline,
  },
});
