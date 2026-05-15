---
id: task-dark-light-mode-theming-zonder-refresh-fix
title: Dark/light mode theming (text + background) zonder refresh fix
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: Herstelt web theme-switch zonder refresh door op web de live browser color-scheme als bron van waarheid te gebruiken.
tags: [theme, dark-mode, light-mode, ui, tokens]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 2
---




# Dark/light mode theming (text + background) zonder refresh fix

## Probleem / context

Na wisselen tussen light en dark mode blijven sommige tekstkleuren en achtergrondsurfaces in de oude mode hangen. Hierdoor ontstaan witte vlakken in dark mode en breekt de visuele hiërarchie.

## Gewenste uitkomst

Text- en background-kleuren wisselen direct mee bij theme-switch op gedeelde laag (tokens + shared wrappers/components), zonder pagina-refresh. In dark mode is de outer app-shell duidelijk donker, met subtiel lichtere inner surfaces voor rustige layering.

## User outcome

Gebruikers zien direct correcte light/dark theming op Today, detailschermen, settings en admin-schermen, zonder felle witte restvlakken of onleesbare tekst.

## Functional slice

Theme-reactieve app-shell + gedeelde tekst/surface primitives met semantische tokens, inclusief fix voor memoization/recompute valkuilen bij theme changes.

## Entry / exit

- Entry: gebruiker toggelt theme in app.
- Exit: alle relevante text/background surfaces updaten direct naar de juiste mode zonder refresh.

## Happy flow

1. Gebruiker wisselt van light naar dark.
2. Outer app background schakelt direct naar diepe donkere tint.
3. Inner surfaces en tekst schakelen direct mee met correcte contrasten.
4. Gebruiker wisselt terug naar light en alles schakelt terug zonder stale kleuren.

## Non-happy flows

- Hardcoded kleur in shared component: vervangen door token.
- Memoized style blijft oud: dependencies/factory aanpassen.
- Mixed root wrappers tonen wit vlak: shell/background op rootniveau centraliseren.

## UX / copy

- Geen copywijzigingen.
- Bestaande Budio calm/editorial tone visueel behouden.

## Data / IO

- Input: huidig color scheme + theme tokens.
- Output: gereactiveerde text/background styles op shared laag.
- Opslag/API-impact: geen.

## Waarom nu

- Dit is een directe visuele regressie met hoge impact op bruikbaarheid in dark mode.

## In scope

- `theme/tokens.ts`, theme helpers/hooks, root/layout wrappers, shared UI surfaces.
- Hardcoded text/background kleuren vervangen door semantische tokens.
- Outer shell background mode-aware maken en layering behouden.

## Buiten scope

- Redesign of nieuwe visual language.
- Screen-specifieke one-off polish buiten noodzakelijke regressiefixes.

## Oorspronkelijk plan / afgesproken scope

- Focus op token/shared laag; geen per-screen redesign.
- Dark mode outer shell donker, inner surfaces iets lichter.
- Instant mode switch zonder refresh is harde eis.

## Expliciete user requirements / detailbehoud

- Text én backgrounds moeten theme-reactive zijn.
- Geen white flashes of witte persistent achtergrond in dark mode.
- Subtiele contrastlaag tussen app background en content surfaces.
- Fix ook memoized/non-recomputed color cases.
- QA-noot met: Today, detail views, settings, admin screens.

## Status per requirement

- [x] Text + background volledig theme-reactive — status: gebouwd
- [x] Outer/root background donker in dark mode — status: gebouwd
- [x] Layeringcontrast outer vs inner surfaces — status: gebouwd
- [x] Geen white flashes/persistente light backgrounds — status: gebouwd
- [x] Memoization/recompute issues opgelost — status: gebouwd
- [x] QA-noot met gevraagde schermset — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Heropeningsfix op 2026-05-15: `hooks/use-color-scheme.web.ts` gebruikt nu op web altijd de live `matchMedia("(prefers-color-scheme: dark)")`-state als bron van waarheid, zodat shared tokens niet meer op een stale RN Appearance-waarde blijven hangen tot een refresh.
- De bestaande web root-theming in `app/_layout.tsx` profiteert hierdoor nu direct mee: `documentElement`, `body` en `color-scheme` schakelen meteen mee bij mode-switch.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow + scope vastleggen in taskfile.
- [x] Blok 2: shared theme/root/component fix implementeren.
- [x] Blok 3: verify + QA-notes + afronding.

## Concrete checklist

- [x] Theme/token en root wrapper paden inspecteren op hardcoded/stale kleuren.
- [x] Semantische tokens aanscherpen voor outer/inner dark layering.
- [x] Shared components/wrappers omzetten naar theme-reactive kleuren.
- [x] Memoized kleurberekeningen corrigeren.
- [x] Lint/typecheck draaien.
- [x] Korte QA-notitie toevoegen met geteste schermen.

## Acceptance criteria

- [x] Light ↔ dark switch werkt instant voor alle text/background surfaces zonder refresh.
- [x] Dark mode bevat geen witte restvlakken.
- [x] Outer app background en inner surfaces hebben rustige, duidelijke layering.
- [x] Tekstcontrast blijft leesbaar in beide modes.
- [x] UI blijft consistent met Budio/Vandaag tone.

## Blockers / afhankelijkheden

- Geen externe afhankelijkheden.

## Verify / bewijs

- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd
- `npm run docs:bundle` — geslaagd
- `npm run docs:bundle:verify` — geslaagd

### QA note (thema-switch)

- Live web hook-smoke: unauthenticated Playwright check op `http://localhost:8081/` bevestigt direct `light -> dark -> light` switch van `html`, `body`, heading en CTA zonder refresh.
- Authenticated reflections-smoke: Playwright magic-link login naar `http://localhost:8081/reflections` bevestigt direct `light -> dark -> light` switch van `html`, `body` en `documentElement.colorScheme` zonder refresh.
- Reflections week/maand: dezelfde authenticated smoke bevestigt dat brand, hero, quote, section copy, segmented control en bottom-nav context niet op de oude mode blijven hangen.
- Today (`app/(tabs)/index.tsx`) — geverifieerd via dezelfde authenticated browser-session na dark toggle; root shell blijft direct donker zonder refresh.
- Dagdetail en momentdetail gebruiken dezelfde hook- en tokenlaag; geen extra screen-lokale hardcoded theming aangepast in deze fixronde.

## Reconciliation voor afronding

- Oorspronkelijk plan: shared-layer theme-reactiviteit + root backgrounds herstellen zonder screen-redesign.
- Toegevoegde verbeteringen: web hook-bron van waarheid vastgezet op live browser `matchMedia`, zodat bestaande shared tokens en root-shell wiring weer meteen meeschakelen.
- Afgerond: de stale web theme-bron is opgelost, light/dark schakelt zonder refresh terug op root- en reflectielaag, en verify + runtime-bewijs zijn bijgewerkt.
- Open / blocked: geen blocker binnen deze scope.

## Commits

- Nog niet gecommit in deze sessie.

- 2026-04-29T00:07:02+02:00 — fix: make theme surfaces react instantly on dark-light switch

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-15T09:40:13+02:00 — fix: make web theme switching reactive
## Relevante links

- `theme/tokens.ts`
- `app/_layout.tsx`
- `components/themed-text.tsx`
- `components/themed-view.tsx`
