---
id: task-taskflow-closeout-agentmetadata-hardening
title: Taskflow closeout en agentmetadata hardening
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-03
summary: "Commit/push stopt voortaan bij push zonder PR-flow, task-closeout wist live active_agent metadata en agent-runs krijgen append-only historie in taskfiles."
tags: [taskflow, workflow, agent-metadata, codex, plugin]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---


## Probleem / context

De vorige swipe-taak is wel gecommit en gepusht, maar bleef in `open/` met `status: in_progress` en live `active_agent*` metadata. Daarnaast probeerde de commit/push-flow GitHub PR-context mee te nemen terwijl de gewenste lokale flow alleen commit en push is.

## Gewenste uitkomst

Task-closeout wordt consequent: afgeronde taken staan in `done/`, hebben `status: done`, geen live `active_agent*` metadata, en behouden wel agent-run historie in de task body. De lokale commit/push-instructies stoppen bij `git push` tenzij expliciet om een PR wordt gevraagd.

## User outcome

Een developer of agent ziet na afronding direct de juiste taskstatus, geen valse actieve agent, en wel welke agentruns op een taak hebben plaatsgevonden.

## Functional slice

Eén workflow-hardening slice: taskflow-helper, VS Code plugin metadata defaults/history, lokale instructies en afronding van de bestaande swipe-task.

## Entry / exit

- Entry: agent start of hervat een taak via taskfile en `active_agent*` metadata.
- Exit: agent stopt, blocked of rondt af; live metadata wordt gewist en `## Agent activity` bevat start/stop-regels.

## Happy flow

1. Agent claimt een taak.
2. Taskfile krijgt live `active_agent*` metadata en een startregel in `## Agent activity`.
3. Agent clear of sluit de taak af.
4. Live metadata wordt `null` en een stopregel bewaart start/stop/model/runtime/settings/reason.
5. Bij commit/push wordt alleen gepusht; er wordt geen PR gemaakt zonder expliciete vraag.

## Non-happy flows

- Empty state: ontbrekende `## Agent activity` wordt aangemaakt.
- Permission denied / unavailable: file write errors blijven command failures.
- Validation / unsupported state: onbekende clear-reason faalt met duidelijke usage.
- Failure / retry / cancel: een stale live claim blijft via `taskflow:verify` en `clear-stale` zichtbaar.

## UX / copy

- Geen app-UI wijziging.
- Plugin-labels voor actieve agent blijven gebaseerd op live frontmatter.
- Taskfile history gebruikt sobere markdownregels onder `## Agent activity`.

## Data / IO

- Input: taskfile frontmatter, optionele env/settings voor agentnaam/model/runtime/settings.
- Output: live frontmatter plus append-only markdownregels in `## Agent activity`.
- Opslag/API/service/file-impact: markdown taskfiles, `scripts/taskflow-agent-state.mjs`, VS Code plugin task writer/metadata helpers, repo docs.
- Statussen: live agentstatus blijft `running`; done/blocked/handoff/stopped worden history-reasons, niet live frontmatterstatus.

## Waarom nu

De vorige taak liet precies de fout zien die deze workflow moet voorkomen: valse actieve agentmetadata en een task die na commit/push niet naar `done` ging.

## In scope

- Swipe-task correct afronden en verplaatsen.
- Commit/push-instructies aanpassen zonder PR-flow.
- Agent default model naar `gpt-5`.
- Agent activity start/stop historie toevoegen in CLI-helper en plugin-writer.
- Gerichte tests en plugin apply.

## Buiten scope

- GitHub PR tooling verwijderen uit externe Codex skill-cache.
- Nieuwe plugin UI voor agent history.
- Brede taskfile schema-migratie buiten geraakte taken.

## Oorspronkelijk plan / afgesproken scope

- Sluit `docs/project/25-tasks/open/moment-detail-swipe-navigatie.md` af naar `done/`.
- Geen PR aanmaken bij commit en push tenzij expliciet gevraagd.
- Maak `active_agent*` alleen live-state.
- Voeg append-only agenthistorie toe in de task body.
- Gebruik `gpt-5` als fallback model.
- Pas plugin defaults en workflowdocs aan.

## Expliciete user requirements / detailbehoud

- "ik wil geen pr aanmaken met github, haal dit uit de flow met commit en push"
- "De taak staat nog in progress en niet op done, los dit op, dit moet ook in de toekomst altijd goed gaan."
- "`active_agent_status: running` klopt niet wanneer agent stopt."
- "model is niet ingevuld"
- "een agent kan meerdere keren aan en uit zijn"
- "denk diep na hoe dit permanent is locale agent instructies alles netjes op te lossen"

## Status per requirement

- [x] Commit/push zonder PR-flow — status: gebouwd in workflowdocs; push volgt in closeout
- [x] Swipe-task naar `done/` zonder live agentmetadata — status: gebouwd
- [x] Agent model fallback `gpt-5` — status: gebouwd en unit-tested
- [x] Agent start/stop historie — status: gebouwd en unit-tested
- [x] Plugin defaults/history gelijk aan CLI-helper — status: gebouwd en gericht getest

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taak aanmaken en claimen.
- [x] Blok 2: CLI-helper/plugin agentmetadata hardenen.
- [x] Blok 3: swipe-task closeout + workflowdocs.
- [x] Blok 4: verify, plugin apply, commit en push zonder PR.

## Concrete checklist

- [x] Nieuwe task claimen.
- [x] `taskflow-agent-state` claim/clear history + model default bouwen.
- [x] VS Code plugin metadata defaults/history bouwen.
- [x] Workflowdocs en skill aanpassen.
- [x] Swipe-task naar `done/` verplaatsen en metadata wissen.
- [x] Docs bundle, tests, plugin apply, commit en push.

## Acceptance criteria

- [x] `claim` voegt live metadata en start history toe.
- [x] `clear --reason done` wist live metadata en voegt stop history toe.
- [x] Plugin claim/clear gebruikt `gpt-5` fallback en schrijft history.
- [x] `commit en push` flow vereist geen GitHub CLI of PR.
- [x] Swipe-task staat in `done/` met status `done` en geen live active_agent values.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- ✅ `node --test scripts/taskflow-agent-state.test.mjs`
- ✅ `node --test scripts/docs/verify-taskflow-enforcement.test.mjs`
- ✅ `npm run build:extension && node --test dist/test/agent-metadata.test.js dist/test/repository.test.js` in `tools/budio-workspace-vscode/`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
- ✅ `npm run apply:workspace` in `tools/budio-workspace-vscode/`

## Reconciliation voor afronding

- Oorspronkelijk plan: swipe-task naar `done/`, commit/push-flow zonder PR, `active_agent*` als live-status, agent-run historie, `gpt-5` fallback en plugin/workflowdocs hardening.
- Toegevoegde verbeteringen: `taskflow:verify` faalt nu ook op live active-agent claims met ontbrekend of `unknown` model; een bestaande live claim is naar `gpt-5` gecorrigeerd.
- Afgerond: CLI-helper, verifier, plugin defaults/history, workflowdocs, skill, plugin apply en swipe-task closeout zijn afgerond.
- Open / blocked: geen.

## Relevante links

- `scripts/taskflow-agent-state.mjs`
- `tools/budio-workspace-vscode/src/tasks/agent-metadata.ts`
- `docs/project/25-tasks/done/moment-detail-swipe-navigatie.md`


## Agent activity

- start 2026-07-03T09:26:30.991Z - Codex / gpt-5 / codex / default

- stop 2026-07-03T09:26:30.991Z -> 2026-07-03T09:28:59.362Z - Codex / gpt-5 / codex / default - reason: done


## Commits

- 2026-07-03T11:29:48+02:00 — Harden taskflow closeout agent metadata