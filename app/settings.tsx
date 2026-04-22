import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { AsyncStatusSheet } from "@/components/feedback/async-status-sheet";
import { ConfirmSheet } from "@/components/feedback/destructive-confirm-sheet";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedView } from "@/components/themed-view";
import { SettingsScaffold } from "@/components/ui/screen-scaffolds";
import {
  SettingsNavRow,
  SettingsSectionLabel,
} from "@/components/ui/settings-nav-primitives";
import {
    classifyUnknownError,
    hasAdminAiQualityStudioAccess,
    hasAdminRegenerationAccess,
    isObsidianSettingsEnabled,
    resetAllUserData,
} from "@/services";
import { spacing } from "@/theme";

type SettingsRoute = {
  key:
    | "export"
    | "import"
    | "audio"
    | "obsidian"
    | "regeneration"
    | "ai-quality-studio";
  label: string;
  description: string;
  icon: ComponentProps<typeof MaterialIcons>["name"];
  route:
    | "/settings-export"
    | "/settings-import"
    | "/settings-audio"
    | "/settings-obsidian"
    | "/settings-regeneration"
    | "/settings-ai-quality-studio";
};

type RowItem = {
  label: string;
  description: string;
  icon: ComponentProps<typeof MaterialIcons>["name"];
  destructive?: boolean;
};

type DeleteSheetState = "closed" | "loading" | "success" | "error";

const ARCHIVE_ROUTES: SettingsRoute[] = [
  {
    key: "export",
    label: "Archief downloaden",
    description: "Bewaar een leesbaar bestand van je archief.",
    icon: "download",
    route: "/settings-export",
  },
  {
    key: "audio",
    label: "Audio-opnames bewaren",
    description: "Kies of je originele audio-opnames worden bewaard.",
    icon: "mic",
    route: "/settings-audio",
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

const ADMIN_AI_QUALITY_ROUTE: SettingsRoute = {
  key: "ai-quality-studio",
  label: "AI Quality Studio",
  description: "Bekijk AI tasks en live versiestatus (admin-only).",
  icon: "tune",
  route: "/settings-ai-quality-studio",
};

const ADMIN_OBSIDIAN_ROUTE: SettingsRoute = {
  key: "obsidian",
  label: "Obsidian integratie",
  description: "Stel standaard vault en notitie in voor Obsidian.",
  icon: "folder",
  route: "/settings-obsidian",
};

const DELETE_ROW: RowItem = {
  label: "Verwijder alles",
  description: "Verwijder je momenten, dagen en reflecties.",
  icon: "delete-forever",
  destructive: true,
};

export default function SettingsScreen() {
  const obsidianEnabled = isObsidianSettingsEnabled();
  const [menuVisible, setMenuVisible] = useState(false);
  const [, setAdminAccess] = useState<boolean | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteSheetState, setDeleteSheetState] =
    useState<DeleteSheetState>("closed");
  const [deleteErrorDetail, setDeleteErrorDetail] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const [regenAllowed, aiQualityAllowed] = await Promise.all([
          hasAdminRegenerationAccess(),
          hasAdminAiQualityStudioAccess(),
        ]);
        const allowed = regenAllowed || aiQualityAllowed;
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
          setAdminAccess(null);
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
    () =>
      obsidianEnabled
        ? [ADMIN_ROUTE, ADMIN_OBSIDIAN_ROUTE, ADMIN_AI_QUALITY_ROUTE]
        : [ADMIN_ROUTE, ADMIN_AI_QUALITY_ROUTE],
    [obsidianEnabled],
  );

  function closeDeleteSheet() {
    if (deleteSheetState === "loading") {
      return;
    }

    setDeleteSheetState("closed");
    setDeleteErrorDetail(null);
  }

  async function handleConfirmDeleteAll() {
    if (deleteSheetState === "loading") {
      return;
    }

    setDeleteConfirmVisible(false);
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
      <SettingsScaffold
        title="Instellingen"
        subtitle="Beheer je archief en gegevens."
        onBack={() => router.back()}
        onMenu={() => setMenuVisible(true)}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.sectionGroup}>
          <SettingsSectionLabel label="Archief" />
          <ThemedView style={styles.menuList}>
            {ARCHIVE_ROUTES.map((item) => (
              <SettingsNavRow
                key={item.key}
                label={item.label}
                description={item.description}
                icon={item.icon}
                onPress={() => router.push(item.route as any)}
              />
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.sectionGroup}>
          <SettingsSectionLabel label="Gegevens verwijderen" />
          <SettingsNavRow
            label={DELETE_ROW.label}
            description={DELETE_ROW.description}
            icon={DELETE_ROW.icon}
            destructive
            onPress={() => setDeleteConfirmVisible(true)}
          />
        </ThemedView>

        {adminRoutes.length > 0 ? (
          <ThemedView style={styles.sectionGroup}>
            <SettingsSectionLabel label="Beheer" />
            <ThemedView style={styles.menuList}>
              {adminRoutes.map((item) => (
                <SettingsNavRow
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                  onPress={() => router.push(item.route as any)}
                />
              ))}
            </ThemedView>
          </ThemedView>
        ) : null}

        {accessError ? (
          <ThemedView style={styles.sectionGroup}>
            <SettingsSectionLabel label={accessError} />
          </ThemedView>
        ) : null}

        <FullscreenMenuOverlay
          visible={menuVisible}
          currentRouteKey="settings"
          onRequestClose={() => setMenuVisible(false)}
        />
      </SettingsScaffold>

      <AsyncStatusSheet
        state={deleteSheetState}
        loadingTitle="Verwijderen"
        loadingMessage="Je gegevens worden verwijderd. Dit kan een moment duren."
        successTitle="Alles is verwijderd."
        successMessage="Je gegevens zijn verwijderd. Je kunt opnieuw beginnen wanneer je wilt."
        errorTitle="Verwijderen lukte niet."
        errorMessage="Er ging iets mis. Probeer het opnieuw."
        errorDetail={deleteErrorDetail}
        closeLabel="Klaar"
        retryLabel="Probeer opnieuw"
        onClose={closeDeleteSheet}
        onRetry={() => void handleConfirmDeleteAll()}
      />

      <ConfirmSheet
        visible={deleteConfirmVisible}
        title="Weet je zeker dat je alles wilt verwijderen?"
        message="Je momenten, dagen en reflecties worden verwijderd. Dit kun je niet ongedaan maken."
        actions={[
          {
            key: "cancel",
            label: "Annuleren",
            onPress: () => setDeleteConfirmVisible(false),
          },
          {
            key: "confirm",
            label: "Verwijder alles",
            tone: "destructive",
            icon: "delete-forever",
            onPress: () => void handleConfirmDeleteAll(),
          },
        ]}
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={() => void handleConfirmDeleteAll()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  sectionGroup: {
    gap: spacing.sm,
  },
  menuList: {
    gap: spacing.sm,
  },
});
