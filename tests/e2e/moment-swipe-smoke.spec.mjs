import { expect, test } from "@playwright/test";
import { loginWithLocalMagicLink } from "./_shared/local-auth-login.mjs";

const entryUrl = process.env.MOMENT_SWIPE_E2E_ENTRY_URL;
const startTitle = process.env.MOMENT_SWIPE_E2E_START_TITLE;
const nextTitle = process.env.MOMENT_SWIPE_E2E_NEXT_TITLE;
const nextEntryId = process.env.MOMENT_SWIPE_E2E_NEXT_ENTRY_ID;

async function dragLeft(page) {
  const viewport = page.viewportSize() ?? { width: 390, height: 800 };
  const centerX = Math.round(viewport.width / 2);
  const y = Math.round(viewport.height * 0.42);
  const startX = centerX + 160;
  const endX = centerX - 160;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.move(endX, y, { steps: 12 });
  await page.mouse.up();
}

test.describe("moment detail swipe smoke", () => {
  test.skip(!entryUrl, "Set MOMENT_SWIPE_E2E_ENTRY_URL to a local entry detail URL.");
  test.skip(!startTitle || !nextTitle || !nextEntryId, "Set moment swipe smoke titles and next entry id.");

  test("swipes from current moment to next moment", async ({ page }) => {
    test.setTimeout(60000);

    await loginWithLocalMagicLink(page);
    await page.goto(entryUrl ?? "/");

    await expect(page.getByText(startTitle ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await dragLeft(page);

    await expect(page).toHaveURL(new RegExp(`/entry/${nextEntryId}`), { timeout: 15000 });
    await expect(page.getByText(nextTitle ?? "", { exact: true })).toBeVisible({ timeout: 15000 });
  });
});
