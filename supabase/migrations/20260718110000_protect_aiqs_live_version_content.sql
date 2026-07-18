create or replace function private.protect_aiqs_live_version_content()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.became_live_at is not null and (
    new.id is distinct from old.id
    or new.task_id is distinct from old.task_id
    or new.version_number is distinct from old.version_number
    or new.model is distinct from old.model
    or new.prompt_template is distinct from old.prompt_template
    or new.system_instructions is distinct from old.system_instructions
    or new.output_schema_json is distinct from old.output_schema_json
    or new.config_json is distinct from old.config_json
    or new.min_items is distinct from old.min_items
    or new.max_items is distinct from old.max_items
    or new.changelog is distinct from old.changelog
    or new.created_by is distinct from old.created_by
    or new.created_at is distinct from old.created_at
  ) then
    raise exception using
      errcode = '55000',
      message = 'AIQS versions that have been live are content-immutable; create and promote a new version instead.';
  end if;

  return new;
end;
$$;

drop trigger if exists ai_task_versions_protect_live_content on public.ai_task_versions;
create trigger ai_task_versions_protect_live_content
before update on public.ai_task_versions
for each row
execute function private.protect_aiqs_live_version_content();
