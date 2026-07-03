---
id: task-moment-detail-swipe-body-gesture-fix
title: Momentdetail swipe body gesture fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-03
summary: Momentdetail swipe werkt nu ook op normale body-content; foto-galerij en fotopopup blijven buiten de moment-swipe detectorlaag.
tags: [moment-detail, navigation, gestures, regression]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: [task-moment-detail-swipe-runtime-fix]
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---


# Momentdetail swipe body gesture fix

## Probleem / context

Swipen tussen momenten werkt nu alleen in de top header. De rest van de momentdetailpagina hoort ook swipebaar te zijn, maar foto’s en fotopopups mogen niet door momentnavigatie worden gekaapt.

## Gewenste uitkomst

Horizontale swipe-navigatie werkt op de inhoud van de momentdetailpagina en blijft uitgeschakeld op foto-interactiegebieden.

## User outcome

Een gebruiker kan op vrijwel de hele momentpagina naar vorig/volgend moment swipen zonder precies de header te hoeven raken.

## Functional slice

Alleen de touch/gesture-laag van momentdetail aanpassen en lokaal testen op body-swipe.

## Entry / exit

- Entry: gebruiker staat op `/entry/[id]` met een adjacent moment.
- Exit: swipe op gewone body-content navigeert; foto’s/fotopopups behouden hun eigen interactie.

## Happy flow

1. Open momentdetail.
2. Swipe horizontaal op normale content onder de header.
3. App navigeert naar het volgende of vorige moment.

## Non-happy flows

- Swipe op foto of fotopopup: geen momentnavigatie.
- Geen adjacent target: geen navigatie.

## UX / copy

- Geen nieuwe permanente UI of copy.
- Bestaande tijdelijke swipe-feedback blijft leidend.

## Data / IO

- Geen datawijziging.
- Alleen lokale UI/gesture-code en smoke-test.

## Oorspronkelijk plan / afgesproken scope

- Body-swipe werkend maken.
- Foto’s en fotopopups uitsluiten.
- Lokaal zelf testen.

## Expliciete user requirements / detailbehoud

- "werkt alleen nog maar in de top header het swippen"
- "dit moet ook op de rest van de pagina werken"
- "behalve op fotos of in de foto popups"

## Status per requirement

- [x] Body-swipe werkt — status: gebouwd en lokaal getest
- [x] Foto’s/fotopopups kapen moment-swipe niet — status: gebouwd; `EntryPhotoGallery` blijft buiten de nieuwe body-detectors
- [x] Lokale test uitgevoerd — status: gebouwd

## Uitvoerblokken / fasering

- [x] Blok 1: eventlaag en lokale smoke aanscherpen.
- [x] Blok 2: gesture fix implementeren.
- [x] Blok 3: lokaal smoke/verify draaien.

## Concrete checklist

- [x] Body-swipe lokaal reproduceren/testen.
- [x] Touchlaag fixen zonder foto-interactie te kapen.
- [x] Smoke-test updaten voor body-zone.
- [x] Verify draaien.

## Acceptance criteria

- [x] Swipe op normale content onder de header navigeert.
- [x] Foto-interactiegebied blijft uitgesloten.
- [x] Geen permanente visuele wijziging.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- ✅ `npm run test:e2e:moment-swipe -- --project=chromium`
- ✅ `npm run test:unit -- tests/unit/moment-navigation-presentation.test.ts`
- ✅ `npm run lint`
- ⚠️ `npm run typecheck` faalt op bestaande unrelated WIP in `app/settings-regeneration.tsx` (`label` property op regeneration scope type), niet op de momentdetail-wijziging.
- ✅ `npm run test:e2e:moment-swipe:cleanup`

## Reconciliation voor afronding

- Oorspronkelijk plan: body-swipe werkend maken, foto’s/fotopopups uitsluiten en lokaal zelf testen.
- Toegevoegde verbeteringen: de lokale moment-swipe smoke sleept nu expliciet op bodytekst in plaats van op een algemene viewportpositie.
- Afgerond: header, primaire body-content en detailkaart hebben eigen moment-swipe detectors; `EntryPhotoGallery` blijft buiten de body-swipe detectors.
- Open / blocked: geen voor deze task; volledige typecheck wordt geblokkeerd door bestaande unrelated regeneration-WIP.

## Relevante links

- `app/entry/[id].tsx`
- `components/ui/screen-primitives.tsx`
- `tests/e2e/moment-swipe-smoke.spec.mjs`

## Agent activity

- start 2026-07-03T12:30:20.966Z - Codex / gpt-5 / codex / default

- stop 2026-07-03T12:30:20.966Z -> 2026-07-03T12:33:48.332Z - Codex / gpt-5 / codex / default - reason: done
## Commits

- 2026-07-03T14:39:01+02:00 — Fix moment detail body swipe
