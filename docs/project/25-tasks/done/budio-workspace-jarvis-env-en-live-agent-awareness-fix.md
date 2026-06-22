---
id: task-budio-workspace-jarvis-env-live-agent-awareness-fix
title: Budio Workspace Jarvis env en live agent awareness fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Fix de valse OPENAI_API_KEY ontbreekt-melding in Jarvis, toon echte env/availability-data zonder secrets en voeg near-realtime workspace/agent awareness toe in de Jarvis-view."
tags: [plugin, vscode, jarvis, openai, agents, realtime, ui]
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


# Budio Workspace Jarvis env en live agent awareness fix

## Probleem / context

Jarvis toont in de UI dat `OPENAI_API_KEY` ontbreekt, terwijl `.env.local` wel de relevante OpenAI keys bevat. De availability-copy en env-resolutie moeten dus eerlijker en robuuster worden. Daarnaast wil de gebruiker geen nep/placeholders meer, maar echte workspace- en agentdata: near-realtime updates en subtiel zichtbaar wat actieve agents/Codex doen.

## Gewenste uitkomst

Jarvis gebruikt de bestaande `.env.local` keyroute correct en toont geen valse missing-key melding meer. De Jarvis-view toont echte workspace/agent awareness uit de huidige board snapshot en taskmetadata, met near-realtime updates via de bestaande watcher/refreshlaag.

## User outcome

De gebruiker opent Jarvis en ziet of chat echt beschikbaar is, welke veilige keybron gebruikt wordt, welke taken/agents actief zijn en wat Codex/agents subtiel aan het doen zijn, zonder secrets of nepdata.

## Functional slice

- Env/availability hardening voor Jarvis chat.
- Echte Jarvis workspace/agent awareness in de view.
- Near-realtime refresh korter en zichtbaarer voor Jarvis.
- Geen wijzigingen aan board/list/epics/settings workflows.

## Entry / exit

- Entry: gebruiker opent `Jarvis` in de Budio Workspace plugin.
- Exit: Jarvis toont echte chat availability en actuele workspace/agent activiteit, of een echte reden waarom iets ontbreekt.

## Happy flow

1. Jarvis opent en resolveert `.env.local`.
2. Chat availability is beschikbaar via workspace-specific of fallback OpenAI key.
3. Jarvis toont echte actieve agent/tasks uit de board snapshot.
4. File changes of active-agent metadata updates verschijnen near-realtime.

## Non-happy flows

- Empty state: als er geen actieve agents zijn, staat er compact dat er nu geen agentactiviteit is.
- Missing key: alleen tonen als alle ondersteunde env-vars echt ontbreken.
- Provider unavailable: toon echte providerfout zonder secrets.
- No snapshot: toon dat workspace data nog laadt in plaats van nepdata.

## UX / copy

- Geen placeholder of fake statuscopy.
- Geen secretwaarden tonen.
- Wel veilig tonen: env-varnaam, update-tijd, actieve agentnaam/model/status en tasktitel.
- Codex/agentactiviteit subtiel als signal/awareness laag, niet als dominante debugconsole.

## Data / IO

- Input:
  - `.env.local` en process env
  - board snapshot met `activeAgent*` taskmetadata
  - Jarvis conversation capabilities
- Output:
  - echte availability copy
  - actieve agent/task lijst
  - update-tijd en live indicator
- Opslag/API/service/file-impact:
  - geen secrets naar webview
  - geen nieuwe provider calls nodig voor awareness
  - watcher/refresh timing alleen voor plugin runtime
- Statussen:
  - bestaande chat/voice states blijven leidend

## Waarom nu

De user ziet een valse key-melding en wil Jarvis als echte command room gebruiken. Dat vraagt om betrouwbare env-signalen en echte live workspace/agent awareness.

## In scope

- Jarvis env diagnostics veiliger en duidelijker maken.
- Jarvis view voeden met board snapshot awareness.
- Actieve agents/Codex subtiel tonen.
- Near-realtime refresh voor Jarvis/task changes aanscherpen.
- Tests en plugin apply.

## Buiten scope

- Nieuwe agentrunner bouwen.
- Autonome taskmutaties vanuit Jarvis.
- Nieuwe OpenAI key aanmaken.
- Board/list/epics/settings functioneel wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Fix de valse `OPENAI_API_KEY ontbreekt voor Jarvis chat` melding.
- Alles moet werken met bestaande `.env.local`.
- Geen nep UI/placeholders, alleen echte data.
- Review Jarvis en toon near-realtime updates.
- Toon actieve agents/Codex subtiel in Jarvis.

## Expliciete user requirements / detailbehoud

- Alles staat al in `.env.local`.
- Zorg dat alles werkt.
- Niks nep in het scherm.
- Geen placeholders maar echte data.
- Near realtime updates.
- Als agents actief zijn wil de gebruiker dat realtime zien.
- Subtiel tonen wat Codex/agents doen.

## Status per requirement

- [x] Valse missing-key melding opgelost — status: gebouwd
- [x] Echte env/availability data zonder secrets — status: gebouwd
- [x] Jarvis toont echte workspace/agent data — status: gebouwd
- [x] Near-realtime updates aangescherpt — status: gebouwd
- [x] Geen board/list/epics/settings regressie — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De concrete false-negative oorzaak is opgelost: lege `process.env` waarden overschrijven `.env.local` waarden niet meer.
- Jarvis toont nu veilig keybron/model en laatste workspace update in de command footer.
- Jarvis links toont echte workspace focus-taken uit de board snapshot; rechts toont echte actieve agents uit `active_agent*` metadata.
- Achtergrondrefresh is aangescherpt naar 5 seconden als vangnet naast de bestaande file watcher.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, safe env-check en taskflow.
- [x] Blok 2: env diagnostics en Jarvis awareness helpers/types bouwen.
- [x] Blok 3: Jarvis UI echte data + near-realtime refresh aansluiten.
- [x] Blok 4: tests, plugin apply, verify en task/docs afronden.

## Concrete checklist

- [x] Exacte bron van missing-key copy vinden en vervangen door ondersteunde keyroute.
- [x] Safe env diagnostics uitbreiden met env-varnaam en checked path zonder secretwaarde.
- [x] Board snapshot doorgeven aan Jarvis-view.
- [x] Actieve agent/tasks uit snapshot renderen.
- [x] Refresh/watch timing voor near-realtime Jarvis updates aanscherpen.
- [x] Typecheck/test/apply draaien.

## Acceptance criteria

- [x] Jarvis toont geen missing-key als één van de ondersteunde keys aanwezig is.
- [x] Jarvis toont veilige keybron/availability zonder secrets.
- [x] Jarvis toont echte actieve agent/task data of een echte empty state.
- [x] Updates uit taskfiles worden near-realtime zichtbaar.
- [x] Bestaande views blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Geen actieve blockers.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 45 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- Live Jarvis chat-smoke — geslaagd, availability true via `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4.1-mini`
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd vóór afronding

## Reconciliation voor afronding

- Oorspronkelijk plan: fix env false-negative, echte data in Jarvis, near-realtime agent awareness.
- Toegevoegde verbeteringen: false-negative root cause expliciet getest, safe keysource/model UI toegevoegd, live provider-smoke uitgevoerd.
- Afgerond: env-resolutie is gehard, Jarvis gebruikt echte board snapshot data, actieve agents worden subtiel getoond, near-realtime refresh is aangescherpt en plugin is toegepast op VS Code.
- Open / blocked: geen.

## Relevante links

- `tools/budio-workspace-vscode/src/jarvis/env.ts`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/src/tasks/types.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room