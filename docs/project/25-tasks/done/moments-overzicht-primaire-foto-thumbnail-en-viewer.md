---
id: task-moments-overzicht-primaire-foto-thumbnail-en-viewer
title: Moments-overzicht primaire foto thumbnail en viewer
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Het gedeelde moments-overzicht toont een primaire foto-thumb binnen de bestaande tijdkolom en gebruikt de gedeelde viewer. Desktop Chrome fullscreen navigatie via pijlen en mouse-drag is lokaal met Playwright bevestigd.
tags: [moments-overzicht, photos, ui, viewer]
workstream: app
due_date: null
sort_order: 64
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

## User outcome

Gebruiker ziet in het momentenoverzicht direct wanneer een moment foto's heeft en kan vanuit die compacte thumbnail de foto's fullscreen bekijken.

## Functional slice

Eén slice: overview-fotodata batch laden, primaire thumbnail tonen in de bestaande tijdkolom, shared viewer openen en readonly navigeren door alle foto's van dat moment.

## Entry / exit

- Entry: gebruiker opent Today of dagdetail met een moments-overzicht waarin minimaal één moment foto's heeft.
- Exit: gebruiker opent de thumbnail, navigeert in de viewer met pijlen of desktop mouse-drag en sluit zonder data te wijzigen.

## Happy flow

1. Moments-overzicht laadt de bijbehorende foto-previewdata.
2. Moment met foto's toont een compacte primaire thumbnail onder de tijdindicator.
3. Gebruiker opent de thumbnail.
4. Shared viewer toont de eerste foto met momenttitel, teller en navigatie.
5. Gebruiker navigeert naar een volgende foto via pijlicoon of desktop mouse-drag.
6. Gebruiker sluit de viewer en blijft in dezelfde overzichtscontext.

## Non-happy flows

- Geen foto's: er verschijnt geen thumbnail en de bestaande timeline blijft ongewijzigd.
- Foto-preview laden faalt: het overzicht blijft bruikbaar zonder thumbnail-route.
- Een foto is ingezoomd: desktop drag-swipe wordt niet als viewer-navigatie behandeld, zodat zoom/pan-interactie niet conflicteert.

## UX / copy

- Thumbnail blijft een lichte timeline-hint binnen de bestaande tijdkolom.
- Viewer gebruikt bestaande compacte labels: momenttitel, `Foto sluiten`, `Vorige foto`, `Volgende foto` en teller `x / y`.
- Geen extra uitlegcopy of nieuwe viewer-chrome.

## Data / IO

- Input: bestaande `raw_entry_id` waarden uit het moments-overzicht en bestaande `entry_photos` service-data.
- Output: read-only UI state voor thumbnails en viewer-index.
- Geen opslagmutaties, upload, delete, reorder, captions of nieuwe fotometadata.

## Acceptance criteria

- [x] Moment met foto's toont één primaire thumbnail binnen de bestaande tijdkolom zonder kolombreedte te vergroten.
- [x] Thumbnail opent de gedeelde readonly viewer.
- [x] Viewer blijft gedeeld met momentdetail-gallery.
- [x] Pijlnavigatie werkt in de fullscreen viewer.
- [x] Desktop Chrome mouse-drag navigeert in de fullscreen viewer en is met Playwright bewezen.
- [x] Geen upload/delete/reorder-scope vanuit het moments-overzicht toegevoegd.

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
- [x] Gerichte desktop Chrome mouse-drag viewer-smoke toegevoegd en uitgevoerd.
- [x] Task gereconcilieerd en status afgerond na bewijs.

## Uitvoerblokken / fasering

1. Preflight: actuele viewer-, slide- en gallery-smoke state bevestigen zonder brede dirty worktree te wijzigen.
2. Kleinste bronwijziging: Playwright-smoke toevoegen voor fullscreen viewer mouse-drag navigatie; alleen een stabiele web-layer `testID` toegevoegd, omdat de bestaande drag-wiring werkt.
3. Verify: unit-test voor viewer helper, lokale gallery fixture seed, gerichte Playwright-smoke, lint/typecheck/taskflow.
4. Closeout: fixture cleanup, taskfile reconciliation, docs bundle + verify, status naar `done` en verplaatsing naar `done/`.

## Blockers / afhankelijkheden

- Geen blockers meer. De eerdere desktop Chrome mouse-drag onzekerheid is lokaal bevestigd met een gerichte Playwright-smoke.

## Review-notitie

- Lokale desktop-Chrome navigatie met de muis in de fullscreen foto-popup is op 2026-06-22 bevestigd via Playwright; navigatie via de pijliconen is in dezelfde smoke bevestigd.
- Gewenste vervolgrichting na review:
  - slimmer zoomen
  - foto kunnen slepen/pannen wanneer ingezoomd
  - inzoomen rond finger/cursor focuspunt in plaats van standaard naar het midden

## Verify / bewijs

- ✅ `npm run test:unit`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ Extra unit-tests voor viewer swipe-state en web touch-action helper
- ✅ `npm run test:unit -- --run tests/unit/moment-photo-viewer-presentation.test.ts`
- ✅ `npm run test:e2e:gallery:seed`
- ✅ `GALLERY_E2E_FULL=1 SMOKE_TEST_EMAIL=smoke.default.local@example.com GALLERY_E2E_ENTRY_URL=http://localhost:8081/entry/c97394bb-8d84-4d6f-9c8d-6eb8407f5941 GALLERY_E2E_PHOTO_IDS=1c2cb3c9-adab-440e-bee6-41613fa17f9d,42a3fc57-b3ae-454e-a2bf-390ef4f35b86,70ce0a89-122c-484c-a4f5-a3392bd08310 npx playwright test tests/e2e/gallery-full.spec.mjs --grep "navigates the fullscreen viewer"`
- ✅ Nieuwe smoke bevestigt: fullscreen viewer opent, pijliconen navigeren heen/terug, desktop mouse-drag navigeert van foto 1 naar foto 2.
- ✅ `npm run test:e2e:gallery:cleanup`
- ✅ `npm run taskflow:verify`

## Toegevoegde verbeteringen tijdens uitvoering

- Gedeelde `ZoomablePhotoSlide` web-interactielaag heeft een stabiele `testID` gekregen voor browser-smokes.
- `tests/e2e/gallery-full.spec.mjs` bevat nu een gerichte smoke voor fullscreen viewer navigatie via pijlen en desktop mouse-drag.

## Reconciliation voor afronding

- Oorspronkelijk plan: primaire thumbnail in het moments-overzicht, gedeelde viewer, arrows en web drag-swipe werkend krijgen zonder nieuwe upload/delete/reorder-scope.
- Expliciete user requirements: de task deblokkeren met een smalle pass; desktop Chrome mouse-drag in de fullscreen viewer moet bewezen zijn met Playwright.
- Later toegevoegde verbeteringen: alleen een stabiele test-hook en gerichte Playwright-smoke; geen viewer-redesign of zoom-polish toegevoegd.
- Afgerond: thumbnail/viewer-scope was al gebouwd; de resterende blocker is met lokale Chromium-smoke bewezen. Unit, lint, typecheck, taskflow en fixture cleanup zijn geslaagd.
- Open of blocked: geen blocker binnen deze task. Slimmer zoomen, ingezoomd pannen en zoom-focus rond cursor/finger blijven follow-up polish buiten deze afgeronde task.

## Relevante links

- `components/journal/moments-timeline-section.tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-22T13:42:57+02:00 — test: verify moments photo viewer drag

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state