---
id: task-admin-founder-meeting-capture-retentie-export-hardening
title: Admin/founder meeting capture — retentie en export hardening
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Werk later keep-audio policy, retentievoorbereiding, cleanup en robuuste export/download voor Meeting Capture uit."
tags: [meeting-capture, retention, export, privacy]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-overzicht-detail-playback-download]
follows_after: [task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
task_kind: task
spec_ready: true
due_date: null
sort_order: 15
---


# Admin/founder meeting capture — retentie en export hardening

## Probleem / context

Lange audio-opnames vragen later expliciet beleid rond bewaren, verwijderen, export en cleanup.

## Gewenste uitkomst

Meeting Capture heeft een heldere keep-audio/retentievoorbereiding en robuuste download/export flow, zonder de eerste audio-safe v1 te vertragen.

## User outcome

Een admin begrijpt hoe audio bewaard/exporteerbaar blijft en welke cleanup/retentie later geldt.

## Functional slice

Retentievoorbereiding en export/download hardening voor opgeslagen recordings.

## Entry / exit

- Entry: recordings bestaan met playback/download.
- Exit: keep-audio/retentie/exportgedrag is expliciet en robuuster.

## Happy flow

1. Admin opent detail.
2. Audio heeft duidelijke bewaarbeleid/status.
3. Admin downloadt/exporteert audio betrouwbaar.
4. Cleanup/retentievelden zijn voorbereid.

## Non-happy flows

- Download expired/denied: toon fout en retry.
- Audio verwijderd: toon status zonder kapotte player.
- Export faalt: geen data verwijderen.

## UX / copy

- Status: `Audio bewaard`.
- Action: `Download audio`.
- Failure: `Download mislukt. Probeer opnieuw.`

## Data / IO

- Input: stored recording/audio.
- Output: retention metadata and hardened download/export path.
- Statussen: retained, deleted, export_failed.

## Waarom nu

- Belangrijk voor privacy en productisering, maar niet v1-blokkerend.

## In scope

- Keep-audio policy voorbereiden.
- Retentievelden/cleanup richting.
- Download/export hardening.

## Buiten scope

- Volledige compliance-suite.
- Team sharing.

## Oorspronkelijk plan / afgesproken scope

- Retentie en export hardening later, na bewezen MVP.

## Expliciete user requirements / detailbehoud

- Retentie/export krijgt een eigen taak onder dezelfde epic.

## Status per requirement

- [ ] Retentie/export hardening — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: privacy/audio settings patronen lezen.
- [ ] Blok 2: retentie/export richting implementeren.
- [ ] Blok 3: verify.

## Concrete checklist

- [ ] Keep-audio policy uitwerken.
- [ ] Cleanup/retentie voorbereiden.
- [ ] Export/download hardening valideren.

## Acceptance criteria

- [ ] Retentiegedrag is expliciet.
- [ ] Download/export faalt zichtbaar en veilig.
- [ ] Geen audioverlies door exportfailure.

## Blockers / afhankelijkheden

- Depends on overview/detail/playback/download.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: retentie/export hardening later uitwerken.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks