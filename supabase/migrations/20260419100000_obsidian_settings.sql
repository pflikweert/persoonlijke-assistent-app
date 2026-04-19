-- Add Obsidian settings to user_preferences
alter table public.user_preferences
  add column if not exists obsidian_vault_path text,
  add column if not exists obsidian_default_note text;