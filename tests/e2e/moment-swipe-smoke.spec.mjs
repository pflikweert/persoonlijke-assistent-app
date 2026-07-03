import { expect, test } from "@playwright/test";
import { loginWithLocalMagicLink } from "./_shared/local-auth-login.mjs";

const entryUrl = process.env.MOMENT_SWIPE_E2E_ENTRY_URL;
const startTitle = process.env.MOMENT_SWIPE_E2E_START_TITLE;
const startBody = process.env.MOMENT_SWIPE_E2E_START_BODY;
const nextTitle = process.env.MOMENT_SWIPE_E2E_NEXT_TITLE;
const nextEntryId = process.env.MOMENT_SWIPE_E2E_NEXT_ENTRY_ID;

async function dragLeftOnBody(page) {
  const bodyText = page.getByText(startBody ?? "", { exact: true });
  await expect(bodyText).toBeVisible({ timeout: 15000 });

  const box = await bodyText.boundingBox();
  expect(box).not.toBeNull();

  const y = Math.round(box.y + box.height / 2);
  const centerX = Math.round(box.x + box.width / 2);
  const startX = centerX + 150;
  const endX = centerX - 150;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.move(endX, y, { steps: 12 });
  await page.mouse.up();
}

test.describe("moment detail swipe smoke", () => {
  test.skip(!entryUrl, "Set MOMENT_SWIPE_E2E_ENTRY_URL to a local entry detail URL.");
  test.skip(!startTitle || !startBody || !nextTitle || !nextEntryId, "Set moment swipe smoke body, titles and next entry id.");

  test("swipes from current moment to next moment", async ({ page }) => {
    test.setTimeout(60000);

    await loginWithLocalMagicLink(page);
    await page.goto(entryUrl ?? "/");

    await expect(page.getByText(startTitle ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await dragLeftOnBody(page);

    await expect(page).toHaveURL(new RegExp(`/entry/${nextEntryId}`), { timeout: 15000 });
    await expect(page.getByText(nextTitle ?? "", { exact: true })).toBeVisible({ timeout: 15000 });
  });
});
