---
id: task-dagdetail-momenten-sectietitel-verkorten
title: Dagdetail momenten sectietitel verkorten
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-10
summary: Hernoem de gevulde dagdetailsectie `Individuele momenten` naar `Momenten` zonder verdere UI- of flowwijzigingen.
tags: [day-detail, copy, ui]
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

De sectietitel `Individuele momenten` op een gevulde dagpagina is langer dan nodig.

## Gewenste uitkomst

Op dagdetail heet de gevulde momenten-sectie `Momenten`.

## User outcome

De dagpagina leest rustiger en compacter.

## Functional slice

Alleen copywijziging in de bestaande dagdetail-rendering.

## Entry / exit

- Entry: gebruiker opent een gevulde dagdetailpagina.
- Exit: dezelfde sectie staat op dezelfde plek met titel `Momenten`.

## Happy flow

1. Gebruiker opent een dag met momenten.
2. De momentenlijst staat onder titel `Momenten`.
3. Alle interacties blijven ongewijzigd.

## Non-happy flows

- Lege dag: bestaande lege titel `Nog geen momenten` blijft.
- Loading/error: bestaande states blijven.

## UX / copy

- Vervang `Individuele momenten` door `Momenten`.
- Geen layout-, styling- of interactiewijziging.

## Data / IO

- Geen data- of service-impact.

## Waarom nu

Kleine copy-polish op bestaande dagdetailpagina.

## In scope

- `app/day/[date].tsx` sectietitel aanpassen.
- Minimale verify.

## Buiten scope

- Empty state, capture, momentdetail, services, database, styling of navigatie aanpassen.

## Oorspronkelijk plan / afgesproken scope

- Hernoem de titel individuele momenten op een dagpagina naar `Momenten`.

## Expliciete user requirements / detailbehoud

1. `Individuele momenten` wordt `Momenten`.

## Status per requirement

- [x] Sectietitel aangepast — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow vastleggen.
- [x] Blok 2: copywijziging uitvoeren.
- [x] Blok 3: verify en afronden.

## Concrete checklist

- [x] Copy aanpassen.
- [x] Typecheck/taskflow draaien.
- [x] Task afronden.

## Acceptance criteria

- [x] Gevulde dagdetailsectie heet `Momenten`.
- [x] Lege dagcopy blijft ongewijzigd.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- ✅ `rg "Individuele momenten|title=\"Momenten\"|Nog geen momenten" app/day/[date].tsx`

## Reconciliation voor afronding

- Oorspronkelijk plan: hernoem de titel individuele momenten op een dagpagina naar `Momenten`.
- Toegevoegde verbeteringen: geen.
- Afgerond: gevulde dagdetailsectie gebruikt `Momenten`; lege dagtitel `Nog geen momenten` blijft ongewijzigd.
- Open / blocked: geen.

## Relevante links

- `app/day/[date].tsx`


## Agent activity

- start 2026-07-10T08:51:45.130Z - Codex / gpt-5 / codex / default

- stop 2026-07-10T08:51:45.130Z -> 2026-07-10T08:52:28.720Z - Codex / gpt-5 / codex / default - reason: done


## Commits

- 2026-07-13T20:20:34+02:00 — feat: improve day detail and historical capture flow