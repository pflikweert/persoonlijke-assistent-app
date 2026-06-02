---
id: task-mvp-admin-aiqs-productie-bundel
title: MVP admin + AIQS productie bundel
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-06-02
summary: "Bundelt AIQS logging-validatie, AIQS productie-livegang en een nieuwe DB-gedreven adminrechtenlaag per admingebied, zodat de bestaande admin-AI-flow snel en veilig naar productie kan."
tags: [aiqs, admin, productie, permissions, supabase]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---



# MVP admin + AIQS productie bundel

## Probleem / context

De bestaande AIQS-adminflow is functioneel aanwezig, maar live bewijs en operationele logging zijn nog niet hard genoeg afgerond voor snelle productie-inzet. Tegelijk ontbreekt self-service beheer van adminrechten volledig in de product-UI: toegang is nu nog verspreid over allowlists in edge functions en losse access-checks in de app.

## Gewenste uitkomst

De bestaande AIQS-flow is aantoonbaar traceerbaar en inzetbaar voor productiegebruik van de huidige OpenAI-calls, zonder featureverbreding. Logging is voor live testen begrijpelijk en zichtbaar, met een werkend fallback-logpad.

Daarnaast heeft het adminmenu een founder-only beheerroute voor rechten per admingebied. Adminrechten worden primair DB-gedreven in plaats van env-allowlist-gedreven, zodat toegang per gebied beheersbaar is via het product zelf.

## User outcome

Een founder kan in de admin-UI live AIQS testen, logging begrijpen, bestaande AIQS-calls veilig in productie gebruiken en adminrechten per gebied beheren zonder handmatige env-wijzigingen.

## Functional slice

Eén afgeronde admin-slice die drie direct gekoppelde uitkomsten levert:

1. duidelijke AIQS logging-controls en aantoonbaar loggingbewijs
2. een betrouwbaar productiepad voor de bestaande AIQS OpenAI-calls
3. founder-only beheer van adminrechten per capability in het adminmenu

## Entry / exit

- Entry: founder opent `Instellingen` en gebruikt de bestaande adminroutes voor AIQS/regeneration/meeting capture.
- Exit: founder kan productie-AIQS gebruiken met zichtbare loggingstatus en kan rechten per gebied toekennen of intrekken via een nieuwe beheerroute.

## Happy flow

1. Founder opent AIQS admin en ziet duidelijke loggingstatus met aan/uit-state en 4-uurs verloop.
2. Founder voert een bestaande AIQS-test/live-flow uit en kan dezelfde run terugvinden via dashboardlogging en fallback-logging.
3. Founder opent rechtenbeheer, kent een capability toe aan een gebruiker en ziet dat alleen het bijbehorende admingebied zichtbaar en bruikbaar wordt.

## Non-happy flows

- Empty state: rechtenbeheer toont een duidelijke lege staat wanneer nog geen aanvullende admins zijn geconfigureerd.
- Permission denied / unavailable: niet-admin of gewone admin ziet de beheerroute niet en krijgt server-side denial bij directe calls.
- Validation / unsupported state: gebruiker kan niet zonder geldige capability of zonder founder-recht mutaties doen.
- Failure / retry / cancel: opslaan van rechten of logginginstellingen toont een duidelijke fout en laat veilig opnieuw proberen toe.

## UX / copy

- Hergebruik bestaande settings-scaffold en admin-shell patronen.
- Nieuwe beheerroute onder label `Adminrechten beheren`.
- Rechtenlabels minimaal: `AI Quality Studio`, `Data opnieuw verwerken`, `Gespreksopnames`.
- Founder-only helpertekst maakt expliciet dat alleen founders rechten kunnen wijzigen.
- Logging-UI noemt expliciet of logging actief is en wanneer deze automatisch vervalt.

## Data / IO

- Input:
  - authenticated user session
  - founder beheeracties voor capability grants
  - logging on/off + TTL-instellingen
- Output:
  - capability-based access per user
  - duidelijke admin-visibility in settings
  - loggingstatus en traceerbare runs
- Opslag/API/service/file-impact:
  - nieuwe Supabase-tabel(len) voor admin capability grants
  - gedeelde server-side authorisatiehelper
  - updates aan admin edge functions en client services
  - nieuwe admin settings-route voor rechtenbeheer
- Statussen:
  - access granted / denied
  - founder-only mutate allowed / denied
  - logging enabled / disabled / expires_at

## Waarom nu

- Dit is de kortste route naar een bruikbare productie-adminflow voor AIQS.
- Het voorkomt dat productievalidatie afhankelijk blijft van handmatige env-toegangswijzigingen.
- Het houdt de scope scherp: bestaande AIQS-calls live krijgen en alleen de minimaal nodige adminrechtenlaag toevoegen.

## In scope

- AIQS loggingstatus en toggle-UX verduidelijken.
- Logging in OpenAI dashboard en fallback-logpad valideren en waar nodig repareren.
- Productieroute voor bestaande AIQS-calls valideren en blocker-fixes doen.
- DB-gedreven admin capability model invoeren voor `ai_quality_studio`, `regeneration` en `meeting_capture`.
- Founder-only beheerroute in settings toevoegen voor rechtenbeheer.
- Bestaande access-checks centraliseren via gedeelde helpers en functie-auth.

## Buiten scope

- Nieuwe AI-taken of verbreding van AIQS naar extra workflows.
- Volledige RBAC met rolleneditor of policy-builder.
- End-user features buiten admin.
- Grote control-plane verbouwing of nieuwe observability-suite.

## Oorspronkelijk plan / afgesproken scope

- Slice 1: AIQS logging valideren in OpenAI dashboard en fallback-logpad.
- Slice 2: AIQS productie live zetten voor bestaande OpenAI-calls.
- Slice 3: nieuwe P1-taak voor self-service adminrechten per admingebied via adminmenu.
- Rechtenmodel blijft capability-based per admingebied, niet volledige RBAC.
- Rechtenbeheer is founder-only.
- DB wordt primaire waarheid voor adminrechten; meeting capture krijgt een eigen capability in plaats van impliciete OR-toegang.

## Expliciete user requirements / detailbehoud

- Logging-toggle en 4-uurs status in AIQS admin moeten duidelijker worden voor live testen.
- Bestaande AIQS OpenAI-calls moeten aantoonbaar zichtbaar zijn in dashboardlogging en fallback-logging.
- Productiepad van bestaande AIQS-calls moet werken zonder nieuwe reviewflow of extra calls.
- Adminrechten moeten via het adminmenu beheerbaar worden.
- Minimaal drie capabilities: `ai_quality_studio`, `regeneration`, `meeting_capture`.
- Founder/super-admin mag rechten toekennen of intrekken; gewone admins niet.
- Niet-admin ziet geen beheerroute.
- Backend denial moet ook werken zonder UI, bij directe function calls.

## Status per requirement

- [x] Loggingstatus en 4-uurs UX verduidelijkt — status: gebouwd
- [ ] Dashboardlogging + fallback-logging aantoonbaar werkend — status: nog niet gebouwd
- [ ] Bestaande AIQS-calls productieproof gemaakt — status: gedeeltelijk gebouwd
- [x] DB-gedreven capabilities voor drie admingebieden toegevoegd — status: gebouwd
- [x] Founder-only adminrechtenbeheer in adminmenu toegevoegd — status: gebouwd
- [x] Backend authorisatie centraal en capability-based gemaakt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Founder-bootstrap migreert automatisch éénmalig vanuit legacy allowlists naar DB-grants, zodat bestaande admin-toegang niet stilvalt tijdens de overgang.
- Meeting Capture gebruikt nu een eigen capability in plaats van impliciete toegang via AIQS of regeneration.
- Lokale OpenAI debug-opslag gebruikt weer persistente private storage; een Postgres RPC-conflict op `id` is opgelost via follow-up migratie.
- Lokale edge-functions restart is gehard; detached startup van `supabase functions serve` wordt nu gevalideerd zodat adminroutes niet stil uitvallen na een lokale restart.
- Admin capability-RPC is collision-proof gemaakt; een Postgres ambiguity op `capability` in `admin_replace_user_capabilities` is lokaal opgelost via follow-up migraties.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, codecontext en huidige admin/logging-architectuur bevestigen.
- [x] Blok 2: logging- en productiepad voor AIQS aanscherpen.
- [x] Blok 3: capability-model, backend authorisatie en adminrechten-UI bouwen.
- [ ] Blok 4: verify, task/docs-sync en afronding.

## Concrete checklist

- [x] Huidige logging- en rights-flows in code inventariseren.
- [x] Logging-UX en runtimepad repareren waar nodig.
- [x] Supabase capability-model en authorisatiehelpers toevoegen.
- [x] Adminrechtenbeheerroute in settings bouwen.
- [x] Access-checks en adminroutes migreren naar capability-based gedrag.
- [x] Verifies en task/docs-sync uitvoeren.

## Acceptance criteria

- [ ] Founder ziet duidelijke loggingstatus en kan bestaande AIQS-calls traceerbaar testen.
- [ ] Bestaande AIQS productieflow werkt voor huidige calls en blijft geblokkeerd voor non-admins.
- [ ] Founder kan per gebruiker rechten voor AIQS, regeneration en meeting capture toekennen of intrekken.
- [ ] Users zien alleen de adminroutes waarvoor ze capability-toegang hebben.
- [ ] Gewone admins kunnen geen rechten van anderen beheren.
- [ ] Directe backend-calls zonder juiste capability of founder-recht falen expliciet.

## Blockers / afhankelijkheden

- Productievalidatie in OpenAI dashboard vereist handmatige runtimecheck buiten alleen lokale codecontrole.
- Founder-bootstrap moet veilig worden gemigreerd zonder bestaande admin-toegang kwijt te raken.

## Verify / bewijs

- Runtime-validatie van logging aan/uit en zichtbare TTL-status.
- Bewijs van dashboardlogging + fallback-logpad voor bestaande AIQS-calls.
- Lokale debug-opslag RPC werkt weer persistent zonder `ephemeral_fallback`.
- Lokale edge-functions detached startup blijft actief na restart en geeft weer responses op admin edge routes.
- Adminrechtenbeheer geeft lokaal geen `column reference "capability" is ambiguous` meer bij capability-mutations.
- Rechten-smoke: founder grant/revoke, beperkte admin, non-admin denial.
- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: logging valideren, AIQS productie live zetten en founder-only capabilitybeheer bouwen.
- Toegevoegde verbeteringen: éénmalige founder-bootstrap vanuit legacy allowlists, aparte capability voor Meeting Capture, lokale debug-opslagfix voor persistente AIQS logging-settings, geharde lokale edge-functions restart voor adminroutes en een expliciete capability-RPC ambiguity-fix voor adminrechtenmutaties.
- Afgerond: DB-capabilitymodel, founder-only rightsbeheer, centrale authorisatie, settings-menu migratie, logging-UX aanscherping, lint/typecheck/unit-test/taskflow/docs-verifies, lokale fix voor persistente debug-opslag-RPC, lokale restart-hardening voor edge functions en lokale fix voor capability-RPC ambiguities.
- Open / blocked: productiebewijs in OpenAI dashboard en echte productie-liveflow van bestaande AIQS-calls zijn nog niet lokaal bewezen in deze ronde.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/25-tasks/open/aiqs-logging-valideren-openai-dashboard-en-fallback.md`
- `docs/project/25-tasks/open/aiqs-productie-live-zetten-bestaande-openai-calls.md`


## Commits

- 2026-06-01T11:08:03+02:00 — feat: add admin capability access control

- 2026-06-02T07:40:44+02:00 — fix: harden local admin edge runtime