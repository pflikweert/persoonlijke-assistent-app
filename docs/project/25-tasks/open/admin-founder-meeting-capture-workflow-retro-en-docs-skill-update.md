---
id: task-admin-founder-meeting-capture-workflow-retro-en-docs-skill-update
title: Admin/founder meeting capture — workflow-retro en docs/skill update
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Verwerk alleen bewezen Meeting Capture uitvoeringslearnings in AGENTS.md, relevante skills of docs/dev, cheap-first en zonder theoretische workflow-herschrijving."
tags: [meeting-capture, workflow, codex, skills]
workstream: plugin
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 9
---



# Admin/founder meeting capture — workflow-retro en docs/skill update

## Probleem / context

Meeting Capture is ook een test van de nieuwe workspace hierarchy en Codex workflow. Verbeteringen moeten worden vastgelegd, maar alleen wanneer ze uit echte frictie of herhaalbare winst blijken.

## Gewenste uitkomst

Na de eerste functionele slice is duidelijk wat beter moet aan AGENTS, taskflow, skills, plugin of docs/dev. Alleen concrete, bewezen verbeteringen worden verwerkt; grotere workflowwensen krijgen een eigen task.

## User outcome

Toekomstige agents profiteren van bewezen Meeting Capture uitvoeringslearnings zonder theoretische workflow-uitbreiding.

## Functional slice

Een kleine retro en gerichte workflowupdate of aparte vervolgtaak.

## Waarom nu

- Dit voorkomt dat waardevolle agent-learning verdwijnt.
- Tegelijk voorkomt het theoretische workflow-expansie.

## In scope

- Retrospective op Meeting Capture uitvoering.
- Kleine update aan bestaande skill/docs/AGENTS wanneer bewezen nuttig.
- Aparte task aanmaken voor bredere plugin/workflowproblemen.

## Buiten scope

- Grote AGENTS.md rewrite.
- Nieuwe pluginfeatures zonder eigen task.
- Subagents inzetten zonder expliciete uservraag.

## Oorspronkelijk plan / afgesproken scope

- OpenAI Codex best practices, PLANS.md, modelkeuze, skills en Instructa prompt-pack lessen meenemen tijdens uitvoering.
- Alleen bewezen frictie verwerken.

## Expliciete user requirements / detailbehoud

- Exacte files, scope, pass/fail checks en stack traces als praktijkles bewaken.
- Repeated workflows naar skills wanneer zinvol.

## Status per requirement

- [ ] Retro uitgevoerd — status: niet gebouwd
- [ ] Bewezen updates verwerkt — status: niet gebouwd
- [ ] Breder werk als aparte task vastgelegd — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: uitvoering en frictiepunten inventariseren.
- [ ] Blok 2: kleinste workflowupdate doen of aparte task aanmaken.
- [ ] Blok 3: docs/taskflow verify draaien.

## Concrete checklist

- [ ] Meeting Capture hierarchy-test beoordelen.
- [ ] Taskflow/plugin frictie beoordelen.
- [ ] Alleen concrete workflowupdates toepassen.
- [ ] Verify draaien.

## Acceptance criteria

- [ ] Alleen bewezen frictie is verwerkt.
- [ ] Grote vervolgpunten staan in eigen task.
- [ ] Docs/taskflow verify is groen.

## Blockers / afhankelijkheden

- Depends on fase 1 tests/smokebewijs.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: workflowlearnings verwerken na echte uitvoering.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op fase 1.

## Relevante links

- https://developers.openai.com/codex/learn/best-practices
- https://developers.openai.com/cookbook/articles/codex_exec_plans
- https://developers.openai.com/codex/models
- https://developers.openai.com/codex/skills


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence
