#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
START_SCRIPT="$ROOT_DIR/scripts/supabase-functions-start.sh"
STOP_SCRIPT="$ROOT_DIR/scripts/dev-stop.sh"
EXPO_PORT="${EXPO_PORT:-8081}"
STATUS_ENV_FILE="$(mktemp)"

cleanup() {
  rm -f "$STATUS_ENV_FILE"
  "$STOP_SCRIPT"
}

cd "$ROOT_DIR"

PORT_PID="$(lsof -nP -tiTCP:"$EXPO_PORT" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
if [ -n "$PORT_PID" ]; then
  PORT_COMMAND="$(ps -p "$PORT_PID" -o command= 2>/dev/null || true)"
  case "$PORT_COMMAND" in
    *"$ROOT_DIR"*|*expo*|*Expo*)
      echo "Port $EXPO_PORT is already in use by a local dev server (pid: $PORT_PID)."
      printf "Stop it and restart on port %s? [y/N] " "$EXPO_PORT"
      read -r REPLY
      case "$REPLY" in
        y|Y|yes|YES)
          kill "$PORT_PID" 2>/dev/null || true
          sleep 1
          if kill -0 "$PORT_PID" 2>/dev/null; then
            echo "Process $PORT_PID is still running; sending TERM once more..."
            kill -TERM "$PORT_PID" 2>/dev/null || true
            sleep 1
          fi
          ;;
        *)
          echo "Dev server not started. Stop pid $PORT_PID manually or run npm run dev:stop if needed."
          exit 1
          ;;
      esac
      ;;
    *)
      echo "Port $EXPO_PORT is already in use by another process (pid: $PORT_PID)."
      echo "Dev server not started. Free port $EXPO_PORT first, or set EXPO_PORT explicitly."
      exit 1
      ;;
  esac
fi

echo "Checking/starting local Supabase stack..."
npx supabase start

npx supabase status -o env >"$STATUS_ENV_FILE"

LOCAL_API_URL="$(
  awk -F= '$1 == "API_URL" { value = substr($0, index($0, "=") + 1); gsub(/^"|"$/, "", value); print value; exit }' "$STATUS_ENV_FILE"
)"
LOCAL_PUBLISHABLE_KEY="$(
  awk -F= '$1 == "PUBLISHABLE_KEY" { value = substr($0, index($0, "=") + 1); gsub(/^"|"$/, "", value); print value; exit }' "$STATUS_ENV_FILE"
)"

if [ -z "$LOCAL_API_URL" ] || [ -z "$LOCAL_PUBLISHABLE_KEY" ]; then
  echo "Could not resolve local Supabase auth env from 'supabase status -o env'."
  exit 1
fi

export EXPO_PUBLIC_SUPABASE_TARGET="local"
export EXPO_PUBLIC_SUPABASE_LOCAL_URL="$LOCAL_API_URL"
export EXPO_PUBLIC_SUPABASE_LOCAL_PUBLISHABLE_KEY="$LOCAL_PUBLISHABLE_KEY"

echo "Using local Supabase auth env for Expo:"
echo "  EXPO_PUBLIC_SUPABASE_TARGET=$EXPO_PUBLIC_SUPABASE_TARGET"
echo "  EXPO_PUBLIC_SUPABASE_LOCAL_URL=$EXPO_PUBLIC_SUPABASE_LOCAL_URL"

"$START_SCRIPT"

trap cleanup INT TERM EXIT

echo "Starting Expo..."
expo start --port "$EXPO_PORT"
