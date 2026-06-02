create or replace function public.admin_replace_user_capabilities(
  p_target_user_id uuid,
  p_capabilities text[],
  p_actor_user_id uuid
)
returns table (
  granted_capability text
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
  on conflict on constraint admin_user_capabilities_pkey do update
  set
    granted_by = excluded.granted_by,
    updated_at = now();

  return query
  select capabilities.capability as granted_capability
  from public.admin_user_capabilities as capabilities
  where capabilities.user_id = p_target_user_id
  order by capabilities.capability;
end;
$$;

grant execute on function public.admin_replace_user_capabilities(uuid, text[], uuid) to service_role;
