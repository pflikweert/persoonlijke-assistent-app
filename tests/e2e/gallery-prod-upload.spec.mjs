import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const ENV_FILE = path.join(ROOT_DIR, ".env.local");
const DEFAULT_ENTRY_ID = "f806e61f-1148-49d1-9694-78ecdda41301";
const UPLOAD_FIXTURE = path.join(ROOT_DIR, "assets/images/icon.png");

function stripQuotes(value) {
  const trimmed = String(value ?? "").trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    return {};
  }

  const raw = fs.readFileSync(ENV_FILE, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    if (!line || /^\s*#/.test(line)) {
      continue;
    }
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }
    out[match[1]] = stripQuotes(match[2]);
  }
  return out;
}

function envValue(key, fallback = "") {
  const parsed = parseEnvFile();
  return process.env[key]?.trim() || parsed[key]?.trim() || fallback;
}

function getProdContext() {
  const baseUrl = envValue("PROD_AGENT_TEST_REDIRECT_URL", "https://assistent.budio.nl").replace(/\/+$/, "");
  const apiUrl = envValue("EXPO_PUBLIC_SUPABASE_CLOUD_URL");
  const publishableKey = envValue("EXPO_PUBLIC_SUPABASE_CLOUD_PUBLISHABLE_KEY");
  const serviceRoleKey = envValue("APP_SUPABASE_SERVICE_ROLE_KEY");
  const email = envValue("PROD_AGENT_TEST_EMAIL");
  const inboxAccess = envValue("PROD_AGENT_TEST_INBOX_ACCESS");

  if (!apiUrl || !publishableKey || !serviceRoleKey || !email) {
    throw new Error("Missing production auth env for gallery prod smoke.");
  }

  if (inboxAccess !== "supabase_admin_generate_link") {
    throw new Error(`Unsupported PROD_AGENT_TEST_INBOX_ACCESS=${inboxAccess || "missing"}`);
  }

  return {
    baseUrl,
    apiUrl,
    publishableKey,
    serviceRoleKey,
    email,
    entryUrl:
      process.env.GALLERY_PROD_ENTRY_URL ||
      `${baseUrl}/entry/${process.env.GALLERY_PROD_ENTRY_ID || DEFAULT_ENTRY_ID}`,
  };
}

async function createProdMagicLink() {
  const context = getProdContext();
  const admin = createClient(context.apiUrl, context.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: context.email,
    options: {
      redirectTo: context.baseUrl,
    },
  });

  if (error) {
    throw error;
  }

  const verifyLink = data?.properties?.action_link;
  if (!verifyLink) {
    throw new Error("Supabase admin generateLink returned no action_link.");
  }

  return {
    ...context,
    verifyLink,
  };
}

async function loginWithProdMagicLink(page) {
  const context = await createProdMagicLink();
  await page.goto(context.verifyLink);
  await page.waitForLoadState("networkidle");
  return context;
}

async function waitForStableThumbCount(locator, minimum = 1) {
  await expect(locator.first()).toBeVisible({ timeout: 30000 });

  let previousCount = -1;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const nextCount = await locator.count();
    if (nextCount >= minimum && nextCount === previousCount) {
      return nextCount;
    }

    previousCount = nextCount;
    await locator.page().waitForTimeout(500);
  }

  const finalCount = await locator.count();
  if (finalCount < minimum) {
    throw new Error(`Expected at least ${minimum} thumbnails, received ${finalCount}.`);
  }
  return finalCount;
}

test.describe("entry photo gallery production upload smoke", () => {
  test.skip(process.env.GALLERY_E2E_PROD !== "1", "Set GALLERY_E2E_PROD=1 to run the production gallery smoke.");
  test.setTimeout(120000);

  test("uploads and removes one photo on the production fixture entry", async ({ page }) => {
    const context = await loginWithProdMagicLink(page);

    await page.goto(context.entryUrl);
    await expect(page.getByText("Foto's laden...")).toHaveCount(0, { timeout: 30000 });

    const thumbs = page.locator('[data-testid^="entry-photo-thumb-"]');
    const initialCount = await waitForStableThumbCount(thumbs, 1);

    const addButton = page.getByRole("button", { name: /foto toevoegen/i });
    await expect(addButton).toBeVisible({ timeout: 30000 });

    const fileChooserPromise = page.waitForEvent("filechooser");
    await addButton.click();
    await page.getByRole("button", { name: /foto's kiezen/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(UPLOAD_FIXTURE);

    await expect(page.getByText("Foto verwerken...")).toHaveCount(0, { timeout: 30000 });
    await expect(page.getByText("Foto's vernieuwen...")).toHaveCount(0, { timeout: 30000 });
    await expect(page.getByText("Foto's zijn nu niet beschikbaar")).toHaveCount(0, { timeout: 30000 });
    await expect(thumbs).toHaveCount(initialCount + 1, { timeout: 30000 });

    const newestThumb = thumbs.nth(initialCount);
    await newestThumb.click();
    await expect(page.getByLabel("Foto verwijderen")).toBeVisible({ timeout: 15000 });
    await page.getByLabel("Foto verwijderen").click();
    await expect(page.getByText("Foto verwijderen?")).toBeVisible({ timeout: 15000 });
    await page.getByText("Verwijderen").last().click();

    await expect(page.getByText("Foto verwijderen?")).toHaveCount(0, { timeout: 30000 });
    await expect(page.getByText("Foto's zijn nu niet beschikbaar")).toHaveCount(0, { timeout: 30000 });
    await expect(thumbs).toHaveCount(initialCount, { timeout: 30000 });
  });
});
