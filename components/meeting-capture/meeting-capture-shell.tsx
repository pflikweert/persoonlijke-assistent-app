import { router } from "expo-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { StyleSheet } from "react-native";

import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import {
  AdminConsoleKeyValue,
  AdminConsoleShell,
  AdminInspectorPanel,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/ui/admin-console-primitives";
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
    <AdminConsoleShell
      title="Gespreksopnames"
      onBack={onBack}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.content}
      inspector={
        <AdminInspectorPanel title="Meeting capture" subtitle="Founder/admin tooling">
          <AdminConsoleKeyValue label="Scope" value="Admin-only" />
          <AdminConsoleKeyValue label="Flow" value="Audio-first" />
          <AdminConsoleKeyValue label="Status" value={adminAccess ? "Toegang actief" : adminAccess === false ? "Geen toegang" : "Controleren"} />
        </AdminInspectorPanel>
      }
    >
      <AdminPageHeader
        eyebrow="Meeting capture"
        title={title}
        subtitle={subtitle}
        chips={
          <>
            {meta.map((item) => <AdminStatusBadge key={item} label={item} tone="neutral" />)}
            {adminAccess ? <AdminStatusBadge label="Toegang" tone="success" /> : null}
          </>
        }
      />

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
          detail="Deze pagina is alleen zichtbaar voor admins met rechten voor gespreksopnames."
        />
      ) : null}

      {adminAccess ? children : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminConsoleShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
});
