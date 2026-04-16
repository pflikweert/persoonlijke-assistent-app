-- Fix: Function Search Path Mutable security issue
-- Recreate ai_quality_studio_set_updated_at() with explicit search_path for security

create or replace function public.ai_quality_studio_set_updated_at()
returns trigger
language plpgsql
stable
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
