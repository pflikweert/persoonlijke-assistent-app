create or replace function public.aiqs_delete_archived_version(
  p_task_key text,
  p_version_id uuid
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_task_id uuid;
  v_target public.ai_task_versions%rowtype;
begin
  if p_task_key is null or btrim(p_task_key) = '' then
    raise exception 'taskKey ontbreekt.';
  end if;

  select id
    into v_task_id
  from public.ai_tasks
  where key = btrim(p_task_key);

  if v_task_id is null then
    raise exception 'Task not found.';
  end if;

  perform 1
  from public.ai_task_versions
  where task_id = v_task_id
  order by version_number
  for update;

  select *
    into v_target
  from public.ai_task_versions
  where id = p_version_id
    and task_id = v_task_id
  for update;

  if v_target.id is null then
    raise exception 'Version not found for task.';
  end if;

  if v_target.status <> 'archived'::public.ai_task_version_status then
    raise exception 'Alleen gearchiveerde versies kunnen worden verwijderd.';
  end if;

  if exists (
    select 1
    from public.ai_live_generation_log
    where task_version_id = p_version_id
  ) then
    raise exception 'Deze versie is gekoppeld aan runtime logs en blijft bewaard.';
  end if;

  delete from public.ai_test_runs
  where task_version_id = p_version_id;

  delete from public.ai_task_versions
  where id = p_version_id
    and task_id = v_task_id
    and status = 'archived'::public.ai_task_version_status;

  return jsonb_build_object(
    'deletedVersionIds', jsonb_build_array(p_version_id),
    'skippedVersionIds', '[]'::jsonb,
    'keptLatestCount', 0
  );
end;
$$;

create or replace function public.aiqs_cleanup_archived_versions(
  p_task_key text,
  p_keep_latest integer default 3
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  v_task_id uuid;
  v_keep_latest integer := coalesce(p_keep_latest, 3);
  v_deleted jsonb := '[]'::jsonb;
  v_skipped jsonb := '[]'::jsonb;
  v_candidate record;
begin
  if p_task_key is null or btrim(p_task_key) = '' then
    raise exception 'taskKey ontbreekt.';
  end if;

  if v_keep_latest < 0 then
    raise exception 'keepLatest moet 0 of hoger zijn.';
  end if;

  select id
    into v_task_id
  from public.ai_tasks
  where key = btrim(p_task_key);

  if v_task_id is null then
    raise exception 'Task not found.';
  end if;

  perform 1
  from public.ai_task_versions
  where task_id = v_task_id
  order by version_number
  for update;

  for v_candidate in
    select id
    from (
      select
        id,
        row_number() over (order by version_number desc) as archive_rank
      from public.ai_task_versions
      where task_id = v_task_id
        and status = 'archived'::public.ai_task_version_status
    ) ranked
    where archive_rank > v_keep_latest
  loop
    if exists (
      select 1
      from public.ai_live_generation_log
      where task_version_id = v_candidate.id
    ) then
      v_skipped := v_skipped || jsonb_build_array(v_candidate.id);
    else
      delete from public.ai_test_runs
      where task_version_id = v_candidate.id;

      delete from public.ai_task_versions
      where id = v_candidate.id
        and task_id = v_task_id
        and status = 'archived'::public.ai_task_version_status;

      v_deleted := v_deleted || jsonb_build_array(v_candidate.id);
    end if;
  end loop;

  return jsonb_build_object(
    'deletedVersionIds', v_deleted,
    'skippedVersionIds', v_skipped,
    'keptLatestCount', v_keep_latest
  );
end;
$$;

revoke all on function public.aiqs_delete_archived_version(text, uuid) from public;
revoke all on function public.aiqs_delete_archived_version(text, uuid) from anon;
revoke all on function public.aiqs_delete_archived_version(text, uuid) from authenticated;
grant execute on function public.aiqs_delete_archived_version(text, uuid) to service_role;

revoke all on function public.aiqs_cleanup_archived_versions(text, integer) from public;
revoke all on function public.aiqs_cleanup_archived_versions(text, integer) from anon;
revoke all on function public.aiqs_cleanup_archived_versions(text, integer) from authenticated;
grant execute on function public.aiqs_cleanup_archived_versions(text, integer) to service_role;
