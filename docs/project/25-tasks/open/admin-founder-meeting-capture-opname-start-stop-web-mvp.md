---
id: task-admin-founder-meeting-capture-opname-start-stop-web-mvp
title: Admin/founder meeting capture — opname start/stop web MVP
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Bouw de minimale webopnameflow voor Meeting Capture met voor-opnamescherm, timer, status, stop/bewaar en annuleren."
tags: [meeting-capture, recording, mediarecorder, ui]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-web-route-en-ia]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 4
---



# Admin/founder meeting capture — opname start/stop web MVP

## Probleem / context

De gebruiker moet lange gesprekken kunnen starten en stoppen zonder dagboekcapture te gebruiken. De eerste recorder hoeft niet slim te zijn; hij moet duidelijk en betrouwbaar zijn.

## Gewenste uitkomst

Admin kan een opname voorbereiden, starten, timer/status zien, stoppen en bewaren of annuleren met confirm. De flow bevat titel/type/contextnotitie en consent reminder. Er is geen live transcript of AI-verwerking in deze taak.

## User outcome

Een admin kan in de browser een gesprek starten, opname-status volgen en bewust stoppen/bewaren of annuleren.

## Functional slice

Minimale `MediaRecorder` start/stop flow met UI-state, zonder IndexedDB recovery of upload.

## Entry / exit

- Entry: nieuwe-opname route vanuit Meeting Capture overview.
- Exit: opname is gestopt met een lokaal blob/resultaat voor vervolgtaak, of bewust geannuleerd.

## Happy flow

1. Admin opent `Gespreksopname`.
2. Admin ziet optionele titel, type/contextnotitie en consent reminder.
3. Admin kiest `Start opname`.
4. Browser vraagt microfoontoegang indien nodig.
5. Timer en status `Opname loopt` verschijnen.
6. Admin kiest `Stop en bewaar`.
7. Flow levert audio blob/recording state op voor lokale failsafe/upload vervolg.

## Non-happy flows

- Mic denied: toon `Microfoontoegang is nodig om op te nemen.` met `Probeer opnieuw`.
- Browser unsupported: toon `Opnemen werkt niet in deze browser.` zonder crash.
- Annuleren tijdens opname: destructive confirm met `Opname annuleren?` en `Deze opname wordt niet bewaard.`
- Recorder error: toon rustige fout en behoud UI-controle.

## UX / copy

- Title: `Gespreksopname`.
- Primary: `Start opname`; active primary: `Stop en bewaar`; secondary: `Annuleer`.
- Status: `Opname loopt`; helper: `Audio wordt veilig opgeslagen zodra je stopt.`
- Consent: `Zorg dat iedereen weet dat je dit gesprek opneemt.`

## Data / IO

- Input: microfoonstream, titel/type/contextnotitie.
- Output: audio blob/recording draft state.
- Statussen: idle, requesting_permission, recording, stopping, stopped, cancelled, error.

## Waarom nu

- Dit is de eerste functionele slice van de v1 flow.

## In scope

- Voor-opnamescherm.
- Mic-permission en opname-start.
- Timer/status tijdens opname.
- Stop/bewaar.
- Annuleren met bestaande destructive confirm pattern.

## Buiten scope

- IndexedDB recovery.
- Private upload.
- Transcriptie.

## Oorspronkelijk plan / afgesproken scope

- Web recording MVP, max 60 minuten zichtbaar als guardrail.
- Audio-first, simpel en betrouwbaar.

## Expliciete user requirements / detailbehoud

- Copy kort en volgens Budio-stijl.
- Geen extra meeting-suite UI verzinnen.

## Status per requirement

- [ ] Voor-opnamescherm — status: niet gebouwd
- [ ] Start/stop opname — status: niet gebouwd
- [ ] Annuleren met confirm — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande audio/capture helpers en UI primitives lezen.
- [ ] Blok 2: recorder hook/helper + schermintegratie bouwen.
- [ ] Blok 3: lint/typecheck en browser-smoke.

## Concrete checklist

- [ ] Browser support/failure states bepalen.
- [ ] Recorder state implementeren.
- [ ] UI aansluiten.
- [ ] Stop/bewaar en annuleren valideren.

## Acceptance criteria

- [ ] Opname start na microfoontoegang.
- [ ] Timer/status werkt tijdens opname.
- [ ] Stop en bewaar levert audioresultaat op.
- [ ] Mic denied en unsupported browser hebben duidelijke UI.
- [ ] Annuleren vraagt bevestiging.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-web-route-en-ia`.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Web smoke voor start/stop.

## Reconciliation voor afronding

- Oorspronkelijk plan: opname start/stop MVP bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence
