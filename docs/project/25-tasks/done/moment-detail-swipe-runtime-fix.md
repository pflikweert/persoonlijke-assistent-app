---
id: task-moment-detail-swipe-runtime-fix
title: Momentdetail swipe runtime fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-03
summary: Momentdetail swipe is lokaal getest met herhaalbare Playwright smoke-test; app-root initialiseert nu GestureHandlerRootView voor native/Expo gesture runtime.
tags: [moment-detail, navigation, gestures, regression]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: [task-moment-detail-swipe-navigatie]
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


# Momentdetail swipe runtime fix

## Probleem / context

De swipe-navigatie op momentdetail is eerder gebouwd, maar de gebruiker kan lokaal nog niet tussen momenten swipen.

## Gewenste uitkomst

Swipen links/rechts werkt lokaal op de momentdetailpagina en is zelf getest met runtime-bewijs.

## User outcome

Een gebruiker kan op een momentdetailpagina met een horizontale swipe naar het vorige of volgende moment gaan.

## Functional slice

Alleen de runtime-regressie in de bestaande momentdetail-swipeflow oplossen, inclusief lokale smoke-test.

## Entry / exit

- Entry: gebruiker staat op `/entry/[id]` met een vorig of volgend moment beschikbaar.
- Exit: swipe links/rechts triggert navigatie; zonder target beweegt/navigeert de pagina niet.

## Happy flow

1. Open lokaal een momentdetailpagina.
2. Swipe horizontaal naar links of rechts.
3. De pagina reageert zichtbaar en navigeert naar het adjacent moment.

## Non-happy flows

- Geen adjacent moment: geen navigatie.
- Data niet geladen: bestaande loading/error-state blijft leidend.

## UX / copy

- Geen permanente visuele wijziging of nieuwe copy.
- Alleen de bestaande tijdelijke swipe-feedback mag zichtbaar zijn.

## Data / IO

- Input: bestaande momentdetaildata en adjacent lookup.
- Output: routevervanging naar adjacent moment.
- Geen DB-migratie of nieuwe backend-scope.

## Oorspronkelijk plan / afgesproken scope

- Reproduceer lokaal dat swipen niet werkt.
- Fix de kleinste oorzaak in de bestaande swipe-implementatie.
- Test lokaal zelf dat swipen daarna werkt.

## Expliciete user requirements / detailbehoud

- "ik kon nog niet swippen tussen de momenten"
- "test dit zelf eerst locaal en maak dan de oplossing"

## Status per requirement

- [x] Lokale reproductie/test gedaan — status: gebouwd; lokale web-smoke dekt de swipe-route met echte drag
- [x] Runtime-fix gebouwd — status: gebouwd; app-root initialiseert `GestureHandlerRootView`
- [x] Lokale hertest bewijst swipe — status: gebouwd; Playwright smoke navigeert naar het tweede moment

## Toegevoegde verbeteringen tijdens uitvoering

- Herhaalbare lokale e2e smoke toegevoegd voor momentdetail-swipe met seed/cleanup scripts.

## Uitvoerblokken / fasering

- [x] Blok 1: huidige code en lokale runtime inspecteren.
- [x] Blok 2: oorzaak fixen met minimale wijziging.
- [x] Blok 3: lokaal smoke-testen en verify draaien.

## Concrete checklist

- [x] Codepad van momentdetail-swipe inspecteren.
- [x] Lokale runtime-test uitvoeren.
- [x] Fix implementeren.
- [x] Unit/smoke/verify draaien.

## Acceptance criteria

- [x] Swipe tussen momenten werkt lokaal.
- [x] Geen nieuwe permanente UI-elementen.
- [x] Verify-output is vastgelegd.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- Controle lokale web-smoke: de herhaalbare test opent een lokaal fixture-moment, sleept links binnen de app-shell en verwacht navigatie naar het tweede moment.
- ✅ `npm run test:e2e:moment-swipe -- --project=chromium`
- ✅ `npm run test:unit -- tests/unit/moment-navigation-presentation.test.ts`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run test:e2e:moment-swipe:cleanup`

## Reconciliation voor afronding

- Oorspronkelijk plan: lokaal reproduceren, kleinste oorzaak fixen en daarna lokaal zelf testen dat swipe werkt.
- Toegevoegde verbeteringen: herhaalbare lokale seed/smoke/cleanup voor momentdetail-swipe.
- Afgerond: root gesture setup toegevoegd met `GestureHandlerRootView` en lokale smoke groen gemaakt.
- Open / blocked: geen.

## Relevante links

- `app/entry/[id].tsx`
- `app/_layout.tsx`
- `scripts/seed-local-moment-swipe-smoke.mjs`
- `tests/e2e/moment-swipe-smoke.spec.mjs`
- `services/day-journals.ts`

## Agent activity

- start 2026-07-03T12:06:03.656Z - Codex / gpt-5 / codex / default

- stop 2026-07-03T12:06:03.656Z -> 2026-07-03T12:13:37.915Z - Codex / gpt-5 / codex / default - reason: done
## Commits

- 2026-07-03T14:20:44+02:00 — Fix moment detail swipe runtime
