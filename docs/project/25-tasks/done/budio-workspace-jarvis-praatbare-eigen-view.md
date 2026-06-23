---
id: task-budio-workspace-jarvis-praatbare-eigen-view
title: Budio Workspace Jarvis praatbare eigen view
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "De bestaande Budio Workspace-plugin krijgt een aparte Jarvis-view die visueel sterker aansluit op het supplied command-room frame en een eerste werkende praatlaag toevoegt via typed chat plus lichte voice input, zonder de functionaliteit van board/list/epics/settings te veranderen."
tags: [plugin, vscode, jarvis, voice, chat]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 20
---




# Budio Workspace Jarvis praatbare eigen view

## Probleem / context

De plugin heeft al een eerste Jarvis command-room view met lokale Luma-assets en manifestgedreven rendering, maar die view is nog vooral een statisch visualisatieframe. De user wil nu een minimale maar echt bruikbare vervolgvariant: een eigen Jarvis-kamer waarin je kunt praten met Jarvis en die visueel sterker overeenkomt met het aangeleverde frame, zonder dat bestaande pluginviews functioneel worden verbouwd.

## Gewenste uitkomst

Binnen de bestaande VS Code workspace-plugin staat een zelfstandige `jarvis`-view die als eigen command room voelt. De view gebruikt de reeds aanwezige lokale assets en manifesten, toont een sterkere visuele compositie en bevat een werkende conversation flow.

De gebruiker kan in deze eerste versie tekst typen naar Jarvis en, waar de webview/runtime het toelaat, voice input gebruiken als lichte enhancement. Jarvis antwoordt host-side met lokale workspacecontext als primaire bron en kan daarna uitwijken naar algemenere assistentie.

## User outcome

De gebruiker kan de plugin openen, naar de `jarvis`-view gaan en daar in een aparte command room vragen stellen aan Jarvis, met duidelijke antwoordstates en een UI die dichter bij het supplied conceptframe ligt. Board, list, epics en settings blijven werken zoals ze nu werken.

## Functional slice

Eén afgeronde plugin-slice:
- een aparte Jarvis top-level view met eigen visual polish,
- typed chat en lichte voice input,
- host-side assistant bridge met workspace-grounding,
- nette availability/error/fallback states,
- zonder functionele aanpassingen aan de andere pluginviews.

## Entry / exit

- Entry: gebruiker opent de Budio Workspace plugin en kiest de `Jarvis`-view.
- Exit: gebruiker heeft een werkende Jarvis command room waarin een vraag gesteld en beantwoord kan worden, of ziet een duidelijke fallback-state wanneer key/voice/provider ontbreekt.

## Happy flow

1. Gebruiker opent `Jarvis` in de plugin en ziet de command room met lokale assets en polished layout.
2. Gebruiker typt een vraag of start voice input; de vraag verschijnt in de conversatie.
3. Jarvis antwoordt vanuit lokale workspacecontext en vult waar nodig aan met een algemene assistentreactie.

## Non-happy flows

- Empty state: als nog geen conversatie is gestart, toont de speaking surface een nette starter-state met seed-copy.
- Permission denied / unavailable: als voice niet beschikbaar is of mic-permissie ontbreekt, blijft typed chat bruikbaar en toont de UI een compacte notice.
- Validation / unsupported state: lege input wordt niet verstuurd en toon geen fouttoast; de send-actie blijft disabled.
- Failure / retry / cancel: ontbrekende OpenAI-key of providerfout levert een nette conversational errorstate op met mogelijkheid om opnieuw te proberen.

## UX / copy

- Bestaande views behouden hun huidige copy en gedrag.
- Jarvis gebruikt Nederlandse copy.
- Belangrijke labels:
  - `Sync assets`
  - `Praat met Jarvis`
  - `Typ je vraag...`
  - `Luisteren...`
  - `Denkt na...`
  - `Opnieuw`
  - `Nieuwe sessie`
- Jarvis visual direction volgt de bestaande `assets/jarvis/final-frame/unified-design-brief.txt` en de lokale manifest-assets.

## Data / IO

- Input:
  - board snapshot
  - geselecteerde taskcontext
  - Jarvis manifest/command-room content
  - lokale text-asset previews
  - user prompt of voice transcript
- Output:
  - conversation state naar webview
  - assistant response
  - capability/error/fallback state
- Opslag/API/service/file-impact:
  - host-side OpenAI API-call
  - geen repo-persistente chatopslag
  - bestaande lokale Jarvis-assets blijven bron voor visuals
- Statussen:
  - `idle`
  - `listening`
  - `thinking`
  - `answering`
  - `error`

## Waarom nu

- De huidige Jarvis-baseline is visueel bruikbaar maar nog niet interactief.
- Dit is de kleinste volgende slice die direct founderwaarde geeft zonder bredere pluginarchitectuur om te gooien.
- De user wil juist een eerste variant die werkt en visueel geloofwaardig aanvoelt zoals aangeleverd.

## In scope

- Nieuwe uitvoertaak voor deze vervolgscope.
- Behoud van bestaande views zonder functionele wijziging.
- Jarvis-view uitbreiden met conversation UI en lichte voice input.
- Host-side OpenAI bridge met workspace-grounding en nette fallback states.
- Visuele polish vooral in de Jarvis-view, plus alleen minimale shell-polish elders indien nodig.
- Gerichte tests voor message mapping, grounding en fallback states.

## Buiten scope

- Nieuwe task- of boardfunctionaliteit buiten Jarvis.
- Tool-calling, codeacties, taskmutaties of autonome agentruns vanuit chat.
- Persistente conversatie-opslag op disk.
- TTS of uitgebreide audio-device workflows.
- Nieuwe asset-ingestarchitectuur of bredere Luma-canvas-sync.

## Oorspronkelijk plan / afgesproken scope

- Bestaande plugin-views behouden, alleen polish waar nodig.
- Alle nieuwe Jarvis-functionaliteit in een eigen top-level `jarvis`-view.
- Typed chat + lichte voice input.
- Host-side assistant bridge met workspace-first, hybrid answers.
- Visuele upgrade primair in de Jarvis-view.

## Expliciete user requirements / detailbehoud

- Bestaande views moeten behouden blijven.
- Board/list/epics/settings mogen geen functionele regressie of verbouwing krijgen.
- Jarvis moet een eigen view zijn met alle nieuwe functies daarbinnen.
- De eerste versie moet echt bruikbaar zijn om mee te praten.
- Het visuele resultaat moet goed werken en zo dicht mogelijk bij het supplied command-room frame blijven binnen de bestaande plugin.

## Status per requirement

- [x] Bestaande views behouden zonder functionele wijziging — status: gebouwd
- [x] Eigen Jarvis-view met praatlaag — status: gebouwd
- [x] Typed chat + lichte voice input — status: gebouwd
- [x] Host-side hybrid assistent — status: gebouwd
- [x] Visuele polish primair in Jarvis-view — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Conversation-state en groundinglogica als gedeelde Jarvis helpers opgebouwd zodat host en webview dezelfde statevorm delen.
- Voice input als progressive enhancement toegevoegd via webview speech recognition met nette fallback wanneer de runtime dit niet ondersteunt.
- Streaming-achtige assistant rendering toegevoegd via gechunkte hostresponses voor een levendiger Jarvis-gevoel zonder zware realtime providerlaag.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: Jarvis host/message/types/helpers bouwen.
- [x] Blok 3: Jarvis webview en visuele polish bouwen.
- [x] Blok 4: tests, plugin-apply en task/docs afronden.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt en op `in_progress` gezet.
- [x] Jarvis conversation types en message-contract toegevoegd.
- [x] Host-side grounding en assistant-call toegevoegd.
- [x] Jarvis UI omgebouwd naar werkende conversation view.
- [x] Voice fallback toegevoegd.
- [x] Tests toegevoegd of bijgewerkt.
- [x] Verify en plugin apply gedraaid.

## Acceptance criteria

- [x] `jarvis` opent als aparte plugin-view zonder functionele regressie in andere views.
- [x] Gebruiker kan minimaal een typed prompt sturen en een Jarvis-antwoord ontvangen.
- [x] Als voice niet beschikbaar is, blijft typed chat netjes bruikbaar met duidelijke notice.
- [x] Als OpenAI-key of provider ontbreekt, toont Jarvis een nette conversational fallback-state.
- [x] De Jarvis-view voelt visueel duidelijk rijker en dichter bij het supplied frame dan de huidige statische baseline.

## Blockers / afhankelijkheden

- Geen actieve blockers.
- Voor live OpenAI-antwoorden buiten fallback-state moet lokaal `OPENAI_API_KEY` aanwezig zijn.

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

- Oorspronkelijk plan: aparte praatbare Jarvis-view maken zonder andere views functioneel te veranderen.
- Toegevoegde verbeteringen: gedeelde conversation helpers, gechunkte assistant rendering en voice progressive enhancement met graceful fallback.
- Afgerond: eigen Jarvis-view praatbaar gemaakt met typed chat, host-side hybrid antwoorden, voice fallback en sterkere visual polish, terwijl board/list/epics/settings functioneel intact bleven.
- Open / blocked: geen blocker binnen deze slice; verdere uitbreidingen zoals TTS, tool-calling of persistente chats krijgen een aparte vervolgtaak.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-v1-luma-asset-ingest-en-command-room.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`
- `assets/jarvis/final-frame/unified-design-brief.txt`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state