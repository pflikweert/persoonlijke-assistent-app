---
id: task-docs-folderstructuur-visual-language-herbeoordeling
title: Docs folderstructuur en visual language herbeoordelen na metadatafase
status: done
phase: transitiemaand-consumer-beta
priority: p3
source: docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md
updated_at: 2026-06-22
summary: "Herbeoordeling afgerond: metadata, source-of-truth matrix en maximaal 10 uploadbundels lossen de huidige docs-routing voldoende op. Geen brede foldermigratie nodig; visual language blijft een lichte human-facing smaaklaag."
tags: [docs, structure, metadata, visual-language]
workstream: idea
due_date: null
sort_order: 62
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

- [x] Blok 1: dependency-resultaat lezen.
- [x] Blok 2: docs-routing en metadata-effect beoordelen.
- [x] Blok 3: advies vastleggen en eventuele vervolgtaak/idee maken.

## Concrete checklist

- [x] Dependency is afgerond en verplaatst naar `done/`.
- [x] Beoordeling van folderstructuur is vastgelegd.
- [x] Beoordeling van visual-language gebruik is vastgelegd.
- [x] Eventuele vervolgactie is expliciet klein gehouden.

## Blockers / afhankelijkheden

- Geen actuele blocker meer. Dependency `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md` staat op `done`.

## Beoordeling

- Dependency-check: `docs-ux-audience-taxonomie-en-uploadbundels.md` staat op `done` en heeft audience-metadata, docs-governance, visual-language afspraken, uploadmanifest en maximaal 10 uploadbundels afgerond.
- Folderstructuur: geen brede migratie nodig. `docs/project/README.md` heeft nu een duidelijke source-of-truth matrix en scheidt strategie, planning, epics, tasks, research, ideas, generated en upload-only artefacten voldoende expliciet.
- Metadata-effect: het frontmatter-contract in `docs/project/00-docs-governance/README.md` maakt per document duidelijk wie de lezer is, wat de bronrol is en in welke uploadbundel de file hoort. Dat is goedkoper en veiliger dan mappen verschuiven.
- Uploadrouting: `docs/upload/00-budio-upload-manifest.md` beperkt de beheerde uploadset tot 10 bestanden en geeft per use-case een kleine subset. Daarmee is ChatGPT Project-context nu routeerbaar zonder brede handmatige selectie.
- Visual language: de Budio Terminal-stijl werkt als smaaklaag voor human-facing docs zolang de plain Markdown baseline blijft gelden. Er is geen reden om dit als app-designsystem of verplichte docs-renderinglaag uit te bouwen.
- Vervolgactie: geen nieuwe bouwtask nodig. Een later klein docs-navigatie/Obsidian-idee kan pas zinvol worden als echte gebruikspijn terugkomt, bijvoorbeeld slechte vindbaarheid ondanks hubs, uploadmanifest en metadata.

## Advies / besluit

- Houd de huidige mapstructuur aan.
- Gebruik metadata + hubs + uploadmanifest als primaire navigatie- en routinglaag.
- Verplaats alleen losse docs wanneer er een concrete bronconflict-, eigenaarschap- of vindbaarheidsreden is.
- Houd Budio Terminal beperkt tot human-facing of shared docs; agent-only workflowdocs blijven sober.
- Sluit deze task af zonder nieuwe vervolgtaak.

## Verify / bewijs

- ✅ `npm run docs:audience:verify`
- ⚠️ `npm run docs:lint` faalt op bestaande lintschuld in oude taskfiles; deze taskfile is hersteld en komt niet meer terug in de lintfoutlijst.
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
- ✅ `npm run taskflow:verify`

## Relevante links

- `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`
- `docs/project/README.md`
- `docs/project/00-docs-governance/README.md`
- `docs/upload/00-budio-upload-manifest.md`

## Reconciliation voor afronding

- Oorspronkelijk plan: na afronding van de metadata- en bundlingfase beoordelen of folderstructuur of visual language verder moest worden aangepakt.
- Expliciete requirements: brongebaseerd antwoord op metadata/bundling, foldermigratie, Budio Terminal-stijl en eventuele vervolgstap.
- Later toegevoegd: geen extra scope; de beoordeling is bewust klein gehouden.
- Afgerond: dependency is klaar, beoordeling en besluit zijn vastgelegd, geen vervolgtaak nodig.
- Open of blocked: niets binnen deze task.

## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-22T14:10:48+02:00 — docs: close docs structure review task

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state