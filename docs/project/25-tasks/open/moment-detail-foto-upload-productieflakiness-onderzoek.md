---
id: task-moment-detail-foto-upload-productieflakiness-onderzoek
title: Moment detail foto-upload productieflakiness onderzoeken
status: in_progress
phase: transitiemaand-consumer-beta
priority: p1
source: split-from-task-moment-detail-foto-reorder-productiebug-herstel
updated_at: 2026-04-27
summary: "Client-side prepare-step voor moment detail foto-upload is aangescherpt voor Android/web picker-assets. Codepad bevestigt `upload_prepare` als zichtbare faalfase; productie browser/Vercel-evidence in deze sessie blijft nog blocked."
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
- [ ] Browser-console en network capture voor uploadflow verzamelen.
- [x] Zichtbare fout gekoppeld aan bevestigde fase `upload_prepare` via codepad naar `buildPreparedImageAsset(...)`.
- [x] Concrete fix geïmplementeerd in de prepare-stap voor web/Android picker-assets.
- [ ] Productie opnieuw testen tot upload werkt.
- [~] Taskfile bijgewerkt met bevestigde oorzaak, fix en verify; productie browser/Vercel-evidence nog blocked.

## Blockers / afhankelijkheden

- Vereist de bestaande productie testaccount en een bruikbare fixture-entry.
- Vereist read-only diagnose van Supabase/Vercel naast browser capture.
- In deze sessie is read-only productie-evidence nog niet volledig ontsloten:
  - Supabase MCP-logtoegang lijkt lokaal te blijven en leverde geen productie-uploadspoor rond `2026-04-27 10:08` NL-tijd.
  - `gh auth status` is ongeldig en er is geen werkende `vercel` CLI bevestigd, waardoor Vercel runtime-context nog `blocked` is.

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
- Browser/Supabase/Vercel productie-evidence in dezelfde sessie — status: gedeeltelijk; codepad bevestigd, productie browser/Vercel-spoor nog blocked.
- Verify (`lint`, `typecheck`, tests, taskflow, docs bundle`) — status: grotendeels gebouwd; gallery smoke draaide maar skipte zonder lokale fixture-env.
- Productie-herrepro na fix — status: nog niet gebouwd / blocked door ontbrekende directe productie-run in deze sessie.

## Toegevoegde verbeteringen tijdens uitvoering

- Web-prepare gebruikt nu, wanneer beschikbaar, het picker-`File` object als betrouwbaardere bron voor image manipulation in plaats van blind te vertrouwen op alleen de picker-URI.
- Web leest gemanipuleerde image-bytes bij voorkeur via `base64` output van `expo-image-manipulator`, zodat `fetch(result.uri)` geen single point of failure meer is.
- `upload_prepare` diagnostics bewaren nu ook picker-context zoals URI-scheme, mime-type, bestandsnaam, bestandsgrootte, `hasFile` en de interne prepare-substap.

## Verify / bewijs

- ⏳ Productie upload-repro met browser console + network capture
- ⚠️ Relevante Supabase-sporen per uploadfase: blocked in deze sessie; beschikbare MCP-logroute leek lokaal en toonde geen productie-uploadspoor rond `2026-04-27 10:08` NL-tijd
- ✅ `npm run lint`
- ✅ `npm run typecheck`
- ✅ `npm run test:unit -- tests/unit/entry-photo-gallery-flow.test.ts`
- ✅ `npm run test:unit`
- ⚠️ `npm run test:e2e:gallery:smoke` draaide, maar skipte zonder `GALLERY_E2E_ENTRY_URL` / `GALLERY_E2E_PHOTO_IDS`
- ✅ `npm run taskflow:verify`
- ✅ `npm run docs:bundle`
- ✅ `npm run docs:bundle:verify`

## Bevestigde oorzaak / diagnose

- `bevestigd`: de zichtbare foutcopy `Foto voorbereiden mislukte.` kan alleen worden gezet vanuit `createEntryPhotoPhaseError("upload_prepare", ...)` in `components/journal/entry-photo-gallery.tsx`.
- `bevestigd`: de fout ligt daarom vóór `upload_display`, `upload_thumb`, `upload_insert` en `upload_post_refresh`.
- `bevestigd`: de prepare-stap vertrouwde volledig op een URI-only pad voor `ImageManipulator.manipulateAsync(...)` plus een latere `fetch(result.uri).arrayBuffer()`.
- `bevestigd`: dat pad is kwetsbaar voor Android/web picker-assets, vooral wanneer Chrome/Google Photos een web `File` levert maar de URI-route zelf fragiel blijft.
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

## Reconciliation voor afronding

- Oorspronkelijk plan: bevestig faalfase, implementeer de kleinste robuuste fix, voeg gericht bewijs toe en herverifieer.
- Afgerond in deze sessie:
  - zichtbare fout gekoppeld aan `upload_prepare`
  - prepare-step hardening voor web/Android picker-assets gebouwd
  - lint, unit-tests, typecheck, taskflow en docs-bundle checks bevestigd
  - task-bewijslaag aangevuld met oorzaak, fix en blockades
- Later toegevoegd:
  - extra prepare-diagnostiek met picker-metadata en substap-label
- Nog open / blocked:
  - echte productie browser console + network capture na fix
  - Vercel runtime-context voor dezelfde productiesessie
  - bevestigde Supabase productie-logsporen in plaats van lokale MCP-sporen
  - resterende verify-stappen (`lint`, bredere tests, taskflow, docs bundle checks)
