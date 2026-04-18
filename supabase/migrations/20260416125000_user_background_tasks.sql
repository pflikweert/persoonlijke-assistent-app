create table if not exists public.user_background_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_type text not null,
  source_ref text,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  phase text not null default 'queued',
  progress_current integer not null default 0,
  progress_total integer not null default 0,
  detail_current integer,
  detail_total integer,
  detail_label text,
  payload jsonb not null default '{}'::jsonb,
  warning_count integer not null default 0,
  error_message text,
  notice_seen_at timestamptz,
  notice_dismissed_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_update_at timestamptz not null default now(),
  check (task_type in ('import_refresh'))
);

create index if not exists user_background_tasks_user_created_idx
  on public.user_background_tasks (user_id, created_at desc);

create index if not exists user_background_tasks_user_status_idx
  on public.user_background_tasks (user_id, status, created_at desc);

alter table public.user_background_tasks enable row level security;

create policy "user_background_tasks_user_owns_rows"
  on public.user_background_tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);