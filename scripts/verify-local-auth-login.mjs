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

async function fetchSessionFromVerifyLink(verifyLink, publishableKey) {
  const response = await fetch(verifyLink, {
    method: "GET",
    headers: {
      apikey: publishableKey,
    },
    redirect: "manual",
  });

  const location = response.headers.get("location") || "";
  const combined = `${location} ${verifyLink}`;
  const accessTokenMatch = combined.match(/[?#&]access_token=([^&\s]+)/i);
  const refreshTokenMatch = combined.match(/[?#&]refresh_token=([^&\s]+)/i);

  const accessToken = accessTokenMatch ? decodeURIComponent(accessTokenMatch[1]) : "";
  const refreshToken = refreshTokenMatch ? decodeURIComponent(refreshTokenMatch[1]) : "";

  if (!accessToken || !refreshToken) {
    throw new Error("Verify link did not yield access/refresh tokens.");
  }

  return { accessToken, refreshToken, location };
}

async function fetchUser(apiUrl, publishableKey, accessToken) {
  const response = await fetch(`${apiUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unable to fetch user (${response.status}): ${body}`);
  }

  return response.json();
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

  const session = await fetchSessionFromVerifyLink(message.verifyLink, context.publishableKey);
  const user = await fetchUser(context.apiUrl, context.publishableKey, session.accessToken);

  const userId = String(user?.id || "");
  if (!userId) {
    throw new Error("Session token resolved, but auth user id is missing.");
  }

  console.log(
    `PASS auth-login target=${context.target} profile=${profile} email=${email} userId=${userId}`
  );
  console.log(`messageId=${message.messageId}`);
  console.log(`verifyLink=${message.verifyLink}`);
}

main().catch((error) => {
  console.error("FAIL verify-local-auth-login:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
