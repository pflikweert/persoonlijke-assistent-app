---
id: task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs
title: Admin/founder meeting capture — fase 1 tests en smokebewijs
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Rond fase 1 af met gerichte tests en runtime-smokebewijs voor opnemen, recovery, upload, playback en download."
tags: [meeting-capture, tests, smoke, quality]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-web-route-en-ia, task-admin-founder-meeting-capture-opname-start-stop-web-mvp, task-admin-founder-meeting-capture-lokale-failsafe-en-recovery, task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus, task-admin-founder-meeting-capture-overzicht-detail-playback-download]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 8
---



# Admin/founder meeting capture — fase 1 tests en smokebewijs

## Probleem / context

Fase 1 raakt browser recording, lokale opslag, private upload en UI. Lint/typecheck alleen is onvoldoende bewijs voor deze interactieve flow.

## Gewenste uitkomst

Er ligt bewijs dat de audio-safe v1 werkt: opname starten/stoppen, reload recovery, upload/retry, overzicht/detail, playback/download en admin-only gating.

## User outcome

Het team kan met bewijs zeggen dat Meeting Capture fase 1 betrouwbaar genoeg is om verder op te bouwen.

## Functional slice

Afsluitende test- en smoke-slice voor de volledige audio-safe v1.

## Entry / exit

- Entry: P1 bouwtaken zijn gebouwd.
- Exit: bewijs staat in taskfile en failures zijn opgelost of expliciet blocked.

## Happy flow

1. Draai lint/typecheck.
2. Draai unit/helper tests voor recorder/recovery/storage.
3. Smoke admin-only routing.
4. Smoke opname start/stop.
5. Smoke reload recovery.
6. Smoke upload, playback en download.
7. Check light/dark UI.

## Non-happy flows

- Test faalt: fix binnen dezelfde flow als regressie relevant is.
- Runtime smoke niet mogelijk: leg exact vast waarom en welk handmatig commando nodig is.
- Audioverlies-scenario faalt: fase 1 blijft niet klaar.

## UX / copy

- Verifieer verplichte copy uit epic-flowcontract in UI.
- Geen nieuwe copy introduceren zonder taskfile-update.

## Data / IO

- Input: lokale dev-server op standaard target indien beschikbaar, testdata/recording mocks.
- Output: testresultaten, smoke-notities en bewijs in taskfile.
- Geen productie-data.

## Waarom nu

- Fase 1 mag pas als klaar gelden met runtimebewijs.

## In scope

- Unit/integratietests voor complexe helpers.
- Lint/typecheck.
- Web smoke voor kernscenario's.
- Light/dark runtime-check voor geraakte UI.

## Buiten scope

- Volledige E2E suite voor P2 transcript/insights.
- Productie-monitoring.

## Oorspronkelijk plan / afgesproken scope

- Nieuwe complexe helpermodules mikken op minimaal 80% coverage.
- Interactieve UI vereist runtime/smoke-check.

## Expliciete user requirements / detailbehoud

- Task is pas klaar wanneer het werkt, niet alleen wanneer files bestaan.
- Bestaande flow mag niet regressief geraakt zijn.

## Status per requirement

- [ ] Helper-tests — status: niet gebouwd
- [ ] Runtime smoke — status: niet gebouwd
- [ ] Light/dark check — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: testbare helpers en smoke-scenario's inventariseren.
- [ ] Blok 2: tests/smoke uitvoeren en fixes binnen flow oplossen.
- [ ] Blok 3: evidence vastleggen en phase-1 reconciliation doen.

## Concrete checklist

- [ ] Admin ziet ingang, niet-admin niet.
- [ ] Opname start/stop werkt.
- [ ] Chunks worden lokaal bewaard.
- [ ] Reload recovery werkt.
- [ ] Upload failure veroorzaakt geen audioverlies.
- [ ] Detail toont playback en download.

## Acceptance criteria

- [ ] Admin-only toegang bewezen.
- [ ] Start/stop opname bewezen.
- [ ] Reload recovery bewezen.
- [ ] Upload failure veroorzaakt geen audioverlies.
- [ ] Playback/download bewezen.
- [ ] Light/dark UI-check uitgevoerd of expliciet blocked met reden.

## Blockers / afhankelijkheden

- Depends on alle P1 bouwtaken voor fase 1.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Gerichte tests.
- Web smoke light/dark.

## Reconciliation voor afronding

- Oorspronkelijk plan: fase 1 bewijzen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence
