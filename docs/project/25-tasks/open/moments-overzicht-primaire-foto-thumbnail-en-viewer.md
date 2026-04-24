---
id: task-moments-overzicht-primaire-foto-thumbnail-en-viewer
title: Moments-overzicht primaire foto thumbnail en viewer
status: review
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-25
summary: "Toon in het gedeelde moments-overzicht een primaire foto-thumb op maximale breedte binnen de bestaande tijdkolom, verfijn de viewer naar een media-first lightbox en herstel werkende navigatie via web drag-swipe, pijlen en gedeelde gesture-ownership."
tags: [moments-overzicht, photos, ui, viewer]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Het moments-overzicht toont nu alleen tijd, type-indicatie, titel en previewtekst. Als een moment foto's heeft, is er geen visuele hint of snelle route naar die foto's vanuit het overzicht zelf.

De gebruiker wil een kleine, vaste thumbnail onder de tijdindicator zonder dat de linkerkolom breder wordt. Vanuit die thumb moet een popup openen waarin alle foto's van dat moment bekeken kunnen worden.

## Gewenste uitkomst

In het gedeelde `MomentsTimelineSection` wordt bij aanwezige foto's een compacte primaire thumbnail getoond binnen de bestaande tijdkolom. Die thumb heeft een vaste maat en verandert de linkerkolombreedte niet.

Bij tikken/klikken opent een read-only fotoviewer met:
- de momenttitel bovenin naast de sluitknop
- swipe door alle foto's van dat moment
- een duidelijke visuele links/rechts indicatie wanneer swipen mogelijk is

De viewerbasis is gedeeld met de bestaande moment-detail galerij, zodat swipegedrag en presentatielogica niet uiteenlopen.

## Waarom nu

- De moments-overview mist nu een snelle route naar fotocontent.
- Er is al een bestaande fotoviewerbasis in moment detail die we nu netjes kunnen hergebruiken.
- Dit voegt zichtbare waarde toe zonder nieuwe productscope buiten de bestaande fotoflow.

## In scope

- Nieuwe task aanmaken en bovenaan `in_progress` zetten.
- Gedeelde moments-overzicht-component uitbreiden met primaire thumbnail binnen de bestaande tijdkolom.
- Batch-fotodata voor overview-preview laden zonder losse fetch per rij.
- Gedeelde read-only viewer toevoegen met titel in header en swipe-affordance.
- Bestaande moment-detail galerijviewer laten hergebruiken via dezelfde shared component.

## Buiten scope

- Foto upload, verwijderen of reorder vanuit het moments-overzicht.
- Nieuwe fotometadata zoals captions of favorieten.
- Volledige E2E-dekking voor deze flow als aparte QA-uitbouw.

## Concrete checklist

- [x] Taskfile aangemaakt en lane-sortering bijgewerkt.
- [x] Batch-photo service voor overview-preview toegevoegd.
- [x] `MomentsTimelineSection` uitgebreid met vaste primaire thumb in de tijdkolom.
- [x] Gedeelde fotoviewer toegevoegd met titelheader en swipe-affordance.
- [x] Moment detail galerij overgezet op dezelfde gedeelde viewer.
- [x] Thumbnail visueel teruggeschaald naar een lichtere timeline-hint.
- [x] Thumbnail opnieuw verbreed tot maximale breedte binnen de bestaande tijdkolom, zonder de kolom zelf te vergroten.
- [x] Viewer vereenvoudigd naar media-first presentatie met minder chrome.
- [x] Swipe-ownership hersteld tussen carousel en zoom-slide, inclusief web touch-action nuance.
- [x] Werkende vorige/volgende knopnavigatie toegevoegd in de viewer.
- [x] Web drag-swipe toegevoegd als structurele fallback naast touch paging.
- [x] Web drag-swipe verplaatst naar de gedeelde fotoslide zelf, zodat mouse-down en horizontaal slepen op de foto daadwerkelijk navigeert.
- [x] Web pinch-zoom onderdrukt nu browser/page zoom en routeert de interactie naar de foto-overlay.
- [x] Laatste timeline-item met thumb toont ook de doorlopende lijn onder het icoon.
- [x] Verify uitgevoerd en task/docs-bundles bijgewerkt.

## Blockers / afhankelijkheden

- Geen externe blockers; vereist alleen bestaande auth- en fotoservices.

## Review-notitie

- Lokale desktop-Chrome swipe met de muis in de fullscreen foto-popup werkt nog niet betrouwbaar; navigatie via de pijliconen werkt wel.
- Deze task staat daarom bewust in `review` voor latere productiecheck i.p.v. als opgelost/done.
- Gewenste vervolgrichting na review:
  - slimmer zoomen
  - foto kunnen slepen/pannen wanneer ingezoomd
  - inzoomen rond finger/cursor focuspunt in plaats van standaard naar het midden

## Verify / bewijs

- ✅ `npm run test:unit`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ Extra unit-tests voor viewer swipe-state en web touch-action helper
- ⚠️ Lokale mouse-swipe in desktop Chrome nog niet bevestigd als werkend; arrows werken wel
- ⚠️ Nog geen gerichte overview-smoke/spec voor deze nieuwe interactieve flow; daarom nu vastgelegd als open QA-gap i.p.v. stilzwijgend bewezen
- ✅ `npm run taskflow:verify`

## Relevante links

- `components/journal/moments-timeline-section.tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
