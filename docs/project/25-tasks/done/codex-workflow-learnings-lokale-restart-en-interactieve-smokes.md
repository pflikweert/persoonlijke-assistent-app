---
id: task-codex-workflow-learnings-lokale-restart-en-interactieve-smokes
title: Codex workflow learnings — lokale restart en interactieve smokes
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Structurele sessielearnings uit de Android Chrome foto-uploadfix zijn nu vastgelegd in AGENTS, QA-docs en een relevante UI-skill: lokale app-start/restart mag bij nodig runtime-bewijs, interactieve regressies vragen slimme happy + unhappy smoke, en browser-smokes wachten op een stabiele baseline."
tags: [codex, workflow, skills, qa, smoke, local-dev]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: [task-moment-detail-foto-upload-android-chrome-prepare-regressie]
task_kind: task
spec_ready: true
due_date: null
sort_order: 32
---




## Probleem / context

De sessie rond de Android Chrome foto-upload liet een paar herhaalbare agentlessen zien die nu nog niet scherp genoeg in repo-guardrails staan. Daardoor kostte het onnodig tijd om van logging naar structurele fix en van verify naar echte runtime-smokes te gaan.

## Gewenste uitkomst

Codex-agents en relevante skills handelen vergelijkbare interactieve regressies in de toekomst consistenter af. Ze mogen lokaal de app starten of herstarten wanneer dat nodig is voor gevraagd runtime-bewijs, ze testen niet alleen het happy pad maar ook een belangrijke failure-state, en browser-smokes wachten eerst op een zichtbare stabiele baseline.

## User outcome

Een developer of agent krijgt sneller echt bewijs bij interactieve regressies, met minder heen-en-weer over lokale restarts en minder risico dat een regressie alleen op `lint`/`typecheck` wordt afgevinkt.

## Functional slice

Een kleine workflow/docs-slice: update van always-on agentregels, QA-richtlijnen en een relevante UI-skill op basis van bevestigde sessielearnings.

## Entry / exit

- Entry: een interactieve web/UI-regressie waarbij runtime-bewijs of lokale app-beschikbaarheid onzeker is.
- Exit: de workflowdocs en skill beschrijven expliciet wanneer lokale app-start/restart is toegestaan, welke smoke-bewijzen verwacht worden en hoe browser-smokes hun baseline moeten bepalen.

## Happy flow

1. Agent ziet dat een interactieve wijziging echt runtime-bewijs nodig heeft.
2. Agent start of herstart lokaal de kleinste benodigde app-target wanneer die nog niet draait en dit binnen de sessie is toegestaan.
3. Agent draait een happy-path smoke plus minimaal één betekenisvolle unhappy-path smoke en legt bewijs vast.

## Non-happy flows

- Bestaande lokale app ontbreekt:
  agent mag de app lokaal starten of herstarten wanneer runtime-bewijs anders ontbreekt.
- Interactie is klein en puur visueel:
  geen volledige smoke-suite nodig; alleen de kleinste relevante runtime-check.
- Browser test race condition:
  test wacht eerst op een zichtbare stabiele baseline voordat counts/assertions of skips worden bepaald.

## UX / copy

- Geen product-UI-wijzigingen.
- Alleen agent-/developer-facing workflowcopy en guardrails.

## Data / IO

- Input: bevestigde sessielearnings uit de foto-upload regressie en lokale/prod smoke-runs.
- Output: aangescherpte repo-regels in `AGENTS.md`, `docs/dev/qa-test-strategy.md`, `docs/dev/local-auth-smoke-workflow.md` en relevante skill.
- Opslag/API/service/file-impact: alleen docs/skillfiles; geen runtimecode.
- Statussen: task blijft `in_progress` totdat docs, skill en verify klaar zijn.

## Waarom nu

- De learning is net bevestigd in echte implementatie + local/prod smoke.
- Zonder snelle vastlegging vallen agents makkelijk terug op te defensieve dev-serverregels of te lichte interactieve verify.

## In scope

- `AGENTS.md` verduidelijken voor lokale app-start/restart wanneer runtime-bewijs nodig is.
- QA-docs aanscherpen voor happy + unhappy smoke en stabiele baseline-wachtregel.
- Relevante UI-skill aanscherpen met dezelfde bewijsregel.

## Buiten scope

- Geen nieuwe skill aanmaken.
- Geen productdocs wijzigen buiten task-overzichten/bundels.
- Geen bredere taskflow-refactor of modebeleid aanpassen buiten deze concrete learnings.

## Oorspronkelijk plan / afgesproken scope

- Leg alleen structurele, bevestigde learnings vast uit deze sessie.
- Houd de wijziging klein: AGENTS + QA-doc + relevante skill.
- Geen brede workflowherschrijving als een compacte guardrail-update genoeg is.

## Expliciete user requirements / detailbehoud

- Voer dit uit als kleine structurele fix.
- Geen zware of onnodige smoke-uitbreiding als dat niet nodig is.
- Agents en skills moeten beter leren van deze sessie.

## Status per requirement

- [x] Lokale restart/start-regel voor runtime-bewijs expliciet vastgelegd — status: gebouwd
- [x] Happy + unhappy smoke-regel voor interactieve regressies expliciet vastgelegd — status: gebouwd
- [x] Baseline-wachtregel voor browser-smokes expliciet vastgelegd — status: gebouwd
- [x] Relevante skill bijgewerkt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- `docs/dev/local-auth-smoke-workflow.md` beschrijft nu ook expliciet hoe een agent lokale app-beschikbaarheid controleert en een noodzakelijke lokale start/restart kort documenteert.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Nieuwe workflow-task aangemaakt en in-progress bovenaan gezet.
- [x] `AGENTS.md` bijgewerkt.
- [x] QA-docs en relevante skill bijgewerkt.
- [x] Taskflow/docs verify gedraaid.

## Acceptance criteria

- [ ] `AGENTS.md` maakt expliciet wanneer Codex lokaal zelf een app mag starten of herstarten voor runtime-bewijs.
- [ ] QA-docs eisen voor interactieve regressies minimaal een happy path en één belangrijke unhappy path, of expliciete motivatie waarom dat niet kan.
- [ ] Relevante skill noemt stabiele baseline-check en slimme smoke-keuze in plaats van blind full smoke.

## Blockers / afhankelijkheden

- Geen blockers verwacht.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

Uitgevoerd op `2026-05-15`:

- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: alleen structurele sessielearnings klein vastleggen in AGENTS, QA-docs en een relevante skill.
- Toegevoegde verbeteringen: ook de local auth smoke-workflow is expliciet aangescherpt op lokale app-beschikbaarheid en korte runtime-rapportage.
- Afgerond:
  - AGENTS-regel voor lokale app-start/restart wanneer runtime-bewijs anders ontbreekt
  - QA-regel voor slim happy + unhappy smoke-bewijs
  - baseline-wachtregel voor browser-smokes
  - update van de relevante UI-skill
  - taskflow/docs verify
- Open / blocked:
  - geen; deze workflow-fix is inhoudelijk afgerond

## Commits

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
## Relevante links

- `AGENTS.md`
- `docs/dev/qa-test-strategy.md`
- `docs/dev/local-auth-smoke-workflow.md`
- `.agents/skills/ui-implementation-guardrails/SKILL.md`
