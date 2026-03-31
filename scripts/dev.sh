#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PID_FILE="/tmp/pers-assistent-process-entry.pid"
LOG_FILE="/tmp/process-entry.log"
FUNCTION_CMD="supabase functions serve process-entry --env-file .env.local"

stop_existing_function() {
  if [ -f "$PID_FILE" ]; then
    OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [ -n "${OLD_PID:-}" ] && kill -0 "$OLD_PID" 2>/dev/null; then
      echo "Stopping previous process-entry (pid: $OLD_PID)..."
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
      echo "Stopping process-entry (pid: $CURRENT_PID)..."
      kill "$CURRENT_PID" 2>/dev/null || true
      sleep 1
    fi
    rm -f "$PID_FILE"
  fi
}

stop_existing_function

cd "$ROOT_DIR"
echo "Starting process-entry in background..."
npx $FUNCTION_CMD >"$LOG_FILE" 2>&1 &
FUNCTION_PID=$!
echo "$FUNCTION_PID" >"$PID_FILE"
echo "process-entry pid: $FUNCTION_PID (logs: $LOG_FILE)"

trap cleanup INT TERM EXIT

echo "Starting Expo..."
expo start
