---
id: task-capture-typing-ux-polish-vandaag-flow
title: Capture typing UX polish voor vandaag-flow
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user
updated_at: 2026-05-14
summary: "Verfijn de bestaande `/capture/type` UX voor vandaag en targetDate-flows met compactere hero, meer schrijfruimte, betere placeholder, live character counter en rustige light/dark theming zonder redesign of nieuwe dependencies."
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 29
---




## Probleem / context

De huidige typing capture-pagina verspilt verticale ruimte door dubbele copy en een te ruime hero boven het tekstveld. Daardoor voelt het schrijfvlak kleiner dan nodig. Daarnaast ontbreekt een rustige live karakterteller en moet de theming in light/dark mode expliciet gecontroleerd worden.

## Gewenste uitkomst

De typing capture-pagina voelt compacter, rustiger en meer capture-first. De hero staat dichter onder de topnav, de dubbele vraag boven het tekstveld is weg en het schrijfvlak krijgt zichtbaar meer ruimte zonder nieuwe UI-lagen of redesign.

De pagina toont een subtiele live teller rechtsonder, gebruikt de placeholder `Begin met schrijven…` en houdt de historische targetDate-contextregel rustig gecentreerd en goed leesbaar in light en dark mode.

## User outcome

De gebruiker kan op `/capture/type` sneller beginnen met schrijven, ziet meer van zijn tekst tegelijk en krijgt subtiele feedback via een live karakterteller zonder extra afleiding.

## Functional slice

Een kleine UX-polish van de bestaande typing capture-state op `/capture/type`, inclusief hero-copy, textarea-dominantie, counterweergave en rustige dark/light theming, zonder wijziging aan captureflow, opslag of navigatie.

## Entry / exit

- Entry: gebruiker opent `/capture/type` of `/capture/type?targetDate=...`.
- Exit: gebruiker typt en slaat een moment op via de bestaande flow, met ongewijzigde navigatie en submit-logica.

## Happy flow

1. Gebruiker opent `/capture/type` en ziet direct onder de topnav de compacte hero `Wat wil je vastleggen?` met korte subtitel.
2. Het tekstveld domineert de pagina, gebruikt de placeholder `Begin met schrijven…` en toont live `0 / 20000` rechtsonder.
3. Gebruiker typt een langere tekst, ziet de teller live oplopen en slaat via `Leg vast` op zonder layoutsprongen.

## Non-happy flows

- Empty state: teller toont `0 / 20000` en submit blijft bestaande disabled-gedrag volgen.
- Permission denied / unavailable: niet van toepassing; geen nieuwe permissions of device-capabilities.
- Validation / unsupported state: targetDate-notice blijft alleen zichtbaar voor geldige niet-vandaag targetDate-context.
- Failure / retry / cancel: bestaande errorcopy, retrygedrag en cancel/backflow blijven ongewijzigd.

## UX / copy

- Hero title: `Wat wil je vastleggen?`
- Hero subtitle: `Schrijf op wat je wilt onthouden, verwerken of bewaren.`
- Verwijderen: los label `Wat wil je vastleggen?` boven het tekstveld.
- Placeholder: `Begin met schrijven…`
- Counter: `0 / 20000`
- Historische noticecopy blijft exact: `Je voegt dit toe aan [datum].`
- Bestaande shared patterns blijven leidend: `CaptureBackHeader`, `CaptureIntro`, `TextEntryEditor`, `NoticeCard`, `PrimaryButton`, `SecondaryButton`.

## Data / IO

- Input: vrije tekst in bestaande typing capture-flow; optioneel geldige `targetDate`.
- Output: ongewijzigde `submitTextEntry` saveflow.
- Opslag/API/service/file-impact: geen backend-, service- of dataflowwijziging beoogd.
- Statussen: bestaande submit/recovery/error-statussen blijven gelijk.

## Waarom nu

- De pagina is een kernstuk van de capture-first MVP.
- De regressiefix voor today-submit is al hersteld; nu is er ruimte om de UX van deze standaardflow netter en rustiger te maken zonder scope-uitbreiding.

## In scope

- Compactere hero en minder top whitespace op `/capture/type`
- Verwijderen van dubbele vraag boven het tekstveld
- Placeholder vervangen
- Typvlak visueel dominanter maken
- Live character counter rechtsonder tonen
- Historical targetDate-notice subtiel gecentreerd/uitgelijnd houden
- Light/dark theming van textarea/meta/CTA op deze pagina controleren en bijslijpen

## Buiten scope

- Nieuwe capturemodi, toolbars of editorfeatures
- Wijzigingen aan voice capture of capture startflow buiten gedeelde notice styling indien nodig
- Dataflow, services, Supabase functions of migrations
- Redesign van andere schermen

## Oorspronkelijk plan / afgesproken scope

- Verfijn alleen de bestaande typing capture-pagina.
- Houd capture-first en clean-first intact.
- Voeg geen nieuwe cards, widgets, toolbars of dependencies toe.
- Beperk wijzigingen tot relevante capture/type schermen en kleine shared primitives waar nodig.

## Expliciete user requirements / detailbehoud

- Hero direct onder standaard topnav met minder top whitespace.
- Titel `Wat wil je vastleggen?`
- Subtitel `Schrijf op wat je wilt onthouden, verwerken of bewaren.`
- Verwijder volledig de dubbele vraag boven het tekstveld.
- Placeholder exact `Begin met schrijven…`
- Input moet visueel dominanter worden.
- Live counter rechtsonder in vorm `0 / 20000`, alleen visueel, nog niet limiteren.
- Historische dag-contextregel subtiel houden en icoon + tekst rustig uitlijnen.
- Dark mode controleren op textarea, placeholder, meta text, border/surface contrast en CTA-leesbaarheid.
- Geen harde witte vlakken in dark mode en geen donkere lekken in light mode.
- Keyboard/open en lange tekst moeten geen springende layout veroorzaken.
- Na afloop korte changelog, geraakte files en eventuele UX tradeoffs rapporteren.

## Status per requirement

- [x] Compactere hero en minder top whitespace — status: gebouwd
- [x] Dubbele vraag verwijderen — status: gebouwd
- [x] Placeholder `Begin met schrijven…` — status: gebouwd
- [x] Groter schrijfvlak — status: gebouwd
- [x] Live counter `0 / 20000` — status: gebouwd
- [x] Rustige targetDate-notice alignment — status: gebouwd
- [x] Light/dark runtime-checked — status: gebouwd met web-smoke; native iOS handmatige smoke nog niet in deze sessie uitgevoerd

## Toegevoegde verbeteringen tijdens uitvoering

- TargetDate-notice op `/capture/type` gebruikt nu dezelfde gecentreerde compacte notice-opmaak als de capture-startscreen, zodat de historische contextregel rustig blijft binnen dezelfde pagina-polish.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Bestaande capture/type renderstructuur en shared primitives aanscherpen.
- [x] Runtime smoke in light/dark en met targetDate + plain today-flow uitvoeren.

## Acceptance criteria

- [x] `/capture/type` toont een compactere hero, grotere schrijfruimte en geen dubbele vraag boven de input.
- [x] Placeholder is `Begin met schrijven…` en de live teller toont realtime `x / 20000` rechtsonder zonder harde limiet af te dwingen.
- [x] Historical targetDate-notice blijft subtiel en gecentreerd, terwijl light/dark mode rustig en leesbaar blijven zonder functionele regressie.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm run lint` ✅
- `npm run typecheck` ✅
- Runtime web-smoke via Playwright op `http://localhost:8081` met viewport `390x844`:
  - `/capture/type` light: titel en subtitel zichtbaar, oude copy `Wat houdt je bezig?` count `0`, placeholder `Begin met schrijven…`, live counter update naar `28 / 20000`
  - `/capture/type` dark: placeholder idem, live counter update naar `2880 / 20000`, textarea-kleuren `rgb(244, 241, 232)` op transparante capture-surface zonder witte vlakregressie
  - `/capture/type?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13` light/dark: targetDate-notice aanwezig (`noticeCount: 1`) en today-route toont geen notice (`noticeCount: 0`)
  - save-CTA `Leg vast` blijft zichtbaar na focus + typen; bounding box bleef gelijk (`y: 762`, `height: 20`)
- Native iOS smoke niet direct uitvoerbaar in deze sessie; web small-screen smoke is wel vastgelegd en iOS blijft aanbevolen als handmatige laatste check.

## Reconciliation voor afronding

- Oorspronkelijk plan: verfijn alleen de bestaande typing capture-pagina met compactere hero, minder dubbele copy, grotere schrijfruimte, betere placeholder, subtiele counter en rustige dark/light theming.
- Toegevoegde verbeteringen: de targetDate-notice op `/capture/type` is meteen meegetrokken naar dezelfde gecentreerde compacte notice-opmaak voor een rustiger geheel binnen dezelfde flow.
- Afgerond: hero-copy is compacter, top spacing is kleiner, placeholder is vervangen, de capture-editor start hoger en voelt groter, de live counter staat rechtsonder en de targetDate-notice blijft rustig in light/dark web-smoke.
- Open / blocked: geen code-blockers; alleen een handmatige native iOS smoke blijft optioneel aanbevolen buiten deze sessie.

## Relevante links

- `docs/project/open-points.md`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state