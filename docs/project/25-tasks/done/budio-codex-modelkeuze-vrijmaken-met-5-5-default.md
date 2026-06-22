---
id: task-budio-codex-modelkeuze-vrijmaken-met-5-5-default
title: Budio Codex-modelkeuze vrijmaken met 5.5 default
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: "Verwijder de Budio project-level modelpin zodat de gebruiker in Codex zelf een model kan kiezen, terwijl de globale default op `gpt-5.5` actief blijft."
tags: [plugin, codex, config, model, local-dev]
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


# Budio Codex-modelkeuze vrijmaken met 5.5 default

## Probleem / context

De globale Codex-config staat nu correct op `gpt-5.5`, maar de Budio repo-config pinnt nog `model = "gpt-5.4"` in `.codex/config.toml`.

Daardoor erft Budio de globale default niet en blijft het project effectief op `gpt-5.4` laden. Dat botst met de expliciete userwens om in de Codex chat prompt zelf een model te kunnen kiezen, terwijl de default voor Budio ook naar `gpt-5.5` moet.

## Gewenste uitkomst

Budio pinnt geen eigen model meer op projectniveau. De repo erft de globale default `gpt-5.5`, terwijl handmatige modelkeuze in Codex niet onnodig door een repo-level `model` setting wordt overschreven.

## User outcome

Pieter opent Codex in de Budio repo en start standaard vanaf `gpt-5.5`, maar kan in de chat prompt zelf een ander model kiezen zonder dat Budio hard terugduwt naar een project-pinned model.

## Functional slice

Een minimale repo-config wijziging: de project-level `model` pin verdwijnt, overige Budio MCP- en Supabase-instellingen blijven intact.

## Entry / exit

- Entry: globale userconfig met `model = "gpt-5.5"` en Budio `.codex/config.toml` met `model = "gpt-5.4"`.
- Exit: Budio `.codex/config.toml` pinnt geen model meer; globale default `gpt-5.5` geldt weer in het project.

## Happy flow

1. Agent bevestigt globale en repo-level modelinstellingen.
2. Agent verwijdert alleen de repo-level `model` pin uit `.codex/config.toml`.
3. Agent valideert dat globale default buiten repo `gpt-5.5` is en dat Budio geen project-level modeloverride meer bevat.

## Non-happy flows

- Empty state: als `.codex/config.toml` onverwacht ontbreekt, wordt geen nieuwe brede config opgebouwd.
- Validation / unsupported state: als Codex een verborgen andere precedence zou toepassen, blijft dat expliciet gerapporteerd als onzekerheid.
- Failure / retry / cancel: bij verify-falen blijft de wijziging beperkt tot de kleinste config-edit en wordt het falende bewijs benoemd.

## UX / copy

- Geen app-UI-wijzigingen.
- Eindrapport benoemt expliciet dat Budio nu de globale `gpt-5.5` default erft en dat modelkeuze niet langer project-pinned is.

## Data / IO

- Input:
  - `~/.codex/config.toml`
  - `.codex/config.toml`
  - lokale Codex verify-output
- Output:
  - minimale patch in `.codex/config.toml`
  - task/docs-sync
- Opslag/API/service/file-impact:
  - alleen repo-local Codex-config en task/docs-laag
- Statussen:
  - review
  - applied
  - validated

## Waarom nu

- De globale default is al goed gezet; zonder deze repo-fix blijft Budio daarvan afwijken en blijft modelkeuze onnodig vastgepind.

## In scope

- Alleen de Budio repo-level modelpin verwijderen.
- Verifiëren dat de globale default `gpt-5.5` blijft.
- Verifiëren dat Budio local Supabase-config intact blijft.

## Buiten scope

- Globale plugin/config-herziening.
- Andere repo’s.
- Verdere Codex state/UI-instellingen buiten deze directe modelpin.

## Oorspronkelijk plan / afgesproken scope

- Houd `~/.codex/config.toml` op `gpt-5.5`.
- Verwijder alleen `model = "gpt-5.4"` uit Budio `.codex/config.toml`.
- Laat `model_reasoning_effort = "medium"` en Budio MCP/Supabase-config verder intact.
- Valideer daarna het effectieve gedrag met gerichte Codex checks.

## Expliciete user requirements / detailbehoud

- [x] In Budio altijd zelf model kunnen kiezen in de Codex chat prompt.
- [x] Budio default ook naar `gpt-5.5` zetten.
- [x] Geen onnodige repo-level modelhardcoding houden als die handmatige keuze in de weg zit.

## Status per requirement

- [x] Handmatige modelkeuze niet meer repo-pinned — status: gebouwd
- [x] Budio erft default `gpt-5.5` — status: gebouwd
- [x] Overige repo-config blijft intact — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Repo-level modelpin verwijderd; globale `gpt-5.5` default blijft de enige expliciete modeldefault.
- Verifiëring bevestigt nu ook binnen de Budio repo effectief `model: gpt-5.5`.

## Uitvoerblokken / fasering

- [x] Blok 1: huidige globale en repo-level modelconfig bevestigen.
- [x] Blok 2: minimale repo-config patch uitvoeren.
- [x] Blok 3: verify, taskflow en docs-bundel afronden.

## Concrete checklist

- [x] Project-level modelpin verwijderen uit `.codex/config.toml`
- [x] Verifiëren dat `gpt-5.5` globaal actief blijft
- [x] Verifiëren dat Budio local target intact blijft

## Acceptance criteria

- [x] `.codex/config.toml` bevat geen project-level `model = ...` meer.
- [x] `~/.codex/config.toml` blijft `model = "gpt-5.5"` bevatten.
- [x] Budio-specifieke MCP-config, inclusief `supabase_local`, blijft ongewijzigd.

## Blockers / afhankelijkheden

- Geen open blockers.

## Verify / bewijs

- `sed -n '1,80p' ~/.codex/config.toml`
- `sed -n '1,80p' .codex/config.toml`
- `codex doctor --json` in repo en/of buiten repo
- `node scripts/codex-mcp-target.mjs local`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

Tussenstand:

- `~/.codex/config.toml` bevat `model = "gpt-5.5"` en `model_reasoning_effort = "medium"`.
- `.codex/config.toml` bevat geen project-level `model = ...` meer.
- `codex doctor --json` in de Budio repo toont nu `model: gpt-5.5`.
- `node scripts/codex-mcp-target.mjs local` bevestigt dat `supabase_local` actief blijft.
- `npm run taskflow:verify` geslaagd.
- `npm run docs:bundle` geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: Budio modelpin verwijderen zodat globale `gpt-5.5` default geldt.
- Toegevoegde verbeteringen: expliciete verify toegevoegd dat de repo nu effectief `gpt-5.5` laadt, niet alleen dat de pin verwijderd is.
- Afgerond: repo-level modelpin verwijderd, globale `gpt-5.5` default intact, Budio local target intact en verify/scripts gedraaid.
- Open / blocked: geen.

## Relevante links

- `~/.codex/config.toml`
- `.codex/config.toml`
- `docs/project/25-tasks/done/codex-config-veilig-aanscherpen-voor-budio-development.md`


## Commits

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio