import { describe, expect, it } from "vitest";

import {
  detectPromptAssistLayerWarnings,
  getPromptAssistActionsForLayer,
  normalizePromptAssistPreviewResult,
  resolvePromptAssistActionId,
} from "@/src/lib/aiqs-prompt-assist-review";

describe("aiqs prompt assist review helper", () => {
  it("maps new actions and legacy aliases", () => {
    expect(resolvePromptAssistActionId("review_veld")).toBe("review_veld");
    expect(resolvePromptAssistActionId("compacter")).toBe("maak_compacter");
    expect(resolvePromptAssistActionId("ontdubbelen")).toBe("ontdubbel_lagen");
    expect(resolvePromptAssistActionId("verplaats_naar_juiste_laag")).toBe("check_laagdiscipline");
    expect(resolvePromptAssistActionId("verdeel_over_velden")).toBe("verdeel_over_velden");
    expect(resolvePromptAssistActionId("bestaat_niet")).toBeNull();
  });

  it("limits task-goal action to the general layer", () => {
    expect(getPromptAssistActionsForLayer("general").map((action) => action.id)).toContain("verbeter_taakdoel");
    expect(getPromptAssistActionsForLayer("general").map((action) => action.id)).toContain("verdeel_over_velden");
    expect(getPromptAssistActionsForLayer("field").map((action) => action.id)).not.toContain("verbeter_taakdoel");
    expect(getPromptAssistActionsForLayer("system").map((action) => action.id)).not.toContain("verbeter_taakdoel");
  });

  it("detects architecture language and missing task goal in general instructions", () => {
    expect(
      detectPromptAssistLayerWarnings({
        layerType: "general",
        layerKey: "generalInstruction",
        label: "Algemene instructie",
        text: "Verdeel alleen taakbrede instructies over de bewerkbare velden en houd strikte laagdiscipline aan.",
      })
    ).toEqual(
      expect.arrayContaining([
        "Deze algemene instructie bevat promptarchitectuur of laagdiscipline; zet hier liever het taakdoel.",
        "Het taakdoel lijkt nog niet concreet genoeg voor het model.",
      ])
    );
  });

  it("detects field layers that reference other output fields or system contracts", () => {
    expect(
      detectPromptAssistLayerWarnings({
        layerType: "field",
        layerKey: "narrativeInstruction",
        label: "Dagverhaal",
        text: "Schrijf narrativeText en bewaak ook summary en sections. Output moet JSON volgens schema zijn.",
      })
    ).toEqual(
      expect.arrayContaining([
        "Deze veldlaag bevat system- of contractregels; die horen meestal in Systeemregels.",
        "Deze veldlaag verwijst naar andere outputvelden; houd deze laag veldspecifiek.",
      ])
    );
  });

  it("detects field-specific system instructions", () => {
    expect(
      detectPromptAssistLayerWarnings({
        layerType: "system",
        layerKey: "systemRulesInstruction",
        label: "Systeemregels",
        text: "Gebruik alleen brondata. De samenvatting is maximaal twee zinnen en het dagverhaal heeft warme toon.",
      })
    ).toContain("Deze systeemlaag lijkt veldspecifiek; zet veldregels liever in de juiste veldlaag.");
  });

  it("normalizes new JSON response shape while preserving preview compatibility", () => {
    const normalized = normalizePromptAssistPreviewResult({
      targetLayerType: "general",
      targetLayerKey: "generalInstruction",
      assistActionId: "verbeter_taakdoel",
      beforeText: "Oude tekst",
      raw: {
        diagnosis: "Taakdoel ontbreekt.",
        issues: ["Bevat vooral architectuurtaal."],
        suggested_text: "Maak van dagentries één samenhangende dagweergave.",
        why: ["Dit beschrijft de gewenste output."],
        layer_fit: {
          current_layer: "general",
          fits_layer: false,
          better_layer: null,
          reason: "General mist taakdoel.",
        },
        risk_level: "medium",
      },
    });

    expect(normalized).toMatchObject({
      diagnosis: "Taakdoel ontbreekt.",
      analysisSummary: "Taakdoel ontbreekt.",
      suggestedText: "Maak van dagentries één samenhangende dagweergave.",
      proposedText: "Maak van dagentries één samenhangende dagweergave.",
      why: ["Dit beschrijft de gewenste output."],
      riskLevel: "medium",
      layerFit: {
        currentLayer: "general",
        fitsLayer: false,
        betterLayer: null,
        reason: "General mist taakdoel.",
      },
      diff: {
        before: "Oude tekst",
        after: "Maak van dagentries één samenhangende dagweergave.",
      },
    });
  });

  it("normalizes all-layer proposals for multi-field apply", () => {
    const normalized = normalizePromptAssistPreviewResult({
      targetLayerType: "general",
      targetLayerKey: "generalInstruction",
      assistActionId: "verdeel_over_velden",
      beforeText: "Oude taakdoeltekst",
      raw: {
        diagnosis: "Alle lagen gecontroleerd.",
        suggested_text: "Nieuw taakdoel.",
        why: ["Systemregels blijven high precedence."],
        risk_level: "low",
        proposedSections: {
          systemRulesInstruction: "Behoud JSON-contract.",
          generalInstruction: "Nieuw taakdoel.",
          narrativeInstruction: "Schrijf alleen het dagverhaal.",
        },
        sectionReasons: {
          generalInstruction: "Dit is het taakdoel.",
        },
        sectionRisks: {
          narrativeInstruction: ["Controleer overlap met summary."],
        },
        preservedInvariants: ["json_contract"],
      },
    });

    expect(normalized.proposedSections).toMatchObject({
      systemRulesInstruction: "Behoud JSON-contract.",
      generalInstruction: "Nieuw taakdoel.",
      narrativeInstruction: "Schrijf alleen het dagverhaal.",
    });
    expect(normalized.sectionReasons?.generalInstruction).toBe("Dit is het taakdoel.");
    expect(normalized.sectionRisks?.narrativeInstruction).toEqual(["Controleer overlap met summary."]);
    expect(normalized.preservedInvariants).toEqual(["json_contract"]);
    expect(normalized.changeSummary).toBe("Voorstel kan meerdere lagen bijwerken.");
  });
});
