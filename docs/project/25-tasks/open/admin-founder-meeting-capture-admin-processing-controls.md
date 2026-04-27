---
id: task-admin-founder-meeting-capture-admin-processing-controls
title: Admin/founder meeting capture — admin processing controls
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Voeg later minimale admin controls toe voor retry/rerun van upload, transcript en summary processing."
tags: [meeting-capture, admin, processing, retry]
workstream: aiqs
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-transcript-pipeline]
follows_after: [task-admin-founder-meeting-capture-gespreksinzichten]
task_kind: task
spec_ready: true
due_date: null
sort_order: 14
---



# Admin/founder meeting capture — admin processing controls

## Probleem / context

Processing kan falen of later opnieuw nodig zijn. Admin heeft minimale controls nodig, maar geen brede admin-suite.

## Gewenste uitkomst

Admin kan upload/transcript/summary processing veilig retryen of rerunnen met duidelijke status en failure feedback.

## User outcome

Een admin kan mislukte of verouderde processing opnieuw starten zonder handmatig data te repareren.

## Functional slice

Minimale admin retry/rerun controls voor Meeting Capture processing.

## Entry / exit

- Entry: detail toont upload/transcript/summary status.
- Exit: retry/rerun is gestart of fout is zichtbaar.

## Happy flow

1. Admin opent detail met failed processing.
2. Admin kiest retry/rerun.
3. Status gaat naar queued/processing.
4. Resultaat wordt bijgewerkt.

## Non-happy flows

- Geen admin: controls verborgen.
- Retry faalt: status blijft failed met foutmelding.
- Processing loopt al: actie disabled.

## UX / copy

- Actions: `Opnieuw proberen`, `Samenvatting opnieuw maken`.
- Status: `Wordt verwerkt`.
- Failure: `Opnieuw proberen mislukt.`

## Data / IO

- Input: recording id en processing type.
- Output: nieuwe processing job/status.
- Statussen: idle, queued, processing, failed.

## Waarom nu

- P2 na transcript/insights.

## In scope

- Retry/rerun controls.
- Statusfeedback.
- Guardrails voor admin-only.

## Buiten scope

- Brede AIQS-verbouwing.
- Niet-admin controls.

## Oorspronkelijk plan / afgesproken scope

- Minimale admin controls, geen zware workflow.

## Expliciete user requirements / detailbehoud

- Alleen noodzakelijke controls.

## Status per requirement

- [ ] Admin processing controls — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: processing statusmodel lezen.
- [ ] Blok 2: controls bouwen.
- [ ] Blok 3: retry/rerun verify.

## Concrete checklist

- [ ] Retry transcript.
- [ ] Retry summary.
- [ ] Status/failure feedback.

## Acceptance criteria

- [ ] Alleen admin ziet controls.
- [ ] Retry/rerun start juiste processing.
- [ ] Running/failed states zijn duidelijk.

## Blockers / afhankelijkheden

- Depends on transcript pipeline; follows after insights.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: admin processing controls toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence