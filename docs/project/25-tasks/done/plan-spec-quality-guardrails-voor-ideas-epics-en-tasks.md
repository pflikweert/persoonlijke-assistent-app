---
id: task-plan-spec-quality-guardrails-voor-ideas-epics-en-tasks
title: Plan/spec quality guardrails voor ideas, epics en tasks
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Hard de repo-workflow zodat toekomstige agents zelfstandig uitvoerbare ideas, research, epics, tasks en subtasks aanmaken met flow-, UX/copy-, non-happy- en verify-details."
tags: [workflow, planning, tasks, epics, agents, verify]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---

# Plan/spec quality guardrails voor ideas, epics en tasks

## Probleem / context

De repo borgt taskflow, status en planintegriteit al beter dan voorheen, maar nieuwe plannen kunnen nog te richtinggevend blijven. Daardoor kunnen developers of agents later een task oppakken zonder genoeg UX, copy, happy/non-happy flows, data/IO en acceptatiecriteria.

Dit is zichtbaar geworden bij het Meeting Capture taakpakket: de hiërarchie stond goed, maar meerdere P1 taken waren nog niet zelfstandig uitvoerbaar zonder sessiecontext.

## Gewenste uitkomst

Toekomstige agents maken standaard ideas, researchdocs, epics, tasks en subtasks aan die zelfstandig bruikbaar zijn. Nieuwe uitvoerbare tasks krijgen een spec-readiness contract en verify faalt bij nieuwe incomplete task/epic files.

## Waarom nu

- Dit is P1 omdat slechte plannen downstream bouwkwaliteit, agent-efficiëntie en reviewbaarheid direct raken.
- Meeting Capture moet eerst goed gehard worden voordat runtimebouw start.

## In scope

- Task- en epic-templates uitbreiden met spec-readiness secties.
- Idea/research/planning workflowregels aanscherpen.
- AGENTS, docs/dev workflows en relevante skills updaten.
- Verify-script uitbreiden voor nieuwe task/epic files en expliciet spec-ready bestaande files.
- Bundlescript uitbreiden zodat `24-epics/**` als echte projectlaag in upload/generated context komt.
- Meeting Capture P1/P2 taskfiles en epic-doc als eerste toepassing hardenen.

## Buiten scope

- Runtime Meeting Capture bouwen.
- Alle legacy tasks in één keer herschrijven.
- Nieuwe productscope toevoegen.

## User outcome

Een toekomstige developer of agent kan een nieuwe P1/P2 task oppakken zonder chatgeschiedenis en ziet direct: wat gebouwd moet worden, welke UX/copy geldt, welke non-happy flows bestaan, welke data/IO verandert en wanneer de taak klaar is.

## Functional slice

Deze taak levert een werkende workflow/verify-slice op: templates + docs + skills + verify-script + bundlescript + Meeting Capture toepassing.

## Entry / exit

- Entry: nieuwe ideas/epics/tasks worden via templates of agentflow aangemaakt.
- Exit: nieuwe of expliciet `spec_ready: true` task/epic files falen verify wanneer verplichte spec-secties ontbreken.

## Happy flow

1. Agent krijgt een nieuw groter werkpakket.
2. Agent maakt of kiest een taskfile.
3. Agent gebruikt de geharde template.
4. Agent vult user outcome, flows, UX/copy, data/IO, acceptance en verify in.
5. `npm run taskflow:verify` valideert de spec-readiness.
6. Docs bundle neemt epics en tasks mee in upload/generated context.

## Non-happy flows

- Nieuwe task mist happy/non-happy flow: verify faalt met concrete sectienaam.
- Nieuwe epic mist linked tasks/dependencies/acceptance: verify faalt.
- Legacy task zonder spec_ready blijft voorlopig geldig, tenzij inhoudelijk gehard of nieuw aangemaakt.
- Bundlescript mist epics: bundle-verificatie of `rg`-acceptatie faalt.

## UX / copy

Workflowcopy in foutmeldingen blijft concreet en herstelbaar, bijvoorbeeld: `Task mist verplichte spec-readiness sectie: ## Happy flow`.

## Data / IO

- Wijzigt markdown templates, workflowdocs, skills en docs scripts.
- Wijzigt gegenereerde docs/upload output via `npm run docs:bundle`.
- Geen runtime app-data of Supabase-data.

## Acceptance criteria

- [x] Nieuwe incomplete P1/P2 task faalt `taskflow:verify`.
- [x] Complete research/polish task met lichtere secties slaagt.
- [x] Nieuwe incomplete epic faalt `taskflow:verify`.
- [x] `24-epics/**` komt volledig in upload/generated context.
- [x] Meeting Capture P1 tasks zijn zelfstandig uitvoerbaar met UX/copy en failure flows.
- [x] Docs/taskflow verify groen.

## Oorspronkelijk plan / afgesproken scope

- Repo zo harden dat toekomstige agents zonder sessiecontext goede ideas, research, planning-items, epics, tasks en subtasks aanmaken.
- Spec-readiness standaard toevoegen.
- Templates, workflowdocs, skills, verify-script en bundlescript aanpassen.
- Meeting Capture docs als eerste toepassing repareren.

## Expliciete user requirements / detailbehoud

- Dit is P1.
- Dit mag in de toekomst nooit meer fout gaan.
- Toekomstige agents moeten zonder context van deze sessie weten hoe ze plannen en uitvoertaken goed uitschrijven.
- Ideas, research tasks, planning, projectbeschrijvingen, epics, taken en subtaken vallen onder de hardening.

## Status per requirement

- [x] Repo-brede spec-readiness standaard — status: gebouwd
- [x] Templates gehard — status: gebouwd
- [x] Workflowdocs en skills gehard — status: gebouwd
- [x] Verify-script gate toegevoegd — status: gebouwd
- [x] Bundlescript epics toegevoegd — status: gebouwd
- [x] Meeting Capture docs gehard — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow-preflight en P1 task aanmaken.
- [x] Blok 2: templates, workflowdocs en skills harden.
- [x] Blok 3: verify-script en tests uitbreiden.
- [x] Blok 4: bundlescript epics toevoegen.
- [x] Blok 5: Meeting Capture docs harden.
- [x] Blok 6: verify, docs bundle en reconciliation afronden.

## Concrete checklist

- [x] `docs/project/25-tasks/_template.md` uitbreiden.
- [x] `docs/project/24-epics/_template.md` uitbreiden.
- [x] `docs/project/40-ideas/README.md` template uitbreiden.
- [x] `docs/dev/task-lifecycle-workflow.md` en `docs/dev/idea-lifecycle-workflow.md` uitbreiden.
- [x] `docs/dev/cline-workflow.md`, `AGENTS.md` en skills uitbreiden.
- [x] `scripts/docs/verify-taskflow-enforcement.mjs` uitbreiden met spec-readiness.
- [x] Tests toevoegen.
- [x] `scripts/docs/build-docs-bundles.mjs` epics laten laden.
- [x] Meeting Capture docs harden.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen functionele blocker; let op bestaande dirty worktree met eerdere Meeting Capture docs.

## Verify / bewijs

- `node --test scripts/docs/verify-taskflow-enforcement.test.mjs`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `rg "admin-founder-meeting-capture|epic-admin-founder" docs/upload docs/project/generated`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `rg "admin-founder-meeting-capture|epic-admin-founder" docs/upload docs/project/generated`

## Reconciliation voor afronding

- Oorspronkelijk plan: spec-quality guardrails repo-breed afdwingen en Meeting Capture als eerste toepassing repareren.
- Toegevoegde verbeteringen: `spec_ready` metadata toegevoegd als pragmatische gate zodat nieuwe files hard falen, terwijl legacy tasks niet in één keer geblokkeerd worden.
- Afgerond: templates, workflowdocs, skills, AGENTS, verify-script, verify-tests, bundle epic-discovery en Meeting Capture task/epic hardening.
- Open / blocked: geen binnen deze workflow-hardening; runtime Meeting Capture bouw blijft in de bestaande P1 child tasks.

## Relevante links

- `docs/project/25-tasks/_template.md`
- `docs/project/24-epics/_template.md`
- `scripts/docs/verify-taskflow-enforcement.mjs`
