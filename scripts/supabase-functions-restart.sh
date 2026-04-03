#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

"$ROOT_DIR/scripts/dev-stop.sh"
"$ROOT_DIR/scripts/supabase-functions-start.sh"
