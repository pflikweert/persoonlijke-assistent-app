---
id: task-codex-browser-testworkflow-expliciteren
title: Codex browser-testworkflow expliciteren
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: "Leg docs-only vast dat geautomatiseerde browserchecks standaard via Playwright Chromium/headless lopen, headed Chromium expliciet is voor visuele smoke/debug, en Atlas alleen optioneel handmatig wordt gebruikt."
tags: [codex, browser, playwright, atlas, qa, local-dev]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


# Codex browser-testworkflow expliciteren

## Probleem / context

De repo heeft al Playwright Chromium-smokes, failure-artifacts en een optionele `BUDIO_DEV_BROWSER` voor Expo preview. Het verschil tussen geautomatiseerde tests, headed visual smoke en handmatige Atlas-review staat nog niet expliciet genoeg in de workflowdocs.

## Gewenste uitkomst

De docs maken duidelijk dat automatisering reproduceerbaar via Playwright Chromium/headless blijft. Headed Chromium is alleen expliciet voor visuele/debug-smokes. ChatGPT Atlas mag als handmatige reviewlaag of AI-assisted browsing worden gebruikt, maar wordt geen fragiele standaard testdependency.

## User outcome

Pieter en Codex weten wanneer Chrome/Chromium, headed mode of Atlas logisch is, zonder dat testgedrag of dependencies veranderen.

## Functional slice

Docs-only aanscherping van de lokale QA- en developmentworkflow.

## Entry / exit

- Entry: bestaande docs noemen Atlas als optionele Expo-browser en QA-smokes als browserbewijs.
- Exit: browserkeuze per verificatielaag is expliciet vastgelegd.

## Happy flow

1. Agent controleert bestaande scripts, Playwright-config en docs.
2. Agent past alleen relevante docs aan.
3. Agent draait taskflow/docs verify.

## Non-happy flows

- Validation / unsupported state: als verify faalt door bestaande dirty docs, wordt dat expliciet gerapporteerd.
- Failure / retry / cancel: geen code- of testgedrag wijzigen om docsverify te forceren.

## UX / copy

- Geen app-UI.
- Copy blijft operationeel en kort.

## Data / IO

- Input: `playwright.config.ts`, `package.json`, `docs/dev/**`, `.codex/config.toml`.
- Output: docs-only update.
- Opslag/API/service/file-impact: geen runtime-impact, geen dependencies, geen `.env*`.

## Waarom nu

- De lokale Codex/Atlas-vraag is net onderzocht en verdient een herhaalbare workflowregel voordat er opnieuw browser-smokes of visuele checks worden uitgevoerd.

## In scope

- `docs/dev/qa-test-strategy.md`
- `docs/dev/local-development-environment.md`
- Task/docs-sync

## Buiten scope

- Applicatiecode.
- Playwright-config of testscripts wijzigen.
- Dependencies toevoegen.
- `.env*`, productie-data, commit/push.

## Oorspronkelijk plan / afgesproken scope

- Findings uit het read-only onderzoek toepassen als kleine docs-only update.
- Automated tests blijven Playwright Chromium/headless.
- Headed Chromium alleen expliciet voor visuele smoke/debug.
- Atlas alleen optioneel handmatig of AI-assisted review, niet als standaard testtarget.

## Expliciete user requirements / detailbehoud

- [x] Niet Atlas forceren als primaire geautomatiseerde testbrowser.
- [x] Playwright Chromium/headless als automation-default behouden.
- [x] Headed Chromium alleen expliciet gebruiken.
- [x] Atlas als handmatige reviewlaag definiëren.
- [x] Geen code, tests, dependencies, productie-data of `.env*` aanpassen.

## Status per requirement

- [x] Browserlagen expliciet in docs — status: gebouwd
- [x] Geen runtime/testgedrag gewijzigd — status: gebouwd
- [x] Verify uitgevoerd — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Docs verduidelijken nu expliciet dat `BUDIO_DEV_BROWSER` alleen Expo-preview stuurt en geen Playwright-testtarget wijzigt.
- File-scoped Markdown-lint is apart uitgevoerd omdat `npm run docs:lint` repo-breed faalt op bestaande taskfile-lint buiten deze wijziging.

## Uitvoerblokken / fasering

- [x] Blok 1: huidige scripts/config/docs read-only bevestigen.
- [x] Blok 2: docs-only update toepassen.
- [x] Blok 3: taskflow/docs verify afronden.

## Concrete checklist

- [x] QA-docs uitbreiden met browserkeuze per laag.
- [x] Local-dev docs verduidelijken dat `BUDIO_DEV_BROWSER` alleen Expo preview stuurt.
- [x] Verify draaien.

## Acceptance criteria

- [x] Docs benoemen Playwright Chromium/headless als automation-default.
- [x] Docs benoemen headed Chromium als expliciete visuele/debug-optie.
- [x] Docs benoemen Atlas als optionele handmatige reviewlaag.
- [x] Geen app- of testcode is aangepast.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify` — passed.
- `npm run docs:lint` — failed op bestaande repo-brede Markdown-lintschuld buiten deze wijziging.
- `npx -y markdownlint-cli@0.45.0 --disable MD001 MD013 MD029 MD060 MD024 MD025 MD036 MD041 -- docs/dev/qa-test-strategy.md docs/dev/local-development-environment.md docs/project/25-tasks/open/codex-browser-testworkflow-expliciteren.md` — passed voor de aangeraakte bestanden vóór verplaatsing naar `done/`.
- `npm run docs:bundle` — passed.
- `npm run docs:bundle:verify` — passed.

## Reconciliation voor afronding

- Oorspronkelijk plan: docs-only workflowregel toevoegen voor browser-testlagen.
- Toegevoegde verbeteringen: `BUDIO_DEV_BROWSER` expliciet beperkt tot Expo-preview, niet Playwright.
- Afgerond: QA-docs en local-dev docs bijgewerkt; geen app-/testgedrag gewijzigd.
- Open / blocked: repo-brede `npm run docs:lint` heeft bestaande lintschuld in andere taskfiles.

## Relevante links

- `docs/dev/qa-test-strategy.md`
- `docs/dev/local-development-environment.md`
- `playwright.config.ts`
- `.codex/config.toml`


## Commits

- 2026-06-22T13:22:50+02:00 — docs: clarify codex browser test workflow