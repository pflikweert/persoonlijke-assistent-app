---
id: task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus
title: "Admin/founder meeting capture — metadata, private storage en uploadstatus"
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Voeg minimale DB/storage-fundering toe voor recordings, private audio upload, idempotente retry en uploadstatus los van latere processing."
tags: [meeting-capture, supabase, storage, database]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen]
follows_after: [task-admin-founder-meeting-capture-lokale-failsafe-en-recovery]
task_kind: task
spec_ready: true
due_date: null
sort_order: 6
---



# Admin/founder meeting capture — metadata, private storage en uploadstatus

## Probleem / context

Meeting Capture heeft eigen metadata en private audio-opslag nodig. Upload mag niet gelijk worden aan transcriptie of samenvatting; audio-opslag is de v1-succesdefinitie.

## Gewenste uitkomst

Er is een minimale DB/storage-fundering voor recordings en uploadstatus. Upload/retry is idempotent genoeg om dubbele recordings te voorkomen. Uploadstatus staat los van transcript- of insightstatus.

## User outcome

Een admin kan erop vertrouwen dat bewaarde audio private wordt opgeslagen en dat uploadstatus losstaat van latere AI-verwerking.

## Functional slice

Minimale Supabase metadata/storage/uploadstatus voor Meeting Capture recordings.

## Entry / exit

- Entry: lokaal veilige recording of audio blob staat klaar voor upload.
- Exit: recording metadata en private audio-object bestaan, of upload failure is retrybaar zonder duplicatie.

## Happy flow

1. Uploadflow ontvangt recording draft en lokale audio/chunks.
2. Metadatarecord wordt aangemaakt of hergebruikt.
3. Audio uploadt naar private storagepad.
4. Uploadstatus wordt `uploaded`.
5. Detail/overview kan metadata en audio-url ophalen.

## Non-happy flows

- Netwerkfout: status `upload_failed`, lokale audio blijft veilig.
- Retry: hergebruikt bestaande recording/upload target en maakt geen dubbele recording.
- RLS/storage denial: duidelijke admin-only fout, geen stille success.
- Partial upload: status blijft retrybaar.

## UX / copy

- Uploading: `Audio wordt opgeslagen`.
- Local safe during failure: `De audio staat nog lokaal veilig.`
- Failure: `Upload mislukt. Probeer opnieuw.`
- Success: `Audio opgeslagen.`

## Data / IO

- Input: recording metadata, local blob/chunks, authenticated admin user.
- Output: DB recording row, storage object, uploadstatus.
- Statussen: pending_upload, uploading, uploaded, upload_failed.

## Waarom nu

- Playback/detail en latere transcriptie kunnen pas betrouwbaar op een opgeslagen recording bouwen.

## In scope

- Minimale Supabase schema/storage aanpak.
- Private bucket/padstrategie.
- Uploadstatus en failure states.
- Retry zonder duplicatie.

## Buiten scope

- Transcriptstatus volledig implementeren.
- Retentiebeleid.
- Exportpakket.

## Oorspronkelijk plan / afgesproken scope

- Nieuwe DB/storage-structuur apart voor conversation recordings.
- Niet de bestaande dagboek `source_type` oprekken als hoofdroute.

## Expliciete user requirements / detailbehoud

- Upload en processing blijven expliciet ontkoppeld.
- Audio bewaard betekent v1-succes, ook als transcript later faalt.

## Status per requirement

- [ ] Metadata model — status: niet gebouwd
- [ ] Private storage upload — status: niet gebouwd
- [ ] Uploadstatus/retry — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande Supabase/audio storage patronen lezen.
- [ ] Blok 2: migratie/service/RLS/storage implementeren.
- [ ] Blok 3: lokale DB-stap, lint/typecheck en gerichte tests.

## Concrete checklist

- [ ] Schema en storage pad bepalen.
- [ ] Migration toevoegen.
- [ ] Service/helpers toevoegen.
- [ ] Upload/retry states aansluiten.
- [ ] Lokale DB push/reset uitvoeren indien nodig.

## Acceptance criteria

- [ ] Metadata en private storagepad zijn gedefinieerd.
- [ ] Uploadstatus staat los van transcriptstatus.
- [ ] Retry maakt geen dubbele recording.
- [ ] Upload failure behoudt lokale audio/recovery.

## Blockers / afhankelijkheden

- Depends on scope-task; follows after local failsafe voor volledige v1-flow.

## Verify / bewijs

- `npx supabase db push --local` of passende lokale DB-stap bij migration.
- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: metadata/private storage/uploadstatus bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence