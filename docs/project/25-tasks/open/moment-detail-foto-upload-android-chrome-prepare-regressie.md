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
sort_order: 2
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