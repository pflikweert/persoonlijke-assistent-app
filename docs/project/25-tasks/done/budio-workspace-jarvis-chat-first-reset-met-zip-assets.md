---
id: task-budio-workspace-jarvis-chat-first-reset-met-zip-assets
title: Budio Workspace Jarvis chat-first reset met ZIP assets
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Herbouw Jarvis naar een rustige premium chat-first interface met gecureerde ZIP-assets, echte chat/audio als hoofdinteractie en zonder drukke dashboardrails."
tags: [plugin, vscode, jarvis, ui, assets, voice, chat]
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


# Budio Workspace Jarvis chat-first reset met ZIP assets

## Probleem / context

De huidige Jarvis-view is functioneel dichterbij gekomen, maar visueel nog te druk en voelt te veel als een dashboard. De gebruiker wil expliciet een chat-first Jarvis-ervaring: premium, rustig, visueel overtuigend, met echte chat en audio als hoofdinteractie. De nieuwe ZIP `/Users/pieterflikweert/Downloads/VS_Code_Workspace.zip` bevat finale/code-ready Jarvis-assets en motionreferenties die gecureerd gebruikt moeten worden.

## Gewenste uitkomst

Jarvis opent als een rustige, premium, chat-first command room. De levende Jarvis-core en ambient video vormen de visuele wereld; chat en push-to-talk audio staan centraal. Workspace-, asset- en agentinformatie blijft echt, maar wordt alleen compact als context/status getoond in plaats van als drukke dashboardpanelen.

## User outcome

De gebruiker kan Jarvis openen, typen, push-to-talk gebruiken wanneer microfoonrechten beschikbaar zijn, en in één rustige interface zien of chat/mic/assets/agents beschikbaar zijn. Het scherm voelt niet cheap of overvol, maar als een hoogwaardige Jarvis-ruimte met echte functionaliteit.

## Functional slice

- Gecureerde ZIP-assets importeren naar `assets/jarvis/final-frame/`.
- Jarvis manifest updaten zodat de webview manifestgedreven blijft.
- Jarvis-view vereenvoudigen naar chat-first compositie.
- Mic/chat UI-states duidelijker maken zonder runtimefake.
- Bestaande chat/audio/reload/sync/reset handlers behouden.
- Board/list/epics/settings functioneel onaangeraakt laten.

## Entry / exit

- Entry: gebruiker opent de top-level `jarvis` view in de Budio Workspace VS Code plugin.
- Exit: gebruiker ziet een rustige chat-first Jarvis-view met gecureerde ZIP-assets, prominent gesprek en mic-control, plus compacte echte status/context.

## Happy flow

1. Jarvis hydrateert lokale assets, board snapshot en conversation capabilities.
2. De ambient loop en transparent Jarvis core renderen als levende achtergrond.
3. De gebruiker typt een prompt of gebruikt mic push-to-talk.
4. Jarvis toont pending/thinking/transcribing/answer states in de chat-first surface.
5. Statuschips tonen compact de echte chat-, mic-, asset- en agentstatus.

## Non-happy flows

- Empty state: geen gesprek toont één rustige uitnodiging om Jarvis iets te vragen.
- Permission denied / unavailable: mic toont één duidelijke permission- of unavailable-notice met CTA.
- Validation / unsupported state: te korte of lege opname toont een korte echte melding.
- Failure / retry / cancel: providerfout, missing key of transcription failure blijft zichtbaar in chat/status zonder dashboarddrukte.

## UX / copy

- Richting: `Chat-first`.
- Geen grote linker/rechter dashboardrails in de hoofdview.
- Geen grote `Werkcontext`, `Bronnen`, `Activity`, `Suggesties`, `Controls` panelstapel.
- Compacte labels: `Chat live`, `Mic klaar/opnemen/rechten nodig`, `Assets klaar`, `Agents actief`.
- Eén primaire input placeholder: `Vraag Jarvis iets...`.
- Geen prominente debug/key/modelcopy behalve compact en veilig in status.

## Data / IO

- Input:
  - `/Users/pieterflikweert/Downloads/VS_Code_Workspace.zip`
  - bestaande Jarvis manifest/state/conversation/workspace snapshot
- Output:
  - gecureerde assets in `assets/jarvis/final-frame/`
  - bijgewerkt `jarvis-assets-manifest.json`
  - aangepaste Jarvis React/CSS
  - task/docs updates
- Opslag/API/service/file-impact:
  - geen secrets
  - geen nieuwe OpenAI/Luma calls
  - geen taskmutaties vanuit Jarvis
- Statussen:
  - bestaande chat/voice/runtime/asset states blijven leidend

## Waarom nu

De gebruiker heeft de huidige Jarvis-review afgekeurd als te druk, te veel informatie en niet premium genoeg. Chat en audio moeten nu echt centraal komen te staan.

## In scope

- Alleen gecureerde ZIP-assets importeren.
- Jarvis assetmanifest bijwerken.
- `JarvisView.tsx` en Jarvis CSS herstructureren.
- Mic/chat visible states verbeteren.
- Plugin apply en verify.

## Buiten scope

- Nieuwe Luma-generatie.
- Nieuwe OpenAI providerlaag.
- Autonome agentruns of taskmutaties.
- Functionele wijziging aan board/list/epics/settings.
- Hele ZIP importeren.

## Oorspronkelijk plan / afgesproken scope

- Herbouw Jarvis naar een rustige, premium chat-first interface.
- Curateer alleen relevante ZIP-assets: `SsavSJdE`, `tITjE1Lq`, `WU2CfDCw`, `--OTYSI5`, `LjJuGpeu` en optionele referenties.
- Update de lokale Jarvis assetlaag en het manifest.
- Verwijder de dashboarddrukte uit de hoofdview.
- Houd echte chat en audio leidend.
- Houd bestaande handlers en bestaande pluginviews intact.

## Expliciete user requirements / detailbehoud

- "Review... gaat niet lekker"
- "schoon het op"
- "veel te druk en te veel informatie"
- "Jij bent de jarvis expert"
- "chat is belangrijk"
- "ik wil dat de audio ook werkt"
- "visueel echt heel goed maken nu"
- "niet zo cheap"
- "Hierbij ook nog eens alle designs en assets... maak er gebruik van"
- "er zitten ook filmpjes tussen voor jarvis om te gebruiken"

## Status per requirement

- [x] ZIP-assets gecureerd geïmporteerd — status: gebouwd
- [x] Jarvis manifest bijgewerkt — status: gebouwd
- [x] Chat-first hoofdview gebouwd — status: gebouwd
- [x] Dashboarddrukte verwijderd — status: gebouwd
- [x] Audio/mic states duidelijk en echt — status: gebouwd
- [x] Bestaande chat/audio handlers behouden — status: gebouwd
- [x] Plugin opnieuw toegepast — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De geselecteerde ZIP-assets zijn opnieuw uitgepakt naar stabiele runtimebestanden en het manifest is bijgewerkt met `local-zip` checksums.
- De oude cockpit-rails zijn uit de Jarvis-hoofdview verwijderd; details staan nu alleen compact onder een ingeklapt `Context` blok.
- De mic-state is teruggebracht naar één prominente knop en één duidelijke permission/unavailable notice.
- Prominente key/model/debugcopy is uit de hoofdview gehaald; chat/mic/assets/agents staan compact als statuschips.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow, docs en huidige Jarvis-context bevestigen.
- [x] Blok 2: gecureerde ZIP-assets importeren en manifest bijwerken.
- [x] Blok 3: Jarvis-view/CSS naar chat-first reset ombouwen.
- [x] Blok 4: plugin verify/apply, repo verify en docs afronden.

## Concrete checklist

- [x] ZIP assetnamen en doelbestanden bevestigen.
- [x] Alleen geselecteerde assets uit ZIP importeren.
- [x] Manifest roles en checksums updaten.
- [x] `JarvisView.tsx` vereenvoudigen naar chat-first compositie.
- [x] CSS opschonen naar rustige premium layout.
- [x] Mic permission/transcribing/recording states in hoofdflow tonen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Repo taskflow/lint/typecheck/docs verify afronden.

## Acceptance criteria

- [x] Jarvis hoofdview toont geen grote linker/rechter dashboardrails meer.
- [x] Chat en audio zijn de primaire interacties in beeld.
- [x] Gecureerde ZIP-video/core/waveform/logotype/HUD-assets worden manifestgedreven gebruikt.
- [x] Mic permission-needed toont één duidelijke CTA.
- [x] Typed chat blijft functioneel aangesloten.
- [x] Layout werkt breed en smal zonder overlap/afkapping.
- [x] Plugin is opnieuw toegepast op VS Code workspace.

## Blockers / afhankelijkheden

- Geen bekende blockers. Fysieke microfoonrechten blijven afhankelijk van macOS/VS Code, maar de UI moet die state eerlijk tonen.

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

- Oorspronkelijk plan: chat-first reset met gecureerde ZIP-assets, echte chat/audio centraal en dashboarddrukte weg.
- Expliciete user requirements: ZIP-assets zijn gebruikt, dashboarddrukte is verwijderd, chat/audio staan centraal en fake states zijn vermeden.
- Toegevoegde verbeteringen: compacte contextdetails en veiliger non-prominente diagnostics.
- Afgerond: assetimport, manifestupdate, Jarvis-view/CSS reset, plugin typecheck/test/apply, repo-checks en docs bundle/verify.
- Open / blocked: geen bekende blockers; fysieke microfoonopname blijft afhankelijk van VS Code/macOS permissie in de live webview.

## Relevante links

- `/Users/pieterflikweert/Downloads/VS_Code_Workspace.zip`
- `docs/project/25-tasks/done/budio-workspace-jarvis-height-borderless-core-polish.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room