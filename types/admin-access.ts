import type { AdminCapability, AdminCapabilityMap } from "@/src/lib/admin-capabilities";

export type AdminAccessState = {
  userId: string;
  isFounder: boolean;
  canAccessAdminMenu: boolean;
  usedLegacyBootstrap: boolean;
  capabilities: AdminCapabilityMap;
};

export type AdminManagedUserSummary = {
  userId: string;
  email: string | null;
  displayName: string | null;
  isFounder: boolean;
  createdAt: string | null;
  lastSignInAt: string | null;
  capabilities: AdminCapabilityMap;
};

export type UpdateAdminUserCapabilitiesPayload = {
  userId: string;
  capabilities: AdminCapability[];
};
