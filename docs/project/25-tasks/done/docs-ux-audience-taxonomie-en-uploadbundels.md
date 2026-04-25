---
id: task-docs-ux-audience-taxonomie-uploadbundels
title: Docs UX, audience-metadata en uploadbundels opschonen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/README.md
updated_at: 2026-04-25
summary: "Maak de docs menselijker en duidelijker met audience-metadata, een portable Budio Terminal visual layer en maximaal 10 beheerde uploadbundels."
tags: [docs, upload, tooling, obsidian, markdown]
workstream: idea
due_date: null
sort_order: 1
---

# Docs UX, audience-metadata en uploadbundels opschonen

## Probleem / context

De docs zijn inhoudelijk bruikbaar, maar lopen door elkaar voor menselijke lezers, agents/AI en gedeeld gebruik. Daarnaast zijn er te veel losse uploadartefacten om handmatig prettig te beheren.

De huidige ASCII-visuals helpen, maar mogen duidelijker, nerdier en leuker worden voor menselijke docs. Dat moet wel portable blijven: leesbaar in plain Markdown, VS Code en Obsidian zonder verplichte extra plugins, en zonder IP-copy of gimmick-overload.

## Gewenste uitkomst

De docs krijgen een kleine metadata- en visuele laag die duidelijk maakt voor wie een document bedoeld is en hoe het gebruikt moet worden.

Human-facing docs krijgen waar zinvol een Budio Terminal-stijl met terminalpanelen, Mermaid-diagrammen en mission-control blokken. Agent-only docs blijven sober en functioneel.

`docs/upload/**` wordt teruggebracht naar maximaal 10 beheerde uploadbestanden, met een manifest dat per use-case duidelijk maakt welke subset nodig is.

## Waarom nu

- De roadmap- en strategie-docs worden belangrijker als overdrachtslaag.
- De repo wordt ook als Obsidian-vault gebruikt, dus audience, metadata en graph-routing moeten duidelijker zijn.
- Handmatig uploaden naar ChatGPT Projects moet minder rommelig worden.

## In scope

- Audience-metadata voor actieve handmatige docs.
- Docs-governance voor audience, visual profile en uploadbundels.
- Developer toolingdoc voor VS Code, Mark Sharp, Mermaid-preview en Obsidian vault.
- Budio Terminal visual language als portable Markdown-stijl.
- Bundler aanpassen naar maximaal 10 beheerde uploadbestanden.
- Verifier toevoegen voor audience-metadata.
- Afhankelijke vervolgtask aanmaken voor later folderstructuur/visual-language review.

## Buiten scope

- Geen brede foldermigratie.
- Geen nieuw productdesignsystem.
- Geen runtime app-, schema-, API- of UI-wijzigingen.
- Geen verplichte plugininstallatie om docs te kunnen lezen.
- Geen productcopy richting eindgebruikers.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: taskfiles en developer docs-tooling vastleggen.
- [x] Blok 3: audience-metadata en Budio Terminal visual layer toepassen.
- [x] Blok 4: docs-bundler terugbrengen naar maximaal 10 uploadfiles.
- [x] Blok 5: verify draaien, task afronden en naar done verplaatsen.

## Concrete checklist

- [x] Hoofdtaak en afhankelijke vervolgtask bestaan met correcte status.
- [x] Metadata-contract en visual language staan vast in canonieke docs.
- [x] VS Code/Obsidian docs-tooling staat vast voor developers.
- [x] Belangrijkste human-facing docs zijn verrijkt zonder verplichte plugins.
- [x] Bundler genereert maximaal 10 uploadfiles.
- [x] Verify is groen.

## Blockers / afhankelijkheden

- Geen blocker. Vervolgtask hangt af van afronding van deze metadata- en bundlingfase.

## Verify / bewijs

- `npm run docs:audience:verify`
- `npm run docs:lint`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/README.md`
- `docs/README.md`
- `docs/setup/step-0-readiness.md`
- `scripts/docs/build-docs-bundles.mjs`
