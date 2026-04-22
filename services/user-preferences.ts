import { getSupabaseBrowserClient } from "@/src/lib/supabase";
import type { Tables } from "@/src/lib/supabase/database.types";

import { ensureAuthenticatedUserSession } from "./auth";
import { createClientFlowId } from "./function-error";

export type UserAudioPreferences = Pick<
  Tables<"user_preferences">,
  "save_audio_recordings" | "updated_at"
>;

export type UserObsidianPreferences = Pick<
  Tables<"user_preferences">,
  "obsidian_vault_path" | "obsidian_default_note" | "updated_at"
>;

export async function fetchUserAudioPreferences(): Promise<UserAudioPreferences> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error(
      "Supabase client niet beschikbaar. Controleer je env variabelen.",
    );
  }

  const flowId = createClientFlowId("user-preferences");
  const { userId } = await ensureAuthenticatedUserSession({
    flowId,
    source: "user-preferences",
  });

  const { data, error } = await supabase
    .from("user_preferences")
    .select("save_audio_recordings, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    const { data: inserted, error: insertError } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          save_audio_recordings: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("save_audio_recordings, updated_at")
      .single();

    if (insertError || !inserted) {
      throw insertError ?? new Error("Kon voorkeuren niet initialiseren.");
    }

    return inserted;
  }

  return data;
}

export async function fetchUserObsidianPreferences(): Promise<UserObsidianPreferences> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error(
      "Supabase client niet beschikbaar. Controleer je env variabelen.",
    );
  }

  const flowId = createClientFlowId("user-preferences");
  const { userId } = await ensureAuthenticatedUserSession({
    flowId,
    source: "user-preferences",
  });

  const { data, error } = await supabase
    .from("user_preferences")
    .select("obsidian_vault_path, obsidian_default_note, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    const { data: inserted, error: insertError } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          obsidian_vault_path: null,
          obsidian_default_note: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("obsidian_vault_path, obsidian_default_note, updated_at")
      .single();

    if (insertError || !inserted) {
      throw insertError ?? new Error("Kon voorkeuren niet initialiseren.");
    }

    return inserted;
  }

  return data;
}

export async function updateUserAudioPreferences(input: {
  saveAudioRecordings: boolean;
}): Promise<UserAudioPreferences> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error(
      "Supabase client niet beschikbaar. Controleer je env variabelen.",
    );
  }

  const flowId = createClientFlowId("user-preferences");
  const { userId } = await ensureAuthenticatedUserSession({
    flowId,
    source: "user-preferences",
  });

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id: userId,
        save_audio_recordings: input.saveAudioRecordings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select("save_audio_recordings, updated_at")
    .single();

  if (error || !data) {
    throw error ?? new Error("Opslaan van voorkeuren is mislukt.");
  }

  return data;
}

export async function updateUserObsidianPreferences(input: {
  obsidianVaultPath: string | null;
  obsidianDefaultNote: string | null;
}): Promise<UserObsidianPreferences> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error(
      "Supabase client niet beschikbaar. Controleer je env variabelen.",
    );
  }

  const flowId = createClientFlowId("user-preferences");
  const { userId } = await ensureAuthenticatedUserSession({
    flowId,
    source: "user-preferences",
  });

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id: userId,
        obsidian_vault_path: input.obsidianVaultPath,
        obsidian_default_note: input.obsidianDefaultNote,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select("obsidian_vault_path, obsidian_default_note, updated_at")
    .single();

  if (error || !data) {
    throw error ?? new Error("Opslaan van voorkeuren is mislukt.");
  }

  return data;
}
