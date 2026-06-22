import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  assertLocalTarget,
  createServiceRoleClient,
  ensureLocalAdminSmokeUser,
  fetchSessionFromVerifyLink,
  requestMagicLink,
  resolveInternalAdminToken,
  resolveSmokeEmail,
  waitForMagicLink,
} from "./local-auth-smoke-utils.mjs";

const REQUIRED_BINDINGS = [
  "entry_normalization.primary",
  "entry_normalization.repair",
  "entry_renormalization.primary",
  "day_journal.primary",
  "day_journal.repair",
  "week_reflection.primary",
  "month_reflection.primary",
];

function readBaselineSource(configJson) {
  if (!configJson || typeof configJson !== "object" || Array.isArray(configJson)) {
    return null;
  }
  const baselineImport = configJson.baseline_import;
  if (!baselineImport || typeof baselineImport !== "object" || Array.isArray(baselineImport)) {
    return null;
  }
  return baselineImport.baseline_source ?? null;
}

async function runCommand({ cmd, args, cwd, env, label }) {
  await new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      env,
      stdio: "inherit",
    });

    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with code=${code ?? "null"} signal=${signal ?? "null"}`));
    });
    child.once("error", reject);
  });
}

function readEnvFileText(rootDir) {
  const envFile = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envFile)) {
    return "";
  }
  return fs.readFileSync(envFile, "utf8");
}

export async function ensureAiqsInternalTokenRuntime(context) {
  const existingToken = resolveInternalAdminToken();
  if (existingToken) {
    return {
      token: existingToken,
      source: "existing-env",
      restartedFunctions: false,
      envFile: null,
    };
  }

  const generatedToken = randomBytes(32).toString("hex");
  const baseEnv = readEnvFileText(context.rootDir);
  const tempEnvFile = path.join(os.tmpdir(), `budio-aiqs-functions-${process.pid}.env`);
  const normalizedBaseEnv = baseEnv.endsWith("\n") || baseEnv.length === 0 ? baseEnv : `${baseEnv}\n`;
  const mergedEnv = `${normalizedBaseEnv}ADMIN_AI_QUALITY_INTERNAL_TOKEN=${generatedToken}\n`;

  fs.writeFileSync(tempEnvFile, mergedEnv, "utf8");

  await runCommand({
    cmd: "./scripts/supabase-functions-restart.sh",
    args: [],
    cwd: context.rootDir,
    env: {
      ...process.env,
      SUPABASE_FUNCTIONS_ENV_FILE: tempEnvFile,
    },
    label: "Supabase functions restart with temporary AIQS token",
  });

  return {
    token: generatedToken,
    source: "generated-temp-env",
    restartedFunctions: true,
    envFile: tempEnvFile,
  };
}

export async function ensureAiqsSmokeAdminSession(context, {
  email,
  profile = "aiqs",
} = {}) {
  assertLocalTarget(context);

  const targetEmail = email || resolveSmokeEmail(profile);
  const user = await ensureLocalAdminSmokeUser(context, {
    email: targetEmail,
    founder: true,
    capabilities: ["ai_quality_studio"],
  });

  await requestMagicLink({
    apiUrl: context.apiUrl,
    publishableKey: context.publishableKey,
    email: user.email,
    redirectTo: context.appUrl,
  });

  const message = await waitForMagicLink({
    mailpitUrl: context.mailpitUrl,
    email: user.email,
  });

  const session = await fetchSessionFromVerifyLink(message.verifyLink, context.publishableKey);

  return {
    ...user,
    messageId: message.messageId,
    verifyLink: message.verifyLink,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
}

export async function archiveAiqsRuntimeManagedLiveVersions(context) {
  const supabase = await createServiceRoleClient(context);
  const targetTaskKeys = [
    "entry_cleanup",
    "entry_cleanup_repair",
    "entry_renormalization",
    "day_narrative",
    "day_journal_repair",
    "week_narrative",
    "month_narrative",
  ];

  const { data: tasks, error: taskError } = await supabase
    .from("ai_tasks")
    .select("id,key")
    .in("key", targetTaskKeys);
  if (taskError) {
    throw taskError;
  }

  const taskIds = (tasks ?? []).map((task) => task.id);
  if (taskIds.length === 0) {
    return;
  }

  const { data: versions, error: versionError } = await supabase
    .from("ai_task_versions")
    .select("id,task_id,status,config_json")
    .in("task_id", taskIds);
  if (versionError) {
    throw versionError;
  }

  const liveVersions = (versions ?? []).filter((version) => version.status === "live");
  const unsafeLiveVersions = liveVersions.filter(
    (version) => readBaselineSource(version.config_json) !== "runtime_code"
  );

  if (unsafeLiveVersions.length > 0) {
    throw new Error(
      "verify-local-aiqs-runtime-bootstrap can only strip baseline-managed live runtime rows. Existing custom live versions must be cleaned up first."
    );
  }

  const liveVersionIds = liveVersions.map((version) => version.id);
  if (liveVersionIds.length === 0) {
    return;
  }

  const { error: archiveVersionsError } = await supabase
    .from("ai_task_versions")
    .update({ status: "archived" })
    .in("id", liveVersionIds)
    .eq("status", "live");
  if (archiveVersionsError) {
    throw archiveVersionsError;
  }
}

export async function importAiqsRuntimeBaselineWithInternalToken(context, internalToken) {
  const response = await fetch(`${context.apiUrl}/functions/v1/admin-ai-quality-studio`, {
    method: "POST",
    headers: {
      apikey: context.publishableKey,
      "x-admin-internal-token": internalToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "import_runtime_baseline" }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Internal AIQS baseline import failed (${response.status}): ${body}`);
  }

  return JSON.parse(body);
}

export async function importAiqsRuntimeBaselineWithAccessToken(context, accessToken) {
  const response = await fetch(`${context.apiUrl}/functions/v1/admin-ai-quality-studio`, {
    method: "POST",
    headers: {
      apikey: context.publishableKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "import_runtime_baseline" }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Founder AIQS baseline import failed (${response.status}): ${body}`);
  }

  return JSON.parse(body);
}

export async function verifyAiqsRuntimeBindings(context) {
  const supabase = await createServiceRoleClient(context);

  for (const bindingKey of REQUIRED_BINDINGS) {
    const { data: task, error: taskError } = await supabase
      .from("ai_tasks")
      .select("id,key")
      .eq("runtime_binding_key", bindingKey)
      .eq("is_active", true)
      .maybeSingle();
    if (taskError) {
      throw taskError;
    }
    if (!task) {
      throw new Error(`Missing runtime task for binding ${bindingKey}.`);
    }

    const { data: liveVersion, error: liveError } = await supabase
      .from("ai_task_versions")
      .select("id,status")
      .eq("task_id", task.id)
      .eq("status", "live")
      .maybeSingle();
    if (liveError) {
      throw liveError;
    }
    if (!liveVersion) {
      throw new Error(`Missing live version for binding ${bindingKey}.`);
    }
  }
}

export function getResolvedInternalAdminToken() {
  return resolveInternalAdminToken();
}
