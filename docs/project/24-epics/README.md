---
title: Epics workspace
audience: both
doc_type: operational
source_role: reference
visual_profile: budio-terminal
upload_bundle: 10-budio-core-product-and-planning.md
---

# Epics workspace

## Doel

`docs/project/24-epics/**` is de lichte operationele bovenlaag voor groter, samenhangend werk dat uit meerdere taken bestaat.

Belangrijk:

- epics zijn **geen** nieuwe canonieke productwaarheid
- epics vervangen **niet** `docs/project/25-tasks/**`
- taskfiles blijven de uitvoerlaag voor echte bouw-, research- en verify-actie

## Plaats in de repo

```text
20-planning   = richting en focus
24-epics      = grotere werkpakketten / projectbundels
25-tasks      = concrete uitvoering
40-ideas      = voorstelruimte / pre-task
```

## Gebruik

- gebruik een epic als meerdere taken logisch bij hetzelfde werkpakket horen
- leg hier scope, rationale, linked tasks, volgorde en afhankelijkheden vast
- gebruik subtasks nog steeds als gewone taskfiles in `25-tasks/**`
- houd dependencies expliciet en klein; gebruik parent/child niet als vervanging voor dependencies

## Minimal model

- `Epic/Project`
- `Task`
- `Subtask`

Dependencies blijven aparte relaties:

- `depends_on`
- `follows_after`
- afgeleid in tooling:
  - `blocked_by`
  - `blocks`

## Template

Gebruik `_template.md` als startpunt voor nieuwe epic-docs.

## Relatie met plugin en agents

- de Budio Workspace plugin leest epics als extra planningslaag boven tasks
- agents plannen op epic/taskniveau en voeren uit op task/subtaskniveau
- los werk zonder duidelijke parent blijft een gewone task
