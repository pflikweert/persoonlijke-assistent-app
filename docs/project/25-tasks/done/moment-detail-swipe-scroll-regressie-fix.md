---
id: task-moment-detail-swipe-scroll-regressie-fix
title: Momentdetail swipe scroll regressie fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-03
summary: Verticale scroll op momentdetail is hersteld terwijl horizontale swipe op body-content blijft werken en foto-interactie uitgesloten blijft.
tags: [moment-detail, navigation, gestures, scroll, regression]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: [task-moment-detail-swipe-body-gesture-fix]
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


# Momentdetail swipe scroll regressie fix

## Probleem / context

Na het uitbreiden van swipe naar body-content werkt horizontaal swipen goed, maar verticaal scrollen op de momentdetailpagina niet meer.

## Gewenste uitkomst

De pagina scrolt weer normaal verticaal. Horizontale swipe blijft werken op gewone content, en foto’s/fotopopups blijven uitgesloten.

## User outcome

Een gebruiker kan door lange momenten scrollen en op dezelfde pagina horizontaal naar vorige/volgende momenten swipen.

## Functional slice

Alleen de responder/gesture-laag van `app/entry/[id].tsx` aanpassen.

## Entry / exit

- Entry: gebruiker sleept verticaal op normale content.
- Exit: de ScrollView scrolt; alleen duidelijke horizontale beweging claimt moment-swipe.

## Happy flow

1. Open momentdetail.
2. Sleep verticaal op body-content.
3. Pagina scrolt.
4. Sleep horizontaal op body-content.
5. App navigeert naar adjacent moment.

## Non-happy flows

- Foto of fotopopup: eigen foto-interactie blijft leidend.
- Geen adjacent moment: geen momentnavigatie.

## UX / copy

- Geen visuele wijziging of nieuwe copy.

## Data / IO

- Geen datawijziging.

## Oorspronkelijk plan / afgesproken scope

- Scrollen herstellen.
- Swipe behouden.
- Foto’s/fotopopups blijven buiten scope van moment-swipe.

## Expliciete user requirements / detailbehoud

- "swipen werkt goed"
- "scrollen op de pagina werkt niet meer"

## Status per requirement

- [x] Verticaal scrollen hersteld — status: gebouwd en lokaal bewezen met Playwright smoke
- [x] Horizontale swipe blijft werken — status: gebouwd en lokaal bewezen met Playwright smoke
- [x] Foto-interactie blijft uitgesloten — status: gebouwd; gallery/fotopopup blijven buiten de body gesture-wrappers

## Uitvoerblokken / fasering

- [x] Blok 1: gesture/responder-laag inspecteren.
- [x] Blok 2: scrollvriendelijke responder-fix bouwen.
- [x] Blok 3: lokale swipe/scroll verify draaien.

## Concrete checklist

- [x] Body gesture-laag aanpassen zodat verticale beweging niet gecaptured wordt.
- [x] Swipe-smoke uitbreiden of draaien.
- [x] Lint/typecheck/taskflow uitvoeren waar mogelijk.

## Acceptance criteria

- [x] Verticale scroll wordt niet geblokkeerd door moment-swipe.
- [x] Body-swipe naar adjacent moment blijft werken.
- [x] Geen permanente visuele wijziging.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- Pass: `npm run lint`
- Pass: `npm run test:unit -- tests/unit/moment-navigation-presentation.test.ts`
- Pass: `npm run test:e2e:moment-swipe -- --project=chromium`
- Pass: `npm run test:e2e:moment-swipe:cleanup`
- Blocked unrelated WIP: `npm run typecheck` faalt op `supabase/functions/admin-regeneration-job/index.ts` met `acc.total`, `acc.queued`, `acc.openai_completed`, `acc.applied` en `acc.failed` als `unknown`.

## Reconciliation voor afronding

- Oorspronkelijk plan: scrollen herstellen, body-swipe behouden en foto’s/fotopopups buiten moment-swipe houden.
- Toegevoegde verbeteringen: Playwright smoke uitgebreid zodat dezelfde fixture eerst verticale scroll en daarna body-swipe naar het volgende moment bewijst.
- Afgerond: gesture pan faalt nu sneller bij verticale beweging en web krijgt `touchAction: "pan-y"` op de swipe-surfaces; body-swipe blijft groen in de smoke.
- Open / blocked: geen open punten voor deze taak; repo-brede typecheck wordt geblokkeerd door bestaande unrelated admin-regeneration WIP.

## Relevante links

- `app/entry/[id].tsx`
- `tests/e2e/moment-swipe-smoke.spec.mjs`

## Agent activity

- start 2026-07-03T12:51:15.026Z - Codex / gpt-5 / codex / default

- stop 2026-07-03T12:51:15.026Z -> 2026-07-03T12:57:01.404Z - Codex / gpt-5 / codex / default - reason: done
## Commits

- 2026-07-03T15:10:16+02:00 — Fix moment detail swipe scroll
