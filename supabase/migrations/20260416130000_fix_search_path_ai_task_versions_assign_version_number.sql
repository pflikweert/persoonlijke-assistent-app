-- Fix: Function Search Path Mutable security issue
-- Recreate ai_task_versions_assign_version_number() with explicit search_path

create or replace function public.ai_task_versions_assign_version_number()
returns trigger
language plpgsql
stable
set search_path = public
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
