begin;

select plan(6);

insert into public.ai_tasks (key, label, input_type, output_type, description)
values ('pgtap_aiqs_live_immutability', 'pgTAP AIQS immutability', 'entry', 'json', 'Transactional test fixture');

insert into public.ai_task_versions (
  task_id,
  version_number,
  status,
  model,
  prompt_template,
  system_instructions,
  output_schema_json,
  config_json
)
select
  id,
  1,
  'draft',
  'test-model',
  'draft prompt',
  'draft system instructions',
  '{"type":"object"}'::jsonb,
  '{"temperature":0.2}'::jsonb
from public.ai_tasks
where key = 'pgtap_aiqs_live_immutability';

select lives_ok(
  $$update public.ai_task_versions
    set prompt_template = 'updated draft prompt'
    where task_id = (select id from public.ai_tasks where key = 'pgtap_aiqs_live_immutability')$$,
  'draft content remains editable'
);

select lives_ok(
  $$update public.ai_task_versions
    set status = 'live', became_live_at = now(), locked_at = now()
    where task_id = (select id from public.ai_tasks where key = 'pgtap_aiqs_live_immutability')$$,
  'a draft can become live'
);

select throws_ok(
  $$update public.ai_task_versions
    set prompt_template = 'forbidden live overwrite'
    where task_id = (select id from public.ai_tasks where key = 'pgtap_aiqs_live_immutability')$$,
  '55000',
  'AIQS versions that have been live are content-immutable; create and promote a new version instead.',
  'live prompt content cannot be overwritten'
);

select lives_ok(
  $$update public.ai_task_versions
    set status = 'archived'
    where task_id = (select id from public.ai_tasks where key = 'pgtap_aiqs_live_immutability')$$,
  'a live version can be archived'
);

select throws_ok(
  $$update public.ai_task_versions
    set config_json = '{"temperature":0.8}'::jsonb
    where task_id = (select id from public.ai_tasks where key = 'pgtap_aiqs_live_immutability')$$,
  '55000',
  'AIQS versions that have been live are content-immutable; create and promote a new version instead.',
  'archived formerly-live config remains immutable'
);

select lives_ok(
  $$update public.ai_task_versions
    set status = 'live', locked_at = now()
    where task_id = (select id from public.ai_tasks where key = 'pgtap_aiqs_live_immutability')$$,
  'an archived version can be restored live without content changes'
);

select * from finish();
rollback;
