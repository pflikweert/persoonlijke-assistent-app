import type {
  AiPromptAssistActionDefinition,
  AiPromptAssistActionId,
  AiPromptAssistIssue,
  AiPromptAssistLayerFit,
  AiPromptAssistPreviewResult,
  AiPromptAssistRiskLevel,
  AiPromptAssistTargetLayerType,
} from "@/types";

export const AIQS_PROMPT_ASSIST_ACTIONS: AiPromptAssistActionDefinition[] = [
  {
    id: "review_veld",
    label: "Review dit veld",
    helper: "Beoordeel deze laag en geef een veilig voorstel.",
    order: 1,
    placement: "primary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
  {
    id: "verbeter_taakdoel",
    label: "Verbeter taakdoel",
    helper: "Maak het taakdoel concreter en uitvoerbaar.",
    order: 2,
    placement: "primary",
    allowedTargetLayerTypes: ["general"],
  },
  {
    id: "ontdubbel_lagen",
    label: "Ontdubbel met andere lagen",
    helper: "Verwijder overlap met sibling-lagen zonder regels te verplaatsen.",
    order: 3,
    placement: "primary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
  {
    id: "maak_compacter",
    label: "Maak compacter",
    helper: "Korter zonder betekenisverlies.",
    order: 4,
    placement: "primary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
  {
    id: "maak_concreter",
    label: "Maak concreter",
    helper: "Maak de instructie minder vaag en beter uitvoerbaar.",
    order: 5,
    placement: "primary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
  {
    id: "check_laagdiscipline",
    label: "Check laagdiscipline",
    helper: "Controleer of de tekst in deze laag thuishoort.",
    order: 6,
    placement: "secondary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
  {
    id: "schrijf_voorstel",
    label: "Schrijf voorstel voor deze laag",
    helper: "Schrijf een nieuw voorstel voor alleen deze laag.",
    order: 7,
    placement: "secondary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
  {
    id: "leg_uit_wat_hoort",
    label: "Leg uit wat hier hoort",
    helper: "Leg kort uit wat deze laag hoort te bevatten.",
    order: 8,
    placement: "secondary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
  {
    id: "verdeel_over_velden",
    label: "Controleer alle lagen",
    helper: "Controleer alle promptlagen en zet regels waar nodig goed per veld.",
    order: 9,
    placement: "secondary",
    allowedTargetLayerTypes: ["system", "general", "field"],
  },
];

export const LEGACY_PROMPT_ASSIST_ACTION_ALIASES: Record<string, AiPromptAssistActionId> = {
  compacter: "maak_compacter",
  ontdubbelen: "ontdubbel_lagen",
  verhelderen: "maak_concreter",
  check_contract: "review_veld",
  check_overlap: "ontdubbel_lagen",
  verplaats_naar_juiste_laag: "check_laagdiscipline",
  maak_strikter: "maak_concreter",
  check_outputvorm: "review_veld",
};

export function resolvePromptAssistActionId(value: string | null | undefined): AiPromptAssistActionId | null {
  if (!value) return null;
  if (AIQS_PROMPT_ASSIST_ACTIONS.some((action) => action.id === value)) {
    return value as AiPromptAssistActionId;
  }
  return LEGACY_PROMPT_ASSIST_ACTION_ALIASES[value] ?? null;
}

export function getPromptAssistActionsForLayer(
  layerType: AiPromptAssistTargetLayerType
): AiPromptAssistActionDefinition[] {
  return AIQS_PROMPT_ASSIST_ACTIONS.filter((action) => action.allowedTargetLayerTypes.includes(layerType)).sort(
    (a, b) => a.order - b.order
  );
}

export type PromptAssistLayerRuleInfo = {
  label: string;
  buttonLabel: string;
  badgeLabel: string;
  hintText: string;
  assistContextMessage: string;
  belongsHere: string[];
  doesNotBelongHere: string[];
  isHighPrecedence: boolean;
};

export function getPromptAssistLayerRuleInfo(
  layerType: AiPromptAssistTargetLayerType,
  label: string
): PromptAssistLayerRuleInfo {
  if (layerType === "system") {
    return {
      label,
      buttonLabel: "Review harde grenzen",
      badgeLabel: "Systeemlaag",
      hintText: "Harde grenzen: contract, brongebruik, outputvorm en regels die altijd gelden.",
      assistContextMessage: `Je reviewt de systeemlaag (${label}). Bewaak harde grenzen, contractregels en runtime-instructies.`,
      belongsHere: [
        "harde grenzen",
        "contractregels",
        "brongebruik dat altijd geldt",
        "output-format verplichtingen",
        "veiligheids- en runtime-instructies",
      ],
      doesNotBelongHere: [
        "stijlvoorkeuren voor één veld",
        "uitgebreide taakbeschrijving",
        "veldspecifieke details",
        "voorbeelden die alleen bij één veld horen",
      ],
      isHighPrecedence: true,
    };
  }

  if (layerType === "general") {
    return {
      label,
      buttonLabel: "Review taakdoel",
      badgeLabel: "Taakdoel",
      hintText: "Het overkoepelende taakdoel en de globale manier van werken.",
      assistContextMessage: `Je reviewt de algemene instructie (${label}). Bewaak taakdoel, prioriteiten en globale werkwijze.`,
      belongsHere: [
        "overkoepelend taakdoel",
        "wat de prompt als geheel moet opleveren",
        "globale manier van werken",
        "prioriteiten tussen volledigheid, brontrouw, bundeling, toon en structuur",
      ],
      doesNotBelongHere: [
        "uitleg over promptarchitectuur",
        "technische laagdiscipline",
        "output schema",
        "veldspecifieke instructies",
        "herhaling van system-regels",
      ],
      isHighPrecedence: false,
    };
  }

  return {
    label,
    buttonLabel: "Review veldregels",
    badgeLabel: "Veldlaag",
    hintText: "Alleen regels voor dit outputveld: lengte, toon, structuur en inhoud.",
    assistContextMessage: `Je reviewt de veldlaag (${label}). Bewaak regels voor alleen dit outputveld.`,
    belongsHere: [
      "regels voor één outputveld",
      "lengte, toon, structuur en inhoud voor dat veld",
      "veldspecifieke uitzonderingen",
      "veldspecifieke kwaliteitscriteria",
    ],
    doesNotBelongHere: [
      "algemene contractregels",
      "regels voor andere velden",
      "globale brongebruikregels",
      "system- of schema-instructies",
    ],
    isHighPrecedence: false,
  };
}

type LayerWarningInput = {
  layerType: AiPromptAssistTargetLayerType;
  layerKey: string;
  label: string;
  text: string;
  siblingTexts?: Record<string, string>;
};

const ARCHITECTURE_LANGUAGE_PATTERN =
  /laagdiscipline|bewerkbare velden|promptarchitectuur|verdeel.*velden|system(?:laag)?|general(?:laag)?|field(?:laag)?|systeemregels|veldlaag/i;
const TASK_GOAL_PATTERN =
  /maak|schrijf|normaliseer|bundel|vat|samenvat|reflecteer|genereer|lever|geef|vorm|bouw|zet|behoud|voorkom/i;
const SYSTEM_CONTRACT_PATTERN =
  /json|schema|response_format|contract|geen tekst buiten|alleen opgegeven bron|runtime|output[- ]?format/i;

export function detectPromptAssistLayerWarnings(input: LayerWarningInput): string[] {
  const text = input.text.trim();
  if (!text) return [];
  const warnings: string[] = [];

  if (input.layerType === "general" && ARCHITECTURE_LANGUAGE_PATTERN.test(text)) {
    warnings.push("Deze algemene instructie bevat promptarchitectuur of laagdiscipline; zet hier liever het taakdoel.");
  }

  if (input.layerType === "general" && !TASK_GOAL_PATTERN.test(text)) {
    warnings.push("Het taakdoel lijkt nog niet concreet genoeg voor het model.");
  }

  if (input.layerType === "field" && SYSTEM_CONTRACT_PATTERN.test(text)) {
    warnings.push("Deze veldlaag bevat system- of contractregels; die horen meestal in Systeemregels.");
  }

  if (input.layerType === "system" && referencesSpecificField(text, input.label)) {
    warnings.push("Deze systeemlaag lijkt veldspecifiek; zet veldregels liever in de juiste veldlaag.");
  }

  if (input.layerType === "field" && referencesOtherOutputFields(text, input.layerKey, input.label)) {
    warnings.push("Deze veldlaag verwijst naar andere outputvelden; houd deze laag veldspecifiek.");
  }

  const duplicatedWithSibling = Object.entries(input.siblingTexts ?? {}).some(([, sibling]) => {
    const current = normalizeComparableText(text);
    const other = normalizeComparableText(sibling);
    return current.length > 40 && current === other;
  });
  if (duplicatedWithSibling) {
    warnings.push("Deze laag lijkt dubbele tekst uit een andere laag te bevatten.");
  }

  return Array.from(new Set(warnings));
}

function referencesSpecificField(text: string, currentLabel: string): boolean {
  const lowered = text.toLowerCase();
  const fieldWords = ["titel", "body", "summary", "samenvatting", "dagverhaal", "secties", "highlights", "reflectiepunten"];
  return fieldWords.some((field) => field !== currentLabel.toLowerCase() && lowered.includes(field));
}

function referencesOtherOutputFields(text: string, currentKey: string, currentLabel: string): boolean {
  const lowered = text.toLowerCase();
  const currentTokens = [currentKey.toLowerCase(), currentLabel.toLowerCase()];
  const fields = [
    "title",
    "titel",
    "body",
    "summary_short",
    "summary",
    "samenvatting",
    "narrativetext",
    "dagverhaal",
    "sections",
    "secties",
    "summarytext",
    "highlights",
    "reflectionpoints",
    "reflectiepunten",
  ];
  return fields.some((field) => !currentTokens.some((token) => token.includes(field)) && lowered.includes(field));
}

function normalizeComparableText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function stringArrayFromUnknown(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

function parseLayerFit(value: unknown, currentLayer: AiPromptAssistTargetLayerType): AiPromptAssistLayerFit {
  const source = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  const betterLayer = source.better_layer;
  return {
    currentLayer:
      source.current_layer === "system" || source.current_layer === "general" || source.current_layer === "field"
        ? source.current_layer
        : currentLayer,
    fitsLayer: typeof source.fits_layer === "boolean" ? source.fits_layer : true,
    betterLayer:
      betterLayer === "system" || betterLayer === "general" || betterLayer === "field" ? betterLayer : null,
    reason: typeof source.reason === "string" ? source.reason.trim() : "",
  };
}

function parseRiskLevel(value: unknown): AiPromptAssistRiskLevel {
  if (value === "low" || value === "medium" || value === "high") return value;
  return "low";
}

export function normalizePromptAssistPreviewResult(args: {
  raw: Record<string, unknown>;
  targetLayerType: AiPromptAssistTargetLayerType;
  targetLayerKey: string;
  assistActionId: AiPromptAssistActionId;
  beforeText: string;
}): Omit<AiPromptAssistPreviewResult, "openAiObjectId"> {
  const diagnosis =
    typeof args.raw.diagnosis === "string" && args.raw.diagnosis.trim().length > 0
      ? args.raw.diagnosis.trim()
      : typeof args.raw.analysisSummary === "string"
        ? args.raw.analysisSummary.trim()
        : "Laag beoordeeld op taakdoel, overlap en laagdiscipline.";
  const suggestedText =
    typeof args.raw.suggested_text === "string" && args.raw.suggested_text.trim().length > 0
      ? args.raw.suggested_text.trim()
      : typeof args.raw.proposedText === "string"
        ? args.raw.proposedText.trim()
        : args.beforeText;
  const why = stringArrayFromUnknown(args.raw.why);
  const issues = stringArrayFromUnknown(args.raw.issues);
  const layerFit = parseLayerFit(args.raw.layer_fit, args.targetLayerType);
  const riskLevel = parseRiskLevel(args.raw.risk_level);
  const proposedSections = parseStringRecord(args.raw.proposedSections);
  const sectionReasons = parseStringRecord(args.raw.sectionReasons);
  const sectionRisks = parseStringArrayRecord(args.raw.sectionRisks);
  const preservedInvariants = stringArrayFromUnknown(args.raw.preservedInvariants);

  const legacyIssues: AiPromptAssistIssue[] = issues.map((message) => ({
    severity: riskLevel === "high" ? "risk" : riskLevel === "medium" ? "warning" : "info",
    type: layerFit.fitsLayer ? "conflict" : "misplaced",
    message,
  }));

  return {
    targetLayerType: args.targetLayerType,
    targetLayerKey: args.targetLayerKey,
    assistActionId: args.assistActionId,
    diagnosis,
    suggestedText,
    why,
    layerFit,
    riskLevel,
    analysisSummary: diagnosis,
    issues: legacyIssues,
    proposedText: suggestedText,
    proposedSections,
    sectionReasons,
    sectionRisks,
    changeSummary:
      typeof args.raw.changeSummary === "string" && args.raw.changeSummary.trim().length > 0
        ? args.raw.changeSummary.trim()
        : suggestedText === args.beforeText
          ? proposedSections
            ? "Alle lagen gecontroleerd; geen directe tekstwijziging voor de huidige laag."
            : "Geen directe tekstwijziging voorgesteld."
          : args.assistActionId === "verdeel_over_velden"
            ? "Voorstel kan meerdere lagen bijwerken."
            : "Voorstel beperkt tot de huidige laag.",
    rationale: why.length > 0 ? why.join("\n") : null,
    preservedInvariants,
    detectedRisks: stringArrayFromUnknown(args.raw.detectedRisks),
    diff: {
      before: args.beforeText,
      after: suggestedText,
    },
  };
}

function parseStringRecord(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, item]) => [key, typeof item === "string" ? item : ""] as const)
    .filter(([key]) => key.trim().length > 0);
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function parseStringArrayRecord(value: unknown): Record<string, string[]> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, item]) => [key, stringArrayFromUnknown(item)] as const)
    .filter(([key]) => key.trim().length > 0);
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
