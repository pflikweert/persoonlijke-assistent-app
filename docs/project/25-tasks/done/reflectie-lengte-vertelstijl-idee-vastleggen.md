---
id: reflectie-lengte-vertelstijl-idee-vastleggen
title: Reflectie-lengte en vertelstijl idee vastleggen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-02
summary: "Leg het idee voor reflectie-lengte/vertelstijl bij week- en maandreflecties vast als AI/AIQS candidate idea met expliciete requirements, gedrag en acceptatiecriteria."
tags: [ideas, aiqs, reflections, period-reflections]
workstream: idea
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: null
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---


## Probleem / context

De gebruiker wil een idee taak vastleggen voor een toekomstige reflectie-lengte/vertelstijl-instelling bij week- en maandreflecties. Dit is nog geen bouwopdracht, maar de requirements zijn concreet genoeg om als gepromoveerde candidate idea te bewaren.

## Gewenste uitkomst

Er staat een gestructureerde idea file onder `docs/project/40-ideas/30-ai-and-aiqs/**` met de gewenste enumwaarden, runtimegedrag, UI-copy, promptregels, AIQS-validatie-impact, technische impact en acceptatiecriteria.

## User outcome

De gebruiker kan later vanuit de idea file een spec-ready bouwtask laten maken zonder de oorspronkelijke details opnieuw te moeten uitschrijven.

## Functional slice

Eén documentatie-slice: idea vastleggen en linken vanuit de ideas hub.

## Entry / exit

- Entry: gebruiker vraagt om een idee taak voor reflectie-lengte/vertelstijl.
- Exit: idea staat als candidate in de AI/AIQS ideas-map en is vindbaar vanuit de ideas README.

## Happy flow

1. Kies juiste ideas-categorie.
2. Maak candidate idea file met detailbehoud.
3. Link de idea vanuit de ideas hub.
4. Draai taskflow/docs verify.

## Non-happy flows

- Empty state: als er geen passende categorie bestaat, maak geen willekeurige categorie aan maar kies dichtstbijzijnde bestaande.
- Permission denied / unavailable: niet van toepassing voor lokale docs-mutatie.
- Validation / unsupported state: taskflow vereist een taskfile-mutatie naast idea-mutatie; deze taskfile borgt dat spoor.
- Failure / retry / cancel: bij docs verify failure eerst task/docs herstellen.

## UX / copy

Geen runtime UI-wijziging. De idea file bewaart wel de gewenste toekomstige UI-labels: Compact, Normaal, Rijk, Boek.

## Data / IO

- Input: user requirements uit de prompt.
- Output: idea file en README-link.
- Opslag/API/service/file-impact: alleen docs.
- Statussen: idea status `candidate`; uitvoertask status `done`.

## Waarom nu

Het idee is concreet genoeg om niet in losse chatcontext te laten zitten en raakt toekomstige AIQS/runtimeplanning.

## In scope

- Candidate idea aanmaken.
- Oorspronkelijke requirements expliciet bewaren.
- Ideas README bijwerken.
- Docs/taskflow verify draaien.

## Buiten scope

- Code implementeren.
- Databasevelden of migrations toevoegen.
- UI bouwen.
- Prompt-runtime aanpassen.

## Oorspronkelijk plan / afgesproken scope

Maak een idee taak aan voor: "Implementeer een reflectie-lengte/vertelstijl-instelling voor Budio periodereflecties."

## Expliciete user requirements / detailbehoud

- Vier stijlen: `compact`, `normal`, `rich`, `book`.
- Default: `normal`.
- Geldt voor week- en maandreflecties.
- Beïnvloedt vooral `narrativeText`, beperkt `summaryText`, `highlights` en `reflectionPoints`.
- UI-labels en helperteksten moeten bewaard blijven.
- AI-runtime moet gekozen stijl ontvangen.
- Promptopbouw moet per stijl expliciete instructies krijgen.
- AIQS validatie/debugging moet gekozen stijl tonen of gebruiken.
- Toekomstige bouwtask moet databasevelden, API-types, form state, validation en tests meenemen waar nodig.
- Bestaande reflecties hoeven niet verplicht opnieuw gegenereerd te worden.

## Status per requirement

- [x] Vier stijlen vastgelegd — status: gebouwd in idea file.
- [x] Default `normal` vastgelegd — status: gebouwd in idea file.
- [x] Week/maand scope vastgelegd — status: gebouwd in idea file.
- [x] UI-labels en helperteksten vastgelegd — status: gebouwd in idea file.
- [x] Promptgedragsregels per stijl vastgelegd — status: gebouwd in idea file.
- [x] AIQS validatie/debugging requirement vastgelegd — status: gebouwd in idea file.
- [x] Acceptatiecriteria vastgelegd — status: gebouwd in idea file.

## Toegevoegde verbeteringen tijdens uitvoering

- Idea gelinkt vanuit `docs/project/40-ideas/README.md`.

## Uitvoerblokken / fasering

- [x] Blok 1: docs/ideas structuur controleren.
- [x] Blok 2: idea file en hub-link aanmaken.
- [x] Blok 3: taskflow/docs verify afronden.

## Concrete checklist

- [x] Idea file aanmaken in `30-ai-and-aiqs`.
- [x] Requirements bewaren.
- [x] Ideas README link toevoegen.
- [x] Taskfile voor uitvoering toevoegen.

## Acceptance criteria

- [x] Idea file bestaat.
- [x] Idea file bevat gedragsregels voor Compact, Normaal, Rijk en Boek.
- [x] Idea file bevat acceptatiecriteria voor toekomstige bouwtask.
- [x] Idea is vindbaar vanuit ideas README.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: maak een idee taak aan voor reflection depth/style bij periodereflecties.
- Toegevoegde verbeteringen: README-link en taskflow-spoor toegevoegd.
- Afgerond: idea file en uitvoertask aangemaakt.
- Open / blocked: toekomstige implementatie blijft open tot promotie naar bouwtask.

## Relevante links

- `docs/project/40-ideas/30-ai-and-aiqs/70-reflectie-lengte-vertelstijl-periodereflecties.md`


## Commits

- 2026-07-02T13:47:30+02:00 — docs: add reflection style idea