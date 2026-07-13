---
id: task-dagdetail-empty-state-en-reflectieblokken-verwijderen
title: Dagdetail empty state en reflectieblokken verwijderen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-10
summary: Verbeter de lege dagdetail-empty-state en verwijder week- en maandreflectieblokken plus bijbehorende fetches van dagdetail.
tags: [day-detail, ui, reflections]
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

Lege dagdetailpagina's tonen nu een te technische empty state onder `Individuele momenten`. Daarnaast haalt en rendert dagdetail week- en maandreflecties, terwijl die op eigen reflectieplekken thuishoren.

## Gewenste uitkomst

Een lege dag toont compact `Nog geen momenten`, `Er is voor deze dag nog niets vastgelegd.` en de knop `Moment toevoegen`. Dagdetail toont nergens meer week- of maandreflecties en haalt die data ook niet meer op.

## User outcome

De gebruiker ziet op een lege dag een rustige, natuurlijke actie om een moment toe te voegen, zonder reflectieblokken die de dagpagina verlengen.

## Functional slice

Een gerichte dagdetailwijziging: empty state copy/section-title aanpassen en reflectie-data/renderpad verwijderen uit `app/day/[date].tsx`.

## Entry / exit

- Entry: gebruiker opent `/day/YYYY-MM-DD`.
- Exit: lege dagen tonen de nieuwe empty state; gevulde dagen eindigen na de relevante dagsecties zonder week/maandreflectiekaarten.

## Happy flow

1. Lege dag opent met ongewijzigde header.
2. Empty state toont `Nog geen momenten`, `Er is voor deze dag nog niets vastgelegd.` en `Moment toevoegen`.
3. De knop opent bestaande capture voor de gekozen datum.
4. Gevulde dagen tonen bestaande dagverhaal/inzicht/kernpunten/momenten, zonder reflectieblokken.

## Non-happy flows

- Loading: bestaande loading-state blijft.
- Error: bestaande error-state blijft.
- Ongeldige datum: bestaande route-validatie blijft.
- Capture-fout: bestaande capture-flow blijft verantwoordelijk.

## UX / copy

- Header blijft ongewijzigd.
- Geen grote illustratie, kaart, extra uitleg of secundaire actie.
- Empty copy exact:
  - `Nog geen momenten`
  - `Er is voor deze dag nog niets vastgelegd.`
  - `Moment toevoegen`

## Data / IO

- Input: bestaande dagjournal en momentdata.
- Output: geen week/maandreflectie-fetches of reflectieprops op dagdetail.
- Opslag/API/service/file-impact: geen database-, service- of edge-functionwijzigingen.
- Statussen: bestaande load/error/mutation-states blijven.

## Waarom nu

Dit houdt dagdetail scherper op de dag zelf en voorkomt onnodige reflectiequeries op deze route.

## In scope

- `app/day/[date].tsx` empty state aanpassen.
- Week/maandreflectie imports, state, fetches en rendering uit dagdetail verwijderen.
- Verify en taskflow afronden.

## Buiten scope

- Header, dagverhaal, inzicht, kernpunten en gevulde momenten redesignen.
- Vandaag, Terugblik, weekdetail, maanddetail, admin, database of reflectiegeneratie aanpassen.
- Nieuwe dependencies, settings of brede component-rewrite.

## Oorspronkelijk plan / afgesproken scope

- Verbeter lege dagdetail-empty-state.
- Verwijder week- en maandreflecties volledig van dagdetailpagina's.
- Laat reflecties elders bestaan.
- Houd historische capture ongewijzigd.

## Expliciete user requirements / detailbehoud

1. Header exact behouden.
2. Lege dagtitel wordt `Nog geen momenten`.
3. Lege dagtekst wordt `Er is voor deze dag nog niets vastgelegd.`
4. Knop wordt `Moment toevoegen`.
5. Geen weekreflectie op dagdetail.
6. Geen maandreflectie op dagdetail.
7. Geen onnodige reflectiequeries op dagdetail.
8. Geen lege ruimte of container achterlaten.

## Status per requirement

- [x] Header ongewijzigd — status: gebouwd
- [x] Empty state copy/actie aangepast — status: gebouwd
- [x] Weekreflectie-rendering en fetch verwijderd — status: gebouwd
- [x] Maandreflectie-rendering en fetch verwijderd — status: gebouwd
- [x] Capture blijft bestaande datumroute gebruiken — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Bestaande reflectieregeneratie na momentbewerking is bewust behouden, omdat deze taak alleen dagdetail-fetch/rendering verwijdert en reflectiedata/-generatie buiten scope laat.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, context en taskflow bevestigen.
- [x] Blok 2: dagdetail empty state en reflectiepad aanpassen.
- [x] Blok 3: verify, smoke waar mogelijk, task/docs afronden.

## Concrete checklist

- [x] Inspecteer actuele day-detail reflectiepad.
- [x] Pas lege moments-section aan.
- [x] Verwijder reflectie-import/state/fetch/rendering.
- [x] Draai checks.
- [x] Rond taskflow af.

## Acceptance criteria

- [x] Lege dag toont `Nog geen momenten`, `Er is voor deze dag nog niets vastgelegd.` en `Moment toevoegen`.
- [x] Bestaande header blijft ongewijzigd.
- [x] Dagdetail toont geen week- of maandreflectieblokken.
- [x] Dagdetail haalt geen week- of maandreflecties meer op.
- [x] Gevulde momentenweergave blijft bestaand.

## Blockers / afhankelijkheden

- Geen externe blockers bekend.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `rg "ReflectionTeaserCard|weekReflection|monthReflection|fetchReflectionForAnchorDate|reflectionCardsBlock|WEEKELIJKSE|MAANDELIJKSE" app/day/[date].tsx` gaf geen matches.
- ✅ `npm run taskflow:verify`
- ✅ `curl -I --max-time 5 http://localhost:8081/day/2026-05-31` gaf HTTP 200.
- ✅ `node scripts/seed-local-page-swipe-smoke.mjs`
- ✅ Authenticated Playwright smoke via bestaande `loginWithLocalMagicLink`:
  - lege dag `http://localhost:8081/day/2026-07-03` toont `Nog geen momenten`, `Er is voor deze dag nog niets vastgelegd.` en de moment-toevoegactie
  - gevulde dagjournal-fixture `http://localhost:8081/day/2026-07-01` toont dagcontent
  - seeded week- en maandreflectietekst renderen niet op dagdetail
- ⚠️ De eerste no-write smoke zonder login redirectte naar `/sign-in`; daarna is de smoke herhaald met bestaande magic-link loginlogica.

## Reconciliation voor afronding

- Oorspronkelijk plan: lege dagdetail-empty-state verbeteren en week/maandreflecties volledig van dagdetail verwijderen.
- Expliciete user requirements: header, dagverhaal, inzicht, kernpunten en gevulde momentenweergave zijn niet aangepast; reflectie-fetch/rendering is uit dagdetail verwijderd.
- Toegevoegde verbeteringen: bestaande reflectieregeneratie na momentbewerking is bewust behouden om reflectiedata-gedrag buiten scope niet te wijzigen.
- Afgerond: empty state copy/actie, reflectie-imports, state, fetches, rendering en dode styles zijn aangepast/verwijderd.
- Open / blocked: volledige light/dark visuele vergelijking is niet uitgevoerd; authenticated functional smoke is wel groen.

## Relevante links

- `app/day/[date].tsx`


## Agent activity

- start 2026-07-10T08:17:09.227Z - Codex / gpt-5 / codex / default

- stop 2026-07-10T08:17:09.227Z -> 2026-07-10T08:19:04.175Z - Codex / gpt-5 / codex / default - reason: done


## Commits

- 2026-07-13T20:20:34+02:00 — feat: improve day detail and historical capture flow