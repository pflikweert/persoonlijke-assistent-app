---
id: task-plan-mode-task-auto-create-bij-ontbrekende-match
title: Plan Mode task auto-create bij ontbrekende match
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-07-15
summary: "Draai de repo-brede Plan Mode taskflowregel om zodat agents bij een duidelijke nieuwe scope automatisch een task aanmaken, en alleen bij echte classificatie- of scope-twijfel nog vragen."
tags: [workflow, tasks, plan-mode, docs]
workstream: app
due_date: null
sort_order: 13
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
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

## User outcome

De gebruiker hoeft bij een duidelijke nieuwe scope niet eerst handmatig buiten Plan Mode een taskfile te laten aanmaken.

## Functional slice

De bestaande repo-instructies en taskflow-skill gebruiken overal dezelfde beslisregel: match hergebruiken, duidelijke nieuwe scope automatisch aanmaken en alleen bij echte routeringstwijfel vragen.

## Entry / exit

- Entry: een agent start Plan Mode voor inhoudelijk repo-werk.
- Exit: een passende bestaande of automatisch aangemaakte taskfile is gekoppeld voordat het inhoudelijke plan wordt afgerond.

## Happy flow

1. Agent zoekt naar een passende taskfile.
2. Agent gebruikt de match of maakt bij duidelijke nieuwe scope automatisch een task aan.
3. Agent vermeldt de taskfile en taskflow-summary in het plan.

## Non-happy flows

- Bij meerdere plausibele tasks of onduidelijke task/idea/epic-routering vraagt de agent kort om richting.
- Een mislukte taskaanmaak blokkeert inhoudelijke uitvoering totdat de taskflow geldig is.

## UX / copy

- Workflowcopy blijft compact en gebruikt dezelfde termen in AGENTS, skill en workflowdocs.
- Geen product-UI of end-user copy gewijzigd.

## Data / IO

- Input: repo-context, bestaande taskfiles en duidelijke gebruikersscope.
- Output: hergebruikte of nieuw aangemaakte Markdown-taskfile met geldige frontmatter en lane-sortering.
- Geen runtime-, schema- of API-impact.

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

## Acceptance criteria

- [x] AGENTS, taskflow-skill en workflowdocs bevatten dezelfde auto-createbeslisregel.
- [x] Alleen echte classificatie- of scope-twijfel vereist nog gebruikersinput.
- [x] Bestaande taskflow- en docs-verificatie blijft groen.

## Oorspronkelijk plan / afgesproken scope

De repo-brede Plan Mode-regel omzetten van blokkeren bij ontbrekende task naar automatisch aanmaken bij een duidelijke nieuwe scope, zonder statusmodel of productcode te wijzigen.

## Expliciete user requirements / detailbehoud

- Bestaande duidelijke taskmatch altijd eerst hergebruiken.
- Duidelijke nieuwe scope automatisch als task vastleggen.
- Alleen vragen bij echte scope-, lane- of classificatietwijfel.

## Status per requirement

- [x] Bestaande match hergebruiken — status: vastgelegd.
- [x] Duidelijke nieuwe scope automatisch aanmaken — status: vastgelegd.
- [x] Alleen bij echte twijfel vragen — status: vastgelegd.
- [x] Taskflow summary blijft verplicht — status: vastgelegd.

## Toegevoegde verbeteringen tijdens uitvoering

- De regel is ook in de task-status-sync-workflow en beide relevante workflowdocs gelijkgetrokken om instructiedrift te voorkomen.

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging zit in workflowdocs en tasklaag.

## Verify / bewijs

- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: Plan Mode automatisch een task laten aanmaken wanneer geen match bestaat en de nieuwe scope duidelijk is.
- Expliciete user requirements: match-first, auto-create bij duidelijke scope en alleen vragen bij echte twijfel.
- Toegevoegde verbeteringen: repo-instructies, skill en workflowdocs zijn gelijkgetrokken.
- Afgerond: alle checklist- en acceptatiepunten plus taskflow/docs-verificatie.
- Open / blocked: niets; de workflowregel is actief en wordt in de huidige repo-instructies toegepast.

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

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge

- 2026-04-29T00:14:29+02:00 — docs: sync task commit logs

- 2026-04-29T01:47:27+02:00 — fix: diagnose Android photo prepare regression

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-01T11:08:03+02:00 — feat: add admin capability access control

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state


- 2026-07-15T11:36:41+02:00 — docs: close completed in-progress tasks
## Agent activity

- start 2026-07-15T09:31:58.973Z - Codex / gpt-5 / codex / default

- stop 2026-07-15T09:31:58.973Z -> 2026-07-15T09:32:42.986Z - Codex / gpt-5 / codex / default - reason: done
