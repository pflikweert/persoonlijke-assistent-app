---
id: task-admin-founder-meeting-capture-speaker-labels-en-mapping
title: Admin/founder meeting capture — speaker labels en mapping
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Voeg later eenvoudige speakerlabels en hernoembare speaker mapping toe aan Meeting Capture transcriptdetail."
tags: [meeting-capture, transcript, speakers]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-transcript-pipeline]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 12
---

# Admin/founder meeting capture — speaker labels en mapping

## Probleem / context

Lange gesprekken worden bruikbaarder wanneer sprekers herkenbaar zijn, maar een zware editor-UX past niet bij de eerste fase.

## Gewenste uitkomst

Transcriptdetail ondersteunt eenvoudige speakerlabels en hernoemen/mappen van sprekers zonder transcriptverlies.

## User outcome

Een admin kan sprekers in een transcript begrijpelijk labelen zonder zware editor.

## Functional slice

Eenvoudige speakerlabel mapping op transcriptdetail.

## Entry / exit

- Entry: transcript bestaat met speaker markers of segmenten.
- Exit: speakerlabels zijn aangepast en persistent.

## Happy flow

1. Admin opent transcriptdetail.
2. Admin ziet speakerlabels.
3. Admin hernoemt een speaker.
4. Transcript toont nieuwe labels.
5. Mapping blijft bewaard.

## Non-happy flows

- Geen transcript: speaker UI niet tonen.
- Save failure: toon fout en behoud lokale invoer.
- Onbekende speaker: fallback label `Spreker`.

## UX / copy

- Label: `Spreker`.
- Action: `Naam aanpassen`.
- Failure: `Naam opslaan mislukt.`

## Data / IO

- Input: transcript speakers/segments.
- Output: speaker mapping.
- Statussen: editing, saved, save_failed.

## Waarom nu

- P2 na transcript pipeline.

## In scope

- Basale speakerlabels.
- Speaker hernoemen.
- Mapping bewaren.

## Buiten scope

- Zware transcript-editor.
- Automatische diarization perfectie als harde eis.

## Oorspronkelijk plan / afgesproken scope

- Speakerlabels zijn nice-to-have na transcriptie.

## Expliciete user requirements / detailbehoud

- Geen zware editor-UX.

## Status per requirement

- [ ] Speaker labels/mapping — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: transcript data shape lezen.
- [ ] Blok 2: mapping UI/data bouwen.
- [ ] Blok 3: verify.

## Concrete checklist

- [ ] Labels tonen.
- [ ] Speaker hernoemen.
- [ ] Mapping persistent maken.

## Acceptance criteria

- [ ] Labels tonen op transcriptdetail.
- [ ] Hernoemen werkt persistent.
- [ ] Save failure is zichtbaar.

## Blockers / afhankelijkheden

- Depends on transcript pipeline.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: speaker labels toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
