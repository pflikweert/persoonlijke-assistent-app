# Budio Workspace VS Code Extension

Lokale VS Code board-plugin voor `docs/project/25-tasks/**/*.md`.

## Scope
- alleen lokale tooling in VS Code
- geen koppeling met Expo, Supabase, Vercel of deployment
- markdown op disk blijft de bron van waarheid

## Commands
- `npm install`
- `npm run build`
- `npm run typecheck`
- `npm run test`

## Starten in VS Code
1. Open deze repo in VS Code.
2. Run `Run Budio Workspace Extension` vanuit Run and Debug.
3. Open daarna `Budio Workspace: Open Board` via command palette.

## MVP
- board + list + settings views
- drag/drop met markdown writeback
- detailpane met veilige metadata-editing
- live refresh via file watcher
