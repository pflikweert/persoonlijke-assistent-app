---
id: task-admin-founder-meeting-capture-overzicht-detail-playback-download
title: Admin/founder meeting capture — overzicht/detail met playback en download
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Bouw het Meeting Capture archief met overzicht, detail, audio playback, download en eenvoudige statusblokken."
tags: [meeting-capture, ui, playback, archive]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus]
follows_after: [task-admin-founder-meeting-capture-lokale-failsafe-en-recovery]
task_kind: task
spec_ready: true
due_date: null
sort_order: 7
---



# Admin/founder meeting capture — overzicht/detail met playback en download

## Probleem / context

Een opgenomen gesprek moet terugvindbaar en controleerbaar zijn. Zonder archief/detail is upload niet zichtbaar waardevol.

## Gewenste uitkomst

Admin ziet een rustige lijst met recordings en kan een detail openen met audio playback, download, metadata en statusblokken. De UI voelt als familie van bestaande moment/dag-schermen.

## User outcome

Een admin kan opgeslagen gespreksopnames terugvinden, afspelen, downloaden en status begrijpen.

## Functional slice

Meeting Capture archive overview en detail met playback/download en statusblokken.

## Entry / exit

- Entry: admin opent Meeting Capture overview of detail.
- Exit: admin speelt audio af, downloadt audio of ziet duidelijke status/failure.

## Happy flow

1. Overview laadt recordings.
2. Admin ziet datum, titel, duur, type en uploadstatus.
3. Admin opent een recording.
4. Detail toont metadata en audio player.
5. Admin speelt audio af of kiest `Download audio`.

## Non-happy flows

- Empty archive: toon empty state met `Start opname`.
- Audio ontbreekt maar lokaal veilig: toon herstel/uploadstatus, geen playback.
- Download faalt: toon `Download mislukt. Probeer opnieuw.`
- Recording niet gevonden: toon not-found met terugactie.

## UX / copy

- Overview title: `Gespreksopnames`.
- Detail fallback title: `Gespreksopname`.
- Actions: `Start opname`, `Download audio`, `Upload opnieuw proberen`.
- Statuses: `Audio opgeslagen`, `Upload bezig`, `Upload mislukt`, `Lokaal veilig`.

## Data / IO

- Input: recording list/detail metadata en private audio URL/download endpoint.
- Output: rendered list/detail, playback request, download request.
- Statussen: loading, empty, ready, playback_unavailable, download_failed.

## Waarom nu

- Playback/download maakt de audio-safe v1 sluitend.

## In scope

- Overzichtslijst met datum, titel, duur, type en status.
- Detail met audio player.
- Downloadactie.
- Statusblokken voor lokaal veilig/upload bezig/upload mislukt/bewaard.

## Buiten scope

- Transcript editor.
- Insights UI.
- Exportpakket.

## Oorspronkelijk plan / afgesproken scope

- Zelfde rustige layouttaal als bestaande moment/dag-schermen.
- Audio/detail is leidend; latere verwerking aanvullend.

## Expliciete user requirements / detailbehoud

- Geen dashboardisering of meeting-suite look.
- Copy simpel en geruststellend.

## Status per requirement

- [ ] Overzicht — status: niet gebouwd
- [ ] Detail — status: niet gebouwd
- [ ] Playback/download — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande moment/detail/audio playback patronen lezen.
- [ ] Blok 2: overzicht/detail/playback bouwen.
- [ ] Blok 3: runtime smoke light/dark en lint/typecheck.

## Concrete checklist

- [ ] Recording list aansluiten.
- [ ] Detail metadata tonen.
- [ ] Audio player aansluiten.
- [ ] Downloadactie toevoegen.
- [ ] Failure/empty states tonen.

## Acceptance criteria

- [ ] Overview toont recordings en empty state.
- [ ] Detail toont metadata en audio player.
- [ ] Downloadactie werkt of faalt zichtbaar.
- [ ] Upload/local statuses zijn begrijpelijk.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus`.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Light/dark web smoke voor list/detail/playback.

## Reconciliation voor afronding

- Oorspronkelijk plan: overzicht/detail/playback/download bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence