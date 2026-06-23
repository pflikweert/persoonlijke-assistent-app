import { describe, expect, it } from "vitest";

import {
  buildValidateCompareSections,
  buildValidateObservations,
  mapValidateShortcutToReviewLabel,
  normalizeOutput,
} from "@/src/lib/ai-quality-validate-compare";

describe("ai-quality validate compare helper", () => {
  it("orders narrative, core blocks and summary sections for structured output", () => {
    const baseline = normalizeOutput({
      preferredType: "object",
      rawText: null,
      rawJson: {
        summary: "Kort vandaag.",
        sections: ["Werk", "Thuis"],
        narrativeText: "Vandaag was rustig.",
      },
    });
    const candidate = normalizeOutput({
      preferredType: "object",
      rawText: null,
      rawJson: {
        summary: "Korte samenvatting vandaag.",
        sections: ["Werk", "Thuis", "Wandeling"],
        narrativeText: "Vandaag was rustig en concreter.",
      },
    });

    expect(buildValidateCompareSections({ taskKey: "day_narrative", baseline, candidate }).map((section) => section.label)).toEqual([
      "Verhaaltekst",
      "Kernblokken",
      "Samenvatting",
    ]);
  });

  it("uses week/month narrative labels for period validation output", () => {
    const baseline = normalizeOutput({
      preferredType: "object",
      rawText: null,
      rawJson: {
        summary_text: "Korte week.",
        narrative_text: "Weekverhaal.",
        highlights_json: ["Focus"],
        reflection_points_json: ["Rust"],
      },
    });
    const candidate = normalizeOutput({
      preferredType: "object",
      rawText: null,
      rawJson: {
        summary_text: "Korte week met detail.",
        narrative_text: "Weekverhaal uitgebreider.",
        highlights_json: ["Focus", "Wandeling"],
        reflection_points_json: ["Rust"],
      },
    });

    expect(buildValidateCompareSections({ taskKey: "week_narrative", baseline, candidate }).map((section) => section.label)).toEqual([
      "Verhaaltekst",
      "Highlights",
      "Reflectiepunten",
      "Samenvatting",
    ]);
    expect(buildValidateCompareSections({ taskKey: "month_narrative", baseline, candidate }).map((section) => section.label)).toEqual([
      "Verhaaltekst",
      "Highlights",
      "Reflectiepunten",
      "Samenvatting",
    ]);
  });

  it("builds a single root section for plain text output", () => {
    const baseline = normalizeOutput({
      preferredType: "text",
      rawText: "Oude tekst.",
    });
    const candidate = normalizeOutput({
      preferredType: "text",
      rawText: "Nieuwe tekst met meer detail.",
    });

    expect(buildValidateCompareSections({ taskKey: "day_narrative", baseline, candidate })).toMatchObject([
      {
        key: "__root",
        label: "Verhaaltekst",
        currentText: "Oude tekst.",
        newText: "Nieuwe tekst met meer detail.",
        changed: true,
      },
    ]);
  });

  it("builds a single root section for list output", () => {
    const baseline = normalizeOutput({
      preferredType: "list",
      rawText: "- Eerste\n- Tweede",
    });
    const candidate = normalizeOutput({
      preferredType: "list",
      rawText: "- Eerste\n- Tweede\n- Derde",
    });

    expect(buildValidateCompareSections({ baseline, candidate })[0]).toMatchObject({
      key: "__root",
      label: "Output",
      changed: true,
    });
  });

  it("detects non-normative observations without choosing a review label", () => {
    const sections = [
      {
        key: "narrativeText",
        label: "Verhaaltekst",
        currentText: "Ik liep naar buiten.",
        newText: "Op 12-06 liep Pieter naar buiten, langs de Amstel, en sprak hij met Emma over het project.",
        changed: true,
      },
    ];

    const observations = buildValidateObservations({
      sections,
      inputSnapshotJson: {
        body: "Pieter liep op 12-06 langs de Amstel en sprak met Emma over het project, planning, ontwerp, familie, notities, wandeling en avondeten.",
      },
    });

    expect(observations.map((observation) => observation.label)).toEqual(
      expect.arrayContaining(["uitgebreider", "concreter", "meer brondekking", "1 gewijzigde sectie"])
    );
  });

  it("maps keyboard shortcuts to review labels", () => {
    expect(mapValidateShortcutToReviewLabel("1")).toBe("beter");
    expect(mapValidateShortcutToReviewLabel("2")).toBe("gelijk");
    expect(mapValidateShortcutToReviewLabel("3")).toBe("slechter");
    expect(mapValidateShortcutToReviewLabel("4")).toBe("fout");
    expect(mapValidateShortcutToReviewLabel("5")).toBeNull();
  });
});
