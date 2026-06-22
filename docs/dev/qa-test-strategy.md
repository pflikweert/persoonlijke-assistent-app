# QA test strategy

## Doel

Maak runtime- en regressiebewijs herhaalbaar, zonder elke kleine wijziging zwaar te maken.

## Testlagen

### Browserkeuze

Gebruik Playwright Chromium/headless als standaard voor geautomatiseerde browser-smokes en E2E.
Headed Chromium is alleen bedoeld voor expliciete visuele/debug-smokes, bijvoorbeeld met `--headed`, `--debug` of de Playwright VS Code extension.

ChatGPT Atlas is geen standaard geautomatiseerde testtarget in deze repo.
Atlas mag handmatig worden gebruikt voor AI-assisted review of lokale preview wanneer `BUDIO_DEV_BROWSER="ChatGPT Atlas"` machine-lokaal is gezet, maar mag geen vereiste zijn voor reproduceerbare tests.

Regels:

- automation: Playwright Chromium/headless
- visual debug: expliciet headed Chromium
- manual review: optioneel Atlas of gewone browser
- productie-achtige smoke: expliciete URL/env + Playwright Chromium/headless

### Unit

Gebruik voor complexe pure logica:

- sortering
- validatie
- mapping
- branchy helpers
- edge-case berekeningen

Nieuwe complexe helpermodules krijgen direct unit-tests en mikken minimaal op 80% coverage voor die nieuwe module.
Simpele render/glue-code hoeft niet standaard getest te worden.

### Smoke

Gebruik voor snelle interactie-regressies op een bestaande lokale webserver.

Een smoke test bewijst de kerninteractie die bij de wijziging hoort.
Voor UI-interacties is alleen `lint`/`typecheck` niet genoeg wanneer de bug of wijziging in gedrag zit.

Regels:

- kies slim: geen full E2E als een gerichte smoke de wijziging voldoende bewijst
- dek bij interactieve regressies idealiter:
  - het belangrijkste happy path
  - minimaal één betekenisvolle unhappy/failure-state die de rest van het scherm of de flow niet mag slopen
- wacht in browser-smokes eerst op een zichtbare stabiele baseline voordat je counts, skips of vervolgasserties bepaalt
- als lokaal runtime-bewijs nodig is maar het webtarget niet draait, start of herstart de kleinste benodigde lokale app-target en leg dat kort vast

### Full E2E

Gebruik voor volledige end-user flows:

- happy flow
- unhappy/error flow
- cancel/rollback flow
- limieten
- light/dark visuele check waar relevant

Full E2E draait bij grotere flowwijzigingen, eerdere regressies of release-readiness.

## Gallery standaard

Voor entry photo gallery:

- `npm run test:unit` voor helperlogica
- `npm run test:unit:coverage` voor nieuwe helper coverage
- `npm run test:e2e:gallery:smoke` voor snelle reorder-regressie
- `npm run test:e2e:gallery:full` voor volledige gallery-flow zodra seed/cleanup helpers bestaan

Bij upload/regressiewerk op web:

- bewijs minimaal één add/remove happy path wanneer de taak uploadgedrag raakt
- bewijs bij eerdere regressies ook één unhappy path, bijvoorbeeld failed prepare/file read waarbij bestaande gallery-state intact blijft

## Bewijsregel

Een interactieve UI-taak heet pas klaar wanneer:

- relevante unit-tests groen zijn bij complexe logica
- relevante smoke groen is, of expliciet is vastgelegd waarom dit nog niet kan
- full E2E groen is bij grotere flowwijzigingen of release-readiness
