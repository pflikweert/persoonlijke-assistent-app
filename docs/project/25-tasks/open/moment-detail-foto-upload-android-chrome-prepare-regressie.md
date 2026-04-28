---
id: task-moment-detail-foto-upload-android-chrome-prepare-regressie
title: Moment detail foto-upload Android Chrome prepare regressie
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: user-request
updated_at: 2026-04-29
summary: "De follow-up task staat nu bovenaan `in_progress` en hardt de web prepare-flow verder: blob/file-achtige picker-bronnen worden explicieter gevalideerd, `upload_prepare` logt coarse runtime/picker context en gerichte unit-tests plus verify zijn groen. Handmatige Android productie-smoke blijft bewust open als laatste toestelbewijs."
tags: [moment-detail, photos, android, chrome, production, regression, diagnostics]
workstream: app
epic_id: null
parent_task_id: task-moment-detail-foto-upload-productieflakiness-onderzoek
depends_on: []
follows_after: [task-moment-detail-foto-upload-productieflakiness-onderzoek]
task_kind: task
spec_ready: true
due_date: null
sort_order: 1
---


## Probleem / context

Op `2026-04-28` trad opnieuw een productiebug op bij foto toevoegen aan een bestaand moment via Android Chrome en de Google Photos / Android photo picker. Desktop Chrome werkt in dezelfde flow wel.

De afgeronde task `docs/project/25-tasks/done/moment-detail-foto-upload-productieflakiness-onderzoek.md` heeft de prepare-fase eerder gehard en productie-smoke bevestigd, maar liet expliciet open welke exacte `upload_prepare`-substap op een echt Android toestel faalde. Die onbevestigde nuance is nu de kern van deze regressie-follow-up.

## Gewenste uitkomst

De moment detail foto-upload op Android Chrome faalt niet meer op fragiele web picker-assets. Als de prepare-fase toch stukloopt, logt de flow bronvast welke substap faalde en welke coarse picker/runtime-context daarbij hoorde, zonder gevoelige data of raw image data vast te leggen.

De follow-up blijft klein: alleen de bestaande gallery-flow, prepare-diagnostiek en gerichte tests worden aangescherpt. De eerdere done-task blijft afgerond en dient als historische basis, niet als stil heropende task.

## User outcome

Een gebruiker kan op Android Chrome weer betrouwbaar een foto toevoegen aan een bestaand moment, ook wanneer de picker een Google Photos of andere web-backed asset levert.

## Functional slice

Eén afgebakende regressieslice: exacte `upload_prepare`-substap diagnostisch onderscheiden, web-picker input robuuster voorbereiden, user-facing foutcopy rustig houden en gerichte testdekking toevoegen.

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

- User-facing foutcopy blijft rustig en ongewijzigd: `Foto voorbereiden mislukte.`
- Bestaande state block `Foto's zijn nu niet beschikbaar` blijft het surface-level error frame.
- Geen redesign van gallery, picker of moment detail UI.

## Data / IO

- Input: picker asset met `uri`, `mimeType`, `fileName`, `fileSize`, dimensies en optioneel web `file`/blob-achtige bron.
- Output: display/thumb bytes plus prepare-diagnostiek met `prepareStep`, picker bronclassificatie, uri-scheme, extension, filesize-bucket en coarse runtime context.
- Opslag/API/service-impact: primair `components/journal/entry-photo-gallery.tsx` en `src/lib/entry-photo-gallery/flow.ts`; `services/entry-photos.ts` alleen bij bewezen noodzaak.
- Statussen: bestaande faseclassificatie blijft gelijk; alleen diagnostische details binnen `upload_prepare` worden verbreed.

## Waarom nu

- De regressie is productie-relevant en treft een bestaande MVP-flow op Android.
- De vorige task loste de flakiness deels op, maar liet precies dit Android prepare-detail onbevestigd open.
- Zonder bronvaste substapdiagnostiek blijft diagnose hangen tussen web picker-input, manipulator en byte-reading.

## In scope

- Nieuwe follow-up task aanmaken en koppelen aan de relevante done-tasks.
- Prepare diagnostics uitbreiden met veilige coarse metadata en vaste log-prefix.
- Kleine hardening voor web picker-assets in de bestaande gallery-flow.
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
- Bouw alleen een kleine prepare-hardening als de oorzaak of waarschijnlijke oorzaak duidelijk is.
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
- [x] Exacte `upload_prepare`-substap bronvast onderscheiden op Android/web picker-assets — status: in code aanwezig maar nog user-review nodig
- [x] Veilige coarse prepare diagnostics toegevoegd — status: gebouwd
- [x] Kleine web picker hardening gebouwd zonder gallery/service redesign — status: gebouwd
- [x] Gerichte unit-tests voor Android/web picker edge cases toegevoegd — status: gebouwd
- [x] Verify gedraaid en handmatige Android smoke expliciet open gelaten — status: gebouwd

## Toegevoegde verbeteringen tijdens uitvoering

- `upload_prepare` logt nu met vaste prefix `[entry-photo:prepare]` een coarse diagnostisch pakket met `flowId`, prepare-substep, picker bronclassificatie, uri-scheme, mime, extension, filesize-bucket, browser/OS-context en `hasServiceWorkerController`.
- Web prepare accepteert nu ook blob/file-achtige picker-bronnen via `arrayBuffer()` in plaats van alleen `instanceof File`.
- De prepare-flow valideert nu explicieter op ontbrekende bron, zero-size assets en unsupported/ontbrekende image-typen voordat image manipulation start.
- Web byte-reading decodeert indien mogelijk direct uit `base64` of `data:` URIs zodat `fetch(result.uri)` niet langer het enige pad is.

## Uitvoerblokken / fasering

- [x] Blok 1: taskflow en regressiecontext vastleggen.
- [x] Blok 2: prepare diagnostics en kleine hardening implementeren.
- [x] Blok 3: gerichte tests, verify en taskfile-updates afronden.

## Concrete checklist

- [x] Taskfile aangemaakt en bovenaan `in_progress` lane gezet.
- [x] Prepare diagnostics/helpers uitgebreid met web picker context.
- [x] Gallery prepare-flow gehard voor file/blob-achtige web assets.
- [x] Unit-tests uitgebreid voor prepare-step en picker edge cases.
- [x] Verify en taskflow/docs scripts gedraaid.
- [x] Taskfile bijgewerkt met diagnose, fix en open handmatige smoke.

## Acceptance criteria

- [x] `upload_prepare` errors onderscheiden minimaal de relevante substap of validatiefout op web/Android picker-input.
- [x] Productie-veilige prepare logging bevat geen raw image data, maar wel voldoende picker/runtime-context om Android regressies bronvast te maken.
- [x] Web picker-assets met bruikbare file/blob bron vertrouwen niet meer blind op URI-only gedrag.
- [x] User-facing foutcopy blijft rustig en gallery-scope blijft ongewijzigd.
- [x] Gerichte unit-tests en verify zijn groen; handmatige Android smoke staat expliciet nog open als bewijsstap.

## Blockers / afhankelijkheden

- Handmatige Android productie-smoke op echt toestel blijft afhankelijk van user/device-toegang.
- Geen andere blockers bekend bij start.

## Verify / bewijs

- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run test:unit -- tests/unit/entry-photo-gallery-flow.test.ts`
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`
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
- `bevestigd`: de web prepare-flow vertrouwde nog te veel op twee fragiele aannames tegelijk:
  - web picker-bronnen moesten netjes door een `instanceof File` guard vallen
  - byte-reading kon uiteindelijk terugvallen op `fetch(result.uri)` als impliciet herstelpad
- `bevestigd`: de eerdere task had al `display_*` en `thumb_*` substappen, maar onderscheidde nog niet expliciet vroege picker-validatiefouten zoals ontbrekende bron, zero-size of unsupported type.
- `onbevestigd`: de exacte echte productie-substap op het Android toestel van `2026-04-28` blijft zonder nieuwe toestel-smoke/logcapture nog onbewezen; de code logt die substap nu wel bronvaster zodra de flow opnieuw wordt doorlopen.

## Fix

- `src/lib/entry-photo-gallery/flow.ts`
  - nieuwe pure helpers voor uri-scheme, extension, filesize-bucket, picker source kind, prepare-step classificatie en coarse runtime diagnostics
  - `EntryPhotoErrorDiagnostics` uitgebreid met prepare/runtimevelden voor veilige bronvaste logging
- `components/journal/entry-photo-gallery.tsx`
  - web prepare accepteert nu blob/file-achtige picker-bronnen via `arrayBuffer()` als primaire bron
  - expliciete validatie toegevoegd voor missing source, zero-size en unsupported/ontbrekende image types
  - prepare-fouten krijgen nu coarse picker/runtime-diagnostics en worden gelogd onder `[entry-photo:prepare]`
  - web byte-reading decodeert waar mogelijk direct uit `base64` of `data:` URIs
- `tests/unit/entry-photo-gallery-flow.test.ts`
  - helpertests toegevoegd voor blob/file-like Android web assets, uri-only/missing source, filesize-buckets en prepare-step classificatie

## Reconciliation voor afronding

- Oorspronkelijk plan: nieuwe regressie-follow-up task, bronvaste prepare-diagnostiek, kleine web-picker hardening en gerichte tests.
- Toegevoegde verbeteringen: prepare-logging kreeg ook coarse runtime/build-context (`browser`, `OS`, `hasServiceWorkerController`) zodat stale-bundle vermoedens later sneller uitgesloten kunnen worden.
- Afgerond:
  - nieuwe follow-up task en lane-sortering
  - prepare diagnostics/helpers
  - web picker hardening
  - gerichte unit-tests
  - lint, typecheck, taskflow en docs verify
- Open / blocked:
  - handmatige Android productie-smoke op echt toestel
  - bevestiging welke prepare-substap in echte productie nu optreedt of juist niet meer optreedt

## Relevante links

- `docs/project/25-tasks/done/moment-detail-foto-upload-productieflakiness-onderzoek.md`
- `docs/project/25-tasks/done/moment-entry-fotos-galerij-beveiligde-upload.md`
- `components/journal/entry-photo-gallery.tsx`
- `src/lib/entry-photo-gallery/flow.ts`


## Commits

- 2026-04-29T01:47:27+02:00 — fix: diagnose Android photo prepare regression