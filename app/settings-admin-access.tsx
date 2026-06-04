import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AdminAccessManager } from "@/components/admin/admin-access-manager";
import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedView } from "@/components/themed-view";
import {
  AdminConsoleKeyValue,
  AdminConsoleShell,
  AdminMetricCard,
  AdminMetricGrid,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/ui/admin-console-primitives";
import { MetaText, StateBlock } from "@/components/ui/screen-primitives";
import {
  classifyUnknownError,
  fetchMyAdminAccess,
  listAdminManagedUsers,
  updateAdminUserCapabilities,
} from "@/services";
import {
  getEnabledAdminCapabilities,
  normalizeAdminCapabilityMap,
  type AdminCapability,
} from "@/src/lib/admin-capabilities";
import type { AdminAccessState, AdminManagedUserSummary } from "@/types";
import { spacing } from "@/theme";

export default function SettingsAdminAccessScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState<AdminAccessState | null>(null);
  const [users, setUsers] = useState<AdminManagedUserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextAccess = await fetchMyAdminAccess();
      setAccess(nextAccess);

      if (!nextAccess.isFounder) {
        setUsers([]);
        return;
      }

      const nextUsers = await listAdminManagedUsers();
      setUsers(nextUsers);

      if (nextAccess.usedLegacyBootstrap) {
        setNotice(
          "De eerste founder is vanuit de oude allowlist overgenomen. Nieuwe adminrechten lopen nu via de database."
        );
      } else {
        setNotice(null);
      }
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
      setUsers([]);
      setAccess(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const metaItems = useMemo(() => {
    if (!access?.isFounder) {
      return ["Founder-only"];
    }

    const admins = users.filter((user) => user.isFounder || getEnabledAdminCapabilities(user.capabilities).length > 0);
    return ["Founder-only", `${admins.length} admingebruikers`, `${users.length} accounts zichtbaar`];
  }, [access, users]);

  const adminCount = useMemo(
    () => users.filter((user) => user.isFounder || getEnabledAdminCapabilities(user.capabilities).length > 0).length,
    [users]
  );

  const handleToggleCapability = useCallback(
    async (input: {
      userId: string;
      capability: AdminCapability;
      nextEnabled: boolean;
    }) => {
      const target = users.find((user) => user.userId === input.userId);
      if (!target || target.isFounder) {
        return;
      }

      setSavingUserId(input.userId);
      setError(null);

      try {
        const nextCapabilities = normalizeAdminCapabilityMap({
          ...target.capabilities,
          [input.capability]: input.nextEnabled,
        });

        const nextUsers = await updateAdminUserCapabilities({
          userId: input.userId,
          capabilities: getEnabledAdminCapabilities(nextCapabilities),
        });

        setUsers(nextUsers);
        const actionLabel = input.nextEnabled ? "toegevoegd aan" : "verwijderd uit";
        setNotice(`Recht ${actionLabel} ${target.displayName || target.email || "de gebruiker"}.`);
      } catch (nextError) {
        setError(classifyUnknownError(nextError).message);
      } finally {
        setSavingUserId(null);
      }
    },
    [users]
  );

  return (
    <AdminConsoleShell
      title="Adminrechten"
      onBack={() => router.back()}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={{ paddingBottom: spacing.xxxl, gap: spacing.content }}
      inspector={
        <ThemedView style={{ gap: spacing.sm }}>
          <AdminConsoleKeyValue label="Scope" value="Founder-only" />
          <AdminConsoleKeyValue label="Bron" value="Database grants" />
          <AdminConsoleKeyValue label="Fallback" value={access?.usedLegacyBootstrap ? "Legacy bootstrap actief" : "Niet actief"} />
        </ThemedView>
      }
    >
      <AdminPageHeader
        eyebrow="Access control"
        title="Adminrechten beheren"
        subtitle="Founder-only beheer van toegang per admingebied."
        chips={
          <>
            <AdminStatusBadge label="Founder-only" tone="info" />
            {access?.isFounder ? <AdminStatusBadge label="Toegang" tone="success" /> : null}
          </>
        }
      />

      {access?.isFounder ? (
        <AdminMetricGrid>
          <AdminMetricCard label="Admingebruikers" value={adminCount} meta="Founder of capability grant" tone="success" />
          <AdminMetricCard label="Accounts zichtbaar" value={users.length} meta="Voor beheer" />
          <AdminMetricCard label="Mode" value="DB" meta={metaItems.join(" · ")} tone="info" />
        </AdminMetricGrid>
      ) : null}

      {loading ? <StateBlock tone="loading" message="Adminrechten laden..." /> : null}

      {error ? (
        <StateBlock tone="error" message="Kon adminrechten niet laden." detail={error} />
      ) : null}

      {notice ? <StateBlock tone="info" message="Bijgewerkt" detail={notice} /> : null}

      {access && !access.isFounder ? (
        <StateBlock
          tone="info"
          message="Geen toegang"
          detail="Alleen founders mogen adminrechten beheren."
        />
      ) : null}

      {access?.isFounder ? (
        <>
          <MetaText>Rechten werken per gebied. Founder-status staat bewust los van gewone capability-grants.</MetaText>
          <AdminAccessManager
            users={users}
            currentUserId={access.userId}
            savingUserId={savingUserId}
            onToggleCapability={handleToggleCapability}
          />
        </>
      ) : null}

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </AdminConsoleShell>
  );
}
