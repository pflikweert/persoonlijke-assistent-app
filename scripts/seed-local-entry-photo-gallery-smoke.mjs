#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import {
  assertLocalTarget,
  resolveLocalAuthSmokeContext,
  resolveSmokeEmail,
} from "./_shared/local-auth-smoke-utils.mjs";

const FIXTURE_SOURCE_TYPE = "local-gallery-smoke";
const FIXTURE_SOURCE_REF = "entry-photo-gallery";
const JPEG_1X1 = Buffer.from(
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL/2wCEAQICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/Aaf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/Aaf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Aqf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IX//2gAMAwEAAgADAAAAEP/EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EFBABAQAAAAAAAAAAAAAAAAAAARD/2gAIAQEAAT8QH//Z",
  "base64"
);

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

  const oldPaths = (oldPhotos ?? []).flatMap((photo) => [
    photo.display_storage_path,
    photo.thumb_storage_path,
  ]).filter(Boolean);

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

async function uploadPhotoObject(supabase, path) {
  const { error } = await supabase.storage
    .from("entry-photos")
    .upload(path, JPEG_1X1, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    throw error;
  }
}

async function seedGalleryFixture({ context, email }) {
  assertLocalTarget(context);
  if (!context.serviceRoleKey) {
    throw new Error("Missing APP_SUPABASE_SERVICE_ROLE_KEY required for local gallery smoke seed.");
  }

  const userId = await findOrCreateSmokeUser(context, email);
  const supabase = createClient(context.apiUrl, context.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  await cleanupFixtureRows(supabase, userId);

  const capturedAt = new Date().toISOString();
  const journalDate = capturedAt.slice(0, 10);
  const { data: rawEntry, error: rawError } = await supabase
    .from("entries_raw")
    .insert({
      user_id: userId,
      source_type: "text",
      raw_text: "Gallery smoke fixture",
      captured_at: capturedAt,
      journal_date: journalDate,
      import_source_type: FIXTURE_SOURCE_TYPE,
      import_source_ref: FIXTURE_SOURCE_REF,
      import_file_name: "entry-photo-gallery-smoke",
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
      title: "Gallery smoke fixture",
      body: "Een lokaal testmoment voor de entry photo gallery.",
      summary_short: "Gallery smoke fixture.",
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
  for (let index = 0; index < 3; index += 1) {
    const photoId = crypto.randomUUID();
    const displayPath = `${userId}/${rawEntry.id}/${photoId}/display.jpg`;
    const thumbPath = `${userId}/${rawEntry.id}/${photoId}/thumb.jpg`;

    await uploadPhotoObject(supabase, displayPath);
    await uploadPhotoObject(supabase, thumbPath);

    const { error: photoError } = await supabase.from("entry_photos").insert({
      id: photoId,
      user_id: userId,
      raw_entry_id: rawEntry.id,
      sort_order: index,
      display_storage_path: displayPath,
      thumb_storage_path: thumbPath,
      display_width: 1,
      display_height: 1,
      thumb_width: 1,
      thumb_height: 1,
      display_size_bytes: JPEG_1X1.byteLength,
      thumb_size_bytes: JPEG_1X1.byteLength,
      mime_type: "image/jpeg",
    });

    if (photoError) {
      throw photoError;
    }
    photoIds.push(photoId);
  }

  return {
    userId,
    email,
    entryUrl: `${context.appUrl.replace(/\/+$/, "")}/entry/${normalizedEntry.id}`,
    photoIds,
  };
}

async function main() {
  const context = resolveLocalAuthSmokeContext();
  const email = process.env.SMOKE_TEST_EMAIL || resolveSmokeEmail(process.env.SMOKE_TEST_EMAIL_PROFILE);
  const cleanupOnly = process.argv.includes("--cleanup");

  assertLocalTarget(context);
  if (!context.serviceRoleKey) {
    throw new Error("Missing APP_SUPABASE_SERVICE_ROLE_KEY required for local gallery smoke seed.");
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
    console.log(`PASS gallery-smoke-cleanup email=${email}`);
    return;
  }

  const result = await seedGalleryFixture({ context, email });
  console.log("PASS gallery-smoke-seed");
  console.log(`SMOKE_TEST_EMAIL=${result.email}`);
  console.log(`GALLERY_E2E_ENTRY_URL=${result.entryUrl}`);
  console.log(`GALLERY_E2E_PHOTO_IDS=${result.photoIds.join(",")}`);
}

main().catch((error) => {
  console.error("FAIL gallery-smoke-seed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
