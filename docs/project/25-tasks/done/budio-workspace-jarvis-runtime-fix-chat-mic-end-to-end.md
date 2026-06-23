---
id: task-budio-workspace-jarvis-runtime-fix-chat-mic-end-to-end
title: Budio Workspace Jarvis runtime fix chat en mic end-to-end
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "Maak de bestaande Jarvis typed chat en push-to-talk runtime zichtbaar en betrouwbaar end-to-end met request-acks, request-id reconciliation, provider-timeouts, non-secret diagnostics en een echte reloadroute."
tags: [plugin, vscode, jarvis, openai, audio, chat, runtime]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 22
---




# Budio Workspace Jarvis runtime fix chat en mic end-to-end

## Probleem / context

De Jarvis V1.2-slice heeft echte host-side chat en push-to-talk toegevoegd, maar in runtime ziet de gebruiker na typen nog geen betrouwbare reactie. Omdat `.env.local` de verwachte OpenAI-key varianten bevat, ligt de primaire fix niet bij een lege keyroute maar bij de webview-host bridge, zichtbare pending/error states, provider-diagnose, timeouts en reload van retained plugin/webview-state.

## Gewenste uitkomst

Typed chat en mic voelen direct echt: een ingestuurde prompt verschijnt meteen, Jarvis toont een duidelijke verwerkingsstate, providerrespons of fout komt zichtbaar terug, en mic-opnames tonen opname, transcriptie en antwoord in dezelfde gesprekspijplijn.

De fix blijft beperkt tot Jarvis runtime/bridge/UI-state en host helpers. Board/list/epics/settings blijven functioneel onaangeraakt.

## User outcome

De gebruiker kan in de Jarvis-view typen of push-to-talk gebruiken en ziet altijd wat er gebeurt: ontvangen, verwerken, antwoord klaar of een echte fout met vervolgstap.

## Functional slice

Een gerichte Jarvis-runtimefix:
- request-id gebaseerde submit/ack/completion/failure flow,
- optimistic visible state in de Jarvis webview,
- timeout-aware chat en transcriptie,
- non-secret diagnostics in de host,
- reloadroute om oude retained webview-state te vernieuwen.

## Entry / exit

- Entry: gebruiker opent de Budio Workspace plugin en kiest `Jarvis`.
- Exit: typed of mic input levert zichtbaar een echte respons op, of toont een echte permission/provider/timeout/unavailable-state.

## Happy flow

1. Gebruiker typt een prompt; de prompt verschijnt direct in de conversation surface.
2. De host bevestigt ontvangst en roept OpenAI aan met lokale grounding.
3. Jarvis toont het echte antwoord en keert terug naar idle.

## Non-happy flows

- Empty state: geen input versturen zonder zichtbare no-op.
- Permission denied / unavailable: mic toont echte permission/unavailable reden en typed fallback blijft bruikbaar.
- Validation / unsupported state: lege of te korte audio wordt niet ingestuurd en geeft een compacte melding.
- Failure / retry / cancel: provider-, transcriptie- en timeoutfouten worden zichtbaar en blijven niet stil hangen.

## UX / copy

- Jarvis behoudt de minimal cinematic richting.
- Alleen functionele states tonen: klaar, opnemen, verwerken, antwoord klaar, permissie nodig, providerfout of timeout.
- Geen debug/secrets in UI; hoogstens compacte diagnose met env-varnaam of stage.
- Voeg een subtiele reloadactie toe voor Jarvis wanneer retained state verdacht is.

## Data / IO

- Input:
  - typed prompt met `clientRequestId`
  - audio payload met `clientRequestId`
  - `.env.local` en process env
  - lokale workspace/Jarvis grounding context
- Output:
  - request accepted/runtime-stage events
  - echte assistant response
  - transcriptie als user prompt
  - zichtbare foutstates
- Opslag/API/service/file-impact:
  - geen secrets naar webview
  - geen persistente audio/chatopslag
  - host-side OpenAI chat/transcription calls met timeout
- Statussen:
  - chat: `idle`, `thinking`, `answering`, `error`
  - voice: `idle`, `recording`, `transcribing`, `permission_needed`, `unavailable`

## Waarom nu

De Jarvis-view is pas bruikbaar als de eerste interactie betrouwbaar zichtbaar en echt werkt. De user heeft bevestigd dat typed chat nu geen reacties toont en wil dat mic en chat daadwerkelijk functioneren.

## In scope

- Jarvis webview-host message contract uitbreiden met request-id, ack en runtime-stage events.
- Webview optimistic/reconciliation state voor typed en mic.
- Timeout-aware chat en transcription helpers.
- Non-secret Jarvis runtime/output logging in de host.
- Compacte reloadroute voor Jarvis state/webview.
- Gerichte tests en plugin apply.

## Buiten scope

- Streaming responses.
- TTS.
- Tool-calling, taskmutaties of repo-acties vanuit Jarvis.
- Functionele wijzigingen aan board/list/epics/settings.
- Nieuwe Luma-ingest of assetarchitectuur.

## Oorspronkelijk plan / afgesproken scope

- Maak typed chat direct zichtbaar met lokale user bubble en `thinking` state via `clientRequestId`.
- Voeg request-acks toe tussen webview en host.
- Laat responses/fouten niet verdwijnen bij hydration races.
- Voeg provider-timeouts toe voor chat en transcriptie.
- Verbeter foutdiagnose zonder secrets.
- Maak mic-flow even expliciet als typed chat.
- Voeg min-duration/lege-audio validatie toe.
- Voeg non-secret Jarvis runtime/output log toe.
- Voeg een compacte reloadroute toe.
- Houd bestaande views functioneel onaangeraakt.

## Expliciete user requirements / detailbehoud

- Typed chat moet echt antwoorden tonen.
- Mic functie moet echt werken.
- Geen nep UI-states.
- `.env.local` keyroute is aanwezig en moet gebruikt worden.
- Board/list/epics/settings blijven intact.

## Status per requirement

- [x] Typed chat toont direct submit + echte respons — status: gebouwd
- [x] Mic toont opname/transcriptie/antwoord end-to-end — status: gebouwd
- [x] Hydration races verliezen geen responses/fouten — status: gebouwd
- [x] Provider-timeouts en non-secret diagnostics — status: gebouwd
- [x] Reloadroute voor Jarvis retained state — status: gebouwd
- [x] Bestaande views functioneel onaangeraakt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Live provider-smoke toegevoegd voor chat via dezelfde Jarvis helper en `.env.local` keyroute.
- Live provider-smoke toegevoegd voor transcriptie via tijdelijk lokaal audiobestand buiten de repo.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: bridge/state/types en host diagnostics/timeouts bouwen.
- [x] Blok 3: webview optimistic typed/mic flow en reloadactie bouwen.
- [x] Blok 4: tests, plugin apply, smoke/verify en task/docs afronden.

## Concrete checklist

- [x] Message contract uitbreiden met request-id, accepted en runtime-stage events.
- [x] Host Jarvis pipeline request-aware, timeout-aware en diagnostic-aware maken.
- [x] Webview Jarvis state reconciliation harden.
- [x] Mic payload-validatie en transcriptie-state zichtbaar maken.
- [x] Reload command/actie toevoegen.
- [x] Gerichte tests toevoegen of uitbreiden.
- [x] Plugin opnieuw toepassen met `npm --prefix tools/budio-workspace-vscode run apply:workspace`.

## Acceptance criteria

- [x] Een typed prompt verschijnt direct en levert zichtbaar een echte assistant response of fout op.
- [x] Een mic-opname toont opnemen, transcriberen, transcript en daarna dezelfde chatflow.
- [x] Provider- of timeoutfouten blijven zichtbaar en verdwijnen niet door hydration timing.
- [x] Geen secretwaarde komt in webview-state, UI-copy of logs.
- [x] Board/list/epics/settings blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Live mic happy path blijft afhankelijk van OS/VS Code microfoonrechten.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 43 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd vóór afronding
- Live chat provider-smoke — geslaagd: `Jarvis live`, providerSource `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4.1-mini`
- Live transcriptie provider-smoke — geslaagd: `Jarvis live.`, providerSource `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4o-mini-transcribe`
- OS/VS Code mic permission-smoke — niet geautomatiseerd; blijft lokale runtime-permissie.

## Reconciliation voor afronding

- Oorspronkelijk plan: typed chat + mic end-to-end zichtbaar en echt werkend maken met bridge hardening, timeouts, diagnostics en reload.
- Toegevoegde verbeteringen: live provider-smokes voor chat en transcriptie zijn uitgevoerd naast unit/type/lint/apply-verify.
- Afgerond: request-id bridge, host acks/runtime-stages, optimistic webview state, hydration race hardening, provider-timeouts, mic audio-validatie, non-secret output logging, reload command en README zijn klaar.
- Open / blocked: geen codeblocker; echte OS/VS Code microfoonpermissie blijft alleen lokaal in de webview runtime te bevestigen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-echte-chat-en-push-to-talk.md`
- `tools/budio-workspace-vscode/README.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state