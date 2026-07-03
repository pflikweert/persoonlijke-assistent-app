---
id: productieflow-data-opnieuw-verwerken-bronconsistentie
title: Productieflow Data opnieuw verwerken bronconsistentie
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-07-03
summary: "Maak Data opnieuw verwerken veilig en bronconsistent: raw data read-only, entries eerst herstellen, daarna dagjournals, weekreflecties en maandreflecties op actuele brondata regenereren."
tags: ""
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
active_agent: Codex
active_agent_model: unknown
active_agent_runtime: codex
active_agent_since: "2026-07-03T07:55:48.268Z"
active_agent_status: running
active_agent_settings: default
---


## Probleem / context

De productieflow `Data opnieuw verwerken` levert inconsistenties op tussen zichtbare momenten, genormaliseerde entrydata en dag-/periode-output. Een dag kan in de UI meerdere individuele momenten tonen terwijl het dagjournaal zegt dat er geen entries zijn aangeleverd. Oudere momenten lijken soms raw input, normalized body en dagjournal-input niet meer consistent te koppelen.

## Gewenste uitkomst

Admins kunnen productie veilig read-only auditen, daarna entries, dagjournals, weekreflecties en maandreflecties in correcte volgorde hergenereren. Raw data blijft bronwaarheid en wordt nooit overschreven.

De flow gebruikt bestaande AIQS DB-driven promptbindings en maakt failures, repair-candidates en broncounts zichtbaar genoeg om productieherstel gecontroleerd uit te voeren.

## User outcome

Een admin kan veilig zien welke productiegegevens inconsistent zijn, gericht repair uitvoeren en daarna erop vertrouwen dat dag-, week- en maandoutput op de juiste brondata rust.

## Functional slice

Eén afgeronde reliability-slice voor de bestaande regenerationflow: audit, broncontract, gefaseerde hergeneratie, inspectie, repair/backfill en verify.

## Entry / exit

- Entry: admin opent `Data opnieuw verwerken` of developer draait het repair/auditpad.
- Exit: entries zijn eerst opgelost; daarna worden day journals, week reflections en month reflections opgebouwd uit actuele brondata met traceerbare metadata.

## Happy flow

1. Developer draait read-only productie-audit en krijgt candidates met reason codes.
2. Admin/developer voert lokale tests en implementatie uit zonder raw data te muteren.
3. Admin start hergeneratie: entries lopen eerst, daarna dagen, daarna weken, daarna maanden.
4. Admin inspecteert een dag en ziet raw, normalized, prompt-input en afgeleide output naast elkaar.
5. Productie-repair draait alleen na expliciete apply en logt repaired/skipped/failed.

## Non-happy flows

- Empty state: echte lege dag krijgt gecontroleerde empty-day output zonder OpenAI-call.
- Permission denied / unavailable: admin-only inspectie en repair blijven geblokkeerd zonder regeneration-capability of interne token.
- Validation / unsupported state: raw entries met missing/lege/mismatch normalized output worden failure/candidate, niet stilzwijgend als lege dag verwerkt.
- Failure / retry / cancel: batch failures tonen target, phase, reason en retrybaarheid; repair blijft dry-run-first.

## UX / copy

- Gebruik bestaande `app/settings-regeneration.tsx` admin-console primitives.
- Copy blijft functioneel: `Inspectie`, `Repair candidates`, `Dry-run`, `Apply`, `Failure reason`.
- Geen redesign buiten noodzakelijke inspectie/debugweergave.

## Data / IO

- Input: `entries_raw` read-only, `entries_normalized`, `day_journals`, `period_reflections`, AIQS live runtime bindings.
- Output: gerepareerde normalized rows, day journals, week/month reflections en traceerbare `generation_meta`.
- Opslag/API/service/file-impact: Edge Functions, services, admin UI, tests, repair script; raw fields worden nooit geüpdatet.
- Statussen: job/step status blijft backwards-compatible met extra debug/failure metadata.

## Waarom nu

De kernlus capture -> dagboeklaag -> reflecties moet productiebetrouwbaar zijn voordat bredere beta-readiness en AIQS-governance als betrouwbaar kunnen gelden.

## In scope

- Read-only productie-audit vooraf.
- Bronconsistent day-entry helper.
- Single-day regeneration, `process-entry` day-upsert en admin regeneration op hetzelfde broncontract.
- Strict dependency order: entries -> days -> weeks -> months.
- Admin inspectie en repair/backfill dry-run/apply.
- Unit tests en relevante verify.

## Buiten scope

- Promptstrategie of nieuwe promptdesigns wijzigen.
- Raw data herschrijven, opschonen of backfillen.
- Brede admin redesign of nieuwe queue-infrastructuur buiten de bestaande regenerationflow.
- Productie-writes zonder expliciete repair apply-run.

## Oorspronkelijk plan / afgesproken scope

- Werkvolgorde: productie-audit read-only -> failing tests -> broncontract fix -> regeneration fix -> debug/inspectie -> repair/backfill -> verify.
- Raw data blijft altijd read-only: `entries_raw.raw_text`, `transcript_text`, `captured_at`, `journal_date` worden nooit overschreven of opgeschoond.
- Admin regeneration blijft AIQS DB-driven prompts gebruiken: entries, days, weeks en months lezen live prompt/model/runtime binding uit AIQS.
- Productie-audit gebruikt tijdelijk `supabase_remote_ro`, daarna direct terug naar `supabase_local`.

## Expliciete user requirements / detailbehoud

- Case `2026-03-21` moet worden onderzocht met zichtbare momenten:
  - Zaterdag Ochtend Reflecties
  - Vragen over het contact met Nadia
  - Bericht over ons contact
  - Zo wie typical e-mail verstuurd
  - Verstuurde berichten
- Een dag met bestaande actieve momenten mag nooit een dagjournal krijgen dat zegt dat er geen entries zijn.
- Entries moeten eerst worden opgelost; daarna alle dagjournals; daarna weekreflecties; daarna maandreflecties.
- Normalized entries die gevuld lijken maar niet overeenkomen met raw input moeten worden gedetecteerd en gerepareerd.
- Raw data mag nooit kwijt raken of overschreven worden.
- Productie moet eerst read-only gevalideerd worden voordat repair of hergeneratie wordt toegepast.
- Admin wil in de tool kunnen kiezen tussen `Reparatie` en `Alles opnieuw`.
- Admin wil kunnen kiezen tussen alles nalopen of specifieke dag/week/maand/periode, eventueel meerdere tegelijk.
- Bij gekozen dag/week/maand moet de dependency-volgorde behouden blijven en overlappende selectie mag niet dubbel queued worden:
  - dag: entries voor die dag -> dayjournal -> afhankelijke week/month.
  - week: entries + dagen binnen die week -> week -> geraakt maand.
  - maand: entries + dagen binnen maand -> relevante weken -> maand.

## Status per requirement

- [x] Productie-audit read-only uitgevoerd — status: uitgevoerd via dry-run audit tegen productiecloudconfig; geen productie-writes.
- [x] Raw data read-only geborgd — status: gebouwd; runtime repair leest `entries_raw` en schrijft alleen normalized/day/period outputs.
- [x] UI/runtime broncontract gelijkgetrokken — status: gebouwd; gedeelde server-helper bevat UI-equivalent raw + legacy selectie.
- [x] Entries-first regeneration gebouwd — status: gebouwd; entry candidates komen uit raw/normalized repairdetectie.
- [x] Day/week/month dependency order gebouwd — status: gebouwd; bestaande worker-order blijft strict en candidates zijn verbreed.
- [x] Empty-day contract gebouwd — status: gebouwd; single-day true empty zonder OpenAI en non-empty empty-claim hard reject.
- [x] Admin inspectie gebouwd — status: gebouwd; `inspect_day` + Regeneration UI.
- [x] Repair/backfill dry-run/apply gebouwd — status: gebouwd; script is dry-run default, apply start expliciete regeneration job.
- [x] Repair/all + scope-selectie gebouwd — status: gebouwd; preview/start gebruiken dezelfde deduped dependency-candidates.
- [x] Tests en verify uitgevoerd — status: groen na productie-auditrapportage.

## Toegevoegde verbeteringen tijdens uitvoering

- Productie-audit toolingbevinding: in deze sessie schakelde `.codex/config.toml` succesvol tijdelijk naar `supabase_remote_ro` en terug naar `supabase_local`, maar de MCP-toolset herlaadde de remote-ro server niet. Daarom is de productie-audit uitgevoerd via het nieuwe dry-run auditscript met de productiecloudconfig uit lokale env, zonder raw content te tonen en zonder writes.
- Auditrapportage aangescherpt: oude dayjournal metadata zonder `prompt_entry_count` telt als `null`/ontbrekend, niet automatisch als echte nul-input.
- Admin-tool uitgebreid met `Reparatie` versus `Alles opnieuw`, preview zonder writes, optionele target user ids en compacte scope-regels voor dag/week/maand/range.
- Backend start/preview gebruikt één candidate-builder die geselecteerde scopes naar unieke entries, dagen, weken en maanden expandt.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, productie-audit read-only en root-cause report.
- [x] Blok 2: failing tests voor broncontract, empty-day, mismatch en order.
- [x] Blok 3: gedeelde helper en runtime/admin regeneration fix.
- [x] Blok 4: admin inspectie en repair/backfill script.
- [x] Blok 5: scoped repair/all preview en dependency-deduplicatie.
- [x] Blok 6: verify, docs bundle en reconciliation.

## Concrete checklist

- [x] Productie-audit uitvoeren zonder writes en target terugzetten naar local.
- [x] Failing tests toevoegen.
- [x] Broncontract helper implementeren.
- [x] Regeneration flows aansluiten.
- [x] Admin inspectie en service toevoegen.
- [x] Repair/backfill script toevoegen.
- [x] Repair/all-modus, preview en scoped dependency-selectie toevoegen.
- [x] Verify uitvoeren.

## Acceptance criteria

- [ ] Case `2026-03-21` levert prompt entries > 0 en geen empty-day journal — productie-audit bevestigt nu prompt-input 5, maar huidige productie-dayjournal claimt nog leeg tot deploy/repair.
- [ ] Geen dagjournal zegt dat er geen entries zijn wanneer UI-equivalent entries bestaan — productie-audit vindt 38 repair-candidates met `empty_day_claim_with_raw_entries`; runtime guard is lokaal gebouwd maar nog niet toegepast in productie.
- [x] Data opnieuw verwerken voert geselecteerde entries uit of toont duidelijk waarom niet.
- [ ] Week- en maandreflecties bouwen op actuele dayjournals — runtime order is gebouwd; productie-audit vindt nog 3 stale reflections.
- [x] Raw data wordt niet overschreven.
- [x] Repair/backfill is dry-run-first en production-safe.
- [x] Gekozen dag/week/maand wordt dependency-correct en zonder dubbele candidates gepland.

## Blockers / afhankelijkheden

- Productie-audit via MCP remote-ro was niet beschikbaar door toolreload, maar dry-run audit via productiecloudconfig is uitgevoerd.
- Productieherstel blijft afhankelijk van expliciete apply-run en deployment van de aangepaste Edge Functions.

## Verify / bewijs

- `npx vitest run tests/unit/regeneration-source-contract.test.ts` — groen; 7 tests.
- `npm run test:unit` — groen; 17 files, 100 tests.
- `npm run typecheck` — groen.
- `npm run lint` — groen.
- `npm run taskflow:verify` — groen na code/taskfile en opnieuw groen na docs-bundel.
- `npm run docs:bundle` — groen; generated docs/upload bijgewerkt.
- `npm run docs:bundle:verify` — groen.
- Herhaald na productie-auditrapportage: `npm run test:unit`, `npm run typecheck`, `npm run lint`, `npm run taskflow:verify`, `npm run docs:bundle`, `npm run docs:bundle:verify` — groen.
- Na repair/all scope-uitbreiding: `npx vitest run tests/unit/regeneration-source-contract.test.ts` — groen; 9 tests.
- Na repair/all scope-uitbreiding en period-user dedupe: `npm run typecheck`, `npm run lint`, `npm run test:unit` — groen; 17 files, 102 tests.

Productie-audit bewijs:

- MCP target is na diagnose teruggezet naar local met `node scripts/codex-mcp-target.mjs local`.
- Dry-run productie-audit: `node scripts/repair-regeneration-empty-day-mismatches.mjs --json > /tmp/budio-regeneration-prod-audit.json`.
- Target: `xmrndabfqfvkhdhcjqit.supabase.co`, `productionLike: true`, `dryRun: true`.
- Totals: 1360 raw entries, 1360 normalized entries, 225 dayjournals, 52 period reflections.
- AIQS live bindings bevestigd:
  - `entry_normalization.primary` -> `entry_cleanup:v2`, model `gpt-5.4`.
  - `day_journal.primary` -> `day_narrative:v3`, model `gpt-5.4-mini`.
  - `day_journal.repair` -> `day_journal_repair:v1`, model `gpt-4o-mini`.
  - `week_reflection.primary` -> `week_narrative:v4`, model `gpt-5.4-mini`.
  - `month_reflection.primary` -> `month_narrative:v2`, model `gpt-5.4-mini`.
- Repair-candidate counts: 1360 entry repair candidates door outdated prompt/model metadata, 38 day repair candidates met `empty_day_claim_with_raw_entries`, 3 stale reflections, 225 dayjournals met oude metadata zonder prompt-count.
- Case `2026-03-21`, entry `8a735a46-6014-4382-8fc9-0a5a541f8de8`: target entry gevonden; UI-equivalent raw count 5, normalized count 5, prompt input count 5; current dayjournal `6f8a82e1-fa37-4327-82b0-8fbf1ba36c29` claimt nog leeg en heeft oude metadata zonder source/prompt counts.

## Reconciliation voor afronding

- Oorspronkelijk plan: productie-audit, broncontract, gefaseerde regeneration, debug/inspectie, repair/backfill en verify.
- Toegevoegde verbeteringen: tooling-blocker expliciet gemaakt, audit/repair script toegevoegd en productie-audit alsnog dry-run uitgevoerd via productiecloudconfig.
- Afgerond: read-only productie-audit met echte productiegegevens, bronhelper, serverflows, admin inspectie, repair dry-run/apply script, tests en verify.
- Open: productiecode is nog niet gedeployed en productie-repair is nog niet toegepast; task blijft daarom `in_progress` en niet `done`.

## Relevante links

- `docs/project/open-points.md`
- `app/settings-regeneration.tsx`
- `supabase/functions/admin-regeneration-job/index.ts`
- `supabase/functions/regenerate-day-journal/index.ts`


## Commits

- 2026-07-03T10:34:40+02:00 — Fix scoped admin regeneration repair flow