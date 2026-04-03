#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
START_SCRIPT="$ROOT_DIR/scripts/supabase-functions-start.sh"
STOP_SCRIPT="$ROOT_DIR/scripts/dev-stop.sh"

cleanup() {
  "$STOP_SCRIPT"
}

cd "$ROOT_DIR"

echo "Checking/starting local Supabase stack..."
npx supabase start

"$START_SCRIPT"

trap cleanup INT TERM EXIT

echo "Starting Expo..."
expo start
