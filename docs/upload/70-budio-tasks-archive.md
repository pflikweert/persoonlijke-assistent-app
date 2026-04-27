# DO NOT EDIT - GENERATED FILE

# Budio Tasks Archive

Build Timestamp (UTC): 2026-04-27T17:04:55.707Z
Source Commit: d6eeb0a

Doel: uploadbundle met gearchiveerde done-tasks uit `docs/project/25-tasks/done/**`.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Brondirectories
- docs/project/25-tasks/done/**

## Telling
- Totaal tasks opgenomen: 34

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
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
sort_order: null
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
sort_order: 1
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
sort_order: 1
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
title: docs:bundle en docs:bundle:verify race condition structureel voorkomen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Voorkom structureel dat docs:bundle en docs:bundle:verify tegelijk kunnen draaien door een harde script-lock en expliciete workflowguardrail toe te voegen."
tags: [workflow, docs, verify, locking]
workstream: plugin
due_date: null
sort_order: 1
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
title: Docs UX, audience-metadata en uploadbundels opschonen
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/README.md
updated_at: 2026-04-25
summary: "Maak de docs menselijker en duidelijker met audience-metadata, een portable Budio Terminal visual layer en maximaal 10 beheerde uploadbundels."
tags: [docs, upload, tooling, obsidian, markdown]
workstream: idea
due_date: null
sort_order: 1
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
title: Entry photo gallery QA-basis: unit, smoke en end-user tests
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-23
summary: "Zet een reproduceerbare QA-basis neer voor entry photo gallery: unit-tests voor sorteerhelpers, scripts voor smoke/full E2E en bewijsregels voor toekomstige gallery-wijzigingen."
tags: [qa, tests, gallery, photos, smoke]
workstream: app
due_date: null
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
sort_order: 3
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
sort_order: 1
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
sort_order: 3
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
sort_order: 1
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
title: Moment detail foto's toevoegen met beveiligde galerij (max 5)
status: done
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-22
summary: "Op de moment detailpagina een rustige fotoflow toevoegen: camera/upload, veilige opslag per user, featured thumbnail onder samenvatting (alleen bij foto), galerij onderaan, fullscreen swipe en verwijderen met bevestiging."
tags: [moment-detail, photos, security, ui]
workstream: app
due_date: null
sort_order: 2
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
sort_order: 3
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
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
summary: "Herstel een regressie waarbij slepen/sorteren van tasks met de muis niet meer werkt in board en list view."
tags: [plugin, ui, bugfix]
workstream: plugin
due_date: null
sort_order: 1
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
sort_order: 4
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
sort_order: null
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
title: Programmeer-architectuur guardrails, helper-extractie en refactorbeleid
status: done
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Leg een compacte programmeer-architectuur skill en workflow vast zodat complexe code niet verder groeit in één component/file, en pas dit als eerste voorbeeld toe op de entry photo gallery helpers."
tags: [architecture, skills, refactor, qa, gallery]
workstream: app
due_date: null
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
summary: "In productie blijft de gesleepte thumbnail in de galerij visueel steken of sprint terug; de reorder-interactie moet vanaf de thumb zelf stabiel werken en de visuele indicatie blijft icon-only."
tags: [bug, moment-detail, photos, thumbnail]
workstream: app
due_date: null
sort_order: 3
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
sort_order: 1
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
sort_order: 1
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
sort_order: 1
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
```
