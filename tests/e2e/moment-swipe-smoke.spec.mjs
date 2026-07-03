import { expect, test } from "@playwright/test";
import { loginWithLocalMagicLink } from "./_shared/local-auth-login.mjs";

const entryUrl = process.env.MOMENT_SWIPE_E2E_ENTRY_URL;
const startTitle = process.env.MOMENT_SWIPE_E2E_START_TITLE;
const startBody = process.env.MOMENT_SWIPE_E2E_START_BODY;
const nextTitle = process.env.MOMENT_SWIPE_E2E_NEXT_TITLE;
const nextEntryId = process.env.MOMENT_SWIPE_E2E_NEXT_ENTRY_ID;

async function dragLeftOnBody(page) {
  const bodyText = page.getByText(startBody ?? "", { exact: false }).first();
  await expect(bodyText).toBeVisible({ timeout: 15000 });

  const box = await bodyText.boundingBox();
  expect(box).not.toBeNull();

  const y = Math.round(box.y + box.height / 2);
  const startX = Math.round(box.x + box.width - 8);
  const endX = Math.round(box.x + 8);

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.move(endX, y, { steps: 12 });
  await page.mouse.up();
}

async function scrollBodyDown(page) {
  const bodyText = page.getByText(startBody ?? "", { exact: true });
  await expect(bodyText).toBeVisible({ timeout: 15000 });

  const before = await page.evaluate(() => {
    const scrollElement = [...document.querySelectorAll("div")]
      .filter((element) => element.scrollHeight > element.clientHeight)
      .sort((left, right) => (right.scrollHeight - right.clientHeight) - (left.scrollHeight - left.clientHeight))[0] ?? document.scrollingElement;
    return scrollElement?.scrollTop ?? window.scrollY;
  });

  const box = await bodyText.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2));
  await page.mouse.wheel(0, 420);
  await expect
    .poll(async () => page.evaluate(() => {
      const scrollElement = [...document.querySelectorAll("div")]
        .filter((element) => element.scrollHeight > element.clientHeight)
        .sort((left, right) => (right.scrollHeight - right.clientHeight) - (left.scrollHeight - left.clientHeight))[0] ?? document.scrollingElement;
      return scrollElement?.scrollTop ?? window.scrollY;
    }))
    .toBeGreaterThan(before);
}

test.describe("moment detail swipe smoke", () => {
  test.skip(!entryUrl, "Set MOMENT_SWIPE_E2E_ENTRY_URL to a local entry detail URL.");
  test.skip(!startTitle || !startBody || !nextTitle || !nextEntryId, "Set moment swipe smoke body, titles and next entry id.");

  test("swipes from current moment to next moment", async ({ page }) => {
    test.setTimeout(60000);

    await loginWithLocalMagicLink(page);
    await page.goto(entryUrl ?? "/");

    await expect(page.getByText(startTitle ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await scrollBodyDown(page);
    await page.goto(entryUrl ?? "/");
    await expect(page.getByText(startTitle ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await dragLeftOnBody(page);

    await expect(page).toHaveURL(new RegExp(`/entry/${nextEntryId}`), { timeout: 15000 });
    await expect(page.getByText(nextTitle ?? "", { exact: true })).toBeVisible({ timeout: 15000 });
  });
});
