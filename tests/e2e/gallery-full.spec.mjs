import { expect, test } from "@playwright/test";
import path from "node:path";
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
const uploadFixture = path.resolve("assets/images/icon.png");

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

test.describe("entry photo gallery full end-user flow", () => {
  test.skip(process.env.GALLERY_E2E_FULL !== "1", "Set GALLERY_E2E_FULL=1 to run the full gallery suite.");
  test.skip(!entryUrl, "Set GALLERY_E2E_ENTRY_URL to a local entry detail URL.");
  test.skip(orderedPhotoIds.length < 3, "Set GALLERY_E2E_PHOTO_IDS to at least 3 ordered photo ids.");
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await loginWithLocalMagicLink(page);
    await page.goto(entryUrl ?? "/");
    await expect(page.getByText("Foto's laden...")).toHaveCount(0, { timeout: 15000 });
  });

  test("opens the viewer and cancels delete without mutating the fixture", async ({ page }) => {
    const first = page.getByTestId(`entry-photo-thumb-${orderedPhotoIds[0]}`);
    await expect(first).toBeVisible();

    await first.click();
    await expect(page.getByLabel("Foto verwijderen")).toBeVisible();
    await page.getByLabel("Foto verwijderen").click();
    await expect(page.getByText("Foto verwijderen?")).toBeVisible();
    await page.getByText("Annuleren").click();
    await expect(page.getByText("Foto verwijderen?")).toHaveCount(0);
    await expect(page.getByTestId(`entry-photo-thumb-${orderedPhotoIds[0]}`)).toBeVisible();
  });

  test("shows a live drag placeholder before persisting reorder", async ({ page }) => {
    test.fixme(
      true,
      "Enable after a deterministic local web touch-drag harness proves the placeholder state during an in-progress drag."
    );
  });

  test("keeps upload/max-limit scenarios gated until deterministic local fixtures exist", async () => {
    test.fixme(
      true,
      "Add deterministic local-only upload and max-limit fixtures before enabling full add/max gallery coverage."
    );
  });

  test("keeps existing photos visible when a new web upload fails during file-byte materialization", async ({
    page,
  }) => {
    const thumbs = page.locator('[data-testid^="entry-photo-thumb-"]');
    const initialCount = await thumbs.count();
    test.skip(initialCount < 1, "This flow needs at least one existing fixture photo.");

    await page.evaluate(() => {
      const original = File.prototype.arrayBuffer;
      let failedOnce = false;

      Object.defineProperty(window, "__entryPhotoRestoreArrayBuffer", {
        configurable: true,
        value: () => {
          File.prototype.arrayBuffer = original;
        },
      });

      File.prototype.arrayBuffer = async function patchedArrayBuffer() {
        if (!failedOnce) {
          failedOnce = true;
          throw new Error("simulated picker file read failure");
        }

        return original.call(this);
      };
    });

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: /foto toevoegen/i }).click();
    await page.getByRole("button", { name: /foto's kiezen/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFixture);

    await expect(
      page.getByText("Foto voorbereiden mislukte. Kies de foto opnieuw of download hem eerst naar je toestel.")
    ).toBeVisible();
    await expect(page.getByText("Foto's zijn nu niet beschikbaar")).toHaveCount(0);
    await expect(thumbs).toHaveCount(initialCount);

    await page.evaluate(() => {
      window.__entryPhotoRestoreArrayBuffer?.();
      delete window.__entryPhotoRestoreArrayBuffer;
    });
  });

  test("adds two photos and removes them again on the local fixture entry", async ({ page }) => {
    const thumbs = page.locator('[data-testid^="entry-photo-thumb-"]');
    const initialCount = await thumbs.count();
    test.skip(initialCount < 1, "This flow needs at least one existing fixture photo.");

    const uploadOnePhoto = async () => {
      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.getByRole("button", { name: /foto toevoegen/i }).click();
      await page.getByRole("button", { name: /foto's kiezen/i }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(uploadFixture);
      await expect(page.getByText("Foto verwerken...")).toHaveCount(0, { timeout: 30000 });
      await expect(page.getByText("Foto's vernieuwen...")).toHaveCount(0, { timeout: 30000 });
      await expect(page.getByText("Foto's zijn nu niet beschikbaar")).toHaveCount(0, {
        timeout: 30000,
      });
    };

    await uploadOnePhoto();
    await expect(thumbs).toHaveCount(initialCount + 1, { timeout: 30000 });

    await uploadOnePhoto();
    await expect(thumbs).toHaveCount(initialCount + 2, { timeout: 30000 });

    for (let index = 0; index < 2; index += 1) {
      const newestThumb = thumbs.nth(await thumbs.count() - 1);
      await newestThumb.click();
      await expect(page.getByLabel("Foto verwijderen")).toBeVisible({ timeout: 15000 });
      await page.getByLabel("Foto verwijderen").click();
      await expect(page.getByText("Foto verwijderen?")).toBeVisible({ timeout: 15000 });
      await page.getByText("Verwijderen").last().click();
      await expect(page.getByText("Foto verwijderen?")).toHaveCount(0, { timeout: 30000 });
      await expect(page.getByText("Foto's zijn nu niet beschikbaar")).toHaveCount(0, {
        timeout: 30000,
      });
      await expect(thumbs).toHaveCount(initialCount + 1 - index, { timeout: 30000 });
    }

    await expect(thumbs).toHaveCount(initialCount, { timeout: 30000 });
  });
});
