import { ensureAuthenticatedUserSession } from "@/services/auth";
import { createClientFlowId } from "@/services/function-error";
import { createEntryPhotoPhaseError } from "@/src/lib/entry-photo-gallery/flow";
import { getSupabaseBrowserClient, getSupabasePublicEnv } from "@/src/lib/supabase";
import type { Tables } from "@/src/lib/supabase/database.types";

const ENTRY_PHOTOS_BUCKET = "entry-photos";
const MAX_ENTRY_PHOTOS = 5;

type EntryPhotoRow = Pick<
  Tables<"entry_photos">,
  | "id"
  | "raw_entry_id"
  | "sort_order"
  | "display_storage_path"
  | "thumb_storage_path"
  | "display_width"
  | "display_height"
  | "thumb_width"
  | "thumb_height"
  | "display_size_bytes"
  | "thumb_size_bytes"
  | "mime_type"
  | "created_at"
>;

export type EntryPhotoAsset = {
  id: string;
  rawEntryId: string;
  sortOrder: number;
  displayPath: string;
  thumbPath: string;
  displaySource: {
    uri: string;
    headers: Record<string, string>;
  };
  thumbSource: {
    uri: string;
    headers: Record<string, string>;
  };
  displayWidth: number;
  displayHeight: number;
  thumbWidth: number;
  thumbHeight: number;
  mimeType: string;
  createdAt: string;
};

function createPhotoId(): string {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function createAuthenticatedEntryPhotoSource(input: {
  storagePath: string;
  accessToken: string;
}): {
  uri: string;
  headers: Record<string, string>;
} {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error("Supabase env ontbreekt. Controleer je env variabelen.");
  }

  const accessToken = input.accessToken.trim();
  if (!accessToken) {
    throw new Error("Je sessie is ongeldig of verlopen. Log opnieuw in.");
  }

  const safePath = input.storagePath
    .trim()
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  if (!safePath) {
    throw new Error("Fotopad ontbreekt.");
  }

  const origin = env.url.replace(/\/+$/, "");
  return {
    uri: `${origin}/storage/v1/object/authenticated/${ENTRY_PHOTOS_BUCKET}/${safePath}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: env.publishableKey,
    },
  };
}

export async function fetchEntryPhotosByRawEntryId(rawEntryId: string): Promise<EntryPhotoAsset[]> {
  const flowId = createClientFlowId("entry-photo");
  const { accessToken } = await ensureAuthenticatedUserSession({
    flowId,
    source: "entry-photos",
  });

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const normalizedRawEntryId = rawEntryId.trim();
  if (!normalizedRawEntryId) {
    return [];
  }

  const { data, error } = await supabase
    .from("entry_photos")
    .select(
      "id, raw_entry_id, sort_order, display_storage_path, thumb_storage_path, display_width, display_height, thumb_width, thumb_height, display_size_bytes, thumb_size_bytes, mime_type, created_at"
    )
    .eq("raw_entry_id", normalizedRawEntryId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as EntryPhotoRow[];
  const mapped = rows.map((row) => ({
    id: row.id,
    rawEntryId: row.raw_entry_id,
    sortOrder: row.sort_order,
    displayPath: row.display_storage_path,
    thumbPath: row.thumb_storage_path,
    displaySource: createAuthenticatedEntryPhotoSource({
      storagePath: row.display_storage_path,
      accessToken,
    }),
    thumbSource: createAuthenticatedEntryPhotoSource({
      storagePath: row.thumb_storage_path,
      accessToken,
    }),
    displayWidth: row.display_width,
    displayHeight: row.display_height,
    thumbWidth: row.thumb_width,
    thumbHeight: row.thumb_height,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  })) satisfies EntryPhotoAsset[];

  return mapped;
}

export async function uploadEntryPhotoForEntry(input: {
  rawEntryId: string;
  displayBytes: ArrayBuffer;
  thumbBytes: ArrayBuffer;
  displayWidth: number;
  displayHeight: number;
  thumbWidth: number;
  thumbHeight: number;
  displaySizeBytes: number;
  thumbSizeBytes: number;
  mimeType?: string;
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const rawEntryId = input.rawEntryId.trim();
  if (!rawEntryId) {
    throw new Error("Moment-id ontbreekt.");
  }

  const flowId = createClientFlowId("entry-photo");
  const { userId } = await ensureAuthenticatedUserSession({
    flowId,
    source: "entry-photos",
  });

  const { data: existingRows, error: existingError } = await supabase
    .from("entry_photos")
    .select("id, sort_order")
    .eq("raw_entry_id", rawEntryId)
    .order("sort_order", { ascending: true });

  if (existingError) {
    throw existingError;
  }

  const usedSortOrders = new Set((existingRows ?? []).map((row) => row.sort_order));
  if (usedSortOrders.size >= MAX_ENTRY_PHOTOS) {
    throw new Error("Je hebt al 5 foto's bij dit moment.");
  }

  const sortOrder = [0, 1, 2, 3, 4].find((order) => !usedSortOrders.has(order));
  if (typeof sortOrder !== "number") {
    throw new Error("Je hebt al 5 foto's bij dit moment.");
  }

  const photoId = createPhotoId();
  const displayStoragePath = `${userId}/${rawEntryId}/${photoId}/display.jpg`;
  const thumbStoragePath = `${userId}/${rawEntryId}/${photoId}/thumb.jpg`;

  const uploadDisplay = await supabase.storage
    .from(ENTRY_PHOTOS_BUCKET)
    .upload(displayStoragePath, input.displayBytes, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadDisplay.error) {
    throw createEntryPhotoPhaseError(
      "upload_display",
      uploadDisplay.error,
      "Displayversie uploaden mislukte."
    );
  }

  const uploadThumb = await supabase.storage
    .from(ENTRY_PHOTOS_BUCKET)
    .upload(thumbStoragePath, input.thumbBytes, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadThumb.error) {
    await supabase.storage.from(ENTRY_PHOTOS_BUCKET).remove([displayStoragePath]);
    throw createEntryPhotoPhaseError(
      "upload_thumb",
      uploadThumb.error,
      "Thumbnail uploaden mislukte."
    );
  }

  const { error: insertError } = await supabase.from("entry_photos").insert({
    user_id: userId,
    raw_entry_id: rawEntryId,
    sort_order: sortOrder,
    display_storage_path: displayStoragePath,
    thumb_storage_path: thumbStoragePath,
    display_width: Math.max(1, Math.floor(input.displayWidth)),
    display_height: Math.max(1, Math.floor(input.displayHeight)),
    thumb_width: Math.max(1, Math.floor(input.thumbWidth)),
    thumb_height: Math.max(1, Math.floor(input.thumbHeight)),
    display_size_bytes: Math.max(1, Math.floor(input.displaySizeBytes)),
    thumb_size_bytes: Math.max(1, Math.floor(input.thumbSizeBytes)),
    mime_type: (input.mimeType ?? "image/jpeg").trim() || "image/jpeg",
  });

  if (insertError) {
    await supabase.storage
      .from(ENTRY_PHOTOS_BUCKET)
      .remove([displayStoragePath, thumbStoragePath]);
    throw createEntryPhotoPhaseError(
      "upload_insert",
      insertError,
      "Foto opslaan in database mislukte."
    );
  }
}

export async function reorderEntryPhotosForEntry(input: {
  rawEntryId: string;
  orderedPhotoIds: string[];
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const rawEntryId = input.rawEntryId.trim();
  if (!rawEntryId) {
    throw new Error("Moment-id ontbreekt.");
  }

  const orderedPhotoIds = input.orderedPhotoIds
    .map((photoId) => photoId.trim())
    .filter(Boolean);

  if (orderedPhotoIds.length < 1 || orderedPhotoIds.length > MAX_ENTRY_PHOTOS) {
    throw new Error("De fotovolgorde is ongeldig.");
  }

  if (new Set(orderedPhotoIds).size !== orderedPhotoIds.length) {
    throw new Error("De fotovolgorde bevat dubbelen.");
  }

  const flowId = createClientFlowId("entry-photo");
  await ensureAuthenticatedUserSession({
    flowId,
    source: "entry-photos",
  });

  const { error } = await (supabase as any).rpc("reorder_entry_photos", {
    input_raw_entry_id: rawEntryId,
    input_photo_ids: orderedPhotoIds,
  });

  if (error) {
    throw createEntryPhotoPhaseError(
      "reorder_persist",
      error,
      "Nieuwe volgorde opslaan mislukte."
    );
  }
}

export async function deleteEntryPhotoById(photoId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase client niet beschikbaar. Controleer je env variabelen.");
  }

  const id = photoId.trim();
  if (!id) {
    throw new Error("Foto-id ontbreekt.");
  }

  const flowId = createClientFlowId("entry-photo");
  await ensureAuthenticatedUserSession({
    flowId,
    source: "entry-photos",
  });

  const { data: row, error: selectError } = await supabase
    .from("entry_photos")
    .select("display_storage_path, thumb_storage_path")
    .eq("id", id)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (!row) {
    return;
  }

  const { error: deleteError } = await supabase.from("entry_photos").delete().eq("id", id);
  if (deleteError) {
    throw deleteError;
  }

  await supabase
    .storage
    .from(ENTRY_PHOTOS_BUCKET)
    .remove([row.display_storage_path, row.thumb_storage_path]);
}
