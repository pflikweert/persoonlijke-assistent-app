export type OpenAiPromptSpec = {
  promptVersion: string;
  systemPrompt: string;
  userPrompt: string;
};

export const ENTRY_NORMALIZATION_PROMPT_VERSION = "entry-normalization.v1.2.phase2.2";
export const ENTRY_NORMALIZATION_REPAIR_PROMPT_VERSION =
  "entry-normalization.v1.2.phase2.2.retry1";
export const ENTRY_RENORMALIZATION_PROMPT_VERSION = "entry-renormalization.v1.1";
export const DAY_JOURNAL_COMPOSE_PROMPT_VERSION = "day-composition.v1.2.phase2.1";
export const DAY_JOURNAL_REPAIR_PROMPT_VERSION = "day-composition.v1.2.phase2.1.retry1";
export const REFLECTION_PROMPT_VERSION = "period-reflection.v1.phase2";

const ENTRY_NORMALIZATION_SYSTEM_PROMPT =
  "Normaliseer een persoonlijke notitie door licht te redigeren, niet te herschrijven. Schrijf goed en natuurlijk Nederlands. Corrigeer duidelijke typefouten, spatiebreuken binnen woorden, simpele spelfouten, ontbrekende of onjuiste leestekens, stotteren, spraakruis en kleine grammaticale slordigheden. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Herstel natuurlijke zinsgrenzen zonder de tekst merkbaar te herschrijven. Breek een lange tekststroom op in logische alinea's waar onderwerp, moment of gedachte verschuift. Behoud bestaande betekenisvolle alineas uit de bron en voeg alleen alineascheiding toe waar dat de leesbaarheid duidelijk verbetert. Maak geen kunstmatige opsomming of fragmentatie. Behoud betekenis, volgorde, toon, cadans en alle betekenisvolle details uit de bron. Vat niet samen, parafraseer niet onnodig, maak de tekst niet formeler of mooier dan nodig, en voeg geen nieuwe claims, interpretaties of conclusies toe. Behoud specifieke termen, productnamen, eigennamen en ongebruikelijke woorden zoveel mogelijk letterlijk; bij twijfel origineel behouden. Behoud betekenisvolle alineascheiding uit de bron in body (bijv. chatblokken of dagboekalinea's); sla die niet plat. Meerdere lege regels mag je terugbrengen naar maximaal een lege regel tussen alinea's. summary_short mag compact zijn voor mobiele preview maar zonder nieuwe claims, interpretatie of toonlaag. Geef alleen JSON terug met title, body en summary_short.";
const ENTRY_NORMALIZATION_USER_INSTRUCTION =
  "Maak 1 concrete titel, 1 volledige licht-geredigeerde body en 1 compacte summary_short op basis van de bron. Body: corrigeer duidelijke typefouten, spatiebreuken binnen woorden, simpele spelfouten, ontbrekende of onjuiste leestekens en kleine grammaticale slordigheden, maar behoud inhoud, volgorde en toon. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Herstel natuurlijke zinsgrenzen zonder de tekst merkbaar te herschrijven. Breek een lange tekststroom op in logische alinea's waar onderwerp, moment of gedachte verschuift. Behoud bestaande betekenisvolle alinea's/lege regels uit de bron en voeg alleen nieuwe alinea's toe waar dat de leesbaarheid duidelijk verbetert; maak geen kunstmatige opsomming of fragmentatie. Redigeer, niet herschrijven; geen merkbare reductie, samenvatting of generieke parafrase. Voorbeeld: 'h ier nog iets nied goedt geschrefen...' wordt 'Hier nog iets niet goed geschreven...'. Normaliseer 3+ lege regels naar maximaal een lege regel tussen alinea's. summary_short: compacte preview voor mobiele lijsten (ongeveer 2 regels), natuurlijk Nederlands, niet-meta, niet-analytisch, geen vraagvorm en geen nieuwe claims.";
const ENTRY_NORMALIZATION_REPAIR_SYSTEM_PROMPT =
  "Herstel de normalisatie door alleen licht te redigeren, niet te herschrijven. Schrijf goed en natuurlijk Nederlands. Corrigeer duidelijke typefouten, spatiebreuken binnen woorden, simpele spelfouten, ontbrekende of onjuiste leestekens en kleine grammaticale slordigheden, maar behoud formulering, termen en stem van de gebruiker. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Herstel natuurlijke zinsgrenzen zonder de tekst merkbaar te herschrijven. Breek een lange tekststroom alleen waar nodig op in logische alinea's op natuurlijke verschuivingen van onderwerp, moment of gedachte, zonder kunstmatige fragmentatie. Geen nieuwe claims, interpretaties of conclusies. Geef alleen JSON terug met title, body en summary_short.";
const ENTRY_NORMALIZATION_REPAIR_USER_INSTRUCTION =
  "Body heeft drift. Redigeer conservatief: behoud bronformulering en corrigeer alleen leestekens, zinsgrenzen, evidente taalfouten, spatiebreuken binnen woorden, simpele spelfouten, kleine grammaticale slordigheden en spraakruis. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Voeg alleen logische alineascheiding toe waar de tekst anders onnodig een blok blijft; geen kunstmatige opsplitsing. Niet samenvatten, niet hervertellen en geen toonlaag toevoegen.";

const REFLECTION_SYSTEM_PROMPT =
  "Maak een rustige periodereflectie op basis van dagjournals. Dit is geen takenlijst en geen platte samenvatting: geef synthese over de periode. Blijf feitelijk, compact, praktisch, nuchter en brongetrouw. Geen therapietaal, diagnose-taal, coachingtaal of zware psychologische interpretaties. Stel geen vragen in de output. Geef alleen JSON terug met summaryText, highlights, reflectionPoints.";

/**
 * Primary prompt voor eerste normalisatie.
 * Gebruikt in process-entry bij intake van text/audio naar entries_normalized.
 * Wordt gebruikt tijdens de eerste verwerking van een capture.
 */
export function buildEntryNormalizationPromptSpec(input: {
  rawText: string;
}): OpenAiPromptSpec {
  return {
    promptVersion: ENTRY_NORMALIZATION_PROMPT_VERSION,
    systemPrompt: ENTRY_NORMALIZATION_SYSTEM_PROMPT,
    userPrompt: JSON.stringify({
      instruction: ENTRY_NORMALIZATION_USER_INSTRUCTION,
      rawText: input.rawText,
    }),
  };
}

/**
 * Repair prompt voor normalisatie.
 * Gebruikt in process-entry wanneer de primary normalisatie drift vertoont.
 * Retry-only variant: conservatiever en alleen voor herstel.
 */
export function buildEntryNormalizationRepairPromptSpec(input: {
  rawText: string;
  currentBody: string;
}): OpenAiPromptSpec {
  return {
    promptVersion: ENTRY_NORMALIZATION_REPAIR_PROMPT_VERSION,
    systemPrompt: ENTRY_NORMALIZATION_REPAIR_SYSTEM_PROMPT,
    userPrompt: JSON.stringify({
      instruction: ENTRY_NORMALIZATION_REPAIR_USER_INSTRUCTION,
      rawText: input.rawText,
      currentBody: input.currentBody,
    }),
  };
}

/**
 * Primary prompt voor renormalisatie na handmatige edit.
 * Gebruikt in renormalize-entry nadat een gebruiker een entry opnieuw opslaat.
 * Zelfde kerninstructie als intake-normalisatie, met eigen promptversie.
 */
export function buildEntryRenormalizationPromptSpec(input: {
  rawText: string;
}): OpenAiPromptSpec {
  return {
    promptVersion: ENTRY_RENORMALIZATION_PROMPT_VERSION,
    systemPrompt: ENTRY_NORMALIZATION_SYSTEM_PROMPT,
    userPrompt: JSON.stringify({
      instruction: ENTRY_NORMALIZATION_USER_INSTRUCTION,
      rawText: input.rawText,
    }),
  };
}

/**
 * Primary prompt voor dagjournal-compositie.
 * Gebruikt in process-entry en regenerate-day-journal voor day_journals opbouw.
 * Wordt gebruikt bij reguliere compositie uit genormaliseerde entries.
 */
export function buildDayJournalComposePromptSpec(input: {
  journalDate: string;
  entries: Array<{ title: string; body: string }>;
  daySummaryMaxChars: number;
  dayInsightMaxChars: number;
}): OpenAiPromptSpec {
  return {
    promptVersion: DAY_JOURNAL_COMPOSE_PROMPT_VERSION,
    systemPrompt:
      "Schrijf een rustige, brongetrouwe dagboekdag in natuurlijk Nederlands. Schrijf in ik-vorm en maak er een samenhangende dagtekst van. Gebruik bronvolgorde op hoofdlijn, maar niet als seriele entry-dump. Geef alleen JSON terug met summary, narrativeText en sections.",
    userPrompt: JSON.stringify({
      instruction:
        `narrativeText: volledige verhalende dagtekst in ik-vorm met logische alinea's, natuurlijke overgangen en actieve deduplicatie van inhoudelijk gelijke updates. Niet elke entry hoeft letterlijk benoemd te worden, maar geen betekenisvolle entry-cluster mag volledig verdwijnen: als een entry een duidelijk persoonlijk, relationeel, emotioneel of concreet gebeurtenismoment bevat, moet dat inhoudelijk herkenbaar terugkomen (desnoods kort geintegreerd in 1-2 zinnen). Bundel vergelijkbare korte test/status entries in een passage en geef grotere persoonlijke momenten proportioneel meer ruimte. Blijf bronnabij, voeg geen nieuwe informatie of interpretatie toe. summary: compacte menselijke dagschets in natuurlijk Nederlands, concreet en niet dossierachtig, met een harde limiet van ${input.daySummaryMaxChars} tekens. sections: korte kernblokken die de echte hoofdonderwerpen van de dag dekken, waarbij de eerste section verplicht een AI-inzicht is in exact dit format: "Inzicht: ...". Dat inzicht is 1 korte zin, dag-specifiek en brongetrouw, met een harde limiet van ${input.dayInsightMaxChars} tekens (exclusief "Inzicht: "). Het inzicht is expliciet geen samenvatting van gebeurtenissen, maar benoemt wat er onder de gebeurtenissen opvalt (bijv. patroon, spanning, behoefte, terugkerend thema of verschuiving), in rustige menselijke taal zonder therapeutische of generieke AI-zinnen. Vermijd expliciet: seriele entry-opsomming, rapport-/archieftaal (zoals dagboeknotities over), quasi-concatenatie van entry bodies, losse technische metabrokken die samengevoegd kunnen worden, afkappen midden in een zin, therapietaal/diagnose en generieke AI-samenvattingstaal.`,
      journalDate: input.journalDate,
      entries: input.entries,
    }),
  };
}

/**
 * Repair prompt voor dagjournal-compositie.
 * Gebruikt in process-entry en regenerate-day-journal bij quality-retry.
 * Retry-only variant wanneer primary output te compact/geplakt is.
 */
export function buildDayJournalRepairPromptSpec(input: {
  journalDate: string;
  entries: Array<{ title: string; body: string }>;
  daySummaryMaxChars: number;
  dayInsightMaxChars: number;
}): OpenAiPromptSpec {
  return {
    promptVersion: DAY_JOURNAL_REPAIR_PROMPT_VERSION,
    systemPrompt:
      "Herstel alleen de compositie van narrativeText zodat die volledig, verhalend en brongetrouw is. Geef alleen JSON terug met summary, narrativeText en sections.",
    userPrompt: JSON.stringify({
      instruction:
        `NarrativeText is te compact of te geplakt. Herschrijf tot samenhangende dagtekst in ik-vorm met logische alinea's. Behoud alle betekenisvolle momenten in bronvolgorde op hoofdlijn, bundel vergelijkbare korte updates, schrijf niet samenvattend en voeg geen nieuwe interpretatie toe. Houd summary compact en maximaal ${input.daySummaryMaxChars} tekens, en zorg dat sections[0] het inzicht blijft in format "Inzicht: ..." met maximaal ${input.dayInsightMaxChars} tekens (exclusief prefix).`,
      journalDate: input.journalDate,
      entries: input.entries,
    }),
  };
}

/**
 * Primary prompt voor periodereflectie.
 * Gebruikt in generate-reflection voor week- en maandreflecties op day journals.
 * Geen retry-variant; fallback gebeurt buiten promptniveau.
 */
export function buildReflectionPromptSpec(input: {
  periodType: "week" | "month";
  periodStart: string;
  periodEnd: string;
  dayJournals: unknown;
}): OpenAiPromptSpec {
  const periodSpecificGuidance =
    input.periodType === "week"
      ? "Weekreflectie: blijf dicht op concrete dagen, dagritme en opvallende weeklijnen. Benoem terugkerende lijnen die over meerdere dagen zichtbaar zijn."
      : "Maandreflectie: zoom uit over meerdere weken, benoem bredere ontwikkeling en verschuivingen over de maand zonder vaag of managementachtig te worden.";

  return {
    promptVersion: REFLECTION_PROMPT_VERSION,
    systemPrompt: REFLECTION_SYSTEM_PROMPT,
    userPrompt: JSON.stringify({
      instruction:
        "Gebruik alleen de meegegeven day journals (summary, narrative_text, sections). Schrijf een periodereflexie die meer doet dan gebeurtenissen herhalen. summaryText: 2-4 zinnen met de kernlijn van de periode, concreet en rustig. highlights: selectieve concrete gebeurtenissen die de periode dragen, geen uitputtende takenopsomming. reflectionPoints: korte observaties of voorzichtige richtingen voor aandacht, geen todo-lijst, geen imperatieve actiepunten. Benoem minstens een terugkerend patroon, spanning, verschuiving of thema dat over meerdere dagen zichtbaar wordt. Geen aannames buiten de input, geen therapie/diepte-duiding, geen rapport-/managementtaal, geen generieke AI-samenvattingstaal, geen meta-zinnen over aantallen dagjournals, geen halve/afgebroken zinnen en geen vragen.",
      periodGuidance: periodSpecificGuidance,
      periodType: input.periodType,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      dayJournals: input.dayJournals,
    }),
  };
}
