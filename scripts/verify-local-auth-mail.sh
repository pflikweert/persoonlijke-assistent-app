#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"
STATUS_ENV_FILE="$(mktemp)"
OTP_RESPONSE_FILE="$(mktemp)"
MAILBOX_FILE="$(mktemp)"
MESSAGE_FILE="$(mktemp)"

log() {
  echo "[verify-local-auth-mail] $1"
}

fail() {
  echo "FAIL verify-local-auth-mail: $1" >&2
  exit 1
}

cleanup() {
  rm -f "$STATUS_ENV_FILE" "$OTP_RESPONSE_FILE" "$MAILBOX_FILE" "$MESSAGE_FILE"
}

trap cleanup EXIT

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "required command not found: $1"
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

read_status_env_value() {
  key="$1"

  awk -F= -v key="$key" '
    $1 == key {
      value = substr($0, index($0, "=") + 1)
      print value
      exit
    }
  ' "$STATUS_ENV_FILE"
}

resolve_env_value() {
  current_value="$1"
  key="$2"
  fallback_key="${3:-}"

  if [ -n "$current_value" ]; then
    printf '%s' "$current_value"
    return
  fi

  if [ -f "$ENV_FILE" ]; then
    raw_value="$(read_env_file_value "$ENV_FILE" "$key")"
    normalized_value="$(normalize_env_value "$raw_value")"
    if [ -n "$normalized_value" ]; then
      printf '%s' "$normalized_value"
      return
    fi
  fi

  status_value="$(read_status_env_value "$key")"
  status_value="$(normalize_env_value "$status_value")"
  if [ -n "$status_value" ]; then
    printf '%s' "$status_value"
    return
  fi

  if [ -n "$fallback_key" ]; then
    fallback_value="$(read_status_env_value "$fallback_key")"
    fallback_value="$(normalize_env_value "$fallback_value")"
    if [ -n "$fallback_value" ]; then
      printf '%s' "$fallback_value"
      return
    fi
  fi

  printf ''
}

fetch_json() {
  url="$1"
  output_file="$2"

  http_code="$(curl -sS -o "$output_file" -w "%{http_code}" "$url")"
  if [ "$http_code" != "200" ]; then
    echo "HTTP $http_code while requesting $url" >&2
    cat "$output_file" >&2
    return 1
  fi

  return 0
}

require_cmd curl
require_cmd jq
require_cmd mktemp
require_cmd sleep
require_cmd npx

log "Lees lokale Supabase env-fallback via 'supabase status -o env'."
npx supabase status -o env >"$STATUS_ENV_FILE"

TARGET="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_TARGET:-}" "EXPO_PUBLIC_SUPABASE_TARGET")"
TARGET="${TARGET:-local}"

if [ "$TARGET" != "local" ]; then
  fail "this smoke check is local-only; set EXPO_PUBLIC_SUPABASE_TARGET=local"
fi

API_URL="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_LOCAL_URL:-}" "EXPO_PUBLIC_SUPABASE_LOCAL_URL" "API_URL")"
API_URL="${API_URL:-http://127.0.0.1:54321}"
API_KEY="$(resolve_env_value "${EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY:-}" "EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY" "PUBLISHABLE_KEY")"
MAILPIT_URL="$(resolve_env_value "${MAILPIT_URL:-}" "MAILPIT_URL" "INBUCKET_URL")"
MAILPIT_URL="${MAILPIT_URL:-http://127.0.0.1:54324}"
EMAIL_REDIRECT_TO="${VERIFY_LOCAL_AUTH_EMAIL_REDIRECT_TO:-http://localhost:8081}"

resolve_smoke_email() {
  profile="${SMOKE_TEST_EMAIL_PROFILE:-default}"
  case "$profile" in
    clean)
      printf '%s' "smoke.clean.local@example.com"
      ;;
    new)
      printf '%s' "smoke.new.$(date +%s)@example.com"
      ;;
    *)
      printf '%s' "smoke.default.local@example.com"
      ;;
  esac
}

if [ -z "$API_KEY" ]; then
  fail "missing local publishable key (check .env.local or 'supabase status -o env')"
fi

EMAIL="${SMOKE_TEST_EMAIL:-$(resolve_smoke_email)}"

log "Start magic-link smoke check api_url=$API_URL mailpit_url=$MAILPIT_URL email=$EMAIL"

if ! fetch_json "$MAILPIT_URL/api/v1/messages" "$MAILBOX_FILE"; then
  fail "Mailpit is not reachable. Start the local Supabase stack with 'npx supabase start'."
fi

BASELINE_COUNT="$(jq -r '.messages_count // .count // 0' "$MAILBOX_FILE")"

OTP_STATUS="$(curl -sS -o "$OTP_RESPONSE_FILE" -w "%{http_code}" "$API_URL/auth/v1/otp" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"create_user\":true,\"email_redirect_to\":\"$EMAIL_REDIRECT_TO\"}")"

if [ "$OTP_STATUS" != "200" ]; then
  echo "OTP response:" >&2
  cat "$OTP_RESPONSE_FILE" >&2
  fail "magic-link request failed with HTTP $OTP_STATUS"
fi

MESSAGE_ID=""
ATTEMPT=1
MAX_ATTEMPTS=12

while [ "$ATTEMPT" -le "$MAX_ATTEMPTS" ]; do
  if ! fetch_json "$MAILPIT_URL/api/v1/messages" "$MAILBOX_FILE"; then
    fail "Mailpit stopped responding while polling for the magic link."
  fi

  MESSAGE_ID="$(jq -r --arg email "$EMAIL" '
    .messages
    | map(select(any(.To[]?; (.Address // "") == $email)))
    | first
    | .ID // empty
  ' "$MAILBOX_FILE")"

  if [ -n "$MESSAGE_ID" ]; then
    break
  fi

  ATTEMPT=$((ATTEMPT + 1))
  sleep 1
done

if [ -z "$MESSAGE_ID" ]; then
  FINAL_COUNT="$(jq -r '.messages_count // .count // 0' "$MAILBOX_FILE")"
  echo "OTP response:" >&2
  cat "$OTP_RESPONSE_FILE" >&2
  echo "Mailpit count before=$BASELINE_COUNT after=$FINAL_COUNT" >&2
  fail "OTP request succeeded but no Mailpit message arrived for $EMAIL"
fi

if ! fetch_json "$MAILPIT_URL/api/v1/message/$MESSAGE_ID" "$MESSAGE_FILE"; then
  fail "Mailpit returned a message id, but the message detail could not be loaded."
fi

SUBJECT="$(jq -r '.Subject // empty' "$MESSAGE_FILE")"
TEXT_PREVIEW="$(jq -r '.Text // empty' "$MESSAGE_FILE" | tr '\n' ' ' | cut -c1-180)"
HAS_VERIFY_LINK="$(jq -r '
  ((.Text // "") + " " + (.HTML // ""))
  | test("/auth/v1/verify\\?token=")
' "$MESSAGE_FILE")"

if [ "$HAS_VERIFY_LINK" != "true" ]; then
  echo "Mailpit message:" >&2
  cat "$MESSAGE_FILE" >&2
  fail "Mailpit received a message, but it does not contain the Supabase verify link"
fi

echo "PASS auth-mail target=$TARGET email=$EMAIL messageId=$MESSAGE_ID"
echo "subject=$SUBJECT"
echo "text_preview=$TEXT_PREVIEW"
