create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_audio_recordings boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

drop policy if exists "user_preferences_user_owns_rows" on public.user_preferences;
create policy "user_preferences_user_owns_rows"
  on public.user_preferences
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.entries_raw
  add column if not exists audio_storage_path text,
  add column if not exists audio_mime_type text,
  add column if not exists audio_size_bytes integer,
  add column if not exists audio_duration_ms integer,
  add column if not exists audio_saved_at timestamptz;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'entry-audio',
  'entry-audio',
  false,
  5242880,
  array['audio/webm', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/mp4', 'audio/mpeg', 'audio/mp3', 'audio/ogg']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "entry_audio_owner_select" on storage.objects;
create policy "entry_audio_owner_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'entry-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "entry_audio_owner_insert" on storage.objects;
create policy "entry_audio_owner_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'entry-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "entry_audio_owner_update" on storage.objects;
create policy "entry_audio_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'entry-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'entry-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "entry_audio_owner_delete" on storage.objects;
create policy "entry_audio_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'entry-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
