---
id: task-budio-workspace-jarvis-mic-settings-runtime-test-fix
title: Budio Workspace Jarvis mic settings en runtime test fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: Fix dat de Jarvis knop microfooninstellingen niets doet en maak mic-runtime diagnose/feedback testbaar zichtbaar in de plugin.
tags: [plugin, vscode, jarvis, voice, microphone, macos]
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


# Budio Workspace Jarvis mic settings en runtime test fix

## Probleem / context

De Jarvis knop `Open microfooninstellingen` doet zichtbaar niets. De gebruiker geeft aan dat VS Code al microfoonrechten heeft op macOS, dus de flow moet niet blijven hangen op generieke rechtenuitleg. Jarvis moet zelf duidelijk maken of de webview audio-capabilities beschikbaar zijn, of de settings actie echt is gestart, en wat er misgaat als opname alsnog faalt.

## Gewenste uitkomst

De knop opent betrouwbaar macOS microfooninstellingen of toont een expliciete foutmelding. Jarvis toont daarnaast concrete runtime-diagnose rond `getUserMedia`, `MediaRecorder`, permission-state en opname/transcriptie, zodat we niet blind blijven bij “werkt niet”.

## User outcome

De gebruiker kan de mic-flow in Jarvis testen en krijgt direct zichtbaar bewijs: settings geopend, mic ready/opnemen/transcriberen, of een exacte webview/recorder fout.

## Functional slice

- Betrouwbare hostactie voor macOS microfooninstellingen met fallback naar `open`.
- Webview-feedbackevent voor settingsactie success/failure.
- Meer concrete mic runtime diagnose in Jarvis UI.
- Plugin opnieuw toepassen en gericht testen.

## Entry / exit

- Entry: gebruiker klikt in Jarvis op mic of `Open microfooninstellingen`.
- Exit: settingsactie geeft zichtbare feedback en mic-flow toont echte runtime-state.

## Happy flow

1. Klik op `Open microfooninstellingen`.
2. Host opent macOS privacy/microfooninstellingen via betrouwbare route.
3. Webview toont dat de actie is gestart.
4. Klik op `Mic` start `getUserMedia` en opname wanneer webview dit toestaat.

## Non-happy flows

- Settings route faalt: Jarvis toont fout met fallback-instructie.
- Webview mist `getUserMedia`: Jarvis toont capability ontbreekt.
- Webview mist `MediaRecorder`: Jarvis toont opname niet ondersteund.
- Recorder/getUserMedia faalt ondanks OS-rechten: Jarvis toont exacte foutcategorie.

## UX / copy

- Geen vage “VS Code vraagt soms” copy als primaire oplossing.
- Compacte notices: `Microfooninstellingen geopend`, `Mic ready`, `Opnemen`, `Recorder niet beschikbaar`, `Webview blokkeert microfoon`.

## Data / IO

- Input: webview mic capabilities/errors, host OS platform.
- Output: host→webview mic-settings result event, voice reason copy.
- Opslag/API/service/file-impact: geen providerwijziging.

## Waarom nu

De vorige permission-flow is nog niet praktisch werkend: de settingsknop doet niets zichtbaar en de gebruiker heeft VS Code al rechten gegeven.

## In scope

- Host settings open fallback fix.
- Webview message/result feedback.
- Mic diagnostic copy/state verbeteren.
- Tests/typecheck/apply.

## Buiten scope

- Native audio recorder buiten VS Code webview.
- Nieuwe transcriptieprovider.
- Board/list/epics/settings functioneel wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Los op dat `microfooninstellingen` niets doet.
- Review en test de mic-flow zelf tot de route aantoonbaar werkt of exact meldt waarom de VS Code webview audio blokkeert.

## Expliciete user requirements / detailbehoud

- De knop `microfooninstellingen` doet nu niets.
- VS Code heeft al mic-toegangsrechten op de Mac.
- Review en test zelf totdat het werkt.

## Status per requirement

- [x] Settingsknop heeft betrouwbare macOS fallback — status: gebouwd
- [x] Settingsactie geeft zichtbare feedback — status: gebouwd
- [x] Mic runtime diagnose is concreet — status: gebouwd
- [x] Plugin apply en verify — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De macOS deep link is lokaal getest met `open` en opent System Settings.
- De extension host gebruikt nu naast `vscode.env.openExternal` ook een systeemfallback via `open`.
- De webview krijgt nu een `jarvisMicrophoneSettingsResult` event terug, zodat de knop niet meer stil kan falen.
- Jarvis toont nu een aparte mic-statuschip zoals `Mic klaar`, `Mic rechten nodig`, `Mic neemt op` of `Mic niet ondersteund`.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en huidige mic/settings flow lezen.
- [x] Blok 2: host fallback + feedbackevent + UI diagnose bouwen.
- [x] Blok 3: testen, plugin apply en task afronden.

## Concrete checklist

- [x] macOS settings URI/`open` route testen.
- [x] Hostactie fallback implementeren.
- [x] Host→webview result event toevoegen.
- [x] Jarvis UI feedback tonen.
- [x] Plugin typecheck/test/apply draaien.

## Acceptance criteria

- [x] Klik op settingsknop leidt tot zichtbare hostactie-feedback.
- [x] macOS settings worden via fallback geopend als VS Code `openExternal` niets doet.
- [x] Mic-flow toont concrete capability/error-state.
- [x] Typed chat blijft onaangeraakt.

## Blockers / afhankelijkheden

- Fysieke VS Code webview mic-permission blijft alleen volledig interactief in VS Code te bevestigen; deze task moet wel alle diagnose en herstelpaden zichtbaar maken.

## Verify / bewijs

- Shell smoke: `open 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone'` — opent `System Settings`
- Built helper smoke: `openMicrophoneSettingsWithSystemOpen(..., 'darwin')` — opent `System Settings`
- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: settingsknop en mic runtime echt werkend/diagnostisch maken.
- Toegevoegde verbeteringen: host fallback helper, webview result event en mic-statuschip toegevoegd.
- Afgerond: de settingsknop heeft een bewezen werkende macOS route en stuurt resultaat terug naar Jarvis; mic runtime toont concrete states.
- Open / blocked: de daadwerkelijke `getUserMedia` prompt/opname blijft interactief in VS Code zelf, maar de herstelknop en settingsroute zijn lokaal bewezen en de plugin is opnieuw geïnstalleerd.

## Relevante links

- `tools/budio-workspace-vscode/src/extension/host/BoardPanelController.ts`
- `tools/budio-workspace-vscode/src/webview-bridge/messages.ts`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/useJarvisVoiceInput.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room