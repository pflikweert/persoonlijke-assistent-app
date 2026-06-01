import { describe, expect, it } from "vitest";

import {
  ADMIN_CAPABILITY_LABELS,
  createEmptyAdminCapabilityMap,
  getAdminCapabilityEntries,
  getEnabledAdminCapabilities,
  hasAnyAdminCapability,
  normalizeAdminCapabilityMap,
} from "@/src/lib/admin-capabilities";

describe("admin capability helpers", () => {
  it("returns a fully disabled empty map by default", () => {
    expect(createEmptyAdminCapabilityMap()).toEqual({
      ai_quality_studio: false,
      regeneration: false,
      meeting_capture: false,
    });
  });

  it("normalizes partial capability state safely", () => {
    expect(
      normalizeAdminCapabilityMap({
        ai_quality_studio: true,
      })
    ).toEqual({
      ai_quality_studio: true,
      regeneration: false,
      meeting_capture: false,
    });
  });

  it("builds ordered capability entries with labels and descriptions", () => {
    const entries = getAdminCapabilityEntries({
      meeting_capture: true,
    });

    expect(entries.map((entry) => entry.capability)).toEqual([
      "ai_quality_studio",
      "regeneration",
      "meeting_capture",
    ]);
    expect(entries[0]?.label).toBe(ADMIN_CAPABILITY_LABELS.ai_quality_studio);
    expect(entries[2]?.enabled).toBe(true);
  });

  it("detects whether any admin capability is enabled", () => {
    expect(hasAnyAdminCapability(null)).toBe(false);
    expect(hasAnyAdminCapability({ regeneration: true })).toBe(true);
  });

  it("returns the enabled capabilities in canonical order", () => {
    expect(
      getEnabledAdminCapabilities({
        meeting_capture: true,
        ai_quality_studio: true,
      })
    ).toEqual(["ai_quality_studio", "meeting_capture"]);
  });
});
