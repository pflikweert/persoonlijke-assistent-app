---
id: task-budio-workspace-task-detail-rechterpaneel-scroll-fix
title: Budio Workspace task detail rechterpaneel en scroll fix
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: "Fix de Budio Workspace plugin zodat task detail in board en list rechts als scrollbaar pane opent, zonder fullscreen detail te breken."
tags: [plugin, vscode, board, list, detail-pane]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 26
---




## Probleem / context

In de VS Code workspace-plugin opent task detail momenteel visueel niet goed: het pane verschijnt onder/over de boardcontent in plaats van als rechter detailpane. Daardoor is de detailvorm slecht bruikbaar en wordt content op hoogte afgekapt.

## Gewenste uitkomst

Board- en list-view tonen task detail rechts naast de hoofdlijst/board wanneer er voldoende breedte is. Het detailpane is zelfstandig scrollbaar, zodat de volledige taskmetadata, checklist en body preview bereikbaar blijven. De bestaande fullscreen-knop blijft hetzelfde gedrag houden.

## User outcome

De gebruiker kan vanuit board en list een taak selecteren en direct rechts het volledige detail lezen/bewerken, zonder dat het pane de onderkant van het scherm blokkeert of content onbereikbaar maakt.

## Functional slice

Een gerichte layout-regressiefix voor de bestaande task-detail surface in de VS Code plugin.

## Entry / exit

- Entry: gebruiker opent Budio Workspace Board of List en selecteert een taak.
- Exit: detail staat rechts, is scrollbaar en kan fullscreen geopend/gesloten worden.

## Happy flow

1. Gebruiker opent Board en klikt een task card.
2. Task detail opent rechts als split-pane en de boardcontent blijft links bruikbaar.
3. Gebruiker scrollt door het detailpane en gebruikt fullscreen; fullscreen opent en sluit zonder layoutbreuk.
4. Gebruiker opent List en selecteert een taak met hetzelfde rechterpaneelgedrag.

## Non-happy flows

- Empty state: zonder geselecteerde task blijft detail verborgen of toont bestaande lege detailtekst.
- Permission denied / unavailable: niet van toepassing.
- Validation / unsupported state: op small viewport mag het bestaande overlaygedrag blijven gelden.
- Failure / retry / cancel: sluiten en fullscreen togglen blijven bestaande controls gebruiken.

## UX / copy

- Geen nieuwe copy nodig behalve bestaande detail-controls.
- Bestaande board/list workflows blijven functioneel onveranderd.
- Geen redesign; alleen layout/scrollbaarheid herstellen.

## Data / IO

- Input: bestaande board snapshot en selectedTask state.
- Output: gecorrigeerde webview-layout.
- Opslag/API/service/file-impact: geen datamodel- of host-wijziging verwacht.
- Statussen: bestaande selected/detail/fullscreen state blijft leidend.

## Waarom nu

De task detail is een kerninteractie van de workspace-plugin; als die niet rechts en scrollbaar opent, zijn board en list praktisch niet goed bruikbaar.

## In scope

- Board task detail rechts als split-pane op desktop.
- List task detail rechts als split-pane op desktop.
- Detailpane zelfstandig scrollbaar maken.
- Fullscreen detailknop behouden en regressiechecken.
- Gerichte plugin verify en apply uitvoeren.

## Buiten scope

- Nieuwe task-detail functionaliteit.
- Board/list workflowwijzigingen.
- Jarvis of andere plugin views aanpassen.
- Brede visual redesign.

## Oorspronkelijk plan / afgesproken scope

- Fix task detail zodat deze rechts getoond wordt en scrollbaar is in board en list view.
- Fullscreen button moet blijven werken.

## Expliciete user requirements / detailbehoud

- "Zoals je ziet wordt de task detail nog niet goed geopend"
- "deze moet dus rechts getoond worden"
- "en scrollbaar zijn"
- "fix dit in board en list view"
- "Fullscreen button moet ook blijven werken"

## Status per requirement

- [x] Detail opent rechts in board — status: gebouwd
- [x] Detail opent rechts in list — status: gebouwd
- [x] Detailpane is scrollbaar — status: gebouwd
- [x] Fullscreen button blijft werken — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Grid-layout expliciet gemaakt als `main | resize handle | detail`, zodat de resize-handle niet langer de detailkolom verdringt.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: detail-layout en CSS gericht repareren.
- [ ] Blok 3: gerichte verify, plugin toepassen en task afronden.

## Concrete checklist

- [x] Huidige detail-layout in `App.tsx`, `use-task-detail-layout.ts` en CSS controleren.
- [x] Split-pane rendering corrigeren voor board/list.
- [x] Scrollcontainers corrigeren zodat detail en main-pane onafhankelijk scrollen.
- [x] Fullscreen detailmodus controleren.
- [x] Plugin typecheck/test/apply uitvoeren.

## Acceptance criteria

- [x] Board toont detail rechts naast het board op desktopbreedte.
- [x] List toont detail rechts naast de lijst op desktopbreedte.
- [x] Detailpane kan verticaal scrollen tot de body preview/danger zone.
- [x] Fullscreen toggle opent detail fullscreen en keert terug naar het rechterpaneel.
- [x] Board/list data- en interactieworkflows blijven ongewijzigd.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd.
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests.
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd; build, VSIX package, install en VS Code refresh uitgevoerd.
- `npm run taskflow:verify` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: detail rechts en scrollbaar in board/list, fullscreen blijft werken.
- Toegevoegde verbeteringen: gridkolommen expliciet gemaakt zodat de resize-handle geen detailkolom meer verdringt.
- Afgerond: board/list split-pane layout, onafhankelijke pane-scroll, fullscreen-layer en plugin apply zijn uitgevoerd.
- Open / blocked: geen.

## Relevante links

- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/use-task-detail-layout.ts`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`


## Commits

- 2026-06-22T11:44:37+02:00 — fix(plugin): keep task detail in right split pane

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state