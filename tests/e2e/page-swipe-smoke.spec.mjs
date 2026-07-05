import { expect, test } from "@playwright/test";
import { loginWithLocalMagicLink } from "./_shared/local-auth-login.mjs";

const dayUrl = process.env.PAGE_SWIPE_E2E_DAY_URL;
const nextDayPath = process.env.PAGE_SWIPE_E2E_NEXT_DAY_PATH;
const weekUrl = process.env.PAGE_SWIPE_E2E_WEEK_URL;
const monthUrl = process.env.PAGE_SWIPE_E2E_MONTH_URL;
const firstDaySummary = process.env.PAGE_SWIPE_E2E_FIRST_DAY_SUMMARY;
const secondDaySummary = process.env.PAGE_SWIPE_E2E_SECOND_DAY_SUMMARY;
const firstWeekSummary = process.env.PAGE_SWIPE_E2E_FIRST_WEEK_SUMMARY;
const secondWeekSummary = process.env.PAGE_SWIPE_E2E_SECOND_WEEK_SUMMARY;
const firstMonthSummary = process.env.PAGE_SWIPE_E2E_FIRST_MONTH_SUMMARY;
const secondMonthSummary = process.env.PAGE_SWIPE_E2E_SECOND_MONTH_SUMMARY;

async function dragLeftOnText(page, text) {
  const target = page.getByText(text ?? "", { exact: false }).first();
  await expect(target).toBeVisible({ timeout: 15000 });

  const box = await target.boundingBox();
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

async function scrollDownOnText(page, text) {
  const target = page.getByText(text ?? "", { exact: false }).first();
  await expect(target).toBeVisible({ timeout: 15000 });

  const before = await page.evaluate(() => {
    const scrollElement = [...document.querySelectorAll("div")]
      .filter((element) => element.scrollHeight > element.clientHeight)
      .sort((left, right) => (right.scrollHeight - right.clientHeight) - (left.scrollHeight - left.clientHeight))[0] ?? document.scrollingElement;
    return scrollElement?.scrollTop ?? window.scrollY;
  });

  const box = await target.boundingBox();
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

test.describe("day/week/month page swipe smoke", () => {
  test.skip(
    !dayUrl ||
      !nextDayPath ||
      !weekUrl ||
      !monthUrl ||
      !firstDaySummary ||
      !secondDaySummary ||
      !firstWeekSummary ||
      !secondWeekSummary ||
      !firstMonthSummary ||
      !secondMonthSummary,
    "Set page swipe smoke env vars.",
  );

  test.beforeEach(async ({ page }) => {
    await loginWithLocalMagicLink(page);
  });

  test("scrolls and swipes from day detail to next existing day", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto(dayUrl ?? "/");
    await expect(page.getByText(firstDaySummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await scrollDownOnText(page, firstDaySummary);
    await page.goto(dayUrl ?? "/");
    await expect(page.getByText(firstDaySummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await dragLeftOnText(page, firstDaySummary);

    await expect(page).toHaveURL(new RegExp(`${nextDayPath}$`), { timeout: 15000 });
    await expect(page.getByText(secondDaySummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });
  });

  test("scrolls and swipes from week reflection to next existing week", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto(weekUrl ?? "/");
    await expect(page.getByText(firstWeekSummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await scrollDownOnText(page, firstWeekSummary);
    await page.goto(weekUrl ?? "/");
    await expect(page.getByText(firstWeekSummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await dragLeftOnText(page, firstWeekSummary);

    await expect(page.getByText(secondWeekSummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });
  });

  test("scrolls and swipes from month reflection to next existing month", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto(monthUrl ?? "/");
    await expect(page.getByText(firstMonthSummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await scrollDownOnText(page, firstMonthSummary);
    await page.goto(monthUrl ?? "/");
    await expect(page.getByText(firstMonthSummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });

    await dragLeftOnText(page, firstMonthSummary);

    await expect(page.getByText(secondMonthSummary ?? "", { exact: true })).toBeVisible({ timeout: 15000 });
  });
});
