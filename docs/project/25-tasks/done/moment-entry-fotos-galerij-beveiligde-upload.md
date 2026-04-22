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
