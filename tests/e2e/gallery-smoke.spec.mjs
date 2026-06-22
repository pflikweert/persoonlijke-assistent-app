import { expect, test } from "@playwright/test";
import { loginWithLocalMagicLink } from "./_shared/local-auth-login.mjs";

const entryUrl = process.env.GALLERY_E2E_ENTRY_URL;
const orderedPhotoIds = (process.env.GALLERY_E2E_PHOTO_IDS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

async function dragWithMouse(page, fromBox, toBox) {
  const start = {
    x: fromBox.x + fromBox.width / 2,
    y: fromBox.y + fromBox.height / 2,
  };
  const end = {
    x: toBox.x + toBox.width / 2,
    y: toBox.y + toBox.height / 2,
  };

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.waitForTimeout(160);
  await page.mouse.move(end.x, end.y, { steps: 8 });
  await page.mouse.up();
}

test.describe("entry photo gallery smoke", () => {
  test.skip(!entryUrl, "Set GALLERY_E2E_ENTRY_URL to a local entry detail URL.");
  test.skip(orderedPhotoIds.length < 3, "Set GALLERY_E2E_PHOTO_IDS to at least 3 ordered photo ids.");

  test("reorders a thumbnail to the left without visible copy badges", async ({ page }) => {
    test.setTimeout(60000);

    await loginWithLocalMagicLink(page);
    await page.goto(entryUrl ?? "/");
    await expect(page.getByText("Foto's laden...")).toHaveCount(0, { timeout: 15000 });

    const first = page.getByTestId(`entry-photo-thumb-${orderedPhotoIds[0]}`);
    const second = page.getByTestId(`entry-photo-thumb-${orderedPhotoIds[1]}`);

    await expect(first).toBeVisible();
    await expect(second).toBeVisible();
    await expect(page.getByText("Hoofd")).toHaveCount(0);
    await expect(page.getByText("Sleep")).toHaveCount(0);

    await second.scrollIntoViewIfNeeded();

    const firstBox = await first.boundingBox();
    const secondBox = await second.boundingBox();
    expect(firstBox).not.toBeNull();
    expect(secondBox).not.toBeNull();

    await dragWithMouse(page, secondBox, firstBox);

    await expect(second).toBeVisible();
    const movedBox = await second.boundingBox();
    expect(movedBox).not.toBeNull();
    expect(movedBox.x).toBeLessThan(firstBox.x + firstBox.width / 2);
  });
});
