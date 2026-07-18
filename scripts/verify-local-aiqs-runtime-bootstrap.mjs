#!/usr/bin/env node
import {
  assertAiqsCustomLivePreserved,
  assertAiqsInvalidBindingPreserved,
  archiveAiqsRuntimeManagedLiveVersions,
  ensureAiqsInternalTokenRuntime,
  ensureAiqsSmokeAdminSession,
  importAiqsRuntimeBaselineWithAccessToken,
  importAiqsRuntimeBaselineWithInternalToken,
  installAiqsCustomLivePreservationFixture,
  installAiqsInvalidBindingFixture,
  restoreAiqsCustomLivePreservationFixture,
  restoreAiqsInvalidBindingFixture,
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
  const preservationFixture = await installAiqsCustomLivePreservationFixture(context);
  try {
    const founderResult = await importAiqsRuntimeBaselineWithAccessToken(context, adminSession.accessToken);
    const founderSummary = founderResult?.importResult?.summary;
    if (!founderSummary || founderSummary.error !== 0) {
      throw new Error("Founder import did not finish cleanly.");
    }

    await assertAiqsCustomLivePreserved(context, preservationFixture, founderResult);
  } finally {
    await restoreAiqsCustomLivePreservationFixture(context, preservationFixture);
  }

  const invalidBindingFixture = await installAiqsInvalidBindingFixture(context);
  try {
    const invalidResult = await importAiqsRuntimeBaselineWithInternalToken(context, internalToken);
    await assertAiqsInvalidBindingPreserved(context, invalidBindingFixture, invalidResult);
  } finally {
    await restoreAiqsInvalidBindingFixture(context, invalidBindingFixture);
  }

  const finalResult = await importAiqsRuntimeBaselineWithInternalToken(context, internalToken);
  if (finalResult?.importResult?.summary?.error !== 0) {
    throw new Error("Final baseline ensure did not finish cleanly after fixture restoration.");
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
