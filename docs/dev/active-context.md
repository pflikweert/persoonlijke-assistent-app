# Active context (niet-canoniek)

Laatst bijgewerkt op: 2026-04-13

## Doel

Lichte sessiecontext tussen Cline-sessies, zodat non-triviale taken sneller en consistenter hervat kunnen worden.

## Huidige focus

- Alleen vullen met actieve WIP die relevant is voor de eerstvolgende sessie.

## Open WIP

- Geen actieve WIP-context op dit moment.

## Laatste onderhoud

- Memory-bank review uitgevoerd; opschoningsregels aangescherpt in `docs/dev/memory-bank.md`.
- Deze file opgeschoond naar baseline om stale sessiecontext te voorkomen.

## Actuele valkuilen / sessielearnings

- Geen tweede waarheidshiërarchie bouwen naast `docs/project/**`.
- Geen “lees alles altijd”; alleen taakrelevante bronnen lezen via docs-router.
- Status alleen verhogen met hard, bewijsbaar repo-signaal (niet op basis van deze contextfile).

## Relevante verwijzingen

- Docs-router: `docs/project/README.md`
- Always-on regels: `AGENTS.md`
- Operationele workflow: `docs/dev/cline-workflow.md`
- Memory-bank regels: `docs/dev/memory-bank.md`
- Statuswaarheid: `docs/project/current-status.md`
- Open gaps: `docs/project/open-points.md`

## Update-regels

- Deze file is **niet canoniek** en **niet de statuswaarheid**.
- Houd inhoud kort, operationeel en tijdgebonden.
- Werk alleen bij bij relevante sessies (onderbroken werk, multi-file context, nuttige WIP/learnings).
- Verwijs naar canonieke docs in plaats van content te dupliceren.
- Promote structurele learnings naar `AGENTS.md`, bestaande skills of `docs/dev/**`.
- Is deze file ouder dan 14 dagen en bevat hij geen aantoonbaar relevante open WIP, reset naar baseline.
