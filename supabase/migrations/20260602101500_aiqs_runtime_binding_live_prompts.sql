alter table public.ai_tasks
  add column if not exists runtime_binding_key text,
  add column if not exists runtime_family text,
  add column if not exists composition_role text not null default 'legacy_hidden',
  add column if not exists managed_output_field text,
  add column if not exists is_runtime_driver boolean not null default false,
  add column if not exists variant_role text;

update public.ai_tasks
set
  runtime_binding_key = case key
    when 'entry_cleanup' then 'entry_normalization.primary'
    when 'day_narrative' then 'day_journal.primary'
    when 'week_narrative' then 'week_reflection.primary'
    when 'month_narrative' then 'month_reflection.primary'
    else runtime_binding_key
  end,
  runtime_family = case key
    when 'entry_cleanup' then 'entry_normalization'
    when 'day_summary' then 'day_journal'
    when 'day_narrative' then 'day_journal'
    when 'week_summary' then 'week_reflection'
    when 'week_narrative' then 'week_reflection'
    when 'week_highlights' then 'week_reflection'
    when 'week_reflection_points' then 'week_reflection'
    when 'month_summary' then 'month_reflection'
    when 'month_narrative' then 'month_reflection'
    when 'month_highlights' then 'month_reflection'
    when 'month_reflection_points' then 'month_reflection'
    else runtime_family
  end,
  composition_role = case key
    when 'entry_cleanup' then 'single'
    when 'day_summary' then 'compound_member'
    when 'day_narrative' then 'compound_member'
    when 'week_summary' then 'compound_member'
    when 'week_narrative' then 'compound_member'
    when 'week_highlights' then 'compound_member'
    when 'week_reflection_points' then 'compound_member'
    when 'month_summary' then 'compound_member'
    when 'month_narrative' then 'compound_member'
    when 'month_highlights' then 'compound_member'
    when 'month_reflection_points' then 'compound_member'
    when 'entry_summary' then 'legacy_hidden'
    else composition_role
  end,
  managed_output_field = case key
    when 'entry_cleanup' then 'body'
    when 'day_summary' then 'summary'
    when 'day_narrative' then 'narrative_text'
    when 'week_summary' then 'summary_text'
    when 'week_narrative' then 'narrative_text'
    when 'week_highlights' then 'highlights_json'
    when 'week_reflection_points' then 'reflection_points_json'
    when 'month_summary' then 'summary_text'
    when 'month_narrative' then 'narrative_text'
    when 'month_highlights' then 'highlights_json'
    when 'month_reflection_points' then 'reflection_points_json'
    else managed_output_field
  end,
  is_runtime_driver = case key
    when 'entry_cleanup' then true
    when 'day_narrative' then true
    when 'week_narrative' then true
    when 'month_narrative' then true
    else false
  end,
  variant_role = case key
    when 'entry_cleanup' then 'primary'
    when 'day_narrative' then 'primary'
    when 'week_narrative' then 'primary'
    when 'month_narrative' then 'primary'
    else null
  end
where key in (
  'entry_cleanup',
  'entry_summary',
  'day_summary',
  'day_narrative',
  'week_summary',
  'week_narrative',
  'week_highlights',
  'week_reflection_points',
  'month_summary',
  'month_narrative',
  'month_highlights',
  'month_reflection_points'
);

insert into public.ai_tasks (
  key,
  label,
  input_type,
  output_type,
  description,
  is_active,
  runtime_binding_key,
  runtime_family,
  composition_role,
  managed_output_field,
  is_runtime_driver,
  variant_role
)
values
  (
    'entry_cleanup_repair',
    'Moment opschonen repair',
    'entry',
    'json',
    'Technische repair-variant voor entry normalisatie.',
    true,
    'entry_normalization.repair',
    'entry_normalization',
    'runtime_variant',
    'body',
    false,
    'repair'
  ),
  (
    'entry_renormalization',
    'Moment renormalisatie',
    'entry',
    'json',
    'Primaire runtime-driver voor renormalisatie na handmatige edits.',
    true,
    'entry_renormalization.primary',
    'entry_renormalization',
    'runtime_variant',
    'body',
    true,
    'renormalization'
  ),
  (
    'day_journal_repair',
    'Dagverhaal repair',
    'day',
    'text',
    'Technische repair-variant voor day_journals compose.',
    true,
    'day_journal.repair',
    'day_journal',
    'runtime_variant',
    'narrative_text',
    false,
    'repair'
  )
on conflict (key) do update
set
  label = excluded.label,
  input_type = excluded.input_type,
  output_type = excluded.output_type,
  description = excluded.description,
  is_active = excluded.is_active,
  runtime_binding_key = excluded.runtime_binding_key,
  runtime_family = excluded.runtime_family,
  composition_role = excluded.composition_role,
  managed_output_field = excluded.managed_output_field,
  is_runtime_driver = excluded.is_runtime_driver,
  variant_role = excluded.variant_role,
  updated_at = timezone('utc', now());
