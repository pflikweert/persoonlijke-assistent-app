import { expect, test } from "@playwright/test";
import { loginWithLocalMagicLink } from "./_shared/local-auth-login.mjs";

async function dispatchInstallPrompt(page, outcome = "dismissed") {
  await page.evaluate((nextOutcome) => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    Object.defineProperty(event, "prompt", {
      value: async () => ({ outcome: nextOutcome, platform: "web" }),
    });
    window.dispatchEvent(event);
  }, outcome);
}

test.describe("PWA install flow", () => {
  test.setTimeout(60_000);

  test("exposes an installable Chromium manifest without browser errors", async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Chrome DevTools Protocol is Chromium-only");

    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");
    const client = await context.newCDPSession(page);
    const appManifest = await client.send("Page.getAppManifest");
    const installability = await client.send("Page.getInstallabilityErrors");

    expect(appManifest.errors).toEqual([]);
    expect(appManifest.manifest?.name).toBe("Budio Vandaag");
    expect(appManifest.manifest?.display).toBe("kStandalone");
    expect(appManifest.manifest?.icons).toHaveLength(3);
    expect(installability.installabilityErrors).toEqual([]);
  });

  test("remembers Later and reactivates the Chromium prompt from settings", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "beforeinstallprompt is Chromium-only");

    await loginWithLocalMagicLink(page);
    await dispatchInstallPrompt(page);

    await expect(
      page.getByText(
        "Open Budio Vandaag als app, zonder eerst je browser te openen.",
      ),
    ).toBeVisible();
    await page.getByText("Later", { exact: true }).click();
    await expect(page.getByText("Budio installeren", { exact: true })).toHaveCount(0);

    const dismissalKeys = await page.evaluate(() =>
      Object.keys(localStorage).filter((key) =>
        key.startsWith("budio.pwa-install.dismissed.v1:"),
      ),
    );
    expect(dismissalKeys).toHaveLength(1);

    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await dispatchInstallPrompt(page);
    await expect(
      page.getByText(
        "Open Budio Vandaag als app, zonder eerst je browser te openen.",
      ),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Budio installeren" }).click();
    await expect(
      page.getByText(
        "Open Budio Vandaag als app, zonder eerst je browser te openen.",
      ),
    ).toBeVisible();
    await expect(page.getByText("Installeren", { exact: true })).toBeVisible();
  });

  test("remembers a dismissed Chromium browser prompt", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "beforeinstallprompt is Chromium-only");

    await loginWithLocalMagicLink(page);
    await dispatchInstallPrompt(page, "dismissed");
    await page.getByText("Installeren", { exact: true }).click();

    await expect(
      page.getByText(
        "Open Budio Vandaag als app, zonder eerst je browser te openen.",
      ),
    ).toHaveCount(0);
    const dismissed = await page.evaluate(() =>
      Object.keys(localStorage).some(
        (key) =>
          key.startsWith("budio.pwa-install.dismissed.v1:") &&
          localStorage.getItem(key) === "1",
      ),
    );
    expect(dismissed).toBe(true);
  });

  test("shows manual guidance when the browser has no prompt API", async ({ page }) => {
    await loginWithLocalMagicLink(page);
    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Budio installeren" }).click();
    await expect(
      page.getByText(
        "Gebruik de installatieoptie in het menu van je browser. Zie je die niet, dan ondersteunt deze browser installatie niet.",
      ),
    ).toBeVisible();
    await expect(page.getByText("Begrepen", { exact: true })).toBeVisible();
  });

  test("renders the Chromium install sheet in dark mode", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "beforeinstallprompt is Chromium-only");

    await page.emulateMedia({ colorScheme: "dark" });
    await loginWithLocalMagicLink(page);
    await dispatchInstallPrompt(page);

    await expect(
      page.getByText(
        "Open Budio Vandaag als app, zonder eerst je browser te openen.",
      ),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.style.colorScheme),
      )
      .toBe("dark");
    await expect
      .poll(() =>
        page
          .getByText("Budio installeren", { exact: true })
          .evaluate((element) => getComputedStyle(element).color),
      )
      .toBe("rgb(244, 241, 232)");
  });

  test("hides install UI in standalone display mode", async ({ page }) => {
    await page.addInitScript(() => {
      const originalMatchMedia = window.matchMedia.bind(window);
      window.matchMedia = (query) => {
        if (query === "(display-mode: standalone)") {
          return {
            matches: true,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => true,
          };
        }
        return originalMatchMedia(query);
      };
    });

    await loginWithLocalMagicLink(page);
    await dispatchInstallPrompt(page);
    await expect(page.getByText("Budio installeren", { exact: true })).toHaveCount(0);

    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("button", { name: "Budio installeren" }),
    ).toHaveCount(0);
  });
});
