import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet } from "react-native";

import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ModalBackdrop } from "@/components/ui/modal-backdrop";
import {
    ScreenContainer,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    classifyUnknownError,
    hasAdminRegenerationAccess,
    resetAllUserData,
} from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

type SettingsRoute = {
  key: "export" | "import" | "regeneration";
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: "/settings-export" | "/settings-import" | "/settings-regeneration";
};

type RowItem = {
  key: string;
  label: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  destructive?: boolean;
};

type DeleteSheetState = "closed" | "confirm" | "loading" | "success" | "error";

const ARCHIVE_ROUTES: SettingsRoute[] = [
  {
    key: "export",
    label: "Archief downloaden",
    description: "Bewaar een leesbaar bestand van je archief.",
    icon: "download",
    route: "/settings-export",
  },
  {
    key: "import",
    label: "Importeren",
    description: "Importeer eerder geschreven bestanden.",
    icon: "file-upload",
    route: "/settings-import",
  },
];

const ADMIN_ROUTE: SettingsRoute = {
  key: "regeneration",
  label: "Data opnieuw verwerken",
  description:
    "Herbouw entries, dagjournals en reflecties voor alle gebruikers.",
  icon: "autorenew",
  route: "/settings-regeneration",
};

const DELETE_ROW: RowItem = {
  key: "delete-all",
  label: "Verwijder alles",
  description: "Verwijder je momenten, dagen en reflecties.",
  icon: "delete-forever",
  destructive: true,
};

function SettingsRow({
  item,
  onPress,
}: {
  item: RowItem;
  onPress: () => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={onPress}
      style={[
        styles.menuRow,
        {
          backgroundColor: palette.surfaceLow,
        },
      ]}
    >
      <ThemedView style={styles.menuRowLeft}>
        <MaterialIcons
          name={item.icon}
          size={18}
          style={styles.menuRowIcon}
          color={item.destructive ? palette.destructiveSoftText : palette.primary}
        />

        <ThemedView style={styles.menuTextWrap}>
          <ThemedText
            type="defaultSemiBold"
            style={
              item.destructive
                ? { color: palette.destructiveSoftText }
                : undefined
            }
          >
            {item.label}
          </ThemedText>
          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
            {item.description}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <MaterialIcons
        name="chevron-right"
        size={18}
        style={styles.menuRowChevron}
        color={
          item.destructive ? palette.destructiveSoftText : palette.mutedSoft
        }
      />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [deleteSheetState, setDeleteSheetState] =
    useState<DeleteSheetState>("closed");
  const [deleteErrorDetail, setDeleteErrorDetail] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const allowed = await hasAdminRegenerationAccess();
        if (!cancelled) {
          setAdminAccess(allowed);
          setAccessError(null);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Kon admin-rechten niet controleren.";
          setAdminAccess(false);
          setAccessError(message);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const adminRoutes = useMemo(
    () => (adminAccess === true ? [ADMIN_ROUTE] : []),
    [adminAccess],
  );

  const deleteSheetVisible = deleteSheetState !== "closed";
  const canCloseDeleteSheet =
    deleteSheetState === "confirm" ||
    deleteSheetState === "success" ||
    deleteSheetState === "error";

  function closeDeleteSheet() {
    if (!canCloseDeleteSheet) {
      return;
    }

    setDeleteSheetState("closed");
    setDeleteErrorDetail(null);
  }

  async function handleConfirmDeleteAll() {
    if (deleteSheetState === "loading") {
      return;
    }

    setDeleteSheetState("loading");
    setDeleteErrorDetail(null);

    try {
      await resetAllUserData();
      setDeleteSheetState("success");
    } catch (error) {
      const parsed = classifyUnknownError(error);
      setDeleteErrorDetail(parsed.message);
      setDeleteSheetState("error");
    }
  }

  return (
    <>
      <ScreenContainer
        scrollable
        backgroundTone="flat"
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ga terug"
            onPress={() => router.back()}
            style={[styles.iconButton, { backgroundColor: palette.surface }]}
          >
            <MaterialIcons name="arrow-back" size={20} color={palette.primary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => setMenuVisible(true)}
            style={[styles.iconButton, { backgroundColor: palette.surface }]}
          >
            <MaterialIcons name="menu" size={20} color={palette.primary} />
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.hero}>
          <ThemedText type="screenTitle">Instellingen</ThemedText>
          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
            Beheer je archief en gegevens.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionGroup}>
          <ThemedText type="meta" style={{ color: palette.mutedSoft }}>
            Archief
          </ThemedText>
          <ThemedView style={styles.menuList}>
            {ARCHIVE_ROUTES.map((item) => (
              <SettingsRow
                key={item.key}
                item={item}
                onPress={() => router.push(item.route)}
              />
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.sectionGroup}>
          <ThemedText type="meta" style={{ color: palette.mutedSoft }}>
            Gegevens verwijderen
          </ThemedText>
          <SettingsRow
            item={DELETE_ROW}
            onPress={() => setDeleteSheetState("confirm")}
          />
        </ThemedView>

        {adminRoutes.length > 0 ? (
          <ThemedView style={styles.sectionGroup}>
            <ThemedText type="meta" style={{ color: palette.mutedSoft }}>
              Beheer
            </ThemedText>
            <ThemedView style={styles.menuList}>
              {adminRoutes.map((item) => (
                <SettingsRow
                  key={item.key}
                  item={item}
                  onPress={() => router.push(item.route)}
                />
              ))}
            </ThemedView>
          </ThemedView>
        ) : null}

        {accessError ? (
          <ThemedView style={styles.sectionGroup}>
            <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
              {accessError}
            </ThemedText>
          </ThemedView>
        ) : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </ScreenContainer>

      <Modal
        transparent
        visible={deleteSheetVisible}
        animationType="fade"
        onRequestClose={closeDeleteSheet}
      >
        <ModalBackdrop
          layout="bottom"
          onPressOutside={closeDeleteSheet}
          outsidePressDisabled={!canCloseDeleteSheet}
        >
          <ThemedView
            lightColor={colorTokens.light.surfaceLowest}
            darkColor={colorTokens.dark.surface}
            style={styles.sheetCard}
          >
            <ThemedView
              style={[
                styles.sheetHandle,
                { backgroundColor: palette.separator },
              ]}
            />

            {deleteSheetState === "confirm" ? (
              <>
                <ThemedText type="sectionTitle">
                  Weet je zeker dat je alles wilt verwijderen?
                </ThemedText>
                <ThemedText
                  type="bodySecondary"
                  style={{ color: palette.muted }}
                >
                  Je momenten, dagen en reflecties worden verwijderd. Dit kun je
                  niet ongedaan maken.
                </ThemedText>

                <ThemedView style={styles.sheetActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Annuleren"
                    onPress={closeDeleteSheet}
                    style={styles.sheetSecondaryButton}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: palette.mutedSoft }}
                    >
                      Annuleren
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Verwijder alles"
                    onPress={() => void handleConfirmDeleteAll()}
                    style={[
                      styles.sheetDangerButton,
                      {
                        backgroundColor: palette.surfaceLow,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="delete-forever"
                      size={18}
                      color={palette.destructiveSoftText}
                    />
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: palette.destructiveSoftText }}
                    >
                      Verwijder alles
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              </>
            ) : null}

            {deleteSheetState === "loading" ? (
              <>
                <ThemedView style={styles.loadingWrap}>
                  <ActivityIndicator color={palette.primaryStrong} />
                </ThemedView>
                <ThemedText type="sectionTitle">Verwijderen</ThemedText>
                <ThemedText
                  type="bodySecondary"
                  style={[styles.stateTextCenter, { color: palette.muted }]}
                >
                  Je gegevens worden verwijderd. Dit kan een moment duren.
                </ThemedText>
              </>
            ) : null}

            {deleteSheetState === "success" ? (
              <>
                <ThemedView
                  style={[
                    styles.statusIconWrap,
                    { backgroundColor: palette.surfaceLow },
                  ]}
                >
                  <MaterialIcons
                    name="check-circle-outline"
                    size={28}
                    color={palette.primaryStrong}
                  />
                </ThemedView>
                <ThemedText type="sectionTitle">
                  Alles is verwijderd.
                </ThemedText>
                <ThemedText
                  type="bodySecondary"
                  style={[styles.stateTextCenter, { color: palette.muted }]}
                >
                  Je gegevens zijn verwijderd. Je kunt opnieuw beginnen wanneer
                  je wilt.
                </ThemedText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Klaar"
                  onPress={closeDeleteSheet}
                  style={[
                    styles.sheetPrimaryButton,
                    { backgroundColor: palette.primaryStrong },
                  ]}
                >
                  <ThemedText
                    type="ctaLabel"
                    lightColor={palette.primaryOn}
                    darkColor={palette.primaryOn}
                  >
                    Klaar
                  </ThemedText>
                </Pressable>
              </>
            ) : null}

            {deleteSheetState === "error" ? (
              <>
                <ThemedView
                  style={[
                    styles.statusIconWrap,
                    { backgroundColor: palette.destructiveSoftBackground },
                  ]}
                >
                  <MaterialIcons
                    name="warning-amber"
                    size={28}
                    color={palette.destructiveSoftText}
                  />
                </ThemedView>
                <ThemedText type="sectionTitle">
                  Verwijderen lukte niet.
                </ThemedText>
                <ThemedText
                  type="bodySecondary"
                  style={[styles.stateTextCenter, { color: palette.muted }]}
                >
                  Er ging iets mis. Probeer het opnieuw.
                </ThemedText>
                {deleteErrorDetail ? (
                  <ThemedText
                    type="caption"
                    style={{ color: palette.mutedSoft }}
                  >
                    {deleteErrorDetail}
                  </ThemedText>
                ) : null}

                <ThemedView style={styles.sheetActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Sluiten"
                    onPress={closeDeleteSheet}
                    style={styles.sheetSecondaryButton}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ color: palette.mutedSoft }}
                    >
                      Sluiten
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Probeer opnieuw"
                    onPress={() => void handleConfirmDeleteAll()}
                    style={[
                      styles.sheetPrimaryButton,
                      { backgroundColor: palette.primaryStrong },
                    ]}
                  >
                    <ThemedText
                      type="ctaLabel"
                      lightColor={palette.primaryOn}
                      darkColor={palette.primaryOn}
                    >
                      Probeer opnieuw
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              </>
            ) : null}
          </ThemedView>
        </ModalBackdrop>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hero: {
    gap: spacing.sm,
  },
  sectionGroup: {
    gap: spacing.sm,
  },
  menuList: {
    gap: spacing.sm,
  },
  menuRow: {
    borderRadius: radius.lg,
    minHeight: 62,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    flex: 1,
  },
  menuRowIcon: {
    marginTop: 2,
  },
  menuTextWrap: {
    gap: spacing.xxs,
    flex: 1,
  },
  menuRowChevron: {
    marginTop: 2,
  },
  sheetCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    alignSelf: "center",
    marginBottom: spacing.sm,
  },
  sheetActions: {
    gap: spacing.sm,
  },
  sheetSecondaryButton: {
    minHeight: 46,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  sheetDangerButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  sheetPrimaryButton: {
    minHeight: 46,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  loadingWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  statusIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  stateTextCenter: {
    textAlign: "center",
  },
});
