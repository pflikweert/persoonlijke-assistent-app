---
id: task-budio-workspace-hierarchy-epics-subtasks-dependencies
title: "Budio Workspace hierarchy met epics, subtasks en dependencies"
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "De Budio Workspace plugin en taskflow ondersteunen een Linear-lite hiërarchie met aparte epic-docs, gewone tasks, subtasks en expliciete dependency-relaties, zonder de bestaande markdown-first agentflow te breken."
tags: [plugin, workspace, hierarchy, epic, subtask, dependency, linear]
workstream: plugin
epic_id: epic-budio-workspace-hierarchy-linear-lite
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
due_date: null
sort_order: 1
---


# Budio Workspace hierarchy met epics, subtasks en dependencies

## Probleem / context

De huidige Budio Workspace plugin leest taskfiles als een vlakke status/prioriteit/workstream-laag. Daardoor ontbreekt een rustige bovenlaag voor grotere werkpakketten, evenals expliciete parent/subtask- en dependency-relaties zoals die in een lichte Linear-achtige workflow wel helpen.

Zonder die structuur blijft projectplanning te veel verspreid over losse tasks, ideas en chatcontext, en moeten agents en gebruikers handmatig reconstrueren welke taken bij elkaar horen en in welke volgorde ze logisch uitgevoerd worden.

## Gewenste uitkomst

De repo krijgt een kleine operationele epic-laag boven `docs/project/25-tasks/**`, plus lichte hiërarchievelden in taskfiles. De plugin kan epics tonen, linked tasks groeperen, subtasks en dependencies afleiden en blocked/loose/epic filters aanbieden, terwijl bestaande vlakke taskfiles en agentflows gewoon blijven werken.

De eerste fase bouwt bewust geen zware initiative/roadmap-machine. Het doel is een kleine, bruikbare Linear-lite structuur: `Epic -> Task -> Subtask`, met dependencies als aparte relaties.

## Waarom nu

- Dit sluit direct aan op het bestaande Linear- en Command Room-spoor in de repo.
- De plugin is inmiddels een dagelijkse uitvoeringslaag en heeft baat bij een heldere bovenstructuur.
- Dit helpt zowel menselijke planning als agent-uitvoering zonder productscope te verbreden.

## In scope

- Nieuwe operationele docslaag voor epics/projects.
- Epic README + template + eerste epic-doc voor deze hiërarchie-uitbreiding.
- Task template en taskflow docs uitbreiden met hiërarchievelden.
- Plugin parser/types/repository/state uitbreiden voor epics, subtasks en dependencies.
- Plugin UI uitbreiden met epic overview, task detail-secties en hiërarchiefilters.
- Tests voor parser/repository/UI-state uitbreiden.
- Plugin opnieuw toepassen op de normale workspace.

## Buiten scope

- Volledige Jira-achtige issue-type matrix.
- Brede roadmap/timeline UI.
- Browser shell-integratie.
- Auto-created subtasks via AI.
- Nieuwe productwaarheid buiten de operationele plugin/tasklaag.

## Oorspronkelijk plan / afgesproken scope

- Gebruik een Linear-lite model met aparte epic-docs boven tasks.
- Houd dependencies apart van parent/child-relaties.
- Laat subtasks gewone taskfiles blijven met extra metadata.
- Breid de bestaande agent/taskflow uit in plaats van die te vervangen.

## Expliciete user requirements / detailbehoud

- De plugin moet een hoofdtaak/epic boven onderliggende stories/taken en subtasks kunnen dragen.
- De workflow moet voor agents en AI in de repo werkbaar blijven.
- Bestaande capture/app-flow en andere productscope blijven onaangeraakt.
- De plugin mag hiervoor slim bestaande taskflow/docs-structuur uitbreiden.
- Linear is leidende inspiratie; Jira is nuttig als hiërarchie-referentie, niet als letterlijk UI-model.

## Status per requirement

- [x] Nieuwe epic-docslaag toegevoegd — status: gebouwd
- [x] Task template uitgebreid met hiërarchievelden — status: gebouwd
- [x] Plugin parser/repository begrijpt epic/subtask/dependency data — status: gebouwd
- [x] Plugin toont epic overview en task detail-relaties — status: gebouwd
- [x] Hiërarchiefilters werken zonder bestaande vlakke tasks te breken — status: gebouwd
- [x] Agent/taskflow docs bijgewerkt — status: gebouwd
- [x] Verify en plugin apply afgerond — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, context, taskflow en bronmodel bevestigen.
- [x] Blok 2: epic-laag en task-metadatafundering toevoegen.
- [x] Blok 3: plugin parser/state/UI uitbreiden.
- [x] Blok 4: tests, apply workspace en docs/taskstatus afronden.

## Concrete checklist

- [x] Nieuwe `docs/project/24-epics/` laag toevoegen.
- [x] Template en docsrouter/taskflow docs bijwerken.
- [x] Plugin types/parser/repository uitbreiden.
- [x] Epic overview en task detail-relaties tonen.
- [x] Filters voor `has epic`, `no epic`, `has subtasks`, `blocked`, `ready to start` toevoegen.
- [x] Tests + `npm run apply:workspace` + repo verify draaien.

## Blockers / afhankelijkheden

- Geen functionele blocker; wel afhankelijk van backward-compatible task parsing.

## Verify / bewijs

- `cd tools/budio-workspace-vscode && npm run typecheck`
- `cd tools/budio-workspace-vscode && npm run test`
- `cd tools/budio-workspace-vscode && npm run apply:workspace`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: Linear-lite hiërarchie implementeren met aparte epic-docslaag en plugin/taskflow-compatibiliteit.
- Toegevoegde verbeteringen: plugin quick actions toegevoegd voor subtask-aanmaak, epic-koppeling en dependency-linking in task detail.
- Afgerond: epic-docslaag, task-metadata, parser/repository/state, epics overview, detail-relaties, filters, tests, plugin apply en docs/taskflow verify.
- Open / blocked: geen functionele blockers binnen deze scope; resterend alleen commit/push-afronding van deze sessie.

## Relevante links

- `docs/project/25-tasks/open/budio-workspace-command-room-research-en-startpunt-vastleggen.md`
- `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- 0b5c2d3 — feat: add workspace epic hierarchy