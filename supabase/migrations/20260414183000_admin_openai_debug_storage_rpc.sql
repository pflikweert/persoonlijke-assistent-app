create or replace function public.admin_get_openai_debug_storage_settings()
returns table (
  id smallint,
  master_enabled boolean,
  master_expires_at timestamptz,
  flow_overrides_json jsonb,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, private, extensions
as $$
begin
  insert into private.openai_debug_storage_settings (id)
  values (1)
  on conflict (id) do nothing;

  return query
  select
    settings.id,
    settings.master_enabled,
    settings.master_expires_at,
    settings.flow_overrides_json,
    settings.updated_at
  from private.openai_debug_storage_settings as settings
  where settings.id = 1;
end;
$$;

create or replace function public.admin_upsert_openai_debug_storage_settings(
  p_master_enabled boolean,
  p_master_expires_at timestamptz,
  p_flow_overrides_json jsonb,
  p_updated_by uuid
)
returns table (
  id smallint,
  master_enabled boolean,
  master_expires_at timestamptz,
  flow_overrides_json jsonb,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, private, extensions
as $$
begin
  insert into private.openai_debug_storage_settings as settings (
    id,
    master_enabled,
    master_expires_at,
    flow_overrides_json,
    updated_by
  )
  values (
    1,
    coalesce(p_master_enabled, false),
    p_master_expires_at,
    coalesce(p_flow_overrides_json, '{}'::jsonb),
    p_updated_by
  )
  on conflict (id) do update
  set
    master_enabled = excluded.master_enabled,
    master_expires_at = excluded.master_expires_at,
    flow_overrides_json = excluded.flow_overrides_json,
    updated_by = excluded.updated_by;

  return query
  select
    settings.id,
    settings.master_enabled,
    settings.master_expires_at,
    settings.flow_overrides_json,
    settings.updated_at
  from private.openai_debug_storage_settings as settings
  where settings.id = 1;
end;
$$;

grant execute on function public.admin_get_openai_debug_storage_settings() to service_role;
grant execute on function public.admin_upsert_openai_debug_storage_settings(boolean, timestamptz, jsonb, uuid) to service_role;