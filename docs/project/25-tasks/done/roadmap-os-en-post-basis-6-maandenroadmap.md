---
id: task-roadmap-os-post-basis-6-maandenroadmap
title: Roadmap OS en post-basis 6-maandenroadmap
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/20-planning/30-now-next-later.md
updated_at: 2026-04-25
summary: "Maak een vaste roadmap-flow met templates, agent-uitvoerfasering, een post-basis 6-maandenroadmap en een uploadklare roadmap planning bundle."
tags: [roadmap, workflow, planning]
workstream: idea
due_date: null
sort_order: 1
---

## Probleem / context

De strategie voor wat na de basis komt is inhoudelijk besproken, maar nog niet als herbruikbare repo-flow vastgelegd.
Daardoor is het te afhankelijk van losse prompts of een agent maandroadmaps goed structureert, uitlegt en uploadklaar maakt.

Daarnaast moet de agent-werkwijze expliciet borgen dat agents voortaan zelf de slimste uitvoerblokken kiezen op basis van taak, model, risico en repo-state, zonder dat Pieter dit telkens hoeft te vragen.

## Gewenste uitkomst

Er staat een kleine Roadmap OS-laag voor maandblokken op epicniveau.
Iemand die het project niet kent, moet kunnen begrijpen waarom een maand zo is ingedeeld, welke functionaliteiten belangrijkst zijn, wat nice-to-have is, wat de gebruikerswaarde en Budio-ROI zijn, en waarom de volgorde logisch is.

De eerste toepassing is een post-basis 6-maandenroadmap voor Budio, met duidelijke uitsluiting van brede Jarvis-launch, Business/Private-uitbouw, billing/credits, zware sprintmachine en brede scheduler/autopost-flow.

## Waarom nu

- De huidige planning zegt dat Fase 3 builders/podcasters de volgende uitvoeringsprioriteit is.
- De basis-roadmap moet straks met dezelfde flow kunnen worden uitgewerkt.
- De agent-werkwijze moet structureel voorkomen dat planning of uitvoering te groot, te vaag of te ongefaseerd wordt.

## In scope

- Agent-instructies aanvullen met automatische uitvoerfasering per taak.
- Roadmap workflowdoc toevoegen voor maandblokken op epicniveau.
- Roadmap templates toevoegen voor maandblok en epic-item.
- Post-basis 6-maandenroadmap schrijven.
- Docs-bundler uitbreiden met een aparte uploadklare roadmap planning pack.
- Relevante planning/index-docs bijwerken.

## Buiten scope

- Runtime-code, UI, schema of API-wijzigingen.
- Basis-roadmap volledig uitwerken; dat krijgt later een eigen roadmapronde.
- Publieke Jarvis-launch, brede Pro/Business/Private-laag, billing/credits of scheduler/autopost-implementatie.
- Nieuwe pluginfunctionaliteit bouwen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante docs lezen en taskfile aanmaken.
- [x] Blok 2: agent-werkwijze vastleggen in instructies, skills en task-template.
- [x] Blok 3: roadmap workflow en templates toevoegen.
- [x] Blok 4: post-basis 6-maandenroadmap schrijven.
- [x] Blok 5: uploadbundle genereren via docs-bundler.
- [x] Blok 6: verify draaien, task afronden en naar `done/` verplaatsen.

## Concrete checklist

- [x] Agent-uitvoerfasering staat vast in agent-/workflowinstructies.
- [x] Roadmap workflowdoc bestaat en is vindbaar.
- [x] Maandblok- en epic-template bestaan.
- [x] Post-basis 6-maandenroadmap bestaat met ASCII-overzichten.
- [x] Roadmap planning pack wordt door `npm run docs:bundle` gegenereerd.
- [x] Verify-commando's zijn gedraaid en de taak is afgerond.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- `npm run docs:lint` geslaagd op 2026-04-25.
- `npm run docs:bundle` geslaagd op 2026-04-25.
- `npm run docs:bundle:verify` geslaagd op 2026-04-25.
- `npm run taskflow:verify` geslaagd op 2026-04-25.

## Relevante links

- `docs/project/README.md`
- `docs/project/20-planning/30-now-next-later.md`
- `docs/project/20-planning/10-roadmap-phases.md`
- `docs/dev/cline-workflow.md`
