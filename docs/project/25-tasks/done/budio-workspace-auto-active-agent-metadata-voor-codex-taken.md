---
id: task-budio-workspace-auto-active-agent-metadata-voor-codex-taken
title: Budio Workspace auto active-agent metadata voor Codex taken
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Maak actieve agentmetadata automatisch bij in_progress statusovergangen en verwijder handmatige claim/stop acties uit task detail.
tags: [plugin, vscode, taskflow, agent-metadata, codex]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 9
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---




## Probleem / context

`active_agent*` metadata wordt nu niet betrouwbaar automatisch gezet wanneer Codex aan een taak werkt. De plugin kan actieve taken wel tonen, maar dat werkt alleen als de taak handmatig via `Claim als actief` of via directe frontmatter-mutatie is geclaimd.

De gebruiker wil de handmatige opties uit de UI halen en de metadata automatisch laten volgen uit echte taakstatus en taskflow.

## Gewenste uitkomst

Wanneer een taak via de Budio Workspace plugin naar `in_progress` gaat, schrijft de plugin automatisch `active_agent*` metadata. Wanneer een taak `in_progress` verlaat, worden die velden automatisch gewist. Codex buiten de plugin krijgt een kleine CLI-helper om dezelfde metadata betrouwbaar te claimen/clearen.

## User outcome

De gebruiker ziet in Board/List/Jarvis automatisch welke Codex-taak actief is, zonder handmatig claimen of stoppen in de task detail UI.

## Functional slice

Een centrale repository/taskflow slice voor automatische active-agent metadata:

1. plugin statusovergangen claimen/clearen automatisch;
2. handmatige claim/stop knoppen verdwijnen uit task detail;
3. CLI-helper claimt/cleart taskfiles voor Codex-runs buiten plugin;
4. workflowdocs/skill leggen de automatische route vast.

## Entry / exit

- Entry: gebruiker/agent zet een taak naar `in_progress` via plugin of CLI-helper.
- Exit: taskfile bevat echte `active_agent*` metadata; bij status weg van `in_progress` of closeout zijn de velden leeg/null.

## Happy flow

1. Gebruiker sleept een taak naar `In Progress` of wijzigt status in task detail.
2. Repository schrijft status, sortering en active-agent metadata in één write.
3. Board/List/Jarvis refreshen en tonen `Codex actief`.
4. Gebruiker zet taak naar `Review` of `Done`.
5. Repository wist active-agent metadata en de highlight verdwijnt.

## Non-happy flows

- Empty state: taak zonder active-agent metadata wordt niet als actieve agent getoond.
- Permission denied / unavailable: lokale file-write fouten blijven via bestaande plugin save-fout zichtbaar.
- Validation / unsupported state: onbekende status bestaat niet buiten bestaande taskstatus enum.
- Failure / retry / cancel: stale expectedVersion blijft via bestaande repository-conflict flow lopen.

## UX / copy

- Verwijder task-detail knoppen `Claim als actief` en `Stop agent`.
- Agent-blok blijft read-only en toont bestaande metadata.
- Als geen agentmetadata bestaat, toon compact `Automatisch via in_progress`.
- Board/List/Jarvis copy en highlights blijven ongewijzigd.

## Data / IO

- Input: bestaande taskstatusmutaties via repository en CLI-helper `claim|clear <taskfile>`.
- Output: bestaande `active_agent*` frontmattervelden.
- Opslag/API/service/file-impact: lokale markdown taskfiles; geen nieuwe schema’s of remote calls.
- Statussen: `in_progress` claimt; status weg van `in_progress` cleart; `done` cleanup blijft verplicht.

## Waarom nu

De active-agent zichtbaarheid is gebouwd, maar valt om als agents de metadata niet consequent claimen. Automatiseren voorkomt handmatige stappen en voorkomt dat echte Codex-runs onzichtbaar blijven.

## In scope

- Repository auto claim/clear bij plugin statusovergangen.
- Create-as-in-progress auto claim.
- Task-detail UI knoppen verwijderen.
- CLI-helper `scripts/taskflow-agent-state.mjs`.
- Workflowdocs/skill updaten.
- Tests en plugin apply.

## Buiten scope

- Process-level heartbeat of live agentstream.
- Board/List/Jarvis redesign.
- Nieuwe metadatavelden of markdown-schema.
- AIQS Assist implementatie wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Active-agent metadata automatisch bij statusovergangen.
- Handmatige claim/stop UI verwijderen.
- Kleine taskflow CLI-helper voor Codex buiten plugin.
- Workflowdocs/skill aanpassen.
- Board/List/Jarvis blijven metadata-gedreven.

## Expliciete user requirements / detailbehoud

- Codex werkt aan taak moet automatisch metadata bijwerken.
- Handmatige opties mogen eruit.
- Geen fake heartbeat/progress in deze slice.
- Bestaande `active_agent*` velden blijven leidend.

## Status per requirement

- [x] Plugin status naar `in_progress` claimt automatisch — status: gebouwd; repository statusovergang en drag/drop claimen via agent settings.
- [x] Plugin status weg van `in_progress` cleart automatisch — status: gebouwd; repository statusovergang en done cleanup wissen metadata.
- [x] Handmatige task-detail knoppen verwijderd — status: gebouwd; detail toont alleen read-only agentdiagnose.
- [x] CLI-helper claim/clear toegevoegd — status: gebouwd; `scripts/taskflow-agent-state.mjs` met tests.
- [x] Workflowdocs/skill bijgewerkt — status: gebouwd; skill, dev workflow en AGENTS verwijzen naar claim/clear route.
- [x] Tests en plugin apply — status: gebouwd; plugin tests, CLI-helpertest, root verify en apply zijn groen.

## Toegevoegde verbeteringen tijdens uitvoering

- Repository gebruikt agentdefaults wanneer hij buiten VS Code zonder workspace settings wordt aangeroepen.
- New-task writer accepteert active-agent metadata zodat `createTask(... in_progress)` geen tweede write nodig heeft.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: repository auto claim/clear + tests.
- [x] Blok 3: task-detail UI cleanup + CLI-helper.
- [x] Blok 4: workflowdocs/skill, verify, apply en afronding.

## Concrete checklist

- [x] Repository constructor/settings uitbreiden voor agent defaults.
- [x] Statusovergang naar `in_progress` claimt active-agent metadata.
- [x] Statusovergang weg van `in_progress` cleart active-agent metadata.
- [x] `createTask(... in_progress)` claimt active-agent metadata.
- [x] Task-detail handmatige knoppen verwijderen.
- [x] `scripts/taskflow-agent-state.mjs` toevoegen.
- [x] Unit-tests toevoegen/aanpassen.
- [x] Workflowdocs/skill aanpassen.
- [x] Verify/apply/docs uitvoeren.

## Acceptance criteria

- [x] `ready -> in_progress` via detail save schrijft `active_agent: Codex`.
- [x] Drag/drop naar `in_progress` schrijft `active_agent: Codex`.
- [x] `in_progress -> review/done/blocked/ready/backlog` wist active-agent velden.
- [x] Nieuw aangemaakte `in_progress` taak wordt automatisch geclaimd.
- [x] Task detail toont geen `Claim als actief` of `Stop agent`.
- [x] CLI-helper kan claimen en clearen zonder secrets.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- [x] `npm --prefix tools/budio-workspace-vscode run typecheck`
- [x] `npm --prefix tools/budio-workspace-vscode run test`
- [x] `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- [x] `node --test scripts/taskflow-agent-state.test.mjs`
- [x] `npm run taskflow:verify`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: automatische active-agent metadata bij plugin statusovergangen, handmatige claim/stop UI verwijderen, CLI-helper toevoegen en workflowdocs bijwerken.
- Toegevoegde verbeteringen: repositorydefaults voor niet-VS Code gebruik en writer-support voor `createTask(... in_progress)` zonder tweede write.
- Afgerond: alle planpunten zijn gebouwd en geverifieerd met plugin typecheck/test, CLI-helpertest, plugin apply, taskflow verify, lint en root typecheck.
- Open / blocked: geen blockers; process-level heartbeat blijft bewust buiten scope.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-active-agent-awareness-board-list.md`
- `tools/budio-workspace-vscode/src/tasks/repository.ts`
- `tools/budio-workspace-vscode/src/tasks/agent-metadata.ts`
- `.agents/skills/task-status-sync-workflow/SKILL.md`


## Commits

- 2026-06-22T18:04:11+02:00 — Automate active agent metadata

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state