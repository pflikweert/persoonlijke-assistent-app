---
name: scope-guard
description: Compacte guardrail-skill voor scopebewaking, kleine taken en kostenarme uitvoering.
---

# Gebruik
Gebruik bij elke taak met risico op scope-uitloop of over-architectuur.

# Checklist
1. Valideer tegen projectdocs als enige scopebron.
2. Gebruik de source-of-truth matrix in `docs/project/README.md` (sectie `2b`) en sluit `docs/project/generated/**`, `docs/design/generated/**` en `docs/upload/**` uit als canonieke bron.
3. Voorkom herbesluiten en feature creep.
4. Kies cheap-first en kleinste werkende wijziging.
5. Houd input minimaal: doel + scope + files.
6. Stop uitbreidingen buiten expliciete vraag.
7. Bij UI-werk: eerst hergebruik/scaffold-check doen via `docs/dev/ui-assembly-decision-tree.md`.

# Niet doen
- Geen nieuwe productrichting introduceren.
- Geen ongevraagde infra of architectuurlagen toevoegen.
- Geen herhaling van projectcontext in output.
