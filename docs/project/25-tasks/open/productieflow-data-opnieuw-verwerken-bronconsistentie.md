---
id: productieflow-data-opnieuw-verwerken-bronconsistentie
title: Productieflow Data opnieuw verwerken bronconsistentie
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-07-04
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
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
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
- Preview/start mag geen grote entry-id arrays via querystring of `IN (...)` URL's laden; volledige scopes moeten schaalbaar blijven en backend-side uit JSON selectiecriteria worden bepaald.
- `/settings-regeneration` moet een professionele admin-wizard zijn: gewone Nederlandse taakcopy, geen scope-textarea in de standaardflow, user-id veld alleen onder `Geavanceerd`, controle verplicht vóór start, technische jobvelden ingeklapt.
- Het losse blok `Veiligheid` moet weg; `/settings-regeneration` moet visueel aansluiten op de AIQS-adminstijl.
- Periode kiezen in `/settings-regeneration` moet dezelfde gedeelde dag/week/maand-modal en opties gebruiken als `Instellingen -> Archief downloaden -> Een periode kiezen`; geen dubbele pickerlogica.
- De knop `Controleer selectie` moet weg; selectiecontrole moet automatisch lopen zodra bereik en onderdelen geldig zijn.
- Zolang er globaal een `queued` of `running` regeneration job bestaat, moet `/settings-regeneration` dominant tonen dat `Opnieuw opbouwen bezig` is en mag er geen nieuwe opdracht gestart worden.
- Een lopende opdracht moet via `Stop na huidig werk` netjes kunnen stoppen: huidige OpenAI sub-batch afronden/toepassen, daarna geen nieuwe sub-batches/retries/steps meer starten en job op `cancelled` zetten.
- Laatste UI-correctie: `/settings-regeneration` toont per moment maar één hoofdtaak. Actieve job = alleen compacte statuskaart + ingeklapte technische details; geen actieve job = rustige wizard. `Controleer selectie` komt terug als expliciete stap en `Alles opnieuw opbouwen` gebruikt één bevestigingsmodal.

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
- [x] URI-too-long in preview/start entry-batchpad opgelost — status: gebouwd; entry rows worden per candidate geladen en discovery gebruikt paged reads.
- [x] Professionele admin-wizard voor `/settings-regeneration` gebouwd — status: gebouwd; actie, bereik, onderdelen, controle en status zijn taakgericht en technische details staan ingeklapt.
- [x] AIQS-stylingcorrectie voor `/settings-regeneration` gebouwd — status: gebouwd; veiligheids-inspector verwijderd en sections gebruiken dezelfde admin-console header/breedte/plain ritmiek als AIQS.
- [x] Gedeelde periodekiezer gebouwd — status: gebouwd; export en regeneration gebruiken dezelfde shared hook/modal voor dag/week/maandselectie.
- [x] Selectiecontrole gebouwd — status: aangepast op laatste UX-correctie; handmatige knop `Controleer selectie` is terug en automatische previewcopy is verwijderd.
- [x] Single-active-job lock en graceful stop gebouwd — status: gebouwd; backend weigert nieuwe start bij globale actieve job, UI toont actieve job bovenaan en stop zet `options.stop_requested_at`.
- [x] Vereenvoudigde regeneration UI gebouwd — status: gebouwd; actieve jobstatus en nieuwe opdrachtflow zijn conditioneel gescheiden, technische details staan standaard dicht en geavanceerde opties/daginspectie zitten in één accordion.
- [x] Tests en verify uitgevoerd — status: groen na productie-auditrapportage.

## Toegevoegde verbeteringen tijdens uitvoering

- Productie-audit toolingbevinding: in deze sessie schakelde `.codex/config.toml` succesvol tijdelijk naar `supabase_remote_ro` en terug naar `supabase_local`, maar de MCP-toolset herlaadde de remote-ro server niet. Daarom is de productie-audit uitgevoerd via het nieuwe dry-run auditscript met de productiecloudconfig uit lokale env, zonder raw content te tonen en zonder writes.
- Auditrapportage aangescherpt: oude dayjournal metadata zonder `prompt_entry_count` telt als `null`/ontbrekend, niet automatisch als echte nul-input.
- Admin-tool uitgebreid met `Reparatie` versus `Alles opnieuw`, preview zonder writes, optionele target user ids en compacte scope-regels voor dag/week/maand/range.
- Backend start/preview gebruikt één candidate-builder die geselecteerde scopes naar unieke entries, dagen, weken en maanden expandt.
- Productiefout `Failed to load entry rows: URI too long` onderzocht: de frontend gebruikt al POST JSON body naar de Edge Function; de lange URL ontstond backend-side door Supabase/PostgREST `.in('id', normalizedIds)` en `.in('id', rawIds)` bij entry-batchbouw. Dit is vervangen door point lookups per candidate met cache en paged candidate discovery.
- `/settings-regeneration` herwerkt van technische console naar wizard: `Data opnieuw opbouwen`, stap 1 actie, stap 2 bereik, stap 3 onderdelen, stap 4 controle, start pas na actuele preview en inline bevestiging voor volledig opnieuw opbouwen.
- Extra UI-correctie: het aparte inspectorblok `Veiligheid` is verwijderd en de pagina gebruikt dezelfde rustige AIQS-admincompositie met `AdminConsoleHeader`, centrale contentbreedte en plain sections.
- Periodekeuze gedeeld gemaakt: `ExportPeriodSelectorModal` is een alias naar de shared `PeriodScopeSelectorModal`, export en regeneration gebruiken `usePeriodScopeSelectorOptions`, en regeneration vertaalt dag/week/maand direct naar de bestaande dependency-correcte scopes.
- Eerdere automatische previewflow vervangen door handmatige selectiecontrole; `/settings-regeneration` houdt `Start opnieuw opbouwen` disabled tot `Controleer selectie` actueel is.
- Actieve regeneration zichtbaar en blokkerend gemaakt: `latest` geeft eerst de globale actieve job terug, `start` weigert nieuwe jobs zolang een job `queued`/`running` is, en de UI toont bovenaan `Opnieuw opbouwen bezig` met `Stop na huidig werk`.
- Graceful stop toegevoegd zonder schemawijziging: `stop` gebruikt bestaande `cancelled` status en `options.stop_requested_at/by`; de worker past een open batch nog toe, maar start daarna geen retries, nieuwe sub-batches of volgende steps meer.
- `/settings-regeneration` opnieuw vereenvoudigd: actieve jobstatus, afgeronde job-samenvatting en nieuwe-opdrachtwizard zijn aparte toestanden geworden. Dubbele stop/statusblokken, losse daginspectiesectie, automatische previewcopy en herhaalde waarschuwingen zijn verwijderd.

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
- [x] Preview/start URI-too-long bug oplossen zonder querystring-id lijsten.
- [x] `/settings-regeneration` UI/copy herwerken naar beheerderstaakflow zonder standaard UUID/scope-invoer.
- [x] `Veiligheid`-blok verwijderen en AIQS-adminstyling toepassen.
- [x] Periodekiezer delen met Archief downloaden en regeneration Stap 2 daarop aansluiten.
- [x] Handmatige `Controleer selectie` als expliciete controlestap gebruiken; automatische previewcopy verwijderen.
- [x] Actieve job dominant tonen en startflow blokkeren bij `queued`/`running`.
- [x] `Stop na huidig werk` toevoegen met graceful stop na huidige OpenAI sub-batch.
- [x] Laatste UI-correctie uitvoeren: één hoofdtaak tegelijk, handmatige selectiecontrole, één geavanceerdblok en bevestigingsmodal voor alles opnieuw.
- [x] Verify uitvoeren.

## Acceptance criteria

- [ ] Case `2026-03-21` levert prompt entries > 0 en geen empty-day journal — productie-audit bevestigt nu prompt-input 5, maar huidige productie-dayjournal claimt nog leeg tot deploy/repair.
- [ ] Geen dagjournal zegt dat er geen entries zijn wanneer UI-equivalent entries bestaan — productie-audit vindt 38 repair-candidates met `empty_day_claim_with_raw_entries`; runtime guard is lokaal gebouwd maar nog niet toegepast in productie.
- [x] Data opnieuw verwerken voert geselecteerde entries uit of toont duidelijk waarom niet.
- [ ] Week- en maandreflecties bouwen op actuele dayjournals — runtime order is gebouwd; productie-audit vindt nog 3 stale reflections.
- [x] Raw data wordt niet overschreven.
- [x] Repair/backfill is dry-run-first en production-safe.
- [x] Gekozen dag/week/maand wordt dependency-correct en zonder dubbele candidates gepland.
- [x] Preview/start stuurt selectiecriteria in POST JSON en bouwt geen grote entry-id querystring voor batchconstructie.
- [x] Start opnieuw opbouwen blijft disabled tot de selectie gecontroleerd is; wijzigingen maken de preview ongeldig.
- [x] Technische velden zoals job-id, phase en batchstatus staan achter ingeklapte technische details.
- [x] `/settings-regeneration` toont geen aparte `Veiligheid` inspector meer en sluit visueel aan op AIQS.
- [x] `Een periode kiezen` gebruikt dezelfde dag/week/maand-modalopties als Archief downloaden.
- [x] Startknop wordt pas actief nadat handmatige `Controleer selectie` actueel is.
- [x] Een globale actieve regeneration job blokkeert nieuwe starts en staat bovenaan de pagina.
- [x] Stop-request markeert lopende jobs via `options.stop_requested_at` en stopt na afronden/toepassen van de huidige sub-batch.
- [x] Actieve job en nieuwe-opdrachtwizard worden niet tegelijk prominent getoond; technische details zijn standaard dicht.

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
- Na URI-too-long fix: `npx vitest run tests/unit/regeneration-source-contract.test.ts` — groen; 10 tests.
- Na active-job lock en graceful stop: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 106 tests.
- Route-smoke `/settings-regeneration`: `curl -I --max-time 5 http://localhost:8081/settings-regeneration` — HTTP 200. Playwright light/dark route-smoke — HTTP 200 zonder console/page errors, maar zonder ingelogde adminsessie eindigt de browser op het auth-scherm.
- Na vereenvoudigde `/settings-regeneration` UI: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 106 tests. Statische copycheck: `Stop aangevraagd` staat één keer, oude automatische-previewcopy en losse `Geavanceerd: dag inspecteren` zijn weg. Route-smoke HTTP 200; Playwright light/dark route-smoke HTTP 200 zonder console/page errors, maar zonder ingelogde adminsessie eindigt de browser op het auth-scherm.
- Na URI-too-long fix: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 103 tests.
- Na URI-too-long fix: `npm run docs:bundle:verify` — faalt alleen op `docs/upload/60-budio-tasks-current.md` omdat generated docs bewust niet zijn bijgewerkt binnen user-scope `Geen wijzigingen aan gegenereerde files`.
- Na admin-wizard herwerking: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 103 tests.
- Runtime-smoke: `curl -I http://localhost:8081/settings-regeneration` — HTTP 200; Playwright zonder adminsessie redirectt naar `/sign-in`, waardoor visuele admin-flow inspectie lokaal auth-blocked is zonder ingelogde admincontext.

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

- 2026-07-03T14:19:42+02:00 — Fix admin regeneration flow


- 2026-07-05T09:20:15+02:00 — Add day week month swipe navigation

- 2026-07-15T19:15:41+02:00 — feat: make Budio web app installable
## Agent activity

- stop 2026-07-03T07:55:48.268Z -> 2026-07-04T09:29:37.625Z - Codex / gpt-5 / codex / default - reason: stopped
