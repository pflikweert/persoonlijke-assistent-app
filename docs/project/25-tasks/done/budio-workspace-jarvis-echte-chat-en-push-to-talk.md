---
id: task-budio-workspace-jarvis-echte-chat-push-to-talk
title: Budio Workspace Jarvis echte chat en push-to-talk
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "Vervang de huidige Jarvis proto-interactie in de VS Code plugin door echte host-side OpenAI chat, echte env-resolutie uit .env.local en een push-to-talk audioflow met transcriptie, zonder functionele regressie in board/list/epics/settings."
tags: [plugin, vscode, jarvis, openai, audio, chat]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 13
---




# Budio Workspace Jarvis echte chat en push-to-talk

## Probleem / context

De huidige Jarvis-view heeft al een eerste praatlaag, maar vertrouwt nog op een fragiele combinatie van `process.env`-availability, browser speech-recognition en proto/meta UI-copy. Daardoor ontstaan precies de verkeerde signalen: chat lijkt niet echt gekoppeld aan de lokale keyroute, microfoonstates voelen nep of te fragiel voor een VS Code-webview, en labels zoals `Praat met Jarvis`, `Live gesprekssessie`, `Jij` en `workspace` breken de cinematic command-room ervaring.

## Gewenste uitkomst

De Jarvis-view in de bestaande plugin werkt volledig echt: host-side OpenAI chat gebruikt een expliciete en veilige lokale env-resolutie, typed prompts geven echte modelresponses, en voice gebruikt push-to-talk met echte audio-opname en transcriptie.

De UI voelt minder prototype-achtig en toont alleen echte, functionele states. Wanneer chat of voice niet beschikbaar is, ziet de gebruiker een eerlijke oorzaak met een duidelijke vervolgstap in plaats van een nep fallback-copy.

## User outcome

De gebruiker kan in de Jarvis-view echt met Jarvis praten via typen of push-to-talk, zolang er lokaal een geldige key en microfoonrechten beschikbaar zijn. Als iets ontbreekt, ziet de gebruiker een echte availability- of permission-state die klopt met de runtime.

## Functional slice

Eén afgeronde plugin-slice:
- veilige `.env.local` + env-resolutie voor Jarvis keys/modellen,
- echte host-side OpenAI chatflow,
- echte push-to-talk audio-opname + transcriptie,
- opgeschoonde cinematic Jarvis UI zonder proto/meta labels,
- geen functionele wijzigingen aan board/list/epics/settings.

## Entry / exit

- Entry: gebruiker opent de Budio Workspace plugin en kiest `Jarvis`.
- Exit: gebruiker stuurt een typed of voice prompt, Jarvis antwoordt echt, of de UI toont een echte reasoned unavailable/permission-state.

## Happy flow

1. Gebruiker opent `Jarvis`; de host resolveert lokaal de juiste chat- en transcriptiekeys uit `.env.local` of shell env.
2. Gebruiker typt een prompt of neemt audio op via push-to-talk; audio wordt echt opgenomen, getranscribeerd en ingestuurd.
3. Jarvis antwoordt met een echte OpenAI-response, grounded in lokale workspacecontext.

## Non-happy flows

- Empty state: zonder lopende conversatie toont de speaking surface een rustige starter-state zonder proto-labels.
- Permission denied / unavailable: microfoonrechten geweigerd of media APIs ontbreken; de UI toont een echte permission/unavailable state met retry of tekstfallback.
- Validation / unsupported state: lege prompt of lege audio-opname wordt niet ingestuurd.
- Failure / retry / cancel: ontbrekende key, transcriptiefout of providerfout geeft een echte foutmelding met mogelijkheid tot opnieuw proberen.

## UX / copy

- Jarvis copy blijft Nederlands en minimal cinematic.
- Verwijder of vervang proto/meta labels zoals:
  - `Praat met Jarvis`
  - `Live gesprekssessie`
  - `Jij`
  - `workspace`
- Reset/new session mag blijven maar subtieler.
- Command deck toont alleen echte states zoals:
  - `Klaar`
  - `Opnemen`
  - `Verwerken`
  - `Antwoord klaar`
  - `Microfoonrechten nodig`
  - `Chat niet beschikbaar`
  - `Providerfout`

## Data / IO

- Input:
  - `.env.local` plus process env
  - board snapshot
  - geselecteerde taskcontext
  - Jarvis manifest/command-room content
  - lokale text asset previews
  - typed prompt of opgenomen audio
- Output:
  - echte chatresponse
  - transcriptie van audio naar tekst
  - conversation state
  - capability/permission/error state
- Opslag/API/service/file-impact:
  - host-side OpenAI calls naar chat completions en audio transcriptions
  - geen secrets naar webview
  - geen persistente opslag van audio of chat naar repo-bestanden
- Statussen:
  - chat: `idle`, `thinking`, `answering`, `error`
  - voice: `idle`, `recording`, `transcribing`, `permission_needed`, `unavailable`

## Waarom nu

- De huidige Jarvis-view oogt al sterker, maar de user wil expliciet dat niets meer nep voelt.
- De technische gaten zijn concreet: env-resolutie en speech-aanpak moeten nu echt gemaakt worden om de command room bruikbaar te maken.
- Dit is de kleinste volgende slice die direct de grootste geloofwaardigheids- en bruikbaarheidswinst geeft.

## In scope

- Nieuwe plugin-taak voor deze V1.2-slice.
- `.env.local`-aware env-resolutie voor Jarvis chat/transcriptie.
- Push-to-talk met `getUserMedia` + `MediaRecorder`.
- Host-side audio transcription + gedeelde chatpipeline.
- Opschonen van Jarvis UI-copy en echte availability states.
- Gerichte tests en plugin apply/verify.

## Buiten scope

- Tool-calling, taskmutaties of repo-acties vanuit Jarvis.
- TTS / audio output.
- Persistente conversatiehistorie op disk.
- Nieuwe functies in board/list/epics/settings.
- Nieuwe Luma-ingest-architectuur.

## Oorspronkelijk plan / afgesproken scope

- Echte key- en env-resolutie vanuit `.env.local`.
- Browser speech-recognition vervangen door push-to-talk + transcriptie.
- Eén echte typed + voice Jarvis pipeline.
- Minimal cinematic UI zonder nep/meta labels.
- Geen functionele regressie in bestaande pluginviews.

## Expliciete user requirements / detailbehoud

- Alles moet echt werken; niets nep in de interface.
- Los de melding op dat de chat key ontbreekt.
- Los de melding op dat microfoontoegang is geweigerd.
- Verwijder of vervang zichtbare proto/meta UI-labels zoals `Praat met Jarvis`, `Live gesprekssessie`, `Nieuwe sessie`, `Jij`, `workspace`.
- Board/list/epics/settings moeten functioneel intact blijven.

## Status per requirement

- [x] Echte keyroute voor Jarvis chat — status: gebouwd
- [x] Echte push-to-talk met transcriptie — status: gebouwd
- [x] Proto/meta labels uit Jarvis UI verwijderd of vervangen — status: gebouwd
- [x] Echte permission/error states voor mic en chat — status: gebouwd
- [x] Geen functionele regressie in andere views — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Workspace-aware `.env.local` resolutie toegevoegd met expliciete key-precedence voor Jarvis.
- Browser speech-recognition volledig vervangen door `getUserMedia` + `MediaRecorder` + host-side transcriptie.
- Jarvis UI opgeschoond naar compactere cinematic states zonder prototypekopjes of nep fallback-copy.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, context en taskflow vastleggen.
- [x] Blok 2: env/chat/transcription helpers bouwen.
- [x] Blok 3: host/webview/audioflow en UI-copy aanscherpen.
- [x] Blok 4: tests, plugin apply, verify en task/docs closeout.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt en op `in_progress` gezet.
- [x] Jarvis env-resolutie helper toegevoegd.
- [x] Audio transcription helper toegevoegd.
- [x] Conversation state uitgebreid voor echte chat- en voice-statussen.
- [x] Webview push-to-talk flow gebouwd.
- [x] Jarvis UI-copy opgeschoond.
- [x] Tests en verify gedraaid.

## Acceptance criteria

- [x] Jarvis chat werkt met een echte lokaal geresolveerde keyroute zonder valse missing-key state.
- [x] Push-to-talk neemt echt audio op en gebruikt transcriptie voor Jarvis chat.
- [x] Bij ontbrekende micrechten of ontbrekende media support toont Jarvis een echte, compacte reden.
- [x] De zichtbare Jarvis UI bevat geen prototype/meta labels meer die nep aanvoelen.
- [x] Board/list/epics/settings blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Geen actieve blockers.
- Live voice happy path blijft afhankelijk van beschikbare OS/VS Code microfoonrechten.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck`
- `npm --prefix tools/budio-workspace-vscode run test`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: echte chat + push-to-talk maken en nep UI-states verwijderen.
- Toegevoegde verbeteringen: workspace-aware env helper, echte transcriptieroute en compactere cinematic Jarvis copy.
- Afgerond: Jarvis gebruikt nu echte key-resolutie, echte host-side OpenAI chat, echte push-to-talk transcriptie, en toont alleen nog echte availability/permissiestates.
- Open / blocked: geen blocker in deze slice; TTS, tool-calling of persistente chatgeschiedenis blijven bewust buiten scope voor vervolgwerk.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-praatbare-eigen-view.md`
- `tools/budio-workspace-vscode/README.md`
- `assets/jarvis/final-frame/unified-design-brief.txt`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state