---
id: aiqs-week-maand-validatiecases-uit-day-journals
title: AIQS Week/Maand validatiecases uit day journals
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: "Week- en maandvalidatie in AIQS gebruiken day_journals als broncases, zodat drafts getest, vergeleken en beoordeeld kunnen worden zonder bestaande period_reflections."
tags: [aiqs, validation, week, month, day-journals, evidence]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: [aiqs-runtime-db-binding-voor-live-prompts, aiqs-admin-console-uiux-linear-richting]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 2
---




## Probleem / context

Dag-validatie werkt, maar week- en maandvalidatie tonen `Geen cases gevonden`. Daardoor kan een AIQS-admin geen week- of maanddraft testen, vergelijken of evidence opbouwen.

De vermoedelijke oorzaak is dat week/maandvalidatie niet uit brondata wordt opgebouwd. Validatie mag niet afhankelijk zijn van al bestaande `period_reflections`; juist wanneer die ontbreken moet AIQS cases uit `day_journals` kunnen maken.

## Gewenste uitkomst

`week_narrative` en `month_narrative` tonen testcases die zijn opgebouwd uit `day_journals`. De validate-flow kan daarna een draft runnen, een live baseline on-demand genereren, diff tonen, observaties tonen en een reviewoordeel opslaan.

## User outcome

Een AIQS-admin kan week- en maandprompts net als dagprompts valideren op echte brondata, ook wanneer er nog geen week- of maandreflecties bestaan.

## Functional slice

Eén afgeronde slice voor AIQS validate/test source generation:

1. week/maand capabilities aanzetten
2. week/maand cases uit `day_journals` groeperen
3. week/maand testinput exact als runtime bouwen
4. live baseline voor compare on-demand genereren
5. diff-first validate-flow laten werken voor week en maand

## Entry / exit

- Entry: admin opent AIQS validate voor `week_narrative` of `month_narrative`.
- Exit: admin kiest een week- of maandcase, runt de draft, ziet diff en kan een oordeel opslaan.

## Happy flow

1. Admin opent `week_narrative` validate.
2. Case picker toont weken op basis van `day_journals`.
3. Admin kiest een weekcase en runt de test.
4. AIQS bouwt input met `period_type`, `period_start`, `period_end` en `dayJournals`.
5. Draft-output en live-output worden vergeleken in de bestaande diff-first UI.
6. Admin slaat `Beter`, `Gelijk`, `Slechter` of `Fout` op.

## Non-happy flows

- Empty state: als er echt geen bruikbare `day_journals` zijn, blijft `Geen cases gevonden` eerlijk.
- Permission denied / unavailable: bestaande AIQS admin/capability checks blijven leidend.
- Validation / unsupported state: source type moet bij task capability passen.
- Failure / retry / cancel: OpenAI-call of source-load fouten blijven als bestaande validate error zichtbaar.

## UX / copy

- Week label: `Week 2026-06-01 t/m 2026-06-07`.
- Week subtitle: `7 dagen · 42 entries`.
- Maand label: `Juni 2026`.
- Maand subtitle: `21 dagen · 137 entries`.
- Case preview blijft compact en brongebaseerd.
- Bestaande validate UI en diff-first layout blijven leidend.

## Data / IO

- Input:
  - `day_journals` per `user_id`, gegroepeerd per ISO-week of kalendermaand
  - display-entry counts uit `entries_raw`
- Output:
  - `AiTaskTestSource[]` met `sourceType: 'week' | 'month'`
  - `input_snapshot_json` met `period_type`, `period_start`, `period_end`, `dayJournals`
  - draft test run + live compare output
- Opslag/API/service/file-impact:
  - geen schema-migratie
  - bestaande `ai_test_cases.source_type` enum `week/month` gebruiken
  - synthetische stabiele UUID voor periodecase
- Statussen:
  - bestaande queued/completed/failed test run statussen blijven hetzelfde

## Waarom nu

AIQS is evidence-first. Zonder week/maandcases kunnen week- en maandprompts niet gevalideerd of veilig live gezet worden.

## In scope

- AIQS validate/test source generation voor `week_narrative` en `month_narrative`.
- Period-case helperlogica.
- Edge Function `list_test_sources`, `run_test`, `get_compare_view`.
- Type/UI-capability uitbreidingen.
- Unit- en smoke-tests.

## Buiten scope

- Prompt runtime redesign.
- Nieuwe schema-migratie.
- Consumer Vandaag/Reflecties UI.
- Bestaande productieperiodereflecties herschrijven.
- Afhankelijkheid introduceren op `period_reflections` voor validatie.

## Oorspronkelijk plan / afgesproken scope

# AIQS Week/Maand Validatiecases uit Day Journals

Week- en maandvalidatie moeten cases uit `day_journals` opbouwen, ook wanneer `period_reflections` ontbreken. Week volgt productie-bounds maandag-zondag; maand volgt kalendermaand. Testinput gebruikt dezelfde contextshape als `generate-reflection`: `period_type`, `period_start`, `period_end`, `dayJournals`. Live baseline wordt tijdens compare on-demand gegenereerd met de live AIQS-versie.

## Expliciete user requirements / detailbehoud

- Dag-validatie blijft werken.
- Week toont minimaal één case wanneer day journals beschikbaar zijn.
- Maand toont minimaal één case wanneer day journals beschikbaar zijn.
- Weekcase gebruikt groep day journals binnen een week.
- Maandcase gebruikt groep day journals binnen een maand.
- Validator bouwt runtime-input zelf uit brondata.
- Validatie hangt niet af van bestaande week- of maandoutput.
- Bij case kiezen: run live versie, run draft versie, toon diff, toon observaties, gebruiker geeft oordeel.
- Case picker toont dagen- en entries-count.
- Controleer expliciet dat generation gebaseerd is op `day_journals` en niet `period_reflections`.

## Status per requirement

- [x] Dag-validatie blijft werken — status: gebouwd en runtime-smoke toont `day_narrative` sources.
- [x] Weekcases uit `day_journals` zichtbaar — status: gebouwd; runtime-smoke toont 30 weekcases.
- [x] Maandcases uit `day_journals` zichtbaar — status: gebouwd; runtime-smoke toont 25 maandcases.
- [x] Week/month run_test bouwt productiecontext — status: gebouwd; `input_snapshot_json.dayJournals` is runtime-smoke bevestigd.
- [x] Week/month compare genereert live baseline on-demand — status: gebouwd; runtime-smoke toont `compare=available` voor week en maand.
- [x] UI/types accepteren `week | month` source types — status: gebouwd.
- [x] Unit- en runtimebewijs vastgelegd — status: gebouwd; bewijs staat onder `Verify / bewijs`.

## Toegevoegde verbeteringen tijdens uitvoering

- Pure helper `supabase/functions/_shared/aiqs-period-cases.ts` toegevoegd voor period bounds, grouping, synthetische UUID en input snapshot.
- Validate compare-labels voor `week_narrative` en `month_narrative` toegevoegd zodat diff-secties dezelfde labels gebruiken als period output.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, huidige validate/test broncode en dirty worktree bevestigen.
- [x] Blok 2: period-case pure helper + unit-tests toevoegen.
- [x] Blok 3: types/capabilities/UI source-type checks uitbreiden.
- [x] Blok 4: Edge Function source listing, run_test en compare baseline uitbreiden.
- [x] Blok 5: static/runtime verify, docs/taskflow afronden.

## Concrete checklist

- [x] Period-case helper toevoegen.
- [x] Unit-tests voor bounds, grouping, synthetic UUID en input snapshot toevoegen.
- [x] `week_narrative`/`month_narrative` capabilities aanzetten.
- [x] `RunAiTaskTestPayload` en validate UI-checks uitbreiden.
- [x] `list_test_sources` week/month bronnen laten teruggeven.
- [x] `run_test` week/month input snapshot en prompt bouwen.
- [x] `get_compare_view` week/month live baseline genereren.
- [x] Verify en reconciliation bijwerken.

## Acceptance criteria

- [x] `day_narrative` validate toont cases en kan test/diff blijven draaien.
- [x] `week_narrative` validate toont minimaal één case bij beschikbare day journals.
- [x] `week_narrative` run test slaagt en compare toont diff.
- [x] `month_narrative` validate toont minimaal één case bij beschikbare day journals.
- [x] `month_narrative` run test slaagt en compare toont diff.
- [x] `input_snapshot_json` voor week/month bevat `dayJournals` en geen `period_reflections`.
- [x] Live baseline voor week/month komt uit live AIQS-versie, niet uit bestaande reflection rows.

## Blockers / afhankelijkheden

- Geen bekende blockers.
- Dirty worktree bevat bestaande AIQS/WIP; deze taak raakt alleen relevante AIQS period-validation paden.

## Verify / bewijs

- ✅ `npx vitest run tests/unit/aiqs-period-cases.test.ts` — 5 tests groen.
- ✅ `npx vitest run tests/unit/ai-quality-validate-compare.test.ts` — 6 tests groen.
- ✅ `npm run test:unit -- aiqs-period` — 5 tests groen.
- ✅ `npm run test:unit -- ai-quality` — 4 files / 22 tests groen.
- ✅ `npm run typecheck`
- ✅ `npm run lint`
- ✅ `npm run supabase:functions:restart` — functions runtime gestart met pid `8205`; daarna door smoke opnieuw gestart met pid `8342`.
- ✅ `npm run verify:local-aiqs-smoke` — AIQS overview-smoke groen; target `http://localhost:8081/settings-ai-quality-studio`.
- ✅ Gerichte API/runtime-smoke:
  - `day_narrative: sources=30`
  - `week_narrative: sources=30`, eerste case `Week 2026-06-08 t/m 2026-06-14`, `run=completed`, `dayJournals=1`, `compare=available`
  - `month_narrative: sources=25`, eerste case `Juni 2026`, `run=completed`, `dayJournals=6`, `compare=available`
  - smoke faalt expliciet als `input_snapshot_json` `period_reflections` bevat.
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: week/maand AIQS validatiecases uit `day_journals`, inclusief run en compare.
- Toegevoegde verbeteringen: pure period-case helper en period-labels in validate compare-helper.
- Afgerond:
  - capabilities/types/UI-checks accepteren week/maand sources
  - Edge Function `list_test_sources` bouwt week/month cases uit `day_journals`
  - Edge Function `run_test` bouwt period runtime snapshot en prompt
  - Edge Function `get_compare_view` genereert live baseline on-demand met live AIQS-versie
  - unit-, static- en runtime-smoke bewijs is groen
- Open / blocked:
  - geen open punten voor deze slice.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`
- `docs/project/25-tasks/done/aiqs-admin-console-uiux-linear-richting.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state

- 2026-07-15T11:25:38+02:00 — feat: harden AIQS regeneration and close interface tasks