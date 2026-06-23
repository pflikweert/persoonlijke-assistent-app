---
id: task-budio-workspace-task-detail-blank-screen-en-screenshot-proof-fix
title: Budio Workspace task detail blank screen en screenshot proof fix
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Fix de task-detail blank-screen regressie en maak VS Code plugin screenshots betrouwbaar bewijsbaar.
tags: [plugin, vscode, task-detail, regression, screenshot]
workstream: plugin
epic_id: null
parent_task_id: task-budio-workspace-task-detail-edit-polish-agent-claiming
depends_on: [task-budio-workspace-task-detail-edit-polish-agent-claiming]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 24
---




## Probleem / context

Na de task-detail edit polish kan klikken op een taak in het overzicht de plugin-webview volledig leeg maken. De waarschijnlijke oorzaak is een render-crash door nieuwe detailvelden die niet defensief gelezen worden wanneer VS Code retained webview-state of een oude hydrate-payload gebruikt.

Daarnaast werkte de screenshot-helper technisch, maar accepteerde hij ook een PNG van de verkeerde voorgrond-app. Daardoor is een screenshot pas bewijs als de helper controleert dat VS Code en de Budio Workspace view daadwerkelijk vooraan staan.

## Gewenste uitkomst

Task detail opent weer betrouwbaar vanuit board en list zonder blank screen. Als er toch een renderfout optreedt, toont de webview een compacte recovery-state in plaats van leeg te worden.

De screenshot-helper faalt hard wanneer niet VS Code/Budio Workspace wordt vastgelegd, zodat visueel bewijs niet meer per ongeluk een andere app kan zijn.

## User outcome

De gebruiker kan op taken klikken, detail rechts of fullscreen openen, en erop vertrouwen dat smoke-screenshots de plugin tonen.

## Functional slice

Een smalle runtime-stabiliteitsfix voor de bestaande Budio Workspace plugin: defensieve detailrendering, crash guard en betrouwbare screenshot-proof tooling.

## Entry / exit

- Entry: gebruiker opent board/list en klikt een taak.
- Exit: detailpane opent of toont een herstelbare fout; screenshot-helper schrijft alleen bewijs als VS Code/Budio Workspace vooraan staat.

## Happy flow

1. Board opent en toont taken.
2. Klik op een task opent detail zonder blank screen.
3. Fullscreen detail werkt nog.
4. Screenshot-helper capture met `--expect-title "Budio Workspace"` schrijft een PNG van VS Code of faalt duidelijk.

## Non-happy flows

- Empty state: ontbrekende nieuwe detailvelden renderen als lege arrays/fallback-preview.
- Permission denied / unavailable: screenshot-helper behoudt macOS Screen Recording permissie-uitleg.
- Validation / unsupported state: verkeerde foreground app of venstertitel veroorzaakt een duidelijke helper-fail.
- Failure / retry / cancel: webview renderfout toont recovery-acties voor refresh/reload.

## UX / copy

- Recoverycopy compact en eerlijk: detail kon niet gerenderd worden; bied `Herlaad board`.
- Geen extra permanente UI-copy in normale detailflow.
- Screenshot-helper CLI behoudt bestaande stijl en voegt `--expect-title <text>` toe.

## Data / IO

- Input: bestaande `TaskCardViewModel` payloads, inclusief oudere retained payloads zonder nieuwe velden.
- Output: robuuste webview-rendering en betrouwbare screenshot PNG of expliciete CLI-fout.
- Opslag/API/service/file-impact: geen task schema-wijziging; alleen plugin/webview/tooling.
- Statussen: taskstatussen blijven ongewijzigd.

## Waarom nu

Dit is een directe regressie in de primaire plugin-workflow. Klikken op een taak moet altijd veilig zijn.

## In scope

- Defensieve detail normalizers.
- ErrorBoundary rond board/list/detail webview-shell.
- Screenshot-helper focus/title-validatie en window capture waar mogelijk.
- Tests en plugin apply.

## Buiten scope

- Nieuwe task-detail features.
- Redesign van board/list/Jarvis.
- Automatische click-smoke via UI automation als dat buiten de bestaande lokale tooling valt.

## Oorspronkelijk plan / afgesproken scope

Fix Plan: Task Detail Blank Screen + Reliable VS Code Plugin Screenshot Proof. Stabiliseer detail rendering, voeg crash guard toe, harden screenshot-helper zodat verkeerde app-captures niet als bewijs tellen, en verifieer met plugin checks + smoke.

## Expliciete user requirements / detailbehoud

- Task detail mag na klikken op een taak geen leeg scherm meer geven.
- De vorige task-detail polish en agent claiming blijven behouden.
- Screenshot-helper moet betrouwbaar bewijs leveren of duidelijk falen.
- Plugin opnieuw toepassen en VS Code refreshen na wijziging.

## Status per requirement

- [x] Blank-screen regressie oplossen — status: gebouwd.
- [x] Defensieve detailrendering toevoegen — status: gebouwd.
- [x] Webview crash guard toevoegen — status: gebouwd.
- [x] Screenshot-helper betrouwbaar maken — status: gebouwd.
- [x] Plugin apply + bewijs draaien — status: gebouwd.

## Toegevoegde verbeteringen tijdens uitvoering

- Safe normalizers zijn als geteste helper toegevoegd zodat retained webview-payloads zonder nieuwe velden niet meer kunnen crashen.
- Screenshot-helper controleert nu ook zichtbare VS Code UI-namen wanneer `--expect-title` niet in de macOS venstertitel staat.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en regressiehypothese bevestigen.
- [x] Blok 2: webview runtime guard en safe normalizers implementeren.
- [x] Blok 3: screenshot-helper hardening implementeren.
- [x] Blok 4: gerichte tests, plugin apply en smokebewijs.
- [x] Blok 5: task/docs reconciliation en verify afronden.

## Concrete checklist

- [x] Safe detail helper toevoegen en gebruiken.
- [x] ErrorBoundary toevoegen rond plugin shell.
- [x] Screenshot-helper `--expect-title` en frontmost-app check toevoegen.
- [x] Tests toevoegen/aanpassen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Runtime/screenshot smoke uitvoeren.
- [x] Taskflow/docs verify draaien.

## Acceptance criteria

- [x] Board/list task click veroorzaakt geen blank webview.
- [x] Ontbrekende `detailPreviewSections` crasht niet.
- [x] Detail fullscreen blijft werken.
- [x] Screenshot-helper accepteert geen capture van verkeerde app.
- [x] Plugin is opnieuw toegepast op VS Code workspace.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd.
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 61 tests.
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd; plugin opnieuw gebouwd, geïnstalleerd en VS Code gerefresht.
- `node scripts/capture-vscode-screenshot.mjs --unknown-option` — faalt correct op onbekende optie.
- `node scripts/capture-vscode-screenshot.mjs --expect-title` — faalt correct op ontbrekende waarde.
- `node scripts/capture-vscode-screenshot.mjs --expect-title definitely-not-present --out /tmp/budio-should-not-write.png` — faalt correct met `wrong_window`.
- `node scripts/capture-vscode-screenshot.mjs --expect-title 'Budio Workspace' --out /tmp/budio-workspace-proof.png` — geslaagd; foreground `Code — Budio Workspace: Board — persoonlijke-assistent-app`.
- Task-click smoke screenshot: `/tmp/budio-task-click-proof.png` — toont Budio Workspace board met geopende task-detail pane, geen blank screen.
- `npm run taskflow:verify` — geslaagd.
- `npm run lint` — geslaagd.
- `npm run typecheck` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: blank-screen regressie en screenshot-proof fix.
- Toegevoegde verbeteringen: geteste safe detail helper en UI-name fallback voor `--expect-title`.
- Afgerond: detailrendering is defensief, webview heeft een recovery boundary, screenshot-helper verifieert VS Code/context, plugin is toegepast en task-click smoke toont detail zonder blank screen.
- Open / blocked: geen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-task-detail-edit-polish-agent-claiming.md`
- `tools/budio-workspace-vscode/`
- `scripts/capture-vscode-screenshot.mjs`


## Commits

- 2026-06-22T14:17:39+02:00 — Fix Budio workspace task detail stability

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state