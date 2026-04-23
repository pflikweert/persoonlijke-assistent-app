---
id: task-aiqs-logging-valideren-openai-dashboard-en-fallback
title: AIQS logging valideren in OpenAI dashboard en fallback-logpad
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Valideer dat AIQS logging voor bestaande OpenAI-calls leesbaar binnenkomt in het OpenAI API-dashboard, met werkende fallback-logging en een duidelijke 4-uurs logging-toggle in de admin UI."
tags: [aiqs, logging, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 3
---
















# AIQS logging valideren in OpenAI dashboard en fallback-logpad

## Probleem / context

Voor de huidige AIQS-testflow is logging al deels aanwezig, maar het is nog niet duidelijk genoeg of logging voor de bestaande OpenAI-calls daadwerkelijk zichtbaar en leesbaar is in de OpenAI dashboard-logging.
Daarnaast is onduidelijkheid in de huidige logging-UI (aan/uit-state en werking van de 4-uurs privacy-timebox) een blokkade voor betrouwbaar gebruik tijdens testen.

## Gewenste uitkomst

Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests in de praktijk traceerbaar zijn.
De fallback in eigen logging blijft aantoonbaar werken.

De logging-bediening in AIQS is helder en laagdrempelig: een duidelijke aan/uit-keuze met begrijpelijke statusweergave en expliciete 4-uurs vervaltijd, zodat direct duidelijk is of logging actief is.

## Waarom nu

- Dit is de basis om tijdens live testen gericht verbeteringen te kunnen doen.
- Zonder zichtbare logging blijft AIQS-iteratie te blind en te traag.
- Het ondersteunt de bewijs-gedreven afronding van de huidige consumer-beta fase.

## In scope

- Valideren dat bestaande AIQS-calls in OpenAI dashboard-logging terechtkomen en leesbaar zijn.
- Valideren dat fallback-logging voor dezelfde calls beschikbaar blijft.
- Logging-toggle/controls in AIQS admin vereenvoudigen en status expliciet maken.
- Expliciteren dat logging na 4 uur automatisch uitgaat (privacy-default).
- Runtime-bewijs vastleggen van logging aan/uit + zichtbaar resultaat.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AI-task families.
- Uitbouw naar volledige observability-suite of nieuwe review-workflow.
- End-user loggingfeatures buiten AIQS admin.

## Concrete checklist

- [ ] Huidige loggingpaden voor AIQS-calls inventariseren (OpenAI dashboard + fallback).
- [ ] End-to-end valideren dat dashboard logging zichtbaar is bij actieve logging-toggle.
- [ ] Fallback logging valideren voor dezelfde flow en failure-/degradatiescenario.
- [ ] Logging-toggle UX versimpelen met duidelijke aan/uit-status en 4-uurs indicatie.
- [ ] Bewijs vastleggen met concrete testresultaten voor aan/uit-gedrag en zichtbaarheid.

## Blockers / afhankelijkheden

- Toegang tot productieomgeving en OpenAI API-dashboard loggingweergave.
- Afstemming met admin-only guardrails uit `docs/project/ai-quality-studio.md`.

## Verify / bewijs

- Runtime-validatie van logging aan/uit in AIQS admin.
- Aantoonbare logging in OpenAI dashboard voor bestaande calls.
- Aantoonbare fallback logging voor dezelfde testcases.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`
