---
id: task-dag-week-maand-swipe-navigatie
title: Dag/week/maand swipe navigatie
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-04
summary: "Dagdetail, weekreflectie en maandreflectie ondersteunen horizontale swipe-navigatie naar bestaande aangrenzende content zonder visuele redesigns."
tags: [navigation, gestures, day-detail, reflections, swipe]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: [task-moment-detail-swipe-scroll-regressie-fix]
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


# Dag/week/maand swipe navigatie

## Probleem / context

Momentdetail ondersteunt horizontale swipe-navigatie met scrollvriendelijke gesture-afhandeling. Dagdetail, weekreflecties en maandreflecties hebben nog geen vergelijkbare swipe-navigatie.

## Gewenste uitkomst

Dagdetail, weekreflectie en maandreflectie ondersteunen dezelfde swipe-interactie als momentdetail: links naar de volgende bestaande pagina/content en rechts naar de vorige bestaande pagina/content. Als er geen target bestaat, beweegt de pagina niet. Verticale scroll blijft werken.

## User outcome

Een gebruiker kan al lezend door bestaande dagen, weken en maanden bladeren met swipes zonder extra knoppen of visuele wijzigingen.

## Functional slice

Voeg page-level swipe-navigatie toe aan dagdetail en het bestaande gecombineerde week/maand-reflectiescherm.

## Entry / exit

- Entry: gebruiker staat op dagdetail, weekreflectie of maandreflectie.
- Exit: horizontale swipe navigeert/selecteert de aangrenzende bestaande dag/week/maand; verticale beweging scrolt de pagina.

## Happy flow

1. Open dagdetail met een bestaande aangrenzende dag.
2. Swipe links op gewone content.
3. App toont de volgende bestaande dag.
4. Open week- of maandreflectie met een bestaande aangrenzende reflectie.
5. Swipe links op gewone content.
6. App toont de volgende bestaande week- of maandreflectie binnen dezelfde actieve tab.

## Non-happy flows

- Geen target: pagina beweegt niet en navigeert niet.
- Verticale scroll: ScrollView blijft leidend.
- Foto of fotopopup: foto-interactie blijft leidend; geen nieuwe page-swipe wrapper rond fotoviewer-interactie.
- Loading/error/processing: swipe is uitgeschakeld.

## UX / copy

- Geen nieuwe zichtbare UI, labels of copy.
- Hergebruik dezelfde tijdelijke horizontale beweging als momentdetail.
- Geen redesign van dagdetail, reflecties, selector, menu, modals of timeline.

## Data / IO

- Input: actieve `journalDate`, actieve reflectie `period_type` en `period_start`.
- Output: vorige/volgende bestaande `day_journal` of `period_reflection`.
- Opslag/API/service/file-impact: read-only Supabase queries in bestaande service-laag.
- Statussen: bestaande loading/error/processing states blijven leidend.

## Waarom nu

De gebruiker heeft expliciet gevraagd om de moment-swipe functie ook op dag-, week- en maandpagina's toe te voegen.

## In scope

- Gedeelde swipe-presentatiehelper/hook voor page-swipe.
- Dagdetail swipe naar bestaande aangrenzende `day_journals`.
- Week/maand reflectie swipe naar bestaande aangrenzende `period_reflections`.
- Unit-tests en lokale smoke voor scroll + swipe.

## Buiten scope

- Kalender-swipen naar lege dagen/weken/maanden.
- Nieuwe selector-UX of knoppen.
- Nieuwe fotoviewerfunctionaliteit.
- Commit/push, tenzij de gebruiker dat later expliciet vraagt.

## Oorspronkelijk plan / afgesproken scope

Swipe links/rechts toevoegen aan dagdetail, weekreflectie en maandreflectie op basis van bestaande content. Geen target betekent niet bewegen. Verticale scroll blijft werken. Geen visuele wijzigingen. Foto-/viewer-interactie blijft buiten page-swipe.

## Expliciete user requirements / detailbehoud

- "doe nu ook de swipe functie maken voor de dag, week en maand. pagina's"
- Zelfde gedrag als momentdetail-swipe.
- Alleen bestaande content als aangrenzend target.
- Geen zichtbare redesigns.
- Scroll moet blijven werken.

## Status per requirement

- [x] Dagdetail swipe — status: gebouwd en lokaal bewezen
- [x] Weekreflectie swipe — status: gebouwd en lokaal bewezen
- [x] Maandreflectie swipe — status: gebouwd en lokaal bewezen
- [x] Geen target beweegt niet — status: gebouwd via gedeelde clamp-helper en unit-test
- [x] Verticale scroll blijft werken — status: gebouwd en lokaal bewezen
- [x] Geen visuele wijzigingen — status: gebouwd; geen nieuwe zichtbare UI/copy

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en bestaande gesture/servicepatronen bevestigen.
- [x] Blok 2: gedeelde page-swipe helper/hook en service-targets bouwen.
- [x] Blok 3: dagdetail en reflectiescherm aansluiten zonder redesign.
- [x] Blok 4: unit/e2e verify, docs bundle en taskflow afronden.

## Concrete checklist

- [x] Adjacent day service toevoegen en exporteren.
- [x] Adjacent reflection service toevoegen en exporteren.
- [x] Gedeelde page-swipe helper/hook toevoegen met unit-tests.
- [x] Dagdetail aansluiten op page-swipe.
- [x] Reflectiescherm aansluiten op page-swipe.
- [x] Lokale smoke seed/spec/cleanup toevoegen of uitbreiden.
- [x] Verify draaien en taak reconciliëren.

## Acceptance criteria

- [x] Swipe links op dagdetail opent de volgende bestaande dag.
- [x] Swipe rechts op dagdetail gebruikt dezelfde aangrenzende target-logica voor de vorige bestaande dag.
- [x] Swipe links/rechts op weekreflecties selecteert aangrenzende bestaande weekreflectie.
- [x] Swipe links/rechts op maandreflecties selecteert aangrenzende bestaande maandreflectie.
- [x] Zonder aangrenzende target blijft de pagina op zijn plek.
- [x] Verticale scroll werkt op alle drie pagina's.
- [x] Er is geen permanente visuele wijziging.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- Pass: `npm run test:unit -- tests/unit/moment-navigation-presentation.test.ts`
- Pass: `npm run typecheck`
- Pass: `npm run lint`
- Pass: `npm run test:e2e:page-swipe -- --project=chromium`
- Pass: `npm run test:e2e:page-swipe:cleanup`

## Reconciliation voor afronding

- Oorspronkelijk plan: dagdetail, weekreflectie en maandreflectie krijgen momentdetail-achtig swipen naar bestaande aangrenzende content, zonder visuele wijzigingen en zonder scrollregressie.
- Toegevoegde verbeteringen: lokale page-swipe smoke toegevoegd voor dag/week/maand met scrollbewijs en cleanup.
- Afgerond: service-targets, gedeelde page-swipe hook, dagdetail-wiring, reflectie-wiring, unit-tests en e2e smoke.
- Open / blocked: geen open punten voor deze taak.

## Relevante links

- `app/day/[date].tsx`
- `app/(tabs)/reflections.tsx`
- `app/entry/[id].tsx`
- `src/lib/moment-navigation/presentation.ts`
- `services/day-journals.ts`
- `services/reflections.ts`


## Agent activity

- start 2026-07-04T09:21:41.073Z - Codex / gpt-5 / codex / default

- stop 2026-07-04T09:21:41.073Z -> 2026-07-04T09:29:04.483Z - Codex / gpt-5 / codex / default - reason: done


## Commits

- 2026-07-05T09:20:15+02:00 — Add day week month swipe navigation