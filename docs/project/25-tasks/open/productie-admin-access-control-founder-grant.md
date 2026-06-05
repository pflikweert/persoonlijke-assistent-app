---
id: productie-admin-access-control-founder-grant
title: Productie admin access-control deploy en founder grant
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-05
summary: Los productie admin-instellingen Edge Function failure op en geef pflikweert@gmail.com founder/adminrechten in productie.
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: ""
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


## Probleem / context

In productie geeft het openen van admin instellingen via het menu de melding `failed to send request to the edge function`. Brononderzoek wijst naar een deploy-gat: de client gebruikt `admin-access-control`, maar de production GitHub Actions workflow deployt deze Edge Function niet.

Daarnaast moet `pflikweert@gmail.com` in productie founderrechten en alle admincapabilities krijgen. Dit is accountdata en hoort als gecontroleerde productie-datafix, niet in git of een migration.

## Gewenste uitkomst

Admin instellingen laden in productie weer via `admin-access-control`. Een unauthenticated reachability smoke krijgt een nette function-response (`401 AUTH_MISSING`) in plaats van een transport/deploy failure.

`pflikweert@gmail.com` staat in productie als founder en heeft de capabilities `ai_quality_studio`, `regeneration` en `meeting_capture`.

## User outcome

De founder kan in productie het adminmenu openen, adminrechten beheren en AIQS/admin tooling bereiken zonder Edge Function transportfout.

## Functional slice

Een production incidentfix bestaande uit:

- production deploy coverage voor `admin-access-control`;
- een post-deploy smoke voor function reachability;
- een gecontroleerde one-off founder/capability grant voor `pflikweert@gmail.com`.

## Entry / exit

- Entry: gebruiker opent admin instellingen via productie-menu.
- Exit: admin access laadt zonder transportfout en `pflikweert@gmail.com` is founder met alle admincapabilities.

## Happy flow

1. GitHub Actions deployt alle benodigde Supabase Edge Functions inclusief `admin-access-control`.
2. Post-deploy smoke krijgt voor `admin-access-control` een gestructureerde `AUTH_MISSING` response zonder auth.
3. Productie SQL grant vindt `pflikweert@gmail.com` in `auth.users` en upsert founder + capabilities.
4. Productie admin instellingen laden voor de founder.

## Non-happy flows

- Empty state: als `pflikweert@gmail.com` niet in `auth.users` bestaat, stopt de grant met expliciete fout en wordt geen account aangemaakt.
- Permission denied / unavailable: function zonder auth moet `AUTH_MISSING` geven, niet transport failure.
- Validation / unsupported state: ontbrekende Supabase secrets blijven door workflowvalidatie falen met duidelijke melding.
- Failure / retry / cancel: als deploy of grant faalt, blijft taak open met bronbewijs en retry-stap.

## UX / copy

- Geen UI/copy-wijziging in deze taak.
- Bestaande app-foutmelding wordt indirect opgelost doordat de Edge Function bereikbaar wordt.

## Data / IO

- Input: productie gebruiker `pflikweert@gmail.com`.
- Output: founder-row en drie capability-rows in productie.
- Opslag/API/service/file-impact: `.github/workflows/deploy.yml`; productie DB one-off datafix.
- Statussen: workflow success, function reachability success, DB grant verified.

## Waarom nu

Deze fout blokkeert productie-admin toegang en daarmee MVP-beheer, AIQS governance en adminrechtenbeheer.

## In scope

- `admin-access-control` toevoegen aan production deploy.
- Post-deploy reachability smoke toevoegen.
- Productie founder/admin capability grant uitvoeren.
- Lint/typecheck/taskflow en deployment-checks draaien.

## Buiten scope

- Geen frontend redesign.
- Geen backend/API-contractwijziging.
- Geen datamodelwijziging.
- Geen secrets of accountdata committen.
- `start-user-export` deploy coverage blijft buiten scope tenzij het direct dezelfde admin-instellingenfout blijkt te veroorzaken.

## Oorspronkelijk plan / afgesproken scope

Het goedgekeurde plan:

- Production deployt `admin-access-control` niet terwijl admin menu/rechtenbeheer deze Edge Function aanroept.
- `.github/workflows/deploy.yml` moet `admin-access-control` deployen met dezelfde Supabase CLI/API route als de andere private functions.
- Voeg een kleine post-deploy reachability smoke toe voor `admin-access-control`: unauthenticated POST moet `401 AUTH_MISSING` JSON geven, geen transport/deploy failure.
- Geef `pflikweert@gmail.com` founder + alle admincapabilities in productie via one-off datafix.
- Commit geen accountdata, tokens of secrets.

## Expliciete user requirements / detailbehoud

- Productie admin instellingen openen via menu moet geen `failed to send request to the edge function` meer geven.
- `pflikweert@gmail.com` moet productie founder/adminrechten krijgen.
- Founder grant is productie-datafix, geen migration en geen git-secret.
- Geen account aanmaken als de productie-user niet bestaat.

## Status per requirement

- [x] `admin-access-control` production deploy toegevoegd — status: gebouwd
- [x] Post-deploy reachability smoke toegevoegd — status: gebouwd
- [ ] `pflikweert@gmail.com` founder + capabilities in productie — status: nog niet gebouwd
- [ ] GitHub Actions deploy groen gecontroleerd — status: nog niet gebouwd
- [ ] Function reachability en DB grant geverifieerd — status: nog niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: workflow-fix voor function deploy en reachability smoke.
- [x] Blok 3: lokale static verify.
- [ ] Blok 4: commit/push en GitHub deployment controleren.
- [ ] Blok 5: productie founder/capability grant uitvoeren en verifiëren.

## Concrete checklist

- [x] `.github/workflows/deploy.yml` deployt `admin-access-control`.
- [x] Workflow heeft post-deploy smoke voor `admin-access-control`.
- [x] `npm run lint` groen.
- [x] `npm run typecheck` groen.
- [x] `npm run taskflow:verify` groen.
- [ ] Fix commit gepusht naar `main`.
- [ ] GitHub deploy-run groen.
- [ ] Production grant uitgevoerd.
- [ ] Production grant verified.

## Acceptance criteria

- [ ] Production deploy bevat `admin-access-control`.
- [ ] Unauthenticated production smoke naar `admin-access-control` retourneert `401` met `flow: "admin-access-control"` en `code: "AUTH_MISSING"`.
- [ ] `pflikweert@gmail.com` staat in `admin_founders`.
- [ ] `pflikweert@gmail.com` heeft `ai_quality_studio`, `regeneration` en `meeting_capture`.
- [ ] Admin instellingen kunnen door founder geopend worden zonder Edge Function transportfout.

## Blockers / afhankelijkheden

- Productie write vereist geldige Supabase productie credentials in lokale omgeving of via toegestane CLI/API route.
- Als `pflikweert@gmail.com` nog niet in productie `auth.users` bestaat, is eerst inloggen/registreren nodig.

## Verify / bewijs

- `npm run lint` — groen.
- `npm run typecheck` — groen.
- `npm run taskflow:verify` — groen.
- GitHub Actions deploy-run voor gepushte commit.
- Production Edge Function reachability smoke.
- Production DB verification query voor founder + capabilities.

## Reconciliation voor afronding

- Oorspronkelijk plan: productie deploy-fix voor `admin-access-control` en one-off founder grant.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: workflow-fix, verify, push, production grant en production smoke.

## Relevante links

- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`
- `.github/workflows/deploy.yml`
- `supabase/functions/admin-access-control/index.ts`


## Commits

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function