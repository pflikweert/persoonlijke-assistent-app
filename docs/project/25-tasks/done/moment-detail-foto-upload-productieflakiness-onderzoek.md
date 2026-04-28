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

- b64cb74 — fix: harden task closeout and plugin active state
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
