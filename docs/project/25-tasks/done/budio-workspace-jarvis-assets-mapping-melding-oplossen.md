---
id: task-budio-workspace-jarvis-assets-mapping-melding-oplossen
title: Budio Workspace Jarvis assets mapping melding oplossen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: Los de valse Jarvis assetmelding op waarbij 17/20 klaar en handmatige mapping nodig wordt gemeld terwijl het lokale manifest ready is.
tags: [plugin, vscode, jarvis, assets, luma]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


# Budio Workspace Jarvis assets mapping melding oplossen

## Probleem / context

Jarvis meldt: `17/20 klaar, 8 assets vereisen nog handmatige mapping of Luma export`. Het actuele lokale manifest in `assets/jarvis/final-frame/jarvis-assets-manifest.json` staat echter op `overallStatus: ready`, met 17 media-assets `ready` en 3 tekst-assets `seeded_text`. De melding is daardoor misleidend: tekst-assets zijn voor v1 bewust lokaal beschikbaar als seeded text en mogen niet als ontbrekende assets klinken.

## Gewenste uitkomst

Jarvis toont en gebruikt een assetstatus die de werkelijke beschikbaarheid weergeeft: 20/20 lokaal bruikbaar wanneer media ready is en tekst seeded is. Alleen echte `manual_source_required`, `error` of ontbrekende lokale bestanden worden als aandachtspunt gemeld.

## User outcome

De gebruiker ziet geen valse mapping/export waarschuwing meer wanneer de lokale Jarvis assets klaar zijn.

## Functional slice

- Asset availability normaliseren voor Jarvis state en chat-grounding.
- Valse `17/20` en mapping-copy voorkomen bij ready manifest.
- Plugin opnieuw toepassen zodat de Jarvis-view de gecorrigeerde status gebruikt.

## Entry / exit

- Entry: gebruiker opent Jarvis of vraagt Jarvis naar de workspace/assets.
- Exit: Jarvis rapporteert 20/20 beschikbaar of noemt alleen echte ontbrekende assets.

## Happy flow

1. Jarvis laadt het lokale manifest.
2. `ready + downloaded + seeded_text` telt als beschikbaar.
3. Chat-grounding en UI-status noemen geen handmatige mapping wanneer `manual_source_required` nul is.

## Non-happy flows

- Missing manifest: echte missing-manifest melding blijft bestaan.
- Manual required: alleen assets met status `manual_source_required` krijgen mapping/export melding.
- Error: assets met status `error` blijven als issues zichtbaar.
- Missing local file: status wordt niet als beschikbaar geteld als het lokale bestand ontbreekt.

## UX / copy

- Gebruik compacte, echte copy: `Jarvis assets beschikbaar: 20/20`.
- Geen waarschuwing over handmatige mapping/export als `manual_source_required: 0`.
- Geen fake of stale assetissues in hoofdview of chatcontext.

## Data / IO

- Input: `jarvis-assets-manifest.json`, seed manifest en lokale assetbestanden.
- Output: genormaliseerde Jarvis workspace state en chat-grounding.
- Opslag/API/service/file-impact: geen nieuwe Luma download vereist als lokale files aanwezig zijn.
- Statussen: `ready`, `downloaded`, `seeded_text` tellen als beschikbaar; `manual_source_required` en `error` tellen als aandachtspunt.

## Waarom nu

De gebruiker ziet nog een valse Jarvis assets-waarschuwing terwijl de assets lokaal klaarstaan. Dat ondermijnt de betrouwbaarheid van de command room.

## In scope

- Loader/chatcopy fixen.
- Tests toevoegen voor availabilitytelling en geen valse mappingissues.
- Plugin typecheck/test/apply.

## Buiten scope

- Nieuwe Luma assets genereren.
- Jarvis layout opnieuw redesignen.
- Board/list/epics/settings wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Los de melding op: `Jarvis assets: 17/20 klaar, 8 assets vereisen nog handmatige mapping of Luma export`.
- Gebruik echte lokale assetstatus, geen nep of stale placeholderstatus.

## Expliciete user requirements / detailbehoud

- De melding moet weg als assets echt klaar zijn.
- Geen fake UI-states of misleidende statuscopy.

## Status per requirement

- [x] Asset availability telt seeded text als lokaal beschikbaar — status: gebouwd
- [x] Mapping/export waarschuwing alleen bij echte manual assets — status: gebouwd
- [x] Tests en plugin apply — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Er is een pure Jarvis asset availability helper toegevoegd zodat chat-grounding en tests dezelfde waarheid gebruiken.
- De loader berekent summary nu uit de actuele merged assets en detecteert ontbrekende lokale bestanden als echte errors.
- De echte manifest-grounding is gecontroleerd: `Jarvis assets beschikbaar: 20/20`, `handmatige mapping nodig: 0`, `asset errors: 0`.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, manifest/report en taskflow bevestigen.
- [x] Blok 2: availability/copy helper aanpassen en tests toevoegen.
- [x] Blok 3: verify, plugin apply en task afronden.

## Concrete checklist

- [x] Bron van 17/20 assetcopy corrigeren.
- [x] Echte issuefilter toevoegen voor manual/error only.
- [x] Tests toevoegen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow/docs afronden.

## Acceptance criteria

- [x] Ready manifest met 17 ready + 3 seeded_text wordt als 20/20 beschikbaar gerapporteerd.
- [x] Geen mapping/export issue verschijnt wanneer `manual_source_required` nul is.
- [x] Echte manual/error assets blijven zichtbaar als aandachtspunt.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 49 tests
- Echte manifest-grounding smoke — geslaagd: `Jarvis assets beschikbaar: 20/20`, `handmatige mapping nodig: 0`, `asset errors: 0`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: valse Jarvis assetmelding oplossen.
- Toegevoegde verbeteringen: pure availability helper, echte issuefilter en lokale bestandscontrole toegevoegd.
- Afgerond: Jarvis chat-grounding telt seeded text-assets als beschikbaar, meldt 20/20 bij het huidige ready manifest en toont mapping/export alleen nog bij echte manual/error assets.
- Open / blocked: geen.

## Relevante links

- `assets/jarvis/final-frame/jarvis-assets-manifest.json`
- `tools/budio-workspace-vscode/src/extension/host/jarvis.ts`
- `tools/budio-workspace-vscode/src/jarvis/chat.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room