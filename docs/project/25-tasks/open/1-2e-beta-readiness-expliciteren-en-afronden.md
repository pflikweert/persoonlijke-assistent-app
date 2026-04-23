---
id: task-1-2e-beta-readiness
title: 1.2E beta-readiness expliciteren en afronden
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft."
tags: [consumer-beta, beta-readiness]
workstream: app
due_date: null
sort_order: 4
---












# 1.2E beta-readiness expliciteren en afronden

## Probleem / context

`current-status.md` markeert 1.2E als deels aanwezig.
De smoke-checklist bestaat al, maar volledige runtime-doorloop en bewijsstandaard zijn nog niet als afgeronde readiness set verankerd.

## Gewenste uitkomst

Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.
De taak is klaar wanneer het team in één oogopslag ziet wat nog nodig is voor een overtuigende beta-readiness claim.

## Waarom nu

- Beta-readiness is een kernonderdeel van de nieuwe maandfocus.
- Zonder expliciete readinessset blijft de releasebeslissing diffuus.

## In scope

- Readinesschecklist structureren voor de huidige fase.
- Bewijsverwachting voor runtime- en UI-smokes expliciteren.
- Relatie met bestaande smoke-checklist aanscherpen.

## Buiten scope

- Nieuwe productsporen buiten consumer beta.
- Business/Private readiness of governanceverbreding.

## Concrete checklist

- [ ] Beta-readiness checklist structureren tot duidelijke fase-output.
- [ ] Bewijsregel per kernflow expliciteren.
- [ ] Resterende open items voor de beta-release zichtbaar maken.

## Blockers / afhankelijkheden

- Samenhang met 1.2B outputkwaliteit en de bestaande smoke-checklist.

## Verify / bewijs

- Canonieke docs bijgewerkt.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/20-planning/20-active-phase.md`
