---
id: task-admin-founder-meeting-capture-lokale-failsafe-en-recovery
title: Admin/founder meeting capture — lokale failsafe en recovery
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Voeg MediaRecorder chunking, IndexedDB local-first opslag en recovery na reload/crash toe zodat audioverlies wordt voorkomen."
tags: [meeting-capture, indexeddb, recovery, audio]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-opname-start-stop-web-mvp]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 5
---

# Admin/founder meeting capture — lokale failsafe en recovery

## Probleem / context

Lange browseropnames zijn kwetsbaar voor reloads, crashes en netwerkproblemen. Audioverlies is de grootste v1-risico.

## Gewenste uitkomst

Opnamechunks worden tijdens recording lokaal veiliggesteld in IndexedDB. Na reload/crash kan de gebruiker een onafgemaakte opname terugvinden en kiezen voor uploaden/herstellen of verwijderen.

## User outcome

Een admin verliest een lange opname niet door reload, crash of tijdelijk netwerkprobleem.

## Functional slice

Local-first chunkopslag en recovery UI voor onafgemaakte Meeting Capture opnames.

## Entry / exit

- Entry: actieve recorder schrijft chunks tijdens opname.
- Exit: chunks zijn lokaal herstelbaar, geüpload in vervolgflow of bewust verwijderd.

## Happy flow

1. Recorder produceert korte audiochunks.
2. Elke chunk wordt met metadata in IndexedDB opgeslagen.
3. Bij stop worden chunks samengevoegd of klaar gezet voor upload.
4. Bij nieuwe sessie detecteert de app onafgemaakte lokale opname.
5. Admin kiest `Upload opname` of `Verwijder lokale opname`.

## Non-happy flows

- Reload/crash: recovery state verschijnt bij terugkomst.
- IndexedDB unavailable/quota: toon fout dat lokale veilige opslag niet beschikbaar is.
- Chunk write faalt: opname stopt veilig met foutmelding, geen stille success.
- Verwijderen: destructive confirm voordat lokale chunks weg zijn.

## UX / copy

- Recovery title: `Niet-geüploade opname gevonden`.
- Recovery body: `De audio staat nog lokaal op dit apparaat.`
- Actions: `Upload opname`, `Verwijder lokale opname`.
- Failure: `Lokaal bewaren lukt niet. Stop de opname en probeer opnieuw.`

## Data / IO

- Input: MediaRecorder chunks en recording draft metadata.
- Output: IndexedDB records per chunk en recovery manifest.
- Statussen: local_saving, local_safe, recovery_available, local_delete_pending, local_error.

## Waarom nu

- V1 is pas bruikbaar als opnameverlies actief wordt beperkt.

## In scope

- `MediaRecorder` chunking met korte slices.
- IndexedDB opslag per chunk.
- Recovery-detectie.
- Recovery UI met herstellen/uploaden of verwijderen.

## Buiten scope

- Private Supabase upload implementeren.
- Transcriptie.
- Native background recording.

## Oorspronkelijk plan / afgesproken scope

- Audioverlies mag niet optreden door transcript- of uploadfouten.
- Local-first recovery is kern van v1.

## Expliciete user requirements / detailbehoud

- Houd het simpel en functioneel.
- Geen nieuwe visuele patronen voor recovery als bestaande status/sheet patronen voldoen.

## Status per requirement

- [ ] Chunking — status: niet gebouwd
- [ ] IndexedDB opslag — status: niet gebouwd
- [ ] Recovery UI — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande storage/offline patronen lezen.
- [ ] Blok 2: IndexedDB helper + recorder koppeling bouwen.
- [ ] Blok 3: recovery scenario's testen.

## Concrete checklist

- [ ] Chunk metadata bepalen.
- [ ] IndexedDB helper unit-testbaar maken.
- [ ] Recovery detectie toevoegen.
- [ ] Recovery UI aansluiten.
- [ ] Reload/crash smoke uitvoeren.

## Acceptance criteria

- [ ] Chunks worden tijdens opname lokaal geschreven.
- [ ] Reload detecteert onafgemaakte opname.
- [ ] Admin kan upload/herstel vervolgen.
- [ ] Admin kan lokale opname bewust verwijderen.
- [ ] Schrijffout wordt zichtbaar en niet als succes behandeld.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-opname-start-stop-web-mvp`.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Unit-tests voor helperlogica waar toegevoegd.
- Web smoke voor reload recovery.

## Reconciliation voor afronding

- Oorspronkelijk plan: lokale failsafe en recovery bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
