-- Wrap auth.uid() in a scalar subselect to avoid per-row function re-evaluation warnings.

drop policy if exists "entries_raw_user_owns_rows" on public.entries_raw;

create policy "entries_raw_user_owns_rows"
  on public.entries_raw
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
