import { expect, test } from "@playwright/test";
import {
  assertLocalTarget,
  requestMagicLink,
  resolveLocalAuthSmokeContext,
  waitForMagicLink,
} from "../../scripts/_shared/local-auth-smoke-utils.mjs";

const entryUrl = process.env.GALLERY_E2E_ENTRY_URL;
const orderedPhotoIds = (process.env.GALLERY_E2E_PHOTO_IDS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

async function loginWithLocalMagicLink(page) {
  const context = resolveLocalAuthSmokeContext();
  assertLocalTarget(context);
  const email = process.env.SMOKE_TEST_EMAIL || "smoke.default.local@example.com";

  await requestMagicLink({
    apiUrl: context.apiUrl,
    publishableKey: context.publishableKey,
    email,
    redirectTo: context.appUrl,
  });
  const { verifyLink } = await waitForMagicLink({
    mailpitUrl: context.mailpitUrl,
    email,
  });

  await page.goto(verifyLink);
  await page.waitForLoadState("networkidle");
}

async function dragWithTouch(page, fromBox, toBox) {
  await page.evaluate(
    async ({ fromBox, toBox }) => {
      const start = {
        x: fromBox.x + fromBox.width / 2,
        y: fromBox.y + fromBox.height / 2,
      };
      const end = {
        x: toBox.x + toBox.width / 2,
        y: toBox.y + toBox.height / 2,
      };
      const target = document.elementFromPoint(start.x, start.y);
      if (!target) {
        throw new Error("Could not find drag source element.");
      }

      const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
      const createTouch = (point) =>
        new Touch({
          identifier: 1,
          target,
          clientX: point.x,
          clientY: point.y,
          pageX: point.x + window.scrollX,
          pageY: point.y + window.scrollY,
          screenX: point.x,
          screenY: point.y,
          radiusX: 1,
          radiusY: 1,
          force: 1,
        });
      const fire = (type, point, active) => {
        const touch = createTouch(point);
        target.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: active ? [touch] : [],
            targetTouches: active ? [touch] : [],
            changedTouches: [touch],
          })
        );
      };

      fire("touchstart", start, true);
      await wait(160);
      for (let step = 1; step <= 8; step += 1) {
        const progress = step / 8;
        fire(
          "touchmove",
          {
            x: start.x + (end.x - start.x) * progress,
            y: start.y + (end.y - start.y) * progress,
          },
          true
        );
        await wait(16);
      }
      fire("touchend", end, false);
    },
    { fromBox, toBox }
  );
}

test.describe("entry photo gallery smoke", () => {
  test.skip(!entryUrl, "Set GALLERY_E2E_ENTRY_URL to a local entry detail URL.");
  test.skip(orderedPhotoIds.length < 3, "Set GALLERY_E2E_PHOTO_IDS to at least 3 ordered photo ids.");

  test("reorders a thumbnail to the left without visible copy badges", async ({ page }) => {
    await loginWithLocalMagicLink(page);
    await page.goto(entryUrl ?? "/");

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

    await dragWithTouch(page, secondBox, firstBox);

    await expect(second).toBeVisible();
    const movedBox = await second.boundingBox();
    expect(movedBox).not.toBeNull();
    expect(movedBox.x).toBeLessThan(firstBox.x + firstBox.width / 2);
  });
});
