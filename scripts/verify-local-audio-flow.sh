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
FUNCTION_FILE="$(mktemp)"
RAW_FILE="$(mktemp)"
NORMALIZED_FILE="$(mktemp)"
DAY_FILE="$(mktemp)"
OVERSIZE_FILE="$(mktemp)"
OVERSIZE_BASE64_FILE="$(mktemp)"
OVERSIZE_PAYLOAD_FILE="$(mktemp)"

cleanup() {
  rm -f "$SIGNUP_FILE" "$FUNCTION_FILE" "$RAW_FILE" "$NORMALIZED_FILE" "$DAY_FILE" "$OVERSIZE_FILE" "$OVERSIZE_BASE64_FILE" "$OVERSIZE_PAYLOAD_FILE"
}

trap cleanup EXIT

EMAIL="verify.audio.$(date +%s)@example.com"
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

AUDIO_BASE64="$(
  node <<'NODE'
const sampleRate = 16000;
const seconds = 1;
const bytesPerSample = 2;
const sampleCount = sampleRate * seconds;
const dataSize = sampleCount * bytesPerSample;
const fileSize = 36 + dataSize;

const buffer = Buffer.alloc(44 + dataSize);
buffer.write('RIFF', 0);
buffer.writeUInt32LE(fileSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
buffer.writeUInt16LE(bytesPerSample, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

process.stdout.write(buffer.toString('base64'));
NODE
)"

CAPTURED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
PAYLOAD="$(jq -nc \
  --arg audioBase64 "$AUDIO_BASE64" \
  --arg audioMimeType "audio/wav" \
  --arg capturedAt "$CAPTURED_AT" \
  '{audioBase64:$audioBase64,audioMimeType:$audioMimeType,capturedAt:$capturedAt}')"

FUNCTION_STATUS="$(curl -sS -o "$FUNCTION_FILE" -w "%{http_code}" "$API_URL/functions/v1/process-entry" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")"

if [ "$FUNCTION_STATUS" != "200" ]; then
  echo "FAIL audio-flow: process-entry returned non-200 ($FUNCTION_STATUS)"
  cat "$FUNCTION_FILE"
  exit 1
fi

STATUS_VALUE="$(jq -r '.status // empty' "$FUNCTION_FILE")"
FLOW_VALUE="$(jq -r '.flow // empty' "$FUNCTION_FILE")"
REQUEST_ID="$(jq -r '.requestId // empty' "$FUNCTION_FILE")"
FLOW_ID="$(jq -r '.flowId // empty' "$FUNCTION_FILE")"
SOURCE_TYPE="$(jq -r '.sourceType // empty' "$FUNCTION_FILE")"
RAW_ENTRY_ID="$(jq -r '.rawEntryId // empty' "$FUNCTION_FILE")"
NORMALIZED_ENTRY_ID="$(jq -r '.normalizedEntryId // empty' "$FUNCTION_FILE")"
DAY_JOURNAL_ID="$(jq -r '.dayJournalId // empty' "$FUNCTION_FILE")"

if [ "$STATUS_VALUE" != "ok" ] || [ "$FLOW_VALUE" != "process-entry" ] || [ -z "$REQUEST_ID" ] || [ -z "$FLOW_ID" ]; then
  echo "FAIL audio-flow: response mist status/flow/requestId/flowId"
  cat "$FUNCTION_FILE"
  exit 1
fi

if [ "$SOURCE_TYPE" != "audio" ] || [ -z "$RAW_ENTRY_ID" ] || [ -z "$NORMALIZED_ENTRY_ID" ] || [ -z "$DAY_JOURNAL_ID" ]; then
  echo "FAIL audio-flow: response mist kernvelden voor audio flow"
  cat "$FUNCTION_FILE"
  exit 1
fi

curl -sS "$API_URL/rest/v1/entries_raw?select=id,source_type,transcript_text&user_id=eq.$USER_ID&id=eq.$RAW_ENTRY_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$RAW_FILE"

curl -sS "$API_URL/rest/v1/entries_normalized?select=id,raw_entry_id&user_id=eq.$USER_ID&id=eq.$NORMALIZED_ENTRY_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$NORMALIZED_FILE"

curl -sS "$API_URL/rest/v1/day_journals?select=id,summary,narrative_text&user_id=eq.$USER_ID&id=eq.$DAY_JOURNAL_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$DAY_FILE"

RAW_COUNT="$(jq 'length' "$RAW_FILE")"
TRANSCRIPT_COUNT="$(jq '[.[] | select((.transcript_text // "") | length > 0)] | length' "$RAW_FILE")"
NORMALIZED_COUNT="$(jq 'length' "$NORMALIZED_FILE")"
DAY_COUNT="$(jq 'length' "$DAY_FILE")"
MATCHED_NORMALIZED_COUNT="$(jq --arg rawId "$RAW_ENTRY_ID" '[.[] | select(.raw_entry_id == $rawId)] | length' "$NORMALIZED_FILE")"
NO_SPEECH_MARKER_COUNT="$(jq '[.[] | select((((.summary // "") + " " + (.narrative_text // "")) | ascii_downcase) | contains("geen spraak herkend in audio-opname"))] | length' "$DAY_FILE")"

if [ "$RAW_COUNT" -lt 1 ] || [ "$TRANSCRIPT_COUNT" -lt 1 ] || [ "$NORMALIZED_COUNT" -lt 1 ] || [ "$MATCHED_NORMALIZED_COUNT" -lt 1 ] || [ "$DAY_COUNT" -lt 1 ] || [ "$NO_SPEECH_MARKER_COUNT" -ne 0 ]; then
  echo "FAIL audio-flow: database invariant mismatch"
  echo "entries_raw(audio): $RAW_COUNT"
  echo "entries_raw(audio with transcript): $TRANSCRIPT_COUNT"
  echo "entries_normalized: $NORMALIZED_COUNT"
  echo "entries_normalized(matched raw): $MATCHED_NORMALIZED_COUNT"
  echo "day_journals: $DAY_COUNT no_speech_marker_rows=$NO_SPEECH_MARKER_COUNT"
  echo "requestId=$REQUEST_ID flowId=$FLOW_ID"
  echo "Function response:"
  cat "$FUNCTION_FILE"
  exit 1
fi

head -c 6990508 /dev/zero | tr '\000' 'A' >"$OVERSIZE_BASE64_FILE"
printf '{"audioBase64":"' >"$OVERSIZE_PAYLOAD_FILE"
cat "$OVERSIZE_BASE64_FILE" >>"$OVERSIZE_PAYLOAD_FILE"
printf '","audioMimeType":"audio/wav","capturedAt":"%s"}' "$CAPTURED_AT" >>"$OVERSIZE_PAYLOAD_FILE"

OVERSIZE_STATUS="$(curl -sS -o "$OVERSIZE_FILE" -w "%{http_code}" "$API_URL/functions/v1/process-entry" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data-binary "@$OVERSIZE_PAYLOAD_FILE")"

OVERSIZE_CODE="$(jq -r '.code // empty' "$OVERSIZE_FILE")"
OVERSIZE_RETRYABLE="$(jq -r '.retryable | tostring' "$OVERSIZE_FILE")"

if [ "$OVERSIZE_STATUS" != "413" ] || [ "$OVERSIZE_CODE" != "PAYLOAD_TOO_LARGE" ] || [ "$OVERSIZE_RETRYABLE" != "false" ]; then
  echo "FAIL audio-flow: oversize negative check mismatch"
  echo "http=$OVERSIZE_STATUS code=$OVERSIZE_CODE retryable=$OVERSIZE_RETRYABLE"
  cat "$OVERSIZE_FILE"
  exit 1
fi

echo "PASS audio-flow target=$TARGET requestId=$REQUEST_ID flowId=$FLOW_ID"
echo "entries_raw(audio)=$RAW_COUNT transcript_rows=$TRANSCRIPT_COUNT entries_normalized=$NORMALIZED_COUNT day_journals=$DAY_COUNT"
echo "negative_check=oversize http=$OVERSIZE_STATUS code=$OVERSIZE_CODE retryable=$OVERSIZE_RETRYABLE"
