---
id: task-admin-founder-meeting-capture-gespreksinzichten
title: Admin/founder meeting capture — gespreksinzichten
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Voeg later brongetrouwe gespreksinzichten toe: auto-title, samenvatting, kernpunten, besluiten, actiepunten, open vragen en onderwerpen."
tags: [meeting-capture, insights, summary, ai]
workstream: aiqs
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-transcript-pipeline]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 13
---

# Admin/founder meeting capture — gespreksinzichten

## Probleem / context

Lange gesprekken bevatten besluiten, actiepunten en productrichting. Die waarde moet later overzichtelijk worden gemaakt, maar alleen op basis van transcript/audio.

## Gewenste uitkomst

Detail toont brongetrouwe inzichten: auto-title, korte samenvatting, kernpunten, besluiten, actiepunten, open vragen en onderwerpen. Fouten in insights blokkeren transcript/audio niet.

## User outcome

Een admin kan snel besluiten, actiepunten en kernpunten uit een gesprek terugzien met behoud van audio/transcript als bron.

## Functional slice

Brongetrouwe insights processing en detailweergave bovenop transcript.

## Entry / exit

- Entry: recording heeft transcript.
- Exit: insights zijn zichtbaar of failure is geïsoleerd.

## Happy flow

1. Insights job start op transcript.
2. Status toont processing.
3. Output bevat titel, samenvatting, kernpunten, besluiten, actiepunten, open vragen en onderwerpen.
4. Detail toont insights aanvullend op audio/transcript.

## Non-happy flows

- Insight failure: transcript/audio blijven zichtbaar.
- Onvoldoende transcript: toon dat insights nog niet beschikbaar zijn.
- Retry: start insights opnieuw zonder transcriptverlies.

## UX / copy

- Section: `Inzichten`.
- Failure: `Inzichten maken mislukt. De audio en het transcript zijn bewaard.`
- Action: `Inzichten opnieuw proberen`.

## Data / IO

- Input: transcript.
- Output: structured insights.
- Statussen: queued, processing, completed, failed.

## Waarom nu

- P2 na transcript pipeline.

## In scope

- Prompt/output-contract voor inzichten.
- Status/failure isolation.
- Detailweergave voor inzichten.

## Buiten scope

- Medische interpretatie of advies.
- Volledige AIQS control plane verbouwen.

## Oorspronkelijk plan / afgesproken scope

- Insights zijn aanvullend, niet vervangend.
- Altijd terug kunnen naar audio en transcript.

## Expliciete user requirements / detailbehoud

- Strikt brongetrouw.
- Geen medische interpretatie.

## Status per requirement

- [ ] Gespreksinzichten — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: AIQS/content rules lezen.
- [ ] Blok 2: insights processing bouwen.
- [ ] Blok 3: brontrouw/failure tests.

## Concrete checklist

- [ ] Outputcontract bepalen.
- [ ] Processing aansluiten.
- [ ] Detail UI toevoegen.
- [ ] Failure isolation valideren.

## Acceptance criteria

- [ ] Insights zijn brongetrouw.
- [ ] Failure blokkeert audio/transcript niet.
- [ ] Geen medische interpretatie of advies.

## Blockers / afhankelijkheden

- Depends on transcript pipeline.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Gerichte AI/output tests.

## Reconciliation voor afronding

- Oorspronkelijk plan: gespreksinzichten toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
- `docs/project/content-processing-rules.md`
- `docs/project/ai-quality-studio.md`
