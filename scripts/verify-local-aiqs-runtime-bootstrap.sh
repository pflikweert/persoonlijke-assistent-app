#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd curl
require_cmd jq
require_cmd node
require_cmd npx

STATUS_ENV="$(cd "$ROOT_DIR" && npx supabase status -o env)"

resolve_status_value() {
  key="$1"
  printf '%s\n' "$STATUS_ENV" | awk -F '=' -v key="$key" '
    $1 == key {
      value = $2
      sub(/^"/, "", value)
      sub(/"$/, "", value)
      print value
      exit
    }
  '
}

API_URL="$(resolve_status_value API_URL)"
API_KEY="$(resolve_status_value PUBLISHABLE_KEY)"
SERVICE_ROLE_KEY="$(resolve_status_value SERVICE_ROLE_KEY)"
INTERNAL_TOKEN="${ADMIN_AI_QUALITY_INTERNAL_TOKEN:-${ADMIN_REGEN_INTERNAL_TOKEN:-}}"

if [ -z "$API_URL" ] || [ -z "$API_KEY" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "Missing local Supabase runtime values." >&2
  exit 1
fi

if [ -z "$INTERNAL_TOKEN" ]; then
  echo "Missing ADMIN_AI_QUALITY_INTERNAL_TOKEN or ADMIN_REGEN_INTERNAL_TOKEN in current shell environment." >&2
  echo "Tip: restart local functions with a temporary token, for example:" >&2
  echo "ADMIN_AI_QUALITY_INTERNAL_TOKEN=local-aiqs-bootstrap npm run supabase:functions:restart" >&2
  exit 1
fi

export API_URL
export API_KEY
export SERVICE_ROLE_KEY
export INTERNAL_TOKEN

INTERNAL_FILE="$(mktemp)"
FOUNDER_SIGNUP_FILE="$(mktemp)"
FOUNDER_FILE="$(mktemp)"

cleanup() {
  rm -f "$INTERNAL_FILE" "$FOUNDER_SIGNUP_FILE" "$FOUNDER_FILE"
}

trap cleanup EXIT

cd "$ROOT_DIR"

node --import tsx - <<'NODE'
import { createClient } from '@supabase/supabase-js';

const apiUrl = process.env.API_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

if (!apiUrl || !serviceRoleKey) {
  throw new Error('Missing local service role context.');
}

const supabase = createClient(apiUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const targetTaskKeys = [
  'entry_cleanup',
  'entry_cleanup_repair',
  'entry_renormalization',
  'day_narrative',
  'day_journal_repair',
  'week_narrative',
  'month_narrative',
];

const { data: tasks, error: taskError } = await supabase
  .from('ai_tasks')
  .select('id,key')
  .in('key', targetTaskKeys);
if (taskError) throw taskError;

const taskIds = (tasks ?? []).map((task) => task.id);
if (taskIds.length > 0) {
  const { data: versions, error: versionError } = await supabase
    .from('ai_task_versions')
    .select('id,task_id,status,config_json')
    .in('task_id', taskIds);
  if (versionError) throw versionError;

  const liveVersions = (versions ?? []).filter((version) => version.status === 'live');
  const unsafeLiveVersions = liveVersions.filter((version) => {
    const baselineSource =
      version.config_json &&
      typeof version.config_json === 'object' &&
      !Array.isArray(version.config_json) &&
      version.config_json.baseline_import &&
      typeof version.config_json.baseline_import === 'object' &&
      !Array.isArray(version.config_json.baseline_import)
        ? version.config_json.baseline_import.baseline_source
        : null;
    return baselineSource !== 'runtime_code';
  });

  if (unsafeLiveVersions.length > 0) {
    throw new Error(
      'verify-local-aiqs-runtime-bootstrap can only strip baseline-managed live runtime rows. Existing custom live versions must be cleaned up first.'
    );
  }

  const liveVersionIds = liveVersions.map((version) => version.id);
  if (liveVersionIds.length > 0) {
    const { error: archiveVersionsError } = await supabase
      .from('ai_task_versions')
      .update({ status: 'archived' })
      .in('id', liveVersionIds)
      .eq('status', 'live');
    if (archiveVersionsError) throw archiveVersionsError;
  }
}
NODE

INTERNAL_STATUS="$(curl -sS -o "$INTERNAL_FILE" -w '%{http_code}' "$API_URL/functions/v1/admin-ai-quality-studio" \
  -H "apikey: $API_KEY" \
  -H "x-admin-internal-token: $INTERNAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"import_runtime_baseline"}')"

if [ "$INTERNAL_STATUS" != "200" ]; then
  echo "FAIL aiqs-bootstrap: internal import returned HTTP $INTERNAL_STATUS" >&2
  cat "$INTERNAL_FILE" >&2
  exit 1
fi

EMAIL="verify.aiqs.bootstrap.$(date +%s)@example.com"
PASSWORD="Passw0rd!123"

curl -sS "$API_URL/auth/v1/signup" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" >"$FOUNDER_SIGNUP_FILE"

ACCESS_TOKEN="$(jq -r '.access_token // empty' "$FOUNDER_SIGNUP_FILE")"
USER_ID="$(jq -r '.user.id // empty' "$FOUNDER_SIGNUP_FILE")"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$USER_ID" ]; then
  echo "FAIL aiqs-bootstrap: founder signup failed" >&2
  cat "$FOUNDER_SIGNUP_FILE" >&2
  exit 1
fi

API_URL="$API_URL" SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" USER_ID="$USER_ID" node --import tsx - <<'NODE'
import { createClient } from '@supabase/supabase-js';

const apiUrl = process.env.API_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
const userId = process.env.USER_ID;

if (!apiUrl || !serviceRoleKey || !userId) {
  throw new Error('Missing founder grant context.');
}

const supabase = createClient(apiUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error: founderError } = await supabase
  .from('admin_founders')
  .upsert({ user_id: userId, created_by: userId });
if (founderError) throw founderError;

const { error: capabilityError } = await supabase
  .from('admin_user_capabilities')
  .upsert({
    user_id: userId,
    capability: 'ai_quality_studio',
    granted_by: userId,
  });
if (capabilityError) throw capabilityError;
NODE

FOUNDER_STATUS="$(curl -sS -o "$FOUNDER_FILE" -w '%{http_code}' "$API_URL/functions/v1/admin-ai-quality-studio" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"import_runtime_baseline"}')"

if [ "$FOUNDER_STATUS" != "200" ]; then
  echo "FAIL aiqs-bootstrap: founder import returned HTTP $FOUNDER_STATUS" >&2
  cat "$FOUNDER_FILE" >&2
  exit 1
fi

INTERNAL_FILE="$INTERNAL_FILE" FOUNDER_FILE="$FOUNDER_FILE" API_URL="$API_URL" SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" node --import tsx - <<'NODE'
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const internalResult = JSON.parse(readFileSync(process.env.INTERNAL_FILE, 'utf8'));
const founderResult = JSON.parse(readFileSync(process.env.FOUNDER_FILE, 'utf8'));

const internalSummary = internalResult?.importResult?.summary;
const founderSummary = founderResult?.importResult?.summary;
if (!internalSummary || internalSummary.error !== 0) {
  throw new Error('Internal import did not finish cleanly.');
}
if (!founderSummary || founderSummary.error !== 0) {
  throw new Error('Founder import did not finish cleanly.');
}

const apiUrl = process.env.API_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
if (!apiUrl || !serviceRoleKey) {
  throw new Error('Missing final verification context.');
}

const supabase = createClient(apiUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const requiredBindings = [
  'entry_normalization.primary',
  'entry_normalization.repair',
  'entry_renormalization.primary',
  'day_journal.primary',
  'day_journal.repair',
  'week_reflection.primary',
  'month_reflection.primary',
];

for (const bindingKey of requiredBindings) {
  const { data: task, error: taskError } = await supabase
    .from('ai_tasks')
    .select('id,key')
    .eq('runtime_binding_key', bindingKey)
    .eq('is_active', true)
    .maybeSingle();
  if (taskError) throw taskError;
  if (!task) {
    throw new Error(`Missing runtime task for binding ${bindingKey}.`);
  }

  const { data: liveVersion, error: liveError } = await supabase
    .from('ai_task_versions')
    .select('id,status')
    .eq('task_id', task.id)
    .eq('status', 'live')
    .maybeSingle();
  if (liveError) throw liveError;
  if (!liveVersion) {
    throw new Error(`Missing live version for binding ${bindingKey}.`);
  }
}
NODE

echo "AIQS runtime bootstrap verify passed."
