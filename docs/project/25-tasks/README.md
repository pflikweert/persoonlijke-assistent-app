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
- `review`
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
| [npm audit kwetsbaarheden beoordelen en saneren](open/npm-audit-kwetsbaarheden-beoordelen-en-saneren.md) | p2 | transitiemaand-consumer-beta | Er ligt een bron-gebaseerde beoordeling van de npm audit meldingen, inclusief onderscheid tussen: - direct runtime-risico - dev-only/tool... |

### Ready

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Entry photo gallery volledige end-user E2E flows](open/entry-photo-gallery-volledige-end-user-e2e-flows.md) | p1 | transitiemaand-consumer-beta | Er is een volledige Playwright end-user suite voor entry photo gallery flows. De suite gebruikt reproduceerbare local-only seed/cleanup h... |
| [Moment detail foto-upload productieflakiness onderzoeken](open/moment-detail-foto-upload-productieflakiness-onderzoek.md) | p1 | transitiemaand-consumer-beta | Voor moment detail foto-upload is de productieoorzaak bevestigd en hersteld. Een upload met de vaste agent-testaccount werkt betrouwbaar... |

### In Progress

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [1.2E beta-readiness expliciteren en afronden](open/1-2e-beta-readiness-expliciteren-en-afronden.md) | p1 | transitiemaand-consumer-beta | Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.... |
| [AIQS logging valideren in OpenAI dashboard en fallback-logpad](open/aiqs-logging-valideren-openai-dashboard-en-fallback.md) | p1 | transitiemaand-consumer-beta | Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests... |
| [Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering](open/origineel-plan-integriteit-borgen-tijdens-agent-uitvoering.md) | p1 | transitiemaand-consumer-beta | De repo-taskflow borgt voortaan expliciet dat een goedgekeurd oorspronkelijk plan of afgesproken scope tijdens uitvoering stabiel blijft,... |
| [Plan Mode task auto-create bij ontbrekende match](open/plan-mode-task-auto-create-bij-ontbrekende-match.md) | p1 | transitiemaand-consumer-beta | Plan Mode werkt voortaan met een goedkope en consistente preflight: - eerst zoeken naar een passende bestaande task - bij duidelijke matc... |
| [Budio Workspace activity-bar opent list view zonder workspace-menu](open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md) | p2 | transitiemaand-consumer-beta | Klikken op het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in `list` view. De oude `Workspace`-launcher is... |

### Review

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Moments-overzicht primaire foto thumbnail en viewer](open/moments-overzicht-primaire-foto-thumbnail-en-viewer.md) | p1 | transitiemaand-consumer-beta | In het gedeelde `MomentsTimelineSection` wordt bij aanwezige foto's een compacte primaire thumbnail getoond binnen de bestaande tijdkolom... |

### Blocked

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Docs folderstructuur en visual language herbeoordelen na metadatafase](open/docs-folderstructuur-en-visual-language-herbeoordeling-na-metadatafase.md) | p3 | transitiemaand-consumer-beta | Na afronding van `docs-ux-audience-taxonomie-en-uploadbundels.md` ligt er een korte, brongebaseerde beoordeling: - Is metadata + bundling... |

### Done

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Actieve maandplanning herijkt naar transitiemaand](done/actieve-maandplanning-herijkt-naar-transitiemaand.md) | p1 | transitiemaand-consumer-beta | Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen. |
| [Always-on taskflow enforcement (agent-onafhankelijk)](done/always-on-taskflow-enforcement-agent-onafhankelijk.md) | p1 | transitiemaand-consumer-beta | Elke inhoudelijke agentsessie (plan/research/bug/implementatie) loopt automatisch via een taskfile in `docs/project/25-tasks/**`, inclusi... |
| [Audio-instellingen testadvies stabiliseren en mic-selectie polish](done/audio-instellingen-testadvies-stabiliseren-en-mic-selectie-polish.md) | p1 | transitiemaand-consumer-beta | Op het scherm Audio Instellingen is het advies tijdens testen rustiger en gebaseerd op langere sampleperiodes. Het eerste advies komt pas... |
| [Entry photo gallery QA-basis: unit, smoke en end-user tests](done/entry-photo-gallery-qa-basis-unit-smoke-e2e.md) | p1 | transitiemaand-consumer-beta | Er is een eerste QA-basis voor de entry photo gallery: snelle unit-tests voor complexe sorteerlogica, scripts voor gallery smoke/full tes... |
| [GitHub Actions Node 24 hardening en lokale Node-align](done/github-actions-node24-hardening-en-lokale-node-align.md) | p1 | transitiemaand-consumer-beta | GitHub workflows gebruiken actuele Node-24-compatibele action-versies, zodat de tijdelijke warning-constructie niet meer nodig is of mini... |
| [GitHub deployment Node/NPM-versie diagnose](done/github-deployment-node-npm-versie-diagnose.md) | p1 | transitiemaand-consumer-beta | Er ligt een korte diagnose met: - actuele repo Node/NPM-config - actuele GitHub Actions deployment-config - relevante recente GitHub run/... |
| [Lokale auth smoke workflow hardenen (magic-link + Mailpit)](done/local-auth-smoke-hardening-workflow.md) | p1 | transitiemaand-consumer-beta | Een vaste local-only auth smoke workflow waarmee een agent of developer veilig kan inloggen en daarna end-to-end UI smoke tests kan doen... |
| [Moment detail foto reorder productiebug herstel](done/moment-detail-foto-reorder-productiebug-herstel.md) | p1 | transitiemaand-consumer-beta | Op het moment-detailscherm kan de gebruiker foto's in productie weer betrouwbaar herordenen. Een reorder van positie 2 naar positie 1 gee... |
| [Moment detail foto's toevoegen met beveiligde galerij (max 5)](done/moment-entry-fotos-galerij-beveiligde-upload.md) | p1 | transitiemaand-consumer-beta | Een compacte fotoflow op moment detail met maximaal 5 foto's per moment. Als er nog geen foto's zijn toont de UI een rustige empty state... |
| [Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen](done/moment-fotoviewer-swipe-zoom-en-markdown-weergave.md) | p1 | transitiemaand-consumer-beta | De fotoviewer voelt op mobiel beheerst en direct aan: per swipe land je op de bedoelde vorige of volgende foto, en ingezoomde foto's kun... |
| [Plugin drag-drop sortering in board en list herstellen](done/plugin-drag-drop-sortering-board-en-list-herstel.md) | p1 | transitiemaand-consumer-beta | Taken moeten weer met de muis versleept kunnen worden in board én list view, inclusief statusverplaatsing en herordening. |
| [Thumbnail reorder productiebug in moment detail](done/thumbnail-reorder-productiebug-moment-detail.md) | p1 | transitiemaand-consumer-beta | De galerij-reorder werkt in productie vloeiend en betrouwbaar: tijdens slepen beweegt de actieve thumbnail correct mee en blijft niet vas... |
| [Docs UX, audience-metadata en uploadbundels opschonen](done/docs-ux-audience-taxonomie-en-uploadbundels.md) | p2 | transitiemaand-consumer-beta | De docs krijgen een kleine metadata- en visuele laag die duidelijk maakt voor wie een document bedoeld is en hoe het gebruikt moet worden... |
| [docs:bundle en docs:bundle:verify race condition structureel voorkomen](done/docs-bundle-en-verify-race-condition-voorkomen.md) | p2 | transitiemaand-consumer-beta | Parallelle bundelruns worden hard geblokkeerd met een duidelijke foutmelding. Daardoor kan `docs:bundle:verify` niet meer vals falen door... |
| [Linear-geinspireerde Budio Workspace structuurlaag als idee uitwerken](done/linear-budio-workspace-structuurlaag-idee-uitwerken.md) | p2 | transitiemaand-consumer-beta | Er staat een nieuw standalone idea-file in `docs/project/40-ideas/40-platform-and-architecture/` dat Linear niet bewondert om de hype, ma... |
| [OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën](done/openai-codex-automations-en-ai-use-case-scaling-vertalen-naar-ideeen.md) | p2 | transitiemaand-consumer-beta | Minstens één bestaand idee in `docs/project/40-ideas/**` is bijgewerkt (of een nieuw idee is toegevoegd) met concrete, afgebakende learni... |
| [OpenAI Privacy Filter-idee vertalen naar Budio privacyplan](done/openai-privacy-filter-idee-vertalen-naar-budio-privacyplan.md) | p2 | transitiemaand-consumer-beta | Een bestaand privacy/security-idee in `docs/project/40-ideas/**` is bijgewerkt met de belangrijkste lessen uit de OpenAI Privacy Filter r... |
| [Plugin task classification filters en manual prio actions](done/plugin-task-classification-filters-en-manual-prio-actions.md) | p2 | transitiemaand-consumer-beta | Taskfiles krijgen een expliciete classificatie in template en instructies. De plugin toont deze classificatie zichtbaar in cards en list... |
| [Plugin task overview line en detail hero sticky fix](done/plugin-task-overview-line-en-detail-hero-sticky-fix.md) | p2 | transitiemaand-consumer-beta | De list-rij toont de accentlijn stabiel links naast titel + description (niet erboven). In task detail blijft de header/hero zichtbaar ti... |
| [Programmeer-architectuur guardrails, helper-extractie en refactorbeleid](done/programmeer-architectuur-guardrails-helper-extractie-en-refactorbeleid.md) | p2 | transitiemaand-consumer-beta | Er is een compacte programmeer-architectuur skill die agents helpt om bij complexe code vaker goede helperfiles/hooks te maken, zonder sc... |
| [Repo-local Codex MCP documentatie en agent-defaults voor local AI development](done/repo-local-codex-mcp-documentatie-en-agent-defaults.md) | p2 | transitiemaand-consumer-beta | Docs en AGENTS beschrijven compact en eenduidig: - default gebruik van `supabase_local` - wanneer `supabase_remote_ro` wel gebruikt mag w... |
| [Repo-local Codex MCP setup met veilige Supabase target-switchflow](done/repo-local-codex-mcp-setup-met-veilige-supabase-target-switchflow.md) | p2 | transitiemaand-consumer-beta | De repo bevat één begrijpelijke `.codex/config.toml` met vaste MCP-servers voor context7, playwright en stitch, plus een Supabase-opzet w... |
| [Roadmap OS en post-basis 6-maandenroadmap](done/roadmap-os-en-post-basis-6-maandenroadmap.md) | p2 | transitiemaand-consumer-beta | Er staat een kleine Roadmap OS-laag voor maandblokken op epicniveau. Iemand die het project niet kent, moet kunnen begrijpen waarom een m... |
| [Upload bundles uitbreiden met volledige tasks en apart full archive](done/upload-bundles-volledige-tasks-en-archive.md) | p2 | transitiemaand-consumer-beta | `docs/upload/**` bevat twee nieuwe generated bestanden: - één volledige tasks bundle met zowel `open/` als `done/` taskfiles - één aparte... |
| [Workstream backfill voor bestaande taskfiles](done/workstream-backfill-bestaande-taskfiles.md) | p2 | transitiemaand-consumer-beta | Alle bestaande taskfiles onder `docs/project/25-tasks/**` hebben een passende `workstream`-waarde (`idea`, `plugin`, `app` of `aiqs`). |
<!-- TASK_INDEX:END -->
