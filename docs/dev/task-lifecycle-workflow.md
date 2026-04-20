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

## Standaardflow

1. **Create**
   - Maak nieuwe taken vanuit `docs/project/25-tasks/_template.md`.
2. **Triage**
   - Kies status, prioriteit en fase.
   - Link terug naar bron in planning of `open-points.md`.
3. **Uitvoering**
   - Werk checklist, blockers en verify-sectie bij.
4. **Done**
   - Zet status op `done`.
   - Verplaats het bestand naar `docs/project/25-tasks/done/`.
5. **Bundle / verify**
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
