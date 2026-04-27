---
id: task-budio-workspace-command-room-research-startpunt
title: Budio Workspace Command Room research en startpunt vastleggen
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-26
summary: Research- en startpunt vastleggen voor een lokale Budio Workspace Command Room die leert van Linear en Cline Kanban en later Codex-ready kan worden.
tags: [idea, research, plugin, workspace, linear, cline, codex]
workstream: plugin
epic_id: epic-budio-workspace-hierarchy-linear-lite
parent_task_id: null
depends_on: []
follows_after: []
task_kind: research
due_date: null
sort_order: 1
---





## Probleem / context

Er bestaat al een Linear-geïnspireerd Workspace-idee voor structuur, intake en views, maar nog geen expliciet research-startpunt voor een bredere local-first Command Room-richting die ook Cline Kanban en Codex als referenties meeneemt.

Zonder deze vastlegging blijft dit spoor te makkelijk hangen als losse chatcontext in plaats van als traceerbaar idee binnen de bestaande Budio Workspace- en pluginlaag.

## Gewenste uitkomst

Er staat één nieuw idea/research-document in `docs/project/40-ideas/40-platform-and-architecture/` dat de richting vastlegt voor een Linear-inspired, Codex-ready, local-first Budio Workspace Command Room.

Daarnaast bestaat er één backlog-task die dit startpunt traceerbaar maakt en expliciet koppelt aan het bestaande Linear-geïnspireerde Workspace-idee, zonder dat dit al actieve planning, pluginbouw of scopeverbreding wordt.

## Waarom nu

- Dit borgt een waardevol researchspoor zonder het voortijdig te promoveren naar actieve bouwscope.
- Het sluit logisch aan op het bestaande Linear Workspace-idee en de plugin-focus in de huidige fase.
- Het voorkomt dat Browser Shell-, Codex-runner- of Jarvis-discussies te vroeg door elkaar gaan lopen.

## In scope

- Idea-doc toevoegen op de gevraagde locatie.
- Taskfile toevoegen in `docs/project/25-tasks/open/`.
- Koppeling vastleggen naar `100-linear-geinspireerde-budio-workspace-structuurlaag.md`.
- Taskflow-, docs-bundle- en docs-bundle-verify uitvoeren.

## Buiten scope

- Codewijzigingen.
- Pluginbouw of wijzigingen in `tools/budio-workspace-vscode/**`.
- Browser shell bouwen.
- Codex runner bouwen.
- Worktrees uitwerken.
- Jarvis-scope verbreden.

## Oorspronkelijk plan / afgesproken scope

- Voeg precies één nieuw idea/research-document toe op basis van het aangeleverde Markdown-document.
- Maak precies één taskfile aan om dit startpunt traceerbaar te maken.
- Bewaar dit als proposal/idea en niet als actieve planning of implementatie.

## Expliciete user requirements / detailbehoud

- Gebruik `docs/project/README.md`, `docs/project/20-planning/50-budio-workspace-plugin-focus.md`, `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`, `docs/dev/cline-workflow.md`, `AGENTS.md` en `.agents/skills/task-status-sync-workflow/SKILL.md` als verplichte leesvolgorde.
- Taskfile moet `status: backlog`, `phase: transitiemaand-consumer-beta`, `priority: p2`, `workstream: plugin`, tags `[idea, research, plugin, workspace, linear, cline, codex]` en de opgegeven samenvatting krijgen.
- Niet raken: `tools/budio-workspace-vscode/**`, `app/**`, `components/**`, `services/**`, `supabase/**`, en `package.json` tenzij een bestaand verify-script aantoonbaar ontbreekt.
- `docs/upload/**` niet handmatig wijzigen; alleen via `npm run docs:bundle`.
- Verify sequentieel uitvoeren: `npm run taskflow:verify`, `npm run docs:bundle`, `npm run docs:bundle:verify`.
- Alleen als lint/typecheck standaard verplicht blijkt voor docs-only taken in deze repo: ook `npm run lint` en `npm run typecheck`.
- Commit alleen als verify slaagt.

## Status per requirement

- [ ] Nieuw idea/research-document aangemaakt — status: niet gebouwd
- [ ] Nieuwe backlog-task aangemaakt — status: niet gebouwd
- [ ] Koppeling aan bestaand Linear Workspace-idee vastgelegd — status: niet gebouwd
- [ ] Verify sequentieel uitgevoerd en gerapporteerd — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [ ] Blok 2: primair docs-artefact en taskfile toevoegen.
- [ ] Blok 3: gerichte verify en docs/taskstatus afronden.

## Concrete checklist

- [ ] Idea-doc toevoegen met aangeleverde inhoud.
- [ ] Taskfile toevoegen met juiste frontmatter en scopeafbakening.
- [ ] Backlog-sortering actualiseren zodat deze task bovenaan staat.
- [ ] Verify uitvoeren en output vastleggen.

## Blockers / afhankelijkheden

- Geen functionele blockers; alleen docs- en taskflow-discipline.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Indien repo-regels of tooling dat voor docs-only expliciet vereisen: `npm run lint` en `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: één idea-doc en één taskfile toevoegen voor dit research-startpunt.
- Toegevoegde verbeteringen: geen.
- Afgerond: nog bij te werken tijdens uitvoering.
- Open / blocked: nog bij te werken tijdens uitvoering.

## Relevante links

- `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- ad43300 — chore: commit all remaining local changes

- 0b5c2d3 — feat: add workspace epic hierarchy

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence