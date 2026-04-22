#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
FIXTURE_FILE="$ROOT_DIR/scripts/fixtures/chatgpt-markdown/dagboek-voor-gemoedstoestand.md"
PARSER_FILE="$ROOT_DIR/services/import/chatgpt-markdown-parser.ts"

ENV_FILE="$ROOT_DIR/.env.local"

read_env_file_value() {
  file="$1"
  key="$2"

  awk -v key="$key" '
    /^[[:space:]]*#/ { next }
    {
      line=$0
      sub(/\r$/, "", line)

      prefixed="^[[:space:]]*export[[:space:]]+" key "="
      plain="^[[:space:]]*" key "="

      if (line ~ prefixed) {
        sub(prefixed, "", line)
        print line
        exit
      }

      if (line ~ plain) {
        sub(plain, "", line)
        print line
        exit
      }
    }
  ' "$file"
}

normalize_env_value() {
  value="$1"
  case "$value" in
    \"*\")
      value="${value#\"}"
      value="${value%\"}"
      ;;
    \''*\')
      value="${value#\'}"
      value="${value%\'}"
      ;;
  esac
  printf '%s' "$value"
}

resolve_env_value() {
  current_value="$1"
  key="$2"

  if [ -n "$current_value" ]; then
    printf '%s' "$current_value"
    return
  fi

  if [ ! -f "$ENV_FILE" ]; then
    printf ''
    return
  fi

  raw_value="$(read_env_file_value "$ENV_FILE" "$key")"
  normalize_env_value "$raw_value"
}

SUPABASE_STATUS_ENV_CACHE=""

read_supabase_status_env() {
  if [ -n "$SUPABASE_STATUS_ENV_CACHE" ]; then
    printf '%s' "$SUPABASE_STATUS_ENV_CACHE"
    return
  fi

  if ! command -v npx >/dev/null 2>&1; then
    printf ''
    return
  fi

  SUPABASE_STATUS_ENV_CACHE="$(npx supabase status -o env 2>/dev/null || true)"
  printf '%s' "$SUPABASE_STATUS_ENV_CACHE"
}

resolve_supabase_status_value() {
  key="$1"
  status_env="$(read_supabase_status_env)"

  if [ -z "$status_env" ]; then
    printf ''
    return
  fi

  printf '%s\n' "$status_env" | awk -F '=' -v key="$key" '
    $1 == key {
      value = $2
      sub(/^"/, "", value)
      sub(/"$/, "", value)
      print value
      exit
    }
  '
}

TARGET="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_TARGET:-}" "EXPO_PUBLIC_SUPABASE_TARGET")"
TARGET="${TARGET:-local}"

if [ "$TARGET" = "local" ]; then
  API_URL="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_LOCAL_URL:-}" "EXPO_PUBLIC_SUPABASE_LOCAL_URL")"
  API_URL="${API_URL:-http://127.0.0.1:54321}"
  API_KEY="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY:-}" "EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY")"

  if [ -z "$API_KEY" ]; then
    API_KEY="$(resolve_supabase_status_value "PUBLISHABLE_KEY")"
  fi

  if [ -z "$API_URL" ]; then
    API_URL="$(resolve_supabase_status_value "API_URL")"
  fi
else
  API_URL="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_CLOUD_URL:-}" "EXPO_PUBLIC_SUPABASE_CLOUD_URL")"
  API_KEY="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY:-}" "EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY")"
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
FIRST_PAYLOAD_FILE="$(mktemp)"
REPLACE_PAYLOAD_FILE="$(mktemp)"
FIRST_RESPONSE_FILE="$(mktemp)"
SECOND_RESPONSE_FILE="$(mktemp)"
THIRD_RESPONSE_FILE="$(mktemp)"
RAW_FILE="$(mktemp)"
JOURNALS_FILE="$(mktemp)"
REFLECTIONS_FILE="$(mktemp)"
IMPACTED_FILE="$(mktemp)"
SAMPLED_IMPACTED_FILE="$(mktemp)"
WEEK_ANCHORS_FILE="$(mktemp)"
MONTH_ANCHORS_FILE="$(mktemp)"

cleanup() {
  rm -f "$SIGNUP_FILE" "$FIRST_PAYLOAD_FILE" "$REPLACE_PAYLOAD_FILE" "$FIRST_RESPONSE_FILE" "$SECOND_RESPONSE_FILE" "$THIRD_RESPONSE_FILE" "$RAW_FILE" "$JOURNALS_FILE" "$REFLECTIONS_FILE" "$IMPACTED_FILE" "$SAMPLED_IMPACTED_FILE" "$WEEK_ANCHORS_FILE" "$MONTH_ANCHORS_FILE"
}

trap cleanup EXIT

EMAIL="verify.chatgpt.$(date +%s)@example.com"
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

FIXTURE_FILE="$FIXTURE_FILE" PARSER_FILE="$PARSER_FILE" node <<'NODE' >"$FIRST_PAYLOAD_FILE"
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const parserModule = await import(pathToFileURL(process.env.PARSER_FILE).href);
const markdown = await fs.readFile(process.env.FIXTURE_FILE, 'utf8');
const preview = parserModule.parseChatGptMarkdownFile({
  fileName: 'Dagboek voor gemoedstoestand.md',
  markdown,
});

const payload = {
  fileName: preview.fileName,
  sourceRef: preview.sourceRef,
  sourceConversationId: preview.sourceConversationId,
  conversationTitle: preview.conversationTitle,
  conversationAlias: preview.conversationAlias,
  replaceExisting: false,
  items: preview.messages.map((message) => ({
    capturedAt: message.capturedAt,
    rawText: message.rawText,
    externalMessageId: message.externalMessageId,
  })),
};

console.log(JSON.stringify(payload));
NODE

cp "$FIRST_PAYLOAD_FILE" "$REPLACE_PAYLOAD_FILE"
TMP_REPLACE_FILE="$(mktemp)"
jq '.replaceExisting = true' "$REPLACE_PAYLOAD_FILE" >"$TMP_REPLACE_FILE"
mv "$TMP_REPLACE_FILE" "$REPLACE_PAYLOAD_FILE"

FIRST_STATUS="$(curl -sS -o "$FIRST_RESPONSE_FILE" -w "%{http_code}" "$API_URL/functions/v1/import-chatgpt-markdown" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data @"$FIRST_PAYLOAD_FILE")"

if [ "$FIRST_STATUS" != "200" ]; then
  echo "FAIL chatgpt-import: first import failed with HTTP $FIRST_STATUS"
  cat "$FIRST_RESPONSE_FILE"
  exit 1
fi

FIRST_REQUIRES_REPLACE="$(jq -r '.requiresReplaceConfirmation // false' "$FIRST_RESPONSE_FILE")"
FIRST_IMPORTED_COUNT="$(jq -r '.importedCount // 0' "$FIRST_RESPONSE_FILE")"

if [ "$FIRST_REQUIRES_REPLACE" != "false" ] || [ "$FIRST_IMPORTED_COUNT" -le 0 ]; then
  echo "FAIL chatgpt-import: first import response unexpected"
  cat "$FIRST_RESPONSE_FILE"
  exit 1
fi

jq -r '.impactedDates' "$FIRST_RESPONSE_FILE" >"$IMPACTED_FILE"

IMPACTED_FILE="$IMPACTED_FILE" node <<'NODE' >"$SAMPLED_IMPACTED_FILE"
import fs from 'node:fs';

const impacted = JSON.parse(fs.readFileSync(process.env.IMPACTED_FILE, 'utf8'));
const sampled = [];

if (impacted.length > 0) {
  sampled.push(impacted[0]);
}
if (impacted.length > 2) {
  sampled.push(impacted[Math.floor(impacted.length / 2)]);
}
if (impacted.length > 1) {
  sampled.push(impacted[impacted.length - 1]);
}

console.log(JSON.stringify([...new Set(sampled)]));
NODE

SAMPLED_IMPACTED_FILE="$SAMPLED_IMPACTED_FILE" node <<'NODE' >"$WEEK_ANCHORS_FILE"
import fs from 'node:fs';

const impacted = JSON.parse(fs.readFileSync(process.env.SAMPLED_IMPACTED_FILE, 'utf8'));
const weekStarts = new Set();

for (const journalDate of impacted) {
  const anchor = new Date(`${journalDate}T00:00:00.000Z`);
  const day = anchor.getUTCDay();
  const offsetToMonday = (day + 6) % 7;
  const weekStart = new Date(anchor.getTime() - offsetToMonday * 24 * 60 * 60 * 1000);
  weekStarts.add(weekStart.toISOString().slice(0, 10));
}

console.log(JSON.stringify([...weekStarts].sort()));
NODE

SAMPLED_IMPACTED_FILE="$SAMPLED_IMPACTED_FILE" node <<'NODE' >"$MONTH_ANCHORS_FILE"
import fs from 'node:fs';

const impacted = JSON.parse(fs.readFileSync(process.env.SAMPLED_IMPACTED_FILE, 'utf8'));
const monthStarts = new Set(impacted.map((journalDate) => `${journalDate.slice(0, 7)}-01`));
console.log(JSON.stringify([...monthStarts].sort()));
NODE

jq -r '.[]' "$SAMPLED_IMPACTED_FILE" | while IFS= read -r journalDate; do
  [ -n "$journalDate" ] || continue

  DAY_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" "$API_URL/functions/v1/regenerate-day-journal" \
    -H "apikey: $API_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"journalDate\":\"$journalDate\"}")"

  if [ "$DAY_STATUS" != "200" ]; then
    echo "FAIL chatgpt-import: regenerate-day-journal failed for $journalDate"
    exit 1
  fi
done

jq -r '.[]' "$WEEK_ANCHORS_FILE" | while IFS= read -r anchorDate; do
  [ -n "$anchorDate" ] || continue

  WEEK_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" "$API_URL/functions/v1/generate-reflection" \
    -H "apikey: $API_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"periodType\":\"week\",\"anchorDate\":\"$anchorDate\",\"forceRegenerate\":true}")"

  if [ "$WEEK_STATUS" != "200" ]; then
    echo "FAIL chatgpt-import: week reflection refresh failed for $anchorDate"
    exit 1
  fi
done

jq -r '.[]' "$MONTH_ANCHORS_FILE" | while IFS= read -r anchorDate; do
  [ -n "$anchorDate" ] || continue

  MONTH_STATUS="$(curl -sS -o /dev/null -w "%{http_code}" "$API_URL/functions/v1/generate-reflection" \
    -H "apikey: $API_KEY" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"periodType\":\"month\",\"anchorDate\":\"$anchorDate\",\"forceRegenerate\":true}")"

  if [ "$MONTH_STATUS" != "200" ]; then
    echo "FAIL chatgpt-import: month reflection refresh failed for $anchorDate"
    exit 1
  fi
done

SECOND_STATUS="$(curl -sS -o "$SECOND_RESPONSE_FILE" -w "%{http_code}" "$API_URL/functions/v1/import-chatgpt-markdown" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data @"$FIRST_PAYLOAD_FILE")"

if [ "$SECOND_STATUS" != "200" ]; then
  echo "FAIL chatgpt-import: second import failed with HTTP $SECOND_STATUS"
  cat "$SECOND_RESPONSE_FILE"
  exit 1
fi

SECOND_REQUIRES_REPLACE="$(jq -r '.requiresReplaceConfirmation // false' "$SECOND_RESPONSE_FILE")"
if [ "$SECOND_REQUIRES_REPLACE" != "true" ]; then
  echo "FAIL chatgpt-import: second import should require replace confirmation"
  cat "$SECOND_RESPONSE_FILE"
  exit 1
fi

THIRD_STATUS="$(curl -sS -o "$THIRD_RESPONSE_FILE" -w "%{http_code}" "$API_URL/functions/v1/import-chatgpt-markdown" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  --data @"$REPLACE_PAYLOAD_FILE")"

if [ "$THIRD_STATUS" != "200" ]; then
  echo "FAIL chatgpt-import: replace import failed with HTTP $THIRD_STATUS"
  cat "$THIRD_RESPONSE_FILE"
  exit 1
fi

THIRD_REQUIRES_REPLACE="$(jq -r '.requiresReplaceConfirmation // false' "$THIRD_RESPONSE_FILE")"
THIRD_REMOVED_COUNT="$(jq -r '.removedCount // 0' "$THIRD_RESPONSE_FILE")"

if [ "$THIRD_REQUIRES_REPLACE" != "false" ] || [ "$THIRD_REMOVED_COUNT" -le 0 ]; then
  echo "FAIL chatgpt-import: replace import response unexpected"
  cat "$THIRD_RESPONSE_FILE"
  exit 1
fi

SOURCE_REF="$(jq -r '.sourceRef' "$THIRD_RESPONSE_FILE")"
EXPECTED_COUNT="$(jq '.items | length' "$FIRST_PAYLOAD_FILE")"
SAMPLED_DAYS="$(jq 'length' "$SAMPLED_IMPACTED_FILE")"

curl -sS "$API_URL/rest/v1/entries_raw?select=id,import_source_ref,import_source_type&user_id=eq.$USER_ID&import_source_type=eq.chatgpt_markdown_import&import_source_ref=eq.$SOURCE_REF" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$RAW_FILE"

curl -sS "$API_URL/rest/v1/day_journals?select=id,journal_date&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$JOURNALS_FILE"

curl -sS "$API_URL/rest/v1/period_reflections?select=id,period_type,period_start&period_end&user_id=eq.$USER_ID" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" >"$REFLECTIONS_FILE"

RAW_COUNT="$(jq 'length' "$RAW_FILE")"
JOURNAL_MATCH_COUNT="$(jq --argjson impacted "$(cat "$SAMPLED_IMPACTED_FILE")" '[.[] | select(.journal_date as $d | ($impacted | index($d))) ] | length' "$JOURNALS_FILE")"
WEEK_COUNT="$(jq '[.[] | select(.period_type == "week")] | length' "$REFLECTIONS_FILE")"
MONTH_COUNT="$(jq '[.[] | select(.period_type == "month")] | length' "$REFLECTIONS_FILE")"

if [ "$RAW_COUNT" -ne "$EXPECTED_COUNT" ]; then
  echo "FAIL chatgpt-import: expected $EXPECTED_COUNT imported rows, got $RAW_COUNT"
  exit 1
fi

if [ "$JOURNAL_MATCH_COUNT" -lt "$SAMPLED_DAYS" ]; then
  echo "FAIL chatgpt-import: expected at least $SAMPLED_DAYS sampled day journals, got $JOURNAL_MATCH_COUNT"
  exit 1
fi

if [ "$WEEK_COUNT" -lt 1 ] || [ "$MONTH_COUNT" -lt 1 ]; then
  echo "FAIL chatgpt-import: expected refreshed week/month reflections"
  exit 1
fi

echo "PASS chatgpt-import target=$TARGET imported=$RAW_COUNT sampled_days=$SAMPLED_DAYS source_ref=$SOURCE_REF"
