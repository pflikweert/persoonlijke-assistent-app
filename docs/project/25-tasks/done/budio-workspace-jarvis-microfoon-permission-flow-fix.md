---
id: task-budio-workspace-jarvis-microfoon-permission-flow-fix
title: Budio Workspace Jarvis microfoon permission flow fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Maak Jarvis mic-permission praktisch werkend met echte webview diagnostics, permission request/test en een actie om macOS microfooninstellingen te openen."
tags: [plugin, vscode, jarvis, voice, microphone, permissions]
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


# Budio Workspace Jarvis microfoon permission flow fix

## Probleem / context

Jarvis voice zegt dat VS Code/macOS microfoonrechten nodig zijn, maar de plugin helpt de gebruiker nog onvoldoende om te zien wat er echt misgaat of om het recht praktisch te herstellen. De mic-flow moet niet alleen uitleg geven, maar ook daadwerkelijk een permission request/test starten en een directe actie bieden om systeeminstellingen te openen.

## Gewenste uitkomst

Jarvis toont een echte mic-status op basis van webview capabilities en permission state. De mic-knop vraagt daadwerkelijk `getUserMedia` aan bij user-actie. Bij denied/unavailable krijgt de gebruiker een concrete reden en een actie om macOS microfooninstellingen te openen.

## User outcome

De gebruiker kan in Jarvis duidelijk zien of microfoonopname ondersteund is, of permission geweigerd is, en wat de volgende stap is. Als rechten goed staan, start push-to-talk opname echt.

## Functional slice

- Webview-side mic diagnostics.
- Permission request/test via user gesture.
- Host bridge om OS microfooninstellingen te openen.
- Betere copy en UI-actions voor voice unavailable/permission needed.

## Entry / exit

- Entry: gebruiker opent Jarvis en gebruikt de mic-knop.
- Exit: opname start echt, of Jarvis toont een concrete diagnose en herstelactie.

## Happy flow

1. Jarvis detecteert `navigator.mediaDevices.getUserMedia` en `MediaRecorder`.
2. Gebruiker klikt `Mic`.
3. VS Code/macOS vraagt toestemming of bestaande toestemming wordt gebruikt.
4. Jarvis toont `Opnemen`, daarna `Transcriberen`.

## Non-happy flows

- Permission denied: toon `Microfoonrechten geweigerd` en knop om microfooninstellingen te openen.
- Unsupported webview: toon welke capability ontbreekt.
- Geen microfoon: toon `Geen microfoon gevonden`.
- Lege/te korte opname: toon echte retry-copy.

## UX / copy

- Geen vage “VS Code vraagt soms” uitleg meer als primaire oplossing.
- Toon compacte echte states: `Mic klaar`, `Opnemen`, `Transcriptie`, `Rechten nodig`, `Niet ondersteund`.
- Herstelactie: `Open microfooninstellingen`.

## Data / IO

- Input: browser/webview capabilities, Permissions API indien beschikbaar, getUserMedia errors.
- Output: `jarvisVoiceStateChanged`, voice reason, optional host action om OS settings te openen.
- Opslag/API/service/file-impact: geen secret of providerwijziging.
- Statussen: bestaande `voiceState` blijft leidend.

## Waarom nu

De huidige mic-permission uitleg lost het probleem voor de gebruiker niet op. Jarvis moet zelf diagnose en herstelpad aanbieden.

## In scope

- `useJarvisVoiceInput` diagnostics en permission request verbeteren.
- `JarvisView` voice-state UI/action toevoegen.
- Webview/host message toevoegen voor openen microfooninstellingen.
- Tests/typecheck/apply.

## Buiten scope

- TTS.
- Alternatieve native audio recorder buiten VS Code webview.
- Nieuwe OpenAI transcription pipeline.

## Oorspronkelijk plan / afgesproken scope

- Los op dat VS Code/microfooninstellingen niet praktisch werken voor Jarvis.
- Zorg dat de plugin correct microfoontoegang vraagt en geen vage instructietekst blijft tonen.

## Expliciete user requirements / detailbehoud

- “Dit werkt nog niet” rond VS Code instellingen en microfoontoegang.
- Jarvis moet echt mic-toegang vragen wanneer audio-opnames gebruikt worden.

## Status per requirement

- [x] Echte mic diagnostics — status: gebouwd
- [x] Permission request/test via Jarvis micactie — status: gebouwd
- [x] Herstelactie voor OS microfooninstellingen — status: gebouwd
- [x] Plugin apply en verify — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De voice hook gebruikt nu stabiele refs voor callbacks zodat support/permission-state niet onnodig opnieuw hydrateert.
- Jarvis krijgt een concrete `Open microfooninstellingen` actie bij permission-problemen.
- Unsupported states krijgen een concrete capability reason in plaats van generieke VS Code-uitleg.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, huidige mic-flow en taskflow bevestigen.
- [x] Blok 2: mic diagnostics/action bridge bouwen.
- [x] Blok 3: verify, plugin apply en task afronden.

## Concrete checklist

- [x] Mic supportdiagnose expliciet maken.
- [x] Permission-state/reason verbeteren.
- [x] Host message voor microfooninstellingen toevoegen.
- [x] Jarvis UI herstelactie toevoegen.
- [x] Plugin typecheck/test/apply draaien.

## Acceptance criteria

- [x] Klik op mic vraagt echt microfoontoegang via `getUserMedia` wanneer supported.
- [x] Permission denied toont concrete diagnose en herstelactie.
- [x] Unsupported toont concrete ontbrekende capability.
- [x] Typed chat blijft onaangeraakt.

## Blockers / afhankelijkheden

- Fysieke macOS/VS Code toestemming blijft buiten code, maar Jarvis moet die eerlijk detecteren en herstelactie bieden.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 49 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: mic permission-flow praktisch werkend maken.
- Toegevoegde verbeteringen: stabiele voice hook callbacks, concrete supportdiagnose en OS-settings action.
- Afgerond: Jarvis mic-knop vraagt bij support echt `getUserMedia`, denied/unavailable states tonen concrete reden, en de host kan macOS/Windows microfooninstellingen openen.
- Open / blocked: fysieke toestemming blijft afhankelijk van jouw lokale VS Code/macOS permissie; de plugin biedt nu het herstelpad en retry.

## Relevante links

- `tools/budio-workspace-vscode/webview-ui/src/useJarvisVoiceInput.ts`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/src/extension/host/BoardPanelController.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room