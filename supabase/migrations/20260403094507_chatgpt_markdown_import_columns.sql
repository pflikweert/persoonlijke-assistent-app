alter table public.entries_raw
  add column if not exists import_source_type text,
  add column if not exists import_source_ref text,
  add column if not exists import_file_name text,
  add column if not exists import_external_message_id text;

create index if not exists entries_raw_import_source_idx
  on public.entries_raw (user_id, import_source_type, import_source_ref, captured_at desc);
