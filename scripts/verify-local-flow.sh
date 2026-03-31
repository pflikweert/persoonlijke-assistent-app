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
  echo "process-entry failed with HTTP $FUNCTION_STATUS"
  cat "$FUNCTION_FILE"
  exit 1
fi

curl -sS "$API_URL/rest/v1/entries_raw?select=id&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$RAW_FILE"

curl -sS "$API_URL/rest/v1/entries_normalized?select=id&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$NORMALIZED_FILE"

curl -sS "$API_URL/rest/v1/day_journals?select=id,summary&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$DAY_FILE"

RAW_COUNT="$(jq 'length' "$RAW_FILE")"
NORMALIZED_COUNT="$(jq 'length' "$NORMALIZED_FILE")"
DAY_COUNT="$(jq 'length' "$DAY_FILE")"

if [ "$RAW_COUNT" -lt 1 ] || [ "$NORMALIZED_COUNT" -lt 1 ] || [ "$DAY_COUNT" -lt 1 ]; then
  echo "Verification failed."
  echo "entries_raw: $RAW_COUNT"
  echo "entries_normalized: $NORMALIZED_COUNT"
  echo "day_journals: $DAY_COUNT"
  echo "Function response:"
  cat "$FUNCTION_FILE"
  exit 1
fi

echo "Local verify flow succeeded for target=$TARGET"
echo "entries_raw=$RAW_COUNT entries_normalized=$NORMALIZED_COUNT day_journals=$DAY_COUNT"
echo "Function response:"
cat "$FUNCTION_FILE"
