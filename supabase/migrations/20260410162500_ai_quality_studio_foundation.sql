do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'ai_task_input_type' and n.nspname = 'public'
  ) then
    create type public.ai_task_input_type as enum ('entry', 'day', 'week', 'month');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'ai_task_output_type' and n.nspname = 'public'
  ) then
    create type public.ai_task_output_type as enum ('text', 'json', 'text_list');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'ai_task_version_status' and n.nspname = 'public'
  ) then
    create type public.ai_task_version_status as enum ('draft', 'testing', 'live', 'archived');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'ai_test_case_source_type' and n.nspname = 'public'
  ) then
    create type public.ai_test_case_source_type as enum ('entry', 'day', 'week', 'month');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'ai_test_run_status' and n.nspname = 'public'
  ) then
    create type public.ai_test_run_status as enum ('queued', 'completed', 'failed');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'ai_review_label' and n.nspname = 'public'
  ) then
    create type public.ai_review_label as enum ('better', 'equal', 'worse', 'fail');
  end if;
end
$$;

create table if not exists public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  input_type public.ai_task_input_type not null,
  output_type public.ai_task_output_type not null default 'text',
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_task_versions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.ai_tasks(id) on delete cascade,
  version_number integer not null,
  status public.ai_task_version_status not null default 'draft',
  model text not null,
  prompt_template text not null,
  system_instructions text not null default '',
  output_schema_json jsonb not null default '{}'::jsonb,
  config_json jsonb not null default '{}'::jsonb,
  min_items integer,
  max_items integer,
  changelog text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  became_live_at timestamptz,
  locked_at timestamptz,
  constraint ai_task_versions_unique_task_version unique (task_id, version_number),
  constraint ai_task_versions_min_max_check check (max_items is null or min_items is null or max_items >= min_items)
);

create table if not exists public.ai_test_cases (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.ai_tasks(id) on delete cascade,
  source_type public.ai_test_case_source_type not null,
  source_record_id uuid not null,
  label text not null,
  is_golden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_test_runs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.ai_tasks(id) on delete cascade,
  task_version_id uuid not null references public.ai_task_versions(id) on delete restrict,
  test_case_id uuid not null references public.ai_test_cases(id) on delete restrict,
  status public.ai_test_run_status not null default 'queued',
  input_snapshot_json jsonb not null default '{}'::jsonb,
  prompt_snapshot text not null,
  system_instructions_snapshot text not null default '',
  output_schema_snapshot_json jsonb not null default '{}'::jsonb,
  config_snapshot_json jsonb not null default '{}'::jsonb,
  model_snapshot text not null,
  output_text text,
  output_json jsonb,
  reviewer_label public.ai_review_label,
  reviewer_notes text,
  latency_ms integer,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint ai_test_runs_fail_requires_notes
    check (reviewer_label is distinct from 'fail'::public.ai_review_label or coalesce(length(trim(reviewer_notes)), 0) > 0)
);

create table if not exists public.ai_live_generation_log (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.ai_tasks(id) on delete restrict,
  task_version_id uuid not null references public.ai_task_versions(id) on delete restrict,
  source_type public.ai_test_case_source_type not null,
  source_record_id uuid not null,
  target_table text not null,
  target_record_id uuid not null,
  model text not null,
  request_id text not null,
  flow_id text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_tasks_created_at_idx on public.ai_tasks (created_at desc);

create index if not exists ai_task_versions_task_id_idx on public.ai_task_versions (task_id);
create index if not exists ai_task_versions_status_idx on public.ai_task_versions (status);
create index if not exists ai_task_versions_created_at_idx on public.ai_task_versions (created_at desc);
create unique index if not exists ai_task_versions_live_task_unique_idx
  on public.ai_task_versions (task_id)
  where status = 'live';

create index if not exists ai_test_cases_task_id_idx on public.ai_test_cases (task_id);
create index if not exists ai_test_cases_source_idx on public.ai_test_cases (source_type, source_record_id);
create index if not exists ai_test_cases_created_at_idx on public.ai_test_cases (created_at desc);

create index if not exists ai_test_runs_task_id_idx on public.ai_test_runs (task_id);
create index if not exists ai_test_runs_task_version_id_idx on public.ai_test_runs (task_version_id);
create index if not exists ai_test_runs_status_idx on public.ai_test_runs (status);
create index if not exists ai_test_runs_created_at_idx on public.ai_test_runs (created_at desc);

create index if not exists ai_live_generation_log_task_id_idx on public.ai_live_generation_log (task_id);
create index if not exists ai_live_generation_log_source_idx on public.ai_live_generation_log (source_type, source_record_id);
create index if not exists ai_live_generation_log_created_at_idx on public.ai_live_generation_log (created_at desc);

create or replace function public.ai_quality_studio_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists ai_tasks_set_updated_at on public.ai_tasks;
create trigger ai_tasks_set_updated_at
before update on public.ai_tasks
for each row execute function public.ai_quality_studio_set_updated_at();

drop trigger if exists ai_task_versions_set_updated_at on public.ai_task_versions;
create trigger ai_task_versions_set_updated_at
before update on public.ai_task_versions
for each row execute function public.ai_quality_studio_set_updated_at();

drop trigger if exists ai_test_cases_set_updated_at on public.ai_test_cases;
create trigger ai_test_cases_set_updated_at
before update on public.ai_test_cases
for each row execute function public.ai_quality_studio_set_updated_at();

create or replace function public.ai_task_versions_assign_version_number()
returns trigger
language plpgsql
as $$
declare
  max_version integer;
begin
  select max(version_number)
    into max_version
  from public.ai_task_versions
  where task_id = new.task_id;

  if new.version_number is null or new.version_number <= 0 then
    new.version_number := coalesce(max_version, 0) + 1;
    return new;
  end if;

  if max_version is not null and new.version_number <= max_version then
    raise exception 'version_number must be higher than existing versions for this task';
  end if;

  return new;
end;
$$;

drop trigger if exists ai_task_versions_assign_version_number on public.ai_task_versions;
create trigger ai_task_versions_assign_version_number
before insert on public.ai_task_versions
for each row execute function public.ai_task_versions_assign_version_number();

insert into public.ai_tasks (key, label, input_type, output_type, description)
values
  ('entry_cleanup', 'Entry cleanup', 'entry', 'text', 'Opschonen van ruwe entrytekst zonder samenvatting.'),
  ('entry_summary', 'Entry summary', 'entry', 'text', 'Korte samenvatting van één entry.'),
  ('day_summary', 'Dag samenvatting', 'day', 'text', 'Compacte dag-samenvatting op basis van daginhoud.'),
  ('day_narrative', 'Dag narratief', 'day', 'text', 'Volledige verhalende dagtekst op basis van brondata.'),
  ('week_summary', 'Week samenvatting', 'week', 'text', 'Compacte week-samenvatting op basis van daglagen.'),
  ('week_narrative', 'Week narratief', 'week', 'text', 'Verhalende weektekst op basis van daglagen.'),
  ('week_highlights', 'Week highlights', 'week', 'text_list', 'Kernpunten/highlights voor weekreflectie.'),
  ('week_reflection_points', 'Week reflectiepunten', 'week', 'text_list', 'Reflectiepunten voor weekreflectie (geen advieslaag).'),
  ('month_summary', 'Maand samenvatting', 'month', 'text', 'Compacte maand-samenvatting op basis van week/daglagen.'),
  ('month_narrative', 'Maand narratief', 'month', 'text', 'Verhalende maandtekst op basis van week/daglagen.'),
  ('month_highlights', 'Maand highlights', 'month', 'text_list', 'Kernpunten/highlights voor maandreflectie.'),
  ('month_reflection_points', 'Maand reflectiepunten', 'month', 'text_list', 'Reflectiepunten voor maandreflectie (geen advieslaag).')
on conflict (key) do nothing;

alter table public.ai_tasks enable row level security;
alter table public.ai_task_versions enable row level security;
alter table public.ai_test_cases enable row level security;
alter table public.ai_test_runs enable row level security;
alter table public.ai_live_generation_log enable row level security;