-- Fix: Function Search Path Mutable security issue
-- Recreate set_openai_debug_storage_settings_updated_at() with explicit search_path

create or replace function private.set_openai_debug_storage_settings_updated_at()
returns trigger
language plpgsql
stable
set search_path = private
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
