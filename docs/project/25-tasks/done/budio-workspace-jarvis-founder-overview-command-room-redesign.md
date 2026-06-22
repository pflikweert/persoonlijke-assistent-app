---
id: task-budio-workspace-jarvis-founder-overview-command-room-redesign
title: Budio Workspace Jarvis founder-overview command room redesign
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Breng de Jarvis-view visueel en interactief veel dichter bij founder-overview.png met echte workspace-data, bestaande Luma-assets, bewegende core en behoud van echte chat/mic-functies."
tags: [plugin, vscode, jarvis, ui, luma, command-room, polish]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 1
---


# Budio Workspace Jarvis founder-overview command room redesign

## Probleem / context

De huidige Jarvis-view werkt technisch verder door op de hardening-slices, maar voelt visueel nog niet genoeg als de aangeleverde command-room referentie. `assets/jarvis/final-frame/founder-overview.png` toont een warm, premium, founder-first Jarvis dashboard met linker contextkolom, levend middenstuk, command bar en rechter awareness-rail. De huidige view gebruikt wel assets, maar mist nog de compositie, diepte, beweging en compacte interactieve command-room ervaring van die referentie.

## Gewenste uitkomst

Jarvis opent als een zelfstandige command room binnen de bestaande plugin, visueel duidelijk geïnspireerd op `founder-overview.png`: warme charcoal/ivory/gold hiërarchie, een levende centrale intelligence core, echte workspacecontext links, systeem/agent-awareness rechts, subtiele command controls en een chat/mic command deck dat de bestaande echte runtime blijft gebruiken.

## User outcome

De gebruiker opent de Jarvis-view en ziet een geloofwaardige founder command room die past bij het aangeleverde frame. De gebruiker kan nog steeds typen, push-to-talk gebruiken wanneer toegestaan, resetten, herladen, assets syncen en prompts vanuit echte task/workspacecontext voorbereiden. De interface toont geen nepdata, maar echte status, echte taskdata, echte assetstatus en eerlijke empty states.

## Functional slice

Een Jarvis-only UI/UX-redesign van de bestaande view met:
- founder-overview-gebaseerde layout;
- bestaande Luma-assets als visuele basis;
- state-reactieve, bewegende Jarvis core;
- echte workspace/task/agent/asset-status in rails;
- interactieve prompt-suggesties die de echte chatinput vullen;
- behoud van de bestaande chat-, mic-, reload-, reset- en sync-acties.

## Entry / exit

- Entry: gebruiker opent de top-level `jarvis` view in de Budio Workspace plugin.
- Exit: gebruiker ziet de nieuwe command-room layout, kan direct prompten of push-to-talk starten, en ziet echte status/agent/workspace/assetinformatie zonder functionele wijzigingen aan andere views.

## Happy flow

1. Jarvis hydrateert de bestaande lokale state, assets, board snapshot en conversation capabilities.
2. De view toont een founder-overview-achtige command room met links workspacecontext, midden core + command deck en rechts systeem/agents/suggesties.
3. De gebruiker klikt een suggestie of typt zelf een prompt; de bestaande echte `onSendPrompt` flow start.
4. De Jarvis core beweegt/reageert op idle, thinking, transcribing, recording en active-agent states.
5. De gebruiker kan herladen, syncen, resetten en microfooninstellingen openen via compacte echte controls.

## Non-happy flows

- Empty state: geen focus-items, assets of agents toont een rustige echte leegstatus, geen verzonnen data.
- Permission denied / unavailable: mic blijft de bestaande echte permission/unavailable-state tonen.
- Validation / unsupported state: unsupported voice of ontbrekende assets worden compact en eerlijk weergegeven.
- Failure / retry / cancel: provider-, sync- of runtimefouten blijven zichtbaar via bestaande echte Jarvis-state.

## UX / copy

- `founder-overview.png` is de leidende visuele referentie voor compositie, sfeer en hiërarchie.
- Copy is minimal cinematic en functioneel: korte labels als `Werkcontext`, `Systeemstatus`, `Activity`, `Suggesties`, `Command`.
- Geen prototypekopjes zoals `Praat met Jarvis`, `Live gesprekssessie`, `Jij`, `workspace`.
- Geen fake seeddata zoals verzonnen sprint-, staging- of PR-status.
- Prompt-suggesties mogen bestaan, maar moeten alleen de input vullen en niet doen alsof er al actie is uitgevoerd.

## Data / IO

- Input:
  - bestaande Jarvis assetmanifesten en lokale assets;
  - `founder-overview.png` als referentie;
  - board snapshot, taskstatussen, active-agent metadata en conversation state;
  - bestaande chat/mic capability state.
- Output:
  - alleen webview/UI-wijzigingen en taskfile-status;
  - geen nieuwe secrets;
  - geen taskmutaties vanuit Jarvis;
  - geen functionele wijzigingen aan board/list/epics/settings.
- Opslag/API/service/file-impact:
  - `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`;
  - `tools/budio-workspace-vscode/webview-ui/src/styles.css`;
  - taskfile en gegenereerde docs bij afronding.
- Statussen:
  - bestaand chat/voice/runtime/asset/agent model blijft leidend.

## Waarom nu

De gebruiker heeft expliciet aangegeven dat Jarvis er nog niet uitziet als `founder-overview.png` en dat de omgeving goed, uitgebreid, interactief en bewegend moet aanvoelen. De runtime is eerder gehard; nu moet de visuele ervaring het niveau van de aangeleverde command-room richting halen.

## In scope

- Jarvis-view herstructureren richting founder-overview-layout.
- CSS/animatie/responsive polish voor Jarvis-only.
- Bestaande Luma-assets beter benutten.
- Echte data in left/right rails tonen.
- Suggesties/quick actions interactief maken zonder fake uitvoering.
- Plugin typecheck/test/apply.

## Buiten scope

- Board/list/epics/settings functioneel aanpassen.
- Nieuwe autonome agentruns of taskmutaties.
- Nieuwe providerabstractie of modelkeuzescherm.
- Nieuwe Luma-generatie als blocker; alleen bestaande assets zijn verplicht.
- Publieke Budio app wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Jarvis moet veel meer lijken op `founder-overview.png`.
- Maak het uitgebreid en interactief.
- Laat de Jarvis/core bewegen en reageren.
- Gebruik bestaande assets uit de eerder aangeleverde ZIP/Luma ingest.
- Houd echte functies werkend en laat niets nep lijken.
- Bestaande pluginviews blijven intact.

## Expliciete user requirements / detailbehoud

- `founder-overview.png` moet leidend zijn voor de visuele richting.
- Jarvis moet er duidelijk beter en rijker uitzien dan de huidige variant.
- Er moeten interactieve functies in zitten, niet alleen decoratie.
- De Jarvis core moet bewegen/reageren.
- Gebruik bestaande assets uit de ZIP/Luma download.
- Geen placeholders of fake data in het scherm.

## Status per requirement

- [x] Founder-overview compositie toegepast — status: gebouwd
- [x] Bewegende, state-reactieve Jarvis core — status: gebouwd
- [x] Echte workspace/agent/assetdata in rails — status: gebouwd
- [x] Interactieve prompt/quick actions zonder fake uitvoer — status: gebouwd
- [x] Bestaande chat/mic/reload/sync/reset functies behouden — status: gebouwd
- [x] Responsive polish voor small/large pluginformaten — status: gebouwd
- [x] Plugin opnieuw toegepast op VS Code workspace — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De Jarvis-view is omgebouwd naar een ingelijste founder-command-room met topbar, status-iconrail, werkcontext links, levend core-middenstuk en systeem/activity/suggesties rechts.
- Prompt-suggesties en task/source cards vullen alleen de echte command input; ze simuleren geen uitvoering.
- Bestaande Luma-assets worden manifestgedreven gebruikt voor ambient video, core, waveform, HUD-texture, speaking banner en side-rail sfeer.
- De core reageert visueel op echte chat-, voice- en active-agent states.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: Jarvis-view herstructureren naar founder-overview command-room compositie.
- [x] Blok 3: CSS/animatie/responsive polish toevoegen en bestaande assets beter benutten.
- [x] Blok 4: typecheck/test/apply en task/docs afronden.

## Concrete checklist

- [x] Current Jarvis code en assetmanifest lezen.
- [x] Layout ombouwen naar top frame, icon rail, left rail, center core, command deck en right rail.
- [x] Echte status/system/activity/suggestie-data vanuit bestaande state afleiden.
- [x] Core animaties koppelen aan chat/voice/agent states.
- [x] Prompt-suggesties en quick actions op echte handlers aansluiten.
- [x] CSS responsive maken voor smal/breed.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow verify en docs bundle/verify afronden.

## Acceptance criteria

- [x] Jarvis is visueel herkenbaar gebaseerd op `founder-overview.png`.
- [x] Jarvis toont geen fake hoofddata of prototypecopy.
- [x] Jarvis core beweegt en reageert zichtbaar op echte states.
- [x] Typed chat, push-to-talk, reset, reload en sync blijven aangesloten op bestaande handlers.
- [x] Left/right rails gebruiken echte workspace-, agent- en assetinformatie of eerlijke empty states.
- [x] Layout blijft bruikbaar op smalle en brede webviewbreedtes.
- [x] `npm --prefix tools/budio-workspace-vscode run apply:workspace` is uitgevoerd.

## Blockers / afhankelijkheden

- Geen bekende blockers. Fysieke VS Code-webview-mic permissie blijft afhankelijk van macOS/VS Code runtime, maar de UI mag die state eerlijk tonen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension gebouwd/gepackaged/geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: Jarvis visueel/interactief veel dichter naar `founder-overview.png` brengen met bestaande assets, echte data, bewegende core en behoud van echte functies.
- Toegevoegde verbeteringen: founder-command-room frame, echte prompt cards, manifestgedreven assetlagen en state-reactieve HUD-motion.
- Afgerond: Jarvis-view redesign, state-reactieve core, echte rails/control interactions, responsive CSS, plugin typecheck/test/apply, repo-checks en docs bundle/verify zijn afgerond.
- Open / blocked: geen bekende blockers; visuele eindreview gebeurt in de live VS Code webview.

## Relevante links

- `assets/jarvis/final-frame/founder-overview.png`
- `docs/project/25-tasks/done/budio-workspace-jarvis-hardening-echte-command-room.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room