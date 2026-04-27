---
id: task-moment-detail-foto-upload-productieflakiness-onderzoek
title: Moment detail foto-upload productieflakiness onderzoeken
status: ready
phase: transitiemaand-consumer-beta
priority: p1
source: split-from-task-moment-detail-foto-reorder-productiebug-herstel
updated_at: 2026-04-26
summary: "Onderzoek en herstel de resterende productieflakiness in moment detail foto-upload, met bronvaste repro, fasegerichte foutanalyse en bevestigde oorzaak in browser/Supabase-spoor."
tags: [moment-detail, photos, production, upload, diagnostics]
workstream: app
due_date: null
sort_order: 1
---





## Probleem / context

De reorder-productiebug is hersteld, maar de foto-upload op moment detail is nog niet apart bronvast onderzocht. In productie werkt upload soms wel en soms niet, zonder dat de exacte faalfase al bevestigd is.

De bestaande gallery-flow heeft inmiddels fasegerichte foutclassificatie (`upload_prepare`, `upload_display`, `upload_thumb`, `upload_insert`, `upload_post_refresh`), maar de echte productieoorzaak per fase is nog onbekend.

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

- [ ] Nieuwe productie upload-repro vastleggen met datum/tijd, route, account en entry-id.
- [ ] Browser-console en network capture voor uploadflow verzamelen.
- [ ] Uploadfout koppelen aan één bevestigde fase (`upload_prepare`, `upload_display`, `upload_thumb`, `upload_insert` of `upload_post_refresh`).
- [ ] Concrete fix implementeren.
- [ ] Productie opnieuw testen tot upload werkt.
- [ ] Taskfile en runbook bijwerken met bevestigde oorzaak en verify.

## Blockers / afhankelijkheden

- Vereist de bestaande productie testaccount en een bruikbare fixture-entry.
- Vereist read-only diagnose van Supabase/Vercel naast browser capture.

## Verify / bewijs

- ⏳ Productie upload-repro met browser console + network capture
- ⏳ Relevante Supabase-sporen per uploadfase
- ⏳ `npm run lint`
- ⏳ `npm run typecheck`
- ⏳ Relevante gallery smoke/testbewijzen
- ⏳ `npm run taskflow:verify`
- ⏳ `npm run docs:bundle`
- ⏳ `npm run docs:bundle:verify`

## Relevante links

- `components/journal/entry-photo-gallery.tsx`
- `services/entry-photos.ts`
- `src/lib/entry-photo-gallery/flow.ts`
- `docs/dev/production-bug-investigation-workflow.md`
- `docs/project/25-tasks/done/moment-detail-foto-reorder-productiebug-herstel.md`


## Commits

- ad43300 — chore: commit all remaining local changes