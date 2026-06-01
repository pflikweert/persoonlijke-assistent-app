import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MetaText, StateBlock, SurfaceSection } from "@/components/ui/screen-primitives";
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
      <SurfaceSection title="Gebruikers">
        <StateBlock
          tone="empty"
          message="Nog geen gebruikers gevonden."
          detail="Zodra iemand een account heeft, kun je hier admingebieden toekennen."
        />
      </SurfaceSection>
    );
  }

  return (
    <SurfaceSection title="Gebruikers" subtitle="Founder-only beheer van rechten per admingebied.">
      <ThemedView style={styles.list}>
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
              <ThemedView style={styles.header}>
                <ThemedView style={styles.headerCopy}>
                  <ThemedText type="defaultSemiBold">
                    {user.displayName || user.email || user.userId}
                  </ThemedText>
                  {user.email ? <MetaText>{user.email}</MetaText> : null}
                  <MetaText>{formatCapabilitySummary(user)}</MetaText>
                  {isSelf ? <MetaText>Dit ben jij.</MetaText> : null}
                </ThemedView>

                <ThemedView
                  style={[
                    styles.badge,
                    {
                      backgroundColor: user.isFounder ? palette.surfaceHigh : palette.surface,
                      borderColor: palette.separator,
                    },
                  ]}
                >
                  <ThemedText type="bodySecondary" style={styles.badgeText}>
                    {user.isFounder ? "Founder" : "Gebruiker"}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

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
                      <ThemedText type="defaultSemiBold">{entry.label}</ThemedText>
                      <MetaText>{entry.description}</MetaText>
                      <MetaText>{entry.enabled ? "Actief" : "Uit"}</MetaText>
                    </Pressable>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
          );
        })}
      </ThemedView>
    </SurfaceSection>
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
  badge: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: 12,
  },
  capabilityList: {
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
