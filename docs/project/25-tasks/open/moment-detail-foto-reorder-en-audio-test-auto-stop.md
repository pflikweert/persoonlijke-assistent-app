---
id: task-moment-detail-foto-reorder-audio-test-auto-stop
title: Moment detail foto reorder + thumbnail-logica en audio test auto-stop
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-24
summary: "Hardening van moment-detail foto-upload en reorder in productie, inclusief live drag-preview, foutclassificatie, retry/refetch-gedrag, bevestigde reorder-root-cause in productie en repo-brede diagnoseflow/taskflow-guardrails."
tags: [moment-detail, photos, production, diagnostics, taskflow]
workstream: app
due_date: null
sort_order: 3
---


## Probleem / context

De moment detail-flow toont in productie twee reele regressies:

- foto-upload werkt soms wel en soms niet, zonder duidelijke foutfasering of diagnosepad
- reorder geeft in productie foutmeldingen en de placeholder schuift tijdens slepen niet live mee naar de nieuwe doelpositie

Daarnaast moet de repo-brede taskflow worden aangescherpt:

- Plan Mode mag in deze repo niet langer automatisch nieuwe taskfiles aanmaken
- productieonderzoek moet via een vaste read-only diagnoseflow en vaste agent-testaccount reproduceerbaar worden

Bevestigde reorder-root-cause op 2026-04-24:

- de productie-reorderfout zat in `public.reorder_entry_photos`
- een swap van `sort_order` veroorzaakte eerst een `23505` unique-conflict op `(raw_entry_id, sort_order)`
- een eerste tijdelijke offset-fix botste daarna op de check `sort_order between 0 and 4`
- de duurzame oplossing is: unieke constraint `deferrable` maken en de reorder-update binnen een deferred constraint uitvoeren

## Gewenste uitkomst

Op het moment-detailscherm kan de gebruiker foto's betrouwbaar uploaden en herordenen. Tijdens het slepen schuift de galerij live mee naar de beoogde nieuwe positie, en persist gebeurt pas na loslaten. Bij mismatch- of persistfouten volgt exact een autoritatieve refetch + retry; daarna blijft een geclassificeerde fout zichtbaar.

Daarnaast is er een compacte repo-brede workflow voor productiebug-onderzoek: altijd gekoppeld aan een bestaande task, met vaste Vercel/Supabase diagnosevolgorde, tijdelijke productie read-only context, een dedicated agent-testaccount zonder adminrechten en expliciete learnings terug naar taskfile + runbook.

## Waarom nu

- De productiebug schaadt vertrouwen in een kernflow: foto's toevoegen en een thumbnail kiezen voor een moment.
- De huidige reorder-UI laat niet betrouwbaar zien waar de foto zal landen.
- Toekomstig productieonderzoek kost te veel tijd zonder vaste testaccount, logvolgorde en taskflow-regel.

## In scope

- Hardening van uploadfases: pick, prepare, display upload, thumb upload, DB insert, post-upload refresh.
- Autoritatieve refetch na succesvolle upload voordat reorder weer actief wordt.
- Reorder-preview die live mee schuift met de doelpositie.
- Persist na loslaten, met precies een refetch + retry bij bekende reorder-mismatch.
- Geclassificeerde foutmelding voor upload/reorder i.p.v. alleen generieke fouttekst.
- Productie diagnose runbook in `docs/dev/**`.
- Repo-brede Plan Mode-regel: bestaande task verplicht, nieuwe task alleen buiten Plan Mode.
- Dedicated productie agent-testaccount als gedocumenteerd ops secret contract.

## Buiten scope

- Nieuwe foto-editing features zoals captions, albums of bulkbeheer.
- Nieuwe auth-backdoors of productie adminroutes voor agents.
- Nieuwe statuswaarden of aparte plan-only taakstructuur.
- Grote herbouw van andere moment detail-subflows buiten gallery/diagnose/taskflow.

## Concrete checklist

- [x] Bestaande task expliciet als enige hoofdtaak voor deze flow bevestigd.
- [x] Taskflow-regels bijgewerkt: Plan Mode gebruikt alleen bestaande taskfiles; geen auto-create.
- [x] Productie diagnose runbook toegevoegd met Vercel/Supabase read-only volgorde.
- [x] Ops secret contract voor dedicated productie agent-testaccount gedocumenteerd.
- [x] Gallery upload flow geclassificeerd per foutfase en autoritatieve refetch toegevoegd.
- [x] Gallery reorder flow toont live preview / meeschuivende doelpositie.
- [x] Reorder retry na refetch voor bekende mismatch-fouten toegevoegd.
- [x] Unit-tests uitgebreid voor preview-ordering, foutclassificatie en retry-pad.
- [x] Gallery smoke/full E2E bijgewerkt voor upload/reorder regressies.
- [x] Verify gedraaid (`taskflow`, `lint`, `typecheck`, relevante tests, docs bundle checks).

## Blockers / afhankelijkheden

- Productie diagnose vereist bestaande read-only toegangspaden en beschikbare Vercel-capability of CLI/API-route.
- Gerichte runtime-check in light/dark mode blijft afhankelijk van bruikbare lokale web/app target.
- Dedicated productie testaccount is aangemaakt; stabiele metadata staat lokaal in de gitignored env-config onder `PROD_AGENT_TEST_*`.
- Upload-flakiness in productie is nog niet separaat bronvast bevestigd; reorder is nu wel hard onderzocht en hersteld.

## Verify / bewijs

- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-24)
- ✅ `npm run test:unit` (13 tests geslaagd op 2026-04-24)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-24; desktop-web reorder bevestigt linkse verplaatsing na hold-and-drag)
- ✅ `GALLERY_E2E_FULL=1 npm run test:e2e:gallery:full` (1 test geslaagd, 2 bewust geskipt/fixme op 2026-04-24)
- ✅ `npm run lint` (geslaagd op 2026-04-24)
- ✅ `npm run typecheck` (geslaagd op 2026-04-24)
- ✅ Vercel productiecontext bevestigd op 2026-04-24:
  - deployment `dpl_VNVWEcwvCfcrFu7FcRWAY522Akp6`
  - alias `https://assistent.budio.nl`
  - created `2026-04-23 17:07:48 CEST`
- ⚠️ Vercel runtime-logcheck over laatste 24 uur op production/main gaf geen relevante logs terug voor `error`, `upload`, `reorder`, `storage` of `supabase`
- ✅ Supabase cloud project bevestigd via CLI op 2026-04-24:
  - project ref `xmrndabfqfvkhdhcjqit`
  - region `Central EU (Frankfurt)`
- ✅ Supabase cloud logquery via Management API op 2026-04-24:
  - `auth_logs`, `storage_logs`, `postgres_logs` en `edge_logs` voor de laatste 24 uur expliciet uitgevraagd
  - geen relevante logregels terug voor gallery/upload/reorder in het onderzochte venster
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
- ✅ Gerichte runtime-checks in light en dark mode voor moment detail gallery (lokale webtarget, screenshots vastgelegd op 2026-04-24)
- Productie repro-check met baseline-entry + sessie-entry via dedicated agent-testaccount

## Relevante links

- `docs/project/open-points.md`
- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
- `src/lib/entry-photo-gallery/flow.ts`
- `src/lib/entry-photo-gallery/sorting.ts`
- `docs/dev/production-bug-investigation-workflow.md`
