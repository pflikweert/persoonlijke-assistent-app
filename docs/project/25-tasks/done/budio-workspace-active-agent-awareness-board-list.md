---
id: task-budio-workspace-active-agent-awareness-board-list
title: Budio Workspace active agent awareness in Board en List
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Toon echte actieve agentactiviteit duidelijk en near-realtime in de Budio Workspace Board en List views.
tags: [plugin, vscode, board, list, agent-metadata]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 7
---




## Probleem / context

Board en List gebruiken al echte `active_agent*` taskmetadata, maar actieve agentactiviteit is in het overzicht nog te subtiel. Daardoor is niet direct zichtbaar welke taak nu door Codex of een andere agent wordt uitgevoerd.

De gebruiker wil dit near-realtime kunnen zien, zonder fake states: alleen echte actieve metadata mag een taak als actief markeren, en de indicator moet verdwijnen zodra de agent klaar is of metadata wordt gewist.

## Gewenste uitkomst

Board en List tonen actieve agenttaken duidelijk met een rustige premium highlight, een live-chip en compacte context. Wanneer `active_agent*` wordt gewist, verdwijnt de highlight automatisch bij de volgende watcher/background refresh.

## User outcome

De gebruiker ziet in Board en List in één oogopslag welke taak momenteel door Codex/een agent wordt opgepakt en kan die taak direct openen vanuit een compacte live-agent strip.

## Functional slice

Een metadata-gedreven awareness slice in de bestaande Budio Workspace plugin: actieve agent UI-state helper, Board-card styling, List-row/mobile styling en compacte live-agent summary.

## Entry / exit

- Entry: gebruiker opent Board of List terwijl één of meer taskfiles echte actieve `active_agent*` metadata hebben.
- Exit: actieve taken zijn visueel herkenbaar; na `Stop agent`, clear of done cleanup verdwijnt de visual state zonder handmatige UI-reset.

## Happy flow

1. Gebruiker claimt een taak als actief in task detail.
2. De watcher hydrateert Board/List opnieuw.
3. Board-card en List-row tonen een duidelijke live-agent highlight en chip.
4. Gebruiker klikt de live-agent strip en opent/selecteert de actieve taak.
5. Gebruiker stopt de agent of rondt de taak af; metadata wordt gewist en de highlight verdwijnt.

## Non-happy flows

- Empty state: zonder actieve agentmetadata toont Board/List geen live-agent strip en geen highlights.
- Permission denied / unavailable: niet van toepassing; dit gebruikt lokale taskmetadata.
- Validation / unsupported state: onbekende of niet-actieve `active_agent_status` toont geen actieve highlight.
- Failure / retry / cancel: bestaande refresh/watch fallback blijft gelden; background refresh corrigeert gemiste watcher-events.

## UX / copy

- Chipcopy: `<Agent> actief`, bijvoorbeeld `Codex actief`.
- Compacte stripcopy: `<Agent> werkt aan <taaktitel>`.
- Visuele richting: zachte groen/cyaan live-gloed, subtiele pulse, geen waarschuwingkleur en geen fake progress.
- Board/List workflows, filters, drag/drop en detailgedrag blijven functioneel gelijk.

## Data / IO

- Input: bestaande `TaskCardViewModel` met `activeAgent`, `activeAgentStatus`, `activeAgentSince`, `activeAgentRuntime` en `activeAgentModel`.
- Output: alleen UI-state en CSS-klassen; geen markdown-schemawijziging.
- Opslag/API/service/file-impact: geen nieuwe opslag; bestaande claim/clear/done flows blijven leidend.
- Statussen: alleen actieve statuswaarden uit de bestaande helper markeren een taak als actief.

## Waarom nu

De agent-claim metadata is net toegevoegd aan task detail. De volgende logische stap is dat die echte metadata zichtbaar en bruikbaar wordt in de dagelijkse Board/List overzichten.

## In scope

- Active-agent UI-state helper.
- Board-card active-agent highlight.
- List desktop/mobile active-agent highlight.
- Compacte live-agent summary boven Board/List.
- Unit-tests voor helpergedrag.
- Plugin verify en apply.

## Buiten scope

- Automatisch claimen bij selecteren of statuswijziging.
- Nieuwe agent runtime, websocket of processtream.
- Wijzigingen aan board/list workflows, filters, drag/drop of task detail.
- Fake progress, fake activity of verzonnen agentstatus.

## Oorspronkelijk plan / afgesproken scope

- Board cards krijgen bij actieve agent een duidelijke maar rustige live-stijl.
- List desktop rows en mobile list cards krijgen dezelfde actieve stijl.
- Er komt een compacte live-agent strip wanneer actieve agents bestaan.
- Near realtime blijft gebaseerd op echte taskfile watcher/background refresh.
- Stop/afrondgedrag blijft metadata-gedreven.

## Expliciete user requirements / detailbehoud

- Actief aan gewerkt moet duidelijk zichtbaar zijn in Board en List.
- Gebruik achtergrondkleur of een ander sterk visueel kenmerk.
- Near realtime updates.
- Wanneer agent klaar is, verdwijnt de actieve indicator.
- Kom met slimme oplossingen, maar zonder nepdata.

## Status per requirement

- [x] Duidelijke Board-highlight — status: gebouwd; actieve metadata geeft card glow, accent rail en live-chip.
- [x] Duidelijke List-highlight — status: gebouwd; desktop rows en mobile cards krijgen dezelfde actieve behandeling.
- [x] Live-agent strip met directe selectie/opening — status: gebouwd; strip gebruikt echte actieve taskmetadata en selecteert via bestaande flow.
- [x] Metadata-gedreven verdwijnen na clear/done — status: gebouwd in codepad; bestaande clear/done cleanup blijft bron en helper toont alleen actieve metadata.
- [x] Tests en plugin apply — status: gebouwd; plugin typecheck/test/apply zijn groen.

## Toegevoegde verbeteringen tijdens uitvoering

- `activeAgentUiState` centraliseert chip-, runtime- en sinds-labels zodat Board/List geen eigen statusinterpretatie bevatten.
- List inline agent chip wordt expliciet overridet zodat hij niet door generieke list-copy clamp styling wordt vervormd.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: active-agent helper + tests toevoegen.
- [x] Blok 3: Board/List UI en CSS polish implementeren.
- [x] Blok 4: gerichte verify, plugin apply en task/docs afronden.

## Concrete checklist

- [x] Helper voor actieve-agent UI-state toevoegen en testen.
- [x] Board card active-agent class/chip/summary aansluiten.
- [x] List desktop/mobile active-agent class/chip/summary aansluiten.
- [x] CSS voor rustige live-agent highlight toevoegen.
- [x] Typecheck/test/apply uitvoeren.
- [x] Taskflow/docs bundle afronden en task naar done verplaatsen.

## Acceptance criteria

- [x] Een taak met echte actieve `active_agent*` metadata is in Board duidelijk herkenbaar.
- [x] Dezelfde taak is in List desktop en mobile duidelijk herkenbaar.
- [x] De live-agent strip verschijnt alleen wanneer actieve agentmetadata bestaat en opent/selecteert de taak.
- [x] Na clear/done verdwijnt de indicator na snapshot refresh.
- [x] Bestaande Board/List interacties blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- [x] `npm --prefix tools/budio-workspace-vscode run typecheck`
- [x] `npm --prefix tools/budio-workspace-vscode run test`
- [x] `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- [x] `npm run taskflow:verify`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`
- [x] Screenshot-helper smoke: `/tmp/budio-active-agent-board.png` bevestigd met foreground `Code — Budio Workspace: List — persoonlijke-assistent-app`; visuele strip stond niet bovenaan in beeld door behouden scrollpositie.

## Reconciliation voor afronding

- Oorspronkelijk plan: actieve agenttaken duidelijk zichtbaar maken in Board en List via echte `active_agent*` metadata, inclusief compacte live-agent strip en near-realtime watcher/background refresh.
- Toegevoegde verbeteringen: helper centraliseert live-labels en List inline-chip styling is gehard tegen generieke span-clamp.
- Afgerond: helper + tests, Board-card highlight, List desktop/mobile highlight, live-agent strip, plugin apply en repo-verificaties zijn uitgevoerd.
- Open / blocked: geen open functionele punten; screenshot-helper capture bevestigde plugin focus maar niet de bovenkant van de view door retained scrollpositie.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-task-detail-edit-polish-agent-claiming.md`
- `tools/budio-workspace-vscode/src/tasks/task-ux.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`


## Commits

- 2026-06-22T18:04:11+02:00 — Automate active agent metadata

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state