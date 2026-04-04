alter table public.period_reflections
  add column if not exists narrative_text text not null default '';
