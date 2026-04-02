export const DAY_JOURNAL_PROMPT_VERSION = 'day-composition.v1.2.phase2.1';
export const DAY_JOURNAL_REPAIR_PROMPT_VERSION = 'day-composition.v1.2.phase2.1.retry1';
const DAY_SUMMARY_MAX_CHARS = 212;
const DAY_INSIGHT_MAX_CHARS = 171;

const DEFAULT_NO_SPEECH_TRANSCRIPT = 'Geen spraak herkend in audio-opname.';
const DEFAULT_LOW_CONTENT_TITLE = 'Audio-opname zonder spraak';
const GENERIC_DAY_PHRASES = [
  'belangrijkste momenten',
  'samengevoegd',
  'notities vastgelegd',
  'algemene samenvatting',
];
const GENERIC_NARRATIVE_OPENINGS = [
  'de dag begon',
  'de dag draaide om',
  'deze dag liet zien',
  'in deze dag',
  'vandaag stond in het teken',
];
const FORBIDDEN_NARRATIVE_BRIDGE_PHRASES = [
  'later op de dag',
  'uiteindelijk bleek',
  'daarna werd duidelijk',
  'gaandeweg bleek',
  'het liet zien dat',
  'dat maakte duidelijk dat',
];
const FIRST_PERSON_MARKERS = [' ik ', ' mijn ', ' me ', ' mij ', ' mezelf ', ' we ', ' ons ', ' onze '];
const FIRST_PERSON_SENTENCE_STARTS = ['ik ', 'we '];
const REPORTER_OPENINGS = ['de gebruiker', 'de notitie', 'de dag', 'hij ', 'zij ', 'er wordt', 'er werd'];
const FORBIDDEN_BEHAVIOR_PHRASES = [
  'je zou',
  'het is goed om',
  'het helpt om',
  'kan helpen om',
  'probeer om',
  'de notities laten zien',
  'de notities tonen',
  'uit de notities blijkt',
  'er zijn meerdere notities',
  'patronen laten zien',
];
const SENSITIVE_SOURCE_TERMS = [
  'therapie',
  'diagnose',
  'stoornis',
  'depressie',
  'trauma',
  'heling',
  'psycholoog',
  'paniek',
  'hechting',
];
const META_SUMMARY_PHRASES = [
  'de notities',
  'deze notities',
  'meerdere notities',
  'aantal notities',
  'patronen',
];
const REPORT_LIKE_SUMMARY_PHRASES = [
  'dagboeknotities over',
  'notities over',
  'samenvatting van de notities',
  'overzicht van de notities',
  'dossierregel',
  'rapportregel',
  'dagrapport',
  'archiefregel',
];
const TRUNCATED_NARRATIVE_ENDINGS = [
  ' en',
  ' maar',
  ' omdat',
  ' terwijl',
  ' toen',
  ' dat',
  ' die',
  ' dus',
  ' waardoor',
  ' waarna',
  ' zodat',
  ' om',
  ' te',
];
const RELATIONAL_MEANINGFUL_CUES = [
  'partner',
  'vriend',
  'vriendin',
  'samen',
  'lief',
  'love',
  'moeder',
  'vader',
  'zus',
  'broer',
  'kind',
];
const RELATIONAL_EVENT_CUES = ['bericht', 'chat', 'belde', 'gesproken', 'afgesproken', 'moment', 'samen'];
const ANCHOR_STOPWORDS = new Set([
  'vandaag',
  'vanmorgen',
  'middag',
  'avond',
  'daarna',
  'omdat',
  'terwijl',
  'rustige',
  'rustiger',
  'nederlands',
  'vroeger',
  'dingen',
  'gevoel',
  'gevoelens',
  'planning',
  'morgen',
]);

function normalizeWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeNarrativeWhitespace(value) {
  return String(value ?? '')
    .replace(/\r/g, '')
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter((paragraph) => paragraph.length > 0)
    .join('\n\n')
    .trim();
}

function sanitizeShortLine(value, maxLength) {
  return normalizeWhitespace(value).slice(0, maxLength);
}

function sanitizeNarrativeText(value, maxLength = 6000) {
  const normalized = normalizeNarrativeWhitespace(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return normalized.slice(0, maxLength).trim();
}

function sanitizeSummaryLine(value, maxLength = DAY_SUMMARY_MAX_CHARS) {
  const normalized = normalizeWhitespace(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, maxLength);
  const boundary = Math.max(
    sliced.lastIndexOf('. '),
    sliced.lastIndexOf('; '),
    sliced.lastIndexOf(', '),
    sliced.lastIndexOf(' ')
  );
  let candidate = boundary > maxLength * 0.55 ? sliced.slice(0, boundary).trim() : sliced.trim();

  while (/\b(en|of|maar|met|voor|daarna|waarna|ook|omdat|een|de|het)$/i.test(candidate)) {
    candidate = candidate.replace(/\s+\S+$/u, '').trim();
  }

  if (candidate && !/[.!?]$/.test(candidate)) {
    candidate = `${candidate}.`;
  }

  return candidate;
}

function sanitizeInsightSection(value) {
  const normalized = normalizeWhitespace(value);
  if (!/^inzicht\s*:/i.test(normalized)) {
    return null;
  }

  const rawInsight = normalized.replace(/^inzicht\s*:/i, '').trim();
  if (!rawInsight) {
    return null;
  }

  const insight = sanitizeSummaryLine(rawInsight, DAY_INSIGHT_MAX_CHARS);
  if (!insight) {
    return null;
  }

  return `Inzicht: ${insight}`;
}

function parseString(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeForCompare(value) {
  return normalizeWhitespace(value).toLowerCase();
}

function normalizeForCueScan(value) {
  return ` ${normalizeWhitespace(value).toLowerCase()} `;
}

function dedupeByNormalizedValue(items) {
  const seen = new Set();
  const output = [];

  for (const item of items) {
    const key = normalizeForCompare(item);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    output.push(item);
  }

  return output;
}

function ensureSentenceEnding(value) {
  const clean = normalizeWhitespace(value);
  if (!clean) {
    return '';
  }

  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function countSentenceHits(value, predicate) {
  const sentences = String(value ?? '')
    .split(/[.!?]+/)
    .map((sentence) => normalizeWhitespace(sentence))
    .filter((sentence) => sentence.length > 0);

  return sentences.filter(predicate).length;
}

function hasFirstPersonCue(value) {
  const normalized = normalizeForCueScan(value);
  return FIRST_PERSON_MARKERS.some((marker) => normalized.includes(marker));
}

function countFirstPersonMarkerHits(value) {
  const normalized = normalizeForCueScan(value);
  return FIRST_PERSON_MARKERS.reduce((count, marker) => count + (normalized.includes(marker) ? 1 : 0), 0);
}

function countFirstPersonSentenceHits(value) {
  return countSentenceHits(value, (sentence) => {
    const normalized = ` ${sentence.toLowerCase()} `;
    return (
      FIRST_PERSON_MARKERS.some((marker) => normalized.includes(marker)) ||
      FIRST_PERSON_SENTENCE_STARTS.some((prefix) => sentence.toLowerCase().startsWith(prefix))
    );
  });
}

function hasReporterOpening(value) {
  const text = normalizeForCompare(value);
  return REPORTER_OPENINGS.some((prefix) => text.startsWith(prefix));
}

function computeFirstPersonScore(value) {
  const markerHits = Math.min(countFirstPersonMarkerHits(value), 3);
  const sentenceHits = Math.min(countFirstPersonSentenceHits(value), 2);
  const reporterPenalty = hasReporterOpening(value) ? 2 : 0;
  return markerHits + sentenceHits - reporterPenalty;
}

function sourceRequiresFirstPerson(entries) {
  const combined = normalizeNarrativeWhitespace(entries.map((entry) => entry.body).join('\n\n'));
  return computeFirstPersonScore(combined) >= 3 && countFirstPersonSentenceHits(combined) >= 2;
}

function narrativeViolatesFirstPersonBaseline(value) {
  return computeFirstPersonScore(value) < 2 || hasReporterOpening(value);
}

function containsNoSpeechMarker(value, noSpeechTranscript = DEFAULT_NO_SPEECH_TRANSCRIPT) {
  return normalizeForCompare(value).includes(normalizeForCompare(noSpeechTranscript));
}

function looksGenericDayText(value) {
  const normalized = normalizeForCompare(value);
  if (normalized.length < 12) {
    return true;
  }

  return GENERIC_DAY_PHRASES.some((phrase) => normalized.includes(phrase));
}

function containsForbiddenNarrativeBridge(value) {
  const normalized = normalizeForCompare(value);
  return FORBIDDEN_NARRATIVE_BRIDGE_PHRASES.some((phrase) => normalized.includes(phrase));
}

function containsForbiddenBehavior(value) {
  const normalized = normalizeForCompare(value);
  return FORBIDDEN_BEHAVIOR_PHRASES.some((phrase) => normalized.includes(phrase));
}

function sourceContainsTerm(entries, term) {
  const sourceText = normalizeForCompare(entries.map((entry) => entry.body).join('\n\n'));
  return sourceText.includes(term);
}

function containsSensitiveTermWithoutSource(value, entries) {
  const normalized = normalizeForCompare(value);
  return SENSITIVE_SOURCE_TERMS.some((term) => normalized.includes(term) && !sourceContainsTerm(entries, term));
}

function containsForbiddenNarrativeCategory(value, entries, strictValidation) {
  if (containsForbiddenBehavior(value)) {
    return true;
  }

  if (!strictValidation) {
    return false;
  }

  return containsSensitiveTermWithoutSource(value, entries);
}

function containsForbiddenSummaryCategory(value, entries, strictValidation) {
  if (containsForbiddenBehavior(value)) {
    return true;
  }

  if (!strictValidation) {
    return false;
  }

  return containsSensitiveTermWithoutSource(value, entries);
}

function containsSummaryMeta(value) {
  const normalized = normalizeForCompare(value);
  return META_SUMMARY_PHRASES.some((phrase) => normalized.includes(phrase));
}

function tokenizeAnchors(value) {
  return Array.from(
    new Set(
      normalizeForCompare(value)
        .split(/[^a-z0-9à-ÿ]+/i)
        .filter((token) => token.length >= 6)
        .filter((token) => !ANCHOR_STOPWORDS.has(token))
    )
  );
}

function collectAnchorTokens(entries) {
  const ordered = [];

  for (const entry of entries) {
    const firstSentence = normalizeWhitespace(entry.body).split(/[.!?]/)[0] ?? '';
    for (const token of tokenizeAnchors(`${entry.title} ${firstSentence}`)) {
      if (!ordered.includes(token)) {
        ordered.push(token);
      }
      if (ordered.length >= 12) {
        return ordered;
      }
    }
  }

  return ordered;
}

function countAnchorHits(text, anchorTokens) {
  const normalized = normalizeForCompare(text);
  return anchorTokens.filter((token) => normalized.includes(token)).length;
}

function firstSentence(value, maxLength = 180) {
  const sentence = normalizeWhitespace(String(value ?? '').split(/[.!?]/)[0] ?? '');
  return sentence.slice(0, maxLength).trim();
}

function tokenizeForOverlap(value) {
  return Array.from(
    new Set(
      normalizeForCompare(value)
        .split(/[^a-z0-9à-ÿ]+/i)
        .filter((token) => token.length >= 5)
    )
  );
}

function hasStrongSentenceOverlap(left, right) {
  const leftTokens = tokenizeForOverlap(left);
  const rightTokens = tokenizeForOverlap(right);
  if (leftTokens.length < 3 || rightTokens.length < 3) {
    return false;
  }

  const leftSet = new Set(leftTokens);
  const overlap = rightTokens.filter((token) => leftSet.has(token)).length;
  return overlap >= Math.max(3, Math.floor(rightTokens.length * 0.6));
}

function splitNarrativeParagraphs(value) {
  return String(value ?? '')
    .split(/\n\s*\n+/)
    .map((paragraph) => normalizeWhitespace(paragraph))
    .filter((paragraph) => paragraph.length > 0);
}

function looksStitchedNarrative(value, entries) {
  if (entries.length < 4) {
    return false;
  }

  const entryOpenings = entries.map((entry) => firstSentence(entry.body)).filter((item) => item.length >= 14);
  const paragraphOpenings = splitNarrativeParagraphs(value).map((paragraph) => firstSentence(paragraph));

  if (entryOpenings.length < 4 || paragraphOpenings.length < 3) {
    return false;
  }

  const shortEntryCount = entries.filter((entry) => normalizeWhitespace(entry.body).length <= 180).length;
  const nearOneToOneParagraphing = paragraphOpenings.length >= entries.length - 1;

  let sequentialMatches = 0;
  const compareLength = Math.min(paragraphOpenings.length, entryOpenings.length);
  for (let index = 0; index < compareLength; index += 1) {
    if (hasStrongSentenceOverlap(paragraphOpenings[index], entryOpenings[index])) {
      sequentialMatches += 1;
    }
  }

  if (nearOneToOneParagraphing && shortEntryCount >= 2 && sequentialMatches >= Math.min(3, entries.length - 1)) {
    return true;
  }

  const denseSequentialMatch = sequentialMatches >= Math.min(4, compareLength) && paragraphOpenings.length >= entries.length;
  return denseSequentialMatch;
}

function looksTruncatedNarrative(value) {
  const narrative = sanitizeNarrativeText(value);
  if (!narrative) {
    return false;
  }

  if (/[.!?]$/.test(narrative)) {
    return false;
  }

  if (/[,;:]$/.test(narrative)) {
    return true;
  }

  const tail = normalizeForCompare(narrative.slice(-36));
  return TRUNCATED_NARRATIVE_ENDINGS.some((suffix) => tail.endsWith(suffix));
}

function looksGenericNarrative(value, entries) {
  const narrative = sanitizeNarrativeText(value);
  if (!narrative) {
    return true;
  }

  const opening = normalizeForCompare(narrative.split(/[.!?]/)[0] ?? '');
  const sourceLength = normalizeNarrativeWhitespace(entries.map((entry) => entry.body).join('\n\n')).length;
  const anchorTokens = collectAnchorTokens(entries);
  const anchorHits = countAnchorHits(narrative, anchorTokens);
  const hasGenericOpening = GENERIC_NARRATIVE_OPENINGS.some((phrase) => opening.startsWith(phrase));

  if (entries.length > 1 && hasGenericOpening) {
    return true;
  }

  if (entries.length > 1 && sourceLength >= 350 && anchorTokens.length >= 3 && anchorHits < 2) {
    return true;
  }

  return false;
}

function isSuspiciouslyCompressedNarrative(entries, narrativeText) {
  const sourceLength = normalizeNarrativeWhitespace(entries.map((entry) => entry.body).join('\n\n')).length;
  const narrativeLength = sanitizeNarrativeText(narrativeText).length;

  if (sourceLength < 700) {
    return false;
  }

  return narrativeLength < Math.floor(sourceLength * 0.6);
}

function detectMeaningfulClusterMissing(entries, narrativeText) {
  const narrative = normalizeForCompare(narrativeText);
  if (!narrative || entries.length < 2) {
    return false;
  }

  for (const entry of entries) {
    const body = normalizeWhitespace(entry.body);
    const lower = normalizeForCompare(body);
    if (body.length < 45) {
      continue;
    }

    const hasRelationalCue = RELATIONAL_MEANINGFUL_CUES.some((cue) => lower.includes(cue));
    const hasEventCue = RELATIONAL_EVENT_CUES.some((cue) => lower.includes(cue));
    if (!hasRelationalCue || !hasEventCue) {
      continue;
    }

    const anchorTokens = tokenizeForOverlap(`${entry.title} ${firstSentence(body, 220)}`)
      .filter((token) => token.length >= 4)
      .slice(0, 5);
    if (anchorTokens.length < 2) {
      continue;
    }

    const hitCount = anchorTokens.filter((token) => narrative.includes(token)).length;
    if (hitCount === 0) {
      return true;
    }
  }

  return false;
}

function isReportLikeSummary(value) {
  const normalized = normalizeForCompare(value);
  if (!normalized) {
    return false;
  }

  if (/^(dagboeknotities|notities|dagrapport|rapport|dossier)\b/.test(normalized)) {
    return true;
  }

  return REPORT_LIKE_SUMMARY_PHRASES.some((phrase) => normalized.includes(phrase));
}

function buildFallbackSections(entries) {
  return dedupeByNormalizedValue(
    entries
      .map((entry) => sanitizeShortLine(entry.title, 80))
      .filter((title) => title.length > 0)
      .filter((title) => !looksGenericDayText(title))
  ).slice(0, 5);
}

function removeAdjacentDuplicateParagraphs(paragraphs) {
  const output = [];

  for (const paragraph of paragraphs) {
    const candidate = ensureSentenceEnding(paragraph);
    const previous = output[output.length - 1];
    if (previous && normalizeForCompare(previous) === normalizeForCompare(candidate)) {
      continue;
    }

    output.push(candidate);
  }

  return output;
}

function extractSummaryAnchor(entry) {
  const firstSentence = normalizeWhitespace(entry.body).split(/[.!?]/)[0]?.trim() ?? '';
  if (firstSentence.length >= 18) {
    return ensureSentenceEnding(firstSentence);
  }

  const title = sanitizeShortLine(entry.title, 80);
  if (title.length >= 8) {
    return ensureSentenceEnding(title);
  }

  return '';
}

function pickSummaryIndexes(length) {
  if (length <= 1) {
    return [0];
  }
  if (length === 2) {
    return [0, 1];
  }

  return dedupeByNormalizedValue(['0', String(Math.floor(length / 2)), String(length - 1)]).map((value) =>
    Number(value)
  );
}

export function orderDayJournalEntries(entries) {
  return [...(entries ?? [])]
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) => {
      const leftTime = left.entry?.capturedAt ? Date.parse(left.entry.capturedAt) : Number.NaN;
      const rightTime = right.entry?.capturedAt ? Date.parse(right.entry.capturedAt) : Number.NaN;

      if (!Number.isNaN(leftTime) && !Number.isNaN(rightTime) && leftTime !== rightTime) {
        return leftTime - rightTime;
      }

      return left.index - right.index;
    })
    .map(({ entry }) => ({ ...entry }));
}

export function isLowContentDayEntry(entry, options = {}) {
  const noSpeechTranscript = options.noSpeechTranscript ?? DEFAULT_NO_SPEECH_TRANSCRIPT;
  const lowContentTitle = options.lowContentTitle ?? DEFAULT_LOW_CONTENT_TITLE;

  return (
    containsNoSpeechMarker(entry.title, noSpeechTranscript) ||
    containsNoSpeechMarker(entry.body, noSpeechTranscript) ||
    normalizeForCompare(entry.title) === normalizeForCompare(lowContentTitle)
  );
}

export function buildDayJournalPromptSpec(input) {
  const orderedEntries = orderDayJournalEntries(input.entries).map((entry) => ({
    title: sanitizeShortLine(entry.title, 80),
    body: sanitizeNarrativeText(entry.body, 2400),
  }));

  return {
    promptVersion: DAY_JOURNAL_PROMPT_VERSION,
    systemPrompt:
      'Schrijf een rustige, brongetrouwe dagboekdag in natuurlijk Nederlands. Schrijf in ik-vorm en maak er een samenhangende dagtekst van. Gebruik bronvolgorde op hoofdlijn, maar niet als seriële entry-dump. Geef alleen JSON terug met summary, narrativeText en sections.',
    userPrompt: JSON.stringify({
      instruction:
        `narrativeText: volledige verhalende dagtekst in ik-vorm met logische alinea’s, natuurlijke overgangen en actieve deduplicatie van inhoudelijk gelijke updates. Niet elke entry hoeft letterlijk benoemd te worden, maar geen betekenisvolle entry-cluster mag volledig verdwijnen: als een entry een duidelijk persoonlijk, relationeel, emotioneel of concreet gebeurtenismoment bevat, moet dat inhoudelijk herkenbaar terugkomen (desnoods kort geïntegreerd in 1-2 zinnen). Bundel vergelijkbare korte test/status entries in één passage en geef grotere persoonlijke momenten proportioneel meer ruimte. Blijf bronnabij, voeg geen nieuwe informatie of interpretatie toe. summary: compacte menselijke dagschets in natuurlijk Nederlands, concreet en niet dossierachtig, met een harde limiet van ${DAY_SUMMARY_MAX_CHARS} tekens. sections: korte kernblokken die de echte hoofdonderwerpen van de dag dekken, waarbij de eerste section verplicht een AI-inzicht is in exact dit format: "Inzicht: ...". Dat inzicht is 1 korte zin, dag-specifiek en brongetrouw, met een harde limiet van ${DAY_INSIGHT_MAX_CHARS} tekens (exclusief "Inzicht: "). Het inzicht is expliciet géén samenvatting van gebeurtenissen, maar benoemt wat er onder de gebeurtenissen opvalt (bijv. patroon, spanning, behoefte, terugkerend thema of verschuiving), in rustige menselijke taal zonder therapeutische of generieke AI-zinnen. Vermijd expliciet: seriële entry-opsomming, rapport-/archieftaal (zoals dagboeknotities over), quasi-concatenatie van entry bodies, losse technische metabrokken die samengevoegd kunnen worden, afkappen midden in een zin, therapietaal/diagnose en generieke AI-samenvattingstaal.`,
      journalDate: input.journalDate,
      entries: orderedEntries,
    }),
  };
}

export function buildDayJournalRepairPromptSpec(input) {
  const orderedEntries = orderDayJournalEntries(input.entries).map((entry) => ({
    title: sanitizeShortLine(entry.title, 80),
    body: sanitizeNarrativeText(entry.body, 2400),
  }));

  return {
    promptVersion: DAY_JOURNAL_REPAIR_PROMPT_VERSION,
    systemPrompt:
      'Herstel alleen de compositie van narrativeText zodat die volledig, verhalend en brongetrouw is. Geef alleen JSON terug met summary, narrativeText en sections.',
    userPrompt: JSON.stringify({
      instruction:
        `NarrativeText is te compact of te geplakt. Herschrijf tot samenhangende dagtekst in ik-vorm met logische alinea’s. Behoud alle betekenisvolle momenten in bronvolgorde op hoofdlijn, bundel vergelijkbare korte updates, schrijf niet samenvattend en voeg geen nieuwe interpretatie toe. Houd summary compact en maximaal ${DAY_SUMMARY_MAX_CHARS} tekens, en zorg dat sections[0] het inzicht blijft in format "Inzicht: ..." met maximaal ${DAY_INSIGHT_MAX_CHARS} tekens (exclusief prefix).`,
      journalDate: input.journalDate,
      entries: orderedEntries,
    }),
  };
}

export function createFallbackDayJournal(entries) {
  const orderedEntries = orderDayJournalEntries(entries);
  if (orderedEntries.length === 0) {
    return {
      summary: 'Nog geen bruikbare notities voor deze dag.',
      narrativeText: '',
      sections: [],
    };
  }

  const paragraphs = removeAdjacentDuplicateParagraphs(
    orderedEntries.map((entry) => normalizeWhitespace(entry.body)).filter((value) => value.length > 0)
  );
  const narrativeText = paragraphs.join('\n\n');
  const sections = buildFallbackSections(orderedEntries);
  const summary = buildFallbackSummary(orderedEntries);

  return {
    summary,
    narrativeText,
    sections,
  };
}

export function buildFallbackSummary(entries) {
  const orderedEntries = orderDayJournalEntries(entries);
  if (orderedEntries.length === 0) {
    return 'Nog geen bruikbare notities voor deze dag.';
  }

  const preferredIndexes = pickSummaryIndexes(orderedEntries.length);
  const anchors = [];

  for (const index of preferredIndexes) {
    const entry = orderedEntries[index];
    if (!entry) {
      continue;
    }

    const anchor = extractSummaryAnchor(entry);
    if (anchor && !anchors.some((item) => normalizeForCompare(item) === normalizeForCompare(anchor))) {
      anchors.push(anchor);
    }
  }

  if (anchors.length < 2) {
    for (const entry of orderedEntries) {
      const anchor = extractSummaryAnchor(entry);
      if (!anchor || anchors.some((item) => normalizeForCompare(item) === normalizeForCompare(anchor))) {
        continue;
      }
      anchors.push(anchor);
      if (anchors.length >= 3) {
        break;
      }
    }
  }

  let summary = anchors.slice(0, 2).join(' ');
  if (anchors.length >= 3 && summary.length < 130) {
    summary = `${summary} ${anchors[2]}`.trim();
  }

  return sanitizeSummaryLine(summary || extractSummaryAnchor(orderedEntries[0]) || 'Korte dagschets niet beschikbaar.');
}

function cleanSummary(value, fallbackSummary, narrativeText, entries, strictValidation, softQualityGuards) {
  const candidate = sanitizeSummaryLine(value, DAY_SUMMARY_MAX_CHARS);
  if (!candidate) {
    return { value: fallbackSummary, usedFallback: true, reasons: ['missing_summary'] };
  }

  const reasons = [];

  if (isReportLikeSummary(candidate)) {
    reasons.push('report_like_summary');
  }

  if (containsSummaryMeta(candidate) || containsNoSpeechMarker(candidate) || looksGenericDayText(candidate)) {
    reasons.push('generic_summary');
  }

  if (containsForbiddenSummaryCategory(candidate, entries, strictValidation)) {
    reasons.push('forbidden_summary_category');
  }

  const narrativeLength = sanitizeNarrativeText(narrativeText).length;
  if (narrativeLength >= 180 && candidate.length >= Math.floor(narrativeLength * 0.72)) {
    reasons.push('summary_too_close');
  }

  if (softQualityGuards && reasons.length > 0) {
    return { value: fallbackSummary, usedFallback: true, reasons: dedupeByNormalizedValue(reasons) };
  }

  return { value: candidate, usedFallback: false, reasons: dedupeByNormalizedValue(reasons) };
}

function cleanSections(value, fallbackSections, summary, options = {}) {
  const noSpeechTranscript = options.noSpeechTranscript ?? DEFAULT_NO_SPEECH_TRANSCRIPT;
  const softQualityGuards = Boolean(options.softQualityGuards);
  const parsed = Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item !== 'string') {
            return '';
          }
          const insight = sanitizeInsightSection(item);
          if (insight) {
            return insight;
          }
          return sanitizeShortLine(item, 90);
        })
        .filter((item) => item.length > 0)
    : [];

  const summaryKey = normalizeForCompare(summary);
  const cleaned = dedupeByNormalizedValue(parsed)
    .filter((item) => !containsNoSpeechMarker(item, noSpeechTranscript))
    .filter((item) => !looksGenericDayText(item))
    .filter((item) => normalizeForCompare(item) !== summaryKey)
    .slice(0, 5);

  if (cleaned.length > 0) {
    return { value: cleaned, usedFallback: false, reasons: [] };
  }

  if (!Array.isArray(value)) {
    return { value: fallbackSections, usedFallback: true, reasons: ['sections_invalid'] };
  }

  if (softQualityGuards) {
    return { value: fallbackSections, usedFallback: true, reasons: ['sections_fallback_used'] };
  }

  return { value: [], usedFallback: false, reasons: ['sections_fallback_used'] };
}

function collectNarrativeAssessment(narrativeText, entries, strictValidation) {
  const qualityReasons = [];
  if (containsForbiddenNarrativeCategory(narrativeText, entries, strictValidation)) {
    qualityReasons.push('forbidden_category');
  }

  if (containsForbiddenNarrativeBridge(narrativeText)) {
    qualityReasons.push('forbidden_bridge');
  }

  if (isSuspiciouslyCompressedNarrative(entries, narrativeText)) {
    qualityReasons.push('compressed_narrative');
  }

  if (looksStitchedNarrative(narrativeText, entries)) {
    qualityReasons.push('stitched_narrative');
  }

  if (looksTruncatedNarrative(narrativeText)) {
    qualityReasons.push('truncated_narrative');
  }

  if (detectMeaningfulClusterMissing(entries, narrativeText)) {
    qualityReasons.push('meaningful_cluster_missing');
  }

  if (looksGenericNarrative(narrativeText, entries)) {
    qualityReasons.push('generic_narrative');
  }

  if (sourceRequiresFirstPerson(entries) && narrativeViolatesFirstPersonBaseline(narrativeText)) {
    qualityReasons.push('missing_first_person');
  }

  return {
    hardReasons: [],
    qualityReasons: dedupeByNormalizedValue(qualityReasons),
  };
}

export function finalizeDayJournalDraft(input) {
  const orderedEntries = orderDayJournalEntries(input.entries);
  const fallback = createFallbackDayJournal(orderedEntries);
  const aiResult = input.aiResult ?? null;
  const strictValidation = Boolean(input.options?.strictValidation);
  const softQualityGuards = Boolean(input.options?.softQualityGuards);

  function hardFailure(reasons) {
    return {
      ...fallback,
      usedFallback: true,
      usedFallbackSummary: true,
      usedFallbackSections: true,
      rejectionReasons: reasons,
      hardRejectReasons: reasons,
      narrativeHardRejectReasons: reasons,
      softQualitySignals: [],
      narrativeQualityReasons: [],
      summaryFallbackReasons: [...reasons],
      sectionFallbackReasons: ['sections_fallback_used'],
    };
  }

  if (!aiResult || typeof aiResult !== 'object') {
    return hardFailure(['model_output_missing']);
  }

  const summaryValue = parseString(aiResult.summary);
  const narrativeValue = parseString(aiResult.narrativeText);
  const sectionsValue = aiResult.sections;

  const structuralReasons = [];
  if (summaryValue === null) {
    structuralReasons.push('missing_summary');
  }
  if (narrativeValue === null) {
    structuralReasons.push('missing_narrative');
  }
  if (!Array.isArray(sectionsValue)) {
    structuralReasons.push('missing_sections');
  }

  if (structuralReasons.length > 0) {
    return hardFailure(dedupeByNormalizedValue(structuralReasons));
  }

  const narrativeText = sanitizeNarrativeText(narrativeValue ?? '', 6000);
  if (!narrativeText) {
    return hardFailure(['missing_narrative']);
  }

  const narrativeAssessment = collectNarrativeAssessment(narrativeText, orderedEntries, strictValidation);

  if (narrativeAssessment.hardReasons.length > 0) {
    return hardFailure(narrativeAssessment.hardReasons);
  }

  const summaryResult = cleanSummary(
    summaryValue ?? '',
    fallback.summary,
    narrativeText,
    orderedEntries,
    strictValidation,
    softQualityGuards
  );

  const sectionsResult = cleanSections(sectionsValue, fallback.sections, summaryResult.value, {
    ...input.options,
    softQualityGuards,
  });
  const softQualitySignals = dedupeByNormalizedValue([
    ...narrativeAssessment.qualityReasons,
    ...summaryResult.reasons,
    ...sectionsResult.reasons,
  ]);

  return {
    summary: summaryResult.value,
    narrativeText,
    sections: sectionsResult.value,
    usedFallback: false,
    usedFallbackSummary: summaryResult.usedFallback,
    usedFallbackSections: sectionsResult.usedFallback,
    rejectionReasons: [],
    hardRejectReasons: [],
    narrativeHardRejectReasons: [],
    softQualitySignals,
    narrativeQualityReasons: narrativeAssessment.qualityReasons,
    summaryFallbackReasons: summaryResult.reasons,
    sectionFallbackReasons: sectionsResult.reasons,
  };
}
