create table if not exists public.entries_raw (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('text', 'audio')),
  raw_text text,
  transcript_text text,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists entries_raw_user_id_captured_at_idx
  on public.entries_raw (user_id, captured_at desc);

alter table public.entries_raw enable row level security;

create policy "entries_raw_user_owns_rows"
  on public.entries_raw
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.entries_normalized (
  id uuid primary key default gen_random_uuid(),
  raw_entry_id uuid not null references public.entries_raw(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  unique (raw_entry_id)
);

create index if not exists entries_normalized_user_id_created_at_idx
  on public.entries_normalized (user_id, created_at desc);

alter table public.entries_normalized enable row level security;

create policy "entries_normalized_user_owns_rows"
  on public.entries_normalized
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.day_journals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journal_date date not null,
  summary text not null default '',
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, journal_date)
);

create index if not exists day_journals_user_id_journal_date_idx
  on public.day_journals (user_id, journal_date desc);

alter table public.day_journals enable row level security;

create policy "day_journals_user_owns_rows"
  on public.day_journals
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
