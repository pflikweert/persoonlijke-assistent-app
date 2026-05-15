---
id: task-web-runtime-warnings-styling-accessibility-hardening
title: Web runtime warnings styling accessibility hardening
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Los actuele web/runtime warnings op rond deprecated shadow props, aria-hidden focus-conflicten en deprecated pointerEvents props, zonder functionele redesigns of interactieregressies."
tags: [web, accessibility, polish, overlays, runtime]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 1
---


## Probleem / context

De web/runtime console toont op dit moment concrete warnings rond styling-compatibiliteit en accessibility-gedrag. Het gaat niet om nieuwe features, maar om hardening van bestaande shared surfaces, overlays en detailflows.

De warnings wijzen op drie technische gaten:
- deprecated React Native web shadow props die op web nog doorlekken
- `aria-hidden` op verborgen lagen terwijl een gefocust descendant actief blijft
- deprecated `pointerEvents` usage als prop in plaats van via `style.pointerEvents`

Deze warnings maken de runtime minder schoon, kunnen op termijn compatibiliteitsproblemen geven en vergroten het risico op subtiele accessibility-regressies in momentdetail-, overlay- en navigatieflows.

## Gewenste uitkomst

De relevante web/runtime warnings zijn opgelost zonder zichtbare redesigns of nieuwe dependencies. Shared overlay- en surface-primitives gebruiken moderne compatibele props, en verborgen overlay-content veroorzaakt geen focusconflict meer.

De momentdetailflow, overlays, modals en bottom-nav blijven hetzelfde werken voor klik, touch, ESC/back en keyboard-focus, maar zonder de huidige console-waarschuwingen.

## User outcome

Gebruikers merken geen redesign, maar de webapp voelt technisch stabieler: overlays en detailschermen blijven correct toegankelijk en interactioneel betrouwbaar, ook met keyboard-focus op web.

## Functional slice

Een kleine hardening-slice: deprecated web props opsporen en moderniseren in bestaande shared components, accessibility-conflict bij verborgen overlays oplossen, daarna gerichte runtime-smoke op momentdetail- en overlayflows.

## Entry / exit

- Entry: gebruiker opent day detail, momentdetail en bestaande overlays/menu's/modals in de webapp.
- Exit: dezelfde flows werken nog steeds, maar de console toont geen warnings meer voor deprecated shadow props, `aria-hidden` focusconflict of deprecated `pointerEvents`.

## Happy flow

1. De relevante shared overlay-, backdrop-, navigation- en surface-componenten worden gevonden en aangepast zonder visuele redesign.
2. Deprecated shadow props worden op web vervangen door een compatibele `boxShadow`-richting, terwijl native gedrag intact blijft.
3. Overlay-hidden state behandelt focus correct en `pointerEvents` usage is web-compatibel, waarna runtime-smoke bevestigt dat console en interacties schoon blijven.

## Non-happy flows

- Empty state: niet van toepassing; deze taak gaat over bestaande runtime warnings.
- Permission denied / unavailable: als een specifieke browserwarning niet lokaal reproduceerbaar blijkt, vastleggen met concrete route/componentcontext in plaats van gokken.
- Validation / unsupported state: native-only style paths mogen behouden blijven zolang web een compatibele fallback krijgt.
- Failure / retry / cancel: als een fix een overlay- of focusregressie veroorzaakt, terugschalen naar de kleinste veilige shared fix in plaats van grotere architectuurwijzigingen.

## UX / copy

- Geen nieuwe user-facing copy.
- Geen redesign van overlays, momentdetail, navigatie of bottom tabs.
- Bestaande shared components en UI-structuur blijven leidend.

## Data / IO

- Input: bestaande shared UI components, overlay/backdrop primitives en detail surfaces die op web warnings veroorzaken.
- Output: schonere web/runtime zonder de drie actuele warningtypes.
- Opslag/API/service/file-impact: geen dataflow- of API-wijzigingen; alleen shared UI/runtime hardening.
- Statussen:
  - warnings gelokaliseerd
  - shadow-fix gebouwd
  - aria-hidden/focus-fix gebouwd
  - pointerEvents-fix gebouwd
  - runtime-smoke bevestigd

## Waarom nu

- De warnings zitten in actuele webflows rond momentdetail en overlays.
- Dit is goedkope technische hardening die toekomstige web- en accessibility-regressies voorkomt zonder productscope te verbreden.

## In scope

- Deprecated shadow prop usage op web opsporen en moderniseren.
- `aria-hidden` focusconflict op verborgen overlays/modals/menu's oplossen.
- Deprecated `pointerEvents` prop usage vervangen door `style.pointerEvents` waar relevant.
- Gerichte runtime-smoke op day detail, momentdetail, overlays/menu's/modals en keyboard-focus.

## Buiten scope

- Nieuwe dependencies of accessibility-library.
- Nieuwe overlayarchitectuur.
- Routing- of animatiesysteemwijzigingen.
- Visuele redesigns van surfaces, modals, menu's of bottom nav.
- Nieuwe feature- of flow-uitbreidingen.

## Oorspronkelijk plan / afgesproken scope

- Maak een aparte hardening/polish-taak voor de actuele console warnings.
- Los alleen de drie genoemde warningfamilies op.
- Houd gedrag en vormgeving zoveel mogelijk gelijk, behalve waar accessibility-correctheid een kleine gedragsfix vereist.

## Expliciete user requirements / detailbehoud

1. Geen redesign.
2. Geen nieuwe dependencies.
3. Geen gedragswijzigingen tenzij nodig voor accessibility-correctheid.
4. Shadow warning oplossen via moderne compatibele oplossing zoals `boxShadow`, zonder native te breken.
5. `aria-hidden` focus warning correct oplossen volgens web accessibility best practices.
6. Geen keyboard trap of focusverliesbug introduceren.
7. `pointerEvents` als deprecated prop vervangen zonder click/touch regressies.
8. Overlays, backdrops, bottom nav en capture/menu flows moeten werkend blijven.
9. Runtime-smoke moet expliciet keyboard-focus en open/sluit gedrag op web meenemen.

## Status per requirement

- [ ] Deprecated shadow prop paths zijn gelokaliseerd en opgelost — status: niet gebouwd
- [ ] `aria-hidden` focusconflict is opgelost zonder accessibility-regressie — status: niet gebouwd
- [ ] Deprecated `pointerEvents` prop usage is vervangen — status: niet gebouwd
- [ ] Gerichte web/runtime-smoke bevestigt schone console en werkende interacties — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog leeg.

## Uitvoerblokken / fasering

- [ ] Blok 1: warningbronnen en relevante shared components lokaliseren.
- [ ] Blok 2: kleinste shared hardening-fixes uitvoeren.
- [ ] Blok 3: runtime-smoke, verify en docs/task-afronding.

## Concrete checklist

- [ ] Shadow-props op web doorzoeken en compatibele oplossing kiezen.
- [ ] Overlay/focus-conflict rond `aria-hidden` reproduceren en fixen.
- [ ] `pointerEvents` prop-usage doorzoeken en vervangen.
- [ ] Day detail, momentdetail en overlayflows op web smoke-testen.
- [ ] Lint/typecheck/taskflow/docs verify afronden.

## Acceptance criteria

- [ ] Console toont geen warning meer voor deprecated shadow props.
- [ ] Console toont geen `aria-hidden` focus warning meer bij overlay/menu/modal gebruik.
- [ ] Console toont geen warning meer voor deprecated `pointerEvents` prop usage.
- [ ] Overlays en detailflows blijven klikbaar, focusbaar en visueel ongewijzigd binnen normale tolerantie.

## Blockers / afhankelijkheden

- Geen externe blockers verwacht; afhankelijk van lokale web reproduceerbaarheid van de warnings.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- Runtime smoke:
  1. open day detail
  2. open momentdetail
  3. open/sluit overlays/menu's/modals
  4. gebruik keyboard focus op web
  5. bevestig geen shadow/aria-hidden/pointerEvents warnings
  6. bevestig klik/touch/focus/ESC/back/bottom-nav gedrag
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: actuele web/runtime warnings oplossen zonder redesigns.
- Toegevoegde verbeteringen: nog te bepalen tijdens uitvoering.
- Afgerond: nog te bepalen.
- Open / blocked: nog te bepalen.

## Relevante links

- `docs/project/open-points.md`
- `components/navigation/fullscreen-menu-overlay.tsx`
- `components/ui/modal-backdrop.tsx`
- `components/ui/detail-screen-primitives.tsx`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish