create table if not exists public.period_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_type text not null check (period_type in ('week', 'month')),
  period_start date not null,
  period_end date not null,
  summary_text text not null default '',
  highlights_json jsonb not null default '[]'::jsonb,
  reflection_points_json jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  model_version text not null default '',
  unique (user_id, period_type, period_start, period_end)
);

create index if not exists period_reflections_user_period_idx
  on public.period_reflections (user_id, period_type, period_start desc);

alter table public.period_reflections enable row level security;

create policy "period_reflections_user_owns_rows"
  on public.period_reflections
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
