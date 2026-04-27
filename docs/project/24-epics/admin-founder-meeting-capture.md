---
id: epic-admin-founder-meeting-capture
title: Admin/founder meeting capture
status: backlog
priority: p1
owner: Pieter Flikweert
phase: transitiemaand-consumer-beta
updated_at: 2026-04-27
summary: "Aparte admin/founder lane voor lange overlegopnames buiten de dagboekflow, met audio-safe web recording als eerste versie en transcript/insights als vervolgfase."
spec_ready: true
sort_order: 2
---

# Admin/founder meeting capture

## Doel

Een aparte admin/founder recording-lane bouwen voor lange gesprekken, los van de bestaande dagboekcapture. De eerste waarde is audio betrouwbaar opnemen, lokaal veiligstellen, uploaden, terugvinden, afspelen en downloaden.

## Gewenste uitkomst

De eerste versie werkt als audio-safe web MVP: een admin kan een gesprek opnemen, browser- of netwerkproblemen overleven via lokale recovery, de opname uploaden naar private storage en de opname terugvinden in een rustig overzicht/detail met playback en download.

Transcriptie, speakerlabels, gespreksinzichten, upload/import van bestaande audio en retentiebeleid zijn eigen vervolg-taken binnen dezelfde epic.

## Scope en grenzen

- Wel: admin-only, audio-first, web recording, local-first recovery, private upload, overview/detail/playback/download.
- Wel: alle P2-extra's als eigen taken onder dezelfde epic, met priority `p2`.
- Niet: bestaande dagboekcapture functioneel aanpassen.
- Niet: live assistant, meeting bot, calendar-integratie, team sharing of publieke Pro UI.

## P1 / P2 scheiding

- P1: scope en eerste versie, web route/IA, opname start/stop, lokale failsafe/recovery, metadata/private storage/uploadstatus, overzicht/detail/playback/download en fase-1 smokebewijs.
- P2: audio upload/import, transcript pipeline, speaker labels, gespreksinzichten, admin processing controls en retentie/export hardening.
- P2 mag nooit audio-safe v1 blokkeren.

## UX / copy contract

- Gebruik bestaande capture-, moment-, dag-, selectie-, header- en footerpatronen als visuele familie.
- Geen dashboardisering, meeting-suite look, live assistant UI of brede Pro/Business taal.
- Copy blijft kort en geruststellend: `Gespreksopname`, `Start opname`, `Stop en bewaar`, `Audio wordt veilig opgeslagen`, `Upload opnieuw proberen`, `Transcript mislukt. De audio is bewaard.`
- Consentcopy blijft sober: `Zorg dat iedereen weet dat je dit gesprek opneemt.`

## Flow contract

- Happy flow: admin opent Meeting Capture, start opname, stopt en bewaart, audio wordt lokaal veiliggesteld, upload voltooit, recording verschijnt in overzicht, detail speelt audio af en download werkt.
- Non-happy flows: mic-permission geweigerd, browser unsupported, reload/crash met lokale recovery, upload failure met lokaal veilige audio, annuleren/verwijderen met confirm.
- Empty state: archief toont rustige uitleg en primaire actie `Start opname`.
- Recovery/retry/cancel: recovery toont `Upload opname` en `Verwijder lokale opname`; upload failure toont retry zonder audioverlies.

## Linked tasks

- `docs/project/25-tasks/done/admin-founder-meeting-capture-epic-en-taakpakket-aanmaken.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-web-route-en-ia.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-opname-start-stop-web-mvp.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-lokale-failsafe-en-recovery.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-overzicht-detail-playback-download.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-fase-1-tests-en-smokebewijs.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-workflow-retro-en-docs-skill-update.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-audio-upload-import-flow.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-transcript-pipeline.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-speaker-labels-en-mapping.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-gespreksinzichten.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-admin-processing-controls.md`
- `docs/project/25-tasks/open/admin-founder-meeting-capture-retentie-export-hardening.md`

## Volgorde van uitvoeren

1. Epic + taakpakket aanmaken.
2. Scope en eerste versie vastleggen.
3. Web route en IA.
4. Opname start/stop web MVP.
5. Lokale failsafe en recovery.
6. Metadata, private storage en uploadstatus.
7. Overzicht/detail met playback en download.
8. Fase 1 tests en smokebewijs.
9. Workflow-retro en docs/skill update.
10. P2 taken pas na bewezen audio-safe v1.

## Dependencies

- `task-admin-founder-meeting-capture-web-route-en-ia` depends on `task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen`.
- `task-admin-founder-meeting-capture-opname-start-stop-web-mvp` depends on route/IA.
- `task-admin-founder-meeting-capture-lokale-failsafe-en-recovery` depends on start/stop recording.
- `task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus` follows after scope and blocks playback/detail.
- `task-admin-founder-meeting-capture-overzicht-detail-playback-download` depends on metadata/storage.
- P2 transcript/insight taken depend on audio-safe archive.

## Acceptatie

- De Budio Workspace plugin toont deze epic met alle child tasks.
- P1 en P2 taken zijn duidelijk gescheiden via priority.
- Dependencies maken zichtbaar welke taken blocked of ready zijn.
- Een agent kan morgen één functionele slice oppakken zonder opnieuw scope te moeten reconstrueren.

## Relevante links

- `docs/project/40-ideas/10-product/admin-founder-meeting-capture.md`
- `/Users/pieterflikweert/Downloads/Meeting Capture 1.md`
- `/Users/pieterflikweert/Downloads/Meeting Capture 2.md`
