---
id: task-capture-tekstinvoer-copy-en-spacing-polish
title: Capture tekstinvoer copy en spacing polish
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-10
summary: Verwijder overbodige titel en uitleg boven de tekstinvoer in de capture type-flow en geef de editor meer ruimte zonder functionele wijzigingen.
tags: [capture, ui, polish]
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

De tekstinvoerweergave in de capture-flow bevat te veel vaste copy boven het tekstveld. Daardoor begint het schrijfveld te laag en krijgt de gebruiker minder effectieve schrijfruimte.

## Gewenste uitkomst

De tekstinvoerweergave toont direct onder de bestaande header alleen de functionele datumcontext, daarna het tekstveld, tekenteller en `Leg vast`. Titel en subtitel verdwijnen volledig zonder lege restspacing.

## User outcome

De gebruiker kan sneller beginnen met schrijven, vooral bij historische capture, terwijl targetDate, returnTo, teller, validatie en opslag ongewijzigd blijven.

## Functional slice

Een kleine UI-polish op de bestaande `/capture/type` tekstinvoerweergave.

## Entry / exit

- Entry: gebruiker opent `/capture/type?targetDate=YYYY-MM-DD&returnTo=/day/YYYY-MM-DD`.
- Exit: tekstmoment kan zoals voorheen worden geschreven en opgeslagen, met meer editorruimte.

## Happy flow

1. Tekstinvoer opent met bestaande header/terugknop.
2. Titel `Wat wil je vastleggen?` en subtitel verdwijnen.
3. Datumcontext blijft zichtbaar en dynamisch.
4. Textarea begint hoger, teller blijft werken en `Leg vast` bewaart zoals voorheen.

## Non-happy flows

- Geen targetDate: bestaande today/capture fallback blijft.
- Te korte/lege tekst: bestaande validatie blijft.
- Opslaan mislukt: bestaande foutafhandeling blijft.
- Loading/disabled state: bestaande gedrag blijft.

## UX / copy

- Verwijderen:
  - `Wat wil je vastleggen?`
  - `Schrijf op wat je wilt onthouden, verwerken of bewaren.`
- Behouden:
  - `Je voegt dit toe aan [datum].`
  - placeholder of korte fallback `Begin met schrijven…`
  - teller `0 / 20000`
  - actie `Leg vast`

## Data / IO

- Input: bestaande routeparams `targetDate`, `returnTo`.
- Output: bestaande entry-save flow.
- Opslag/API/service/file-impact: geen service-, API-, database- of dependencywijzigingen.
- Statussen: bestaande form/loading/validation states blijven.

## Waarom nu

Dit is een kleine capture-first UX-verbetering die minder uitleg en meer schrijfruimte geeft.

## In scope

- Werkelijke tekstinvoercomponent/route inspecteren.
- Titel/subtitel verwijderen.
- Spacing/editorhoogte aanpassen met bestaande layouttokens/flex.
- Gerichte verify en ingelogde smoke waar mogelijk.

## Buiten scope

- Capture-typekeuze, opnameflow, audio, targetDate/returnTo, opslag, validatie, dagdetail, dagenkiezer, navigatie, design system, database en dependencies.

## Oorspronkelijk plan / afgesproken scope

- Gerichte micro-UX-polish op tekstinvoer in capture-flow.
- Geen redesign en geen functionele wijzigingen.

## Expliciete user requirements / detailbehoud

1. `Wat wil je vastleggen?` volledig verwijderen.
2. `Schrijf op wat je wilt onthouden, verwerken of bewaren.` volledig verwijderen.
3. Datumcontext dynamisch behouden.
4. Datumcontext direct onder header met normale spacing.
5. Textarea begint hoger en krijgt meer bruikbare hoogte.
6. Teller en validatie blijven ongewijzigd.
7. `Leg vast` blijft functioneel identiek.
8. `targetDate` en `returnTo` blijven correct.

## Status per requirement

- [x] Titel/subtitel verwijderd — status: gebouwd
- [x] Datumcontext behouden — status: gebouwd
- [x] Textarea/layout hoger en ruimer — status: gebouwd
- [x] Teller/actie/validatie ongewijzigd — status: gebouwd
- [x] Ingelogde smoke waar mogelijk — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, context en taskflow bevestigen.
- [x] Blok 2: werkelijke component inspecteren en minimale UI-wijziging uitvoeren.
- [x] Blok 3: checks en smoke, task/docs afronden.

## Concrete checklist

- [x] Vind de daadwerkelijke tekstinvoerweergave.
- [x] Verwijder vaste titel/subtitel zonder restspacing.
- [x] Pas spacing/editor flex aan.
- [x] Draai lint/typecheck/taskflow.
- [x] Draai relevante authenticated smoke.

## Acceptance criteria

- [x] Titel en subtitel zijn volledig weg.
- [x] Datumcontext blijft dynamisch zichtbaar.
- [x] Textarea begint hoger en krijgt meer ruimte.
- [x] Teller en `Leg vast` blijven werken.
- [x] Geen targetDate/returnTo-regressie.

## Blockers / afhankelijkheden

- Geen externe blockers bekend.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `rg "Wat wil je vastleggen|Schrijf op wat je wilt onthouden|Je voegt dit toe aan|Begin met schrijven|Leg vast" app/capture/type.tsx app/capture/index.tsx app/capture/record.tsx components -S`
- ✅ Authenticated desktop smoke via bestaande `loginWithLocalMagicLink` op `/capture/type?targetDate=2026-05-31&returnTo=%2Fday%2F2026-05-31`
  - verwijderde titel/subtitel afwezig
  - datumcontext zichtbaar
  - editor zichtbaar, invulbaar en 596px hoog
  - teller update zichtbaar
- ✅ Authenticated mobile dark smoke via bestaande `loginWithLocalMagicLink` op `/capture/type?targetDate=2026-06-02&returnTo=%2Fday%2F2026-06-02`
  - verwijderde titel/subtitel afwezig
  - datumcontext zichtbaar
  - editor zichtbaar, invulbaar en 540px hoog
  - geen horizontale overflow
- ✅ `npm run taskflow:verify`
- User-follow-up: submitknop krijgt een unieke accessibility/test hook zodat smoke-tests niet hoeven te matchen op het ambigue zichtbare label `Leg vast`.
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ Authenticated selector-smoke via bestaande `loginWithLocalMagicLink`:
  - `getByRole('button', { name: 'Tekstmoment vastleggen' })` vindt exact één submitknop
  - `getByTestId('capture-type-submit-button')` is zichtbaar en enabled na tekstinvoer
- User-follow-up: top-spacing tussen capture-header en datumcontext moet gelijklopen met dagdetail.
- ✅ Desktop spacing compare:
  - `/day/2026-05-31`: header/content gap 38px
  - `/capture/type?targetDate=2026-05-31&returnTo=%2Fday%2F2026-05-31`: header/content gap 40px
  - verschil 2px
- ✅ Mobile spacing compare:
  - `/day/2026-05-31`: header/content gap 38px
  - `/capture/type?targetDate=2026-05-31&returnTo=%2Fday%2F2026-05-31`: header/content gap 40px
  - verschil 2px, geen horizontale overflow
- ✅ `npm run lint`
- ✅ `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: titel en subtitel verwijderen, datumcontext behouden, content omhoog brengen en editor meer ruimte geven zonder functionele wijziging.
- Toegevoegde verbeteringen: geen.
- Afgerond: `app/capture/type.tsx` gebruikt geen `CaptureIntro` meer in de tekstinvoerroute, datumcontext heeft geen extra topmargin, de capture-content heeft geen extra top-padding meer bovenop de compacte notice, de bestaande flex-editor benut de vrijgekomen ruimte en de submitknop heeft een unieke accessibility/test hook.
- Open / blocked: opslaan naar backend is niet opnieuw uitgevoerd in de smoke; routing, input, teller en actie-aanwezigheid zijn ingelogd gecontroleerd en submitcode is ongemoeid gebleven.

## Relevante links

- `app/capture/type.tsx`


## Agent activity

- start 2026-07-10T08:35:54.366Z - Codex / gpt-5 / codex / default

- stop 2026-07-10T08:35:54.366Z -> 2026-07-10T08:39:15.173Z - Codex / gpt-5 / codex / default - reason: done

- start 2026-07-10T08:40:22.045Z - Codex / gpt-5 / codex / default

- stop 2026-07-10T08:40:22.045Z -> 2026-07-10T08:41:26.128Z - Codex / gpt-5 / codex / default - reason: done

- start 2026-07-10T08:43:13.050Z - Codex / gpt-5 / codex / default

- stop 2026-07-10T08:43:13.050Z -> 2026-07-10T08:45:23.942Z - Codex / gpt-5 / codex / default - reason: done


## Commits

- 2026-07-13T20:20:34+02:00 — feat: improve day detail and historical capture flow