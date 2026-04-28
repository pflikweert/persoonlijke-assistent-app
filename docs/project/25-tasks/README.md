# Tasks hub

## Doel

Operationele taaklaag voor de huidige fase.
Deze map is bedoeld voor uitvoeringssturing, niet als nieuwe canonieke productwaarheid.

## Workflow

1. Maak een nieuwe taak aan in `docs/project/25-tasks/open/` vanuit `_template.md`.
2. Houd `status`, `updated_at` en checklist actueel tijdens uitvoering.
3. Verplaats een taak pas naar `docs/project/25-tasks/done/` wanneer de status `done` is.
4. Draai daarna `npm run docs:bundle` en `npm run docs:bundle:verify`.

Bij groter samenhangend werk:

- gebruik eventueel een parent epic in `docs/project/24-epics/**`
- tasks blijven de uitvoerlaag, ook wanneer ze aan een epic hangen
- subtasks blijven gewone taskfiles met `task_kind: subtask` en een `parent_task_id`

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

## Lichte hiërarchie

Taskfiles kunnen optioneel deze extra frontmattervelden gebruiken:

- `epic_id` = koppelt de task aan een epic-doc
- `parent_task_id` = maakt van de task een subtask van een andere task
- `depends_on` = lijst met task ids die eerst klaar moeten zijn
- `follows_after` = lijst met task ids waar deze task logisch na komt
- `task_kind` = compacte soort, bijvoorbeeld `task`, `subtask`, `research` of `polish`

Regels:

- parent/child en dependencies zijn niet hetzelfde
- gebruik dependencies voor volgorde/blokkade, niet als vervanging voor subtasks
- laat bestaande vlakke taskfiles ongemoeid als hiërarchie niet nodig is

## Taakindex
<!-- TASK_INDEX:START -->
_Deze index wordt automatisch bijgewerkt door `npm run docs:bundle`._

### Backlog

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [1.2B outputkwaliteit expliciteren en afronden](open/1-2b-outputkwaliteit-expliciteren-en-afronden.md) | p1 | transitiemaand-consumer-beta | Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt. De ta... |
| [Admin/founder meeting capture — fase 1 tests en smokebewijs](open/admin-founder-meeting-capture-fase-1-tests-en-smokebewijs.md) | p1 | transitiemaand-consumer-beta | Er ligt bewijs dat de audio-safe v1 werkt: opname starten/stoppen, reload recovery, upload/retry, overzicht/detail, playback/download en... |
| [Admin/founder meeting capture — lokale failsafe en recovery](open/admin-founder-meeting-capture-lokale-failsafe-en-recovery.md) | p1 | transitiemaand-consumer-beta | Opnamechunks worden tijdens recording lokaal veiliggesteld in IndexedDB. Na reload/crash kan de gebruiker een onafgemaakte opname terugvi... |
| [Admin/founder meeting capture — metadata, private storage en uploadstatus](open/admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus.md) | p1 | transitiemaand-consumer-beta | Er is een minimale DB/storage-fundering voor recordings en uploadstatus. Upload/retry is idempotent genoeg om dubbele recordings te voork... |
| [Admin/founder meeting capture — opname start/stop web MVP](open/admin-founder-meeting-capture-opname-start-stop-web-mvp.md) | p1 | transitiemaand-consumer-beta | Admin kan een opname voorbereiden, starten, timer/status zien, stoppen en bewaren of annuleren met confirm. De flow bevat titel/type/cont... |
| [Admin/founder meeting capture — overzicht/detail met playback en download](open/admin-founder-meeting-capture-overzicht-detail-playback-download.md) | p1 | transitiemaand-consumer-beta | Admin ziet een rustige lijst met recordings en kan een detail openen met audio playback, download, metadata en statusblokken. De UI voelt... |
| [Admin/founder meeting capture — workflow-retro en docs/skill update](open/admin-founder-meeting-capture-workflow-retro-en-docs-skill-update.md) | p1 | transitiemaand-consumer-beta | Na de eerste functionele slice is duidelijk wat beter moet aan AGENTS, taskflow, skills, plugin of docs/dev. Alleen concrete, bewezen ver... |
| [AIQS productie live zetten voor bestaande OpenAI-calls](open/aiqs-productie-live-zetten-bestaande-openai-calls.md) | p1 | transitiemaand-consumer-beta | De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls. Er worden geen nieuwe calls toegevoegd en geen n... |
| [Service-status laag voor Supabase storingen](open/service-status-laag-voor-supabase-storingen.md) | p1 | transitiemaand-consumer-beta | Er staat een minimale v1 service-status laag voor productie op Vercel/Supabase. Een webhook endpoint ontvangt Supabase status-webhooks, s... |
| [Admin/founder meeting capture — admin processing controls](open/admin-founder-meeting-capture-admin-processing-controls.md) | p2 | transitiemaand-consumer-beta | Admin kan upload/transcript/summary processing veilig retryen of rerunnen met duidelijke status en failure feedback. |
| [Admin/founder meeting capture — audio upload/import flow](open/admin-founder-meeting-capture-audio-upload-import-flow.md) | p2 | transitiemaand-consumer-beta | Een admin kan een bestaand audiobestand uploaden naar hetzelfde Meeting Capture archief, met dezelfde metadata, uploadstatus, detailweerg... |
| [Admin/founder meeting capture — gespreksinzichten](open/admin-founder-meeting-capture-gespreksinzichten.md) | p2 | transitiemaand-consumer-beta | Detail toont brongetrouwe inzichten: auto-title, korte samenvatting, kernpunten, besluiten, actiepunten, open vragen en onderwerpen. Fout... |
| [Admin/founder meeting capture — retentie en export hardening](open/admin-founder-meeting-capture-retentie-export-hardening.md) | p2 | transitiemaand-consumer-beta | Meeting Capture heeft een heldere keep-audio/retentievoorbereiding en robuuste download/export flow, zonder de eerste audio-safe v1 te ve... |
| [Admin/founder meeting capture — speaker labels en mapping](open/admin-founder-meeting-capture-speaker-labels-en-mapping.md) | p2 | transitiemaand-consumer-beta | Transcriptdetail ondersteunt eenvoudige speakerlabels en hernoemen/mappen van sprekers zonder transcriptverlies. |
| [Admin/founder meeting capture — transcript pipeline](open/admin-founder-meeting-capture-transcript-pipeline.md) | p2 | transitiemaand-consumer-beta | Een opgeslagen recording kan queued/background worden getranscribeerd. Status, retry en failure zijn zichtbaar op detail. Audio blijft be... |
| [AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)](open/aiqs-admin-interface-thema-herontwerp-spotify-openai-stijl.md) | p2 | transitiemaand-consumer-beta | AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.... |
| [Budio webapp compatible maken](open/budio-webapp-compatible-maken.md) | p2 | transitiemaand-consumer-beta | Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een... |
| [Budio Workspace Command Room research en startpunt vastleggen](open/budio-workspace-command-room-research-en-startpunt-vastleggen.md) | p2 | transitiemaand-consumer-beta | Er staat één nieuw idea/research-document in `docs/project/40-ideas/40-platform-and-architecture/` dat de richting vastlegt voor een Line... |
| [Docs scheiden naar private repo (strategie + migratieplan)](open/docs-private-repo-scheiding-en-migratieplan.md) | p2 | transitiemaand-consumer-beta | Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief... |
| [niet vergeten](open/niet-vergeten.md) | p2 | transitiemaand-consumer-beta | Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is. |
| [npm audit kwetsbaarheden beoordelen en saneren](open/npm-audit-kwetsbaarheden-beoordelen-en-saneren.md) | p2 | transitiemaand-consumer-beta | Er ligt een bron-gebaseerde beoordeling van de npm audit meldingen, inclusief onderscheid tussen: - direct runtime-risico - dev-only/tool... |
| [STITCH_API_KEY voor MCP activeren](open/stitch-api-key-voor-mcp-activeren.md) | p2 | transitiemaand-consumer-beta | De lokale setup bevat een actieve `STITCH_API_KEY` in `.env.local`, zodat Stitch MCP later zonder extra handelingen gebruikt kan worden.... |

### Ready

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Entry photo gallery volledige end-user E2E flows](open/entry-photo-gallery-volledige-end-user-e2e-flows.md) | p1 | transitiemaand-consumer-beta | Er is een volledige Playwright end-user suite voor entry photo gallery flows. De suite gebruikt reproduceerbare local-only seed/cleanup h... |

### In Progress

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [1.2E beta-readiness expliciteren en afronden](open/1-2e-beta-readiness-expliciteren-en-afronden.md) | p1 | transitiemaand-consumer-beta | Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.... |
| [Admin/founder meeting capture — web route en IA](open/admin-founder-meeting-capture-web-route-en-ia.md) | p1 | transitiemaand-consumer-beta | Er is een admin-only ingang naar een Meeting Capture overzicht, een nieuwe-opname route en een detailroute. Niet-admin gebruikers zien de... |
| [AIQS logging valideren in OpenAI dashboard en fallback-logpad](open/aiqs-logging-valideren-openai-dashboard-en-fallback.md) | p1 | transitiemaand-consumer-beta | Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests... |
| [Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering](open/origineel-plan-integriteit-borgen-tijdens-agent-uitvoering.md) | p1 | transitiemaand-consumer-beta | De repo-taskflow borgt voortaan expliciet dat een goedgekeurd oorspronkelijk plan of afgesproken scope tijdens uitvoering stabiel blijft,... |
| [Plan Mode task auto-create bij ontbrekende match](open/plan-mode-task-auto-create-bij-ontbrekende-match.md) | p1 | transitiemaand-consumer-beta | Plan Mode werkt voortaan met een goedkope en consistente preflight: - eerst zoeken naar een passende bestaande task - bij duidelijke matc... |
| [Budio Workspace activity-bar opent list view zonder workspace-menu](open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md) | p2 | transitiemaand-consumer-beta | Klikken op het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in `list` view. De oude `Workspace`-launcher is... |

### Review

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Dark/light mode theming (text + background) zonder refresh fix](open/dark-light-mode-theming-zonder-refresh-fix.md) | p1 | transitiemaand-consumer-beta | Text- en background-kleuren wisselen direct mee bij theme-switch op gedeelde laag (tokens + shared wrappers/components), zonder pagina-re... |

### Blocked

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Moments-overzicht primaire foto thumbnail en viewer](open/moments-overzicht-primaire-foto-thumbnail-en-viewer.md) | p1 | transitiemaand-consumer-beta | In het gedeelde `MomentsTimelineSection` wordt bij aanwezige foto's een compacte primaire thumbnail getoond binnen de bestaande tijdkolom... |
| [Docs folderstructuur en visual language herbeoordelen na metadatafase](open/docs-folderstructuur-en-visual-language-herbeoordeling-na-metadatafase.md) | p3 | transitiemaand-consumer-beta | Na afronding van `docs-ux-audience-taxonomie-en-uploadbundels.md` ligt er een korte, brongebaseerde beoordeling: - Is metadata + bundling... |

### Done

| Taak | Prioriteit | Fase | Korte omschrijving |
| --- | --- | --- | --- |
| [Actieve maandplanning herijkt naar transitiemaand](done/actieve-maandplanning-herijkt-naar-transitiemaand.md) | p1 | transitiemaand-consumer-beta | Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen. |
| [Admin/founder meeting capture — epic en taakpakket aanmaken](done/admin-founder-meeting-capture-epic-en-taakpakket-aanmaken.md) | p1 | transitiemaand-consumer-beta | Er staat één idea-doc, één epic-doc en een volledig P1/P2 taakpakket voor Meeting Capture. De plugin kan deze epic als bundel tonen, met... |
| [Admin/founder meeting capture — scope en eerste versie vastleggen](done/admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen.md) | p1 | transitiemaand-consumer-beta | De scope voor v1 staat scherp: admin/founder-only, audio-safe web recording, buiten dagboekcapture, met transcriptie en insights als late... |
| [Always-on taskflow enforcement (agent-onafhankelijk)](done/always-on-taskflow-enforcement-agent-onafhankelijk.md) | p1 | transitiemaand-consumer-beta | Elke inhoudelijke agentsessie (plan/research/bug/implementatie) loopt automatisch via een taskfile in `docs/project/25-tasks/**`, inclusi... |
| [Audio-instellingen testadvies stabiliseren en mic-selectie polish](done/audio-instellingen-testadvies-stabiliseren-en-mic-selectie-polish.md) | p1 | transitiemaand-consumer-beta | Op het scherm Audio Instellingen is het advies tijdens testen rustiger en gebaseerd op langere sampleperiodes. Het eerste advies komt pas... |
| [Budio Workspace hierarchy met epics, subtasks en dependencies](done/budio-workspace-hierarchy-epics-subtasks-dependencies.md) | p1 | transitiemaand-consumer-beta | De repo krijgt een kleine operationele epic-laag boven `docs/project/25-tasks/**`, plus lichte hiërarchievelden in taskfiles. De plugin k... |
| [Entry photo gallery QA-basis: unit, smoke en end-user tests](done/entry-photo-gallery-qa-basis-unit-smoke-e2e.md) | p1 | transitiemaand-consumer-beta | Er is een eerste QA-basis voor de entry photo gallery: snelle unit-tests voor complexe sorteerlogica, scripts voor gallery smoke/full tes... |
| [GitHub Actions Node 24 hardening en lokale Node-align](done/github-actions-node24-hardening-en-lokale-node-align.md) | p1 | transitiemaand-consumer-beta | GitHub workflows gebruiken actuele Node-24-compatibele action-versies, zodat de tijdelijke warning-constructie niet meer nodig is of mini... |
| [GitHub deployment Node/NPM-versie diagnose](done/github-deployment-node-npm-versie-diagnose.md) | p1 | transitiemaand-consumer-beta | Er ligt een korte diagnose met: - actuele repo Node/NPM-config - actuele GitHub Actions deployment-config - relevante recente GitHub run/... |
| [Hook-fix publicatie en post-push review](done/hook-fix-publicatie-en-post-push-review.md) | p1 | transitiemaand-consumer-beta | Er staat één gerichte commit op `main` met alleen de convergente task-commit-hook fix, de bijbehorende workflowdocs/tests, de verplichte... |
| [Lokale auth smoke workflow hardenen (magic-link + Mailpit)](done/local-auth-smoke-hardening-workflow.md) | p1 | transitiemaand-consumer-beta | Een vaste local-only auth smoke workflow waarmee een agent of developer veilig kan inloggen en daarna end-to-end UI smoke tests kan doen... |
| [Moment detail foto reorder productiebug herstel](done/moment-detail-foto-reorder-productiebug-herstel.md) | p1 | transitiemaand-consumer-beta | Op het moment-detailscherm kan de gebruiker foto's in productie weer betrouwbaar herordenen. Een reorder van positie 2 naar positie 1 gee... |
| [Moment detail foto-upload productieflakiness onderzoeken](done/moment-detail-foto-upload-productieflakiness-onderzoek.md) | p1 | transitiemaand-consumer-beta | Voor moment detail foto-upload is de productieoorzaak bevestigd en hersteld. Een upload met de vaste agent-testaccount werkt betrouwbaar... |
| [Moment detail foto's toevoegen met beveiligde galerij (max 5)](done/moment-entry-fotos-galerij-beveiligde-upload.md) | p1 | transitiemaand-consumer-beta | Een compacte fotoflow op moment detail met maximaal 5 foto's per moment. Als er nog geen foto's zijn toont de UI een rustige empty state... |
| [Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen](done/moment-fotoviewer-swipe-zoom-en-markdown-weergave.md) | p1 | transitiemaand-consumer-beta | De fotoviewer voelt op mobiel beheerst en direct aan: per swipe land je op de bedoelde vorige of volgende foto, en ingezoomde foto's kun... |
| [Plan/spec quality guardrails voor ideas, epics en tasks](done/plan-spec-quality-guardrails-voor-ideas-epics-en-tasks.md) | p1 | transitiemaand-consumer-beta | Toekomstige agents maken standaard ideas, researchdocs, epics, tasks en subtasks aan die zelfstandig bruikbaar zijn. Nieuwe uitvoerbare t... |
| [Plugin drag-drop sortering in board en list herstellen](done/plugin-drag-drop-sortering-board-en-list-herstel.md) | p1 | transitiemaand-consumer-beta | Taken moeten weer met de muis versleept kunnen worden in board én list view, inclusief statusverplaatsing en herordening. |
| [Post-commit taskfile-loop voorkomen zonder commitlogging te verliezen](done/post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen.md) | p1 | transitiemaand-consumer-beta | Automatische taskfile commitlogging blijft bestaan, maar gebruikt voortaan een stabiele entry zonder commit-hash. De hook mag taskfiles a... |
| [Thumbnail reorder productiebug in moment detail](done/thumbnail-reorder-productiebug-moment-detail.md) | p1 | transitiemaand-consumer-beta | De galerij-reorder werkt in productie vloeiend en betrouwbaar: tijdens slepen beweegt de actieve thumbnail correct mee en blijft niet vas... |
| [Dev-browser configureerbaar voor local web](done/dev-browser-configureerbaar-voor-local-web.md) | p2 | transitiemaand-consumer-beta | `npm run dev` blijft standaard hetzelfde werken wanneer er geen browser-env is gezet. Als `BUDIO_DEV_BROWSER` lokaal is gezet, gebruikt d... |
| [Docs UX, audience-metadata en uploadbundels opschonen](done/docs-ux-audience-taxonomie-en-uploadbundels.md) | p2 | transitiemaand-consumer-beta | De docs krijgen een kleine metadata- en visuele laag die duidelijk maakt voor wie een document bedoeld is en hoe het gebruikt moet worden... |
| [docs:bundle en docs:bundle:verify race condition structureel voorkomen](done/docs-bundle-en-verify-race-condition-voorkomen.md) | p2 | transitiemaand-consumer-beta | Parallelle bundelruns worden hard geblokkeerd met een duidelijke foutmelding. Daardoor kan `docs:bundle:verify` niet meer vals falen door... |
| [HME-ME research fase 1: local data en downloader spike](done/hme-me-research-fase-1-local-data-en-downloader-spike.md) | p2 | transitiemaand-consumer-beta | Fase 1 levert een veilige repo- en toolingbasis op: - het aangeleverde researchplan staat als persoonlijk idea/researchdocument in `docs/... |
| [Linear-geinspireerde Budio Workspace structuurlaag als idee uitwerken](done/linear-budio-workspace-structuurlaag-idee-uitwerken.md) | p2 | transitiemaand-consumer-beta | Er staat een nieuw standalone idea-file in `docs/project/40-ideas/40-platform-and-architecture/` dat Linear niet bewondert om de hype, ma... |
| [Lokale developmentomgeving nieuwe MacBook opzetten](done/lokale-developmentomgeving-nieuwe-macbook-opzetten.md) | p2 | transitiemaand-consumer-beta | De lokale omgeving kan betrouwbaar worden gebruikt voor Budio app-ontwikkeling zonder productie-secrets in clientcode of remote mutaties.... |
| [Lokale wijzigingen committen en pushen](done/lokale-wijzigingen-committen-en-pushen.md) | p2 | transitiemaand-consumer-beta | Alle huidige lokale wijzigingen staan in een nieuwe commit op de actieve branch en zijn gepusht naar `origin`. De repo-taskflow blijft da... |
| [OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën](done/openai-codex-automations-en-ai-use-case-scaling-vertalen-naar-ideeen.md) | p2 | transitiemaand-consumer-beta | Minstens één bestaand idee in `docs/project/40-ideas/**` is bijgewerkt (of een nieuw idee is toegevoegd) met concrete, afgebakende learni... |
| [OpenAI Privacy Filter-idee vertalen naar Budio privacyplan](done/openai-privacy-filter-idee-vertalen-naar-budio-privacyplan.md) | p2 | transitiemaand-consumer-beta | Een bestaand privacy/security-idee in `docs/project/40-ideas/**` is bijgewerkt met de belangrijkste lessen uit de OpenAI Privacy Filter r... |
| [Plugin task classification filters en manual prio actions](done/plugin-task-classification-filters-en-manual-prio-actions.md) | p2 | transitiemaand-consumer-beta | Taskfiles krijgen een expliciete classificatie in template en instructies. De plugin toont deze classificatie zichtbaar in cards en list... |
| [Plugin task overview line en detail hero sticky fix](done/plugin-task-overview-line-en-detail-hero-sticky-fix.md) | p2 | transitiemaand-consumer-beta | De list-rij toont de accentlijn stabiel links naast titel + description (niet erboven). In task detail blijft de header/hero zichtbaar ti... |
| [Programmeer-architectuur guardrails, helper-extractie en refactorbeleid](done/programmeer-architectuur-guardrails-helper-extractie-en-refactorbeleid.md) | p2 | transitiemaand-consumer-beta | Er is een compacte programmeer-architectuur skill die agents helpt om bij complexe code vaker goede helperfiles/hooks te maken, zonder sc... |
| [Repo-local Codex MCP documentatie en agent-defaults voor local AI development](done/repo-local-codex-mcp-documentatie-en-agent-defaults.md) | p2 | transitiemaand-consumer-beta | Docs en AGENTS beschrijven compact en eenduidig: - default gebruik van `supabase_local` - wanneer `supabase_remote_ro` wel gebruikt mag w... |
| [Repo-local Codex MCP setup met veilige Supabase target-switchflow](done/repo-local-codex-mcp-setup-met-veilige-supabase-target-switchflow.md) | p2 | transitiemaand-consumer-beta | De repo bevat één begrijpelijke `.codex/config.toml` met vaste MCP-servers voor context7, playwright en stitch, plus een Supabase-opzet w... |
| [Roadmap OS en post-basis 6-maandenroadmap](done/roadmap-os-en-post-basis-6-maandenroadmap.md) | p2 | transitiemaand-consumer-beta | Er staat een kleine Roadmap OS-laag voor maandblokken op epicniveau. Iemand die het project niet kent, moet kunnen begrijpen waarom een m... |
| [Upload bundles uitbreiden met volledige tasks en apart full archive](done/upload-bundles-volledige-tasks-en-archive.md) | p2 | transitiemaand-consumer-beta | `docs/upload/**` bevat twee nieuwe generated bestanden: - één volledige tasks bundle met zowel `open/` als `done/` taskfiles - één aparte... |
| [VS Code MCP local workspace setup](done/vscode-mcp-local-workspace-setup.md) | p2 | transitiemaand-consumer-beta | VS Code is ingericht voor Expo, Markdown/taskfiles, NativeWind, Playwright en Budio Workspace. De repo blijft local-first werken met `npx... |
| [Workstream backfill voor bestaande taskfiles](done/workstream-backfill-bestaande-taskfiles.md) | p2 | transitiemaand-consumer-beta | Alle bestaande taskfiles onder `docs/project/25-tasks/**` hebben een passende `workstream`-waarde (`idea`, `plugin`, `app` of `aiqs`). |
<!-- TASK_INDEX:END -->
