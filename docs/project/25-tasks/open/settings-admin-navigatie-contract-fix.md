---
id: settings-admin-navigatie-contract-fix
title: Settings/admin navigatie contract fix
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-05
summary: Maak menu/instellingen/admin navigatie deterministisch zodat Instellingen altijd het instellingenoverzicht opent.
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 2
---




## Probleem / context

De hoofdmenu-link `Instellingen` voelt alsof hij naar de laatst geopende settings/admin pagina gaat. Bronoorzaak: settings- en adminsubroutes geven `currentRouteKey="settings"` aan `FullscreenMenuOverlay`, waarna de menu-handler klikken op dezelfde key negeert. Daardoor sluit het menu zonder navigatie.

Daarnaast gebruiken first-level settings/admin pagina's veel `router.back()`, waardoor stackhistorie bepaalt waar de gebruiker uitkomt.

## Gewenste uitkomst

`Instellingen` in het hoofdmenu opent altijd het instellingenoverzicht met menu-keuzes. First-level settings/admin back gaat terug naar `/settings`. Diepere toolflows blijven naar hun logische parent navigeren.

## User outcome

De gebruiker/admin kan via menu en topbar betrouwbaar door instellingen en admin tools bewegen zonder op een eerdere subpagina te blijven hangen.

## Functional slice

Een UI-only navigatiecontract met shared helper, unit-tests en consistente wiring in settings/admin/AIQS/meeting-capture routes.

## Entry / exit

- Entry: gebruiker opent het hoofdmenu vanuit Vandaag, settings-detail of admin-tool.
- Exit: `Instellingen` brengt naar `/settings`; back-acties brengen naar de juiste parent.

## Happy flow

1. Vanuit Vandaag opent menu → Instellingen het settings-overzicht.
2. Vanuit AIQS/adminrechten/regeneration opent menu → Instellingen ook het settings-overzicht.
3. Back vanuit first-level admin tool gaat naar `/settings`.
4. Back vanuit AIQS draft/validate/test gaat naar de logische AIQS parent.

## Non-happy flows

- Empty state: geen datalaag betrokken.
- Permission denied / unavailable: bestaande admin denial states blijven ongewijzigd.
- Validation / unsupported state: onbekende route valt terug op `/settings`.
- Failure / retry / cancel: geen nieuwe async flow.

## UX / copy

- Geen redesign.
- Admin access loading/error mag compacter en duidelijker worden, maar labels/routes blijven gelijk.
- Gebruik bestaande settings/admin scaffolds en menucomponent.

## Data / IO

- Input: huidige pathname of route-intentie.
- Output: deterministische route target of no-op.
- Opslag/API/service/file-impact: UI helper, menu, route schermen, unit-test.
- Statussen: niet van toepassing.

## Waarom nu

De huidige navigatie blokkeert betrouwbaar admingebruik en voelt alsof menu/instellingen kapot zijn.

## In scope

- Shared navigation helper.
- `FullscreenMenuOverlay` menucontract fix.
- Settings/admin/AIQS/meeting-capture back wiring.
- Expliciete `settings-admin-access` Stack registratie.
- Unit-tests en gerichte static verify.

## Buiten scope

- Geen backend/API/schema.
- Geen nieuwe routes.
- Geen flow-redesign of nieuwe adminfeatures.
- Geen consumer UI redesign buiten menu/instellingen navigatiegedrag.

## Oorspronkelijk plan / afgesproken scope

- Menu → Instellingen moet altijd settings home openen.
- First-level admin/settings back → settings home.
- Diepere toolflows → logische parent.
- Geen backend/datamodel/API wijziging.
- Bestaande routes/labels/rechtenchecks blijven.

## Expliciete user requirements / detailbehoud

- Bekijk navigatie via menu / instellingen.
- Los op dat klikken op instellingen naar de laatst openstaande lijkt te gaan.
- Loop hele navigatie via menu instellingen en admin tools na.
- Benader dit als User Experience expert.

## Status per requirement

- [x] Menu → Instellingen opent settings home — status: gebouwd
- [x] First-level settings/admin back naar settings home — status: gebouwd
- [x] AIQS diepe routes naar logische parent — status: gebouwd
- [x] Meeting capture diepe routes naar parent — status: gebouwd
- [x] Admin access route expliciet geregistreerd — status: gebouwd
- [x] Unit/static verify groen — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: navigation helper + unit-tests.
- [x] Blok 3: menu/shell/screen wiring.
- [x] Blok 4: static verify en waar mogelijk runtime smoke.
- [ ] Blok 5: task/docs closeout.

## Concrete checklist

- [x] Helper `src/lib/navigation/settings-navigation.ts`.
- [x] Unit-test voor helper.
- [x] `FullscreenMenuOverlay` gebruikt settings target contract.
- [x] First-level settings/admin screens gebruiken settings-home back.
- [x] AIQS en meeting capture subroutes gebruiken parent back.
- [x] `settings-admin-access` in root Stack geregistreerd.

## Acceptance criteria

- [x] Vanuit settings/admin subroute doet menu → Instellingen niet langer no-op.
- [x] Vanuit first-level settings/admin back kom je op `/settings`.
- [x] Vanuit AIQS draft/test/validate kom je terug op detail/parent.
- [x] Tests en static checks zijn groen.

## Blockers / afhankelijkheden

- Runtime smoke is niet uitgevoerd omdat `http://localhost:8081` niet bereikbaar was (`ERR_CONNECTION_REFUSED`).

## Verify / bewijs

- `npm run test:unit -- settings-navigation` — groen.
- `npm run lint` — groen.
- `npm run typecheck` — groen.
- `npm run taskflow:verify` — groen.
- Browser smoke — niet uitgevoerd; lokale devserver was niet bereikbaar op `http://localhost:8081`.

## Reconciliation voor afronding

- Oorspronkelijk plan: settings/admin navigatiecontract fix.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: implementatie en verify.

## Relevante links

- `components/navigation/fullscreen-menu-overlay.tsx`
- `app/settings.tsx`
- `components/ui/admin-console-primitives.tsx`


## Commits

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio