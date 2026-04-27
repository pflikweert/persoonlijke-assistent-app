# DO NOT EDIT - GENERATED FILE

# Budio Current Tasks

Build Timestamp (UTC): 2026-04-27T18:34:34.232Z
Source Commit: b64cb74

Doel: uploadbundle met huidige niet-done tasks uit `docs/project/25-tasks/open/**`.
Dit bestand is niet leidend; de handmatig onderhouden bronbestanden blijven leidend.

## Brondirectories
- docs/project/25-tasks/open/**

## Telling
- Totaal tasks opgenomen: 31

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
sort_order: 3
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
sort_order: 3
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
sort_order: 14
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
sort_order: 10
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
sort_order: 8
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
sort_order: 13
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
sort_order: 5
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
sort_order: 6
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
sort_order: 4
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
sort_order: 7
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
sort_order: 15
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
sort_order: 12
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
sort_order: 11
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
```

---

## Admin/founder meeting capture — web route en IA

- Path: `docs/project/25-tasks/open/admin-founder-meeting-capture-web-route-en-ia.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-admin-founder-meeting-capture-web-route-en-ia
title: Admin/founder meeting capture — web route en IA
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-27
summary: "Bouw de admin-only Meeting Capture ingang, routes en basis-IA zonder de bestaande dagboekcapture te verbreden."
tags: [meeting-capture, ui, navigation, admin]
workstream: app
epic_id: epic-admin-founder-meeting-capture
parent_task_id: null
depends_on: [task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen]
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---



# Admin/founder meeting capture — web route en IA

## Probleem / context

Meeting Capture heeft een eigen plek nodig, maar mag de bestaande Today/capture/dagboekroute niet zwaarder maken.

## Gewenste uitkomst

Er is een admin-only ingang naar een Meeting Capture overzicht, een nieuwe-opname route en een detailroute. Niet-admin gebruikers zien deze ingang niet. De UI gebruikt bestaande screen scaffolds, headers, modal/backdrop en rustige Budio-layoutpatronen.

## User outcome

Een admin kan Meeting Capture openen, het lege archief begrijpen en doorklikken naar een nieuwe gespreksopname of bestaande detailpagina.

## Functional slice

Admin-only route- en schermskelet voor overview, new recording en detail, zonder recorder/storage.

## Entry / exit

- Entry: admin/settings of interne admin navigatie.
- Exit: admin staat op overview, new recording shell of detail shell; niet-admin ziet geen ingang.

## Happy flow

1. Admin opent de admin-only Meeting Capture ingang.
2. Overview toont titel `Gespreksopnames` en lege staat als er nog geen opnames zijn.
3. Admin kiest `Start opname`.
4. App navigeert naar de nieuwe-opname route.
5. Detailroute kan een placeholder/status tonen voor een gekozen recording.

## Non-happy flows

- Niet-admin: ingang verborgen of route toont bestaande unauthorized/admin-only state.
- Geen recordings: empty state met korte uitleg en primaire actie.
- Routeparameter ontbreekt: detail toont veilige not-found/terug state.
- Data laden mislukt: rustige error met `Probeer opnieuw`.

## UX / copy

- Overview title: `Gespreksopnames`.
- Empty state: `Nog geen gespreksopnames.` en `Neem een lang gesprek op buiten je dagboekflow.`
- Primary action: `Start opname`.
- Admin-only copy: hergebruik bestaande admin/permission copy.

## Data / IO

- Input: admin auth state en toekomstige recording list.
- Output: routes/screen shells en navigation wiring.
- Geen DB/storage writes in deze taak.

## Waarom nu

- Deze IA is de basis voor opname, recovery en playback.

## In scope

- Admin-only route/ingang.
- Overzicht empty state.
- Navigatie naar nieuwe opname en detail.
- Layout/copy volgens bestaande capture/moment/dag/selectie/header/footer patronen.

## Buiten scope

- Recording engine.
- Storage/upload.
- Transcriptie of insights.

## Oorspronkelijk plan / afgesproken scope

- Nieuwe admin/founder lane, niet op Today als primaire capture-CTA.
- Geen redesign; bestaande Budio UI-taal volgen.

## Expliciete user requirements / detailbehoud

- Bestaande captureflow niet aanraken.
- Shared components slim hergebruiken.
- Copy simpel houden.

## Status per requirement

- [ ] Admin-only ingang — status: niet gebouwd
- [ ] Overzicht/nieuw/detail routes — status: niet gebouwd
- [ ] UI volgt bestaande patronen — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Scope-dependency is afgerond als aparte done-task voordat route/IA bouw startte.

## Uitvoerblokken / fasering

- [x] Blok 1: bestaande admin/settings/capture routepatronen lezen.
- [x] Blok 2: kleinste route + schermskelet bouwen.
- [ ] Blok 3: lint/typecheck en light/dark smoke. Lint/typecheck/docs zijn groen; runtime smoke is blocked omdat `http://localhost:8081` geen verbinding accepteert.

## Concrete checklist

- [x] Relevante route- en admin-gating patronen lokaliseren.
- [x] Admin-only ingang toevoegen.
- [x] Overzicht empty state bouwen.
- [x] Nieuwe-opname en detailroute shell toevoegen.
- [ ] Runtime check in light/dark — blocked: lokale web devserver draait niet of accepteert geen verbinding op `http://localhost:8081`.

## Acceptance criteria

- [x] Admin-only ingang werkt in code via settings-ingang en route-level access gate.
- [x] Niet-admin kan de flow niet bereiken via route-level access gate.
- [x] Empty state en primary action zijn zichtbaar.
- [x] Nieuwe-opname en detail shells volgen bestaande layoutpatronen.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen`.

## Verify / bewijs

- `npm run lint` — geslaagd
- `npm run typecheck` — geslaagd
- `npm run taskflow:verify` — geslaagd
- `npm run docs:bundle` — geslaagd
- `npm run docs:bundle:verify` — geslaagd
- Gerichte web smoke in light/dark — nog open
- Browser smoke poging: `http://localhost:8081/meeting-capture` gaf `net::ERR_CONNECTION_REFUSED`.

## Reconciliation voor afronding

- Oorspronkelijk plan: web route en IA toevoegen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: routegroep, overview, new shell, detail shell, settings-ingang en access gate zijn gebouwd.
- Open / blocked: runtime smoke in light/dark zodra de lokale web devserver draait.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence
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
sort_order: 9
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
```

---

## AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

- Path: `docs/project/25-tasks/open/aiqs-admin-interface-thema-herontwerp-spotify-openai-stijl.md`
- Bucket: open
- Status: backlog
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-20

```md
---
id: task-aiqs-admin-interface-thema-herontwerp
title: AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)
status: backlog
phase: transitiemaand-consumer-beta
priority: p2
source: docs/project/open-points.md
updated_at: 2026-04-20
summary: "Geef AIQS admin een helderder en strakker eigen thema, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools, met goede bruikbaarheid op telefoon en desktop."
tags: [aiqs, admin-ui, thema, design]
workstream: aiqs
due_date: null
sort_order: 6
---












# AIQS admin-interface thema herontwerp (Spotify/OpenAI stijl)

## Probleem / context

De huidige AIQS admin-interface werkt functioneel, maar voelt nog te complex en mist een heldere, strakke admin-uitstraling.
Voor dagelijkse tuning op mobiel en desktop is een duidelijker en consistenter admin-thema gewenst.

## Gewenste uitkomst

AIQS admin krijgt een eigen, heldere en strakke visuele stijl binnen Budio, geïnspireerd door Spotify Creator Tool en OpenAI admin-tools.
De interface ondersteunt prettig gebruik op telefoon én desktop/fullscreen, zonder de bestaande AIQS-governance of datastromen functioneel te verbreden.

## Waarom nu

- Deze stap maakt de tool sneller en prettiger inzetbaar na livegang van de huidige AIQS-variant.
- Het verlaagt frictie bij testen, beoordelen en tunen van prompts/calls.

## In scope

- Visuele/thematische herwerking van AIQS admin-gedeelte.
- Strakkere informatiehiërarchie en duidelijkere states/controls in adminschermen.
- Goede mode-aware uitwerking voor mobiel en desktop/fullscreen.
- Doorvertaling via bestaande shared UI-primitives waar passend.

## Buiten scope

- Nieuwe OpenAI-calls of uitbreiding van AIQS functionele scope.
- Nieuwe review- of evaluatieprocessen buiten bestaande flows.
- End-user themawijzigingen buiten admin-context.

## Concrete checklist

- [ ] Designrichting en referentieprincipes concretiseren voor AIQS admin.
- [ ] Belangrijkste AIQS adminschermen herstijlen met duidelijke hiërarchie.
- [ ] Mobiel + desktop/fullscreen gebruik valideren in light en dark mode.
- [ ] Regressiecheck op bestaande AIQS functionaliteit en admin-guardrails.
- [ ] Final polish + bewijs vastleggen tegen designrefs/acceptatie.

## Blockers / afhankelijkheden

- Bij voorkeur pas uitvoeren nadat loggingvalidatie + productie-livepad stabiel zijn.
- Afstemming met bestaande UI-guardrails en AIQS admin-only principes.

## Verify / bewijs

- Runtime/smoke-check AIQS admin in light en dark mode.
- Desktop/fullscreen + mobiel gebruikscheck met screenshots/bewijs.
- `npm run lint`
- `npm run typecheck`

## Relevante links

- `docs/project/ai-quality-studio.md`
- `docs/design/mvp-design-spec-1.2.1.md`
- `design_refs/1.2.1/ethos_ivory/DESIGN.md`
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
sort_order: 6
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
```

---

## AIQS productie live zetten voor bestaande OpenAI-calls

- Path: `docs/project/25-tasks/open/aiqs-productie-live-zetten-bestaande-openai-calls.md`
- Bucket: open
- Status: backlog
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-22

```md
---
id: task-aiqs-productie-live-zetten-bestaande-openai-calls
title: AIQS productie live zetten voor bestaande OpenAI-calls
status: backlog
phase: transitiemaand-consumer-beta
priority: p1
source: docs/project/open-points.md
updated_at: 2026-04-22
summary: "Zet de huidige AIQS-variant snel en gecontroleerd live in productie voor alleen de bestaande OpenAI-calls, zonder nieuwe reviewflow of extra calls toe te voegen."
tags: [aiqs, productie, openai, consumer-beta]
workstream: aiqs
due_date: null
sort_order: 2
---













# AIQS productie live zetten voor bestaande OpenAI-calls

## Probleem / context

De huidige AIQS-variant is functioneel bruikbaar, maar de productiedoelstelling is nog niet expliciet als taak verankerd: AIQS moet in productie werken voor de bestaande OpenAI-calls, zonder scope-uitbreiding.
Er is nadrukkelijk geen behoefte om nu de geplande bredere reviewflow te bouwen.

## Gewenste uitkomst

De bestaande AIQS-adminflow werkt betrouwbaar in productie voor de huidige OpenAI-calls.
Er worden geen nieuwe calls toegevoegd en geen nieuwe reviewproceslaag gebouwd binnen deze taak.

Deze taak is klaar wanneer de productieroute aantoonbaar werkt en de minimale operationele checks zijn vastgelegd om live testen mogelijk te maken.

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

- [ ] Productiepad van bestaande AIQS-calls checken op end-to-end werking.
- [ ] Eventuele blockers in config/guardrails oplossen zonder scope-uitbreiding.
- [ ] Bevestigen dat admin-only toegang in productie correct gehandhaafd blijft.
- [ ] Bewijs vastleggen dat de huidige calls live werken zoals verwacht.
- [ ] Korte operationele go-live notitie vastleggen voor vervolgtesten.

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
sort_order: 9
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
sort_order: 1
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
```

---

## Docs folderstructuur en visual language herbeoordelen na metadatafase

- Path: `docs/project/25-tasks/open/docs-folderstructuur-en-visual-language-herbeoordeling-na-metadatafase.md`
- Bucket: open
- Status: blocked
- Priority: p3
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-docs-folderstructuur-visual-language-herbeoordeling
title: Docs folderstructuur en visual language herbeoordelen na metadatafase
status: blocked
phase: transitiemaand-consumer-beta
priority: p3
source: docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md
updated_at: 2026-04-25
summary: "Beoordeel pas na de metadata- en bundlingfase of een bredere docs-foldermigratie of verdere visual-language uitbouw echt nodig is."
tags: [docs, structure, metadata, visual-language]
workstream: idea
due_date: null
sort_order: 1
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

- [ ] Blok 1: dependency-resultaat lezen.
- [ ] Blok 2: docs-routing en metadata-effect beoordelen.
- [ ] Blok 3: advies vastleggen en eventuele vervolgtaak/idee maken.

## Concrete checklist

- [ ] Dependency is afgerond en verplaatst naar `done/`.
- [ ] Beoordeling van folderstructuur is vastgelegd.
- [ ] Beoordeling van visual-language gebruik is vastgelegd.
- [ ] Eventuele vervolgactie is expliciet klein gehouden.

## Blockers / afhankelijkheden

- Geblokkeerd op: `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`

## Verify / bewijs

- `npm run taskflow:verify`
- Indien docs gewijzigd worden: `npm run docs:lint`, `npm run docs:bundle`, `npm run docs:bundle:verify`

## Relevante links

- `docs/project/25-tasks/done/docs-ux-audience-taxonomie-en-uploadbundels.md`
- `docs/project/README.md`
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
sort_order: 11
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
```

---

## Entry photo gallery volledige end-user E2E flows

- Path: `docs/project/25-tasks/open/entry-photo-gallery-volledige-end-user-e2e-flows.md`
- Bucket: open
- Status: ready
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-26

```md
---
id: task-entry-photo-gallery-volledige-end-user-e2e-flows
title: Entry photo gallery volledige end-user E2E flows
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-26
summary: "Breid de nieuwe gallery-smoke basis uit naar een volledige end-user E2E-suite voor toevoegen, verwijderen, max-limiet, viewer, reorder en unhappy/error flows."
tags: [qa, tests, gallery, photos, e2e]
workstream: app
due_date: null
sort_order: 2
---







## Probleem / context

De eerste gallery QA-basis bewijst de kerninteractie voor thumbnail-reorder en legt unit/smoke-infra neer. De volledige end-user dekking voor alle gallery-flows bestaat nog niet.

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
```

---

## Moments-overzicht primaire foto thumbnail en viewer

- Path: `docs/project/25-tasks/open/moments-overzicht-primaire-foto-thumbnail-en-viewer.md`
- Bucket: open
- Status: blocked
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-25

```md
---
id: task-moments-overzicht-primaire-foto-thumbnail-en-viewer
title: Moments-overzicht primaire foto thumbnail en viewer
status: blocked
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-25
summary: "Toon in het gedeelde moments-overzicht een primaire foto-thumb op maximale breedte binnen de bestaande tijdkolom, verfijn de viewer naar een media-first lightbox en herstel werkende navigatie via web drag-swipe, pijlen en gedeelde gesture-ownership."
tags: [moments-overzicht, photos, ui, viewer]
workstream: app
due_date: null
sort_order: 1
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

## Blockers / afhankelijkheden

- Geen externe blockers; vereist alleen bestaande auth- en fotoservices.

## Review-notitie

- Lokale desktop-Chrome swipe met de muis in de fullscreen foto-popup werkt nog niet betrouwbaar; navigatie via de pijliconen werkt wel.
- Deze task staat daarom bewust op `blocked` voor latere productiecheck i.p.v. als opgelost/done.
- Gewenste vervolgrichting na review:
  - slimmer zoomen
  - foto kunnen slepen/pannen wanneer ingezoomd
  - inzoomen rond finger/cursor focuspunt in plaats van standaard naar het midden

## Verify / bewijs

- ✅ `npm run test:unit`
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ Extra unit-tests voor viewer swipe-state en web touch-action helper
- ⚠️ Lokale mouse-swipe in desktop Chrome nog niet bevestigd als werkend; arrows werken wel
- ⚠️ Nog geen gerichte overview-smoke/spec voor deze nieuwe interactieve flow; daarom nu vastgelegd als open QA-gap i.p.v. stilzwijgend bewezen
- ✅ `npm run taskflow:verify`

## Relevante links

- `components/journal/moments-timeline-section.tsx`
- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
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
sort_order: 10
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
sort_order: 2
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
```

---

## Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering

- Path: `docs/project/25-tasks/open/origineel-plan-integriteit-borgen-tijdens-agent-uitvoering.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-origineel-plan-integriteit-borgen-tijdens-agent-uitvoering
title: Oorspronkelijk plan en planintegriteit borgen tijdens agent-uitvoering
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-04-27
summary: "Borg repo-breed dat een goedgekeurd oorspronkelijk plan én expliciete user-requirement-details tijdens uitvoering niet stilzwijgend vervagen of vervangen worden, en dat aanvullingen expliciet worden gelogd totdat een reconciliation is gedaan. Deze hardening benoemt nu ook expliciet het verschil tussen taskstatus, pluginselectie en echte actieve agentmetadata, plus de closeout-regel dat `done` geen `active_agent*` context meer mag dragen."
tags: [workflow, tasks, governance, planning, agents]
workstream: plugin
due_date: null
sort_order: 2
---



## Probleem / context

Tijdens agent-uitvoering ontstaat soms drift tussen het oorspronkelijke goedgekeurde plan en de actuele uitvoerfocus. Zodra er tijdens bouwen correcties, regressies of polish-rondes bijkomen, verschuift de aandacht naar het laatste subprobleem. Daardoor kan een agent ten onrechte denken dat het werk "klaar" is, terwijl onderdelen uit het oorspronkelijke plan nog open staan.

De repo borgt al taskflow en status-sync, maar nog niet hard genoeg:

- de integriteit van het oorspronkelijke plan als stabiel referentiepunt gedurende de hele uitvoerfase
- de retentie van expliciete user-details en requirement-niveau beslissingen die later nog relevant zijn voor uitvoering of review

## Gewenste uitkomst

De repo-taskflow borgt voortaan expliciet dat een goedgekeurd oorspronkelijk plan of afgesproken scope tijdens uitvoering stabiel blijft, tenzij de eindgebruiker expliciet om wijziging van die hoofdscope vraagt.

Tussentijdse verbeteringen, correcties of regressiefixes worden voortaan niet gezien als vervanging van het oorspronkelijke plan, maar als aanvullingen binnen dezelfde taak of als expliciete nieuwe subscope. Expliciete user-requirements met latere uitvoer- of reviewwaarde blijven zichtbaar in de taskfile als detail-lijst en verdwijnen niet in alleen een samenvatting.

Voor afronding is een verplichte reconciliation nodig tussen: oorspronkelijk plan, expliciete user-requirements, later toegevoegde verbeteringen en nog open werk.

## Waarom nu

- Dit probleem raakt repo-breed meerdere agentflows, niet alleen pluginwerk.
- De gebruiker wil niet opnieuw hoeven bewaken dat het oorspronkelijke plan tijdens bouwen behouden blijft.
- De bestaande taskflow is al sterk; dit is een gerichte volgende stap om plan-drift structureel te voorkomen.

## In scope

- Nieuwe repo-brede guardrails voor planintegriteit én requirement-detail-retentie toevoegen in `AGENTS.md`.
- Workflowdocs uitbreiden met expliciete regels voor oorspronkelijk plan, expliciete user-requirements, aanvullingen tijdens uitvoering en reconciliation voor afronding.
- `task-status-sync-workflow` uitbreiden zodat niet alleen task-status maar ook plan-status en requirement-status gesynchroniseerd blijven.
- Task-template uitbreiden zodat niet-triviale taken ruimte hebben voor oorspronkelijke scope, expliciete user-requirements, aanvullingen tijdens uitvoering en reconciliation.
- Agent-closeout semantiek expliciet maken: `done` betekent ook geen `active_agent*` metadata meer en `Actief` in de plugin-UI mag nooit alleen selectie aanduiden.

## Buiten scope

- Nieuwe productfeatures of UI-wijzigingen buiten workflow/documentatie.
- Grote redesign van de volledige tasklaag of nieuwe verify-tooling tenzij strikt nodig.
- Wijzigen van canonieke productscope of planning buiten deze workflowafspraken.

## Uitvoerblokken / fasering

- [x] Blok 1: workflowgap bevestigen en bestaande guardrails targeten.
- [x] Blok 2: AGENTS, workflowdocs, skill en task-template aanscherpen voor planintegriteit.
- [x] Blok 3: verify draaien en taskflow/docs synchroon afronden.

## Concrete checklist

- [x] Nieuwe workflowtask aangemaakt en bovenaan `in_progress` geplaatst.
- [x] `AGENTS.md` uitgebreid met harde regels voor planintegriteit tijdens uitvoering.
- [x] `docs/dev/task-lifecycle-workflow.md` uitgebreid met oorspronkelijke-plan + aanvullingen + reconciliation-structuur.
- [x] `docs/dev/cline-workflow.md` uitgebreid met uitvoerregels tegen plan-drift.
- [x] `.agents/skills/task-status-sync-workflow/SKILL.md` aangescherpt met plan-sync guardrails.
- [x] `docs/project/25-tasks/_template.md` uitgebreid met planintegriteit-secties voor niet-triviale taken.
- [x] Requirement-detail-retentie expliciet toevoegen in AGENTS/docs/skill/template, zodat user-details niet verloren gaan in summaries.
- [x] Repo-regels verder aanscherpen zodat een bestaand uitgebreid bronplan in een taskfile letterlijk of nagenoeg letterlijk behouden blijft wanneer de gebruiker om detailbehoud vraagt.
- [x] Closeout-regels aangescherpt: `done` = file in `done/`, reconciliation aanwezig, verify/bundling gedaan en geen `active_agent*` metadata meer.
- [x] Anti-drift semantiek toegevoegd voor verschil tussen taskstatus, pluginselectie en echte actieve agentactiviteit.
- [x] Verify uitgevoerd (`taskflow`, docs bundle, docs bundle verify).

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging is repo-brede workflowgovernance.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Relevante links

- `AGENTS.md`
- `docs/dev/cline-workflow.md`
- `docs/dev/task-lifecycle-workflow.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `docs/project/25-tasks/_template.md`

## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence
```

---

## Plan Mode task auto-create bij ontbrekende match

- Path: `docs/project/25-tasks/open/plan-mode-task-auto-create-bij-ontbrekende-match.md`
- Bucket: open
- Status: in_progress
- Priority: p1
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-24

```md
---
id: task-plan-mode-task-auto-create-bij-ontbrekende-match
title: Plan Mode task auto-create bij ontbrekende match
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: AGENTS.md
updated_at: 2026-04-24
summary: "Draai de repo-brede Plan Mode taskflowregel om zodat agents bij een duidelijke nieuwe scope automatisch een task aanmaken, en alleen bij echte classificatie- of scope-twijfel nog vragen."
tags: [workflow, tasks, plan-mode, docs]
workstream: app
due_date: null
sort_order: 4
---



## Probleem / context

De huidige repo-regel blokkeert inhoudelijk werk in Plan Mode wanneer er geen passende bestaande taskfile is. Daardoor moet de gebruiker alsnog expliciet buiten Plan Mode een task laten aanmaken, ook als de nieuwe scope al duidelijk is.

Dat vertraagt normale agentflows en botst met de gewenste default: bij duidelijke nieuwe scope hoort Plan Mode zelf een task aan te maken en direct door te kunnen plannen.

## Gewenste uitkomst

Plan Mode werkt voortaan met een goedkope en consistente preflight:

- eerst zoeken naar een passende bestaande task
- bij duidelijke match die task gebruiken
- bij duidelijke nieuwe scope automatisch een nieuwe task aanmaken
- alleen bij echte classificatie-, lane- of scope-twijfel nog expliciet vragen

Deze regel staat daarna repo-breed gelijk in AGENTS, skills en workflowdocs, zodat alle agents dezelfde verwachting volgen.

## Waarom nu

- De huidige Plan Mode-regel blokkeerde direct een nieuwe, heldere overview-feature.
- De gebruiker wil dat task-aanmaak niet langer buiten Plan Mode vastloopt.
- Dit is een repo-brede workflowverbetering die toekomstige agentsessies direct sneller en consistenter maakt.

## In scope

- Nieuwe workflowtask aanmaken en bovenaan de `in_progress` lane zetten.
- Plan Mode-regel omzetten in `AGENTS.md`, taskflow-skill en workflowdocs.
- Beslislogica expliciet maken: bestaande match gebruiken, anders auto-create, alleen bij twijfel vragen.
- `Taskflow summary`-uitleg aanpassen zodat een automatisch aangemaakte task toegestaan is.
- Controleren dat `taskflow:verify` niet leunt op de oude blokkaderegel.

## Buiten scope

- Nieuwe productfeatures of UI-wijzigingen buiten deze workflowregel.
- Aanpassingen aan statusmodel, done-flow of docs-bundle-beleid buiten wat nodig is voor deze regel.
- Nieuwe verify-scripts tenzij bestaande verify aantoonbaar op de oude regel leunt.

## Concrete checklist

- [x] Workflowtask aangemaakt en lane-sortering bijgewerkt.
- [x] `AGENTS.md` aangepast naar Plan Mode auto-create default.
- [x] `.agents/skills/task-status-sync-workflow/SKILL.md` aangepast.
- [x] `docs/dev/task-lifecycle-workflow.md` aangepast.
- [x] `docs/dev/cline-workflow.md` aangepast.
- [x] Verify-laag gecontroleerd en geen extra codewijziging nodig bevonden.
- [x] `npm run taskflow:verify` uitgevoerd.
- [x] `npm run docs:bundle` uitgevoerd.
- [x] `npm run docs:bundle:verify` uitgevoerd.

## Blockers / afhankelijkheden

- Geen functionele blockers; wijziging zit in workflowdocs en tasklaag.

## Verify / bewijs

- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Relevante links

- `AGENTS.md`
- `.agents/skills/task-status-sync-workflow/SKILL.md`
- `docs/dev/task-lifecycle-workflow.md`
- `docs/dev/cline-workflow.md`
- `scripts/docs/verify-taskflow-enforcement.mjs`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks

- 8c8e11b — docs: record task commit evidence
```

---

## Budio Workspace activity-bar opent list view zonder workspace-menu

- Path: `docs/project/25-tasks/open/plugin-activitybar-opent-list-view-zonder-workspace-menu.md`
- Bucket: open
- Status: in_progress
- Priority: p2
- Phase: transitiemaand-consumer-beta
- Updated_at: 2026-04-27

```md
---
id: task-plugin-activitybar-opent-list-view-zonder-workspace-menu
title: Budio Workspace activity-bar opent list view zonder workspace-menu
status: in_progress
phase: transitiemaand-consumer-beta
priority: p2
source: user-request
updated_at: 2026-04-27
summary: "Het Budio Workspace activity-bar icoon opent direct de bestaande pluginwindow in list view, maar de task is verbreed naar een structurele herziening van task-openen, detail-rendering, drag/sort interacties, actieve-agent zichtbaarheid, commit logging en multi-agent robuustheid. Laatste sessiestatus: fullscreen toggle werkt, maar task-openen/tonen en drag/sort in board + list zijn nog niet opgelost; daarnaast opende klikken op willekeurige tasks onterecht steeds dezelfde geselecteerde kaart. In deze ronde is wel geborgd dat plugin-UI `Actief` niet langer gebruikt voor selectie en dat done-transities actieve agentmetadata opschonen."
tags: [plugin, vscode, list-view, activity-bar]
workstream: plugin
due_date: null
sort_order: 5
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
- commit hash + subject loggen in `## Commits`

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

## Status per requirement

- [x] `review` status toegevoegd — status: gebouwd.

- [~] Manual sorting regels voor actieve taken bovenaan binnen hun status — status: gedeeltelijk / niet bevestigd als generieke repo-regel.
- [x] `Due` vervangen door `Last change` — status: gebouwd.
- [x] Checklist compacter met gedeelde progress-chip / kleurbanden — status: gebouwd.
- [x] `onlyOpen` default / open taken filter — status: gebouwd; nu alleen zichtbaar en toegepast in list view.
- [x] Linker rail icon-first — status: gebouwd, met nog open visuele bevestiging voor refresh-sizing.
- [x] Resizable detail pane — status: gebouwd.
- [~] Fullscreen detail toggle — status: opnieuw in uitvoering; eerdere claim was te vroeg, structurele herbouw loopt nu in fase 1.
- [~] Actieve agent indicator in board/list/detail — status: gedeeltelijk; basisweergave aanwezig, animatie en consistente detail-state ontbreken nog.
- [x] Selectie wordt niet meer als `Actief` gelabeld — status: gebouwd; plugin gebruikt nu expliciet `Geselecteerd` voor selectie en bewaart agentbadges voor echte agentactiviteit.
- [~] Agent metadata opslaan in task-md — status: gedeeltelijk; frontmattermodel aanwezig, activity-/commit-secties ontbreken nog.
- [ ] `## Commits` automatisch vullen — status: nog niet gebouwd.
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
  - Nog geen bewijs dat nieuwe commits automatisch naar relevante taskfiles worden gelogd.
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
summary: "Implementeer een minimale production service-status laag die Supabase status-webhooks vertaalt naar een rustige banner en tijdelijke write-lock voor relevante Budio-flows."
tags: [supabase, production, incidents, reliability, ux]
workstream: app
epic_id: null
parent_task_id: null
depends_on: []
follows_after: []
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
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
sort_order: 2
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
```
