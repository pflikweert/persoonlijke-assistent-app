# Task lifecycle workflow (operationeel)

## Doel

Een expliciete, goedkope en herhaalbare workflow voor fase-taken, zodat open werk als concrete taakfiles kan worden gevolgd in plaats van alleen als losse gaps in `open-points.md`.

## Plaats in de hiërarchie

- Canonieke productwaarheid: `docs/project/**`
- Actieve planning: `docs/project/20-planning/**`
- Operationele taaklaag: `docs/project/25-tasks/**`
- Workflowafspraken: `docs/dev/**`

`25-tasks/**` is operationeel voor uitvoering en triage, niet de canonieke statuswaarheid.

## Statusmodel

- `backlog`
- `ready`
- `in_progress`
- `blocked`
- `done`

## Kernregels

1. Gebruik één taakfile per concreet uitvoerbaar werkpakket.
2. Houd `title` menselijk refererbaar en `id` technisch stabiel.
3. Open taken leven in `docs/project/25-tasks/open/`.
4. Alleen taken met status `done` mogen in `docs/project/25-tasks/done/` staan.
5. `open-points.md` blijft voor gaps, risico's en onzekerheden; het taakoverzicht daarbinnen is afgeleid.
6. Idee vs taak: als flow nog niet bestaat, plugin-ondersteuning ontbreekt, of de scope nog epic-niveau is -> eerst `40-ideas/**` (epic-candidate), pas daarna taakpromotie.
7. Scope-routing is context-first: default-context is Budio app + AIQS; Jarvis/plugin alleen als intentie daar logisch op wijst.
8. Bij classificatietwijfel: hoge-impact eerst afstemmen, lage-impact als expliciete aanname vastleggen.
9. Always-on taskflow is verplicht voor alle inhoudelijke agenttaken (plan/research/bug/implementatie) binnen repo-context.
10. Uitzondering op regel 9: pure chat of simpele read-only vraag zonder uitvoertaak.
11. Elke tussentijdse update en elk eindresultaat vermeldt expliciet:
    - `Task: ...`
    - `Task file: ...`
    - `Status: ...`
12. Een inhoudelijk plan zonder bestaande of nieuw aangemaakte taskfile is onvolledig.
13. Maak bij ontbrekende taskfile eerst de taskfile aan en ga pas daarna verder met plan/research/implementatie.
14. Elk inhoudelijk plan noemt expliciet de concrete taskfile-path.
15. Een automatisch aangemaakte taak komt altijd bovenaan de doel-lane met `sort_order: 1`; herschrijf de overige open taakfiles in die lane doorlopend zodat de sortering opgeslagen blijft.
16. Wanneer een open taak naar `in_progress` gaat, komt die altijd bovenaan de `in_progress` lane; herschrijf `sort_order` in bron- en doellane doorlopend zodat lane-sortering leidend en persistent blijft.

## Standaardflow

1. **Create**
   - Maak nieuwe taken vanuit `docs/project/25-tasks/_template.md`.
   - Voor plan/research geldt dezelfde regel: eerst taskfile, daarna inhoudelijke output.
   - Zet de nieuwe taak direct bovenaan de doel-lane en sla de nieuwe lane-volgorde expliciet op via `sort_order`.
2. **Triage**
   - Kies status, prioriteit en fase.
   - Link terug naar bron in planning of `open-points.md`.
3. **Uitvoering**
   - Zet status direct op `in_progress` wanneer uitvoering start (tenzij al correct).
   - Verplaats de actieve taak direct naar de top van de `in_progress` lane en herschrijf de lane-volgorde expliciet.
   - Werk checklist, blockers en verify-sectie bij.
4. **Done**
   - Zet status op `done`.
   - Verplaats het bestand naar `docs/project/25-tasks/done/`.
5. **Bundle / verify**
   - Draai `npm run taskflow:verify`.
   - Draai `npm run docs:bundle`.
   - Draai `npm run docs:bundle:verify`.

## Agentgebruik

- Lees bij niet-triviale uitvoering eerst `docs/project/open-points.md` en de relevante taskfile.
- Voor "nieuwe taak": maak eerst een taskfile aan.
- Voor verwijzingen in chat: gebruik bij voorkeur de taak `title`, fallback op `id`.

## Valkuilen

- Geen dubbele `title` of `id`.
- Geen `done`-status in `open/`.
- Geen open status in `done/`.
- Gebruik de taaklaag niet als vervanging van `current-status.md`.
- Geen afronding zonder expliciete `Task`/`Task file`/`Status` in updates en eindresultaat.
