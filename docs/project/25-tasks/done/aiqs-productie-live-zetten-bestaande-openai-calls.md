---
id: task-aiqs-productie-live-zetten-bestaande-openai-calls
title: AIQS productie live zetten voor bestaande OpenAI-calls
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-07-02
summary: "Zet de huidige AIQS-variant snel en gecontroleerd live in productie voor alleen de bestaande OpenAI-calls, zonder nieuwe reviewflow of extra calls toe te voegen."
tags: [aiqs, productie, openai, consumer-beta]
workstream: aiqs
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


















# AIQS productie live zetten voor bestaande OpenAI-calls

## Probleem / context

De huidige AIQS-variant is functioneel bruikbaar, maar de productiedoelstelling is nog niet expliciet als taak verankerd: AIQS moet in productie werken voor de bestaande OpenAI-calls, zonder scope-uitbreiding.
Er is nadrukkelijk geen behoefte om nu de geplande bredere reviewflow te bouwen.

## Gewenste uitkomst

De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls.
Er worden geen nieuwe calls toegevoegd en geen nieuwe reviewproceslaag gebouwd binnen deze taak.

Deze taak is klaar wanneer de productieroute aantoonbaar werkt en de minimale operationele checks zijn vastgelegd om live testen mogelijk te maken.

## User outcome

Een founder/admin ziet in productie de actuele AI Quality Studio admin UI en kan de bestaande AIQS-managed runtimecalls gebruiken zonder preview-branch of lokale omgeving.

## Functional slice

Eén go-live slice: merge de actuele AIQS-werkbranch naar `main`, laat Vercel en Supabase Functions production deployen, en bevestig via live bundle/runtimebewijs dat de nieuwe AIQS admin en bestaande runtimecalls actief zijn.

## Entry / exit

- Entry: live omgeving toont nog oude AI Quality Studio UI terwijl de werkbranch de nieuwe AIQS-implementatie bevat.
- Exit: `origin/main` bevat de AIQS-werkbranch, production deploy is groen, en de live bundle bevat de nieuwe AIQS UI-copy.

## Happy flow

1. Controleer welke branch live ontbreekt.
2. Fast-forward `main` naar de actuele AIQS-werkbranch.
3. Push `main`.
4. Controleer Vercel production deployment, Supabase Functions workflow en live bundle.
5. Leg bewijs vast in de taskfile.

## Non-happy flows

- Merge conflict: stop en los bronbestand-conflict gericht op voordat `main` gepusht wordt.
- Deployment failure: rapporteer GitHub/Vercel/Supabase statusbron en fix pas na bronanalyse.
- Live bundle bevat oude UI: controleer alias/cache/deployment-target voordat vervolgacties worden gedaan.

## UX / copy

Geen nieuwe UX-scope. De productiecheck bevestigt alleen dat de eerder gebouwde AIQS admin UI live staat.

## Data / IO

- Input: git branches, GitHub deployment/status API, Vercel live assets, Supabase Functions workflowstatus.
- Output: `main` deployment met actuele AIQS UI en vastgelegd bewijs.
- Geen productdata-mutaties.

## Waarom nu

- Snelle live-validatie in de eigen productieomgeving is nu belangrijker dan featureverbreding.
- Het verlaagt de feedbackloop voor AIQS-verbetering in realistische omstandigheden.
- Het houdt de fase focus op bewijs-gedreven consumer-beta afronding.

## In scope

- Productieroute voor bestaande AIQS OpenAI-calls valideren en waar nodig repareren.
- Admin-only toegang en server-side guardrails behouden in productie.
- Nodige runtime/config checks voor stabiele live-werking vastleggen.
- Bewijs leveren dat huidige AIQS-calls in productie end-to-end werken.

## Buiten scope

- Nieuw reviewproces of uitgebreide evaluatielifecycle bouwen.
- Nieuwe AI-taken, extra OpenAI-calls of control-plane verbreding.
- Niet-AIQS productverbreding buiten de huidige adminflow.

## Concrete checklist

- [x] Productiepad van bestaande AIQS-calls checken op end-to-end werking.
- [x] Eventuele blockers in config/guardrails oplossen zonder scope-uitbreiding.
- [x] Bevestigen dat admin-only toegang in productie correct gehandhaafd blijft.
- [x] Bewijs vastleggen dat de huidige calls live werken zoals verwacht.
- [x] Korte operationele go-live notitie vastleggen voor vervolgtesten.

## Uitvoerblok 2026-07-02

- [x] Bevestigd dat `origin/main` nog op `5482b81` stond en de AIQS-werkbranch op `c246e04`.
- [x] Bevestigd dat de live `assistent.budio.nl` bundle de nieuwe AIQS overview-copy nog niet bevat.
- [x] Bevestigd dat de enige niet-main branch `codex/moments-viewer-deblock` is.
- [x] Merge `codex/moments-viewer-deblock` naar `main`.
- [x] Push `main` zodat Vercel productie opnieuw deployt.
- [x] Post-push deploymentstatus controleren.

## Acceptance criteria

- [x] `origin/main` bevat de AIQS-werkbranch.
- [x] Vercel production deployment is groen.
- [x] Supabase Functions deployment workflow is groen.
- [x] Live AIQS bundle bevat nieuwe UI-copy.
- [x] Live AIQS bundle bevat oude overviewsecties `Runtime Governance` en `AIQS Context` niet meer.

## Productie go-live bewijs 2026-07-02

- Branchsituatie vóór merge:
  - `origin/main`: `5482b81`
  - `codex/moments-viewer-deblock`: `c246e04` plus taskflow-closeout commit
  - enige niet-main branch: `codex/moments-viewer-deblock`
- Merge:
  - `main` fast-forwarded van `5482b81` naar `afc96a5`
  - docs-bundle closeout commit op `main`: `1e9e36d`
  - push naar `origin/main` gelukt
- Deployment:
  - GitHub deployment id `5282539236`, environment `production`
  - Vercel deployment target: `https://persoonlijke-assistent-8rwxbo8z5-pflikweerts-projects.vercel.app`
  - deployment status: `success`, `created_at=2026-07-02T10:04:24Z`
  - Supabase Functions workflow `Deploy Supabase Functions`, run `28581769230`: `completed`, `success`
  - Secret Scan workflow run `28581769180`: `completed`, `success`
- Live bundle check op `https://assistent.budio.nl/settings-ai-quality-studio`:
  - nieuw bundlebestand: `/_expo/static/js/web/entry-cc0129f92e422e3cef39ec9144066118.js`
  - bevat nieuwe AIQS overview-copy `Beheer promptfamilies, drafts en runtimekwaliteit.`
  - bevat `Alle runtimes actief`
  - bevat `Live versie bekijken`, `Versies opschonen`, `AI observaties`
  - bevat niet meer de oude overviewsecties `Runtime Governance` en `AIQS Context`

## Reconciliation

- Oorspronkelijk doel: bestaande AIQS OpenAI-calls en adminflow gecontroleerd naar productie brengen.
- Afgerond:
  - productie runtime-smoke voor AIQS-calls is vastgelegd in `done/productie-moment-geen-dagverhaal-aiqs-runtime-smoke.md`
  - Supabase Edge Functions deploy is groen
  - productie-webbundle bevat de nieuwe AIQS admin UI
  - oude AIQS overviewsecties zijn niet meer aanwezig in de live JS-bundle
- Open: geen.

## Blockers / afhankelijkheden

- Productieomgeving en geldige admin-toegang.
- Bestaande server-side configuratie voor AIQS/OpenAI-callpad.

## Verify / bewijs

- Runtimebewijs van succesvolle AIQS-calls in productie.
- Bevestiging van admin-only afscherming in productie.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`


## Commits

- 5a7e3e0 — docs: add service status backlog task

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-07-02T12:00:53+02:00 — docs: track AIQS production merge

- 2026-07-02T12:06:34+02:00 — docs: close AIQS production go-live task