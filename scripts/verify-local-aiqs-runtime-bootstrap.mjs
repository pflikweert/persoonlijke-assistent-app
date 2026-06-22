#!/usr/bin/env node
import {
  archiveAiqsRuntimeManagedLiveVersions,
  ensureAiqsInternalTokenRuntime,
  ensureAiqsSmokeAdminSession,
  importAiqsRuntimeBaselineWithAccessToken,
  importAiqsRuntimeBaselineWithInternalToken,
  verifyAiqsRuntimeBindings,
} from "./_shared/local-aiqs-smoke-utils.mjs";
import {
  assertLocalTarget,
  resolveLocalAuthSmokeContext,
  resolveSmokeEmail,
} from "./_shared/local-auth-smoke-utils.mjs";

function readArg(name, fallback = "") {
  const prefixed = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (prefixed) {
    return prefixed.slice(name.length + 3);
  }

  const index = process.argv.findIndex((arg) => arg === `--${name}`);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }

  return fallback;
}

async function main() {
  const context = resolveLocalAuthSmokeContext();
  assertLocalTarget(context);

  const profile = readArg("profile", process.env.SMOKE_TEST_EMAIL_PROFILE || "aiqs");
  const explicitEmail = readArg("email", process.env.SMOKE_TEST_EMAIL || "");
  const email = explicitEmail || resolveSmokeEmail(profile);
  const internalRuntime = await ensureAiqsInternalTokenRuntime(context);
  const internalToken = internalRuntime.token;

  await archiveAiqsRuntimeManagedLiveVersions(context);

  const internalResult = await importAiqsRuntimeBaselineWithInternalToken(context, internalToken);
  const internalSummary = internalResult?.importResult?.summary;
  if (!internalSummary || internalSummary.error !== 0) {
    throw new Error("Internal import did not finish cleanly.");
  }

  const adminSession = await ensureAiqsSmokeAdminSession(context, { email, profile });
  const founderResult = await importAiqsRuntimeBaselineWithAccessToken(context, adminSession.accessToken);
  const founderSummary = founderResult?.importResult?.summary;
  if (!founderSummary || founderSummary.error !== 0) {
    throw new Error("Founder import did not finish cleanly.");
  }

  await verifyAiqsRuntimeBindings(context);

  console.log("PASS aiqs-runtime-bootstrap");
  console.log(`email=${adminSession.email}`);
  console.log(`userId=${adminSession.userId}`);
  console.log(`messageId=${adminSession.messageId}`);
  console.log(`internalTokenSource=${internalRuntime.source}`);
  console.log(`functionsRestarted=${internalRuntime.restartedFunctions ? "yes" : "no"}`);
  if (internalRuntime.envFile) {
    console.log(`functionsEnvFile=${internalRuntime.envFile}`);
  }
}

main().catch((error) => {
  console.error(
    "FAIL verify-local-aiqs-runtime-bootstrap:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
