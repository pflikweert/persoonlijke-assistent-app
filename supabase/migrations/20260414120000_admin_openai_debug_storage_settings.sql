create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to service_role;

create table if not exists private.openai_debug_storage_settings (
  id smallint primary key default 1 check (id = 1),
  master_enabled boolean not null default false,
  master_expires_at timestamptz,
  flow_overrides_json jsonb not null default '{}'::jsonb,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

create or replace function private.set_openai_debug_storage_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_openai_debug_storage_settings_updated_at on private.openai_debug_storage_settings;
create trigger trg_openai_debug_storage_settings_updated_at
before update on private.openai_debug_storage_settings
for each row execute function private.set_openai_debug_storage_settings_updated_at();

grant select, insert, update on private.openai_debug_storage_settings to service_role;

insert into private.openai_debug_storage_settings (id, master_enabled, master_expires_at, flow_overrides_json)
values (1, false, null, '{}'::jsonb)
on conflict (id) do nothing;