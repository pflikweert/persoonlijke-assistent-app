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
export const REFLECTION_PROMPT_VERSION = "period-reflection.v1.phase3";

const ENTRY_NORMALIZATION_SYSTEM_PROMPT =
  "Normaliseer een persoonlijke notitie door licht te redigeren, niet te herschrijven. Schrijf goed en natuurlijk Nederlands. Corrigeer duidelijke typefouten, spatiebreuken binnen woorden, simpele spelfouten, ontbrekende of onjuiste leestekens, stotteren, spraakruis en kleine grammaticale slordigheden. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Herstel natuurlijke zinsgrenzen zonder de tekst merkbaar te herschrijven. Breek een lange tekststroom op in logische alinea's waar onderwerp, moment of gedachte verschuift. Behoud bestaande betekenisvolle alineas uit de bron en voeg alleen alineascheiding toe waar dat de leesbaarheid duidelijk verbetert. Maak geen kunstmatige opsomming of fragmentatie. Behoud betekenis, volgorde, toon, cadans en alle betekenisvolle details uit de bron. Vat niet samen, parafraseer niet onnodig, maak de tekst niet formeler of mooier dan nodig, en voeg geen nieuwe claims, interpretaties of conclusies toe. Behoud specifieke termen, productnamen, eigennamen en ongebruikelijke woorden zoveel mogelijk letterlijk; bij twijfel origineel behouden. Behoud betekenisvolle alineascheiding uit de bron in body (bijv. chatblokken of dagboekalinea's); sla die niet plat. Meerdere lege regels mag je terugbrengen naar maximaal een lege regel tussen alinea's. summary_short mag compact zijn voor mobiele preview maar zonder nieuwe claims, interpretatie of toonlaag. Geef alleen JSON terug met title, body en summary_short.";
const ENTRY_NORMALIZATION_USER_INSTRUCTION =
  "Maak 1 concrete titel, 1 volledige licht-geredigeerde body en 1 compacte summary_short op basis van de bron. Body: corrigeer duidelijke typefouten, spatiebreuken binnen woorden, simpele spelfouten, ontbrekende of onjuiste leestekens en kleine grammaticale slordigheden, maar behoud inhoud, volgorde en toon. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Herstel natuurlijke zinsgrenzen zonder de tekst merkbaar te herschrijven. Breek een lange tekststroom op in logische alinea's waar onderwerp, moment of gedachte verschuift. Behoud bestaande betekenisvolle alinea's/lege regels uit de bron en voeg alleen nieuwe alinea's toe waar dat de leesbaarheid duidelijk verbetert; maak geen kunstmatige opsomming of fragmentatie. Redigeer, niet herschrijven; geen merkbare reductie, samenvatting of generieke parafrase. Voorbeeld: 'h ier nog iets nied goedt geschrefen...' wordt 'Hier nog iets niet goed geschreven...'. Normaliseer 3+ lege regels naar maximaal een lege regel tussen alinea's. summary_short: compacte preview voor mobiele lijsten (ongeveer 2 regels), natuurlijk Nederlands, niet-meta, niet-analytisch, geen vraagvorm en geen nieuwe claims.";
const ENTRY_NORMALIZATION_REPAIR_SYSTEM_PROMPT =
  "Herstel de normalisatie door alleen licht te redigeren, niet te herschrijven. Schrijf goed en natuurlijk Nederlands. Corrigeer duidelijke typefouten, spatiebreuken binnen woorden, simpele spelfouten, ontbrekende of onjuiste leestekens en kleine grammaticale slordigheden, maar behoud formulering, termen en stem van de gebruiker. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Herstel natuurlijke zinsgrenzen zonder de tekst merkbaar te herschrijven. Breek een lange tekststroom alleen waar nodig op in logische alinea's op natuurlijke verschuivingen van onderwerp, moment of gedachte, zonder kunstmatige fragmentatie. Geen nieuwe claims, interpretaties of conclusies. Geef alleen JSON terug met title, body en summary_short.";
const ENTRY_NORMALIZATION_REPAIR_USER_INSTRUCTION =
  "Body heeft drift. Redigeer conservatief: behoud bronformulering en corrigeer alleen leestekens, zinsgrenzen, evidente taalfouten, spatiebreuken binnen woorden, simpele spelfouten, kleine grammaticale slordigheden en spraakruis. Begin zinnen en alinea's met hoofdletters waar dat in natuurlijk Nederlands hoort. Herstel evidente ontbrekende of onjuiste punten, komma's en andere elementaire interpunctie. Voeg alleen logische alineascheiding toe waar de tekst anders onnodig een blok blijft; geen kunstmatige opsplitsing. Niet samenvatten, niet hervertellen en geen toonlaag toevoegen.";

const REFLECTION_SYSTEM_PROMPT =
  "Maak een compacte, brongebonden periodereflectie op basis van dagjournals. Kies selectie boven volledigheid: benoem de dragende lijn van de periode in plaats van alles samen te vatten. Schrijf rustig, concreet, selectief en in natuurlijk Nederlands. De toon is menselijk en nuchter, niet rapportachtig, niet meta en niet generiek-AI. Vermijd abstracte tweede-laagzinnen die niet duidelijk aan bronmomenten hangen. Geen therapietaal, diagnostische taal, coachtoon, managementtoon, checklisttoon of dag-voor-dag verslag tenzij een moment de periode echt draagt. Stel geen vragen in de output. Geef alleen JSON terug met summaryText, narrativeText, highlights en reflectionPoints.";

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
      ? "Weekreflectie: zoek de lijn die meerdere dagen verbindt, bijvoorbeeld een terugkerende spanning, een contrast, een verschuiving of een ritme binnen de week. Beschrijf niet per dag wat er gebeurde, tenzij een dag echt het kantelpunt van de week draagt."
      : "Maandreflectie: zoom uit over meerdere weken en zoek de grotere beweging van de maand, bijvoorbeeld een verschuiving, opbouw of terugkerend contrast. Maak er geen reeks van weeksamenvattingen of een logboek van losse weken van.";

  return {
    promptVersion: REFLECTION_PROMPT_VERSION,
    systemPrompt: REFLECTION_SYSTEM_PROMPT,
    userPrompt: JSON.stringify({
      instruction:
        "Gebruik alleen de meegegeven day journals (summary, narrative_text, sections). Schrijf een periodereflectie die selecteert in plaats van volledig samen te vatten. Kies de dragende lijn van de periode en laat die de tekst sturen. Veranker de tekst zichtbaar in concrete bronmomenten: noem in totaliteit van summaryText + narrativeText + highlights + reflectionPoints meerdere herkenbare details uit de bron (bijvoorbeeld specifieke gebeurtenissen, contexten of namen) in plaats van abstracte labels. Houd minimaal een paar bronankers letterlijk herkenbaar, inclusief ten minste een duidelijk bronwoord of naam van 8+ tekens. summaryText: 1-3 zinnen, kort en typerend, met de kernlijn van de periode; geen brede recap, geen nette inventaris, geen veilige syntheseformules en geen abstracte tweede laag die niet duidelijk op concrete bronmomenten rust. narrativeText: compacte verhalende periodetekst in natuurlijk Nederlands die rijker is dan summaryText, met 2-5 korte alinea's waar dat natuurlijk helpt. Werk de dragende lijn uit met concrete, herkenbare momenten. Kies liever een paar periode-dragende momenten en een duidelijke beweging dan een nette totaalindruk. Vermijd dag-voor-dag logboekgedrag, opsomming verstopt als proza, abstracte quasi-diepe zinnen zonder bronhouvast en herhaling van summaryText of reflectionPoints in andere woorden. narrativeText geeft meer textuur dan summaryText, maar blijft duidelijk compacter dan een dagjournal-narrativeText. highlights: maximaal 3 korte, concrete periode-dragende momenten of duidelijke clusters met een eigen zwaartepunt; geen brede categorieen, geen samengestelde bakjes met losse dingen en niet chronologisch als daglogboek. reflectionPoints: maximaal 3 kleine observaties die iets nieuws toevoegen ten opzichte van summaryText en narrativeText; benoem patroon, spanning, contrast, verschuiving of ritme zonder te parafraseren. Reflection points blijven observerend, scherp en compact; geen advies, geen todo-lijst, geen coach- of managementtoon. Liever 2 sterke observaties dan 3 brave, volledige observaties. Als een concreet moment de periode kleur geeft, benoem dat liever dan een abstract label. Compact mag nooit dun of vaag worden. Gebruik natuurlijk, menselijk Nederlands en vermijd expliciet rapportzinnen of stock-openers zoals 'De week draaide vooral om...', 'De maand draaide vooral om...', 'Er was veel aandacht voor...' en 'Naast X was er ook...'. Geen aannames buiten de input, geen therapie- of diepteduiding, geen meta-zinnen over aantallen dagjournals, geen halve of afgebroken zinnen en geen vragen.",
      periodGuidance: periodSpecificGuidance,
      periodType: input.periodType,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      dayJournals: input.dayJournals,
    }),
  };
}
