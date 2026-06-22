#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  assertLocalTarget,
  resolveLocalAuthSmokeContext,
  waitForUrlReachable,
  isUrlReachable,
} from "./_shared/local-auth-smoke-utils.mjs";

function waitForExit(child, timeoutMs = 15000) {
  return new Promise((resolve) => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve({ timedOut: true });
    }, timeoutMs);

    child.once("exit", (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({ code, signal, timedOut: false });
    });
  });
}

function stopChildProcessGroup(child, signal = "SIGINT") {
  if (!child?.pid) {
    return;
  }

  try {
    process.kill(-child.pid, signal);
  } catch {
    child.kill(signal);
  }
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

async function main() {
  const context = resolveLocalAuthSmokeContext();
  assertLocalTarget(context);

  const smokeUrl = `${context.appUrl.replace(/\/+$/, "")}/settings-ai-quality-studio`;
  const signInUrl = `${context.appUrl.replace(/\/+$/, "")}/sign-in`;
  const logFile = path.join(os.tmpdir(), `budio-aiqs-smoke-dev-${process.pid}.log`);
  let devProcess = null;
  let startedDev = false;

  try {
    const reachable = await isUrlReachable(signInUrl);
    if (!reachable) {
      const logStream = fs.createWriteStream(logFile, { flags: "a" });
      devProcess = spawn("npm", ["run", "dev"], {
        cwd: context.rootDir,
        env: process.env,
        detached: true,
        stdio: ["ignore", "pipe", "pipe"],
      });
      startedDev = true;
      devProcess.stdout.pipe(logStream);
      devProcess.stderr.pipe(logStream);
      console.log(`Started local dev: npm run dev`);
      console.log(`Waiting for local target: ${context.appUrl}`);
      await waitForUrlReachable(signInUrl, { timeoutMs: 120000, pollMs: 1500 });
    }

    await runCommand({
      cmd: "node",
      args: ["scripts/verify-local-aiqs-runtime-bootstrap.mjs", "--profile", "aiqs"],
      cwd: context.rootDir,
      env: { ...process.env, SMOKE_TEST_EMAIL_PROFILE: "aiqs" },
      label: "AIQS bootstrap verify",
    });

    await runCommand({
      cmd: "npx",
      args: ["playwright", "test", "tests/e2e/aiqs-smoke.spec.mjs"],
      cwd: context.rootDir,
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: context.appUrl,
        SMOKE_TEST_EMAIL_PROFILE: "aiqs",
      },
      label: "AIQS Playwright smoke",
    });

    console.log("PASS aiqs-local-smoke");
    console.log(`target=${smokeUrl}`);
    console.log(`dev_started_by_script=${startedDev ? "yes" : "no"}`);
    if (startedDev) {
      console.log(`dev_log=${logFile}`);
    }
  } finally {
    if (devProcess) {
      stopChildProcessGroup(devProcess, "SIGINT");
      const result = await waitForExit(devProcess, 15000);
      if (result.timedOut) {
        stopChildProcessGroup(devProcess, "SIGTERM");
        await waitForExit(devProcess, 5000);
      }
    }
  }
}

main().catch((error) => {
  console.error("FAIL verify-local-aiqs-smoke:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
