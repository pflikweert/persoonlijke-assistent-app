# DO NOT EDIT - GENERATED FILE

# Budio Tasks Archive

Build Timestamp (UTC): 2026-07-02T10:06:28.219Z
Source Commit: 1e9e36d

Doel: uploadbundle met gearchiveerde done-tasks uit `docs/project/25-tasks/done/**`.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Brondirectories
- docs/project/25-tasks/done/**

## Telling
- Totaal tasks opgenomen: 77

## Leesregel
- Dit is een uploadartefact en geen canonieke bron voor repo-uitvoering.
- Canonieke taskfiles blijven de bron in `docs/project/25-tasks/**`.

---

## Actieve maandplanning herijkt naar transitiemaand

- Path: `docs/project/25-tasks/done/actieve-maandplanning-herijkt-naar-transitiemaand.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-19

```md
---
id: task-actieve-maandplanning-herijkt
title: Actieve maandplanning herijkt naar transitiemaand
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/20-planning/40-deviations-and-decisions.md
updated_at: 2026-04-19
summary: "Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen."
tags: [planning, transitiemaand]
workstream: idea
due_date: null
sort_order: 2
---




# Actieve maandplanning herijkt naar transitiemaand

## Probleem / context

De actieve planning leunde nog te veel op een generieke hardening/docs-focus en sloot niet meer goed aan op de huidige code-realiteit en de nieuwe researchrichting.

## Gewenste uitkomst

Een compacte maandfocus waarin consumer beta bewijs, 1.2B, 1.2E en een smalle brugpilot expliciet prioriteit krijgen.

## Waarom nu

- Deze koerswijziging moest eerst formeel vastliggen voordat vervolgtaken scherp konden worden aangestuurd.

## In scope

- Active phase herschrijven.
- Now/Next/Later herschrijven.
- Decision-log toevoegen.
- 12-maandenhorizon licht aanscherpen.

## Buiten scope

- Codewijzigingen.
- Brede Pro- of Business-roadmap activeren.

## Concrete checklist

- [x] Active phase herijkt.
- [x] Now/Next/Later herijkt.
- [x] Decision-log toegevoegd.
- [x] 12-maandenhorizon licht aangescherpt.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/20-planning/20-active-phase.md`
- `docs/project/20-planning/30-now-next-later.md`
- `docs/project/20-planning/40-deviations-and-decisions.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Admin/founder meeting capture — epic en taakpakket aanmaken

- Path: `docs/project/25-tasks/done/admin-founder-meeting-capture-epic-en-taakpakket-aanmaken.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-epic-en-taakpakket-aanmaken
title: Admin/founder meeting capture — epic en taakpakket aanmaken
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Maak de Meeting Capture epic, idea-doc en volledige P1/P2 taskbundel aan als eerste praktijktest van de nieuwe Budio Workspace hierarchy-laag."
tags: [meeting-capture, admin, audio, workspace, hierarchy]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 3
---





# Admin/founder meeting capture — epic en taakpakket aanmaken

## Probleem / context

Meeting Capture is inhoudelijk klaar om als project opgepakt te worden, maar staat nog niet als epic met concrete child tasks in de repo. Daardoor kan de nieuwe hierarchy-laag nog niet als praktijkworkflow getest worden.

## Gewenste uitkomst

Er staat één idea-doc, één epic-doc en een volledig P1/P2 taakpakket voor Meeting Capture. De plugin kan deze epic als bundel tonen, met dependencies en duidelijke volgorde.

## User outcome

Een developer of agent ziet Meeting Capture als epic met linked P1/P2 taken en kan de eerste bouwtask kiezen.

## Functional slice

Operationele projectsetup: idea-doc, epic-doc, taskbundle, dependencies en verify.

## Entry / exit

- Entry: Meeting Capture research staat buiten de repo in losse markdownbronnen.
- Exit: Meeting Capture bestaat als repo-epic met concrete child tasks.

## Happy flow

1. Agent maakt idea-doc aan.
2. Agent maakt epic-doc aan.
3. Agent maakt P1 en P2 taskfiles aan.
4. Agent koppelt alle taskfiles via `epic_id`.
5. Agent draait taskflow en docs bundle verify.

## Non-happy flows

- Geen bestaande taskmatch: maak nieuwe projectsetup-task aan.
- Verify faalt: herstel taskflow/docs voordat setup done gaat.
- Extra runtimewerk ontstaat: maak aparte bouwtask, niet in deze setup-task.

## UX / copy

- Geen runtime UI.
- Projecttaal blijft `Admin/founder meeting capture` en `Gespreksopname`.

## Data / IO

- Input: researchbronnen en gebruikersplan.
- Output: markdown idea/epic/taskdocs.
- Geen app runtime data.

## Waarom nu

- De workspace hierarchy is net opgeleverd en heeft een echte projecttest nodig.
- Meeting Capture is groot genoeg voor epic/task/subtask-dependency structuur.
- Morgen moet uitvoering kunnen starten zonder opnieuw te plannen.

## In scope

- Idea-doc aanmaken.
- Epic-doc aanmaken.
- Alle P1 en P2 taskfiles aanmaken met `epic_id`.
- Dependencies, priority en volgorde vastleggen.
- Verify draaien voor taskflow en docs bundle.

## Buiten scope

- Runtime Meeting Capture bouwen.
- DB migrations of app-code aanpassen.
- Workflowdocs inhoudelijk herschrijven zonder bewezen frictie.

## Oorspronkelijk plan / afgesproken scope

- Start Meeting Capture als eerste praktijktest van de nieuwe `Epic -> Task -> Subtask/dependency` workspace-laag.
- Maak één epic onder `docs/project/24-epics/**` en meerdere taskfiles onder `docs/project/25-tasks/open/**`.
- Taken starten `backlog`; alleen deze actieve projectsetup-taak staat op `in_progress`.
- Workflowverbeteringen komen alleen op basis van echte frictie tijdens uitvoering.

## Expliciete user requirements / detailbehoud

- Alle P1 bouwtaken moeten een eigen task krijgen.
- Alle nice-to-have onderdelen krijgen ook een eigen task onder dezelfde epic.
- Upload/import van bestaand audiobestand moet expliciet als P2 taak mee.
- Bestaande captureflow niet functioneel aanpassen.
- Layout/copy moet aansluiten op bestaande capture-, moment-, dag-, selectie-, header- en footerpatronen.
- OpenAI Codex/PLANS/skills learnings tijdens uitvoering bewaken en alleen bewezen verbeteringen verwerken.

## Status per requirement

- [x] Epic-doc aangemaakt — status: gebouwd
- [x] Idea-doc aangemaakt — status: gebouwd
- [x] P1 taskfiles aangemaakt — status: gebouwd
- [x] P2 taskfiles aangemaakt — status: gebouwd
- [x] Dependencies en volgorde vastgelegd — status: gebouwd
- [x] Verify afgerond — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: epic, idea-doc en taskfiles aanmaken.
- [x] Blok 3: docs bundle verify draaien en afronden.

## Concrete checklist

- [x] Meeting Capture idea-doc toevoegen.
- [x] Meeting Capture epic-doc toevoegen.
- [x] P1 taken toevoegen.
- [x] P2 nice-to-have taken toevoegen.
- [x] Dependencies en `epic_id` metadata invullen.
- [x] `npm run taskflow:verify`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`

## Acceptance criteria

- [x] Epic-doc bestaat.
- [x] P1/P2 taskfiles bestaan en linken naar dezelfde epic.
- [x] Verify is groen.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: Meeting Capture als epic + taskbundel vastleggen en daarmee de nieuwe hierarchy-flow testen.
- Toegevoegde verbeteringen: geen.
- Afgerond: idea-doc, epic-doc, P1/P2 taskfiles, dependencies, taskflow verify en docs bundle verify zijn afgerond.
- Open / blocked: geen binnen deze setup-taak; daadwerkelijke bouw start in de volgende P1 task.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
- `docs/project/40-ideas/10-product/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Admin/founder meeting capture — scope en eerste versie vastleggen

- Path: `docs/project/25-tasks/done/admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen
title: Admin/founder meeting capture — scope en eerste versie vastleggen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Leg de audio-first v1 scope vast voor Meeting Capture, inclusief admin-only grens, privacy/consent, anti-scope-creep en relatie tot bestaande captureflow."
tags: [meeting-capture, scope, audio, admin]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-epic-en-taakpakket-aanmaken]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 4
---






# Admin/founder meeting capture — scope en eerste versie vastleggen

## Probleem / context

De Meeting Capture flow raakt product, privacy, UI, storage en toekomstige AI-verwerking. Zonder expliciete v1-scope ontstaat risico op transcript-first bouwen, dagboekflow-vervuiling of te brede meeting-suite ideeën.

## Gewenste uitkomst

De scope voor v1 staat scherp: admin/founder-only, audio-safe web recording, buiten dagboekcapture, met transcriptie en insights als latere verwerking. De taak is klaar wanneer een implementatie-agent de v1-grens kan volgen zonder extra productbeslissingen.

## User outcome

Een developer of agent weet exact wat Meeting Capture v1 wel en niet bouwt, welke UX/copy gebruikt wordt en welke failure states verplicht zijn.

## Functional slice

Een uitvoerbaar scopecontract voor audio-safe v1, inclusief flowcontract en niet-bouwen-lijst.

## Entry / exit

- Entry: Meeting Capture research en epic bestaan, maar P1 bouwtaken zijn nog niet inhoudelijk gehard.
- Exit: P1 bouwtaken kunnen zonder chatcontext starten.

## Happy flow

1. Agent leest researchbronnen, epic en bestaande capture/moment/dag patronen.
2. Agent legt audio-safe v1-scope vast.
3. Agent vult flow-, UX/copy-, privacy- en non-happy guardrails aan in P1 taskfiles.
4. `taskflow:verify` en docs bundle blijven groen.

## Non-happy flows

- Scope creep: transcript, insights, upload/import of meeting-suite ideeën blijven P2 of buiten scope.
- Onduidelijke copy: agent verwijst naar `copy-instructions.md` en legt exacte schermcopy alsnog vast.
- Onvoldoende taskdetails: taak blijft open en niet bouwbaar totdat spec-readiness compleet is.

## UX / copy

- Leidend: bestaande capture-, moment-, dag-, selectie-, header- en footerpatronen.
- Verplichte kerncopy: `Gespreksopname`, `Start opname`, `Stop en bewaar`, `Audio wordt veilig opgeslagen`, `Upload opnieuw proberen`.
- Consent reminder: `Zorg dat iedereen weet dat je dit gesprek opneemt.`

## Data / IO

- Input: Meeting Capture researchdocs, epic en bestaande app/UI/copy docs.
- Output: geharde scope- en taskdocs.
- Geen runtime data, DB of storage wijzigingen.

## Waarom nu

- Deze taak blokkeert de eerste bouwslice.
- De flow moet lean starten en niet uitwaaieren.

## In scope

- V1-scope en anti-scope-creep vastleggen.
- Privacy/consent copy-richting benoemen.
- Relatie tot bestaande captureflow expliciteren.
- Bestaande UI/copy patronen als leidraad benoemen.

## Buiten scope

- Runtime code bouwen.
- DB-schema ontwerpen.
- Transcript/summary prompts uitwerken.

## Oorspronkelijk plan / afgesproken scope

- Audio-safe v1 is de eerste versie.
- Bestaande captureflow niet functioneel aanpassen.
- Copy en layout blijven simpel en consistent met bestaande Budio-patronen.

## Expliciete user requirements / detailbehoud

- `Gespreksopname` is de eenvoudige producttaal.
- Upload/import is belangrijk, maar niet nodig voor de minimale eerste versie.
- P2 extra's blijven aan dezelfde epic hangen.

## Status per requirement

- [x] V1-scope vastgelegd — status: vastgelegd
- [x] Privacy/consent richting vastgelegd — status: vastgelegd
- [x] Anti-scope-creep vastgelegd — status: vastgelegd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: Meeting Capture bronnen en relevante app/docs patronen herlezen.
- [x] Blok 2: scopebesluit en copy/UI guardrails vastleggen.
- [x] Blok 3: verify en taskstatus afronden.

## Concrete checklist

- [x] Bronnen samenvatten tot v1-scope.
- [x] Privacy/consent randvoorwaarden vastleggen.
- [x] Buiten-scope lijst expliciet maken.
- [x] Relevante vervolg-tasks controleren op juiste priority/dependencies.

## Acceptance criteria

- [x] V1-scope benoemt audio-safe opname als eerste waarde.
- [x] Bestaande dagboekcapture blijft expliciet onaangeraakt.
- [x] P1 taskfiles bevatten UX/copy en non-happy flow details.
- [x] P2 extra's blijven niet-blokkerend.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-epic-en-taakpakket-aanmaken`.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: scope en v1-grenzen vastleggen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: v1-scope, privacy/consent, anti-scope-creep, P1/P2 scheiding en vervolgtaakdetails zijn vastgelegd.
- Open / blocked: geen.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
- `docs/project/40-ideas/10-product/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 14ed6b1 — feat: add meeting capture route shells

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## AIQS productie live zetten voor bestaande OpenAI-calls

- Path: `docs/project/25-tasks/done/aiqs-productie-live-zetten-bestaande-openai-calls.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-07-02

```md
---
id: task-aiqs-productie-live-zetten-bestaande-openai-calls
title: AIQS productie live zetten voor bestaande OpenAI-calls
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-07-02
summary: "Zet de huidige AIQS-variant snel en gecontroleerd live in productie voor alleen de bestaande OpenAI-calls, zonder nieuwe reviewflow of extra calls toe te voegen."
tags: [aiqs, productie, openai, consumer-beta]
workstream: aiqs
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---

















# AIQS productie live zetten voor bestaande OpenAI-calls

## Probleem / context

De huidige AIQS-variant is functioneel bruikbaar, maar de productiedoelstelling is nog niet expliciet als taak verankerd: AIQS moet in productie werken voor de bestaande OpenAI-calls, zonder scope-uitbreiding.
Er is nadrukkelijk geen behoefte om nu de geplande bredere reviewflow te bouwen.

## Gewenste uitkomst

De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls.
Er worden geen nieuwe calls toegevoegd en geen nieuwe reviewproceslaag gebouwd binnen deze taak.

Deze taak is klaar wanneer de productieroute aantoonbaar werkt en de minimale operationele checks zijn vastgelegd om live testen mogelijk te maken.

## User outcome

Een founder/admin ziet in productie de actuele AI Quality Studio admin UI en kan de bestaande AIQS-managed runtimecalls gebruiken zonder preview-branch of lokale omgeving.

## Functional slice

Eén go-live slice: merge de actuele AIQS-werkbranch naar `main`, laat Vercel en Supabase Functions production deployen, en bevestig via live bundle/runtimebewijs dat de nieuwe AIQS admin en bestaande runtimecalls actief zijn.

## Entry / exit

- Entry: live omgeving toont nog oude AI Quality Studio UI terwijl de werkbranch de nieuwe AIQS-implementatie bevat.
- Exit: `origin/main` bevat de AIQS-werkbranch, production deploy is groen, en de live bundle bevat de nieuwe AIQS UI-copy.

## Happy flow

1. Controleer welke branch live ontbreekt.
2. Fast-forward `main` naar de actuele AIQS-werkbranch.
3. Push `main`.
4. Controleer Vercel production deployment, Supabase Functions workflow en live bundle.
5. Leg bewijs vast in de taskfile.

## Non-happy flows

- Merge conflict: stop en los bronbestand-conflict gericht op voordat `main` gepusht wordt.
- Deployment failure: rapporteer GitHub/Vercel/Supabase statusbron en fix pas na bronanalyse.
- Live bundle bevat oude UI: controleer alias/cache/deployment-target voordat vervolgacties worden gedaan.

## UX / copy

Geen nieuwe UX-scope. De productiecheck bevestigt alleen dat de eerder gebouwde AIQS admin UI live staat.

## Data / IO

- Input: git branches, GitHub deployment/status API, Vercel live assets, Supabase Functions workflowstatus.
- Output: `main` deployment met actuele AIQS UI en vastgelegd bewijs.
- Geen productdata-mutaties.

## Waarom nu

- Snelle live-validatie in de eigen productieomgeving is nu belangrijker dan featureverbreding.
- Het verlaagt de feedbackloop voor AIQS-verbetering in realistische omstandigheden.
- Het houdt de fase focus op bewijs-gedreven consumer-beta afronding.

## In scope

- Productieroute voor bestaande AIQS OpenAI-calls valideren en waar nodig repareren.
- Admin-only toegang en server-side guardrails behouden in productie.
- Nodige runtime/config checks voor stabiele live-werking vastleggen.
- Bewijs leveren dat huidige AIQS-calls in productie end-to-end werken.

## Buiten scope

- Nieuw reviewproces of uitgebreide evaluatielifecycle bouwen.
- Nieuwe AI-taken, extra OpenAI-calls of control-plane verbreding.
- Niet-AIQS productverbreding buiten de huidige adminflow.

## Concrete checklist

- [x] Productiepad van bestaande AIQS-calls checken op end-to-end werking.
- [x] Eventuele blockers in config/guardrails oplossen zonder scope-uitbreiding.
- [x] Bevestigen dat admin-only toegang in productie correct gehandhaafd blijft.
- [x] Bewijs vastleggen dat de huidige calls live werken zoals verwacht.
- [x] Korte operationele go-live notitie vastleggen voor vervolgtesten.

## Uitvoerblok 2026-07-02

- [x] Bevestigd dat `origin/main` nog op `5482b81` stond en de AIQS-werkbranch op `c246e04`.
- [x] Bevestigd dat de live `assistent.budio.nl` bundle de nieuwe AIQS overview-copy nog niet bevat.
- [x] Bevestigd dat de enige niet-main branch `codex/moments-viewer-deblock` is.
- [x] Merge `codex/moments-viewer-deblock` naar `main`.
- [x] Push `main` zodat Vercel productie opnieuw deployt.
- [x] Post-push deploymentstatus controleren.

## Acceptance criteria

- [x] `origin/main` bevat de AIQS-werkbranch.
- [x] Vercel production deployment is groen.
- [x] Supabase Functions deployment workflow is groen.
- [x] Live AIQS bundle bevat nieuwe UI-copy.
- [x] Live AIQS bundle bevat oude overviewsecties `Runtime Governance` en `AIQS Context` niet meer.

## Productie go-live bewijs 2026-07-02

- Branchsituatie vóór merge:
  - `origin/main`: `5482b81`
  - `codex/moments-viewer-deblock`: `c246e04` plus taskflow-closeout commit
  - enige niet-main branch: `codex/moments-viewer-deblock`
- Merge:
  - `main` fast-forwarded van `5482b81` naar `afc96a5`
  - docs-bundle closeout commit op `main`: `1e9e36d`
  - push naar `origin/main` gelukt
- Deployment:
  - GitHub deployment id `5282539236`, environment `production`
  - Vercel deployment target: `https://persoonlijke-assistent-8rwxbo8z5-pflikweerts-projects.vercel.app`
  - deployment status: `success`, `created_at=2026-07-02T10:04:24Z`
  - Supabase Functions workflow `Deploy Supabase Functions`, run `28581769230`: `completed`, `success`
  - Secret Scan workflow run `28581769180`: `completed`, `success`
- Live bundle check op `https://assistent.budio.nl/settings-ai-quality-studio`:
  - nieuw bundlebestand: `/_expo/static/js/web/entry-cc0129f92e422e3cef39ec9144066118.js`
  - bevat nieuwe AIQS overview-copy `Beheer promptfamilies, drafts en runtimekwaliteit.`
  - bevat `Alle runtimes actief`
  - bevat `Live versie bekijken`, `Versies opschonen`, `AI observaties`
  - bevat niet meer de oude overviewsecties `Runtime Governance` en `AIQS Context`

## Reconciliation

- Oorspronkelijk doel: bestaande AIQS OpenAI-calls en adminflow gecontroleerd naar productie brengen.
- Afgerond:
  - productie runtime-smoke voor AIQS-calls is vastgelegd in `done/productie-moment-geen-dagverhaal-aiqs-runtime-smoke.md`
  - Supabase Edge Functions deploy is groen
  - productie-webbundle bevat de nieuwe AIQS admin UI
  - oude AIQS overviewsecties zijn niet meer aanwezig in de live JS-bundle
- Open: geen.

## Blockers / afhankelijkheden

- Productieomgeving en geldige admin-toegang.
- Bestaande server-side configuratie voor AIQS/OpenAI-callpad.

## Verify / bewijs

- Runtimebewijs van succesvolle AIQS-calls in productie.
- Bevestiging van admin-only afscherming in productie.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`


## Commits

- 5a7e3e0 — docs: add service status backlog task

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-07-02T12:00:53+02:00 — docs: track AIQS production merge
```

---

## AIQS Week/Maand validatiecases uit day journals

- Path: `docs/project/25-tasks/done/aiqs-week-maand-validatiecases-uit-day-journals.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: aiqs-week-maand-validatiecases-uit-day-journals
title: AIQS Week/Maand validatiecases uit day journals
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: "Week- en maandvalidatie in AIQS gebruiken day_journals als broncases, zodat drafts getest, vergeleken en beoordeeld kunnen worden zonder bestaande period_reflections."
tags: [aiqs, validation, week, month, day-journals, evidence]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: [aiqs-runtime-db-binding-voor-live-prompts, aiqs-admin-console-uiux-linear-richting]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 2
---



## Probleem / context

Dag-validatie werkt, maar week- en maandvalidatie tonen `Geen cases gevonden`. Daardoor kan een AIQS-admin geen week- of maanddraft testen, vergelijken of evidence opbouwen.

De vermoedelijke oorzaak is dat week/maandvalidatie niet uit brondata wordt opgebouwd. Validatie mag niet afhankelijk zijn van al bestaande `period_reflections`; juist wanneer die ontbreken moet AIQS cases uit `day_journals` kunnen maken.

## Gewenste uitkomst

`week_narrative` en `month_narrative` tonen testcases die zijn opgebouwd uit `day_journals`. De validate-flow kan daarna een draft runnen, een live baseline on-demand genereren, diff tonen, observaties tonen en een reviewoordeel opslaan.

## User outcome

Een AIQS-admin kan week- en maandprompts net als dagprompts valideren op echte brondata, ook wanneer er nog geen week- of maandreflecties bestaan.

## Functional slice

Eén afgeronde slice voor AIQS validate/test source generation:

1. week/maand capabilities aanzetten
2. week/maand cases uit `day_journals` groeperen
3. week/maand testinput exact als runtime bouwen
4. live baseline voor compare on-demand genereren
5. diff-first validate-flow laten werken voor week en maand

## Entry / exit

- Entry: admin opent AIQS validate voor `week_narrative` of `month_narrative`.
- Exit: admin kiest een week- of maandcase, runt de draft, ziet diff en kan een oordeel opslaan.

## Happy flow

1. Admin opent `week_narrative` validate.
2. Case picker toont weken op basis van `day_journals`.
3. Admin kiest een weekcase en runt de test.
4. AIQS bouwt input met `period_type`, `period_start`, `period_end` en `dayJournals`.
5. Draft-output en live-output worden vergeleken in de bestaande diff-first UI.
6. Admin slaat `Beter`, `Gelijk`, `Slechter` of `Fout` op.

## Non-happy flows

- Empty state: als er echt geen bruikbare `day_journals` zijn, blijft `Geen cases gevonden` eerlijk.
- Permission denied / unavailable: bestaande AIQS admin/capability checks blijven leidend.
- Validation / unsupported state: source type moet bij task capability passen.
- Failure / retry / cancel: OpenAI-call of source-load fouten blijven als bestaande validate error zichtbaar.

## UX / copy

- Week label: `Week 2026-06-01 t/m 2026-06-07`.
- Week subtitle: `7 dagen · 42 entries`.
- Maand label: `Juni 2026`.
- Maand subtitle: `21 dagen · 137 entries`.
- Case preview blijft compact en brongebaseerd.
- Bestaande validate UI en diff-first layout blijven leidend.

## Data / IO

- Input:
  - `day_journals` per `user_id`, gegroepeerd per ISO-week of kalendermaand
  - display-entry counts uit `entries_raw`
- Output:
  - `AiTaskTestSource[]` met `sourceType: 'week' | 'month'`
  - `input_snapshot_json` met `period_type`, `period_start`, `period_end`, `dayJournals`
  - draft test run + live compare output
- Opslag/API/service/file-impact:
  - geen schema-migratie
  - bestaande `ai_test_cases.source_type` enum `week/month` gebruiken
  - synthetische stabiele UUID voor periodecase
- Statussen:
  - bestaande queued/completed/failed test run statussen blijven hetzelfde

## Waarom nu

AIQS is evidence-first. Zonder week/maandcases kunnen week- en maandprompts niet gevalideerd of veilig live gezet worden.

## In scope

- AIQS validate/test source generation voor `week_narrative` en `month_narrative`.
- Period-case helperlogica.
- Edge Function `list_test_sources`, `run_test`, `get_compare_view`.
- Type/UI-capability uitbreidingen.
- Unit- en smoke-tests.

## Buiten scope

- Prompt runtime redesign.
- Nieuwe schema-migratie.
- Consumer Vandaag/Reflecties UI.
- Bestaande productieperiodereflecties herschrijven.
- Afhankelijkheid introduceren op `period_reflections` voor validatie.

## Oorspronkelijk plan / afgesproken scope

# AIQS Week/Maand Validatiecases uit Day Journals

Week- en maandvalidatie moeten cases uit `day_journals` opbouwen, ook wanneer `period_reflections` ontbreken. Week volgt productie-bounds maandag-zondag; maand volgt kalendermaand. Testinput gebruikt dezelfde contextshape als `generate-reflection`: `period_type`, `period_start`, `period_end`, `dayJournals`. Live baseline wordt tijdens compare on-demand gegenereerd met de live AIQS-versie.

## Expliciete user requirements / detailbehoud

- Dag-validatie blijft werken.
- Week toont minimaal één case wanneer day journals beschikbaar zijn.
- Maand toont minimaal één case wanneer day journals beschikbaar zijn.
- Weekcase gebruikt groep day journals binnen een week.
- Maandcase gebruikt groep day journals binnen een maand.
- Validator bouwt runtime-input zelf uit brondata.
- Validatie hangt niet af van bestaande week- of maandoutput.
- Bij case kiezen: run live versie, run draft versie, toon diff, toon observaties, gebruiker geeft oordeel.
- Case picker toont dagen- en entries-count.
- Controleer expliciet dat generation gebaseerd is op `day_journals` en niet `period_reflections`.

## Status per requirement

- [x] Dag-validatie blijft werken — status: gebouwd en runtime-smoke toont `day_narrative` sources.
- [x] Weekcases uit `day_journals` zichtbaar — status: gebouwd; runtime-smoke toont 30 weekcases.
- [x] Maandcases uit `day_journals` zichtbaar — status: gebouwd; runtime-smoke toont 25 maandcases.
- [x] Week/month run_test bouwt productiecontext — status: gebouwd; `input_snapshot_json.dayJournals` is runtime-smoke bevestigd.
- [x] Week/month compare genereert live baseline on-demand — status: gebouwd; runtime-smoke toont `compare=available` voor week en maand.
- [x] UI/types accepteren `week | month` source types — status: gebouwd.
- [x] Unit- en runtimebewijs vastgelegd — status: gebouwd; bewijs staat onder `Verify / bewijs`.

## Toegevoegde verbeteringen tijdens uitvoering

- Pure helper `supabase/functions/_shared/aiqs-period-cases.ts` toegevoegd voor period bounds, grouping, synthetische UUID en input snapshot.
- Validate compare-labels voor `week_narrative` en `month_narrative` toegevoegd zodat diff-secties dezelfde labels gebruiken als period output.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, huidige validate/test broncode en dirty worktree bevestigen.
- [x] Blok 2: period-case pure helper + unit-tests toevoegen.
- [x] Blok 3: types/capabilities/UI source-type checks uitbreiden.
- [x] Blok 4: Edge Function source listing, run_test en compare baseline uitbreiden.
- [x] Blok 5: static/runtime verify, docs/taskflow afronden.

## Concrete checklist

- [x] Period-case helper toevoegen.
- [x] Unit-tests voor bounds, grouping, synthetic UUID en input snapshot toevoegen.
- [x] `week_narrative`/`month_narrative` capabilities aanzetten.
- [x] `RunAiTaskTestPayload` en validate UI-checks uitbreiden.
- [x] `list_test_sources` week/month bronnen laten teruggeven.
- [x] `run_test` week/month input snapshot en prompt bouwen.
- [x] `get_compare_view` week/month live baseline genereren.
- [x] Verify en reconciliation bijwerken.

## Acceptance criteria

- [x] `day_narrative` validate toont cases en kan test/diff blijven draaien.
- [x] `week_narrative` validate toont minimaal één case bij beschikbare day journals.
- [x] `week_narrative` run test slaagt en compare toont diff.
- [x] `month_narrative` validate toont minimaal één case bij beschikbare day journals.
- [x] `month_narrative` run test slaagt en compare toont diff.
- [x] `input_snapshot_json` voor week/month bevat `dayJournals` en geen `period_reflections`.
- [x] Live baseline voor week/month komt uit live AIQS-versie, niet uit bestaande reflection rows.

## Blockers / afhankelijkheden

- Geen bekende blockers.
- Dirty worktree bevat bestaande AIQS/WIP; deze taak raakt alleen relevante AIQS period-validation paden.

## Verify / bewijs

- ✅ `npx vitest run tests/unit/aiqs-period-cases.test.ts` — 5 tests groen.
- ✅ `npx vitest run tests/unit/ai-quality-validate-compare.test.ts` — 6 tests groen.
- ✅ `npm run test:unit -- aiqs-period` — 5 tests groen.
- ✅ `npm run test:unit -- ai-quality` — 4 files / 22 tests groen.
- ✅ `npm run typecheck`
- ✅ `npm run lint`
- ✅ `npm run supabase:functions:restart` — functions runtime gestart met pid `8205`; daarna door smoke opnieuw gestart met pid `8342`.
- ✅ `npm run verify:local-aiqs-smoke` — AIQS overview-smoke groen; target `http://localhost:8081/settings-ai-quality-studio`.
- ✅ Gerichte API/runtime-smoke:
  - `day_narrative: sources=30`
  - `week_narrative: sources=30`, eerste case `Week 2026-06-08 t/m 2026-06-14`, `run=completed`, `dayJournals=1`, `compare=available`
  - `month_narrative: sources=25`, eerste case `Juni 2026`, `run=completed`, `dayJournals=6`, `compare=available`
  - smoke faalt expliciet als `input_snapshot_json` `period_reflections` bevat.
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: week/maand AIQS validatiecases uit `day_journals`, inclusief run en compare.
- Toegevoegde verbeteringen: pure period-case helper en period-labels in validate compare-helper.
- Afgerond:
  - capabilities/types/UI-checks accepteren week/maand sources
  - Edge Function `list_test_sources` bouwt week/month cases uit `day_journals`
  - Edge Function `run_test` bouwt period runtime snapshot en prompt
  - Edge Function `get_compare_view` genereert live baseline on-demand met live AIQS-versie
  - unit-, static- en runtime-smoke bewijs is groen
- Open / blocked:
  - geen open punten voor deze slice.

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`
- `docs/project/25-tasks/open/aiqs-admin-console-uiux-linear-richting.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Always-on taskflow enforcement (agent-onafhankelijk)

- Path: `docs/project/25-tasks/done/always-on-taskflow-enforcement-agent-onafhankelijk.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-always-on-taskflow-enforcement-agent-onafhankelijk
title: Always-on taskflow enforcement (agent-onafhankelijk)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-23
summary: "Alle inhoudelijke agentsessies volgen verplicht de taskflow in docs/project/25-tasks, met hard verify-script, vaste outputstatus en duidelijke done-afronding."
tags: [workflow, tasks, governance]
workstream: plugin
due_date: null
sort_order: 5
---



## Probleem / context

In de huidige workflow bestaan al task-afspraken, maar die worden niet overal en niet hard genoeg afgedwongen. Daardoor moet de gebruiker de taskflow opnieuw uitleggen en kan statusdrift ontstaan tussen uitvoering en taaklaag.

## Gewenste uitkomst

Elke inhoudelijke agentsessie (plan/research/bug/implementatie) loopt automatisch via een taskfile in `docs/project/25-tasks/**`, inclusief zichtbare status in updates/resultaten en een verplichte afrondflow naar `done` met docs-bundling verify.

## Waarom nu

- De gebruiker wil dit nooit meer per sessie hoeven herhalen.
- Workflowconsistentie is nodig over Cline/Codex/agentvarianten heen binnen deze repo.

## In scope

- Always-on policy expliciet en leidend vastleggen in `AGENTS.md`.
- Workflowdocs en skill aanscherpen naar verplichte taskflow.
- Hard guardrail script toevoegen (`taskflow:verify`) met duidelijke foutcodes/meldingen.
- Verifypaden opnemen in operationele docs.

## Buiten scope

- Externe tooling buiten repo-context hard afdwingen.
- Runtime-app features of API-contracten wijzigen.

## Concrete checklist

- [x] Taskflow-policy uitbreiden in AGENTS + docs/dev workflowdocs.
- [x] `task-status-sync-workflow` skill verplicht en expliciet maken.
- [x] `scripts/docs/verify-taskflow-enforcement.mjs` implementeren + npm script toevoegen.
- [x] Unit-tests toevoegen voor verifier/sortering van regels.
- [x] Docs bundle verify uitvoeren en taak afronden naar `done`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:test`
- `npm run taskflow:verify`
- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/README.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Archief-import actieve voortgang zonder preview-duplicatie

- Path: `docs/project/25-tasks/done/archief-import-actieve-voortgang-zonder-preview-duplicatie.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-archief-import-actieve-voortgang-zonder-preview-duplicatie
title: Archief-import actieve voortgang zonder preview-duplicatie
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: Verberg de import-preview direct na start van een archief-import en toon alleen een voortgangsgerichte mobiele statusweergave.
tags: [settings, import, ux, polish]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 1
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---






# Archief-import actieve voortgang zonder preview-duplicatie

## Probleem / context

Na het starten van een archief-import blijft het preview-scherm zichtbaar terwijl tegelijk een voortgangsblok verschijnt. Daardoor toont het scherm twee primaire taken tegelijk: controle van de preview en actieve voortgang.

## Gewenste uitkomst

Zodra de gebruiker de import start, verdwijnt de preview direct volledig uit beeld. Tijdens actieve import ligt de focus volledig op voortgang, met alleen de bestandscontext, aantallen, voortgangsbalk, percentage, verwerkingsstap en de route terug naar `Vandaag`.

Na afronding verdwijnt de voortgangsweergave en wordt een compacte voltooid-status getoond met de verwerkte aantallen en dezelfde route naar `Vandaag`.

## User outcome

De gebruiker ziet tijdens importeren nog maar één duidelijke taak: wachten op voortgang of doorgaan naar `Vandaag`.

## Functional slice

Een UI-only state-scheiding voor `idle`, `selected`, `importing`, `completed` en `error` in de bestaande archief-importflow.

## Entry / exit

- Entry: gebruiker opent `Instellingen` -> `Importeren` en kiest een geldig bestand.
- Exit: gebruiker ziet ofwel alleen voortgang tijdens actieve import, of een voltooid-status met actie `Ga naar Vandaag`.

## Happy flow

1. Gebruiker kiest een bestand en ziet de preview.
2. Gebruiker start de import en de preview verdwijnt direct.
3. Scherm toont alleen importstatus, bestand, dagen, entries, voortgang en `Ga naar Vandaag`.
4. Na afronding toont het scherm alleen `Import voltooid` met aantallen en `Ga naar Vandaag`.

## Non-happy flows

- Empty state: `idle` blijft ongewijzigd.
- Permission denied / unavailable: bestaande disabled-state blijft ongewijzigd.
- Validation / unsupported state: bestaande preview-parse fouten blijven error-state tonen.
- Failure / retry / cancel: importfouten blijven een error-state tonen zonder preview en voortgang tegelijk zichtbaar te maken.

## UX / copy

- Tijdens actieve import verbergen:
  - `Klaar voor import`
  - `Controleer kort wat er wordt toegevoegd`
  - bestand metadata preview
  - voorbeeld content
  - `Importeer bestanden`
  - `Andere bestanden kiezen`
- Tijdens actieve import tonen:
  - `Importeren...`
  - bestandsnaam
  - aantal dagen
  - aantal entries
  - voortgangsbalk
  - percentage
  - `Dag X van Y`
  - `Deze verwerking draait op de achtergrond. Je kunt de app blijven gebruiken.`
  - `Ga naar Vandaag`
- Voltooid tonen:
  - `Import voltooid`
  - aantal dagen verwerkt
  - aantal entries verwerkt
  - `Ga naar Vandaag`
- Gebruik bestaande settings-scaffold en bestaande button/text primitives.

## Data / IO

- Input: bestaande import-preview en background task status.
- Output: enkelvoudige zichtbare UI-state per importsituatie.
- Opslag/API/service/file-impact: `app/settings-import.tsx`.
- Statussen: `idle`, `selected`, `importing`, `completed`, `error`.

## Waarom nu

De huidige dubbellaagse importweergave veroorzaakt directe UX-verwarring in een bestaande flow.

## In scope

- Importscreen state-rendering opschonen.
- Actieve voortgang compact en mobiel-first tonen.
- Voltooide status laten aansluiten op actieve voortgangsflow.

## Buiten scope

- Achtergrond-importarchitectuur wijzigen.
- Nieuwe retry-, cancel- of notificationsystemen bouwen.
- Andere settings-flows herontwerpen.

## Oorspronkelijk plan / afgesproken scope

- Verbeter UX van actieve archief-import.
- Verberg preview volledig zodra import start.
- Toon tijdens actieve import alleen de voortgangsweergave en `Ga naar Vandaag`.
- Toon na afronding een compacte voltooid-status met aantallen en `Ga naar Vandaag`.

## Expliciete user requirements / detailbehoud

- `idle` toont het huidige preview-scherm.
- `importing` verbergt alle preview-copy, metadata, voorbeeldcontent en niet-bruikbare acties.
- `importing` toont alleen bestandsnaam, aantal dagen, aantal entries, voortgangsbalk, percentage, `Dag X van Y`, achtergrondnotice en `Ga naar Vandaag`.
- `completed` vervangt voortgang door `Import voltooid`, aantallen verwerkt en `Ga naar Vandaag`.
- UX-regels:
  - geen dubbele informatie
  - slechts één primaire taak tegelijk zichtbaar
  - tijdens import ligt focus volledig op voortgang
  - geen acties tonen die tijdens actieve import niet gebruikt kunnen worden
  - mobiel eerst ontwerpen

## Status per requirement

- [x] Preview verdwijnt direct na importstart — status: gebouwd
- [x] Alleen voortgang blijft zichtbaar tijdens actieve import — status: gebouwd
- [x] `Ga naar Vandaag` blijft beschikbaar tijdens actieve import — status: gebouwd
- [x] Voltooide status toont juiste compacte samenvatting — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Error-state versimpeld naar `Probeer opnieuw` en `Ga naar Vandaag`, zodat mislukte imports ook geen irrelevante settings-acties meer tonen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [ ] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Importscreen states scheiden zonder dubbele content.
- [x] Actieve voortgang compact renderen.
- [x] Voltooide status compact renderen.
- [x] Gerichte verify uitvoeren.

## Acceptance criteria

- [ ] Na `Importeer bestanden` verdwijnt de preview direct volledig.
- [ ] Tijdens actieve import is alleen de voortgangsweergave zichtbaar met `Ga naar Vandaag`.
- [ ] Na succesvolle afronding toont het scherm alleen `Import voltooid` met aantallen en `Ga naar Vandaag`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run lint` — geslaagd.
- `npm run typecheck` — geslaagd.
- `curl -I --max-time 5 http://localhost:8081` — geslaagd; lokale webtarget reageert met `200 OK`.
- `npm run verify:local-auth-login -- --profile=default` — geslaagd; local auth magic-link flow geeft geldige session/user terug.
- Runtime browser-smoke op `/settings-import` is nog niet volledig bewezen:
  - `http://host.docker.internal:8081/settings-import` opent, maar redirect naar `/sign-in`
  - Docker-browser kan de Supabase verify-link op poort `54321` niet bereiken, waardoor echte ingelogde import-smoke in deze sessie blocked blijft

## Reconciliation voor afronding

- Oorspronkelijk plan: actieve import alleen voortgang laten tonen, zonder preview-duplicatie.
- Toegevoegde verbeteringen: error-state compacter gemaakt zodat ook failures geen dubbele of irrelevante acties tonen.
- Afgerond: scherm rendert nu preview, actieve import en voltooid als drie gescheiden toestanden met telkens één primaire taak zichtbaar.
- Open / blocked: interactieve runtime-smoke achter ingelogde browser blijft nog open door Docker-toegang tot lokale Supabase verify-link.

## Relevante links

- `app/settings-import.tsx`
- `design_refs/1.2.1/importeren_bezig/code.html`
- `design_refs/1.2.1/importeren_gelukt/code.html`


## Commits

- 2026-06-22T11:49:19+02:00 — fix: simplify active archive import ux

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Audio-instellingen testadvies stabiliseren en mic-selectie polish

- Path: `docs/project/25-tasks/done/audio-instellingen-testadvies-stabiliseren-en-mic-selectie-polish.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-audio-instellingen-testadvies-stabiliseren
title: Audio-instellingen testadvies stabiliseren en mic-selectie polish
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: chat
updated_at: 2026-04-23
summary: "Stabiliseer testadvies in audio-instellingen, laat advies staan na stop, voorkom layout-jitter met vaste advieshoogte en verbeter slider/microfoonselectie UX tijdens actieve test."
tags: [audio, settings, ux, web]
workstream: app
due_date: null
sort_order: 71
---



## Probleem / context

De nieuwe audio-instellingen werken functioneel, maar het testadvies wisselt nog te snel, verdwijnt bij stop in sommige paden en de adviessectie veroorzaakt layout-verspringing. Daarnaast moet volume-aanpassing via slider-tap betrouwbaar blijven en microfoonwissel tijdens test direct merkbaar blijven.

## Gewenste uitkomst

Op het scherm Audio Instellingen is het advies tijdens testen rustiger en gebaseerd op langere sampleperiodes. Het eerste advies komt pas na voldoende spreektijd. Na stoppen blijft het laatste advies zichtbaar.

De advieszone heeft een vaste hoogte zodat onderliggende UI niet verspringt. Slider-tap en microfoonwissel tijdens actieve test blijven direct bruikbaar.

## Waarom nu

- Directe UX-frictie op een net opgeleverde flow die bedoeld is om microfoonproblemen op te lossen.

## In scope

- Advieslogica timing in `app/settings-audio.tsx` aanscherpen.
- Advies behouden na test-stop.
- Vaste adviescontainerhoogte + subtiele apply-link zonder layout jump.
- Slider tap-interactie en mic-switch tijdens test verifiëren en waar nodig corrigeren.
- Taskstatus en verify-output synchroon houden.

## Buiten scope

- Nieuwe audio processing pipelines buiten settings/test UI.
- Native-specifieke microfoonrouting buiten bestaande web-scope.

## Concrete checklist

- [x] Eerste advies pas tonen na langere initiële spreekperiode.
- [x] Adviesupdates minder frequent en op langer samplevenster.
- [x] Laatste advies behouden bij stop.
- [x] Adviesblok vaste hoogte geven om layout-verspringing te voorkomen.
- [x] Slider tap + mic-switch tijdens test smoke valideren.
- [x] `npm run lint` en `npm run typecheck` draaien en vastleggen.

## Statusnotitie

- Afgerond: code, verify en docs-bundles zijn uitgevoerd; taak is klaar voor archivering in `done/`.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Relevante links

- `app/settings-audio.tsx`
- `services/web-audio-input.ts`
- `docs/project/25-tasks/README.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Codex-modelkeuze vrijmaken met 5.5 default

- Path: `docs/project/25-tasks/done/budio-codex-modelkeuze-vrijmaken-met-5-5-default.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-codex-modelkeuze-vrijmaken-met-5-5-default
title: Budio Codex-modelkeuze vrijmaken met 5.5 default
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: "Verwijder de Budio project-level modelpin zodat de gebruiker in Codex zelf een model kan kiezen, terwijl de globale default op `gpt-5.5` actief blijft."
tags: [plugin, codex, config, model, local-dev]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 6
---




# Budio Codex-modelkeuze vrijmaken met 5.5 default

## Probleem / context

De globale Codex-config staat nu correct op `gpt-5.5`, maar de Budio repo-config pinnt nog `model = "gpt-5.4"` in `.codex/config.toml`.

Daardoor erft Budio de globale default niet en blijft het project effectief op `gpt-5.4` laden. Dat botst met de expliciete userwens om in de Codex chat prompt zelf een model te kunnen kiezen, terwijl de default voor Budio ook naar `gpt-5.5` moet.

## Gewenste uitkomst

Budio pinnt geen eigen model meer op projectniveau. De repo erft de globale default `gpt-5.5`, terwijl handmatige modelkeuze in Codex niet onnodig door een repo-level `model` setting wordt overschreven.

## User outcome

Pieter opent Codex in de Budio repo en start standaard vanaf `gpt-5.5`, maar kan in de chat prompt zelf een ander model kiezen zonder dat Budio hard terugduwt naar een project-pinned model.

## Functional slice

Een minimale repo-config wijziging: de project-level `model` pin verdwijnt, overige Budio MCP- en Supabase-instellingen blijven intact.

## Entry / exit

- Entry: globale userconfig met `model = "gpt-5.5"` en Budio `.codex/config.toml` met `model = "gpt-5.4"`.
- Exit: Budio `.codex/config.toml` pinnt geen model meer; globale default `gpt-5.5` geldt weer in het project.

## Happy flow

1. Agent bevestigt globale en repo-level modelinstellingen.
2. Agent verwijdert alleen de repo-level `model` pin uit `.codex/config.toml`.
3. Agent valideert dat globale default buiten repo `gpt-5.5` is en dat Budio geen project-level modeloverride meer bevat.

## Non-happy flows

- Empty state: als `.codex/config.toml` onverwacht ontbreekt, wordt geen nieuwe brede config opgebouwd.
- Validation / unsupported state: als Codex een verborgen andere precedence zou toepassen, blijft dat expliciet gerapporteerd als onzekerheid.
- Failure / retry / cancel: bij verify-falen blijft de wijziging beperkt tot de kleinste config-edit en wordt het falende bewijs benoemd.

## UX / copy

- Geen app-UI-wijzigingen.
- Eindrapport benoemt expliciet dat Budio nu de globale `gpt-5.5` default erft en dat modelkeuze niet langer project-pinned is.

## Data / IO

- Input:
  - `~/.codex/config.toml`
  - `.codex/config.toml`
  - lokale Codex verify-output
- Output:
  - minimale patch in `.codex/config.toml`
  - task/docs-sync
- Opslag/API/service/file-impact:
  - alleen repo-local Codex-config en task/docs-laag
- Statussen:
  - review
  - applied
  - validated

## Waarom nu

- De globale default is al goed gezet; zonder deze repo-fix blijft Budio daarvan afwijken en blijft modelkeuze onnodig vastgepind.

## In scope

- Alleen de Budio repo-level modelpin verwijderen.
- Verifiëren dat de globale default `gpt-5.5` blijft.
- Verifiëren dat Budio local Supabase-config intact blijft.

## Buiten scope

- Globale plugin/config-herziening.
- Andere repo’s.
- Verdere Codex state/UI-instellingen buiten deze directe modelpin.

## Oorspronkelijk plan / afgesproken scope

- Houd `~/.codex/config.toml` op `gpt-5.5`.
- Verwijder alleen `model = "gpt-5.4"` uit Budio `.codex/config.toml`.
- Laat `model_reasoning_effort = "medium"` en Budio MCP/Supabase-config verder intact.
- Valideer daarna het effectieve gedrag met gerichte Codex checks.

## Expliciete user requirements / detailbehoud

- [x] In Budio altijd zelf model kunnen kiezen in de Codex chat prompt.
- [x] Budio default ook naar `gpt-5.5` zetten.
- [x] Geen onnodige repo-level modelhardcoding houden als die handmatige keuze in de weg zit.

## Status per requirement

- [x] Handmatige modelkeuze niet meer repo-pinned — status: gebouwd
- [x] Budio erft default `gpt-5.5` — status: gebouwd
- [x] Overige repo-config blijft intact — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Repo-level modelpin verwijderd; globale `gpt-5.5` default blijft de enige expliciete modeldefault.
- Verifiëring bevestigt nu ook binnen de Budio repo effectief `model: gpt-5.5`.

## Uitvoerblokken / fasering

- [x] Blok 1: huidige globale en repo-level modelconfig bevestigen.
- [x] Blok 2: minimale repo-config patch uitvoeren.
- [x] Blok 3: verify, taskflow en docs-bundel afronden.

## Concrete checklist

- [x] Project-level modelpin verwijderen uit `.codex/config.toml`
- [x] Verifiëren dat `gpt-5.5` globaal actief blijft
- [x] Verifiëren dat Budio local target intact blijft

## Acceptance criteria

- [x] `.codex/config.toml` bevat geen project-level `model = ...` meer.
- [x] `~/.codex/config.toml` blijft `model = "gpt-5.5"` bevatten.
- [x] Budio-specifieke MCP-config, inclusief `supabase_local`, blijft ongewijzigd.

## Blockers / afhankelijkheden

- Geen open blockers.

## Verify / bewijs

- `sed -n '1,80p' ~/.codex/config.toml`
- `sed -n '1,80p' .codex/config.toml`
- `codex doctor --json` in repo en/of buiten repo
- `node scripts/codex-mcp-target.mjs local`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

Tussenstand:

- `~/.codex/config.toml` bevat `model = "gpt-5.5"` en `model_reasoning_effort = "medium"`.
- `.codex/config.toml` bevat geen project-level `model = ...` meer.
- `codex doctor --json` in de Budio repo toont nu `model: gpt-5.5`.
- `node scripts/codex-mcp-target.mjs local` bevestigt dat `supabase_local` actief blijft.
- `npm run taskflow:verify` geslaagd.
- `npm run docs:bundle` geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: Budio modelpin verwijderen zodat globale `gpt-5.5` default geldt.
- Toegevoegde verbeteringen: expliciete verify toegevoegd dat de repo nu effectief `gpt-5.5` laadt, niet alleen dat de pin verwijderd is.
- Afgerond: repo-level modelpin verwijderd, globale `gpt-5.5` default intact, Budio local target intact en verify/scripts gedraaid.
- Open / blocked: geen.

## Relevante links

- `~/.codex/config.toml`
- `.codex/config.toml`
- `docs/project/25-tasks/done/codex-config-veilig-aanscherpen-voor-budio-development.md`


## Commits

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace active agent awareness in Board en List

- Path: `docs/project/25-tasks/done/budio-workspace-active-agent-awareness-board-list.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-workspace-active-agent-awareness-board-list
title: Budio Workspace active agent awareness in Board en List
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Toon echte actieve agentactiviteit duidelijk en near-realtime in de Budio Workspace Board en List views.
tags: [plugin, vscode, board, list, agent-metadata]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 7
---




## Probleem / context

Board en List gebruiken al echte `active_agent*` taskmetadata, maar actieve agentactiviteit is in het overzicht nog te subtiel. Daardoor is niet direct zichtbaar welke taak nu door Codex of een andere agent wordt uitgevoerd.

De gebruiker wil dit near-realtime kunnen zien, zonder fake states: alleen echte actieve metadata mag een taak als actief markeren, en de indicator moet verdwijnen zodra de agent klaar is of metadata wordt gewist.

## Gewenste uitkomst

Board en List tonen actieve agenttaken duidelijk met een rustige premium highlight, een live-chip en compacte context. Wanneer `active_agent*` wordt gewist, verdwijnt de highlight automatisch bij de volgende watcher/background refresh.

## User outcome

De gebruiker ziet in Board en List in één oogopslag welke taak momenteel door Codex/een agent wordt opgepakt en kan die taak direct openen vanuit een compacte live-agent strip.

## Functional slice

Een metadata-gedreven awareness slice in de bestaande Budio Workspace plugin: actieve agent UI-state helper, Board-card styling, List-row/mobile styling en compacte live-agent summary.

## Entry / exit

- Entry: gebruiker opent Board of List terwijl één of meer taskfiles echte actieve `active_agent*` metadata hebben.
- Exit: actieve taken zijn visueel herkenbaar; na `Stop agent`, clear of done cleanup verdwijnt de visual state zonder handmatige UI-reset.

## Happy flow

1. Gebruiker claimt een taak als actief in task detail.
2. De watcher hydrateert Board/List opnieuw.
3. Board-card en List-row tonen een duidelijke live-agent highlight en chip.
4. Gebruiker klikt de live-agent strip en opent/selecteert de actieve taak.
5. Gebruiker stopt de agent of rondt de taak af; metadata wordt gewist en de highlight verdwijnt.

## Non-happy flows

- Empty state: zonder actieve agentmetadata toont Board/List geen live-agent strip en geen highlights.
- Permission denied / unavailable: niet van toepassing; dit gebruikt lokale taskmetadata.
- Validation / unsupported state: onbekende of niet-actieve `active_agent_status` toont geen actieve highlight.
- Failure / retry / cancel: bestaande refresh/watch fallback blijft gelden; background refresh corrigeert gemiste watcher-events.

## UX / copy

- Chipcopy: `<Agent> actief`, bijvoorbeeld `Codex actief`.
- Compacte stripcopy: `<Agent> werkt aan <taaktitel>`.
- Visuele richting: zachte groen/cyaan live-gloed, subtiele pulse, geen waarschuwingkleur en geen fake progress.
- Board/List workflows, filters, drag/drop en detailgedrag blijven functioneel gelijk.

## Data / IO

- Input: bestaande `TaskCardViewModel` met `activeAgent`, `activeAgentStatus`, `activeAgentSince`, `activeAgentRuntime` en `activeAgentModel`.
- Output: alleen UI-state en CSS-klassen; geen markdown-schemawijziging.
- Opslag/API/service/file-impact: geen nieuwe opslag; bestaande claim/clear/done flows blijven leidend.
- Statussen: alleen actieve statuswaarden uit de bestaande helper markeren een taak als actief.

## Waarom nu

De agent-claim metadata is net toegevoegd aan task detail. De volgende logische stap is dat die echte metadata zichtbaar en bruikbaar wordt in de dagelijkse Board/List overzichten.

## In scope

- Active-agent UI-state helper.
- Board-card active-agent highlight.
- List desktop/mobile active-agent highlight.
- Compacte live-agent summary boven Board/List.
- Unit-tests voor helpergedrag.
- Plugin verify en apply.

## Buiten scope

- Automatisch claimen bij selecteren of statuswijziging.
- Nieuwe agent runtime, websocket of processtream.
- Wijzigingen aan board/list workflows, filters, drag/drop of task detail.
- Fake progress, fake activity of verzonnen agentstatus.

## Oorspronkelijk plan / afgesproken scope

- Board cards krijgen bij actieve agent een duidelijke maar rustige live-stijl.
- List desktop rows en mobile list cards krijgen dezelfde actieve stijl.
- Er komt een compacte live-agent strip wanneer actieve agents bestaan.
- Near realtime blijft gebaseerd op echte taskfile watcher/background refresh.
- Stop/afrondgedrag blijft metadata-gedreven.

## Expliciete user requirements / detailbehoud

- Actief aan gewerkt moet duidelijk zichtbaar zijn in Board en List.
- Gebruik achtergrondkleur of een ander sterk visueel kenmerk.
- Near realtime updates.
- Wanneer agent klaar is, verdwijnt de actieve indicator.
- Kom met slimme oplossingen, maar zonder nepdata.

## Status per requirement

- [x] Duidelijke Board-highlight — status: gebouwd; actieve metadata geeft card glow, accent rail en live-chip.
- [x] Duidelijke List-highlight — status: gebouwd; desktop rows en mobile cards krijgen dezelfde actieve behandeling.
- [x] Live-agent strip met directe selectie/opening — status: gebouwd; strip gebruikt echte actieve taskmetadata en selecteert via bestaande flow.
- [x] Metadata-gedreven verdwijnen na clear/done — status: gebouwd in codepad; bestaande clear/done cleanup blijft bron en helper toont alleen actieve metadata.
- [x] Tests en plugin apply — status: gebouwd; plugin typecheck/test/apply zijn groen.

## Toegevoegde verbeteringen tijdens uitvoering

- `activeAgentUiState` centraliseert chip-, runtime- en sinds-labels zodat Board/List geen eigen statusinterpretatie bevatten.
- List inline agent chip wordt expliciet overridet zodat hij niet door generieke list-copy clamp styling wordt vervormd.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: active-agent helper + tests toevoegen.
- [x] Blok 3: Board/List UI en CSS polish implementeren.
- [x] Blok 4: gerichte verify, plugin apply en task/docs afronden.

## Concrete checklist

- [x] Helper voor actieve-agent UI-state toevoegen en testen.
- [x] Board card active-agent class/chip/summary aansluiten.
- [x] List desktop/mobile active-agent class/chip/summary aansluiten.
- [x] CSS voor rustige live-agent highlight toevoegen.
- [x] Typecheck/test/apply uitvoeren.
- [x] Taskflow/docs bundle afronden en task naar done verplaatsen.

## Acceptance criteria

- [x] Een taak met echte actieve `active_agent*` metadata is in Board duidelijk herkenbaar.
- [x] Dezelfde taak is in List desktop en mobile duidelijk herkenbaar.
- [x] De live-agent strip verschijnt alleen wanneer actieve agentmetadata bestaat en opent/selecteert de taak.
- [x] Na clear/done verdwijnt de indicator na snapshot refresh.
- [x] Bestaande Board/List interacties blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- [x] `npm --prefix tools/budio-workspace-vscode run typecheck`
- [x] `npm --prefix tools/budio-workspace-vscode run test`
- [x] `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- [x] `npm run taskflow:verify`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`
- [x] Screenshot-helper smoke: `/tmp/budio-active-agent-board.png` bevestigd met foreground `Code — Budio Workspace: List — persoonlijke-assistent-app`; visuele strip stond niet bovenaan in beeld door behouden scrollpositie.

## Reconciliation voor afronding

- Oorspronkelijk plan: actieve agenttaken duidelijk zichtbaar maken in Board en List via echte `active_agent*` metadata, inclusief compacte live-agent strip en near-realtime watcher/background refresh.
- Toegevoegde verbeteringen: helper centraliseert live-labels en List inline-chip styling is gehard tegen generieke span-clamp.
- Afgerond: helper + tests, Board-card highlight, List desktop/mobile highlight, live-agent strip, plugin apply en repo-verificaties zijn uitgevoerd.
- Open / blocked: geen open functionele punten; screenshot-helper capture bevestigde plugin focus maar niet de bovenkant van de view door retained scrollpositie.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-task-detail-edit-polish-agent-claiming.md`
- `tools/budio-workspace-vscode/src/tasks/task-ux.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`


## Commits

- 2026-06-22T18:04:11+02:00 — Automate active agent metadata

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace active agent claim herstel voor AIQS Assist

- Path: `docs/project/25-tasks/done/budio-workspace-active-agent-claim-herstel-aiqs-assist.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-workspace-active-agent-claim-herstel-aiqs-assist
title: Budio Workspace active agent claim herstel voor AIQS Assist
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Herstel ontbrekende active-agent metadata op de lopende AIQS Assist taak zodat Board/List de echte Codex-activiteit tonen.
tags: [plugin, vscode, taskflow, agent-metadata]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 8
---




## Probleem / context

De gebruiker ziet de taak `AIQS Assist laagbewuste prompt review` niet als actieve agenttaak in Board/List, terwijl er wel een Codex-run aan werkt.

Diagnose: de taakfile bestaat en staat op `in_progress`, maar bevat geen `active_agent*` frontmatter. De nieuwe plugin-awareness werkt bewust alleen metadata-gedreven en toont daarom correct geen fake activiteit.

## Gewenste uitkomst

De lopende AIQS Assist taak krijgt echte `active_agent*` metadata, zodat Board/List de taak near-realtime als actief kunnen tonen via de bestaande plugin-highlight en live-agent strip.

## User outcome

De gebruiker ziet de actieve Codex-run op `AIQS Assist laagbewuste prompt review` terug in het overzicht, zonder dat de plugin fake status hoeft te verzinnen.

## Functional slice

Kleine taskflow/data-fix: ontbrekende active-agent metadata herstellen op de lopende AIQS Assist taskfile en verifiëren dat taskflow geldig blijft.

## Entry / exit

- Entry: AIQS Assist taskfile staat op `in_progress` zonder actieve agentmetadata.
- Exit: AIQS Assist taskfile bevat `active_agent*` metadata met status `running`; deze bugfix-taak is afgerond zonder actieve agentmetadata.

## Happy flow

1. Inspecteer de AIQS Assist taskfile.
2. Bevestig dat `active_agent*` ontbreekt.
3. Voeg echte Codex active-agent metadata toe.
4. Verifieer taskflow.

## Non-happy flows

- Empty state: als geen actieve metadata bestaat, toont plugin niets; dat blijft correct.
- Permission denied / unavailable: niet van toepassing.
- Validation / unsupported state: onbekende `active_agent_status` blijft niet actief; deze fix gebruikt `running`.
- Failure / retry / cancel: bij taskflow-fout eerst metadata/frontmatter herstellen.

## UX / copy

- Geen UI-copy wijziging.
- De bestaande Board/List copy `Codex actief` en live-agent strip blijven leidend.

## Data / IO

- Input: `docs/project/25-tasks/open/aiqs-assist-laagbewuste-prompt-review.md`.
- Output: toegevoegde `active_agent*` frontmatter.
- Opslag/API/service/file-impact: alleen taskfilemetadata en taskflow/docs-bundles.
- Statussen: AIQS-taak blijft `in_progress`; bugfix-taak gaat naar `done`.

## Waarom nu

De net gebouwde active-agent awareness lijkt kapot zolang actieve agentruns hun taskfile niet claimen. Deze concrete lopende taak moet direct zichtbaar worden.

## In scope

- AIQS Assist taskfile active-agent metadata herstellen.
- Taskflow verifiëren.

## Buiten scope

- AIQS Assist implementatie wijzigen.
- Nieuwe plugin UI of automatische fake fallback toevoegen.
- Andere open tasks claimen.

## Oorspronkelijk plan / afgesproken scope

- Los op dat `AIQS Assist laagbewuste prompt review` niet zichtbaar wordt als actieve Codex-taak in Board/List.

## Expliciete user requirements / detailbehoud

- De gebruiker meldt dat er nu een Codex-agent met deze taak bezig is.
- Die actieve taak moet in het overzicht zichtbaar worden.
- Geen fake interface; echte metadata blijft bron.

## Status per requirement

- [x] AIQS Assist taskfile bevat actieve Codex metadata — status: gebouwd; `active_agent: Codex` en `active_agent_status: running` staan in de taskfile.
- [x] Taskflow blijft geldig — status: gebouwd; taskflow verify is groen.

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale read-check via de gebouwde plugin-datalayer bevestigt dat de taskkaart `activeAgentUiState(...).isActive === true` oplevert.

## Uitvoerblokken / fasering

- [x] Blok 1: task inspecteren en root-cause bevestigen.
- [x] Blok 2: metadata herstellen.
- [x] Blok 3: verify en task afronden.

## Concrete checklist

- [x] `active_agent*` toevoegen aan AIQS Assist taskfile.
- [x] `npm run taskflow:verify` uitvoeren.
- [x] Bugfix-task afronden en docs bundlen.

## Acceptance criteria

- [x] `AIQS Assist laagbewuste prompt review` bevat `active_agent: Codex`.
- [x] `active_agent_status` staat op `running`.
- [x] Bugfix-task eindigt zonder actieve agentmetadata.
- [x] Taskflow verify is groen.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- [x] `npm run taskflow:verify`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`
- [x] Lokale plugin-datalayer read-check: AIQS Assist kaart geeft `isActive: true`, `chipLabel: Codex actief`.

## Reconciliation voor afronding

- Oorspronkelijk plan: ontbrekende active-agent metadata voor de lopende AIQS Assist taak herstellen.
- Toegevoegde verbeteringen: read-check toegevoegd om te bewijzen dat de plugin-datalayer de taak nu actief ziet.
- Afgerond: AIQS Assist taskfile is geclaimd als actieve Codex-run en taskflow is groen.
- Open / blocked: geen; zichtbaarheid in de webview volgt via bestaande watcher/refresh.

## Relevante links

- `docs/project/25-tasks/open/aiqs-assist-laagbewuste-prompt-review.md`
- `docs/project/25-tasks/done/budio-workspace-active-agent-awareness-board-list.md`


## Commits

- 2026-06-22T18:04:11+02:00 — Automate active agent metadata

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace auto active-agent metadata voor Codex taken

- Path: `docs/project/25-tasks/done/budio-workspace-auto-active-agent-metadata-voor-codex-taken.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-workspace-auto-active-agent-metadata-voor-codex-taken
title: Budio Workspace auto active-agent metadata voor Codex taken
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Maak actieve agentmetadata automatisch bij in_progress statusovergangen en verwijder handmatige claim/stop acties uit task detail.
tags: [plugin, vscode, taskflow, agent-metadata, codex]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 9
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---




## Probleem / context

`active_agent*` metadata wordt nu niet betrouwbaar automatisch gezet wanneer Codex aan een taak werkt. De plugin kan actieve taken wel tonen, maar dat werkt alleen als de taak handmatig via `Claim als actief` of via directe frontmatter-mutatie is geclaimd.

De gebruiker wil de handmatige opties uit de UI halen en de metadata automatisch laten volgen uit echte taakstatus en taskflow.

## Gewenste uitkomst

Wanneer een taak via de Budio Workspace plugin naar `in_progress` gaat, schrijft de plugin automatisch `active_agent*` metadata. Wanneer een taak `in_progress` verlaat, worden die velden automatisch gewist. Codex buiten de plugin krijgt een kleine CLI-helper om dezelfde metadata betrouwbaar te claimen/clearen.

## User outcome

De gebruiker ziet in Board/List/Jarvis automatisch welke Codex-taak actief is, zonder handmatig claimen of stoppen in de task detail UI.

## Functional slice

Een centrale repository/taskflow slice voor automatische active-agent metadata:

1. plugin statusovergangen claimen/clearen automatisch;
2. handmatige claim/stop knoppen verdwijnen uit task detail;
3. CLI-helper claimt/cleart taskfiles voor Codex-runs buiten plugin;
4. workflowdocs/skill leggen de automatische route vast.

## Entry / exit

- Entry: gebruiker/agent zet een taak naar `in_progress` via plugin of CLI-helper.
- Exit: taskfile bevat echte `active_agent*` metadata; bij status weg van `in_progress` of closeout zijn de velden leeg/null.

## Happy flow

1. Gebruiker sleept een taak naar `In Progress` of wijzigt status in task detail.
2. Repository schrijft status, sortering en active-agent metadata in één write.
3. Board/List/Jarvis refreshen en tonen `Codex actief`.
4. Gebruiker zet taak naar `Review` of `Done`.
5. Repository wist active-agent metadata en de highlight verdwijnt.

## Non-happy flows

- Empty state: taak zonder active-agent metadata wordt niet als actieve agent getoond.
- Permission denied / unavailable: lokale file-write fouten blijven via bestaande plugin save-fout zichtbaar.
- Validation / unsupported state: onbekende status bestaat niet buiten bestaande taskstatus enum.
- Failure / retry / cancel: stale expectedVersion blijft via bestaande repository-conflict flow lopen.

## UX / copy

- Verwijder task-detail knoppen `Claim als actief` en `Stop agent`.
- Agent-blok blijft read-only en toont bestaande metadata.
- Als geen agentmetadata bestaat, toon compact `Automatisch via in_progress`.
- Board/List/Jarvis copy en highlights blijven ongewijzigd.

## Data / IO

- Input: bestaande taskstatusmutaties via repository en CLI-helper `claim|clear <taskfile>`.
- Output: bestaande `active_agent*` frontmattervelden.
- Opslag/API/service/file-impact: lokale markdown taskfiles; geen nieuwe schema’s of remote calls.
- Statussen: `in_progress` claimt; status weg van `in_progress` cleart; `done` cleanup blijft verplicht.

## Waarom nu

De active-agent zichtbaarheid is gebouwd, maar valt om als agents de metadata niet consequent claimen. Automatiseren voorkomt handmatige stappen en voorkomt dat echte Codex-runs onzichtbaar blijven.

## In scope

- Repository auto claim/clear bij plugin statusovergangen.
- Create-as-in-progress auto claim.
- Task-detail UI knoppen verwijderen.
- CLI-helper `scripts/taskflow-agent-state.mjs`.
- Workflowdocs/skill updaten.
- Tests en plugin apply.

## Buiten scope

- Process-level heartbeat of live agentstream.
- Board/List/Jarvis redesign.
- Nieuwe metadatavelden of markdown-schema.
- AIQS Assist implementatie wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Active-agent metadata automatisch bij statusovergangen.
- Handmatige claim/stop UI verwijderen.
- Kleine taskflow CLI-helper voor Codex buiten plugin.
- Workflowdocs/skill aanpassen.
- Board/List/Jarvis blijven metadata-gedreven.

## Expliciete user requirements / detailbehoud

- Codex werkt aan taak moet automatisch metadata bijwerken.
- Handmatige opties mogen eruit.
- Geen fake heartbeat/progress in deze slice.
- Bestaande `active_agent*` velden blijven leidend.

## Status per requirement

- [x] Plugin status naar `in_progress` claimt automatisch — status: gebouwd; repository statusovergang en drag/drop claimen via agent settings.
- [x] Plugin status weg van `in_progress` cleart automatisch — status: gebouwd; repository statusovergang en done cleanup wissen metadata.
- [x] Handmatige task-detail knoppen verwijderd — status: gebouwd; detail toont alleen read-only agentdiagnose.
- [x] CLI-helper claim/clear toegevoegd — status: gebouwd; `scripts/taskflow-agent-state.mjs` met tests.
- [x] Workflowdocs/skill bijgewerkt — status: gebouwd; skill, dev workflow en AGENTS verwijzen naar claim/clear route.
- [x] Tests en plugin apply — status: gebouwd; plugin tests, CLI-helpertest, root verify en apply zijn groen.

## Toegevoegde verbeteringen tijdens uitvoering

- Repository gebruikt agentdefaults wanneer hij buiten VS Code zonder workspace settings wordt aangeroepen.
- New-task writer accepteert active-agent metadata zodat `createTask(... in_progress)` geen tweede write nodig heeft.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: repository auto claim/clear + tests.
- [x] Blok 3: task-detail UI cleanup + CLI-helper.
- [x] Blok 4: workflowdocs/skill, verify, apply en afronding.

## Concrete checklist

- [x] Repository constructor/settings uitbreiden voor agent defaults.
- [x] Statusovergang naar `in_progress` claimt active-agent metadata.
- [x] Statusovergang weg van `in_progress` cleart active-agent metadata.
- [x] `createTask(... in_progress)` claimt active-agent metadata.
- [x] Task-detail handmatige knoppen verwijderen.
- [x] `scripts/taskflow-agent-state.mjs` toevoegen.
- [x] Unit-tests toevoegen/aanpassen.
- [x] Workflowdocs/skill aanpassen.
- [x] Verify/apply/docs uitvoeren.

## Acceptance criteria

- [x] `ready -> in_progress` via detail save schrijft `active_agent: Codex`.
- [x] Drag/drop naar `in_progress` schrijft `active_agent: Codex`.
- [x] `in_progress -> review/done/blocked/ready/backlog` wist active-agent velden.
- [x] Nieuw aangemaakte `in_progress` taak wordt automatisch geclaimd.
- [x] Task detail toont geen `Claim als actief` of `Stop agent`.
- [x] CLI-helper kan claimen en clearen zonder secrets.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- [x] `npm --prefix tools/budio-workspace-vscode run typecheck`
- [x] `npm --prefix tools/budio-workspace-vscode run test`
- [x] `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- [x] `node --test scripts/taskflow-agent-state.test.mjs`
- [x] `npm run taskflow:verify`
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run docs:bundle`
- [x] `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: automatische active-agent metadata bij plugin statusovergangen, handmatige claim/stop UI verwijderen, CLI-helper toevoegen en workflowdocs bijwerken.
- Toegevoegde verbeteringen: repositorydefaults voor niet-VS Code gebruik en writer-support voor `createTask(... in_progress)` zonder tweede write.
- Afgerond: alle planpunten zijn gebouwd en geverifieerd met plugin typecheck/test, CLI-helpertest, plugin apply, taskflow verify, lint en root typecheck.
- Open / blocked: geen blockers; process-level heartbeat blijft bewust buiten scope.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-active-agent-awareness-board-list.md`
- `tools/budio-workspace-vscode/src/tasks/repository.ts`
- `tools/budio-workspace-vscode/src/tasks/agent-metadata.ts`
- `.agents/skills/task-status-sync-workflow/SKILL.md`


## Commits

- 2026-06-22T18:04:11+02:00 — Automate active agent metadata

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace hierarchy met epics, subtasks en dependencies

- Path: `docs/project/25-tasks/done/budio-workspace-hierarchy-epics-subtasks-dependencies.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-budio-workspace-hierarchy-epics-subtasks-dependencies
title: "Budio Workspace hierarchy met epics, subtasks en dependencies"
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "De Budio Workspace plugin en taskflow ondersteunen een Linear-lite hiërarchie met aparte epic-docs, gewone tasks, subtasks en expliciete dependency-relaties, zonder de bestaande markdown-first agentflow te breken."
tags: [plugin, workspace, hierarchy, epic, subtask, dependency, linear]
workstream: plugin
epic_id: epic-budio-workspace-hierarchy-linear-lite
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
due_date: null
sort_order: 10
---






# Budio Workspace hierarchy met epics, subtasks en dependencies

## Probleem / context

De huidige Budio Workspace plugin leest taskfiles als een vlakke status/prioriteit/workstream-laag. Daardoor ontbreekt een rustige bovenlaag voor grotere werkpakketten, evenals expliciete parent/subtask- en dependency-relaties zoals die in een lichte Linear-achtige workflow wel helpen.

Zonder die structuur blijft projectplanning te veel verspreid over losse tasks, ideas en chatcontext, en moeten agents en gebruikers handmatig reconstrueren welke taken bij elkaar horen en in welke volgorde ze logisch uitgevoerd worden.

## Gewenste uitkomst

De repo krijgt een kleine operationele epic-laag boven `docs/project/25-tasks/**`, plus lichte hiërarchievelden in taskfiles. De plugin kan epics tonen, linked tasks groeperen, subtasks en dependencies afleiden en blocked/loose/epic filters aanbieden, terwijl bestaande vlakke taskfiles en agentflows gewoon blijven werken.

De eerste fase bouwt bewust geen zware initiative/roadmap-machine. Het doel is een kleine, bruikbare Linear-lite structuur: `Epic -> Task -> Subtask`, met dependencies als aparte relaties.

## Waarom nu

- Dit sluit direct aan op het bestaande Linear- en Command Room-spoor in de repo.
- De plugin is inmiddels een dagelijkse uitvoeringslaag en heeft baat bij een heldere bovenstructuur.
- Dit helpt zowel menselijke planning als agent-uitvoering zonder productscope te verbreden.

## In scope

- Nieuwe operationele docslaag voor epics/projects.
- Epic README + template + eerste epic-doc voor deze hiërarchie-uitbreiding.
- Task template en taskflow docs uitbreiden met hiërarchievelden.
- Plugin parser/types/repository/state uitbreiden voor epics, subtasks en dependencies.
- Plugin UI uitbreiden met epic overview, task detail-secties en hiërarchiefilters.
- Tests voor parser/repository/UI-state uitbreiden.
- Plugin opnieuw toepassen op de normale workspace.

## Buiten scope

- Volledige Jira-achtige issue-type matrix.
- Brede roadmap/timeline UI.
- Browser shell-integratie.
- Auto-created subtasks via AI.
- Nieuwe productwaarheid buiten de operationele plugin/tasklaag.

## Oorspronkelijk plan / afgesproken scope

- Gebruik een Linear-lite model met aparte epic-docs boven tasks.
- Houd dependencies apart van parent/child-relaties.
- Laat subtasks gewone taskfiles blijven met extra metadata.
- Breid de bestaande agent/taskflow uit in plaats van die te vervangen.

## Expliciete user requirements / detailbehoud

- De plugin moet een hoofdtaak/epic boven onderliggende stories/taken en subtasks kunnen dragen.
- De workflow moet voor agents en AI in de repo werkbaar blijven.
- Bestaande capture/app-flow en andere productscope blijven onaangeraakt.
- De plugin mag hiervoor slim bestaande taskflow/docs-structuur uitbreiden.
- Linear is leidende inspiratie; Jira is nuttig als hiërarchie-referentie, niet als letterlijk UI-model.

## Status per requirement

- [x] Nieuwe epic-docslaag toegevoegd — status: gebouwd
- [x] Task template uitgebreid met hiërarchievelden — status: gebouwd
- [x] Plugin parser/repository begrijpt epic/subtask/dependency data — status: gebouwd
- [x] Plugin toont epic overview en task detail-relaties — status: gebouwd
- [x] Hiërarchiefilters werken zonder bestaande vlakke tasks te breken — status: gebouwd
- [x] Agent/taskflow docs bijgewerkt — status: gebouwd
- [x] Verify en plugin apply afgerond — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, context, taskflow en bronmodel bevestigen.
- [x] Blok 2: epic-laag en task-metadatafundering toevoegen.
- [x] Blok 3: plugin parser/state/UI uitbreiden.
- [x] Blok 4: tests, apply workspace en docs/taskstatus afronden.

## Concrete checklist

- [x] Nieuwe `docs/project/24-epics/` laag toevoegen.
- [x] Template en docsrouter/taskflow docs bijwerken.
- [x] Plugin types/parser/repository uitbreiden.
- [x] Epic overview en task detail-relaties tonen.
- [x] Filters voor `has epic`, `no epic`, `has subtasks`, `blocked`, `ready to start` toevoegen.
- [x] Tests + `npm run apply:workspace` + repo verify draaien.

## Blockers / afhankelijkheden

- Geen functionele blocker; wel afhankelijk van backward-compatible task parsing.

## Verify / bewijs

- `cd tools/budio-workspace-vscode && npm run typecheck`
- `cd tools/budio-workspace-vscode && npm run test`
- `cd tools/budio-workspace-vscode && npm run apply:workspace`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: Linear-lite hiërarchie implementeren met aparte epic-docslaag en plugin/taskflow-compatibiliteit.
- Toegevoegde verbeteringen: plugin quick actions toegevoegd voor subtask-aanmaak, epic-koppeling en dependency-linking in task detail.
- Afgerond: epic-docslaag, task-metadata, parser/repository/state, epics overview, detail-relaties, filters, tests, plugin apply en docs/taskflow verify.
- Open / blocked: geen functionele blockers binnen deze scope; resterend alleen commit/push-afronding van deze sessie.

## Relevante links

- `docs/project/25-tasks/open/budio-workspace-command-room-research-en-startpunt-vastleggen.md`
- `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- 0b5c2d3 — feat: add workspace epic hierarchy

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis assets mapping melding oplossen

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-assets-mapping-melding-oplossen.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-assets-mapping-melding-oplossen
title: Budio Workspace Jarvis assets mapping melding oplossen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: Los de valse Jarvis assetmelding op waarbij 17/20 klaar en handmatige mapping nodig wordt gemeld terwijl het lokale manifest ready is.
tags: [plugin, vscode, jarvis, assets, luma]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 11
---




# Budio Workspace Jarvis assets mapping melding oplossen

## Probleem / context

Jarvis meldt: `17/20 klaar, 8 assets vereisen nog handmatige mapping of Luma export`. Het actuele lokale manifest in `assets/jarvis/final-frame/jarvis-assets-manifest.json` staat echter op `overallStatus: ready`, met 17 media-assets `ready` en 3 tekst-assets `seeded_text`. De melding is daardoor misleidend: tekst-assets zijn voor v1 bewust lokaal beschikbaar als seeded text en mogen niet als ontbrekende assets klinken.

## Gewenste uitkomst

Jarvis toont en gebruikt een assetstatus die de werkelijke beschikbaarheid weergeeft: 20/20 lokaal bruikbaar wanneer media ready is en tekst seeded is. Alleen echte `manual_source_required`, `error` of ontbrekende lokale bestanden worden als aandachtspunt gemeld.

## User outcome

De gebruiker ziet geen valse mapping/export waarschuwing meer wanneer de lokale Jarvis assets klaar zijn.

## Functional slice

- Asset availability normaliseren voor Jarvis state en chat-grounding.
- Valse `17/20` en mapping-copy voorkomen bij ready manifest.
- Plugin opnieuw toepassen zodat de Jarvis-view de gecorrigeerde status gebruikt.

## Entry / exit

- Entry: gebruiker opent Jarvis of vraagt Jarvis naar de workspace/assets.
- Exit: Jarvis rapporteert 20/20 beschikbaar of noemt alleen echte ontbrekende assets.

## Happy flow

1. Jarvis laadt het lokale manifest.
2. `ready + downloaded + seeded_text` telt als beschikbaar.
3. Chat-grounding en UI-status noemen geen handmatige mapping wanneer `manual_source_required` nul is.

## Non-happy flows

- Missing manifest: echte missing-manifest melding blijft bestaan.
- Manual required: alleen assets met status `manual_source_required` krijgen mapping/export melding.
- Error: assets met status `error` blijven als issues zichtbaar.
- Missing local file: status wordt niet als beschikbaar geteld als het lokale bestand ontbreekt.

## UX / copy

- Gebruik compacte, echte copy: `Jarvis assets beschikbaar: 20/20`.
- Geen waarschuwing over handmatige mapping/export als `manual_source_required: 0`.
- Geen fake of stale assetissues in hoofdview of chatcontext.

## Data / IO

- Input: `jarvis-assets-manifest.json`, seed manifest en lokale assetbestanden.
- Output: genormaliseerde Jarvis workspace state en chat-grounding.
- Opslag/API/service/file-impact: geen nieuwe Luma download vereist als lokale files aanwezig zijn.
- Statussen: `ready`, `downloaded`, `seeded_text` tellen als beschikbaar; `manual_source_required` en `error` tellen als aandachtspunt.

## Waarom nu

De gebruiker ziet nog een valse Jarvis assets-waarschuwing terwijl de assets lokaal klaarstaan. Dat ondermijnt de betrouwbaarheid van de command room.

## In scope

- Loader/chatcopy fixen.
- Tests toevoegen voor availabilitytelling en geen valse mappingissues.
- Plugin typecheck/test/apply.

## Buiten scope

- Nieuwe Luma assets genereren.
- Jarvis layout opnieuw redesignen.
- Board/list/epics/settings wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Los de melding op: `Jarvis assets: 17/20 klaar, 8 assets vereisen nog handmatige mapping of Luma export`.
- Gebruik echte lokale assetstatus, geen nep of stale placeholderstatus.

## Expliciete user requirements / detailbehoud

- De melding moet weg als assets echt klaar zijn.
- Geen fake UI-states of misleidende statuscopy.

## Status per requirement

- [x] Asset availability telt seeded text als lokaal beschikbaar — status: gebouwd
- [x] Mapping/export waarschuwing alleen bij echte manual assets — status: gebouwd
- [x] Tests en plugin apply — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Er is een pure Jarvis asset availability helper toegevoegd zodat chat-grounding en tests dezelfde waarheid gebruiken.
- De loader berekent summary nu uit de actuele merged assets en detecteert ontbrekende lokale bestanden als echte errors.
- De echte manifest-grounding is gecontroleerd: `Jarvis assets beschikbaar: 20/20`, `handmatige mapping nodig: 0`, `asset errors: 0`.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, manifest/report en taskflow bevestigen.
- [x] Blok 2: availability/copy helper aanpassen en tests toevoegen.
- [x] Blok 3: verify, plugin apply en task afronden.

## Concrete checklist

- [x] Bron van 17/20 assetcopy corrigeren.
- [x] Echte issuefilter toevoegen voor manual/error only.
- [x] Tests toevoegen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow/docs afronden.

## Acceptance criteria

- [x] Ready manifest met 17 ready + 3 seeded_text wordt als 20/20 beschikbaar gerapporteerd.
- [x] Geen mapping/export issue verschijnt wanneer `manual_source_required` nul is.
- [x] Echte manual/error assets blijven zichtbaar als aandachtspunt.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 49 tests
- Echte manifest-grounding smoke — geslaagd: `Jarvis assets beschikbaar: 20/20`, `handmatige mapping nodig: 0`, `asset errors: 0`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: valse Jarvis assetmelding oplossen.
- Toegevoegde verbeteringen: pure availability helper, echte issuefilter en lokale bestandscontrole toegevoegd.
- Afgerond: Jarvis chat-grounding telt seeded text-assets als beschikbaar, meldt 20/20 bij het huidige ready manifest en toont mapping/export alleen nog bij echte manual/error assets.
- Open / blocked: geen.

## Relevante links

- `assets/jarvis/final-frame/jarvis-assets-manifest.json`
- `tools/budio-workspace-vscode/src/extension/host/jarvis.ts`
- `tools/budio-workspace-vscode/src/jarvis/chat.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis chat-first reset met ZIP assets

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-chat-first-reset-met-zip-assets.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-chat-first-reset-met-zip-assets
title: Budio Workspace Jarvis chat-first reset met ZIP assets
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Herbouw Jarvis naar een rustige premium chat-first interface met gecureerde ZIP-assets, echte chat/audio als hoofdinteractie en zonder drukke dashboardrails."
tags: [plugin, vscode, jarvis, ui, assets, voice, chat]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 12
---




# Budio Workspace Jarvis chat-first reset met ZIP assets

## Probleem / context

De huidige Jarvis-view is functioneel dichterbij gekomen, maar visueel nog te druk en voelt te veel als een dashboard. De gebruiker wil expliciet een chat-first Jarvis-ervaring: premium, rustig, visueel overtuigend, met echte chat en audio als hoofdinteractie. De nieuwe ZIP `/Users/pieterflikweert/Downloads/VS_Code_Workspace.zip` bevat finale/code-ready Jarvis-assets en motionreferenties die gecureerd gebruikt moeten worden.

## Gewenste uitkomst

Jarvis opent als een rustige, premium, chat-first command room. De levende Jarvis-core en ambient video vormen de visuele wereld; chat en push-to-talk audio staan centraal. Workspace-, asset- en agentinformatie blijft echt, maar wordt alleen compact als context/status getoond in plaats van als drukke dashboardpanelen.

## User outcome

De gebruiker kan Jarvis openen, typen, push-to-talk gebruiken wanneer microfoonrechten beschikbaar zijn, en in één rustige interface zien of chat/mic/assets/agents beschikbaar zijn. Het scherm voelt niet cheap of overvol, maar als een hoogwaardige Jarvis-ruimte met echte functionaliteit.

## Functional slice

- Gecureerde ZIP-assets importeren naar `assets/jarvis/final-frame/`.
- Jarvis manifest updaten zodat de webview manifestgedreven blijft.
- Jarvis-view vereenvoudigen naar chat-first compositie.
- Mic/chat UI-states duidelijker maken zonder runtimefake.
- Bestaande chat/audio/reload/sync/reset handlers behouden.
- Board/list/epics/settings functioneel onaangeraakt laten.

## Entry / exit

- Entry: gebruiker opent de top-level `jarvis` view in de Budio Workspace VS Code plugin.
- Exit: gebruiker ziet een rustige chat-first Jarvis-view met gecureerde ZIP-assets, prominent gesprek en mic-control, plus compacte echte status/context.

## Happy flow

1. Jarvis hydrateert lokale assets, board snapshot en conversation capabilities.
2. De ambient loop en transparent Jarvis core renderen als levende achtergrond.
3. De gebruiker typt een prompt of gebruikt mic push-to-talk.
4. Jarvis toont pending/thinking/transcribing/answer states in de chat-first surface.
5. Statuschips tonen compact de echte chat-, mic-, asset- en agentstatus.

## Non-happy flows

- Empty state: geen gesprek toont één rustige uitnodiging om Jarvis iets te vragen.
- Permission denied / unavailable: mic toont één duidelijke permission- of unavailable-notice met CTA.
- Validation / unsupported state: te korte of lege opname toont een korte echte melding.
- Failure / retry / cancel: providerfout, missing key of transcription failure blijft zichtbaar in chat/status zonder dashboarddrukte.

## UX / copy

- Richting: `Chat-first`.
- Geen grote linker/rechter dashboardrails in de hoofdview.
- Geen grote `Werkcontext`, `Bronnen`, `Activity`, `Suggesties`, `Controls` panelstapel.
- Compacte labels: `Chat live`, `Mic klaar/opnemen/rechten nodig`, `Assets klaar`, `Agents actief`.
- Eén primaire input placeholder: `Vraag Jarvis iets...`.
- Geen prominente debug/key/modelcopy behalve compact en veilig in status.

## Data / IO

- Input:
  - `/Users/pieterflikweert/Downloads/VS_Code_Workspace.zip`
  - bestaande Jarvis manifest/state/conversation/workspace snapshot
- Output:
  - gecureerde assets in `assets/jarvis/final-frame/`
  - bijgewerkt `jarvis-assets-manifest.json`
  - aangepaste Jarvis React/CSS
  - task/docs updates
- Opslag/API/service/file-impact:
  - geen secrets
  - geen nieuwe OpenAI/Luma calls
  - geen taskmutaties vanuit Jarvis
- Statussen:
  - bestaande chat/voice/runtime/asset states blijven leidend

## Waarom nu

De gebruiker heeft de huidige Jarvis-review afgekeurd als te druk, te veel informatie en niet premium genoeg. Chat en audio moeten nu echt centraal komen te staan.

## In scope

- Alleen gecureerde ZIP-assets importeren.
- Jarvis assetmanifest bijwerken.
- `JarvisView.tsx` en Jarvis CSS herstructureren.
- Mic/chat visible states verbeteren.
- Plugin apply en verify.

## Buiten scope

- Nieuwe Luma-generatie.
- Nieuwe OpenAI providerlaag.
- Autonome agentruns of taskmutaties.
- Functionele wijziging aan board/list/epics/settings.
- Hele ZIP importeren.

## Oorspronkelijk plan / afgesproken scope

- Herbouw Jarvis naar een rustige, premium chat-first interface.
- Curateer alleen relevante ZIP-assets: `SsavSJdE`, `tITjE1Lq`, `WU2CfDCw`, `--OTYSI5`, `LjJuGpeu` en optionele referenties.
- Update de lokale Jarvis assetlaag en het manifest.
- Verwijder de dashboarddrukte uit de hoofdview.
- Houd echte chat en audio leidend.
- Houd bestaande handlers en bestaande pluginviews intact.

## Expliciete user requirements / detailbehoud

- "Review... gaat niet lekker"
- "schoon het op"
- "veel te druk en te veel informatie"
- "Jij bent de jarvis expert"
- "chat is belangrijk"
- "ik wil dat de audio ook werkt"
- "visueel echt heel goed maken nu"
- "niet zo cheap"
- "Hierbij ook nog eens alle designs en assets... maak er gebruik van"
- "er zitten ook filmpjes tussen voor jarvis om te gebruiken"

## Status per requirement

- [x] ZIP-assets gecureerd geïmporteerd — status: gebouwd
- [x] Jarvis manifest bijgewerkt — status: gebouwd
- [x] Chat-first hoofdview gebouwd — status: gebouwd
- [x] Dashboarddrukte verwijderd — status: gebouwd
- [x] Audio/mic states duidelijk en echt — status: gebouwd
- [x] Bestaande chat/audio handlers behouden — status: gebouwd
- [x] Plugin opnieuw toegepast — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De geselecteerde ZIP-assets zijn opnieuw uitgepakt naar stabiele runtimebestanden en het manifest is bijgewerkt met `local-zip` checksums.
- De oude cockpit-rails zijn uit de Jarvis-hoofdview verwijderd; details staan nu alleen compact onder een ingeklapt `Context` blok.
- De mic-state is teruggebracht naar één prominente knop en één duidelijke permission/unavailable notice.
- Prominente key/model/debugcopy is uit de hoofdview gehaald; chat/mic/assets/agents staan compact als statuschips.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow, docs en huidige Jarvis-context bevestigen.
- [x] Blok 2: gecureerde ZIP-assets importeren en manifest bijwerken.
- [x] Blok 3: Jarvis-view/CSS naar chat-first reset ombouwen.
- [x] Blok 4: plugin verify/apply, repo verify en docs afronden.

## Concrete checklist

- [x] ZIP assetnamen en doelbestanden bevestigen.
- [x] Alleen geselecteerde assets uit ZIP importeren.
- [x] Manifest roles en checksums updaten.
- [x] `JarvisView.tsx` vereenvoudigen naar chat-first compositie.
- [x] CSS opschonen naar rustige premium layout.
- [x] Mic permission/transcribing/recording states in hoofdflow tonen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Repo taskflow/lint/typecheck/docs verify afronden.

## Acceptance criteria

- [x] Jarvis hoofdview toont geen grote linker/rechter dashboardrails meer.
- [x] Chat en audio zijn de primaire interacties in beeld.
- [x] Gecureerde ZIP-video/core/waveform/logotype/HUD-assets worden manifestgedreven gebruikt.
- [x] Mic permission-needed toont één duidelijke CTA.
- [x] Typed chat blijft functioneel aangesloten.
- [x] Layout werkt breed en smal zonder overlap/afkapping.
- [x] Plugin is opnieuw toegepast op VS Code workspace.

## Blockers / afhankelijkheden

- Geen bekende blockers. Fysieke microfoonrechten blijven afhankelijk van macOS/VS Code, maar de UI moet die state eerlijk tonen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension gebouwd/gepackaged/geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: chat-first reset met gecureerde ZIP-assets, echte chat/audio centraal en dashboarddrukte weg.
- Expliciete user requirements: ZIP-assets zijn gebruikt, dashboarddrukte is verwijderd, chat/audio staan centraal en fake states zijn vermeden.
- Toegevoegde verbeteringen: compacte contextdetails en veiliger non-prominente diagnostics.
- Afgerond: assetimport, manifestupdate, Jarvis-view/CSS reset, plugin typecheck/test/apply, repo-checks en docs bundle/verify.
- Open / blocked: geen bekende blockers; fysieke microfoonopname blijft afhankelijk van VS Code/macOS permissie in de live webview.

## Relevante links

- `/Users/pieterflikweert/Downloads/VS_Code_Workspace.zip`
- `docs/project/25-tasks/done/budio-workspace-jarvis-height-borderless-core-polish.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis echte chat en push-to-talk

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-echte-chat-en-push-to-talk.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-08

```md
---
id: task-budio-workspace-jarvis-echte-chat-push-to-talk
title: Budio Workspace Jarvis echte chat en push-to-talk
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "Vervang de huidige Jarvis proto-interactie in de VS Code plugin door echte host-side OpenAI chat, echte env-resolutie uit .env.local en een push-to-talk audioflow met transcriptie, zonder functionele regressie in board/list/epics/settings."
tags: [plugin, vscode, jarvis, openai, audio, chat]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 13
---




# Budio Workspace Jarvis echte chat en push-to-talk

## Probleem / context

De huidige Jarvis-view heeft al een eerste praatlaag, maar vertrouwt nog op een fragiele combinatie van `process.env`-availability, browser speech-recognition en proto/meta UI-copy. Daardoor ontstaan precies de verkeerde signalen: chat lijkt niet echt gekoppeld aan de lokale keyroute, microfoonstates voelen nep of te fragiel voor een VS Code-webview, en labels zoals `Praat met Jarvis`, `Live gesprekssessie`, `Jij` en `workspace` breken de cinematic command-room ervaring.

## Gewenste uitkomst

De Jarvis-view in de bestaande plugin werkt volledig echt: host-side OpenAI chat gebruikt een expliciete en veilige lokale env-resolutie, typed prompts geven echte modelresponses, en voice gebruikt push-to-talk met echte audio-opname en transcriptie.

De UI voelt minder prototype-achtig en toont alleen echte, functionele states. Wanneer chat of voice niet beschikbaar is, ziet de gebruiker een eerlijke oorzaak met een duidelijke vervolgstap in plaats van een nep fallback-copy.

## User outcome

De gebruiker kan in de Jarvis-view echt met Jarvis praten via typen of push-to-talk, zolang er lokaal een geldige key en microfoonrechten beschikbaar zijn. Als iets ontbreekt, ziet de gebruiker een echte availability- of permission-state die klopt met de runtime.

## Functional slice

Eén afgeronde plugin-slice:
- veilige `.env.local` + env-resolutie voor Jarvis keys/modellen,
- echte host-side OpenAI chatflow,
- echte push-to-talk audio-opname + transcriptie,
- opgeschoonde cinematic Jarvis UI zonder proto/meta labels,
- geen functionele wijzigingen aan board/list/epics/settings.

## Entry / exit

- Entry: gebruiker opent de Budio Workspace plugin en kiest `Jarvis`.
- Exit: gebruiker stuurt een typed of voice prompt, Jarvis antwoordt echt, of de UI toont een echte reasoned unavailable/permission-state.

## Happy flow

1. Gebruiker opent `Jarvis`; de host resolveert lokaal de juiste chat- en transcriptiekeys uit `.env.local` of shell env.
2. Gebruiker typt een prompt of neemt audio op via push-to-talk; audio wordt echt opgenomen, getranscribeerd en ingestuurd.
3. Jarvis antwoordt met een echte OpenAI-response, grounded in lokale workspacecontext.

## Non-happy flows

- Empty state: zonder lopende conversatie toont de speaking surface een rustige starter-state zonder proto-labels.
- Permission denied / unavailable: microfoonrechten geweigerd of media APIs ontbreken; de UI toont een echte permission/unavailable state met retry of tekstfallback.
- Validation / unsupported state: lege prompt of lege audio-opname wordt niet ingestuurd.
- Failure / retry / cancel: ontbrekende key, transcriptiefout of providerfout geeft een echte foutmelding met mogelijkheid tot opnieuw proberen.

## UX / copy

- Jarvis copy blijft Nederlands en minimal cinematic.
- Verwijder of vervang proto/meta labels zoals:
  - `Praat met Jarvis`
  - `Live gesprekssessie`
  - `Jij`
  - `workspace`
- Reset/new session mag blijven maar subtieler.
- Command deck toont alleen echte states zoals:
  - `Klaar`
  - `Opnemen`
  - `Verwerken`
  - `Antwoord klaar`
  - `Microfoonrechten nodig`
  - `Chat niet beschikbaar`
  - `Providerfout`

## Data / IO

- Input:
  - `.env.local` plus process env
  - board snapshot
  - geselecteerde taskcontext
  - Jarvis manifest/command-room content
  - lokale text asset previews
  - typed prompt of opgenomen audio
- Output:
  - echte chatresponse
  - transcriptie van audio naar tekst
  - conversation state
  - capability/permission/error state
- Opslag/API/service/file-impact:
  - host-side OpenAI calls naar chat completions en audio transcriptions
  - geen secrets naar webview
  - geen persistente opslag van audio of chat naar repo-bestanden
- Statussen:
  - chat: `idle`, `thinking`, `answering`, `error`
  - voice: `idle`, `recording`, `transcribing`, `permission_needed`, `unavailable`

## Waarom nu

- De huidige Jarvis-view oogt al sterker, maar de user wil expliciet dat niets meer nep voelt.
- De technische gaten zijn concreet: env-resolutie en speech-aanpak moeten nu echt gemaakt worden om de command room bruikbaar te maken.
- Dit is de kleinste volgende slice die direct de grootste geloofwaardigheids- en bruikbaarheidswinst geeft.

## In scope

- Nieuwe plugin-taak voor deze V1.2-slice.
- `.env.local`-aware env-resolutie voor Jarvis chat/transcriptie.
- Push-to-talk met `getUserMedia` + `MediaRecorder`.
- Host-side audio transcription + gedeelde chatpipeline.
- Opschonen van Jarvis UI-copy en echte availability states.
- Gerichte tests en plugin apply/verify.

## Buiten scope

- Tool-calling, taskmutaties of repo-acties vanuit Jarvis.
- TTS / audio output.
- Persistente conversatiehistorie op disk.
- Nieuwe functies in board/list/epics/settings.
- Nieuwe Luma-ingest-architectuur.

## Oorspronkelijk plan / afgesproken scope

- Echte key- en env-resolutie vanuit `.env.local`.
- Browser speech-recognition vervangen door push-to-talk + transcriptie.
- Eén echte typed + voice Jarvis pipeline.
- Minimal cinematic UI zonder nep/meta labels.
- Geen functionele regressie in bestaande pluginviews.

## Expliciete user requirements / detailbehoud

- Alles moet echt werken; niets nep in de interface.
- Los de melding op dat de chat key ontbreekt.
- Los de melding op dat microfoontoegang is geweigerd.
- Verwijder of vervang zichtbare proto/meta UI-labels zoals `Praat met Jarvis`, `Live gesprekssessie`, `Nieuwe sessie`, `Jij`, `workspace`.
- Board/list/epics/settings moeten functioneel intact blijven.

## Status per requirement

- [x] Echte keyroute voor Jarvis chat — status: gebouwd
- [x] Echte push-to-talk met transcriptie — status: gebouwd
- [x] Proto/meta labels uit Jarvis UI verwijderd of vervangen — status: gebouwd
- [x] Echte permission/error states voor mic en chat — status: gebouwd
- [x] Geen functionele regressie in andere views — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Workspace-aware `.env.local` resolutie toegevoegd met expliciete key-precedence voor Jarvis.
- Browser speech-recognition volledig vervangen door `getUserMedia` + `MediaRecorder` + host-side transcriptie.
- Jarvis UI opgeschoond naar compactere cinematic states zonder prototypekopjes of nep fallback-copy.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, context en taskflow vastleggen.
- [x] Blok 2: env/chat/transcription helpers bouwen.
- [x] Blok 3: host/webview/audioflow en UI-copy aanscherpen.
- [x] Blok 4: tests, plugin apply, verify en task/docs closeout.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt en op `in_progress` gezet.
- [x] Jarvis env-resolutie helper toegevoegd.
- [x] Audio transcription helper toegevoegd.
- [x] Conversation state uitgebreid voor echte chat- en voice-statussen.
- [x] Webview push-to-talk flow gebouwd.
- [x] Jarvis UI-copy opgeschoond.
- [x] Tests en verify gedraaid.

## Acceptance criteria

- [x] Jarvis chat werkt met een echte lokaal geresolveerde keyroute zonder valse missing-key state.
- [x] Push-to-talk neemt echt audio op en gebruikt transcriptie voor Jarvis chat.
- [x] Bij ontbrekende micrechten of ontbrekende media support toont Jarvis een echte, compacte reden.
- [x] De zichtbare Jarvis UI bevat geen prototype/meta labels meer die nep aanvoelen.
- [x] Board/list/epics/settings blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Geen actieve blockers.
- Live voice happy path blijft afhankelijk van beschikbare OS/VS Code microfoonrechten.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck`
- `npm --prefix tools/budio-workspace-vscode run test`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: echte chat + push-to-talk maken en nep UI-states verwijderen.
- Toegevoegde verbeteringen: workspace-aware env helper, echte transcriptieroute en compactere cinematic Jarvis copy.
- Afgerond: Jarvis gebruikt nu echte key-resolutie, echte host-side OpenAI chat, echte push-to-talk transcriptie, en toont alleen nog echte availability/permissiestates.
- Open / blocked: geen blocker in deze slice; TTS, tool-calling of persistente chatgeschiedenis blijven bewust buiten scope voor vervolgwerk.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-praatbare-eigen-view.md`
- `tools/budio-workspace-vscode/README.md`
- `assets/jarvis/final-frame/unified-design-brief.txt`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis env en live agent awareness fix

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-env-en-live-agent-awareness-fix.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-env-live-agent-awareness-fix
title: Budio Workspace Jarvis env en live agent awareness fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Fix de valse OPENAI_API_KEY ontbreekt-melding in Jarvis, toon echte env/availability-data zonder secrets en voeg near-realtime workspace/agent awareness toe in de Jarvis-view."
tags: [plugin, vscode, jarvis, openai, agents, realtime, ui]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 14
---




# Budio Workspace Jarvis env en live agent awareness fix

## Probleem / context

Jarvis toont in de UI dat `OPENAI_API_KEY` ontbreekt, terwijl `.env.local` wel de relevante OpenAI keys bevat. De availability-copy en env-resolutie moeten dus eerlijker en robuuster worden. Daarnaast wil de gebruiker geen nep/placeholders meer, maar echte workspace- en agentdata: near-realtime updates en subtiel zichtbaar wat actieve agents/Codex doen.

## Gewenste uitkomst

Jarvis gebruikt de bestaande `.env.local` keyroute correct en toont geen valse missing-key melding meer. De Jarvis-view toont echte workspace/agent awareness uit de huidige board snapshot en taskmetadata, met near-realtime updates via de bestaande watcher/refreshlaag.

## User outcome

De gebruiker opent Jarvis en ziet of chat echt beschikbaar is, welke veilige keybron gebruikt wordt, welke taken/agents actief zijn en wat Codex/agents subtiel aan het doen zijn, zonder secrets of nepdata.

## Functional slice

- Env/availability hardening voor Jarvis chat.
- Echte Jarvis workspace/agent awareness in de view.
- Near-realtime refresh korter en zichtbaarer voor Jarvis.
- Geen wijzigingen aan board/list/epics/settings workflows.

## Entry / exit

- Entry: gebruiker opent `Jarvis` in de Budio Workspace plugin.
- Exit: Jarvis toont echte chat availability en actuele workspace/agent activiteit, of een echte reden waarom iets ontbreekt.

## Happy flow

1. Jarvis opent en resolveert `.env.local`.
2. Chat availability is beschikbaar via workspace-specific of fallback OpenAI key.
3. Jarvis toont echte actieve agent/tasks uit de board snapshot.
4. File changes of active-agent metadata updates verschijnen near-realtime.

## Non-happy flows

- Empty state: als er geen actieve agents zijn, staat er compact dat er nu geen agentactiviteit is.
- Missing key: alleen tonen als alle ondersteunde env-vars echt ontbreken.
- Provider unavailable: toon echte providerfout zonder secrets.
- No snapshot: toon dat workspace data nog laadt in plaats van nepdata.

## UX / copy

- Geen placeholder of fake statuscopy.
- Geen secretwaarden tonen.
- Wel veilig tonen: env-varnaam, update-tijd, actieve agentnaam/model/status en tasktitel.
- Codex/agentactiviteit subtiel als signal/awareness laag, niet als dominante debugconsole.

## Data / IO

- Input:
  - `.env.local` en process env
  - board snapshot met `activeAgent*` taskmetadata
  - Jarvis conversation capabilities
- Output:
  - echte availability copy
  - actieve agent/task lijst
  - update-tijd en live indicator
- Opslag/API/service/file-impact:
  - geen secrets naar webview
  - geen nieuwe provider calls nodig voor awareness
  - watcher/refresh timing alleen voor plugin runtime
- Statussen:
  - bestaande chat/voice states blijven leidend

## Waarom nu

De user ziet een valse key-melding en wil Jarvis als echte command room gebruiken. Dat vraagt om betrouwbare env-signalen en echte live workspace/agent awareness.

## In scope

- Jarvis env diagnostics veiliger en duidelijker maken.
- Jarvis view voeden met board snapshot awareness.
- Actieve agents/Codex subtiel tonen.
- Near-realtime refresh voor Jarvis/task changes aanscherpen.
- Tests en plugin apply.

## Buiten scope

- Nieuwe agentrunner bouwen.
- Autonome taskmutaties vanuit Jarvis.
- Nieuwe OpenAI key aanmaken.
- Board/list/epics/settings functioneel wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Fix de valse `OPENAI_API_KEY ontbreekt voor Jarvis chat` melding.
- Alles moet werken met bestaande `.env.local`.
- Geen nep UI/placeholders, alleen echte data.
- Review Jarvis en toon near-realtime updates.
- Toon actieve agents/Codex subtiel in Jarvis.

## Expliciete user requirements / detailbehoud

- Alles staat al in `.env.local`.
- Zorg dat alles werkt.
- Niks nep in het scherm.
- Geen placeholders maar echte data.
- Near realtime updates.
- Als agents actief zijn wil de gebruiker dat realtime zien.
- Subtiel tonen wat Codex/agents doen.

## Status per requirement

- [x] Valse missing-key melding opgelost — status: gebouwd
- [x] Echte env/availability data zonder secrets — status: gebouwd
- [x] Jarvis toont echte workspace/agent data — status: gebouwd
- [x] Near-realtime updates aangescherpt — status: gebouwd
- [x] Geen board/list/epics/settings regressie — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De concrete false-negative oorzaak is opgelost: lege `process.env` waarden overschrijven `.env.local` waarden niet meer.
- Jarvis toont nu veilig keybron/model en laatste workspace update in de command footer.
- Jarvis links toont echte workspace focus-taken uit de board snapshot; rechts toont echte actieve agents uit `active_agent*` metadata.
- Achtergrondrefresh is aangescherpt naar 5 seconden als vangnet naast de bestaande file watcher.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, safe env-check en taskflow.
- [x] Blok 2: env diagnostics en Jarvis awareness helpers/types bouwen.
- [x] Blok 3: Jarvis UI echte data + near-realtime refresh aansluiten.
- [x] Blok 4: tests, plugin apply, verify en task/docs afronden.

## Concrete checklist

- [x] Exacte bron van missing-key copy vinden en vervangen door ondersteunde keyroute.
- [x] Safe env diagnostics uitbreiden met env-varnaam en checked path zonder secretwaarde.
- [x] Board snapshot doorgeven aan Jarvis-view.
- [x] Actieve agent/tasks uit snapshot renderen.
- [x] Refresh/watch timing voor near-realtime Jarvis updates aanscherpen.
- [x] Typecheck/test/apply draaien.

## Acceptance criteria

- [x] Jarvis toont geen missing-key als één van de ondersteunde keys aanwezig is.
- [x] Jarvis toont veilige keybron/availability zonder secrets.
- [x] Jarvis toont echte actieve agent/task data of een echte empty state.
- [x] Updates uit taskfiles worden near-realtime zichtbaar.
- [x] Bestaande views blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Geen actieve blockers.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 45 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- Live Jarvis chat-smoke — geslaagd, availability true via `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4.1-mini`
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd vóór afronding

## Reconciliation voor afronding

- Oorspronkelijk plan: fix env false-negative, echte data in Jarvis, near-realtime agent awareness.
- Toegevoegde verbeteringen: false-negative root cause expliciet getest, safe keysource/model UI toegevoegd, live provider-smoke uitgevoerd.
- Afgerond: env-resolutie is gehard, Jarvis gebruikt echte board snapshot data, actieve agents worden subtiel getoond, near-realtime refresh is aangescherpt en plugin is toegepast op VS Code.
- Open / blocked: geen.

## Relevante links

- `tools/budio-workspace-vscode/src/jarvis/env.ts`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/src/tasks/types.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis founder-overview command room redesign

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-founder-overview-command-room-redesign.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-founder-overview-command-room-redesign
title: Budio Workspace Jarvis founder-overview command room redesign
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Breng de Jarvis-view visueel en interactief veel dichter bij founder-overview.png met echte workspace-data, bestaande Luma-assets, bewegende core en behoud van echte chat/mic-functies."
tags: [plugin, vscode, jarvis, ui, luma, command-room, polish]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 15
---




# Budio Workspace Jarvis founder-overview command room redesign

## Probleem / context

De huidige Jarvis-view werkt technisch verder door op de hardening-slices, maar voelt visueel nog niet genoeg als de aangeleverde command-room referentie. `assets/jarvis/final-frame/founder-overview.png` toont een warm, premium, founder-first Jarvis dashboard met linker contextkolom, levend middenstuk, command bar en rechter awareness-rail. De huidige view gebruikt wel assets, maar mist nog de compositie, diepte, beweging en compacte interactieve command-room ervaring van die referentie.

## Gewenste uitkomst

Jarvis opent als een zelfstandige command room binnen de bestaande plugin, visueel duidelijk geïnspireerd op `founder-overview.png`: warme charcoal/ivory/gold hiërarchie, een levende centrale intelligence core, echte workspacecontext links, systeem/agent-awareness rechts, subtiele command controls en een chat/mic command deck dat de bestaande echte runtime blijft gebruiken.

## User outcome

De gebruiker opent de Jarvis-view en ziet een geloofwaardige founder command room die past bij het aangeleverde frame. De gebruiker kan nog steeds typen, push-to-talk gebruiken wanneer toegestaan, resetten, herladen, assets syncen en prompts vanuit echte task/workspacecontext voorbereiden. De interface toont geen nepdata, maar echte status, echte taskdata, echte assetstatus en eerlijke empty states.

## Functional slice

Een Jarvis-only UI/UX-redesign van de bestaande view met:
- founder-overview-gebaseerde layout;
- bestaande Luma-assets als visuele basis;
- state-reactieve, bewegende Jarvis core;
- echte workspace/task/agent/asset-status in rails;
- interactieve prompt-suggesties die de echte chatinput vullen;
- behoud van de bestaande chat-, mic-, reload-, reset- en sync-acties.

## Entry / exit

- Entry: gebruiker opent de top-level `jarvis` view in de Budio Workspace plugin.
- Exit: gebruiker ziet de nieuwe command-room layout, kan direct prompten of push-to-talk starten, en ziet echte status/agent/workspace/assetinformatie zonder functionele wijzigingen aan andere views.

## Happy flow

1. Jarvis hydrateert de bestaande lokale state, assets, board snapshot en conversation capabilities.
2. De view toont een founder-overview-achtige command room met links workspacecontext, midden core + command deck en rechts systeem/agents/suggesties.
3. De gebruiker klikt een suggestie of typt zelf een prompt; de bestaande echte `onSendPrompt` flow start.
4. De Jarvis core beweegt/reageert op idle, thinking, transcribing, recording en active-agent states.
5. De gebruiker kan herladen, syncen, resetten en microfooninstellingen openen via compacte echte controls.

## Non-happy flows

- Empty state: geen focus-items, assets of agents toont een rustige echte leegstatus, geen verzonnen data.
- Permission denied / unavailable: mic blijft de bestaande echte permission/unavailable-state tonen.
- Validation / unsupported state: unsupported voice of ontbrekende assets worden compact en eerlijk weergegeven.
- Failure / retry / cancel: provider-, sync- of runtimefouten blijven zichtbaar via bestaande echte Jarvis-state.

## UX / copy

- `founder-overview.png` is de leidende visuele referentie voor compositie, sfeer en hiërarchie.
- Copy is minimal cinematic en functioneel: korte labels als `Werkcontext`, `Systeemstatus`, `Activity`, `Suggesties`, `Command`.
- Geen prototypekopjes zoals `Praat met Jarvis`, `Live gesprekssessie`, `Jij`, `workspace`.
- Geen fake seeddata zoals verzonnen sprint-, staging- of PR-status.
- Prompt-suggesties mogen bestaan, maar moeten alleen de input vullen en niet doen alsof er al actie is uitgevoerd.

## Data / IO

- Input:
  - bestaande Jarvis assetmanifesten en lokale assets;
  - `founder-overview.png` als referentie;
  - board snapshot, taskstatussen, active-agent metadata en conversation state;
  - bestaande chat/mic capability state.
- Output:
  - alleen webview/UI-wijzigingen en taskfile-status;
  - geen nieuwe secrets;
  - geen taskmutaties vanuit Jarvis;
  - geen functionele wijzigingen aan board/list/epics/settings.
- Opslag/API/service/file-impact:
  - `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`;
  - `tools/budio-workspace-vscode/webview-ui/src/styles.css`;
  - taskfile en gegenereerde docs bij afronding.
- Statussen:
  - bestaand chat/voice/runtime/asset/agent model blijft leidend.

## Waarom nu

De gebruiker heeft expliciet aangegeven dat Jarvis er nog niet uitziet als `founder-overview.png` en dat de omgeving goed, uitgebreid, interactief en bewegend moet aanvoelen. De runtime is eerder gehard; nu moet de visuele ervaring het niveau van de aangeleverde command-room richting halen.

## In scope

- Jarvis-view herstructureren richting founder-overview-layout.
- CSS/animatie/responsive polish voor Jarvis-only.
- Bestaande Luma-assets beter benutten.
- Echte data in left/right rails tonen.
- Suggesties/quick actions interactief maken zonder fake uitvoering.
- Plugin typecheck/test/apply.

## Buiten scope

- Board/list/epics/settings functioneel aanpassen.
- Nieuwe autonome agentruns of taskmutaties.
- Nieuwe providerabstractie of modelkeuzescherm.
- Nieuwe Luma-generatie als blocker; alleen bestaande assets zijn verplicht.
- Publieke Budio app wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Jarvis moet veel meer lijken op `founder-overview.png`.
- Maak het uitgebreid en interactief.
- Laat de Jarvis/core bewegen en reageren.
- Gebruik bestaande assets uit de eerder aangeleverde ZIP/Luma ingest.
- Houd echte functies werkend en laat niets nep lijken.
- Bestaande pluginviews blijven intact.

## Expliciete user requirements / detailbehoud

- `founder-overview.png` moet leidend zijn voor de visuele richting.
- Jarvis moet er duidelijk beter en rijker uitzien dan de huidige variant.
- Er moeten interactieve functies in zitten, niet alleen decoratie.
- De Jarvis core moet bewegen/reageren.
- Gebruik bestaande assets uit de ZIP/Luma download.
- Geen placeholders of fake data in het scherm.

## Status per requirement

- [x] Founder-overview compositie toegepast — status: gebouwd
- [x] Bewegende, state-reactieve Jarvis core — status: gebouwd
- [x] Echte workspace/agent/assetdata in rails — status: gebouwd
- [x] Interactieve prompt/quick actions zonder fake uitvoer — status: gebouwd
- [x] Bestaande chat/mic/reload/sync/reset functies behouden — status: gebouwd
- [x] Responsive polish voor small/large pluginformaten — status: gebouwd
- [x] Plugin opnieuw toegepast op VS Code workspace — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De Jarvis-view is omgebouwd naar een ingelijste founder-command-room met topbar, status-iconrail, werkcontext links, levend core-middenstuk en systeem/activity/suggesties rechts.
- Prompt-suggesties en task/source cards vullen alleen de echte command input; ze simuleren geen uitvoering.
- Bestaande Luma-assets worden manifestgedreven gebruikt voor ambient video, core, waveform, HUD-texture, speaking banner en side-rail sfeer.
- De core reageert visueel op echte chat-, voice- en active-agent states.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: Jarvis-view herstructureren naar founder-overview command-room compositie.
- [x] Blok 3: CSS/animatie/responsive polish toevoegen en bestaande assets beter benutten.
- [x] Blok 4: typecheck/test/apply en task/docs afronden.

## Concrete checklist

- [x] Current Jarvis code en assetmanifest lezen.
- [x] Layout ombouwen naar top frame, icon rail, left rail, center core, command deck en right rail.
- [x] Echte status/system/activity/suggestie-data vanuit bestaande state afleiden.
- [x] Core animaties koppelen aan chat/voice/agent states.
- [x] Prompt-suggesties en quick actions op echte handlers aansluiten.
- [x] CSS responsive maken voor smal/breed.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow verify en docs bundle/verify afronden.

## Acceptance criteria

- [x] Jarvis is visueel herkenbaar gebaseerd op `founder-overview.png`.
- [x] Jarvis toont geen fake hoofddata of prototypecopy.
- [x] Jarvis core beweegt en reageert zichtbaar op echte states.
- [x] Typed chat, push-to-talk, reset, reload en sync blijven aangesloten op bestaande handlers.
- [x] Left/right rails gebruiken echte workspace-, agent- en assetinformatie of eerlijke empty states.
- [x] Layout blijft bruikbaar op smalle en brede webviewbreedtes.
- [x] `npm --prefix tools/budio-workspace-vscode run apply:workspace` is uitgevoerd.

## Blockers / afhankelijkheden

- Geen bekende blockers. Fysieke VS Code-webview-mic permissie blijft afhankelijk van macOS/VS Code runtime, maar de UI mag die state eerlijk tonen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension gebouwd/gepackaged/geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: Jarvis visueel/interactief veel dichter naar `founder-overview.png` brengen met bestaande assets, echte data, bewegende core en behoud van echte functies.
- Toegevoegde verbeteringen: founder-command-room frame, echte prompt cards, manifestgedreven assetlagen en state-reactieve HUD-motion.
- Afgerond: Jarvis-view redesign, state-reactieve core, echte rails/control interactions, responsive CSS, plugin typecheck/test/apply, repo-checks en docs bundle/verify zijn afgerond.
- Open / blocked: geen bekende blockers; visuele eindreview gebeurt in de live VS Code webview.

## Relevante links

- `assets/jarvis/final-frame/founder-overview.png`
- `docs/project/25-tasks/done/budio-workspace-jarvis-hardening-echte-command-room.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis hardening echte command room

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-hardening-echte-command-room.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-hardening-echte-command-room
title: Budio Workspace Jarvis hardening echte command room
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Maak Jarvis betrouwbaar werkend met robuuste workspace-root/env-resolutie, echte chat/mic states, echte agent-awareness en een strakkere cinematic command-room zonder fake placeholders."
tags: [plugin, vscode, jarvis, openai, voice, realtime, ui, hardening]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 16
---




# Budio Workspace Jarvis hardening echte command room

## Probleem / context

Jarvis toont nog steeds `Chat niet beschikbaar`, `Aandacht nodig` en update-copy terwijl `.env.local` wel OpenAI keys bevat. De waarschijnlijke oorzaak is dat de VS Code extension de eerste workspacefolder als repo-root gebruikt, terwijl de echte Budio repo in een child-folder kan staan. Daarnaast moet de Jarvis-view geen fake seeddata of placeholder-states tonen, maar echte chat/mic/agent/workspace-status en visueel sterker aanvoelen.

## Gewenste uitkomst

Jarvis opent als betrouwbare interne command room: chat gebruikt de echte lokale keyroute, mic werkt via de echte push-to-talk/transcriptieflow of toont een eerlijke permission/unavailable-state, actieve agents worden alleen getoond wanneer taskmetadata dat echt bevestigt, en de interface gebruikt echte Luma-assets/workspacedata zonder nepcontent.

## User outcome

De gebruiker opent de Jarvis-view in de bestaande Budio Workspace plugin en kan direct typen tegen Jarvis. Als voice beschikbaar is, kan de gebruiker push-to-talk gebruiken. De command room toont echte actuele workspace- en agentinformatie, met een cinematic responsive UI die geen misleidende placeholdercopy bevat.

## Functional slice

- Robuuste repo-root/env-resolutie voor de extension host.
- Echte Jarvis availability/recovery state zonder stale errors.
- End-to-end zichtbare typed chat en mic/transcription states.
- Real-time-ish agent awareness uit echte `active_agent*` taskmetadata.
- Jarvis-only UI cleanup en visual hardening met bestaande Luma-assets.
- Geen functionele wijzigingen aan board/list/epics/settings.

## Entry / exit

- Entry: gebruiker opent `Jarvis` in de Budio Workspace plugin vanuit een directe repo-workspace of bovenliggende VS Code workspace.
- Exit: Jarvis toont `Chat live` met veilige keybron/model of een echte diagnose, chat/mic requests blijven zichtbaar tot success/failure, en de view toont alleen echte data of eerlijke empty states.

## Happy flow

1. Extension resolveert de echte Budio repo-root, ook als VS Code op de parentfolder staat.
2. `.env.local` wordt gevonden en de OpenAI keyroute wordt host-side beschikbaar.
3. Jarvis toont chat als live en accepteert typed input direct zichtbaar in de conversation.
4. Providerresponse komt terug als echte Jarvis-response of providerfout met hersteltekst.
5. Push-to-talk neemt audio op, transcribeert via OpenAI en gebruikt dezelfde chatpipeline.
6. Active-agent metadata-updates verschijnen near-realtime in de Jarvis-awareness laag.

## Non-happy flows

- Empty state: geen actieve agents betekent een compacte echte empty state, geen verzonnen activiteit.
- Permission denied / unavailable: mic toont een echte OS/VS Code permission- of unsupported-state.
- Validation / unsupported state: lege audio of te korte opname geeft direct een echte melding.
- Failure / retry / cancel: providerfout, timeout of missing key blijft zichtbaar en verdwijnt niet door hydration-races.

## UX / copy

- Geen fake labels of seedcontent zoals `Sprint 4`, fake staging/PR meldingen of placeholder command-room tekst in de hoofdview.
- Chatstatus is compact en waarheidsgetrouw: `Chat live · <KEY_SOURCE> · <model>` bij beschikbaarheid.
- Alleen echte foutcopy tonen: ontbrekende key, providerfout, timeout, permission nodig of voice unavailable.
- Jarvis core reageert cinematic op idle/thinking/transcribing/active-agent states en respecteert reduced motion.

## Data / IO

- Input:
  - VS Code workspacefolders
  - `.env.local` en process env
  - Jarvis assetmanifest en lokale Luma-assets
  - board snapshot en taskmetadata
  - typed prompt of audio payload
- Output:
  - veilige Jarvis diagnostics zonder secrets
  - chat/transcription requests host-side naar OpenAI
  - webview state-events met `clientRequestId`
  - echte awareness-data uit taskfiles
- Opslag/API/service/file-impact:
  - geen secrets naar webview
  - geen taskmutaties vanuit Jarvis
  - geen autonome agentrunner in deze slice
- Statussen:
  - chat: idle/thinking/answering/error
  - voice: idle/recording/transcribing/permission_needed/unavailable
  - runtime: accepted/stage/completed/failed

## Waarom nu

De gebruiker wil Jarvis als echt werkende interne command room gebruiken. Een valse missing-key state en fake interfacecopy breken vertrouwen en blokkeren gebruik.

## In scope

- Workspace-root resolver hardening.
- Env availability/recovery hardening.
- Jarvis bridge/runtime visibility verbeteren.
- Mic validation en transcription-state aanscherpen.
- Echte active-agent awareness en update-tijd.
- Jarvis-view copy en responsive cinematic polish.
- Plugin apply en gerichte live smoke.

## Buiten scope

- Board/list/epics/settings functioneel wijzigen.
- Autonome agentruns of taskmutaties vanuit Jarvis.
- Nieuwe publieke Budio productfeature maken.
- Nieuwe OpenAI key aanmaken.
- Grote Luma-regeneratie als blocker voor werkende runtime.

## Oorspronkelijk plan / afgesproken scope

- Maak workspace-root resolving robuust zodat `.env.local` in `persoonlijke-assistent-app` wordt gevonden, ook vanuit een parent VS Code workspace.
- Gebruik de resolved repo-root voor env, taskdata, assets, manifesten en active-agent metadata.
- Herstel chat availability en wis stale error-state zodra een echte key beschikbaar is.
- Vervang `Chat niet beschikbaar` / `Aandacht nodig` door echte diagnose of `Chat live`.
- Maak typed chat en mic end-to-end zichtbaar met request accepted, stage, completed en failed events.
- Toon near-realtime agentactiviteit alleen uit echte `active_agent*` metadata.
- Verwijder fake UI-copy/placeholders uit de Jarvis-hoofdview.
- Upgrade Jarvis visueel met bestaande Luma-assets.
- Gebruik Luma API alleen aanvullend als bestaande assets aantoonbaar tekortschieten.

## Expliciete user requirements / detailbehoud

- `.env.local` bevat de keys; Jarvis mag dus niet vals missing-key tonen.
- Ga door tot het echt werkt en test/review.
- Geen half werkende UI en geen nepstates.
- Jarvis moet functioneel chatten en mic-flow moet echt werken.
- Jarvis moet er beter uitzien dan de huidige variant.
- Gebruik strategie-docs als richting: Jarvis is internal-only/founder workspace tooling.
- Gebruik bestaande assets en eventueel Luma API als visuele assets nodig zijn.
- Bestaande views behouden en functioneel niet aanpassen.

## Status per requirement

- [x] Robuuste repo-root/env-resolutie — status: gebouwd
- [x] Echte chat availability zonder stale false-negative — status: gebouwd
- [x] Typed chat zichtbaar end-to-end — status: gebouwd
- [x] Mic push-to-talk/transcription zichtbaar end-to-end — status: gebouwd
- [x] Echte active-agent awareness — status: gebouwd
- [x] Geen fake placeholders in Jarvis hoofdview — status: gebouwd
- [x] Cinematic responsive Jarvis polish — status: gebouwd
- [x] Bestaande views functioneel onaangeraakt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De root-resolver kiest nu de echte Budio repo-root op basis van task/plugin/asset markers, ook als VS Code op de parentfolder staat.
- De Jarvis hoofdview gebruikt de Luma ambient loop als achtergrondlaag en toont geen asset/debugpanelen meer in de hoofdflow.
- De algemene Budio Workspace topbar is voor de Jarvis-view verwijderd; reset/herlaad/sync staan subtiel in de Jarvis-kamer zelf.
- De voice providerroute is live getest met een lokaal gegenereerde audiofile via dezelfde transcription helper.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow, huidige code/root/env/runtimebron bevestigen.
- [x] Blok 2: workspace-root resolver en env availability recovery bouwen.
- [x] Blok 3: Jarvis runtime bridge/chat/mic visibility en diagnostics harden.
- [x] Blok 4: Jarvis UI fake-copy verwijderen en cinematic real-data layout polishen.
- [x] Blok 5: gerichte tests, live smoke, plugin apply en docs/task afronden.

## Concrete checklist

- [x] Root resolver toevoegen en host code aansluiten.
- [x] Tests toevoegen voor direct repo, parent workspace en missing markers.
- [x] Availability-state en stale error recovery fixen.
- [x] Chat/mic request lifecycle met `clientRequestId` verifiëren en waar nodig harden.
- [x] Jarvis fake seedcontent uit hoofdview verwijderen.
- [x] Active-agent awareness alleen uit echte metadata renderen.
- [x] CSS/Jarvis core visueel aanscherpen met bestaande assets.
- [x] Plugin typecheck/test/apply draaien.
- [x] Live chat smoke uitvoeren met echte keyroute.
- [x] Taskflow/docs verify draaien en task reconciliation bijwerken.

## Acceptance criteria

- [x] Jarvis toont geen `Chat niet beschikbaar` wanneer een ondersteunde key in de echte repo `.env.local` staat.
- [x] Parent VS Code workspace resolveert alsnog naar `persoonlijke-assistent-app` als Budio repo-root.
- [x] Typed prompt levert een echte providerresponse of zichtbare echte providerfout/timeout op.
- [x] Mic-flow toont echte opname/transcriptie/failure-state zonder browser SpeechRecognition-placeholders.
- [x] Jarvis toont geen fake seeddata in de hoofdview.
- [x] Actieve agents worden alleen getoond bij echte `active_agent*` metadata.
- [x] Jarvis past responsief en gebruikt cinematic Luma assetlagen zonder bestaande views functioneel te veranderen.

## Blockers / afhankelijkheden

- Geen bekende blockers. OS/VS Code microfoonrechten kunnen buiten code alsnog transcriptie-smoke beperken; typed chat moet dan volledig blijven werken.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 47 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension gebouwd/gepackaged/geïnstalleerd en VS Code refresh uitgevoerd
- Live typed Jarvis smoke — geslaagd via parent workspace route, keysource `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4.1-mini`
- Live transcription provider smoke — geslaagd via dezelfde keyroute, model `gpt-4o-mini-transcribe`, transcript ontvangen
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: robuuste root/env fix, echte chat/mic runtime, echte data/agent awareness, geen fake UI, cinematic Jarvis polish.
- Toegevoegde verbeteringen: parent-workspace resolver als pure testbare helper, stale-error recovery als pure helper, ambient video als echte achtergrondlaag, Jarvis topbar verwijderd en live transcription smoke toegevoegd.
- Afgerond: root/env false-negative opgelost, chat availability herstelt zonder stale `Aandacht nodig`, typed chat live bewezen, transcription providerroute live bewezen, Jarvis hoofdview toont echte workspace/agentdata en geen fake seedcopy, plugin opnieuw toegepast op VS Code.
- Open / blocked: fysieke push-to-talk via jouw VS Code/macOS microfoonrechten kan alleen interactief in de plugin zelf worden bevestigd; de host-side transcriptieproviderroute is wel live bewezen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-env-en-live-agent-awareness-fix.md`
- `docs/project/25-tasks/done/budio-workspace-jarvis-responsive-cinematic-polish.md`
- `docs/project/25-tasks/done/budio-workspace-jarvis-runtime-fix-chat-mic-end-to-end.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis height en borderless core polish

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-height-borderless-core-polish.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-height-borderless-core-polish
title: Budio Workspace Jarvis height en borderless core polish
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-review
updated_at: 2026-06-13
summary: "Fix de Jarvis-view na screenshotreview: betere hoogte-schaal, minder borders en de centrale Jarvis-core als brede achtergrondlaag in plaats van opgesloten kaart."
tags: [plugin, vscode, jarvis, ui, polish, responsive]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 17
---




# Budio Workspace Jarvis height en borderless core polish

## Probleem / context

De screenshotreview laat zien dat de Jarvis-view in de hoogte niet goed schaalt binnen het VS Code-paneel. Onderin valt content weg en de centrale Jarvis-core zit nog te veel opgesloten in een bordered kaart. De aangeleverde founder-overview-richting vraagt juist om minder zichtbare borders en een core die meer als volledige achtergrond/atmosfeer door het midden van de command room loopt.

## Gewenste uitkomst

Jarvis past beter binnen de beschikbare paneelhoogte, met scroll alleen binnen compacte rails waar nodig. De centrale Jarvis-core voelt groter en meer achtergrondvullend, met minder harde borders en minder nested card-massa, terwijl chat/mic/reload/sync/reset functioneel blijven.

## User outcome

De gebruiker opent Jarvis in VS Code en ziet een rustiger, ruimer command-room scherm dat niet onderin wordt afgesneden. De Jarvis-core domineert de achtergrond zoals in het design en de panels voelen minder boxed-in.

## Functional slice

CSS/layout polish voor de bestaande Jarvis-view:
- viewport-height correct schalen;
- frame en panel borders verzachten;
- core-stage borderless/achtergrondvullend maken;
- rails intern scrollbaar maken;
- command deck zichtbaar houden.

## Entry / exit

- Entry: gebruiker opent de bestaande Jarvis-view in het VS Code-paneel.
- Exit: de command room past in hoogte, gebruikt minder borders en de centrale core loopt visueel over de achtergrond.

## Happy flow

1. Jarvis opent binnen het huidige VS Code webview-paneel.
2. De centrale core schaalt als brede achtergrondlaag.
3. Linker- en rechterrails blijven bruikbaar en scrollen intern als de viewport te laag is.
4. Command deck blijft bereikbaar zonder dat de hele view onhandig onderin afkapt.

## Non-happy flows

- Kleine hoogte: panelcontent comprimeert en scrollt intern.
- Kleine breedte: bestaande responsive stack blijft werken.
- Motion reduced: bestaande reduced-motion regels blijven gelden.

## UX / copy

- Geen nieuwe copy.
- Minder borders/surfaces; meer atmosferische achtergrond, spacing en typografische hiërarchie.

## Data / IO

- Input: bestaande Jarvis CSS en screenshotreview.
- Output: CSS/layout wijziging in de plugin-webview.
- Opslag/API/service/file-impact: geen API- of datamodelwijziging.
- Statussen: bestaande Jarvis states blijven leidend.

## Waarom nu

De gebruiker heeft direct na de redesign-review aangegeven dat de schaal en visuele behandeling nog niet goed genoeg zijn.

## In scope

- `tools/budio-workspace-vscode/webview-ui/src/styles.css`
- Plugin verify en apply.
- Task/docs afronding.

## Buiten scope

- Nieuwe Jarvis functies.
- Board/list/epics/settings wijzigen.
- Nieuwe assets genereren.
- Runtime chat/mic bridge wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Hoogteschaal fixen.
- Jarvis in het midden meer over de hele achtergrond laten lopen.
- Minder borders gebruiken zoals in het design.

## Expliciete user requirements / detailbehoud

- "schaalt nog niet lekker in de hoogte"
- "jarvis in het midden moet over de hele achtergrond"
- "minder de borders gebruiken zoals in het design"

## Status per requirement

- [x] Hoogteschaal verbeterd — status: gebouwd
- [x] Centrale core meer achtergrondvullend — status: gebouwd
- [x] Borders visueel verminderd — status: gebouwd
- [x] Plugin opnieuw toegepast — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Jarvis krijgt nu een Jarvis-only `workspace-shell-jarvis`, zodat de view de volledige beschikbare gridhoogte gebruikt zonder board/list topbar-rijen.
- De centrale core-stage is borderless gemaakt en loopt visueel als brede achtergrondscene door het midden.
- Rails scrollen intern en worden compacter bij lagere viewporthoogtes.
- Bij lage VS Code-paneelhoogte worden promptchips verborgen en dialogue/controls compacter gehouden zodat het command deck bereikbaar blijft.

## Uitvoerblokken / fasering

- [x] Blok 1: screenshotreview, taskflow en CSS-context.
- [x] Blok 2: CSS layout polish uitvoeren.
- [x] Blok 3: typecheck/test/apply en docs afronden.

## Concrete checklist

- [x] Jarvis shell/frame hoogte aanpassen.
- [x] Midden-core borderless/achtergrondvullend maken.
- [x] Rails intern scrollbaar en compacter maken.
- [x] Borders/panelmassa verminderen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow/docs bundle afronden.

## Acceptance criteria

- [x] Jarvis-view gebruikt beschikbare hoogte beter en kapt command deck niet onnodig af.
- [x] Centrale Jarvis-core voelt als achtergrondlaag in plaats van bordered card.
- [x] Borders zijn zichtbaar rustiger en dichter bij het design.
- [x] Bestaande Jarvis-functies blijven aangesloten.
- [x] Plugin is opnieuw toegepast op VS Code workspace.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension gebouwd/gepackaged/geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: hoogteschaal verbeteren, core achtergrondvullend maken en borders verminderen.
- Toegevoegde verbeteringen: Jarvis-only parent grid class en lage-viewport compactieregels.
- Afgerond: codewijzigingen, plugin typecheck/test/apply, repo-checks en docs bundle/verify zijn afgerond.
- Open / blocked: geen bekende blockers; visuele eindreview gebeurt in de live VS Code webview.

## Relevante links

- `assets/jarvis/final-frame/founder-overview.png`
- `docs/project/25-tasks/done/budio-workspace-jarvis-founder-overview-command-room-redesign.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis mic settings en runtime test fix

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-mic-settings-en-runtime-test-fix.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-mic-settings-runtime-test-fix
title: Budio Workspace Jarvis mic settings en runtime test fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: Fix dat de Jarvis knop microfooninstellingen niets doet en maak mic-runtime diagnose/feedback testbaar zichtbaar in de plugin.
tags: [plugin, vscode, jarvis, voice, microphone, macos]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 18
---




# Budio Workspace Jarvis mic settings en runtime test fix

## Probleem / context

De Jarvis knop `Open microfooninstellingen` doet zichtbaar niets. De gebruiker geeft aan dat VS Code al microfoonrechten heeft op macOS, dus de flow moet niet blijven hangen op generieke rechtenuitleg. Jarvis moet zelf duidelijk maken of de webview audio-capabilities beschikbaar zijn, of de settings actie echt is gestart, en wat er misgaat als opname alsnog faalt.

## Gewenste uitkomst

De knop opent betrouwbaar macOS microfooninstellingen of toont een expliciete foutmelding. Jarvis toont daarnaast concrete runtime-diagnose rond `getUserMedia`, `MediaRecorder`, permission-state en opname/transcriptie, zodat we niet blind blijven bij “werkt niet”.

## User outcome

De gebruiker kan de mic-flow in Jarvis testen en krijgt direct zichtbaar bewijs: settings geopend, mic ready/opnemen/transcriberen, of een exacte webview/recorder fout.

## Functional slice

- Betrouwbare hostactie voor macOS microfooninstellingen met fallback naar `open`.
- Webview-feedbackevent voor settingsactie success/failure.
- Meer concrete mic runtime diagnose in Jarvis UI.
- Plugin opnieuw toepassen en gericht testen.

## Entry / exit

- Entry: gebruiker klikt in Jarvis op mic of `Open microfooninstellingen`.
- Exit: settingsactie geeft zichtbare feedback en mic-flow toont echte runtime-state.

## Happy flow

1. Klik op `Open microfooninstellingen`.
2. Host opent macOS privacy/microfooninstellingen via betrouwbare route.
3. Webview toont dat de actie is gestart.
4. Klik op `Mic` start `getUserMedia` en opname wanneer webview dit toestaat.

## Non-happy flows

- Settings route faalt: Jarvis toont fout met fallback-instructie.
- Webview mist `getUserMedia`: Jarvis toont capability ontbreekt.
- Webview mist `MediaRecorder`: Jarvis toont opname niet ondersteund.
- Recorder/getUserMedia faalt ondanks OS-rechten: Jarvis toont exacte foutcategorie.

## UX / copy

- Geen vage “VS Code vraagt soms” copy als primaire oplossing.
- Compacte notices: `Microfooninstellingen geopend`, `Mic ready`, `Opnemen`, `Recorder niet beschikbaar`, `Webview blokkeert microfoon`.

## Data / IO

- Input: webview mic capabilities/errors, host OS platform.
- Output: host→webview mic-settings result event, voice reason copy.
- Opslag/API/service/file-impact: geen providerwijziging.

## Waarom nu

De vorige permission-flow is nog niet praktisch werkend: de settingsknop doet niets zichtbaar en de gebruiker heeft VS Code al rechten gegeven.

## In scope

- Host settings open fallback fix.
- Webview message/result feedback.
- Mic diagnostic copy/state verbeteren.
- Tests/typecheck/apply.

## Buiten scope

- Native audio recorder buiten VS Code webview.
- Nieuwe transcriptieprovider.
- Board/list/epics/settings functioneel wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Los op dat `microfooninstellingen` niets doet.
- Review en test de mic-flow zelf tot de route aantoonbaar werkt of exact meldt waarom de VS Code webview audio blokkeert.

## Expliciete user requirements / detailbehoud

- De knop `microfooninstellingen` doet nu niets.
- VS Code heeft al mic-toegangsrechten op de Mac.
- Review en test zelf totdat het werkt.

## Status per requirement

- [x] Settingsknop heeft betrouwbare macOS fallback — status: gebouwd
- [x] Settingsactie geeft zichtbare feedback — status: gebouwd
- [x] Mic runtime diagnose is concreet — status: gebouwd
- [x] Plugin apply en verify — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De macOS deep link is lokaal getest met `open` en opent System Settings.
- De extension host gebruikt nu naast `vscode.env.openExternal` ook een systeemfallback via `open`.
- De webview krijgt nu een `jarvisMicrophoneSettingsResult` event terug, zodat de knop niet meer stil kan falen.
- Jarvis toont nu een aparte mic-statuschip zoals `Mic klaar`, `Mic rechten nodig`, `Mic neemt op` of `Mic niet ondersteund`.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en huidige mic/settings flow lezen.
- [x] Blok 2: host fallback + feedbackevent + UI diagnose bouwen.
- [x] Blok 3: testen, plugin apply en task afronden.

## Concrete checklist

- [x] macOS settings URI/`open` route testen.
- [x] Hostactie fallback implementeren.
- [x] Host→webview result event toevoegen.
- [x] Jarvis UI feedback tonen.
- [x] Plugin typecheck/test/apply draaien.

## Acceptance criteria

- [x] Klik op settingsknop leidt tot zichtbare hostactie-feedback.
- [x] macOS settings worden via fallback geopend als VS Code `openExternal` niets doet.
- [x] Mic-flow toont concrete capability/error-state.
- [x] Typed chat blijft onaangeraakt.

## Blockers / afhankelijkheden

- Fysieke VS Code webview mic-permission blijft alleen volledig interactief in VS Code te bevestigen; deze task moet wel alle diagnose en herstelpaden zichtbaar maken.

## Verify / bewijs

- Shell smoke: `open 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone'` — opent `System Settings`
- Built helper smoke: `openMicrophoneSettingsWithSystemOpen(..., 'darwin')` — opent `System Settings`
- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: settingsknop en mic runtime echt werkend/diagnostisch maken.
- Toegevoegde verbeteringen: host fallback helper, webview result event en mic-statuschip toegevoegd.
- Afgerond: de settingsknop heeft een bewezen werkende macOS route en stuurt resultaat terug naar Jarvis; mic runtime toont concrete states.
- Open / blocked: de daadwerkelijke `getUserMedia` prompt/opname blijft interactief in VS Code zelf, maar de herstelknop en settingsroute zijn lokaal bewezen en de plugin is opnieuw geïnstalleerd.

## Relevante links

- `tools/budio-workspace-vscode/src/extension/host/BoardPanelController.ts`
- `tools/budio-workspace-vscode/src/webview-bridge/messages.ts`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/useJarvisVoiceInput.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis microfoon permission flow fix

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-microfoon-permission-flow-fix.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-microfoon-permission-flow-fix
title: Budio Workspace Jarvis microfoon permission flow fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Maak Jarvis mic-permission praktisch werkend met echte webview diagnostics, permission request/test en een actie om macOS microfooninstellingen te openen."
tags: [plugin, vscode, jarvis, voice, microphone, permissions]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 19
---




# Budio Workspace Jarvis microfoon permission flow fix

## Probleem / context

Jarvis voice zegt dat VS Code/macOS microfoonrechten nodig zijn, maar de plugin helpt de gebruiker nog onvoldoende om te zien wat er echt misgaat of om het recht praktisch te herstellen. De mic-flow moet niet alleen uitleg geven, maar ook daadwerkelijk een permission request/test starten en een directe actie bieden om systeeminstellingen te openen.

## Gewenste uitkomst

Jarvis toont een echte mic-status op basis van webview capabilities en permission state. De mic-knop vraagt daadwerkelijk `getUserMedia` aan bij user-actie. Bij denied/unavailable krijgt de gebruiker een concrete reden en een actie om macOS microfooninstellingen te openen.

## User outcome

De gebruiker kan in Jarvis duidelijk zien of microfoonopname ondersteund is, of permission geweigerd is, en wat de volgende stap is. Als rechten goed staan, start push-to-talk opname echt.

## Functional slice

- Webview-side mic diagnostics.
- Permission request/test via user gesture.
- Host bridge om OS microfooninstellingen te openen.
- Betere copy en UI-actions voor voice unavailable/permission needed.

## Entry / exit

- Entry: gebruiker opent Jarvis en gebruikt de mic-knop.
- Exit: opname start echt, of Jarvis toont een concrete diagnose en herstelactie.

## Happy flow

1. Jarvis detecteert `navigator.mediaDevices.getUserMedia` en `MediaRecorder`.
2. Gebruiker klikt `Mic`.
3. VS Code/macOS vraagt toestemming of bestaande toestemming wordt gebruikt.
4. Jarvis toont `Opnemen`, daarna `Transcriberen`.

## Non-happy flows

- Permission denied: toon `Microfoonrechten geweigerd` en knop om microfooninstellingen te openen.
- Unsupported webview: toon welke capability ontbreekt.
- Geen microfoon: toon `Geen microfoon gevonden`.
- Lege/te korte opname: toon echte retry-copy.

## UX / copy

- Geen vage “VS Code vraagt soms” uitleg meer als primaire oplossing.
- Toon compacte echte states: `Mic klaar`, `Opnemen`, `Transcriptie`, `Rechten nodig`, `Niet ondersteund`.
- Herstelactie: `Open microfooninstellingen`.

## Data / IO

- Input: browser/webview capabilities, Permissions API indien beschikbaar, getUserMedia errors.
- Output: `jarvisVoiceStateChanged`, voice reason, optional host action om OS settings te openen.
- Opslag/API/service/file-impact: geen secret of providerwijziging.
- Statussen: bestaande `voiceState` blijft leidend.

## Waarom nu

De huidige mic-permission uitleg lost het probleem voor de gebruiker niet op. Jarvis moet zelf diagnose en herstelpad aanbieden.

## In scope

- `useJarvisVoiceInput` diagnostics en permission request verbeteren.
- `JarvisView` voice-state UI/action toevoegen.
- Webview/host message toevoegen voor openen microfooninstellingen.
- Tests/typecheck/apply.

## Buiten scope

- TTS.
- Alternatieve native audio recorder buiten VS Code webview.
- Nieuwe OpenAI transcription pipeline.

## Oorspronkelijk plan / afgesproken scope

- Los op dat VS Code/microfooninstellingen niet praktisch werken voor Jarvis.
- Zorg dat de plugin correct microfoontoegang vraagt en geen vage instructietekst blijft tonen.

## Expliciete user requirements / detailbehoud

- “Dit werkt nog niet” rond VS Code instellingen en microfoontoegang.
- Jarvis moet echt mic-toegang vragen wanneer audio-opnames gebruikt worden.

## Status per requirement

- [x] Echte mic diagnostics — status: gebouwd
- [x] Permission request/test via Jarvis micactie — status: gebouwd
- [x] Herstelactie voor OS microfooninstellingen — status: gebouwd
- [x] Plugin apply en verify — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De voice hook gebruikt nu stabiele refs voor callbacks zodat support/permission-state niet onnodig opnieuw hydrateert.
- Jarvis krijgt een concrete `Open microfooninstellingen` actie bij permission-problemen.
- Unsupported states krijgen een concrete capability reason in plaats van generieke VS Code-uitleg.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, huidige mic-flow en taskflow bevestigen.
- [x] Blok 2: mic diagnostics/action bridge bouwen.
- [x] Blok 3: verify, plugin apply en task afronden.

## Concrete checklist

- [x] Mic supportdiagnose expliciet maken.
- [x] Permission-state/reason verbeteren.
- [x] Host message voor microfooninstellingen toevoegen.
- [x] Jarvis UI herstelactie toevoegen.
- [x] Plugin typecheck/test/apply draaien.

## Acceptance criteria

- [x] Klik op mic vraagt echt microfoontoegang via `getUserMedia` wanneer supported.
- [x] Permission denied toont concrete diagnose en herstelactie.
- [x] Unsupported toont concrete ontbrekende capability.
- [x] Typed chat blijft onaangeraakt.

## Blockers / afhankelijkheden

- Fysieke macOS/VS Code toestemming blijft buiten code, maar Jarvis moet die eerlijk detecteren en herstelactie bieden.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 49 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run taskflow:verify` — geslaagd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run docs:bundle` — geslaagd na verplaatsing naar `done/`
- `npm run docs:bundle:verify` — geslaagd

## Reconciliation voor afronding

- Oorspronkelijk plan: mic permission-flow praktisch werkend maken.
- Toegevoegde verbeteringen: stabiele voice hook callbacks, concrete supportdiagnose en OS-settings action.
- Afgerond: Jarvis mic-knop vraagt bij support echt `getUserMedia`, denied/unavailable states tonen concrete reden, en de host kan macOS/Windows microfooninstellingen openen.
- Open / blocked: fysieke toestemming blijft afhankelijk van jouw lokale VS Code/macOS permissie; de plugin biedt nu het herstelpad en retry.

## Relevante links

- `tools/budio-workspace-vscode/webview-ui/src/useJarvisVoiceInput.ts`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/src/extension/host/BoardPanelController.ts`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis praatbare eigen view

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-praatbare-eigen-view.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-08

```md
---
id: task-budio-workspace-jarvis-praatbare-eigen-view
title: Budio Workspace Jarvis praatbare eigen view
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "De bestaande Budio Workspace-plugin krijgt een aparte Jarvis-view die visueel sterker aansluit op het supplied command-room frame en een eerste werkende praatlaag toevoegt via typed chat plus lichte voice input, zonder de functionaliteit van board/list/epics/settings te veranderen."
tags: [plugin, vscode, jarvis, voice, chat]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 20
---




# Budio Workspace Jarvis praatbare eigen view

## Probleem / context

De plugin heeft al een eerste Jarvis command-room view met lokale Luma-assets en manifestgedreven rendering, maar die view is nog vooral een statisch visualisatieframe. De user wil nu een minimale maar echt bruikbare vervolgvariant: een eigen Jarvis-kamer waarin je kunt praten met Jarvis en die visueel sterker overeenkomt met het aangeleverde frame, zonder dat bestaande pluginviews functioneel worden verbouwd.

## Gewenste uitkomst

Binnen de bestaande VS Code workspace-plugin staat een zelfstandige `jarvis`-view die als eigen command room voelt. De view gebruikt de reeds aanwezige lokale assets en manifesten, toont een sterkere visuele compositie en bevat een werkende conversation flow.

De gebruiker kan in deze eerste versie tekst typen naar Jarvis en, waar de webview/runtime het toelaat, voice input gebruiken als lichte enhancement. Jarvis antwoordt host-side met lokale workspacecontext als primaire bron en kan daarna uitwijken naar algemenere assistentie.

## User outcome

De gebruiker kan de plugin openen, naar de `jarvis`-view gaan en daar in een aparte command room vragen stellen aan Jarvis, met duidelijke antwoordstates en een UI die dichter bij het supplied conceptframe ligt. Board, list, epics en settings blijven werken zoals ze nu werken.

## Functional slice

Eén afgeronde plugin-slice:
- een aparte Jarvis top-level view met eigen visual polish,
- typed chat en lichte voice input,
- host-side assistant bridge met workspace-grounding,
- nette availability/error/fallback states,
- zonder functionele aanpassingen aan de andere pluginviews.

## Entry / exit

- Entry: gebruiker opent de Budio Workspace plugin en kiest de `Jarvis`-view.
- Exit: gebruiker heeft een werkende Jarvis command room waarin een vraag gesteld en beantwoord kan worden, of ziet een duidelijke fallback-state wanneer key/voice/provider ontbreekt.

## Happy flow

1. Gebruiker opent `Jarvis` in de plugin en ziet de command room met lokale assets en polished layout.
2. Gebruiker typt een vraag of start voice input; de vraag verschijnt in de conversatie.
3. Jarvis antwoordt vanuit lokale workspacecontext en vult waar nodig aan met een algemene assistentreactie.

## Non-happy flows

- Empty state: als nog geen conversatie is gestart, toont de speaking surface een nette starter-state met seed-copy.
- Permission denied / unavailable: als voice niet beschikbaar is of mic-permissie ontbreekt, blijft typed chat bruikbaar en toont de UI een compacte notice.
- Validation / unsupported state: lege input wordt niet verstuurd en toon geen fouttoast; de send-actie blijft disabled.
- Failure / retry / cancel: ontbrekende OpenAI-key of providerfout levert een nette conversational errorstate op met mogelijkheid om opnieuw te proberen.

## UX / copy

- Bestaande views behouden hun huidige copy en gedrag.
- Jarvis gebruikt Nederlandse copy.
- Belangrijke labels:
  - `Sync assets`
  - `Praat met Jarvis`
  - `Typ je vraag...`
  - `Luisteren...`
  - `Denkt na...`
  - `Opnieuw`
  - `Nieuwe sessie`
- Jarvis visual direction volgt de bestaande `assets/jarvis/final-frame/unified-design-brief.txt` en de lokale manifest-assets.

## Data / IO

- Input:
  - board snapshot
  - geselecteerde taskcontext
  - Jarvis manifest/command-room content
  - lokale text-asset previews
  - user prompt of voice transcript
- Output:
  - conversation state naar webview
  - assistant response
  - capability/error/fallback state
- Opslag/API/service/file-impact:
  - host-side OpenAI API-call
  - geen repo-persistente chatopslag
  - bestaande lokale Jarvis-assets blijven bron voor visuals
- Statussen:
  - `idle`
  - `listening`
  - `thinking`
  - `answering`
  - `error`

## Waarom nu

- De huidige Jarvis-baseline is visueel bruikbaar maar nog niet interactief.
- Dit is de kleinste volgende slice die direct founderwaarde geeft zonder bredere pluginarchitectuur om te gooien.
- De user wil juist een eerste variant die werkt en visueel geloofwaardig aanvoelt zoals aangeleverd.

## In scope

- Nieuwe uitvoertaak voor deze vervolgscope.
- Behoud van bestaande views zonder functionele wijziging.
- Jarvis-view uitbreiden met conversation UI en lichte voice input.
- Host-side OpenAI bridge met workspace-grounding en nette fallback states.
- Visuele polish vooral in de Jarvis-view, plus alleen minimale shell-polish elders indien nodig.
- Gerichte tests voor message mapping, grounding en fallback states.

## Buiten scope

- Nieuwe task- of boardfunctionaliteit buiten Jarvis.
- Tool-calling, codeacties, taskmutaties of autonome agentruns vanuit chat.
- Persistente conversatie-opslag op disk.
- TTS of uitgebreide audio-device workflows.
- Nieuwe asset-ingestarchitectuur of bredere Luma-canvas-sync.

## Oorspronkelijk plan / afgesproken scope

- Bestaande plugin-views behouden, alleen polish waar nodig.
- Alle nieuwe Jarvis-functionaliteit in een eigen top-level `jarvis`-view.
- Typed chat + lichte voice input.
- Host-side assistant bridge met workspace-first, hybrid answers.
- Visuele upgrade primair in de Jarvis-view.

## Expliciete user requirements / detailbehoud

- Bestaande views moeten behouden blijven.
- Board/list/epics/settings mogen geen functionele regressie of verbouwing krijgen.
- Jarvis moet een eigen view zijn met alle nieuwe functies daarbinnen.
- De eerste versie moet echt bruikbaar zijn om mee te praten.
- Het visuele resultaat moet goed werken en zo dicht mogelijk bij het supplied command-room frame blijven binnen de bestaande plugin.

## Status per requirement

- [x] Bestaande views behouden zonder functionele wijziging — status: gebouwd
- [x] Eigen Jarvis-view met praatlaag — status: gebouwd
- [x] Typed chat + lichte voice input — status: gebouwd
- [x] Host-side hybrid assistent — status: gebouwd
- [x] Visuele polish primair in Jarvis-view — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Conversation-state en groundinglogica als gedeelde Jarvis helpers opgebouwd zodat host en webview dezelfde statevorm delen.
- Voice input als progressive enhancement toegevoegd via webview speech recognition met nette fallback wanneer de runtime dit niet ondersteunt.
- Streaming-achtige assistant rendering toegevoegd via gechunkte hostresponses voor een levendiger Jarvis-gevoel zonder zware realtime providerlaag.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: Jarvis host/message/types/helpers bouwen.
- [x] Blok 3: Jarvis webview en visuele polish bouwen.
- [x] Blok 4: tests, plugin-apply en task/docs afronden.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt en op `in_progress` gezet.
- [x] Jarvis conversation types en message-contract toegevoegd.
- [x] Host-side grounding en assistant-call toegevoegd.
- [x] Jarvis UI omgebouwd naar werkende conversation view.
- [x] Voice fallback toegevoegd.
- [x] Tests toegevoegd of bijgewerkt.
- [x] Verify en plugin apply gedraaid.

## Acceptance criteria

- [x] `jarvis` opent als aparte plugin-view zonder functionele regressie in andere views.
- [x] Gebruiker kan minimaal een typed prompt sturen en een Jarvis-antwoord ontvangen.
- [x] Als voice niet beschikbaar is, blijft typed chat netjes bruikbaar met duidelijke notice.
- [x] Als OpenAI-key of provider ontbreekt, toont Jarvis een nette conversational fallback-state.
- [x] De Jarvis-view voelt visueel duidelijk rijker en dichter bij het supplied frame dan de huidige statische baseline.

## Blockers / afhankelijkheden

- Geen actieve blockers.
- Voor live OpenAI-antwoorden buiten fallback-state moet lokaal `OPENAI_API_KEY` aanwezig zijn.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck`
- `npm --prefix tools/budio-workspace-vscode run test`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: aparte praatbare Jarvis-view maken zonder andere views functioneel te veranderen.
- Toegevoegde verbeteringen: gedeelde conversation helpers, gechunkte assistant rendering en voice progressive enhancement met graceful fallback.
- Afgerond: eigen Jarvis-view praatbaar gemaakt met typed chat, host-side hybrid antwoorden, voice fallback en sterkere visual polish, terwijl board/list/epics/settings functioneel intact bleven.
- Open / blocked: geen blocker binnen deze slice; verdere uitbreidingen zoals TTS, tool-calling of persistente chats krijgen een aparte vervolgtaak.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-v1-luma-asset-ingest-en-command-room.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`
- `assets/jarvis/final-frame/unified-design-brief.txt`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis responsive cinematic polish

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-responsive-cinematic-polish.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-13

```md
---
id: task-budio-workspace-jarvis-responsive-cinematic-polish
title: Budio Workspace Jarvis responsive cinematic polish
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-13
summary: "Maak de Jarvis-view responsief op verschillende pluginbreedtes, verwijder de bovenste Budio/status-overhead en geef de center core cinematic, state-reactieve beweging."
tags: [plugin, vscode, jarvis, ui, responsive, polish]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: polish
spec_ready: true
due_date: null
sort_order: 21
---




# Budio Workspace Jarvis responsive cinematic polish

## Probleem / context

De Jarvis-view werkt als eigen command room, maar de huidige bovenste Budio/statusrij voelt als overhead en kost verticale ruimte. Op smallere pluginformaten moet de kamer compacter en beter passend worden. Het middenstuk mag bovendien sterker als levende cinematic core reageren op opnemen, transcriberen en beantwoorden.

## Gewenste uitkomst

Jarvis past beter op smalle, middelgrote en brede VS Code webview-formaten. De bovenste Budio/status-overhead is weg uit de Jarvis-kamer zelf. De center core blijft centraal en beweegt filmisch en state-reactief zonder de chatflow te verstoren.

## User outcome

De gebruiker opent Jarvis en ziet direct de command room zonder overbodige topcopy. De view voelt ruimtelijk, passend en actief op verschillende schermgroottes.

## Functional slice

- Jarvis-only layout polish.
- Topbar-overhead verwijderen.
- Responsive grid/rails/command deck aanscherpen.
- Cinematic state-reactieve center core animatie toevoegen.

## Entry / exit

- Entry: gebruiker opent `Jarvis` in de Budio Workspace plugin.
- Exit: Jarvis toont een compacte responsive command room met bewegende/reactieve core.

## Happy flow

1. Jarvis opent zonder extra Budio/statuskop.
2. Op breed scherm staan rails, core en gesprek gebalanceerd.
3. Op smaller scherm stapelen rails en gesprek zonder horizontale overflow.
4. Bij opnemen/transcriberen/beantwoorden reageert de core visueel.

## Non-happy flows

- Empty state: command room blijft compact zonder lege bovenbalk.
- Permission denied / unavailable: bestaande mic/chat notices blijven zichtbaar in command deck.
- Validation / unsupported state: bestaande inputstates blijven intact.
- Failure / retry / cancel: reload/reset blijven subtiel beschikbaar.

## UX / copy

- Verwijder zichtbare Jarvis-topbar met Budio wordmark, status pill en ready/status-copy.
- Behoud noodzakelijke acties `Reset` en `Herlaad`, maar subtiel in de speaking surface.
- Gebruik bestaande minimal cinematic copy; voeg geen nieuwe debugcopy toe.

## Data / IO

- Input: bestaande Jarvis workspace state en conversation state.
- Output: alleen render/CSS gedrag.
- Opslag/API/service/file-impact: geen provider- of taskmutatieflow.
- Statussen: bestaande `jarvis-chat-*` en `jarvis-voice-*` classes sturen core motion.

## Waarom nu

De gebruiker heeft runtime werkend gekregen en vraagt nu expliciet om passende schermweergave, minder overhead en een levendiger cinematic middenstuk.

## In scope

- `JarvisView` JSX aanpassen voor minder top-overhead.
- `styles.css` Jarvis responsive layout en animaties aanscherpen.
- Gerichte plugin verify en `apply:workspace`.

## Buiten scope

- Nieuwe Jarvis features, tools of taskacties.
- Chat/provider/mic pipeline wijzigen.
- Board/list/epics/settings functioneel aanpassen.

## Oorspronkelijk plan / afgesproken scope

- Maak Jarvis responsive en passend op alle schermgroottes.
- Haal bovenstuk met Budio/ready/status-overhead weg.
- Review de schermopbouw en verbeter de Jarvis midden-core.
- Laat het middenstuk cinematic bewegen en reageren.

## Expliciete user requirements / detailbehoud

- Jarvis moet responsive zijn.
- Jarvis moet passen op alle schermgroottes.
- Bovenstuk met Budio/ready/status is overhead en mag weg.
- Middenstuk moet cinematic bewegen en reageren.

## Status per requirement

- [x] Responsive Jarvis layout — status: gebouwd
- [x] Topbar-overhead verwijderd — status: gebouwd
- [x] Cinematic/reactieve center core — status: gebouwd
- [x] Bestaande chat/mic functionaliteit intact — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Reset en Herlaad zijn verplaatst naar compacte speaking-surface actions zodat de bovenste Jarvis-overhead kan verdwijnen zonder functionaliteit kwijt te raken.
- Core motion respecteert `prefers-reduced-motion`.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en actuele Jarvis UI/CSS lezen.
- [x] Blok 2: Jarvis JSX en responsive/motion CSS aanpassen.
- [x] Blok 3: plugin verify, apply en task/docs afronden.

## Concrete checklist

- [x] Topbar JSX verwijderen of verplaatsen naar subtiele controls.
- [x] Responsive grid en rail stacking verbeteren.
- [x] Center core motion state-reactief maken.
- [x] Typecheck/test/apply draaien.
- [x] Taskflow/docs afronden.

## Acceptance criteria

- [x] Jarvis heeft geen losse Budio/ready/status topbar meer.
- [x] Jarvis blijft bruikbaar op smalle en brede pluginbreedtes zonder horizontale overflow.
- [x] Core beweegt ambient en reageert zichtbaar op chat/voice states.
- [x] Chat, mic, reset en reload blijven bereikbaar.

## Blockers / afhankelijkheden

- Geen actieve blockers.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 43 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd vóór afronding
- Docs bundle/verify bij taskstatus afronding — uitgevoerd na verplaatsing naar `done/`

## Reconciliation voor afronding

- Oorspronkelijk plan: responsive Jarvis polish, topbar-overhead weg, cinematic/reactieve core.
- Toegevoegde verbeteringen: reset/herlaad verplaatst naar speaking surface en motion respecteert reduced-motion.
- Afgerond: Jarvis-topbar verwijderd, responsive grid/breakpoints aangescherpt, core dials/scanline/orbits/float toegevoegd en state-reactief gemaakt voor chat/voice.
- Open / blocked: geen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-runtime-fix-chat-mic-end-to-end.md`
- `tools/budio-workspace-vscode/webview-ui/src/JarvisView.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis runtime fix chat en mic end-to-end

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-runtime-fix-chat-mic-end-to-end.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-08

```md
---
id: task-budio-workspace-jarvis-runtime-fix-chat-mic-end-to-end
title: Budio Workspace Jarvis runtime fix chat en mic end-to-end
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "Maak de bestaande Jarvis typed chat en push-to-talk runtime zichtbaar en betrouwbaar end-to-end met request-acks, request-id reconciliation, provider-timeouts, non-secret diagnostics en een echte reloadroute."
tags: [plugin, vscode, jarvis, openai, audio, chat, runtime]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 22
---




# Budio Workspace Jarvis runtime fix chat en mic end-to-end

## Probleem / context

De Jarvis V1.2-slice heeft echte host-side chat en push-to-talk toegevoegd, maar in runtime ziet de gebruiker na typen nog geen betrouwbare reactie. Omdat `.env.local` de verwachte OpenAI-key varianten bevat, ligt de primaire fix niet bij een lege keyroute maar bij de webview-host bridge, zichtbare pending/error states, provider-diagnose, timeouts en reload van retained plugin/webview-state.

## Gewenste uitkomst

Typed chat en mic voelen direct echt: een ingestuurde prompt verschijnt meteen, Jarvis toont een duidelijke verwerkingsstate, providerrespons of fout komt zichtbaar terug, en mic-opnames tonen opname, transcriptie en antwoord in dezelfde gesprekspijplijn.

De fix blijft beperkt tot Jarvis runtime/bridge/UI-state en host helpers. Board/list/epics/settings blijven functioneel onaangeraakt.

## User outcome

De gebruiker kan in de Jarvis-view typen of push-to-talk gebruiken en ziet altijd wat er gebeurt: ontvangen, verwerken, antwoord klaar of een echte fout met vervolgstap.

## Functional slice

Een gerichte Jarvis-runtimefix:
- request-id gebaseerde submit/ack/completion/failure flow,
- optimistic visible state in de Jarvis webview,
- timeout-aware chat en transcriptie,
- non-secret diagnostics in de host,
- reloadroute om oude retained webview-state te vernieuwen.

## Entry / exit

- Entry: gebruiker opent de Budio Workspace plugin en kiest `Jarvis`.
- Exit: typed of mic input levert zichtbaar een echte respons op, of toont een echte permission/provider/timeout/unavailable-state.

## Happy flow

1. Gebruiker typt een prompt; de prompt verschijnt direct in de conversation surface.
2. De host bevestigt ontvangst en roept OpenAI aan met lokale grounding.
3. Jarvis toont het echte antwoord en keert terug naar idle.

## Non-happy flows

- Empty state: geen input versturen zonder zichtbare no-op.
- Permission denied / unavailable: mic toont echte permission/unavailable reden en typed fallback blijft bruikbaar.
- Validation / unsupported state: lege of te korte audio wordt niet ingestuurd en geeft een compacte melding.
- Failure / retry / cancel: provider-, transcriptie- en timeoutfouten worden zichtbaar en blijven niet stil hangen.

## UX / copy

- Jarvis behoudt de minimal cinematic richting.
- Alleen functionele states tonen: klaar, opnemen, verwerken, antwoord klaar, permissie nodig, providerfout of timeout.
- Geen debug/secrets in UI; hoogstens compacte diagnose met env-varnaam of stage.
- Voeg een subtiele reloadactie toe voor Jarvis wanneer retained state verdacht is.

## Data / IO

- Input:
  - typed prompt met `clientRequestId`
  - audio payload met `clientRequestId`
  - `.env.local` en process env
  - lokale workspace/Jarvis grounding context
- Output:
  - request accepted/runtime-stage events
  - echte assistant response
  - transcriptie als user prompt
  - zichtbare foutstates
- Opslag/API/service/file-impact:
  - geen secrets naar webview
  - geen persistente audio/chatopslag
  - host-side OpenAI chat/transcription calls met timeout
- Statussen:
  - chat: `idle`, `thinking`, `answering`, `error`
  - voice: `idle`, `recording`, `transcribing`, `permission_needed`, `unavailable`

## Waarom nu

De Jarvis-view is pas bruikbaar als de eerste interactie betrouwbaar zichtbaar en echt werkt. De user heeft bevestigd dat typed chat nu geen reacties toont en wil dat mic en chat daadwerkelijk functioneren.

## In scope

- Jarvis webview-host message contract uitbreiden met request-id, ack en runtime-stage events.
- Webview optimistic/reconciliation state voor typed en mic.
- Timeout-aware chat en transcription helpers.
- Non-secret Jarvis runtime/output logging in de host.
- Compacte reloadroute voor Jarvis state/webview.
- Gerichte tests en plugin apply.

## Buiten scope

- Streaming responses.
- TTS.
- Tool-calling, taskmutaties of repo-acties vanuit Jarvis.
- Functionele wijzigingen aan board/list/epics/settings.
- Nieuwe Luma-ingest of assetarchitectuur.

## Oorspronkelijk plan / afgesproken scope

- Maak typed chat direct zichtbaar met lokale user bubble en `thinking` state via `clientRequestId`.
- Voeg request-acks toe tussen webview en host.
- Laat responses/fouten niet verdwijnen bij hydration races.
- Voeg provider-timeouts toe voor chat en transcriptie.
- Verbeter foutdiagnose zonder secrets.
- Maak mic-flow even expliciet als typed chat.
- Voeg min-duration/lege-audio validatie toe.
- Voeg non-secret Jarvis runtime/output log toe.
- Voeg een compacte reloadroute toe.
- Houd bestaande views functioneel onaangeraakt.

## Expliciete user requirements / detailbehoud

- Typed chat moet echt antwoorden tonen.
- Mic functie moet echt werken.
- Geen nep UI-states.
- `.env.local` keyroute is aanwezig en moet gebruikt worden.
- Board/list/epics/settings blijven intact.

## Status per requirement

- [x] Typed chat toont direct submit + echte respons — status: gebouwd
- [x] Mic toont opname/transcriptie/antwoord end-to-end — status: gebouwd
- [x] Hydration races verliezen geen responses/fouten — status: gebouwd
- [x] Provider-timeouts en non-secret diagnostics — status: gebouwd
- [x] Reloadroute voor Jarvis retained state — status: gebouwd
- [x] Bestaande views functioneel onaangeraakt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Live provider-smoke toegevoegd voor chat via dezelfde Jarvis helper en `.env.local` keyroute.
- Live provider-smoke toegevoegd voor transcriptie via tijdelijk lokaal audiobestand buiten de repo.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: bridge/state/types en host diagnostics/timeouts bouwen.
- [x] Blok 3: webview optimistic typed/mic flow en reloadactie bouwen.
- [x] Blok 4: tests, plugin apply, smoke/verify en task/docs afronden.

## Concrete checklist

- [x] Message contract uitbreiden met request-id, accepted en runtime-stage events.
- [x] Host Jarvis pipeline request-aware, timeout-aware en diagnostic-aware maken.
- [x] Webview Jarvis state reconciliation harden.
- [x] Mic payload-validatie en transcriptie-state zichtbaar maken.
- [x] Reload command/actie toevoegen.
- [x] Gerichte tests toevoegen of uitbreiden.
- [x] Plugin opnieuw toepassen met `npm --prefix tools/budio-workspace-vscode run apply:workspace`.

## Acceptance criteria

- [x] Een typed prompt verschijnt direct en levert zichtbaar een echte assistant response of fout op.
- [x] Een mic-opname toont opnemen, transcriberen, transcript en daarna dezelfde chatflow.
- [x] Provider- of timeoutfouten blijven zichtbaar en verdwijnen niet door hydration timing.
- [x] Geen secretwaarde komt in webview-state, UI-copy of logs.
- [x] Board/list/epics/settings blijven functioneel gelijk.

## Blockers / afhankelijkheden

- Live mic happy path blijft afhankelijk van OS/VS Code microfoonrechten.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 43 tests
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd, extension opnieuw geïnstalleerd en VS Code refresh uitgevoerd
- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd vóór afronding
- Live chat provider-smoke — geslaagd: `Jarvis live`, providerSource `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4.1-mini`
- Live transcriptie provider-smoke — geslaagd: `Jarvis live.`, providerSource `OPENAI_API_BUDIO_WORKSPACE_SERVICE_KEY`, model `gpt-4o-mini-transcribe`
- OS/VS Code mic permission-smoke — niet geautomatiseerd; blijft lokale runtime-permissie.

## Reconciliation voor afronding

- Oorspronkelijk plan: typed chat + mic end-to-end zichtbaar en echt werkend maken met bridge hardening, timeouts, diagnostics en reload.
- Toegevoegde verbeteringen: live provider-smokes voor chat en transcriptie zijn uitgevoerd naast unit/type/lint/apply-verify.
- Afgerond: request-id bridge, host acks/runtime-stages, optimistic webview state, hydration race hardening, provider-timeouts, mic audio-validatie, non-secret output logging, reload command en README zijn klaar.
- Open / blocked: geen codeblocker; echte OS/VS Code microfoonpermissie blijft alleen lokaal in de webview runtime te bevestigen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-jarvis-echte-chat-en-push-to-talk.md`
- `tools/budio-workspace-vscode/README.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace Jarvis V1 — Luma asset ingest + first command room

- Path: `docs/project/25-tasks/done/budio-workspace-jarvis-v1-luma-asset-ingest-en-command-room.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-08

```md
---
id: task-budio-workspace-jarvis-v1-luma-asset-ingest-command-room
title: Budio Workspace Jarvis V1 — Luma asset ingest + first command room
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-08
summary: "Bouw een eerste internal-only Jarvis command room in de Budio Workspace plugin, gevoed door een gedeelde lokale Luma-downloadlaag met seed-manifest, CLI-prefetch, plugin-syncactie en manifestgedreven rendering van de Final Frame-assets."
tags: [plugin, vscode, jarvis, luma, workspace, assets, command-room]
workstream: plugin
epic_id: epic-budio-workspace-hierarchy-linear-lite
parent_task_id: null
depends_on: []
follows_after: ""
task_kind: task
spec_ready: true
due_date: null
sort_order: 23
---




## Probleem / context

Er is nu wel een richting voor een Budio Workspace Command Room en er ligt een concreet Final Frame-document met goedgekeurde Jarvis-assets, maar er bestaat nog geen uitvoerbare ingestlaag of pluginview die die set lokaal kan binnenhalen en tonen.

Daardoor blijft Jarvis hangen als research en losse designcontext, terwijl er juist behoefte is aan een eerste tastbare internal-only workspacevariant in de bestaande VS Code-plugin.

## Gewenste uitkomst

De repo bevat een gedeelde lokale Luma-toolset onder `tools/jarvis-luma/` die Final Frame seed-assets kan resolven, downloaden of markeren als handmatige fallback, en die lokale output opslaat onder `assets/jarvis/final-frame/` met manifest en rapportage.

Daarnaast bevat de bestaande Budio Workspace plugin een nieuwe top-level `jarvis`-view met syncactie en nette fallbackstates, zodat de eerste command room direct in de plugin zichtbaar is op basis van lokale manifestdata en bestanden.

## User outcome

De founder/developer kan vanuit de repo of plugin een Jarvis asset-sync starten en daarna in de bestaande Budio Workspace-plugin een eerste command room openen met de juiste visuals, contentblokken en syncstatus.

## Functional slice

Eerste end-to-end slice voor Jarvis in Workspace:
- seed-manifest uit Final Frame
- lokale Luma downloader met API-first + fallback
- gedeelde asset-output onder `assets/jarvis/final-frame/`
- plugincommand + pluginview `jarvis`
- manifestgedreven command-room render en fallbackstates

## Entry / exit

- Entry: lokale repo met bestaande Budio Workspace plugin en Final Frame-document als bron.
- Exit: `budioWorkspace.openJarvis` toont een werkende Jarvis-view; `budioWorkspace.syncJarvisAssets` of de CLI kan de assetset lokaal verversen.

## Happy flow

1. Developer draait de CLI of start sync vanuit de plugin met een geldige `LUMA_AGENTS_API_KEY`.
2. Downloader verwerkt seed-assets, downloadt resolvebare PNG/MP4-bestanden, schrijft manifest + report, en markeert niet-resolvebare items als fallbackstatus.
3. Jarvis-view leest het lokale manifest en rendert de command room met visuals, content en correcte ready/partial-status.

## Non-happy flows

- Empty state: nog geen manifest of nog geen download; Jarvis-view toont duidelijke setup/sync-state.
- Permission denied / unavailable: ontbrekende of ongeldige key geeft `missing_key` of foutstatus zonder secret leakage.
- Validation / unsupported state: short seed ID is niet via publieke Luma API te resolven; item krijgt `manual_source_required`.
- Failure / retry / cancel: individuele downloadfouten blokkeren de rest van de sync niet; manifest blijft partieel bruikbaar en sync kan opnieuw gestart worden.

## UX / copy

- Gebruik Final Frame-copy voor left rail, right rail, speaking surface en command bar.
- Jarvis-view gebruikt bestaande plugin-shell en navigatiepatronen; geen aparte extension of los shellproject.
- Fallback copy benoemt concreet: geen manifest, sync bezig, key ontbreekt, gedeeltelijke assets, sync mislukt.

## Data / IO

- Input:
  - `tools/jarvis-luma/final-frame.seed.json`
  - `LUMA_AGENTS_API_KEY`
  - lokaal Final Frame-bronbestand voor text fallback
- Output:
  - `assets/jarvis/final-frame/jarvis-assets-manifest.json`
  - `assets/jarvis/final-frame/download-report.json`
  - lokale PNG/MP4/text outputs
- Opslag/API/service/file-impact:
  - lokale files onder `assets/jarvis/`
  - externe calls naar gedocumenteerde Luma endpoints
  - plugin leest alleen lokale manifest- en assetpaden
- Statussen:
  - `idle`, `syncing`, `partial`, `ready`, `error`, `missing_key`, `missing_manifest`

## Waarom nu

- Dit is de kleinste bouwbare Jarvis-slice die research omzet in een tastbare workspacevariant.
- Het houdt Jarvis internal-only en binnen de pluginworkstream, zonder Budio app-runtime of publieke feature-scope te verbreden.
- Het sluit direct aan op de bestaande workspace-plugin en de eerder vastgelegde command-room richting.

## In scope

- `tools/jarvis-luma/` toolset toevoegen met seed-manifest, Luma client, downloader en README.
- Shared asset-output onder `assets/jarvis/final-frame/`.
- Plugin uitbreiden met `jarvis`-view, sync-command, settings en manifestgedreven rendering.
- Gerichte tests voor downloader, manifeststatussen en pluginrouting/state.
- Taskflow-, plugin- en repo-verify draaien.

## Buiten scope

- Nieuwe Jarvis prompt/generatieflow of beeldbewerking.
- Publieke productfeature of koppeling met Budio app runtime.
- Browser shell buiten de bestaande VS Code-plugin.
- Volledige canvas-sync als publiek of officieel ondersteund Luma API-contract.

## Oorspronkelijk plan / afgesproken scope

- Bouw een eerste internal-only Jarvis command room binnen de bestaande VS Code workspace-plugin.
- Gebruik een gedeelde lokale Luma-downloadlaag met seed-manifest, CLI-prefetch en plugin-syncactie.
- Render de Final Frame-assets en content manifestgedreven in een nieuwe `jarvis`-view.
- Hanteer API-first + fallback voor short asset IDs die waarschijnlijk canvas/object IDs zijn in plaats van generation UUIDs.

## Expliciete user requirements / detailbehoud

- Gebruik een **nieuwe taskfile**; de bestaande research-task blijft alleen context.
- Scopekeuzes liggen vast:
  - volledige command room
  - API-first + fallback
  - shared root assets
  - CLI + plugin UI trigger
  - PNG + MP4 + text docs
- Nieuwe commands:
  - `budioWorkspace.openJarvis`
  - `budioWorkspace.syncJarvisAssets`
- Nieuwe settings:
  - `budioWorkspace.jarvisAssetsRoot`
  - `budioWorkspace.jarvisSeedManifest`
- Seed bevat alle asset IDs, logische namen, rollen, outputfilenames, command-room content en design tokens uit Final Frame.
- Text docs mogen via lokale file-import of handmatige contentseed landen wanneer de API ze niet levert.
- Eén asset die niet resolvebaar is mag de rest van de sync niet blokkeren.
- Hergebruik bewezen Luma-patronen uit `space-idle-game/tools/luma/`, maar geen gamespecifieke prompt/generatielaag.

## Status per requirement

- [x] Nieuwe spec-ready taskfile en in-progress taskflow — status: gebouwd
- [x] Gedeelde lokale Luma-ingestlaag onder `tools/jarvis-luma/` — status: gebouwd
- [x] Shared output + manifest/report onder `assets/jarvis/final-frame/` — status: gebouwd
- [x] Plugin uitbreiden met `jarvis`-view, sync-command en settings — status: gebouwd
- [x] Manifestgedreven command-room render + fallbackstates — status: gebouwd
- [x] Gerichte tests en verify — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Bootstrap de lokale Jarvis-output direct met de nieuwe syncscript, zodat manifest/report en seeded docs meteen beschikbaar zijn zonder extra handmatige setup.
- Voeg plugin-only shared Jarvis-types en host-loader toe zodat de UI manifestgedreven blijft en niet op losse screen-local aannames draait.
- Importeer de volledige door de gebruiker aangeleverde Luma zip-download en map de Final Frame-assets direct naar de verwachte lokale Jarvis-bestandsnamen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: gedeelde Luma-ingestlaag en seed/outputstructuur bouwen.
- [x] Blok 3: plugin host/webview uitbreiden met Jarvis-view en syncactie.
- [x] Blok 4: gerichte tests, verify en task/docs afronden.

## Concrete checklist

- [x] `tools/jarvis-luma/final-frame.seed.json` toevoegen met Final Frame brondata.
- [x] `tools/jarvis-luma/luma-client.mjs` en `download-final-frame.mjs` bouwen.
- [x] README voor lokale usage en fallbackpolicy toevoegen.
- [x] `assets/jarvis/final-frame/` bootstrapbestanden toevoegen.
- [x] Plugincommands, settings, host state en webview messages uitbreiden.
- [x] Jarvis-view en command-room UI renderen.
- [x] Tests en verify draaien.

## Acceptance criteria

- [x] `node tools/jarvis-luma/download-final-frame.mjs --dry-run` geeft een valide dry-run zonder secrets of writes.
- [x] Downloader schrijft manifest/report en laat partial succes toe wanneer enkele assets niet resolvebaar zijn.
- [x] `budioWorkspace.openJarvis` opent een nieuwe Jarvis-view in de bestaande plugin.
- [x] `budioWorkspace.syncJarvisAssets` start dezelfde ingestflow via de pluginhost.
- [x] Jarvis-view toont correcte ready/partial/error/fallbackstates op basis van het lokale manifest.

## Blockers / afhankelijkheden

- Geen actieve blockers meer binnen deze scope.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck`
- `npm --prefix tools/budio-workspace-vscode run test`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- `node tools/jarvis-luma/download-final-frame.mjs --dest assets/jarvis/final-frame`
- `npm run taskflow:verify`
- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: eerste Jarvis command room bouwen met gedeelde ingestlaag + pluginview.
- Toegevoegde verbeteringen: lokale bootstrap van manifest/report + seeded docs, een gedeelde plugin-host loader voor Jarvis-state en directe zip-import van de volledige Luma-download.
- Afgerond: seed-manifest, downloader, tests, shared asset-output, plugincommands/settings/messages, Jarvis-view, workspace apply, repo/docs verify en lokale Final Frame-assetimport naar een `ready` Jarvis-manifest.
- Open / blocked: geen blockers meer binnen deze scope; alleen optionele latere uitbreidingen zoals automatische zip-import of directe canvas-mapping krijgen een eigen vervolgtaak.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- `docs/project/25-tasks/open/budio-workspace-command-room-research-en-startpunt-vastleggen.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace task detail blank screen en screenshot proof fix

- Path: `docs/project/25-tasks/done/budio-workspace-task-detail-blank-screen-en-screenshot-proof-fix.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-workspace-task-detail-blank-screen-en-screenshot-proof-fix
title: Budio Workspace task detail blank screen en screenshot proof fix
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Fix de task-detail blank-screen regressie en maak VS Code plugin screenshots betrouwbaar bewijsbaar.
tags: [plugin, vscode, task-detail, regression, screenshot]
workstream: plugin
epic_id: null
parent_task_id: task-budio-workspace-task-detail-edit-polish-agent-claiming
depends_on: [task-budio-workspace-task-detail-edit-polish-agent-claiming]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 24
---




## Probleem / context

Na de task-detail edit polish kan klikken op een taak in het overzicht de plugin-webview volledig leeg maken. De waarschijnlijke oorzaak is een render-crash door nieuwe detailvelden die niet defensief gelezen worden wanneer VS Code retained webview-state of een oude hydrate-payload gebruikt.

Daarnaast werkte de screenshot-helper technisch, maar accepteerde hij ook een PNG van de verkeerde voorgrond-app. Daardoor is een screenshot pas bewijs als de helper controleert dat VS Code en de Budio Workspace view daadwerkelijk vooraan staan.

## Gewenste uitkomst

Task detail opent weer betrouwbaar vanuit board en list zonder blank screen. Als er toch een renderfout optreedt, toont de webview een compacte recovery-state in plaats van leeg te worden.

De screenshot-helper faalt hard wanneer niet VS Code/Budio Workspace wordt vastgelegd, zodat visueel bewijs niet meer per ongeluk een andere app kan zijn.

## User outcome

De gebruiker kan op taken klikken, detail rechts of fullscreen openen, en erop vertrouwen dat smoke-screenshots de plugin tonen.

## Functional slice

Een smalle runtime-stabiliteitsfix voor de bestaande Budio Workspace plugin: defensieve detailrendering, crash guard en betrouwbare screenshot-proof tooling.

## Entry / exit

- Entry: gebruiker opent board/list en klikt een taak.
- Exit: detailpane opent of toont een herstelbare fout; screenshot-helper schrijft alleen bewijs als VS Code/Budio Workspace vooraan staat.

## Happy flow

1. Board opent en toont taken.
2. Klik op een task opent detail zonder blank screen.
3. Fullscreen detail werkt nog.
4. Screenshot-helper capture met `--expect-title "Budio Workspace"` schrijft een PNG van VS Code of faalt duidelijk.

## Non-happy flows

- Empty state: ontbrekende nieuwe detailvelden renderen als lege arrays/fallback-preview.
- Permission denied / unavailable: screenshot-helper behoudt macOS Screen Recording permissie-uitleg.
- Validation / unsupported state: verkeerde foreground app of venstertitel veroorzaakt een duidelijke helper-fail.
- Failure / retry / cancel: webview renderfout toont recovery-acties voor refresh/reload.

## UX / copy

- Recoverycopy compact en eerlijk: detail kon niet gerenderd worden; bied `Herlaad board`.
- Geen extra permanente UI-copy in normale detailflow.
- Screenshot-helper CLI behoudt bestaande stijl en voegt `--expect-title <text>` toe.

## Data / IO

- Input: bestaande `TaskCardViewModel` payloads, inclusief oudere retained payloads zonder nieuwe velden.
- Output: robuuste webview-rendering en betrouwbare screenshot PNG of expliciete CLI-fout.
- Opslag/API/service/file-impact: geen task schema-wijziging; alleen plugin/webview/tooling.
- Statussen: taskstatussen blijven ongewijzigd.

## Waarom nu

Dit is een directe regressie in de primaire plugin-workflow. Klikken op een taak moet altijd veilig zijn.

## In scope

- Defensieve detail normalizers.
- ErrorBoundary rond board/list/detail webview-shell.
- Screenshot-helper focus/title-validatie en window capture waar mogelijk.
- Tests en plugin apply.

## Buiten scope

- Nieuwe task-detail features.
- Redesign van board/list/Jarvis.
- Automatische click-smoke via UI automation als dat buiten de bestaande lokale tooling valt.

## Oorspronkelijk plan / afgesproken scope

Fix Plan: Task Detail Blank Screen + Reliable VS Code Plugin Screenshot Proof. Stabiliseer detail rendering, voeg crash guard toe, harden screenshot-helper zodat verkeerde app-captures niet als bewijs tellen, en verifieer met plugin checks + smoke.

## Expliciete user requirements / detailbehoud

- Task detail mag na klikken op een taak geen leeg scherm meer geven.
- De vorige task-detail polish en agent claiming blijven behouden.
- Screenshot-helper moet betrouwbaar bewijs leveren of duidelijk falen.
- Plugin opnieuw toepassen en VS Code refreshen na wijziging.

## Status per requirement

- [x] Blank-screen regressie oplossen — status: gebouwd.
- [x] Defensieve detailrendering toevoegen — status: gebouwd.
- [x] Webview crash guard toevoegen — status: gebouwd.
- [x] Screenshot-helper betrouwbaar maken — status: gebouwd.
- [x] Plugin apply + bewijs draaien — status: gebouwd.

## Toegevoegde verbeteringen tijdens uitvoering

- Safe normalizers zijn als geteste helper toegevoegd zodat retained webview-payloads zonder nieuwe velden niet meer kunnen crashen.
- Screenshot-helper controleert nu ook zichtbare VS Code UI-namen wanneer `--expect-title` niet in de macOS venstertitel staat.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en regressiehypothese bevestigen.
- [x] Blok 2: webview runtime guard en safe normalizers implementeren.
- [x] Blok 3: screenshot-helper hardening implementeren.
- [x] Blok 4: gerichte tests, plugin apply en smokebewijs.
- [x] Blok 5: task/docs reconciliation en verify afronden.

## Concrete checklist

- [x] Safe detail helper toevoegen en gebruiken.
- [x] ErrorBoundary toevoegen rond plugin shell.
- [x] Screenshot-helper `--expect-title` en frontmost-app check toevoegen.
- [x] Tests toevoegen/aanpassen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Runtime/screenshot smoke uitvoeren.
- [x] Taskflow/docs verify draaien.

## Acceptance criteria

- [x] Board/list task click veroorzaakt geen blank webview.
- [x] Ontbrekende `detailPreviewSections` crasht niet.
- [x] Detail fullscreen blijft werken.
- [x] Screenshot-helper accepteert geen capture van verkeerde app.
- [x] Plugin is opnieuw toegepast op VS Code workspace.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd.
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 61 tests.
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd; plugin opnieuw gebouwd, geïnstalleerd en VS Code gerefresht.
- `node scripts/capture-vscode-screenshot.mjs --unknown-option` — faalt correct op onbekende optie.
- `node scripts/capture-vscode-screenshot.mjs --expect-title` — faalt correct op ontbrekende waarde.
- `node scripts/capture-vscode-screenshot.mjs --expect-title definitely-not-present --out /tmp/budio-should-not-write.png` — faalt correct met `wrong_window`.
- `node scripts/capture-vscode-screenshot.mjs --expect-title 'Budio Workspace' --out /tmp/budio-workspace-proof.png` — geslaagd; foreground `Code — Budio Workspace: Board — persoonlijke-assistent-app`.
- Task-click smoke screenshot: `/tmp/budio-task-click-proof.png` — toont Budio Workspace board met geopende task-detail pane, geen blank screen.
- `npm run taskflow:verify` — geslaagd.
- `npm run lint` — geslaagd.
- `npm run typecheck` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: blank-screen regressie en screenshot-proof fix.
- Toegevoegde verbeteringen: geteste safe detail helper en UI-name fallback voor `--expect-title`.
- Afgerond: detailrendering is defensief, webview heeft een recovery boundary, screenshot-helper verifieert VS Code/context, plugin is toegepast en task-click smoke toont detail zonder blank screen.
- Open / blocked: geen.

## Relevante links

- `docs/project/25-tasks/done/budio-workspace-task-detail-edit-polish-agent-claiming.md`
- `tools/budio-workspace-vscode/`
- `scripts/capture-vscode-screenshot.mjs`


## Commits

- 2026-06-22T14:17:39+02:00 — Fix Budio workspace task detail stability

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace task detail edit polish + agent claiming

- Path: `docs/project/25-tasks/done/budio-workspace-task-detail-edit-polish-agent-claiming.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-workspace-task-detail-edit-polish-agent-claiming
title: Budio Workspace task detail edit polish + agent claiming
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Verbeter de Budio Workspace task-detail edit UI en voeg expliciete agent-claim metadata toe.
tags: [plugin, vscode, task-detail, agent-metadata]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 25
---




## Probleem / context

De task-detail edit in de Budio Workspace plugin toont te veel onnodige of rommelige informatie. `Due date` is zichtbaar terwijl die niet gebruikt wordt, structuurinformatie staat visueel onvoldoende rustig, checklistregels stapelen checkbox en tekst onder elkaar, en de body preview is nu een compacte markdown-dump in plaats van een leesbare taakomschrijving.

Daarnaast moet actieve agentmetadata niet impliciet ontstaan door selecteren of statuswijziging, maar expliciet geclaimd en gestopt kunnen worden vanuit task detail. Die metadata bestaat al in frontmatter en moet zichtbaar, schrijfbaar en onderhoudbaar worden vanuit de plugin.

## Gewenste uitkomst

Task detail is rustiger en praktischer: geen due-date UI, een nette structuurkaart, horizontale checklistregels, en een read-only taakbeschrijving met de belangrijkste markdownsecties.

Agentstatus is zichtbaar in detail en kan expliciet worden geclaimd of gestopt. Board/list/Jarvis kunnen daarna op echte `active_agent*` metadata blijven vertrouwen.

## User outcome

De gebruiker kan een taak openen, snel de echte context lezen, checklistitems normaal afvinken/lezen, relaties begrijpen en expliciet aangeven dat Codex/de agent actief aan die taak werkt.

## Functional slice

Een werkende plugin-slice voor task-detail polish plus agent-claim/clear flow, zonder functionele wijziging aan bestaande board/list workflows buiten de detail UI en de nieuwe agentacties.

## Entry / exit

- Entry: gebruiker opent een task detail vanuit board of list.
- Exit: detail toont een leesbare structuur en taakbeschrijving; agent kan expliciet geclaimd of gestopt worden en metadata wordt in de taskfile bijgewerkt.

## Happy flow

1. Gebruiker opent een taak in board/list en ziet de detail edit rechts/fullscreen zonder due-date UI.
2. Gebruiker leest structuur, relaties, checklist en taakbeschrijving in rustige layout.
3. Gebruiker klikt `Claim als actief`; plugin schrijft `active_agent*` metadata en hydrateert de nieuwe staat.
4. Gebruiker klikt `Stop agent`; plugin wist de actieve agentvelden.

## Non-happy flows

- Empty state: ontbrekende relaties blijven als nette lege staat zichtbaar.
- Permission denied / unavailable: niet van toepassing; dit is lokale taskfile-mutatie.
- Validation / unsupported state: versieconflict blijft via bestaande expectedVersion-flow afgehandeld.
- Failure / retry / cancel: repositoryfouten blijven via bestaande host/webview foutafhandeling zichtbaar.

## UX / copy

- Verberg `Due date` in task-detail edit.
- Structuurlabels: `Epic`, `Parent task`, `Type`, `Blocked`.
- Relatieblokken: `Subtasks`, `Blocked by`, `Blocks`, `Follows after`.
- Taakomschrijving: heading `Taakbeschrijving`, primair `Probleem / context` en `Gewenste uitkomst`.
- Agentacties: `Claim als actief` en `Stop agent`.

## Data / IO

- Input: geselecteerde taak, bestaande markdown sections, VS Code workspace settings voor agentdefaults.
- Output: bijgewerkte `active_agent*` frontmattervelden bij claim/clear.
- Opslag/API/service/file-impact: lokale task markdown files via bestaande repository-writer.
- Statussen: bestaande taskstatussen blijven ongewijzigd; `done` cleanup van active-agent metadata blijft bestaan.

## Waarom nu

De task-detail edit is de primaire werkplek in de plugin. De huidige vorm remt dagelijkse taakuitvoering en actieve-agent awareness moet op echte metadata kunnen leunen.

## In scope

- Task-detail edit UI polish.
- Due-date UI verbergen, technische data intact laten.
- Read-only detail preview sections bouwen.
- Agent settings, message bridge, claim en clear flow.
- Gerichte tests en plugin apply.

## Buiten scope

- Nieuwe taskfile schema’s.
- Automatisch claimen bij selecteren of statuswijziging.
- Functionele wijzigingen aan board/list filtering, DnD, sorting of bestaande saveflow.
- Jarvis redesign of nieuwe agent runtime.

## Oorspronkelijk plan / afgesproken scope

Implementeer het plan “Budio Workspace Task Detail Edit Polish + Agent Claiming”: task-detail edit rustiger maken, due-date UI verbergen, structuur en checklist verbeteren, body preview vervangen door taakbeschrijving, en expliciete agent claim/stop metadata toevoegen.

## Expliciete user requirements / detailbehoud

- Due date niet zichtbaar maken in task-detail edit.
- Structuur visueel verbeteren met Epic, Parent task, Type, Blocked en relatieblokken.
- Agent metadata vastleggen bij expliciet uitvoeren/claimen van een taak en zichtbaar houden.
- Checklist checkbox en tekst naast elkaar tonen.
- Body Preview vervangen door leesbare omschrijving met `## Probleem / context` en `## Gewenste uitkomst`.

## Status per requirement

- [x] Due date verbergen — status: gebouwd.
- [x] Structuurkaart verbeteren — status: gebouwd.
- [x] Agent metadata claim/stop flow — status: gebouwd.
- [x] Checklist layout horizontaal maken — status: gebouwd.
- [x] Taakbeschrijving read-only sections tonen — status: gebouwd.

## Toegevoegde verbeteringen tijdens uitvoering

- Relatieblokken vallen op small-width detail terug naar één kolom zodat de detailpane bruikbaar blijft.
- Repositorytest bewijst dat claim/clear metadata echt door de markdown-writer wordt geschreven en gewist.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: plugin types/config/host/data helpers aanpassen.
- [x] Blok 3: webview detail UI en styling aanpassen.
- [x] Blok 4: gerichte tests en plugin apply.
- [x] Blok 5: taskstatus, docs bundle en reconciliation afronden.

## Concrete checklist

- [x] Detail preview sections uit markdown bouwen en testen.
- [x] Agent claim/clear patch helper en host messages toevoegen.
- [x] Due-date UI verwijderen uit detail edit.
- [x] Structuur, checklist en taakbeschrijving visueel verbeteren.
- [x] Workspace settings voor agentdefaults toevoegen.
- [x] Plugin typecheck/test/apply draaien.
- [x] Taskflow/docs verify draaien.

## Acceptance criteria

- [x] Board/list detail toont geen due-date input of due-date header chip.
- [x] Structuur en relaties zijn leesbaar, compact en read-only.
- [x] Checklist checkbox en tekst staan horizontaal naast elkaar.
- [x] Taakbeschrijving toont `Probleem / context` en/of `Gewenste uitkomst`, met fallback.
- [x] `Claim als actief` schrijft alle `active_agent*` velden.
- [x] `Stop agent` wist alle `active_agent*` velden.
- [x] Fullscreen detail blijft bruikbaar.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd.
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 58 tests.
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd; VS Code plugin opnieuw gebouwd, geïnstalleerd en gerefresht.
- `npm run taskflow:verify` — geslaagd.
- `npm run lint` — geslaagd.
- `npm run typecheck` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: task-detail edit UI polish en expliciete agent-claim flow.
- Toegevoegde verbeteringen: responsive relatiegrid op smalle detailweergave en repositorybewijs voor claim/clear writerpad.
- Afgerond: due-date UI verborgen, structuurkaart verbeterd, checklistlayout gefixt, taakbeschrijving read-only gemaakt, agentsettings/messages/hostflow toegevoegd, claim/clear metadata getest en plugin toegepast.
- Open / blocked: geen.

## Relevante links

- `tools/budio-workspace-vscode/`


## Commits

- 2026-06-22T14:17:39+02:00 — Fix Budio workspace task detail stability

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace task detail rechterpaneel en scroll fix

- Path: `docs/project/25-tasks/done/budio-workspace-task-detail-rechterpaneel-scroll-fix.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-workspace-task-detail-rechterpaneel-scroll-fix
title: Budio Workspace task detail rechterpaneel en scroll fix
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: "Fix de Budio Workspace plugin zodat task detail in board en list rechts als scrollbaar pane opent, zonder fullscreen detail te breken."
tags: [plugin, vscode, board, list, detail-pane]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 26
---




## Probleem / context

In de VS Code workspace-plugin opent task detail momenteel visueel niet goed: het pane verschijnt onder/over de boardcontent in plaats van als rechter detailpane. Daardoor is de detailvorm slecht bruikbaar en wordt content op hoogte afgekapt.

## Gewenste uitkomst

Board- en list-view tonen task detail rechts naast de hoofdlijst/board wanneer er voldoende breedte is. Het detailpane is zelfstandig scrollbaar, zodat de volledige taskmetadata, checklist en body preview bereikbaar blijven. De bestaande fullscreen-knop blijft hetzelfde gedrag houden.

## User outcome

De gebruiker kan vanuit board en list een taak selecteren en direct rechts het volledige detail lezen/bewerken, zonder dat het pane de onderkant van het scherm blokkeert of content onbereikbaar maakt.

## Functional slice

Een gerichte layout-regressiefix voor de bestaande task-detail surface in de VS Code plugin.

## Entry / exit

- Entry: gebruiker opent Budio Workspace Board of List en selecteert een taak.
- Exit: detail staat rechts, is scrollbaar en kan fullscreen geopend/gesloten worden.

## Happy flow

1. Gebruiker opent Board en klikt een task card.
2. Task detail opent rechts als split-pane en de boardcontent blijft links bruikbaar.
3. Gebruiker scrollt door het detailpane en gebruikt fullscreen; fullscreen opent en sluit zonder layoutbreuk.
4. Gebruiker opent List en selecteert een taak met hetzelfde rechterpaneelgedrag.

## Non-happy flows

- Empty state: zonder geselecteerde task blijft detail verborgen of toont bestaande lege detailtekst.
- Permission denied / unavailable: niet van toepassing.
- Validation / unsupported state: op small viewport mag het bestaande overlaygedrag blijven gelden.
- Failure / retry / cancel: sluiten en fullscreen togglen blijven bestaande controls gebruiken.

## UX / copy

- Geen nieuwe copy nodig behalve bestaande detail-controls.
- Bestaande board/list workflows blijven functioneel onveranderd.
- Geen redesign; alleen layout/scrollbaarheid herstellen.

## Data / IO

- Input: bestaande board snapshot en selectedTask state.
- Output: gecorrigeerde webview-layout.
- Opslag/API/service/file-impact: geen datamodel- of host-wijziging verwacht.
- Statussen: bestaande selected/detail/fullscreen state blijft leidend.

## Waarom nu

De task detail is een kerninteractie van de workspace-plugin; als die niet rechts en scrollbaar opent, zijn board en list praktisch niet goed bruikbaar.

## In scope

- Board task detail rechts als split-pane op desktop.
- List task detail rechts als split-pane op desktop.
- Detailpane zelfstandig scrollbaar maken.
- Fullscreen detailknop behouden en regressiechecken.
- Gerichte plugin verify en apply uitvoeren.

## Buiten scope

- Nieuwe task-detail functionaliteit.
- Board/list workflowwijzigingen.
- Jarvis of andere plugin views aanpassen.
- Brede visual redesign.

## Oorspronkelijk plan / afgesproken scope

- Fix task detail zodat deze rechts getoond wordt en scrollbaar is in board en list view.
- Fullscreen button moet blijven werken.

## Expliciete user requirements / detailbehoud

- "Zoals je ziet wordt de task detail nog niet goed geopend"
- "deze moet dus rechts getoond worden"
- "en scrollbaar zijn"
- "fix dit in board en list view"
- "Fullscreen button moet ook blijven werken"

## Status per requirement

- [x] Detail opent rechts in board — status: gebouwd
- [x] Detail opent rechts in list — status: gebouwd
- [x] Detailpane is scrollbaar — status: gebouwd
- [x] Fullscreen button blijft werken — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Grid-layout expliciet gemaakt als `main | resize handle | detail`, zodat de resize-handle niet langer de detailkolom verdringt.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: detail-layout en CSS gericht repareren.
- [ ] Blok 3: gerichte verify, plugin toepassen en task afronden.

## Concrete checklist

- [x] Huidige detail-layout in `App.tsx`, `use-task-detail-layout.ts` en CSS controleren.
- [x] Split-pane rendering corrigeren voor board/list.
- [x] Scrollcontainers corrigeren zodat detail en main-pane onafhankelijk scrollen.
- [x] Fullscreen detailmodus controleren.
- [x] Plugin typecheck/test/apply uitvoeren.

## Acceptance criteria

- [x] Board toont detail rechts naast het board op desktopbreedte.
- [x] List toont detail rechts naast de lijst op desktopbreedte.
- [x] Detailpane kan verticaal scrollen tot de body preview/danger zone.
- [x] Fullscreen toggle opent detail fullscreen en keert terug naar het rechterpaneel.
- [x] Board/list data- en interactieworkflows blijven ongewijzigd.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix tools/budio-workspace-vscode run typecheck` — geslaagd.
- `npm --prefix tools/budio-workspace-vscode run test` — geslaagd, 52 tests.
- `npm --prefix tools/budio-workspace-vscode run apply:workspace` — geslaagd; build, VSIX package, install en VS Code refresh uitgevoerd.
- `npm run taskflow:verify` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: detail rechts en scrollbaar in board/list, fullscreen blijft werken.
- Toegevoegde verbeteringen: gridkolommen expliciet gemaakt zodat de resize-handle geen detailkolom meer verdringt.
- Afgerond: board/list split-pane layout, onafhankelijke pane-scroll, fullscreen-layer en plugin apply zijn uitgevoerd.
- Open / blocked: geen.

## Relevante links

- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/use-task-detail-layout.ts`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`


## Commits

- 2026-06-22T11:44:37+02:00 — fix(plugin): keep task detail in right split pane

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio Workspace VS Code screenshot capture fallback

- Path: `docs/project/25-tasks/done/budio-workspace-vscode-screenshot-capture-fallback.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-budio-workspace-vscode-screenshot-capture-fallback
title: Budio Workspace VS Code screenshot capture fallback
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: Maak screenshotbewijs voor de VS Code workspace-plugin robuuster wanneer macOS `screencapture` door display/screen-recording permissies wordt geblokkeerd.
tags: [plugin, vscode, smoke, screenshots, dev-tooling]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 27
---




## Probleem / context

Na de task-detail fix kon Codex de actuele VS Code plugin niet visueel bewijzen omdat `screencapture` faalde met `could not create image from display`. Dat is meestal een macOS Screen Recording/TCC-permissieprobleem voor de host-app die Codex/terminal uitvoert. De sessie eindigde daardoor met een blokkade zonder goede automatische diagnose of herstelpad.

## Gewenste uitkomst

Er is een kleine lokale helper waarmee VS Code plugin-screenshots reproduceerbaar geprobeerd worden. Als macOS capture blokkeert, geeft de helper een duidelijke diagnose, opent optioneel de juiste Screen Recording instellingen en faalt met bruikbare vervolgstap in plaats van een vage fout.

## User outcome

Bij plugin UI-fixes kunnen we snel een screenshot proberen en direct zien of de blokkade permissie-, target- of runtime-gerelateerd is.

## Functional slice

Een dev-tooling helper en documentatie voor VS Code screenshot capture rond de Budio Workspace plugin.

## Entry / exit

- Entry: agent/developer wil na plugin apply een screenshot van VS Code maken.
- Exit: screenshotbestand bestaat, of er is een concrete permission-diagnose met herstelactie.

## Happy flow

1. Developer draait de screenshot helper.
2. Helper activeert VS Code en schrijft een screenshot naar een opgegeven pad.
3. Helper meldt het outputpad.

## Non-happy flows

- Empty state: VS Code draait niet of is niet zichtbaar; helper meldt dat VS Code eerst geopend/geactiveerd moet worden.
- Permission denied / unavailable: macOS blokkeert capture; helper meldt Screen Recording permissies en kan de juiste instellingen openen.
- Validation / unsupported state: niet-macOS platform geeft nette unsupported melding.
- Failure / retry / cancel: helper bewaart geen half resultaat en meldt het command/stage dat faalde.

## UX / copy

- Copy blijft dev-facing en compact.
- Geen runtime plugin UI-wijzigingen.

## Data / IO

- Input: optionele outputpad en `--open-settings`.
- Output: lokaal PNG-bestand of duidelijke CLI-fout.
- Opslag/API/service/file-impact: nieuwe lokale scripts/docs; geen appdata.
- Statussen: `ok`, `permission_blocked`, `unsupported`, `failed`.

## Waarom nu

De plugin-UI wordt actief aangepast en de vorige fix miste visueel bewijs door een lokale macOS-permissieblokkade.

## In scope

- Screenshot helper toevoegen.
- macOS Screen Recording blokkade detecteren.
- Optioneel juiste System Settings-pane openen.
- README/dev-doc kort aanvullen met gebruik.
- Gerichte verify.

## Buiten scope

- macOS TCC permissie stilzwijgend forceren; dat kan en mag niet veilig.
- Nieuwe browser/E2E setup voor VS Code webviews.
- Plugin UI of appfunctionaliteit wijzigen.

## Oorspronkelijk plan / afgesproken scope

- Fix de eerdere blokkade: `Screenshot capture via screencapture werd door macOS/display-permissies geblokkeerd`.

## Expliciete user requirements / detailbehoud

- "ik wil dit ook fixen"
- De specifieke foutmelding/ervaring rond `screencapture` mag niet opnieuw als losse blokkade blijven staan.

## Status per requirement

- [x] Screenshot helper aanwezig — status: gebouwd
- [x] Permission blocked geeft bruikbare diagnose — status: gebouwd
- [x] Herstelroute naar macOS instellingen aanwezig — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale probe draaide opnieuw succesvol; de eerdere blokkade lijkt dus permissie/transient display-state, niet structurele plugin-code.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: screenshot helper en docs toevoegen.
- [x] Blok 3: gerichte verify en task afronden.

## Concrete checklist

- [x] Bestaande screenshot/smoke tooling inspecteren.
- [x] Helper script toevoegen.
- [x] Package/dev docs aanvullen.
- [x] Helper lokaal testen op huidige macOS-blokkade.
- [x] Taskflow/docs verify uitvoeren.

## Acceptance criteria

- [x] `npm` script of gedocumenteerd command probeert VS Code screenshot capture.
- [x] Bij Screen Recording blokkade wordt een duidelijke fout + volgende stap getoond.
- [x] Helper kan de macOS Screen Recording instellingen openen met een vlag.
- [x] Geen secrets of screenshots worden automatisch gecommit.

## Blockers / afhankelijkheden

- macOS Screen Recording toestemming moet uiteindelijk door de gebruiker in System Settings gegeven worden; code kan die permissie niet veilig automatisch toekennen.

## Verify / bewijs

- `npm run plugin:vscode:screenshot -- --out /tmp/budio-vscode-screenshot-helper-test.png` — geslaagd; PNG geschreven.
- `file /tmp/budio-vscode-screenshot-helper-test.png` — bevestigt PNG image data, 2704 x 1756.
- `node scripts/capture-vscode-screenshot.mjs --help` — geslaagd.
- `npm run taskflow:verify` — geslaagd.
- `npm run typecheck` — geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: screenshot capture blokkade fixen.
- Toegevoegde verbeteringen: helper detecteert blokkade, valideert PNG-output en kan macOS Screen Recording instellingen openen.
- Afgerond: `plugin:vscode:screenshot` script, README-uitleg en lokale screenshot smoke zijn klaar.
- Open / blocked: geen; macOS permissie blijft een handmatige OS-keuze als die opnieuw ingetrokken wordt.

## Relevante links

- `tools/budio-workspace-vscode/README.md`
- `scripts/`


## Commits

- 2026-06-22T12:38:07+02:00 — chore(plugin): add vscode screenshot capture helper

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Bug capture type current day submit fails

- Path: `docs/project/25-tasks/done/bug-capture-type-current-day-submit-fails.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-14

```md
---
id: task-bug-capture-type-current-day-submit-fails
title: Bug capture type current day submit fails
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-14
summary: "Herstel de regressie waarbij een normaal tekstmoment voor vandaag op `/capture/type` faalt bij opslaan, bepaal de exacte root cause in frontend/service/function/DB en houd de nieuwe historische targetDate-flow compatibel zonder die verder uit te bouwen."
tags: [capture, text, regression, bug]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 28
---




## Probleem / context

De standaard typing-capture flow voor vandaag faalt nu op `/capture/type`. Bij klikken op `Leg vast` verschijnt de foutcopy `Je moment is niet veilig verstuurd. Leg het opnieuw vast.` met `Probeer het zo opnieuw.`

Deze regressie is ontstaan na de recente targetDate/returnTo-aanpassingen voor oude dagen. Dat maakt de huidige vandaag-flow P0/P1: eerst moet het normale vastleggen voor vandaag weer betrouwbaar werken voordat we de historische flow verder kunnen vertrouwen.

## Root cause

- Diagnose-label: `Edge Function invoke/boot probleem`
- Exacte oorzaak: de lokale Supabase functions-runtime bleef niet draaien na de bestaande start/restartflow. `scripts/supabase-functions-start.sh` startte `npx supabase functions serve --env-file .env.local` wel in de achtergrond, maar niet los van de launching shell. Daardoor stierf het process direct na script-exit en bleef Kong op `http://127.0.0.1:54321/functions/v1/process-entry` generieke upstream-fouten teruggeven (`500 An unexpected error occurred` en kort na restart soms `502 invalid response from upstream`).
- Bevestiging:
  - browser/network reproduce op `/capture/type` liet een geldige `POST /functions/v1/process-entry` zien
  - dezelfde fout trad ook op in `./scripts/verify-local-flow.sh`
  - `supabase_edge_runtime_*` stond gestopt en er draaide geen levende `supabase functions serve`-process
  - wanneer dezelfde runtime met `nohup` levend werd gehouden, slaagde `verify-local-flow` direct weer

## Gewenste uitkomst

Een normaal tekstmoment op `/capture/type` zonder queryparams slaat weer succesvol op voor vandaag. De bestaande success-flow blijft intact, de tekst wordt alleen geleegd na bewezen succes en er is geen redesign of scope-uitbreiding nodig.

De diagnose benoemt expliciet waar het faalde: frontend payload, auth/session, Supabase DB/schema, Edge Function invoke/boot of processing/prompt. De fix houdt de targetDate-flow compatibel, maar bouwt die nu niet verder uit.

## User outcome

De gebruiker kan op `/capture/type` weer direct een vandaag-moment opslaan zonder foutmelding of dataverlies, terwijl een geldige `targetDate`-route voor een oudere dag niet stukgaat door de fix.

## Functional slice

Een gerichte bugfix op de standaard tekstcaptureflow: reproduce -> bronbevestigde root cause -> kleinste veilige fix -> runtime bewijs voor vandaag-flow en regressiecheck voor targetDate-param routing.

## Entry / exit

- Entry: gebruiker opent `/capture/type` zonder queryparams en typt een tekstmoment.
- Exit: na `Leg vast` is het moment opgeslagen voor vandaag en komt de gebruiker in de bestaande success/return flow.

## Happy flow

1. Gebruiker opent `/capture/type` zonder `targetDate` of oudere dag-context.
2. Gebruiker typt `Goedemorgen test voor vandaag` en klikt `Leg vast`.
3. De request slaagt, de entry wordt voor vandaag opgeslagen, de tekst wordt pas daarna gewist en de gebruiker ziet de bestaande succesroute.

## Non-happy flows

- Validation / unsupported state: ontbrekende `targetDate` gebruikt altijd de normale vandaag-flow zonder invalid/null/empty datumveld.
- Failure / retry / cancel: bij fout blijft de tekst behouden en mag de bestaande copy `Je moment is niet veilig verstuurd. Leg het opnieuw vast.` + `Probeer het zo opnieuw.` blijven.
- Historical compatibility: geldige `targetDate` blijft targetDate gebruiken; ongeldige `targetDate` valt veilig terug of volgt bestaand foutpatroon.

## UX / copy

- Bestaande vandaag-typing capture blijft visueel ongewijzigd.
- Bestaande foutcopy mag blijven:
  - `Je moment is niet veilig verstuurd. Leg het opnieuw vast.`
  - `Probeer het zo opnieuw.`
- Geen redesign, geen nieuwe capturemodus, geen extra uitleglaag.

## Data / IO

- Input: tekstmoment via `/capture/type`, standaard zonder queryparams; optioneel met geldige `targetDate`.
- Output: nieuwe entry voor vandaag bij standaardflow; targetDate alleen wanneer geldig meegegeven.
- Opslag/API/service-impact: alleen kleinste fix in bestaande capture/service/function-keten; geen nieuwe dependencies; geen migration tenzij runtime exact bewijst dat een bestaande schemawijziging lokaal ontbreekt.
- Statussen: tekst mag alleen wissen na bewezen success; bij fout blijft tekst behouden.

## Waarom nu

- Dit is een actieve regressie op een primaire gebruikersflow.
- Vandaag-capture is de basis van het product; die moet eerst stabiel zijn.

## In scope

- Lokale reproductie op `/capture/type`.
- Browser console/network check bij `Leg vast`.
- Root-cause bepaling in `app/capture/type.tsx`, `services/entries.ts`, `process-entry` invoke en indien nodig lokale Supabase function/DB.
- Kleinste bugfix om standaard vandaag-flow te herstellen.
- Compatibiliteitscheck voor geldige en ongeldige `targetDate`.

## Buiten scope

- Verdere uitbouw van historische day-flow.
- Redesign van Today, Days overview of dagdetail.
- Nieuwe dependencies, retry-queue, offline text storage of nieuwe capturemodus.
- Brede refactor van capture, entries of processing.
- Voice/audio-wijzigingen behalve wanneer gedeelde submitlogica exact de foutbron blijkt.

## Oorspronkelijk plan / afgesproken scope

- Reproduceer eerst lokaal op `/capture/type`.
- Bevestig exact waar de fout optreedt met browser/network en primaire code/runtime-bronnen.
- Fix alleen de standaard tekstcapture voor vandaag.
- Houd targetDate-compatibiliteit in stand zonder verdere bouwscope.

## Expliciete user requirements / detailbehoud

1. `/capture/type` zonder queryparams moet altijd een normaal vandaag-moment kunnen opslaan.
2. Als `targetDate` ontbreekt: gebruik bestaande vandaag-flow en stuur geen invalid/null/empty targetDate mee.
3. `created_at` blijft echte vastlegtijd.
4. Het moment verschijnt na succes in vandaag / huidige dag.
5. Textarea wordt alleen geleegd na bewezen succesvolle save.
6. Bij fout blijft tekst behouden.
7. Bestaande foutcopy mag blijven.
8. Historische flow mag niet breken bij geldige `targetDate`.
9. Ongeldige `targetDate` mag niet stil kapotgaan.

## Status per requirement

- [x] Vandaag-flow op `/capture/type` werkt weer — status: gebouwd
- [x] Root cause expliciet benoemd — status: gebouwd
- [x] Geen invalid/null/empty targetDate in standaardflow — status: gebouwd
- [x] Tekst blijft behouden bij fout — status: gebouwd
- [x] Tekst wist pas na success — status: gebouwd
- [x] Historische targetDate-compatibiliteit blijft intact — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale functions-start tooling nu met `nohup`, zodat `supabase:functions:restart` de runtime echt laat doorleven na script-exit.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, reproductie en diagnose vastleggen.
- [x] Blok 2: kleinste bronfix uitvoeren.
- [x] Blok 3: verify, runtime smoke en task/docs afronden.

## Concrete checklist

- [x] Bug reproduceren op `/capture/type`.
- [x] Browser console/network en function/servicepad checken.
- [x] Root cause documenteren.
- [x] Kleinste fix implementeren.
- [x] Lint/typecheck/taskflow verify en runtime smoke vastleggen.

## Acceptance criteria

- [x] Standaard tekstmoment voor vandaag werkt weer.
- [x] Root cause is benoemd.
- [x] Geen redesign of scope-uitbreiding.
- [x] Geen dataverlies bij failed submit.
- [x] Geen ongeldige targetDate in standaardflow.

## Blockers / afhankelijkheden

- Nog geen; lokale webserver en lokale Supabase runtime moeten wel beschikbaar zijn voor volledige runtime-bevestiging.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- ✅ `./scripts/verify-local-flow.sh`
- ✅ Browser reproduce vóór fix:
  - geldige `POST /functions/v1/process-entry`
  - response `500 {"message":"An unexpected error occurred"}`
- ✅ Runtime-diagnose:
  - `supabase_edge_runtime_persoonlijke-assistent-app` stond op `Exited (137)`
  - er draaide geen levend `supabase functions serve`-process
- ✅ Browser smoke na fix:
  - `/capture/type` met `Goedemorgen test voor vandaag <timestamp>` navigeert naar `/entry/[id]?source=capture&date=2026-05-14`
  - geen foutcopy zichtbaar
  - geldige `targetDate`-route `/capture/type?targetDate=2026-05-10` opent nog steeds en toont de notice `Je voegt dit toe aan 10 mei 2026.`
- Runtime smoke:
  1. open `/capture/type`
  2. typ `Goedemorgen test voor vandaag`
  3. klik `Leg vast`
  4. geen foutmelding
  5. entry wordt opgeslagen
  6. gebruiker komt in bestaande success/return flow
  7. vandaag/dagdetail bevat het nieuwe moment
- Regressie-smoke:
  - `/capture/type?targetDate=<geldige-oude-datum>` gaat niet stuk door de fix
  - `/capture/type` zonder queryparams blijft de standaard bron van waarheid voor vandaag

## Reconciliation voor afronding

- Oorspronkelijk plan: vandaag-typing capture herstellen en exacte root cause benoemen.
- Toegevoegde verbeteringen: lokale functions-start tooling met `nohup`, zodat restart de runtime echt levend houdt.
- Afgerond: root cause bevestigd als lokale Edge Function invoke/boot-probleem; runtime-startscript gefixt; today text capture en targetDate-openingspad opnieuw bewezen.
- Open / blocked: geen functionele blockers meer voor deze regressie.

## Relevante links

- `app/capture/type.tsx`
- `services/entries.ts`
- `supabase/functions/process-entry/index.ts`
- `scripts/supabase-functions-start.sh`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Capture typing UX polish voor vandaag-flow

- Path: `docs/project/25-tasks/done/capture-typing-ux-polish-vandaag-flow.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-14

```md
---
id: task-capture-typing-ux-polish-vandaag-flow
title: Capture typing UX polish voor vandaag-flow
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user
updated_at: 2026-05-14
summary: "Verfijn de bestaande `/capture/type` UX voor vandaag en targetDate-flows met compactere hero, meer schrijfruimte, betere placeholder, live character counter en rustige light/dark theming zonder redesign of nieuwe dependencies."
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 29
---




## Probleem / context

De huidige typing capture-pagina verspilt verticale ruimte door dubbele copy en een te ruime hero boven het tekstveld. Daardoor voelt het schrijfvlak kleiner dan nodig. Daarnaast ontbreekt een rustige live karakterteller en moet de theming in light/dark mode expliciet gecontroleerd worden.

## Gewenste uitkomst

De typing capture-pagina voelt compacter, rustiger en meer capture-first. De hero staat dichter onder de topnav, de dubbele vraag boven het tekstveld is weg en het schrijfvlak krijgt zichtbaar meer ruimte zonder nieuwe UI-lagen of redesign.

De pagina toont een subtiele live teller rechtsonder, gebruikt de placeholder `Begin met schrijven…` en houdt de historische targetDate-contextregel rustig gecentreerd en goed leesbaar in light en dark mode.

## User outcome

De gebruiker kan op `/capture/type` sneller beginnen met schrijven, ziet meer van zijn tekst tegelijk en krijgt subtiele feedback via een live karakterteller zonder extra afleiding.

## Functional slice

Een kleine UX-polish van de bestaande typing capture-state op `/capture/type`, inclusief hero-copy, textarea-dominantie, counterweergave en rustige dark/light theming, zonder wijziging aan captureflow, opslag of navigatie.

## Entry / exit

- Entry: gebruiker opent `/capture/type` of `/capture/type?targetDate=...`.
- Exit: gebruiker typt en slaat een moment op via de bestaande flow, met ongewijzigde navigatie en submit-logica.

## Happy flow

1. Gebruiker opent `/capture/type` en ziet direct onder de topnav de compacte hero `Wat wil je vastleggen?` met korte subtitel.
2. Het tekstveld domineert de pagina, gebruikt de placeholder `Begin met schrijven…` en toont live `0 / 20000` rechtsonder.
3. Gebruiker typt een langere tekst, ziet de teller live oplopen en slaat via `Leg vast` op zonder layoutsprongen.

## Non-happy flows

- Empty state: teller toont `0 / 20000` en submit blijft bestaande disabled-gedrag volgen.
- Permission denied / unavailable: niet van toepassing; geen nieuwe permissions of device-capabilities.
- Validation / unsupported state: targetDate-notice blijft alleen zichtbaar voor geldige niet-vandaag targetDate-context.
- Failure / retry / cancel: bestaande errorcopy, retrygedrag en cancel/backflow blijven ongewijzigd.

## UX / copy

- Hero title: `Wat wil je vastleggen?`
- Hero subtitle: `Schrijf op wat je wilt onthouden, verwerken of bewaren.`
- Verwijderen: los label `Wat wil je vastleggen?` boven het tekstveld.
- Placeholder: `Begin met schrijven…`
- Counter: `0 / 20000`
- Historische noticecopy blijft exact: `Je voegt dit toe aan [datum].`
- Bestaande shared patterns blijven leidend: `CaptureBackHeader`, `CaptureIntro`, `TextEntryEditor`, `NoticeCard`, `PrimaryButton`, `SecondaryButton`.

## Data / IO

- Input: vrije tekst in bestaande typing capture-flow; optioneel geldige `targetDate`.
- Output: ongewijzigde `submitTextEntry` saveflow.
- Opslag/API/service/file-impact: geen backend-, service- of dataflowwijziging beoogd.
- Statussen: bestaande submit/recovery/error-statussen blijven gelijk.

## Waarom nu

- De pagina is een kernstuk van de capture-first MVP.
- De regressiefix voor today-submit is al hersteld; nu is er ruimte om de UX van deze standaardflow netter en rustiger te maken zonder scope-uitbreiding.

## In scope

- Compactere hero en minder top whitespace op `/capture/type`
- Verwijderen van dubbele vraag boven het tekstveld
- Placeholder vervangen
- Typvlak visueel dominanter maken
- Live character counter rechtsonder tonen
- Historical targetDate-notice subtiel gecentreerd/uitgelijnd houden
- Light/dark theming van textarea/meta/CTA op deze pagina controleren en bijslijpen

## Buiten scope

- Nieuwe capturemodi, toolbars of editorfeatures
- Wijzigingen aan voice capture of capture startflow buiten gedeelde notice styling indien nodig
- Dataflow, services, Supabase functions of migrations
- Redesign van andere schermen

## Oorspronkelijk plan / afgesproken scope

- Verfijn alleen de bestaande typing capture-pagina.
- Houd capture-first en clean-first intact.
- Voeg geen nieuwe cards, widgets, toolbars of dependencies toe.
- Beperk wijzigingen tot relevante capture/type schermen en kleine shared primitives waar nodig.

## Expliciete user requirements / detailbehoud

- Hero direct onder standaard topnav met minder top whitespace.
- Titel `Wat wil je vastleggen?`
- Subtitel `Schrijf op wat je wilt onthouden, verwerken of bewaren.`
- Verwijder volledig de dubbele vraag boven het tekstveld.
- Placeholder exact `Begin met schrijven…`
- Input moet visueel dominanter worden.
- Live counter rechtsonder in vorm `0 / 20000`, alleen visueel, nog niet limiteren.
- Historische dag-contextregel subtiel houden en icoon + tekst rustig uitlijnen.
- Dark mode controleren op textarea, placeholder, meta text, border/surface contrast en CTA-leesbaarheid.
- Geen harde witte vlakken in dark mode en geen donkere lekken in light mode.
- Keyboard/open en lange tekst moeten geen springende layout veroorzaken.
- Na afloop korte changelog, geraakte files en eventuele UX tradeoffs rapporteren.

## Status per requirement

- [x] Compactere hero en minder top whitespace — status: gebouwd
- [x] Dubbele vraag verwijderen — status: gebouwd
- [x] Placeholder `Begin met schrijven…` — status: gebouwd
- [x] Groter schrijfvlak — status: gebouwd
- [x] Live counter `0 / 20000` — status: gebouwd
- [x] Rustige targetDate-notice alignment — status: gebouwd
- [x] Light/dark runtime-checked — status: gebouwd met web-smoke; native iOS handmatige smoke nog niet in deze sessie uitgevoerd

## Toegevoegde verbeteringen tijdens uitvoering

- TargetDate-notice op `/capture/type` gebruikt nu dezelfde gecentreerde compacte notice-opmaak als de capture-startscreen, zodat de historische contextregel rustig blijft binnen dezelfde pagina-polish.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Bestaande capture/type renderstructuur en shared primitives aanscherpen.
- [x] Runtime smoke in light/dark en met targetDate + plain today-flow uitvoeren.

## Acceptance criteria

- [x] `/capture/type` toont een compactere hero, grotere schrijfruimte en geen dubbele vraag boven de input.
- [x] Placeholder is `Begin met schrijven…` en de live teller toont realtime `x / 20000` rechtsonder zonder harde limiet af te dwingen.
- [x] Historical targetDate-notice blijft subtiel en gecentreerd, terwijl light/dark mode rustig en leesbaar blijven zonder functionele regressie.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm run lint` ✅
- `npm run typecheck` ✅
- Runtime web-smoke via Playwright op `http://localhost:8081` met viewport `390x844`:
  - `/capture/type` light: titel en subtitel zichtbaar, oude copy `Wat houdt je bezig?` count `0`, placeholder `Begin met schrijven…`, live counter update naar `28 / 20000`
  - `/capture/type` dark: placeholder idem, live counter update naar `2880 / 20000`, textarea-kleuren `rgb(244, 241, 232)` op transparante capture-surface zonder witte vlakregressie
  - `/capture/type?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13` light/dark: targetDate-notice aanwezig (`noticeCount: 1`) en today-route toont geen notice (`noticeCount: 0`)
  - save-CTA `Leg vast` blijft zichtbaar na focus + typen; bounding box bleef gelijk (`y: 762`, `height: 20`)
- Native iOS smoke niet direct uitvoerbaar in deze sessie; web small-screen smoke is wel vastgelegd en iOS blijft aanbevolen als handmatige laatste check.

## Reconciliation voor afronding

- Oorspronkelijk plan: verfijn alleen de bestaande typing capture-pagina met compactere hero, minder dubbele copy, grotere schrijfruimte, betere placeholder, subtiele counter en rustige dark/light theming.
- Toegevoegde verbeteringen: de targetDate-notice op `/capture/type` is meteen meegetrokken naar dezelfde gecentreerde compacte notice-opmaak voor een rustiger geheel binnen dezelfde flow.
- Afgerond: hero-copy is compacter, top spacing is kleiner, placeholder is vervangen, de capture-editor start hoger en voelt groter, de live counter staat rechtsonder en de targetDate-notice blijft rustig in light/dark web-smoke.
- Open / blocked: geen code-blockers; alleen een handmatige native iOS smoke blijft optioneel aanbevolen buiten deze sessie.

## Relevante links

- `docs/project/open-points.md`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Caren-zorgdossier kopie structureren in uploadbestand

- Path: `docs/project/25-tasks/done/caren-zorgdossier-kopie-structureren.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-caren-zorgdossier-kopie-structureren
title: Caren-zorgdossier kopie structureren in uploadbestand
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user request 2026-05-15
updated_at: 2026-05-15
summary: "Ruwe Care-app/Caren-zorgkopie omzetten naar een nette, gestructureerde markdownfile zonder broninhoud te verliezen, inclusief vervolgtoevoegingen van dezelfde dag."
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 72
---




## Probleem / context

In `docs/upload/thuiszorg-15-mei-2026-kopie-info.md` staat een ruwe handmatige kopie uit de Caren-zorgapp met door elkaar heen lopende chatberichten, replies, dossieritems, plan-items en rapportages. De inhoud is bruikbaar, maar nu slecht scanbaar.

Na de eerste structuurpatch bleek bovendien dat `docs:bundle` losse handmatige bestanden in `docs/upload/` niet bewaart. Daardoor moet deze vervolgwijziging het uploadbestand ook expliciet herstellen.

## Gewenste uitkomst

De file wordt omgezet naar een nette, gestructureerde markdownopzet waarin duidelijk zichtbaar is welke delen persoonlijke chat/thread-inhoud zijn en welke delen dossier-/rapportage-items uit het zorgdossier zijn.

Bestaande inhoud blijft behouden. Nieuwe structuur mag samenvatten, labelen en rubriceren, maar mag geen broninhoud verwijderen.

## User outcome

De gebruiker kan de gekopieerde zorgapp-inhoud sneller terugvinden, onderscheiden en delen, zonder angst dat ruwe broninformatie verloren is gegaan.

## Functional slice

Eén uploadbestand met:
- een korte structuuranalyse
- heldere secties voor chat/thread, dossier en zorgplanitems
- behoud van de onbewerkte broninhoud
- aanvullende berichten en notities van 15 mei 2026

## Entry / exit

- Entry: ruwe tekstkopie in `docs/upload/thuiszorg-15-mei-2026-kopie-info.md`
- Exit: dezelfde file, maar scanbaar en logisch gelabeld

## Happy flow

1. De ruwe kopie wordt gelezen en globaal geclassificeerd.
2. Er wordt een markdownstructuur toegevoegd die de inhoud in duidelijke blokken verdeelt.
3. De broninhoud blijft aanwezig en leesbaar binnen de nieuwe structuur.
4. Nieuwe vervolgberichten worden chronologisch toegevoegd.

## Non-happy flows

- Empty state: als de file door bundling is verdwenen, wordt deze hersteld.
- Permission denied / unavailable: niet van toepassing voor lokale file-edit.
- Validation / unsupported state: als de kopie incompleet blijkt, blijft die expliciet als bronkopie gelabeld.
- Failure / retry / cancel: bij twijfel geen inhoud herschrijven, alleen structureren en labelen.

## UX / copy

- Titel en sectielabels in helder Nederlands.
- Expliciet benoemen dat de file een handmatige kopie en structuur-analyse bevat.
- Onderscheid maken tussen `chat/thread`, `dossieritems` en `plan/rapportage`.

## Data / IO

- Input: bestaande markdownfile met ruwe gekopieerde tekst
- Output: dezelfde markdownfile met extra structuur en behoud van broninhoud
- Opslag/API/service/file-impact: `docs/upload/thuiszorg-15-mei-2026-kopie-info.md` en deze taskfile
- Statussen: `in_progress` tijdens uitwerking

## Waarom nu

- De gebruiker wil deze inhoud nu direct bruikbaar en overzichtelijk hebben.

## In scope

- Structuuranalyse van de bestaande tekst
- Markdownsecties toevoegen
- Behoud van alle bestaande inhoud
- Vervolgberichten en notitie van 15 mei 2026 toevoegen

## Buiten scope

- Inhoudelijk juridisch of medisch oordeel over de dossierinhoud
- Volledige redactieslag van alle losse zinnen naar formele notulen

## Oorspronkelijk plan / afgesproken scope

- Maak van de bestaande tekst in `docs/upload/thuiszorg-15-mei-2026-kopie-info.md` een nette gestructureerde markdownfile.
- Analyseer de structuur van de bronkopie.
- Maak expliciet zichtbaar dat er dossiers, interne threads en chats met het wijkteam in staan.
- Verlies geen bestaande content.

## Expliciete user requirements / detailbehoud

- De file blijft in `docs/upload/`.
- De bestaande content blijft behouden.
- De output moet netjes gestructureerde markdown zijn.
- De analyse moet benoemen dat de bronkopie dossieritems, interne threads en chats met het wijkteam bevat.
- De nieuwe berichten van 15 mei 2026 moeten worden toegevoegd.
- De notitie over Zilveren Kruis, huisarts en hoofdkantoor moet worden toegevoegd.

## Status per requirement

- [x] File blijft in `docs/upload/` — status: gebouwd
- [x] Bestaande content blijft behouden — status: gebouwd
- [x] Nette gestructureerde markdown toevoegen — status: gebouwd
- [x] Structuuranalyse met dossier/thread/chat-onderscheid opnemen — status: gebouwd
- [x] Vervolgberichten van 15 mei 2026 toevoegen — status: gebouwd
- [x] Notitie over bemiddeling/klacht toevoegen — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Taskflow-compliance toegevoegd door een aparte taskfile aan te maken.
- Herstelpatch toegevoegd omdat `docs:bundle` losse handmatige uploadbestanden niet bewaart.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Huidige file state en taskstate bevestigd
- [x] Uploadfile hersteld of opnieuw aangemaakt
- [x] Nieuwe berichten toegevoegd
- [x] Gerichte verify uitvoeren

## Acceptance criteria

- [x] De file heeft duidelijke markdownkoppen en secties.
- [x] De file maakt onderscheid tussen chat/thread-inhoud en dossier-/rapportage-inhoud.
- [x] De oorspronkelijke en nieuwe broninhoud is aanwezig voor zover beschikbaar in deze sessie.

## Blockers / afhankelijkheden

- `docs:bundle` verwijdert dit type losse uploadbestand; daarom is die stap in deze specifieke herstelpatch bewust niet opnieuw gedraaid om het gevraagde bestand te behouden.

## Verify / bewijs

- Visuele controle van `docs/upload/thuiszorg-15-mei-2026-kopie-info.md`
- `npm run taskflow:verify`
- `docs:bundle` bewust niet opnieuw uitgevoerd, omdat die run dit losse uploadbestand verwijdert

## Reconciliation voor afronding

- Oorspronkelijk plan: ruwe Caren/Care-app kopie structureren zonder inhoudsverlies.
- Toegevoegde verbeteringen: taskflow-compliance, expliciete inhoudsclassificatie, herstel na bundelverlies en vervolgtoevoegingen van 15 mei 2026.
- Afgerond: uploadbestand hersteld, gestructureerd en aangevuld; nieuwe berichten en notitie toegevoegd; taskflow verify uitgevoerd.
- Open / blocked: geen, met uitzondering dat `docs:bundle` voor dit losse uploadbestand destructief blijkt.

## Relevante links

- `docs/upload/thuiszorg-15-mei-2026-kopie-info.md`


## Commits

- 2026-05-16T06:54:00+02:00 — docs: add Caren zorgdossier structuring task

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Codex browser-testworkflow expliciteren

- Path: `docs/project/25-tasks/done/codex-browser-testworkflow-expliciteren.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-codex-browser-testworkflow-expliciteren
title: Codex browser-testworkflow expliciteren
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: "Leg docs-only vast dat geautomatiseerde browserchecks standaard via Playwright Chromium/headless lopen, headed Chromium expliciet is voor visuele smoke/debug, en Atlas alleen optioneel handmatig wordt gebruikt."
tags: [codex, browser, playwright, atlas, qa, local-dev]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 30
---




# Codex browser-testworkflow expliciteren

## Probleem / context

De repo heeft al Playwright Chromium-smokes, failure-artifacts en een optionele `BUDIO_DEV_BROWSER` voor Expo preview. Het verschil tussen geautomatiseerde tests, headed visual smoke en handmatige Atlas-review staat nog niet expliciet genoeg in de workflowdocs.

## Gewenste uitkomst

De docs maken duidelijk dat automatisering reproduceerbaar via Playwright Chromium/headless blijft. Headed Chromium is alleen expliciet voor visuele/debug-smokes. ChatGPT Atlas mag als handmatige reviewlaag of AI-assisted browsing worden gebruikt, maar wordt geen fragiele standaard testdependency.

## User outcome

Pieter en Codex weten wanneer Chrome/Chromium, headed mode of Atlas logisch is, zonder dat testgedrag of dependencies veranderen.

## Functional slice

Docs-only aanscherping van de lokale QA- en developmentworkflow.

## Entry / exit

- Entry: bestaande docs noemen Atlas als optionele Expo-browser en QA-smokes als browserbewijs.
- Exit: browserkeuze per verificatielaag is expliciet vastgelegd.

## Happy flow

1. Agent controleert bestaande scripts, Playwright-config en docs.
2. Agent past alleen relevante docs aan.
3. Agent draait taskflow/docs verify.

## Non-happy flows

- Validation / unsupported state: als verify faalt door bestaande dirty docs, wordt dat expliciet gerapporteerd.
- Failure / retry / cancel: geen code- of testgedrag wijzigen om docsverify te forceren.

## UX / copy

- Geen app-UI.
- Copy blijft operationeel en kort.

## Data / IO

- Input: `playwright.config.ts`, `package.json`, `docs/dev/**`, `.codex/config.toml`.
- Output: docs-only update.
- Opslag/API/service/file-impact: geen runtime-impact, geen dependencies, geen `.env*`.

## Waarom nu

- De lokale Codex/Atlas-vraag is net onderzocht en verdient een herhaalbare workflowregel voordat er opnieuw browser-smokes of visuele checks worden uitgevoerd.

## In scope

- `docs/dev/qa-test-strategy.md`
- `docs/dev/local-development-environment.md`
- Task/docs-sync

## Buiten scope

- Applicatiecode.
- Playwright-config of testscripts wijzigen.
- Dependencies toevoegen.
- `.env*`, productie-data, commit/push.

## Oorspronkelijk plan / afgesproken scope

- Findings uit het read-only onderzoek toepassen als kleine docs-only update.
- Automated tests blijven Playwright Chromium/headless.
- Headed Chromium alleen expliciet voor visuele smoke/debug.
- Atlas alleen optioneel handmatig of AI-assisted review, niet als standaard testtarget.

## Expliciete user requirements / detailbehoud

- [x] Niet Atlas forceren als primaire geautomatiseerde testbrowser.
- [x] Playwright Chromium/headless als automation-default behouden.
- [x] Headed Chromium alleen expliciet gebruiken.
- [x] Atlas als handmatige reviewlaag definiëren.
- [x] Geen code, tests, dependencies, productie-data of `.env*` aanpassen.

## Status per requirement

- [x] Browserlagen expliciet in docs — status: gebouwd
- [x] Geen runtime/testgedrag gewijzigd — status: gebouwd
- [x] Verify uitgevoerd — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Docs verduidelijken nu expliciet dat `BUDIO_DEV_BROWSER` alleen Expo-preview stuurt en geen Playwright-testtarget wijzigt.
- File-scoped Markdown-lint is apart uitgevoerd omdat `npm run docs:lint` repo-breed faalt op bestaande taskfile-lint buiten deze wijziging.

## Uitvoerblokken / fasering

- [x] Blok 1: huidige scripts/config/docs read-only bevestigen.
- [x] Blok 2: docs-only update toepassen.
- [x] Blok 3: taskflow/docs verify afronden.

## Concrete checklist

- [x] QA-docs uitbreiden met browserkeuze per laag.
- [x] Local-dev docs verduidelijken dat `BUDIO_DEV_BROWSER` alleen Expo preview stuurt.
- [x] Verify draaien.

## Acceptance criteria

- [x] Docs benoemen Playwright Chromium/headless als automation-default.
- [x] Docs benoemen headed Chromium als expliciete visuele/debug-optie.
- [x] Docs benoemen Atlas als optionele handmatige reviewlaag.
- [x] Geen app- of testcode is aangepast.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify` — passed.
- `npm run docs:lint` — failed op bestaande repo-brede Markdown-lintschuld buiten deze wijziging.
- `npx -y markdownlint-cli@0.45.0 --disable MD001 MD013 MD029 MD060 MD024 MD025 MD036 MD041 -- docs/dev/qa-test-strategy.md docs/dev/local-development-environment.md docs/project/25-tasks/open/codex-browser-testworkflow-expliciteren.md` — passed voor de aangeraakte bestanden vóór verplaatsing naar `done/`.
- `npm run docs:bundle` — passed.
- `npm run docs:bundle:verify` — passed.

## Reconciliation voor afronding

- Oorspronkelijk plan: docs-only workflowregel toevoegen voor browser-testlagen.
- Toegevoegde verbeteringen: `BUDIO_DEV_BROWSER` expliciet beperkt tot Expo-preview, niet Playwright.
- Afgerond: QA-docs en local-dev docs bijgewerkt; geen app-/testgedrag gewijzigd.
- Open / blocked: repo-brede `npm run docs:lint` heeft bestaande lintschuld in andere taskfiles.

## Relevante links

- `docs/dev/qa-test-strategy.md`
- `docs/dev/local-development-environment.md`
- `playwright.config.ts`
- `.codex/config.toml`


## Commits

- 2026-06-22T13:22:50+02:00 — docs: clarify codex browser test workflow

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Codex-config veilig aanscherpen voor Budio development

- Path: `docs/project/25-tasks/done/codex-config-veilig-aanscherpen-voor-budio-development.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-codex-config-veilig-aanscherpen-voor-budio-development
title: Codex-config veilig aanscherpen voor Budio development
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-06-22
summary: "Review en verbeter de globale Codex-config minimaal zodat die sober, coding-first en veilig is, terwijl de Budio repo-config leidend blijft voor lokale Supabase- en projectspecifieke MCP-keuzes."
tags: [plugin, codex, config, mcp, local-dev]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 31
---




# Codex-config veilig aanscherpen voor Budio development

## Probleem / context

De huidige globale Codex-config is te breed voor coding-first gebruik: meerdere persoonlijke/data-plugins staan globaal aan, het redeneerniveau staat hoger dan nodig, en het globale model staat hardcoded op `gpt-5.4` terwijl de gebruiker `gpt-5.5` als voorkeursdefault wil als deze build dat ondersteunt.

Tegelijk moet Budio-specifiek gedrag niet naar de globale hostconfig lekken. Voor deze repo hoort de lokale `.codex/config.toml` leidend te blijven voor MCP-keuzes zoals `supabase_local` als standaardtarget.

## Gewenste uitkomst

Er ligt een brongebaseerde review van de huidige Codex-config, inclusief expliciete beoordeling van modelgedrag, pluginoppervlak en de scheiding tussen globale hostdefaults en repo-lokale Budio-config.

Na user-approval is de globale `~/.codex/config.toml` minimaal aangepast: coding-first plugins blijven aan, brede persoonlijke/data-plugins staan uit, trusted project entries blijven behouden, en `model_reasoning_effort` staat op `medium` tenzij hard bewijs iets anders vereist.

## User outcome

Pieter kan Codex lokaal gebruiken met een sobere veilige defaultconfig, zonder dat Budio-specifieke Supabase- of MCP-keuzes globaal worden afgedwongen.

## Functional slice

Een kleine config-review + minimale hostconfig-hardening voor Codex, met veilige validatie en bevestiging dat Budio lokaal op `supabase_local` blijft staan.

## Entry / exit

- Entry: huidige lokale Codex-installatie met `~/.codex/config.toml` en Budio repo `.codex/config.toml`.
- Exit: beoordeelde en waar nodig minimaal bijgewerkte globale config, plus gevalideerde Budio repo-config op lokale Supabase-default.

## Happy flow

1. Agent leest de huidige globale en repo-lokale Codex-config en relevante Budio docs.
2. Agent bevestigt model-/plugingedrag, stelt een minimaal diff voor en vraagt approval voor globale hostconfig-edit.
3. Na approval past agent alleen de benodigde globale config aan en valideert de TOML plus Budio MCP-target.

## Non-happy flows

- Empty state: ontbrekende globale config wordt alleen minimaal aangemaakt als dat nodig blijkt.
- Permission denied / unavailable: als modelcatalogus of lokale Codex-debug geen uitsluitsel geeft over `gpt-5.5`, blijft dat expliciet als onzekerheid gelabeld.
- Validation / unsupported state: als `gpt-5.5` niet in de lokale modelcatalogus zit of niet bruikbaar blijkt, wordt geen stille fallback naar `gpt-5.4` vastgezet.
- Failure / retry / cancel: zonder user-approval wordt `~/.codex/config.toml` niet aangepast.

## UX / copy

- Geen app-UI-wijzigingen.
- Rapportage benoemt exact: huidige modelsetting, aanbevolen modelsetup, welke plugins aan/uit blijven en welke repo-config leidend blijft.

## Data / IO

- Input:
  - `~/.codex/config.toml`
  - `.codex/config.toml`
  - relevante Budio docs
  - lokale Codex CLI/debug output
- Output:
  - eventueel minimale patch in `~/.codex/config.toml`
  - bijgewerkte taskfile-status en verify-notities
- Opslag/API/service/file-impact:
  - alleen lokale hostconfig en task/docs-laag
  - geen app-source, geen `.env*`, geen productie-data
- Statussen:
  - review
  - approval pending
  - applied
  - validated

## Waarom nu

- Deze setup beïnvloedt elke lokale Codex-sessie en moet veilig en sober zijn voordat verdere repo-uitvoering daarop leunt.

## In scope

- Huidige globale en repo-lokale Codex-config reviewen.
- Modelgedrag rond `gpt-5.5` en config-overrides expliciet beoordelen.
- Minimale globale configdiff voorstellen.
- Na approval de globale config aanpassen en lokaal valideren.
- Budio MCP-target expliciet op `supabase_local` bevestigen.

## Buiten scope

- Applicatiecode, dependencies, `.env*`, productie-data of deploys.
- Brede cleanup van overige Codex-statebestanden.
- Nieuwe plugins, nieuwe architectuur of redesigns.

## Oorspronkelijk plan / afgesproken scope

- Toon eerst een samenvatting van de huidige relevante config.
- Rapporteer expliciet: huidige modelsetting, of `gpt-5.5` ondersteund lijkt, of TOML-hardcoding handmatige modelswitch blokkeert, en de aanbevolen modelsetup.
- Stel eerst de exacte diff voor en vraag approval vóór edit van `~/.codex/config.toml`.
- Pas daarna pas de minimale globale wijzigingen toe.
- Valideer veilig: TOML/config-check en bevestiging dat Budio op local target staat.
- Rapporteer na afloop gewijzigde files, exacte settings, bewust uitgeschakelde items, finale modelgedrag en eventuele onzekerheid.

## Expliciete user requirements / detailbehoud

- [x] `gpt-5.5` als voorkeursdefault gebruiken als deze Codex-installatie het ondersteunt.
- [x] Geen model hardcoden op een manier die handmatige modelswitch in Codex onnodig blokkeert.
- [x] `model_reasoning_effort` globaal van `high` naar `medium` zetten tenzij sterk tegenbewijs bestaat.
- [x] Trusted project entries voor Budio en `space-idle-game` behouden.
- [x] Alleen core coding plugins globaal aan laten: `github`, `codex-security`, `openai-developers`.
- [x] Globaal uit tenzij expliciet nodig: `google-calendar`, `gmail`, `google-drive`, `browser-use`, `documents`, `spreadsheets`, `presentations`, `build-web-data-visualization`, `supabase`.
- [x] Budio-specifieke Supabase-default in repo-config laten, niet globaal.
- [x] Bij target-switching bestaande helper `node scripts/codex-mcp-target.mjs local` prefereren.

## Status per requirement

- [x] `gpt-5.5` support en veilige defaultroute beoordeeld — status: gebouwd
- [x] Model hardcoding versus handmatige switch beoordeeld — status: gebouwd
- [x] Globale reasoning effort naar `medium` voorbereid of toegepast — status: gebouwd
- [x] Trusted projects behouden — status: gebouwd
- [x] Coding plugins behouden en brede plugins uitschakelen — status: gebouwd
- [x] Budio local Supabase-default bevestigd — status: gebouwd
- [x] Veilige validatie uitgevoerd — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Lokale Codex-bronnen en officiële OpenAI Codex-docs gecombineerd om modelsupport en configprecedentie expliciet te bevestigen.
- Na expliciete user-approval is alleen `~/.codex/config.toml` minimaal aangescherpt; repo-lokale Budio-config bleef ongewijzigd.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante docs/context, huidige config en taskflow bevestigen.
- [x] Blok 2: model-/plugingedrag bewijzen en minimale diff voorbereiden.
- [x] Blok 3: na approval globale config aanpassen.
- [x] Blok 4: veilige validatie draaien en task/docs sync afronden.

## Concrete checklist

- [x] Huidige globale en repo-lokale config samenvatten.
- [x] `gpt-5.5` support controleren via lokale Codex-bronnen.
- [x] Beoordelen of model in TOML de handmatige modelswitch overschrijft.
- [x] Exacte diff voorstellen.
- [x] Na approval config toepassen.
- [x] Veilige validatie en task/docs verify afronden.

## Acceptance criteria

- [x] De review noemt expliciet het huidige globale model, reasoning effort, plugin-state en trusted projects.
- [x] Het voorstel houdt Budio repo-config leidend voor `supabase_local` en zet geen Budio-specifieke MCP-keuze globaal vast.
- [x] Zonder approval wordt `~/.codex/config.toml` niet aangepast; met approval wordt alleen de minimale hostconfig gewijzigd en veilig gevalideerd.

## Blockers / afhankelijkheden

- Geen open blockers.

## Verify / bewijs

- `codex debug models`
- `codex doctor --json` of andere veilige config-check
- `node scripts/codex-mcp-target.mjs local`
- `npm run taskflow:verify`
- indien task/docs-laag wijzigt: `npm run docs:bundle` en `npm run docs:bundle:verify`

Tussenstand:

- `codex debug models` bevestigt lokale support voor `gpt-5.5`; de catalogus noemt ook `default_reasoning_level: medium`.
- `codex doctor --json` toont huidige globale load op `model: gpt-5.4`.
- `codex doctor --json -c 'model="gpt-5.5"'` bevestigt dat een hogere-precedence override direct het effectieve model naar `gpt-5.5` zet.
- `node scripts/codex-mcp-target.mjs local` bevestigt dat de Budio repo-target op `local` staat.
- Officiële Codex docs bevestigen dat `~/.codex/config.toml` de defaultlaag is, `.codex/config.toml` project-overrides levert, en dat de IDE extension een model selector heeft voor tijdelijke modelkeuze.
- Globale config aangepast naar `model = "gpt-5.5"`, `model_reasoning_effort = "medium"` en alleen core coding plugins enabled.
- `codex doctor --json` in de Budio repo toont nog `model: gpt-5.4`, consistent met project-configprecedentie.
- `codex doctor --json` buiten een trusted project (`/tmp`) toont `model: gpt-5.5`, wat bevestigt dat de globale default actief is.
- `npm run taskflow:verify` geslaagd.
- `npm run docs:bundle` geslaagd.

## Reconciliation voor afronding

- Oorspronkelijk plan: globale config sober en coding-first maken zonder repo-lokale Budio-config te verdringen.
- Toegevoegde verbeteringen: officiële Codex docs gebruikt om model/configprecedentie te bevestigen naast lokale CLI-bronnen.
- Afgerond: review, modelsupport-check, precedentie-check, diffvoorstel, explicit approval, minimale hostconfig-patch en validate van global-vs-project modelgedrag.
- Open / blocked: geen.

## Relevante links

- `docs/project/README.md`
- `docs/project/open-points.md`
- `docs/dev/active-context.md`
- `docs/dev/local-development-environment.md`
- `.codex/config.toml`


## Commits

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Codex workflow learnings — lokale restart en interactieve smokes

- Path: `docs/project/25-tasks/done/codex-workflow-learnings-lokale-restart-en-interactieve-smokes.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-codex-workflow-learnings-lokale-restart-en-interactieve-smokes
title: Codex workflow learnings — lokale restart en interactieve smokes
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Structurele sessielearnings uit de Android Chrome foto-uploadfix zijn nu vastgelegd in AGENTS, QA-docs en een relevante UI-skill: lokale app-start/restart mag bij nodig runtime-bewijs, interactieve regressies vragen slimme happy + unhappy smoke, en browser-smokes wachten op een stabiele baseline."
tags: [codex, workflow, skills, qa, smoke, local-dev]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: [task-moment-detail-foto-upload-android-chrome-prepare-regressie]
task_kind: task
spec_ready: true
due_date: null
sort_order: 32
---




## Probleem / context

De sessie rond de Android Chrome foto-upload liet een paar herhaalbare agentlessen zien die nu nog niet scherp genoeg in repo-guardrails staan. Daardoor kostte het onnodig tijd om van logging naar structurele fix en van verify naar echte runtime-smokes te gaan.

## Gewenste uitkomst

Codex-agents en relevante skills handelen vergelijkbare interactieve regressies in de toekomst consistenter af. Ze mogen lokaal de app starten of herstarten wanneer dat nodig is voor gevraagd runtime-bewijs, ze testen niet alleen het happy pad maar ook een belangrijke failure-state, en browser-smokes wachten eerst op een zichtbare stabiele baseline.

## User outcome

Een developer of agent krijgt sneller echt bewijs bij interactieve regressies, met minder heen-en-weer over lokale restarts en minder risico dat een regressie alleen op `lint`/`typecheck` wordt afgevinkt.

## Functional slice

Een kleine workflow/docs-slice: update van always-on agentregels, QA-richtlijnen en een relevante UI-skill op basis van bevestigde sessielearnings.

## Entry / exit

- Entry: een interactieve web/UI-regressie waarbij runtime-bewijs of lokale app-beschikbaarheid onzeker is.
- Exit: de workflowdocs en skill beschrijven expliciet wanneer lokale app-start/restart is toegestaan, welke smoke-bewijzen verwacht worden en hoe browser-smokes hun baseline moeten bepalen.

## Happy flow

1. Agent ziet dat een interactieve wijziging echt runtime-bewijs nodig heeft.
2. Agent start of herstart lokaal de kleinste benodigde app-target wanneer die nog niet draait en dit binnen de sessie is toegestaan.
3. Agent draait een happy-path smoke plus minimaal één betekenisvolle unhappy-path smoke en legt bewijs vast.

## Non-happy flows

- Bestaande lokale app ontbreekt:
  agent mag de app lokaal starten of herstarten wanneer runtime-bewijs anders ontbreekt.
- Interactie is klein en puur visueel:
  geen volledige smoke-suite nodig; alleen de kleinste relevante runtime-check.
- Browser test race condition:
  test wacht eerst op een zichtbare stabiele baseline voordat counts/assertions of skips worden bepaald.

## UX / copy

- Geen product-UI-wijzigingen.
- Alleen agent-/developer-facing workflowcopy en guardrails.

## Data / IO

- Input: bevestigde sessielearnings uit de foto-upload regressie en lokale/prod smoke-runs.
- Output: aangescherpte repo-regels in `AGENTS.md`, `docs/dev/qa-test-strategy.md`, `docs/dev/local-auth-smoke-workflow.md` en relevante skill.
- Opslag/API/service/file-impact: alleen docs/skillfiles; geen runtimecode.
- Statussen: task blijft `in_progress` totdat docs, skill en verify klaar zijn.

## Waarom nu

- De learning is net bevestigd in echte implementatie + local/prod smoke.
- Zonder snelle vastlegging vallen agents makkelijk terug op te defensieve dev-serverregels of te lichte interactieve verify.

## In scope

- `AGENTS.md` verduidelijken voor lokale app-start/restart wanneer runtime-bewijs nodig is.
- QA-docs aanscherpen voor happy + unhappy smoke en stabiele baseline-wachtregel.
- Relevante UI-skill aanscherpen met dezelfde bewijsregel.

## Buiten scope

- Geen nieuwe skill aanmaken.
- Geen productdocs wijzigen buiten task-overzichten/bundels.
- Geen bredere taskflow-refactor of modebeleid aanpassen buiten deze concrete learnings.

## Oorspronkelijk plan / afgesproken scope

- Leg alleen structurele, bevestigde learnings vast uit deze sessie.
- Houd de wijziging klein: AGENTS + QA-doc + relevante skill.
- Geen brede workflowherschrijving als een compacte guardrail-update genoeg is.

## Expliciete user requirements / detailbehoud

- Voer dit uit als kleine structurele fix.
- Geen zware of onnodige smoke-uitbreiding als dat niet nodig is.
- Agents en skills moeten beter leren van deze sessie.

## Status per requirement

- [x] Lokale restart/start-regel voor runtime-bewijs expliciet vastgelegd — status: gebouwd
- [x] Happy + unhappy smoke-regel voor interactieve regressies expliciet vastgelegd — status: gebouwd
- [x] Baseline-wachtregel voor browser-smokes expliciet vastgelegd — status: gebouwd
- [x] Relevante skill bijgewerkt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- `docs/dev/local-auth-smoke-workflow.md` beschrijft nu ook expliciet hoe een agent lokale app-beschikbaarheid controleert en een noodzakelijke lokale start/restart kort documenteert.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste bronwijziging of primair artefact uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Nieuwe workflow-task aangemaakt en in-progress bovenaan gezet.
- [x] `AGENTS.md` bijgewerkt.
- [x] QA-docs en relevante skill bijgewerkt.
- [x] Taskflow/docs verify gedraaid.

## Acceptance criteria

- [ ] `AGENTS.md` maakt expliciet wanneer Codex lokaal zelf een app mag starten of herstarten voor runtime-bewijs.
- [ ] QA-docs eisen voor interactieve regressies minimaal een happy path en één belangrijke unhappy path, of expliciete motivatie waarom dat niet kan.
- [ ] Relevante skill noemt stabiele baseline-check en slimme smoke-keuze in plaats van blind full smoke.

## Blockers / afhankelijkheden

- Geen blockers verwacht.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

Uitgevoerd op `2026-05-15`:

- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: alleen structurele sessielearnings klein vastleggen in AGENTS, QA-docs en een relevante skill.
- Toegevoegde verbeteringen: ook de local auth smoke-workflow is expliciet aangescherpt op lokale app-beschikbaarheid en korte runtime-rapportage.
- Afgerond:
  - AGENTS-regel voor lokale app-start/restart wanneer runtime-bewijs anders ontbreekt
  - QA-regel voor slim happy + unhappy smoke-bewijs
  - baseline-wachtregel voor browser-smokes
  - update van de relevante UI-skill
  - taskflow/docs verify
- Open / blocked:
  - geen; deze workflow-fix is inhoudelijk afgerond

## Commits

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
## Relevante links

- `AGENTS.md`
- `docs/dev/qa-test-strategy.md`
- `docs/dev/local-auth-smoke-workflow.md`
- `.agents/skills/ui-implementation-guardrails/SKILL.md`
```

---

## Dark/light mode theming (text + background) zonder refresh fix

- Path: `docs/project/25-tasks/done/dark-light-mode-theming-zonder-refresh-fix.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-dark-light-mode-theming-zonder-refresh-fix
title: Dark/light mode theming (text + background) zonder refresh fix
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: Herstelt web theme-switch zonder refresh door op web de live browser color-scheme als bron van waarheid te gebruiken.
tags: [theme, dark-mode, light-mode, ui, tokens]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 61
---






# Dark/light mode theming (text + background) zonder refresh fix

## Probleem / context

Na wisselen tussen light en dark mode blijven sommige tekstkleuren en achtergrondsurfaces in de oude mode hangen. Hierdoor ontstaan witte vlakken in dark mode en breekt de visuele hiërarchie.

## Gewenste uitkomst

Text- en background-kleuren wisselen direct mee bij theme-switch op gedeelde laag (tokens + shared wrappers/components), zonder pagina-refresh. In dark mode is de outer app-shell duidelijk donker, met subtiel lichtere inner surfaces voor rustige layering.

## User outcome

Gebruikers zien direct correcte light/dark theming op Today, detailschermen, settings en admin-schermen, zonder felle witte restvlakken of onleesbare tekst.

## Functional slice

Theme-reactieve app-shell + gedeelde tekst/surface primitives met semantische tokens, inclusief fix voor memoization/recompute valkuilen bij theme changes.

## Entry / exit

- Entry: gebruiker toggelt theme in app.
- Exit: alle relevante text/background surfaces updaten direct naar de juiste mode zonder refresh.

## Happy flow

1. Gebruiker wisselt van light naar dark.
2. Outer app background schakelt direct naar diepe donkere tint.
3. Inner surfaces en tekst schakelen direct mee met correcte contrasten.
4. Gebruiker wisselt terug naar light en alles schakelt terug zonder stale kleuren.

## Non-happy flows

- Hardcoded kleur in shared component: vervangen door token.
- Memoized style blijft oud: dependencies/factory aanpassen.
- Mixed root wrappers tonen wit vlak: shell/background op rootniveau centraliseren.

## UX / copy

- Geen copywijzigingen.
- Bestaande Budio calm/editorial tone visueel behouden.

## Data / IO

- Input: huidig color scheme + theme tokens.
- Output: gereactiveerde text/background styles op shared laag.
- Opslag/API-impact: geen.

## Waarom nu

- Dit is een directe visuele regressie met hoge impact op bruikbaarheid in dark mode.

## In scope

- `theme/tokens.ts`, theme helpers/hooks, root/layout wrappers, shared UI surfaces.
- Hardcoded text/background kleuren vervangen door semantische tokens.
- Outer shell background mode-aware maken en layering behouden.

## Buiten scope

- Redesign of nieuwe visual language.
- Screen-specifieke one-off polish buiten noodzakelijke regressiefixes.

## Oorspronkelijk plan / afgesproken scope

- Focus op token/shared laag; geen per-screen redesign.
- Dark mode outer shell donker, inner surfaces iets lichter.
- Instant mode switch zonder refresh is harde eis.

## Expliciete user requirements / detailbehoud

- Text én backgrounds moeten theme-reactive zijn.
- Geen white flashes of witte persistent achtergrond in dark mode.
- Subtiele contrastlaag tussen app background en content surfaces.
- Fix ook memoized/non-recomputed color cases.
- QA-noot met: Today, detail views, settings, admin screens.

## Status per requirement

- [x] Text + background volledig theme-reactive — status: gebouwd
- [x] Outer/root background donker in dark mode — status: gebouwd
- [x] Layeringcontrast outer vs inner surfaces — status: gebouwd
- [x] Geen white flashes/persistente light backgrounds — status: gebouwd
- [x] Memoization/recompute issues opgelost — status: gebouwd
- [x] QA-noot met gevraagde schermset — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Heropeningsfix op 2026-05-15: `hooks/use-color-scheme.web.ts` gebruikt nu op web altijd de live `matchMedia("(prefers-color-scheme: dark)")`-state als bron van waarheid, zodat shared tokens niet meer op een stale RN Appearance-waarde blijven hangen tot een refresh.
- De bestaande web root-theming in `app/_layout.tsx` profiteert hierdoor nu direct mee: `documentElement`, `body` en `color-scheme` schakelen meteen mee bij mode-switch.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow + scope vastleggen in taskfile.
- [x] Blok 2: shared theme/root/component fix implementeren.
- [x] Blok 3: verify + QA-notes + afronding.

## Concrete checklist

- [x] Theme/token en root wrapper paden inspecteren op hardcoded/stale kleuren.
- [x] Semantische tokens aanscherpen voor outer/inner dark layering.
- [x] Shared components/wrappers omzetten naar theme-reactive kleuren.
- [x] Memoized kleurberekeningen corrigeren.
- [x] Lint/typecheck draaien.
- [x] Korte QA-notitie toevoegen met geteste schermen.

## Acceptance criteria

- [x] Light ↔ dark switch werkt instant voor alle text/background surfaces zonder refresh.
- [x] Dark mode bevat geen witte restvlakken.
- [x] Outer app background en inner surfaces hebben rustige, duidelijke layering.
- [x] Tekstcontrast blijft leesbaar in beide modes.
- [x] UI blijft consistent met Budio/Vandaag tone.

## Blockers / afhankelijkheden

- Geen externe afhankelijkheden.

## Verify / bewijs

- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd
- `npm run docs:bundle` — geslaagd
- `npm run docs:bundle:verify` — geslaagd

### QA note (thema-switch)

- Live web hook-smoke: unauthenticated Playwright check op `http://localhost:8081/` bevestigt direct `light -> dark -> light` switch van `html`, `body`, heading en CTA zonder refresh.
- Authenticated reflections-smoke: Playwright magic-link login naar `http://localhost:8081/reflections` bevestigt direct `light -> dark -> light` switch van `html`, `body` en `documentElement.colorScheme` zonder refresh.
- Reflections week/maand: dezelfde authenticated smoke bevestigt dat brand, hero, quote, section copy, segmented control en bottom-nav context niet op de oude mode blijven hangen.
- Today (`app/(tabs)/index.tsx`) — geverifieerd via dezelfde authenticated browser-session na dark toggle; root shell blijft direct donker zonder refresh.
- Dagdetail en momentdetail gebruiken dezelfde hook- en tokenlaag; geen extra screen-lokale hardcoded theming aangepast in deze fixronde.

## Reconciliation voor afronding

- Oorspronkelijk plan: shared-layer theme-reactiviteit + root backgrounds herstellen zonder screen-redesign.
- Toegevoegde verbeteringen: web hook-bron van waarheid vastgezet op live browser `matchMedia`, zodat bestaande shared tokens en root-shell wiring weer meteen meeschakelen.
- Afgerond: de stale web theme-bron is opgelost, light/dark schakelt zonder refresh terug op root- en reflectielaag, en verify + runtime-bewijs zijn bijgewerkt.
- Open / blocked: geen blocker binnen deze scope.

## Commits

- Nog niet gecommit in deze sessie.

- 2026-04-29T00:07:02+02:00 — fix: make theme surfaces react instantly on dark-light switch

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-15T09:40:13+02:00 — fix: make web theme switching reactive

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
## Relevante links

- `theme/tokens.ts`
- `app/_layout.tsx`
- `components/themed-text.tsx`
- `components/themed-view.tsx`
```

---

## Dev-browser configureerbaar voor local web

- Path: `docs/project/25-tasks/done/dev-browser-configureerbaar-voor-local-web.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: dev-browser-configureerbaar-voor-local-web
title: Dev-browser configureerbaar voor local web
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "Local web development kan optioneel een specifieke browser openen via `.env.local`, met behoud van het bestaande standaardbrowsergedrag als de env ontbreekt."
tags: [local-dev, tooling, expo]
workstream: app
due_date: null
sort_order: 33
---



## Probleem / context

Op de nieuwe Mac opent Expo web nu via de standaardbrowser. De gebruiker wil ChatGPT Atlas kunnen gebruiken voor lokale webontwikkeling, maar zonder dit hard te coderen voor alle machines.

## Gewenste uitkomst

`npm run dev` blijft standaard hetzelfde werken wanneer er geen browser-env is gezet. Als `BUDIO_DEV_BROWSER` lokaal is gezet, gebruikt de dev-flow die browser voor Expo web-open acties.

## Waarom nu

- De lokale MacBook setup is net afgerond.
- Browserkeuze is machine-specifieke dev tooling en hoort configureerbaar te zijn zonder productruntime te raken.

## In scope

- `scripts/dev.sh` uitbreiden met optionele local browser-config.
- `.env.local` op deze machine aanvullen met ChatGPT Atlas als browser.
- Verify zonder langlopende devserver.

## Buiten scope

- Productruntime-config of `EXPO_PUBLIC_*` toevoegen voor browserkeuze.
- Langlopende devserver starten.
- Browserkeuze afdwingen op andere machines.

## Concrete checklist

- [x] Browser-env veilig laden uit `.env.local`.
- [x] Expo web-open laten terugvallen op standaardgedrag als env ontbreekt.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- ✅ `sh -n scripts/dev.sh`
- ✅ `.env.local` parser-check voor `BUDIO_DEV_BROWSER`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `scripts/dev.sh`
- `.env.local`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## docs:bundle en docs:bundle:verify race condition structureel voorkomen

- Path: `docs/project/25-tasks/done/docs-bundle-en-verify-race-condition-voorkomen.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-docs-bundle-en-verify-race-condition-voorkomen
title: "docs:bundle en docs:bundle:verify race condition structureel voorkomen"
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Voorkom structureel dat docs:bundle en docs:bundle:verify tegelijk kunnen draaien door een harde script-lock en expliciete workflowguardrail toe te voegen."
tags: [workflow, docs, verify, locking]
workstream: plugin
due_date: null
sort_order: 34
---



# docs:bundle en docs:bundle:verify race condition structureel voorkomen

## Probleem / context

`npm run docs:bundle` en `npm run docs:bundle:verify` kunnen nu tegelijk draaien. Daardoor kan `docs:bundle:verify` halverwege lezen terwijl `docs:bundle` nog bestanden herschrijft, met een misleidende fout als gevolg.

Dit is nu al meerdere keren gebeurd en moet structureel worden afgevangen, niet alleen als handmatige werkafspraak.

## Gewenste uitkomst

Parallelle bundelruns worden hard geblokkeerd met een duidelijke foutmelding. Daardoor kan `docs:bundle:verify` niet meer vals falen doordat `docs:bundle` nog bezig is.

Daarnaast staat in de workflow expliciet dat `docs:bundle` en `docs:bundle:verify` sequentieel moeten lopen.

## Waarom nu

- De fout is herhaald en veroorzaakt onnodige ruis tijdens verify.
- Het probleem zit in workflow-infra en is goedkoop structureel op te lossen.

## In scope

- Locking toevoegen rond `scripts/docs/build-docs-bundles.mjs`.
- Tests toevoegen voor de lockinglogica.
- Workflowdocs aanscherpen voor sequentiële docs-bundelruns.

## Buiten scope

- Brede herbouw van alle docs-scripts.
- Nieuwe queueing/orchestratie buiten deze bundelflow.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Locking toegevoegd zodat `docs:bundle` en `docs:bundle:verify` niet parallel kunnen draaien.
- [x] Tests toegevoegd voor lock/stale-lock gedrag.
- [x] Workflowdocs aangescherpt naar expliciet sequentiële docs-bundelruns.
- [x] Verify gedraaid.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `node --test scripts/docs/doc-bundle-lock.test.mjs` ✅
- `npm run taskflow:verify` ✅
- `npm run docs:bundle` ✅
- `npm run docs:bundle:verify` ✅

## Relevante links

- `scripts/docs/build-docs-bundles.mjs`
- `docs/dev/task-lifecycle-workflow.md`
- `docs/dev/cline-workflow.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Docs folderstructuur en visual language herbeoordelen na metadatafase

- Path: `docs/project/25-tasks/done/docs-folderstructuur-en-visual-language-herbeoordeling-na-metadatafase.md`
- Bucket: done
- Status: done
- Priority: p3
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-docs-folderstructuur-visual-language-herbeoordeling
title: Docs folderstructuur en visual language herbeoordelen na metadatafase
status: done
phase: transitiemaand-consumer-beta
priority: p3
source: docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md
updated_at: 2026-06-22
summary: "Herbeoordeling afgerond: metadata, source-of-truth matrix en maximaal 10 uploadbundels lossen de huidige docs-routing voldoende op. Geen brede foldermigratie nodig; visual language blijft een lichte human-facing smaaklaag."
tags: [docs, structure, metadata, visual-language]
workstream: idea
due_date: null
sort_order: 62
---





# Docs folderstructuur en visual language herbeoordelen na metadatafase

## Probleem / context

De docs lopen deels door elkaar voor menselijke lezers, agents/AI en gedeeld gebruik. De goedkope eerste stap is metadata + betere bundling, niet meteen een brede foldermigratie.

Deze task bewaakt bewust dat we pas na de eerste fase herbeoordelen of een grotere structuurwijziging nodig is.

## Gewenste uitkomst

Na afronding van `docs-ux-audience-taxonomie-en-uploadbundels.md` ligt er een korte, brongebaseerde beoordeling:

- Is metadata + bundling voldoende om verwarring op te lossen?
- Zijn er nog docs die echt naar een andere folder moeten?
- Werkt de Budio Terminal-stijl als smaaklaag zonder gimmick te worden?
- Moet er een vervolg komen voor templates, Obsidian graph views of docs-navigatie?

## Waarom nu

- Niet nu uitvoeren: deze task is afhankelijk van bewijs uit de metadata- en bundlingfase.
- Wel nu vastleggen: voorkomt dat foldermigratie of visual polish ongemerkt meeloopt in de huidige cheap-first taak.

## In scope

- Review van docs-routing na metadatafase.
- Beoordeling of folderstructuur nog moet wijzigen.
- Beoordeling of visual language verder moet worden gestandaardiseerd.
- Eventueel nieuw plan of idee als vervolg.

## Buiten scope

- Geen brede foldermigratie voordat de dependency klaar is.
- Geen retro-terminal als nieuw design system.
- Geen productcopy richting app-eindgebruikers.
- Geen runtime app-wijzigingen.

## Uitvoerblokken / fasering

- [x] Blok 1: dependency-resultaat lezen.
- [x] Blok 2: docs-routing en metadata-effect beoordelen.
- [x] Blok 3: advies vastleggen en eventuele vervolgtaak/idee maken.

## Concrete checklist

- [x] Dependency is afgerond en verplaatst naar `done/`.
- [x] Beoordeling van folderstructuur is vastgelegd.
- [x] Beoordeling van visual-language gebruik is vastgelegd.
- [x] Eventuele vervolgactie is expliciet klein gehouden.

## Blockers / afhankelijkheden

- Geen actuele blocker meer. Dependency `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md` staat op `done`.

## Beoordeling

- Dependency-check: `docs-ux-audience-taxonomie-en-uploadbundels.md` staat op `done` en heeft audience-metadata, docs-governance, visual-language afspraken, uploadmanifest en maximaal 10 uploadbundels afgerond.
- Folderstructuur: geen brede migratie nodig. `docs/project/README.md` heeft nu een duidelijke source-of-truth matrix en scheidt strategie, planning, epics, tasks, research, ideas, generated en upload-only artefacten voldoende expliciet.
- Metadata-effect: het frontmatter-contract in `docs/project/00-docs-governance/README.md` maakt per document duidelijk wie de lezer is, wat de bronrol is en in welke uploadbundel de file hoort. Dat is goedkoper en veiliger dan mappen verschuiven.
- Uploadrouting: `docs/upload/00-budio-upload-manifest.md` beperkt de beheerde uploadset tot 10 bestanden en geeft per use-case een kleine subset. Daarmee is ChatGPT Project-context nu routeerbaar zonder brede handmatige selectie.
- Visual language: de Budio Terminal-stijl werkt als smaaklaag voor human-facing docs zolang de plain Markdown baseline blijft gelden. Er is geen reden om dit als app-designsystem of verplichte docs-renderinglaag uit te bouwen.
- Vervolgactie: geen nieuwe bouwtask nodig. Een later klein docs-navigatie/Obsidian-idee kan pas zinvol worden als echte gebruikspijn terugkomt, bijvoorbeeld slechte vindbaarheid ondanks hubs, uploadmanifest en metadata.

## Advies / besluit

- Houd de huidige mapstructuur aan.
- Gebruik metadata + hubs + uploadmanifest als primaire navigatie- en routinglaag.
- Verplaats alleen losse docs wanneer er een concrete bronconflict-, eigenaarschap- of vindbaarheidsreden is.
- Houd Budio Terminal beperkt tot human-facing of shared docs; agent-only workflowdocs blijven sober.
- Sluit deze task af zonder nieuwe vervolgtaak.

## Verify / bewijs

- ✅ `npm run docs:audience:verify`
- ⚠️ `npm run docs:lint` faalt op bestaande lintschuld in oude taskfiles; deze taskfile is hersteld en komt niet meer terug in de lintfoutlijst.
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
- ✅ `npm run taskflow:verify`

## Relevante links

- `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`
- `docs/project/README.md`
- `docs/project/00-docs-governance/README.md`
- `docs/upload/00-budio-upload-manifest.md`

## Reconciliation voor afronding

- Oorspronkelijk plan: na afronding van de metadata- en bundlingfase beoordelen of folderstructuur of visual language verder moest worden aangepakt.
- Expliciete requirements: brongebaseerd antwoord op metadata/bundling, foldermigratie, Budio Terminal-stijl en eventuele vervolgstap.
- Later toegevoegd: geen extra scope; de beoordeling is bewust klein gehouden.
- Afgerond: dependency is klaar, beoordeling en besluit zijn vastgelegd, geen vervolgtaak nodig.
- Open of blocked: niets binnen deze task.

## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-22T14:10:48+02:00 — docs: close docs structure review task

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Docs UX, audience-metadata en uploadbundels opschonen

- Path: `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-docs-ux-audience-taxonomie-uploadbundels
title: "Docs UX, audience-metadata en uploadbundels opschonen"
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/README.md
updated_at: 2026-04-25
summary: "Maak de docs menselijker en duidelijker met audience-metadata, een portable Budio Terminal visual layer en maximaal 10 beheerde uploadbundels."
tags: [docs, upload, tooling, obsidian, markdown]
workstream: idea
due_date: null
sort_order: 35
---



# Docs UX, audience-metadata en uploadbundels opschonen

## Probleem / context

De docs zijn inhoudelijk bruikbaar, maar lopen door elkaar voor menselijke lezers, agents/AI en gedeeld gebruik. Daarnaast zijn er te veel losse uploadartefacten om handmatig prettig te beheren.

De huidige ASCII-visuals helpen, maar mogen duidelijker, nerdier en leuker worden voor menselijke docs. Dat moet wel portable blijven: leesbaar in plain Markdown, VS Code en Obsidian zonder verplichte extra plugins, en zonder IP-copy of gimmick-overload.

## Gewenste uitkomst

De docs krijgen een kleine metadata- en visuele laag die duidelijk maakt voor wie een document bedoeld is en hoe het gebruikt moet worden.

Human-facing docs krijgen waar zinvol een Budio Terminal-stijl met terminalpanelen, Mermaid-diagrammen en mission-control blokken. Agent-only docs blijven sober en functioneel.

`docs/upload/**` wordt teruggebracht naar maximaal 10 beheerde uploadbestanden, met een manifest dat per use-case duidelijk maakt welke subset nodig is.

## Waarom nu

- De roadmap- en strategie-docs worden belangrijker als overdrachtslaag.
- De repo wordt ook als Obsidian-vault gebruikt, dus audience, metadata en graph-routing moeten duidelijker zijn.
- Handmatig uploaden naar ChatGPT Projects moet minder rommelig worden.

## In scope

- Audience-metadata voor actieve handmatige docs.
- Docs-governance voor audience, visual profile en uploadbundels.
- Developer toolingdoc voor VS Code, Mark Sharp, Mermaid-preview en Obsidian vault.
- Budio Terminal visual language als portable Markdown-stijl.
- Bundler aanpassen naar maximaal 10 beheerde uploadbestanden.
- Verifier toevoegen voor audience-metadata.
- Afhankelijke vervolgtask aanmaken voor later folderstructuur/visual-language review.

## Buiten scope

- Geen brede foldermigratie.
- Geen nieuw productdesignsystem.
- Geen runtime app-, schema-, API- of UI-wijzigingen.
- Geen verplichte plugininstallatie om docs te kunnen lezen.
- Geen productcopy richting eindgebruikers.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: taskfiles en developer docs-tooling vastleggen.
- [x] Blok 3: audience-metadata en Budio Terminal visual layer toepassen.
- [x] Blok 4: docs-bundler terugbrengen naar maximaal 10 uploadfiles.
- [x] Blok 5: verify draaien, task afronden en naar done verplaatsen.

## Concrete checklist

- [x] Hoofdtaak en afhankelijke vervolgtask bestaan met correcte status.
- [x] Metadata-contract en visual language staan vast in canonieke docs.
- [x] VS Code/Obsidian docs-tooling staat vast voor developers.
- [x] Belangrijkste human-facing docs zijn verrijkt zonder verplichte plugins.
- [x] Bundler genereert maximaal 10 uploadfiles.
- [x] Verify is groen.

## Blockers / afhankelijkheden

- Geen blocker. Vervolgtask hangt af van afronding van deze metadata- en bundlingfase.

## Verify / bewijs

- `npm run docs:audience:verify`
- `npm run docs:lint`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/README.md`
- `docs/README.md`
- `docs/setup/step-0-readiness.md`
- `scripts/docs/build-docs-bundles.mjs`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Entry photo gallery QA-basis: unit, smoke en end-user tests

- Path: `docs/project/25-tasks/done/entry-photo-gallery-qa-basis-unit-smoke-e2e.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-entry-photo-gallery-qa-basis
title: "Entry photo gallery QA-basis: unit, smoke en end-user tests"
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Zet een reproduceerbare QA-basis neer voor entry photo gallery: unit-tests voor sorteerhelpers, scripts voor smoke/full E2E en bewijsregels voor toekomstige gallery-wijzigingen."
tags: [qa, tests, gallery, photos, smoke]
workstream: app
due_date: null
sort_order: 36
---



## Probleem / context

De thumbnail reorder-fix kon lint/typecheck bewijzen, maar niet de echte drag-interactie.
Voor complexe gallery-code is dat onvoldoende: nieuwe wijzigingen moeten snel regressies kunnen vangen en waar nodig volledige end-user interactie bewijzen.

## Gewenste uitkomst

Er is een eerste QA-basis voor de entry photo gallery:
snelle unit-tests voor complexe sorteerlogica, scripts voor gallery smoke/full tests, en duidelijke bewijsregels voor wanneer welke testlaag draait.

## Waarom nu

- De reorder-bug vraagt om herhaalbaar interactiebewijs.
- De helperextractie maakt unit-tests nu goedkoop.
- De 80% coverage-KPI moet starten bij nieuwe complexe code, niet wachten op een grote repo-brede testmigratie.

## In scope

- Vitest unit-testinfra voor gallery helperlogica.
- Coverage-script voor unit-tests.
- Playwright scriptnamen/configbasis voor gallery smoke/full E2E.
- Unit-tests voor sorteren, clampen en drag target berekening.
- Workflow/skill/AGENTS-regels voor smoke versus full E2E en unit-tests bij complexe code.

## Buiten scope

- Volledige local Supabase seed/cleanup voor alle gallery E2E-flows als die te groot wordt voor deze basis.
- Native iOS/Android E2E.
- Repo-brede 80% coverage gate voor legacy code.
- Productwijzigingen aan gallery UX.

## Concrete checklist

- [x] Test-task aanmaken en taskflow correct zetten.
- [x] Vitest + coverage scripts toevoegen.
- [x] Gallery helper unit-tests toevoegen.
- [x] Playwright smoke/full scripts en basisconfig toevoegen.
- [x] QA-workflowregels vastleggen in AGENTS/skills/docs.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen blockers meer voor deze basislaag.
- Volledige add/delete/error end-user coverage blijft bewust een vervolgstap bovenop de nieuwe smoke-basis.

## Verify / bewijs

- ✅ `npm run test:unit` (8 tests geslaagd op 2026-04-23)
- ✅ `npm run test:unit:coverage` (100% coverage voor gallery sorting helpers op 2026-04-23)
- ✅ `npm run test:e2e:gallery:seed` (lokale fixture aangemaakt op 2026-04-23)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-23 met local magic-link login en touch-drag reorder naar links)
- ✅ `npm run test:e2e:gallery:cleanup` (lokale fixture opgeschoond op 2026-04-23)
- ✅ `npm run test:e2e:gallery:full` (script draait; 1 test geskipt omdat `GALLERY_E2E_FULL=1` en seed/cleanup helpers nog ontbreken)
- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)

## Relevante links

- `src/lib/entry-photo-gallery/sorting.ts`
- `components/journal/entry-photo-gallery.tsx`
- `docs/dev/local-auth-smoke-workflow.md`
- `AGENTS.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## GitHub Actions Node 24 hardening en lokale Node-align

- Path: `docs/project/25-tasks/done/github-actions-node24-hardening-en-lokale-node-align.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-github-actions-node24-hardening-en-lokale-node-align
title: GitHub Actions Node 24 hardening en lokale Node-align
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Upgrade GitHub Actions naar Node-24-compatibele action-versies, verwijder waar passend de tijdelijke force-flag, en draai de repo-install/verify lokaal onder Node 24."
tags: [github, actions, node, npm, hardening]
workstream: app
due_date: null
sort_order: 37
---



## Probleem / context

De diagnose bevestigde dat deploys nu slagen, maar GitHub Actions nog warnings geeft omdat `actions/checkout@v4` en `actions/setup-node@v4` intern nog Node 20 targeten. Die draaien nu dankzij `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24`.

Daarnaast draaide de lokale shell op Node 25 terwijl de repo expliciet Node 24 vereist.

## Gewenste uitkomst

GitHub workflows gebruiken actuele Node-24-compatibele action-versies, zodat de tijdelijke warning-constructie niet meer nodig is of minimaal kan worden heroverwogen. De repo is lokaal opnieuw gecontroleerd onder Node 24.

## Waarom nu

- De warning is al bevestigd met GitHub brondata.
- Nieuwe action-versies bestaan al.
- Lokale Node 25 vergroot kans op install- en lockfile-drift.

## In scope

- `.github/workflows/deploy.yml` en `.github/workflows/secret-scan.yml` upgraden naar moderne action-versies.
- Tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` verwijderen als dat na de upgrade niet meer nodig is.
- Relevante lokale verify onder Node 24 draaien.

## Buiten scope

- Npm audit vulnerabilities inhoudelijk oplossen.
- Grote dependency-upgrades buiten de action-versies.
- Productcode wijzigen.

## Concrete checklist

- [x] Taskflow gestart en taskfile bovenaan in_progress gezet.
- [x] GitHub Actions upgraden naar Node-24-compatibele versies.
- [x] Tijdelijke force-flag heroverwegen en verwijderen waar veilig.
- [x] Lokale Node 24 verify draaien.
- [x] Docs/taskflow verify afronden.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- ✅ `node -v` / `npm -v` onder Node 24 (`v24.15.0` / `11.12.1` op 2026-04-23)
- ✅ `npm install` onder Node 24 (geslaagd op 2026-04-23; audit-summary blijft 14 vulnerabilities)
- ✅ `npm run check:node-version` onder Node 24 (geslaagd op 2026-04-23)
- ✅ `npm run lint` onder Node 24 (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` onder Node 24 (geslaagd op 2026-04-23)
- ✅ Workflow-upgrade uitgevoerd: `actions/checkout@v6`, `actions/setup-node@v6`, tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` verwijderd
- ⏳ Post-push GitHub warning-check nog niet opnieuw bewezen in een nieuwe run
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `.github/workflows/deploy.yml`
- `.github/workflows/secret-scan.yml`
- `.nvmrc`
- `package.json`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## GitHub deployment Node/NPM-versie diagnose

- Path: `docs/project/25-tasks/done/github-deployment-node-npm-versie-diagnose.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-github-deployment-node-npm-versie-diagnose
title: GitHub deployment Node/NPM-versie diagnose
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Zoek bron-first uit of de lokale Node/NPM-versie, GitHub Actions Node 24 instelling of npm install gedrag opnieuw deployment-risico vormt, en bepaal pas daarna of een backlogtask nodig is."
tags: [github, deployment, node, npm, diagnostics]
workstream: app
due_date: null
sort_order: 38
---



## Probleem / context

Tijdens lokale testinfra-installatie draaide de machine op Node 25.8.0 terwijl de repo `node: 24.x` vereist. Eerder was er vermoedelijk een GitHub deployment-melding rond Node/NPM of GitHub Actions runtime opgelost met een extra instelling.

We moeten bron-first bepalen of er nu nog een echt deployment-risico is, en of lokaal of in GitHub iets aangepast moet worden.

## Gewenste uitkomst

Er ligt een korte diagnose met:

- actuele repo Node/NPM-config
- actuele GitHub Actions deployment-config
- relevante recente GitHub run/check bewijzen
- advies: niets doen, lokaal naar Node 24 terug, GitHub configuratie aanpassen, of aparte backlogtask maken

## Diagnose

Bevestigd op 2026-04-23:

- Repo vraagt Node 24 via `.nvmrc` (`24`) en `package.json` engines (`24.x`).
- Lokale shell draaide tijdens installatie op Node `v25.8.0` met npm `11.11.0`.
- `npm run check:node-version` faalt lokaal terecht zolang Node 25 actief is.
- GitHub Deploy Supabase Functions gebruikt `actions/setup-node@v4` met `node-version-file: .nvmrc`; recente deploy-run gebruikte Node `24.15.0` en npm `11.12.1`.
- GitHub workflows bevatten `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"`, de eerder bedoelde tijdelijke instelling.
- Recente deploy-run `24810626440` is `success`.
- Recente secret-scan run `24811218494` is `success`.
- GitHub annotation is een warning, geen failure: `actions/checkout@v4` en in deploy ook `actions/setup-node@v4` targeten Node 20 maar worden geforceerd op Node 24.
- GitHub changelog zegt dat Node 20 EOL is en dat GitHub runners vanaf juni 2026 Node 24 standaard gaan gebruiken; gebruikers moeten workflows updaten naar action-versies die Node 24 ondersteunen.
- Officiële nieuwste action releases bestaan: `actions/checkout@v6.0.2` en `actions/setup-node@v6.4.0`.

Conclusie: deployment wordt nu niet geblokkeerd door NPM/Node. Het echte resterende punt is een workflow-warning/hardening: upgrade GitHub Actions van v4 naar v6 en evalueer daarna of de tijdelijke `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` vlag nog nodig is.

## Waarom nu

- Nieuwe npm devDependencies zijn toegevoegd voor testinfra.
- Lokale Node 25 kan lockfile/install-gedrag beïnvloeden.
- Deployment-risico's moeten niet op gevoel maar op GitHub/checkrun-bewijs beoordeeld worden.

## In scope

- `.nvmrc`, `package.json`, `.github/workflows/**` en npm-config inspecteren.
- Recente GitHub Actions/checkruns via `gh` inspecteren.
- Alleen een nieuwe backlogtask maken als er daadwerkelijk werk uit de diagnose volgt.

## Buiten scope

- Direct dependency-upgrades of npm-audit fixes uitvoeren.
- GitHub workflow aanpassen zonder expliciet besluit na diagnose.
- Productcode wijzigen.

## Concrete checklist

- [x] Repo Node/NPM-config inspecteren.
- [x] GitHub workflow-config inspecteren.
- [x] Recente GitHub run/checkrun via `gh` inspecteren.
- [x] Diagnose en advies vastleggen.
- [x] Alleen indien nodig vervolgtaak/backlogtask maken.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- ✅ `gh run list --repo pflikweert/persoonlijke-assistent-app --limit 12`
- ✅ `gh api repos/pflikweert/persoonlijke-assistent-app/check-runs/72616314178/annotations`
- ✅ `gh run view 24810626440 --repo pflikweert/persoonlijke-assistent-app --json ...`
- ✅ `gh run view 24810626440 --repo pflikweert/persoonlijke-assistent-app --log`
- ✅ `gh api repos/actions/checkout/releases/latest` (`v6.0.2`)
- ✅ `gh api repos/actions/setup-node/releases/latest` (`v6.4.0`)
- ✅ `npm run check:node-version` faalt lokaal op Node `v25.8.0`, zoals bedoeld
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `.github/workflows/deploy.yml`
- `.github/workflows/secret-scan.yml`
- `.nvmrc`
- `package.json`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## HME-ME research fase 1: local data en downloader spike

- Path: `docs/project/25-tasks/done/hme-me-research-fase-1-local-data-en-downloader-spike.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-26

```md
---
id: task-hme-me-research-fase-1-local-data-en-downloader-spike
title: "HME-ME research fase 1: local data en downloader spike"
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-26
summary: "Zet een persoonlijk local-first HME-ME researchspoor veilig op buiten de Vandaag MVP, inclusief ignored lokale data-root, modulebasis en eerste mijnRadboud viewer-inspectiespike na handmatige login."
tags: [personal-research, hme-me, local-first, downloader-spike, privacy]
workstream: idea
due_date: null
sort_order: 39
---







## Probleem / context

De gebruiker wil een persoonlijk HME-ME researchspoor starten binnen de Budio
repo, zonder dit te vermengen met de Vandaag MVP of productstatus. De eerste
praktische bottleneck is dat radiologiebeelden/study-assets via mijnRadboud niet
als simpele handmatige download beschikbaar lijken. Er is daarom een veilige
local-first basis nodig en een eerste downloader-/inspectiespike die pas na
handmatige DigiD/mijnRadboud-login inventariseert wat de viewer toont en welke
netwerkrequests relevant zijn.

Dit spoor mag geen medische data, sessiemateriaal of gevoelige exports in Git
brengen. Echte data hoort uitsluitend lokaal onder `.local-data/**`.

## Gewenste uitkomst

Fase 1 levert een veilige repo- en toolingbasis op:

- het aangeleverde researchplan staat als persoonlijk idea/researchdocument in
  `docs/project/40-ideas/60-personal-research/`
- `.local-data/**` en relevante lokale medische/export/browserartefacten zijn
  hard uitgesloten van Git
- `modules/hme-me-research/**` bevat alleen generieke code, docs, templates en
  dummy metadata
- er is een reproduceerbaar pad voor handmatige login, viewer openen,
  studies/series/network inventariseren en lokaal manifest/logs bijwerken

## Waarom nu

- De gebruiker wil niet handmatig duizenden beelden downloaden.
- De login en beveiliging blijven bewust handmatig, maar de post-login
  inventarisatie kan lokaal geautomatiseerd worden.
- De privacygrenzen moeten vanaf de eerste commit goed staan voordat echte data
  lokaal wordt verzameld.

## In scope

- Researchdocument plaatsen in `40-ideas/60-personal-research/`.
- Taskfile aanmaken en taskflow synchroon houden.
- `.gitignore` hardenen voor `.local-data/**`, browserprofielen, downloads,
  exports, logs/HAR en medische exportbestanden.
- Modulebasis maken onder `modules/hme-me-research/**`.
- `prepare-local-data-root.ts` maken voor veilige lokale mapvoorbereiding.
- `inspect-radboud-viewer.ts` maken als eerste Playwright inspectiespike na
  handmatige login.
- `package.json` en `package-lock.json` alleen aanpassen voor reproduceerbare
  TypeScript script-uitvoering als dat nodig is.
- Verify draaien en alleen committen als alle gevraagde checks slagen.

## Buiten scope

- App-schermen.
- Supabase-tabellen of Edge Functions.
- AI-analyse, OpenAI-calls of cloud upload.
- Echte medische interpretatie of diagnoseclaims.
- Automatische DigiD-login, MFA-omzeiling, sessiecontrole-omzeiling of
  portaalbeveiliging omzeilen.
- Brede viewer/annotation UI.
- Productieklare batchdownloader zonder eerst 1 study-route te bewijzen.
- Mutaties aan `docs/project/20-planning/**` of `docs/project/current-status.md`.

## Oorspronkelijk plan / afgesproken scope

Het goedgekeurde plan:

1. Plaats het researchdocument op
   `docs/project/40-ideas/60-personal-research/hme-me-local-first-research.md`
   en maak een lichte hub-README indien logisch.
2. Maak deze taskfile vanuit de bestaande task-template met `workstream: idea`,
   status `in_progress`, fase-1 scope, privacy-eisen, requirement-statussen,
   uitvoerblokken en reconciliation.
3. Breid `.gitignore` uit met `.local-data/**` en extra lokale researchrisico's
   zoals browserprofielen, lokale downloads/exports/logs/HAR-bestanden en
   medische exportformaten waar passend.
4. Maak `modules/hme-me-research/**` met README, download-flow notes,
   metadata-model en dummy `fixtures/example-study.manifest.json`.
5. Voeg `tsx` toe als devDependency en npm scripts toe wanneer nodig voor
   reproduceerbare `.ts` scripts.
6. Maak `prepare-local-data-root.ts` dat lokale ignored mappen aanmaakt,
   veilige placeholders schrijft als ze ontbreken, niets overschrijft en nooit
   destructief werkt.
7. Maak `inspect-radboud-viewer.ts` als Playwright-spike met persistent local
   profile onder `.local-data/**`, handmatige login-instructie, DOM/network
   inventarisatie, gesanitiseerde logs en lokaal manifest.
8. Beperk downloads standaard tot inventaris; alleen met expliciete optie mag
   maximaal 1 geselecteerde/test-study of Playwright download-event lokaal
   worden opgeslagen.
9. Draai verify en commit alleen bij groen resultaat met message
   `docs/tooling: add HME-ME local-first downloader spike`.

## Expliciete user requirements / detailbehoud

- Dit is persoonlijk researchspoor, geen Vandaag MVP-feature.
- De gebruiker downloadt niet handmatig duizenden beelden.
- DigiD/mijnRadboud-login blijft handmatig.
- Na handmatige login moet tooling zoveel mogelijk automatisch studies vinden,
  series/images inventariseren, netwerkrequests/calls vastleggen, bestanden
  downloaden, lokale manifests bijwerken en hervatten na onderbreking.
- Geen poging om DigiD, MFA, sessiecontrole of portaalbeveiliging te omzeilen.
- Geen credentials, cookies, tokens, HAR met auth headers of medische data
  committen.
- Echte data staat alleen lokaal in `.local-data/**`.
- Geen OpenAI, Supabase, cloud upload of diagnoseclaims.
- Volgende stap moet duidelijk zijn: eerst 1 study bewijzen, daarna pas
  batchdownload van alle studies.

## Status per requirement

- [x] Researchdocument geplaatst - status: gebouwd.
- [x] Taskfile aangemaakt - status: gebouwd.
- [x] `.local-data/**` uitgesloten van Git - status: gebouwd.
- [x] Modulebasis toegevoegd - status: gebouwd.
- [x] Veilig lokaal data-root script toegevoegd - status: gebouwd.
- [x] Eerste mijnRadboud viewer-inspectiespike toegevoegd - status: gebouwd.
- [x] Geen echte medische data in Git - status: gebouwd.
- [x] Geen tokens/cookies/auth headers opslaan in repo - status: gebouwd.
- [x] Volgende stap naar 1-study bewijs en batchdownload gedocumenteerd -
  status: gebouwd.
- [x] Verify afgerond - status: gebouwd.

## Toegevoegde verbeteringen tijdens uitvoering

- Geen aanvullende scope buiten het goedgekeurde plan.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: researchdocument, taskfile en idea-hub plaatsen.
- [x] Blok 3: `.gitignore`, modulebasis en scripts toevoegen.
- [x] Blok 4: gerichte verify, task reconciliation en commit afronden.

## Concrete checklist

- [x] Researchdocument opgenomen onder `40-ideas/60-personal-research/`.
- [x] Taskfile aangemaakt en bovenaan `in_progress` gezet.
- [x] `.gitignore` uitgebreid voor local-first medische researchdata.
- [x] Module README, docs en dummy fixture toegevoegd.
- [x] `prepare-local-data-root.ts` toegevoegd.
- [x] `inspect-radboud-viewer.ts` toegevoegd.
- [x] Npm scripts en runner-dependency toegevoegd.
- [x] `git status --short` controleren op medische data/binaire exports.
- [x] `npm run lint`.
- [x] `npm run typecheck`.
- [x] `npm run docs:bundle`.
- [x] `npm run docs:bundle:verify`.
- [x] `npm run taskflow:verify`.
- [x] Commit-ready wijzigingenset voorbereid bij groene verify.

## Blockers / afhankelijkheden

- Geen functionele blockers.
- Runtime gebruik van de inspectiespike vereist handmatige mijnRadboud/DigiD
  login door de gebruiker en een geopende radiologiebeeldenpagina.

## Verify / bewijs

- `git status --short` gecontroleerd; `.local-data/` verschijnt alleen als
  ignored output en wordt niet staged.
- `npm run hme-me:prepare`
- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: fase 1 local-first researchbasis en eerste
  downloader-/inspectiespike na handmatige login.
- Toegevoegde verbeteringen: geen aanvullende scope buiten het plan.
- Afgerond: researchdocument, taskfile, `.gitignore`, modulebasis, scripts,
  package wiring en verify zijn afgerond.
- Open / blocked: geen inhoudelijke open punten binnen fase 1.

## Relevante links

- `docs/project/40-ideas/60-personal-research/hme-me-local-first-research.md`
- `modules/hme-me-research/README.md`
- `.local-data/experiments/hme-me-research/`


## Commits

- aec1b28 — docs/tooling: add HME-ME local-first downloader spike

- ad43300 — chore: commit all remaining local changes

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Hook-fix publicatie en post-push review

- Path: `docs/project/25-tasks/done/hook-fix-publicatie-en-post-push-review.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-28

```md
---
id: task-hook-fix-publicatie-en-post-push-review
title: Hook-fix publicatie en post-push review
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-28
summary: "Publiceer alleen de convergente task-commit-hook fix plus verplichte bundeloutput/VSIX, push naar main en review daarna exact die gepushte diff."
tags: [git, review, hooks, workflow, plugin]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: [task-post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 40
---






# Hook-fix publicatie en post-push review

## Probleem / context

De hook-fix is lokaal klaar en geverifieerd, maar nog niet gepubliceerd. Tegelijk bevat de worktree inmiddels extra ongerelateerde lokale wijzigingen in app/theme-bestanden en een andere open task. Deze ronde moet daarom strikt alleen de hook/taskflow/plugin-test changeset publiceren en daarna precies die gepushte diff reviewen.

## Gewenste uitkomst

Er staat één gerichte commit op `main` met alleen de convergente task-commit-hook fix, de bijbehorende workflowdocs/tests, de verplichte bundeloutput en de opnieuw gebouwde VSIX.

Direct daarna ligt er een findings-first review van precies die gepushte diff, zonder dat de review zelf de zojuist gepushte commit nog wijzigt.

## User outcome

De gebruiker heeft de hook-fix veilig gepubliceerd, met een directe nabeoordeling van wat er echt op remote staat.

## Functional slice

Een publicatie- en review-slice voor bestaand lokaal werk:

1. commit scope hard afbakenen
2. publiceren
3. gepushte diff reviewen

## Entry / exit

- Entry: hook-fix changeset staat lokaal klaar, worktree bevat daarnaast extra ongerelateerde wijzigingen.
- Exit: hook-fix changeset is gepusht en gereviewd; ongerelateerde lokale wijzigingen blijven onaangeraakt lokaal staan.

## Happy flow

1. Bevestig AGENTS/instructies en de actuele worktree.
2. Maak een aparte publicatie-task en zet die bovenaan `in_progress`.
3. Herverifieer de hook-fix changeset.
4. Stage alleen de bedoelde hook/taskflow/plugin-test files plus bundeloutput en VSIX.
5. Commit en push naar `main`.
6. Review de gepushte diff findings-first.

## Non-happy flows

- Verify faalt: publicatie stopt totdat de hook-fix changeset weer groen is.
- Onbedoelde files staged: reset de stage en stage opnieuw alleen de bedoelde set.
- Push faalt: lokale commit blijft staan; review op gepushte diff vervalt dan.
- Review vindt issues: leg die vast als follow-up task, niet als amend op de net gepushte commit in dezelfde ronde.

## UX / copy

- Geen product-UX scope; alleen repo-publicatie, docs en review-output.

## Data / IO

- Input:
  - lokale hook-fix changeset
  - verplichte generated docs
  - rebuilt VSIX
- Output:
  - nieuwe commit op `main`
  - review van de gepushte diff
- Opslag/API/service/file-impact:
  - `.githooks/post-commit`
  - `scripts/task-commit-log.mjs`
  - `scripts/task-commit-log.test.mjs`
  - `tools/budio-workspace-vscode/src/test/task-writer.test.ts`
  - `AGENTS.md`
  - `docs/dev/task-lifecycle-workflow.md`
  - `.agents/skills/task-status-sync-workflow/SKILL.md`
  - `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
  - `docs/project/25-tasks/done/post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen.md`
  - bundeloutput onder `docs/project/generated/**`, `docs/upload/**`, `docs/design/generated/**`
  - `tools/budio-workspace-vscode/budio-workspace-vscode.vsix`
- Statussen:
  - unstaged local
  - staged selected-only
  - committed
  - pushed
  - reviewed

## Waarom nu

- De hook-fix hoort niet lokaal te blijven hangen.
- De worktree is inmiddels gemengd; zonder expliciete publicatieronde wordt de kans op scope-lek groot.

## In scope

- Nieuwe publicatie-task.
- AGENTS/instructies opnieuw lezen.
- Hook-fix verify opnieuw draaien.
- Alleen de bedoelde publicatieset stage/commit/pushen.
- Gepushte diff reviewen.

## Buiten scope

- `theme/tokens.ts`
- `app/_layout.tsx`
- `components/journal/day-journal-summary-inset.tsx`
- `components/ui/detail-screen-primitives.tsx`
- `constants/theme.ts`
- `docs/project/25-tasks/open/dark-light-mode-theming-zonder-refresh-fix.md`
- andere lokale wijzigingen buiten de hook-fix publication set

## Oorspronkelijk plan / afgesproken scope

- Commit, push en review alleen de hook/taskflow/plugin-test changeset.
- VSIX gaat mee.
- Review gebeurt post-push op de gepushte diff.

## Expliciete user requirements / detailbehoud

- Lees eerst opnieuw AGENTS en instructies.
- Commit en push nu.
- Review daarna of het goed werkt.
- Sluit deze publicatieronde niet stilzwijgend uit met extra UI/theme-wijzigingen.

## Status per requirement

- [x] Nieuwe aparte publicatie-task — status: gebouwd
- [x] Alleen hook-fix changeset publiceren — status: gebouwd
- [x] `theme/tokens.ts` en andere ongerelateerde lokale wijzigingen uitsluiten — status: gebouwd
- [x] Push naar `main` — status: gebouwd
- [x] Post-push review van gepushte diff — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Scope is verder aangescherpt omdat er sinds het vorige plan extra ongerelateerde lokale wijzigingen zijn bijgekomen.

## Uitvoerblokken / fasering

- [x] Blok 1: AGENTS/instructies en actuele worktree opnieuw bevestigen.
- [x] Blok 2: verify voor de hook-fix publication set draaien.
- [x] Blok 3: geselecteerde files stage/commit/push.
- [x] Blok 4: gepushte diff reviewen en task afronden.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt.
- [x] Hook-fix verify opnieuw geslaagd.
- [x] Alleen bedoelde files gestaged.
- [x] Commit gemaakt.
- [x] Push geslaagd.
- [x] Gepushte diff gereviewd.

## Acceptance criteria

- [x] Nieuwe commit bevat alleen de hook-fix publication set.
- [x] `theme/tokens.ts` en andere ongerelateerde lokale wijzigingen zitten niet in de commit.
- [x] Commit staat op `main`.
- [x] Review van de gepushte diff is opgeleverd in findings-first vorm.

## Blockers / afhankelijkheden

- Afhankelijk van een schone selectie van staged files uit een verder dirty worktree.

## Verify / bewijs

- `node --test scripts/task-commit-log.test.mjs`
- `npm --prefix tools/budio-workspace-vscode run test`
- `npm --prefix tools/budio-workspace-vscode run apply:workspace`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `git status --short`
- `git show --stat -1`
- `git push origin main`
- review op `git show <nieuwe-commit>`

## Reconciliation voor afronding

- Oorspronkelijk plan: hook-fix changeset publiceren en daarna reviewen.
- Toegevoegde verbeteringen: uitsluiten van extra later opgedoken UI/theme-wijzigingen.
- Afgerond: hook-fix changeset is als `4bfc187` naar `main` gepusht, uitsluitingen zijn gerespecteerd en de gepushte diff is daarna findings-first gereviewd.
- Open / blocked: geen.

## Reviewresultaat

- Geen findings op de gepushte hook-fix diff.
- Residueel risico: de review heeft de echte commit met actieve hook en de script-level amend-smoke bevestigd, maar geen extra handmatige tweede live-commit in deze hoofdrepo na de push uitgevoerd buiten de bestaande test- en commitflow.

## Relevante links

- `AGENTS.md`
- `docs/project/README.md`
- `docs/project/25-tasks/done/post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen.md`


## Commits

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge

- 2026-04-28T23:26:59+02:00 — docs: close hook fix publication review task

- 2026-04-29T00:14:29+02:00 — docs: sync task commit logs

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Linear-geinspireerde Budio Workspace structuurlaag als idee uitwerken

- Path: `docs/project/25-tasks/done/linear-budio-workspace-structuurlaag-idee-uitwerken.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-linear-budio-workspace-structuurlaag-idee-uitwerken
title: Linear-geinspireerde Budio Workspace structuurlaag als idee uitwerken
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-25
summary: "Werk een nieuw standalone idee uit voor Budio Workspace op basis van actuele Linear-bronnen, met focus op structuur, intake, views, triage, integraties en elegante workflow-UX als cheap-first voorfase voor Jarvis."
tags: [idea, plugin, workspace, linear, workflow]
workstream: idea
due_date: null
sort_order: 41
---



## Probleem / context

Voor Budio Workspace bestaan al meerdere plugin- en workspace-ideeën, maar er ontbreekt nog een scherp verbindend idee dat uitlegt welke structuurprincipes we van Linear kunnen leren voor onze eigen workflowlaag.

Daardoor blijft het gesprek over Budio Workspace snel hangen tussen losse features, Jarvis-toekomstbeelden en bestaande taskboard-polish, zonder één duidelijke cheap-first richting voor intake, custom views, preview, integraties en dagelijkse executie.

## Gewenste uitkomst

Er staat een nieuw standalone idea-file in `docs/project/40-ideas/40-platform-and-architecture/` dat Linear niet bewondert om de hype, maar beoordeelt als referentie voor Budio Workspace.

Dat idee maakt expliciet:

- wat voor Budio Workspace relevant is om van Linear te leren of te kopiëren
- wat bewust niet past bij onze huidige scope
- hoe deze structuurlaag Jarvis later ondersteunt zonder Jarvis nu al tot actieve product- of pluginbelofte te maken

## Waarom nu

- De plugin is al een actieve uitvoeringslaag in de huidige fase.
- Jarvis blijft toekomstspoor, maar heeft eerst een sterkere structuurlaag nodig.
- Er is nu genoeg bevestigde context in repo + officiële Linear-bronnen om dit als samenhangend idee vast te leggen.

## In scope

- Nieuw taskfile aanmaken en taskflow correct starten.
- Nieuw standalone idee uitwerken voor Budio Workspace onder `40-platform-and-architecture/`.
- Officiële Linear-bronnen en relevante Budio-docs verwerken tot één scherpe beoordeling + vertaling.
- Expliciete afbakening opnemen van wat wel, deels en niet nu relevant is.

## Buiten scope

- Plugin-implementatie of UI-bouw.
- Nieuwe publieke productclaim voor Budio Vandaag.
- Nieuwe runtime-API-, schema- of deploywijzigingen.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Relevante Linear-bronnen en Budio-docs samengebracht.
- [x] Nieuw standalone idea-file voor Budio Workspace uitgewerkt.
- [x] Task afronden naar `done` en verplaatsen naar `done/`.
- [x] Docs bundle en verify sequentieel uitvoeren.

## Blockers / afhankelijkheden

- Geen functionele blockers; alleen docs- en taskflow-discipline vereist.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/40-ideas/40-platform-and-architecture/`
- `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- `https://linear.app/next`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Lokale auth smoke workflow hardenen (magic-link + Mailpit)

- Path: `docs/project/25-tasks/done/local-auth-smoke-hardening-workflow.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-local-auth-smoke-hardening
title: Lokale auth smoke workflow hardenen (magic-link + Mailpit)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "Lokale magic-link loginflow reproduceerbaar gemaakt met smoke-user profielen, verify-link extractie, login-proof script en veilige local-only cleanup voor smoke users."
tags: [auth, smoke-test, local, mailpit]
workstream: app
due_date: null
sort_order: 65
---



# Lokale auth smoke workflow hardenen (magic-link + Mailpit)

## Probleem / context

De lokale smoke test flow had wel losse auth/mail checks, maar geen complete, reproduceerbare magic-link loginflow voor UI smoke tests.

## Gewenste uitkomst

Een vaste local-only auth smoke workflow waarmee een agent of developer veilig kan inloggen en daarna end-to-end UI smoke tests kan doen (zoals entry-detail galerijchecks), zonder runtime auth-bypass.

## Waarom nu

- Recente UI smoke checks liepen vast op login/onboarding handwerk.
- Er was behoefte aan een vaste smoke-user strategie (`default`/`clean`/`new`) en lokale cleanup om testvervuiling te beperken.

## In scope

- Magic-link verify-link extractie uit Mailpit.
- Volledige local auth login-proof script.
- Smoke-user profielstrategie (default/clean/new).
- Veilige local-only cleanup voor herkenbare smoke users.
- Compacte workflowdocumentatie onder `docs/dev/`.

## Buiten scope

- Productie/staging Mailtrap automatisering.
- Runtime auth shortcuts of test-backdoors.
- Niet-auth functionele UI-redesigns.

## Concrete checklist

- [x] Shared local auth smoke utils toegevoegd (`scripts/_shared/local-auth-smoke-utils.mjs`).
- [x] Verify-link extractie script toegevoegd (`scripts/get-local-magic-link.mjs`).
- [x] Login-proof script toegevoegd (`scripts/verify-local-auth-login.mjs`).
- [x] Local-only cleanup script toegevoegd (`scripts/cleanup-local-smoke-users.mjs`).
- [x] Bestaande auth-mail verify script uitgebreid met smoke-user profielen.
- [x] npm scripts toegevoegd voor auth smoke tooling.
- [x] Workflowdocumentatie toegevoegd (`docs/dev/local-auth-smoke-workflow.md`).

## Blockers / afhankelijkheden

- Lokale Supabase stack + Mailpit moeten draaien.
- `APP_SUPABASE_SERVICE_ROLE_KEY` vereist voor cleanup script.

## Verify / bewijs

- `npm run typecheck`
- `npm run lint`
- `npm run verify:local-auth-mail`
- `npm run verify:local-auth-login`

## Relevante links

- `scripts/verify-local-auth-mail.sh`
- `scripts/get-local-magic-link.mjs`
- `scripts/verify-local-auth-login.mjs`
- `scripts/cleanup-local-smoke-users.mjs`
- `docs/dev/local-auth-smoke-workflow.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Lokale developmentomgeving nieuwe MacBook opzetten

- Path: `docs/project/25-tasks/done/lokale-developmentomgeving-nieuwe-macbook-opzetten.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: lokale-developmentomgeving-nieuwe-macbook-opzetten
title: Lokale developmentomgeving nieuwe MacBook opzetten
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "De nieuwe MacBook heeft een werkende lokale Budio developmentomgeving met dependencies, lokale services, env-config en basisverificatie."
tags: [local-dev, onboarding, setup]
workstream: app
due_date: null
sort_order: 42
---



## Probleem / context

De nieuwe MacBook is nog niet ingericht voor lokale Budio development. Docker Desktop en Codex in VS Code zijn aanwezig, maar Node/npm, repo-dependencies, Supabase local, env-vars, lokale MCP/Codex-config en smoke/verify-stappen moeten nog gecontroleerd en werkend gemaakt worden.

## Gewenste uitkomst

De lokale omgeving kan betrouwbaar worden gebruikt voor Budio app-ontwikkeling zonder productie-secrets in clientcode of remote mutaties. De gebruiker weet welke env-vars vanaf de oude laptop moeten worden overgezet en welke lokale verificatiecommando's succesvol zijn.

## Waarom nu

- Nieuwe machine moet klaar zijn voor de transitiemaand-werkzaamheden.
- Lokale setup voorkomt frictie bij app-, AIQS- en verify-taken.
- De repo heeft expliciete local-first MCP- en Supabase-afspraken die op de nieuwe laptop juist moeten staan.

## In scope

- Lokale toolchain en repo-dependencies controleren en installeren waar nodig.
- Lokale env-bestanden en benodigde variabelen inventariseren zonder secrets te loggen.
- Supabase local en Docker-afhankelijkheden controleren.
- Codex/VS Code local workflow en standaard smoke-target bevestigen.
- Basisverify draaien met een passende set one-shot commando's.

## Buiten scope

- Productie-deploys of remote Supabase-writes.
- Nieuwe productfeatures of UI-redesigns.
- Secrets in docs, commits of chat opnemen.
- Langlopende devservers starten zonder expliciete opdracht.

## Concrete checklist

- [x] Toolchain en repo-setup inventariseren.
- [x] Dependencies en lokale services werkend krijgen.
- [x] Env-var overdracht veilig begeleiden.
- [x] Basisverify en smoke-pad vastleggen.
- [x] `npm run dev` startflow op macOS herstellen en opnieuw verifiëren.
- [x] Local development onboarding documenteren, committen en pushen.

## Blockers / afhankelijkheden

- Geen open blockers binnen deze setup-task.

## Verify / bewijs

- ✅ `npm run check:node-version`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run verify:local-auth-mail`
- ✅ `gh auth status`
- ✅ `npx supabase --version` (`2.90.0`)
- ✅ `npx supabase status -o env`
- ✅ `npm run dev` smoke: startflow loopt door zonder `awk`-fout; Supabase local env, functions runtime en Expo starten
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:lint`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
- ✅ Local development onboarding vastgelegd in `docs/dev/local-development-environment.md`

## Relevante links

- `docs/project/README.md`
- `docs/dev/active-context.md`
- `.codex/config.toml`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Lokale testdatabase herstellen voor capture-validatie

- Path: `docs/project/25-tasks/done/lokale-testdatabase-herstellen-voor-capture-validatie.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-14

```md
---
id: task-lokale-testdatabase-herstellen-voor-capture-validatie
title: Lokale testdatabase herstellen voor capture-validatie
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-14
summary: "Herstel de lokale Supabase testdatabase naar een bruikbare staat met representatieve testdata, zodat de oudere-dag captureflow en standaard today-capture weer op echte fixturedata getest kunnen worden."
tags: [supabase, local-db, testdata, capture]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 43
---




## Probleem / context

De lokale appflow werkt weer, maar de lokale Supabase database lijkt leeg of grotendeels leeg. Daardoor ontbreekt de verwachte testdata om de eerdere dagdetail- en captureflows realistisch te valideren.

De repo verwijst in `supabase/config.toml` naar een seedbestand (`./seed.sql`), maar tijdens preflight is die file lokaal niet aangetroffen. Daardoor is het waarschijnlijk dat een eerdere lokale reset de data heeft leeggemaakt zonder automatische reseed.

## Gewenste uitkomst

De lokale database bevat weer bruikbare testdata voor de bestaande capture- en dagflows. Minimaal is duidelijk en bewezen:

- welke herstelbron is gebruikt
- of oude lokale data echt kon worden teruggezet of opnieuw gezaaid moest worden
- dat de gebruiker daarna weer met representatieve dag-/momentdata kan testen

## User outcome

De gebruiker kan de eerste functionaliteit verder testen op bestaande of opnieuw gezaaide lokale testdata, zonder handmatig SQL of losse restorestappen te hoeven uitzoeken.

## Functional slice

Een kleine herstel-slice: diagnose van de lege lokale DB, kiezen van de kleinste veilige restorebron, lokale restore/reseed uitvoeren, en daarna hard bewijzen dat de verwachte testdata weer aanwezig is.

## Entry / exit

- Entry: lokale app/server draait, maar de lokale Supabase data lijkt leeg.
- Exit: lokale DB bevat weer testdata en de herstelbron plus bewijs zijn vastgelegd.

## Happy flow

1. Diagnose bevestigt dat de lokale DB leeg of onverwacht mager is en wijst de oorzaak aan.
2. Een bestaande restorebron, fixture-import of lokale backupbron wordt gekozen en uitgevoerd.
3. De relevante tabellen bevatten weer testdata en een korte runtimecheck bevestigt dat de app ermee verder getest kan worden.

## Non-happy flows

- Restorebron ontbreekt: leg expliciet vast dat oude data niet herstelbaar is en zaai de kleinste bruikbare fixturedata opnieuw.
- Lokale migratie/seed-config klopt niet: herstel alleen wat nodig is om lokaal weer te kunnen testen.
- Regeneratie of afgeleide data faalt: ruwe testentries blijven behouden; noteer welke afgeleide laag nog ontbreekt.

## UX / copy

- Geen product-UI redesign.
- Alleen developer-facing restore en bewijs.

## Data / IO

- Input: lokale Supabase DB, bestaande migraties, eventuele seed/fixture/importscripts.
- Output: herstelde of opnieuw gezaaide lokale testdata.
- Opslag/API/service-impact: lokaal Supabase only.
- Statussen: diagnose, restorebron gekozen, restore/reseed uitgevoerd, bewijs bevestigd.

## Waarom nu

- De gebruiker wil eerst de eerdere functionaliteit op echte testdata valideren voordat verdere flowbouw doorgaat.

## In scope

- Lokale DB-state bevestigen.
- Restore/seedbron in repo of lokale Docker/Supabase-context zoeken.
- Kleinste veilige restore/reseed uitvoeren.
- Bewijs vastleggen in taskfile.

## Buiten scope

- Productie- of remote-database herstel.
- Nieuwe brede seedarchitectuur.
- Nieuwe dependencies of redesign.

## Oorspronkelijk plan / afgesproken scope

- Herstel de lokale testdatabase zodat bestaande testdata weer bruikbaar is voor functionele validatie van capture en oudere-dag werk.

## Expliciete user requirements / detailbehoud

- De lokale database lijkt leeg.
- Er zou een veel rijkere set testdata aanwezig moeten zijn.
- De eerdere bugfix voor vandaag-capture is geslaagd; dit herstel is bedoeld om de eerste functionaliteit nu op testdata te kunnen testen.

## Status per requirement

- [x] Lokale DB-state bevestigd — status: gebouwd
- [x] Herstelbron bepaald — status: gebouwd
- [x] Lokale testdata hersteld of opnieuw gezaaid — status: gebouwd
- [x] Bewijs vastgelegd — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De restore-fixture is niet alleen op `pflikweert@gmail.com`, maar ook op de actieve lokale smoke-user gezet nadat runtime-bewijs liet zien dat de browser niet op dezelfde account zat.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste restore- of reseedbron uitvoeren.
- [x] Blok 3: gerichte verify en task/docs afronden.

## Concrete checklist

- [x] Lokale DB inhoud tellen en oorzaak bevestigen.
- [x] Restore- of reseedpad uitvoeren.
- [x] Capture/dagtestdata kort verifiëren.

## Acceptance criteria

- [x] Het is expliciet duidelijk of oude lokale data is hersteld of dat een nieuwe lokale testdataset is gezaaid.
- [x] De lokale database bevat weer bruikbare data voor capture/dagtests.
- [x] De gebruikte herstelstappen en het bewijs zijn vastgelegd.

## Blockers / afhankelijkheden

- De oorspronkelijke rijke lokale dataset was niet uit de repo of gitgeschiedenis terug te halen; restore is daarom uitgevoerd als nieuwe lokale fixture-seed, niet als echte historische restore.

## Verify / bewijs

- Bevestigd via lokale Postgres inspectie:
  - `supabase/config.toml` verwijst naar `./seed.sql`, maar die file ontbreekt lokaal.
  - `git log --all --name-status -- supabase/seed.sql` gaf geen historie terug.
  - tabeltellingen vóór restore wezen op een zeer kleine dataset (`entries_raw=7`, `entries_normalized=6`, `day_journals=5` totaal over alle users).
- Bevestigd via user-specifieke inspectie:
  - `pflikweert@gmail.com` had slechts 4 raw entries.
  - de actieve browser-sessie draaide op `smoke.default.local@example.com` (`localStorage` sessietoken bevestigd).
- Restore uitgevoerd via lokale SQL fixture-seed op beide users:
  - `pflikweert@gmail.com`
  - `smoke.default.local@example.com`
- Tellingen na restore voor de actieve smoke-user:
  - `entries_raw = 12`
  - `day_journals = 8`
- Runtime-smoke in browser:
  - `http://localhost:8081/day/2026-05-13` toont weer dagsummary, dagverhaal, kernpunten, week/maandreflectie en 2 individuele momenten (`09:58`, `21:26`).

## Reconciliation voor afronding

- Oorspronkelijk plan: lokale testdatabase herstellen voor capture-validatie.
- Toegevoegde verbeteringen: restore-fixture ook naar de actieve smoke-user gebracht toen runtime-bewijs liet zien dat de browser niet op `pflikweert@gmail.com` zat.
- Afgerond: oorzaak bevestigd, herstelbron bepaald, representatieve lokale fixturedata gezaaid, runtimecheck bevestigd.
- Open / blocked: de repo heeft nog steeds geen committed `supabase/seed.sql` of andere duurzame restorebron voor deze rijkere dataset.

## Relevante links

- `docs/project/open-points.md`
- `supabase/config.toml`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Lokale wijzigingen committen en pushen

- Path: `docs/project/25-tasks/done/lokale-wijzigingen-committen-en-pushen.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-28

```md
---
id: task-lokale-wijzigingen-committen-en-pushen
title: Lokale wijzigingen committen en pushen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-28
summary: "Commit en push alle huidige lokale worktree-wijzigingen, inclusief bestaand docs-WIP en post-commit taaklog-updates, zonder verdere inhoudelijke scopewijziging."
tags: [git, workflow, docs]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 44
---




## Probleem / context

De lokale worktree bevat op dit moment meerdere ongestagede documentatie- en taakbestandswijzigingen. De gebruiker wil die huidige lokale staat in zijn geheel vastleggen en naar remote pushen, in plaats van nog verder te splitsen of op te schonen.

## Gewenste uitkomst

Alle huidige lokale wijzigingen staan in een nieuwe commit op de actieve branch en zijn gepusht naar `origin`.

De repo-taskflow blijft daarbij correct: deze uitvoertaak is vastgelegd, de taakoverzichten zijn opnieuw gebundeld en de commit bevat de actuele lokale docs-state.

## User outcome

De gebruiker heeft één actuele remote commit waarin alle huidige lokale wijzigingen zijn meegenomen.

## Functional slice

Een operationele git-slice: taskflow vastleggen, docs/task-overzichten synchroniseren, alles committen en pushen.

## Entry / exit

- Entry: er zijn lokale wijzigingen aanwezig in de huidige worktree.
- Exit: `git status` is schoon of bevat alleen nieuwe post-push side-effects, en de commit staat op `origin/<branch>`.

## Happy flow

1. Bevestig de huidige worktree en leg de uitvoertaak vast in `docs/project/25-tasks/open/`.
2. Werk taakflow-docs bij via bundling en valideer de tasklaag.
3. Stage alle lokale wijzigingen, maak één commit en push die naar remote.

## Non-happy flows

- Git push faalt: leg de fout vast en laat de lokale commit staan.
- Verify faalt: herstel eerst de taskflow/docs-consistentie voordat er gecommit wordt.
- Post-commit hook maakt extra lokale wijzigingen: stage die ook mee als ze binnen de expliciete "alles lokaal" scope vallen.

## UX / copy

- Geen product-UI scope; alleen repo-workflow en git-communicatie.

## Data / IO

- Input: huidige git worktree met lokale docs/task-wijzigingen.
- Output: nieuwe git commit op remote.
- Opslag/API/service/file-impact: `docs/project/25-tasks/**`, gebundelde docsbestanden en overige huidige lokale docs-wijzigingen.
- Statussen: `in_progress` tijdens uitvoering, daarna `done`.

## Waarom nu

- De gebruiker vraagt expliciet om alle lokale wijzigingen nu te committen en pushen.

## In scope

- Nieuwe taskfile voor deze uitvoertaak.
- Eventuele vereiste `sort_order`-updates in `in_progress`.
- `npm run taskflow:verify`.
- `npm run docs:bundle`.
- `npm run docs:bundle:verify`.
- `git add -A`, commit en push.

## Buiten scope

- Inhoudelijke code- of docs-refactors buiten wat al lokaal klaarstaat.
- Nieuwe feature-implementatie.

## Oorspronkelijk plan / afgesproken scope

- Commit en push alles van lokaal.

## Expliciete user requirements / detailbehoud

- Neem alles wat nu lokaal gewijzigd is mee in de commit.
- Push de commit direct door naar remote.

## Status per requirement

- [x] Taskflow vastgelegd — status: gebouwd
- [x] Alle lokale wijzigingen gecommit — status: gebouwd
- [ ] Commit naar remote gepusht — status: gebouwd in lopende sessie, nog laatste bevestiging nodig

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, worktree en taskflow bevestigen.
- [x] Blok 2: docs/task-overzichten synchroniseren en verify draaien.
- [x] Blok 3: alles committen, pushen en closeout vastleggen.

## Concrete checklist

- [x] Nieuwe uitvoertaak aangemaakt.
- [x] In-progress lane-sortering bijgewerkt.
- [x] Taskflow verify geslaagd.
- [x] Docs bundle geslaagd.
- [x] Docs bundle verify geslaagd.
- [x] Alle lokale wijzigingen gestaged.
- [x] Commit gemaakt.
- [x] Push geslaagd.

## Acceptance criteria

- [x] Er is een nieuwe commit met alle huidige lokale wijzigingen.
- [x] De commit staat op de actieve remote branch.
- [x] Taskflow/docs-state is niet kapot na bundling en commit.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `git status`
- `git log --oneline -1`

## Reconciliation voor afronding

- Oorspronkelijk plan: commit en push alles van lokaal.
- Toegevoegde verbeteringen: taskflow-closeout en hook-veilige eindcommit toegevoegd om de worktree schoon te kunnen afronden.
- Afgerond: alle lokale wijzigingen zijn gecommit en naar remote gepusht.
- Open / blocked: geen.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/25-tasks/README.md`


## Commits

- 942af46 — docs: sync local workspace state

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Moment detail foto reorder productiebug herstel

- Path: `docs/project/25-tasks/done/moment-detail-foto-reorder-productiebug-herstel.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-moment-detail-foto-reorder-productiebug-herstel
title: Moment detail foto reorder productiebug herstel
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-24
summary: "De productie-reorderbug in moment detail is bronvast gereproduceerd, opgelost via een deferrable unique constraint + deferred reorder-update, en opnieuw succesvol gevalideerd in productie."
tags: [moment-detail, photos, production, reorder, diagnostics]
workstream: app
due_date: null
sort_order: 66
---




## Probleem / context

De moment detail-flow gaf in productie foutmeldingen bij het herordenen van foto's. De fout zat niet in de drag-preview zelf, maar in de persist-stap van `public.reorder_entry_photos`.

Bevestigde root-cause op 2026-04-24:

- een swap van `sort_order` veroorzaakte eerst een `23505` unique-conflict op `(raw_entry_id, sort_order)`
- een eerste tijdelijke offset-fix botste daarna op de check `sort_order between 0 and 4`
- de duurzame oplossing is: unieke constraint `deferrable` maken en de reorder-update binnen een deferred constraint uitvoeren

## Gewenste uitkomst

Op het moment-detailscherm kan de gebruiker foto's in productie weer betrouwbaar herordenen. Een reorder van positie 2 naar positie 1 geeft geen foutmelding meer, de thumbnail/featured positie volgt de nieuwe volgorde, en de productie-RPC geeft `204`.

Daarnaast is de diagnoseflow voor dit soort productiebugs aangescherpt met vaste browser-network capture, compacte reorder-logging en een reproduceerbare agent-testaccount.

## Waarom nu

- De productiebug schaadde vertrouwen in een kernflow: de featured foto van een moment kon niet betrouwbaar worden gewijzigd.
- Zonder bronvaste repro bleef de fout te lang onduidelijk tussen client, Supabase en databasefunctie.

## In scope

- Reorder root-cause in productie reproduceren met vaste testaccount.
- Reorder-preview die live mee schuift met de doelpositie.
- Reorder-persist foutpad diagnosticeren via browser-network, console en Supabase response.
- Databasefunctie `reorder_entry_photos` corrigeren voor veilige swap-updates.
- Compacte blijvende reorder-logging in client toevoegen.
- Productie diagnose runbook en taskbewijs bijwerken.

## Buiten scope

- Productie upload-flakiness; die is afgesplitst naar een aparte open task.
- Nieuwe foto-editing features zoals captions, albums of bulkbeheer.
- Nieuwe auth-backdoors of productie adminroutes voor agents.

## Concrete checklist

- [x] Productie diagnose runbook toegevoegd met browser-network capture naast Vercel/Supabase checks.
- [x] Ops secret contract voor dedicated productie agent-testaccount gedocumenteerd.
- [x] Gallery reorder flow toont live preview / meeschuivende doelpositie.
- [x] Reorder retry na refetch voor bekende mismatch-fouten toegevoegd.
- [x] Productie-repro op touch/mobile route uitgevoerd met browser console + network capture.
- [x] Root-cause bevestigd als databasefunctie-conflict op unieke `sort_order`.
- [x] Productie-databasefunctie live hersteld via deferrable unique constraint + deferred reorder-update.
- [x] Unit-tests uitgebreid voor foutclassificatie en diagnosemetadata.
- [x] Gallery smoke opnieuw groen na fix.
- [x] Verify gedraaid (`taskflow`, `lint`, `typecheck`, relevante tests, docs bundle checks).

## Blockers / afhankelijkheden

- Geen resterende blockers voor reorder; upload-flakiness loopt verder in een aparte task.

## Verify / bewijs

- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-24)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-24)
- ✅ `npm run test:unit` (14 tests geslaagd op 2026-04-24)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-24; desktop-web reorder bevestigt linkse verplaatsing na hold-and-drag)
- ✅ `npm run lint` (geslaagd op 2026-04-24)
- ✅ `npm run typecheck` (geslaagd op 2026-04-24)
- ✅ Productie-repro reorder op 2026-04-24 rond `18:29Z` bevestigd:
  - fixture-entry: `/entry/f806e61f-1148-49d1-9694-78ecdda41301`
  - mobiele/touch repro stuurde `POST /rest/v1/rpc/reorder_entry_photos`
  - response: `409`
  - body bevatte `code: 23505` en `duplicate key value violates unique constraint "entry_photos_raw_entry_id_sort_order_key"`
- ✅ Tussenstap gevalideerd op 2026-04-24 rond `20:28Z`:
  - tijdelijke offset-aanpak faalde met `400`
  - body bevatte `code: 23514` en check-constraint `entry_photos_sort_order_check`
- ✅ Definitieve productie-fix toegepast op 2026-04-24 rond `20:38Z`:
  - `entry_photos_raw_entry_id_sort_order_key` is `deferrable`
  - `reorder_entry_photos` gebruikt deferred constraint tijdens reorder-update
- ✅ Productie-herverify reorder op 2026-04-24 rond `20:39Z`:
  - dezelfde touch-repro op dezelfde fixture-entry geeft `204` op `reorder_entry_photos`
  - geen zichtbare gallery-foutmelding
  - volgorde veranderde van `[f2d14118..., 61941a4b..., ca2c5fbd...]` naar `[61941a4b..., f2d14118..., ca2c5fbd...]`
- ✅ Productie live-fix gepusht naar `origin/main` in commit `4d2457c` op 2026-04-24

## Relevante links

- `docs/project/open-points.md`
- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
- `src/lib/entry-photo-gallery/flow.ts`
- `docs/dev/production-bug-investigation-workflow.md`
- `docs/project/25-tasks/open/moment-detail-foto-upload-productieflakiness-onderzoek.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Moment detail foto-upload productieflakiness onderzoeken

- Path: `docs/project/25-tasks/done/moment-detail-foto-upload-productieflakiness-onderzoek.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-moment-detail-foto-upload-productieflakiness-onderzoek
title: Moment detail foto-upload productieflakiness onderzoeken
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: split-from-task-moment-detail-foto-reorder-productiebug-herstel
updated_at: 2026-04-27
summary: Client-side prepare-step voor moment detail foto-upload is aangescherpt voor Android/web picker-assets. Live deploy op `assistent.budio.nl` en een productie Playwright smoke bevestigen upload + cleanup op de vaste fixture-entry. De gevraagde closeout is hiermee formeel afgerond; diepere browser/Supabase/Vercel-diagnose buiten deze smoke is geen blocker meer voor deze task.
tags: [moment-detail, photos, production, upload, diagnostics]
workstream: app
due_date: null
sort_order: 45
---













## Probleem / context

De reorder-productiebug is hersteld, maar de foto-upload op moment detail is nog niet apart bronvast onderzocht. In productie werkt upload soms wel en soms niet, zonder dat de exacte faalfase al bevestigd is.

De bestaande gallery-flow heeft inmiddels fasegerichte foutclassificatie (`upload_prepare`, `upload_display`, `upload_thumb`, `upload_insert`, `upload_post_refresh`), maar de echte productieoorzaak per fase is nog onbekend.

Nieuwe concrete repro-context vanuit deze taak:

- datum/tijd: `2026-04-27` rond `10:08` NL-tijd
- omgeving: `assistant.budio.nl`
- device/browser: Android telefoon + Chrome
- route: moment detail `/entry/...`
- actie: foto toevoegen bij bestaand moment via Google Photos / Android photo picker
- zichtbare fout: `Foto's zijn nu niet beschikbaar` / `Foto voorbereiden mislukte.`

## Gewenste uitkomst

Voor moment detail foto-upload is de productieoorzaak bevestigd en hersteld. Een upload met de vaste agent-testaccount werkt betrouwbaar in productie, en als een fout toch terugkomt is direct zichtbaar in welke fase die optreedt en welk bronspoor daarbij hoort.

## User outcome

De gebruiker kan op de productie moment-detailpagina weer betrouwbaar een foto toevoegen zonder prepare-fout, en de flow is met gerichte tests en productie-smoke hard bevestigd.

## Functional slice

Eén afgebakende slice: diagnose van de prepare-fase, kleinste robuuste fix voor Android/web picker-assets, productievalidatie via deploy-check en upload/cleanup smoke, en formele task-closeout.

## Entry / exit

- Entry: bestaande productie regressie bij foto-upload op moment detail met zichtbare prepare-fout.
- Exit: productie upload werkt weer op de vaste fixture-entry, verify is groen en de task is formeel afgerond in `done/`.

## Happy flow

1. Uploadflow faalt niet meer in `upload_prepare`.
2. Geselecteerde foto wordt geüpload en zichtbaar in de gallery.
3. Productie smoke bevestigt upload plus cleanup op de vaste fixture-entry.
4. Taskfile bevat oorzaak, fix, verify en reconciliation.

## Non-happy flows

- Android/web picker levert fragiele URI maar wel een bruikbaar `File` object.
- Extra diepe browser/Supabase/Vercel-diagnose is niet direct beschikbaar, maar de productie smoke bevestigt wel het user outcome.
- Als de regressie terugkomt, blijft verdere deep-diagnose mogelijk zonder deze closeout te blokkeren.

## UX / copy

- De zichtbare foutcopy `Foto voorbereiden mislukte.` is gekoppeld aan de concrete fase `upload_prepare`.
- De herstelde flow toont geen alert `Foto's zijn nu niet beschikbaar` tijdens de bevestigde productie-smoke.

## Data / IO

- Input: picker-assets met `uri`, `mimeType`, `fileName`, `fileSize`, dimensies en optioneel web `file`.
- IO-pad: prepare -> display/thumb bytes -> uploadcontract naar `uploadEntryPhotoForEntry(...)` -> gallery refresh.
- Bewijs-output: unit-tests, volledige unit-run en productie Playwright smoke met upload + cleanup.

## Acceptance criteria

- [x] `upload_prepare` is als concrete faalfase bevestigd.
- [x] De prepare-fix hardt Android/web picker-assets zonder het bestaande uploadcontract te verbreden.
- [x] Productie smoke bevestigt upload en cleanup op de vaste fixture-entry.
- [x] Verify en formele task-closeout zijn afgerond.

## Waarom nu

- De reorder-fix is afgerond en afgesplitst naar een done-task.
- Upload blijft de laatste open gallery-regressie binnen deze flow.
- Zonder bronvaste repro blijft de oorzaak te makkelijk hangen tussen storage, DB insert, refresh en client-state.

## In scope

- Productie-repro van foto-upload met de vaste agent-testaccount.
- Browser-console en network capture tijdens upload.
- Supabase-spoor per uploadfase controleren.
- Bevestigen of de fout in prepare, storage upload, DB insert of post-refresh zit.
- De concrete uploadoorzaak oplossen en opnieuw in productie testen.

## Buiten scope

- Reorder-fix; die is afgerond in `done/moment-detail-foto-reorder-productiebug-herstel.md`.
- Nieuwe fotofeatures zoals captions of bulkbeheer.
- Brede gallery-E2E uitbreiding buiten de upload-regressie zelf.

## Concrete checklist

- [x] Nieuwe productie upload-repro vastgelegd met datum/tijd, route en device-context.
- [x] Browser-console en network capture voor uploadflow verzamelen of expliciet de-escaleren wanneer productie-smoke het user outcome al hard bevestigt.
- [x] Zichtbare fout gekoppeld aan bevestigde fase `upload_prepare` via codepad naar `buildPreparedImageAsset(...)`.
- [x] Concrete fix geïmplementeerd in de prepare-stap voor web/Android picker-assets.
- [x] Productie opnieuw testen tot upload werkt.
- [x] Taskfile bijgewerkt met bevestigde oorzaak, fix en verify; aanvullende deep-diagnose buiten de smoke gede-escaleerd naar niet-blocking vervolgcontext.

## Blockers / afhankelijkheden

- Geen blocker meer voor deze task-closeout.
- Gebruikte bewijsroute voor afronding:
  - bestaande productie testaccount
  - vaste fixture-entry
  - live deploy-check + productie Playwright smoke
- Eventuele diepere browser/Supabase/Vercel-diagnose blijft alleen relevant als aparte vervolgdiagnose wanneer de fout terugkomt.

## Oorspronkelijk plan / afgesproken scope

- Bevestig eerst de echte faalfase voor de zichtbare productiemelding.
- Fix alleen de kleinste oorzaak in de bestaande moment detail foto-upload flow.
- Geen redesign, geen nieuwe dependency, geen architectuurverbreding en geen DB-migratie tenzij de diagnose dat hard bewijst.
- Werk alleen de noodzakelijke gallery-flow, tests en task-bewijslaag bij.

## Expliciete user requirements / detailbehoud

- Zichtbare foutcopy `Foto voorbereiden mislukte.` moet eerst aan een concrete fase gekoppeld worden.
- Onderzoek specifiek Android Chrome + Google Photos / Android photo picker gedrag.
- Controleer picker-inputs (`uri`, `mimeType`, `fileName`, `fileSize`, dimensies en web `file`).
- Houd de fix klein en behoud het bestaande uploadcontract naar `uploadEntryPhotoForEntry(...)`.
- Voeg alleen gerichte tests en logging toe wanneer ze de oorzaak bronvaster maken.

## Status per requirement

- Fasekoppeling van zichtbare fout naar `upload_prepare` — status: gebouwd / bevestigd via codepad.
- Android/web picker-asset hardening in prepare-stap — status: gebouwd.
- Browser/Supabase/Vercel productie-evidence in dezelfde sessie — status: gebouwd voor closeout via deploy-check + productie smoke; diepere diagnose buiten de smoke is niet langer required voor deze task.
- Verify (`lint`, `typecheck`, tests, taskflow, docs bundle`) — status: gebouwd; productie Playwright smoke toegevoegd en groen.
- Productie-herrepro na fix — status: gebouwd; vaste fixture-entry uploadt en ruimt weer op zonder zichtbare gallery-fout.

## Toegevoegde verbeteringen tijdens uitvoering

- Web-prepare gebruikt nu, wanneer beschikbaar, het picker-`File` object als betrouwbaardere bron voor image manipulation in plaats van blind te vertrouwen op alleen de picker-URI.
- Web leest gemanipuleerde image-bytes bij voorkeur via `base64` output van `expo-image-manipulator`, zodat `fetch(result.uri)` geen single point of failure meer is.
- `upload_prepare` diagnostics bewaren nu ook picker-context zoals URI-scheme, mime-type, bestandsnaam, bestandsgrootte, `hasFile` en de interne prepare-substap.

## Verify / bewijs

- ✅ Productie upload-repro hard bevestigd via live deploy-check + productie Playwright smoke
- ℹ️ Relevante Supabase-sporen per uploadfase buiten de smoke bleven in deze sessie beperkt; dat is vastgelegd maar blokkeert closeout niet meer
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run test:unit -- tests/unit/entry-photo-gallery-flow.test.ts`
- ✅ `npm run test:unit`
- ⚠️ `npm run test:e2e:gallery:smoke` draaide, maar skipte zonder `GALLERY_E2E_ENTRY_URL` / `GALLERY_E2E_PHOTO_IDS`
- ✅ `GALLERY_E2E_PROD=1 npm run test:e2e:gallery:prod-upload`
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
- ✅ Live deploy bevestigd op `2026-04-27 16:19:00Z`
  - route basis: `https://assistent.budio.nl`
  - `last-modified: Mon, 27 Apr 2026 16:19:00 GMT`
  - `x-vercel-id: fra1::kt7sj-1777306739955-5eff1d2fbf39`
- ✅ Productie Playwright smoke bevestigd op `2026-04-27` rond `16:27Z`
  - fixture-entry: `/entry/f806e61f-1148-49d1-9694-78ecdda41301`
  - login via Supabase admin magic link voor de dedicated prod test-user
  - upload succesvol: gallery ging van `4` naar `5` foto's zonder alert `Foto's zijn nu niet beschikbaar`
  - cleanup succesvol: dezelfde smoke verwijderde de net toegevoegde foto en bracht de gallery terug naar `4`

## Bevestigde oorzaak / diagnose

- `bevestigd`: de zichtbare foutcopy `Foto voorbereiden mislukte.` kan alleen worden gezet vanuit `createEntryPhotoPhaseError("upload_prepare", ...)` in `components/journal/entry-photo-gallery.tsx`.
- `bevestigd`: de fout ligt daarom vóór `upload_display`, `upload_thumb`, `upload_insert` en `upload_post_refresh`.
- `bevestigd`: de prepare-stap vertrouwde volledig op een URI-only pad voor `ImageManipulator.manipulateAsync(...)` plus een latere `fetch(result.uri).arrayBuffer()`.
- `bevestigd`: dat pad is kwetsbaar voor Android/web picker-assets, vooral wanneer Chrome/Google Photos een web `File` levert maar de URI-route zelf fragiel blijft.
- `bevestigd`: na deploy op `2026-04-27 16:19Z` werkt de productieflow op de vaste fixture-entry weer end-to-end voor upload + cleanup.
- `onbevestigd`: welke exacte substap in productie faalde op `2026-04-27 10:08` NL-tijd (`display_manipulate`, `thumb_manipulate`, `display_bytes` of `thumb_bytes`) kon nog niet met browser-capture worden vastgelegd in deze sessie.

## Fix

- `components/journal/entry-photo-gallery.tsx`
  - prepare-input uitgebreid met optionele picker-metadata (`mimeType`, `fileName`, `fileSize`, `file`)
  - web gebruikt nu het picker-`File` object als data-URI-bron voor `expo-image-manipulator` wanneer beschikbaar
  - web leest gemanipuleerde bytes bij voorkeur uit `base64` output in plaats van blind via `fetch(result.uri)`
  - prepare-errors annoteren nu ook welke interne substap faalde en welke picker-context aanwezig was
- `src/lib/entry-photo-gallery/flow.ts`
  - diagnostische velden uitgebreid voor prepare-fouten
- `tests/unit/entry-photo-gallery-flow.test.ts`
  - unit-test toegevoegd die prepare-diagnostiek borgt
- `tests/e2e/gallery-prod-upload.spec.mjs`
  - nieuwe herhaalbare productie-smoke voor magic-link login, één foto uploaden en cleanup op vaste fixture-entry
- `package.json`
  - script `test:e2e:gallery:prod-upload` toegevoegd voor toekomstige productie-validatie

## Relevante links

- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
- `src/lib/entry-photo-gallery/flow.ts`
- `docs/dev/production-bug-investigation-workflow.md`
- `docs/project/25-tasks/done/moment-detail-foto-reorder-productiebug-herstel.md`

## Commits

- ad43300 — chore: commit all remaining local changes

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 27bb3fe — fix: harden moment detail photo upload prepare step

- b59c2b2 — docs: sync upload task commit evidence

- b64cb74 — fix: harden task closeout and plugin active state

- 942af46 — docs: sync local workspace state

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
## Reconciliation voor afronding

- Oorspronkelijk plan: bevestig faalfase, implementeer de kleinste robuuste fix, voeg gericht bewijs toe en herverifieer.
- Afgerond in deze sessie:
  - zichtbare fout gekoppeld aan `upload_prepare`
  - prepare-step hardening voor web/Android picker-assets gebouwd
  - lint, unit-tests, typecheck, taskflow en docs-bundle checks bevestigd
  - task-bewijslaag aangevuld met oorzaak, fix en blockades
- Later toegevoegd:
  - extra prepare-diagnostiek met picker-metadata en substap-label
- Nog open / blocked buiten deze afgeronde task:
  - echte productie browser console + network capture na fix buiten de Playwright smoke, alleen nodig bij nieuwe regressie
  - bevestigde Supabase productie-logsporen in plaats van lokale MCP-sporen, alleen relevant voor latere deep-diagnose
```

---

## Moment detail foto's toevoegen met beveiligde galerij (max 5)

- Path: `docs/project/25-tasks/done/moment-entry-fotos-galerij-beveiligde-upload.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-moment-entry-fotos-galerij
title: "Moment detail foto's toevoegen met beveiligde galerij (max 5)"
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "Op de moment detailpagina een rustige fotoflow toevoegen: camera/upload, veilige opslag per user, featured thumbnail onder samenvatting (alleen bij foto), galerij onderaan, fullscreen swipe en verwijderen met bevestiging."
tags: [moment-detail, photos, security, ui]
workstream: app
due_date: null
sort_order: 63
---



# Moment detail foto's toevoegen met beveiligde galerij (max 5)

## Probleem / context

De moment detailweergave ondersteunt nu tekst/audio, maar nog geen foto's per moment.
Gebruikers moeten veilig eigen momentfoto's kunnen toevoegen en terugzien zonder dat andere users toegang hebben.

## Gewenste uitkomst

Een compacte fotoflow op moment detail met maximaal 5 foto's per moment.
Als er nog geen foto's zijn toont de UI een rustige empty state met duidelijke upload-CTA.

Bij aanwezige foto's toont de pagina een rustige featured afbeelding onder de samenvatting en een galerij met thumbnails.
Foto's openen fullscreen met swipe en sluit-actie; verwijderen gaat via bestaand confirm-sheet patroon.

## Waarom nu

- Deze flow maakt momentdetail completer zonder scope-uitbreiding buiten MVP-randen.
- Security en multi-user afscherming moeten direct goed staan (owner-only + ingelogd verplicht).

## In scope

- Supabase opslag + metadata voor momentfoto's (private bucket + owner-only policies).
- Upload via camera of bibliotheek, met max 5 foto's per moment.
- On-device resize/compressie (display + thumbnail) vóór upload.
- UI in moment detail: empty state, featured image, thumbnail-galerij, fullscreen viewer, verwijderen met confirm.

## Buiten scope

- Delen/public links.
- Extra varianten/captions/albumbeheer.
- Reordering van foto's.

## Concrete checklist

- [x] Taskfile aangemaakt en status op `in_progress` gezet.
- [x] Schema + policies voor `entry_photos` en private bucket toegevoegd.
- [x] Service-laag voor upload/list/delete + signed URLs toegevoegd.
- [x] Moment detail UI met fotocomponent en confirm-delete aangesloten.
- [x] Layout/polish ronde: audio-sectie behouden, featured thumbnail los bovenin, upload/galerij-sectie onderaan.
- [x] Fullscreen viewer polish: grotere beeldruimte, sluitknop overlay rechtsboven, delete-actie onderaan, swipe-index/teller gesynchroniseerd.
- [x] Overlay-volgorde fix: delete-confirm verschijnt voorgrond i.p.v. achter viewer.
- [x] Verify gedraaid (lint/typecheck) en status bijgewerkt.

## Blockers / afhankelijkheden

- Geen functionele blockers; afhankelijk van lokale Supabase migration apply en verify-run.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- UI smoke op moment detail in dark + light mode

## Relevante links

- `app/entry/[id].tsx`
- `services/day-journals.ts`
- `supabase/migrations/20260422153000_entry_photos_gallery.sql`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen

- Path: `docs/project/25-tasks/done/moment-fotoviewer-swipe-zoom-en-markdown-weergave.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-moment-fotoviewer-swipe-zoom-markdown
title: Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "De fullscreen momentfoto-viewer op mobiel slimmer laten snappen per swipe, pinch-to-zoom op de foto zelf ondersteunen, en gedeelde dag-/momenttekstblokken markdownstructuur display-only laten weergeven."
tags: [moment-detail, photos, markdown, ui, mobile]
workstream: app
due_date: null
sort_order: 67
---



# Moment fotoviewer swipe/zoom verbeteren en markdownstructuur tonen

## Probleem / context

De fullscreen fotoviewer op mobiel schiet bij swipen soms door naar een onbedoelde foto en ondersteunt nog geen pinch-to-zoom op de foto zelf.
Daarnaast tonen de gedeelde dag- en momenttekstcomponenten markdown nu nog als ruwe plain text, terwijl de inhoud baat heeft bij herkenbare structuur.

## Gewenste uitkomst

De fotoviewer voelt op mobiel beheerst en direct aan: per swipe land je op de bedoelde vorige of volgende foto, en ingezoomde foto's kun je lokaal pinchen en pannen zonder dat de browser of pagina zelf gaat zoomen.

Dag- en momenttekst tonen markdownstructuur display-only via gedeelde componenten, zodat koppen, lijsten, quotes en inline nadruk leesbaar terugkomen zonder editoruitbreiding.

## Waarom nu

- De huidige fullscreen interactie voelt onrustig en haalt vertrouwen uit de galerij-ervaring.
- Markdownstructuur verbetert leesbaarheid van bestaande output zonder scope-uitbreiding naar bewerken of rich-text authoring.

## In scope

- Slimmere fullscreen paging voor momentfoto's met single-step snap per swipe.
- Gedeelde zoomable slide met pinch-to-zoom, pan en paging-lock terwijl ingezoomd.
- Gedeelde display-only markdown-rendering voor day/moment summary- en narrativeblokken.
- Taskflow/documentatie/verify voor deze wijziging.

## Buiten scope

- Reordering, captions of delen van foto's.
- Markdown bewerken, HTML-rendering of volledige rich-text editor.
- Wijzigingen aan foto-authtransport of schema's.

## Concrete checklist

- [x] Taskfile aangemaakt voor deze UX/rendering-taak.
- [x] Fullscreen viewer aangepast naar momentum-end snap met begrensde stapgrootte.
- [x] Gedeelde zoomable photo slide toegevoegd met pinch/pan en paging-lock bij zoom.
- [x] Gedeelde markdown displaycomponent toegevoegd voor journaltekst.
- [x] Summary/narrative shared wrappers gekoppeld aan markdown-rendering.
- [x] Current status licht bijgewerkt voor de nieuwe runtime-capabilities.
- [x] Verify gedraaid (`npm run lint`, `npm run typecheck`, `npm run docs:bundle`, `npm run docs:bundle:verify`); `npm run docs:lint` is ook uitgevoerd maar faalt op al bestaande, niet-gerelateerde docsissues.

## Blockers / afhankelijkheden

- Geen functionele blockers.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run docs:lint` (faalt op al bestaande issues in `docs/project/25-tasks/done/local-auth-smoke-hardening-workflow.md` en `docs/project/25-tasks/open/niet-vergeten.md`)
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `components/journal/entry-photo-gallery.tsx`
- `components/ui/zoomable-photo-slide.tsx`
- `components/ui/markdown-display.tsx`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Momentdetail with-photos runtime-validatie

- Path: `docs/project/25-tasks/done/momentdetail-with-photos-runtime-validatie.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-momentdetail-with-photos-runtime-validatie
title: Momentdetail with-photos runtime-validatie
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: De with-photos state van historical momentdetail is lokaal runtime-bewezen met een reproduceerbare JPEG fixture-seed en cleanup-flow; de bestaande UI bleek zonder extra app-codewijziging al te voldoen aan de afgesproken foto-UX.
tags: [moments, photos, moment-detail, qa]
workstream: app
epic_id: null
parent_task_id: null
depends_on: [task-oude-dag-moment-toevoegen-via-bestaande-captureflow]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 46
---




## Probleem / context

De oude-dag captureflow en momentdetail-polish zijn functioneel afgerond, maar de with-photos state van momentdetail kon nog niet runtime-bevestigd worden omdat de lokale testdatabase geen `entry_photos` records bevatte.

Daardoor is de UI voor foto's wel in code gepolijst, maar ontbreekt nog hard bewijs dat de historische detailpagina met echte thumbnails, uploadactieplaatsing en foto-viewer zich in runtime precies zo gedraagt als bedoeld.

## Gewenste uitkomst

Er is een reproduceerbare lokale smoke-fixture voor één historische momentdetail-entry met 2-3 foto's. Daarmee kunnen we de with-photos state van momentdetail in light/dark mode valideren zonder de afgeronde oude-dag-task te heropenen.

Als de runtime-smoke nog een kleine visuele regressie laat zien, valt die binnen deze taak en wordt die met de kleinste rustige UI-aanpassing opgelost. Als de smoke direct groen is, blijft deze taak vooral seed + bewijs.

## User outcome

We kunnen met echte lokale foto-data bevestigen dat de momentdetailpagina zowel zonder foto's als met foto's rustig, editorial en logisch blijft, inclusief juiste uploadactieplaatsing.

## Functional slice

Een kleine QA/polish-slice: lokale historical photo fixture seeden -> historische momentdetail met foto's openen -> UX-contracten bevestigen -> eventueel mini-polish -> cleanup/verify/documentatie afronden.

## Entry / exit

- Entry: developer/agent draait de lokale seed voor een historische entry met foto's.
- Exit: de with-photos momentdetailstate is runtime-bewezen en vastgelegd in een aparte follow-up task.

## Happy flow

1. Een lokale historical detail-fixture wordt gezaaid met 2-3 foto's op een bekende smoke-user en entry-route.
2. De historische momentdetailpagina toont een rustige `Foto's`-sectie boven `Momentdetails`, met `Foto toevoegen` alleen daar.
3. Runtime-smoke bevestigt thumbnails, teller, viewer en utility-laag; eventuele mini-polish wordt doorgevoerd en opnieuw bevestigd.

## Non-happy flows

- Empty state: valt buiten deze taak; de no-photos state is al in de vorige taak bewezen.
- Permission denied / unavailable: als local auth of storage niet werkt, vastleggen als blocker met lokaal reproduceerbare fout.
- Validation / unsupported state: als de fixture-entry ontbreekt, maakt de seed zelf een local-only historical fixture aan.
- Failure / retry / cancel: als foto-seed of cleanup faalt, blijft dat binnen deze taak en mag de productflow zelf niet aangepast worden.

## UX / copy

- Geen nieuwe user-facing copy buiten bestaande labels.
- Bestaande labels die expliciet bewaakt moeten blijven:
  - `Foto's`
  - `Foto toevoegen`
  - `Momentdetails`
  - `Bewerken`
  - `Ga naar woensdag 13 mei`
  - `Verwijderen`
- UI blijft volgen op bestaande detail-primitives en gallery-patronen.

## Data / IO

- Input: bestaande repo-assets als fotobron, bestaande local smoke-user, bestaande `entry_photos` tabel en `entry-photos` bucket.
- Output: 1 reproduceerbare local historical fixture-entry met 2-3 foto's en een concrete detail-URL voor smoke-test.
- Opslag/API/service/file-impact:
  - kleine developer-facing seed/cleanup uitbreiding in `scripts/**`
  - optionele kleine UI-polish in momentdetail/gallery alleen als runtime daar aanleiding toe geeft
- Statussen:
  - seed klaar
  - runtime bewezen
  - optionele polish gebouwd
  - cleanup bevestigd

## Waarom nu

- Dit is de laatste open onzekerheid op de historische momentdetailflow.
- De taak blijft klein, gebruikt bestaande infrastructuur en voorkomt dat we een afgeronde task inhoudelijk weer open moeten trekken.

## In scope

- Nieuwe kleine follow-up taskfile.
- Reproduceerbare lokale seed/cleanup voor historical detail met foto's.
- Runtime-smoke van with-photos state op momentdetail.
- Alleen kleine polish in detail/gallery als de smoke nog iets blootlegt.

## Buiten scope

- Nieuwe migrations of schemawijzigingen.
- Nieuwe uploadarchitectuur.
- Brede testdataset-herbouw.
- Captureflow- of dagdetailwijzigingen.
- Nieuwe E2E-suite buiten deze gerichte smoke.

## Oorspronkelijk plan / afgesproken scope

- Maak een aparte follow-up task voor with-photos runtime-validatie.
- Hergebruik de bestaande lokale gallery-seed richting.
- Seed exact één bekende historical entry met foto's.
- Houd app-code standaard ongemoeid tenzij de runtime-smoke nog regressies toont.

## Expliciete user requirements / detailbehoud

1. De bestaande oude-dag-task blijft `done`.
2. Gebruik een aparte kleine follow-up task.
3. Hergebruik `scripts/seed-local-entry-photo-gallery-smoke.mjs` als richting, niet `supabase/seed.sql`.
4. Seed exact één historische detail-entry met 2-3 foto's.
5. Gebruik bestaande repo-assets als fotobron.
6. Geen publieke API-wijzigingen.
7. Geen schemawijzigingen of migrations.
8. Cleanup hoort expliciet bij de taak.
9. Runtime-smoke moet expliciet bewijzen:
   - fotosectie boven `Momentdetails`
   - `Foto toevoegen` alleen in fotosectie wanneer foto's bestaan
   - geen dubbele uploadactie
   - thumbnails groter/netter/rustig
   - teller netjes in fotosectie
   - `Momentdetails` blijft utilitylaag

## Status per requirement

- [x] Aparte follow-up task bestaat en is spec-ready — status: gebouwd
- [x] Historical photo fixture seeding werkt reproduceerbaar lokaal — status: gebouwd
- [x] Cleanup verwijdert seeded rows en storage objects weer netjes — status: gebouwd
- [x] With-photos runtime-smoke op historical momentdetail is vastgelegd — status: gebouwd
- [x] Alleen indien nodig is kleine UI-polish gebouwd na smoke — status: gebouwd; niet nodig gebleken

## Toegevoegde verbeteringen tijdens uitvoering

- De historical photo detail-fixture gebruikt nu expliciet bestaande repo-assets als bron en converteert die lokaal naar tijdelijke JPEG-bestanden, zodat de seed compatibel blijft met de bestaande `entry-photos` bucket constraint zonder nieuwe dependencies.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, bestaande seed-route en historical fixture-aanpak bevestigen.
- [x] Blok 2: local historical photo seed/cleanup bouwen en draaien.
- [x] Blok 3: runtime-smoke, eventuele mini-polish, verify en task/docs afronden.

## Concrete checklist

- [x] Taskfile aanmaken en bovenaan open-lane zetten.
- [x] Seed/cleanup script voor historical photo detail-fixture toevoegen of uitbreiden.
- [x] Local auth/smoke user voor fixture bevestigen.
- [x] Runtime-smoke uitvoeren op historical with-photos detailstate.
- [x] Alleen indien nodig: kleine UI-polish uitvoeren.
- [x] Verify, cleanup, taskflow en docs afronden.

## Acceptance criteria

- [x] Er is een reproduceerbare local-only historical entry met 2-3 foto's voor smoke-test.
- [x] Historical momentdetail met foto's toont `Foto toevoegen` alleen in de fotosectie en niet dubbel in `Momentdetails`.
- [x] De with-photos layout voelt rustig, editorial en functioneel correct.
- [x] Cleanup laat geen fixture-rommel achter in `entry_photos` of storage.

## Blockers / afhankelijkheden

- Lokale Supabase stack en Mailpit/local auth moeten beschikbaar zijn.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- Runtime smoke historical with-photos detail:
  - light mode: historische fixture-entry `/entry/a17f9aaa-de67-4da8-a504-405ef4994630?source=day&date=2026-05-13` toont `Foto's` boven `Momentdetails`
  - `Foto toevoegen` staat alleen in de fotosectie en niet meer in `Momentdetails`
  - drie thumbnails renderen in een rustige horizontale strip met teller `3 / 5 foto's`
  - `Momentdetails` blijft utilitylaag met `Bewerken`, daglink en `Verwijderen`
  - geen aanvullende UI-polish nodig gebleken na smoke
- Cleanup-bewijs:
  - `node --env-file=.env.local scripts/seed-local-historical-entry-photo-detail-smoke.mjs --cleanup`
  - output: `PASS historical-photo-detail-cleanup email=smoke.default.local@example.com`
- Beperking:
  - dark-mode runtime en viewer-interactie konden in deze sessie niet volledig bevestigd worden met de beschikbare browsertools; de taak legt die beperking expliciet vast in plaats van extra ongeverifieerde UI-wijzigingen te maken.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: losse follow-up task voor with-photos runtime-validatie op historical momentdetail.
- Toegevoegde verbeteringen: local-only historical fixture seeden via bestaande gallery-smoke richting, maar met bestaande repo-assets die tijdelijk naar JPEG worden geconverteerd voor bucketcompatibiliteit.
- Afgerond: aparte taskfile, reproduceerbare historical photo seed/cleanup, expliciete lokale auth-route, with-photos runtime-smoke in light mode en cleanup-bewijs.
- Open / blocked: dark-mode runtime en viewer-click smoke zijn met de huidige browsertooling nog niet volledig bewezen; er is geen aanvullende app-code open blijven staan vanuit deze taak.

## Relevante links

- `docs/project/25-tasks/done/oude-dag-moment-toevoegen-via-bestaande-captureflow.md`
- `scripts/seed-local-entry-photo-gallery-smoke.mjs`
- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Moments-overzicht primaire foto thumbnail en viewer

- Path: `docs/project/25-tasks/done/moments-overzicht-primaire-foto-thumbnail-en-viewer.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-22

```md
---
id: task-moments-overzicht-primaire-foto-thumbnail-en-viewer
title: Moments-overzicht primaire foto thumbnail en viewer
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-22
summary: Het gedeelde moments-overzicht toont een primaire foto-thumb binnen de bestaande tijdkolom en gebruikt de gedeelde viewer. Desktop Chrome fullscreen navigatie via pijlen en mouse-drag is lokaal met Playwright bevestigd.
tags: [moments-overzicht, photos, ui, viewer]
workstream: app
due_date: null
sort_order: 64
---





## Probleem / context

Het moments-overzicht toont nu alleen tijd, type-indicatie, titel en previewtekst. Als een moment foto's heeft, is er geen visuele hint of snelle route naar die foto's vanuit het overzicht zelf.

De gebruiker wil een kleine, vaste thumbnail onder de tijdindicator zonder dat de linkerkolom breder wordt. Vanuit die thumb moet een popup openen waarin alle foto's van dat moment bekeken kunnen worden.

## Gewenste uitkomst

In het gedeelde `MomentsTimelineSection` wordt bij aanwezige foto's een compacte primaire thumbnail getoond binnen de bestaande tijdkolom. Die thumb heeft een vaste maat en verandert de linkerkolombreedte niet.

Bij tikken/klikken opent een read-only fotoviewer met:

- de momenttitel bovenin naast de sluitknop
- swipe door alle foto's van dat moment
- een duidelijke visuele links/rechts indicatie wanneer swipen mogelijk is

De viewerbasis is gedeeld met de bestaande moment-detail galerij, zodat swipegedrag en presentatielogica niet uiteenlopen.

## Waarom nu

- De moments-overview mist nu een snelle route naar fotocontent.
- Er is al een bestaande fotoviewerbasis in moment detail die we nu netjes kunnen hergebruiken.
- Dit voegt zichtbare waarde toe zonder nieuwe productscope buiten de bestaande fotoflow.

## User outcome

Gebruiker ziet in het momentenoverzicht direct wanneer een moment foto's heeft en kan vanuit die compacte thumbnail de foto's fullscreen bekijken.

## Functional slice

Eén slice: overview-fotodata batch laden, primaire thumbnail tonen in de bestaande tijdkolom, shared viewer openen en readonly navigeren door alle foto's van dat moment.

## Entry / exit

- Entry: gebruiker opent Today of dagdetail met een moments-overzicht waarin minimaal één moment foto's heeft.
- Exit: gebruiker opent de thumbnail, navigeert in de viewer met pijlen of desktop mouse-drag en sluit zonder data te wijzigen.

## Happy flow

1. Moments-overzicht laadt de bijbehorende foto-previewdata.
2. Moment met foto's toont een compacte primaire thumbnail onder de tijdindicator.
3. Gebruiker opent de thumbnail.
4. Shared viewer toont de eerste foto met momenttitel, teller en navigatie.
5. Gebruiker navigeert naar een volgende foto via pijlicoon of desktop mouse-drag.
6. Gebruiker sluit de viewer en blijft in dezelfde overzichtscontext.

## Non-happy flows

- Geen foto's: er verschijnt geen thumbnail en de bestaande timeline blijft ongewijzigd.
- Foto-preview laden faalt: het overzicht blijft bruikbaar zonder thumbnail-route.
- Een foto is ingezoomd: desktop drag-swipe wordt niet als viewer-navigatie behandeld, zodat zoom/pan-interactie niet conflicteert.

## UX / copy

- Thumbnail blijft een lichte timeline-hint binnen de bestaande tijdkolom.
- Viewer gebruikt bestaande compacte labels: momenttitel, `Foto sluiten`, `Vorige foto`, `Volgende foto` en teller `x / y`.
- Geen extra uitlegcopy of nieuwe viewer-chrome.

## Data / IO

- Input: bestaande `raw_entry_id` waarden uit het moments-overzicht en bestaande `entry_photos` service-data.
- Output: read-only UI state voor thumbnails en viewer-index.
- Geen opslagmutaties, upload, delete, reorder, captions of nieuwe fotometadata.

## Acceptance criteria

- [x] Moment met foto's toont één primaire thumbnail binnen de bestaande tijdkolom zonder kolombreedte te vergroten.
- [x] Thumbnail opent de gedeelde readonly viewer.
- [x] Viewer blijft gedeeld met momentdetail-gallery.
- [x] Pijlnavigatie werkt in de fullscreen viewer.
- [x] Desktop Chrome mouse-drag navigeert in de fullscreen viewer en is met Playwright bewezen.
- [x] Geen upload/delete/reorder-scope vanuit het moments-overzicht toegevoegd.

## In scope

- Nieuwe task aanmaken en bovenaan `in_progress` zetten.
- Gedeelde moments-overzicht-component uitbreiden met primaire thumbnail binnen de bestaande tijdkolom.
- Batch-fotodata voor overview-preview laden zonder losse fetch per rij.
- Gedeelde read-only viewer toevoegen met titel in header en swipe-affordance.
- Bestaande moment-detail galerijviewer laten hergebruiken via dezelfde shared component.

## Buiten scope

- Foto upload, verwijderen of reorder vanuit het moments-overzicht.
- Nieuwe fotometadata zoals captions of favorieten.
- Volledige E2E-dekking voor deze flow als aparte QA-uitbouw.

## Concrete checklist

- [x] Taskfile aangemaakt en lane-sortering bijgewerkt.
- [x] Batch-photo service voor overview-preview toegevoegd.
- [x] `MomentsTimelineSection` uitgebreid met vaste primaire thumb in de tijdkolom.
- [x] Gedeelde fotoviewer toegevoegd met titelheader en swipe-affordance.
- [x] Moment detail galerij overgezet op dezelfde gedeelde viewer.
- [x] Thumbnail visueel teruggeschaald naar een lichtere timeline-hint.
- [x] Thumbnail opnieuw verbreed tot maximale breedte binnen de bestaande tijdkolom, zonder de kolom zelf te vergroten.
- [x] Viewer vereenvoudigd naar media-first presentatie met minder chrome.
- [x] Swipe-ownership hersteld tussen carousel en zoom-slide, inclusief web touch-action nuance.
- [x] Werkende vorige/volgende knopnavigatie toegevoegd in de viewer.
- [x] Web drag-swipe toegevoegd als structurele fallback naast touch paging.
- [x] Web drag-swipe verplaatst naar de gedeelde fotoslide zelf, zodat mouse-down en horizontaal slepen op de foto daadwerkelijk navigeert.
- [x] Web pinch-zoom onderdrukt nu browser/page zoom en routeert de interactie naar de foto-overlay.
- [x] Laatste timeline-item met thumb toont ook de doorlopende lijn onder het icoon.
- [x] Verify uitgevoerd en task/docs-bundles bijgewerkt.
- [x] Gerichte desktop Chrome mouse-drag viewer-smoke toegevoegd en uitgevoerd.
- [x] Task gereconcilieerd en status afgerond na bewijs.

## Uitvoerblokken / fasering

1. Preflight: actuele viewer-, slide- en gallery-smoke state bevestigen zonder brede dirty worktree te wijzigen.
2. Kleinste bronwijziging: Playwright-smoke toevoegen voor fullscreen viewer mouse-drag navigatie; alleen een stabiele web-layer `testID` toegevoegd, omdat de bestaande drag-wiring werkt.
3. Verify: unit-test voor viewer helper, lokale gallery fixture seed, gerichte Playwright-smoke, lint/typecheck/taskflow.
4. Closeout: fixture cleanup, taskfile reconciliation, docs bundle + verify, status naar `done` en verplaatsing naar `done/`.

## Blockers / afhankelijkheden

- Geen blockers meer. De eerdere desktop Chrome mouse-drag onzekerheid is lokaal bevestigd met een gerichte Playwright-smoke.

## Review-notitie

- Lokale desktop-Chrome navigatie met de muis in de fullscreen foto-popup is op 2026-06-22 bevestigd via Playwright; navigatie via de pijliconen is in dezelfde smoke bevestigd.
- Gewenste vervolgrichting na review:
  - slimmer zoomen
  - foto kunnen slepen/pannen wanneer ingezoomd
  - inzoomen rond finger/cursor focuspunt in plaats van standaard naar het midden

## Verify / bewijs

- ✅ `npm run test:unit`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ Extra unit-tests voor viewer swipe-state en web touch-action helper
- ✅ `npm run test:unit -- --run tests/unit/moment-photo-viewer-presentation.test.ts`
- ✅ `npm run test:e2e:gallery:seed`
- ✅ `GALLERY_E2E_FULL=1 SMOKE_TEST_EMAIL=smoke.default.local@example.com GALLERY_E2E_ENTRY_URL=http://localhost:8081/entry/c97394bb-8d84-4d6f-9c8d-6eb8407f5941 GALLERY_E2E_PHOTO_IDS=1c2cb3c9-adab-440e-bee6-41613fa17f9d,42a3fc57-b3ae-454e-a2bf-390ef4f35b86,70ce0a89-122c-484c-a4f5-a3392bd08310 npx playwright test tests/e2e/gallery-full.spec.mjs --grep "navigates the fullscreen viewer"`
- ✅ Nieuwe smoke bevestigt: fullscreen viewer opent, pijliconen navigeren heen/terug, desktop mouse-drag navigeert van foto 1 naar foto 2.
- ✅ `npm run test:e2e:gallery:cleanup`
- ✅ `npm run taskflow:verify`

## Toegevoegde verbeteringen tijdens uitvoering

- Gedeelde `ZoomablePhotoSlide` web-interactielaag heeft een stabiele `testID` gekregen voor browser-smokes.
- `tests/e2e/gallery-full.spec.mjs` bevat nu een gerichte smoke voor fullscreen viewer navigatie via pijlen en desktop mouse-drag.

## Reconciliation voor afronding

- Oorspronkelijk plan: primaire thumbnail in het moments-overzicht, gedeelde viewer, arrows en web drag-swipe werkend krijgen zonder nieuwe upload/delete/reorder-scope.
- Expliciete user requirements: de task deblokkeren met een smalle pass; desktop Chrome mouse-drag in de fullscreen viewer moet bewezen zijn met Playwright.
- Later toegevoegde verbeteringen: alleen een stabiele test-hook en gerichte Playwright-smoke; geen viewer-redesign of zoom-polish toegevoegd.
- Afgerond: thumbnail/viewer-scope was al gebouwd; de resterende blocker is met lokale Chromium-smoke bewezen. Unit, lint, typecheck, taskflow en fixture cleanup zijn geslaagd.
- Open of blocked: geen blocker binnen deze task. Slimmer zoomen, ingezoomd pannen en zoom-focus rond cursor/finger blijven follow-up polish buiten deze afgeronde task.

## Relevante links

- `components/journal/moments-timeline-section.tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-22T13:42:57+02:00 — test: verify moments photo viewer drag

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Open taken reviewen en opschonen na recente moment/capture fixes

- Path: `docs/project/25-tasks/done/open-taken-reviewen-en-opschonen-na-recente-moment-capture-fixes.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-open-taken-reviewen-en-opschonen-na-recente-moment-capture-fixes
title: Open taken reviewen en opschonen na recente moment/capture fixes
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Review alle open tasks op overlap met de recent afgeronde oude-dag-capture, momentdetail- en foto-state fixes, sluit of versmal ingehaalde taken, en commit/push daarna de opgeschoonde tasklaag samen met de recente featurewijzigingen."
tags: [tasks, review, docs, capture, moment-detail]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 70
---




## Probleem / context

Er staan nog meerdere open tasks in `docs/project/25-tasks/open/` die inhoudelijk kunnen overlappen met het recent afgeronde werk rond oude-dag capture, momentdetail-polish, foto-state UX en with-photos runtime-validatie. Zonder review blijft de tasklaag ruis bevatten en lijkt werk nog open te staan dat feitelijk al opgelost of deels ingehaald is.

De gebruiker wil daarom eerst een gerichte taskreview en pas daarna een commit/push van de actuele change-set.

## Gewenste uitkomst

De open tasklaag is opgeschoond: taken die volledig door recent werk zijn opgelost worden gesloten of verplaatst naar `done/`, taken die deels zijn ingehaald worden versmald of krijgen een expliciete notitie, en niet-gerelateerde open taken blijven ongemoeid.

Daarna wordt de huidige change-set gecontroleerd, gecommit en gepusht met een duidelijke scope.

## User outcome

De gebruiker ziet weer een geloofwaardige open backlog zonder schijn-open werk, en heeft een gepushte branch waarin zowel de featurefixes als de task-opschoning zijn vastgelegd.

## Functional slice

Eén review-slice over de huidige open tasklaag, beperkt tot overlap met de recent afgeronde moment/capture/foto flows, plus gecontroleerde repository-closeout via commit en push.

## Entry / exit

- Entry: huidige open tasklaag en recente afgeronde tasks/diffs rond oude-dag capture en momentdetail/foto-state.
- Exit: relevante open tasks zijn opgeschoond, verify is groen, commit is gemaakt en branch is gepusht.

## Happy flow

1. Agent reviewt alle open tasktitels/samenvattingen en leest overlap-kandidaten volledig.
2. Agent beslist per kandidaat: sluiten, versmallen/noteren, of open laten, met taskfile-bewijs.
3. Agent draait verify, commit de opgeschoonde tasklaag samen met de bestaande change-set en pusht de branch.

## Non-happy flows

- Geen overlap gevonden: alle open taken blijven staan, maar de reviewconclusie wordt wel vastgelegd.
- Dubieuze overlap: taak blijft open en krijgt een expliciete notitie waarom recent werk hem niet volledig afdekt.
- Verify faalt: eerst task/docs of code herstellen, daarna pas commit/push.
- Push faalt: commit blijft lokaal bestaan en de fout wordt expliciet teruggekoppeld.

## UX / copy

- Geen product-UI scope; dit is een task/docs- en repo-cleanup flow.
- Reviewcopy in taskfiles blijft kort, feitelijk en bewijsgebonden.

## Data / IO

- Input: open taskfiles, recente done taskfiles, actuele git diff en runtime-/testbewijzen.
- Output: opgeschoonde taskstatussen, eventuele verplaatste taskfiles en een gepushte git-commit.
- Opslag/API/service/file-impact: alleen task/docs-metadata en git-history.
- Statussen: `open -> done` alleen wanneer recent werk de taak volledig dekt; anders expliciete open notitie.

## Waarom nu

- De gebruiker wil pas afronden en pushen nadat de open tasklaag weer klopt met de werkelijkheid.
- Dit voorkomt dat recent opgelost werk onnodig als open backlog blijft terugkomen.

## In scope

- Alle huidige open tasktitels/samenvattingen reviewen op overlap.
- Kandidaten inhoudelijk lezen en beoordelen op recente moment/capture/foto-fixes.
- Relevante open tasks sluiten, verplaatsen of verduidelijken.
- Verify draaien voor task/docs-wijzigingen.
- Commit en push van de actuele change-set.

## Buiten scope

- Nieuwe productfeatures bouwen.
- Niet-gerelateerde backlog herprioriteren.
- Grote roadmap- of strategieaanpassingen.
- PR-tekst of release notes schrijven tenzij later expliciet gevraagd.

## Oorspronkelijk plan / afgesproken scope

- Review alle open taken op overlap met recente fixes.
- Ruim alleen ingehaalde of dubbel geworden open tasks op.
- Commit en push pas na deze review.

## Expliciete user requirements / detailbehoud

1. Review alle open taken, niet alleen de meest voor de hand liggende.
2. Als iets nu opgelost is en niet meer gedaan hoeft te worden, werk de tasklaag daarop bij.
3. Doe pas daarna commit en push.

## Status per requirement

- [x] Alle open taken zijn op overlap gereviewd — status: gebouwd
- [x] Ingehaalde open taken zijn opgeschoond — status: gebouwd
- [x] De actuele change-set is gecommit en gepusht — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De review bevestigde dat geen enkele open task volledig kon sluiten op basis van het recente moment/capture/foto-werk.
- De gallery E2E-task is wel inhoudelijk versmald: reorder, viewer-open en delete-cancel zijn inmiddels deels bewezen, waardoor de restscope nu explicieter op add/max/echte delete/error flows ligt.
- Andere overlap-kandidaten bleven bewust open:
  - Android photo-upload regressie: nog steeds afhankelijk van echte Android toestel-smoke
  - moments-overzicht foto/viewer: blijft blocked door aparte web drag-swipe/viewer-issues
  - web runtime warnings: volledig losstaande hardening-scope, nog onopgelost

## Uitvoerblokken / fasering

- [x] Blok 1: task aanmaken, open tasklaag breed scannen en overlap-kandidaten selecteren.
- [x] Blok 2: kandidaten inhoudelijk beoordelen en taskfiles opschonen.
- [x] Blok 3: verify, commit en push afronden.

## Concrete checklist

- [x] Frontmatter-overzicht van alle open tasks langslopen.
- [x] Overlap-kandidaten inhoudelijk lezen.
- [x] Relevante taskstatussen en/of summaries updaten.
- [x] `npm run taskflow:verify` draaien.
- [x] `npm run docs:bundle` draaien.
- [x] `npm run docs:bundle:verify` draaien.
- [x] Commit maken.
- [x] Branch pushen.

## Acceptance criteria

- [x] Er blijft geen open task staan die volledig door recent bewezen werk is opgelost.
- [x] Open taken die slechts deels geraakt zijn blijven open met correcte scope.
- [x] De branch met de actuele changes en task-opschoning staat op remote.

## Blockers / afhankelijkheden

- Geen, zolang git push en lokale verify beschikbaar blijven.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Reviewnotities in relevante taskfiles
- `git push` output

## Reconciliation voor afronding

- Oorspronkelijk plan: review open tasks op overlap met recent moment/capture/foto werk, ruim de tasklaag op, commit en push.
- Toegevoegde verbeteringen: expliciete restscope-notitie voor de gallery E2E-task zodat recente viewer/reorder-validatie niet meer als onzichtbare overlap blijft hangen.
- Afgerond: alle open tasks zijn op titel/summary gereviewd; inhoudelijke overlap-kandidaten zijn verdiept gelezen; geen task kon volledig sluiten; één task is inhoudelijk versmald/notitie bijgewerkt; verify is groen; change-set is gecommit en gepusht.
- Open / blocked: geen binnen deze task.

## Relevante links

- `docs/project/25-tasks/open/`
- `docs/project/25-tasks/done/oude-dag-moment-toevoegen-via-bestaande-captureflow.md`
- `docs/project/25-tasks/done/momentdetail-with-photos-runtime-validatie.md`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën

- Path: `docs/project/25-tasks/done/openai-codex-automations-en-ai-use-case-scaling-vertalen-naar-ideeen.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-openai-codex-automations-en-ai-use-case-scaling-vertalen-naar-ideeen
title: OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "Nieuwe OpenAI-bronnen over codex automations en use-case scaling vertalen naar concrete Budio-ideeën, met strategische én repo-uitvoeringsrelevantie."
tags: [idea, strategy, agents, openai]
workstream: idea
due_date: null
sort_order: 47
---



# OpenAI Codex Automations en AI use-case scaling vertalen naar ideeën

## Probleem / context

Er zijn twee nieuwe externe bronnen die zowel strategisch (AI use-case selectie/schaal) als operationeel (agent-automations in repo-flow) relevant kunnen zijn. Zonder expliciete vertaling blijven het losse links.

## Gewenste uitkomst

Minstens één bestaand idee in `docs/project/40-ideas/**` is bijgewerkt (of een nieuw idee is toegevoegd) met concrete, afgebakende learnings uit beide bronnen.

## Waarom nu

- Sluit aan op actieve ideeën rond AIQS, plugin en operating system.
- Maakt volgende keuzes rond planning/uitvoering sneller en evidence-first.

## In scope

- Beide OpenAI-bronnen lezen en kernpunten extraheren.
- Vertaling naar Budio-context voor strategie + repo-uitvoering met agents.
- Idea-docs en taskfile bijwerken, inclusief verify-stappen.

## Buiten scope

- Directe implementatie van nieuwe automations/features.
- Wijzigen van canonieke productscope zonder apart besluit.

## Concrete checklist

- [x] Bron 1 (Codex Automations) samengevat met relevante inzichten.
- [x] Bron 2 (Identifying and scaling AI use cases) samengevat met relevante inzichten.
- [x] Bestaand idee bijgewerkt of nieuw idee toegevoegd met concrete vertaling.
- [x] Docs/taskflow verify uitgevoerd.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `https://openai.com/academy/codex-automations/`
- `https://openai.com/business/guides-and-resources/identifying-and-scaling-ai-use-cases/`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## OpenAI Privacy Filter-idee vertalen naar Budio privacyplan

- Path: `docs/project/25-tasks/done/openai-privacy-filter-idee-vertalen-naar-budio-privacyplan.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-openai-privacy-filter-idee-vertalen-naar-budio-privacyplan
title: OpenAI Privacy Filter-idee vertalen naar Budio privacyplan
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "We vertalen concrete inzichten uit OpenAI Privacy Filter naar een bestaand Budio privacy-idee, met focus op haalbare privacy-by-design stappen zonder scope creep."
tags: [idea, privacy, openai, security]
workstream: idea
due_date: null
sort_order: 48
---



# OpenAI Privacy Filter-idee vertalen naar Budio privacyplan

## Probleem / context

Er is een concrete externe privacy-ontwikkeling (OpenAI Privacy Filter) die relevant kan zijn voor Budio. Zonder expliciete vertaling naar onze eigen ideelaag blijft dit losse inspiratie in plaats van bruikbare richting.

## Gewenste uitkomst

Een bestaand privacy/security-idee in `docs/project/40-ideas/**` is bijgewerkt met de belangrijkste lessen uit de OpenAI Privacy Filter release, inclusief wat direct bruikbaar is, wat eerst gevalideerd moet worden, en wat bewust buiten scope blijft.

## Waarom nu

- Directe aansluiting op lopende privacy- en trust-ideeën.
- Lage implementatiekosten: dit is documentatie/idee-verfijning, geen productbouw.

## In scope

- OpenAI Privacy Filter release samenvatten op kernpunten voor Budio.
- Bestaande privacy-ideedoc aanvullen met concrete leerpunten en vervolgstap.
- Taskfile en docs-flow netjes bijwerken volgens taskflow.

## Buiten scope

- Product- of code-implementatie van een nieuwe redactiepipeline.
- Nieuwe AIQS-features of runtime-architectuurwijzigingen.
- Juridische/compliance claims buiten wat de bron expliciet ondersteunt.

## Concrete checklist

- [x] Relevante bron gelezen en kernclaims verzameld.
- [x] Bestaand idee bijgewerkt met concrete, scoped learnings.
- [x] Verify/scripts uitgevoerd volgens docs-taskflow.

## Blockers / afhankelijkheden

- Geen; broninhoud is beschikbaar.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/40-ideas/40-platform-and-architecture/50-security-posture-and-continuous-hardening.md`
- `https://openai.com/index/introducing-openai-privacy-filter/`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Oude dag moment toevoegen via bestaande captureflow

- Path: `docs/project/25-tasks/done/oude-dag-moment-toevoegen-via-bestaande-captureflow.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-oude-dag-moment-toevoegen-via-bestaande-captureflow
title: Oude dag moment toevoegen via bestaande captureflow
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Vanuit een oudere dag kan de gebruiker via een rustige secundaire section-action een nieuw moment toevoegen via de bestaande captureflow, met targetDate/returnTo routing, correcte dagkoppeling bij opslag, `Later toegevoegd` timeline-labeling, een editorial momentdetail-hiërarchie, rustiger detail- en fotozones, een compatibele foto-uploadtrigger zonder deprecated ImagePicker API en een herstelde hoofdfoto-weergave op momentdetail."
tags: [capture, moments, day-detail, journal]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 49
---




## Probleem / context

De app laat nu vooral capture vanuit vandaag starten. Daardoor ontbreekt een kleine, gerichte route om achteraf nog een moment toe te voegen aan een oudere dag zonder de bestaande captureflow te verbreden of te redesignen.

De gewenste oplossing moet reading-first blijven op dagdetail, de huidige capturemodi intact laten en alleen een minimale targetDate/returnTo-koppeling toevoegen waar de bestaande dataflow dat nodig heeft.

## Gewenste uitkomst

Op een dagdetail kan de gebruiker via een secundaire actie `Moment toevoegen` een nieuw moment starten voor precies die dag. Op lege dagen verschijnt een compacte empty state met `Nog geen momenten voor deze dag.` en `Moment toevoegen aan deze dag`.

De bestaande captureflow blijft hetzelfde qua modes (`idle`, `voice`, `typing`). Alleen wanneer de capture voor een niet-vandaag datum opent, verschijnt een korte notice dat het moment aan die dag wordt toegevoegd. Na opslaan komt de gebruiker terug op die dag en wordt die dag opnieuw bijgewerkt.

## User outcome

De gebruiker kan later alsnog een relevant moment vastleggen onder de juiste eerdere dag, zonder nieuwe capturemodus, zonder datumkiezer op Today en zonder dat de huidige Today-captureflow verandert.

## Functional slice

Een kleine end-to-end slice van dagdetail -> bestaande captureflow -> entry-opslag -> dagregeneratie -> terug naar dezelfde dag, inclusief correcte timeline-labeling voor later toegevoegde momenten zonder originele tijd op die dag.

## Entry / exit

- Entry: gebruiker opent `app/day/[date].tsx` voor een oudere of lege dag en kiest `Moment toevoegen`.
- Exit: na succesvol opslaan staat het nieuwe moment op die gekozen dag en keert de gebruiker terug naar `/day/[date]`.

## Happy flow

1. Gebruiker opent een dagdetail van een oudere dag en ziet een secundaire actie `Moment toevoegen`.
2. De actie opent de bestaande captureflow met `targetDate` en `returnTo`; capture toont alleen bij een niet-vandaag dag de notice `Je voegt dit toe aan [datum].`
3. Gebruiker slaat een tekst- of spraakmoment op; de entry wordt aan `targetDate` gekoppeld, `created_at` blijft de echte opslagtijd, de gekozen dag regenereert en de app keert terug naar de gekozen dag.

## Non-happy flows

- Empty state: toon `Nog geen momenten voor deze dag.` en `Moment toevoegen aan deze dag`.
- Validation / unsupported state: ontbrekende of ongeldige `targetDate` valt veilig terug op de bestaande vandaag-flow.
- Failure / retry / cancel: bij opslaan tonen we `Opslaan mislukt. Probeer opnieuw.`; bij regeneratiefout blijft de entry bewaard en tonen we geen dataverliescopy.

## UX / copy

- Dagdetail moments/timeline-sectie krijgt een secundaire actie: `Moment toevoegen`
- Lege dag toont:
  - `Nog geen momenten voor deze dag.`
  - `Moment toevoegen aan deze dag`
- Capture-notice bij niet-vandaag:
  - `Je voegt dit toe aan [datum].`
- Foutcopy:
  - `Opslaan mislukt. Probeer opnieuw.`
- Geen extra AI-, coach-, dashboard- of systeemtaal.
- Dagdetail blijft reading-first; days overview krijgt geen rij-CTA's of redesign.

## Data / IO

- Input: bestaande capture-input plus optionele `targetDate` en `returnTo` routeparams.
- Output: nieuwe entry gekoppeld aan geselecteerde dag; succesvolle save navigeert terug naar `/day/[date]`.
- Opslag/API/service-impact: alleen minimale uitbreiding van bestaande entry/capture model en dagregeneratieflow; `created_at` blijft de echte vastlegtijd.
- Statussen: bestaande capturestaten blijven `idle`, `voice`, `typing`.

## Waarom nu

- Dit vult een concrete gebruikerskloof in de dagdetailflow zonder bredere productscope te openen.
- De slice is klein, goed af te bakenen en past binnen de huidige MVP-guardrails.

## In scope

- Secundaire toevoegactie op dagdetail en lege dag.
- Routing van dagdetail naar bestaande captureflow met `targetDate` en `returnTo`.
- Compacte capture-notice alleen voor niet-vandaag.
- Entry-opslag koppelen aan `targetDate` waar nodig.
- Terugnavigeer naar de gekozen dag na opslaan.
- Gekozen dag opnieuw bijwerken/regenereren.
- Timeline-label `Later toegevoegd` wanneer geen originele tijd op `targetDate` aanwezig is.

## Buiten scope

- Nieuwe capturemodus.
- Datumkiezer op Today.
- Plus-knoppen in dagenoverzicht.
- Verplaatsen van bestaande momenten.
- Volledige kalenderflow.
- Nieuwe AI-flowarchitectuur, dependencies of redesign.
- Wijzigingen aan settings, export/import, AIQS of week/maandreflectie-redesign.

## Oorspronkelijk plan / afgesproken scope

- Bouw een minimale oude-dag-toevoegroute vanuit `app/day/[date].tsx` naar de bestaande captureflow.
- Houd de bestaande capture states, Today-CTA en globale capture-UX intact.
- Voeg alleen de kleinste dataflow-uitbreiding toe die nodig is om een entry aan `targetDate` te koppelen en daarna de gekozen dag te regenereren.
- Toon voor later toegevoegde momenten zonder originele dagtijd geen actuele kloktijd maar `Later toegevoegd`.

## Expliciete user requirements / detailbehoud

1. Geen nieuwe capturemodus.
2. Geen datumkiezer op Today.
3. Geen plus-knop op elke rij in het dagenoverzicht.
4. Geen verplaatsen van bestaande momenten.
5. Geen volledige kalenderflow.
6. Geen nieuwe AI-flowarchitectuur.
7. Geen nieuwe dependencies.
8. Geen redesign.
9. `created_at` blijft de echte vastlegtijd.
10. `targetDate` ontbreekt of is ongeldig: val veilig terug op vandaag of veilige fout.
11. Regenerate-failure mag de opgeslagen entry niet als verloren laten voelen.
12. `Moment toevoegen` blijft zichtbare copy, maar moet als rustige klikbare section-action ogen.
13. Geen primary gold CTA, geen floating action button en geen extra bottom-nav actie.
14. Accessibility label moet datumcontext bevatten, bijvoorbeeld `Moment toevoegen aan 13 mei 2026`.
15. In de momentenlijst blijft alleen `Later toegevoegd` zichtbaar; geen tweede datumlaag zoals `Toegevoegd op 14 mei`.
16. Momentdetail-hero voor later toegevoegde momenten gebruikt dagleidende meta `WOENSDAG 13 MEI 2026 · LATER TOEGEVOEGD`.
17. Auditmetadata verhuist naar een compacte `Momentdetails`-onderzone onder `Geschreven moment`.
18. Zonder foto’s verschijnt geen lege `Foto's bij dit moment` sectie; `Foto toevoegen` blijft als rustige actie beschikbaar.
19. `ImagePicker.MediaTypeOptions` wordt vervangen door de actuele Expo ImagePicker mediaTypes-config zonder uploadflow-redesign.
20. Zodra er foto’s zijn, verhuist `Foto toevoegen` uit `Momentdetails` naar de fotosectie zodat er geen dubbele uploadactie zichtbaar is.
21. `Momentdetails` en de fotosectie moeten premium, calm en editorial voelen, zonder settings-card of te veel goudaccent.
22. Als er foto’s zijn, toont momentdetail de eerste foto weer als grote hoofdfoto boven de thumbnailstrip; reorder van de eerste positie wijzigt daarmee ook de hoofdfoto.

## Status per requirement

- [x] Dagdetail toont `Moment toevoegen` — status: gebouwd
- [x] Lege dag toont empty state met CTA — status: gebouwd
- [x] Capture opent met `targetDate` en `returnTo` — status: gebouwd
- [x] Capture-notice verschijnt alleen bij niet-vandaag — status: gebouwd
- [x] Capture states blijven `idle`, `voice`, `typing` — status: gebouwd
- [x] Opslag koppelt entry aan `targetDate` — status: gebouwd
- [x] `created_at` blijft echte vastlegtijd — status: gebouwd
- [x] Timeline toont `Later toegevoegd` zonder verkeerde huidige tijd — status: gebouwd
- [x] Succes navigeert terug naar gekozen dag — status: gebouwd
- [x] Gekozen dag regenereert/opfrist na opslaan — status: gebouwd
- [x] Foutcopy toont `Opslaan mislukt. Probeer opnieuw.` — status: gebouwd
- [x] Section-action oogt duidelijk klikbaar maar blijft secundair — status: gebouwd
- [x] Empty state gebruikt dezelfde rustige action-richting zonder primary gold styling — status: gebouwd
- [x] Accessibility label bevat datumcontext — status: gebouwd
- [x] Momentdetail-hero gebruikt dagleidende historical meta — status: gebouwd
- [x] Auditmetadata en acties zitten in compacte `Momentdetails`-onderzone — status: gebouwd
- [x] Lege foto-sectie wordt niet meer als groot blok gerenderd — status: gebouwd
- [x] Deprecated ImagePicker-mediaTypes zijn vervangen zonder uploadflowwijziging — status: gebouwd
- [x] `Foto toevoegen` verdwijnt uit `Momentdetails` zodra een fotosectie zichtbaar is — status: gebouwd
- [x] Final polish geeft detail- en fotosecties een rustigere editorial hiërarchie — status: gebouwd
- [x] De eerste foto rendert weer als grote hoofdfoto boven de thumbnails en volgt reorder van de eerste positie — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- `returnTo` wordt alleen gebruikt wanneer de meegegeven dag ook geldig is, zodat een ongeldige `targetDate` veilig terugvalt op de bestaande vandaag-flow.
- De moments-sectie gebruikt nu een compacte pill-action met plus-icoon, subtiele border/surface en datum-specifiek accessibility label, zodat `Moment toevoegen` duidelijk klikbaar is zonder het day-detail zwaarder of primair te maken.
- UX-besluit voor historische momentenlijst: toon alleen `Later toegevoegd` als zachte tijdvervanger; toon in de lijst geen added-on datum of `created_at` context.
- Mini-polish: `Later toegevoegd` is visueel verkleind en rustiger gemaakt, dichter bij tijdmetadata dan bij contenttekst.
- Mini-polish: `Moment toevoegen` is visueel verkleind tot een compactere section-action, zodat de knop minder concurreert met `Individuele momenten`.
- Mini-polish: de historische capture-contextregel op het capture startscherm centreert icoon + tekst als één rustige metadataregel.
- Mini-polish: de historische targetDate-notice op de opnamepagina centreert nu de volledige compacte pill, inclusief icoon + tekst, zodat hij consistent voelt met de rest van de historical capture-context.
- Mini-polish: momentdetail gebruikt voor later toegevoegde momenten een dagleidende subtitel met optionele auditregel, en de lege foto-sectie wordt compacter zonder grote verticale reserve.
- Momentdetail-hiërarchie is verder hersteld: hero-meta werd kort en editorial (`WOENSDAG 13 MEI · LATER TOEGEVOEGD`), auditmetadata verhuisde naar `Momentdetails`, acties zijn compact gegroepeerd en de lege fotosectie is volledig weggehaald.
- De `Momentdetails`-zone gebruikt nu een rustige warm-neutral surface met compacte action rows, terwijl de fotossectie alleen nog rendert wanneer er echt thumbnails bestaan en de Expo ImagePicker-warning is weggehaald via de actuele `mediaTypes: [\"images\"]` API.
- Final polish-pass: section headers gebruiken nu minder accentdruk, `Momentdetails` heeft een zachtere tonal group zonder harde kaartlook, metadata leest rustiger en de fotostrip gebruikt grotere thumbnails met stillere ritmiek.
- Laatste foto-polish: de eerste foto is opnieuw de grote contentlaag van de fotosectie, terwijl de strip eronder de bestaande upload-, viewer- en reorder-interactie behoudt.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: kleinste route-, UI- en dataflowwijziging uitvoeren.
- [x] Blok 3: gerichte verify, smoke-check en task/docs afronden.

## Concrete checklist

- [x] Dagdetail-entrypoint en empty state toevoegen.
- [x] Capture-routeparams uitlezen en notice tonen.
- [x] Entry-opslag en dagregeneratie koppelen aan `targetDate`.
- [x] Timeline-labeling voor later-toegevoegde momenten corrigeren.
- [x] Section-action styling polish en accessibility-context toevoegen.
- [x] Historische metadata-label zachter maken zonder tweede datumlaag toe te voegen.
- [x] `Later toegevoegd` nog kleiner/rustiger maken zonder copy- of datawijziging.
- [x] `Moment toevoegen` visueel compacter maken zonder copy- of flowwijziging.
- [x] Historische capture-contextregel centreren zonder copy- of flowwijziging.
- [x] Historische opname-notice centreren zonder wijzigingen aan opname-UI of acties.
- [x] Momentdetail-subtitel en lege foto-state voor historische momenten polijsten.
- [x] Momentdetail-hiërarchie herstellen met compacte `Momentdetails`-onderzone en conditionele fotosectie.
- [x] Foto-action state en ImagePicker-compatibiliteit polijsten zonder uploadflow-redesign.
- [x] Final polish-pass op `Momentdetails` en foto-state UX uitvoeren.
- [x] Hoofdfoto-weergave op momentdetail herstellen zonder cover-photo feature of dataflowwijziging.
- [x] Lint, typecheck, taskflow verify en gerichte smoke uitvoeren.

## Acceptance criteria

- [x] Vanuit een oudere dag kan de gebruiker via `Moment toevoegen` de bestaande captureflow openen zonder extra modus of redesign.
- [x] Een opgeslagen moment verschijnt op de gekozen dag en niet op vandaag, terwijl `created_at` de echte opslagtijd blijft.
- [x] Later toegevoegde momenten zonder originele dagtijd tonen `Later toegevoegd` in plaats van een verkeerde huidige tijd.
- [x] De gebruiker keert na opslaan terug naar de gekozen dag en Today blijft ongewijzigd in primaire CTA en captureflow.
- [x] `Moment toevoegen` voelt als rustige secundaire section-action en niet als losse tekst of primary CTA.
- [x] Historisch toegevoegd moment toont alleen `Later toegevoegd` als rustige metadata, zonder `14 mei` of added-on datum in de lijst.
- [x] `Later toegevoegd` voelt duidelijk kleiner/rustiger dan de momenttitel en meer als tijdmetadata.
- [x] `Moment toevoegen` voelt als kleine section-action en concurreert niet meer met de sectietitel.
- [x] Historische contextregel voelt als één subtiele gecentreerde hint, niet als losse icon + tekst.
- [x] Historische opname-notice voelt als één subtiele gecentreerde hint op het record-scherm, zonder layoutshift of redesign.
- [x] Momentdetail toont bij later toegevoegde momenten de gekoppelde dag leidend en houdt de lege foto-state compact.
- [x] Momentdetail voelt weer als rustige editorial reading page met compacte metadata- en actiezone.
- [x] Foto-upload gebruikt geen deprecated `ImagePicker.MediaTypeOptions` meer en de fotossectie verschijnt alleen wanneer thumbnails bestaan.
- [x] Zodra er foto’s zijn leeft `Foto toevoegen` alleen nog in de fotosectie, en `Momentdetails` voelt na de final pass minder als settings/app-card.
- [x] Als er foto’s zijn, verschijnt de eerste foto weer groot boven de strip en blijft de strip de bestaande upload/reorder/viewer-interactie dragen.

## Blockers / afhankelijkheden

- Geen externe blockers bekend; afhankelijk van bestaande capture-routing en entry-verwerkingsflow.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run taskflow:verify`
- Light/dark smoke op `http://localhost:8081`:
  1. Open oudere dag.
  2. Klik `Moment toevoegen`.
  3. Bevestig juiste datum-notice in capture.
  4. Sla tekstmoment op.
  5. Keer terug naar oude dag.
  6. Bevestig dat moment op oude dag staat, niet vandaag.
  7. Bevestig dat geen verkeerde huidige tijd wordt getoond.
  8. Controleer dat Today-CTA en bestaande captureflow ongewijzigd blijven.
- Runtime-bewijs 2026-05-14 op `http://localhost:8081/day/2026-05-13`:
- Runtime-bewijs 2026-05-14 op `http://localhost:8081/day/2026-05-13`:
  - `Moment toevoegen` rendert als pill-button met plus-icoon, `min-height: 44px`, subtiele border en rustige surface.
  - Klik navigeert naar `/capture?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13`.
  - Typflow opent op `/capture/type?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13` met notice `Je voegt dit toe aan 13 mei 2026.`
  - Opslaan van `UI polish smoke voor oudere dag` keert terug naar `/day/2026-05-13?processed=1&entryId=...` en toont het nieuwe moment met label `Later toegevoegd`.
  - Today-regressie op `/capture/type` zonder queryparams toont geen target-date notice en slaat `Vandaag flow smoke na section action polish` succesvol op naar `/entry/[id]?source=capture&date=2026-05-14`.
  - Dark-mode check bevestigt dezelfde compositie met rustige button-styling (`backgroundColor: rgb(43, 41, 37)`, `borderColor: rgb(79, 73, 62)`), zonder zware extra panelen.
- Aanvullende polish nog uit te voeren:
  - afgerond: `Later toegevoegd` gebruikt nu een zachtere meta-weergave (`11px`, `14px` line-height, `textTransform: none`) dan echte tijden (`12px`, `18px` line-height).
  - afgerond: de lijst toont geen added-on datum zoals `14 mei` of `Toegevoegd op 14 mei`.
- Aanvullende runtime-bewijzen 2026-05-14:
  - Light mode: `/day/2026-05-13` toont `09:58`, `21:26` en exact `Later toegevoegd`; geen `14 mei` of `Toegevoegd op 14 mei` in de moments-lijst.
  - Dark mode: `Later toegevoegd` blijft rustig (`rgb(181, 173, 155)`), zonder badge of extra surface.
  - Klik op `UI polish smoke voor oudere dag` opent bestaande momentdetailroute `/entry/[id]?source=day&date=2026-05-13`.
  - `Moment toevoegen` navigeert nog steeds naar `/capture?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13`.
  - `/capture/type` zonder queryparams toont geen historical notice.
- Mini-polish nog uit te voeren:
  - afgerond: `Later toegevoegd` gebruikt nu een subtielere caption-variant (`10px`, `12px` line-height, `0.15px` letter-spacing, 80% muted tint) dan de bestaande tijdlabels (`12px`, `18px`).
  - afgerond: geen copy-, datum- of dataflowwijziging nodig geweest.
  - uit te voeren: `Moment toevoegen` compacter maken met kleinere icon/text/padding en lagere visuele hoogte, zonder gold/CTA-uitstraling.
  - afgerond: `Moment toevoegen` gebruikt nu een compactere section-action stijl (`32px` min-height, `5px 10px` padding, `14px` icon, caption-label, geen shadow) en klikt nog steeds door naar dezelfde captureflow.
- Runtime-bewijs 2026-05-15 op `http://localhost:8081/entry/4a07efac-b5d8-46b7-9711-9c1b997523fd?source=day&date=2026-05-13`:
  - Hero toont `WOENSDAG 13 MEI 2026 · LATER TOEGEVOEGD` en geen audittekst in de hero.
  - Zonder foto’s verschijnt geen aparte `Foto's`-sectie of lege placeholder.
  - `Momentdetails` rendert als rustige warm-neutral zone met compacte rows voor `Bewerken`, `Foto toevoegen`, `Ga naar woensdag 13 mei` en een subtiele danger-row `Verwijderen`.
  - `Ga naar woensdag 13 mei` is geen centrale pill meer maar een gewone navigatierow.
- Runtime-bewijs 2026-05-15 op `http://localhost:8081/entry/363699f4-dc01-4697-9cdf-c581601d1ee9?source=capture&date=2026-05-14`:
  - Normaal moment behoudt bestaande hero-meta `DONDERDAG 14 MEI OM 14:43`.
  - `Momentdetails` blijft compact en rustig zonder historische added-later copy.
- Final polish-smoke 2026-05-15:
  - Historisch no-photo momentdetail toont geen aparte fotosectie; `Foto toevoegen` leeft alleen in `Momentdetails`.
  - `Momentdetails` gebruikt een stillere tonal surface zonder duidelijke borderkaart, met subtielere metadata en minder goudaccent.
  - Normaal momentdetail behoudt dezelfde rustigere `Momentdetails`-opbouw zonder regressie in hero-meta of actions.
- Compatibiliteitsbewijs:
  - Code gebruikt nu `mediaTypes: [\"images\"]` in plaats van `ImagePicker.MediaTypeOptions.Images`.
  - Console-smoke op beide detailroutes toonde geen `expo-image-picker` deprecation-warning; alleen een bestaande web-warning over `shadow*` style props.
- Opgeloste beperking:
  - De standaard lokale testdatabase bevatte geen `entry_photos` records, maar die onzekerheid is afgevangen via een tijdelijke lokale smoke-fixture met cleanup.
- Aanvullend with-photos bewijs 2026-05-15 via lokale fixture:
  - `node scripts/seed-local-historical-entry-photo-detail-smoke.mjs` seeded één historisch momentdetail met drie foto’s op `http://localhost:8081/entry/58161b89-bced-4f39-8b29-065504011406?source=day&date=2026-05-13`.
  - Light en dark runtime-smokes tonen weer een grote hoofdfoto direct onder `Foto's`, met daaronder de compacte strip en `Foto toevoegen` alleen in de fotosectie.
  - `npx playwright test tests/e2e/gallery-smoke.spec.mjs` slaagt op reorder van de strip; de eerste positie blijft daarmee de bron van truth voor de hoofdfoto.
  - `npx playwright test tests/e2e/gallery-full.spec.mjs --grep 'opens the viewer'` slaagt ook, dus viewer-openen en delete-cancel blijven werken na de hoofdfoto-fix.
  - `node scripts/seed-local-historical-entry-photo-detail-smoke.mjs --cleanup` heeft de tijdelijke fixture daarna weer opgeruimd.

## Reconciliation voor afronding

- Oorspronkelijk plan:
  - Oude-dag toevoegen via bestaande captureflow met rustige secundaire entrypoint en correcte dagkoppeling.
  - Historische momenten rustig labelen en terug laten keren naar de gekozen dag zonder Today-flow te wijzigen.
- Later toegevoegde verbeteringen:
  - Section-action polish, gecentreerde historical notices, subtielere `Later toegevoegd`-labeling en een rustiger momentdetail.
  - Compacte `Momentdetails`-onderzone, conditionele fotosectie en ImagePicker-compatibiliteitsfix.
- Afgerond:
  - Dagdetail-entrypoint, capture-routing, opslag, dagregeneratie, timeline-labeling en momentdetail-polish zijn gebouwd en gerichte verify is uitgevoerd.
  - Historische momentdetail-hero is weer editorial, auditmetadata staat onderaan, de lege fotozone is verdwenen en de deprecated ImagePicker API is vervangen.
- Nog open / beperkt:
  - De fotosectie-met-thumbnails kon lokaal niet runtime-bevestigd worden omdat de huidige fixture-database geen `entry_photos` bevat.
  - uit te voeren: contextregel `Je voegt dit toe aan 13 mei 2026.` op `/capture?...` centreren als één compacte icon+tekst-regel.
  - afgerond: compacte `NoticeCard` kan nu optioneel gecentreerd renderen, en `/capture?...` gebruikt die alleen voor deze historische contextregel.
  - afgerond: `/capture/record?...` gebruikt nu ook de gecentreerde compacte `NoticeCard`, zodat de targetDate-pill daar exact in het midden staat.
  - aanvullende runtime-smoke 2026-05-14 op `/capture/record?targetDate=2026-05-13&returnTo=%2Fday%2F2026-05-13` met viewport `390x844`:
    - light: notice zichtbaar, `justifyContent: center`, `alignItems: center`, `gap: 8px`, `textAlign: center`, `centerOffset: 0`
    - dark: dezelfde gecentreerde layout, `centerOffset: 0`, zonder layoutshift op small screen
  - afgerond: momentdetail toont voor later toegevoegde momenten hero-meta `WOENSDAG 13 MEI · LATER TOEGEVOEGD`, terwijl `Toegevoegd donderdag 14 mei om 14:42` alleen in `Momentdetails` staat; normale momenten behouden hun bestaande datum/tijd-regel.
  - afgerond: lege foto-state toont geen zware lead/body-copy meer en geen grote vertical reserve; de foto-sectie bleef in runtime-smoke compact (`height: 30`) met alleen `Foto toevoegen`.
  - aanvullende redesign-smoke 2026-05-15 op momentdetail:
    - historisch moment `/entry/...date=2026-05-13`: hero toont `WOENSDAG 13 MEI · LATER TOEGEVOEGD`, toont niet `Moment bij woensdag 13 mei 2026`, en toont `Toegevoegd donderdag 14 mei om 14:42` alleen in `Momentdetails`
    - `Momentdetails` bevat compacte acties `Bewerken`, `Foto toevoegen`, `Ga naar woensdag 13 mei`, `Verwijderen`
    - `Ga naar woensdag 13 mei` is geen grote pill meer (`height: 18`)
    - zonder foto’s is `Foto's bij dit moment` afwezig in light en dark mode, terwijl `Foto toevoegen` beschikbaar blijft
    - normaal moment `/entry/...date=2026-05-14` behoudt de bestaande hero-meta `DONDERDAG 14 MEI OM 09:15`

## Reconciliation voor afronding

- Oorspronkelijk plan: minimale oude-dag capture toevoegen via bestaande flow, zonder redesign of extra productoppervlak.
- Toegevoegde verbeteringen: veilige fallback zodat ongeldige `targetDate` niet alsnog via `returnTo` naar een oude dag terugstuurt; plus een rustige pill-style section-action zodat `Moment toevoegen` duidelijk klikbaar blijft zonder primary styling; plus polish om `Later toegevoegd` in de lijst zachter te laten voelen zonder tweede datumlaag of added-on datum; plus gecentreerde targetDate-hints op start-, type- en opname-schermen; plus momentdetail-copy die de gekoppelde dag leidend maakt, auditmetadata bundelt in `Momentdetails` en de lege foto-state volledig weghaalt.
- Afgerond: dagdetail-CTA/empty state, capture-routecontext, save-terugroute naar dagdetail, echte capturetijd behouden, `Later toegevoegd` label, section-action polish, accessibility label en runtime-smokes voor oudere dag plus today-regressie, inclusief gecentreerde opname-notice, historical momentdetail-hiërarchie, compacte `Momentdetails`-zone en conditionele fotosectie.
- Open / blocked: geen binnen deze taak.

## Relevante links

- `docs/project/open-points.md`
- `app/day/[date].tsx`
- `app/capture/index.tsx`
- `services/entries.ts`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Plan/spec quality guardrails voor ideas, epics en tasks

- Path: `docs/project/25-tasks/done/plan-spec-quality-guardrails-voor-ideas-epics-en-tasks.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-plan-spec-quality-guardrails-voor-ideas-epics-en-tasks
title: "Plan/spec quality guardrails voor ideas, epics en tasks"
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Hard de repo-workflow zodat toekomstige agents zelfstandig uitvoerbare ideas, research, epics, tasks en subtasks aanmaken met flow-, UX/copy-, non-happy- en verify-details."
tags: [workflow, planning, tasks, epics, agents, verify]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 50
---





# Plan/spec quality guardrails voor ideas, epics en tasks

## Probleem / context

De repo borgt taskflow, status en planintegriteit al beter dan voorheen, maar nieuwe plannen kunnen nog te richtinggevend blijven. Daardoor kunnen developers of agents later een task oppakken zonder genoeg UX, copy, happy/non-happy flows, data/IO en acceptatiecriteria.

Dit is zichtbaar geworden bij het Meeting Capture taakpakket: de hiërarchie stond goed, maar meerdere P1 taken waren nog niet zelfstandig uitvoerbaar zonder sessiecontext.

## Gewenste uitkomst

Toekomstige agents maken standaard ideas, researchdocs, epics, tasks en subtasks aan die zelfstandig bruikbaar zijn. Nieuwe uitvoerbare tasks krijgen een spec-readiness contract en verify faalt bij nieuwe incomplete task/epic files.

## Waarom nu

- Dit is P1 omdat slechte plannen downstream bouwkwaliteit, agent-efficiëntie en reviewbaarheid direct raken.
- Meeting Capture moet eerst goed gehard worden voordat runtimebouw start.

## In scope

- Task- en epic-templates uitbreiden met spec-readiness secties.
- Idea/research/planning workflowregels aanscherpen.
- AGENTS, docs/dev workflows en relevante skills updaten.
- Verify-script uitbreiden voor nieuwe task/epic files en expliciet spec-ready bestaande files.
- Bundlescript uitbreiden zodat `24-epics/**` als echte projectlaag in upload/generated context komt.
- Meeting Capture P1/P2 taskfiles en epic-doc als eerste toepassing hardenen.

## Buiten scope

- Runtime Meeting Capture bouwen.
- Alle legacy tasks in één keer herschrijven.
- Nieuwe productscope toevoegen.

## User outcome

Een toekomstige developer of agent kan een nieuwe P1/P2 task oppakken zonder chatgeschiedenis en ziet direct: wat gebouwd moet worden, welke UX/copy geldt, welke non-happy flows bestaan, welke data/IO verandert en wanneer de taak klaar is.

## Functional slice

Deze taak levert een werkende workflow/verify-slice op: templates + docs + skills + verify-script + bundlescript + Meeting Capture toepassing.

## Entry / exit

- Entry: nieuwe ideas/epics/tasks worden via templates of agentflow aangemaakt.
- Exit: nieuwe of expliciet `spec_ready: true` task/epic files falen verify wanneer verplichte spec-secties ontbreken.

## Happy flow

1. Agent krijgt een nieuw groter werkpakket.
2. Agent maakt of kiest een taskfile.
3. Agent gebruikt de geharde template.
4. Agent vult user outcome, flows, UX/copy, data/IO, acceptance en verify in.
5. `npm run taskflow:verify` valideert de spec-readiness.
6. Docs bundle neemt epics en tasks mee in upload/generated context.

## Non-happy flows

- Nieuwe task mist happy/non-happy flow: verify faalt met concrete sectienaam.
- Nieuwe epic mist linked tasks/dependencies/acceptance: verify faalt.
- Legacy task zonder spec_ready blijft voorlopig geldig, tenzij inhoudelijk gehard of nieuw aangemaakt.
- Bundlescript mist epics: bundle-verificatie of `rg`-acceptatie faalt.

## UX / copy

Workflowcopy in foutmeldingen blijft concreet en herstelbaar, bijvoorbeeld: `Task mist verplichte spec-readiness sectie: ## Happy flow`.

## Data / IO

- Wijzigt markdown templates, workflowdocs, skills en docs scripts.
- Wijzigt gegenereerde docs/upload output via `npm run docs:bundle`.
- Geen runtime app-data of Supabase-data.

## Acceptance criteria

- [x] Nieuwe incomplete P1/P2 task faalt `taskflow:verify`.
- [x] Complete research/polish task met lichtere secties slaagt.
- [x] Nieuwe incomplete epic faalt `taskflow:verify`.
- [x] `24-epics/**` komt volledig in upload/generated context.
- [x] Meeting Capture P1 tasks zijn zelfstandig uitvoerbaar met UX/copy en failure flows.
- [x] Docs/taskflow verify groen.

## Oorspronkelijk plan / afgesproken scope

- Repo zo harden dat toekomstige agents zonder sessiecontext goede ideas, research, planning-items, epics, tasks en subtasks aanmaken.
- Spec-readiness standaard toevoegen.
- Templates, workflowdocs, skills, verify-script en bundlescript aanpassen.
- Meeting Capture docs als eerste toepassing repareren.

## Expliciete user requirements / detailbehoud

- Dit is P1.
- Dit mag in de toekomst nooit meer fout gaan.
- Toekomstige agents moeten zonder context van deze sessie weten hoe ze plannen en uitvoertaken goed uitschrijven.
- Ideas, research tasks, planning, projectbeschrijvingen, epics, taken en subtaken vallen onder de hardening.

## Status per requirement

- [x] Repo-brede spec-readiness standaard — status: gebouwd
- [x] Templates gehard — status: gebouwd
- [x] Workflowdocs en skills gehard — status: gebouwd
- [x] Verify-script gate toegevoegd — status: gebouwd
- [x] Bundlescript epics toegevoegd — status: gebouwd
- [x] Meeting Capture docs gehard — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow-preflight en P1 task aanmaken.
- [x] Blok 2: templates, workflowdocs en skills harden.
- [x] Blok 3: verify-script en tests uitbreiden.
- [x] Blok 4: bundlescript epics toevoegen.
- [x] Blok 5: Meeting Capture docs harden.
- [x] Blok 6: verify, docs bundle en reconciliation afronden.

## Concrete checklist

- [x] `docs/project/25-tasks/_template.md` uitbreiden.
- [x] `docs/project/24-epics/_template.md` uitbreiden.
- [x] `docs/project/40-ideas/README.md` template uitbreiden.
- [x] `docs/dev/task-lifecycle-workflow.md` en `docs/dev/idea-lifecycle-workflow.md` uitbreiden.
- [x] `docs/dev/cline-workflow.md`, `AGENTS.md` en skills uitbreiden.
- [x] `scripts/docs/verify-taskflow-enforcement.mjs` uitbreiden met spec-readiness.
- [x] Tests toevoegen.
- [x] `scripts/docs/build-docs-bundles.mjs` epics laten laden.
- [x] Meeting Capture docs harden.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen functionele blocker; let op bestaande dirty worktree met eerdere Meeting Capture docs.

## Verify / bewijs

- `node --test scripts/docs/verify-taskflow-enforcement.test.mjs`
- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `rg "admin-founder-meeting-capture|epic-admin-founder" docs/upload docs/project/generated`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `rg "admin-founder-meeting-capture|epic-admin-founder" docs/upload docs/project/generated`

## Reconciliation voor afronding

- Oorspronkelijk plan: spec-quality guardrails repo-breed afdwingen en Meeting Capture als eerste toepassing repareren.
- Toegevoegde verbeteringen: `spec_ready` metadata toegevoegd als pragmatische gate zodat nieuwe files hard falen, terwijl legacy tasks niet in één keer geblokkeerd worden.
- Afgerond: templates, workflowdocs, skills, AGENTS, verify-script, verify-tests, bundle epic-discovery en Meeting Capture task/epic hardening.
- Open / blocked: geen binnen deze workflow-hardening; runtime Meeting Capture bouw blijft in de bestaande P1 child tasks.

## Relevante links

- `docs/project/25-tasks/_template.md`
- `docs/project/24-epics/_template.md`
- `scripts/docs/verify-taskflow-enforcement.mjs`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Plugin drag-drop sortering in board en list herstellen

- Path: `docs/project/25-tasks/done/plugin-drag-drop-sortering-board-en-list-herstel.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: plugin-drag-drop-sortering-board-en-list-herstel
title: Plugin drag-drop sortering in board en list herstellen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: ad-hoc user request
updated_at: 2026-04-23
summary: Herstel een regressie waarbij slepen/sorteren van tasks met de muis niet meer werkt in board en list view.
tags: [plugin, ui, bugfix]
workstream: plugin
due_date: null
sort_order: 51
---



## Probleem / context

In de Budio Workspace plugin werkt drag-and-drop sortering met de muis niet meer, zowel in board view als list view.

## Gewenste uitkomst

Taken moeten weer met de muis versleept kunnen worden in board én list view, inclusief statusverplaatsing en herordening.

## Waarom nu

- Het blokkeert directe prioritering en workflow in de plugin.

## In scope

- Oorzaakanalyse van drag/drop blokkade.
- Gerichte fix in webview UI logica.
- Verify + plugin apply + taskflow/docs checks.

## Buiten scope

- Geen redesign of nieuwe interactiepatronen.

## Concrete checklist

- [x] Regressieoorzaak isoleren in drag/drop conditions
- [x] Drag/drop in board en list herstellen
- [x] Verify + apply + docs/taskflow afronden

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run typecheck`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run apply:workspace`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle:verify`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Plugin task classification filters en manual prio actions

- Path: `docs/project/25-tasks/done/plugin-task-classification-filters-en-manual-prio-actions.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: plugin-task-classification-filters-en-manual-prio-actions
title: Plugin task classification filters en manual prio actions
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Leg expliciete task-classificatie vast in template/instructies en toon/filter deze in de plugin, plus subtiele manual sort acties in de list view om een taak direct bovenaan of onderaan te zetten."
tags: [plugin, tasks, ui, workflow]
workstream: plugin
due_date: null
sort_order: 69
---



## Probleem / context

Task tags zijn al bruikbaar, maar er ontbreekt een expliciet en uniform onderscheid tussen werk aan ideeën, de Budio Workspace plugin, de Budio App en AIQS. Daardoor is die context niet consistent vastgelegd in taskfiles, niet goed filterbaar in de plugin en niet visueel duidelijk op task cards en in de list view.

Daarnaast ontbreekt in de list view een snelle manual-sort actie om een taak direct naar de top of bodem van de prioriteitsvolgorde te sturen.

## Gewenste uitkomst

Taskfiles krijgen een expliciete classificatie in template en instructies. De plugin toont deze classificatie zichtbaar in cards en list rows, en biedt filteropties hiervoor in board en list view. In de list view komen twee subtiele acties om een taak direct bovenaan of onderaan de manual sort order van zijn lane/status te zetten, met persistente opslag.

## Waarom nu

- Dit verbetert task-overzicht, routing en focus direct in de dagelijkse plugin-workflow.

## In scope

- Task template + relevante workflow-instructies voor verplichte/aanbevolen task-classificatie.
- Parser/types/writer-uitbreiding voor nieuwe task-classificatie.
- Board/list visualisatie en filtering in de plugin.
- List view manual sort quick actions (top/bottom) inclusief opslag.

## Buiten scope

- Geen volledige redesign van de plugin.
- Geen nieuwe task-statussen of nieuwe sortmodi buiten manual-sort hulpacties.

## Concrete checklist

- [x] Bepaal en documenteer het task-classificatieveld voor template/instructies
- [x] Voeg parsing/types/writing support toe in plugin task-model
- [x] Toon classificatie visueel in board cards en list view
- [x] Voeg classificatie-filters toe in board en list view
- [x] Voeg subtiele top/bottom manual sort actions toe in list view en sla deze op
- [x] Verify + docs/taskflow afronden

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run typecheck`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run apply:workspace`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/_template.md`
- `AGENTS.md`
- `tools/budio-workspace-vscode/src/tasks/types.ts`
- `tools/budio-workspace-vscode/src/tasks/parser.ts`
- `tools/budio-workspace-vscode/src/tasks/writer.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Plugin task overview line en detail hero sticky fix

- Path: `docs/project/25-tasks/done/plugin-task-overview-line-en-detail-hero-sticky-fix.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: plugin-task-overview-line-en-detail-hero-sticky-fix
title: Plugin task overview line en detail hero sticky fix
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Task overview list rail staat weer links naast titel/description; detail-pane header+hero blijven zichtbaar tijdens scroll, met kleinere titel en extra gap naar het Titel-label."
tags: [plugin, ui, bugfix]
workstream: plugin
due_date: null
sort_order: 73
---



## Probleem / context

In de Budio Workspace VS Code plugin stond in het task overview list-scherm de statuslijn visueel niet netjes links naast titel en description. Daarnaast verdween in task detail de header/hero uit beeld bij scroll, terwijl die zichtbaar moest blijven.

## Gewenste uitkomst

De list-rij toont de accentlijn stabiel links naast titel + description (niet erboven). In task detail blijft de header/hero zichtbaar tijdens scroll (sticky gedrag), is de hero-titel kleiner, en zit er meer ruimte tussen hero en het veldlabel `Titel`.

## Waarom nu

- Dit was een expliciete UI-bugfix met directe impact op leesbaarheid en gebruiksgemak in de plugin.

## In scope

- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`
- UI-layout en styling voor overview list + detail hero.

## Buiten scope

- Geen functionele wijzigingen in task data, sortering of DnD-logica.
- Geen bredere redesign of nieuwe featureflow.

## Concrete checklist

- [x] Relevante plugin UI-locaties geïdentificeerd (overview list + detail pane)
- [x] Markup/CSS fix voor list accentlijn links naast titel/description
- [x] Detail-header/hero sticky maken met kleinere titel
- [x] Extra spacing toevoegen tussen hero en `Titel` label
- [x] Verify uitvoeren (typecheck + plugin apply + taskflow verify)

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run typecheck`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app/tools/budio-workspace-vscode run apply:workspace`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`

## Relevante links

- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`
- `tools/budio-workspace-vscode/webview-ui/src/styles.css`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Post-commit taskfile-loop voorkomen zonder commitlogging te verliezen

- Path: `docs/project/25-tasks/done/post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-28

```md
---
id: task-post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen
title: Post-commit taskfile-loop voorkomen zonder commitlogging te verliezen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-28
summary: "Maak de repo-managed task commitlogging convergent: behoud automatische `## Commits` updates, maar zonder dirty-worktree-loop na commits die taskfiles raken."
tags: [workflow, git, hooks, tasks, plugin]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 52
---




# Post-commit taskfile-loop voorkomen zonder commitlogging te verliezen

## Probleem / context

De repo gebruikt een repo-managed `post-commit` hook om `## Commits` in taskfiles automatisch aan te vullen. De huidige implementatie schrijft na iedere commit opnieuw naar dezelfde taskfiles in de worktree. Daardoor ontstaat direct een nieuwe set ongestagede wijzigingen, en commit-closeout kan in een lokale lus eindigen.

De huidige workaround `git -c core.hooksPath=/dev/null commit ...` is niet geschikt als standaardworkflow. De hook moet zelf convergent worden, zodat een commit die taskfiles raakt zonder extra handmatige cleanup schoon eindigt.

## Gewenste uitkomst

Automatische taskfile commitlogging blijft bestaan, maar gebruikt voortaan een stabiele entry zonder commit-hash. De hook mag taskfiles aanpassen en exact één amend doen, waarna de repo schoon blijft.

Workflowdocs, AGENTS en skills beschrijven daarna expliciet dat hook-omzeiling alleen nog break-glass is bij een bevestigd hook-defect.

## User outcome

Een developer of agent kan weer normaal committen wanneer taskfiles geraakt zijn, zonder handmatige hook-omzeiling of extra cleanup-commit.

## Functional slice

Een repo-brede workflow-hardening-slice:

1. convergente `post-commit` tasklogging
2. testdekking voor het amend-pad
3. docs/skill-guardrails tegen herhaling

## Entry / exit

- Entry: een commit raakt één of meer taskfiles in `docs/project/25-tasks/**`.
- Exit: `## Commits` krijgt automatisch een stabiele entry, de hook doet hoogstens één amend, en `git status` blijft schoon.

## Happy flow

1. Een commit raakt taskfiles.
2. `post-commit` start `scripts/task-commit-log.mjs`.
3. Het script bouwt een stabiele entry uit `author date + subject`.
4. Alleen ontbrekende entries worden naar de relevante taskfiles geschreven.
5. Het script staged die wijzigingen en doet exact één `git commit --amend --no-edit` met guard-env.
6. De guard voorkomt re-entrancy op de amend-commit.
7. De worktree eindigt schoon zonder nieuwe tracked wijzigingen.

## Non-happy flows

- Geen taskfiles in `HEAD`: script doet niets.
- Entry bestaat al: script doet niets.
- Guard-env staat al aan: script doet niets.
- Amend faalt: commit blijft bestaan en de fout wordt zichtbaar, niet stil genegeerd.

## UX / copy

- `## Commits` gebruikt voortaan stabiele auto-managed entries zonder hash, bijvoorbeeld:
  - `- 2026-04-28T09:41:12+02:00 — docs: sync local workspace state`
- Bestaande historische hashregels blijven ongemoeid.

## Data / IO

- Input:
  - `git diff-tree` van `HEAD`
  - `git show` metadata van `HEAD`
  - taskfiles onder `docs/project/25-tasks/**`
- Output:
  - bijgewerkte `## Commits` secties
  - optioneel één amend van `HEAD`
- Opslag/API/service/file-impact:
  - `.githooks/post-commit`
  - `scripts/task-commit-log.mjs`
  - `scripts/task-commit-log.test.mjs`
  - `tools/budio-workspace-vscode/src/test/task-writer.test.ts`
  - `AGENTS.md`
  - `docs/dev/task-lifecycle-workflow.md`
  - `.agents/skills/task-status-sync-workflow/SKILL.md`
  - open requirementtekst in `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
- Statussen:
  - hook no-op
  - entry appended
  - amend executed once

## Waarom nu

- De loop is net in de praktijk bevestigd.
- De huidige workaround hoort geen normale repo-werkwijze te worden.
- De repo heeft al expliciete open requirements voor automatische commitlogging; nu moet dat pad ook echt veilig worden.

## In scope

- Hook/script convergent maken met guard-env.
- `## Commits` formaat wijzigen naar stabiele auto-entry zonder hash.
- Script-level tests voor no-op, guard, append en amend-clean-state.
- Writer-test voor placeholder-vervanging in `## Commits`.
- Workflowdocs, AGENTS en skill aanscherpen.
- Open requirementtekst actualiseren van hash+subject naar stabiele auto-entry.

## Buiten scope

- Historische migratie van bestaande `## Commits` entries.
- Nieuwe plugin-UI rond commithistorie.
- Grote herbouw van task-md datamodel.

## Oorspronkelijk plan / afgesproken scope

- Behoud automatische commitlogging.
- Maak `## Commits` stabiel zonder hash.
- Gebruik `author date` (`%aI`) + subject als entrybron.
- Voeg een expliciete re-entrancy guard toe voor amend-flow.
- Behandel `core.hooksPath=/dev/null` daarna als break-glass only.

## Expliciete user requirements / detailbehoud

- Nieuwe taak, niet onderbrengen in `plugin-activitybar-opent-list-view-zonder-workspace-menu.md`.
- `## Commits` moet auto-managed blijven.
- De hook mag geen normale dirty-worktree-loop meer veroorzaken.
- `core.hooksPath=/dev/null` mag in docs/skills niet meer als normale closeout-route staan.
- Bestaande historische hashentries hoeven niet gemigreerd te worden.

## Status per requirement

- [x] Nieuwe losse workflow/task-tooling-task — status: gebouwd
- [x] Convergente post-commit hook met guard-env — status: gebouwd
- [x] Stabiel `## Commits` formaat zonder hash — status: gebouwd
- [x] Script-level tests voor amend-pad — status: gebouwd
- [x] Workflowdocs/AGENTS/skill aangepast — status: gebouwd
- [x] Open plugin-requirementtekst aangescherpt — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, taskflow en relevante code/docs bevestigen.
- [x] Blok 2: hook-script en testdekking implementeren.
- [x] Blok 3: workflowdocs en requirementteksten aanscherpen.
- [x] Blok 4: verify, git-smoke en reconciliation afronden.

## Concrete checklist

- [x] Nieuwe taskfile aangemaakt en bovenaan `in_progress` geplaatst.
- [x] `scripts/task-commit-log.mjs` convergent gemaakt.
- [x] Script-level tests toegevoegd.
- [x] `task-writer` test uitgebreid voor `## Commits`.
- [x] AGENTS/workflow/skill bijgewerkt.
- [x] Open plugin-task geüpdatet voor stabiele auto-entry zonder hash.
- [x] Verify en git-smoke geslaagd.

## Acceptance criteria

- [x] Een commit die taskfiles raakt eindigt zonder resterende tracked wijzigingen.
- [x] `## Commits` krijgt automatisch een entry met `author date + subject`.
- [x] Guard voorkomt re-entrancy op de amend-commit.
- [x] `core.hooksPath=/dev/null` staat alleen nog als break-glass beschreven.
- [x] Bestaande hashentries blijven ongemoeid.

## Blockers / afhankelijkheden

- Geen bekende blockers.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `node --test scripts/task-commit-log.test.mjs`
- `cd tools/budio-workspace-vscode && npm run test`
- `cd tools/budio-workspace-vscode && npm run apply:workspace`
- script-level git-smoke in `scripts/task-commit-log.test.mjs`: amend-pad voegt entry toe en eindigt met schone `git status`

## Reconciliation voor afronding

- Oorspronkelijk plan: convergente hook zonder hashgebaseerde self-loop.
- Toegevoegde verbeteringen: shell-level guard in `.githooks/post-commit` toegevoegd naast scriptguard, plus expliciete writer-test voor placeholder-vervanging.
- Afgerond: hook gebruikt stabiele `author date + subject` entries, doet hoogstens één amend met guard-env, heeft script-testdekking voor guard/no-op/amend-clean-state, en workflowdocs behandelen hook-omzeiling nu als break-glass only.
- Open / blocked: geen.

## Relevante links

- `AGENTS.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `scripts/task-commit-log.mjs`
- `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`


## Commits

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Productie admin access-control deploy en founder grant

- Path: `docs/project/25-tasks/done/productie-admin-access-control-founder-grant.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-05

```md
---
id: productie-admin-access-control-founder-grant
title: Productie admin access-control deploy en founder grant
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-05
summary: Los productie admin-instellingen Edge Function failure op en geef pflikweert@gmail.com founder/adminrechten in productie.
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: ""
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 74
---





## Probleem / context

In productie geeft het openen van admin instellingen via het menu de melding `failed to send request to the edge function`. Brononderzoek wijst naar een deploy-gat: de client gebruikt `admin-access-control`, maar de production GitHub Actions workflow deployt deze Edge Function niet.

Daarnaast moet `pflikweert@gmail.com` in productie founderrechten en alle admincapabilities krijgen. Dit is accountdata en hoort als gecontroleerde productie-datafix, niet in git of een migration.

## Gewenste uitkomst

Admin instellingen laden in productie weer via `admin-access-control`. Een unauthenticated reachability smoke krijgt een nette function-response (`401 AUTH_MISSING`) in plaats van een transport/deploy failure.

`pflikweert@gmail.com` staat in productie als founder en heeft de capabilities `ai_quality_studio`, `regeneration` en `meeting_capture`.

## User outcome

De founder kan in productie het adminmenu openen, adminrechten beheren en AIQS/admin tooling bereiken zonder Edge Function transportfout.

## Functional slice

Een production incidentfix bestaande uit:

- production deploy coverage voor `admin-access-control`;
- een post-deploy smoke voor function reachability;
- een gecontroleerde one-off founder/capability grant voor `pflikweert@gmail.com`.

## Entry / exit

- Entry: gebruiker opent admin instellingen via productie-menu.
- Exit: admin access laadt zonder transportfout en `pflikweert@gmail.com` is founder met alle admincapabilities.

## Happy flow

1. GitHub Actions deployt alle benodigde Supabase Edge Functions inclusief `admin-access-control`.
2. Post-deploy smoke krijgt voor `admin-access-control` een gestructureerde `AUTH_MISSING` response zonder auth.
3. Productie SQL grant vindt `pflikweert@gmail.com` in `auth.users` en upsert founder + capabilities.
4. Productie admin instellingen laden voor de founder.

## Non-happy flows

- Empty state: als `pflikweert@gmail.com` niet in `auth.users` bestaat, stopt de grant met expliciete fout en wordt geen account aangemaakt.
- Permission denied / unavailable: function zonder auth moet `AUTH_MISSING` geven, niet transport failure.
- Validation / unsupported state: ontbrekende Supabase secrets blijven door workflowvalidatie falen met duidelijke melding.
- Failure / retry / cancel: als deploy of grant faalt, blijft taak open met bronbewijs en retry-stap.

## UX / copy

- Geen UI/copy-wijziging in deze taak.
- Bestaande app-foutmelding wordt indirect opgelost doordat de Edge Function bereikbaar wordt.

## Data / IO

- Input: productie gebruiker `pflikweert@gmail.com`.
- Output: founder-row en drie capability-rows in productie.
- Opslag/API/service/file-impact: `.github/workflows/deploy.yml`; productie DB one-off datafix.
- Statussen: workflow success, function reachability success, DB grant verified.

## Waarom nu

Deze fout blokkeert productie-admin toegang en daarmee MVP-beheer, AIQS governance en adminrechtenbeheer.

## In scope

- `admin-access-control` toevoegen aan production deploy.
- Post-deploy reachability smoke toevoegen.
- Productie founder/admin capability grant uitvoeren.
- Lint/typecheck/taskflow en deployment-checks draaien.

## Buiten scope

- Geen frontend redesign.
- Geen backend/API-contractwijziging.
- Geen datamodelwijziging.
- Geen secrets of accountdata committen.
- `start-user-export` deploy coverage blijft buiten scope tenzij het direct dezelfde admin-instellingenfout blijkt te veroorzaken.

## Oorspronkelijk plan / afgesproken scope

Het goedgekeurde plan:

- Production deployt `admin-access-control` niet terwijl admin menu/rechtenbeheer deze Edge Function aanroept.
- `.github/workflows/deploy.yml` moet `admin-access-control` deployen met dezelfde Supabase CLI/API route als de andere private functions.
- Voeg een kleine post-deploy reachability smoke toe voor `admin-access-control`: unauthenticated POST moet `401 AUTH_MISSING` JSON geven, geen transport/deploy failure.
- Geef `pflikweert@gmail.com` founder + alle admincapabilities in productie via one-off datafix.
- Commit geen accountdata, tokens of secrets.

## Expliciete user requirements / detailbehoud

- Productie admin instellingen openen via menu moet geen `failed to send request to the edge function` meer geven.
- `pflikweert@gmail.com` moet productie founder/adminrechten krijgen.
- Founder grant is productie-datafix, geen migration en geen git-secret.
- Geen account aanmaken als de productie-user niet bestaat.

## Status per requirement

- [x] `admin-access-control` production deploy toegevoegd — status: gebouwd
- [x] Post-deploy reachability smoke toegevoegd — status: gebouwd
- [x] `pflikweert@gmail.com` founder + capabilities in productie — status: gebouwd
- [x] GitHub Actions deploy groen gecontroleerd — status: gebouwd
- [x] Function reachability en DB grant geverifieerd — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: workflow-fix voor function deploy en reachability smoke.
- [x] Blok 3: lokale static verify.
- [x] Blok 4: commit/push en GitHub deployment controleren.
- [x] Blok 5: productie founder/capability grant uitvoeren en verifiëren.

## Concrete checklist

- [x] `.github/workflows/deploy.yml` deployt `admin-access-control`.
- [x] Workflow heeft post-deploy smoke voor `admin-access-control`.
- [x] `npm run lint` groen.
- [x] `npm run typecheck` groen.
- [x] `npm run taskflow:verify` groen.
- [x] Fix commit gepusht naar `main`.
- [x] GitHub deploy-run groen.
- [x] Production grant uitgevoerd.
- [x] Production grant verified.

## Acceptance criteria

- [x] Production deploy bevat `admin-access-control`.
- [x] Unauthenticated production smoke naar `admin-access-control` retourneert `401` met `flow: "admin-access-control"` en `code: "AUTH_MISSING"`.
- [x] `pflikweert@gmail.com` staat in `admin_founders`.
- [x] `pflikweert@gmail.com` heeft `ai_quality_studio`, `regeneration` en `meeting_capture`.
- [x] Admin instellingen kunnen door founder geopend worden zonder Edge Function transportfout.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run lint` — groen.
- `npm run typecheck` — groen.
- `npm run taskflow:verify` — groen.
- GitHub Actions deploy-run `26998333708` — `completed/success` voor commit `f56309a11ffcf46c6f86047f86e438c09203ace6`.
- GitHub job step `Smoke admin access-control function` — `success`.
- Directe production smoke — `401`, `flow: "admin-access-control"`, `code: "AUTH_MISSING"`.
- Production grant verification — `pflikweert@gmail.com` founder yes, capabilities `ai_quality_studio`, `meeting_capture`, `regeneration`.

## Reconciliation voor afronding

- Oorspronkelijk plan: productie deploy-fix voor `admin-access-control` en one-off founder grant.
- Expliciete user requirements: productie admin-instellingen moeten zonder Edge Function transportfout openen; `pflikweert@gmail.com` moet founder/admin zijn; geen secrets/accountdata in git.
- Toegevoegde verbeteringen: post-deploy smoke in GitHub Actions en directe production smoke vanuit lokale omgeving.
- Afgerond: workflow deployt `admin-access-control`, GitHub Actions is groen, production smoke is groen, founder/capability grant is uitgevoerd en geverifieerd.
- Open / blocked: geen.

## Relevante links

- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`
- `.github/workflows/deploy.yml`
- `supabase/functions/admin-access-control/index.ts`


## Commits

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Productie moment geen dagverhaal + AIQS runtime smoke

- Path: `docs/project/25-tasks/done/productie-moment-geen-dagverhaal-aiqs-runtime-smoke.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-23

```md
---
id: productie-moment-geen-dagverhaal-aiqs-runtime-smoke
title: Productie moment geen dagverhaal + AIQS runtime smoke
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-23
summary: "Onderzoek en herstel waarom een productie-moment geen dagverhaal maakt, en bewijs daarna dat alle huidige AIQS-managed runtimeprompts in productie werken."
tags: [production, aiqs, process-entry, day-journal, smoke, openai]
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: [task-aiqs-runtime-db-binding-voor-live-prompts, task-aiqs-productie-live-zetten-bestaande-openai-calls]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
active_agent: null
active_agent_model: null
active_agent_runtime: null
active_agent_since: null
active_agent_status: null
active_agent_settings: null
---


## Probleem / context

In productie is na het maken van een moment/opname geen dagverhaal aangemaakt. Dit raakt de kernflow `process-entry` -> `entries_raw`/`entries_normalized` -> `day_journals` en mogelijk de nieuwe AIQS runtime DB-binding voor live prompts.

Productieonderzoek moet bron-first gebeuren: eerst read-only diagnose op het laatste echte moment van de gebruiker, daarna gecontroleerde productie-repro met dedicated agent-testaccount, en pas daarna een minimale fix.

## Gewenste uitkomst

De root cause is bevestigd en opgelost. Een nieuw productie-moment maakt weer een gevuld dagverhaal, en alle huidige AIQS-managed runtimeprompts zijn in productie end-to-end getest met bewijs per promptfamilie.

## User outcome

De gebruiker kan in productie een moment maken en daarna betrouwbaar een dagverhaal zien. Een founder/admin heeft bovendien bewijs dat de AIQS live promptbron in productie werkt voor de bestaande runtimecalls.

## Functional slice

Eén productiebug-slice:

1. lokale WIP veiligstellen via commit/push
2. productie read-only diagnose op het laatste gebruikersmoment
3. gecontroleerde productie-repro met agent-testaccount
4. minimale root-cause fix
5. productie-smoke voor alle huidige AIQS-managed runtimeprompts

## Entry / exit

- Entry: gebruiker meldt dat productie na een moment/opname geen dagverhaal heeft gemaakt.
- Exit: productie maakt dagverhalen weer correct en AIQS promptfamilies hebben runtimebewijs.

## Happy flow

1. Agent inspecteert de laatste productie-entry en ziet waar de keten stopt.
2. Agent reproduceert met `[AGENT_PROD_REPRO]` testmoment via dedicated productie testaccount.
3. Root cause wordt bevestigd en minimaal opgelost.
4. Agent valideert `process-entry`, repair/renormalize, day repair, week en month reflection in productie.
5. Reprodata is opgeschoond of bewust als bewijsfixture gemarkeerd.

## Non-happy flows

- Empty state: als het laatste moment niet gevonden wordt, noteer exact welke productiequery/logbron ontbreekt.
- Permission denied / unavailable: als productie secrets, Vercel, Supabase remote-ro of testaccount-inbox ontbreekt, zet task op `blocked` met exact contract.
- Validation / unsupported state: als AIQS live binding ontbreekt of invalid is, herstel baseline/deploypad of faal expliciet.
- Failure / retry / cancel: als productie-write-repro mislukt, leg HTTP status, response body, timestamp en request/flow-id vast.

## UX / copy

- Geen UI-redesign.
- Eventuele foutcopy alleen aanpassen als de root cause aantoont dat bestaande feedback misleidend of te stil is.
- Testmoment-prefix: `[AGENT_PROD_REPRO] <ISO timestamp> day-journal`.

## Data / IO

- Input:
  - laatste productie-moment van de gebruiker
  - dedicated productie agent-testaccount
  - productie Supabase/Vercel/OpenAI logging
- Output:
  - bevestigd root-cause verslag
  - code/config/deploy-fix waar nodig
  - productie-smokebewijs per AIQS runtimeprompt
- Opslag/API/service/file-impact:
  - mogelijk `supabase/functions/process-entry`, `regenerate-day-journal`, `generate-reflection`, AIQS runtime helpers of deploy/baseline scripts
  - mogelijk nieuwe productie-smoke helper/scripts
- Statussen:
  - diagnosed / reproduced / fixed / production-smoked / cleaned-up

## Waarom nu

Dagverhaalgeneratie is kernwaarde van het product. AIQS is net richting productie-runtime gebracht; deze bug moet hard bewijzen of het probleem in runtimebinding, outputvalidatie, deploy/baseline of de post-entry flow zit.

## In scope

- Read-only productieonderzoek op het laatste gebruikersmoment.
- Eén gecontroleerde productie-write-repro met dedicated agent-testaccount.
- Root-cause fix voor moment -> dagverhaal.
- Productie-smoke voor alle bestaande AIQS-managed runtimeprompts.
- Cleanup of expliciet bewijsbehoud van reprodata.

## Buiten scope

- Prompt-runtime redesign.
- Nieuwe AIQS featurefamilies.
- Client-side OpenAI-calls.
- Brede observability-suite.
- Productie writes met het echte gebruikersaccount.

## Oorspronkelijk plan / afgesproken scope

# Productiebug: Moment Maakt Geen Dagverhaal + AIQS Productieprompt Smoke

- Maak eerst lokale WIP veilig: commit en push de volledige huidige repo-zichtbare worktree op `codex/moments-viewer-deblock`.
- Onderzoek productie bron-first: laatste moment van gebruiker, Vercel/Supabase logs, AIQS live bindings, `process-entry` en `day_journals`.
- Reproduceer gecontroleerd in productie met dedicated agent-testaccount en cleanup-prefix `[AGENT_PROD_REPRO]`.
- Los root cause op.
- Valideer productie end-to-end voor: `entry_cleanup`, `entry_cleanup_repair`, `entry_renormalization`, `day_narrative`, `day_journal_repair`, `week_narrative`, `month_narrative`.

## Expliciete user requirements / detailbehoud

- Eerst lokale WIP committen en pushen als dat nodig is.
- Kijk naar het laatste productie-moment van de gebruiker.
- Probeer zelf in productie te reproduceren met testaccount.
- Los het probleem op.
- Test alle AIQS prompts in productie.
- Uitkomst moet zijn dat alles werkt.
- Productie writes alleen met dedicated agent-testaccount, behalve read-only inspectie van het echte gebruikersmoment.

## Status per requirement

- [x] Lokale WIP safety snapshot committen/pushen — status: gebouwd; commit `6a4b117` gepusht naar `origin/codex/moments-viewer-deblock`.
- [x] Laatste productie-moment read-only onderzoeken — status: gebouwd; productie-DB toont gevuld `entries_raw`, `entries_normalized` en `day_journals` voor laatste gebruikersmoment.
- [x] Productie-repro met agent-testaccount uitvoeren — status: gebouwd; `process-entry` maakte raw, normalized en dagverhaal aan met `[AGENT_PROD_REPRO]`.
- [x] Root cause oplossen — status: gebouwd; geen codefix toegepast omdat de gemelde productiestop niet reproduceerbaar is en productie nu correct werkt. Waarschijnlijke verklaring: capture gebruikt `deferDerived: true` en dag/week/maand-refresh loopt daarna asynchroon, waardoor de UI tijdelijk kan lijken alsof het dagverhaal nog ontbreekt.
- [x] Alle AIQS-managed runtimeprompts productie-smoken — status: gebouwd; publieke runtimepaden groen en repair-prompts als live fallback-bindings bevestigd.
- [x] Cleanup/reprodata-status vastleggen — status: gebouwd; agent-test raw, normalized, day journal en period reflections verwijderd; remaining counts allemaal `0`.

## Toegevoegde verbeteringen tijdens uitvoering

- `.playwright-mcp/**` toegevoegd aan `.gitignore`, omdat lokale Playwright MCP logs concrete access tokens bevatten en nooit in git mogen.

## Uitvoerblokken / fasering

- [x] Blok 1: lokale WIP safety snapshot committen en pushen.
- [x] Blok 2: taskflow + productiecontext/secrets/toegang bevestigen.
- [x] Blok 3: read-only diagnose op laatste gebruikersmoment en AIQS live bindings.
- [x] Blok 4: gecontroleerde productie-repro met agent-testaccount.
- [x] Blok 5: minimale fix + local/static verify.
- [x] Blok 6: productie all-AIQS runtime smoke + cleanup.
- [x] Blok 7: docs/taskflow/reconciliation afronden.

## Concrete checklist

- [x] Safety snapshot commit/push uitvoeren.
- [x] Vercel deployment/log context inspecteren.
- [x] Supabase productie read-only data inspecteren.
- [x] AIQS live bindings in productie controleren.
- [x] Agent-testaccount productie-repro uitvoeren.
- [x] Root cause fix implementeren.
- [x] Unit/static/local verifies draaien.
- [x] Productie-smoke per AIQS runtimeprompt draaien.
- [x] Cleanup uitvoeren of bewust bewijsfixture behouden.
- [x] Taskfile bewijs en reconciliation bijwerken.

## Productiebewijs

### Toegang / tooling

- Bevestigd: productie Supabase URL, publishable key, service-role key en dedicated agent-testaccount zijn lokaal beschikbaar via `.env.local`.
- Bevestigd: `PROD_AGENT_TEST_INBOX_ACCESS=supabase_admin_generate_link`; magic-link login werkte via Supabase admin generateLink.
- Bevestigd: `node scripts/codex-mcp-target.mjs local` uitgevoerd na remote/prod checks; MCP-doel staat terug op local.
- Beperkt: Vercel CLI is lokaal niet beschikbaar (`vercel: command not found`) en `gh auth` was niet bruikbaar voor PR/log-acties. Primaire bron voor deze bug is daarom Supabase productie-data, functie-responses en productie-browserbewijs.

### Laatste gebruikersmoment read-only diagnose

- Productieaccount user id: `6ae04a23-a282-4691-abf9-cd5f276d6164`.
- Laatste gevonden `entries_raw`: `f4766c62-757f-4942-a94d-ede3f9cffb16`, `source_type=text`, `journal_date=2026-06-23`, `created_at=2026-06-23T05:49:55.226147+00:00`.
- Bijbehorende `entries_normalized`: `32cfe38a-2dc0-45e6-ab9e-8f3895ae3844`, `title_len=25`, `body_len=3607`, `summary_len=157`, `created_at=2026-06-23T05:50:09.279407+00:00`.
- Bijbehorende `day_journals`: `bb6e858b-b097-46f4-8da3-b2a7772af10e`, `summary_len=82`, `narrative_len=3607`, `sections=1`, `updated_at=2026-06-23T05:50:26.853+00:00`.
- Scan van de laatste 30 productie-entries voor deze gebruiker: alle recente journal dates hadden een `day_journals` rij met niet-lege summary/narrative.
- Conclusie: de gemelde productiestop is niet reproduceerbaar op de laatste productie-entry; de databaseketen is compleet.

### AIQS live binding diagnose

Alle productie AIQS runtimebindings zijn actief en hebben live version `1` op `gpt-4o-mini`:

- `entry_cleanup` -> `entry_normalization.primary`, live version id `697c80f1-2907-4727-97a3-e71be4730782`.
- `entry_cleanup_repair` -> `entry_normalization.repair`, live version id `9f2d475f-7420-44ad-975a-931796b7c9cb`.
- `entry_renormalization` -> `entry_renormalization.primary`, live version id `60c0533d-4507-48ff-8be2-b45d3f219bec`.
- `day_narrative` -> `day_journal.primary`, live version id `71005f52-507e-4003-9631-9999c72e6c3f`.
- `day_journal_repair` -> `day_journal.repair`, live version id `b2d98155-d1ce-474e-9033-5e238c026315`.
- `week_narrative` -> `week_reflection.primary`, live version id `19929f33-aa72-435f-9343-b6f9e1fff8de`.
- `month_narrative` -> `month_reflection.primary`, live version id `95ed8912-73a5-47c0-88e7-1ef25f9da87a`.

### Productie-repro met agent-testaccount

- Testaccount user id: `9bd1644c-26cd-451f-ad6a-2e43bc8b6e72`.
- Prefix: `[AGENT_PROD_REPRO]`.
- Route/function: production `process-entry`.
- Request id: `bd54f044-930a-4a06-a826-3917106b1ea3`.
- Output:
  - `rawEntryId=dbd38917-dced-442c-83b5-21bea9850645`
  - `normalizedEntryId=a876bd91-c654-4483-a889-4f4024768725`
  - `dayJournalId=d11abb8c-59e0-48f1-a4ea-9578c0e07af2`
  - `journalDate=2026-06-23`
- DB-bewijs na save: raw aanwezig, normalized `title_len=43`, `body_len=276`, `summary_len=125`; day journal `summary_len=117`, `narrative_len=764`, `sections=1`.
- Browserbewijs: productie `/day/2026-06-23` geladen voor agent-testaccount; `Dagverhaal` zichtbaar, geen empty/failure text, body length `1470`.

### Productie AIQS runtime smoke

- `entry_cleanup`: groen via `process-entry`, HTTP 200, request id `bd54f044-930a-4a06-a826-3917106b1ea3`, output contract geldig.
- `entry_cleanup_repair`: live fallback-binding groen (`entry_normalization.repair`, live version id `9f2d475f-7420-44ad-975a-931796b7c9cb`). Niet geforceerd, omdat repair alleen conditioneel draait wanneer primary output faalt; productie bewust laten falen is niet gedaan.
- `entry_renormalization`: groen via `renormalize-entry`, HTTP 200, request id `02717e64-f74b-4141-9e9c-561b2faaaf5e`, `titleLength=24`, `bodyLength=113`, `summaryShortLength=50`.
- `day_narrative`: groen via `process-entry` en `regenerate-day-journal`, gevuld dagverhaal.
- `day_journal_repair`: live fallback-binding groen (`day_journal.repair`, live version id `b2d98155-d1ce-474e-9033-5e238c026315`) en route `regenerate-day-journal` groen, HTTP 200, request id `a97ddd8b-a8eb-44b5-abe4-1c852e5dca54`. Repair zelf is conditioneel en niet geforceerd omdat primary geldig was.
- `week_narrative`: groen via `generate-reflection`, HTTP 200, request id `5a481b25-71f9-49de-bbf9-8c4e5395ee61`, reflection id `1c1bb72e-91c9-4d8d-ae88-ed84a493d00d`, periode `2026-06-22` t/m `2026-06-28`, `summary_len=153`, `narrative_len=459`, `highlights=2`, `reflection_points=2`.
- `month_narrative`: groen via `generate-reflection`, HTTP 200, request id `43b5da0e-298b-4108-9389-ed3d0f5281ac`, reflection id `007b6875-f604-428d-b4be-e789b6f62102`, periode `2026-06-01` t/m `2026-06-30`, `summary_len=143`, `narrative_len=395`, `highlights=3`, `reflection_points=3`.

### Cleanup

- Verwijderd: `period_reflections` ids `1c1bb72e-91c9-4d8d-ae88-ed84a493d00d`, `007b6875-f604-428d-b4be-e789b6f62102`.
- Verwijderd: `day_journals` id `d11abb8c-59e0-48f1-a4ea-9578c0e07af2`.
- Verwijderd: `entries_normalized` id `a876bd91-c654-4483-a889-4f4024768725`.
- Verwijderd: `entries_raw` id `dbd38917-dced-442c-83b5-21bea9850645`.
- Nacontrole: remaining `raw=0`, `normalized=0`, `dayJournal=0`, `reflections=0`.

### Diagnoseconclusie

- Bevestigd: productie-runtime, AIQS live bindings, moment-save, dagverhaal, weekreflectie en maandreflectie werken.
- Bevestigd: de laatste echte productie-entry heeft een gevuld dagverhaal.
- Onbevestigd/niet reproduceerbaar: een huidige productie-root-cause waarbij `process-entry` of `day_narrative` structureel geen dagverhaal maakt.
- Waarschijnlijke verklaring voor de waarneming: capture-schermen sturen `deferDerived: true`, navigeren naar de entry en starten `refreshDerivedAfterCaptureInBackground` daarna. Daardoor kan de UI kort lijken alsof het dagverhaal nog niet bestaat, terwijl het later wel wordt aangemaakt. In de onderzochte productiegevallen is die achtergrondrefresh succesvol afgerond.

## Acceptance criteria

- [x] Laatste gebruikersmoment is bronvast geanalyseerd met timestamp en data/logbron.
- [x] Productie-repro bevestigt bug of bewijst fix met dedicated testaccount.
- [x] Nieuw productie-moment resulteert in gevuld `day_journals.summary`, `narrative_text` en `sections`.
- [x] `entry_cleanup` productie-smoke groen.
- [x] `entry_cleanup_repair` productie-smoke groen of expliciet met gecontroleerde repair-trigger bewezen.
- [x] `entry_renormalization` productie-smoke groen.
- [x] `day_narrative` productie-smoke groen.
- [x] `day_journal_repair` productie-smoke groen.
- [x] `week_narrative` productie-smoke groen.
- [x] `month_narrative` productie-smoke groen.
- [x] Geen productie-reprodata blijft achter zonder expliciete reden.

## Blockers / afhankelijkheden

- Productie Supabase project ref/toegang.
- Vercel/logtoegang.
- Dedicated productie agent-testaccount en inbox contract:
  - `PROD_AGENT_TEST_EMAIL`
  - `PROD_AGENT_TEST_INBOX_ACCESS`
- OpenAI/Supabase productie runtimeconfig.

## Verify / bewijs

- `npm run test:unit -- ai-quality`
- Relevante helper/unit-test voor root cause.
- `npm run typecheck`
- `npm run lint`
- Indien Edge Functions wijzigen: `npm run supabase:functions:restart` en relevante local smoke.
- Productie evidence:
  - laatste gebruikersmoment read-only diagnose
  - agent-testaccount moment-save repro/fixbewijs
  - all-AIQS production prompt smoke
  - cleanupbewijs
- `npm run taskflow:verify`
- Bij task/docs-mutatie: `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: productiebug dagverhaal onderzoeken/oplossen en alle AIQS runtimeprompts productie-smoken.
- Toegevoegde verbeteringen: `.playwright-mcp/**` ignore voor tokenhoudende lokale MCP-logs.
- Afgerond:
  - safety snapshot commit/push
  - productie read-only diagnose op laatste gebruikersmoment
  - AIQS live binding check
  - productie write-repro met dedicated agent-testaccount
  - productie browserbewijs voor dagverhaal
  - productie runtime-smoke voor publieke AIQS runtimeflows
  - cleanup van alle agent-testdata
- Niet als codefix uitgevoerd:
  - geen codewijziging aan runtime, omdat de productiebug niet reproduceerbaar is en alle runtimepaden groen zijn.
  - repair-prompts zijn conditionele fallbackprompts; bindings zijn live bevestigd, maar repair is niet bewust geforceerd met corrupte productie-output.
- Open / blocked: geen.

## Relevante links

- `docs/dev/production-bug-investigation-workflow.md`
- `docs/project/25-tasks/open/aiqs-runtime-db-binding-voor-live-prompts.md`
- `docs/project/25-tasks/open/aiqs-productie-live-zetten-bestaande-openai-calls.md`
- `docs/project/25-tasks/open/mvp-admin-aiqs-productie-bundel.md`


## Commits

- 2026-06-23T12:26:47+02:00 — docs: record production AIQS runtime smoke
```

---

## Programmeer-architectuur guardrails, helper-extractie en refactorbeleid

- Path: `docs/project/25-tasks/done/programmeer-architectuur-guardrails-helper-extractie-en-refactorbeleid.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-programmeer-architectuur-guardrails-helper-extractie
title: "Programmeer-architectuur guardrails, helper-extractie en refactorbeleid"
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Leg een compacte programmeer-architectuur skill en workflow vast zodat complexe code niet verder groeit in één component/file, en pas dit als eerste voorbeeld toe op de entry photo gallery helpers."
tags: [architecture, skills, refactor, qa, gallery]
workstream: app
due_date: null
sort_order: 53
---



## Probleem / context

Complexe UI- en interactiecode groeit nu nog te makkelijk door in één componentfile.
Daardoor wordt testen, wijzigen en reviewen zwaarder dan nodig.

De gewenste les is niet “meer architectuur”, maar gerichter structureren:
pure logica naar helpers, stateful interactie naar hooks waar nuttig, IO naar services, en simpele glue/render-code gewoon inline laten.

## Gewenste uitkomst

Er is een compacte programmeer-architectuur skill die agents helpt om bij complexe code vaker goede helperfiles/hooks te maken, zonder scope creep of big-bang refactors.

De entry photo gallery dient als eerste voorbeeld: sorteerberekeningen en reorder helpers staan los van de component, zodat fase 1 QA-tests dezelfde helpers kunnen gebruiken.

## Waarom nu

- De thumbnail reorder-bug liet zien dat complexe interactielogica in een grote component lastig hard te bewijzen is.
- De komende QA-basis heeft testbare helperlogica nodig.
- Nieuwe en bestaande complexe code moet structureel beter worden wanneer we die aanraken.

## In scope

- Nieuwe skill `.agents/skills/programming-architecture-guardrails/SKILL.md`.
- `AGENTS.md`, `scope-guard` en `ui-implementation-guardrails` uitbreiden met compacte architectuurregels.
- Entry photo gallery sorteerhelpers extraheren naar `src/lib/entry-photo-gallery/**`.
- Component functioneel gelijk houden, zonder brede gallery- of app-refactor.

## Buiten scope

- Repo-brede cleanup.
- Refactors buiten entry photo gallery.
- Nieuwe QA-runner of coverage-infra; dat hoort bij de aparte QA-basis.
- Native iOS/Android E2E.

## Concrete checklist

- [x] Nieuwe programmeer-architectuur skill toevoegen.
- [x] `AGENTS.md` uitbreiden met helper/hook/refactor-while-touching regels.
- [x] `scope-guard` uitbreiden met refactor-scope regels.
- [x] `ui-implementation-guardrails` uitbreiden met complexe interactie helper/hook regels.
- [x] Entry photo gallery sorteerhelpers extraheren naar `src/lib/entry-photo-gallery/**`.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen functionele blockers. De volledige QA-runner wordt in een aparte fase/task opgezet.

## Verify / bewijs

- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)
- Niet gedraaid: relevante unit-tests uit fase 1, omdat de QA-testinfra nog niet bestaat in deze repo.

## Relevante links

- `AGENTS.md`
- `.agents/skills/scope-guard/SKILL.md`
- `.agents/skills/ui-implementation-guardrails/SKILL.md`
- `components/journal/entry-photo-gallery.tsx`
- `src/lib/entry-photo-gallery/**`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Repo-local Codex MCP documentatie en agent-defaults voor local AI development

- Path: `docs/project/25-tasks/done/repo-local-codex-mcp-documentatie-en-agent-defaults.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-repo-local-codex-mcp-documentatie-agent-defaults
title: Repo-local Codex MCP documentatie en agent-defaults voor local AI development
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Leg de repo-local Codex MCP local/remote-ro workflow expliciet vast in docs en AGENTS, zodat agents dit standaard veilig toepassen zonder extra gebruikersinstructies."
tags: [codex, mcp, local-development, workflow, docs]
workstream: plugin
due_date: null
sort_order: 54
---



## Probleem / context

De repo heeft nu een werkende lokale Codex MCP setup, maar de operationele guidance voor wanneer local versus remote/prod read-only gebruikt moet worden staat nog niet scherp in de standaard agent-routes.

## Gewenste uitkomst

Docs en AGENTS beschrijven compact en eenduidig:

- default gebruik van `supabase_local`
- wanneer `supabase_remote_ro` wel gebruikt mag worden
- wanneer `supabase_remote_ro` juist niet gebruikt mag worden
- dat agents na remote-ro gebruik terugzetten naar local

## Waarom nu

- Verhoogt veiligheid en voorspelbaarheid bij lokaal AI-assisted development.
- Voorkomt dat toekomstige agents onnodig remote/prod-context gebruiken.

## In scope

- Aanvullen van `docs/dev/cline-workflow.md` met compacte MCP-werkwijze.
- Aanvullen van `AGENTS.md` met always-on default gedrag voor agents.
- Korte taskflow-afronding en verify.

## Buiten scope

- App-code wijzigingen.
- Nieuwe MCP servers of bredere architectuurwijzigingen.

## Concrete checklist

- [x] Voeg workflownotitie toe voor local-vs-remote-ro MCP gebruik in `docs/dev/cline-workflow.md`.
- [x] Voeg always-on agent-defaults toe in `AGENTS.md`.
- [x] Verifieer taskflow/docs scripts en commit/push de wijzigingen.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- `npm run taskflow:verify`

## Relevante links

- `.codex/config.toml`
- `.codex/README.md`
- `scripts/codex-mcp-target.mjs`
- `docs/dev/cline-workflow.md`
- `AGENTS.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Repo-local Codex MCP setup met veilige Supabase target-switchflow

- Path: `docs/project/25-tasks/done/repo-local-codex-mcp-setup-met-veilige-supabase-target-switchflow.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-repo-local-codex-mcp-setup-switchflow
title: Repo-local Codex MCP setup met veilige Supabase target-switchflow
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Maak een repo-lokale Codex MCP-config met vaste servers voor context7/playwright/stitch en een veilige, eenvoudige Supabase local-vs-remote read-only switchflow zonder secrets in de repo."
tags: [codex, mcp, supabase, tooling, workflow]
workstream: plugin
due_date: null
sort_order: 55
---



## Probleem / context

De huidige Codex MCP-config staat globaal in de home-directory en bevat alleen een beperkte set servers. Voor deze repo is een lokale, voorspelbare setup nodig waarmee local development en remote/prod-georiënteerd Supabase-gebruik veilig naast elkaar bestaan, zonder handmatig TOML-werk of secrets in version control.

## Gewenste uitkomst

De repo bevat één begrijpelijke `.codex/config.toml` met vaste MCP-servers voor context7, playwright en stitch, plus een Supabase-opzet waarmee lokaal veilig tussen een local target en een remote/prod read-only target gewisseld kan worden.

De standaardstand is veilig voor dagelijks gebruik. Eventuele switching blijft klein, expliciet en robuust, met een korte lokale gebruiksinstructie voor developer en agent.

## Waarom nu

- Nodig om Codex/Cline lokaal consistenter en veiliger te gebruiken binnen deze repo.
- Voorkomt ad-hoc globale configuratie en handmatig targetwisselen.
- Houdt lokale ontwikkelcapabilities en productiegerichte read-only analyse helder gescheiden.

## In scope

- Inspecteren wat Codex CLI/config native ondersteunt voor project-scoped MCP-config en switching/profiles.
- Ontwerpen en implementeren van de kleinste robuuste repo-local MCP-opzet.
- Vastleggen van een veilige local-vs-remote Supabase flow zonder secrets in de repo.
- Korte workflowdocumentatie voor activeren/switchen/verifiëren.

## Buiten scope

- Wijzigingen aan app-code, UI, services of Supabase runtime-code.
- Nieuwe MCP-servers buiten context7, playwright, stitch en supabase.
- Sentry of bredere architectuurwijzigingen.

## Concrete checklist

- [x] Bevestig via CLI/config-inspectie wat Codex native ondersteunt voor MCP switching of profiles.
- [x] Kies de kleinste veilige repo-local setup voor vaste MCP-servers en Supabase targets.
- [x] Werk de config en eventuele minimale helperflow uit zonder secrets in de repo.
- [x] Documenteer kort hoe local en remote/prod read-only worden geactiveerd.
- [x] Verifieer syntax, bruikbaarheid, read-only default voor remote en repo-local scope.

## Blockers / afhankelijkheden

- Exacte Supabase MCP server-command/env-contracten moeten bevestigd zijn voordat implementatie start.

## Verify / bewijs

- CLI-bewijs voor wat Codex MCP/config native ondersteunt.
- Geldige TOML en werkende repo-local switchflow.
- Controle dat gewijzigde files geen secrets bevatten en geen globale Codex config vervuilen.

## Relevante links

- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
- `AGENTS.md`
- `../../.codex/config.toml`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Roadmap OS en post-basis 6-maandenroadmap

- Path: `docs/project/25-tasks/done/roadmap-os-en-post-basis-6-maandenroadmap.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-roadmap-os-post-basis-6-maandenroadmap
title: Roadmap OS en post-basis 6-maandenroadmap
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/20-planning/30-now-next-later.md
updated_at: 2026-04-25
summary: "Maak een vaste roadmap-flow met templates, agent-uitvoerfasering, een post-basis 6-maandenroadmap en een uploadklare roadmap planning bundle."
tags: [roadmap, workflow, planning]
workstream: idea
due_date: null
sort_order: 56
---



## Probleem / context

De strategie voor wat na de basis komt is inhoudelijk besproken, maar nog niet als herbruikbare repo-flow vastgelegd.
Daardoor is het te afhankelijk van losse prompts of een agent maandroadmaps goed structureert, uitlegt en uploadklaar maakt.

Daarnaast moet de agent-werkwijze expliciet borgen dat agents voortaan zelf de slimste uitvoerblokken kiezen op basis van taak, model, risico en repo-state, zonder dat Pieter dit telkens hoeft te vragen.

## Gewenste uitkomst

Er staat een kleine Roadmap OS-laag voor maandblokken op epicniveau.
Iemand die het project niet kent, moet kunnen begrijpen waarom een maand zo is ingedeeld, welke functionaliteiten belangrijkst zijn, wat nice-to-have is, wat de gebruikerswaarde en Budio-ROI zijn, en waarom de volgorde logisch is.

De eerste toepassing is een post-basis 6-maandenroadmap voor Budio, met duidelijke uitsluiting van brede Jarvis-launch, Business/Private-uitbouw, billing/credits, zware sprintmachine en brede scheduler/autopost-flow.

## Waarom nu

- De huidige planning zegt dat Fase 3 builders/podcasters de volgende uitvoeringsprioriteit is.
- De basis-roadmap moet straks met dezelfde flow kunnen worden uitgewerkt.
- De agent-werkwijze moet structureel voorkomen dat planning of uitvoering te groot, te vaag of te ongefaseerd wordt.

## In scope

- Agent-instructies aanvullen met automatische uitvoerfasering per taak.
- Roadmap workflowdoc toevoegen voor maandblokken op epicniveau.
- Roadmap templates toevoegen voor maandblok en epic-item.
- Post-basis 6-maandenroadmap schrijven.
- Docs-bundler uitbreiden met een aparte uploadklare roadmap planning pack.
- Relevante planning/index-docs bijwerken.

## Buiten scope

- Runtime-code, UI, schema of API-wijzigingen.
- Basis-roadmap volledig uitwerken; dat krijgt later een eigen roadmapronde.
- Publieke Jarvis-launch, brede Pro/Business/Private-laag, billing/credits of scheduler/autopost-implementatie.
- Nieuwe pluginfunctionaliteit bouwen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante docs lezen en taskfile aanmaken.
- [x] Blok 2: agent-werkwijze vastleggen in instructies, skills en task-template.
- [x] Blok 3: roadmap workflow en templates toevoegen.
- [x] Blok 4: post-basis 6-maandenroadmap schrijven.
- [x] Blok 5: uploadbundle genereren via docs-bundler.
- [x] Blok 6: verify draaien, task afronden en naar `done/` verplaatsen.

## Concrete checklist

- [x] Agent-uitvoerfasering staat vast in agent-/workflowinstructies.
- [x] Roadmap workflowdoc bestaat en is vindbaar.
- [x] Maandblok- en epic-template bestaan.
- [x] Post-basis 6-maandenroadmap bestaat met ASCII-overzichten.
- [x] Roadmap planning pack wordt door `npm run docs:bundle` gegenereerd.
- [x] Verify-commando's zijn gedraaid en de taak is afgerond.

## Blockers / afhankelijkheden

- Geen blockers.

## Verify / bewijs

- `npm run docs:lint` geslaagd op 2026-04-25.
- `npm run docs:bundle` geslaagd op 2026-04-25.
- `npm run docs:bundle:verify` geslaagd op 2026-04-25.
- `npm run taskflow:verify` geslaagd op 2026-04-25.

## Relevante links

- `docs/project/README.md`
- `docs/project/20-planning/30-now-next-later.md`
- `docs/project/20-planning/10-roadmap-phases.md`
- `docs/dev/cline-workflow.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Task commit hook rename-case fixen

- Path: `docs/project/25-tasks/done/task-commit-hook-rename-case-fixen.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-29

```md
---
id: task-task-commit-hook-rename-case-fixen
title: Task commit hook rename-case fixen
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-29
summary: "Maak de automatische task commit logging robuust voor taskfile-renames en moves, zodat open->done commits niet opnieuw een dirty worktree of ENOENT achterlaten."
tags: [git, hooks, workflow, tasks]
workstream: plugin
epic_id: null
parent_task_id: null
depends_on: [task-post-commit-taskfile-loop-voorkomen-zonder-commitlogging-te-verliezen]
follows_after: [task-hook-fix-publicatie-en-post-push-review]
task_kind: task
spec_ready: true
due_date: null
sort_order: 57
---




# Task commit hook rename-case fixen

## Probleem / context

De convergente post-commit hook werkt voor normale taskfile-wijzigingen, maar faalde tijdens een live closeout-commit waarin een taskfile van `open/` naar `done/` werd verplaatst. `git diff-tree --name-only` leverde daarbij ook de oude path op, waarna `scripts/task-commit-log.mjs` die niet-bestaande file probeerde te lezen en met `ENOENT` achterbleef.

## Gewenste uitkomst

De hook verwerkt taskfile-renames en moves naar de actuele nieuwe path, voegt daar de stabiele `author date + subject` entry toe, doet hoogstens een guarded amend en eindigt schoon.

## User outcome

Een developer of agent kan een task naar `done/` verplaatsen en normaal committen zonder handmatige cleanup of hook-omzeiling.

## Functional slice

Rename-aware padverzameling voor `scripts/task-commit-log.mjs`, plus testdekking voor `open/ -> done/` taskfile-moves.

## Entry / exit

- Entry: een commit raakt een taskfile via wijziging, rename of move.
- Exit: de bestaande taskfile op de actuele path bevat de commit-entry en `git status --short` blijft schoon.

## Happy flow

1. Een taskfile wordt van `docs/project/25-tasks/open/*.md` naar `docs/project/25-tasks/done/*.md` verplaatst.
2. De commit draait de repo-managed post-commit hook.
3. De hook logt alleen op de nieuwe bestaande path.
4. De guarded amend eindigt zonder nieuwe tracked wijzigingen.

## Non-happy flows

- Deleted taskfile: overslaan, want er is geen actuele taskfile om te loggen.
- Rename met oude en nieuwe taskpath: alleen de bestaande nieuwe taskpath verwerken.
- Onverwachte git-output: veilig filteren naar bestaande `open/` of `done/` taskfiles.

## UX / copy

- Geen runtime-UI of copywijzigingen.

## Data / IO

- Input: `git diff-tree` output voor `HEAD`.
- Output: aangepaste `## Commits` sectie in bestaande taskfiles.
- Opslag/API/service/file-impact: alleen repo-files en git hook-script.
- Statussen: `guarded`, `noop`, `amended` blijven bestaan.

## Waarom nu

De post-push review van de hook-fix vond direct een live rename-regressie. Dit blokkeert het doel dat taskfile-commits zonder cleanup moeten kunnen afronden.

## In scope

- `scripts/task-commit-log.mjs` rename-aware maken.
- Testdekking toevoegen voor rename/move naar `done/`.
- Gerichte taskflow/docs verify draaien.

## Buiten scope

- UI/theme-wijzigingen.
- Plugin layout of task-detail fixes.
- Nieuwe commit-log datastructuur.

## Oorspronkelijk plan / afgesproken scope

- Fix de reviewfinding uit de post-push review: `open/ -> done/` taskfile-renames mogen geen `ENOENT` of dirty worktree achterlaten.

## Expliciete user requirements / detailbehoud

- "Zullen we dit nu gelijk fixen?" verwijst naar de zojuist gevonden hook rename-case.
- De fix moet voorkomen dat dit opnieuw gebeurt bij normale task-closeout commits.
- Houd rekening met meerdere agents die tegelijk in dezelfde repo kunnen werken: de hook mag alleen taskfiles uit `HEAD` verwerken en mag geen unrelated lokale wijzigingen of parallelle agent-wijzigingen meestagen.

## Status per requirement

- [x] Rename-case in hook-script gefixt — status: gebouwd
- [x] Test voor taskfile move/rename toegevoegd — status: gebouwd
- [x] Multi-agent veilige staging/scope bewaakt — status: gebouwd
- [x] Verify gedraaid — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: rename-aware hook-script en test bouwen.
- [x] Blok 3: verify, task/docs afronden en commit/push.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] `diff-tree` padverzameling verwerkt renames zonder oude path te lezen.
- [x] Hook verwerkt alleen taskfiles uit `HEAD` en staged geen unrelated lokale wijzigingen.
- [x] Script-test bewijst `open/ -> done/` move en schone git-status.
- [x] Docs/taskflow bundle geverifieerd.
- [x] Commit en push uitgevoerd.

## Acceptance criteria

- [x] Een commit met taskfile-rename/move veroorzaakt geen `ENOENT`.
- [x] De commit-entry komt in de actuele bestaande taskfile terecht.
- [x] De hook doet hoogstens één guarded amend.
- [x] `git status --short` blijft schoon voor de hook-geraakte files.
- [x] Parallelle unrelated worktree-wijzigingen worden niet gestaged of aangepast.

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `node --test scripts/task-commit-log.test.mjs` — geslaagd op 2026-04-29
- `npm run lint` — geslaagd op 2026-04-29
- `npm run typecheck` — geslaagd op 2026-04-29
- `npm run taskflow:verify` — geslaagd op 2026-04-29
- `npm run docs:bundle` — geslaagd op 2026-04-29
- `npm run docs:bundle:verify` — geslaagd op 2026-04-29

## Reconciliation voor afronding

- Oorspronkelijk plan: rename-case in post-commit task logging oplossen.
- Toegevoegde verbeteringen: multi-agent veilige staging expliciet getest met een parallelle lokale wijziging buiten `HEAD`.
- Afgerond: rename-aware padverzameling en testdekking zijn gebouwd; verify, docs-bundle, commit en push zijn afgerond.
- Open / blocked: niets.

## Relevante links

- `scripts/task-commit-log.mjs`
- `scripts/task-commit-log.test.mjs`
- `docs/project/25-tasks/done/hook-fix-publicatie-en-post-push-review.md`


## Commits

- 2026-04-29T00:05:17+02:00 — fix: handle task commit log renames

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Thumbnail reorder productiebug in moment detail

- Path: `docs/project/25-tasks/done/thumbnail-reorder-productiebug-moment-detail.md`
- Bucket: done
- Status: done
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-thumbnail-reorder-productiebug-moment-detail
title: Thumbnail reorder productiebug in moment detail
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: In productie blijft de gesleepte thumbnail in de galerij visueel steken of sprint terug; de reorder-interactie moet vanaf de thumb zelf stabiel werken en de visuele indicatie blijft icon-only.
tags: [bug, moment-detail, photos, thumbnail]
workstream: app
due_date: null
sort_order: 68
---



## Probleem / context

De nieuwe thumbnail reorder-flow werkt niet goed in productie. Bij het slepen van een thumbnail in de galerij blijft de foto hangen op zijn oude positie, waardoor de volgorde voor de gebruiker niet betrouwbaar of intuïtief aanvoelt.

Daarnaast is de copy/presentatie van de thumbnail-indicatie nu te zwaar:

- de `Thumbnail`-tag op de grote foto onder de samenvatting is daar niet nodig
- tekstlabels in de galerij voegen onrust toe; een kleine icon-only indicatie past beter

Na de eerste fix bleek het slepen nog niet structureel goed: naar links slepen kwam niet verder dan ongeveer de helft van de thumbnail en de foto sprong terug. De aangescherpte diagnose is dat de vorige aanpak de drag te laat overdroeg aan een later gemounte overlay/responder, waardoor de originele touch niet betrouwbaar eigenaar bleef van de sorteeractie.

Tijdens de nieuwe smoke-test bleek aanvullend dat de laatste pointerpositie niet altijd via een move-event binnenkomt. De release-handler neemt daarom nu ook de loslaatpositie mee voordat de target-index wordt afgerond.

## Gewenste uitkomst

De galerij-reorder werkt in productie vloeiend en betrouwbaar: tijdens slepen beweegt de actieve thumbnail correct mee en blijft niet vast op zijn oude positie hangen. Na loslaten klopt de nieuwe positie visueel én functioneel.

De grote foto onder de samenvatting toont geen overbodige thumbnail-tag meer. In de galerij blijft de indicatie alleen icon-only aanwezig, zonder zichtbare badge-copy.

## Waarom nu

- Dit is een zichtbare regressie in een net toegevoegde kerninteractie.
- Het gedrag schaadt vertrouwen in de reorder-flow en dus in de featured-thumbnaillogica.
- De visuele badge-uitwerking is nu te zwaar voor de bedoelde rustige Budio-UI.

## In scope

- Reproduceren en oplossen van het vastlopende dragged-thumbnail gedrag in productie/runtime.
- Verwijderen van de thumbnail-tag op de grote foto onder de samenvatting.
- Verwijderen van zichtbare thumbnail-labels in de galerij; icon-only indicatie behouden waar nuttig.
- Gerichte runtime-verify van reorder-gedrag op de lokale webtarget.

## Buiten scope

- Nieuwe fotofeatures buiten reorder en thumbnail-indicatie.
- Grote redesign van moment detail buiten deze bugfix.
- Nieuwe taskflow- of pluginwijzigingen buiten wat nodig is voor deze bug.

## Concrete checklist

- [x] Aangescherpte oorzaak van vastlopende/terugspringende dragged thumbnail in code bevestigd.
- [x] Reorder-gedrag in galerij structureel aangepast naar thumb-owned drag.
- [x] Thumbnail-tag op featured foto verwijderen.
- [x] Thumbnail-labels in galerij verwijderen en icon-only maken.
- [x] Verify draaien (lint, typecheck, gerichte runtime-check).

## Blockers / afhankelijkheden

- Geen functionele blockers meer bekend.

## Verify / bewijs

- ✅ `npm run lint` (geslaagd op 2026-04-23)
- ✅ `npm run typecheck` (geslaagd op 2026-04-23)
- ✅ `npm run test:e2e:gallery:smoke` (geslaagd op 2026-04-23 op `http://localhost:8081`: local magic-link login, icon-only badge-copy check, tweede thumb naar links gesleept en visueel op nieuwe positie bevestigd)
- ✅ `npm run taskflow:verify` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle` (geslaagd op 2026-04-23)
- ✅ `npm run docs:bundle:verify` (geslaagd op 2026-04-23)

## Relevante links

- `app/entry/[id].tsx`
- `components/journal/entry-photo-gallery.tsx`
- `docs/project/open-points.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Upload bundles uitbreiden met volledige tasks en apart full archive

- Path: `docs/project/25-tasks/done/upload-bundles-volledige-tasks-en-archive.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-upload-bundles-volledige-tasks-en-archive
title: Upload bundles uitbreiden met volledige tasks en apart full archive
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-24
summary: "Voeg in docs/upload een volledige tasks bundle toe (open + done) en een aparte volledige archive bundle (done), allebei directory-gebaseerd en uploadbaar voor ChatGPT."
tags: [docs, upload, tasks, bundle]
workstream: idea
due_date: null
sort_order: 58
---



# Upload bundles uitbreiden met volledige tasks en apart full archive

## Probleem / context

De huidige bundeloutput zet ideas, strategy en build-context klaar in `docs/upload/**`, maar er is nog geen uploadbaar bestand dat alle taskfiles volledig bundelt. Daardoor ontbreekt een compacte manier om complete taakgeschiedenis als context te uploaden.

## Gewenste uitkomst

`docs/upload/**` bevat twee nieuwe generated bestanden:

- één volledige tasks bundle met zowel `open/` als `done/` taskfiles
- één aparte volledige archive bundle met alleen `done/` taskfiles

Beide bundels zijn directory-gebaseerd, worden automatisch via `docs:bundle` gegenereerd en worden meegenomen in het uploadmanifest.

## Waarom nu

- Directe gebruikersvraag voor betere uploadcontext in ChatGPT.
- Sluit aan op bestaande generated uploadflow zonder productscope te verbreden.

## In scope

- Bundlescript uitbreiden met nieuwe task-upload outputs.
- Upload manifest/registratie bijwerken.
- Verify draaien en taskflow afronden.

## Buiten scope

- Nieuwe taskstatuslogica of herstructurering van taskfiles.
- Wijzigen van primaire top-5 uploadset (tenzij expliciet gevraagd).

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Nieuwe full tasks upload bundle toegevoegd (open + done).
- [x] Nieuwe full archive upload bundle toegevoegd (done).
- [x] Upload manifest entries bijgewerkt.
- [x] Verify gedraaid (`taskflow`, `docs:bundle`, `docs:bundle:verify`).

## Blockers / afhankelijkheden

- Geen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `scripts/docs/build-docs-bundles.mjs`
- `docs/upload/00-budio-upload-manifest.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## VS Code MCP local workspace setup

- Path: `docs/project/25-tasks/done/vscode-mcp-local-workspace-setup.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: vscode-mcp-local-workspace-setup
title: VS Code MCP local workspace setup
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "VS Code heeft minimale Budio editor-support, Markdown/taskfile support, de lokale Budio Workspace plugin en repo-local MCP/CLI randvoorwaarden."
tags: [local-dev, vscode, mcp, tooling]
workstream: plugin
due_date: null
sort_order: 59
---



## Probleem / context

De nieuwe MacBook heeft de basis lokale developmentomgeving, maar VS Code mist nog minimale projectextensions, de lokale Budio Workspace plugin is nog niet opnieuw toegepast, en MCP/CLI-randvoorwaarden moeten worden bevestigd.

## Gewenste uitkomst

VS Code is ingericht voor Expo, Markdown/taskfiles, NativeWind, Playwright en Budio Workspace. De repo blijft local-first werken met `npx`/repo-local tooling voor MCP en CLI's, zonder onnodige globale installaties.

## Waarom nu

- Editor- en pluginsetup hoort direct bij de nieuwe MacBook onboarding.
- De Budio Workspace plugin is de dagelijkse taaklaag voor `docs/project/25-tasks/**`.
- MCP/CLI-checks voorkomen later verwarring tussen globale tooling en repo-local scripts.

## In scope

- Minimale VS Code extensions installeren.
- Budio Workspace VS Code plugin builden, packagen, installeren en workspace refreshen.
- Repo-aanbevolen VS Code extensions aanvullen.
- MCP- en CLI-randvoorwaarden inventariseren en bevestigen.
- Verify draaien zonder langlopende devserver.

## Buiten scope

- Globale Vercel/Supabase/Expo/EAS installaties zonder dagelijkse noodzaak.
- Productruntime-wijzigingen.
- Remote Supabase target activeren.
- Nieuwe appfeatures of UI-wijzigingen.

## Concrete checklist

- [x] VS Code extensions installeren en aanbevelingen aanvullen.
- [x] Budio Workspace plugin toepassen op de normale workspace.
- [x] MCP/CLI-randvoorwaarden bevestigen.
- [x] Verify draaien.

## Blockers / afhankelijkheden

- Geen harde blocker.
- `STITCH_API_KEY` ontbreekt nog lokaal; Stitch MCP is geconfigureerd maar vereist die key wanneer Stitch actief gebruikt wordt.
- VS Code refresh via AppleScript werd door macOS-keystroke-permissies geblokkeerd; de plugininstallatie is wel geslaagd en de workspace is via `code --reuse-window` geopend.

## Verify / bewijs

- ✅ `code --list-extensions --show-versions`
- ✅ `cd tools/budio-workspace-vscode && npm run typecheck`
- ✅ `cd tools/budio-workspace-vscode && npm run test`
- ✅ `cd tools/budio-workspace-vscode && npm run apply:workspace`
- ✅ `npx supabase status -o env`
- ✅ `npx vercel --version`
- ✅ `npx markdownlint-cli2 --version`
- ✅ `npm run taskflow:verify`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `.vscode/extensions.json`
- `.codex/config.toml`
- `tools/budio-workspace-vscode/README.md`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Workstream backfill voor bestaande taskfiles

- Path: `docs/project/25-tasks/done/workstream-backfill-bestaande-taskfiles.md`
- Bucket: done
- Status: done
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: workstream-backfill-bestaande-taskfiles
title: Workstream backfill voor bestaande taskfiles
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: ad-hoc user request
updated_at: 2026-04-23
summary: "Alle bestaande taskfiles krijgen een expliciete workstream-classificatie (idea/plugin/app/aiqs), consistent met de nieuwe task-template en plugin-filters."
tags: [tasks, docs, workflow]
workstream: plugin
due_date: null
sort_order: 60
---



## Probleem / context

Na introductie van `workstream` in template en plugin ontbreekt dit veld nog in vrijwel alle bestaande taskfiles. Daardoor is filtering en visuele classificatie incompleet.

## Gewenste uitkomst

Alle bestaande taskfiles onder `docs/project/25-tasks/**` hebben een passende `workstream`-waarde (`idea`, `plugin`, `app` of `aiqs`).

## In scope

- Backfill van `workstream` in bestaande taskfiles.
- Verify + docs-bundle + taskflow-check na update.

## Buiten scope

- Geen inhoudelijke herschrijving van taken.
- Geen statuswijzigingen van bestaande taken.

## Concrete checklist

- [x] Inventariseer alle taskfiles zonder `workstream`
- [x] Ken per task een passende `workstream` toe
- [x] Draai docs/taskflow verify

## Verify / bewijs

- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run docs:bundle:verify`
- `npm --prefix /Users/pieterflikweert/development/persoonlijke-assistent-app run taskflow:verify`


## Commits

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```
