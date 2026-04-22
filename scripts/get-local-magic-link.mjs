#!/usr/bin/env node
import {
  assertLocalTarget,
  requestMagicLink,
  resolveLocalAuthSmokeContext,
  resolveSmokeEmail,
  waitForMagicLink,
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

  const profile = readArg("profile", process.env.SMOKE_TEST_EMAIL_PROFILE || "default");
  const explicitEmail = readArg("email", process.env.SMOKE_TEST_EMAIL || "");
  const email = explicitEmail || resolveSmokeEmail(profile);

  await requestMagicLink({
    apiUrl: context.apiUrl,
    publishableKey: context.publishableKey,
    email,
    redirectTo: context.appUrl,
  });

  const message = await waitForMagicLink({
    mailpitUrl: context.mailpitUrl,
    email,
  });

  console.log(JSON.stringify({
    target: context.target,
    profile,
    email,
    messageId: message.messageId,
    subject: message.subject,
    verifyLink: message.verifyLink,
  }, null, 2));
}

main().catch((error) => {
  console.error("FAIL get-local-magic-link:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
