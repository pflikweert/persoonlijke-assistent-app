---
id: task-budio-workspace-jarvis-hardening-echte-command-room
title: Budio Workspace Jarvis hardening echte command room
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Maak Jarvis betrouwbaar werkend met robuuste workspace-root/env-resolutie, echte chat/mic states, echte agent-awareness en een strakkere cinematic command-room zonder fake placeholders."
tags: [plugin, vscode, jarvis, openai, voice, realtime, ui, hardening]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 16
---




# Budio Workspace Jarvis hardening echte command room

## Probleem / context

Jarvis toont nog steeds `Chat niet beschikbaar`, `Aandacht nodig` en update-copy terwijl `.env.local` wel OpenAI keys bevat. De waarschijnlijke oorzaak is dat de VS Code extension de eerste workspacefolder als repo-root gebruikt, terwijl de echte Budio repo in een child-folder kan staan. Daarnaast moet de Jarvis-view geen fake seeddata of placeholder-states tonen, maar echte chat/mic/agent/workspace-status en visueel sterker aanvoelen.

## Gewenste uitkomst

Jarvis opent als betrouwbare interne command room: chat gebruikt de echte lokale keyroute, mic werkt via de echte push-to-talk/transcriptieflow of toont een eerlijke permission/unavailable-state, actieve agents worden alleen getoond wanneer taskmetadata dat echt bevestigt, en de interface gebruikt echte Luma-assets/workspacedata zonder nepcontent.

## User outcome

De gebruiker opent de Jarvis-view in de bestaande Budio Workspace plugin en kan direct typen tegen Jarvis. Als voice beschikbaar is, kan de gebruiker push-to-talk gebruiken. De command room toont echte actuele workspace- en agentinformatie, met een cinematic responsive UI die geen misleidende placeholdercopy bevat.

## Functional slice

- Robuuste repo-root/env-resolutie voor de extension host.
- Echte Jarvis availability/recovery state zonder stale errors.
- End-to-end zichtbare typed chat en mic/transcription states.
- Real-time-ish agent awareness uit echte `active_agent*` taskmetadata.
- Jarvis-only UI cleanup en visual hardening met bestaande Luma-assets.
- Geen functionele wijzigingen aan board/list/epics/settings.

## Entry / exit

- Entry: gebruiker opent `Jarvis` in de Budio Workspace plugin vanuit een directe repo-workspace of bovenliggende VS Code workspace.
- Exit: Jarvis toont `Chat live` met veilige keybron/model of een echte diagnose, chat/mic requests blijven zichtbaar tot success/failure, en de view toont alleen echte data of eerlijke empty states.

## Happy flow

1. Extension resolveert de echte Budio repo-root, ook als VS Code op de parentfolder staat.
2. `.env.local` wordt gevonden en de OpenAI keyroute wordt host-side beschikbaar.
3. Jarvis toont chat als live en accepteert typed input direct zichtbaar in de conversation.
4. Providerresponse komt terug als echte Jarvis-response of providerfout met hersteltekst.
5. Push-to-talk neemt audio op, transcribeert via OpenAI en gebruikt dezelfde chatpipeline.
6. Active-agent metadata-updates verschijnen near-realtime in de Jarvis-awareness laag.

## Non-happy flows

- Empty state: geen actieve agents betekent een compacte echte empty state, geen verzonnen activiteit.
- Permission denied / unavailable: mic toont een echte OS/VS Code permission- of unsupported-state.
- Validation / unsupported state: lege audio of te korte opname geeft direct een echte melding.
- Failure / retry / cancel: providerfout, timeout of missing key blijft zichtbaar en verdwijnt niet door hydration-races.

## UX / copy

- Geen fake labels of seedcontent zoals `Sprint 4`, fake staging/PR meldingen of placeholder command-room tekst in de hoofdview.
- Chatstatus is compact en waarheidsgetrouw: `Chat live · <KEY_SOURCE> · <model>` bij beschikbaarheid.
- Alleen echte foutcopy tonen: ontbrekende key, providerfout, timeout, permission nodig of voice unavailable.
- Jarvis core reageert cinematic op idle/thinking/transcribing/active-agent states en respecteert reduced motion.

## Data / IO

- Input:
  - VS Code workspacefolders
  - `.env.local` en process env
  - Jarvis assetmanifest en lokale Luma-assets
  - board snapshot en taskmetadata
  - typed prompt of audio payload
- Output:
  - veilige Jarvis diagnostics zonder secrets
  - chat/transcription requests host-side naar OpenAI
  - webview state-events met `clientRequestId`
  - echte awareness-data uit taskfiles
- Opslag/API/service/file-impact:
  - geen secrets naar webview
  - geen taskmutaties vanuit Jarvis
  - geen autonome agentrunner in deze slice
- Statussen:
  - chat: idle/thinking/answering/error
  - voice: idle/recording/transcribing/permission_needed/unavailable
  - runtime: accepted/stage/completed/failed

## Waarom nu

De gebruiker wil Jarvis als echt werkende interne command room gebruiken. Een valse missing-key state en fake interfacecopy breken vertrouwen en blokkeren gebruik.

## In scope

- Workspace-root resolver hardening.
- Env availability/recovery hardening.
- Jarvis bridge/runtime visibility verbeteren.
- Mic validation en transcription-state aanscherpen.
- Echte active-agent awareness en update-tijd.
- Jarvis-view copy en responsive cinematic polish.
- Plugin apply en gerichte live smoke.

## Buiten scope

- Board/list/epics/settings functioneel wijzigen.
- Autonome agentruns of taskmutaties vanuit Jarvis.
- Nieuwe publieke Budio productfeature maken.
- Nieuwe OpenAI key aanmaken.
- Grote Luma-regeneratie als blocker voor werkende runtime.

## Oorspronkelijk plan / afgesproken scope

- Maak workspace-root resolving robuust zodat `.env.local` in `persoonlijke-assistent-app` wordt gevonden, ook vanuit een parent VS Code workspace.
- Gebruik de resolved repo-root voor env, taskdata, assets, manifesten en active-agent metadata.
- Herstel chat availability en wis stale error-state zodra een echte key beschikbaar is.
- Vervang `Chat niet beschikbaar` / `Aandacht nodig` door echte diagnose of `Chat live`.
- Maak typed chat en mic end-to-end zichtbaar met request accepted, stage, completed en failed events.
- Toon near-realtime agentactiviteit alleen uit echte `active_agent*` metadata.
- Verwijder fake UI-copy/placeholders uit de Jarvis-hoofdview.
- Upgrade Jarvis visueel met bestaande Luma-assets.
- Gebruik Luma API alleen aanvullend als bestaande assets aantoonbaar tekortschieten.

## Expliciete user requirements / detailbehoud

- `.env.local` bevat de keys; Jarvis mag dus niet vals missing-key tonen.
- Ga door tot het echt werkt en test/review.
- Geen half werkende UI en geen nepstates.
- Jarvis moet functioneel chatten en mic-flow moet echt werken.
- Jarvis moet er beter uitzien dan de huidige variant.
- Gebruik strategie-docs als richting: Jarvis is internal-only/founder workspace tooling.
- Gebruik bestaande assets en eventueel Luma API als visuele assets nodig zijn.
- Bestaande views behouden en functioneel niet aanpassen.

## Status per requirement

- [x] Robuuste repo-root/env-resolutie — status: gebouwd
- [x] Echte chat availability zonder stale false-negative — status: gebouwd
- [x] Typed chat zichtbaar end-to-end — status: gebouwd
- [x] Mic push-to-talk/transcription zichtbaar end-to-end — status: gebouwd
- [x] Echte active-agent awareness — status: gebouwd
- [x] Geen fake placeholders in Jarvis hoofdview — status: gebouwd
- [x] Cinematic responsive Jarvis polish — status: gebouwd
- [x] Bestaande views functioneel onaangeraakt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De root-resolver kiest nu de echte Budio repo-root op basis van task/plugin/asset markers, ook als VS Code op de parentfolder staat.
- De Jarvis hoofdview gebruikt de Luma ambient loop als achtergrondlaag en toont geen asset/debugpanelen meer in de hoofdflow.
- De algemene Budio Workspace topbar is voor de Jarvis-view verwijderd; reset/herlaad/sync staan subtiel in de Jarvis-kamer zelf.
- De voice providerroute is live getest met een lokaal gegenereerde audiofile via dezelfde transcription helper.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow, huidige code/root/env/runtimebron bevestigen.
- [x] Blok 2: workspace-root resolver en env availability recovery bouwen.
- [x] Blok 3: Jarvis runtime bridge/chat/mic visibility en diagnostics harden.
- [x] Blok 4: Jarvis UI fake-copy verwijderen en cinematic real-data layout polishen.
- [x] Blok 5: gerichte tests, live smoke, plugin apply en docs/task afronden.

## Concrete checklist

- [x] Root resolver toevoegen en host code aansluiten.
- [x] Tests toevoegen voor direct repo, parent workspace en missing markers.
- [x] Availability-state en stale error recovery fixen.
- [x] Chat/mic request lifecycle met `clientRequestId` verifiëren en waar nodig harden.
- [x] Jarvis fake seedcontent uit hoofdview verwijderen.
- [x] Active-agent awareness alleen uit echte metadata renderen.
- [x] CSS/Jarvis core visueel aanscherpen met bestaande assets.
- [x] Plugin typecheck/test/apply draaien.
- [x] Live chat smoke uitvoeren met echte keyroute.
- [x] Taskflow/docs verify draaien en task reconciliation bijwerken.

## Acceptance criteria

- [x] Jarvis toont geen `Chat niet beschikbaar` wanneer een ondersteunde key in de echte repo `.env.local` staat.
- [x] Parent VS Code workspace resolveert alsnog naar `persoonlijke-assistent-app` als Budio repo-root.
- [x] Typed prompt levert een echte providerresponse of zichtbare echte providerfout/timeout op.
- [x] Mic-flow toont echte opname/transcriptie/failure-state zonder browser SpeechRecognition-placeholders.
- [x] Jarvis toont geen fake seeddata in de hoofdview.
- [x] Actieve agents worden alleen getoond bij echte `active_agent*` metadata.
- [x] Jarvis past responsief en gebruikt cinematic Luma assetlagen zonder bestaande views functioneel te veranderen.

## Blockers / afhankelijkheden

- Geen bekende blockers. OS/VS Code microfoonrechten kunnen buiten code alsnog transcriptie-smoke beperken; typed chat moet dan volledig blijven werken.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 47 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension gebouwd/gepackaged/geïnstalleerd en VS Code refresh uitgevoerd
- Live typed Jarvis smoke — geslaagd via parent workspace route, keysource `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4.1-mini`
- Live transcription provider smoke — geslaagd via dezelfde keyroute, model `gpt-4o-mini-transcribe`, transcript ontvangen
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: robuuste root/env fix, echte chat/mic runtime, echte data/agent awareness, geen fake UI, cinematic Jarvis polish.
- Toegevoegde verbeteringen: parent-workspace resolver als pure testbare helper, stale-error recovery als pure helper, ambient video als echte achtergrondlaag, Jarvis topbar verwijderd en live transcription smoke toegevoegd.
- Afgerond: root/env false-negative opgelost, chat availability herstelt zonder stale `Aandacht nodig`, typed chat live bewezen, transcription providerroute live bewezen, Jarvis hoofdview toont echte workspace/agentdata en geen fake seedcopy, plugin opnieuw toegepast op VS Code.
- Open / blocked: fysieke push-to-talk via jouw VS Code/macOS microfoonrechten kan alleen interactief in de plugin zelf worden bevestigd; de host-side transcriptieproviderroute is wel live bewezen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-env-en-live-agent-awareness-fix.md`
- `docs/project/25-tasks/done/budio-workspace-jarvis-responsive-cinematic-polish.md`
- `docs/project/25-tasks/done/budio-workspace-jarvis-runtime-fix-chat-mic-end-to-end.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state