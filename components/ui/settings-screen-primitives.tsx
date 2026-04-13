import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";
import { MetaText, ScreenContainer, SurfaceSection } from "./screen-primitives";

const FOOTER_TOP_TONE = {
  light: "rgba(116, 91, 0, 0.06)",
  dark: "rgba(224, 180, 58, 0.10)",
} as const;

export function AdminShell({
  children,
  scrollable = true,
  contentContainerStyle,
  fixedHeader,
  fixedFooter,
}: {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  fixedHeader?: ReactNode;
  fixedFooter?: ReactNode;
}) {
  return (
    <ScreenContainer
      scrollable={scrollable}
      backgroundTone="subtle"
      fixedHeader={fixedHeader}
      fixedFooter={fixedFooter}
      contentContainerStyle={[styles.adminShellContent, contentContainerStyle]}
    >
      {children}
    </ScreenContainer>
  );
}

export function AdminStickyFooterActions({
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: {
  primaryAction?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    icon?: keyof typeof MaterialIcons.glyphMap;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    icon?: keyof typeof MaterialIcons.glyphMap;
  };
  tertiaryAction?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    icon?: keyof typeof MaterialIcons.glyphMap;
    tone?: "destructive" | "quiet";
  };
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();

  if (!primaryAction && !secondaryAction && !tertiaryAction) return null;

  function renderAction(
    action: {
      label: string;
      onPress: () => void;
      disabled?: boolean;
      icon?: keyof typeof MaterialIcons.glyphMap;
    },
    tone: "primary" | "secondary" | "destructive" | "quiet"
  ) {
    const disabled = action.disabled ?? false;
    const iconColor =
      tone === "primary"
        ? palette.primaryOn
        : tone === "destructive"
          ? palette.destructiveSoftText
          : palette.text;

    return (
      <Pressable
        accessibilityRole="button"
        onPress={action.onPress}
        disabled={disabled}
        style={[
          styles.footerActionButton,
          tone === "primary"
            ? { backgroundColor: palette.primaryStrong }
            : tone === "destructive"
              ? {
                  backgroundColor: palette.destructiveSoftBackground,
                  borderColor: palette.destructiveSoftBorder,
                }
              : tone === "quiet"
                ? {
                    backgroundColor: palette.surfaceLow,
                    borderColor: palette.separator,
                  }
                : {
                    backgroundColor: palette.surfaceLowest,
                    borderColor: palette.separator,
                  },
          (tone === "secondary" || tone === "destructive" || tone === "quiet") && styles.footerActionBorder,
          disabled && styles.footerActionDisabled,
        ]}
      >
        <ThemedView style={styles.footerActionContent}>
          {action.icon ? <MaterialIcons name={action.icon} size={18} color={iconColor} /> : null}
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.footerActionLabel,
              {
                color: iconColor,
                fontWeight: tone === "primary" ? "700" : "600",
              },
            ]}
          >
            {action.label}
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  }

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLowest}
      darkColor={colorTokens.dark.surface}
      style={[
        styles.stickyFooter,
        {
          borderTopColor: palette.separator,
          paddingBottom: spacing.sm + Math.max(0, insets.bottom),
        },
      ]}
    >
      <View style={[styles.stickyFooterTopTone, { backgroundColor: FOOTER_TOP_TONE[scheme], pointerEvents: "none" }]} />
      <ThemedView style={styles.stickyFooterBody}>
        <ThemedView style={styles.stickyFooterRow}>
          {primaryAction ? (
            <ThemedView style={styles.stickyFooterItem}>{renderAction(primaryAction, "primary")}</ThemedView>
          ) : null}
          {secondaryAction ? (
            <ThemedView style={styles.stickyFooterItem}>{renderAction(secondaryAction, "secondary")}</ThemedView>
          ) : null}
          {tertiaryAction ? (
            <ThemedView style={styles.stickyFooterItem}>
              {renderAction(tertiaryAction, tertiaryAction.tone ?? "quiet")}
            </ThemedView>
          ) : null}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

export function SettingsTopNav({
  onBack,
  onMenu,
  title = "AI Quality Studio",
}: {
  onBack: () => void;
  onMenu: () => void;
  title?: string;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      lightColor={colorTokens.light.surfaceLowest}
      darkColor={colorTokens.dark.surface}
      style={[
        styles.stickyTopBar,
        {
          borderBottomColor: palette.separator,
          paddingTop: Math.max(insets.top, spacing.sm),
        },
      ]}
    >
      <SettingsHeaderIconButton
        icon="arrow-back"
        accessibilityLabel="Ga terug"
        onPress={onBack}
      />
      <ThemedView style={[styles.stickyTopBarCenter, { pointerEvents: "none" }]}>
        <ThemedText type="defaultSemiBold" style={[styles.stickyTopBarTitle, { color: palette.text }]}> 
          {title}
        </ThemedText>
      </ThemedView>
      <SettingsHeaderIconButton
        icon="menu"
        accessibilityLabel="Open menu"
        onPress={onMenu}
      />
    </ThemedView>
  );
}

export function AdminPageHero({ title, subtitle }: { title: string; subtitle: string }) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView style={styles.hero}>
      <ThemedText type="screenTitle">{title}</ThemedText>
      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
        {subtitle}
      </ThemedText>
    </ThemedView>
  );
}

export function SettingsHeaderIconButton({
  icon,
  accessibilityLabel,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.iconButton, { backgroundColor: palette.surface }]}
    >
      <MaterialIcons name={icon} size={20} color={palette.primary} />
    </Pressable>
  );
}

export function SettingsScreenHeader({
  title,
  subtitle,
  onBack,
  onMenu,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  onMenu: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <>
      <ThemedView style={styles.topBar}>
        <SettingsHeaderIconButton
          icon="arrow-back"
          accessibilityLabel="Ga terug"
          onPress={onBack}
        />
        <SettingsHeaderIconButton
          icon="menu"
          accessibilityLabel="Open menu"
          onPress={onMenu}
        />
      </ThemedView>

      <ThemedView style={styles.hero}>
        <ThemedText type="screenTitle">{title}</ThemedText>
        <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
          {subtitle}
        </ThemedText>
      </ThemedView>
    </>
  );
}

export function AdminMetaStrip({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ThemedView style={styles.metaStrip}>
      {items.map((item) => (
        <ThemedText key={item} type="meta">
          {item}
        </ThemedText>
      ))}
    </ThemedView>
  );
}

export function AdminActionRow({
  primary,
  secondary,
}: {
  primary?: ReactNode;
  secondary?: ReactNode;
}) {
  if (!primary && !secondary) return null;
  return <ThemedView style={styles.actionRow}>{primary}{secondary}</ThemedView>;
}

export function AdminAccordion({
  title,
  summary,
  children,
  defaultOpen = false,
  onToggle,
}: {
  title: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const [open, setOpen] = useState(defaultOpen);

  return (
    <ThemedView style={[styles.accordion, { borderColor: palette.separator }]}> 
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          setOpen((value) => {
            const next = !value;
            onToggle?.(next);
            return next;
          })
        }
        style={styles.accordionHeader}
      >
        <ThemedView style={styles.accordionHeaderText}>
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
          {summary ? <ThemedText type="meta">{summary}</ThemedText> : null}
        </ThemedView>
        <MaterialIcons name={open ? "expand-less" : "expand-more"} size={20} color={palette.mutedSoft} />
      </Pressable>
      {open ? <ThemedView style={styles.accordionBody}>{children}</ThemedView> : null}
    </ThemedView>
  );
}

export function AdminSection({
  title,
  subtitle,
  children,
  footer,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <SurfaceSection title={title} subtitle={subtitle} footer={footer}>
      {children}
    </SurfaceSection>
  );
}

export function AdminTokenRail({ children }: { children: ReactNode }) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  return (
    <ThemedView style={[styles.tokenRail, { backgroundColor: palette.surfaceLow }]}>
      {children}
    </ThemedView>
  );
}

export function AdminEditorSection({
  title,
  action,
  helper,
  tokenRail,
  editor,
  warnings,
}: {
  title: string;
  action?: ReactNode;
  helper?: string;
  tokenRail?: ReactNode;
  editor: ReactNode;
  warnings?: string[];
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  return (
    <ThemedView style={styles.editorSection}>
      <ThemedView style={styles.editorSectionHeader}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        {action}
      </ThemedView>
      {helper ? <MetaText>{helper}</MetaText> : null}
      {tokenRail}
      {editor}
      {warnings?.map((warning) => (
        <ThemedText key={warning} type="caption" style={{ color: palette.destructiveSoftText }}>
          {warning}
        </ThemedText>
      ))}
    </ThemedView>
  );
}

export function AdminReadOnlyBlock({
  title,
  lines,
  children,
}: {
  title: string;
  lines?: string[];
  children?: ReactNode;
}) {
  return (
    <ThemedView style={styles.readOnlyBlock}>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      {lines?.map((line) => (
        <MetaText key={line}>{line}</MetaText>
      ))}
      {children}
    </ThemedView>
  );
}

export function SettingsStateBody({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <ThemedView style={[styles.stateBody, style]}>{children}</ThemedView>;
}

export function SettingsStateIcon({
  icon,
  iconColor,
  backgroundColor,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}) {
  return (
    <ThemedView style={[styles.iconWrap, { backgroundColor }]}>
      <MaterialIcons name={icon} size={30} color={iconColor} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  adminShellContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stickyTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.page,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    marginBottom: spacing.sm,
    minHeight: 64,
  },
  stickyTopBarCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  stickyTopBarTitle: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  stickyFooter: {
    borderTopWidth: 1,
    position: "relative",
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.page,
  },
  stickyFooterTopTone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  stickyFooterBody: {
    gap: spacing.xs,
  },
  stickyFooterRow: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
  },
  stickyFooterItem: {
    flex: 1,
  },
  footerActionButton: {
    minHeight: 46,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  footerActionBorder: {
    borderWidth: 1,
  },
  footerActionDisabled: {
    opacity: 0.55,
  },
  footerActionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  footerActionLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  hero: {
    gap: spacing.sm,
  },
  metaStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  actionRow: {
    gap: spacing.sm,
  },
  accordion: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  accordionHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  accordionHeaderText: {
    flex: 1,
    gap: spacing.xxs,
  },
  accordionBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  tokenRail: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  editorSection: {
    gap: spacing.xs,
  },
  editorSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  readOnlyBlock: {
    gap: spacing.xs,
  },
  stateBody: {
    alignItems: "center",
    gap: spacing.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
