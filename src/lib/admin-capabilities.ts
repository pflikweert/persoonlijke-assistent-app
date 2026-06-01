export const ADMIN_CAPABILITIES = [
  "ai_quality_studio",
  "regeneration",
  "meeting_capture",
] as const;

export type AdminCapability = (typeof ADMIN_CAPABILITIES)[number];

export type AdminCapabilityMap = Record<AdminCapability, boolean>;

export const ADMIN_CAPABILITY_LABELS: Record<AdminCapability, string> = {
  ai_quality_studio: "AI Quality Studio",
  regeneration: "Data opnieuw verwerken",
  meeting_capture: "Gespreksopnames",
};

export const ADMIN_CAPABILITY_DESCRIPTIONS: Record<AdminCapability, string> = {
  ai_quality_studio: "Bekijk AI-taken, testversies en logginginstellingen.",
  regeneration: "Herbouw entries, dagjournals en reflecties voor alle gebruikers.",
  meeting_capture: "Gebruik de aparte admin-lane voor gespreksopnames.",
};

export function createEmptyAdminCapabilityMap(): AdminCapabilityMap {
  return {
    ai_quality_studio: false,
    regeneration: false,
    meeting_capture: false,
  };
}

export function normalizeAdminCapabilityMap(
  input: Partial<Record<AdminCapability, boolean>> | null | undefined
): AdminCapabilityMap {
  const base = createEmptyAdminCapabilityMap();

  if (!input) {
    return base;
  }

  return {
    ai_quality_studio: input.ai_quality_studio === true,
    regeneration: input.regeneration === true,
    meeting_capture: input.meeting_capture === true,
  };
}

export function getAdminCapabilityEntries(input: Partial<Record<AdminCapability, boolean>> | null | undefined): {
  capability: AdminCapability;
  label: string;
  description: string;
  enabled: boolean;
}[] {
  const normalized = normalizeAdminCapabilityMap(input);

  return ADMIN_CAPABILITIES.map((capability) => ({
    capability,
    label: ADMIN_CAPABILITY_LABELS[capability],
    description: ADMIN_CAPABILITY_DESCRIPTIONS[capability],
    enabled: normalized[capability],
  }));
}

export function hasAnyAdminCapability(input: Partial<Record<AdminCapability, boolean>> | null | undefined): boolean {
  const normalized = normalizeAdminCapabilityMap(input);
  return ADMIN_CAPABILITIES.some((capability) => normalized[capability]);
}

export function getEnabledAdminCapabilities(
  input: Partial<Record<AdminCapability, boolean>> | null | undefined
): AdminCapability[] {
  const normalized = normalizeAdminCapabilityMap(input);
  return ADMIN_CAPABILITIES.filter((capability) => normalized[capability]);
}
