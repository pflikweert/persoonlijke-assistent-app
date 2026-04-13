# Active context (niet-canoniek)

## Doel
Lichte sessiecontext tussen Cline-sessies, zodat non-triviale taken sneller en consistenter hervat kunnen worden.

## Huidige focus
- Repo-eigen Memory Bank workflow verankeren in docs-router, AGENTS en workflowdocs.

## Recent afgerond
- `docs/dev/memory-bank.md` toegevoegd met leesvolgorde, laagverdeling en update-regels.
- `docs/dev/cline-workflow.md` uitgebreid met memory-bank- en active-context beslisregels.

## Volgende logische stappen
- Werk `AGENTS.md`, `docs/project/README.md`, `README.md` en `docs/project/current-status.md` consistent bij.
- Draai docs-verify (`docs:bundle` + `docs:bundle:verify`) en commit alleen bij groen resultaat.

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
