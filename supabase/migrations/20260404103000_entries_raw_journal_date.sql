alter table public.entries_raw
  add column if not exists journal_date date;

create index if not exists entries_raw_user_journal_date_captured_at_idx
  on public.entries_raw (user_id, journal_date, captured_at desc);
