---
id: task-docs-private-repo-scheiding-migratieplan
title: Docs scheiden naar private repo (strategie + migratieplan)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-21
summary: "Werk een besluitbaar plan uit om strategische docs naar een aparte private repo te verplaatsen (optie 2), met behoud van historie, workflow en AIQS-governance."
tags: [docs, governance, security, repo-structuur, planning]
workstream: idea
due_date: null
sort_order: 6
---




## Probleem / context

De projectdocs bevatten geen secrets, maar wel gevoelige interne strategie en governance (zoals commerciële richting, AIQS-governance, admin-gedrag, en toekomstige productsporen). Zolang docs in dezelfde repo leven als runtime-code, ontstaat risico bij eventueel publiek delen van de hoofdrepo.

## Gewenste uitkomst

Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief heldere werkwijze voor sync met code, toegang, historiebehoud en updateflow.

Het resultaat van deze taak is een besluit- en uitvoeringskader; geen directe technische migratie in deze taak.

## Waarom nu

- Strategisch belangrijk voor private beta en toekomstige commerciële positionering.
- Voorkomt dat gevoelige roadmap/governance-data onbedoeld meebeweegt bij eventueel publiek delen van code.
- Houdt productwaarheid en docs-kwaliteit intact zonder drastische kennisverliesoptie.

## In scope

- Uitwerken van het doelbeeld voor een aparte private docs-repo in dezelfde workspace.
- Vergelijken van implementatievarianten (submodule vs aparte clone) op workflow-impact.
- Definiëren van migratieaanpak met behoud van historie en duidelijke eigenaarschap.
- Vastleggen van operationele aanpassingen in workflowregels (`AGENTS.md` / `docs/dev/**`) voor werken met 2 repos.
- Opstellen van risicoanalyse, rollbackstrategie en acceptatiecriteria voor go/no-go.

## Buiten scope

- Direct verplaatsen van bestaande docsbestanden.
- Aanpassen van runtime-code, API's of database.
- Open-source/public repo-strategie volledig uitvoeren binnen deze taak.

## Concrete checklist

- [ ] Inventariseer welke documenttypes gevoelig zijn en welke in hoofdrepo kunnen blijven.
- [ ] Werk variantvergelijking uit: submodule vs aparte clone (developer UX, CI, onderhoud, risico).
- [ ] Definieer aanbevolen doelarchitectuur met folderstructuur en sync-afspraken.
- [ ] Beschrijf stapsgewijze migratieflow inclusief geschiedenisbehoud en rollback.
- [ ] Definieer governance-updates voor werken met aparte docs-repo.
- [ ] Leg promotiecriteria vast voor uitvoering als vervolgtaak (ready/in_progress).

## Blockers / afhankelijkheden

- Afhankelijk van expliciet gebruikersbesluit op de aanbevolen variant.
- Afstemming nodig over toekomstige publiek/private repo-strategie.

## Verify / bewijs

- Documentair bewijs: uitgewerkt migratievoorstel met variantenanalyse en besluitadvies.
- Governancebewijs: expliciete workflowregels voor 2-repo samenwerking en wijzigingscontrole.
- Planningbewijs: traceerbare opvolging in tasklaag zonder premature uitvoering.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/README.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
