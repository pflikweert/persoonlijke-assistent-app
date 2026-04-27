---
id: task-origineel-plan-integriteit-borgen-tijdens-agent-uitvoering
title: Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-04-27
summary: "Borg repo-breed dat een goedgekeurd oorspronkelijk plan én expliciete user-requirement-details tijdens uitvoering niet stilzwijgend vervagen of vervangen worden, en dat aanvullingen expliciet worden gelogd totdat een reconciliation is gedaan. Deze hardening benoemt nu ook expliciet het verschil tussen taskstatus, pluginselectie en echte actieve agentmetadata, plus de closeout-regel dat `done` geen `active_agent*` context meer mag dragen."
tags: [workflow, tasks, governance, planning, agents]
workstream: plugin
due_date: null
sort_order: 2
---



## Probleem / context

Tijdens agent-uitvoering ontstaat soms drift tussen het oorspronkelijke goedgekeurde plan en de actuele uitvoerfocus. Zodra er tijdens bouwen correcties, regressies of polish-rondes bijkomen, verschuift de aandacht naar het laatste subprobleem. Daardoor kan een agent ten onrechte denken dat het werk "klaar" is, terwijl onderdelen uit het oorspronkelijke plan nog open staan.

De repo borgt al taskflow en status-sync, maar nog niet hard genoeg:

- de integriteit van het oorspronkelijke plan als stabiel referentiepunt gedurende de hele uitvoerfase
- de retentie van expliciete user-details en requirement-niveau beslissingen die later nog relevant zijn voor uitvoering of review

## Gewenste uitkomst

De repo-taskflow borgt voortaan expliciet dat een goedgekeurd oorspronkelijk plan of afgesproken scope tijdens uitvoering stabiel blijft, tenzij de eindgebruiker expliciet om wijziging van die hoofdscope vraagt.

Tussentijdse verbeteringen, correcties of regressiefixes worden voortaan niet gezien als vervanging van het oorspronkelijke plan, maar als aanvullingen binnen dezelfde taak of als expliciete nieuwe subscope. Expliciete user-requirements met latere uitvoer- of reviewwaarde blijven zichtbaar in de taskfile als detail-lijst en verdwijnen niet in alleen een samenvatting.

Voor afronding is een verplichte reconciliation nodig tussen: oorspronkelijk plan, expliciete user-requirements, later toegevoegde verbeteringen en nog open werk.

## Waarom nu

- Dit probleem raakt repo-breed meerdere agentflows, niet alleen pluginwerk.
- De gebruiker wil niet opnieuw hoeven bewaken dat het oorspronkelijke plan tijdens bouwen behouden blijft.
- De bestaande taskflow is al sterk; dit is een gerichte volgende stap om plan-drift structureel te voorkomen.

## In scope

- Nieuwe repo-brede guardrails voor planintegriteit én requirement-detail-retentie toevoegen in `AGENTS.md`.
- Workflowdocs uitbreiden met expliciete regels voor oorspronkelijk plan, expliciete user-requirements, aanvullingen tijdens uitvoering en reconciliation voor afronding.
- `task-status-sync-workflow` uitbreiden zodat niet alleen task-status maar ook plan-status en requirement-status gesynchroniseerd blijven.
- Task-template uitbreiden zodat niet-triviale taken ruimte hebben voor oorspronkelijke scope, expliciete user-requirements, aanvullingen tijdens uitvoering en reconciliation.
- Agent-closeout semantiek expliciet maken: `done` betekent ook geen `active_agent*` metadata meer en `Actief` in de plugin-UI mag nooit alleen selectie aanduiden.

## Buiten scope

- Nieuwe productfeatures of UI-wijzigingen buiten workflow/documentatie.
- Grote redesign van de volledige tasklaag of nieuwe verify-tooling tenzij strikt nodig.
- Wijzigen van canonieke productscope of planning buiten deze workflowafspraken.

## Uitvoerblokken / fasering

- [x] Blok 1: workflowgap bevestigen en bestaande guardrails targeten.
- [x] Blok 2: AGENTS, workflowdocs, skill en task-template aanscherpen voor planintegriteit.
- [x] Blok 3: verify draaien en taskflow/docs synchroon afronden.

## Concrete checklist

- [x] Nieuwe workflowtask aangemaakt en bovenaan `in_progress` geplaatst.
- [x] `AGENTS.md` uitgebreid met harde regels voor planintegriteit tijdens uitvoering.
- [x] `docs/dev/task-lifecycle-workflow.md` uitgebreid met oorspronkelijke-plan + aanvullingen + reconciliation-structuur.
- [x] `docs/dev/cline-workflow.md` uitgebreid met uitvoerregels tegen plan-drift.
- [x] `.agents/skills/task-status-sync-workflow/SKILL.md` aangescherpt met plan-sync guardrails.
- [x] `docs/project/25-tasks/_template.md` uitgebreid met planintegriteit-secties voor niet-triviale taken.
- [x] Requirement-detail-retentie expliciet toevoegen in AGENTS/docs/skill/template, zodat user-details niet verloren gaan in summaries.
- [x] Repo-regels verder aanscherpen zodat een bestaand uitgebreid bronplan in een taskfile letterlijk of nagenoeg letterlijk behouden blijft wanneer de gebruiker om detailbehoud vraagt.
- [x] Closeout-regels aangescherpt: `done` = file in `done/`, reconciliation aanwezig, verify/bundling gedaan en geen `active_agent*` metadata meer.
- [x] Anti-drift semantiek toegevoegd voor verschil tussen taskstatus, pluginselectie en echte actieve agentactiviteit.
- [x] Verify uitgevoerd (`taskflow`, docs bundle, docs bundle verify).

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging is repo-brede workflowgovernance.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `AGENTS.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `docs/project/25-tasks/_template.md`

## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence
