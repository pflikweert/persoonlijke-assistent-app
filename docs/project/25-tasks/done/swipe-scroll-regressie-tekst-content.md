---
id: task-swipe-scroll-regressie-tekst-content
title: Swipe scroll regressie tekst/content
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-05
summary: "Verticale scroll op tekst en middencontent werkt weer voor moment, dag, week en maand terwijl horizontale swipe blijft werken."
tags: [navigation, gestures, scroll, regression]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: [task-dag-week-maand-swipe-navigatie]
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


# Swipe scroll regressie tekst/content

## Probleem / context

Na uitbreiding van swipe naar moment, dag, week en maand werkt verticale scroll op tekstvlakken en middencontent nog niet betrouwbaar.

## Gewenste uitkomst

Gebruikers kunnen vanaf tekst en midden van de pagina normaal verticaal scrollen op momentdetail, dagdetail, weekreflectie en maandreflectie. Horizontale swipe blijft werken.

## User outcome

Een gebruiker kan lange teksten lezen door gewoon te scrollen en kan daarnaast horizontaal swipen tussen aangrenzende content.

## Functional slice

Alleen de gesture/responder-laag voor bestaande swipe-navigatie aanpassen.

## Entry / exit

- Entry: gebruiker sleept verticaal op tekst of middencontent.
- Exit: de pagina scrolt; alleen duidelijke horizontale intentie activeert swipe.

## Happy flow

1. Open een lange moment-, dag-, week- of maandpagina.
2. Sleep verticaal op tekst/middencontent.
3. De pagina scrolt.
4. Sleep duidelijk horizontaal.
5. De pagina navigeert naar aangrenzende bestaande content.

## Non-happy flows

- Geen aangrenzende target: pagina beweegt niet.
- Foto/fotoviewer: eigen interactie blijft leidend.
- Loading/error/processing: swipe blijft uit.

## UX / copy

- Geen visuele wijziging of nieuwe copy.

## Data / IO

- Geen datawijziging.

## Oorspronkelijk plan / afgesproken scope

- Verticale scroll op tekst/middencontent herstellen voor moment, dag, week en maand.
- Swipe links/rechts behouden.
- Geen visuele wijzigingen.

## Expliciete user requirements / detailbehoud

- "Verticaal scrollen werkt nog niet goed"
- "wanneer ik op een tekst vlak of midden van de pagina naar beneden wil scrollen werkt dit nog niet"
- "zowel moment, dag, week en maand"

## Status per requirement

- [x] Moment scroll op tekst/middencontent — status: gebouwd en lokaal bewezen
- [x] Dag scroll op tekst/middencontent — status: gebouwd en lokaal bewezen
- [x] Week scroll op tekst/middencontent — status: gebouwd en lokaal bewezen
- [x] Maand scroll op tekst/middencontent — status: gebouwd en lokaal bewezen
- [x] Horizontale swipe behouden — status: gebouwd en lokaal bewezen

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: huidige gesture wrappers inspecteren.
- [x] Blok 2: scrollvriendelijke swipe-activatie bouwen.
- [x] Blok 3: unit/e2e verify en taskflow afronden.

## Concrete checklist

- [x] Momentdetail gesture aanpassen.
- [x] Page-swipe hook voor dag/week/maand aanpassen.
- [x] Smoke-tests scrollen vanaf tekst/middencontent laten bewijzen.
- [x] Verify draaien.

## Acceptance criteria

- [x] Verticaal scrollen werkt op tekst/middencontent voor moment.
- [x] Verticaal scrollen werkt op tekst/middencontent voor dag.
- [x] Verticaal scrollen werkt op tekst/middencontent voor week.
- [x] Verticaal scrollen werkt op tekst/middencontent voor maand.
- [x] Horizontale swipe blijft werken.
- [x] Geen permanente visuele wijziging.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- Pass: `npm run test:unit -- tests/unit/moment-navigation-presentation.test.ts`
- Pass: `npm run typecheck`
- Pass: `npm run lint`
- Pass: `npm run test:e2e:moment-swipe -- --project=chromium`
- Pass: `npm run test:e2e:page-swipe -- --project=chromium`
- Pass: `npm run test:e2e:moment-swipe:cleanup`
- Pass: `npm run test:e2e:page-swipe:cleanup`

## Reconciliation voor afronding

- Oorspronkelijk plan: verticale scroll op tekst/middencontent herstellen voor moment, dag, week en maand, met behoud van horizontale swipe.
- Toegevoegde verbeteringen: smokes gebruiken nu echte Chromium touch events voor verticale drag en horizontale swipe, zodat deze regressie niet door alleen wheel-scroll gemist wordt.
- Afgerond: content-level RNGH gesture-claim vervangen door scrollvriendelijke responder-activatie; moment gebruikt dezelfde page-swipe hook als dag/week/maand.
- Open / blocked: geen open punten voor deze taak.

## Relevante links

- `app/entry/[id].tsx`
- `app/day/[date].tsx`
- `app/(tabs)/reflections.tsx`
- `hooks/use-page-swipe-navigation.ts`


## Agent activity

- start 2026-07-05T07:28:01.822Z - Codex / gpt-5 / codex / default

- stop 2026-07-05T07:28:01.822Z -> 2026-07-05T07:33:43.404Z - Codex / gpt-5 / codex / default - reason: done


## Commits

- 2026-07-05T09:49:46+02:00 — Fix swipe text scroll regression