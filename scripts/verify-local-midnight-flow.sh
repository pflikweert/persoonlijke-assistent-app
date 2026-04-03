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
ENTRY_ONE_FILE="$(mktemp)"
ENTRY_TWO_FILE="$(mktemp)"
ENTRY_THREE_FILE="$(mktemp)"
DAY_BEFORE_FILE="$(mktemp)"
DAY_AFTER_FILE="$(mktemp)"

cleanup() {
  rm -f "$SIGNUP_FILE" "$ENTRY_ONE_FILE" "$ENTRY_TWO_FILE" "$ENTRY_THREE_FILE" "$DAY_BEFORE_FILE" "$DAY_AFTER_FILE"
}

trap cleanup EXIT

EMAIL="verify.midnight.$(date +%s)@example.com"
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

DAY_N="2026-04-04"
DAY_N1="2026-04-05"
TZ_OFFSET_MINUTES="-120"
CAPTURE_DAY_N_ISO="2026-04-04T21:50:00.000Z"
CAPTURE_MIDNIGHT_ISO="2026-04-04T22:15:00.000Z"
CAPTURE_DAY_N1_DAYTIME_ISO="2026-04-05T08:30:00.000Z"

call_process_entry() {
  output_file="$1"
  raw_text="$2"
  captured_at="$3"
  journal_date="$4"

  status="$(curl -sS -o "$output_file" -w "%{http_code}" "$API_URL/functions/v1/process-entry" \
    -H "apikey: $API_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"rawText\":\"$raw_text\",\"capturedAt\":\"$captured_at\",\"journalDate\":\"$journal_date\",\"timezoneOffsetMinutes\":$TZ_OFFSET_MINUTES}")"

  if [ "$status" != "200" ]; then
    echo "FAIL midnight-flow: process-entry returned HTTP $status"
    cat "$output_file"
    exit 1
  fi

  response_status="$(jq -r '.status // empty' "$output_file")"
  response_flow="$(jq -r '.flow // empty' "$output_file")"
  if [ "$response_status" != "ok" ] || [ "$response_flow" != "process-entry" ]; then
    echo "FAIL midnight-flow: invalid process-entry response contract"
    cat "$output_file"
    exit 1
  fi
}

call_process_entry "$ENTRY_ONE_FILE" "Midnight verify day N" "$CAPTURE_DAY_N_ISO" "$DAY_N"
JOURNAL_DATE_ONE="$(jq -r '.journalDate // empty' "$ENTRY_ONE_FILE")"
if [ "$JOURNAL_DATE_ONE" != "$DAY_N" ]; then
  echo "FAIL midnight-flow: first entry journalDate mismatch (expected $DAY_N got $JOURNAL_DATE_ONE)"
  cat "$ENTRY_ONE_FILE"
  exit 1
fi

curl -sS "$API_URL/rest/v1/day_journals?select=id,journal_date,updated_at&user_id=eq.$USER_ID&journal_date=eq.$DAY_N" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$DAY_BEFORE_FILE"

DAY_N_UPDATED_AT_BEFORE="$(jq -r '.[0].updated_at // empty' "$DAY_BEFORE_FILE")"
if [ -z "$DAY_N_UPDATED_AT_BEFORE" ]; then
  echo "FAIL midnight-flow: day journal for $DAY_N missing after first entry"
  cat "$DAY_BEFORE_FILE"
  exit 1
fi

call_process_entry "$ENTRY_TWO_FILE" "Midnight verify day N+1" "$CAPTURE_MIDNIGHT_ISO" "$DAY_N1"
JOURNAL_DATE_TWO="$(jq -r '.journalDate // empty' "$ENTRY_TWO_FILE")"
if [ "$JOURNAL_DATE_TWO" != "$DAY_N1" ]; then
  echo "FAIL midnight-flow: midnight entry journalDate mismatch (expected $DAY_N1 got $JOURNAL_DATE_TWO)"
  cat "$ENTRY_TWO_FILE"
  exit 1
fi

curl -sS "$API_URL/rest/v1/day_journals?select=id,journal_date,updated_at&user_id=eq.$USER_ID&journal_date=in.($DAY_N,$DAY_N1)" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$DAY_AFTER_FILE"

DAY_N_UPDATED_AT_AFTER="$(jq --arg day "$DAY_N" -r '[.[] | select(.journal_date == $day)][0].updated_at // empty' "$DAY_AFTER_FILE")"
DAY_N1_COUNT="$(jq --arg day "$DAY_N1" '[.[] | select(.journal_date == $day)] | length' "$DAY_AFTER_FILE")"

if [ "$DAY_N1_COUNT" -lt 1 ]; then
  echo "FAIL midnight-flow: day journal for $DAY_N1 ontbreekt"
  cat "$DAY_AFTER_FILE"
  exit 1
fi

if [ "$DAY_N_UPDATED_AT_BEFORE" != "$DAY_N_UPDATED_AT_AFTER" ]; then
  echo "FAIL midnight-flow: day $DAY_N was unexpectedly updated by midnight entry"
  echo "before=$DAY_N_UPDATED_AT_BEFORE after=$DAY_N_UPDATED_AT_AFTER"
  cat "$DAY_AFTER_FILE"
  exit 1
fi

call_process_entry "$ENTRY_THREE_FILE" "Midday verify day N+1" "$CAPTURE_DAY_N1_DAYTIME_ISO" "$DAY_N1"
JOURNAL_DATE_THREE="$(jq -r '.journalDate // empty' "$ENTRY_THREE_FILE")"
if [ "$JOURNAL_DATE_THREE" != "$DAY_N1" ]; then
  echo "FAIL midnight-flow: daytime entry journalDate mismatch (expected $DAY_N1 got $JOURNAL_DATE_THREE)"
  cat "$ENTRY_THREE_FILE"
  exit 1
fi

echo "PASS midnight-flow target=$TARGET dayN=$DAY_N dayN1=$DAY_N1"
echo "journalDate(first)=$JOURNAL_DATE_ONE journalDate(midnight)=$JOURNAL_DATE_TWO journalDate(daytime)=$JOURNAL_DATE_THREE"
