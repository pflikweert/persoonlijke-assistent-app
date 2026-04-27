---
id: task-admin-founder-meeting-capture-scope-en-eerste-versie-vastleggen
title: Admin/founder meeting capture — scope en eerste versie vastleggen
status: backlog
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
sort_order: 2
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

- [ ] V1-scope vastgelegd — status: niet gebouwd
- [ ] Privacy/consent richting vastgelegd — status: niet gebouwd
- [ ] Anti-scope-creep vastgelegd — status: niet gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- Geen.

## Uitvoerblokken / fasering

- [ ] Blok 1: Meeting Capture bronnen en relevante app/docs patronen herlezen.
- [ ] Blok 2: scopebesluit en copy/UI guardrails vastleggen.
- [ ] Blok 3: verify en taskstatus afronden.

## Concrete checklist

- [ ] Bronnen samenvatten tot v1-scope.
- [ ] Privacy/consent randvoorwaarden vastleggen.
- [ ] Buiten-scope lijst expliciet maken.
- [ ] Relevante vervolg-tasks controleren op juiste priority/dependencies.

## Acceptance criteria

- [ ] V1-scope benoemt audio-safe opname als eerste waarde.
- [ ] Bestaande dagboekcapture blijft expliciet onaangeraakt.
- [ ] P1 taskfiles bevatten UX/copy en non-happy flow details.
- [ ] P2 extra's blijven niet-blokkerend.

## Blockers / afhankelijkheden

- Depends on `task-admin-founder-meeting-capture-epic-en-taakpakket-aanmaken`.

## Verify / bewijs

- `npm run taskflow:verify`
- `npm run docs:bundle`
- `npm run docs:bundle:verify`

## Reconciliation voor afronding

- Oorspronkelijk plan: scope en v1-grenzen vastleggen.
- Toegevoegde verbeteringen: nog geen.
- Afgerond: nog niet.
- Open / blocked: wacht op uitvoering.

## Relevante links

- `docs/project/24-epics/admin-founder-meeting-capture.md`
- `docs/project/40-ideas/10-product/admin-founder-meeting-capture.md`


## Commits

- a258f95 — feat: harden planning specs and meeting capture tasks