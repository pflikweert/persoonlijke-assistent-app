alter table public.user_background_tasks
  drop constraint if exists user_background_tasks_task_type_check;

alter table public.user_background_tasks
  add constraint user_background_tasks_task_type_check
  check (task_type in ('import_refresh', 'archive_export'));

alter table public.user_background_tasks
  add column if not exists input_payload jsonb not null default '{}'::jsonb,
  add column if not exists result_payload jsonb,
  add column if not exists result_storage_path text,
  add column if not exists result_file_name text,
  add column if not exists result_mime_type text,
  add column if not exists result_size_bytes bigint,
  add column if not exists download_expires_at timestamptz;

insert into storage.buckets (id, name, public)
values ('user-exports', 'user-exports', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "user_exports_owner_select" on storage.objects;
create policy "user_exports_owner_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'user-exports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "user_exports_owner_insert" on storage.objects;
create policy "user_exports_owner_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'user-exports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "user_exports_owner_update" on storage.objects;
create policy "user_exports_owner_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'user-exports'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'user-exports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "user_exports_owner_delete" on storage.objects;
create policy "user_exports_owner_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'user-exports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );