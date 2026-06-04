import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  AdminDenseRow,
  AdminEmptyState,
  AdminList,
  AdminPanel,
  AdminStatusBadge,
} from "@/components/ui/admin-console-primitives";
import { MetaText, StateBlock } from "@/components/ui/screen-primitives";
import {
  ADMIN_CAPABILITY_LABELS,
  getAdminCapabilityEntries,
  getEnabledAdminCapabilities,
  type AdminCapability,
} from "@/src/lib/admin-capabilities";
import type { AdminManagedUserSummary } from "@/types";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, radius, spacing } from "@/theme";

type AdminAccessManagerProps = {
  users: AdminManagedUserSummary[];
  currentUserId: string | null;
  savingUserId: string | null;
  onToggleCapability: (input: {
    userId: string;
    capability: AdminCapability;
    nextEnabled: boolean;
  }) => void;
};

function formatCapabilitySummary(user: AdminManagedUserSummary): string {
  if (user.isFounder) {
    return "Founder heeft altijd toegang tot alle admingebieden.";
  }

  const enabled = getEnabledAdminCapabilities(user.capabilities).map(
    (capability) => ADMIN_CAPABILITY_LABELS[capability]
  );

  if (enabled.length === 0) {
    return "Nog geen extra adminrechten.";
  }

  return enabled.join(" · ");
}

export function AdminAccessManager({
  users,
  currentUserId,
  savingUserId,
  onToggleCapability,
}: AdminAccessManagerProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  if (users.length === 0) {
    return (
      <AdminPanel title="Gebruikers">
        <AdminEmptyState
          message="Nog geen gebruikers gevonden."
          detail="Zodra iemand een account heeft, kun je hier admingebieden toekennen."
        />
      </AdminPanel>
    );
  }

  return (
    <AdminPanel title="Gebruikers" subtitle="Founder-only beheer van rechten per admingebied.">
      <AdminList>
        {users.map((user) => {
          const capabilityEntries = getAdminCapabilityEntries(user.capabilities);
          const isSaving = savingUserId === user.userId;
          const isSelf = currentUserId === user.userId;

          return (
            <ThemedView
              key={user.userId}
              style={[
                styles.card,
                {
                  backgroundColor: palette.surfaceLow,
                  borderColor: palette.separator,
                },
              ]}
            >
              <AdminDenseRow
                title={user.displayName || user.email || user.userId}
                subtitle={user.email}
                meta={[formatCapabilitySummary(user), isSelf ? "Dit ben jij." : null].filter(Boolean).join(" · ")}
                chips={
                  <>
                    <AdminStatusBadge label={user.isFounder ? "Founder" : "Gebruiker"} tone={user.isFounder ? "success" : "neutral"} />
                    {isSaving ? <AdminStatusBadge label="Opslaan" tone="info" /> : null}
                  </>
                }
              />

              {user.isFounder ? (
                <StateBlock
                  tone="info"
                  message="Founder-rechten lopen buiten deze editor."
                  detail="Founder-status blijft bewust apart van gewone capability-grants."
                />
              ) : (
                <ThemedView style={styles.capabilityList}>
                  {capabilityEntries.map((entry) => (
                    <Pressable
                      key={entry.capability}
                      accessibilityRole="button"
                      accessibilityLabel={`${entry.label} ${entry.enabled ? "uitzetten" : "aanzetten"}`}
                      onPress={() =>
                        onToggleCapability({
                          userId: user.userId,
                          capability: entry.capability,
                          nextEnabled: !entry.enabled,
                        })
                      }
                      disabled={isSaving}
                      style={[
                        styles.capabilityChip,
                        {
                          backgroundColor: entry.enabled ? palette.surfaceHigh : palette.surface,
                          borderColor: entry.enabled ? palette.primaryStrong : palette.separator,
                          opacity: isSaving ? 0.65 : 1,
                        },
                      ]}
                    >
                      <ThemedView style={styles.capabilityHeader}>
                        <ThemedText type="defaultSemiBold">{entry.label}</ThemedText>
                        <AdminStatusBadge label={entry.enabled ? "Actief" : "Uit"} tone={entry.enabled ? "success" : "neutral"} />
                      </ThemedView>
                      <MetaText>{entry.description}</MetaText>
                    </Pressable>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
          );
        })}
      </AdminList>
    </AdminPanel>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  capabilityList: {
    gap: spacing.sm,
  },
  capabilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  capabilityChip: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
});
