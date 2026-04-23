---
id: task-github-deployment-node-npm-versie-diagnose
title: GitHub deployment Node/NPM-versie diagnose
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Zoek bron-first uit of de lokale Node/NPM-versie, GitHub Actions Node 24 instelling of npm install gedrag opnieuw deployment-risico vormt, en bepaal pas daarna of een backlogtask nodig is."
tags: [github, deployment, node, npm, diagnostics]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

Tijdens lokale testinfra-installatie draaide de machine op Node 25.8.0 terwijl de repo `node: 24.x` vereist. Eerder was er vermoedelijk een GitHub deployment-melding rond Node/NPM of GitHub Actions runtime opgelost met een extra instelling.

We moeten bron-first bepalen of er nu nog een echt deployment-risico is, en of lokaal of in GitHub iets aangepast moet worden.

## Gewenste uitkomst

Er ligt een korte diagnose met:
- actuele repo Node/NPM-config
- actuele GitHub Actions deployment-config
- relevante recente GitHub run/check bewijzen
- advies: niets doen, lokaal naar Node 24 terug, GitHub configuratie aanpassen, of aparte backlogtask maken

## Diagnose

Bevestigd op 2026-04-23:
- Repo vraagt Node 24 via `.nvmrc` (`24`) en `package.json` engines (`24.x`).
- Lokale shell draaide tijdens installatie op Node `v25.8.0` met npm `11.11.0`.
- `npm run check:node-version` faalt lokaal terecht zolang Node 25 actief is.
- GitHub Deploy Supabase Functions gebruikt `actions/setup-node@v4` met `node-version-file: .nvmrc`; recente deploy-run gebruikte Node `24.15.0` en npm `11.12.1`.
- GitHub workflows bevatten `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"`, de eerder bedoelde tijdelijke instelling.
- Recente deploy-run `24810626440` is `success`.
- Recente secret-scan run `24811218494` is `success`.
- GitHub annotation is een warning, geen failure: `actions/checkout@v4` en in deploy ook `actions/setup-node@v4` targeten Node 20 maar worden geforceerd op Node 24.
- GitHub changelog zegt dat Node 20 EOL is en dat GitHub runners vanaf juni 2026 Node 24 standaard gaan gebruiken; gebruikers moeten workflows updaten naar action-versies die Node 24 ondersteunen.
- Officiële nieuwste action releases bestaan: `actions/checkout@v6.0.2` en `actions/setup-node@v6.4.0`.

Conclusie: deployment wordt nu niet geblokkeerd door NPM/Node. Het echte resterende punt is een workflow-warning/hardening: upgrade GitHub Actions van v4 naar v6 en evalueer daarna of de tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` vlag nog nodig is.

## Waarom nu

- Nieuwe npm devDependencies zijn toegevoegd voor testinfra.
- Lokale Node 25 kan lockfile/install-gedrag beïnvloeden.
- Deployment-risico's moeten niet op gevoel maar op GitHub/checkrun-bewijs beoordeeld worden.

## In scope

- `.nvmrc`, `package.json`, `.github/workflows/**` en npm-config inspecteren.
- Recente GitHub Actions/checkruns via `gh` inspecteren.
- Alleen een nieuwe backlogtask maken als er daadwerkelijk werk uit de diagnose volgt.

## Buiten scope

- Direct dependency-upgrades of npm-audit fixes uitvoeren.
- GitHub workflow aanpassen zonder expliciet besluit na diagnose.
- Productcode wijzigen.

## Concrete checklist

- [x] Repo Node/NPM-config inspecteren.
- [x] GitHub workflow-config inspecteren.
- [x] Recente GitHub run/checkrun via `gh` inspecteren.
- [x] Diagnose en advies vastleggen.
- [x] Alleen indien nodig vervolgtaak/backlogtask maken.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- ✅ `gh run list --repo pflikweert/persoonlijke-assistent-app --limit 12`
- ✅ `gh api repos/pflikweert/persoonlijke-assistent-app/check-runs/72616314178/annotations`
- ✅ `gh run view 24810626440 --repo pflikweert/persoonlijke-assistent-app --json ...`
- ✅ `gh run view 24810626440 --repo pflikweert/persoonlijke-assistent-app --log`
- ✅ `gh api repos/actions/checkout/releases/latest` (`v6.0.2`)
- ✅ `gh api repos/actions/setup-node/releases/latest` (`v6.4.0`)
- ✅ `npm run check:node-version` faalt lokaal op Node `v25.8.0`, zoals bedoeld
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `.github/workflows/deploy.yml`
- `.github/workflows/secret-scan.yml`
- `.nvmrc`
- `package.json`
