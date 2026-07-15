---
id: task-budio-webapp-compatible-maken
title: Budio webapp compatible maken
status: review
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-07-15
summary: "Maak Budio Vandaag installeerbaar als verzorgde PWA met correcte merkiconen, Chromium-installatieprompt en een rustige instellingenfallback."
tags: [pwa, webapp, installatie, modal, local-storage]
workstream: app
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



## Probleem / context

Gebruikers van de webversie kunnen de app momenteel niet eenvoudig installeren als Progressive Web App (PWA) op hun desktop. Dit beperkt de gebruikerservaring, vooral voor Android-gebruikers die geen native app beschikbaar hebben. Een installatieprompt zou de toegankelijkheid verbeteren en de app meer app-achtig maken.

## Gewenste uitkomst

Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een modal met de vraag om de app op de desktop te installeren. Als de gebruiker weigert, onthoud dit met een cookie zodat de prompt niet herhaald wordt. De gebruiker kan de installatieoptie altijd heractiveren via instellingen. Gebruik juiste iconen, naam en manifestinstellingen voor een professionele installatie-ervaring.

## User outcome

Een ingelogde webgebruiker kan Budio Vandaag met herkenbare merkiconen als zelfstandige app installeren. Als de browser geen programmeerbare installatieprompt ondersteunt, blijft via Instellingen een korte, bruikbare uitleg beschikbaar.

## Functional slice

Een complete installatieslice voor de bestaande Expo-webapp: manifest en iconset, globale Chromium-prompt, user-scoped afwijzing en een instellingenactie met niet-Chromium fallback.

## Entry / exit

- Entry: ingelogde gebruiker opent de webapp in een browser.
- Exit bij Chromium: gebruiker installeert Budio, kiest `Later` of sluit de browserprompt.
- Exit bij Safari/Firefox: gebruiker opent `Budio installeren` in Instellingen en krijgt handmatige installatie-uitleg.

## Happy flow

1. Chromium stelt `beforeinstallprompt` beschikbaar.
2. Budio toont na login de rustige installatiemodal.
3. De gebruiker kiest `Installeren` en accepteert de browserprompt.
4. De geïnstalleerde app opent standalone met naam en iconen uit het manifest.

## Non-happy flows

- `Later` of een geweigerde browserprompt wordt per gebruiker in local storage onthouden.
- Als local storage niet beschikbaar is, blijft de afwijzing alleen voor de huidige sessie actief.
- Zonder `beforeinstallprompt` verschijnt geen automatische modal; Instellingen toont een korte browsermenu-uitleg.
- In standalone modus verschijnen modal en instellingenactie niet.
- Een fout tijdens `prompt()` crasht de app niet en valt terug op de handmatige uitleg.

## UX / copy

- Modaltitel: `Budio installeren`.
- Primaire actie: `Installeren`.
- Secundaire actie: `Later`.
- Instellingenrij: `Budio installeren`.
- Fallback: `Gebruik de installatieoptie in het menu van je browser. Zie je die niet, dan ondersteunt deze browser installatie niet.`
- Gebruik bestaande modal-backdrop, tokens en rustige Budio-hiërarchie; geen redesign.

## Data / IO

- Input: Supabase user-id, `beforeinstallprompt`, `appinstalled`, display-mode en local storage.
- Opslagsleutel: `budio.pwa-install.dismissed.v1:<userId>` met waarde `1`.
- Output: browserinstallatieprompt of handmatige uitleg; geen server- of databasewrites.

## Waarom nu

- We hebben nog geen Android en iOS apps beschikbaar, dus voor Android-gebruikers (zoals ikzelf) is dit een handige tussenoplossing.
- Verbetert de gebruikerservaring op web zonder afhankelijk te zijn van app stores.
- Voorbereiding op bredere PWA-adoptie.

## In scope

- Bijwerken of aanmaken van web app manifest (manifest.json) met juiste iconen, naam en instellingen.
- Implementeren van PWA-installatie logica in de app (detectie van 'beforeinstallprompt' event).
- Creëren van een installatiemodal component met duidelijke call-to-action.
- Toevoegen van user-scoped local storage om gebruikerskeuze te onthouden, met sessiefallback wanneer storage geblokkeerd is.
- Integreren van een actie in het instellingenscherm om installatie opnieuw aan te bieden of handmatige uitleg te tonen.
- Testen op verschillende browsers (Chrome, Firefox, Safari) voor compatibiliteit.

## Buiten scope

- Ontwikkeling van native Android/iOS apps.
- Uitbreiding naar andere PWA-features zoals offline caching of push notifications (tenzij direct gerelateerd aan installatie).
- Browser-specifieke aanpassingen buiten standaard PWA-ondersteuning.

## Concrete checklist

- [x] Onderzoek huidige PWA-compatibiliteit en manifest.json controleren/bijwerken.
- [x] Implementeer 'beforeinstallprompt' event listener in app root (\_layout.tsx).
- [x] Creëer PwaInstallModal component met installatieknop en 'later' optie.
- [x] Voeg user-scoped local-storage-logica toe voor onthouden van gebruikerskeuze, zonder nieuwe dependency.
- [x] Integreer modal in hoofdapp flow (toon alleen voor ingelogde webgebruikers).
- [x] Voeg instellingenactie toe voor heractiveren van prompt of browserfallback.
- [x] Test Chromium-flow, Firefox/WebKit-fallback en local-storage-functionaliteit.
- [x] Update taskdocumentatie en reproduceerbaar testbewijs.

## Blockers / afhankelijkheden

- Geen blockers; kan parallel lopen met andere features.
- Afhankelijk van Expo/React Native Web voor PWA-ondersteuning (al aanwezig).

## Oorspronkelijk plan / afgesproken scope

- Voeg manifest, correcte Budio-iconen en HTML-metadata toe volgens Expo PWA-richtlijnen.
- Bouw een Chromium-installatieprompt voor ingelogde webgebruikers.
- Onthoud afwijzing per gebruiker en maak heractivatie via Instellingen mogelijk.
- Geef Safari en Firefox via Instellingen korte handmatige uitleg.
- Houd service workers, offline caching, push en native appwijzigingen buiten scope.

## Expliciete user requirements / detailbehoud

- De volledige goedgekeurde planstructuur blijft leidend tijdens uitvoering.
- De iconen moeten visueel correct staan: 192×192, 512×512, maskable 512×512 en Apple touch 180×180 vanuit het bestaande Budio Vandaag-SVG.
- Chromium krijgt de echte prompt; Safari en Firefox krijgen alleen instellingenfallback.
- Geen nieuwe dependency en geen service worker.

## Status per requirement

- [x] Manifest, HTML-metadata en iconset — status: gebouwd en export-bewezen.
- [x] Chromium-installatieflow na login — status: gebouwd; eventflow en Chrome-installability bewezen.
- [x] User-scoped afwijzing en sessiefallback — status: gebouwd en getest.
- [x] Instellingenactie en niet-Chromium uitleg — status: gebouwd en in Chromium, Firefox en WebKit getest.
- [ ] OS-level geïnstalleerde app in Dock/launcher — status: code en installability bewezen, nog user-review nodig.

## Toegevoegde verbeteringen tijdens uitvoering

- De globale provider mount vanaf de eerste loading-render, zodat een vroeg `beforeinstallprompt`-event niet verloren gaat tijdens auth-bootstrap.
- Een PWA-specifieke Playwright-config houdt Chromium-, Firefox- en WebKit-tests reproduceerbaar zonder de globale E2E-suite te verbreden.
- Chromium DevTools Protocol controleert expliciet dat manifest en installability geen browserfouten bevatten.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, actuele Expo/browservereisten en taskflow-contract bevestigen.
- [x] Blok 2: manifest, HTML-metadata en visueel gecontroleerde iconset toevoegen.
- [x] Blok 3: pure helper, provider/modal en instellingenactie bouwen.
- [x] Blok 4: unit-, export- en runtime/browserchecks uitvoeren.
- [x] Blok 5: reconciliation, taskflow-handoff en docs-bundels afronden.

## Acceptance criteria

- [x] De statische webexport bevat een geldig gelinkt manifest met correcte Budio-naam, kleuren en alle iconvarianten.
- [x] Alleen een ingelogde, niet-standalone Chromium-gebruiker zonder afwijzing ziet automatisch de installatiemodal.
- [x] `Later` en browser-dismissal blijven per user na refresh gerespecteerd.
- [x] Instellingen heractiveert Chromium-installatie of toont de afgesproken fallback zonder prompt-API.
- [x] Standalone modus verbergt alle installatie-UI.
- [x] Light en dark mode blijven visueel rustig en correct.
- [ ] Werkelijke OS-installatie toont `Budio Vandaag` met het juiste icoon in Dock/launcher — user-review nodig.
- [x] Lint, typecheck, relevante tests, export, taskflow en docs-bundelchecks slagen.

## Verify / bewijs

- `npm run test:unit` — 21 files, 145 tests geslaagd.
- `npx vitest run --coverage --coverage.include=src/lib/pwa-install.ts tests/unit/pwa-install.test.ts` — 100% statements/branches/functions/lines.
- `npx playwright test --config=playwright.pwa.config.ts` — 10 toepasselijke tests geslaagd; 8 Chromium-only skips in Firefox/WebKit.
- Chromium CDP `Page.getAppManifest` + `Page.getInstallabilityErrors` — 0 manifestfouten, 0 installability errors, naam `Budio Vandaag`, standalone en 3 PWA-iconen correct geparsed.
- Light-mode modal visueel gecontroleerd; dark-mode runtime controleert `colorScheme: dark` en de correcte dark tekstkleur.
- Iconen visueel gecontroleerd: standaard 192/512 en Apple touch vullen correct; maskable 512 heeft een veilige ivoorkleurige marge zonder afsnijding.
- `npx expo export --platform web --output-dir /tmp/budio-pwa-export --clear` — 32/32 routes met manifestlink en titel; 4/4 iconbestanden aanwezig.
- `npm run lint` — geslaagd.
- `npm run typecheck` — geslaagd.
- `npm run taskflow:verify` — geslaagd na statusovergang naar `review` en agent-handoff.
- `npm run docs:bundle` — geslaagd.
- `npm run docs:bundle:verify` — geslaagd.
- Handmatige OS-installatie vanuit Chrome-menu/browserprompt — nog user-review nodig.

## Reconciliation voor afronding

- Oorspronkelijk plan: manifest/iconen, globale Chromium-prompt, user-scoped afwijzing, instellingenfallback en browser-/exportbewijs bouwen zonder service worker.
- Expliciete user requirements: alle geplande code, copy, iconvarianten, browsergrenzen en no-service-worker scope zijn behouden.
- Toegevoegde verbeteringen: vroege provider-mount, task-specifieke browsermatrix en Chromium installabilitydiagnose.
- Afgerond: alle broncode, iconassets, unit-tests, browserflows, dark/light checks en productie-export.
- Open voor review: eenmaal in een echte Chrome/Edge UI installeren en bevestigen dat `Budio Vandaag` met het juiste icoon in Dock/launcher verschijnt.

## Relevante links

- `docs/project/open-points.md`
- [PWA Install Prompt Guide](https://web.dev/customize-install/)
- [Expo PWA documentation](https://docs.expo.dev/guides/progressive-web-apps/)


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish


- 2026-07-15T19:15:41+02:00 — feat: make Budio web app installable
## Agent activity

- start 2026-07-15T09:40:36.762Z - Codex / gpt-5 / codex / default

- stop 2026-07-15T09:40:36.762Z -> 2026-07-15T09:59:55.568Z - Codex / gpt-5 / codex / default - reason: handoff
