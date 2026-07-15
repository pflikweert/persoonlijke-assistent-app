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
sort_order: 5
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


## Commits

- 942af46 — docs: sync local workspace state

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge

- 2026-04-29T00:14:29+02:00 — docs: sync task commit logs

- 2026-04-29T01:47:27+02:00 — fix: diagnose Android photo prepare regression

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-01T11:08:03+02:00 — feat: add admin capability access control

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state

- 2026-07-15T19:15:41+02:00 — feat: make Budio web app installable