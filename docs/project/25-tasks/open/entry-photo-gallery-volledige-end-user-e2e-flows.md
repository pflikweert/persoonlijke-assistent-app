---
id: task-entry-photo-gallery-volledige-end-user-e2e-flows
title: Entry photo gallery volledige end-user E2E flows
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Breid de nieuwe gallery-smoke basis uit naar een volledige end-user E2E-suite voor toevoegen, verwijderen, max-limiet, viewer, reorder en unhappy/error flows."
tags: [qa, tests, gallery, photos, e2e]
workstream: app
due_date: null
sort_order: 1
---

## Probleem / context

De eerste gallery QA-basis bewijst de kerninteractie voor thumbnail-reorder en legt unit/smoke-infra neer. De volledige end-user dekking voor alle gallery-flows bestaat nog niet.

Voor toekomstige gallery-wijzigingen willen we kunnen kiezen tussen:
- een snelle smoke-test die bewijst dat de belangrijkste interactie niet kapot is
- een volledige end-user test die alle vastgelegde use cases en unhappy paths doorloopt

## Gewenste uitkomst

Er is een volledige Playwright end-user suite voor entry photo gallery flows. De suite gebruikt reproduceerbare local-only seed/cleanup helpers en kan opnieuw gedraaid worden wanneer dit scherm of de gallery-services wijzigen.

## Waarom nu

- De reorder-bug liet zien dat lint/typecheck onvoldoende zijn voor complexe interactie.
- De basis-smoke is klaar; de volgende kwaliteitsstap is volledige flowdekking.
- Dit ondersteunt de 80% coverage/KPI-richting zonder legacy-code ineens repo-breed te blokkeren.

## In scope

- Local seed/cleanup uitbreiden voor add/delete/max/error scenario's.
- E2E-dekking voor:
  - foto's toevoegen
  - max 5 foto's en disabled/limietgedrag
  - viewer openen/sluiten
  - foto verwijderen en annuleren
  - thumbnail reorder links/rechts
  - persist-fout of service-error pad waar lokaal veilig te simuleren
- Heldere run-instructies in `docs/dev/qa-test-strategy.md`.

## Buiten scope

- Native iOS/Android E2E.
- Repo-brede coverage gate voor legacy code.
- Nieuwe productfunctionaliteit buiten bestaande gallery-flows.

## Concrete checklist

- [ ] Full E2E seed/cleanup fixtures ontwerpen.
- [ ] Add-flow testen.
- [ ] Delete/cancel-flow testen.
- [ ] Max-limiet testen.
- [ ] Viewer-flow testen.
- [ ] Reorder links/rechts testen.
- [ ] Minstens één unhappy/error flow testen of expliciet onderbouwen waarom lokaal niet veilig simuleerbaar.
- [ ] Docs/runbook bijwerken.
- [ ] Verify draaien.

## Blockers / afhankelijkheden

- Vereist draaiende lokale webserver, Supabase local stack en Mailpit auth-flow.

## Verify / bewijs

- ⏳ `npm run test:e2e:gallery:full`
- ⏳ `npm run lint`
- ⏳ `npm run typecheck`
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `tests/e2e/gallery-full.spec.mjs`
- `scripts/seed-local-entry-photo-gallery-smoke.mjs`
- `docs/dev/qa-test-strategy.md`
