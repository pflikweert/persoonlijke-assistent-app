---
id: epic-budio-workspace-hierarchy-linear-lite
title: Budio Workspace hierarchy — Linear-lite epic/task/subtask
status: done
priority: p1
owner: Pieter Flikweert
phase: transitiemaand-consumer-beta
updated_at: 2026-04-27
summary: "Voeg een kleine epic-laag, subtasks en dependencies toe aan de Budio Workspace plugin en taskflow, zodat groter werk rustig gegroepeerd en uitgevoerd kan worden zonder de markdown-first agentflow te breken."
sort_order: 1
---

# Budio Workspace hierarchy — Linear-lite epic/task/subtask

## Doel

Een rustige planningslaag boven de bestaande taskfiles toevoegen, geïnspireerd door Linear: één epic boven meerdere taken, subtasks als gewone taskfiles met parent-link, en dependencies als aparte relatie.

## Gewenste uitkomst

De repo bevat een operationele epic-laag onder `docs/project/24-epics/**`, taskfiles ondersteunen parent/subtask/dependency metadata en de Budio Workspace plugin kan epics, linked tasks, subtasks en blocked-relaties tonen zonder bestaande vlakke tasks te breken.

## Scope en grenzen

- Wel:
  - nieuwe epic-docslaag
  - hiërarchievelden in tasks
  - plugin parsing en UI voor epics/subtasks/dependencies
  - agent/taskflow docs uitbreiden
- Niet:
  - Jira-achtige issue-type matrix
  - roadmap/timeline UI
  - browser shell
  - autonome AI-subtask generatie

## Linked tasks

- `docs/project/25-tasks/open/budio-workspace-hierarchy-epics-subtasks-dependencies.md`
- `docs/project/25-tasks/open/budio-workspace-command-room-research-en-startpunt-vastleggen.md`
- `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`

## Volgorde van uitvoeren

1. Epic-laag en templates toevoegen.
2. Task-metadata uitbreiden met `epic_id`, `parent_task_id`, `depends_on`, `follows_after`, `task_kind`.
3. Plugin parser/repository/snapshot uitbreiden.
4. Plugin UI voor epic overview, task-relaties en filters toevoegen.
5. Tests, workspace apply en repo-verify afronden.

## Dependencies

- Leunt inhoudelijk op het Linear/Command Room researchspoor.
- Mag bestaande markdown-first taskflow niet breken.

## Acceptatie

- Een epic toont meerdere linked tasks.
- Een task kan subtasks hebben zonder apart bestandstype.
- Een blocked task toont zijn blockers duidelijk.
- Vlakke oude taskfiles blijven volledig bruikbaar.

## Relevante links

- `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`
- `docs/project/25-tasks/open/budio-workspace-hierarchy-epics-subtasks-dependencies.md`
