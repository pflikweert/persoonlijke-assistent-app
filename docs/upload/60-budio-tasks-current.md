# DO NOT EDIT - GENERATED FILE

# Budio Current Tasks

Build Timestamp (UTC): 2026-07-15T09:33:16.288Z
Source Commit: 5a93b51

Doel: uploadbundle met huidige niet-done tasks uit `docs/project/25-tasks/open/**`.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Brondirectories
- docs/project/25-tasks/open/**

## Telling
- Totaal tasks opgenomen: 29

## Leesregel
- Dit is een uploadartefact en geen canonieke bron voor repo-uitvoering.
- Canonieke taskfiles blijven de bron in `docs/project/25-tasks/**`.

---

## 1.2B outputkwaliteit expliciteren en afronden

- Path: `docs/project/25-tasks/open/1-2b-outputkwaliteit-expliciteren-en-afronden.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-1-2b-outputkwaliteit
title: 1.2B outputkwaliteit expliciteren en afronden
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als voldoende goed geldt.
tags: [consumer-beta, outputkwaliteit]
workstream: app
due_date: null
sort_order: 4
---




















# 1.2B outputkwaliteit expliciteren en afronden

## Probleem / context

`current-status.md` markeert 1.2B als deels aanwezig.
De kwaliteitslaag bestaat functioneel, maar afrondcriteria en bewijsset zijn nog niet scherp genoeg vastgelegd.

## Gewenste uitkomst

Een expliciete kwaliteitsset voor outputkwaliteit die duidelijk maakt wat voor de huidige consumer beta als "voldoende goed" geldt.
De taak is klaar wanneer de criteria, verificatiestappen en bewijsregel helder genoeg zijn om 1.2B niet langer als impliciete restcategorie te laten hangen.

## Waarom nu

- Outputkwaliteit is een van de drie open gaten in de actieve transitiemaand.
- Zonder expliciete kwaliteitsset blijft releasebewijs te vaag.

## In scope

- Kwaliteitscriteria voor entry/day/reflection output aanscherpen.
- Verify- en bewijsverwachting expliciteren voor deze fase.
- Planning- en open-gap aansluiting bewaken.

## Buiten scope

- Brede Pro-outputformats of publicatiekanalen toevoegen.
- Nieuwe pricing-, usage- of control-plane laag activeren.

## Concrete checklist

- [ ] Kwaliteitscriteria voor huidige outputlaag uitschrijven.
- [ ] Verify- en bewijsverwachting per relevante flow expliciteren.
- [ ] Afrondcriterium voor 1.2B documentair vastleggen.

## Blockers / afhankelijkheden

- Afstemming met 1.2E beta-readiness zodat bewijsregels consistent blijven.

## Verify / bewijs

- Canonieke docs bijgewerkt.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/20-planning/20-active-phase.md`


## Commits

- 5a7e3e0 — docs: add service status backlog task

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## 1.2E beta-readiness expliciteren en afronden

- Path: `docs/project/25-tasks/open/1-2e-beta-readiness-expliciteren-en-afronden.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-1-2e-beta-readiness
title: 1.2E beta-readiness expliciteren en afronden
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft."
tags: [consumer-beta, beta-readiness]
workstream: app
due_date: null
sort_order: 12
---




























# 1.2E beta-readiness expliciteren en afronden

## Probleem / context

`current-status.md` markeert 1.2E als deels aanwezig.
De smoke-checklist bestaat al, maar volledige runtime-doorloop en bewijsstandaard zijn nog niet als afgeronde readiness set verankerd.

## Gewenste uitkomst

Een heldere beta-readiness set voor de huidige consumer beta, met expliciete checklist, bewijsregel en definitie van wat nog open blijft.
De taak is klaar wanneer het team in één oogopslag ziet wat nog nodig is voor een overtuigende beta-readiness claim.

## Waarom nu

- Beta-readiness is een kernonderdeel van de nieuwe maandfocus.
- Zonder expliciete readinessset blijft de releasebeslissing diffuus.

## In scope

- Readinesschecklist structureren voor de huidige fase.
- Bewijsverwachting voor runtime- en UI-smokes expliciteren.
- Relatie met bestaande smoke-checklist aanscherpen.

## Buiten scope

- Nieuwe productsporen buiten consumer beta.
- Business/Private readiness of governanceverbreding.

## Concrete checklist

- [ ] Beta-readiness checklist structureren tot duidelijke fase-output.
- [ ] Bewijsregel per kernflow expliciteren.
- [ ] Resterende open items voor de beta-release zichtbaar maken.

## Blockers / afhankelijkheden

- Samenhang met 1.2B outputkwaliteit en de bestaande smoke-checklist.

## Verify / bewijs

- Canonieke docs bijgewerkt.
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `docs/project/current-status.md`
- `docs/project/open-points.md`
- `docs/project/20-planning/20-active-phase.md`


## Commits

- 942af46 — docs: sync local workspace state

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge

- 2026-04-29T00:14:29+02:00 — docs: sync task commit logs

- 2026-04-29T01:47:27+02:00 — fix: diagnose Android photo prepare regression

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-01T11:08:03+02:00 — feat: add admin capability access control

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Admin/founder meeting capture — admin processing controls

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-admin-processing-controls.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-admin-processing-controls
title: Admin/founder meeting capture — admin processing controls
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Voeg later minimale admin controls toe voor retry/rerun van upload, transcript en summary processing."
tags: [meeting-capture, admin, processing, retry]
workstream: aiqs
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-transcript-pipeline]
follows_after: [task-admin-founder-meeting-capture-gespreksinzichten]
task_kind: task
spec_ready: true
due_date: null
sort_order: 15
---




# Admin/founder meeting capture — admin processing controls

## Probleem / context

Processing kan falen of later opnieuw nodig zijn. Admin heeft minimale controls nodig, maar geen brede admin-suite.

## Gewenste uitkomst

Admin kan upload/transcript/summary processing veilig retryen of rerunnen met duidelijke status en failure feedback.

## User outcome

Een admin kan mislukte of verouderde processing opnieuw starten zonder handmatig data te repareren.

## Functional slice

Minimale admin retry/rerun controls voor Meeting Capture processing.

## Entry / exit

- Entry: detail toont upload/transcript/summary status.
- Exit: retry/rerun is gestart of fout is zichtbaar.

## Happy flow

1. Admin opent detail met failed processing.
2. Admin kiest retry/rerun.
3. Status gaat naar queued/processing.
4. Resultaat wordt bijgewerkt.

## Non-happy flows

- Geen admin: controls verborgen.
- Retry faalt: status blijft failed met foutmelding.
- Processing loopt al: actie disabled.

## UX / copy

- Actions: `Opnieuw proberen`, `Samenvatting opnieuw maken`.
- Status: `Wordt verwerkt`.
- Failure: `Opnieuw proberen mislukt.`

## Data / IO

- Input: recording id en processing type.
- Output: nieuwe processing job/status.
- Statussen: idle, queued, processing, failed.

## Waarom nu

- P2 na transcript/insights.

## In scope

- Retry/rerun controls.
- Statusfeedback.
- Guardrails voor admin-only.

## Buiten scope

- Brede AIQS-verbouwing.
- Niet-admin controls.

## Oorspronkelijk plan / afgesproken scope

- Minimale admin controls, geen zware workflow.

## Expliciete user requirements / detailbehoud

- Alleen noodzakelijke controls.

## Status per requirement

- [ ] Admin processing controls — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: processing statusmodel lezen.
- [ ] Blok 2: controls bouwen.
- [ ] Blok 3: retry/rerun verify.

## Concrete checklist

- [ ] Retry transcript.
- [ ] Retry summary.
- [ ] Status/failure feedback.

## Acceptance criteria

- [ ] Alleen admin ziet controls.
- [ ] Retry/rerun start juiste processing.
- [ ] Running/failed states zijn duidelijk.

## Blockers / afhankelijkheden

- Depends on transcript pipeline; follows after insights.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: admin processing controls toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — audio upload/import flow

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-audio-upload-import-flow.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-audio-upload-import-flow
title: Admin/founder meeting capture — audio upload/import flow
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: Voeg later een flow toe waarmee een bestaand audiobestand in hetzelfde Meeting Capture archief kan landen.
tags: [meeting-capture, upload, import, audio]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus, task-admin-founder-meeting-capture-overzicht-detail-playback-download]
follows_after: [task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
task_kind: task
spec_ready: true
due_date: null
sort_order: 11
---




# Admin/founder meeting capture — audio upload/import flow

## Probleem / context

Niet elk belangrijk gesprek zal live in Budio worden opgenomen. De gebruiker wil ook bestaande audiobestanden kunnen uploaden.

## Gewenste uitkomst

Een admin kan een bestaand audiobestand uploaden naar hetzelfde Meeting Capture archief, met dezelfde metadata, uploadstatus, detailweergave en latere processingroute als live opgenomen audio.

## User outcome

Een admin kan een bestaande opname alsnog in het Meeting Capture archief plaatsen.

## Functional slice

Bestand-upload/import naar hetzelfde recording model als live audio.

## Entry / exit

- Entry: admin kiest `Audio uploaden` vanuit overview of new flow.
- Exit: audio staat in hetzelfde archief of upload is retrybaar mislukt.

## Happy flow

1. Admin kiest audiobestand.
2. Admin vult optionele titel/type/notitie in.
3. Upload gebruikt hetzelfde metadata/storage model.
4. Recording verschijnt in overzicht.
5. Detail gebruikt dezelfde playback/download UI.

## Non-happy flows

- Ongeldig bestandstype: toon rustige validatiefout.
- Te groot bestand: toon limiet/fout zonder crash.
- Upload failure: retry mogelijk, geen dubbele recording.
- Annuleren: geen recording aanmaken.

## UX / copy

- Action: `Audio uploaden`.
- Failure: `Upload mislukt. Probeer opnieuw.`
- Validation: `Kies een audiobestand.`

## Data / IO

- Input: local audio file en metadata.
- Output: recording metadata + private storage object.
- Statussen: selected, uploading, uploaded, upload_failed.

## Waarom nu

- Belangrijk genoeg om expliciet te plannen.
- Niet noodzakelijk voor audio-safe v1.

## In scope

- Bestand kiezen/uploaden.
- Metadata invullen.
- Zelfde archive/detail model gebruiken.
- Failure states en retry.

## Buiten scope

- Nieuwe aparte import-lane.
- Transcriptie of insights.

## Oorspronkelijk plan / afgesproken scope

- Upload/import hoort onder dezelfde epic, priority `p2`.

## Expliciete user requirements / detailbehoud

- Dit is nice to have maar moet wel een eigen taak krijgen.

## Status per requirement

- [ ] Upload/import flow — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande uploadpatronen lezen.
- [ ] Blok 2: importflow bouwen.
- [ ] Blok 3: verify/smoke.

## Concrete checklist

- [ ] File picker/upload.
- [ ] Metadata naar recording model.
- [ ] Detail/playback hergebruiken.
- [ ] Failure/retry tonen.

## Acceptance criteria

- [ ] Upload gebruikt hetzelfde archiefmodel.
- [ ] Detail/playback hergebruikt bestaande flow.
- [ ] Invalid/upload failure states zijn zichtbaar.

## Blockers / afhankelijkheden

- Depends on metadata/storage en overzicht/detail.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Web smoke upload/import.

## Reconciliation voor afronding

- Oorspronkelijk plan: bestaande audio upload/import toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — fase 1 tests en smokebewijs

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-fase-1-tests-en-smokebewijs.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs
title: Admin/founder meeting capture — fase 1 tests en smokebewijs
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Rond fase 1 af met gerichte tests en runtime-smokebewijs voor opnemen, recovery, upload, playback en download."
tags: [meeting-capture, tests, smoke, quality]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-web-route-en-ia, task-admin-founder-meeting-capture-opname-start-stop-web-mvp, task-admin-founder-meeting-capture-lokale-failsafe-en-recovery, task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus, task-admin-founder-meeting-capture-overzicht-detail-playback-download]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 9
---





# Admin/founder meeting capture — fase 1 tests en smokebewijs

## Probleem / context

Fase 1 raakt browser recording, lokale opslag, private upload en UI. Lint/typecheck alleen is onvoldoende bewijs voor deze interactieve flow.

## Gewenste uitkomst

Er ligt bewijs dat de audio-safe v1 werkt: opname starten/stoppen, reload recovery, upload/retry, overzicht/detail, playback/download en admin-only gating.

## User outcome

Het team kan met bewijs zeggen dat Meeting Capture fase 1 betrouwbaar genoeg is om verder op te bouwen.

## Functional slice

Afsluitende test- en smoke-slice voor de volledige audio-safe v1.

## Entry / exit

- Entry: P1 bouwtaken zijn gebouwd.
- Exit: bewijs staat in taskfile en failures zijn opgelost of expliciet blocked.

## Happy flow

1. Draai lint/typecheck.
2. Draai unit/helper tests voor recorder/recovery/storage.
3. Smoke admin-only routing.
4. Smoke opname start/stop.
5. Smoke reload recovery.
6. Smoke upload, playback en download.
7. Check light/dark UI.

## Non-happy flows

- Test faalt: fix binnen dezelfde flow als regressie relevant is.
- Runtime smoke niet mogelijk: leg exact vast waarom en welk handmatig commando nodig is.
- Audioverlies-scenario faalt: fase 1 blijft niet klaar.

## UX / copy

- Verifieer verplichte copy uit epic-flowcontract in UI.
- Geen nieuwe copy introduceren zonder taskfile-update.

## Data / IO

- Input: lokale dev-server op standaard target indien beschikbaar, testdata/recording mocks.
- Output: testresultaten, smoke-notities en bewijs in taskfile.
- Geen productie-data.

## Waarom nu

- Fase 1 mag pas als klaar gelden met runtimebewijs.

## In scope

- Unit/integratietests voor complexe helpers.
- Lint/typecheck.
- Web smoke voor kernscenario's.
- Light/dark runtime-check voor geraakte UI.

## Buiten scope

- Volledige E2E suite voor P2 transcript/insights.
- Productie-monitoring.

## Oorspronkelijk plan / afgesproken scope

- Nieuwe complexe helpermodules mikken op minimaal 80% coverage.
- Interactieve UI vereist runtime/smoke-check.

## Expliciete user requirements / detailbehoud

- Task is pas klaar wanneer het werkt, niet alleen wanneer files bestaan.
- Bestaande flow mag niet regressief geraakt zijn.

## Status per requirement

- [ ] Helper-tests — status: niet gebouwd
- [ ] Runtime smoke — status: niet gebouwd
- [ ] Light/dark check — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: testbare helpers en smoke-scenario's inventariseren.
- [ ] Blok 2: tests/smoke uitvoeren en fixes binnen flow oplossen.
- [ ] Blok 3: evidence vastleggen en phase-1 reconciliation doen.

## Concrete checklist

- [ ] Admin ziet ingang, niet-admin niet.
- [ ] Opname start/stop werkt.
- [ ] Chunks worden lokaal bewaard.
- [ ] Reload recovery werkt.
- [ ] Upload failure veroorzaakt geen audioverlies.
- [ ] Detail toont playback en download.

## Acceptance criteria

- [ ] Admin-only toegang bewezen.
- [ ] Start/stop opname bewezen.
- [ ] Reload recovery bewezen.
- [ ] Upload failure veroorzaakt geen audioverlies.
- [ ] Playback/download bewezen.
- [ ] Light/dark UI-check uitgevoerd of expliciet blocked met reden.

## Blockers / afhankelijkheden

- Depends on alle P1 bouwtaken voor fase 1.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Gerichte tests.
- Web smoke light/dark.

## Reconciliation voor afronding

- Oorspronkelijk plan: fase 1 bewijzen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — gespreksinzichten

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-gespreksinzichten.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-gespreksinzichten
title: Admin/founder meeting capture — gespreksinzichten
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Voeg later brongetrouwe gespreksinzichten toe: auto-title, samenvatting, kernpunten, besluiten, actiepunten, open vragen en onderwerpen."
tags: [meeting-capture, insights, summary, ai]
workstream: aiqs
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-transcript-pipeline]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 14
---




# Admin/founder meeting capture — gespreksinzichten

## Probleem / context

Lange gesprekken bevatten besluiten, actiepunten en productrichting. Die waarde moet later overzichtelijk worden gemaakt, maar alleen op basis van transcript/audio.

## Gewenste uitkomst

Detail toont brongetrouwe inzichten: auto-title, korte samenvatting, kernpunten, besluiten, actiepunten, open vragen en onderwerpen. Fouten in insights blokkeren transcript/audio niet.

## User outcome

Een admin kan snel besluiten, actiepunten en kernpunten uit een gesprek terugzien met behoud van audio/transcript als bron.

## Functional slice

Brongetrouwe insights processing en detailweergave bovenop transcript.

## Entry / exit

- Entry: recording heeft transcript.
- Exit: insights zijn zichtbaar of failure is geïsoleerd.

## Happy flow

1. Insights job start op transcript.
2. Status toont processing.
3. Output bevat titel, samenvatting, kernpunten, besluiten, actiepunten, open vragen en onderwerpen.
4. Detail toont insights aanvullend op audio/transcript.

## Non-happy flows

- Insight failure: transcript/audio blijven zichtbaar.
- Onvoldoende transcript: toon dat insights nog niet beschikbaar zijn.
- Retry: start insights opnieuw zonder transcriptverlies.

## UX / copy

- Section: `Inzichten`.
- Failure: `Inzichten maken mislukt. De audio en het transcript zijn bewaard.`
- Action: `Inzichten opnieuw proberen`.

## Data / IO

- Input: transcript.
- Output: structured insights.
- Statussen: queued, processing, completed, failed.

## Waarom nu

- P2 na transcript pipeline.

## In scope

- Prompt/output-contract voor inzichten.
- Status/failure isolation.
- Detailweergave voor inzichten.

## Buiten scope

- Medische interpretatie of advies.
- Volledige AIQS control plane verbouwen.

## Oorspronkelijk plan / afgesproken scope

- Insights zijn aanvullend, niet vervangend.
- Altijd terug kunnen naar audio en transcript.

## Expliciete user requirements / detailbehoud

- Strikt brongetrouw.
- Geen medische interpretatie.

## Status per requirement

- [ ] Gespreksinzichten — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: AIQS/content rules lezen.
- [ ] Blok 2: insights processing bouwen.
- [ ] Blok 3: brontrouw/failure tests.

## Concrete checklist

- [ ] Outputcontract bepalen.
- [ ] Processing aansluiten.
- [ ] Detail UI toevoegen.
- [ ] Failure isolation valideren.

## Acceptance criteria

- [ ] Insights zijn brongetrouw.
- [ ] Failure blokkeert audio/transcript niet.
- [ ] Geen medische interpretatie of advies.

## Blockers / afhankelijkheden

- Depends on transcript pipeline.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Gerichte AI/output tests.

## Reconciliation voor afronding

- Oorspronkelijk plan: gespreksinzichten toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
- `docs/project/content-processing-rules.md`
- `docs/project/ai-quality-studio.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — lokale failsafe en recovery

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-lokale-failsafe-en-recovery.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-lokale-failsafe-en-recovery
title: Admin/founder meeting capture — lokale failsafe en recovery
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Voeg MediaRecorder chunking, IndexedDB local-first opslag en recovery na reload/crash toe zodat audioverlies wordt voorkomen."
tags: [meeting-capture, indexeddb, recovery, audio]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-opname-start-stop-web-mvp]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 6
---





# Admin/founder meeting capture — lokale failsafe en recovery

## Probleem / context

Lange browseropnames zijn kwetsbaar voor reloads, crashes en netwerkproblemen. Audioverlies is de grootste v1-risico.

## Gewenste uitkomst

Opnamechunks worden tijdens recording lokaal veiliggesteld in IndexedDB. Na reload/crash kan de gebruiker een onafgemaakte opname terugvinden en kiezen voor uploaden/herstellen of verwijderen.

## User outcome

Een admin verliest een lange opname niet door reload, crash of tijdelijk netwerkprobleem.

## Functional slice

Local-first chunkopslag en recovery UI voor onafgemaakte Meeting Capture opnames.

## Entry / exit

- Entry: actieve recorder schrijft chunks tijdens opname.
- Exit: chunks zijn lokaal herstelbaar, geüpload in vervolgflow of bewust verwijderd.

## Happy flow

1. Recorder produceert korte audiochunks.
2. Elke chunk wordt met metadata in IndexedDB opgeslagen.
3. Bij stop worden chunks samengevoegd of klaar gezet voor upload.
4. Bij nieuwe sessie detecteert de app onafgemaakte lokale opname.
5. Admin kiest `Upload opname` of `Verwijder lokale opname`.

## Non-happy flows

- Reload/crash: recovery state verschijnt bij terugkomst.
- IndexedDB unavailable/quota: toon fout dat lokale veilige opslag niet beschikbaar is.
- Chunk write faalt: opname stopt veilig met foutmelding, geen stille success.
- Verwijderen: destructive confirm voordat lokale chunks weg zijn.

## UX / copy

- Recovery title: `Niet-geüploade opname gevonden`.
- Recovery body: `De audio staat nog lokaal op dit apparaat.`
- Actions: `Upload opname`, `Verwijder lokale opname`.
- Failure: `Lokaal bewaren lukt niet. Stop de opname en probeer opnieuw.`

## Data / IO

- Input: MediaRecorder chunks en recording draft metadata.
- Output: IndexedDB records per chunk en recovery manifest.
- Statussen: local_saving, local_safe, recovery_available, local_delete_pending, local_error.

## Waarom nu

- V1 is pas bruikbaar als opnameverlies actief wordt beperkt.

## In scope

- `MediaRecorder` chunking met korte slices.
- IndexedDB opslag per chunk.
- Recovery-detectie.
- Recovery UI met herstellen/uploaden of verwijderen.

## Buiten scope

- Private Supabase upload implementeren.
- Transcriptie.
- Native background recording.

## Oorspronkelijk plan / afgesproken scope

- Audioverlies mag niet optreden door transcript- of uploadfouten.
- Local-first recovery is kern van v1.

## Expliciete user requirements / detailbehoud

- Houd het simpel en functioneel.
- Geen nieuwe visuele patronen voor recovery als bestaande status/sheet patronen voldoen.

## Status per requirement

- [ ] Chunking — status: niet gebouwd
- [ ] IndexedDB opslag — status: niet gebouwd
- [ ] Recovery UI — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande storage/offline patronen lezen.
- [ ] Blok 2: IndexedDB helper + recorder koppeling bouwen.
- [ ] Blok 3: recovery scenario's testen.

## Concrete checklist

- [ ] Chunk metadata bepalen.
- [ ] IndexedDB helper unit-testbaar maken.
- [ ] Recovery detectie toevoegen.
- [ ] Recovery UI aansluiten.
- [ ] Reload/crash smoke uitvoeren.

## Acceptance criteria

- [ ] Chunks worden tijdens opname lokaal geschreven.
- [ ] Reload detecteert onafgemaakte opname.
- [ ] Admin kan upload/herstel vervolgen.
- [ ] Admin kan lokale opname bewust verwijderen.
- [ ] Schrijffout wordt zichtbaar en niet als succes behandeld.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-opname-start-stop-web-mvp`.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Unit-tests voor helperlogica waar toegevoegd.
- Web smoke voor reload recovery.

## Reconciliation voor afronding

- Oorspronkelijk plan: lokale failsafe en recovery bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — metadata, private storage en uploadstatus

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus
title: "Admin/founder meeting capture — metadata, private storage en uploadstatus"
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Voeg minimale DB/storage-fundering toe voor recordings, private audio upload, idempotente retry en uploadstatus los van latere processing."
tags: [meeting-capture, supabase, storage, database]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen]
follows_after: [task-admin-founder-meeting-capture-lokale-failsafe-en-recovery]
task_kind: task
spec_ready: true
due_date: null
sort_order: 7
---





# Admin/founder meeting capture — metadata, private storage en uploadstatus

## Probleem / context

Meeting Capture heeft eigen metadata en private audio-opslag nodig. Upload mag niet gelijk worden aan transcriptie of samenvatting; audio-opslag is de v1-succesdefinitie.

## Gewenste uitkomst

Er is een minimale DB/storage-fundering voor recordings en uploadstatus. Upload/retry is idempotent genoeg om dubbele recordings te voorkomen. Uploadstatus staat los van transcript- of insightstatus.

## User outcome

Een admin kan erop vertrouwen dat bewaarde audio private wordt opgeslagen en dat uploadstatus losstaat van latere AI-verwerking.

## Functional slice

Minimale Supabase metadata/storage/uploadstatus voor Meeting Capture recordings.

## Entry / exit

- Entry: lokaal veilige recording of audio blob staat klaar voor upload.
- Exit: recording metadata en private audio-object bestaan, of upload failure is retrybaar zonder duplicatie.

## Happy flow

1. Uploadflow ontvangt recording draft en lokale audio/chunks.
2. Metadatarecord wordt aangemaakt of hergebruikt.
3. Audio uploadt naar private storagepad.
4. Uploadstatus wordt `uploaded`.
5. Detail/overview kan metadata en audio-url ophalen.

## Non-happy flows

- Netwerkfout: status `upload_failed`, lokale audio blijft veilig.
- Retry: hergebruikt bestaande recording/upload target en maakt geen dubbele recording.
- RLS/storage denial: duidelijke admin-only fout, geen stille success.
- Partial upload: status blijft retrybaar.

## UX / copy

- Uploading: `Audio wordt opgeslagen`.
- Local safe during failure: `De audio staat nog lokaal veilig.`
- Failure: `Upload mislukt. Probeer opnieuw.`
- Success: `Audio opgeslagen.`

## Data / IO

- Input: recording metadata, local blob/chunks, authenticated admin user.
- Output: DB recording row, storage object, uploadstatus.
- Statussen: pending_upload, uploading, uploaded, upload_failed.

## Waarom nu

- Playback/detail en latere transcriptie kunnen pas betrouwbaar op een opgeslagen recording bouwen.

## In scope

- Minimale Supabase schema/storage aanpak.
- Private bucket/padstrategie.
- Uploadstatus en failure states.
- Retry zonder duplicatie.

## Buiten scope

- Transcriptstatus volledig implementeren.
- Retentiebeleid.
- Exportpakket.

## Oorspronkelijk plan / afgesproken scope

- Nieuwe DB/storage-structuur apart voor conversation recordings.
- Niet de bestaande dagboek `source_type` oprekken als hoofdroute.

## Expliciete user requirements / detailbehoud

- Upload en processing blijven expliciet ontkoppeld.
- Audio bewaard betekent v1-succes, ook als transcript later faalt.

## Status per requirement

- [ ] Metadata model — status: niet gebouwd
- [ ] Private storage upload — status: niet gebouwd
- [ ] Uploadstatus/retry — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande Supabase/audio storage patronen lezen.
- [ ] Blok 2: migratie/service/RLS/storage implementeren.
- [ ] Blok 3: lokale DB-stap, lint/typecheck en gerichte tests.

## Concrete checklist

- [ ] Schema en storage pad bepalen.
- [ ] Migration toevoegen.
- [ ] Service/helpers toevoegen.
- [ ] Upload/retry states aansluiten.
- [ ] Lokale DB push/reset uitvoeren indien nodig.

## Acceptance criteria

- [ ] Metadata en private storagepad zijn gedefinieerd.
- [ ] Uploadstatus staat los van transcriptstatus.
- [ ] Retry maakt geen dubbele recording.
- [ ] Upload failure behoudt lokale audio/recovery.

## Blockers / afhankelijkheden

- Depends on scope-task; follows after local failsafe voor volledige v1-flow.

## Verify / bewijs

- `npx supabase db push --local` of passende lokale DB-stap bij migration.
- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: metadata/private storage/uploadstatus bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — opname start/stop web MVP

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-opname-start-stop-web-mvp.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-opname-start-stop-web-mvp
title: Admin/founder meeting capture — opname start/stop web MVP
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Bouw de minimale webopnameflow voor Meeting Capture met voor-opnamescherm, timer, status, stop/bewaar en annuleren."
tags: [meeting-capture, recording, mediarecorder, ui]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-web-route-en-ia]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 5
---





# Admin/founder meeting capture — opname start/stop web MVP

## Probleem / context

De gebruiker moet lange gesprekken kunnen starten en stoppen zonder dagboekcapture te gebruiken. De eerste recorder hoeft niet slim te zijn; hij moet duidelijk en betrouwbaar zijn.

## Gewenste uitkomst

Admin kan een opname voorbereiden, starten, timer/status zien, stoppen en bewaren of annuleren met confirm. De flow bevat titel/type/contextnotitie en consent reminder. Er is geen live transcript of AI-verwerking in deze taak.

## User outcome

Een admin kan in de browser een gesprek starten, opname-status volgen en bewust stoppen/bewaren of annuleren.

## Functional slice

Minimale `MediaRecorder` start/stop flow met UI-state, zonder IndexedDB recovery of upload.

## Entry / exit

- Entry: nieuwe-opname route vanuit Meeting Capture overview.
- Exit: opname is gestopt met een lokaal blob/resultaat voor vervolgtaak, of bewust geannuleerd.

## Happy flow

1. Admin opent `Gespreksopname`.
2. Admin ziet optionele titel, type/contextnotitie en consent reminder.
3. Admin kiest `Start opname`.
4. Browser vraagt microfoontoegang indien nodig.
5. Timer en status `Opname loopt` verschijnen.
6. Admin kiest `Stop en bewaar`.
7. Flow levert audio blob/recording state op voor lokale failsafe/upload vervolg.

## Non-happy flows

- Mic denied: toon `Microfoontoegang is nodig om op te nemen.` met `Probeer opnieuw`.
- Browser unsupported: toon `Opnemen werkt niet in deze browser.` zonder crash.
- Annuleren tijdens opname: destructive confirm met `Opname annuleren?` en `Deze opname wordt niet bewaard.`
- Recorder error: toon rustige fout en behoud UI-controle.

## UX / copy

- Title: `Gespreksopname`.
- Primary: `Start opname`; active primary: `Stop en bewaar`; secondary: `Annuleer`.
- Status: `Opname loopt`; helper: `Audio wordt veilig opgeslagen zodra je stopt.`
- Consent: `Zorg dat iedereen weet dat je dit gesprek opneemt.`

## Data / IO

- Input: microfoonstream, titel/type/contextnotitie.
- Output: audio blob/recording draft state.
- Statussen: idle, requesting_permission, recording, stopping, stopped, cancelled, error.

## Waarom nu

- Dit is de eerste functionele slice van de v1 flow.

## In scope

- Voor-opnamescherm.
- Mic-permission en opname-start.
- Timer/status tijdens opname.
- Stop/bewaar.
- Annuleren met bestaande destructive confirm pattern.

## Buiten scope

- IndexedDB recovery.
- Private upload.
- Transcriptie.

## Oorspronkelijk plan / afgesproken scope

- Web recording MVP, max 60 minuten zichtbaar als guardrail.
- Audio-first, simpel en betrouwbaar.

## Expliciete user requirements / detailbehoud

- Copy kort en volgens Budio-stijl.
- Geen extra meeting-suite UI verzinnen.

## Status per requirement

- [ ] Voor-opnamescherm — status: niet gebouwd
- [ ] Start/stop opname — status: niet gebouwd
- [ ] Annuleren met confirm — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande audio/capture helpers en UI primitives lezen.
- [ ] Blok 2: recorder hook/helper + schermintegratie bouwen.
- [ ] Blok 3: lint/typecheck en browser-smoke.

## Concrete checklist

- [ ] Browser support/failure states bepalen.
- [ ] Recorder state implementeren.
- [ ] UI aansluiten.
- [ ] Stop/bewaar en annuleren valideren.

## Acceptance criteria

- [ ] Opname start na microfoontoegang.
- [ ] Timer/status werkt tijdens opname.
- [ ] Stop en bewaar levert audioresultaat op.
- [ ] Mic denied en unsupported browser hebben duidelijke UI.
- [ ] Annuleren vraagt bevestiging.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-web-route-en-ia`.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Web smoke voor start/stop.

## Reconciliation voor afronding

- Oorspronkelijk plan: opname start/stop MVP bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — overzicht/detail met playback en download

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-overzicht-detail-playback-download.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-overzicht-detail-playback-download
title: Admin/founder meeting capture — overzicht/detail met playback en download
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Bouw het Meeting Capture archief met overzicht, detail, audio playback, download en eenvoudige statusblokken."
tags: [meeting-capture, ui, playback, archive]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus]
follows_after: [task-admin-founder-meeting-capture-lokale-failsafe-en-recovery]
task_kind: task
spec_ready: true
due_date: null
sort_order: 8
---





# Admin/founder meeting capture — overzicht/detail met playback en download

## Probleem / context

Een opgenomen gesprek moet terugvindbaar en controleerbaar zijn. Zonder archief/detail is upload niet zichtbaar waardevol.

## Gewenste uitkomst

Admin ziet een rustige lijst met recordings en kan een detail openen met audio playback, download, metadata en statusblokken. De UI voelt als familie van bestaande moment/dag-schermen.

## User outcome

Een admin kan opgeslagen gespreksopnames terugvinden, afspelen, downloaden en status begrijpen.

## Functional slice

Meeting Capture archive overview en detail met playback/download en statusblokken.

## Entry / exit

- Entry: admin opent Meeting Capture overview of detail.
- Exit: admin speelt audio af, downloadt audio of ziet duidelijke status/failure.

## Happy flow

1. Overview laadt recordings.
2. Admin ziet datum, titel, duur, type en uploadstatus.
3. Admin opent een recording.
4. Detail toont metadata en audio player.
5. Admin speelt audio af of kiest `Download audio`.

## Non-happy flows

- Empty archive: toon empty state met `Start opname`.
- Audio ontbreekt maar lokaal veilig: toon herstel/uploadstatus, geen playback.
- Download faalt: toon `Download mislukt. Probeer opnieuw.`
- Recording niet gevonden: toon not-found met terugactie.

## UX / copy

- Overview title: `Gespreksopnames`.
- Detail fallback title: `Gespreksopname`.
- Actions: `Start opname`, `Download audio`, `Upload opnieuw proberen`.
- Statuses: `Audio opgeslagen`, `Upload bezig`, `Upload mislukt`, `Lokaal veilig`.

## Data / IO

- Input: recording list/detail metadata en private audio URL/download endpoint.
- Output: rendered list/detail, playback request, download request.
- Statussen: loading, empty, ready, playback_unavailable, download_failed.

## Waarom nu

- Playback/download maakt de audio-safe v1 sluitend.

## In scope

- Overzichtslijst met datum, titel, duur, type en status.
- Detail met audio player.
- Downloadactie.
- Statusblokken voor lokaal veilig/upload bezig/upload mislukt/bewaard.

## Buiten scope

- Transcript editor.
- Insights UI.
- Exportpakket.

## Oorspronkelijk plan / afgesproken scope

- Zelfde rustige layouttaal als bestaande moment/dag-schermen.
- Audio/detail is leidend; latere verwerking aanvullend.

## Expliciete user requirements / detailbehoud

- Geen dashboardisering of meeting-suite look.
- Copy simpel en geruststellend.

## Status per requirement

- [ ] Overzicht — status: niet gebouwd
- [ ] Detail — status: niet gebouwd
- [ ] Playback/download — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande moment/detail/audio playback patronen lezen.
- [ ] Blok 2: overzicht/detail/playback bouwen.
- [ ] Blok 3: runtime smoke light/dark en lint/typecheck.

## Concrete checklist

- [ ] Recording list aansluiten.
- [ ] Detail metadata tonen.
- [ ] Audio player aansluiten.
- [ ] Downloadactie toevoegen.
- [ ] Failure/empty states tonen.

## Acceptance criteria

- [ ] Overview toont recordings en empty state.
- [ ] Detail toont metadata en audio player.
- [ ] Downloadactie werkt of faalt zichtbaar.
- [ ] Upload/local statuses zijn begrijpelijk.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus`.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Light/dark web smoke voor list/detail/playback.

## Reconciliation voor afronding

- Oorspronkelijk plan: overzicht/detail/playback/download bouwen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — retentie en export hardening

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-retentie-export-hardening.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-retentie-export-hardening
title: Admin/founder meeting capture — retentie en export hardening
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Werk later keep-audio policy, retentievoorbereiding, cleanup en robuuste export/download voor Meeting Capture uit."
tags: [meeting-capture, retention, export, privacy]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-overzicht-detail-playback-download]
follows_after: [task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
task_kind: task
spec_ready: true
due_date: null
sort_order: 16
---




# Admin/founder meeting capture — retentie en export hardening

## Probleem / context

Lange audio-opnames vragen later expliciet beleid rond bewaren, verwijderen, export en cleanup.

## Gewenste uitkomst

Meeting Capture heeft een heldere keep-audio/retentievoorbereiding en robuuste download/export flow, zonder de eerste audio-safe v1 te vertragen.

## User outcome

Een admin begrijpt hoe audio bewaard/exporteerbaar blijft en welke cleanup/retentie later geldt.

## Functional slice

Retentievoorbereiding en export/download hardening voor opgeslagen recordings.

## Entry / exit

- Entry: recordings bestaan met playback/download.
- Exit: keep-audio/retentie/exportgedrag is expliciet en robuuster.

## Happy flow

1. Admin opent detail.
2. Audio heeft duidelijke bewaarbeleid/status.
3. Admin downloadt/exporteert audio betrouwbaar.
4. Cleanup/retentievelden zijn voorbereid.

## Non-happy flows

- Download expired/denied: toon fout en retry.
- Audio verwijderd: toon status zonder kapotte player.
- Export faalt: geen data verwijderen.

## UX / copy

- Status: `Audio bewaard`.
- Action: `Download audio`.
- Failure: `Download mislukt. Probeer opnieuw.`

## Data / IO

- Input: stored recording/audio.
- Output: retention metadata and hardened download/export path.
- Statussen: retained, deleted, export_failed.

## Waarom nu

- Belangrijk voor privacy en productisering, maar niet v1-blokkerend.

## In scope

- Keep-audio policy voorbereiden.
- Retentievelden/cleanup richting.
- Download/export hardening.

## Buiten scope

- Volledige compliance-suite.
- Team sharing.

## Oorspronkelijk plan / afgesproken scope

- Retentie en export hardening later, na bewezen MVP.

## Expliciete user requirements / detailbehoud

- Retentie/export krijgt een eigen taak onder dezelfde epic.

## Status per requirement

- [ ] Retentie/export hardening — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: privacy/audio settings patronen lezen.
- [ ] Blok 2: retentie/export richting implementeren.
- [ ] Blok 3: verify.

## Concrete checklist

- [ ] Keep-audio policy uitwerken.
- [ ] Cleanup/retentie voorbereiden.
- [ ] Export/download hardening valideren.

## Acceptance criteria

- [ ] Retentiegedrag is expliciet.
- [ ] Download/export faalt zichtbaar en veilig.
- [ ] Geen audioverlies door exportfailure.

## Blockers / afhankelijkheden

- Depends on overview/detail/playback/download.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: retentie/export hardening later uitwerken.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — speaker labels en mapping

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-speaker-labels-en-mapping.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-speaker-labels-en-mapping
title: Admin/founder meeting capture — speaker labels en mapping
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: Voeg later eenvoudige speakerlabels en hernoembare speaker mapping toe aan Meeting Capture transcriptdetail.
tags: [meeting-capture, transcript, speakers]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-transcript-pipeline]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 13
---




# Admin/founder meeting capture — speaker labels en mapping

## Probleem / context

Lange gesprekken worden bruikbaarder wanneer sprekers herkenbaar zijn, maar een zware editor-UX past niet bij de eerste fase.

## Gewenste uitkomst

Transcriptdetail ondersteunt eenvoudige speakerlabels en hernoemen/mappen van sprekers zonder transcriptverlies.

## User outcome

Een admin kan sprekers in een transcript begrijpelijk labelen zonder zware editor.

## Functional slice

Eenvoudige speakerlabel mapping op transcriptdetail.

## Entry / exit

- Entry: transcript bestaat met speaker markers of segmenten.
- Exit: speakerlabels zijn aangepast en persistent.

## Happy flow

1. Admin opent transcriptdetail.
2. Admin ziet speakerlabels.
3. Admin hernoemt een speaker.
4. Transcript toont nieuwe labels.
5. Mapping blijft bewaard.

## Non-happy flows

- Geen transcript: speaker UI niet tonen.
- Save failure: toon fout en behoud lokale invoer.
- Onbekende speaker: fallback label `Spreker`.

## UX / copy

- Label: `Spreker`.
- Action: `Naam aanpassen`.
- Failure: `Naam opslaan mislukt.`

## Data / IO

- Input: transcript speakers/segments.
- Output: speaker mapping.
- Statussen: editing, saved, save_failed.

## Waarom nu

- P2 na transcript pipeline.

## In scope

- Basale speakerlabels.
- Speaker hernoemen.
- Mapping bewaren.

## Buiten scope

- Zware transcript-editor.
- Automatische diarization perfectie als harde eis.

## Oorspronkelijk plan / afgesproken scope

- Speakerlabels zijn nice-to-have na transcriptie.

## Expliciete user requirements / detailbehoud

- Geen zware editor-UX.

## Status per requirement

- [ ] Speaker labels/mapping — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: transcript data shape lezen.
- [ ] Blok 2: mapping UI/data bouwen.
- [ ] Blok 3: verify.

## Concrete checklist

- [ ] Labels tonen.
- [ ] Speaker hernoemen.
- [ ] Mapping persistent maken.

## Acceptance criteria

- [ ] Labels tonen op transcriptdetail.
- [ ] Hernoemen werkt persistent.
- [ ] Save failure is zichtbaar.

## Blockers / afhankelijkheden

- Depends on transcript pipeline.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: speaker labels toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — transcript pipeline

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-transcript-pipeline.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-transcript-pipeline
title: Admin/founder meeting capture — transcript pipeline
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Voeg later queued transcriptie, retries en transcriptstatus toe zonder audio-opslag te blokkeren."
tags: [meeting-capture, transcript, processing, ai]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-metadata-private-storage-en-uploadstatus, task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 12
---




# Admin/founder meeting capture — transcript pipeline

## Probleem / context

Transcriptie is waardevol, maar mag de audio-safe v1 niet blokkeren of audio-opslag fragiel maken.

## Gewenste uitkomst

Een opgeslagen recording kan queued/background worden getranscribeerd. Status, retry en failure zijn zichtbaar op detail. Audio blijft beschikbaar als transcriptie faalt.

## User outcome

Een admin kan transcriptie van een opgeslagen gesprek laten verwerken zonder risico op audioverlies.

## Functional slice

Queued transcript processing met status, retry en transcriptweergave.

## Entry / exit

- Entry: recording heeft opgeslagen audio.
- Exit: transcript is beschikbaar of failure is zichtbaar en retrybaar.

## Happy flow

1. Transcript job start na audio-upload of handmatige actie.
2. Status toont `Transcript wordt gemaakt`.
3. Segmenten/transcript worden verwerkt.
4. Detail toont transcript.
5. Audio blijft afspeelbaar.

## Non-happy flows

- Transcript failure: toon `Transcript mislukt. De audio is bewaard.`
- Retry: start verwerking opnieuw zonder nieuwe recording.
- Partial failure: eerdere audio/metadata blijven intact.
- Geen audio: transcriptactie disabled of verklaard.

## UX / copy

- Status: `Transcript wordt gemaakt`.
- Failure: `Transcript mislukt. De audio is bewaard.`
- Action: `Transcript opnieuw proberen`.

## Data / IO

- Input: stored audio/segments.
- Output: transcript text, processing status.
- Statussen: queued, processing, completed, failed.

## Waarom nu

- P2 na bewezen audio archive.

## In scope

- Queued transcriptstatus.
- Segmenttranscriptie of passende chunk-aanpak.
- Transcript stitching.
- Retry per recording of stap.

## Buiten scope

- Speaker mapping.
- Insights/samenvatting.
- Realtime transcriptie.

## Oorspronkelijk plan / afgesproken scope

- Transcriptie volgt na audio-safe v1.
- Processing is gescheiden van capture/upload.

## Expliciete user requirements / detailbehoud

- Transcript mislukt betekent niet dat audio mislukt.

## Status per requirement

- [ ] Transcript pipeline — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: bestaande OpenAI/server processing patronen lezen.
- [ ] Blok 2: pipeline en statusmodel bouwen.
- [ ] Blok 3: failure/retry testen.

## Concrete checklist

- [ ] Processing status toevoegen.
- [ ] Transcriptgeneratie aansluiten.
- [ ] Retry/failure states tonen.
- [ ] Detail transcript tonen.

## Acceptance criteria

- [ ] Transcriptstatus is zichtbaar.
- [ ] Transcript failure blokkeert audio niet.
- [ ] Retry werkt zonder duplicatie.

## Blockers / afhankelijkheden

- Depends on audio-safe archive.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- Gerichte server/helper tests.

## Reconciliation voor afronding

- Oorspronkelijk plan: transcript pipeline toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: P2.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Admin/founder meeting capture — workflow-retro en docs/skill update

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-workflow-retro-en-docs-skill-update.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-workflow-retro-en-docs-skill-update
title: Admin/founder meeting capture — workflow-retro en docs/skill update
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Verwerk alleen bewezen Meeting Capture uitvoeringslearnings in AGENTS.md, relevante skills of docs/dev, cheap-first en zonder theoretische workflow-herschrijving."
tags: [meeting-capture, workflow, codex, skills]
workstream: plugin
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-fase-1-tests-en-smokebewijs]
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 10
---





# Admin/founder meeting capture — workflow-retro en docs/skill update

## Probleem / context

Meeting Capture is ook een test van de nieuwe workspace hierarchy en Codex workflow. Verbeteringen moeten worden vastgelegd, maar alleen wanneer ze uit echte frictie of herhaalbare winst blijken.

## Gewenste uitkomst

Na de eerste functionele slice is duidelijk wat beter moet aan AGENTS, taskflow, skills, plugin of docs/dev. Alleen concrete, bewezen verbeteringen worden verwerkt; grotere workflowwensen krijgen een eigen task.

## User outcome

Toekomstige agents profiteren van bewezen Meeting Capture uitvoeringslearnings zonder theoretische workflow-uitbreiding.

## Functional slice

Een kleine retro en gerichte workflowupdate of aparte vervolgtaak.

## Waarom nu

- Dit voorkomt dat waardevolle agent-learning verdwijnt.
- Tegelijk voorkomt het theoretische workflow-expansie.

## In scope

- Retrospective op Meeting Capture uitvoering.
- Kleine update aan bestaande skill/docs/AGENTS wanneer bewezen nuttig.
- Aparte task aanmaken voor bredere plugin/workflowproblemen.

## Buiten scope

- Grote AGENTS.md rewrite.
- Nieuwe pluginfeatures zonder eigen task.
- Subagents inzetten zonder expliciete uservraag.

## Oorspronkelijk plan / afgesproken scope

- OpenAI Codex best practices, PLANS.md, modelkeuze, skills en Instructa prompt-pack lessen meenemen tijdens uitvoering.
- Alleen bewezen frictie verwerken.

## Expliciete user requirements / detailbehoud

- Exacte files, scope, pass/fail checks en stack traces als praktijkles bewaken.
- Repeated workflows naar skills wanneer zinvol.

## Status per requirement

- [ ] Retro uitgevoerd — status: niet gebouwd
- [ ] Bewezen updates verwerkt — status: niet gebouwd
- [ ] Breder werk als aparte task vastgelegd — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: uitvoering en frictiepunten inventariseren.
- [ ] Blok 2: kleinste workflowupdate doen of aparte task aanmaken.
- [ ] Blok 3: docs/taskflow verify draaien.

## Concrete checklist

- [ ] Meeting Capture hierarchy-test beoordelen.
- [ ] Taskflow/plugin frictie beoordelen.
- [ ] Alleen concrete workflowupdates toepassen.
- [ ] Verify draaien.

## Acceptance criteria

- [ ] Alleen bewezen frictie is verwerkt.
- [ ] Grote vervolgpunten staan in eigen task.
- [ ] Docs/taskflow verify is groen.

## Blockers / afhankelijkheden

- Depends on fase 1 tests/smokebewijs.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: workflowlearnings verwerken na echte uitvoering.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op fase 1.

## Relevante links

- https://developers.openai.com/codex/learn/best-practices
- https://developers.openai.com/cookbook/articles/codex_exec_plans
- https://developers.openai.com/codex/models
- https://developers.openai.com/codex/skills


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## AIQS logging valideren in OpenAI dashboard en fallback-logpad

- Path: `docs/project/25-tasks/open/aiqs-logging-valideren-openai-dashboard-en-fallback.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-aiqs-logging-valideren-openai-dashboard-en-fallback
title: AIQS logging valideren in OpenAI dashboard en fallback-logpad
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Valideer dat AIQS logging voor bestaande OpenAI-calls leesbaar binnenkomt in het OpenAI API-dashboard, met werkende fallback-logging en een duidelijke 4-uurs logging-toggle in de admin UI."
tags: [aiqs, logging, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 15
---

































# AIQS logging valideren in OpenAI dashboard en fallback-logpad

## Probleem / context

Voor de huidige AIQS-testflow is logging al deels aanwezig, maar het is nog niet duidelijk genoeg of logging voor de bestaande OpenAI-calls daadwerkelijk zichtbaar en leesbaar is in de OpenAI dashboard-logging.
Daarnaast is onduidelijkheid in de huidige logging-UI (aan/uit-state en werking van de 4-uurs privacy-timebox) een blokkade voor betrouwbaar gebruik tijdens testen.

## Gewenste uitkomst

Logging voor de bestaande AIQS OpenAI-calls is aantoonbaar zichtbaar in het OpenAI API-dashboard (bij ingeschakelde logging), zodat tests in de praktijk traceerbaar zijn.
De fallback in eigen logging blijft aantoonbaar werken.

De logging-bediening in AIQS is helder en laagdrempelig: een duidelijke aan/uit-keuze met begrijpelijke statusweergave en expliciete 4-uurs vervaltijd, zodat direct duidelijk is of logging actief is.

## Waarom nu

- Dit is de basis om tijdens live testen gericht verbeteringen te kunnen doen.
- Zonder zichtbare logging blijft AIQS-iteratie te blind en te traag.
- Het ondersteunt de bewijs-gedreven afronding van de huidige consumer-beta fase.

## In scope

- Valideren dat bestaande AIQS-calls in OpenAI dashboard-logging terechtkomen en leesbaar zijn.
- Valideren dat fallback-logging voor dezelfde calls beschikbaar blijft.
- Logging-toggle/controls in AIQS admin vereenvoudigen en status expliciet maken.
- Expliciteren dat logging na 4 uur automatisch uitgaat (privacy-default).
- Runtime-bewijs vastleggen van logging aan/uit + zichtbaar resultaat.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AI-task families.
- Uitbouw naar volledige observability-suite of nieuwe review-workflow.
- End-user loggingfeatures buiten AIQS admin.

## Concrete checklist

- [ ] Huidige loggingpaden voor AIQS-calls inventariseren (OpenAI dashboard + fallback).
- [ ] End-to-end valideren dat dashboard logging zichtbaar is bij actieve logging-toggle.
- [ ] Fallback logging valideren voor dezelfde flow en failure-/degradatiescenario.
- [ ] Logging-toggle UX versimpelen met duidelijke aan/uit-status en 4-uurs indicatie.
- [ ] Bewijs vastleggen met concrete testresultaten voor aan/uit-gedrag en zichtbaarheid.

## Blockers / afhankelijkheden

- Toegang tot productieomgeving en OpenAI API-dashboard loggingweergave.
- Afstemming met admin-only guardrails uit `docs/project/ai-quality-studio.md`.

## Verify / bewijs

- Runtime-validatie van logging aan/uit in AIQS admin.
- Aantoonbare logging in OpenAI dashboard voor bestaande calls.
- Aantoonbare fallback logging voor dezelfde testcases.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/project/current-status.md`
- `docs/project/open-points.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge

- 2026-04-29T00:14:29+02:00 — docs: sync task commit logs

- 2026-04-29T01:47:27+02:00 — fix: diagnose Android photo prepare regression

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-01T11:08:03+02:00 — feat: add admin capability access control

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Budio webapp compatible maken

- Path: `docs/project/25-tasks/open/budio-webapp-compatible-maken.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-budio-webapp-compatible-maken
title: Budio webapp compatible maken
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Implementeer PWA-installatieprompt voor webgebruikers om de app als desktop-app te installeren, met modal, cookie-onthouding en instellingenoptie."
tags: [pwa, webapp, installatie, modal, cookie]
workstream: app
due_date: null
sort_order: 10
---


## Probleem / context

Gebruikers van de webversie kunnen de app momenteel niet eenvoudig installeren als Progressive Web App (PWA) op hun desktop. Dit beperkt de gebruikerservaring, vooral voor Android-gebruikers die geen native app beschikbaar hebben. Een installatieprompt zou de toegankelijkheid verbeteren en de app meer app-achtig maken.

## Gewenste uitkomst

Wanneer een gebruiker is ingelogd en de webvariant gebruikt, en PWA-installatie beschikbaar is maar nog niet geïnstalleerd, toon dan een modal met de vraag om de app op de desktop te installeren. Als de gebruiker weigert, onthoud dit met een cookie zodat de prompt niet herhaald wordt. De gebruiker kan de installatieoptie altijd heractiveren via instellingen. Gebruik juiste iconen, naam en manifestinstellingen voor een professionele installatie-ervaring.

## Waarom nu

- We hebben nog geen Android en iOS apps beschikbaar, dus voor Android-gebruikers (zoals ikzelf) is dit een handige tussenoplossing.
- Verbetert de gebruikerservaring op web zonder afhankelijk te zijn van app stores.
- Voorbereiding op bredere PWA-adoptie.

## In scope

- Bijwerken of aanmaken van web app manifest (manifest.json) met juiste iconen, naam en instellingen.
- Implementeren van PWA-installatie logica in de app (detectie van 'beforeinstallprompt' event).
- Creëren van een installatiemodal component met duidelijke call-to-action.
- Toevoegen van local storage om gebruikerskeuze te onthouden (niet tonen als geweigerd), wel altijd via menu -> instellingen alsnog weer activeren.
- Integreren van een toggle in instellingen scherm om installatieprompt te heractiveren.
- Testen op verschillende browsers (Chrome, Firefox, Safari) voor compatibiliteit.

## Buiten scope

- Ontwikkeling van native Android/iOS apps.
- Uitbreiding naar andere PWA-features zoals offline caching of push notifications (tenzij direct gerelateerd aan installatie).
- Browser-specifieke aanpassingen buiten standaard PWA-ondersteuning.

## Concrete checklist

- [ ] Onderzoek huidige PWA-compatibiliteit en manifest.json controleren/bijwerken.
- [ ] Implementeer 'beforeinstallprompt' event listener in app root (\_layout.tsx).
- [ ] Creëer PwaInstallModal component met installatieknop en 'later' optie.
- [ ] Voeg cookie-logica toe voor onthouden van gebruikerskeuze (gebruik js-cookie of native cookies).
- [ ] Integreer modal in hoofdapp flow (toon alleen voor ingelogde webgebruikers).
- [ ] Voeg toggle toe in instellingen scherm voor heractiveren van prompt.
- [ ] Test installatie op desktop browsers en controleer cookie-functionaliteit.
- [ ] Update documentatie indien nodig.

## Blockers / afhankelijkheden

- Geen blockers; kan parallel lopen met andere features.
- Afhankelijk van Expo/React Native Web voor PWA-ondersteuning (al aanwezig).

## Verify / bewijs

- Runtime-test: Open app in browser, controleer of installatieprompt verschijnt voor nieuwe gebruikers.
- Installatie-test: Klik op installeren en verificeer dat app als desktop-app wordt geïnstalleerd met juiste iconen.
- Cookie-test: Weiger installatie, refresh pagina en controleer dat prompt niet meer verschijnt; activeer via instellingen en test opnieuw.
- Browser-compatibiliteit: Test op Chrome, Firefox en Safari desktop.
- Code-review: Controleer manifest.json en installatielogica in repo.

## Relevante links

- `docs/project/open-points.md`
- [PWA Install Prompt Guide](https://web.dev/customize-install/)
- [Expo PWA documentation](https://docs.expo.dev/guides/progressive-web-apps/)


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Budio Workspace Command Room research en startpunt vastleggen

- Path: `docs/project/25-tasks/open/budio-workspace-command-room-research-en-startpunt-vastleggen.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-26

```md
---
id: task-budio-workspace-command-room-research-startpunt
title: Budio Workspace Command Room research en startpunt vastleggen
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-26
summary: Research- en startpunt vastleggen voor een lokale Budio Workspace Command Room die leert van Linear en Cline Kanban en later Codex-ready kan worden.
tags: [idea, research, plugin, workspace, linear, cline, codex]
workstream: plugin
epic_id: epic-budio-workspace-hierarchy-linear-lite
parent_task_id: null
depends_on: []
follows_after: []
task_kind: research
due_date: null
sort_order: 2
---






## Probleem / context

Er bestaat al een Linear-geïnspireerd Workspace-idee voor structuur, intake en views, maar nog geen expliciet research-startpunt voor een bredere local-first Command Room-richting die ook Cline Kanban en Codex als referenties meeneemt.

Zonder deze vastlegging blijft dit spoor te makkelijk hangen als losse chatcontext in plaats van als traceerbaar idee binnen de bestaande Budio Workspace- en pluginlaag.

## Gewenste uitkomst

Er staat één nieuw idea/research-document in `docs/project/40-ideas/40-platform-and-architecture/` dat de richting vastlegt voor een Linear-inspired, Codex-ready, local-first Budio Workspace Command Room.

Daarnaast bestaat er één backlog-task die dit startpunt traceerbaar maakt en expliciet koppelt aan het bestaande Linear-geïnspireerde Workspace-idee, zonder dat dit al actieve planning, pluginbouw of scopeverbreding wordt.

## Waarom nu

- Dit borgt een waardevol researchspoor zonder het voortijdig te promoveren naar actieve bouwscope.
- Het sluit logisch aan op het bestaande Linear Workspace-idee en de plugin-focus in de huidige fase.
- Het voorkomt dat Browser Shell-, Codex-runner- of Jarvis-discussies te vroeg door elkaar gaan lopen.

## In scope

- Idea-doc toevoegen op de gevraagde locatie.
- Taskfile toevoegen in `docs/project/25-tasks/open/`.
- Koppeling vastleggen naar `100-linear-geinspireerde-budio-workspace-structuurlaag.md`.
- Taskflow-, docs-bundle- en docs-bundle-verify uitvoeren.

## Buiten scope

- Codewijzigingen.
- Pluginbouw of wijzigingen in `tools/budio-workspace-vscode/**`.
- Browser shell bouwen.
- Codex runner bouwen.
- Worktrees uitwerken.
- Jarvis-scope verbreden.

## Oorspronkelijk plan / afgesproken scope

- Voeg precies één nieuw idea/research-document toe op basis van het aangeleverde Markdown-document.
- Maak precies één taskfile aan om dit startpunt traceerbaar te maken.
- Bewaar dit als proposal/idea en niet als actieve planning of implementatie.

## Expliciete user requirements / detailbehoud

- Gebruik `docs/project/README.md`, `docs/project/20-planning/50-budio-workspace-plugin-focus.md`, `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`, `docs/dev/cline-workflow.md`, `AGENTS.md` en `.agents/skills/task-status-sync-workflow/SKILL.md` als verplichte leesvolgorde.
- Taskfile moet `status: backlog`, `phase: transitiemaand-consumer-beta`, `priority: p2`, `workstream: plugin`, tags `[idea, research, plugin, workspace, linear, cline, codex]` en de opgegeven samenvatting krijgen.
- Niet raken: `tools/budio-workspace-vscode/**`, `app/**`, `components/**`, `services/**`, `supabase/**`, en `package.json` tenzij een bestaand verify-script aantoonbaar ontbreekt.
- `docs/upload/**` niet handmatig wijzigen; alleen via `npm run docs:bundle`.
- Verify sequentieel uitvoeren: `npm run taskflow:verify`, `npm run docs:bundle`, `npm run docs:bundle:verify`.
- Alleen als lint/typecheck standaard verplicht blijkt voor docs-only taken in deze repo: ook `npm run lint` en `npm run typecheck`.
- Commit alleen als verify slaagt.

## Status per requirement

- [ ] Nieuw idea/research-document aangemaakt — status: niet gebouwd
- [ ] Nieuwe backlog-task aangemaakt — status: niet gebouwd
- [ ] Koppeling aan bestaand Linear Workspace-idee vastgelegd — status: niet gebouwd
- [ ] Verify sequentieel uitgevoerd en gerapporteerd — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [ ] Blok 2: primair docs-artefact en taskfile toevoegen.
- [ ] Blok 3: gerichte verify en docs/taskstatus afronden.

## Concrete checklist

- [ ] Idea-doc toevoegen met aangeleverde inhoud.
- [ ] Taskfile toevoegen met juiste frontmatter en scopeafbakening.
- [ ] Backlog-sortering actualiseren zodat deze task bovenaan staat.
- [ ] Verify uitvoeren en output vastleggen.

## Blockers / afhankelijkheden

- Geen functionele blockers; alleen docs- en taskflow-discipline.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Indien repo-regels of tooling dat voor docs-only expliciet vereisen: `npm run lint` en `npm run typecheck`

## Reconciliation voor afronding

- Oorspronkelijk plan: één idea-doc en één taskfile toevoegen voor dit research-startpunt.
- Toegevoegde verbeteringen: geen.
- Afgerond: nog bij te werken tijdens uitvoering.
- Open / blocked: nog bij te werken tijdens uitvoering.

## Relevante links

- `docs/project/20-planning/50-budio-workspace-plugin-focus.md`
- `docs/project/40-ideas/40-platform-and-architecture/100-linear-geinspireerde-budio-workspace-structuurlaag.md`
- `docs/project/40-ideas/40-platform-and-architecture/110-budio-workspace-command-room-linear-codex-local-first.md`


## Commits

- ad43300 — chore: commit all remaining local changes

- 0b5c2d3 — feat: add workspace epic hierarchy

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Docs scheiden naar private repo (strategie + migratieplan)

- Path: `docs/project/25-tasks/open/docs-private-repo-scheiding-en-migratieplan.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-21

```md
---
id: task-docs-private-repo-scheiding-migratieplan
title: Docs scheiden naar private repo (strategie + migratieplan)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-21
summary: "Werk een besluitbaar plan uit om strategische docs naar een aparte private repo te verplaatsen (optie 2), met behoud van historie, workflow en AIQS-governance."
tags: [docs, governance, security, repo-structuur, planning]
workstream: idea
due_date: null
sort_order: 12
---





## Probleem / context

De projectdocs bevatten geen secrets, maar wel gevoelige interne strategie en governance (zoals commerciële richting, AIQS-governance, admin-gedrag, en toekomstige productsporen). Zolang docs in dezelfde repo leven als runtime-code, ontstaat risico bij eventueel publiek delen van de hoofdrepo.

## Gewenste uitkomst

Een concreet en uitvoerbaar migratieplan voor optie 2: docs onderbrengen in een aparte private repo binnen dezelfde workspace, inclusief heldere werkwijze voor sync met code, toegang, historiebehoud en updateflow.

Het resultaat van deze taak is een besluit- en uitvoeringskader; geen directe technische migratie in deze taak.

## Waarom nu

- Strategisch belangrijk voor private beta en toekomstige commerciële positionering.
- Voorkomt dat gevoelige roadmap/governance-data onbedoeld meebeweegt bij eventueel publiek delen van code.
- Houdt productwaarheid en docs-kwaliteit intact zonder drastische kennisverliesoptie.

## In scope

- Uitwerken van het doelbeeld voor een aparte private docs-repo in dezelfde workspace.
- Vergelijken van implementatievarianten (submodule vs aparte clone) op workflow-impact.
- Definiëren van migratieaanpak met behoud van historie en duidelijke eigenaarschap.
- Vastleggen van operationele aanpassingen in workflowregels (`AGENTS.md` / `docs/dev/**`) voor werken met 2 repos.
- Opstellen van risicoanalyse, rollbackstrategie en acceptatiecriteria voor go/no-go.

## Buiten scope

- Direct verplaatsen van bestaande docsbestanden.
- Aanpassen van runtime-code, API's of database.
- Open-source/public repo-strategie volledig uitvoeren binnen deze taak.

## Concrete checklist

- [ ] Inventariseer welke documenttypes gevoelig zijn en welke in hoofdrepo kunnen blijven.
- [ ] Werk variantvergelijking uit: submodule vs aparte clone (developer UX, CI, onderhoud, risico).
- [ ] Definieer aanbevolen doelarchitectuur met folderstructuur en sync-afspraken.
- [ ] Beschrijf stapsgewijze migratieflow inclusief geschiedenisbehoud en rollback.
- [ ] Definieer governance-updates voor werken met aparte docs-repo.
- [ ] Leg promotiecriteria vast voor uitvoering als vervolgtaak (ready/in_progress).

## Blockers / afhankelijkheden

- Afhankelijk van expliciet gebruikersbesluit op de aanbevolen variant.
- Afstemming nodig over toekomstige publiek/private repo-strategie.

## Verify / bewijs

- Documentair bewijs: uitgewerkt migratievoorstel met variantenanalyse en besluitadvies.
- Governancebewijs: expliciete workflowregels voor 2-repo samenwerking en wijzigingscontrole.
- Planningbewijs: traceerbare opvolging in tasklaag zonder premature uitvoering.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/README.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Entry photo gallery volledige end-user E2E flows

- Path: `docs/project/25-tasks/open/entry-photo-gallery-volledige-end-user-e2e-flows.md`
- Bucket: open
- Status: ready
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-entry-photo-gallery-volledige-end-user-e2e-flows
title: Entry photo gallery volledige end-user E2E flows
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Breid de huidige gallery-smoke basis en de recente viewer/reorder-validatie uit naar een volledige end-user E2E-suite voor toevoegen, echte delete-mutatie, max-limiet en unhappy/error flows."
tags: [qa, tests, gallery, photos, e2e]
workstream: app
due_date: null
sort_order: 2
---








## Probleem / context

De eerste gallery QA-basis bewijst inmiddels de kerninteractie voor thumbnail-reorder, viewer-openen en delete-cancel op lokale fixtures. Daarnaast is de with-photos state van momentdetail runtime bevestigd via een aparte local-only historical fixture.

De volledige end-user dekking voor alle gallery-flows bestaat nog niet. Vooral toevoegen, echte delete-mutatie, max-limiet en expliciete unhappy/error paden missen nog als reproduceerbare suite.

Voor toekomstige gallery-wijzigingen willen we kunnen kiezen tussen:

- een snelle smoke-test die bewijst dat de belangrijkste interactie niet kapot is
- een volledige end-user test die alle vastgelegde use cases en unhappy paths doorloopt

## Gewenste uitkomst

Er is een volledige Playwright end-user suite voor entry photo gallery flows. De suite gebruikt reproduceerbare local-only seed/cleanup helpers en kan opnieuw gedraaid worden wanneer dit scherm of de gallery-services wijzigen.

## Waarom nu

- De reorder-bug liet zien dat lint/typecheck onvoldoende zijn voor complexe interactie.
- De basis-smoke is klaar; de volgende kwaliteitsstap is volledige flowdekking.
- Dit ondersteunt de 80% coverage/KPI-richting zonder legacy-code ineens repo-breed te blokkeren.

## In scope

- Local seed/cleanup uitbreiden voor add/delete/max/error scenario's.
- E2E-dekking voor:
  - foto's toevoegen
  - max 5 foto's en disabled/limietgedrag
  - viewer openen/sluiten
  - foto verwijderen en annuleren
  - thumbnail reorder links/rechts
  - persist-fout of service-error pad waar lokaal veilig te simuleren
- Heldere run-instructies in `docs/dev/qa-test-strategy.md`.

## Buiten scope

- Native iOS/Android E2E.
- Repo-brede coverage gate voor legacy code.
- Nieuwe productfunctionaliteit buiten bestaande gallery-flows.

## Concrete checklist

- [ ] Full E2E seed/cleanup fixtures ontwerpen.
- [ ] Add-flow testen.
- [ ] Delete/cancel-flow testen.
- [ ] Max-limiet testen.
- [ ] Viewer-flow testen.
- [ ] Reorder links/rechts testen.
- [ ] Minstens één unhappy/error flow testen of expliciet onderbouwen waarom lokaal niet veilig simuleerbaar.
- [ ] Docs/runbook bijwerken.
- [ ] Verify draaien.

## Blockers / afhankelijkheden

- Vereist draaiende lokale webserver, Supabase local stack en Mailpit auth-flow.

## Review-notitie 2026-05-15

- Deze task blijft open; het recente momentdetail/foto-werk heeft hem niet volledig opgelost.
- Wel al ingehaald door recent bewijs:
  - reorder smoke via `tests/e2e/gallery-smoke.spec.mjs`
  - viewer-open + delete-cancel via `tests/e2e/gallery-full.spec.mjs`
  - tijdelijke historical with-photos fixture via `scripts/seed-local-historical-entry-photo-detail-smoke.mjs`
- Restscope van deze task is daardoor smaller dan voorheen:
  - add-flow
  - echte delete-mutatie
  - max-limiet
  - unhappy/error paden
  - eventuele runbook-/docs-afronding voor de volledige suite

## Verify / bewijs

- ⏳ `npm run test:e2e:gallery:full`
- ⏳ `npm run lint`
- ⏳ `npm run typecheck`
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `tests/e2e/gallery-full.spec.mjs`
- `scripts/seed-local-entry-photo-gallery-smoke.mjs`
- `docs/dev/qa-test-strategy.md`


## Commits

- ad43300 — chore: commit all remaining local changes

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Moment detail foto-upload Android Chrome prepare regressie

- Path: `docs/project/25-tasks/open/moment-detail-foto-upload-android-chrome-prepare-regressie.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-moment-detail-foto-upload-android-chrome-prepare-regressie
title: Moment detail foto-upload Android Chrome prepare regressie
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "De regressie-follow-up is verbreed van kleine hardening naar een structurele web/Android fix: momentdetail gebruikt nu een browser File API fallback op web, materialiseert bytes direct in de prepare-pipeline, scheidt gallery-load errors van action-errors en logt alleen privacyveilige prepare-context. Productie upload/delete smoke en lokale browser-smokes voor multi-add/delete plus read-failure fallback zijn nu geslaagd."
tags: [moment-detail, photos, android, chrome, production, regression, diagnostics]
workstream: app
epic_id: null
parent_task_id: task-moment-detail-foto-upload-productieflakiness-onderzoek
depends_on: []
follows_after: [task-moment-detail-foto-upload-productieflakiness-onderzoek]
task_kind: task
spec_ready: true
due_date: null
sort_order: 6
---












## Probleem / context

Op `2026-04-28` trad opnieuw een productiebug op bij foto toevoegen aan een bestaand moment via Android Chrome en de Google Photos / Android photo picker. Desktop Chrome werkt in dezelfde flow wel.

De afgeronde task `docs/project/25-tasks/done/moment-detail-foto-upload-productieflakiness-onderzoek.md` heeft de prepare-fase eerder gehard en productie-smoke bevestigd, maar liet expliciet open welke exacte `upload_prepare`-substap op een echt Android toestel faalde. Die onbevestigde nuance is nu de kern van deze regressie-follow-up.

## Gewenste uitkomst

De moment detail foto-upload op Android Chrome faalt niet meer op fragiele web picker-assets. Web/browser prepare werkt primair op direct gematerialiseerde bytes uit een echte `File`/blob-bron en niet langer op een langdurig hergebruikte picker-`uri`.

Als de prepare-fase toch stukloopt, logt de flow bronvast welke prepare-stap faalde (`source_materialize`, `source_validate`, `display_prepare`, `thumb_prepare`) plus coarse picker/runtime-context, zonder raw image data, base64 of volledige lokale paden vast te leggen.

## User outcome

Een gebruiker kan op Android Chrome weer betrouwbaar een foto toevoegen aan een bestaand moment, ook wanneer de picker een Google Photos of andere web-backed asset levert.

## Functional slice

Eén afgebakende regressieslice: web/Android picker-input structureel materialiseren, upload-prepare opsplitsen in duidelijke pipeline-stappen, browser File API fallback inzetten voor momentdetail-web en gallery-brede foutstates loskoppelen van één mislukte nieuwe upload.

## Entry / exit

- Entry: productie moment detail route `/entry/[id]?source=capture&date=2026-04-28` op Android Chrome, foto kiezen via Google Photos / Android picker, zichtbare fout rond preprocessing / `Foto voorbereiden mislukte.`
- Exit: prepare-flow verwerkt web picker-assets robuuster, bronvaste prepare diagnostics zijn aanwezig en verify is groen; handmatige Android productie-smoke blijft expliciet open als laatste bewijsstap.

## Happy flow

1. Android Chrome kiest een foto via library/picker en levert een bruikbare web bron (`file`/blob of stabiele fallback-uri).
2. De gallery prepare-flow maakt display- en thumb-bytes zonder stille URI-fragiliteit.
3. Upload en refresh lopen door, of een eventuele prepare-fout logt exact welke substap faalde.

## Non-happy flows

- Picker levert wel metadata maar geen bruikbare bestand-/blobbron.
- Picker levert een zero-size asset of ontbrekende/unsupported image MIME.
- Image manipulation of byte-extractie faalt per substap (`display_*`, `thumb_*`, validate/read/source).
- Android laadt mogelijk een oudere productiebuild; dit wordt niet als primaire oorzaak behandeld, maar wel zichtbaar gemaakt via coarse runtime/build-context in diagnose en handmatige smoke.

## UX / copy

- User-facing prepare-foutcopy voor Android/web read-failures wordt rustig en expliciet: `Foto voorbereiden mislukte. Kies de foto opnieuw of download hem eerst naar je toestel.`
- `Foto's zijn nu niet beschikbaar` wordt alleen nog gebruikt wanneer de gallery zelf niet geladen kan worden, niet bij één mislukte nieuwe upload.
- Geen redesign van gallery, picker of moment detail UI.

## Data / IO

- Input: picker asset met `uri`, `mimeType`, `fileName`, `fileSize`, dimensies en optioneel web `file`/blob-achtige bron.
- Output: display/thumb bytes plus prepare-diagnostiek met `prepareStep`, `prepareCode`, picker bronclassificatie, uri-scheme, extension, filesize-bucket, browser/OS-context, service worker state en app-version hint indien beschikbaar.
- Opslag/API/service-impact: primair `components/journal/entry-photo-gallery.tsx`, `src/lib/entry-photo-gallery/prepare.ts`, `src/lib/entry-photo-gallery/flow.ts` en `src/lib/entry-photo-gallery/web-picker.ts`; `services/entry-photos.ts` bleef ongewijzigd.
- Statussen: bestaande uploadfasen blijven gelijk, maar `upload_prepare` onderscheidt nu expliciet pipeline-step en failure-code.

## Waarom nu

- De regressie is productie-relevant en treft een bestaande MVP-flow op Android.
- De vorige task loste de flakiness deels op, maar liet precies dit Android prepare-detail onbevestigd open.
- Zonder bronvaste substapdiagnostiek blijft diagnose hangen tussen web picker-input, manipulator en byte-reading.

## In scope

- Nieuwe follow-up task aanmaken en koppelen aan de relevante done-tasks.
- Prepare diagnostics uitbreiden met veilige coarse metadata en vaste log-prefix.
- Structurele web/Android hardening voor fragiele picker references in de bestaande gallery-flow.
- Web-only browser File API fallback toevoegen voor momentdetail upload/camera-keuze.
- Error-state scheiding: gallery-load versus failed add/delete/reorder.
- Gerichte unit-tests voor Android/web picker edge cases.
- Taskfile bijwerken met diagnose, fix, verify en open handmatige Android smoke.

## Buiten scope

- Geen redesign van foto-gallery of moment detail.
- Geen nieuwe fotofeatures, captions, albums, reorder-uitbreiding of bulkbeheer.
- Geen nieuwe dependency tenzij hard technisch noodzakelijk.
- Geen DB-migratie of brede uploadarchitectuurherschrijving.
- Geen aanpassing aan algemene captureflow buiten moment-detail foto-upload.

## Oorspronkelijk plan / afgesproken scope

- Behandel dit als nieuwe regressie-follow-up task, niet als stille heropening van de eerdere done-task.
- Bevestig exact welke `upload_prepare`-substap faalt op Android/web picker-assets.
- Voeg minimale, productie-veilige diagnostiek toe zonder raw image data.
- Bouw een structurele prepare-fix zodra bevestigd is dat de webflow te fragiel op picker-`uri` vertrouwt.
- Voeg of update gerichte tests; laat bredere web/PWA-cache of uploadarchitectuur buiten scope.

## Expliciete user requirements / detailbehoud

- Lees eerst:
  - `docs/project/README.md`
  - `AGENTS.md`
  - `docs/dev/cline-workflow.md`
  - `docs/project/25-tasks/done/moment-detail-foto-upload-productieflakiness-onderzoek.md`
  - `docs/project/25-tasks/done/moment-entry-fotos-galerij-beveiligde-upload.md`
- Onderzoek relevante codepaden:
  - `components/journal/entry-photo-gallery.tsx`
  - `services/entry-photos.ts`
  - `src/lib/entry-photo-gallery/flow.ts`
  - `tests/unit/entry-photo-gallery-flow.test.ts`
  - `tests/e2e/gallery-prod-upload.spec.mjs`
  - `package.json`
- Bevestig exact welke prepare-substap faalt op Android/web picker-assets:
  - picker input
  - display manipulate
  - thumb manipulate
  - display bytes
  - thumb bytes
  - MIME/type/filename/filesize/hasFile/URI scheme
- Voeg minimale diagnostiek toe die productie veilig kan loggen zonder gevoelige data of raw image data.
- Bouw alleen een kleine robuustheidsfix als de oorzaak of waarschijnlijke oorzaak duidelijk is.
- Zorg dat user-facing foutcopy rustig blijft.
- Voeg of update gerichte tests.
- In verify:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:unit -- tests/unit/entry-photo-gallery-flow.test.ts`
  - `npm run taskflow:verify`
  - `npm run docs:bundle`
  - `npm run docs:bundle:verify`
- Laat handmatige Android productie-smoke expliciet open voor:
  - recente camerafoto
  - screenshot
  - Google Photos cloud-backed foto
  - eventueel HEIC/WebP

## Status per requirement

- [x] Nieuwe regressie-follow-up task aangemaakt en gekoppeld aan eerdere done-task — status: gebouwd
- [x] Exacte `upload_prepare`-substap bronvast onderscheiden op Android/web picker-assets — status: gebouwd
- [x] Veilige coarse prepare diagnostics toegevoegd — status: gebouwd
- [x] Structurele web/Android prepare-fix gebouwd zonder gallery/service redesign — status: gebouwd
- [x] Browser File API fallback voor momentdetail-web toegevoegd — status: gebouwd
- [x] Gallery-wide unavailable state niet meer gebruikt voor één mislukte nieuwe upload — status: gebouwd
- [x] Gerichte unit-tests voor Android/web picker edge cases toegevoegd — status: gebouwd
- [x] Volledige verify gedraaid en handmatige Android smoke expliciet open gelaten — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- De prepare-flow is opgesplitst in expliciete stappen: `picker_selected`, `source_materialize`, `source_validate`, `display_prepare`, `thumb_prepare`, `upload_ready`.
- `upload_prepare` logt nu met vaste prefix `[entry-photo:prepare]` een coarse diagnostisch pakket met `flowId`, `prepareStep`, `prepareCode`, picker bronclassificatie, uri-scheme, mime, extension, filesize-bucket, browser/OS-context, `hasServiceWorkerController` en app-version hint.
- Momentdetail gebruikt op web een eigen browser File API route (`<input type="file" accept="image/*">`) voor library en camera, zodat we direct met een echte `File` werken.
- Web prepare materialiseert bytes nu direct via `arrayBuffer()` en bouwt daaruit een eigen stabiele object URL voor image preprocessing.
- Gallery-load errors en action-errors zijn gescheiden, zodat bestaande foto's zichtbaar blijven wanneer één nieuwe add faalt.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow en regressiecontext vastleggen.
- [x] Blok 2: structurele web/browser prepare-pipeline en fallback implementeren.
- [x] Blok 3: gerichte tests, volledige verify en taskfile-updates afronden.

## Concrete checklist

- [x] Taskfile aangemaakt en bovenaan `in_progress` lane gezet.
- [x] Prepare diagnostics/helpers uitgebreid met web picker context.
- [x] Gallery prepare-flow structureel omgezet naar vroege byte-materialisatie voor web assets.
- [x] Browser File API fallback toegevoegd voor momentdetail-web upload/camera.
- [x] Gallery/action error states gescheiden zodat bestaande foto's zichtbaar blijven.
- [x] Unit-tests uitgebreid voor prepare-step, prepare-code en web source-materialisatie.
- [x] Verify en taskflow/docs scripts gedraaid.
- [x] Taskfile bijgewerkt met definitief verify-bewijs en open handmatige smoke.

## Acceptance criteria

- [x] `upload_prepare` errors onderscheiden minimaal de relevante substap of validatiefout op web/Android picker-input.
- [x] Productie-veilige prepare logging bevat geen raw image data, maar wel voldoende picker/runtime-context om Android regressies bronvast te maken.
- [x] Web prepare werkt primair met stabiele bytes/object URL vanuit `File`/blob, niet met fragiele picker-URI-only aannames.
- [x] Browser File API fallback is aanwezig voor momentdetail-web wanneer webpicker-bronnen fragiel zijn.
- [x] Bestaande foto's verdwijnen niet bij een failed upload; gallery-wide unavailable state wordt niet gebruikt voor één mislukte add.
- [x] User-facing foutcopy blijft rustig en niet-technisch.
- [x] Gerichte unit-tests en verify zijn groen; handmatige Android smoke staat expliciet nog open als bewijsstap.

## Blockers / afhankelijkheden

- Handmatige Android productie-smoke op echt toestel blijft afhankelijk van user/device-toegang.
- Geen andere blockers meer voor repo- of browserbewijs; alleen echt Android toestelbewijs blijft open.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run test:unit -- tests/unit/entry-photo-gallery-flow.test.ts`
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
- ✅ `GALLERY_E2E_PROD=1 npm run test:e2e:gallery:prod-upload`
  - geslaagd op `2026-05-15`
  - upload + cleanup op de productie fixture-entry bevestigd
- ✅ lokale fixture-seed `node scripts/seed-local-entry-photo-gallery-smoke.mjs`
  - geslaagd op `2026-05-15`
- ✅ lokale browser-smoke `tests/e2e/gallery-full.spec.mjs`
  - `adds two photos and removes them again on the local fixture entry`
  - geslaagd op `2026-05-15`
- ✅ lokale failure-regressietest `tests/e2e/gallery-full.spec.mjs`
  - `keeps existing photos visible when a new web upload fails during file-byte materialization`
  - geslaagd op `2026-05-15`
- Handmatige productie-smoke blijft open en noteert per run:
  - slaagt/faalt
  - foutcopy
  - browser/device
  - foto-origin
  - datum/tijd NL
  - flowId / prepare-logregel
  - deploy/header-sporen indien beschikbaar

## Diagnose / bevestigde oorzaak

- `bevestigd`: de zichtbare foutcopy blijft gekoppeld aan `upload_prepare`; de follow-up richt zich dus bewust op de client-side prepare-laag.
- `bevestigd`: de web/Android flow las de echte bytes niet vroeg genoeg veilig vast; verdere prepare-stappen konden daardoor alsnog leunen op een verlopen of onleesbare picker-reference.
- `bevestigd`: Google Photos / Android picker / cloud-backed assets werden in de webflow nog te veel behandeld alsof de picker-`uri` of latere manipulator-`uri` stabiel genoeg was voor vervolgreads.
- `bevestigd`: de oude component gebruikte één generieke `error` state voor gallery-load én nieuwe upload failures, waardoor één mislukte add de gallery-brede melding `Foto's zijn nu niet beschikbaar` kon tonen.
- `bevestigd`: de eerdere task had al `display_*` en `thumb_*` substappen, maar onderscheidde nog niet expliciet vroege pipeline-fases zoals `source_materialize` en `source_validate`.
- `onbevestigd`: de exacte echte productie-substap op het Android toestel van `2026-04-28` blijft zonder nieuwe toestel-smoke/logcapture nog onbewezen; de code logt die substap nu wel bronvaster zodra de flow opnieuw wordt doorlopen.

## Fix

- `src/lib/entry-photo-gallery/flow.ts`
  - prepare-diagnostiek onderscheidt nu `prepareStep` en `prepareCode`
  - rustige user copy voor `picker_file_read` en vergelijkbare web read-failures wordt centraal gemapt
  - `EntryPhotoErrorDiagnostics` uitgebreid met prepare/runtimevelden en app-version hint voor veilige bronvaste logging
- `src/lib/entry-photo-gallery/prepare.ts`
  - nieuwe prepare-helper materialiseert web `File`/blob bytes direct, bouwt daaruit een eigen stabiele object URL en laat alle verdere preprocessing daarop draaien
  - validatie voor zero-size, unsupported type en missing source gebeurt vóór image manipulation
  - display/thumb preprocessing gooit nu structurele `EntryPhotoPrepareError` waarden met expliciete step/code in plaats van losse message parsing
- `src/lib/entry-photo-gallery/web-picker.ts`
  - nieuwe web-only browser File API route voor library/camera-selectie in momentdetail zonder extra dependency
- `components/journal/entry-photo-gallery.tsx`
  - web gebruikt nu de browser File API fallback in plaats van de Expo web picker-route voor momentdetail photo add/camera
  - action errors zijn gescheiden van gallery-load errors, zodat bestaande foto's zichtbaar blijven bij een failed add/delete/reorder
  - prepare-fouten krijgen nu coarse picker/runtime-diagnostics en worden gelogd onder `[entry-photo:prepare]` zonder raw uri of lokale paden
- `tests/unit/entry-photo-gallery-flow.test.ts`
  - helpertests toegevoegd voor file-like en blob-like materialisatie, uri-only read-failure, zero-size, unsupported mime, prepare-step/code classificatie en rustige prepare-copy
- `tests/e2e/gallery-full.spec.mjs`
  - lokale regressietest toegevoegd die een mislukte `File.arrayBuffer()` simuleert en borgt dat bestaande foto's zichtbaar blijven zonder gallery-wide unavailable state
  - extra lokale smoke toegevoegd voor twee uploads + twee deletes op een seeded fixture-entry

## Reconciliation voor afronding

- Oorspronkelijk plan: nieuwe regressie-follow-up task, bronvaste prepare-diagnostiek, structurele web-picker fix en gerichte tests.
- Toegevoegde verbeteringen: browser File API fallback, expliciete prepare step/code modellering, gescheiden gallery/action error states en coarse runtime/build-context (`browser`, `OS`, `hasServiceWorkerController`, `appVersionHint`).
- Afgerond:
  - prepare diagnostics/helpers
  - structurele web/browser byte-materialisatie
  - browser File API fallback voor momentdetail-web
  - gallery/action error-state scheiding
  - gerichte unit-tests
  - lint, typecheck, taskflow en docs verify
  - lokale browser-smokes voor multi-add/delete en failed add fallback
  - productie upload/delete smoke
- Open / blocked:
  - handmatige Android productie-smoke op echt toestel
  - bevestiging welke prepare-substap in echte productie nu optreedt of juist niet meer optreedt

## Relevante links

- `docs/project/25-tasks/done/moment-detail-foto-upload-productieflakiness-onderzoek.md`
- `docs/project/25-tasks/done/moment-entry-fotos-galerij-beveiligde-upload.md`
- `components/journal/entry-photo-gallery.tsx`
- `src/lib/entry-photo-gallery/flow.ts`
- `src/lib/entry-photo-gallery/prepare.ts`
- `src/lib/entry-photo-gallery/web-picker.ts`


## Commits

- 2026-04-29T01:47:27+02:00 — fix: diagnose Android photo prepare regression

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-15T10:09:20+02:00 — fix: harden moment detail web photo uploads

- 2026-05-15T14:36:40+02:00 — test: verify local entry photo gallery flows

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-01T11:08:03+02:00 — feat: add admin capability access control

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## MVP admin + AIQS productie bundel

- Path: `docs/project/25-tasks/open/mvp-admin-aiqs-productie-bundel.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-02

```md
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
sort_order: 11
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

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## niet vergeten

- Path: `docs/project/25-tasks/open/niet-vergeten.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-niet-vergeten
title: niet vergeten
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "screenshots van Flow verwerken tot ideeen. todo, ideeen etc taggen in momenten tekst en bijbehorende schermen uitdenken in AIQS en Budio."
tags: []
workstream: idea
due_date: null
sort_order: 11
---




# niet vergeten

## Probleem / context

Beschrijf kort welk concreet gat, risico of uitvoeringsprobleem deze taak oplost.

## Gewenste uitkomst

Beschrijf in 1-3 korte alinea's wat klaar moet zijn wanneer deze taak done is.

## Waarom nu

- Waarom deze taak nu relevant is voor de actieve fase.

## In scope

- Concreet werk dat binnen deze taak valt.

## Buiten scope

- Werk dat bewust niet in deze taak zit.

## Concrete checklist

- [ ] Eerste concrete stap
- [ ] Tweede concrete stap

## Blockers / afhankelijkheden

- Geen of nog te bepalen.

## Verify / bewijs

- Noem hier de relevante verify-, runtime- of doc-bewijzen.

## Relevante links

- `docs/project/open-points.md`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## npm audit kwetsbaarheden beoordelen en saneren

- Path: `docs/project/25-tasks/open/npm-audit-kwetsbaarheden-beoordelen-en-saneren.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-23

```md
---
id: task-npm-audit-kwetsbaarheden-beoordelen-en-saneren
title: npm audit kwetsbaarheden beoordelen en saneren
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-23
summary: "Beoordeel de huidige npm audit meldingen na de testinfra-uitbreiding, bepaal welke runtime-relevant zijn, en saneer alleen de passende dependency-updates zonder onnodige brekende sprongen."
tags: [npm, audit, dependencies, security]
workstream: app
due_date: null
sort_order: 3
---


## Probleem / context

Na `npm install` onder Node 24 rapporteert npm nog steeds `14 vulnerabilities (13 moderate, 1 high)`. Deze zijn in deze ronde bewust niet inhoudelijk opgelost, omdat de actieve taak alleen GitHub Actions/Node-align en workflow-hardening betrof.

## Gewenste uitkomst

Er ligt een bron-gebaseerde beoordeling van de npm audit meldingen, inclusief onderscheid tussen:

- direct runtime-risico
- dev-only/tooling-risico
- fixes die veilig zijn
- fixes die breaking of scope-te-groot zijn

## Waarom nu

- De waarschuwing is actueel bevestigd op 2026-04-23.
- Testinfra en tooling zijn net uitgebreid.
- Dependency-onderhoud moet bewust gebeuren, niet stilzwijgend.

## In scope

- `npm audit` output analyseren.
- Impact per package/risk bepalen.
- Veilige sanering voorstellen of uitvoeren in een aparte uitvoerronde.

## Buiten scope

- Grote package-modernisering zonder expliciete keuze.
- Productcode refactors die alleen indirect uit dependency-upgrades voortkomen.

## Concrete checklist

- [ ] Audit-output vastleggen.
- [ ] Runtime vs dev-only risico scheiden.
- [ ] Veilige fixes bepalen.
- [ ] Beslissen welke fixes direct kunnen en welke een aparte grotere task vragen.

## Blockers / afhankelijkheden

- Nog te bepalen na concrete audit-output.

## Verify / bewijs

- ⏳ `npm audit`
- ⏳ relevante package verify

## Relevante links

- `package.json`
- `package-lock.json`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Budio Workspace activity-bar opent list view zonder workspace-menu

- Path: `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
- Bucket: open
- Status: in_progress
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-16

```md
---
id: task-plugin-activitybar-opent-list-view-zonder-workspace-menu
title: Budio Workspace activity-bar opent list view zonder workspace-menu
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-05-16
summary: "Het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in list view, maar de task is verbreed naar een structurele herziening van task-openen, detail-rendering, drag/sort interacties, actieve-agent zichtbaarheid, commit logging en multi-agent robuustheid. Na de sidebar-navigatie volgt nu ook een responsive list-view fix zodat smalle VS Code-webviews geen geperste desktop-tabel meer tonen en brede schermen consistente header/body alignment houden, inclusief structurele container-fixes voor globale muisscroll en correcte detail-pane-plaatsing naast de content."
tags: [plugin, vscode, list-view, activity-bar]
workstream: plugin
due_date: null
sort_order: 14
---






















# Budio Workspace activity-bar opent list view zonder workspace-menu

## Probleem / context

Wanneer de gebruiker op het Budio Workspace icoon in VS Code klikt, verschijnt nu eerst de oude `Workspace`-launcher/tussenlaag. Die route is verouderd en voegt geen waarde meer toe.

Daardoor voelt openen indirect en onnodig rommelig, terwijl de gewenste werkvorm juist is: direct de bestaande Budio Workspace window openen in de list view.

## Gewenste uitkomst

Klikken op het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in `list` view. De oude `Workspace`-launcher is uit de code en documentatie opgeruimd voor zover VS Code dit technisch toelaat.

Board blijft bestaan als secundaire view binnen de plugin en via het command palette, maar is niet meer de default open-route vanaf het icoon.

## Waarom nu

- Dit is een concrete UX-frictie in dagelijks gebruik van de plugin.
- De oude launcher-route zorgt voor verwarring en hoort niet meer bij de actuele pluginflow.
- Kleine plugin-polish is hier direct waardevol omdat deze extensie juist de dagelijkse uitvoeringslaag moet ondersteunen.

## In scope

- Activity-bar open-route laten landen in `list` view.
- Oude launcher/tussenlaag opruimen of minimaliseren tot alleen technisch noodzakelijke VS Code plumbing. Geen zijbalk openen/tonen die toch leeg is.
- Verouderde launcher-referenties uit extension-code en README verwijderen.
- Zorgen dat de webview-titel correct meebeweegt met de actieve view.

## Buiten scope

- Een volledige architectuurwissel naar een native sidebar-list in plaats van de bestaande panel/webview.
- Verwijderen van board of settings als beschikbare pluginviews.
- Nieuwe pluginfeatures buiten deze open-flow.

## Concrete checklist

- [x] Taskfile aangemaakt en op `in_progress` gezet.
- [x] Activity-bar open-flow aangepast naar `list`.
- [x] Oude launcher-code en manifestverwijzingen opgeschoond.
- [x] README bijgewerkt naar het nieuwe open-gedrag.
- [x] List-view header/filters/sort/refresh UI aangescherpt (icon-only refresh, sort-select in topbar, actieve sort-header, statuschips gecentreerd, gekleurde batchchips).
- [x] List-view kolomheaders sticky gemaakt zodat ze onder de topnav zichtbaar blijven tijdens scroll.
- [x] Actieve taak-indicator visueel versterkt in board cards en list rows.
- [x] Automatische refresh/selectie-behoud aangescherpt voor repo- en agentgedreven markdownwijzigingen.
- [x] `Due` vervangen door `Last change` in de list view (datum-only, sorteert op wijzigingsdatum).
- [x] Checklist progress compacter en visueel consistenter gemaakt met gedeelde kleurbanden.
- [x] Plugin opent standaard met `Alleen open` actief.
- [x] Linker rail omgezet naar icon-first navigatie.
- [x] Detail pane uitbreidbaar gemaakt met resize handle en fullscreen toggle (basis aanwezig).
- [x] Agent activity zichtbaar gemaakt in list/board task-overzichten via gedeeld helperpatroon.
- [x] Rail refresh-knop gelijkgetrokken met de andere icon-buttons.
- [x] `Last change` compact gemaakt (`Apr 25`) zodat de datum niet over twee regels breekt.
- [x] Drag-vs-click structureel gescheiden zodat slepen niet meer meteen task detail opent.
- [x] VS Code-sidebar/menu-structuur als primaire pluginnavigatie gebruiken met Board, List, Epics, Settings en Refresh; bestaande content blijft inhoudelijk ongewijzigd.
- [ ] Task-openen en tonen structureel herzien: openen altijd in het taakvlak boven board/lane of list (niet in een lege placeholder rechts naast board/list).
- [ ] Selectiebug herstellen: klikken op willekeurige task in board/list opent nu steeds dezelfde actieve kaart i.p.v. de aangeklikte task.
- [ ] Task-openen weer klikbaar en betrouwbaar maken in board + list na de structurele herbouw.
- [ ] Drag & drop voor lane/sortering in board + list volledig herstellen en valideren (nu niet klik/sleepbaar in runtime).
- [ ] Detailweergave volledig stabiel maken: klein scherm fullscreen, desktop side-pane met expliciete fullscreen-optie, zonder lege rechterkolom of overlap over list/board.
- [ ] Fullscreen-renderpath structureel los trekken van de side-pane render zodat fullscreen niet meer meedraait op de oude split-layout.
- [ ] Laatste rail-sizing check bevestigen zodat refresh exact dezelfde maat houdt als de andere rail-icon buttons.
- [ ] Handmatige smoke-check in de normale VS Code workspace bevestigd.

## Uitvoerblokken / fasering

### Fase 1 — Task-openen/tonen en interactief fundament structureel herbouwen

- task-openen/tonen volledig herzien: detail opent in het taakvlak boven lane/board of list, nooit in een losse rechter-placeholder
- selectie-state fixen zodat klik altijd de correcte aangeklikte task opent (niet de eerder actieve kaart)
- klik op tasks in board + list weer betrouwbaar maken
- drag-vs-click regressies herstellen zonder board/list drag-drop te breken
- board + list drag/drop voor lane + sortering robuust herstellen
- fullscreen detail als aparte render-layer buiten split-grid houden, samen met resize-state via kleine hook

### Fase 2 — Ordering + agent-activiteit end-to-end zichtbaar en robuust maken

- actieve taken automatisch bovenaan binnen hun statuskolom houden
- actieve taken in list lane-onafhankelijk bovenaan tonen
- bestaande `sort_order` per lane/status robuust herschrijven zonder cross-lane chaos (multi-agent veilig)
- agentstatus volledig zichtbaar maken in board, list én detail (incl. actieve state)
- sort/order helpers klein en testbaar houden

### Fase 3 — Commit logging + multi-agent hardening afronden

- `## Commits` automatisch vullen voor nieuwe commits (repo-script/hook pad)
- `## Agent activity` structureel maken in taskfile-output
- conflict-arm schrijven/hydrateren voor gelijktijdige agents bevestigen
- gerichte E2E/smoke-check uitvoeren in VS Code op openen, drag/drop, fullscreen en ordering
- verify-flow afronden

## Status tegen uitgebreid plan uit deze sessie

## Toegevoegde verbeteringen tijdens uitvoering

- Gebruik de linker VS Code-sidebar/menu-structuur als primaire pluginnavigatie, met alle huidige menu-items uit de topnavigatie erin. Content blijft ongewijzigd.
- De bestaande activity-bar/sidebar mag niet leeg blijven; de kleinste schone implementatie is een compacte sidebar-webview die de bestaande panelviews en refresh-actie opent zonder content-redesign.
- Maak de plugin list view responsive: grid-gebaseerde desktop/medium list met gedeelde kolombreedtes en een compacte card-row variant op smalle VS Code-webviews, zonder Board/Epics/Settings te redesignen.
- Corrigeer regressie uit de eerste responsive-ronde: list-scroll moet blijven werken en de toolbar/search-layout mag op smalle breedtes niet onnatuurlijk hoog worden.
- Herstel de plugin-shell containerlogica: muisscroll moet in alle views weer werken en task detail moet op desktop in een echte naastliggende pane openen in plaats van over bestaande content te vallen.

## Oorspronkelijk uitgebreid plan / detailbehoud

Onderstaande planstructuur is expliciet bewaard omdat deze later nog uitvoerwaarde heeft. Deze sectie is geen samenvatting, maar de bronreferentie voor het uitgebreide plan dat tijdens deze taak is afgesproken.

### A. Status- en sorteermodel uitbreiden

1. **Nieuwe status `review` toevoegen**
   - statusvolgorde: `backlog -> ready -> in_progress -> review -> blocked -> done`
   - `review` blijft in `open/`; alleen `done` verhuist naar `done/`
   - constants, parser, writer, repository, sort-policy, config, tests, taskflow-verify en docs-statusmodel bijwerken

1. **Manual sorting regels aanscherpen**
   - nieuwe taken komen standaard **bovenaan** in manual sorting
   - zodra een taak actief in uitvoering komt, wordt die automatisch **bovenaan zijn huidige statuskolom** gezet en in de list view, volledig boven aan de list, lane onafhankelijk.
   - dit moet robuust zijn bij **meerdere agents tegelijk**: bestaande `sort_order` herschrijven per lane/status, zonder cross-lane chaos
   - actieve taken staan dus bovenaan binnen hun statuskolom

### B. UI/UX plugin polish

3. **Due vervangen door Last change date**
   - list-kolom `Due` wordt `Last change`
   - altijd **datum-only**, geen tijd
   - nette visuele weergave en sortering op wijzigingsdatum

4. **Checklist verbeteren op board + list**
   - checklisttekst compacter/weg waar logisch
   - gedeelde progress-chip voor board + list
   - max **5 kleurbanden** op percentage
   - visueel rustiger en sneller scanbaar

5. **Default altijd alleen open taken tonen**
   - plugin opent met `onlyOpen = true`

6. **Linker rail opnieuw bouwen**
   - flush links, geen restbalkje
   - vaste icon-buttons, zonder tekst
   - gelijke maat, subtiele actieve state
   - logisch kleuronderscheid per functie

7. **Resizable detail pane op board + list**
   - subtiele drag handle links van detailpane
   - gebruiker kan breedte live aanpassen
   - visuele indicator klein maar duidelijk

8. **Fullscreen detail toggle op board + list**
   - knop naast menu-knop
   - toggle tussen normale split en fullscreen task detail
   - samenwerken met resize-gedrag

### C. Agent-activiteit zichtbaar maken

9. **Actieve agent indicator in board, list en detail**
   - chip/badge tonen als taak op dat moment actief door een agent bewerkt wordt
   - tonen van agentnaam: bijv. `Codex`, `Cline`, `Claude`, `Chat`
   - subtiele animatie zolang actief
   - zodra klaar: geen animatie en geen actieve chip meer

10. **Agent metadata opslaan in task-md**

Ik stel voor een vaste metadata- en sectiestructuur toe te voegen, bijvoorbeeld:

- frontmatter velden voor actuele agentstatus
- sectie voor historiek / referentie, zoals:
  - `## Agent activity`
  - `## Commits`

Daarin kunnen we per nieuwe activiteit vastleggen:

- agentnaam
- model
- relevante agent-instellingen / context
- start/stop-status waar zinvol

### D. Automatische commit logging voor nieuwe commits

11. **`## Commits` voorbereiden én automatisch vullen**

- repo-managed hook/script, geen losse lokale sample-hooks
- alleen **nieuwe commits**, geen historische backfill
- nieuwe commits worden toegevoegd aan relevante taskfile(s)
- stabiele auto-entry zonder commit-hash loggen in `## Commits` (`author date + subject`)

### E. Multi-agent robuustheid

12. **Concurrency-aanpak**

- task updates blijven file-version/checks respecteren
- agent-activiteit en sort-order updates moeten conflict-arm worden geschreven
- bij race/conflict: refresh/herhydrate pad behouden, geen stille overschrijvingen

## Verwachte implementatiestructuur uit het oorspronkelijke plan

- **helper** voor checklist-progress kleur/label
- **hook** voor detailpane resize/fullscreen state
- **task metadata uitbreiding** voor agent activity + commits
- **klein repo-script/hook** voor commit logging

## Oorspronkelijk verify-plan uit het uitgebreide plan

- `cd tools/budio-workspace-vscode && npm run typecheck`
- `cd tools/budio-workspace-vscode && npm run test`
- `cd tools/budio-workspace-vscode && npm run apply:workspace`
- `npm run taskflow:verify`
- omdat docs/statusmodel wijzigen:
  - `npm run docs:bundle`
  - `npm run docs:bundle:verify`

## Oorspronkelijke risico's uit het uitgebreide plan

- `review` + multi-agent + commit-logging samen maken dit groter dan een pure UI-polish
- actieve-agent chips vragen om een duidelijke bron van waarheid in task-md
- automatische sort-promotie bij status/activiteit moet netjes blijven werken met meerdere agents tegelijk

## Oorspronkelijke uitvoervolgorde in Act Mode

1. statusmodel + docs/taskflow (`review`)
2. sort/order regels voor nieuwe + actieve taken
3. last-change + checklist chips + open-only default
4. linker rail polish
5. resize + fullscreen detailpane
6. agent metadata + actieve chips
7. commit logging voor nieuwe commits
8. verify + plugin re-apply + taskfile bijwerken

## Expliciete user requirements / detailbehoud

- Filter `toon alleen open taken` is alleen zichtbaar in de filter van de **list-weergave** en wordt ook alleen daar toegepast; dit is niet relevant voor het board-scherm.
- Agent-activiteit moet visueel zichtbaar zijn in **board, list en task detail**, inclusief subtiele animatie zolang een taak actief door een agent wordt bewerkt.
- Bij code-review van requirementstatus geldt: als iets al in code bestaat dan moet dat als **user-review nodig** worden vastgelegd; anders blijft het **nog bouwen**.
- De uitgebreide requirements hieronder zijn expliciet relevant om later opnieuw op deze task te kunnen bouwen en mogen niet worden teruggebracht tot alleen een samenvatting.
- Punt 11 (`## Commits` automatisch vullen) en punt 12 (multi-agent concurrency) moeten als expliciete open requirements zichtbaar blijven zolang ze niet volledig zijn gebouwd; een reviewconclusie mag deze bronpunten niet vervangen.
- Gebruik de linker VS Code-sidebar/menu-structuur als primaire pluginnavigatie, met alle huidige menu-items uit de topnavigatie erin. Content blijft ongewijzigd.
- Icoon én label van elk sidebar-item moeten klikbaar zijn en dezelfde bestaande view/action switchen.
- De list view moet op klein scherm overschakelen naar een compacte task-list/card-row layout zonder horizontale overflow als primaire oplossing; op breed scherm blijft het een nette tabel met gedeelde header/body alignment.
- Detail-pane gedrag moet consistent zijn per viewport: desktop = side-pane naast content, tablet/small = overlay/fullscreen alleen wanneer nodig, zonder verborgen laag die scroll of clicks opvangt.

## Status per requirement

- [x] `review` status toegevoegd — status: gebouwd.

- [~] Manual sorting regels voor actieve taken bovenaan binnen hun status — status: gedeeltelijk / niet bevestigd als generieke repo-regel.
- [x] `Due` vervangen door `Last change` — status: gebouwd.
- [x] Checklist compacter met gedeelde progress-chip / kleurbanden — status: gebouwd.
- [x] `onlyOpen` default / open taken filter — status: gebouwd; nu alleen zichtbaar en toegepast in list view.
- [x] Linker rail icon-first — status: gebouwd, met nog open visuele bevestiging voor refresh-sizing.
- [x] VS Code-sidebar als primaire navigatie met Board/List/Epics/Settings/Refresh — status: gebouwd; activity-bar toont nu een compacte menu-webview en de interne rail is uit de panel-content verwijderd.
- [~] Responsive list view voor smalle VS Code-webviews + desktop header/body alignment — status: in uitvoering in deze ronde.
- [~] Globale scroll-container fix + correcte detail-pane-plaatsing naast content — status: in uitvoering in deze ronde.
- [x] Resizable detail pane — status: gebouwd.
- [~] Fullscreen detail toggle — status: opnieuw in uitvoering; eerdere claim was te vroeg, structurele herbouw loopt nu in fase 1.
- [~] Actieve agent indicator in board/list/detail — status: gedeeltelijk; basisweergave aanwezig, animatie en consistente detail-state ontbreken nog.
- [x] Selectie wordt niet meer als `Actief` gelabeld — status: gebouwd; plugin gebruikt nu expliciet `Geselecteerd` voor selectie en bewaart agentbadges voor echte agentactiviteit.
- [~] Agent metadata opslaan in task-md — status: gedeeltelijk; frontmattermodel aanwezig, activity-/commit-secties ontbreken nog.
- [ ] `## Commits` automatisch vullen met stabiele auto-entry zonder hash — status: nog niet gebouwd.
- [ ] Multi-agent concurrency-aanpak — status: nog niet afgerond / niet bewezen.

### Al gebouwd in code

- `review` status toegevoegd in plugin statusmodel (`backlog -> ready -> in_progress -> review -> blocked -> done`).
- `Due` in list view vervangen door `Last change` met sortering op wijzigingsdatum.
- Checklist-progress compacter gemaakt met gedeelde helper/presentatielaag voor board + list.
- `onlyOpen` default blijft actief voor list view en is niet langer een board-brede filter.
- Linker rail omgezet naar icon-first navigatie.
- Resize-handle en fullscreen toggle voor task detail toegevoegd.
- Frontmatter support toegevoegd voor agentvelden (`active_agent`, model, runtime, since, status, settings).
- Basisweergave van agentactiviteit toegevoegd in board/list en agent metadata in task detail.
- Selectiebadge gebruikt nu `Geselecteerd` in plaats van misleidend `Actief`; agentbadge blijft exclusief voor echte agentactiviteit.

### Gedeeltelijk gebouwd / nog niet af

- **Punt 5 — only open taken**
  - Staat nu standaard actief voor list view.
  - Is aangescherpt zodat het **alleen in list view zichtbaar én alleen daar toegepast** wordt.
- **Punt 9 — actieve agent indicator**
  - Basis chip/label bestaat in board/list.
  - Nog niet af: subtiele animatie zolang actief, en nog geen uniforme visuele active-state in board + list + detail.
- **Punt 10 — agent metadata in task-md**
- Frontmatter velden bestaan en worden al geparsed/geschreven.
- Done-transities schonen nu `active_agent*` metadata automatisch op in repository-updates en lane-moves.
  - Nog niet af: expliciete sectiestructuur/historiek zoals `## Agent activity` en verdere activity-log per taak.
- **Punt 8 — fullscreen detail toggle**
  - Toggle/state bestaat.
  - Eerdere fullscreen-fix bleek niet structureel genoeg; renderpad wordt nu expliciet herbouwd buiten de split-layout.

### Nog niet overtuigend gebouwd / niet als klaar te claimen

- **Punt 2 — manual sorting regels voor actieve taken bovenaan binnen hun status**
  - Nieuwe taken bovenaan lijkt grotendeels aanwezig.
  - Niet bevestigd als generieke repo-regel: taken met actieve agent automatisch bovenaan binnen hun status.
- **Punt 11 — `## Commits` automatisch vullen**
  - Nog geen bewijs dat nieuwe commits automatisch met stabiele `author date + subject` entry naar relevante taskfiles worden gelogd zonder dirty-worktree-loop.
- **Punt 12 — concurrency-aanpak voor multi-agent activity + sort order**
  - Bestaande file-version/conflictchecks helpen al deels.
  - De specifieke multi-agent uitbreiding uit het plan is nog niet als afgeronde feature zichtbaar.

## Bekende resterende punten uit deze sessie

- Fullscreen toggle werkt nu wel, maar de rest van de interactiestack is nog niet opgelost.
- Task-openen moet structureel opnieuw worden ontworpen: openen over lane/board/list-context, niet in de rechter placeholder naast board/list.
- Nieuwe regressie bevestigd: klikken op verschillende tasks opent nu telkens dezelfde actieve kaart (bijv. `Entry photo gallery volledige end-user E2E flows`) in plaats van de geselecteerde task.
- Task-openen en drag/drop in board + list hebben op dit moment regressies (taken niet goed aanklikbaar en niet sleepbaar voor lane/sortering).
- Actieve agent-visualisatie is nog niet volledig volgens plan: animatie en consistente visual state in board/list/detail ontbreken nog.
- Agent metadata bestaat nu vooral als frontmatter-model; de geplande activity-/commit-secties in task-md zijn nog niet uitgewerkt.
- Commit-logging en de expliciete multi-agent concurrency-uitbreiding uit het uitgebreide plan zijn nog niet afgerond.
- De taak blijft bewust `in_progress` totdat het nieuwe 3-fasenplan volledig is uitgevoerd en met runtime-checks bevestigd is.

## Blockers / afhankelijkheden

- VS Code verwacht voor een activity-bar container nog steeds een gekoppelde view; als volledig verwijderen daarvan technisch niet haalbaar blijkt, blijft alleen de minimaal noodzakelijke bridge over zonder oude launcher-semantiek.

## Verify / bewijs

- `npm run taskflow:verify`
- In `tools/budio-workspace-vscode/`: `npm run typecheck`
- In `tools/budio-workspace-vscode/`: `npm run test`
- In `tools/budio-workspace-vscode/`: `npm run apply:workspace`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Handmatige smoke-check in VS Code:
  - activity-bar icoon opent direct list view
  - oude `Workspace` launcher/menu verschijnt niet meer als betekenisvolle tussenlaag
  - `Budio Workspace: Open Board` werkt nog
  - `Budio Workspace: Open List View` werkt nog
  - settings blijft bereikbaar

## Relevante links

- `tools/budio-workspace-vscode/package.json`
- `tools/budio-workspace-vscode/src/extension.ts`
- `tools/budio-workspace-vscode/webview-ui/src/App.tsx`

## Toegevoegde verbeteringen tijdens uitvoering

- `onlyOpen` filter afgebakend naar list view: alleen daar zichtbaar en alleen daar functioneel actief.
- Start gemaakt met hook-first detail-layout herstructurering (`use-task-detail-layout`) zodat fullscreen niet meer als ad-hoc CSS-truc op de split-layout hoeft te leunen.
- Refresh-knop in de activity rail dezelfde icon-sizing gegeven als de andere rail-buttons.
- Plugin-UI gebruikt `Actief` niet langer voor selectie; done-taken verliezen actieve agentmetadata bij closeout.
- Fase 1 verify opnieuw gedraaid: plugin `typecheck`, plugin `test`, `taskflow:verify`, `docs:bundle`, `docs:bundle:verify` en `apply:workspace` zijn opnieuw succesvol uitgevoerd na de herstructurering.

## Oorspronkelijk plan / afgesproken scope

- Activity-bar opent direct list view zonder oude workspace-menu tussenlaag.
- Fullscreen detail toggle van tasks werkend op board + list.
- Resize en fullscreen moeten samenwerken zonder lege rechterkolom of overlap.
- Actieve taken moeten ordering-promotie krijgen, robuust bij meerdere agents.
- Agent-activiteit volledig zichtbaar in board, list en task detail.
- Automatische commit logging voor nieuwe commits.
- Multi-agent robuustheid expliciet uitvoeren.

## Reconciliation voor afronding

- **Oorspronkelijk plan binnen deze task:** activity-bar direct naar list view, launcher-opruiming, full task interaction flow structureel goed, plus de resterende requirements uit het uitgebreide plan.
- **In deze ronde aantoonbaar afgerond:** list-only `onlyOpen`, start van detail-layout herbouw via aparte hook, plugin typecheck/test/docs-verify in de vorige ronde.
- **Later toegevoegd of opnieuw geopend:** fullscreen/detail claims teruggezet naar in uitvoering omdat runtime nog fout was; board/list click+drag regressies horen expliciet in fase 1 thuis.
- **Open / blocked:** taak blijft `in_progress` totdat fase 1 runtime-stabiel is en daarna fase 2/3 inclusief handmatige smoke-check bevestigd zijn.

## Commits

- dbe712d — docs(task): update plugin task status with unresolved bugs and 3-phase plan

- a9e2961 — docs(task): add selection bug to plugin task status

- ad43300 — chore: commit all remaining local changes

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 942af46 — docs: sync local workspace state

- 2026-04-28T23:24:01+02:00 — fix: make task commit logging converge

- 2026-04-29T00:14:29+02:00 — docs: sync task commit logs

- 2026-04-29T01:47:27+02:00 — fix: diagnose Android photo prepare regression

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish

- 2026-05-15T17:03:51+02:00 — feat: move budio workspace nav into sidebar

- 2026-05-21T17:24:05+02:00 — chore: sync local workspace changes

- 2026-06-01T11:08:03+02:00 — feat: add admin capability access control

- 2026-06-04T17:06:53+02:00 — feat: harden AIQS runtime production readiness

- 2026-06-05T07:59:45+02:00 — fix: deploy admin access control function

- 2026-06-05T08:03:27+02:00 — docs: close production admin access incident

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## Productieflow Data opnieuw verwerken bronconsistentie

- Path: `docs/project/25-tasks/open/productieflow-data-opnieuw-verwerken-bronconsistentie.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-07-04

```md
---
id: productieflow-data-opnieuw-verwerken-bronconsistentie
title: Productieflow Data opnieuw verwerken bronconsistentie
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-07-04
summary: "Maak Data opnieuw verwerken veilig en bronconsistent: raw data read-only, entries eerst herstellen, daarna dagjournals, weekreflecties en maandreflecties op actuele brondata regenereren."
tags: ""
workstream: aiqs
epic_id: null
parent_task_id: null
depends_on: []
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

De productieflow `Data opnieuw verwerken` levert inconsistenties op tussen zichtbare momenten, genormaliseerde entrydata en dag-/periode-output. Een dag kan in de UI meerdere individuele momenten tonen terwijl het dagjournaal zegt dat er geen entries zijn aangeleverd. Oudere momenten lijken soms raw input, normalized body en dagjournal-input niet meer consistent te koppelen.

## Gewenste uitkomst

Admins kunnen productie veilig read-only auditen, daarna entries, dagjournals, weekreflecties en maandreflecties in correcte volgorde hergenereren. Raw data blijft bronwaarheid en wordt nooit overschreven.

De flow gebruikt bestaande AIQS DB-driven promptbindings en maakt failures, repair-candidates en broncounts zichtbaar genoeg om productieherstel gecontroleerd uit te voeren.

## User outcome

Een admin kan veilig zien welke productiegegevens inconsistent zijn, gericht repair uitvoeren en daarna erop vertrouwen dat dag-, week- en maandoutput op de juiste brondata rust.

## Functional slice

Eén afgeronde reliability-slice voor de bestaande regenerationflow: audit, broncontract, gefaseerde hergeneratie, inspectie, repair/backfill en verify.

## Entry / exit

- Entry: admin opent `Data opnieuw verwerken` of developer draait het repair/auditpad.
- Exit: entries zijn eerst opgelost; daarna worden day journals, week reflections en month reflections opgebouwd uit actuele brondata met traceerbare metadata.

## Happy flow

1. Developer draait read-only productie-audit en krijgt candidates met reason codes.
2. Admin/developer voert lokale tests en implementatie uit zonder raw data te muteren.
3. Admin start hergeneratie: entries lopen eerst, daarna dagen, daarna weken, daarna maanden.
4. Admin inspecteert een dag en ziet raw, normalized, prompt-input en afgeleide output naast elkaar.
5. Productie-repair draait alleen na expliciete apply en logt repaired/skipped/failed.

## Non-happy flows

- Empty state: echte lege dag krijgt gecontroleerde empty-day output zonder OpenAI-call.
- Permission denied / unavailable: admin-only inspectie en repair blijven geblokkeerd zonder regeneration-capability of interne token.
- Validation / unsupported state: raw entries met missing/lege/mismatch normalized output worden failure/candidate, niet stilzwijgend als lege dag verwerkt.
- Failure / retry / cancel: batch failures tonen target, phase, reason en retrybaarheid; repair blijft dry-run-first.

## UX / copy

- Gebruik bestaande `app/settings-regeneration.tsx` admin-console primitives.
- Copy blijft functioneel: `Inspectie`, `Repair candidates`, `Dry-run`, `Apply`, `Failure reason`.
- Geen redesign buiten noodzakelijke inspectie/debugweergave.

## Data / IO

- Input: `entries_raw` read-only, `entries_normalized`, `day_journals`, `period_reflections`, AIQS live runtime bindings.
- Output: gerepareerde normalized rows, day journals, week/month reflections en traceerbare `generation_meta`.
- Opslag/API/service/file-impact: Edge Functions, services, admin UI, tests, repair script; raw fields worden nooit geüpdatet.
- Statussen: job/step status blijft backwards-compatible met extra debug/failure metadata.

## Waarom nu

De kernlus capture -> dagboeklaag -> reflecties moet productiebetrouwbaar zijn voordat bredere beta-readiness en AIQS-governance als betrouwbaar kunnen gelden.

## In scope

- Read-only productie-audit vooraf.
- Bronconsistent day-entry helper.
- Single-day regeneration, `process-entry` day-upsert en admin regeneration op hetzelfde broncontract.
- Strict dependency order: entries -> days -> weeks -> months.
- Admin inspectie en repair/backfill dry-run/apply.
- Unit tests en relevante verify.

## Buiten scope

- Promptstrategie of nieuwe promptdesigns wijzigen.
- Raw data herschrijven, opschonen of backfillen.
- Brede admin redesign of nieuwe queue-infrastructuur buiten de bestaande regenerationflow.
- Productie-writes zonder expliciete repair apply-run.

## Oorspronkelijk plan / afgesproken scope

- Werkvolgorde: productie-audit read-only -> failing tests -> broncontract fix -> regeneration fix -> debug/inspectie -> repair/backfill -> verify.
- Raw data blijft altijd read-only: `entries_raw.raw_text`, `transcript_text`, `captured_at`, `journal_date` worden nooit overschreven of opgeschoond.
- Admin regeneration blijft AIQS DB-driven prompts gebruiken: entries, days, weeks en months lezen live prompt/model/runtime binding uit AIQS.
- Productie-audit gebruikt tijdelijk `supabase_remote_ro`, daarna direct terug naar `supabase_local`.

## Expliciete user requirements / detailbehoud

- Case `2026-03-21` moet worden onderzocht met zichtbare momenten:
  - Zaterdag Ochtend Reflecties
  - Vragen over het contact met Nadia
  - Bericht over ons contact
  - Zo wie typical e-mail verstuurd
  - Verstuurde berichten
- Een dag met bestaande actieve momenten mag nooit een dagjournal krijgen dat zegt dat er geen entries zijn.
- Entries moeten eerst worden opgelost; daarna alle dagjournals; daarna weekreflecties; daarna maandreflecties.
- Normalized entries die gevuld lijken maar niet overeenkomen met raw input moeten worden gedetecteerd en gerepareerd.
- Raw data mag nooit kwijt raken of overschreven worden.
- Productie moet eerst read-only gevalideerd worden voordat repair of hergeneratie wordt toegepast.
- Admin wil in de tool kunnen kiezen tussen `Reparatie` en `Alles opnieuw`.
- Admin wil kunnen kiezen tussen alles nalopen of specifieke dag/week/maand/periode, eventueel meerdere tegelijk.
- Bij gekozen dag/week/maand moet de dependency-volgorde behouden blijven en overlappende selectie mag niet dubbel queued worden:
  - dag: entries voor die dag -> dayjournal -> afhankelijke week/month.
  - week: entries + dagen binnen die week -> week -> geraakt maand.
  - maand: entries + dagen binnen maand -> relevante weken -> maand.
- Preview/start mag geen grote entry-id arrays via querystring of `IN (...)` URL's laden; volledige scopes moeten schaalbaar blijven en backend-side uit JSON selectiecriteria worden bepaald.
- `/settings-regeneration` moet een professionele admin-wizard zijn: gewone Nederlandse taakcopy, geen scope-textarea in de standaardflow, user-id veld alleen onder `Geavanceerd`, controle verplicht vóór start, technische jobvelden ingeklapt.
- Het losse blok `Veiligheid` moet weg; `/settings-regeneration` moet visueel aansluiten op de AIQS-adminstijl.
- Periode kiezen in `/settings-regeneration` moet dezelfde gedeelde dag/week/maand-modal en opties gebruiken als `Instellingen -> Archief downloaden -> Een periode kiezen`; geen dubbele pickerlogica.
- De knop `Controleer selectie` moet weg; selectiecontrole moet automatisch lopen zodra bereik en onderdelen geldig zijn.
- Zolang er globaal een `queued` of `running` regeneration job bestaat, moet `/settings-regeneration` dominant tonen dat `Opnieuw opbouwen bezig` is en mag er geen nieuwe opdracht gestart worden.
- Een lopende opdracht moet via `Stop na huidig werk` netjes kunnen stoppen: huidige OpenAI sub-batch afronden/toepassen, daarna geen nieuwe sub-batches/retries/steps meer starten en job op `cancelled` zetten.
- Laatste UI-correctie: `/settings-regeneration` toont per moment maar één hoofdtaak. Actieve job = alleen compacte statuskaart + ingeklapte technische details; geen actieve job = rustige wizard. `Controleer selectie` komt terug als expliciete stap en `Alles opnieuw opbouwen` gebruikt één bevestigingsmodal.

## Status per requirement

- [x] Productie-audit read-only uitgevoerd — status: uitgevoerd via dry-run audit tegen productiecloudconfig; geen productie-writes.
- [x] Raw data read-only geborgd — status: gebouwd; runtime repair leest `entries_raw` en schrijft alleen normalized/day/period outputs.
- [x] UI/runtime broncontract gelijkgetrokken — status: gebouwd; gedeelde server-helper bevat UI-equivalent raw + legacy selectie.
- [x] Entries-first regeneration gebouwd — status: gebouwd; entry candidates komen uit raw/normalized repairdetectie.
- [x] Day/week/month dependency order gebouwd — status: gebouwd; bestaande worker-order blijft strict en candidates zijn verbreed.
- [x] Empty-day contract gebouwd — status: gebouwd; single-day true empty zonder OpenAI en non-empty empty-claim hard reject.
- [x] Admin inspectie gebouwd — status: gebouwd; `inspect_day` + Regeneration UI.
- [x] Repair/backfill dry-run/apply gebouwd — status: gebouwd; script is dry-run default, apply start expliciete regeneration job.
- [x] Repair/all + scope-selectie gebouwd — status: gebouwd; preview/start gebruiken dezelfde deduped dependency-candidates.
- [x] URI-too-long in preview/start entry-batchpad opgelost — status: gebouwd; entry rows worden per candidate geladen en discovery gebruikt paged reads.
- [x] Professionele admin-wizard voor `/settings-regeneration` gebouwd — status: gebouwd; actie, bereik, onderdelen, controle en status zijn taakgericht en technische details staan ingeklapt.
- [x] AIQS-stylingcorrectie voor `/settings-regeneration` gebouwd — status: gebouwd; veiligheids-inspector verwijderd en sections gebruiken dezelfde admin-console header/breedte/plain ritmiek als AIQS.
- [x] Gedeelde periodekiezer gebouwd — status: gebouwd; export en regeneration gebruiken dezelfde shared hook/modal voor dag/week/maandselectie.
- [x] Selectiecontrole gebouwd — status: aangepast op laatste UX-correctie; handmatige knop `Controleer selectie` is terug en automatische previewcopy is verwijderd.
- [x] Single-active-job lock en graceful stop gebouwd — status: gebouwd; backend weigert nieuwe start bij globale actieve job, UI toont actieve job bovenaan en stop zet `options.stop_requested_at`.
- [x] Vereenvoudigde regeneration UI gebouwd — status: gebouwd; actieve jobstatus en nieuwe opdrachtflow zijn conditioneel gescheiden, technische details staan standaard dicht en geavanceerde opties/daginspectie zitten in één accordion.
- [x] Tests en verify uitgevoerd — status: groen na productie-auditrapportage.

## Toegevoegde verbeteringen tijdens uitvoering

- Productie-audit toolingbevinding: in deze sessie schakelde `.codex/config.toml` succesvol tijdelijk naar `supabase_remote_ro` en terug naar `supabase_local`, maar de MCP-toolset herlaadde de remote-ro server niet. Daarom is de productie-audit uitgevoerd via het nieuwe dry-run auditscript met de productiecloudconfig uit lokale env, zonder raw content te tonen en zonder writes.
- Auditrapportage aangescherpt: oude dayjournal metadata zonder `prompt_entry_count` telt als `null`/ontbrekend, niet automatisch als echte nul-input.
- Admin-tool uitgebreid met `Reparatie` versus `Alles opnieuw`, preview zonder writes, optionele target user ids en compacte scope-regels voor dag/week/maand/range.
- Backend start/preview gebruikt één candidate-builder die geselecteerde scopes naar unieke entries, dagen, weken en maanden expandt.
- Productiefout `Failed to load entry rows: URI too long` onderzocht: de frontend gebruikt al POST JSON body naar de Edge Function; de lange URL ontstond backend-side door Supabase/PostgREST `.in('id', normalizedIds)` en `.in('id', rawIds)` bij entry-batchbouw. Dit is vervangen door point lookups per candidate met cache en paged candidate discovery.
- `/settings-regeneration` herwerkt van technische console naar wizard: `Data opnieuw opbouwen`, stap 1 actie, stap 2 bereik, stap 3 onderdelen, stap 4 controle, start pas na actuele preview en inline bevestiging voor volledig opnieuw opbouwen.
- Extra UI-correctie: het aparte inspectorblok `Veiligheid` is verwijderd en de pagina gebruikt dezelfde rustige AIQS-admincompositie met `AdminConsoleHeader`, centrale contentbreedte en plain sections.
- Periodekeuze gedeeld gemaakt: `ExportPeriodSelectorModal` is een alias naar de shared `PeriodScopeSelectorModal`, export en regeneration gebruiken `usePeriodScopeSelectorOptions`, en regeneration vertaalt dag/week/maand direct naar de bestaande dependency-correcte scopes.
- Eerdere automatische previewflow vervangen door handmatige selectiecontrole; `/settings-regeneration` houdt `Start opnieuw opbouwen` disabled tot `Controleer selectie` actueel is.
- Actieve regeneration zichtbaar en blokkerend gemaakt: `latest` geeft eerst de globale actieve job terug, `start` weigert nieuwe jobs zolang een job `queued`/`running` is, en de UI toont bovenaan `Opnieuw opbouwen bezig` met `Stop na huidig werk`.
- Graceful stop toegevoegd zonder schemawijziging: `stop` gebruikt bestaande `cancelled` status en `options.stop_requested_at/by`; de worker past een open batch nog toe, maar start daarna geen retries, nieuwe sub-batches of volgende steps meer.
- `/settings-regeneration` opnieuw vereenvoudigd: actieve jobstatus, afgeronde job-samenvatting en nieuwe-opdrachtwizard zijn aparte toestanden geworden. Dubbele stop/statusblokken, losse daginspectiesectie, automatische previewcopy en herhaalde waarschuwingen zijn verwijderd.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow, productie-audit read-only en root-cause report.
- [x] Blok 2: failing tests voor broncontract, empty-day, mismatch en order.
- [x] Blok 3: gedeelde helper en runtime/admin regeneration fix.
- [x] Blok 4: admin inspectie en repair/backfill script.
- [x] Blok 5: scoped repair/all preview en dependency-deduplicatie.
- [x] Blok 6: verify, docs bundle en reconciliation.

## Concrete checklist

- [x] Productie-audit uitvoeren zonder writes en target terugzetten naar local.
- [x] Failing tests toevoegen.
- [x] Broncontract helper implementeren.
- [x] Regeneration flows aansluiten.
- [x] Admin inspectie en service toevoegen.
- [x] Repair/backfill script toevoegen.
- [x] Repair/all-modus, preview en scoped dependency-selectie toevoegen.
- [x] Preview/start URI-too-long bug oplossen zonder querystring-id lijsten.
- [x] `/settings-regeneration` UI/copy herwerken naar beheerderstaakflow zonder standaard UUID/scope-invoer.
- [x] `Veiligheid`-blok verwijderen en AIQS-adminstyling toepassen.
- [x] Periodekiezer delen met Archief downloaden en regeneration Stap 2 daarop aansluiten.
- [x] Handmatige `Controleer selectie` als expliciete controlestap gebruiken; automatische previewcopy verwijderen.
- [x] Actieve job dominant tonen en startflow blokkeren bij `queued`/`running`.
- [x] `Stop na huidig werk` toevoegen met graceful stop na huidige OpenAI sub-batch.
- [x] Laatste UI-correctie uitvoeren: één hoofdtaak tegelijk, handmatige selectiecontrole, één geavanceerdblok en bevestigingsmodal voor alles opnieuw.
- [x] Verify uitvoeren.

## Acceptance criteria

- [ ] Case `2026-03-21` levert prompt entries > 0 en geen empty-day journal — productie-audit bevestigt nu prompt-input 5, maar huidige productie-dayjournal claimt nog leeg tot deploy/repair.
- [ ] Geen dagjournal zegt dat er geen entries zijn wanneer UI-equivalent entries bestaan — productie-audit vindt 38 repair-candidates met `empty_day_claim_with_raw_entries`; runtime guard is lokaal gebouwd maar nog niet toegepast in productie.
- [x] Data opnieuw verwerken voert geselecteerde entries uit of toont duidelijk waarom niet.
- [ ] Week- en maandreflecties bouwen op actuele dayjournals — runtime order is gebouwd; productie-audit vindt nog 3 stale reflections.
- [x] Raw data wordt niet overschreven.
- [x] Repair/backfill is dry-run-first en production-safe.
- [x] Gekozen dag/week/maand wordt dependency-correct en zonder dubbele candidates gepland.
- [x] Preview/start stuurt selectiecriteria in POST JSON en bouwt geen grote entry-id querystring voor batchconstructie.
- [x] Start opnieuw opbouwen blijft disabled tot de selectie gecontroleerd is; wijzigingen maken de preview ongeldig.
- [x] Technische velden zoals job-id, phase en batchstatus staan achter ingeklapte technische details.
- [x] `/settings-regeneration` toont geen aparte `Veiligheid` inspector meer en sluit visueel aan op AIQS.
- [x] `Een periode kiezen` gebruikt dezelfde dag/week/maand-modalopties als Archief downloaden.
- [x] Startknop wordt pas actief nadat handmatige `Controleer selectie` actueel is.
- [x] Een globale actieve regeneration job blokkeert nieuwe starts en staat bovenaan de pagina.
- [x] Stop-request markeert lopende jobs via `options.stop_requested_at` en stopt na afronden/toepassen van de huidige sub-batch.
- [x] Actieve job en nieuwe-opdrachtwizard worden niet tegelijk prominent getoond; technische details zijn standaard dicht.

## Blockers / afhankelijkheden

- Productie-audit via MCP remote-ro was niet beschikbaar door toolreload, maar dry-run audit via productiecloudconfig is uitgevoerd.
- Productieherstel blijft afhankelijk van expliciete apply-run en deployment van de aangepaste Edge Functions.

## Verify / bewijs

- `npx vitest run tests/unit/regeneration-source-contract.test.ts` — groen; 7 tests.
- `npm run test:unit` — groen; 17 files, 100 tests.
- `npm run typecheck` — groen.
- `npm run lint` — groen.
- `npm run taskflow:verify` — groen na code/taskfile en opnieuw groen na docs-bundel.
- `npm run docs:bundle` — groen; generated docs/upload bijgewerkt.
- `npm run docs:bundle:verify` — groen.
- Herhaald na productie-auditrapportage: `npm run test:unit`, `npm run typecheck`, `npm run lint`, `npm run taskflow:verify`, `npm run docs:bundle`, `npm run docs:bundle:verify` — groen.
- Na repair/all scope-uitbreiding: `npx vitest run tests/unit/regeneration-source-contract.test.ts` — groen; 9 tests.
- Na repair/all scope-uitbreiding en period-user dedupe: `npm run typecheck`, `npm run lint`, `npm run test:unit` — groen; 17 files, 102 tests.
- Na URI-too-long fix: `npx vitest run tests/unit/regeneration-source-contract.test.ts` — groen; 10 tests.
- Na active-job lock en graceful stop: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 106 tests.
- Route-smoke `/settings-regeneration`: `curl -I --max-time 5 http://localhost:8081/settings-regeneration` — HTTP 200. Playwright light/dark route-smoke — HTTP 200 zonder console/page errors, maar zonder ingelogde adminsessie eindigt de browser op het auth-scherm.
- Na vereenvoudigde `/settings-regeneration` UI: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 106 tests. Statische copycheck: `Stop aangevraagd` staat één keer, oude automatische-previewcopy en losse `Geavanceerd: dag inspecteren` zijn weg. Route-smoke HTTP 200; Playwright light/dark route-smoke HTTP 200 zonder console/page errors, maar zonder ingelogde adminsessie eindigt de browser op het auth-scherm.
- Na URI-too-long fix: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 103 tests.
- Na URI-too-long fix: `npm run docs:bundle:verify` — faalt alleen op `docs/upload/60-budio-tasks-current.md` omdat generated docs bewust niet zijn bijgewerkt binnen user-scope `Geen wijzigingen aan gegenereerde files`.
- Na admin-wizard herwerking: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run taskflow:verify` — groen; 17 files, 103 tests.
- Runtime-smoke: `curl -I http://localhost:8081/settings-regeneration` — HTTP 200; Playwright zonder adminsessie redirectt naar `/sign-in`, waardoor visuele admin-flow inspectie lokaal auth-blocked is zonder ingelogde admincontext.

Productie-audit bewijs:

- MCP target is na diagnose teruggezet naar local met `node scripts/codex-mcp-target.mjs local`.
- Dry-run productie-audit: `node scripts/repair-regeneration-empty-day-mismatches.mjs --json > /tmp/budio-regeneration-prod-audit.json`.
- Target: `xmrndabfqfvkhdhcjqit.supabase.co`, `productionLike: true`, `dryRun: true`.
- Totals: 1360 raw entries, 1360 normalized entries, 225 dayjournals, 52 period reflections.
- AIQS live bindings bevestigd:
  - `entry_normalization.primary` -> `entry_cleanup:v2`, model `gpt-5.4`.
  - `day_journal.primary` -> `day_narrative:v3`, model `gpt-5.4-mini`.
  - `day_journal.repair` -> `day_journal_repair:v1`, model `gpt-4o-mini`.
  - `week_reflection.primary` -> `week_narrative:v4`, model `gpt-5.4-mini`.
  - `month_reflection.primary` -> `month_narrative:v2`, model `gpt-5.4-mini`.
- Repair-candidate counts: 1360 entry repair candidates door outdated prompt/model metadata, 38 day repair candidates met `empty_day_claim_with_raw_entries`, 3 stale reflections, 225 dayjournals met oude metadata zonder prompt-count.
- Case `2026-03-21`, entry `8a735a46-6014-4382-8fc9-0a5a541f8de8`: target entry gevonden; UI-equivalent raw count 5, normalized count 5, prompt input count 5; current dayjournal `6f8a82e1-fa37-4327-82b0-8fbf1ba36c29` claimt nog leeg en heeft oude metadata zonder source/prompt counts.

## Reconciliation voor afronding

- Oorspronkelijk plan: productie-audit, broncontract, gefaseerde regeneration, debug/inspectie, repair/backfill en verify.
- Toegevoegde verbeteringen: tooling-blocker expliciet gemaakt, audit/repair script toegevoegd en productie-audit alsnog dry-run uitgevoerd via productiecloudconfig.
- Afgerond: read-only productie-audit met echte productiegegevens, bronhelper, serverflows, admin inspectie, repair dry-run/apply script, tests en verify.
- Open: productiecode is nog niet gedeployed en productie-repair is nog niet toegepast; task blijft daarom `in_progress` en niet `done`.

## Relevante links

- `docs/project/open-points.md`
- `app/settings-regeneration.tsx`
- `supabase/functions/admin-regeneration-job/index.ts`
- `supabase/functions/regenerate-day-journal/index.ts`


## Commits

- 2026-07-03T10:34:40+02:00 — Fix scoped admin regeneration repair flow

- 2026-07-03T14:19:42+02:00 — Fix admin regeneration flow


- 2026-07-05T09:20:15+02:00 — Add day week month swipe navigation
## Agent activity

- stop 2026-07-03T07:55:48.268Z -> 2026-07-04T09:29:37.625Z - Codex / gpt-5 / codex / default - reason: stopped
```

---

## Service-status laag voor Supabase storingen

- Path: `docs/project/25-tasks/open/service-status-laag-voor-supabase-storingen.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-service-status-laag-voor-supabase-storingen
title: Service-status laag voor Supabase storingen
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: Implementeer een minimale production service-status laag die Supabase status-webhooks vertaalt naar een rustige banner en tijdelijke write-lock voor relevante Budio-flows.
tags: [supabase, production, incidents, reliability, ux]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 2
---




# Service-status laag voor Supabase storingen

## Probleem / context

Budio mist nu een minimale productielaag om gebruikers rustig af te remmen wanneer Supabase een relevante storing of maintenance meldt. Daardoor kunnen gebruikers tijdens een externe storing nog steeds nieuwe opnames starten of wijzigingen proberen op te slaan, terwijl write-flows mogelijk falen of instabiel zijn.

De gewenste oplossing is bewust smal: geen brede statuspage of incident center, maar alleen een kleine production hardening-slice die actuele Supabase status vertaalt naar rustige UI en tijdelijke write-guards.

## Gewenste uitkomst

Er staat een minimale v1 service-status laag voor productie op Vercel/Supabase. Een webhook endpoint ontvangt Supabase status-webhooks, slaat de actuele service-status op, en maakt die status leesbaar voor de app.

Wanneer de status write-blocking is, toont Budio op relevante schermen een rustige header notification onder de topnav en worden write-acties tijdelijk disabled of guarded. Leesflows blijven beschikbaar en de app blijft bruikbaar wanneer status ophalen faalt.

## User outcome

Gebruikers zien bij een relevante storing een rustige melding en worden tijdelijk beschermd tegen nieuwe opnames of mutaties die waarschijnlijk zouden falen. Ze kunnen bestaande dagen en eerder opgeslagen content wel blijven bekijken.

## Functional slice

Een minimale production hardening-slice met:

- Supabase status webhook -> eigen service-status opslag
- client-side readmodel/helper
- compacte banner op relevante write-schermen
- tijdelijke write-lock voor capture en mutatie-acties

## Entry / exit

- Entry: Supabase Status verstuurt een incident-, maintenance- of componentstatus-webhook naar een Budio endpoint.
- Exit: de app leest de actuele status, toont indien nodig de juiste banner, en blokkeert alleen write-acties die tijdelijk niet veilig zijn.

## Happy flow

1. Supabase Status verstuurt een relevante webhook naar het Budio endpoint met geldige secret/header/token.
2. Het endpoint valideert de webhook en vertaalt incident/componentinformatie naar een compact service-status readmodel.
3. De actuele service-status wordt opgeslagen of bijgewerkt.
4. Relevante app-schermen lezen de status via een kleine service/helper.
5. Bij `write_blocked: true` toont de app de storing-banner en worden nieuwe opnames en mutaties disabled of guarded.
6. Bij een resolved incident wordt `write_blocked` weer `false` en verdwijnt of versoepelt de banner op basis van de nieuwe status.

## Non-happy flows

- Webhook secret ongeldig: request wordt afgewezen en status blijft ongewijzigd.
- Status fetch faalt client-side: app blijft bruikbaar; alleen de statuslaag valt stil.
- Degraded maar niet write-blocking: banner toont alleen een rustige performance-waarschuwing, zonder write-lock.
- Incident resolved maar payload blijft degraded impliceren: write-block gaat weg, maar status kan degraded blijven als de payload dat rechtvaardigt.

## UX / copy

- Banner alleen op logische schermen met write-acties:
  - Today / startscherm
  - Capture start / voice / type
  - Entry detail waar bewerken mogelijk is
  - Day detail waar wijzigingen of regeneratie mogelijk zijn
  - Settings import/export/regeneration alleen als de actie afhankelijk is van Supabase/write-flows
- Niet tonen op puur passieve lees-schermen zonder write-acties.
- Gebruik bestaande feedback-, header- en screen-primitives.
- Geen redesign, geen panic-UI, geen brede statuspage.
- Copy bij write-blocking:
  - Titel: `Tijdelijke storing`
  - Tekst: `Nieuwe opnames en wijzigingen zijn tijdelijk gepauzeerd. Je kunt je eerdere dagen nog bekijken.`
  - Actie: geen primaire CTA
- Copy bij degraded zonder write-block:
  - Titel: `Budio werkt mogelijk trager`
  - Tekst: `Sommige acties kunnen tijdelijk langer duren.`
  - Actie: geen primaire CTA
- Disabled helper bij write-acties:
  - `Tijdelijk niet beschikbaar door een storing.`

## Data / IO

- Input:
  - Supabase Status webhooks voor `incident created`, `incident updated`, `incident resolved` en `component status changed`
  - server-side secret via `SUPABASE_STATUS_WEBHOOK_SECRET`
- Output:
  - actuele service-status voor de app
  - banner-state en write-lock gedrag op relevante schermen
- Opslag/API/service/file-impact:
  - `supabase/migrations/**` voor service-status opslag
  - `supabase/functions/**` of bestaande passende server/API route voor webhookontvangst
  - `services/**` voor readmodel/helper
  - `components/feedback/**` voor rustige header/banner
  - relevante `app/**` routes voor guards/disabled states
  - korte operations-doc in `docs/dev/**` of passende operations-doc
- Statussen:
  - `operational | degraded | partial_outage | major_outage | maintenance | unknown`
  - `write_blocked: boolean`
  - `message: nullable text`
  - `incident_id: nullable text`
  - `updated_at`
  - `resolved_at: nullable`
  - `raw_payload: jsonb` indien passend

## Waarom nu

- Dit is een kleine maar waardevolle production hardening-slice.
- Het voorkomt dat gebruikers midden in een externe storing write-flows blijven proberen.
- De scope is bewust beperkt en past als afgebakende backlog-task zonder bredere roadmapverschuiving.

## In scope

- Supabase status webhook endpoint.
- Server-side verificatie via gedeelde secret/header/token.
- Database tabel of bestaande passende opslag voor service-status.
- Kleine client-side service/helper om status te lezen.
- Rustige header/banner onder topnav op relevante schermen.
- Disable/guard voor nieuwe entries, opnames en mutaties wanneer `write_blocked` actief is.
- Korte operationele documentatie van webhook URL + secret setup.
- Eventueel een minimale eigen health check, alleen als die cheap blijft en geen scope-creep veroorzaakt.

## Buiten scope

- Brede statuspage.
- Notificatiecentrum.
- Multi-provider dashboard.
- AIQS redesign.
- Meeting Capture scope-uitbreiding buiten de minimale write-lock die deze taak direct raakt.
- Herschrijven van productvisie of roadmap buiten deze hardening-task.
- Direct editen van generated docs in `docs/upload/**` of `docs/project/generated/**`.

## Oorspronkelijk plan / afgesproken scope

Bronprompt voor toekomstige uitvoering, bewust als minimale v1:

1. Bouw alleen:
   - webhook endpoint voor Supabase status-webhooks
   - opslag van actuele service-degradation status
   - rustige header notification onder de topnav op relevante schermen
   - tijdelijk blokkeren of disablen van write-acties wanneer status dit vereist
2. Gebruik Supabase Status Webhook als primaire externe incidentbron.
3. Gebruik de eigen Supabase API/account niet als primaire incidentbron; hoogstens als minimale aanvullende health check.
4. Fail-safe:
   - als status niet geladen kan worden, blijft de app bruikbaar
   - alleen expliciete active outage of maintenance blokkeert writes

## Expliciete user requirements / detailbehoud

- Plan mode: ja bij uitvoering.
- Voor toekomstige uitvoering eerst deze contextbronnen lezen:
  - `docs/upload/chatgpt-project-context.md`
  - `docs/upload/10-budio-core-product-and-planning.md`
  - `docs/upload/30-budio-build-ai-governance-and-operations.md`
  - `docs/upload/40-budio-design-handoff-and-truth.md`
- Gebruik rustige, niet-technische Budio-copy.
- Header notification moet direct onder topnav/hero komen waar passend.
- Warm, rustig en compact; geen rode panic-UI tenzij echt critical.
- Hergebruik bestaande feedback/screen-primitives, tokens en spacing.
- Geen nieuwe dependency tenzij echt noodzakelijk.
- Capture-first hiërarchie niet verstoren.
- Waarschijnlijke raakvlakken:
  - `supabase/migrations/**`
  - `supabase/functions/**` of bestaande server/API route
  - `services/**`
  - `components/feedback/**`
  - relevante `app/**` routes
  - env-voorbeeldbestand indien aanwezig
  - passende docs in `docs/dev/**` of `docs/project/**`
- Niet raken:
  - brede productvisie
  - generated docs/upload direct
  - AIQS redesign
  - Meeting Capture scope buiten deze slice
  - nieuwe roadmapbeslissingen buiten deze hardening-task
- Alleen committen tijdens uitvoering als verify slaagt.
- Beoogde implementatie-commit voor de bouwtaak:
  - `feat: add service status banner and write lock`

## Status per requirement

- [ ] Webhook endpoint voor Supabase Status — status: niet gebouwd
- [ ] Server-side webhook-verificatie — status: niet gebouwd
- [ ] Service-status opslag/readmodel — status: niet gebouwd
- [ ] Banner op relevante schermen — status: niet gebouwd
- [ ] Write-lock voor capture en mutaties — status: niet gebouwd
- [ ] Fail-safe bij status fetch failure — status: niet gebouwd
- [ ] Korte operations-doc voor webhook URL + secret — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen. Eventuele extra health check alleen toevoegen als die klein blijft en de hoofdscope niet vervangt.

## Uitvoerblokken / fasering

- [ ] Blok 1: preflight, relevante contextdocs, huidige write-flows en passende server-entrypoint bevestigen.
- [ ] Blok 2: webhook + opslag + readmodel bouwen.
- [ ] Blok 3: banner + write-guards op relevante schermen toevoegen.
- [ ] Blok 4: docs, verify en reconciliation afronden.

## Concrete checklist

- [ ] Passende storage-vorm kiezen voor actuele service-status.
- [ ] Webhookverificatie via bestaand env-patroon toevoegen met `SUPABASE_STATUS_WEBHOOK_SECRET`.
- [ ] Supabase status-events vertalen naar compact readmodel.
- [ ] Relevante schermen koppelen aan bannerweergave.
- [ ] Capture-, entry- en day-detail writes tijdelijk blokkeren bij `write_blocked`.
- [ ] Resolved incident haalt write-block weer weg.
- [ ] Operationele setup kort documenteren.

## Acceptance criteria

- [ ] Supabase webhook kan status opslaan en updaten.
- [ ] Resolved incident haalt write-block weg.
- [ ] Banner verschijnt alleen op relevante schermen.
- [ ] Nieuwe opname-, entry- en mutatie-acties zijn disabled of guarded bij `write_blocked`.
- [ ] Bestaande leesflows blijven beschikbaar.
- [ ] App crasht niet als status ophalen faalt.
- [ ] Copy is rustig en Budio-passend.

## Blockers / afhankelijkheden

- Nog geen harde blockers.
- Afhankelijk van een passende bestaande server-entrypoint-keuze binnen repo-architectuur.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Handmatige smoke:
  - mock webhook active incident -> banner zichtbaar + write-acties disabled
  - mock webhook resolved -> banner weg + write-acties weer actief
  - status fetch failure -> app blijft bruikbaar

## Reconciliation voor afronding

- Oorspronkelijk plan: minimale v1 service-status laag op basis van Supabase Status webhook.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: volledige uitvoering staat nog in backlog.

## Relevante links

- `docs/project/open-points.md`
- `docs/project/25-tasks/README.md`


## Commits

- 5a7e3e0 — docs: add service status backlog task

- 942af46 — docs: sync local workspace state

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Settings/admin navigatie contract fix

- Path: `docs/project/25-tasks/open/settings-admin-navigatie-contract-fix.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-06-05

```md
---
id: settings-admin-navigatie-contract-fix
title: Settings/admin navigatie contract fix
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-06-05
summary: Maak menu/instellingen/admin navigatie deterministisch zodat Instellingen altijd het instellingenoverzicht opent.
tags: ""
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 3
---






## Probleem / context

De hoofdmenu-link `Instellingen` voelt alsof hij naar de laatst geopende settings/admin pagina gaat. Bronoorzaak: settings- en adminsubroutes geven `currentRouteKey="settings"` aan `FullscreenMenuOverlay`, waarna de menu-handler klikken op dezelfde key negeert. Daardoor sluit het menu zonder navigatie.

Daarnaast gebruiken first-level settings/admin pagina's veel `router.back()`, waardoor stackhistorie bepaalt waar de gebruiker uitkomt.

## Gewenste uitkomst

`Instellingen` in het hoofdmenu opent altijd het instellingenoverzicht met menu-keuzes. First-level settings/admin back gaat terug naar `/settings`. Diepere toolflows blijven naar hun logische parent navigeren.

## User outcome

De gebruiker/admin kan via menu en topbar betrouwbaar door instellingen en admin tools bewegen zonder op een eerdere subpagina te blijven hangen.

## Functional slice

Een UI-only navigatiecontract met shared helper, unit-tests en consistente wiring in settings/admin/AIQS/meeting-capture routes.

## Entry / exit

- Entry: gebruiker opent het hoofdmenu vanuit Vandaag, settings-detail of admin-tool.
- Exit: `Instellingen` brengt naar `/settings`; back-acties brengen naar de juiste parent.

## Happy flow

1. Vanuit Vandaag opent menu → Instellingen het settings-overzicht.
2. Vanuit AIQS/adminrechten/regeneration opent menu → Instellingen ook het settings-overzicht.
3. Back vanuit first-level admin tool gaat naar `/settings`.
4. Back vanuit AIQS draft/validate/test gaat naar de logische AIQS parent.

## Non-happy flows

- Empty state: geen datalaag betrokken.
- Permission denied / unavailable: bestaande admin denial states blijven ongewijzigd.
- Validation / unsupported state: onbekende route valt terug op `/settings`.
- Failure / retry / cancel: geen nieuwe async flow.

## UX / copy

- Geen redesign.
- Admin access loading/error mag compacter en duidelijker worden, maar labels/routes blijven gelijk.
- Gebruik bestaande settings/admin scaffolds en menucomponent.

## Data / IO

- Input: huidige pathname of route-intentie.
- Output: deterministische route target of no-op.
- Opslag/API/service/file-impact: UI helper, menu, route schermen, unit-test.
- Statussen: niet van toepassing.

## Waarom nu

De huidige navigatie blokkeert betrouwbaar admingebruik en voelt alsof menu/instellingen kapot zijn.

## In scope

- Shared navigation helper.
- `FullscreenMenuOverlay` menucontract fix.
- Settings/admin/AIQS/meeting-capture back wiring.
- Expliciete `settings-admin-access` Stack registratie.
- Unit-tests en gerichte static verify.

## Buiten scope

- Geen backend/API/schema.
- Geen nieuwe routes.
- Geen flow-redesign of nieuwe adminfeatures.
- Geen consumer UI redesign buiten menu/instellingen navigatiegedrag.

## Oorspronkelijk plan / afgesproken scope

- Menu → Instellingen moet altijd settings home openen.
- First-level admin/settings back → settings home.
- Diepere toolflows → logische parent.
- Geen backend/datamodel/API wijziging.
- Bestaande routes/labels/rechtenchecks blijven.

## Expliciete user requirements / detailbehoud

- Bekijk navigatie via menu / instellingen.
- Los op dat klikken op instellingen naar de laatst openstaande lijkt te gaan.
- Loop hele navigatie via menu instellingen en admin tools na.
- Benader dit als User Experience expert.

## Status per requirement

- [x] Menu → Instellingen opent settings home — status: gebouwd
- [x] First-level settings/admin back naar settings home — status: gebouwd
- [x] AIQS diepe routes naar logische parent — status: gebouwd
- [x] Meeting capture diepe routes naar parent — status: gebouwd
- [x] Admin access route expliciet geregistreerd — status: gebouwd
- [x] Unit/static verify groen — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog geen.

## Uitvoerblokken / fasering

- [x] Blok 1: preflight, relevante context en taskflow bevestigen.
- [x] Blok 2: navigation helper + unit-tests.
- [x] Blok 3: menu/shell/screen wiring.
- [x] Blok 4: static verify en waar mogelijk runtime smoke.
- [ ] Blok 5: task/docs closeout.

## Concrete checklist

- [x] Helper `src/lib/navigation/settings-navigation.ts`.
- [x] Unit-test voor helper.
- [x] `FullscreenMenuOverlay` gebruikt settings target contract.
- [x] First-level settings/admin screens gebruiken settings-home back.
- [x] AIQS en meeting capture subroutes gebruiken parent back.
- [x] `settings-admin-access` in root Stack geregistreerd.

## Acceptance criteria

- [x] Vanuit settings/admin subroute doet menu → Instellingen niet langer no-op.
- [x] Vanuit first-level settings/admin back kom je op `/settings`.
- [x] Vanuit AIQS draft/test/validate kom je terug op detail/parent.
- [x] Tests en static checks zijn groen.

## Blockers / afhankelijkheden

- Runtime smoke is niet uitgevoerd omdat `http://localhost:8081` niet bereikbaar was (`ERR_CONNECTION_REFUSED`).

## Verify / bewijs

- `npm run test:unit -- settings-navigation` — groen.
- `npm run lint` — groen.
- `npm run typecheck` — groen.
- `npm run taskflow:verify` — groen.
- Browser smoke — niet uitgevoerd; lokale devserver was niet bereikbaar op `http://localhost:8081`.

## Reconciliation voor afronding

- Oorspronkelijk plan: settings/admin navigatiecontract fix.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: implementatie en verify.

## Relevante links

- `components/navigation/fullscreen-menu-overlay.tsx`
- `app/settings.tsx`
- `components/ui/admin-console-primitives.tsx`


## Commits

- 2026-06-08T11:32:51+02:00 — fix: stabilize settings admin navigation

- 2026-06-22T11:07:20+02:00 — feat(jarvis): add chat-first workspace command room

- 2026-06-22T11:41:43+02:00 — Adjust Codex model defaults for Budio

- 2026-06-23T12:13:19+02:00 — chore: snapshot local AIQS workspace state
```

---

## STITCH_API_KEY voor MCP activeren

- Path: `docs/project/25-tasks/open/stitch-api-key-voor-mcp-activeren.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: stitch-api-key-voor-mcp-activeren
title: STITCH_API_KEY voor MCP activeren
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: gebruiker
updated_at: 2026-04-25
summary: "De lokale `.env.local` krijgt de ontbrekende `STITCH_API_KEY`, zodat de Stitch MCP-config echt bruikbaar is wanneer Stitch nodig is."
tags: [mcp, stitch, local-dev, env]
workstream: plugin
due_date: null
sort_order: 3
---





## Probleem / context

De repo heeft al een geconfigureerde Stitch MCP-server in `.codex/config.toml`, maar `STITCH_API_KEY` ontbreekt nog lokaal in `.env.local`. Daardoor blijft Stitch beschikbaar als setup, maar niet volledig bruikbaar.

## Gewenste uitkomst

De lokale setup bevat een actieve `STITCH_API_KEY` in `.env.local`, zodat Stitch MCP later zonder extra handelingen gebruikt kan worden. De sleutel blijft buiten de repo en wordt niet in docs of output gelekt.

## Waarom nu

- Stitch is al onderdeel van de repo-local MCP-config.
- De nieuwe MacBook setup is bijna compleet; dit is één van de laatste ontbrekende local-dev variabelen.
- De key staat nog op de oude laptop en moet bewust overgezet worden.

## In scope

- `STITCH_API_KEY` veilig overnemen naar `.env.local`.
- Controleren dat de key niet in git of docs terechtkomt.
- Verifiëren dat de lokale env-parser en tooling de key zien.

## Buiten scope

- Andere MCP-servers toevoegen.
- Stitch workflow-inhoud wijzigen.
- Globale CLI-installaties.

## Concrete checklist

- [ ] `STITCH_API_KEY` veilig toevoegen aan `.env.local`.
- [ ] Bevestigen dat de key alleen lokaal aanwezig is.
- [ ] Relevante verify draaien.

## Blockers / afhankelijkheden

- De sleutel staat nog op de oude laptop en moet door de gebruiker worden overgenomen.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`
- Lokale env-check op aanwezigheid van `STITCH_API_KEY`

## Relevante links

- `.codex/config.toml`
- `docs/dev/stitch-workflow.md`


## Commits

- ad43300 — chore: commit all remaining local changes

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```

---

## Web runtime warnings styling accessibility hardening

- Path: `docs/project/25-tasks/open/web-runtime-warnings-styling-accessibility-hardening.md`
- Bucket: open
- Status: ready
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-05-15

```md
---
id: task-web-runtime-warnings-styling-accessibility-hardening
title: Web runtime warnings styling accessibility hardening
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-05-15
summary: "Los actuele web/runtime warnings op rond deprecated shadow props, aria-hidden focus-conflicten en deprecated pointerEvents props, zonder functionele redesigns of interactieregressies."
tags: [web, accessibility, polish, overlays, runtime]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: polish
spec_ready: true
due_date: null
sort_order: 1
---


## Probleem / context

De web/runtime console toont op dit moment concrete warnings rond styling-compatibiliteit en accessibility-gedrag. Het gaat niet om nieuwe features, maar om hardening van bestaande shared surfaces, overlays en detailflows.

De warnings wijzen op drie technische gaten:
- deprecated React Native web shadow props die op web nog doorlekken
- `aria-hidden` op verborgen lagen terwijl een gefocust descendant actief blijft
- deprecated `pointerEvents` usage als prop in plaats van via `style.pointerEvents`

Deze warnings maken de runtime minder schoon, kunnen op termijn compatibiliteitsproblemen geven en vergroten het risico op subtiele accessibility-regressies in momentdetail-, overlay- en navigatieflows.

## Gewenste uitkomst

De relevante web/runtime warnings zijn opgelost zonder zichtbare redesigns of nieuwe dependencies. Shared overlay- en surface-primitives gebruiken moderne compatibele props, en verborgen overlay-content veroorzaakt geen focusconflict meer.

De momentdetailflow, overlays, modals en bottom-nav blijven hetzelfde werken voor klik, touch, ESC/back en keyboard-focus, maar zonder de huidige console-waarschuwingen.

## User outcome

Gebruikers merken geen redesign, maar de webapp voelt technisch stabieler: overlays en detailschermen blijven correct toegankelijk en interactioneel betrouwbaar, ook met keyboard-focus op web.

## Functional slice

Een kleine hardening-slice: deprecated web props opsporen en moderniseren in bestaande shared components, accessibility-conflict bij verborgen overlays oplossen, daarna gerichte runtime-smoke op momentdetail- en overlayflows.

## Entry / exit

- Entry: gebruiker opent day detail, momentdetail en bestaande overlays/menu's/modals in de webapp.
- Exit: dezelfde flows werken nog steeds, maar de console toont geen warnings meer voor deprecated shadow props, `aria-hidden` focusconflict of deprecated `pointerEvents`.

## Happy flow

1. De relevante shared overlay-, backdrop-, navigation- en surface-componenten worden gevonden en aangepast zonder visuele redesign.
2. Deprecated shadow props worden op web vervangen door een compatibele `boxShadow`-richting, terwijl native gedrag intact blijft.
3. Overlay-hidden state behandelt focus correct en `pointerEvents` usage is web-compatibel, waarna runtime-smoke bevestigt dat console en interacties schoon blijven.

## Non-happy flows

- Empty state: niet van toepassing; deze taak gaat over bestaande runtime warnings.
- Permission denied / unavailable: als een specifieke browserwarning niet lokaal reproduceerbaar blijkt, vastleggen met concrete route/componentcontext in plaats van gokken.
- Validation / unsupported state: native-only style paths mogen behouden blijven zolang web een compatibele fallback krijgt.
- Failure / retry / cancel: als een fix een overlay- of focusregressie veroorzaakt, terugschalen naar de kleinste veilige shared fix in plaats van grotere architectuurwijzigingen.

## UX / copy

- Geen nieuwe user-facing copy.
- Geen redesign van overlays, momentdetail, navigatie of bottom tabs.
- Bestaande shared components en UI-structuur blijven leidend.

## Data / IO

- Input: bestaande shared UI components, overlay/backdrop primitives en detail surfaces die op web warnings veroorzaken.
- Output: schonere web/runtime zonder de drie actuele warningtypes.
- Opslag/API/service/file-impact: geen dataflow- of API-wijzigingen; alleen shared UI/runtime hardening.
- Statussen:
  - warnings gelokaliseerd
  - shadow-fix gebouwd
  - aria-hidden/focus-fix gebouwd
  - pointerEvents-fix gebouwd
  - runtime-smoke bevestigd

## Waarom nu

- De warnings zitten in actuele webflows rond momentdetail en overlays.
- Dit is goedkope technische hardening die toekomstige web- en accessibility-regressies voorkomt zonder productscope te verbreden.

## In scope

- Deprecated shadow prop usage op web opsporen en moderniseren.
- `aria-hidden` focusconflict op verborgen overlays/modals/menu's oplossen.
- Deprecated `pointerEvents` prop usage vervangen door `style.pointerEvents` waar relevant.
- Gerichte runtime-smoke op day detail, momentdetail, overlays/menu's/modals en keyboard-focus.

## Buiten scope

- Nieuwe dependencies of accessibility-library.
- Nieuwe overlayarchitectuur.
- Routing- of animatiesysteemwijzigingen.
- Visuele redesigns van surfaces, modals, menu's of bottom nav.
- Nieuwe feature- of flow-uitbreidingen.

## Oorspronkelijk plan / afgesproken scope

- Maak een aparte hardening/polish-taak voor de actuele console warnings.
- Los alleen de drie genoemde warningfamilies op.
- Houd gedrag en vormgeving zoveel mogelijk gelijk, behalve waar accessibility-correctheid een kleine gedragsfix vereist.

## Expliciete user requirements / detailbehoud

1. Geen redesign.
2. Geen nieuwe dependencies.
3. Geen gedragswijzigingen tenzij nodig voor accessibility-correctheid.
4. Shadow warning oplossen via moderne compatibele oplossing zoals `boxShadow`, zonder native te breken.
5. `aria-hidden` focus warning correct oplossen volgens web accessibility best practices.
6. Geen keyboard trap of focusverliesbug introduceren.
7. `pointerEvents` als deprecated prop vervangen zonder click/touch regressies.
8. Overlays, backdrops, bottom nav en capture/menu flows moeten werkend blijven.
9. Runtime-smoke moet expliciet keyboard-focus en open/sluit gedrag op web meenemen.

## Status per requirement

- [ ] Deprecated shadow prop paths zijn gelokaliseerd en opgelost — status: niet gebouwd
- [ ] `aria-hidden` focusconflict is opgelost zonder accessibility-regressie — status: niet gebouwd
- [ ] Deprecated `pointerEvents` prop usage is vervangen — status: niet gebouwd
- [ ] Gerichte web/runtime-smoke bevestigt schone console en werkende interacties — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Nog leeg.

## Uitvoerblokken / fasering

- [ ] Blok 1: warningbronnen en relevante shared components lokaliseren.
- [ ] Blok 2: kleinste shared hardening-fixes uitvoeren.
- [ ] Blok 3: runtime-smoke, verify en docs/task-afronding.

## Concrete checklist

- [ ] Shadow-props op web doorzoeken en compatibele oplossing kiezen.
- [ ] Overlay/focus-conflict rond `aria-hidden` reproduceren en fixen.
- [ ] `pointerEvents` prop-usage doorzoeken en vervangen.
- [ ] Day detail, momentdetail en overlayflows op web smoke-testen.
- [ ] Lint/typecheck/taskflow/docs verify afronden.

## Acceptance criteria

- [ ] Console toont geen warning meer voor deprecated shadow props.
- [ ] Console toont geen `aria-hidden` focus warning meer bij overlay/menu/modal gebruik.
- [ ] Console toont geen warning meer voor deprecated `pointerEvents` prop usage.
- [ ] Overlays en detailflows blijven klikbaar, focusbaar en visueel ongewijzigd binnen normale tolerantie.

## Blockers / afhankelijkheden

- Geen externe blockers verwacht; afhankelijk van lokale web reproduceerbaarheid van de warnings.

## Verify / bewijs

- `npm run lint`
- `npm run typecheck`
- `npm run taskflow:verify`
- Runtime smoke:
  1. open day detail
  2. open momentdetail
  3. open/sluit overlays/menu's/modals
  4. gebruik keyboard focus op web
  5. bevestig geen shadow/aria-hidden/pointerEvents warnings
  6. bevestig klik/touch/focus/ESC/back/bottom-nav gedrag
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: actuele web/runtime warnings oplossen zonder redesigns.
- Toegevoegde verbeteringen: nog te bepalen tijdens uitvoering.
- Afgerond: nog te bepalen.
- Open / blocked: nog te bepalen.

## Relevante links

- `docs/project/open-points.md`
- `components/navigation/fullscreen-menu-overlay.tsx`
- `components/ui/modal-backdrop.tsx`
- `components/ui/detail-screen-primitives.tsx`


## Commits

- 2026-05-15T08:59:28+02:00 — feat: ship historical moment capture polish
```
