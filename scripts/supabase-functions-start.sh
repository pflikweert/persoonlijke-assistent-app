#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PID_FILE="/tmp/pers-assistent-functions.pid"
LOG_FILE="/tmp/supabase-functions.log"
FUNCTION_CMD="supabase functions serve --env-file .env.local"

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
npx $FUNCTION_CMD >"$LOG_FILE" 2>&1 &
FUNCTION_PID=$!
echo "$FUNCTION_PID" >"$PID_FILE"

echo "functions runtime pid: $FUNCTION_PID (logs: $LOG_FILE)"
