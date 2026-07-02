---
id: task-origineel-plan-integriteit-borgen-tijdens-agent-uitvoering
title: Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-07-02
summary: "Borg repo-breed dat een goedgekeurd oorspronkelijk plan én expliciete user-requirement-details tijdens uitvoering niet stilzwijgend vervagen of vervangen worden, en dat aanvullingen expliciet worden gelogd totdat een reconciliation is gedaan. Deze hardening borgt ook het verschil tussen taskstatus, pluginselectie en echte actieve agentmetadata, inclusief repo-brede stale active-agent detectie met een 24-uurs grens."
tags: [workflow, tasks, governance, planning, agents]
workstream: plugin
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

Tijdens agent-uitvoering ontstaat soms drift tussen het oorspronkelijke goedgekeurde plan en de actuele uitvoerfocus. Zodra er tijdens bouwen correcties, regressies of polish-rondes bijkomen, verschuift de aandacht naar het laatste subprobleem. Daardoor kan een agent ten onrechte denken dat het werk "klaar" is, terwijl onderdelen uit het oorspronkelijke plan nog open staan.

De repo borgt al taskflow en status-sync, maar nog niet hard genoeg:

- de integriteit van het oorspronkelijke plan als stabiel referentiepunt gedurende de hele uitvoerfase
- de retentie van expliciete user-details en requirement-niveau beslissingen die later nog relevant zijn voor uitvoering of review

## Gewenste uitkomst

De repo-taskflow borgt voortaan expliciet dat een goedgekeurd oorspronkelijk plan of afgesproken scope tijdens uitvoering stabiel blijft, tenzij de eindgebruiker expliciet om wijziging van die hoofdscope vraagt.

Tussentijdse verbeteringen, correcties of regressiefixes worden voortaan niet gezien als vervanging van het oorspronkelijke plan, maar als aanvullingen binnen dezelfde taak of als expliciete nieuwe subscope. Expliciete user-requirements met latere uitvoer- of reviewwaarde blijven zichtbaar in de taskfile als detail-lijst en verdwijnen niet in alleen een samenvatting.

Voor afronding is een verplichte reconciliation nodig tussen: oorspronkelijk plan, expliciete user-requirements, later toegevoegde verbeteringen en nog open werk.

## User outcome

Een agent of developer ziet betrouwbare taskstatus: `done` betekent afgerond zonder actieve agentclaim, en een oude claim blijft niet meer zichtbaar als live agentactiviteit.

## Functional slice

Deze slice sluit stale taskmetadata op en voegt guardrails toe in drie lagen: taskflow verifier, herstel-script en Budio Workspace plugin-weergave.

## Entry / exit

- Entry: een taskfile bevat `active_agent*` metadata of wordt naar `done/` verplaatst.
- Exit: taskflow verify accepteert alleen geldige recente claims op `in_progress`, en plugin-UI toont stale claims niet als actief.

## Happy flow

1. Agent claimt een `in_progress` task.
2. Claim is jonger dan 24 uur en heeft een geldige `active_agent_since`.
3. Verifier accepteert de task en plugin toont de agent als actief.
4. Bij afronding wordt de task naar `done/` verplaatst en worden `active_agent*` velden geleegd.

## Non-happy flows

- Stale claim ouder dan 24 uur: `taskflow:verify` faalt en `clear-stale` kan de claim opruimen.
- Claim op niet-`in_progress`: `taskflow:verify` faalt.
- Malformed `active_agent_since`: `taskflow:verify` faalt en plugin toont geen live active styling.

## UX / copy

De plugin blijft dezelfde actieve-agent copy gebruiken voor geldige claims. Stale of malformed claims krijgen geen live actieve styling.

## Data / IO

- Input: taskfile-frontmatter met `active_agent*` metadata.
- Output: verifier issues, opgeschoonde frontmatter via `clear-stale`, en plugin-state zonder stale active highlight.

## Acceptance criteria

- AIQS Assist task staat in `done/` zonder actieve agentmetadata.
- `taskflow:verify` faalt op stale claims ouder dan 24 uur.
- `taskflow:verify` faalt op active-agent metadata buiten `in_progress`.
- `clear-stale` ondersteunt `--dry-run` en `--max-hours`.
- Plugin toont stale/malformed claims niet als live actief.

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
- [x] AIQS Assist stale active-agent claim corrigeren en task naar `done/` verplaatsen.
- [x] Repo-brede stale active-agent detectie toevoegen aan `taskflow:verify` met 24-uurs grens.
- [x] `scripts/taskflow-agent-state.mjs clear-stale` toevoegen met `--dry-run` en `--max-hours`.
- [x] Budio Workspace plugin-weergave hardenen zodat stale claims geen live actieve styling krijgen.

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging is repo-brede workflowgovernance.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run test:unit -- taskflow-agent-state`
- `node --test scripts/docs/verify-taskflow-enforcement.test.mjs`
- Plugin tests voor stale active-agent UI-state.

## Reconciliation voor afronding

- Oorspronkelijk plan: planintegriteit, requirement-retentie en closeoutsemantiek borgen zodat agentwerk niet stilzwijgend drift of stale agentmetadata achterlaat.
- Toegevoegde verbetering: AIQS Assist stale claim is gecorrigeerd en verplaatst naar `done/`; `taskflow:verify` scant nu repo-breed op active-agent claims ouder dan 24 uur of claims op niet-`in_progress` tasks.
- Toegevoegde verbetering: `scripts/taskflow-agent-state.mjs clear-stale` biedt een herstelpad met `--dry-run` en `--max-hours`.
- Toegevoegde verbetering: Budio Workspace plugin toont stale/malformed active-agent claims niet meer als live actief.
- Afgerond: docs/workflowregels, tasktemplate, plugin closeout, verifier-hardening, recovery-script, plugin-weergave, unit/static/plugin-verificatie en lokale plugin-apply.
- Open / blocked: geen open scope.

## Relevante links

- `AGENTS.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `docs/project/25-tasks/_template.md`

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

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state

- 2026-07-02T13:57:17+02:00 — fix: harden taskflow active agent cleanup