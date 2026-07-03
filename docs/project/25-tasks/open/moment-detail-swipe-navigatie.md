---
id: task-moment-detail-swipe-navigatie
title: Momentdetail swipe navigatie
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-07-03
summary: "Momentdetail ondersteunt nu horizontaal swipen naar vorig/volgend moment, inclusief overgang naar vorige/volgende dag met momenten, zonder permanente visuele redesigns. Unit, lint, taskflow en aanvullende typecheck zijn groen; lokale runtime-smoke staat nog open omdat er geen web target draaide."
tags: [moment-detail, navigation, gestures, ui]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
active_agent: Codex
active_agent_model: unknown
active_agent_runtime: codex
active_agent_since: "2026-07-03T08:01:38.543Z"
active_agent_status: running
active_agent_settings: default
---


## Probleem / context

Op de momentdetailpagina kan de gebruiker nu alleen via terug naar de daglijst en daarna een ander moment openen. De gewenste interactie is direct door momenten heen swipen, zonder dat de momentpagina visueel wordt herontworpen.

## Gewenste uitkomst

De momentdetailpagina ondersteunt swipe links/rechts voor volgend/vorig moment. Als er geen moment in die richting bestaat, beweegt de pagina niet. De navigatie loopt door naar de dichtstbijzijnde vorige of volgende dag met momenten.

## User outcome

Een gebruiker kan op een momentdetailpagina blijven en met horizontale swipes rustig door de eigen momenten bladeren.

## Functional slice

Een afgebakende interactieslice op `app/entry/[id].tsx`: adjacent-moment lookup, swipe-detectie, tijdelijke swipe-beweging en routevervanging naar het gekozen moment.

## Entry / exit

- Entry: gebruiker staat op `/entry/[id]`.
- Exit: gebruiker blijft op momentdetail en ziet na een geldige swipe het vorige of volgende moment, of de pagina blijft op zijn plek wanneer er geen target bestaat.

## Happy flow

1. Gebruiker opent een momentdetailpagina.
2. Gebruiker swipet naar links.
3. De pagina beweegt zichtbaar mee en opent het volgende moment, ook als dat op de volgende dag staat.
4. Gebruiker swipet naar rechts.
5. De pagina beweegt zichtbaar mee en opent het vorige moment, ook als dat op de vorige dag staat.

## Non-happy flows

- Empty state: als het huidige moment niet geladen is, staat swipe uit.
- Permission denied / unavailable: bestaande error-state blijft leidend.
- Validation / unsupported state: ontbrekende entry-id of ontbrekende adjacent target navigeert niet.
- Failure / retry / cancel: bij service-fout blijft de bestaande momentpagina zichtbaar; swipe navigeert niet.

## UX / copy

- Geen permanente nieuwe copy, buttons, labels, cards, borders of redesign.
- Alleen tijdelijke horizontale beweging tijdens swipe is zichtbaar.
- Als er geen vorige of volgende target is, blijft de pagina op `translateX: 0`.
- Swipe links = volgende moment; swipe rechts = vorige moment.

## Data / IO

- Input: huidige normalized entry id en bijbehorende `journal_date` / `captured_at`.
- Output: optioneel vorige en volgende route target met `id` en `journalDate`.
- Opslag/API/service/file-impact: alleen bestaande Supabase reads op `entries_raw` en `entries_normalized`; geen migratie.
- Statussen: geen nieuwe productstatus.

## Waarom nu

Dit is een directe usability-verbetering voor terugzien van momenten en past bij de bestaande momentdetailervaring zonder nieuwe productscope.

## In scope

- Adjacent-moment lookup over dagen heen.
- Gesture-wiring op momentdetail.
- Pure helperlogica met unit-tests.
- Gerichte verify.

## Buiten scope

- Nieuwe navigatieknoppen.
- Redesign van momentdetail.
- Wijzigingen aan foto-viewer swipe/zoom.
- DB-migraties of nieuwe dependencies.

## Oorspronkelijk plan / afgesproken scope

- Horizontaal swipen op momentdetail toevoegen.
- Geen visuele wijzigingen op de momentpagina behalve tijdelijke swipe-feedback.
- Als er geen vorig/volgend moment is, moet dat zichtbaar zijn doordat de pagina niet beweegt.
- Navigatie werkt ook naar vorige en volgende dag.

## Expliciete user requirements / detailbehoud

- "Ik wil kunnen swippen tussen momenten, volgende en vorige."
- "geen visuele wijzigingen op de moment pagina"
- "wel duidelijk visueel als ik op een moment pagina naar links of rechts swipe"
- "als er geen volgende moment of vorige moment is dan visueel zichtbaar ook, door niet bewegen van de pagina"
- "Werkt ook naar de volgende dag en vorige dag."

## Status per requirement

- [x] Swipe tussen volgende en vorige momenten — status: gebouwd
- [x] Geen permanente visuele wijziging op momentpagina — status: gebouwd
- [x] Tijdelijke zichtbare swipe-beweging bij beschikbare target — status: gebouwd
- [x] Geen beweging bij ontbrekende target — status: gebouwd
- [x] Navigatie over daggrenzen heen — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: adjacent lookup + swipe-helper + scherm-wiring bouwen.
- [ ] Blok 3: gerichte tests, verify en taskstatus afronden.

## Concrete checklist

- [x] Adjacent-moment service toevoegen.
- [x] Pure swipe-helperlogica testen.
- [x] Momentdetail met gesture en routevervanging uitbreiden.
- [ ] Verify draaien en taskfile reconciliëren.

## Acceptance criteria

- [x] Swipe links opent het volgende moment.
- [x] Swipe rechts opent het vorige moment.
- [x] Eerste/laatste moment beweegt niet in een ontbrekende richting.
- [x] Volgende/vorige target mag op een andere dag liggen.
- [x] Momentdetail krijgt geen permanente nieuwe UI-elementen.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- ✅ `npm run test:unit -- tests/unit/moment-navigation-presentation.test.ts`
- ✅ `npm run lint`
- ✅ `npx tsc --noEmit --allowImportingTsExtensions`
- ✅ `npm run taskflow:verify`
- ⚠️ `npm run typecheck` faalt nog op bestaande Supabase function importregel: `supabase/functions/admin-regeneration-job/index.ts(27,8): TS5097`.
- ⚠️ Light/dark runtime-smoke niet uitgevoerd: `http://localhost:8081` reageerde niet en er was geen bestaande lokale web target actief.

## Reconciliation voor afronding

- Oorspronkelijk plan: swipe links/rechts tussen momenten, geen permanente visuele wijziging, geen beweging zonder target en navigatie over daggrenzen.
- Toegevoegde verbeteringen: geen.
- Afgerond: adjacent lookup, swipe-helper, gesture-wiring, routevervanging en unit-test.
- Open / blocked: standaard `npm run typecheck` en runtime light/dark smoke blijven open door bestaande Supabase-WIP en ontbrekende lokale web target.

## Relevante links

- `app/entry/[id].tsx`
- `services/day-journals.ts`


## Commits

- 2026-07-03T10:27:50+02:00 — Add moment detail swipe navigation