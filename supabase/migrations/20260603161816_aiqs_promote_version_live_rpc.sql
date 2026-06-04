create or replace function public.aiqs_promote_version_live(
  p_task_key text,
  p_version_id uuid
)
returns table (
  promoted_version_id uuid,
  archived_version_id uuid,
  previous_live_version_number integer,
  mode text
)
language plpgsql
set search_path = public
as $$
declare
  v_task_id uuid;
  v_target public.ai_task_versions%rowtype;
  v_current_live public.ai_task_versions%rowtype;
  v_has_positive_review boolean;
  v_now timestamptz := now();
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

  -- Serialize lifecycle changes for this task so the partial live index remains a guardrail,
  -- not the primary coordination mechanism.
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

  if v_target.status = 'live'::public.ai_task_version_status then
    raise exception 'Deze versie is al live.';
  end if;

  if v_target.status = 'draft'::public.ai_task_version_status then
    select exists (
      select 1
      from public.ai_test_runs
      where task_version_id = p_version_id
        and status = 'completed'::public.ai_test_run_status
        and reviewer_label in ('better'::public.ai_review_label, 'equal'::public.ai_review_label)
    )
      into v_has_positive_review;

    if not coalesce(v_has_positive_review, false) then
      raise exception 'Draft heeft eerst een opgeslagen review beter of gelijk nodig.';
    end if;

    mode := 'promote_draft';
  elsif v_target.status = 'archived'::public.ai_task_version_status then
    if v_target.became_live_at is null then
      raise exception 'Alleen eerder live geweest archived versies kunnen worden teruggezet.';
    end if;

    mode := 'rollback_archived';
  else
    raise exception 'Alleen draft of archived versies kunnen live worden gezet.';
  end if;

  select *
    into v_current_live
  from public.ai_task_versions
  where task_id = v_task_id
    and status = 'live'::public.ai_task_version_status
  for update;

  archived_version_id := null;
  previous_live_version_number := null;

  if v_current_live.id is not null then
    archived_version_id := v_current_live.id;
    previous_live_version_number := v_current_live.version_number;

    update public.ai_task_versions
    set status = 'archived'::public.ai_task_version_status
    where id = v_current_live.id;
  end if;

  update public.ai_task_versions
  set
    status = 'live'::public.ai_task_version_status,
    became_live_at = v_now,
    locked_at = v_now
  where id = v_target.id;

  promoted_version_id := v_target.id;
  return next;
end;
$$;

revoke all on function public.aiqs_promote_version_live(text, uuid) from public;
revoke all on function public.aiqs_promote_version_live(text, uuid) from anon;
revoke all on function public.aiqs_promote_version_live(text, uuid) from authenticated;
grant execute on function public.aiqs_promote_version_live(text, uuid) to service_role;
