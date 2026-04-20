# Budio Workspace VS Code Extension

Lokale VS Code board-plugin voor `docs/project/25-tasks/**/*.md`.

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

## Starten in VS Code
1. Open deze repo in VS Code.
2. Run `Run Budio Workspace Extension` vanuit Run and Debug.
3. Open daarna `Budio Workspace: Open Board` via command palette.

## Workflowregel
- Bij elke wijziging in `tools/budio-workspace-vscode/**` altijd `npm run apply:workspace` uitvoeren in deze map, zodat de normale workspace direct de nieuwste extensionversie heeft.

## Security
- Secrets mogen nooit hardcoded in de extensie of webview-code staan.
- Repo-brede secret scanning draait via GitHub Actions (`.github/workflows/secret-scan.yml`).

## MVP
- board + list + settings views
- drag/drop met markdown writeback
- detailpane met veilige metadata-editing
- live refresh via file watcher
