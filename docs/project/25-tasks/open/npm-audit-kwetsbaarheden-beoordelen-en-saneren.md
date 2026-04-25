---
id: task-npm-audit-kwetsbaarheden-beoordelen-en-saneren
title: npm audit kwetsbaarheden beoordelen en saneren
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Beoordeel de huidige npm audit meldingen na de testinfra-uitbreiding, bepaal welke runtime-relevant zijn, en saneer alleen de passende dependency-updates zonder onnodige brekende sprongen."
tags: [npm, audit, dependencies, security]
workstream: app
due_date: null
sort_order: 2
---

## Probleem / context

Na `npm install` onder Node 24 rapporteert npm nog steeds `14 vulnerabilities (13 moderate, 1 high)`. Deze zijn in deze ronde bewust niet inhoudelijk opgelost, omdat de actieve taak alleen GitHub Actions/Node-align en workflow-hardening betrof.

## Gewenste uitkomst

Er ligt een bron-gebaseerde beoordeling van de npm audit meldingen, inclusief onderscheid tussen:

- direct runtime-risico
- dev-only/tooling-risico
- fixes die veilig zijn
- fixes die breaking of scope-te-groot zijn

## Waarom nu

- De waarschuwing is actueel bevestigd op 2026-04-23.
- Testinfra en tooling zijn net uitgebreid.
- Dependency-onderhoud moet bewust gebeuren, niet stilzwijgend.

## In scope

- `npm audit` output analyseren.
- Impact per package/risk bepalen.
- Veilige sanering voorstellen of uitvoeren in een aparte uitvoerronde.

## Buiten scope

- Grote package-modernisering zonder expliciete keuze.
- Productcode refactors die alleen indirect uit dependency-upgrades voortkomen.

## Concrete checklist

- [ ] Audit-output vastleggen.
- [ ] Runtime vs dev-only risico scheiden.
- [ ] Veilige fixes bepalen.
- [ ] Beslissen welke fixes direct kunnen en welke een aparte grotere task vragen.

## Blockers / afhankelijkheden

- Nog te bepalen na concrete audit-output.

## Verify / bewijs

- ⏳ `npm audit`
- ⏳ relevante package verify

## Relevante links

- `package.json`
- `package-lock.json`
