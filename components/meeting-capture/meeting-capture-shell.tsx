import { router } from "expo-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { StyleSheet } from "react-native";

import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import {
  AdminMetaStrip,
  AdminPageHero,
  AdminShell,
  SettingsTopNav,
} from "@/components/ui/settings-screen-primitives";
import { StateBlock } from "@/components/ui/screen-primitives";
import { classifyUnknownError, hasAdminMeetingCaptureAccess } from "@/services";
import { spacing } from "@/theme";

type MeetingCaptureShellProps = {
  title: string;
  subtitle: string;
  meta?: string[];
  children: ReactNode;
  onBack?: () => void;
};

export function MeetingCaptureShell({
  title,
  subtitle,
  meta = [],
  children,
  onBack = () => router.back(),
}: MeetingCaptureShellProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [adminAccess, setAdminAccess] = useState<boolean | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  const loadAccess = useCallback(async () => {
    setAccessError(null);

    try {
      const allowed = await hasAdminMeetingCaptureAccess();
      setAdminAccess(allowed);
    } catch (error) {
      setAdminAccess(null);
      setAccessError(classifyUnknownError(error).message);
    }
  }, []);

  useEffect(() => {
    void loadAccess();
  }, [loadAccess]);

  return (
    <AdminShell
      fixedHeader={
        <SettingsTopNav
          title="Gespreksopnames"
          onBack={onBack}
          onMenu={() => setMenuVisible(true)}
        />
      }
      contentContainerStyle={styles.content}
    >
      <AdminPageHero title={title} subtitle={subtitle} />
      <AdminMetaStrip items={meta} />

      {adminAccess === null && !accessError ? (
        <StateBlock tone="loading" message="Toegang controleren..." />
      ) : null}

      {accessError ? (
        <StateBlock
          tone="error"
          message="Kon admin-toegang niet controleren."
          detail={accessError}
        />
      ) : null}

      {adminAccess === false ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Deze pagina is alleen zichtbaar voor allowlisted admins."
        />
      ) : null}

      {adminAccess ? children : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
});
