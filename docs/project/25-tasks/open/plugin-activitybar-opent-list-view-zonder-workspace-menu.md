---
id: task-plugin-activitybar-opent-list-view-zonder-workspace-menu
title: Budio Workspace activity-bar opent list view zonder workspace-menu
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-25
summary: "Het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in list view, met veel list/board polish doorgevoerd; fullscreen-detail en enkele laatste layout-issues zijn nog open en blijven binnen deze in-progress task."
tags: [plugin, vscode, list-view, activity-bar]
workstream: plugin
due_date: null
sort_order: 3
---

# Budio Workspace activity-bar opent list view zonder workspace-menu

## Probleem / context

Wanneer de gebruiker op het Budio Workspace icoon in VS Code klikt, verschijnt nu eerst de oude `Workspace`-launcher/tussenlaag. Die route is verouderd en voegt geen waarde meer toe.

Daardoor voelt openen indirect en onnodig rommelig, terwijl de gewenste werkvorm juist is: direct de bestaande Budio Workspace window openen in de list view.

## Gewenste uitkomst

Klikken op het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in `list` view. De oude `Workspace`-launcher is uit de code en documentatie opgeruimd voor zover VS Code dit technisch toelaat.

Board blijft bestaan als secundaire view binnen de plugin en via het command palette, maar is niet meer de default open-route vanaf het icoon.

## Waarom nu

- Dit is een concrete UX-frictie in dagelijks gebruik van de plugin.
- De oude launcher-route zorgt voor verwarring en hoort niet meer bij de actuele pluginflow.
- Kleine plugin-polish is hier direct waardevol omdat deze extensie juist de dagelijkse uitvoeringslaag moet ondersteunen.

## In scope

- Activity-bar open-route laten landen in `list` view.
- Oude launcher/tussenlaag opruimen of minimaliseren tot alleen technisch noodzakelijke VS Code plumbing.
- Verouderde launcher-referenties uit extension-code en README verwijderen.
- Zorgen dat de webview-titel correct meebeweegt met de actieve view.

## Buiten scope

- Een volledige architectuurwissel naar een native sidebar-list in plaats van de bestaande panel/webview.
- Verwijderen van board of settings als beschikbare pluginviews.
- Nieuwe pluginfeatures buiten deze open-flow.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Activity-bar open-flow aangepast naar `list`.
- [x] Oude launcher-code en manifestverwijzingen opgeschoond.
- [x] README bijgewerkt naar het nieuwe open-gedrag.
- [x] List-view header/filters/sort/refresh UI aangescherpt (icon-only refresh, sort-select in topbar, actieve sort-header, statuschips gecentreerd, gekleurde batchchips).
- [x] List-view kolomheaders sticky gemaakt zodat ze onder de topnav zichtbaar blijven tijdens scroll.
- [x] Actieve taak-indicator visueel versterkt in board cards en list rows.
- [x] Automatische refresh/selectie-behoud aangescherpt voor repo- en agentgedreven markdownwijzigingen.
- [x] `Due` vervangen door `Last change` in de list view (datum-only, sorteert op wijzigingsdatum).
- [x] Checklist progress compacter en visueel consistenter gemaakt met gedeelde kleurbanden.
- [x] Plugin opent standaard met `Alleen open` actief.
- [x] Linker rail omgezet naar icon-first navigatie.
- [x] Detail pane uitbreidbaar gemaakt met resize handle en fullscreen toggle.
- [x] Agent activity zichtbaar gemaakt in list/board task-overzichten via gedeeld helperpatroon.
- [x] Rail refresh-knop gelijkgetrokken met de andere icon-buttons.
- [x] `Last change` compact gemaakt (`Apr 25`) zodat de datum niet over twee regels breekt.
- [x] Drag-vs-click structureel gescheiden zodat slepen niet meer meteen task detail opent.
- [ ] Detailweergave volledig stabiel maken: klein scherm fullscreen, desktop side-pane met expliciete fullscreen-optie, zonder lege rechterkolom of overlap over list/board.
- [ ] Laatste rail-sizing check bevestigen zodat refresh exact dezelfde maat houdt als de andere rail-icon buttons.
- [ ] Handmatige smoke-check in de normale VS Code workspace bevestigd.

## Bekende resterende punten uit deze sessie

- Fullscreen detail is nog niet volledig correct: in de huidige WIP kan de oude rechter-placeholder zichtbaar blijven terwijl detail over de list/board heen valt.
- De refresh-knop in de linker rail is codematig verder gelijkgetrokken, maar moet nog visueel bevestigd worden als exact dezelfde maat als de andere rail-icon buttons.
- De taak blijft bewust `in_progress` totdat deze laatste plugin-layout regressies én de handmatige smoke-check zijn afgerond.

## Blockers / afhankelijkheden

- VS Code verwacht voor een activity-bar container nog steeds een gekoppelde view; als volledig verwijderen daarvan technisch niet haalbaar blijkt, blijft alleen de minimaal noodzakelijke bridge over zonder oude launcher-semantiek.

## Verify / bewijs

- `npm run taskflow:verify`
- In `tools/budio-workspace-vscode/`: `npm run typecheck`
- In `tools/budio-workspace-vscode/`: `npm run test`
- In `tools/budio-workspace-vscode/`: `npm run apply:workspace`
- Handmatige smoke-check in VS Code:
  - activity-bar icoon opent direct list view
  - oude `Workspace` launcher/menu verschijnt niet meer als betekenisvolle tussenlaag
  - `Budio Workspace: Open Board` werkt nog
  - `Budio Workspace: Open List View` werkt nog
  - settings blijft bereikbaar

## Relevante links

- `tools/budio-workspace-vscode/package.json`
- `tools/budio-workspace-vscode/src/extension.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
