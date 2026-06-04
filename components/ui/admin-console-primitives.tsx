import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type ReactNode } from "react";
import { Pressable, StyleSheet, useWindowDimensions, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { adminTokens, colorTokens, radius, spacing } from "@/theme";
import { InputField, MetaText, ScreenContainer, StateBlock, TextAreaField } from "./screen-primitives";

type ConsoleAction = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

type ChipTone = "neutral" | "success" | "warning" | "info" | "danger";

const ADMIN_BACKGROUND = {
  light: adminTokens.light.background,
  dark: adminTokens.dark.background,
} as const;

const ADMIN_SURFACE = {
  light: adminTokens.light.panel,
  dark: adminTokens.dark.panel,
} as const;

const ADMIN_SURFACE_LOW = {
  light: adminTokens.light.panelSoft,
  dark: adminTokens.dark.panelSoft,
} as const;

const CHIP_COLORS: Record<ChipTone, Record<"light" | "dark", { bg: string; text: string; border: string }>> = {
  neutral: {
  light: { bg: "rgba(20,24,28,0.055)", text: "#4e555e", border: "rgba(20,24,28,0.09)" },
    dark: { bg: "rgba(255,255,255,0.06)", text: adminTokens.dark.muted, border: adminTokens.dark.border },
  },
  success: {
    light: { bg: "rgba(31,122,78,0.10)", text: adminTokens.light.success, border: "rgba(31,122,78,0.16)" },
    dark: { bg: "rgba(78,213,151,0.13)", text: adminTokens.dark.success, border: "rgba(78,213,151,0.18)" },
  },
  warning: {
    light: { bg: "rgba(171,116,23,0.12)", text: adminTokens.light.warning, border: "rgba(171,116,23,0.18)" },
    dark: { bg: "rgba(247,199,107,0.14)", text: adminTokens.dark.warning, border: "rgba(247,199,107,0.22)" },
  },
  info: {
    light: { bg: "rgba(55,99,160,0.11)", text: adminTokens.light.info, border: "rgba(55,99,160,0.17)" },
    dark: { bg: "rgba(108,203,255,0.14)", text: adminTokens.dark.info, border: "rgba(108,203,255,0.20)" },
  },
  danger: {
    light: { bg: "rgba(176,62,62,0.10)", text: adminTokens.light.danger, border: "rgba(176,62,62,0.17)" },
    dark: { bg: "rgba(255,107,122,0.13)", text: adminTokens.dark.danger, border: "rgba(255,107,122,0.20)" },
  },
};

export function AdminConsoleShell({
  children,
  onBack,
  onMenu,
  title = "AI Quality Studio",
  scrollable = true,
  contentContainerStyle,
  fixedFooter,
  sidebar,
  inspector,
}: {
  children: ReactNode;
  onBack: () => void;
  onMenu: () => void;
  title?: string;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  fixedFooter?: ReactNode;
  sidebar?: ReactNode;
  inspector?: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const showWorkspace = Boolean(sidebar || inspector) && width >= adminTokens.layout.tabletBreakpoint;

  return (
    <ScreenContainer
      scrollable={scrollable}
      backgroundTone="subtle"
      fixedHeader={<AdminConsoleTopBar title={title} onBack={onBack} onMenu={onMenu} />}
      fixedFooter={fixedFooter}
      contentContainerStyle={[styles.shellContent, contentContainerStyle]}
      style={{ backgroundColor: ADMIN_BACKGROUND[useColorScheme() ?? "light"] }}
    >
      {showWorkspace ? (
        <ThemedView style={styles.shellWorkspace}>
          {sidebar ? <ThemedView style={styles.shellSidebar}>{sidebar}</ThemedView> : null}
          <ThemedView style={styles.shellMain}>{children}</ThemedView>
          {inspector ? <ThemedView style={styles.shellInspector}>{inspector}</ThemedView> : null}
        </ThemedView>
      ) : (
        <>
          {children}
          {inspector ? <ThemedView style={styles.mobileInspector}>{inspector}</ThemedView> : null}
        </>
      )}
    </ScreenContainer>
  );
}

export function AdminConsoleTopBar({
  title,
  onBack,
  onMenu,
}: {
  title: string;
  onBack: () => void;
  onMenu: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[
        styles.topBar,
        {
          backgroundColor: ADMIN_SURFACE[scheme],
          borderBottomColor: palette.separator,
          paddingTop: Math.max(insets.top, spacing.sm),
        },
      ]}
    >
      <AdminConsoleIconButton icon="arrow-back" accessibilityLabel="Ga terug" onPress={onBack} />
      <ThemedView style={[styles.topBarCenter, { pointerEvents: "none" }]}>
        <ThemedText type="defaultSemiBold" style={[styles.topBarEyebrow, { color: palette.mutedSoft }]}>
          Admin console
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={[styles.topBarTitle, { color: palette.text }]}>
          {title}
        </ThemedText>
      </ThemedView>
      <AdminConsoleIconButton icon="menu" accessibilityLabel="Open menu" onPress={onMenu} />
    </ThemedView>
  );
}

export function AdminConsoleHeader({
  eyebrow,
  title,
  subtitle,
  chips,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  chips?: ReactNode;
  actions?: ReactNode;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerText}>
        {eyebrow ? (
          <ThemedText type="meta" style={[styles.headerEyebrow, { color: palette.mutedSoft }]}>
            {eyebrow}
          </ThemedText>
        ) : null}
        <ThemedText type="screenTitle" style={styles.headerTitle}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="bodySecondary" style={[styles.headerSubtitle, { color: palette.muted }]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </ThemedView>
      <ThemedView style={styles.headerRail}>
        {chips ? <ThemedView style={styles.chipRow}>{chips}</ThemedView> : null}
        {actions ? <ThemedView style={styles.headerActions}>{actions}</ThemedView> : null}
      </ThemedView>
    </ThemedView>
  );
}

export const AdminPageHeader = AdminConsoleHeader;

export function AdminConsolePanel({
  title,
  subtitle,
  action,
  children,
  style,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <ThemedView
      style={[
        styles.panel,
        {
          backgroundColor: ADMIN_SURFACE[scheme],
          borderColor: palette.separator,
        },
        style,
      ]}
    >
      {title || subtitle || action ? (
        <ThemedView style={styles.panelHeader}>
          <ThemedView style={styles.panelTitleWrap}>
            {title ? <ThemedText type="defaultSemiBold">{title}</ThemedText> : null}
            {subtitle ? <MetaText>{subtitle}</MetaText> : null}
          </ThemedView>
          {action}
        </ThemedView>
      ) : null}
      {children}
    </ThemedView>
  );
}

export const AdminPanel = AdminConsolePanel;
export const AdminCard = AdminConsolePanel;

export function AdminDenseRow({
  title,
  subtitle,
  meta,
  chips,
  trailing,
  onPress,
  disabled,
}: {
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  chips?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const Content = (
    <>
      <ThemedView style={styles.rowMain}>
        <ThemedView style={styles.rowTitleLine}>
          <ThemedText type="defaultSemiBold" style={styles.rowTitle}>
            {title}
          </ThemedText>
          {chips ? <ThemedView style={styles.rowChips}>{chips}</ThemedView> : null}
        </ThemedView>
        {subtitle ? <MetaText>{subtitle}</MetaText> : null}
        {meta ? (
          <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
            {meta}
          </ThemedText>
        ) : null}
      </ThemedView>
      {trailing ? <ThemedView style={styles.rowTrailing}>{trailing}</ThemedView> : null}
    </>
  );

  if (!onPress) {
    return <ThemedView style={[styles.denseRow, { borderTopColor: palette.separator }]}>{Content}</ThemedView>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.denseRow,
        {
          borderTopColor: palette.separator,
          backgroundColor: pressed ? ADMIN_SURFACE_LOW[scheme] : "transparent",
          opacity: disabled ? 0.55 : 1,
        },
      ]}
    >
      {Content}
    </Pressable>
  );
}

export function AdminStatusChip({
  label,
  tone = "neutral",
  icon,
}: {
  label: string;
  tone?: ChipTone;
  icon?: keyof typeof MaterialIcons.glyphMap;
}) {
  const scheme = useColorScheme() ?? "light";
  const colors = CHIP_COLORS[tone][scheme];

  return (
    <ThemedView style={[styles.chip, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      {icon ? <MaterialIcons name={icon} size={12} color={colors.text} /> : null}
      <ThemedText type="caption" style={[styles.chipLabel, { color: colors.text }]}>
        {label}
      </ThemedText>
    </ThemedView>
  );
}

export const AdminStatusBadge = AdminStatusChip;

export function AdminConsoleButton({
  label,
  onPress,
  disabled,
  icon,
  tone = "secondary",
}: ConsoleAction & { tone?: "primary" | "secondary" | "danger" }) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const isPrimary = tone === "primary";
  const isDanger = tone === "danger";
  const color = isPrimary ? palette.primaryOn : isDanger ? CHIP_COLORS.danger[scheme].text : palette.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary
            ? palette.text
            : isDanger
              ? CHIP_COLORS.danger[scheme].bg
              : ADMIN_SURFACE_LOW[scheme],
          borderColor: isPrimary ? palette.text : isDanger ? CHIP_COLORS.danger[scheme].border : palette.separator,
          opacity: disabled ? 0.55 : 1,
        },
      ]}
    >
      {icon ? <MaterialIcons name={icon} size={15} color={color} /> : null}
      <ThemedText type="caption" style={[styles.buttonLabel, { color }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function AdminMetricCard({
  label,
  value,
  meta,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  meta?: string;
  tone?: ChipTone;
}) {
  const scheme = useColorScheme() ?? "light";
  const colors = CHIP_COLORS[tone][scheme];
  return (
    <ThemedView style={[styles.metricCard, { backgroundColor: ADMIN_SURFACE[scheme], borderColor: colors.border }]}>
      <ThemedText type="caption" style={{ color: adminTokens[scheme].subtle }}>
        {label}
      </ThemedText>
      <ThemedText type="sectionTitle" style={[styles.metricValue, { color: colors.text }]}>
        {String(value)}
      </ThemedText>
      {meta ? <MetaText>{meta}</MetaText> : null}
    </ThemedView>
  );
}

export function AdminMetricGrid({ children }: { children: ReactNode }) {
  return <ThemedView style={styles.metricGrid}>{children}</ThemedView>;
}

export function AdminInspectorPanel({
  title = "Inspector",
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <AdminConsolePanel title={title} subtitle={subtitle} style={styles.inspectorPanel}>
      {children}
    </AdminConsolePanel>
  );
}

export function AdminTimeline({
  items,
}: {
  items: { label: string; meta?: string; tone?: ChipTone }[];
}) {
  const scheme = useColorScheme() ?? "light";
  return (
    <ThemedView style={styles.timeline}>
      {items.map((item, index) => {
        const colors = CHIP_COLORS[item.tone ?? "info"][scheme];
        return (
          <ThemedView key={`${item.label}-${index}`} style={styles.timelineItem}>
            <ThemedView style={[styles.timelineDot, { backgroundColor: colors.text }]} />
            <ThemedView style={styles.timelineCopy}>
              <ThemedText type="defaultSemiBold" style={styles.timelineLabel}>
                {item.label}
              </ThemedText>
              {item.meta ? <MetaText>{item.meta}</MetaText> : null}
            </ThemedView>
          </ThemedView>
        );
      })}
    </ThemedView>
  );
}

export function AdminEmptyState({ message, detail }: { message: string; detail?: string }) {
  return <StateBlock tone="empty" message={message} detail={detail} />;
}

export function AdminErrorState({ message, detail }: { message: string; detail?: string }) {
  return <StateBlock tone="error" message={message} detail={detail} />;
}

export function AdminList({ children }: { children: ReactNode }) {
  return <ThemedView style={styles.adminList}>{children}</ThemedView>;
}

export const AdminTable = AdminList;

export function AdminSplitWorkspace({
  main,
  side,
  wide,
}: {
  main: ReactNode;
  side: ReactNode;
  wide: boolean;
}) {
  return (
    <ThemedView style={[styles.splitWorkspace, wide ? styles.splitWorkspaceWide : null]}>
      <ThemedView style={styles.splitMain}>{main}</ThemedView>
      <ThemedView style={[styles.splitSide, wide ? styles.splitSideWide : null]}>{side}</ThemedView>
    </ThemedView>
  );
}

export const AdminSplitLayout = AdminSplitWorkspace;

export function AdminActionBar({
  primary,
  secondary,
  tertiary,
  floating = false,
}: {
  primary?: ConsoleAction;
  secondary?: ConsoleAction;
  tertiary?: ConsoleAction & { tone?: "danger" | "secondary" };
  floating?: boolean;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const insets = useSafeAreaInsets();

  if (!primary && !secondary && !tertiary) return null;
  return (
    <ThemedView
      style={[
        styles.actionBar,
        floating
          ? [
              styles.actionBarFloating,
              {
                backgroundColor: ADMIN_SURFACE[scheme],
                borderTopColor: palette.separator,
                paddingBottom: Math.max(insets.bottom, spacing.sm),
              },
            ]
          : null,
      ]}
    >
      {tertiary ? <AdminConsoleButton {...tertiary} tone={tertiary.tone ?? "secondary"} /> : null}
      <ThemedView style={styles.actionBarSpacer} />
      {secondary ? <AdminConsoleButton {...secondary} /> : null}
      {primary ? <AdminConsoleButton {...primary} tone="primary" /> : null}
    </ThemedView>
  );
}

export function AdminFormField({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <ThemedView style={styles.formField}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      {helper ? <MetaText>{helper}</MetaText> : null}
      {children}
    </ThemedView>
  );
}

export { InputField as AdminInputField, TextAreaField as AdminTextAreaField };

export function AdminConsoleKeyValue({ label, value }: { label: string; value: string }) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  return (
    <ThemedView style={[styles.keyValue, { backgroundColor: ADMIN_SURFACE_LOW[scheme] }]}>
      <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
        {label}
      </ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.keyValueText}>
        {value}
      </ThemedText>
    </ThemedView>
  );
}

function AdminConsoleIconButton({
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
      style={[styles.iconButton, { backgroundColor: ADMIN_SURFACE_LOW[scheme], borderColor: palette.separator }]}
    >
      <MaterialIcons name={icon} size={18} color={palette.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shellContent: {
    width: "100%",
    maxWidth: 1240,
    alignSelf: "center",
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  shellWorkspace: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  shellSidebar: {
    width: adminTokens.layout.sidebarWidth,
    gap: spacing.md,
  },
  shellMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.lg,
  },
  shellInspector: {
    width: adminTokens.layout.inspectorWidth,
    gap: spacing.md,
  },
  mobileInspector: {
    gap: spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.page,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 62,
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  topBarEyebrow: {
    fontSize: 10,
    lineHeight: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  topBarTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
    alignItems: "flex-end",
  },
  headerText: {
    flex: 1,
    minWidth: 260,
    gap: spacing.xs,
  },
  headerEyebrow: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: {
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    maxWidth: 660,
  },
  headerRail: {
    alignItems: "flex-end",
    gap: spacing.sm,
    maxWidth: 520,
  },
  headerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: spacing.xs,
  },
  panel: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  inspectorPanel: {
    width: "100%",
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  panelTitleWrap: {
    flex: 1,
    gap: spacing.xxs,
  },
  denseRow: {
    minHeight: 58,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  rowMain: {
    flex: 1,
    gap: spacing.xxs,
  },
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  rowTitle: {
    lineHeight: 20,
  },
  rowChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xxs,
  },
  rowTrailing: {
    alignItems: "flex-end",
  },
  chip: {
    minHeight: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chipLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },
  button: {
    minHeight: 34,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxs,
  },
  buttonLabel: {
    fontWeight: "700",
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metricCard: {
    minWidth: 148,
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  metricValue: {
    letterSpacing: -0.35,
  },
  timeline: {
    gap: spacing.xs,
  },
  timelineItem: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
    paddingVertical: spacing.xs,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    marginTop: 6,
  },
  timelineCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  timelineLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  adminList: {
    gap: 0,
  },
  splitWorkspace: {
    gap: spacing.md,
  },
  splitWorkspaceWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  splitMain: {
    flex: 1,
    minWidth: 0,
    gap: spacing.md,
  },
  splitSide: {
    gap: spacing.md,
  },
  splitSideWide: {
    width: 360,
  },
  keyValue: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: 2,
  },
  keyValueText: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  actionBarFloating: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.page,
  },
  actionBarSpacer: {
    flex: 1,
    minWidth: spacing.sm,
  },
  formField: {
    gap: spacing.xs,
  },
});
