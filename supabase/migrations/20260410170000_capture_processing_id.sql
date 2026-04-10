alter table public.entries_raw
  add column if not exists client_processing_id text;

create unique index if not exists entries_raw_user_client_processing_id_key
  on public.entries_raw (user_id, client_processing_id)
  where client_processing_id is not null;
