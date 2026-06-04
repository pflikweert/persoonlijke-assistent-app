#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PID_FILE="/tmp/pers-assistent-functions.pid"
LOG_FILE="/tmp/supabase-functions.log"
ENV_FILE="${SUPABASE_FUNCTIONS_ENV_FILE:-.env.local}"
FUNCTION_CMD="supabase functions serve --env-file $ENV_FILE"

if [ -f "$PID_FILE" ]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [ -n "${OLD_PID:-}" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Stopping previous functions runtime (pid: $OLD_PID)..."
    kill "$OLD_PID" 2>/dev/null || true
    sleep 1
  fi
  rm -f "$PID_FILE"
fi

pkill -f "$FUNCTION_CMD" 2>/dev/null || true

cd "$ROOT_DIR"

echo "Starting Supabase functions runtime in background..."
# Wrap the command in a detached login shell so the spawned edge runtime
# survives after this wrapper exits.
nohup sh -lc "npx $FUNCTION_CMD" >"$LOG_FILE" 2>&1 </dev/null &
FUNCTION_PID=$!
echo "$FUNCTION_PID" >"$PID_FILE"

sleep 2

if ! kill -0 "$FUNCTION_PID" 2>/dev/null; then
  echo "Functions runtime stopped unexpectedly during startup."
  if [ -f "$LOG_FILE" ]; then
    sed -n '1,120p' "$LOG_FILE"
  fi
  rm -f "$PID_FILE"
  exit 1
fi

echo "functions runtime pid: $FUNCTION_PID (logs: $LOG_FILE)"
