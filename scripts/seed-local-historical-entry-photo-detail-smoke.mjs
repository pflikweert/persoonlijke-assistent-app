#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";
import {
  assertLocalTarget,
  resolveLocalAuthSmokeContext,
  resolveSmokeEmail,
} from "./_shared/local-auth-smoke-utils.mjs";

const FIXTURE_SOURCE_TYPE = "local-historical-photo-detail-smoke";
const FIXTURE_SOURCE_REF = "historical-entry-detail";
const HISTORICAL_JOURNAL_DATE = "2026-05-13";
const HISTORICAL_CAPTURED_AT = "2026-05-14T14:42:00.000Z";
const FIXTURE_TITLE = "Historische foto-state smoke fixture";
const FIXTURE_BODY =
  "Dit moment is later toegevoegd aan een oudere dag en heeft fixture-foto's voor runtime-validatie van de detailpagina.";
const FIXTURE_SUMMARY = "Historical photo detail smoke fixture.";
const FIXTURE_ASSETS = [
  "assets/images/icon.png",
  "assets/images/favicon.png",
  "assets/images/partial-react-logo.png",
];

function getRootDir(context) {
  return context.rootDir;
}

function resolveFixtureAssetPath(context, relativePath) {
  return path.join(getRootDir(context), relativePath);
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${init?.method ?? "GET"} ${url} failed (${response.status}): ${body}`);
  }
  return response.json();
}

async function findOrCreateSmokeUser(context, email) {
  const headers = {
    apikey: context.serviceRoleKey,
    Authorization: `Bearer ${context.serviceRoleKey}`,
    "Content-Type": "application/json",
  };
  const users = await fetchJson(`${context.apiUrl}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers,
  });
  const existing = (Array.isArray(users?.users) ? users.users : []).find(
    (user) => String(user?.email || "").toLowerCase() === email.toLowerCase()
  );
  if (existing?.id) {
    return String(existing.id);
  }

  const created = await fetchJson(`${context.apiUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      email_confirm: true,
      user_metadata: {
        smoke_fixture: FIXTURE_SOURCE_TYPE,
      },
    }),
  });
  if (!created?.id) {
    throw new Error(`Could not create local smoke user ${email}.`);
  }
  return String(created.id);
}

async function cleanupFixtureRows(supabase, userId) {
  const { data: oldPhotos, error: photoSelectError } = await supabase
    .from("entry_photos")
    .select("display_storage_path, thumb_storage_path, entries_raw!inner(import_source_type, import_source_ref)")
    .eq("user_id", userId)
    .eq("entries_raw.import_source_type", FIXTURE_SOURCE_TYPE)
    .eq("entries_raw.import_source_ref", FIXTURE_SOURCE_REF);

  if (photoSelectError) {
    throw photoSelectError;
  }

  const oldPaths = (oldPhotos ?? [])
    .flatMap((photo) => [photo.display_storage_path, photo.thumb_storage_path])
    .filter(Boolean);

  if (oldPaths.length > 0) {
    await supabase.storage.from("entry-photos").remove(oldPaths);
  }

  const { error } = await supabase
    .from("entries_raw")
    .delete()
    .eq("user_id", userId)
    .eq("import_source_type", FIXTURE_SOURCE_TYPE)
    .eq("import_source_ref", FIXTURE_SOURCE_REF);

  if (error) {
    throw error;
  }
}

function convertAssetToJpegTemp(context, relativeAssetPath, index) {
  const sourcePath = resolveFixtureAssetPath(context, relativeAssetPath);
  const outputPath = path.join(
    os.tmpdir(),
    `budio-historical-photo-detail-${process.pid}-${index}.jpg`
  );

  execFileSync("sips", ["-s", "format", "jpeg", sourcePath, "--out", outputPath], {
    stdio: "ignore",
  });

  const metadata = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", outputPath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });

  const widthMatch = metadata.match(/pixelWidth:\s+(\d+)/);
  const heightMatch = metadata.match(/pixelHeight:\s+(\d+)/);
  if (!widthMatch || !heightMatch) {
    throw new Error(`Kon JPEG-dimensies niet bepalen voor ${relativeAssetPath}.`);
  }

  return {
    sourcePath,
    outputPath,
    width: Number(widthMatch[1]),
    height: Number(heightMatch[1]),
  };
}

async function uploadPhotoObject(supabase, bytes, storagePath) {
  const { error } = await supabase.storage
    .from("entry-photos")
    .upload(storagePath, bytes, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return bytes;
}

async function seedHistoricalFixture({ context, email }) {
  assertLocalTarget(context);
  if (!context.serviceRoleKey) {
    throw new Error("Missing APP_SUPABASE_SERVICE_ROLE_KEY required for local historical photo seed.");
  }

  const userId = await findOrCreateSmokeUser(context, email);
  const supabase = createClient(context.apiUrl, context.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  await cleanupFixtureRows(supabase, userId);

  const { data: rawEntry, error: rawError } = await supabase
    .from("entries_raw")
    .insert({
      user_id: userId,
      source_type: "text",
      raw_text: FIXTURE_BODY,
      captured_at: HISTORICAL_CAPTURED_AT,
      journal_date: HISTORICAL_JOURNAL_DATE,
      import_source_type: FIXTURE_SOURCE_TYPE,
      import_source_ref: FIXTURE_SOURCE_REF,
      import_file_name: "historical-entry-photo-detail-smoke",
    })
    .select("id")
    .single();

  if (rawError) {
    throw rawError;
  }

  const { data: normalizedEntry, error: normalizedError } = await supabase
    .from("entries_normalized")
    .insert({
      user_id: userId,
      raw_entry_id: rawEntry.id,
      title: FIXTURE_TITLE,
      body: FIXTURE_BODY,
      summary_short: FIXTURE_SUMMARY,
      generation_meta: {
        source: FIXTURE_SOURCE_TYPE,
      },
    })
    .select("id")
    .single();

  if (normalizedError) {
    throw normalizedError;
  }

  const photoIds = [];
  for (let index = 0; index < FIXTURE_ASSETS.length; index += 1) {
    const relativeAssetPath = FIXTURE_ASSETS[index];
    const photoId = crypto.randomUUID();
    const displayPath = `${userId}/${rawEntry.id}/${photoId}/display.jpg`;
    const thumbPath = `${userId}/${rawEntry.id}/${photoId}/thumb.jpg`;

    const prepared = convertAssetToJpegTemp(context, relativeAssetPath, index);
    const displayBytes = await fs.readFile(prepared.outputPath);
    const thumbBytes = await fs.readFile(prepared.outputPath);

    try {
      await uploadPhotoObject(supabase, displayBytes, displayPath);
      await uploadPhotoObject(supabase, thumbBytes, thumbPath);
    } finally {
      await fs.rm(prepared.outputPath, { force: true });
    }

    const { error: photoError } = await supabase.from("entry_photos").insert({
      id: photoId,
      user_id: userId,
      raw_entry_id: rawEntry.id,
      sort_order: index,
      display_storage_path: displayPath,
      thumb_storage_path: thumbPath,
      display_width: prepared.width,
      display_height: prepared.height,
      thumb_width: prepared.width,
      thumb_height: prepared.height,
      display_size_bytes: displayBytes.byteLength,
      thumb_size_bytes: thumbBytes.byteLength,
      mime_type: "image/jpeg",
    });

    if (photoError) {
      throw photoError;
    }
    photoIds.push(photoId);
  }

  const baseUrl = context.appUrl.replace(/\/+$/, "");
  return {
    userId,
    email,
    entryId: normalizedEntry.id,
    rawEntryId: rawEntry.id,
    entryUrl: `${baseUrl}/entry/${normalizedEntry.id}?source=day&date=${HISTORICAL_JOURNAL_DATE}`,
    journalDate: HISTORICAL_JOURNAL_DATE,
    photoIds,
  };
}

async function main() {
  const context = resolveLocalAuthSmokeContext();
  const email = process.env.SMOKE_TEST_EMAIL || resolveSmokeEmail(process.env.SMOKE_TEST_EMAIL_PROFILE);
  const cleanupOnly = process.argv.includes("--cleanup");

  assertLocalTarget(context);
  if (!context.serviceRoleKey) {
    throw new Error("Missing APP_SUPABASE_SERVICE_ROLE_KEY required for local historical photo seed.");
  }

  const userId = await findOrCreateSmokeUser(context, email);
  const supabase = createClient(context.apiUrl, context.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  if (cleanupOnly) {
    await cleanupFixtureRows(supabase, userId);
    console.log(`PASS historical-photo-detail-cleanup email=${email}`);
    return;
  }

  const result = await seedHistoricalFixture({ context, email });
  console.log("PASS historical-photo-detail-seed");
  console.log(`SMOKE_TEST_EMAIL=${result.email}`);
  console.log(`HISTORICAL_PHOTO_DETAIL_ENTRY_URL=${result.entryUrl}`);
  console.log(`HISTORICAL_PHOTO_DETAIL_ENTRY_ID=${result.entryId}`);
  console.log(`HISTORICAL_PHOTO_DETAIL_RAW_ENTRY_ID=${result.rawEntryId}`);
  console.log(`HISTORICAL_PHOTO_DETAIL_PHOTO_IDS=${result.photoIds.join(",")}`);
}

main().catch((error) => {
  console.error(
    "FAIL historical-photo-detail-seed:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
