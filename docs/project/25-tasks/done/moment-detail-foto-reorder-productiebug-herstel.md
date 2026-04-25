---
id: task-moment-detail-foto-reorder-productiebug-herstel
title: Moment detail foto reorder productiebug herstel
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-24
summary: "De productie-reorderbug in moment detail is bronvast gereproduceerd, opgelost via een deferrable unique constraint + deferred reorder-update, en opnieuw succesvol gevalideerd in productie."
tags: [moment-detail, photos, production, reorder, diagnostics]
workstream: app
due_date: null
sort_order: 3
---


## Probleem / context

De moment detail-flow gaf in productie foutmeldingen bij het herordenen van foto's. De fout zat niet in de drag-preview zelf, maar in de persist-stap van `public.reorder_entry_photos`.

Bevestigde root-cause op 2026-04-24:

- een swap van `sort_order` veroorzaakte eerst een `23505` unique-conflict op `(raw_entry_id, sort_order)`
- een eerste tijdelijke offset-fix botste daarna op de check `sort_order between 0 and 4`
- de duurzame oplossing is: unieke constraint `deferrable` maken en de reorder-update binnen een deferred constraint uitvoeren

## Gewenste uitkomst

Op het moment-detailscherm kan de gebruiker foto's in productie weer betrouwbaar herordenen. Een reorder van positie 2 naar positie 1 geeft geen foutmelding meer, de thumbnail/featured positie volgt de nieuwe volgorde, en de productie-RPC geeft `204`.

Daarnaast is de diagnoseflow voor dit soort productiebugs aangescherpt met vaste browser-network capture, compacte reorder-logging en een reproduceerbare agent-testaccount.

## Waarom nu

- De productiebug schaadde vertrouwen in een kernflow: de featured foto van een moment kon niet betrouwbaar worden gewijzigd.
- Zonder bronvaste repro bleef de fout te lang onduidelijk tussen client, Supabase en databasefunctie.

## In scope

- Reorder root-cause in productie reproduceren met vaste testaccount.
- Reorder-preview die live mee schuift met de doelpositie.
- Reorder-persist foutpad diagnosticeren via browser-network, console en Supabase response.
- Databasefunctie `reorder_entry_photos` corrigeren voor veilige swap-updates.
- Compacte blijvende reorder-logging in client toevoegen.
- Productie diagnose runbook en taskbewijs bijwerken.

## Buiten scope

- Productie upload-flakiness; die is afgesplitst naar een aparte open task.
- Nieuwe foto-editing features zoals captions, albums of bulkbeheer.
- Nieuwe auth-backdoors of productie adminroutes voor agents.

## Concrete checklist

- [x] Productie diagnose runbook toegevoegd met browser-network capture naast Vercel/Supabase checks.
- [x] Ops secret contract voor dedicated productie agent-testaccount gedocumenteerd.
- [x] Gallery reorder flow toont live preview / meeschuivende doelpositie.
- [x] Reorder retry na refetch voor bekende mismatch-fouten toegevoegd.
- [x] Productie-repro op touch/mobile route uitgevoerd met browser console + network capture.
- [x] Root-cause bevestigd als databasefunctie-conflict op unieke `sort_order`.
- [x] Productie-databasefunctie live hersteld via deferrable unique constraint + deferred reorder-update.
- [x] Unit-tests uitgebreid voor foutclassificatie en diagnosemetadata.
- [x] Gallery smoke opnieuw groen na fix.
- [x] Verify gedraaid (`taskflow`, `lint`, `typecheck`, relevante tests, docs bundle checks).

## Blockers / afhankelijkheden

- Geen resterende blockers voor reorder; upload-flakiness loopt verder in een aparte task.

## Verify / bewijs

- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-24)
- ✅ `npm run test:unit` (14 tests geslaagd op 2026-04-24)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-24; desktop-web reorder bevestigt linkse verplaatsing na hold-and-drag)
- ✅ `npm run lint` (geslaagd op 2026-04-24)
- ✅ `npm run typecheck` (geslaagd op 2026-04-24)
- ✅ Productie-repro reorder op 2026-04-24 rond `18:29Z` bevestigd:
  - fixture-entry: `/entry/f806e61f-1148-49d1-9694-78ecdda41301`
  - mobiele/touch repro stuurde `POST /rest/v1/rpc/reorder_entry_photos`
  - response: `409`
  - body bevatte `code: 23505` en `duplicate key value violates unique constraint "entry_photos_raw_entry_id_sort_order_key"`
- ✅ Tussenstap gevalideerd op 2026-04-24 rond `20:28Z`:
  - tijdelijke offset-aanpak faalde met `400`
  - body bevatte `code: 23514` en check-constraint `entry_photos_sort_order_check`
- ✅ Definitieve productie-fix toegepast op 2026-04-24 rond `20:38Z`:
  - `entry_photos_raw_entry_id_sort_order_key` is `deferrable`
  - `reorder_entry_photos` gebruikt deferred constraint tijdens reorder-update
- ✅ Productie-herverify reorder op 2026-04-24 rond `20:39Z`:
  - dezelfde touch-repro op dezelfde fixture-entry geeft `204` op `reorder_entry_photos`
  - geen zichtbare gallery-foutmelding
  - volgorde veranderde van `[f2d14118..., 61941a4b..., ca2c5fbd...]` naar `[61941a4b..., f2d14118..., ca2c5fbd...]`
- ✅ Productie live-fix gepusht naar `origin/main` in commit `4d2457c` op 2026-04-24

## Relevante links

- `docs/project/open-points.md`
- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
- `src/lib/entry-photo-gallery/flow.ts`
- `docs/dev/production-bug-investigation-workflow.md`
- `docs/project/25-tasks/open/moment-detail-foto-upload-productieflakiness-onderzoek.md`
