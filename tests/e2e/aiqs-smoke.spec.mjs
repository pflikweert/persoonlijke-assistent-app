import { expect, test } from "@playwright/test";
import { loginWithLocalMagicLink } from "./_shared/local-auth-login.mjs";

test.describe("AIQS local smoke", () => {
  test.setTimeout(60000);

  test("shows the workspace-first overview for an authenticated AIQS admin", async ({ page }) => {
    await loginWithLocalMagicLink(page, { profile: "aiqs" });

    await page.goto("/settings-ai-quality-studio");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/settings-ai-quality-studio$/);
    await expect(page.getByText("AI Quality Studio").first()).toBeVisible();
    await expect(page.getByText("Promptfamilies", { exact: true })).toBeVisible();
    await expect(page.getByText("Systeem", { exact: true })).toBeVisible();
    await expect(page.getByText("Debug logging", { exact: true })).toBeVisible();

    await expect(page.getByText("AIQS context")).toHaveCount(0);
    await expect(page.getByText("Runtime governance")).toHaveCount(0);
    await expect(page.getByText("AIQS taken")).toHaveCount(0);

    await expect(
      page
        .getByText(/Alle runtimes actief|promptfamilie mist live baseline|Nog geen runtime-basis/i)
        .first()
    ).toBeVisible();

    const todayRow = page.getByRole("button", { name: /^Vandaag\b/ }).first();
    await expect(todayRow).toBeVisible();
    await todayRow.click();

    await expect(page).toHaveURL(/\/settings-ai-quality-studio\/group\/today$/);
    await expect(page.getByText("Onderdelen", { exact: true })).toBeVisible();
  });
});
