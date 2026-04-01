#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

if [ -f "$ROOT_DIR/.env.local" ]; then
  # Load local env for target selection and keys.
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
FUNCTION_FILE="$(mktemp)"
RAW_FILE="$(mktemp)"
NORMALIZED_FILE="$(mktemp)"
DAY_FILE="$(mktemp)"

cleanup() {
  rm -f "$SIGNUP_FILE" "$FUNCTION_FILE" "$RAW_FILE" "$NORMALIZED_FILE" "$DAY_FILE"
}

trap cleanup EXIT

fail_with_context() {
  echo "FAIL text-flow: $1"
  echo "HTTP: ${FUNCTION_STATUS:-n/a}"
  if [ -f "$FUNCTION_FILE" ]; then
    echo "Function body:"
    cat "$FUNCTION_FILE"
  fi
  exit 1
}

EMAIL="verify.$(date +%s)@example.com"
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

FUNCTION_STATUS="$(curl -sS -o "$FUNCTION_FILE" -w "%{http_code}" "$API_URL/functions/v1/process-entry" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"rawText\":\"Local verify flow entry $(date +%s)\",\"capturedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}")"

if [ "$FUNCTION_STATUS" != "200" ]; then
  fail_with_context "process-entry returned non-200"
fi

STATUS_VALUE="$(jq -r '.status // empty' "$FUNCTION_FILE")"
FLOW_VALUE="$(jq -r '.flow // empty' "$FUNCTION_FILE")"
REQUEST_ID="$(jq -r '.requestId // empty' "$FUNCTION_FILE")"
FLOW_ID="$(jq -r '.flowId // empty' "$FUNCTION_FILE")"
SOURCE_TYPE="$(jq -r '.sourceType // empty' "$FUNCTION_FILE")"
RAW_ENTRY_ID="$(jq -r '.rawEntryId // empty' "$FUNCTION_FILE")"
NORMALIZED_ENTRY_ID="$(jq -r '.normalizedEntryId // empty' "$FUNCTION_FILE")"
DAY_JOURNAL_ID="$(jq -r '.dayJournalId // empty' "$FUNCTION_FILE")"
JOURNAL_DATE="$(jq -r '.journalDate // empty' "$FUNCTION_FILE")"

if [ "$STATUS_VALUE" != "ok" ] || [ "$FLOW_VALUE" != "process-entry" ] || [ -z "$REQUEST_ID" ] || [ -z "$FLOW_ID" ]; then
  fail_with_context "response mist status/flow/requestId/flowId"
fi

if [ "$SOURCE_TYPE" != "text" ] || [ -z "$RAW_ENTRY_ID" ] || [ -z "$NORMALIZED_ENTRY_ID" ] || [ -z "$DAY_JOURNAL_ID" ] || [ -z "$JOURNAL_DATE" ]; then
  fail_with_context "response mist kernvelden voor text flow"
fi

curl -sS "$API_URL/rest/v1/entries_raw?select=id,raw_text,transcript_text&user_id=eq.$USER_ID&id=eq.$RAW_ENTRY_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$RAW_FILE"

curl -sS "$API_URL/rest/v1/entries_normalized?select=id,raw_entry_id&user_id=eq.$USER_ID&id=eq.$NORMALIZED_ENTRY_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$NORMALIZED_FILE"

curl -sS "$API_URL/rest/v1/day_journals?select=id,journal_date,summary&user_id=eq.$USER_ID&id=eq.$DAY_JOURNAL_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$DAY_FILE"

RAW_COUNT="$(jq 'length' "$RAW_FILE")"
NORMALIZED_COUNT="$(jq 'length' "$NORMALIZED_FILE")"
DAY_COUNT="$(jq 'length' "$DAY_FILE")"
RAW_TEXT_COUNT="$(jq '[.[] | select((.raw_text // "") | length > 0)] | length' "$RAW_FILE")"
TRANSCRIPT_COUNT="$(jq '[.[] | select((.transcript_text // "") | length > 0)] | length' "$RAW_FILE")"
MATCHED_NORMALIZED_COUNT="$(jq --arg rawId "$RAW_ENTRY_ID" '[.[] | select(.raw_entry_id == $rawId)] | length' "$NORMALIZED_FILE")"
MATCHED_JOURNAL_DATE_COUNT="$(jq --arg journalDate "$JOURNAL_DATE" '[.[] | select(.journal_date == $journalDate)] | length' "$DAY_FILE")"

if [ "$RAW_COUNT" -lt 1 ] || [ "$RAW_TEXT_COUNT" -lt 1 ] || [ "$TRANSCRIPT_COUNT" -ne 0 ] || [ "$NORMALIZED_COUNT" -lt 1 ] || [ "$MATCHED_NORMALIZED_COUNT" -lt 1 ] || [ "$DAY_COUNT" -lt 1 ] || [ "$MATCHED_JOURNAL_DATE_COUNT" -lt 1 ]; then
  echo "FAIL text-flow: database invariant mismatch"
  echo "entries_raw=$RAW_COUNT raw_text_rows=$RAW_TEXT_COUNT transcript_rows=$TRANSCRIPT_COUNT"
  echo "entries_normalized=$NORMALIZED_COUNT matched_normalized=$MATCHED_NORMALIZED_COUNT"
  echo "day_journals=$DAY_COUNT matched_journal_date=$MATCHED_JOURNAL_DATE_COUNT"
  echo "requestId=$REQUEST_ID flowId=$FLOW_ID"
  echo "Function response:"
  cat "$FUNCTION_FILE"
  exit 1
fi

echo "PASS text-flow target=$TARGET requestId=$REQUEST_ID flowId=$FLOW_ID journalDate=$JOURNAL_DATE"
echo "entries_raw=$RAW_COUNT raw_text_rows=$RAW_TEXT_COUNT entries_normalized=$NORMALIZED_COUNT day_journals=$DAY_COUNT"
