---
id: task-budio-workspace-jarvis-height-borderless-core-polish
title: Budio Workspace Jarvis height en borderless core polish
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-review
updated_at: 2026-06-13
summary: "Fix de Jarvis-view na screenshotreview: betere hoogte-schaal, minder borders en de centrale Jarvis-core als brede achtergrondlaag in plaats van opgesloten kaart."
tags: [plugin, vscode, jarvis, ui, polish, responsive]
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


# Budio Workspace Jarvis height en borderless core polish

## Probleem / context

De screenshotreview laat zien dat de Jarvis-view in de hoogte niet goed schaalt binnen het VS Code-paneel. Onderin valt content weg en de centrale Jarvis-core zit nog te veel opgesloten in een bordered kaart. De aangeleverde founder-overview-richting vraagt juist om minder zichtbare borders en een core die meer als volledige achtergrond/atmosfeer door het midden van de command room loopt.

## Gewenste uitkomst

Jarvis past beter binnen de beschikbare paneelhoogte, met scroll alleen binnen compacte rails waar nodig. De centrale Jarvis-core voelt groter en meer achtergrondvullend, met minder harde borders en minder nested card-massa, terwijl chat/mic/reload/sync/reset functioneel blijven.

## User outcome

De gebruiker opent Jarvis in VS Code en ziet een rustiger, ruimer command-room scherm dat niet onderin wordt afgesneden. De Jarvis-core domineert de achtergrond zoals in het design en de panels voelen minder boxed-in.

## Functional slice

CSS/layout polish voor de bestaande Jarvis-view:
- viewport-height correct schalen;
- frame en panel borders verzachten;
- core-stage borderless/achtergrondvullend maken;
- rails intern scrollbaar maken;
- command deck zichtbaar houden.

## Entry / exit

- Entry: gebruiker opent de bestaande Jarvis-view in het VS Code-paneel.
- Exit: de command room past in hoogte, gebruikt minder borders en de centrale core loopt visueel over de achtergrond.

## Happy flow

1. Jarvis opent binnen het huidige VS Code webview-paneel.
2. De centrale core schaalt als brede achtergrondlaag.
3. Linker- en rechterrails blijven bruikbaar en scrollen intern als de viewport te laag is.
4. Command deck blijft bereikbaar zonder dat de hele view onhandig onderin afkapt.

## Non-happy flows

- Kleine hoogte: panelcontent comprimeert en scrollt intern.
- Kleine breedte: bestaande responsive stack blijft werken.
- Motion reduced: bestaande reduced-motion regels blijven gelden.

## UX / copy

- Geen nieuwe copy.
- Minder borders/surfaces; meer atmosferische achtergrond, spacing en typografische hiërarchie.

## Data / IO

- Input: bestaande Jarvis CSS en screenshotreview.
- Output: CSS/layout wijziging in de plugin-webview.
- Opslag/API/service/file-impact: geen API- of datamodelwijziging.
- Statussen: bestaande Jarvis states blijven leidend.

## Waarom nu

De gebruiker heeft direct na de redesign-review aangegeven dat de schaal en visuele behandeling nog niet goed genoeg zijn.

## In scope

- `tools/budio-workspace-vscode/webview-ui/src/styles.css`
- Plugin verify en apply.
- Task/docs afronding.

## Buiten scope

- Nieuwe Jarvis functies.
- Board/list/epics/settings wijzigen.
- Nieuwe assets genereren.
- Runtime chat/mic bridge wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Hoogteschaal fixen.
- Jarvis in het midden meer over de hele achtergrond laten lopen.
- Minder borders gebruiken zoals in het design.

## Expliciete user requirements / detailbehoud

- "schaalt nog niet lekker in de hoogte"
- "jarvis in het midden moet over de hele achtergrond"
- "minder de borders gebruiken zoals in het design"

## Status per requirement

- [x] Hoogteschaal verbeterd — status: gebouwd
- [x] Centrale core meer achtergrondvullend — status: gebouwd
- [x] Borders visueel verminderd — status: gebouwd
- [x] Plugin opnieuw toegepast — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Jarvis krijgt nu een Jarvis-only `workspace-shell-jarvis`, zodat de view de volledige beschikbare gridhoogte gebruikt zonder board/list topbar-rijen.
- De centrale core-stage is borderless gemaakt en loopt visueel als brede achtergrondscene door het midden.
- Rails scrollen intern en worden compacter bij lagere viewporthoogtes.
- Bij lage VS Code-paneelhoogte worden promptchips verborgen en dialogue/controls compacter gehouden zodat het command deck bereikbaar blijft.

## Uitvoerblokken / fasering

- [x] Blok 1: screenshotreview, taskflow en CSS-context.
- [x] Blok 2: CSS layout polish uitvoeren.
- [x] Blok 3: typecheck/test/apply en docs afronden.

## Concrete checklist

- [x] Jarvis shell/frame hoogte aanpassen.
- [x] Midden-core borderless/achtergrondvullend maken.
- [x] Rails intern scrollbaar en compacter maken.
- [x] Borders/panelmassa verminderen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow/docs bundle afronden.

## Acceptance criteria

- [x] Jarvis-view gebruikt beschikbare hoogte beter en kapt command deck niet onnodig af.
- [x] Centrale Jarvis-core voelt als achtergrondlaag in plaats van bordered card.
- [x] Borders zijn zichtbaar rustiger en dichter bij het design.
- [x] Bestaande Jarvis-functies blijven aangesloten.
- [x] Plugin is opnieuw toegepast op VS Code workspace.

## Blockers / afhankelijkheden

- Geen bekende blockers.

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

- Oorspronkelijk plan: hoogteschaal verbeteren, core achtergrondvullend maken en borders verminderen.
- Toegevoegde verbeteringen: Jarvis-only parent grid class en lage-viewport compactieregels.
- Afgerond: codewijzigingen, plugin typecheck/test/apply, repo-checks en docs bundle/verify zijn afgerond.
- Open / blocked: geen bekende blockers; visuele eindreview gebeurt in de live VS Code webview.

## Relevante links

- `assets/jarvis/final-frame/founder-overview.png`
- `docs/project/25-tasks/done/budio-workspace-jarvis-founder-overview-command-room-redesign.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room