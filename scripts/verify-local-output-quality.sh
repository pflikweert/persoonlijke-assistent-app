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

jq -r '.textEntries[]' "$FIXTURE_FILE" | while IFS= read -r rawText; do
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
const audioMarker = String(fixture.audioFallbackMarker ?? '').toLowerCase();
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

function tokenize(value) {
  return Array.from(
    new Set(
      norm(value)
        .split(/[^a-z0-9]+/i)
        .filter((token) => token.length >= 6)
    )
  );
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
      (item) => item.normalizedLength < Math.floor(item.sourceLength * 0.72)
    );
    if (compressed.length > 0) {
      add(
        'FAIL',
        'entry',
        `Normalized body lijkt ingekort bij ${compressed.length} lange entries (verwacht >=72% van bronlengte).`
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
  } else {
    add('WARN', 'entry', 'Geen lange bronentries gevonden voor compressiecheck.');
  }
}

const dayRow = Array.isArray(dayRows) && dayRows.length > 0 ? dayRows[0] : null;
if (!dayRow) {
  add('FAIL', 'day-journal', 'Geen day journal gevonden voor vandaag.');
} else {
  const summary = norm(dayRow.summary);
  const narrative = norm(dayRow.narrative_text);
  const sections = Array.isArray(dayRow.sections) ? dayRow.sections.map(norm).filter(Boolean) : [];
  const normalizedBodies = validNormalized.map((row) => norm(row.body)).filter(Boolean);

  if (!summary) {
    add('FAIL', 'day-journal', 'Day journal summary is leeg.');
  }
  if (!narrative) {
    add('FAIL', 'day-journal', 'Day journal narrative_text is leeg.');
  }

  if (hasHeavy(summary) || hasHeavy(narrative) || sections.some(hasHeavy)) {
    add('FAIL', 'day-journal', 'Zware/therapeutische formulering gevonden in day journal output.');
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

  if (narrative && normalizedBodies.length > 0) {
    const hasSourceOverlap = normalizedBodies.some((body) => {
      const tokens = body.split(' ').filter((token) => token.length >= 6).slice(0, 8);
      return tokens.some((token) => narrative.includes(token));
    });
    if (!hasSourceOverlap) {
      add('WARN', 'day-journal', 'Narrative_text lijkt weinig overlap te hebben met bronentries.');
    }
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

  if (!summary) {
    add('FAIL', label, 'Summary_text is leeg.');
  }
  if (highlights.length === 0) {
    add('WARN', label, 'Geen highlights gevonden.');
  }
  if (points.length === 0) {
    add('WARN', label, 'Geen reflection points gevonden.');
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

echo "PASS quality-review target=$TARGET"
