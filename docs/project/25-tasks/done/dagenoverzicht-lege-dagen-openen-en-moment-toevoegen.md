---
id: task-dagenoverzicht-lege-dagen-openen-en-moment-toevoegen
title: Dagenoverzicht lege dagen openen en moment toevoegen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-10
summary: "Maak lege kalenderdagen uitsluitend zichtbaar in Kies een dag, zodat een gebruiker achteraf een moment aan een lege dag kan toevoegen zonder andere gevulde-dagenflows te verbreden."
tags: [days, capture, journal]
workstream: app
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

De huidige `/days` dagkiezer toont alleen dagen met een bestaand dagjournal. Daardoor kan een gebruiker een lege historische dag niet ontdekken en openen om daar alsnog een moment vast te leggen.

De uitbreiding mag alleen gelden voor `Kies een dag` op `/days`. Andere flows die bewust gevulde dagen nodig hebben, zoals swipen tussen dagen, periode-selectors, export, reflecties, Today en admin, moeten journal/entry-gebaseerd blijven.

## Gewenste uitkomst

`/days` toont tussen de geladen echte dagjournals ook subtiele lege kalenderdagen. Een lege rij is klikbaar, opent `/day/YYYY-MM-DD`, toont daar de bestaande rustige lege staat en gebruikt de bestaande historical capture-flow om een moment voor die datum toe te voegen.

Er worden geen lege records aangemaakt en er komt geen brede kalenderfeature of gedeelde servicewijziging.

## User outcome

De gebruiker kan via `Kies een dag` een gemiste datum, bijvoorbeeld afgelopen zondag, openen en daar alsnog een moment aan toevoegen.

## Functional slice

Een `/days`-specifieke view-model uitbreiding die geladen echte dagjournals aanvult met virtuele lege dagen, plus minimale row-presentatie en dagdetail-empty-copy.

## Entry / exit

- Entry: gebruiker opent `/days`.
- Exit: gebruiker opent een lege dag, kiest `Moment toevoegen`, en de bestaande capture-flow kan terugkeren naar die dag.

## Happy flow

1. Gebruiker opent `/days` en ziet gevulde en lege dagen tussen de geladen datumgrenzen.
2. Lege dagen tonen `Nog geen moment vastgelegd` en zijn subtiel maar klikbaar.
3. Klik op een lege dag opent `/day/YYYY-MM-DD` zonder error en met een rustige lege staat.
4. `Moment toevoegen` opent de bestaande capture-flow met `targetDate` en `returnTo`.

## Non-happy flows

- Empty state: als er geen echte dagjournals zijn, blijft de bestaande archief-empty-state zichtbaar.
- Validation / unsupported state: ongeldige route-datums blijven de bestaande error tonen.
- Failure / retry / cancel: laadfouten in `/days` blijven de bestaande archief-error tonen; capture-fouten blijven in de bestaande capture-flow.

## UX / copy

- `/days` blijft list-first en gegroepeerd per maand.
- Lege dagrij: `Nog geen moment vastgelegd`.
- Lege dagdetailcopy: `Deze dag is nog leeg. Voeg een moment toe wanneer je wilt.`
- Geen kalendergrid, dashboard, extra rij-CTA of redesign.

## Data / IO

- Input: bestaande `fetchRecentDayJournals` output voor `/days`.
- Output: virtuele rows met `date`, `hasContent` en optionele journal-data.
- Opslag/API/service/file-impact: geen databasewrites voor lege dagen; geen service-contractwijziging.
- Statussen: alleen UI-rowstatus `hasContent`.

## Waarom nu

Dit lost een concrete capture-first kloof op: achteraf iets kunnen vastleggen op een gemiste dag zonder de app zwaarder of dashboardachtig te maken.

## In scope

- `/days`-specifieke pure helper voor virtuele lege dagen.
- Minimale wijziging in `app/(tabs)/days.tsx`.
- Minimale optionele presentation-prop in `ArchiveGroupedListItem`.
- Kleine unit-test voor de helper.
- Empty-copy op dagdetail waar nodig.

## Buiten scope

- Lege dagen in swipen tussen dagen.
- Lege dagen in period selectors, export/import, reflections, Today of admin.
- Service-index exports voor de nieuwe helper.
- Database-migraties, seeds, lege `day_journals`, nieuwe dependencies of AI/regeneratie-aanpassingen.

## Oorspronkelijk plan / afgesproken scope

- Maak lege kalenderdagen uitsluitend zichtbaar en openbaar via `/days` (`Kies een dag`).
- Alle andere flows die gevulde dagen verwachten blijven journal/entry-gebaseerd.
- Gebruik een `/days`-specifieke helper, niet een brede servicewijziging.
- Houd dagdetail op de bestaande historical capture-flow.

## Expliciete user requirements / detailbehoud

1. Nieuwe wijziging werkt alleen via `Kies een dag` op `/days`.
2. Swipen tussen dagen toont geen lege dagen.
3. Andere plekken waar alleen gevulde dagen nodig zijn blijven ongewijzigd.
4. Lege dagen zijn subtiel zichtbaar en klikbaar.
5. Geen lege records in de database.
6. Geen nieuwe dependencies of kalendergrid.

## Status per requirement

- [x] Alleen `/days` gebruikt virtuele lege dagen — status: gebouwd
- [x] Swipen/selectors/export/reflections blijven gevuld-dagen-gebaseerd — status: gebouwd
- [x] Lege rij toont `Nog geen moment vastgelegd` — status: gebouwd
- [x] Lege dagdetailcopy is rustig en capture-flow blijft bestaand — status: gebouwd
- [x] Helper heeft unit-tests voor expansion/dedupe/toekomst-cap — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De view-model helper is bewust niet via `services/index.ts` of andere brede barrels geëxporteerd; alleen `/days` en de unit-test importeren hem.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: `/days`-helper, row-presentatie en dagdetailcopy implementeren.
- [x] Blok 3: unit-test, lint, typecheck, taskflow verify en waar mogelijk smoke uitvoeren.

## Concrete checklist

- [x] Voeg `/days`-specifieke view-model helper toe.
- [x] Pas `app/(tabs)/days.tsx` aan om alleen daar virtuele dagen te tonen.
- [x] Voeg optionele muted row-presentatie toe zonder bestaande callers te wijzigen.
- [x] Update lege dagdetailcopy.
- [x] Voeg unit-test toe.
- [x] Draai relevante checks.

## Acceptance criteria

- [x] `/days` toont lege kalenderdagen tussen geladen gevulde dagen.
- [x] Lege dagen verschijnen niet in swipe-navigation of andere gevulde-dagenflows.
- [x] Lege dagen openen `/day/YYYY-MM-DD` zonder error.
- [x] Vanuit een lege dag kan een moment voor die datum worden toegevoegd via bestaande capture.
- [x] Er worden geen lege records aangemaakt.
- [x] Geen toekomstige dagen worden getoond.

## Blockers / afhankelijkheden

- Geen externe blockers bekend.

## Verify / bewijs

- ✅ `npm run test:unit -- tests/unit/days-overview-view-model.test.ts`
- ✅ `npx tsc --noEmit --pretty false`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- ✅ `curl -I --max-time 5 http://localhost:8081/days` gaf HTTP 200.
- ⚠️ No-write Playwright smoke op `http://localhost:8081/days` redirectte naar `/sign-in`; visuele light/dark lijstcontrole was daardoor niet mogelijk zonder ingelogde sessie.
- ✅ Statische guard-check: `rg "days-overview-view-model|buildDaysOverviewRows|DaysOverviewRow" app components services hooks src tests -S` toont alleen productiegebruik in `app/(tabs)/days.tsx` en testgebruik in `tests/unit/days-overview-view-model.test.ts`.

## Reconciliation voor afronding

- Oorspronkelijk plan: lege dagen alleen in `/days`, met bestaande dagdetail/capture-flow.
- Expliciete user requirements: `/days` is de enige productiecaller van de virtuele lege-dagenhelper; swipe/selectors/export/reflections blijven op bestaande journal/entry-services.
- Toegevoegde verbeteringen: helper niet via brede barrels geëxporteerd en statisch gecontroleerd.
- Afgerond: helper, `/days` integratie, muted row-presentatie, dagdetailcopy en unit-tests zijn klaar.
- Open / blocked: visuele light/dark smoke van de ingelogde daglijst is niet uitgevoerd door redirect naar `/sign-in`.

## Relevante links

- `app/(tabs)/days.tsx`
- `app/day/[date].tsx`
- `components/journal/archive-grouped-list.tsx`


## Agent activity

- start 2026-07-10T08:05:06.110Z - Codex / gpt-5 / codex / default

- stop 2026-07-10T08:05:06.110Z -> 2026-07-10T08:08:09.197Z - Codex / gpt-5 / codex / default - reason: done


## Commits

- 2026-07-13T20:20:34+02:00 — feat: improve day detail and historical capture flow