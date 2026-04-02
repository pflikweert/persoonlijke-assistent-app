#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PID_FILE="/tmp/pers-assistent-functions.pid"
LOG_FILE="/tmp/supabase-functions.log"
FUNCTION_CMD="supabase functions serve --env-file .env.local"
FUNCTIONS_DIR="$ROOT_DIR/supabase/functions"

deploy_edge_functions() {
  if [ ! -d "$FUNCTIONS_DIR" ]; then
    echo "No supabase/functions directory found, skipping deploy."
    return
  fi

  echo "Deploying Supabase edge functions..."
  find "$FUNCTIONS_DIR" -mindepth 1 -maxdepth 1 -type d ! -name "_shared" | sort | while IFS= read -r function_path; do
    function_name="$(basename "$function_path")"
    if [ -f "$function_path/index.ts" ]; then
      echo " - deploy $function_name"
      npx supabase functions deploy "$function_name"
    fi
  done
}

stop_existing_function() {
  if [ -f "$PID_FILE" ]; then
    OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [ -n "${OLD_PID:-}" ] && kill -0 "$OLD_PID" 2>/dev/null; then
      echo "Stopping previous functions runtime (pid: $OLD_PID)..."
      kill "$OLD_PID" 2>/dev/null || true
      sleep 1
    fi
    rm -f "$PID_FILE"
  fi

  # Safety net for stale processes not tracked by pid file.
  pkill -f "$FUNCTION_CMD" 2>/dev/null || true
}

cleanup() {
  if [ -f "$PID_FILE" ]; then
    CURRENT_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [ -n "${CURRENT_PID:-}" ] && kill -0 "$CURRENT_PID" 2>/dev/null; then
      echo "Stopping functions runtime (pid: $CURRENT_PID)..."
      kill "$CURRENT_PID" 2>/dev/null || true
      sleep 1
    fi
    rm -f "$PID_FILE"
  fi
}

stop_existing_function

cd "$ROOT_DIR"
deploy_edge_functions
echo "Starting Supabase functions runtime in background..."
npx $FUNCTION_CMD >"$LOG_FILE" 2>&1 &
FUNCTION_PID=$!
echo "$FUNCTION_PID" >"$PID_FILE"
echo "functions runtime pid: $FUNCTION_PID (logs: $LOG_FILE)"

trap cleanup INT TERM EXIT

echo "Starting Expo..."
expo start
