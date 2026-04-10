#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
START_SCRIPT="$ROOT_DIR/scripts/supabase-functions-start.sh"
STOP_SCRIPT="$ROOT_DIR/scripts/dev-stop.sh"
EXPO_PORT="${EXPO_PORT:-8081}"

cleanup() {
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

"$START_SCRIPT"

trap cleanup INT TERM EXIT

echo "Starting Expo..."
expo start --port "$EXPO_PORT"
