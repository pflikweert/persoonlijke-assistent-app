create or replace function public.reorder_entry_photos(
  input_raw_entry_id uuid,
  input_photo_ids uuid[]
)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
declare
  caller_user_id uuid;
  existing_count integer;
  supplied_count integer;
  distinct_count integer;
begin
  caller_user_id := auth.uid();

  if caller_user_id is null then
    raise exception 'authentication required';
  end if;

  if input_raw_entry_id is null then
    raise exception 'raw entry id ontbreekt';
  end if;

  supplied_count := coalesce(array_length(input_photo_ids, 1), 0);
  if supplied_count < 1 or supplied_count > 5 then
    raise exception 'ongeldige fotovolgorde';
  end if;

  select count(distinct photo_id)
  into distinct_count
  from unnest(input_photo_ids) as photo_id;

  if distinct_count <> supplied_count then
    raise exception 'fotovolgorde bevat dubbelen';
  end if;

  select count(*)
  into existing_count
  from public.entry_photos
  where raw_entry_id = input_raw_entry_id
    and user_id = caller_user_id;

  if existing_count <> supplied_count then
    raise exception 'fotovolgorde komt niet overeen met bestaande fotos';
  end if;

  if exists (
    select 1
    from unnest(input_photo_ids) as ordered(photo_id)
    left join public.entry_photos as photo
      on photo.id = ordered.photo_id
     and photo.raw_entry_id = input_raw_entry_id
     and photo.user_id = caller_user_id
    where photo.id is null
  ) then
    raise exception 'fotovolgorde bevat onbekende fotos';
  end if;

  update public.entry_photos as target
  set sort_order = target.sort_order + 10
  where target.raw_entry_id = input_raw_entry_id
    and target.user_id = caller_user_id
    and target.id = any(input_photo_ids);

  update public.entry_photos as target
  set sort_order = ordered.ordinality - 1
  from unnest(input_photo_ids) with ordinality as ordered(photo_id, ordinality)
  where target.id = ordered.photo_id
    and target.raw_entry_id = input_raw_entry_id
    and target.user_id = caller_user_id;
end;
$$;

grant execute on function public.reorder_entry_photos(uuid, uuid[]) to authenticated;
