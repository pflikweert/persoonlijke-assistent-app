---
id: task-always-on-taskflow-enforcement-agent-onafhankelijk
title: Always-on taskflow enforcement (agent-onafhankelijk)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-23
summary: "Alle inhoudelijke agentsessies volgen verplicht de taskflow in docs/project/25-tasks, met hard verify-script, vaste outputstatus en duidelijke done-afronding."
tags: [workflow, tasks, governance]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

In de huidige workflow bestaan al task-afspraken, maar die worden niet overal en niet hard genoeg afgedwongen. Daardoor moet de gebruiker de taskflow opnieuw uitleggen en kan statusdrift ontstaan tussen uitvoering en taaklaag.

## Gewenste uitkomst

Elke inhoudelijke agentsessie (plan/research/bug/implementatie) loopt automatisch via een taskfile in `docs/project/25-tasks/**`, inclusief zichtbare status in updates/resultaten en een verplichte afrondflow naar `done` met docs-bundling verify.

## Waarom nu

- De gebruiker wil dit nooit meer per sessie hoeven herhalen.
- Workflowconsistentie is nodig over Cline/Codex/agentvarianten heen binnen deze repo.

## In scope

- Always-on policy expliciet en leidend vastleggen in `AGENTS.md`.
- Workflowdocs en skill aanscherpen naar verplichte taskflow.
- Hard guardrail script toevoegen (`taskflow:verify`) met duidelijke foutcodes/meldingen.
- Verifypaden opnemen in operationele docs.

## Buiten scope

- Externe tooling buiten repo-context hard afdwingen.
- Runtime-app features of API-contracten wijzigen.

## Concrete checklist

- [x] Taskflow-policy uitbreiden in AGENTS + docs/dev workflowdocs.
- [x] `task-status-sync-workflow` skill verplicht en expliciet maken.
- [x] `scripts/docs/verify-taskflow-enforcement.mjs` implementeren + npm script toevoegen.
- [x] Unit-tests toevoegen voor verifier/sortering van regels.
- [x] Docs bundle verify uitvoeren en taak afronden naar `done`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:test`
- `npm run taskflow:verify`
- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/README.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
