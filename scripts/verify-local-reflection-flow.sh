#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

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

SIGNUP_FILE="$(mktemp)"
WEEK_FILE="$(mktemp)"
MONTH_FILE="$(mktemp)"
REFLECTIONS_FILE="$(mktemp)"
EXPECTED_FILE="$(mktemp)"

cleanup() {
  rm -f "$SIGNUP_FILE" "$WEEK_FILE" "$MONTH_FILE" "$REFLECTIONS_FILE" "$EXPECTED_FILE"
}

trap cleanup EXIT

EMAIL="verify.reflection.$(date +%s)@example.com"
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

ANCHOR_DATE="$(date -u +%Y-%m-%d)"
export USER_ID
export ANCHOR_DATE

SEED_PAYLOAD="$(
  node <<'NODE'
const userId = process.env.USER_ID;
const anchorDate = process.env.ANCHOR_DATE;
const anchor = new Date(`${anchorDate}T00:00:00.000Z`);

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function dayToIso(date) {
  return date.toISOString().slice(0, 10);
}

const day = anchor.getUTCDay();
const offsetToMonday = (day + 6) % 7;
const weekStart = addDays(anchor, -offsetToMonday);
const monthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));

const candidateDates = [
  dayToIso(weekStart),
  dayToIso(addDays(weekStart, 1)),
  dayToIso(addDays(weekStart, 3)),
  dayToIso(addDays(weekStart, 5)),
  dayToIso(addDays(monthStart, 2)),
  dayToIso(addDays(monthStart, 10)),
];

const uniqueDates = [...new Set(candidateDates)];
const payload = uniqueDates.map((journalDate, index) => ({
  user_id: userId,
  journal_date: journalDate,
  summary: `Samenvatting voor ${journalDate}`,
  sections: [`Highlight ${index + 1}`, `Actiepunt ${index + 1}`],
  updated_at: new Date().toISOString(),
}));

process.stdout.write(JSON.stringify(payload));
NODE
)"

curl -sS "$API_URL/rest/v1/day_journals" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates,return=minimal" \
  -d "$SEED_PAYLOAD" >/dev/null

WEEK_STATUS="$(curl -sS -o "$WEEK_FILE" -w "%{http_code}" "$API_URL/functions/v1/generate-reflection" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"periodType\":\"week\",\"anchorDate\":\"$ANCHOR_DATE\",\"forceRegenerate\":true}")"

if [ "$WEEK_STATUS" != "200" ]; then
  echo "generate-reflection (week) failed with HTTP $WEEK_STATUS"
  cat "$WEEK_FILE"
  exit 1
fi

MONTH_STATUS="$(curl -sS -o "$MONTH_FILE" -w "%{http_code}" "$API_URL/functions/v1/generate-reflection" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"periodType\":\"month\",\"anchorDate\":\"$ANCHOR_DATE\",\"forceRegenerate\":true}")"

if [ "$MONTH_STATUS" != "200" ]; then
  echo "generate-reflection (month) failed with HTTP $MONTH_STATUS"
  cat "$MONTH_FILE"
  exit 1
fi

curl -sS "$API_URL/rest/v1/period_reflections?select=id,period_type,period_start,period_end,summary_text&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$REFLECTIONS_FILE"

WEEK_COUNT="$(jq '[.[] | select(.period_type == "week")] | length' "$REFLECTIONS_FILE")"
MONTH_COUNT="$(jq '[.[] | select(.period_type == "month")] | length' "$REFLECTIONS_FILE")"
SUMMARY_COUNT="$(jq '[.[] | select((.summary_text // "") | length > 0)] | length' "$REFLECTIONS_FILE")"

node <<'NODE' >"$EXPECTED_FILE"
const anchorDate = process.env.ANCHOR_DATE;
const anchor = new Date(`${anchorDate}T00:00:00.000Z`);

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function dayToIso(date) {
  return date.toISOString().slice(0, 10);
}

const day = anchor.getUTCDay();
const offsetToMonday = (day + 6) % 7;
const weekStart = addDays(anchor, -offsetToMonday);
const weekEnd = addDays(weekStart, 6);

const monthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1));
const nextMonthStart = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 1));
const monthEnd = addDays(nextMonthStart, -1);

process.stdout.write(
  JSON.stringify({
    weekStart: dayToIso(weekStart),
    weekEnd: dayToIso(weekEnd),
    monthStart: dayToIso(monthStart),
    monthEnd: dayToIso(monthEnd),
  })
);
NODE

EXPECTED_WEEK_START="$(jq -r '.weekStart' "$EXPECTED_FILE")"
EXPECTED_WEEK_END="$(jq -r '.weekEnd' "$EXPECTED_FILE")"
EXPECTED_MONTH_START="$(jq -r '.monthStart' "$EXPECTED_FILE")"
EXPECTED_MONTH_END="$(jq -r '.monthEnd' "$EXPECTED_FILE")"

ACTUAL_WEEK_START="$(jq -r '.periodStart // empty' "$WEEK_FILE")"
ACTUAL_WEEK_END="$(jq -r '.periodEnd // empty' "$WEEK_FILE")"
ACTUAL_MONTH_START="$(jq -r '.periodStart // empty' "$MONTH_FILE")"
ACTUAL_MONTH_END="$(jq -r '.periodEnd // empty' "$MONTH_FILE")"

if [ "$WEEK_COUNT" -lt 1 ] || [ "$MONTH_COUNT" -lt 1 ] || [ "$SUMMARY_COUNT" -lt 2 ]; then
  echo "Reflection verification failed."
  echo "week reflections: $WEEK_COUNT"
  echo "month reflections: $MONTH_COUNT"
  echo "non-empty summaries: $SUMMARY_COUNT"
  echo "week response:"
  cat "$WEEK_FILE"
  echo "month response:"
  cat "$MONTH_FILE"
  exit 1
fi

if [ "$ACTUAL_WEEK_START" != "$EXPECTED_WEEK_START" ] || [ "$ACTUAL_WEEK_END" != "$EXPECTED_WEEK_END" ]; then
  echo "Week period bounds mismatch."
  echo "expected: $EXPECTED_WEEK_START -> $EXPECTED_WEEK_END"
  echo "actual: $ACTUAL_WEEK_START -> $ACTUAL_WEEK_END"
  exit 1
fi

if [ "$ACTUAL_MONTH_START" != "$EXPECTED_MONTH_START" ] || [ "$ACTUAL_MONTH_END" != "$EXPECTED_MONTH_END" ]; then
  echo "Month period bounds mismatch."
  echo "expected: $EXPECTED_MONTH_START -> $EXPECTED_MONTH_END"
  echo "actual: $ACTUAL_MONTH_START -> $ACTUAL_MONTH_END"
  exit 1
fi

echo "Local reflection verify flow succeeded for target=$TARGET"
echo "week reflections=$WEEK_COUNT month reflections=$MONTH_COUNT summaries=$SUMMARY_COUNT"
echo "Week response:"
cat "$WEEK_FILE"
echo "Month response:"
cat "$MONTH_FILE"
