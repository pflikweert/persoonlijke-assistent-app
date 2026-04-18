import type { ReactNode, RefObject } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  type StyleProp,
  type ScrollViewProps,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  AppBackground,
  type AppBackgroundTone,
} from "@/components/ui/app-background";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  borders,
  colorTokens,
  radius,
  shadows,
  sizing,
  spacing,
  typography,
} from "@/theme";

type Tone = "loading" | "empty" | "error" | "success" | "info";

type StateTone = Tone | "warning";

export function ScreenContainer({
  children,
  style,
  className,
  scrollable = false,
  fixedHeader,
  fixedFooter,
  contentContainerStyle,
  scrollRef,
  stickyHeaderIndices,
  backgroundTone = "subtle",
}: {
  children: ReactNode;
  style?: ViewStyle;
  className?: string;
  scrollable?: boolean;
  fixedHeader?: ReactNode;
  fixedFooter?: ReactNode;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  scrollRef?: RefObject<ScrollView | null>;
  stickyHeaderIndices?: number[];
  backgroundTone?: AppBackgroundTone;
}) {
  if (scrollable) {
    const flattenedContentStyle = StyleSheet.flatten([
      styles.scrollContent,
      contentContainerStyle,
    ]);
    const currentPaddingTop =
      typeof flattenedContentStyle?.paddingTop === "number"
        ? flattenedContentStyle.paddingTop
        : styles.scrollContent.paddingTop;
    const nextPaddingTop = fixedHeader
      ? Math.max(currentPaddingTop, spacing.page)
      : currentPaddingTop;
    const nextPaddingBottom =
      (typeof flattenedContentStyle?.paddingBottom === "number"
        ? flattenedContentStyle.paddingBottom
        : 0) + styles.scrollContent.paddingBottom;

    return (
      <ThemedView
        className={className}
        style={[styles.screenContainer, styles.scrollHost, style]}
      >
        <AppBackground tone={backgroundTone} />
        {fixedHeader}
        <ScrollView
          ref={scrollRef}
          stickyHeaderIndices={stickyHeaderIndices}
          contentContainerStyle={[
            flattenedContentStyle,
            {
              paddingTop: nextPaddingTop,
              paddingBottom: nextPaddingBottom,
            },
          ]}
        >
          {children}
        </ScrollView>
        {fixedFooter}
      </ThemedView>
    );
  }

  return (
    <ThemedView
      className={className}
      style={[styles.screenContainer, style]}
    >
      <AppBackground tone={backgroundTone} />
      {fixedHeader}
      {children}
      {fixedFooter}
    </ThemedView>
  );
}

function toneLabel(tone: StateTone): string | null {
  if (tone === "loading") {
    return "Laden";
  }
  if (tone === "empty") {
    return "Nog leeg";
  }
  if (tone === "warning") {
    return "Let op";
  }
  if (tone === "success") {
    return "Gelukt";
  }
  if (tone === "error") {
    return null;
  }
  if (tone === "info") {
    return "Info";
  }

  return null;
}

function alpha(hex: string, opacityHex: string): string {
  if (!hex.startsWith("#") || hex.length !== 7) {
    return hex;
  }

  return `${hex}${opacityHex}`;
}

function getStateToneColors(
  tone: StateTone,
  palette: (typeof colorTokens)["light"] | (typeof colorTokens)["dark"],
): {
  background: string;
  border: string;
  title: string;
  body: string;
  meta: string;
} {
  if (tone === "error") {
    return {
      background: palette.destructiveSoftBackground,
      border: palette.destructiveSoftBorder,
      title: palette.destructiveSoftText,
      body: palette.text,
      meta: palette.destructiveSoftText,
    };
  }

  if (tone === "warning") {
    return {
      background: alpha(palette.primaryStrong, "1C"),
      border: alpha(palette.primaryStrong, "52"),
      title: palette.primary,
      body: palette.text,
      meta: palette.muted,
    };
  }

  if (tone === "success") {
    return {
      background: alpha(palette.success, "1F"),
      border: alpha(palette.success, "52"),
      title: palette.success,
      body: palette.text,
      meta: palette.muted,
    };
  }

  if (tone === "loading") {
    return {
      background: alpha(palette.info, "1A"),
      border: alpha(palette.info, "42"),
      title: palette.info,
      body: palette.text,
      meta: palette.muted,
    };
  }

  return {
    background: palette.surfaceLow,
    border: palette.separator,
    title: palette.muted,
    body: palette.text,
    meta: palette.mutedSoft,
  };
}

function toneIconName(tone: StateTone): keyof typeof MaterialIcons.glyphMap {
  if (tone === "error") {
    return "error-outline";
  }
  if (tone === "warning") {
    return "warning-amber";
  }
  if (tone === "success") {
    return "check-circle-outline";
  }
  if (tone === "loading") {
    return "hourglass-empty";
  }
  if (tone === "empty") {
    return "inbox";
  }

  return "info-outline";
}

export function SurfaceSection({
  title,
  subtitle,
  children,
  footer,
  style,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
  className?: string;
}) {
  const hasHeader = Boolean(title || subtitle);
  return (
    <ThemedView
      className={className}
      lightColor={colorTokens.light.surface}
      darkColor={colorTokens.dark.surface}
      style={[styles.section, style]}
    >
      {hasHeader ? (
        <ThemedView style={styles.sectionHeader}>
          {title ? <ThemedText type="sectionTitle">{title}</ThemedText> : null}
          {subtitle ? <MetaText>{subtitle}</MetaText> : null}
        </ThemedView>
      ) : null}
      <ThemedView style={styles.sectionBody}>{children}</ThemedView>
      {footer ? (
        <ThemedView style={styles.sectionFooter}>{footer}</ThemedView>
      ) : null}
    </ThemedView>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  className,
  style,
  labelStyle,
  icon,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  icon?: keyof typeof MaterialIcons.glyphMap;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={className}
      style={[
        styles.primaryButton,
        { backgroundColor: palette.primaryStrong },
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={16}
          color={palette.primaryOn}
          style={styles.primaryButtonIcon}
        />
      ) : null}
      <ThemedText
        type="ctaLabel"
        lightColor={palette.primaryOn}
        darkColor={palette.primaryOn}
        style={labelStyle}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  className,
  icon,
  size = "compact",
  tone = "default",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  size?: "compact" | "cta";
  tone?: "default" | "destructive";
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const textColor = tone === "destructive" ? palette.destructiveSoftText : palette.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={className}
      style={[
        styles.secondaryButton,
        size === "cta" ? styles.secondaryButtonCta : null,
        {
          backgroundColor:
            tone === "destructive"
              ? palette.destructiveSoftBackground
              : palette.surfaceLowest,
        },
        disabled && styles.buttonDisabled,
      ]}
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={16}
          color={textColor}
          style={styles.secondaryButtonIcon}
        />
      ) : null}
      <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

type BaseInputProps = TextInputProps & {
  style?: TextInputProps["style"];
  className?: string;
};

export function InputField({ style, className, ...props }: BaseInputProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <TextInput
      className={className}
      placeholderTextColor={palette.mutedSoft}
      style={[
        styles.inputBase,
        styles.input,
        {
          color: palette.text,
          backgroundColor: palette.surfaceLowest,
          borderColor: palette.separator,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function TextAreaField({ style, className, ...props }: BaseInputProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <TextInput
      className={className}
      multiline
      placeholderTextColor={palette.mutedSoft}
      textAlignVertical="top"
      style={[
        styles.inputBase,
        styles.textArea,
        {
          color: palette.text,
          backgroundColor: palette.surfaceLowest,
          borderColor: palette.separator,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function MetaText({ children }: { children: ReactNode }) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedText
      type="meta"
      lightColor={palette.mutedSoft}
      darkColor={palette.mutedSoft}
    >
      {children}
    </ThemedText>
  );
}

export function StateBlock({
  tone = "info",
  message,
  detail,
  meta,
  showToneLabel,
  className,
}: {
  tone?: StateTone;
  message: string;
  detail?: string | null;
  meta?: string | null;
  showToneLabel?: boolean;
  className?: string;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const toneColors = getStateToneColors(tone, palette);
  const label = toneLabel(tone);
  const shouldShowToneLabel =
    typeof showToneLabel === "boolean" ? showToneLabel : Boolean(label);

  return (
    <ThemedView
      className={className}
      style={[
        styles.stateBlock,
        tone === "error" ? styles.stateBlockError : null,
        {
          backgroundColor: toneColors.background,
          borderColor: toneColors.border,
        },
      ]}
    >
      {tone === "error" ? (
        <ThemedView
          style={[
            styles.stateAccent,
            { backgroundColor: `${toneColors.title}B3` },
          ]}
        />
      ) : null}

      <ThemedView style={styles.stateContent}>
        {tone === "error" ? (
          <>
            <ThemedView style={styles.stateErrorIconRow}>
              <MaterialIcons
                name={toneIconName(tone)}
                size={16}
                color={toneColors.title}
                style={styles.stateToneIcon}
              />
            </ThemedView>
            <ThemedText
              type="defaultSemiBold"
              lightColor={toneColors.body}
              darkColor={toneColors.body}
            >
              {message}
            </ThemedText>
          </>
        ) : (
          <ThemedView style={styles.stateHeaderRow}>
            <MaterialIcons
              name={toneIconName(tone)}
              size={16}
              color={toneColors.title}
              style={styles.stateToneIcon}
            />
            <ThemedView style={styles.stateTextStack}>
              {shouldShowToneLabel && label ? (
                <ThemedText
                  type="meta"
                  lightColor={toneColors.title}
                  darkColor={toneColors.title}
                >
                  {label}
                </ThemedText>
              ) : null}
              <ThemedText
                type="defaultSemiBold"
                lightColor={toneColors.body}
                darkColor={toneColors.body}
              >
                {message}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
        {detail ? (
          <ThemedText
            type="bodySecondary"
            lightColor={toneColors.body}
            darkColor={toneColors.body}
          >
            {detail}
          </ThemedText>
        ) : null}
        {meta ? (
          <ThemedText
            type="caption"
            lightColor={toneColors.meta}
            darkColor={toneColors.meta}
          >
            {meta}
          </ThemedText>
        ) : null}
      </ThemedView>
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
  tone = "info",
  message,
  detail,
  meta,
}: {
  tone?: StateTone | "neutral";
  message: string;
  detail?: string | null;
  meta?: string | null;
}) {
  const nextTone = tone === "neutral" ? "info" : tone;
  return (
    <StateBlock tone={nextTone} message={message} detail={detail} meta={meta} />
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: spacing.page,
    paddingVertical: spacing.page,
    gap: spacing.content,
  },
  scrollHost: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    gap: 0,
  },
  scrollContent: {
    gap: spacing.content,
    paddingHorizontal: spacing.page,
    paddingTop: spacing.page,
    paddingBottom: spacing.xxxl + spacing.xxl + spacing.xxl,
  },
  section: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    ...shadows.surface,
  },
  sectionHeader: {
    gap: spacing.xxs,
  },
  sectionBody: {
    gap: spacing.content,
  },
  sectionFooter: {
    marginTop: spacing.xs,
  },
  primaryButtonIcon: {
    marginRight: spacing.xs,
  },
  primaryButton: {
    minHeight: sizing.ctaHeight,
    borderRadius: radius.pill,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  secondaryButtonIcon: {
    marginTop: 1,
  },
  secondaryButton: {
    minHeight: sizing.ctaCompactHeight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  secondaryButtonCta: {
    minHeight: sizing.ctaHeight,
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
    borderWidth: borders.subtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.sm,
  },
  stateBlockError: {
    borderWidth: 0,
  },
  stateAccent: {
    width: 3,
    borderRadius: radius.pill,
  },
  stateContent: {
    flex: 1,
    gap: spacing.xs,
  },
  stateHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  stateErrorIconRow: {
    minHeight: 18,
    justifyContent: "center",
  },
  stateTextStack: {
    flex: 1,
    gap: spacing.xxs,
  },
  stateToneIcon: {
    marginTop: 1,
  },
});
