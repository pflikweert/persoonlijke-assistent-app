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
});
