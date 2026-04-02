alter table public.entries_normalized
  add column if not exists summary_short text;

update public.entries_normalized
set summary_short = (
  with cleaned as (
    select btrim(regexp_replace(coalesce(body, ''), '\s+', ' ', 'g')) as text_value
  )
  select case
    when text_value = '' then null
    when char_length(text_value) <= 160 then text_value
    else (
      case
        when btrim(regexp_replace(left(text_value, 160), '\s+\S*$', '')) <> ''
          then btrim(regexp_replace(left(text_value, 160), '\s+\S*$', '')) || '...'
        else left(text_value, 157) || '...'
      end
    )
  end
  from cleaned
)
where summary_short is null or btrim(summary_short) = '';
