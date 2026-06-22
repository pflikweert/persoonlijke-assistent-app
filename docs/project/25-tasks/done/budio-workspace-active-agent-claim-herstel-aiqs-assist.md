---
id: task-budio-workspace-active-agent-claim-herstel-aiqs-assist
title: Budio Workspace active agent claim herstel voor AIQS Assist
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Herstel ontbrekende active-agent metadata op de lopende AIQS Assist taak zodat Board/List de echte Codex-activiteit tonen.
tags: [plugin, vscode, taskflow, agent-metadata]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


## Probleem / context

De gebruiker ziet de taak `AIQS Assist laagbewuste prompt review` niet als actieve agenttaak in Board/List, terwijl er wel een Codex-run aan werkt.

Diagnose: de taakfile bestaat en staat op `in_progress`, maar bevat geen `active_agent*` frontmatter. De nieuwe plugin-awareness werkt bewust alleen metadata-gedreven en toont daarom correct geen fake activiteit.

## Gewenste uitkomst

De lopende AIQS Assist taak krijgt echte `active_agent*` metadata, zodat Board/List de taak near-realtime als actief kunnen tonen via de bestaande plugin-highlight en live-agent strip.

## User outcome

De gebruiker ziet de actieve Codex-run op `AIQS Assist laagbewuste prompt review` terug in het overzicht, zonder dat de plugin fake status hoeft te verzinnen.

## Functional slice

Kleine taskflow/data-fix: ontbrekende active-agent metadata herstellen op de lopende AIQS Assist taskfile en verifiëren dat taskflow geldig blijft.

## Entry / exit

- Entry: AIQS Assist taskfile staat op `in_progress` zonder actieve agentmetadata.
- Exit: AIQS Assist taskfile bevat `active_agent*` metadata met status `running`; deze bugfix-taak is afgerond zonder actieve agentmetadata.

## Happy flow

1. Inspecteer de AIQS Assist taskfile.
2. Bevestig dat `active_agent*` ontbreekt.
3. Voeg echte Codex active-agent metadata toe.
4. Verifieer taskflow.

## Non-happy flows

- Empty state: als geen actieve metadata bestaat, toont plugin niets; dat blijft correct.
- Permission denied / unavailable: niet van toepassing.
- Validation / unsupported state: onbekende `active_agent_status` blijft niet actief; deze fix gebruikt `running`.
- Failure / retry / cancel: bij taskflow-fout eerst metadata/frontmatter herstellen.

## UX / copy

- Geen UI-copy wijziging.
- De bestaande Board/List copy `Codex actief` en live-agent strip blijven leidend.

## Data / IO

- Input: `docs/project/25-tasks/open/aiqs-assist-laagbewuste-prompt-review.md`.
- Output: toegevoegde `active_agent*` frontmatter.
- Opslag/API/service/file-impact: alleen taskfilemetadata en taskflow/docs-bundles.
- Statussen: AIQS-taak blijft `in_progress`; bugfix-taak gaat naar `done`.

## Waarom nu

De net gebouwde active-agent awareness lijkt kapot zolang actieve agentruns hun taskfile niet claimen. Deze concrete lopende taak moet direct zichtbaar worden.

## In scope

- AIQS Assist taskfile active-agent metadata herstellen.
- Taskflow verifiëren.

## Buiten scope

- AIQS Assist implementatie wijzigen.
- Nieuwe plugin UI of automatische fake fallback toevoegen.
- Andere open tasks claimen.

## Oorspronkelijk plan / afgesproken scope

- Los op dat `AIQS Assist laagbewuste prompt review` niet zichtbaar wordt als actieve Codex-taak in Board/List.

## Expliciete user requirements / detailbehoud

- De gebruiker meldt dat er nu een Codex-agent met deze taak bezig is.
- Die actieve taak moet in het overzicht zichtbaar worden.
- Geen fake interface; echte metadata blijft bron.

## Status per requirement

- [x] AIQS Assist taskfile bevat actieve Codex metadata — status: gebouwd; `active_agent: Codex` en `active_agent_status: running` staan in de taskfile.
- [x] Taskflow blijft geldig — status: gebouwd; taskflow verify is groen.

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale read-check via de gebouwde plugin-datalayer bevestigt dat de taskkaart `activeAgentUiState(...).isActive === true` oplevert.

## Uitvoerblokken / fasering

- [x] Blok 1: task inspecteren en root-cause bevestigen.
- [x] Blok 2: metadata herstellen.
- [x] Blok 3: verify en task afronden.

## Concrete checklist

- [x] `active_agent*` toevoegen aan AIQS Assist taskfile.
- [x] `npm run taskflow:verify` uitvoeren.
- [x] Bugfix-task afronden en docs bundlen.

## Acceptance criteria

- [x] `AIQS Assist laagbewuste prompt review` bevat `active_agent: Codex`.
- [x] `active_agent_status` staat op `running`.
- [x] Bugfix-task eindigt zonder actieve agentmetadata.
- [x] Taskflow verify is groen.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- [x] `npm run taskflow:verify`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`
- [x] Lokale plugin-datalayer read-check: AIQS Assist kaart geeft `isActive: true`, `chipLabel: Codex actief`.

## Reconciliation voor afronding

- Oorspronkelijk plan: ontbrekende active-agent metadata voor de lopende AIQS Assist taak herstellen.
- Toegevoegde verbeteringen: read-check toegevoegd om te bewijzen dat de plugin-datalayer de taak nu actief ziet.
- Afgerond: AIQS Assist taskfile is geclaimd als actieve Codex-run en taskflow is groen.
- Open / blocked: geen; zichtbaarheid in de webview volgt via bestaande watcher/refresh.

## Relevante links

- `docs/project/25-tasks/open/aiqs-assist-laagbewuste-prompt-review.md`
- `docs/project/25-tasks/done/budio-workspace-active-agent-awareness-board-list.md`


## Commits

- 2026-06-22T18:04:11+02:00 — Automate active agent metadata