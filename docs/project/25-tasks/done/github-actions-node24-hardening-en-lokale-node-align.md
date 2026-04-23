---
id: task-github-actions-node24-hardening-en-lokale-node-align
title: GitHub Actions Node 24 hardening en lokale Node-align
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Upgrade GitHub Actions naar Node-24-compatibele action-versies, verwijder waar passend de tijdelijke force-flag, en draai de repo-install/verify lokaal onder Node 24."
tags: [github, actions, node, npm, hardening]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De diagnose bevestigde dat deploys nu slagen, maar GitHub Actions nog warnings geeft omdat `actions/checkout@v4` en `actions/setup-node@v4` intern nog Node 20 targeten. Die draaien nu dankzij `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`.

Daarnaast draaide de lokale shell op Node 25 terwijl de repo expliciet Node 24 vereist.

## Gewenste uitkomst

GitHub workflows gebruiken actuele Node-24-compatibele action-versies, zodat de tijdelijke warning-constructie niet meer nodig is of minimaal kan worden heroverwogen. De repo is lokaal opnieuw gecontroleerd onder Node 24.

## Waarom nu

- De warning is al bevestigd met GitHub brondata.
- Nieuwe action-versies bestaan al.
- Lokale Node 25 vergroot kans op install- en lockfile-drift.

## In scope

- `.github/workflows/deploy.yml` en `.github/workflows/secret-scan.yml` upgraden naar moderne action-versies.
- Tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` verwijderen als dat na de upgrade niet meer nodig is.
- Relevante lokale verify onder Node 24 draaien.

## Buiten scope

- Npm audit vulnerabilities inhoudelijk oplossen.
- Grote dependency-upgrades buiten de action-versies.
- Productcode wijzigen.

## Concrete checklist

- [x] Taskflow gestart en taskfile bovenaan in_progress gezet.
- [x] GitHub Actions upgraden naar Node-24-compatibele versies.
- [x] Tijdelijke force-flag heroverwegen en verwijderen waar veilig.
- [x] Lokale Node 24 verify draaien.
- [x] Docs/taskflow verify afronden.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- ✅ `node -v` / `npm -v` onder Node 24 (`v24.15.0` / `11.12.1` op 2026-04-23)
- ✅ `npm install` onder Node 24 (geslaagd op 2026-04-23; audit-summary blijft 14 vulnerabilities)
- ✅ `npm run check:node-version` onder Node 24 (geslaagd op 2026-04-23)
- ✅ `npm run lint` onder Node 24 (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` onder Node 24 (geslaagd op 2026-04-23)
- ✅ Workflow-upgrade uitgevoerd: `actions/checkout@v6`, `actions/setup-node@v6`, tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` verwijderd
- ⏳ Post-push GitHub warning-check nog niet opnieuw bewezen in een nieuwe run
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `.github/workflows/deploy.yml`
- `.github/workflows/secret-scan.yml`
- `.nvmrc`
- `package.json`
