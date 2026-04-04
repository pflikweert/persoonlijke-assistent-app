alter table public.entries_normalized
  add column if not exists generation_meta jsonb not null default '{}'::jsonb;

alter table public.day_journals
  add column if not exists generation_meta jsonb not null default '{}'::jsonb;

alter table public.period_reflections
  add column if not exists generation_meta jsonb not null default '{}'::jsonb;

create table if not exists public.admin_regeneration_jobs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  selected_types jsonb not null default '[]'::jsonb,
  options jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create index if not exists admin_regeneration_jobs_created_by_idx
  on public.admin_regeneration_jobs (created_by, created_at desc);

create table if not exists public.admin_regeneration_job_steps (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.admin_regeneration_jobs(id) on delete cascade,
  step_type text not null check (step_type in ('entries_normalized', 'day_journals', 'week_reflections', 'month_reflections')),
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  phase text not null default 'pending',
  total integer not null default 0,
  queued integer not null default 0,
  openai_completed integer not null default 0,
  applied integer not null default 0,
  failed integer not null default 0,
  cursor integer not null default 0,
  candidate_keys jsonb not null default '[]'::jsonb,
  last_update_at timestamptz not null default now(),
  unique (job_id, step_type)
);

create index if not exists admin_regeneration_job_steps_job_idx
  on public.admin_regeneration_job_steps (job_id, step_type);

create table if not exists public.admin_regeneration_step_batches (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.admin_regeneration_jobs(id) on delete cascade,
  step_id uuid not null references public.admin_regeneration_job_steps(id) on delete cascade,
  status text not null default 'submitted' check (status in ('submitted', 'validating', 'in_progress', 'finalizing', 'completed', 'failed', 'expired', 'cancelled')),
  openai_batch_id text not null,
  input_file_id text,
  output_file_id text,
  error_file_id text,
  request_count integer not null default 0,
  prompt_tokens_est integer not null default 0,
  attempt integer not null default 0,
  retry_of uuid references public.admin_regeneration_step_batches(id) on delete set null,
  requests_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (openai_batch_id)
);

create index if not exists admin_regeneration_step_batches_step_idx
  on public.admin_regeneration_step_batches (step_id, created_at desc);

create index if not exists admin_regeneration_step_batches_job_idx
  on public.admin_regeneration_step_batches (job_id, created_at desc);

alter table public.admin_regeneration_jobs enable row level security;
alter table public.admin_regeneration_job_steps enable row level security;
alter table public.admin_regeneration_step_batches enable row level security;

create policy "admin_regeneration_jobs_owner_select"
  on public.admin_regeneration_jobs
  for select
  using (auth.uid() = created_by);

create policy "admin_regeneration_jobs_owner_update"
  on public.admin_regeneration_jobs
  for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "admin_regeneration_job_steps_owner_select"
  on public.admin_regeneration_job_steps
  for select
  using (
    exists (
      select 1
      from public.admin_regeneration_jobs jobs
      where jobs.id = admin_regeneration_job_steps.job_id
        and jobs.created_by = auth.uid()
    )
  );

create policy "admin_regeneration_step_batches_owner_select"
  on public.admin_regeneration_step_batches
  for select
  using (
    exists (
      select 1
      from public.admin_regeneration_jobs jobs
      where jobs.id = admin_regeneration_step_batches.job_id
        and jobs.created_by = auth.uid()
    )
  );
