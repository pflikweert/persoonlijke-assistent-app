#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

read_env_file_value() {
  file="$1"
  key="$2"

  awk -v key="$key" '
    /^[[:space:]]*#/ { next }
    {
      line=$0
      sub(/\r$/, "", line)
      sub(/^[[:space:]]*export[[:space:]]+/, "", line)
      sub(/^[[:space:]]*/, "", line)

      prefix=key "="
      if (index(line, prefix) == 1) {
        print substr(line, length(prefix) + 1)
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

resolve_supabase_status_value() {
  key="$1"
  if ! command -v npx >/dev/null 2>&1; then
    printf ''
    return
  fi

  npx supabase status -o env 2>/dev/null | awk -F '=' -v key="$key" '
    $1 == key {
      value = $2
      sub(/^"/, "", value)
      sub(/"$/, "", value)
      print value
      exit
    }
  '
}

require_cmd curl
require_cmd jq
require_cmd mktemp

TARGET="$(resolve_env_value "${AIQS_BASELINE_TARGET:-${SUPABASE_DEPLOY_TARGET:-${EXPO_PUBLIC_SUPABASE_TARGET:-}}}" "EXPO_PUBLIC_SUPABASE_TARGET")"
TARGET="${TARGET:-local}"

API_URL="$(resolve_env_value "${SUPABASE_API_URL:-}" "SUPABASE_API_URL")"
API_KEY="$(resolve_env_value "${SUPABASE_PUBLISHABLE_KEY:-${SUPABASE_ANON_KEY:-}}" "SUPABASE_PUBLISHABLE_KEY")"
INTERNAL_TOKEN="$(resolve_env_value "${ADMIN_AI_QUALITY_INTERNAL_TOKEN:-}" "ADMIN_AI_QUALITY_INTERNAL_TOKEN")"
if [ -z "$INTERNAL_TOKEN" ]; then
  INTERNAL_TOKEN="$(resolve_env_value "${ADMIN_REGEN_INTERNAL_TOKEN:-}" "ADMIN_REGEN_INTERNAL_TOKEN")"
fi

if [ "$TARGET" = "local" ]; then
  API_URL="${API_URL:-$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_LOCAL_URL:-}" "EXPO_PUBLIC_SUPABASE_LOCAL_URL")}"
  API_KEY="${API_KEY:-$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY:-}" "EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY")}"
  API_URL="${API_URL:-$(resolve_supabase_status_value API_URL)}"
  API_KEY="${API_KEY:-$(resolve_supabase_status_value PUBLISHABLE_KEY)}"
else
  PROJECT_REF="$(resolve_env_value "${SUPABASE_PROJECT_REF:-}" "SUPABASE_PROJECT_REF")"
  if [ -z "$API_URL" ] && [ -n "$PROJECT_REF" ]; then
    API_URL="https://${PROJECT_REF}.supabase.co"
  fi
  API_KEY="${API_KEY:-$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY:-}" "EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY")}"
fi

if [ -z "$API_URL" ]; then
  echo "Missing Supabase API URL for AIQS runtime baseline import." >&2
  exit 1
fi

if [ -z "$API_KEY" ]; then
  echo "Missing Supabase publishable/anon key for AIQS runtime baseline import." >&2
  exit 1
fi

if [ -z "$INTERNAL_TOKEN" ]; then
  echo "Missing ADMIN_AI_QUALITY_INTERNAL_TOKEN or ADMIN_REGEN_INTERNAL_TOKEN for AIQS runtime baseline import." >&2
  exit 1
fi

RESULT_FILE="$(mktemp)"
cleanup() {
  rm -f "$RESULT_FILE"
}
trap cleanup EXIT

echo "Ensuring AIQS runtime baseline target=$TARGET api_url=$API_URL"

HTTP_STATUS="$(curl -sS -o "$RESULT_FILE" -w '%{http_code}' "$API_URL/functions/v1/admin-ai-quality-studio" \
  -H "apikey: $API_KEY" \
  -H "x-admin-internal-token: $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"import_runtime_baseline"}')"

if [ "$HTTP_STATUS" != "200" ]; then
  echo "FAIL aiqs-runtime-baseline: import_runtime_baseline returned HTTP $HTTP_STATUS" >&2
  cat "$RESULT_FILE" >&2
  exit 1
fi

STATUS="$(jq -r '.status // empty' "$RESULT_FILE")"
FLOW="$(jq -r '.flow // empty' "$RESULT_FILE")"
ERROR_COUNT="$(jq -r '.importResult.summary.error // -1' "$RESULT_FILE")"

if [ "$STATUS" != "ok" ] || [ "$FLOW" != "admin-ai-quality-studio" ] || [ "$ERROR_COUNT" != "0" ]; then
  echo "FAIL aiqs-runtime-baseline: import response is not clean." >&2
  cat "$RESULT_FILE" >&2
  exit 1
fi

REQUIRED_BINDINGS='[
  "entry_normalization.primary",
  "entry_normalization.repair",
  "entry_renormalization.primary",
  "day_journal.primary",
  "day_journal.repair",
  "week_reflection.primary",
  "month_reflection.primary"
]'

MISSING_BINDINGS="$(jq -r --argjson required "$REQUIRED_BINDINGS" '
  [
    $required[]
    as $binding
    | select(
        [ .importResult.items[]
          | select(.runtimeBindingKey == $binding)
          | select((.taskStatus == "created" or .taskStatus == "preserved" or .taskStatus == "already_ok")
              and (.liveStatus == "live_created" or .liveStatus == "preserved" or .liveStatus == "already_ok"))
        ] | length == 0
      )
  ] | .[]
' "$RESULT_FILE")"

if [ -n "$MISSING_BINDINGS" ]; then
  echo "FAIL aiqs-runtime-baseline: required live runtime bindings missing or not clean:" >&2
  printf '%s\n' "$MISSING_BINDINGS" >&2
  cat "$RESULT_FILE" >&2
  exit 1
fi

BLOCKED_ITEMS="$(jq -r '
  .importResult.items[]
  | select(.taskStatus == "error" or .liveStatus == "error")
  | "\(.taskKey): taskStatus=\(.taskStatus) liveStatus=\(.liveStatus) message=\(.message // "")"
' "$RESULT_FILE")"

if [ -n "$BLOCKED_ITEMS" ]; then
  echo "FAIL aiqs-runtime-baseline: blocked baseline items:" >&2
  printf '%s\n' "$BLOCKED_ITEMS" >&2
  cat "$RESULT_FILE" >&2
  exit 1
fi

SUMMARY="$(jq -c '.importResult.summary' "$RESULT_FILE")"
echo "AIQS runtime baseline ready: $SUMMARY"
