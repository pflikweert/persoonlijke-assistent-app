import {
  assertLocalTarget,
  requestMagicLink,
  resolveLocalAuthSmokeContext,
  resolveSmokeEmail,
  waitForMagicLink,
} from "../../../scripts/_shared/local-auth-smoke-utils.mjs";

export async function loginWithLocalMagicLink(page, {
  email,
  profile = process.env.SMOKE_TEST_EMAIL_PROFILE || "default",
  redirectTo,
} = {}) {
  const context = resolveLocalAuthSmokeContext();
  assertLocalTarget(context);

  const targetEmail = email || process.env.SMOKE_TEST_EMAIL || resolveSmokeEmail(profile);

  await requestMagicLink({
    apiUrl: context.apiUrl,
    publishableKey: context.publishableKey,
    email: targetEmail,
    redirectTo: redirectTo || context.appUrl,
  });

  const { verifyLink } = await waitForMagicLink({
    mailpitUrl: context.mailpitUrl,
    email: targetEmail,
  });

  await page.goto(verifyLink);
  await page.waitForLoadState("networkidle");

  await page.waitForFunction(() => !window.location.pathname.startsWith("/sign-in"), undefined, {
    timeout: 15000,
  });

  if (page.url().includes("/sign-in")) {
    throw new Error("Magic-link browser login did not leave /sign-in.");
  }
}
