import { describe, expect, it } from "vitest";

import {
  getSettingsBackTarget,
  getSettingsMenuTarget,
  normalizeAppPath,
} from "@/src/lib/navigation/settings-navigation";

describe("settings navigation contract", () => {
  it("normalizes app paths from web/native-like inputs", () => {
    expect(normalizeAppPath("settings-ai-quality-studio?x=1#section")).toBe("/settings-ai-quality-studio");
    expect(normalizeAppPath("/settings/")).toBe("/settings");
    expect(normalizeAppPath("")).toBe("/");
  });

  it("routes menu settings to settings home unless already there", () => {
    expect(getSettingsMenuTarget("/settings-ai-quality-studio/day_narrative")).toBe("/settings");
    expect(getSettingsMenuTarget("/settings-regeneration")).toBe("/settings");
    expect(getSettingsMenuTarget("/settings")).toBeNull();
  });

  it("routes first-level settings and admin back to settings home", () => {
    expect(getSettingsBackTarget("/settings-audio")).toBe("/settings");
    expect(getSettingsBackTarget("/settings-admin-access")).toBe("/settings");
    expect(getSettingsBackTarget("/settings-regeneration")).toBe("/settings");
    expect(getSettingsBackTarget("/settings-ai-quality-studio")).toBe("/settings");
    expect(getSettingsBackTarget("/meeting-capture")).toBe("/settings");
  });

  it("routes AIQS deep flows to their logical parent", () => {
    expect(getSettingsBackTarget("/settings-ai-quality-studio/group/day_journal")).toBe("/settings-ai-quality-studio");
    expect(getSettingsBackTarget("/settings-ai-quality-studio/day_narrative")).toBe("/settings-ai-quality-studio");
    expect(getSettingsBackTarget("/settings-ai-quality-studio/day_narrative/draft/version-1")).toBe(
      "/settings-ai-quality-studio/day_narrative"
    );
    expect(getSettingsBackTarget("/settings-ai-quality-studio/day_narrative/test/version-1")).toBe(
      "/settings-ai-quality-studio/day_narrative"
    );
    expect(getSettingsBackTarget("/settings-ai-quality-studio/day_narrative/validate/version-1")).toBe(
      "/settings-ai-quality-studio/day_narrative"
    );
  });

  it("routes meeting capture deep flows to meeting capture home", () => {
    expect(getSettingsBackTarget("/meeting-capture/new")).toBe("/meeting-capture");
    expect(getSettingsBackTarget("/meeting-capture/meeting-1")).toBe("/meeting-capture");
  });
});
