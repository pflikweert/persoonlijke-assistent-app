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
5. Bepaal zelf de kleinste veilige uitvoerblokken op basis van huidige agent/model, risico, dirty worktree en verificatiekosten; vraag dit niet terug aan de gebruiker tenzij er een echte tradeoff is.
6. Houd input minimaal: doel + scope + files.
7. Stop uitbreidingen buiten expliciete vraag.
8. Bij UI-werk: eerst hergebruik/scaffold-check doen via `docs/dev/ui-assembly-decision-tree.md`.
9. Refactor alleen binnen de aangeraakte flow en alleen wanneer dit testbaarheid, leesbaarheid of risicoreductie helpt.
10. Grotere opruimingen, repo-brede cleanup of refactors buiten de actieve flow krijgen een eigen task.
11. Maak nieuwe plans/tasks altijd spec-ready: user outcome, functional slice, entry/exit, happy flow, non-happy flows, UX/copy, data/IO, acceptance en verify.
12. Laat UX/copy en failure states niet open voor latere implementatie-agents wanneer de gebruiker om een concrete flow of bouwtaak vraagt.

# Niet doen
- Geen nieuwe productrichting introduceren.
- Geen ongevraagde infra of architectuurlagen toevoegen.
- Geen big-bang refactor onder de vlag van een kleine taak.
- Geen herhaling van projectcontext in output.
- Geen uitvoerbare taak opleveren die alleen richting beschrijft maar niet duidelijk maakt wat gebouwd, getoond, opgeslagen en getest moet worden.
