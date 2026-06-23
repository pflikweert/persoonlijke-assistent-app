---
id: task-codex-config-veilig-aanscherpen-voor-budio-development
title: Codex-config veilig aanscherpen voor Budio development
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: "Review en verbeter de globale Codex-config minimaal zodat die sober, coding-first en veilig is, terwijl de Budio repo-config leidend blijft voor lokale Supabase- en projectspecifieke MCP-keuzes."
tags: [plugin, codex, config, mcp, local-dev]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 31
---




# Codex-config veilig aanscherpen voor Budio development

## Probleem / context

De huidige globale Codex-config is te breed voor coding-first gebruik: meerdere persoonlijke/data-plugins staan globaal aan, het redeneerniveau staat hoger dan nodig, en het globale model staat hardcoded op `gpt-5.4` terwijl de gebruiker `gpt-5.5` als voorkeursdefault wil als deze build dat ondersteunt.

Tegelijk moet Budio-specifiek gedrag niet naar de globale hostconfig lekken. Voor deze repo hoort de lokale `.codex/config.toml` leidend te blijven voor MCP-keuzes zoals `supabase_local` als standaardtarget.

## Gewenste uitkomst

Er ligt een brongebaseerde review van de huidige Codex-config, inclusief expliciete beoordeling van modelgedrag, pluginoppervlak en de scheiding tussen globale hostdefaults en repo-lokale Budio-config.

Na user-approval is de globale `~/.codex/config.toml` minimaal aangepast: coding-first plugins blijven aan, brede persoonlijke/data-plugins staan uit, trusted project entries blijven behouden, en `model_reasoning_effort` staat op `medium` tenzij hard bewijs iets anders vereist.

## User outcome

Pieter kan Codex lokaal gebruiken met een sobere veilige defaultconfig, zonder dat Budio-specifieke Supabase- of MCP-keuzes globaal worden afgedwongen.

## Functional slice

Een kleine config-review + minimale hostconfig-hardening voor Codex, met veilige validatie en bevestiging dat Budio lokaal op `supabase_local` blijft staan.

## Entry / exit

- Entry: huidige lokale Codex-installatie met `~/.codex/config.toml` en Budio repo `.codex/config.toml`.
- Exit: beoordeelde en waar nodig minimaal bijgewerkte globale config, plus gevalideerde Budio repo-config op lokale Supabase-default.

## Happy flow

1. Agent leest de huidige globale en repo-lokale Codex-config en relevante Budio docs.
2. Agent bevestigt model-/plugingedrag, stelt een minimaal diff voor en vraagt approval voor globale hostconfig-edit.
3. Na approval past agent alleen de benodigde globale config aan en valideert de TOML plus Budio MCP-target.

## Non-happy flows

- Empty state: ontbrekende globale config wordt alleen minimaal aangemaakt als dat nodig blijkt.
- Permission denied / unavailable: als modelcatalogus of lokale Codex-debug geen uitsluitsel geeft over `gpt-5.5`, blijft dat expliciet als onzekerheid gelabeld.
- Validation / unsupported state: als `gpt-5.5` niet in de lokale modelcatalogus zit of niet bruikbaar blijkt, wordt geen stille fallback naar `gpt-5.4` vastgezet.
- Failure / retry / cancel: zonder user-approval wordt `~/.codex/config.toml` niet aangepast.

## UX / copy

- Geen app-UI-wijzigingen.
- Rapportage benoemt exact: huidige modelsetting, aanbevolen modelsetup, welke plugins aan/uit blijven en welke repo-config leidend blijft.

## Data / IO

- Input:
  - `~/.codex/config.toml`
  - `.codex/config.toml`
  - relevante Budio docs
  - lokale Codex CLI/debug output
- Output:
  - eventueel minimale patch in `~/.codex/config.toml`
  - bijgewerkte taskfile-status en verify-notities
- Opslag/API/service/file-impact:
  - alleen lokale hostconfig en task/docs-laag
  - geen app-source, geen `.env*`, geen productie-data
- Statussen:
  - review
  - approval pending
  - applied
  - validated

## Waarom nu

- Deze setup beïnvloedt elke lokale Codex-sessie en moet veilig en sober zijn voordat verdere repo-uitvoering daarop leunt.

## In scope

- Huidige globale en repo-lokale Codex-config reviewen.
- Modelgedrag rond `gpt-5.5` en config-overrides expliciet beoordelen.
- Minimale globale configdiff voorstellen.
- Na approval de globale config aanpassen en lokaal valideren.
- Budio MCP-target expliciet op `supabase_local` bevestigen.

## Buiten scope

- Applicatiecode, dependencies, `.env*`, productie-data of deploys.
- Brede cleanup van overige Codex-statebestanden.
- Nieuwe plugins, nieuwe architectuur of redesigns.

## Oorspronkelijk plan / afgesproken scope

- Toon eerst een samenvatting van de huidige relevante config.
- Rapporteer expliciet: huidige modelsetting, of `gpt-5.5` ondersteund lijkt, of TOML-hardcoding handmatige modelswitch blokkeert, en de aanbevolen modelsetup.
- Stel eerst de exacte diff voor en vraag approval vóór edit van `~/.codex/config.toml`.
- Pas daarna pas de minimale globale wijzigingen toe.
- Valideer veilig: TOML/config-check en bevestiging dat Budio op local target staat.
- Rapporteer na afloop gewijzigde files, exacte settings, bewust uitgeschakelde items, finale modelgedrag en eventuele onzekerheid.

## Expliciete user requirements / detailbehoud

- [x] `gpt-5.5` als voorkeursdefault gebruiken als deze Codex-installatie het ondersteunt.
- [x] Geen model hardcoden op een manier die handmatige modelswitch in Codex onnodig blokkeert.
- [x] `model_reasoning_effort` globaal van `high` naar `medium` zetten tenzij sterk tegenbewijs bestaat.
- [x] Trusted project entries voor Budio en `space-idle-game` behouden.
- [x] Alleen core coding plugins globaal aan laten: `github`, `codex-security`, `openai-developers`.
- [x] Globaal uit tenzij expliciet nodig: `google-calendar`, `gmail`, `google-drive`, `browser-use`, `documents`, `spreadsheets`, `presentations`, `build-web-data-visualization`, `supabase`.
- [x] Budio-specifieke Supabase-default in repo-config laten, niet globaal.
- [x] Bij target-switching bestaande helper `node scripts/codex-mcp-target.mjs local` prefereren.

## Status per requirement

- [x] `gpt-5.5` support en veilige defaultroute beoordeeld — status: gebouwd
- [x] Model hardcoding versus handmatige switch beoordeeld — status: gebouwd
- [x] Globale reasoning effort naar `medium` voorbereid of toegepast — status: gebouwd
- [x] Trusted projects behouden — status: gebouwd
- [x] Coding plugins behouden en brede plugins uitschakelen — status: gebouwd
- [x] Budio local Supabase-default bevestigd — status: gebouwd
- [x] Veilige validatie uitgevoerd — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale Codex-bronnen en officiële OpenAI Codex-docs gecombineerd om modelsupport en configprecedentie expliciet te bevestigen.
- Na expliciete user-approval is alleen `~/.codex/config.toml` minimaal aangescherpt; repo-lokale Budio-config bleef ongewijzigd.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante docs/context, huidige config en taskflow bevestigen.
- [x] Blok 2: model-/plugingedrag bewijzen en minimale diff voorbereiden.
- [x] Blok 3: na approval globale config aanpassen.
- [x] Blok 4: veilige validatie draaien en task/docs sync afronden.

## Concrete checklist

- [x] Huidige globale en repo-lokale config samenvatten.
- [x] `gpt-5.5` support controleren via lokale Codex-bronnen.
- [x] Beoordelen of model in TOML de handmatige modelswitch overschrijft.
- [x] Exacte diff voorstellen.
- [x] Na approval config toepassen.
- [x] Veilige validatie en task/docs verify afronden.

## Acceptance criteria

- [x] De review noemt expliciet het huidige globale model, reasoning effort, plugin-state en trusted projects.
- [x] Het voorstel houdt Budio repo-config leidend voor `supabase_local` en zet geen Budio-specifieke MCP-keuze globaal vast.
- [x] Zonder approval wordt `~/.codex/config.toml` niet aangepast; met approval wordt alleen de minimale hostconfig gewijzigd en veilig gevalideerd.

## Blockers / afhankelijkheden

- Geen open blockers.

## Verify / bewijs

- `codex debug models`
- `codex doctor --json` of andere veilige config-check
- `node scripts/codex-mcp-target.mjs local`
- `npm run taskflow:verify`
- indien task/docs-laag wijzigt: `npm run docs:bundle` en `npm run docs:bundle:verify`

Tussenstand:

- `codex debug models` bevestigt lokale support voor `gpt-5.5`; de catalogus noemt ook `default_reasoning_level: medium`.
- `codex doctor --json` toont huidige globale load op `model: gpt-5.4`.
- `codex doctor --json -c 'model="gpt-5.5"'` bevestigt dat een hogere-precedence override direct het effectieve model naar `gpt-5.5` zet.
- `node scripts/codex-mcp-target.mjs local` bevestigt dat de Budio repo-target op `local` staat.
- Officiële Codex docs bevestigen dat `~/.codex/config.toml` de defaultlaag is, `.codex/config.toml` project-overrides levert, en dat de IDE extension een model selector heeft voor tijdelijke modelkeuze.
- Globale config aangepast naar `model = "gpt-5.5"`, `model_reasoning_effort = "medium"` en alleen core coding plugins enabled.
- `codex doctor --json` in de Budio repo toont nog `model: gpt-5.4`, consistent met project-configprecedentie.
- `codex doctor --json` buiten een trusted project (`/tmp`) toont `model: gpt-5.5`, wat bevestigt dat de globale default actief is.
- `npm run taskflow:verify` geslaagd.
- `npm run docs:bundle` geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: globale config sober en coding-first maken zonder repo-lokale Budio-config te verdringen.
- Toegevoegde verbeteringen: officiële Codex docs gebruikt om model/configprecedentie te bevestigen naast lokale CLI-bronnen.
- Afgerond: review, modelsupport-check, precedentie-check, diffvoorstel, explicit approval, minimale hostconfig-patch en validate van global-vs-project modelgedrag.
- Open / blocked: geen.

## Relevante links

- `docs/project/README.md`
- `docs/project/open-points.md`
- `docs/dev/active-context.md`
- `docs/dev/local-development-environment.md`
- `.codex/config.toml`


## Commits

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state