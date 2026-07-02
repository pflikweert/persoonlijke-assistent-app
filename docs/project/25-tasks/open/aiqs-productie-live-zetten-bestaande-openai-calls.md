---
id: task-aiqs-productie-live-zetten-bestaande-openai-calls
title: AIQS productie live zetten voor bestaande OpenAI-calls
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-07-02
summary: "Zet de huidige AIQS-variant snel en gecontroleerd live in productie voor alleen de bestaande OpenAI-calls, zonder nieuwe reviewflow of extra calls toe te voegen."
tags: [aiqs, productie, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 1
active_agent: Codex
active_agent_model: GPT-5
active_agent_runtime: codex
active_agent_since: "2026-07-02T12:02:00Z"
active_agent_status: running
active_agent_settings: default
---

















# AIQS productie live zetten voor bestaande OpenAI-calls

## Probleem / context

De huidige AIQS-variant is functioneel bruikbaar, maar de productiedoelstelling is nog niet expliciet als taak verankerd: AIQS moet in productie werken voor de bestaande OpenAI-calls, zonder scope-uitbreiding.
Er is nadrukkelijk geen behoefte om nu de geplande bredere reviewflow te bouwen.

## Gewenste uitkomst

De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls.
Er worden geen nieuwe calls toegevoegd en geen nieuwe reviewproceslaag gebouwd binnen deze taak.

Deze taak is klaar wanneer de productieroute aantoonbaar werkt en de minimale operationele checks zijn vastgelegd om live testen mogelijk te maken.

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
- [ ] Eventuele blockers in config/guardrails oplossen zonder scope-uitbreiding.
- [ ] Bevestigen dat admin-only toegang in productie correct gehandhaafd blijft.
- [x] Bewijs vastleggen dat de huidige calls live werken zoals verwacht.
- [ ] Korte operationele go-live notitie vastleggen voor vervolgtesten.

## Uitvoerblok 2026-07-02

- [x] Bevestigd dat `origin/main` nog op `5482b81` stond en de AIQS-werkbranch op `c246e04`.
- [x] Bevestigd dat de live `assistent.budio.nl` bundle de nieuwe AIQS overview-copy nog niet bevat.
- [x] Bevestigd dat de enige niet-main branch `codex/moments-viewer-deblock` is.
- [ ] Merge `codex/moments-viewer-deblock` naar `main`.
- [ ] Push `main` zodat Vercel productie opnieuw deployt.
- [ ] Post-push deploymentstatus controleren.

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