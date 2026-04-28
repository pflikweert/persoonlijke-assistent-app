---
id: task-admin-founder-meeting-capture-web-route-en-ia
title: Admin/founder meeting capture — web route en IA
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Bouw de admin-only Meeting Capture ingang, routes en basis-IA zonder de bestaande dagboekcapture te verbreden."
tags: [meeting-capture, ui, navigation, admin]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 3
---





# Admin/founder meeting capture — web route en IA

## Probleem / context

Meeting Capture heeft een eigen plek nodig, maar mag de bestaande Today/capture/dagboekroute niet zwaarder maken.

## Gewenste uitkomst

Er is een admin-only ingang naar een Meeting Capture overzicht, een nieuwe-opname route en een detailroute. Niet-admin gebruikers zien deze ingang niet. De UI gebruikt bestaande screen scaffolds, headers, modal/backdrop en rustige Budio-layoutpatronen.

## User outcome

Een admin kan Meeting Capture openen, het lege archief begrijpen en doorklikken naar een nieuwe gespreksopname of bestaande detailpagina.

## Functional slice

Admin-only route- en schermskelet voor overview, new recording en detail, zonder recorder/storage.

## Entry / exit

- Entry: admin/settings of interne admin navigatie.
- Exit: admin staat op overview, new recording shell of detail shell; niet-admin ziet geen ingang.

## Happy flow

1. Admin opent de admin-only Meeting Capture ingang.
2. Overview toont titel `Gespreksopnames` en lege staat als er nog geen opnames zijn.
3. Admin kiest `Start opname`.
4. App navigeert naar de nieuwe-opname route.
5. Detailroute kan een placeholder/status tonen voor een gekozen recording.

## Non-happy flows

- Niet-admin: ingang verborgen of route toont bestaande unauthorized/admin-only state.
- Geen recordings: empty state met korte uitleg en primaire actie.
- Routeparameter ontbreekt: detail toont veilige not-found/terug state.
- Data laden mislukt: rustige error met `Probeer opnieuw`.

## UX / copy

- Overview title: `Gespreksopnames`.
- Empty state: `Nog geen gespreksopnames.` en `Neem een lang gesprek op buiten je dagboekflow.`
- Primary action: `Start opname`.
- Admin-only copy: hergebruik bestaande admin/permission copy.

## Data / IO

- Input: admin auth state en toekomstige recording list.
- Output: routes/screen shells en navigation wiring.
- Geen DB/storage writes in deze taak.

## Waarom nu

- Deze IA is de basis voor opname, recovery en playback.

## In scope

- Admin-only route/ingang.
- Overzicht empty state.
- Navigatie naar nieuwe opname en detail.
- Layout/copy volgens bestaande capture/moment/dag/selectie/header/footer patronen.

## Buiten scope

- Recording engine.
- Storage/upload.
- Transcriptie of insights.

## Oorspronkelijk plan / afgesproken scope

- Nieuwe admin/founder lane, niet op Today als primaire capture-CTA.
- Geen redesign; bestaande Budio UI-taal volgen.

## Expliciete user requirements / detailbehoud

- Bestaande captureflow niet aanraken.
- Shared components slim hergebruiken.
- Copy simpel houden.

## Status per requirement

- [ ] Admin-only ingang — status: niet gebouwd
- [ ] Overzicht/nieuw/detail routes — status: niet gebouwd
- [ ] UI volgt bestaande patronen — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Scope-dependency is afgerond als aparte done-task voordat route/IA bouw startte.

## Uitvoerblokken / fasering

- [x] Blok 1: bestaande admin/settings/capture routepatronen lezen.
- [x] Blok 2: kleinste route + schermskelet bouwen.
- [ ] Blok 3: lint/typecheck en light/dark smoke. Lint/typecheck/docs zijn groen; runtime smoke is blocked omdat `http://localhost:8081` geen verbinding accepteert.

## Concrete checklist

- [x] Relevante route- en admin-gating patronen lokaliseren.
- [x] Admin-only ingang toevoegen.
- [x] Overzicht empty state bouwen.
- [x] Nieuwe-opname en detailroute shell toevoegen.
- [ ] Runtime check in light/dark — blocked: lokale web devserver draait niet of accepteert geen verbinding op `http://localhost:8081`.

## Acceptance criteria

- [x] Admin-only ingang werkt in code via settings-ingang en route-level access gate.
- [x] Niet-admin kan de flow niet bereiken via route-level access gate.
- [x] Empty state en primary action zijn zichtbaar.
- [x] Nieuwe-opname en detail shells volgen bestaande layoutpatronen.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen`.

## Verify / bewijs

- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd
- `npm run docs:bundle` — geslaagd
- `npm run docs:bundle:verify` — geslaagd
- Gerichte web smoke in light/dark — nog open
- Browser smoke poging: `http://localhost:8081/meeting-capture` gaf `net::ERR_CONNECTION_REFUSED`.

## Reconciliation voor afronding

- Oorspronkelijk plan: web route en IA toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: routegroep, overview, new shell, detail shell, settings-ingang en access gate zijn gebouwd.
- Open / blocked: runtime smoke in light/dark zodra de lokale web devserver draait.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge