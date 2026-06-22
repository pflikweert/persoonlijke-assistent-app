# Budio Workspace VS Code Extension

Lokale VS Code board-plugin voor `docs/project/25-tasks/**/*.md`, met een lichte epic-laag uit `docs/project/24-epics/**/*.md`.

## License en gebruiksrechten
- Deze extensie is **source-visible maar niet open source**.
- Gebruik, kopiëren, aanpassen, distribueren of commercieel hergebruik is niet toegestaan zonder voorafgaande schriftelijke toestemming.
- Zie `tools/budio-workspace-vscode/LICENSE`.

## Scope
- alleen lokale tooling in VS Code
- geen koppeling met Expo, Supabase, Vercel of deployment
- markdown op disk blijft de bron van waarheid

## Commands
- `npm install`
- `npm run build`
- `npm run typecheck`
- `npm run test`
- `npm run apply:workspace` (build + package + install + VS Code refresh)
- `npm run plugin:vscode:screenshot` vanuit de repo-root om lokaal een VS Code screenshot naar `/tmp` te schrijven.

## Starten in VS Code
1. Open deze repo in VS Code.
2. Run `Run Budio Workspace Extension` vanuit Run and Debug.
3. Klik daarna op het `Budio Workspace` activity-bar icoon om direct de list view te openen, of gebruik `Budio Workspace: Open List View` via de command palette.

## Workflowregel
- Bij elke wijziging in `tools/budio-workspace-vscode/**` altijd `npm run apply:workspace` uitvoeren in deze map, zodat de normale workspace direct de nieuwste extensionversie heeft.

## Screenshotbewijs
- Gebruik vanuit de repo-root `npm run plugin:vscode:screenshot` na `apply:workspace` om VS Code te activeren en een PNG naar `/tmp` te schrijven.
- Als macOS `screencapture` blokkeert met `could not create image from display`, geef de host-app die Codex/terminal draait toegang bij System Settings -> Privacy & Security -> Screen & System Audio Recording.
- Gebruik `npm run plugin:vscode:screenshot -- --open-settings` om die macOS-instellingen direct te openen. Herstart daarna de terminal/Codex-host en probeer opnieuw.

## Jarvis lokale env
- Jarvis chat leest lokaal eerst `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, daarna `OPENAI_API_BUDIO_WORKSPACE_KEY`, en pas daarna `OPENAI_API_KEY`.
- Jarvis transcriptie gebruikt dezelfde host-side keyroute en leest `OPENAI_TRANSCRIPTION_MODEL` als transcriptiemodel.
- `BUDIO_WORKSPACE_JARVIS_MODEL` overschrijft het standaard Jarvis chatmodel.
- De extensie leest deze waarden uit repo-root `.env.local` of uit de huidige shellomgeving; secrets gaan nooit naar de webview.
- Gebruik `Budio Workspace: Reload Jarvis` wanneer VS Code een oude retained Jarvis-webview lijkt vast te houden na een lokale install.
- Jarvis runtime-diagnose staat in het VS Code outputkanaal `Budio Jarvis` en logt alleen request-stages, model/env-varnamen en foutcodes, nooit secretwaarden.

## Security
- Secrets mogen nooit hardcoded in de extensie of webview-code staan.
- Repo-brede secret scanning draait via GitHub Actions (`.github/workflows/secret-scan.yml`).

## MVP
- board + list + settings views
- epics overview met linked tasks
- subtasks en dependency-relaties in task detail
- drag/drop met markdown writeback
- detailpane met veilige metadata-editing
- live refresh via file watcher
- activity-bar icoon opent direct de bestaande window in list view; board blijft beschikbaar als secundaire view
