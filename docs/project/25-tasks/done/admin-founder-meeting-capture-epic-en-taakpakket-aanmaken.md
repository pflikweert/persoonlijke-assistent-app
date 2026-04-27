---
id: task-admin-founder-meeting-capture-epic-en-taakpakket-aanmaken
title: Admin/founder meeting capture — epic en taakpakket aanmaken
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Maak de Meeting Capture epic, idea-doc en volledige P1/P2 taskbundel aan als eerste praktijktest van de nieuwe Budio Workspace hierarchy-laag."
tags: [meeting-capture, admin, audio, workspace, hierarchy]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---



# Admin/founder meeting capture — epic en taakpakket aanmaken

## Probleem / context

Meeting Capture is inhoudelijk klaar om als project opgepakt te worden, maar staat nog niet als epic met concrete child tasks in de repo. Daardoor kan de nieuwe hierarchy-laag nog niet als praktijkworkflow getest worden.

## Gewenste uitkomst

Er staat één idea-doc, één epic-doc en een volledig P1/P2 taakpakket voor Meeting Capture. De plugin kan deze epic als bundel tonen, met dependencies en duidelijke volgorde.

## User outcome

Een developer of agent ziet Meeting Capture als epic met linked P1/P2 taken en kan de eerste bouwtask kiezen.

## Functional slice

Operationele projectsetup: idea-doc, epic-doc, taskbundle, dependencies en verify.

## Entry / exit

- Entry: Meeting Capture research staat buiten de repo in losse markdownbronnen.
- Exit: Meeting Capture bestaat als repo-epic met concrete child tasks.

## Happy flow

1. Agent maakt idea-doc aan.
2. Agent maakt epic-doc aan.
3. Agent maakt P1 en P2 taskfiles aan.
4. Agent koppelt alle taskfiles via `epic_id`.
5. Agent draait taskflow en docs bundle verify.

## Non-happy flows

- Geen bestaande taskmatch: maak nieuwe projectsetup-task aan.
- Verify faalt: herstel taskflow/docs voordat setup done gaat.
- Extra runtimewerk ontstaat: maak aparte bouwtask, niet in deze setup-task.

## UX / copy

- Geen runtime UI.
- Projecttaal blijft `Admin/founder meeting capture` en `Gespreksopname`.

## Data / IO

- Input: researchbronnen en gebruikersplan.
- Output: markdown idea/epic/taskdocs.
- Geen app runtime data.

## Waarom nu

- De workspace hierarchy is net opgeleverd en heeft een echte projecttest nodig.
- Meeting Capture is groot genoeg voor epic/task/subtask-dependency structuur.
- Morgen moet uitvoering kunnen starten zonder opnieuw te plannen.

## In scope

- Idea-doc aanmaken.
- Epic-doc aanmaken.
- Alle P1 en P2 taskfiles aanmaken met `epic_id`.
- Dependencies, priority en volgorde vastleggen.
- Verify draaien voor taskflow en docs bundle.

## Buiten scope

- Runtime Meeting Capture bouwen.
- DB migrations of app-code aanpassen.
- Workflowdocs inhoudelijk herschrijven zonder bewezen frictie.

## Oorspronkelijk plan / afgesproken scope

- Start Meeting Capture als eerste praktijktest van de nieuwe `Epic -> Task -> Subtask/dependency` workspace-laag.
- Maak één epic onder `docs/project/24-epics/**` en meerdere taskfiles onder `docs/project/25-tasks/open/**`.
- Taken starten `backlog`; alleen deze actieve projectsetup-taak staat op `in_progress`.
- Workflowverbeteringen komen alleen op basis van echte frictie tijdens uitvoering.

## Expliciete user requirements / detailbehoud

- Alle P1 bouwtaken moeten een eigen task krijgen.
- Alle nice-to-have onderdelen krijgen ook een eigen task onder dezelfde epic.
- Upload/import van bestaand audiobestand moet expliciet als P2 taak mee.
- Bestaande captureflow niet functioneel aanpassen.
- Layout/copy moet aansluiten op bestaande capture-, moment-, dag-, selectie-, header- en footerpatronen.
- OpenAI Codex/PLANS/skills learnings tijdens uitvoering bewaken en alleen bewezen verbeteringen verwerken.

## Status per requirement

- [x] Epic-doc aangemaakt — status: gebouwd
- [x] Idea-doc aangemaakt — status: gebouwd
- [x] P1 taskfiles aangemaakt — status: gebouwd
- [x] P2 taskfiles aangemaakt — status: gebouwd
- [x] Dependencies en volgorde vastgelegd — status: gebouwd
- [x] Verify afgerond — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: epic, idea-doc en taskfiles aanmaken.
- [x] Blok 3: docs bundle verify draaien en afronden.

## Concrete checklist

- [x] Meeting Capture idea-doc toevoegen.
- [x] Meeting Capture epic-doc toevoegen.
- [x] P1 taken toevoegen.
- [x] P2 nice-to-have taken toevoegen.
- [x] Dependencies en `epic_id` metadata invullen.
- [x] `npm run taskflow:verify`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`

## Acceptance criteria

- [x] Epic-doc bestaat.
- [x] P1/P2 taskfiles bestaan en linken naar dezelfde epic.
- [x] Verify is groen.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: Meeting Capture als epic + taskbundel vastleggen en daarmee de nieuwe hierarchy-flow testen.
- Toegevoegde verbeteringen: geen.
- Afgerond: idea-doc, epic-doc, P1/P2 taskfiles, dependencies, taskflow verify en docs bundle verify zijn afgerond.
- Open / blocked: geen binnen deze setup-taak; daadwerkelijke bouw start in de volgende P1 task.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
- `docs/project/40-ideas/10-product/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence