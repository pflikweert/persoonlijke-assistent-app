---
id: task-admin-founder-meeting-capture-audio-upload-import-flow
title: Admin/founder meeting capture — audio upload/import flow
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: Voeg later een flow toe waarmee een bestaand audiobestand in hetzelfde Meeting Capture archief kan landen.
tags: [meeting-capture, upload, import, audio]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus, task-admin-founder-meeting-capture-overzicht-detail-playback-download]
follows_after: [task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
task_kind: task
spec_ready: true
due_date: null
sort_order: 10
---



# Admin/founder meeting capture — audio upload/import flow

## Probleem / context

Niet elk belangrijk gesprek zal live in Budio worden opgenomen. De gebruiker wil ook bestaande audiobestanden kunnen uploaden.

## Gewenste uitkomst

Een admin kan een bestaand audiobestand uploaden naar hetzelfde Meeting Capture archief, met dezelfde metadata, uploadstatus, detailweergave en latere processingroute als live opgenomen audio.

## User outcome

Een admin kan een bestaande opname alsnog in het Meeting Capture archief plaatsen.

## Functional slice

Bestand-upload/import naar hetzelfde recording model als live audio.

## Entry / exit

- Entry: admin kiest `Audio uploaden` vanuit overview of new flow.
- Exit: audio staat in hetzelfde archief of upload is retrybaar mislukt.

## Happy flow

1. Admin kiest audiobestand.
2. Admin vult optionele titel/type/notitie in.
3. Upload gebruikt hetzelfde metadata/storage model.
4. Recording verschijnt in overzicht.
5. Detail gebruikt dezelfde playback/download UI.

## Non-happy flows

- Ongeldig bestandstype: toon rustige validatiefout.
- Te groot bestand: toon limiet/fout zonder crash.
- Upload failure: retry mogelijk, geen dubbele recording.
- Annuleren: geen recording aanmaken.

## UX / copy

- Action: `Audio uploaden`.
- Failure: `Upload mislukt. Probeer opnieuw.`
- Validation: `Kies een audiobestand.`

## Data / IO

- Input: local audio file en metadata.
- Output: recording metadata + private storage object.
- Statussen: selected, uploading, uploaded, upload_failed.

## Waarom nu

- Belangrijk genoeg om expliciet te plannen.
- Niet noodzakelijk voor audio-safe v1.

## In scope

- Bestand kiezen/uploaden.
- Metadata invullen.
- Zelfde archive/detail model gebruiken.
- Failure states en retry.

## Buiten scope

- Nieuwe aparte import-lane.
- Transcriptie of insights.

## Oorspronkelijk plan / afgesproken scope

- Upload/import hoort onder dezelfde epic, priority `p2`.

## Expliciete user requirements / detailbehoud

- Dit is nice to have maar moet wel een eigen taak krijgen.

## Status per requirement

- [ ] Upload/import flow — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande uploadpatronen lezen.
- [ ] Blok 2: importflow bouwen.
- [ ] Blok 3: verify/smoke.

## Concrete checklist

- [ ] File picker/upload.
- [ ] Metadata naar recording model.
- [ ] Detail/playback hergebruiken.
- [ ] Failure/retry tonen.

## Acceptance criteria

- [ ] Upload gebruikt hetzelfde archiefmodel.
- [ ] Detail/playback hergebruikt bestaande flow.
- [ ] Invalid/upload failure states zijn zichtbaar.

## Blockers / afhankelijkheden

- Depends on metadata/storage en overzicht/detail.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Web smoke upload/import.

## Reconciliation voor afronding

- Oorspronkelijk plan: bestaande audio upload/import toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence