---
id: task-plan-mode-task-auto-create-bij-ontbrekende-match
title: Plan Mode task auto-create bij ontbrekende match
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-04-24
summary: "Draai de repo-brede Plan Mode taskflowregel om zodat agents bij een duidelijke nieuwe scope automatisch een task aanmaken, en alleen bij echte classificatie- of scope-twijfel nog vragen."
tags: [workflow, tasks, plan-mode, docs]
workstream: app
due_date: null
sort_order: 4
---




## Probleem / context

De huidige repo-regel blokkeert inhoudelijk werk in Plan Mode wanneer er geen passende bestaande taskfile is. Daardoor moet de gebruiker alsnog expliciet buiten Plan Mode een task laten aanmaken, ook als de nieuwe scope al duidelijk is.

Dat vertraagt normale agentflows en botst met de gewenste default: bij duidelijke nieuwe scope hoort Plan Mode zelf een task aan te maken en direct door te kunnen plannen.

## Gewenste uitkomst

Plan Mode werkt voortaan met een goedkope en consistente preflight:

- eerst zoeken naar een passende bestaande task
- bij duidelijke match die task gebruiken
- bij duidelijke nieuwe scope automatisch een nieuwe task aanmaken
- alleen bij echte classificatie-, lane- of scope-twijfel nog expliciet vragen

Deze regel staat daarna repo-breed gelijk in AGENTS, skills en workflowdocs, zodat alle agents dezelfde verwachting volgen.

## Waarom nu

- De huidige Plan Mode-regel blokkeerde direct een nieuwe, heldere overview-feature.
- De gebruiker wil dat task-aanmaak niet langer buiten Plan Mode vastloopt.
- Dit is een repo-brede workflowverbetering die toekomstige agentsessies direct sneller en consistenter maakt.

## In scope

- Nieuwe workflowtask aanmaken en bovenaan de `in_progress` lane zetten.
- Plan Mode-regel omzetten in `AGENTS.md`, taskflow-skill en workflowdocs.
- Beslislogica expliciet maken: bestaande match gebruiken, anders auto-create, alleen bij twijfel vragen.
- `Taskflow summary`-uitleg aanpassen zodat een automatisch aangemaakte task toegestaan is.
- Controleren dat `taskflow:verify` niet leunt op de oude blokkaderegel.

## Buiten scope

- Nieuwe productfeatures of UI-wijzigingen buiten deze workflowregel.
- Aanpassingen aan statusmodel, done-flow of docs-bundle-beleid buiten wat nodig is voor deze regel.
- Nieuwe verify-scripts tenzij bestaande verify aantoonbaar op de oude regel leunt.

## Concrete checklist

- [x] Workflowtask aangemaakt en lane-sortering bijgewerkt.
- [x] `AGENTS.md` aangepast naar Plan Mode auto-create default.
- [x] `.agents/skills/task-status-sync-workflow/SKILL.md` aangepast.
- [x] `docs/dev/task-lifecycle-workflow.md` aangepast.
- [x] `docs/dev/cline-workflow.md` aangepast.
- [x] Verify-laag gecontroleerd en geen extra codewijziging nodig bevonden.
- [x] `npm run taskflow:verify` uitgevoerd.
- [x] `npm run docs:bundle` uitgevoerd.
- [x] `npm run docs:bundle:verify` uitgevoerd.

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging zit in workflowdocs en tasklaag.

## Verify / bewijs

- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `AGENTS.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `docs/dev/task-lifecycle-workflow.md`
- `docs/dev/cline-workflow.md`
- `scripts/docs/verify-taskflow-enforcement.mjs`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state
