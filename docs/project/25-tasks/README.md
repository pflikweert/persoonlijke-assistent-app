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

## Task-classificatie (workstream)

Gebruik in task frontmatter het veld `workstream` met één van deze waarden:

- `idea` = idee-/conceptwerk
- `plugin` = Budio Workspace (VS Code plugin)
- `app` = Budio App
- `aiqs` = AI Quality Studio

Doel: eenduidige routing en filterbaarheid in de plugin (board + list).

## Taakindex
<!-- TASK_INDEX:START -->
_Deze index wordt automatisch bijgewerkt door `npm run docs:bundle`._

### Backlog

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [1.2B outputkwaliteit expliciteren en afronden](open/1-2b-outputkwaliteit-expliciteren-en-afronden.md) | p1 | transitiemaand-consumer-beta | Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt. De ta... |
| [AIQS productie live zetten voor bestaande OpenAI-calls](open/aiqs-productie-live-zetten-bestaande-openai-calls.md) | p1 | transitiemaand-consumer-beta | De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls. Er worden geen nieuwe calls toegevoegd en geen n... |
| [AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)](open/aiqs-admin-interface-thema-herontwerp-spotify-openai-stijl.md) | p2 | transitiemaand-consumer-beta | AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.... |
| [Budio webapp compatible maken](open/budio-webapp-compatible-maken.md) | p2 | transitiemaand-consumer-beta | Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een... |
| [Docs scheiden naar private repo (strategie + migratieplan)](open/docs-private-repo-scheiding-en-migratieplan.md) | p2 | transitiemaand-consumer-beta | Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief... |
| [niet vergeten](open/niet-vergeten.md) | p2 | transitiemaand-consumer-beta | Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is. |

### Ready

_Geen taken._

### In Progress

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [1.2E beta-readiness expliciteren en afronden](open/1-2e-beta-readiness-expliciteren-en-afronden.md) | p1 | transitiemaand-consumer-beta | Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.... |
| [AIQS logging valideren in OpenAI dashboard en fallback-logpad](open/aiqs-logging-valideren-openai-dashboard-en-fallback.md) | p1 | transitiemaand-consumer-beta | Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests... |
| [Moment detail foto reorder + thumbnail-logica en audio test auto-stop](open/moment-detail-foto-reorder-en-audio-test-auto-stop.md) | p1 | transitiemaand-consumer-beta | Op het moment-detailscherm kan de gebruiker een foto lang indrukken en intuïtief naar een andere positie slepen. Tijdens het slepen is du... |

### Blocked

_Geen taken._

### Done

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Actieve maandplanning herijkt naar transitiemaand](done/actieve-maandplanning-herijkt-naar-transitiemaand.md) | p1 | transitiemaand-consumer-beta | Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen. |
| [Always-on taskflow enforcement (agent-onafhankelijk)](done/always-on-taskflow-enforcement-agent-onafhankelijk.md) | p1 | transitiemaand-consumer-beta | Elke inhoudelijke agentsessie (plan/research/bug/implementatie) loopt automatisch via een taskfile in `docs/project/25-tasks/**`, inclusi... |
| [Audio-instellingen testadvies stabiliseren en mic-selectie polish](done/audio-instellingen-testadvies-stabiliseren-en-mic-selectie-polish.md) | p1 | transitiemaand-consumer-beta | Op het scherm Audio Instellingen is het advies tijdens testen rustiger en gebaseerd op langere sampleperiodes. Het eerste advies komt pas... |
| [Lokale auth smoke workflow hardenen (magic-link + Mailpit)](done/local-auth-smoke-hardening-workflow.md) | p1 | transitiemaand-consumer-beta | Een vaste local-only auth smoke workflow waarmee een agent of developer veilig kan inloggen en daarna end-to-end UI smoke tests kan doen... |
| [Moment detail foto's toevoegen met beveiligde galerij (max 5)](done/moment-entry-fotos-galerij-beveiligde-upload.md) | p1 | transitiemaand-consumer-beta | Een compacte fotoflow op moment detail met maximaal 5 foto's per moment. Als er nog geen foto's zijn toont de UI een rustige empty state... |
| [Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen](done/moment-fotoviewer-swipe-zoom-en-markdown-weergave.md) | p1 | transitiemaand-consumer-beta | De fotoviewer voelt op mobiel beheerst en direct aan: per swipe land je op de bedoelde vorige of volgende foto, en ingezoomde foto's kun... |
| [Plugin drag-drop sortering in board en list herstellen](done/plugin-drag-drop-sortering-board-en-list-herstel.md) | p1 | transitiemaand-consumer-beta | Taken moeten weer met de muis versleept kunnen worden in board én list view, inclusief statusverplaatsing en herordening. |
| [Plugin task classification filters en manual prio actions](done/plugin-task-classification-filters-en-manual-prio-actions.md) | p2 | transitiemaand-consumer-beta | Taskfiles krijgen een expliciete classificatie in template en instructies. De plugin toont deze classificatie zichtbaar in cards en list... |
| [Plugin task overview line en detail hero sticky fix](done/plugin-task-overview-line-en-detail-hero-sticky-fix.md) | p2 | transitiemaand-consumer-beta | De list-rij toont de accentlijn stabiel links naast titel + description (niet erboven). In task detail blijft de header/hero zichtbaar ti... |
| [Workstream backfill voor bestaande taskfiles](done/workstream-backfill-bestaande-taskfiles.md) | p2 | transitiemaand-consumer-beta | Alle bestaande taskfiles onder `docs/project/25-tasks/**` hebben een passende `workstream`-waarde (`idea`, `plugin`, `app` of `aiqs`). |
<!-- TASK_INDEX:END -->
