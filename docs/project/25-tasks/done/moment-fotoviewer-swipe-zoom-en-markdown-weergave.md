---
id: task-moment-fotoviewer-swipe-zoom-markdown
title: Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "De fullscreen momentfoto-viewer op mobiel slimmer laten snappen per swipe, pinch-to-zoom op de foto zelf ondersteunen, en gedeelde dag-/momenttekstblokken markdownstructuur display-only laten weergeven."
tags: [moment-detail, photos, markdown, ui, mobile]
workstream: app
due_date: null
sort_order: 3
---

# Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen

## Probleem / context

De fullscreen fotoviewer op mobiel schiet bij swipen soms door naar een onbedoelde foto en ondersteunt nog geen pinch-to-zoom op de foto zelf.
Daarnaast tonen de gedeelde dag- en momenttekstcomponenten markdown nu nog als ruwe plain text, terwijl de inhoud baat heeft bij herkenbare structuur.

## Gewenste uitkomst

De fotoviewer voelt op mobiel beheerst en direct aan: per swipe land je op de bedoelde vorige of volgende foto, en ingezoomde foto's kun je lokaal pinchen en pannen zonder dat de browser of pagina zelf gaat zoomen.

Dag- en momenttekst tonen markdownstructuur display-only via gedeelde componenten, zodat koppen, lijsten, quotes en inline nadruk leesbaar terugkomen zonder editoruitbreiding.

## Waarom nu

- De huidige fullscreen interactie voelt onrustig en haalt vertrouwen uit de galerij-ervaring.
- Markdownstructuur verbetert leesbaarheid van bestaande output zonder scope-uitbreiding naar bewerken of rich-text authoring.

## In scope

- Slimmere fullscreen paging voor momentfoto's met single-step snap per swipe.
- Gedeelde zoomable slide met pinch-to-zoom, pan en paging-lock terwijl ingezoomd.
- Gedeelde display-only markdown-rendering voor day/moment summary- en narrativeblokken.
- Taskflow/documentatie/verify voor deze wijziging.

## Buiten scope

- Reordering, captions of delen van foto's.
- Markdown bewerken, HTML-rendering of volledige rich-text editor.
- Wijzigingen aan foto-authtransport of schema's.

## Concrete checklist

- [x] Taskfile aangemaakt voor deze UX/rendering-taak.
- [x] Fullscreen viewer aangepast naar momentum-end snap met begrensde stapgrootte.
- [x] Gedeelde zoomable photo slide toegevoegd met pinch/pan en paging-lock bij zoom.
- [x] Gedeelde markdown displaycomponent toegevoegd voor journaltekst.
- [x] Summary/narrative shared wrappers gekoppeld aan markdown-rendering.
- [x] Current status licht bijgewerkt voor de nieuwe runtime-capabilities.
- [x] Verify gedraaid (`npm run lint`, `npm run typecheck`, `npm run docs:bundle`, `npm run docs:bundle:verify`); `npm run docs:lint` is ook uitgevoerd maar faalt op al bestaande, niet-gerelateerde docsissues.

## Blockers / afhankelijkheden

- Geen functionele blockers.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run docs:lint` (faalt op al bestaande issues in `docs/project/25-tasks/done/local-auth-smoke-hardening-workflow.md` en `docs/project/25-tasks/open/niet-vergeten.md`)
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `components/journal/entry-photo-gallery.tsx`
- `components/ui/zoomable-photo-slide.tsx`
- `components/ui/markdown-display.tsx`
