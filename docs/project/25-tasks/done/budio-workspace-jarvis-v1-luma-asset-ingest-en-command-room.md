---
id: task-budio-workspace-jarvis-v1-luma-asset-ingest-command-room
title: Budio Workspace Jarvis V1 — Luma asset ingest + first command room
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "Bouw een eerste internal-only Jarvis command room in de Budio Workspace plugin, gevoed door een gedeelde lokale Luma-downloadlaag met seed-manifest, CLI-prefetch, plugin-syncactie en manifestgedreven rendering van de Final Frame-assets."
tags: [plugin, vscode, jarvis, luma, workspace, assets, command-room]
workstream: plugin
epic_id: epic-budio-workspace-hierarchy-linear-lite
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 23
---




## Probleem / context

Er is nu wel een richting voor een Budio Workspace Command Room en er ligt een concreet Final Frame-document met goedgekeurde Jarvis-assets, maar er bestaat nog geen uitvoerbare ingestlaag of pluginview die die set lokaal kan binnenhalen en tonen.

Daardoor blijft Jarvis hangen als research en losse designcontext, terwijl er juist behoefte is aan een eerste tastbare internal-only workspacevariant in de bestaande VS Code-plugin.

## Gewenste uitkomst

De repo bevat een gedeelde lokale Luma-toolset onder `tools/jarvis-luma/` die Final Frame seed-assets kan resolven, downloaden of markeren als handmatige fallback, en die lokale output opslaat onder `assets/jarvis/final-frame/` met manifest en rapportage.

Daarnaast bevat de bestaande Budio Workspace plugin een nieuwe top-level `jarvis`-view met syncactie en nette fallbackstates, zodat de eerste command room direct in de plugin zichtbaar is op basis van lokale manifestdata en bestanden.

## User outcome

De founder/developer kan vanuit de repo of plugin een Jarvis asset-sync starten en daarna in de bestaande Budio Workspace-plugin een eerste command room openen met de juiste visuals, contentblokken en syncstatus.

## Functional slice

Eerste end-to-end slice voor Jarvis in Workspace:
- seed-manifest uit Final Frame
- lokale Luma downloader met API-first + fallback
- gedeelde asset-output onder `assets/jarvis/final-frame/`
- plugincommand + pluginview `jarvis`
- manifestgedreven command-room render en fallbackstates

## Entry / exit

- Entry: lokale repo met bestaande Budio Workspace plugin en Final Frame-document als bron.
- Exit: `budioWorkspace.openJarvis` toont een werkende Jarvis-view; `budioWorkspace.syncJarvisAssets` of de CLI kan de assetset lokaal verversen.

## Happy flow

1. Developer draait de CLI of start sync vanuit de plugin met een geldige `LUMA_AGENTS_API_KEY`.
2. Downloader verwerkt seed-assets, downloadt resolvebare PNG/MP4-bestanden, schrijft manifest + report, en markeert niet-resolvebare items als fallbackstatus.
3. Jarvis-view leest het lokale manifest en rendert de command room met visuals, content en correcte ready/partial-status.

## Non-happy flows

- Empty state: nog geen manifest of nog geen download; Jarvis-view toont duidelijke setup/sync-state.
- Permission denied / unavailable: ontbrekende of ongeldige key geeft `missing_key` of foutstatus zonder secret leakage.
- Validation / unsupported state: short seed ID is niet via publieke Luma API te resolven; item krijgt `manual_source_required`.
- Failure / retry / cancel: individuele downloadfouten blokkeren de rest van de sync niet; manifest blijft partieel bruikbaar en sync kan opnieuw gestart worden.

## UX / copy

- Gebruik Final Frame-copy voor left rail, right rail, speaking surface en command bar.
- Jarvis-view gebruikt bestaande plugin-shell en navigatiepatronen; geen aparte extension of los shellproject.
- Fallback copy benoemt concreet: geen manifest, sync bezig, key ontbreekt, gedeeltelijke assets, sync mislukt.

## Data / IO

- Input:
  - `tools/jarvis-luma/final-frame.seed.json`
  - `LUMA_AGENTS_API_KEY`
  - lokaal Final Frame-bronbestand voor text fallback
- Output:
  - `assets/jarvis/final-frame/jarvis-assets-manifest.json`
  - `assets/jarvis/final-frame/download-report.json`
  - lokale PNG/MP4/text outputs
- Opslag/API/service/file-impact:
  - lokale files onder `assets/jarvis/`
  - externe calls naar gedocumenteerde Luma endpoints
  - plugin leest alleen lokale manifest- en assetpaden
- Statussen:
  - `idle`, `syncing`, `partial`, `ready`, `error`, `missing_key`, `missing_manifest`

## Waarom nu

- Dit is de kleinste bouwbare Jarvis-slice die research omzet in een tastbare workspacevariant.
- Het houdt Jarvis internal-only en binnen de pluginworkstream, zonder Budio app-runtime of publieke feature-scope te verbreden.
- Het sluit direct aan op de bestaande workspace-plugin en de eerder vastgelegde command-room richting.

## In scope

- `tools/jarvis-luma/` toolset toevoegen met seed-manifest, Luma client, downloader en README.
- Shared asset-output onder `assets/jarvis/final-frame/`.
- Plugin uitbreiden met `jarvis`-view, sync-command, settings en manifestgedreven rendering.
- Gerichte tests voor downloader, manifeststatussen en pluginrouting/state.
- Taskflow-, plugin- en repo-verify draaien.

## Buiten scope

- Nieuwe Jarvis prompt/generatieflow of beeldbewerking.
- Publieke productfeature of koppeling met Budio app runtime.
- Browser shell buiten de bestaande VS Code-plugin.
- Volledige canvas-sync als publiek of officieel ondersteund Luma API-contract.

## Oorspronkelijk plan / afgesproken scope

- Bouw een eerste internal-only Jarvis command room binnen de bestaande VS Code workspace-plugin.
- Gebruik een gedeelde lokale Luma-downloadlaag met seed-manifest, CLI-prefetch en plugin-syncactie.
- Render de Final Frame-assets en content manifestgedreven in een nieuwe `jarvis`-view.
- Hanteer API-first + fallback voor short asset IDs die waarschijnlijk canvas/object IDs zijn in plaats van generation UUIDs.

## Expliciete user requirements / detailbehoud

- Gebruik een **nieuwe taskfile**; de bestaande research-task blijft alleen context.
- Scopekeuzes liggen vast:
  - volledige command room
  - API-first + fallback
  - shared root assets
  - CLI + plugin UI trigger
  - PNG + MP4 + text docs
- Nieuwe commands:
  - `budioWorkspace.openJarvis`
  - `budioWorkspace.syncJarvisAssets`
- Nieuwe settings:
  - `budioWorkspace.jarvisAssetsRoot`
  - `budioWorkspace.jarvisSeedManifest`
- Seed bevat alle asset IDs, logische namen, rollen, outputfilenames, command-room content en design tokens uit Final Frame.
- Text docs mogen via lokale file-import of handmatige contentseed landen wanneer de API ze niet levert.
- Eén asset die niet resolvebaar is mag de rest van de sync niet blokkeren.
- Hergebruik bewezen Luma-patronen uit `space-idle-game/tools/luma/`, maar geen gamespecifieke prompt/generatielaag.

## Status per requirement

- [x] Nieuwe spec-ready taskfile en in-progress taskflow — status: gebouwd
- [x] Gedeelde lokale Luma-ingestlaag onder `tools/jarvis-luma/` — status: gebouwd
- [x] Shared output + manifest/report onder `assets/jarvis/final-frame/` — status: gebouwd
- [x] Plugin uitbreiden met `jarvis`-view, sync-command en settings — status: gebouwd
- [x] Manifestgedreven command-room render + fallbackstates — status: gebouwd
- [x] Gerichte tests en verify — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Bootstrap de lokale Jarvis-output direct met de nieuwe syncscript, zodat manifest/report en seeded docs meteen beschikbaar zijn zonder extra handmatige setup.
- Voeg plugin-only shared Jarvis-types en host-loader toe zodat de UI manifestgedreven blijft en niet op losse screen-local aannames draait.
- Importeer de volledige door de gebruiker aangeleverde Luma zip-download en map de Final Frame-assets direct naar de verwachte lokale Jarvis-bestandsnamen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: gedeelde Luma-ingestlaag en seed/outputstructuur bouwen.
- [x] Blok 3: plugin host/webview uitbreiden met Jarvis-view en syncactie.
- [x] Blok 4: gerichte tests, verify en task/docs afronden.

## Concrete checklist

- [x] `tools/jarvis-luma/final-frame.seed.json` toevoegen met Final Frame brondata.
- [x] `tools/jarvis-luma/luma-client.mjs` en `download-final-frame.mjs` bouwen.
- [x] README voor lokale usage en fallbackpolicy toevoegen.
- [x] `assets/jarvis/final-frame/` bootstrapbestanden toevoegen.
- [x] Plugincommands, settings, host state en webview messages uitbreiden.
- [x] Jarvis-view en command-room UI renderen.
- [x] Tests en verify draaien.

## Acceptance criteria

- [x] `node tools/jarvis-luma/download-final-frame.mjs --dry-run` geeft een valide dry-run zonder secrets of writes.
- [x] Downloader schrijft manifest/report en laat partial succes toe wanneer enkele assets niet resolvebaar zijn.
- [x] `budioWorkspace.openJarvis` opent een nieuwe Jarvis-view in de bestaande plugin.
- [x] `budioWorkspace.syncJarvisAssets` start dezelfde ingestflow via de pluginhost.
- [x] Jarvis-view toont correcte ready/partial/error/fallbackstates op basis van het lokale manifest.

## Blockers / afhankelijkheden

- Geen actieve blockers meer binnen deze scope.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck`
- `npm --prefix tools/budio-workspace-vscode run test`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- `node tools/jarvis-luma/download-final-frame.mjs --dest assets/jarvis/final-frame`
- `npm run taskflow:verify`
- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: eerste Jarvis command room bouwen met gedeelde ingestlaag + pluginview.
- Toegevoegde verbeteringen: lokale bootstrap van manifest/report + seeded docs, een gedeelde plugin-host loader voor Jarvis-state en directe zip-import van de volledige Luma-download.
- Afgerond: seed-manifest, downloader, tests, shared asset-output, plugincommands/settings/messages, Jarvis-view, workspace apply, repo/docs verify en lokale Final Frame-assetimport naar een `ready` Jarvis-manifest.
- Open / blocked: geen blockers meer binnen deze scope; alleen optionele latere uitbreidingen zoals automatische zip-import of directe canvas-mapping krijgen een eigen vervolgtaak.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- `docs/project/25-tasks/open/budio-workspace-command-room-research-en-startpunt-vastleggen.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state