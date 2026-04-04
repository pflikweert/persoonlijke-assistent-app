-- Backfill canonical day-binding for legacy raw entries.
-- We intentionally derive from captured_at in UTC to preserve deterministic behavior
-- for existing records created before journal_date existed.
update public.entries_raw
set journal_date = (captured_at at time zone 'UTC')::date
where journal_date is null;
