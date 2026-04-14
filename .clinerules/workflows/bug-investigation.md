# Workflow — Bug investigation

## Doel
Los regressies of onduidelijke bugs op met een kleine, bewijsbare fix zonder scope-uitloop.

## Scopegrens
- Alleen buganalyse + bugfix binnen de gevraagde fout.
- Geen feature-uitbreiding, geen redesign, geen brede refactor.

## Wat waarschijnlijk geraakt wordt
- Relevante bronfile(s) rond de fout.
- Eventueel 1-2 aangrenzende files voor callsites of contracts.
- Gerichte verify-commando’s (`lint`, `typecheck`, relevante project verify script).

## Wat niet geraakt moet worden
- Onverwante schermen/modules.
- Canonieke docs als de bug puur code is.
- Infra- of architectuurverbreding zonder expliciete vraag.

## Aanbevolen volgorde
1. Lees `docs/project/README.md` en `AGENTS.md`, daarna alleen bug-relevante files.
2. Reproduceer de fout en bepaal de kleinste oorzaak (root cause).
3. Pas de kleinste werkende fix toe in bestaande patronen.
4. Update eventuele directe callsite/contract-impact.
5. Draai gerichte verify en controleer regressierisico.

## Verify
- Minimaal: `npm run lint` en `npm run typecheck` bij codewijzigingen.
- Voeg waar relevant een bestaand project verify-script toe voor het bugdomein.

Refs: `AGENTS.md`, `docs/dev/cline-workflow.md`, `docs/project/current-status.md`.