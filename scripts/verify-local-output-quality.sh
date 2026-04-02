#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
FIXTURE_FILE="$ROOT_DIR/scripts/quality-fixtures.json"

if [ -f "$ROOT_DIR/.env.local" ]; then
  set -a
  . "$ROOT_DIR/.env.local"
  set +a
fi

TARGET="${EXPO_PUBLIC_SUPABASE_TARGET:-local}"

if [ "$TARGET" = "local" ]; then
  API_URL="${EXPO_PUBLIC_SUPABASE_LOCAL_URL:-http://127.0.0.1:54321}"
  API_KEY="${EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY:-}"
else
  API_URL="${EXPO_PUBLIC_SUPABASE_CLOUD_URL:-}"
  API_KEY="${EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY:-}"
fi

if [ -z "$API_URL" ] || [ -z "$API_KEY" ]; then
  echo "Missing Supabase API URL or publishable key for target: $TARGET"
  exit 1
fi

if [ ! -f "$FIXTURE_FILE" ]; then
  echo "Missing fixture file: $FIXTURE_FILE"
  exit 1
fi

SIGNUP_FILE="$(mktemp)"
ENTRY_FILE="$(mktemp)"
DAY_FILE="$(mktemp)"
NORMALIZED_FILE="$(mktemp)"
RAW_FILE="$(mktemp)"
WEEK_FILE="$(mktemp)"
MONTH_FILE="$(mktemp)"
WEEK_ROW_FILE="$(mktemp)"
MONTH_ROW_FILE="$(mktemp)"

cleanup() {
  rm -f "$SIGNUP_FILE" "$ENTRY_FILE" "$DAY_FILE" "$NORMALIZED_FILE" "$RAW_FILE" "$WEEK_FILE" "$MONTH_FILE" "$WEEK_ROW_FILE" "$MONTH_ROW_FILE"
}

trap cleanup EXIT

EMAIL="verify.quality.$(date +%s)@example.com"
PASSWORD="Passw0rd!123"

curl -sS "$API_URL/auth/v1/signup" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" >"$SIGNUP_FILE"

ACCESS_TOKEN="$(jq -r '.access_token // empty' "$SIGNUP_FILE")"
USER_ID="$(jq -r '.user.id // empty' "$SIGNUP_FILE")"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$USER_ID" ]; then
  echo "Signup failed."
  cat "$SIGNUP_FILE"
  exit 1
fi

jq -c '.textEntries[]' "$FIXTURE_FILE" | while IFS= read -r rawTextJson; do
  rawText="$(printf '%s' "$rawTextJson" | jq -r '.')"
  PAYLOAD="$(jq -nc --arg rawText "$rawText" --arg capturedAt "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '{rawText:$rawText,capturedAt:$capturedAt}')"
  STATUS="$(curl -sS -o "$ENTRY_FILE" -w "%{http_code}" "$API_URL/functions/v1/process-entry" \
    -H "apikey: $API_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD")"

  if [ "$STATUS" != "200" ]; then
    echo "FAIL quality-review: process-entry failed for fixture text (HTTP $STATUS)"
    cat "$ENTRY_FILE"
    exit 1
  fi
done

TODAY_UTC="$(date -u +%Y-%m-%d)"

curl -sS "$API_URL/rest/v1/entries_normalized?select=id,raw_entry_id,title,body,summary_short,created_at&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$NORMALIZED_FILE"

curl -sS "$API_URL/rest/v1/entries_raw?select=id,source_type,raw_text,transcript_text,captured_at&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$RAW_FILE"

curl -sS "$API_URL/rest/v1/day_journals?select=id,journal_date,summary,narrative_text,sections&user_id=eq.$USER_ID&journal_date=eq.$TODAY_UTC" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$DAY_FILE"

WEEK_STATUS="$(curl -sS -o "$WEEK_FILE" -w "%{http_code}" "$API_URL/functions/v1/generate-reflection" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"periodType\":\"week\",\"anchorDate\":\"$TODAY_UTC\",\"forceRegenerate\":true}")"

MONTH_STATUS="$(curl -sS -o "$MONTH_FILE" -w "%{http_code}" "$API_URL/functions/v1/generate-reflection" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"periodType\":\"month\",\"anchorDate\":\"$TODAY_UTC\",\"forceRegenerate\":true}")"

if [ "$WEEK_STATUS" != "200" ] || [ "$MONTH_STATUS" != "200" ]; then
  echo "FAIL quality-review: generate-reflection failed (week=$WEEK_STATUS month=$MONTH_STATUS)"
  echo "week response:"
  cat "$WEEK_FILE"
  echo "month response:"
  cat "$MONTH_FILE"
  exit 1
fi

WEEK_REFLECTION_ID="$(jq -r '.reflectionId // empty' "$WEEK_FILE")"
MONTH_REFLECTION_ID="$(jq -r '.reflectionId // empty' "$MONTH_FILE")"

curl -sS "$API_URL/rest/v1/period_reflections?select=id,period_type,summary_text,highlights_json,reflection_points_json&user_id=eq.$USER_ID&id=eq.$WEEK_REFLECTION_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$WEEK_ROW_FILE"

curl -sS "$API_URL/rest/v1/period_reflections?select=id,period_type,summary_text,highlights_json,reflection_points_json&user_id=eq.$USER_ID&id=eq.$MONTH_REFLECTION_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$MONTH_ROW_FILE"

FIXTURE_FILE="$FIXTURE_FILE" \
NORMALIZED_FILE="$NORMALIZED_FILE" \
RAW_FILE="$RAW_FILE" \
DAY_FILE="$DAY_FILE" \
WEEK_ROW_FILE="$WEEK_ROW_FILE" \
MONTH_ROW_FILE="$MONTH_ROW_FILE" \
node <<'NODE'
const fs = require('node:fs');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const fixture = readJson(process.env.FIXTURE_FILE);
const normalizedRows = readJson(process.env.NORMALIZED_FILE);
const rawRows = readJson(process.env.RAW_FILE);
const dayRows = readJson(process.env.DAY_FILE);
const weekRows = readJson(process.env.WEEK_ROW_FILE);
const monthRows = readJson(process.env.MONTH_ROW_FILE);

const heavy = (fixture.heavyPhrases ?? []).map((value) => String(value).toLowerCase());
const generic = (fixture.genericPhrases ?? []).map((value) => String(value).toLowerCase());
const narrativeGeneric = (fixture.narrativeGenericPhrases ?? []).map((value) => String(value).toLowerCase());
const narrativeBridges = (fixture.narrativeBridgePhrases ?? []).map((value) => String(value).toLowerCase());
const firstPersonMarkers = (fixture.firstPersonMarkers ?? []).map((value) => String(value).toLowerCase());
const thirdPersonStarts = (fixture.thirdPersonStarts ?? []).map((value) => String(value).toLowerCase());
const reportLikeSummaryPhrases = (fixture.reportLikeSummaryPhrases ?? [
  'dagboeknotities over',
  'notities over',
  'samenvatting van de notities',
  'overzicht van de notities',
  'dagrapport',
  'rapportregel',
  'archiefregel',
]).map((value) => String(value).toLowerCase());
const requiredNarrativeGroups = Array.isArray(fixture.requiredNarrativeGroups) ? fixture.requiredNarrativeGroups : [];
const normalizationRegressionCases = Array.isArray(fixture.normalizationRegressionCases)
  ? fixture.normalizationRegressionCases
  : [];
const newlineNormalizationCases = Array.isArray(fixture.newlineNormalizationCases)
  ? fixture.newlineNormalizationCases
  : [];
const audioMarker = String(fixture.audioFallbackMarker ?? '').toLowerCase();
const normalizationClaimPhrases = [
  'daarom',
  'dus',
  'conclusie',
  'het liet zien dat',
  'dat maakte duidelijk dat',
  'uiteindelijk bleek',
];
const uncertaintyCues = ['uh', 'eh', 'denk', 'volgens mij', 'of zo', 'misschien'];
const previewMetaStarts = (fixture.previewMetaStarts ?? [
  'de gebruiker',
  'er wordt beschreven',
  'de notitie gaat over',
  'in deze notitie',
]).map((value) => String(value).toLowerCase());

const results = [];
let hardFails = 0;

function add(level, scope, message) {
  results.push({ level, scope, message });
  if (level === 'FAIL') {
    hardFails += 1;
  }
}

function norm(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function rawText(value) {
  return String(value ?? '').replace(/\r/g, '');
}

function hasHeavy(value) {
  const text = norm(value);
  return heavy.some((phrase) => phrase && text.includes(phrase));
}

function looksGeneric(value) {
  const text = norm(value);
  if (text.length < 12) {
    return true;
  }
  return generic.some((phrase) => phrase && text.includes(phrase));
}

function looksMetaPreview(value) {
  const text = norm(value);
  return previewMetaStarts.some((prefix) => prefix && text.startsWith(prefix));
}

function looksSummaryLikeBody(value) {
  const text = norm(value);
  return (
    text.startsWith('samenvatting') ||
    text.startsWith('algemene samenvatting') ||
    text.startsWith('de notitie gaat over') ||
    text.startsWith('de gebruiker')
  );
}

function hasNarrativeGenericTone(value) {
  const text = norm(value);
  return narrativeGeneric.some((phrase) => phrase && text.includes(phrase));
}

function hasForbiddenNarrativeBridge(value) {
  const text = norm(value);
  return narrativeBridges.some((phrase) => phrase && text.includes(phrase));
}

function looksReportLikeSummary(value) {
  const text = norm(value);
  if (!text) {
    return false;
  }
  if (/^(dagboeknotities|notities|dagrapport|rapport|dossier)\b/.test(text)) {
    return true;
  }
  return reportLikeSummaryPhrases.some((phrase) => phrase && text.includes(phrase));
}

function looksTruncatedNarrative(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return false;
  }
  if (/[.!?]$/.test(trimmed)) {
    return false;
  }
  if (/[,;:]$/.test(trimmed)) {
    return true;
  }
  const tail = norm(trimmed.slice(-36));
  return [' en', ' maar', ' omdat', ' terwijl', ' toen', ' dat', ' die', ' dus', ' waardoor', ' waarna', ' zodat']
    .some((suffix) => tail.endsWith(suffix));
}

function firstSentence(value) {
  return norm(String(value ?? '').split(/[.!?]/)[0] ?? '');
}

function tokensForOverlap(value) {
  return Array.from(
    new Set(
      norm(value)
        .split(/[^a-z0-9]+/i)
        .filter((token) => token.length >= 5)
    )
  );
}

function hasStrongOverlap(left, right) {
  const leftTokens = tokensForOverlap(left);
  const rightTokens = tokensForOverlap(right);
  if (leftTokens.length < 3 || rightTokens.length < 3) {
    return false;
  }
  const set = new Set(leftTokens);
  const overlap = rightTokens.filter((token) => set.has(token)).length;
  return overlap >= Math.max(3, Math.floor(rightTokens.length * 0.6));
}

function looksStitchedNarrative(narrativeRaw, normalizedBodies) {
  if (!Array.isArray(normalizedBodies) || normalizedBodies.length < 4) {
    return false;
  }
  const paragraphs = String(narrativeRaw ?? '')
    .split(/\n\s*\n+/)
    .map((paragraph) => firstSentence(paragraph))
    .filter(Boolean);
  const entryOpenings = normalizedBodies.map(firstSentence).filter(Boolean);
  if (paragraphs.length < 3 || entryOpenings.length < 4) {
    return false;
  }
  if (paragraphs.length < entryOpenings.length - 1) {
    return false;
  }
  const compareLength = Math.min(paragraphs.length, entryOpenings.length);
  let sequentialMatches = 0;
  for (let index = 0; index < compareLength; index += 1) {
    if (hasStrongOverlap(paragraphs[index], entryOpenings[index])) {
      sequentialMatches += 1;
    }
  }
  return sequentialMatches >= Math.min(3, entryOpenings.length - 1);
}

function hasFirstPersonCue(value) {
  const text = ` ${norm(value)} `;
  return firstPersonMarkers.some((marker) => marker && text.includes(marker));
}

function startsThirdPersonish(value) {
  const text = norm(value);
  return thirdPersonStarts.some((prefix) => prefix && text.startsWith(prefix));
}

function tokenize(value) {
  return Array.from(
    new Set(
      norm(value)
        .split(/[^a-z0-9]+/i)
        .filter((token) => token.length >= 6)
    )
  );
}

function countDoubleBreaks(value) {
  const matches = String(value ?? '').match(/\n\n/g);
  return matches ? matches.length : 0;
}

function sourceTextForRawRow(row) {
  if (!row || typeof row !== 'object') {
    return '';
  }
  const sourceType = String(row.source_type ?? '').toLowerCase();
  const transcript = String(row.transcript_text ?? '').trim();
  const raw = String(row.raw_text ?? '').trim();
  return sourceType === 'audio' ? transcript || raw : raw || transcript;
}

const validNormalized = Array.isArray(normalizedRows) ? normalizedRows : [];
const validRaw = Array.isArray(rawRows) ? rawRows : [];
const rawById = new Map(validRaw.map((row) => [String(row.id), row]));
const normalizedByRawId = new Map(validNormalized.map((row) => [String(row.raw_entry_id), row]));
if (validNormalized.length === 0) {
  add('FAIL', 'entry', 'Geen normalized entries gevonden.');
} else {
  const emptyRows = validNormalized.filter((row) => !norm(row.title) || !norm(row.body));
  if (emptyRows.length > 0) {
    add('FAIL', 'entry', `Lege title/body gevonden in ${emptyRows.length} normalized entries.`);
  }

  const titleKeys = new Set();
  let duplicateTitles = 0;
  for (const row of validNormalized) {
    const key = norm(row.title);
    if (titleKeys.has(key)) {
      duplicateTitles += 1;
    }
    titleKeys.add(key);
  }
  if (duplicateTitles > 0) {
    add('WARN', 'entry', `Dubbele normalized titels gedetecteerd: ${duplicateTitles}.`);
  } else {
    add('PASS', 'entry', 'Normalized titels/body aanwezig en bruikbaar.');
  }

  const emptySummaryShortRows = validNormalized.filter((row) => !norm(row.summary_short));
  if (emptySummaryShortRows.length > 0) {
    add('FAIL', 'entry', `Lege summary_short gevonden in ${emptySummaryShortRows.length} normalized entries.`);
  }

  const tooLongSummaryShortRows = validNormalized.filter((row) => norm(row.summary_short).length > 180);
  if (tooLongSummaryShortRows.length > 0) {
    add('FAIL', 'entry', `summary_short is te lang in ${tooLongSummaryShortRows.length} normalized entries.`);
  }

  const metaSummaryShortRows = validNormalized.filter((row) => looksMetaPreview(row.summary_short));
  if (metaSummaryShortRows.length > 0) {
    add('FAIL', 'entry', `summary_short bevat meta-formulering in ${metaSummaryShortRows.length} normalized entries.`);
  }

  const genericSummaryShortRows = validNormalized.filter((row) => looksGeneric(row.summary_short));
  if (genericSummaryShortRows.length > 0) {
    add('FAIL', 'entry', `summary_short lijkt te generiek in ${genericSummaryShortRows.length} normalized entries.`);
  }

  const questionSummaryShortRows = validNormalized.filter((row) =>
    String(row.summary_short ?? '').trim().endsWith('?')
  );
  if (questionSummaryShortRows.length > 0) {
    add('FAIL', 'entry', `summary_short staat in vraagvorm in ${questionSummaryShortRows.length} normalized entries.`);
  }

  const bodyLikeSummaryShortRows = validNormalized.filter((row) => {
    const bodyLength = norm(row.body).length;
    const summaryShortLength = norm(row.summary_short).length;
    return bodyLength >= 220 && summaryShortLength >= Math.floor(bodyLength * 0.85);
  });
  if (bodyLikeSummaryShortRows.length > 0) {
    add('FAIL', 'entry', `summary_short lijkt te veel op volledige body in ${bodyLikeSummaryShortRows.length} normalized entries.`);
  } else if (emptySummaryShortRows.length === 0) {
    add('PASS', 'entry', 'summary_short is compact en bruikbaar voor entry previews.');
  }

  const longRows = validNormalized
    .map((row) => {
      const rawRow = rawById.get(String(row.raw_entry_id));
      const sourceText = sourceTextForRawRow(rawRow);
      return {
        row,
        sourceText,
        sourceLength: norm(sourceText).length,
        normalizedLength: norm(row.body).length,
      };
    })
    .filter((item) => item.sourceLength >= 500 && !norm(item.sourceText).includes(audioMarker));

  if (longRows.length > 0) {
    const compressed = longRows.filter(
      (item) => item.normalizedLength < Math.floor(item.sourceLength * 0.8)
    );
    if (compressed.length > 0) {
      add(
        'FAIL',
        'entry',
        `Normalized body lijkt ingekort bij ${compressed.length} lange entries (verwacht >=80% van bronlengte).`
      );
    } else {
      add('PASS', 'entry', 'Lange entries behouden voldoende lengte in normalized body.');
    }

    const lowOverlap = longRows.filter((item) => {
      const sourceTokens = tokenize(item.sourceText).slice(0, 12);
      if (sourceTokens.length < 4) {
        return false;
      }
      const normalizedText = norm(item.row.body);
      const overlapCount = sourceTokens.filter((token) => normalizedText.includes(token)).length;
      return overlapCount < 3;
    });

    if (lowOverlap.length > 0) {
      add('FAIL', 'entry', `Normalized body verliest te veel bronwoorden bij ${lowOverlap.length} lange entries.`);
    } else {
      add('PASS', 'entry', 'Lange entries blijven bronnabij qua kernwoorden.');
    }

    const summaryLikeBodies = longRows.filter((item) => looksSummaryLikeBody(item.row.body));
    if (summaryLikeBodies.length > 0) {
      add('FAIL', 'entry', `Normalized body oogt samenvattend bij ${summaryLikeBodies.length} lange entries.`);
    }
  } else {
    add('WARN', 'entry', 'Geen lange bronentries gevonden voor compressiecheck.');
  }

  for (const regressionCase of normalizationRegressionCases) {
    const label = String(regressionCase?.label ?? 'normalization-case');
    const marker = norm(regressionCase?.marker ?? '');
    if (!marker) {
      continue;
    }
    const requiredBodyTokens = Array.isArray(regressionCase?.requiredBodyTokens)
      ? regressionCase.requiredBodyTokens.map((value) => norm(value)).filter(Boolean)
      : [];
    const forbiddenBodyPhrases = Array.isArray(regressionCase?.forbiddenBodyPhrases)
      ? regressionCase.forbiddenBodyPhrases.map((value) => norm(value)).filter(Boolean)
      : [];
    const minOverlap = Number.isFinite(Number(regressionCase?.minOverlap)) ? Number(regressionCase.minOverlap) : 0.45;
    const requiresUncertaintyCue = Boolean(regressionCase?.requiresUncertaintyCue);

    const rawRow = validRaw.find((row) => sourceTextForRawRow(row).toLowerCase().includes(marker));
    if (!rawRow) {
      add('FAIL', 'entry', `Normalisatie-regressie mist raw entry voor case ${label}.`);
      continue;
    }

    const normalizedRow = normalizedByRawId.get(String(rawRow.id));
    if (!normalizedRow) {
      add('FAIL', 'entry', `Normalisatie-regressie mist normalized entry voor case ${label}.`);
      continue;
    }

    const source = sourceTextForRawRow(rawRow);
    const body = String(normalizedRow.body ?? '');
    const sourceNorm = norm(source);
    const bodyNorm = norm(body);
    const tokenOverlap = (() => {
      const sourceTokens = tokenize(sourceNorm).filter((token) => token.length >= 4);
      if (sourceTokens.length === 0) return 1;
      const bodySet = new Set(tokenize(bodyNorm));
      const hits = sourceTokens.filter((token) => bodySet.has(token)).length;
      return hits / sourceTokens.length;
    })();

    const missingRequired = requiredBodyTokens.filter((token) => !bodyNorm.includes(token));
    if (missingRequired.length > 0) {
      add('FAIL', 'entry', `Normalisatie-case ${label} mist bronankers: ${missingRequired.join(', ')}.`);
    }

    const forbiddenHits = forbiddenBodyPhrases.filter((phrase) => bodyNorm.includes(phrase));
    if (forbiddenHits.length > 0) {
      add('FAIL', 'entry', `Normalisatie-case ${label} bevat verboden claims: ${forbiddenHits.join(', ')}.`);
    }

    if (tokenOverlap < minOverlap) {
      add(
        'FAIL',
        'entry',
        `Normalisatie-case ${label} wijkt te ver af van bron (overlap ${tokenOverlap.toFixed(2)} < ${minOverlap}).`
      );
    }

    if (requiresUncertaintyCue) {
      const sourceHasUncertainty = uncertaintyCues.some((cue) => sourceNorm.includes(cue));
      const bodyHasUncertainty = uncertaintyCues.some((cue) => bodyNorm.includes(cue));
      if (sourceHasUncertainty && !bodyHasUncertainty) {
        add('FAIL', 'entry', `Normalisatie-case ${label} verloor alle onzekerheidscues uit de bron.`);
      }
    }

    const addedClaim = normalizationClaimPhrases.some(
      (phrase) => bodyNorm.includes(phrase) && !sourceNorm.includes(phrase)
    );
    if (addedClaim) {
      add('FAIL', 'entry', `Normalisatie-case ${label} voegt nieuwe claim/conclusietaal toe.`);
    }
  }

  for (const newlineCase of newlineNormalizationCases) {
    const label = String(newlineCase?.label ?? 'newline-case');
    const marker = String(newlineCase?.marker ?? '').trim().toLowerCase();
    if (!marker) {
      continue;
    }

    const rawRow = validRaw.find((row) => sourceTextForRawRow(row).toLowerCase().includes(marker));
    if (!rawRow) {
      add('FAIL', 'entry', `Newline-regressie mist raw entry voor case ${label}.`);
      continue;
    }

    const normalizedRow = normalizedByRawId.get(String(rawRow.id));
    if (!normalizedRow) {
      add('FAIL', 'entry', `Newline-regressie mist normalized entry voor case ${label}.`);
      continue;
    }

    const bodyRaw = rawText(normalizedRow.body);
    const mustContain = Array.isArray(newlineCase?.mustContain)
      ? newlineCase.mustContain.map((value) => String(value)).filter(Boolean)
      : [];

    for (const required of mustContain) {
      if (!bodyRaw.includes(required)) {
        add('FAIL', 'entry', `Newline-case ${label} mist verplichte tekst: ${required}.`);
      }
    }

    const expectedDoubleBreaks = Number.isFinite(Number(newlineCase?.expectedDoubleBreaks))
      ? Number(newlineCase.expectedDoubleBreaks)
      : null;
    if (expectedDoubleBreaks !== null && countDoubleBreaks(bodyRaw) !== expectedDoubleBreaks) {
      add(
        'FAIL',
        'entry',
        `Newline-case ${label} verwacht ${expectedDoubleBreaks} dubbele newline(s), kreeg ${countDoubleBreaks(bodyRaw)}.`
      );
    }

    if (newlineCase?.forbidTripleBreak && /\n{3,}/.test(bodyRaw)) {
      add('FAIL', 'entry', `Newline-case ${label} bevat nog 3+ opeenvolgende newlines.`);
    }
  }
}

const dayRow = Array.isArray(dayRows) && dayRows.length > 0 ? dayRows[0] : null;
if (!dayRow) {
  add('FAIL', 'day-journal', 'Geen day journal gevonden voor vandaag.');
} else {
  const summaryRaw = rawText(dayRow.summary);
  const narrativeRaw = rawText(dayRow.narrative_text);
  const summary = norm(summaryRaw);
  const narrative = norm(narrativeRaw);
  const sections = Array.isArray(dayRow.sections) ? dayRow.sections.map(norm).filter(Boolean) : [];
  const normalizedBodies = validNormalized.map((row) => norm(row.body)).filter(Boolean);
  const sourceTextCombined = validRaw.map(sourceTextForRawRow).join('\n\n');

  if (!summary) {
    add('FAIL', 'day-journal', 'Day journal summary is leeg.');
  }
  if (!narrative) {
    add('FAIL', 'day-journal', 'Day journal narrative_text is leeg.');
  }

  if (hasHeavy(summary) || hasHeavy(narrative) || sections.some(hasHeavy)) {
    add('WARN', 'day-journal', 'Zware/therapeutische formulering gevonden in day journal output.');
  }

  if (
    audioMarker &&
    (summary.includes(audioMarker) ||
      narrative.includes(audioMarker) ||
      sections.some((section) => section.includes(audioMarker)))
  ) {
    add('FAIL', 'day-journal', 'Audio fallback marker lekt door in day journal output.');
  }

  const uniqueSections = new Set(sections);
  if (sections.length > uniqueSections.size) {
    add('WARN', 'day-journal', 'Dubbele sections gevonden in day journal output.');
  }

  if (summary && narrative && summary === narrative) {
    add('WARN', 'day-journal', 'Summary en narrative_text zijn identiek; narrative laag mist eigen verhaal.');
  }

  if (summary && narrative && summary.length >= Math.floor(narrative.length * 0.75)) {
    add('WARN', 'day-journal', 'Summary is te lang ten opzichte van narrative_text.');
  }

  if (looksReportLikeSummary(summary)) {
    add('WARN', 'day-journal', 'Summary klinkt als rapport-/archiefregel in plaats van dagschets.');
  }

  if (looksTruncatedNarrative(narrativeRaw)) {
    add('WARN', 'day-journal', 'Narrative_text lijkt afgekapt of eindigt midden in een zin.');
  }

  if (summary.length > 280) {
    add('WARN', 'day-journal', 'Day journal summary is te lang voor een compacte dagschets.');
  }

  if (narrative && normalizedBodies.length > 0) {
    const hasSourceOverlap = normalizedBodies.some((body) => {
      const tokens = body.split(' ').filter((token) => token.length >= 6).slice(0, 8);
      return tokens.some((token) => narrative.includes(token));
    });
    if (!hasSourceOverlap) {
      add('WARN', 'day-journal', 'Narrative_text lijkt weinig overlap te hebben met bronentries.');
    }
  }

  if (hasNarrativeGenericTone(narrative)) {
    add('WARN', 'day-journal', 'Narrative_text heeft generieke samenvattingstoon.');
  }

  if (hasForbiddenNarrativeBridge(narrative)) {
    add('WARN', 'day-journal', 'Narrative_text bevat een verzonnen brugzin of causale overgang.');
  }

  if (startsThirdPersonish(narrative)) {
    add('WARN', 'day-journal', 'Narrative_text begint in verslaggever-/derdepersoonstoon.');
  }

  if (hasFirstPersonCue(sourceTextCombined) && !hasFirstPersonCue(narrative)) {
    add('WARN', 'day-journal', 'Narrative_text mist ik-vorm terwijl de bron die wel heeft.');
  }

  for (const group of requiredNarrativeGroups) {
    const label = String(group?.label ?? 'onbekende-groep');
    const tokens = Array.isArray(group?.tokens) ? group.tokens.map((value) => norm(value)).filter(Boolean) : [];
    if (tokens.length === 0) {
      continue;
    }

    const missing = tokens.filter((token) => !narrative.includes(token));
    if (missing.length > 0) {
      add('WARN', 'day-journal', `Narrative_text mist bronankers voor ${label}: ${missing.join(', ')}.`);
    }
  }

  if (requiredNarrativeGroups.length > 0 && narrative.length >= 260 && !narrativeRaw.includes('\n\n')) {
    add('WARN', 'day-journal', 'Narrative_text mist alinea-indeling ondanks meerdere duidelijke dagmomenten.');
  }

  if (looksStitchedNarrative(narrativeRaw, validNormalized.map((row) => String(row.body ?? '')))) {
    add('WARN', 'day-journal', 'Narrative_text lijkt te veel op een geplakte entry-volgorde.');
  }

  if (looksGeneric(summary)) {
    add('WARN', 'day-journal', 'Day journal summary oogt generiek.');
  } else {
    add('PASS', 'day-journal', 'Day journal summary oogt concreet en feitelijk.');
  }

  if (narrative && !looksGeneric(narrative)) {
    add('PASS', 'day-journal', 'Day journal narrative_text oogt brongebonden en bruikbaar.');
  }
}

function reviewReflection(rows, label) {
  const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (!row) {
    add('FAIL', label, 'Reflection row niet gevonden.');
    return;
  }

  const summary = norm(row.summary_text);
  const highlights = Array.isArray(row.highlights_json) ? row.highlights_json.map(norm).filter(Boolean) : [];
  const points = Array.isArray(row.reflection_points_json)
    ? row.reflection_points_json.map(norm).filter(Boolean)
    : [];
  const todoLikePointPatterns = [/^(doe|plan|maak|ga|probeer|zorg|hou|houd|zet|schrijf|werk)\b/i, /\bto[- ]?do\b/i, /\bactiepunt\b/i];
  const patternSignals = ['terugker', 'patroon', 'thema', 'verschuiving', 'spanning', 'ritme', 'lijn'];

  if (!summary) {
    add('FAIL', label, 'Summary_text is leeg.');
  }
  if (highlights.length === 0) {
    add('WARN', label, 'Geen highlights gevonden.');
  }
  if (points.length === 0) {
    add('WARN', label, 'Geen reflection points gevonden.');
  }

  const todoLikePoints = points.filter((point) => todoLikePointPatterns.some((pattern) => pattern.test(point)));
  if (points.length > 0 && todoLikePoints.length >= Math.ceil(points.length * 0.6)) {
    add('FAIL', label, 'Reflection points lijken te veel op todo/actiepunten.');
  }

  const combined = [summary, ...highlights, ...points].join(' ');
  const hasPatternSignal = patternSignals.some((signal) => combined.includes(signal));
  if (!hasPatternSignal) {
    add('WARN', label, 'Reflectie benoemt weinig expliciete patroon-/verschuivingssignalen.');
  }

  const heavyHit = [summary, ...highlights, ...points].some(hasHeavy);
  const markerLeak =
    audioMarker &&
    [summary, ...highlights, ...points].some((value) => value.includes(audioMarker));

  if (markerLeak) {
    add('FAIL', label, 'No-speech/fallbackmarker lekt door in reflectie-output.');
    return;
  }

  if (heavyHit) {
    add('FAIL', label, 'Zware/therapeutische formulering gevonden.');
  } else if (looksGeneric(summary)) {
    add('WARN', label, 'Summary lijkt generiek of vaag.');
  } else {
    add('PASS', label, 'Reflection summary/points bruikbaar en rustig.');
  }
}

reviewReflection(weekRows, 'reflection-week');
reviewReflection(monthRows, 'reflection-month');

for (const item of results) {
  console.log(`${item.level} [${item.scope}] ${item.message}`);
}

if (hardFails > 0) {
  process.exit(1);
}
NODE

FIXTURE_FILE="$FIXTURE_FILE" \
DAY_HELPER_FILE="$ROOT_DIR/supabase/functions/_shared/day-journal-contract.mjs" \
PROCESS_ENTRY_FILE="$ROOT_DIR/supabase/functions/process-entry/index.ts" \
node <<'NODE'
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

async function main() {
  const fixture = JSON.parse(fs.readFileSync(process.env.FIXTURE_FILE, 'utf8'));
  const helperUrl = pathToFileURL(process.env.DAY_HELPER_FILE).href;
  const helper = await import(helperUrl);
  const regression = fixture.fallbackRegression;
  const defaultValidationRegression = fixture.defaultValidationRegression;
  const strictValidationRegression = fixture.strictValidationRegression;
  const compressionSignalRegression = fixture.compressionSignalRegression;
  const compositionQualityRegression = fixture.compositionQualityRegression;
  const meaningfulClusterCoverageRegression = fixture.meaningfulClusterCoverageRegression;

  if (!regression || !Array.isArray(regression.entries) || regression.entries.length === 0) {
    throw new Error('Missing fallbackRegression fixture.');
  }

  const draft = helper.createFallbackDayJournal(regression.entries);
  const narrative = String(draft.narrativeText ?? '').trim();
  const summary = String(draft.summary ?? '').trim();
  const sections = Array.isArray(draft.sections) ? draft.sections : [];
  const narrativeTokens = Array.isArray(regression.narrativeTokens) ? regression.narrativeTokens : [];
  const summaryTokens = Array.isArray(regression.summaryTokens) ? regression.summaryTokens : [];

  if (!narrative) {
    throw new Error('Fallback narrative is leeg.');
  }
  if (!summary) {
    throw new Error('Fallback summary is leeg.');
  }
  if (summary.length >= narrative.length) {
    throw new Error('Fallback summary is niet compacter dan fallback narrative.');
  }
  if (!narrative.includes('\n\n')) {
    throw new Error('Fallback narrative mist alinea-indeling.');
  }
  if (summary === narrative) {
    throw new Error('Fallback summary en narrative zijn identiek.');
  }

  for (const token of narrativeTokens) {
    if (!String(narrative).toLowerCase().includes(String(token).toLowerCase())) {
      throw new Error(`Fallback narrative mist token: ${token}`);
    }
  }

  for (const token of summaryTokens) {
    if (!String(summary).toLowerCase().includes(String(token).toLowerCase())) {
      throw new Error(`Fallback summary mist token: ${token}`);
    }
  }

  const forbiddenBridgePhrases = [
    'later op de dag',
    'uiteindelijk bleek',
    'daarna werd duidelijk',
    'gaandeweg bleek',
    'het liet zien dat',
    'dat maakte duidelijk dat',
  ];
  const forbiddenCategoryPhrases = ['je zou', 'het helpt om', 'kan helpen om', 'uit de notities blijkt'];
  const narrativeLower = narrative.toLowerCase();
  const summaryLower = summary.toLowerCase();

  if (forbiddenBridgePhrases.some((phrase) => narrativeLower.includes(phrase))) {
    throw new Error('Fallback narrative bevat verboden brugzin.');
  }
  if (forbiddenCategoryPhrases.some((phrase) => narrativeLower.includes(phrase) || summaryLower.includes(phrase))) {
    throw new Error('Fallback output bevat verboden categorie.');
  }
  if (sections.length === 0) {
    throw new Error('Fallback sections zijn leeg.');
  }

  console.log('PASS [fallback] Fallback narrative/summary respecteren contractscheiding.');

  if (!defaultValidationRegression || !Array.isArray(defaultValidationRegression.entries)) {
    throw new Error('Missing defaultValidationRegression fixture.');
  }
  const defaultValidationResult = helper.finalizeDayJournalDraft({
    aiResult: defaultValidationRegression.aiResult,
    entries: defaultValidationRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (defaultValidationResult.usedFallback) {
    throw new Error('Default mode: bronterm-case viel onterecht terug op fallback.');
  }
  if (defaultValidationResult.rejectionReasons.includes('forbidden_category')) {
    throw new Error('Default mode: bronterm-case kreeg onterechte forbidden_category reject.');
  }
  console.log('PASS [validation] Default mode accepteert bronterm-case zonder blind woordblok.');

  if (!strictValidationRegression || !Array.isArray(strictValidationRegression.entries)) {
    throw new Error('Missing strictValidationRegression fixture.');
  }
  const strictValidationResult = helper.finalizeDayJournalDraft({
    aiResult: strictValidationRegression.aiResult,
    entries: strictValidationRegression.entries,
    options: {
      strictValidation: true,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (strictValidationResult.usedFallback) {
    throw new Error('Strict mode zonder soft guards: content-signalen mogen geen hard fallback triggeren.');
  }
  if (!strictValidationResult.softQualitySignals.includes('forbidden_category')) {
    throw new Error('Strict mode zonder soft guards: expected forbidden_category als soft signal.');
  }
  console.log('PASS [validation] Strict mode houdt content-signalen soft bij disabled guards.');

  if (!compressionSignalRegression || !Array.isArray(compressionSignalRegression.entries)) {
    throw new Error('Missing compressionSignalRegression fixture.');
  }
  const compressionResult = helper.finalizeDayJournalDraft({
    aiResult: compressionSignalRegression.aiResult,
    entries: compressionSignalRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (compressionResult.usedFallback) {
    throw new Error('Compression case viel direct terug op fallback; verwacht quality-signal zonder directe fallback.');
  }
  if (!compressionResult.narrativeQualityReasons.includes('compressed_narrative')) {
    throw new Error('Compression case mist compressed_narrative quality-signal.');
  }
  if (compressionResult.narrativeHardRejectReasons.length > 0) {
    throw new Error('Compression case gaf onterechte hard reject redenen.');
  }
  console.log('PASS [validation] Overcompressie wordt als quality-signal behandeld (geen directe fallback).');

  if (!compositionQualityRegression || !Array.isArray(compositionQualityRegression.entries)) {
    throw new Error('Missing compositionQualityRegression fixture.');
  }

  const stitchedBad = helper.finalizeDayJournalDraft({
    aiResult: compositionQualityRegression.aiResultStitchedBad,
    entries: compositionQualityRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (stitchedBad.usedFallback) {
    throw new Error('Stitched case viel direct terug op fallback; verwacht quality-signal voor retry-pad.');
  }
  if (!stitchedBad.narrativeQualityReasons.includes('stitched_narrative')) {
    throw new Error('Stitched case mist stitched_narrative quality-signal.');
  }

  const compositionGood = helper.finalizeDayJournalDraft({
    aiResult: compositionQualityRegression.aiResultGood,
    entries: compositionQualityRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (compositionGood.usedFallback) {
    throw new Error('Goede compositiecase viel onterecht terug op fallback.');
  }
  if (compositionGood.narrativeQualityReasons.includes('stitched_narrative')) {
    throw new Error('Goede compositiecase kreeg onterecht stitched_narrative.');
  }

  const reportLikeSummary = helper.finalizeDayJournalDraft({
    aiResult: compositionQualityRegression.aiResultReportLikeSummary,
    entries: compositionQualityRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (reportLikeSummary.usedFallbackSummary) {
    throw new Error('Report-like summary mag bij disabled soft guards geen summary fallback triggeren.');
  }
  if (!reportLikeSummary.softQualitySignals.includes('report_like_summary')) {
    throw new Error('Report-like summary mist soft signal bij disabled guards.');
  }

  const truncatedNarrative = helper.finalizeDayJournalDraft({
    aiResult: compositionQualityRegression.aiResultTruncatedNarrative,
    entries: compositionQualityRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (!truncatedNarrative.narrativeQualityReasons.includes('truncated_narrative')) {
    throw new Error('Truncated case mist truncated_narrative quality-signal.');
  }
  if (truncatedNarrative.usedFallback) {
    throw new Error('Truncated case viel direct terug op fallback; verwacht quality-signal voor retry-pad.');
  }
  console.log('PASS [validation] Compositie-signalen detecteren stitched/report-like/truncated cases correct.');

  const summaryOnlyBad = helper.finalizeDayJournalDraft({
    aiResult: {
      summary: '',
      narrativeText: defaultValidationRegression.aiResult.narrativeText,
      sections: defaultValidationRegression.aiResult.sections,
    },
    entries: defaultValidationRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (!summaryOnlyBad.usedFallback) {
    throw new Error('Hard invalid summary (trim-empty) moet fallback blijven triggeren.');
  }
  if (!summaryOnlyBad.hardRejectReasons.includes('missing_summary')) {
    throw new Error('Hard invalid summary mist missing_summary hard reason.');
  }

  const sectionsOnlyBad = helper.finalizeDayJournalDraft({
    aiResult: {
      summary: defaultValidationRegression.aiResult.summary,
      narrativeText: defaultValidationRegression.aiResult.narrativeText,
      sections: [],
    },
    entries: defaultValidationRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (sectionsOnlyBad.usedFallback) {
    throw new Error('Lege sections-array is structureel geldig en mag niet fallbacken.');
  }
  if (!Array.isArray(sectionsOnlyBad.sections)) {
    throw new Error('Sections moeten array blijven.');
  }
  console.log('PASS [validation] Hard-only contract werkt: lege sections geldig, lege summary hard invalid.');

  const softOnCase = helper.finalizeDayJournalDraft({
    aiResult: compositionQualityRegression.aiResultReportLikeSummary,
    entries: compositionQualityRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: true,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (!softOnCase.usedFallbackSummary || !softOnCase.summaryFallbackReasons.includes('report_like_summary')) {
    throw new Error('Soft guards ON: report_like_summary moet summary fallback blijven triggeren.');
  }
  console.log('PASS [validation] Soft guards ON behoudt bestaand soft-enforcement gedrag.');

  const hardInvalidCase = helper.finalizeDayJournalDraft({
    aiResult: {
      summary: 'Korte dag.',
      narrativeText: 'Ik heb gewerkt.',
    },
    entries: defaultValidationRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (!hardInvalidCase.usedFallback || !hardInvalidCase.hardRejectReasons.includes('missing_sections')) {
    throw new Error('Hard invalid case (missing sections) moet fallback triggeren.');
  }
  console.log('PASS [validation] Hard invalid structurele fouten blijven fallbacken.');

  if (!meaningfulClusterCoverageRegression || !Array.isArray(meaningfulClusterCoverageRegression.entries)) {
    throw new Error('Missing meaningfulClusterCoverageRegression fixture.');
  }

  const missingCluster = helper.finalizeDayJournalDraft({
    aiResult: meaningfulClusterCoverageRegression.aiResultMissingCluster,
    entries: meaningfulClusterCoverageRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (missingCluster.usedFallback) {
    throw new Error('Meaningful cluster missing case mag bij disabled soft guards niet fallbacken.');
  }
  if (!missingCluster.narrativeQualityReasons.includes('meaningful_cluster_missing')) {
    throw new Error('Meaningful cluster missing case mist expected soft quality signal.');
  }

  const coveredCluster = helper.finalizeDayJournalDraft({
    aiResult: meaningfulClusterCoverageRegression.aiResultCoveredCluster,
    entries: meaningfulClusterCoverageRegression.entries,
    options: {
      strictValidation: false,
      softQualityGuards: false,
      noSpeechTranscript: 'Geen spraak herkend in audio-opname.',
      lowContentTitle: 'Audio-opname zonder spraak',
    },
  });
  if (coveredCluster.narrativeQualityReasons.includes('meaningful_cluster_missing')) {
    throw new Error('Covered cluster case kreeg onterecht meaningful_cluster_missing signal.');
  }
  console.log('PASS [validation] Meaningful relationele cluster blijft als coverage-signal bewaakt (log-only).');

  const processEntrySource = fs.readFileSync(process.env.PROCESS_ENTRY_FILE, 'utf8');
  if (!processEntrySource.includes('normalized_soft_quality_not_enforced')) {
    throw new Error('Missing normalization soft-quality not-enforced logging hook.');
  }
  if (!/if\s*\(\s*!args\.softQualityGuards\s*\)\s*\{[\s\S]*normalized_soft_quality_not_enforced/.test(processEntrySource)) {
    throw new Error('Normalization soft drift case is niet expliciet gated achter softQualityGuards=false pad.');
  }
  console.log('PASS [validation] Normalization soft drift pad is log-only bij disabled soft guards.');
}

main().catch((error) => {
  console.error(`FAIL [fallback] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
NODE

echo "PASS quality-review target=$TARGET"
