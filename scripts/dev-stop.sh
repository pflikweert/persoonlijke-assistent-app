#!/bin/sh
set -eu

PID_FILE="/tmp/pers-assistent-functions.pid"
FUNCTION_CMD="supabase functions serve --env-file .env.local"

if [ -f "$PID_FILE" ]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [ -n "${PID:-}" ] && kill -0 "$PID" 2>/dev/null; then
    echo "Stopping functions runtime (pid: $PID)..."
    kill "$PID" 2>/dev/null || true
    sleep 1
  fi
  rm -f "$PID_FILE"
fi

pkill -f "$FUNCTION_CMD" 2>/dev/null || true

echo "Functions runtime stopped. Local Supabase stack blijft draaien."
