---
id: task-admin-founder-meeting-capture-transcript-pipeline
title: Admin/founder meeting capture — transcript pipeline
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Voeg later queued transcriptie, retries en transcriptstatus toe zonder audio-opslag te blokkeren."
tags: [meeting-capture, transcript, processing, ai]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus, task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 11
---

# Admin/founder meeting capture — transcript pipeline

## Probleem / context

Transcriptie is waardevol, maar mag de audio-safe v1 niet blokkeren of audio-opslag fragiel maken.

## Gewenste uitkomst

Een opgeslagen recording kan queued/background worden getranscribeerd. Status, retry en failure zijn zichtbaar op detail. Audio blijft beschikbaar als transcriptie faalt.

## User outcome

Een admin kan transcriptie van een opgeslagen gesprek laten verwerken zonder risico op audioverlies.

## Functional slice

Queued transcript processing met status, retry en transcriptweergave.

## Entry / exit

- Entry: recording heeft opgeslagen audio.
- Exit: transcript is beschikbaar of failure is zichtbaar en retrybaar.

## Happy flow

1. Transcript job start na audio-upload of handmatige actie.
2. Status toont `Transcript wordt gemaakt`.
3. Segmenten/transcript worden verwerkt.
4. Detail toont transcript.
5. Audio blijft afspeelbaar.

## Non-happy flows

- Transcript failure: toon `Transcript mislukt. De audio is bewaard.`
- Retry: start verwerking opnieuw zonder nieuwe recording.
- Partial failure: eerdere audio/metadata blijven intact.
- Geen audio: transcriptactie disabled of verklaard.

## UX / copy

- Status: `Transcript wordt gemaakt`.
- Failure: `Transcript mislukt. De audio is bewaard.`
- Action: `Transcript opnieuw proberen`.

## Data / IO

- Input: stored audio/segments.
- Output: transcript text, processing status.
- Statussen: queued, processing, completed, failed.

## Waarom nu

- P2 na bewezen audio archive.

## In scope

- Queued transcriptstatus.
- Segmenttranscriptie of passende chunk-aanpak.
- Transcript stitching.
- Retry per recording of stap.

## Buiten scope

- Speaker mapping.
- Insights/samenvatting.
- Realtime transcriptie.

## Oorspronkelijk plan / afgesproken scope

- Transcriptie volgt na audio-safe v1.
- Processing is gescheiden van capture/upload.

## Expliciete user requirements / detailbehoud

- Transcript mislukt betekent niet dat audio mislukt.

## Status per requirement

- [ ] Transcript pipeline — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande OpenAI/server processing patronen lezen.
- [ ] Blok 2: pipeline en statusmodel bouwen.
- [ ] Blok 3: failure/retry testen.

## Concrete checklist

- [ ] Processing status toevoegen.
- [ ] Transcriptgeneratie aansluiten.
- [ ] Retry/failure states tonen.
- [ ] Detail transcript tonen.

## Acceptance criteria

- [ ] Transcriptstatus is zichtbaar.
- [ ] Transcript failure blokkeert audio niet.
- [ ] Retry werkt zonder duplicatie.

## Blockers / afhankelijkheden

- Depends on audio-safe archive.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Gerichte server/helper tests.

## Reconciliation voor afronding

- Oorspronkelijk plan: transcript pipeline toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
