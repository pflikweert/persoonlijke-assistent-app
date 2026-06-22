---
id: task-budio-workspace-task-detail-edit-polish-agent-claiming
title: Budio Workspace task detail edit polish + agent claiming
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Verbeter de Budio Workspace task-detail edit UI en voeg expliciete agent-claim metadata toe.
tags: [plugin, vscode, task-detail, agent-metadata]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 1
---


## Probleem / context

De task-detail edit in de Budio Workspace plugin toont te veel onnodige of rommelige informatie. `Due date` is zichtbaar terwijl die niet gebruikt wordt, structuurinformatie staat visueel onvoldoende rustig, checklistregels stapelen checkbox en tekst onder elkaar, en de body preview is nu een compacte markdown-dump in plaats van een leesbare taakomschrijving.

Daarnaast moet actieve agentmetadata niet impliciet ontstaan door selecteren of statuswijziging, maar expliciet geclaimd en gestopt kunnen worden vanuit task detail. Die metadata bestaat al in frontmatter en moet zichtbaar, schrijfbaar en onderhoudbaar worden vanuit de plugin.

## Gewenste uitkomst

Task detail is rustiger en praktischer: geen due-date UI, een nette structuurkaart, horizontale checklistregels, en een read-only taakbeschrijving met de belangrijkste markdownsecties.

Agentstatus is zichtbaar in detail en kan expliciet worden geclaimd of gestopt. Board/list/Jarvis kunnen daarna op echte `active_agent*` metadata blijven vertrouwen.

## User outcome

De gebruiker kan een taak openen, snel de echte context lezen, checklistitems normaal afvinken/lezen, relaties begrijpen en expliciet aangeven dat Codex/de agent actief aan die taak werkt.

## Functional slice

Een werkende plugin-slice voor task-detail polish plus agent-claim/clear flow, zonder functionele wijziging aan bestaande board/list workflows buiten de detail UI en de nieuwe agentacties.

## Entry / exit

- Entry: gebruiker opent een task detail vanuit board of list.
- Exit: detail toont een leesbare structuur en taakbeschrijving; agent kan expliciet geclaimd of gestopt worden en metadata wordt in de taskfile bijgewerkt.

## Happy flow

1. Gebruiker opent een taak in board/list en ziet de detail edit rechts/fullscreen zonder due-date UI.
2. Gebruiker leest structuur, relaties, checklist en taakbeschrijving in rustige layout.
3. Gebruiker klikt `Claim als actief`; plugin schrijft `active_agent*` metadata en hydrateert de nieuwe staat.
4. Gebruiker klikt `Stop agent`; plugin wist de actieve agentvelden.

## Non-happy flows

- Empty state: ontbrekende relaties blijven als nette lege staat zichtbaar.
- Permission denied / unavailable: niet van toepassing; dit is lokale taskfile-mutatie.
- Validation / unsupported state: versieconflict blijft via bestaande expectedVersion-flow afgehandeld.
- Failure / retry / cancel: repositoryfouten blijven via bestaande host/webview foutafhandeling zichtbaar.

## UX / copy

- Verberg `Due date` in task-detail edit.
- Structuurlabels: `Epic`, `Parent task`, `Type`, `Blocked`.
- Relatieblokken: `Subtasks`, `Blocked by`, `Blocks`, `Follows after`.
- Taakomschrijving: heading `Taakbeschrijving`, primair `Probleem / context` en `Gewenste uitkomst`.
- Agentacties: `Claim als actief` en `Stop agent`.

## Data / IO

- Input: geselecteerde taak, bestaande markdown sections, VS Code workspace settings voor agentdefaults.
- Output: bijgewerkte `active_agent*` frontmattervelden bij claim/clear.
- Opslag/API/service/file-impact: lokale task markdown files via bestaande repository-writer.
- Statussen: bestaande taskstatussen blijven ongewijzigd; `done` cleanup van active-agent metadata blijft bestaan.

## Waarom nu

De task-detail edit is de primaire werkplek in de plugin. De huidige vorm remt dagelijkse taakuitvoering en actieve-agent awareness moet op echte metadata kunnen leunen.

## In scope

- Task-detail edit UI polish.
- Due-date UI verbergen, technische data intact laten.
- Read-only detail preview sections bouwen.
- Agent settings, message bridge, claim en clear flow.
- Gerichte tests en plugin apply.

## Buiten scope

- Nieuwe taskfile schema’s.
- Automatisch claimen bij selecteren of statuswijziging.
- Functionele wijzigingen aan board/list filtering, DnD, sorting of bestaande saveflow.
- Jarvis redesign of nieuwe agent runtime.

## Oorspronkelijk plan / afgesproken scope

Implementeer het plan “Budio Workspace Task Detail Edit Polish + Agent Claiming”: task-detail edit rustiger maken, due-date UI verbergen, structuur en checklist verbeteren, body preview vervangen door taakbeschrijving, en expliciete agent claim/stop metadata toevoegen.

## Expliciete user requirements / detailbehoud

- Due date niet zichtbaar maken in task-detail edit.
- Structuur visueel verbeteren met Epic, Parent task, Type, Blocked en relatieblokken.
- Agent metadata vastleggen bij expliciet uitvoeren/claimen van een taak en zichtbaar houden.
- Checklist checkbox en tekst naast elkaar tonen.
- Body Preview vervangen door leesbare omschrijving met `## Probleem / context` en `## Gewenste uitkomst`.

## Status per requirement

- [x] Due date verbergen — status: gebouwd.
- [x] Structuurkaart verbeteren — status: gebouwd.
- [x] Agent metadata claim/stop flow — status: gebouwd.
- [x] Checklist layout horizontaal maken — status: gebouwd.
- [x] Taakbeschrijving read-only sections tonen — status: gebouwd.

## Toegevoegde verbeteringen tijdens uitvoering

- Relatieblokken vallen op small-width detail terug naar één kolom zodat de detailpane bruikbaar blijft.
- Repositorytest bewijst dat claim/clear metadata echt door de markdown-writer wordt geschreven en gewist.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: plugin types/config/host/data helpers aanpassen.
- [x] Blok 3: webview detail UI en styling aanpassen.
- [x] Blok 4: gerichte tests en plugin apply.
- [x] Blok 5: taskstatus, docs bundle en reconciliation afronden.

## Concrete checklist

- [x] Detail preview sections uit markdown bouwen en testen.
- [x] Agent claim/clear patch helper en host messages toevoegen.
- [x] Due-date UI verwijderen uit detail edit.
- [x] Structuur, checklist en taakbeschrijving visueel verbeteren.
- [x] Workspace settings voor agentdefaults toevoegen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow/docs verify draaien.

## Acceptance criteria

- [x] Board/list detail toont geen due-date input of due-date header chip.
- [x] Structuur en relaties zijn leesbaar, compact en read-only.
- [x] Checklist checkbox en tekst staan horizontaal naast elkaar.
- [x] Taakbeschrijving toont `Probleem / context` en/of `Gewenste uitkomst`, met fallback.
- [x] `Claim als actief` schrijft alle `active_agent*` velden.
- [x] `Stop agent` wist alle `active_agent*` velden.
- [x] Fullscreen detail blijft bruikbaar.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd.
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 58 tests.
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd; VS Code plugin opnieuw gebouwd, geïnstalleerd en gerefresht.
- `npm run taskflow:verify` — geslaagd.
- `npm run lint` — geslaagd.
- `npm run typecheck` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: task-detail edit UI polish en expliciete agent-claim flow.
- Toegevoegde verbeteringen: responsive relatiegrid op smalle detailweergave en repositorybewijs voor claim/clear writerpad.
- Afgerond: due-date UI verborgen, structuurkaart verbeterd, checklistlayout gefixt, taakbeschrijving read-only gemaakt, agentsettings/messages/hostflow toegevoegd, claim/clear metadata getest en plugin toegepast.
- Open / blocked: geen.

## Relevante links

- `tools/budio-workspace-vscode/`


## Commits

- 2026-06-22T14:17:39+02:00 — Fix Budio workspace task detail stability