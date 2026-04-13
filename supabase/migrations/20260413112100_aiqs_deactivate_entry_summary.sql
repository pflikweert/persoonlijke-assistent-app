update public.ai_tasks
set
  is_active = false,
  updated_at = now()
where key = 'entry_summary';
