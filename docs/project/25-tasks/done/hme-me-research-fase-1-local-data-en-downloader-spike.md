---
id: task-hme-me-research-fase-1-local-data-en-downloader-spike
title: "HME-ME research fase 1: local data en downloader spike"
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-26
summary: "Zet een persoonlijk local-first HME-ME researchspoor veilig op buiten de Vandaag MVP, inclusief ignored lokale data-root, modulebasis en eerste mijnRadboud viewer-inspectiespike na handmatige login."
tags: [personal-research, hme-me, local-first, downloader-spike, privacy]
workstream: idea
due_date: null
sort_order: 1
---


## Probleem / context

De gebruiker wil een persoonlijk HME-ME researchspoor starten binnen de Budio
repo, zonder dit te vermengen met de Vandaag MVP of productstatus. De eerste
praktische bottleneck is dat radiologiebeelden/study-assets via mijnRadboud niet
als simpele handmatige download beschikbaar lijken. Er is daarom een veilige
local-first basis nodig en een eerste downloader-/inspectiespike die pas na
handmatige DigiD/mijnRadboud-login inventariseert wat de viewer toont en welke
netwerkrequests relevant zijn.

Dit spoor mag geen medische data, sessiemateriaal of gevoelige exports in Git
brengen. Echte data hoort uitsluitend lokaal onder `.local-data/**`.

## Gewenste uitkomst

Fase 1 levert een veilige repo- en toolingbasis op:

- het aangeleverde researchplan staat als persoonlijk idea/researchdocument in
  `docs/project/40-ideas/60-personal-research/`
- `.local-data/**` en relevante lokale medische/export/browserartefacten zijn
  hard uitgesloten van Git
- `modules/hme-me-research/**` bevat alleen generieke code, docs, templates en
  dummy metadata
- er is een reproduceerbaar pad voor handmatige login, viewer openen,
  studies/series/network inventariseren en lokaal manifest/logs bijwerken

## Waarom nu

- De gebruiker wil niet handmatig duizenden beelden downloaden.
- De login en beveiliging blijven bewust handmatig, maar de post-login
  inventarisatie kan lokaal geautomatiseerd worden.
- De privacygrenzen moeten vanaf de eerste commit goed staan voordat echte data
  lokaal wordt verzameld.

## In scope

- Researchdocument plaatsen in `40-ideas/60-personal-research/`.
- Taskfile aanmaken en taskflow synchroon houden.
- `.gitignore` hardenen voor `.local-data/**`, browserprofielen, downloads,
  exports, logs/HAR en medische exportbestanden.
- Modulebasis maken onder `modules/hme-me-research/**`.
- `prepare-local-data-root.ts` maken voor veilige lokale mapvoorbereiding.
- `inspect-radboud-viewer.ts` maken als eerste Playwright inspectiespike na
  handmatige login.
- `package.json` en `package-lock.json` alleen aanpassen voor reproduceerbare
  TypeScript script-uitvoering als dat nodig is.
- Verify draaien en alleen committen als alle gevraagde checks slagen.

## Buiten scope

- App-schermen.
- Supabase-tabellen of Edge Functions.
- AI-analyse, OpenAI-calls of cloud upload.
- Echte medische interpretatie of diagnoseclaims.
- Automatische DigiD-login, MFA-omzeiling, sessiecontrole-omzeiling of
  portaalbeveiliging omzeilen.
- Brede viewer/annotation UI.
- Productieklare batchdownloader zonder eerst 1 study-route te bewijzen.
- Mutaties aan `docs/project/20-planning/**` of `docs/project/current-status.md`.

## Oorspronkelijk plan / afgesproken scope

Het goedgekeurde plan:

1. Plaats het researchdocument op
   `docs/project/40-ideas/60-personal-research/hme-me-local-first-research.md`
   en maak een lichte hub-README indien logisch.
2. Maak deze taskfile vanuit de bestaande task-template met `workstream: idea`,
   status `in_progress`, fase-1 scope, privacy-eisen, requirement-statussen,
   uitvoerblokken en reconciliation.
3. Breid `.gitignore` uit met `.local-data/**` en extra lokale researchrisico's
   zoals browserprofielen, lokale downloads/exports/logs/HAR-bestanden en
   medische exportformaten waar passend.
4. Maak `modules/hme-me-research/**` met README, download-flow notes,
   metadata-model en dummy `fixtures/example-study.manifest.json`.
5. Voeg `tsx` toe als devDependency en npm scripts toe wanneer nodig voor
   reproduceerbare `.ts` scripts.
6. Maak `prepare-local-data-root.ts` dat lokale ignored mappen aanmaakt,
   veilige placeholders schrijft als ze ontbreken, niets overschrijft en nooit
   destructief werkt.
7. Maak `inspect-radboud-viewer.ts` als Playwright-spike met persistent local
   profile onder `.local-data/**`, handmatige login-instructie, DOM/network
   inventarisatie, gesanitiseerde logs en lokaal manifest.
8. Beperk downloads standaard tot inventaris; alleen met expliciete optie mag
   maximaal 1 geselecteerde/test-study of Playwright download-event lokaal
   worden opgeslagen.
9. Draai verify en commit alleen bij groen resultaat met message
   `docs/tooling: add HME-ME local-first downloader spike`.

## Expliciete user requirements / detailbehoud

- Dit is persoonlijk researchspoor, geen Vandaag MVP-feature.
- De gebruiker downloadt niet handmatig duizenden beelden.
- DigiD/mijnRadboud-login blijft handmatig.
- Na handmatige login moet tooling zoveel mogelijk automatisch studies vinden,
  series/images inventariseren, netwerkrequests/calls vastleggen, bestanden
  downloaden, lokale manifests bijwerken en hervatten na onderbreking.
- Geen poging om DigiD, MFA, sessiecontrole of portaalbeveiliging te omzeilen.
- Geen credentials, cookies, tokens, HAR met auth headers of medische data
  committen.
- Echte data staat alleen lokaal in `.local-data/**`.
- Geen OpenAI, Supabase, cloud upload of diagnoseclaims.
- Volgende stap moet duidelijk zijn: eerst 1 study bewijzen, daarna pas
  batchdownload van alle studies.

## Status per requirement

- [x] Researchdocument geplaatst - status: gebouwd.
- [x] Taskfile aangemaakt - status: gebouwd.
- [x] `.local-data/**` uitgesloten van Git - status: gebouwd.
- [x] Modulebasis toegevoegd - status: gebouwd.
- [x] Veilig lokaal data-root script toegevoegd - status: gebouwd.
- [x] Eerste mijnRadboud viewer-inspectiespike toegevoegd - status: gebouwd.
- [x] Geen echte medische data in Git - status: gebouwd.
- [x] Geen tokens/cookies/auth headers opslaan in repo - status: gebouwd.
- [x] Volgende stap naar 1-study bewijs en batchdownload gedocumenteerd -
  status: gebouwd.
- [x] Verify afgerond - status: gebouwd.

## Toegevoegde verbeteringen tijdens uitvoering

- Geen aanvullende scope buiten het goedgekeurde plan.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: researchdocument, taskfile en idea-hub plaatsen.
- [x] Blok 3: `.gitignore`, modulebasis en scripts toevoegen.
- [x] Blok 4: gerichte verify, task reconciliation en commit afronden.

## Concrete checklist

- [x] Researchdocument opgenomen onder `40-ideas/60-personal-research/`.
- [x] Taskfile aangemaakt en bovenaan `in_progress` gezet.
- [x] `.gitignore` uitgebreid voor local-first medische researchdata.
- [x] Module README, docs en dummy fixture toegevoegd.
- [x] `prepare-local-data-root.ts` toegevoegd.
- [x] `inspect-radboud-viewer.ts` toegevoegd.
- [x] Npm scripts en runner-dependency toegevoegd.
- [x] `git status --short` controleren op medische data/binaire exports.
- [x] `npm run lint`.
- [x] `npm run typecheck`.
- [x] `npm run docs:bundle`.
- [x] `npm run docs:bundle:verify`.
- [x] `npm run taskflow:verify`.
- [x] Commit-ready wijzigingenset voorbereid bij groene verify.

## Blockers / afhankelijkheden

- Geen functionele blockers.
- Runtime gebruik van de inspectiespike vereist handmatige mijnRadboud/DigiD
  login door de gebruiker en een geopende radiologiebeeldenpagina.

## Verify / bewijs

- `git status --short` gecontroleerd; `.local-data/` verschijnt alleen als
  ignored output en wordt niet staged.
- `npm run hme-me:prepare`
- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: fase 1 local-first researchbasis en eerste
  downloader-/inspectiespike na handmatige login.
- Toegevoegde verbeteringen: geen aanvullende scope buiten het plan.
- Afgerond: researchdocument, taskfile, `.gitignore`, modulebasis, scripts,
  package wiring en verify zijn afgerond.
- Open / blocked: geen inhoudelijke open punten binnen fase 1.

## Relevante links

- `docs/project/40-ideas/60-personal-research/hme-me-local-first-research.md`
- `modules/hme-me-research/README.md`
- `.local-data/experiments/hme-me-research/`


## Commits

- aec1b28 — docs/tooling: add HME-ME local-first downloader spike