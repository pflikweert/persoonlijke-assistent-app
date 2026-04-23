---
id: workstream-backfill-bestaande-taskfiles
title: Workstream backfill voor bestaande taskfiles
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Alle bestaande taskfiles krijgen een expliciete workstream-classificatie (idea/plugin/app/aiqs), consistent met de nieuwe task-template en plugin-filters."
tags: [tasks, docs, workflow]
workstream: plugin
due_date: null
sort_order: 1
---

## Probleem / context

Na introductie van `workstream` in template en plugin ontbreekt dit veld nog in vrijwel alle bestaande taskfiles. Daardoor is filtering en visuele classificatie incompleet.

## Gewenste uitkomst

Alle bestaande taskfiles onder `docs/project/25-tasks/**` hebben een passende `workstream`-waarde (`idea`, `plugin`, `app` of `aiqs`).

## In scope

- Backfill van `workstream` in bestaande taskfiles.
- Verify + docs-bundle + taskflow-check na update.

## Buiten scope

- Geen inhoudelijke herschrijving van taken.
- Geen statuswijzigingen van bestaande taken.

## Concrete checklist

- [x] Inventariseer alle taskfiles zonder `workstream`
- [x] Ken per task een passende `workstream` toe
- [x] Draai docs/taskflow verify

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle:verify`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`
