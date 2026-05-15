---
id: task-lokale-testdatabase-herstellen-voor-capture-validatie
title: Lokale testdatabase herstellen voor capture-validatie
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-14
summary: "Herstel de lokale Supabase testdatabase naar een bruikbare staat met representatieve testdata, zodat de oudere-dag captureflow en standaard today-capture weer op echte fixturedata getest kunnen worden."
tags: [supabase, local-db, testdata, capture]
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

De lokale appflow werkt weer, maar de lokale Supabase database lijkt leeg of grotendeels leeg. Daardoor ontbreekt de verwachte testdata om de eerdere dagdetail- en captureflows realistisch te valideren.

De repo verwijst in `supabase/config.toml` naar een seedbestand (`./seed.sql`), maar tijdens preflight is die file lokaal niet aangetroffen. Daardoor is het waarschijnlijk dat een eerdere lokale reset de data heeft leeggemaakt zonder automatische reseed.

## Gewenste uitkomst

De lokale database bevat weer bruikbare testdata voor de bestaande capture- en dagflows. Minimaal is duidelijk en bewezen:

- welke herstelbron is gebruikt
- of oude lokale data echt kon worden teruggezet of opnieuw gezaaid moest worden
- dat de gebruiker daarna weer met representatieve dag-/momentdata kan testen

## User outcome

De gebruiker kan de eerste functionaliteit verder testen op bestaande of opnieuw gezaaide lokale testdata, zonder handmatig SQL of losse restorestappen te hoeven uitzoeken.

## Functional slice

Een kleine herstel-slice: diagnose van de lege lokale DB, kiezen van de kleinste veilige restorebron, lokale restore/reseed uitvoeren, en daarna hard bewijzen dat de verwachte testdata weer aanwezig is.

## Entry / exit

- Entry: lokale app/server draait, maar de lokale Supabase data lijkt leeg.
- Exit: lokale DB bevat weer testdata en de herstelbron plus bewijs zijn vastgelegd.

## Happy flow

1. Diagnose bevestigt dat de lokale DB leeg of onverwacht mager is en wijst de oorzaak aan.
2. Een bestaande restorebron, fixture-import of lokale backupbron wordt gekozen en uitgevoerd.
3. De relevante tabellen bevatten weer testdata en een korte runtimecheck bevestigt dat de app ermee verder getest kan worden.

## Non-happy flows

- Restorebron ontbreekt: leg expliciet vast dat oude data niet herstelbaar is en zaai de kleinste bruikbare fixturedata opnieuw.
- Lokale migratie/seed-config klopt niet: herstel alleen wat nodig is om lokaal weer te kunnen testen.
- Regeneratie of afgeleide data faalt: ruwe testentries blijven behouden; noteer welke afgeleide laag nog ontbreekt.

## UX / copy

- Geen product-UI redesign.
- Alleen developer-facing restore en bewijs.

## Data / IO

- Input: lokale Supabase DB, bestaande migraties, eventuele seed/fixture/importscripts.
- Output: herstelde of opnieuw gezaaide lokale testdata.
- Opslag/API/service-impact: lokaal Supabase only.
- Statussen: diagnose, restorebron gekozen, restore/reseed uitgevoerd, bewijs bevestigd.

## Waarom nu

- De gebruiker wil eerst de eerdere functionaliteit op echte testdata valideren voordat verdere flowbouw doorgaat.

## In scope

- Lokale DB-state bevestigen.
- Restore/seedbron in repo of lokale Docker/Supabase-context zoeken.
- Kleinste veilige restore/reseed uitvoeren.
- Bewijs vastleggen in taskfile.

## Buiten scope

- Productie- of remote-database herstel.
- Nieuwe brede seedarchitectuur.
- Nieuwe dependencies of redesign.

## Oorspronkelijk plan / afgesproken scope

- Herstel de lokale testdatabase zodat bestaande testdata weer bruikbaar is voor functionele validatie van capture en oudere-dag werk.

## Expliciete user requirements / detailbehoud

- De lokale database lijkt leeg.
- Er zou een veel rijkere set testdata aanwezig moeten zijn.
- De eerdere bugfix voor vandaag-capture is geslaagd; dit herstel is bedoeld om de eerste functionaliteit nu op testdata te kunnen testen.

## Status per requirement

- [x] Lokale DB-state bevestigd — status: gebouwd
- [x] Herstelbron bepaald — status: gebouwd
- [x] Lokale testdata hersteld of opnieuw gezaaid — status: gebouwd
- [x] Bewijs vastgelegd — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De restore-fixture is niet alleen op `pflikweert@gmail.com`, maar ook op de actieve lokale smoke-user gezet nadat runtime-bewijs liet zien dat de browser niet op dezelfde account zat.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste restore- of reseedbron uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Lokale DB inhoud tellen en oorzaak bevestigen.
- [x] Restore- of reseedpad uitvoeren.
- [x] Capture/dagtestdata kort verifiëren.

## Acceptance criteria

- [x] Het is expliciet duidelijk of oude lokale data is hersteld of dat een nieuwe lokale testdataset is gezaaid.
- [x] De lokale database bevat weer bruikbare data voor capture/dagtests.
- [x] De gebruikte herstelstappen en het bewijs zijn vastgelegd.

## Blockers / afhankelijkheden

- De oorspronkelijke rijke lokale dataset was niet uit de repo of gitgeschiedenis terug te halen; restore is daarom uitgevoerd als nieuwe lokale fixture-seed, niet als echte historische restore.

## Verify / bewijs

- Bevestigd via lokale Postgres inspectie:
  - `supabase/config.toml` verwijst naar `./seed.sql`, maar die file ontbreekt lokaal.
  - `git log --all --name-status -- supabase/seed.sql` gaf geen historie terug.
  - tabeltellingen vóór restore wezen op een zeer kleine dataset (`entries_raw=7`, `entries_normalized=6`, `day_journals=5` totaal over alle users).
- Bevestigd via user-specifieke inspectie:
  - `pflikweert@gmail.com` had slechts 4 raw entries.
  - de actieve browser-sessie draaide op `smoke.default.local@example.com` (`localStorage` sessietoken bevestigd).
- Restore uitgevoerd via lokale SQL fixture-seed op beide users:
  - `pflikweert@gmail.com`
  - `smoke.default.local@example.com`
- Tellingen na restore voor de actieve smoke-user:
  - `entries_raw = 12`
  - `day_journals = 8`
- Runtime-smoke in browser:
  - `http://localhost:8081/day/2026-05-13` toont weer dagsummary, dagverhaal, kernpunten, week/maandreflectie en 2 individuele momenten (`09:58`, `21:26`).

## Reconciliation voor afronding

- Oorspronkelijk plan: lokale testdatabase herstellen voor capture-validatie.
- Toegevoegde verbeteringen: restore-fixture ook naar de actieve smoke-user gebracht toen runtime-bewijs liet zien dat de browser niet op `pflikweert@gmail.com` zat.
- Afgerond: oorzaak bevestigd, herstelbron bepaald, representatieve lokale fixturedata gezaaid, runtimecheck bevestigd.
- Open / blocked: de repo heeft nog steeds geen committed `supabase/seed.sql` of andere duurzame restorebron voor deze rijkere dataset.

## Relevante links

- `docs/project/open-points.md`
- `supabase/config.toml`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish