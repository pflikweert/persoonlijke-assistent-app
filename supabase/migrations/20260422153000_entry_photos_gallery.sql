create table if not exists public.entry_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  raw_entry_id uuid not null references public.entries_raw(id) on delete cascade,
  sort_order smallint not null check (sort_order between 0 and 4),
  display_storage_path text not null,
  thumb_storage_path text not null,
  display_width integer not null check (display_width > 0),
  display_height integer not null check (display_height > 0),
  thumb_width integer not null check (thumb_width > 0),
  thumb_height integer not null check (thumb_height > 0),
  display_size_bytes integer not null check (display_size_bytes > 0),
  thumb_size_bytes integer not null check (thumb_size_bytes > 0),
  mime_type text not null default 'image/jpeg',
  created_at timestamptz not null default now(),
  unique (raw_entry_id, sort_order)
);

create index if not exists entry_photos_user_raw_sort_idx
  on public.entry_photos (user_id, raw_entry_id, sort_order, created_at);

alter table public.entry_photos enable row level security;

drop policy if exists "entry_photos_user_owns_rows" on public.entry_photos;
create policy "entry_photos_user_owns_rows"
  on public.entry_photos
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function private.enforce_entry_photos_owner_match()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
begin
  if not exists (
    select 1
    from public.entries_raw as entry
    where entry.id = new.raw_entry_id
      and entry.user_id = new.user_id
  ) then
    raise exception 'raw entry does not belong to user';
  end if;

  return new;
end;
$$;

create or replace function private.enforce_entry_photo_limit()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  existing_count integer;
begin
  select count(*)
  into existing_count
  from public.entry_photos
  where raw_entry_id = new.raw_entry_id
    and user_id = new.user_id
    and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

  if existing_count >= 5 then
    raise exception 'max 5 photos per entry';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_entry_photos_owner_match on public.entry_photos;
create trigger trg_entry_photos_owner_match
before insert or update on public.entry_photos
for each row
execute function private.enforce_entry_photos_owner_match();

drop trigger if exists trg_entry_photo_limit on public.entry_photos;
create trigger trg_entry_photo_limit
before insert or update on public.entry_photos
for each row
execute function private.enforce_entry_photo_limit();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'entry-photos',
  'entry-photos',
  false,
  4194304,
  array['image/jpeg']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "entry_photos_owner_select" on storage.objects;
create policy "entry_photos_owner_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'entry-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "entry_photos_owner_insert" on storage.objects;
create policy "entry_photos_owner_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'entry-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "entry_photos_owner_update" on storage.objects;
create policy "entry_photos_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'entry-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'entry-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "entry_photos_owner_delete" on storage.objects;
create policy "entry_photos_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'entry-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );