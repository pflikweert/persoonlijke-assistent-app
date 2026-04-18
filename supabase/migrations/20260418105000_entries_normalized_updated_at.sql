alter table public.entries_normalized
  add column if not exists updated_at timestamptz not null default now();

update public.entries_normalized
set updated_at = created_at
where updated_at is null;
