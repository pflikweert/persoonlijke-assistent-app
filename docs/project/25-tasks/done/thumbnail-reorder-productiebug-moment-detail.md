---
id: task-thumbnail-reorder-productiebug-moment-detail
title: Thumbnail reorder productiebug in moment detail
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "In productie blijft de gesleepte thumbnail in de galerij visueel steken of sprint terug; de reorder-interactie moet vanaf de thumb zelf stabiel werken en de visuele indicatie blijft icon-only."
tags: [bug, moment-detail, photos, thumbnail]
workstream: app
due_date: null
sort_order: 3
---

## Probleem / context

De nieuwe thumbnail reorder-flow werkt niet goed in productie. Bij het slepen van een thumbnail in de galerij blijft de foto hangen op zijn oude positie, waardoor de volgorde voor de gebruiker niet betrouwbaar of intuïtief aanvoelt.

Daarnaast is de copy/presentatie van de thumbnail-indicatie nu te zwaar:
- de `Thumbnail`-tag op de grote foto onder de samenvatting is daar niet nodig
- tekstlabels in de galerij voegen onrust toe; een kleine icon-only indicatie past beter

Na de eerste fix bleek het slepen nog niet structureel goed: naar links slepen kwam niet verder dan ongeveer de helft van de thumbnail en de foto sprong terug. De aangescherpte diagnose is dat de vorige aanpak de drag te laat overdroeg aan een later gemounte overlay/responder, waardoor de originele touch niet betrouwbaar eigenaar bleef van de sorteeractie.

Tijdens de nieuwe smoke-test bleek aanvullend dat de laatste pointerpositie niet altijd via een move-event binnenkomt. De release-handler neemt daarom nu ook de loslaatpositie mee voordat de target-index wordt afgerond.

## Gewenste uitkomst

De galerij-reorder werkt in productie vloeiend en betrouwbaar: tijdens slepen beweegt de actieve thumbnail correct mee en blijft niet vast op zijn oude positie hangen. Na loslaten klopt de nieuwe positie visueel én functioneel.

De grote foto onder de samenvatting toont geen overbodige thumbnail-tag meer. In de galerij blijft de indicatie alleen icon-only aanwezig, zonder zichtbare badge-copy.

## Waarom nu

- Dit is een zichtbare regressie in een net toegevoegde kerninteractie.
- Het gedrag schaadt vertrouwen in de reorder-flow en dus in de featured-thumbnaillogica.
- De visuele badge-uitwerking is nu te zwaar voor de bedoelde rustige Budio-UI.

## In scope

- Reproduceren en oplossen van het vastlopende dragged-thumbnail gedrag in productie/runtime.
- Verwijderen van de thumbnail-tag op de grote foto onder de samenvatting.
- Verwijderen van zichtbare thumbnail-labels in de galerij; icon-only indicatie behouden waar nuttig.
- Gerichte runtime-verify van reorder-gedrag op de lokale webtarget.

## Buiten scope

- Nieuwe fotofeatures buiten reorder en thumbnail-indicatie.
- Grote redesign van moment detail buiten deze bugfix.
- Nieuwe taskflow- of pluginwijzigingen buiten wat nodig is voor deze bug.

## Concrete checklist

- [x] Aangescherpte oorzaak van vastlopende/terugspringende dragged thumbnail in code bevestigd.
- [x] Reorder-gedrag in galerij structureel aangepast naar thumb-owned drag.
- [x] Thumbnail-tag op featured foto verwijderen.
- [x] Thumbnail-labels in galerij verwijderen en icon-only maken.
- [x] Verify draaien (lint, typecheck, gerichte runtime-check).

## Blockers / afhankelijkheden

- Geen functionele blockers meer bekend.

## Verify / bewijs

- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-23 op `http://localhost:8081`: local magic-link login, icon-only badge-copy check, tweede thumb naar links gesleept en visueel op nieuwe positie bevestigd)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)

## Relevante links

- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `docs/project/open-points.md`
