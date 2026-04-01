alter table public.day_journals
  add column if not exists narrative_text text not null default '';
