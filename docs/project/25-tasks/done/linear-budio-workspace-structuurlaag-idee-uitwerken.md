---
id: task-linear-budio-workspace-structuurlaag-idee-uitwerken
title: Linear-geinspireerde Budio Workspace structuurlaag als idee uitwerken
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-25
summary: "Werk een nieuw standalone idee uit voor Budio Workspace op basis van actuele Linear-bronnen, met focus op structuur, intake, views, triage, integraties en elegante workflow-UX als cheap-first voorfase voor Jarvis."
tags: [idea, plugin, workspace, linear, workflow]
workstream: idea
due_date: null
sort_order: 1
---

## Probleem / context

Voor Budio Workspace bestaan al meerdere plugin- en workspace-ideeën, maar er ontbreekt nog een scherp verbindend idee dat uitlegt welke structuurprincipes we van Linear kunnen leren voor onze eigen workflowlaag.

Daardoor blijft het gesprek over Budio Workspace snel hangen tussen losse features, Jarvis-toekomstbeelden en bestaande taskboard-polish, zonder één duidelijke cheap-first richting voor intake, custom views, preview, integraties en dagelijkse executie.

## Gewenste uitkomst

Er staat een nieuw standalone idea-file in `docs/project/40-ideas/40-platform-and-architecture/` dat Linear niet bewondert om de hype, maar beoordeelt als referentie voor Budio Workspace.

Dat idee maakt expliciet:

- wat voor Budio Workspace relevant is om van Linear te leren of te kopiëren
- wat bewust niet past bij onze huidige scope
- hoe deze structuurlaag Jarvis later ondersteunt zonder Jarvis nu al tot actieve product- of pluginbelofte te maken

## Waarom nu

- De plugin is al een actieve uitvoeringslaag in de huidige fase.
- Jarvis blijft toekomstspoor, maar heeft eerst een sterkere structuurlaag nodig.
- Er is nu genoeg bevestigde context in repo + officiële Linear-bronnen om dit als samenhangend idee vast te leggen.

## In scope

- Nieuw taskfile aanmaken en taskflow correct starten.
- Nieuw standalone idee uitwerken voor Budio Workspace onder `40-platform-and-architecture/`.
- Officiële Linear-bronnen en relevante Budio-docs verwerken tot één scherpe beoordeling + vertaling.
- Expliciete afbakening opnemen van wat wel, deels en niet nu relevant is.

## Buiten scope

- Plugin-implementatie of UI-bouw.
- Nieuwe publieke productclaim voor Budio Vandaag.
- Nieuwe runtime-API-, schema- of deploywijzigingen.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Relevante Linear-bronnen en Budio-docs samengebracht.
- [x] Nieuw standalone idea-file voor Budio Workspace uitgewerkt.
- [x] Task afronden naar `done` en verplaatsen naar `done/`.
- [x] Docs bundle en verify sequentieel uitvoeren.

## Blockers / afhankelijkheden

- Geen functionele blockers; alleen docs- en taskflow-discipline vereist.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/40-ideas/40-platform-and-architecture/`
- `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- `https://linear.app/next`
