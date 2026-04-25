---
id: task-docs-folderstructuur-visual-language-herbeoordeling
title: Docs folderstructuur en visual language herbeoordelen na metadatafase
status: blocked
phase: transitiemaand-consumer-beta
priority: p3
source: docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md
updated_at: 2026-04-25
summary: "Beoordeel pas na de metadata- en bundlingfase of een bredere docs-foldermigratie of verdere visual-language uitbouw echt nodig is."
tags: [docs, structure, metadata, visual-language]
workstream: idea
due_date: null
sort_order: 1
---

# Docs folderstructuur en visual language herbeoordelen na metadatafase

## Probleem / context

De docs lopen deels door elkaar voor menselijke lezers, agents/AI en gedeeld gebruik. De goedkope eerste stap is metadata + betere bundling, niet meteen een brede foldermigratie.

Deze task bewaakt bewust dat we pas na de eerste fase herbeoordelen of een grotere structuurwijziging nodig is.

## Gewenste uitkomst

Na afronding van `docs-ux-audience-taxonomie-en-uploadbundels.md` ligt er een korte, brongebaseerde beoordeling:

- Is metadata + bundling voldoende om verwarring op te lossen?
- Zijn er nog docs die echt naar een andere folder moeten?
- Werkt de Budio Terminal-stijl als smaaklaag zonder gimmick te worden?
- Moet er een vervolg komen voor templates, Obsidian graph views of docs-navigatie?

## Waarom nu

- Niet nu uitvoeren: deze task is afhankelijk van bewijs uit de metadata- en bundlingfase.
- Wel nu vastleggen: voorkomt dat foldermigratie of visual polish ongemerkt meeloopt in de huidige cheap-first taak.

## In scope

- Review van docs-routing na metadatafase.
- Beoordeling of folderstructuur nog moet wijzigen.
- Beoordeling of visual language verder moet worden gestandaardiseerd.
- Eventueel nieuw plan of idee als vervolg.

## Buiten scope

- Geen brede foldermigratie voordat de dependency klaar is.
- Geen retro-terminal als nieuw design system.
- Geen productcopy richting app-eindgebruikers.
- Geen runtime app-wijzigingen.

## Uitvoerblokken / fasering

- [ ] Blok 1: dependency-resultaat lezen.
- [ ] Blok 2: docs-routing en metadata-effect beoordelen.
- [ ] Blok 3: advies vastleggen en eventuele vervolgtaak/idee maken.

## Concrete checklist

- [ ] Dependency is afgerond en verplaatst naar `done/`.
- [ ] Beoordeling van folderstructuur is vastgelegd.
- [ ] Beoordeling van visual-language gebruik is vastgelegd.
- [ ] Eventuele vervolgactie is expliciet klein gehouden.

## Blockers / afhankelijkheden

- Geblokkeerd op: `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`

## Verify / bewijs

- `npm run taskflow:verify`
- Indien docs gewijzigd worden: `npm run docs:lint`, `npm run docs:bundle`, `npm run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`
- `docs/project/README.md`
