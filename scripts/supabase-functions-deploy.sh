#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
FUNCTIONS_DIR="$ROOT_DIR/supabase/functions"
ENV_FILE="$ROOT_DIR/.env.local"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

TARGET="${SUPABASE_DEPLOY_TARGET:-${EXPO_PUBLIC_SUPABASE_TARGET:-local}}"
PROJECT_REF="${SUPABASE_PROJECT_REF:-}"

if [ ! -d "$FUNCTIONS_DIR" ]; then
  echo "No supabase/functions directory found."
  exit 1
fi

cd "$ROOT_DIR"

if [ "$TARGET" = "local" ]; then
  echo "Local target geselecteerd (deploy-only, geen start)."
  echo "Lokale functions gebruiken direct de lokale codebase; geen aparte deploy-stap nodig."
  echo "Na function-codewijzigingen: npm run supabase:functions:restart"
  exit 0
fi

if [ -z "$PROJECT_REF" ]; then
  echo "Missing SUPABASE_PROJECT_REF for cloud deploy."
  echo "Example: SUPABASE_PROJECT_REF=your-project-ref npm run supabase:functions:deploy"
  exit 1
fi

echo "Deploying functions to project: $PROJECT_REF"
find "$FUNCTIONS_DIR" -mindepth 1 -maxdepth 1 -type d ! -name "_shared" | sort | while IFS= read -r function_path; do
  function_name="$(basename "$function_path")"
  if [ -f "$function_path/index.ts" ]; then
    echo " - deploy $function_name"
    npx supabase functions deploy "$function_name" --project-ref "$PROJECT_REF" --use-api --no-verify-jwt
  fi
done

echo "Deploy complete."
