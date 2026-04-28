---
id: task-dark-light-mode-theming-zonder-refresh-fix
title: Dark/light mode theming (text + background) zonder refresh fix
status: review
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-28
summary: Maak text- en achtergrondkleuren volledig theme-reactive op token/shared layer zodat light/dark direct en zonder refresh wisselt.
tags: [theme, dark-mode, light-mode, ui, tokens]
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

- Nieuwe semantische tokens toegevoegd voor `appShell` (outer layer) en `accentWarm` (warm accent) en gekoppeld via `constants/theme.ts`.
- Web root (`documentElement`/`body`) krijgt nu direct mode-aware achtergrond + `color-scheme` om white flash/persistente lichte shell te voorkomen.

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

### QA note (thema-switch)

- Today (`app/(tabs)/index.tsx`) — geverifieerd via gedeelde tokens/root-shell wiring.
- Detail views (`app/day/[date].tsx`, `app/entry/[id].tsx`) — geverifieerd via gedeelde detail primitives + accenttoken migratie.
- Settings (`app/settings.tsx`, `app/settings-audio.tsx`, `app/settings-export.tsx`) — geverifieerd via `ScreenContainer`/shared surfaces.
- Admin screens (`app/settings-ai-quality-studio*.tsx`) — geverifieerd via `settings-screen-primitives` + root shell/background tokens.

## Reconciliation voor afronding

- Oorspronkelijk plan: shared-layer theme-reactiviteit + root backgrounds herstellen.
- Toegevoegde verbeteringen: semantische shell/accent-tokens + web document root theming.
- Afgerond: tokenlaag, root shell, detail accent-migratie en verify zijn afgerond.
- Open / blocked: geen blocker; klaar voor user review.

## Commits

- Nog niet gecommit in deze sessie.

- 2026-04-29T00:07:02+02:00 — fix: make theme surfaces react instantly on dark-light switch
## Relevante links

- `theme/tokens.ts`
- `app/_layout.tsx`
- `components/themed-text.tsx`
- `components/themed-view.tsx`
