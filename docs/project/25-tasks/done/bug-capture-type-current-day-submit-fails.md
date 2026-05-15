---
id: task-bug-capture-type-current-day-submit-fails
title: Bug capture type current day submit fails
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-14
summary: "Herstel de regressie waarbij een normaal tekstmoment voor vandaag op `/capture/type` faalt bij opslaan, bepaal de exacte root cause in frontend/service/function/DB en houd de nieuwe historische targetDate-flow compatibel zonder die verder uit te bouwen."
tags: [capture, text, regression, bug]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


## Probleem / context

De standaard typing-capture flow voor vandaag faalt nu op `/capture/type`. Bij klikken op `Leg vast` verschijnt de foutcopy `Je moment is niet veilig verstuurd. Leg het opnieuw vast.` met `Probeer het zo opnieuw.`

Deze regressie is ontstaan na de recente targetDate/returnTo-aanpassingen voor oude dagen. Dat maakt de huidige vandaag-flow P0/P1: eerst moet het normale vastleggen voor vandaag weer betrouwbaar werken voordat we de historische flow verder kunnen vertrouwen.

## Root cause

- Diagnose-label: `Edge Function invoke/boot probleem`
- Exacte oorzaak: de lokale Supabase functions-runtime bleef niet draaien na de bestaande start/restartflow. `scripts/supabase-functions-start.sh` startte `npx supabase functions serve --env-file .env.local` wel in de achtergrond, maar niet los van de launching shell. Daardoor stierf het process direct na script-exit en bleef Kong op `http://127.0.0.1:54321/functions/v1/process-entry` generieke upstream-fouten teruggeven (`500 An unexpected error occurred` en kort na restart soms `502 invalid response from upstream`).
- Bevestiging:
  - browser/network reproduce op `/capture/type` liet een geldige `POST /functions/v1/process-entry` zien
  - dezelfde fout trad ook op in `./scripts/verify-local-flow.sh`
  - `supabase_edge_runtime_*` stond gestopt en er draaide geen levende `supabase functions serve`-process
  - wanneer dezelfde runtime met `nohup` levend werd gehouden, slaagde `verify-local-flow` direct weer

## Gewenste uitkomst

Een normaal tekstmoment op `/capture/type` zonder queryparams slaat weer succesvol op voor vandaag. De bestaande success-flow blijft intact, de tekst wordt alleen geleegd na bewezen succes en er is geen redesign of scope-uitbreiding nodig.

De diagnose benoemt expliciet waar het faalde: frontend payload, auth/session, Supabase DB/schema, Edge Function invoke/boot of processing/prompt. De fix houdt de targetDate-flow compatibel, maar bouwt die nu niet verder uit.

## User outcome

De gebruiker kan op `/capture/type` weer direct een vandaag-moment opslaan zonder foutmelding of dataverlies, terwijl een geldige `targetDate`-route voor een oudere dag niet stukgaat door de fix.

## Functional slice

Een gerichte bugfix op de standaard tekstcaptureflow: reproduce -> bronbevestigde root cause -> kleinste veilige fix -> runtime bewijs voor vandaag-flow en regressiecheck voor targetDate-param routing.

## Entry / exit

- Entry: gebruiker opent `/capture/type` zonder queryparams en typt een tekstmoment.
- Exit: na `Leg vast` is het moment opgeslagen voor vandaag en komt de gebruiker in de bestaande success/return flow.

## Happy flow

1. Gebruiker opent `/capture/type` zonder `targetDate` of oudere dag-context.
2. Gebruiker typt `Goedemorgen test voor vandaag` en klikt `Leg vast`.
3. De request slaagt, de entry wordt voor vandaag opgeslagen, de tekst wordt pas daarna gewist en de gebruiker ziet de bestaande succesroute.

## Non-happy flows

- Validation / unsupported state: ontbrekende `targetDate` gebruikt altijd de normale vandaag-flow zonder invalid/null/empty datumveld.
- Failure / retry / cancel: bij fout blijft de tekst behouden en mag de bestaande copy `Je moment is niet veilig verstuurd. Leg het opnieuw vast.` + `Probeer het zo opnieuw.` blijven.
- Historical compatibility: geldige `targetDate` blijft targetDate gebruiken; ongeldige `targetDate` valt veilig terug of volgt bestaand foutpatroon.

## UX / copy

- Bestaande vandaag-typing capture blijft visueel ongewijzigd.
- Bestaande foutcopy mag blijven:
  - `Je moment is niet veilig verstuurd. Leg het opnieuw vast.`
  - `Probeer het zo opnieuw.`
- Geen redesign, geen nieuwe capturemodus, geen extra uitleglaag.

## Data / IO

- Input: tekstmoment via `/capture/type`, standaard zonder queryparams; optioneel met geldige `targetDate`.
- Output: nieuwe entry voor vandaag bij standaardflow; targetDate alleen wanneer geldig meegegeven.
- Opslag/API/service-impact: alleen kleinste fix in bestaande capture/service/function-keten; geen nieuwe dependencies; geen migration tenzij runtime exact bewijst dat een bestaande schemawijziging lokaal ontbreekt.
- Statussen: tekst mag alleen wissen na bewezen success; bij fout blijft tekst behouden.

## Waarom nu

- Dit is een actieve regressie op een primaire gebruikersflow.
- Vandaag-capture is de basis van het product; die moet eerst stabiel zijn.

## In scope

- Lokale reproductie op `/capture/type`.
- Browser console/network check bij `Leg vast`.
- Root-cause bepaling in `app/capture/type.tsx`, `services/entries.ts`, `process-entry` invoke en indien nodig lokale Supabase function/DB.
- Kleinste bugfix om standaard vandaag-flow te herstellen.
- Compatibiliteitscheck voor geldige en ongeldige `targetDate`.

## Buiten scope

- Verdere uitbouw van historische day-flow.
- Redesign van Today, Days overview of dagdetail.
- Nieuwe dependencies, retry-queue, offline text storage of nieuwe capturemodus.
- Brede refactor van capture, entries of processing.
- Voice/audio-wijzigingen behalve wanneer gedeelde submitlogica exact de foutbron blijkt.

## Oorspronkelijk plan / afgesproken scope

- Reproduceer eerst lokaal op `/capture/type`.
- Bevestig exact waar de fout optreedt met browser/network en primaire code/runtime-bronnen.
- Fix alleen de standaard tekstcapture voor vandaag.
- Houd targetDate-compatibiliteit in stand zonder verdere bouwscope.

## Expliciete user requirements / detailbehoud

1. `/capture/type` zonder queryparams moet altijd een normaal vandaag-moment kunnen opslaan.
2. Als `targetDate` ontbreekt: gebruik bestaande vandaag-flow en stuur geen invalid/null/empty targetDate mee.
3. `created_at` blijft echte vastlegtijd.
4. Het moment verschijnt na succes in vandaag / huidige dag.
5. Textarea wordt alleen geleegd na bewezen succesvolle save.
6. Bij fout blijft tekst behouden.
7. Bestaande foutcopy mag blijven.
8. Historische flow mag niet breken bij geldige `targetDate`.
9. Ongeldige `targetDate` mag niet stil kapotgaan.

## Status per requirement

- [x] Vandaag-flow op `/capture/type` werkt weer — status: gebouwd
- [x] Root cause expliciet benoemd — status: gebouwd
- [x] Geen invalid/null/empty targetDate in standaardflow — status: gebouwd
- [x] Tekst blijft behouden bij fout — status: gebouwd
- [x] Tekst wist pas na success — status: gebouwd
- [x] Historische targetDate-compatibiliteit blijft intact — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale functions-start tooling nu met `nohup`, zodat `supabase:functions:restart` de runtime echt laat doorleven na script-exit.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, reproductie en diagnose vastleggen.
- [x] Blok 2: kleinste bronfix uitvoeren.
- [x] Blok 3: verify, runtime smoke en task/docs afronden.

## Concrete checklist

- [x] Bug reproduceren op `/capture/type`.
- [x] Browser console/network en function/servicepad checken.
- [x] Root cause documenteren.
- [x] Kleinste fix implementeren.
- [x] Lint/typecheck/taskflow verify en runtime smoke vastleggen.

## Acceptance criteria

- [x] Standaard tekstmoment voor vandaag werkt weer.
- [x] Root cause is benoemd.
- [x] Geen redesign of scope-uitbreiding.
- [x] Geen dataverlies bij failed submit.
- [x] Geen ongeldige targetDate in standaardflow.

## Blockers / afhankelijkheden

- Nog geen; lokale webserver en lokale Supabase runtime moeten wel beschikbaar zijn voor volledige runtime-bevestiging.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- ✅ `./scripts/verify-local-flow.sh`
- ✅ Browser reproduce vóór fix:
  - geldige `POST /functions/v1/process-entry`
  - response `500 {"message":"An unexpected error occurred"}`
- ✅ Runtime-diagnose:
  - `supabase_edge_runtime_persoonlijke-assistent-app` stond op `Exited (137)`
  - er draaide geen levend `supabase functions serve`-process
- ✅ Browser smoke na fix:
  - `/capture/type` met `Goedemorgen test voor vandaag <timestamp>` navigeert naar `/entry/[id]?source=capture&date=2026-05-14`
  - geen foutcopy zichtbaar
  - geldige `targetDate`-route `/capture/type?targetDate=2026-05-10` opent nog steeds en toont de notice `Je voegt dit toe aan 10 mei 2026.`
- Runtime smoke:
  1. open `/capture/type`
  2. typ `Goedemorgen test voor vandaag`
  3. klik `Leg vast`
  4. geen foutmelding
  5. entry wordt opgeslagen
  6. gebruiker komt in bestaande success/return flow
  7. vandaag/dagdetail bevat het nieuwe moment
- Regressie-smoke:
  - `/capture/type?targetDate=<geldige-oude-datum>` gaat niet stuk door de fix
  - `/capture/type` zonder queryparams blijft de standaard bron van waarheid voor vandaag

## Reconciliation voor afronding

- Oorspronkelijk plan: vandaag-typing capture herstellen en exacte root cause benoemen.
- Toegevoegde verbeteringen: lokale functions-start tooling met `nohup`, zodat restart de runtime echt levend houdt.
- Afgerond: root cause bevestigd als lokale Edge Function invoke/boot-probleem; runtime-startscript gefixt; today text capture en targetDate-openingspad opnieuw bewezen.
- Open / blocked: geen functionele blockers meer voor deze regressie.

## Relevante links

- `app/capture/type.tsx`
- `services/entries.ts`
- `supabase/functions/process-entry/index.ts`
- `scripts/supabase-functions-start.sh`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish