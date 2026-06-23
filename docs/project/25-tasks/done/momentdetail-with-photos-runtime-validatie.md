---
id: task-momentdetail-with-photos-runtime-validatie
title: Momentdetail with-photos runtime-validatie
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: De with-photos state van historical momentdetail is lokaal runtime-bewezen met een reproduceerbare JPEG fixture-seed en cleanup-flow; de bestaande UI bleek zonder extra app-codewijziging al te voldoen aan de afgesproken foto-UX.
tags: [moments, photos, moment-detail, qa]
workstream: app
epic_id: null
parent_task_id: null
depends_on: [task-oude-dag-moment-toevoegen-via-bestaande-captureflow]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 46
---




## Probleem / context

De oude-dag captureflow en momentdetail-polish zijn functioneel afgerond, maar de with-photos state van momentdetail kon nog niet runtime-bevestigd worden omdat de lokale testdatabase geen `entry_photos` records bevatte.

Daardoor is de UI voor foto's wel in code gepolijst, maar ontbreekt nog hard bewijs dat de historische detailpagina met echte thumbnails, uploadactieplaatsing en foto-viewer zich in runtime precies zo gedraagt als bedoeld.

## Gewenste uitkomst

Er is een reproduceerbare lokale smoke-fixture voor één historische momentdetail-entry met 2-3 foto's. Daarmee kunnen we de with-photos state van momentdetail in light/dark mode valideren zonder de afgeronde oude-dag-task te heropenen.

Als de runtime-smoke nog een kleine visuele regressie laat zien, valt die binnen deze taak en wordt die met de kleinste rustige UI-aanpassing opgelost. Als de smoke direct groen is, blijft deze taak vooral seed + bewijs.

## User outcome

We kunnen met echte lokale foto-data bevestigen dat de momentdetailpagina zowel zonder foto's als met foto's rustig, editorial en logisch blijft, inclusief juiste uploadactieplaatsing.

## Functional slice

Een kleine QA/polish-slice: lokale historical photo fixture seeden -> historische momentdetail met foto's openen -> UX-contracten bevestigen -> eventueel mini-polish -> cleanup/verify/documentatie afronden.

## Entry / exit

- Entry: developer/agent draait de lokale seed voor een historische entry met foto's.
- Exit: de with-photos momentdetailstate is runtime-bewezen en vastgelegd in een aparte follow-up task.

## Happy flow

1. Een lokale historical detail-fixture wordt gezaaid met 2-3 foto's op een bekende smoke-user en entry-route.
2. De historische momentdetailpagina toont een rustige `Foto's`-sectie boven `Momentdetails`, met `Foto toevoegen` alleen daar.
3. Runtime-smoke bevestigt thumbnails, teller, viewer en utility-laag; eventuele mini-polish wordt doorgevoerd en opnieuw bevestigd.

## Non-happy flows

- Empty state: valt buiten deze taak; de no-photos state is al in de vorige taak bewezen.
- Permission denied / unavailable: als local auth of storage niet werkt, vastleggen als blocker met lokaal reproduceerbare fout.
- Validation / unsupported state: als de fixture-entry ontbreekt, maakt de seed zelf een local-only historical fixture aan.
- Failure / retry / cancel: als foto-seed of cleanup faalt, blijft dat binnen deze taak en mag de productflow zelf niet aangepast worden.

## UX / copy

- Geen nieuwe user-facing copy buiten bestaande labels.
- Bestaande labels die expliciet bewaakt moeten blijven:
  - `Foto's`
  - `Foto toevoegen`
  - `Momentdetails`
  - `Bewerken`
  - `Ga naar woensdag 13 mei`
  - `Verwijderen`
- UI blijft volgen op bestaande detail-primitives en gallery-patronen.

## Data / IO

- Input: bestaande repo-assets als fotobron, bestaande local smoke-user, bestaande `entry_photos` tabel en `entry-photos` bucket.
- Output: 1 reproduceerbare local historical fixture-entry met 2-3 foto's en een concrete detail-URL voor smoke-test.
- Opslag/API/service/file-impact:
  - kleine developer-facing seed/cleanup uitbreiding in `scripts/**`
  - optionele kleine UI-polish in momentdetail/gallery alleen als runtime daar aanleiding toe geeft
- Statussen:
  - seed klaar
  - runtime bewezen
  - optionele polish gebouwd
  - cleanup bevestigd

## Waarom nu

- Dit is de laatste open onzekerheid op de historische momentdetailflow.
- De taak blijft klein, gebruikt bestaande infrastructuur en voorkomt dat we een afgeronde task inhoudelijk weer open moeten trekken.

## In scope

- Nieuwe kleine follow-up taskfile.
- Reproduceerbare lokale seed/cleanup voor historical detail met foto's.
- Runtime-smoke van with-photos state op momentdetail.
- Alleen kleine polish in detail/gallery als de smoke nog iets blootlegt.

## Buiten scope

- Nieuwe migrations of schemawijzigingen.
- Nieuwe uploadarchitectuur.
- Brede testdataset-herbouw.
- Captureflow- of dagdetailwijzigingen.
- Nieuwe E2E-suite buiten deze gerichte smoke.

## Oorspronkelijk plan / afgesproken scope

- Maak een aparte follow-up task voor with-photos runtime-validatie.
- Hergebruik de bestaande lokale gallery-seed richting.
- Seed exact één bekende historical entry met foto's.
- Houd app-code standaard ongemoeid tenzij de runtime-smoke nog regressies toont.

## Expliciete user requirements / detailbehoud

1. De bestaande oude-dag-task blijft `done`.
2. Gebruik een aparte kleine follow-up task.
3. Hergebruik `scripts/seed-local-entry-photo-gallery-smoke.mjs` als richting, niet `supabase/seed.sql`.
4. Seed exact één historische detail-entry met 2-3 foto's.
5. Gebruik bestaande repo-assets als fotobron.
6. Geen publieke API-wijzigingen.
7. Geen schemawijzigingen of migrations.
8. Cleanup hoort expliciet bij de taak.
9. Runtime-smoke moet expliciet bewijzen:
   - fotosectie boven `Momentdetails`
   - `Foto toevoegen` alleen in fotosectie wanneer foto's bestaan
   - geen dubbele uploadactie
   - thumbnails groter/netter/rustig
   - teller netjes in fotosectie
   - `Momentdetails` blijft utilitylaag

## Status per requirement

- [x] Aparte follow-up task bestaat en is spec-ready — status: gebouwd
- [x] Historical photo fixture seeding werkt reproduceerbaar lokaal — status: gebouwd
- [x] Cleanup verwijdert seeded rows en storage objects weer netjes — status: gebouwd
- [x] With-photos runtime-smoke op historical momentdetail is vastgelegd — status: gebouwd
- [x] Alleen indien nodig is kleine UI-polish gebouwd na smoke — status: gebouwd; niet nodig gebleken

## Toegevoegde verbeteringen tijdens uitvoering

- De historical photo detail-fixture gebruikt nu expliciet bestaande repo-assets als bron en converteert die lokaal naar tijdelijke JPEG-bestanden, zodat de seed compatibel blijft met de bestaande `entry-photos` bucket constraint zonder nieuwe dependencies.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, bestaande seed-route en historical fixture-aanpak bevestigen.
- [x] Blok 2: local historical photo seed/cleanup bouwen en draaien.
- [x] Blok 3: runtime-smoke, eventuele mini-polish, verify en task/docs afronden.

## Concrete checklist

- [x] Taskfile aanmaken en bovenaan open-lane zetten.
- [x] Seed/cleanup script voor historical photo detail-fixture toevoegen of uitbreiden.
- [x] Local auth/smoke user voor fixture bevestigen.
- [x] Runtime-smoke uitvoeren op historical with-photos detailstate.
- [x] Alleen indien nodig: kleine UI-polish uitvoeren.
- [x] Verify, cleanup, taskflow en docs afronden.

## Acceptance criteria

- [x] Er is een reproduceerbare local-only historical entry met 2-3 foto's voor smoke-test.
- [x] Historical momentdetail met foto's toont `Foto toevoegen` alleen in de fotosectie en niet dubbel in `Momentdetails`.
- [x] De with-photos layout voelt rustig, editorial en functioneel correct.
- [x] Cleanup laat geen fixture-rommel achter in `entry_photos` of storage.

## Blockers / afhankelijkheden

- Lokale Supabase stack en Mailpit/local auth moeten beschikbaar zijn.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- Runtime smoke historical with-photos detail:
  - light mode: historische fixture-entry `/entry/a17f9aaa-de67-4da8-a504-405ef4994630?source=day&date=2026-05-13` toont `Foto's` boven `Momentdetails`
  - `Foto toevoegen` staat alleen in de fotosectie en niet meer in `Momentdetails`
  - drie thumbnails renderen in een rustige horizontale strip met teller `3 / 5 foto's`
  - `Momentdetails` blijft utilitylaag met `Bewerken`, daglink en `Verwijderen`
  - geen aanvullende UI-polish nodig gebleken na smoke
- Cleanup-bewijs:
  - `node --env-file=.env.local scripts/seed-local-historical-entry-photo-detail-smoke.mjs --cleanup`
  - output: `PASS historical-photo-detail-cleanup email=smoke.default.local@example.com`
- Beperking:
  - dark-mode runtime en viewer-interactie konden in deze sessie niet volledig bevestigd worden met de beschikbare browsertools; de taak legt die beperking expliciet vast in plaats van extra ongeverifieerde UI-wijzigingen te maken.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: losse follow-up task voor with-photos runtime-validatie op historical momentdetail.
- Toegevoegde verbeteringen: local-only historical fixture seeden via bestaande gallery-smoke richting, maar met bestaande repo-assets die tijdelijk naar JPEG worden geconverteerd voor bucketcompatibiliteit.
- Afgerond: aparte taskfile, reproduceerbare historical photo seed/cleanup, expliciete lokale auth-route, with-photos runtime-smoke in light mode en cleanup-bewijs.
- Open / blocked: dark-mode runtime en viewer-click smoke zijn met de huidige browsertooling nog niet volledig bewezen; er is geen aanvullende app-code open blijven staan vanuit deze taak.

## Relevante links

- `docs/project/25-tasks/done/oude-dag-moment-toevoegen-via-bestaande-captureflow.md`
- `scripts/seed-local-entry-photo-gallery-smoke.mjs`
- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state