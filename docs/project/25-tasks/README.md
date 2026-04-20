# Tasks hub

## Doel

Operationele taaklaag voor de huidige fase.
Deze map is bedoeld voor uitvoeringssturing, niet als nieuwe canonieke productwaarheid.

## Workflow

1. Maak een nieuwe taak aan in `docs/project/25-tasks/open/` vanuit `_template.md`.
2. Houd `status`, `updated_at` en checklist actueel tijdens uitvoering.
3. Verplaats een taak pas naar `docs/project/25-tasks/done/` wanneer de status `done` is.
4. Draai daarna `npm run docs:bundle` en `npm run docs:bundle:verify`.

## Statusmodel

- `backlog`
- `ready`
- `in_progress`
- `blocked`
- `done`

## Taakindex
<!-- TASK_INDEX:START -->
_Deze index wordt automatisch bijgewerkt door `npm run docs:bundle`._

### Backlog

_Geen taken._

### Ready

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [1.2B outputkwaliteit expliciteren en afronden](open/1-2b-outputkwaliteit-expliciteren-en-afronden.md) | p1 | transitiemaand-consumer-beta | Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt. De ta... |

### In Progress

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [1.2E beta-readiness expliciteren en afronden](open/1-2e-beta-readiness-expliciteren-en-afronden.md) | p1 | transitiemaand-consumer-beta | Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.... |

### Blocked

_Geen taken._

### Done

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Actieve maandplanning herijkt naar transitiemaand](done/actieve-maandplanning-herijkt-naar-transitiemaand.md) | p1 | transitiemaand-consumer-beta | Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen. |
<!-- TASK_INDEX:END -->
