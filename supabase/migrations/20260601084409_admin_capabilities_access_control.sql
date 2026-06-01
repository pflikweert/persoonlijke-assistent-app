create table if not exists public.admin_founders (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_user_capabilities (
  user_id uuid not null references auth.users(id) on delete cascade,
  capability text not null check (capability in ('ai_quality_studio', 'regeneration', 'meeting_capture')),
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, capability)
);

create index if not exists admin_user_capabilities_user_idx
  on public.admin_user_capabilities (user_id);

create index if not exists admin_user_capabilities_capability_idx
  on public.admin_user_capabilities (capability, user_id);

alter table public.admin_founders enable row level security;
alter table public.admin_user_capabilities enable row level security;

create or replace function public.set_admin_user_capabilities_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists admin_user_capabilities_set_updated_at on public.admin_user_capabilities;
create trigger admin_user_capabilities_set_updated_at
before update on public.admin_user_capabilities
for each row
execute function public.set_admin_user_capabilities_updated_at();

create or replace function public.admin_list_users_with_capabilities()
returns table (
  user_id uuid,
  email text,
  display_name text,
  is_founder boolean,
  capabilities text[],
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  return query
  select
    users.id as user_id,
    users.email::text as email,
    coalesce(
      nullif(users.raw_user_meta_data ->> 'full_name', ''),
      nullif(users.raw_user_meta_data ->> 'name', ''),
      nullif(users.email, ''),
      users.id::text
    )::text as display_name,
    (founders.user_id is not null) as is_founder,
    coalesce(
      array_agg(capabilities.capability order by capabilities.capability)
        filter (where capabilities.capability is not null),
      array[]::text[]
    ) as capabilities,
    users.created_at,
    users.last_sign_in_at
  from auth.users as users
  left join public.admin_founders as founders
    on founders.user_id = users.id
  left join public.admin_user_capabilities as capabilities
    on capabilities.user_id = users.id
  group by users.id, users.email, users.raw_user_meta_data, users.created_at, users.last_sign_in_at, founders.user_id
  order by
    (founders.user_id is not null) desc,
    cardinality(
      coalesce(
        array_agg(capabilities.capability order by capabilities.capability)
          filter (where capabilities.capability is not null),
        array[]::text[]
      )
    ) desc,
    users.last_sign_in_at desc nulls last,
    users.created_at desc,
    users.email asc nulls last;
end;
$$;

create or replace function public.admin_replace_user_capabilities(
  p_target_user_id uuid,
  p_capabilities text[],
  p_actor_user_id uuid
)
returns table (
  capability text
)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  normalized_capabilities text[] := coalesce(
    array(
      select distinct trim(value)
      from unnest(coalesce(p_capabilities, array[]::text[])) as value
      where trim(value) <> ''
      order by trim(value)
    ),
    array[]::text[]
  );
  invalid_capabilities text[];
begin
  if p_target_user_id is null then
    raise exception 'Target user ontbreekt.';
  end if;

  if exists (
    select 1
    from public.admin_founders as founders
    where founders.user_id = p_target_user_id
  ) then
    raise exception 'Founder-rechten kunnen niet via deze route worden gewijzigd.';
  end if;

  if not exists (
    select 1
    from auth.users as users
    where users.id = p_target_user_id
  ) then
    raise exception 'Doelgebruiker bestaat niet.';
  end if;

  invalid_capabilities := array(
    select value
    from unnest(normalized_capabilities) as value
    where value not in ('ai_quality_studio', 'regeneration', 'meeting_capture')
  );

  if cardinality(invalid_capabilities) > 0 then
    raise exception 'Ongeldige admin capability.';
  end if;

  delete from public.admin_user_capabilities as capabilities
  where capabilities.user_id = p_target_user_id
    and not (capabilities.capability = any(normalized_capabilities));

  insert into public.admin_user_capabilities as capabilities (
    user_id,
    capability,
    granted_by
  )
  select
    p_target_user_id,
    capability_value,
    p_actor_user_id
  from unnest(normalized_capabilities) as capability_value
  on conflict (user_id, capability) do update
  set
    granted_by = excluded.granted_by,
    updated_at = now();

  return query
  select capabilities.capability
  from public.admin_user_capabilities as capabilities
  where capabilities.user_id = p_target_user_id
  order by capabilities.capability;
end;
$$;

grant execute on function public.admin_list_users_with_capabilities() to service_role;
grant execute on function public.admin_replace_user_capabilities(uuid, text[], uuid) to service_role;
