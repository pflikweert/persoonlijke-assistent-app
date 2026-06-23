---
id: task-budio-workspace-jarvis-responsive-cinematic-polish
title: Budio Workspace Jarvis responsive cinematic polish
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Maak de Jarvis-view responsief op verschillende pluginbreedtes, verwijder de bovenste Budio/status-overhead en geef de center core cinematic, state-reactieve beweging."
tags: [plugin, vscode, jarvis, ui, responsive, polish]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 21
---




# Budio Workspace Jarvis responsive cinematic polish

## Probleem / context

De Jarvis-view werkt als eigen command room, maar de huidige bovenste Budio/statusrij voelt als overhead en kost verticale ruimte. Op smallere pluginformaten moet de kamer compacter en beter passend worden. Het middenstuk mag bovendien sterker als levende cinematic core reageren op opnemen, transcriberen en beantwoorden.

## Gewenste uitkomst

Jarvis past beter op smalle, middelgrote en brede VS Code webview-formaten. De bovenste Budio/status-overhead is weg uit de Jarvis-kamer zelf. De center core blijft centraal en beweegt filmisch en state-reactief zonder de chatflow te verstoren.

## User outcome

De gebruiker opent Jarvis en ziet direct de command room zonder overbodige topcopy. De view voelt ruimtelijk, passend en actief op verschillende schermgroottes.

## Functional slice

- Jarvis-only layout polish.
- Topbar-overhead verwijderen.
- Responsive grid/rails/command deck aanscherpen.
- Cinematic state-reactieve center core animatie toevoegen.

## Entry / exit

- Entry: gebruiker opent `Jarvis` in de Budio Workspace plugin.
- Exit: Jarvis toont een compacte responsive command room met bewegende/reactieve core.

## Happy flow

1. Jarvis opent zonder extra Budio/statuskop.
2. Op breed scherm staan rails, core en gesprek gebalanceerd.
3. Op smaller scherm stapelen rails en gesprek zonder horizontale overflow.
4. Bij opnemen/transcriberen/beantwoorden reageert de core visueel.

## Non-happy flows

- Empty state: command room blijft compact zonder lege bovenbalk.
- Permission denied / unavailable: bestaande mic/chat notices blijven zichtbaar in command deck.
- Validation / unsupported state: bestaande inputstates blijven intact.
- Failure / retry / cancel: reload/reset blijven subtiel beschikbaar.

## UX / copy

- Verwijder zichtbare Jarvis-topbar met Budio wordmark, status pill en ready/status-copy.
- Behoud noodzakelijke acties `Reset` en `Herlaad`, maar subtiel in de speaking surface.
- Gebruik bestaande minimal cinematic copy; voeg geen nieuwe debugcopy toe.

## Data / IO

- Input: bestaande Jarvis workspace state en conversation state.
- Output: alleen render/CSS gedrag.
- Opslag/API/service/file-impact: geen provider- of taskmutatieflow.
- Statussen: bestaande `jarvis-chat-*` en `jarvis-voice-*` classes sturen core motion.

## Waarom nu

De gebruiker heeft runtime werkend gekregen en vraagt nu expliciet om passende schermweergave, minder overhead en een levendiger cinematic middenstuk.

## In scope

- `JarvisView` JSX aanpassen voor minder top-overhead.
- `styles.css` Jarvis responsive layout en animaties aanscherpen.
- Gerichte plugin verify en `apply:workspace`.

## Buiten scope

- Nieuwe Jarvis features, tools of taskacties.
- Chat/provider/mic pipeline wijzigen.
- Board/list/epics/settings functioneel aanpassen.

## Oorspronkelijk plan / afgesproken scope

- Maak Jarvis responsive en passend op alle schermgroottes.
- Haal bovenstuk met Budio/ready/status-overhead weg.
- Review de schermopbouw en verbeter de Jarvis midden-core.
- Laat het middenstuk cinematic bewegen en reageren.

## Expliciete user requirements / detailbehoud

- Jarvis moet responsive zijn.
- Jarvis moet passen op alle schermgroottes.
- Bovenstuk met Budio/ready/status is overhead en mag weg.
- Middenstuk moet cinematic bewegen en reageren.

## Status per requirement

- [x] Responsive Jarvis layout — status: gebouwd
- [x] Topbar-overhead verwijderd — status: gebouwd
- [x] Cinematic/reactieve center core — status: gebouwd
- [x] Bestaande chat/mic functionaliteit intact — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Reset en Herlaad zijn verplaatst naar compacte speaking-surface actions zodat de bovenste Jarvis-overhead kan verdwijnen zonder functionaliteit kwijt te raken.
- Core motion respecteert `prefers-reduced-motion`.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en actuele Jarvis UI/CSS lezen.
- [x] Blok 2: Jarvis JSX en responsive/motion CSS aanpassen.
- [x] Blok 3: plugin verify, apply en task/docs afronden.

## Concrete checklist

- [x] Topbar JSX verwijderen of verplaatsen naar subtiele controls.
- [x] Responsive grid en rail stacking verbeteren.
- [x] Center core motion state-reactief maken.
- [x] Typecheck/test/apply draaien.
- [x] Taskflow/docs afronden.

## Acceptance criteria

- [x] Jarvis heeft geen losse Budio/ready/status topbar meer.
- [x] Jarvis blijft bruikbaar op smalle en brede pluginbreedtes zonder horizontale overflow.
- [x] Core beweegt ambient en reageert zichtbaar op chat/voice states.
- [x] Chat, mic, reset en reload blijven bereikbaar.

## Blockers / afhankelijkheden

- Geen actieve blockers.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 43 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd vóór afronding
- Docs bundle/verify bij taskstatus afronding — uitgevoerd na verplaatsing naar `done/`

## Reconciliation voor afronding

- Oorspronkelijk plan: responsive Jarvis polish, topbar-overhead weg, cinematic/reactieve core.
- Toegevoegde verbeteringen: reset/herlaad verplaatst naar speaking surface en motion respecteert reduced-motion.
- Afgerond: Jarvis-topbar verwijderd, responsive grid/breakpoints aangescherpt, core dials/scanline/orbits/float toegevoegd en state-reactief gemaakt voor chat/voice.
- Open / blocked: geen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-runtime-fix-chat-mic-end-to-end.md`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state